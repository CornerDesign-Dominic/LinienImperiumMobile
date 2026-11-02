import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {ItemArt} from './ItemArt';
import {ProcurementRunCard,ProcurementRunDetail} from './ProcurementRun';
import React,{useEffect,useState} from 'react';
import {Image,TextInput,ScrollView,StyleSheet} from 'react-native';
import {AppModal as Modal} from './AppModal';
import {Text} from './Language';
import {t as translate} from './i18n';
import {VehicleArt} from './VehicleArt';
import {Icon} from './Icon';
import {regionIdentities} from './regionIdentities';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining} from './ui';
import {itemName} from './items';

export const procurementHelpNotes=[
 ['Beschaffung planen','Materialien einkaufen und mit Garagenfahrzeugen abholen. Teuer, dauerhaft und auch offline.'],
 ['Mehrere Fahrzeuge','Alle gewählten Fahrzeuge teilen sich die Tourenzahl oder Reserve. Das nächste freie Fahrzeug übernimmt die nächste Tour. Ohne weitere Tour wird es automatisch frei. Reicht der gemeinsame Vorrat bis zur Reserve nicht für die nächste Tour, scheidet das Fahrzeug aus und startet später nicht automatisch neu.'],
 ['Fahrzeuge im Einsatz','Flotteneinsätze bleiben parallel erlaubt. Andere Garageneinsätze sind während der Beschaffung gesperrt.'],
];

