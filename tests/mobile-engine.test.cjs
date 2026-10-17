const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
const fixed=()=>.5;
test('Guest starts without a city, then all five mobile sections receive server view models',()=>{
 const guest=execute(null,'sync',{},now,fixed);
 assert.equal(guest.state.startCity,null);
 const game=execute(guest.state,'start',{id:'hamburg'},now,fixed);
 assert.equal(game.state.coins,1000);assert.equal(game.view.state.trucks.length,1);assert.equal(game.view.state.orders.length,5);assert.equal(game.view.templates.length,3);assert.equal(game.view.catalog.cards.length,15);
 const offer=game.view.state.orders.find(x=>x.choices.length);
 const active=execute(game.state,'assign',{order:offer.id,truck:offer.choices[0].id},now,fixed);
 assert.equal(active.state.orders.find(x=>x.id===offer.id).status,'active');
 const done=execute(active.state,'sync',{},now+86400000,fixed);
 assert.equal(done.state.orders.find(x=>x.id===offer.id).status,'completed');
 const claimed=execute(done.state,'claim',{id:offer.id},now+86400000,fixed);
 const twice=execute(claimed.state,'claim',{id:offer.id},now+86400000,fixed);
 assert.equal(twice.state.coins,claimed.state.coins);
 assert.equal(game.view.catalog.craftedOrderItems,10);
});
test('Untrusted clients cannot set coins, clocks, XP or invent engine commands',()=>{
 const start=execute(null,'start',{id:'hamburg'},now,fixed);
 const result=execute(start.state,'sync',{coins:1e12,xp:1e12,now:now+1e12},now,fixed);
 assert.equal(result.state.coins,1000);assert.equal(result.state.xp,0);assert.equal(result.view.serverTime,now);
 assert.throws(()=>execute(start.state,'__proto__',{},now),/Unbekannte/);
 assert.throws(()=>execute(start.state,'seat',{id:'navigator',template:-1,seat:0},now),/Ungültige/);
 assert.throws(()=>execute(start.state,'transport',{category:'national',kind:'__proto__'},now),/Ungültige/);
});
test('Persisted state is not mutated in place and level packages survive a round trip',()=>{
 const initial=execute(null,'start',{id:'hamburg'},now,fixed);
 const saved=JSON.stringify(initial.state);
 const next=execute(initial.state,'testCoins',{},now,fixed);
 assert.equal(JSON.stringify(initial.state),saved);assert.equal(next.state.coins,51000);
 next.state.inventory.overtimeRefills=2;
 const used=execute(next.state,'refill',{},now,fixed);
 assert.equal(used.state.inventory.overtimeRefills,1);assert.equal(used.state.overtimePoints,200);
 const restored=execute(JSON.parse(JSON.stringify(used.state)),'sync',{},now+600000,fixed);
 assert.equal(restored.state.inventory.overtimeRefills,1);assert.equal(restored.state.overtimePoints,200);
});

