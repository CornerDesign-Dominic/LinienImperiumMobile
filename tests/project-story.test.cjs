const {test}=require('node:test'),assert=require('node:assert/strict');
const {projectStory}=require('../src/projectStory');
const order=(extra={})=>({kind:'special',customer:'nordbau',volume:1000,delivered:0,status:'active',...extra});
test('Story follows delivered cargo at every 20 percent boundary, never elapsed time',()=>{
 for(const [delivered,stage]of [[-1,0],[0,0],[199,0],[200,1],[399,1],[400,2],[599,2],[600,3],[799,3],[800,4],[999,4],[1000,4],[2000,4]])assert.equal(projectStory(order({delivered,eta:0})).stage,stage);
});
test('Only confirmed and fully delivered completions show a receipt',()=>{
 assert.equal(projectStory(order({status:'completed',delivered:1000})).stage,5);
 for(const status of ['active','failed','queued'])assert.equal(projectStory(order({status,delivered:1000})).receipt,false);
 assert.equal(projectStory(order({status:'completed',delivered:999})).receipt,false);
 for(const extra of [{volume:0},{volume:Infinity},{delivered:NaN},{delivered:Infinity}])assert.equal(projectStory(order({status:'completed',delivered:1000,...extra})).receipt,false);
});
test('Known customer identity wins over legacy region, for specials and referrals alike',()=>{
 const ids=['nordbau','frischgut','stahlwerk','alpenhandel','eurolog'],regions=['crownlands','plains','saffron','jade','north'];
 for(const kind of ['special','referral'])for(let i=0;i<5;i++)assert.equal(projectStory(order({kind,customer:ids[i],projectRegion:(i+1)%5})).region,regions[i]);
});
test('Only absent customer permits a bounded legacy region fallback; events and unknown customers do not invent a story',()=>{
 assert.equal(projectStory(order({customer:undefined,projectRegion:2})).region,'saffron');
 for(const extra of [{customer:'unknown',projectRegion:0},{customer:undefined,projectRegion:5},{customer:undefined,projectRegion:1.5},{kind:'event'},{kind:'single'}])assert.equal(projectStory(order(extra)),null);
});
