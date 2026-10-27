'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const itemNames = require('./item-names.json');
const customerIdentities = require('./customer-identities.json');
const normalizeCustomerNames = text => typeof text==='string'?customerIdentities.reduce((value,identity)=>value.split(identity.legacyName).join(identity.customer),text):text;
// Rewrite presentation text only; player-selected names and persistent IDs stay intact.
function normalizeTransportNames(text,profile){
 if(typeof text!=='string')return text;
 const names=[profile?.companyName,profile?.cityName].filter(name=>name&&name.includes('Regionalverkehr'));
 const tokens=[];let result=text;
 for(const name of names){const token='\u0000'+tokens.length+'\u0000';tokens.push([token,name]);result=result.split(name).join(token);}
 result=result.replace(/Regionalverkehr/g,'Nahverkehr').replace(/Regional- und Fernverkehr/g,'Nah- und Fernverkehr');
 for(const [token,name]of tokens)result=result.split(token).join(name);
 return result;
}
const {eventViews, changeEvent, assignEventFleet, EVENT_PROJECT_DISTANCE_KM, touchEvent, recordActivity, claimEvent, spendEventOvertime, joinEvent, syncWorld, prepareEvent} = require('./events.cjs');
const procurementRuntime = fs.readFileSync(path.join(__dirname, 'procurement-runtime.js'), 'utf8');
const transportCards = require('./transport-cards.json');
const companyTransportRuntime = fs.readFileSync(path.join(__dirname, 'company-transport-runtime.js'), 'utf8');
const expeditionCompletionRuntime = fs.readFileSync(path.join(__dirname, 'expedition-completion-runtime.js'), 'utf8');
const transportRuntime = fs.readFileSync(path.join(__dirname, 'transport-runtime.js'), 'utf8');
const giftsRuntime = fs.readFileSync(path.join(__dirname, 'gifts-runtime.js'), 'utf8');
const tourRuntime = fs.readFileSync(path.join(__dirname, 'tour-runtime.js'), 'utf8');
const progressionRuntime = fs.readFileSync(path.join(__dirname, 'progression-runtime.js'), 'utf8');
const hubVehiclesRuntime = fs.readFileSync(path.join(__dirname, 'hub-vehicles-runtime.js'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, '../vendor/web-game.js'), 'utf8');
const boundary = source.indexOf("  document.addEventListener('click'");
if (boundary < 0) throw Error('Web engine boundary missing');
// Temporary test switch. Set to null to restore the original expedition timings.
const EXPEDITION_TEST_DURATION_MS = 15000;
const bridge = `
  const itemNames = ${JSON.stringify(itemNames)};
  const expeditionTestDuration = ${JSON.stringify(EXPEDITION_TEST_DURATION_MS)};
  const transportCards = ${JSON.stringify(transportCards)};
  const customerIdentities = ${JSON.stringify(customerIdentities)};
  CATEGORIES.find(category=>category.id==='national').label='Nahverkehr';
  customerIdentities.forEach((identity,index)=>{
    const customer=CUSTOMERS.find(customer=>customer.id===identity.id);
    Object.assign(customer,{name:identity.customer,initials:identity.initials,industry:identity.industry,region:index,regionName:identity.title,endlessPlace:identity.endlessPlace});
    EXPEDITION_REGIONS[index]=identity.title;
  });
  ${companyTransportRuntime}
  ${giftsRuntime}
  ${progressionRuntime}
  const originalNewGame=newGame;
  newGame=(...args)=>{const state=originalNewGame(...args);state.inventory.expeditionRefills=0;state.companyTransportVersion=1;state.linearProgressionVersion=1;state.hubSystemVersion=1;state.inventory.hubVehicleParts=0;state.hubCrates={day:Math.floor(Date.now()/86400000),opened:0,lastOpenedAt:null};return state;};
  awardTransportXp=xp=>{
    const before=levelForXp(game.xp,game).level;
    game.xp=round2(game.xp+xp);
    const after=levelForXp(game.xp,game).level,levels=after-before;
    if(levels<=0)return;
    game.inventory.expeditionRefills=(game.inventory.expeditionRefills||0)+levels;
    game.inventory.overtimeRefills=(game.inventory.overtimeRefills||0)+levels;
    game.pendingLevelUps ||= [];
    for(let level=before+1;level<=after;level++)game.pendingLevelUps.push(level);
    addEvent('Level '+after+' erreicht! '+levels+' Expeditionsauffüller, '+levels+' Überstundenauffüller und '+(3*levels)+' Punkte zum Verteilen.');
  };
  const originalExpeditionDuration = expeditionDuration;
  expeditionDuration = (...args) => expeditionTestDuration ?? originalExpeditionDuration(...args);
  function shortenTestMissions() {
    if (!expeditionTestDuration) return;
    const now = Date.now();
    for (const mission of game.expedition.missions) {
      if (mission.status !== 'active' || mission.testDurationMs === expeditionTestDuration || mission.endsAt <= now) continue;
      mission.testDurationMs = expeditionTestDuration;
      const start = Math.max(mission.startedAt, now);
      const duration = Math.min(expeditionTestDuration, mission.endsAt - start);
      if (mission.transport) {
        const tours = mission.transport.tours.slice(mission.transport.completedTours);
        const oldStart = tours[0].startsAt, span = tours.at(-1).endsAt - oldStart;
        tours.forEach(t => { t.startsAt = start + (t.startsAt - oldStart) / span * duration; t.endsAt = start + (t.endsAt - oldStart) / span * duration; });
      }
      mission.startedAt = start; mission.endsAt = start + duration;
    }
  }
  render = () => {};
  renderLevelUpDialog = () => {};
  maybeShowLevelUpDialog = () => {};
  setView = () => {};
  let mobileToast = '';
  // The home name is cosmetic; every mobile company uses the same route profile.
  const legacyStartCityById = startCityById;
  let foundingProfile = null;
  startCityById = id => id === 'headquarters'
    ? { ...legacyStartCityById('hamburg'), id, city:(foundingProfile || game?.profile)?.cityName || 'Hauptsitz' }
    : legacyStartCityById(id);
  showToast = text => { mobileToast = text; };
  const originalCanTruckTakeOrder=canTruckTakeOrder;
  canTruckTakeOrder=(truck,order)=>truck.cardId&&vehicleCardById(truck.cardId)&&['national','international'].includes(order.category)
    ? !truck.hubAssigned : originalCanTruckTakeOrder(truck,order);
  // Spending below the cap must retain the current regeneration interval.
  // regenerateExpedition already starts a fresh interval when leaving a full stock.
  spendExpeditionPoints = amount => {
    regenerateExpedition();
    if(game.expedition.points<amount)return false;
    game.expedition.points-=amount;
    return true;
  };
  const mobileProjectNames = {
    special:['Großauftrag Stadtversorgung','Großauftrag Baustellenlogistik','Großauftrag Materialbergung','Großauftrag Ferntransport','Großauftrag Handelsroute'],
    referral:['Großprojekt Hafenverbund','Großprojekt Versorgungskette','Großprojekt Industrieanlage','Großprojekt Fernkorridor','Großprojekt Kontinentalnetz']
  };
  function normalizeReferral(order){
    if(order.kind!=='referral'||order.status!=='queued')return;
    order.projectName=mobileProjectNames.referral[0];
    order.volume=order.baseVolume=PROJECT_BALANCE.referral.volume;
    order.distance=PROJECT_BALANCE.referral.distance;
    order.category='national';order.routeType='single';order.deadlineMs=PROJECT_DEADLINES.referral;
  }
  const originalQueueCustomerTrip=queueCustomerTrip;
  queueCustomerTrip=(source,kind)=>{const order=originalQueueCustomerTrip(source,kind);normalizeReferral(order);return order;};
  function normalizeQueuedReferrals(){game.orders.forEach(normalizeReferral);}
  function mobileProjectInfo(kind,region,existing=null){
    const customer=customerById(EXPEDITION_CUSTOMER_IDS[region]),balance=PROJECT_BALANCE[kind];
    const volume=existing?.volume ?? balance.volume+region*balance.volumePerRegion;
    const distance=existing?.distance ?? balance.distance+region*balance.distancePerRegion;
    const order={kind,category:customer.category,customer:customer.id,volume,distance,routeType:'single',...existing};
    const loot=GEAR_LOOT[kind],rules=SPECIAL_CHANCES[order.category];
    return {key:kind==='referral'?'referral':kind+':'+region,rarity:kind==='referral'?'epic':'rare',kind,region,regionName:EXPEDITION_REGIONS[region],name:existing?.projectName||mobileProjectNames[kind][region],customer,
      volume,distance,deadlineMs:existing?.deadlineMs||PROJECT_DEADLINES[kind],
      premium:completionPremium(order),freight:freightRevenue(order),baseXp:volume,relationship:TRUST_REWARDS[kind],
      expeditionChance:round2((1-EXPEDITION_CARD_CHANCES.reduce((sum,c)=>sum+c.chance,0))*EXPEDITION_JOB_WEIGHTS.find(w=>w.kind===kind).chance*100),
      customerChance:round2(customerTripChance(order,kind==='special'?'award':'referral')*100),
      customerSource:kind==='special'?'Kundenauftrag':'Sonderauftrag',customerOpen:customerUnlocked(customer.id),
      expeditionOpen:expeditionRegionOpen(region)&&game.expedition.regions[region].endlessUnlocked,
      moduleChance:round2((kind==='special'?(rules?.module||0):(rules?.referralModule||0))*100),
      epicChance:round2(loot.epic[0]*100),epicMin:loot.epic[1],epicMax:loot.epic[2],
      legendary:kind==='referral'?{min:loot.legendary[0],extraChance:round2(loot.legendary[2]*100)}:null};
  }
  // Discovery consumes one point per command; deliveries remain optional bonuses.
  discoverExpeditionPlace = index => {
    const region=game.expedition.regions[index];
    if(!region||!expeditionRegionOpen(index)||region.discovered>=7||!spendExpeditionPoints(1))return false;
    const place=region.discovered,cost=expeditionDiscoveryCost(index,place);
    region.discoveryPoints ||= Array(7).fill(0);
    region.discoveryPoints[place]=(region.discoveryPoints[place]||0)+1;
    if(region.discoveryPoints[place]>=cost){
      region.discoveryPoints[place]=cost;region.discovered++;
      if(region.discovered===7){
        region.endlessUnlocked=true;
        addEvent(EXPEDITION_REGIONS[index]+': Endlosort freigelegt.');
      }
      addEvent(EXPEDITION_REGIONS[index]+': Ort '+region.discovered+' entdeckt.');
    }
    return true;
  };
  function overtimeToDeadline(order,now=Date.now()){
    if(!order?.project||order.status!=='active'||now>=order.project.deadlineAt)return 0;
    if(projectEstimatedEnd(order,now)<=order.project.deadlineAt)return 0;
    const finish=Math.ceil((order.volume-order.delivered)*order.distance/OVERTIME_TKM_PER_POINT);
    const eta=points=>{
      const copy={...order,project:{...order.project,vehicles:order.project.vehicles.map(v=>({...v,bonusStats:{...v.bonusStats}}))}};
      let remaining=Math.min(copy.volume-copy.delivered,points*OVERTIME_TKM_PER_POINT/copy.distance);
      while(remaining>1e-9&&copy.delivered<copy.volume){
        const vehicle=copy.project.vehicles.filter(v=>v.cargo).sort((a,b)=>a.nextAt-b.nextAt)[0];
        if(!vehicle)break;
        const cargo=Math.min(remaining,vehicle.cargo,copy.volume-copy.delivered);
        copy.delivered=Math.min(copy.volume,copy.delivered+cargo);vehicle.cargo-=cargo;remaining-=cargo;
        if(vehicle.cargo<1e-9){vehicle.cargo=0;vehicle.nextAt=null;}
        if(copy.delivered<copy.volume)fillProjectTrips(copy,now);
      }
      return copy.delivered>=copy.volume-1e-9?now:projectEstimatedEnd(copy,now);
    };
    let low=1,high=finish;
    while(low<high){const mid=Math.floor((low+high)/2);if(eta(mid)<=order.project.deadlineAt)high=mid;else low=mid+1;}
    return low;
  }
  const beforeProcurementClaimMission=claimExpeditionMission;
  claimExpeditionMission=missionId=>{
    const mission=game.expedition.missions.find(m=>m.id===missionId);
    const ok=beforeProcurementClaimMission(missionId);
    if(ok&&mission?.kind==='final'){
      const region=game.expedition.regions[mission.region];
      if(!region.moduleAwarded){region.moduleAwarded=true;game.inventory.capacityModules++;mission.reward+=' · 1 Kapazitätsmodul';}
    }
    return ok;
  };
  ${tourRuntime}
  ${procurementRuntime}
  ${hubVehiclesRuntime}
  ${transportRuntime}
  ${expeditionCompletionRuntime}
  globalThis.mobile = {
    settleEventTours, refreshTourStarts, queueSingleVehicle, settleProcurementTimeline, startProcurement, startProcurementGroup, stopProcurement, stopProcurementGroup, claimProcurement,
    eventFleetOptions(distance = 240) {
      const order={distance,routeType:'single'};
      return [0,1,2].map(index=>({index,vehicles:projectFleetVehicles(index)?.map(vehicle=>({
        ...vehicle,bonusStats:{...vehicle.bonusStats},
        cycleMs:Math.max(1,Math.ceil(tourSeconds(order,vehicle,vehicle.capacity)*1000))
      }))||null}));
    },
    get state() { return game; }, set state(value) { game = value; },
    expansionState, acknowledgeExpeditionCompletions, allocateExpansionPoints, migrateCompanyTransport, migrateTransportCards, capturePointClocks, reconcilePointClocks,
    migrateHubVehicles, buyHubVehicle, upgradeHubVehicle, openHubCrate,
    migrateLinearProgression, newGame, save, loadGame, shortenTestMissions, normalizeQueuedReferrals, settleTrips, settleFleetProjects, settleExpeditions, settleHub,
    autoRefreshOrders, regenerateExpedition, regenerateOvertime,
    chooseStartCity, addCardToGarage, removeCardFromGarage, assignCharacterSeat,
    giveCharacterShard, combineExpeditionShards, buyTruck, upgradeTruckRarity,
    replaceGarageCard(cardId,replacementId) {
      const index=game.trucks.findIndex(truck=>truck.cardId===cardId),replacement=vehicleCardById(replacementId);
      if(index<0||cardId===replacementId||!replacement||!game.expedition.characters[replacementId]||game.trucks.some(truck=>truck.cardId===replacementId)||regularTruckCount()>10)return false;
      // All validation precedes removal. Reuse busy/reservation checks and keep
      // both changes in the same server transaction, including a full garage.
      if(!removeCardFromGarage(cardId))return false;
      if(!addCardToGarage(replacementId))throw Error('Fahrzeugwechsel konnte nicht gespeichert werden.');
      const truck=game.trucks.pop();game.trucks.splice(index,0,truck);
      return true;
    },
    upgradeCardVehicle(cardId,kind) {
      const card=vehicleCardById(cardId),owned=game.expedition.characters[cardId];
      if(!card||!owned)return false;
      const active=game.trucks.find(t=>t.cardId===cardId);
      if(active)return kind==='capacity'?upgradeTruckCapacity(active.id):upgradeTruckRarity(active.id);
      const truck=owned.parkedTruck||createCardTruck(card);
      // Reuse the original resource/cap checks without occupying a real garage slot.
      game.trucks.push(truck);
      try {return kind==='capacity'?upgradeTruckCapacity(truck.id):upgradeTruckRarity(truck.id);}
      finally {game.trucks.splice(game.trucks.indexOf(truck),1);owned.parkedTruck=truck;}
    },
    upgradeTruckCapacity, assignOrder, assignCraftedOrder, assignPrivatePickup,
    startFleetProject, spendOvertime, useOvertimeRefill, claimOrderReward,
    useExpeditionRefill(now=Date.now()) {
      if(!(game.inventory.expeditionRefills>0))return false;
      regenerateExpedition(now);
      game.inventory.expeditionRefills--;
      game.expedition.points+=50;
      if(game.expedition.points>=expeditionCapacity())game.expedition.lastRegenAt=now;
      mobileToast='Expeditionsauffüller: +50 Expeditionspunkte.';
      return true;
    },
    spendMaxOvertime(orderId){const amount=overtimeToDeadline(game.orders.find(o=>o.id===orderId));return amount>0?spendOvertime(orderId,amount):false;},
    discoverExpeditionPlace, drawExpeditionJob, openRegionGift, startExpeditionMission, claimExpeditionMission,
    buyHub, toggleHubTruck, collectHub, startHubUpgrade, combinePickupHints, craftCustomerOrder,
    unlockDepartment, upgradeWorkshop, upgradeSales, upgradeOfferLimit, upgradeTransport,
    allocateCustomerBatch(customerId,points,base) {
      if(!customerById(customerId)||!customerUnlocked(customerId))throw Error('Stammkunde nicht verfügbar.');
      const current=customerSkillLevels(customerId),keys=Object.keys(CUSTOMER_SKILL_LIMITS);
      for(const key of keys){
        if(current[key]!==base[key])throw Error('Kundenwerte wurden geändert. Bitte erneut verteilen.');
        if(current[key]+points[key]>CUSTOMER_SKILL_LIMITS[key])throw Error('Maximale Kundenstufe überschritten.');
      }
      const total=keys.reduce((sum,key)=>sum+points[key],0);
      if(!total||total>availableCustomerSkillPoints(customerId))throw Error('Nicht genügend Kundenpunkte.');
      for(const key of keys)for(let i=0;i<points[key];i++)allocateCustomerSkill(customerId,key);
      mobileToast='Kundenpunkte gespeichert.';
      return true;
    },
    allocateCustomerSkill, toggleOrderPin, manualRefreshOrders, applyOrderReward,
    upgradeTransportBatch(upgrades) {
      let coins=0,items=0;
      for(const upgrade of upgrades){
        const {category,kind,count,level}=upgrade;
        const current=companyFor().transportUpgrades[category][kind+'Level'];
        if(current!==level)throw Error('Ausbau wurde geändert. Bitte Auswahl prüfen.');
        if(current+count>TRANSPORT_UPGRADE_LIMITS[category][kind])throw Error('Maximale Stufe erreicht.');
        for(let next=current+1;next<=current+count;next++){
          const price=mobileTransportPrice(category,kind,next);
          coins+=price.coins;items+=price.items;
        }
      }
      if(game.coins<coins||game.inventory.companyItems<items)throw Error('Münzen oder Firmenausbau-Items fehlen.');
      game.coins=round2(game.coins-coins);game.inventory.companyItems-=items;
      game.stats.transportUpgradeSpent=(game.stats.transportUpgradeSpent||0)+coins;
      for(const {category,kind,count} of upgrades)companyFor().transportUpgrades[category][kind+'Level']+=count;
      addEvent('Transport verbessert: '+upgrades.reduce((sum,u)=>sum+u.count,0)+' Stufen.');
      return true;
    },
    removeSeat(template, seat) { const slots = fleetTemplate(template); if (slots) slots[seat] = null; },
    allocateLevel(expedition, overtime) {
      if (!game.pendingLevelUps?.length || expedition + overtime !== 3) return false;
      game.expedition.levelCapacityBonus = (game.expedition.levelCapacityBonus || 0) + expedition;
      game.expedition.points += expedition;
      game.overtimeCapacity = (game.overtimeCapacity ?? 100) + overtime;
      game.overtimePoints = (game.overtimePoints ?? 100) + overtime;
      const level = game.pendingLevelUps.shift();
      addEvent('Level ' + level + ': ' + expedition + ' Expeditionspunkte und ' + overtime + ' Überstundenpunkte dauerhaft zugewiesen.');
      return true;
    },
    allocateLevelBatch(expedition, overtime, points) {
      const available=(game.pendingLevelUps?.length||0)*3;
      if(!available||points!==available||expedition+overtime!==available)throw Error('Verfügbare Punkte haben sich geändert. Bitte Verteilung prüfen.');
      game.expedition.levelCapacityBonus=(game.expedition.levelCapacityBonus||0)+expedition;
      game.expedition.points+=expedition;
      game.overtimeCapacity=(game.overtimeCapacity??100)+overtime;
      game.overtimePoints=(game.overtimePoints??100)+overtime;
      game.pendingLevelUps=[];
      addEvent(available+' Entwicklungspunkte verteilt: '+expedition+' Expedition, '+overtime+' Überstunden.');
      return true;
    },
    sell(id) { if (!openSaleDialog(id)) return false; return confirmSale(); },
    claimSingleRewards() {
      const orders=game.orders.filter(o=>!PROJECT_DEADLINES[o.kind]&&o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
      if(!orders.length&&!game.expedition.missions.some(pendingExpeditionOrder))return false;
      const summary={count:orders.length,coins:0,gears:{},capacityModules:0,companyItems:0,supplierContacts:0};
      for(const order of orders){
        const reward=order.completionReward;
        summary.coins=round2(summary.coins+reward.coins);
        for(const [rarity,amount] of Object.entries(reward.gears||{}))summary.gears[rarity]=(summary.gears[rarity]||0)+amount;
        summary.capacityModules+=Number(Boolean(reward.capacityModule));summary.companyItems+=reward.companyItems||0;summary.supplierContacts+=reward.supplierContacts||0;
        applyOrderReward(order);
      }
      collectExpeditionOrderRewards(summary);
      mobileToast=summary.count+' Prämien abgeholt.';
      return summary;
    },
    grantTestCoins() { game.coins += TEST_COINS_GRANT; game.stats.testCoinsGranted += TEST_COINS_GRANT; addEvent('Testmünzen: +50.000 M'); },
    grantTestResource(kind, amount) {
      if (kind === 'xp') awardTransportXp(amount);
      else if (kind === 'expedition') { game.expedition.points += amount; if(game.expedition.points>=expeditionCapacity())game.expedition.lastRegenAt = Date.now(); }
      else { game.overtimePoints += amount; if(game.overtimePoints>=overtimeCapacity())game.overtimeLastRegenAt = Date.now(); }
      const label = kind === 'xp' ? 'XP' : kind === 'expedition' ? 'Expeditionspunkte' : 'Überstundenpunkte';
      addEvent('Test: +' + amount + ' ' + label + '.');
      mobileToast = '+' + amount + ' ' + label;
      return true;
    },
    reset() { game = newGame(); },
    foundCompany(profile) {
      if (game.profile) return false;
      if (!game.startCity) {
        foundingProfile = profile;
        try { game = newGame('headquarters'); } finally { foundingProfile = null; }
      } else {
        const previousHome = legacyStartCityById(game.startCity)?.city;
        game.startCity = 'headquarters';
        for (const order of game.orders) {
          if (previousHome && (order.from === previousHome || order.from?.startsWith(previousHome + ' ')))
            order.from = profile.cityName + order.from.slice(previousHome.length);
          order.homeCity = 'headquarters';
        }
      }
      game.profile = profile;
      addEvent(profile.companyName + ' in ' + profile.cityName + ' gegründet.');
      mobileToast = 'Firma gegründet.';
      return true;
    },
    view() {
      const now = Date.now();
      const free = new Set(freeTrucks().map(t => t.id));
      const catalog = {
        cities: START_CITIES.map(({id, city, country, continent}) => ({id, city, country, continent})),
        gifts:EXPEDITION_REGIONS.map((name,region)=>({region,name,cost:GIFT_OPEN_COINS,cards:regionVehiclePool(region).map(card=>({...card,chance:round2(card.chance*100)}))})),
        cards: EXPEDITION_CHARACTERS, rarities: RARITIES, models: TRUCKS,
        customers: CUSTOMERS, categories: CATEGORIES, departments: DEPARTMENTS,
        refillPoints:{expedition:50,overtime:OVERTIME_REFILL_POINTS},
        recipes:[
          {id:'pickup',inputId:'pickupHints',outputId:'private',input:itemNames.pickupHints[1],output:itemNames.private[0],needed:PRIVATE_PICKUP_HINT_COST,action:'pickupCraft'},
          {id:'uncommon',inputId:'shard:common',outputId:'shard:uncommon',input:'Common-Shards',output:'Uncommon-Shard',needed:SHARD_COMBINE_RATIO,action:'shardCombine',payload:{rarity:'common'},color:'#5BAA78'},
          {id:'rare',inputId:'shard:uncommon',outputId:'shard:rare',input:'Uncommon-Shards',output:'Rare-Shard',needed:SHARD_COMBINE_RATIO,action:'shardCombine',payload:{rarity:'uncommon'},color:'#619CE8'}
        ],
        cardLevelCosts: CHARACTER_LEVEL_COSTS, regionNames: EXPEDITION_REGIONS
      };
      const trucks = game.trucks.map(t => ({ ...t, free: free.has(t.id),
        progress: (()=>{const procurement=procurementActive(t.id);if(procurement)return Math.min(100,(now-procurement.startedAt)/procurement.durationMs*100);const order=game.orders.find(o=>o.status==='active' && o.truckId===t.id); if(order)return order.delivered/order.volume*100; const m=game.expedition.missions.find(m=>m.status==='active' && m.truckId===t.id); return m ? (m.transport ? m.transport.delivered/m.transport.volume*100 : Math.min(100,(now-m.startedAt)/(m.endsAt-m.startedAt)*100)) : 0;})(),
        hubUpgrades:isCityVehicle(t)?{capacity:hubVehicleQuote(t,'capacity'),speed:hubVehicleQuote(t,'speed')}:null,
        rarity: truckRarity(t), rankCost: rankGearCost(t), speed: truckSpeed(t),
        bonus: cardBonusStats(t), costPerKm: operatingCostPerKm(t),
        sale: saleBlockReason(t) ? null : saleQuote(t),
        procurementId:procurementActive(t.id)?.id||null,
        busyUntil: (() => { const procurement=procurementActive(t.id);if(procurement)return procurement.nextAt;const o = game.orders.find(o => o.status === 'active' && o.truckId === t.id); if(o) return now + remainingOrderSeconds(o,t,now)*1000; return game.expedition.missions.find(m=>m.status==='active' && m.truckId===t.id)?.endsAt || null; })()
      }));
      // Availability is shared by regular orders and stored expedition jobs.
      // A reserve/group procurement has no definite end: never label its next tour as free.
      const availability = t => {
        const truck=trucks.find(item=>item.id===t.id),procurement=procurementActive(t.id);
        let availableAt=truck.busyUntil;
        const current=game.orders.find(o=>o.status==='active'&&o.truckId===t.id),reserved=game.orders.find(o=>o.status==='active'&&o.pendingTruckId===t.id);
        if(current?.pendingTruckId&&current.pendingTruckId!==t.id)availableAt=current.tripSnapshot?.endsAt||availableAt;
        if(reserved)availableAt=now+remainingOrderSeconds(reserved,truckById(reserved.truckId),now)*1000;
        if(procurement)availableAt=procurement.stopAfter?procurement.nextAt:procurement.mode==='count'&&!procurement.groupId?procurement.nextAt+Math.max(0,procurement.requested-procurement.started)*procurement.durationMs:null;
        return {cardId:t.cardId,free:free.has(t.id),availableAt,unavailableReason:procurement?'In Beschaffung':game.orders.some(o=>o.status==='active'&&o.pendingTruckId===t.id)?'Reserviert':'Im Einsatz'};
      };
      const jobChoices=Object.fromEntries(game.expedition.jobs.map(job=>[job.id,game.trucks.filter(t=>!t.hubAssigned&&t.tier>=2).map(t=>{
        const plan=expeditionTransportPlan(job,t,now),seconds=(plan.tours.at(-1).endsAt-now)/1000;
        return {id:t.id,model:t.model,capacity:t.capacity,...availability(t),trips:plan.tours.length,seconds:expeditionTestDuration?Math.min(seconds,expeditionTestDuration/1000):seconds,totalProfit:(job.kind==='character'?5:15)*(job.region+1)};
      })]));
      const orders = game.orders.map(o => {
        const project = Boolean(PROJECT_DEADLINES[o.kind]);
        const suitable = !project ? game.trucks.filter(t=>canTruckTakeOrder(t,o)) : [];
        const estimate = t => ({id:t.id,model:t.model,capacity:t.capacity,seconds:orderDuration({...o,delivered:0},t),xp:round2(o.volume*paidLegs(o)*(1+activeCardBonus(t,'xp','single')/100)),...orderEconomics(o,t)});
        const choices = !project && ['available','queued'].includes(o.status) ? eligibleFreeTrucks(o).map(estimate) : [];
        const assigned = !project && o.status==='active' ? truckById(o.truckId) : null;
        const projection=project&&o.status==='active'?projectProjection(o,now):null;
        const forecastTruck = assigned || suitable[0];
        const referenceTier=(CATEGORIES.find(c=>c.id===o.category)?.tiers||[2])[0];
        const durationTruck=forecastTruck||{...TRUCKS[referenceTier],tier:referenceTier,rarityLevel:0};
        const durationSeconds=project?null:orderDuration({...o,delivered:0},durationTruck);
        const possibleRewards = project ? [] : o.kind==='private' ? ['1–2 Lieferantenkontakte'] : ['Common-Zahnräder','Uncommon-Zahnräder',...(o.customer?['Rare-Zahnräder']:[]),...(o.kind==='normal'&&TRANSPORT_BASE[o.category]?['Fortschritt für Firmenausbau-Items']:[]),...(o.customer&&o.kind==='normal'?[round2(customerTripChance(o,'award')*100)+' % Chance auf Sonderauftrag']:[])];
        return { ...o, isProject: project,
          project:o.project?{...o.project,vehicles:o.project.vehicles.filter(v=>v.cardId).map(v=>({...v,
            pendingCardId:(fleetTemplate(o.project.template)||[])[v.slot]||null,
            pendingModel:vehicleCardById((fleetTemplate(o.project.template)||[])[v.slot])?.name||null}))}:undefined,
          transportLabel:CATEGORIES.find(c=>c.id===o.category)?.label||'Nahverkehr',
          durationSeconds, durationBand:durationSeconds==null?null:durationSeconds<=300?'Kurz':durationSeconds<=900?'Mittel':'Lang',
          customerName: o.customer ? customerById(o.customer)?.name : 'Freie Frachtbörse',
          vehicleChoices:!project&&['available','queued'].includes(o.status)?suitable.map(t=>({...estimate(t),...availability(t)})):[],
          choices, vehicleStatus: choices.length?'ready':suitable.length?'busy':'missing',
          forecast: assigned ? singleForecast(o) : forecastTruck && o.status!=='completed' ? estimate(forecastTruck) : null,
          replacementChoices:assigned?game.trucks.filter(t=>canTruckTakeOrder(t,o)&&(free.has(t.id)||o.pendingTruckId===t.id)).map(t=>({id:t.id,model:t.model,capacity:t.capacity})):[],
          pendingTruckName:o.pendingTruckId?truckById(o.pendingTruckId)?.model:null,
          projection,
          projectInfo:project?mobileProjectInfo(o.kind,o.projectRegion??Math.max(0,EXPEDITION_CUSTOMER_IDS.indexOf(o.customer)),o):null,
          baseXp:round2(o.volume*paidLegs(o)), premium:completionPremium(o),
          possibleRewards, relationshipReward:o.customer?(TRUST_REWARDS[o.kind]||0):0,
          tripEndsAt:assigned?o.tripSnapshot?.endsAt:null,
          runningEndsAt:assigned?now+remainingOrderSeconds(o,assigned,now)*1000:null,
          overtimeForDeadline:project&&o.status==='active'?overtimeToDeadline(o,now):null,
          eta: projection?.eta ?? null,
          templates: project && o.status==='queued' ? [0,1,2].map(index=>{
            const vehicles=projectFleetVehicles(index);
            return {index, vehicles, eta:vehicles ? projectEstimatedEnd({...o,delivered:0,project:{vehicles:vehicles.map(v=>({...v,cargo:0,nextAt:null}))}},now) : null};
          }) : []
        };
      });
      const procurementHelp=['Materialbeschaffung',[['Freischaltung','Alle sieben Orte erkunden und beliefern; den einmaligen Endlosort-Transport abschließen und abholen. Dann ist die Region zu 100 % fertig.'],['Fahrten und Kosten','Eine Tour dauert bei 1 km/s zehn Minuten inklusive Rückweg. Preis je Tour: Region 1 8.000 M, danach je Region +4.000 M. Kapazität, Kosten- und Vergütungsboni wirken nicht.'],['Tourenzahl oder Reserve','Feste Touren werden vorausbezahlt. Bis Reserve bezahlt jede Tour einzeln und endet bei unzureichendem Guthaben dauerhaft. Kein automatischer Neustart.'],['Beenden','Nach laufender Tour beenden erhält die aktuelle Belohnung. Sofort abbrechen verliert den aktuellen Einsatz und Loot. Ungestartete vorausbezahlte Touren werden erstattet.'],['Belohnungen','Je Tour: 5 Common-Zahnräder garantiert, 20 % auf 1 Uncommon, 0,3 % auf 1 Rare, 0,1 % auf 1 Firmenausbau-Item. Unabhängige Chancen, in allen Regionen gleich. Keine XP, Beziehungen oder tkm-Belohnungen.']]];
      const cardVehicles = Object.fromEntries(EXPEDITION_CHARACTERS.map(card => {
        const owned = game.expedition.characters[card.id];
        const truck = game.trucks.find(t => t.cardId === card.id) || owned?.parkedTruck || createCardTruck(card);
        // Collection data intentionally excludes assignment, hub and trip state.
        const capacityLevel=truck.moduleCapacityLevel||0,maxCapacityLevel=Math.max(card.maxCapacityLevel,capacityLevel);
        const nextRank=truckRarity(truck).total<50?{...truck,rarityLevel:truckRarity(truck).total+1}:null;
        const upgradePreview={capacity:capacityLevel<maxCapacityLevel?cardCapacity(card,capacityLevel+1):null,
          rank:nextRank?{rank:truckRarity(nextRank),speed:truckSpeed(nextRank),loadedSpeed:truckSpeed(nextRank,nextRank.capacity)}:null};
        return [card.id, {capacity:truck.capacity, rank:truckRarity(truck), speed:truckSpeed(truck),
          loadedSpeed:truckSpeed(truck,truck.capacity), costPerKm:operatingCostPerKm(truck),
          upgradePreview, rankCost:rankGearCost(truck), capacityLevel:truck.moduleCapacityLevel || 0, maxCapacityLevel:Math.max(card.maxCapacityLevel,truck.moduleCapacityLevel||0), capacityStep:round2(card.baseCapacity*card.capacityStepPercent/100)}];
      }));
      return {state: {...game,trucks,orders,overtimeCapacity:overtimeCapacity()}, serverTime:now, catalog, cardVehicles, jobChoices, procurement:procurementView(now),
        level:levelForXp(game.xp,game), expeditionCapacity:expeditionCapacity(),
        expansion:{...expansionState(),expeditionMaximum:expeditionCapacity(),overtimeMaximum:overtimeCapacity()},
        development:{points:(game.pendingLevelUps?.length||0)*3,
          expedition:{base:50+(game.expedition.levelCapacityBonus||0),bonus:expeditionCapacity()-50-(game.expedition.levelCapacityBonus||0)},
          overtime:{base:game.overtimeCapacity??100,bonus:overtimeCapacity()-(game.overtimeCapacity??100)}},
        regeneration:{expeditionNextAt:game.expedition.points<expeditionCapacity()?game.expedition.lastRegenAt+expeditionInterval():null,expeditionIntervalMs:expeditionInterval(),overtimeNextAt:game.overtimePoints<overtimeCapacity()?game.overtimeLastRegenAt+OVERTIME_REGEN_MS:null},
        templates:[0,1,2].map(i=>fleetTemplate(i)),
        fleetPreviews:[0,1,2].map(index=>(projectFleetVehicles(index)||[]).map(vehicle=>({
          cardId:vehicle.cardId,model:vehicle.model,capacity:vehicle.capacity,
          emptySpeed:truckSpeed(vehicle),loadedSpeed:truckSpeed(vehicle,vehicle.capacity),
          costPerKm:operatingCostPerKm(vehicle),loadCostPerTonKm:LOAD_COST_PER_TON_KM,
          freightPayPerTonKm:FREIGHT_PAY_PER_TON_KM,bonuses:{...vehicle.bonusStats}
        }))),
        cardBonuses:Object.fromEntries(EXPEDITION_CHARACTERS.map(c=>[c.id,cardBonusValue(c)])),
        openRegions:EXPEDITION_REGIONS.map((_,i)=>expeditionRegionOpen(i)),
        expeditionMap:game.expedition.regions.map((region,index)=>({
          index, name:EXPEDITION_REGIONS[index], customer:customerById(EXPEDITION_CUSTOMER_IDS[index]),
          open:expeditionRegionOpen(index), discovered:region.discovered,
          deliveries:region.deliveries.filter(Boolean).length, finalClaimed:region.finalClaimed,
          progress:Array.from({length:7},(_,place)=>place<region.discovered?expeditionDiscoveryCost(index,place):(region.discoveryPoints?.[place]||0)).reduce((sum,v)=>sum+v,0)/Array.from({length:7},(_,place)=>expeditionDiscoveryCost(index,place)).reduce((sum,v)=>sum+v,0)*100,
          places:Array.from({length:7},(_,place)=>({index:place,discoveryCost:expeditionDiscoveryCost(index,place),invested:place<region.discovered?expeditionDiscoveryCost(index,place):(region.discoveryPoints?.[place]||0),durationMs:expeditionDuration(index,'delivery',place)})),
          finds:{cost:EXPEDITION_COST,
            cards:regionVehiclePool(index).map(card=>({id:card.id,name:card.name,rarity:card.rarity,chance:round2(card.chance*EXPEDITION_CARD_CHANCES.reduce((sum,item)=>sum+item.chance,0)*100)})),
            orders:EXPEDITION_JOB_WEIGHTS.map(weight=>({kind:weight.kind,name:weight.kind==='character'?itemNames.character[0]:weight.kind==='material'?itemNames.material[0]:weight.kind==='special'?'Sonderauftrag '+mobileProjectNames.special[index].slice('Großauftrag '.length):'Empfehlungsauftrag '+mobileProjectNames.referral[0].slice('Großprojekt '.length),chance:round2((1-EXPEDITION_CARD_CHANCES.reduce((sum,c)=>sum+c.chance,0))*weight.chance*100),...(weight.kind==='character'||weight.kind==='material'?{ranks:EXPEDITION_STAGE_WEIGHTS[index].flatMap((chance,i)=>chance>0?[{rank:i+1,chance:round2(chance*100)}]:[])}:{rarity:weight.kind==='special'?'rare':'epic'})}))
          },
          finalDurationMs:expeditionDuration(index,'final')
        })),
        projectCatalog:[...EXPEDITION_REGIONS.map((_,region)=>mobileProjectInfo('special',region)),{...mobileProjectInfo('referral',0),sources:EXPEDITION_REGIONS.map((_,region)=>mobileProjectInfo('referral',region))}],
        transportUpgradeOptions:['national','international'].flatMap(category=>['premium','volume','range'].map(kind=>{
          const level=companyFor().transportUpgrades[category][kind+'Level'],limit=TRANSPORT_UPGRADE_LIMITS[category][kind];
          return {category,kind,level,limit,step:kind==='premium'?1:LEGACY_TRANSPORT_LIMITS[category][kind]/100,base:TRANSPORT_BASE[category],costs:Array.from({length:limit-level},(_,i)=>mobileTransportPrice(category,kind,level+i+1))};
        })),
        discoveryCosts:game.expedition.regions.map((r,i)=>expeditionDiscoveryCost(i,r.discovered)),
        customers:CUSTOMERS.filter(c=>customerUnlocked(c.id)).map(c=>({...c,level:customerLevel(game.customerTrust[c.id]||0),next:customerNext(game.customerTrust[c.id]||0),points:availableCustomerSkillPoints(c.id),skills:customerSkillLevels(c.id)})),
        refreshCost:manualRefreshCost(), offers:offerLimit(), pinLimit:pinLimit(), hubLimit:hubCapacity(),
        hubInfo:{cycle:hubCycleView(),vehiclePrice:HUB_VEHICLE_PRICE,vehicleMax:HUB_VEHICLE_MAX,crates:hubCrateView(now),unlocked:hubUnlocked(),nextVehicleLevel:nextHubVehicleLevel(),hourlyCapacity:hubHourlyCapacity(), upgradeContacts:hubUpgradeContactCost((hub()?.salesLevel||0)+1),upgradeItems:COMPANY_BALANCE.upgradeItems((hub()?.salesLevel||0)+1),upgradeCoins:0},
        companyCosts:{offers:{coins:offerUpgradeCost(),items:COMPANY_BALANCE.upgradeItems((game.company.offerLevel||0)+1)},workshop:{coins:workshopUpgradeCost(),items:COMPANY_BALANCE.upgradeItems((game.company.workshopLevel||0)+1)},sales:{coins:salesUpgradeCost(),items:COMPANY_BALANCE.upgradeItems((game.company.salesLevel||0)+1)},transport:Object.fromEntries(['national','international'].map(c=>[c,Object.fromEntries(['premium','volume','range'].map(k=>[k,transportUpgradeCost(c,k)]))]))},
        help:{procurement:procurementHelp,...Object.fromEntries(['dashboard','orders','special','fleet','dealer','hub','inventory','development','company','personnel','expeditions','statistics','customers'].map(k=>{const help=pageHelp(k);return [k,[help[0],help[1].filter(([heading])=>heading!=='Werte im Code ändern')]];}))},
        message:mobileToast
      };
    }
  };
})();`;
// Mobile selects an arbitrary positive amount; keep the original delivery/accounting body.
const overtimeGuard = "  function spendOvertime(orderId, amount, now = Date.now()) {\n    if (![1, 5, 10].includes(amount)) return false;";
const mobileGuard = "  function spendOvertime(orderId, amount, now = Date.now()) {\n    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 100000) return false;\n    amount = Math.min(amount, Math.max(0, game.overtimePoints || 0));\n    if (!amount) return false;";
if(source.split(overtimeGuard).length!==2)throw Error('Overtime validation boundary changed');
const refillGuard='  const OVERTIME_REFILL_POINTS = 100;';
if(source.split(refillGuard).length!==2)throw Error('Refill constant boundary changed');
const expeditionRegenGuard='  const EXPEDITION_REGEN_MS = 20 * 60 * 1000;';
if(source.split(expeditionRegenGuard).length!==2)throw Error('Expedition regeneration boundary changed');
const compiled = new vm.Script(source.slice(0,boundary).replaceAll('game.overtimePoints >= game.overtimeCapacity','game.overtimePoints >= overtimeCapacity()').replace(overtimeGuard,mobileGuard).replace(refillGuard,'  const OVERTIME_REFILL_POINTS = 50;').replace(expeditionRegenGuard,'  const EXPEDITION_REGEN_MS = 10 * 60 * 1000;') + bridge, {filename:'web-engine.cjs'});
function session(state, now=Date.now(), random=Math.random) {
  const storage = new Map();
  const elements = new Map();
  const element = key => {
    if(!elements.has(key)) elements.set(key,{innerHTML:'',textContent:'',open:false,close(){this.open=false;},showModal(){this.open=true;},setAttribute(){},classList:{add(){},remove(){}}});
    return elements.get(key);
  };
  class Clock extends Date { constructor(...args){super(...(args.length?args:[now]));} static now(){return now;} }
  const math=Object.create(Math);math.random=random;
  const context=vm.createContext({localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},Date:Clock,Math:math,Intl,Number,JSON,setTimeout:()=>0,clearTimeout:()=>{},document:{querySelector:element}});
  compiled.runInContext(context,{timeout:2000});
  const api=context.mobile;
  if(state) api.state=JSON.parse(JSON.stringify(state));
  api.expansionState();api.migrateCompanyTransport();api.migrateLinearProgression();api.migrateHubVehicles();api.migrateTransportCards();
  if(!Number.isSafeInteger(api.state.inventory.expeditionRefills)||api.state.inventory.expeditionRefills<0)api.state.inventory.expeditionRefills=0;
  prepareEvent(api.state);
  api.normalizeQueuedReferrals();api.shortenTestMissions();api.settleProcurementTimeline(now);
  api.autoRefreshOrders(now);api.regenerateExpedition(now);api.regenerateOvertime(now);
  return api;
}
const id = value => {if(typeof value!=='string'||value.length>100)throw Error('Ungültige Kennung');return value;};
const num = (value,max=100000) => {if(!Number.isSafeInteger(value)||value<0||value>max)throw Error('Ungültige Zahl');return value;};
const choice = (value,values) => {if(!values.includes(value))throw Error('Ungültige Auswahl');return value;};
const companyProfile = p => {
  const name = (value, label, max) => {
    if (typeof value !== 'string' || /[<>\p{Cc}\p{Cf}]/u.test(value)) throw Error(label + ' ist ungültig.');
    const cleaned = value.normalize('NFC').trim().replace(/\s+/gu,' ');
    if (cleaned.length < 2 || cleaned.length > max || !/[\p{L}\p{N}]/u.test(cleaned))
      throw Error(label + ' muss 2 bis ' + max + ' Zeichen enthalten.');
    return cleaned;
  };
  return {companyName:name(p.companyName,'Firmenname',40),cityName:name(p.cityName,'Stadtname',30)};
};
function execute(state, action='sync', p={}, now=Date.now(), random=Math.random, eventContext={}) {
  const a=session(state,now,random);
  touchEvent(a.state,now);
  syncWorld(a.state,eventContext);
  const before=JSON.stringify(a.state);
  const activityBefore={overtime:a.state.overtimePoints,expedition:a.state.expedition.points};
  const distance=()=>a.state.eventTests?.[p.id]?.distance||240;
  const calls={
    procurementGroupStart:()=>{
      if(!Array.isArray(p.trucks)||!p.trucks.length||p.trucks.length>10)throw Error('Ungültige Fahrzeugauswahl.');
      const trucks=p.trucks.map(id);
      if(new Set(trucks).size!==trucks.length)throw Error('Doppelte Fahrzeugauswahl.');
      return a.startProcurementGroup(num(p.region,4),trucks,choice(p.mode,['count','reserve']),num(p.amount,p.mode==='count'?100000:1000000000));
    },
    procurementGroupStop:()=>a.stopProcurementGroup(id(p.id),choice(p.immediate,[true,false])),
    procurementStart:()=>a.startProcurement(num(p.region,4),id(p.truck),choice(p.mode,['count','reserve']),num(p.amount,p.mode==='count'?100000:1000000000)),
    procurementStop:()=>a.stopProcurement(id(p.id),choice(p.immediate,[true,false])),
    procurementClaim:()=>a.claimProcurement(),
    eventStart:()=>changeEvent(a.state,id(p.id),'start',num(p.run),now,p),
    eventRanks:()=>{},
    eventJoin:()=>joinEvent(a.state,eventContext.world,now,eventContext.member),
    eventRegister:()=>{if(!eventContext.world)throw Error('Gemeinschaftsevent nicht verfügbar.');if(now>=eventContext.world.startsAt)throw Error('Anmeldung geschlossen. Bitte beitreten.');a.state.eventRegistration=eventContext.world.id;return 'Für den Pyramidenbau angemeldet.';},
    eventClaim:()=>claimEvent(a.state,id(p.id),num(p.run),p.kind,now,eventContext.world),
    eventOvertime:()=>spendEventOvertime(a.state,id(p.id),num(p.run),p.amount,now),
    eventEnd:()=>changeEvent(a.state,id(p.id),'end',num(p.run),now),
    eventFleet:()=>assignEventFleet(a.state,id(p.id),num(p.run),num(p.template,2),a.eventFleetOptions(distance()),now),
    singleVehicle:()=>a.queueSingleVehicle(id(p.order),id(p.truck)),
    sync:()=>{},start:()=>a.chooseStartCity(id(p.id)),foundCompany:()=>a.foundCompany(companyProfile(p)),
    garageAdd:()=>a.addCardToGarage(id(p.id)),garageRemove:()=>a.removeCardFromGarage(id(p.id)),
    garageReplace:()=>a.replaceGarageCard(id(p.id),id(p.replacement)),
    seat:()=>a.assignCharacterSeat(id(p.id),num(p.seat,4),num(p.template,2)),
    unseat:()=>a.removeSeat(num(p.template,2),num(p.seat,4)),
    cardUpgrade:()=>a.giveCharacterShard(id(p.id),true),shardCombine:()=>a.combineExpeditionShards(choice(p.rarity,['common','uncommon'])),
    cardCapacity:()=>a.upgradeCardVehicle(id(p.id),'capacity'),cardRank:()=>a.upgradeCardVehicle(id(p.id),'rank'),
    buyTruck:()=>a.buyTruck(num(p.model,1)),rank:()=>a.upgradeTruckRarity(id(p.id)),capacity:()=>a.upgradeTruckCapacity(id(p.id)),sell:()=>a.sell(id(p.id)),
    assign:()=>a.assignOrder(id(p.order),id(p.truck)),assignPrivate:()=>a.assignPrivatePickup(id(p.order),id(p.truck)),assignCrafted:()=>a.assignCraftedOrder(id(p.order),id(p.truck)),
    projectStart:()=>a.startFleetProject(id(p.id),num(p.template,2)),overtime:()=>p.amount==='max'?a.spendMaxOvertime(id(p.id)):a.spendOvertime(id(p.id),num(p.amount)),refill:()=>a.useOvertimeRefill(),expeditionRefill:()=>a.useExpeditionRefill(),
    giftOpen:()=>a.openRegionGift(num(p.region,4)),
    claimSingles:()=>a.claimSingleRewards(),
    claim:()=>a.claimOrderReward(id(p.id)),claimAll:()=>{for(const order of a.state.orders)a.applyOrderReward(order);},
    discover:()=>a.discoverExpeditionPlace(num(p.region,4)),draw:()=>a.drawExpeditionJob(num(p.region,4)),
    mission:()=>a.startExpeditionMission(num(p.region,4),choice(p.kind,['delivery','final','endless']),id(p.truck),num(p.place)),
    claimMission:()=>a.claimExpeditionMission(num(p.id)),
    expeditionNoticeAck:()=>a.acknowledgeExpeditionCompletions(num(p.through,Number.MAX_SAFE_INTEGER)),
    expansionAllocate:()=>a.allocateExpansionPoints(num(p.expedition,1000000),num(p.overtime,1000000),num(p.points,1000000)),
    hubVehicleBuy:()=>a.buyHubVehicle(),hubVehicleUpgrade:()=>a.upgradeHubVehicle(id(p.id),choice(p.kind,['capacity','speed'])),hubCrate:()=>a.openHubCrate(),
    buyHub:()=>a.buyHub(),hubTruck:()=>a.toggleHubTruck(id(p.id)),hubCollect:()=>a.collectHub(),hubUpgrade:()=>a.startHubUpgrade(),
    pickupCraft:()=>a.combinePickupHints(),customerCraft:()=>a.craftCustomerOrder(),
    department:()=>a.unlockDepartment(choice(p.id,['dispatch','workshop','sales'])),
    companyOffers:()=>a.upgradeOfferLimit(),companyWorkshop:()=>a.upgradeWorkshop(),companySales:()=>a.upgradeSales(),
    transportBatch:()=>{
      if(!Array.isArray(p.upgrades)||!p.upgrades.length||p.upgrades.length>6)throw Error('Ungültige Ausbauauswahl.');
      const seen=new Set();
      const upgrades=p.upgrades.map(u=>{
        if(!u||typeof u!=='object')throw Error('Ungültige Ausbauauswahl.');
        const category=choice(u.category,['national','international']),kind=choice(u.kind,['premium','volume','range']);
        const key=category+':'+kind;if(seen.has(key))throw Error('Doppelte Ausbauauswahl.');seen.add(key);
        const count=num(u.count,1000);if(!count)throw Error('Ungültige Ausbauauswahl.');
        return {category,kind,count,level:num(u.level,1000)};
      });
      return a.upgradeTransportBatch(upgrades);
    },
    transport:()=>a.upgradeTransport(choice(p.category,['national','international']),choice(p.kind,['premium','volume','range'])),
    customerBatch:()=>{
      const keys=['pay','special','referral'];
      for(const value of [p.points,p.base])if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==3||!keys.every(key=>Object.hasOwn(value,key)))throw Error('Ungültige Punkteverteilung.');
      const points=Object.fromEntries(keys.map(key=>[key,num(p.points[key],100)]));
      const base=Object.fromEntries(keys.map(key=>[key,num(p.base[key],100)]));
      return a.allocateCustomerBatch(id(p.id),points,base);
    },
    customerSkill:()=>a.allocateCustomerSkill(id(p.id),choice(p.kind,['pay','special','referral'])),
    pin:()=>a.toggleOrderPin(id(p.id)),refresh:()=>a.manualRefreshOrders(),level:()=>a.allocateLevel(num(p.expedition,3),p.overtime===undefined?3-num(p.expedition,3):num(p.overtime,3)),
    levelBatch:()=>a.allocateLevelBatch(num(p.expedition,300000),num(p.overtime,300000),num(p.points,300000)),
    testCoins:()=>a.grantTestCoins(),testGrant:()=>a.grantTestResource(choice(p.kind,['expedition','overtime','xp']),choice(p.amount,p.kind==='xp'?[100,1000]:[100])),reset:()=>a.reset()
  };
  if(!Object.hasOwn(calls,action))throw Error('Unbekannte Aktion');
  if(!a.state.startCity&&!['sync','start','foundCompany','reset'].includes(action))throw Error('Bitte zuerst deine Firma gründen.');
  const oldOrders = new Set(a.state.orders.map(o=>o.id));
  const oldJobs = new Set(a.state.expedition.jobs.map(j=>j.id));
  const clocks=a.capturePointClocks(now);
  const ok=calls[action]();
  touchEvent(a.state,now);
  recordActivity(a.state,action,activityBefore,now);
  a.reconcilePointClocks(clocks,now);
  if(action==='mission')a.shortenTestMissions();
  a.refreshTourStarts(now);
  syncWorld(a.state,eventContext);
  const view=a.view();
  view.testEvents=eventViews(a.state,a.eventFleetOptions(a.state.eventTests?.['large-project-own-overtime']?.distance||240),eventContext.world,eventContext.ranking);
  if(action.startsWith('event'))view.message=ok;
  const normalizeNames=text=>typeof text==='string'?normalizeCustomerNames(text).replace('Geeignete Klassen: Regionalverkehr 7,5-Tonner, 18-Tonner und 26-Tonner; Fernverkehr Sattelzug, 26-Tonner und 40-t-Tautliner.','Alle gefundenen Fahrzeugkarten können Regionalverkehr und Fernverkehr fahren.').replace(/Sonderfahrten/g,'Sonderaufträge').replace(/Sonderfahrt/g,'Sonderauftrag').replace(/Firmen-Items/g,'Firmenausbau-Items').replace(/Firmen-Item/g,'Firmenausbau-Item').replace(/100-Token-Refill|Überstunden-Refill/g,'Überstundenauffüller').replace(/\b(common|uncommon|rare)-Shard/g,(_,r)=>r[0].toUpperCase()+r.slice(1)+'-Shard'):text;
  view.message=normalizeNames(view.message);
  view.state.events=view.state.events.map(event=>({...event,text:normalizeTransportNames(normalizeCustomerNames(event.text),view.state.profile)}));
  for(const order of view.state.orders)order.possibleRewards=order.possibleRewards.map(normalizeNames);
  for(const key of Object.keys(view.help)){const help=view.help[key];help[1]=help[1].map(([title,body])=>[normalizeNames(title),normalizeNames(body)]);}
  view.help.expeditions[1]=view.help.expeditions[1].map(([title,body])=>title==='Fundchancen je Auslosung'?[title,'<p>Je Gebiet gibt es fünf Fahrzeugkarten. Insgesamt 10 % Kartenchance pro Expedition. Die Fahrzeugchancen und Auftragschancen stehen am Endlosort unter ?. Geschenke im Großhändler enthalten denselben Fahrzeugpool und geben garantiert eine Karte. Doppelte Karten geben 1 Shard derselben Seltenheit.</p>']:[title,body]);
  view.help.expeditions[1]=view.help.expeditions[1].map(([title,body])=>[title,title==='Missionen'?'Jeder der sieben Orte hat eine einmalige Bonuslieferung. Ihr Abschluss gibt automatisch 1 Erweiterungspunkt. Die erste Endlosort-Lieferung schaltet den regionalen Stammkunden frei und gibt 1 Kapazitätsmodul, sofern noch nicht erhalten. Fahrzeuge kommen aus der Garage.':body]);
  view.help.expeditions[1].push(['Automatische Abschlüsse','Abgeschlossene Expeditionslieferungen und Expeditionsaufträge werden automatisch gutgeschrieben. Ortslieferungen geben 1 Erweiterungspunkt statt einer festen Erhöhung des Expeditionsmaximums. Jeder Punkt erhöht wahlweise das Expeditions- oder Überstundenmaximum dauerhaft um 1. Bestätigte Verteilungen sind nicht rückgängig zu machen. Unvergebene Punkte bleiben unter Firma verfügbar. Die Abschlussübersicht kann geschlossen werden; sie ist keine Abholung.']);
  view.help.dashboard[1]=view.help.dashboard[1].map(([title,body])=>[title,title==='Spielerlevel'?'<p>Transportierte Tonnen geben XP: gelieferte Tonnen × bezahlte Richtungen × (1 + aktive Karten-XP-Boni / 100). Bei Dual Way zählen beide Richtungen. Jeder nächste Aufstieg benötigt 100 × aktuelles Level XP. Je Aufstieg: 1 Expeditionsauffüller, 1 Überstundenauffüller und 3 dauerhaft verteilbare Punkte. Ab Level 5 wird alle fünf Level ein weiterer Stadthub-Fahrzeugplatz freigeschaltet, maximal 20 bei Level 100.</p>':body]);
  view.help.company[1]=view.help.company[1].map(([title,body])=>title==='Transportsegmente'?[title,'Prämie: 1.000 Stufen, je +1 Prozentpunkt. Neue Stufe N kostet 1.000 × N M und 1 + abrunden((N−1)/25) Firmenausbau-Items. Regional- und Fernverkehr getrennt. Menge und Reichweite: je 100 Stufen; bisherige Endwerte und Gesamtkosten bleiben erhalten. Prämien wirken auf die Abschlussprämie der jeweiligen Kategorie, nicht auf Frachtvergütung oder Beute.']: [title,body]);
  view.help.development[1]=view.help.development[1].map(([title,body])=>title==='Herstellung'?[title,'100 Abholhinweise ergeben eine Privatabholung. Rahmensplitter lassen sich zur nächsthöheren Seltenheit kombinieren. Firmenausbau-Items werden vorerst nicht zur Herstellung verwendet.']:[title,body]);
  view.help.inventory[1]=view.help.inventory[1].map(([title,body])=>[title,body.replace('Firmenausbau-Items dienen Firmenausbauten und Kundenaufträgen.','Firmenausbau-Items dienen Firmenausbauten.')]);
  view.help.personnel[1]=[['Fahrzeugkarten','25 regionale Landtransporter: zwei Common, eine Uncommon, eine Rare und eine Epic pro Region. Jede Karte hat eigene Grundkapazität und Grundgeschwindigkeit sowie genau einen Bonus. Die Staffel bis Stufe 10 steht im Kartendetail.'],['Wirkungsbereiche','Eigenboni unterstützen nur das Fahrzeug. Flottenboni unterstützen alle Fahrzeuge derselben Flotte einschließlich des Bonusgebers. Garagenboni gelten, solange die Karte in der Garage eingesetzt ist, auch während Einzelaufträgen und Beschaffung. Gleiche Transportboni verschiedener Karten addieren sich. Laufende Touren behalten ihre Werte bis zur nächsten Abfahrt.'],['Punkteboni','Königliche Postkutsche: mehr Überstundenmaximum. Oasenkarawane: mehr Expeditionsmaximum. Jeweils +5/10/15/20/25/30/40/50/60/70 Punkte. Jade-Kundschaftergespann: Expeditionsintervall um 10/20/30/40/50/60/75/90/105/120 Sekunden kürzer. Nur in der Garage aktiv. Das Einsetzen füllt keine Punkte auf. Überschuss bleibt nach dem Entfernen erhalten; Regeneration pausiert bis unter das Maximum. Timerwechsel erhalten den anteiligen Fortschritt.']];
  view.help.fleet[1]=view.help.fleet[1].map(([title,body])=>[title,title==='Tempo und Ausbauten'?'Tempo = individuelles Basistempo × (1 + 0,005 × Rangstufen) × (1 + Tempoboni / 100) × (1 − 0,01 × Ladung in t). Je Kapazitätsmodul +5 % der Grundkapazität, zehn Ausbaustufen. Bereits investierte Module und Ränge bleiben erhalten.':title==='Einsetzen und Herausnehmen'?'Kartenbesitz, Ausbau und Statistik bleiben beim Herausnehmen erhalten. Laufende Einzelaufträge, Expeditionen, Beschaffung und reservierte Ersatzfahrzeuge verhindern das Herausnehmen. Laufende Touren behalten ihre Werte; die nächste Abfahrt übernimmt Änderungen.':body]);
  view.help.dealer[1]=[['Stadttransporter','Kauf und Ausbau erfolgen direkt im Stadthub. Ein Modell für 25.000 Münzen, 2 t Startkapazität.']];
  view.help.dealer[1]=view.help.dealer[1].map(([title,body])=>[title,body.replace('max(1, abrunden(Spielerlevel × 0,75))','abrunden(Spielerlevel / 5)').replace('Vor dem Kauf muss der Stadthub eröffnet sein.','Der Stadthub wird ab Level 5 eröffnet. Alle fünf Level wird ein weiterer Fahrzeugplatz freigeschaltet. Bestehende Fahrzeuge bleiben erhalten.')]);
  view.help.hub[1]=[['Zyklus und Leistung','Ein Einkauf alle 60 Minuten. Die mögliche Stundenmenge folgt aus Kapazität und beladener sowie leerer Fahrgeschwindigkeit aller eingesetzten Fahrzeuge. Vertrieb Stufe 0 kauft Ware für 40 Minuten ein; jede der 20 Stufen erhöht die Auslastung um 30 Sekunden bis auf 50 Minuten. Danach warten Fahrzeuge bis zum nächsten Einkauf. Laufende Einkäufe behalten ihre Werte.'],['Kasse und Abholung','Die Kasse fasst sechs abgeschlossene Einkaufszyklen. Bei voller Kasse pausiert der Hub. Volle Kasse abholen startet sofort einen neuen Einkauf bei Minute 0. Teilabholungen verändern den laufenden Zyklus nicht. Münzen und sämtliche weiteren Erträge werden gemeinsam eingesammelt.'],['Vertrieb','Lieferantenkontakte und Firmenausbau-Items erweitern die Einkaufsmenge. 20 Stufen von 40 bis 50 Minuten Auslastung. Der Ausbau kostet nur Lieferantenkontakte und Firmenausbau-Items und dauert je Zielstufe zwölf Stunden.']];
  view.help.hub[1].unshift(['Freischaltung','Stadthub ab Level 5. Alle fünf Level ein Platz, maximal 20 bei Level 100. Ein Stadttransporter kostet 25.000 Münzen und startet mit 2 t. Werkzeugkästen verbessern Kapazität und Antrieb in je zehn Stufen. Drei Fundkisten täglich, mindestens 30 Minuten Abstand; Tageswechsel um 00:00 UTC. Beim stündlichen Einkauf: einmal 50 % Chance auf einen Werkzeugkasten, keine Funde bei voller Kasse. Werkzeugkästen aus Einkäufen mit den Erträgen abholen.']);
  view.help.inventory[1].unshift(['Auffüller','Pro Levelaufstieg: 1 Expeditionsauffüller, 1 Überstundenauffüller und 3 verteilbare Punkte. Beide Auffüller geben beim Benutzen 50 Punkte.']);
  for(const section of Object.values(view.help))section[1]=section[1].map(([title,body])=>[title,body.replace(/Je Aufstieg: sofort 50 Expeditionspunkte, ein speicherbares Refill-Paket für 50 Überstundenpunkte sowie 5 dauerhaft verteilbare Punkte/g,'Je Aufstieg: 1 Expeditionsauffüller, 1 Überstundenauffüller sowie 3 dauerhaft verteilbare Punkte').replace(/Pro Level-up erhältst du ein speicherbares Überstundenauffüller für (?:50|100) Punkte\./g,'Auffüller werden in den Vorräten aufbewahrt.')]);
  for(const mission of view.state.expedition.missions)mission.reward=normalizeNames(mission.reward);
  view.message=normalizeTransportNames(view.message,view.state.profile);
  for(const section of Object.values(view.help))section[1]=section[1].map(([title,body])=>[normalizeTransportNames(title),normalizeTransportNames(body)]);
  for(const mission of view.state.expedition.missions)mission.reward=normalizeTransportNames(mission.reward,view.state.profile);
  const knownLevels=new Set(state?.pendingLevelUps||[]);
  const levelUps=view.state.pendingLevelUps.filter(level=>!knownLevels.has(level));
  if(levelUps.length)view.levelUps=levelUps;
  if(['assign','assignPrivate','assignCrafted'].includes(action)&&view.state.orders.find(o=>o.id===p.order)?.status==='active')view.message='Auftrag gestartet.';
  if(action==='hubCrate'&&ok!==false)view.hubCrateParts=ok;
  if(action==='giftOpen'&&ok!==false)view.giftFind=ok;
  if(['claimSingles','hubCollect'].includes(action)&&ok!==false)view.claimSummary=ok;
  if(action==='transportBatch')view.transportBatchApplied=ok===true;
  if(action==='customerBatch')view.customerBatchApplied=ok===true;
  if(action==='expansionAllocate')view.expansionAllocationApplied=ok===true;
  if(action==='draw'&&ok!==false){
    const order=view.state.orders.find(o=>!oldOrders.has(o.id));
    const job=view.state.expedition.jobs.find(j=>!oldJobs.has(j.id));
    const card=typeof ok==='string'&&ok.startsWith('card:')?view.catalog.cards.find(c=>c.id===ok.slice(5)):null;
    view.expeditionFind=order?{type:'order',id:order.id,title:order.projectName||order.cargo,detail:order.volume+' t · '+order.distance+' km',itemId:order.isProject?'project:'+order.kind:'order:'+(order.kind==='private'?'private':'customer'),rarity:order.isProject?(order.kind==='referral'?'epic':'rare'):undefined}
      :job?{type:'job',id:job.id,region:job.region,title:itemNames[job.kind==='character'?'character':'material'][0],detail:'Stufe '+job.tier,itemId:'job:'+job.kind+':'+job.tier}
      :{type:'reward',itemId:card&&state?.expedition.characters[card.id]?'shard:'+card.rarity:undefined,cardId:card?.id,title:card?.name||view.message||'Fund erhalten',detail:card?(state?.expedition.characters[card.id]?'1 '+card.rarity[0].toUpperCase()+card.rarity.slice(1)+'-Shard':'Fahrzeugkarte'):''};
  }
  // Single-order successes are already visible in the updated list; retain rejection feedback.
  const singleAction=['assign','assignPrivate','assignCrafted','pin','refresh','singleVehicle','claimSingles'].includes(action)
    ||(action==='claim'&&view.state.orders.some(o=>o.id===p.id&&!o.isProject))
    ||(action==='mission'&&p.kind==='endless')
    ||(action==='claimMission'&&view.state.expedition.missions.some(m=>m.id===p.id&&m.kind==='endless'));
  view.silentSuccess=singleAction&&ok!==false&&(ok===true||JSON.stringify(a.state)!==before);
  if(!['sync','eventRanks'].includes(action)&&(ok===false||JSON.stringify(a.state)===before))view.message ||= 'Aktion nicht möglich: Voraussetzungen oder Vorräte prüfen.';
  return {state:JSON.parse(JSON.stringify(a.state)),view:JSON.parse(JSON.stringify(view))};
}
module.exports={execute,session};
