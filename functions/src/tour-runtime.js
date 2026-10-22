// Runs inside the vendor engine's lexical scope. Every tour owns immutable timing
// and accounting; only the next tour reads live vehicle and bonus values.
function liveCardTruck(cardId) {
  const card = vehicleCardById(cardId), owned = game.expedition.characters[cardId];
  if (!card || !owned) return null;
  const truck = game.trucks.find(t => t.cardId === cardId) || owned.parkedTruck || createCardTruck(card);
  const copy = {...truck}; delete copy.bonusStats;
  return copy;
}
function tourVehicle(truck, mode, members = []) {
  const copy = {...truck}; delete copy.bonusStats;
  const stats = cardBonusStats(copy, mode);
  if (mode === 'fleet') for (const member of members) {
    const card = vehicleCardById(member.cardId);
    if (card?.scope === 'fleet') stats[card.stat] += cardBonusValue(card);
  }
  return {...copy, bonusStats: {...stats}};
}
function tourAccounting(order, truck, cargo) {
  return {...tourEconomics(order, truck, cargo, order.delivered || 0),
    xp: cargo * paidLegs(order) * (1 + activeCardBonus(truck, 'xp') / 100),
    km: order.distance * drivenLegs(order), tons: cargo * paidLegs(order)};
}

// Slots are stable even while a template is reordered. A card still driving in
// another slot cannot be started twice. Cross-swaps wait for both old tours.
function refreshFleetMembers(project) {
  const desired = fleetTemplate(project.template) || Array(5).fill(null);
  const occupied=new Set(project.vehicles.filter(v=>Number.isInteger(v.slot)).map(v=>v.slot));
  for(const v of project.vehicles.filter(v=>v.slot==null)){
    const desiredSlot=desired.indexOf(v.cardId);
    v.slot=desiredSlot>=0&&!occupied.has(desiredSlot)?desiredSlot:[0,1,2,3,4].find(slot=>!occupied.has(slot));
    occupied.add(v.slot);
  }
  for (let slot = 0; slot < 5; slot++) if (!project.vehicles.some(v => v.slot === slot))
    project.vehicles.push({slot, cardId: null, cargo: 0, nextAt: null});
  for (const v of project.vehicles) if (!v.cargo && v.cardId !== desired[v.slot]) {
    const slot = v.slot;
    Object.keys(v).forEach(key => delete v[key]);
    Object.assign(v, {slot, cardId: null, cargo: 0, nextAt: null});
  }
  const used = new Set(project.vehicles.filter(v => v.cargo > 0).map(v => v.cardId));
  for (const v of project.vehicles.filter(v => !v.cargo)) {
    const next = desired[v.slot], fresh = next && !used.has(next) ? liveCardTruck(next) : null;
    if (!fresh) { v.cardId = null; continue; }
    Object.assign(v, fresh, {slot: v.slot, cargo: 0, nextAt: null});
    used.add(next);
  }
  return project.vehicles.filter(v => v.cardId);
}
const originalProjectFleetVehicles = projectFleetVehicles;
projectFleetVehicles = template => originalProjectFleetVehicles(template)?.map(v => ({...v, slot: fleetTemplate(template).indexOf(v.cardId)})) || null;
fillProjectTrips = (order, at) => {
  const members = refreshFleetMembers(order.project);
  let remaining = Math.max(0, order.volume - order.delivered - members.reduce((sum, v) => sum + (v.cargo || 0), 0));
  for (const v of members) {
    if (v.cargo || remaining <= 1e-9) continue;
    const fresh = tourVehicle(liveCardTruck(v.cardId), 'fleet', members);
    Object.assign(v, fresh);
    v.cargo = Math.min(v.capacity, remaining); v.tripCargo = v.cargo; v.tripDelivered = 0;
    v.tripAccounting = tourAccounting(order, v, v.cargo);
    v.tripStartedAt = at;
    v.nextAt = at + tourSeconds(order, v, v.cargo) * 1000;
    remaining -= v.cargo;
  }
};
function projectProjection(order, now = Date.now()) {
  const copy = JSON.parse(JSON.stringify(order));
  const pending={revenue:0,cost:0,xp:0};
  // Queued previews have no template on older view models.
  if (copy.project.template == null) {
    const ids = copy.project.vehicles.map(v => v.cardId);
    copy.project.template = [0,1,2].find(i => JSON.stringify((fleetTemplate(i)||[]).filter(Boolean)) === JSON.stringify(ids)) ?? 0;
  }
  let count = 0;
  while (copy.delivered < copy.volume - 1e-9 && count++ < 100000) {
    fillProjectTrips(copy, now);
    const next = copy.project.vehicles.filter(v => v.cargo > 0).sort((a,b) => a.nextAt - b.nextAt || a.slot - b.slot)[0];
    if (!next) return {eta:null,feasible:false,...pending};
    now = next.nextAt;
    for(const arrived of copy.project.vehicles.filter(v=>v.cargo>0&&v.nextAt===now)){
      const totals=arrived.tripAccounting,original=arrived.tripCargo||arrived.cargo,before=arrived.tripDelivered||0;
      if(totals)for(const key of ['revenue','cost','xp'])pending[key]=round2(pending[key]+totals[key]-round2(totals[key]*before/original));
      copy.delivered += Math.min(arrived.cargo, copy.volume - copy.delivered);
      arrived.cargo = 0; arrived.nextAt = null;
    }
  }
  return {eta:copy.delivered>=copy.volume-1e-9?now:null,feasible:copy.delivered>=copy.volume-1e-9,...pending};
}
projectEstimatedEnd = (order, now = Date.now()) => projectProjection(order,now).eta ?? Infinity;
const originalBookProjectDelivery=bookProjectDelivery;
bookProjectDelivery=(order,vehicle,cargo)=>{
  const before={revenue:game.stats.grossRevenue,cost:game.stats.operatingCosts,xp:game.xp};
  originalBookProjectDelivery(order,vehicle,cargo);
  order.bookedTransport ||= {revenue:0,cost:0,xp:0};
  for(const key of ['revenue','cost','xp']){
    const after=key==='xp'?game.xp:key==='cost'?game.stats.operatingCosts:game.stats.grossRevenue;
    order.bookedTransport[key]=round2(order.bookedTransport[key]+after-before[key]);
  }
};
settleFleetProjects=(now=Date.now())=>{
  let changed=false;
  for(const order of game.orders){
    if(order.status!=='active'||!order.project)continue;
    const deadline=order.project.deadlineAt;
    while(order.status==='active'){
      const next=order.project.vehicles.filter(v=>v.cargo>0).sort((a,b)=>a.nextAt-b.nextAt)[0];
      if(!next||next.nextAt>Math.min(now,deadline))break;
      const at=next.nextAt;
      // All arrivals at the same instant are completed before any next start,
      // so donor activation never depends on array/slot iteration order.
      for(const v of order.project.vehicles.filter(v=>v.cargo>0&&v.nextAt===at))bookProjectDelivery(order,v,v.cargo);
      changed=true;
      if(order.delivered>=order.volume-1e-9){finishFleetProject(order,at);break;}
      fillProjectTrips(order,at);
    }
    if(order.status==='active'&&now>=deadline){
      order.status='failed';order.project.vehicles.forEach(v=>{v.cargo=0;v.nextAt=null;});changed=true;
    }
  }
  if(changed)save();return changed;
};
const originalOvertimeDelivery=overtimeDelivery;
overtimeDelivery=(order,amount)=>{
  const delivery=originalOvertimeDelivery(order,amount);
  if((fleetTemplate(order.project.template)||[]).some(id=>id&&liveCardTruck(id)))return delivery;
  const cargo=order.project.vehicles.reduce((sum,v)=>sum+(v.cargo||0),0);
  const points=Math.min(delivery.points,Math.ceil(cargo*order.distance/OVERTIME_TKM_PER_POINT));
  return {points,tons:Math.min(cargo,points*OVERTIME_TKM_PER_POINT/order.distance)};
};

