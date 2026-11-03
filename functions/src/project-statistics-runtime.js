// Preserve cumulative completions independently from the visible order history.
function projectCompletionStats(){
  const stats=game.stats.projectCompletions;
  if(stats?.version===1)return stats;
  const migrated={version:1,specialByCustomer:{},referral:0};
  for(const order of game.orders){
    if(order.status!=='completed')continue;
    if(order.kind==='referral')migrated.referral++;
    else if(order.kind==='special'&&order.customer)migrated.specialByCustomer[order.customer]=(migrated.specialByCustomer[order.customer]||0)+1;
  }
  game.stats.projectCompletions=migrated;
  return migrated;
}
const originalFinishCountedProject=finishFleetProject;
finishFleetProject=(order,at)=>{
  // Initialize before the transition: a legacy completed record must not be
  // migrated and subsequently counted again by this completion callback.
  const stats=projectCompletionStats();
  if(order.status!=='active')return;
  originalFinishCountedProject(order,at);
  if(order.status!=='completed')return;
  if(order.kind==='referral')stats.referral++;
  else if(order.kind==='special'&&order.customer)stats.specialByCustomer[order.customer]=(stats.specialByCustomer[order.customer]||0)+1;
};
function grantTestProjects(){
  const orders=EXPEDITION_CUSTOMER_IDS.map((customerId,region)=>{
    const customer=customerById(customerId);
    return queueCustomerTrip({category:customer.category,customer:customerId,homeCity:game.startCity,region},'special');
  });
  const customer=customerById(EXPEDITION_CUSTOMER_IDS[0]);
  orders.push(queueCustomerTrip({category:customer.category,customer:customer.id,homeCity:game.startCity,region:0},'referral'));
  mobileToast='Testaufträge erhalten: 5 Sonderaufträge und 1 Empfehlungsauftrag.';
  return orders.map(order=>order.id);
}
