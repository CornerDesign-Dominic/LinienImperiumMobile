const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness}=require('./helpers/component-harness.cjs');
const expired='Die Haltezeit ist abgelaufen. Bitte wähle einen neuen Auftrag.';
const tick=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const setup=(fields={})=>{
 const order={id:'A-1',status:'available',cargo:'Getreide',volume:12,distance:60,choices:[{id:'truck-1'}],...fields};
 const h=componentHarness('SingleOrderPicker.tsx',{'./OrderVehiclePicker':{OrderVehiclePicker:'Picker'}});
 let closed=0,started=0,calls=[];
 const props={id:order.id,data:{state:{orders:[order]}},busy:false,clock:1000,onClose:()=>closed++,onStarted:()=>started++,onCommand:async(action,payload)=>{calls.push({action,payload});if(action==='reserveOrder')return {pickerReservation:{token:'hold-A',expiresAt:31000},state:{orders:[order]}};return {state:{orders:[{...order,status:'active'}]}};}};
 return {h,props,render:()=>h.render('SingleOrderPicker',props),closed:()=>closed,started:()=>started,calls};
};
test('Opening reserves once, shows the fixed server countdown and releases only that token on close',async()=>{
 const s=setup();let tree=s.render();assert.equal(tree.type,'Picker');assert.equal(tree.props.startDisabled,true);assert.equal(tree.props.headerStatus,'Haltezeit wird vorbereitet …');
 await tick();tree=s.render();assert.equal(tree.props.summary,'Getreide · 12 t · 60 km');assert.equal(tree.props.headerStatus,'Haltezeit: 30 sek.');assert.equal(tree.props.startDisabled,false);assert.equal(tree.props.choices[0].free,true);assert.equal(s.props.data.state.orders[0].choices[0].free,undefined);
 s.props.clock=12400;tree=s.render();assert.equal(tree.props.headerStatus,'Haltezeit: 19 sek.');
 s.props.onClose=()=>{};s.render();assert.equal(s.calls.filter(c=>c.action==='reserveOrder').length,1,'render and callback changes never renew');
 tree.props.onClose();s.h.unmount();await tick();assert.equal(s.calls.filter(c=>c.action==='releaseOrderReservation').length,1);assert.deepEqual(JSON.parse(JSON.stringify(s.calls[1].payload)),{order:'A-1',token:'hold-A'});
});
test('Reserved assignment carries its token; expired undisplaced offer may still start',async()=>{
 const s=setup();s.render();await tick();s.props.clock=31001;const picker=s.render();assert.equal(picker.props.headerStatus,'Haltezeit: 0 sek.');assert.equal(picker.props.startDisabled,false);
 assert.equal(await picker.props.onStart('truck-1'),true);assert.equal(s.started(),1);assert.equal(s.calls[1].action,'assign');assert.equal(s.calls[1].payload.reservationToken,'hold-A');s.h.unmount();assert.equal(s.calls.length,2,'successful assignment consumes hold');
});
test('Pinned and saved/private/crafted orders keep their existing assignment rules without temporary holds',async()=>{
 for(const [fields,action] of [[{pinned:true},'assign'],[{status:'queued'},'assign'],[{status:'queued',kind:'private'},'assignPrivate'],[{crafted:true},'assignCrafted']]){
  const s=setup({vehicleChoices:[{id:'real-truck',free:true}],...fields});const picker=s.render();assert.equal(picker.props.choices,s.props.data.state.orders[0].vehicleChoices);assert.equal(picker.props.headerStatus,undefined);assert.equal(s.calls.length,0);
  assert.equal(await picker.props.onStart('real-truck'),true);assert.deepEqual(JSON.parse(JSON.stringify(s.calls)),[{action,payload:{order:'A-1',truck:'real-truck'}}]);assert.equal(s.started(),1);s.h.unmount();
 }
});
test('Refresh-removal leaves an understandable expiry message instead of silently closing',async()=>{
 const s=setup();s.render();await tick();s.props.data.state.orders=[];const picker=s.render();assert.equal(picker.props.errorMessage,expired);assert.equal(picker.props.startDisabled,true);assert.equal(s.closed(),0);assert.equal(await picker.props.onStart('truck-1'),false);picker.props.onClose();assert.equal(s.closed(),1);s.h.unmount();
});
test('A reservation response arriving after navigation is released without reopening the picker',async()=>{
 const s=setup();let resolve;s.props.onCommand=(action,payload)=>{s.calls.push({action,payload});return action==='reserveOrder'?new Promise(done=>resolve=done):Promise.resolve();};s.render();s.h.unmount();resolve({pickerReservation:{token:'late',expiresAt:31000}});await tick();assert.equal(s.calls[1].action,'releaseOrderReservation');assert.equal(s.calls[1].payload.token,'late');assert.equal(s.closed(),0);
});
test('Server expiry error is displayed and a failed unrelated assignment remains retryable',async()=>{
 const s=setup();s.render();await tick();s.props.onCommand=async()=>{throw Error(expired);};assert.equal(await s.render().props.onStart('truck-1'),false);assert.equal(s.render().props.errorMessage,expired);assert.equal(s.render().props.startDisabled,true);s.h.unmount();
 const saved=setup({status:'queued'});saved.props.onCommand=async()=>{throw Error('Verbindung fehlgeschlagen.');};assert.equal(await saved.render().props.onStart('truck-1'),false);assert.equal(saved.render().props.startDisabled,false);assert.equal(saved.started(),0);saved.h.unmount();
});
test('Already started or completed orders dismiss their picker',()=>{
 for(const status of ['active','completed']){const s=setup({status:'queued'});s.render();s.props.data.state.orders[0].status=status;assert.equal(s.render().props.startDisabled,true);assert.equal(s.closed(),1);s.h.unmount();}
});
test('The transport modal displays hold status above its summary and disables starting while reservation is pending',()=>{
 const {nodes,text}=require('./helpers/component-harness.cjs');
 const h=componentHarness('OrderVehiclePicker.tsx',{'./VehicleCards':{VehicleCardTile:'Tile',RarityFilter:'Filter'},'./orderSelection':{sortOrderVehicles:x=>x},'./ui':{C:require('../src/palette.json'),Txt:'Txt',Row:'Row',Btn:'Btn',Empty:'Empty',n:String,minutes:String,remaining:String}});
 let starts=0,closes=0;const props={data:{catalog:{cards:[]}},choices:[{id:'truck-1',model:'Kutsche',free:true,trips:1,seconds:60,totalProfit:100}],summary:'Holz · 12 t',clock:1000,busy:false,headerStatus:'Haltezeit: 30 sek.',startDisabled:true,onStart:()=>starts++,onClose:()=>closes++};
 let tree=h.render('OrderVehiclePicker',props);assert.equal(text(nodes(tree,'Txt').find(n=>n.props.testID==='order-picker-hold')),'Haltezeit: 30 sek.');nodes(tree,'Tile')[0].props.onPress();tree=h.render('OrderVehiclePicker',props);const start=nodes(tree,'Btn').find(n=>text(n)==='Auftrag starten');assert.equal(start.props.disabled,true);start.props.onPress();assert.equal(starts,0);
 props.errorMessage=expired;tree=h.render('OrderVehiclePicker',props);assert.equal(text(nodes(tree,'Txt').find(n=>n.props.testID==='order-picker-error')),expired);nodes(tree,'Modal')[0].props.onRequestClose();assert.equal(closes,1);h.unmount();
});

