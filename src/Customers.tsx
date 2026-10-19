import React,{useEffect,useState} from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Bar,Pill,Empty,Btn,n} from './ui';
const SKILLS=[{kind:'pay',label:'Frachtvergütung',limit:100},{kind:'special',label:'Sonderaufträge',limit:25},{kind:'referral',label:'Empfehlungen',limit:25}];
function Relationship({customer,trust}:any){
 return <><Bar value={customer.next?trust/customer.next*100:100}/><Row style={{marginBottom:0}}><Txt muted style={styles.small}>{n(trust)}{customer.next?` / ${n(customer.next)}`:''} Beziehung</Txt>{!customer.next&&<Txt muted style={styles.small}>Maximum</Txt>}</Row></>;
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
export function CustomerDetail({data,id,busy,onSave}:any){
 const customer=data.customers.find((c:any)=>c.id===id);
 const [draft,setDraft]=useState<Record<string,number>>({pay:0,special:0,referral:0});
 useEffect(()=>setDraft({pay:0,special:0,referral:0}),[id,customer?.skills.pay,customer?.skills.special,customer?.skills.referral]);
 if(!customer)return <Empty>Stammkunde noch nicht freigeschaltet.</Empty>;
 const assigned=Object.values(draft).reduce((a,b)=>a+b,0),left=customer.points-assigned;
 const editing=customer.points>0||assigned>0;
 const valid=assigned>0&&left>=0&&SKILLS.every(skill=>(customer.skills[skill.kind]||0)+draft[skill.kind]<=skill.limit);
 const region=data.expeditionMap.find((r:any)=>r.customer.id===id);
 const category=data.catalog.categories.find((c:any)=>c.id===customer.category);
 return <>
  <Card><Row><Txt style={[styles.title,{flex:1}]}>{customer.name}</Txt><Pill>Level {customer.level}</Pill></Row><Txt muted>{customer.industry}</Txt><Relationship customer={customer} trust={data.state.customerTrust[id]||0}/></Card>
  <Card><Row><Txt style={styles.title}>Fähigkeiten</Txt>{editing&&<Pill gold>{Math.max(0,left)} {left===1?'Punkt':'Punkte'}</Pill>}</Row>
   {SKILLS.map(skill=>{const level=customer.skills[skill.kind]||0,extra=draft[skill.kind],next=level+extra;return <View key={skill.kind} style={styles.skill}>
    <Txt style={{fontWeight:'700',marginBottom:6}}>{skill.label}</Txt>
    <Row style={{marginBottom:0,flexWrap:'nowrap'}}><View style={{flex:1,minWidth:0}}><Txt gold style={styles.small}>{skill.kind==='pay'?'Vergütung':'Chance'} +{n(next*.1,1)} %</Txt><Txt muted style={styles.small}>Stufe {level}{extra?` → ${next}`:''} / {skill.limit}</Txt></View>
     {editing&&<View style={{flexDirection:'row',alignItems:'center',gap:6}}>
      {extra>0&&<Pressable accessibilityRole="button" accessibilityLabel={`${skill.label} reduzieren`} accessibilityState={{disabled:busy||!extra}} disabled={busy||!extra} onPress={()=>setDraft(d=>({...d,[skill.kind]:d[skill.kind]-1}))} style={[styles.plus,(busy||!extra)&&{opacity:.4}]}><Txt style={{fontSize:20}}>−</Txt></Pressable>}
      {extra>0&&<Txt style={{fontSize:12,minWidth:18,textAlign:'center'}}>+{extra}</Txt>}
      <Pressable accessibilityRole="button" accessibilityLabel={`${skill.label} hinzufügen`} accessibilityState={{disabled:busy||left<=0||next>=skill.limit}} disabled={busy||left<=0||next>=skill.limit} onPress={()=>setDraft(d=>({...d,[skill.kind]:d[skill.kind]+1}))} style={[styles.plus,(busy||left<=0||next>=skill.limit)&&{opacity:.4}]}><Txt style={{fontSize:20}}>+</Txt></Pressable>
     </View>}
    </Row>
   </View>;})}
   {assigned>0&&<Btn disabled={busy||!valid} onPress={async()=>{const result=await onSave(id,draft,customer.skills);if(result?.customerBatchApplied)setDraft({pay:0,special:0,referral:0});}}>Speichern</Btn>}
  </Card>
  <Card><Row><Txt muted>Ware</Txt><Txt>{customer.cargo}</Txt></Row><Row><Txt muted>Verkehr</Txt><Txt>{category?.label||customer.category}</Txt></Row><Row style={{marginBottom:0}}><Txt muted>Herkunft</Txt><Txt>{region?.name||'Expedition'}</Txt></Row></Card>
 </>;
}
const styles=StyleSheet.create({summary:{backgroundColor:'#192534',borderColor:'#3B506A'},title:{fontSize:16,fontWeight:'700'},small:{fontSize:12,lineHeight:18},skill:{paddingVertical:14,borderBottomWidth:1,borderColor:C.line},plus:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:10}});
