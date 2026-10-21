import {t as translate} from './i18n';
import {Icon,IconName} from './Icon';
import {itemName,rarityColor} from './items';
import React,{useState} from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining,minutes} from './ui';
const durationBand=(seconds:number)=>seconds<=300?'Kurz':seconds<=900?'Mittel':'Lang';
const transportSummary=(o:any,seconds?:number)=>`${o.transportLabel||({international:'Fernverkehr',city:'Stadtverkehr',national:'Regionalverkehr'} as Record<string,string>)[o.category]||'Regionalverkehr'} · ${seconds!=null?durationBand(seconds):o.durationBand||durationBand(o.durationSeconds??o.forecast?.seconds??0)}`;
const unavailable=(o:any)=>o.vehicleStatus==='missing'?'Passender LKW fehlt':'Passender LKW im Einsatz';
const rankStyle=(rank:number)=>rank===3?{backgroundColor:C.blueWash,borderColor:C.rare,borderLeftColor:C.rare}:rank===2?{backgroundColor:C.greenWash,borderColor:C.uncommon,borderLeftColor:C.uncommon}:{backgroundColor:C.raised,borderColor:C.common,borderLeftColor:C.common};
const expeditionRank=(job:any)=>[1,2,3].includes(job.tier)?job.tier:1;
const expeditionName=(kind:string)=>itemName(kind==='character'?'character':'material');
const endlessMissions=(data:any)=>data.state.expedition.missions.filter((m:any)=>m.kind==='endless'&&m.status==='active');
const section=(name:string)=><Txt style={styles.section}>{name}</Txt>;
function progress(o:any,clock:number){
 if(o.status==='completed')return 100;
 const fraction=o.tripEndsAt?Math.max(0,Math.min(1,(clock-o.tripStartAt)/(o.tripEndsAt-o.tripStartAt))):0;
 return Math.min(100,((o.delivered||0)+(o.tripCargo||0)*fraction)/o.volume*100);
}
function OrderTile({order:o,data,clock,onOpen}:any){
 const active=o.status==='active',done=o.status==='completed',truck=data.state.trucks.find((t:any)=>t.id===o.truckId);
 return <Pressable accessibilityRole="button" accessibilityLabel={translate(`${o.cargo}, ${o.id}`)} onPress={()=>onOpen(o.id)}>
  <Card style={[styles.offer,{borderLeftColor:active?C.accent:o.customer?C.gold:C.rare}]}>
   <Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={[styles.title,{flex:1}]}>{o.cargo}</Txt>{active?<Txt gold style={styles.small}>{remaining(o.runningEndsAt||clock,clock)}</Txt>:done?<Pill gold>Prämie</Pill>:<Txt style={styles.small}>{n(o.volume,1)} t · {n(o.distance)} km</Txt>}</Row>
   <Txt muted style={styles.small}>{transportSummary(o)}{o.routeType==='single'?' · Single Way':o.routeType==='dual'?' · Dual Way':''}</Txt>
   {active?<><Row style={{marginTop:5,marginBottom:0}}><Txt muted style={styles.small}>{truck?.model||'Fahrzeug'}</Txt><Txt muted style={styles.small}>{n(o.delivered,1)} / {n(o.volume)} t</Txt></Row><Bar value={progress(o,clock)}/></>:<Row style={{marginBottom:0,marginTop:5}}>{o.customer&&<Txt gold style={styles.small}>{o.customerName}</Txt>}{!done&&!o.choices.length?<Txt muted style={styles.small}>{unavailable(o)}</Txt>:o.pinned?<Txt muted style={styles.small}>Gehalten</Txt>:null}</Row>}
  </Card>
 </Pressable>;
}
export function Orders({data,clock,busy,onOpen,onRunning,onSaved,onRefresh,onClaim}:any){
 const orders=data.state.orders.filter((o:any)=>!o.isProject),active=orders.filter((o:any)=>o.status==='active');
 const available=orders.filter((o:any)=>o.status==='available'),queued=orders.filter((o:any)=>o.status==='queued'),rewards=orders.filter((o:any)=>o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
 const runningCount=active.length+endlessMissions(data).length;
 const savedCount=queued.length+data.state.expedition.jobs.length;
 const tile=(o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>;
 return <>
  {!!runningCount&&<Pressable accessibilityRole="button" accessibilityLabel={translate(`${runningCount} ${runningCount===1?'Auftrag':'Aufträge'} laufend`)} onPress={onRunning}><Card style={styles.running}><Row style={{marginBottom:0}}><Txt style={{fontWeight:'700'}}>{runningCount} {runningCount===1?'Auftrag':'Aufträge'} laufend</Txt><Icon name="chevron" size={17} color={C.accent}/></Row></Card></Pressable>}
  {!!rewards.length&&<Btn disabled={busy} style={{marginTop:0,marginBottom:12}} onPress={onClaim}>Prämien abholen · {rewards.length}</Btn>}
  <Pressable accessibilityRole="button" accessibilityLabel={translate(`Aufträge aus Vorräten, ${savedCount} verfügbar`)} onPress={onSaved}><Card style={styles.saved}><Row style={{marginBottom:0}}><Txt style={{fontWeight:'700',flex:1}}>Aufträge aus Vorräten</Txt><Pill>{savedCount}</Pill><Icon name="chevron" size={17} color={C.muted}/></Row></Card></Pressable>
  <View style={styles.refresh}><Txt muted style={styles.small}>Neu {remaining(data.state.nextAutoRefreshAt,clock)}</Txt><Btn secondary style={{marginTop:0,flex:1}} disabled={busy||data.state.coins<data.refreshCost} onPress={onRefresh}>Wechseln · {n(data.refreshCost)} M</Btn></View>
  {section('Angebote')}{available.map(tile)}{!available.length&&<Empty>Keine Angebote.</Empty>}
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
 if(!typeKey)return <>{groups.map(group=><Pressable key={group.key} accessibilityRole="button" accessibilityLabel={translate(`${group.name}, Anzahl ${group.count}`)} onPress={()=>onType(group.key)}><Card style={styles.saved}><Row style={{marginBottom:0}}><View style={{flex:1}}><Txt style={styles.title}>{group.name}</Txt><Txt muted style={styles.small}>Anzahl {group.count}</Txt></View><Icon name="chevron" size={17} color={C.muted}/></Row></Card></Pressable>)}{!groups.length&&<Empty>Keine Aufträge verfügbar.</Empty>}</>;
 const queued=allOrders.filter((o:any)=>typeKey==='private'?o.kind==='private':typeKey==='customer'?o.kind!=='private':false);
 const jobs=allJobs.filter((j:any)=>j.kind===typeKey),free=data.state.trucks.some((t:any)=>t.free&&t.tier>=2);
 const ranks=[1,2,3].map(rank=>({rank,entries:jobs.filter((job:any)=>expeditionRank(job)===rank)})).filter(group=>group.entries.length);
 return <>{ranks.map(group=><Pressable key={group.rank} accessibilityRole="button" accessibilityLabel={translate(`${expeditionName(typeKey)}, Rang ${group.rank}, Anzahl ${group.entries.length}`)} disabled={busy} onPress={()=>onJob(group.entries[0])}><Card style={[styles.offer,rankStyle(group.rank)]}><Row style={{marginBottom:3}}><Txt style={[styles.title,{flex:1}]}>{expeditionName(typeKey)}</Txt><Pill>Rang {group.rank}</Pill></Row><Row style={{marginBottom:0}}><Txt muted style={styles.small}>Anzahl {group.entries.length}</Txt><Txt muted style={styles.small}>{group.rank*20} t</Txt></Row>{!free&&<Txt muted style={styles.small}>Passender LKW im Einsatz oder nicht vorhanden</Txt>}</Card></Pressable>)}{queued.map((o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>)}{!queued.length&&!jobs.length&&<Empty>Keine Aufträge verfügbar.</Empty>}</>;
}
export function RunningOrders({data,clock,busy,onOpen,onClaim,onMission}:any){
 const orders=data.state.orders.filter((o:any)=>!o.isProject),active=orders.filter((o:any)=>o.status==='active'),ready=orders.filter((o:any)=>o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
 const tile=(o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>;
 const missions=endlessMissions(data);
 return <>{missions.map((m:any)=><Pressable key={`mission-${m.id}`} accessibilityRole="button" accessibilityLabel={translate(`${expeditionName(m.lootKind)}, unterwegs, ${m.id}`)} onPress={()=>onMission(m)}><Card style={[styles.offer,{borderLeftColor:C.accent}]}><Row style={{marginBottom:3}}><Txt style={[styles.title,{flex:1}]}>{expeditionName(m.lootKind)}</Txt><Txt gold style={styles.small}>{remaining(m.endsAt,clock)}</Txt></Row><Txt muted style={styles.small}>{data.catalog.regionNames[m.region]} · {data.state.trucks.find((t:any)=>t.id===m.truckId)?.model||'Fahrzeug'}</Txt><Bar value={(clock-m.startedAt)/(m.endsAt-m.startedAt)*100}/></Card></Pressable>)}{!!ready.length&&<Btn disabled={busy} style={{marginTop:0,marginBottom:12}} onPress={onClaim}>Prämien abholen · {ready.length}</Btn>}{active.map(tile)}{!active.length&&!missions.length&&<Empty>Keine Aufträge unterwegs.</Empty>}{!!ready.length&&<>{section('Prämien')}{ready.map(tile)}</>}</>;
}

function VehicleOrderQuote({quote:q,selected=false,onSelect,busy,active=false,relationship=0}:any){
 const [expanded,setExpanded]=useState(false);
 const metric=(label:string,value:string,profit=false)=><View style={styles.metric}><Txt muted style={styles.metricLabel}>{label}</Txt><Txt style={[styles.metricValue,profit&&{color:q.totalProfit<0?C.red:C.accent}]}>{value}</Txt></View>;
 const facts=<>
  <Row style={{marginBottom:7,flexWrap:'nowrap'}}><Txt style={{fontWeight:'700',flex:1}}>{q.model} · {n(q.capacity,1)} t</Txt>{onSelect&&<View style={{width:20}}>{selected&&<Icon name="check" size={18} color={C.accent}/>}</View>}</Row>
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
function PossibleOrderRewards({labels}: {labels:string[]}){
 const appearance=(label:string):{icon:IconName;color:string}=>{
  if(label.includes('Common-Zahnräder'))return {icon:'gear',color:rarityColor('common')};
  if(label.includes('Uncommon-Zahnräder'))return {icon:'gear',color:rarityColor('uncommon')};
  if(label.includes('Rare-Zahnräder'))return {icon:'gear',color:rarityColor('rare')};
  if(label.includes('Lieferantenkontakte'))return {icon:'customers',color:C.gold};
  if(label.includes('Firmenausbau-Items'))return {icon:'company',color:C.gold};
  if(label.includes('Sonderauftrag'))return {icon:'projects',color:rarityColor('rare')};
  return {icon:'reward',color:C.gold};
 };
 return <Card><Txt style={[styles.title,{marginBottom:8}]}>Mögliche Belohnungen</Txt><View style={styles.possibleRewards}>{labels.map(label=>{
  const {icon,color}=appearance(label);
  return <View key={label} accessible accessibilityLabel={translate(label)} style={[styles.possibleItem,{borderColor:color}]}><Icon name={icon} color={color} size={25}/><Txt style={styles.possibleLabel}>{label}</Txt></View>;
 })}</View></Card>;
}

export function OrderDetail({data,id,busy,clock,onCommand,onBack,onSwitch}:any){
 const o=data.state.orders.find((o:any)=>o.id===id&&!o.isProject);
 const [truckId,setTruckId]=useState<string|null>(o?.choices[0]?.id||null);
 if(!o)return <Card><Txt muted>Angebot nicht mehr verfügbar.</Txt><Btn secondary onPress={onBack}>Zur Übersicht</Btn></Card>;
 const active=o.status==='active',done=o.status==='completed',selected=o.choices.find((t:any)=>t.id===truckId),forecast=active?o.forecast:selected||o.forecast;
 const truck=data.state.trucks.find((t:any)=>t.id===o.truckId);
 const fact=(label:string,value:string)=><Row><Txt muted>{label}</Txt><Txt style={{textAlign:'right'}}>{value}</Txt></Row>;
 const reward=o.completionReward;
 return <>
  <Card><Row><Txt style={[styles.title,{flex:1}]}>{o.cargo}</Txt><Txt muted style={styles.small}>{o.id}</Txt></Row><Txt muted>{transportSummary(o,!active&&!done?forecast?.seconds:undefined)}</Txt><Row style={{marginTop:12}}><Txt>{n(o.volume,1)} t · {n(o.distance)} km</Txt><Pill gold={!!o.customer}>{o.customer?o.customerName:o.routeType==='dual'?'Dual Way':'Single Way'}</Pill></Row>
   {active&&<><Bar value={progress(o,clock)}/>{fact('LKW',truck?.model||'—')}{fact('Restzeit',remaining(o.runningEndsAt||clock,clock))}{fact('Geliefert',`${n(o.delivered,1)} / ${n(o.volume)} t`)}
    {o.pendingTruckName&&<Txt gold style={styles.small}>Ab nächster Tour: {o.pendingTruckName}</Txt>}
    <Btn secondary disabled={busy} onPress={()=>onSwitch(o)}>Fahrzeug für nächste Tour wechseln</Btn>
   </>}
  </Card>
  {!done&&<PossibleOrderRewards labels={o.possibleRewards||[]}/>}
  {!active&&!done&&<Card>
   {!o.choices.length?<Txt muted>{unavailable(o)}</Txt>:<><Txt style={styles.title}>Fahrzeug</Txt>{o.choices.map((t:any)=><VehicleOrderQuote key={t.id} quote={t} selected={truckId===t.id} busy={busy} relationship={o.relationshipReward} onSelect={()=>setTruckId(t.id)}/>)}<Btn disabled={busy||!selected} onPress={()=>onCommand(o.kind==='private'?'assignPrivate':o.crafted?'assignCrafted':'assign',{order:o.id,truck:selected.id})}>Auftrag starten</Btn></>}
   {o.status==='available'&&<Btn secondary disabled={busy} onPress={()=>onCommand('pin',{id:o.id})}>{o.pinned?'Freigeben':'Angebot halten'}</Btn>}
  </Card>}
  {active&&forecast&&<Card><Txt style={styles.title}>Fahrzeug</Txt><VehicleOrderQuote quote={{...forecast,seconds:Math.max(0,((o.runningEndsAt||clock)-clock)/1000)}} active relationship={o.relationshipReward}/></Card>}
  {done&&reward?<Card><Txt style={[styles.title,{marginBottom:12}]}>Abschlussprämie</Txt>{fact('Münzen',`${n(reward.coins,2)} M`)}{Object.entries(reward.gears||{}).filter(([,amount])=>Number(amount)>0).map(([rarity,amount])=><View key={rarity}>{fact(`${data.catalog.rarities.find((r:any)=>r.id===rarity)?.label||rarity}-Zahnräder`,n(amount))}</View>)}{reward.companyItems>0&&fact(itemName('companyItems',2),n(reward.companyItems))}{reward.capacityModule&&fact('Kapazitätsmodul','1')}{reward.supplierContacts>0&&fact('Lieferantenkontakte',n(reward.supplierContacts))}{!reward.claimedAt?<Btn disabled={busy} onPress={()=>onCommand('claim',{id:o.id})}>Prämie abholen</Btn>:<Txt muted>Abgeholt</Txt>}</Card>:null}
 </>;
}
const styles=StyleSheet.create({metrics:{flexDirection:'row',flexWrap:'wrap',gap:6},metric:{width:'48%',minWidth:0,flexDirection:'row',alignItems:'baseline',gap:5},metricLabel:{fontSize:10,lineHeight:15},metricValue:{fontSize:11,lineHeight:16,fontWeight:'700',flexShrink:1},quoteDisclosure:{minHeight:30,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:C.line,marginTop:5},quoteDetails:{paddingTop:2},possibleRewards:{flexDirection:'row',flexWrap:'wrap',gap:6},possibleItem:{width:'31%',minWidth:0,alignItems:'center',backgroundColor:C.raised,borderWidth:1,borderRadius:8,padding:6,gap:4},possibleLabel:{fontSize:10,lineHeight:14,textAlign:'center'},title:{fontSize:15,fontWeight:'700'},small:{fontSize:12,lineHeight:18},section:{fontSize:13,fontWeight:'700',color:C.muted,marginTop:10,marginBottom:9},offer:{padding:12,backgroundColor:C.panel,borderColor:C.line,borderLeftWidth:3,marginBottom:9},saved:{padding:12,backgroundColor:C.panel,borderColor:C.line},running:{padding:12,backgroundColor:C.greenWash,borderColor:C.accent},refresh:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},vehicle:{padding:10,borderWidth:1,borderColor:C.line,borderRadius:10,marginTop:10}});
