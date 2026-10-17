import React,{useState} from 'react';
import {View,Text,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Row,Btn,Pill,Empty,n} from './ui';

type StockItem={id:string;name:string;label?:string;amount:number;source:string;description:string;recipe?:string;craft?:boolean;use?:string;refill?:boolean;color?:string};
export function Inventory({data,busy,onNavigate,onUseRefill}:any){
 const [selected,setSelected]=useState<string|null>(null);
 const {state:g,catalog:c}=data;
 const items:StockItem[]=[
  {id:'refill',name:'Überstunden-Refill',label:'Token-Refill',amount:g.inventory.overtimeRefills||0,source:'1 Paket je Levelaufstieg.',description:'Gibt 100 Überstundenpunkte – auch über das Maximum hinaus.',refill:true,color:C.gold},
  {id:'capacity',name:'Kapazitätsmodul',label:'Kapazitäts-\nmodul',amount:g.inventory.capacityModules,source:'Beim Freilegen eines Endlosorts und als seltene Auftragsbeute.',description:'Erhöht die Kapazität eines Fahrzeugs um 0,5 t.',use:'garage'},
  {id:'company',name:'Firmenausbau-Item',label:'Firmen-Item',amount:g.inventory.companyItems,source:'1 Item je 750.000 beladene tkm aus normalen Aufträgen. Auch aus Materialaufträgen.',description:`Für Firmenausbau und Kundenaufträge. ${n(g.inventory.companyItemTkmRemainder)} / 750.000 tkm zum nächsten Item.`,recipe:`${c.craftedOrderItems} Items → 1 Kundenauftrag`,craft:true,use:'company'},
  {id:'hints',name:'Abholhinweis',label:'Abhol-\nhinweis',amount:g.inventory.pickupHints,source:'Aus der Kasse des Stadthubs abholen.',description:'Material für Privatabholungen.',recipe:'100 Hinweise → 1 Privatabholung',craft:true},
  {id:'contacts',name:'Lieferantenkontakt',label:'Lieferanten-\nkontakt',amount:g.inventory.supplierContacts,source:'Abschlussprämien aus Privatabholungen.',description:'Für den Ausbau des Stadthub-Vertriebs.',use:'hub'},
  ...c.rarities.map((r:any)=>({id:`gear:${r.id}`,name:`${r.label}-Zahnrad`,amount:g.inventory.gears[r.id]||0,source:'Abschlussprämien aus Transportaufträgen. Die Seltenheit hängt vom Auftrag ab.',description:'Für den nächsten Geschwindigkeitsrang eines Fahrzeugs.',use:'garage',color:r.id==='legendary'||r.id==='epic'?C.gold:r.id==='common'?C.muted:C.accent})),
  ...c.rarities.slice(0,3).map((r:any,i:number)=>({id:`shard:${r.id}`,name:`${r.label}-Shard`,amount:g.expedition.shards[r.id]||0,source:'Kartenaufträge, Materialaufträge und doppelte Fahrzeugkarten derselben Seltenheit.',description:'Steigert die Kartenstufe und den einzigartigen Fahrzeugbonus.',...(i?{recipe:`10 ${c.rarities[i-1].label}-Shards → 1 ${r.label}-Shard`}:{}),craft:true,use:'cards',color:i===2?C.gold:i===1?C.accent:C.muted}))
 ];
 const owned=items.filter(item=>item.amount>0),item=items.find(item=>item.id===selected);
 const rows=Array.from({length:Math.ceil(owned.length/3)},(_,i)=>owned.slice(i*3,i*3+3));
 const navigate=(screen:string)=>{setSelected(null);onNavigate(screen);};
 return <>
  {!owned.length&&<Empty>Noch keine Vorräte.</Empty>}
  {rows.map((row,i)=><View key={i} style={styles.row}>{row.map(stock=><Pressable key={stock.id} accessibilityRole="button" accessibilityLabel={`${stock.name}, ${n(stock.amount)} vorhanden`} onPress={()=>setSelected(stock.id)} style={({pressed})=>[styles.card,{borderColor:stock.color||C.line},pressed&&{opacity:.7}]}>
   <View style={styles.artwork} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Txt muted style={{fontSize:25}}>▧</Txt></View>
   <Text numberOfLines={3} style={styles.name}>{stock.label||stock.name}</Text><Txt style={styles.amount}>{n(stock.amount)}</Txt>
  </Pressable>)}{Array.from({length:3-row.length},(_,i)=><View key={`empty-${i}`} style={{flex:1}}/>)}</View>)}
  <Modal visible={!!item} transparent animationType="none" onRequestClose={()=>setSelected(null)}>
   <View style={styles.overlay}><SafeAreaView edges={['bottom']} style={styles.detail}>
    <Row><Txt style={styles.title}>{item?.name}</Txt><Btn secondary onPress={()=>setSelected(null)}>Schließen</Btn></Row>
    {item&&<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:12}}>
     <Pill>{n(item.amount)} vorhanden</Pill>
     <Txt style={{marginTop:16}}>{item.description}</Txt>
     <Txt muted style={styles.label}>Herkunft</Txt><Txt muted>{item.source}</Txt>
     {item.recipe&&<><Txt muted style={styles.label}>Herstellung</Txt><Txt>{item.recipe}</Txt></>}
     {item.craft&&<Btn secondary disabled={busy} onPress={()=>navigate('crafting')}>Herstellen ›</Btn>}
     {item.use&&<Btn disabled={busy||item.amount<1} onPress={()=>navigate(item.use!)}>Benutzen ›</Btn>}
     {item.refill&&<Btn disabled={busy||item.amount<1} onPress={onUseRefill}>Benutzen · +100 Tokens</Btn>}
    </ScrollView>}
   </SafeAreaView></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({row:{flexDirection:'row',gap:9,marginBottom:10},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:12,backgroundColor:C.panel,padding:7},artwork:{width:'100%',aspectRatio:1,backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:7,alignItems:'center',justifyContent:'center'},name:{color:C.muted,fontSize:11,lineHeight:15,textAlign:'center',minHeight:45,marginTop:7},amount:{fontSize:15,lineHeight:22,fontWeight:'700',textAlign:'center',marginTop:3},overlay:{flex:1,backgroundColor:'#000B',justifyContent:'flex-end'},detail:{maxHeight:'85%',backgroundColor:C.panel,borderTopLeftRadius:20,borderTopRightRadius:20,padding:20},title:{fontSize:17,fontWeight:'700',flex:1},label:{fontSize:11,fontWeight:'700',marginTop:16,marginBottom:4}});
