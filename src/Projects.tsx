import {ProjectOvertimeModal} from './ProjectOvertimeModal';
import {ProjectStory} from './ProjectStory';
import {MaterialLayer} from './Material';
import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {ItemArt} from './ItemArt';
import {Text} from './Language';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {VehicleArt} from './VehicleArt';
import {ProjectCategoryArt} from './ProjectCategoryArt';
import {projectSections,orderedProjectCategories,orderedRunningProjects} from './projectSections';
import {itemName} from './items';
import React,{useEffect,useRef,useState} from 'react';
import {ScrollView,StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining,minutes,displayFont} from './ui';
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
  <Modal visible={!!order&&tab==='saved'&&!modalBlocked} transparent animationType="none" onRequestClose={close}><View style={s.overlay}><SafeAreaView edges={[]} style={s.sheet}><MaterialLayer surfaceStyle={s.sheet}/><Row style={{flexWrap:'nowrap'}}><Txt style={[s.title,{flex:1,minWidth:0}]}>Auftrag starten?</Txt><Btn testID="project-start-close" icon="close" iconOnly secondary disabled={busy||submitting} onPress={close}>Schließen</Btn></Row><ScrollView keyboardShouldPersistTaps="handled">{order&&<><Txt style={[s.title,{marginBottom:8}]}>{projectTitle(order.projectName,order.kind)}</Txt><Txt muted style={s.small}>{order.customerName}</Txt><View style={s.contractFacts}><View style={s.contractFact}><Icon name="orders" size={20}/><Txt muted style={s.factCaption}>Fracht</Txt><Txt style={s.factValue}>{n(order.volume)} t</Txt></View><View style={s.contractFact}><Icon name="location" size={20}/><Txt muted style={s.factCaption}>Strecke</Txt><Txt style={s.factValue}>{n(order.distance)} km</Txt></View><View style={s.contractFact}><Icon name="timer" size={20}/><Txt muted style={s.factCaption}>Frist ab Start</Txt><Txt style={s.factValue}>{minutes(order.deadlineMs/1000)}</Txt></View></View><Txt style={[s.title,{marginTop:12,marginBottom:6}]}>Flotte wählen</Txt>{fleets.map((entry:any)=>{
 const duration=Number.isFinite(entry.eta)?Math.max(0,(entry.eta-(data.serverTime||0))/1000):null,late=duration!==null&&duration>order.deadlineMs/1000;
 return <Pressable key={entry.index} testID={`project-fleet-${entry.index}`} accessibilityRole="button" accessibilityLabel={`${translate('Flotte')} ${entry.index+1}, ${entry.vehicles.map((v:any)=>v.model).join(', ')}`} accessibilityState={{selected:template===entry.index,disabled:busy||submitting}} disabled={busy||submitting} onPress={()=>setTemplate(entry.index)} style={[s.fleetChoice,template===entry.index&&{borderColor:C.accent,backgroundColor:C.greenWash}]}>
 <Txt style={{fontWeight:'700'}}>Flotte {entry.index+1}</Txt>
 <View testID={`project-fleet-images-${entry.index}`} style={s.fleetImages}>{[0,1,2,3,4].map(slot=>{const vehicle=entry.vehicles.some((v:any)=>Number.isInteger(v.slot))?entry.vehicles.find((v:any)=>v.slot===slot):entry.vehicles[slot],card=vehicle&&data.catalog.cards.find((c:any)=>c.id===vehicle.cardId);return <View key={slot} style={s.fleetImage}>{card?<VehicleArt card={card} style={{width:'100%'}}/>:<View style={s.emptyFleetSlot}><Icon name="fleet" size={18} color={C.muted}/></View>}</View>;})}</View>
 <View style={s.fleetMetrics}><View style={s.fleetMetric}><Icon name="timer" size={16}/><View style={{flex:1,minWidth:0}}><Txt muted style={s.factCaption}>Auftragsdauer</Txt><Txt style={[s.factValue,late&&{color:C.red}]}>{duration===null?'—':minutes(duration)}</Txt></View></View><View style={s.fleetMetric}><Icon name="coin" size={23}/><View style={{flex:1,minWidth:0}}><Txt muted style={s.factCaption}>Geschätzte Gesamtvergütung</Txt><Txt style={s.factValue}>{entry.estimatedCoins==null?'—':n(entry.estimatedCoins)}</Txt></View></View></View>
 {late&&<Txt style={[s.factCaption,{color:C.red,marginTop:5}]}>Überstunden für die Frist nötig</Txt>}
 </Pressable>;
 })}<Txt muted style={s.factCaption}>Gesamtvergütung inkl. Abschlussprämie bei fristgerechtem Abschluss.</Txt>{!fleets.length&&<Txt muted style={s.small}>Mindestens eine Karte muss in einer Flotte eingesetzt sein.</Txt>}</>}{!!startError&&<Txt style={[s.small,{color:C.red,marginTop:8}]}>{startError}</Txt>}</ScrollView><Btn testID="project-start-confirm" disabled={busy||submitting||template===null||!fleets.some((entry:any)=>entry.index===template)||!onCommand} onPress={start}>Auftrag starten</Btn></SafeAreaView></View></Modal>
 </>;
}
export function ProjectBrief({info}:any){
 const sources=info.sources||[info];
 return <><Txt style={[s.title,{marginBottom:8}]}>Belohnungen</Txt><View style={s.briefItems}>{['common','uncommon','rare','epic',...(info.legendary?['legendary']:[])].map(rarity=><ItemArt key={rarity} id={`gear:${rarity}`} size={36}/>)}<ItemArt id="capacityModules" size={36}/></View><Txt muted style={s.small}>Zahnräder nach Transportleistung</Txt><Txt muted style={s.small}>{info.epicMin}–{info.epicMax} Epic-Zahnräder · {n(info.epicChance,2)} %</Txt>{info.legendary&&<Txt muted style={s.small}>{info.legendary.min} Legendär-Zahnrad · {n(info.legendary.extraChance)} % für +1</Txt>}<Txt muted style={s.small}>Kapazitätsmodul · {n(info.moduleChance,2)} %</Txt><Txt muted style={[s.small,{marginTop:6}]}>Abschlussprämie nur innerhalb der Frist</Txt><Txt style={[s.title,{marginTop:16,marginBottom:8}]}>Herkunft</Txt>{sources.map((source:any)=><View key={source.region} style={{marginBottom:8}}><Txt style={{fontSize:12,fontWeight:'700'}}>{source.customer.name} · {source.regionName}</Txt><Txt muted style={s.small}>Endlosexpedition · {n(source.expeditionChance,2)} %</Txt><Txt muted style={s.small}>{source.customerSource} · {n(source.customerChance,2)} %</Txt></View>)}</>;
}
export function ProjectInfo({info}:any){
 const finds=['gear:common','gear:uncommon','gear:rare',...(info.epicChance!==0?['gear:epic']:[]),...(info.legendary?['gear:legendary']:[]),...(info.moduleChance!==0?['capacityModules']:[]),...(info.hermes?.chance>0?['hermes']:[])];
 const rows=Array.from({length:Math.ceil(finds.length/5)},(_,index)=>finds.slice(index*5,index*5+5));
 return <>
  <Card>{fact('Umfang',`${n(info.volume)} t · ${n(info.distance)} km`)}{fact('Frist',minutes(info.deadlineMs/1000))}</Card>
  <Card><Txt style={[s.title,{marginBottom:12}]}>Möglicher Fund</Txt><View material={false} style={s.findGrid}>{rows.map((row,index)=><View key={index} material={false} testID={`project-find-row-${index}`} style={s.findRow}>{row.map(id=><View key={id} material={false} accessible accessibilityLabel={translate(id==='hermes'?'Hermes-Siegel':id.startsWith('gear:')?`${({common:'Common',uncommon:'Uncommon',rare:'Rare',epic:'Epic',legendary:'Legendär'} as Record<string,string>)[id.slice(5)]}-Zahnräder`:itemName(id))} style={s.findCell}>{id==='hermes'?<Icon name="hermes" size={44}/>:<ItemArt id={id} size={44}/>}</View>)}{Array.from({length:5-row.length},(_,empty)=><View key={`empty-${empty}`} material={false} style={s.findCell}/>)}</View>)}</View></Card>
  <Card><Txt style={[s.title,{marginBottom:12}]}>Herkunft</Txt>{(info.sources||[info]).map((source:any)=><View key={source.region} style={{marginBottom:12}}><Txt style={{fontWeight:'700'}}>{source.customer.name} · {source.regionName}</Txt>{fact('Endlosexpedition',`${n(source.expeditionChance,2)} %`)}{fact(source.customerSource,`${n(source.customerChance,2)} %`)}</View>)}</Card>
 </>;
}
export function ProjectType({data,typeKey,onOpen,onExpedition,onCustomers}:any){
 const info=data.projectCatalog.find((p:any)=>p.key===typeKey);
 if(!info)return <Empty>Auftragstyp nicht verfügbar.</Empty>;
 const orders=data.state.orders.filter((o:any)=>o.isProject&&o.projectInfo.key===typeKey),ready=orders.filter((o:any)=>o.status==='queued');
 return <>
  <Row><ItemArt id={info.kind==='referral'?'referral':'special'} size={52}/><Txt style={[s.title,{flex:1}]}>{projectTitle(info.name,info.kind)}</Txt><Pill gold={info.kind==='referral'}>{info.kind==='referral'?'Epic':info.regionName}</Pill></Row><Txt muted style={{marginBottom:12}}>{info.kind==='referral'?'Alle Stammkunden':info.customer.name}</Txt>
  {ready.length?<>{section('Bereit')}{ready.map((o:any)=><ProjectTile key={o.id} order={o} onOpen={onOpen}/>)}</>:<Txt muted style={{marginBottom:12}}>Noch kein Auftrag bereit.</Txt>}
  <ProjectInfo info={info}/>
 </>;
}
// Concrete transports use the same precious-cargo identity as the category cards.
export function RunningProjectCard({order:o,clock,onOpen,onCommand,busy=false}:any){
 const info=o.projectInfo||{},reward=o.completionReward,done=o.status==='completed'&&reward&&!reward.claimedAt;
 const now=Number.isFinite(clock)?clock:0,color=projectColor(o.kind,info.rarity);
 const name=(o.projectName||info.name||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'');
 const deadline=o.project?.deadlineAt,eta=o.eta;
 const etaLabel=o.projection?.feasible===false?'Nicht erreichbar':!Number.isFinite(eta)?'—':eta<=now?'Wird aktualisiert':remaining(eta,now);
 return <Pressable testID={`project-open-${o.id}`} accessibilityRole="button" accessibilityLabel={translate(`${projectTitle(o.projectName,o.kind)}, ${o.customerName}, ${n(o.volume)} t, ${n(o.distance)} km`)} onPress={()=>onOpen?.(o.id)}><Card testID={`running-project-${o.id}`} style={[s.runningCard,rarityStyle(o.kind,info.rarity)]}>
  <View style={s.runningHeading}>
   <View material={false} style={s.runningArt}><ProjectCategoryArt preciousCargo={info.customer?.preciousCargo} referral={o.kind==='referral'}/></View>
   <View material={false} style={s.runningCopy}><Txt style={[s.runningKind,{color}]}>{info.rarity==='legendary'?'LEGENDÄR':o.kind==='referral'?'Empfehlung':'Sonderauftrag'}</Txt><Txt style={s.runningTitle}>{name}</Txt><View style={s.customerLine}><Icon name="home" size={12} color={C.muted}/><Txt muted style={s.runningCustomer}>{o.customerName}</Txt></View><View style={s.cargoLine}><Icon name="orders" size={12} color={C.muted}/><Txt muted style={s.runningFact}>{o.status==='active'?`${n(o.delivered,1)} / ${n(o.volume)} t`:`${n(o.volume)} t`} · {n(o.distance)} km</Txt></View></View>
  </View>
  {o.status==='active'&&<><Bar value={o.volume>0?o.delivered/o.volume*100:0}/><View style={s.runningTimes}><Txt style={s.timeValue}><Txt muted style={s.timeLabel}>Frist</Txt>{' '}<Txt style={[s.timeValue,{color:Number.isFinite(deadline)&&now>=deadline?C.red:C.gold}]}>{Number.isFinite(deadline)?deadline<=now?'Wird geprüft':remaining(deadline,now):'—'}</Txt></Txt><Txt style={s.timeValue}><Txt muted style={s.timeLabel}>Fertig in</Txt>{' '}<Txt style={[s.timeValue,eta>deadline&&{color:C.red}]}>{etaLabel}</Txt></Txt></View>{eta>deadline&&<Txt style={[s.runningFact,{color:C.red,marginTop:3}]}>Voraussichtlich nach Fristende</Txt>}</>}
  {done&&<View style={s.doneActions}><View material={false} style={s.doneStamp}><Txt style={s.doneStampText}>ERLEDIGT</Txt></View></View>}
 </Card></Pressable>;
}
export function RunningProjects({data,clock,onOpen,onCommand,busy=false}:any){
 const orders=orderedRunningProjects(data.state.orders);
 return <>{orders.length?orders.map((o:any)=><RunningProjectCard key={o.id} order={o} clock={clock??data.serverTime} onOpen={onOpen} onCommand={onCommand} busy={busy}/>):<Empty>Keine Großaufträge unterwegs.</Empty>}</>;
}
export function ProjectDetail({data,id,busy,clock,onCommand,onExpedition,onCustomers,onInventory,onFleet,modalBlocked=false}:any){
 const [overtime,setOvertime]=useState(false),[more,setMore]=useState(false),[claiming,setClaiming]=useState(false),[claimError,setClaimError]=useState('');
 const claimingRef=useRef(false);
 useEffect(()=>{setOvertime(false);setClaiming(false);setClaimError('');claimingRef.current=false;},[id]);
 const o=data.state.orders.find((o:any)=>o.id===id&&o.isProject),active=o?.status==='active';
 useEffect(()=>{if(!active)setOvertime(false);},[active]);
 if(!o)return <Empty>Großauftrag nicht verfügbar.</Empty>;
 const info=o.projectInfo,reward=o.completionReward,points=data.state.overtimePoints;
 const name=(o.projectName||info?.name||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'');
 const claim=async()=>{
  if(claimingRef.current||busy||o.status!=='completed'||!reward||reward.claimedAt||!onCommand)return;
  claimingRef.current=true;setClaiming(true);setClaimError('');let accepted=false;
  try{
   const next=await onCommand('claim',{id:o.id});
   accepted=Boolean(next?.state?.orders?.find((entry:any)=>entry.id===o.id)?.completionReward?.claimedAt);
   if(!accepted)setClaimError(next?.message||'Belohnung konnte nicht abgeholt werden. Bitte erneut versuchen.');
  }catch{setClaimError('Belohnung konnte nicht abgeholt werden. Bitte erneut versuchen.');}
  finally{if(!accepted){claimingRef.current=false;setClaiming(false);}}
 };
 return <>
  {active?<>
   <Card><View testID="project-detail-title" style={s.contractTitleBar}><View material={false} style={s.titleRule}/><Txt style={s.contractTitle}>{name}</Txt><View material={false} style={s.titleRule}/></View><ProjectStory order={o}/><Txt literal style={s.detailTons}>{n(o.delivered,1)} / {n(o.volume)} t</Txt><View material={false} testID="project-detail-progress"><Bar value={o.volume>0?o.delivered/o.volume*100:0}/></View><View style={s.times}><View style={{flex:1}}><Txt muted style={s.small}>Frist</Txt><Txt gold>{remaining(o.project.deadlineAt,clock)}</Txt></View><View style={{flex:1,alignItems:'flex-end'}}><Txt muted style={s.small}>Flotte braucht</Txt><Txt style={o.eta>o.project.deadlineAt?{color:C.red}:null}>{o.eta?remaining(o.eta,clock):'—'}</Txt></View></View></Card>
   <Btn disabled={busy||clock>=o.project.deadlineAt} onPress={()=>setOvertime(true)}>Überstunden einsetzen</Btn>
   <Card style={{marginTop:12}}><Row style={{flexWrap:'nowrap'}}><Txt style={[s.title,{flex:1,minWidth:0}]}>Eingesetzte Flotte</Txt><View testID="project-assigned-fleet" style={s.fleetSeal}><Icon name="fleet" size={17} color={C.brassLight}/><Txt style={s.fleetSealText}>Flotte {o.project.template+1}</Txt></View></Row>{o.project.vehicles.map((vehicle:any)=>{const card=data.catalog?.cards?.find((entry:any)=>entry.id===vehicle.cardId);return <View key={vehicle.slot??vehicle.cardId} testID={`project-detail-vehicle-${vehicle.slot??vehicle.cardId}`} style={s.vehicle}><VehicleArt card={card||{name:vehicle.model}} style={s.detailVehicleArt}/><View material={false} style={s.detailVehicleCopy}><Txt style={{fontWeight:'700'}}>{vehicle.model}</Txt>{vehicle.cargo>0&&vehicle.nextAt?<Row style={{marginTop:6,marginBottom:0,flexWrap:'nowrap'}}><Txt gold style={s.small}>{remaining(vehicle.nextAt,clock)}</Txt><Txt muted style={s.small}>{n(vehicle.cargo,2)} t bei Ankunft</Txt></Row>:<Txt muted style={[s.small,{marginTop:6}]}>Keine weitere Tour</Txt>}{vehicle.pendingCardId!==undefined&&vehicle.pendingCardId!==vehicle.cardId&&<Txt gold style={s.small}>{vehicle.pendingModel?`Danach: ${vehicle.pendingModel}`:'Wird nach der Tour entfernt'}</Txt>}</View></View>;})}</Card>
   <Btn secondary onPress={()=>setMore(!more)}>{more?'Weniger Infos':'Belohnungen & Infos'}</Btn>{more&&<View style={{marginTop:12}}><ProjectInfo info={info}/></View>}
  </>:o.status==='completed'?<>
   <ProjectStory order={o}/>
   {reward&&!reward.claimedAt?<Btn disabled={busy||claiming||!onCommand} onPress={claim}>Belohnung entgegennehmen</Btn>:null}
   {!!claimError&&<Txt accessibilityRole="alert" style={[s.small,{color:C.red,marginTop:6}]}>{claimError}</Txt>}
  </>:<>
   <Row><ItemArt id={o.kind==='referral'?'referral':'special'} size={48}/><Txt style={[s.title,{flex:1}]}>{projectTitle(o.projectName,o.kind)}</Txt></Row><Txt muted style={{marginBottom:12}}>{o.customerName}</Txt>
   {o.status==='queued'&&<><Card>{fact('Umfang',`${n(o.volume)} t · ${n(o.distance)} km`)}{fact('Frist ab Start',minutes(o.deadlineMs/1000))}</Card>{o.templates.map((template:any)=><Card key={template.index}><Txt style={s.title}>Flotte {template.index+1}</Txt><Txt muted style={[s.small,{marginTop:8}]}>{template.vehicles?.map((v:any)=>v.model).join(' · ')||'Keine Karten eingesetzt'}</Txt>{template.eta&&<Txt muted style={{marginTop:8}}>{minutes((template.eta-data.serverTime)/1000)}{template.eta-data.serverTime>o.deadlineMs?' · Überstunden nötig':''}</Txt>}<Btn disabled={busy||!template.vehicles} onPress={()=>onCommand('projectStart',{id:o.id,template:template.index})}>Flotte {template.index+1} einsetzen</Btn></Card>)}</>}
   {o.status==='failed'&&<Empty>Frist abgelaufen · keine Abschlussprämie</Empty>}
   <ProjectInfo info={info}/>
  </>}
  {overtime&&active&&<ProjectOvertimeModal key={o.id} order={o} points={points} busy={busy} clock={clock} visible={!modalBlocked} onClose={()=>setOvertime(false)} onCommand={onCommand}/>}

 </>;
}
const s=StyleSheet.create({
 runningCard:{paddingHorizontal:9,paddingVertical:8,marginBottom:4},runningHeading:{flexDirection:'row',alignItems:'center',gap:8},runningArt:{width:58,height:66,position:'relative',flexShrink:0},runningCopy:{flex:1,minWidth:0},runningKind:{fontSize:9,lineHeight:12,fontWeight:'700',letterSpacing:.4,marginBottom:1},runningTitle:{fontSize:14,lineHeight:18,fontWeight:'700',marginBottom:2},customerLine:{flexDirection:'row',alignItems:'center',gap:4},runningCustomer:{fontSize:11,lineHeight:15,flexShrink:1},cargoLine:{flexDirection:'row',alignItems:'center',gap:4,marginTop:2},runningFact:{fontSize:11,lineHeight:15,flexShrink:1},runningTimes:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',columnGap:10,rowGap:2},timeLabel:{fontSize:10,lineHeight:16},timeValue:{fontSize:11,lineHeight:16,fontWeight:'600',flexShrink:1,maxWidth:'100%'},doneActions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-end',columnGap:12,rowGap:5,marginTop:5},doneStamp:{borderWidth:1.5,borderColor:C.uncommon,borderRadius:3,paddingHorizontal:7,paddingVertical:2,transform:[{rotate:'-6deg'}]},doneStampText:{color:C.uncommon,fontSize:11,lineHeight:15,fontWeight:'800',letterSpacing:.8},
 tabs:{flexDirection:'row',gap:5,marginBottom:6},tab:{flex:1,minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,borderRadius:5},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabLabel:{fontSize:12,fontWeight:'700'},tabCount:{fontSize:11,color:C.muted},selectedTabText:{color:C.onInk},rewardDot:{width:7,height:7,borderRadius:4,backgroundColor:C.gold},
 category:{flexDirection:'row',paddingHorizontal:0,paddingVertical:0,overflow:'hidden',minHeight:112,marginBottom:5,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderLeftWidth:4},
 categoryArt:{width:'31%',minWidth:88,position:'relative',overflow:'hidden'},
 regionLabel:{position:'absolute',bottom:0,left:0,right:0,paddingHorizontal:4,paddingVertical:5},
 regionName:{fontSize:10,lineHeight:14,color:C.muted,fontWeight:'600',textAlign:'center'},
 infoButton:{position:'absolute',right:0,top:0,width:44,height:44,alignItems:'center',justifyContent:'center',zIndex:1},
 briefItems:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:8},
 contractFacts:{flexDirection:'row',gap:6,marginTop:10},contractFact:{flex:1,minWidth:0,alignItems:'center',gap:4,paddingVertical:8,paddingHorizontal:3,borderWidth:1,borderColor:C.line,borderRadius:5},factCaption:{fontSize:10,lineHeight:14},factValue:{fontSize:13,lineHeight:18,fontWeight:'700'},fleetImages:{flexDirection:'row',gap:4,marginVertical:8},fleetImage:{flex:1,minWidth:0},emptyFleetSlot:{width:'100%',aspectRatio:1,alignItems:'center',justifyContent:'center',borderWidth:1,borderStyle:'dashed',borderColor:C.line,borderRadius:4,opacity:.5},fleetMetrics:{flexDirection:'row',gap:8},fleetMetric:{flex:1,minWidth:0,flexDirection:'row',alignItems:'center',gap:5},fleetChoice:{padding:10,minHeight:44,borderWidth:1,borderColor:C.line,borderRadius:5,marginBottom:7},
 categoryCopy:{flex:1,minWidth:0,paddingHorizontal:10,paddingVertical:9},
 categoryKind:{fontSize:9,lineHeight:12,fontWeight:'700',letterSpacing:.6,marginBottom:3},
 categoryTitle:{fontSize:16,lineHeight:20,fontWeight:'700',marginBottom:3,paddingRight:28},
 categoryCustomer:{fontSize:11,lineHeight:15},
 categoryFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6,marginTop:7},
 available:{backgroundColor:C.accent,borderColor:C.brass,borderWidth:1,borderRadius:3,paddingHorizontal:7,paddingVertical:3},
 availableText:{color:C.onInk,fontSize:11,lineHeight:15,fontWeight:'700'},
 unavailable:{fontSize:11,lineHeight:15},
