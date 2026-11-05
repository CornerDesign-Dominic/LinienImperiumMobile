const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const now=Date.UTC(2026,10,5,12);
const setup=async()=>componentHarness('Season.tsx',{
 './seasonRewards':await import('../src/seasonRewards.js'),
 './i18n':{t:String,getLocale:()=> 'de-DE'},
 './ui':{C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Bar:'Bar',n:x=>String(x),remaining:()=> '12:00:00'}
});
const base=()=>({id:'2026-11:1',price:1000,status:'active',startsAt:Date.UTC(2026,10,1),endsAt:Date.UTC(2026,11,1),points:10000,level:10,pointsPerLevel:1000,premium:false,freeClaimed:[],premiumClaimed:[],dailyVersion:1,dailies:[{id:'daily-1',title:'Logge dich ein',target:1,progress:1,points:100,rewards:[],claimed:false,complete:true}],monthlies:[{id:'monthly-1',title:'Schließe 600 Einzelaufträge ab',target:600,progress:200,points:100,rewards:[{id:'coins',amount:10000}],claimed:false,complete:false}],infinity:{earned:0,claimed:0,available:0,reward:{id:'specialOrders',amount:1}}});
const button=(tree,label)=>nodes(tree,'Btn').find(node=>text(node)===label);
test('Season purchase confirms server price and exposes retroactive Premium rewards at level 10',async()=>{
 const h=await setup(),calls=[],props={pass:base(),seals:1000,clock:now,onCommand:async(...args)=>{calls.push(args);return {};}};
 let tree=h.render('Season',props);
 assert.ok(text(tree).includes('1000'));assert.ok(text(tree).includes('Berliner Zeit'));
 button(tree,'Für 1000 Hermes-Siegel freischalten').props.onPress();assert.equal(calls.length,0);
 tree=h.render('Season',props);assert.equal(nodes(tree,'RewardModal')[0].props.visible,true);
 await button(nodes(tree,'RewardModal')[0],'Kaufen').props.onPress();
 assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['seasonPassBuy',{id:props.pass.id}]]);
 tree=h.render('Season',{...props,pass:{...props.pass,premium:true}});
 const row=nodes(tree,'View').find(node=>node.props.testID==='season-level-10');
 const premium=require('react').Children.toArray(row.props.children).find(node=>node.props?.track==='premium');
 await button(h.render(premium.type,premium.props),'Abholen').props.onPress();
 assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1))),['seasonClaim',{level:10,track:'premium',seasonId:props.pass.id}]);
 await button(tree,'Alles abholen').props.onPress();assert.equal(calls.at(-1)[0],'seasonClaimAll');
});
test('Season tabs show daily and monthly progress, route versioned claims and gate incomplete tasks',async()=>{
 const h=await setup(),calls=[],props={pass:base(),clock:now,onCommand:async(...args)=>calls.push(args)};
 let tree=h.render('Season',props);
 nodes(tree,'Pressable').find(node=>node.props.testID==='season-tab-daily').props.onPress();
 tree=h.render('Season',props);assert.ok(text(tree).includes('Logge dich ein'));
 await button(tree,'Belohnung abholen').props.onPress();
 assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['seasonTaskClaim',{id:'daily-1',dailyVersion:1,seasonId:props.pass.id}]]);
 nodes(tree,'Pressable').find(node=>node.props.testID==='season-tab-monthly').props.onPress();
 tree=h.render('Season',props);assert.ok(text(tree).includes('600 Einzelaufträge'));assert.equal(button(tree,'Belohnung abholen').props.disabled,true);
});
test('Ended season and busy states block purchases and claims; infinity appears after the path',async()=>{
 const h=await setup(),props={pass:{...base(),level:30,points:31000,infinity:{earned:1,claimed:0,available:1,reward:{id:'specialOrders',amount:1}}},seals:1000,clock:now,onCommand:async()=>({})};
 let tree=h.render('Season',props);assert.equal(button(tree,'Sonderaufträge abholen').props.disabled,false);
 tree=h.render('Season',{...props,busy:true});assert.equal(button(tree,'Sonderaufträge abholen').props.disabled,true);
 tree=h.render('Season',{...props,clock:props.pass.endsAt});assert.equal(button(tree,'Sonderaufträge abholen').props.disabled,true);assert.equal(button(tree,'Alles abholen').props.disabled,true);assert.equal(button(tree,'Für 1000 Hermes-Siegel freischalten').props.disabled,true);
});
test('Reward modal lists seals, season points, refill items and infinite special orders together',()=>{
 const h=componentHarness('ClaimRewards.tsx',{'./Language':{Text:'Text'}});
 const tree=h.render('ClaimRewards',{summary:{coins:0,gears:{},hermes:3,seasonPoints:100,specialOrders:2,expeditionRefills:1,overtimeRefills:1},rarities:[]});
 const ids=nodes(tree,'View').map(node=>node.props.testID);
 for(const id of ['hermes','seasonPoints','project:special','expeditionRefills','overtimeRefills'])assert.ok(ids.includes('claim-reward-'+id),id);
});
