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
 const after=run(offline.state,'sync',{},now+49*H);assert.equal(after.state.hubs[0].cashboxParts,2);
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
test('Hub cycle view follows frozen hourly purchases and the actual 40-minute distribution window',()=>{
 const {hubCycle}=require('../src/hubCycle');let r=hubbed();const h=r.state.hubs[0],cycle=r.view.hubInfo.cycle;
 assert.equal(cycle.durationMs,H);assert.equal(cycle.workMs,40*60000);assert.equal(cycle.cashboxMax,6);
 assert.equal(cycle.quantity,Math.round(h.cycleCapacity*2/3*100)/100);
 let view=hubCycle(h,cycle,now+20*60000);assert.equal(view.minutes,20);assert.equal(view.emptyAt,2/3);assert.equal(view.idleMs,20*60000);assert.ok(Math.abs(view.remaining-.5)<1e-9);
 view=hubCycle(h,cycle,now+50*60000);assert.equal(view.remaining,0);assert.equal(view.waiting,true);
 assert.equal(hubCycle({...h,cashboxCycles:6},cycle,now).emptyAt,null);
 assert.equal(hubCycle(h,{...cycle,quantity:0},now).emptyAt,null);
 r.state.trucks.find(t=>!t.cardId).capacity=20;
 assert.equal(run(r.state).view.hubInfo.cycle.quantity,cycle.quantity);
});
test('Hub collection reports all credited rewards exactly once without changing the payout',()=>{
 let r=hubbed();r=run(r.state,'sync',{},now+H);const before=r.state,expected={coins:before.hubs[0].cashboxCoins,hints:before.hubs[0].cashboxHints,parts:before.hubs[0].cashboxParts};
 const coins=before.coins,hints=before.inventory.pickupHints,parts=before.inventory.hubVehicleParts;
 r=run(before,'hubCollect',{},now+H);assert.equal(r.view.claimSummary.source,'Stadthub');assert.equal(r.view.claimSummary.coins,expected.coins);assert.equal(r.view.claimSummary.pickupHints,expected.hints);assert.equal(r.view.claimSummary.hubVehicleParts,expected.parts);
 assert.ok(Math.abs(r.state.coins-coins-expected.coins)<1e-6);assert.equal(r.state.inventory.pickupHints-hints,expected.hints);assert.equal(r.state.inventory.hubVehicleParts-parts,expected.parts);
 r=run(r.state,'hubCollect',{},now+H);assert.equal(r.view.claimSummary.coins,0);assert.equal(r.view.claimSummary.pickupHints,0);assert.equal(r.view.claimSummary.hubVehicleParts,0);
});

