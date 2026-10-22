import {Text} from './Language';
import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Empty,n} from './ui';
import {Icon} from './Icon';
import {displayFont} from './theme';
import {rarityColor} from './items';
import {VehicleFacts} from './VehicleFacts';
import {VehicleArt} from './VehicleArt';
import {VehicleName} from './VehicleName';


export function VehicleCards({data,onOpen}:any){
 const {state:g,catalog:c}=data;
 const [rarity,setRarity]=useState('all');
 const [filterOpen,setFilterOpen]=useState(false);
 const [unlockedOpen,setUnlockedOpen]=useState(true),[lockedOpen,setLockedOpen]=useState(false);
 const matching=c.cards.filter((card:any)=>rarity==='all'||card.rarity===rarity);
 const unlocked=matching.filter((card:any)=>!!g.expedition.characters[card.id]);
 const locked=matching.filter((card:any)=>!g.expedition.characters[card.id]);
 const filters=[{id:'all',label:'Alle'},...c.rarities];
 const selected=filters.find((filter:any)=>filter.id===rarity)||filters[0];
 const selectedColor=rarity==='all'?C.text:rarityColor(rarity);
 const group=(label:string,cards:any[],open:boolean,toggle:()=>void)=><View>
  <Pressable accessibilityRole="button" accessibilityLabel={translate(`${label} · ${n(cards.length)}`)} accessibilityState={{expanded:open}} onPress={toggle} style={styles.sectionToggle}>
   <Txt style={styles.section}>{label} · {n(cards.length)}</Txt><Icon name="chevron" size={17} style={{transform:[{rotate:open?'90deg':'0deg'}]}}/>
  </Pressable>
  {open&&(cards.length?<VehicleCardGrid data={data} cards={cards} onOpen={onOpen} showDetails/>:<Txt muted style={styles.emptyGroup}>{label==='Freigeschaltet'?'Noch keine Karten dieser Seltenheit freigeschaltet.':'Alle Karten dieser Auswahl freigeschaltet.'}</Txt>)}
 </View>;
 return <>
  <View style={styles.filterBox}>
   <Pressable accessibilityRole="button" accessibilityLabel={`${translate('Seltenheit')}: ${translate(selected.label)}`} accessibilityState={{expanded:filterOpen}} onPress={()=>setFilterOpen(value=>!value)} style={styles.filterTrigger}>
    <Txt muted style={{fontSize:12}}>Seltenheit</Txt><View style={styles.selectedFilter}><Txt style={[styles.filterLabel,{color:selectedColor}]}>{selected.label}</Txt><Icon name="chevron" size={16} style={{transform:[{rotate:filterOpen?'270deg':'90deg'}]}}/></View>
   </Pressable>
   {filterOpen&&<View style={styles.filterOptions}>{filters.map((filter:any)=>{
    const active=rarity===filter.id,color=filter.id==='all'?C.accent:rarityColor(filter.id),shards=g.expedition.shards[filter.id]||0;
    return <Pressable key={filter.id} accessibilityRole="button" accessibilityLabel={`${translate(filter.label)}${filter.id==='all'?'':`, ${n(shards)} ${translate('Splitter')}`}`} accessibilityState={{selected:active}} onPress={()=>{setRarity(filter.id);setFilterOpen(false);}} style={[styles.filterOption,active&&{backgroundColor:C.greenWash}]}>
     <Txt style={[styles.filterLabel,{color,flex:1}]}>{filter.label}</Txt>
     {filter.id!=='all'&&<View style={styles.shards}><Icon name="shard" size={15} color={color}/><Txt muted style={{fontSize:12}}>{n(shards)}</Txt></View>}
     <View style={{width:16}}>{active&&<Icon name="check" size={15} color={color}/>}</View>
    </Pressable>;
   })}</View>}
  </View>
  {matching.length?<>
   {group('Freigeschaltet',unlocked,unlockedOpen,()=>setUnlockedOpen(value=>!value))}
   {group('Gesperrt',locked,lockedOpen,()=>setLockedOpen(value=>!value))}
  </>:<Empty>Keine Fahrzeugkarten dieser Seltenheit.</Empty>}
 </>;
}

