const {test}=require('node:test'),assert=require('node:assert/strict');
const {createRequestCoordinator}=require('../src/requestCoordinator');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function controlled(){const calls=[],changes=[];const queue=createRequestCoordinator(task=>new Promise((resolve,reject)=>calls.push({task,resolve,reject})),state=>changes.push(state));return {queue,calls,changes};}
test('Background sync coalesces, keeps controls free and player actions run before waiting sync',async()=>{
 const {queue,calls,changes}=controlled();const first=queue.enqueue('sync',{}, {background:true});await flush();
 assert.equal(changes.at(-1).foreground,0);assert.equal(queue.enqueue('sync',{}, {background:true}),first);
 const action=queue.enqueue('buy',{id:'one'});assert.equal(changes.at(-1).foreground,1);
 calls[0].resolve('first sync');await first;await flush();assert.equal(calls[1].task.action,'buy');
 const waiting=queue.enqueue('sync',{}, {background:true});assert.equal(queue.enqueue('sync',{}, {background:true}),waiting);
 const second=queue.enqueue('upgrade',{id:'two'});calls[1].resolve('bought');assert.equal(await action,'bought');await flush();
 assert.equal(calls[2].task.action,'upgrade');calls[2].resolve('upgraded');assert.equal(await second,'upgraded');await flush();
 assert.equal(calls[3].task.action,'sync');calls[3].resolve('last sync');assert.equal(await waiting,'last sync');await flush();assert.equal(queue.snapshot().pending,false);
});
test('Duplicate in-flight clicks share one result, but a new click after await runs normally',async()=>{
 const {queue,calls}=controlled();const one=queue.enqueue('claim',{id:'a'}),duplicate=queue.enqueue('claim',{id:'a'});assert.equal(one,duplicate);await flush();assert.equal(calls.length,1);
 calls[0].resolve({coins:10});assert.deepEqual(await one,{coins:10});const next=queue.enqueue('claim',{id:'a'});await flush();assert.equal(calls.length,2);calls[1].resolve({coins:0});await next;
});
test('Failure rejects only its caller, queue continues, and different accounts never share a sync result',async()=>{
 const {queue,calls}=controlled();const old=queue.enqueue('sync',{}, {scope:'old',background:true});const failed=assert.rejects(old,/offline/);await flush();
 const next=queue.enqueue('sync',{}, {scope:'new',background:true}),action=queue.enqueue('hold',{id:'x'},{scope:'new'});calls[0].reject(Error('offline'));await failed;await flush();
 assert.equal(calls[1].task.action,'hold');calls[1].resolve('held');await action;await flush();assert.equal(calls[2].task.scope,'new');calls[2].resolve('new view');assert.equal(await next,'new view');
});
test('Manual refresh joining background sync sets foreground state without a duplicate request; backlog is bounded',async()=>{
 const {queue,calls,changes}=controlled();const bg=queue.enqueue('sync',{}, {background:true});await flush();assert.equal(queue.enqueue('sync'),bg);assert.equal(changes.at(-1).foregroundSync,true);calls[0].resolve('view');await bg;
 const waits=[],small=createRequestCoordinator(task=>new Promise(resolve=>waits.push(resolve)),()=>{},1);const active=small.enqueue('one');await flush();const waiting=small.enqueue('two');await assert.rejects(small.enqueue('three'),{code:'client/queue-full'});waits.shift()(1);await active;await flush();waits.shift()(2);await waiting;
});
