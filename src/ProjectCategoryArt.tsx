import React,{memo} from 'react';
import {Image,StyleSheet} from 'react-native';
const preciousGoods:Record<string,number>={
 Goldschmuck:require('../assets/art/projects/gold-jewelry.png'),
 'Feine Wandteppiche':require('../assets/art/projects/fine-tapestries.png'),
 'Kostbare Essenzen':require('../assets/art/projects/precious-essences.png'),
 Jadekunstwerke:require('../assets/art/projects/jade-artworks.png'),
 Bernsteinschnitzereien:require('../assets/art/projects/amber-carvings.png'),
};

// Category identity comes from the server's canonical preciousCargo, not region order.
// Unknown future goods retain a neutral freight illustration until their art exists.
export const ProjectCategoryArt=memo(function ProjectCategoryArt({preciousCargo,referral=false}:{preciousCargo?:string;referral?:boolean;region?:number}){
 const source=referral?require('../assets/art/projects/referral-coffer.png'):preciousGoods[preciousCargo||'']||require('../assets/art/menu/inventory.png');
 return <Image accessible={false} accessibilityElementsHidden importantForAccessibility="no" source={source} resizeMode="contain" fadeDuration={0} style={referral?styles.coffer:styles.goods}/>;
});

// Explicit dimensions override the bundled image's intrinsic native size.
// Keep a small inset so the entrusted coffer is visible in full on the paper.
const styles=StyleSheet.create({coffer:{position:'absolute',top:'5%',left:'5%',width:'90%',height:'90%'},goods:{position:'absolute',top:'3%',left:'5%',width:'90%',height:'76%'}});
