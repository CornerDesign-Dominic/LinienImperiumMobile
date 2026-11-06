'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const {calendar,seasonPassView,recordSeasonActivity,rollProjectHermes,DAILY,MONTHLY}=require('../functions/src/season-pass.cjs');
const NOW=Date.parse('2026-11-05T12:00:00Z'),fixed=()=>.5;
const command=(game,action,p={},at=NOW,random=fixed)=>execute(game?.state||game,action,p,at,random);
function initial(at=NOW){let g=command(null,'foundCompany',{companyName:'Season test',cityName:'Hafen'},at);return command(g,'seasonStart',{},at);}
function claim(g,level,track='free'){return command(g,'seasonClaim',{seasonId:g.view.seasonPass.id,level,track});}

test('Berlin calendar uses actual month boundaries, leap years and DST offsets',()=>{
 for(const [date,start,end]of [
  ['2026-03-20T12:00:00Z','2026-02-28T23:00:00Z','2026-03-31T22:00:00Z'],
  ['2026-10-20T12:00:00Z','2026-09-30T22:00:00Z','2026-10-31T23:00:00Z'],
  ['2028-02-20T12:00:00Z','2028-01-31T23:00:00Z','2028-02-29T23:00:00Z']]){
  const c=calendar(Date.parse(date));assert.equal(c.startsAt,Date.parse(start));assert.equal(c.endsAt,Date.parse(end));
 }
 assert.equal(calendar(Date.parse('2026-03-29T12:00:00Z')).nextDailyAt,Date.parse('2026-03-29T22:00:00Z'));
 assert.equal(calendar(Date.parse('2026-10-25T12:00:00Z')).nextDailyAt,Date.parse('2026-10-25T23:00:00Z'));
});
test('Lifecycle starts inactive, resets invalidate old IDs and enabled calendar months roll over',()=>{
 const fresh=command(null,'foundCompany',{companyName:'Season test',cityName:'Hafen'});assert.equal(fresh.view.seasonPass.status,'inactive');
 let g=command(fresh,'seasonStart');const id=g.view.seasonPass.id;
 assert.equal(g.view.seasonPass.status,'active');assert.equal(g.view.seasonPass.level,0);assert.equal(g.view.seasonPass.dailies.length,4);
 assert.equal(command(g,'seasonStart').view.seasonPass.id,id,'repeated start does not reroll');
 const reset=command(g,'seasonReset');assert.equal(reset.view.seasonPass.status,'inactive');assert.notEqual(reset.view.seasonPass.id,id);
 const restarted=command(reset,'seasonStart');assert.notEqual(restarted.view.seasonPass.id,id);
 assert.throws(()=>command(restarted,'seasonClaimAll',{seasonId:id}),/Seasonstatus geändert/);
 const next=command(g,'sync',{},g.view.seasonPass.endsAt);assert.equal(next.view.seasonPass.points,0);assert.notEqual(next.view.seasonPass.id,id);assert.equal(next.view.seasonPass.status,'active');
});
test('Premium costs exactly 1000 Hermes, never Taler, persists and allows retroactive track claims',()=>{
 let g=initial();g.state.season.points=10000;g.state.premiumShop.balance=999;
 assert.throws(()=>command(g,'seasonPassBuy',{id:g.view.seasonPass.id,price:0}),/Nicht genügend Hermes/);
 g.state.premiumShop.balance=1000;const coins=g.state.coins;
 const bought=command(g,'seasonPassBuy',{id:g.view.seasonPass.id,price:0,currency:'coins',level:30});
 assert.equal(bought.state.coins,coins);assert.equal(bought.state.premiumShop.balance,0);assert.equal(bought.view.seasonPass.price,1000);assert.equal(bought.view.seasonPass.premium,true);
 assert.equal(command(bought,'seasonPassBuy',{id:bought.view.seasonPass.id}).state.premiumShop.balance,0);
 const free=claim(bought,2);assert.equal(free.state.coins,coins+500);
 const premium=claim(free,2,'premium');assert.equal(premium.state.coins,coins+2000);
 assert.equal(claim(premium,2,'premium').state.coins,premium.state.coins);
 const levelTen=claim(premium,10,'premium');assert.equal(levelTen.state.inventory.overtimeRefills,premium.state.inventory.overtimeRefills+2);assert.ok(levelTen.view.seasonPass.premiumClaimed.includes(10));
 const restored=command(JSON.parse(JSON.stringify(premium.state)),'sync');assert.equal(restored.view.seasonPass.premium,true);
 const reset=command(restored,'reset');assert.equal(reset.view.seasonPass.premium,true);assert.deepEqual(reset.view.seasonPass.premiumClaimed,[2]);
 const next=command(premium,'sync',{},premium.view.seasonPass.endsAt);assert.equal(next.view.seasonPass.premium,false);
});
test('Task definitions scale month workload, each awards100XP, daily rolls are stable and version protected',()=>{
 assert.equal(DAILY.length,11);assert.deepEqual(MONTHLY.map(t=>t.target),[600,20,40,160,160,20,80]);
 let g=initial();const before=g.view.seasonPass.dailies.map(t=>t.id);
 assert.deepEqual(command(g,'sync').view.seasonPass.dailies.map(t=>t.id),before);
 for(const t of DAILY)recordSeasonActivity(g.state,t.metric,t.target,NOW,'customer-'+t.id);
 const oldVersion=g.view.seasonPass.dailyVersion;
 g=command(g,'sync');const eligible=g.view.seasonPass.dailies.find(t=>t.complete);assert.ok(eligible);
 const p={seasonId:g.view.seasonPass.id,id:eligible.id,dailyVersion:oldVersion};
 const claimed=command(g,'seasonTaskClaim',p);assert.equal(claimed.view.claimSummary.seasonPoints,100);assert.equal(claimed.view.seasonPass.points,g.view.seasonPass.points+100);
 assert.equal(command(claimed,'seasonTaskClaim',p).view.seasonPass.points,claimed.view.seasonPass.points);
 const rolled=command(claimed,'seasonDailyReset');assert.equal(rolled.view.seasonPass.dailyVersion,oldVersion+1);assert.notDeepEqual(rolled.view.seasonPass.dailies.map(t=>t.id),before);
 assert.throws(()=>command(rolled,'seasonTaskClaim',p),/Tagesaufgaben geändert|Seasonaufgabe nicht verfügbar/);
 const next=command(claimed,'sync',{},claimed.view.seasonPass.nextDailyAt);assert.equal(next.view.seasonPass.dailyVersion,oldVersion+1);assert.equal(next.state.season.dailyMetrics.singles,0);
});
test('All-claim applies task loot first, then both reached tracks, infinity special contracts once',()=>{
 let g=initial();g.state.season.points=30900;g.state.premiumShop.ownedSeasonPasses.push(g.view.seasonPass.id);
 g.state.season.metrics.projects=20;g.state.season.dailyClaims=['login'];g.state.season.dailyMetrics=Object.fromEntries(Object.entries(g.state.season.dailyMetrics).map(([k,v])=>[k,Array.isArray(v)?[]:0]));
 const coins=g.state.coins,orders=g.state.orders.length,modules=g.state.inventory.capacityModules;
 const result=command(g,'seasonClaimAll',{seasonId:g.view.seasonPass.id});
 assert.equal(result.view.seasonPass.level,30);assert.equal(result.view.seasonPass.points,31000);
 assert.equal(result.view.seasonPass.freeClaimed.length,30);assert.equal(result.view.seasonPass.premiumClaimed.length,30);
 assert.equal(result.view.claimSummary.specialOrders,1);assert.equal(result.state.orders.length,orders+1);
 assert.equal(result.state.orders.at(-1).kind,'special');assert.equal(result.state.orders.at(-1).status,'queued');
 assert.equal(result.view.claimSummary.seasonPoints,100);assert.equal(result.state.inventory.capacityModules,modules+5);
 assert.ok(result.state.coins>coins);assert.equal(result.view.seasonPass.infinity.available,0);
 const repeated=command(result,'seasonClaimAll',{seasonId:result.view.seasonPass.id});assert.equal(repeated.state.coins,result.state.coins);assert.equal(repeated.state.orders.length,result.state.orders.length);
});
test('Invalid and unreached claims never grant loot; test grants and refills never mint SeasonXP',()=>{
 let g=initial();assert.throws(()=>claim(g,1),/noch nicht erreicht/);assert.throws(()=>claim(g,1,'premium'),/Premium ist gesperrt/);
 assert.throws(()=>claim(g,0),/Ungültige Seasonstufe/);
 assert.throws(()=>command(g,'seasonTaskClaim',{id:'monthly:projects',seasonId:g.view.seasonPass.id}),/noch nicht abgeschlossen/);
 g=command(g,'testGrant',{kind:'xp',amount:1000});g=command(g,'testGrant',{kind:'expedition',amount:100});g=command(g,'testGrant',{kind:'overtime',amount:100});g=command(g,'testCoins');g=command(g,'testHermes');
 assert.equal(g.view.seasonPass.points,0);assert.equal(g.state.season.metrics.coins,0);
 g.state.inventory.expeditionRefills=2;g.state.inventory.overtimeRefills=2;
 g=command(g,'expeditionRefill');g=command(g,'refill');assert.equal(g.view.seasonPass.points,0);
});
test('Project Hermes rolls respect chances, inclusive ranges and never reroll saved outcomes',()=>{
 for(const [kind,chance,min,max]of [['special',.25,1,3],['referral',.5,5,10]]){
  for(const [draw,amount]of [[0,min],[.999999,max]]){let calls=0;const order={project:{},kind,completionReward:{}};rollProjectHermes(order,()=>calls++===0?0:draw);assert.equal(order.completionReward.hermes,amount);rollProjectHermes(order,()=>{throw Error('rerolled');});}
  const miss={project:{},kind,completionReward:{}};rollProjectHermes(miss,()=>chance);assert.equal(miss.completionReward.hermes,0);
 }
});

