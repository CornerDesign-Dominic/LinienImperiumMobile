import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {HubCourierArt} from './HubCourierArt';
import {courierName,courierModel} from '../functions/src/hub-courier';
import {HubSales} from './HubSales';
import {HubCrateCard} from './HubCrateCard';
import {ItemArt} from './ItemArt';
import {HubVehicleDetail} from './HubVehicleDetail';
import {HubEarnings} from './HubEarnings';
import React,{useRef,useState} from 'react';
import {Image,StyleSheet} from 'react-native';
import {t} from './i18n';
import {Icon,IconName} from './Icon';
import {itemName} from './items';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {C,Txt,Card,Row,Btn,n} from './ui';

function Metric({icon,label,value}: {icon:IconName;label:string;value:string}){
 return <View accessible accessibilityLabel={`${t(label)}: ${value}`} style={s.metric}>{label==='Abholhinweise'?<ItemArt id="pickupHints" size={36}/>:label==='Werkzeugkästen'?<ItemArt id="hubVehicleParts" size={36}/>:<Icon name={icon} size={20} color={C.gold}/>}<Txt style={s.metricValue}>{value}</Txt><Txt muted style={s.caption}>{label}</Txt></View>;
}
function Cost({label,owned,need,unit=''}: {label:string;owned:number;need:number;unit?:string}){
 const enough=owned>=need;
 return <View style={s.cost}>{label===itemName('supplierContacts',2)?<ItemArt id="supplierContacts" size={36}/>:label===itemName('companyItems',2)?<ItemArt id="companyItems" size={36}/>:label==='Werkzeugkästen'?<ItemArt id="hubVehicleParts" size={36}/>:null}<Txt muted style={{fontSize:12,flex:1}}>{label}</Txt><View style={s.costValue}><Icon name={enough?'check':'close'} size={13} color={enough?C.accent:C.red}/><Txt style={{fontSize:12,color:enough?C.accent:C.red}}>{n(owned,2)} / {n(need,2)}{unit}</Txt></View></View>;
}
export function HubScreen({data,busy,clock,onCommand,onSell,modalBlocked=false}:any){
 const [tab,setTab]=useState('overview'),[pending,setPending]=useState(false),[error,setError]=useState(false);
 const inFlight=useRef(false),g=data.state,h=g.hubs[0],info=data.hubInfo,locked=busy||pending;
 const command=async(action:string,payload={})=>{
  if(busy||inFlight.current)return;
  inFlight.current=true;setPending(true);setError(false);
  try{const result=await onCommand(action,payload);if(!result)setError(true);return result;}
  catch{setError(true);}finally{inFlight.current=false;setPending(false);}
 };
 const failure=error?<Txt style={s.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>:null;
 if(!h)return <Card><Txt muted>Boten verteilen jede Stunde selbstständig Waren. Erträge und Abholhinweise sammeln sich in der Kasse.</Txt>{!info.unlocked&&<Txt gold style={{marginTop:10}}>Botenstation ab Level 5 verfügbar.</Txt>}{failure}<Btn disabled={locked||!info.unlocked} onPress={()=>command('buyHub')}>Botenstation kostenlos eröffnen</Btn></Card>;
 return <>
  <View accessibilityRole="tablist" accessibilityLabel={t('Botenstation')} style={s.tabs}>{[{id:'overview',label:'Übersicht'},{id:'vehicles',label:'Boten'}].map(option=><Pressable key={option.id} accessibilityRole="tab" disabled={locked} accessibilityState={{selected:tab===option.id,disabled:locked}} aria-selected={tab===option.id} onPress={()=>setTab(option.id)} style={[s.tab,tab===option.id&&s.activeTab]}><Txt style={[s.tabLabel,tab===option.id&&{color:C.onInk}]}>{option.label}</Txt></Pressable>)}</View>
  {failure}
  {tab==='overview'?<>
   <HubEarnings hub={h} cycle={info.cycle} clock={clock} busy={locked} onCollect={()=>command('hubCollect')}/>
   <HubParts data={data} busy={locked} clock={clock} onCommand={command} modalBlocked={modalBlocked}/>
   <HubSales hub={h} info={info} inventory={g.inventory} busy={locked} error={error} clock={clock} onOpen={()=>setError(false)} onCommand={command} modalBlocked={modalBlocked}/>
  </>:<HubVehicles data={data} busy={locked} onCommand={command} onSell={onSell} modalBlocked={modalBlocked} error={error}/>}
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
  <ExpeditionPlaceModal visible={found!==null&&!modalBlocked} title={t('Belohnung')} subtitle={t('Verlorene Zustellung')} onClose={()=>setFound(null)}><View style={{alignItems:'center',padding:12}}><ItemArt id="hubVehicleParts" size={120}/><Txt style={{fontSize:24,fontWeight:'700',marginTop:8}}>+{found}</Txt><Txt>{itemName('hubVehicleParts',2)}</Txt></View></ExpeditionPlaceModal>
 </>;
}
export function HubVehicles({data,busy,onCommand,onSell,modalBlocked=false,error=false}:any){
 const [selected,setSelected]=useState<string|null>(null),[buyOpen,setBuyOpen]=useState(false);
 const g=data.state,info=data.hubInfo,vehicles=g.trucks.filter((truck:any)=>!truck.cardId&&truck.tier<=1),truck=vehicles.find((truck:any)=>truck.id===selected);
 const slots=Math.min(data.hubLimit,info.vehicleMax),canBuy=vehicles.length<slots;
 const tiles=[...vehicles,...(canBuy?[{slot:'buy'}]:info.nextVehicleLevel?[{slot:'locked'}]:[])],rows=Array.from({length:Math.ceil(tiles.length/3)},(_,i)=>tiles.slice(i*3,i*3+3));
 const failure=error?<Txt style={s.error}>Aktion fehlgeschlagen. Bitte erneut versuchen.</Txt>:null;
 return <>
  {rows.map((row,i)=><View key={i} style={s.gridRow}>{row.map((vehicle:any,j:number)=><View key={vehicle.id||vehicle.slot} style={s.gridCell}>{!vehicle.slot?<Pressable accessibilityRole="button" accessibilityLabel={`${t(courierModel(vehicle))}, ${t(courierName(vehicle))}, ${n(vehicle.capacity,1)} t, ${n(vehicle.speed,2)} km/s, ${t(vehicle.hubAssigned?'In der Botenstation eingesetzt':'Nicht eingesetzt')}`} onPress={()=>setSelected(vehicle.id)} style={({pressed})=>[s.vehicle,pressed&&{opacity:.8}]}>
   <View style={s.truckArt}><HubCourierArt flush/></View>
   <View style={s.tileDetails}>
    <View style={s.tileFact}><Icon name="capacity" size={18}/><Txt style={s.tileValue}>{n(vehicle.capacity,1)} t</Txt></View><View style={s.tileFact}><Icon name="speed" size={18}/><Txt style={s.tileValue}>{n(vehicle.speed,2)} km/s</Txt></View>
    <View style={s.tileUpgrades}>{(['capacity','speed'] as const).map(kind=>{
     const q=vehicle.hubUpgrades?.[kind],level=q?.level??vehicle[kind==='capacity'?'hubCapacityLevel':'hubSpeedLevel']??0,max=q?.max??10;
     const available=q&&level<max&&g.coins>=q.coins&&g.inventory.hubVehicleParts>=q.parts;
     return <View key={kind} accessible accessibilityLabel={`${t(kind==='capacity'?'Laderaum':'Antrieb')}: ${level} / ${max}${available?`, ${t('Verbesserung verfügbar')}`:''}`} style={s.level}><Icon name={kind==='capacity'?'module':'gear'} size={16} color={C.gold}/><Txt style={s.tileValue}>{level} / {max}</Txt><View style={[s.upgradeDot,!available&&{opacity:0}]}/></View>;
    })}</View>
   </View>
  </Pressable>:vehicle.slot==='buy'?<Pressable key="buy" accessibilityRole="button" accessibilityLabel={t('Boten anwerben')} disabled={busy} onPress={()=>setBuyOpen(true)} style={[s.vehicle,s.emptySlot]}><Icon name="plus" size={30} color={C.gold}/><Txt style={s.slotTitle}>Anwerben</Txt><Txt muted style={s.slotCaption}>2 t · {n(info.vehiclePrice)}</Txt></Pressable>:<View key="locked" testID="hub-locked-slot" accessible accessibilityLabel={`${t('Nächster Botenplatz ab Level')} ${info.nextVehicleLevel}`} style={[s.vehicle,s.emptySlot,s.lockedSlot]}><Image source={require('../assets/art/hub/locked-slot.png')} accessible={false} resizeMode="contain" fadeDuration={0} style={s.lockArt}/><Txt style={s.slotTitle}>Nächster Botenplatz</Txt><Txt muted style={s.slotCaption}>Ab Level {info.nextVehicleLevel}</Txt></View>}</View>)}{row.length<3&&Array.from({length:3-row.length},(_,j)=><View key={`space-${j}`} style={s.gridCell}/>)}</View>)}
  <ExpeditionPlaceModal visible={buyOpen&&!modalBlocked} title={t('Boten anwerben')} onClose={()=>setBuyOpen(false)}><View style={{width:150,alignSelf:'center',marginBottom:12}}><HubCourierArt/></View><Txt>Lastwombat · 2 t Startkapazität</Txt><View style={s.section}><Txt muted style={s.caption}>Vorhanden / Benötigt</Txt><Cost label="Imperium-Taler" owned={g.coins} need={info.vehiclePrice} unit=""/>{failure}<Btn disabled={busy||!canBuy||g.coins<info.vehiclePrice} onPress={async()=>{if(await onCommand('hubVehicleBuy'))setBuyOpen(false);}}>Anwerben · {n(info.vehiclePrice)}</Btn></View></ExpeditionPlaceModal>
  {truck&&!modalBlocked&&<HubVehicleDetail key={truck.id} truck={truck} inventory={g.inventory} coins={g.coins} busy={busy} error={error} onCommand={onCommand} onClose={()=>setSelected(null)} onSell={onSell}/>}
 </>;
}
const s=StyleSheet.create({
 artHeading:{flexDirection:'row',alignItems:'center',gap:8,flexShrink:1},
 title:{fontSize:15,fontWeight:'700'},caption:{fontSize:10,lineHeight:16},note:{fontSize:11,lineHeight:17,marginTop:8},error:{color:C.red,fontSize:12,marginBottom:8},
 tabs:{flexDirection:'row',gap:6,marginBottom:6},tab:{flex:1,minHeight:44,borderWidth:1,borderBottomWidth:3,borderColor:C.line,borderRadius:5,backgroundColor:C.raised,justifyContent:'center',alignItems:'center'},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabLabel:{fontSize:13,fontWeight:'700'},
 metrics:{flexDirection:'row',gap:6,marginVertical:4},metric:{flex:1,minWidth:0,alignItems:'center',gap:3},metricValue:{fontSize:16,lineHeight:23,fontWeight:'700',textAlign:'center'},section:{borderTopWidth:1,borderTopColor:C.line,paddingTop:9,marginTop:9},
 cost:{flexDirection:'row',alignItems:'center',gap:6,marginTop:5},costValue:{flexDirection:'row',alignItems:'center',gap:5,flexShrink:1},gridRow:{flexDirection:'row',gap:4.5,marginBottom:3},gridCell:{flex:1,minWidth:0},lockArt:{width:42,height:42},vehicle:{width:'100%',aspectRatio:.48,minHeight:230,borderWidth:1,borderColor:C.line,borderRadius:6,backgroundColor:C.panel,overflow:'hidden'},truckArt:{width:'100%',aspectRatio:1,position:'relative'},tileDetails:{paddingHorizontal:7,paddingVertical:7},tileFact:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:3,minHeight:24},tileValue:{fontSize:10,lineHeight:16,fontWeight:'600',textAlign:'right',flexShrink:1},tileUpgrades:{borderTopWidth:1,borderTopColor:C.line,marginTop:4,paddingTop:4},level:{flexDirection:'row',alignItems:'center',gap:5,minHeight:23},upgradeDot:{width:5,height:5,borderRadius:3,backgroundColor:C.brass,marginLeft:'auto'},emptySlot:{justifyContent:'center',alignItems:'center',gap:10,padding:7,minHeight:230},lockedSlot:{backgroundColor:C.raised},slotTitle:{fontSize:12,lineHeight:17,fontWeight:'600',textAlign:'center'},slotCaption:{fontSize:10,lineHeight:16,textAlign:'center'},toggle:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',minHeight:44}
});

