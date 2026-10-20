// Injected into the mobile VM after tour-runtime.js. No client-supplied prices or loot.
const PROCUREMENT_BASE_MS = 600000;
const PROCUREMENT_LOOT = [
  {id:'common',amount:5,chance:1},
  {id:'uncommon',amount:1,chance:.2},
  {id:'rare',amount:1,chance:.003},
  {id:'companyItems',amount:1,chance:.001}
];
function procurementState() {
  return game.procurement ||= {nextId:1,runs:[],completed:0,byRegion:Array(5).fill(0),pending:{common:0,uncommon:0,rare:0,companyItems:0},spent:0};
}
function procurementPrice(region) { return 8000 + 4000 * region; }
function procurementActive(truckId) { return procurementState().runs.find(r=>r.status==='active'&&r.truckId===truckId); }
function procurementDuration(truck) {
  const fresh={...truck};delete fresh.bonusStats;
  return Math.ceil(PROCUREMENT_BASE_MS / truckSpeed(fresh,0));
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
}
function beginProcurementTour(run,at) {
  const truck=truckById(run.truckId),p=procurementState();
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
  p.runs=p.runs.filter(old=>old.truckId!==truckId||old.status==='active');p.runs.push(run);
  beginProcurementTour(run,Date.now());
  mobileToast='Beschaffung gestartet.';return true;
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
    sites:game.expedition.regions.map((r,region)=>({region,price:procurementPrice(region),unlocked:expeditionRegionCompleted(r),
      discovered:r.discovered,deliveries:r.deliveries.filter(Boolean).length,finalClaimed:r.finalClaimed,completed:p.byRegion[region]})),
    vehicles:game.trucks.filter(t=>t.cardId).map(t=>({id:t.id,model:t.model,cardId:t.cardId,free:freeTrucks().some(f=>f.id===t.id),durationMs:procurementDuration(t)})),
    runs:p.runs.map(r=>({...r,progress:r.status==='active'?Math.min(100,Math.max(0,(now-r.startedAt)/r.durationMs*100)):100}))};
}
