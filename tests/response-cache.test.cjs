const {test}=require('node:test'),assert=require('node:assert/strict');
const {compactResponse}=require('../functions/src/response-cache.cjs');
const {createResponseCache,requestGame}=require('../src/gameTransport');
const view=()=>({state:{coins:100},serverTime:123,catalog:{cards:[{id:'a'}]},transportUpgradeOptions:[{level:0,costs:[100,200]}],help:{intro:'Test'},claimSummary:{coins:12},giftFind:{id:'a'},levelUps:[2]});
test('Legacy clients get full responses; negotiated chunks hydrate exactly and never cache rewards or state',()=>{
 const original=view(),cache=createResponseCache();assert.equal(compactResponse(original),original);
 const first=compactResponse(original,cache.request('a'));assert.deepEqual(cache.hydrate('a',first),original);
 const secondView={...view(),state:{coins:112},serverTime:456,claimSummary:{coins:1},giftFind:null,levelUps:[]};
 const second=compactResponse(secondView,cache.request('a'));
 assert.equal(second.catalog,undefined);assert.equal(second.transportUpgradeOptions,undefined);
 assert.deepEqual(second.state,{coins:112});assert.deepEqual(second.claimSummary,{coins:1});assert.equal(second.giftFind,null);assert.deepEqual(second.levelUps,[]);
 assert.deepEqual(cache.hydrate('a',second),secondView);
});
test('Actual dynamic content changes invalidate costs and account changes discard cached chunks',()=>{
 const cache=createResponseCache(),first=view();cache.hydrate('a',compactResponse(first,cache.request('a')));
 const upgraded={...view(),transportUpgradeOptions:[{level:1,costs:[200]}]};
 const response=compactResponse(upgraded,cache.request('a'));assert.deepEqual(response.transportUpgradeOptions,upgraded.transportUpgradeOptions);
 assert.deepEqual(cache.hydrate('a',response),upgraded);
 assert.deepEqual(cache.request('b').hashes,{});
 assert.throws(()=>cache.hydrate('b',compactResponse(upgraded,{version:1,hashes:response.responseCache.hashes})),e=>e.code==='client/cache-missing');
});
test('Cache values are isolated from consumer mutations; malformed claims cannot suppress response data',()=>{
 const cache=createResponseCache(),initial=cache.hydrate('a',compactResponse(view(),cache.request('a')));
 initial.catalog.cards[0].id='changed';
 const hydrated=cache.hydrate('a',compactResponse(view(),cache.request('a')));assert.equal(hydrated.catalog.cards[0].id,'a');
 hydrated.catalog.cards[0].id='changed again';assert.equal(cache.hydrate('a',compactResponse(view(),cache.request('a'))).catalog.cards[0].id,'a');
 const invalid=compactResponse(view(),{version:1,hashes:Object.fromEntries(Array.from({length:1000},(_,i)=>['bad'+i,'x']))});assert.deepEqual(invalid.catalog,view().catalog);
});
test('Missing cache recovery replays same receipt ID once with full chunks, not a new mutation',async()=>{
 const stale=createResponseCache(),prime=view(),cache=createResponseCache(),calls=[];
 stale.hydrate('a',compactResponse(prime,stale.request('a')));
 const response=await requestGame({uid:'a',currentUid:()=> 'a',cache,action:'giftOpen',requestId:'same-receipt',call:async input=>{calls.push(input);return {data:compactResponse(prime,calls.length===1?stale.request('a'):input.responseCache)};}});
 assert.deepEqual(response,prime);assert.equal(calls.length,2);assert.ok(calls.every(c=>c.requestId==='same-receipt'));assert.deepEqual(calls[1].responseCache.hashes,{});
});
test('Network retries are bounded with jitter and retain ID; account switch and permanent failure do not retry',async()=>{
 let count=0;const waits=[],calls=[],failure=Object.assign(new Error('Unavailable'),{code:'functions/unavailable'});
 const cache=createResponseCache(),options={uid:'a',currentUid:()=> 'a',cache,action:'buy',requestId:'receipt',sleep:async ms=>waits.push(ms),random:()=>.5};
 const actual=await requestGame({...options,call:async input=>{calls.push(input);if(!count++)throw failure;return {data:view()};}});assert.deepEqual(actual,view());assert.equal(waits[0],600);assert.equal(calls.length,2);assert.equal(calls[0].requestId,calls[1].requestId);
 count=0;await assert.rejects(requestGame({...options,call:async()=>{count++;throw failure;}}));assert.equal(count,2);
 count=0;await assert.rejects(requestGame({...options,call:async()=>{count++;throw Object.assign(new Error('Invalid'),{code:'functions/invalid-argument'});}}));assert.equal(count,1);
 let uid='a';await assert.rejects(requestGame({...options,currentUid:()=>uid,call:async()=>{uid='b';return {data:view()};}}),e=>e.code==='client/account-changed');
});
