import {MaterialLayer} from './Material';
import {MaterialView as View} from './Material';
import {ItemAmount} from './ItemArt';
import {itemName} from './items';
import React,{useEffect,useRef,useState} from 'react';
import {Image,StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Card,Row,Btn,n} from './ui';
import {PointsBalance,PointAllocationRow} from './PointAllocation';
type Allocation={expedition:number;overtime:number};
export function DevelopmentCard({data,busy,onCommand,modalBlocked=false}:any){
 const [open,setOpen]=useState(false),development=data.development;
 if(!development)return null;
 return <>
  <Card style={[s.headquartersCard,{borderColor:development.points?C.accent:C.line}]}>
   <Image testID="empire-headquarters-art" source={require('../assets/art/company/headquarters.jpg')} resizeMode="cover" accessible={false} fadeDuration={0} style={s.headquartersArt}/>
   <View style={s.developmentBody}>
   {(['overtime','expedition'] as const).map(kind=><Row key={kind} style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={{fontSize:12,flex:1}}>{kind==='overtime'?'Überstunden':'Expeditionspunkte'}</Txt><Txt style={{fontSize:17,fontWeight:'700'}}>{n(development[kind].base)}</Txt></Row>)}
   {development.points>0&&<Btn secondary icon="expansion" disabled={busy} onPress={()=>setOpen(true)}>Ausbaupunkte verteilen · {n(development.points)}</Btn>}
   </View>
  </Card>
  {open&&<DevelopmentModal data={data} busy={busy} onCommand={onCommand} onClose={()=>setOpen(false)} modalBlocked={modalBlocked}/>}
 </>;
}
export function DevelopmentModal({data,busy,onCommand,onClose,modalBlocked}:any){
 const [allocation,setAllocation]=useState<Allocation>({expedition:0,overtime:0}),[saving,setSaving]=useState(false),[failed,setFailed]=useState(false),pending=useRef(false);
 const development=data.development,points=development.points,total=allocation.expedition+allocation.overtime,free=points-total,locked=busy||saving;
 useEffect(()=>{setAllocation(previous=>previous.expedition+previous.overtime>points?{expedition:0,overtime:0}:previous);},[points]);
 const confirm=async()=>{
  if(locked||pending.current||!total||free<0)return;
  pending.current=true;setSaving(true);setFailed(false);
  try{const next=await onCommand('expansionAllocate',{...allocation,points});if(next?.expansionAllocationApplied){onClose();}else setFailed(true);}catch{setFailed(true);}finally{pending.current=false;setSaving(false);}
 };
 return <ExpeditionPlaceModal visible={!modalBlocked} title="Ausbaupunkte verteilen" onClose={()=>{if(!locked&&!pending.current)onClose();}}>
  <PointsBalance remaining={free} total={points} expansion/>
  {(['expedition','overtime'] as const).map(kind=><PointAllocationRow key={kind} label={kind==='expedition'?'Expeditionsmaximum':'Überstundenmaximum'} current={development[kind].base} amount={allocation[kind]} free={free} disabled={locked}
   onDecrease={()=>setAllocation(previous=>previous[kind]>0?({...previous,[kind]:previous[kind]-1}):previous)}
   onIncrease={()=>setAllocation(previous=>previous.expedition+previous.overtime<points?({...previous,[kind]:previous[kind]+1}):previous)}/>) }
  {failed&&<Txt style={{color:C.red,fontSize:12,marginTop:8}}>Verteilung konnte nicht gespeichert werden. Bitte verfügbare Punkte prüfen und erneut versuchen.</Txt>}
  <Btn disabled={locked||!total||free<0} onPress={confirm}>{saving?'Speichert …':'Verteilung bestätigen'}</Btn>
 </ExpeditionPlaceModal>;
}
export function LevelUpNotice({levels,onClose}:{levels:number[];onClose:()=>void}){
 const level=levels.at(-1),count=levels.length;
 return <Modal visible={count>0} transparent animationType="none" onRequestClose={onClose}><View style={s.overlay}><SafeAreaView edges={[]} style={s.modal}><MaterialLayer surfaceStyle={s.modal}/>
  <Row style={{flexWrap:'nowrap',alignItems:'flex-start'}}><Txt style={[s.congrats,{flex:1,minWidth:0,textAlign:'left'}]}>Herzlichen Glückwunsch!</Txt><Btn icon="close" iconOnly secondary onPress={onClose}>Schließen</Btn></Row><Txt style={s.level}>Level {level}</Txt>
  <ItemAmount id="expeditionRefills" label={itemName('expeditionRefills',count)} amount={count}/>
  <ItemAmount id="overtimeRefills" label={itemName('overtimeRefills',count)} amount={count}/>
  <Txt style={s.reward}>+{count*3} Ausbaupunkte</Txt>
  {!!levels.filter(value=>value<=100&&value%5===0).length&&<Txt style={s.reward}>+{levels.filter(value=>value<=100&&value%5===0).length} {levels.filter(value=>value<=100&&value%5===0).length===1?'Botenplatz':'Botenplätze'}</Txt>}
 </SafeAreaView></View></Modal>;
}
const s=StyleSheet.create({headquartersCard:{padding:0,overflow:'hidden'},headquartersArt:{width:'100%',aspectRatio:16/9,maxHeight:210},developmentBody:{padding:11},title:{fontSize:16,fontWeight:'700'},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:20},modal:{width:'100%',maxWidth:440,borderRadius:20,padding:20,backgroundColor:C.panel,borderWidth:1,borderColor:C.accent},congrats:{fontSize:19,fontWeight:'700',textAlign:'center'},level:{fontSize:26,fontWeight:'700',textAlign:'center',color:C.accent,marginTop:8,marginBottom:18,lineHeight:32},reward:{fontSize:13,lineHeight:21,marginBottom:8}});


