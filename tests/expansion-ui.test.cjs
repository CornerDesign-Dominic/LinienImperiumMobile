const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
function setup(){return componentHarness('ExpansionPoints.tsx',{'./regionIdentities':{regionIdentities:[{title:'Kronenlande',customer:'Kontor'}]},'./regionRoutes':{regionRoutes:[{places:[{name:'Lindenweiler'}]}]}});}
test('Completion modal is information only with exactly X and distribution, and no available points disables distribution',()=>{
 const h=setup(),props={notices:[{sequence:1,region:0,place:0,kind:'delivery',expansionPoints:1}],points:1,busy:false,onClose(){},onDistribute(){}};
 let tree=h.render('ExpeditionCompletionNotice',props),buttons=nodes(tree,'Btn');
 assert.deepEqual(buttons.map(text),['Schließen','Punkte verteilen']);assert.ok(text(tree).includes('Lindenweiler'));assert.ok(text(tree).includes('Erweiterungspunkt'));
 assert.equal(nodes(tree,'Modal')[0].props.trackActivity,false);
 props.points=0;tree=h.render('ExpeditionCompletionNotice',props);assert.equal(nodes(tree,'Btn')[1].props.disabled,true);
});
test('Expansion draft closes without spending and only an explicit confirmation sends a permanent bounded allocation',async()=>{
 const h=setup(),calls=[];let closed=0;
 const props={data:{expansion:{available:2,expeditionMaximum:50,overtimeMaximum:100}},busy:false,onClose:()=>closed++,onCommand:async(action,payload)=>{calls.push([action,payload]);return {expansionAllocationApplied:true,expansion:{available:payload.points-payload.expedition-payload.overtime}};}};
 let tree=h.render('ExpansionPointsModal',props);
 assert.ok(text(tree).includes('nicht rückgängig'));assert.equal(nodes(tree,'Btn').at(-1).props.disabled,true);
 nodes(tree,'Btn').find(b=>text(b)==='Überstundenmaximum erhöhen').props.onPress();tree=h.render('ExpansionPointsModal',props);
 assert.ok(text(tree).includes('100 → 101'));assert.equal(calls.length,0);
 props.data.expansion.available=3;tree=h.render('ExpansionPointsModal',props);assert.ok(text(tree).includes('100 → 101'),'newly earned points preserve the existing draft');
 await nodes(tree,'Btn').at(-1).props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['expansionAllocate',{expedition:0,overtime:1,points:3}]]);assert.equal(closed,1);
 const separate=setup();tree=separate.render('ExpansionPointsModal',props);nodes(tree,'RewardModal')[0].props.onClose();assert.equal(calls.length,1);assert.equal(closed,2);
});
