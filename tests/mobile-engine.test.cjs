const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute,session}=require('../functions/src/engine.cjs');
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
 for(let i=0;i<7;i++)for(let point=0;point<funded.view.expeditionMap[0].places[i].discoveryCost;point++)state=execute(state,'discover',{region:0},now,fixed).state;
 const explored=execute(state,'sync',{},now,fixed);
 assert.equal(explored.view.expeditionMap[0].discovered,7);
 assert.equal(explored.view.expeditionMap[0].deliveries,0);
 assert.equal(explored.view.expeditionMap[0].finalClaimed,false);
 assert.equal(explored.state.inventory.capacityModules,1);
 assert.equal(execute(explored.state,'discover',{region:0},now,fixed).state.inventory.capacityModules,1);
 assert.equal(explored.view.expeditionMap[0].progress,100);
 assert.equal(explored.view.expeditionMap[1].open,true);
 assert.equal(explored.view.expeditionMap[2].open,false);
 const mission=execute(explored.state,'mission',{region:0,kind:'delivery',place:0,truck:state.trucks[0].id},now,fixed);
 const end=mission.state.expedition.missions[0].endsAt;
 const done=execute(mission.state,'sync',{},end,fixed);
 const claimed=execute(done.state,'claimMission',{id:done.state.expedition.missions[0].id},end,fixed);
 assert.equal(claimed.view.expeditionMap[0].deliveries,1);
 assert.equal(claimed.view.expeditionMap[0].progress,100);
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

test('Transport upgrades save multiple segments atomically at cumulative server prices',()=>{
 const start=execute(null,'start',{id:'hamburg'},now,fixed);
 start.state.coins=100000;start.state.inventory.companyItems=100;
 const original=JSON.stringify(start.state);
 const upgrades=[{category:'national',kind:'premium',count:3,level:0},{category:'international',kind:'range',count:2,level:0}];
 const result=execute(start.state,'transportBatch',{upgrades},now,fixed);
 assert.equal(JSON.stringify(start.state),original);
 assert.equal(result.view.transportBatchApplied,true);
 assert.equal(result.state.company.transportUpgrades.national.premiumLevel,3);
 assert.equal(result.state.company.transportUpgrades.international.rangeLevel,2);
 assert.equal(result.state.coins,100000-(10+40+90+100+400));
 assert.equal(result.state.inventory.companyItems,90);
 assert.equal(result.state.stats.transportUpgradeSpent,640);
 assert.equal(result.view.transportUpgradeOptions.length,6);
 const next=result.view.transportUpgradeOptions.find(o=>o.category==='national'&&o.kind==='premium');
 assert.equal(next.level,3);assert.equal(next.costs[0].coins,160);
 assert.throws(()=>execute(result.state,'transportBatch',{upgrades},now,fixed),/geändert/);
 const poor=structuredClone(start.state);poor.inventory.companyItems=9;
 const before=JSON.stringify(poor);
 assert.throws(()=>execute(poor,'transportBatch',{upgrades},now,fixed),/fehlen/);
 assert.equal(JSON.stringify(poor),before);
 const lowCoins=structuredClone(start.state);lowCoins.coins=639;
 assert.throws(()=>execute(lowCoins,'transportBatch',{upgrades},now,fixed),/fehlen/);
 for(const invalid of [[],[upgrades[0],upgrades[0]],[{...upgrades[0],count:0}],[{...upgrades[0],kind:'__proto__'}],[{...upgrades[0],count:101}],[{...upgrades[0],level:1}]])
  assert.throws(()=>execute(start.state,'transportBatch',{upgrades:invalid},now,fixed));
 const boundary=structuredClone(start.state);boundary.company.transportUpgrades.national.premiumLevel=99;
 const capped=execute(boundary,'transportBatch',{upgrades:[{category:'national',kind:'premium',count:1,level:99}]},now,fixed);
 assert.equal(capped.state.company.transportUpgrades.national.premiumLevel,100);
 assert.deepEqual(capped.view.transportUpgradeOptions.find(o=>o.category==='national'&&o.kind==='premium').costs,[]);
});

