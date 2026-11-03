// One classification for tab counts and the running/rewards view.
function projectSections(allOrders){
 const orders=allOrders.filter(order=>order.isProject);
 return {
  orders,
  active:orders.filter(order=>order.status==='active'),
  queued:orders.filter(order=>order.status==='queued'),
  rewards:orders.filter(order=>order.status==='completed'&&order.completionReward&&!order.completionReward.claimedAt)
 };
}
// Catalogue/region order is independent from inventory and activity.
function orderedProjectCategories(catalog){
 const ranks={common:0,uncommon:1,rare:2,epic:3,legendary:4};
 const rarity=entry=>ranks[entry.rarity??(entry.kind==='referral'?'epic':'rare')]??-1;
 return catalog.map((info,index)=>({info,index})).sort((a,b)=>rarity(b.info)-rarity(a.info)||(b.info.region??-1)-(a.info.region??-1)||a.index-b.index).map(entry=>entry.info);
}
// Status groups never sort by the ticking ETA. Within a group use catalogue
// rarity/region priority; equal categories keep their persisted server order.
function orderedRunningProjects(allOrders){
 const {active,rewards}=projectSections(allOrders);
 const sort=orders=>orderedProjectCategories(orders.map(order=>({...order.projectInfo,kind:order.kind,order}))).map(entry=>entry.order);
 return [...sort(active),...sort(rewards)];
}
// Only a confirmed authoritative transition may open the existing reward output.
function projectClaimSummary(previousOrders,nextOrders,id){
 const previous=previousOrders.find(order=>order.id===id&&order.isProject);
 const next=nextOrders.find(order=>order.id===id&&order.isProject);
 const reward=next?.completionReward;
 if(previous?.status!=='completed'||!previous.completionReward||previous.completionReward.claimedAt||next?.status!=='completed'||!reward?.claimedAt)return null;
 return {count:1,coins:reward.coins,gears:reward.gears||{},capacityModules:Number(Boolean(reward.capacityModule)),companyItems:reward.companyItems||0,supplierContacts:reward.supplierContacts||0};
}
module.exports={projectSections,orderedProjectCategories,orderedRunningProjects,projectClaimSummary};
