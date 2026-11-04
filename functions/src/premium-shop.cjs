'use strict';
// Server-owned catalogue. Add a paid skin only together with its real, approved art.
const SKINS=Object.freeze([Object.freeze({id:'wombat-standard',name:'Lastwombat',description:'Dein klassischer Stadtbote.',price:0,art:'wombat-standard'})]);
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
 if(!skin||!Number.isSafeInteger(skin.price)||skin.price<0)throw Error('Skin nicht verfügbar.');
 const wallet=premiumState(state);
 if(wallet.ownedSkins.includes(id))return false;
 if(wallet.balance<skin.price)throw Error('Nicht genügend Hermes-Siegel.');
 wallet.balance-=skin.price;wallet.ownedSkins.push(id);
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
 return {...wallet,name:'Hermes-Siegel',skinPrice:250,skins:SKINS,packs:PACKS,purchasesAvailable:false};
}
module.exports={premiumState,purchaseSkin,equipSkin,premiumShopView};
