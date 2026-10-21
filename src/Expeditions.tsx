import {t as translate} from './i18n';
import {Icon} from './Icon';
import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {C,Txt,Row,Btn,Bar,Pill,n,remaining} from './ui';
import {AtlasHeading} from './Atlas';
import {ExpeditionRegionCard} from './ExpeditionRegionCard';
import {displayFont} from './theme';
import {rarityColor} from './items';
import {ExpeditionJourney} from './ExpeditionJourney';
import {regionIdentities} from './regionIdentities';
import {regionRoutes} from './regionRoutes';
const deliveryProgress=(mission:any,done:boolean,clock:number)=>done||mission?.status==='completed'?100:mission?.status==='active'?Math.max(0,Math.min(100,(clock-mission.startedAt)/(mission.endsAt-mission.startedAt)*100)):0;
export function Expeditions(props:any){
 const {data,region,onSelectRegion}=props;
 if(region===null)return <><AtlasHeading title="Reiseatlas" detail="Erschließe Regionen, entdecke Orte und gewinne Verbündete."/>{data.expeditionMap.map((map:any)=><ExpeditionRegionCard key={map.index} map={map} onOpen={onSelectRegion}/>)}</>;
 if(!data.expeditionMap[region]?.open||!regionRoutes[region])return null;
 return <OpenedExpedition key={region} {...props}/>;
}
function OpenedExpedition({data,region,onSelectRegion,busy,clock,onCommand,onMission,accountId,modalBlocked=false}:any){
 const [selected,setSelected]=useState<number|'endless'|null>(null),[chances,setChances]=useState(false);
 const g=data.state,maps=data.expeditionMap;
 const button=(label:string,action:string,payload:any,disabled=false)=><Btn disabled={busy||disabled} onPress={()=>onCommand(action,payload)}>{label}</Btn>;

 const map=maps[region],identity=regionIdentities[region],route=regionRoutes[region],r=g.expedition.regions[region],missions=g.expedition.missions.filter((m:any)=>m.region===region);
 const final=missions.find((m:any)=>m.kind==='final'),endlessOpen=r.discovered===7,noTruck=!g.trucks.some((t:any)=>t.free&&t.tier>=2);
 const close=()=>chances?setChances(false):setSelected(null);
 const info=(event?:any)=>{event?.stopPropagation();setChances(true);};
 const question=(positioned=false)=> <Pressable accessibilityRole="button" accessibilityLabel={translate(`Fundchancen ${identity.title}`)} onPress={info} style={[styles.question,positioned&&{position:'absolute',top:16,right:16}]}><Icon name="help" size={23} color={C.accent}/></Pressable>;
 const place=typeof selected==='number'?map.places[selected]:null;
 const discovered=place&&Number(selected)<r.discovered,next=place&&selected===r.discovered;
 const done=place&&r.deliveries[selected as number],mission=place&&missions.find((m:any)=>m.kind==='delivery'&&m.place===selected);
 const explored=place?place.invested/place.discoveryCost*100:map.progress;
 const shipment=deliveryProgress(place?mission:final,place?done:r.finalClaimed,clock);
 const bonusMission=place?mission:final;
 const bonusDuration=bonusMission?Math.max(0,bonusMission.endsAt-bonusMission.startedAt):(place?place.durationMs:map.finalDurationMs);
 const permitted=selected==='endless'?endlessOpen:typeof selected==='number'&&selected<=r.discovered;
 return <View style={{flex:1}}>
  <ExpeditionJourney map={map} maps={maps} state={r} missions={missions} accountId={accountId} onRegion={onSelectRegion} onPlace={setSelected}/>
  <Modal visible={((selected!==null&&permitted)||chances)&&!modalBlocked} transparent animationType="none" onRequestClose={close}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={[styles.title,{flex:1}]}>{chances?`Fundchancen · ${identity.title}`:place?route.places[Number(selected)].name:route.places[7].name}</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:4}}>
     {chances?<>
      <Txt muted style={styles.small}>Je Expedition · {map.finds.cost} Punkte</Txt>
      <Txt style={styles.section}>Fahrzeugkarten</Txt>
      {map.finds.cards.map((card:any)=><View key={card.id} style={styles.chance}><Row style={{marginBottom:2,flexWrap:'nowrap'}}><Txt style={{flex:1}}>{card.name}</Txt><Txt gold>{n(card.chance,2)} %</Txt></Row><Txt style={[styles.small,{color:rarityColor(card.rarity)}]}>{data.catalog.rarities.find((rarity:any)=>rarity.id===card.rarity)?.label}</Txt></View>)}
      <Txt style={styles.section}>Aufträge</Txt>
      {map.finds.orders.map((order:any)=><View key={order.kind} style={styles.chance}><Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={{flex:1}}>{order.name}</Txt><Txt gold>{n(order.chance,2)} %</Txt></Row>{order.ranks?<Txt muted style={styles.small}>Rang bei Fund: {order.ranks.map((rank:any)=>`${rank.rank} (${n(rank.chance,2)} %)`).join(' · ')}</Txt>:<Txt style={[styles.small,{color:rarityColor(order.rarity)}]}>{data.catalog.rarities.find((rarity:any)=>rarity.id===order.rarity)?.label}</Txt>}</View>)}
     </>:<>
      <Row style={{marginBottom:0}}><Txt muted style={styles.small}>Erkundung</Txt><Txt muted style={styles.small}>{n(explored)} %</Txt></Row>
      <Bar value={explored}/>
      {(discovered||selected==='endless'&&endlessOpen)&&<><Row style={{marginTop:5,marginBottom:0}}><Txt muted style={styles.small}>Bonuslieferung</Txt><Txt muted style={styles.small}>{n(shipment)} %</Txt></Row><Bar value={shipment} gold/><Row style={{marginTop:4,marginBottom:6}}><Txt muted style={styles.small}>{bonusMission?.status==='active'?'Restzeit':'Dauer'}</Txt><Txt muted style={styles.small}>{bonusMission?.status==='active'?remaining(bonusMission.endsAt,clock):remaining(bonusDuration,0)}</Txt></Row></>}
      {place?<>
       {!discovered&&!next?<Pill>Gesperrt</Pill>:!discovered?button('Erkunden · 1 Punkt','discover',{region},g.expedition.points<1):done?<Txt muted>Abgeschlossen ✓</Txt>:<>
        <Txt muted style={styles.small}>Bonus: +1 Expeditionskapazität</Txt>
        {!mission&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'delivery',selected)}>Bonus liefern</Btn>}
        {mission?.status==='completed'&&!mission.claimedAt&&button('Bonus abholen','claimMission',{id:mission.id})}
        {!mission&&noTruck&&<Txt muted style={styles.small}>Kein freier LKW</Txt>}
       </>}
      </>:<>
       <Txt muted style={{marginVertical:8}}>{identity.customer}</Txt><Txt muted>Erste Endloslieferung: Kunde und 1 Kapazitätsmodul. Bereits erhaltene Module werden nicht erneut vergeben.</Txt>
       {!endlessOpen?<Pill>Gesperrt</Pill>:<>
        {!final&&!r.finalClaimed&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'final',0)}>Kunde freischalten</Btn>}
        {final?.status==='completed'&&!final.claimedAt&&button('Kunde freischalten','claimMission',{id:final.id})}
        {r.finalClaimed&&<Txt muted style={styles.small}>Kunde freigeschaltet ✓</Txt>}
        {button(`Expedition · ${map.finds.cost} Punkte`,'draw',{region},g.expedition.points<map.finds.cost)}
       </>}
       <View style={{alignItems:'flex-end',marginTop:8}}>{question()}</View>
      </>}
     </>}
    </ScrollView>
   </View></View>
  </Modal>
 </View>;
}
const styles=StyleSheet.create({place:{backgroundColor:C.panel,borderColor:C.line},endless:{backgroundColor:C.greenWash,borderColor:C.accent},title:{fontFamily:displayFont,fontSize:19,lineHeight:25,fontWeight:'700'},section:{fontSize:14,fontWeight:'700',marginTop:18,marginBottom:8},small:{fontSize:12,lineHeight:18},locked:{backgroundColor:C.raised,borderStyle:'dashed'},question:{width:44,height:44,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,borderRadius:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},modal:{width:'100%',maxWidth:460,maxHeight:'85%',alignSelf:'center',borderWidth:1,borderColor:C.line,borderRadius:18,backgroundColor:C.panel,padding:16},chance:{paddingVertical:9,borderBottomWidth:1,borderColor:C.line}});

