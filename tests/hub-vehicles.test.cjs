const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const H=3600000,now=Date.UTC(2026,9,22,1),win=()=>0,lose=()=>.99;
function fresh(level=100){const r=execute(null,'start',{id:'hamburg'},now,win);r.state.xp=50*level*(level-1);r.state.coins=1e9;return r.state;}
function run(s,action='sync',p={},at=now,rng=win){return execute(s,action,p,at,rng);}
function hubbed(level=100){let r=run(fresh(level),'buyHub');return run(r.state,'hubVehicleBuy');}
test('One server-owned city model costs exactly 25,000 and 20 slots is a hard maximum',()=>{
 let r=run(fresh(200),'buyHub');const coins=r.state.coins;
 assert.equal(r.view.hubLimit,20);assert.equal(r.view.hubInfo.nextVehicleLevel,null);
 for(let i=0;i<20;i++)r=run(r.state,'hubVehicleBuy',{price:0,capacity:100});
 const trucks=r.state.trucks.filter(t=>!t.cardId);assert.equal(trucks.length,20);
 assert.ok(trucks.every(t=>t.model==='Stadttransporter'&&t.capacity===2&&t.tier===0));
 assert.equal(r.state.coins,coins-500000);
 const blocked=run(r.state,'hubVehicleBuy');assert.equal(blocked.state.coins,r.state.coins);assert.equal(blocked.state.trucks.length,r.state.trucks.length);
 assert.equal(run(r.state,'buyTruck',{model:1}).state.coins,r.state.coins);
 assert.equal(r.view.state.trucks.find(t=>!t.cardId).speed,1);
});
test('Hub purchase obeys level, exact price and existing slot gates',()=>{
 let r=run(fresh(4),'buyHub');assert.equal(r.state.hubs.length,0);
 r=run(fresh(5),'buyHub');r.state.coins=24999;
 assert.equal(run(r.state,'hubVehicleBuy').state.trucks.length,1);
 r.state.coins=25000;r=run(r.state,'hubVehicleBuy');assert.equal(r.state.coins,0);
 assert.equal(run(r.state,'hubVehicleBuy').state.trucks.length,2);
});
test('Three daily crates enforce global 30-minute gaps, midnight reset, bounds, and JSON persistence',()=>{
 let s=fresh(5),r=run(s,'hubCrate');assert.equal(r.view.hubCrateParts,10);assert.equal(r.state.inventory.hubVehicleParts,10);
 let blocked=run(r.state,'hubCrate',{},now+30*60000-1);assert.equal(blocked.state.inventory.hubVehicleParts,10);
 r=run(JSON.parse(JSON.stringify(blocked.state)),'hubCrate',{},now+30*60000,lose);assert.equal(r.view.hubCrateParts,20);
 r=run(r.state,'hubCrate',{},now+H);assert.equal(r.state.inventory.hubVehicleParts,40);
 blocked=run(r.state,'hubCrate',{},now+2*H);assert.equal(blocked.state.inventory.hubVehicleParts,40);assert.equal(blocked.view.hubInfo.crates.opened,3);
 const nextDay=Date.UTC(2026,9,23);r=run(r.state,'hubCrate',{},nextDay);assert.equal(r.view.hubInfo.crates.opened,1);
 let midnight=run(fresh(5),'hubCrate',{},nextDay-5*60000);
 blocked=run(midnight.state,'hubCrate',{},nextDay);assert.equal(blocked.view.hubInfo.crates.available,false);assert.equal(blocked.state.inventory.hubVehicleParts,10);
 r=run(blocked.state,'hubCrate',{},nextDay+25*60000);assert.equal(r.view.hubInfo.crates.opened,1);assert.equal(r.state.inventory.hubVehicleParts,20);
 assert.equal(run(fresh(4),'hubCrate').view.hubCrateParts,undefined);
});
test('Hourly purchase gives one 50% trial, cannot reroll by sync or toggling, and parts are collected once',()=>{
 let r=hubbed(),t=r.state.trucks.find(t=>!t.cardId),h=r.state.hubs[0];
 assert.equal(h.cashboxParts,1);assert.equal(h.partsAttempts,1);
 r=run(r.state);assert.equal(r.state.hubs[0].cashboxParts,1);
 r=run(r.state,'hubTruck',{id:t.id});r=run(r.state,'hubTruck',{id:t.id});
 assert.equal(r.state.hubs[0].cashboxParts,1);assert.equal(r.state.hubs[0].partsAttempts,1);
 r=run(r.state,'sync',{},now+H,lose);assert.equal(r.state.hubs[0].partsAttempts,2);assert.equal(r.state.hubs[0].cashboxParts,1);
 r=run(r.state,'hubCollect',{},now+H);assert.equal(r.state.inventory.hubVehicleParts,1);assert.equal(r.state.hubs[0].cashboxParts,0);
 r=run(r.state,'hubCollect',{},now+H);assert.equal(r.state.inventory.hubVehicleParts,1);
});
test('Offline catchup stops parts at full cashbox, has no retroactive trials and matches frequent sync',()=>{
 let r=hubbed(),start=structuredClone(r.state);
 let offline=run(start,'sync',{},now+12*H),frequent=run(start);
 for(let i=1;i<=12;i++)frequent=run(frequent.state,'sync',{},now+i*H);
 assert.equal(offline.state.hubs[0].cashboxCycles,6);assert.equal(offline.state.hubs[0].cashboxParts,6);assert.equal(offline.state.hubs[0].partsAttempts,6);
 assert.equal(offline.state.hubs[0].cashboxParts,frequent.state.hubs[0].cashboxParts);
 offline=run(offline.state,'sync',{},now+48*H);assert.equal(offline.state.hubs[0].cashboxParts,6);
 offline=run(offline.state,'hubCollect',{},now+48*H);assert.equal(offline.state.inventory.hubVehicleParts,6);
 const after=run(offline.state,'sync',{},now+49*H);assert.equal(after.state.hubs[0].cashboxParts,1);
});
test('Twenty-four hourly attempts max per UTC day and no rolls without vehicles',()=>{
 const midnight=Date.UTC(2026,9,22);let r=run(fresh(),'buyHub',{},midnight);r=run(r.state,'hubVehicleBuy',{},midnight);
 for(let i=1;i<24;i++)r=run(r.state,'hubCollect',{},midnight+i*H);
 assert.equal(r.state.hubs[0].partsAttempts,24);assert.equal(r.state.inventory.hubVehicleParts,24);
 const id=r.state.trucks.find(t=>!t.cardId).id;r=run(r.state,'hubTruck',{id},midnight+23.5*H);r=run(r.state,'hubTruck',{id},midnight+23.5*H);assert.equal(r.state.hubs[0].partsAttempts,24);
 let empty=run(fresh(5),'buyHub');empty=run(empty.state,'sync',{},now+H*24);assert.equal(empty.state.hubs[0].cashboxParts||0,0);
});
test('Parts and coins buy ten stages per track, no gears/modules, and preserve current hourly earnings snapshot',()=>{
 let r=hubbed(),t=r.state.trucks.find(t=>!t.cardId),id=t.id,baseCapacity=r.state.hubs[0].cycleCapacity;
 r.state.inventory.hubVehicleParts=1540;
 for(const kind of ['capacity','speed'])for(let level=1;level<=10;level++){
  const before=r.state.coins;r=run(r.state,'hubVehicleUpgrade',{id,kind});
  assert.equal(r.state.trucks.find(t=>t.id===id)[kind==='capacity'?'hubCapacityLevel':'hubSpeedLevel'],level);
  assert.equal(before-r.state.coins,2500*level);
 }
 assert.equal(r.state.inventory.hubVehicleParts,0);assert.equal(r.view.state.trucks.find(t=>t.id===id).capacity,4);assert.equal(r.view.state.trucks.find(t=>t.id===id).speed,1.25);
 assert.equal(r.state.hubs[0].cycleCapacity,baseCapacity);
 const blocked=run(r.state,'hubVehicleUpgrade',{id,kind:'speed'});assert.equal(blocked.state.coins,r.state.coins);
 for(const action of ['rank','capacity'])assert.equal(run(r.state,action,{id}).state.coins,r.state.coins);
 const updated=run(r.state,'sync',{},now+H);assert.ok(updated.state.hubs[0].cycleCapacity>baseCapacity);
 assert.throws(()=>run(r.state,'hubVehicleUpgrade',{id,kind:'__proto__'}),/Ungültige/);
});
test('Insufficient parts/coins and card-vehicle upgrade routes cannot overspend or upgrade city vehicles',()=>{
 let r=hubbed(),id=r.state.trucks.find(t=>!t.cardId).id;
 const before=structuredClone(r.state);r=run(r.state,'hubVehicleUpgrade',{id,kind:'capacity'});assert.equal(r.state.coins,before.coins);
 r.state.inventory.hubVehicleParts=100;r.state.coins=2499;const small=run(r.state,'hubVehicleUpgrade',{id,kind:'capacity'});assert.equal(small.state.inventory.hubVehicleParts,100);assert.equal(small.state.coins,2499);
 const card=run(r.state,'hubVehicleUpgrade',{id:r.state.trucks.find(t=>t.cardId).id,kind:'speed'});assert.equal(card.state.inventory.hubVehicleParts,100);
});
test('Legacy city vehicles migrate once without deleting vehicles, losing capacity, ranks or paid modules',()=>{
 let r=hubbed(),s=structuredClone(r.state),t=s.trucks.find(t=>!t.cardId);delete s.hubSystemVersion;
 t.model='3,5-Tonner';t.tier=1;t.capacity=5;t.rarityLevel=50;t.moduleCapacityLevel=7;t.moduleCapacitySpent=7;t.purchasePrice=20000;
 delete s.inventory.hubVehicleParts;delete s.hubCrates;
 const beforeModules=s.inventory.capacityModules;
 r=run(s);const migrated=r.view.state.trucks.find(x=>x.id===t.id);
 assert.equal(migrated.model,'Stadttransporter');assert.equal(migrated.capacity,5);assert.equal(migrated.speed,1.25);assert.equal(migrated.hubSpeedLevel,10);assert.equal(r.state.inventory.capacityModules,beforeModules+7);
 const twice=run(r.state);assert.equal(twice.state.inventory.capacityModules,beforeModules+7);assert.deepEqual(twice.state.trucks,r.state.trucks);
});
