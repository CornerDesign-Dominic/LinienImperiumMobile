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

test('Special titles follow stable customer IDs for new and legacy projects without rewriting saved terms',()=>{
 const titles=['Schmuck der Krone','Edle Webwaren','Kostbare Essenzen','Kunst aus Jade','Schätze des Nordens'];
 const legacy=['Stadtversorgung','Baustellenlogistik','Materialbergung','Ferntransport','Handelsroute'];
 let game=execute(initial().state,'seat',{id:'navigator',template:0,seat:0},now,()=>.5);
 game=execute(game.state,'testProjects',{},now,()=>.5);
 assert.deepEqual(game.view.projectCatalog.filter(c=>c.kind==='special').map(c=>c.name),titles.map(name=>'Großauftrag '+name));
 const referral=game.state.orders.find(o=>o.kind==='referral');
 assert.equal(game.view.state.orders.find(o=>o.id===referral.id).projectName,referral.projectName);
 for(const [region,identity]of identities.entries()){
  const project=game.state.orders.find(o=>o.kind==='special'&&o.customer===identity.id);
  assert.equal(project.projectName,'Großauftrag '+titles[region]);
  const started=execute(game.state,'projectStart',{id:project.id,template:0},now,()=>.5);
  for(const status of ['queued','active','completed','failed']){
   const old=structuredClone(started.state),order=old.orders.find(o=>o.id===project.id);
   order.status=status;order.projectName='Großauftrag '+legacy[region];order.projectRegion=(region+1)%5;
   const terms=JSON.stringify({id:order.id,customer:order.customer,projectName:order.projectName,projectRegion:order.projectRegion,volume:order.volume,distance:order.distance,delivered:order.delivered,deadlineMs:order.deadlineMs,project:order.project});
   const synced=execute(old,'sync',{},now,()=>.5),saved=synced.state.orders.find(o=>o.id===order.id),shown=synced.view.state.orders.find(o=>o.id===order.id);
   assert.equal(shown.projectName,'Großauftrag '+titles[region]);assert.equal(shown.projectInfo.name,shown.projectName);
   assert.equal(shown.projectInfo.key,'special:'+region);assert.equal(shown.status,status);
   assert.equal(JSON.stringify({id:saved.id,customer:saved.customer,projectName:saved.projectName,projectRegion:saved.projectRegion,volume:saved.volume,distance:saved.distance,delivered:saved.delivered,deadlineMs:saved.deadlineMs,project:saved.project}),terms);
  }
 }
 const old=structuredClone(game.state);old.profile.companyName='Großauftrag Materialbergung';
 old.events.push({at:now,text:'Großauftrag Materialbergung meldet: Großauftrag Ferntransport 5 abgeschlossen. Belohnung bereit. Freier Ferntransport bleibt verfügbar.'});
 const synced=execute(old,'sync',{},now,()=>.5);
 assert.equal(synced.view.state.events.at(-1).text,'Großauftrag Materialbergung meldet: Großauftrag Kunst aus Jade 5 abgeschlossen. Belohnung bereit. Freier Ferntransport bleibt verfügbar.');
 assert.equal(synced.state.events.at(-1).text,old.events.at(-1).text);
});
