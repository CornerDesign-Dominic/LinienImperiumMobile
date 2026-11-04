const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes}=require('./helpers/component-harness.cjs');
const setup=(order={id:'A-1',status:'available',cargo:'Getreide',volume:12,distance:60,choices:[{id:'truck-1'}]})=>{
 const h=componentHarness('SingleOrderPicker.tsx',{'./OrderVehiclePicker':{OrderVehiclePicker:'Picker'}});
 let closed=0,started=0,calls=[];
 const props={id:order.id,data:{state:{orders:[order]}},busy:false,clock:1,onClose:()=>closed++,onStarted:()=>started++,onCommand:async(action,payload)=>{calls.push({action,payload});return {state:{orders:[{...order,status:'active'}]}};}};
 return {h,props,render:()=>h.render('SingleOrderPicker',props),closed:()=>closed,started:()=>started,calls};
};
test('Direct single picker opens without assigning and closes without changing the order',()=>{
 const s=setup(),tree=s.render();assert.equal(tree.type,'Picker');assert.equal(tree.props.summary,'Getreide · 12 t · 60 km');assert.equal(s.calls.length,0);
 assert.equal(tree.props.choices[0].free,true);assert.equal(s.props.data.state.orders[0].choices[0].free,undefined);
 tree.props.onClose();assert.equal(s.closed(),1);assert.equal(s.calls.length,0);s.h.unmount();
});
test('Direct picker keeps authoritative choices and starts each supported order with its real IDs',async()=>{
 for(const [fields,action] of [[{},'assign'],[{kind:'private'},'assignPrivate'],[{crafted:true},'assignCrafted']]){
  const s=setup({id:'saved-order',status:'queued',cargo:'Holz',volume:4,distance:60,choices:[],vehicleChoices:[{id:'real-truck',free:true}],...fields});
  const picker=s.render();assert.equal(picker.props.choices,s.props.data.state.orders[0].vehicleChoices);
  assert.equal(await picker.props.onStart('real-truck'),true);
  assert.deepEqual(JSON.parse(JSON.stringify(s.calls)),[{action,payload:{order:'saved-order',truck:'real-truck'}}]);assert.equal(s.started(),1);s.h.unmount();
 }
});
test('Expired, started or removed offers dismiss instead of retaining a stale picker',()=>{
 for(const state of ['removed','active','completed']){
  const s=setup();s.render();if(state==='removed')s.props.data.state.orders=[];else s.props.data.state.orders[0].status=state;
  assert.equal(s.render(),null);assert.equal(s.closed(),1);assert.equal(s.calls.length,0);s.h.unmount();
 }
});
test('A failed assignment keeps the picker open without announcing a start',async()=>{
 const s=setup();s.props.onCommand=async()=>undefined;
 assert.equal(await s.render().props.onStart('truck-1'),false);assert.equal(s.started(),0);assert.equal(s.closed(),0);s.h.unmount();
});
