const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const {premiumState,purchaseSkin}=require('../functions/src/premium-shop.cjs');
const now=1800000000000;
const initial=()=>execute(null,'foundCompany',{companyName:'Siegeltest',cityName:'Testhafen'},now,()=>.5);

test('Premium shop migrates old saves without awarding money and discloses disabled reference-price packs',()=>{
 const game=initial();delete game.state.premiumShop;
 const result=execute(game.state,'sync',{balance:5000,ownedSkins:['fake'],price:0},now);
 assert.equal(result.state.premiumShop.balance,0);
 assert.deepEqual(result.state.premiumShop.ownedSkins,['wombat-standard']);
 assert.equal(result.view.premiumShop.purchasesAvailable,false);
 assert.equal(result.view.premiumShop.name,'Hermes-Siegel');
 assert.equal(result.view.premiumShop.skinPrice,250);
 assert.deepEqual(result.view.premiumShop.packs.map(p=>[p.amount,p.referencePriceCents]),[[250,250],[500,500],[1000,1000],[2500,2500],[5000,5000]]);
 assert.equal(result.view.premiumShop.skins.filter(s=>s.price>0).length,0,'Never sell an unapproved image');
 assert.throws(()=>execute(game.state,'premiumGrant',{amount:5000},now),/Unbekannte Aktion/);
 assert.throws(()=>execute(game.state,'skinBuy',{id:'unpublished',price:0},now),/Skin nicht verfügbar/);
});

test('Server-owned cosmetic prices charge exactly once and reject insufficient balances without affecting game values',()=>{
 // Trusted future catalogue fixture; request payloads never supply a catalogue.
 const catalogue=[{id:'approved-test-skin',price:250}];
 const state={premiumShop:{balance:250,ownedSkins:[],equippedSkin:'wombat-standard'},coins:1000,trucks:[{capacity:2,speed:1}]};
 const values=JSON.stringify({coins:state.coins,trucks:state.trucks});
 assert.equal(purchaseSkin(state,'approved-test-skin',catalogue),true);
 assert.equal(state.premiumShop.balance,0);
 assert.equal(purchaseSkin(state,'approved-test-skin',catalogue),false);
 assert.equal(state.premiumShop.balance,0);
 assert.equal(JSON.stringify({coins:state.coins,trucks:state.trucks}),values);
 const poor={premiumShop:{balance:249}};
 assert.throws(()=>purchaseSkin(poor,'approved-test-skin',catalogue),/Nicht genügend/);
 assert.equal(poor.premiumShop.balance,249);
 assert.ok(!poor.premiumShop.ownedSkins.includes('approved-test-skin'));
 for(const balance of [-1,1.5,Infinity,'250'])assert.equal(premiumState({premiumShop:{balance}}).balance,0);
});

test('Premium balance and purchased entitlements survive save reload and test reset',()=>{
 const base=initial();base.state.premiumShop={balance:750,ownedSkins:['wombat-standard','retired-skin'],equippedSkin:'retired-skin'};
 const synced=execute(JSON.parse(JSON.stringify(base.state)),'sync',{},now);
 assert.equal(synced.state.premiumShop.balance,750);
 assert.ok(synced.state.premiumShop.ownedSkins.includes('retired-skin'));
 assert.equal(synced.state.premiumShop.equippedSkin,'wombat-standard');
 const reset=execute(synced.state,'reset',{},now);
 assert.deepEqual(reset.state.premiumShop,synced.state.premiumShop);
 assert.throws(()=>execute(synced.state,'skinEquip',{id:'retired-skin'},now),/Skin nicht verfügbar/);
});

test('Currency presentation updates legacy labels while preserving player names and monetary state',()=>{
 const {currencyText}=require('../functions/src/currency-names.cjs');
 const profile={companyName:'Münzen Express',cityName:'250 M'};
 assert.equal(currencyText('Münzen Express in 250 M: +500 Münzen',profile),'Münzen Express in 250 M: +500 Imperium-Taler');
 assert.equal(currencyText('25.000 M · 0,62 M/km'),'25.000 T · 0,62 T/km');
 assert.equal(currencyText('250 Premium-Münzen'),'250 Hermes-Siegel');
 const base=initial();base.state.premiumShop.balance=750;
 const next=execute(base.state,'sync',{},now);
 assert.equal(next.state.coins,base.state.coins);assert.equal(next.state.premiumShop.balance,750);
 assert.ok(next.view.help.hub[1].some(([,body])=>body.includes('Imperium-Taler')));
 assert.ok(next.view.help.hub[1].every(([,body])=>!body.includes('Münzen')));
});
