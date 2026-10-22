import React from 'react';
import {Image,ImageStyle,StyleProp} from 'react-native';
import {C} from './theme';
const icons={
 book:require('../assets/icons/book.png'),
 arrow:require('../assets/icons/arrow.png'),
 back:require('../assets/icons/back.png'),
 cards:require('../assets/icons/cards.png'),
 check:require('../assets/icons/check.png'),
 chevron:require('../assets/icons/chevron.png'),
 close:require('../assets/icons/close.png'),
 coin:require('../assets/icons/coin.png'),
 company:require('../assets/icons/company.png'),
 crafting:require('../assets/icons/crafting.png'),
 customers:require('../assets/icons/customers.png'),
 document:require('../assets/icons/document.png'),
 events:require('../assets/icons/events.png'),
 expedition:require('../assets/icons/expedition.png'),
 fleet:require('../assets/icons/fleet.png'),
 garage:require('../assets/icons/garage.png'),
 gear:require('../assets/icons/gear.png'),
 help:require('../assets/icons/help.png'),
 home:require('../assets/icons/home.png'),
 hub:require('../assets/icons/hub.png'),
 inventory:require('../assets/icons/inventory.png'),
 lock:require('../assets/icons/lock.png'),
 minus:require('../assets/icons/minus.png'),
 module:require('../assets/icons/module.png'),
 orders:require('../assets/icons/orders.png'),
 overtime:require('../assets/icons/overtime.png'),
 plus:require('../assets/icons/plus.png'),
 projects:require('../assets/icons/projects.png'),
 reward:require('../assets/icons/reward.png'),
 settings:require('../assets/icons/settings.png'),
 shard:require('../assets/icons/shard.png'),
 statistics:require('../assets/icons/statistics.png'),
 timer:require('../assets/icons/timer.png'),
 truck:require('../assets/icons/truck.png'),
 wholesaler:require('../assets/icons/wholesaler.png'),
} as const;
export type IconName=keyof typeof icons;
export function Icon({name,size=24,color=C.text,style}:{name:IconName;size?:number;color?:string;style?:StyleProp<ImageStyle>}){
 return <Image source={icons[name]} accessible={false} importantForAccessibility="no" resizeMode="contain" style={[{width:size,height:size,tintColor:color,flexShrink:0},style]}/>;
}
export const screenIcons:Record<string,IconName>={procurement:'crafting',home:'home',fleet:'fleet',garage:'garage',orders:'orders',projects:'projects',expeditions:'expedition',cards:'cards',company:'company',hub:'hub',inventory:'inventory',crafting:'crafting',customers:'customers',wholesaler:'wholesaler',statistics:'statistics',account:'settings',events:'events',dealer:'truck'};
export function stockIcon(id:string):IconName{
 if(id.startsWith('gear:'))return 'gear';
 if(id.startsWith('shard:'))return 'shard';
 if(id.startsWith('card:'))return 'cards';
 if(id.startsWith('project:'))return 'projects';
 if(id.startsWith('job:'))return id.includes('character')?'cards':'orders';
 if(id.startsWith('order:'))return 'orders';
 return ({hubVehicleParts:'crafting',capacityModules:'module',companyItems:'company',pickupHints:'document',supplierContacts:'customers',expeditionRefills:'expedition',overtimeRefills:'overtime',private:'orders',customer:'customers'} as Record<string,IconName>)[id]||'inventory';
}

