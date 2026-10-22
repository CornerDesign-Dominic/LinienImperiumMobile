'use strict';
const EVENT_ID='large-project-own-overtime',DAY=86400000,EVENT_PROJECT_DISTANCE_KM=240;
const EVENTS=[{id:EVENT_ID,title:'Die Pyramide',description:'Gemeinsam bauen · eigene Flotte und Überstunden · 100 Baustufen',rarity:'legendary',unlimited:true,distance:240}];
// Initial benchmark: five unupgraded Common vehicles, 18 h/day for 3.5 days
// plus 100 overtime points at 240 km yield about 9,827 t. Round to 10,000.
function scaleEvent(players){const work=Math.max(1,players)*10000*240,target=Math.max(1,Math.ceil(work/360/1e6))*1e6;return {target,distance:Math.min(360,Math.max(180,Math.ceil(work/target/10)*10)),durationMs:5*DAY};}
function makeWorld(now){return {id:'pyramid-'+now,registrationAt:now,startsAt:now+2*DAY,endsAt:now+7*DAY,registered:0,total:0};}
function lockWorld(world,now){if(world&&now>=world.startsAt&&!world.config)world.config=scaleEvent(world.registered);return world;}
function currentEvent(state,id,run){if(id!==EVENT_ID)throw Error('Unbekanntes Event.');const event=state.eventTests?.[id];if(!Number.isSafeInteger(run)||run!==(event?.run||0))throw Error('Der Eventstatus hat sich geändert. Bitte aktualisieren.');return event;}
function initializePass(){return {loginDays:[],overtime:0,expedition:0,deliveries:0,claimed:[],communityClaimed:0};}
function changeEvent(state,id,action,run,now,options={}){
 const old=currentEvent(state,id,run);
 if(action==='start'){
  if(old?.status==='running')throw Error('Dieses Event läuft bereits.');
  const target=options.target??1000,distance=options.distance??240,durationHours=options.durationHours??120;
  if(!Number.isSafeInteger(target)||target<100||target>1000000||![180,240,360].includes(distance)||![2,24,120].includes(durationHours))throw Error('Ungültige Testeinstellung.');
  state.eventTests||={};state.eventTests[id]={status:'running',run:run+1,mode:'solo',startedAt:now,endsAt:now+durationHours*3600000,endedAt:null,target,distance,pass:initializePass()};return 'Pyramiden-Solotest gestartet.';
 }
 if(action!=='end'||old?.status!=='running')throw Error('Dieses Event läuft nicht.');old.status='ended';old.endedAt=now;return 'Event beendet. Belohnungen bleiben abholbar.';
}
function joinEvent(state,world,now,ledger={}){
 if(!world||now<world.startsAt||now>=world.endsAt)throw Error('Das Gemeinschaftsevent läuft derzeit nicht.');
 const old=state.eventTests?.[EVENT_ID];if(old?.communityId===world.id)return 'Bereits beigetreten.';if(old?.status==='running')throw Error('Bitte zuerst deinen Solotest beenden.');
 state.eventTests||={};state.eventTests[EVENT_ID]={status:'running',run:(old?.run||0)+1,mode:'community',communityId:world.id,startedAt:world.startsAt,endsAt:world.endsAt,endedAt:null,...world.config,priorDelivered:ledger.delivered||0,pass:ledger.pass||initializePass()};return 'Dem Pyramidenbau beigetreten.';
}
function prepareEvent(state){const e=state.eventTests?.[EVENT_ID];if(e){e.pass||=initializePass();e.target??=1000;e.distance??=240;e.mode??='solo';e.endsAt??=e.startedAt+5*DAY;}}
function touchEvent(state,now){
 const event=state.eventTests?.[EVENT_ID];if(!event)return;
 event.pass||=initializePass();event.target??=1000;event.distance??=240;event.mode??='solo';event.endsAt??=event.startedAt+5*DAY;
 if(event.status!=='running')return;if(now>=event.endsAt){event.status='ended';event.endedAt=event.endsAt;return;}
 const day=Math.floor((now-event.startedAt)/DAY);if(!event.pass.loginDays.includes(day))event.pass.loginDays.push(day);
}
function recordActivity(state,action,before,now){
 const event=state.eventTests?.[EVENT_ID];if(event?.status!=='running'||now>=event.endsAt)return;
 const pass=event.pass;
 if(['overtime','eventOvertime'].includes(action))pass.overtime+=Math.max(0,before.overtime-state.overtimePoints);
 if(['discover','draw','mission','giftOpen'].includes(action))pass.expedition+=Math.max(0,before.expedition-state.expedition.points);
 pass.deliveries=Math.max(pass.deliveries,event.project?.delivered||0);
}
function passTasks(event){const p=event.pass||initializePass();return [
 {id:'login',title:'An verschiedenen Eventtagen anmelden',value:p.loginDays.length,target:Math.min(5,Math.max(1,Math.ceil((event.endsAt-event.startedAt)/DAY))),points:20},
 {id:'overtime',title:'Überstundenpunkte verwenden',value:p.overtime,target:100,points:30},
 {id:'expedition',title:'Expeditionspunkte verwenden',value:p.expedition,target:50,points:30},
 {id:'delivery',title:'Steine zur Pyramide liefern',value:Math.max(p.deliveries,event.project?.delivered||0),target:event.mode==='solo'?Math.min(1000,event.target):1000,points:20}
 ].map(task=>({...task,earned:Math.min(task.points,task.value/task.target*task.points)}));}
