const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {execute}=require('../functions/src/engine.cjs');
const {premiumShopView}=require('../functions/src/premium-shop.cjs');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const now=1800000000000,bundleId='wombat-couriers';
const ids=['wombat-forest','wombat-stone','wombat-post','wombat-crown','wombat-coast'];
const initial=(balance=250)=>{const r=execute(null,'foundCompany',{companyName:'Boten',cityName:'Hafen'},now,()=>.5);r.state.premiumShop.balance=balance;return r.state;};

test('One server-priced bundle purchase unlocks all five approved skins, preserving courier gameplay values',()=>{
 const state=initial(500),before=execute(state,'sync',{},now).state;
 const result=execute(before,'skinBundleBuy',{id:bundleId,price:0,skinIds:['fake'],balance:9999},now);
 assert.equal(result.state.premiumShop.balance,250);
 assert.deepEqual(result.state.premiumShop.ownedSkins,['wombat-standard',...ids]);
 assert.equal(result.state.premiumShop.equippedSkin,'wombat-standard','Purchase does not silently select a cosmetic');
 assert.equal(result.view.premiumShop.skinBundles[0].owned,true);
 for(const key of ['coins','trucks','hubs','inventory','company','stats'])assert.deepEqual(result.state[key],before[key],key);
 const again=execute(result.state,'skinBundleBuy',{id:bundleId},now);
 assert.equal(again.state.premiumShop.balance,250);
 assert.deepEqual(again.state.premiumShop.ownedSkins,result.state.premiumShop.ownedSkins);
});

test('Insufficient funds, unknown bundle and individual paid skin purchases cannot grant entitlements',()=>{
 const state=initial(249),before=structuredClone(state);
 assert.throws(()=>execute(state,'skinBundleBuy',{id:bundleId,price:0},now),/Nicht genügend Hermes-Siegel/);
 assert.deepEqual(state,before);
 assert.throws(()=>execute(state,'skinBundleBuy',{id:'fake'},now),/Skin-Paket nicht verfügbar/);
 for(const id of ids){
  assert.throws(()=>execute(state,'skinBuy',{id,price:0},now),/Skin nicht verfügbar/);
  assert.throws(()=>execute(state,'skinEquip',{id},now),/Skin nicht verfügbar/);
 }
});

test('Every purchased cosmetic can be selected, survives reload/reset, and can revert to free standard',()=>{
 let r=execute(initial(),'skinBundleBuy',{id:bundleId},now);
 for(const id of ids){
  r=execute(r.state,'skinEquip',{id},now);
  r=execute(JSON.parse(JSON.stringify(r.state)),'sync',{},now);
  assert.equal(r.view.premiumShop.equippedSkin,id);
  assert.equal(r.view.premiumShop.skinBundles[0].owned,true);
 }
 const wallet=structuredClone(r.state.premiumShop);
 r=execute(r.state,'reset',{},now);assert.deepEqual(r.state.premiumShop,wallet);
 r=execute(r.state,'foundCompany',{companyName:'Boten',cityName:'Hafen'},now);
 r=execute(r.state,'skinEquip',{id:'wombat-standard'},now);
 assert.equal(r.view.premiumShop.equippedSkin,'wombat-standard');
 assert.equal(r.view.premiumShop.balance,0);
});

const setup=()=>componentHarness('Wholesaler.tsx',{'./i18n':{t:String,getLocale:()=> 'de-DE'},'./LocationArt':{LocationArt:'LocationArt'},'./PremiumPackArt':{PremiumPackArt:'PremiumPackArt'}});
const props=()=>({onGifts:()=>{},onCommand:async()=>({}),shop:premiumShopView(initial())});
const button=(tree,label)=>nodes(tree,'Btn').find(node=>text(node)===label);
function open(h,p){const tree=h.render('Wholesaler',p);nodes(tree,'Pressable').find(n=>n.props.accessibilityRole==='tab'&&n.props.accessibilityLabel==='Skins').props.onPress();return h.render('Wholesaler',p);}

