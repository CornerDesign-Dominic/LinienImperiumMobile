import React,{memo} from 'react';
import {Image} from 'react-native';

// Frameless, transparent miniatures: all sources are static and bundled offline.
const cargoAssets:Record<string,number>={
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
export const OrderArtwork=memo(function OrderArtwork({cargo,category,size=68}:{cargo?:string;category?:string;size?:number}){
 const source=category?categories[category]||freight:cargoAssets[cargo||'']||freight;
 return <Image accessible={false} accessibilityElementsHidden importantForAccessibility="no" source={source} resizeMode="contain" fadeDuration={0} style={{width:size,height:size,flexShrink:0}}/>;
});
