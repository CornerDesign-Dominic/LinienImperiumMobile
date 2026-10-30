import React,{useRef,useState} from 'react';
import {View,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppModal} from './AppModal';
import {Icon} from './Icon';
import {C,Txt,Btn,n} from './ui';

export function OfferRefreshModal({visible,cost,coins,busy,error,onClose,onConfirm}:any){
 const pending=useRef(false),[saving,setSaving]=useState(false),[failed,setFailed]=useState(false);
 const locked=busy||saving,enough=coins>=cost;
 const close=()=>{if(!locked&&!pending.current)onClose();};
 const confirm=async()=>{
  if(locked||pending.current||!enough)return;
  pending.current=true;setSaving(true);setFailed(false);
  try{const result=await onConfirm();if(result)onClose();else setFailed(true);}
  catch{setFailed(true);}
  finally{pending.current=false;setSaving(false);}
 };
 return <AppModal visible={visible} transparent animationType="none" onRequestClose={close}>
  <SafeAreaView style={s.overlay}>
   <View style={s.modal}>
    <View style={s.heading}><Txt style={s.title}>Neue Angebote?</Txt><Btn icon="close" iconOnly secondary disabled={locked} onPress={close}>Schließen</Btn></View>
    <ScrollView style={{flexShrink:1}} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
     <View style={s.price}><Icon name="coin" size={34}/><Txt style={s.amount}>{n(cost)} M</Txt></View>
     <Txt muted>Gehaltene Angebote bleiben bestehen.</Txt>
     {!enough&&<Txt style={s.error}>Nicht genügend Münzen.</Txt>}
     {failed&&<Txt style={s.error}>{error||'Angebote konnten nicht gewechselt werden. Bitte erneut versuchen.'}</Txt>}
    </ScrollView>
    <View style={s.actions}><Btn secondary disabled={locked} onPress={close}>Abbrechen</Btn><Btn disabled={locked||!enough} onPress={confirm}>{saving?'Wird gewechselt …':`Für ${n(cost)} M wechseln`}</Btn></View>
   </View>
  </SafeAreaView>
 </AppModal>;
}
const s=StyleSheet.create({overlay:{flex:1,justifyContent:'center',alignItems:'center',padding:16,backgroundColor:C.overlay},modal:{width:'100%',maxWidth:460,maxHeight:'90%',backgroundColor:C.panel,borderRadius:12,borderWidth:1,borderColor:C.line,overflow:'hidden'},heading:{flexDirection:'row',alignItems:'center',gap:12,padding:16,borderBottomWidth:1,borderBottomColor:C.line},title:{flex:1,minWidth:0,fontSize:20,lineHeight:27,fontWeight:'700'},content:{padding:16,gap:12},price:{flexDirection:'row',alignItems:'center',gap:10},amount:{fontSize:22,lineHeight:29,fontWeight:'700',flexShrink:1},actions:{padding:16,paddingTop:8,borderTopWidth:1,borderTopColor:C.line},error:{color:C.red,fontSize:12,lineHeight:18,marginTop:8}});
