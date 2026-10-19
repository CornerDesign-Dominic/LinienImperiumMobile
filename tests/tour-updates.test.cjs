const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const T=1800000000000,random=()=>.5,EVENT='large-project-own-overtime';
const cmd=(state,action='sync',payload={},at=T)=>execute(state,action,payload,at,random);
const order=result=>result.state.orders.find(o=>o.id==='TEST');
const viewOrder=result=>result.view.state.orders.find(o=>o.id==='TEST');
function setup(ids=['navigator']){
 let r=cmd(null,'start',{id:'hamburg'});
 for(const id of ids){
  r.state.expedition.characters[id]||={level:1,progress:0};
  if(!r.state.trucks.some(t=>t.cardId===id))r=cmd(r.state,'garageAdd',{id});
 }
 r.state.inventory.gears={common:10000,uncommon:10000,rare:10000,epic:10000,legendary:10000};
 r.state.inventory.capacityModules=100;
 r.state.expedition.shards={common:10000,uncommon:10000,rare:10000};
 r.state.overtimePoints=1000;
 return r;
}
function single(ids=['navigator'],volume=40){
 let r=setup(ids),base=r.state.orders[0];
 r.state.orders=[{...base,id:'TEST',kind:'normal',status:'available',category:'national',customer:null,volume,baseVolume:volume,distance:120,routeType:'single',delivered:0}];
 return cmd(r.state,'assign',{order:'TEST',truck:r.state.trucks[0].id});
}
function fleet(ids=['navigator','r1_rare'],distance=120){
 let r=setup(ids),base=r.state.orders[0];
 r.state.expedition.seats=[...ids,...Array(5-ids.length).fill(null)];
 r.state.orders=[{...base,id:'TEST',kind:'special',status:'queued',category:'national',customer:null,volume:200,baseVolume:200,distance,routeType:'single',delivered:0,deadlineMs:86400000,projectName:'Testprojekt'}];
 return cmd(r.state,'projectStart',{id:'TEST',template:0});
}
const activeVehicles=r=>order(r).project.vehicles.filter(v=>v.cargo>0);
const booked=r=>({tons:order(r).delivered,revenue:r.state.stats.grossRevenue,cost:r.state.stats.operatingCosts,xp:r.state.xp,trips:r.state.stats.trips});

test('Single: speed upgrades preserve the current end and accounting, then change the following tour',()=>{
 const start=single(),old=JSON.parse(JSON.stringify(order(start).tripSnapshot));
 let improved=cmd(start.state,'cardRank',{id:'navigator'},T+1000);
 assert.deepEqual(order(improved).tripSnapshot,old);
 assert.equal(viewOrder(improved).tripEndsAt,old.endsAt);
 assert.ok(viewOrder(improved).runningEndsAt<viewOrder(start).runningEndsAt);
 assert.equal(order(cmd(improved.state,'sync',{},old.endsAt-1)).delivered,0);
 const done=cmd(improved.state,'sync',{},old.endsAt);
 assert.equal(order(done).delivered,old.cargo);
 assert.equal(done.state.stats.grossRevenue,old.accounting.revenue);
 assert.equal(done.state.stats.operatingCosts,old.accounting.cost);
 assert.equal(done.state.xp,old.accounting.xp);
 assert.ok(order(done).tripSnapshot.endsAt-old.endsAt<old.endsAt-T);
 assert.equal(order(done).tripSnapshot.vehicle.rarityLevel,1);
});

test('Single: capacity increases never reload an active tour and only affect the next load',()=>{
 const start=single(),old=order(start).tripSnapshot;
 const changed=cmd(start.state,'cardCapacity',{id:'navigator'},T+1000);
 assert.equal(order(changed).tripCargo,old.cargo);
 assert.equal(viewOrder(changed).tripEndsAt,old.endsAt);
 const next=cmd(changed.state,'sync',{},old.endsAt);
 assert.equal(order(next).tripCargo,old.cargo+.5);
 assert.equal(order(next).delivered,old.cargo);
});

