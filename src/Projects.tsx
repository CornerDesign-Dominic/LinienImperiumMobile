import {Text} from './Language';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {LocationArt} from './LocationArt';
import {itemName} from './items';
import React,{useEffect,useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining,minutes} from './ui';
export const projectTitle=(name:string,kind:string)=>`${kind==='referral'?'Empfehlungsauftrag':'Sonderauftrag'} ${(name||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'')}`.trim();
const rarityStyle=(kind:string)=>kind==='referral'?{backgroundColor:C.purpleWash,borderColor:C.epic}:{backgroundColor:C.blueWash,borderColor:C.rare};
const section=(text:string)=><Txt style={s.section}>{text}</Txt>;
const fact=(label:string,value:string)=><Row><Txt muted style={{flex:1}}>{label}</Txt><Txt style={{textAlign:'right'}}>{value}</Txt></Row>;
function ProjectTile({order:o,clock,onOpen}:any){
 return <Pressable accessibilityRole="button" accessibilityLabel={translate(`${projectTitle(o.projectName,o.kind)}, ${o.id}`)} onPress={()=>onOpen(o.id)}><Card style={[s.tile,rarityStyle(o.kind)]}>
  <Row><Txt style={[s.title,{flex:1}]}>{projectTitle(o.projectName,o.kind)}</Txt><Txt muted style={s.small}>{o.status==='queued'?'Bereit':o.status==='active'?'›':o.status==='failed'?'Abgelaufen':'Abschluss'}</Txt></Row>
  <Txt muted style={s.small}>{o.customerName} · {n(o.volume)} t · {n(o.distance)} km</Txt>
  {o.status==='active'&&<><Bar value={o.delivered/o.volume*100}/><Row style={{marginBottom:0}}><Txt gold style={s.small}>Frist {remaining(o.project.deadlineAt,clock)}</Txt><Txt muted style={s.small}>Flotte {o.eta?remaining(o.eta,clock):'—'}</Txt></Row></>}
 </Card></Pressable>;
}
export function Projects({data,onRunning,onType}:any){
 const orders=data.state.orders.filter((o:any)=>o.isProject),active=orders.filter((o:any)=>o.status==='active');
 return <>
  <Pressable accessibilityRole="button" accessibilityLabel={translate(`Laufende Großaufträge, ${active.length}`)} onPress={onRunning}><Card style={s.running}><Row style={{marginBottom:0}}><Txt style={{fontWeight:'700',flex:1}}>Laufende Großaufträge</Txt><Pill>{active.length}</Pill><Icon name="chevron" size={17} color={C.accent}/></Row></Card></Pressable>
  {data.projectCatalog.map((info:any)=>{
   const ready=orders.filter((o:any)=>o.status==='queued'&&o.projectInfo.key===info.key).length;
   return <Pressable key={info.key} accessibilityRole="button" accessibilityLabel={translate(`${projectTitle(info.name,info.kind)}, ${info.kind==='referral'?'Alle Regionen':info.regionName}, Aufträge ${ready}`)} onPress={()=>onType(info.key)}><Card style={[s.tile,rarityStyle(info.kind)]}>
    <Row><Txt style={[s.title,{flex:1}]}>{projectTitle(info.name,info.kind)}</Txt><Icon name="chevron" size={17} color={C.muted}/></Row>
    <Row style={{marginBottom:0,alignItems:'flex-start'}}><Txt muted style={[s.small,{flex:1}]}>{info.kind==='referral'?'Alle Stammkunden · alle Regionen':`${info.customer.name} · ${info.regionName}`}</Txt><Txt muted style={s.small}>Aufträge {ready}</Txt></Row>
   </Card></Pressable>;
  })}
 </>;
}
function ProjectInfo({info,onExpedition,onCustomers}:any){
 return <>
  <Card>{fact('Umfang',`${n(info.volume)} t · ${n(info.distance)} km`)}{fact('Frist',minutes(info.deadlineMs/1000))}<Txt muted style={s.small}>Beginnt beim Start · mind. 1 Karte in einer Flotte</Txt></Card>
  <Card><Txt style={[s.title,{marginBottom:12}]}>Belohnungen</Txt>{fact('Basisfracht',`${n(info.freight,2)} M`)}{fact('Abschlussprämie',`${n(info.premium,2)} M`)}{fact('Basis-XP',n(info.baseXp))}{fact('Beziehung',`+${info.relationship}`)}<Txt muted style={s.small}>Fahrzeugboni und Betriebskosten kommen hinzu.</Txt>
   <Txt style={[s.title,{marginVertical:12}]}>Beute</Txt><Txt muted style={s.small}>Common-/Uncommon-/Rare-Zahnräder · tkm-abhängig</Txt>
   <Txt muted style={s.loot}>{info.epicMin}–{info.epicMax} Epic-Zahnräder · {n(info.epicChance,2)} %</Txt>
   {info.legendary&&<Txt muted style={s.loot}>{info.legendary.min} Legendär-Zahnrad · {n(info.legendary.extraChance)} % für +1</Txt>}
   <Txt muted style={s.loot}>Kapazitätsmodul · {n(info.moduleChance,2)} %</Txt>
   <Txt muted style={[s.small,{marginTop:10}]}>Abschlussprämie nur innerhalb der Frist</Txt>
  </Card>
  <Card><Txt style={[s.title,{marginBottom:12}]}>Herkunft</Txt>{(info.sources||[info]).map((source:any)=><View key={source.region} style={{marginBottom:12}}><Txt style={{fontWeight:'700'}}>{source.customer.name} · {source.regionName}</Txt>{fact('Endlosexpedition',`${n(source.expeditionChance,2)} %`)}{fact(source.customerSource,`${n(source.customerChance,2)} %`)}<Btn endIcon="chevron" secondary onPress={()=>onExpedition(source.region)}>Zur Expedition</Btn></View>)}<Btn endIcon="chevron" secondary onPress={onCustomers}>Zu Stammkunden</Btn></Card>
 </>;
}
export function ProjectType({data,typeKey,onOpen,onExpedition,onCustomers}:any){
 const info=data.projectCatalog.find((p:any)=>p.key===typeKey);
 if(!info)return <Empty>Auftragstyp nicht verfügbar.</Empty>;
 const orders=data.state.orders.filter((o:any)=>o.isProject&&o.projectInfo.key===typeKey),ready=orders.filter((o:any)=>o.status==='queued'),history=orders.filter((o:any)=>['completed','failed'].includes(o.status)).slice().reverse();
 return <>
  <Row><Txt style={[s.title,{flex:1}]}>{projectTitle(info.name,info.kind)}</Txt><Pill gold={info.kind==='referral'}>{info.kind==='referral'?'Epic':info.regionName}</Pill></Row><Txt muted style={{marginBottom:12}}>{info.kind==='referral'?'Alle Stammkunden':info.customer.name}</Txt>
  {ready.length?<>{section('Bereit')}{ready.map((o:any)=><ProjectTile key={o.id} order={o} onOpen={onOpen}/>)}</>:<Txt muted style={{marginBottom:12}}>Noch kein Auftrag bereit.</Txt>}
  <ProjectInfo info={info} onExpedition={onExpedition} onCustomers={onCustomers}/>
  {!!history.length&&<>{section('Abschlüsse')}{history.map((o:any)=><ProjectTile key={o.id} order={o} onOpen={onOpen}/>)}</>}
 </>;
}
export function RunningProjects({data,clock,onOpen}:any){
 const orders=data.state.orders.filter((o:any)=>o.isProject),active=orders.filter((o:any)=>o.status==='active'),ready=orders.filter((o:any)=>o.status==='completed'&&o.completionReward&&!o.completionReward.claimedAt);
 return <>{active.map((o:any)=><ProjectTile key={o.id} order={o} clock={clock} onOpen={onOpen}/>)}{!active.length&&<Empty>Keine Großaufträge unterwegs.</Empty>}{!!ready.length&&<>{section('Prämien')}{ready.map((o:any)=><ProjectTile key={o.id} order={o} clock={clock} onOpen={onOpen}/>)}</>}</>;
}
export function ProjectDetail({data,id,busy,clock,onCommand,onExpedition,onCustomers,onInventory,onFleet,modalBlocked=false}:any){
 const [overtime,setOvertime]=useState(false),[more,setMore]=useState(false),[amount,setAmount]=useState<number|'max'>(1);
 useEffect(()=>{setAmount(1);setOvertime(false);},[id]);
 const o=data.state.orders.find((o:any)=>o.id===id&&o.isProject),active=o?.status==='active';
 useEffect(()=>{if(!active)setOvertime(false);},[active]);
 if(!o)return <Empty>Großauftrag nicht verfügbar.</Empty>;
 const info=o.projectInfo,reward=o.completionReward,points=data.state.overtimePoints;
 const needed=Math.max(0,Math.ceil((o.volume-o.delivered)*o.distance/1000)),selected=amount==='max'?(o.overtimeForDeadline||0):Math.min(amount,needed);
 return <>
  {active?<>
   <Card><Bar value={o.delivered/o.volume*100}/><View style={s.times}><View style={{flex:1}}><Txt muted style={s.small}>Frist</Txt><Txt gold>{remaining(o.project.deadlineAt,clock)}</Txt></View><View style={{flex:1,alignItems:'flex-end'}}><Txt muted style={s.small}>Flotte braucht</Txt><Txt style={o.eta>o.project.deadlineAt?{color:C.red}:null}>{o.eta?remaining(o.eta,clock):'—'}</Txt></View></View><Txt muted style={[s.small,{marginTop:10}]}>{n(o.delivered,1)} / {n(o.volume)} t · {projectTitle(o.projectName,o.kind)}</Txt></Card>
   <View style={s.image} accessibilityLabel={translate('Auftragsbild')}><LocationArt name="fleet" width={138}/></View>
   <View style={{flexDirection:'row',gap:8,alignItems:'stretch'}}><Btn secondary endIcon="chevron" endIconRotation={90} style={{width:'33%',minWidth:0,minHeight:58}} disabled={busy||clock>=o.project.deadlineAt} onPress={()=>setOvertime(true)}>{amount==='max'?'Max':`${amount} ${amount===1?'Punkt':'Punkte'}`}</Btn><Btn style={{flex:1,minWidth:0,minHeight:58}} disabled={busy||clock>=o.project.deadlineAt||(points>0&&selected===0)} onPress={()=>points>0?onCommand('overtime',{id:o.id,amount}):setOvertime(true)}>Überstunden einsetzen</Btn></View>
   <Card style={{marginTop:12}}><Row><Txt style={s.title}>Eingesetzte Flotte</Txt><Pill>Flotte {o.project.template+1}</Pill></Row>{o.project.vehicles.map((vehicle:any)=><View key={vehicle.slot??vehicle.cardId} style={s.vehicle}><Txt style={{fontWeight:'700'}}>{vehicle.model}</Txt>{vehicle.cargo>0&&vehicle.nextAt?<Row style={{marginTop:6,marginBottom:0,flexWrap:'nowrap'}}><Txt gold style={s.small}>{remaining(vehicle.nextAt,clock)}</Txt><Txt muted style={s.small}>{n(vehicle.cargo,2)} t bei Ankunft</Txt></Row>:<Txt muted style={[s.small,{marginTop:6}]}>Keine weitere Tour</Txt>}{vehicle.pendingCardId!==undefined&&vehicle.pendingCardId!==vehicle.cardId&&<Txt gold style={s.small}>{vehicle.pendingModel?`Danach: ${vehicle.pendingModel}`:'Wird nach der Tour entfernt'}</Txt>}</View>)}</Card>
   <Btn secondary disabled={busy} onPress={()=>onFleet(o.project.template)}>Flotte für nächste Touren ändern</Btn>{o.projection&&<Card style={{marginTop:12}}><Txt style={s.title}>Prognose verbleibend</Txt>{fact('Fracht',`${n(o.projection.revenue,2)} M`)}{fact('Betriebskosten',`${n(o.projection.cost,2)} M`)}{fact('XP',n(o.projection.xp,2))}{!o.projection.feasible&&<Txt gold>Ohne weitere Fahrzeuge kann die Restmenge nicht geliefert werden.</Txt>}<Txt muted style={s.small}>Laufende Touren bleiben gespeichert. Folgetouren berücksichtigen Änderungen.</Txt></Card>}<Btn secondary onPress={()=>setMore(!more)}>{more?'Weniger Infos':'Belohnungen & Infos'}</Btn>{more&&<View style={{marginTop:12}}><ProjectInfo info={info} onExpedition={onExpedition} onCustomers={onCustomers}/></View>}
  </>:<>
   <Row><Txt style={[s.title,{flex:1}]}>{projectTitle(o.projectName,o.kind)}</Txt></Row><Txt muted style={{marginBottom:12}}>{o.customerName}</Txt>
   {o.status==='queued'&&<><Card>{fact('Umfang',`${n(o.volume)} t · ${n(o.distance)} km`)}{fact('Frist ab Start',minutes(o.deadlineMs/1000))}</Card>{o.templates.map((template:any)=><Card key={template.index}><Txt style={s.title}>Flotte {template.index+1}</Txt><Txt muted style={[s.small,{marginTop:8}]}>{template.vehicles?.map((v:any)=>v.model).join(' · ')||'Keine Karten eingesetzt'}</Txt>{template.eta&&<Txt muted style={{marginTop:8}}>{minutes((template.eta-data.serverTime)/1000)}{template.eta-data.serverTime>o.deadlineMs?' · Überstunden nötig':''}</Txt>}<Btn disabled={busy||!template.vehicles} onPress={()=>onCommand('projectStart',{id:o.id,template:template.index})}>Flotte {template.index+1} einsetzen</Btn></Card>)}</>}
   {o.status==='completed'&&reward&&<Card><Txt style={[s.title,{marginBottom:12}]}>Abschlussprämie</Txt>{fact('Münzen',`${n(reward.coins,2)} M`)}{Object.entries(reward.gears||{}).filter(([,value])=>Number(value)>0).map(([rarity,amount])=><View key={rarity}>{fact(`${data.catalog.rarities.find((r:any)=>r.id===rarity)?.label||rarity}-Zahnräder`,n(amount))}</View>)}{reward.capacityModule&&fact('Kapazitätsmodul','1')}{!reward.claimedAt?<Btn disabled={busy} onPress={()=>onCommand('claim',{id:o.id})}>Prämie abholen</Btn>:<Txt muted>Abgeholt</Txt>}</Card>}
   {o.status==='failed'&&<Empty>Frist abgelaufen · keine Abschlussprämie</Empty>}
   <ProjectInfo info={info} onExpedition={onExpedition} onCustomers={onCustomers}/>
  </>}
  <Modal visible={overtime&&active&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setOvertime(false)}><View style={s.overlay}><SafeAreaView edges={[]} style={s.sheet}><Row style={{flexWrap:'nowrap'}}><Txt style={[s.title,{flex:1,minWidth:0}]}>Überstunden</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={()=>setOvertime(false)}>Schließen</Btn></Row><ScrollView keyboardShouldPersistTaps="handled">{points>0&&<><Row><Txt muted>Vorrat</Txt><Txt gold>{n(points)} Punkte</Txt></Row><View style={{flexDirection:'row',gap:6,marginVertical:12}}>{([1,5,10,'max'] as const).map(value=><Pressable key={value} accessibilityRole="button" accessibilityLabel={translate(value==='max'?'Max wählen':`${value} Punkte wählen`)} accessibilityState={{selected:amount===value,disabled:busy}} disabled={busy} onPress={()=>{setAmount(value);setOvertime(false);}} style={[s.preset,amount===value&&{borderColor:C.accent,backgroundColor:C.greenWash}]}><Txt>{value==='max'?'Max':value}</Txt></Pressable>)}</View><Txt muted style={s.small}>Max · {n(o.overtimeForDeadline)} Punkte bis zur Frist</Txt></>}<Btn secondary disabled={busy||!data.state.inventory.overtimeRefills} onPress={()=>onCommand('refill',{})}>{itemName('overtimeRefills')} · {n(data.state.inventory.overtimeRefills)}</Btn></ScrollView></SafeAreaView></View></Modal>
 </>;
}
const s=StyleSheet.create({vehicle:{borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:6,paddingBottom:6},title:{fontSize:15,fontWeight:'700'},small:{fontSize:12,lineHeight:18},section:{fontSize:13,fontWeight:'700',color:C.muted,marginVertical:10},running:{padding:12,backgroundColor:C.greenWash,borderColor:C.accent},tile:{padding:12,backgroundColor:C.panel,borderColor:C.line,marginBottom:9},loot:{fontSize:12,lineHeight:18,marginTop:7},times:{flexDirection:'row',gap:12,marginTop:8},image:{width:'100%',aspectRatio:16/9,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:12,marginBottom:4},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:20},sheet:{width:'100%',maxWidth:440,maxHeight:'80%',backgroundColor:C.panel,borderRadius:20,borderWidth:1,borderColor:C.line,padding:16},preset:{flex:1,minWidth:0,minHeight:44,borderRadius:10,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'}});
