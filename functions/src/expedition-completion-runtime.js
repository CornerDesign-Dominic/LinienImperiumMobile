// Place milestones settle automatically; repeatable vehicle jobs join single-order collection.
// Roll exactly once at arrival, but defer all inventory/currency changes until collection.
awardExpeditionLoot=mission=>{
 const coins=Math.round((mission.lootKind==='character'?5:15)*(mission.region+1));
 const reward={coins,shards:{},capacityModule:false,companyItems:0,claimedAt:null};
 const labels=[coins+' M'];
 const shard=()=>{const rarity=rollExpeditionShard(expeditionJobTier(mission));reward.shards[rarity]=(reward.shards[rarity]||0)+1;labels.push('1 '+rarity+'-Shard');};
 if(mission.lootKind==='character'||Math.random()<.2){const amount=1+(Math.random()<.2?1:0);for(let i=0;i<amount;i++)shard();}
 if(mission.lootKind==='character')shard();
 if(mission.lootKind==='material'&&Math.random()<.003){reward.capacityModule=true;labels.push('1 Kapazitätsmodul');}
 if(mission.lootKind==='material'){
  reward.companyItems=Math.random()<COMPANY_BALANCE.materialItemChance?COMPANY_BALANCE.materialItemsByTier[expeditionJobTier(mission)-1]:0;
  if(reward.companyItems)labels.push(reward.companyItems+' Firmenausbau-Items');
 }
 mission.completionReward=reward;mission.reward=labels.join(' · ');
};
function pendingExpeditionOrder(mission){return mission.kind==='endless'&&mission.status==='completed'&&mission.completionReward&&!mission.completionReward.claimedAt;}
function collectExpeditionOrderRewards(summary){
 for(const mission of game.expedition.missions.filter(pendingExpeditionOrder)){
  const reward=mission.completionReward;
  game.coins=round2(game.coins+reward.coins);
  game.stats.expeditionRevenue=round2((game.stats.expeditionRevenue||0)+reward.coins);
  summary.coins=round2(summary.coins+reward.coins);summary.count++;
  summary.shards??={};
  for(const [rarity,amount] of Object.entries(reward.shards||{})){
   game.expedition.shards[rarity]+=amount;summary.shards[rarity]=(summary.shards[rarity]||0)+amount;
  }
  if(reward.capacityModule){game.inventory.capacityModules++;summary.capacityModules++;}
  game.inventory.companyItems=(game.inventory.companyItems||0)+reward.companyItems;summary.companyItems+=reward.companyItems;
  mission.companyItemsAwarded=reward.companyItems;reward.claimedAt=Date.now();mission.claimedAt=Date.now();mission.completionRecorded=true;
 }
 return summary;
}
function expansionState(){
  if(!game.expansion){
    game.expansion={available:0,expedition:0,overtime:0,convertedDeliveries:0,nextNotice:1,notices:[]};
    for(const mission of game.expedition.missions){
      if(mission.claimedAt||mission.status==='completed'&&mission.kind==='endless')mission.completionRecorded=true;
    }
  }
  // Old endless completions were already paid. Never turn them into pending loot.
  for(const mission of game.expedition.missions)if(mission.kind==='endless'&&mission.status==='completed'&&!mission.completionReward){mission.completionRecorded=true;mission.claimedAt??=mission.endsAt||Date.now();}
  game.expansion.notices=game.expansion.notices.filter(notice=>notice.kind!=='endless');
  return game.expansion;
}
const beforeExpansionCapacity=expeditionCapacity,beforeExpansionOvertimeCapacity=overtimeCapacity;
expeditionCapacity=()=>{const e=expansionState();return beforeExpansionCapacity()-e.convertedDeliveries+e.expedition;};
overtimeCapacity=()=>beforeExpansionOvertimeCapacity()+expansionState().overtime;
const beforeAutomaticClaimMission=claimExpeditionMission;
function collectCompletedExpedition(mission){
  if(mission.kind==='endless'||mission.status!=='completed'||mission.completionRecorded)return false;
  const e=expansionState(),region=game.expedition.regions[mission.region];
  let points=0,modules=0,customerId=null;
  if(mission.kind==='delivery'){
    if(mission.claimedAt||region.deliveries[mission.place]){mission.completionRecorded=true;return false;}
    region.deliveries[mission.place]=true;
    e.convertedDeliveries++;e.available++;points=1;
    mission.claimedAt=Date.now();mission.reward='1 Erweiterungspunkt erhalten';
    addEvent(EXPEDITION_REGIONS[mission.region]+': '+mission.reward+'.');
  }else if(mission.kind==='final'){
    if(mission.claimedAt||region.finalClaimed){mission.completionRecorded=true;return false;}
    const before=game.inventory.capacityModules;
    if(!beforeAutomaticClaimMission(mission.id))return false;
    modules=game.inventory.capacityModules-before;
    customerId=EXPEDITION_CUSTOMER_IDS[mission.region];
  }else if(mission.kind!=='endless')return false;
  mission.completionRecorded=true;
  e.notices.push({sequence:e.nextNotice++,missionId:mission.id,kind:mission.kind,region:mission.region,
    place:mission.kind==='final'?7:mission.place,completedAt:mission.endsAt,
    reward:mission.reward,expansionPoints:points,capacityModules:modules,customerId});
  return true;
}
const beforeAutomaticSettleExpeditions=settleExpeditions;
settleExpeditions=(now=Date.now())=>{
  expansionState();
  // Preserve references to arrivals even when the legacy history pruner runs.
  const missions=game.expedition.missions.slice();
  let changed=beforeAutomaticSettleExpeditions(now);
  for(const mission of missions.filter(m=>m.status==='completed').sort((a,b)=>a.endsAt-b.endsAt||a.id-b.id))changed=collectCompletedExpedition(mission)||changed;
  // The legacy history limit must never discard rewards waiting for collection.
  for(const mission of missions)if(pendingExpeditionOrder(mission)&&!game.expedition.missions.includes(mission))game.expedition.missions.push(mission);
  if(changed)save();
  return changed;
};
claimExpeditionMission=missionId=>{
  const mission=game.expedition.missions.find(m=>m.id===missionId);
  return mission?.status==='completed'?(collectCompletedExpedition(mission)||!!mission.claimedAt):false;
};
function acknowledgeExpeditionCompletions(through){
  const e=expansionState();
  if(through>=e.nextNotice)throw Error('Ungültige Expeditionsmeldung.');
  e.notices=e.notices.filter(notice=>notice.sequence>through);
  return true;
}
function allocateExpansionPoints(expedition,overtime,expected){
  const e=expansionState(),total=expedition+overtime;
  if(expected!==e.available)throw Error('Erweiterungspunkte wurden geändert. Bitte erneut verteilen.');
  if(!total||total>e.available)throw Error('Nicht genügend Erweiterungspunkte.');
  e.available-=total;e.expedition+=expedition;e.overtime+=overtime;
  addEvent(total+' Erweiterungspunkte dauerhaft verteilt.');
  return true;
}
