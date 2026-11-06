const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {gzipSync,gunzipSync}=require('node:zlib');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
const initial=()=>execute(null,'foundCompany',{companyName:'Geschenktest',cityName:'Testhafen'},now,()=>.5);

const ready=()=>{const g=initial();g.state.inventory.tradeChests=5;g.state.expedition.regions.forEach(r=>r.endlessUnlocked=true);return g;};
test('Trade chest pool retains five equally likely regional cards while direct expedition cards exclude Epic',()=>{
 const {view}=initial();assert.equal(view.tradeChest.price,200);assert.equal(view.tradeChest.count,0);
 for(const gift of view.catalog.gifts){
  assert.equal(gift.cards.length,5);assert.equal(gift.cost,200);assert.ok(gift.cards.every(card=>card.chance===20));
  const direct=view.expeditionMap[gift.region].finds.cards;assert.deepEqual(direct.map(c=>c.chance),[7.5,7.5,10,5]);assert.ok(!direct.some(c=>c.rarity==='epic'));
 }
});
test('Every advertised regional chest card is obtainable from one universal chest without spending Taler',()=>{
 const original=ready();
 for(const gift of original.view.catalog.gifts)for(let i=0;i<gift.cards.length;i++){
  const result=execute(original.state,'chestOpen',{region:gift.region,price:0,cardId:'navigator'},now,()=>(i+.5)/5);
  assert.equal(result.view.giftFind.cardId,gift.cards[i].id);assert.equal(result.state.inventory.tradeChests,4);assert.equal(result.state.coins,original.state.coins);
 }
 assert.equal(original.state.inventory.tradeChests,5);
});
test('Chest duplicates give one matching shard while ownership and parked upgrades survive save reload',()=>{
 let g=ready();g.state.expedition.characters.navigator={level:7,progress:3,parkedTruck:{custom:true}};
 const old=JSON.stringify(g.state.expedition.characters.navigator),shards=g.state.expedition.shards.common;
 g=execute(g.state,'giftOpen',{region:0},now,()=>0);assert.equal(g.view.giftFind.duplicate,true);assert.equal(g.state.expedition.shards.common,shards+1);assert.equal(JSON.stringify(g.state.expedition.characters.navigator),old);
 g=execute(g.state,'chestOpen',{region:4},now,()=>.999);assert.equal(g.view.giftFind.cardId,'r5_epic');
 const restored=execute(JSON.parse(JSON.stringify(g.state)),'sync',{},now,()=>.5);assert.deepEqual(restored.state.expedition.characters,g.state.expedition.characters);assert.equal(restored.view.tradeChest.count,3);
});
test('Chest purchase enforces 200 Hermes; opening requires stock and an unlocked region',()=>{
 const g=initial();g.state.premiumShop.balance=199;const before=JSON.stringify(g.state);
 assert.throws(()=>execute(g.state,'tradeChestBuy',{price:0},now),/Nicht genügend Hermes/);assert.equal(JSON.stringify(g.state),before);
 g.state.premiumShop.balance=200;const bought=execute(g.state,'tradeChestBuy',{price:0,amount:100},now);assert.equal(bought.state.premiumShop.balance,0);assert.equal(bought.view.tradeChest.count,1);assert.equal(bought.state.coins,g.state.coins);
 const locked=execute(bought.state,'chestOpen',{region:4},now);assert.equal(locked.view.giftFind,undefined);assert.equal(locked.view.tradeChest.count,1);
 const opened=execute(locked.state,'chestOpen',{region:0},now,()=>.999);assert.equal(opened.view.tradeChest.count,0);assert.equal(opened.view.giftFind.cardId,'r1_uncommon_2');
 const empty=execute(opened.state,'giftOpen',{region:0},now);assert.equal(empty.view.giftFind,undefined);assert.equal(empty.view.tradeChest.count,0);
 for(const region of [-1,5,1.1,'1',null])assert.throws(()=>execute(g.state,'chestOpen',{region},now));
 assert.throws(()=>execute(null,'tradeChestBuy',{},now),/Firma/);
});
test('Completed regions award one universal chest each exactly once including migrated saves',()=>{
 const g=initial();g.state.expedition.regions.forEach(r=>Object.assign(r,{discovered:7,deliveries:Array(7).fill(true),endlessUnlocked:true,moduleAwarded:true,finalClaimed:true,customerUnlocked:true}));
 const claimed=execute(g.state,'sync',{},now);assert.equal(claimed.view.tradeChest.count,5);assert.deepEqual(claimed.state.tradeChestRegions,[0,1,2,3,4]);
 const again=execute(JSON.parse(JSON.stringify(claimed.state)),'sync',{},now);assert.equal(again.view.tradeChest.count,5);
 const reset=execute(again.state,'reset',{},now);assert.equal(reset.state.inventory.tradeChests,5);assert.deepEqual(reset.state.tradeChestRegions,[0,1,2,3,4]);
});
test('Callable receipt retries buy and open one chest without charging or granting twice',async()=>{
 const base=ready();base.state.premiumShop.balance=200;const records=new Map([['players/test',{snapshot:gzipSync(JSON.stringify(base.state))}]]);
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
  if(name==='./response-cache.cjs')return require('../functions/src/response-cache.cjs');
  if(name==='./event-store.cjs')return require('../functions/src/event-store.cjs');
  if(name==='node:zlib')return {gzipSync,gunzipSync};
  throw Error(name);
 };
 const context=vm.createContext({exports:{},require:fakeRequire,console,Date,Buffer});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../functions/src/index.cjs'),'utf8'),context);
 const purchase={auth:{uid:'test'},data:{action:'tradeChestBuy',payload:{},requestId:'test-chest-buy-request-0001'}};
 await context.exports.game(purchase);await context.exports.game(purchase);
 const purchased=JSON.parse(gunzipSync(records.get('players/test').snapshot).toString());assert.equal(purchased.premiumShop.balance,0);assert.equal(purchased.inventory.tradeChests,6);
 const request={auth:{uid:'test'},data:{action:'chestOpen',payload:{region:1},requestId:'test-gift-request-0001'}};
 const first=await context.exports.game(request);
 const second=await context.exports.game(request);
 assert.equal(JSON.stringify(second.giftFind),JSON.stringify(first.giftFind));
 const saved=JSON.parse(gunzipSync(records.get('players/test').snapshot).toString());
 assert.equal(saved.coins,base.state.coins);assert.equal(saved.inventory.tradeChests,5);assert.equal(saved.premiumShop.balance,0);
 assert.equal(saved.expedition.shards.epic,0);
 assert.ok(saved.expedition.characters.r2_epic);
 assert.equal(records.get('players/test').revision,2);
});

test('Callable receipt retry preserves the crate find without spending a second daily opening',async()=>{
 const base=initial();base.state.xp=1000;const records=new Map([['players/test',{snapshot:gzipSync(JSON.stringify(base.state))}]]);
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
  if(name==='./response-cache.cjs')return require('../functions/src/response-cache.cjs');
  if(name==='./event-store.cjs')return require('../functions/src/event-store.cjs');
  if(name==='node:zlib')return {gzipSync,gunzipSync};
  throw Error(name);
 };
 const context=vm.createContext({exports:{},require:fakeRequire,console,Date,Buffer});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../functions/src/index.cjs'),'utf8'),context);
 const request={auth:{uid:'test'},data:{action:'hubCrate',payload:{},requestId:'test-hub-crate-request-0001'}};
 const first=await context.exports.game(request);
 const second=await context.exports.game(request);
 assert.equal(first.hubCrateParts,20);assert.equal(second.hubCrateParts,20);
 const saved=JSON.parse(gunzipSync(records.get('players/test').snapshot).toString());
 assert.equal(saved.coins,base.state.coins);assert.equal(saved.inventory.hubVehicleParts,20);assert.equal(saved.hubCrates.opened,1);
 assert.equal(records.get('players/test').revision,1);
});
