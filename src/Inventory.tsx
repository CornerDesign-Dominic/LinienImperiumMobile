import {ItemArt} from './ItemArt';
import {Text} from './Language';
import {t as translate} from './i18n';
import React,{useRef,useState} from 'react';
import {View,Pressable,ScrollView,StyleSheet,useWindowDimensions} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Btn,Empty,n} from './ui';
import {stockItems} from './items';

export function Inventory({data,busy,onUseRefill,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null),[pending,setPending]=useState(false),[failed,setFailed]=useState(false);
 const inFlight=useRef(false),{width}=useWindowDimensions(),[gridWidth,setGridWidth]=useState(width-18);
 const {catalog:c}=data,items=stockItems(data);
 const owned=items.filter(item=>item.amount>0),item=items.find(item=>item.id===selected);
 const rows=Array.from({length:Math.ceil(owned.length/4)},(_,i)=>owned.slice(i*4,i*4+4));
 const artSize=Math.max(1,(gridWidth-24)/4),locked=busy||pending;
 const close=()=>{if(!inFlight.current)setSelected(null);};
 const useRefill=async()=>{
  if(!item?.refill||item.amount<1||locked||inFlight.current)return;
  inFlight.current=true;setPending(true);setFailed(false);
  try{const result=await onUseRefill(item.refill);if(result===null||result===false)setFailed(true);}
  catch{setFailed(true);}finally{inFlight.current=false;setPending(false);}
 };
 return <>
  <View onLayout={event=>setGridWidth(event.nativeEvent.layout.width)}>
   {!owned.length&&<Empty>Noch keine Vorräte.</Empty>}
   {rows.map((row,i)=><View key={i} style={styles.row}>{row.map(stock=><Pressable key={stock.id} accessibilityRole="button" accessibilityLabel={translate(`${stock.name}, ${n(stock.amount)} vorhanden`)} onPress={()=>{setFailed(false);setSelected(stock.id);}} style={({pressed})=>[styles.card,pressed&&{opacity:.7}]}>
    <ItemArt id={stock.id} kind={stock.kind} rarity={stock.rarity} size={artSize}/>
    <Text literal numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.55} style={[styles.amount,{fontSize:Math.max(8,Math.min(14,artSize/(n(stock.amount).length*.8)))}]}>{n(stock.amount)}</Text>
   </Pressable>)}{Array.from({length:4-row.length},(_,i)=><View key={`empty-${i}`} style={styles.card}/>)}</View>)}
  </View>
  <Modal visible={!!item&&!modalBlocked} transparent animationType="none" onRequestClose={close}>
   <SafeAreaView edges={['top','bottom']} style={styles.overlay}><View style={styles.detail} testID="inventory-item-detail">
    <View style={styles.header}><Txt style={styles.title}>{item?.name}</Txt><Btn icon="close" iconOnly secondary disabled={pending} style={styles.close} onPress={close}>Schließen</Btn></View>
    {item&&<ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
     <View style={styles.identity}><ItemArt id={item.id} kind={item.kind} rarity={item.rarity} size={88}/><Txt style={styles.stock}>{n(item.amount)} vorhanden</Txt></View>
     <Txt muted style={styles.label}>Verwendung</Txt><Txt style={styles.copy}>{item.description}</Txt>
     <Txt muted style={styles.label}>Herkunft</Txt><Txt muted style={styles.copy}>{item.source}</Txt>
     {failed&&<Txt style={styles.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>}
     {item.refill&&<Btn disabled={locked||item.amount<1} onPress={useRefill}>{pending?'Wird verwendet …':`Benutzen · +${c.refillPoints?.[item.refill]??50} ${item.refill==='expedition'?'Expeditionspunkte':'Überstundenpunkte'}`}</Btn>}
    </ScrollView>}
   </View></SafeAreaView>
  </Modal>
 </>;
}
const styles=StyleSheet.create({
 row:{flexDirection:'row',gap:8,marginBottom:8},card:{flex:1,minWidth:0,alignItems:'center'},amount:{width:'100%',color:C.text,fontSize:14,lineHeight:21,fontWeight:'700',textAlign:'center',marginTop:4},
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',paddingHorizontal:16,paddingVertical:16},detail:{width:'100%',maxWidth:440,maxHeight:'90%',backgroundColor:C.panel,borderRadius:12,borderWidth:1,borderColor:C.line,overflow:'hidden'},header:{flexDirection:'row',alignItems:'center',gap:10,padding:16,borderBottomWidth:1,borderBottomColor:C.line},title:{fontSize:18,lineHeight:25,fontWeight:'700',flex:1,minWidth:0},close:{flexShrink:0,marginTop:0},scroll:{flexShrink:1},content:{padding:16,paddingTop:12},identity:{alignItems:'center',gap:8,marginBottom:4},stock:{fontSize:15,lineHeight:22,fontWeight:'700'},label:{fontSize:11,fontWeight:'700',marginTop:14,marginBottom:4},copy:{fontSize:13,lineHeight:20},error:{color:C.red,fontSize:12,lineHeight:18,marginTop:12}
});
