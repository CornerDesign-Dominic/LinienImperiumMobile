'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const identities=require('../functions/src/customer-identities.json');
const T=1800000000000,round=n=>Math.round(n*100)/100;
const cmd=(state,action='sync',payload={},random=()=>.5)=>execute(state,action,payload,T,random);
function ready(){let r=cmd(null,'foundCompany',{companyName:'Kundenkontor',cityName:'Testhafen'});r=cmd(r.state,'seasonStart');r.state.expedition.points=1000;r.state.expedition.regions.forEach(region=>Object.assign(region,{endlessUnlocked:true,customerUnlocked:true}));return r;}
function skills(state,region,special,referral,pay=0){state.customerSkills[identities[region].id]={pay,special,referral};}
function rates(result,region){const f=result.view.expeditionMap[region].finds;return {special:f.orders.find(o=>o.kind==='special').chance,referral:f.orders.find(o=>o.kind==='referral').chance,gears:f.gears.chance};}
test('Each regional customer independently controls its special and referral expedition chances through existing 0–25 skills',()=>{
 for(let region=0;region<5;region++)for(const [special,referral]of [[0,0],[25,0],[0,25],[25,25],[10,15]]){
  const base=ready();skills(base.state,region,special,referral);const r=cmd(base.state),found=rates(r,region);
  const expectedSpecial=round(.9+special*1.35/25),expectedReferral=round(.1+referral*.15/25);
  assert.deepEqual(found,{special:expectedSpecial,referral:expectedReferral,gears:round(50-expectedSpecial-expectedReferral)});
  assert.ok(found.special+found.referral<=2.5);assert.equal(r.view.expeditionMap[region].finds.orders.find(o=>o.kind==='customer').chance,20);
  for(let other=0;other<5;other++)if(other!==region)assert.deepEqual(rates(r,other),{special:.9,referral:.1,gears:49});
  assert.equal(r.view.projectCatalog.find(o=>o.kind==='special'&&o.region===region).expeditionChance,expectedSpecial);
 }
});
test('Actual draws use the regional customer skills for special and referral finds with no invented global bonus',()=>{
 for(let region=0;region<5;region++){
  const base=ready();base.state.company.expeditionChanceLevel=15;
  const baseline=cmd(base.state,'draw',{region},()=>.98);assert.ok(baseline.view.claimSummary);assert.equal(baseline.state.orders.some(o=>o.kind==='special'),false);
  skills(base.state,region,25,0);const special=cmd(base.state,'draw',{region},()=>.98).state.orders.find(o=>o.kind==='special');assert.ok(special);assert.equal(special.customer,identities[region].id);
  skills(base.state,region,0,25);const referral=cmd(base.state,'draw',{region},()=>.998).state.orders.find(o=>o.kind==='referral');assert.ok(referral);assert.equal(referral.customer,identities[region].id);
 }
});
test('The removed global expedition upgrade has no action, public upgrade view or chance effect',()=>{
 const base=ready();base.state.company.expeditionChanceLevel=15;const r=cmd(base.state);
 assert.equal(r.view.expeditionUpgrade,undefined);assert.equal(r.state.company.expeditionChanceLevel,undefined);
 assert.ok(r.view.expeditionMap.every((_,region)=>{const f=rates(r,region);return f.special===.9&&f.referral===.1&&f.gears===49;}));
 assert.throws(()=>cmd(r.state,'expeditionChanceUpgrade',{level:0}),/Unbekannte/);
});
test('Removed purchased global levels refund their exact old prices once, without Season earnings, through save reloads',()=>{
 for(const level of [1,5,6,15]){
  const base=ready();base.state.company.expeditionChanceLevel=level;const before={coins:base.state.coins,items:base.state.inventory.companyItems,seasonCoins:base.state.season.metrics.coins,gross:base.state.stats.grossRevenue};
  const coins=10000*level*(level+1)/2,companyItems=Array.from({length:level},(_,i)=>1+Math.floor(i/5)).reduce((a,b)=>a+b,0);
  const r=cmd(base.state);assert.equal(r.state.coins,before.coins+coins);assert.equal(r.state.inventory.companyItems,before.items+companyItems);assert.equal(r.state.company.expeditionChanceLevel,undefined);
  assert.deepEqual(r.state.removedExpeditionUpgradeRefund,{version:1,level,coins,companyItems});assert.equal(r.state.season.metrics.coins,before.seasonCoins);assert.equal(r.state.stats.grossRevenue,before.gross);
  const again=cmd(JSON.parse(JSON.stringify(r.state)));assert.equal(again.state.coins,r.state.coins);assert.equal(again.state.inventory.companyItems,r.state.inventory.companyItems);assert.deepEqual(again.state.removedExpeditionUpgradeRefund,r.state.removedExpeditionUpgradeRefund);
  // A retained stale field cannot replay an already recorded refund.
  again.state.company.expeditionChanceLevel=level;const stale=cmd(again.state);assert.equal(stale.state.coins,r.state.coins);assert.equal(stale.state.inventory.companyItems,r.state.inventory.companyItems);
 }
});
test('Invalid removed upgrade levels cannot create refunds or affect expedition rates',()=>{
 for(const level of [-1,-15,1.5,15.5,16,1000,'15','1',null,true,{},[]]){
  const base=ready();base.state.company.expeditionChanceLevel=level;const r=cmd(base.state);
  assert.equal(r.state.coins,base.state.coins,'invalid level '+JSON.stringify(level));assert.equal(r.state.inventory.companyItems,base.state.inventory.companyItems);assert.equal(r.state.company.expeditionChanceLevel,undefined);assert.deepEqual(rates(r,0),{special:.9,referral:.1,gears:49});
 }
});
test('Customer pay retains its actual freight effect and actual order special chances keep their existing 20/40 bases plus skills',()=>{
 for(const category of ['national','international'])for(const special of [0,25]){
  const base=ready(),customer=identities[0].id,template=base.state.orders[0];
  base.state.orders=[{...template,id:'ECONOMY',kind:'normal',customer,category,status:'available',volume:12,baseVolume:12,distance:120,routeType:'single',delivered:0,completionReward:null}];
  skills(base.state,0,special,25,0);const low=cmd(base.state),lowOrder=low.view.state.orders.find(o=>o.id==='ECONOMY');
  skills(base.state,0,special,25,100);const high=cmd(base.state),highOrder=high.view.state.orders.find(o=>o.id==='ECONOMY');
  const chance=(category==='national'?20:40)+special*.1;
  assert.ok(lowOrder.possibleRewards.includes(chance+' % Chance auf Sonderauftrag'));assert.ok(highOrder.possibleRewards.includes(chance+' % Chance auf Sonderauftrag'));
  assert.equal(highOrder.choices[0].revenue,round(lowOrder.choices[0].revenue*1.1));assert.equal(highOrder.choices[0].cost,lowOrder.choices[0].cost);assert.equal(highOrder.choices[0].xp,lowOrder.choices[0].xp);
  assert.deepEqual(low.state.orders.find(o=>o.id==='ECONOMY'),base.state.orders[0]);assert.equal(highOrder.category,category);
 }
});
