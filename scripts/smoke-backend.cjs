const assert=require('node:assert/strict'),crypto=require('node:crypto');
const key='AIzaSyBfeWgspE82Mnu5D0S6m65-vwRcuWPtPJ0';
const endpoint='https://europe-west3-linienimperium.cloudfunctions.net/game';
const {createResponseCache}=require('../src/gameTransport');
async function main(){
 const auth=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({returnSecureToken:true})}).then(r=>r.json());
 if(!auth.idToken)throw Error('Anonymous sign-in failed: '+JSON.stringify(auth.error));
 async function call(action,payload={},requestId=crypto.randomUUID(),responseCache){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${auth.idToken}`},body:JSON.stringify({data:{action,payload,requestId,...(responseCache?{responseCache}:{})}})});
  const result=await response.json();if(result.error)throw Error(JSON.stringify(result.error));return result.result||result.data;
 }
 try {
  const guest=await call('sync');assert.equal(guest.state.startCity,null);assert.ok(guest.catalog,'legacy client still receives full display chunks');
  const displayCache=createResponseCache(),uid=auth.localId;
  const first=await call('sync',{},crypto.randomUUID(),displayCache.request(uid));
  assert.equal(first.responseCache.version,1);assert.ok(first.catalog);displayCache.hydrate(uid,first);
  const lean=await call('sync',{},crypto.randomUUID(),displayCache.request(uid));
  assert.equal(lean.catalog,undefined);assert.equal(lean.help,undefined);assert.equal(lean.transportUpgradeOptions,undefined);
  const hydrated=displayCache.hydrate(uid,lean);
  assert.equal(hydrated.catalog.cards.length,guest.catalog.cards.length);assert.deepEqual(hydrated.help,guest.help);assert.equal(hydrated.state.startCity,null);assert.ok(hydrated.serverTime>=guest.serverTime);
  assert.deepEqual(displayCache.request('different-test-account').hashes,{},'display cache never carries fingerprints across accounts');
  const start=await call('foundCompany',{companyName:'Live Testfirma',cityName:'Testhafen'});assert.equal(start.state.coins,1000);assert.equal(start.state.profile.cityName,'Testhafen');assert.equal(start.state.startCity,'headquarters');
  const id=crypto.randomUUID();const once=await call('testCoins',{},id),twice=await call('testCoins',{},id);
  assert.equal(once.state.coins,51000);assert.equal(twice.state.coins,51000);
  const protectedState=await call('sync',{coins:1e15});assert.equal(protectedState.state.coins,51000);
  assert.equal(protectedState.expeditionMap.length,5);
  assert.equal(protectedState.catalog.cards.length,25);
  assert.ok(protectedState.catalog.cards.every(card=>typeof card.artKey==='string'&&card.artKey.length>0));
  assert.equal(protectedState.catalog.cards.find(card=>card.id==='navigator').name,'Eselkarren');
  assert.equal(protectedState.cardVehicles.navigator.capacity,2);
  assert.deepEqual(protectedState.catalog.cards.find(card=>card.id==='r3_uncommon').bonusLevels,[5,10,15,20,25,30,40,50,60,70]);
  assert.equal(protectedState.expeditionMap[0].customer.id,'nordbau');
  assert.deepEqual(protectedState.procurement.sites.map(s=>s.price),[8000,12000,16000,20000,24000]);
  assert.ok(protectedState.procurement.sites.every(s=>!s.unlocked));
  assert.equal(protectedState.procurement.completed,0);
  await assert.rejects(()=>call('procurementStart',{region:0,truck:protectedState.state.trucks[0].id,mode:'count',amount:1}),/freigeschaltet/);
  const emptyClaim=await call('procurementClaim');assert.equal(emptyClaim.state.coins,51000);
  assert.equal(emptyClaim.procurement.pending.common,0);
  const expedition=await call('testGrant',{kind:'expedition',amount:100});assert.equal(expedition.state.expedition.points,150);
  const overtime=await call('testGrant',{kind:'overtime',amount:100});assert.equal(overtime.state.overtimePoints,200);
  const xpId=crypto.randomUUID();await call('testGrant',{kind:'xp',amount:100},xpId);
  const xp=await call('testGrant',{kind:'xp',amount:100},xpId);assert.equal(xp.state.xp,100);assert.equal(xp.state.inventory.overtimeRefills,1);assert.equal(xp.state.inventory.expeditionRefills,1);assert.equal(xp.state.expedition.points,150);
  const expUseId=crypto.randomUUID();await call('expeditionRefill',{},expUseId);const expUsed=await call('expeditionRefill',{},expUseId);assert.equal(expUsed.state.expedition.points,200);assert.equal(expUsed.state.inventory.expeditionRefills,0);
  const otUseId=crypto.randomUUID();await call('refill',{},otUseId);const otUsed=await call('refill',{},otUseId);assert.equal(otUsed.state.overtimePoints,250);assert.equal(otUsed.state.inventory.overtimeRefills,0);
  const unauth=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:{action:'sync'}})});
  assert.equal(unauth.status,401);
  const season=await call('seasonStart');assert.equal(season.seasonPass.status,'active');assert.equal(season.seasonPass.dailies.length,4);assert.equal(season.seasonPass.price,1000);assert.equal(season.seasonPass.level,0);assert.ok(season.seasonPass.endsAt>season.serverTime);
  const sealsId=crypto.randomUUID();await call('testHermes',{},sealsId);const seals=await call('testHermes',{},sealsId);assert.equal(seals.premiumShop.balance,1000);
  const passId=crypto.randomUUID();await call('seasonPassBuy',{id:season.seasonPass.id},passId);const pass=await call('seasonPassBuy',{id:season.seasonPass.id},passId);assert.equal(pass.premiumShop.balance,0);assert.equal(pass.seasonPass.premium,true);
  const rotated=await call('seasonDailyReset',{seasonId:pass.seasonPass.id,dailyVersion:pass.seasonPass.dailyVersion});assert.equal(rotated.seasonPass.dailyVersion,pass.seasonPass.dailyVersion+1);
  const resetSeason=await call('seasonReset');assert.equal(resetSeason.seasonPass.status,'inactive');assert.equal(resetSeason.seasonPass.points,0);
  await call('reset');
  console.log('Live backend smoke test passed: legacy and negotiated display responses, cache hydration and UID isolation, guest auth, persistence, command deduplication, expedition map, test grants, level rewards, procurement prices/unlock guards/empty claims authentication checks, Season start/calendar, four dailies, test-seal grant deduplication, Premium purchase deduplication, daily rotation and season reset.');
 }finally{await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:auth.idToken})});}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