function beginSingleTour(order, truck, at) {
  const vehicle = tourVehicle(truck, 'single');
  const cargo = Math.min(vehicle.capacity, order.volume - order.delivered);
  order.tripCargo = cargo; order.tripStartAt = at;
  order.tripSnapshot = {vehicle, cargo, endsAt: at + tourSeconds(order, vehicle, cargo) * 1000,
    accounting: tourAccounting(order, vehicle, cargo)};
}
function ensureSingleTour(order) {
  if (!order.tripSnapshot) {
    const truck = truckById(order.truckId);
    if (truck) {
      // Legacy active tours keep their original load and start; no retroactive awards.
      const cargo = order.tripCargo;
      beginSingleTour(order, truck, order.tripStartAt);
      if (cargo != null && cargo !== order.tripCargo) {
        order.tripCargo = cargo; order.tripSnapshot.cargo = cargo;
        order.tripSnapshot.endsAt = order.tripStartAt + tourSeconds(order, order.tripSnapshot.vehicle, cargo)*1000;
        order.tripSnapshot.accounting = tourAccounting(order, order.tripSnapshot.vehicle, cargo);
      }
    }
  }
}
const originalFreeTrucks = freeTrucks;
freeTrucks = () => originalFreeTrucks().filter(t => !game.orders.some(o => o.status === 'active' && o.pendingTruckId === t.id));
const originalRemoveCard = removeCardFromGarage;
removeCardFromGarage = cardId => {
  if (game.orders.some(o => o.status === 'active' && truckById(o.pendingTruckId)?.cardId === cardId)) return false;
  return originalRemoveCard(cardId);
};
function queueSingleVehicle(orderId, truckId) {
  const order = game.orders.find(o => o.id === orderId && o.status === 'active' && !o.project);
  if (!order) throw Error('Einzelauftrag ist nicht aktiv.');
  if (truckId === order.truckId) { delete order.pendingTruckId; return true; }
  const truck = truckById(truckId);
  if (!truck || !canTruckTakeOrder(truck, order) ||
      (!freeTrucks().some(t => t.id === truckId) && order.pendingTruckId !== truckId))
    throw Error('Das Ersatzfahrzeug ist nicht frei oder nicht geeignet.');
  order.pendingTruckId = truckId;
  return true;
}
function finishSingleTourOrder(order, truck, at) {
  order.status = 'completed'; order.completedAt = at; order.tripStartAt = null; order.tripCargo = null;
  delete order.tripSnapshot; delete order.pendingTruckId;
  if (order.customer && !order.trustAwarded) {
    game.customerTrust[order.customer] = (game.customerTrust[order.customer] || 0) + (TRUST_REWARDS[order.kind] || 0);
    order.trustAwarded = true;
  }
  const itemProgress = companyItemProgress(order);
  game.inventory.companyItemTkmRemainder = itemProgress.remainder;
  order.completionReward = makeCompletionReward(order, itemProgress.items);
  const rules = SPECIAL_CHANCES[order.category];
  if (rules && order.customer && order.kind === 'normal' && Math.random() < customerTripChance(order, 'award')) queueCustomerTrip(order, 'special');
  if (rules && order.customer && order.kind === 'special' && Math.random() < customerTripChance(order, 'referral')) queueCustomerTrip(order, 'referral');
  game.completed++; if (truck) truck.ordersCompleted = (truck.ordersCompleted || 0) + 1;
}
settleTrips = now => {
  let changed = false;
  for (const order of game.orders) {
    if (order.status !== 'active' || order.project) continue;
    ensureSingleTour(order);
    while (order.status === 'active' && order.tripSnapshot?.endsAt <= now) {
      const snapshot = order.tripSnapshot, at = snapshot.endsAt, totals = snapshot.accounting;
      const truck = truckById(order.truckId);
      game.coins = round2(game.coins + totals.revenue - totals.cost);
      game.stats.grossRevenue = round2(game.stats.grossRevenue + totals.revenue);
      game.stats.operatingCosts = round2(game.stats.operatingCosts + totals.cost);
      game.stats.trips++; game.stats.tons += totals.tons; game.stats.km += totals.km;
      game.stats.tonKm += totals.tons * order.distance;
      awardTransportXp(totals.xp);
      if (truck) { truck.kmDriven = (truck.kmDriven || 0) + totals.km; truck.toursCompleted = (truck.toursCompleted || 0) + 1; }
      order.bookedTransport ||= {revenue:0,cost:0,xp:0};
      for (const key of ['revenue','cost','xp']) order.bookedTransport[key] = round2(order.bookedTransport[key] + totals[key]);
      order.delivered = Math.min(order.volume, order.delivered + snapshot.cargo);
      changed = true;
      if (order.delivered >= order.volume - 1e-9) { finishSingleTourOrder(order, truck, at); break; }
      if (order.pendingTruckId) { order.truckId = order.pendingTruckId; delete order.pendingTruckId; }
      const next = truckById(order.truckId);
      if (!next) throw Error('Eingesetztes Fahrzeug fehlt.');
      beginSingleTour(order, next, at);
    }
  }
  if (changed) { replenishOrders(); save(); }
  return changed;
};
remainingOrderSeconds = (order, truck, now = Date.now()) => {
  if (!order || order.status !== 'active') return 0;
  ensureSingleTour(order);
  const snapshot = order.tripSnapshot;
  if (!snapshot) return 0;
  const future = tourVehicle(truckById(order.pendingTruckId) || truck, 'single');
  const rest = Math.max(0, order.volume - order.delivered - snapshot.cargo);
  return Math.max(0, (snapshot.endsAt - now)/1000) + orderDuration({...order,volume:rest,delivered:0},future);
};
function singleForecast(order) {
  ensureSingleTour(order);
  const snapshot = order.tripSnapshot;
  const next = tourVehicle(truckById(order.pendingTruckId) || truckById(order.truckId), 'single');
  const rest = Math.max(0, order.volume-order.delivered-snapshot.cargo);
  const future = orderEconomics({...order,volume:rest,delivered:0},next);
  const booked = order.bookedTransport || {revenue:0,cost:0,xp:0};
  const revenue=round2(booked.revenue+snapshot.accounting.revenue+future.revenue);
  const cost=round2(booked.cost+snapshot.accounting.cost+future.cost),bonus=completionPremium(order);
  return {...future,id:next.id,model:next.model,capacity:next.capacity,revenue,cost,bonus,
    transportProfit:round2(revenue-cost),totalProfit:round2(revenue-cost+bonus),
    xp:round2(booked.xp+snapshot.accounting.xp+rest*paidLegs(order)*(1+next.bonusStats.xp/100)),
    seconds:remainingOrderSeconds(order,truckById(order.truckId))};
}