test('Single-order views expose forecasts, truck availability and live trip timing without rolling rewards',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const raw=start.state.orders.find(o=>o.category==='national');
 raw.volume=8;raw.distance=30;raw.routeType='dual';
 const preview=execute(start.state,'sync',{},now,fixed);
 const offer=preview.view.state.orders.find(o=>o.id===raw.id),choice=offer.choices[0];
 assert.equal(offer.vehicleStatus,'ready');
 assert.equal(choice.xp,16);assert.equal(offer.baseXp,16);
 assert.equal(offer.forecast.totalProfit,choice.totalProfit);
 assert.ok(offer.possibleRewards.includes('Common-Zahnräder'));
 assert.ok(!offer.completionReward);
 const active=execute(preview.state,'assign',{order:offer.id,truck:choice.id},now,fixed);
 const driving=active.view.state.orders.find(o=>o.id===offer.id);
 assert.equal(active.view.message,'Auftrag gestartet.');
 assert.ok(driving.tripEndsAt>now);assert.ok(driving.runningEndsAt>=driving.tripEndsAt);
 assert.equal(driving.forecast.id,choice.id);assert.equal(driving.forecast.xp,16);
 assert.equal(driving.choices.length,0);
 const unavailable=active.view.state.orders.find(o=>o.status==='available'&&o.category==='national');
 assert.equal(unavailable.vehicleStatus,'busy');
 const missing=active.view.state.orders.find(o=>o.status==='available'&&o.category==='international');
 if(missing)assert.equal(missing.vehicleStatus,'missing');
 const parked=execute(start.state,'garageRemove',{id:'navigator'},now,fixed);
 assert.equal(parked.view.state.orders.find(o=>o.id===raw.id).vehicleStatus,'missing');
 let rolls=0;const api=session(active.state,now,()=>{rolls++;return .5;});
 const rollsBefore=rolls;api.view();api.view();assert.equal(rolls,rollsBefore);
 const before=JSON.stringify(active.state);
 const synced=execute(active.state,'sync',{},now,fixed);
 assert.equal(synced.state.coins,active.state.coins);assert.equal(synced.state.xp,active.state.xp);
 assert.equal(JSON.stringify(active.state),before);
 assert.equal(synced.state.orders.find(o=>o.id===raw.id).completionReward,null);
 const done=execute(active.state,'sync',{},driving.runningEndsAt+1,fixed);
 assert.equal(done.state.xp,16);
 assert.equal(done.state.orders.find(o=>o.id===raw.id).status,'completed');
 const cash=done.state.coins+done.state.orders.find(o=>o.id===raw.id).completionReward.coins-start.state.coins;
 assert.equal(Math.round(cash*100),Math.round(choice.totalProfit*100));
});

test('Project catalog lists five customer specials and one shared referral with source chances, rewards and saved-fleet timing',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 assert.equal(start.view.projectCatalog.length,6);
 assert.equal(start.state.orders.filter(o=>['special','referral'].includes(o.kind)).length,0);
 const special=start.view.projectCatalog.find(p=>p.key==='special:0'),referral=start.view.projectCatalog.find(p=>p.key==='referral');
 assert.equal(special.expeditionChance,4.05);assert.equal(special.customerChance,20);
 assert.equal(special.volume,400);assert.equal(special.deadlineMs,3600000);
 assert.equal(special.moduleChance,8);assert.equal(special.epicChance,20);
 assert.equal(referral.sources[4].customerChance,6);assert.equal(referral.moduleChance,20);assert.equal(referral.legendary.extraChance,25);
 assert.equal(referral.volume,1100);assert.equal(referral.distance,240);
 start.state.expedition.regions.forEach(r=>{r.discovered=7;r.endlessUnlocked=true;});
 start.state.expedition.points=100;
 start.state.expedition.seats[0]='navigator';
 for(const region of [0,4])for(const roll of [.97,.999]){
  const drawn=execute(start.state,'draw',{region},now,()=>roll);
  const order=drawn.view.state.orders.find(o=>o.isProject),catalog=drawn.view.projectCatalog.find(p=>p.key===order.projectInfo.key);
  assert.equal(order.projectName,catalog.name);assert.equal(order.volume,catalog.volume);assert.equal(order.distance,catalog.distance);
  const active=execute(drawn.state,'projectStart',{id:order.id,template:0},now,fixed);
  const running=active.view.state.orders.find(o=>o.id===order.id);
  assert.equal(running.project.deadlineAt,now+order.deadlineMs);assert.ok(running.eta>now);
  const saved=running.project.vehicles[0].capacity;
  active.state.expedition.seats[0]=null;active.state.trucks[0].capacity+=10;
  const sync=execute(active.state,'sync',{},now,fixed).view.state.orders.find(o=>o.id===order.id);
  assert.equal(sync.project.vehicles[0].capacity,saved);assert.equal(sync.eta,running.eta);
 }
});

