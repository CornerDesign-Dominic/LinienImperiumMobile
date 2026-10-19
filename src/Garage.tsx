import {Text} from './Language';
import {t} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {C,Txt,Row,Btn,Bar,n,remaining} from './ui';

export function Garage({data,busy,clock,onCommand,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null),[adding,setAdding]=useState(false);
 const {state:g,catalog:c}=data;
 const regular=g.trucks.filter((t:any)=>!!t.cardId);
 const truck=g.trucks.find((t:any)=>t.id===selected);
 const available=c.cards.filter((card:any)=>g.expedition.characters[card.id]&&!g.trucks.some((t:any)=>t.cardId===card.id));
 const tile=(t:any,index:number)=>t?<Pressable accessibilityRole="button" accessibilityLabel={t(`Garagenplatz ${index+1}: ${t.model}`)} onPress={()=>setSelected(t.id)} style={styles.tile}>
  <Text numberOfLines={2} style={styles.name}>{t.model}</Text>
  <Txt style={styles.capacity}>{n(t.capacity,1)} t</Txt>
  <Txt muted style={styles.small}>Stufe {g.expedition.characters[t.cardId]?.level||1}</Txt>
  <Txt muted style={styles.small}>Geschw.-Rang {t.rarity.total}</Txt>
 </Pressable>:<Pressable accessibilityRole="button" accessibilityLabel={t(`Garagenplatz ${index+1} hinzufügen`)} disabled={busy} onPress={()=>setAdding(true)} style={[styles.tile,styles.empty]}><Txt style={styles.plus}>+</Txt></Pressable>;
 return <>
  {Array.from({length:5},(_,row)=><View key={row} style={styles.row}>{[0,1].map(col=><React.Fragment key={col}>{tile(regular[row*2+col],row*2+col)}</React.Fragment>)}</View>)}
  <Modal transparent visible={(!!truck||adding)&&!modalBlocked} animationType="none" onRequestClose={()=>{setSelected(null);setAdding(false);}}>
   <View style={styles.overlay}><View style={styles.detail}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={styles.title}>{adding?'Fahrzeug wählen':truck?.model}</Txt><Btn secondary onPress={()=>{setSelected(null);setAdding(false);}}>Schließen</Btn></Row>
    <ScrollView keyboardShouldPersistTaps="handled">
     {adding?available.length?available.map((card:any)=><Btn key={card.id} secondary disabled={busy} onPress={async()=>{const result=await onCommand('garageAdd',{id:card.id});if(result?.state.trucks.some((t:any)=>t.cardId===card.id))setAdding(false);}}>{card.name} · {n(data.cardVehicles[card.id].capacity,1)} t</Btn>):<Txt muted>Keine freien Karten</Txt>:truck&&<>
      <Fact label="Kapazität" value={`${n(truck.capacity,1)} t`}/>
      <Fact label="Stufe" value={g.expedition.characters[truck.cardId]?.level||1}/>
      <Fact label="Geschwindigkeitsrang" value={`${truck.rarity.label} · ${truck.rarity.level} ★`}/>
      <Fact label="Geschwindigkeit" value={`${n(truck.speed,2)} km/s`}/>
      <Fact label="Betriebskosten" value={`${n(truck.costPerKm,2)} M/km`}/>
      <Fact label="Gefahren" value={`${n(truck.kmDriven)} km`}/>
      <Fact label="Aufträge" value={n(truck.ordersCompleted)}/>
      <Fact label="Status" value={truck.free?'Bereit':'Im Einsatz'}/>
      {!!truck.busyUntil&&<><Bar value={truck.progress}/><Txt gold>{remaining(truck.busyUntil,clock)}</Txt></>}
      <Btn secondary disabled={busy||!truck.free} onPress={async()=>{const result=await onCommand('garageRemove',{id:truck.cardId});if(result&&!result.state.trucks.some((t:any)=>t.id===truck.id))setSelected(null);}}>Aus Garage nehmen</Btn>
     </>}
    </ScrollView>
   </View></View>
  </Modal>
 </>;
}
function Fact({label,value}:any){return <Row style={{flexWrap:'nowrap'}}><Txt muted style={{flex:1}}>{label}</Txt><Txt>{value}</Txt></Row>;}
const styles=StyleSheet.create({
 row:{flexDirection:'row',gap:10,marginBottom:10},tile:{flex:1,minWidth:0,minHeight:142,padding:12,borderWidth:1,borderColor:C.line,borderRadius:14,backgroundColor:C.panel,justifyContent:'center'},
 name:{color:C.text,fontWeight:'700',fontSize:14,lineHeight:19,marginBottom:7},capacity:{fontSize:18,fontWeight:'700',marginBottom:4},small:{fontSize:11,lineHeight:18},empty:{borderStyle:'dashed',backgroundColor:'transparent',alignItems:'center'},plus:{fontSize:30,lineHeight:38,color:C.muted},
 overlay:{flex:1,backgroundColor:'#000B',justifyContent:'center',padding:18},detail:{width:'100%',maxWidth:480,maxHeight:'85%',alignSelf:'center',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:16},title:{fontSize:17,fontWeight:'700',flex:1}
});
