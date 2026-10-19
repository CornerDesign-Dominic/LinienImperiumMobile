'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const itemNames = require('./item-names.json');
const {eventViews, changeEvent} = require('./events.cjs');
const source = fs.readFileSync(path.join(__dirname, '../vendor/web-game.js'), 'utf8');
const boundary = source.indexOf("  document.addEventListener('click'");
if (boundary < 0) throw Error('Web engine boundary missing');
// Temporary test switch. Set to null to restore the original expedition timings.
const EXPEDITION_TEST_DURATION_MS = 15000;
const bridge = `
  const itemNames = ${JSON.stringify(itemNames)};
  const expeditionTestDuration = ${JSON.stringify(EXPEDITION_TEST_DURATION_MS)};
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
      if(region.discovered===7&&!region.moduleAwarded){
        region.endlessUnlocked=true;region.moduleAwarded=true;game.inventory.capacityModules++;
        addEvent(EXPEDITION_REGIONS[index]+': Endlosort freigelegt · 1 Kapazitätsmodul erhalten.');
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
  globalThis.mobile = {
    get state() { return game; }, set state(value) { game = value; },
    newGame, save, loadGame, shortenTestMissions, normalizeQueuedReferrals, settleTrips, settleFleetProjects, settleExpeditions, settleHub,
    autoRefreshOrders, regenerateExpedition, regenerateOvertime,
    chooseStartCity, addCardToGarage, removeCardFromGarage, assignCharacterSeat,
    giveCharacterShard, combineExpeditionShards, buyTruck, upgradeTruckRarity,
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
    spendMaxOvertime(orderId){const amount=overtimeToDeadline(game.orders.find(o=>o.id===orderId));return amount>0?spendOvertime(orderId,amount):false;},
    discoverExpeditionPlace, drawExpeditionJob, startExpeditionMission, claimExpeditionMission,
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
          coins+=COMPANY_BALANCE.transportUpgradeCoins(kind,next);
          items+=COMPANY_BALANCE.transportUpgradeItems(next);
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
    sell(id) { if (!openSaleDialog(id)) return false; return confirmSale(); },
    claimSingleRewards() {
      const orders=game.orders.filter(o=>!PROJECT_DEADLINES[o.kind]&&o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
      if(!orders.length)return false;
      const summary={count:orders.length,coins:0,gears:{},capacityModules:0,companyItems:0,supplierContacts:0};
      for(const order of orders){
        const reward=order.completionReward;
        summary.coins=round2(summary.coins+reward.coins);
        for(const [rarity,amount] of Object.entries(reward.gears||{}))summary.gears[rarity]=(summary.gears[rarity]||0)+amount;
        summary.capacityModules+=Number(Boolean(reward.capacityModule));summary.companyItems+=reward.companyItems||0;summary.supplierContacts+=reward.supplierContacts||0;
        applyOrderReward(order);
      }
      mobileToast=summary.count+' Prämien abgeholt.';
      return summary;
    },
    grantTestCoins() { game.coins += TEST_COINS_GRANT; game.stats.testCoinsGranted += TEST_COINS_GRANT; addEvent('Testmünzen: +50.000 M'); },
    grantTestResource(kind, amount) {
      if (kind === 'xp') awardTransportXp(amount);
      else if (kind === 'expedition') { game.expedition.points += amount; game.expedition.lastRegenAt = Date.now(); }
      else { game.overtimePoints += amount; game.overtimeLastRegenAt = Date.now(); }
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
        cards: EXPEDITION_CHARACTERS, rarities: RARITIES, models: TRUCKS,
        customers: CUSTOMERS, categories: CATEGORIES, departments: DEPARTMENTS,
        recipes:[
          {id:'pickup',inputId:'pickupHints',outputId:'private',input:itemNames.pickupHints[1],output:itemNames.private[0],needed:PRIVATE_PICKUP_HINT_COST,action:'pickupCraft'},
          {id:'customer',inputId:'companyItems',outputId:'customer',input:itemNames.companyItems[1],output:itemNames.customer[0],needed:COMPANY_BALANCE.craftedOrderItems,action:'customerCraft'},
          {id:'uncommon',inputId:'shard:common',outputId:'shard:uncommon',input:'Common-Shards',output:'Uncommon-Shard',needed:SHARD_COMBINE_RATIO,action:'shardCombine',payload:{rarity:'common'},color:'#5BAA78'},
          {id:'rare',inputId:'shard:uncommon',outputId:'shard:rare',input:'Uncommon-Shards',output:'Rare-Shard',needed:SHARD_COMBINE_RATIO,action:'shardCombine',payload:{rarity:'uncommon'},color:'#619CE8'}
        ],
        cardLevelCosts: CHARACTER_LEVEL_COSTS, regionNames: EXPEDITION_REGIONS, craftedOrderItems:COMPANY_BALANCE.craftedOrderItems
      };
      const trucks = game.trucks.map(t => ({ ...t, free: free.has(t.id),
        progress: (()=>{const order=game.orders.find(o=>o.status==='active' && o.truckId===t.id); if(order)return order.delivered/order.volume*100; const m=game.expedition.missions.find(m=>m.status==='active' && m.truckId===t.id); return m ? (m.transport ? m.transport.delivered/m.transport.volume*100 : Math.min(100,(now-m.startedAt)/(m.endsAt-m.startedAt)*100)) : 0;})(),
        rarity: truckRarity(t), rankCost: rankGearCost(t), speed: truckSpeed(t),
        bonus: cardBonusStats(t), costPerKm: operatingCostPerKm(t),
        sale: saleBlockReason(t) ? null : saleQuote(t),
        busyUntil: (() => { const o = game.orders.find(o => o.status === 'active' && o.truckId === t.id); if(o) return now + remainingOrderSeconds(o,t,now)*1000; return game.expedition.missions.find(m=>m.status==='active' && m.truckId===t.id)?.endsAt || null; })()
      }));
      const orders = game.orders.map(o => {
        const project = Boolean(PROJECT_DEADLINES[o.kind]);
        const suitable = !project ? game.trucks.filter(t=>canTruckTakeOrder(t,o)) : [];
        const estimate = t => ({id:t.id,model:t.model,capacity:t.capacity,seconds:orderDuration({...o,delivered:0},t),xp:round2(o.volume*paidLegs(o)*(1+activeCardBonus(t,'xp','single')/100)),...orderEconomics(o,t)});
        const choices = !project && ['available','queued'].includes(o.status) ? eligibleFreeTrucks(o).map(estimate) : [];
        const assigned = !project && o.status==='active' ? truckById(o.truckId) : null;
        const forecastTruck = assigned || suitable[0];
        const referenceTier=(CATEGORIES.find(c=>c.id===o.category)?.tiers||[2])[0];
        const durationTruck=forecastTruck||{...TRUCKS[referenceTier],tier:referenceTier,rarityLevel:0};
        const durationSeconds=project?null:orderDuration({...o,delivered:0},durationTruck);
        const possibleRewards = project ? [] : o.kind==='private' ? ['1–2 Lieferantenkontakte'] : ['Common-Zahnräder','Uncommon-Zahnräder',...(o.customer?['Rare-Zahnräder']:[]),...(o.kind==='normal'&&TRANSPORT_BASE[o.category]?['Fortschritt für Firmenausbau-Items']:[]),...(o.customer&&o.kind==='normal'?[round2(customerTripChance(o,'award')*100)+' % Chance auf Sonderauftrag']:[])];
        return { ...o, isProject: project,
          transportLabel:CATEGORIES.find(c=>c.id===o.category)?.label||'Regionalverkehr',
          durationSeconds, durationBand:durationSeconds==null?null:durationSeconds<=300?'Kurz':durationSeconds<=900?'Mittel':'Lang',
          customerName: o.customer ? customerById(o.customer)?.name : 'Freie Frachtbörse',
          choices, vehicleStatus: choices.length?'ready':suitable.length?'busy':'missing',
          forecast: forecastTruck && o.status!=='completed' ? estimate(forecastTruck) : null,
          projectInfo:project?mobileProjectInfo(o.kind,o.projectRegion??Math.max(0,EXPEDITION_CUSTOMER_IDS.indexOf(o.customer)),o):null,
          baseXp:round2(o.volume*paidLegs(o)), premium:completionPremium(o),
          possibleRewards, relationshipReward:o.customer?(TRUST_REWARDS[o.kind]||0):0,
          tripEndsAt:assigned?o.tripStartAt+tourSeconds(o,assigned,o.tripCargo??Math.min(assigned.capacity,o.volume-o.delivered))*1000:null,
          runningEndsAt:assigned?now+remainingOrderSeconds(o,assigned,now)*1000:null,
          overtimeForDeadline:project&&o.status==='active'?overtimeToDeadline(o,now):null,
          eta: o.project && o.status==='active' ? projectEstimatedEnd(o,now) : null,
          templates: project && o.status==='queued' ? [0,1,2].map(index=>{
            const vehicles=projectFleetVehicles(index);
            return {index, vehicles, eta:vehicles ? projectEstimatedEnd({...o,delivered:0,project:{vehicles:vehicles.map(v=>({...v,cargo:0,nextAt:null}))}},now) : null};
          }) : []
        };
      });
      const cardVehicles = Object.fromEntries(EXPEDITION_CHARACTERS.map(card => {
        const owned = game.expedition.characters[card.id];
        const truck = game.trucks.find(t => t.cardId === card.id) || owned?.parkedTruck || createCardTruck(card);
        // Collection data intentionally excludes assignment, hub and trip state.
        return [card.id, {capacity:truck.capacity, rank:truckRarity(truck), speed:truckSpeed(truck),
          loadedSpeed:truckSpeed(truck,truck.capacity), costPerKm:operatingCostPerKm(truck),
          rankCost:rankGearCost(truck), capacityLevel:truck.moduleCapacityLevel || 0, maxCapacityLevel:TRUCKS[card.vehicleTier].maxCapacityLevel}];
      }));
      return {state: {...game,trucks,orders}, serverTime:now, catalog, cardVehicles,
        level:levelForXp(game.xp,game), expeditionCapacity:expeditionCapacity(),
        regeneration:{expeditionNextAt:game.expedition.points<expeditionCapacity()?game.expedition.lastRegenAt+EXPEDITION_REGEN_MS:null,overtimeNextAt:game.overtimePoints<game.overtimeCapacity?game.overtimeLastRegenAt+OVERTIME_REGEN_MS:null},
        templates:[0,1,2].map(i=>fleetTemplate(i)),
        cardBonuses:Object.fromEntries(EXPEDITION_CHARACTERS.map(c=>[c.id,cardBonusValue(c)])),
        openRegions:EXPEDITION_REGIONS.map((_,i)=>expeditionRegionOpen(i)),
        expeditionMap:game.expedition.regions.map((region,index)=>({
          index, name:EXPEDITION_REGIONS[index], customer:customerById(EXPEDITION_CUSTOMER_IDS[index]),
          open:expeditionRegionOpen(index), discovered:region.discovered,
          deliveries:region.deliveries.filter(Boolean).length, finalClaimed:region.finalClaimed,
          progress:Array.from({length:7},(_,place)=>place<region.discovered?expeditionDiscoveryCost(index,place):(region.discoveryPoints?.[place]||0)).reduce((sum,v)=>sum+v,0)/Array.from({length:7},(_,place)=>expeditionDiscoveryCost(index,place)).reduce((sum,v)=>sum+v,0)*100,
          places:Array.from({length:7},(_,place)=>({index:place,discoveryCost:expeditionDiscoveryCost(index,place),invested:place<region.discovered?expeditionDiscoveryCost(index,place):(region.discoveryPoints?.[place]||0),durationMs:expeditionDuration(index,'delivery',place)})),
          finalDurationMs:expeditionDuration(index,'final')
        })),
        projectCatalog:[...EXPEDITION_REGIONS.map((_,region)=>mobileProjectInfo('special',region)),{...mobileProjectInfo('referral',0),sources:EXPEDITION_REGIONS.map((_,region)=>mobileProjectInfo('referral',region))}],
        transportUpgradeOptions:['national','international'].flatMap(category=>['premium','volume','range'].map(kind=>{
          const level=companyFor().transportUpgrades[category][kind+'Level'],limit=TRANSPORT_UPGRADE_LIMITS[category][kind];
          return {category,kind,level,limit,base:TRANSPORT_BASE[category],costs:Array.from({length:limit-level},(_,i)=>({coins:COMPANY_BALANCE.transportUpgradeCoins(kind,level+i+1),items:COMPANY_BALANCE.transportUpgradeItems(level+i+1)}))};
        })),
        discoveryCosts:game.expedition.regions.map((r,i)=>expeditionDiscoveryCost(i,r.discovered)),
        customers:CUSTOMERS.filter(c=>customerUnlocked(c.id)).map(c=>({...c,level:customerLevel(game.customerTrust[c.id]||0),next:customerNext(game.customerTrust[c.id]||0),points:availableCustomerSkillPoints(c.id),skills:customerSkillLevels(c.id)})),
        refreshCost:manualRefreshCost(), offers:offerLimit(), pinLimit:pinLimit(), hubLimit:hubCapacity(),
        hubInfo:{hourlyCapacity:hubHourlyCapacity(), upgradeContacts:hubUpgradeContactCost((hub()?.salesLevel||0)+1),upgradeItems:COMPANY_BALANCE.upgradeItems((hub()?.salesLevel||0)+1),upgradeCoins:COMPANY_BALANCE.upgradeCoins((hub()?.salesLevel||0)+1)},
        companyCosts:{offers:{coins:offerUpgradeCost(),items:COMPANY_BALANCE.upgradeItems((game.company.offerLevel||0)+1)},workshop:{coins:workshopUpgradeCost(),items:COMPANY_BALANCE.upgradeItems((game.company.workshopLevel||0)+1)},sales:{coins:salesUpgradeCost(),items:COMPANY_BALANCE.upgradeItems((game.company.salesLevel||0)+1)},transport:Object.fromEntries(['national','international'].map(c=>[c,Object.fromEntries(['premium','volume','range'].map(k=>[k,transportUpgradeCost(c,k)]))]))},
        help:Object.fromEntries(['dashboard','orders','special','fleet','dealer','hub','inventory','development','company','personnel','expeditions','statistics','customers'].map(k=>{const help=pageHelp(k);return [k,[help[0],help[1].filter(([heading])=>heading!=='Werte im Code ändern')]];})),
        message:mobileToast
      };
    }
  };
})();`;
// Mobile selects an arbitrary positive amount; keep the original delivery/accounting body.
const overtimeGuard = "  function spendOvertime(orderId, amount, now = Date.now()) {\n    if (![1, 5, 10].includes(amount)) return false;";
const mobileGuard = "  function spendOvertime(orderId, amount, now = Date.now()) {\n    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 100000) return false;\n    amount = Math.min(amount, Math.max(0, game.overtimePoints || 0));\n    if (!amount) return false;";
if(source.split(overtimeGuard).length!==2)throw Error('Overtime validation boundary changed');
const compiled = new vm.Script(source.slice(0,boundary).replace(overtimeGuard,mobileGuard) + bridge, {filename:'web-engine.cjs'});
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
  api.normalizeQueuedReferrals();api.shortenTestMissions();api.settleTrips(now);api.settleFleetProjects(now);api.settleExpeditions(now);api.settleHub(now);
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
function execute(state, action='sync', p={}, now=Date.now(), random=Math.random) {
  const a=session(state,now,random), before=JSON.stringify(a.state);
  const calls={
    eventStart:()=>changeEvent(a.state,id(p.id),'start',num(p.run),now),
    eventEnd:()=>changeEvent(a.state,id(p.id),'end',num(p.run),now),
    sync:()=>{},start:()=>a.chooseStartCity(id(p.id)),foundCompany:()=>a.foundCompany(companyProfile(p)),
    garageAdd:()=>a.addCardToGarage(id(p.id)),garageRemove:()=>a.removeCardFromGarage(id(p.id)),
    seat:()=>a.assignCharacterSeat(id(p.id),num(p.seat,4),num(p.template,2)),
    unseat:()=>a.removeSeat(num(p.template,2),num(p.seat,4)),
    cardUpgrade:()=>a.giveCharacterShard(id(p.id),true),shardCombine:()=>a.combineExpeditionShards(choice(p.rarity,['common','uncommon'])),
    cardCapacity:()=>a.upgradeCardVehicle(id(p.id),'capacity'),cardRank:()=>a.upgradeCardVehicle(id(p.id),'rank'),
    buyTruck:()=>a.buyTruck(num(p.model,1)),rank:()=>a.upgradeTruckRarity(id(p.id)),capacity:()=>a.upgradeTruckCapacity(id(p.id)),sell:()=>a.sell(id(p.id)),
    assign:()=>a.assignOrder(id(p.order),id(p.truck)),assignPrivate:()=>a.assignPrivatePickup(id(p.order),id(p.truck)),assignCrafted:()=>a.assignCraftedOrder(id(p.order),id(p.truck)),
    projectStart:()=>a.startFleetProject(id(p.id),num(p.template,2)),overtime:()=>p.amount==='max'?a.spendMaxOvertime(id(p.id)):a.spendOvertime(id(p.id),num(p.amount)),refill:()=>a.useOvertimeRefill(),
    claimSingles:()=>a.claimSingleRewards(),
    claim:()=>a.claimOrderReward(id(p.id)),claimAll:()=>{for(const order of a.state.orders)a.applyOrderReward(order);},
    discover:()=>a.discoverExpeditionPlace(num(p.region,4)),draw:()=>a.drawExpeditionJob(num(p.region,4)),
    mission:()=>a.startExpeditionMission(num(p.region,4),choice(p.kind,['delivery','final','endless']),id(p.truck),num(p.place)),
    claimMission:()=>a.claimExpeditionMission(num(p.id)),
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
        const count=num(u.count,150);if(!count)throw Error('Ungültige Ausbauauswahl.');
        return {category,kind,count,level:num(u.level,150)};
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
    testCoins:()=>a.grantTestCoins(),testGrant:()=>a.grantTestResource(choice(p.kind,['expedition','overtime','xp']),choice(p.amount,p.kind==='xp'?[100,1000]:[100])),reset:()=>a.reset()
  };
  if(!Object.hasOwn(calls,action))throw Error('Unbekannte Aktion');
  if(!a.state.startCity&&!['sync','start','foundCompany','reset'].includes(action))throw Error('Bitte zuerst deine Firma gründen.');
  const oldOrders = new Set(a.state.orders.map(o=>o.id));
  const oldJobs = new Set(a.state.expedition.jobs.map(j=>j.id));
  const ok=calls[action]();
  if(action==='mission')a.shortenTestMissions();
  const view=a.view();
  view.testEvents=eventViews(a.state);
  if(action==='eventStart'||action==='eventEnd')view.message=ok;
  const normalizeNames=text=>typeof text==='string'?text.replace(/Sonderfahrten/g,'Sonderaufträge').replace(/Sonderfahrt/g,'Sonderauftrag').replace(/Firmen-Items/g,'Firmenausbau-Items').replace(/Firmen-Item/g,'Firmenausbau-Item').replace(/100-Token-Refill/g,'Überstunden-Refill').replace(/\b(common|uncommon|rare)-Shard/g,(_,r)=>r[0].toUpperCase()+r.slice(1)+'-Shard'):text;
  view.message=normalizeNames(view.message);
  for(const order of view.state.orders)order.possibleRewards=order.possibleRewards.map(normalizeNames);
  for(const key of Object.keys(view.help)){const help=view.help[key];help[1]=help[1].map(([title,body])=>[normalizeNames(title),normalizeNames(body)]);}
  for(const mission of view.state.expedition.missions)mission.reward=normalizeNames(mission.reward);
  const knownLevels=new Set(state?.pendingLevelUps||[]);
  const levelUps=view.state.pendingLevelUps.filter(level=>!knownLevels.has(level));
  if(levelUps.length)view.levelUps=levelUps;
  if(['assign','assignPrivate','assignCrafted'].includes(action)&&view.state.orders.find(o=>o.id===p.order)?.status==='active')view.message='Auftrag gestartet.';
  if(action==='claimSingles'&&ok!==false)view.claimSummary=ok;
  if(action==='transportBatch')view.transportBatchApplied=ok===true;
  if(action==='customerBatch')view.customerBatchApplied=ok===true;
  if(action==='draw'&&ok!==false){
    const order=view.state.orders.find(o=>!oldOrders.has(o.id));
    const job=view.state.expedition.jobs.find(j=>!oldJobs.has(j.id));
    const card=typeof ok==='string'&&ok.startsWith('card:')?view.catalog.cards.find(c=>c.id===ok.slice(5)):null;
    view.expeditionFind=order?{type:'order',id:order.id,title:order.projectName||order.cargo,detail:order.volume+' t · '+order.distance+' km'}
      :job?{type:'job',id:job.id,region:job.region,title:itemNames[job.kind==='character'?'character':'material'][0],detail:'Stufe '+job.tier}
      :{type:'reward',title:card?.name||view.message||'Fund erhalten',detail:card?(state?.expedition.characters[card.id]?'1 '+card.rarity[0].toUpperCase()+card.rarity.slice(1)+'-Shard':'Fahrzeugkarte'):''};
  }
  if(action!=='sync'&&(ok===false||JSON.stringify(a.state)===before))view.message ||= 'Aktion nicht möglich: Voraussetzungen oder Vorräte prüfen.';
  return {state:JSON.parse(JSON.stringify(a.state)),view:JSON.parse(JSON.stringify(view))};
}
module.exports={execute,session};
