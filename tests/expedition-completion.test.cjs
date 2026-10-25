const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000,random=()=>.5;
const cmd=(s,a='sync',p={},at=now)=>execute(s,a,p,at,random);
function initial(){const r=cmd(null,'start',{id:'hamburg'});r.state.expedition.regions[0].discovered=7;r.state.expedition.regions[0].endlessUnlocked=true;return r;}
const mission=(id,kind='delivery',place=id-1)=>({id,kind,region:0,place,status:'active',truckId:'test',startedAt:now,endsAt:now+15000});
test('Online and offline arrivals credit rewards and milestones once and batch their persisted notices',()=>{
 let r=initial();r.state.expedition.missions=[mission(1),mission(2),mission(3,'final',0)];
 r=cmd(r.state,'sync',{},now+15000);
 assert.equal(r.state.expansion.available,2);assert.equal(r.view.expeditionCapacity,50);
 assert.equal(r.state.expedition.regions[0].deliveries.filter(Boolean).length,2);
 assert.equal(r.state.expedition.regions[0].customerUnlocked,true);assert.equal(r.state.inventory.capacityModules,1);
 assert.deepEqual(r.view.expansion.notices.map(n=>n.kind),['delivery','delivery','final']);
 const saved=structuredClone(r.state);
 for(const action of ['sync','sync','claimMission'])r=cmd(r.state,action,action==='claimMission'?{id:1}:{},now+15001);
 assert.deepEqual(r.state.expansion,saved.expansion);assert.equal(r.state.inventory.capacityModules,1);
 assert.equal(r.state.expedition.missions.filter(m=>m.status==='active').length,0,'completion never starts a next journey');
 r=cmd(r.state,'expeditionNoticeAck',{through:2},now+15002);assert.deepEqual(r.view.expansion.notices.map(n=>n.sequence),[3]);
 r=cmd(r.state,'expeditionNoticeAck',{through:3},now+15003);assert.equal(cmd(r.state).view.expansion.notices.length,0,'fresh session/login cannot replay closed notices');
 assert.throws(()=>cmd(r.state,'expeditionNoticeAck',{through:4}),/Ungültige/);
});
test('Legacy collected bonuses remain assigned, pending deliveries become free points, old loot is not replayed',()=>{
 const r=initial();delete r.state.expansion;
 r.state.expedition.regions[0].deliveries[0]=true;r.state.expedition.levelCapacityBonus=4;
 r.state.expedition.missions=[{...mission(1),status:'completed',claimedAt:now-1},{...mission(2),status:'completed'}, {...mission(3,'endless'),status:'completed',reward:'15 M'}];
 const out=cmd(r.state);
 assert.equal(out.view.expeditionCapacity,55);assert.equal(out.view.expansion.available,1);
 assert.equal(out.view.expansion.notices.length,1);assert.equal(out.view.expansion.notices[0].missionId,2);
 assert.equal(out.state.coins,r.state.coins);assert.equal(out.state.expedition.levelCapacityBonus,4);
 assert.equal(cmd(out.state).view.expeditionCapacity,55);
});
test('Permanent allocation is atomic, bounded, independent of level-up points and never refills energy',()=>{
 let r=initial();r.state.expedition.missions=[mission(1),mission(2),mission(3)];
 r=cmd(r.state,'sync',{},now+15000);r.state.expedition.points=4;r.state.overtimePoints=7;r.state.pendingLevelUps=[2];
 const saved=JSON.stringify(r.state);
 for(const p of [{expedition:4,overtime:0,points:3},{expedition:1,overtime:0,points:2},{expedition:-1,overtime:2,points:3},{expedition:.5,overtime:0,points:3},{expedition:0,overtime:0,points:3}])assert.throws(()=>cmd(r.state,'expansionAllocate',p,now+15000));
 assert.equal(JSON.stringify(r.state),saved);
 const allocated=cmd(r.state,'expansionAllocate',{expedition:1,overtime:2,points:3},now+15000);
 assert.equal(allocated.view.expeditionCapacity,51);assert.equal(allocated.view.state.overtimeCapacity,102);
 assert.equal(allocated.state.expedition.points,4);assert.equal(allocated.state.overtimePoints,7);
 assert.equal(allocated.view.expansion.available,0);assert.equal(allocated.view.development.points,3);
 assert.throws(()=>cmd(allocated.state,'expansionAllocate',{expedition:0,overtime:1,points:3}),/geändert/);
 assert.equal(cmd(allocated.state).view.expeditionCapacity,51);
});
test('Expansion allocation resumes paused regeneration with retained progress instead of resetting the clock',()=>{
 let r=initial();r.state.expansion.available=1;r.state.expedition.points=50;r.state.expedition.pausedRegenProgress=.5;
 const out=cmd(r.state,'expansionAllocate',{expedition:1,overtime:0,points:1});
 assert.equal(out.state.expedition.lastRegenAt,now-out.view.regeneration.expeditionIntervalMs*.5);
 assert.equal(out.state.expedition.points,50);assert.equal(out.view.expeditionCapacity,51);
});
test('New endless expedition loot is booked once and appears in the same persisted inbox',()=>{
 const r=initial();r.state.expedition.missions=[{...mission(1,'endless'),lootKind:'material',tier:1}];
 const out=cmd(r.state,'sync',{},now+15000),again=cmd(out.state,'sync',{},now+15001);
 assert.equal(out.state.coins,r.state.coins+15);assert.equal(again.state.coins,out.state.coins);
 assert.equal(out.view.expansion.notices[0].kind,'endless');assert.equal(again.view.expansion.notices.length,1);
});
