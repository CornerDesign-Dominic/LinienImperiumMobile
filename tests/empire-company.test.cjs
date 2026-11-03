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

test('Development uses maximum totals rather than current energy and keeps unspent expansion points reachable',()=>{
 const initial=execute(null,'start',{id:'hamburg'},now,()=>.5);
 initial.state.overtimePoints=1;initial.state.expedition.points=2;
 const data=execute(initial.state,'sync',{},now,()=>.5).view;data.expansion.available=2;
 let opened=0;const h=componentHarness('LevelUp.tsx'),tree=h.render('DevelopmentCard',{data,busy:false,onExpansion:()=>opened++});
 const readouts=nodes(tree,'View').filter(node=>node.props.accessible&&node.props.accessibilityLabel);
 assert.ok(readouts.some(node=>node.props.accessibilityLabel.startsWith('Überstunden: '+data.state.overtimeCapacity+',')));
 assert.ok(readouts.some(node=>node.props.accessibilityLabel.startsWith('Expeditionspunkte: '+data.expeditionCapacity+',')));
 const entry=nodes(tree,'Btn').find(node=>text(node)==='Ausbaupunkte verteilen · 2');assert.ok(entry);entry.props.onPress();assert.equal(opened,1);
 assert.ok(!text(tree).includes('Basiswert + Boni'));h.unmount();
});
