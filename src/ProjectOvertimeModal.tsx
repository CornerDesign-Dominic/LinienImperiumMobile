import React,{useRef,useState} from 'react';
import {MaterialView as View} from './Material';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Row,Btn,n} from './ui';
import {PointInfo} from './PointAllocation';
import {overtimeQuote} from './projectOvertime';
export function ProjectOvertimeModal({order,points,busy,clock,visible,onClose,onCommand}:any){
 const [amount,setAmount]=useState<number|'max'>(1),[saving,setSaving]=useState(false),[failed,setFailed]=useState(false),pending=useRef(false);
 const q=overtimeQuote(order,points,amount,clock),locked=busy||saving;
 const close=()=>{if(!locked&&!pending.current)onClose();};
 const confirm=async()=>{
  if(locked||pending.current||!q.canConfirm)return;
  pending.current=true;setSaving(true);setFailed(false);
  try{const result=await onCommand('overtime',{id:order.id,amount});if(result?.overtimeApplied===true)onClose();else setFailed(true);}catch{setFailed(true);}finally{pending.current=false;setSaving(false);}
 };
 return <ExpeditionPlaceModal visible={visible} title="Überstunden einsetzen" onClose={close}>
  <Row><Txt muted>Verfügbar</Txt><PointInfo>{n(points)} Punkte</PointInfo></Row>
  {order.distance>0&&<Txt muted style={{fontSize:12,marginBottom:12}}>1 Punkt liefert hier {n(1000/order.distance,2)} t sofort.</Txt>}
  <View style={{flexDirection:'row',gap:6}}>{[1,5,10].map(value=><Btn key={value} secondary={amount!==value} disabled={locked} style={{flex:1,minWidth:0}} onPress={()=>{setAmount(value);setFailed(false);}}>{String(value)}</Btn>)}</View>
  <Btn secondary disabled={locked||!q.deadlineEnabled} onPress={()=>{setAmount('max');setFailed(false);}}>{q.required===0?'Frist bereits gesichert · 0 Punkte':q.required===null?'Fristbedarf nicht verfügbar':`Frist sichern · ${n(q.required)} Punkte`}</Btn>
  {q.required!==null&&q.required>points&&<Txt style={{color:C.red,fontSize:12}}>Nicht genügend Überstundenpunkte für die Fristsicherung.</Txt>}
  <View style={{marginVertical:12,padding:10,borderWidth:1,borderColor:C.line,borderRadius:6}}><Txt style={{fontWeight:'700',marginBottom:8}}>Dein Einsatz</Txt><Row><Txt muted>Sofort geliefert</Txt><Txt>+{n(q.tons,2)} t</Txt></Row><Row><Txt muted>Vorrat danach</Txt><Txt>{n(q.after)} Punkte</Txt></Row></View>
  {failed&&<Txt style={{color:C.red,fontSize:12}}>Einsatz nicht bestätigt. Bitte erneut versuchen.</Txt>}
  <Btn disabled={locked||!q.canConfirm} onPress={confirm}>{saving?'Wird eingesetzt …':`${n(q.points)} Punkte einsetzen`}</Btn>
 </ExpeditionPlaceModal>;
}
