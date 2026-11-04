const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {gzipSync,gunzipSync}=require('node:zlib');
const {execute}=require('../functions/src/engine.cjs');
const {projectClaimSummary}=require('../src/projectSections');
const T=1800000000000,random=()=>.5;
const cmd=(s,a='sync',p={},at=T)=>execute(s,a,p,at,random),order=r=>r.state.orders.find(o=>o.id==='DEFERRED');
const round=n=>Math.round(n*100)/100;
function setup(kind='special'){
 let r=cmd(null,'start',{id:'hamburg'});
 r.state.expedition.seats=['navigator',null,null,null,null];r.state.overtimePoints=1000;
 const base=r.state.orders[0];r.state.orders=[{...base,id:'DEFERRED',kind,status:'queued',category:'national',customer:null,volume:200,baseVolume:200,distance:120,routeType:'single',delivered:0,deadlineMs:86400000,projectName:'Testprojekt'}];
 return cmd(r.state,'projectStart',{id:'DEFERRED',template:0});
}
function finish(r){return cmd(r.state,'sync',{},r.view.state.orders.find(o=>o.id==='DEFERRED').eta);}
test('Passive project deliveries defer freight and XP, charge costs and pay everything once only on claim',()=>{
 const start=setup(),coins=start.state.coins,xp=start.state.xp;
 const at=order(start).project.vehicles.find(v=>v.cargo).nextAt,partial=cmd(start.state,'sync',{},at);
 assert.ok(order(partial).delivered>0);assert.ok(order(partial).deferredTransport.revenue>0);
 assert.equal(partial.state.coins,round(coins-partial.state.stats.operatingCosts));assert.equal(partial.state.xp,xp);assert.equal(partial.state.stats.grossRevenue,0);assert.equal(partial.view.levelUps,undefined);
 const done=finish(partial),o=order(done),earned=o.deferredTransport;
 assert.equal(o.status,'completed');assert.equal(done.state.xp,xp);assert.equal(done.state.coins,round(coins-done.state.stats.operatingCosts));
 assert.equal(o.completionReward.totalCoins,round(earned.revenue+o.completionReward.coins));
 const claimed=cmd(done.state,'claim',{id:o.id},o.completedAt),reward=order(claimed).completionReward;
 assert.equal(claimed.state.coins,round(done.state.coins+reward.totalCoins));assert.equal(claimed.state.xp,round(xp+earned.xp));
 assert.equal(claimed.state.stats.grossRevenue,earned.revenue);assert.equal(claimed.state.stats.contractBonusRevenue,reward.coins);
 assert.equal(claimed.view.claimSummary.coins,reward.totalCoins);assert.equal(claimed.view.claimSummary.xp,earned.xp);
 const again=cmd(claimed.state,'claim',{id:o.id},o.completedAt);
 assert.equal(again.state.coins,claimed.state.coins);assert.equal(again.state.xp,claimed.state.xp);assert.equal(again.view.claimSummary,undefined);
 const summary=projectClaimSummary(done.view.state.orders,claimed.view.state.orders,o.id);assert.equal(summary.coins,reward.totalCoins);assert.equal(summary.xp,earned.xp);
});
test('Overtime and passive portions share the same deferred ledger with no early level-up or duplicate fractional booking',()=>{
 let r=setup();const coins=r.state.coins,xp=r.state.xp,points=r.state.overtimePoints;
 r=cmd(r.state,'overtime',{id:'DEFERRED',amount:5});
 assert.equal(r.state.overtimePoints,points-5);assert.ok(order(r).deferredTransport.xp>0);assert.equal(r.state.xp,xp);assert.equal(r.view.levelUps,undefined);
 const pending=structuredClone(order(r).deferredTransport),synced=cmd(r.state);
 assert.deepEqual(order(synced).deferredTransport,pending);
 r=cmd(synced.state,'overtime',{id:'DEFERRED',amount:1000});assert.equal(order(r).status,'completed');assert.equal(r.state.xp,xp);
 assert.equal(r.state.coins,round(coins-r.state.stats.operatingCosts));
 const claimed=cmd(r.state,'claim',{id:'DEFERRED'});assert.equal(claimed.state.xp,order(r).deferredTransport.xp);
 assert.ok(claimed.view.levelUps?.length>0);assert.equal(claimed.view.claimSummary.xp,order(r).deferredTransport.xp);
});
test('Failed and expired projects cannot credit their accumulated earnings or XP',()=>{
 const r=setup(),at=order(r).project.vehicles.find(v=>v.cargo).nextAt;
 order(r).project.deadlineAt=at+1;const failed=cmd(r.state,'sync',{},at+1);
 assert.equal(order(failed).status,'failed');assert.ok(order(failed).deferredTransport.revenue>0);assert.equal(failed.state.xp,r.state.xp);
 const claim=cmd(failed.state,'claim',{id:'DEFERRED'},at+1);assert.equal(claim.state.coins,failed.state.coins);assert.equal(claim.state.xp,failed.state.xp);assert.equal(claim.view.claimSummary,undefined);
});
test('Legacy active projects retain already paid fractions and only defer future deliveries',()=>{
 const r=setup(),at=order(r).project.vehicles.find(v=>v.cargo).nextAt,first=cmd(r.state,'sync',{},at),legacy=order(first);
 const paid=legacy.deferredTransport;first.state.coins=round(first.state.coins+paid.revenue);first.state.stats.grossRevenue=paid.revenue;first.state.xp=paid.xp;delete legacy.deferredTransport;
 const synced=cmd(first.state,'sync',{},at);assert.equal(order(synced).deferredTransport,undefined);assert.equal(synced.state.coins,first.state.coins);assert.equal(synced.state.xp,first.state.xp);
 const done=finish(synced),earned=order(done).deferredTransport;
 assert.equal(round(earned.revenue+paid.revenue),order(done).bookedTransport.revenue);assert.equal(round(earned.xp+paid.xp),order(done).bookedTransport.xp);
 const claim=cmd(done.state,'claim',{id:'DEFERRED'},order(done).completedAt);assert.equal(claim.state.xp,round(paid.xp+earned.xp));assert.equal(claim.view.claimSummary.xp,earned.xp);
});
test('Legacy completed projects without a ledger receive only their unpaid completion bonus',()=>{
 const done=finish(setup()),o=order(done),paid=o.deferredTransport;
 done.state.coins=round(done.state.coins+paid.revenue);done.state.stats.grossRevenue=paid.revenue;done.state.xp=paid.xp;delete o.deferredTransport;
 delete o.completionReward.transportCoins;delete o.completionReward.totalCoins;delete o.completionReward.xp;
 const claim=cmd(done.state,'claim',{id:o.id},o.completedAt);assert.equal(claim.state.coins,round(done.state.coins+o.completionReward.coins));assert.equal(claim.state.xp,done.state.xp);assert.equal(claim.view.claimSummary.xp,undefined);
});
test('Referral projects use the same deferred payout and claimAll cannot pay them twice',()=>{
 const done=cmd(setup('referral').state,'overtime',{id:'DEFERRED',amount:1000});assert.equal(order(done).status,'completed');assert.equal(done.state.xp,0);
 const claimed=cmd(done.state,'claimAll',{},order(done).completedAt),again=cmd(claimed.state,'claimAll',{},order(done).completedAt);
 assert.ok(claimed.state.xp>0);assert.equal(again.state.xp,claimed.state.xp);assert.equal(again.state.coins,claimed.state.coins);
});
test('A retried Cloud claim restores its payout and level-up receipt without crediting again',async()=>{
 const done=finish(setup()),clock=order(done).completedAt,records=new Map([['players/test',{snapshot:gzipSync(JSON.stringify(done.state))}]]);
 const ref=path=>({path,collection:name=>({doc:id=>ref(path+'/'+name+'/'+id)})});
 const tx={get:async r=>({exists:records.has(r.path),data:()=>records.get(r.path)}),set:(r,value)=>records.set(r.path,value)};
 const exports={},db={doc:ref,runTransaction:async fn=>fn(tx)};class Clock extends Date{static now(){return clock;}}
 const req=name=>name==='firebase-functions/v2/https'?{onCall:(_o,fn)=>fn,HttpsError:class extends Error{constructor(c,m){super(m);this.code=c;}}}:name==='firebase-admin/app'?{initializeApp(){}}:name==='firebase-admin/firestore'?{getFirestore:()=>db,Timestamp:{fromMillis:v=>v}}:name==='node:zlib'?{gzipSync,gunzipSync}:name==='./engine.cjs'?{execute}:name==='./response-cache.cjs'?require('../functions/src/response-cache.cjs'):name==='./event-store.cjs'?{readEventContext:async()=>({persist(){}}),refreshRanking(){}}:(()=>{throw Error(name);})();
 vm.runInNewContext(fs.readFileSync(require.resolve('../functions/src/index.cjs'),'utf8'),{exports,require:req,Date:Clock,console});
 const request={auth:{uid:'test'},data:{action:'claim',payload:{id:'DEFERRED'},requestId:'deferred-claim-retry-0001'}};
 const first=await exports.game(request),saved=JSON.parse(gunzipSync(records.get('players/test').snapshot));
 const replay=await exports.game(request),after=JSON.parse(gunzipSync(records.get('players/test').snapshot));
 assert.deepEqual(replay.claimSummary,first.claimSummary);assert.deepEqual(replay.levelUps,first.levelUps);assert.equal(after.coins,saved.coins);assert.equal(after.xp,saved.xp);
});
