// Regional cards keep all 25 stable ownership IDs.
EXPEDITION_CHARACTERS.splice(0,EXPEDITION_CHARACTERS.length,...transportCards);
const GIFT_OPEN_COINS=10;
// Keep the total expedition card chance at 10%; gifts always award one card.
function regionVehiclePool(region){
 const cards=EXPEDITION_CHARACTERS.filter(card=>card.region===region);
 const weights={common:.6,uncommon:.3,rare:.09,epic:.01};
 return cards.map(card=>({
  ...card,
  chance:weights[card.rarity]/cards.filter(other=>other.rarity===card.rarity).length
 }));
}
function vehicleFromPool(region,roll){
 const pool=regionVehiclePool(region);
 let total=0;
 return pool.find(card=>(total+=card.chance)>roll)||pool.at(-1);
}
function awardVehicleCard(card){
 const duplicate=Boolean(game.expedition.characters[card.id]);
 if(duplicate)game.expedition.shards[card.rarity]=(game.expedition.shards[card.rarity]||0)+1;
 else game.expedition.characters[card.id]={level:1,progress:0};
 return {cardId:card.id,region:card.region,duplicate,shards:duplicate?1:0};
}
function openRegionGift(region){
 if(!Number.isInteger(region)||region<0||region>=EXPEDITION_REGIONS.length||game.coins<GIFT_OPEN_COINS)return false;
 const card=vehicleFromPool(region,Math.random());
 if(!card)return false;
 game.coins=round2(game.coins-GIFT_OPEN_COINS);
 const result=awardVehicleCard(card);
 addEvent(EXPEDITION_REGIONS[region]+': Geschenk geöffnet – '+card.name+'.');
 save();render();
 return result;
}
drawExpeditionJob=index=>{
 const region=game.expedition.regions[index];
 if(!region?.endlessUnlocked||!expeditionRegionOpen(index)||!spendExpeditionPoints(EXPEDITION_COST))return false;
 const draw=Math.random(),cardChance=EXPEDITION_CARD_CHANCES.reduce((sum,item)=>sum+item.chance,0);
 if(draw<cardChance){
  const card=vehicleFromPool(index,draw/cardChance);
  awardVehicleCard(card);
  addEvent(EXPEDITION_REGIONS[index]+': '+card.name+' gefunden.');
  save();render();showToast(card.name+' gefunden.');
  return 'card:'+card.id;
 }
 const roll=(draw-cardChance)/(1-cardChance);
 let cumulative=0;
 const kind=EXPEDITION_JOB_WEIGHTS.find(item=>(cumulative+=item.chance)>roll)?.kind||'material';
 if(kind==='special'||kind==='referral'){
  const customer=customerById(EXPEDITION_CUSTOMER_IDS[index]);
  queueCustomerTrip({category:customer.category,customer:customer.id,homeCity:game.startCity,region:index},kind);
 }else{
  const stageRoll=Math.random();
  let stageTotal=0;
  const tier=EXPEDITION_STAGE_WEIGHTS[index].findIndex(weight=>(stageTotal+=weight)>stageRoll)+1;
  game.expedition.jobs.push({id:game.expedition.nextMission++,region:index,kind,tier:tier||1,createdAt:Date.now()});
 }
 addEvent(EXPEDITION_REGIONS[index]+': '+expeditionJobLabel(kind)+' ausgelost.');
 save();render();showToast(expeditionJobLabel(kind)+' erhalten.');
 return kind;
};
