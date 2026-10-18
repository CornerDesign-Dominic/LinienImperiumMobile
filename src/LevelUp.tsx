import React from 'react';
import {View,Pressable,Modal,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Card,Row,Btn,Pill,n} from './ui';
type Allocation={expedition:number;overtime:number};
export function LevelUpAllocation({data,busy,allocation,onChange,onConfirm}:{data:any;busy:boolean;allocation:Allocation;onChange:(value:Allocation)=>void;onConfirm:()=>void}){
 const free=3-allocation.expedition-allocation.overtime;
 return <Card style={{borderColor:C.accent}}>
  <Row><Txt style={s.title}>Level Up</Txt><Pill>{free} {free===1?'Punkt':'Punkte'}</Pill></Row>
  {(['expedition','overtime'] as const).map(kind=>{
   const label=kind==='expedition'?'Expedition':'Überstunden',current=kind==='expedition'?data.expeditionCapacity:data.state.overtimeCapacity??100;
   return <View key={kind} style={s.area}><Txt style={{fontWeight:'700',marginBottom:8}}>{label}</Txt><View style={s.values}>
    <View style={s.value}><Txt muted style={s.caption}>Aktuell</Txt><Txt>{n(current)}</Txt></View>
    <View style={s.controls}>
     <Pressable accessibilityRole="button" accessibilityLabel={`${label} verringern`} accessibilityState={{disabled:busy||allocation[kind]===0}} disabled={busy||allocation[kind]===0} onPress={()=>onChange({...allocation,[kind]:allocation[kind]-1})} style={[s.step,{opacity:allocation[kind]?1:.4}]}><Txt>−</Txt></Pressable>
     <Txt gold style={{minWidth:22,textAlign:'center'}}>+{allocation[kind]}</Txt>
     <Pressable accessibilityRole="button" accessibilityLabel={`${label} erhöhen`} accessibilityState={{disabled:busy||free===0}} disabled={busy||free===0} onPress={()=>onChange({...allocation,[kind]:allocation[kind]+1})} style={[s.step,{opacity:free?1:.4}]}><Txt>+</Txt></Pressable>
    </View>
    <View style={s.value}><Txt muted style={s.caption}>Danach</Txt><Txt gold>{n(current+allocation[kind])}</Txt></View>
   </View></View>;
  })}
  <Btn disabled={busy||free!==0} onPress={onConfirm}>Bestätigen</Btn>
 </Card>;
}
export function LevelUpNotice({level,onClose}:{level:number|undefined;onClose:()=>void}){
 return <Modal visible={level!==undefined} transparent animationType="none" onRequestClose={onClose}><View style={s.overlay}><SafeAreaView edges={[]} style={s.modal}>
  <Txt style={s.congrats}>Herzlichen Glückwunsch!</Txt><Txt style={s.level}>Level {level}</Txt>
  <Txt style={s.reward}>+1 Refill · 100 Überstundenpunkte</Txt>
  <Txt style={s.reward}>+3 Punkte zum Verteilen</Txt>
  <Txt style={s.reward}>+50 Expeditionspunkte</Txt>
  <Btn secondary onPress={onClose}>Schließen</Btn>
 </SafeAreaView></View></Modal>;
}
const s=StyleSheet.create({title:{fontSize:16,fontWeight:'700'},area:{paddingVertical:10,borderBottomWidth:1,borderColor:C.line},values:{flexDirection:'row',alignItems:'center',gap:8},value:{width:42,alignItems:'center'},caption:{fontSize:10},controls:{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:6},step:{minWidth:44,minHeight:44,borderRadius:10,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},overlay:{flex:1,backgroundColor:'#000B',justifyContent:'center',alignItems:'center',padding:20},modal:{width:'100%',maxWidth:440,borderRadius:20,padding:20,backgroundColor:C.panel,borderWidth:1,borderColor:C.accent},congrats:{fontSize:19,fontWeight:'700',textAlign:'center'},level:{fontSize:26,fontWeight:'700',textAlign:'center',color:C.accent,marginTop:8,marginBottom:18,lineHeight:32},reward:{fontSize:13,lineHeight:21,marginBottom:8}});
