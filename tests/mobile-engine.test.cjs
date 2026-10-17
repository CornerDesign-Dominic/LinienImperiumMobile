const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
const fixed=()=>.5;
test('Guest starts without a city, then all five mobile sections receive server view models',()=>{
 const guest=execute(null,'sync',{},now,fixed);
 assert.equal(guest.state.startCity,null);
 const game=execute(guest.state,'start',{id:'hamburg'},now,fixed);
 assert.equal(game.state.coins,1000);assert.equal(game.view.state.trucks.length,1);assert.equal(game.view.state.orders.length,5);assert.equal(game.view.templates.length,3);assert.equal(game.view.catalog.cards.length,15);
 const offer=game.view.state.orders.find(x=>x.choices.length);
 const active=execute(game.state,'assign',{order:offer.id,truck:offer.choices[0].id},now,fixed);
 assert.equal(active.state.orders.find(x=>x.id===offer.id).status,'active');
 const done=execute(active.state,'sync',{},now+86400000,fixed);
 assert.equal(done.state.orders.find(x=>x.id===offer.id).status,'completed');
 const claimed=execute(done.state,'claim',{id:offer.id},now+86400000,fixed);
 const twice=execute(claimed.state,'claim',{id:offer.id},now+86400000,fixed);
 assert.equal(twice.state.coins,claimed.state.coins);
 assert.equal(game.view.catalog.craftedOrderItems,10);
});
test('Untrusted clients cannot set coins, clocks, XP or invent engine commands',()=>{
 const start=execute(null,'start',{id:'hamburg'},now,fixed);
 const result=execute(start.state,'sync',{coins:1e12,xp:1e12,now:now+1e12},now,fixed);
 assert.equal(result.state.coins,1000);assert.equal(result.state.xp,0);assert.equal(result.view.serverTime,now);
 assert.throws(()=>execute(start.state,'__proto__',{},now),/Unbekannte/);
 assert.throws(()=>execute(start.state,'seat',{id:'navigator',template:-1,seat:0},now),/Ungültige/);
 assert.throws(()=>execute(start.state,'transport',{category:'national',kind:'__proto__'},now),/Ungültige/);
});
test('Persisted state is not mutated in place and level packages survive a round trip',()=>{
 const initial=execute(null,'start',{id:'hamburg'},now,fixed);
 const saved=JSON.stringify(initial.state);
 const next=execute(initial.state,'testCoins',{},now,fixed);
 assert.equal(JSON.stringify(initial.state),saved);assert.equal(next.state.coins,51000);
 next.state.inventory.overtimeRefills=2;
 const used=execute(next.state,'refill',{},now,fixed);
 assert.equal(used.state.inventory.overtimeRefills,1);assert.equal(used.state.overtimePoints,200);
 const restored=execute(JSON.parse(JSON.stringify(used.state)),'sync',{},now+600000,fixed);
 assert.equal(restored.state.inventory.overtimeRefills,1);assert.equal(restored.state.overtimePoints,200);
});
