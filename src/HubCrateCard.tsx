import React from 'react';
import {Image,Pressable,StyleSheet,View} from 'react-native';
import {C,Txt} from './ui';

function countdown(until:number,now:number){
 const seconds=Math.max(0,Math.ceil((until-now)/1000));
 return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
}
export function HubCrateCard({crates,busy,opening=false,clock,onOpen}:any){
 const left=Math.max(0,crates.max-crates.opened),disabled=busy||!crates.available;
 const action=opening?'Wird geöffnet …':!left?'Morgen wieder verfügbar':crates.available?'Öffnen':`Öffnen in ${countdown(crates.nextAt,clock)}`;
 return <Pressable testID="hub-crate-card" accessibilityRole="button" accessibilityLabel={`Fundkisten, ${left} Stück, ${action}`} accessibilityState={{disabled,busy:!!busy}} disabled={disabled} onPress={onOpen} style={({pressed})=>[s.card,pressed&&s.pressed]}>
  <Image source={require('../assets/art/hub/crate-scene.jpg')} accessible={false} resizeMode="cover" fadeDuration={0} style={s.image}/>
  {disabled&&<View pointerEvents="none" style={s.dim}/>}
  <View style={s.heading}><Txt style={s.title}>Fundkisten</Txt><Txt style={s.count}>{left} Stück</Txt></View>
  <View style={s.action}><Txt style={s.actionText}>{action}</Txt></View>
 </Pressable>;
}
const s=StyleSheet.create({
 card:{width:'100%',aspectRatio:2,minHeight:142,borderRadius:8,borderWidth:1,borderColor:C.line,overflow:'hidden',backgroundColor:C.ink,marginBottom:12},
 image:{position:'absolute',top:0,left:0,right:0,bottom:0,width:'100%',height:'100%'},
 dim:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(15,24,23,0.32)'},
 heading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8,paddingHorizontal:12,paddingVertical:9,backgroundColor:'rgba(21,33,33,0.64)'},
 title:{color:C.onInk,fontSize:15,lineHeight:21,fontWeight:'700',flexShrink:1},count:{color:C.onInk,fontSize:12,lineHeight:19,fontWeight:'600'},
 action:{marginTop:'auto',minHeight:42,justifyContent:'center',alignItems:'center',paddingVertical:9,paddingHorizontal:10,backgroundColor:'rgba(21,33,33,0.76)'},
 actionText:{color:C.onInk,fontSize:14,lineHeight:21,fontWeight:'700',textAlign:'center'},pressed:{opacity:.85},
});
