import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {ProcurementRunCard,ProcurementRunDetail} from './ProcurementRun';
import React,{useEffect,useRef,useState} from 'react';
import {Image,TextInput,ScrollView,StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {Text} from './Language';
import {t as translate} from './i18n';
import {VehicleArt} from './VehicleArt';
import {Icon} from './Icon';
import {regionIdentities} from './regionIdentities';
import {C,Txt,Card,Row,Btn,Empty,n} from './ui';

const ledgerImage=require('../assets/art/procurement/collection-ledger.png');
const regionImages=[require('../assets/art/regions/crownlands.jpg'),require('../assets/art/regions/prairies.jpg'),require('../assets/art/regions/saffron-road.jpg'),require('../assets/art/regions/jade-valley.jpg'),require('../assets/art/regions/northmark.jpg')];

export const procurementHelpNotes=[
 ['Beschaffung planen','Materialien einkaufen und mit Garagenfahrzeugen abholen. Teuer, dauerhaft und auch offline.'],
 ['Mehrere Fahrzeuge','Alle gewählten Fahrzeuge teilen sich die Tourenzahl oder Reserve. Das nächste freie Fahrzeug übernimmt die nächste Tour. Ohne weitere Tour wird es automatisch frei. Reicht der gemeinsame Vorrat bis zur Reserve nicht für die nächste Tour, scheidet das Fahrzeug aus und startet später nicht automatisch neu.'],
 ['Fahrzeuge im Einsatz','Flotteneinsätze bleiben parallel erlaubt. Andere Garageneinsätze sind während der Beschaffung gesperrt.'],
];

export function Procurement({data,busy,clock,onCommand,onExpedition,confirm,modalBlocked=false}:any){
 const p=data.procurement,g=data.state;
 const [claiming,setClaiming]=useState(false),[claimFailed,setClaimFailed]=useState(false),claimInFlight=useRef(false);
 const [region,setRegion]=useState<number|null>(null),[truckIds,setTruckIds]=useState<string[]>([]),[mode,setMode]=useState('count'),[value,setValue]=useState('1');
 const [detailId,setDetailId]=useState<string|null>(null);
 const [dialog,setDialog]=useState<'book'|'sites'|'settings'|null>(null),[saveFailed,setSaveFailed]=useState(false);
 useEffect(()=>{
  if(!p)return;
  setTruckIds(ids=>{const next=ids.filter(id=>p.vehicles.some((v:any)=>v.id===id&&v.free));return next.length===ids.length?ids:next;});
 },[p?.vehicles]);
 if(!p)return <Card><Txt muted>Beschaffung wird geladen …</Txt></Card>;
 const freeVehicles=p.vehicles.filter((v:any)=>v.free),selectedVehicles=freeVehicles.filter((v:any)=>truckIds.includes(v.id));
 const site=p.sites.find((s:any)=>s.region===region);
 const amount=/^\d+$/.test(value)?Number(value):NaN;
 const max=site?Math.min(100000,Math.floor(g.coins/site.price)):0;
 const valid=site?.unlocked&&selectedVehicles.length>0&&selectedVehicles.length<=10&&Number.isSafeInteger(amount)&&amount>=0&&(mode==='count'?amount>0&&amount<=max:amount<=1000000000&&g.coins-site.price>=amount);
 const ready=Object.values(p.pending).some((amount:any)=>amount>0);
 const claim=async()=>{
  if(busy||claimInFlight.current||!ready)return;
  claimInFlight.current=true;setClaiming(true);setClaimFailed(false);
  try{const next=await onCommand('procurementClaim');if(!next?.claimSummary)setClaimFailed(true);}
  catch{setClaimFailed(true);}
  finally{claimInFlight.current=false;setClaiming(false);}
 };
 const regionTitle=(index:number)=>regionIdentities[index]?.title||data.catalog.regionNames[index];
 const visited=p.sites.filter((s:any)=>s.completed>0);
 const close=()=>{setDialog(null);setRegion(null);setSaveFailed(false);};
 const runs=[...(p.groups||[]),...p.runs.filter((r:any)=>!r.groupId)];
 const active=runs.filter((r:any)=>r.status==='active'),detailRun=runs.find((r:any)=>r.id===detailId);
 const openDialog=(next:'book'|'sites')=>{setDetailId(null);setDialog(next);};
 const open=(index:number)=>{setRegion(index);setTruckIds([]);setValue('1');setMode('count');setSaveFailed(false);setDialog('settings');};
 const tourDuration=(milliseconds:number)=>{if(!Number.isFinite(milliseconds)||milliseconds<=0)return null;const seconds=Math.ceil(milliseconds/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
 const vehicleTile=(v:any)=>{const selected=truckIds.includes(v.id),duration=tourDuration(v.durationMs),disabled=busy||!v.free||(!selected&&selectedVehicles.length>=10);return <Pressable key={v.id} accessibilityRole="button" accessibilityLabel={`${translate(v.model)}${duration?`, ${duration} ${translate('Min. je Tour')}`:''}, ${translate(!v.free?'Im Einsatz':selected?'Ausgewählt':'Auswählen')}`} accessibilityState={{selected,disabled}} disabled={disabled} onPress={()=>setTruckIds(ids=>selected?ids.filter(id=>id!==v.id):ids.includes(v.id)?ids:[...ids,v.id])} style={[styles.tile,selected&&styles.selectedTile,!v.free&&styles.unavailableTile]}>
  <VehicleArt card={data.catalog.cards.find((card:any)=>card.id===v.cardId)||data.catalog.cards.find((card:any)=>card.id===g.trucks.find((truck:any)=>truck.id===v.id)?.cardId)} style={{width:'100%'}}/>
  <Text style={styles.vehicleName} android_hyphenationFrequency="normal">{v.model}</Text>
  {duration&&<View style={styles.duration}><Icon name="speed" size={15}/><Txt style={styles.durationText}>{duration} Min.</Txt></View>}
  <View style={styles.selectionState}><Icon name={!v.free?'lock':selected?'check':'plus'} size={13} color={selected?C.accent:C.muted}/><Txt style={[styles.selectionText,selected&&{color:C.accent}]}>{!v.free?'Im Einsatz':selected?'Ausgewählt':'Auswählen'}</Txt></View>
 </Pressable>;};
 const stop=(r:any,immediate:boolean)=>confirm(
  immediate?(r.vehicleIds?'Laufende Touren abbrechen?':'Laufende Tour abbrechen?'):(r.vehicleIds?'Nach laufenden Touren beenden?':'Nach laufender Tour beenden?'),
  immediate?(r.vehicleIds?'Die laufenden Touren verfallen. Ungestartete Touren werden erstattet.':'Der Einsatz der laufenden Tour verfällt. Keine Belohnung. Ungestartete Touren werden erstattet.'):(r.vehicleIds?'Alle laufenden Touren enden mit ihrer Belohnung. Ungestartete Touren werden erstattet.':'Die laufende Tour liefert ihre Belohnung. Ungestartete Touren werden erstattet.'),
  ()=>onCommand(r.vehicleIds?'procurementGroupStop':'procurementStop',{id:r.id,immediate}));

 return <>
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Abhol-Buch öffnen')} onPress={()=>openDialog('book')} style={({pressed})=>[styles.bookRow,pressed&&{opacity:.85}]}><Image source={ledgerImage} accessible={false} resizeMode="contain" fadeDuration={0} style={styles.bookThumbnail}/><View style={styles.bookCopy}><Txt style={styles.bookTitle}>Abhol-Buch</Txt><Txt style={styles.bookSubtitle}>Deine Beschaffungen im Überblick</Txt><Txt style={styles.bookCount}>{n(p.completed)} erfolgreiche Abholungen</Txt></View><Icon name="chevron" size={18} color={C.brassLight}/></Pressable>
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Materialien suchen')} onPress={()=>openDialog('sites')} style={({pressed})=>[styles.selectionCard,pressed&&{opacity:.85}]}><Image source={require('../assets/art/procurement/selection-yard.jpg')} accessible={false} fadeDuration={0} resizeMode="cover" style={styles.selectionImage}/><View style={styles.selectionHeading}><Txt style={styles.selectionTitle}>Materialien suchen</Txt><Icon name="chevron" size={17} color={C.onInk}/></View></Pressable>
  <View style={styles.claimArea}>
   <Row style={{marginBottom:0,flexWrap:'nowrap'}}><Btn style={{flex:1,marginTop:0}} disabled={busy||claiming||!ready} onPress={claim}>{claiming?'Wird eingesammelt …':ready?'Einsammeln':'Noch nichts abzuholen'}</Btn>{ready&&<View testID="procurement-loot-ready" accessible accessibilityLabel={translate('Loot abholbereit')} style={styles.readyDot}/>}</Row>
   {claimFailed&&<Text accessibilityRole="alert" style={styles.claimError}>Belohnungen konnten nicht abgeholt werden. Bitte erneut versuchen.</Text>}
  </View>
  {active.length>0&&<Txt style={styles.heading}>Laufende Beschaffungen</Txt>}
  {active.map((run:any)=><ProcurementRunCard key={run.id} run={run} title={regionTitle(run.region)} data={data} clock={clock} onOpen={()=>setDetailId(run.id)}/>)}
  <ProcurementRunDetail run={detailRun} title={detailRun?regionTitle(detailRun.region):''} data={data} clock={clock} busy={busy} onClose={()=>setDetailId(null)} onStop={stop} modalBlocked={modalBlocked||dialog!==null}/>
  <Modal visible={dialog!==null&&!modalBlocked} transparent animationType="none" onRequestClose={()=>dialog==='settings'?setDialog('sites'):close()}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}>{dialog==='settings'&&<Pressable accessibilityRole="button" accessibilityLabel={translate('Zur Ortsauswahl')} onPress={()=>{setSaveFailed(false);setDialog('sites');}} style={styles.back}><Icon name="back" size={21}/></Pressable>}<Txt style={[styles.heading,{flex:1,minWidth:0,marginBottom:0}]}>{dialog==='book'?'Abhol-Buch':dialog==='sites'?'Ort wählen':'Beschaffung planen'}</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    <ScrollView key={dialog} style={{flexShrink:1}} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:4}}>
     {dialog==='book'&&<>
      <View style={styles.bookPortrait}><Image testID="procurement-ledger-art" source={ledgerImage} accessible={false} resizeMode="contain" fadeDuration={0} style={styles.bookImage}/></View>
      <View style={styles.bookTotal}><Txt muted style={styles.bookTotalLabel}>Erfolgreiche Abholungen insgesamt</Txt><Txt gold style={styles.bookTotalValue}>{n(p.completed)}</Txt></View>
      {visited.length?visited.map((s:any)=><View key={s.region} style={styles.logRow}><Txt style={{flex:1}}>{regionTitle(s.region)}</Txt><Txt gold>{n(s.completed)}</Txt></View>):<Empty>Noch keine erfolgreichen Abholungen.</Empty>}
     </>}
     {dialog==='sites'&&p.sites.map((s:any)=><Card key={s.region} style={[styles.siteCard,!s.unlocked&&styles.lockedSite]}>
      <Pressable accessibilityRole="button" accessibilityLabel={translate('{0} als Beschaffungsort wählen').replace('{0}',translate(regionTitle(s.region)))} accessibilityState={{disabled:busy||!s.unlocked}} disabled={busy||!s.unlocked} onPress={()=>open(s.region)} style={styles.siteChoice}>
       <Image source={regionImages[s.region]} accessible={false} resizeMode="cover" fadeDuration={0} style={styles.siteImage}/>
       <View style={styles.siteCopy}><Txt style={styles.siteTitle}>{regionTitle(s.region)}</Txt><View style={styles.sitePrice}><Icon name="coin" size={24}/><Txt style={styles.sitePriceText}>{translate('{0} je Tour').replace('{0}',n(s.price))}</Txt></View>{!s.unlocked&&<Txt muted style={styles.selectionText}>Gesperrt</Txt>}</View>
       <Icon name={s.unlocked?'chevron':'lock'} size={18} color={s.unlocked?C.gold:C.muted}/>
      </Pressable>
     </Card>)}
     {dialog==='settings'&&<>
      <Txt muted>{site&&regionTitle(site.region)}</Txt>
    <Row style={{marginTop:10,marginBottom:0}}><Txt style={styles.transportHeading}>Transport wählen</Txt><Txt muted style={styles.vehicleStat}>{selectedVehicles.length} ausgewählt</Txt></Row>
    <View style={styles.grid}>{p.vehicles.map((v:any)=>vehicleTile(v))}</View>
    {!freeVehicles.length&&<Txt muted>Kein freies Garagenfahrzeug</Txt>}
    {selectedVehicles.length>=10&&<Txt muted style={styles.vehicleStat}>Maximal 10 Fahrzeuge je Beschaffung.</Txt>}
    <Row style={{flexWrap:'nowrap'}}><Btn style={{flex:1}} secondary={mode!=='count'} onPress={()=>{setMode('count');setValue('1');}}>Feste Tourenzahl</Btn><Btn style={{flex:1}} secondary={mode!=='reserve'} onPress={()=>{setMode('reserve');setValue('0');}}>Bis Reserve</Btn></Row>
    <Txt>{mode==='count'?'Anzahl Touren':'Kontoreserve in Imperium-Taler'}</Txt>
    <View style={styles.amountRow}>
     <TextInput accessibilityLabel={translate(mode==='count'?'Anzahl Touren':'Kontoreserve in Imperium-Taler')} keyboardType="number-pad" value={value} onChangeText={setValue} style={[styles.input,{flex:1,minWidth:0}]}/>
     <Btn secondary disabled={busy} style={{marginTop:0,minWidth:96}} onPress={()=>setValue(String(mode==='count'?max:Math.min(1000000000,(Number.isSafeInteger(amount)?amount:0)+10000)))}>{mode==='count'?'Max':'+10.000'}</Btn>
    </View>
    <Txt muted>{translate('Verfügbar: {0}').replace('{0}',n(g.coins))}</Txt>
    <Btn disabled={busy||!valid} onPress={async()=>{
     setSaveFailed(false);
     const trucks=selectedVehicles.map((v:any)=>v.id);
     const next=await onCommand('procurementGroupStart',{region,trucks,mode,amount});
     if(next?.procurement.groups.some((r:any)=>r.region===region&&r.status==='active'&&trucks.every((id:string)=>r.vehicleIds.includes(id))))close();
     else setSaveFailed(true);
    }}>Beschaffung starten</Btn>
    {saveFailed&&<Text accessibilityRole="alert" style={{color:C.red,marginTop:8}}>Beschaffung konnte nicht gestartet werden. Bitte Auswahl und Guthaben prüfen.</Text>}
    </>}
   </ScrollView></View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({bookRow:{minHeight:130,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:12,borderWidth:1,borderColor:C.brass,borderRadius:7,backgroundColor:C.ink,marginBottom:10},bookThumbnail:{width:88,height:100},bookCopy:{flex:1,minWidth:0,gap:5},bookTitle:{fontSize:19,lineHeight:25,fontWeight:'700',color:C.onInk},bookSubtitle:{fontSize:11,lineHeight:16,color:C.mutedOnInk},bookCount:{fontSize:11,lineHeight:16,color:C.brassLight,marginTop:3},bookPortrait:{alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.line,marginBottom:12},bookImage:{width:'100%',maxWidth:240,height:210},bookTotal:{alignItems:'center',paddingVertical:12,gap:5,backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:6,marginBottom:12},bookTotalLabel:{fontSize:12,lineHeight:18,textAlign:'center'},bookTotalValue:{fontSize:27,lineHeight:34,fontWeight:'700'},claimArea:{marginBottom:16},readyDot:{width:10,height:10,borderRadius:5,backgroundColor:C.uncommon,flexShrink:0},claimError:{fontSize:12,lineHeight:18,color:C.red,marginTop:8},selectionCard:{height:146,borderWidth:1,borderColor:C.line,borderRadius:7,overflow:'hidden',backgroundColor:C.ink,marginBottom:12},selectionImage:{position:'absolute',top:0,bottom:0,left:0,right:0,width:'100%',height:'100%'},selectionHeading:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:12,paddingVertical:8,backgroundColor:'rgba(21,33,33,.68)'},selectionTitle:{flex:1,fontSize:16,lineHeight:22,fontWeight:'600',color:C.onInk},lockedSite:{backgroundColor:C.raised,opacity:.58},lockedProgress:{fontSize:10,lineHeight:14,marginTop:5},lockedActions:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:4,borderTopWidth:1,borderTopColor:C.line},compactLink:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:0,borderTopWidth:0},compactText:{fontSize:11,color:C.accent},logRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.line,marginBottom:5},siteCard:{padding:9,marginBottom:8},siteChoice:{minHeight:68,flexDirection:'row',alignItems:'center',gap:10},siteImage:{width:64,height:64,borderRadius:5},siteCopy:{flex:1,minWidth:0},siteTitle:{fontSize:14,lineHeight:20,fontWeight:'700'},sitePrice:{flexDirection:'row',alignItems:'center',gap:5,marginTop:4},sitePriceText:{fontSize:12,lineHeight:18,flexShrink:1},back:{width:32,minHeight:44,alignItems:'center',justifyContent:'center'},heading:{fontSize:17,fontWeight:'700',marginBottom:8},input:{borderWidth:1,borderColor:C.line,borderRadius:5,padding:12,color:C.text,backgroundColor:C.raised,marginVertical:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:16},modal:{width:'100%',maxWidth:480,maxHeight:'88%',alignSelf:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,padding:16},vehicleStat:{fontSize:11,lineHeight:16,flexShrink:1},transportHeading:{fontSize:14,lineHeight:20,fontWeight:'600'},vehicleName:{color:C.text,fontSize:11,lineHeight:16,minHeight:32,textAlign:'center'},duration:{flexDirection:'row',flexWrap:'nowrap',alignItems:'center',justifyContent:'center',gap:2},durationText:{fontSize:10,lineHeight:16},selectionState:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:3},selectionText:{fontSize:10,lineHeight:15,color:C.muted},selectedTile:{borderColor:C.accent,backgroundColor:C.greenWash},unavailableTile:{opacity:.5},amountRow:{flexDirection:'row',alignItems:'center',gap:8},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8,marginVertical:10},tile:{width:'31%',minWidth:0,borderWidth:1,borderColor:C.line,padding:4,borderRadius:5,gap:4}});