export function VehicleCardGrid({data,cards,onOpen,statusForCard,disabled=false,showDetails=false}:any){
 const {state:g,catalog:c}=data;
 const vehicle=(card:any)=>data.cardVehicles?.[card.id]||{capacity:c.models[card.vehicleTier].capacity,rank:{total:0,label:'Common',level:0}};
 const rows=Array.from({length:Math.ceil(cards.length/3)},(_,i)=>cards.slice(i*3,i*3+3));
 return <>
  {rows.map((row:any[],i:number)=><View key={i} style={styles.row}>{row.map(item=>{
   const owned=g.expedition.characters[item.id],stats=vehicle(item),status=statusForCard?.(item.id);
   const freeModules=Math.max(0,(stats.maxCapacityLevel??c.models[item.vehicleTier].maxCapacityLevel)-(stats.capacityLevel||0));
   return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={translate(`${item.name}, ${owned?`Stufe ${owned.level}`:'Nicht entdeckt'}, Geschwindigkeitsrang ${stats.rank.total}, ${n(stats.capacity,1)} Tonnen${status?.label?`, ${status.label}`:''}`)} accessibilityState={{disabled,selected:!!status?.selected}} disabled={disabled} onPress={()=>onOpen(item.id)} style={({pressed})=>[styles.card,{borderColor:rarityColor(item.rarity)},!owned&&{backgroundColor:C.raised,borderStyle:'dashed'},status?.selected&&{backgroundColor:C.greenWash},(pressed||disabled)&&{opacity:.7}]}>
    <VehicleArt card={item} level={owned?.level}/><VehicleName name={item.name} numberOfLines={3} style={styles.name}/><Txt style={styles.level}>{owned?`Stufe ${owned.level}`:'Stufe —'}</Txt>
    {showDetails?<View style={{marginTop:8}}><VehicleFacts capacity={stats.capacity} rank={stats.rank.total} loadedSpeed={stats.loadedSpeed} emptySpeed={stats.speed} color={rarityColor(item.rarity)} freeModules={freeModules} compact/></View>:<><Txt style={styles.rank}>Rang {stats.rank.total}</Txt><Txt style={styles.capacity}>{n(stats.capacity,1)} t</Txt></>}
    {statusForCard&&<View style={[styles.assignment,status?.label&&styles.assigned]}>{status?.label&&<Icon name="check" size={11} color={C.accent}/>}<Text numberOfLines={2} style={styles.assignmentText}>{status?.label||'Verfügbar'}</Text></View>}
   </Pressable>;
  })}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={[styles.card,{opacity:0}]}/>)}</View>)}

 </>;
}
const styles=StyleSheet.create({
 filterBox:{marginBottom:8,borderWidth:1,borderColor:C.line,borderRadius:6,backgroundColor:C.panel,overflow:'hidden'},filterTrigger:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,paddingHorizontal:12,paddingVertical:8},selectedFilter:{flexDirection:'row',alignItems:'center',gap:10,flexShrink:1},filterLabel:{fontSize:13,fontWeight:'700',flexShrink:1},filterOptions:{borderTopWidth:1,borderColor:C.line},filterOption:{minHeight:44,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:9},shards:{flexDirection:'row',alignItems:'center',gap:5},
 sectionToggle:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:6},section:{fontSize:13,fontWeight:'700',flexShrink:1},emptyGroup:{fontSize:12,marginBottom:16},
 assignment:{minHeight:32,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3,borderRadius:3,paddingHorizontal:2,marginTop:5},assigned:{backgroundColor:C.greenWash},assignmentText:{flexShrink:1,fontSize:10,lineHeight:13,textAlign:'center',color:C.accent,fontWeight:'600'},
 row:{flexDirection:'row',gap:9,marginBottom:10},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:6,borderTopWidth:3,backgroundColor:C.panel,padding:7},
 level:{fontSize:11,fontWeight:'700',textAlign:'center',lineHeight:19,marginBottom:5},
 artwork:{width:'100%',aspectRatio:1,minHeight:0,backgroundColor:C.raised,borderColor:C.line,borderWidth:1,borderRadius:7,alignItems:'center',justifyContent:'center',padding:4},
 name:{width:'100%',flexShrink:1,fontFamily:displayFont,fontSize:11,lineHeight:14,minHeight:42,textAlign:'center',color:C.text,marginTop:6},rank:{fontSize:11,lineHeight:18,textAlign:'center',marginTop:7,color:C.muted},capacity:{fontSize:13,lineHeight:20,fontWeight:'700',textAlign:'center'},
});
