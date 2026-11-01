const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const cargo=require('../functions/src/customer-cargo.json');
const identities=require('../functions/src/customer-identities.json');
const now=1800000000000;
const initial=()=>execute(null,'foundCompany',{companyName:'Warenkontor',cityName:'Testhafen'},now,()=>.5);

test('New basic offers use only the five basic goods; existing cargo and terms survive sync',()=>{
 const game=initial();
 assert.equal(cargo.basic.length,5);
 for(const order of game.state.orders)assert.ok(cargo.basic.includes(order.cargo),order.cargo);
 const order=game.state.orders[0];order.cargo='Historische Testladung';
 const before=JSON.stringify(order);
 const next=execute(game.state,'sync',{},now,()=>.5);
 assert.equal(JSON.stringify(next.state.orders.find(o=>o.id===order.id)),before);
});

test('Every region creates customer projects from its three products and referrals from its precious good',()=>{
 for(const [region,identity] of identities.entries()){
  const start=initial();start.state.expedition.regions.forEach(r=>{r.discovered=7;r.endlessUnlocked=true;r.customerUnlocked=true;});
  start.state.expedition.points=100;start.state.expedition.seats[0]='navigator';
  const goods=cargo.customers[identity.id];assert.equal(goods.products.length,3);
  const catalog=start.view.catalog.customers.find(c=>c.id===identity.id);
  assert.deepEqual(catalog.products,goods.products);assert.equal(catalog.preciousCargo,goods.precious);
  const special=execute(start.state,'draw',{region},now,()=>.97).state.orders.find(o=>o.kind==='special');
  assert.ok(special,'special job created');assert.equal(special.customer,identity.id);
  assert.ok(goods.products.includes(special.cargo));
  const referral=execute(start.state,'draw',{region},now,()=>.999).state.orders.find(o=>o.kind==='referral');
  assert.equal(referral.customer,identity.id);assert.equal(referral.cargo,goods.precious);
  assert.equal(referral.volume,1100);assert.equal(referral.distance,240);
 }
});
