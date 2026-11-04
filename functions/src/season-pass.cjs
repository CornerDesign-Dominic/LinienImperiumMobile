'use strict';
const {premiumState}=require('./premium-shop.cjs');
// This ID scopes the placeholder entitlement; a future season needs its own ID.
const SEASON_ID='season-preview-1';
const PRICE=500,TEST_PRICE=1000;
function seasonPassView(state){
 const wallet=premiumState(state);
 return {id:SEASON_ID,price:PRICE,temporaryPrice:TEST_PRICE,placeholder:true,level:0,premium:wallet.ownedSeasonPasses.includes(SEASON_ID),freeClaimed:[],premiumClaimed:[]};
}
function purchaseSeasonPass(state,id){
 if(id!==SEASON_ID)throw Error('Seasonpass nicht verfügbar. Bitte neu laden.');
 const wallet=premiumState(state);
 if(wallet.ownedSeasonPasses.includes(id))return false;
 if(!Number.isFinite(state.coins)||state.coins<TEST_PRICE)throw Error('Nicht genügend Imperium-Taler.');
 state.coins-=TEST_PRICE;
 wallet.ownedSeasonPasses.push(id);
 return true;
}
module.exports={seasonPassView,purchaseSeasonPass};
