/** Detect only a confirmed card upgrade; never silence rejected actions. */
export function transportCardUpgradeApplied(action:string,id:string,before:any,after:any){
 const value=(view:any)=>action==='cardUpgrade'?view?.state?.expedition?.characters?.[id]?.level:
  action==='cardCapacity'?view?.cardVehicles?.[id]?.capacityLevel:
  action==='cardRank'?view?.cardVehicles?.[id]?.rank?.total:undefined;
 const previous=value(before),next=value(after);
 return typeof previous==='number'&&typeof next==='number'&&next>previous;
}
