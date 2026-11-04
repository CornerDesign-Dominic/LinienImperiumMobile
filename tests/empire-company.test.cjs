const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;

test('Empire upgrade availability agrees with actual server costs, item shortages and maximum levels',()=>{
 const h=componentHarness('Company.tsx'),canImprove=h.exports.canImproveTransport;
 const initial=execute(null,'start',{id:'hamburg'},now,()=>.5);
 const option=initial.view.transportUpgradeOptions.find(o=>o.category==='national'&&o.kind==='premium');
 const price=option.costs[0];
 for(const [coins,items,expected] of [[price.coins-1,price.items,false],[price.coins,price.items-1,false],[price.coins,price.items,true]]){
  const state=structuredClone(initial.state);state.coins=coins;state.inventory.companyItems=items;
  const view=execute(state,'sync',{},now,()=>.5).view;
  const actual=view.transportUpgradeOptions.find(o=>o.category===option.category&&o.kind===option.kind);
  assert.equal(canImprove(view,actual),expected);
  if(expected){const bought=execute(state,'transportBatch',{upgrades:[{category:actual.category,kind:actual.kind,count:1,level:actual.level}]},now,()=>.5);assert.equal(bought.view.transportBatchApplied,true);assert.equal(bought.state.coins,0);assert.equal(bought.state.inventory.companyItems,0);}
 }
 const capped=structuredClone(initial.state);capped.coins=1e12;capped.inventory.companyItems=1e6;capped.company.transportUpgrades.national.premiumLevel=option.limit;
 const cappedView=execute(capped,'sync',{},now,()=>.5).view;
 assert.equal(canImprove(cappedView,cappedView.transportUpgradeOptions.find(o=>o.category==='national'&&o.kind==='premium')),false);
 h.unmount();
});

test('Development shows permanent bases and opens one allocator for the combined point balance',()=>{
 const initial=execute(null,'start',{id:'hamburg'},now,()=>.5);
 initial.state.overtimePoints=1;initial.state.expedition.points=2;
 initial.state.pendingLevelUps=[2,3];initial.state.expansion.available=1;
 const data=execute(initial.state,'sync',{},now,()=>.5).view;
 assert.equal(data.development.points,7);assert.equal(data.expansion.available,7);
 const h=componentHarness('LevelUp.tsx'),props={data,busy:false,onCommand:async()=>undefined};
 const tree=h.render('DevelopmentCard',props);
 assert.ok(text(tree).includes(String(data.development.overtime.base)));assert.ok(text(tree).includes(String(data.development.expedition.base)));
 assert.ok(!text(tree).includes(' + '));
 const entries=nodes(tree,'Btn');assert.equal(entries.length,1);assert.equal(text(entries[0]),'Ausbaupunkte verteilen · 7');
 entries[0].props.onPress();
 assert.equal(nodes(h.render('DevelopmentCard',props),h.exports.DevelopmentModal).length,1);
 assert.ok(!text(tree).includes('Basiswert + Boni'));h.unmount();
});
