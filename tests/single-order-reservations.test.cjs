const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000,random=()=>.5;
function setup(){const result=execute(null,'start',{id:'hamburg'},now,random);result.state.coins=100000;result.state.nextAutoRefreshAt=now+1000;const offer=result.view.state.orders.find(order=>order.choices.length);return {state:result.state,id:offer.id,truck:offer.choices[0].id};}
const run=(state,action,payload={},at=now)=>execute(state,action,payload,at,random);
test('Picker lease crosses automatic refresh with fixed server deadline and full replacement batch',()=>{
 const {state,id,truck}=setup(),reserved=run(state,'reserveOrder',{order:id});
 const hold=reserved.view.pickerReservation;assert.equal(hold.expiresAt,now+30000);
 const refreshed=run(reserved.state,'sync',{},now+1000);
 assert.equal(refreshed.state.orders.filter(order=>order.status==='available').length,state.orders.length+1);
 assert.equal(refreshed.state.orders.find(order=>order.id===id).pickerReservation.displaced,true);
 const repeated=run(refreshed.state,'reserveOrder',{order:id},now+20000);
 assert.equal(repeated.view.pickerReservation.expiresAt,hold.expiresAt);assert.equal(repeated.view.pickerReservation.token,hold.token);
 const started=run(repeated.state,'assign',{order:id,truck,reservationToken:hold.token},now+29999);
 assert.equal(started.state.orders.find(order=>order.id===id).status,'active');assert.equal(started.state.orders.find(order=>order.id===id).pickerReservation,undefined);
});
test('At exactly 30 seconds only displaced offers expire and cannot be revived by reserve or assign',()=>{
 const {state,id,truck}=setup(),reserved=run(state,'reserveOrder',{order:id}),hold=reserved.view.pickerReservation;
 const displaced=run(reserved.state,'sync',{},now+1000),expired=run(displaced.state,'sync',{},now+30000);
 assert.ok(!expired.state.orders.some(order=>order.id===id));
 for(const action of ['reserveOrder','assign'])assert.throws(()=>run(displaced.state,action,{order:id,truck,reservationToken:hold.token},now+30000),/Haltezeit ist abgelaufen/);
 assert.throws(()=>run(state,'reserveOrder',{order:id},now+1000),/Haltezeit ist abgelaufen/);
});
test('Undisplaced offers remain assignable after expiry; repeated reserve does not renew them',()=>{
 const {state,id,truck}=setup();state.nextAutoRefreshAt=now+900000;
 const reserved=run(state,'reserveOrder',{order:id}),synced=run(reserved.state,'sync',{},now+30000);
 const repeated=run(synced.state,'reserveOrder',{order:id},now+40000);
 assert.equal(repeated.view.pickerReservation.expiresAt,now+30000);
 const started=run(repeated.state,'assign',{order:id,truck,reservationToken:reserved.view.pickerReservation.token},now+40000);
 assert.equal(started.state.orders.find(order=>order.id===id).status,'active');
});
test('Manual refresh preserves lease without using pin slots; close removes only displaced offers',()=>{
 const {state,id}=setup();state.nextAutoRefreshAt=now+900000;
 const reserved=run(state,'reserveOrder',{order:id}),token=reserved.view.pickerReservation.token;
 assert.equal(reserved.state.orders.filter(order=>order.pinned).length,0);
 const refreshed=run(reserved.state,'refresh',{},now+100);
 assert.ok(refreshed.state.orders.find(order=>order.id===id)?.pickerReservation.displaced);
 const released=run(refreshed.state,'releaseOrderReservation',{order:id,token},now+200);
 assert.ok(!released.state.orders.some(order=>order.id===id));
 const ordinary=run(reserved.state,'releaseOrderReservation',{order:id,token},now+200);
 assert.ok(ordinary.state.orders.some(order=>order.id===id));
 const reopened=run(ordinary.state,'reserveOrder',{order:id},now+300);
 assert.notEqual(reopened.view.pickerReservation.token,token);
 const stale=run(reopened.state,'releaseOrderReservation',{order:id,token},now+400);
 assert.equal(stale.state.orders.find(order=>order.id===id).pickerReservation.token,reopened.view.pickerReservation.token);
 assert.throws(()=>run(stale.state,'assign',{order:id,truck:'invalid',reservationToken:token},now+500),/Haltezeit ist abgelaufen/);
});
test('Pinned, queued, saved, private and running orders are not removed by picker expiry or release',()=>{
 const {state,id,truck}=setup();state.nextAutoRefreshAt=now+900000;
 const reserved=run(state,'reserveOrder',{order:id});
 const pinned=run(reserved.state,'pin',{id},now+100);
 assert.equal(run(pinned.state,'reserveOrder',{order:id},now+200).view.pickerReservation,null);
 assert.ok(run(pinned.state,'sync',{},now+900000).state.orders.find(order=>order.id===id)?.pinned);
 assert.equal(run(pinned.state,'assign',{order:id,truck,reservationToken:reserved.view.pickerReservation.token},now+30000).state.orders.find(order=>order.id===id).status,'active');
 for(const patch of [{status:'queued',customer:'nordbau'},{status:'active'},{saved:true},{kind:'private'},{crafted:true}]){
  const copy=JSON.parse(JSON.stringify(reserved.state)),order=copy.orders.find(order=>order.id===id);Object.assign(order,patch);order.pickerReservation.displaced=true;
  const cleaned=run(copy,'releaseOrderReservation',{order:id,token:reserved.view.pickerReservation.token},now+30000);
  assert.ok(cleaned.state.orders.some(order=>order.id===id),JSON.stringify(patch));
 }
});
