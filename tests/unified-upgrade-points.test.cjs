const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const T=1800000000000,run=(state,action='sync',payload={},now=T)=>execute(state,action,payload,now,()=>.5);
const start=()=>run(null,'foundCompany',{companyName:'Ausbaukontor',cityName:'Testhafen'});
test('Legacy six level points plus one expedition point become seven once while spent capacity and energy remain intact',()=>{
 const old=start().state;old.pendingLevelUps=[17,18];old.expansion.available=1;old.expansion.expedition=3;old.expansion.overtime=2;old.expedition.levelCapacityBonus=26;old.overtimeCapacity=121;old.expedition.points=9;old.overtimePoints=11;
 const migrated=run(old);assert.equal(migrated.view.expansion.available,7);assert.equal(migrated.view.development.points,7);assert.deepEqual(migrated.state.pendingLevelUps,[]);
 assert.equal(migrated.view.development.expedition.base,79);assert.equal(migrated.view.development.overtime.base,123);assert.equal(migrated.state.expedition.points,9);assert.equal(migrated.state.overtimePoints,11);
 const again=run(JSON.parse(JSON.stringify(migrated.state)));assert.equal(again.view.expansion.available,7);assert.equal(again.view.expeditionCapacity,migrated.view.expeditionCapacity);assert.equal(again.view.state.overtimeCapacity,migrated.view.state.overtimeCapacity);assert.equal(old.pendingLevelUps.length,2,'input snapshot is untouched');
 const spent=run(again.state,'expansionAllocate',{expedition:1,overtime:2,points:7});assert.equal(spent.view.expansion.available,4);assert.equal(spent.view.development.points,4);assert.equal(spent.view.development.expedition.base,80);assert.equal(spent.view.development.overtime.base,125);assert.equal(spent.state.expedition.points,9);assert.equal(spent.state.overtimePoints,11);
 assert.throws(()=>run(spent.state,'expansionAllocate',{expedition:1,overtime:2,points:7}),/geändert/);assert.equal(run(spent.state).view.expansion.available,4);
});
test('Fresh level and settled delivery awards join one balance once, and legacy batch commands spend that same balance',()=>{
 let r=start();r=run(r.state,'testGrant',{kind:'xp',amount:100});assert.equal(r.view.expansion.available,3);assert.deepEqual(r.view.levelUps,[2]);assert.equal(run(r.state).view.levelUps,undefined);
 r.state.expedition.regions[0].discovered=1;r.state.expedition.missions.push({id:1,region:0,place:0,kind:'delivery',status:'active',startedAt:T,endsAt:T+15000,truckId:r.state.trucks[0].id});
 r=run(r.state,'sync',{},T+15000);assert.equal(r.view.expansion.available,4);assert.equal(run(r.state,'sync',{},T+15000).view.expansion.available,4);
 const allocated=run(r.state,'levelBatch',{expedition:2,overtime:0,points:4},T+15000);assert.equal(allocated.view.expansion.available,2);assert.equal(allocated.view.development.points,2);assert.equal(allocated.view.expansionAllocationApplied,true);
 assert.throws(()=>run(allocated.state,'levelBatch',{expedition:2,overtime:0,points:4},T+15000),/geändert/);
});
