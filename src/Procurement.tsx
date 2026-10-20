import React,{useState} from 'react';
import {View,TextInput,Modal,ScrollView,Pressable,StyleSheet} from 'react-native';
import {Text} from './Language';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {C,Txt,Card,Row,Btn,Bar,Pill,n,remaining,minutes} from './ui';
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
 const [region,setRegion]=useState<number|null>(null),[truckId,setTruckId]=useState<string|null>(null),[mode,setMode]=useState('count'),[value,setValue]=useState('1'),[picker,setPicker]=useState(false);
 if(!p)return <Card><Txt muted>Beschaffung wird geladen …</Txt></Card>;
 const site=p.sites.find((s:any)=>s.region===region),vehicle=p.vehicles.find((v:any)=>v.id===truckId);
 const amount=/^\d+$/.test(value)?Number(value):NaN;
 const max=site?Math.min(100000,Math.floor(g.coins/site.price)):0;
 const valid=site?.unlocked&&vehicle?.free&&Number.isSafeInteger(amount)&&amount>=0&&(mode==='count'?amount>0&&amount<=max:amount<=1000000000&&g.coins-site.price>=amount);
 const pending=Object.values(p.pending).some((v:any)=>v>0);
 const active=p.runs.filter((r:any)=>r.status==='active');
 const open=(index:number)=>{setRegion(index);setTruckId(null);setValue('1');setMode('count');setPicker(false);};
 const stop=(r:any,immediate:boolean)=>confirm(immediate?'Laufende Tour abbrechen?':'Nach laufender Tour beenden?',immediate?'Der Einsatz der laufenden Tour verfällt. Keine Belohnung. Ungestartete Touren werden erstattet.':'Die laufende Tour liefert ihre Belohnung. Ungestartete Touren werden erstattet.',()=>onCommand('procurementStop',{id:r.id,immediate}));
 return <>
  <Txt muted style={{marginBottom:12}}>Materialien einkaufen und mit Garagenfahrzeugen abholen. Teuer, dauerhaft und auch offline.</Txt>
  <Card><Row><Txt style={styles.heading}>Abholungsbuch</Txt><Pill>{n(p.completed)}</Pill></Row><Txt muted>Erfolgreiche Abholungen insgesamt</Txt></Card>
  <Card><Txt style={styles.heading}>Gesammelte Belohnungen</Txt>{['common','uncommon','rare','companyItems'].map(key=><Row key={key}><Txt>{key==='companyItems'?itemName(key,2):translate(`${key==='common'?'Common':key==='uncommon'?'Uncommon':'Rare'}-Zahnräder`)}</Txt><Txt gold>{n(p.pending[key])}</Txt></Row>)}<Btn disabled={busy||!pending} onPress={()=>onCommand('procurementClaim')}>Alle Belohnungen abholen</Btn></Card>
  {active.length>0&&<Txt style={styles.heading}>Laufende Beschaffungen</Txt>}
  {active.map((r:any)=><Card key={r.id}><Row><Txt style={styles.heading}>{r.model}</Txt><Pill>{translate('Beschaffung {0}').replace('{0}',String(r.region+1))}</Pill></Row><Txt muted>{r.mode==='count'?translate('{0} / {1} Touren abgeschlossen').replace('{0}',n(r.completed)).replace('{1}',n(r.requested)):translate('Bis Reserve von {0} M').replace('{0}',n(r.reserve))}</Txt>{r.mode==='count'&&<Txt muted>{translate('Hinterlegt: {0} M').replace('{0}',n(r.escrow))}</Txt>}<Bar value={Math.max(0,Math.min(100,(clock-r.startedAt)/r.durationMs*100))}/><Row><Txt gold>{remaining(r.nextAt,clock)}</Txt><Txt muted>{translate('{0} M je Tour').replace('{0}',n(r.price))}</Txt></Row>{r.stopAfter?<Pill>Endet nach laufender Tour</Pill>:<Btn secondary disabled={busy} onPress={()=>stop(r,false)}>Nach laufender Tour beenden</Btn>}<Btn secondary danger disabled={busy} onPress={()=>stop(r,true)}>Sofort abbrechen</Btn></Card>)}
  <Txt style={styles.heading}>Beschaffungsstellen</Txt>
  {p.sites.map((s:any)=><Card key={s.region}><Row><Icon name={s.unlocked?'crafting':'lock'} color={C.gold}/><Txt style={[styles.heading,{flex:1}]}>{translate('Beschaffung {0}').replace('{0}',String(s.region+1))}</Txt><Pill>{s.unlocked?'Freigeschaltet':'Gesperrt'}</Pill></Row><Txt muted>{data.catalog.regionNames[s.region]}</Txt><Txt gold>{translate('{0} M je Tour').replace('{0}',n(s.price))}</Txt><Txt muted>{translate('{0} erfolgreiche Abholungen').replace('{0}',n(s.completed))}</Txt>{s.unlocked?<Btn disabled={busy} onPress={()=>open(s.region)}>Fahrzeug einsetzen</Btn>:<><Txt muted>{translate('Orte {0}/7 · Lieferungen {1}/7 · Endloslieferung {2}/1').replace('{0}',String(s.discovered)).replace('{1}',String(s.deliveries)).replace('{2}',String(Number(s.finalClaimed)))}</Txt><Btn secondary onPress={()=>onExpedition(s.region)}>Zur Expedition</Btn></>}</Card>)}
  {p.runs.some((r:any)=>r.status==='finished')&&<><Txt style={styles.heading}>Beendete Beschaffungen</Txt>{p.runs.filter((r:any)=>r.status==='finished').map((r:any)=><Card key={r.id}><Txt>{r.model}</Txt><Txt muted>{translate('{0} erfolgreiche Abholungen').replace('{0}',n(r.completed))}</Txt><Txt muted>{r.reason==='reserve'?'Beendet: Reserve erreicht. Zum Fortsetzen neu starten.':r.reason==='cancelled'?'Sofort abgebrochen':r.reason==='completed'?'Alle Touren abgeschlossen':'Nach laufender Tour beendet'}</Txt></Card>)}</>}
  <Card><Txt style={styles.heading}>Loot je Tour</Txt><Txt muted>5 Common-Zahnräder garantiert. Unabhängig: 20 % auf 1 Uncommon-Zahnrad, 0,3 % auf 1 Rare-Zahnrad, 0,1 % auf 1 Firmenausbau-Item. In allen Regionen gleich.</Txt><Txt muted>Keine Münzen, XP, Kundenpunkte oder zusätzlichen tkm-Belohnungen.</Txt></Card>
  <Modal visible={region!==null&&!modalBlocked} transparent animationType="none" onRequestClose={()=>setRegion(null)}>
   <View style={styles.overlay}><View style={styles.modal}><Row><Txt style={styles.heading}>{translate('Beschaffung {0}').replace('{0}',String((region??0)+1))}</Txt><Btn icon="close" secondary onPress={()=>setRegion(null)}>Schließen</Btn></Row><ScrollView keyboardShouldPersistTaps="handled">
    <Btn secondary onPress={()=>setPicker(v=>!v)}>{vehicle?.model||'Garagenfahrzeug wählen'}</Btn>
    {picker&&<View style={styles.grid}>{p.vehicles.map((v:any)=><Pressable key={v.id} accessibilityRole="button" disabled={busy||!v.free} onPress={()=>{setTruckId(v.id);setPicker(false);}} style={[styles.tile,!v.free&&{opacity:.45},truckId===v.id&&{borderColor:C.accent}]}><Icon name="truck" color={C.gold}/><Text numberOfLines={2} style={{color:C.text,fontSize:12}}>{v.model}</Text><Txt muted>{v.free?'Bereit':'Im Einsatz'}</Txt></Pressable>)}</View>}
    {!p.vehicles.some((v:any)=>v.free)&&<Txt muted>Kein freies Garagenfahrzeug</Txt>}
    <Row><Btn secondary={mode!=='count'} onPress={()=>{setMode('count');setValue('1');}}>Feste Tourenzahl</Btn><Btn secondary={mode!=='reserve'} onPress={()=>{setMode('reserve');setValue('0');}}>Bis Reserve</Btn></Row>
    <Txt>{mode==='count'?'Anzahl Touren':'Kontoreserve in Münzen'}</Txt>
    <TextInput accessibilityLabel={translate(mode==='count'?'Anzahl Touren':'Kontoreserve in Münzen')} keyboardType="number-pad" value={value} onChangeText={setValue} style={styles.input}/>
    <Txt muted>{translate('Verfügbar: {0} M').replace('{0}',n(g.coins))}</Txt>
    {mode==='count'?<><Txt muted>{translate('Aktuell maximal {0} Touren').replace('{0}',n(max))}</Txt><Txt gold>{translate('Gesamtkosten: {0} M').replace('{0}',n(Number.isSafeInteger(amount)?amount*(site?.price||0):0))}</Txt>{vehicle&&<Txt>{translate('Voraussichtliche Dauer: {0}').replace('{0}',minutes(Number.isSafeInteger(amount)?amount*vehicle.durationMs/1000:0))}</Txt>}<Txt muted>Der Gesamtbetrag wird sofort hinterlegt. Ungestartete Touren werden beim Beenden erstattet.</Txt></>:<><Txt muted>Jede Tour wird bei ihrem Start bezahlt. Neue Einnahmen können weitere Touren ermöglichen. Sobald die nächste Tour die Reserve unterschreiten würde, endet der Auftrag ohne automatischen Neustart.</Txt>{vehicle&&<Txt>{translate('Dauer je Tour: {0}').replace('{0}',minutes(vehicle.durationMs/1000))}</Txt>}</>}
    <Txt muted>Flotteneinsätze bleiben parallel erlaubt. Andere Garageneinsätze sind während der Beschaffung gesperrt.</Txt>
    <Btn disabled={busy||!valid} onPress={async()=>{const next=await onCommand('procurementStart',{region,truck:truckId,mode,amount});if(next?.procurement.runs.some((r:any)=>r.status==='active'&&r.truckId===truckId))setRegion(null);}}>Beschaffung starten</Btn>
   </ScrollView></View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({heading:{fontSize:17,fontWeight:'700',marginBottom:8},input:{borderWidth:1,borderColor:C.line,borderRadius:5,padding:12,color:C.text,backgroundColor:C.raised,marginVertical:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:16},modal:{width:'100%',maxWidth:480,maxHeight:'88%',alignSelf:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,padding:16},grid:{flexDirection:'row',flexWrap:'wrap',gap:6,marginVertical:10},tile:{width:'31%',minHeight:100,borderWidth:1,borderColor:C.line,padding:8,borderRadius:5,gap:5}});