test('Shop reviews total bundle price before purchase and blocks rapid duplicate taps',async()=>{
 const h=setup(),calls=[];let finish;
 const p={...props(),onCommand:(...args)=>{calls.push(args);return new Promise(resolve=>finish=resolve);}};
 let tree=open(h,p);
 assert.ok(text(tree).includes('250 Hermes-Siegel · Gesamtpreis'));
 assert.equal(button(tree,'Für Boten verwenden'),undefined,'Unowned skins cannot be equipped');
 button(tree,'Paket kaufen · 250 Hermes-Siegel').props.onPress();assert.equal(calls.length,0);
 tree=h.render('Wholesaler',p);assert.ok(text(tree).includes('Alle fünf Skins für 250 Hermes-Siegel kaufen?'));
 const pending=button(tree,'Paket kaufen').props.onPress();await button(tree,'Paket kaufen').props.onPress();
 assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['skinBundleBuy',{id:bundleId}]]);
 assert.equal(button(h.render('Wholesaler',p),'Paket kaufen').props.disabled,true);
 finish({});await pending;
});

test('Shop gates insufficient funds and preserves failed confirmation for retry',async()=>{
 const h=setup(),p={...props(),onCommand:async()=>undefined};
 let tree=open(h,{...p,shop:{...p.shop,balance:249}});
 assert.equal(button(tree,'Paket kaufen · 250 Hermes-Siegel').props.disabled,true);
 tree=h.render('Wholesaler',p);button(tree,'Paket kaufen · 250 Hermes-Siegel').props.onPress();
 await button(h.render('Wholesaler',p),'Paket kaufen').props.onPress();
 tree=h.render('Wholesaler',p);assert.ok(button(tree,'Paket kaufen'));assert.ok(text(tree).includes('Aktion fehlgeschlagen'));
});

test('Owned gallery previews each exact motif and selects the requested cosmetic',async()=>{
 const h=setup(),calls=[],bought=execute(initial(),'skinBundleBuy',{id:bundleId},now);
 const p={...props(),shop:bought.view.premiumShop,onCommand:async(...args)=>{calls.push(args);return {};}};
 let tree=open(h,p);assert.equal(button(tree,'Paket kaufen · 250 Hermes-Siegel'),undefined);
 for(const id of ids){
  const skin=p.shop.skins.find(s=>s.id===id);
  nodes(tree,'Pressable').find(n=>n.props.accessibilityLabel==='Vorschau: '+skin.name).props.onPress();
  tree=h.render('Wholesaler',p);
  const modal=nodes(tree,'RewardModal').find(n=>n.props.title===skin.name);
  assert.equal(modal.props.visible,true);assert.equal(nodes(modal,'HubCourierArt')[0].props.skin,id);
 }
 const card=nodes(tree,'Card').find(n=>button(n,'Für Boten verwenden')&&nodes(n,'HubCourierArt').some(a=>a.props.skin==='wombat-crown'));
 await button(card,'Für Boten verwenden').props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['skinEquip',{id:'wombat-crown'}]]);
});

test('Renderer resolves all packaged JPEGs and safely falls back for an unknown skin',()=>{
 const assets={'../assets/art/hub/courier-wombat.jpg':'standard'};
 for(const id of ids){const relative='../assets/art/hub/skins/'+id+'.jpg';assets[relative]=id;const bytes=fs.readFileSync(path.join(__dirname,'../src',relative));assert.equal(bytes.readUInt16BE(0),0xffd8);assert.ok(bytes.length>50000);}
 const h=componentHarness('HubCourierArt.tsx',assets);
 for(const id of ids)assert.equal(nodes(h.render('HubCourierArt',{skin:id}),'Image')[0].props.source,id);
 assert.equal(nodes(h.render('HubCourierArt',{skin:'unknown'}),'Image')[0].props.source,'standard');
});
