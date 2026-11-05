import React,{useState} from 'react';
import {Pressable,StyleSheet} from 'react-native';
import {MaterialView as View} from './Material';
import {Icon} from './Icon';
import {ItemArt} from './ItemArt';
import {itemName} from './items';
import {t} from './i18n';
import {C,Txt,Card,n} from './ui';
import {seasonRewards,seasonPreview,seasonRewardStatus} from './seasonRewards';
import type {SeasonReward,SeasonProgress} from './seasonRewards';

const seasonTaskIdeas={
 daily:['Logge dich ein','Schließe 15 Einzelaufträge ab','Sammle die Belohnung von 1 Großauftrag ein','Führe 2 Beschaffungstouren durch','Nutze 100 Überstunden','Nutze 100 Expeditionspunkte','Sammle eine verlorene Zustellung ein','Schließe 5 Nahverkehrsaufträge ab','Schließe 5 Fernverkehrsaufträge ab','Bediene 2 unterschiedliche Stammkunden','Verdiene insgesamt X Taler'],
 weekly:['Schließe 150 Einzelaufträge ab','Sammle die Belohnungen von 5 Großaufträgen ein','Sammle 10 verlorene Zustellungen ein','Schließe 40 Nahverkehrsaufträge ab','Schließe 40 Fernverkehrsaufträge ab','Bediene 5 unterschiedliche Stammkunden','Führe 20 Beschaffungstouren durch']
};

const statusLabels={premiumLocked:'Premium gesperrt',locked:'Gesperrt',claimed:'Abgeholt',reached:'Erreicht'};
function rewardName(reward:SeasonReward){
 if(reward.id==='coins')return 'Imperium-Taler';
 if(reward.id.startsWith('gear:'))return `${({common:'Common',uncommon:'Uncommon',rare:'Rare'} as Record<string,string>)[reward.id.slice(5)]}-Zahnräder`;
 return itemName(reward.id,reward.amount);
}
function SeasonRewardTile({reward,level,track,progress}:{reward:SeasonReward;level:number;track:'free'|'premium';progress:SeasonProgress}){
 const status=seasonRewardStatus(level,track,progress),claimed=status==='claimed',reached=status==='reached',premium=track==='premium';
 const label=statusLabels[status],name=rewardName(reward);
 return <View accessible accessibilityLabel={`${t(premium?'Premium':'Free')} · ${t(`Stufe ${level}`)} · ${n(reward.amount)} ${t(name)} · ${t(label)}`} testID={`season-${track}-${level}`} style={[s.reward,premium&&s.premiumReward,reached&&s.reachedReward,claimed&&s.claimedReward]}>
  <View material={false} style={s.artRow}>{reward.id==='coins'?<Icon name="coin" size={34}/>:<ItemArt id={reward.id} size={34} framed={false}/>}<Txt literal style={s.amount}>{n(reward.amount)}</Txt></View>
  <Txt style={s.rewardName}>{name}</Txt>
  <View material={false} style={s.status}><Icon name={claimed?'check':reached?'reward':'lock'} size={11} color={reached?C.accent:premium?C.gold:C.muted}/><Txt muted style={[s.statusText,premium&&{color:C.gold}]}>{label}</Txt></View>
 </View>;
}