test('Bulk single-order claim reports actual combined loot, excludes projects and never credits twice',()=>{
 const start=execute(null,'start',{id:'hamburg'},now,fixed);
 const rewards=[{coins:12.34,gears:{common:2},companyItems:1},{coins:5,gears:{common:3,rare:1},capacityModule:true,supplierContacts:2}];
 for(let i=0;i<2;i++)Object.assign(start.state.orders[i],{status:'completed',completionReward:rewards[i]});
 start.state.orders.push({...structuredClone(start.state.orders[0]),id:'project-test',kind:'special',completionReward:{coins:999,gears:{legendary:2}}});
 const original=JSON.stringify(start.state);
 const claim=execute(start.state,'claimSingles',{},now,fixed);
 assert.deepEqual(claim.view.claimSummary,{count:2,coins:17.34,gears:{common:5,rare:1},capacityModules:1,companyItems:1,supplierContacts:2});
 assert.equal(claim.state.coins,1017.34);assert.equal(claim.state.inventory.gears.common,5);assert.equal(claim.state.inventory.gears.legendary,0);
 assert.equal(claim.state.inventory.capacityModules,1);assert.equal(claim.state.inventory.companyItems,1);assert.equal(claim.state.inventory.supplierContacts,2);
 assert.ok(claim.state.orders[0].completionReward.claimedAt);
 assert.equal(claim.state.orders.find(o=>o.id==='project-test').completionReward.claimedAt,undefined);
 assert.equal(JSON.stringify(start.state),original);
 const twice=execute(claim.state,'claimSingles',{},now,fixed);
 assert.equal(twice.state.coins,claim.state.coins);assert.equal(twice.view.claimSummary,undefined);
});

 test('Shared referrals normalize queued legacy stock and new customer finds while running terms survive',()=>{
  let state=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed).state;
  state.expedition.regions.forEach(r=>{r.discovered=7;r.endlessUnlocked=true;});state.expedition.points=100;state.expedition.seats[0]='navigator';
  for(const region of [0,4])state=execute(state,'draw',{region},now,()=>.999).state;
  const referrals=state.orders.filter(o=>o.kind==='referral');assert.equal(referrals.length,2);
  for(const o of referrals){assert.equal(o.volume,1100);assert.equal(o.distance,240);assert.equal(o.category,'national');assert.equal(o.projectName,'Großprojekt Hafenverbund');}
  assert.notEqual(referrals[0].customer,referrals[1].customer);
  const legacy=referrals[1];legacy.volume=legacy.baseVolume=2000;legacy.distance=400;legacy.category='international';legacy.projectName='Großprojekt Kontinentalnetz';
  const normalized=execute(state,'sync',{},now,fixed);assert.equal(normalized.state.orders.find(o=>o.id===legacy.id).volume,1100);
  assert.equal(legacy.volume,2000); // Caller state stays untouched.
  const started=execute(state,'projectStart',{id:legacy.id,template:0},now,fixed);
  const running=started.state.orders.find(o=>o.id===legacy.id);running.volume=running.baseVolume=2000;running.distance=400;running.category='international';running.projectName='Altes Projekt';
  const saved=JSON.stringify(running.project);
  const synced=execute(started.state,'sync',{},now,fixed).view.state.orders.find(o=>o.id===legacy.id);
  assert.equal(synced.volume,2000);assert.equal(synced.distance,400);assert.equal(synced.projectName,'Altes Projekt');assert.equal(JSON.stringify(synced.project),saved);assert.equal(synced.projectInfo.key,'referral');
 });

