import {ItemArt,ItemAmount} from './ItemArt';
import {Text} from './Language';
import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Empty,n} from './ui';
import {Icon} from './Icon';
import {displayFont} from './theme';
import {rarityColor} from './items';
import {CollectionFacts} from './VehicleFacts';
import {VehicleArt} from './VehicleArt';
import {VehicleName} from './VehicleName';
import {averageCardSpeed} from './collectionStats';

const ROMAN_LEVELS=['','I','II','III','IV','V','VI','VII','VIII','IX','X'];

export function RarityFilter({data,rarity,onChange}:any){
 const [filterOpen,setFilterOpen]=useState(false);
 const {state:g,catalog:c}=data;
 const filters=[{id:'all',label:'Alle'},...c.rarities];
 const selected=filters.find((filter:any)=>filter.id===rarity)||filters[0];
 const selectedColor=rarity==='all'?C.text:rarityColor(rarity);
 return <View style={styles.filterBox}>
   <Pressable accessibilityRole="button" accessibilityLabel={`${translate('Seltenheit')}: ${translate(selected.label)}`} accessibilityState={{expanded:filterOpen}} onPress={()=>setFilterOpen(value=>!value)} style={styles.filterTrigger}>
    <Txt muted style={{fontSize:12}}>Seltenheit</Txt><View style={styles.selectedFilter}><Txt style={[styles.filterLabel,{color:selectedColor}]}>{selected.label}</Txt><Icon name="chevron" size={16} style={{transform:[{rotate:filterOpen?'270deg':'90deg'}]}}/></View>
   </Pressable>
   {filterOpen&&<View style={styles.filterOptions}>{filters.map((filter:any)=>{
    const active=rarity===filter.id,color=filter.id==='all'?C.accent:rarityColor(filter.id),shards=g.expedition.shards[filter.id]||0;
    return <Pressable key={filter.id} accessibilityRole="button" accessibilityLabel={`${translate(filter.label)}${filter.id==='all'?'':`, ${n(shards)} ${translate('Splitter')}`}`} accessibilityState={{selected:active}} onPress={()=>{onChange(filter.id);setFilterOpen(false);}} style={[styles.filterOption,active&&{backgroundColor:C.greenWash}]}>
     <Txt style={[styles.filterLabel,{color,flex:1}]}>{filter.label}</Txt>
     {filter.id!=='all'&&<View style={styles.shards}><ItemArt id={`shard:${filter.id}`} size={26}/><Txt muted style={{fontSize:12}}>{n(shards)}</Txt></View>}
     <View style={{width:16}}>{active&&<Icon name="check" size={15} color={color}/>}</View>
    </Pressable>;
   })}</View>}
  </View>;
}

export function VehicleCardPicker({data,context,template=0,busy,onSelect}:any){
 const [rarity,setRarity]=useState('all');
 const owned=data.catalog.cards.filter((card:any)=>!!data.state.expedition.characters[card.id]);
 const used=new Set<string>(context==='garage'?data.state.trucks.map((truck:any)=>truck.cardId).filter(Boolean):(data.templates[template]||[]).filter(Boolean));
 const matching=owned.filter((card:any)=>rarity==='all'||card.rarity===rarity);
 const ordered=[...matching.filter((card:any)=>!used.has(card.id)),...matching.filter((card:any)=>used.has(card.id))];
 return <>
  <RarityFilter data={data} rarity={rarity} onChange={setRarity}/>
  {ordered.length?<VehicleCardGrid data={data} cards={ordered} showDetails disabled={busy} statusForCard={(id:string)=>({disabled:used.has(id),label:used.has(id)?(context==='garage'?'In Garage':'In dieser Flotte'):''})} onOpen={(id:string)=>{if(!busy&&!used.has(id))onSelect(id);}}/>:<Empty>{owned.length?'Keine Fahrzeugkarten dieser Seltenheit.':'Noch keine Fahrzeugkarten entdeckt.'}</Empty>}
 </>;
}

export function VehicleCards({data,onOpen}:any){
 const {state:g,catalog:c}=data;
 const [rarity,setRarity]=useState('all');
 const [unlockedOpen,setUnlockedOpen]=useState(true),[lockedOpen,setLockedOpen]=useState(false);
 const matching=c.cards.filter((card:any)=>rarity==='all'||card.rarity===rarity);
 const unlocked=matching.filter((card:any)=>!!g.expedition.characters[card.id]);
 const locked=matching.filter((card:any)=>!g.expedition.characters[card.id]);
 const group=(label:string,cards:any[],open:boolean,toggle:()=>void)=><View>
  <Pressable accessibilityRole="button" accessibilityLabel={translate(`${label} · ${n(cards.length)}`)} accessibilityState={{expanded:open}} onPress={toggle} style={styles.sectionToggle}>
   <Txt style={styles.section}>{label} · {n(cards.length)}</Txt><Icon name="chevron" size={17} style={{transform:[{rotate:open?'90deg':'0deg'}]}}/>
  </Pressable>
  {open&&(cards.length?<VehicleCardGrid data={data} cards={cards} onOpen={onOpen} showDetails/>:<Txt muted style={styles.emptyGroup}>{label==='Freigeschaltet'?'Noch keine Karten dieser Seltenheit freigeschaltet.':'Alle Karten dieser Auswahl freigeschaltet.'}</Txt>)}
 </View>;
 return <>
  <RarityFilter data={data} rarity={rarity} onChange={setRarity}/>
  {matching.length?<>
   {group('Freigeschaltet',unlocked,unlockedOpen,()=>setUnlockedOpen(value=>!value))}
   {group('Gesperrt',locked,lockedOpen,()=>setLockedOpen(value=>!value))}
  </>:<Empty>Keine Fahrzeugkarten dieser Seltenheit.</Empty>}
 </>;
}

