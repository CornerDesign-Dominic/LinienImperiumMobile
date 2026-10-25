// Rewards are settled by the server; the persisted inbox is informational only.
function expansionState(){
  if(!game.expansion){
    game.expansion={available:0,expedition:0,overtime:0,convertedDeliveries:0,nextNotice:1,notices:[]};
    for(const mission of game.expedition.missions){
      if(mission.claimedAt||mission.status==='completed'&&mission.kind==='endless')mission.completionRecorded=true;
    }
  }
  return game.expansion;
}
const beforeExpansionCapacity=expeditionCapacity,beforeExpansionOvertimeCapacity=overtimeCapacity;
expeditionCapacity=()=>{const e=expansionState();return beforeExpansionCapacity()-e.convertedDeliveries+e.expedition;};
overtimeCapacity=()=>beforeExpansionOvertimeCapacity()+expansionState().overtime;
const beforeAutomaticClaimMission=claimExpeditionMission;
function collectCompletedExpedition(mission){
  if(mission.status!=='completed'||mission.completionRecorded)return false;
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