test('Company and fantasy city names are validated cosmetics and preserve existing progress',()=>{
 const one=execute(null,'foundCompany',{companyName:'  Nordstern  Logistik ',cityName:'Eichenhafen'},now,fixed);
 const two=execute(null,'foundCompany',{companyName:'Sonnenpfad',cityName:'Morgenfels'},now,fixed);
 assert.deepEqual(one.state.profile,{companyName:'Nordstern Logistik',cityName:'Eichenhafen'});
 assert.equal(one.state.startCity,'headquarters');
 assert.equal(one.state.trucks.length,1);
 assert.ok(one.state.orders.every(o=>o.from==='Eichenhafen'));
 const economy=x=>x.state.orders.map(o=>[o.distance,o.volume,o.category,o.routeType]);
 assert.deepEqual(economy(one),economy(two));
 assert.equal(one.state.coins,two.state.coins);
 const original=execute(null,'start',{id:'hamburg'},now,fixed);
 const rich=execute(original.state,'testCoins',{},now,fixed);
 const offer=rich.view.state.orders.find(o=>o.choices.length);
 const active=execute(rich.state,'assign',{order:offer.id,truck:offer.choices[0].id},now,fixed);
 const named=execute(active.state,'foundCompany',{companyName:'Alte Firma',cityName:'Neuhafen'},now,fixed);
 assert.equal(named.state.coins,active.state.coins);assert.equal(named.state.xp,active.state.xp);
 assert.equal(named.state.orders.find(o=>o.id===offer.id).status,'active');
 assert.equal(named.state.orders.find(o=>o.id===offer.id).distance,offer.distance);
 const repeated=execute(named.state,'foundCompany',{companyName:'Andere Firma',cityName:'Anderer Ort'},now,fixed);
 assert.deepEqual(repeated.state.profile,named.state.profile);
 const restored=execute(JSON.parse(JSON.stringify(named.state)),'sync',{},now,fixed);
 assert.deepEqual(restored.state.profile,named.state.profile);
 for(const invalid of ['', 'x', '<script>', 'a\nb','A'.repeat(41)])
  assert.throws(()=>execute(null,'foundCompany',{companyName:invalid,cityName:'Neuhafen'},now,fixed));
 assert.throws(()=>execute(null,'foundCompany',{companyName:'Firma',cityName:'x'.repeat(31)},now,fixed));
});

test('Collection facts retain upgrades outside the garage and do not expose job assignments',()=>{
 const initial=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 initial.state.inventory.capacityModules=1;initial.state.inventory.gears.common=1000;
 const id=initial.state.trucks[0].id;
 const capacity=execute(initial.state,'capacity',{id},now,fixed);
 const ranked=execute(capacity.state,'rank',{id},now,fixed);
 const metrics=ranked.view.cardVehicles.navigator;
 assert.equal(metrics.capacity,4.5);assert.equal(metrics.rank.total,1);
 const parked=execute(ranked.state,'garageRemove',{id:'navigator'},now,fixed);
 assert.deepEqual(parked.view.cardVehicles.navigator,metrics);
 const offer=ranked.view.state.orders.find(o=>o.choices.length);
 const active=execute(ranked.state,'assign',{order:offer.id,truck:id},now,fixed);
 assert.deepEqual(active.view.cardVehicles.navigator,metrics);
 for(const field of ['free','busyUntil','order','orderId','truckId','hubAssigned','progress'])
  assert.equal(Object.hasOwn(metrics,field),false);
});

test('Automatic offer reset handles deadline, pinned offers, running transport and offline catch-up',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const pinned=execute(start.state,'pin',{id:start.state.orders[0].id},now,fixed);
 const pinnedId=start.state.orders[0].id;
 const offer=pinned.view.state.orders.find(o=>o.id!==pinnedId&&o.choices.length);
 const setup=pinned.state.orders.find(o=>o.id===offer.id);setup.volume=40;setup.distance=100;
 const driving=execute(pinned.state,'assign',{order:offer.id,truck:offer.choices[0].id},now,fixed);
 driving.state.manualRefreshCount=3;
 const deadline=driving.state.nextAutoRefreshAt;
 const before=execute(driving.state,'sync',{},deadline-1,fixed);
 assert.equal(before.state.nextAutoRefreshAt,deadline);
 const refreshed=execute(before.state,'sync',{},deadline,fixed);
 assert.ok(refreshed.state.nextAutoRefreshAt>deadline);
 assert.equal(refreshed.state.manualRefreshCount,0);
 assert.equal(refreshed.state.stats.manualRefreshSpent,0);
 assert.equal(refreshed.state.orders.filter(o=>o.status==='available').length,refreshed.view.offers);
 assert.ok(refreshed.state.orders.some(o=>o.id===pinnedId&&o.pinned));
 assert.equal(refreshed.state.orders.find(o=>o.id===offer.id).status,'active');
 const ids=refreshed.state.orders.map(o=>o.id);
 assert.deepEqual(execute(refreshed.state,'sync',{},deadline,fixed).state.orders.map(o=>o.id),ids);
 const later=execute(refreshed.state,'sync',{},deadline+3*15*60000,fixed);
 assert.ok(later.state.nextAutoRefreshAt>deadline+3*15*60000);
 assert.ok(later.state.orders.some(o=>o.id===pinnedId&&o.pinned));
 assert.equal(later.state.orders.filter(o=>o.status==='available').length,later.view.offers);
});