// Transport missions also keep the already-started tour. Only their forecast
// tail is rebuilt. Fixed-duration discovery missions have no vehicle tour.
function refreshMissionPlan(mission) {
  const t=mission.transport,index=t.completedTours,current=t.tours[index],truck=truckById(mission.truckId);
  if(!current||!truck)return;
  const vehicle=tourVehicle(truck,'garage'),route={distance:EXPEDITION_JOB_DISTANCE,routeType:'single'};
  mission.tourTimeScale ??= (current.endsAt-current.startsAt)/(tourSeconds(route,vehicle,current.cargo)*1000);
  let remaining=Math.max(0,t.volume-t.delivered-current.cargo),at=current.endsAt;
  const tail=[];
  while(remaining>1e-9){
    const cargo=Math.min(vehicle.capacity,remaining),endsAt=at+tourSeconds(route,vehicle,cargo)*1000*mission.tourTimeScale;
    tail.push({cargo,startsAt:at,endsAt});remaining-=cargo;at=endsAt;
  }
  t.tours=t.tours.slice(0,index+1).concat(tail);mission.endsAt=at;
}
const originalSettleExpeditions=settleExpeditions;
settleExpeditions=(now=Date.now())=>{
  for(const mission of game.expedition.missions){
    if(mission.status!=='active'||!mission.transport)continue;
    refreshMissionPlan(mission);
    const t=mission.transport;
    while(t.tours[t.completedTours]?.endsAt<=now){
      const current=t.tours[t.completedTours];
      t.delivered=round2(t.delivered+current.cargo);t.completedTours++;
      if(t.delivered>=t.volume-1e-9)break;
      refreshMissionPlan(mission);
    }
  }
  return originalSettleExpeditions(now);
};

