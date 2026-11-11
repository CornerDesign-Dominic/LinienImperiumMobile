import React from 'react';
import {StyleProp,TextStyle} from 'react-native';
import {MaterialView as View} from './Material';
import {Text} from './Language';
import {C} from './theme';

export function HomeHubStatus({cycles,textStyle}:{cycles:number;textStyle?:StyleProp<TextStyle>}){
 const full=cycles>=6;
 return <View style={{flexDirection:'row',alignItems:'center',gap:8,flexShrink:0}}>
  <Text numberOfLines={1} style={[textStyle,full&&{color:C.gold}]}>{full?'Voll':`${cycles}/6`}</Text>
  {full&&<View testID="home-hub-full" accessible={false} importantForAccessibility="no-hide-descendants" style={{width:10,height:10,borderRadius:5,backgroundColor:C.uncommon}}/>}
 </View>;
}
