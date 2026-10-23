import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {VehicleCardTile,VehicleCardPicker} from './VehicleCards';
import {VehicleCardDetail} from './VehicleCardDetail';
import {C,Txt,Row,Btn,Bar,n,remaining} from './ui';

export function Garage({data,busy,clock,onCommand,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null),[adding,setAdding]=useState(false),[saveFailed,setSaveFailed]=useState(false);
 const {state:g,catalog:c}=data;
 const regular=g.trucks.filter((t:any)=>!!t.cardId);
 const truck=g.trucks.find((t:any)=>t.id===selected);
 const tile=(t:any,index:number)=>{
  if(!t)return <Pressable accessibilityRole="button" accessibilityLabel={translate(`Garagenplatz ${index+1} hinzufügen`)} disabled={busy} onPress={()=>{setAdding(true);}} style={[styles.tile,styles.empty]}><Icon name="plus" size={28} color={C.muted}/></Pressable>;
  const card=c.cards.find((item:any)=>item.id===t.cardId);
  const stats=data.cardVehicles[t.cardId];
  return <VehicleCardTile data={data} card={card} stats={{...stats,capacity:t.capacity,speed:stats?.speed??t.speed,costPerKm:stats?.costPerKm??t.costPerKm}} showDetails onPress={()=>setSelected(t.id)}/>;
 };
 return <>
  {Array.from({length:4},(_,row)=><View key={row} style={styles.row}>{[0,1,2].map(col=>{const index=row*3+col;return <React.Fragment key={col}>{index<10?tile(regular[index],index):<View style={{flex:1,minWidth:0}}/>}</React.Fragment>;})}</View>)}
  <Modal transparent visible={(!!truck||adding)&&!modalBlocked} animationType="none" onRequestClose={()=>{setSelected(null);setAdding(false);setSaveFailed(false);}}>
   <View style={styles.overlay}><View style={styles.detail}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={styles.title}>{adding?(truck?'Fahrzeug wechseln':'Fahrzeug wählen'):truck?.model}</Txt><Btn icon="close" iconOnly secondary onPress={()=>{setSelected(null);setAdding(false);setSaveFailed(false);}}>Schließen</Btn></Row>
    {saveFailed&&<Txt style={{color:C.red,marginBottom:8}}>Änderung konnte nicht gespeichert werden. Bitte erneut versuchen.</Txt>}
    {adding&&truck&&<Btn secondary disabled={busy} onPress={()=>{setAdding(false);setSaveFailed(false);}}>Zurück</Btn>}
    <ScrollView keyboardShouldPersistTaps="handled">
     {adding?<VehicleCardPicker data={data} context="garage" busy={busy} onSelect={async(id:string)=>{
      if(busy||g.trucks.some((entry:any)=>entry.cardId===id))return;
      setSaveFailed(false);const result=await onCommand(truck?'garageReplace':'garageAdd',truck?{id:truck.cardId,replacement:id}:{id});
      if(result?.state.trucks.some((entry:any)=>entry.cardId===id)&&(!truck||!result.state.trucks.some((entry:any)=>entry.cardId===truck.cardId))){setAdding(false);setSelected(null);}else setSaveFailed(true);
     }}/>:truck&&<VehicleCardDetail key={truck.cardId} data={data} id={truck.cardId} compact modalBlocked={modalBlocked} busy={busy} extra={<>
      <Fact label="Gefahren" value={`${n(truck.kmDriven)} km`}/>
      <Fact label="Aufträge" value={n(truck.ordersCompleted)}/>
      <Fact label="Status" value={truck.procurementId?'Materialbeschaffung':truck.free?'Bereit':'Im Einsatz'}/>
      {!!truck.busyUntil&&<><Bar value={truck.progress}/><Txt gold>{remaining(truck.busyUntil,clock)}</Txt></>}
     </>} actions={<View style={{flexDirection:'row',gap:8}}>
      <Btn style={{flex:1}} disabled={busy||!truck.free} onPress={()=>{setSaveFailed(false);setAdding(true);}}>Wechseln</Btn>
      <Btn style={{flex:1}} secondary disabled={busy||!truck.free} onPress={async()=>{setSaveFailed(false);const result=await onCommand('garageRemove',{id:truck.cardId});if(result&&!result.state.trucks.some((t:any)=>t.id===truck.id))setSelected(null);else setSaveFailed(true);}}>Entfernen</Btn>
     </View>}/>}

    </ScrollView>
   </View></View>
  </Modal>
 </>;
}
function Fact({label,value}:any){return <Row style={{flexWrap:'nowrap'}}><Txt muted style={{flex:1}}>{label}</Txt><Txt>{value}</Txt></Row>;}
const styles=StyleSheet.create({
 row:{flexDirection:'row',gap:4.5,marginBottom:5},tile:{flex:1,minWidth:0,minHeight:200,padding:7,borderWidth:1,borderColor:C.line,borderRadius:6,backgroundColor:C.panel,justifyContent:'flex-start'},
 tileHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:4,marginBottom:9},level:{fontSize:10,fontWeight:'700'},fact:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:4},value:{fontSize:12,fontWeight:'600'},speed:{borderTopWidth:1,paddingTop:6,marginTop:7},speedLabel:{fontSize:10,lineHeight:15,marginBottom:3},
 name:{color:C.text,fontWeight:'700',fontSize:13,lineHeight:18,marginBottom:7,minHeight:54},capacity:{fontSize:18,fontWeight:'700',marginBottom:4},small:{fontSize:11,lineHeight:18},empty:{borderStyle:'dashed',backgroundColor:'transparent',alignItems:'center',justifyContent:'center'},plus:{fontSize:30,lineHeight:38,color:C.muted},
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},detail:{width:'100%',maxWidth:480,maxHeight:'85%',alignSelf:'center',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:16},title:{fontSize:17,fontWeight:'700',flex:1}
});