function rewardFor(stage,kind){if(kind==='pass')return stage===10?{legendaryPlaceholder:1}:stage%3===0?{capacityModules:1}:stage%2===0?{expeditionRefills:1}:{overtimeRefills:1};return stage%10===0?{capacityModules:1}:stage%5===0?(stage%20===5?{expeditionRefills:1}:{overtimeRefills:1}):{gearsCommon:2};}
function grantReward(state,event,reward){
 // Solo rewards are a preview ledger, not a repeatable main-game faucet.
 if(event.mode==='solo'){event.testRewards||={};for(const [key,n]of Object.entries(reward))event.testRewards[key]=(event.testRewards[key]||0)+n;return;}
 for(const [key,n]of Object.entries(reward)){if(key==='gearsCommon')state.inventory.gears.common+=n;else if(key==='legendaryPlaceholder'){state.eventCards||={};state.eventCards.pyramidLegendary=(state.eventCards.pyramidLegendary||0)+n;}else state.inventory[key]=(state.inventory[key]||0)+n;}
}
function eventTotal(event,world){return event.mode==='community'&&world?.id===event.communityId?world.total:event.project?.delivered||0;}
function claimEvent(state,id,run,kind,now,world){
 const event=currentEvent(state,id,run);if(!event)throw Error('Dieses Event wurde noch nicht gestartet.');
 if(kind==='community'){
  if(!(event.project?.delivered>0))throw Error('Liefere zuerst mindestens einen Steinanteil.');
  const stage=Math.min(100,Math.floor(eventTotal(event,world)/event.target*100));if(stage<=event.pass.communityClaimed)throw Error('Keine neuen Baustufenbelohnungen.');
  for(let i=event.pass.communityClaimed+1;i<=stage;i++)grantReward(state,event,rewardFor(i,'community'));event.pass.communityClaimed=stage;
 }else if(kind==='pass'){
  const points=passTasks(event).reduce((sum,t)=>sum+t.earned,0),stage=Math.min(10,Math.floor((points+1e-9)/8.5));
  const available=Array.from({length:stage},(_,i)=>i+1).filter(i=>!event.pass.claimed.includes(i));if(!available.length)throw Error('Keine neuen Passbelohnungen.');
  for(const i of available){grantReward(state,event,rewardFor(i,'pass'));event.pass.claimed.push(i);}
 }else throw Error('Unbekannter Belohnungspfad.');return event.mode==='solo'?'Testbelohnungen im Event verbucht.':'Eventbelohnungen abgeholt.';
}
function spendEventOvertime(state,id,run,amount,now){
 const event=currentEvent(state,id,run);if(event?.status!=='running'||now>=event.endsAt||!event.project)throw Error('Bitte zuerst eine Flotte im laufenden Event einsetzen.');
 if(amount==='max')amount=Math.floor(state.overtimePoints||0);if(!Number.isSafeInteger(amount)||amount<1||amount>100000||amount>state.overtimePoints)throw Error('Nicht genügend Überstundenpunkte.');
 const tons=amount*1000/event.distance;state.overtimePoints-=amount;event.project.delivered+=tons;event.project.tonKm+=tons*event.distance;event.overtimeUsed=(event.overtimeUsed||0)+amount;return amount+' Überstundenpunkte eingesetzt.';
}
function assignEventFleet(state,id,run,template,options,now){
 const event=currentEvent(state,id,run);if(event?.status!=='running')throw Error('Dieses Event läuft nicht.');if(event.project)throw Error('Für diesen Durchlauf ist bereits eine Flotte eingesetzt.');
 const option=options.find(o=>o.index===template);if(!option?.vehicles?.length)throw Error('Bitte zuerst mindestens eine Fahrzeugkarte in diese Flotte einsetzen.');
 event.project={template,assignedAt:now,distance:event.distance,delivered:event.priorDelivered||0,km:0,tonKm:0,tours:0,vehicles:JSON.parse(JSON.stringify(option.vehicles)).map(v=>({...v,completedTours:0,nextAt:now+v.cycleMs}))};return 'Flotte eingesetzt. Der Pyramidenbau läuft.';
}
function syncWorld(state,context){const e=state.eventTests?.[EVENT_ID];if(context.world&&e?.communityId===context.world.id){const score=e.project?.delivered||0;context.world.total+=Math.max(0,score-(context.reported||0));context.reported=Math.max(context.reported||0,score);}}
function eventViews(state,options=[],world=null,ranking=[]){return EVENTS.map(catalog=>{
 const saved=state.eventTests?.[catalog.id],tasks=saved?passTasks(saved):[],points=tasks.reduce((sum,t)=>sum+t.earned,0),total=saved?eventTotal(saved,world):0;
 const local=saved?.project?.delivered>0?[{name:state.profile?.companyName||'Deine Firma',delivered:saved.project.delivered,own:true}]:[];
 return {...catalog,status:'available',run:0,...saved,rarity:catalog.rarity,total,stage:saved?Math.min(100,Math.floor(total/saved.target*100)):0,
 communityRewards:Array.from({length:100},(_,i)=>({stage:i+1,reward:rewardFor(i+1,'community')})),
 passView:{tasks,points,maxPoints:100,required:85,stage:Math.min(10,Math.floor((points+1e-9)/8.5)),rewards:Array.from({length:10},(_,i)=>({stage:i+1,points:(i+1)*8.5,reward:rewardFor(i+1,'pass')}))},
 rankingsFetched:saved?.mode!=='community',rankings:saved?.mode==='community'?ranking:local,registration:world?{...world,registeredSelf:state.eventRegistration===world.id}:null,
 scaling:[100,200,500,1000,2000,5000,10000].map(players=>({players,...scaleEvent(players)})),
 project:saved?.project?{...saved.project,vehicles:saved.project.vehicles.filter(v=>v.cardId).map(v=>{const desired=options.find(o=>o.index===saved.project.template)?.vehicles?.find(next=>next.slot===v.slot);return {...v,pendingCardId:desired?.cardId||null,pendingModel:desired?.model||null};})}:undefined,
 fleetOptions:saved?.status==='running'&&!saved.project?options:[]};});}
module.exports={EVENT_ID,DAY,EVENT_PROJECT_DISTANCE_KM,scaleEvent,makeWorld,lockWorld,joinEvent,touchEvent,recordActivity,eventViews,changeEvent,assignEventFleet,claimEvent,spendEventOvertime,passTasks,syncWorld,prepareEvent};
