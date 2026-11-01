import {HubCourierArt} from './HubCourierArt';
import {courierName,courierModel} from '../functions/src/hub-courier';
import {HubArt} from './HubArt';
import {HubCrateCard} from './HubCrateCard';
import {ItemArt,ItemAmount} from './ItemArt';
import {HubVehicleDetail} from './HubVehicleDetail';
import {HubEarnings} from './HubEarnings';
import React,{useRef,useState} from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {t} from './i18n';
import {Icon,IconName} from './Icon';
import {itemName} from './items';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Card,Row,Btn,Bar,Pill,n,remaining} from './ui';

const workTime=(minutes:number)=>`${Math.floor(minutes)}:${String(Math.round(minutes*60)%60).padStart(2,'0')}`;

function Metric({icon,label,value}: {icon:IconName;label:string;value:string}){
 return <View accessible accessibilityLabel={`${t(label)}: ${value}`} style={s.metric}>{label==='Abholhinweise'?<ItemArt id="pickupHints" size={36}/>:label==='Werkzeugkästen'?<ItemArt id="hubVehicleParts" size={36}/>:<Icon name={icon} size={20} color={C.gold}/>}<Txt style={s.metricValue}>{value}</Txt><Txt muted style={s.caption}>{label}</Txt></View>;
}
function Cost({label,owned,need,unit=''}: {label:string;owned:number;need:number;unit?:string}){
 const enough=owned>=need;
 return <View style={s.cost}>{label===itemName('supplierContacts',2)?<ItemArt id="supplierContacts" size={36}/>:label===itemName('companyItems',2)?<ItemArt id="companyItems" size={36}/>:label==='Werkzeugkästen'?<ItemArt id="hubVehicleParts" size={36}/>:null}<Txt muted style={{fontSize:12,flex:1}}>{label}</Txt><View style={s.costValue}><Icon name={enough?'check':'close'} size={13} color={enough?C.accent:C.red}/><Txt style={{fontSize:12,color:enough?C.accent:C.red}}>{n(owned,2)} / {n(need,2)}{unit}</Txt></View></View>;
}
export function HubScreen({data,busy,clock,onCommand,onSell,modalBlocked=false}:any){
 const [tab,setTab]=useState('overview'),[salesOpen,setSalesOpen]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState(false);
 const inFlight=useRef(false),g=data.state,h=g.hubs[0],info=data.hubInfo,locked=busy||pending;
 const command=async(action:string,payload={})=>{
  if(busy||inFlight.current)return;
  inFlight.current=true;setPending(true);setError(false);
  try{const result=await onCommand(action,payload);if(!result)setError(true);return result;}
  catch{setError(true);}finally{inFlight.current=false;setPending(false);}
 };
 const failure=error?<Txt style={s.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>:null;
 if(!h)return <Card><Txt muted>Boten verteilen jede Stunde selbstständig Waren. Erträge und Abholhinweise sammeln sich in der Kasse.</Txt>{!info.unlocked&&<Txt gold style={{marginTop:10}}>Stadthub ab Level 5 verfügbar.</Txt>}{failure}<Btn disabled={locked||!info.unlocked} onPress={()=>command('buyHub')}>Stadthub kostenlos eröffnen</Btn></Card>;
 const salesMax=info.cycle.salesMax??20;
 const canUpgrade=h.salesLevel<salesMax&&!h.construction&&g.inventory.supplierContacts>=info.upgradeContacts&&g.inventory.companyItems>=info.upgradeItems;
 return <>
  <View accessibilityRole="tablist" accessibilityLabel={t('Stadthub')} style={s.tabs}>{[{id:'overview',label:'Übersicht'},{id:'vehicles',label:'Boten'}].map(option=><Pressable key={option.id} accessibilityRole="tab" disabled={locked} accessibilityState={{selected:tab===option.id,disabled:locked}} aria-selected={tab===option.id} onPress={()=>setTab(option.id)} style={[s.tab,tab===option.id&&s.activeTab]}><Txt style={[s.tabLabel,tab===option.id&&{color:C.onInk}]}>{option.label}</Txt></Pressable>)}</View>
  {failure}
  {tab==='overview'?<>
   <HubEarnings hub={h} cycle={info.cycle} clock={clock} busy={locked} onCollect={()=>command('hubCollect')}/>
   <HubParts data={data} busy={locked} clock={clock} onCommand={command} modalBlocked={modalBlocked}/>
   <Card><Row><View style={s.artHeading}><HubArt id="sales"/><Txt style={s.title}>Vertrieb</Txt></View><Pill>Stufe {h.salesLevel} / {salesMax}</Pill></Row>
    <Row style={{marginBottom:4}}><Txt muted>Auslastung</Txt><Txt style={{fontWeight:'700'}}>{workTime(info.cycle.workMinutes)} Min.</Txt></Row>
    <Txt muted style={s.caption}>{n(info.hourlyCapacity,1)} t mögliche Verteilung pro Stunde</Txt>
    {h.construction?<Txt gold style={s.note}>Ausbau fertig in {remaining(h.construction.finishAt,clock)}</Txt>:h.salesLevel>=salesMax?<Txt gold style={s.note}>Maximum erreicht</Txt>:null}
    <Btn secondary onPress={()=>{setError(false);setSalesOpen(true);}}>{h.construction?'Ausbau ansehen':h.salesLevel>=salesMax?'Details':'Verbessern'}</Btn>
   </Card>
  </>:<HubVehicles data={data} busy={locked} onCommand={command} onSell={onSell} modalBlocked={modalBlocked} error={error}/>}
  <ExpeditionPlaceModal visible={salesOpen&&!modalBlocked} title={t('Vertrieb verbessern')} onClose={()=>setSalesOpen(false)}>
   <Row><Txt muted>Stufe</Txt><Txt>{h.salesLevel} / {salesMax}</Txt></Row>
   <Row><Txt muted>Auslastung</Txt><Txt style={{fontWeight:'700'}}>{workTime(info.cycle.workMinutes)}{h.salesLevel<salesMax?` → ${workTime(info.cycle.nextWorkMinutes)}`:''} Min.</Txt></Row>
   <Txt muted style={s.caption}>Mehr Einkauf und längere Auslastung bei gleicher Botenleistung.</Txt>
   {h.construction?<Txt gold style={s.note}>Ausbau fertig in {remaining(h.construction.finishAt,clock)}</Txt>:h.salesLevel>=salesMax?<Txt gold style={s.note}>Maximum erreicht</Txt>:<View style={s.section}>
    <Txt muted style={s.caption}>Vorhanden / Benötigt</Txt>
    <Cost label={itemName('supplierContacts',2)} owned={g.inventory.supplierContacts} need={info.upgradeContacts}/>
    <Cost label={itemName('companyItems',2)} owned={g.inventory.companyItems} need={info.upgradeItems}/>
    <Txt muted style={s.note}>Ausbaudauer: {(h.salesLevel+1)*12} Stunden</Txt>
    {failure}<Btn disabled={locked||!canUpgrade} onPress={()=>command('hubUpgrade')}>Ausbau starten</Btn>
   </View>}
  </ExpeditionPlaceModal>
 </>;
}
export function HubParts({data,busy,clock,onCommand,modalBlocked=false}:any){
 const [found,setFound]=useState<number|null>(null),[opening,setOpening]=useState(false),inFlight=useRef(false),c=data.hubInfo.crates;
 const open=async()=>{
  if(busy||!c.available||inFlight.current)return;
  inFlight.current=true;setOpening(true);
  try{const next=await onCommand('hubCrate');if(next?.hubCrateParts)setFound(next.hubCrateParts);}
  finally{inFlight.current=false;setOpening(false);}
 };
 return <>
  <HubCrateCard crates={c} busy={busy||opening} opening={opening} clock={clock} onOpen={open}/>
  <ExpeditionPlaceModal visible={found!==null&&!modalBlocked} title={t('Fundkiste geöffnet')} onClose={()=>setFound(null)}><View style={{alignItems:'center',padding:12}}><ItemArt id="hubVehicleParts" size={120}/><Txt style={{fontSize:24,fontWeight:'700',marginTop:8}}>+{found}</Txt><Txt>{itemName('hubVehicleParts',2)}</Txt></View><Btn onPress={()=>setFound(null)}>Weiter</Btn></ExpeditionPlaceModal>
 </>;
}
export function HubVehicles({data,busy,onCommand,onSell,modalBlocked=false,error=false}:any){
 const [selected,setSelected]=useState<string|null>(null),[buyOpen,setBuyOpen]=useState(false);
 const g=data.state,info=data.hubInfo,vehicles=g.trucks.filter((truck:any)=>!truck.cardId&&truck.tier<=1),truck=vehicles.find((truck:any)=>truck.id===selected);
 const slots=Math.min(data.hubLimit,info.vehicleMax),canBuy=vehicles.length<slots;
 const tiles=[...vehicles,...(canBuy?[null]:[])],rows=Array.from({length:Math.ceil(tiles.length/3)},(_,i)=>tiles.slice(i*3,i*3+3));
 const failure=error?<Txt style={s.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>:null;
 return <>
  <Row style={{flexWrap:'wrap'}}><View style={s.artHeading}><HubCourierArt size={40}/><Txt style={[s.title,{flexShrink:1}]}>Boten · {vehicles.length} / {data.hubLimit}</Txt></View><View accessible accessibilityLabel={`${t('Werkzeugkästen')}: ${n(g.inventory.hubVehicleParts)}`} style={s.costValue}><ItemArt id="hubVehicleParts" size={28}/><Txt>{n(g.inventory.hubVehicleParts)}</Txt></View></Row>
  {!canBuy&&<Txt muted style={[s.caption,{marginBottom:10}]}>{info.nextVehicleLevel?`${t('Nächster Botenplatz ab Level')} ${info.nextVehicleLevel}`:'Alle 20 Botenplätze freigeschaltet.'}</Txt>}
  {rows.map((row,i)=><View key={i} style={s.gridRow}>{row.map((vehicle:any,j:number)=>vehicle?<Pressable key={vehicle.id} accessibilityRole="button" accessibilityLabel={`${t(courierModel(vehicle))}, ${t(courierName(vehicle))}, ${n(vehicle.capacity,1)} t, ${n(vehicle.speed,2)} km/s, ${t(vehicle.hubAssigned?'Im Hub eingesetzt':'Nicht eingesetzt')}`} onPress={()=>{setSelected(vehicle.id);}} style={({pressed})=>[s.vehicle,pressed&&{opacity:.8}]}>
   <View style={s.truckArt}><HubCourierArt/></View><Txt style={s.vehicleName}>{courierName(vehicle)}</Txt>
   <View style={s.tileFact}><Icon name="capacity" size={18}/><Txt style={s.tileValue}>{n(vehicle.capacity,1)} t</Txt></View><View style={s.tileFact}><Icon name="speed" size={18}/><Txt style={s.tileValue}>{n(vehicle.speed,2)} km/s</Txt></View>
   <View accessible accessibilityLabel={`${t('Laderaum')} ${vehicle.hubCapacityLevel||0}/10`} style={s.level}><Icon name="module" size={11} color={C.muted}/><View style={{flex:1}}><Bar value={(vehicle.hubCapacityLevel||0)*10}/></View><Txt style={s.caption}>{vehicle.hubCapacityLevel||0}/10</Txt></View>
   <View accessible accessibilityLabel={`${t('Antrieb')} ${vehicle.hubSpeedLevel||0}/10`} style={s.level}><Icon name="gear" size={11} color={C.muted}/><View style={{flex:1}}><Bar value={(vehicle.hubSpeedLevel||0)*10}/></View><Txt style={s.caption}>{vehicle.hubSpeedLevel||0}/10</Txt></View>
   <Txt style={[s.caption,{color:vehicle.hubAssigned?C.accent:C.muted,textAlign:'center',marginTop:5}]}>{vehicle.hubAssigned?'Im Hub':'Nicht eingesetzt'}</Txt>
  </Pressable>:<Pressable key={`buy-${j}`} accessibilityRole="button" accessibilityLabel={t('Boten anwerben')} onPress={()=>setBuyOpen(true)} style={[s.vehicle,s.emptySlot]}><Icon name="plus" size={30} color={C.gold}/><Txt style={s.vehicleName}>Anwerben</Txt><Txt muted style={s.caption}>2 t · {n(info.vehiclePrice)} M</Txt></Pressable>)}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={{flex:1}}/>)}</View>)}
  <ExpeditionPlaceModal visible={buyOpen&&!modalBlocked} title={t('Boten anwerben')} onClose={()=>setBuyOpen(false)}><View style={{width:150,alignSelf:'center',marginBottom:12}}><HubCourierArt/></View><Txt>Lastwombat · 2 t Startkapazität</Txt><View style={s.section}><Txt muted style={s.caption}>Vorhanden / Benötigt</Txt><Cost label="Münzen" owned={g.coins} need={info.vehiclePrice} unit=" M"/>{failure}<Btn disabled={busy||!canBuy||g.coins<info.vehiclePrice} onPress={async()=>{if(await onCommand('hubVehicleBuy'))setBuyOpen(false);}}>Anwerben · {n(info.vehiclePrice)} M</Btn></View></ExpeditionPlaceModal>
  {truck&&!modalBlocked&&<HubVehicleDetail key={truck.id} truck={truck} inventory={g.inventory} coins={g.coins} busy={busy} error={error} onCommand={onCommand} onClose={()=>setSelected(null)} onSell={onSell}/>}
 </>;
}
const s=StyleSheet.create({
 artHeading:{flexDirection:'row',alignItems:'center',gap:8,flexShrink:1},
 title:{fontSize:15,fontWeight:'700'},caption:{fontSize:10,lineHeight:16},note:{fontSize:11,lineHeight:17,marginTop:8},error:{color:C.red,fontSize:12,marginBottom:8},
 tabs:{flexDirection:'row',gap:6,marginBottom:10},tab:{flex:1,minHeight:44,borderWidth:1,borderBottomWidth:3,borderColor:C.line,borderRadius:5,backgroundColor:C.raised,justifyContent:'center',alignItems:'center'},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabLabel:{fontSize:13,fontWeight:'700'},
 metrics:{flexDirection:'row',gap:6,marginVertical:4},metric:{flex:1,minWidth:0,alignItems:'center',gap:3},metricValue:{fontSize:16,lineHeight:23,fontWeight:'700',textAlign:'center'},section:{borderTopWidth:1,borderTopColor:C.line,paddingTop:9,marginTop:9},
 cost:{flexDirection:'row',alignItems:'center',gap:6,marginTop:5},costValue:{flexDirection:'row',alignItems:'center',gap:5,flexShrink:1},gridRow:{flexDirection:'row',gap:4.5,marginBottom:5},vehicle:{flex:1,minWidth:0,borderWidth:1,borderTopWidth:3,borderColor:C.line,borderRadius:6,backgroundColor:C.panel,padding:7},vehicleName:{fontSize:13,lineHeight:19,fontWeight:'700',textAlign:'center'},truckArt:{width:'100%',aspectRatio:1,marginBottom:5,overflow:'hidden',borderRadius:5},tileFact:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:3,marginBottom:5},tileValue:{fontSize:10,lineHeight:16,fontWeight:'700',textAlign:'right',flexShrink:1},level:{flexDirection:'row',alignItems:'center',gap:3,marginTop:3},emptySlot:{borderStyle:'dashed',justifyContent:'center',alignItems:'center',gap:12,minHeight:205},toggle:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',minHeight:44}
});
