import React from 'react';
import {View,Image,StyleProp,ViewStyle} from 'react-native';
// The 1448 x 1086 source contains 4 x 3 square cells (362 px per cell).
// Keep the original atlas intact; only the assigned cell is visible on screen.
const cells={expeditions:0,cards:1,company:2,hub:3,inventory:4,crafting:5,customers:6,wholesaler:7,statistics:8,account:9,garage:10,fleet:11} as const;
export type LocationName=keyof typeof cells;
export function LocationArt({name,width=104,style}:{name:LocationName;width?:number;style?:StyleProp<ViewStyle>}){
 const index=cells[name],column=index%4,row=Math.floor(index/4);
 return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" style={[{width,height:width,overflow:'hidden',flexShrink:0},style]}>
  <Image accessible={false} source={require('../assets/art/town-atlas.png')} resizeMode="stretch" style={{position:'absolute',width:width*4,height:width*3,left:-column*width,top:-row*width}}/>
 </View>;
}
export function locationForScreen(screen:string):LocationName{return screen in cells?screen as LocationName:'company';}
