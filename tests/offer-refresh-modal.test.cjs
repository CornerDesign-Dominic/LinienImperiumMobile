const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const button=(tree,label)=>nodes(tree,'Btn').find(node=>text(node)===label);
test('Offer refresh requires confirmation, respects funds, cancels safely and ignores duplicate taps',async()=>{
 const h=componentHarness('OfferRefreshModal.tsx');let calls=0,closed=0,resolve;
 const props={visible:true,cost:7500,coins:10000,busy:false,onClose:()=>closed++,onConfirm:()=>{calls++;return new Promise(r=>resolve=r);}};
 const render=()=>h.render('OfferRefreshModal',props);
 button(render(),'Abbrechen').props.onPress();assert.equal(closed,1);assert.equal(calls,0);
 nodes(render(),'Modal')[0].props.onRequestClose();assert.equal(closed,2);assert.equal(calls,0);
 button(render(),'Schließen').props.onPress();assert.equal(closed,3);
 props.coins=0;assert.equal(button(render(),'Für 7500 M wechseln').props.disabled,true);await button(render(),'Für 7500 M wechseln').props.onPress();assert.equal(calls,0);
 props.coins=10000;const confirm=button(render(),'Für 7500 M wechseln').props.onPress;
 const first=confirm();await confirm();assert.equal(calls,1);button(render(),'Abbrechen').props.onPress();assert.equal(closed,3);
 resolve({state:{}});await first;assert.equal(closed,4);h.unmount();
});
test('Failed offer refresh stays open and permits an explicit retry',async()=>{
 const h=componentHarness('OfferRefreshModal.tsx');let calls=0,closed=0;
 const props={visible:true,cost:7500,coins:10000,busy:false,error:'Keine Verbindung.',onClose:()=>closed++,onConfirm:async()=>{calls++;return undefined;}};
 const render=()=>h.render('OfferRefreshModal',props);
 await button(render(),'Für 7500 M wechseln').props.onPress();assert.equal(closed,0);assert.ok(text(render()).includes('Keine Verbindung.'));
 props.onConfirm=async()=>{calls++;return {state:{}};};await button(render(),'Für 7500 M wechseln').props.onPress();assert.equal(calls,2);assert.equal(closed,1);h.unmount();
});
