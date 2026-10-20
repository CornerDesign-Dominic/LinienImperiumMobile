// Injected into the mobile VM after tour-runtime.js. No client-supplied prices or loot.
const PROCUREMENT_BASE_MS = 600000;
const PROCUREMENT_LOOT = [
  {id:'common',amount:5,chance:1},
  {id:'uncommon',amount:1,chance:.2},
  {id:'rare',amount:1,chance:.003},
  {id:'companyItems',amount:1,chance:.001}
];
function procurementState() {
  const state=game.procurement ||= {nextId:1,runs:[],completed:0,byRegion:Array(5).fill(0),pending:{common:0,uncommon:0,rare:0,companyItems:0},spent:0};
  state.groups ||= [];state.nextGroupId ||= 1;
  return state;
}
function procurementPrice(region) { return 8000 + 4000 * region; }
function procurementActive(truckId) { return procurementState().runs.find(r=>r.status==='active'&&r.truckId===truckId); }
function procurementSpeed(truck) {
  const fresh={...truck};delete fresh.bonusStats;
  return truckSpeed(fresh,0);
}
function procurementDuration(truck) {
  return Math.ceil(PROCUREMENT_BASE_MS / procurementSpeed(truck));
}
const beforeProcurementFreeTrucks=freeTrucks;
freeTrucks=()=>beforeProcurementFreeTrucks().filter(t=>!procurementActive(t.id));
const beforeProcurementRemove=removeCardFromGarage;
removeCardFromGarage=cardId=>{
  if(game.trucks.some(t=>t.cardId===cardId&&procurementActive(t.id)))return false;
  return beforeProcurementRemove(cardId);
};
function endProcurement(run,reason,at) {
  if(run.status!=='active')return;
  if(run.escrow>0)game.coins=round2(game.coins+run.escrow);
  run.escrow=0;run.status='finished';run.reason=reason;run.finishedAt=at;
  if(run.groupId)finishProcurementGroup(run.groupId,reason,at);
}
function beginProcurementTour(run,at) {
  const truck=truckById(run.truckId),p=procurementState();
  if(run.groupId)return beginProcurementGroupTour(run,at);
  if(!truck){endProcurement(run,'vehicle',at);return false;}
  if(run.stopAfter){endProcurement(run,'stopped',at);return false;}
  if(run.mode==='count'){
    if(run.started>=run.requested){endProcurement(run,'completed',at);return false;}
    run.escrow=round2(run.escrow-run.price);
  } else {
    if(game.coins-run.price<run.reserve){endProcurement(run,'reserve',at);return false;}
    game.coins=round2(game.coins-run.price);
  }
  run.started++;run.startedAt=at;run.durationMs=procurementDuration(truck);run.nextAt=at+run.durationMs;
  p.spent=round2(p.spent+run.price);
  return true;
}
function startProcurement(region,truckId,mode,amount) {
  const p=procurementState(),truck=truckById(truckId),r=game.expedition.regions[region];
  if(!r||!expeditionRegionCompleted(r))throw Error('Beschaffung noch nicht freigeschaltet.');
  if(!truck?.cardId||!game.expedition.characters[truck.cardId]||!freeTrucks().some(t=>t.id===truckId))throw Error('Fahrzeug für Beschaffung nicht verfügbar.');
  const price=procurementPrice(region);
  if(mode==='count'&&(!amount||game.coins<price*amount))throw Error('Nicht genügend Münzen für diese Tourenzahl.');
  if(mode==='reserve'&&game.coins-price<amount)throw Error('Reserve lässt keine weitere Tour zu.');
  const run={id:String(p.nextId++),region,truckId,model:truck.model,mode,price,requested:mode==='count'?amount:0,reserve:mode==='reserve'?amount:0,
    escrow:mode==='count'?price*amount:0,started:0,completed:0,status:'active',stopAfter:false,createdAt:Date.now()};
  if(mode==='count')game.coins=round2(game.coins-run.escrow);
  // Keep only the latest finished run per truck; counters and rewards are permanent.
  p.runs=p.runs.filter(old=>old.groupId||old.truckId!==truckId||old.status==='active');p.runs.push(run);
  beginProcurementTour(run,Date.now());
  mobileToast='Beschaffung gestartet.';return true;
}

