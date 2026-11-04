const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {gzipSync,gunzipSync}=require('node:zlib');
test('Overtime receipt survives retry and prevents spending twice independently of balance changes',async()=>{
 const records=new Map();let spends=0;
 const ref=path=>({path,collection:name=>({doc:id=>ref(path+'/'+name+'/'+id)})});
 const tx={get:async r=>({exists:records.has(r.path),data:()=>records.get(r.path)}),set:(r,value)=>records.set(r.path,value)};
 const exports={},db={doc:ref,runTransaction:async fn=>fn(tx)};
 const execute=(state,action)=>{state||={overtimePoints:92};if(action==='overtime'){spends++;state.overtimePoints--;}return {state,view:{state,...(action==='overtime'?{overtimeApplied:true}:{})}};};
 const requireStub=name=>{
  if(name==='firebase-functions/v2/https')return {onCall:(_options,fn)=>fn,HttpsError:class extends Error{}};
  if(name==='firebase-admin/app')return {initializeApp(){}};
  if(name==='firebase-admin/firestore')return {getFirestore:()=>db,Timestamp:{fromMillis:value=>value}};
  if(name==='node:zlib')return {gzipSync,gunzipSync};
  if(name==='./engine.cjs')return {execute};
  if(name==='./response-cache.cjs')return {compactResponse:view=>view};
  if(name==='./event-store.cjs')return {readEventContext:async()=>({persist(){}}),refreshRanking(){}};
  throw Error(name);
 };
 vm.runInNewContext(fs.readFileSync(require.resolve('../functions/src/index.cjs'),'utf8'),{exports,require:requireStub,Date,console});
 const request={auth:{uid:'test'},data:{action:'overtime',payload:{id:'p',amount:1},requestId:'overtime-retry-000001'}};
 assert.equal((await exports.game(request)).overtimeApplied,true);
 assert.equal(records.get('players/test/commands/overtime-retry-000001').overtimeApplied,true);
 const saved=records.get('players/test'),state=JSON.parse(gunzipSync(saved.snapshot));state.overtimePoints=99;saved.snapshot=gzipSync(JSON.stringify(state));
 const retried=await exports.game(request);assert.equal(retried.overtimeApplied,true);assert.equal(retried.state.overtimePoints,99);assert.equal(spends,1);
});
