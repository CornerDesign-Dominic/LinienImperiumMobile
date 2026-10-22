'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const {EVENT_ID:id,DAY,scaleEvent,makeWorld,lockWorld}=require('../functions/src/events.cjs');
const T=1800000000000,fixed=()=>.5;
const cmd=(state,action='sync',p={},at=T,ctx={})=>execute(state,action,p,at,fixed,ctx);
function solo(settings={}){let r=cmd(null,'foundCompany',{companyName:'Pyramidentest',cityName:'Steinhafen'});r=cmd(r.state,'seat',{id:'navigator',seat:0,template:0});r=cmd(r.state,'eventStart',{id,run:0,...settings});return cmd(r.state,'eventFleet',{id,run:1,template:0});}
function ev(r){return r.state.eventTests[id];}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} ≠ ${b}`);

test('Regular scaling uses whole millions, bounded one-way km and a frozen five-day schedule',()=>{
 for(const players of [0,1,100,200,500,1000,2000,5000,10000,1000000]){const c=scaleEvent(players);assert.equal(c.target%1000000,0);assert.ok(c.target>=1e6);assert.ok(c.distance>=180&&c.distance<=360);assert.equal(c.durationMs,5*DAY);}
 const world=makeWorld(T);assert.equal(world.startsAt,T+2*DAY);assert.equal(world.endsAt,T+7*DAY);world.registered=1000;lockWorld(world,world.startsAt);const c=structuredClone(world.config);world.registered=2000;lockWorld(world,world.startsAt+DAY);assert.deepEqual(world.config,c);
});
test('Solo presets accept small targets, ignore forged shared mode and reject malformed values',()=>{
 const r=solo({target:100,distance:180,durationHours:2,mode:'community',communityId:'forged'});assert.equal(ev(r).mode,'solo');assert.equal(ev(r).endsAt,T+7200000);assert.equal(ev(r).target,100);assert.equal(ev(r).project.distance,180);
 for(const p of [{target:0},{target:99},{target:1e7},{target:100.1},{distance:1},{distance:361},{durationHours:0},{durationHours:'2'}])assert.throws(()=>solo(p),/Testeinstellung/);
});
test('One-way arrival credits fractional stones once; return keeps vehicle occupied until its own tour boundary',()=>{
 let r=solo(),v=ev(r).project.vehicles[0],arrival=v.arrivalAt,end=v.nextAt,capacity=v.capacity;
 r=cmd(r.state,'sync',{},arrival-1);assert.equal(ev(r).project.delivered,0);
 r=cmd(r.state,'sync',{},arrival);assert.equal(ev(r).project.delivered,capacity);assert.equal(ev(r).project.tours,0);assert.ok(ev(r).project.vehicles[0].deliveredTrip);
 const atReturn=cmd(r.state,'unseat',{template:0,seat:0},arrival+1);assert.equal(ev(atReturn).project.vehicles[0].cardId,'navigator');
 r=cmd(atReturn.state,'sync',{},end);assert.equal(ev(r).project.delivered,capacity);assert.equal(ev(r).project.tours,1);assert.equal(r.view.testEvents[0].project.vehicles.length,0);
 assert.deepEqual(cmd(r.state,'sync',{},end).state.eventTests,r.state.eventTests);
});
test('Automatic deadline settles only arrivals at or before the deadline, not a later offline period',()=>{
 const r=solo({durationHours:2}),v=ev(r).project.vehicles[0],end=ev(r).endsAt;
 const count=Math.floor((end-v.arrivalAt)/v.cycleMs)+1;
 const ended=cmd(r.state,'sync',{},T+10*DAY);assert.equal(ev(ended).status,'ended');assert.equal(ev(ended).endedAt,end);close(ev(ended).project.delivered,count*v.capacity);
 assert.deepEqual(cmd(ended.state,'sync',{},T+20*DAY).state.eventTests,ended.state.eventTests);
 assert.throws(()=>cmd(ended.state,'eventOvertime',{id,run:1,amount:1},T+10*DAY),/laufenden Event/);
});
test('Outward arrival exactly on the deadline counts; one millisecond later does not',()=>{
 const base=solo(),arrival=ev(base).project.vehicles[0].arrivalAt,capacity=ev(base).project.vehicles[0].capacity;
 for(const offset of [-1,0,1]){const state=structuredClone(base.state);state.eventTests[id].endsAt=arrival+offset;const r=cmd(state,'sync',{},arrival+1000);assert.equal(ev(r).project.delivered,offset<0?0:capacity);}
});
test('Sparse synchronization matches frequent sync including partial return legs and the five-day cutoff',()=>{
 const initial=solo(),until=T+6*DAY;let frequent=initial;
 for(let i=1;i<=30;i++)frequent=cmd(frequent.state,'sync',{},T+(until-T)*i/30);
 const offline=cmd(initial.state,'sync',{},until);close(ev(offline).project.delivered,ev(frequent).project.delivered);assert.equal(ev(offline).project.tours,ev(frequent).project.tours);assert.equal(ev(offline).project.km,ev(frequent).project.km);
});
test('Overtime buys exactly 1,000 tkm per point at each distance without changing active tours or main XP',()=>{
 for(const distance of [180,240,360]){let r=solo({distance}),v=structuredClone(ev(r).project.vehicles),xp=r.state.xp,coins=r.state.coins,points=r.state.overtimePoints;r=cmd(r.state,'eventOvertime',{id,run:1,amount:5});close(ev(r).project.delivered,5000/distance);close(ev(r).project.tonKm,5000);assert.equal(r.state.overtimePoints,points-5);assert.equal(r.state.xp,xp);assert.equal(r.state.coins,coins);assert.deepEqual(ev(r).project.vehicles,v);assert.equal(ev(r).pass.overtime,5);}
});
test('Overtime rejects zero, fractions, overspending and stale runs; MAX uses the available stock',()=>{
 const r=solo();for(const amount of [0,-1,1.5,101,'100',null])assert.throws(()=>cmd(r.state,'eventOvertime',{id,run:1,amount}),/Überstundenpunkte/);
 assert.throws(()=>cmd(r.state,'eventOvertime',{id,run:0,amount:1}),/aktualisieren/);
 const spent=cmd(r.state,'eventOvertime',{id,run:1,amount:'max'});assert.equal(spent.state.overtimePoints,0);assert.equal(ev(spent).pass.overtime,100);
 const refilled=cmd(spent.state,'testGrant',{kind:'overtime',amount:100});assert.equal(ev(refilled).pass.overtime,100,'Granting stock is not activity');
});
test('Pass counts expedition spending in the main game and excludes failed actions or injected totals',()=>{
 let r=solo();r.state.expedition.regions[0].endlessUnlocked=true;
 r=cmd(r.state,'draw',{region:0});assert.equal(ev(r).pass.expedition,5);
 r=cmd(r.state,'testGrant',{kind:'expedition',amount:100,eventPoints:999});assert.equal(ev(r).pass.expedition,5);
 const points=ev(r).pass.expedition;r=cmd(r.state,'draw',{region:4});assert.equal(ev(r).pass.expedition,points,'Locked region cannot give activity');
});
test('Login is once per event day; 85 points unlocks the legendary placeholder exactly once',()=>{
 let r=solo();assert.deepEqual(ev(r).pass.loginDays,[0]);r=cmd(r.state);assert.deepEqual(ev(r).pass.loginDays,[0]);
 r=cmd(r.state,'sync',{},T+DAY);assert.deepEqual(ev(r).pass.loginDays,[0,1]);
 // Boundary fixture: all transport/expedition tasks, one quarter overtime + 2 login days.
 ev(r).pass.expedition=50;ev(r).pass.overtime=90;ev(r).project.delivered=1000;
 r=cmd(r.state,'sync',{},T+DAY);assert.equal(r.view.testEvents[0].passView.points,85);assert.equal(r.view.testEvents[0].passView.stage,10);
 const inventory=structuredClone(r.state.inventory);r=cmd(r.state,'eventClaim',{id,run:1,kind:'pass'},T+DAY);
 assert.equal(ev(r).testRewards.legendaryPlaceholder,1);assert.equal(ev(r).pass.claimed.length,10);assert.deepEqual(r.state.inventory,inventory);
 assert.throws(()=>cmd(r.state,'eventClaim',{id,run:1,kind:'pass'},T+DAY),/Keine neuen/);
 const restart=cmd(cmd(r.state,'eventEnd',{id,run:1},T+DAY).state,'eventStart',{id,run:1},T+DAY);assert.equal(ev(restart).testRewards,undefined);assert.equal(restart.state.eventCards,undefined);
});
test('A short solo pass adjusts login target so its final card remains reachable',()=>{
 const r=solo({durationHours:2});assert.equal(r.view.testEvents[0].passView.tasks.find(t=>t.id==='login').target,1);
});
test('100 community steps grant catch-up rewards after any contribution and continue uncapped after stage 100',()=>{
 let r=solo({target:100});assert.throws(()=>cmd(r.state,'eventClaim',{id,run:1,kind:'community'}),/zuerst/);
 r=cmd(r.state,'eventOvertime',{id,run:1,amount:24});assert.equal(ev(r).project.delivered,100);assert.equal(r.view.testEvents[0].stage,100);
 r=cmd(r.state,'eventClaim',{id,run:1,kind:'community'});assert.equal(ev(r).pass.communityClaimed,100);assert.equal(ev(r).testRewards.capacityModules,10);assert.equal(ev(r).testRewards.expeditionRefills,5);assert.equal(ev(r).testRewards.overtimeRefills,5);assert.equal(ev(r).testRewards.gearsCommon,160);
 assert.throws(()=>cmd(r.state,'eventClaim',{id,run:1,kind:'community'}),/Keine neuen/);
 r=cmd(r.state,'eventOvertime',{id,run:1,amount:1});assert.ok(ev(r).project.delivered>100);assert.equal(r.view.testEvents[0].stage,100);assert.equal(ev(r).status,'running');
});
test('Shared community contributions are incremental and claims credit real ordinary items, never event shards',()=>{
 const world=lockWorld({...makeWorld(T-2*DAY),registered:1000},T);world.total=world.config.target/2;
 let r=solo();r=cmd(r.state,'eventEnd',{id,run:1});let context={world,reported:0};r=cmd(r.state,'eventJoin',{},T,context);r=cmd(r.state,'eventFleet',{id,run:2,template:0},T,context);
 const before=world.total,modules=r.state.inventory.capacityModules;
 r=cmd(r.state,'eventOvertime',{id,run:2,amount:1},T,context);close(world.total,before+1000/world.config.distance);
 const total=world.total;r=cmd(r.state,'sync',{},T,context);assert.equal(world.total,total);
 r=cmd(r.state,'eventClaim',{id,run:2,kind:'community'},T,context);assert.equal(r.state.inventory.capacityModules,modules+5);assert.equal(ev(r).testRewards,undefined);assert.equal(r.state.eventShards,undefined);
});
test('Community join ignores client-supplied target and distance, permits late entrants, preserves global start',()=>{
 const world=lockWorld({...makeWorld(T-2*DAY),registered:500},T);let r=cmd(null,'start',{id:'hamburg'});
 r=cmd(r.state,'eventJoin',{target:1,distance:1},T+DAY,{world});assert.equal(ev(r).target,world.config.target);assert.equal(ev(r).distance,world.config.distance);assert.equal(ev(r).startedAt,T);
 assert.throws(()=>cmd(r.state,'eventJoin',{},world.endsAt,{world}),/derzeit nicht/);
});

test('Scaling never reduces required ton-kilometres when another player registers',()=>{let previous=0;for(let players=1;players<=100000;players++){const c=scaleEvent(players),work=c.target*c.distance;assert.ok(work>=previous);previous=work;}});
