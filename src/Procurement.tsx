import {ItemArt,ItemAmount} from './ItemArt';
import React,{useEffect,useState} from 'react';
import {View,TextInput,Modal,ScrollView,Pressable,StyleSheet} from 'react-native';
import {Text} from './Language';
import {t as translate} from './i18n';
import {VehicleArt} from './VehicleArt';
import {Icon,stockIcon} from './Icon';
import {regionIdentities} from './regionIdentities';
import {C,Txt,Card,Row,Btn,Bar,Pill,Empty,n,remaining} from './ui';
import {itemName,rarityColor} from './items';

export const procurementHelpNotes=[
 ['Beschaffung planen','Materialien einkaufen und mit Garagenfahrzeugen abholen. Teuer, dauerhaft und auch offline.'],
 ['Mehrere Fahrzeuge','Alle gewählten Fahrzeuge teilen sich die Tourenzahl oder Reserve. Das nächste freie Fahrzeug übernimmt die nächste Tour. Ohne weitere Tour wird es automatisch frei. Reicht der gemeinsame Vorrat bis zur Reserve nicht für die nächste Tour, scheidet das Fahrzeug aus und startet später nicht automatisch neu.'],
 ['Fahrzeuge im Einsatz','Flotteneinsätze bleiben parallel erlaubt. Andere Garageneinsätze sind während der Beschaffung gesperrt.'],
];

