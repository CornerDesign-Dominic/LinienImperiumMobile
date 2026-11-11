const {test}=require('node:test'),assert=require('node:assert/strict');
const {overtimeQuote:q}=require('../src/projectOvertime');
const order={status:'active',volume:520,delivered:76,distance:200,project:{deadlineAt:10000},eta:9000,overtimeForDeadline:0};
test('Overtime preview reflects stock and remaining-tonnage caps',()=>{assert.deepEqual(q(order,92,5,0),{points:5,tons:25,after:87,required:0,deadlineEnabled:false,canConfirm:true});assert.equal(q(order,2,10,0).tons,10);assert.equal(q({...order,delivered:519},92,10,0).points,1);assert.equal(q({...order,delivered:519},92,10,0).tons,1);});
test('Deadline selection allows only available points while retaining the full requirement',()=>{
 const late={...order,eta:12000,overtimeForDeadline:50};
 const partial=q(late,28,'max',0);assert.equal(partial.required,50);assert.equal(partial.points,28);assert.equal(partial.tons,140);assert.equal(partial.after,0);assert.equal(partial.deadlineEnabled,true);assert.equal(partial.canConfirm,true);
 const enough=q(late,92,'max',0);assert.equal(enough.points,50);assert.equal(enough.after,42);assert.equal(enough.canConfirm,true);
 assert.equal(q(late,0,'max',0).canConfirm,false);assert.equal(q(late,0,'max',0).deadlineEnabled,false);
 assert.equal(q(late,92,20,0).points,20);
 assert.equal(q(order,92,'max',0).canConfirm,false);assert.equal(q({...order,eta:null},92,'max',0).required,null);assert.equal(q({...order,eta:null},92,'max',0).canConfirm,false);assert.equal(q(order,92,5,10000).canConfirm,false);
});
