import React from 'react';
import {Image} from 'react-native';

// Static sources keep all menu illustrations bundled and available offline.
export const menuAssets:Record<string,number>={
 home:require('../assets/art/menu/company.png'),
 company:require('../assets/art/menu/company.png'),
 fleet:require('../assets/art/menu/fleet.png'),
 garage:require('../assets/art/menu/garage.png'),
 orders:require('../assets/art/menu/orders.png'),
 projects:require('../assets/art/menu/projects.png'),
 events:require('../assets/art/menu/events.png'),
 expeditions:require('../assets/art/menu/expeditions.png'),
 procurement:require('../assets/art/menu/procurement.png'),
 cards:require('../assets/art/menu/cards.png'),
 hub:require('../assets/art/menu/hub.png'),
 inventory:require('../assets/art/menu/inventory.png'),
 crafting:require('../assets/art/menu/crafting.png'),
 customers:require('../assets/art/menu/customers.png'),
 wholesaler:require('../assets/art/menu/wholesaler.png'),
 statistics:require('../assets/art/menu/statistics.png'),
 account:require('../assets/art/menu/account.png'),
};

/** Decorative art: the enclosing navigation button provides the spoken label. */
export function MenuArt({id,size=48}:{id:string;size?:number}){
 const source=menuAssets[id];
 if(!source)return null;
 return <Image testID={`menu-art-${id}`} source={source} accessible={false} accessibilityElementsHidden importantForAccessibility="no" resizeMode="contain" fadeDuration={0} style={{width:size,height:size,flexShrink:0}}/>;
}
