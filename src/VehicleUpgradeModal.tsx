import {transportCardUpgradeApplied} from './transportCardUpgradeApplied';
import {ItemArt} from './ItemArt';
import React,{useRef,useState} from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,Row,Btn,n} from './ui';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {BONUS,bonusValue} from './cardBonus';
import {averageCardSpeed,rankNumeral} from './collectionStats';
import {t} from './i18n';

function Cost({id,label,needed,available}:{id:string;label:string;needed:number;available:number}){
 const enough=available>=needed;
 return <View style={s.cost}><ItemArt id={id} size={40}/><View style={{flex:1}}><Txt muted style={{fontSize:11}}>{label}</Txt><Txt style={{fontSize:12,color:enough?C.accent:C.red}}>{t('Kosten')}: {n(needed)} · {t('Bestand')}: {n(available)}</Txt></View></View>;
}
function Section({title,progress,maximum,children}:any){return <View testID={`upgrade-${title}`} style={s.section}><Row style={{marginBottom:8}}><Txt style={s.title}>{title}</Txt><Txt muted style={{fontSize:11}}>{progress}</Txt></Row>{maximum?<Txt muted>Maximum erreicht</Txt>:children}</View>;}
export function VehicleUpgradeModal({visible,data,id,busy,onClose,onUpgrade,onVehicleUpgrade}:any){
 const [working,setWorking]=useState(''),[message,setMessage]=useState('');
 const pending=useRef(false),snapshot=useRef<any>(null);
 const view=working?snapshot.current||data:data;
 const card=view.catalog.cards.find((entry:any)=>entry.id===id),own=view.state.expedition.characters[id],stats=view.cardVehicles[id];
 if(!card||!own||!stats)return null;
 const level=own.level,modules=stats.capacityLevel||0,maxModules=stats.maxCapacityLevel??card.maxCapacityLevel;
 const shards=view.state.expedition.shards[card.rarity]||0,needed=Math.max(0,Math.ceil((view.catalog.cardLevelCosts[level-1]||0)-(own.progress||0)));
 const rarity=view.catalog.rarities.find((entry:any)=>entry.id===card.rarity)?.label||card.rarity;
 const rank=stats.rank,next=stats.upgradePreview,gear=view.state.inventory.gears[rank.id]||0;
 const nextAverage=next?.rank?averageCardSpeed(next.rank.loadedSpeed,next.rank.speed):undefined;
 const average=averageCardSpeed(stats.loadedSpeed,stats.speed);
 const locked=busy||!!working;
 const eligible:Record<string,boolean>={level:level<10&&needed>0&&shards>=needed,capacity:modules<maxModules&&(view.state.inventory.capacityModules||0)>=1&&next?.capacity!=null,rank:rank.total<50&&gear>=stats.rankCost&&!!next?.rank};
 const change=async(kind:string)=>{
  if(locked||pending.current||!eligible[kind])return;
  snapshot.current=data;pending.current=true;setWorking(kind);setMessage('');
  try{
   const result=await(kind==='level'?onUpgrade(id):onVehicleUpgrade(id,kind));
   const action=kind==='level'?'cardUpgrade':kind==='capacity'?'cardCapacity':'cardRank';
   if(!transportCardUpgradeApplied(action,id,snapshot.current,result))setMessage('Verbesserung nicht bestätigt. Bitte Bestand prüfen und erneut versuchen.');
  }catch{setMessage('Verbesserung fehlgeschlagen. Bitte erneut versuchen.');}
  finally{pending.current=false;setWorking('');}
 };
 const button=(kind:string)=>(eligible[kind]||working===kind)?<Btn style={{minHeight:40,paddingVertical:7,marginTop:7}} disabled={locked} onPress={()=>change(kind)}>{working===kind?'Wird verbessert …':'Verbessern'}</Btn>:null;
 return <ExpeditionPlaceModal visible={visible} title="Verbessern" region={card.name} onClose={()=>{if(!locked&&!pending.current){setMessage('');onClose();}}}>
  {!!message&&<Txt style={[s.message,{color:C.red}]}>{message}</Txt>}
  <Section title="Kartenstufe" progress={`${rankNumeral(level)} / X`} maximum={level>=10}>
   <Txt muted style={{fontSize:10,marginBottom:3}}>{BONUS[card.stat]}</Txt>
   <Txt style={s.effect}>{rankNumeral(level)} → {rankNumeral(level+1)} · {bonusValue(card,card.bonusLevels[level-1],2)} → {bonusValue(card,card.bonusLevels[level],2)}</Txt>
   <Cost id={`shard:${card.rarity}`} label={`${t(rarity)}-${t('Splitter')}`} needed={needed} available={shards}/>
   {own.progress>0&&<Txt muted style={{fontSize:10}}>Bisheriger Fortschritt ist angerechnet.</Txt>}
   {button('level')}
  </Section>
  <Section title="Kapazität" progress={`${modules} / ${maxModules}`} maximum={modules>=maxModules}>
   <Txt style={s.effect}>{n(stats.capacity,2)} t → {next?.capacity!=null?`${n(next.capacity,2)} t`:'—'}</Txt>
   <Cost id="capacityModules" label="Kapazitätsmodule" needed={1} available={view.state.inventory.capacityModules||0}/>
   {button('capacity')}
  </Section>
  <Section title="Geschwindigkeit" progress={`${rank.total} / 50`} maximum={rank.total>=50}>
   <Txt style={s.effect}>{rank.total} → {rank.total+1} · {nextAverage===undefined?'—':`${n(average,2)} → ${n(nextAverage,2)} km/s`}</Txt>
   {next?.rank&&<Txt muted style={{fontSize:10}}>{t('Grundtempo')}: +{n((next.rank.speed/stats.speed-1)*100,2)} %</Txt>}
   <Cost id={`gear:${rank.id}`} label={`${t(rank.label)}-${t('Zahnräder')}`} needed={stats.rankCost} available={gear}/>
   {button('rank')}
  </Section>
 </ExpeditionPlaceModal>;
}
const s=StyleSheet.create({section:{paddingVertical:12,borderTopWidth:1,borderColor:C.line},title:{fontSize:14,fontWeight:'700'},effect:{fontSize:13,fontWeight:'600',color:C.accent,marginBottom:6},cost:{flexDirection:'row',alignItems:'center',gap:7,marginTop:4},message:{fontSize:12,marginBottom:10,padding:8,backgroundColor:C.raised,borderRadius:4}});
