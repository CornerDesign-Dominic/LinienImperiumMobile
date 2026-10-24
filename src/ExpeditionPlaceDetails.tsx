import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,Row,Btn,Bar,n,remaining} from './ui';
import {PlaceExtraDetails,PlaceRewards,PlaceStatus} from './ExpeditionPlaceModal';
import {regionIdentities} from './regionIdentities';
const progress=(mission:any,done:boolean,clock:number)=>done||mission?.status==='completed'?100:mission?.status==='active'?Math.max(0,Math.min(100,(clock-mission.startedAt)/Math.max(1,mission.endsAt-mission.startedAt)*100)):0;
export function ExpeditionPlaceDetails({data,region,selected,busy,clock,onCommand,onMission,onChances}:any){
 const g=data.state,map=data.expeditionMap[region],state=g.expedition.regions[region],isFinal=selected==='endless';
 const place=typeof selected==='number'?map.places[selected]:null;
 if(!map.open||isFinal&&state.discovered<7||!isFinal&&(!place||selected>state.discovered))return null;
 const known=isFinal||selected<state.discovered,done=isFinal?state.finalClaimed:state.deliveries[selected];
 const mission=g.expedition.missions.find((m:any)=>m.region===region&&(isFinal?m.kind==='final':m.kind==='delivery'&&m.place===selected));
 const noTruck=!g.trucks.some((truck:any)=>truck.free&&truck.tier>=2),active=!done&&mission?.status==='active',claimable=!done&&mission?.status==='completed'&&!mission.claimedAt;
 const duration=mission?Math.max(0,mission.endsAt-mission.startedAt):isFinal?map.finalDurationMs:place.durationMs;
 const button=(label:string,action:string,payload:any,disabled=false,secondary=false)=><Btn secondary={secondary} disabled={busy||disabled} onPress={()=>onCommand(action,payload)}>{label}</Btn>;
 const rewardItems=isFinal?[{icon:'customers' as const,label:'Stammkunde',amount:'+1'},...(!state.moduleAwarded||done&&state.moduleAwarded?[{itemId:'capacityModules',icon:'module' as const,label:'Kapazitätsmodul',amount:'+1'}]:[])]:[{icon:'expedition' as const,label:'Expeditionskapazität',amount:'+1'}];
 return <>
  <Row style={{marginBottom:0}}><PlaceStatus icon={done?'check':active?'timer':claimable?'reward':!known?'expedition':isFinal?'customers':'truck'}>{done?(isFinal?'Kunde freigeschaltet':'Abgeschlossen'):active?'Bonuslieferung unterwegs':claimable?'Belohnung bereit':!known?'Erkundung':isFinal?'Handelsplatz erreicht':'Bonuslieferung verfügbar'}</PlaceStatus>{active&&<Txt gold style={s.time}>{remaining(mission.endsAt,clock)}</Txt>}</Row>
  {!known?<>
   <Row style={{marginBottom:0}}><Txt muted style={s.small}>Erkundung</Txt><Txt style={s.small}>{n(place.invested/place.discoveryCost*100)} %</Txt></Row><Bar value={place.invested/place.discoveryCost*100}/>
   <Txt muted style={s.small}>{n(place.invested)} / {n(place.discoveryCost)} Punkte investiert</Txt>

   {button('Erkunden · 1 Punkt','discover',{region},g.expedition.points<1)}
   {g.expedition.points<1&&<Txt muted style={s.note}>Keine Expeditionspunkte verfügbar.</Txt>}
  </>:<>
   <PlaceRewards items={rewardItems} received={!!done}/>
   {active&&<><Row style={{marginBottom:0}}><Txt muted style={s.small}>Bonuslieferung</Txt><Txt style={s.small}>{n(progress(mission,done,clock))} %</Txt></Row><Bar value={progress(mission,done,clock)} gold/></>}
   {!isFinal?<>
    {!done&&!mission&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'delivery',selected)}>Bonus liefern</Btn>}
    {claimable&&button('Bonus abholen','claimMission',{id:mission.id})}
   </>:<>
    <Txt style={s.customer}>{regionIdentities[region].customer}</Txt>
    {!done&&!mission&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'final',0)}>Kunde freischalten</Btn>}
    {claimable&&button('Kunde freischalten','claimMission',{id:mission.id})}
    {button(`Expedition · ${map.finds.cost} Punkte`,'draw',{region},g.expedition.points<map.finds.cost,!done)}
    {g.expedition.points<map.finds.cost&&<Txt muted style={s.note}>Nicht genügend Expeditionspunkte.</Txt>}
    <Btn secondary icon="help" onPress={onChances}>Fundchancen</Btn>
   </>}
   {!done&&!mission&&noTruck&&<Txt muted style={s.note}>Kein freies Fahrzeug verfügbar.</Txt>}
  </>}
  <PlaceExtraDetails>
   <Row style={{marginBottom:0}}><Txt muted style={s.small}>Dauer der Bonuslieferung</Txt><Txt style={s.small}>{remaining(duration,0)}</Txt></Row>
   {isFinal?<>
    <Txt muted style={s.small}>Mit der ersten Bonuslieferung schaltest du den Stammkunden frei.</Txt>
    <Txt muted style={s.small}>Erste Endloslieferung: Kunde und 1 Kapazitätsmodul. Bereits erhaltene Module werden nicht erneut vergeben.</Txt>
    <Txt muted style={s.small}>Expeditionen bringen neue Funde aus dieser Region.</Txt>
   </>:<Txt muted style={s.small}>{done?'Die Belohnung dieses Ortes wurde bereits abgeholt.':'Nach der Erkundung kannst du hier eine Bonuslieferung starten. Hole ihre Belohnung ab, um deine Expeditionskapazität um 1 zu erhöhen.'}</Txt>}
  </PlaceExtraDetails>
 </>;
}
const s=StyleSheet.create({small:{fontSize:11,lineHeight:17},time:{fontSize:12,lineHeight:18,fontWeight:'600',marginBottom:9},note:{fontSize:11,lineHeight:17,marginTop:7},customer:{fontSize:12,lineHeight:18,fontWeight:'600',color:C.text,marginTop:4,marginBottom:5}});
