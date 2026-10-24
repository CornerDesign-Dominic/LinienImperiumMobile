import {ItemArt,ItemAmount} from './ItemArt';
import React,{useState,useEffect} from 'react';
import {View,StyleSheet,Pressable} from 'react-native';
import {Bar,Btn,Card,Empty,Pill,Row,Txt,C,n,remaining,minutes} from './ui';
import {TestEvent,legendaryStyle} from './Events';

export function EventProject({event,busy,clock,onFleet,onManage,onEnd,onCommand,overtimePoints}:{
 event?:TestEvent;busy:boolean;clock:number;
 onCommand:(action:string,payload?:Record<string,unknown>)=>void;overtimePoints:number;
 onFleet:(template:number)=>void;onManage:()=>void;onEnd:()=>void;
}){
 const [tab,setTab]=useState<'event'|'pass'|'ranks'>('event');
 const [showStages,setShowStages]=useState(false);
 const [rankings,setRankings]=useState<TestEvent['rankings']>(event?.rankingsFetched?event.rankings:[]);
 useEffect(()=>{if(event?.rankingsFetched)setRankings(event.rankings);},[event]);
 useEffect(()=>{if(tab!=='ranks'||event?.mode!=='community')return;const timer=setInterval(()=>onCommand('eventRanks'),30000);return()=>clearInterval(timer);},[tab]);
 if(!event)return <Empty>Event nicht verfügbar.</Empty>;
 const running=event.status==='running',project=event.project;
 const claim=(kind:string)=>onCommand('eventClaim',{kind});
 return <>
  <Row style={{flexWrap:'nowrap',gap:6}}>{([['event','Event'],['pass','Pass'],['ranks','Ränge']] as const).map(([key,label])=><Pressable key={key} accessibilityRole="tab" accessibilityState={{selected:tab===key}} aria-selected={tab===key} onPress={()=>{setTab(key);if(key==='ranks'&&event.mode==='community')onCommand('eventRanks');}} style={[styles.tab,tab===key&&{borderColor:C.legendary,backgroundColor:C.goldWash}]}><Txt style={{fontWeight:'700'}}>{label}</Txt></Pressable>)}</Row>
  <Card style={legendaryStyle}>
   <Row><Txt style={{color:C.legendary,fontWeight:'700'}}>LEGENDÄR · EVENT</Txt><Pill>{running?'LÄUFT':'BEENDET'}</Pill></Row>
   <Txt style={{fontSize:18,fontWeight:'700'}}>{event.title}</Txt>
   <Txt muted style={{marginTop:10}}>{event.mode==='community'?'Gemeinschaftsevent':'Solotest'} · {n(event.distance)} km hin, anschließend leer zurück.</Txt>
   <Txt muted style={{marginTop:8}}>{running&&event.endsAt?`Verbleibend ${remaining(event.endsAt,clock)}`:'Einsatz beendet'} · Durchlauf {event.run}</Txt>
  </Card>
  {event.mode==='solo'&&<Txt muted style={{fontSize:12,marginBottom:12}}>Testbelohnungen bleiben im Test. Normale Überstunden und andere Aktivitäten verwenden deine echten Spielvorräte.</Txt>}
  {tab==='event'&&<>
   <Card><Row><Txt style={{fontWeight:'700'}}>Pyramide · Baustufe {event.stage} / 100</Txt><Pill>{n(event.total/event.target*100,1)} %</Pill></Row><Bar value={event.total/event.target*100} gold/>
    <Txt>{n(event.total,1)} / {n(event.target)} Steine</Txt><Txt muted style={{marginTop:6}}>1 Tonne = 1 Stein · Bruchteile zählen. Nach Stufe 100 geht der Wettbewerb weiter.</Txt>
    <Btn disabled={busy||!project?.delivered||event.stage<=(event.pass?.communityClaimed||0)} onPress={()=>claim('community')}>Baustufenbelohnungen abholen</Btn>
    <Btn secondary onPress={()=>setShowStages(!showStages)}>{showStages?'Belohnungen einklappen':'100 Stufenbelohnungen ansehen'}</Btn>
    {showStages&&event.communityRewards.map(row=><Row key={row.stage} style={{marginTop:8,marginBottom:0}}><Txt muted>Stufe {row.stage}</Txt><RewardItems reward={row.reward}/></Row>)}
   </Card>
  {running&&!project&&<>
   <Txt style={{fontSize:16,fontWeight:'700',marginBottom:8}}>Flotte auswählen</Txt>
   <Txt muted style={{marginBottom:16}}>Setze eine deiner Flotten ein. Sie liefert danach automatisch weiter, auch bei geschlossener App.</Txt>
   {event.fleetOptions.map(option=><Card key={option.index}>
    <Row><Txt style={{fontWeight:'700'}}>Flotte {option.index+1}</Txt><Pill>{option.vehicles?.length||0} / 5 Karten</Pill></Row>
    {option.vehicles?.map(vehicle=><View key={vehicle.cardId} style={{marginBottom:8}}>
     <Row style={{marginBottom:0}}><Txt style={{flex:1}}>{vehicle.model}</Txt><Txt muted>{n(vehicle.capacity,1)} t</Txt></Row>
     <Txt muted style={{fontSize:12}}>{minutes(vehicle.cycleMs/1000)} je Tour</Txt>
    </View>)||<Txt muted>Keine Fahrzeugkarten eingesetzt.</Txt>}
    <Btn disabled={busy||!option.vehicles?.length} onPress={()=>onFleet(option.index)}>Flotte {option.index+1} einsetzen</Btn>
   </Card>)}
   <Btn secondary onPress={onManage}>Flotten bearbeiten</Btn>
  </>}
  {project&&<>
   <Card>
    <Txt muted>BISHER GELIEFERT</Txt><Txt style={{fontSize:30,lineHeight:40,fontWeight:'700',marginVertical:4}}>{n(project.delivered,1)} t</Txt>
    <Row><Txt muted>Transportleistung</Txt><Txt>{n(project.tonKm)} tkm</Txt></Row>
    <Row><Txt muted>Gefahrene Strecke</Txt><Txt>{n(project.km)} km</Txt></Row>
    <Row style={{marginBottom:0}}><Txt muted>Abgeschlossene Touren</Txt><Txt>{n(project.tours)}</Txt></Row>
   </Card>
   <Card>
    <Row><Txt style={{fontWeight:'700'}}>Eingesetzte Flotte</Txt><Pill>Flotte {project.template+1}</Pill></Row>
    {project.vehicles.map(vehicle=>{
     const progress=Math.min(100,Math.max(0,(1-(vehicle.nextAt-clock)/vehicle.cycleMs)*100));
     const returning=!!vehicle.deliveredTrip||(!!vehicle.arrivalAt&&clock>=vehicle.arrivalAt);
     return <View key={vehicle.slot??vehicle.cardId} style={styles.vehicle}>
      <Txt style={{fontWeight:'700'}}>{vehicle.model}</Txt>
      {running?<>
       <Row style={{marginTop:6,marginBottom:0}}><Txt muted style={styles.small}>{returning?'Leere Rückfahrt':'Beladene Hinfahrt'}</Txt><Txt style={styles.small}>{n(Math.floor(progress))} %</Txt></Row>
       <Bar value={progress}/>
       <Row style={{marginBottom:0}}><Txt gold style={styles.small}>{remaining(vehicle.nextAt,clock)}</Txt><Txt muted style={styles.small}>{returning?'Ladung bereits geliefert':`${n(vehicle.capacity,2)} Steine bei Ankunft`}</Txt></Row>
      </>:<Txt muted style={[styles.small,{marginTop:6}]}>Einsatz beendet</Txt>}
      {running&&vehicle.pendingCardId!==undefined&&vehicle.pendingCardId!==vehicle.cardId&&<Txt gold style={styles.small}>{vehicle.pendingModel?`Danach: ${vehicle.pendingModel}`:'Wird nach der Tour entfernt'}</Txt>}
     </View>;
    })}
    {running&&!project.vehicles.length&&<Txt muted>Keine Fahrzeuge aktiv. Ergänze die Flotte, um weiterzuliefern.</Txt>}
    <Txt muted style={{fontSize:12}}>Änderungen an Fahrzeugen und Boni gelten ab der nächsten Tour. Laufende Touren bleiben unverändert.</Txt>
    {running&&<Btn secondary disabled={busy} onPress={onManage}>Flotte für nächste Touren ändern</Btn>}
   </Card>
  </>}
  {running&&project&&<Card><Txt style={{fontWeight:'700'}}>Überstunden einsetzen</Txt><Txt muted>{n(overtimePoints)} Punkte verfügbar · 1 Punkt liefert {n(1000/event.distance,2)} Steine.</Txt><Row>{([1,5,10,'max'] as const).map(amount=><Btn key={amount} disabled={busy||overtimePoints<(typeof amount==='number'?amount:1)} onPress={()=>onCommand('eventOvertime',{amount})}>{amount==='max'?'MAX':String(amount)}</Btn>)}</Row><Btn secondary disabled={busy} onPress={()=>onCommand('refill')}>Überstunden auffüllen</Btn></Card>}
  </>}
  {tab==='pass'&&<>
   <Card><Row><Txt style={{fontWeight:'700'}}>Eventpass · Stufe {event.passView.stage} / 10</Txt><Pill>{n(event.passView.points,1)} / 85</Pill></Row><Bar value={event.passView.points/85*100} gold/><Txt muted>85 von 100 möglichen Punkten reichen für die legendäre Karte. Aktivitäten im Hauptspiel zählen ebenfalls.</Txt><Btn disabled={busy||!event.passView.rewards.some(r=>r.stage<=event.passView.stage&&!event.pass?.claimed.includes(r.stage))} onPress={()=>claim('pass')}>Passbelohnungen abholen</Btn></Card>
   <Card><Txt style={{fontWeight:'700'}}>Aktivitäten</Txt>{event.passView.tasks.map(task=><View key={task.id} style={styles.vehicle}><Row><Txt style={{flex:1}}>{task.title}</Txt><Txt>{n(task.earned,1)} / {task.points}</Txt></Row><Bar value={task.value/task.target*100}/><Txt muted>{n(Math.min(task.value,task.target),1)} / {n(task.target)} · anteilige Punkte bis zum Aufgabenlimit</Txt></View>)}</Card>
   {event.passView.rewards.map(row=><Card key={row.stage} style={row.stage===10?legendaryStyle:undefined}><Row><Txt style={{fontWeight:'700'}}>Stufe {row.stage}</Txt><Pill>{event.pass?.claimed.includes(row.stage)?'ABGEHOLT':row.stage<=event.passView.stage?'ERREICHT':n(row.points,1)+' PUNKTE'}</Pill></Row><RewardItems reward={row.reward}/>{row.stage===10&&<Txt muted>Legendäre Eventkarte · Platzhalter ohne Fahrzeugwerte oder Bild. Der Anspruch wird gespeichert.</Txt>}</Card>)}
  </>}
  {tab==='ranks'&&<><Card><Txt style={{fontWeight:'700'}}>Transport-Rangliste</Txt><Txt muted>Gelieferte Steine inklusive Überstunden. Gleiche Mengen teilen denselben Rang. Noch keine Ranglistenbelohnungen.</Txt><Txt muted style={{marginTop:6}}>{event.mode==='solo'?'Solotest: nur dein eigener Beitrag.':'Top 50 und dein Beitrag · Stand der zuletzt synchronisierten Lieferungen.'}</Txt></Card>
   {!rankings.length&&<Empty>Noch keine Lieferungen.</Empty>}
   {rankings.map((row,index)=><Card key={index} style={row.own?legendaryStyle:undefined}><Row><Txt style={{fontWeight:'700'}}>#{row.rank===null?'50+':row.rank||index+1} · {row.name}{row.own?' · Du':''}</Txt><Txt>{n(row.delivered,1)} Steine</Txt></Row></Card>)}
  </>}
  {event.testRewards&&<Card><Txt muted>ABGEHOLTE TESTBELOHNUNGEN</Txt><RewardItems reward={event.testRewards}/></Card>}
  {running&&<Btn secondary danger disabled={busy} onPress={onEnd}>Event beenden</Btn>}
 </>;
}
const styles=StyleSheet.create({
 tab:{flex:1,minHeight:44,borderWidth:1,borderColor:C.line,borderRadius:5,alignItems:'center',justifyContent:'center'},
 vehicle:{borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:6,paddingBottom:12},
 small:{fontSize:12,lineHeight:18},
});

function RewardItems({reward}:{reward:Record<string,number>}){return <View style={{gap:4}}>{Object.entries(reward).map(([id,amount])=>id==='legendaryPlaceholder'?<Txt key={id}>{n(amount)} × {rewardNames[id]}</Txt>:<ItemAmount key={id} id={id==='gearsCommon'?'gear:common':id} label={rewardNames[id]||id} amount={amount} size={36}/>)}</View>;}
const rewardNames:Record<string,string>={capacityModules:'Kapazitätsmodul',overtimeRefills:'Überstundenauffüller',expeditionRefills:'Expeditionsauffüller',gearsCommon:'Common-Zahnräder',legendaryPlaceholder:'Legendäre Karte (Platzhalter)'};
function rewardText(reward:Record<string,number>){return Object.entries(reward).map(([key,amount])=>`${n(amount)} × ${rewardNames[key]||key}`).join(' · ');}