findGrid:{gap:8},findRow:{flexDirection:'row'},findCell:{width:'20%',minWidth:0,alignItems:'center',justifyContent:'center'},contractTitleBar:{flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:10,paddingVertical:9,marginBottom:8,backgroundColor:C.ink,borderWidth:1,borderColor:C.brass,borderRadius:4},contractTitle:{flex:1,minWidth:0,fontFamily:displayFont,fontSize:20,lineHeight:26,textAlign:'center',color:C.onInk,fontWeight:'700'},titleRule:{width:14,height:1,backgroundColor:C.brassLight},detailTons:{fontSize:12,lineHeight:18,marginTop:9,textAlign:'center',fontVariant:['tabular-nums']},fleetSeal:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:C.ink,borderWidth:1,borderColor:C.brass,borderRadius:4,paddingHorizontal:9,paddingVertical:6},fleetSealText:{fontSize:12,lineHeight:17,fontWeight:'700',color:C.onInk},detailVehicleArt:{width:56},detailVehicleCopy:{flex:1,minWidth:0},vehicle:{flexDirection:'row',alignItems:'center',gap:9,borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:6,paddingBottom:6},title:{fontSize:15,fontWeight:'700'},small:{fontSize:12,lineHeight:18},section:{fontSize:13,fontWeight:'700',color:C.muted,marginVertical:10},tile:{padding:9,backgroundColor:C.panel,borderColor:C.line,marginBottom:5},loot:{fontSize:12,lineHeight:18,marginTop:7},times:{flexDirection:'row',gap:12,marginTop:8},image:{width:'100%',aspectRatio:16/9,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:12,marginBottom:4},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:20},sheet:{width:'100%',maxWidth:440,maxHeight:'80%',backgroundColor:C.panel,borderRadius:20,borderWidth:1,borderColor:C.line,padding:16},preset:{flex:1,minWidth:0,minHeight:44,borderRadius:10,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'}});
