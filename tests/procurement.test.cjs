const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000,random=()=>.5;
const cmd=(state,action='sync',payload={},at=now,rng=random)=>execute(state,action,payload,at,rng);
function setup(){
 const out=cmd(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'});
 const state=out.state;state.expedition.characters.r4_common_2={level:1,progress:0};state.trucks[0].cardId='r4_common_2';state.trucks[0].model='Tee-Maultiergespann';state.coins=1000000;delete state.procurement;
 Object.assign(state.expedition.regions[0],{discovered:7,deliveries:Array(7).fill(true),endlessUnlocked:true,moduleAwarded:true,finalClaimed:true,customerUnlocked:true});
 return {state,truck:state.trucks[0].id};
}
const start=(state,truck,mode='count',amount=10,region=0)=>cmd(state,'procurementStart',{region,truck,mode,amount});
test('Unlock requires all discoveries, seven claimed deliveries, final claimed delivery and module, including old saves',()=>{
 const {state,truck}=setup();
 for(const [key,value] of [['discovered',6],['deliveries',[true,true,true,true,true,true,false]],['endlessUnlocked',false],['moduleAwarded',false],['finalClaimed',false]]){
  const copy=structuredClone(state);copy.expedition.regions[0][key]=value;
  assert.equal(cmd(copy).view.procurement.sites[0].unlocked,false);
  assert.throws(()=>start(copy,truck),/freigeschaltet/);
 }
 assert.equal(cmd(state).view.procurement.sites[0].unlocked,true);
 assert.equal(state.procurement,undefined);
 const p=cmd(state).view.procurement;assert.deepEqual(p.sites.map(s=>s.price),[8000,12000,16000,20000,24000]);
 assert.deepEqual(p.loot.map(l=>[l.id,l.amount,l.chance]),[['common',5,1],['uncommon',1,.2],['rare',1,.003],['companyItems',1,.001]]);
 assert.throws(()=>start(state,truck,'count',1,1),/freigeschaltet/);
});
test('Module moves to the first final-delivery claim and cannot be awarded twice; existing modules are retained',()=>{
 let {state,truck}=setup();Object.assign(state.expedition.regions[0],{moduleAwarded:false,finalClaimed:false,customerUnlocked:false});
 state.inventory.capacityModules=0;
 const mission={id:777,region:0,kind:'final',status:'completed',truckId:truck,startedAt:now-100,endsAt:now-1};state.expedition.missions.push(mission);
 let result=cmd(state,'claimMission',{id:777});assert.equal(result.state.inventory.capacityModules,1);assert.equal(result.view.procurement.sites[0].unlocked,true);
 result=cmd(result.state,'claimMission',{id:777});assert.equal(result.state.inventory.capacityModules,1);
 state.expedition.regions[0].moduleAwarded=true;state.inventory.capacityModules=3;
 assert.equal(cmd(state,'claimMission',{id:777}).state.inventory.capacityModules,3);
 const fresh=cmd(null,'start',{id:'hamburg'}).state;fresh.expedition.points=1000;
 let s=fresh;for(let i=0;i<30&&!s.expedition.regions[0].endlessUnlocked;i++)s=cmd(s,'discover',{region:0}).state;
 assert.equal(s.expedition.regions[0].endlessUnlocked,true);assert.equal(s.inventory.capacityModules,0);
});
test('Fixed count escrows all money, cannot overspend and returns only unstarted tours on immediate cancellation in tour seven',()=>{
 const {state,truck}=setup();state.coins=80000;
 assert.throws(()=>start(state,truck,'count',11),/Münzen/);
 let out=start(state,truck);assert.equal(out.state.coins,0);assert.equal(out.state.procurement.runs[0].escrow,72000);
 out=cmd(out.state,'procurementStop',{id:'1',immediate:true},now+6*600000+100);
 assert.equal(out.state.coins,24000);assert.equal(out.state.procurement.completed,6);assert.equal(out.state.procurement.spent,56000);
 assert.equal(out.state.procurement.pending.common,30);assert.equal(out.state.procurement.runs[0].reason,'cancelled');
 const again=cmd(out.state,'sync',{},now+86400000);assert.equal(again.state.coins,24000);assert.equal(again.state.procurement.completed,6);
});
test('Finish-current in tour seven retains the seventh reward and refunds tours eight through ten only at completion',()=>{
 const {state,truck}=setup();state.coins=80000;
 let out=start(state,truck);out=cmd(out.state,'procurementStop',{id:'1',immediate:false},now+6*600000+100);
 assert.equal(out.state.coins,0);assert.equal(out.state.procurement.completed,6);
 out=cmd(out.state,'sync',{},now+7*600000);assert.equal(out.state.coins,24000);assert.equal(out.state.procurement.completed,7);assert.equal(out.state.procurement.pending.common,35);
 assert.equal(out.view.state.trucks[0].free,true);
});
test('Offline fixed tours settle once; rewards accumulate across runs and claiming does not stop active tours',()=>{
 const {state,truck}=setup();const xp=state.xp,stats=structuredClone(state.stats);
 let out=start(state,truck,'count',6);out=cmd(out.state,'sync',{},now+3600000);
 assert.equal(out.state.procurement.completed,6);assert.equal(out.state.procurement.pending.common,30);assert.equal(out.state.xp,xp);assert.deepEqual(out.state.stats,stats);
 assert.equal(out.state.trucks[0].kmDriven,0);assert.equal(out.state.trucks[0].toursCompleted,0);
 out=cmd(out.state,'procurementStart',{region:0,truck,mode:'count',amount:2},now+3600000);
 out=cmd(out.state,'procurementClaim',{},now+3600000);assert.equal(out.state.inventory.gears.common,30);assert.equal(out.state.procurement.runs.at(-1).status,'active');
 out=cmd(out.state,'procurementClaim',{},now+3600000);assert.equal(out.state.inventory.gears.common,30);
 out=cmd(out.state,'sync',{},now+4800000);assert.equal(out.state.procurement.completed,8);assert.equal(out.state.procurement.pending.common,10);
 const same=cmd(JSON.parse(JSON.stringify(out.state)),'sync',{},now+4800000);assert.deepEqual(same.state.procurement,out.state.procurement);
});
test('Reserve spends per start, ends permanently before breaching reserve and requires manual restart',()=>{
 const {state,truck}=setup();state.coins=26000;
 let out=start(state,truck,'reserve',10000);assert.equal(out.state.coins,18000);
 out=cmd(out.state,'sync',{},now+1200000);assert.equal(out.state.coins,10000);assert.equal(out.state.procurement.completed,2);assert.equal(out.state.procurement.runs[0].reason,'reserve');
 out=cmd(out.state,'testCoins',{},now+1200000);out=cmd(out.state,'sync',{},now+86400000);assert.equal(out.state.procurement.completed,2);
 assert.throws(()=>start({...state,coins:17000},truck,'reserve',10000),/Reserve/);
});
test('Both stop actions work in reserve mode with no refund for the started tour',()=>{
 for(const immediate of [true,false]){
  const {state,truck}=setup();let out=start(state,truck,'reserve',0);
  out=cmd(out.state,'procurementStop',{id:'1',immediate},now+100);
  out=cmd(out.state,'sync',{},now+1200000);
  assert.equal(out.state.coins,992000);assert.equal(out.state.procurement.completed,immediate?0:1);assert.equal(out.state.procurement.runs[0].status,'finished');
 }
});
test('Garage exclusivity rejects duplicate procurement, orders, expedition, pending replacements and removal; fleets still run',()=>{
 const {state,truck}=setup();let out=start(state,truck,'count',2);
 assert.equal(out.view.state.trucks[0].free,false);assert.equal(out.view.state.trucks[0].procurementId,'1');
 assert.throws(()=>start(out.state,truck),/verfügbar/);
 const offer=out.state.orders[0];out=cmd(out.state,'assign',{order:offer.id,truck});assert.equal(out.state.orders.find(o=>o.id===offer.id).status,'available');
 out=cmd(out.state,'garageRemove',{id:'r4_common_2'});assert.equal(out.state.trucks.length,1);
 out=cmd(out.state,'mission',{region:0,kind:'final',truck,place:0});assert.equal(out.state.expedition.missions.length,0);
 out=cmd(out.state,'seat',{id:'r4_common_2',template:0,seat:0});assert.equal(out.state.expedition.seats[0],'r4_common_2');
 // Normal fleet projects use liveCardTruck independently of garage free flags.
 const queued={id:'P-test',kind:'special',category:'national',customer:'nordbau',status:'queued',distance:120,volume:400,baseVolume:400,delivered:0,routeType:'single',completionReward:null};
 out.state.orders.push(queued);out=cmd(out.state,'projectStart',{id:queued.id,template:0});assert.equal(out.state.orders.find(o=>o.id===queued.id).status,'active');
 assert.equal(out.state.procurement.runs[0].status,'active');
});
test('Current tour freezes speed; rank and donor changes only affect the following tour; capacity and economy bonuses do not matter',()=>{
 const {state,truck}=setup();let out=start(state,truck,'count',3);const end=out.state.procurement.runs[0].nextAt;
 out.state.inventory.gears.common=1000;
 out=cmd(out.state,'rank',{id:truck},now+100);assert.equal(out.state.procurement.runs[0].nextAt,end);
 out.state.trucks[0].capacity=99;out.state.company.workshopLevel=50;
 out=cmd(out.state,'sync',{},end);assert.equal(out.state.procurement.runs[0].durationMs,Math.ceil(600000/1.005));assert.equal(out.state.procurement.runs[0].price,8000);
 const pending=out.state.procurement.pending.common;assert.equal(pending,5);
 const max=setup();max.state.expedition.characters.r4_common_2={level:10};max.state.expedition.characters.r1_rare={level:10};
 max.state.trucks=[{id:'fast',cardId:'r4_common_2',transportVersion:1,tier:2,model:'Tee-Maultiergespann',capacity:99,rarityLevel:50},{id:'donor',cardId:'r1_rare',transportVersion:1,tier:3,model:'Silberhirsch-Gespann',capacity:8.5,rarityLevel:0}];
 const view=cmd(max.state).view.procurement;assert.equal(view.vehicles.find(v=>v.id==='fast').durationMs,444445);
 const fast=view.vehicles.find(v=>v.id==='fast');assert.equal(fast.capacity,99);assert.equal(fast.speed,1.35);assert.equal(fast.durationMs,Math.ceil(600000/fast.speed));
 assert.equal(out.view.procurement.vehicles.find(v=>v.id===truck).free,false);
});
test('Loot rolls are independent, no module/shard/XP side rewards, and budget inputs reject invalid values',()=>{
 const {state,truck}=setup();const before=structuredClone(state.inventory);
 let out=start(state,truck,'count',1);out=cmd(out.state,'sync',{},now+600000,()=>0);
 assert.deepEqual(out.state.procurement.pending,{common:5,uncommon:1,rare:1,companyItems:1});
 out=cmd(out.state,'procurementClaim',{},now+600000);assert.equal(out.state.inventory.capacityModules,before.capacityModules);assert.equal(out.state.inventory.companyItems,1);
 for(const amount of [-1,1.5,Infinity,NaN,'1',0])assert.throws(()=>start(state,truck,'count',amount));
 assert.throws(()=>start(state,'invented'));assert.throws(()=>start(state,truck,'invalid',1));
});
test('Income after reserve exhaustion cannot fund earlier tours; early income can fund subsequent tours',()=>{
 for(const early of [true,false]){
  const {state,truck}=setup();state.coins=8000;
  state.expedition.characters.r2_common={level:1};
  state.trucks.push({id:'income',cardId:'r4_common_2',transportVersion:1,tier:2,model:'income',capacity:100,rarityLevel:0,kmDriven:0,toursCompleted:0,ordersCompleted:0});
  const order=state.orders[0];Object.assign(order,{distance:early?200:600,volume:100,baseVolume:100,routeType:'single'});
  // Give loaded speed a positive value for this synthetic high-volume income trip.
  state.trucks[1].capacity=50;order.volume=order.baseVolume=50;
  let out=cmd(state,'assign',{order:order.id,truck:'income'});out=start(out.state,truck,'reserve',0);
  out=cmd(out.state,'sync',{},now+7200000);
  assert.ok(early?out.state.procurement.completed>1:out.state.procurement.completed===1);
  assert.ok(out.state.coins>=0);
 }
});
test('Full expedition workflow discovers, supplies and claims all eight places before unlocking procurement',()=>{
 let state=cmd(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'}).state;
 state.expedition.points=1000;state.coins=8000;
 for(let i=0;i<100&&!state.expedition.regions[0].endlessUnlocked;i++)state=cmd(state,'discover',{region:0}).state;
 const truck=state.trucks[0].id;let at=now;
 for(let place=0;place<7;place++){
  let out=cmd(state,'mission',{region:0,kind:'delivery',place,truck},at);
  const mission=out.state.expedition.missions.at(-1);at=mission.endsAt;
  out=cmd(out.state,'claimMission',{id:mission.id},at);state=out.state;
  assert.equal(out.view.procurement.sites[0].unlocked,false);
 }
 let out=cmd(state,'mission',{region:0,kind:'final',place:0,truck},at);const mission=out.state.expedition.missions.at(-1);at=mission.endsAt;
 out=cmd(out.state,'sync',{},at);assert.equal(out.view.procurement.sites[0].unlocked,false);
 out=cmd(out.state,'claimMission',{id:mission.id},at);assert.equal(out.view.procurement.sites[0].unlocked,true);assert.equal(out.state.inventory.capacityModules,1);
 out=cmd(out.state,'procurementStart',{region:0,mode:'count',amount:1,truck},at);assert.equal(out.state.coins,0);
});
test('Simultaneous reserve departures share funds without going negative; all regions share loot and cancelled tours never count',()=>{
 const {state,truck}=setup();state.coins=24000;
 state.expedition.characters.r2_common={level:1};state.trucks.push({id:'second',cardId:'r2_common',tier:2,model:'second',capacity:4,rarityLevel:0});
 // Remove the own speed bonus to force a simultaneous boundary for this fixture.
 state.trucks[1].cardId='r4_common_2';state.expedition.characters.r4_common_2={level:1};
 let out=start(state,truck,'reserve',0);out=cmd(out.state,'procurementStart',{region:0,truck:'second',mode:'reserve',amount:0});
 assert.equal(out.state.coins,8000);out=cmd(out.state,'sync',{},now+1200000);assert.equal(out.state.coins,0);assert.equal(out.state.procurement.completed,3);
 const second=setup();Object.assign(second.state.expedition.regions[4],second.state.expedition.regions[0]);
 out=start(second.state,second.truck,'count',1,4);assert.equal(out.state.coins,976000);out=cmd(out.state,'sync',{},now+600000,()=>0);
 assert.deepEqual(out.state.procurement.pending,{common:5,uncommon:1,rare:1,companyItems:1});assert.equal(out.state.procurement.byRegion[4],1);
});
test('A vehicle reserved as next single-order replacement cannot start procurement',()=>{
 const {state,truck}=setup();state.expedition.characters.r3_common={level:1};state.trucks.push({id:'replacement',cardId:'r3_common',tier:3,model:'replacement',capacity:8.5,rarityLevel:0});
 const order=state.orders[0];let out=cmd(state,'assign',{order:order.id,truck});
 out=cmd(out.state,'singleVehicle',{order:order.id,truck:'replacement'});
 assert.equal(out.state.orders.find(o=>o.id===order.id).pendingTruckId,'replacement');
 assert.throws(()=>start(out.state,'replacement'),/verfügbar/);
});
