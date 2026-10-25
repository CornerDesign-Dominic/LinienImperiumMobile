import React from 'react';
import {View,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {MenuArt} from './MenuArt';
import {C,Txt,Card,Btn,n,remaining} from './ui';
import {hubCycle} from './hubCycle';

export function HubEarnings({hub,cycle,clock,busy,onCollect}:any){
 const state=hubCycle(hub,cycle,clock),full=state?.full??hub.cashboxCycles>=6;
 const max=cycle?.cashboxMax??6;
 return <Card>
  <View style={s.heading}><Txt style={s.title}>Erträge</Txt><Txt muted style={s.small}>{full?'Kasse voll':`${hub.cashboxCycles} / ${max} Std. Kasse`}</Txt></View>
  <View style={s.coins}><Icon name="coin" size={52}/><Txt style={s.amount}>{n(hub.cashboxCoins,2)} M</Txt></View>
  {state&&<View style={s.cycle}>
   <View style={s.goodsRow}><View accessible accessibilityLabel={`Warenrest ${Math.round(state.remaining*100)} %`} style={s.crate}><View style={[s.crateFill,{height:`${state.remaining*100}%`}]}/><Icon name="orders" size={27} color={C.gold}/></View><View style={{flex:1,minWidth:0}}><Txt style={s.status}>{full?'Verteilung pausiert':!state.hasGoods?'Keine Ware im Zyklus':state.waiting?'Warte auf Einkauf':'Verteilung läuft'}</Txt><Txt muted style={s.small}>{full?'Erträge abholen, um fortzufahren':`Einkauf in ${remaining(hub.nextCycleAt,clock)}`}</Txt></View></View>
   {!state.paused&&<View accessible accessibilityLabel={`Einkaufszyklus: ${state.minutes} von ${cycle.durationMs/60000} Minuten. Ware leer nach ${cycle.workMs/60000} Minuten.`}>
    <View style={s.timelineHead}><Txt muted style={s.small}>{state.minutes} Min. im Zyklus</Txt></View>
    <View style={s.markerArea}>
     {state.emptyAt!==null&&<View style={[s.event,{left:`${state.emptyAt*100}%`,transform:[{translateX:-28}]}]}><Icon name="orders" size={18} color={C.gold}/><Txt muted style={s.eventText}>Ware leer</Txt></View>}
     <View style={s.purchase}><MenuArt id="procurement" size={28}/></View>
    </View>
    <View style={s.track}>
     {state.emptyAt!==null&&state.idleMs>0&&<View style={[s.idle,{left:`${state.emptyAt*100}%`,width:`${(1-state.emptyAt)*100}%`}]}/>}
     <View style={[s.progress,{width:`${Math.min(state.progress,state.emptyAt??1)*100}%`}]}/>
     {state.emptyAt!==null&&<View style={[s.eventLine,{left:`${state.emptyAt*100}%`}]}/>}
     <View style={[s.cursor,{left:`${state.progress*100}%`}]}/>
    </View>
    <View style={s.ends}><Txt muted style={s.small}>0</Txt><Txt muted style={s.small}>{cycle.durationMs/60000} Min.</Txt></View>
    {state.idleMs>0&&<Txt muted style={s.idleNote}>{state.idleMs/60000} Min. ohne Ware bis zum Einkauf</Txt>}
   </View>}
  </View>}
  <Btn disabled={busy||!hub.cashboxCoins&&!hub.cashboxHints&&!hub.cashboxParts} onPress={onCollect}>Erträge abholen</Btn>
 </Card>;
}
const s=StyleSheet.create({
 heading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},title:{fontSize:15,fontWeight:'700'},small:{fontSize:10,lineHeight:16},coins:{flexDirection:'row',alignItems:'center',gap:12,marginVertical:10},amount:{fontSize:25,lineHeight:32,fontWeight:'700',flexShrink:1},cycle:{borderTopWidth:1,borderTopColor:C.line,paddingTop:10,marginTop:2},goodsRow:{flexDirection:'row',alignItems:'center',gap:10},crate:{width:38,height:38,borderWidth:1,borderColor:C.line,borderRadius:5,overflow:'hidden',alignItems:'center',justifyContent:'center',backgroundColor:C.panel},crateFill:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.goldWash},status:{fontSize:12,lineHeight:18,fontWeight:'600'},timelineHead:{marginTop:10},markerArea:{height:39,position:'relative',marginRight:5,marginLeft:5},event:{position:'absolute',bottom:0,width:56,alignItems:'center'},eventText:{fontSize:8,lineHeight:12},purchase:{position:'absolute',right:-5,bottom:0},track:{height:7,backgroundColor:C.raised,borderRadius:4,position:'relative',marginHorizontal:5},progress:{position:'absolute',left:0,top:0,bottom:0,backgroundColor:C.accent,borderRadius:4},idle:{position:'absolute',top:0,bottom:0,backgroundColor:C.goldWash,borderTopWidth:2,borderStyle:'dashed',borderColor:C.brass},cursor:{position:'absolute',top:-3,width:13,height:13,borderRadius:7,borderWidth:2,borderColor:C.panel,backgroundColor:C.accent,transform:[{translateX:-6}]},eventLine:{position:'absolute',top:-8,bottom:-5,width:1,backgroundColor:C.brass},ends:{flexDirection:'row',justifyContent:'space-between',marginTop:6},idleNote:{fontSize:10,lineHeight:15,color:C.gold,marginTop:2}
});
