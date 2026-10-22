import React,{useState} from 'react';
import {Pressable,StyleSheet,TextInput} from 'react-native';
import {Btn,Card,Pill,Row,Txt,C,n} from './ui';
export type TestSettings={target:number;distance:number;durationHours:number};
type Reward=Record<string,number>;
export type TestEvent={
 id:string;title:string;description:string;status:'available'|'running'|'ended';run:number;rarity:'legendary';unlimited:boolean;distance:number;
 startedAt?:number;endsAt?:number;endedAt?:number|null;mode?:'solo'|'community';target:number;total:number;stage:number;
 pass?:{claimed:number[];communityClaimed:number};testRewards?:Reward;
 passView:{points:number;stage:number;required:number;tasks:{id:string;title:string;value:number;target:number;points:number;earned:number}[];rewards:{stage:number;points:number;reward:Reward}[]};
 rankingsFetched?:boolean;communityRewards:{stage:number;reward:Reward}[];rankings:{name:string;delivered:number;own:boolean;rank?:number|null}[];
 registration?:{id:string;startsAt:number;endsAt:number;registered:number;registeredSelf:boolean;config?:{target:number;distance:number}}|null;
 scaling:{players:number;target:number;distance:number}[];
 project?:{template:number;assignedAt:number;delivered:number;km:number;tonKm:number;tours:number;vehicles:{cardId:string;model:string;capacity:number;cycleMs:number;nextAt:number;arrivalAt?:number;deliveredTrip?:boolean;tripStartedAt?:number;completedTours:number;slot?:number;pendingCardId?:string|null;pendingModel?:string|null}[]};
 fleetOptions:{index:number;vehicles:{cardId:string;model:string;capacity:number;cycleMs:number}[]|null}[];
};
export function Events({events,busy,onStart,onEnd,onInfo,onRegister,onJoin}:{events:TestEvent[];busy:boolean;onStart:(event:TestEvent,settings:TestSettings)=>void;onEnd:(event:TestEvent)=>void;onInfo:(event:TestEvent)=>void;onRegister:()=>void;onJoin:()=>void}){
 const [target,setTarget]=useState('1000'),[distance,setDistance]=useState(240),[durationHours,setDuration]=useState(120);
 const [showScaling,setShowScaling]=useState(false);
 const valid=Number.isSafeInteger(Number(target))&&Number(target)>=100&&Number(target)<=1000000;
 return <>{events.map(event=>{const running=event.status==='running',registration=event.registration,now=Date.now();return <React.Fragment key={event.id}>
  <Card style={legendaryStyle}>
   <Row><Pill gold>GEMEINSCHAFTSPROJEKT</Pill><Pill>{running?'LÄUFT':event.status==='ended'?'BEENDET':'BEREIT'}</Pill></Row>
   <Txt style={styles.title}>{event.title}</Txt><Txt muted style={{marginTop:8}}>{event.description}</Txt>
   {event.run>0&&<><Txt muted style={{marginTop:8}}>{event.mode==='community'?'Gemeinschaftsevent':'Solotest'} · Durchlauf {event.run}</Txt><Btn disabled={busy} onPress={()=>onInfo(event)}>{running?'Event öffnen':'Ergebnis & Belohnungen'}</Btn></>}
   {running&&<Btn secondary danger disabled={busy} onPress={()=>onEnd(event)}>Event beenden</Btn>}
  </Card>
  <Card><Txt style={styles.title}>Gemeinsam die Pyramide bauen</Txt>
   {!registration?<><Txt muted>48 Stunden Anmeldung, anschließend fünf Tage Event. Ziel und Strecke werden zum Start anhand der Anmeldungen festgelegt.</Txt><Btn disabled={busy} onPress={onRegister}>Anmeldung eröffnen & anmelden</Btn></>:<>
    <Txt muted>{n(registration.registered)} Anmeldungen · Start {new Date(registration.startsAt).toLocaleString()}</Txt>
    {now<registration.startsAt?<Btn disabled={busy||registration.registeredSelf} onPress={onRegister}>{registration.registeredSelf?'Du bist angemeldet':'Anmelden'}</Btn>:now<registration.endsAt?<Btn disabled={busy||running} onPress={onJoin}>Am Gemeinschaftsevent teilnehmen</Btn>:<Txt muted>Diese Gemeinschaftsrunde ist beendet.</Txt>}
    {registration.config&&<Txt muted>{n(registration.config.target)} Steine · {n(registration.config.distance)} km einfache Strecke</Txt>}
   </>}
   <Btn secondary onPress={()=>setShowScaling(!showScaling)}>{showScaling?'Staffel einklappen':'Vorläufige Skalierung ansehen'}</Btn>
   {showScaling&&<><Txt muted style={{marginTop:8}}>Planungsannahme: 10.000 Steine je Spieler bei 240 km bis Tag 3–4. Fünf Common-Fahrzeuge, 18 Stunden Einsatz täglich und 100 Überstundenpunkte. Unter 75 Anmeldungen kann das Mindestziel zu groß sein.</Txt><Row style={{marginTop:12}}><Txt muted>Spieler</Txt><Txt muted>Ziel · Strecke</Txt></Row>{event.scaling.map(row=><Row key={row.players}><Txt>{n(row.players)}</Txt><Txt>{n(row.target/1000000)} Mio. · {row.distance} km</Txt></Row>)}</>}
  </Card>
  {!running&&<Card><Txt style={styles.title}>Solotest einstellen</Txt><Txt muted>Belohnungen werden als Testvorschau verbucht. Überstunden werden aus deinem normalen Vorrat verbraucht.</Txt>
   <Txt muted style={{marginTop:12}}>Gesamtziel · 100 bis 1.000.000 Steine</Txt>
   <TextInput accessibilityLabel="Solotest Gesamtziel" value={target} onChangeText={setTarget} keyboardType="number-pad" style={styles.input}/>
   <Txt muted>Einfache Strecke</Txt><Row>{[180,240,360].map(km=><Btn key={km} secondary={distance!==km} onPress={()=>setDistance(km)}>{km} km</Btn>)}</Row>
   <Txt muted>Laufzeit</Txt><Row>{[2,24,120].map(hours=><Btn key={hours} secondary={durationHours!==hours} onPress={()=>setDuration(hours)}>{hours===120?'5 Tage':hours+' Std.'}</Btn>)}</Row>
   <Btn disabled={busy||!valid} onPress={()=>onStart(event,{target:Number(target),distance,durationHours})}>Solotest starten</Btn>
  </Card>}
 </React.Fragment>;})}</>;
}
export const legendaryStyle={backgroundColor:C.goldWash,borderColor:C.legendary};
const styles=StyleSheet.create({title:{fontSize:17,fontWeight:'700',marginBottom:8},input:{color:C.text,borderWidth:1,borderColor:C.line,backgroundColor:C.raised,padding:12,borderRadius:5,marginVertical:10}});
