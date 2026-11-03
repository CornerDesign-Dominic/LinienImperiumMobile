import {MaterialView as View} from './Material';
import React,{useEffect,useRef,useState} from 'react';
import {StyleSheet} from 'react-native';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Row,Btn,n} from './ui';
import {Icon} from './Icon';
import {PointInfo,PointsBalance,PointAllocationRow} from './PointAllocation';

export function ExpansionPointsCard({data,busy,onOpen}:any){
 const e=data.expansion;if(!e)return null;
 return <View style={s.card}><Row><Row style={{justifyContent:'flex-start',marginBottom:0,gap:8}}><Icon name="expansion" size={32}/><Txt style={s.title}>Ausbaupunkte</Txt></Row><PointInfo>{n(e.available)}</PointInfo></Row>
  <Txt muted style={s.small}>Dauerhafte Erweiterungen aus abgeschlossenen Ortslieferungen.</Txt>
  {e.available>0&&<Btn disabled={busy} onPress={onOpen}>Punkte verteilen</Btn>}
 </View>;
}
export function ExpansionPointsModal({data,busy,onCommand,onClose}:any){
 const [draft,setDraft]=useState({expedition:0,overtime:0}),[failed,setFailed]=useState(false),pending=useRef(false);
 const e=data.expansion,total=draft.expedition+draft.overtime,free=e.available-total;
 useEffect(()=>{setDraft(previous=>previous.expedition+previous.overtime>e.available?{expedition:0,overtime:0}:previous);setFailed(false);},[e.available]);
 const confirm=async()=>{
  if(busy||pending.current||!total||free<0)return;
  pending.current=true;setFailed(false);
  try{const next=await onCommand('expansionAllocate',{...draft,points:e.available});if(next?.expansionAllocationApplied)onClose();else setFailed(true);}catch{setFailed(true);}finally{pending.current=false;}
 };
 return <ExpeditionPlaceModal visible title="Ausbaupunkte verteilen" onClose={()=>{if(!busy&&!pending.current)onClose();}}>
  <PointsBalance remaining={free} total={e.available} expansion/>
  {(['expedition','overtime'] as const).map(kind=><PointAllocationRow key={kind} label={kind==='expedition'?'Expeditionsmaximum':'Überstundenmaximum'} current={data.development[kind].base} amount={draft[kind]} free={free} disabled={busy}
   onDecrease={()=>setDraft(d=>d[kind]>0?({...d,[kind]:d[kind]-1}):d)}
   onIncrease={()=>setDraft(d=>d.expedition+d.overtime<e.available?({...d,[kind]:d[kind]+1}):d)}/>) }
  {failed&&<Txt style={{color:C.red,fontSize:12}}>Verteilung konnte nicht gespeichert werden. Bitte verfügbare Punkte prüfen und erneut versuchen.</Txt>}
  <Btn disabled={busy||!total||free<0} onPress={confirm}>Verteilung bestätigen</Btn>
 </ExpeditionPlaceModal>;
}
const s=StyleSheet.create({title:{fontSize:17,lineHeight:23,fontWeight:'700'},small:{fontSize:12,lineHeight:18},card:{padding:12,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:10,marginBottom:12}});