test('Expedition map has five customer regions, seven places each and preserves the unlock rules',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 assert.equal(start.view.expeditionMap.length,5);
 assert.deepEqual(start.view.expeditionMap.map(r=>r.open),[true,false,false,false,false]);
 assert.deepEqual(start.view.expeditionMap.map(r=>r.customer.id),['nordbau','frischgut','stahlwerk','alpenhandel','eurolog']);
 assert.ok(start.view.expeditionMap.every(r=>r.places.length===7&&r.progress===0));
 const funded=execute(start.state,'testGrant',{kind:'expedition',amount:100},now,fixed);
 let state=funded.state;
 for(let i=0;i<7;i++)state=execute(state,'discover',{region:0},now,fixed).state;
 const explored=execute(state,'sync',{},now,fixed);
 assert.equal(explored.view.expeditionMap[0].discovered,7);
 assert.equal(explored.view.expeditionMap[0].deliveries,0);
 assert.equal(explored.view.expeditionMap[0].finalClaimed,false);
 assert.ok(explored.view.expeditionMap[0].progress>0&&explored.view.expeditionMap[0].progress<100);
 assert.equal(explored.view.expeditionMap[1].open,true);
 assert.equal(explored.view.expeditionMap[2].open,false);
 const mission=execute(explored.state,'mission',{region:0,kind:'delivery',place:0,truck:state.trucks[0].id},now,fixed);
 const end=mission.state.expedition.missions[0].endsAt;
 const done=execute(mission.state,'sync',{},end,fixed);
 const claimed=execute(done.state,'claimMission',{id:done.state.expedition.missions[0].id},end,fixed);
 assert.equal(claimed.view.expeditionMap[0].deliveries,1);
 assert.ok(claimed.view.expeditionMap[0].progress>explored.view.expeditionMap[0].progress);
});

test('Test grants persist points above capacity and XP produces normal level rewards',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const expedition=execute(start.state,'testGrant',{kind:'expedition',amount:100},now,fixed);
 assert.equal(expedition.state.expedition.points,150);
 const overtime=execute(expedition.state,'testGrant',{kind:'overtime',amount:100},now,fixed);
 assert.equal(overtime.state.overtimePoints,200);
 const xp=execute(overtime.state,'testGrant',{kind:'xp',amount:100},now,fixed);
 assert.equal(xp.state.xp,100);assert.equal(xp.view.level.level,2);
 assert.equal(xp.state.expedition.points,200);assert.equal(xp.state.inventory.overtimeRefills,1);
 assert.deepEqual(xp.state.pendingLevelUps,[2]);
 const large=execute(xp.state,'testGrant',{kind:'xp',amount:1000},now,fixed);
 assert.equal(large.state.xp,1100);
 assert.equal(large.state.inventory.overtimeRefills,large.view.level.level-1);
 const restored=execute(JSON.parse(JSON.stringify(large.state)),'sync',{},now+60000,fixed);
 assert.equal(restored.state.expedition.points,large.state.expedition.points);
 assert.equal(restored.state.overtimePoints,200);
 for(const amount of [-1,0,101,1e12,NaN,'100'])
  assert.throws(()=>execute(start.state,'testGrant',{kind:'expedition',amount},now,fixed));
 assert.throws(()=>execute(start.state,'testGrant',{kind:'__proto__',amount:100},now,fixed));
});