function finishProcurementGroup(id,reason,at){
 const p=procurementState(),group=p.groups.find(g=>g.id===id);
 if(!group||group.status!=='active'||p.runs.some(r=>r.groupId===id&&r.status==='active'))return;
 if(group.escrow>0)game.coins=round2(game.coins+group.escrow);
 group.escrow=0;group.status='finished';group.finishedAt=at;group.reason=group.endReason||reason;
}
function beginProcurementGroupTour(run,at){
 const p=procurementState(),group=p.groups.find(g=>g.id===run.groupId),truck=truckById(run.truckId);
 if(!group||group.status!=='active'||!truck){endProcurement(run,'vehicle',at);return false;}
 if(group.stopAfter||run.stopAfter){endProcurement(run,'stopped',at);return false;}
 if(group.mode==='count'){
  if(group.started>=group.requested){endProcurement(run,'completed',at);return false;}
  group.escrow=round2(group.escrow-group.price);
 }else{
  if(game.coins-group.price<group.reserve){endProcurement(run,'reserve',at);return false;}
  game.coins=round2(game.coins-group.price);
 }
 group.started++;run.started++;run.startedAt=at;
 run.durationMs=procurementDuration(truck);run.nextAt=at+run.durationMs;
 p.spent=round2(p.spent+group.price);
 return true;
}
function startProcurementGroup(region,truckIds,mode,amount){
 const p=procurementState(),r=game.expedition.regions[region];
 if(!r||!expeditionRegionCompleted(r))throw Error('Beschaffung noch nicht freigeschaltet.');
 const free=new Set(freeTrucks().map(t=>t.id));
 const trucks=truckIds.map(id=>truckById(id));
 if(trucks.some(t=>!t?.cardId||!game.expedition.characters[t.cardId]||!free.has(t.id)))throw Error('Fahrzeug für Beschaffung nicht verfügbar.');
 const price=procurementPrice(region);
 if(mode==='count'&&(!amount||game.coins<price*amount))throw Error('Nicht genügend Münzen für diese Tourenzahl.');
 if(mode==='reserve'&&game.coins-price<amount)throw Error('Reserve lässt keine weitere Tour zu.');
 const at=Date.now(),group={id:'G'+p.nextGroupId++,region,mode,price,requested:mode==='count'?amount:0,reserve:mode==='reserve'?amount:0,
  escrow:mode==='count'?price*amount:0,started:0,completed:0,vehicleIds:[...truckIds],status:'active',stopAfter:false,createdAt:at};
 if(mode==='count')game.coins=round2(game.coins-group.escrow);
 p.groups.push(group);
 // Retain active groups and the latest twenty finished groups.
 const retained=new Set(p.groups.filter(g=>g.status==='active').concat(p.groups.filter(g=>g.status==='finished').slice(-20)).map(g=>g.id));
 p.groups=p.groups.filter(g=>retained.has(g.id));
 p.runs=p.runs.filter(run=>!run.groupId||retained.has(run.groupId));
 const runs=trucks.map(truck=>({id:String(p.nextId++),groupId:group.id,region,truckId:truck.id,model:truck.model,mode,price,
  requested:0,reserve:group.reserve,escrow:0,started:0,completed:0,status:'active',stopAfter:false,createdAt:at}));
 p.runs.push(...runs);
 for(const run of runs)beginProcurementTour(run,at);
 mobileToast='Beschaffung gestartet.';return true;
}
function stopProcurementGroup(id,immediate){
 const p=procurementState(),group=p.groups.find(g=>g.id===id&&g.status==='active');
 if(!group)throw Error('Beschaffung ist bereits beendet.');
 group.endReason=immediate?'cancelled':'stopped';
 if(immediate){
  for(const run of p.runs.filter(r=>r.groupId===id&&r.status==='active'))endProcurement(run,'cancelled',Date.now());
  mobileToast='Tour abgebrochen. Ungestartete Touren erstattet.';
 }else{
  group.stopAfter=true;
  for(const run of p.runs.filter(r=>r.groupId===id&&r.status==='active'))run.stopAfter=true;
  mobileToast='Beschaffung endet nach der laufenden Tour.';
 }
 return true;
}

