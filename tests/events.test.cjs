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

function assignedFixture(){
 let result=initial();
 result=execute(result.state,'seat',{id:'navigator',template:0,seat:0},now,fixed);
 result.state.expedition.characters.r1_rare={level:1,progress:0};
 result=execute(result.state,'seat',{id:'r1_rare',template:0,seat:1},now,fixed);
 result=execute(result.state,'eventStart',{id,run:0},now,fixed);
 return execute(result.state,'eventFleet',{id,run:1,template:0},now,fixed);
}

test('Unbounded event uses the saved fleet timings and settles offline without double counting or main-game rewards',()=>{
 const assigned=assignedFixture();
 const event=assigned.view.testEvents[0];
 assert.equal(event.rarity,'legendary');assert.equal(event.unlimited,true);
 assert.equal(event.project.vehicles.length,2);
 assert.equal(event.project.delivered,0);
 assert.ok(event.project.vehicles.every(vehicle=>Number.isFinite(vehicle.cycleMs)&&vehicle.cycleMs>0));
 const at=now+3*86400000;
 const result=execute(assigned.state,'sync',{},at,fixed);
 const project=result.state.eventTests[id].project;
 const expectedTons=event.project.vehicles.reduce((sum,v)=>sum+Math.floor((at-now)/v.cycleMs)*v.capacity,0);
 const expectedTours=event.project.vehicles.reduce((sum,v)=>sum+Math.floor((at-now)/v.cycleMs),0);
 assert.equal(project.delivered,expectedTons);
 assert.equal(project.tours,expectedTours);
 assert.equal(project.tonKm,expectedTons*event.distance);
 assert.equal(project.km,expectedTours*event.distance*2);
 assert.equal(result.view.testEvents[0].status,'running','No automatic completion from a finite target');
 const again=execute(JSON.parse(JSON.stringify(result.state)),'sync',{},at,fixed);
 assert.deepEqual(again.state.eventTests,result.state.eventTests,'Reloading cannot pay a tour twice');
 const control=JSON.parse(JSON.stringify(assigned.state));delete control.eventTests;
 const normal=execute(control,'sync',{},at,fixed);
 const actual={...result.state};delete actual.eventTests;
 assert.deepEqual(actual,normal.state,'Event output is isolated from ordinary resources, projects, XP and statistics');
 const earlier=execute(result.state,'sync',{},now,fixed);
 assert.equal(earlier.state.eventTests[id].project.delivered,expectedTons,'Clock rollback cannot reduce recorded output');
});

test('Fleet snapshot survives edits; ending freezes production and restarting discards the previous project',()=>{
 const assigned=assignedFixture();
 const original=JSON.parse(JSON.stringify(assigned.state.eventTests[id].project.vehicles.filter(v=>v.cardId)));
 const edited=JSON.parse(JSON.stringify(assigned.state));
 edited.expedition.seats.fill(null);
 edited.trucks[0].capacity=100;
 edited.trucks[0].rarityLevel=50;
 edited.expedition.characters.r1_rare.level=10;
 const cycle=Math.min(...original.map(v=>v.cycleMs))/2;
 const ended=execute(edited,'eventEnd',{id,run:1},now+cycle,fixed);
 assert.equal(ended.state.eventTests[id].project.vehicles[0].capacity,original[0].capacity);
 assert.equal(ended.state.eventTests[id].project.vehicles[0].cycleMs,original[0].cycleMs);
 assert.equal(ended.state.eventTests[id].project.delivered,0,'Ending mid-tour does not deliver unfinished cargo');
 const later=execute(ended.state,'sync',{},now+cycle+86400000,fixed);
 assert.deepEqual(later.state.eventTests,ended.state.eventTests);
 const restart=execute(later.state,'eventStart',{id,run:1},now+cycle+86400000,fixed);
 assert.equal(restart.state.eventTests[id].project,undefined);
 assert.equal(restart.view.testEvents[0].fleetOptions.length,3);
});

test('Only an owned, nonempty fleet can be assigned to the current running event once',()=>{
 const base=initial();
 assert.throws(()=>execute(base.state,'eventFleet',{id,run:0,template:0},now,fixed),/läuft nicht/);
 const started=execute(base.state,'eventStart',{id,run:0},now,fixed);
 assert.throws(()=>execute(started.state,'eventFleet',{id,run:1,template:0},now,fixed),/Fahrzeugkarte/);
 assert.throws(()=>execute(started.state,'eventFleet',{id,run:1,template:3},now,fixed),/Ungültige/);
 started.state.expedition.seats[0]='unowned-card';
 assert.throws(()=>execute(started.state,'eventFleet',{id,run:1,template:0},now,fixed),/Fahrzeugkarte/);
 const assigned=assignedFixture();
 assert.throws(()=>execute(assigned.state,'eventFleet',{id,run:1,template:0},now,fixed),/bereits/);
 assert.throws(()=>execute(assigned.state,'eventFleet',{id,run:0,template:0},now,fixed),/aktualisieren/);
});
