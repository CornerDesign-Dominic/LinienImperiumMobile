import React,{useState} from 'react';
import {View,Text,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Row,Btn,Bar,Pill,n} from './ui';

const BONUS:Record<string,string>={speed:'Tempo',cost:'Kostenersparnis',pay:'Frachtvergütung',xp:'Spieler-XP'};
const SCOPE:Record<string,string>={self:'Dieses Fahrzeug',single:'Eigene Einzelaufträge',fleet:'Alle Fahrzeuge im Großauftrag',garage:'Alle Fahrzeuge in der Garage'};
const RARITY:Record<string,string>={common:C.muted,uncommon:C.accent,rare:C.gold};

export function VehicleCards({data,busy,onUpgrade}:any){
 const [selected,setSelected]=useState<string|null>(null);
 const {state:g,catalog:c}=data;
 const vehicle=(card:any)=>data.cardVehicles?.[card.id]||{capacity:c.models[card.vehicleTier].capacity,rank:{total:0,label:'Common',level:0}};
 const card=c.cards.find((item:any)=>item.id===selected);
 const own=card&&g.expedition.characters[card.id];
 const metrics=card&&vehicle(card);
 const rows=Array.from({length:Math.ceil(c.cards.length/3)},(_,i)=>c.cards.slice(i*3,i*3+3));
 return <>
  <Row style={{marginBottom:14}}>{c.rarities.slice(0,3).map((r:any)=><Pill key={r.id}>{r.label}: {n(g.expedition.shards[r.id])}</Pill>)}</Row>
  {rows.map((row:any[],i:number)=><View key={i} style={styles.row}>{row.map(item=>{
   const owned=g.expedition.characters[item.id],stats=vehicle(item);
   return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.name}, ${owned?`Stufe ${owned.level}`:'Nicht entdeckt'}, Geschwindigkeitsrang ${stats.rank.total}, ${n(stats.capacity,1)} Tonnen`} onPress={()=>setSelected(item.id)} style={({pressed})=>[styles.card,{borderColor:RARITY[item.rarity]},!owned&&{opacity:.5},pressed&&{opacity:.7}]}>
    <Txt style={styles.level}>{owned?`Stufe ${owned.level}`:'Stufe —'}</Txt>
    <View style={styles.artwork}><Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>{item.name}</Text></View>
    <Txt style={styles.rank}>Rang {stats.rank.total}</Txt>
    <Txt style={styles.capacity}>{n(stats.capacity,1)} t</Txt>
   </Pressable>;
  })}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={{flex:1}}/>)}</View>)}
  <Modal visible={!!card} transparent animationType="none" onRequestClose={()=>setSelected(null)}>
   <View style={styles.overlay}><SafeAreaView edges={['bottom']} style={styles.detail}>
    <Row><Txt style={styles.detailTitle}>{card?.name}</Txt><Btn secondary onPress={()=>setSelected(null)}>Schließen</Btn></Row>
    {card&&<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:12}}>
     <Row><Pill gold={card.rarity==='rare'}>{card.rarity.toUpperCase()}</Pill><Txt muted>Region {card.region+1}</Txt></Row>
     <View style={styles.facts}><View><Txt muted>Kartenstufe</Txt><Txt gold>{own?`${own.level} / 10`:'Nicht entdeckt'}</Txt></View><View><Txt muted>Kapazität</Txt><Txt>{n(metrics.capacity,1)} t</Txt></View></View>
     <View style={styles.facts}><View><Txt muted>Geschwindigkeitsrang</Txt><Txt>{metrics.rank.label} · {metrics.rank.level} ★</Txt></View><View><Txt muted>Module</Txt><Txt>{metrics.capacityLevel||0} / {metrics.maxCapacityLevel??c.models[card.vehicleTier].maxCapacityLevel}</Txt></View></View>
     {metrics.speed!=null&&<><Row><Txt muted>Tempo leer / beladen</Txt><Txt>{n(metrics.speed,2)} / {n(metrics.loadedSpeed,2)} km/s</Txt></Row><Row><Txt muted>Betriebskosten</Txt><Txt>{n(metrics.costPerKm,2)} M/km</Txt></Row></>}
     <View style={styles.bonus}><Txt style={{fontWeight:'700'}}>{BONUS[card.stat]}</Txt><Txt muted>{SCOPE[card.scope]}</Txt><Txt gold>{n(data.cardBonuses[card.id],1)} % Bonus</Txt></View>
     {own?(own.level<10?<><Bar value={own.progress/c.cardLevelCosts[own.level-1]*100}/><Txt muted>{n(own.progress)} / {n(c.cardLevelCosts[own.level-1])} Shards zur nächsten Stufe</Txt><Btn disabled={busy||!g.expedition.shards[card.rarity]} onPress={()=>onUpgrade(card.id)}>Shards einsetzen</Btn></>:<Txt gold>Maximale Kartenstufe erreicht.</Txt>):<Txt muted>Auf Expeditionen in Region {card.region+1} entdecken.</Txt>}
    </ScrollView>}
   </SafeAreaView></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({
 row:{flexDirection:'row',gap:9,marginBottom:10},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:12,backgroundColor:C.panel,padding:7},
 level:{fontSize:11,fontWeight:'700',textAlign:'center',lineHeight:19,marginBottom:5},
 artwork:{width:'100%',aspectRatio:1,backgroundColor:C.raised,borderColor:C.line,borderWidth:1,borderRadius:7,alignItems:'center',justifyContent:'center',padding:4},
 name:{width:'100%',flexShrink:1,fontSize:11,lineHeight:15,textAlign:'center',color:C.muted},rank:{fontSize:11,lineHeight:18,textAlign:'center',marginTop:7,color:C.muted},capacity:{fontSize:13,lineHeight:20,fontWeight:'700',textAlign:'center'},
 overlay:{flex:1,backgroundColor:'#000B',justifyContent:'flex-end'},detail:{maxHeight:'85%',backgroundColor:C.panel,borderTopLeftRadius:20,borderTopRightRadius:20,padding:20},detailTitle:{fontSize:17,fontWeight:'700',flex:1},
 facts:{flexDirection:'row',justifyContent:'space-between',gap:12,marginVertical:10},bonus:{padding:14,backgroundColor:C.raised,borderRadius:10,marginVertical:12}
});
