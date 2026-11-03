const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
function setup(){return componentHarness('ExpansionPoints.tsx');}
test('Expansion draft closes without spending and only an explicit confirmation sends a permanent bounded allocation',async()=>{
 const h=setup(),calls=[];let closed=0;
 const props={data:{expansion:{available:2,expeditionMaximum:74,overtimeMaximum:109},development:{expedition:{base:50,bonus:24},overtime:{base:100,bonus:9}}},busy:false,onClose:()=>closed++,onCommand:async(action,payload)=>{calls.push([action,payload]);return {expansionAllocationApplied:true,expansion:{available:payload.points-payload.expedition-payload.overtime}};}};
 let tree=h.render('ExpansionPointsModal',props);
 assert.ok(!text(tree).includes('nicht rückgängig'));assert.equal(nodes(tree,'Btn').at(-1).props.disabled,true);
 nodes(tree,'PointAllocationRow').find(b=>b.props.label==='Überstundenmaximum').props.onIncrease();tree=h.render('ExpansionPointsModal',props);
 assert.equal(nodes(tree,'PointAllocationRow')[1].props.current,100);assert.equal(nodes(tree,'PointAllocationRow')[1].props.amount,1);assert.equal(calls.length,0);
 props.data.expansion.available=3;tree=h.render('ExpansionPointsModal',props);assert.equal(nodes(tree,'PointAllocationRow')[1].props.amount,1,'newly earned points preserve the existing draft');
 await nodes(tree,'Btn').at(-1).props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['expansionAllocate',{expedition:0,overtime:1,points:3}]]);assert.equal(closed,1);
 const separate=setup();tree=separate.render('ExpansionPointsModal',props);nodes(tree,'RewardModal')[0].props.onClose();assert.equal(calls.length,1);assert.equal(closed,2);
});

