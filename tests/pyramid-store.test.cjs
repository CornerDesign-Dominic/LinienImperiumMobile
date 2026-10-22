'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {gzipSync,gunzipSync}=require('node:zlib');
const engine=require('../functions/src/engine.cjs'),store=require('../functions/src/event-store.cjs');
const {EVENT_ID:id,DAY}=require('../functions/src/events.cjs');
const T=1800000000000;
// In-memory transaction boundary, including queries, read-before-write checks,
// rollback and receipts. The same callable used by production runs unchanged.
function server(){
 let at=T,sequence=0,discardNext=false;const records=new Map();
 function ref(p){return {path:p,collection:name=>collection(p+'/'+name)};}
 function collection(p){return {doc:key=>ref(p+'/'+key),orderBy:(_field,_direction)=>({query:p,limit:n=>({query:p,limit:n})})};}
 const db={doc:ref,runTransaction:async work=>{
  const writes=new Map();
  const tx={get:async r=>{assert.equal(writes.size,0,'Firestore reads must precede writes');if(r.query){const docs=[...records].filter(([key])=>key.startsWith(r.query+'/')&&!key.slice(r.query.length+1).includes('/')).sort((a,b)=>b[1].delivered-a[1].delivered||a[0].localeCompare(b[0])).slice(0,r.limit||50).map(([key,data])=>({id:key.split('/').at(-1),data:()=>structuredClone(data)}));return {docs};}return {exists:records.has(r.path),data:()=>structuredClone(records.get(r.path))};},set:(r,value)=>writes.set(r.path,structuredClone(value))};
  const result=await work(tx);if(discardNext){discardNext=false;return db.runTransaction(work);}for(const [key,value]of writes)records.set(key,value);return result;
 }};
 class Clock extends Date{constructor(...args){super(...(args.length?args:[at]));}static now(){return at;}}
 const fakeRequire=name=>{
  if(name==='firebase-functions/v2/https')return {onCall:(_o,handler)=>handler,HttpsError:class extends Error{constructor(code,message){super(message);this.code=code;}}};
  if(name==='firebase-admin/app')return {initializeApp(){}};
  if(name==='firebase-admin/firestore')return {getFirestore:()=>db,Timestamp:{fromMillis:value=>value}};
  if(name==='./engine.cjs')return {execute:(state,action,payload,now,_random,context)=>engine.execute(state,action,payload,now,()=>.5,context)};
  if(name==='./event-store.cjs')return store;
  if(name==='node:zlib')return {gzipSync,gunzipSync};throw Error(name);
 };
 const context=vm.createContext({exports:{},require:fakeRequire,console,Date:Clock,Buffer,Math});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../functions/src/index.cjs'),'utf8'),context);
 const call=(uid,action='sync',payload={},requestId='pyramid-test-command-'+(++sequence))=>context.exports.game({auth:{uid},data:{action,payload,requestId}});
 const saved=uid=>JSON.parse(gunzipSync(records.get('players/'+uid).snapshot));
 async function found(uid){await call(uid,'foundCompany',{companyName:'Firma '+uid,cityName:'Steinhafen'});await call(uid,'seat',{id:'navigator',template:0,seat:0});}
 return {records,call,saved,found,retryNext:()=>{discardNext=true;},time:value=>{at=value;},world:()=>records.get('communityEvents/pyramid')};
}
test('Shared registration counts accounts once, survives reset and locks configuration after 48 hours',async()=>{
 const s=server();await s.found('a');await s.found('b');
 const first=await s.call('a','eventRegister');assert.equal(first.testEvents[0].registration.registered,1);
 await s.call('a','eventRegister');assert.equal(s.world().registered,1);
 await s.call('b','eventRegister');assert.equal(s.world().registered,2);
 await s.call('a','reset');await s.found('a');await s.call('a','eventRegister');assert.equal(s.world().registered,2);
 s.time(T+2*DAY);const joined=await s.call('a','eventJoin',{target:1,distance:1});assert.equal(joined.testEvents[0].target,1e6);assert.equal(joined.testEvents[0].distance,180);
 const locked=structuredClone(s.world().config);await assert.rejects(s.call('b','eventRegister'),/geschlossen/);assert.deepEqual(s.world().config,locked);
});
test('Callable atomically aggregates two players and retries spending and claiming without double rewards',async()=>{
 const s=server();for(const uid of ['a','b']){await s.found(uid);await s.call(uid,'eventRegister');}
 s.time(T+2*DAY);
 for(const uid of ['a','b']){await s.call(uid,'eventJoin');await s.call(uid,'eventFleet',{id,run:1,template:0});}
 for(const uid of ['a','b']){const record=s.records.get('players/'+uid),state=s.saved(uid);state.expedition.characters.r1_rare={level:1,progress:0};state.expedition.seats[1]='r1_rare';record.snapshot=gzipSync(JSON.stringify(state));await s.call(uid);}
 const requestId='pyramid-overtime-dedup-0001';
 const first=await s.call('a','eventOvertime',{id,run:1,amount:100},requestId);const second=await s.call('a','eventOvertime',{id,run:1,amount:100},requestId);
 assert.equal(first.testEvents[0].project.delivered,second.testEvents[0].project.delivered);assert.equal(s.saved('a').overtimePoints,0);
 await s.call('b','eventOvertime',{id,run:1,amount:50});
 const view=await s.call('a','eventRanks');assert.ok(Math.abs(s.world().total-150000/180)<1e-7);assert.equal(view.testEvents[0].rankings[0].name,'Firma a');assert.equal(view.testEvents[0].rankings[1].name,'Firma b');
 // Advance to the first stage using real elapsed fleet production.
 s.time(T+6*DAY);await s.call('a');await s.call('b');const before=s.saved('a').inventory;
 const claimId='pyramid-community-claim-0001';const claimed=await s.call('a','eventClaim',{id,run:1,kind:'community'},claimId);
 assert.ok(claimed.testEvents[0].pass.communityClaimed>0);const after=structuredClone(s.saved('a').inventory);assert.notDeepEqual(after,before);
 await s.call('a','eventClaim',{id,run:1,kind:'community'},claimId);assert.deepEqual(s.saved('a').inventory,after);
 await assert.rejects(s.call('a','eventClaim',{id,run:1,kind:'community'}),/Keine neuen/);
});
test('An invalid shared command rolls back player, aggregate, registration and receipt writes',async()=>{
 const s=server();await s.found('a');await s.call('a','eventRegister');s.time(T+2*DAY);await s.call('a','eventJoin');await s.call('a','eventFleet',{id,run:1,template:0});
 const before=structuredClone([...s.records]);await assert.rejects(s.call('a','eventOvertime',{id,run:1,amount:101}),/Überstundenpunkte/);assert.deepEqual([...s.records],before);
});
test('Real pass placeholder and claimed steps survive reset without granting a second card',async()=>{
 const s=server();await s.found('a');await s.call('a','eventRegister');s.time(T+2*DAY);await s.call('a','eventJoin');await s.call('a','eventFleet',{id,run:1,template:0});
 // Boundary fixture avoids hundreds of unrelated play commands.
 const p=s.records.get('players/a'),state=s.saved('a'),pass=state.eventTests[id].pass;
 pass.expedition=50;pass.overtime=100;pass.loginDays=[0,1];state.eventTests[id].project.delivered=1000;p.snapshot=gzipSync(JSON.stringify(state));
 await s.call('a','eventClaim',{id,run:1,kind:'pass'});assert.equal(s.saved('a').eventCards.pyramidLegendary,1);
 await s.call('a','reset');await s.found('a');await s.call('a','eventJoin');
 await assert.rejects(s.call('a','eventClaim',{id,run:1,kind:'pass'}),/Keine neuen/);assert.equal(s.saved('a').eventCards,undefined);
});
test('Leaderboard ties share ranks and a contributor below the top 50 receives no invented exact rank',()=>{
 const context={world:{total:200},reported:1,rankingLoaded:true,ranking:Array.from({length:50},(_,i)=>({uid:String(i).padStart(3,'0'),name:'Firma '+i,delivered:100-i,own:false}))};
 let view={testEvents:[{mode:'community',target:1000}]};store.refreshRanking(view,context,'z',{profile:{companyName:'Du'}});assert.equal(view.testEvents[0].rankings.at(-1).rank,null);
 context.ranking[1].delivered=100;context.reported=101;view={testEvents:[{mode:'community',target:1000}]};store.refreshRanking(view,context,'z',{profile:{companyName:'Du'}});assert.deepEqual(view.testEvents[0].rankings.slice(0,3).map(r=>r.rank),[1,2,2]);
});

