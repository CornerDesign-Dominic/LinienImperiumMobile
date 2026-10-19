import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,n,remaining,Empty} from './ui';

export function HubVehicles({data,busy,clock,onCommand,onSell,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null);
 const {state:g,catalog:c}=data,vehicles=g.trucks.filter((t:any)=>!t.cardId);
 const truck=vehicles.find((t:any)=>t.id===selected);
 const fact=(label:string,value:string)=><Row><Txt muted>{label}</Txt><Txt>{value}</Txt></Row>;
 return <>
  {vehicles.map((t:any)=><Pressable key={t.id} accessibilityRole="button" accessibilityLabel={`${t.model}, ${t.id} verwalten`} onPress={()=>setSelected(t.id)}><Card><Row style={{marginBottom:3}}><Txt style={{fontWeight:'700'}}>{t.model}</Txt><Txt muted>›</Txt></Row><Txt muted>{n(t.capacity,1)} t · Rang {t.rarity.total}</Txt><Txt muted style={{fontSize:12}}>{t.hubAssigned?'Im Hub eingesetzt':t.free?'Bereit':'Im Einsatz'}</Txt></Card></Pressable>)}
  {!vehicles.length&&<Empty>Keine Stadttransporter</Empty>}
  <Modal visible={!!truck&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setSelected(null)}>
   <View style={styles.overlay}><View style={styles.detail}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={{fontSize:17,fontWeight:'700',flex:1}}>{truck?.model}</Txt><Btn secondary onPress={()=>setSelected(null)}>Schließen</Btn></Row>
    {truck&&<ScrollView keyboardShouldPersistTaps="handled">
     {fact('Kapazität',`${n(truck.capacity,1)} t`)}
     {fact('Geschwindigkeitsrang',`${truck.rarity.label} ${truck.rarity.level}`)}
     {fact('Geschwindigkeit',`${n(truck.speed,2)} km/s`)}
     {fact('Betriebskosten',`${n(truck.costPerKm,2)} M/km`)}
     {fact('Gefahren',`${n(truck.kmDriven)} km`)}
     {fact('Aufträge',n(truck.ordersCompleted))}
     {!!truck.busyUntil&&<><Bar value={truck.progress}/><Txt gold>{remaining(truck.busyUntil,clock)}</Txt></>}
     <Btn secondary disabled={busy||!g.inventory.capacityModules||(truck.moduleCapacityLevel||0)>=c.models[truck.tier].maxCapacityLevel} onPress={()=>onCommand('capacity',{id:truck.id})}>Kapazität +0,5 t · 1 Modul</Btn>
     <Btn secondary disabled={busy||g.inventory.gears[truck.rarity.id]<truck.rankCost||truck.rarity.total>=50} onPress={()=>onCommand('rank',{id:truck.id})}>Geschwindigkeitsrang · {n(truck.rankCost)} {truck.rarity.label}-Zahnräder</Btn>
     {truck.tier<=1&&<Btn secondary disabled={busy||(!truck.free&&!truck.hubAssigned)} onPress={()=>onCommand('hubTruck',{id:truck.id})}>{truck.hubAssigned?'Aus Hub nehmen':'Im Hub einsetzen'}</Btn>}
     {!!truck.sale&&<Btn secondary disabled={busy} onPress={()=>{setSelected(null);onSell(truck);}}>Verkaufen · {n(truck.sale.coins,2)} M</Btn>}
    </ScrollView>}
   </View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},detail:{width:'100%',maxWidth:480,maxHeight:'85%',alignSelf:'center',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:16}});

