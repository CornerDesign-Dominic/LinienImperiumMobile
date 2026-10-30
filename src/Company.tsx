import {ItemArt} from './ItemArt';
import {t as translate} from './i18n';
import {Icon,IconName} from './Icon';
import React,{useEffect,useRef,useState} from 'react';
import {ScrollView,View,Pressable,StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {C,Txt,Card,Row,Btn,n} from './ui';
const LABELS:Record<string,string>={premium:'Abschlussprämie',volume:'Auftragsmenge',range:'Reichweite'};
const ICONS:Record<string,IconName>={premium:'reward',volume:'truck',range:'expedition'};
const categoryName=(category:string)=>category==='national'?'Nahverkehr':'Fernverkehr';
export type UpgradeDraft=Record<string,number>;
export const upgradeKey=(o:any)=>`${o.category}:${o.kind}`;
export function upgradeQuote(options:any[],draft:UpgradeDraft){
 return options.reduce((sum,o)=>o.costs.slice(0,draft[upgradeKey(o)]||0).reduce((s:any,c:any)=>({coins:s.coins+c.coins,items:s.items+c.items}),sum),{coins:0,items:0});
}
const effectNumber=(value:number)=>n(value,Number.isInteger(value)?0:1);
function effect(o:any,level:number){
 if(o.kind==='premium')return `+${level} % Prämie`;
 if(o.kind==='volume')return `${effectNumber(o.base.minVolume+Math.floor(level*(o.step??1)/2))}–${effectNumber(o.base.maxVolume+level*(o.step??1))} t`;
 return `${effectNumber(o.base.minDistance)}–${effectNumber(o.base.maxDistance+level*(o.step??1))} km`;
}
export function TransportSummary({data,onImprove}:any){
 return <Card style={styles.summary}>
  <Txt style={styles.title}>Transport</Txt>
  {['national','international'].map(category=><View key={category} style={styles.group}>
   <Txt style={styles.title}>{categoryName(category)}</Txt>
   {data.transportUpgradeOptions.filter((o:any)=>o.category===category).map((o:any)=><Row key={o.kind} style={{marginTop:7,marginBottom:0}}><Txt muted>{LABELS[o.kind]}</Txt><Txt>{effect(o,o.level)}</Txt></Row>)}
  </View>)}
  <Btn onPress={onImprove}>Verbessern</Btn>
 </Card>;
}
export function TransportEditor({data,busy,onSave,onInventory}:any){
 const [category,setCategory]=useState('national');
 const [selection,setSelection]=useState<{key:string;level:number;count:number}|null>(null);
 const [saveError,setSaveError]=useState(false);
 const saving=useRef(false);
 const options=data.transportUpgradeOptions,g=data.state,items=g.inventory.companyItems;
 const active=options.find((o:any)=>upgradeKey(o)===selection?.key);
 const stale=!!active&&active.level!==selection?.level;
 const count=selection?.count||1;
 const quote=active?upgradeQuote([active],{[upgradeKey(active)]:count}):{coins:0,items:0};
 const maximum=!!active&&(active.level>=active.limit||!active.costs.length);
 const affordable=!!active&&!maximum&&!stale&&count<=active.costs.length&&g.coins>=quote.coins&&items>=quote.items;
 const next=active?.costs[count];
 const canAdd=affordable&&!!next&&g.coins>=quote.coins+next.coins&&items>=quote.items+next.items;
 // A server refresh can change a level while the sheet is open. Requote from that level.
 useEffect(()=>{if(stale&&!saving.current){setSelection(previous=>previous?{...previous,level:active.level,count:1}:null);setSaveError(false);}},[stale,active?.level]);
 const close=()=>{if(!busy&&!saving.current){setSelection(null);setSaveError(false);}};
 const save=async()=>{
  if(!affordable||busy||saving.current)return;
  saving.current=true;setSaveError(false);
  try{
   const result=await onSave([{category:active.category,kind:active.kind,count,level:active.level}]);
   if(result?.transportBatchApplied)setSelection(null);else setSaveError(true);
  }catch{setSaveError(true);}finally{saving.current=false;}
 };
 return <>
  <View style={styles.stock}>
   <View style={styles.stockValue}><ItemArt id="companyItems" size={32}/><Txt gold style={{fontWeight:'700'}}>{n(items)}</Txt><Txt muted style={{fontSize:12}}>verfügbar</Txt></View>
   <Pressable accessibilityRole="button" onPress={onInventory} style={styles.stockLink}><Txt style={{fontSize:12}}>Vorräte</Txt><Icon name="chevron" size={14}/></Pressable>
  </View>
  <View accessibilityRole="tablist" style={styles.tabs}>{['national','international'].map(value=><Pressable key={value} accessibilityRole="tab" accessibilityState={{selected:category===value}} onPress={()=>setCategory(value)} style={[styles.tab,category===value&&styles.tabActive]}><Txt style={[styles.tabText,category===value&&{color:C.onInk}]}>{categoryName(value)}</Txt></Pressable>)}</View>
  <Card style={{padding:0,overflow:'hidden'}}>{options.filter((o:any)=>o.category===category).map((o:any,index:number)=>{
   const cost=o.costs[0],max=o.level>=o.limit||!cost,canImprove=!max&&g.coins>=cost.coins&&items>=cost.items;
   return <Pressable key={upgradeKey(o)} accessibilityRole="button" accessibilityLabel={`${translate(LABELS[o.kind])}, ${translate(effect(o,o.level))}, ${translate(`Stufe ${o.level} / ${o.limit}`)}, ${translate(max?'Maximum':canImprove?'Verbesserung verfügbar':'Details')}`} onPress={()=>{setSelection({key:upgradeKey(o),level:o.level,count:1});setSaveError(false);}} style={({pressed})=>[styles.upgradeRow,index>0&&styles.divider,pressed&&{backgroundColor:C.raised}]}>
    <View style={styles.upgradeIcon}><Icon name={ICONS[o.kind]} size={25}/></View>
    <View style={{flex:1,minWidth:0}}><Txt style={{fontWeight:'700'}}>{LABELS[o.kind]}</Txt><Txt style={{fontSize:13,marginTop:2}}>{effect(o,o.level)}</Txt><Txt muted style={{fontSize:11}}>Stufe {o.level} / {o.limit}{max?' · Maximum':''}</Txt></View>
    {canImprove&&<View style={styles.availableDot}/>}
    <Icon name="chevron" size={17} color={C.muted}/>
   </Pressable>;
  })}</Card>
  <Modal visible={!!active} transparent animationType="fade" onRequestClose={close}>
   <View style={styles.overlay}><View accessibilityViewIsModal style={styles.modal}>
    <View style={styles.modalHeader}><View style={{flex:1}}><Txt muted style={{fontSize:11}}>{categoryName(active?.category)}</Txt><Txt style={[styles.title,{fontSize:20}]}>{active?LABELS[active.kind]:''}</Txt></View><Btn iconOnly icon="close" secondary disabled={busy} onPress={close}>Schließen</Btn></View>
    {active&&<><ScrollView style={{flexShrink:1}} contentContainerStyle={{padding:18,paddingTop:0}}>
     <Txt muted style={{fontSize:12,marginBottom:12}}>Stufe {active.level} / {active.limit}</Txt>
     <View style={styles.comparison}><View style={styles.effectColumn}><Txt muted style={styles.caption}>Aktuell</Txt><Txt style={styles.effect}>{effect(active,active.level)}</Txt></View>{!maximum&&<><Icon name="arrow" size={19} color={C.gold}/><View style={[styles.effectColumn,styles.after]}><Txt muted style={styles.caption}>Nach Ausbau</Txt><Txt style={[styles.effect,{color:C.accent}]}>{effect(active,active.level+count)}</Txt></View></>}</View>
     {!maximum&&<><View style={styles.quantity}><Txt>Stufen</Txt><View style={styles.stepper}>
      <Btn iconOnly secondary icon="minus" disabled={busy||count<=1} onPress={()=>{setSelection(previous=>previous?{...previous,count:previous.count-1}:null);setSaveError(false);}}>Stufen verringern</Btn>
      <Txt style={{minWidth:30,textAlign:'center',fontWeight:'700'}}>{count}</Txt>
      <Btn iconOnly secondary icon="plus" disabled={busy||!canAdd} onPress={()=>{setSelection(previous=>previous?{...previous,count:previous.count+1}:null);setSaveError(false);}}>Stufen erhöhen</Btn>
     </View></View>
     <Txt muted style={styles.caption}>Gesamtkosten</Txt>
     <View style={styles.costs}><View style={styles.cost}><Icon name="coin" size={22} color={g.coins<quote.coins?C.red:C.gold}/><Txt style={{color:g.coins<quote.coins?C.red:C.text,fontWeight:'700'}}>{n(quote.coins)} M</Txt></View><View style={styles.cost}><ItemArt id="companyItems" size={36}/><Txt style={{color:items<quote.items?C.red:C.text,fontWeight:'700'}}>{quote.items} / {n(items)}</Txt></View></View>
     {!affordable&&!stale&&<Txt style={styles.error}>{g.coins<quote.coins?'Nicht genügend Münzen.':'Nicht genügend Firmenausbau-Items.'}</Txt>}
     {saveError&&<Txt style={styles.error}>Ausbau nicht bestätigt. Bitte erneut versuchen.</Txt>}</>}
     {maximum&&<Txt style={{color:C.accent,marginTop:14}}>Maximale Stufe erreicht.</Txt>}
    </ScrollView><View style={styles.modalFooter}><Btn disabled={busy||maximum||!affordable} onPress={save}>{busy?'Wird verbessert …':maximum?'Maximum':`Für ${n(quote.coins)} M verbessern`}</Btn></View></>}
   </View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({
 summary:{backgroundColor:C.panel,borderColor:C.line},title:{fontSize:16,fontWeight:'700'},group:{paddingVertical:12,borderBottomWidth:1,borderColor:C.line,marginBottom:4},
 stock:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10},stockValue:{flexDirection:'row',alignItems:'center',gap:7,flexShrink:1,flexWrap:'wrap'},stockLink:{flexDirection:'row',alignItems:'center',gap:4,minHeight:44,paddingHorizontal:4},
 tabs:{flexDirection:'row',gap:6,marginBottom:10},tab:{flex:1,minHeight:44,padding:8,borderWidth:1,borderColor:C.line,borderRadius:6,justifyContent:'center',alignItems:'center',backgroundColor:C.raised},tabActive:{backgroundColor:C.accent,borderColor:C.ink},tabText:{fontSize:13,fontWeight:'700',textAlign:'center'},
 upgradeRow:{flexDirection:'row',alignItems:'center',gap:10,padding:14,minHeight:100},divider:{borderTopWidth:1,borderColor:C.line},upgradeIcon:{width:38,height:42,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderRadius:6},availableDot:{width:7,height:7,borderRadius:4,backgroundColor:C.accent,flexShrink:0},
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:16},modal:{width:'100%',maxWidth:460,maxHeight:'90%',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,overflow:'hidden'},modalHeader:{flexDirection:'row',alignItems:'center',gap:8,padding:18},modalFooter:{padding:18,paddingTop:4,borderTopWidth:1,borderColor:C.line},
 comparison:{flexDirection:'row',alignItems:'center',gap:8},effectColumn:{flex:1,minWidth:0,padding:10,borderRadius:6,backgroundColor:C.raised},after:{backgroundColor:C.greenWash},caption:{fontSize:11,marginBottom:4},effect:{fontSize:15,fontWeight:'700'},quantity:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginVertical:18},stepper:{flexDirection:'row',alignItems:'center',gap:8},costs:{flexDirection:'row',gap:12,flexWrap:'wrap',marginVertical:5},cost:{flexDirection:'row',alignItems:'center',gap:6,paddingVertical:6},error:{fontSize:12,color:C.red,marginTop:10}
});
