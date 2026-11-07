const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {execute}=require('../functions/src/engine.cjs');
const format=(v,d=0)=>Number(v||0).toLocaleString('de-DE',{maximumFractionDigits:d});
const ui={C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',n:format};
const measure=componentHarness('courierDisplay.ts',{'./ui':ui}).exports.courierMeasure;
const now=1800000000000,run=(s,a='sync',p={},at=now)=>execute(s,a,p,at,()=>.5);
function fixture(){let out=run(null,'start',{id:'hamburg'});out.state.xp=50*30*29;out.state.coins=1e7;out=run(out.state,'buyHub');for(let i=0;i<5;i++)out=run(out.state,'hubVehicleBuy');return out;}
function vehiclesHarness(){return componentHarness('HubVehicles.tsx',{'./ui':ui,'../assets/art/hub/locked-slot.png':1,'./HubSales':{HubSales:'HubSales'},'./HubCrateCard':{HubCrateCard:'HubCrateCard'},'./HubVehicleDetail':{HubVehicleDetail:'HubVehicleDetail'},'./HubEarnings':{HubEarnings:'HubEarnings'}});}
test('Courier-specific formatter uses display scales only: speed/distance unchanged, carrying amount times ten',()=>{
 assert.equal(measure(1.3,'speed'),'1,3 m/s');assert.equal(measure(3,'capacity'),'30 kg');assert.equal(measure(2,'capacity'),'20 kg');assert.equal(measure(100,'distance'),'100 m');assert.equal(measure(3.2,'capacity'),'32 kg');
});
test('Courier cards, recruiting and both upgrade previews consistently show kg and m/s without changing commands',async()=>{
 const data=fixture().view,truck=data.state.trucks.find(t=>!t.cardId);truck.capacity=3;truck.speed=1.3;truck.hubUpgrades.capacity.current=3;truck.hubUpgrades.capacity.next=3.2;truck.hubUpgrades.speed.current=1.3;truck.hubUpgrades.speed.next=1.325;
 const snapshot=JSON.stringify(data),h=vehiclesHarness();let tree=h.render('HubVehicles',{data,busy:false,onCommand:async()=>({}),onSell:()=>{}});const tile=nodes(tree,'Pressable').find(p=>p.props.accessibilityLabel?.includes(truck.displayName));assert.ok(tile.props.accessibilityLabel.includes('30 kg, 1,3 m/s'));assert.ok(text(tile).includes('30 kg'));assert.ok(text(tile).includes('1,3 m/s'));assert.ok(!text(tree).includes('km/s'));assert.ok(text(tree).includes('20 kg Startkapazität'));assert.equal(JSON.stringify(data),snapshot);
 const detail=componentHarness('HubVehicleDetail.tsx',{'./ui':ui}),calls=[],props={truck,coins:1e6,inventory:{hubVehicleParts:999},busy:false,onCommand:async(...args)=>{calls.push(args);return {};},onClose:()=>{}};
 tree=detail.render('HubVehicleDetail',props);const capacity=nodes(tree,'Pressable').find(p=>p.props.accessibilityLabel?.startsWith('Laderaum,'));assert.ok(capacity.props.accessibilityLabel.includes('30 kg'));capacity.props.onPress();tree=detail.render('HubVehicleDetail',props);assert.ok(text(tree).includes('30 kg'));assert.ok(text(tree).includes('32 kg'));assert.ok(!text(tree).includes('km/s'));await nodes(tree,'Btn').find(b=>text(b)==='Laderaum ausbauen').props.onPress();assert.equal(calls[0][0],'hubVehicleUpgrade');assert.equal(calls[0][1].kind,'capacity');
 tree=detail.render('HubVehicleDetail',props);nodes(tree,'Pressable').find(p=>p.props.accessibilityLabel?.startsWith('Antrieb,')).props.onPress();tree=detail.render('HubVehicleDetail',props);assert.ok(text(tree).includes('1,3 m/s'));assert.ok(text(tree).includes('1,33 m/s'));assert.equal(truck.capacity,3);assert.equal(truck.speed,1.3);
});
test('Statistics rescales only courier distance, retaining regular transport units and raw state',()=>{
 const state=fixture().state;state.stats.hubKm=100;state.stats.km=100;state.stats.tons=3;state.stats.tonKm=300;
 const snapshot=JSON.stringify(state),h=componentHarness('Statistics.tsx',{'./ui':ui,'../functions/src/customer-identities.json':[]}),tree=h.render('Statistics',{state});
 const row=label=>nodes(tree,'View').find(v=>nodes(v,'Txt').length===2&&text(nodes(v,'Txt')[0])===label);
 assert.equal(text(nodes(row('Botenstrecke gesamt'),'Txt')[1]),'100 m');assert.equal(text(nodes(row('Strecke'),'Txt')[1]),'100 km');assert.equal(text(nodes(row('Fracht'),'Txt')[1]),'3 t');assert.equal(text(nodes(row('Transportleistung'),'Txt')[1]),'300 tkm');assert.equal(JSON.stringify(state),snapshot);
 delete state.stats.hubKm;state.trucks.filter(t=>!t.cardId).forEach((t,i)=>t.kmDriven=i===0?100:0);assert.ok(text(h.render('Statistics',{state})).includes('100 m'));
});
test('Rendering five couriers preserves internal capacities, hourly economy, timing, XP and costs',()=>{
 const initial=fixture(),baseline=run(structuredClone(initial.state),'sync',{},now+3600000),before=JSON.stringify(initial.state),h=vehiclesHarness();
 h.render('HubVehicles',{data:initial.view,busy:false,onCommand:async()=>({}),onSell:()=>{}});
 const actual=run(initial.state,'sync',{},now+3600000);assert.equal(JSON.stringify(initial.state),before);assert.equal(initial.state.trucks.filter(t=>!t.cardId).length,5);assert.ok(initial.state.trucks.filter(t=>!t.cardId).every(t=>t.capacity===2));assert.deepEqual(actual.state,baseline.state);assert.deepEqual(actual.view.hubInfo,baseline.view.hubInfo);assert.ok(actual.state.hubs[0].cashboxCoins>0);
});
