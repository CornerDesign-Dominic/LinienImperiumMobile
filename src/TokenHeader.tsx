import {t as translate} from './i18n';
import {Text} from './Language';
import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,n} from './ui';
function cooldown(at:number|null|undefined,now:number){
 if(at===null)return 'Voll';
 if(at===undefined)return '—';
 const seconds=Math.max(0,Math.ceil((at-now)/1000));
 return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
}
export function TokenHeader({data,clock,onInventory}:any){
 const token=(name:string,value:number,capacity:number,next:number|null|undefined,color:string)=><>
  <Text style={s.label}>{name} <Text style={{color,fontWeight:'700'}}>{n(value)}/{n(capacity)}</Text></Text>
  <Text accessibilityLabel={translate(`${name} Regeneration`)} style={s.timer}>{next===null&&value>capacity?'Pausiert':cooldown(next,clock)}</Text>
 </>;
 return <View style={s.row}>
  <View style={s.token}>{token('Expedition',data?.state.expedition.points||0,data?.expeditionCapacity||50,data?.regeneration?.expeditionNextAt,C.brassLight)}</View>
  <Pressable accessibilityRole="button" onPress={onInventory} style={[s.token,{flex:1.15,justifyContent:'flex-end'}]}>{token('Überstunden',data?.state.overtimePoints||0,data?.state.overtimeCapacity||100,data?.regeneration?.overtimeNextAt,C.brassLight)}</Pressable>
 </View>;
}
const s=StyleSheet.create({row:{flexDirection:'row',gap:12},token:{flex:1,minWidth:0,flexDirection:'row',alignItems:'center',gap:4,minHeight:24},label:{fontSize:10,lineHeight:15,color:C.mutedOnInk,flexShrink:1,minWidth:0},timer:{fontSize:9,color:C.mutedOnInk,fontVariant:['tabular-nums'],flexShrink:0}});
