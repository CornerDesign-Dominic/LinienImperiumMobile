const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const now=Date.parse('2026-11-06T12:00:00Z'),random=()=>.5;
const fresh=()=>execute(null,'foundCompany',{companyName:'Refill test',cityName:'Hafen'},now,random);
test('Refills restore actual personal maxima, including 200/10 and 800/150, and expose current deltas',()=>{
 for(const [cap,rest]of [[200,10],[800,150]])for(const kind of ['expedition','overtime']){
  const g=fresh();g.state.inventory[kind+'Refills']=2;
  if(kind==='expedition'){g.state.expedition.levelCapacityBonus=cap-50;g.state.expedition.points=rest;}else{g.state.overtimeCapacity=cap;g.state.overtimePoints=rest;}
  const preview=execute(g.state,'sync',{},now,random);assert.equal(preview.view.catalog.refillPoints[kind],cap-rest);assert.equal(preview.view.catalog.refillMaximum[kind],cap);
  const used=execute(preview.state,kind==='expedition'?'expeditionRefill':'refill',{},now,random);
  assert.equal(kind==='expedition'?used.state.expedition.points:used.state.overtimePoints,cap);assert.equal(used.state.inventory[kind+'Refills'],1);assert.equal(used.view.catalog.refillPoints[kind],0);
  const full=execute(used.state,kind==='expedition'?'expeditionRefill':'refill',{},now,random);assert.equal(full.state.inventory[kind+'Refills'],1);
 }
});
test('Refills preserve overfull reserves and items, and never award Season activity',()=>{
 for(const kind of ['expedition','overtime']){
  let g=fresh();g=execute(g.state,'seasonStart',{},now,random);g.state.inventory[kind+'Refills']=1;
  const reserve=kind==='expedition'?g.state.expedition:g.state;
  reserve[kind==='expedition'?'points':'overtimePoints']=1000;
  const used=execute(g.state,kind==='expedition'?'expeditionRefill':'refill',{},now,random);
  assert.equal(used.state.inventory[kind+'Refills'],1);assert.equal(kind==='expedition'?used.state.expedition.points:used.state.overtimePoints,1000);assert.equal(used.view.seasonPass.points,0);
 }
});
