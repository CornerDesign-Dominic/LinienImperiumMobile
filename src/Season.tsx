import React,{useState} from 'react';
import {StyleSheet} from 'react-native';
import {MaterialView as View} from './Material';
import {Icon} from './Icon';
import {ItemArt} from './ItemArt';
import {itemName} from './items';
import {t} from './i18n';
import {C,Txt,Card,Row,Btn,n} from './ui';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {seasonRewards,seasonPreview,seasonRewardStatus} from './seasonRewards';
import type {SeasonReward,SeasonProgress} from './seasonRewards';

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

type SeasonPass=SeasonProgress&{id:string;price:number;temporaryPrice:number;placeholder:boolean};
/** Placeholder purchase only: progression and reward claims remain a preview. */
export function Season({pass,coins=0,busy=false,onCommand}:{pass?:SeasonPass;coins?:number;busy?:boolean;onCommand:(action:string,payload:Record<string,unknown>)=>Promise<any>}){
 const [confirm,setConfirm]=useState(false);
 const progress=pass||seasonPreview;
 const canBuy=!!pass&&!pass.premium&&coins>=pass.temporaryPrice;

 return <View style={s.page}>
  <Card style={s.intro}><View material={false} style={s.introRow}><Txt style={s.title}>30 Stufen</Txt><Txt gold style={s.preview}>Vorschau</Txt></View><Txt muted style={s.introText}>Entdecke die Belohnungen auf dem Free- und Premium-Weg.</Txt><Txt muted style={s.note}>Belohnungen sind vorläufig. Die Season ist noch nicht gestartet.</Txt></Card>
  <View material={false} style={s.trackHead}><Txt style={[s.trackTitle,s.freeTitle]}>Free</Txt><View material={false} style={s.axisWidth}/><Txt gold style={s.trackTitle}>Premium</Txt></View>
  <Card>
   <Row><Txt style={s.title}>Premium-Seasonpass</Txt><View material={false} style={{flexDirection:'row',alignItems:'center',gap:5}}><Icon name="hermes" size={24}/><Txt gold>{n(pass?.price??500)}</Txt></View></Row>
   {pass?.premium?<Txt gold style={s.introText}>Premium freigeschaltet</Txt>:<>
    <Txt muted style={s.introText}>Preis: 500 Hermes-Siegel</Txt>
    <Txt muted style={s.note}>Platzhalter: vorübergehend für 1.000 Imperium-Taler erhältlich. Es werden keine Hermes-Siegel abgezogen.</Txt>
    <Btn disabled={busy||!canBuy} onPress={()=>setConfirm(true)}>Für 1.000 Imperium-Taler freischalten</Btn>
    {!!pass&&!canBuy&&<Txt muted style={s.note}>Nicht genügend Imperium-Taler.</Txt>}
    {!pass&&<Txt muted style={s.note}>Seasonpass wird geladen …</Txt>}
   </>}
   <Txt muted style={s.note}>Die Season ist eine Vorschau. Fortschritt und Belohnungsabholung sind noch nicht verfügbar.</Txt>
  </Card>
  <ExpeditionPlaceModal visible={confirm&&!pass?.premium} title={t('Premium freischalten')} onClose={()=>{if(!busy)setConfirm(false);}}>
   <Txt>Premium-Seasonpass für diese Season freischalten?</Txt>
   <Txt muted style={s.introText}>Angezeigter Preis: 500 Hermes-Siegel. Für diesen Platzhalter werden einmalig 1.000 Imperium-Taler abgezogen.</Txt>
   <Txt muted style={s.note}>Fortschritt und Belohnungsabholung sind noch nicht verfügbar.</Txt>
   <Row><Btn secondary disabled={busy} style={{flex:1}} onPress={()=>setConfirm(false)}>Abbrechen</Btn><Btn disabled={busy||!canBuy} style={{flex:1}} onPress={async()=>{if(pass&&await onCommand('seasonPassBuy',{id:pass.id}))setConfirm(false);}}>Für 1.000 Taler kaufen</Btn></Row>
  </ExpeditionPlaceModal>
  {seasonRewards.map(entry=><View key={entry.level} material={false} testID={`season-level-${entry.level}`} style={s.levelRow}>
   <SeasonRewardTile reward={entry.free} level={entry.level} track="free" progress={progress}/>
   <View material={false} style={s.axis}>
    {entry.level>1&&<View material={false} style={[s.line,s.lineTop]}/>}{entry.level<30&&<View material={false} style={[s.line,s.lineBottom]}/>}
    <View material={false} accessible accessibilityLabel={t(`Stufe ${entry.level}`)} style={[s.node,entry.level<=progress.level&&s.reachedNode]}><Txt literal style={[s.number,entry.level<=progress.level&&{color:C.onInk}]}>{entry.level}</Txt></View>
   </View>
   <SeasonRewardTile reward={entry.premium} level={entry.level} track="premium" progress={progress}/>
  </View>)}
 </View>;
}
export function SeasonHelp(){
 return <><Card><Txt style={s.title}>Free und Premium</Txt><Txt muted style={s.helpText}>Die Season führt von Stufe 1 oben bis Stufe 30 unten. Links stehen die kostenlosen Belohnungen, rechts die Premium-Belohnungen.</Txt></Card><Card><Txt style={s.title}>Vorschau</Txt><Txt muted style={s.helpText}>Die Season ist eine Vorschau. Premium kann testweise für 1.000 Imperium-Taler statt 500 Hermes-Siegel freigeschaltet werden. Fortschritt und Belohnungsabholung sind noch nicht verfügbar.</Txt></Card></>;
}
const s=StyleSheet.create({
 page:{paddingBottom:12},intro:{paddingHorizontal:12,paddingVertical:12},introRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},title:{fontSize:16,fontWeight:'700'},preview:{fontSize:11,fontWeight:'700'},introText:{fontSize:12,lineHeight:18,marginTop:6},note:{fontSize:11,lineHeight:16,marginTop:5},
 trackHead:{flexDirection:'row',alignItems:'center',marginTop:4},trackTitle:{flex:1,minWidth:0,textAlign:'center',fontWeight:'700',fontSize:15},freeTitle:{color:C.accent},axisWidth:{width:42},premiumNote:{textAlign:'right',fontSize:10,lineHeight:15,marginTop:2,marginBottom:6},
 levelRow:{flexDirection:'row',alignItems:'stretch'},reward:{flex:1,minWidth:0,minHeight:110,marginVertical:6,borderRadius:6,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingHorizontal:7,paddingVertical:8,justifyContent:'center'},premiumReward:{backgroundColor:C.goldWash,borderColor:C.brass},reachedReward:{borderColor:C.accent},claimedReward:{backgroundColor:C.greenWash},artRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},amount:{fontSize:16,fontWeight:'700',flexShrink:1},rewardName:{fontSize:11,lineHeight:15,textAlign:'center',marginTop:4},status:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:3,marginTop:6,flexWrap:'wrap'},statusText:{fontSize:10,lineHeight:14,textAlign:'center',flexShrink:1},
 axis:{width:42,alignItems:'center',justifyContent:'center'},line:{position:'absolute',width:2,backgroundColor:C.brass},lineTop:{top:0,bottom:'50%'},lineBottom:{top:'50%',bottom:0},node:{width:30,height:30,borderRadius:15,borderWidth:1.5,borderColor:C.brass,backgroundColor:C.raised,alignItems:'center',justifyContent:'center'},reachedNode:{backgroundColor:C.accent,borderColor:C.accent},number:{fontSize:13,fontWeight:'700'},helpText:{fontSize:13,lineHeight:20,marginTop:8}
});
