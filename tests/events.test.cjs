const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000, fixed=()=>.5;
const id='large-project-own-overtime';
const initial=()=>execute(null,'start',{id:'hamburg'},now,fixed);

test('Event lifecycle persists across sync and starts a fresh numbered run without spending resources',()=>{
 const base=initial();
 assert.equal(base.view.testEvents.length,1);
 assert.equal(base.view.testEvents[0].status,'available');
 assert.equal(base.state.eventTests,undefined);
 const started=execute(base.state,'eventStart',{id,run:0},now,fixed);
 assert.equal(started.view.testEvents[0].status,'running');
 assert.equal(started.state.eventTests[id].startedAt,now);
 const unchanged={...started.state};delete unchanged.eventTests;
 assert.deepEqual(unchanged,base.state,'Lifecycle cannot spend coins, overtime, refills or assign fleets');
 assert.equal(base.state.eventTests,undefined,'Input state remains untouched');
 const restored=execute(JSON.parse(JSON.stringify(started.state)),'sync',{},now+1000,fixed);
 assert.equal(restored.view.testEvents[0].status,'running');
 assert.equal(restored.view.testEvents[0].run,1);
 const ended=execute(restored.state,'eventEnd',{id,run:1},now+2000,fixed);
 assert.equal(ended.view.testEvents[0].status,'ended');
 assert.equal(ended.state.eventTests[id].endedAt,now+2000);
 const restarted=execute(ended.state,'eventStart',{id,run:1},now+3000,fixed);
 assert.equal(restarted.view.testEvents[0].status,'running');
 assert.equal(restarted.view.testEvents[0].run,2);
 assert.equal(restarted.state.eventTests[id].startedAt,now+3000);
 assert.equal(restarted.state.eventTests[id].endedAt,null);
 const reset=execute(restarted.state,'reset',{},now+3000,fixed);
 assert.equal(reset.view.testEvents[0].status,'available');
});

test('Event commands reject unknown events, duplicate starts, invalid transitions and stale runs',()=>{
 const base=initial();
 assert.throws(()=>execute(base.state,'eventStart',{id:'invented',run:0},now,fixed),/Unbekanntes Event/);
 assert.throws(()=>execute(base.state,'eventEnd',{id,run:0},now,fixed),/läuft nicht/);
 assert.throws(()=>execute(base.state,'eventStart',{id,run:-1},now,fixed),/Ungültige Zahl/);
 assert.throws(()=>execute(base.state,'eventStart',{id},now,fixed),/Ungültige Zahl/);
 const started=execute(base.state,'eventStart',{id,run:0},now,fixed);
 assert.throws(()=>execute(started.state,'eventStart',{id,run:1},now,fixed),/läuft bereits/);
 assert.throws(()=>execute(started.state,'eventStart',{id,run:0},now,fixed),/aktualisieren/);
 const ended=execute(started.state,'eventEnd',{id,run:1},now,fixed);
 const restarted=execute(ended.state,'eventStart',{id,run:1},now,fixed);
 assert.throws(()=>execute(restarted.state,'eventEnd',{id,run:1},now,fixed),/aktualisieren/);
 assert.throws(()=>execute(null,'eventStart',{id,run:0},now,fixed),/Firma gründen/);
});