test('Discovery spends one point per tap, persists partial progress and reaches 100 before bonus delivery',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const original=JSON.stringify(start.state);
 const one=execute(start.state,'discover',{region:0},now,fixed);
 assert.equal(one.state.expedition.points,49);assert.equal(one.state.expedition.regions[0].discovered,0);assert.equal(one.view.expeditionMap[0].places[0].invested,1);
 assert.equal(JSON.stringify(start.state),original);
 const reload=execute(one.state,'sync',{},now,fixed);assert.equal(reload.view.expeditionMap[0].places[0].invested,1);
 const two=execute(reload.state,'discover',{region:0},now,fixed);assert.equal(two.state.expedition.points,48);assert.equal(two.state.expedition.regions[0].discovered,0);
 const three=execute(two.state,'discover',{region:0},now,fixed);assert.equal(three.state.expedition.points,47);assert.equal(three.state.expedition.regions[0].discovered,1);assert.equal(three.view.expeditionMap[0].places[0].invested,3);assert.equal(three.view.expeditionMap[0].deliveries,0);
 const next=execute(three.state,'discover',{region:0},now,fixed);assert.equal(next.view.expeditionMap[0].places[1].invested,1);assert.equal(next.view.expeditionMap[0].places[0].invested,3);
 next.state.expedition.points=0;
 const empty=execute(next.state,'discover',{region:0},now,fixed);assert.equal(empty.state.expedition.points,0);assert.equal(empty.view.expeditionMap[0].places[1].invested,1);
 const locked=execute(three.state,'discover',{region:1},now,fixed);assert.equal(locked.state.expedition.points,47);assert.equal(locked.view.expeditionMap[1].places[0].invested,0);
 const legacy=structuredClone(start.state);legacy.expedition.regions[0].discovered=2;
 const migrated=execute(legacy,'sync',{},now,fixed);assert.equal(migrated.view.expeditionMap[0].places[0].invested,3);assert.equal(migrated.view.expeditionMap[0].places[1].invested,3);
});

test('A card occupies one garage slot and one garage transport, while parallel fleet projects stay independent',()=>{
 let start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const card='navigator',truck=start.state.trucks.find(t=>t.cardId===card),order=start.view.state.orders.find(o=>o.choices.some(t=>t.id===truck.id));
 assert.ok(order);
 start=execute(start.state,'assign',{order:order.id,truck:truck.id},now,fixed);
 const copy=structuredClone(start.state.orders.find(o=>o.id===order.id));Object.assign(copy,{id:'second-garage-job',status:'available',truckId:null});start.state.orders.push(copy);
 let blocked=execute(start.state,'garageAdd',{id:card},now,fixed);
 assert.equal(blocked.state.trucks.filter(t=>t.cardId===card).length,1);
 blocked=execute(blocked.state,'garageRemove',{id:card},now,fixed);assert.equal(blocked.state.trucks.filter(t=>t.cardId===card).length,1);
 blocked=execute(blocked.state,'assign',{order:copy.id,truck:truck.id},now,fixed);assert.equal(blocked.state.orders.find(o=>o.id===copy.id).status,'available');
 blocked.state.expedition.regions[0].discovered=7;blocked.state.expedition.regions[0].endlessUnlocked=true;blocked.state.expedition.points=50;
 blocked=execute(blocked.state,'mission',{region:0,kind:'delivery',place:0,truck:truck.id},now,fixed);assert.equal(blocked.state.expedition.missions.length,0);
 let state=blocked.state;
 for(const template of [0,1])state=execute(state,'seat',{id:card,template,seat:0},now,fixed).state;
 for(const template of [0,1,0]){
  const found=execute(state,'draw',{region:0},now,()=>.97);const project=found.state.orders.filter(o=>o.kind==='special'&&o.status==='queued').at(-1);
  state=execute(found.state,'projectStart',{id:project.id,template},now,fixed).state;
  assert.equal(state.orders.find(o=>o.id===project.id).status,'active');
 }
 assert.equal(state.trucks.filter(t=>t.cardId===card).length,1);
 assert.equal(state.orders.find(o=>o.id===order.id).status,'active');
 const projects=state.orders.filter(o=>o.kind==='special'&&o.status==='active');assert.equal(projects.length,3);assert.ok(projects.every(o=>o.project.vehicles.some(v=>v.cardId===card)));
 assert.ok(execute(state,'sync',{},now,fixed).view.state.trucks.find(t=>t.id===truck.id).free===false);
 const fresh=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);fresh.state.expedition.regions[0].discovered=1;
 const driving=execute(fresh.state,'mission',{region:0,kind:'delivery',place:0,truck:fresh.state.trucks[0].id},now,fixed);
 const offer=fresh.view.state.orders.find(o=>o.choices.length);
 const cannotAssign=execute(driving.state,'assign',{order:offer.id,truck:fresh.state.trucks[0].id},now,fixed);
 assert.equal(cannotAssign.state.orders.find(o=>o.id===offer.id).status,'available');assert.equal(cannotAssign.state.expedition.missions.filter(m=>m.status==='active').length,1);
});