test('Single: own cost and garage pay bonuses freeze the old tour and update future accounting',()=>{
 const start=single(['navigator','r3_uncommon']),old=JSON.parse(JSON.stringify(order(start).tripSnapshot));
 let changed=cmd(start.state,'cardUpgrade',{id:'navigator'},T+1000);
 changed=cmd(changed.state,'cardUpgrade',{id:'r3_uncommon'},T+1000);
 assert.deepEqual(order(changed).tripSnapshot,old);
 const next=cmd(changed.state,'sync',{},old.endsAt);
 assert.equal(next.state.stats.grossRevenue,old.accounting.revenue);
 assert.equal(next.state.stats.operatingCosts,old.accounting.cost);
 assert.ok(order(next).tripSnapshot.accounting.revenue>old.accounting.revenue);
 assert.ok(order(next).tripSnapshot.accounting.cost<old.accounting.cost);
});

test('Single: replacement is reserved, cannot run another order or leave the garage, and switches at the boundary',()=>{
 const start=single(['navigator','r1_rare']),old=order(start).tripSnapshot;
 const replacement=start.state.trucks.find(t=>t.cardId==='r1_rare');
 const queued=cmd(start.state,'singleVehicle',{order:'TEST',truck:replacement.id},T+1000);
 assert.equal(order(queued).truckId,order(start).truckId);
 assert.equal(order(queued).pendingTruckId,replacement.id);
 assert.equal(queued.view.state.trucks.find(t=>t.id===replacement.id).free,false);
 const removed=cmd(queued.state,'garageRemove',{id:'r1_rare'},T+1000);
 assert.ok(removed.state.trucks.some(t=>t.id===replacement.id));
 const copy=JSON.parse(JSON.stringify(queued.state));copy.orders.push({...copy.orders[0],id:'OTHER',status:'available',tripSnapshot:undefined});
 const other=cmd(copy,'assign',{order:'OTHER',truck:replacement.id},T+1000);
 assert.equal(other.state.orders.find(o=>o.id==='OTHER').status,'available');
 const swapped=cmd(queued.state,'sync',{},old.endsAt);
 assert.equal(order(swapped).truckId,replacement.id);
 assert.equal(order(swapped).tripSnapshot.vehicle.cardId,'r1_rare');
 assert.equal(order(swapped).delivered,old.cargo);
 assert.equal(swapped.state.stats.trips,1);
 assert.equal(order(swapped).tripStartAt,old.endsAt);
});

test('Single: pending changes can be cancelled and a final tour never launches a reserved replacement',()=>{
 for(const finish of [false,true]){
  const start=single(['navigator','r1_rare'],finish?4:40),replacement=start.state.trucks.find(t=>t.cardId==='r1_rare');
  let queued=cmd(start.state,'singleVehicle',{order:'TEST',truck:replacement.id});
  if(!finish){queued=cmd(queued.state,'singleVehicle',{order:'TEST',truck:order(start).truckId});assert.equal(order(queued).pendingTruckId,undefined);}
  const next=cmd(queued.state,'sync',{},order(start).tripSnapshot.endsAt);
  assert.equal(order(next).truckId,order(start).truckId);
  assert.equal(next.state.trucks.find(t=>t.id===replacement.id).toursCompleted,0);
  assert.equal(order(next).pendingTruckId,undefined);
  if(finish)assert.equal(order(next).status,'completed');
 }
});

test('Single: rejects unowned, busy and nonexistent assignments without changing the input',()=>{
 const start=single(['navigator','r1_rare']);
 const copy=JSON.parse(JSON.stringify(start.state));
 copy.orders.push({...copy.orders[0],id:'OTHER',truckId:copy.trucks[1].id});
 const before=JSON.stringify(copy);
 assert.throws(()=>cmd(copy,'singleVehicle',{order:'TEST',truck:copy.trucks[1].id}),/nicht frei/);
 assert.equal(JSON.stringify(copy),before);
 assert.throws(()=>cmd(start.state,'singleVehicle',{order:'TEST',truck:'forged'}),/nicht frei/);
 assert.throws(()=>cmd(start.state,'singleVehicle',{order:'missing',truck:start.state.trucks[0].id}),/nicht aktiv/);
});

