const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const {execute}=require('../functions/src/engine.cjs');
const {componentHarness,nodes}=require('./helpers/component-harness.cjs');
const C=require('../src/palette.json'),T=Date.parse('2026-11-06T12:00:00Z');
function load(file){const p=path.resolve(__dirname,'../src',file),m=new Module(p,module);m.filename=p;m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,p);return m.exports;}
const {itemVisual}=load('itemVisual.js'),{stockItems}=load('items.ts');
function initial(){const g=execute(null,'foundCompany',{companyName:'Seltenheit',cityName:'Hafen'},T,()=>.5);g.state.expedition.regions[0].customerUnlocked=true;g.state.expedition.regions[0].endlessUnlocked=true;g.state.expedition.points=100;g.state.coins=100000;return g;}
test('Market, expedition and Season normal customer orders share Uncommon presentation and identical transport economics',()=>{
 const g=initial(),market=execute(g.state,'refresh',{},T,()=>.01);let calls=0;
 const expedition=execute(g.state,'draw',{region:0},T,()=>calls++===0?.4:.01);
 let season=execute(g.state,'seasonStart',{},T,()=>.01);season.state.season.points=30500;
 season=execute(season.state,'seasonInfinityClaim',{seasonId:season.view.seasonPass.id},T,()=>.01);
 const offers=[market.view.state.orders.find(o=>o.status==='available'&&o.customer),expedition.view.state.orders.at(-1),season.view.state.orders.at(-1)];
 for(const o of offers){assert.equal(o.kind,'normal');assert.equal(o.customer,'nordbau');assert.equal(o.rarity,'uncommon');}
 const terms=o=>({category:o.category,routeType:o.routeType,volume:o.volume,distance:o.distance,cargo:o.cargo,from:o.from,to:o.to,forecast:o.forecast&&{revenue:o.forecast.revenue,cost:o.forecast.cost,bonus:o.forecast.bonus,xp:o.forecast.xp}});
 assert.deepEqual(terms(offers[1]),terms(offers[0]));assert.deepEqual(terms(offers[2]),terms(offers[0]));
 assert.equal(expedition.view.expeditionFind.rarity,'uncommon');
 assert.ok(expedition.view.expeditionMap.every(r=>r.finds.orders.find(o=>o.kind==='customer').rarity==='uncommon'));
 assert.equal(stockItems(expedition.view).find(i=>i.id==='order:customer').rarity,'uncommon');
 const before=JSON.stringify(season.state.orders),synced=execute(season.state,'sync',{},T,()=>.5);assert.equal(JSON.stringify(synced.state.orders),before,'rarity is presentation only');
});
test('Free normal orders stay Common; customer scrolls are Uncommon, specials Rare and referrals Epic',()=>{
 let g=initial();const free=g.view.state.orders.find(o=>o.kind==='normal'&&!o.customer);assert.equal(free.rarity,'common');
 g=execute(g.state,'testProjects',{},T,()=>.5);
 assert.ok(g.view.state.orders.filter(o=>o.kind==='special').every(o=>o.rarity==='rare'));
 assert.ok(g.view.state.orders.filter(o=>o.kind==='referral').every(o=>o.rarity==='epic'));
 for(const [id,rarity]of [['customer','uncommon'],['order:customer','uncommon'],['special','rare'],['referral','epic'],['order:private','common'],['job:material:1','common']])assert.equal(itemVisual(id).rarity,rarity,id);
 assert.equal(itemVisual('job:material:3',{rarity:'rare'}).rarity,'rare','explicit legacy job rarity remains supported');
});
test('Normal offer, stored and running cards use their global rarity colors; private card styling stays unchanged',()=>{
 const h=componentHarness('Orders.tsx',{'./ui':{C,Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Bar:'Bar',Pill:'Pill',Empty:'Empty',n:String,remaining:()=>''}});const data={state:{orders:[],trucks:[]},catalog:{cards:[]}};
 for(const status of ['available','queued','active','completed'])for(const customer of [null,'nordbau']){
  const order={id:'R',kind:'normal',status,customer,cargo:'Getreide',choices:[],volume:1,distance:1};
  const tree=h.render('OrderTile',{order,data,clock:T,onOpen:()=>{}}),card=nodes(tree,'Card')[0];
  assert.equal(card.props.style.at(-1).borderLeftColor,customer?C.uncommon:C.common);
 }
 for(const [status,color]of [['queued',C.rare],['active',C.accent]]){
  const tree=h.render('OrderTile',{order:{id:'P',kind:'private',status,choices:[],cargo:'Ware'},data,clock:T,onOpen:()=>{}});
  assert.equal(nodes(tree,'Card')[0].props.style.at(-1).borderLeftColor,color);
 }
 h.unmount();
});
test('Reward summaries use Uncommon customer scrolls and Rare special scrolls with matching amount colors',()=>{
 const h=componentHarness('ClaimRewards.tsx',{'./Language':{Text:'Text'},'./items':{rarityColor:id=>C[id],itemName:id=>id}});
 const tree=h.render('ClaimRewards',{summary:{customerOrders:1,specialOrders:1,coins:0,gears:{}},rarities:[]});
 for(const [id,rarity]of [['order:customer','uncommon'],['project:special','rare']]){
  const row=nodes(tree,'View').find(n=>n.props.testID==='claim-reward-'+id);
  assert.equal(itemVisual(nodes(row,'ItemArt')[0].props.id).rarity,rarity);
  assert.equal(nodes(row,'Text')[0].props.style[1].color,C[rarity]);
 }
 h.unmount();
});
