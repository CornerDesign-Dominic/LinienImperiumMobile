const {test}=require('node:test');
const fs=require('node:fs'),path=require('node:path');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const cards=require('../functions/src/transport-cards.json');
const T=1800000000000;
const cmd=(state,action='sync',payload={},at=T)=>execute(state,action,payload,at,()=>0);
function setup(){return cmd(null,'foundCompany',{companyName:'Kartentest',cityName:'Teststadt'});}
function own(r,id,level=1){r.state.expedition.characters[id]={level,progress:0};return r;}
function equip(r,id,level=1,at=T){own(r,id,level);return cmd(r.state,'garageAdd',{id},at);}

test('All 25 regional vehicles have independent capacity/speed and a single escalating bonus; region pools cover five cards',()=>{
 const r=setup();assert.equal(cards.length,25);
 for(const region of [0,1,2,3,4])assert.deepEqual(cards.filter(c=>c.region===region).map(c=>c.rarity),['common','common','uncommon','rare','epic']);
 for(const c of cards){
  assert.equal(r.view.cardVehicles[c.id].capacity,c.baseCapacity);
  assert.ok(c.baseSpeed>0);assert.equal(c.bonusLevels.length,10);
  assert.ok(c.bonusLevels.every((v,i)=>i===0||v>c.bonusLevels[i-1]));
  assert.ok(['self','garage','fleet'].includes(c.scope));
 }
 assert.equal(r.view.cardVehicles.navigator.speed,.75);
 assert.equal(r.view.cardVehicles.r1_uncommon_2.speed,1.55);
 assert.equal(r.view.cardVehicles.r4_epic.speed,.5);
 assert.ok(cards.filter(c=>c.artKey).length===25);
});
test('Both point-capacity cards have the agreed nonlinear levels and affect different point types without granting stock',()=>{
 for(let level=1;level<=10;level++){
  let r=setup(),bonus=[5,10,15,20,25,30,40,50,60,70][level-1];
  r=equip(r,'r1_uncommon',level);assert.equal(r.view.state.overtimeCapacity,100+bonus);assert.equal(r.view.expeditionCapacity,50);
  r=equip(r,'r3_uncommon',level);assert.equal(r.view.expeditionCapacity,50+bonus);
  assert.equal(r.state.expedition.points,50);assert.equal(r.state.overtimePoints,100);
  assert.equal(r.state.overtimeCapacity,100,'Persist the base, not the equipment bonus');
  const restored=cmd(JSON.parse(JSON.stringify(r.state)));assert.equal(restored.view.state.overtimeCapacity,100+bonus);
 }
});
test('Collection, parked upgrade and fleet placement do not activate point bonuses',()=>{
 let r=own(own(own(setup(),'r1_uncommon',10),'r3_uncommon',10),'logistiker',10);
 r=cmd(r.state,'seat',{id:'r1_uncommon',template:0,seat:0});
 r=cmd(r.state,'seat',{id:'r3_uncommon',template:0,seat:1});
 r=cmd(r.state,'seat',{id:'logistiker',template:0,seat:2});
 r.state.inventory.capacityModules=2;
 r=cmd(r.state,'cardCapacity',{id:'r3_uncommon'});
 assert.equal(r.view.expeditionCapacity,50);assert.equal(r.view.state.overtimeCapacity,100);
 assert.equal(r.view.regeneration.expeditionIntervalMs,600000);
 assert.equal(r.state.trucks.length,1);
 assert.deepEqual(Object.keys(r.view.fleetPreviews[0][0].bonuses).sort(),['cost','pay','speed','xp']);
});
test('Rare expedition timer bonus is exactly 10 to 120 seconds and never accelerates overtime',()=>{
 for(let level=1;level<=10;level++){
  let r=equip(setup(),'logistiker',level);
  r.state.expedition.points=10;r.state.overtimePoints=10;
  r.state.expedition.lastRegenAt=T;r.state.overtimeLastRegenAt=T;
  r=cmd(r.state);const ms=600000-[10,20,30,40,50,60,75,90,105,120][level-1]*1000;
  assert.equal(r.view.regeneration.expeditionNextAt,T+ms);
  assert.equal(r.view.regeneration.overtimeNextAt,T+600000);
  assert.equal(cmd(r.state,'sync',{},T+ms-1).state.expedition.points,10);
  assert.equal(cmd(r.state,'sync',{},T+ms).state.expedition.points,11);
 }
});
test('Timer donor insertion, level upgrade and removal preserve percentage progress and cannot mint points',()=>{
 let r=own(setup(),'logistiker');r.state.expedition.points=10;r.state.expedition.lastRegenAt=T-300000;
 r=cmd(r.state,'garageAdd',{id:'logistiker'});
 assert.equal(r.view.regeneration.expeditionNextAt,T+295000);
 r.state.expedition.shards.rare=100;
 r=cmd(r.state,'cardUpgrade',{id:'logistiker'});
 assert.equal(r.view.regeneration.expeditionNextAt,T+290000);
 for(let i=0;i<10;i++){
  r=cmd(r.state,'garageRemove',{id:'logistiker'});assert.equal(r.view.regeneration.expeditionNextAt,T+300000);
  r=cmd(r.state,'garageAdd',{id:'logistiker'});assert.equal(r.view.regeneration.expeditionNextAt,T+290000);
 }
 assert.equal(r.state.expedition.points,10);
});
test('Removing capacity cards keeps both overflows, pauses regeneration offline and resumes expedition progress after spending below cap',()=>{
 let r=equip(equip(setup(),'r1_uncommon',10),'r3_uncommon',10);
 r.state.expedition.points=51;r.state.overtimePoints=169;
 r.state.expedition.lastRegenAt=T-300000;r.state.overtimeLastRegenAt=T-300000;
 r=cmd(r.state,'garageRemove',{id:'r3_uncommon'});
 r=cmd(r.state,'garageRemove',{id:'r1_uncommon'});
 assert.equal(r.state.expedition.points,51);assert.equal(r.state.overtimePoints,169);
 assert.equal(r.view.regeneration.expeditionNextAt,null);assert.equal(r.view.regeneration.overtimeNextAt,null);
 r=cmd(JSON.parse(JSON.stringify(r.state)),'sync',{},T+3600000);
 assert.equal(r.state.expedition.points,51);assert.equal(r.state.overtimePoints,169);
 r.state.expedition.regions[0].endlessUnlocked=true;
 r=cmd(r.state,'draw',{region:0},T+3600000);
 assert.equal(r.state.expedition.points,46);assert.equal(r.view.regeneration.expeditionNextAt,T+3900000);
 r=cmd(r.state,'sync',{},T+3900000);assert.equal(r.state.expedition.points,47);
});
test('Re-equipping capacity resumes the stored countdown, and refills below boosted maximum preserve the active timer',()=>{
 let r=equip(setup(),'r1_uncommon',10);
 r.state.overtimePoints=110;r.state.overtimeLastRegenAt=T-300000;r.state.inventory.overtimeRefills=2;
 r=cmd(r.state,'refill');assert.equal(r.state.overtimePoints,160);assert.equal(r.view.regeneration.overtimeNextAt,T+300000);
 r=cmd(r.state,'garageRemove',{id:'r1_uncommon'});assert.equal(r.state.overtimePoints,160);assert.equal(r.view.regeneration.overtimeNextAt,null);
 r=cmd(r.state,'garageAdd',{id:'r1_uncommon'},T+100000);
 assert.equal(r.view.regeneration.overtimeNextAt,T+400000);
 r=cmd(r.state,'refill',{},T+100000);assert.equal(r.state.overtimePoints,210);
 assert.equal(r.view.regeneration.overtimeNextAt,null);
});
test('Card migration keeps stable IDs, levels, shards, module/rank investment and active tour snapshots exactly once',()=>{
 let r=setup();const truck=r.state.trucks[0];
 delete truck.transportVersion;truck.model='Kurierwagen';truck.capacity=5;truck.moduleCapacityLevel=2;truck.moduleCapacitySpent=2;truck.rarityLevel=12;
 r.state.expedition.characters.navigator.level=7;
 const snapshot={vehicle:{...truck},cargo:4,endsAt:T+100000,accounting:{revenue:1,cost:1,xp:1}};
 const base=r.state.orders[0];r.state.orders=[{...base,id:'OLD',status:'active',truckId:truck.id,tripSnapshot:snapshot,tripCargo:4,tripStartAt:T,volume:40,delivered:0}];
 r=cmd(r.state);assert.equal(r.state.trucks[0].capacity,2.2);assert.equal(r.state.trucks[0].rarityLevel,12);
 assert.equal(r.state.trucks[0].moduleCapacitySpent,2);assert.equal(r.state.expedition.characters.navigator.level,7);
 assert.deepEqual(r.state.orders.find(o=>o.id==='OLD').tripSnapshot,snapshot);
 const saved=JSON.stringify(r.state.trucks);r=cmd(JSON.parse(JSON.stringify(r.state)));assert.equal(JSON.stringify(r.state.trucks),saved);
});
test('Capacity modules scale from each card base and current tours keep their original values',()=>{
 for(const id of ['navigator','r2_epic','r4_epic']){
  let r=equip(setup(),id);r.state.inventory.capacityModules=10;
  r=cmd(r.state,'cardCapacity',{id});const card=cards.find(c=>c.id===id);
  assert.equal(r.view.cardVehicles[id].capacity,Math.round(card.baseCapacity*1.05*100)/100);
  assert.equal(r.view.cardVehicles[id].rank.total,0);assert.equal(r.state.inventory.capacityModules,9);
 }
});
test('Garage-wide transport effects include non-card city vehicles and exclude fleets',()=>{
 let r=equip(setup(),'r5_epic',10);
 r.state.trucks.push({id:'CITY',tier:0,capacity:2,rarityLevel:0,hubSpeedLevel:0});
 r=cmd(r.state);assert.equal(r.view.state.trucks.find(t=>t.id==='CITY').bonus.speed,16);
 r=cmd(r.state,'seat',{id:'navigator',template:0,seat:0});
 assert.equal(r.view.fleetPreviews[0][0].bonuses.speed,0);
});

