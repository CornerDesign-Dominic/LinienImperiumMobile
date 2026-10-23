const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const file=path.resolve(__dirname,'../src/orderSelection.ts'),m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,file);
const {sortOrderVehicles}=m.exports,{execute}=require('../functions/src/engine.cjs');
const T=1800000000000,cmd=(state,action='sync',p={},at=T)=>execute(state,action,p,at,()=>.5);
function setup(){let r=cmd(null,'foundCompany',{companyName:'Auswahl',cityName:'Test'});r.state.coins=1000000;for(const id of ['r1_common_2','r2_common','r1_rare']){r.state.expedition.characters[id]={level:2,progress:0};r=cmd(r.state,'garageAdd',{id});}return r;}
const openRegion=r=>Object.assign(r.state.expedition.regions[0],{discovered:7,deliveries:Array(7).fill(true),endlessUnlocked:true,moduleAwarded:true,finalClaimed:true,customerUnlocked:true});
test('Order picker sorts profit descending or complete duration ascending, always keeping busy vehicles last',()=>{
 const choices=[{id:'a',free:true,totalProfit:10,seconds:100},{id:'b',free:false,totalProfit:999,seconds:1},{id:'c',free:true,totalProfit:100,seconds:200},{id:'d',free:true,totalProfit:100,seconds:150},{id:'e',free:true,totalProfit:-5,seconds:50}];
 assert.deepEqual(sortOrderVehicles(choices,'profit').map(q=>q.id),['d','c','a','e','b']);
 assert.deepEqual(sortOrderVehicles(choices,'speed').map(q=>q.id),['e','a','d','c','b']);assert.equal(choices[0].id,'a','sorting does not change input');
});
test('All suitable garage vehicles have authoritative quotes, including occupied vehicles; legacy free choices remain compatible',()=>{
 let r=setup();const first=r.view.state.orders.find(o=>o.status==='available'&&o.category==='national'),chosen=first.choices[0];r=cmd(r.state,'assign',{order:first.id,truck:chosen.id});
 const active=r.view.state.orders.find(o=>o.id===first.id),offer=r.view.state.orders.find(o=>o.status==='available'&&o.category==='national');
 assert.equal(offer.vehicleChoices.length,4);const busy=offer.vehicleChoices.find(q=>q.id===chosen.id);assert.equal(busy.free,false);assert.equal(busy.availableAt,active.runningEndsAt);assert.equal(busy.cardId,'navigator');assert.ok(busy.trips>0&&busy.seconds>0);
 assert.equal(offer.choices.some(q=>q.id===busy.id),false);
 for(const q of offer.choices){const full=offer.vehicleChoices.find(c=>c.id===q.id);assert.equal(full.free,true);for(const key of ['trips','seconds','totalProfit','cost','revenue'])assert.equal(full[key],q[key]);}
 const available=offer.vehicleChoices.find(q=>q.free),next=cmd(r.state,'assign',{order:offer.id,truck:available.id});const started=next.view.state.orders.find(o=>o.id===offer.id);assert.equal(started.status,'active');assert.ok(Math.abs(started.runningEndsAt-T-available.seconds*1000)<1);assert.equal(started.forecast.totalProfit,available.totalProfit);
});
test('Stored job picker forecasts the same tour count, test duration and coin reward as the mission that starts',()=>{
 let r=setup();openRegion(r);r.state.expedition.jobs.push({id:991,region:0,kind:'material',tier:2});r=cmd(r.state);const quote=r.view.jobChoices[991].find(q=>q.cardId==='r2_common');assert.equal(quote.trips,Math.ceil(40/quote.capacity));assert.equal(quote.seconds,15);assert.equal(quote.totalProfit,15);
 r=cmd(r.state,'mission',{region:0,kind:'endless',place:991,truck:quote.id});const mission=r.view.state.expedition.missions.find(m=>m.jobId===991);assert.equal(mission.transport.tours.length,quote.trips);assert.ok(Math.abs(mission.endsAt-T-quote.seconds*1000)<1);const before=r.state.coins;r=cmd(r.state,'sync',{},mission.endsAt+1);assert.equal(r.state.coins-before,quote.totalProfit);
});
test('Procurement availability counts the full fixed run and never advertises reserve or group next-tour times as free',()=>{
 for(const mode of ['count','reserve']){let r=setup();openRegion(r);const truck=r.state.trucks[0].id;r=cmd(r.state,'procurementStart',{region:0,truck,mode,amount:mode==='count'?3:1000});const run=r.view.procurement.runs.find(run=>run.truckId===truck),q=r.view.state.orders.find(o=>o.status==='available'&&o.category==='national').vehicleChoices.find(q=>q.id===truck);assert.equal(q.free,false);assert.equal(q.unavailableReason,'In Beschaffung');assert.equal(q.availableAt,mode==='count'?run.nextAt+(run.requested-run.started)*run.durationMs:null);}
});
test('Reserved replacement vehicles remain disabled until their assignment ends; the old vehicle frees after its current tour',()=>{
 let r=setup();const order=r.view.state.orders.find(o=>o.status==='available'&&o.category==='national'),old=r.state.trucks[0].id,replacement=r.state.trucks[1].id;r=cmd(r.state,'assign',{order:order.id,truck:old});r=cmd(r.state,'singleVehicle',{order:order.id,truck:replacement});const active=r.view.state.orders.find(o=>o.id===order.id),offer=r.view.state.orders.find(o=>o.status==='available'&&o.category==='national');assert.equal(active.pendingTruckId,replacement);const reserved=offer.vehicleChoices.find(q=>q.id===replacement),current=offer.vehicleChoices.find(q=>q.id===old);assert.equal(reserved.free,false);assert.equal(reserved.unavailableReason,'Reserviert');assert.equal(reserved.availableAt,active.runningEndsAt);assert.equal(current.availableAt,active.tripEndsAt);assert.equal(current.free,false);
});
test('Group procurement stays disabled without a misleading time for the end of its current tour',()=>{
 let r=setup();openRegion(r);const trucks=r.state.trucks.slice(0,2).map(t=>t.id);r=cmd(r.state,'procurementGroupStart',{region:0,trucks,mode:'count',amount:6});const offer=r.view.state.orders.find(o=>o.status==='available'&&o.category==='national');for(const id of trucks){const q=offer.vehicleChoices.find(q=>q.id===id);assert.equal(q.free,false);assert.equal(q.availableAt,null);assert.equal(q.unavailableReason,'In Beschaffung');}
});
