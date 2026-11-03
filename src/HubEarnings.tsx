import React from 'react';
import {Image,Pressable,Text,View,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {MenuArt} from './MenuArt';
import {C,Txt,n} from './ui';
import {hubCycle} from './hubCycle';

export function HubEarnings({hub,cycle,clock,busy,onCollect}:any){
 const state=hubCycle(hub,cycle,clock),full=state?.full??hub.cashboxCycles>=6;
 const max=cycle?.cashboxMax??6,disabled=!!busy||!hub.cashboxCoins&&!hub.cashboxHints&&!hub.cashboxParts;
 const active=!!state&&!state.paused;
 const status=full?'Verteilung pausiert':!state?.hasGoods?'Keine Ware im Zyklus':state.waiting?'Warte auf Einkauf':'Verteilung läuft';
 return <View testID="hub-earnings-yard" style={s.card}>
  <Image source={require('../assets/art/hub/earnings-yard.jpg')} accessible={false} resizeMode="cover" fadeDuration={0} style={s.image}/>
  <View style={s.heading}><Txt style={s.title}>Erträge</Txt><Txt style={s.cashboxText}>{full?'Kasse voll':`${hub.cashboxCycles} / ${max} Std.`}</Txt></View>
  <View style={s.amountRow}><Icon name="coin" size={32}/><Text testID="hub-earnings-amount" adjustsFontSizeToFit minimumFontScale={.6} numberOfLines={1} style={s.amount}>{n(hub.cashboxCoins)}</Text></View>
  <View style={s.scenery}/>
  <View style={s.cycle}>
   <View style={s.statusArea}><Txt style={s.status}>{status}</Txt>{full&&<Txt style={s.small}>Erträge abholen, um fortzufahren</Txt>}</View>
   <View testID="hub-earnings-timeline" style={s.timeline} accessible accessibilityLabel={active?`Einkaufszyklus: ${state.minutes} von ${cycle.durationMs/60000} Minuten. Ware leer nach ${cycle.workMs/60000} Minuten.`:status}>
    <View style={[s.markerArea,!active&&s.hidden]}>
     {active&&state.emptyAt!==null&&<View style={[s.event,{left:`${state.emptyAt*100}%`,transform:[{translateX:state.emptyAt>.85?-104:-52}]}]}><Image source={require('../assets/art/hub/parcel.png')} accessible={false} resizeMode="contain" fadeDuration={0} style={s.parcel}/><Txt style={s.eventText}>Ware leer · {n(cycle.workMs/60000,1)} Min.</Txt></View>}
     {active&&<View style={s.purchase}><MenuArt id="procurement" size={28}/></View>}
    </View>
    <View style={[s.track,!active&&s.dimTrack]}>
     {active&&<><View style={[s.progress,{width:`${Math.min(state.progress,state.emptyAt??1)*100}%`}]}/>
      {state.emptyAt!==null&&<View style={[s.eventLine,{left:`${state.emptyAt*100}%`}]}/>}
      <View style={[s.cursor,{left:`${state.progress*100}%`}]}/></>}
    </View>
    <View style={[s.ends,!active&&s.dimTrack]}><Txt style={s.small}>0</Txt><Txt style={s.small}>{(cycle?.durationMs??3600000)/60000} Min.</Txt></View>
   </View>
  </View>
  <Pressable testID="hub-earnings-collect" accessibilityRole="button" accessibilityLabel="Erträge abholen" accessibilityState={{disabled,busy:!!busy}} disabled={disabled} onPress={onCollect} style={({pressed})=>[s.action,pressed&&!disabled&&s.pressed]}><Txt style={[s.actionText,disabled&&s.disabledText]}>{busy?'Wird abgeholt …':'Erträge abholen'}</Txt></Pressable>
 </View>;
}
const s=StyleSheet.create({
 card:{height:308,width:'100%',borderWidth:1,borderColor:C.line,borderRadius:8,overflow:'hidden',backgroundColor:C.ink,marginBottom:10},
 image:{position:'absolute',top:0,bottom:0,left:0,right:0,width:'100%',height:'100%'},
 heading:{height:36,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8,paddingHorizontal:12,backgroundColor:'rgba(21,33,33,0.72)'},
 title:{fontSize:14,lineHeight:20,fontWeight:'700',color:C.onInk},cashboxText:{fontSize:11,lineHeight:16,color:C.onInk,flexShrink:1},
 amountRow:{height:52,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingHorizontal:12,backgroundColor:'rgba(21,33,33,0.45)'},amount:{fontSize:27,lineHeight:34,fontWeight:'700',color:C.onInk,flexShrink:1,minWidth:0,textAlign:'center'},
 scenery:{flex:1,backgroundColor:'rgba(21,33,33,0.08)'},
 cycle:{height:124,paddingHorizontal:14,paddingTop:6,backgroundColor:'rgba(21,33,33,0.84)'},
 statusArea:{height:32,alignItems:'center',justifyContent:'center'},status:{fontSize:13,lineHeight:19,fontWeight:'600',color:C.onInk,textAlign:'center'},small:{fontSize:10,lineHeight:16,color:C.onInk},
 timeline:{height:80},markerArea:{height:44,position:'relative',marginHorizontal:5},event:{position:'absolute',bottom:4,width:104,alignItems:'center'},parcel:{width:24,height:24},eventText:{fontSize:8,lineHeight:12,color:C.onInk},purchase:{position:'absolute',right:-5,bottom:0},
 track:{height:6,backgroundColor:'rgba(240,229,201,0.25)',borderRadius:4,position:'relative',marginHorizontal:5},progress:{position:'absolute',left:0,top:0,bottom:0,backgroundColor:'#DEC58B',borderRadius:4},cursor:{position:'absolute',top:-3,width:12,height:12,borderRadius:6,borderWidth:2,borderColor:C.onInk,backgroundColor:C.brass,transform:[{translateX:-6}]},eventLine:{position:'absolute',top:-7,bottom:-5,width:1,backgroundColor:'#DEC58B'},
 ends:{flexDirection:'row',justifyContent:'space-between',marginTop:6},hidden:{opacity:0},dimTrack:{opacity:.35},
 action:{height:46,justifyContent:'center',alignItems:'center',paddingHorizontal:10,backgroundColor:'rgba(21,33,33,0.9)',borderTopWidth:1,borderTopColor:C.brass},actionText:{color:C.onInk,fontSize:14,lineHeight:21,fontWeight:'700',textAlign:'center'},disabledText:{opacity:.45},pressed:{opacity:.8},
});

