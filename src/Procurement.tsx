import React,{useEffect,useState} from 'react';
import {View,TextInput,Modal,ScrollView,Pressable,StyleSheet} from 'react-native';
import {Text} from './Language';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {C,Txt,Card,Row,Btn,Bar,Pill,n,remaining} from './ui';
import {itemName} from './items';

export function ProcurementNotice({data,onOpen}:any){
 const p=data.procurement;if(!p)return null;
 const active=p.runs.filter((r:any)=>r.status==='active').length;
 const pending=Object.values(p.pending).reduce((sum:number,v:any)=>sum+v,0);
 if(!active&&!pending)return null;
 return <Card><Row><Icon name="crafting" color={C.gold}/><Txt style={{fontWeight:'700',flex:1}}>Materialbeschaffung</Txt></Row><Txt muted>{translate('{0} Fahrzeuge unterwegs').replace('{0}',n(active))}</Txt><Btn secondary onPress={onOpen}>{pending?'Belohnungen abholen':'Beschaffung öffnen'}</Btn></Card>;
}
export function Procurement({data,busy,clock,onCommand,onExpedition,confirm,modalBlocked=false}:any){
 const p=data.procurement,g=data.state;
 const [region,setRegion]=useState<number|null>(null),[truckIds,setTruckIds]=useState<string[]>([]),[mode,setMode]=useState('count'),[value,setValue]=useState('1'),[picker,setPicker]=useState(false);
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
 const pending=Object.values(p.pending).some((v:any)=>v>0);
 const runs=[...(p.groups||[]),...p.runs.filter((r:any)=>!r.groupId)];
 const active=runs.filter((r:any)=>r.status==='active');
 const open=(index:number)=>{setRegion(index);setTruckIds([]);setValue('1');setMode('count');setPicker(false);};
 const vehicleTile=(v:any,selected:boolean)=><Pressable key={v.id} accessibilityRole="button" accessibilityLabel={translate(v.model)+(selected?', '+translate('Entfernen'):'')} disabled={busy} onPress={()=>{if(selected)setTruckIds(ids=>ids.filter(id=>id!==v.id));else{setTruckIds(ids=>ids.includes(v.id)?ids:[...ids,v.id]);setPicker(false);}}} style={[styles.tile,selected&&{borderColor:C.accent,backgroundColor:C.greenWash}]}>
  <Icon name="truck" color={C.gold}/>{selected&&<Icon name="close" size={12} color={C.muted} style={{position:'absolute',top:5,right:5}}/>}<Text numberOfLines={2} style={{color:C.text,fontSize:12}}>{v.model}</Text><Txt style={styles.vehicleStat}>{n(v.capacity,1)} t</Txt><Txt muted style={styles.vehicleStat}>{n(v.speed,2)} km/s</Txt>
 </Pressable>;
 const stop=(r:any,immediate:boolean)=>confirm(
  immediate?(r.vehicleIds?'Laufende Touren abbrechen?':'Laufende Tour abbrechen?'):(r.vehicleIds?'Nach laufenden Touren beenden?':'Nach laufender Tour beenden?'),
  immediate?(r.vehicleIds?'Die laufenden Touren verfallen. Ungestartete Touren werden erstattet.':'Der Einsatz der laufenden Tour verfällt. Keine Belohnung. Ungestartete Touren werden erstattet.'):(r.vehicleIds?'Alle laufenden Touren enden mit ihrer Belohnung. Ungestartete Touren werden erstattet.':'Die laufende Tour liefert ihre Belohnung. Ungestartete Touren werden erstattet.'),
  ()=>onCommand(r.vehicleIds?'procurementGroupStop':'procurementStop',{id:r.id,immediate}));

 return <>
  <Card><Row><Txt style={styles.heading}>Abholungsbuch</Txt><Pill>{n(p.completed)}</Pill></Row><Txt muted>Erfolgreiche Abholungen insgesamt</Txt></Card>
  <Card><Txt style={styles.heading}>Gesammelte Belohnungen</Txt>{['common','uncommon','rare','companyItems'].map(key=><Row key={key}><Txt>{key==='companyItems'?itemName(key,2):translate(`${key==='common'?'Common':key==='uncommon'?'Uncommon':'Rare'}-Zahnräder`)}</Txt><Txt gold>{n(p.pending[key])}</Txt></Row>)}<Btn disabled={busy||!pending} onPress={()=>onCommand('procurementClaim')}>Alle Belohnungen abholen</Btn></Card>
  {active.length>0&&<Txt style={styles.heading}>Laufende Beschaffungen</Txt>}
  {active.map((r:any)=><Card key={r.id}>
   <Row><Txt style={styles.heading}>{r.vehicleIds?translate('Beschaffung {0}').replace('{0}',String(r.region+1)):r.model}</Txt>{r.vehicleIds?<Pill>{r.vehicles.filter((v:any)=>v.status==='active').length} {r.vehicles.filter((v:any)=>v.status==='active').length===1?'Fahrzeug':'Fahrzeuge'}</Pill>:<Pill>{translate('Beschaffung {0}').replace('{0}',String(r.region+1))}</Pill>}</Row>
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
  <Txt style={styles.heading}>Beschaffungsstellen</Txt>
  {p.sites.map((s:any)=><Card key={s.region}><Row><Icon name={s.unlocked?'crafting':'lock'} color={C.gold}/><Txt style={[styles.heading,{flex:1}]}>{translate('Beschaffung {0}').replace('{0}',String(s.region+1))}</Txt><Pill>{s.unlocked?'Freigeschaltet':'Gesperrt'}</Pill></Row><Txt muted>{data.catalog.regionNames[s.region]}</Txt><Txt gold>{translate('{0} M je Tour').replace('{0}',n(s.price))}</Txt><Txt muted>{translate('{0} erfolgreiche Abholungen').replace('{0}',n(s.completed))}</Txt>{s.unlocked?<Btn disabled={busy} onPress={()=>open(s.region)}>Fahrzeug einsetzen</Btn>:<><Txt muted>{translate('Orte {0}/7 · Lieferungen {1}/7 · Endloslieferung {2}/1').replace('{0}',String(s.discovered)).replace('{1}',String(s.deliveries)).replace('{2}',String(Number(s.finalClaimed)))}</Txt><Btn secondary onPress={()=>onExpedition(s.region)}>Zur Expedition</Btn></>}</Card>)}
  {runs.some((r:any)=>r.status==='finished')&&<><Txt style={styles.heading}>Beendete Beschaffungen</Txt>{runs.filter((r:any)=>r.status==='finished').map((r:any)=><Card key={r.id}><Txt>{r.vehicleIds?translate('Beschaffung {0}').replace('{0}',String(r.region+1)):r.model}</Txt><Txt muted>{translate('{0} erfolgreiche Abholungen').replace('{0}',n(r.completed))}</Txt><Txt muted>{r.reason==='reserve'?'Beendet: Reserve erreicht. Zum Fortsetzen neu starten.':r.reason==='cancelled'?'Sofort abgebrochen':r.reason==='completed'?'Alle Touren abgeschlossen':'Nach laufender Tour beendet'}</Txt></Card>)}</>}
  <Card><Txt style={styles.heading}>Loot je Tour</Txt><Txt muted>5 Common-Zahnräder garantiert. Unabhängig: 20 % auf 1 Uncommon-Zahnrad, 0,3 % auf 1 Rare-Zahnrad, 0,1 % auf 1 Firmenausbau-Item. In allen Regionen gleich.</Txt><Txt muted>Keine Münzen, XP, Kundenpunkte oder zusätzlichen tkm-Belohnungen.</Txt></Card>
  <Card><Txt style={styles.heading}>Hinweise</Txt>
   <Txt muted>Materialien einkaufen und mit Garagenfahrzeugen abholen. Teuer, dauerhaft und auch offline.</Txt>
   <Txt muted style={styles.note}>Alle gewählten Fahrzeuge teilen sich die Tourenzahl oder Reserve. Das nächste freie Fahrzeug übernimmt die nächste Tour. Ohne weitere Tour wird es automatisch frei.</Txt>
   <Txt style={styles.note}>Feste Tourenzahl</Txt><Txt muted>Der Gesamtbetrag wird sofort hinterlegt. Ungestartete Touren werden beim Beenden erstattet.</Txt>
   <Txt style={styles.note}>Bis Reserve</Txt><Txt muted>Jede Tour wird bei ihrem Start bezahlt. Reicht der gemeinsame Vorrat bis zur Reserve nicht für die nächste Tour, scheidet das Fahrzeug aus. Es startet später nicht automatisch neu.</Txt>
   <Txt muted style={styles.note}>Flotteneinsätze bleiben parallel erlaubt. Andere Garageneinsätze sind während der Beschaffung gesperrt.</Txt>
  </Card>
  <Modal visible={region!==null&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setRegion(null)}>
   <View style={styles.overlay}><View style={styles.modal}><Row><Txt style={styles.heading}>{translate('Beschaffung {0}').replace('{0}',String((region??0)+1))}</Txt><Btn icon="close" secondary onPress={()=>setRegion(null)}>Schließen</Btn></Row><ScrollView keyboardShouldPersistTaps="handled">
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
     const trucks=selectedVehicles.map((v:any)=>v.id);
     const next=await onCommand('procurementGroupStart',{region,trucks,mode,amount});
     if(next?.procurement.groups.some((r:any)=>r.region===region&&trucks.every((id:string)=>r.vehicleIds.includes(id))))setRegion(null);
    }}>Beschaffung starten</Btn>
   </ScrollView></View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({heading:{fontSize:17,fontWeight:'700',marginBottom:8},input:{borderWidth:1,borderColor:C.line,borderRadius:5,padding:12,color:C.text,backgroundColor:C.raised,marginVertical:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:16},modal:{width:'100%',maxWidth:480,maxHeight:'88%',alignSelf:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,padding:16},vehicleStat:{fontSize:11,lineHeight:15},note:{marginTop:10},amountRow:{flexDirection:'row',alignItems:'center',gap:8},addTile:{borderStyle:'dashed',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'},grid:{flexDirection:'row',flexWrap:'wrap',gap:6,marginVertical:10},tile:{width:'31%',minHeight:100,borderWidth:1,borderColor:C.line,padding:8,borderRadius:5,gap:5}});
