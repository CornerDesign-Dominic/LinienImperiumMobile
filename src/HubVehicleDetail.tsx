import React,{useRef,useState} from 'react';
import {Pressable,ScrollView,StyleSheet,View} from 'react-native';
import {AppModal} from './AppModal';
import {Icon} from './Icon';
import {ItemArt} from './ItemArt';
import {C,Txt,Btn,n} from './ui';
import {t} from './i18n';

type Kind='capacity'|'speed';
export function HubVehicleDetail({truck,inventory,coins,busy,error,onCommand,onClose,onSell}:any){
 const [kind,setKind]=useState<Kind|null>(null),[actions,setActions]=useState(false),[pending,setPending]=useState(false),[failed,setFailed]=useState(false);
 const inFlight=useRef(false),locked=busy||pending;
 const q=kind?truck.hubUpgrades[kind]:null,label=kind==='capacity'?'Laderaum':'Antrieb',unit=kind==='capacity'?'t':'km/s';
 const command=async(action:string,payload:any)=>{
  if(locked||inFlight.current)return;
  inFlight.current=true;setPending(true);setFailed(false);
  try{const result=await onCommand(action,payload);if(!result){setFailed(true);return;}if(action==='hubVehicleUpgrade')setKind(null);}
  catch{setFailed(true);}finally{inFlight.current=false;setPending(false);}
 };
 const close=()=>{if(locked||inFlight.current)return;if(kind){setKind(null);setFailed(false);}else onClose();};
 const enough=q&&inventory.hubVehicleParts>=q.parts&&coins>=q.coins;
 return <AppModal visible transparent animationType="none" onRequestClose={close}><View style={s.overlay}><View style={s.modal} testID="hub-vehicle-detail">
  <View style={s.header}><View style={{flex:1,minWidth:0}}><Txt muted style={s.caption}>{kind?`${t(truck.model)} · ${truck.id}`:'Stadthub'}</Txt><Txt style={s.heading}>{kind?`${t(label)} ${t('verbessern')}`:`${t(truck.model)} · ${truck.id}`}</Txt></View><Btn icon="close" iconOnly secondary disabled={locked} onPress={close}>Schließen</Btn></View>
  <ScrollView style={{flexShrink:1}} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
   {kind?<>
    <Txt muted style={s.stage}>Stufe {q.level} / {q.max}</Txt>
    <View style={s.comparison}><View style={s.valueBox}><Txt muted style={s.caption}>Aktuell</Txt><Txt style={s.value}>{n(q.current,2)} {unit}</Txt></View><Icon name="arrow" size={18} color={C.gold}/><View style={[s.valueBox,{backgroundColor:C.greenWash}]}><Txt muted style={s.caption}>Nach Ausbau</Txt><Txt style={[s.value,{color:C.accent}]}>{n(q.next,2)} {unit}</Txt></View></View>
    <Txt style={s.sectionTitle}>Kosten</Txt>
    <Txt muted style={s.caption}>Benötigt / Vorhanden</Txt>
    <View style={s.cost}><ItemArt id="hubVehicleParts" size={36}/><View style={{flex:1}}><Txt style={s.label}>Werkzeugkästen</Txt><Txt style={[s.costValue,{color:inventory.hubVehicleParts>=q.parts?C.accent:C.red}]}>{n(q.parts)} / {n(inventory.hubVehicleParts)}</Txt></View></View>
    <View style={s.cost}><Icon name="coin" size={36}/><View style={{flex:1}}><Txt style={s.label}>Münzen</Txt><Txt style={[s.costValue,{color:coins>=q.coins?C.accent:C.red}]}>{n(q.coins,2)} / {n(coins,2)} M</Txt></View></View>
    <Txt muted style={s.note}>Ausbauten wirken ab dem nächsten Stundenzyklus.</Txt>
    {(failed||error)&&<Txt style={s.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>}
    <Btn disabled={locked||!enough||q.level>=q.max} onPress={()=>command('hubVehicleUpgrade',{id:truck.id,kind})}>{pending?'Wird verbessert …':`${t(label)} ${t('ausbauen')}`}</Btn>
   </>:<>
    <View style={s.identity}><View style={s.art}><Icon name="truck" size={44} color={C.gold}/></View><View style={{flex:1}}><Txt style={[s.status,{color:truck.hubAssigned?C.accent:C.muted}]}>{truck.hubAssigned?'Im Hub eingesetzt':'Nicht eingesetzt'}</Txt><Txt muted style={s.caption}>{n(truck.kmDriven)} km gefahren</Txt></View></View>
    <Txt style={s.sectionTitle}>Verbesserungen</Txt>
    <View style={s.upgrades}>{(['capacity','speed'] as const).map(option=>{
     const upgrade=truck.hubUpgrades[option],name=option==='capacity'?'Laderaum':'Antrieb',suffix=option==='capacity'?'t':'km/s',max=upgrade.level>=upgrade.max,available=!max&&coins>=upgrade.coins&&inventory.hubVehicleParts>=upgrade.parts;
     return <Pressable key={option} accessibilityRole="button" accessibilityLabel={`${t(name)}, ${t('Stufe')} ${upgrade.level} / ${upgrade.max}, ${n(upgrade.current,2)} ${suffix}${max?`, ${t('Maximum erreicht')}`:''}`} accessibilityState={{disabled:locked||max}} disabled={locked||max} onPress={()=>{setFailed(false);setKind(option);}} style={({pressed})=>[s.upgrade,option==='speed'&&s.divider,pressed&&{backgroundColor:C.raised}]}>
      <Icon name={option==='capacity'?'module':'gear'} size={24} color={C.gold}/><View style={{flex:1,minWidth:0}}><Txt style={s.upgradeTitle}>{name}</Txt><Txt muted style={s.caption}>{max?'Maximum erreicht':`${t('Stufe')} ${upgrade.level} / ${upgrade.max}`}</Txt></View><Txt style={s.current}>{n(upgrade.current,2)} {suffix}</Txt>{available&&<View style={s.dot}/>}<Icon name="chevron" size={16} color={max?C.muted:C.text}/>
     </Pressable>;
    })}</View>
    <Txt muted style={s.note}>Ausbauten wirken ab dem nächsten Stundenzyklus.</Txt>
    {(failed||error)&&<Txt style={s.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>}
    <Btn secondary disabled={locked} onPress={()=>command('hubTruck',{id:truck.id})}>{truck.hubAssigned?'Aus Hub nehmen':'Im Hub einsetzen'}</Btn>
    {!!truck.sale&&<View style={s.actions}><Pressable accessibilityRole="button" accessibilityLabel={t('Weitere Aktionen')} accessibilityState={{expanded:actions}} disabled={locked} onPress={()=>setActions(value=>!value)} style={s.toggle}><Txt muted style={s.label}>Weitere Aktionen</Txt><Icon name="chevron" size={16} style={{transform:[{rotate:actions?'90deg':'0deg'}]}}/></Pressable>{actions&&<Btn secondary disabled={locked} onPress={()=>{onClose();onSell(truck);}}>Verkaufen · {n(truck.sale.coins,2)} M</Btn>}</View>}
   </>}
  </ScrollView>
 </View></View></AppModal>;
}
const s=StyleSheet.create({
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:16},modal:{width:'100%',maxWidth:460,maxHeight:'90%',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,overflow:'hidden'},
 header:{flexDirection:'row',alignItems:'center',gap:10,padding:16,borderBottomWidth:1,borderBottomColor:C.line},heading:{fontSize:19,lineHeight:25,fontWeight:'700'},content:{padding:16,paddingTop:12},caption:{fontSize:11,lineHeight:17},stage:{fontSize:12,marginBottom:12},
 identity:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:8},art:{width:64,height:64,borderWidth:1,borderColor:C.line,borderRadius:6,backgroundColor:C.raised,justifyContent:'center',alignItems:'center'},status:{fontSize:13,fontWeight:'600',marginBottom:4},sectionTitle:{fontSize:14,fontWeight:'700',marginTop:10,marginBottom:8},
 upgrades:{borderWidth:1,borderColor:C.line,borderRadius:6,overflow:'hidden'},upgrade:{flexDirection:'row',alignItems:'center',gap:8,minHeight:76,padding:10},divider:{borderTopWidth:1,borderTopColor:C.line},upgradeTitle:{fontSize:14,fontWeight:'700'},current:{fontSize:12,fontWeight:'700',flexShrink:1,textAlign:'right'},dot:{width:6,height:6,borderRadius:3,backgroundColor:C.accent},
 comparison:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},valueBox:{flex:1,minWidth:0,padding:10,borderRadius:6,backgroundColor:C.raised,gap:4},value:{fontSize:16,lineHeight:23,fontWeight:'700'},cost:{flexDirection:'row',alignItems:'center',gap:10,marginTop:12},label:{fontSize:12,lineHeight:18},costValue:{fontSize:14,lineHeight:21,fontWeight:'700'},note:{fontSize:10,lineHeight:16,marginTop:12,marginBottom:4},error:{fontSize:12,color:C.red,marginTop:10},actions:{borderTopWidth:1,borderTopColor:C.line,marginTop:14},toggle:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8}
});
