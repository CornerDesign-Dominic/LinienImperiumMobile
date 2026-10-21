const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000,random=()=>.5;
const start=()=>execute(null,'start',{id:'hamburg'},now,random);
const sync=state=>execute(state,'sync',{},now,random);
const at=(level,within=0)=>{const s=start().state;s.xp=50*level*(level-1)+within;s.coins=1e9;return s;};
test('Linear XP needs increase by exactly 100 at every level, including old curve boundaries',()=>{
 for(const level of [1,4,5,24,25,26,49,50,100,500]){
  const state=at(level),v=sync(state).view.level;
  assert.deepEqual(v,{level,within:0,need:100*level});
  state.xp+=100*level-.01;assert.equal(sync(state).view.level.level,level);
  state.xp=50*level*(level+1);assert.equal(sync(state).view.level.level,level+1);
 }
});
test('Old quadratic saves keep their level and fractional progress exactly once without retroactive rewards',()=>{
 const s=at(1);delete s.linearProgressionVersion;s.xp=32500+1352;s.pendingLevelUps=[26];s.inventory.expeditionRefills=3;s.inventory.overtimeRefills=4;
 const before=structuredClone(s);const result=sync(s);
 assert.deepEqual(s,before);assert.deepEqual(result.view.level,{level:26,within:1300,need:2600});
 assert.equal(result.state.linearProgressionVersion,1);assert.deepEqual(result.state.pendingLevelUps,[26]);assert.equal(result.state.inventory.expeditionRefills,3);assert.equal(result.state.inventory.overtimeRefills,4);assert.equal(result.view.levelUps,undefined);
 const again=sync(result.state);assert.equal(again.state.xp,result.state.xp);assert.deepEqual(again.view.level,result.view.level);
});
test('Legacy level floors survive migration, but do not leave a hidden XP catch-up span',()=>{
 const s=at(1);delete s.linearProgressionVersion;s.xp=122500;s.levelFloor=50;s.levelFloorXp=122500;
 const result=sync(s);assert.equal(result.view.level.level,50);assert.equal(result.view.level.within,0);assert.equal(result.view.level.need,5000);assert.equal(result.state.levelFloor,undefined);
 const gained=execute(result.state,'testGrant',{kind:'xp',amount:1000},now,random);assert.equal(gained.view.level.within,1000);assert.equal(gained.view.level.need,5000);
});
test('Hub opening and vehicle purchases are server-gated at 5, 10, 15 independently from garage cards',()=>{
 for(const level of [1,4]){
  const s=at(level),r=execute(s,'buyHub',{},now,random);
  assert.equal(r.state.hubs.length,0);assert.equal(r.view.hubLimit,0);assert.equal(r.view.hubInfo.unlocked,false);assert.equal(r.view.hubInfo.nextVehicleLevel,5);
  const buy=execute(s,'buyTruck',{model:0},now,random);assert.equal(buy.state.trucks.length,s.trucks.length);assert.equal(buy.state.coins,s.coins);
 }
 let state=at(5);let r=execute(state,'buyHub',{},now,random);assert.equal(r.state.hubs.length,1);assert.equal(r.view.hubLimit,1);
 r=execute(r.state,'buyTruck',{model:0},now,random);assert.equal(r.state.trucks.filter(t=>!t.cardId).length,1);
 const coins=r.state.coins;r=execute(r.state,'buyTruck',{model:1},now,random);assert.equal(r.state.coins,coins);assert.equal(r.state.trucks.filter(t=>!t.cardId).length,1);
 r.state.xp=50*9*8;assert.equal(sync(r.state).view.hubLimit,1);
 for(const level of [10,15]){
  r.state.xp=50*level*(level-1);r=sync(r.state);assert.equal(r.view.hubLimit,level/5);assert.equal(r.view.hubInfo.nextVehicleLevel,level+5);
  r=execute(r.state,'buyTruck',{model:1},now,random);assert.equal(r.state.trucks.filter(t=>!t.cardId).length,level/5);
 }
});
test('Previously bought hub vehicles and an existing low-level hub stay usable without extra purchases',()=>{
 let r=execute(at(15),'buyHub',{},now,random);
 for(let i=0;i<3;i++)r=execute(r.state,'buyTruck',{model:0},now,random);
 r.state.xp=0;delete r.state.linearProgressionVersion;
 const ids=r.state.trucks.map(t=>t.id);const coins=r.state.coins;r=sync(r.state);
 assert.deepEqual(r.state.trucks.map(t=>t.id),ids);assert.equal(r.view.hubInfo.unlocked,true);assert.equal(r.view.hubLimit,3);assert.equal(r.view.hubInfo.nextVehicleLevel,20);
 r=execute(r.state,'buyTruck',{model:0},now,random);assert.equal(r.state.coins,coins);assert.equal(r.state.trucks.filter(t=>!t.cardId).length,3);
});
test('Crossing several levels queues each real reward once, including each fifth-level milestone',()=>{
 const s=at(4,390);let r=execute(s,'testGrant',{kind:'xp',amount:1000},now,random);
 assert.deepEqual(r.view.levelUps,[5,6]);assert.equal(r.state.inventory.expeditionRefills,2);assert.equal(r.state.inventory.overtimeRefills,2);assert.equal(r.view.hubLimit,1);
 r=sync(r.state);assert.equal(r.view.levelUps,undefined);assert.equal(r.state.inventory.expeditionRefills,2);
});
