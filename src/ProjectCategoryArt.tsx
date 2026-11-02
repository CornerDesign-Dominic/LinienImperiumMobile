import React,{memo} from 'react';
import {Image,StyleSheet} from 'react-native';
const regions=[
 require('../assets/art/regions/crownlands.jpg'),
 require('../assets/art/regions/prairies.jpg'),
 require('../assets/art/regions/saffron-road.jpg'),
 require('../assets/art/regions/jade-valley.jpg'),
 require('../assets/art/regions/northmark.jpg'),
];

// The bundled scenes are decoration only; category buttons own all semantics.
export const ProjectCategoryArt=memo(function ProjectCategoryArt({region,referral=false}:{region:number;referral?:boolean}){
 const source=referral?require('../assets/art/projects/referral-trade.jpg'):regions[region];
 return source?<Image accessible={false} accessibilityElementsHidden importantForAccessibility="no" source={source} resizeMode="cover" fadeDuration={0} style={StyleSheet.absoluteFill}/>:null;
});