export function Procurement({data,busy,clock,onCommand,onExpedition,confirm,modalBlocked=false}:any){
 const p=data.procurement,g=data.state;
 const [region,setRegion]=useState<number|null>(null),[truckIds,setTruckIds]=useState<string[]>([]),[mode,setMode]=useState('count'),[value,setValue]=useState('1'),[picker,setPicker]=useState(false);
 const [dialog,setDialog]=useState<'book'|'sites'|'settings'|null>(null),[expanded,setExpanded]=useState<number[]>([]),[saveFailed,setSaveFailed]=useState(false);
 useEffect(()=>{
  if(!p)return;
  setTruckIds(ids=>{const next=ids.filter(id=>p.vehicles.some((v:any)=>v.id===id&&v.free));return next.length===ids.length?ids:next;});
 },[p?.vehicles]);
 if(!p)return <Card><Txt muted>Beschaffung wird geladen …</Txt></Card>;
 const freeVehicles=p.vehicles.filter((v:any)=>v.free),selectedVehicles=freeVehicles.filter((v:any)=>truckIds.includes(v.id)),available=freeVehicles.filter((v:any)=>!truckIds.includes(v.id));
 const site=p.sites.find((s:any)=>s.region===region);
 const amount=/^\d+$/.test(value)?Number(value):NaN;
 const max=site?Math.min(100000,Math.floor(g.coins/site.price)):0;
 const valid=site?.unlocked&&selectedVehicles.length>0&&Number.isSafeInteger(amount)&&amount>=0&&(mode==='count'?amount>0&&amount<=max:amount<=1000000000&&g.coins-site.price>=amount);
 const rewards=Object.entries(p.pending).filter(([,amount]:any)=>amount>0).map(([id,amount])=>({id,amount}));
 const regionTitle=(index:number)=>regionIdentities[index]?.title||data.catalog.regionNames[index];
 const visited=p.sites.filter((s:any)=>s.completed>0);
 const rewardInfo=(id:string)=>{const rarity=data.catalog.rarities.find((r:any)=>r.id===id);return {name:rarity?`${rarity.label}-Zahnräder`:itemName(id,2),itemId:rarity?`gear:${id}`:id,icon:stockIcon(rarity?`gear:${id}`:id),color:rarity?rarityColor(id):C.gold};};
 const rewardTiles=(items:any[],amounts=false)=><View style={amounts?styles.rewards:styles.itemGrid}>{items.map(item=>{const info=rewardInfo(item.id);return <View key={item.id} accessible accessibilityLabel={`${translate(info.name)}${amounts?`: ${n(item.amount)}`:''}`} style={amounts?styles.reward:[styles.itemCard,{borderColor:info.color}]}>{amounts?<><ItemArt id={info.itemId} size={48}/><Txt style={styles.rewardAmount}>{n(item.amount)}</Txt></>:<><View style={styles.itemArtwork}><ItemArt id={info.itemId} size={48}/></View><Text numberOfLines={3} style={styles.itemName}>{info.name.replace(/Firmenausbau/g,'Firmen\u00adausbau').replace(/Kapazitätsmodul/g,'Kapazitäts\u00admodul')}</Text></>}</View>;})}</View>;
 const close=()=>{setDialog(null);setRegion(null);setPicker(false);setSaveFailed(false);};
 const runs=[...(p.groups||[]),...p.runs.filter((r:any)=>!r.groupId)];
 const active=runs.filter((r:any)=>r.status==='active');
 const open=(index:number)=>{setRegion(index);setTruckIds([]);setValue('1');setMode('count');setPicker(false);setSaveFailed(false);setDialog('settings');};
 const vehicleTile=(v:any,selected:boolean)=><Pressable key={v.id} accessibilityRole="button" accessibilityLabel={translate(v.model)+(selected?', '+translate('Entfernen'):'')} disabled={busy} onPress={()=>{if(selected)setTruckIds(ids=>ids.filter(id=>id!==v.id));else{setTruckIds(ids=>ids.includes(v.id)?ids:[...ids,v.id]);setPicker(false);}}} style={[styles.tile,selected&&{borderColor:C.accent,backgroundColor:C.greenWash}]}>
  <VehicleArt card={data.catalog.cards.find((card:any)=>card.id===v.cardId)||data.catalog.cards.find((card:any)=>card.id===g.trucks.find((truck:any)=>truck.id===v.id)?.cardId)} style={{width:52}}/>{selected&&<Icon name="close" size={12} color={C.muted} style={{position:'absolute',top:5,right:5}}/>}<Text numberOfLines={2} style={{color:C.text,fontSize:12}}>{v.model}</Text><Txt style={styles.vehicleStat}>{n(v.capacity,1)} t</Txt><Txt muted style={styles.vehicleStat}>{n(v.speed,2)} km/s</Txt>
 </Pressable>;
 const stop=(r:any,immediate:boolean)=>confirm(
  immediate?(r.vehicleIds?'Laufende Touren abbrechen?':'Laufende Tour abbrechen?'):(r.vehicleIds?'Nach laufenden Touren beenden?':'Nach laufender Tour beenden?'),
  immediate?(r.vehicleIds?'Die laufenden Touren verfallen. Ungestartete Touren werden erstattet.':'Der Einsatz der laufenden Tour verfällt. Keine Belohnung. Ungestartete Touren werden erstattet.'):(r.vehicleIds?'Alle laufenden Touren enden mit ihrer Belohnung. Ungestartete Touren werden erstattet.':'Die laufende Tour liefert ihre Belohnung. Ungestartete Touren werden erstattet.'),
  ()=>onCommand(r.vehicleIds?'procurementGroupStop':'procurementStop',{id:r.id,immediate}));

 return <>
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Abhol-Buch öffnen')} onPress={()=>setDialog('book')}><Card><Row style={{marginBottom:0,flexWrap:'nowrap'}}><Icon name="book" size={27} color={C.gold}/><Txt style={[styles.heading,{flex:1,marginBottom:0}]}>Abhol-Buch</Txt><Icon name="chevron" size={16}/></Row></Card></Pressable>
  {rewards.length>0&&<Card><Txt style={styles.heading}>Belohnungen</Txt>{rewardTiles(rewards,true)}<Btn disabled={busy} onPress={()=>onCommand('procurementClaim')}>Einsammeln</Btn></Card>}
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Beschaffungsort wählen')} onPress={()=>setDialog('sites')}><Card><Row style={{marginBottom:4,flexWrap:'nowrap'}}><Icon name="expedition" size={25} color={C.gold}/><Txt style={[styles.heading,{flex:1,marginBottom:0}]}>Beschaffungsort wählen</Txt><Icon name="chevron" size={16}/></Row><Txt muted>Wähle, woher du Materialien beschaffen möchtest.</Txt></Card></Pressable>
  {active.length>0&&<Txt style={styles.heading}>Laufende Beschaffungen</Txt>}
  {active.map((r:any)=><Card key={r.id}>
   <Row><Txt style={styles.heading}>{r.vehicleIds?regionTitle(r.region):r.model}</Txt>{r.vehicleIds?<Pill>{r.vehicles.filter((v:any)=>v.status==='active').length} {r.vehicles.filter((v:any)=>v.status==='active').length===1?'Fahrzeug':'Fahrzeuge'}</Pill>:<Pill>{regionTitle(r.region)}</Pill>}</Row>
   <Txt muted>{r.mode==='count'?translate('{0} / {1} Touren abgeschlossen').replace('{0}',n(r.completed)).replace('{1}',n(r.requested)):translate('Bis Reserve von {0} M').replace('{0}',n(r.reserve))}</Txt>
   {r.mode==='count'&&<><Bar value={r.completed/r.requested*100}/><Txt muted>{translate('Hinterlegt: {0} M').replace('{0}',n(r.escrow))}</Txt></>}
   {(r.vehicles||[r]).filter((v:any)=>v.status==='active').map((v:any)=><View key={v.id} style={{marginTop:10}}>
    {r.vehicleIds&&<Row style={{marginBottom:0}}><Txt style={{fontSize:13,fontWeight:'700',flex:1}}>{v.model}</Txt><Txt gold style={{fontSize:12}}>{remaining(v.nextAt,clock)}</Txt></Row>}
    <Bar value={Math.max(0,Math.min(100,(clock-v.startedAt)/v.durationMs*100))}/>
    {!r.vehicleIds&&<Txt gold>{remaining(v.nextAt,clock)}</Txt>}
   </View>)}
   <Txt muted style={{fontSize:12}}>{translate('{0} M je Tour').replace('{0}',n(r.price))}</Txt>
   {r.stopAfter?<Pill>{r.vehicleIds?'Endet nach laufenden Touren':'Endet nach laufender Tour'}</Pill>:<Btn secondary disabled={busy} onPress={()=>stop(r,false)}>{r.vehicleIds?'Nach laufenden Touren beenden':'Nach laufender Tour beenden'}</Btn>}
   <Btn secondary danger disabled={busy} onPress={()=>stop(r,true)}>Sofort abbrechen</Btn>
  </Card>)}
  <Modal visible={dialog!==null&&!modalBlocked} transparent animationType="none" onRequestClose={()=>dialog==='settings'?setDialog('sites'):close()}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}>{dialog==='settings'&&<Pressable accessibilityRole="button" accessibilityLabel={translate('Zur Ortsauswahl')} onPress={()=>{setSaveFailed(false);setDialog('sites');}} style={styles.back}><Icon name="back" size={21}/></Pressable>}<Txt style={[styles.heading,{flex:1,minWidth:0,marginBottom:0}]}>{dialog==='book'?'Abhol-Buch':dialog==='sites'?'Ort wählen':'Beschaffung planen'}</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    <ScrollView key={dialog} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:4}}>
     {dialog==='book'&&<>
      <Row><Txt muted>Erfolgreiche Abholungen insgesamt</Txt><Txt gold>{n(p.completed)}</Txt></Row>
      {visited.length?visited.map((s:any)=><View key={s.region} style={styles.logRow}><Txt style={{flex:1}}>{regionTitle(s.region)}</Txt><Txt gold>{n(s.completed)}</Txt></View>):<Empty>Noch keine erfolgreichen Abholungen.</Empty>}
     </>}
     {dialog==='sites'&&p.sites.map((s:any)=>{const shown=expanded.includes(s.region);return <Card key={s.region} style={!s.unlocked&&styles.lockedSite}>
      <Pressable accessibilityRole="button" accessibilityLabel={translate('{0} als Beschaffungsort wählen').replace('{0}',translate(regionTitle(s.region)))} accessibilityState={{disabled:busy||!s.unlocked}} disabled={busy||!s.unlocked} onPress={()=>open(s.region)} style={[styles.siteChoice,!s.unlocked&&{minHeight:0}]}>
       <Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={[styles.heading,{flex:1,marginBottom:0},!s.unlocked&&{fontSize:15}]}>{regionTitle(s.region)}</Txt><Icon name={s.unlocked?'chevron':'lock'} size={s.unlocked?18:15} color={s.unlocked?C.gold:C.muted}/></Row>
       <Row style={{marginBottom:0}}><Txt gold style={!s.unlocked&&{fontSize:12}}>{translate('{0} M je Tour').replace('{0}',n(s.price))}</Txt>{!s.unlocked&&<Txt muted style={{fontSize:11}}>Gesperrt</Txt>}</Row>
      </Pressable>
      {!s.unlocked&&<Txt muted style={styles.lockedProgress}>{translate('Orte {0}/7 · Lieferungen {1}/7 · Endloslieferung {2}/1').replace('{0}',String(s.discovered)).replace('{1}',String(s.deliveries)).replace('{2}',String(Number(s.finalClaimed)))}</Txt>}
      <View style={!s.unlocked&&styles.lockedActions}>
       {!s.unlocked&&<Pressable accessibilityRole="button" accessibilityLabel={translate('Zur Expedition')} onPress={()=>{close();onExpedition(s.region);}} style={styles.compactLink}><Txt style={styles.compactText}>Zur Expedition</Txt><Icon name="arrow" size={12} color={C.accent}/></Pressable>}
       <Pressable accessibilityRole="button" accessibilityLabel={translate('Belohnungen in {0}').replace('{0}',translate(regionTitle(s.region)))} accessibilityState={{expanded:shown}} aria-expanded={shown} onPress={()=>setExpanded(ids=>shown?ids.filter(i=>i!==s.region):[...ids,s.region])} style={[styles.disclosure,!s.unlocked&&styles.compactLink]}><Txt style={!s.unlocked&&styles.compactText}>Belohnungen</Txt><Icon name="chevron" size={14} style={{transform:[{rotate:shown?'90deg':'0deg'}]}}/></Pressable>
      </View>
      {shown&&rewardTiles((s.loot||p.loot).filter((item:any)=>item.chance>0&&item.amount>0))}
     </Card>;})}
     {dialog==='settings'&&<>
      <Txt muted>{site&&regionTitle(site.region)}</Txt>
    <View style={styles.grid}>
     {selectedVehicles.map((v:any)=>vehicleTile(v,true))}
     <Pressable accessibilityRole="button" accessibilityLabel={translate('Fahrzeug hinzufügen')} disabled={busy||!available.length} onPress={()=>setPicker(v=>!v)} style={[styles.tile,styles.addTile,(busy||!available.length)&&{opacity:.45}]}><Icon name="plus" size={26} color={C.muted}/></Pressable>
    </View>
    {picker&&<View style={styles.grid}>{available.map((v:any)=>vehicleTile(v,false))}</View>}
    {!freeVehicles.length&&<Txt muted>Kein freies Garagenfahrzeug</Txt>}
    <Row style={{flexWrap:'nowrap'}}><Btn style={{flex:1}} secondary={mode!=='count'} onPress={()=>{setMode('count');setValue('1');}}>Feste Tourenzahl</Btn><Btn style={{flex:1}} secondary={mode!=='reserve'} onPress={()=>{setMode('reserve');setValue('0');}}>Bis Reserve</Btn></Row>
    <Txt>{mode==='count'?'Anzahl Touren':'Kontoreserve in Münzen'}</Txt>
    <View style={styles.amountRow}>
     <TextInput accessibilityLabel={translate(mode==='count'?'Anzahl Touren':'Kontoreserve in Münzen')} keyboardType="number-pad" value={value} onChangeText={setValue} style={[styles.input,{flex:1,minWidth:0}]}/>
     <Btn secondary disabled={busy} style={{marginTop:0,minWidth:96}} onPress={()=>setValue(String(mode==='count'?max:Math.min(1000000000,(Number.isSafeInteger(amount)?amount:0)+10000)))}>{mode==='count'?'Max':'+10.000'}</Btn>
    </View>
    <Txt muted>{translate('Verfügbar: {0} M').replace('{0}',n(g.coins))}</Txt>
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
const styles=StyleSheet.create({lockedSite:{padding:10,marginBottom:8,backgroundColor:C.raised,borderStyle:'dashed'},lockedProgress:{fontSize:10,lineHeight:14,marginTop:5},lockedActions:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:4,borderTopWidth:1,borderTopColor:C.line},compactLink:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:0,borderTopWidth:0},compactText:{fontSize:11,color:C.accent},rewards:{flexDirection:'row',flexWrap:'wrap',gap:12,marginVertical:8},reward:{minWidth:50,maxWidth:92,alignItems:'center',justifyContent:'center',gap:5},rewardAmount:{fontWeight:'700',fontSize:15},itemGrid:{flexDirection:'row',flexWrap:'wrap',gap:6,marginVertical:8},itemCard:{width:'31%',minWidth:0,padding:6,borderWidth:1,borderRadius:10,backgroundColor:C.panel},itemArtwork:{width:'100%',aspectRatio:1,alignItems:'center',justifyContent:'center',backgroundColor:C.raised,borderWidth:1,borderColor:C.line,borderRadius:6},itemName:{color:C.muted,fontSize:10,lineHeight:14,textAlign:'center',minHeight:42,marginTop:6},logRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.line,marginBottom:5},siteChoice:{minHeight:54,justifyContent:'center'},disclosure:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:C.line,marginTop:10},back:{width:32,minHeight:44,alignItems:'center',justifyContent:'center'},heading:{fontSize:17,fontWeight:'700',marginBottom:8},input:{borderWidth:1,borderColor:C.line,borderRadius:5,padding:12,color:C.text,backgroundColor:C.raised,marginVertical:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:16},modal:{width:'100%',maxWidth:480,maxHeight:'88%',alignSelf:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,padding:16},vehicleStat:{fontSize:11,lineHeight:15},amountRow:{flexDirection:'row',alignItems:'center',gap:8},addTile:{borderStyle:'dashed',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'},grid:{flexDirection:'row',flexWrap:'wrap',gap:6,marginVertical:10},tile:{width:'31%',minHeight:100,borderWidth:1,borderColor:C.line,padding:8,borderRadius:5,gap:5}});