test('A retried Firestore transaction counts registration and spending only once',async()=>{
 const s=server();await s.found('a');s.retryNext();await s.call('a','eventRegister');assert.equal(s.world().registered,1);
 s.time(T+2*DAY);await s.call('a','eventJoin');await s.call('a','eventFleet',{id,run:1,template:0});
 s.retryNext();await s.call('a','eventOvertime',{id,run:1,amount:10});assert.equal(s.saved('a').overtimePoints,90);assert.ok(Math.abs(s.world().total-10000/180)<1e-8);
});
test('Equivalent overtime amounts tie regardless of batching or floating-point accumulation',async()=>{
 const s=server();for(const uid of ['a','b']){await s.found(uid);await s.call(uid,'eventRegister');}
 s.time(T+2*DAY);for(const uid of ['a','b']){await s.call(uid,'eventJoin');await s.call(uid,'eventFleet',{id,run:1,template:0});}
 await s.call('a','eventOvertime',{id,run:1,amount:20});
 for(let i=0;i<20;i++)await s.call('b','eventOvertime',{id,run:1,amount:1});
 const result=await s.call('a','eventRanks');assert.deepEqual(Array.from(result.testEvents[0].rankings,r=>r.rank),[1,1]);
 assert.equal(result.testEvents[0].rankings[0].delivered,result.testEvents[0].rankings[1].delivered);
});
