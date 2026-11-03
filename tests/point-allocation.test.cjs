const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const data=()=>({development:{points:3,expedition:{base:76,bonus:24},overtime:{base:121,bonus:9}},expansion:{available:1,expeditionMaximum:100,overtimeMaximum:130}});
test('Shared allocation row previews base values and bounds its accessible step controls',()=>{
 const h=componentHarness('PointAllocation.tsx');let tree=h.render('PointAllocationRow',{label:'Expeditionsmaximum',current:76,amount:1,free:0,disabled:false});
 assert.ok(text(tree).includes('76 → 77'));assert.equal(nodes(tree,'Btn')[0].props.disabled,false);assert.equal(nodes(tree,'Btn')[1].props.disabled,true);
 tree=h.render('PointAllocationRow',{label:'Expeditionsmaximum',current:76,amount:0,free:1,disabled:false});assert.equal(nodes(tree,'Btn')[0].props.disabled,true);assert.equal(nodes(tree,'Btn')[1].props.disabled,false);
});
test('Level modal keeps a complete batch, preserves drafts, and never spends expansion points',async()=>{
 const h=componentHarness('LevelUp.tsx'),calls=[],props={data:data(),busy:false,onClose(){},onCommand:async(a,p)=>{calls.push([a,p]);return {development:{points:0}};}};
 let tree=h.render('DevelopmentModal',props);assert.equal(nodes(tree,'PointsBalance')[0].props.total,3);assert.ok(!text(tree).includes('Jeder Punkt'));assert.equal(nodes(tree,'PointAllocationRow')[0].props.current,76);
 nodes(tree,'PointAllocationRow')[0].props.onIncrease();tree=h.render('DevelopmentModal',props);assert.equal(nodes(tree,'Btn').at(-1).props.disabled,true,'partial level batches remain forbidden');
 props.data.development.points=6;tree=h.render('DevelopmentModal',props);assert.equal(nodes(tree,'PointAllocationRow')[0].props.amount,1,'new levels preserve the draft');
 for(let i=0;i<5;i++){nodes(tree,'PointAllocationRow')[1].props.onIncrease();tree=h.render('DevelopmentModal',props);}
 assert.equal(nodes(tree,'PointsBalance')[0].props.remaining,0);await nodes(tree,'Btn').at(-1).props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['levelBatch',{expedition:1,overtime:5,points:6}]]);assert.equal(props.data.expansion.available,1);
});
test('Expansion failures stay open and concurrent confirmations send a single command',async()=>{
 const h=componentHarness('ExpansionPoints.tsx');let resolve,calls=0,closed=0;
 const props={data:data(),busy:false,onClose:()=>closed++,onCommand:()=>{calls++;return new Promise(r=>resolve=r);}};
 let tree=h.render('ExpansionPointsModal',props);nodes(tree,'PointAllocationRow')[0].props.onIncrease();tree=h.render('ExpansionPointsModal',props);
 const button=nodes(tree,'Btn').at(-1),first=button.props.onPress();await button.props.onPress();assert.equal(calls,1);nodes(tree,'RewardModal')[0].props.onClose();assert.equal(closed,0);
 resolve({expansionAllocationApplied:false});await first;tree=h.render('ExpansionPointsModal',props);assert.ok(text(tree).includes('nicht gespeichert'));assert.equal(nodes(tree,'PointAllocationRow')[0].props.amount,1);assert.equal(props.data.development.points,3);
});
