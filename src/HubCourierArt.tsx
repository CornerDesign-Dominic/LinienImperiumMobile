import React from 'react';
import {Image,ImageSourcePropType,StyleSheet,View} from 'react-native';

// Static requires ensure every approved cosmetic ships in native and OTA bundles.
const sources:Record<string,ImageSourcePropType>={
 'wombat-standard':require('../assets/art/hub/courier-wombat.jpg'),
 'wombat-forest':require('../assets/art/hub/skins/wombat-forest.jpg'),
 'wombat-stone':require('../assets/art/hub/skins/wombat-stone.jpg'),
 'wombat-post':require('../assets/art/hub/skins/wombat-post.jpg'),
 'wombat-crown':require('../assets/art/hub/skins/wombat-crown.jpg'),
 'wombat-coast':require('../assets/art/hub/skins/wombat-coast.jpg')
};
export function HubCourierArt({size,flush=false,skin='wombat-standard'}:{size?:number;flush?:boolean;skin?:string}){
 const source=sources[skin]||sources['wombat-standard'];
 return <View style={[s.frame,flush&&{borderRadius:0},size?{width:size,height:size}:null]}><Image source={source} accessible={false} accessibilityElementsHidden importantForAccessibility="no" resizeMode="cover" fadeDuration={0} style={s.image}/></View>;
}
const s=StyleSheet.create({frame:{width:'100%',aspectRatio:1,borderRadius:5,overflow:'hidden'},image:{width:'100%',height:'100%'}});
