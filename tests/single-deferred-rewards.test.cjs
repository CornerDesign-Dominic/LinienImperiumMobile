'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const T=1800000000000,round=n=>Math.round(n*100)/100;
const cmd=(state,action='sync',payload={},at=T,random=()=>.1)=>execute(state,action,payload,at,random);
const find=(r,id='DEFER-SINGLE')=>r.state.orders.find(o=>o.id===id);
const shown=(r,id='DEFER-SINGLE')=>r.view.state.orders.find(o=>o.id===id);
function initial(){let r=cmd(null,'foundCompany',{companyName:'Speditionskontor',cityName:'Testhafen'});r=cmd(r.state,'seasonStart');r.state.expedition.regions[0].customerUnlocked=true;r.state.inventory.companyItemTkmRemainder=749999;return r;}
function start(state,kind='normal',id='DEFER-SINGLE',at=T){
 const orders=state.orders,base=orders.find(o=>o.status==='available')||orders[0];
 const o={...base,id,kind:kind==='customer'?'normal':kind,status:kind==='private'||kind==='customer'?'queued':'available',crafted:kind==='customer',customer:kind==='customer'?'nordbau':null,category:'national',volume:12,baseVolume:12,distance:120,routeType:'dual',delivered:0,truckId:null,tripStartAt:null,tripCargo:null,completedAt:null,completionReward:null};
 for(const key of ['tripSnapshot','bookedTransport','deferredTransport','trustAwarded','pendingTruckId','project'])delete o[key];
 state.orders.push(o);let r=cmd(state,'sync',{},at);const truck=shown(r,id).choices[0];assert.ok(truck,'test vehicle can start order');
 return cmd(r.state,kind==='private'?'assignPrivate':kind==='customer'?'assignCrafted':'assign',{order:id,truck:truck.id},at);
}
const setup=(kind='normal')=>start(initial().state,kind);
const finish=(r,id='DEFER-SINGLE',random=()=>.1)=>cmd(r.state,'sync',{},Math.ceil(shown(r,id).runningEndsAt),random);
function economicSnapshot(r){return {coins:r.state.coins,xp:r.state.xp,gross:r.state.stats.grossRevenue,bonus:r.state.stats.contractBonusRevenue,cost:r.state.stats.operatingCosts,inventory:structuredClone(r.state.inventory),trust:structuredClone(r.state.customerTrust)};}
function assertNoPositiveAwards(before,after){
 assert.equal(after.state.coins,round(before.coins-(after.state.stats.operatingCosts-before.cost)));
 assert.equal(after.state.xp,before.xp);assert.equal(after.state.stats.grossRevenue,before.gross);assert.equal(after.state.stats.contractBonusRevenue,before.bonus);
 for(const key of ['gears','companyItems','capacityModules','supplierContacts','expeditionRefills','overtimeRefills'])assert.deepEqual(after.state.inventory[key],before.inventory[key],key+' waits for collection');
 assert.deepEqual(after.state.customerTrust,before.trust);assert.equal(after.view.levelUps,undefined);
}
test('Generic, normal customer and private deliveries charge costs while all positive rewards wait through partial and final delivery',()=>{
 for(const kind of ['normal','customer','private']){
  const started=setup(kind),before=economicSnapshot(started);
  const partial=cmd(started.state,'sync',{},find(started).tripSnapshot.endsAt);
  assert.equal(find(partial).status,'active');assert.ok(find(partial).delivered>0);assert.ok(find(partial).delivered<find(partial).volume);assert.ok(find(partial).deferredTransport.revenue>0);assertNoPositiveAwards(before,partial);
  const done=finish(partial),o=find(done);assert.equal(o.status,'completed');assertNoPositiveAwards(before,done);
  assert.ok(o.completionReward.transportCoins>0);assert.equal(o.completionReward.transportCoins,o.deferredTransport.revenue);assert.equal(o.completionReward.xp,o.deferredTransport.xp);assert.equal(o.completionReward.totalCoins,round(o.completionReward.coins+o.deferredTransport.revenue));
  assert.equal(done.state.orders.filter(o=>o.kind==='special').length,0,'a customer follow-up is still uncollected');
  if(kind==='private')assert.ok(o.completionReward.supplierContacts>0);
 }
});
test('Bulk collection pays exact freight plus completion bonuses, XP and all loot for multiple real orders once across reloads',()=>{
 let first=finish(setup('normal')),at=find(first).completedAt;
 let second=start(first.state,'private','SECOND-SINGLE',at),done=finish(second,'SECOND-SINGLE');at=find(done,'SECOND-SINGLE').completedAt;
 const pending=done.state.orders.filter(o=>['DEFER-SINGLE','SECOND-SINGLE'].includes(o.id)),coins=round(pending.reduce((sum,o)=>sum+o.completionReward.totalCoins,0)),xp=round(pending.reduce((sum,o)=>sum+o.completionReward.xp,0)),transport=round(pending.reduce((sum,o)=>sum+o.completionReward.transportCoins,0)),bonus=round(pending.reduce((sum,o)=>sum+o.completionReward.coins,0));
 const claimed=cmd(JSON.parse(JSON.stringify(done.state)),'claimSingles',{},at),summary=claimed.view.claimSummary;
 assert.equal(summary.count,2);assert.equal(summary.coins,coins);assert.equal(summary.xp,xp);assert.equal(claimed.state.coins,round(done.state.coins+coins));assert.equal(claimed.state.xp,round(done.state.xp+xp));assert.equal(claimed.state.stats.grossRevenue,round(done.state.stats.grossRevenue+transport));assert.equal(claimed.state.stats.contractBonusRevenue,round(done.state.stats.contractBonusRevenue+bonus));
 for(const rarity of Object.keys(done.state.inventory.gears))assert.equal(claimed.state.inventory.gears[rarity]-done.state.inventory.gears[rarity],pending.reduce((sum,o)=>sum+(o.completionReward.gears?.[rarity]||0),0));
 for(const [stock,key]of [['companyItems','companyItems'],['supplierContacts','supplierContacts']])assert.equal(claimed.state.inventory[stock]-done.state.inventory[stock],pending.reduce((sum,o)=>sum+(o.completionReward[key]||0),0));
 const again=cmd(JSON.parse(JSON.stringify(claimed.state)),'claimSingles',{},at);assert.equal(again.view.claimSummary,undefined);assert.equal(again.state.coins,claimed.state.coins);assert.equal(again.state.xp,claimed.state.xp);assert.deepEqual(again.state.inventory,claimed.state.inventory);
});
test('Trust and an already rolled customer follow-up are granted only on collection, never duplicated or rerolled on reload',()=>{
 const done=finish(setup('customer'),undefined,()=>0),o=find(done),before=done.state.customerTrust.nordbau||0;
 assert.equal(before,0);assert.equal(done.state.orders.some(o=>o.kind==='special'),false);assert.equal(o.completionReward.customerTrust,10);assert.equal(o.completionReward.followupKind,'special');
 const reloaded=cmd(JSON.parse(JSON.stringify(done.state)),'sync',{},o.completedAt,()=>.99);assert.equal(find(reloaded).completionReward.followupKind,'special');assert.equal(reloaded.state.orders.some(o=>o.kind==='special'),false);
 const claim=cmd(reloaded.state,'claimSingles',{},o.completedAt,()=>.99);assert.equal(claim.state.customerTrust.nordbau,10);const special=claim.state.orders.filter(o=>o.kind==='special');assert.equal(special.length,1);assert.equal(special[0].customer,'nordbau');assert.equal(special[0].category,o.category);
 const again=cmd(claim.state,'claimSingles',{},o.completedAt,()=>0);assert.equal(again.state.customerTrust.nordbau,10);assert.equal(again.state.orders.filter(o=>o.kind==='special').length,1);
});
test('A legacy active order keeps already paid deliveries and defers only transport completed after migration',()=>{
 const first=setup(),partial=cmd(first.state,'sync',{},find(first).tripSnapshot.endsAt),legacy=structuredClone(partial.state),o=legacy.orders.find(o=>o.id==='DEFER-SINGLE');
 const paid=structuredClone(o.bookedTransport);legacy.coins=round(legacy.coins+paid.revenue);legacy.xp=round(legacy.xp+paid.xp);legacy.stats.grossRevenue=round(legacy.stats.grossRevenue+paid.revenue);delete o.deferredTransport;
 const migrated=cmd(legacy),done=finish(migrated),final=find(done),pending=final.deferredTransport;
 assert.equal(pending.revenue,round(final.bookedTransport.revenue-paid.revenue));assert.equal(pending.xp,round(final.bookedTransport.xp-paid.xp));assert.equal(done.state.xp,legacy.xp);assert.equal(done.state.stats.grossRevenue,legacy.stats.grossRevenue);
 const claim=cmd(done.state,'claimSingles',{},final.completedAt);assert.equal(claim.state.coins,round(done.state.coins+pending.revenue+final.completionReward.coins));assert.equal(claim.state.xp,round(legacy.xp+pending.xp));assert.equal(claim.state.stats.grossRevenue,round(legacy.stats.grossRevenue+pending.revenue));
});
test('Legacy completed orders collect their saved bonus without repaying historical freight, XP, trust or follow-ups',()=>{
 const done=finish(setup('customer')),legacy=structuredClone(done.state),o=legacy.orders.find(o=>o.id==='DEFER-SINGLE'),reward=o.completionReward;
 const paid=o.bookedTransport;legacy.coins=round(legacy.coins+paid.revenue);legacy.xp=round(legacy.xp+paid.xp);legacy.stats.grossRevenue=round(legacy.stats.grossRevenue+paid.revenue);legacy.customerTrust.nordbau=10;o.trustAwarded=true;
 delete o.deferredTransport;for(const key of ['transportCoins','xp','totalCoins','customerTrust','followupKind'])delete reward[key];
 const claimed=cmd(legacy,'claimSingles',{},o.completedAt,()=>0);assert.equal(claimed.state.coins,round(legacy.coins+reward.coins));assert.equal(claimed.state.xp,legacy.xp);assert.equal(claimed.state.stats.grossRevenue,legacy.stats.grossRevenue);assert.equal(claimed.state.customerTrust.nordbau,10);assert.equal(claimed.state.orders.filter(o=>o.kind==='special').length,0);
 const again=cmd(claimed.state,'claimSingles',{},o.completedAt);assert.equal(again.state.coins,claimed.state.coins);assert.equal(again.state.xp,claimed.state.xp);
});
test('Season completion counts on delivery while earned coins and level-up rewards arrive on explicit collection',()=>{
 const initialState=initial().state;initialState.xp=90;const started=start(initialState),before=economicSnapshot(started),done=finish(started),o=find(done);
 assert.equal(done.state.season.metrics.singles,1);assert.equal(done.state.season.metrics.local,1);assert.equal(done.state.season.metrics.coins,0);assert.equal(done.state.xp,90);assert.equal(done.view.levelUps,undefined);assertNoPositiveAwards(before,done);
 const claim=cmd(done.state,'claimSingles',{},o.completedAt);assert.equal(claim.state.season.metrics.singles,1);assert.equal(claim.state.season.metrics.coins,o.completionReward.totalCoins);assert.equal(claim.state.xp,round(90+o.completionReward.xp));assert.ok(claim.view.levelUps?.length);assert.equal(claim.state.inventory.expeditionRefills,done.state.inventory.expeditionRefills+1);assert.equal(claim.state.inventory.overtimeRefills,done.state.inventory.overtimeRefills+1);
 const again=cmd(claim.state,'claimSingles',{},o.completedAt);assert.equal(again.state.season.metrics.coins,claim.state.season.metrics.coins);assert.equal(again.state.season.metrics.singles,1);assert.equal(again.view.levelUps,undefined);
});
test('Individual collection uses the same deferred payout and cannot collect active work or repeat a finished reward',()=>{
 const started=setup('customer'),partial=cmd(started.state,'sync',{},find(started).tripSnapshot.endsAt);
 const early=cmd(partial.state,'claim',{id:'DEFER-SINGLE'},find(partial).tripSnapshot.endsAt-1);
 assert.equal(early.view.claimSummary,undefined);assert.equal(early.state.coins,partial.state.coins);assert.equal(early.state.xp,partial.state.xp);assert.equal(find(early).deferredTransport.claimedAt,undefined);
 const done=finish(early,undefined,()=>.99),o=find(done),reward=o.completionReward;
 const claim=cmd(done.state,'claim',{id:o.id},o.completedAt,()=>0);
 assert.equal(claim.view.claimSummary.count,1);assert.equal(claim.view.claimSummary.coins,reward.totalCoins);assert.equal(claim.view.claimSummary.xp,reward.xp);assert.equal(claim.state.coins,round(done.state.coins+reward.totalCoins));assert.equal(claim.state.xp,round(done.state.xp+reward.xp));assert.equal(claim.state.customerTrust.nordbau,10);assert.equal(claim.state.orders.some(o=>o.kind==='special'),false,'a failed finish roll is never rerolled at claim');
 const again=cmd(JSON.parse(JSON.stringify(claim.state)),'claim',{id:o.id},o.completedAt);assert.equal(again.view.claimSummary,undefined);assert.equal(again.state.coins,claim.state.coins);assert.equal(again.state.xp,claim.state.xp);assert.equal(again.state.customerTrust.nordbau,10);
});