test('Every card has a unique square artwork file and a static native asset registration',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../src/VehicleArt.tsx'),'utf8');
 assert.equal(new Set(cards.map(c=>c.artKey)).size,25);
 for(const card of cards){
  assert.ok(fs.existsSync(path.join(__dirname,'../assets/art/vehicles',card.artKey+'.jpg')),card.id);
  assert.ok(source.includes("'"+card.artKey+"':require("),card.id);
 }
});

test('Collection upgrade previews match actual capacity and rank upgrades without changing resources',()=>{
 for(const id of ['navigator','r1_rare','r5_epic']){
  let r=equip(setup(),id,2);
  r.state.inventory.capacityModules=2;r.state.inventory.gears.common=100000;
  r=cmd(r.state);
  const preview=r.view.cardVehicles[id].upgradePreview;
  assert.equal(r.state.inventory.capacityModules,2);
  const capacity=cmd(r.state,'cardCapacity',{id});
  assert.equal(capacity.view.cardVehicles[id].capacity,preview.capacity);
  const ranked=cmd(r.state,'cardRank',{id});
  assert.deepEqual(ranked.view.cardVehicles[id].rank,preview.rank.rank);
  assert.equal(ranked.view.cardVehicles[id].speed,preview.rank.speed);
  assert.equal(ranked.view.cardVehicles[id].loadedSpeed,preview.rank.loadedSpeed);
 }
});
test('Collection previews cover rank rarity transitions, parked cards and capped upgrades',()=>{
 let r=equip(setup(),'navigator',2);
 const truck=r.state.trucks.find(t=>t.cardId==='navigator');truck.rarityLevel=9;
 r.state.inventory.gears.common=100000;
 r=cmd(r.state,'garageRemove',{id:'navigator'});
 const next=r.view.cardVehicles.navigator.upgradePreview.rank;
 assert.equal(next.rank.id,'uncommon');assert.equal(next.rank.level,0);
 const upgraded=cmd(r.state,'cardRank',{id:'navigator'});
 assert.deepEqual(upgraded.view.cardVehicles.navigator.rank,next.rank);
 const parked=upgraded.state.expedition.characters.navigator.parkedTruck;
 parked.rarityLevel=50;parked.moduleCapacityLevel=10;
 const maxed=cmd(upgraded.state);
 assert.deepEqual(maxed.view.cardVehicles.navigator.upgradePreview,{capacity:null,rank:null});
});

