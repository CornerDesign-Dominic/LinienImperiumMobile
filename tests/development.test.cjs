const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const T=1800000000000,cmd=(s,a='sync',p={})=>execute(s,a,p,T,()=>.5),start=()=>cmd(null,'foundCompany',{companyName:'Entwicklung',cityName:'Test'});
const earned=()=>cmd(start().state,'testGrant',{kind:'xp',amount:1000});
test('Multiple earned levels are allocated in one atomic batch, without granting refill items again',()=>{
 const r=earned(),points=r.state.pendingLevelUps.length*3;assert.ok(points>3);assert.equal(r.view.development.points,points);
 const next=cmd(r.state,'levelBatch',{expedition:points-4,overtime:4,points});
 assert.equal(next.view.development.points,0);assert.deepEqual(next.state.pendingLevelUps,[]);
 assert.equal(next.state.expedition.levelCapacityBonus,(r.state.expedition.levelCapacityBonus||0)+points-4);
 assert.equal(next.state.overtimeCapacity,r.state.overtimeCapacity+4);
 assert.equal(next.state.expedition.points,r.state.expedition.points+points-4);assert.equal(next.state.overtimePoints,r.state.overtimePoints+4);
 assert.equal(next.state.inventory.expeditionRefills,r.state.inventory.expeditionRefills);assert.equal(next.state.inventory.overtimeRefills,r.state.inventory.overtimeRefills);
 assert.throws(()=>cmd(next.state,'levelBatch',{expedition:points-4,overtime:4,points}),/Punkte/);
});
test('Development base capacities exclude equipment and discovery bonuses, while totals still agree with the header',()=>{
 let r=start();r.state.overtimeCapacity=110;r.state.expedition.levelCapacityBonus=20;r.state.expedition.regions[0].deliveries=[true,true,false,false,false,false,false];
 for(const [id,level] of [['r1_uncommon',2],['r3_uncommon',1]]){r.state.expedition.characters[id]={level,progress:0};r=cmd(r.state,'garageAdd',{id});}
 assert.deepEqual(r.view.development.overtime,{base:110,bonus:10});assert.deepEqual(r.view.development.expedition,{base:70,bonus:7});
 assert.equal(r.view.state.overtimeCapacity,120);assert.equal(r.view.expeditionCapacity,77);assert.equal(r.state.overtimeCapacity,110);
 r=cmd(r.state,'garageRemove',{id:'r1_uncommon'});assert.deepEqual(r.view.development.overtime,{base:110,bonus:0});
});
test('Batch rejects partial, excessive, negative, fractional and stale allocations without changing persisted capacities',()=>{
 const r=earned(),points=r.view.development.points,before=JSON.stringify(r.state);
 for(const p of [{expedition:0,overtime:0,points},{expedition:points+1,overtime:0,points},{expedition:points,overtime:0,points:points-3},{expedition:-1,overtime:points+1,points},{expedition:.5,overtime:points-.5,points}])assert.throws(()=>cmd(r.state,'levelBatch',p));
 assert.equal(JSON.stringify(r.state),before);
});
test('Newly accumulated levels cannot be lost through a stale allocation; updating the point count permits one combined allocation',()=>{
 const r=earned(),old=r.view.development.points,next=cmd(r.state,'testGrant',{kind:'xp',amount:1000});assert.ok(next.view.development.points>old);
 assert.throws(()=>cmd(next.state,'levelBatch',{expedition:old,overtime:0,points:old}),/geändert/);
 const points=next.view.development.points,result=cmd(next.state,'levelBatch',{expedition:0,overtime:points,points});assert.equal(result.view.development.points,0);assert.equal(result.state.overtimeCapacity,next.state.overtimeCapacity+points);
});
test('Existing single-level clients can still allocate three points; the remaining levels are available as a batch',()=>{
 const r=earned(),legacy=cmd(r.state,'level',{expedition:1,overtime:2});assert.equal(legacy.view.development.points,r.view.development.points-3);
 const points=legacy.view.development.points,next=cmd(legacy.state,'levelBatch',{expedition:points,overtime:0,points});assert.equal(next.view.development.points,0);
});
