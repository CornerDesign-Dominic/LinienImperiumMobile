const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {overtimeQuote}=require('../src/projectOvertime');
test('Overtime closes on an authoritative receipt even when regeneration offsets spending',async()=>{
 const h=componentHarness('ProjectOvertimeModal.tsx',{'./PointAllocation':{PointInfo:'PointInfo'},'./projectOvertime':{overtimeQuote}});
 let closed=0,calls=0;
 const props={order:{id:'p',status:'active',volume:520,delivered:76,distance:200,project:{deadlineAt:10000},eta:9000,overtimeForDeadline:0},points:92,busy:false,clock:0,visible:true,onClose:()=>closed++,onCommand:async()=>{calls++;return {overtimeApplied:true,state:{overtimePoints:93}};}};
 const tree=h.render('ProjectOvertimeModal',props),confirm=nodes(tree,'Btn').find(n=>text(n)==='1 Punkte einsetzen').props.onPress;
 await Promise.all([confirm(),confirm()]);assert.equal(calls,1);assert.equal(closed,1);
 h.unmount();
});
test('A lower balance alone never confirms overtime',async()=>{
 const h=componentHarness('ProjectOvertimeModal.tsx',{'./PointAllocation':{PointInfo:'PointInfo'},'./projectOvertime':{overtimeQuote}});
 let closed=0;const props={order:{id:'p',status:'active',volume:520,delivered:76,distance:200,project:{deadlineAt:10000},eta:9000,overtimeForDeadline:0},points:92,busy:false,clock:0,visible:true,onClose:()=>closed++,onCommand:async()=>({overtimeApplied:false,state:{overtimePoints:91}})};
 await nodes(h.render('ProjectOvertimeModal',props),'Btn').find(n=>text(n)==='1 Punkte einsetzen').props.onPress();
 assert.equal(closed,0);assert.ok(text(h.render('ProjectOvertimeModal',props)).includes('Einsatz nicht bestätigt'));h.unmount();
});
