const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000,random=()=>.5;
const initial=()=>execute(null,'start',{id:'hamburg'},now,random);
const option=(view,category,kind)=>view.transportUpgradeOptions.find(o=>o.category===category&&o.kind===kind);

test('Premium tiers, material thresholds and full budgets match the agreed progression',()=>{
 const {view}=initial();
 for(const category of ['national','international']){
  const o=option(view,category,'premium');assert.equal(o.limit,1000);
  for(const [level,items]of [[1,1],[25,1],[26,2],[50,2],[51,3],[1000,40]])assert.deepEqual(o.costs[level-1],{coins:1000*level,items});
  assert.equal(o.costs.reduce((sum,c)=>sum+c.coins,0),500500000);
  assert.equal(o.costs.reduce((sum,c)=>sum+c.items,0),20500);
 }
 for(const [category,kind,coins,items,endMin,endMax]of [
  ['national','volume',2146250,200,35,90],['national','range',4292500,200,30,150],
  ['international','volume',56813750,1350,85,200],['international','range',33835000,650,100,300]
 ]){
  const o=option(view,category,kind);assert.equal(o.limit,100);
  assert.equal(o.costs.reduce((sum,c)=>sum+c.coins,0),coins);
  assert.equal(o.costs.reduce((sum,c)=>sum+c.items,0),items);
  assert.ok(o.costs.every(c=>Number.isSafeInteger(c.coins)&&c.coins>0&&Number.isSafeInteger(c.items)&&c.items>0));
  assert.equal(kind==='volume'?o.base.minVolume+Math.floor(100*o.step/2):o.base.minDistance,endMin);
  assert.equal((kind==='volume'?o.base.maxVolume:o.base.maxDistance)+100*o.step,endMax);
 }
});

test('Intermediate quantity upgrades generate usable half-ton offers',()=>{
 const start=initial();start.state.inventory.companyItems=7;
 const upgraded=execute(start.state,'transport',{category:'national',kind:'volume'},now,random);
 const refreshed=execute(upgraded.state,'refresh',{},now,random);
 const offers=refreshed.state.orders.filter(o=>o.status==='available'&&o.kind==='normal');
 assert.ok(offers.length);
 for(const o of offers){assert.equal(o.category,'national');assert.ok(o.volume>=10&&o.volume<=40.5);assert.equal(o.volume%1,.5);}
});

test('Legacy levels migrate once, retain purchased effects and leave running orders and balances intact',()=>{
 const start=initial();delete start.state.companyTransportVersion;
 start.state.company.transportUpgrades.national={premiumLevel:37,volumeLevel:17,rangeLevel:23};
 start.state.company.transportUpgrades.international={premiumLevel:62,volumeLevel:101,rangeLevel:71};
 const balance=[start.state.coins,start.state.inventory.companyItems];
 const orders=JSON.stringify(start.state.orders);
 const migrated=execute(start.state,'sync',{},now,random);
 assert.deepEqual(migrated.state.company.transportUpgrades.national,{premiumLevel:37,volumeLevel:34,rangeLevel:46});
 assert.deepEqual(migrated.state.company.transportUpgrades.international,{premiumLevel:62,volumeLevel:68,rangeLevel:71});
 assert.equal(JSON.stringify(migrated.state.orders),orders);
 assert.deepEqual([migrated.state.coins,migrated.state.inventory.companyItems],balance);
 const again=execute(migrated.state,'sync',{},now,random);
 assert.deepEqual(again.state.company.transportUpgrades,migrated.state.company.transportUpgrades);
 const full=initial();delete full.state.companyTransportVersion;
 full.state.company.transportUpgrades.national={premiumLevel:100,volumeLevel:50,rangeLevel:50};
 full.state.company.transportUpgrades.international={premiumLevel:100,volumeLevel:150,rangeLevel:100};
 const end=execute(full.state,'sync',{},now,random);
 for(const category of ['national','international'])assert.deepEqual(end.state.company.transportUpgrades[category],{premiumLevel:100,volumeLevel:100,rangeLevel:100});
});

test('Split and batch purchases charge identical prices across the premium item threshold',()=>{
 const start=initial();start.state.coins=1e8;start.state.inventory.companyItems=10000;
 start.state.company.transportUpgrades.national.premiumLevel=24;
 const buy=(state,count,level)=>execute(state,'transportBatch',{upgrades:[{category:'national',kind:'premium',count,level}]},now,random);
 const batch=buy(start.state,3,24);let split=start;
 for(let level=24;level<27;level++)split=buy(split.state,1,level);
 assert.equal(batch.state.coins,split.state.coins);assert.equal(batch.state.inventory.companyItems,9995);
 assert.equal(batch.state.inventory.companyItems,split.state.inventory.companyItems);
 for(const category of ['national','international'])for(const kind of ['volume','range']){
  const a=execute(start.state,'transportBatch',{upgrades:[{category,kind,count:3,level:0}]},now,random);
  let b=start;for(let level=0;level<3;level++)b=execute(b.state,'transportBatch',{upgrades:[{category,kind,count:1,level}]},now,random);
  assert.equal(a.state.coins,b.state.coins);assert.equal(a.state.inventory.companyItems,b.state.inventory.companyItems);
 }
});
