import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Empty,n} from './ui';
import {Text} from './Language';
import {averageCardSpeed,rankNumeral} from './collectionStats';
import {displayFont} from './theme';
import {rarityColor} from './items';
import {VehicleArt} from './VehicleArt';
import {BONUS,bonusValue,bonusSentence,pointBonus} from './cardBonus';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {VehicleUpgradeModal} from './VehicleUpgradeModal';
function Fact({label,value}:any){return <Row style={styles.fact}><Txt muted style={{flex:1,fontSize:12}}>{label}</Txt><Txt style={{fontSize:13,fontWeight:'600',textAlign:'right'}}>{value}</Txt></Row>;}
function DetailSection({compact,first=false,style,children}:any){
 return compact?<View style={[styles.compactSection,first&&styles.firstSection]}>{children}</View>:<Card style={style}>{children}</Card>;
}
export function VehicleCardDetail({data,id,busy,onUpgrade,onVehicleUpgrade,compact=false,actions,extra,modalBlocked=false}:any){
 const [bonusOpen,setBonusOpen]=useState(false),[upgradeOpen,setUpgradeOpen]=useState(false);
 const {state:g,catalog:c}=data,card=c.cards.find((item:any)=>item.id===id);
 if(!card)return <Empty>Fahrzeugkarte nicht verfügbar.</Empty>;
 const own=g.expedition.characters[id],stats=data.cardVehicles[id];
 const level=own?.level||0;
 const modules=stats.capacityLevel||0,maxModules=stats.maxCapacityLevel??c.models[card.vehicleTier].maxCapacityLevel;
 const averageSpeed=averageCardSpeed(stats.loadedSpeed,stats.speed),rankColor=rarityColor(stats.rank.id);
 return <>
  <DetailSection compact={compact} first>
   <Text accessibilityLabel={translate(own?`Stufe ${level}`:'Nicht entdeckt')} style={styles.cardLevel}>{own?rankNumeral(level):'—'}</Text>
   <VehicleArt card={card} style={{maxWidth:compact?200:360,alignSelf:'center'}}/>
   <Txt style={styles.name}>{card.name}</Txt>
  </DetailSection>
  <DetailSection compact={compact} style={styles.bonus}>
   <Row style={{flexWrap:'nowrap',alignItems:'flex-start',marginBottom:0}}><Txt style={{flex:1,fontWeight:'600',paddingTop:5}}>{bonusSentence(card,data.cardBonuses[id])}</Txt><Btn iconOnly icon="help" secondary onPress={()=>setBonusOpen(true)}>Bonus je Kartenstufe</Btn></Row>
   {card.scope==='garage'&&<Txt muted style={{fontSize:11,marginTop:6}}>{own&&g.trucks.some((t:any)=>t.cardId===id)?'Garagenbonus aktiv':'Garagenbonus inaktiv'}</Txt>}
   {!own&&<Txt muted style={{fontSize:11,marginTop:6}}>Vorschau für Stufe 1</Txt>}
  </DetailSection>
  <ExpeditionPlaceModal visible={bonusOpen&&!modalBlocked} title="Bonus je Kartenstufe" region={card.name} onClose={()=>setBonusOpen(false)}>
   <Txt muted style={{fontSize:12,marginBottom:12}}>{BONUS[card.stat]}</Txt>
   {card.bonusLevels.map((value:number,index:number)=><View key={index} style={[styles.bonusLevel,own&&level===index+1&&styles.currentBonusLevel]}>
    <Txt style={{fontWeight:own&&level===index+1?'700':'400'}}>Stufe {index+1}</Txt><Txt style={{fontWeight:'700',color:C.accent}}>{bonusValue(card,value,2)}</Txt>
   </View>)}
   {pointBonus(card)&&<Txt muted style={{fontSize:11,marginTop:12}}>Wirkt nur in der Garage</Txt>}
   {pointBonus(card)&&<Txt muted style={{fontSize:11,marginTop:5}}>{card.stat==='expeditionRegen'?'Verkürzt die Wartezeit pro Expeditionspunkt.':'Erhöht nur das Maximum. Vorhandene Punkte bleiben beim Entfernen erhalten.'}</Txt>}
  </ExpeditionPlaceModal>
  <DetailSection compact={compact}>
   <Row style={{flexWrap:'nowrap',marginBottom:12}}><Txt style={[styles.title,{flex:1}]}>Geschwindigkeit</Txt><View accessible accessibilityLabel={`${translate('Geschwindigkeitsrang')}: ${translate(stats.rank.label)} ${stats.rank.level}, ${stats.rank.total} / 50`} style={styles.speedRank}><Text style={{color:rankColor,fontSize:20,lineHeight:24}}>★</Text><Text style={{color:rankColor,fontFamily:displayFont,fontSize:18,fontWeight:'700'}}>{rankNumeral(stats.rank.level)}</Text></View></Row>
   <Fact label="Leer" value={`${n(stats.speed,2)} km/s`}/>
   <Fact label="Beladen" value={`${n(stats.loadedSpeed,2)} km/s`}/>
   <Fact label="Durchschnitt" value={averageSpeed===undefined?'—':`${n(averageSpeed,2)} km/s`}/>
  </DetailSection>
  <DetailSection compact={compact}><Row><Txt style={styles.title}>Kapazität</Txt><Txt style={styles.value}>{n(stats.capacity,1)} t</Txt></Row><Fact label="Erweitert" value={`${modules} / ${maxModules}`}/></DetailSection>
  <DetailSection compact={compact}><Row style={{marginBottom:0}}><Txt style={styles.title}>Betriebskosten</Txt><Txt style={styles.value}>{n(stats.costPerKm,2)} M/km</Txt></Row></DetailSection>
  {!own&&<DetailSection compact={compact}><Txt muted>Auf Expeditionen in Region {card.region+1} entdecken.</Txt></DetailSection>}
  {card.description&&<DetailSection compact={compact}><Txt muted style={{fontSize:13,lineHeight:21}}>{card.description}</Txt></DetailSection>}
  {extra&&<DetailSection compact={compact}>{extra}</DetailSection>}
  {compact?actions:<Btn disabled={busy||!own} onPress={()=>setUpgradeOpen(true)}>Verbessern</Btn>}
  {!compact&&<VehicleUpgradeModal data={data} id={id} visible={upgradeOpen} busy={busy} onClose={()=>setUpgradeOpen(false)} onUpgrade={onUpgrade} onVehicleUpgrade={onVehicleUpgrade}/>}
 </>;
}
const styles=StyleSheet.create({compactSection:{paddingVertical:10,borderTopWidth:1,borderTopColor:C.line},firstSection:{paddingTop:0,borderTopWidth:0},speedRank:{flexDirection:'row',alignItems:'center',gap:5,flexShrink:0},artwork:{width:180,height:180,alignSelf:'center',backgroundColor:C.raised,borderWidth:1,borderRadius:12,alignItems:'center',justifyContent:'center'},name:{fontFamily:displayFont,fontSize:22,lineHeight:26,fontWeight:'700',textAlign:'center',marginTop:12},cardLevel:{fontFamily:displayFont,fontSize:22,lineHeight:28,fontWeight:'700',color:C.gold,textAlign:'center',marginBottom:10},title:{fontSize:14,fontWeight:'700'},fact:{flexWrap:'nowrap',marginBottom:10},bonus:{backgroundColor:C.greenWash,borderColor:C.accent},bonusLevel:{minHeight:38,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,paddingHorizontal:8,paddingVertical:7,borderBottomWidth:1,borderColor:C.line},currentBonusLevel:{backgroundColor:C.greenWash,borderRadius:4},value:{fontSize:18,lineHeight:25,fontWeight:'700'}});
