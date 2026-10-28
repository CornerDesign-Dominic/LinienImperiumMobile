import React from 'react';
import {Image,StyleSheet,View} from 'react-native';

// One shared default appearance; changing it never changes a courier's values.
const source=require('../assets/art/hub/courier-wombat.jpg');
export function HubCourierArt({size}:{size?:number}){
 return <View style={[s.frame,size?{width:size,height:size}:null]}><Image source={source} accessible={false} accessibilityElementsHidden importantForAccessibility="no" resizeMode="cover" fadeDuration={0} style={s.image}/></View>;
}
const s=StyleSheet.create({frame:{width:'100%',aspectRatio:1,borderRadius:5,overflow:'hidden'},image:{width:'100%',height:'100%'}});
