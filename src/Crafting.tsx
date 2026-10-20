import {Text} from './Language';
import {t as translate} from './i18n';
import React from 'react';
import {View,StyleSheet} from 'react-native';
import {stockItems} from './items';
import {Icon,stockIcon} from './Icon';
import {C,Txt,Card,Btn,n} from './ui';

type Recipe={id:string;inputId:string;outputId:string;input:string;output:string;needed:number;owned:number;outputOwned:number;inputColor?:string;outputColor?:string;action:string;payload?:Record<string,unknown>;locked?:boolean};
function Ingredient({id,name,amount,color,owned,insufficient=false}:any){
 return <View style={styles.item} accessible accessibilityLabel={translate(`${n(amount)} ${name}, ${n(owned)} vorhanden`)}>
  <Txt style={[styles.stock,insufficient&&{color:C.red}]}>{n(owned)} vorhanden</Txt>
  <View style={[styles.artwork,color&&{borderColor:color}]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name={stockIcon(id)} size={30} color={color||C.gold}/></View>
  <Txt style={[styles.amount,color&&{color}]}>{n(amount)}</Txt>
  <Text style={styles.name} numberOfLines={3}>{name}</Text>
 </View>;
}
export function Crafting({data,busy,onCommand}:any){
 const {catalog:c}=data;
 const stocks=new Map(stockItems(data).map(item=>[item.id,item]));
 const stockFor=(id:string)=>stocks.get(id)||stocks.get(`order:${id}`);
 const recipes:Recipe[]=(c.recipes||[]).map((r:any)=>{
  const input=stockFor(r.inputId),output=stockFor(r.outputId);
  return {...r,owned:input?.amount||0,outputOwned:output?.amount||0,inputColor:input?.color,outputColor:output?.color||C.gold,locked:r.id==='customer'&&!data.customers.length};
 });
 return <>{recipes.map(recipe=><Card key={recipe.id} style={styles.recipe}>
  <View style={styles.process}>
   <Ingredient id={recipe.inputId} name={recipe.input} amount={recipe.needed} owned={recipe.owned} color={recipe.inputColor} insufficient={recipe.owned<recipe.needed}/>
   <View accessible accessibilityLabel={translate('ergibt')} style={styles.arrow}><Icon name="chevron" size={25} color={C.accent}/></View>
   <Ingredient id={recipe.outputId} name={recipe.output} amount={1} owned={recipe.outputOwned} color={recipe.outputColor}/>
  </View>
  {recipe.locked&&<Txt muted style={styles.hint}>Stammkunde benötigt</Txt>}
  <Btn disabled={busy||recipe.owned<recipe.needed||recipe.locked} onPress={()=>onCommand(recipe.action,recipe.payload||{})}>Herstellung</Btn>
 </Card>)}</>;
}
const styles=StyleSheet.create({
 recipe:{backgroundColor:C.panel,borderColor:C.line,padding:14,marginBottom:12},
 process:{flexDirection:'row',alignItems:'center',gap:6},
 item:{flex:1,minWidth:0,alignItems:'center'},
 artwork:{width:52,height:52,backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:9,alignItems:'center',justifyContent:'center'},
 amount:{fontSize:18,lineHeight:24,fontWeight:'700',marginTop:5},
 name:{color:C.text,fontSize:12,lineHeight:16,textAlign:'center',minHeight:32,marginTop:2},
 stock:{fontSize:11,lineHeight:17,color:C.muted,marginBottom:5},
 arrow:{width:30,alignItems:'center'},
 hint:{fontSize:11,textAlign:'center',marginTop:6},
});
