import {ItemArt,ItemAmount} from './ItemArt';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {itemName} from './items';
import React,{useEffect,useRef,useState} from 'react';
import {View,Pressable,Modal,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Card,Row,Btn,Pill,n} from './ui';
type Allocation={expedition:number;overtime:number};
export function DevelopmentCard({data,busy,onCommand,modalBlocked=false}:any){
 const [open,setOpen]=useState(false),development=data.development;
 if(!development)return null;
 return <>
  <Card style={{padding:12,borderColor:development.points?C.accent:C.line}}>
   <Row style={{marginBottom:7,flexWrap:'nowrap'}}><Txt style={s.title}>Entwicklung</Txt><Pill>Verfügbare Punkte: {n(development.points)}</Pill></Row>
   {(['overtime','expedition'] as const).map(kind=><Row key={kind} style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={{fontSize:12,flex:1}}>{kind==='overtime'?'Überstunden':'Expeditionspunkte'}</Txt><View accessible accessibilityLabel={`${translate(kind==='overtime'?'Überstunden':'Expeditionspunkte')}: ${translate('Basis')} ${n(development[kind].base)}, ${translate('Boni')} +${n(development[kind].bonus)}`} style={s.capacity}><Txt style={{fontWeight:'700'}}>{n(development[kind].base)}</Txt><Txt gold>+{n(development[kind].bonus)}</Txt></View></Row>)}
   <Txt muted style={s.caption}>Basiswert + Boni</Txt>
   {development.points>0&&<Btn disabled={busy} onPress={()=>setOpen(true)}>Punkte verteilen</Btn>}
  </Card>
  {open&&<DevelopmentModal data={data} busy={busy} onCommand={onCommand} onClose={()=>setOpen(false)} modalBlocked={modalBlocked}/>}
 </>;
}
function DevelopmentModal({data,busy,onCommand,onClose,modalBlocked}:any){
 const [allocation,setAllocation]=useState<Allocation>({expedition:0,overtime:0}),[saving,setSaving]=useState(false),[failed,setFailed]=useState(false),pending=useRef(false);
 const development=data.development,points=development.points,free=points-allocation.expedition-allocation.overtime,locked=busy||saving;
 useEffect(()=>{setAllocation(previous=>previous.expedition+previous.overtime>points?{expedition:0,overtime:0}:previous);},[points]);
 const confirm=async()=>{
  if(locked||pending.current||free!==0||!points)return;
  pending.current=true;setSaving(true);setFailed(false);
  try{const next=await onCommand('levelBatch',{...allocation,points});if(next?.development?.points===0){onClose();}else setFailed(true);}catch{setFailed(true);}finally{pending.current=false;setSaving(false);}
 };
 return <ExpeditionPlaceModal visible={!modalBlocked} title="Punkte verteilen" onClose={()=>{if(!saving)onClose();}}>
  <Row><Txt muted>Noch verfügbar</Txt><Pill>{n(free)} / {n(points)}</Pill></Row>
  <Txt muted style={s.caption}>Jeder Punkt erhöht den Basiswert um 1. Boni bleiben zusätzlich erhalten.</Txt>
  {(['overtime','expedition'] as const).map(kind=>{
   const label=kind==='expedition'?'Expeditionspunkte':'Überstunden',current=development[kind];
   return <View key={kind} style={s.area}>
    <Row style={{marginBottom:7,flexWrap:'nowrap'}}><Txt style={{fontWeight:'700',flex:1}}>{label}</Txt><Txt gold style={{fontSize:12}}>Boni +{n(current.bonus)}</Txt></Row>
    <View style={s.values}>
     <View style={{flex:1}}><Txt muted style={s.caption}>Basis</Txt><Txt>{n(current.base)} → {n(current.base+allocation[kind])}</Txt></View>
     <View style={s.controls}>
      <Pressable accessibilityRole="button" accessibilityLabel={translate(`${label} verringern`)} disabled={locked||allocation[kind]===0} onPress={()=>setAllocation(previous=>previous[kind]>0?({...previous,[kind]:previous[kind]-1}):previous)} style={[s.step,(locked||!allocation[kind])&&{opacity:.4}]}><Icon name="minus" size={18}/></Pressable>
      <Txt gold style={{minWidth:30,textAlign:'center'}}>+{n(allocation[kind])}</Txt>
      <Pressable accessibilityRole="button" accessibilityLabel={translate(`${label} erhöhen`)} disabled={locked||free<=0} onPress={()=>setAllocation(previous=>previous.expedition+previous.overtime<points?({...previous,[kind]:previous[kind]+1}):previous)} style={[s.step,(locked||free<=0)&&{opacity:.4}]}><Icon name="plus" size={18}/></Pressable>
     </View>
    </View>
   </View>;
  })}
  {failed&&<Txt style={{color:C.red,fontSize:12,marginTop:8}}>Verteilung konnte nicht gespeichert werden. Bitte verfügbare Punkte prüfen und erneut versuchen.</Txt>}
  <Btn disabled={locked||free!==0||!points} onPress={confirm}>{saving?'Speichert …':'Verteilung bestätigen'}</Btn>
 </ExpeditionPlaceModal>;
}
export function LevelUpNotice({levels,onClose}:{levels:number[];onClose:()=>void}){
 const level=levels.at(-1),count=levels.length;
 return <Modal visible={count>0} transparent animationType="none" onRequestClose={onClose}><View style={s.overlay}><SafeAreaView edges={[]} style={s.modal}>
  <Txt style={s.congrats}>Herzlichen Glückwunsch!</Txt><Txt style={s.level}>Level {level}</Txt>
  <ItemAmount id="expeditionRefills" label={itemName('expeditionRefills',count)} amount={count}/>
  <ItemAmount id="overtimeRefills" label={itemName('overtimeRefills',count)} amount={count}/>
  <Txt style={s.reward}>+{count*3} Punkte zum Verteilen</Txt>
  {!!levels.filter(value=>value<=100&&value%5===0).length&&<Txt style={s.reward}>+{levels.filter(value=>value<=100&&value%5===0).length} Stadthub Fahrzeug</Txt>}
  <Btn icon="close" iconOnly secondary onPress={onClose}>Schließen</Btn>
 </SafeAreaView></View></Modal>;
}
const s=StyleSheet.create({title:{fontSize:16,fontWeight:'700'},area:{paddingVertical:10,borderBottomWidth:1,borderColor:C.line},values:{flexDirection:'row',alignItems:'center',gap:8},value:{width:42,alignItems:'center'},caption:{fontSize:10},capacity:{flexDirection:'row',alignItems:'center',gap:8},controls:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:6},step:{minWidth:44,minHeight:44,borderRadius:10,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:20},modal:{width:'100%',maxWidth:440,borderRadius:20,padding:20,backgroundColor:C.panel,borderWidth:1,borderColor:C.accent},congrats:{fontSize:19,fontWeight:'700',textAlign:'center'},level:{fontSize:26,fontWeight:'700',textAlign:'center',color:C.accent,marginTop:8,marginBottom:18,lineHeight:32},reward:{fontSize:13,lineHeight:21,marginBottom:8}});
