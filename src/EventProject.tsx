import React from 'react';
import {View,StyleSheet} from 'react-native';
import {Bar,Btn,Card,Empty,Pill,Row,Txt,C,n,remaining,minutes} from './ui';
import {TestEvent,legendaryStyle} from './Events';

export function EventProject({event,busy,clock,onFleet,onManage,onEnd}:{
 event?:TestEvent;busy:boolean;clock:number;
 onFleet:(template:number)=>void;onManage:()=>void;onEnd:()=>void;
}){
 if(!event)return <Empty>Event nicht verfügbar.</Empty>;
 const running=event.status==='running',project=event.project;
 return <>
  <Card style={legendaryStyle}>
   <Row><Txt style={{color:C.legendary,fontWeight:'700'}}>LEGENDÄR · EVENT</Txt><Pill>{running?'LÄUFT':'BEENDET'}</Pill></Row>
   <Txt style={{fontSize:18,fontWeight:'700'}}>{event.title}</Txt>
   <Txt muted style={{marginTop:10}}>Unbegrenzter Projektumfang · {n(event.distance)} km je beladener Hinfahrt, anschließend leer zurück.</Txt>
   <Txt muted style={{marginTop:8}}>Testdurchlauf {event.run} · läuft bis zum manuellen Beenden.</Txt>
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
     return <View key={vehicle.slot??vehicle.cardId} style={styles.vehicle}>
      <Txt style={{fontWeight:'700'}}>{vehicle.model}</Txt>
      {running?<>
       <Row style={{marginTop:6,marginBottom:0}}><Txt muted style={styles.small}>Aktuelle Tour</Txt><Txt style={styles.small}>{n(Math.floor(progress))} %</Txt></Row>
       <Bar value={progress}/>
       <Row style={{marginBottom:0}}><Txt gold style={styles.small}>{remaining(vehicle.nextAt,clock)}</Txt><Txt muted style={styles.small}>{n(vehicle.capacity,2)} t bei Ankunft</Txt></Row>
      </>:<Txt muted style={[styles.small,{marginTop:6}]}>Einsatz beendet</Txt>}
      {running&&vehicle.pendingCardId!==undefined&&vehicle.pendingCardId!==vehicle.cardId&&<Txt gold style={styles.small}>{vehicle.pendingModel?`Danach: ${vehicle.pendingModel}`:'Wird nach der Tour entfernt'}</Txt>}
     </View>;
    })}
    {running&&!project.vehicles.length&&<Txt muted>Keine Fahrzeuge aktiv. Ergänze die Flotte, um weiterzuliefern.</Txt>}
    <Txt muted style={{fontSize:12}}>Änderungen an Fahrzeugen und Boni gelten ab der nächsten Tour. Laufende Touren bleiben unverändert.</Txt>
    {running&&<Btn secondary disabled={busy} onPress={onManage}>Flotte für nächste Touren ändern</Btn>}
   </Card>
  </>}
  <Txt muted style={{fontSize:12,marginVertical:12}}>Überstundeneinsatz, Rangliste und Belohnungen folgen im nächsten Schritt.</Txt>
  {running&&<Btn secondary danger disabled={busy} onPress={onEnd}>Event beenden</Btn>}
 </>;
}
const styles=StyleSheet.create({
 vehicle:{borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:6,paddingBottom:12},
 small:{fontSize:12,lineHeight:18},
});
