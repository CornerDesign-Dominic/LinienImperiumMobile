const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const {seasonPassView}=require('../functions/src/season-pass.cjs');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const now=1800000000000;
const initial=()=>execute(null,'foundCompany',{companyName:'Pass test',cityName:'Hafen'},now,()=>.5);

test('Season placeholder charges only the server-owned Taler price once, without granting progression or rewards',()=>{
 const base=initial();base.state.coins=2000;base.state.premiumShop.balance=600;
 const id=base.view.seasonPass.id;
 const bought=execute(base.state,'seasonPassBuy',{id,price:0,currency:'hermes',level:30,premium:true},now,()=>.5);
 assert.equal(bought.state.coins,1000);assert.equal(bought.state.premiumShop.balance,600);
 assert.deepEqual(bought.view.seasonPass,{id,price:500,temporaryPrice:1000,placeholder:true,level:0,premium:true,freeClaimed:[],premiumClaimed:[]});
 assert.deepEqual(bought.state.inventory,base.state.inventory);
 const repeat=execute(bought.state,'seasonPassBuy',{id},now,()=>.5);
 assert.equal(repeat.state.coins,1000);assert.equal(repeat.state.premiumShop.ownedSeasonPasses.filter(value=>value===id).length,1);
});
test('Season purchase rejects insufficient balances and stale season IDs without granting access',()=>{
 const base=initial(),id=base.view.seasonPass.id;
 base.state.coins=999;
 assert.throws(()=>execute(base.state,'seasonPassBuy',{id},now),/Nicht genügend Imperium-Taler/);
 assert.equal(base.state.coins,999);assert.equal(seasonPassView(base.state).premium,false);
 base.state.coins=2000;
 assert.throws(()=>execute(base.state,'seasonPassBuy',{id:'other-season'},now),/Seasonpass nicht verfügbar/);
 assert.equal(base.state.coins,2000);assert.equal(seasonPassView(base.state).premium,false);
});
test('Season entitlement survives save reload and reset and is scoped to the current season',()=>{
 const base=initial(),id=base.view.seasonPass.id;base.state.coins=1000;
 const bought=execute(base.state,'seasonPassBuy',{id},now);
 const restored=execute(JSON.parse(JSON.stringify(bought.state)),'sync',{},now);
 assert.equal(restored.view.seasonPass.premium,true);
 assert.equal(execute(restored.state,'reset',{},now).view.seasonPass.premium,true);
 base.state.premiumShop.ownedSeasonPasses=['retired-season'];
 assert.equal(execute(base.state,'sync',{},now).view.seasonPass.premium,false);
});
const setup=async()=>componentHarness('Season.tsx',{'./seasonRewards':await import('../src/seasonRewards.js')});
test('Season UI discloses both prices, requires confirmation, and disables purchases when unavailable',async()=>{
 const h=await setup(),pass=initial().view.seasonPass,calls=[];
 const props={pass,coins:1000,onCommand:async(...args)=>{calls.push(args);return {};}};
 let tree=h.render('Season',props);
 assert.ok(text(tree).includes('Preis: 500 Hermes-Siegel'));
 assert.ok(text(tree).includes('1.000 Imperium-Taler'));
 assert.equal(nodes(tree,'RewardModal')[0].props.visible,false);
 const buy=()=>nodes(tree,'Btn').find(b=>text(b)==='Für 1.000 Imperium-Taler freischalten');
 buy().props.onPress();assert.equal(calls.length,0);
 tree=h.render('Season',props);assert.equal(nodes(tree,'RewardModal')[0].props.visible,true);
 await nodes(tree,'Btn').find(b=>text(b)==='Für 1.000 Taler kaufen').props.onPress();
 assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['seasonPassBuy',{id:pass.id}]]);
 tree=h.render('Season',props);assert.equal(nodes(tree,'RewardModal')[0].props.visible,false);
 tree=h.render('Season',{...props,coins:999});assert.equal(buy().props.disabled,true);
 tree=h.render('Season',{...props,busy:true});assert.equal(buy().props.disabled,true);
 tree=h.render('Season',{...props,pass:undefined});assert.equal(buy().props.disabled,true);
 tree=h.render('Season',{...props,pass:{...pass,premium:true}});
 assert.ok(text(tree).includes('Premium freigeschaltet'));
 assert.ok(text(tree).includes('Fortschritt und Belohnungsabholung sind noch nicht verfügbar.'));
 assert.ok(!nodes(tree,'Btn').some(b=>text(b)==='Für 1.000 Imperium-Taler freischalten'));
});