test('Real point spending grants exact SeasonXP while passive completion and project claims stay once-only',()=>{
 let g=initial();const original=g.state.expedition.points;
 g=command(g,'discover',{region:0});assert.equal(g.view.seasonPass.points,original-g.state.expedition.points);
 const basePoints=g.view.seasonPass.points;
 g.state.expedition.seats=['navigator',null,null,null,null];g.state.overtimePoints=1000;
 const base=g.state.orders[0];g.state.orders=[{...base,id:'SEASONPROJECT',kind:'special',status:'queued',category:'national',customer:null,volume:200,baseVolume:200,distance:120,routeType:'single',delivered:0,deadlineMs:86400000,projectName:'Season project'}];
 g=command(g,'projectStart',{id:'SEASONPROJECT',template:0});
 const before=g.state.overtimePoints;
 g=command(g,'overtime',{id:'SEASONPROJECT',amount:5},NOW);
 assert.equal(g.view.seasonPass.points,basePoints+before-g.state.overtimePoints);
 const pointsBefore=g.state.overtimePoints,seasonBefore=g.view.seasonPass.points;
 g=command(g,'overtime',{id:'SEASONPROJECT',amount:1000},NOW,()=>0);
 assert.equal(g.state.orders[0].status,'completed');assert.equal(g.view.seasonPass.points,seasonBefore+pointsBefore-g.state.overtimePoints);
 assert.equal(g.state.season.metrics.projects,0);assert.equal(g.state.season.metrics.coins,0,'deferred transport earns money only at collection');
 const seals=g.state.premiumShop.balance,reward=g.state.orders[0].completionReward;
 assert.equal(reward.hermes,1);
 g=command(g,'claim',{id:'SEASONPROJECT'});assert.equal(g.state.premiumShop.balance,seals+1);assert.equal(g.view.claimSummary.hermes,1);assert.equal(g.state.season.metrics.projects,1);
 assert.equal(g.state.season.metrics.coins,reward.totalCoins);
 const again=command(g,'claim',{id:'SEASONPROJECT'});assert.equal(again.state.premiumShop.balance,g.state.premiumShop.balance);assert.equal(again.state.season.metrics.projects,1);assert.equal(again.view.claimSummary,undefined);
});
test('Single completions record category, unique daily customers and earned transport currency only once',()=>{
 let g=initial();g.state.expedition.regions[0].customerUnlocked=true;const truck=g.state.trucks[0],base=g.state.orders[0];
 g.state.orders=[{...base,id:'SEASONSINGLE',kind:'normal',status:'available',category:'national',customer:'nordbau',volume:1,baseVolume:1,distance:1,routeType:'single',delivered:0}];
 g=command(g,'assign',{order:'SEASONSINGLE',truck:truck.id});assert.equal(g.state.orders[0].status,'active');
 const at=g.view.state.orders.find(o=>o.id==='SEASONSINGLE').runningEndsAt;
 g=command(g,'sync',{},at);assert.equal(g.state.orders.find(o=>o.id==='SEASONSINGLE').status,'completed');
 assert.equal(g.state.season.metrics.singles,1);assert.equal(g.state.season.metrics.local,1);assert.equal(g.state.season.metrics.customerOrders,1);assert.equal(g.state.season.metrics.customers,1);assert.equal(g.state.season.metrics.coins,0);
 g=command(g,'claimSingles',{},at);assert.ok(g.state.season.metrics.coins>0);
 const before=g.state.season.metrics.coins;
 const again=command(g,'sync',{},at);assert.equal(again.state.season.metrics.singles,1);assert.equal(again.state.season.metrics.coins,before);
});
test('Lost delivery and procurement hooks count actual collections and finished tours, not repeated requests',()=>{
 let g=initial();g.state.xp=1000;
 g=command(g,'hubCrate');assert.equal(g.state.season.metrics.crates,1);
 const repeat=command(g,'hubCrate');assert.equal(repeat.state.season.metrics.crates,1);
 Object.assign(g.state.expedition.regions[0],{discovered:7,endlessUnlocked:true,finalClaimed:true,moduleAwarded:true,customerUnlocked:true});
 g.state.expedition.regions[0].deliveries=g.state.expedition.regions[0].deliveries.map(()=>true);
 g.state.coins=100000;
 g=command(g,'procurementStart',{region:0,truck:g.state.trucks[0].id,mode:'count',amount:2});
 const nextAt=g.state.procurement.runs[0].nextAt;
 g=command(g,'sync',{},nextAt);assert.equal(g.state.season.metrics.procurement,1);
 const same=command(g,'sync',{},nextAt);assert.equal(same.state.season.metrics.procurement,1);
});
