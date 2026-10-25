import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {cardLevelMaterial,rankNumeral} from './collectionStats';
import {t} from './i18n';
import {displayFont} from './theme';

const materials={
 iron:{light:'#929B95',shade:'#626D66',edge:'#536058',text:'#F6F2E5'},
 silver:{light:'#EDF0EB',shade:'#ADB9B8',edge:'#96A5A6',text:'#263B3E'},
 gold:{light:'#F2D47B',shade:'#C29A43',edge:'#AE8839',text:'#4F3911'},
 obsidian:{light:'#38333F',shade:'#16131C',edge:'#514957',text:'#F8EFD9'},
};
export function CardLevelShield({level}:{level?:number}){
 const material=cardLevelMaterial(level),colors=materials[material||'iron'];
 return <View testID={`card-level-${material||'locked'}`} accessible accessibilityLabel={t(material?`Stufe ${level}`:'Nicht entdeckt')} pointerEvents="none" style={s.shield}>
  <View style={[s.rim,{backgroundColor:colors.edge}]}/>
  <View style={[s.tip,{borderTopColor:colors.edge}]}/>
  <View style={[s.face,{backgroundColor:colors.light,backgroundImage:`linear-gradient(135deg, ${colors.light}, ${colors.shade})`}]}/>
  <View style={[s.innerTip,{borderTopColor:colors.shade}]}/>
  <Text accessible={false} allowFontScaling={false} style={[s.numeral,{color:colors.text}]}>{material?rankNumeral(level!):'—'}</Text>
 </View>;
}
const s=StyleSheet.create({
 shield:{position:'absolute',top:-13,alignSelf:'center',width:28,height:27,zIndex:2},
 rim:{position:'absolute',top:0,left:0,width:28,height:21},
 tip:{position:'absolute',top:21,left:0,width:0,height:0,borderLeftWidth:14,borderRightWidth:14,borderTopWidth:6,borderLeftColor:'transparent',borderRightColor:'transparent'},
 face:{position:'absolute',top:.75,left:.75,width:26.5,height:20.25},
 innerTip:{position:'absolute',top:20.7,left:1,width:0,height:0,borderLeftWidth:13,borderRightWidth:13,borderTopWidth:5.5,borderLeftColor:'transparent',borderRightColor:'transparent'},
 numeral:{position:'absolute',top:2,left:0,right:0,textAlign:'center',fontFamily:displayFont,fontSize:14,lineHeight:19,fontWeight:'600'},
});
