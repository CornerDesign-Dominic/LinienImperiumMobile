const {test}=require('node:test'),assert=require('node:assert/strict'),React=require('react');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const tileOrders=tree=>{const visit=node=>!node||typeof node!=='object'?[]:[...(typeof node.type==='function'&&node.type.name==='OrderTile'?[node.props.order]:[]),...React.Children.toArray(node.props?.children).flatMap(visit)];return visit(tree);};
function setup(orders){
 const ui={C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Pill:'Pill',Empty:'Empty',Bar:'Bar',n:String,remaining:()=> '00:10',minutes:String};
 const h=componentHarness('Orders.tsx',{'./ui':ui,'./OrderVehiclePicker':{OrderVehiclePicker:'Picker'}});
 let claims=0;const data={state:{orders,trucks:[],expedition:{missions:[]}},catalog:{regionNames:[]}};
 const props={data,clock:1,busy:false,onClaim:()=>claims++,onOpen:()=>{},onMission:()=>{}};
 return {h,props,claims:()=>claims,render:()=>h.render('RunningOrders',props)};
}
test('Running singles show active cards only while retaining one collective claim for every unclaimed completion',()=>{
 const orders=[{id:'active',status:'active'},...['done-a','done-b'].map(id=>({id,status:'completed',completionReward:{coins:9,claimedAt:null}})),{id:'claimed',status:'completed',completionReward:{claimedAt:1}},{id:'project',isProject:true,status:'completed',completionReward:{claimedAt:null}}];
 const before=JSON.stringify(orders),s=setup(orders),tree=s.render();
 assert.deepEqual(tileOrders(tree).map(o=>o.id),['active']);
 const buttons=nodes(tree,'Btn');assert.equal(buttons.length,1);assert.equal(text(buttons[0]),'Belohnungen abholen · 2');buttons[0].props.onPress();assert.equal(s.claims(),1);
 assert.equal(JSON.stringify(orders),before,'Hiding cards must not consume or mutate rewards');
 s.props.busy=true;assert.equal(nodes(s.render(),'Btn')[0].props.disabled,true);
});
test('A rewards-only running tab keeps collective collection without redundant completed cards',()=>{
 const s=setup([{id:'done',status:'completed',completionReward:{coins:10,claimedAt:null}}]);
 assert.equal(tileOrders(s.render()).length,0);assert.equal(nodes(s.render(),'Btn').length,1);assert.equal(nodes(s.render(),'Empty').length,0);
 s.props.data.state.orders[0].completionReward.claimedAt=1;
 const empty=s.render();assert.equal(nodes(empty,'Btn').length,0);assert.equal(text(nodes(empty,'Empty')[0]),'Keine Aufträge unterwegs.');
});

test('Completed expedition vehicle jobs join the collective counter without completed cards',()=>{
 const s=setup([]);s.props.data.state.expedition.missions=[{id:1,kind:'endless',status:'completed',completionReward:{coins:15,claimedAt:null}},{id:2,kind:'endless',status:'completed',completionReward:{claimedAt:1}}];
 const tree=s.render();assert.equal(text(nodes(tree,'Btn')[0]),'Belohnungen abholen · 1');assert.equal(nodes(tree,'Empty').length,0);assert.equal(tileOrders(tree).length,0);
});