test('Fleet: an upgrade changes the ETA immediately, not the current load, deadline or nextAt',()=>{
 const start=fleet(),original=JSON.parse(JSON.stringify(activeVehicles(start)));
 const upgraded=cmd(start.state,'cardCapacity',{id:'navigator'},T+1000);
 assert.deepEqual(activeVehicles(upgraded),original);
 assert.equal(order(upgraded).project.deadlineAt,order(start).project.deadlineAt);
 assert.ok(viewOrder(upgraded).eta<viewOrder(start).eta);
 const at=original.find(v=>v.cardId==='navigator').nextAt;
 const next=cmd(upgraded.state,'sync',{},at);
 assert.equal(activeVehicles(next).find(v=>v.cardId==='navigator').capacity,4.5);
});

test('Fleet: replacement drains the old tour and waits if the desired card is still in another slot',()=>{
 const start=fleet(),old=activeVehicles(start);
 let swap=cmd(start.state,'seat',{id:'r1_rare',template:0,seat:0},T+1000);
 swap=cmd(swap.state,'seat',{id:'navigator',template:0,seat:1},T+1000);
 assert.deepEqual(activeVehicles(swap),old);
 const first=Math.min(...old.map(v=>v.nextAt));
 const middle=cmd(swap.state,'sync',{},first);
 const active=activeVehicles(middle);
 assert.equal(new Set(active.map(v=>v.cardId)).size,active.length,'A card may never drive in two slots');
 const both=Math.max(...old.map(v=>v.nextAt));
 const next=cmd(middle.state,'sync',{},both);
 assert.equal(activeVehicles(next).find(v=>v.slot===0).cardId,'r1_rare');
 assert.equal(activeVehicles(next).find(v=>v.slot===1).cardId,'navigator');
 assert.equal(next.state.stats.trips,2);
});

test('Fleet: emptying a template drains current tours, pauses without wasting overtime, and resumes on adding a card',()=>{
 let r=fleet(['navigator']),end=activeVehicles(r)[0].nextAt;
 r=cmd(r.state,'unseat',{template:0,seat:0},T+1000);
 assert.equal(viewOrder(r).eta,null);
 r=cmd(r.state,'sync',{},end);
 assert.equal(activeVehicles(r).length,0);
 const points=r.state.overtimePoints,delivered=order(r).delivered;
 const spent=cmd(r.state,'overtime',{id:'TEST',amount:10},end);
 assert.equal(spent.state.overtimePoints,points);
 assert.equal(order(spent).delivered,delivered);
 const resumed=cmd(spent.state,'seat',{id:'navigator',template:0,seat:0},end+1000);
 assert.equal(activeVehicles(resumed).length,1);
 assert.equal(activeVehicles(resumed)[0].tripStartedAt,end+1000);
 assert.ok(viewOrder(resumed).eta>end+1000);
});

test('Fleet: an added slot starts a new tour without restarting existing vehicles',()=>{
 const start=fleet(['navigator']);start.state.expedition.characters.r1_rare={level:1,progress:0};
 const added=cmd(start.state,'seat',{id:'r1_rare',template:0,seat:3},T+1000);
 assert.deepEqual(activeVehicles(added).find(v=>v.cardId==='navigator'),activeVehicles(start)[0]);
 assert.equal(activeVehicles(added).find(v=>v.cardId==='r1_rare').tripStartedAt,T+1000);
});

test('Fleet: pay, cost, XP and speed donor upgrades update only newly started receiver tours',()=>{
 for(const donor of ['forscherin','r2_rare','pionierin','r1_rare']){
  const start=fleet(['navigator',donor]),old=JSON.parse(JSON.stringify(activeVehicles(start)));
  const changed=cmd(start.state,'cardUpgrade',{id:donor},T+1000);
  assert.deepEqual(activeVehicles(changed),old);
  const receiver=old.find(v=>v.cardId==='navigator'),at=receiver.nextAt;
  const next=cmd(changed.state,'sync',{},at),fresh=activeVehicles(next).find(v=>v.cardId==='navigator');
  if(donor==='forscherin')assert.ok(fresh.tripAccounting.revenue>receiver.tripAccounting.revenue);
  if(donor==='r2_rare')assert.ok(fresh.tripAccounting.cost<receiver.tripAccounting.cost);
  if(donor==='pionierin')assert.ok(fresh.tripAccounting.xp>receiver.tripAccounting.xp);
  if(donor==='r1_rare')assert.ok(fresh.nextAt-at<receiver.nextAt-T);
 }
});

