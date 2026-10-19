import {Text} from './Language';
import {t as translate} from './i18n';
import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Row,Pill,n} from './ui';
import {Icon} from './Icon';
import {AtlasHeading} from './Atlas';
import {displayFont} from './theme';
import {rarityColor} from './items';


export function VehicleCards({data,onOpen}:any){
 const {state:g,catalog:c}=data;
 return <>
  <AtlasHeading title="Deine Sammlung" detail="Fahrzeugkarten und die Fähigkeiten deiner Flotte."/>
  <Row style={{marginBottom:14}}>{c.rarities.slice(0,3).map((r:any)=><Pill key={r.id}>{r.label}: {n(g.expedition.shards[r.id])}</Pill>)}</Row>
  <VehicleCardGrid data={data} cards={c.cards} onOpen={onOpen}/>
 </>;
}
export function VehicleCardGrid({data,cards,onOpen,statusForCard,disabled=false}:any){
 const {state:g,catalog:c}=data;
 const vehicle=(card:any)=>data.cardVehicles?.[card.id]||{capacity:c.models[card.vehicleTier].capacity,rank:{total:0,label:'Common',level:0}};
 const rows=Array.from({length:Math.ceil(cards.length/3)},(_,i)=>cards.slice(i*3,i*3+3));
 return <>
  {rows.map((row:any[],i:number)=><View key={i} style={styles.row}>{row.map(item=>{
   const owned=g.expedition.characters[item.id],stats=vehicle(item),status=statusForCard?.(item.id);
   return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={translate(`${item.name}, ${owned?`Stufe ${owned.level}`:'Nicht entdeckt'}, Geschwindigkeitsrang ${stats.rank.total}, ${n(stats.capacity,1)} Tonnen${status?.label?`, ${status.label}`:''}`)} accessibilityState={{disabled,selected:!!status?.selected}} disabled={disabled} onPress={()=>onOpen(item.id)} style={({pressed})=>[styles.card,{borderColor:rarityColor(item.rarity)},!owned&&{backgroundColor:C.raised,borderStyle:'dashed'},status?.selected&&{backgroundColor:C.greenWash},(pressed||disabled)&&{opacity:.7}]}>
    <Txt style={styles.level}>{owned?`Stufe ${owned.level}`:'Stufe —'}</Txt>
    <View style={styles.artwork}><Icon name="truck" size={32} color={rarityColor(item.rarity)}/><Text numberOfLines={3} ellipsizeMode="tail" style={styles.name}>{item.name.replace(/([a-zäöü])([A-ZÄÖÜ])/g,'$1\u00ad$2').replace(/Versorgungswagen/g,'Versorgungs\u00adwagen').replace(/Expeditionsträger/g,'Expeditions\u00adträger').replace(/Schrottsammler/g,'Schrott\u00adsammler')}</Text></View>
    <Txt style={styles.rank}>Rang {stats.rank.total}</Txt>
    <Txt style={styles.capacity}>{n(stats.capacity,1)} t</Txt>
    {statusForCard&&<View style={[styles.assignment,status?.label&&styles.assigned]}>{status?.label&&<Icon name="check" size={11} color={C.accent}/>}<Text numberOfLines={2} style={styles.assignmentText}>{status?.label||'Verfügbar'}</Text></View>}
   </Pressable>;
  })}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={[styles.card,{opacity:0}]}/>)}</View>)}

 </>;
}
const styles=StyleSheet.create({
 assignment:{minHeight:32,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3,borderRadius:3,paddingHorizontal:2,marginTop:5},assigned:{backgroundColor:C.greenWash},assignmentText:{flexShrink:1,fontSize:10,lineHeight:13,textAlign:'center',color:C.accent,fontWeight:'600'},
 row:{flexDirection:'row',gap:9,marginBottom:10},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:6,borderTopWidth:3,backgroundColor:C.panel,padding:7},
 level:{fontSize:11,fontWeight:'700',textAlign:'center',lineHeight:19,marginBottom:5},
 artwork:{width:'100%',aspectRatio:1,minHeight:90,backgroundColor:C.raised,borderColor:C.line,borderWidth:1,borderRadius:7,alignItems:'center',justifyContent:'center',padding:4},
 name:{width:'100%',flexShrink:1,fontFamily:displayFont,fontSize:11,lineHeight:14,textAlign:'center',color:C.text,marginTop:6},rank:{fontSize:11,lineHeight:18,textAlign:'center',marginTop:7,color:C.muted},capacity:{fontSize:13,lineHeight:20,fontWeight:'700',textAlign:'center'},
});
