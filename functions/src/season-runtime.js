// Bridge real transitions into the authoritative Season ledger. These wrappers
// run during chronological settlement and never infer activity from test grants.
const beforeSeasonSingleFinish=finishSingleTourOrder;
finishSingleTourOrder=(order,truck,at)=>{
 const wasActive=order.status==='active';beforeSeasonSingleFinish(order,truck,at);
 if(!wasActive||order.status!=='completed')return;
 __seasonRecord(game,'singles',1,at);
 if(['national','international'].includes(order.category))__seasonRecord(game,order.category==='national'?'local':'long',1,at);
 if(order.kind==='normal'&&order.customer){__seasonRecord(game,'customers',1,at,order.customer);__seasonRecord(game,'customerOrders',1,at);}
};
const beforeSeasonProcurementFinish=finishProcurementTour;
finishProcurementTour=(run,at)=>{beforeSeasonProcurementFinish(run,at);__seasonRecord(game,'procurement',1,at);};
const beforeSeasonCrate=openHubCrate;
openHubCrate=()=>{const result=beforeSeasonCrate();if(result>0)__seasonRecord(game,'crates',1,Date.now());return result;};
const beforeSeasonProjectFinish=finishFleetProject;
finishFleetProject=(order,at)=>{
 const wasActive=order.status==='active';beforeSeasonProjectFinish(order,at);
 if(wasActive&&order.status==='completed')__rollSeasonHermes(order);
};
const beforeSeasonApplyReward=applyOrderReward;
applyOrderReward=order=>{
 if(order?.status==='completed'&&order.completionReward&&!order.completionReward.claimedAt)__rollSeasonHermes(order);
 const result=beforeSeasonApplyReward(order);if(!result)return result;
 const reward=order.completionReward;
 if(order.project&&['special','referral'].includes(order.kind)){
  const amount=reward.hermes||0;__seasonPremium(game).balance+=amount;
  __seasonRecord(game,'projects',1,Date.now());
 }
 __seasonRecord(game,'coins',reward.totalCoins??reward.coins,Date.now());
 return result;
};
const beforeSeasonHubCollect=collectHub;
collectHub=()=>{const result=beforeSeasonHubCollect();if(result?.coins>0)__seasonRecord(game,'coins',result.coins,Date.now());return result;};
const beforeSeasonExpeditionCollect=collectExpeditionOrderRewards;
collectExpeditionOrderRewards=summary=>{const before=summary.coins||0,result=beforeSeasonExpeditionCollect(summary);if(result.coins>before)__seasonRecord(game,'coins',result.coins-before,Date.now());return result;};
function grantSeasonSpecial(){
 const customerId=EXPEDITION_CUSTOMER_IDS.find(id=>customerUnlocked(id))||EXPEDITION_CUSTOMER_IDS[0],region=EXPEDITION_CUSTOMER_IDS.indexOf(customerId),customer=customerById(customerId);
 return queueCustomerTrip({category:customer.category,customer:customerId,homeCity:game.startCity,region},'special');
}

// Use the shared normal-customer generator: its route category independently
// rolls 50/50, its cargo comes from the selected unlocked customer's catalog.
function grantSeasonCustomer(){
 const customers=CUSTOMERS.filter(customer=>customerUnlocked(customer.id));if(!customers.length)return false;
 const customer=pick(customers),order=createOrder(game.nextOrder++,{customer:customer.id,kind:'normal'});
 order.status='queued';order.crafted=true;game.orders.push(order);return order;
}
