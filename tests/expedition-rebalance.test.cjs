const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
function ready(){const g=execute(null,'foundCompany',{companyName:'Handelshaus',cityName:'Testhafen'},now,()=>.5);g.state.expedition.points=1000;g.state.expedition.regions.forEach(r=>Object.assign(r,{endlessUnlocked:true,customerUnlocked:true}));return g;}
test('Expedition chance upgrade debits authoritative graduated prices, caps at 2.5 percent and rejects stale purchases',()=>{
 let g=ready();g.state.coins=2000000;g.state.inventory.companyItems=100;
 const coins=g.state.coins,items=g.state.inventory.companyItems;
 for(let level=0;level<15;level++){
  assert.equal(g.view.expeditionUpgrade.level,level);
  const before=g.state;g=execute(g.state,'expeditionChanceUpgrade',{level,coins:0},now,()=>.5);
  assert.equal(before.coins-g.state.coins,10000*(level+1));assert.equal(before.inventory.companyItems-g.state.inventory.companyItems,1+Math.floor(level/5));
  assert.throws(()=>execute(g.state,'expeditionChanceUpgrade',{level},now),/geändert/);
 }
 assert.equal(coins-g.state.coins,1200000);assert.equal(items-g.state.inventory.companyItems,30);assert.equal(g.view.expeditionUpgrade.cost,null);
 for(const r of g.view.expeditionMap){assert.deepEqual(r.finds.orders.map(o=>o.chance),[20,2.25,.25]);assert.equal(r.finds.gears.chance,47.5);}
 assert.throws(()=>execute(g.state,'expeditionChanceUpgrade',{level:15},now),/Maximaler/);
 const poor=ready();assert.throws(()=>execute(poor.state,'expeditionChanceUpgrade',{level:0},now),/Nicht genügend/);
});
test('Direct gear finds pay only the unchanged regional gears and preserve all other stored loot',()=>{
 const ranges=[{common:[20,30]},{common:[30,45],uncommon:[2,4]},{common:[40,60],uncommon:[5,8]},{common:[50,75],uncommon:[8,12],rare:[1,2]},{common:[60,90],uncommon:[12,18],rare:[2,4]}];
 for(let region=0;region<5;region++){
  const base=ready();base.state.inventory.companyItems=7;base.state.inventory.capacityModules=4;base.state.expedition.shards.common=9;
  let rolls=0;const g=execute(base.state,'draw',{region},now,()=>rolls++===0?.6:0),summary=g.view.claimSummary;
  assert.ok(summary);assert.equal(base.state.expedition.points-g.state.expedition.points,[5,6,7,8,10][region]);assert.equal(g.state.expedition.jobs.length,base.state.expedition.jobs.length);assert.equal(g.state.orders.length,base.state.orders.length);
  for(const [rarity,[min,max]]of Object.entries(ranges[region])){assert.ok(summary.gears[rarity]>=min&&summary.gears[rarity]<=max);assert.equal(g.state.inventory.gears[rarity]-base.state.inventory.gears[rarity],summary.gears[rarity]);}
  assert.deepEqual(g.state.expedition.shards,base.state.expedition.shards);assert.deepEqual(summary.shards,{});assert.equal(summary.coins,0);
  for(const key of ['companyItems','capacityModules']){assert.equal(g.state.inventory[key],base.state.inventory[key]);assert.equal(summary[key],0);}
  assert.deepEqual(Object.keys(g.view.expeditionMap[region].finds.gears).sort(),['chance','ranges']);
 }

});
test('A duplicate direct transport-card find still awards one shard of its own rarity',()=>{
 const base=ready(),found=execute(base.state,'draw',{region:0},now,()=>.01);
 assert.equal(found.state.expedition.shards.common,base.state.expedition.shards.common+1);
 assert.deepEqual(found.state.inventory.gears,base.state.inventory.gears);
});
test('Normal expedition customer orders roll actual transport category independently, persist queued and keep saved terms',()=>{
 for(const [roll,category]of [[.1,'national'],[.9,'international']]){
  const base=ready();let n=0;const g=execute(base.state,'draw',{region:0},now,()=>n++===0?.4:roll);
  const order=g.state.orders.at(-1);assert.equal(order.kind,'normal');assert.equal(order.status,'queued');assert.equal(order.crafted,true);assert.equal(order.customer,'nordbau');assert.equal(order.category,category);
  const saved=JSON.stringify(order),later=execute(g.state,'sync',{},now+3600000,()=>.5);assert.equal(JSON.stringify(later.state.orders.find(o=>o.id===order.id)),saved);
  const shown=g.view.state.orders.find(o=>o.id===order.id);assert.ok(shown.choices.length);const assigned=execute(g.state,'assignCrafted',{order:order.id,truck:shown.choices[0].id},now,()=>.5);assert.equal(assigned.state.orders.find(o=>o.id===order.id).status,'active');
  const repeated=execute(assigned.state,'assignCrafted',{order:order.id,truck:shown.choices[0].id},now,()=>.5);assert.equal(repeated.state.orders.filter(o=>o.id===order.id).length,1);
 }
});
test('Five-percent single-order offers consider every unlocked customer in either actual transport category',()=>{
 let g=ready();g.state.coins=10000000;g.state.expedition.regions.forEach((r,i)=>r.customerUnlocked=i===4);
 let seed=2157;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const seen=[];
 for(let i=0;i<35;i++){g=execute(g.state,'refresh',{},now,rng);seen.push(...g.state.orders.filter(o=>o.status==='available'&&o.customer));}
 assert.ok(seen.length>=5);assert.ok(seen.every(o=>o.customer==='eurolog'));
 assert.deepEqual([...new Set(seen.map(o=>o.category))].sort(),['international','national']);
 for(const order of seen){assert.ok(order.distance>0);assert.ok(order.volume>0);if(order.category==='international')assert.notEqual(order.destinationCountry,'Deutschland');}
});
test('Customer follow-up chance keeps national 20 and international 40 percent and projects inherit the actual source category',()=>{
 for(const category of ['national','international']){
  let n=0,g=execute(ready().state,'draw',{region:0},now,()=>n++===0?.4:category==='national'?.1:.9);
  const order=g.state.orders.at(-1);Object.assign(order,{volume:1,baseVolume:1,distance:1,routeType:'single'});
  g=execute(g.state,'sync',{},now,()=>.5);const shown=g.view.state.orders.find(o=>o.id===order.id);
  g=execute(g.state,'assignCrafted',{order:order.id,truck:shown.choices[0].id},now,()=>.5);
  const completed=execute(g.state,'sync',{},now+3600000,()=>.3);
  assert.equal(completed.state.orders.find(o=>o.id===order.id).status,'completed');
  assert.equal(completed.state.orders.find(o=>o.kind==='special'),undefined);
  const collected=execute(completed.state,'claimSingles',{},now+3600000,()=>.3);
  const special=collected.state.orders.find(o=>o.kind==='special');
  if(category==='national')assert.equal(special,undefined);else {assert.ok(special);assert.equal(special.category,category);assert.equal(special.customer,order.customer);}
 }
});
