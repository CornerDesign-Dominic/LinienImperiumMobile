import React,{useState} from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining,minutes} from './ui';
const unavailable=(o:any)=>o.vehicleStatus==='missing'?'Passender LKW fehlt':'Passender LKW im Einsatz';
const rankStyle=(rank:number)=>rank===3?{backgroundColor:'#192B40',borderColor:'#619CE8',borderLeftColor:'#619CE8'}:rank===2?{backgroundColor:'#193026',borderColor:'#5BAA78',borderLeftColor:'#5BAA78'}:{backgroundColor:'#202831',borderColor:'#788796',borderLeftColor:'#788796'};
const expeditionRank=(job:any)=>[1,2,3].includes(job.tier)?job.tier:1;
const expeditionName=(kind:string)=>kind==='character'?'Fahrzeugkartenauftrag':'Materialauftrag';
const endlessMissions=(data:any)=>data.state.expedition.missions.filter((m:any)=>m.kind==='endless'&&m.status==='active');
const section=(name:string)=><Txt style={styles.section}>{name}</Txt>;
function progress(o:any,clock:number){
 if(o.status==='completed')return 100;
 const fraction=o.tripEndsAt?Math.max(0,Math.min(1,(clock-o.tripStartAt)/(o.tripEndsAt-o.tripStartAt))):0;
 return Math.min(100,((o.delivered||0)+(o.tripCargo||0)*fraction)/o.volume*100);
}
function OrderTile({order:o,data,clock,onOpen}:any){
 const active=o.status==='active',done=o.status==='completed',truck=data.state.trucks.find((t:any)=>t.id===o.truckId);
 return <Pressable accessibilityRole="button" accessibilityLabel={`${o.cargo}, ${o.id}`} onPress={()=>onOpen(o.id)}>
  <Card style={[styles.offer,{borderLeftColor:active?C.accent:o.customer?C.gold:'#526B88'}]}>
   <Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={[styles.title,{flex:1}]}>{o.cargo}</Txt>{active?<Txt gold style={styles.small}>{remaining(o.runningEndsAt||clock,clock)}</Txt>:done?<Pill gold>Prämie</Pill>:<Txt style={styles.small}>{n(o.volume,1)} t · {n(o.distance)} km</Txt>}</Row>
   <Txt muted style={styles.small}>{o.from} → {o.to}</Txt>
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
  {!!runningCount&&<Pressable accessibilityRole="button" accessibilityLabel={`${runningCount} ${runningCount===1?'Auftrag':'Aufträge'} laufend`} onPress={onRunning}><Card style={styles.running}><Row style={{marginBottom:0}}><Txt style={{fontWeight:'700'}}>{runningCount} {runningCount===1?'Auftrag':'Aufträge'} laufend</Txt><Txt style={{color:C.accent}}>›</Txt></Row></Card></Pressable>}
  {!!rewards.length&&<Btn disabled={busy} style={{marginTop:0,marginBottom:12}} onPress={onClaim}>Prämien abholen · {rewards.length}</Btn>}
  <Pressable accessibilityRole="button" accessibilityLabel={`Aufträge aus Vorräten, ${savedCount} verfügbar`} onPress={onSaved}><Card style={styles.saved}><Row style={{marginBottom:0}}><Txt style={{fontWeight:'700',flex:1}}>Aufträge aus Vorräten</Txt><Pill>{savedCount}</Pill><Txt muted>›</Txt></Row></Card></Pressable>
  <View style={styles.refresh}><Txt muted style={styles.small}>Neu {remaining(data.state.nextAutoRefreshAt,clock)}</Txt><Btn secondary style={{marginTop:0,flex:1}} disabled={busy||data.state.coins<data.refreshCost} onPress={onRefresh}>Wechseln · {n(data.refreshCost)} M</Btn></View>
  {section('Angebote')}{available.map(tile)}{!available.length&&<Empty>Keine Angebote.</Empty>}
 </>;
}
export function SavedOrders({data,clock,busy,onOpen,onJob,typeKey,onType}:any){
 const allOrders=data.state.orders.filter((o:any)=>!o.isProject&&o.status==='queued');
 const allJobs=data.state.expedition.jobs;
 const groups=[
  {key:'material',name:'Materialaufträge',count:allJobs.filter((j:any)=>j.kind==='material').length},
  {key:'character',name:'Fahrzeugkartenaufträge',count:allJobs.filter((j:any)=>j.kind==='character').length},
  {key:'private',name:'Privatabholungen',count:allOrders.filter((o:any)=>o.kind==='private').length},
  {key:'customer',name:'Kundenaufträge',count:allOrders.filter((o:any)=>o.kind!=='private').length}
 ].filter(g=>g.count>0);
 if(!typeKey)return <>{groups.map(group=><Pressable key={group.key} accessibilityRole="button" accessibilityLabel={`${group.name}, Anzahl ${group.count}`} onPress={()=>onType(group.key)}><Card style={styles.saved}><Row style={{marginBottom:0}}><View style={{flex:1}}><Txt style={styles.title}>{group.name}</Txt><Txt muted style={styles.small}>Anzahl {group.count}</Txt></View><Txt muted>›</Txt></Row></Card></Pressable>)}{!groups.length&&<Empty>Keine Aufträge verfügbar.</Empty>}</>;
 const queued=allOrders.filter((o:any)=>typeKey==='private'?o.kind==='private':typeKey==='customer'?o.kind!=='private':false);
 const jobs=allJobs.filter((j:any)=>j.kind===typeKey),free=data.state.trucks.some((t:any)=>t.free&&t.tier>=2);
 const ranks=[1,2,3].map(rank=>({rank,entries:jobs.filter((job:any)=>expeditionRank(job)===rank)})).filter(group=>group.entries.length);
 return <>{ranks.map(group=><Pressable key={group.rank} accessibilityRole="button" accessibilityLabel={`${expeditionName(typeKey)}, Rang ${group.rank}, Anzahl ${group.entries.length}`} disabled={busy} onPress={()=>onJob(group.entries[0])}><Card style={[styles.offer,rankStyle(group.rank)]}><Row style={{marginBottom:3}}><Txt style={[styles.title,{flex:1}]}>{expeditionName(typeKey)}</Txt><Pill>Rang {group.rank}</Pill></Row><Row style={{marginBottom:0}}><Txt muted style={styles.small}>Anzahl {group.entries.length}</Txt><Txt muted style={styles.small}>{group.rank*20} t</Txt></Row>{!free&&<Txt muted style={styles.small}>Passender LKW im Einsatz oder nicht vorhanden</Txt>}</Card></Pressable>)}{queued.map((o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>)}{!queued.length&&!jobs.length&&<Empty>Keine Aufträge verfügbar.</Empty>}</>;
}
export function RunningOrders({data,clock,busy,onOpen,onClaim,onMission}:any){
 const orders=data.state.orders.filter((o:any)=>!o.isProject),active=orders.filter((o:any)=>o.status==='active'),ready=orders.filter((o:any)=>o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
 const tile=(o:any)=><OrderTile key={o.id} order={o} data={data} clock={clock} onOpen={onOpen}/>;
 const missions=endlessMissions(data);
 return <>{missions.map((m:any)=><Pressable key={`mission-${m.id}`} accessibilityRole="button" accessibilityLabel={`${expeditionName(m.lootKind)}, unterwegs, ${m.id}`} onPress={()=>onMission(m)}><Card style={[styles.offer,{borderLeftColor:C.accent}]}><Row style={{marginBottom:3}}><Txt style={[styles.title,{flex:1}]}>{expeditionName(m.lootKind)}</Txt><Txt gold style={styles.small}>{remaining(m.endsAt,clock)}</Txt></Row><Txt muted style={styles.small}>{data.catalog.regionNames[m.region]} · {data.state.trucks.find((t:any)=>t.id===m.truckId)?.model||'Fahrzeug'}</Txt><Bar value={(clock-m.startedAt)/(m.endsAt-m.startedAt)*100}/></Card></Pressable>)}{!!ready.length&&<Btn disabled={busy} style={{marginTop:0,marginBottom:12}} onPress={onClaim}>Prämien abholen · {ready.length}</Btn>}{active.map(tile)}{!active.length&&!missions.length&&<Empty>Keine Aufträge unterwegs.</Empty>}{!!ready.length&&<>{section('Prämien')}{ready.map(tile)}</>}</>;
}
export function OrderDetail({data,id,busy,clock,onCommand,onBack}:any){
 const o=data.state.orders.find((o:any)=>o.id===id&&!o.isProject);
 const [truckId,setTruckId]=useState<string|null>(o?.choices[0]?.id||null);
 if(!o)return <Empty>Angebot nicht mehr verfügbar.<Btn secondary onPress={onBack}>Zur Übersicht</Btn></Empty>;
 const active=o.status==='active',done=o.status==='completed',selected=o.choices.find((t:any)=>t.id===truckId),forecast=active?o.forecast:selected||o.forecast;
 const truck=data.state.trucks.find((t:any)=>t.id===o.truckId);
 const fact=(label:string,value:string)=><Row><Txt muted>{label}</Txt><Txt style={{textAlign:'right'}}>{value}</Txt></Row>;
 const reward=o.completionReward;
 return <>
  <Card><Row><Txt style={[styles.title,{flex:1}]}>{o.cargo}</Txt><Txt muted style={styles.small}>{o.id}</Txt></Row><Txt muted>{o.from} → {o.to}</Txt><Row style={{marginTop:12}}><Txt>{n(o.volume,1)} t · {n(o.distance)} km</Txt><Pill gold={!!o.customer}>{o.customer?o.customerName:o.routeType==='dual'?'Dual Way':'Single Way'}</Pill></Row>
   {active&&<><Bar value={progress(o,clock)}/>{fact('LKW',truck?.model||'—')}{fact('Restzeit',remaining(o.runningEndsAt||clock,clock))}{fact('Geliefert',`${n(o.delivered,1)} / ${n(o.volume)} t`)}</>}
  </Card>
  {!active&&!done&&<Card>
   {!o.choices.length?<Txt muted>{unavailable(o)}</Txt>:<><Txt style={styles.title}>Fahrzeug</Txt>{o.choices.map((t:any)=><Pressable key={t.id} accessibilityRole="button" accessibilityLabel={`${t.model}, ${t.id} auswählen`} accessibilityState={{selected:truckId===t.id,disabled:busy}} disabled={busy} onPress={()=>setTruckId(t.id)} style={[styles.vehicle,truckId===t.id&&{borderColor:C.accent}]}><Row style={{marginBottom:0}}><Txt>{t.model} · {n(t.capacity,1)} t</Txt><Txt style={{color:C.accent}}>{truckId===t.id?'✓':'○'}</Txt></Row><Txt muted style={styles.small}>{t.trips} Touren · {minutes(t.seconds)}</Txt></Pressable>)}<Btn disabled={busy||!selected} onPress={()=>onCommand(o.kind==='private'?'assignPrivate':o.crafted?'assignCrafted':'assign',{order:o.id,truck:selected.id})}>Auftrag starten</Btn></>}
   {o.status==='available'&&<Btn secondary disabled={busy} onPress={()=>onCommand('pin',{id:o.id})}>{o.pinned?'Freigeben':'Angebot halten'}</Btn>}
  </Card>}
  {!done&&<Card><Txt style={[styles.title,{marginBottom:12}]}>Prognose gesamt</Txt>{forecast&&<>
   <Txt muted style={[styles.small,{marginBottom:12}]}>{forecast.model} · aktuelle Werte</Txt>
   {fact('Fracht',`${n(forecast.revenue,2)} M`)}{fact('Betriebskosten',`${n(forecast.cost,2)} M`)}{fact('Abschlussprämie',`${n(forecast.bonus,2)} M`)}{fact('Gewinn',`${n(forecast.totalProfit,2)} M`)}
  </>}{fact(forecast?'XP':'Basis-XP',n(forecast?.xp??o.baseXp,2))}{!!o.relationshipReward&&fact('Beziehung',`+${o.relationshipReward}`)}</Card>}
  {done&&reward?<Card><Txt style={[styles.title,{marginBottom:12}]}>Abschlussprämie</Txt>{fact('Münzen',`${n(reward.coins,2)} M`)}{Object.entries(reward.gears||{}).filter(([,amount])=>Number(amount)>0).map(([rarity,amount])=><View key={rarity}>{fact(`${data.catalog.rarities.find((r:any)=>r.id===rarity)?.label||rarity}-Zahnräder`,n(amount))}</View>)}{reward.companyItems>0&&fact('Firmen-Items',n(reward.companyItems))}{reward.capacityModule&&fact('Kapazitätsmodul','1')}{reward.supplierContacts>0&&fact('Lieferantenkontakte',n(reward.supplierContacts))}{!reward.claimedAt?<Btn disabled={busy} onPress={()=>onCommand('claim',{id:o.id})}>Prämie abholen</Btn>:<Txt muted>Abgeholt</Txt>}</Card>:<Card><Txt style={[styles.title,{marginBottom:12}]}>Mögliche Beute</Txt>{o.possibleRewards.map((label:string)=><Txt key={label} muted style={{marginBottom:6}}>{label}</Txt>)}</Card>}
 </>;
}
const styles=StyleSheet.create({title:{fontSize:15,fontWeight:'700'},small:{fontSize:12,lineHeight:18},section:{fontSize:13,fontWeight:'700',color:C.muted,marginTop:10,marginBottom:9},offer:{padding:12,backgroundColor:'#1D2A3A',borderColor:'#405571',borderLeftWidth:3,marginBottom:9},saved:{padding:12,backgroundColor:'#192534',borderColor:'#3B506A'},running:{padding:12,backgroundColor:'#17332F',borderColor:C.accent},refresh:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:8},vehicle:{padding:11,borderWidth:1,borderColor:C.line,borderRadius:10,marginTop:10}});
