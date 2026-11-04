const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const data=()=>({development:{points:4,expedition:{base:76,bonus:24},overtime:{base:121,bonus:9}},expansion:{available:4,expeditionMaximum:100,overtimeMaximum:130}});
test('Shared allocation row previews base values and bounds its accessible step controls',()=>{
 const h=componentHarness('PointAllocation.tsx');let tree=h.render('PointAllocationRow',{label:'Expeditionsmaximum',current:76,amount:1,free:0,disabled:false});
 assert.ok(text(tree).includes('76 → 77'));assert.equal(nodes(tree,'Btn')[0].props.disabled,false);assert.equal(nodes(tree,'Btn')[1].props.disabled,true);
 tree=h.render('PointAllocationRow',{label:'Expeditionsmaximum',current:76,amount:0,free:1,disabled:false});assert.equal(nodes(tree,'Btn')[0].props.disabled,true);assert.equal(nodes(tree,'Btn')[1].props.disabled,false);
});
test('Unified modal permits partial allocation and preserves drafts from either source',async()=>{
 const h=componentHarness('LevelUp.tsx'),calls=[],props={data:data(),busy:false,onClose(){},onCommand:async(a,p)=>{calls.push([a,p]);return {expansionAllocationApplied:true,development:{points:0}};}};
 let tree=h.render('DevelopmentModal',props);assert.equal(nodes(tree,'PointsBalance')[0].props.total,4);assert.ok(!text(tree).includes('Jeder Punkt'));assert.equal(nodes(tree,'PointAllocationRow')[0].props.current,76);
 nodes(tree,'PointAllocationRow')[0].props.onIncrease();tree=h.render('DevelopmentModal',props);assert.equal(nodes(tree,'Btn').at(-1).props.disabled,false,'partial allocation is permitted');
 props.data.development.points=6;tree=h.render('DevelopmentModal',props);assert.equal(nodes(tree,'PointAllocationRow')[0].props.amount,1,'new levels preserve the draft');
 for(let i=0;i<5;i++){nodes(tree,'PointAllocationRow')[1].props.onIncrease();tree=h.render('DevelopmentModal',props);}
 assert.equal(nodes(tree,'PointsBalance')[0].props.remaining,0);await nodes(tree,'Btn').at(-1).props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['expansionAllocate',{expedition:1,overtime:5,points:6}]]);
});
test('Expansion failures stay open and concurrent confirmations send a single command',async()=>{
 const h=componentHarness('LevelUp.tsx');let resolve,calls=0,closed=0;
 const props={data:data(),busy:false,onClose:()=>closed++,onCommand:()=>{calls++;return new Promise(r=>resolve=r);}};
 let tree=h.render('DevelopmentModal',props);nodes(tree,'PointAllocationRow')[0].props.onIncrease();tree=h.render('DevelopmentModal',props);
 const button=nodes(tree,'Btn').at(-1),first=button.props.onPress();await button.props.onPress();assert.equal(calls,1);nodes(tree,'RewardModal')[0].props.onClose();assert.equal(closed,0);
 resolve({expansionAllocationApplied:false});await first;tree=h.render('DevelopmentModal',props);assert.ok(text(tree).includes('nicht gespeichert'));assert.equal(nodes(tree,'PointAllocationRow')[0].props.amount,1);assert.equal(props.data.development.points,4);
});


test('Development shows one seven-point balance and one allocator entry for all sources',()=>{
 const h=componentHarness('LevelUp.tsx'),props={data:data(),onExpansion(){},onCommand(){}};props.data.development.points=7;props.data.expansion.available=7;
 const tree=h.render('DevelopmentCard',props),buttons=nodes(tree,'Btn');assert.equal(buttons.length,1);assert.equal(text(buttons[0]),'Ausbaupunkte verteilen · 7');assert.ok(text(tree).includes('Verfügbare Punkte: 7'));assert.ok(!text(tree).includes('Levelpunkte'));
});

test('Headquarters card retains authoritative base maxima and a truthful empty point balance',()=>{
 const h=componentHarness('LevelUp.tsx'),props={data:data(),busy:false,onCommand(){}};
 props.data.development.points=0;props.data.expansion.available=0;
 const tree=h.render('DevelopmentCard',props);
 assert.ok(text(tree).includes('Verfügbare Punkte: 0'));
 assert.ok(!text(tree).includes('Entwicklung'));
 assert.equal(nodes(tree,'Btn').length,0,'no allocation action without points');
 assert.equal(nodes(tree,'Image').length,1);
 const card=nodes(tree,'Card')[0];assert.ok(nodes(card,'Image').length===1,'art and values belong to the same card');
 const values=nodes(tree,'Txt').map(text);
 assert.ok(values.includes('121'));assert.ok(values.includes('76'));
 assert.ok(!values.includes('130'));assert.ok(!values.includes('100'),'card bonuses stay out of the base preview');
 h.unmount();
});
