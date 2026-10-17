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
  const start=await call('start',{id:'hamburg'});assert.equal(start.state.coins,1000);
  const id=crypto.randomUUID();const once=await call('testCoins',{},id),twice=await call('testCoins',{},id);
  assert.equal(once.state.coins,51000);assert.equal(twice.state.coins,51000);
  const protectedState=await call('sync',{coins:1e15});assert.equal(protectedState.state.coins,51000);
  const unauth=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:{action:'sync'}})});
  assert.equal(unauth.status,401);
  await call('reset');
  console.log('Live backend smoke test passed: guest auth, persistence, command deduplication and authentication checks.');
 }finally{await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:auth.idToken})});}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