test('Utilization purchases 40 to 50 minutes of frozen full-hour throughput and preserves paid partial claims',()=>{
 for(const [level,minutes] of [[0,40],[1,40.5],[20,50]]){
  let r=hubbed();r.state.hubs[0].salesLevel=level;r=run(r.state,'sync',{},now+H);
  const h=r.state.hubs[0],cycle=r.view.hubInfo.cycle;
  assert.equal(cycle.workMs,minutes*60000);assert.equal(cycle.workMinutes,minutes);assert.equal(cycle.salesMax,20);
  assert.equal(cycle.nextWorkMinutes,Math.min(50,minutes+.5));
  assert.equal(cycle.quantity,Math.round(h.cycleCapacity*minutes/60*100)/100);
  // Capacity and speed upgrades cannot alter goods already bought.
  const previousCash=h.cashboxCoins,snapshot=structuredClone(cycle),t=r.state.trucks.find(t=>!t.cardId);
  t.capacity*=2;t.hubSpeedLevel=10;
  r=run(r.state,'sync',{},now+H+20*60000);
  assert.equal(r.view.hubInfo.cycle.quantity,snapshot.quantity);
  r=run(r.state,'hubCollect',{},now+H+20*60000);const paid=r.view.claimSummary.coins;
  r=run(r.state,'hubCollect',{},now+H+20*60000);assert.equal(r.view.claimSummary.coins,0);
  r=run(r.state,'sync',{},now+H+minutes*60000);
  const margin=paid+r.state.hubs[0].cashboxCoins-previousCash;
  assert.ok(Math.abs(margin-snapshot.quantity*7)<.02);
  assert.equal(r.state.hubs[0].nextCycleAt,now+(minutes===60?3:2)*H);
  r=run(r.state,'sync',{},now+2*H);assert.ok(r.view.hubInfo.cycle.quantity>snapshot.quantity*2);
 }
});
test('Sales upgrades require only their exact items, preserve coins, and stop at stage twenty',()=>{
 let r=hubbed();r.state.coins=0;r.state.inventory.supplierContacts=5;r.state.inventory.companyItems=1;
 r=run(r.state,'hubUpgrade');assert.equal(r.state.coins,0);assert.equal(r.state.inventory.supplierContacts,0);assert.equal(r.state.inventory.companyItems,0);
 assert.equal(r.state.hubs[0].construction.level,1);assert.equal(r.state.hubs[0].construction.finishAt,now+12*H);assert.equal(r.view.hubInfo.upgradeCoins,0);
 assert.equal(r.state.stats.hubUpgradeSpent||0,0);
 r=run(r.state,'hubUpgrade');assert.equal(r.state.inventory.supplierContacts,0);
 r=run(r.state,'sync',{},now+12*H);assert.equal(r.state.hubs[0].salesLevel,1);
 r.state.hubs[0].salesLevel=19;r.state.inventory.supplierContacts=99;r.state.inventory.companyItems=1;
 r=run(r.state,'hubUpgrade',{},now+12*H);assert.equal(r.state.hubs[0].construction,null);assert.equal(r.state.inventory.supplierContacts,99);
 r.state.inventory.supplierContacts=100;r.state.inventory.companyItems=0;
 r=run(r.state,'hubUpgrade',{},now+12*H);assert.equal(r.state.hubs[0].construction,null);assert.equal(r.state.inventory.supplierContacts,100);
 r.state.inventory.companyItems=1;r=run(r.state,'hubUpgrade',{},now+12*H);
 assert.equal(r.state.hubs[0].construction.level,20);assert.equal(r.state.hubs[0].construction.finishAt,now+252*H);
 r=run(r.state,'sync',{},now+252*H);assert.equal(r.state.hubs[0].salesLevel,20);
 r.state.inventory.supplierContacts=1000;r.state.inventory.companyItems=100;
 r=run(r.state,'hubUpgrade',{},now+252*H);assert.equal(r.state.hubs[0].construction,null);assert.equal(r.state.inventory.supplierContacts,1000);
});
test('Retired sales stages return paid materials once and cancel only over-cap construction without rewriting a purchased cycle',()=>{
 let r=hubbed(),h=r.state.hubs[0];delete h.salesProgressionVersion;
 h.salesLevel=23;h.construction={level:24,startedAt:now-H,finishAt:now+287*H};
 h.cycleSalesLevel=23;h.cycleWorkMs=58.4*60000;h.cycleQuantity=100;h.cyclePaidCoins=0;
 const before=structuredClone(r.state),contacts=before.inventory.supplierContacts,items=before.inventory.companyItems,coins=before.coins;
 r=run(r.state);h=r.state.hubs[0];assert.equal(h.salesLevel,20);assert.equal(h.construction,null);
 assert.equal(r.state.inventory.supplierContacts,contacts+5*(21+22+23+24));assert.equal(r.state.inventory.companyItems,items+4);
 assert.equal(r.state.coins,coins+1700);assert.equal(h.cycleWorkMs,58.4*60000);assert.equal(h.cycleQuantity,100);assert.equal(h.cycleSalesLevel,23);
 const once=structuredClone(r.state);r=run(r.state);assert.equal(r.state.coins,once.coins);assert.deepEqual(r.state.inventory,once.inventory);
 r=run(r.state,'sync',{},now+H);assert.equal(r.view.hubInfo.cycle.workMs,50*60000);
 let valid=hubbed();delete valid.state.hubs[0].salesProgressionVersion;valid.state.hubs[0].salesLevel=18;
 valid.state.hubs[0].construction={level:19,startedAt:now-H,finishAt:now+H};
 valid=run(valid.state);assert.equal(valid.state.hubs[0].construction.finishAt,now+H);
 valid=run(valid.state,'sync',{},now+H);assert.equal(valid.state.hubs[0].salesLevel,19);
});
test('A full cashbox freezes until collection and restarts at zero without duplicate payouts or part rerolls',()=>{
 let r=hubbed();r=run(r.state,'sync',{},now+6*H+21*60000);
 const full=structuredClone(r.state.hubs[0]),trucks=structuredClone(r.state.trucks);
 r=run(r.state,'sync',{},now+12*H+21*60000);
 assert.deepEqual(r.state.hubs[0],full);assert.deepEqual(r.state.trucks,trucks);
 r=run(r.state,'hubCollect',{},now+12*H+21*60000);
 assert.equal(r.view.claimSummary.coins,full.cashboxCoins);
 assert.equal(r.state.hubs[0].nextCycleAt,now+13*H+21*60000);
 assert.equal(r.state.hubs[0].cyclePaidCoins,0);assert.equal(r.state.hubs[0].cashboxCycles,0);
 const attempts=r.state.hubs[0].partsAttempts;
 r=run(r.state,'hubCollect',{},now+12*H+21*60000);
 assert.equal(r.view.claimSummary.coins,0);assert.equal(r.state.hubs[0].partsAttempts,attempts);
});
test('An existing legacy purchase finishes at its original payout then adopts the new utilization rules',()=>{
 let r=hubbed(),h=r.state.hubs[0];delete h.cycleVersion;delete h.cycleWorkMs;delete h.cycleQuantity;delete h.cycleVehicles;
 h.cycleCapacity=100;h.cycleSalesLevel=0;h.cyclePaidCoins=250;h.cyclePaidHints=3;h.cyclePaidTons=25;h.cashboxCoins=250;h.cashboxHints=3;h.totalTons=25;h.cycleHintTotal=9;
 r=run(r.state,'sync',{},now+45*60000);
 assert.equal(r.state.hubs[0].cashboxCoins,525);assert.equal(r.state.hubs[0].totalTons,75);assert.equal(r.view.hubInfo.cycle.workMs,45*60000);
 r=run(r.state,'sync',{},now+H);assert.equal(r.state.hubs[0].cashboxCoins,525);assert.equal(r.view.hubInfo.cycle.workMs,40*60000);
});

test('Courier presentation keeps persistent IDs, state and non-hub names intact',()=>{
 const r=hubbed(),original=r.state.trucks.find(t=>!t.cardId),shown=r.view.state.trucks.find(t=>t.id===original.id);
 assert.match(original.id,/^LKW-/);assert.equal(original.model,'Stadttransporter');
 assert.equal(shown.displayName,original.id.replace('LKW-','Bote '));assert.equal(shown.displayModel,'Lastwombat');
 assert.equal(shown.id,original.id);assert.equal(shown.capacity,original.capacity);
 const {courierName,courierModel,courierText}=require('../functions/src/hub-courier.js');
 assert.equal(courierName({...original,name:'Eigener Name'}),'Eigener Name');
 assert.equal(courierModel({...original,model:'Eigenes Modell'}),'Eigenes Modell');
 assert.equal(courierText(`${original.id} und LKW-999`,[original]),`${shown.displayName} und LKW-999`);
 assert.equal(courierText(`Firma ${original.id} meldet ${original.id}`,[original],{companyName:`Firma ${original.id}`}),`Firma ${original.id} meldet ${shown.displayName}`);
});
