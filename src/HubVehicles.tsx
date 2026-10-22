import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {itemName} from './items';
import {C,Txt,Card,Row,Btn,n,remaining,Empty} from './ui';

export function HubParts({data,busy,clock,onCommand,modalBlocked=false}:any){
 const [found,setFound]=useState<number|null>(null),c=data.hubInfo.crates;
 return <Card>
  <Row><Txt style={{fontWeight:'700'}}>Fundkisten</Txt><Txt muted>{c.opened} / 3</Txt></Row>
  <Row><Icon name="crafting" color={C.gold} size={24}/><Txt>{itemName('hubVehicleParts',2)} · {n(data.state.inventory.hubVehicleParts)}</Txt></Row>
  <Txt muted style={{fontSize:11}}>3 täglich · 30 Minuten Abstand · Tageswechsel 00:00 UTC</Txt>
  {!c.available&&<Txt muted style={{fontSize:12,marginTop:5}}>Nächste Kiste {remaining(c.nextAt,clock)}</Txt>}
  <Btn disabled={busy||!c.available} onPress={async()=>{const next=await onCommand('hubCrate');if(next?.hubCrateParts)setFound(next.hubCrateParts);}}>Fundkiste öffnen</Btn>
  <Modal visible={found!==null&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setFound(null)}>
   <View style={styles.overlay}><View style={styles.detail}>
    <Row><Txt style={{fontWeight:'700',flex:1}}>Fundkiste geöffnet</Txt><Btn icon="close" iconOnly secondary onPress={()=>setFound(null)}>Schließen</Btn></Row>
    <View style={{alignItems:'center',padding:16}}><Icon name="crafting" color={C.gold} size={52}/><Txt style={{fontSize:24,fontWeight:'700',marginTop:12}}>+{found}</Txt><Txt>{itemName('hubVehicleParts',2)}</Txt></View>
   </View></View>
  </Modal>
 </Card>;
}
export function HubVehicles({data,busy,onCommand,onSell,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null);
 const g=data.state,vehicles=g.trucks.filter((t:any)=>!t.cardId&&t.tier<=1),truck=vehicles.find((t:any)=>t.id===selected);
 const fact=(label:string,value:string)=><Row><Txt muted style={{fontSize:12,flex:1}}>{label}</Txt><Txt style={{fontSize:12}}>{value}</Txt></Row>;
 return <>
  <Card><Row><Txt style={{fontWeight:'700'}}>Stadttransporter</Txt><Txt muted>{vehicles.length} / {data.hubLimit}</Txt></Row>
   {data.hubInfo.nextVehicleLevel?<Txt muted style={{fontSize:12}}>Nächster Fahrzeugplatz ab Level {data.hubInfo.nextVehicleLevel}</Txt>:<Txt muted>Alle 20 Fahrzeugplätze freigeschaltet.</Txt>}
   <Txt muted style={{fontSize:12,marginTop:5}}>2 t Startkapazität · Ausbau im Stadthub</Txt>
   <Btn disabled={busy||vehicles.length>=data.hubLimit||vehicles.length>=20||g.coins<data.hubInfo.vehiclePrice} onPress={()=>onCommand('hubVehicleBuy')}>Kaufen · {n(data.hubInfo.vehiclePrice)} M</Btn>
  </Card>
  {vehicles.map((t:any)=><Pressable key={t.id} accessibilityRole="button" accessibilityLabel={translate(t.model)+', '+t.id} onPress={()=>setSelected(t.id)}><Card><Row style={{marginBottom:3}}><Icon name="truck" size={26} color={C.gold}/><Txt style={{fontWeight:'700',flex:1}}>{t.model} · {t.id}</Txt><Icon name="chevron" size={17}/></Row><Txt muted>{n(t.capacity,1)} t · {n(t.speed,2)} km/s</Txt><Txt muted style={{fontSize:11}}>Laderaum {t.hubCapacityLevel||0}/10 · Antrieb {t.hubSpeedLevel||0}/10</Txt></Card></Pressable>)}
  {!vehicles.length&&<Empty>Keine Stadttransporter</Empty>}
  <Modal visible={!!truck&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setSelected(null)}>
   <View style={styles.overlay}><View style={styles.detail}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={{fontSize:17,fontWeight:'700',flex:1}}>{truck?.model} · {truck?.id}</Txt><Btn icon="close" iconOnly secondary onPress={()=>setSelected(null)}>Schließen</Btn></Row>
    {truck&&<ScrollView keyboardShouldPersistTaps="handled">
     {fact('Kapazität',n(truck.capacity,1)+' t')}
     {fact('Geschwindigkeit',n(truck.speed,2)+' km/s')}
     {fact('Gefahren',n(truck.kmDriven)+' km')}
     {fact(itemName('hubVehicleParts',2),n(g.inventory.hubVehicleParts))}
     {(['capacity','speed'] as const).map(kind=>{
      const q=truck.hubUpgrades[kind],label=kind==='capacity'?'Laderaum':'Antrieb',unit=kind==='capacity'?'t':'km/s';
      return <View key={kind} style={styles.upgrade}>
       <Row><Txt style={{fontWeight:'700'}}>{label}</Txt><Txt muted>{q.level} / 10</Txt></Row>
       {q.level<10?<><Txt>{n(q.current,2)} → {n(q.next,2)} {unit}</Txt><Txt muted style={{fontSize:12,marginTop:5}}>{q.parts} {itemName('hubVehicleParts',2)} · {n(q.coins)} M</Txt>
        <Btn secondary disabled={busy||g.inventory.hubVehicleParts<q.parts||g.coins<q.coins} onPress={()=>onCommand('hubVehicleUpgrade',{id:truck.id,kind})}>Ausbauen</Btn>
       </>:<Txt muted>Maximum erreicht</Txt>}
      </View>;
     })}
     <Txt muted style={{fontSize:11,marginTop:10}}>Ausbauten wirken ab dem nächsten Stundenzyklus.</Txt>
     <Btn secondary disabled={busy} onPress={()=>onCommand('hubTruck',{id:truck.id})}>{truck.hubAssigned?'Aus Hub nehmen':'Im Hub einsetzen'}</Btn>
     {!!truck.sale&&<Btn secondary disabled={busy} onPress={()=>{setSelected(null);onSell(truck);}}>Verkaufen · {n(truck.sale.coins,2)} M</Btn>}
    </ScrollView>}
   </View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({upgrade:{borderTopWidth:1,borderTopColor:C.line,paddingTop:12,marginTop:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},detail:{width:'100%',maxWidth:480,maxHeight:'85%',alignSelf:'center',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:16}});
