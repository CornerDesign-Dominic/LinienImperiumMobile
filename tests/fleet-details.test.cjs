const {test}=require('node:test');
const assert=require('node:assert/strict');
const {estimateFleet}=require('../src/fleetEstimate.js');
const {giftRevealSteps}=require('../src/giftReveal.js');
const {execute,session}=require('../functions/src/engine.cjs');
const now=1800000000000,fixed=()=>.5;
const vehicle=(overrides={})=>({cardId:'test',model:'Test',capacity:4,loadedSpeed:1,emptySpeed:2,costPerKm:1,loadCostPerTonKm:.1,freightPayPerTonKm:.5,bonuses:{speed:0,cost:0,pay:10,xp:20},...overrides});
test('Fleet estimate uses each vehicle separately with full outbound load, empty return, load costs and bonuses',()=>{
 const result=estimateFleet([vehicle()],100),v=result.vehicles[0];
 assert.equal(v.seconds,150);assert.equal(v.tours,24);assert.equal(v.tons,96);assert.equal(v.km,4800);
 assert.equal(v.tourCost,240);assert.equal(v.hourCost,5760);
 assert.equal(v.tourRevenue,220);assert.equal(v.hourRevenue,5280);assert.equal(v.xp,115.2);
 const two=estimateFleet([vehicle(),vehicle({cardId:'slow',capacity:8,loadedSpeed:.5,emptySpeed:1})],100);
 assert.equal(two.vehicles[1].tours,12);assert.equal(two.capacity,12);
 assert.equal(two.km,7200);assert.equal(two.tons,192);
});
test('Long and partial tours count travelled kilometres while only completed tours credit delivery, costs and revenue',()=>{
 const long=estimateFleet([vehicle()],5000).vehicles[0];
 assert.equal(long.km,3600);assert.equal(long.tours,0);assert.equal(long.tons,0);assert.equal(long.hourCost,0);assert.equal(long.hourRevenue,0);
 const partial=estimateFleet([vehicle()],700).vehicles[0];
 assert.equal(partial.tours,3);assert.equal(partial.km,4650);assert.equal(partial.tons,12);
 const exact=estimateFleet([vehicle()],2400).vehicles[0];
 assert.equal(exact.seconds,3600);assert.equal(exact.tours,1);assert.equal(exact.km,4800);
 for(const bad of [0,-1,NaN,Infinity,100001,'100'])assert.equal(estimateFleet([vehicle()],bad),null);
 assert.equal(estimateFleet([],100).capacity,0);
});
test('Server fleet preview uses owned cards, fleet bonuses and workshop costs without rolling loot or touching saves',()=>{
 let game=execute(null,'foundCompany',{companyName:'Flottentest',cityName:'Testhafen'},now,fixed);
 game.state.expedition.characters.r1_rare={level:1,progress:0};
 game.state.expedition.characters.r2_rare={level:1,progress:0};
 game.state.expedition.characters.r1_uncommon={level:1,progress:0};
 for(const [seat,id] of ['navigator','r1_rare','r2_rare','r1_uncommon'].entries())
  game=execute(game.state,'seat',{id,template:0,seat},now,fixed);
 const saved=JSON.stringify(game.state),api=session(game.state,now,()=>{throw Error('Preview must not roll loot');});
 const apiSaved=JSON.stringify(api.state);
 const view=api.view(),rows=view.fleetPreviews[0];
 assert.equal(JSON.stringify(api.state),apiSaved);
 assert.equal(JSON.stringify(game.state),saved);assert.equal(rows.length,4);
 const owned=rows.find(v=>v.cardId==='navigator');
 assert.equal(owned.bonuses.cost,6);assert.equal(owned.bonuses.speed,5);
 assert.equal(owned.bonuses.pay,0);assert.equal(owned.bonuses.xp,0);
 // Garage-scope speed card contributes no fleet bonus.
 assert.equal(rows.find(v=>v.cardId==='r1_uncommon').bonuses.speed,5);
 for(const v of rows){assert.ok(v.emptySpeed>v.loadedSpeed);assert.ok(v.loadedSpeed>0);assert.ok(Number.isFinite(v.costPerKm));}
 assert.equal(view.fleetPreviews[1].length,0);
 const before=owned.costPerKm;
 game.state.company.departments.workshop=true;game.state.company.workshopLevel=10;
 const lower=execute(game.state,'sync',{},now,fixed).view.fleetPreviews[0].find(v=>v.cardId==='navigator');
 assert.ok(lower.costPerKm<before);
 const estimate=estimateFleet(rows,100);assert.ok(estimate.hourCost>0);assert.ok(estimate.tons>0);
});
test('Gift reveal always moves down through two full laps and stops on the server winner without rerolling',()=>{
 for(let start=0;start<5;start++)for(let winner=0;winner<5;winner++){
  const plan=giftRevealSteps(5,start,winner);
  assert.ok(plan.length>=10);assert.equal(plan.at(-1).index,winner);
  let previous=start,delay=0;
  for(const step of plan){assert.equal(step.index,(previous+1)%5);assert.ok(step.delay>=delay);previous=step.index;delay=step.delay;}
 }
 for(const args of [[0,0,0],[5,-1,0],[5,0,5],[5.5,0,0]])assert.deepEqual(giftRevealSteps(...args),[]);
});
