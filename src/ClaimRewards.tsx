import {ItemArt} from './ItemArt';
import {Text} from './Language';
import React,{useState} from 'react';
import {View,ScrollView,StyleSheet} from 'react-native';
import {Icon,IconName} from './Icon';
import {itemName,rarityColor} from './items';
import {C,Txt,n} from './ui';

type Summary={
 count?:number;source?:string;pickupHints?:number;hubVehicleParts?:number;coins:number;gears:Record<string,number>;
 capacityModules:number;companyItems:number;supplierContacts:number;
};
type Reward={id:string;label:string;amount:number;icon:IconName;color:string};
export function ClaimRewards({summary,rarities}:{summary:Summary;rarities:{id:string;label:string}[]}){
 const [contentWidth,setContentWidth]=useState(240);
 const rewards:Reward[]=[];
 if(summary.coins>0)rewards.push({id:'coins',label:'Münzen',amount:summary.coins,icon:'coin',color:C.gold});
 for(const rarity of rarities){
  const amount=summary.gears?.[rarity.id]||0;
  if(amount>0)rewards.push({id:`gear:${rarity.id}`,label:`${rarity.label}-${amount===1?'Zahnrad':'Zahnräder'}`,amount,icon:'gear',color:rarityColor(rarity.id)});
 }
 for(const [id,icon] of [['capacityModules','module'],['companyItems','company'],['supplierContacts','customers'],['pickupHints','document'],['hubVehicleParts','crafting']] as const){
  const amount=summary[id]||0;
  if(amount>0)rewards.push({id,label:itemName(id,amount),amount,icon,color:C.accent});
 }
 const amountText=(reward:Reward)=>`+${n(reward.amount,reward.id==='coins'?2:0)}`;
 const amountWidth=(reward:Reward)=>Math.min(144,Math.max(64,amountText(reward).length>8?contentWidth*.4:64));
 return <View onLayout={event=>setContentWidth(event.nativeEvent.layout.width)} style={styles.content}>
  <View style={styles.source}>
   <Txt muted style={styles.sourceText}>{summary.source||'Einzelaufträge'}</Txt>
   {summary.count!==undefined&&<View style={styles.count}><Txt style={styles.sourceText}>{n(summary.count)} {summary.count===1?'Abschluss':'Abschlüsse'}</Txt></View>}
  </View>
  <ScrollView testID="claim-reward-list" style={styles.scroll} contentContainerStyle={styles.loot} showsVerticalScrollIndicator>
   {rewards.map((reward,index)=><View key={reward.id} testID={`claim-reward-${reward.id}`} style={[styles.row,index>0&&styles.separator]}>
    <View style={styles.art}>{reward.id==='coins'?<Icon name="coin" size={52}/>:<ItemArt id={reward.id} size={52}/>}</View>
    <Txt style={styles.label}>{reward.label}</Txt>
    <View style={[styles.amountColumn,{width:amountWidth(reward)}]}>
     <Text literal numberOfLines={1} style={[styles.amount,{color:reward.color,fontSize:Math.min(17,(amountWidth(reward)-2)/(amountText(reward).length*.65))}]}>{amountText(reward)}</Text>
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
 amountColumn:{maxWidth:144,minWidth:64,flexShrink:0,alignSelf:'center'},
 amount:{fontWeight:'800',textAlign:'right',fontVariant:['tabular-nums']},
 label:{flex:1,minWidth:0,fontSize:13,lineHeight:18},
});
