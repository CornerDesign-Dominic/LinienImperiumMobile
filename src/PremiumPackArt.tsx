import React from 'react';
import {Image,View} from 'react-native';

const sources:Record<number,any>={
 250:require('../assets/art/currency/hermes-siegel.png'),
 500:require('../assets/art/currency/packs/stack.png'),
 1000:require('../assets/art/currency/packs/stacks.png'),
 2000:require('../assets/art/currency/packs/pouch.png'),
 3000:require('../assets/art/currency/packs/large-pouch.png'),
 5000:require('../assets/art/currency/packs/chest.png'),
};
/** Explicit bounds prevent native image dimensions from overflowing shop cards. */
export function PremiumPackArt({amount,size=88}:{amount:number;size?:number}){
 return <View style={{width:size,height:size,flexShrink:0}}><Image source={sources[amount]||sources[250]} accessible={false} accessibilityElementsHidden importantForAccessibility="no" resizeMode="contain" fadeDuration={0} style={{width:size,height:size}}/></View>;
}
