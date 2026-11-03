import React,{memo} from 'react';
import {Image,StyleSheet} from 'react-native';
const regions=[
 require('../assets/art/regions/crownlands.jpg'),
 require('../assets/art/regions/prairies.jpg'),
 require('../assets/art/regions/saffron-road.jpg'),
 require('../assets/art/regions/jade-valley.jpg'),
 require('../assets/art/regions/northmark.jpg'),
];

// Decoration only: landscape scenes for regions, an entrusted coffer for referrals.
// The transparent coffer sits directly on the card paper without its own frame.
export const ProjectCategoryArt=memo(function ProjectCategoryArt({region,referral=false}:{region:number;referral?:boolean}){
 const source=referral?require('../assets/art/projects/referral-coffer.png'):regions[region];
 return source?<Image accessible={false} accessibilityElementsHidden importantForAccessibility="no" source={source} resizeMode={referral?'contain':'cover'} fadeDuration={0} style={referral?styles.coffer:StyleSheet.absoluteFill}/>:null;
});

// Explicit dimensions override the bundled image's intrinsic native size.
// Keep a small inset so the entrusted coffer is visible in full on the paper.
const styles=StyleSheet.create({coffer:{position:'absolute',top:'5%',left:'5%',width:'90%',height:'90%'}});
