import React,{useState} from 'react';
import {View,StyleSheet} from 'react-native';

/** One solid triangle per wing: a continuous taper, never stacked line segments. */
export function CardSeparator({color}:{color:string}){
 const [width,setWidth]=useState(0),wing=Math.max(0,(width-14)/2);
 return <View testID="card-separator" pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" onLayout={({nativeEvent:{layout}})=>setWidth(previous=>previous===layout.width?previous:layout.width)} style={s.separator}>
  <View testID="card-separator-left" style={[s.wing,s.left,{borderRightWidth:wing,borderRightColor:color}]}/>
  <View testID="card-separator-diamond" style={[s.diamond,{backgroundColor:color}]}/>
  <View testID="card-separator-right" style={[s.wing,s.right,{borderLeftWidth:wing,borderLeftColor:color}]}/>
 </View>;
}
const s=StyleSheet.create({
 separator:{alignSelf:'stretch',height:5,marginHorizontal:7,marginTop:5,marginBottom:0,position:'relative'},
 wing:{position:'absolute',top:1.75,width:0,height:0,borderWidth:0,borderStyle:'solid',borderColor:'transparent',borderTopWidth:.75,borderBottomWidth:.75,backgroundColor:'transparent'},
 left:{left:0},right:{right:0},
 diamond:{position:'absolute',top:.5,left:'50%',marginLeft:-2,width:4,height:4,transform:[{rotate:'45deg'}]},
});
