import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,n} from './ui';

// The same order and grouping in the garage and the collection.
export function VehicleFacts({capacity,rank,loadedSpeed,emptySpeed,color=C.line,freeModules,compact=false}:{
 capacity:number;rank:number;loadedSpeed?:number;emptySpeed?:number;color?:string;freeModules?:number;compact?:boolean;
}){
 const fact=(label:string,value:string)=><View style={s.fact}><Txt muted style={[s.label,compact&&s.compact]}>{label}</Txt><Txt style={[s.value,compact&&s.compact]}>{value}</Txt></View>;
 return <View>
  {fact('Kapazität',`${n(capacity,1)} t`)}
  {freeModules!==undefined&&fact('Module frei',n(freeModules))}
  <View style={[s.speed,{borderTopColor:color}]}>
   {fact(compact?'Geschw.-Rang':'Geschwindigkeitsrang',`${rank} / 50`)}
   {fact('Beladen',loadedSpeed===undefined?'—':`km/s ${n(loadedSpeed,2)}`)}
   {fact('Leer',emptySpeed===undefined?'—':`km/s ${n(emptySpeed,2)}`)}
  </View>
 </View>;
}
const s=StyleSheet.create({
 fact:{flexDirection:'row',flexWrap:'wrap',alignItems:'baseline',justifyContent:'space-between',columnGap:5,marginBottom:3},
 label:{fontSize:11,lineHeight:17,flexShrink:1},value:{fontSize:12,lineHeight:17,fontWeight:'600',textAlign:'right',marginLeft:'auto'},
 compact:{fontSize:10,lineHeight:15},
 speed:{marginTop:10,paddingTop:8,borderTopWidth:1},
});
