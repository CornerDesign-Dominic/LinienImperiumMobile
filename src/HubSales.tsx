import {MaterialPressable as Pressable,MaterialView as View} from './Material';
import React,{useState} from 'react';
import {SalesMaterialView,SalesMaterialButton} from './SalesMaterial';
import {Image,ScrollView,StyleSheet} from 'react-native';
import {AppModal} from './AppModal';
import {ModalCloseButton} from './ModalCloseButton';
import {Icon} from './Icon';
import {ItemArt} from './ItemArt';
import {t} from './i18n';
import {C,Txt,n,remaining,displayFont} from './ui';

const scene=require('../assets/art/hub/sales-desk.jpg');
const workTime=(minutes:number)=>{const seconds=Math.round(minutes*60);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
function Cost({id,label,owned,need}:any){
 const enough=owned>=need;
 return <View style={s.cost}><ItemArt id={id} size={36}/><Txt style={s.costName}>{label}</Txt><View style={s.quantity}><Txt style={[s.costValue,{color:enough?C.accent:C.red}]}>{n(owned)} / {n(need)}</Txt><Icon name={enough?'check':'close'} size={13} color={enough?C.accent:C.red}/></View></View>;
}
export function HubSales({hub,info,inventory,busy,error,clock,onOpen,onCommand,modalBlocked=false}:any){
 const [open,setOpen]=useState(false),max=info.cycle.salesMax??20,atMax=hub.salesLevel>=max;
 const current=info.cycle.workMinutes,next=atMax?current:info.cycle.nextWorkMinutes;
 const delta=Math.max(0,next-current),extra=info.hourlyCapacity*delta/60;
 const contactsMissing=Math.max(0,info.upgradeContacts-inventory.supplierContacts),itemsMissing=Math.max(0,info.upgradeItems-inventory.companyItems);
 const enough=!contactsMissing&&!itemsMissing,building=!!hub.construction,canUpgrade=!atMax&&!building&&enough;
 const action=building?'Ausbau ansehen':atMax?'Details':'Verbessern';
 const openModal=()=>{onOpen?.();setOpen(true);};
 const close=()=>{if(!busy)setOpen(false);};
 return <>
  <Pressable testID="hub-sales-card" accessibilityRole="button" accessibilityLabel={`${t('Vertrieb')}, ${t('Stufe')} ${hub.salesLevel} / ${max}, ${workTime(current)} ${t('Min.')}, ${t(action)}`} accessibilityState={{disabled:!!busy}} disabled={busy} onPress={openModal} style={({pressed})=>[s.card,pressed&&s.pressed]}>
   <Image source={scene} accessible={false} resizeMode="cover" fadeDuration={0} style={s.image}/>
   <View style={s.cardHeading}><Txt style={s.cardTitle}>Vertrieb</Txt><Txt style={s.cardStage}>Stufe {hub.salesLevel} / {max}</Txt></View>
   <View style={s.scenery}/>
   <View style={s.cardInfo}><Txt style={s.workTime}>{workTime(current)} Min.</Txt><Txt style={s.cardCaption}>Verteilung je Stunde</Txt><Txt style={s.cardBonus}>{!atMax&&delta>0?`+${n(extra,1)} ${t('t pro Stunde nach Ausbau')}`:`${n(info.hourlyCapacity*current/60,1)} ${t('t Verteilung pro Stunde')}`}</Txt>{building&&<Txt style={s.cardCaption}>Ausbau fertig in {remaining(hub.construction.finishAt,clock)}</Txt>}{atMax&&<Txt style={s.cardCaption}>Maximum erreicht</Txt>}</View>
   <View style={s.action}><Txt style={s.actionText}>{action}</Txt></View>
  </Pressable>
  <AppModal visible={open&&!modalBlocked} transparent animationType="none" onRequestClose={close}><View style={s.overlay}><SalesMaterialView testID="hub-sales-modal" style={s.modal}>
   <SalesMaterialView kind="petrol" style={s.modalHeading}><Txt style={s.modalTitle}>Vertrieb verbessern</Txt><ModalCloseButton testID="hub-sales-close" disabled={!!busy} onPress={close}/></SalesMaterialView>
   <ScrollView style={{flexShrink:1}} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
    <View style={s.banner}><Image source={scene} accessible={false} resizeMode="cover" fadeDuration={0} style={s.image}/></View>
    <View style={s.content}>
     <Txt style={s.stage}>{atMax?`${t('Stufe')} ${hub.salesLevel} / ${max}`:`${t('Stufe')} ${hub.salesLevel} → ${hub.salesLevel+1}`}</Txt>
     <View style={s.comparison}><View style={s.valueBox}><Txt muted style={s.caption}>Aktuell</Txt><Txt style={s.value}>{workTime(current)} Min.</Txt></View>{!atMax&&<><Icon name="arrow" size={18} color={C.gold}/><View style={[s.valueBox,s.after]}><Txt muted style={s.caption}>Nach Ausbau</Txt><Txt style={[s.value,{color:C.accent}]}>{workTime(next)} Min.</Txt></View></>}</View>
     {!atMax&&delta>0&&<><Txt style={s.benefit}>+{n(delta*60)} Sek. Verteilung pro Stunde</Txt><Txt muted style={s.bonus}>+{n(extra,1)} t pro Stunde nach Ausbau</Txt></>}
     <Txt muted style={s.explanation}>Wirkt ab dem nächsten Einkauf nach Ausbauabschluss.</Txt>
     {building?<View style={s.section}><Txt style={s.sectionTitle}>Ausbau läuft</Txt><Txt style={s.countdown}>Ausbau fertig in {remaining(hub.construction.finishAt,clock)}</Txt></View>:atMax?<View style={s.section}><Txt style={s.sectionTitle}>Maximum erreicht</Txt></View>:<View style={s.section}>
      <Txt style={s.sectionTitle}>Ausbaukosten</Txt>
      <Cost id="supplierContacts" label="Lieferantenkontakte" owned={inventory.supplierContacts} need={info.upgradeContacts}/>
      <Cost id="companyItems" label="Firmenausbau-Items" owned={inventory.companyItems} need={info.upgradeItems}/>
      <View style={s.duration}><Icon name="speed" size={23}/><Txt style={s.durationText}>Ausbaudauer: {(hub.salesLevel+1)*12} Stunden</Txt></View>
     </View>}
    </View>
   </ScrollView>
   {!atMax&&!building&&<View style={s.footer}>{error&&<Txt style={s.missing}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>}<SalesMaterialButton disabled={busy||!canUpgrade} onPress={()=>onCommand('hubUpgrade')}>{busy?'Wird gestartet …':'Ausbau starten'}</SalesMaterialButton></View>}
  </SalesMaterialView></View></AppModal>
 </>;
}
const s=StyleSheet.create({
 card:{width:'100%',aspectRatio:1.35,minHeight:235,borderWidth:1,borderColor:C.line,borderRadius:8,overflow:'hidden',backgroundColor:C.ink,marginBottom:10},image:{position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%'},cardHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8,minHeight:36,paddingHorizontal:12,paddingVertical:7,backgroundColor:'rgba(21,33,33,.76)'},cardTitle:{fontSize:15,lineHeight:21,fontWeight:'700',color:C.onInk},cardStage:{fontSize:11,lineHeight:17,color:C.onInk},scenery:{flex:1},cardInfo:{padding:9,alignItems:'center',backgroundColor:'rgba(21,33,33,.78)'},workTime:{fontSize:25,lineHeight:31,fontWeight:'700',color:C.onInk},cardCaption:{fontSize:10,lineHeight:16,color:C.onInk,textAlign:'center'},cardBonus:{fontSize:11,lineHeight:17,fontWeight:'600',color:C.onInk,textAlign:'center',marginTop:3},action:{minHeight:44,justifyContent:'center',alignItems:'center',padding:9,backgroundColor:'rgba(21,33,33,.9)',borderTopWidth:1,borderTopColor:C.brass},actionText:{fontSize:14,lineHeight:21,fontWeight:'700',color:C.onInk},pressed:{opacity:.85},
 overlay:{flex:1,justifyContent:'center',alignItems:'center',padding:16,backgroundColor:C.overlay},modal:{width:'100%',maxWidth:460,maxHeight:'90%',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,overflow:'hidden'},modalHeading:{flexDirection:'row',alignItems:'center',gap:8,paddingLeft:14,paddingRight:8,paddingVertical:8,backgroundColor:C.ink,minHeight:60},modalTitle:{flex:1,fontFamily:displayFont,fontSize:21,lineHeight:27,fontWeight:'600',color:C.onInk},scroll:{paddingBottom:4},banner:{height:86,overflow:'hidden'},content:{padding:14},stage:{fontSize:17,lineHeight:24,fontWeight:'700',textAlign:'center',marginBottom:12},comparison:{flexDirection:'row',alignItems:'center',gap:8},valueBox:{flex:1,minWidth:0,backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:6,paddingHorizontal:6,paddingVertical:10,alignItems:'center'},after:{backgroundColor:C.greenWash},caption:{fontSize:10,lineHeight:16},value:{fontSize:16,lineHeight:23,fontWeight:'700',textAlign:'center'},benefit:{fontSize:12,lineHeight:18,fontWeight:'600',textAlign:'center',marginTop:10},bonus:{fontSize:11,lineHeight:17,textAlign:'center',marginTop:3},explanation:{fontSize:10,lineHeight:16,textAlign:'center',marginTop:8},section:{borderTopWidth:1,borderTopColor:C.line,marginTop:14,paddingTop:12},sectionTitle:{fontSize:14,lineHeight:21,fontWeight:'700'},cost:{flexDirection:'row',alignItems:'center',gap:7,minHeight:48,paddingVertical:5,borderBottomWidth:1,borderBottomColor:C.line},costName:{flex:1,minWidth:0,fontSize:11,lineHeight:16},quantity:{flexDirection:'row',alignItems:'center',gap:5,flexShrink:0},costValue:{fontSize:12,lineHeight:18,fontWeight:'600'},duration:{flexDirection:'row',alignItems:'center',gap:7,marginTop:12},durationText:{flex:1,fontSize:11,lineHeight:17},countdown:{fontSize:13,lineHeight:20,marginTop:6,color:C.accent},footer:{paddingHorizontal:14,paddingBottom:14,paddingTop:6,borderTopWidth:1,borderTopColor:C.line},missing:{fontSize:10,lineHeight:16,textAlign:'center',color:C.red,marginTop:3}
});