test('Garage replacement works in a full garage, preserves position and parked upgrades',()=>{
 let r=setup();for(const card of cards.slice(1,10))r=equip(r,card.id);
 const replacement=cards[10].id;r=own(r,replacement,3);
 const original=r.state.trucks.find(t=>t.cardId==='navigator');original.kmDriven=1234;original.moduleCapacityLevel=2;original.capacity=2.2;
 r.state.inventory.capacityModules=2;r=cmd(r.state,'cardCapacity',{id:replacement});
 const expectedCapacity=r.view.cardVehicles[replacement].capacity,coins=r.state.coins,modules=r.state.inventory.capacityModules;
 const swapped=cmd(r.state,'garageReplace',{id:'navigator',replacement});
 assert.equal(swapped.state.trucks.length,10);assert.equal(swapped.state.trucks[0].cardId,replacement);
 assert.equal(swapped.state.trucks[0].capacity,expectedCapacity);
 assert.equal(swapped.state.expedition.characters.navigator.parkedTruck.kmDriven,1234);
 assert.equal(swapped.state.expedition.characters.navigator.parkedTruck.capacity,2.2);
 assert.equal(swapped.state.coins,coins);assert.equal(swapped.state.inventory.capacityModules,modules);
 const restored=cmd(swapped.state,'garageReplace',{id:replacement,replacement:'navigator'});
 assert.equal(restored.state.trucks[0].cardId,'navigator');assert.equal(restored.state.trucks[0].kmDriven,1234);assert.equal(restored.state.trucks[0].capacity,2.2);
});
test('Invalid, duplicated and unowned garage replacements leave the original vehicle installed',()=>{
 let r=equip(setup(),cards[1].id);
 for(const replacement of ['navigator',cards[1].id,cards[2].id,'missing']){
  const next=cmd(r.state,'garageReplace',{id:'navigator',replacement});
  assert.deepEqual(next.state.trucks.map(t=>t.cardId),r.state.trucks.map(t=>t.cardId));
  assert.equal(next.state.expedition.characters.navigator.parkedTruck,undefined);
 }
});
test('Busy garage vehicles cannot be replaced or lose their running assignment',()=>{
 let r=own(setup(),cards[1].id),truck=r.state.trucks.find(t=>t.cardId==='navigator');
 const order=r.view.state.orders.find(o=>o.choices.some(choice=>choice.id===truck.id));
 r=cmd(r.state,'assign',{order:order.id,truck:truck.id});
 const next=cmd(r.state,'garageReplace',{id:'navigator',replacement:cards[1].id});
 assert.equal(next.state.trucks[0].cardId,'navigator');assert.equal(next.state.trucks.length,1);
 assert.equal(next.state.orders.find(o=>o.id===order.id).truckId,truck.id);
 assert.equal(next.state.expedition.characters.navigator.parkedTruck,undefined);
});
