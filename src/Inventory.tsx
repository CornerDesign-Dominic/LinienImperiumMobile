import {Text} from './Language';
import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Row,Btn,Pill,Empty,n} from './ui';

import {Icon,stockIcon} from './Icon';
import {stockItems} from './items';
export function Inventory({data,busy,onNavigate,onUseRefill,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null);
 const {state:g,catalog:c}=data;
 const items=stockItems(data);
 const owned=items.filter(item=>item.amount>0),item=items.find(item=>item.id===selected);
 const rows=Array.from({length:Math.ceil(owned.length/3)},(_,i)=>owned.slice(i*3,i*3+3));
 const navigate=(screen:string)=>{setSelected(null);onNavigate(screen);};
 return <>
  {!owned.length&&<Empty>Noch keine Vorräte.</Empty>}
  {rows.map((row,i)=><View key={i} style={styles.row}>{row.map(stock=><Pressable key={stock.id} accessibilityRole="button" accessibilityLabel={translate(`${stock.name}, ${n(stock.amount)} vorhanden`)} onPress={()=>setSelected(stock.id)} style={({pressed})=>[styles.card,{borderColor:stock.color||C.line},pressed&&{opacity:.7}]}>
   <View style={styles.artwork} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Icon name={stockIcon(stock.id)} size={38} color={stock.color||C.gold}/></View>
   <Text numberOfLines={3} style={styles.name}>{stock.name.replace(/Expeditionsauffüller/g,'Expeditions\u00adauffüller').replace(/Überstundenauffüller/g,'Überstunden\u00adauffüller').replace(/Kapazitätsmodul/g,'Kapazitäts\u00admodul').replace(/Firmenausbau/g,'Firmen\u00adausbau').replace(/Abholhinweis/g,'Abhol\u00adhinweis').replace(/Lieferantenkontakt/g,'Lieferanten\u00adkontakt').replace(/Fahrzeugkartenauftrag/g,'Fahrzeug\u00adkarten\u00adauftrag').replace(/Empfehlungsauftrag/g,'Empfehlungs\u00adauftrag').replace(/Sonderauftrag/g,'Sonder\u00adauftrag')}</Text><Txt style={styles.amount}>{n(stock.amount)}</Txt>
  </Pressable>)}{Array.from({length:3-row.length},(_,i)=><View key={`empty-${i}`} style={{flex:1}}/>)}</View>)}
  <Modal visible={!!item&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setSelected(null)}>
   <View style={styles.overlay}><SafeAreaView edges={['bottom']} style={styles.detail}>
    <Row><Txt style={styles.title}>{item?.name}</Txt><Btn icon="close" secondary onPress={()=>setSelected(null)}>Schließen</Btn></Row>
    {item&&<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:12}}>
     <Pill>{n(item.amount)} vorhanden</Pill>
     <Txt style={{marginTop:16}}>{item.description}</Txt>
     <Txt muted style={styles.label}>Herkunft</Txt><Txt muted>{item.source}</Txt>
     {item.recipe&&<><Txt muted style={styles.label}>Herstellung</Txt><Txt>{item.recipe}</Txt></>}
     {item.craft&&<Btn secondary disabled={busy} onPress={()=>navigate('crafting')}>{item.recipe?'Herstellen ›':'In Herstellung verwenden ›'}</Btn>}
     {(item.id==='capacityModules'||item.id.startsWith('gear:'))&&<><Btn endIcon="chevron" disabled={busy} onPress={()=>navigate('cards')}>Zur Sammlung</Btn><Btn endIcon="chevron" secondary disabled={busy} onPress={()=>navigate('hub')}>Zum Stadthub</Btn></>}
     {item.use&&<Btn endIcon="chevron" disabled={busy||item.amount<1} onPress={()=>navigate(item.use!)}>Benutzen</Btn>}
     {item.refill&&<Btn disabled={busy||item.amount<1} onPress={()=>onUseRefill(item.refill)}>Benutzen · +{c.refillPoints?.[item.refill]??50} {item.refill==='expedition'?'Expeditionspunkte':'Überstundenpunkte'}</Btn>}
    </ScrollView>}
   </SafeAreaView></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({row:{flexDirection:'row',gap:9,marginBottom:10},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:12,backgroundColor:C.panel,padding:7},artwork:{width:'100%',aspectRatio:1,backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:7,alignItems:'center',justifyContent:'center'},name:{color:C.muted,fontSize:10,lineHeight:15,textAlign:'center',minHeight:45,marginTop:7},amount:{fontSize:15,lineHeight:22,fontWeight:'700',textAlign:'center',marginTop:3},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'flex-end'},detail:{maxHeight:'85%',backgroundColor:C.panel,borderTopLeftRadius:20,borderTopRightRadius:20,padding:20},title:{fontSize:17,fontWeight:'700',flex:1},label:{fontSize:11,fontWeight:'700',marginTop:16,marginBottom:4}});
