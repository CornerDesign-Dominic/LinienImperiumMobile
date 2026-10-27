import React from 'react';
import {Image} from 'react-native';

const sources={
 earnings:require('../assets/art/hub/earnings.png'),
 crates:require('../assets/art/hub/crates.png'),
 sales:require('../assets/art/hub/sales.png'),
 vehicles:require('../assets/art/hub/vehicles.png'),
};

/** Decorative section art; the adjacent heading supplies its accessible name. */
export function HubArt({id,size=40}:{id:keyof typeof sources;size?:number}){
 return <Image testID={`hub-art-${id}`} source={sources[id]} accessible={false} accessibilityElementsHidden importantForAccessibility="no" resizeMode="contain" fadeDuration={0} style={{width:size,height:size,flexShrink:0}}/>;
}
