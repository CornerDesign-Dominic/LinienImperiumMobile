import React from 'react';
import {Pressable,StyleSheet} from 'react-native';
import {Btn,Card,Pill,Row,Txt,C} from './ui';

export type TestEvent = {
 id:string; title:string; description:string;
 status:'available'|'running'|'ended'; run:number;
 startedAt?:number; endedAt?:number|null;
 rarity:'epic'; unlimited:boolean; distance:number;
 project?:{template:number;assignedAt:number;delivered:number;km:number;tonKm:number;tours:number;
  vehicles:{cardId:string;model:string;capacity:number;cycleMs:number;nextAt:number;completedTours:number;slot?:number;pendingCardId?:string|null;pendingModel?:string|null}[]};
 fleetOptions:{index:number;vehicles:{cardId:string;model:string;capacity:number;cycleMs:number}[]|null}[];
};
export function Events({events,busy,onStart,onEnd,onInfo}:{
 events:TestEvent[];busy:boolean;
 onStart:(event:TestEvent)=>void;onEnd:(event:TestEvent)=>void;onInfo:(event:TestEvent)=>void;
}){
 return <>
  <Txt muted style={{marginBottom:16}}>Events zum Testen starten, beenden und erneut starten.</Txt>
  {events.map(event=>{
   const running=event.status==='running';
   return <Card key={event.id} style={styles.epic}>
    <Pressable accessibilityRole="button" accessibilityLabel={`${event.title}, ${running?'läuft':event.status==='ended'?'beendet':'bereit'}`} disabled={busy} onPress={()=>running?onInfo(event):onStart(event)} style={{minHeight:44}}>
     <Row><Txt style={styles.epicLabel}>EPISCH</Txt><Pill gold={!running}>{running?'LÄUFT':event.status==='ended'?'BEENDET':'BEREIT'}</Pill><Txt muted>›</Txt></Row>
     <Txt style={styles.title}>{event.title}</Txt>
     <Txt muted style={{marginTop:8}}>{event.description}</Txt>
     {event.run>0&&<Txt muted style={styles.meta}>Testdurchlauf {event.run}</Txt>}
    </Pressable>
    <Txt muted style={styles.meta}>Unbegrenzter Projektumfang{event.project?` · ${event.project.delivered.toLocaleString('de-DE',{maximumFractionDigits:1})} t geliefert`:''}</Txt>
    {running&&<Btn secondary danger disabled={busy} onPress={()=>onEnd(event)}>Event beenden</Btn>}
   </Card>;
  })}
 </>;
}
export const epicStyle={backgroundColor:C.purpleWash,borderColor:C.epic};
const styles=StyleSheet.create({title:{fontSize:17,fontWeight:'700'},meta:{fontSize:12,marginTop:10},epic:epicStyle,epicLabel:{color:C.epic,fontSize:11,fontWeight:'700',letterSpacing:1}});

