import React from 'react';
import {Image,View,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {C} from './ui';
import {rarityColor} from './items';
import {t} from './i18n';
const artwork:Record<string,any>={
 'donkey-cart':require('../assets/art/vehicles/donkey-cart.jpg'),
 'royal-lion-team':require('../assets/art/vehicles/royal-lion-team.jpg'),
 'imperial-panda-team':require('../assets/art/vehicles/imperial-panda-team.jpg'),
};
export function VehicleArt({card,style}:any){
 const source=artwork[card?.artKey];
 return <View style={[styles.art,style]}>{source
  ?<Image source={source} resizeMode="contain" accessibilityLabel={t(card.name)} style={styles.image}/>
  :<Icon name="truck" size={32} color={rarityColor(card?.rarity)}/>}</View>;
}
const styles=StyleSheet.create({art:{width:'100%',aspectRatio:1,backgroundColor:C.raised,borderRadius:6,overflow:'hidden',alignItems:'center',justifyContent:'center'},image:{width:'100%',height:'100%'}});
