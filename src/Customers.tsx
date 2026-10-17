import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Bar,Pill,Empty,n} from './ui';
const SKILLS=[{kind:'pay',label:'Frachtvergütung',limit:100},{kind:'special',label:'Sonderaufträge',limit:25},{kind:'referral',label:'Empfehlungen',limit:25}];
function Relationship({customer,trust}:any){
 return <><Bar value={customer.next?trust/customer.next*100:100}/><Row style={{marginBottom:0}}><Txt muted style={styles.small}>{n(trust)}{customer.next?` / ${n(customer.next)}`:''} Beziehung</Txt><Txt muted style={styles.small}>{customer.next?`Level ${customer.level+1}`:'Maximum'}</Txt></Row></>;
}
export function CustomerList({data,onOpen}:any){
 if(!data.customers.length)return <Empty>Stammkunden über den Endlosort freischalten.</Empty>;
 return <>{data.customers.map((customer:any)=><Pressable key={customer.id} accessibilityRole="button" accessibilityLabel={`${customer.name}, Level ${customer.level}`} onPress={()=>onOpen(customer.id)}>
  <Card style={styles.summary}>
   <Row><Txt style={[styles.title,{flex:1}]}>{customer.name}</Txt><Txt muted>›</Txt></Row>
   <Row><Txt muted>{customer.industry}</Txt><Pill>Level {customer.level}</Pill></Row>
   <Relationship customer={customer} trust={data.state.customerTrust[customer.id]||0}/>
  </Card>
 </Pressable>)}</>;
}
export function CustomerDetail({data,id,busy,onUpgrade}:any){
 const customer=data.customers.find((c:any)=>c.id===id);
 if(!customer)return <Empty>Stammkunde noch nicht freigeschaltet.</Empty>;
 const region=data.expeditionMap.find((r:any)=>r.customer.id===id);
 const category=data.catalog.categories.find((c:any)=>c.id===customer.category);
 return <>
  <Card><Row><Txt style={[styles.title,{flex:1}]}>{customer.name}</Txt><Pill>Level {customer.level}</Pill></Row><Txt muted>{customer.industry}</Txt><Relationship customer={customer} trust={data.state.customerTrust[id]||0}/></Card>
  <Card><Row><Txt style={styles.title}>Fähigkeiten</Txt><Pill gold>{customer.points} {customer.points===1?'Punkt':'Punkte'}</Pill></Row>
   {SKILLS.map(skill=>{const level=customer.skills[skill.kind]||0,disabled=busy||!customer.points||level>=skill.limit;return <View key={skill.kind} style={styles.skill}>
    <Row style={{marginBottom:0,flexWrap:'nowrap'}}><View style={{flex:1}}><Txt style={{fontWeight:'700'}}>{skill.label}</Txt><Txt gold style={styles.small}>{skill.kind==='pay'?'Vergütung':'Chance'} +{n(level*.1,1)} %</Txt><Txt muted style={styles.small}>Stufe {level} / {skill.limit}</Txt></View><Pressable accessibilityRole="button" accessibilityLabel={`${skill.label} verbessern`} accessibilityState={{disabled}} disabled={disabled} onPress={()=>onUpgrade(id,skill.kind)} style={[styles.plus,disabled&&{opacity:.4}]}><Txt style={{fontSize:20}}>+</Txt></Pressable></Row>
   </View>;})}
   <Txt muted style={[styles.small,{marginTop:12}]}>1 Punkt je Verbesserung</Txt>
  </Card>
  <Card><Row><Txt muted>Ware</Txt><Txt>{customer.cargo}</Txt></Row><Row><Txt muted>Verkehr</Txt><Txt>{category?.label||customer.category}</Txt></Row><Row style={{marginBottom:0}}><Txt muted>Herkunft</Txt><Txt>{region?.name||'Expedition'}</Txt></Row></Card>
 </>;
}
const styles=StyleSheet.create({summary:{backgroundColor:'#192534',borderColor:'#3B506A'},title:{fontSize:16,fontWeight:'700'},small:{fontSize:12,lineHeight:18},skill:{paddingVertical:14,borderBottomWidth:1,borderColor:C.line},plus:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:10}});
