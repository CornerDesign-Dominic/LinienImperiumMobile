const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {overtimeQuote}=require('../src/projectOvertime');
test('Overtime closes on an authoritative receipt even when regeneration offsets spending',async()=>{
 const h=componentHarness('ProjectOvertimeModal.tsx',{'./PointAllocation':{PointInfo:'PointInfo'},'./projectOvertime':{overtimeQuote}});
 let closed=0,calls=0;
 const props={order:{id:'p',status:'active',volume:520,delivered:76,distance:200,project:{deadlineAt:10000},eta:9000,overtimeForDeadline:0},points:92,busy:false,clock:0,visible:true,onClose:()=>closed++,onCommand:async()=>{calls++;return {overtimeApplied:true,state:{overtimePoints:93}};}};
 const tree=h.render('ProjectOvertimeModal',props);assert.ok(!text(tree).includes('Dein Einsatz'));assert.ok(!text(tree).includes('Vorrat danach'));assert.ok(text(tree).includes('Sofort geliefert'));
 const confirm=nodes(tree,'Btn').find(n=>text(n)==='Punkte einsetzen').props.onPress;
 await Promise.all([confirm(),confirm()]);assert.equal(calls,1);assert.equal(closed,1);
 h.unmount();
});
test('A lower balance alone never confirms overtime',async()=>{
 const h=componentHarness('ProjectOvertimeModal.tsx',{'./PointAllocation':{PointInfo:'PointInfo'},'./projectOvertime':{overtimeQuote}});
 let closed=0;const props={order:{id:'p',status:'active',volume:520,delivered:76,distance:200,project:{deadlineAt:10000},eta:9000,overtimeForDeadline:0},points:92,busy:false,clock:0,visible:true,onClose:()=>closed++,onCommand:async()=>({overtimeApplied:false,state:{overtimePoints:91}})};
 await nodes(h.render('ProjectOvertimeModal',props),'Btn').find(n=>text(n)==='Punkte einsetzen').props.onPress();
 assert.equal(closed,0);assert.ok(text(h.render('ProjectOvertimeModal',props)).includes('Einsatz nicht bestätigt'));h.unmount();
});

test('Deadline choice spends partial stock once, keeps its warning and preserves max for sufficient stock',async()=>{
 for(const [points,need,expected] of [[28,230,28],[8,23,8],[40,23,'max']]){
  const h=componentHarness('ProjectOvertimeModal.tsx',{'./PointAllocation':{PointInfo:'PointInfo'},'./projectOvertime':{overtimeQuote}}),calls=[];
  let closed=0;const props={order:{id:'p',status:'active',volume:3000,delivered:0,distance:200,project:{deadlineAt:10000},eta:12000,overtimeForDeadline:need},points,busy:false,clock:0,visible:true,onClose:()=>closed++,onCommand:async(a,p)=>{calls.push([a,p]);return {overtimeApplied:true};}};
  let tree=h.render('ProjectOvertimeModal',props);assert.deepEqual(nodes(tree,'Btn').slice(0,4).map(text),['1','5','10','20']);
  const deadline=nodes(tree,'Btn').find(b=>text(b).startsWith('Frist sichern'));assert.equal(deadline.props.disabled,false);
  assert.equal(text(deadline),points<need?`Frist sichern · ${points}/${need} Punkte`:`Frist sichern · ${need} Punkte`);
  deadline.props.onPress();tree=h.render('ProjectOvertimeModal',props);
  assert.equal(text(tree).includes('Nicht genügend Überstundenpunkte'),points<need);
  assert.ok(text(tree).includes(`+${Math.min(points,need)*5} t`));
  const confirm=nodes(tree,'Btn').find(b=>text(b)==='Punkte einsetzen').props.onPress;
  await Promise.all([confirm(),confirm()]);assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['overtime',{id:'p',amount:expected}]]);assert.equal(closed,1);h.unmount();
 }
});
test('Twenty points are selectable and empty stock cannot submit an overtime action',async()=>{
 for(const points of [0,40]){
  const h=componentHarness('ProjectOvertimeModal.tsx',{'./PointAllocation':{PointInfo:'PointInfo'},'./projectOvertime':{overtimeQuote}}),calls=[];
  const props={order:{id:'p',status:'active',volume:3000,delivered:0,distance:200,project:{deadlineAt:10000},eta:12000,overtimeForDeadline:23},points,busy:false,clock:0,visible:true,onClose(){},onCommand:async(a,p)=>{calls.push(p);return {overtimeApplied:true};}};
  let tree=h.render('ProjectOvertimeModal',props);nodes(tree,'Btn').find(b=>text(b)==='20').props.onPress();tree=h.render('ProjectOvertimeModal',props);
  const confirm=nodes(tree,'Btn').find(b=>text(b)==='Punkte einsetzen');assert.equal(confirm.props.disabled,points===0);
  await confirm.props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),points===0?[]:[{id:'p',amount:20}]);
  if(points===0)assert.equal(nodes(tree,'Btn').find(b=>text(b).startsWith('Frist sichern')).props.disabled,true);
  h.unmount();
 }
});
