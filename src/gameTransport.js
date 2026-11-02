// Content-addressed, in-memory display cache. Never persist account data and
// never omit state/reward fields. A full legacy response remains supported.
const CACHE_VERSION=1;
const CACHE_KEYS=['transportUpgradeOptions','catalog','help','cardVehicles','expeditionMap','projectCatalog'];
const clone=value=>JSON.parse(JSON.stringify(value));
function transportError(code,message){const error=new Error(message);error.code=code;return error;}
function createResponseCache(){
 let owner=null,entries={};
 const reset=()=>{owner=null;entries={};};
 const select=uid=>{if(owner!==uid){owner=uid;entries={};}};
 return {
  reset,
  request(uid,full=false){select(uid);return {version:CACHE_VERSION,hashes:full?{}:Object.fromEntries(Object.entries(entries).map(([key,entry])=>[key,entry.hash]))};},
  hydrate(uid,response){
   select(uid);
   const metadata=response?.responseCache;
   if(!metadata){entries={};return response;} // Old server during rollout.
   if(metadata.version!==CACHE_VERSION||!metadata.hashes||typeof metadata.hashes!=='object'||Array.isArray(metadata.hashes))throw transportError('client/cache-missing','Spielstand muss vollständig aktualisiert werden.');
   const hydrated={...response},next={...entries};delete hydrated.responseCache;
   for(const key of CACHE_KEYS){
    const hash=metadata.hashes[key];
    if(hash===undefined){delete next[key];continue;}
    if(typeof hash!=='string'||!/^[a-f0-9]{64}$/.test(hash))throw transportError('client/cache-missing','Ungültige Aktualisierung.');
    if(Object.prototype.hasOwnProperty.call(response,key))next[key]={hash,value:clone(response[key])};
    else if(entries[key]?.hash===hash)hydrated[key]=clone(entries[key].value);
    else throw transportError('client/cache-missing','Spielstand muss vollständig aktualisiert werden.');
   }
   entries=next; // Accept only after every referenced chunk is present.
   return hydrated;
  }
 };
}
function isNetworkFailure(error){return error?.code==='functions/internal'&&/\[0\]\s*$/.test(error.message||'');}
const retryable=error=>isNetworkFailure(error)||['functions/unavailable','functions/deadline-exceeded','auth/network-request-failed'].includes(error?.code);
async function requestGame({call,cache,uid,currentUid,action='sync',payload={},requestId,sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),random=Math.random}){
 let retried=false,recovered=false,full=false;
 for(;;){
  if(currentUid()!==uid)throw transportError('client/account-changed','Das Konto wurde gewechselt.');
  try{
   const response=await call({action,payload,requestId,responseCache:cache.request(uid,full)});
   if(currentUid()!==uid)throw transportError('client/account-changed','Das Konto wurde gewechselt.');
   return cache.hydrate(uid,response.data);
  }catch(error){
   if(error?.code==='client/cache-missing'&&!recovered){recovered=true;full=true;cache.reset();continue;}
   if(!retried&&retryable(error)){retried=true;await sleep(400+Math.floor(random()*401));continue;}
   throw error;
  }
 }
}
module.exports={createResponseCache,requestGame,isNetworkFailure};
