import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,n} from './ui';
import {Icon} from './Icon';
import {Text} from './Language';
import {t} from './i18n';
import {rarityColor} from './items';
import {averageCardSpeed,rankNumeral} from './collectionStats';

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


// Collection-only compact values. Garage and detail views retain their full facts.
export function CollectionFacts({capacity,rank,loadedSpeed,emptySpeed,costPerKm}:{capacity:number;rank:{id?:string;label?:string;level:number;total:number};loadedSpeed?:number;emptySpeed?:number;costPerKm?:number}){
 const average=averageCardSpeed(loadedSpeed,emptySpeed),rankColor=rarityColor(rank.id||['common','uncommon','rare','epic','legendary'][Math.min(4,Math.floor(rank.total/10))]);
 const row=(label:string,icon:React.ReactNode,value:React.ReactNode)=><View accessible accessibilityLabel={label} style={collectionStyles.row}>{icon}{value}</View>;
 return <View style={collectionStyles.facts}>
  {row(`${t('Kapazität')}: ${n(capacity,1)} t`,<Icon name="orders" size={15} color={C.muted}/>,<Txt style={collectionStyles.value}>{n(capacity,1)} t</Txt>)}
  {row(`${t('Geschwindigkeitsrang')}: ${t(rank.label||rank.id||'Common')} ${rank.level}, ${rank.total} / 50`,<Text style={[collectionStyles.star,{color:rankColor}]}>★</Text>,<Text style={[collectionStyles.value,{color:rankColor}]}>{rankNumeral(rank.level)}</Text>)}
  {row(`${t('Durchschnittsgeschwindigkeit')}: ${average===undefined?'—':n(average,2)+' km/s'}`,<Icon name="timer" size={15} color={C.muted}/>,<Txt style={collectionStyles.value}>{average===undefined?'—':`${n(average,2)} km/s`}</Txt>)}
  {row(`${t('Betriebskosten')}: ${costPerKm===undefined?'—':n(costPerKm,2)+' M/km'}`,<Icon name="coin" size={15} color={C.muted}/>,<Txt style={collectionStyles.value}>{costPerKm===undefined?'—':`${n(costPerKm,2)} M/km`}</Txt>)}
 </View>;
}
const collectionStyles=StyleSheet.create({facts:{marginTop:8,gap:4},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:3,minHeight:20},value:{fontSize:10,lineHeight:15,fontWeight:'600',flexShrink:1,textAlign:'right'},star:{fontSize:18,lineHeight:20,width:15,textAlign:'center'}});
