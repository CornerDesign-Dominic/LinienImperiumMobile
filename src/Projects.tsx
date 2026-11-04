import {ProjectOvertimeModal} from './ProjectOvertimeModal';
import {ProjectStory} from './ProjectStory';
import {MaterialLayer} from './Material';
import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {ItemArt,ItemAmount} from './ItemArt';
import {Text} from './Language';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {ProjectCategoryArt} from './ProjectCategoryArt';
import {projectSections,orderedProjectCategories,orderedRunningProjects} from './projectSections';
import {itemName} from './items';
import React,{useEffect,useRef,useState} from 'react';
import {ScrollView,StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining,minutes} from './ui';
export const projectTitle=(name:string,kind:string)=>`${kind==='referral'?'Empfehlungsauftrag':'Sonderauftrag'} ${(name||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'')}`.trim();
const projectColor=(kind:string,rarity?:string)=>rarity==='legendary'?C.legendary:rarity==='epic'||kind==='referral'?C.epic:C.rare;
const rarityStyle=(kind:string,rarity?:string)=>({backgroundColor:C.panel,borderColor:C.line,borderLeftWidth:4,borderLeftColor:projectColor(kind,rarity)});
const section=(text:string)=><Txt style={s.section}>{text}</Txt>;
const fact=(label:string,value:string)=><Row><Txt muted style={{flex:1}}>{label}</Txt><Txt style={{textAlign:'right'}}>{value}</Txt></Row>;
function ProjectTile({order:o,clock,onOpen}:any){
 return <Pressable accessibilityRole="button" accessibilityLabel={translate(`${projectTitle(o.projectName,o.kind)}, ${o.id}`)} onPress={()=>onOpen(o.id)}><Card style={[s.tile,rarityStyle(o.kind,o.projectInfo?.rarity)]}>
  <Row><ItemArt id={o.kind==='referral'?'referral':'special'} size={48}/><Txt style={[s.title,{flex:1}]}>{projectTitle(o.projectName,o.kind)}</Txt><Txt muted style={s.small}>{o.status==='queued'?'Bereit':o.status==='active'?'›':o.status==='failed'?'Abgelaufen':'Abschluss'}</Txt></Row>
  <Txt muted style={s.small}>{o.customerName} · {n(o.volume)} t · {n(o.distance)} km</Txt>
  {o.status==='active'&&<><Bar value={o.delivered/o.volume*100}/><Row style={{marginBottom:0}}><Txt gold style={s.small}>Frist {remaining(o.project.deadlineAt,clock)}</Txt><Txt muted style={s.small}>Flotte {o.eta?remaining(o.eta,clock):'—'}</Txt></Row></>}
 </Card></Pressable>;
}
export function Projects({data,clock,tab='saved',onTab,onOpen,onCommand,busy=false,modalBlocked=false}:any){
 const [infoKey,setInfoKey]=useState<string|null>(null),[startId,setStartId]=useState<string|null>(null),[template,setTemplate]=useState<number|null>(null),[submitting,setSubmitting]=useState(false),[startError,setStartError]=useState('');
 const starting=useRef(false);
 const info=data.projectCatalog.find((entry:any)=>entry.key===infoKey),order=data.state.orders.find((entry:any)=>entry.id===startId&&entry.isProject&&entry.status==='queued');
 const fleets=order?.templates?.filter((entry:any)=>entry.vehicles?.length)||[];
 const close=()=>{if(!starting.current&&!busy){setInfoKey(null);setStartId(null);}};
 const selectCategory=(entry:any,available:any[])=>{setStartError('');if(available.length){setStartId(available[0].id);setInfoKey(null);setTemplate(null);}else{setInfoKey(entry.key);setStartId(null);}};
 const start=async()=>{if(starting.current||busy||!order||template===null||!onCommand)return;starting.current=true;setSubmitting(true);setStartError('');try{const result=await onCommand('projectStart',{id:order.id,template});if(result?.state?.orders?.find((entry:any)=>entry.id===order.id)?.status==='active'){setStartId(null);onOpen?.(order.id);}else setStartError(result?.message||'Auftrag konnte nicht gestartet werden.');}catch{setStartError('Auftrag konnte nicht gestartet werden.');}finally{starting.current=false;setSubmitting(false);}};
 const {active,queued,rewards}=projectSections(data.state.orders);
 const tabs=[{id:'running',label:'Laufende',count:active.length,ready:rewards.length},{id:'saved',label:'Aufträge',count:queued.length,ready:0}];
 return <>
  <View accessibilityRole="tablist" style={s.tabs}>{tabs.map(item=><Pressable key={item.id} testID={`project-tab-${item.id}`} accessibilityRole="tab" accessibilityLabel={`${translate(item.label)}, ${item.count}${item.ready?`, ${translate('Belohnungen')}: ${item.ready}`:''}`} accessibilityState={{selected:tab===item.id}} aria-selected={tab===item.id} onPress={()=>{close();onTab?.(item.id);}} style={[s.tab,tab===item.id&&s.activeTab]}><Txt style={[s.tabLabel,tab===item.id&&s.selectedTabText]}>{item.label}</Txt><Txt style={[s.tabCount,tab===item.id&&s.selectedTabText]}>{n(item.count)}</Txt>{item.ready>0&&<View testID="project-rewards-hint" style={s.rewardDot}/>}</Pressable>)}</View>
  {tab==='running'?<RunningProjects data={data} clock={clock} onOpen={onOpen} onCommand={onCommand} busy={busy}/>:<>
  {orderedProjectCategories(data.projectCatalog).map((info:any)=>({info,ready:queued.filter((o:any)=>o.projectInfo.key===info.key).length})).map(({info,ready}:any)=>{
   const referral=info.kind==='referral',name=(info.name||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,''),color=projectColor(info.kind,info.rarity);
   return <Pressable key={info.key} testID={`project-category-${info.key}`} accessibilityRole="button" accessibilityLabel={translate(`${projectTitle(info.name,info.kind)}, ${referral?'Alle Regionen':info.regionName}, Aufträge ${ready}`)} onPress={()=>selectCategory(info,queued.filter((order:any)=>order.projectInfo.key===info.key))} style={({pressed})=>pressed&&{opacity:.8}}><Card style={[s.category,{borderLeftColor:color}]}>
    <View material={false} style={s.categoryArt}><ProjectCategoryArt preciousCargo={info.customer?.preciousCargo} referral={referral}/>{!referral&&<View material={false} style={s.regionLabel}><Txt style={s.regionName}>{info.regionName}</Txt></View>}</View>
    <View style={s.categoryCopy}>
     <Pressable testID={`project-info-${info.key}`} accessibilityRole="button" accessibilityLabel={translate(`Informationen zu ${projectTitle(info.name,info.kind)}`)} onPress={event=>{event?.stopPropagation();setStartId(null);setInfoKey(info.key);}} material={false} style={s.infoButton}><Icon name="help" size={20} color={C.accent}/></Pressable>
     <Txt style={[s.categoryKind,{color}]}>{referral?'Empfehlung':'Sonderauftrag'}</Txt>
     <Txt style={s.categoryTitle}>{name}</Txt>
     <Txt muted style={s.categoryCustomer}>{referral?'Alle Stammkunden':info.customer.name}</Txt>
     <View style={s.categoryFooter}>{ready>0?<View style={s.available}><Txt style={s.availableText}>{ready} verfügbar</Txt></View>:<Txt muted style={s.unavailable}>Keine verfügbar</Txt>}<Icon name="chevron" size={16} color={C.accent}/></View>
    </View>
   </Card></Pressable>;
  })}
  </>}
  <Modal visible={!!info&&tab==='saved'&&!modalBlocked} transparent animationType="none" onRequestClose={close}><View style={s.overlay}><SafeAreaView edges={[]} style={s.sheet}><MaterialLayer surfaceStyle={s.sheet}/><Row style={{flexWrap:'nowrap'}}><Txt style={[s.title,{flex:1,minWidth:0}]}>{info?projectTitle(info.name,info.kind):'Auftragsinfo'}</Txt><Btn testID="project-info-close" icon="close" iconOnly secondary disabled={busy} onPress={close}>Schließen</Btn></Row><ScrollView keyboardShouldPersistTaps="handled">{info&&<ProjectBrief info={info}/>}</ScrollView></SafeAreaView></View></Modal>
  <Modal visible={!!order&&tab==='saved'&&!modalBlocked} transparent animationType="none" onRequestClose={close}><View style={s.overlay}><SafeAreaView edges={[]} style={s.sheet}><MaterialLayer surfaceStyle={s.sheet}/><Row style={{flexWrap:'nowrap'}}><Txt style={[s.title,{flex:1,minWidth:0}]}>Auftrag starten?</Txt><Btn testID="project-start-close" icon="close" iconOnly secondary disabled={busy||submitting} onPress={close}>Schließen</Btn></Row><ScrollView keyboardShouldPersistTaps="handled">{order&&<><Txt style={[s.title,{marginBottom:8}]}>{projectTitle(order.projectName,order.kind)}</Txt><Txt muted style={s.small}>{order.customerName}</Txt>{fact('Umfang',`${n(order.volume)} t · ${n(order.distance)} km`)}{fact('Frist ab Start',minutes(order.deadlineMs/1000))}<Txt style={[s.title,{marginTop:12,marginBottom:6}]}>Flotte wählen</Txt>{fleets.map((entry:any)=><Pressable key={entry.index} testID={`project-fleet-${entry.index}`} accessibilityRole="button" accessibilityState={{selected:template===entry.index,disabled:busy||submitting}} disabled={busy||submitting} onPress={()=>setTemplate(entry.index)} style={[s.fleetChoice,template===entry.index&&{borderColor:C.accent,backgroundColor:C.greenWash}]}><Txt style={{fontWeight:'700'}}>Flotte {entry.index+1}</Txt><Txt muted style={s.small}>{entry.vehicles.map((vehicle:any)=>vehicle.model).join(' · ')}</Txt></Pressable>)}{!fleets.length&&<Txt muted style={s.small}>Mindestens eine Karte muss in einer Flotte eingesetzt sein.</Txt>}</>}{!!startError&&<Txt style={[s.small,{color:C.red,marginTop:8}]}>{startError}</Txt>}</ScrollView><Btn testID="project-start-confirm" disabled={busy||submitting||template===null||!fleets.some((entry:any)=>entry.index===template)||!onCommand} onPress={start}>Auftrag starten</Btn></SafeAreaView></View></Modal>
 </>;
}
export function ProjectBrief({info}:any){
 const sources=info.sources||[info];
 return <><Txt style={[s.title,{marginBottom:8}]}>Belohnungen</Txt><View style={s.briefItems}>{['common','uncommon','rare','epic',...(info.legendary?['legendary']:[])].map(rarity=><ItemArt key={rarity} id={`gear:${rarity}`} size={36}/>)}<ItemArt id="capacityModules" size={36}/></View><Txt muted style={s.small}>Zahnräder nach Transportleistung</Txt><Txt muted style={s.small}>{info.epicMin}–{info.epicMax} Epic-Zahnräder · {n(info.epicChance,2)} %</Txt>{info.legendary&&<Txt muted style={s.small}>{info.legendary.min} Legendär-Zahnrad · {n(info.legendary.extraChance)} % für +1</Txt>}<Txt muted style={s.small}>Kapazitätsmodul · {n(info.moduleChance,2)} %</Txt><Txt muted style={[s.small,{marginTop:6}]}>Abschlussprämie nur innerhalb der Frist</Txt><Txt style={[s.title,{marginTop:16,marginBottom:8}]}>Herkunft</Txt>{sources.map((source:any)=><View key={source.region} style={{marginBottom:8}}><Txt style={{fontSize:12,fontWeight:'700'}}>{source.customer.name} · {source.regionName}</Txt><Txt muted style={s.small}>Endlosexpedition · {n(source.expeditionChance,2)} %</Txt><Txt muted style={s.small}>{source.customerSource} · {n(source.customerChance,2)} %</Txt></View>)}</>;
}
function ProjectInfo({info,onExpedition,onCustomers}:any){
 return <>
  <Card>{fact('Umfang',`${n(info.volume)} t · ${n(info.distance)} km`)}{fact('Frist',minutes(info.deadlineMs/1000))}<Txt muted style={s.small}>Beginnt beim Start · mind. 1 Karte in einer Flotte</Txt></Card>
  <Card><Txt style={[s.title,{marginBottom:12}]}>Belohnungen</Txt>{fact('Basisfracht',`${n(info.freight,2)}`)}{fact('Abschlussprämie',`${n(info.premium,2)}`)}{fact('Basis-XP',n(info.baseXp))}{fact('Beziehung',`+${info.relationship}`)}<Txt muted style={s.small}>Fahrzeugboni und Betriebskosten kommen hinzu.</Txt>
   <Txt style={[s.title,{marginVertical:12}]}>Beute</Txt><View style={{flexDirection:'row',gap:6,marginBottom:8}}>{['common','uncommon','rare','epic',...(info.legendary?['legendary']:[])].map(rarity=><ItemArt key={rarity} id={`gear:${rarity}`} size={36}/>)}<ItemArt id="capacityModules" size={36}/></View><Txt muted style={s.small}>Common-/Uncommon-/Rare-Zahnräder · tkm-abhängig</Txt>
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
 const orders=data.state.orders.filter((o:any)=>o.isProject&&o.projectInfo.key===typeKey),ready=orders.filter((o:any)=>o.status==='queued');
 return <>
  <Row><ItemArt id={info.kind==='referral'?'referral':'special'} size={52}/><Txt style={[s.title,{flex:1}]}>{projectTitle(info.name,info.kind)}</Txt><Pill gold={info.kind==='referral'}>{info.kind==='referral'?'Epic':info.regionName}</Pill></Row><Txt muted style={{marginBottom:12}}>{info.kind==='referral'?'Alle Stammkunden':info.customer.name}</Txt>
  {ready.length?<>{section('Bereit')}{ready.map((o:any)=><ProjectTile key={o.id} order={o} onOpen={onOpen}/>)}</>:<Txt muted style={{marginBottom:12}}>Noch kein Auftrag bereit.</Txt>}
  <ProjectInfo info={info} onExpedition={onExpedition} onCustomers={onCustomers}/>
 </>;
}
// Concrete transports use the same precious-cargo identity as the category cards.
export function RunningProjectCard({order:o,clock,onOpen,onCommand,busy=false}:any){
 const [claiming,setClaiming]=useState(false),[claimError,setClaimError]=useState('');
 const inFlight=useRef(false);
 const info=o.projectInfo||{},reward=o.completionReward,done=o.status==='completed'&&reward&&!reward.claimedAt;
 const now=Number.isFinite(clock)?clock:0,color=projectColor(o.kind,info.rarity);
 const name=(o.projectName||info.name||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'');
 const deadline=o.project?.deadlineAt,eta=o.eta;
 const etaLabel=o.projection?.feasible===false?'Nicht erreichbar':!Number.isFinite(eta)?'—':eta<=now?'Wird aktualisiert':remaining(eta,now);
 const claim=async(event?:any)=>{
  event?.stopPropagation();
  if(inFlight.current||busy||!done||!onCommand)return;
  inFlight.current=true;setClaiming(true);setClaimError('');let accepted=false;
  try{
   const next=await onCommand('claim',{id:o.id});
   const updated=next?.state?.orders?.find((entry:any)=>entry.id===o.id);
   accepted=Boolean(updated?.completionReward?.claimedAt);
   if(!accepted)setClaimError(next?.message||'Belohnung konnte nicht abgeholt werden. Bitte erneut versuchen.');
  }catch{setClaimError('Belohnung konnte nicht abgeholt werden. Bitte erneut versuchen.');}
  finally{if(!accepted){inFlight.current=false;setClaiming(false);}}
 };
 return <Card testID={`running-project-${o.id}`} style={[s.runningCard,rarityStyle(o.kind,info.rarity)]}>
  <Pressable testID={`project-open-${o.id}`} accessibilityRole="button" accessibilityLabel={translate(`${projectTitle(o.projectName,o.kind)}, ${o.customerName}, ${n(o.volume)} t, ${n(o.distance)} km`)} onPress={()=>onOpen?.(o.id)} style={s.runningHeading}>
   <View material={false} style={s.runningArt}><ProjectCategoryArt preciousCargo={info.customer?.preciousCargo} referral={o.kind==='referral'}/></View>
   <View material={false} style={s.runningCopy}><Txt style={[s.runningKind,{color}]}>{info.rarity==='legendary'?'LEGENDÄR':o.kind==='referral'?'Empfehlung':'Sonderauftrag'}</Txt><Txt style={s.runningTitle}>{name}</Txt><View style={s.customerLine}><Icon name="home" size={12} color={C.muted}/><Txt muted style={s.runningCustomer}>{o.customerName}</Txt></View><View style={s.cargoLine}><Icon name="orders" size={12} color={C.muted}/><Txt muted style={s.runningFact}>{o.status==='active'?`${n(o.delivered,1)} / ${n(o.volume)} t`:`${n(o.volume)} t`} · {n(o.distance)} km</Txt></View></View>
  </Pressable>
  {o.status==='active'&&<><Bar value={o.volume>0?o.delivered/o.volume*100:0}/><View style={s.runningTimes}><Txt style={s.timeValue}><Txt muted style={s.timeLabel}>Frist</Txt>{' '}<Txt style={[s.timeValue,{color:Number.isFinite(deadline)&&now>=deadline?C.red:C.gold}]}>{Number.isFinite(deadline)?deadline<=now?'Wird geprüft':remaining(deadline,now):'—'}</Txt></Txt><Txt style={s.timeValue}><Txt muted style={s.timeLabel}>Fertig in</Txt>{' '}<Txt style={[s.timeValue,eta>deadline&&{color:C.red}]}>{etaLabel}</Txt></Txt></View>{eta>deadline&&<Txt style={[s.runningFact,{color:C.red,marginTop:3}]}>Voraussichtlich nach Fristende</Txt>}</>}
  {done&&<><View style={s.doneActions}><View material={false} style={s.doneStamp}><Txt style={s.doneStampText}>ERLEDIGT</Txt></View><Btn testID={`project-claim-${o.id}`} style={s.claimButton} disabled={busy||claiming||!onCommand} onPress={claim}>Abholen</Btn></View>{!!claimError&&<Txt accessibilityRole="alert" style={[s.small,{color:C.red,marginTop:6}]}>{claimError}</Txt>}</>}
 </Card>;
}
export function RunningProjects({data,clock,onOpen,onCommand,busy=false}:any){
 const orders=orderedRunningProjects(data.state.orders);
 return <>{orders.length?orders.map((o:any)=><RunningProjectCard key={o.id} order={o} clock={clock??data.serverTime} onOpen={onOpen} onCommand={onCommand} busy={busy}/>):<Empty>Keine Großaufträge unterwegs.</Empty>}</>;
}
export function ProjectDetail({data,id,busy,clock,onCommand,onExpedition,onCustomers,onInventory,onFleet,modalBlocked=false}:any){
 const [overtime,setOvertime]=useState(false),[more,setMore]=useState(false);
 useEffect(()=>{setOvertime(false);},[id]);
 const o=data.state.orders.find((o:any)=>o.id===id&&o.isProject),active=o?.status==='active';
 useEffect(()=>{if(!active)setOvertime(false);},[active]);
 if(!o)return <Empty>Großauftrag nicht verfügbar.</Empty>;
 const info=o.projectInfo,reward=o.completionReward,points=data.state.overtimePoints;
 return <>
  {active?<>
   <Card><ProjectStory order={o}/><View style={s.times}><View style={{flex:1}}><Txt muted style={s.small}>Frist</Txt><Txt gold>{remaining(o.project.deadlineAt,clock)}</Txt></View><View style={{flex:1,alignItems:'flex-end'}}><Txt muted style={s.small}>Flotte braucht</Txt><Txt style={o.eta>o.project.deadlineAt?{color:C.red}:null}>{o.eta?remaining(o.eta,clock):'—'}</Txt></View></View><Txt muted style={[s.small,{marginTop:10}]}>{n(o.delivered,1)} / {n(o.volume)} t · {projectTitle(o.projectName,o.kind)}</Txt></Card>
   <Btn disabled={busy||clock>=o.project.deadlineAt} onPress={()=>setOvertime(true)}>Überstunden einsetzen</Btn>
   <Card style={{marginTop:12}}><Row><Txt style={s.title}>Eingesetzte Flotte</Txt><Pill>Flotte {o.project.template+1}</Pill></Row>{o.project.vehicles.map((vehicle:any)=><View key={vehicle.slot??vehicle.cardId} style={s.vehicle}><Txt style={{fontWeight:'700'}}>{vehicle.model}</Txt>{vehicle.cargo>0&&vehicle.nextAt?<Row style={{marginTop:6,marginBottom:0,flexWrap:'nowrap'}}><Txt gold style={s.small}>{remaining(vehicle.nextAt,clock)}</Txt><Txt muted style={s.small}>{n(vehicle.cargo,2)} t bei Ankunft</Txt></Row>:<Txt muted style={[s.small,{marginTop:6}]}>Keine weitere Tour</Txt>}{vehicle.pendingCardId!==undefined&&vehicle.pendingCardId!==vehicle.cardId&&<Txt gold style={s.small}>{vehicle.pendingModel?`Danach: ${vehicle.pendingModel}`:'Wird nach der Tour entfernt'}</Txt>}</View>)}</Card>
   <Btn secondary onPress={()=>setMore(!more)}>{more?'Weniger Infos':'Belohnungen & Infos'}</Btn>{more&&<View style={{marginTop:12}}><ProjectInfo info={info} onExpedition={onExpedition} onCustomers={onCustomers}/></View>}
  </>:<>
   <Row><ItemArt id={o.kind==='referral'?'referral':'special'} size={48}/><Txt style={[s.title,{flex:1}]}>{projectTitle(o.projectName,o.kind)}</Txt></Row><Txt muted style={{marginBottom:12}}>{o.customerName}</Txt>
   {o.status==='queued'&&<><Card>{fact('Umfang',`${n(o.volume)} t · ${n(o.distance)} km`)}{fact('Frist ab Start',minutes(o.deadlineMs/1000))}</Card>{o.templates.map((template:any)=><Card key={template.index}><Txt style={s.title}>Flotte {template.index+1}</Txt><Txt muted style={[s.small,{marginTop:8}]}>{template.vehicles?.map((v:any)=>v.model).join(' · ')||'Keine Karten eingesetzt'}</Txt>{template.eta&&<Txt muted style={{marginTop:8}}>{minutes((template.eta-data.serverTime)/1000)}{template.eta-data.serverTime>o.deadlineMs?' · Überstunden nötig':''}</Txt>}<Btn disabled={busy||!template.vehicles} onPress={()=>onCommand('projectStart',{id:o.id,template:template.index})}>Flotte {template.index+1} einsetzen</Btn></Card>)}</>}
   {o.status==='completed'&&<ProjectStory order={o}/>}
   {o.status==='completed'&&reward&&<Card><Txt style={[s.title,{marginBottom:12}]}>Abschlussprämie</Txt>{fact('Imperium-Taler',`${n(reward.coins,2)}`)}{Object.entries(reward.gears||{}).filter(([,value])=>Number(value)>0).map(([rarity,amount])=><View key={rarity}><ItemAmount id={`gear:${rarity}`} label={`${data.catalog.rarities.find((r:any)=>r.id===rarity)?.label||rarity}-Zahnräder`} amount={Number(amount)}/></View>)}{reward.capacityModule&&<ItemAmount id="capacityModules" amount={1}/>}{!reward.claimedAt?<Btn disabled={busy} onPress={()=>onCommand('claim',{id:o.id})}>Prämie abholen</Btn>:<Txt muted>Abgeholt</Txt>}</Card>}
   {o.status==='failed'&&<Empty>Frist abgelaufen · keine Abschlussprämie</Empty>}
   <ProjectInfo info={info} onExpedition={onExpedition} onCustomers={onCustomers}/>
  </>}
  {overtime&&active&&<ProjectOvertimeModal key={o.id} order={o} points={points} busy={busy} clock={clock} visible={!modalBlocked} onClose={()=>setOvertime(false)} onCommand={onCommand}/>}

 </>;
}
const s=StyleSheet.create({
 runningCard:{paddingHorizontal:9,paddingVertical:8,marginBottom:8},runningHeading:{flexDirection:'row',alignItems:'center',gap:8},runningArt:{width:58,height:66,position:'relative',flexShrink:0},runningCopy:{flex:1,minWidth:0},runningKind:{fontSize:9,lineHeight:12,fontWeight:'700',letterSpacing:.4,marginBottom:1},runningTitle:{fontSize:14,lineHeight:18,fontWeight:'700',marginBottom:2},customerLine:{flexDirection:'row',alignItems:'center',gap:4},runningCustomer:{fontSize:11,lineHeight:15,flexShrink:1},cargoLine:{flexDirection:'row',alignItems:'center',gap:4,marginTop:2},runningFact:{fontSize:11,lineHeight:15,flexShrink:1},runningTimes:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',columnGap:10,rowGap:2},timeLabel:{fontSize:10,lineHeight:16},timeValue:{fontSize:11,lineHeight:16,fontWeight:'600',flexShrink:1,maxWidth:'100%'},doneActions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-end',columnGap:12,rowGap:5,marginTop:5},claimButton:{minHeight:44,minWidth:94,paddingHorizontal:13,paddingVertical:7,marginTop:0},doneStamp:{borderWidth:1.5,borderColor:C.uncommon,borderRadius:3,paddingHorizontal:7,paddingVertical:2,transform:[{rotate:'-6deg'}]},doneStampText:{color:C.uncommon,fontSize:11,lineHeight:15,fontWeight:'800',letterSpacing:.8},
 tabs:{flexDirection:'row',gap:5,marginBottom:10},tab:{flex:1,minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,borderRadius:5},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabLabel:{fontSize:12,fontWeight:'700'},tabCount:{fontSize:11,color:C.muted},selectedTabText:{color:C.onInk},rewardDot:{width:7,height:7,borderRadius:4,backgroundColor:C.gold},
 category:{flexDirection:'row',paddingHorizontal:0,paddingVertical:0,overflow:'hidden',minHeight:112,marginBottom:10,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderLeftWidth:4},
 categoryArt:{width:'31%',minWidth:88,position:'relative',overflow:'hidden'},
 regionLabel:{position:'absolute',bottom:0,left:0,right:0,paddingHorizontal:4,paddingVertical:5},
 regionName:{fontSize:10,lineHeight:14,color:C.muted,fontWeight:'600',textAlign:'center'},
 infoButton:{position:'absolute',right:0,top:0,width:44,height:44,alignItems:'center',justifyContent:'center',zIndex:1},
 briefItems:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:8},
 fleetChoice:{padding:10,minHeight:44,borderWidth:1,borderColor:C.line,borderRadius:5,marginBottom:7},
 categoryCopy:{flex:1,minWidth:0,paddingHorizontal:10,paddingVertical:9},
 categoryKind:{fontSize:9,lineHeight:12,fontWeight:'700',letterSpacing:.6,marginBottom:3},
 categoryTitle:{fontSize:16,lineHeight:20,fontWeight:'700',marginBottom:3,paddingRight:28},
 categoryCustomer:{fontSize:11,lineHeight:15},
 categoryFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6,marginTop:7},
 available:{backgroundColor:C.accent,borderColor:C.brass,borderWidth:1,borderRadius:3,paddingHorizontal:7,paddingVertical:3},
 availableText:{color:C.onInk,fontSize:11,lineHeight:15,fontWeight:'700'},
 unavailable:{fontSize:11,lineHeight:15},
vehicle:{borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:6,paddingBottom:6},title:{fontSize:15,fontWeight:'700'},small:{fontSize:12,lineHeight:18},section:{fontSize:13,fontWeight:'700',color:C.muted,marginVertical:10},tile:{padding:12,backgroundColor:C.panel,borderColor:C.line,marginBottom:9},loot:{fontSize:12,lineHeight:18,marginTop:7},times:{flexDirection:'row',gap:12,marginTop:8},image:{width:'100%',aspectRatio:16/9,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:12,marginBottom:4},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:20},sheet:{width:'100%',maxWidth:440,maxHeight:'80%',backgroundColor:C.panel,borderRadius:20,borderWidth:1,borderColor:C.line,padding:16},preset:{flex:1,minWidth:0,minHeight:44,borderRadius:10,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'}});
