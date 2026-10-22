// City hub vehicles use their own parts-based progression; card vehicles are unchanged.
const HUB_VEHICLE_PRICE=25000, HUB_VEHICLE_MAX=20, HUB_PART_STEP=14;
const isCityVehicle=t=>!!t&&!t.cardId&&t.tier<=1;
const hubPartDay=at=>Math.floor(at/86400000);
const cityVehicles=()=>game.trucks.filter(isCityVehicle);
hubCapacity=()=>Math.max(cityVehicles().length,Math.min(HUB_VEHICLE_MAX,Math.floor(levelForXp(game.xp).level/5)));
nextHubVehicleLevel=()=>cityVehicles().length>=HUB_VEHICLE_MAX||levelForXp(game.xp).level>=100?null:(Math.max(cityVehicles().length,Math.floor(levelForXp(game.xp).level/5))+1)*5;
function initHubParts() {
 game.inventory.hubVehicleParts ??= 0;
 game.hubCrates ??= {day:hubPartDay(Date.now()),opened:0,lastOpenedAt:null};
}
function migrateHubVehicles() {
 initHubParts();
 if(game.hubSystemVersion===1)return;
 for(const t of cityVehicles()){
  // Preserve attained performance. Convert speed ranks to the new ten-step track.
  const oldCapacity=t.capacity,oldMultiplier=1+(t.rarityLevel||0)*RARITY_SPEED_PER_LEVEL;
  t.hubSpeedLevel=Math.min(10,Math.ceil((t.rarityLevel||0)/5));
  t.hubCapacityLevel=Math.min(10,Math.max(0,Math.ceil((oldCapacity-2)/.2)));
  t.hubLegacyCapacity=Math.max(0,round2(oldCapacity-(2+.2*t.hubCapacityLevel)));
  t.hubLegacySpeed=Math.max(0,oldMultiplier-(1+.025*t.hubSpeedLevel));
  // Modules no longer have a role here; return them once, preserving vehicle capacity.
  game.inventory.capacityModules+=(t.moduleCapacitySpent??t.moduleCapacityLevel??0);
  t.moduleCapacityLevel=0;t.moduleCapacitySpent=0;t.rarityLevel=0;
  t.tier=0;t.model='Stadttransporter';t.capacity=round2(2+.2*t.hubCapacityLevel+t.hubLegacyCapacity);
 }
 const h=hub();if(h){h.cashboxParts??=0;h.partsLastAttemptAt=Date.now();}
 game.hubSystemVersion=1;
}
const hubOriginalSpeed=truckSpeed;
truckSpeed=(t,cargo=0)=>isCityVehicle(t)?SPEED_KM_PER_SECOND*(1+.025*(t.hubSpeedLevel||0)+(t.hubLegacySpeed||0))*(1+activeCardBonus(t,'speed')/100)*(1-cargo*SPEED_LOSS_PER_TON):hubOriginalSpeed(t,cargo);
const hubOriginalRank=upgradeTruckRarity,hubOriginalCapacity=upgradeTruckCapacity;
upgradeTruckRarity=id=>isCityVehicle(truckById(id))?false:hubOriginalRank(id);
upgradeTruckCapacity=id=>isCityVehicle(truckById(id))?false:hubOriginalCapacity(id);
function buyHubVehicle() {
 const h=hub();if(!h||!hubUnlocked()||cityVehicles().length>=hubCapacity()||cityVehicles().length>=HUB_VEHICLE_MAX||game.coins<HUB_VEHICLE_PRICE)return false;
 settleHub(Date.now());
 const empty=!hubTrucks().length;
 const t={id:'LKW-'+String(game.nextTruck++).padStart(2,'0'),tier:0,model:'Stadttransporter',capacity:2,symbol:TRUCKS[0].symbol,rarityLevel:0,hubAssigned:true,purchasePrice:HUB_VEHICLE_PRICE,kmDriven:0,toursCompleted:0,ordersCompleted:0,hubCapacityLevel:0,hubSpeedLevel:0};
 game.trucks.push(t);game.coins=round2(game.coins-HUB_VEHICLE_PRICE);game.stats.truckSpent+=HUB_VEHICLE_PRICE;
 if(empty){h.nextCycleAt=Date.now()+HUB_CYCLE_MS;beginHubCycle(h);}
 else t.hubToursInCycle=Math.floor(clamp((Date.now()-(h.nextCycleAt-HUB_CYCLE_MS))/(HUB_WORK_SECONDS*1000),0,1)*HUB_WORK_SECONDS/hubTripSeconds(t));
 return true;
}
// The legacy dealer command cannot bypass the price or expose a second city model.
buyTruck=()=>false;
function hubVehicleQuote(t,kind) {
 const level=t[kind==='capacity'?'hubCapacityLevel':'hubSpeedLevel']||0;
 return {level,max:10,parts:level<10?HUB_PART_STEP*(level+1):0,coins:level<10?2500*(level+1):0,
  current:kind==='capacity'?t.capacity:truckSpeed(t),
  next:kind==='capacity'?round2(t.capacity+.2):SPEED_KM_PER_SECOND*(1+.025*(level+1)+(t.hubLegacySpeed||0))*(1+activeCardBonus(t,'speed')/100)};
}
function upgradeHubVehicle(id,kind) {
 const t=truckById(id);if(!isCityVehicle(t)||!['capacity','speed'].includes(kind))return false;
 const q=hubVehicleQuote(t,kind);
 if(q.level>=10||game.inventory.hubVehicleParts<q.parts||game.coins<q.coins)return false;
 settleHub(Date.now());game.inventory.hubVehicleParts-=q.parts;game.coins=round2(game.coins-q.coins);
 t[kind==='capacity'?'hubCapacityLevel':'hubSpeedLevel']=q.level+1;
 if(kind==='capacity')t.capacity=q.next;
 t.hubUpgradeCoins=(t.hubUpgradeCoins||0)+q.coins;
 game.stats.hubVehicleUpgradeSpent=(game.stats.hubVehicleUpgradeSpent||0)+q.coins;
 return true;
}
const originalHubSaleQuote=saleQuote;
saleQuote=t=>{
 const q=originalHubSaleQuote(t);
 if(!isCityVehicle(t))return q;
 // Parts cannot be farmed by upgrading and selling; coin investment retains half its value.
 return {...q,coins:round2(q.coins+(t.hubUpgradeCoins||0)*.5),gears:Object.fromEntries(RARITIES.map(r=>[r.id,0])),modulesLost:0};
};
function rollHubPart(h,at) {
 if(h.cashboxCycles>=HUB_CASHBOX_CYCLES||!(h.cycleCapacity>0)||!hubTrucks().length)return;
 if(h.partsLastAttemptAt!=null&&at<h.partsLastAttemptAt+HUB_CYCLE_MS)return;
 if(h.partsAttemptDay!==hubPartDay(at)){h.partsAttemptDay=hubPartDay(at);h.partsAttempts=0;}
 if(h.partsAttempts>=24)return;
 h.partsLastAttemptAt=at;h.partsAttempts++;
 if(Math.random()<.5)h.cashboxParts=(h.cashboxParts||0)+1;
}
const originalBeginHubCycle=beginHubCycle;
beginHubCycle=h=>{originalBeginHubCycle(h);rollHubPart(h,h.nextCycleAt-HUB_CYCLE_MS);};
const originalCollectHub=collectHub;
collectHub=()=>{
 const h=hub();if(!h)return false;
 settleHub(Date.now());const parts=h.cashboxParts||0;
 originalCollectHub();game.inventory.hubVehicleParts+=parts;h.cashboxParts=0;
 return true;
};
function hubCrateView(now) {
 const c=game.hubCrates,opened=c.day===hubPartDay(now)?c.opened:0;
 const cooldown=c.lastOpenedAt==null?now:c.lastOpenedAt+30*60*1000;
 return {opened,max:3,nextAt:Math.max(cooldown,opened>=3?(hubPartDay(now)+1)*86400000:now),
  available:hubUnlocked()&&opened<3&&now>=cooldown};
}
function openHubCrate() {
 const now=Date.now();if(!hubCrateView(now).available)return false;
 const c=game.hubCrates;if(c.day!==hubPartDay(now)){c.day=hubPartDay(now);c.opened=0;}
 const amount=10+Math.floor(Math.random()*11);
 c.opened++;c.lastOpenedAt=now;game.inventory.hubVehicleParts+=amount;
 return amount;
}