test('Custom overtime amounts preserve tkm accounting, cap completion cost and reject invalid spends and use the remaining balance',()=>{
 let state=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed).state;
 state.expedition.regions[0].discovered=7;state.expedition.regions[0].endlessUnlocked=true;state.expedition.seats[0]='navigator';
 const found=execute(state,'draw',{region:0},now,()=>.97);const project=found.state.orders.find(o=>o.kind==='special');
 const active=execute(found.state,'projectStart',{id:project.id,template:0},now,fixed);
 const paid=execute(active.state,'overtime',{id:project.id,amount:7},now,fixed);const order=paid.state.orders.find(o=>o.id===project.id);
 assert.equal(paid.state.overtimePoints,active.state.overtimePoints-7);assert.ok(Math.abs(order.delivered*order.distance-7000)<1e-6);
 const needed=Math.ceil((order.volume-order.delivered)*order.distance/1000);
 const finished=execute(paid.state,'overtime',{id:project.id,amount:100000},now,fixed);
 assert.equal(finished.state.orders.find(o=>o.id===project.id).status,'completed');assert.equal(finished.state.overtimePoints,paid.state.overtimePoints-needed);
 const denied=structuredClone(active.state);denied.overtimePoints=3;
 const unfunded=execute(denied,'overtime',{id:project.id,amount:7},now,fixed);assert.equal(unfunded.state.overtimePoints,0);assert.ok(Math.abs(unfunded.state.orders.find(o=>o.id===project.id).delivered*project.distance-3000)<1e-6);
 const empty=execute(unfunded.state,'overtime',{id:project.id,amount:7},now,fixed);assert.equal(empty.state.overtimePoints,0);assert.equal(empty.state.orders.find(o=>o.id===project.id).delivered,unfunded.state.orders.find(o=>o.id===project.id).delivered);
 for(const amount of [-1,1.5,'7',100001])assert.throws(()=>execute(active.state,'overtime',{id:project.id,amount},now,fixed));
 const zero=execute(active.state,'overtime',{id:project.id,amount:0},now,fixed);assert.equal(zero.state.overtimePoints,active.state.overtimePoints);assert.equal(zero.state.orders.find(o=>o.id===project.id).delivered,0);
});

test('Level notices report newly earned levels including offline transport, without replaying existing pending allocations',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const first=execute(start.state,'testGrant',{kind:'xp',amount:100},now,fixed);assert.deepEqual(first.view.levelUps,[2]);assert.equal(first.state.inventory.overtimeRefills,1);
 assert.equal(execute(first.state,'sync',{},now,fixed).view.levelUps,undefined);
 const more=execute(first.state,'testGrant',{kind:'xp',amount:1000},now,fixed);assert.deepEqual(more.view.levelUps,[3,4,5]);assert.equal(more.state.inventory.overtimeRefills,4);
 const allocated=execute(more.state,'level',{expedition:1,overtime:2},now,fixed);assert.equal(allocated.view.levelUps,undefined);
 const offline=structuredClone(start.state);offline.xp=99;
 const offer=start.view.state.orders.find(o=>o.choices.length);
 const active=execute(offline,'assign',{order:offer.id,truck:offer.choices[0].id},now,fixed);
 const end=active.view.state.orders.find(o=>o.id===offer.id).runningEndsAt;
 const settled=execute(active.state,'sync',{},end+1,fixed);assert.deepEqual(settled.view.levelUps,[2]);assert.equal(execute(settled.state,'sync',{},end+1,fixed).view.levelUps,undefined);
});

