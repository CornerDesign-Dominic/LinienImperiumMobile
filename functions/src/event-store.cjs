'use strict';
const {EVENT_ID,makeWorld,lockWorld}=require('./events.cjs');
// All reads precede writes; event totals, score and player snapshot share one transaction.
async function readEventContext(tx,db,uid,action,now){
 const ref=db.doc('communityEvents/pyramid'),saved=await tx.get(ref);
 let world=saved.exists?saved.data():null;
 if(!world&&action==='eventRegister')world=makeWorld(now);
 if(!world)return {world:null,ranking:[],persist(){}};
 const savedWorld=JSON.stringify(world);
 lockWorld(world,now);
 const members=ref.collection('participants'),memberRef=members.doc(uid);
 const rankingLoaded=action==='eventRanks';
 const [own,leaders]=await Promise.all([tx.get(memberRef),rankingLoaded?tx.get(members.orderBy('delivered','desc').limit(50)):Promise.resolve({docs:[]})]);
 const member=own.exists?own.data():{};
 const ranking=leaders.docs.filter(d=>(d.data().delivered||0)>0).map(d=>({uid:d.id,...d.data(),own:d.id===uid}));
 const savedMember=JSON.stringify(member);
 const context={world,ranking,rankingLoaded,reported:member.accounted??member.delivered??0,member};
 if(action==='eventRegister'&&now<world.startsAt&&!member.registered){world.registered++;member.registered=true;}
 context.persist=(state)=>{
  const event=state.eventTests?.[EVENT_ID];
  if(member.registered)state.eventRegistration=world.id;
  const delivered=context.reported||0;
  const name=state.profile?.companyName||'Transportunternehmen';
  if(!saved.exists||JSON.stringify(world)!==savedWorld)tx.set(ref,world);
  const next={registered:!!member.registered,delivered:Math.round(delivered*1e6)/1e6,accounted:delivered,name,...(event?.communityId===world.id?{pass:event.pass}:member.pass?{pass:member.pass}:{})};
  if((member.registered||event?.communityId===world.id)&&JSON.stringify(next)!==savedMember)tx.set(memberRef,next);
 };
 return context;
}
function refreshRanking(view,context,uid,state){
 const event=view.testEvents?.[0];if(!event)return;
 if(context.world)event.registration={...context.world,registeredSelf:state.eventRegistration===context.world.id};
 if(event.mode!=='community')return;
 event.total=context.world.total;event.stage=Math.min(100,Math.floor(event.total/event.target*100));
 event.rankingsFetched=!!context.rankingLoaded;
 if(!context.rankingLoaded)return;
 const rows=context.ranking.filter(r=>r.uid!==uid);
 if(context.reported>0)rows.push({uid,name:state.profile?.companyName||'Deine Firma',delivered:Math.round(context.reported*1e6)/1e6,own:true});
 rows.sort((a,b)=>b.delivered-a.delivered||a.uid.localeCompare(b.uid));
 let rank=0,last;
 event.rankings=rows.map((row,i)=>{if(row.delivered!==last)rank=i+1;last=row.delivered;return {name:row.name,delivered:row.delivered,own:row.own,rank:i>=50&&row.delivered!==rows[49]?.delivered?null:rank};}).filter((r,i)=>i<50||r.own);
 event.total=context.world.total;
 event.stage=Math.min(100,Math.floor(event.total/event.target*100));
}
module.exports={readEventContext,refreshRanking};