function stopProcurement(id,immediate) {
  const run=procurementState().runs.find(r=>r.id===id&&r.status==='active');
  if(!run)throw Error('Beschaffung ist bereits beendet.');
  if(immediate){endProcurement(run,'cancelled',Date.now());mobileToast='Tour abgebrochen. Ungestartete Touren erstattet.';}
  else {run.stopAfter=true;mobileToast='Beschaffung endet nach der laufenden Tour.';}
  return true;
}
function claimProcurement() {
  const p=procurementState();
  if(!Object.values(p.pending).some(n=>n>0))return false;
  for(const rarity of ['common','uncommon','rare'])game.inventory.gears[rarity]+=p.pending[rarity];
  game.inventory.companyItems+=p.pending.companyItems;
  p.pending={common:0,uncommon:0,rare:0,companyItems:0};
  mobileToast='Beschaffungsbelohnungen abgeholt.';return true;
}
function finishProcurementTour(run,at) {
  const p=procurementState();
  run.completed++;p.completed++;p.byRegion[run.region]++;
  if(run.groupId){const group=p.groups.find(g=>g.id===run.groupId);if(group)group.completed++;}
  for(const loot of PROCUREMENT_LOOT)if(loot.chance===1||Math.random()<loot.chance)p.pending[loot.id]+=loot.amount;
  beginProcurementTour(run,at);
}
// Settle income only up to each procurement arrival. Later earnings cannot revive
// a reserve run that already ended. At ties, income is booked before new spending.
function settleProcurementTimeline(now) {
  const settle=at=>{settleTrips(at);settleFleetProjects(at);settleExpeditions(at);settleHub(at);settleEventTours(at);};
  while(true){
    const next=procurementState().runs.filter(r=>r.status==='active'&&r.nextAt<=now).sort((a,b)=>a.nextAt-b.nextAt||Number(a.id)-Number(b.id))[0];
    if(!next)break;
    const at=next.nextAt;settle(at);
    for(const run of procurementState().runs.filter(r=>r.status==='active'&&r.nextAt===at))finishProcurementTour(run,at);
  }
  settle(now);
}
function procurementView(now) {
  const p=procurementState();
  return {...p,loot:PROCUREMENT_LOOT,baseDurationMs:PROCUREMENT_BASE_MS,
    groups:p.groups.map(group=>({...group,vehicles:p.runs.filter(r=>r.groupId===group.id).map(r=>({...r,progress:r.status==='active'?Math.min(100,Math.max(0,(now-r.startedAt)/r.durationMs*100)):100}))})),
    sites:game.expedition.regions.map((r,region)=>({region,price:procurementPrice(region),unlocked:expeditionRegionCompleted(r),
      discovered:r.discovered,deliveries:r.deliveries.filter(Boolean).length,finalClaimed:r.finalClaimed,completed:p.byRegion[region]})),
    vehicles:game.trucks.filter(t=>t.cardId).map(t=>({id:t.id,model:t.model,cardId:t.cardId,capacity:t.capacity,speed:procurementSpeed(t),free:freeTrucks().some(f=>f.id===t.id),durationMs:procurementDuration(t)})),
    runs:p.runs.map(r=>({...r,progress:r.status==='active'?Math.min(100,Math.max(0,(now-r.startedAt)/r.durationMs*100)):100}))};
}