test('Fleet: replacing a bonus giver never grants its new bonus before its old tour finishes',()=>{
 const start=fleet(['navigator','forscherin']);start.state.expedition.characters.r2_rare={level:1,progress:0};
 const receiver=activeVehicles(start).find(v=>v.cardId==='navigator'),donor=activeVehicles(start).find(v=>v.cardId==='forscherin');
 const queued=cmd(start.state,'seat',{id:'r2_rare',template:0,seat:1},T+1000);
 assert.deepEqual(activeVehicles(queued).find(v=>v.cardId==='navigator').tripAccounting,receiver.tripAccounting);
 const before=cmd(queued.state,'sync',{},donor.nextAt-1);
 assert.equal(activeVehicles(before).some(v=>v.cardId==='r2_rare'),false);
 const after=cmd(before.state,'sync',{},donor.nextAt);
 assert.ok(activeVehicles(after).some(v=>v.cardId==='r2_rare'));
 assert.equal(activeVehicles(after).some(v=>v.cardId==='forscherin'),false);
});

test('Fleet: partial overtime retains original accounting after upgrades and cannot pay a load twice',()=>{
 const start=fleet(['navigator','forscherin'],1000);
 const target=activeVehicles(start).slice().sort((a,b)=>a.nextAt-b.nextAt)[0];
 const partial=cmd(start.state,'overtime',{id:'TEST',amount:1},T+1000);
 const updated=cmd(partial.state,'cardUpgrade',{id:'forscherin'},T+1000);
 assert.deepEqual(activeVehicles(updated).find(v=>v.cardId===target.cardId).tripAccounting,target.tripAccounting);
 assert.equal(activeVehicles(updated).find(v=>v.cardId===target.cardId).nextAt,target.nextAt);
 const at=target.nextAt;
 const result=cmd(updated.state,'sync',{},at),control=cmd(start.state,'sync',{},at);
 assert.deepEqual(booked(result),booked(control),'Partial early delivery plus arrival must equal the frozen full tour');
 assert.deepEqual(booked(cmd(result.state,'sync',{},at)),booked(result));
});

test('Fleet: forecasting is pure and offline settlement matches frequent synchronization after changes',()=>{
 let changed=fleet(['navigator','forscherin']);
 changed=cmd(changed.state,'cardCapacity',{id:'navigator'},T+1000);
 changed=cmd(changed.state,'cardUpgrade',{id:'forscherin'},T+1000);
 const saved=JSON.stringify(changed.state),end=T+1200000;
 const offline=cmd(changed.state,'sync',{},end);
 assert.equal(JSON.stringify(changed.state),saved);
 let frequent=changed;
 for(let at=T+30000;at<=end;at+=30000)frequent=cmd(frequent.state,'sync',{},at);
 assert.deepEqual(booked(offline),booked(frequent));
 assert.deepEqual(order(offline).project,order(frequent).project);
});

test('Event and customer project sharing a template both change at their own tour boundaries',()=>{
 let r=fleet(['navigator']);
 r=cmd(r.state,'eventStart',{id:EVENT,run:0},T+1000);
 r=cmd(r.state,'eventFleet',{id:EVENT,run:1,template:0},T+1000);
 const eventBefore=JSON.parse(JSON.stringify(r.view.testEvents[0].project.vehicles[0])),projectBefore=activeVehicles(r)[0];
 r=cmd(r.state,'cardCapacity',{id:'navigator'},T+2000);
 assert.equal(activeVehicles(r)[0].cargo,projectBefore.cargo);
 assert.equal(r.view.testEvents[0].project.vehicles[0].cargo,eventBefore.cargo);
 const end=Math.max(eventBefore.nextAt,projectBefore.nextAt);
 const next=cmd(r.state,'sync',{},end);
 assert.equal(activeVehicles(next)[0].capacity,4.5);
 assert.equal(next.view.testEvents[0].project.vehicles[0].capacity,4.5);
 assert.ok(next.view.testEvents[0].project.delivered>=4);
});

