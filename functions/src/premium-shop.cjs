'use strict';
// Server-owned catalogue. Add a paid skin only together with its real, approved art.
const BUNDLE_ID='wombat-couriers';
const SKINS=Object.freeze([
 {id:'wombat-standard',name:'Lastwombat',description:'Dein klassischer Stadtbote.',price:0,art:'wombat-standard'},
 {id:'wombat-forest',name:'Waldwombat',description:'Rindenbraunes Fell, bewährtes Leder und ein geflochtener Rückenkorb.',price:null,bundleId:BUNDLE_ID,art:'wombat-forest'},
 {id:'wombat-stone',name:'Steinwombat',description:'Ein verlässlicher Bote zwischen Fels und Erz mit robustem Geschirr.',price:null,bundleId:BUNDLE_ID,art:'wombat-stone'},
 {id:'wombat-post',name:'Postwombat',description:'Mit Postmütze und roten Ledertaschen unterwegs zu deinen Kunden.',price:null,bundleId:BUNDLE_ID,art:'wombat-post'},
 {id:'wombat-crown',name:'Kronenbote',description:'Prunkvolles Hofgeschirr und eine versiegelte Depeschenkassette.',price:null,bundleId:BUNDLE_ID,art:'wombat-crown'},
 {id:'wombat-coast',name:'Küstenwombat',description:'Sandgraues Fell, blaues Satteltuch und eine seemännisch gesicherte Lieferkiste.',price:null,bundleId:BUNDLE_ID,art:'wombat-coast'}
].map(Object.freeze));
const SKIN_BUNDLES=Object.freeze([Object.freeze({id:BUNDLE_ID,name:'Wombat-Boten',description:'Fünf neue Looks für deine Boten: Wald, Stein, Post, Krone und Küste.',price:250,skinIds:Object.freeze(SKINS.filter(s=>s.bundleId===BUNDLE_ID).map(s=>s.id))})]);
const PACKS=Object.freeze([250,500,1000,2000,3000,5000].map(amount=>Object.freeze({id:'premium-'+amount,amount,referencePriceCents:amount,currency:'EUR'})));
const STANDARD='wombat-standard';
function premiumState(state){
 const old=state.premiumShop||{};
 // Preserve purchased entitlements even when a cosmetic leaves the catalogue.
 const owned=Array.isArray(old.ownedSkins)?[...new Set(old.ownedSkins.filter(id=>typeof id==='string'&&/^[-a-z0-9]{1,80}$/.test(id)))]:[];
 if(!owned.includes(STANDARD))owned.unshift(STANDARD);
 state.premiumShop={balance:Number.isSafeInteger(old.balance)&&old.balance>=0?old.balance:0,ownedSkins:owned,ownedSeasonPasses:Array.isArray(old.ownedSeasonPasses)?[...new Set(old.ownedSeasonPasses.filter(id=>typeof id==='string'&&/^[-a-z0-9]{1,80}$/.test(id)))]:[],equippedSkin:owned.includes(old.equippedSkin)&&SKINS.some(s=>s.id===old.equippedSkin)?old.equippedSkin:STANDARD};
 return state.premiumShop;
}
function purchaseSkin(state,id,catalogue=SKINS){
 const skin=catalogue.find(s=>s.id===id);
 if(!skin||skin.bundleId||!Number.isSafeInteger(skin.price)||skin.price<0)throw Error('Skin nicht verfügbar.');
 const wallet=premiumState(state);
 if(wallet.ownedSkins.includes(id))return false;
 if(wallet.balance<skin.price)throw Error('Nicht genügend Hermes-Siegel.');
 wallet.balance-=skin.price;wallet.ownedSkins.push(id);
 return true;
}
function purchaseSkinBundle(state,id){
 const bundle=SKIN_BUNDLES.find(b=>b.id===id);
 if(!bundle)throw Error('Skin-Paket nicht verfügbar.');
 const wallet=premiumState(state),missing=bundle.skinIds.filter(skinId=>!wallet.ownedSkins.includes(skinId));
 if(!missing.length)return false;
 if(wallet.balance<bundle.price)throw Error('Nicht genügend Hermes-Siegel.');
 wallet.balance-=bundle.price;wallet.ownedSkins.push(...missing);
 return true;
}
function equipSkin(state,id){
 const wallet=premiumState(state);
 if(!SKINS.some(s=>s.id===id)||!wallet.ownedSkins.includes(id))throw Error('Skin nicht verfügbar.');
 if(wallet.equippedSkin===id)return false;
 wallet.equippedSkin=id;return true;
}
function premiumShopView(state){
 const wallet=premiumState(state);
 return {...wallet,name:'Hermes-Siegel',skinPrice:250,skins:SKINS,skinBundles:SKIN_BUNDLES.map(bundle=>({...bundle,owned:bundle.skinIds.every(id=>wallet.ownedSkins.includes(id))})),packs:PACKS,purchasesAvailable:false};
}
module.exports={premiumState,purchaseSkin,purchaseSkinBundle,equipSkin,premiumShopView};
