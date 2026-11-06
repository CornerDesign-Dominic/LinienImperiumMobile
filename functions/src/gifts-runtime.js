// Regional ownership IDs stay stable. Trade chests are one universal inventory item.
EXPEDITION_CHARACTERS.splice(0,EXPEDITION_CHARACTERS.length,...transportCards);
const TRADE_CHEST_PRICE=200;
const ENDLESS_COSTS=[5,6,7,8,10];
const ENDLESS_GEAR_RANGES=[{common:[20,30]},{common:[30,45],uncommon:[2,4]},{common:[40,60],uncommon:[5,8]},{common:[50,75],uncommon:[8,12],rare:[1,2]},{common:[60,90],uncommon:[12,18],rare:[2,4]}];
const ENDLESS_SHARDS=[1,1,2,2,3],ENDLESS_SHARD_TIERS=[1,2,2,3,3];
function expeditionChanceLevel(){return clamp(Math.floor(Number(companyFor().expeditionChanceLevel)||0),0,15);}
function expeditionProjectChances(){const combined=(10+expeditionChanceLevel())/1000;return {special:combined*.9,referral:combined*.1};}
function expeditionUpgradeView(){const level=expeditionChanceLevel();return {level,limit:15,combinedChance:round2((10+level)/10),maximumChance:2.5,cost:level<15?{coins:10000*(level+1),items:1+Math.floor(level/5)}:null};}
function upgradeExpeditionChance(expected){
 const upgrade=expeditionUpgradeView();if(expected!==upgrade.level)throw Error('Expeditionsbonus geändert. Bitte neu laden.');
 if(!upgrade.cost)throw Error('Maximaler Expeditionsbonus erreicht.');
 if(game.coins<upgrade.cost.coins||(game.inventory.companyItems||0)<upgrade.cost.items)throw Error('Nicht genügend Mittel für den Expeditionsbonus.');
 game.coins-=upgrade.cost.coins;game.inventory.companyItems-=upgrade.cost.items;companyFor().expeditionChanceLevel=upgrade.level+1;
 addEvent('Expeditionsbonus auf Stufe '+(upgrade.level+1)+' verbessert.');return true;
}
function endlessCost(region){return ENDLESS_COSTS[region];}
function endlessGearView(region){const chances=expeditionProjectChances();return {chance:round2((.5-chances.special-chances.referral)*100),ranges:ENDLESS_GEAR_RANGES[region],shards:ENDLESS_SHARDS[region],companyItemsChance:6,moduleChance:.3};}
function regionVehiclePool(region){
 const cards=EXPEDITION_CHARACTERS.filter(card=>card.region===region&&['common','uncommon','rare'].includes(card.rarity));
 const weights={common:.15,uncommon:.10,rare:.05};
 return cards.map(card=>({...card,chance:weights[card.rarity]/cards.filter(other=>other.rarity===card.rarity).length}));
}
// Existing test pool is retained until chest odds are explicitly rebalanced.
function regionGiftPool(region){const cards=EXPEDITION_CHARACTERS.filter(card=>card.region===region);return cards.map(card=>({...card,chance:1/cards.length}));}
function vehicleFromPool(region,roll,pool=regionVehiclePool(region)){
 let total=0;return pool.find(card=>(total+=card.chance)>roll)||pool.at(-1);
}
function awardVehicleCard(card){
 const duplicate=Boolean(game.expedition.characters[card.id]);
 if(duplicate)game.expedition.shards[card.rarity]=(game.expedition.shards[card.rarity]||0)+1;
 else game.expedition.characters[card.id]={level:1,progress:0};
 return {cardId:card.id,region:card.region,duplicate,shards:duplicate?1:0};
}
function migrateTradeChests(){
 if(!Number.isSafeInteger(game.inventory.tradeChests)||game.inventory.tradeChests<0)game.inventory.tradeChests=0;
 game.tradeChestRegions=Array.isArray(game.tradeChestRegions)?[...new Set(game.tradeChestRegions.filter(index=>Number.isInteger(index)&&index>=0&&index<EXPEDITION_REGIONS.length))]:[];
 for(let index=0;index<game.expedition.regions.length;index++)if(expeditionRegionCompleted(game.expedition.regions[index])&&!game.tradeChestRegions.includes(index)){
  game.inventory.tradeChests++;game.tradeChestRegions.push(index);addEvent(EXPEDITION_REGIONS[index]+': Region abgeschlossen – 1 Handelstruhe erhalten.');
 }
}
function tradeChestView(){migrateTradeChests();return {count:game.inventory.tradeChests,price:TRADE_CHEST_PRICE,regions:EXPEDITION_REGIONS.map((name,region)=>({region,name,unlocked:expeditionRegionOpen(region),cards:regionGiftPool(region).map(card=>({...card,chance:round2(card.chance*100)}))}))};}
function buyTradeChest(){
 migrateTradeChests();const wallet=__seasonPremium(game);if(wallet.balance<TRADE_CHEST_PRICE)throw Error('Nicht genügend Hermes-Siegel.');
 if(!Number.isSafeInteger(game.inventory.tradeChests+1))throw Error('Zu viele Handelstruhen.');
 wallet.balance-=TRADE_CHEST_PRICE;game.inventory.tradeChests++;addEvent('1 Handelstruhe für 200 Hermes-Siegel gekauft.');return true;
}
function openRegionGift(region){
 migrateTradeChests();
 if(!Number.isInteger(region)||region<0||region>=EXPEDITION_REGIONS.length||!expeditionRegionOpen(region)||game.inventory.tradeChests<1)return false;
 const card=vehicleFromPool(region,Math.random(),regionGiftPool(region));if(!card)return false;
 game.inventory.tradeChests--;const result=awardVehicleCard(card);
 addEvent(EXPEDITION_REGIONS[region]+': Handelstruhe geöffnet – '+card.name+'.');save();render();return result;
}
function awardEndlessGears(region){
 const summary={source:'Endlosexpedition',count:1,coins:0,gears:{},shards:{},capacityModules:0,companyItems:0,supplierContacts:0};
 for(const [rarity,[min,max]]of Object.entries(ENDLESS_GEAR_RANGES[region])){const amount=random(min,max);game.inventory.gears[rarity]+=amount;summary.gears[rarity]=amount;}
 for(let i=0;i<ENDLESS_SHARDS[region];i++){const rarity=rollExpeditionShard(ENDLESS_SHARD_TIERS[region]);game.expedition.shards[rarity]=(game.expedition.shards[rarity]||0)+1;summary.shards[rarity]=(summary.shards[rarity]||0)+1;}
 if(Math.random()<.06){const amount=region<2?1:region<4?2:3;game.inventory.companyItems=(game.inventory.companyItems||0)+amount;summary.companyItems=amount;}
 if(Math.random()<.003){game.inventory.capacityModules++;summary.capacityModules=1;}
 return summary;
}
drawExpeditionJob=index=>{
 const region=game.expedition.regions[index];
 if(!region?.endlessUnlocked||!expeditionRegionOpen(index)||!spendExpeditionPoints(endlessCost(index)))return false;
 const draw=Math.random(),pool=regionVehiclePool(index),chances=expeditionProjectChances();
 if(draw<.30){const card=vehicleFromPool(index,draw,pool);awardVehicleCard(card);addEvent(EXPEDITION_REGIONS[index]+': '+card.name+' gefunden.');save();render();return 'card:'+card.id;}
 if(draw<.50){
  const customer=customerById(EXPEDITION_CUSTOMER_IDS[index]),order=createOrder(game.nextOrder++,{category:customer.category,customer:customer.id});
  order.kind='normal';order.crafted=true;order.status='queued';game.orders.push(order);addEvent(customer.name+': Kundenauftrag '+order.id+' gefunden.');save();render();return 'customer';
 }
 if(draw>=1-chances.special-chances.referral){const kind=draw<1-chances.referral?'special':'referral',customer=customerById(EXPEDITION_CUSTOMER_IDS[index]);queueCustomerTrip({category:customer.category,customer:customer.id,homeCity:game.startCity,region:index},kind);addEvent(EXPEDITION_REGIONS[index]+': '+expeditionJobLabel(kind)+' gefunden.');save();render();return kind;}
 const summary=awardEndlessGears(index);addEvent(EXPEDITION_REGIONS[index]+': Zahnräder und Shards gefunden.');save();render();return summary;
};
