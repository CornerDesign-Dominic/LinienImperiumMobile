'use strict';
const {createHash}=require('node:crypto');
// Only display chunks are negotiated; gameplay state and one-shot rewards are
// always sent. Fingerprints cover their actual content, including dynamic costs.
const CACHE_VERSION=1;
const CACHE_KEYS=['transportUpgradeOptions','catalog','help','cardVehicles','expeditionMap','projectCatalog'];
function compactResponse(view,requested){
 if(requested?.version!==CACHE_VERSION)return view; // Older installed apps.
 const candidate=requested.hashes;
 const valid=candidate&&typeof candidate==='object'&&!Array.isArray(candidate)&&Object.keys(candidate).length<=CACHE_KEYS.length&&Object.entries(candidate).every(([key,hash])=>CACHE_KEYS.includes(key)&&typeof hash==='string'&&/^[a-f0-9]{64}$/.test(hash));
 const known=valid?candidate:{};
 const hashes={},response={...view};
 for(const key of CACHE_KEYS){
  if(!Object.prototype.hasOwnProperty.call(view,key))continue;
  const hash=createHash('sha256').update(JSON.stringify(view[key])).digest('hex');
  hashes[key]=hash;
  if(known[key]===hash)delete response[key];
 }
 response.responseCache={version:CACHE_VERSION,hashes};
 return response;
}
module.exports={CACHE_VERSION,CACHE_KEYS,compactResponse};
