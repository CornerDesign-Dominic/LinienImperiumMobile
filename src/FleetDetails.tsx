import React,{useState} from 'react';
import {View,Modal,ScrollView,StyleSheet,TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {t as translate} from './i18n';
import {C,Txt,Card,Row,Btn,Empty,n,remaining} from './ui';
import {estimateFleet} from './fleetEstimate';
import {VehicleArt} from './VehicleArt';
import {rarityColor} from './items';
function Fact({label,value}:any){return <Row style={{marginBottom:5,flexWrap:'nowrap'}}><Txt muted style={{fontSize:12,flex:1}}>{label}</Txt><Txt style={{fontSize:12,fontWeight:'600'}}>{value}</Txt></Row>;}
export function FleetDetails({data,template,visible,onClose,modalBlocked=false}:any){
 const [distanceText,setDistanceText]=useState('100');
 const distance=distanceText.trim()?Number(distanceText.replace(',','.')):NaN;
 const estimate=estimateFleet(data.fleetPreviews?.[template]||[],distance);
 return <Modal visible={visible&&!modalBlocked} transparent animationType="none" onRequestClose={onClose}>
  <SafeAreaView edges={['top','bottom']} style={styles.overlay}><View style={styles.modal}>
   <Row style={{flexWrap:'nowrap'}}><Txt style={styles.title}>Flottendetails</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={onClose}>Schließen</Btn></Row>
   <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:8}}>
    <Row><Txt muted>Flotte {template+1}</Txt><Txt muted style={styles.small}>Beispieltour</Txt></Row>
    <View style={styles.inputRow}><TextInput accessibilityLabel={translate('Tourlänge in Kilometern')} keyboardType="decimal-pad" maxLength={8} value={distanceText} onChangeText={setDistanceText} style={styles.input}/><Txt muted>km</Txt></View>
    <Txt muted style={[styles.small,{marginBottom:12}]}>Voll beladen hin, leer zurück. Ohne Kundenbonus und Abschlussprämie.</Txt>
    {!estimate?<Txt muted>Kilometer zwischen 0 und 100.000 eingeben.</Txt>:!estimate.vehicles.length?<Empty>Keine Fahrzeuge in dieser Flotte.</Empty>:<>
     <Card style={styles.total}>
      <Txt style={styles.section}>Gesamte Flotte</Txt>
      <Fact label="Kapazität" value={n(estimate.capacity,1)+' t'}/>
      <Fact label="Gefahren / 1 h" value={n(estimate.km,1)+' km'}/>
      <Fact label="Geliefert / 1 h" value={n(estimate.tons,1)+' t'}/>
      <Fact label="Kosten / Tour" value={n(estimate.tourCost,2)+' M'}/>
      <Fact label="Kosten / 1 h" value={n(estimate.hourCost,2)+' M'}/>
      <Fact label="Frachtvergütung / 1 h" value={n(estimate.hourRevenue,2)+' M'}/>
      <Fact label="Spieler-XP / 1 h" value={n(estimate.xp,2)}/>
     </Card>
     {estimate.vehicles.map(vehicle=>{
      const card=data.catalog.cards.find((item:any)=>item.id===vehicle.cardId);
      return <Card key={vehicle.cardId} style={{padding:12,borderColor:rarityColor(card?.rarity)}}>
       <Row style={{flexWrap:'nowrap'}}><VehicleArt card={card} style={{width:52}}/><Txt style={[styles.section,{flex:1,marginBottom:0}]}>{vehicle.model}</Txt></Row>
       <Fact label="Kapazität" value={n(vehicle.capacity,1)+' t'}/>
       <Fact label="Gefahren / 1 h" value={n(vehicle.km,1)+' km'}/>
       <Fact label="Tourendauer" value={remaining(vehicle.seconds*1000,0)}/>
       <Fact label="Volle Touren / 1 h" value={n(vehicle.tours)}/>
       <Fact label="Geliefert / 1 h" value={n(vehicle.tons,1)+' t'}/>
       <Fact label="Kosten / Tour" value={n(vehicle.tourCost,2)+' M'}/>
       <Fact label="Kosten / 1 h" value={n(vehicle.hourCost,2)+' M'}/>
       <Fact label="Frachtvergütung / 1 h" value={n(vehicle.hourRevenue,2)+' M'}/>
       <Txt muted style={[styles.small,{marginTop:7}]}>Wirksame Boni</Txt>
       <Fact label="Tempo" value={'+'+n(vehicle.bonuses.speed,1)+' %'}/>
       <Fact label="Kostenersparnis" value={n(Math.min(80,vehicle.bonuses.cost),1)+' %'}/>
       <Fact label="Frachtvergütung" value={'+'+n(vehicle.bonuses.pay,1)+' %'}/>
       <Fact label="Spieler-XP" value={'+'+n(vehicle.bonuses.xp,1)+' %'}/>
      </Card>;
     })}
     <Txt muted style={styles.small}>Liefermenge, Kosten und Vergütung zählen abgeschlossene Touren. Kilometer enthalten die laufende Tour. Aktuelle Flottenwerte, inklusive Werkstatt.</Txt>
    </>}
   </ScrollView>
  </View></SafeAreaView>
 </Modal>;
}
const styles=StyleSheet.create({
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:14},
 modal:{width:'100%',maxWidth:500,maxHeight:'90%',alignSelf:'center',padding:14,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:16},
 title:{flex:1,minWidth:0,fontSize:17,fontWeight:'700'},small:{fontSize:11,lineHeight:16},
 inputRow:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},
 input:{flex:1,minHeight:44,borderWidth:1,borderColor:C.line,borderRadius:8,paddingHorizontal:12,color:C.text,backgroundColor:C.raised,fontSize:18},
 total:{padding:12,backgroundColor:C.greenWash,borderColor:C.accent},
 section:{fontSize:14,fontWeight:'700',marginBottom:10},
});
