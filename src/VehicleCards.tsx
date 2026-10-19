import React from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Row,Pill,n} from './ui';
import {rarityColor} from './items';


export function VehicleCards({data,onOpen}:any){
 const {state:g,catalog:c}=data;
 const vehicle=(card:any)=>data.cardVehicles?.[card.id]||{capacity:c.models[card.vehicleTier].capacity,rank:{total:0,label:'Common',level:0}};
 const rows=Array.from({length:Math.ceil(c.cards.length/3)},(_,i)=>c.cards.slice(i*3,i*3+3));
 return <>
  <Row style={{marginBottom:14}}>{c.rarities.slice(0,3).map((r:any)=><Pill key={r.id}>{r.label}: {n(g.expedition.shards[r.id])}</Pill>)}</Row>
  {rows.map((row:any[],i:number)=><View key={i} style={styles.row}>{row.map(item=>{
   const owned=g.expedition.characters[item.id],stats=vehicle(item);
   return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.name}, ${owned?`Stufe ${owned.level}`:'Nicht entdeckt'}, Geschwindigkeitsrang ${stats.rank.total}, ${n(stats.capacity,1)} Tonnen`} onPress={()=>onOpen(item.id)} style={({pressed})=>[styles.card,{borderColor:rarityColor(item.rarity)},!owned&&{opacity:.5},pressed&&{opacity:.7}]}>
    <Txt style={styles.level}>{owned?`Stufe ${owned.level}`:'Stufe —'}</Txt>
    <View style={styles.artwork}><Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>{item.name}</Text></View>
    <Txt style={styles.rank}>Rang {stats.rank.total}</Txt>
    <Txt style={styles.capacity}>{n(stats.capacity,1)} t</Txt>
   </Pressable>;
  })}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={{flex:1}}/>)}</View>)}

 </>;
}
const styles=StyleSheet.create({
 row:{flexDirection:'row',gap:9,marginBottom:10},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:12,backgroundColor:C.panel,padding:7},
 level:{fontSize:11,fontWeight:'700',textAlign:'center',lineHeight:19,marginBottom:5},
 artwork:{width:'100%',aspectRatio:1,backgroundColor:C.raised,borderColor:C.line,borderWidth:1,borderRadius:7,alignItems:'center',justifyContent:'center',padding:4},
 name:{width:'100%',flexShrink:1,fontSize:11,lineHeight:15,textAlign:'center',color:C.muted},rank:{fontSize:11,lineHeight:18,textAlign:'center',marginTop:7,color:C.muted},capacity:{fontSize:13,lineHeight:20,fontWeight:'700',textAlign:'center'},
});
