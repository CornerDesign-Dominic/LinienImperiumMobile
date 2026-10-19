const assert=require('node:assert/strict'),crypto=require('node:crypto');
const key='AIzaSyBfeWgspE82Mnu5D0S6m65-vwRcuWPtPJ0';
const endpoint='https://europe-west3-linienimperium.cloudfunctions.net/game';
async function main(){
 const auth=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({returnSecureToken:true})}).then(r=>r.json());
 if(!auth.idToken)throw Error('Anonymous sign-in failed: '+JSON.stringify(auth.error));
 async function call(action,payload={},requestId=crypto.randomUUID()){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${auth.idToken}`},body:JSON.stringify({data:{action,payload,requestId}})});
  const result=await response.json();if(result.error)throw Error(JSON.stringify(result.error));return result.result||result.data;
 }
 try {
  const guest=await call('sync');assert.equal(guest.state.startCity,null);
  const start=await call('foundCompany',{companyName:'Live Testfirma',cityName:'Testhafen'});assert.equal(start.state.coins,1000);assert.equal(start.state.profile.cityName,'Testhafen');assert.equal(start.state.startCity,'headquarters');
  const id=crypto.randomUUID();const once=await call('testCoins',{},id),twice=await call('testCoins',{},id);
  assert.equal(once.state.coins,51000);assert.equal(twice.state.coins,51000);
  const protectedState=await call('sync',{coins:1e15});assert.equal(protectedState.state.coins,51000);
  assert.equal(protectedState.expeditionMap.length,5);
  assert.equal(protectedState.expeditionMap[0].customer.id,'nordbau');
  const expedition=await call('testGrant',{kind:'expedition',amount:100});assert.equal(expedition.state.expedition.points,150);
  const overtime=await call('testGrant',{kind:'overtime',amount:100});assert.equal(overtime.state.overtimePoints,200);
  const xpId=crypto.randomUUID();await call('testGrant',{kind:'xp',amount:100},xpId);
  const xp=await call('testGrant',{kind:'xp',amount:100},xpId);assert.equal(xp.state.xp,100);assert.equal(xp.state.inventory.overtimeRefills,1);assert.equal(xp.state.inventory.expeditionRefills,1);assert.equal(xp.state.expedition.points,150);
  const expUseId=crypto.randomUUID();await call('expeditionRefill',{},expUseId);const expUsed=await call('expeditionRefill',{},expUseId);assert.equal(expUsed.state.expedition.points,200);assert.equal(expUsed.state.inventory.expeditionRefills,0);
  const otUseId=crypto.randomUUID();await call('refill',{},otUseId);const otUsed=await call('refill',{},otUseId);assert.equal(otUsed.state.overtimePoints,250);assert.equal(otUsed.state.inventory.overtimeRefills,0);
  const unauth=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:{action:'sync'}})});
  assert.equal(unauth.status,401);
  await call('reset');
  console.log('Live backend smoke test passed: guest auth, persistence, command deduplication, expedition map, test grants, level rewards and authentication checks.');
 }finally{await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:auth.idToken})});}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
