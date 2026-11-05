'use strict';
const {premiumState}=require('./premium-shop.cjs');
const rewards=require('./season-rewards.json');
const POINTS_PER_LEVEL=1000,PRICE=1000;
const timeFormat=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
function berlinParts(at){const parts=Object.fromEntries(timeFormat.formatToParts(new Date(at)).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));return parts;}
function berlinMidnight(year,month,day){
 const local=Date.UTC(year,month-1,day);let at=local;
 for(let i=0;i<3;i++){const p=berlinParts(at),represented=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);at+=local-represented;}
 return at;
}
function calendar(at){const p=berlinParts(at),month=`${p.year}-${String(p.month).padStart(2,'0')}`,day=`${month}-${String(p.day).padStart(2,'0')}`;return {month,day,startsAt:berlinMidnight(p.year,p.month,1),endsAt:berlinMidnight(p.year,p.month+1,1),nextDailyAt:berlinMidnight(p.year,p.month,p.day+1)};}
const DAILY=[
 {id:'login',title:'Einmal anmelden',metric:'login',target:1},
 {id:'singles',title:'15 Einzelaufträge abschließen',metric:'singles',target:15},
 {id:'projects',title:'Eine Großauftragsbelohnung abholen',metric:'projects',target:1},
 {id:'procurement',title:'Zwei Beschaffungstouren abschließen',metric:'procurement',target:2},
 {id:'overtime',title:'100 Überstundenpunkte verwenden',metric:'overtime',target:100},
 {id:'expedition',title:'100 Expeditionspunkte verwenden',metric:'expedition',target:100},
 {id:'crates',title:'Eine verlorene Zustellung einsammeln',metric:'crates',target:1},
 {id:'local',title:'Fünf Nahverkehrsaufträge abschließen',metric:'local',target:5},
 {id:'long',title:'Fünf Fernverkehrsaufträge abschließen',metric:'long',target:5},
 {id:'customers',title:'Zwei verschiedene reguläre Kunden bedienen',metric:'customers',target:2},
 {id:'coins',title:'10.000 Imperium-Taler verdienen',metric:'coins',target:10000}
];
const MONTHLY=[
 {id:'singles',title:'600 Einzelaufträge abschließen',metric:'singles',target:600,rewards:[{id:'gear:uncommon',amount:20}]},
 {id:'projects',title:'20 Großauftragsbelohnungen abholen',metric:'projects',target:20,rewards:[{id:'capacityModules',amount:2}]},
 {id:'crates',title:'40 verlorene Zustellungen einsammeln',metric:'crates',target:40,rewards:[{id:'hubVehicleParts',amount:60}]},
 {id:'local',title:'160 Nahverkehrsaufträge abschließen',metric:'local',target:160,rewards:[{id:'companyItems',amount:10}]},
 {id:'long',title:'160 Fernverkehrsaufträge abschließen',metric:'long',target:160,rewards:[{id:'supplierContacts',amount:10}]},
 {id:'customers',title:'Bediene Stammkunden mit 20 Aufträgen',metric:'customerOrders',target:20,rewards:[{id:'gear:rare',amount:10}]},
 {id:'procurement',title:'80 Beschaffungstouren abschließen',metric:'procurement',target:80,rewards:[{id:'expeditionRefills',amount:4}]}
];
function metrics(){return {login:0,singles:0,projects:0,procurement:0,overtime:0,expedition:0,crates:0,local:0,long:0,customers:0,customerOrders:0,coins:0,customerIds:[]};}
function fresh(month,run,enabled){return {version:2,run,enabled,month:month.month,startsAt:month.startsAt,endsAt:month.endsAt,day:month.day,dailyVersion:1,dailyRotation:0,points:0,metrics:metrics(),dailyMetrics:metrics(),taskClaims:[],dailyClaims:[],freeClaimed:[],premiumClaimed:[],infinityClaimed:0};}
function seasonId(season){return `season-${season.month}-r${season.run}`;}
function touchSeason(state,now=Date.now()){
 const c=calendar(now);let s=state.season;
 if(!s||s.version!==2){s=state.season=fresh(c,1,false);}
 if(s.enabled&&s.month!==c.month&&now>=s.endsAt){s=state.season=fresh(c,s.run+1,true);}
 if(s.day!==c.day){s.day=c.day;s.dailyMetrics=metrics();s.dailyClaims=[];s.dailyVersion++;s.dailyRotation=0;}
 if(s.enabled&&now>=s.startsAt&&now<s.endsAt){s.dailyMetrics.login=1;s.metrics.login=1;}
 return s;
}
function active(state,now){const s=touchSeason(state,now);return s.enabled&&now>=s.startsAt&&now<s.endsAt?s:null;}
function requireSeason(state,requested,now){const s=touchSeason(state,now);if(!s.enabled||requested!==seasonId(s)||now>=s.endsAt)throw Error('Seasonstatus geändert. Bitte neu laden.');return s;}
function dailyPool(s){
 // Stable rotation, independent of gameplay random rolls and repeated sync calls.
 let hash=2166136261;for(const char of s.day+':'+s.dailyRotation)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
 const shuffled=DAILY.map((task,index)=>({task,rank:((Math.imul(hash^(index+1),2654435761)>>>0))})).sort((a,b)=>a.rank-b.rank);
 return shuffled.slice(0,4).map(row=>row.task);
}
function taskView(task,s,daily){const progress=Math.min(task.target,Math.max(0,(daily?s.dailyMetrics:s.metrics)[task.metric]||0));return {id:(daily?'daily:':'monthly:')+task.id,title:task.title,target:task.target,progress,points:100,rewards:task.rewards||[],claimed:(daily?s.dailyClaims:s.taskClaims).includes(task.id),complete:progress>=task.target};}
function seasonPassView(state,now=Date.now()){
 const s=touchSeason(state,now),wallet=premiumState(state),earned=Math.max(0,Math.floor(s.points/POINTS_PER_LEVEL)-30);
 return {id:seasonId(s),status:s.enabled?'active':'inactive',startsAt:s.startsAt,endsAt:s.endsAt,nextDailyAt:calendar(now).nextDailyAt,points:s.points,level:Math.min(30,Math.floor(s.points/POINTS_PER_LEVEL)),pointsPerLevel:POINTS_PER_LEVEL,price:PRICE,placeholder:false,premium:wallet.ownedSeasonPasses.includes(seasonId(s)),freeClaimed:[...s.freeClaimed],premiumClaimed:[...s.premiumClaimed],dailyVersion:s.dailyVersion,dailies:dailyPool(s).map(t=>taskView(t,s,true)),monthlies:MONTHLY.map(t=>taskView(t,s,false)),rewards,infinity:{earned,claimed:s.infinityClaimed,available:Math.max(0,earned-s.infinityClaimed),reward:{id:'specialOrders',amount:1}}};
}
function controlSeason(state,action,now){
 const s=touchSeason(state,now),c=calendar(now);
 if(action==='start'){if(s.enabled)return false;state.season=fresh(c,s.run+1,true);touchSeason(state,now);return true;}
 if(action==='reset'){state.season=fresh(c,s.run+1,false);return true;}
 if(action==='daily'){if(!s.enabled)throw Error('Bitte zuerst die Season starten.');s.dailyMetrics=metrics();s.dailyMetrics.login=1;s.dailyClaims=[];s.dailyVersion++;s.dailyRotation++;return true;}
 throw Error('Unbekannte Seasonaktion.');
}
function recordSeasonActivity(state,metric,amount=1,at=Date.now(),detail){
 // Offline arrivals belong to the period in which they actually happened. Do not
 // advance a season clock here: subsystem settlement can visit timestamps out of order.
 const s=state.season;if(!s?.enabled||s.version!==2||at<s.startsAt||at>=s.endsAt||!Number.isFinite(amount)||amount<=0)return;
 const day=calendar(at).day;
 for(const target of [s.metrics,...(day===s.day?[s.dailyMetrics]:[])]){
  if(metric==='customers'){
   if(typeof detail!=='string'||target.customerIds.includes(detail))continue;
   target.customerIds.push(detail);target.customers=target.customerIds.length;
  }else target[metric]=(target[metric]||0)+amount;
 }
 if(metric==='overtime'||metric==='expedition')s.points+=Math.floor(amount);
}
function purchaseSeasonPass(state,id,now=Date.now()){
 const s=requireSeason(state,id,now),wallet=premiumState(state);
 if(wallet.ownedSeasonPasses.includes(id))return false;
 if(wallet.balance<PRICE)throw Error('Nicht genügend Hermes-Siegel.');
 wallet.balance-=PRICE;wallet.ownedSeasonPasses.push(seasonId(s));return true;
}
function summary(){return {source:'Season',count:0,coins:0,gears:{},capacityModules:0,companyItems:0,supplierContacts:0,hermes:0,seasonPoints:0,specialOrders:0};}
function grant(state,reward,out,grantSpecial){
 const {id,amount}=reward;if(!Number.isSafeInteger(amount)||amount<=0)throw Error('Ungültige Seasonbelohnung.');
 if(id==='coins'){state.coins+=amount;out.coins+=amount;}
 else if(id==='hermes'){premiumState(state).balance+=amount;out.hermes+=amount;}
 else if(id==='specialOrders'){for(let i=0;i<amount;i++)grantSpecial();out.specialOrders+=amount;}
 else if(id.startsWith('gear:')){const rarity=id.slice(5);state.inventory.gears[rarity]+=amount;out.gears[rarity]=(out.gears[rarity]||0)+amount;}
 else {state.inventory[id]=(state.inventory[id]||0)+amount;out[id]=(out[id]||0)+amount;}
}
function claimTask(state,p,now,out){
 const s=requireSeason(state,p.seasonId,now),daily=p.id?.startsWith('daily:');
 const key=p.id?.slice(daily?6:8),pool=daily?dailyPool(s):MONTHLY,task=pool.find(t=>t.id===key);
 if(!task||p.id!==(daily?'daily:':'monthly:')+task.id)throw Error('Seasonaufgabe nicht verfügbar.');
 if(daily&&p.dailyVersion!==s.dailyVersion)throw Error('Tagesaufgaben geändert. Bitte neu laden.');
 const claimed=daily?s.dailyClaims:s.taskClaims;if(claimed.includes(key))return false;
 if((daily?s.dailyMetrics:s.metrics)[task.metric]<task.target)throw Error('Seasonaufgabe noch nicht abgeschlossen.');
 claimed.push(key);s.points+=100;out.seasonPoints+=100;out.count++;
 for(const reward of task.rewards||[])grant(state,reward,out);
 return true;
}
function claimLevel(state,p,now,out,grantSpecial){
 const s=requireSeason(state,p.seasonId,now),level=p.level;
 if(!Number.isSafeInteger(level)||level<1||level>30||!['free','premium'].includes(p.track))throw Error('Ungültige Seasonstufe.');
 if(p.track==='premium'&&!premiumState(state).ownedSeasonPasses.includes(seasonId(s)))throw Error('Premium ist gesperrt.');
 const claimed=p.track==='premium'?s.premiumClaimed:s.freeClaimed;if(claimed.includes(level))return false;
 if(s.points<level*POINTS_PER_LEVEL)throw Error('Seasonstufe noch nicht erreicht.');
 grant(state,rewards[level-1][p.track],out,grantSpecial);claimed.push(level);out.count++;return true;
}
function claimInfinity(state,p,now,out,grantSpecial){
 const s=requireSeason(state,p.seasonId,now),available=Math.max(0,Math.floor(s.points/POINTS_PER_LEVEL)-30-s.infinityClaimed);
 if(!available)return false;
 grant(state,{id:'specialOrders',amount:available},out,grantSpecial);s.infinityClaimed+=available;out.count+=available;return true;
}
function claimSeason(state,action,p,now,grantSpecial){
 const out=summary(),s=requireSeason(state,p.seasonId,now);
 if(action==='task')claimTask(state,p,now,out);
 else if(action==='level')claimLevel(state,p,now,out,grantSpecial);
 else if(action==='infinity')claimInfinity(state,p,now,out,grantSpecial);
 else if(action==='all'){
  for(const task of [...dailyPool(s).map(t=>taskView(t,s,true)),...MONTHLY.map(t=>taskView(t,s,false))])if(task.complete&&!task.claimed)claimTask(state,{id:task.id,seasonId:p.seasonId,dailyVersion:s.dailyVersion},now,out);
  for(const track of ['free','premium']){
   if(track==='premium'&&!premiumState(state).ownedSeasonPasses.includes(seasonId(s)))continue;
   for(let level=1;level<=Math.min(30,Math.floor(s.points/POINTS_PER_LEVEL));level++)claimLevel(state,{seasonId:p.seasonId,level,track},now,out,grantSpecial);
  }
  claimInfinity(state,p,now,out,grantSpecial);
 }else throw Error('Unbekannte Seasonabholung.');
 return out.count?out:false;
}
function rollProjectHermes(order,random=Math.random){
 if(!order?.project||!['special','referral'].includes(order.kind)||!order.completionReward||Object.hasOwn(order.completionReward,'hermes'))return;
 const referral=order.kind==='referral';order.completionReward.hermes=random()<(referral ? .5 : .25)?(referral?5:1)+Math.floor(random()*(referral?6:3)):0;
}
module.exports={POINTS_PER_LEVEL,PRICE,calendar,touchSeason,seasonPassView,controlSeason,recordSeasonActivity,purchaseSeasonPass,claimSeason,rollProjectHermes,DAILY,MONTHLY};
