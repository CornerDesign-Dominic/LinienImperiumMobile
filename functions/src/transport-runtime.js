// Regional card rules run inside the mobile engine; city vehicles keep their own track.
cardBonusValue = (card, level = game.expedition.characters[card.id]?.level || 1) =>
  card.bonusLevels[clamp(Math.floor(level), 1, 10) - 1];
const cardCapacity = (card, level = 0) => round2(card.baseCapacity * (1 + level * card.capacityStepPercent / 100));
const originalCreateTransport = createCardTruck;
createCardTruck = card => ({...originalCreateTransport(card), capacity:card.baseCapacity, transportVersion:1});
function migrateTransportCards() {
  const trucks = [...game.trucks,...Object.values(game.expedition.characters).map(c=>c.parkedTruck).filter(Boolean)];
  for (const truck of trucks) {
    const card = vehicleCardById(truck.cardId);
    if (!card || truck.transportVersion === 1) continue;
    // Keep purchased ranks, module levels, ownership, card XP and in-flight snapshots.
    truck.model=card.name; truck.capacity=cardCapacity(card,truck.moduleCapacityLevel||0);
    truck.transportVersion=1;
  }
}
const transportOriginalSpeed=truckSpeed;
truckSpeed=(truck,cargo=0)=>transportOriginalSpeed(truck,cargo)*(vehicleCardById(truck.cardId)?.baseSpeed||1);
cardBonusStats=(truck,mode='garage')=>{
  if(truck.bonusStats)return truck.bonusStats;
  const stats={speed:0,cost:0,pay:0,xp:0};
  const add=card=>{if(card && Object.hasOwn(stats,card.stat))stats[card.stat]+=cardBonusValue(card);};
  const own=vehicleCardById(truck.cardId);
  if(own?.scope==='self')add(own);
  // Garage-wide transport effects also support city vehicles, and include their donor.
  if(mode!=='fleet')for(const t of game.trucks){const card=vehicleCardById(t.cardId);if(card?.scope==='garage')add(card);}
  return stats;
};
const originalTransportCapacityUpgrade=upgradeTruckCapacity;
upgradeTruckCapacity=id=>{
  const truck=truckById(id),card=vehicleCardById(truck?.cardId);
  if(!card)return originalTransportCapacityUpgrade(id);
  const level=truck.moduleCapacityLevel||0;
  if(level>=Math.max(card.maxCapacityLevel,level)||game.inventory.capacityModules<1)return false;
  game.inventory.capacityModules--; truck.moduleCapacityLevel=level+1;
  truck.moduleCapacitySpent=(truck.moduleCapacitySpent||0)+1;
  truck.capacity=cardCapacity(card,level+1);
  addEvent(card.name+': Kapazität auf '+truck.capacity+' t erhöht.');
  save();return true;
};

function garagePointBonus(stat){
  return game.trucks.reduce((sum,t)=>{const card=vehicleCardById(t.cardId);
    return sum+(card?.scope==='garage'&&card.stat===stat?cardBonusValue(card):0);},0);
}
const originalExpeditionCapacity=expeditionCapacity;
expeditionCapacity=()=>originalExpeditionCapacity()+garagePointBonus('expeditionCapacity');
function overtimeCapacity(){return (game.overtimeCapacity??100)+garagePointBonus('overtimeCapacity');}
function expeditionInterval(){return Math.max(1000,EXPEDITION_REGEN_MS-garagePointBonus('expeditionRegen')*1000);}
function pointClock(kind){
  const expedition=kind==='expedition',stock=expedition?game.expedition:game;
  return {stock,points:expedition?'points':'overtimePoints',last:expedition?'lastRegenAt':'overtimeLastRegenAt',
    capacity:expedition?expeditionCapacity():overtimeCapacity(),interval:expedition?expeditionInterval():OVERTIME_REGEN_MS};
}
function regeneratePoints(kind,now){
  const c=pointClock(kind),s=c.stock;
  s[c.last]??=now;
  if(s[c.points]>=c.capacity){s[c.last]=now;return false;}
  if(s.pausedRegenProgress!=null){s[c.last]=now-s.pausedRegenProgress*c.interval;delete s.pausedRegenProgress;}
  const earned=Math.floor(Math.max(0,now-s[c.last])/c.interval);
  if(!earned)return false;
  s[c.points]=Math.min(c.capacity,s[c.points]+earned);
  s[c.last]+=earned*c.interval;
  if(s[c.points]>=c.capacity){s[c.last]=now;s.pausedRegenProgress=0;}
  return true;
}
regenerateExpedition=(now=Date.now())=>regeneratePoints('expedition',now);
regenerateOvertime=(now=Date.now())=>regeneratePoints('overtime',now);
function capturePointClocks(now=Date.now()){
  return ['expedition','overtime'].map(kind=>{const c=pointClock(kind),paused=c.stock[c.points]>=c.capacity;
    return {kind,capacity:c.capacity,interval:c.interval,paused,
      progress:paused?(c.stock.pausedRegenProgress||0):clamp((now-c.stock[c.last])/c.interval,0,1)};});
}
function reconcilePointClocks(before,now=Date.now()){
  for(const previous of before){
    const c=pointClock(previous.kind),s=c.stock,paused=s[c.points]>=c.capacity;
    const configChanged=previous.capacity!==c.capacity||previous.interval!==c.interval;
    if(!configChanged&&previous.paused===paused)continue;
    // Removing a capacity donor freezes the partial countdown without deleting overflow.
    if(paused){s.pausedRegenProgress=configChanged?previous.progress:0;s[c.last]=now;}
    else {s[c.last]=now-previous.progress*c.interval;delete s.pausedRegenProgress;}
  }
}
