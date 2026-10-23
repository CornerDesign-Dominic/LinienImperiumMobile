import React,{useRef,useState} from 'react';
import {Modal,View,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Row,Btn,Empty,n,remaining,minutes} from './ui';
import {Icon,IconName} from './Icon';
import {VehicleCardTile,RarityFilter} from './VehicleCards';
import {sortOrderVehicles,OrderSort} from './orderSelection';
import {t} from './i18n';

export function OrderVehiclePicker({data,choices,summary,busy,clock,onStart,onClose,modalBlocked=false}:any){
 const [selectedId,setSelectedId]=useState<string|null>(null),[sort,setSort]=useState<OrderSort>('profit'),[rarity,setRarity]=useState('all'),[sortOpen,setSortOpen]=useState(false),[starting,setStarting]=useState(false),[failed,setFailed]=useState(false);
 const pending=useRef(false);
 const selected=choices.find((q:any)=>q.id===selectedId&&q.free),locked=busy||starting;
 const cardFor=(q:any)=>data.catalog.cards.find((card:any)=>card.id===q.cardId)||{id:q.id,name:q.model,rarity:'common'};
 const ordered=sortOrderVehicles(choices,sort).filter(q=>rarity==='all'||cardFor(q).rarity===rarity);
 const rows=Array.from({length:Math.ceil(ordered.length/3)},(_,i)=>ordered.slice(i*3,i*3+3));
 const metric=(label:string,icon:IconName,value:string,profit=false)=><View accessible accessibilityLabel={`${t(label)}: ${value}`} style={s.metric}><Icon name={icon} size={14} color={C.muted}/><Txt style={[s.value,profit&&{color:C.accent}]}>{value}</Txt></View>;
 const start=async()=>{
  if(!selected||locked||pending.current)return;
  pending.current=true;setStarting(true);setFailed(false);
  try{if(await onStart(selected.id))onClose();else setFailed(true);}catch{setFailed(true);}finally{pending.current=false;setStarting(false);}
 };
 return <Modal visible={!modalBlocked} transparent animationType="none" onRequestClose={()=>{if(!starting)onClose();}}>
  <SafeAreaView edges={['top','bottom']} style={s.overlay}><View style={s.sheet}>
   <Row style={{flexWrap:'nowrap'}}><Txt style={s.title}>Fahrzeug wählen</Txt><Btn icon="close" iconOnly secondary disabled={starting} onPress={onClose}>Schließen</Btn></Row>
   <Txt muted style={s.summary}>{summary}</Txt>
   <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:selected?104:6}}>
    <View style={s.sortBox}><Btn secondary style={{marginTop:0}} onPress={()=>setSortOpen(!sortOpen)} endIcon="chevron" endIconRotation={sortOpen?270:90}>{sort==='profit'?'Sortieren: Gewinn':'Sortieren: Geschwindigkeit'}</Btn>
     {sortOpen&&<View><Btn secondary onPress={()=>{setSort('profit');setSortOpen(false);}}>Gewinn · höchster zuerst</Btn><Btn secondary onPress={()=>{setSort('speed');setSortOpen(false);}}>Geschwindigkeit · kürzeste Dauer</Btn></View>}
    </View>
    <RarityFilter data={data} rarity={rarity} onChange={(value:string)=>{setRarity(value);setSelectedId(null);setFailed(false);}}/>
    {failed&&<Txt style={{color:C.red,marginBottom:8}}>Auftrag konnte nicht gestartet werden. Bitte Auswahl prüfen und erneut versuchen.</Txt>}
    {rows.map((row,i)=><View key={i} style={s.row}>{row.map((q:any)=>{
     const card=cardFor(q),chosen=selected?.id===q.id;
     const status=q.free?(chosen?'Ausgewählt':'Verfügbar'):q.availableAt&&q.availableAt>clock?`${t('Frei in')} ${remaining(q.availableAt,clock)}`:q.availableAt?'Wird aktualisiert …':q.unavailableReason||'Im Einsatz';
     return <VehicleCardTile key={q.id} data={data} card={card} stats={q} showDetails disabled={locked} status={{disabled:!q.free,selected:chosen,label:q.free&&!chosen?'':status}} accessibilityLabel={`${t(q.model)}, ${q.id}, ${t('Touren')}: ${q.trips}, ${t('Dauer')}: ${minutes(q.seconds)}, ${t('Gewinn')}: ${n(q.totalProfit,2)} M, ${t(status)}`} onPress={()=>{if(q.free&&!locked){setSelectedId(q.id);setFailed(false);}}} facts={<View style={s.facts}>{metric('Touren','arrow',n(q.trips))}{metric('Dauer','timer',minutes(q.seconds))}{metric('Gewinn','coin',`${n(q.totalProfit,2)} M`,true)}</View>}/>;
    })}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`empty-${j}`} style={{flex:1}}/>)}</View>)}
    {!rows.length&&<Empty>{choices.length?'Keine Fahrzeugkarten dieser Seltenheit.':'Kein geeignetes Fahrzeug in der Garage.'}</Empty>}
   </ScrollView>
   {selected&&<View style={s.floating}><Txt style={s.chosen}>{selected.model} · {minutes(selected.seconds)} · {n(selected.totalProfit,2)} M</Txt><Btn disabled={locked} onPress={start} style={{marginTop:4}}>{starting?'Auftrag startet …':'Auftrag starten'}</Btn></View>}
  </View></SafeAreaView>
 </Modal>;
}
const s=StyleSheet.create({overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',paddingHorizontal:10},sheet:{width:'100%',maxWidth:520,maxHeight:'92%',alignSelf:'center',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:14,padding:10,overflow:'hidden'},title:{fontSize:17,fontWeight:'700',flex:1},summary:{fontSize:12,lineHeight:18,marginBottom:10},sortBox:{marginBottom:8},row:{flexDirection:'row',gap:4.5,marginBottom:5},facts:{marginTop:6,gap:4},metric:{minHeight:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:3},value:{fontSize:10,lineHeight:15,fontWeight:'700',textAlign:'right',flexShrink:1},floating:{position:'absolute',bottom:10,left:10,right:10,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:8,padding:8,boxShadow:'0px 2px 8px rgba(0,0,0,.2)'},chosen:{fontSize:11,lineHeight:16,textAlign:'center'}});
