import React,{useState} from 'react';
import {Pressable,StyleSheet} from 'react-native';
import {MaterialView as View} from './Material';
import {Icon} from './Icon';
import {ItemArt} from './ItemArt';
import {itemName} from './items';
import {t,getLocale} from './i18n';
import {C,Txt,Card,Row,Btn,Bar,n,remaining} from './ui';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {seasonRewards,seasonRewardStatus} from './seasonRewards';
import type {SeasonReward,SeasonProgress} from './seasonRewards';

export type SeasonTask={id:string;title:string;target:number;progress:number;points:number;rewards:SeasonReward[];claimed:boolean;complete:boolean};
export type SeasonPass=SeasonProgress&{id:string;price:number;status:'inactive'|'active'|'ended';startsAt:number;endsAt:number;points:number;pointsPerLevel:number;dailyVersion:number;nextDailyAt?:number;dailies:SeasonTask[];monthlies:SeasonTask[];rewards?:typeof seasonRewards;infinity:{earned:number;claimed:number;available:number;reward:SeasonReward}};
const statusLabels={premiumLocked:'Premium gesperrt',locked:'Gesperrt',claimed:'Abgeholt',reached:'Erreicht'};
function rewardName(reward:SeasonReward){
 if(reward.id==='coins')return 'Imperium-Taler';
 if(reward.id==='hermes')return 'Hermes-Siegel';
 if(reward.id==='specialOrders')return 'Sonderaufträge';
 if(reward.id.startsWith('gear:'))return `${({common:'Common',uncommon:'Uncommon',rare:'Rare',epic:'Epic',legendary:'Legendary'} as Record<string,string>)[reward.id.slice(5)]}-Zahnräder`;
 return itemName(reward.id,reward.amount);
}
function RewardArt({reward,size=34}:{reward:SeasonReward;size?:number}){
 return reward.id==='coins'||reward.id==='hermes'?<Icon name={reward.id==='coins'?'coin':'hermes'} size={size}/>:<ItemArt id={reward.id==='specialOrders'?'project:special':reward.id} size={size} framed={false}/>;
}
function SeasonRewardTile({reward,level,track,progress,busy,claimable,onClaim}:{reward:SeasonReward;level:number;track:'free'|'premium';progress:SeasonProgress;busy:boolean;claimable:boolean;onClaim:()=>void}){
 const status=seasonRewardStatus(level,track,progress),claimed=status==='claimed',reached=status==='reached',premium=track==='premium';
 const label=statusLabels[status],name=rewardName(reward);
 return <View accessible accessibilityLabel={`${t(premium?'Premium':'Free')} · ${t(`Stufe ${level}`)} · ${n(reward.amount)} ${t(name)} · ${t(label)}`} testID={`season-${track}-${level}`} style={[s.reward,premium&&s.premiumReward,reached&&s.reachedReward,claimed&&s.claimedReward]}>
  <View material={false} style={s.artRow}><RewardArt reward={reward}/><Txt literal style={s.amount}>{n(reward.amount)}</Txt></View>
  <Txt style={s.rewardName}>{name}</Txt>
  {reached?<Btn disabled={busy||!claimable} style={s.claimButton} onPress={onClaim}>Abholen</Btn>:<View material={false} style={s.status}><Icon name={claimed?'check':'lock'} size={11} color={premium?C.gold:C.muted}/><Txt muted style={s.statusText}>{label}</Txt></View>}
 </View>;
}
export function Season({pass,seals=0,busy=false,clock=Date.now(),onCommand}:{pass?:SeasonPass;seals?:number;busy?:boolean;clock?:number;onCommand:(action:string,payload:Record<string,unknown>)=>Promise<any>}){
 const [tab,setTab]=useState<'rewards'|'daily'|'monthly'>('rewards');
 const [confirm,setConfirm]=useState(false);
 if(!pass)return <Card><Txt muted>Season wird geladen …</Txt></Card>;
 const active=pass.status==='active'&&clock<pass.endsAt;
 const canBuy=active&&!pass.premium&&seals>=pass.price;
 const claim=(action:string,payload:Record<string,unknown>={})=>onCommand(action,{...payload,seasonId:pass.id});
 const catalogue=pass.rewards||seasonRewards;
 const available=catalogue.some(entry=>entry.level<=pass.level&&(!pass.freeClaimed.includes(entry.level)||(pass.premium&&!pass.premiumClaimed.includes(entry.level))))||(pass.infinity?.available||0)>0||[...pass.dailies,...pass.monthlies].some(task=>task.complete&&!task.claimed);
 const endsIn=Math.max(0,pass.endsAt-clock),days=Math.floor(endsIn/86400000);
 const endDate=pass.endsAt?new Intl.DateTimeFormat(getLocale(),{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(pass.endsAt):'';
 return <View style={s.page}>
  <Card style={s.intro}>
   <Row><Txt style={s.title}>Monatsseason</Txt><Txt gold>{pass.status==='inactive'?'Noch nicht gestartet':active?'Läuft':'Beendet'}</Txt></Row>
   {pass.status!=='inactive'?<><Txt literal style={s.introText}>{t('Ende')}: {endDate} · {t('Berliner Zeit')}</Txt><Txt literal gold style={s.countdown}>{days>0?`${n(days)} ${t('Tage')} · `:''}{remaining(pass.endsAt,clock+days*86400000)}</Txt></>:<Txt muted style={s.introText}>Starte die Season unter Testwerkzeug.</Txt>}
   <Row><Txt literal>{t('Stufe')} {n(pass.level)} / 30</Txt><Txt literal>{n(pass.points)} {t('Saisonpunkte')}</Txt></Row>
   <Bar value={pass.level>=30?100:(pass.points%pass.pointsPerLevel)/pass.pointsPerLevel*100}/>
   <Txt muted style={s.note}>{pass.level>=30?'Weitere Saisonpunkte bringen Unendlichkeitsbelohnungen.':`${n(pass.pointsPerLevel)} Saisonpunkte je Stufe`}</Txt>
  </Card>
  <View material={false} accessibilityRole="tablist" style={s.tabs}>{([{id:'rewards',label:'Belohnung'},{id:'daily',label:'Täglich'},{id:'monthly',label:'Monatsaufgaben'}] as const).map(item=><Pressable key={item.id} testID={`season-tab-${item.id}`} accessibilityRole="tab" accessibilityLabel={t(item.label)} accessibilityState={{selected:tab===item.id}} aria-selected={tab===item.id} onPress={()=>setTab(item.id)} style={[s.tab,tab===item.id&&s.activeTab]}><Txt style={[s.tabText,tab===item.id&&{color:C.onInk}]}>{item.label}</Txt></Pressable>)}</View>
  {tab==='rewards'?<>
   <Card>
    <Row><Txt style={s.title}>Premium-Seasonpass</Txt><View material={false} style={s.artRow}><Icon name="hermes" size={24}/><Txt literal gold>{n(pass.price)}</Txt></View></Row>
    <Txt literal muted>{t('Dein Guthaben')}: {n(seals)} {t('Hermes-Siegel')}</Txt>
    {pass.premium?<Txt gold style={s.introText}>Premium freigeschaltet</Txt>:<><Txt muted style={s.introText}>Bereits erreichte Premiumbelohnungen können nach dem Kauf abgeholt werden.</Txt><Btn disabled={busy||!canBuy} onPress={()=>setConfirm(true)}>{`Für ${n(pass.price)} Hermes-Siegel freischalten`}</Btn>{active&&seals<pass.price&&<Txt muted style={s.note}>Nicht genügend Hermes-Siegel.</Txt>}</>}
   </Card>
   <Btn disabled={busy||!active||!available} onPress={()=>claim('seasonClaimAll')}>Alles abholen</Btn>
   <Txt muted style={s.note}>Sammelt alle verfügbaren Aufgaben-, Weg- und Unendlichkeitsbelohnungen.</Txt>
   <View material={false} style={s.trackHead}><Txt style={[s.trackTitle,s.freeTitle]}>Free</Txt><View material={false} style={s.axisWidth}/><Txt gold style={s.trackTitle}>Premium</Txt></View>
   {catalogue.map(entry=><View key={entry.level} material={false} testID={`season-level-${entry.level}`} style={s.levelRow}>
    <SeasonRewardTile reward={entry.free} level={entry.level} track="free" progress={pass} busy={busy} claimable={active} onClaim={()=>claim('seasonClaim',{level:entry.level,track:'free'})}/>
    <View material={false} style={s.axis}>{entry.level>1&&<View material={false} style={[s.line,s.lineTop]}/>}{entry.level<30&&<View material={false} style={[s.line,s.lineBottom]}/>}<View material={false} style={[s.node,entry.level<=pass.level&&s.reachedNode]}><Txt literal style={[s.number,entry.level<=pass.level&&{color:C.onInk}]}>{entry.level}</Txt></View></View>
    <SeasonRewardTile reward={entry.premium} level={entry.level} track="premium" progress={pass} busy={busy} claimable={active} onClaim={()=>claim('seasonClaim',{level:entry.level,track:'premium'})}/>
   </View>)}
   <Card><Txt style={s.title}>∞ Unendlichkeitsbelohnung</Txt><Txt muted style={s.introText}>{`Je ${n(pass.pointsPerLevel)} weitere Saisonpunkte nach Stufe 30: 1 Sonderauftrag.`}</Txt><View material={false} style={s.lootRow}><ItemArt id="project:special" size={44}/><Txt literal>{n(pass.infinity?.available||0)} {t('abholbar')}</Txt></View><Btn disabled={busy||!active||!pass.infinity?.available} onPress={()=>claim('seasonInfinityClaim')}>Sonderaufträge abholen</Btn></Card>
  </>:<>
   <Card><Txt style={s.title}>{tab==='daily'?'Tägliche Aufgaben':'Große Monatsaufgaben'}</Txt><Txt muted style={s.introText}>{tab==='daily'?'Jede tägliche Aufgabe bringt 100 Saisonpunkte. Neue Aufgaben gibt es täglich.':'Diese Aufgaben gelten für die gesamte Season und bringen Saisonpunkte und zusätzliche Beute.'}</Txt><Txt muted style={s.note}>Je verbrauchtem Expeditionspunkt oder Überstundenpunkt erhältst du zusätzlich 1 Saisonpunkt.</Txt>{tab==='daily'&&pass.nextDailyAt&&<Txt literal gold style={s.note}>{t('Neue Dailys in')}: {remaining(pass.nextDailyAt,clock)}</Txt>}</Card>
   {(tab==='daily'?pass.dailies:pass.monthlies).map(task=><Card key={task.id}>
    <Txt style={s.title}>{task.title}</Txt><Row style={{marginTop:8}}><Txt literal>{n(Math.min(task.progress,task.target))} / {n(task.target)}</Txt><Txt literal gold>+{n(task.points)} {t('Saisonpunkte')}</Txt></Row><Bar value={task.progress/task.target*100}/>
    {!!task.rewards?.length&&<View material={false} style={s.lootRow}>{task.rewards.map(reward=><View key={reward.id} material={false} style={s.loot}><RewardArt reward={reward} size={28}/><Txt literal style={s.note}>{n(reward.amount)} {t(rewardName(reward))}</Txt></View>)}</View>}
    <Btn secondary={!task.complete} disabled={busy||!active||!task.complete||task.claimed} onPress={()=>claim('seasonTaskClaim',{id:task.id,dailyVersion:pass.dailyVersion})}>{task.claimed?'Abgeholt':'Belohnung abholen'}</Btn>
   </Card>)}
  </>}
  <ExpeditionPlaceModal visible={confirm&&!pass.premium} title={t('Premium freischalten')} onClose={()=>{if(!busy)setConfirm(false);}}>
   <Txt>Premium-Seasonpass für diese Season freischalten?</Txt><Txt literal style={s.introText}>{n(pass.price)} {t('Hermes-Siegel werden einmalig abgezogen.')}</Txt><Txt muted style={s.note}>Bereits erreichte Premiumbelohnungen können nach dem Kauf abgeholt werden.</Txt><Row><Btn secondary disabled={busy} onPress={()=>setConfirm(false)}>Abbrechen</Btn><Btn disabled={busy||!canBuy} onPress={async()=>{if(await onCommand('seasonPassBuy',{id:pass.id}))setConfirm(false);}}>Kaufen</Btn></Row>
  </ExpeditionPlaceModal>
 </View>;
}
export function SeasonHelp(){return <><Card><Txt style={s.title}>Deine Monatsseason</Txt><Txt muted style={s.helpText}>30 Stufen mit kostenlosen und Premiumbelohnungen. Dailys bringen je 100 Saisonpunkte. Verbrauchte Expeditions- und Überstundenpunkte bringen je 1 Saisonpunkt. Monatsaufgaben geben zusätzliche Beute.</Txt></Card><Card><Txt style={s.title}>Premium und Belohnungen</Txt><Txt muted style={s.helpText}>Premium kostet 1.000 Hermes-Siegel für diese Season. Bereits erreichte Premiumbelohnungen bleiben nachträglich abholbar. Nach Stufe 30 gibt es wiederholt Sonderaufträge.</Txt></Card></>;}
const s=StyleSheet.create({
 page:{paddingBottom:12},intro:{paddingHorizontal:12,paddingVertical:12},title:{fontSize:16,fontWeight:'700',lineHeight:22},introText:{fontSize:12,lineHeight:18,marginTop:6},note:{fontSize:11,lineHeight:16,marginTop:5},countdown:{fontSize:20,lineHeight:28,fontWeight:'700',marginVertical:8,fontVariant:['tabular-nums']},
 tabs:{flexDirection:'row',gap:5,marginBottom:12},tab:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',paddingHorizontal:3,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:5},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabText:{fontSize:12,fontWeight:'700',textAlign:'center'},
 trackHead:{flexDirection:'row',alignItems:'center',marginTop:12},trackTitle:{flex:1,minWidth:0,textAlign:'center',fontWeight:'700',fontSize:15},freeTitle:{color:C.accent},axisWidth:{width:36},
 levelRow:{flexDirection:'row',alignItems:'stretch'},reward:{flex:1,minWidth:0,minHeight:110,marginVertical:6,borderRadius:6,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:7,paddingVertical:8,justifyContent:'center'},premiumReward:{backgroundColor:C.goldWash,borderColor:C.brass},reachedReward:{borderColor:C.accent},claimedReward:{backgroundColor:C.greenWash},artRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},amount:{fontSize:16,fontWeight:'700'},rewardName:{fontSize:11,lineHeight:15,textAlign:'center',marginTop:4},status:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:3,marginTop:6},statusText:{fontSize:10,lineHeight:14,textAlign:'center'},claimButton:{paddingHorizontal:5,paddingVertical:6},
 axis:{width:36,alignItems:'center',justifyContent:'center'},line:{position:'absolute',width:2,backgroundColor:C.brass},lineTop:{top:0,bottom:'50%'},lineBottom:{top:'50%',bottom:0},node:{width:28,height:28,borderRadius:14,borderWidth:1.5,borderColor:C.brass,backgroundColor:C.raised,alignItems:'center',justifyContent:'center'},reachedNode:{backgroundColor:C.accent,borderColor:C.accent},number:{fontSize:13,fontWeight:'700'},helpText:{fontSize:13,lineHeight:20,marginTop:8},lootRow:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:10,marginTop:8},loot:{flexDirection:'row',alignItems:'center',gap:5,flexShrink:1}
});
