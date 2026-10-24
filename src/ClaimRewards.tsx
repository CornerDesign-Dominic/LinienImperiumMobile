import {ItemArt,ItemAmount} from './ItemArt';
import React from 'react';
import {View,ScrollView,StyleSheet} from 'react-native';
import {Icon,IconName} from './Icon';
import {itemName,rarityColor} from './items';
import {C,Txt,n} from './ui';

type Summary={
 count:number;coins:number;gears:Record<string,number>;
 capacityModules:number;companyItems:number;supplierContacts:number;
};
type Reward={id:string;label:string;amount:number;icon:IconName;color:string};
export function ClaimRewards({summary,rarities}:{summary:Summary;rarities:{id:string;label:string}[]}){
 const rewards:Reward[]=[];
 if(summary.coins>0)rewards.push({id:'coins',label:'Münzen',amount:summary.coins,icon:'coin',color:C.gold});
 for(const rarity of rarities){
  const amount=summary.gears?.[rarity.id]||0;
  if(amount>0)rewards.push({id:`gear:${rarity.id}`,label:`${rarity.label}-${amount===1?'Zahnrad':'Zahnräder'}`,amount,icon:'gear',color:rarityColor(rarity.id)});
 }
 for(const [id,icon] of [['capacityModules','module'],['companyItems','company'],['supplierContacts','customers']] as const){
  const amount=summary[id]||0;
  if(amount>0)rewards.push({id,label:itemName(id,amount),amount,icon,color:C.accent});
 }
 const rows=Array.from({length:Math.ceil(rewards.length/3)},(_,index)=>rewards.slice(index*3,index*3+3));
 return <View style={styles.content}>
  <View style={styles.source}>
   <Txt muted style={styles.sourceText}>Einzelaufträge</Txt>
   <View style={styles.count}><Txt style={styles.sourceText}>{n(summary.count)} {summary.count===1?'Abschluss':'Abschlüsse'}</Txt></View>
  </View>
  <ScrollView style={styles.scroll} contentContainerStyle={styles.loot} showsVerticalScrollIndicator>
   {rows.map((row,index)=><View key={index} style={styles.row}>
    {row.map(reward=><View key={reward.id} style={[styles.item,{borderColor:reward.color}]}>
     <View style={styles.art}>{reward.id==='coins'?<Icon name="coin" size={38} color={reward.color}/>:<ItemArt id={reward.id} size={52}/>}</View>
     <Txt style={[styles.amount,{color:reward.color}]}>+{n(reward.amount,reward.id==='coins'?2:0)}</Txt>
     <Txt style={styles.label}>{reward.label}</Txt>
    </View>)}
    {Array.from({length:3-row.length},(_,index)=><View key={`empty-${index}`} style={styles.spacer}/>)}
   </View>)}
  </ScrollView>
 </View>;
}
const styles=StyleSheet.create({
 content:{flexShrink:1},
 source:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:16},
 sourceText:{fontSize:12},
 count:{backgroundColor:C.greenWash,paddingHorizontal:8,paddingVertical:5,borderRadius:8},
 scroll:{flexShrink:1,flexGrow:0},
 loot:{paddingBottom:4},
 row:{flexDirection:'row',gap:8,marginBottom:8},
 item:{flex:1,minWidth:0,padding:7,alignItems:'center',backgroundColor:C.raised,borderWidth:1,borderRadius:12},
 spacer:{flex:1,minWidth:0},
 art:{width:52,height:52,maxWidth:'100%',alignItems:'center',justifyContent:'center',backgroundColor:C.panel,borderRadius:10,marginBottom:5},
 amount:{fontSize:18,fontWeight:'800',textAlign:'center',marginBottom:4},
 label:{fontSize:10,lineHeight:14,minHeight:42,textAlign:'center'},
});
