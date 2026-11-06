import {ItemArt} from './ItemArt';
import {Text} from './Language';
import React from 'react';
import {View,ScrollView,StyleSheet} from 'react-native';
import {Icon,IconName} from './Icon';
import {itemName,rarityColor} from './items';
import {C,Txt,n} from './ui';

type Summary={
 count?:number;customerTrust?:number;hermes?:number;seasonPoints?:number;specialOrders?:number;customerOrders?:number;expeditionRefills?:number;overtimeRefills?:number;xp?:number;shards?:Record<string,number>;source?:string;pickupHints?:number;hubVehicleParts?:number;coins:number;gears:Record<string,number>;
 capacityModules:number;companyItems:number;supplierContacts:number;
};
type Reward={id:string;label:string;amount:number;icon:IconName;color:string};
export function ClaimRewards({summary,rarities}:{summary:Summary;rarities:{id:string;label:string}[]}){
 const rewards:Reward[]=[];
 if((summary.hermes||0)>0)rewards.push({id:'hermes',label:'Hermes-Siegel',amount:summary.hermes!,icon:'hermes',color:C.gold});
 if((summary.seasonPoints||0)>0)rewards.push({id:'seasonPoints',label:'Saisonpunkte',amount:summary.seasonPoints!,icon:'xp',color:C.accent});
 if((summary.specialOrders||0)>0)rewards.push({id:'project:special',label:'Sonderaufträge',amount:summary.specialOrders!,icon:'projects',color:C.gold});
 if((summary.customerOrders||0)>0)rewards.push({id:'order:customer',label:'Kundenaufträge',amount:summary.customerOrders!,icon:'customers',color:C.accent});
 if(summary.coins>0)rewards.push({id:'coins',label:'Imperium-Taler',amount:summary.coins,icon:'coin',color:C.gold});
 if((summary.xp||0)>0)rewards.push({id:'xp',label:'XP',amount:summary.xp!,icon:'xp',color:C.accent});
 if((summary.customerTrust||0)>0)rewards.push({id:'customerTrust',label:'Beziehungspunkte',amount:summary.customerTrust!,icon:'customers',color:C.accent});
 for(const rarity of rarities){
  const amount=summary.gears?.[rarity.id]||0;
  if(amount>0)rewards.push({id:`gear:${rarity.id}`,label:`${rarity.label}-${amount===1?'Zahnrad':'Zahnräder'}`,amount,icon:'gear',color:rarityColor(rarity.id)});
 }
 for(const rarity of rarities){const amount=summary.shards?.[rarity.id]||0;if(amount>0)rewards.push({id:`shard:${rarity.id}`,label:`${rarity.label}-Splitter`,amount,icon:'cards',color:rarityColor(rarity.id)});}
 for(const [id,icon] of [['capacityModules','module'],['companyItems','company'],['supplierContacts','customers'],['pickupHints','document'],['hubVehicleParts','crafting'],['expeditionRefills','expedition'],['overtimeRefills','overtime']] as const){
  const amount=summary[id]||0;
  if(amount>0)rewards.push({id,label:itemName(id,amount),amount,icon,color:C.accent});
 }
 const amountText=(reward:Reward)=>`+${n(reward.id==='coins'?Math.round(reward.amount):reward.amount,reward.id==='xp'?2:0)}`;
 return <View style={styles.content}>
  <View style={styles.source}>
   <Txt muted style={styles.sourceText}>{summary.source||'Einzelaufträge'}</Txt>
   {summary.count!==undefined&&<View style={styles.count}><Txt style={styles.sourceText}>{n(summary.count)} {summary.count===1?'Abschluss':'Abschlüsse'}</Txt></View>}
  </View>
  <ScrollView testID="claim-reward-list" style={styles.scroll} contentContainerStyle={styles.loot} showsVerticalScrollIndicator>
   {rewards.map((reward,index)=><View key={reward.id} testID={`claim-reward-${reward.id}`} style={[styles.row,index>0&&styles.separator]}>
    <View style={styles.art}>{(['coins','xp','hermes','seasonPoints','customerTrust'].includes(reward.id))?<Icon name={reward.icon} size={52}/>:<ItemArt id={reward.id} size={52}/>}</View>
    <View style={styles.rewardCopy}>
     <Txt style={styles.label}>{reward.label}</Txt>
     <Text literal style={[styles.amount,{color:reward.color}]}>{amountText(reward)}</Text>
    </View>
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
 row:{flexDirection:'row',alignItems:'flex-start',gap:8,paddingVertical:10,minHeight:72},
 separator:{borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:C.line},
 art:{width:52,height:52,flexShrink:0,alignItems:'center',justifyContent:'center'},
 rewardCopy:{flex:1,minWidth:0,gap:4},
 amount:{fontSize:17,lineHeight:23,fontWeight:'800',textAlign:'right',fontVariant:['tabular-nums']},
 label:{minWidth:0,fontSize:13,lineHeight:18},
});
