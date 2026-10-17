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
