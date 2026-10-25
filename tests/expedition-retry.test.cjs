const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {gzipSync,gunzipSync}=require('node:zlib');
const {execute}=require('../functions/src/engine.cjs');
test('A retried allocation cannot spend twice and still persists newly settled expedition arrivals',async()=>{
 let clock=1800000000000;
 const initial=execute(null,'start',{id:'hamburg'},clock,()=>.5).state;initial.expansion.available=1;
 const records=new Map([['players/test',{snapshot:gzipSync(JSON.stringify(initial))}]]);
 const ref=path=>({path,collection:name=>({doc:id=>ref(path+'/'+name+'/'+id)})});
 const tx={get:async r=>({exists:records.has(r.path),data:()=>records.get(r.path)}),set:(r,value)=>records.set(r.path,value)};
 const db={doc:ref,runTransaction:async fn=>fn(tx)},exports={};
 class Clock extends Date{static now(){return clock;}}
 const requireStub=name=>{
  if(name==='firebase-functions/v2/https')return {onCall:(_options,fn)=>fn,HttpsError:class extends Error{constructor(code,message){super(message);this.code=code;}}};
  if(name==='firebase-admin/app')return {initializeApp(){}};
  if(name==='firebase-admin/firestore')return {getFirestore:()=>db,Timestamp:{fromMillis:value=>value}};
  if(name==='node:zlib')return {gzipSync,gunzipSync};
  if(name==='./engine.cjs')return {execute};
  if(name==='./event-store.cjs')return {readEventContext:async()=>({persist(){}}),refreshRanking(){}};
  throw Error(name);
 };
 vm.runInNewContext(fs.readFileSync(require.resolve('../functions/src/index.cjs'),'utf8'),{exports,require:requireStub,Date:Clock,console});
 const request={auth:{uid:'test'},data:{action:'expansionAllocate',payload:{expedition:0,overtime:1,points:1},requestId:'allocation-retry-000001'}};
 let result=await exports.game(request);assert.equal(result.expansionAllocationApplied,true);assert.equal(result.expansion.available,0);assert.equal(result.state.overtimeCapacity,101);
 const saved=records.get('players/test'),state=JSON.parse(gunzipSync(saved.snapshot));
 state.expedition.regions[0].discovered=1;
 state.expedition.missions.push({id:1,region:0,place:0,kind:'delivery',status:'active',startedAt:clock,endsAt:clock+15000,truckId:state.trucks[0].id});
 saved.snapshot=gzipSync(JSON.stringify(state));clock+=15000;
 result=await exports.game(request);
 const persisted=JSON.parse(gunzipSync(records.get('players/test').snapshot));
 assert.equal(result.expansionAllocationApplied,true);assert.equal(result.expansion.available,1);assert.equal(persisted.expansion.available,1);
 assert.equal(persisted.expansion.overtime,1);assert.equal(persisted.expansion.notices.length,1);
 assert.equal(persisted.expedition.regions[0].deliveries[0],true);
});
