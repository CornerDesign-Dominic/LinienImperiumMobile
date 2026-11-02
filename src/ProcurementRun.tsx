import React from 'react';
import {Image,ScrollView,StyleSheet} from 'react-native';
import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {AppModal} from './AppModal';
import {VehicleArt} from './VehicleArt';
import {Icon} from './Icon';
import {t} from './i18n';
import {C,Txt,Row,Btn,Bar,Pill,n,remaining} from './ui';

const regionImages=[require('../assets/art/regions/crownlands.jpg'),require('../assets/art/regions/prairies.jpg'),require('../assets/art/regions/saffron-road.jpg'),require('../assets/art/regions/jade-valley.jpg'),require('../assets/art/regions/northmark.jpg')];
const running=(run:any)=>(run.vehicles||[run]).filter((vehicle:any)=>vehicle.status==='active');
function VehicleRow({vehicle,data,clock}:any){
 const owned=data.state.trucks.find((truck:any)=>truck.id===vehicle.truckId),card=data.catalog.cards.find((entry:any)=>entry.id===owned?.cardId);
 const progress=vehicle.durationMs>0?Math.max(0,Math.min(100,(clock-vehicle.startedAt)/vehicle.durationMs*100)):0;
 return <View style={s.vehicleRow}><VehicleArt card={card} style={{width:50}}/><View style={s.vehicleCopy}><View style={s.vehicleHeading}><Txt style={s.vehicleName}>{vehicle.model}</Txt><Txt gold style={s.timer}>{remaining(vehicle.nextAt,clock)}</Txt></View><Bar value={progress}/></View></View>;
}
function Facts({run}:any){
 return <View style={s.facts}><View style={s.fact}><Txt muted style={s.caption}>{run.mode==='count'?'Hinterlegt':'Kontoreserve'}</Txt><View style={s.money}><Icon name="coin" size={17}/><Txt style={s.factValue}>{n(run.mode==='count'?run.escrow:run.reserve)} T</Txt></View></View><View style={[s.fact,s.factDivider]}><Txt muted style={s.caption}>Je Tour</Txt><Txt style={s.factValue}>{n(run.price)} T</Txt></View></View>;
}
export function ProcurementRunCard({run,title,data,clock,onOpen}:any){
 const vehicles=running(run);
 return <Pressable testID={`procurement-run-${run.id}`} accessibilityRole="button" accessibilityLabel={`${t(title)}, ${vehicles.length} ${t('Fahrzeuge')}, ${t('Details')}`} onPress={onOpen} style={({pressed})=>[s.card,pressed&&{opacity:.85}]}>
  <View material={false} style={s.scene}><Image source={regionImages[run.region]} accessible={false} resizeMode="cover" fadeDuration={0} style={s.image}/><View style={s.sceneHeading}><Txt style={s.regionTitle}>{title}</Txt><Txt style={s.vehicleCount}>{vehicles.length} {vehicles.length===1?'Fahrzeug':'Fahrzeuge'}</Txt></View></View>
  <View style={s.content}>
   <Row style={{marginBottom:0}}><Txt muted style={s.caption}>{run.mode==='count'?'Touren':'Touren abgeschlossen'}</Txt><Txt style={s.factValue}>{n(run.completed)}{run.mode==='count'?` / ${n(run.requested)}`:''}</Txt></Row>
   {run.mode==='count'&&<Bar value={run.requested>0?run.completed/run.requested*100:0}/>}
   {vehicles.map((vehicle:any)=><VehicleRow key={vehicle.id} vehicle={vehicle} data={data} clock={clock}/>)}
   <Facts run={run}/>
   {run.stopAfter&&<Txt style={s.ending}>{run.vehicleIds?'Endet nach laufenden Touren':'Endet nach laufender Tour'}</Txt>}
  </View>
  <View style={s.action}><Txt style={s.actionLabel}>Details</Txt><Icon name="chevron" size={15} color={C.onInk}/></View>
 </Pressable>;
}
export function ProcurementRunDetail({run,title,data,clock,busy,onClose,onStop,modalBlocked=false}:any){
 if(!run||modalBlocked)return null;
 const active=run.status==='active',vehicles=running(run);
 return <AppModal visible transparent animationType="none" onRequestClose={onClose}><View style={s.overlay}><View testID="procurement-run-detail" style={s.modal}>
  <View style={s.modalHeading}><View style={{flex:1,minWidth:0}}><Txt style={s.modalTitle}>Beschaffung</Txt><Txt muted style={s.caption}>{title}</Txt></View><Btn icon="close" iconOnly secondary onPress={onClose}>Schließen</Btn></View>
  <ScrollView style={{flexShrink:1}} contentContainerStyle={s.modalContent} keyboardShouldPersistTaps="handled">
   {vehicles.map((vehicle:any)=><View key={vehicle.id}><VehicleRow vehicle={vehicle} data={data} clock={clock}/><Txt muted style={s.caption}>Tour endet in {remaining(vehicle.nextAt,clock)}</Txt></View>)}
   {!active&&<Txt style={s.ended}>Beschaffung beendet</Txt>}
   <View style={s.detailFacts}><Row><Txt muted>Touren</Txt><Txt>{n(run.completed)}{run.mode==='count'?` / ${n(run.requested)}`:''}</Txt></Row><Facts run={run}/></View>
   {active&&<View style={s.stops}>
    {run.stopAfter?<Pill>{run.vehicleIds?'Endet nach laufenden Touren':'Endet nach laufender Tour'}</Pill>:<><Btn secondary disabled={busy} onPress={()=>onStop(run,false)}>{run.vehicleIds?'Nach laufenden Touren beenden':'Nach laufender Tour beenden'}</Btn><Txt muted style={s.actionNote}>{run.vehicleIds?'Die laufenden Touren werden noch abgeschlossen.':'Die laufende Tour wird noch abgeschlossen.'}</Txt></>}
    <Btn secondary danger disabled={busy} onPress={()=>onStop(run,true)}>Sofort abbrechen</Btn><Txt muted style={s.actionNote}>{run.vehicleIds?'Die laufenden Touren werden abgebrochen.':'Die laufende Tour wird abgebrochen.'}</Txt>
   </View>}
  </ScrollView>
 </View></View></AppModal>;
}
const s=StyleSheet.create({
 card:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:7,overflow:'hidden',marginBottom:10},scene:{height:100,overflow:'hidden',backgroundColor:C.ink},image:{position:'absolute',left:0,right:0,top:0,bottom:0,width:'100%',height:'100%'},sceneHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:7,paddingHorizontal:12,paddingVertical:7,backgroundColor:'rgba(21,33,33,.65)'},regionTitle:{flex:1,minWidth:0,color:C.onInk,fontSize:17,lineHeight:23,fontWeight:'600'},vehicleCount:{fontSize:10,lineHeight:16,color:C.onInk},content:{padding:12},caption:{fontSize:10,lineHeight:16},vehicleRow:{flexDirection:'row',alignItems:'center',gap:9,marginTop:7},vehicleCopy:{flex:1,minWidth:0},vehicleHeading:{flexDirection:'row',alignItems:'center',gap:7},vehicleName:{flex:1,minWidth:0,fontSize:12,lineHeight:17,fontWeight:'600'},timer:{fontSize:11,lineHeight:17,flexShrink:0},facts:{flexDirection:'row',borderTopWidth:1,borderTopColor:C.line,marginTop:8,paddingTop:8},fact:{flex:1,minWidth:0,gap:2},factDivider:{borderLeftWidth:1,borderLeftColor:C.line,paddingLeft:10},money:{flexDirection:'row',alignItems:'center',gap:5},factValue:{fontSize:12,lineHeight:18,fontWeight:'600',flexShrink:1},ending:{fontSize:10,lineHeight:16,color:C.accent,marginTop:7},action:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,backgroundColor:C.accent,paddingHorizontal:12},actionLabel:{fontSize:13,lineHeight:20,fontWeight:'600',color:C.onInk},overlay:{flex:1,justifyContent:'center',padding:16,backgroundColor:C.overlay},modal:{width:'100%',maxWidth:480,maxHeight:'88%',alignSelf:'center',borderRadius:12,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,overflow:'hidden'},modalHeading:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:14,paddingVertical:9,borderBottomWidth:1,borderBottomColor:C.line},modalTitle:{fontSize:20,lineHeight:27,fontWeight:'600'},modalContent:{padding:14,paddingTop:4},detailFacts:{marginTop:14},stops:{borderTopWidth:1,borderTopColor:C.line,marginTop:14,paddingTop:8},actionNote:{fontSize:10,lineHeight:16,textAlign:'center',marginTop:5,marginBottom:10},ended:{fontSize:14,color:C.accent,marginTop:10}
});
