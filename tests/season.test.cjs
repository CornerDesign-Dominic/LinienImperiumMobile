const {test}=require('node:test');
const assert=require('node:assert/strict');
const names=require('../functions/src/item-names.json');

test('Season preview provides all 30 ordered two-track levels using existing resources',async()=>{
 const {seasonRewards}=await import('../src/seasonRewards.js');
 assert.equal(seasonRewards.length,30);
 assert.deepEqual(seasonRewards.map(row=>row.level),Array.from({length:30},(_,index)=>index+1));
 const gears=new Set(['common','uncommon','rare','epic','legendary'].map(rarity=>'gear:'+rarity));
 for(const row of seasonRewards)for(const track of ['free','premium']){
  const reward=row[track];assert.ok(Object.hasOwn(names,reward.id)||gears.has(reward.id),reward.id);
  assert.ok(Number.isSafeInteger(reward.amount)&&reward.amount>0,`${row.level}/${track}`);
 }
});
test('Season starts without earned or claimed rewards and leaves game objects untouched',async()=>{
 const {seasonRewards,seasonPreview,seasonRewardStatus}=await import('../src/seasonRewards.js');
 const before=JSON.stringify(seasonPreview);
 for(const row of seasonRewards){assert.equal(seasonRewardStatus(row.level,'free'),'locked');assert.equal(seasonRewardStatus(row.level,'premium'),'premiumLocked');}
 assert.equal(JSON.stringify(seasonPreview),before);
 assert.deepEqual(seasonPreview,{level:0,premium:false,freeClaimed:[],premiumClaimed:[]});
});
test('Season view states respect reached level, track ownership and separate claims',async()=>{
 const {seasonRewardStatus}=await import('../src/seasonRewards.js');
 const progress={level:5,premium:false,freeClaimed:[1],premiumClaimed:[1]};
 const before=JSON.stringify(progress);
 assert.equal(seasonRewardStatus(1,'free',progress),'claimed');
 assert.equal(seasonRewardStatus(5,'free',progress),'reached');
 assert.equal(seasonRewardStatus(6,'free',progress),'locked');
 assert.equal(seasonRewardStatus(1,'premium',progress),'premiumLocked');
 assert.equal(seasonRewardStatus(1,'premium',{...progress,premium:true}),'claimed');
 assert.equal(seasonRewardStatus(5,'premium',{...progress,premium:true}),'reached');
 assert.equal(seasonRewardStatus(1,'free',{...progress,level:NaN}),'locked');
 assert.equal(JSON.stringify(progress),before);
});