function eventTourSnapshot(project,v,members,at) {
 const fresh=tourVehicle(liveCardTruck(v.cardId),'fleet',members),order={distance:project.distance,routeType:'single',project,delivered:project.delivered};
 const cycleMs=Math.max(1,Math.ceil(tourSeconds(order,fresh,fresh.capacity)*1000)),accounting=tourAccounting(order,fresh,fresh.capacity);
 return {...fresh,slot:v.slot,cargo:fresh.capacity,tripCargo:fresh.capacity,cycleMs,tripStartedAt:at,nextAt:at+cycleMs,
  arrivalAt:at+Math.ceil(tripSeconds(order,fresh,fresh.capacity)*1000),deliveredTrip:false,tripAccounting:accounting,
  tourConfig:JSON.stringify([fresh.cardId,fresh.capacity,fresh.rarityLevel,fresh.bonusStats,cycleMs,accounting])};
}
function migrateEventTours(p){
 if(p.tourVersion===2)return;
 p.tourVersion=2;
 p.vehicles.forEach((v,i)=>Object.assign(v,{slot:v.slot??i,cargo:v.capacity,tripCargo:v.capacity,tripStartedAt:v.nextAt-v.cycleMs,
  arrivalAt:v.nextAt-v.cycleMs+Math.ceil(tripSeconds({distance:p.distance,routeType:'single'},v,v.capacity)*1000),deliveredTrip:false}));
}
function startIdleEventTours(project,at){const members=refreshFleetMembers(project);for(const v of members)if(!v.cargo)Object.assign(v,eventTourSnapshot(project,v,members,at));}
function settleEventTours(now=Date.now()){
 for(const event of Object.values(game.eventTests||{})){
  const p=event.project;if(event.status!=='running'||!p)continue;
  const until=Math.min(now,event.endsAt??Infinity);migrateEventTours(p);
  const deliver=(v,count=1)=>{p.delivered+=count*v.cargo;p.tonKm+=count*v.cargo*p.distance;};
  while(true){
   const members=p.vehicles.filter(v=>v.cardId),desired=fleetTemplate(p.template)||[];
   const stable=members.length===desired.filter(Boolean).length&&members.every(v=>v.cargo>0&&desired[v.slot]===v.cardId&&v.tourConfig===eventTourSnapshot(p,v,members,v.tripStartedAt).tourConfig);
   if(stable){
    for(const v of members){
     const count=Math.max(0,Math.floor((until-v.nextAt)/v.cycleMs)+1);
     const arrivals=count+(v.arrivalAt+count*v.cycleMs<=until?1:0)-(v.deliveredTrip?1:0);
     if(arrivals>0)deliver(v,arrivals);
     p.km+=count*p.distance*2;p.tours+=count;
     v.nextAt+=count*v.cycleMs;v.arrivalAt+=count*v.cycleMs;v.tripStartedAt=v.nextAt-v.cycleMs;v.deliveredTrip=v.arrivalAt<=until;
    }break;
   }
   const at=Math.min(...members.filter(v=>v.cargo>0).map(v=>v.deliveredTrip?v.nextAt:v.arrivalAt));
   if(!Number.isFinite(at)||at>until)break;
   for(const v of members.filter(v=>v.cargo>0&&!v.deliveredTrip&&v.arrivalAt<=at)){deliver(v);v.deliveredTrip=true;}
   for(const v of members.filter(v=>v.cargo>0&&v.nextAt<=at)){p.km+=p.distance*2;p.tours++;v.cargo=0;v.nextAt=null;}
   if(at<until||at<(event.endsAt??Infinity))startIdleEventTours(p,at);
  }
 }
}
function refreshTourStarts(now = Date.now()) {
  for (const order of game.orders) if (order.status==='active') {
    if (order.project) fillProjectTrips(order,now);
    else ensureSingleTour(order);
  }
  for(const mission of game.expedition.missions)if(mission.status==='active'&&mission.transport)refreshMissionPlan(mission);
  for (const event of Object.values(game.eventTests||{})) if(event.status==='running'&&event.project) {
    const p=event.project;
    migrateEventTours(p);
    startIdleEventTours(p,now);
  }
}
