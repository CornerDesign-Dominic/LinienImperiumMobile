import {Text} from './Language';
import {t} from './i18n';
import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,Card,Btn,n} from './ui';

type Recipe={id:string;input:string;output:string;needed:number;owned:number;color?:string;action:string;payload?:Record<string,unknown>;locked?:boolean};
function Ingredient({name,amount,color,owned}:any){
 return <View style={styles.item} accessible accessibilityLabel={t(`${n(amount)} ${name}${owned!=null?`, ${n(owned)} vorhanden`:''}`)}>
  <View style={[styles.artwork,color&&{borderColor:color}]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Txt muted style={styles.icon}>▧</Txt></View>
  <Txt style={[styles.amount,color&&{color}]}>{n(amount)}</Txt>
  <Text style={styles.name} numberOfLines={3}>{name}</Text>
  {owned!=null&&<Txt style={[styles.stock,owned<amount&&{color:C.red}]}>{n(owned)} vorhanden</Txt>}
 </View>;
}
export function Crafting({data,busy,onCommand}:any){
 const {state:g,catalog:c}=data;
 const recipes:Recipe[]=(c.recipes||[]).map((r:any)=>({...r,owned:r.inputId.startsWith('shard:')?g.expedition.shards[r.inputId.slice(6)]||0:g.inventory[r.inputId]||0,locked:r.id==='customer'&&!data.customers.length}));
 return <>{recipes.map(recipe=><Card key={recipe.id} style={styles.recipe}>
  <View style={styles.process}>
   <Ingredient name={recipe.input} amount={recipe.needed} owned={recipe.owned}/>
   <Text style={styles.arrow} accessibilityLabel={t('ergibt')}>➜</Text>
   <Ingredient name={recipe.output} amount={1} color={recipe.color}/>
  </View>
  {recipe.locked&&<Txt muted style={styles.hint}>Stammkunde benötigt</Txt>}
  <Btn disabled={busy||recipe.owned<recipe.needed||recipe.locked} onPress={()=>onCommand(recipe.action,recipe.payload||{})}>Herstellung</Btn>
 </Card>)}</>;
}
const styles=StyleSheet.create({recipe:{backgroundColor:'#192534',borderColor:'#3B506A'},process:{flexDirection:'row',alignItems:'center',gap:8},item:{flex:1,minWidth:0,alignItems:'center'},artwork:{width:58,height:58,backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:9,alignItems:'center',justifyContent:'center'},icon:{fontSize:25},amount:{fontSize:20,lineHeight:26,fontWeight:'700',marginTop:7},name:{color:C.text,fontSize:12,lineHeight:17,textAlign:'center',minHeight:34,marginTop:3},stock:{fontSize:11,lineHeight:17,color:C.muted,marginTop:3},arrow:{fontSize:30,fontWeight:'900',lineHeight:40,color:C.accent,width:34,textAlign:'center',alignSelf:'center',marginBottom:20},hint:{fontSize:11,textAlign:'center',marginTop:8}});