test('Endless draws return exact popup targets and test missions complete in fifteen seconds',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 start.state.expedition.regions[0].discovered=7;start.state.expedition.regions[0].endlessUnlocked=true;
 for(const roll of [.02,.08,.095,.2,.5,.97,.999]){
  const found=execute(start.state,'draw',{region:0},now,()=>roll);
  const find=found.view.expeditionFind;
  assert.ok(find?.title);assert.equal(found.state.expedition.points,start.state.expedition.points-5);
  if(find.type==='order'){
   const order=found.view.state.orders.find(o=>o.id===find.id);
   assert.equal(order.isProject,true);assert.equal(order.status,'queued');
  }else if(find.type==='job'){
   assert.ok(found.state.expedition.jobs.some(j=>j.id===find.id));
   const active=execute(found.state,'mission',{region:0,kind:'endless',place:find.id,truck:start.state.trucks[0].id},now,fixed);
   const mission=active.state.expedition.missions.at(-1);
   assert.equal(mission.endsAt-now,15000);
   assert.equal(mission.transport.tours.at(-1).endsAt,mission.endsAt);
   const halfway=execute(active.state,'sync',{},now+7500,fixed);
   assert.equal(halfway.state.expedition.missions.at(-1).endsAt,mission.endsAt);
   assert.equal(halfway.state.expedition.missions.at(-1).status,'active');
   const done=execute(halfway.state,'sync',{},now+15000,fixed);
   assert.equal(done.state.expedition.missions.at(-1).status,'completed');
   assert.equal(done.state.expedition.missions.at(-1).transport.delivered,mission.transport.volume);
   assert.ok(done.view.state.trucks[0].free);
  }else assert.equal(find.type,'reward');
 }
 for(const kind of ['delivery','final']){
  const mission=execute(start.state,'mission',{region:0,kind,place:0,truck:start.state.trucks[0].id},now,fixed);
  assert.equal(mission.state.expedition.missions[0].endsAt-now,15000);
 }
 const duplicate=execute(start.state,'draw',{region:0},now,()=>.02);
 assert.match(duplicate.view.expeditionFind.detail,/Shard/);
 const blocked=execute(start.state,'draw',{region:4},now,fixed);
 assert.equal(blocked.view.expeditionFind,undefined);
});

test('Existing expedition timers shorten once without resetting or deleting progress',()=>{
 const start=execute(null,'start',{id:'hamburg'},now,fixed);
 start.state.expedition.regions[0].discovered=1;
 start.state.expedition.missions.push({id:1,region:0,kind:'delivery',place:0,truckId:start.state.trucks[0].id,startedAt:now-1000,endsAt:now+3600000,status:'active'});
 const short=execute(start.state,'sync',{},now,fixed);
 assert.equal(short.state.expedition.missions[0].endsAt,now+15000);
 const second=execute(short.state,'sync',{},now+10000,fixed);
 assert.equal(second.state.expedition.missions[0].endsAt,now+15000);
 const done=execute(second.state,'sync',{},now+15000,fixed);
 assert.equal(done.state.expedition.missions[0].status,'completed');
 assert.equal(done.state.expedition.regions[0].discovered,1);
});

test('Each pending level grants exactly three permanent capacity points and cannot be claimed twice',()=>{
 const base=execute(null,'start',{id:'hamburg'},now,fixed);
 const earned=execute(base.state,'testGrant',{kind:'xp',amount:100},now,fixed);
 for(const expedition of [0,1,2,3]){
  const overtime=3-expedition;
  const result=execute(earned.state,'level',{expedition,overtime},now,fixed);
  assert.equal(result.view.expeditionCapacity,earned.view.expeditionCapacity+expedition);
  assert.equal(result.state.overtimeCapacity,earned.state.overtimeCapacity+overtime);
  assert.equal(result.state.expedition.points,earned.state.expedition.points+expedition);
  assert.equal(result.state.overtimePoints,earned.state.overtimePoints+overtime);
  assert.deepEqual(result.state.pendingLevelUps,[]);
  assert.equal(result.state.inventory.overtimeRefills,1);
  const twice=execute(result.state,'level',{expedition,overtime},now,fixed);
  assert.equal(twice.state.overtimeCapacity,result.state.overtimeCapacity);
 }
 const invalid=execute(earned.state,'level',{expedition:2,overtime:2},now,fixed);
 assert.deepEqual(invalid.state.pendingLevelUps,[2]);
 assert.equal(invalid.state.overtimeCapacity,earned.state.overtimeCapacity);
 assert.throws(()=>execute(earned.state,'level',{expedition:5},now,fixed),/Ungültige/);
});