test('Event: long offline periods and template replacement preserve earned progress and avoid duplicated cards',()=>{
 let r=setup(['navigator','r1_rare']);r.state.expedition.seats[0]='navigator';
 r=cmd(r.state,'eventStart',{id:EVENT,run:0});r=cmd(r.state,'eventFleet',{id:EVENT,run:1,template:0});
 const old=r.view.testEvents[0].project.vehicles[0],end=old.nextAt;
 r=cmd(r.state,'seat',{id:'r1_rare',template:0,seat:0},T+1000);
 assert.equal(r.view.testEvents[0].project.vehicles[0].cardId,'navigator');
 r=cmd(r.state,'sync',{},end);
 assert.equal(r.view.testEvents[0].project.delivered,old.capacity);
 assert.equal(r.view.testEvents[0].project.vehicles[0].cardId,'r1_rare');
 const later=cmd(r.state,'sync',{},end+365*86400000);
 assert.ok(later.view.testEvents[0].project.delivered>old.capacity);
 assert.equal(later.view.testEvents[0].project.vehicles.length,1);
 const again=cmd(JSON.parse(JSON.stringify(later.state)),'sync',{},end+365*86400000);
 assert.deepEqual(again.state.eventTests,later.state.eventTests);
});

test('Transport expedition: capacity upgrade preserves the current tour but changes the remaining plan',()=>{
 let r=setup();r.state.expedition.regions[0].endlessUnlocked=true;r.state.expedition.regions[0].discovered=7;
 r.state.expedition.jobs.push({id:999,region:0,kind:'material',tier:3});
 r=cmd(r.state,'mission',{region:0,kind:'endless',place:999,truck:r.state.trucks[0].id});
 const mission=r.state.expedition.missions.at(-1),current=mission.transport.tours[0];
 const changed=cmd(r.state,'cardCapacity',{id:'navigator'},T+1);
 const fresh=changed.state.expedition.missions.at(-1);
 assert.deepEqual(fresh.transport.tours[0],current);
 assert.equal(fresh.transport.tours[1].cargo,4.5);
 const first=cmd(changed.state,'sync',{},current.endsAt);
 assert.equal(first.state.expedition.missions.at(-1).transport.delivered,current.cargo);
 assert.equal(first.state.expedition.missions.at(-1).transport.tours[1].cargo,4.5);
});

test('Fleet: simultaneous arrivals activate a replacement donor before any of the next tours start',()=>{
 const start=fleet(['navigator','forscherin']);start.state.expedition.characters.r2_rare={level:1,progress:0};
 const at=Math.max(...activeVehicles(start).map(v=>v.nextAt));
 for(const v of activeVehicles(start))v.nextAt=at;
 const queued=cmd(start.state,'seat',{id:'r2_rare',template:0,seat:1},T+1000);
 const next=cmd(queued.state,'sync',{},at);
 const receiver=activeVehicles(next).find(v=>v.cardId==='navigator');
 assert.equal(receiver.bonusStats.pay,0);
 assert.equal(receiver.bonusStats.cost,6,'Own 1% plus the new donor 5%');
 assert.equal(receiver.tripStartedAt,at);
 assert.equal(next.state.stats.trips,2);
});

test('Single: XP bonus upgrades apply after the boundary and do not rewrite XP of a running tour',()=>{
 const start=single(['navigator','r5_uncommon']),old=order(start).tripSnapshot;
 const improved=cmd(start.state,'cardUpgrade',{id:'r5_uncommon'},T+1000);
 const next=cmd(improved.state,'sync',{},old.endsAt);
 assert.equal(next.state.xp,old.accounting.xp);
 assert.ok(order(next).tripSnapshot.accounting.xp>old.accounting.xp);
});

test('Fleet: legacy snapshots without slot ids migrate without duplicating a card in sparse templates',()=>{
 let start=fleet(['navigator']);
 start.state.expedition.seats=[null,null,null,'navigator',null];
 order(start).project.vehicles=activeVehicles(start).map(v=>{const copy={...v};delete copy.slot;return copy;});
 const original=order(start).project.vehicles[0];
 const synced=cmd(start.state);
 assert.equal(activeVehicles(synced).length,1);
 assert.equal(activeVehicles(synced)[0].slot,3);
 assert.equal(activeVehicles(synced)[0].nextAt,original.nextAt);
 const next=cmd(synced.state,'sync',{},original.nextAt);
 assert.equal(activeVehicles(next).length,1);
 assert.equal(order(next).delivered,original.cargo);
});

