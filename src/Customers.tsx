import {t as translate} from './i18n';
import {Icon} from './Icon';
import React,{useEffect,useState} from 'react';
import {Image,View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Pill,Empty,Btn,n} from './ui';
import {regionIdentities} from './regionIdentities';
import {portraitForPlace} from './placePortraits';
const SKILLS=[{kind:'pay',label:'Frachtvergütung',limit:100},{kind:'special',label:'Sonderaufträge',limit:25},{kind:'referral',label:'Empfehlungen',limit:25}];
function CustomerScene({customer,detail=false}:{customer:any;detail?:boolean}){
 const index=regionIdentities.findIndex(identity=>identity.id===customer.id),identity=regionIdentities[index];
 const source=portraitForPlace(index,7),available=customer.points>0;
 return <View testID={`customer-scene-${customer.id}`} style={[styles.scene,detail&&styles.detailScene]}>
  {source&&<Image testID={`customer-place-${customer.id}`} source={source} resizeMode="cover" accessible={false} style={[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]}/>}
  <View accessible accessibilityLabel={`${translate(`Level ${customer.level}`)}${available?`, ${translate('Fähigkeitspunkte verfügbar')}`:''}`} style={styles.level}>
   <Txt style={styles.levelText}>Level {customer.level}</Txt>
   {available&&<View testID={`customer-points-${customer.id}`} style={styles.pointDot}/>}
  </View>
  <View style={styles.caption}>
   <Txt numberOfLines={2} style={[styles.name,detail&&styles.detailName]}>{customer.name}</Txt>
   <Txt numberOfLines={1} style={styles.region}>{identity?.title||customer.regionName}</Txt>
  </View>
 </View>;
}
export function CustomerList({data,onOpen}:any){
 if(!data.customers.length)return <Empty>Stammkunden über den Endlosort freischalten.</Empty>;
 return <>{data.customers.map((customer:any)=><Pressable key={customer.id} accessibilityRole="button" accessibilityLabel={`${translate(customer.name)}, ${translate(`Level ${customer.level}`)}${customer.points>0?`, ${translate('Fähigkeitspunkte verfügbar')}`:''}`} onPress={()=>onOpen(customer.id)} style={({pressed})=>[styles.summary,pressed&&{opacity:.8}]}>
  <CustomerScene customer={customer}/>
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
  <View style={styles.summary}><CustomerScene customer={customer} detail/></View>
  <Card><Row><Txt style={styles.title}>Fähigkeiten</Txt>{editing&&<Pill gold>{Math.max(0,left)} {left===1?'Punkt':'Punkte'}</Pill>}</Row>
   {SKILLS.map(skill=>{const level=customer.skills[skill.kind]||0,extra=draft[skill.kind],next=level+extra;return <View key={skill.kind} style={styles.skill}>
    <Txt style={{fontWeight:'700',marginBottom:6}}>{skill.label}</Txt>
    <Row style={{marginBottom:0,flexWrap:'nowrap'}}><View style={{flex:1,minWidth:0}}><Txt gold style={styles.small}>{skill.kind==='pay'?'Vergütung':'Chance'} +{n(next*.1,1)} %</Txt>{editing&&next<skill.limit&&<Txt muted style={styles.small}>+0,1 % je Punkt</Txt>}<Txt muted style={styles.small}>Stufe {level}{extra?` → ${next}`:''} / {skill.limit}</Txt></View>
     {editing&&<View style={{flexDirection:'row',alignItems:'center',gap:6}}>
      {extra>0&&<Pressable accessibilityRole="button" accessibilityLabel={translate(`${skill.label} reduzieren`)} accessibilityState={{disabled:busy||!extra}} disabled={busy||!extra} onPress={()=>setDraft(d=>({...d,[skill.kind]:d[skill.kind]-1}))} style={[styles.plus,(busy||!extra)&&{opacity:.4}]}><Icon name="minus" size={18}/></Pressable>}
      {extra>0&&<Txt style={{fontSize:12,minWidth:18,textAlign:'center'}}>+{extra}</Txt>}
      <Pressable accessibilityRole="button" accessibilityLabel={translate(`${skill.label} hinzufügen`)} accessibilityState={{disabled:busy||left<=0||next>=skill.limit}} disabled={busy||left<=0||next>=skill.limit} onPress={()=>setDraft(d=>({...d,[skill.kind]:d[skill.kind]+1}))} style={[styles.plus,(busy||left<=0||next>=skill.limit)&&{opacity:.4}]}><Icon name="plus" size={18}/></Pressable>
     </View>}
    </Row>
   </View>;})}
   {assigned>0&&<Btn disabled={busy||!valid} onPress={async()=>{const result=await onSave(id,draft,customer.skills);if(result?.customerBatchApplied)setDraft({pay:0,special:0,referral:0});}}>Speichern</Btn>}
  </Card>
  <Card><Row><Txt muted>Ware</Txt><Txt>{customer.cargo}</Txt></Row><Row><Txt muted>Verkehr</Txt><Txt>{category?.label||customer.category}</Txt></Row><Row style={{marginBottom:0}}><Txt muted>Herkunft</Txt><Txt>{customer.regionName||region?.name||'Expedition'}</Txt></Row></Card>
 </>;
}
const styles=StyleSheet.create({summary:{backgroundColor:C.ink,borderColor:C.line,borderWidth:1,borderRadius:6,overflow:'hidden',marginBottom:10},
 scene:{height:118,backgroundColor:C.ink,overflow:'hidden'},detailScene:{height:200},
 level:{position:'absolute',top:9,right:9,paddingHorizontal:8,paddingVertical:3,borderWidth:1,borderColor:C.brass,borderRadius:5,backgroundColor:'#F2E8D0'},
 levelText:{fontSize:11,lineHeight:16,fontWeight:'700',color:C.ink},pointDot:{position:'absolute',right:-4,top:-4,width:9,height:9,borderRadius:5,backgroundColor:C.accent,borderWidth:1.5,borderColor:'#F2E8D0'},
 caption:{position:'absolute',bottom:0,left:0,right:0,paddingHorizontal:11,paddingVertical:7,backgroundColor:'rgba(17,34,35,.82)'},
 name:{fontSize:14,lineHeight:18,fontWeight:'700',color:C.onInk},detailName:{fontSize:18,lineHeight:23},region:{fontSize:11,lineHeight:15,color:C.brassLight,marginTop:1},title:{fontSize:16,fontWeight:'700'},small:{fontSize:12,lineHeight:17},skill:{paddingVertical:12,borderBottomWidth:1,borderColor:C.line},plus:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:10}});
