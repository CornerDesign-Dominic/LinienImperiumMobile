const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const palette=require('../src/palette.json');
const ui={C:palette,Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Bar:'Bar',Pill:'Pill',Empty:'Empty',n:String,remaining:(at,clock)=>String(at-clock)};
const data={state:{coins:100000,trucks:[{id:'t1',cardId:'a'}]},catalog:{cards:[{id:'a',name:'Testwagen'}],regionNames:['Kronenlande'],rarities:[{id:'common',label:'Common'}]},procurement:{vehicles:[],groups:[],runs:[],sites:[],pending:{common:25},completed:0}};
const group={id:'G1',vehicleIds:['t1'],region:0,status:'active',mode:'count',completed:1,requested:5,escrow:24000,price:8000,vehicles:[{id:'r1',truckId:'t1',model:'Testwagen',status:'active',startedAt:100,nextAt:1000,durationMs:900}]};
function runHarness(){return componentHarness('ProcurementRun.tsx',{'./ui':ui,...Object.fromEntries(['crownlands','prairies','saffron-road','jade-valley','northmark'].map(x=>[`../assets/art/regions/${x}.jpg`,x]))});}
test('Procurement details route stop actions to the selected group or standalone run and preserve busy/ending states',()=>{
 const h=runHarness(),calls=[],close=[];let props={run:group,title:'Kronenlande',data,clock:300,busy:false,onClose:()=>close.push(true),onStop:(...a)=>calls.push(a)};
 let tree=h.render('ProcurementRunDetail',props),buttons=nodes(tree,'Btn');
 buttons.find(b=>b.props.children==='Nach laufenden Touren beenden').props.onPress();buttons.find(b=>b.props.children==='Sofort abbrechen').props.onPress();
 assert.deepEqual(calls,[[group,false],[group,true]]);
 const scroll=nodes(tree,'ScrollView')[0];assert.equal(nodes(scroll,'Btn').filter(b=>b.props.children==='Schließen').length,0);buttons.find(b=>b.props.children==='Schließen').props.onPress();assert.equal(close.length,1);
 tree=h.render('ProcurementRunDetail',{...props,busy:true});assert.ok(nodes(tree,'Btn').filter(b=>b.props.children!=='Schließen').every(b=>b.props.disabled));
 tree=h.render('ProcurementRunDetail',{...props,run:{...group,stopAfter:true}});assert.ok(!nodes(tree,'Btn').some(b=>String(b.props.children).startsWith('Nach laufenden')));assert.ok(text(tree).includes('Endet nach laufenden Touren'));
 const standalone={...group.vehicles[0],region:0,mode:'reserve',reserve:10000,price:8000,completed:3};tree=h.render('ProcurementRunDetail',{...props,run:standalone});nodes(tree,'Btn').find(b=>b.props.children==='Nach laufender Tour beenden').props.onPress();assert.deepEqual(calls.at(-1),[standalone,false]);
 tree=h.render('ProcurementRunDetail',{...props,run:{...group,status:'finished'}});assert.ok(!nodes(tree,'Btn').some(b=>b.props.children==='Sofort abbrechen'));assert.ok(text(tree).includes('Beschaffung beendet'));
 assert.equal(h.render('ProcurementRunDetail',{...props,modalBlocked:true}),null);
});
test('Procurement overview retains reward collection and location flow; running cards only open details',()=>{
 const calls=[],confirmed=[];const h=componentHarness('Procurement.tsx',{'./ui':ui,'./Language':{Text:'Text'},'./ProcurementRun':{ProcurementRunCard:'RunCard',ProcurementRunDetail:'RunDetail'},'../assets/art/procurement/selection-yard.jpg':'selection','./regionIdentities':{regionIdentities:[{title:'Kronenlande'}]}});
 const props={data:{...data,procurement:{...data.procurement,groups:[group]}},busy:false,clock:300,onCommand:(...a)=>calls.push(a),onExpedition:()=>{},confirm:(...a)=>confirmed.push(a)};
 let tree=h.render('Procurement',props);nodes(tree,'Btn').find(b=>b.props.children==='Einsammeln').props.onPress();assert.deepEqual(calls,[['procurementClaim']]);
 nodes(tree,'RunCard')[0].props.onOpen();tree=h.render('Procurement',props);const detail=nodes(tree,'RunDetail')[0];assert.equal(detail.props.run.id,'G1');detail.props.onStop(group,false);assert.equal(confirmed.length,1);confirmed[0][2]();assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1))),['procurementGroupStop',{id:'G1',immediate:false}]);
 nodes(tree,'Pressable').find(b=>b.props.accessibilityLabel==='Beschaffungsort wählen').props.onPress();tree=h.render('Procurement',props);assert.ok(text(tree).includes('Ort wählen'));assert.equal(nodes(tree,'RunDetail')[0].props.modalBlocked,true);
 const cards=runHarness();let opened=0;tree=cards.render('ProcurementRunCard',{run:group,title:'Kronenlande',data,clock:300,onOpen:()=>opened++});nodes(tree,'Pressable')[0].props.onPress();assert.equal(opened,1);assert.equal(nodes(tree,'Btn').length,0);
});
test('Region choices omit reward previews; transport selection uses actual tour duration, preserves unavailable vehicles and starts selected IDs',async()=>{
 const calls=[],h=componentHarness('Procurement.tsx',{'./ui':ui,'./Language':{Text:'Text'},'./ProcurementRun':{ProcurementRunCard:'RunCard',ProcurementRunDetail:'RunDetail'},'../assets/art/procurement/selection-yard.jpg':'selection','./regionIdentities':{regionIdentities:[{title:'Kronenlande'},{title:'Weite Ebenen'}]}});
 const vehicles=[{id:'t1',cardId:'a',model:'Königliches Löwengespann',free:true,capacity:222,speed:3.14,durationMs:600000},{id:'t2',cardId:'a',model:'Nordland-Lastengespann',free:true,capacity:333,speed:2.22,durationMs:360000},{id:'t3',cardId:'a',model:'Belegter Wagen',free:false,capacity:444,speed:9.99,durationMs:420000}];
 const props={data:{...data,procurement:{...data.procurement,vehicles,sites:[{region:0,unlocked:true,price:8000,completed:0},{region:1,unlocked:false,price:12000,completed:0,discovered:7,deliveries:2,finalClaimed:true}]}},busy:false,clock:300,onCommand:async(...a)=>{calls.push(a);},onExpedition:()=>{},confirm:()=>{}};
 let tree=h.render('Procurement',props);nodes(tree,'Pressable').find(b=>b.props.accessibilityLabel==='Beschaffungsort wählen').props.onPress();tree=h.render('Procurement',props);let modal=nodes(tree,'Modal')[0];assert.ok(!text(modal).includes('Belohnungen'));assert.ok(text(modal).includes('Zur Expedition'));assert.ok(text(tree).includes('Belohnungen'),'actual collected rewards remain');
 nodes(modal,'Pressable').find(b=>b.props.accessibilityLabel==='Kronenlande als Beschaffungsort wählen').props.onPress();tree=h.render('Procurement',props);modal=nodes(tree,'Modal')[0];assert.ok(text(modal).includes('Transport wählen'));assert.ok(text(modal).includes('10:00 Min. je Tour'));assert.ok(!text(modal).includes('222'));assert.ok(!text(modal).includes('km/s'));
 const choice=name=>nodes(modal,'Pressable').find(b=>b.props.accessibilityLabel?.startsWith(name));assert.equal(choice('Belegter Wagen').props.disabled,true);assert.equal(choice('Königliches Löwengespann').props.accessibilityState.selected,false);
 choice('Königliches Löwengespann').props.onPress();tree=h.render('Procurement',props);modal=nodes(tree,'Modal')[0];assert.equal(choice('Königliches Löwengespann').props.accessibilityState.selected,true);const start=nodes(modal,'Btn').find(b=>b.props.children==='Beschaffung starten');assert.equal(start.props.disabled,false);await start.props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls[0])),['procurementGroupStart',{region:0,trucks:['t1'],mode:'count',amount:1}]);
 tree=h.render('Procurement',{...props,busy:true});modal=nodes(tree,'Modal')[0];assert.ok(nodes(modal,'Pressable').filter(b=>b.props.accessibilityLabel?.includes('Min. je Tour')).every(b=>b.props.disabled));
});
