import React,{memo} from 'react';
import {Image,StyleSheet} from 'react-native';

// Frameless, transparent miniatures: all sources are static and bundled offline.
export const cargoAssets:Record<string,number>={
 "Mehl":require('../assets/art/orders/customers/flour.png'),
 "Werkzeuge":require('../assets/art/orders/customers/tools.png'),
 "Möbel":require('../assets/art/orders/customers/furniture.png'),
 "Leder":require('../assets/art/orders/customers/leather.png'),
 "Tuche":require('../assets/art/orders/customers/cloth.png'),
 "Käse":require('../assets/art/orders/customers/cheese.png'),
 "Gewürzmischungen":require('../assets/art/orders/customers/spices.png'),
 "Farbstoffe":require('../assets/art/orders/customers/dyes.png'),
 "Räucherwerk":require('../assets/art/orders/customers/incense.png'),
 "Papier":require('../assets/art/orders/customers/paper.png'),
 "Teemischungen":require('../assets/art/orders/customers/tea.png'),
 "Porzellangeschirr":require('../assets/art/orders/customers/porcelain.png'),
 "Trockenfisch":require('../assets/art/orders/customers/dried-fish.png'),
 "Pelzkleidung":require('../assets/art/orders/customers/fur-clothing.png'),
 "Schmiedewaren":require('../assets/art/orders/customers/forged-goods.png'),
 "Goldschmuck":require('../assets/art/projects/gold-jewelry.png'),
 "Feine Wandteppiche":require('../assets/art/projects/fine-tapestries.png'),
 "Kostbare Essenzen":require('../assets/art/projects/precious-essences.png'),
 "Jadekunstwerke":require('../assets/art/projects/jade-artworks.png'),
 "Bernsteinschnitzereien":require('../assets/art/projects/amber-carvings.png'),
 Holz:require('../assets/art/orders/wood.png'),
 Stein:require('../assets/art/orders/stone.png'),
 Getreide:require('../assets/art/orders/grain.png'),
 Erz:require('../assets/art/orders/ore.png'),
 Wolle:require('../assets/art/orders/wool.png'),
};
const categories:Record<string,number>={
 material:require('../assets/art/orders/material-orders.png'),
 character:require('../assets/art/orders/card-orders.png'),
 private:require('../assets/art/menu/orders.png'),
 customer:require('../assets/art/menu/customers.png'),
};
// Legacy and customer-specific products use a neutral freight crate, never a
// misleading basic commodity. This keeps saved orders from older versions usable.
const freight=require('../assets/art/menu/inventory.png');
export const OrderArtwork=memo(function OrderArtwork({cargo,category,size=68,fill=false}:{cargo?:string;category?:string;size?:number;fill?:boolean}){
 const source=category?categories[category]||freight:cargoAssets[cargo||'']||freight;
 return <Image accessible={false} accessibilityElementsHidden importantForAccessibility="no" source={source} resizeMode="contain" fadeDuration={0} style={fill?[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]:{width:size,height:size,flexShrink:0}}/>;
});

/** Decoration only; the enclosing independent 44-dp action owns its semantics. */
export const OfferPinArtwork=memo(function OfferPinArtwork({held=false}:{held?:boolean}){
 return <Image accessible={false} accessibilityElementsHidden importantForAccessibility="no" source={held?require('../assets/art/orders/offer-pin.png'):require('../assets/art/orders/offer-pin-outline.png')} resizeMode="contain" fadeDuration={0} style={{width:28,height:28}}/>;
});
