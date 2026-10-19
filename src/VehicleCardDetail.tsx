import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n} from './ui';
import {itemName,rarityColor} from './items';
const BONUS:Record<string,string>={speed:'Tempo',cost:'Kostenersparnis',pay:'Frachtvergütung',xp:'Spieler-XP'};
const SCOPE:Record<string,string>={self:'Dieses Fahrzeug',single:'Eigene Einzelaufträge',fleet:'Alle Fahrzeuge im Großauftrag',garage:'Alle Fahrzeuge in der Garage'};
function Fact({label,value}:any){return <Row style={styles.fact}><Txt muted style={{flex:1,fontSize:12}}>{label}</Txt><Txt style={{fontSize:13,fontWeight:'600',textAlign:'right'}}>{value}</Txt></Row>;}
export function VehicleCardDetail({data,id,busy,onUpgrade,onVehicleUpgrade}:any){
 const {state:g,catalog:c}=data,card=c.cards.find((item:any)=>item.id===id);
 if(!card)return <Empty>Fahrzeugkarte nicht verfügbar.</Empty>;
 const own=g.expedition.characters[id],stats=data.cardVehicles[id],rarity=c.rarities.find((r:any)=>r.id===card.rarity);
 const shards=g.expedition.shards[card.rarity]||0,level=own?.level||0,needed=c.cardLevelCosts[level-1]||0;
 const modules=stats.capacityLevel||0,maxModules=stats.maxCapacityLevel??c.models[card.vehicleTier].maxCapacityLevel;
 const maxRank=stats.rank.total>=50;
 return <>
  <Card>
   <Row style={{marginBottom:14}}><Txt style={{color:rarityColor(card.rarity),fontSize:11,fontWeight:'700'}}>{rarity.label}</Txt><Txt muted style={{fontSize:11}}>Region {card.region+1}</Txt></Row>
   <View accessibilityLabel="Fahrzeugbild Platzhalter" style={[styles.artwork,{borderColor:rarityColor(card.rarity)}]}><Txt muted style={{fontSize:36,lineHeight:44}}>▧</Txt></View>
   <Txt style={styles.name}>{card.name}</Txt>
   <View style={styles.badges}><Pill>{own?`Stufe ${level}`:'Nicht entdeckt'}</Pill><Txt muted style={{fontSize:12}}>{n(stats.capacity,1)} t · Rang {stats.rank.total}</Txt></View>
  </Card>
  <Card style={styles.bonus}><Row style={{marginBottom:3}}><Txt style={styles.title}>{BONUS[card.stat]}</Txt><Txt style={styles.bonusValue}>+{n(data.cardBonuses[id],1)} %</Txt></Row><Txt muted style={{fontSize:12}}>{SCOPE[card.scope]}</Txt></Card>
  <Card><Txt style={[styles.title,{marginBottom:14}]}>Fahrzeugdaten</Txt>
   <Fact label="Tempo leer" value={`${n(stats.speed,2)} km/s`}/>
   <Fact label="Tempo beladen" value={`${n(stats.loadedSpeed,2)} km/s`}/>
   <Fact label="Betriebskosten" value={`${n(stats.costPerKm,2)} M/km`}/>
   <Fact label="Geschwindigkeitsrang" value={`${stats.rank.label} · ${stats.rank.level} ★`}/>
  </Card>
  {own?<>
   <Card><Row><Txt style={styles.title}>Kartenstufe</Txt><Pill>{level} / 10</Pill></Row>
    {level<10?<><Bar value={own.progress/needed*100}/><Fact label="Fortschritt" value={`${n(own.progress)} / ${n(needed)}`}/><Fact label={`${rarity.label}-Shards`} value={`${n(shards)} vorhanden`}/><Btn disabled={busy||!shards} onPress={()=>onUpgrade(id)}>Shards einsetzen</Btn></>:<Txt muted>Maximum erreicht</Txt>}
   </Card>
   <Card><Row><Txt style={styles.title}>Kapazität</Txt><Txt style={styles.value}>{n(stats.capacity,1)} t</Txt></Row><Fact label="Module" value={`${modules} / ${maxModules}`}/>
    {modules<maxModules?<><Fact label={itemName('capacityModules',2)} value={`${n(g.inventory.capacityModules)} vorhanden`}/><Btn secondary disabled={busy||!g.inventory.capacityModules} onPress={()=>onVehicleUpgrade(id,'capacity')}>+0,5 t · 1 {itemName('capacityModules')}</Btn></>:<Txt muted>Maximum erreicht</Txt>}
   </Card>
   <Card><Row><Txt style={[styles.title,{flex:1}]}>Geschwindigkeitsrang</Txt><Pill>{stats.rank.total} / 50</Pill></Row>
    {maxRank?<Txt muted>Maximum erreicht</Txt>:<><Fact label={`${stats.rank.label}-Zahnräder`} value={`${n(g.inventory.gears[stats.rank.id])} / ${n(stats.rankCost)}`}/><Btn secondary disabled={busy||g.inventory.gears[stats.rank.id]<stats.rankCost} onPress={()=>onVehicleUpgrade(id,'rank')}>Rang erhöhen</Btn></>}
   </Card>
  </>:<Card><Txt muted>Auf Expeditionen in Region {card.region+1} entdecken.</Txt></Card>}
  {card.description&&<Card><Txt muted style={{fontSize:13,lineHeight:21}}>{card.description}</Txt></Card>}
 </>;
}
const styles=StyleSheet.create({artwork:{width:180,height:180,alignSelf:'center',backgroundColor:C.raised,borderWidth:1,borderRadius:12,alignItems:'center',justifyContent:'center'},name:{fontSize:19,lineHeight:26,fontWeight:'700',textAlign:'center',marginTop:14},badges:{flexDirection:'row',alignItems:'center',justifyContent:'center',flexWrap:'wrap',gap:10,marginTop:9},title:{fontSize:14,fontWeight:'700'},fact:{flexWrap:'nowrap',marginBottom:10},bonus:{backgroundColor:'#17332F',borderColor:'#2B5B4B'},bonusValue:{fontSize:20,lineHeight:26,fontWeight:'700',color:C.accent},value:{fontSize:18,lineHeight:25,fontWeight:'700'}});
