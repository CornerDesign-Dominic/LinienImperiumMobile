const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const identities=require('../functions/src/customer-identities.json');
const {componentHarness,text}=require('./helpers/component-harness.cjs');
const now=1800000000000,random=()=>.5;
const found=()=>execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},now,random);

test('Test project grant adds each real category queued without spending or changing active assignments',()=>{
 const initial=found(),before=JSON.stringify(initial.state),coins=initial.state.coins;
 const granted=execute(initial.state,'testProjects',{kind:'referral',amount:999999},now,random);
 assert.equal(JSON.stringify(initial.state),before);
 const projects=granted.view.state.orders.filter(o=>o.isProject);
 assert.equal(projects.length,6);assert.ok(projects.every(o=>o.status==='queued'&&!o.project));
 assert.deepEqual(projects.filter(o=>o.kind==='special').map(o=>o.customer),identities.map(c=>c.id));
 assert.equal(projects.filter(o=>o.kind==='referral').length,1);
 assert.equal(new Set(projects.map(o=>o.id)).size,6);
 assert.equal(granted.state.coins,coins);assert.equal(granted.state.completed,initial.state.completed);
 for(const order of projects){
  const category=granted.view.projectCatalog.find(c=>c.key===order.projectInfo.key);
  assert.equal(order.volume,category.volume);assert.equal(order.distance,category.distance);
 }
 const second=execute(granted.state,'testProjects',{},now,random);
 assert.equal(second.view.state.orders.filter(o=>o.isProject).length,12,'a separate intentional request adds another set');
 assert.throws(()=>execute(null,'testProjects',{},now,random),/gründen/);
});

test('Legacy completion migration counts only successful projects and remains cumulative after records leave history',()=>{
 const game=execute(found().state,'testProjects',{},now,random);
 const projects=game.state.orders.filter(o=>['special','referral'].includes(o.kind));
 projects[0].status='completed';projects[1].status='failed';projects[5].status='completed';
 delete game.state.stats.projectCompletions;
 const migrated=execute(game.state,'sync',{},now,random);
 assert.deepEqual(migrated.state.stats.projectCompletions,{version:1,specialByCustomer:{nordbau:1},referral:1});
 const again=execute(migrated.state,'sync',{},now,random);
 assert.deepEqual(again.state.stats.projectCompletions,migrated.state.stats.projectCompletions);
 again.state.orders=again.state.orders.filter(o=>o.status!=='completed');
 const pruned=execute(again.state,'sync',{},now,random);
 assert.deepEqual(pruned.state.stats.projectCompletions,migrated.state.stats.projectCompletions);
});

test('Real fleet completion records specials per customer and referrals globally once through repeated sync and claim',()=>{
 let game=execute(found().state,'seat',{id:'navigator',template:0,seat:0},now,random);
 game=execute(game.state,'testProjects',{},now,random);
 const projects=game.state.orders.filter(o=>['special','referral'].includes(o.kind));
 for(const order of projects){order.volume=order.baseVolume=1;order.distance=1;order.deadlineMs=3600000;}
 for(const order of projects){
  game=execute(game.state,'projectStart',{id:order.id,template:0},now,random);
  // Referrals normalize queued terms; shorten the test's active cargo target
  // after starting while preserving real fleet settlement and its arrival.
  const active=game.state.orders.find(o=>o.id===order.id);active.volume=active.baseVolume=1;
 }
 game=execute(game.state,'sync',{},now+3600000,random);
 const counts=game.state.stats.projectCompletions;
 assert.deepEqual(counts.specialByCustomer,Object.fromEntries(identities.map(c=>[c.id,1])));
 assert.equal(counts.referral,1);
 const done=game.state.orders.filter(o=>['special','referral'].includes(o.kind)&&o.status==='completed');
 assert.equal(done.length,6);
 for(const order of done)game=execute(game.state,'claim',{id:order.id},now+3600000,random);
 game=execute(game.state,'sync',{},now+3600000,random);
 assert.deepEqual(game.state.stats.projectCompletions,counts);
 const h=componentHarness('Statistics.tsx',{'../functions/src/customer-identities.json':identities}),rendered=text(h.render('Statistics',{state:game.state}));
 assert.ok(rendered.includes('Empfehlungsaufträge gesamt'));
 for(const customer of identities)assert.ok(rendered.includes('Sonderaufträge · '+customer.customer));
});
