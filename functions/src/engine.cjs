'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../vendor/web-game.js'), 'utf8');
const boundary = source.indexOf("  document.addEventListener('click'");
if (boundary < 0) throw Error('Web engine boundary missing');
const bridge = `
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
  globalThis.mobile = {
    get state() { return game; }, set state(value) { game = value; },
    newGame, save, loadGame, settleTrips, settleFleetProjects, settleExpeditions, settleHub,
    autoRefreshOrders, regenerateExpedition, regenerateOvertime,
    chooseStartCity, addCardToGarage, removeCardFromGarage, assignCharacterSeat,
    giveCharacterShard, combineExpeditionShards, buyTruck, upgradeTruckRarity,
    upgradeTruckCapacity, assignOrder, assignCraftedOrder, assignPrivatePickup,
    startFleetProject, spendOvertime, useOvertimeRefill, claimOrderReward,
    discoverExpeditionPlace, drawExpeditionJob, startExpeditionMission, claimExpeditionMission,
    buyHub, toggleHubTruck, collectHub, startHubUpgrade, combinePickupHints, craftCustomerOrder,
    unlockDepartment, upgradeWorkshop, upgradeSales, upgradeOfferLimit, upgradeTransport,
    allocateCustomerSkill, toggleOrderPin, manualRefreshOrders, applyOrderReward,
    removeSeat(template, seat) { const slots = fleetTemplate(template); if (slots) slots[seat] = null; },
    allocateLevel(expedition) { levelAllocation = { expedition, overtime: 5 - expedition }; return confirmLevelUpAllocation(); },
    sell(id) { if (!openSaleDialog(id)) return false; return confirmSale(); },
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
        return { ...o, isProject: project,
          customerName: o.customer ? customerById(o.customer)?.name : 'Freie Frachtbörse',
          choices: !project && ['available','queued'].includes(o.status) ? eligibleFreeTrucks(o).map(t=>({id:t.id, model:t.model, capacity:t.capacity, seconds:orderDuration(o,t), ...orderEconomics(o,t)})) : [],
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
          capacityLevel:truck.moduleCapacityLevel || 0, maxCapacityLevel:TRUCKS[card.vehicleTier].maxCapacityLevel}];
      }));
      return {state: {...game,trucks,orders}, serverTime:now, catalog, cardVehicles,
        level:levelForXp(game.xp,game), expeditionCapacity:expeditionCapacity(),
        templates:[0,1,2].map(i=>fleetTemplate(i)),
        cardBonuses:Object.fromEntries(EXPEDITION_CHARACTERS.map(c=>[c.id,cardBonusValue(c)])),
        openRegions:EXPEDITION_REGIONS.map((_,i)=>expeditionRegionOpen(i)),
        expeditionMap:game.expedition.regions.map((region,index)=>({
          index, name:EXPEDITION_REGIONS[index], customer:customerById(EXPEDITION_CUSTOMER_IDS[index]),
          open:expeditionRegionOpen(index), discovered:region.discovered,
          deliveries:region.deliveries.filter(Boolean).length, finalClaimed:region.finalClaimed,
          progress:(region.discovered + region.deliveries.filter(Boolean).length + Number(region.finalClaimed))/15*100,
          places:Array.from({length:7},(_,place)=>({index:place,discoveryCost:expeditionDiscoveryCost(index,place),durationMs:expeditionDuration(index,'delivery',place)})),
          finalDurationMs:expeditionDuration(index,'final')
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
const compiled = new vm.Script(source.slice(0,boundary) + bridge, {filename:'web-engine.cjs'});
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
  api.settleTrips(now);api.settleFleetProjects(now);api.settleExpeditions(now);api.settleHub(now);
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
    sync:()=>{},start:()=>a.chooseStartCity(id(p.id)),foundCompany:()=>a.foundCompany(companyProfile(p)),
    garageAdd:()=>a.addCardToGarage(id(p.id)),garageRemove:()=>a.removeCardFromGarage(id(p.id)),
    seat:()=>a.assignCharacterSeat(id(p.id),num(p.seat,4),num(p.template,2)),
    unseat:()=>a.removeSeat(num(p.template,2),num(p.seat,4)),
    cardUpgrade:()=>a.giveCharacterShard(id(p.id),true),shardCombine:()=>a.combineExpeditionShards(choice(p.rarity,['common','uncommon'])),
    buyTruck:()=>a.buyTruck(num(p.model,1)),rank:()=>a.upgradeTruckRarity(id(p.id)),capacity:()=>a.upgradeTruckCapacity(id(p.id)),sell:()=>a.sell(id(p.id)),
    assign:()=>a.assignOrder(id(p.order),id(p.truck)),assignPrivate:()=>a.assignPrivatePickup(id(p.order),id(p.truck)),assignCrafted:()=>a.assignCraftedOrder(id(p.order),id(p.truck)),
    projectStart:()=>a.startFleetProject(id(p.id),num(p.template,2)),overtime:()=>a.spendOvertime(id(p.id),choice(p.amount,[1,5,10])),refill:()=>a.useOvertimeRefill(),
    claim:()=>a.claimOrderReward(id(p.id)),claimAll:()=>{for(const order of a.state.orders)a.applyOrderReward(order);},
    discover:()=>a.discoverExpeditionPlace(num(p.region,4)),draw:()=>a.drawExpeditionJob(num(p.region,4)),
    mission:()=>a.startExpeditionMission(num(p.region,4),choice(p.kind,['delivery','final','endless']),id(p.truck),num(p.place)),
    claimMission:()=>a.claimExpeditionMission(num(p.id)),
    buyHub:()=>a.buyHub(),hubTruck:()=>a.toggleHubTruck(id(p.id)),hubCollect:()=>a.collectHub(),hubUpgrade:()=>a.startHubUpgrade(),
    pickupCraft:()=>a.combinePickupHints(),customerCraft:()=>a.craftCustomerOrder(),
    department:()=>a.unlockDepartment(choice(p.id,['dispatch','workshop','sales'])),
    companyOffers:()=>a.upgradeOfferLimit(),companyWorkshop:()=>a.upgradeWorkshop(),companySales:()=>a.upgradeSales(),
    transport:()=>a.upgradeTransport(choice(p.category,['national','international']),choice(p.kind,['premium','volume','range'])),
    customerSkill:()=>a.allocateCustomerSkill(id(p.id),choice(p.kind,['pay','special','referral'])),
    pin:()=>a.toggleOrderPin(id(p.id)),refresh:()=>a.manualRefreshOrders(),level:()=>a.allocateLevel(num(p.expedition,5)),
    testCoins:()=>a.grantTestCoins(),testGrant:()=>a.grantTestResource(choice(p.kind,['expedition','overtime','xp']),choice(p.amount,p.kind==='xp'?[100,1000]:[100])),reset:()=>a.reset()
  };
  if(!Object.hasOwn(calls,action))throw Error('Unbekannte Aktion');
  if(!a.state.startCity&&!['sync','start','foundCompany','reset'].includes(action))throw Error('Bitte zuerst deine Firma gründen.');
  const ok=calls[action]();
  const view=a.view();
  if(action!=='sync'&&(ok===false||JSON.stringify(a.state)===before))view.message ||= 'Aktion nicht möglich: Voraussetzungen oder Vorräte prüfen.';
  return {state:JSON.parse(JSON.stringify(a.state)),view:JSON.parse(JSON.stringify(view))};
}
module.exports={execute,session};