test('Single: total forecast and completion use frozen plus updated economics exactly once',()=>{
 const start=single(['navigator','r3_uncommon'],8);
 const improved=cmd(start.state,'cardUpgrade',{id:'r3_uncommon'},T+1000);
 const forecast=viewOrder(improved).forecast,eta=viewOrder(improved).runningEndsAt;
 const end=cmd(improved.state,'sync',{},eta);
 assert.equal(order(end).status,'completed');
 assert.equal(end.state.stats.grossRevenue,forecast.revenue);
 assert.equal(end.state.stats.operatingCosts,forecast.cost);
 assert.equal(end.state.xp,forecast.xp);
 const again=cmd(JSON.parse(JSON.stringify(end.state)),'sync',{},eta+1000);
 assert.deepEqual(booked(again),booked(end));
});

for(const offset of [-1,0,1])test(`Boundary: upgrade ${offset<0?'just before':offset===0?'exactly at':'just after'} arrival respects server event order`,()=>{
 for(const kind of ['single','fleet','event']){
  let r=kind==='fleet'?fleet(['navigator']):single();
  if(kind==='event'){
    r.state.orders=[];r.state.expedition.seats[0]='navigator';
    r=cmd(r.state,'eventStart',{id:EVENT,run:0});r=cmd(r.state,'eventFleet',{id:EVENT,run:1,template:0});
  }
  const vehicle=result=>kind==='single'?order(result).tripSnapshot.vehicle:kind==='fleet'?activeVehicles(result)[0]:result.view.testEvents[0].project.vehicles[0];
  const end=kind==='single'?order(r).tripSnapshot.endsAt:vehicle(r).nextAt;
  r=cmd(r.state,'cardRank',{id:'navigator'},end+offset);
  assert.equal(vehicle(r).rarityLevel,0,'A tour already in progress cannot adopt the upgrade');
  const checkAt=offset<0?end:kind==='single'?order(r).tripSnapshot.endsAt:vehicle(r).nextAt;
  r=cmd(r.state,'sync',{},checkAt);
  assert.equal(vehicle(r).rarityLevel,1,'The first tour started after the upgrade uses it');
 }
});

test('Fleet: projected remaining revenue, cost and XP match actual settlement after a donor swap',()=>{
 let r=fleet(['navigator','forscherin']);r.state.expedition.characters.r2_rare={level:1,progress:0};
 r=cmd(r.state,'seat',{id:'r2_rare',template:0,seat:1},T+1000);
 const before=booked(r),projection=viewOrder(r).projection;
 const finished=cmd(r.state,'sync',{},projection.eta);
 assert.equal(order(finished).status,'completed');
 assert.equal(round(finished.state.stats.grossRevenue-before.revenue),projection.revenue);
 assert.equal(round(finished.state.stats.operatingCosts-before.cost),projection.cost);
 assert.equal(round(finished.state.xp-before.xp),projection.xp);
 function round(v){return Math.round(v*100)/100;}
});

test('Fleet: removing the whole fleet and using overtime only charges the remaining movable load',()=>{
 let r=fleet(['navigator']);r=cmd(r.state,'unseat',{template:0,seat:0},T+1000);
 const cargo=activeVehicles(r)[0].cargo,points=r.state.overtimePoints;
 r=cmd(r.state,'overtime',{id:'TEST',amount:10},T+1000);
 assert.equal(order(r).delivered,cargo);
 assert.equal(r.state.overtimePoints,points-1);
 assert.equal(activeVehicles(r).length,0);
 assert.equal(viewOrder(r).eta,null);
});

test('Legacy single snapshots initialize once without extra deliveries, spending or replay after reload',()=>{
 const start=single(),frozen=order(start).tripSnapshot;
 delete order(start).tripSnapshot;
 const migrated=cmd(start.state,'sync',{},T+1000);
 assert.equal(order(migrated).tripSnapshot.endsAt,frozen.endsAt);
 assert.equal(order(migrated).delivered,0);
 assert.equal(migrated.state.coins,start.state.coins);
 const arrived=cmd(migrated.state,'sync',{},frozen.endsAt);
 assert.equal(order(arrived).delivered,frozen.cargo);
 assert.deepEqual(booked(cmd(JSON.parse(JSON.stringify(arrived.state)),'sync',{},frozen.endsAt)),booked(arrived));
});
