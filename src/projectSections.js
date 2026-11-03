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
module.exports={projectSections,orderedProjectCategories};
