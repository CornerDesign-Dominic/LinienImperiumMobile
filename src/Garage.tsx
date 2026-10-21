import {Text} from './Language';
import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {rarityColor} from './items';
import {VehicleFacts} from './VehicleFacts';
import {C,Txt,Row,Btn,Bar,n,remaining} from './ui';

export function Garage({data,busy,clock,onCommand,modalBlocked=false}:any){
 const [selected,setSelected]=useState<string|null>(null),[adding,setAdding]=useState(false),[rarity,setRarity]=useState('all');
 const {state:g,catalog:c}=data;
 const regular=g.trucks.filter((t:any)=>!!t.cardId);
 const truck=g.trucks.find((t:any)=>t.id===selected);
 const available=c.cards.filter((card:any)=>g.expedition.characters[card.id]&&!g.trucks.some((t:any)=>t.cardId===card.id));
 const matching=available.filter((card:any)=>rarity==='all'||card.rarity===rarity);
 const filters=[{id:'all',label:'Alle'},...c.rarities];
 const tile=(t:any,index:number)=>{
  if(!t)return <Pressable accessibilityRole="button" accessibilityLabel={translate(`Garagenplatz ${index+1} hinzufügen`)} disabled={busy} onPress={()=>{setRarity('all');setAdding(true);}} style={[styles.tile,styles.empty]}><Icon name="plus" size={28} color={C.muted}/></Pressable>;
  const card=c.cards.find((item:any)=>item.id===t.cardId),color=rarityColor(card?.rarity);
  const wash=({common:C.panel,uncommon:C.greenWash,rare:C.blueWash,epic:C.purpleWash,legendary:C.goldWash} as Record<string,string>)[card?.rarity]||C.panel;
  const stats=data.cardVehicles[t.cardId];
  return <Pressable accessibilityRole="button" accessibilityLabel={translate(`Garagenplatz ${index+1}: ${t.model}`)} onPress={()=>setSelected(t.id)} style={[styles.tile,{borderColor:color,backgroundColor:wash}]}>
   <View style={styles.tileHeader}><Icon name="truck" size={28} color={color}/><Txt style={[styles.level,{color}]}>Stufe {g.expedition.characters[t.cardId]?.level||1}</Txt></View>
   <Text numberOfLines={2} style={styles.name}>{t.model}</Text>
   <VehicleFacts capacity={t.capacity} rank={t.rarity.total} loadedSpeed={stats?.loadedSpeed} emptySpeed={stats?.speed??t.speed} color={color}/>
  </Pressable>;
 };
 return <>
  {Array.from({length:5},(_,row)=><View key={row} style={styles.row}>{[0,1].map(col=><React.Fragment key={col}>{tile(regular[row*2+col],row*2+col)}</React.Fragment>)}</View>)}
  <Modal transparent visible={(!!truck||adding)&&!modalBlocked} animationType="none" onRequestClose={()=>{setSelected(null);setAdding(false);}}>
   <View style={styles.overlay}><View style={styles.detail}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={styles.title}>{adding?'Fahrzeug wählen':truck?.model}</Txt><Btn icon="close" iconOnly secondary onPress={()=>{setSelected(null);setAdding(false);}}>Schließen</Btn></Row>
    {adding&&<View style={styles.filters}>{filters.map((filter:any)=>{
     const active=rarity===filter.id,color=filter.id==='all'?C.accent:rarityColor(filter.id);
     return <Pressable key={filter.id} accessibilityRole="button" accessibilityLabel={translate(filter.label)} accessibilityState={{selected:active}} onPress={()=>setRarity(filter.id)} style={[styles.filter,{borderColor:color},active&&{backgroundColor:C.greenWash}]}>
      <Txt style={[styles.filterLabel,{color}]}>{filter.label}</Txt>{active&&<Icon name="check" size={12} color={color}/>}
     </Pressable>;
    })}</View>}
    <ScrollView keyboardShouldPersistTaps="handled">
     {adding?matching.length?matching.map((card:any)=>{
      const stats=data.cardVehicles[card.id],color=rarityColor(card.rarity);
      return <Pressable key={card.id} accessibilityRole="button" accessibilityState={{disabled:!!busy}} disabled={busy} onPress={async()=>{const result=await onCommand('garageAdd',{id:card.id});if(result?.state.trucks.some((t:any)=>t.cardId===card.id))setAdding(false);}} style={({pressed})=>[styles.choice,{borderLeftColor:color},(pressed||busy)&&{opacity:.65}]}>
       <Icon name="truck" size={24} color={color}/>
       <View style={styles.choiceInfo}>
        <View style={styles.choiceHeader}><Text style={styles.choiceName}>{card.name}</Text><Txt style={styles.choiceCapacity}>{n(stats.capacity,1)} t</Txt></View>
        <Txt muted style={styles.choiceMeta}>Stufe {g.expedition.characters[card.id].level} · Rang {stats.rank.total}</Txt>
        <View style={styles.choiceSpeeds}><Txt style={styles.choiceMeta}>Beladen {n(stats.loadedSpeed,2)} km/s</Txt><Txt style={styles.choiceMeta}>Leer {n(stats.speed,2)} km/s</Txt></View>
       </View>
       <Icon name="plus" size={16} color={C.accent}/>
      </Pressable>;
     }):<Txt muted>{available.length?'Keine freien Karten dieser Seltenheit.':'Keine freien Karten'}</Txt>:truck&&<>
      <Fact label="Kapazität" value={`${n(truck.capacity,1)} t`}/>
      <Fact label="Stufe" value={g.expedition.characters[truck.cardId]?.level||1}/>
      <Fact label="Geschwindigkeitsrang" value={`${truck.rarity.label} · ${truck.rarity.level} ★`}/>
      <Fact label="Tempo beladen" value={`${n(data.cardVehicles[truck.cardId]?.loadedSpeed,2)} km/s`}/>
      <Fact label="Tempo leer" value={`${n(data.cardVehicles[truck.cardId]?.speed??truck.speed,2)} km/s`}/>
      <Fact label="Betriebskosten" value={`${n(truck.costPerKm,2)} M/km`}/>
      <Fact label="Gefahren" value={`${n(truck.kmDriven)} km`}/>
      <Fact label="Aufträge" value={n(truck.ordersCompleted)}/>
      <Fact label="Status" value={truck.procurementId?'Materialbeschaffung':truck.free?'Bereit':'Im Einsatz'}/>
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
 filters:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:12},filter:{minHeight:44,paddingHorizontal:9,paddingVertical:6,borderWidth:1,borderRadius:6,backgroundColor:C.panel,flexDirection:'row',alignItems:'center',gap:5},filterLabel:{fontSize:11,fontWeight:'700'},
 choice:{flexDirection:'row',alignItems:'center',gap:9,padding:10,marginBottom:8,borderWidth:1,borderLeftWidth:3,borderColor:C.line,borderRadius:7,backgroundColor:C.raised},choiceInfo:{flex:1,minWidth:0},choiceHeader:{flexDirection:'row',alignItems:'baseline',gap:6},choiceName:{flex:1,color:C.text,fontSize:14,lineHeight:18,fontWeight:'700'},choiceCapacity:{fontSize:13,fontWeight:'700'},choiceMeta:{fontSize:11,lineHeight:17},choiceSpeeds:{flexDirection:'row',flexWrap:'wrap',columnGap:10},
 row:{flexDirection:'row',gap:10,marginBottom:10},tile:{flex:1,minWidth:0,minHeight:220,padding:12,borderWidth:1,borderColor:C.line,borderRadius:14,backgroundColor:C.panel,justifyContent:'flex-start',borderTopWidth:3},
 tileHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:4,marginBottom:9},level:{fontSize:10,fontWeight:'700'},fact:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:4},value:{fontSize:12,fontWeight:'600'},speed:{borderTopWidth:1,paddingTop:6,marginTop:7},speedLabel:{fontSize:10,lineHeight:15,marginBottom:3},
 name:{color:C.text,fontWeight:'700',fontSize:14,lineHeight:19,marginBottom:7,minHeight:38},capacity:{fontSize:18,fontWeight:'700',marginBottom:4},small:{fontSize:11,lineHeight:18},empty:{borderStyle:'dashed',backgroundColor:'transparent',alignItems:'center',justifyContent:'center'},plus:{fontSize:30,lineHeight:38,color:C.muted},
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},detail:{width:'100%',maxWidth:480,maxHeight:'85%',alignSelf:'center',backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:18,padding:16},title:{fontSize:17,fontWeight:'700',flex:1}
});
