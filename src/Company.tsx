import {itemName} from './items';
import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Pill,n} from './ui';
const LABELS:Record<string,string>={premium:'Abschlussprämie',volume:'Auftragsmenge',range:'Reichweite'};
export type UpgradeDraft=Record<string,number>;
export const upgradeKey=(o:any)=>`${o.category}:${o.kind}`;
export function upgradeQuote(options:any[],draft:UpgradeDraft){
 return options.reduce((sum,o)=>o.costs.slice(0,draft[upgradeKey(o)]||0).reduce((s:any,c:any)=>({coins:s.coins+c.coins,items:s.items+c.items}),sum),{coins:0,items:0});
}
function effect(o:any,level:number){
 if(o.kind==='premium')return `+${level} % Prämie`;
 if(o.kind==='volume')return `${o.base.minVolume+Math.floor(level/2)}–${o.base.maxVolume+level} t`;
 return `${o.base.minDistance}–${o.base.maxDistance+level} km`;
}
export function TransportSummary({data,onImprove}:any){
 return <Card style={styles.summary}>
  <Txt style={styles.title}>Transport</Txt>
  {['national','international'].map(category=><View key={category} style={styles.group}>
   <Txt style={styles.title}>{category==='national'?'Regionalverkehr':'Fernverkehr'}</Txt>
   {data.transportUpgradeOptions.filter((o:any)=>o.category===category).map((o:any)=><Row key={o.kind} style={{marginTop:7,marginBottom:0}}><Txt muted>{LABELS[o.kind]}</Txt><Txt>{effect(o,o.level)}</Txt></Row>)}
  </View>)}
  <Btn onPress={onImprove}>Verbessern</Btn>
 </Card>;
}
export function TransportEditor({data,draft,onDraft,busy,onSave,onInventory}:any){
 const options=data.transportUpgradeOptions,quote=upgradeQuote(options,draft),g=data.state;
 const count=Object.values(draft as UpgradeDraft).reduce((s,v)=>s+v,0);
 const invalid=options.some((o:any)=>(draft[upgradeKey(o)]||0)>o.costs.length);
 const afford=!invalid&&g.coins>=quote.coins&&g.inventory.companyItems>=quote.items;
 return <>
  <Card><Row><Txt>{itemName('companyItems',2)}</Txt><Txt gold>{n(g.inventory.companyItems)}</Txt></Row><Txt muted>Aus Aufträgen und Expeditionen.</Txt><Btn secondary onPress={onInventory}>Vorräte ›</Btn></Card>
  {['national','international'].map(category=><Card key={category}>
   <Txt style={styles.title}>{category==='national'?'Regionalverkehr':'Fernverkehr'}</Txt>
   {options.filter((o:any)=>o.category===category).map((o:any)=>{
    const key=upgradeKey(o),selected=draft[key]||0,next=o.costs[selected];
    const canAdd=!busy&&!!next&&g.coins>=quote.coins+next.coins&&g.inventory.companyItems>=quote.items+next.items;
    const change=(delta:number)=>onDraft((previous:UpgradeDraft)=>({...previous,[key]:Math.max(0,(previous[key]||0)+delta)}));
    return <View key={key} style={styles.upgrade}>
     <Row><Txt style={{fontWeight:'700'}}>{LABELS[o.kind]}</Txt><Txt muted style={{fontSize:12}}>{o.level}{selected?` → ${o.level+selected}`:''} / {o.limit}</Txt></Row>
     <Txt muted style={{fontSize:12}}>{effect(o,o.level)}{selected?` → ${effect(o,o.level+selected)}`:''}</Txt>
     <Row style={{marginTop:8,marginBottom:0,flexWrap:'nowrap'}}><Txt muted style={{fontSize:12,flex:1}}>{next?`${n(next.coins)} M · ${next.items} Items`:'Maximum'}</Txt><View style={styles.stepper}>
      <Pressable accessibilityRole="button" accessibilityLabel={`${category==='national'?'Regionalverkehr':'Fernverkehr'} ${LABELS[o.kind]} verringern`} accessibilityState={{disabled:busy||!selected}} disabled={busy||!selected} onPress={()=>change(-1)} style={[styles.step,!selected&&styles.disabled]}><Txt>−</Txt></Pressable>
      <Txt gold style={{minWidth:24,textAlign:'center'}}>+{selected}</Txt>
      <Pressable accessibilityRole="button" accessibilityLabel={`${category==='national'?'Regionalverkehr':'Fernverkehr'} ${LABELS[o.kind]} erhöhen`} accessibilityState={{disabled:!canAdd}} disabled={!canAdd} onPress={()=>change(1)} style={[styles.step,!canAdd&&styles.disabled]}><Txt>+</Txt></Pressable>
     </View></Row>
    </View>;
   })}
  </Card>)}
  <Card><Row><Txt>Gesamt</Txt><Pill>{count} Stufen</Pill></Row><Txt gold>{n(quote.coins)} M · {quote.items} Items</Txt>{!afford&&<Txt style={{color:C.red,marginTop:6}}>Münzen oder Items fehlen.</Txt>}<Btn disabled={busy||!count||!afford} onPress={()=>onSave(options.filter((o:any)=>draft[upgradeKey(o)]).map((o:any)=>({category:o.category,kind:o.kind,count:draft[upgradeKey(o)],level:o.level})))}>Speichern</Btn></Card>
 </>;
}
const styles=StyleSheet.create({summary:{backgroundColor:C.panel,borderColor:C.line},title:{fontSize:16,fontWeight:'700'},group:{paddingVertical:14,borderBottomWidth:1,borderColor:C.line,marginBottom:4},upgrade:{paddingVertical:14,borderBottomWidth:1,borderColor:C.line},stepper:{flexDirection:'row',alignItems:'center',gap:8},step:{minWidth:44,minHeight:44,borderWidth:1,borderColor:C.line,borderRadius:10,alignItems:'center',justifyContent:'center'},disabled:{opacity:.4}});

