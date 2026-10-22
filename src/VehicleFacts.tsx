import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,n} from './ui';
import {Icon} from './Icon';
import {t} from './i18n';
import {averageCardSpeed} from './collectionStats';

// Legacy detailed fact layout; compact card tiles use CollectionFacts below.
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


// Shared compact values for collection and garage cards.
export function CollectionFacts({capacity,loadedSpeed,emptySpeed,costPerKm}:{capacity:number;loadedSpeed?:number;emptySpeed?:number;costPerKm?:number}){
 const average=averageCardSpeed(loadedSpeed,emptySpeed);
 const row=(label:string,icon:React.ReactNode,value:React.ReactNode)=><View accessible accessibilityLabel={label} style={collectionStyles.row}>{icon}{value}</View>;
 return <View style={collectionStyles.facts}>
  {row(`${t('Kapazität')}: ${n(capacity,1)} t`,<Icon name="orders" size={15} color={C.muted}/>,<Txt style={collectionStyles.value}>{n(capacity,1)} t</Txt>)}
  {row(`${t('Durchschnittsgeschwindigkeit')}: ${average===undefined?'—':n(average,2)+' km/s'}`,<Icon name="timer" size={15} color={C.muted}/>,<Txt style={collectionStyles.value}>{average===undefined?'—':`${n(average,2)} km/s`}</Txt>)}
  {row(`${t('Betriebskosten')}: ${costPerKm===undefined?'—':n(costPerKm,2)+' M/km'}`,<Icon name="coin" size={15} color={C.muted}/>,<Txt style={collectionStyles.value}>{costPerKm===undefined?'—':`${n(costPerKm,2)} M/km`}</Txt>)}
 </View>;
}
const collectionStyles=StyleSheet.create({facts:{marginTop:8,gap:4},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:3,minHeight:20},value:{fontSize:10,lineHeight:15,fontWeight:'600',flexShrink:1,textAlign:'right'}});