export function VehicleCardTile({data,card,stats,onPress,status,disabled=false,showDetails=false,accessibilityLabel,facts}:any){
 const owned=data.state.expedition.characters[card.id],unavailable=!!status?.disabled,locked=disabled||unavailable;
 const average=averageCardSpeed(stats.loadedSpeed,stats.speed);
 const label=accessibilityLabel||[
  translate(card.name),translate(owned?`Stufe ${owned.level}`:'Nicht entdeckt'),`${n(stats.capacity,1)} t`,
  showDetails?`${translate('Durchschnittsgeschwindigkeit')}: ${average===undefined?'—':n(average,2)+' km/s'}, ${translate('Betriebskosten')}: ${stats.costPerKm===undefined?'—':n(stats.costPerKm,2)+' M/km'}`:`${translate('Geschwindigkeitsrang')}: ${stats.rank.total}`,
  status?.label?translate(status.label):''
 ].filter(Boolean).join(', ');
 return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled:locked,selected:!!status?.selected}} aria-selected={!!status?.selected} disabled={locked} onPress={onPress} style={({pressed})=>[styles.card,{borderColor:rarityColor(card.rarity)},!owned&&{backgroundColor:C.raised,borderStyle:'dashed'},status?.selected&&{backgroundColor:C.greenWash},unavailable&&styles.unavailable,(pressed||locked)&&{opacity:.7}]}>
  <Text accessibilityLabel={translate(owned?`Stufe ${owned.level}`:'Nicht entdeckt')} style={styles.level}>{owned?ROMAN_LEVELS[owned.level]||String(owned.level):'—'}</Text><View style={unavailable?styles.usedArtwork:undefined}><VehicleArt card={card}/></View><VehicleName name={card.name} numberOfLines={3} style={styles.name}/>
  {facts??(showDetails?<CollectionFacts capacity={stats.capacity} loadedSpeed={stats.loadedSpeed} emptySpeed={stats.speed} costPerKm={stats.costPerKm}/>:<><Txt style={styles.rank}>Rang {stats.rank.total}</Txt><Txt style={styles.capacity}>{n(stats.capacity,1)} t</Txt></>)}
  {status&&<View style={[styles.assignment,status?.label&&!unavailable&&styles.assigned]}>{status?.label&&<Icon name={unavailable?"lock":"check"} size={11} color={unavailable?C.muted:C.accent}/>}<Text numberOfLines={2} style={[styles.assignmentText,unavailable&&{color:C.muted}]}>{status?.label||'Verfügbar'}</Text></View>}
 </Pressable>;
}
export function VehicleCardGrid({data,cards,onOpen,statusForCard,disabled=false,showDetails=false}:any){
 const c=data.catalog;
 const vehicle=(card:any)=>data.cardVehicles?.[card.id]||{capacity:c.models[card.vehicleTier].capacity,rank:{total:0,label:'Common',level:0}};
 const rows=Array.from({length:Math.ceil(cards.length/3)},(_,i)=>cards.slice(i*3,i*3+3));
 return <>{rows.map((row:any[],i:number)=><View key={i} style={[styles.row,showDetails&&styles.collectionRow]}>
  {row.map(card=><VehicleCardTile key={card.id} data={data} card={card} stats={vehicle(card)} onPress={()=>onOpen(card.id)} status={statusForCard?statusForCard(card.id)||{}:undefined} disabled={disabled} showDetails={showDetails}/>)}
  {row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={[styles.card,{opacity:0}]}/>)}
 </View>)}</>;
}
const styles=StyleSheet.create({
 unavailable:{backgroundColor:C.raised,borderColor:C.common},usedArtwork:{filter:[{grayscale:1}],opacity:.6},
 filterBox:{marginBottom:8,borderWidth:1,borderColor:C.line,borderRadius:6,backgroundColor:C.panel,overflow:'hidden'},filterTrigger:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,paddingHorizontal:12,paddingVertical:8},selectedFilter:{flexDirection:'row',alignItems:'center',gap:10,flexShrink:1},filterLabel:{fontSize:13,fontWeight:'700',flexShrink:1},filterOptions:{borderTopWidth:1,borderColor:C.line},filterOption:{minHeight:44,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:9},shards:{flexDirection:'row',alignItems:'center',gap:5},
 sectionToggle:{minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:6},section:{fontSize:13,fontWeight:'700',flexShrink:1},emptyGroup:{fontSize:12,marginBottom:16},
 assignment:{minHeight:32,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3,borderRadius:3,paddingHorizontal:2,marginTop:5},assigned:{backgroundColor:C.greenWash},assignmentText:{flexShrink:1,fontSize:10,lineHeight:13,textAlign:'center',color:C.accent,fontWeight:'600'},
 row:{flexDirection:'row',gap:9,marginBottom:10},collectionRow:{gap:4.5,marginBottom:5},card:{flex:1,minWidth:0,borderWidth:1,borderRadius:6,borderTopWidth:3,backgroundColor:C.panel,padding:7},
 level:{fontFamily:displayFont,fontSize:18,fontWeight:'700',color:C.gold,textAlign:'center',lineHeight:24,marginBottom:5},
 artwork:{width:'100%',aspectRatio:1,minHeight:0,backgroundColor:C.raised,borderColor:C.line,borderWidth:1,borderRadius:7,alignItems:'center',justifyContent:'center',padding:4},
 name:{width:'100%',flexShrink:1,fontFamily:displayFont,fontSize:11,lineHeight:14,minHeight:42,textAlign:'center',color:C.text,marginTop:6},rank:{fontSize:11,lineHeight:18,textAlign:'center',marginTop:7,color:C.muted},capacity:{fontSize:13,lineHeight:20,fontWeight:'700',textAlign:'center'},
});
