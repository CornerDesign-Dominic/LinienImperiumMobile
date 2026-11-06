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
export type SeasonPass=SeasonProgress&{id:string;price:number;status:'inactive'|'active'|'ended';startsAt:number;endsAt:number;points:number;pointsPerLevel:number;dailyVersion:number;nextDailyAt?:number;dailies:SeasonTask[];monthlies:SeasonTask[];rewards?:typeof seasonRewards;infinity:{earned:number;claimed:number;available:number;pointsPerReward?:number;progress?:number;eligible?:boolean;reward:SeasonReward}};
const statusLabels={premiumLocked:'Premium gesperrt',locked:'Gesperrt',claimed:'Abgeholt',reached:'Abholbereit'};
function rewardName(reward:SeasonReward){
 if(reward.id==='coins')return 'Imperium-Taler';
 if(reward.id==='hermes')return 'Hermes-Siegel';
 if(reward.id==='specialOrders')return 'Sonderaufträge';
 if(reward.id==='customerOrders')return 'Kundenaufträge';
 if(reward.id.startsWith('gear:'))return `${({common:'Common',uncommon:'Uncommon',rare:'Rare',epic:'Epic',legendary:'Legendary'} as Record<string,string>)[reward.id.slice(5)]}-Zahnräder`;
 return itemName(reward.id,reward.amount);
}
function RewardArt({reward,size=34}:{reward:SeasonReward;size?:number}){
 return reward.id==='coins'||reward.id==='hermes'?<Icon name={reward.id==='coins'?'coin':'hermes'} size={size}/>:<ItemArt id={reward.id==='specialOrders'?'project:special':reward.id==='customerOrders'?'order:customer':reward.id} size={size} framed={false}/>;
}
function SeasonRewardTile({reward,level,track,progress,busy,claimable,onClaim,onLocked}:{reward:SeasonReward;level:number;track:'free'|'premium';progress:SeasonProgress;busy:boolean;claimable:boolean;onClaim:()=>void;onLocked?:()=>void}){
 const status=seasonRewardStatus(level,track,progress),claimed=status==='claimed',reached=status==='reached',premium=track==='premium';
 const label=statusLabels[status],name=rewardName(reward);
 const Host=status==='premiumLocked'?Pressable:View;
 return <Host onPress={status==='premiumLocked'?onLocked:undefined} accessibilityRole={status==='premiumLocked'?'button':undefined} accessible accessibilityLabel={`${t(premium?'Premium':'Free')} · ${t(`Stufe ${level}`)} · ${n(reward.amount)} ${t(name)} · ${t(label)}`} testID={`season-${track}-${level}`} style={[s.reward,premium&&s.premiumReward,!reached&&!claimed&&s.upcomingReward,reached&&s.reachedReward,claimed&&s.claimedReward]}>
  <View material={false} style={s.artRow}><RewardArt reward={reward}/><Txt literal style={s.amount}>{n(reward.amount)}</Txt></View>
  {reached?<><View material={false} style={s.status}><Icon name="check" size={11} color={C.accent}/><Txt style={s.readyText}>Abholbereit</Txt></View><Btn disabled={busy||!claimable} style={s.claimButton} onPress={onClaim}>Abholen</Btn></>:<View material={false} style={s.status}><Icon name={claimed?'check':'lock'} size={11} color={premium?C.gold:C.muted}/><Txt muted style={s.statusText}>{label}</Txt></View>}
 </Host>;
}
export function Season({pass,busy=false,clock=Date.now(),onCommand,onOpenShop}:{pass?:SeasonPass;busy?:boolean;clock?:number;onCommand:(action:string,payload:Record<string,unknown>)=>Promise<any>;onOpenShop:()=>void}){
 const [tab,setTab]=useState<'rewards'|'daily'|'monthly'>('rewards');
 const [locked,setLocked]=useState(false);
 const tabs=<View material={false} accessibilityRole="tablist" style={s.tabs}>{([{id:'rewards',label:'Belohnung'},{id:'daily',label:'Täglich'},{id:'monthly',label:'Monatsaufgaben'}] as const).map(item=><Pressable key={item.id} testID={`season-tab-${item.id}`} accessibilityRole="tab" accessibilityLabel={t(item.label)} accessibilityState={{selected:tab===item.id}} aria-selected={tab===item.id} onPress={()=>setTab(item.id)} style={[s.tab,tab===item.id&&s.activeTab]}><Txt style={[s.tabText,tab===item.id&&{color:C.onInk}]}>{item.label}</Txt></Pressable>)}</View>;
 if(!pass)return <View style={s.page}>{tabs}<Card><Txt muted>Season wird geladen …</Txt></Card></View>;
 const active=pass.status==='active'&&clock<pass.endsAt;
 const claim=(action:string,payload:Record<string,unknown>={})=>onCommand(action,{...payload,seasonId:pass.id});
 const catalogue=pass.rewards||seasonRewards;
 const available=catalogue.some(entry=>entry.level<=pass.level&&(!pass.freeClaimed.includes(entry.level)||(pass.premium&&!pass.premiumClaimed.includes(entry.level))))||((pass.infinity?.available||0)>0&&pass.infinity?.eligible!==false)||[...pass.dailies,...pass.monthlies].some(task=>task.complete&&!task.claimed);
 const infinityInterval=pass.infinity?.pointsPerReward||500,infinityProgress=pass.infinity?.progress??Math.max(0,pass.points-30*pass.pointsPerLevel)%infinityInterval;
 const endsIn=Math.max(0,pass.endsAt-clock),days=Math.floor(endsIn/86400000);
 const endDate=pass.endsAt?new Intl.DateTimeFormat(getLocale(),{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(pass.endsAt):'';
 return <View style={s.page}>
  {tabs}
  <Card style={s.intro}>
   <Row><Txt style={s.title}>Monatsseason</Txt><Txt gold>{pass.status==='inactive'?'Noch nicht gestartet':active?'Läuft':'Beendet'}</Txt></Row>
   {pass.status!=='inactive'?<><Txt literal style={s.introText}>{t('Ende')}: {endDate} · {t('Berliner Zeit')}</Txt><Txt literal gold style={s.countdown}>{days>0?`${n(days)} ${t('Tage')} · `:''}{remaining(pass.endsAt,clock+days*86400000)}</Txt></>:<Txt muted style={s.introText}>Starte die Season unter Testwerkzeug.</Txt>}
   <Row><Txt literal>{n(pass.pointsPerLevel)} {t('Punkte pro Stufe')}</Txt><Txt literal>{n(pass.points)} {t('Saisonpunkte')}</Txt></Row>
   <Bar value={pass.level>=30?100:(pass.points%pass.pointsPerLevel)/pass.pointsPerLevel*100}/>
  </Card>

  {tab==='rewards'?<>
   <Btn disabled={busy||!active||!available} onPress={()=>claim('seasonClaimAll')}>Alles abholen</Btn>
   <View material={false} style={s.trackHead}><Txt style={[s.trackTitle,s.freeTitle]}>Free</Txt><View material={false} style={s.axisWidth}/><Txt gold style={s.trackTitle}>Premium</Txt></View>
   {catalogue.map(entry=>{const fullyClaimed=pass.freeClaimed.includes(entry.level)&&(!pass.premium||pass.premiumClaimed.includes(entry.level));return <View key={entry.level} material={false} testID={`season-level-${entry.level}`} style={s.levelRow}>
    <SeasonRewardTile reward={entry.free} level={entry.level} track="free" progress={pass} busy={busy} claimable={active} onClaim={()=>claim('seasonClaim',{level:entry.level,track:'free'})}/>
    <View material={false} style={s.axis}>{entry.level>1&&<View material={false} style={[s.line,s.lineTop]}/>}{entry.level<30&&<View material={false} style={[s.line,s.lineBottom]}/>}<View material={false} testID={`season-node-${entry.level}`} accessibilityLabel={`${t(`Stufe ${entry.level}`)} · ${t(fullyClaimed?'Abgeholt':entry.level<=pass.level?'Erreicht':'Gesperrt')}`} style={[s.node,entry.level<=pass.level&&s.reachedNode,fullyClaimed&&s.claimedNode,entry.level===pass.level&&s.currentNode]}><Txt literal style={[s.number,entry.level<=pass.level&&{color:C.onInk},fullyClaimed&&{color:C.accent}]}>{entry.level}</Txt></View></View>
    <SeasonRewardTile reward={entry.premium} level={entry.level} track="premium" onLocked={()=>setLocked(true)} progress={pass} busy={busy} claimable={active} onClaim={()=>claim('seasonClaim',{level:entry.level,track:'premium'})}/>
   </View>;})}
   <Card testID="season-infinity"><Txt style={s.title}>∞ Unendlichkeitsbelohnung</Txt><View material={false} style={s.infinityHero}><ItemArt id="order:customer" size={64}/><View style={{flex:1}}><Txt style={s.title}>Kundenauftrag</Txt><Txt literal muted style={s.introText}>{t('Alle')} {n(infinityInterval)} {t('Punkte nach Stufe 30')}</Txt><Txt literal gold style={s.readyText}>{n(pass.infinity?.available||0)} {t('abholbar')}</Txt></View></View><Row style={{marginTop:12}}><Txt muted style={s.note}>Nächster Kundenauftrag</Txt><Txt literal>{n(infinityProgress)} / {n(infinityInterval)}</Txt></Row><Bar value={infinityProgress/infinityInterval*100}/>{pass.infinity?.eligible===false&&<Txt muted style={s.note}>Schalte einen Stammkunden frei. Deine Belohnungen bleiben gespeichert.</Txt>}<Btn disabled={busy||!active||!pass.infinity?.available||pass.infinity?.eligible===false} onPress={()=>claim('seasonInfinityClaim')}>Kundenaufträge abholen</Btn></Card>
  </>:<>
   <Card><Txt style={s.title}>{tab==='daily'?'Tägliche Aufgaben':'Große Monatsaufgaben'}</Txt><Txt muted style={s.introText}>{tab==='daily'?'Jede tägliche Aufgabe bringt 100 Saisonpunkte. Neue Aufgaben gibt es täglich.':'Diese Aufgaben gelten für die gesamte Season und bringen Saisonpunkte und zusätzliche Beute.'}</Txt><Txt muted style={s.note}>Je verbrauchtem Expeditionspunkt oder Überstundenpunkt erhältst du zusätzlich 1 Saisonpunkt.</Txt>{tab==='daily'&&pass.nextDailyAt&&<Txt literal gold style={s.note}>{t('Neue Dailys in')}: {remaining(pass.nextDailyAt,clock)}</Txt>}</Card>
   {(tab==='daily'?pass.dailies:pass.monthlies).map(task=><Card key={task.id}>
    <Txt style={s.title}>{task.title}</Txt><Row style={{marginTop:8}}><Txt literal>{n(Math.min(task.progress,task.target))} / {n(task.target)}</Txt><Txt literal gold>+{n(task.points)} {t('Saisonpunkte')}</Txt></Row><Bar value={task.progress/task.target*100}/>
    {!!task.rewards?.length&&<View material={false} style={s.lootRow}>{task.rewards.map(reward=><View key={reward.id} material={false} style={s.loot}><RewardArt reward={reward} size={28}/><Txt literal style={s.note}>{n(reward.amount)} {t(rewardName(reward))}</Txt></View>)}</View>}
    <Btn secondary={!task.complete} disabled={busy||!active||!task.complete||task.claimed} onPress={()=>claim('seasonTaskClaim',{id:task.id,dailyVersion:pass.dailyVersion})}>{task.claimed?'Abgeholt':'Belohnung abholen'}</Btn>
   </Card>)}
  </>}
  <ExpeditionPlaceModal visible={locked&&!pass.premium} title={t('Gesperrt')} onClose={()=>setLocked(false)}>
   <Txt style={s.title}>Beim Händler freischalten</Txt><Txt muted style={s.introText}>Den Premium-Weg dieser Season kannst du beim Großhändler freischalten.</Txt><Txt muted style={s.note}>Bereits erreichte Premiumbelohnungen können nach dem Kauf abgeholt werden.</Txt><Btn onPress={()=>{setLocked(false);onOpenShop();}}>Zum Großhändler</Btn>
  </ExpeditionPlaceModal>
 </View>;
}
export function SeasonHelp(){return <><Card><Txt style={s.title}>Deine Monatsseason</Txt><Txt muted style={s.helpText}>30 Stufen mit kostenlosen und Premiumbelohnungen. Dailys bringen je 100 Saisonpunkte. Verbrauchte Expeditions- und Überstundenpunkte bringen je 1 Saisonpunkt. Monatsaufgaben geben zusätzliche Beute.</Txt></Card><Card><Txt style={s.title}>Premium und Belohnungen</Txt><Txt muted style={s.helpText}>Premium wird beim Großhändler für 1.000 Hermes-Siegel für diese Season freigeschaltet. Bereits erreichte Premiumbelohnungen bleiben nachträglich abholbar. Nach Stufe 30 gibt es alle 500 weiteren Saisonpunkte einen normalen Kundenauftrag.</Txt></Card></>;}
const s=StyleSheet.create({
 page:{paddingBottom:12},intro:{paddingHorizontal:12,paddingVertical:12},title:{fontSize:16,fontWeight:'700',lineHeight:22},introText:{fontSize:12,lineHeight:18,marginTop:6},note:{fontSize:11,lineHeight:16,marginTop:5},countdown:{fontSize:20,lineHeight:28,fontWeight:'700',marginVertical:8,fontVariant:['tabular-nums']},
 tabs:{flexDirection:'row',gap:5,marginBottom:12},tab:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',paddingHorizontal:3,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:5},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabText:{fontSize:12,fontWeight:'700',textAlign:'center'},
 trackHead:{flexDirection:'row',alignItems:'center',marginTop:12},trackTitle:{flex:1,minWidth:0,textAlign:'center',fontWeight:'700',fontSize:15},freeTitle:{color:C.accent},axisWidth:{width:36},
 levelRow:{flexDirection:'row',alignItems:'stretch'},reward:{flex:1,minWidth:0,minHeight:110,marginVertical:6,borderRadius:6,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:7,paddingVertical:8,justifyContent:'center'},premiumReward:{backgroundColor:C.goldWash,borderColor:C.brass},upcomingReward:{backgroundColor:C.raised},reachedReward:{borderColor:C.accent,borderWidth:2,backgroundColor:C.greenWash},claimedReward:{backgroundColor:C.greenWash},artRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},amount:{fontSize:16,fontWeight:'700'},readyText:{fontSize:11,lineHeight:16,fontWeight:'700',color:C.accent},infinityHero:{flexDirection:'row',alignItems:'center',gap:12,marginTop:10},status:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:3,marginTop:6},statusText:{fontSize:10,lineHeight:14,textAlign:'center'},claimButton:{paddingHorizontal:5,paddingVertical:6},
 axis:{width:36,alignItems:'center',justifyContent:'center'},line:{position:'absolute',width:2,backgroundColor:C.brass},lineTop:{top:0,bottom:'50%'},lineBottom:{top:'50%',bottom:0},node:{width:28,height:28,borderRadius:14,borderWidth:1.5,borderColor:C.brass,backgroundColor:C.raised,alignItems:'center',justifyContent:'center'},reachedNode:{backgroundColor:C.accent,borderColor:C.accent},claimedNode:{backgroundColor:C.greenWash,borderColor:C.accent},currentNode:{borderColor:C.gold,borderWidth:3},number:{fontSize:13,fontWeight:'700'},helpText:{fontSize:13,lineHeight:20,marginTop:8},lootRow:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:10,marginTop:8},loot:{flexDirection:'row',alignItems:'center',gap:5,flexShrink:1}
});
