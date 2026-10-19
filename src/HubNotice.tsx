import {t} from './i18n';
import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt} from './ui';
export function HubNotice({data,onOpen}:any){
 const hub=data.state.hubs[0];
 if(!hub)return null;
 const full=hub.cashboxCycles>=6;
 const last=hub.cashboxCycles===5&&data.state.trucks.some((t:any)=>t.tier<=1&&t.hubAssigned);
 if(!full&&!last)return null;
 return <Pressable accessibilityRole="button" accessibilityLabel={t(`Stadthub, ${full?'Kasse voll':'letzter Stundenzyklus'}`)} onPress={onOpen} style={[styles.card,full&&styles.full]}>
  <View style={styles.row}><Txt style={{fontSize:13,fontWeight:'700'}}>Stadthub</Txt><View style={styles.status}><Txt gold style={{fontSize:12}}>{full?'Kasse voll':'Letzte Stunde'}</Txt><Txt gold>›</Txt></View></View>
 </Pressable>;
}
const styles=StyleSheet.create({card:{paddingHorizontal:12,paddingVertical:10,marginBottom:12,borderWidth:1,borderColor:'#665538',borderRadius:12,backgroundColor:C.panel},full:{backgroundColor:'#30291F',borderColor:C.gold},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},status:{flexDirection:'row',alignItems:'center',gap:10}});
