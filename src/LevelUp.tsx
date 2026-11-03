import {MaterialLayer} from './Material';
import {MaterialView as View} from './Material';
import {ItemAmount} from './ItemArt';
import {itemName} from './items';
import React,{useEffect,useRef,useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Card,Row,Btn,n} from './ui';
import {PointInfo,PointsBalance,PointAllocationRow} from './PointAllocation';
type Allocation={expedition:number;overtime:number};
export function DevelopmentCard({data,busy,onCommand,onExpansion,modalBlocked=false}:any){
 const [open,setOpen]=useState(false),development=data.development;
 if(!development)return null;
 return <>
  <Card style={{padding:12,borderColor:development.points?C.accent:C.line}}>
   <Row style={{marginBottom:7,flexWrap:'nowrap'}}><Txt style={s.title}>Entwicklung</Txt><PointInfo>Verfügbare Punkte: {n(development.points)}</PointInfo></Row>
   {(['overtime','expedition'] as const).map(kind=><Row key={kind} style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={{fontSize:12,flex:1}}>{kind==='overtime'?'Überstunden':'Expeditionspunkte'}</Txt><Txt style={{fontSize:17,fontWeight:'700'}}>{n(development[kind].base)}</Txt></Row>)}
   {development.points>0&&<Btn secondary disabled={busy} onPress={()=>setOpen(true)}>Levelpunkte verteilen · {n(development.points)}</Btn>}
   {data.expansion?.available>0&&onExpansion&&<Btn secondary icon="expansion" disabled={busy} onPress={onExpansion}>Ausbaupunkte verteilen · {n(data.expansion.available)}</Btn>}
  </Card>
  {open&&<DevelopmentModal data={data} busy={busy} onCommand={onCommand} onClose={()=>setOpen(false)} modalBlocked={modalBlocked}/>}
 </>;
}
export function DevelopmentModal({data,busy,onCommand,onClose,modalBlocked}:any){
 const [allocation,setAllocation]=useState<Allocation>({expedition:0,overtime:0}),[saving,setSaving]=useState(false),[failed,setFailed]=useState(false),pending=useRef(false);
 const development=data.development,points=development.points,free=points-allocation.expedition-allocation.overtime,locked=busy||saving;
 useEffect(()=>{setAllocation(previous=>previous.expedition+previous.overtime>points?{expedition:0,overtime:0}:previous);},[points]);
 const confirm=async()=>{
  if(locked||pending.current||free!==0||!points)return;
  pending.current=true;setSaving(true);setFailed(false);
  try{const next=await onCommand('levelBatch',{...allocation,points});if(next?.development?.points===0){onClose();}else setFailed(true);}catch{setFailed(true);}finally{pending.current=false;setSaving(false);}
 };
 return <ExpeditionPlaceModal visible={!modalBlocked} title="Levelpunkte verteilen" onClose={()=>{if(!locked&&!pending.current)onClose();}}>
  <PointsBalance remaining={free} total={points}/>
  {(['expedition','overtime'] as const).map(kind=><PointAllocationRow key={kind} label={kind==='expedition'?'Expeditionsmaximum':'Überstundenmaximum'} current={development[kind].base} amount={allocation[kind]} free={free} disabled={locked}
   onDecrease={()=>setAllocation(previous=>previous[kind]>0?({...previous,[kind]:previous[kind]-1}):previous)}
   onIncrease={()=>setAllocation(previous=>previous.expedition+previous.overtime<points?({...previous,[kind]:previous[kind]+1}):previous)}/>) }
  {failed&&<Txt style={{color:C.red,fontSize:12,marginTop:8}}>Verteilung konnte nicht gespeichert werden. Bitte verfügbare Punkte prüfen und erneut versuchen.</Txt>}
  <Btn disabled={locked||free!==0||!points} onPress={confirm}>{saving?'Speichert …':'Verteilung bestätigen'}</Btn>
 </ExpeditionPlaceModal>;
}
export function LevelUpNotice({levels,onClose}:{levels:number[];onClose:()=>void}){
 const level=levels.at(-1),count=levels.length;
 return <Modal visible={count>0} transparent animationType="none" onRequestClose={onClose}><View style={s.overlay}><SafeAreaView edges={[]} style={s.modal}><MaterialLayer surfaceStyle={s.modal}/>
  <Row style={{flexWrap:'nowrap',alignItems:'flex-start'}}><Txt style={[s.congrats,{flex:1,minWidth:0,textAlign:'left'}]}>Herzlichen Glückwunsch!</Txt><Btn icon="close" iconOnly secondary onPress={onClose}>Schließen</Btn></Row><Txt style={s.level}>Level {level}</Txt>
  <ItemAmount id="expeditionRefills" label={itemName('expeditionRefills',count)} amount={count}/>
  <ItemAmount id="overtimeRefills" label={itemName('overtimeRefills',count)} amount={count}/>
  <Txt style={s.reward}>+{count*3} Punkte zum Verteilen</Txt>
  {!!levels.filter(value=>value<=100&&value%5===0).length&&<Txt style={s.reward}>+{levels.filter(value=>value<=100&&value%5===0).length} {levels.filter(value=>value<=100&&value%5===0).length===1?'Botenplatz':'Botenplätze'}</Txt>}
 </SafeAreaView></View></Modal>;
}
const s=StyleSheet.create({title:{fontSize:16,fontWeight:'700'},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:20},modal:{width:'100%',maxWidth:440,borderRadius:20,padding:20,backgroundColor:C.panel,borderWidth:1,borderColor:C.accent},congrats:{fontSize:19,fontWeight:'700',textAlign:'center'},level:{fontSize:26,fontWeight:'700',textAlign:'center',color:C.accent,marginTop:8,marginBottom:18,lineHeight:32},reward:{fontSize:13,lineHeight:21,marginBottom:8}});