test('Max overtime uses the minimum whole points that make the saved fleet meet its deadline',()=>{
 for(const mixed of [false,true]){
  const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
  let state=start.state;state.expedition.regions[0].discovered=7;state.expedition.regions[0].endlessUnlocked=true;state.expedition.seats[0]='navigator';state.overtimePoints=1000;
  if(mixed){const card=start.view.catalog.cards.find(c=>c.region===0&&c.id!=='navigator');state.expedition.characters[card.id]={level:1,progress:0};state.expedition.seats[1]=card.id;}
  state=execute(state,'draw',{region:0},now,()=>.97).state;const project=state.orders.find(o=>o.kind==='special');
  const active=execute(state,'projectStart',{id:project.id,template:0},now,fixed);
  const current=execute(active.state,'sync',{},now+123456,fixed),order=current.view.state.orders.find(o=>o.id===project.id),needed=order.overtimeForDeadline;
  assert.ok(needed>0);assert.ok(needed<Math.ceil((order.volume-order.delivered)*order.distance/1000));
  const json=JSON.stringify(current.state);
  if(needed>1){const short=execute(current.state,'overtime',{id:project.id,amount:needed-1},now+123456,fixed).view.state.orders.find(o=>o.id===project.id);assert.ok(short.eta>short.project.deadlineAt);}
  const result=execute(current.state,'overtime',{id:project.id,amount:'max'},now+123456,fixed),after=result.view.state.orders.find(o=>o.id===project.id);
  assert.equal(result.state.overtimePoints,current.state.overtimePoints-needed);assert.ok(after.eta<=after.project.deadlineAt);assert.equal(after.status,'active');assert.equal(after.overtimeForDeadline,0);assert.equal(JSON.stringify(current.state),json);
  const again=execute(result.state,'overtime',{id:project.id,amount:'max'},now+123456,fixed);assert.equal(again.state.overtimePoints,result.state.overtimePoints);
  const poor=structuredClone(current.state);poor.overtimePoints=2;const limited=execute(poor,'overtime',{id:project.id,amount:'max'},now+123456,fixed);assert.equal(limited.state.overtimePoints,0);assert.ok(limited.view.state.orders.find(o=>o.id===project.id).overtimeForDeadline>0);
 }
});

test('Token regeneration countdowns follow server deadlines and stop at or above capacity',()=>{
 const start=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 assert.deepEqual(start.view.regeneration,{expeditionNextAt:null,overtimeNextAt:null});
 const state=start.state;state.expedition.points=48;state.overtimePoints=98;state.expedition.lastRegenAt=now-20*60000+1000;state.overtimeLastRegenAt=now-10*60000+3000;
 const initial=execute(state,'sync',{},now,fixed);assert.equal(initial.view.regeneration.expeditionNextAt,now+1000);assert.equal(initial.view.regeneration.overtimeNextAt,now+3000);
 const expedition=execute(initial.state,'sync',{},now+1000,fixed);assert.equal(expedition.state.expedition.points,49);assert.equal(expedition.view.regeneration.expeditionNextAt,now+1000+20*60000);
 const overtime=execute(expedition.state,'sync',{},now+3000,fixed);assert.equal(overtime.state.overtimePoints,99);assert.equal(overtime.view.regeneration.overtimeNextAt,now+3000+10*60000);
 const full=execute(overtime.state,'sync',{},now+20*60000+1000,fixed);assert.equal(full.state.expedition.points,50);assert.equal(full.state.overtimePoints,100);assert.deepEqual(full.view.regeneration,{expeditionNextAt:null,overtimeNextAt:null});
 full.state.expedition.points=75;full.state.overtimePoints=200;
 const over=execute(full.state,'sync',{},now+21*60000,fixed);assert.deepEqual(over.view.regeneration,{expeditionNextAt:null,overtimeNextAt:null});assert.equal(over.state.expedition.points,75);assert.equal(over.state.overtimePoints,200);
});

