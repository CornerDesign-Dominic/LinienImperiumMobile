import React from 'react';
import {Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,Pill,n,remaining} from './ui';

const clamp=(value:number)=>Math.max(0,Math.min(100,value));
function missionProgress(mission:any,now:number){
 if(!mission)return 0;
 if(mission.status==='completed')return 100;
 if(mission.transport){
  const t=mission.transport,next=t.tours[t.completedTours];
  const inTransit=next?next.cargo*clamp((now-next.startsAt)/(next.endsAt-next.startsAt)*100)/100:0;
  return clamp((t.delivered+inTransit)/t.volume*100);
 }
 return clamp((now-mission.startedAt)/(mission.endsAt-mission.startedAt)*100);
}
export function Expeditions({data,region,onSelectRegion,busy,clock,onCommand,onMission}:any){
 const g=data.state,maps=data.expeditionMap;
 const button=(label:string,action:string,payload:any,disabled=false)=><Btn disabled={busy||disabled} onPress={()=>onCommand(action,payload)}>{label}</Btn>;
 if(region===null)return <>{maps.map((map:any)=><Pressable key={map.index} accessibilityRole="button" accessibilityLabel={`${map.name}, ${map.customer.name}${map.open?'':', Gesperrt'}`} accessibilityState={{disabled:!map.open}} disabled={!map.open} onPress={()=>onSelectRegion(map.index)}>
  <Card style={[styles.region,!map.open&&styles.locked]}>
   <Row><Txt style={styles.title}>{map.name}</Txt>{map.open?<Txt muted>›</Txt>:<Pill>Gesperrt</Pill>}</Row>
   <Txt muted>{map.customer.name}</Txt>
   <Bar value={map.progress}/>
   <Row style={{marginBottom:0}}><Txt muted style={styles.small}>Orte {map.discovered}/7</Txt><Txt muted style={styles.small}>Lieferungen {map.deliveries+Number(map.finalClaimed)}/8</Txt></Row>
  </Card>
 </Pressable>)}</>;
 const map=maps[region],r=g.expedition.regions[region];
 const missions=g.expedition.missions.filter((m:any)=>m.region===region);
 const final=missions.find((m:any)=>m.kind==='final');
 const noTruck=!g.trucks.some((t:any)=>t.free&&t.tier>=2);
 const endlessOpen=r.discovered===7;
 const finalProgress=r.finalClaimed?100:missionProgress(final,clock);
 return <>
  <Row><Txt style={styles.title}>{map.name}</Txt><Txt muted>{map.customer.name}</Txt></Row>
  {map.places.map((place:any)=>{
   const i=place.index,discovered=i<r.discovered,next=i===r.discovered,done=r.deliveries[i];
   const mission=missions.find((m:any)=>m.kind==='delivery'&&m.place===i);
   const locked=!discovered&&!next,progress=done?100:discovered?50+missionProgress(mission,clock)/2:0;
   return <Card key={i} style={[styles.place,locked&&styles.locked]}>
    <Row><Txt style={styles.title}>Ort {i+1}</Txt>{locked?<Pill>Gesperrt</Pill>:done?<Txt style={{color:C.accent}}>✓</Txt>:mission?.status==='active'?<Txt gold>{remaining(mission.endsAt,clock)}</Txt>:null}</Row>
    <Bar value={progress}/>
    {!locked&&!done&&<Txt muted style={styles.small}>+1 Expeditionskapazität</Txt>}
    {!discovered&&next&&button(`Entdecken · ${place.discoveryCost} Punkte`,'discover',{region},g.expedition.points<place.discoveryCost)}
    {discovered&&!mission&&!done&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'delivery',i)}>Beliefern · {place.durationMs<60000?`${place.durationMs/1000} Sek.`:`${n(place.durationMs/3600000)} Std.`}</Btn>}
    {mission?.status==='completed'&&!mission.claimedAt&&button('Abholen','claimMission',{id:mission.id})}
   </Card>;
  })}
  <Card style={[styles.endless,!endlessOpen&&styles.locked]}>
   <Row><Txt style={styles.title}>∞ Endlosort</Txt>{!endlessOpen?<Pill>Gesperrt</Pill>:r.finalClaimed?<Txt style={{color:C.accent}}>✓</Txt>:final?.status==='active'?<Txt gold>{remaining(final.endsAt,clock)}</Txt>:null}</Row>
   <Txt muted>{map.customer.name}</Txt>
   <Bar value={endlessOpen?50+finalProgress/2:r.discovered/7*50}/>
   {endlessOpen&&<>
    {!final&&!r.finalClaimed&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'final',0)}>Kunde freischalten · {map.finalDurationMs<60000?`${map.finalDurationMs/1000} Sek.`:`${n(map.finalDurationMs/3600000)} Std.`}</Btn>}
    {final?.status==='completed'&&!final.claimedAt&&button('Kunde freischalten','claimMission',{id:final.id})}
    {button('Expedition · 5 Punkte','draw',{region},g.expedition.points<5)}

   </>}
  </Card>
 </>;
}
const styles=StyleSheet.create({
 region:{backgroundColor:'#192534',borderColor:'#3B506A'},place:{backgroundColor:'#182331',borderColor:'#35485E'},endless:{backgroundColor:'#192C2D',borderColor:'#42635C',marginTop:8},
 title:{fontSize:16,fontWeight:'700'},small:{fontSize:12,lineHeight:18},locked:{opacity:.45,borderStyle:'dashed'},
 job:{backgroundColor:C.bg,padding:12,borderRadius:10,marginTop:12},reward:{borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:12}
});
