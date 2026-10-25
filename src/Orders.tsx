import {ItemArt,ItemAmount} from './ItemArt';
import {t as translate} from './i18n';
import {Icon,IconName} from './Icon';
import {itemName,rarityColor} from './items';
import {VehicleArt} from './VehicleArt';
import React,{useState} from 'react';
import {OrderVehiclePicker} from './OrderVehiclePicker';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining,minutes} from './ui';
const durationBand=(seconds:number)=>seconds<=300?'Kurz':seconds<=900?'Mittel':'Lang';
const transportSummary=(o:any,seconds?:number)=>`${o.transportLabel||({international:'Fernverkehr',city:'Stadtverkehr',national:'Nahverkehr'} as Record<string,string>)[o.category]||'Nahverkehr'} · ${seconds!=null?durationBand(seconds):o.durationBand||durationBand(o.durationSeconds??o.forecast?.seconds??0)}`;
const unavailable=(o:any)=>o.vehicleStatus==='missing'?'Passender LKW fehlt':'Passender LKW im Einsatz';
const rankStyle=(rank:number)=>rank===3?{backgroundColor:C.blueWash,borderColor:C.rare,borderLeftColor:C.rare}:rank===2?{backgroundColor:C.greenWash,borderColor:C.uncommon,borderLeftColor:C.uncommon}:{backgroundColor:C.raised,borderColor:C.common,borderLeftColor:C.common};
const expeditionRank=(job:any)=>[1,2,3].includes(job.tier)?job.tier:1;
const expeditionName=(kind:string)=>itemName(kind==='character'?'character':'material');
const endlessMissions=(data:any)=>data.state.expedition.missions.filter((m:any)=>m.kind==='endless'&&m.status==='active');
function progress(o:any,clock:number){
 if(o.status==='completed')return 100;
 const fraction=o.tripEndsAt?Math.max(0,Math.min(1,(clock-o.tripStartAt)/(o.tripEndsAt-o.tripStartAt))):0;
 return Math.min(100,((o.delivered||0)+(o.tripCargo||0)*fraction)/o.volume*100);
}
export function OrderTraits({order:o}:any){
 const band=o.durationBand||durationBand(o.durationSeconds??o.forecast?.seconds??0),bars=band==='Lang'?3:band==='Mittel'?2:1;
 const category=o.category==='international'?'Fern':o.category==='city'?'Stadt':'Nah',dual=o.routeType==='dual';
 return <View style={styles.traits}>
  <View accessible accessibilityLabel={translate(category==='Nah'?'Nahverkehr':category==='Fern'?'Fernverkehr':'Stadtverkehr')} style={styles.trait}><Icon name="location" size={13} color={C.muted}/><Txt style={styles.traitLabel}>{category}</Txt></View>
  <View accessible accessibilityLabel={translate(band)} style={styles.trait}><View testID={`duration-bars-${bars}`} style={styles.signal}>{[0,1,2].map(i=><View key={i} style={{width:3,height:4+i*4,backgroundColor:i<bars?C.text:'transparent',borderRadius:1}}/>)}</View><Txt style={styles.traitLabel}>{band}</Txt></View>
  {!!o.routeType&&<View accessible accessibilityLabel={translate(dual?'Dual Way, beladene Hin- und Rückfahrt':'Single Way, beladene Hinfahrt und leere Rückfahrt')} style={styles.trait}><View style={styles.directions}><Icon name="direction" size={16} color={C.text}/><Icon name="direction" size={16} color={C.text} style={{transform:[{rotate:'180deg'}],opacity:dual?1:.25,marginTop:-7}}/></View><Txt style={styles.traitLabel}>{dual?'Dual':'Single'}</Txt></View>}
 </View>;
}
export function OrderTile({order:o,data,clock,onOpen,onPin,busy=false}:any){
 const active=o.status==='active',done=o.status==='completed',truck=data.state.trucks.find((t:any)=>t.id===o.truckId);
 const canPin=o.status==='available'&&!!onPin,held=data.state.orders.filter((order:any)=>order.status==='available'&&order.pinned).length;
 const holdFull=!o.pinned&&held>=(data.pinLimit??1),pinDisabled=busy||holdFull;
 if(!active&&!done)return <Card style={[styles.offer,styles.compactOffer,{borderLeftColor:o.customer?C.gold:C.rare}]}>
  <Pressable testID={`order-open-${o.id}`} accessibilityRole="button" accessibilityLabel={`${translate(o.cargo)}, ${o.id}, ${translate(o.category==='international'?'Fernverkehr':'Nahverkehr')}, ${translate(o.durationBand||durationBand(o.durationSeconds??o.forecast?.seconds??0))}, ${translate(o.routeType==='dual'?'Dual Way, beladene Hin- und Rückfahrt':'Single Way, beladene Hinfahrt und leere Rückfahrt')}, ${n(o.volume,1)} t, ${n(o.distance)} km`} onPress={()=>onOpen(o.id)} style={StyleSheet.absoluteFill}/>
  <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
   <View style={styles.offerMain}><ItemArt id={`order:${o.kind==='private'?'private':'customer'}`} size={44}/>
    <View style={[styles.offerCopy,canPin&&styles.pinnableCopy]}><Txt style={styles.title}>{o.cargo}</Txt>
     <View testID={`order-facts-${o.id}`} style={styles.offerFacts}><View style={styles.offerFact}><Icon name="orders" size={13} color={C.muted}/><Txt style={styles.factValue}>{n(o.volume,1)} t</Txt></View><View style={styles.offerFact}><Icon name="location" size={13} color={C.muted}/><Txt style={styles.factValue}>{n(o.distance)} km</Txt></View></View>
    </View>
   </View>
   <OrderTraits order={o}/>
   {(o.customer||!o.choices.length)&&<View style={{marginTop:5}}>{o.customer&&<Txt gold style={styles.traitLabel}>{o.customerName}</Txt>}{!o.choices.length&&<Txt muted style={styles.traitLabel}>{unavailable(o)}</Txt>}</View>}
  </View>
  {canPin&&<Pressable testID={`order-pin-${o.id}`} accessibilityRole="button" accessibilityLabel={translate(o.pinned?'Angebot freigeben':'Angebot halten')} accessibilityHint={holdFull?translate('Alle Halteplätze sind belegt.'):undefined} accessibilityState={{disabled:pinDisabled,selected:!!o.pinned}} aria-pressed={!!o.pinned} disabled={pinDisabled} onPress={event=>{event?.stopPropagation();if(!pinDisabled)onPin(o.id);}} style={[styles.pinButton,o.pinned&&{backgroundColor:C.goldWash},pinDisabled&&{opacity:.4}]}><Icon name={o.pinned?'pinFilled':'pin'} size={21} color={o.pinned?C.gold:C.muted}/></Pressable>}
 </Card>;
 return <Pressable accessibilityRole="button" accessibilityLabel={translate(`${o.cargo}, ${o.id}`)} onPress={()=>onOpen(o.id)}>
  <Card style={[styles.offer,{borderLeftColor:active?C.accent:o.customer?C.gold:C.rare}]}>
   <Row style={{marginBottom:3,flexWrap:'nowrap'}}><ItemArt id={`order:${o.kind==='private'?'private':'customer'}`} size={44}/><Txt style={[styles.title,{flex:1}]}>{o.cargo}</Txt>{active?<Txt gold style={styles.small}>{remaining(o.runningEndsAt||clock,clock)}</Txt>:done?<Pill gold>Prämie</Pill>:<Txt style={styles.small}>{n(o.volume,1)} t · {n(o.distance)} km</Txt>}</Row>
   <OrderTraits order={o}/>
   {active?<><Row style={{marginTop:5,marginBottom:0}}><Txt muted style={styles.small}>{truck?.model||'Fahrzeug'}</Txt><Txt muted style={styles.small}>{n(o.delivered,1)} / {n(o.volume)} t</Txt></Row><Bar value={progress(o,clock)}/></>:<Row style={{marginBottom:0,marginTop:5}}>{o.customer&&<Txt gold style={styles.small}>{o.customerName}</Txt>}{!done&&!o.choices.length?<Txt muted style={styles.small}>{unavailable(o)}</Txt>:o.pinned?<Txt muted style={styles.small}>Gehalten</Txt>:null}</Row>}
  </Card>
 </Pressable>;
}
export function Orders({data,clock,busy,onOpen,onRefresh,onClaim,onMission,onJob,onPin,tab='offers',onTab,typeKey,onType}:any){
 const orders=data.state.orders.filter((o:any)=>!o.isProject),active=orders.filter((o:any)=>o.status==='active');
 const available=orders.filter((o:any)=>o.status==='available'),queued=orders.filter((o:any)=>o.status==='queued'),rewards=orders.filter((o:any)=>o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
 const tabs=[{id:'running',label:'Laufende',count:active.length+endlessMissions(data).length,ready:rewards.length},{id:'offers',label:'Angebote',count:available.length,ready:0},{id:'saved',label:'Aufträge',count:queued.length+data.state.expedition.jobs.length,ready:0}];
 return <>
  <View accessibilityRole="tablist" style={styles.tabs}>{tabs.map(item=><Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={`${translate(item.label)}, ${item.count}${item.ready?`, ${translate('Belohnungen')}: ${item.ready}`:''}`} accessibilityState={{selected:tab===item.id}} aria-selected={tab===item.id} onPress={()=>onTab(item.id)} style={[styles.tab,tab===item.id&&styles.activeTab]}><Txt style={[styles.tabLabel,tab===item.id&&{color:C.accent}]}>{item.label}</Txt><View style={{flexDirection:'row',gap:4,alignItems:'center'}}><Txt muted style={{fontSize:10}}>{item.count}</Txt>{!!item.ready&&<View accessible accessibilityLabel={`${translate('Belohnungen')}: ${item.ready}`} style={styles.ready}><Icon name="reward" size={11} color={C.gold}/><Txt gold style={{fontSize:10}}>{item.ready}</Txt></View>}</View></Pressable>)}</View>
  {tab==='running'?<RunningOrders data={data} clock={clock} busy={busy} onOpen={onOpen} onClaim={onClaim} onMission={onMission}/>:tab==='saved'?<>
   {typeKey&&<Btn secondary style={{marginTop:0,marginBottom:10}} onPress={()=>onType(null)}>Alle Aufträge</Btn>}
   <SavedOrders data={data} clock={clock} busy={busy} onOpen={onOpen} onJob={onJob} typeKey={typeKey} onType={onType}/>
  </>:<>
   <View style={styles.refresh}><Txt muted style={styles.small}>Neu {remaining(data.state.nextAutoRefreshAt,clock)}</Txt><Btn secondary style={{marginTop:0,flex:1}} disabled={busy||data.state.coins<data.refreshCost} onPress={onRefresh}>Wechseln · {n(data.refreshCost)} M</Btn></View>
   {available.map((o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} busy={busy} onPin={onPin} onOpen={onOpen}/>)}{!available.length&&<Empty>Keine Angebote.</Empty>}
  </>}
 </>;
}
export function SavedOrders({data,clock,busy,onOpen,onJob,typeKey,onType}:any){
 const allOrders=data.state.orders.filter((o:any)=>!o.isProject&&o.status==='queued');
 const allJobs=data.state.expedition.jobs;
 const groups=[
  {key:'material',name:itemName('material',2),count:allJobs.filter((j:any)=>j.kind==='material').length},
  {key:'character',name:itemName('character',2),count:allJobs.filter((j:any)=>j.kind==='character').length},
  {key:'private',name:itemName('private',2),count:allOrders.filter((o:any)=>o.kind==='private').length},
  {key:'customer',name:itemName('customer',2),count:allOrders.filter((o:any)=>o.kind!=='private').length}
 ].filter(g=>g.count>0);
 if(!typeKey)return <>{groups.map(group=><Pressable key={group.key} accessibilityRole="button" accessibilityLabel={translate(`${group.name}, Anzahl ${group.count}`)} onPress={()=>onType(group.key)}><Card style={styles.saved}><Row style={{marginBottom:0}}><ItemArt id={group.key} size={52}/><View style={{flex:1}}><Txt style={styles.title}>{group.name}</Txt><Txt muted style={styles.small}>Anzahl {group.count}</Txt></View><Icon name="chevron" size={17} color={C.muted}/></Row></Card></Pressable>)}{!groups.length&&<Empty>Keine Aufträge verfügbar.</Empty>}</>;
 const queued=allOrders.filter((o:any)=>typeKey==='private'?o.kind==='private':typeKey==='customer'?o.kind!=='private':false);
 const jobs=allJobs.filter((j:any)=>j.kind===typeKey),free=data.state.trucks.some((t:any)=>t.free&&t.tier>=2);
 const ranks=[1,2,3].map(rank=>({rank,entries:jobs.filter((job:any)=>expeditionRank(job)===rank)})).filter(group=>group.entries.length);
 return <>{ranks.map(group=><Pressable key={group.rank} accessibilityRole="button" accessibilityLabel={translate(`${expeditionName(typeKey)}, Rang ${group.rank}, Anzahl ${group.entries.length}`)} disabled={busy} onPress={()=>onJob(group.entries[0])}><Card style={[styles.offer,rankStyle(group.rank)]}><Row style={{marginBottom:3}}><ItemArt id={`job:${typeKey}:${group.rank}`} size={48}/><Txt style={[styles.title,{flex:1}]}>{expeditionName(typeKey)}</Txt><Pill>Rang {group.rank}</Pill></Row><Row style={{marginBottom:0}}><Txt muted style={styles.small}>Anzahl {group.entries.length}</Txt><Txt muted style={styles.small}>{group.rank*20} t</Txt></Row>{!free&&<Txt muted style={styles.small}>Passender LKW im Einsatz oder nicht vorhanden</Txt>}</Card></Pressable>)}{queued.map((o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>)}{!queued.length&&!jobs.length&&<Empty>Keine Aufträge verfügbar.</Empty>}</>;
}
export function RunningOrders({data,clock,busy,onOpen,onClaim,onMission}:any){
 const orders=data.state.orders.filter((o:any)=>!o.isProject),active=orders.filter((o:any)=>o.status==='active'),ready=orders.filter((o:any)=>o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
 const tile=(o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>;
 const missions=endlessMissions(data);
 return <>{!!ready.length&&<Btn disabled={busy} style={{marginTop:0,marginBottom:12}} onPress={onClaim}>Belohnungen abholen · {ready.length}</Btn>}{missions.map((m:any)=><Pressable key={`mission-${m.id}`} accessibilityRole="button" accessibilityLabel={translate(`${expeditionName(m.lootKind)}, unterwegs, ${m.id}`)} onPress={()=>onMission(m)}><Card style={[styles.offer,{borderLeftColor:C.accent}]}><Row style={{marginBottom:3}}><ItemArt id={`job:${m.lootKind}:${m.tier||1}`} size={44}/><Txt style={[styles.title,{flex:1}]}>{expeditionName(m.lootKind)}</Txt><Txt gold style={styles.small}>{remaining(m.endsAt,clock)}</Txt></Row><Txt muted style={styles.small}>{data.catalog.regionNames[m.region]} · {data.state.trucks.find((t:any)=>t.id===m.truckId)?.model||'Fahrzeug'}</Txt><Bar value={(clock-m.startedAt)/(m.endsAt-m.startedAt)*100}/></Card></Pressable>)}{active.map(tile)}{!active.length&&!missions.length&&!ready.length&&<Empty>Keine Aufträge unterwegs.</Empty>}</>;
}

function VehicleOrderQuote({quote:q,selected=false,onSelect,busy,active=false,relationship=0,card}:any){
 const [expanded,setExpanded]=useState(false);
 const metric=(label:string,value:string,profit=false)=><View style={styles.metric}><Txt muted style={styles.metricLabel}>{label}</Txt><Txt style={[styles.metricValue,profit&&{color:q.totalProfit<0?C.red:C.accent}]}>{value}</Txt></View>;
 const facts=<>
  <Row style={{marginBottom:7,flexWrap:'nowrap'}}>{card&&<VehicleArt card={card} style={{width:48}}/>}<Txt style={{fontWeight:'700',flex:1}}>{q.model} · {n(q.capacity,1)} t</Txt>{onSelect&&<View style={{width:20}}>{selected&&<Icon name="check" size={18} color={C.accent}/>}</View>}</Row>
  <View style={styles.metrics}>
   {metric(active?'Resttouren':'Touren',n(q.trips+(active?1:0)))}
   {metric(active?'Restzeit':'Dauer',minutes(q.seconds))}
   {metric('XP',n(q.xp,2))}
   {metric('Gewinn',`${n(q.totalProfit,2)} M`,true)}
  </View>
 </>;
 const fact=(label:string,value:string)=><Row style={{marginBottom:5}}><Txt muted style={styles.small}>{label}</Txt><Txt style={styles.small}>{value}</Txt></Row>;
 return <View style={[styles.vehicle,selected&&{borderColor:C.accent,backgroundColor:C.greenWash}]}>
  {onSelect?<Pressable accessibilityRole="button" accessibilityLabel={translate(`${q.model}, ${q.id} auswählen`)} accessibilityState={{selected,disabled:busy}} disabled={busy} onPress={onSelect}>{facts}</Pressable>:facts}
  <Pressable accessibilityRole="button" accessibilityLabel={translate(expanded?'Weniger Infos':'Weitere Infos')} accessibilityState={{expanded}} onPress={()=>setExpanded(value=>!value)} hitSlop={{top:7,bottom:7}} style={styles.quoteDisclosure}><Txt style={styles.metricLabel}>{expanded?'Weniger Infos':'Weitere Infos'}</Txt><Icon name="chevron" size={13} style={{transform:[{rotate:expanded?'90deg':'0deg'}]}}/></Pressable>
  {expanded&&<View style={styles.quoteDetails}>
   {fact('Auftragsertrag',`${n(q.revenue,2)} M`)}
   {fact('Betriebskosten',`${n(q.cost,2)} M`)}
   {fact('Abschlussprämie',`${n(q.bonus,2)} M`)}
   {!!relationship&&fact('Beziehung',`+${relationship}`)}
   <Txt muted style={styles.metricLabel}>Gewinn inklusive Abschlussprämie.</Txt>
   {active&&<Txt muted style={styles.metricLabel}>Laufende Tour gespeichert, Folgetouren mit aktuellen Werten. XP und Gewinn gelten für den gesamten Auftrag.</Txt>}
  </View>}
 </View>;
}
function PossibleOrderRewards({labels,modalBlocked=false}: {labels:string[];modalBlocked?:boolean}){
 const [open,setOpen]=useState(false);
 const appearance=(label:string):{icon:IconName;color:string}=>{
  if(label.includes('Common-Zahnräder'))return {icon:'gear',color:rarityColor('common')};
  if(label.includes('Uncommon-Zahnräder'))return {icon:'gear',color:rarityColor('uncommon')};
  if(label.includes('Rare-Zahnräder'))return {icon:'gear',color:rarityColor('rare')};
  if(label.includes('Lieferantenkontakte'))return {icon:'customers',color:C.gold};
  if(label.includes('Firmenausbau-Items'))return {icon:'company',color:C.gold};
  if(label.includes('Sonderauftrag'))return {icon:'projects',color:rarityColor('rare')};
  return {icon:'reward',color:C.gold};
 };
 return <Card style={{padding:12}}><Row style={{marginBottom:4,flexWrap:'nowrap'}}><Txt style={[styles.small,{flex:1}]}>Mögliche Belohnungen</Txt><Btn icon="help" iconOnly secondary onPress={()=>setOpen(true)}>Mögliche Belohnungen</Btn></Row><View style={styles.possibleRewards}>{labels.map(label=>{
  const {icon,color}=appearance(label);
  return <Pressable key={label} accessibilityRole="button" accessibilityLabel={translate(label)} onPress={()=>setOpen(true)} style={[styles.possibleItem,{borderColor:color}]}>{icon==='gear'?<ItemArt id={`gear:${label.includes('Uncommon')?'uncommon':label.includes('Rare')?'rare':'common'}`} size={38}/>:icon==='customers'?<ItemArt id="supplierContacts" size={38}/>:icon==='company'?<ItemArt id="companyItems" size={38}/>:icon==='projects'?<ItemArt id="special" size={38}/>:<Icon name={icon} color={color} size={24}/>}</Pressable>;
 })}</View><ExpeditionPlaceModal visible={open&&!modalBlocked} title="Mögliche Belohnungen" onClose={()=>setOpen(false)}>{labels.map(label=><Txt key={label} style={{marginBottom:8}}>{label}</Txt>)}</ExpeditionPlaceModal></Card>;
}

export function OrderDetail({data,id,busy,clock,onCommand,onBack,onSwitch,modalBlocked=false}:any){
 const o=data.state.orders.find((o:any)=>o.id===id&&!o.isProject);
 const [picking,setPicking]=useState(false);
 if(!o)return <Card><Txt muted>Angebot nicht mehr verfügbar.</Txt><Btn secondary onPress={onBack}>Zur Übersicht</Btn></Card>;
 const active=o.status==='active',done=o.status==='completed',forecast=o.forecast;
 const truck=data.state.trucks.find((t:any)=>t.id===o.truckId);
 const fact=(label:string,value:string)=><Row><Txt muted>{label}</Txt><Txt style={{textAlign:'right'}}>{value}</Txt></Row>;
 const reward=o.completionReward;
 return <>
  <Card><Row><ItemArt id={`order:${o.kind==='private'?'private':'customer'}`} size={44}/><Txt style={[styles.title,{flex:1}]}>{o.cargo}</Txt><Txt muted style={styles.small}>{o.id}</Txt></Row><Txt muted>{transportSummary(o,!active&&!done?forecast?.seconds:undefined)}</Txt><Row style={{marginTop:12}}><Txt>{n(o.volume,1)} t · {n(o.distance)} km</Txt><Pill gold={!!o.customer}>{o.customer?o.customerName:o.routeType==='dual'?'Dual Way':'Single Way'}</Pill></Row>
   {active&&<><Bar value={progress(o,clock)}/>{fact('LKW',truck?.model||'—')}{fact('Restzeit',remaining(o.runningEndsAt||clock,clock))}{fact('Geliefert',`${n(o.delivered,1)} / ${n(o.volume)} t`)}
    {o.pendingTruckName&&<Txt gold style={styles.small}>Ab nächster Tour: {o.pendingTruckName}</Txt>}
    <Btn secondary disabled={busy} onPress={()=>onSwitch(o)}>Fahrzeug für nächste Tour wechseln</Btn>
   </>}
  </Card>
  {!done&&<PossibleOrderRewards labels={o.possibleRewards||[]} modalBlocked={modalBlocked}/>}
  {!active&&!done&&<Card>
   <Btn disabled={busy} style={{marginTop:0}} onPress={()=>setPicking(true)}>Fahrzeug wählen</Btn>
   {!o.choices.length&&<Txt muted style={[styles.small,{marginTop:8}]}>{unavailable(o)}</Txt>}
   {o.status==='available'&&<Btn secondary disabled={busy} onPress={()=>onCommand('pin',{id:o.id})}>{o.pinned?'Freigeben':'Angebot halten'}</Btn>}
  </Card>}
  {picking&&!active&&!done&&<OrderVehiclePicker key={o.id} data={data} choices={o.vehicleChoices||o.choices.map((q:any)=>({...q,free:true}))} summary={`${translate(o.cargo)} · ${n(o.volume,1)} t · ${n(o.distance)} km`} busy={busy} clock={clock} modalBlocked={modalBlocked} onClose={()=>setPicking(false)} onStart={async(truck:string)=>{
   const next=await onCommand(o.kind==='private'?'assignPrivate':o.crafted?'assignCrafted':'assign',{order:o.id,truck});
   return next?.state.orders.find((order:any)=>order.id===o.id)?.status==='active';
  }}/>}
  {active&&forecast&&<Card><Txt style={styles.title}>Fahrzeug</Txt><VehicleOrderQuote card={data.catalog.cards.find((card:any)=>card.id===truck?.cardId)} quote={{...forecast,seconds:Math.max(0,((o.runningEndsAt||clock)-clock)/1000)}} active relationship={o.relationshipReward}/></Card>}
  {done&&reward?<Card><Txt style={[styles.title,{marginBottom:12}]}>Abschlussprämie</Txt>{fact('Münzen',`${n(reward.coins,2)} M`)}{Object.entries(reward.gears||{}).filter(([,amount])=>Number(amount)>0).map(([rarity,amount])=><View key={rarity}><ItemAmount id={`gear:${rarity}`} label={`${data.catalog.rarities.find((r:any)=>r.id===rarity)?.label||rarity}-Zahnräder`} amount={Number(amount)}/></View>)}{reward.companyItems>0&&<ItemAmount id="companyItems" amount={reward.companyItems}/>}{reward.capacityModule&&<ItemAmount id="capacityModules" amount={1}/>}{reward.supplierContacts>0&&<ItemAmount id="supplierContacts" amount={reward.supplierContacts}/>}{!reward.claimedAt?<Btn disabled={busy} onPress={()=>onCommand('claim',{id:o.id})}>Prämie abholen</Btn>:<Txt muted>Abgeholt</Txt>}</Card>:null}
 </>;
}
const styles=StyleSheet.create({compactOffer:{position:'relative',padding:10},offerMain:{flexDirection:'row',alignItems:'flex-start',gap:9,minHeight:44},offerCopy:{flex:1,minWidth:0},pinnableCopy:{paddingRight:36},offerFacts:{gap:2,marginTop:3},offerFact:{flexDirection:'row',alignItems:'center',gap:6},factValue:{fontSize:11,lineHeight:17},pinButton:{position:'absolute',right:6,top:3,width:44,height:44,alignItems:'center',justifyContent:'center',borderRadius:6},traits:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:5,marginTop:7},trait:{flexDirection:'row',alignItems:'center',gap:4,flexShrink:1},traitLabel:{fontSize:11,lineHeight:16},signal:{width:15,height:14,flexDirection:'row',alignItems:'flex-end',gap:2,paddingBottom:1},directions:{height:19,width:18,justifyContent:'center'},tabs:{flexDirection:'row',gap:5,marginBottom:14},tab:{flex:1,minHeight:54,alignItems:'center',justifyContent:'center',gap:2,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,borderRadius:6},activeTab:{backgroundColor:C.greenWash,borderColor:C.accent},tabLabel:{fontSize:12,fontWeight:'700'},ready:{flexDirection:'row',alignItems:'center',gap:3},metrics:{flexDirection:'row',flexWrap:'wrap',gap:6},metric:{width:'48%',minWidth:0,flexDirection:'row',alignItems:'baseline',gap:5},metricLabel:{fontSize:10,lineHeight:15},metricValue:{fontSize:11,lineHeight:16,fontWeight:'700',flexShrink:1},quoteDisclosure:{minHeight:30,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:C.line,marginTop:5},quoteDetails:{paddingTop:2},possibleRewards:{flexDirection:'row',flexWrap:'wrap',gap:6},possibleItem:{width:44,height:44,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderRadius:6},possibleLabel:{fontSize:10,lineHeight:14,textAlign:'center'},title:{fontSize:15,fontWeight:'700'},small:{fontSize:12,lineHeight:18},section:{fontSize:13,fontWeight:'700',color:C.muted,marginTop:10,marginBottom:9},offer:{padding:12,backgroundColor:C.panel,borderColor:C.line,borderLeftWidth:3,marginBottom:9},saved:{padding:12,backgroundColor:C.panel,borderColor:C.line},running:{padding:12,backgroundColor:C.greenWash,borderColor:C.accent},refresh:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},vehicle:{padding:10,borderWidth:1,borderColor:C.line,borderRadius:10,marginTop:10}});