test('Closing while reserve is in flight serializes release before a rapid reopen can reserve again',async()=>{
 const s=setup();let firstResolve,reserves=0;s.props.onCommand=(action,payload)=>{s.calls.push({action,payload});if(action==='reserveOrder'){reserves++;return reserves===1?new Promise(resolve=>firstResolve=resolve):Promise.resolve({pickerReservation:{token:'second',expiresAt:32000}});}return Promise.resolve();};
 s.render();s.h.unmount();s.render();assert.equal(reserves,1);firstResolve({pickerReservation:{token:'first',expiresAt:31000}});await tick();assert.deepEqual(s.calls.map(call=>call.action),['reserveOrder','releaseOrderReservation','reserveOrder']);assert.equal(s.calls[1].payload.token,'first');await tick();assert.equal(s.render().props.headerStatus,'Haltezeit: 31 sek.');s.h.unmount();await tick();assert.equal(s.calls[3].payload.token,'second');
});
test('A displaced hold is disabled exactly at its deadline and a pin race bypasses the countdown',async()=>{
 const s=setup({pickerReservation:{displaced:true}});s.render();await tick();s.props.clock=31000;const picker=s.render();assert.equal(picker.props.errorMessage,expired);assert.equal(picker.props.startDisabled,true);s.h.unmount();await tick();
 const pin=setup();pin.props.onCommand=async()=>{pin.props.data.state.orders[0].pinned=true;return {state:{orders:pin.props.data.state.orders},pickerReservation:null};};pin.render();await tick();assert.equal(pin.render().props.headerStatus,undefined);assert.equal(pin.render().props.startDisabled,false);pin.h.unmount();await tick();
});