/** The first season is an honest preview: no client progression or claim command. */
export function Season({progress=seasonPreview}:{progress?:SeasonProgress}){
 const [tab,setTab]=useState<'rewards'|'daily'|'weekly'>('rewards');
 return <View style={s.page}>
  <View material={false} accessibilityRole="tablist" style={s.tabs}>{([{id:'rewards',label:'Belohnung'},{id:'daily',label:'Täglich'},{id:'weekly',label:'Wöchentl.'}] as const).map(item=><Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={t(item.label)} accessibilityState={{selected:tab===item.id}} aria-selected={tab===item.id} onPress={()=>setTab(item.id)} style={[s.tab,tab===item.id&&s.activeTab]}><Txt style={[s.tabText,tab===item.id&&{color:C.onInk}]}>{item.label}</Txt></Pressable>)}</View>
  {tab!=='rewards'?<>
   <Card><Txt style={s.title}>Aufgabenideen</Txt><Txt muted style={s.helpText}>Vorläufige Sammlung. Diese Aufgaben sind noch nicht aktiv und können sich ändern. Fortschritt und Belohnungen sind noch nicht festgelegt.</Txt></Card>
   {seasonTaskIdeas[tab].map((idea,index)=><Card key={idea} testID={`season-${tab}-idea-${index}`}><Txt style={s.taskTitle}>{idea}</Txt></Card>)}
  </>:<>
  <Card style={s.intro}><View material={false} style={s.introRow}><Txt style={s.title}>30 Stufen</Txt><Txt gold style={s.preview}>Vorschau</Txt></View><Txt muted style={s.introText}>Entdecke die Belohnungen auf dem Free- und Premium-Weg.</Txt><Txt muted style={s.note}>Belohnungen sind vorläufig. Die Season ist noch nicht gestartet.</Txt></Card>
  <View material={false} style={s.trackHead}><Txt style={[s.trackTitle,s.freeTitle]}>Free</Txt><View material={false} style={s.axisWidth}/><Txt gold style={s.trackTitle}>Premium</Txt></View>
  <Txt muted style={s.premiumNote}>Premium noch nicht verfügbar</Txt>
  {seasonRewards.map(entry=><View key={entry.level} material={false} testID={`season-level-${entry.level}`} style={s.levelRow}>
   <SeasonRewardTile reward={entry.free} level={entry.level} track="free" progress={progress}/>
   <View material={false} style={s.axis}>
    {entry.level>1&&<View material={false} style={[s.line,s.lineTop]}/>}{entry.level<30&&<View material={false} style={[s.line,s.lineBottom]}/>}
    <View material={false} accessible accessibilityLabel={t(`Stufe ${entry.level}`)} style={[s.node,entry.level<=progress.level&&s.reachedNode]}><Txt literal style={[s.number,entry.level<=progress.level&&{color:C.onInk}]}>{entry.level}</Txt></View>
   </View>
   <SeasonRewardTile reward={entry.premium} level={entry.level} track="premium" progress={progress}/>
  </View>)}
  </>}
 </View>;
}
export function SeasonHelp(){
 return <><Card><Txt style={s.title}>Free und Premium</Txt><Txt muted style={s.helpText}>Die Season führt von Stufe 1 oben bis Stufe 30 unten. Links stehen die kostenlosen Belohnungen, rechts die Premium-Belohnungen.</Txt></Card><Card><Txt style={s.title}>Vorschau</Txt><Txt muted style={s.helpText}>Die Belohnungen sind eine erste Vorschau. Die Season ist noch nicht gestartet; Premium ist noch nicht verfügbar.</Txt></Card></>;
}
const s=StyleSheet.create({
 tabs:{flexDirection:'row',gap:6,marginBottom:14},tab:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:5},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabText:{fontSize:13,fontWeight:'700'},taskTitle:{fontSize:15,fontWeight:'700',lineHeight:22},
 page:{paddingBottom:12},intro:{paddingHorizontal:12,paddingVertical:12},introRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},title:{fontSize:16,fontWeight:'700'},preview:{fontSize:11,fontWeight:'700'},introText:{fontSize:12,lineHeight:18,marginTop:6},note:{fontSize:11,lineHeight:16,marginTop:5},
 trackHead:{flexDirection:'row',alignItems:'center',marginTop:4},trackTitle:{flex:1,minWidth:0,textAlign:'center',fontWeight:'700',fontSize:15},freeTitle:{color:C.accent},axisWidth:{width:42},premiumNote:{textAlign:'right',fontSize:10,lineHeight:15,marginTop:2,marginBottom:6},
 levelRow:{flexDirection:'row',alignItems:'stretch'},reward:{flex:1,minWidth:0,minHeight:110,marginVertical:6,borderRadius:6,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:7,paddingVertical:8,justifyContent:'center'},premiumReward:{backgroundColor:C.goldWash,borderColor:C.brass},reachedReward:{borderColor:C.accent},claimedReward:{backgroundColor:C.greenWash},artRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},amount:{fontSize:16,fontWeight:'700',flexShrink:1},rewardName:{fontSize:11,lineHeight:15,textAlign:'center',marginTop:4},status:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:3,marginTop:6,flexWrap:'wrap'},statusText:{fontSize:10,lineHeight:14,textAlign:'center',flexShrink:1},
 axis:{width:42,alignItems:'center',justifyContent:'center'},line:{position:'absolute',width:2,backgroundColor:C.brass},lineTop:{top:0,bottom:'50%'},lineBottom:{top:'50%',bottom:0},node:{width:30,height:30,borderRadius:15,borderWidth:1.5,borderColor:C.brass,backgroundColor:C.raised,alignItems:'center',justifyContent:'center'},reachedNode:{backgroundColor:C.accent,borderColor:C.accent},number:{fontSize:13,fontWeight:'700'},helpText:{fontSize:13,lineHeight:20,marginTop:8}
});