export function Procurement({data,busy,clock,onCommand,onExpedition,confirm,modalBlocked=false}:any){
 const p=data.procurement,g=data.state;
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
 const rewards=Object.entries(p.pending).filter(([,amount]:any)=>amount>0).map(([id,amount])=>({id,amount}));
 const regionTitle=(index:number)=>regionIdentities[index]?.title||data.catalog.regionNames[index];
 const visited=p.sites.filter((s:any)=>s.completed>0);
 const rewardInfo=(id:string)=>{const rarity=data.catalog.rarities.find((r:any)=>r.id===id);return {name:rarity?`${rarity.label}-Zahnräder`:itemName(id,2),itemId:rarity?`gear:${id}`:id};};
 const rewardTiles=(items:any[],amounts=false)=><View style={amounts?styles.rewards:styles.itemGrid}>{items.map(item=>{const info=rewardInfo(item.id);return <View key={item.id} accessible accessibilityLabel={`${translate(info.name)}${amounts?`: ${n(item.amount)}`:''}`} style={amounts?styles.reward:undefined}><ItemArt id={info.itemId} size={48}/>{amounts&&<Txt style={styles.rewardAmount}>{n(item.amount)}</Txt>}</View>;})}</View>;
 const close=()=>{setDialog(null);setRegion(null);setSaveFailed(false);};
 const runs=[...(p.groups||[]),...p.runs.filter((r:any)=>!r.groupId)];
 const active=runs.filter((r:any)=>r.status==='active'),detailRun=runs.find((r:any)=>r.id===detailId);
 const openDialog=(next:'book'|'sites')=>{setDetailId(null);setDialog(next);};
 const open=(index:number)=>{setRegion(index);setTruckIds([]);setValue('1');setMode('count');setSaveFailed(false);setDialog('settings');};
 const tourDuration=(milliseconds:number)=>{if(!Number.isFinite(milliseconds)||milliseconds<=0)return null;const seconds=Math.ceil(milliseconds/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
 const vehicleTile=(v:any)=>{const selected=truckIds.includes(v.id),duration=tourDuration(v.durationMs),disabled=busy||!v.free||(!selected&&selectedVehicles.length>=10);return <Pressable key={v.id} accessibilityRole="button" accessibilityLabel={`${translate(v.model)}${duration?`, ${duration} ${translate('Min. je Tour')}`:''}, ${translate(!v.free?'Im Einsatz':selected?'Ausgewählt':'Auswählen')}`} accessibilityState={{selected,disabled}} disabled={disabled} onPress={()=>setTruckIds(ids=>selected?ids.filter(id=>id!==v.id):ids.includes(v.id)?ids:[...ids,v.id])} style={[styles.tile,selected&&styles.selectedTile,!v.free&&styles.unavailableTile]}>
  <VehicleArt card={data.catalog.cards.find((card:any)=>card.id===v.cardId)||data.catalog.cards.find((card:any)=>card.id===g.trucks.find((truck:any)=>truck.id===v.id)?.cardId)} style={{width:'100%'}}/>
  <Text style={styles.vehicleName} android_hyphenationFrequency="normal">{v.model}</Text>
  {duration&&<View style={styles.duration}><Icon name="speed" size={15}/><Txt style={styles.vehicleStat}>{duration} Min. je Tour</Txt></View>}
  <View style={styles.selectionState}><Icon name={!v.free?'lock':selected?'check':'plus'} size={13} color={selected?C.accent:C.muted}/><Txt style={[styles.selectionText,selected&&{color:C.accent}]}>{!v.free?'Im Einsatz':selected?'Ausgewählt':'Auswählen'}</Txt></View>
 </Pressable>;};
 const stop=(r:any,immediate:boolean)=>confirm(
  immediate?(r.vehicleIds?'Laufende Touren abbrechen?':'Laufende Tour abbrechen?'):(r.vehicleIds?'Nach laufenden Touren beenden?':'Nach laufender Tour beenden?'),
  immediate?(r.vehicleIds?'Die laufenden Touren verfallen. Ungestartete Touren werden erstattet.':'Der Einsatz der laufenden Tour verfällt. Keine Belohnung. Ungestartete Touren werden erstattet.'):(r.vehicleIds?'Alle laufenden Touren enden mit ihrer Belohnung. Ungestartete Touren werden erstattet.':'Die laufende Tour liefert ihre Belohnung. Ungestartete Touren werden erstattet.'),
  ()=>onCommand(r.vehicleIds?'procurementGroupStop':'procurementStop',{id:r.id,immediate}));

 return <>
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Abhol-Buch öffnen')} onPress={()=>openDialog('book')} style={styles.bookRow}><Icon name="book" size={22} color={C.gold}/><Txt style={styles.bookTitle}>Abhol-Buch</Txt><Icon name="chevron" size={16}/></Pressable>
  {rewards.length>0&&<Card><Txt style={styles.heading}>Belohnungen</Txt>{rewardTiles(rewards,true)}<Btn disabled={busy} onPress={()=>onCommand('procurementClaim')}>Einsammeln</Btn></Card>}
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Beschaffungsort wählen')} onPress={()=>openDialog('sites')} style={({pressed})=>[styles.selectionCard,pressed&&{opacity:.85}]}><Image source={require('../assets/art/procurement/selection-yard.jpg')} accessible={false} fadeDuration={0} resizeMode="cover" style={styles.selectionImage}/><View style={styles.selectionHeading}><Txt style={styles.selectionTitle}>Beschaffungsort wählen</Txt><Icon name="chevron" size={17} color={C.onInk}/></View></Pressable>
  {active.length>0&&<Txt style={styles.heading}>Laufende Beschaffungen</Txt>}
  {active.map((run:any)=><ProcurementRunCard key={run.id} run={run} title={regionTitle(run.region)} data={data} clock={clock} onOpen={()=>setDetailId(run.id)}/>)}
  <ProcurementRunDetail run={detailRun} title={detailRun?regionTitle(detailRun.region):''} data={data} clock={clock} busy={busy} onClose={()=>setDetailId(null)} onStop={stop} modalBlocked={modalBlocked||dialog!==null}/>
  <Modal visible={dialog!==null&&!modalBlocked} transparent animationType="none" onRequestClose={()=>dialog==='settings'?setDialog('sites'):close()}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}>{dialog==='settings'&&<Pressable accessibilityRole="button" accessibilityLabel={translate('Zur Ortsauswahl')} onPress={()=>{setSaveFailed(false);setDialog('sites');}} style={styles.back}><Icon name="back" size={21}/></Pressable>}<Txt style={[styles.heading,{flex:1,minWidth:0,marginBottom:0}]}>{dialog==='book'?'Abhol-Buch':dialog==='sites'?'Ort wählen':'Beschaffung planen'}</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    <ScrollView key={dialog} style={{flexShrink:1}} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:4}}>
     {dialog==='book'&&<>
      <Row><Txt muted>Erfolgreiche Abholungen insgesamt</Txt><Txt gold>{n(p.completed)}</Txt></Row>
      {visited.length?visited.map((s:any)=><View key={s.region} style={styles.logRow}><Txt style={{flex:1}}>{regionTitle(s.region)}</Txt><Txt gold>{n(s.completed)}</Txt></View>):<Empty>Noch keine erfolgreichen Abholungen.</Empty>}
     </>}
     {dialog==='sites'&&p.sites.map((s:any)=>{return <Card key={s.region} style={!s.unlocked&&styles.lockedSite}>
      <Pressable accessibilityRole="button" accessibilityLabel={translate('{0} als Beschaffungsort wählen').replace('{0}',translate(regionTitle(s.region)))} accessibilityState={{disabled:busy||!s.unlocked}} disabled={busy||!s.unlocked} onPress={()=>open(s.region)} style={[styles.siteChoice,!s.unlocked&&{minHeight:0}]}>
       <Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={[styles.heading,{flex:1,marginBottom:0},!s.unlocked&&{fontSize:15}]}>{regionTitle(s.region)}</Txt><Icon name={s.unlocked?'chevron':'lock'} size={s.unlocked?18:15} color={s.unlocked?C.gold:C.muted}/></Row>
       <Row style={{marginBottom:0}}><Txt gold style={!s.unlocked&&{fontSize:12}}>{translate('{0} T je Tour').replace('{0}',n(s.price))}</Txt>{!s.unlocked&&<Txt muted style={{fontSize:11}}>Gesperrt</Txt>}</Row>
      </Pressable>
      {!s.unlocked&&<Txt muted style={styles.lockedProgress}>{translate('Orte {0}/7 · Lieferungen {1}/7 · Endloslieferung {2}/1').replace('{0}',String(s.discovered)).replace('{1}',String(s.deliveries)).replace('{2}',String(Number(s.finalClaimed)))}</Txt>}
      {!s.unlocked&&<View style={styles.lockedActions}><Pressable accessibilityRole="button" accessibilityLabel={translate('Zur Expedition')} onPress={()=>{close();onExpedition(s.region);}} style={styles.compactLink}><Txt style={styles.compactText}>Zur Expedition</Txt><Icon name="arrow" size={12} color={C.accent}/></Pressable></View>}
     </Card>;})}
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
    <Txt muted>{translate('Verfügbar: {0} T').replace('{0}',n(g.coins))}</Txt>
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
const styles=StyleSheet.create({bookRow:{minHeight:48,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:6,borderWidth:1,borderColor:C.line,borderRadius:7,backgroundColor:C.panel,marginBottom:10},bookTitle:{flex:1,fontSize:14,lineHeight:20,fontWeight:'600'},selectionCard:{height:146,borderWidth:1,borderColor:C.line,borderRadius:7,overflow:'hidden',backgroundColor:C.ink,marginBottom:12},selectionImage:{position:'absolute',top:0,bottom:0,left:0,right:0,width:'100%',height:'100%'},selectionHeading:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:12,paddingVertical:8,backgroundColor:'rgba(21,33,33,.68)'},selectionTitle:{flex:1,fontSize:16,lineHeight:22,fontWeight:'600',color:C.onInk},lockedSite:{padding:10,marginBottom:8,backgroundColor:C.raised,borderStyle:'dashed'},lockedProgress:{fontSize:10,lineHeight:14,marginTop:5},lockedActions:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:4,borderTopWidth:1,borderTopColor:C.line},compactLink:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:0,borderTopWidth:0},compactText:{fontSize:11,color:C.accent},rewards:{flexDirection:'row',flexWrap:'wrap',gap:12,marginVertical:8},reward:{minWidth:50,maxWidth:92,alignItems:'center',justifyContent:'center',gap:5},rewardAmount:{fontWeight:'700',fontSize:15},itemGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginVertical:8},logRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.line,marginBottom:5},siteChoice:{minHeight:54,justifyContent:'center'},back:{width:32,minHeight:44,alignItems:'center',justifyContent:'center'},heading:{fontSize:17,fontWeight:'700',marginBottom:8},input:{borderWidth:1,borderColor:C.line,borderRadius:5,padding:12,color:C.text,backgroundColor:C.raised,marginVertical:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:16},modal:{width:'100%',maxWidth:480,maxHeight:'88%',alignSelf:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,padding:16},vehicleStat:{fontSize:11,lineHeight:16,flexShrink:1},transportHeading:{fontSize:14,lineHeight:20,fontWeight:'600'},vehicleName:{color:C.text,fontSize:12,lineHeight:17,minHeight:34,textAlign:'center'},duration:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4},selectionState:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:3},selectionText:{fontSize:10,lineHeight:15,color:C.muted},selectedTile:{borderColor:C.accent,backgroundColor:C.greenWash},unavailableTile:{opacity:.5},amountRow:{flexDirection:'row',alignItems:'center',gap:8},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8,marginVertical:10},tile:{width:'48%',minWidth:0,borderWidth:1,borderColor:C.line,padding:8,borderRadius:5,gap:5}});

