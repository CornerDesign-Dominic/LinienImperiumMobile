// Regional ownership IDs stay stable. Trade chests are one universal inventory item.
EXPEDITION_CHARACTERS.splice(0,EXPEDITION_CHARACTERS.length,...transportCards);
const TRADE_CHEST_PRICE=200;
const ENDLESS_COSTS=[5,6,7,8,10];
const ENDLESS_GEAR_RANGES=[{common:[20,30]},{common:[30,45],uncommon:[2,4]},{common:[40,60],uncommon:[5,8]},{common:[50,75],uncommon:[8,12],rare:[1,2]},{common:[60,90],uncommon:[12,18],rare:[2,4]}];
// Expedition probabilities belong to the regular customer of this region.
// Their existing skill tracks keep their original contract effects as well.
function expeditionProjectChances(region){
 const skills=customerSkillLevels(EXPEDITION_CUSTOMER_IDS[region]);
 const level=kind=>clamp(Math.floor(Number(skills[kind])||0),0,25);
 return {special:.009+level('special')*.00054,referral:.001+level('referral')*.00006};
}
function removeExpeditionUpgrade(){
 const company=companyFor();if(!Object.hasOwn(company,'expeditionChanceLevel'))return;
 const previous=company.expeditionChanceLevel;delete company.expeditionChanceLevel;
 if(game.removedExpeditionUpgradeRefund?.version===1)return;
 // The retired purchase action stored only its level. Its fixed historical
 // prices reconstruct exactly what was spent, never the current skill level.
 const level=Number.isSafeInteger(previous)&&previous>=0&&previous<=15?previous:0;
 const coins=10000*level*(level+1)/2;
 let companyItems=0;for(let i=0;i<level;i++)companyItems+=1+Math.floor(i/5);
 game.coins=round2(game.coins+coins);game.inventory.companyItems=(game.inventory.companyItems||0)+companyItems;
 game.stats.removedUpgradeRefund=round2((game.stats.removedUpgradeRefund||0)+coins);
 game.removedExpeditionUpgradeRefund={version:1,level,coins,companyItems};
 if(level)addEvent('Entfernter Expeditionsausbau: '+coins+' Imperium-Taler und '+companyItems+' Firmenausbau-Items erstattet.');
}
function endlessCost(region){return ENDLESS_COSTS[region];}
function endlessGearView(region){const chances=expeditionProjectChances(region);return {chance:round2((.5-chances.special-chances.referral)*100),ranges:ENDLESS_GEAR_RANGES[region]};}
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
 return summary;
}
drawExpeditionJob=index=>{
 const region=game.expedition.regions[index];
 if(!region?.endlessUnlocked||!expeditionRegionOpen(index)||!spendExpeditionPoints(endlessCost(index)))return false;
 const draw=Math.random(),pool=regionVehiclePool(index),chances=expeditionProjectChances(index);
 if(draw<.30){const card=vehicleFromPool(index,draw,pool);awardVehicleCard(card);addEvent(EXPEDITION_REGIONS[index]+': '+card.name+' gefunden.');save();render();return 'card:'+card.id;}
 if(draw<.50){
  const customer=customerById(EXPEDITION_CUSTOMER_IDS[index]),order=createOrder(game.nextOrder++,{category:customer.category,customer:customer.id});
  order.kind='normal';order.crafted=true;order.status='queued';game.orders.push(order);addEvent(customer.name+': Kundenauftrag '+order.id+' gefunden.');save();render();return 'customer';
 }
 if(draw>=1-chances.special-chances.referral){const kind=draw<1-chances.referral?'special':'referral',customer=customerById(EXPEDITION_CUSTOMER_IDS[index]);queueCustomerTrip({category:customer.category,customer:customer.id,homeCity:game.startCity,region:index},kind);addEvent(EXPEDITION_REGIONS[index]+': '+expeditionJobLabel(kind)+' gefunden.');save();render();return kind;}
 const summary=awardEndlessGears(index);addEvent(EXPEDITION_REGIONS[index]+': Zahnräder gefunden.');save();render();return summary;
};