test('Collection upgrades work for parked cards without creating garage slots and preserve resource limits',()=>{
 let game=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 game=execute(game.state,'garageRemove',{id:'navigator'},now,fixed);
 game.state.inventory.capacityModules=2;game.state.inventory.gears.common=1000;
 const count=game.state.trucks.length;
 game=execute(game.state,'cardCapacity',{id:'navigator'},now,fixed);
 assert.equal(game.state.trucks.length,count);assert.equal(game.view.cardVehicles.navigator.capacity,4.5);
 assert.equal(game.state.inventory.capacityModules,1);
 game=execute(game.state,'cardRank',{id:'navigator'},now,fixed);
 assert.equal(game.state.trucks.length,count);assert.equal(game.view.cardVehicles.navigator.rank.total,1);
 assert.equal(game.state.inventory.gears.common,0);
 const blocked=execute(game.state,'cardRank',{id:'navigator'},now,fixed);
 assert.equal(blocked.view.cardVehicles.navigator.rank.total,1);
 const added=execute(blocked.state,'garageAdd',{id:'navigator'},now,fixed);
 assert.equal(added.state.trucks.length,count+1);assert.equal(added.state.trucks[0].capacity,4.5);assert.equal(added.state.trucks[0].rarityLevel,1);
 const upgraded=execute(added.state,'cardCapacity',{id:'navigator'},now,fixed);
 assert.equal(upgraded.state.trucks.length,count+1);assert.equal(upgraded.state.trucks[0].capacity,5);
 assert.equal(upgraded.state.inventory.capacityModules,0);
 assert.equal(execute(upgraded.state,'cardCapacity',{id:'navigator'},now,fixed).state.trucks[0].capacity,5);
 const unknown=execute(upgraded.state,'cardCapacity',{id:'does-not-exist'},now,fixed);
 assert.equal(unknown.state.trucks.length,count+1);
 const unowned=upgraded.view.catalog.cards.find(c=>!upgraded.state.expedition.characters[c.id]);
 assert.equal(execute(upgraded.state,'cardRank',{id:unowned.id},now,fixed).state.trucks.length,count+1);
});

test('Single-order summaries expose traffic type and total duration bands without changing route economics',()=>{
 const started=execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,fixed);
 const a=session(started.state,now,fixed);
 const order=a.state.orders.find(o=>o.category==='national');
 assert.ok(order);
 let view=a.view(),shown=view.state.orders.find(o=>o.id===order.id);
 assert.equal(shown.transportLabel,'Regionalverkehr');assert.ok(shown.durationSeconds>0);
 const baseDistance=order.distance,baseDuration=shown.durationSeconds;
 for(const [seconds,band] of [[299,'Kurz'],[301,'Mittel'],[899,'Mittel'],[901,'Lang']]){
  order.distance=baseDistance*seconds/baseDuration;
  shown=a.view().state.orders.find(o=>o.id===order.id);
  assert.ok(Math.abs(shown.durationSeconds-seconds)<.01);assert.equal(shown.durationBand,band);
 }
 order.category='international';shown=a.view().state.orders.find(o=>o.id===order.id);
 assert.equal(shown.transportLabel,'Fernverkehr');assert.ok(Number.isFinite(shown.durationSeconds));
 a.state.trucks=[];
 shown=a.view().state.orders.find(o=>o.id===order.id);
 assert.ok(shown.durationSeconds>0);assert.equal(shown.durationBand,shown.durationSeconds<=300?'Kurz':shown.durationSeconds<=900?'Mittel':'Lang');
 assert.equal(order.from,started.state.orders.find(o=>o.id===order.id).from);
 assert.equal(order.to,started.state.orders.find(o=>o.id===order.id).to);
});
