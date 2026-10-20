const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {gzipSync,gunzipSync}=require('node:zlib');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
const initial=()=>execute(null,'foundCompany',{companyName:'Geschenktest',cityName:'Testhafen'},now,()=>.5);

test('Every region has exactly five stable cards and the same disclosed gift and expedition pool',()=>{
 const game=initial(),{view}=game;
 assert.equal(view.catalog.cards.length,25);
 assert.equal(new Set(view.catalog.cards.map(c=>c.id)).size,25);
 const original=['navigator','r1_uncommon','r1_rare','r2_common','disponent','r2_rare','r3_common','r3_uncommon','forscherin','r4_common','r4_uncommon','logistiker','r5_common','r5_uncommon','pionierin'];
 for(const id of original)assert.ok(view.catalog.cards.some(c=>c.id===id),id);
 for(const gift of view.catalog.gifts){
  assert.equal(gift.cost,10);assert.equal(gift.cards.length,5);
  const counts=Object.fromEntries(['common','uncommon','rare','epic'].map(r=>[r,gift.cards.filter(c=>c.rarity===r).length]));
  assert.deepEqual(counts,gift.region===0?{common:2,uncommon:2,rare:1,epic:0}:{common:2,uncommon:1,rare:1,epic:1});
  assert.ok(counts.epic<=1&&counts.rare<=2);
  assert.ok(Math.abs(gift.cards.reduce((s,c)=>s+c.chance,0)-100)<1e-8);
  assert.deepEqual(gift.cards.map(c=>c.id),view.expeditionMap[gift.region].finds.cards.map(c=>c.id));
  for(const card of gift.cards){
   const expedition=view.expeditionMap[gift.region].finds.cards.find(c=>c.id===card.id);
   assert.ok(Math.abs(expedition.chance-card.chance/10)<1e-8);
   assert.ok(Number.isFinite(view.cardBonuses[card.id]));
   assert.ok(view.cardVehicles[card.id].capacity>0);
  }
 }
});
test('Every advertised card can actually be opened and found in its expedition without altering the job odds',()=>{
 const initialGame=initial();
 for(const gift of initialGame.view.catalog.gifts){
  let start=0;
  for(const card of gift.cards){
   const roll=(start+card.chance/2)/100;start+=card.chance;
   const state=structuredClone(initialGame.state);
   for(const r of state.expedition.regions)r.endlessUnlocked=true;
   state.expedition.points=50;
   const saved=JSON.stringify(state);
   const giftResult=execute(state,'giftOpen',{region:gift.region,price:0,cardId:'r5_epic'},now,()=>roll);
   assert.equal(giftResult.view.giftFind.cardId,card.id);
   assert.equal(giftResult.state.coins,state.coins-10);
   assert.equal(giftResult.state.expedition.points,50);
   assert.equal(JSON.stringify(state),saved,'Do not mutate the input save');
   const found=execute(state,'draw',{region:gift.region},now,()=>roll*.1);
   assert.equal(found.view.expeditionFind.title,card.name);
   assert.equal(found.state.expedition.points,45);
   assert.ok(found.state.expedition.characters[card.id]);
  }
 }
});
test('A gift grants exactly one card, duplicates grant exactly one matching shard and preserve levels and upgrades',()=>{
 let game=initial();game.state.expedition.characters.navigator={level:7,progress:3,parkedTruck:{custom:true}};
 const before=JSON.stringify(game.state.expedition.characters.navigator);
 const shards=game.state.expedition.shards.common;
 game=execute(game.state,'giftOpen',{region:0},now,()=>0);
 assert.deepEqual(game.view.giftFind,{cardId:'navigator',region:0,duplicate:true,shards:1});
 assert.equal(game.state.expedition.shards.common,shards+1);
 assert.equal(JSON.stringify(game.state.expedition.characters.navigator),before);
 let fresh=initial();
 fresh=execute(fresh.state,'giftOpen',{region:1},now,()=>.999);
 assert.equal(fresh.view.giftFind.cardId,'r2_epic');assert.equal(fresh.view.giftFind.duplicate,false);
 assert.deepEqual(fresh.state.expedition.characters.r2_epic,{level:1,progress:0});
 const duplicate=execute(fresh.state,'giftOpen',{region:1},now,()=>.999);
 assert.equal(duplicate.state.expedition.shards.epic,1);
 const upgraded=execute(duplicate.state,'cardUpgrade',{id:'r2_epic'},now,()=>.5);
 assert.equal(upgraded.state.expedition.characters.r2_epic.level,2);
 assert.equal(upgraded.state.expedition.shards.epic,0);
 const garage=execute(upgraded.state,'garageAdd',{id:'r2_epic'},now,()=>.5);
 assert.ok(garage.state.trucks.some(t=>t.cardId==='r2_epic'));
 assert.ok(Number.isFinite(garage.view.cardVehicles.r2_epic.speed));
});
test('Gift price is server-owned, exact balance is accepted, and insufficient or invalid requests award nothing',()=>{
 const game=initial();
 for(const coins of [0,9,9.99]){
  const state=structuredClone(game.state);state.coins=coins;
  const failed=execute(state,'giftOpen',{region:4,cost:0},now,()=>.999);
  assert.equal(failed.state.coins,coins);assert.equal(failed.view.giftFind,undefined);
  assert.deepEqual(failed.state.expedition.characters,state.expedition.characters);
 }
 game.state.coins=10;
 const exact=execute(game.state,'giftOpen',{region:4},now,()=>.999);
 assert.equal(exact.state.coins,0);assert.ok(exact.view.giftFind);
 for(const region of [-1,5,1.1,'1',null])assert.throws(()=>execute(game.state,'giftOpen',{region},now));
 assert.throws(()=>execute(null,'giftOpen',{region:0},now),/Firma/);
});
test('Epic ownership, shards and bonus survive JSON save round trips without retroactively changing existing cards',()=>{
 let game=initial();game=execute(game.state,'giftOpen',{region:4},now,()=>.999);
 game.state.expedition.shards.epic=7;
 const restored=execute(JSON.parse(JSON.stringify(game.state)),'sync',{},now,()=>.5);
 assert.deepEqual(restored.state.expedition.characters,game.state.expedition.characters);
 assert.equal(restored.state.expedition.shards.epic,7);
 assert.equal(restored.view.cardBonuses.r5_epic,8);
 assert.deepEqual(restored.state.trucks,game.state.trucks);
});
test('Callable receipt retry returns the same gift without charging or granting twice',async()=>{
 const base=initial(),records=new Map([['players/test',{snapshot:gzipSync(JSON.stringify(base.state))}]]);
 const ref=p=>({path:p,collection:name=>({doc:id=>ref(p+'/'+name+'/'+id)})});
 const db={doc:ref,runTransaction:async work=>work({
  get:async r=>({exists:records.has(r.path),data:()=>records.get(r.path)}),
  set:(r,value)=>records.set(r.path,value)
 })};
 const fakeRequire=name=>{
  if(name==='firebase-functions/v2/https')return {onCall:(_options,handler)=>handler,HttpsError:class extends Error{}};
  if(name==='firebase-admin/app')return {initializeApp(){}};
  if(name==='firebase-admin/firestore')return {getFirestore:()=>db,Timestamp:{fromMillis:value=>value}};
  if(name==='./engine.cjs')return {execute:(state,action,payload)=>execute(state,action,payload,now,()=>.999)};
  if(name==='node:zlib')return {gzipSync,gunzipSync};
  throw Error(name);
 };
 const context=vm.createContext({exports:{},require:fakeRequire,console,Date,Buffer});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../functions/src/index.cjs'),'utf8'),context);
 const request={auth:{uid:'test'},data:{action:'giftOpen',payload:{region:1},requestId:'test-gift-request-0001'}};
 const first=await context.exports.game(request);
 const second=await context.exports.game(request);
 assert.equal(JSON.stringify(second.giftFind),JSON.stringify(first.giftFind));
 const saved=JSON.parse(gunzipSync(records.get('players/test').snapshot).toString());
 assert.equal(saved.coins,base.state.coins-10);
 assert.equal(saved.expedition.shards.epic,0);
 assert.ok(saved.expedition.characters.r2_epic);
 assert.equal(records.get('players/test').revision,1);
});
