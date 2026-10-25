import React,{useEffect,useRef,useState} from 'react';
import {View,ScrollView,StyleSheet} from 'react-native';
import {AppModal} from './AppModal';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {regionIdentities} from './regionIdentities';
import {regionRoutes} from './regionRoutes';
import {C,Txt,Row,Btn,Pill,n} from './ui';

export function ExpeditionCompletionNotice({notices,points,busy,error,onClose,onDistribute}:any){
 return <AppModal visible={!!notices?.length} trackActivity={false} transparent animationType="none" onRequestClose={()=>{if(!busy)onClose();}}>
  <View style={s.overlay}><View style={s.modal}>
   <Row style={{flexWrap:'nowrap'}}><Txt style={[s.title,{flex:1}]}>Expeditionen abgeschlossen</Txt><Btn icon="close" iconOnly secondary disabled={busy} onPress={onClose}>Schließen</Btn></Row>
   <ScrollView style={{flexShrink:1}}>{notices?.map((notice:any)=><View key={notice.sequence} style={s.result}>
    <Txt muted style={s.small}>{regionIdentities[notice.region]?.title}</Txt>
    <Txt style={{fontWeight:'700',marginVertical:4}}>{notice.kind==='endless'?'Expeditionsauftrag':regionRoutes[notice.region]?.places[notice.place]?.name}</Txt>
    {notice.customerId?null:notice.expansionPoints>0?<Txt gold>+{notice.expansionPoints} Erweiterungspunkt</Txt>:<Txt>{notice.reward}</Txt>}
    {notice.customerId&&<><Txt style={{color:C.accent,marginTop:4}}>Stammkunde freigeschaltet</Txt><Txt>{regionIdentities[notice.region]?.customer}</Txt></>}
    {notice.capacityModules>0&&<Txt gold>+{notice.capacityModules} Kapazitätsmodul</Txt>}
   </View>)}</ScrollView>
   {!!error&&<Txt style={{color:C.red,fontSize:12,marginTop:8}}>{error}</Txt>}
   <Btn disabled={busy||points<=0} onPress={onDistribute}>Punkte verteilen</Btn>
  </View></View>
 </AppModal>;
}
export function ExpansionPointsCard({data,busy,onOpen}:any){
 const e=data.expansion;if(!e)return null;
 return <View style={s.card}><Row><Txt style={s.title}>Erweiterungspunkte</Txt><Pill gold={e.available>0}>{n(e.available)}</Pill></Row>
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
 return <ExpeditionPlaceModal visible title="Erweiterungspunkte verteilen" onClose={()=>{if(!busy&&!pending.current)onClose();}}>
  <Row><Txt muted>Noch verfügbar</Txt><Pill>{n(Math.max(0,free))} / {n(e.available)}</Pill></Row>
  <Txt muted style={s.small}>Jeder Punkt erhöht das gewählte Maximum dauerhaft um 1. Die bestätigte Verteilung kann nicht rückgängig gemacht werden.</Txt>
  {(['expedition','overtime'] as const).map(kind=>{const label=kind==='expedition'?'Expeditionsmaximum':'Überstundenmaximum',current=kind==='expedition'?e.expeditionMaximum:e.overtimeMaximum;return <View key={kind} style={s.result}>
   <Txt style={{fontWeight:'700'}}>{label}</Txt><Row style={{marginTop:8,flexWrap:'nowrap'}}><Txt>{n(current)} → {n(current+draft[kind])}</Txt><View style={s.controls}>
    <Btn secondary icon="minus" iconOnly disabled={busy||!draft[kind]} onPress={()=>setDraft(d=>({...d,[kind]:d[kind]-1}))}>{label+' verringern'}</Btn>
    <Txt gold style={{minWidth:22,textAlign:'center'}}>+{draft[kind]}</Txt>
    <Btn secondary icon="plus" iconOnly disabled={busy||free<=0} onPress={()=>setDraft(d=>({...d,[kind]:d[kind]+1}))}>{label+' erhöhen'}</Btn>
   </View></Row>
  </View>;})}
  {failed&&<Txt style={{color:C.red,fontSize:12}}>Verteilung konnte nicht gespeichert werden. Bitte verfügbare Punkte prüfen und erneut versuchen.</Txt>}
  <Btn disabled={busy||!total||free<0} onPress={confirm}>Verteilung bestätigen</Btn>
 </ExpeditionPlaceModal>;
}
const s=StyleSheet.create({overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:16},modal:{width:'100%',maxWidth:460,maxHeight:'90%',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:12,padding:16},title:{fontSize:17,lineHeight:23,fontWeight:'700'},result:{paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.line},small:{fontSize:12,lineHeight:18},controls:{flexDirection:'row',alignItems:'center',gap:4},card:{padding:12,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:10,marginBottom:12}});
