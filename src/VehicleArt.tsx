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
 'market-team':require('../assets/art/vehicles/market-team.jpg'),
 'royal-mail-coach':require('../assets/art/vehicles/royal-mail-coach.jpg'),
 'silver-stag-team':require('../assets/art/vehicles/silver-stag-team.jpg'),
 'settler-wagon':require('../assets/art/vehicles/settler-wagon.jpg'),
 'ox-freight-wagon':require('../assets/art/vehicles/ox-freight-wagon.jpg'),
 'prairie-freight-train':require('../assets/art/vehicles/prairie-freight-train.jpg'),
 'pioneer-lead-wagon':require('../assets/art/vehicles/pioneer-lead-wagon.jpg'),
 'thunder-bison-team':require('../assets/art/vehicles/thunder-bison-team.jpg'),
 'pack-donkey-train':require('../assets/art/vehicles/pack-donkey-train.jpg'),
 'desert-camel':require('../assets/art/vehicles/desert-camel.jpg'),
 'oasis-caravan':require('../assets/art/vehicles/oasis-caravan.jpg'),
 'silver-caravan':require('../assets/art/vehicles/silver-caravan.jpg'),
 'dune-runner-caravan':require('../assets/art/vehicles/dune-runner-caravan.jpg'),
 'bamboo-handcart':require('../assets/art/vehicles/bamboo-handcart.jpg'),
 'tea-mule-team':require('../assets/art/vehicles/tea-mule-team.jpg'),
 'terrace-ox-wagon':require('../assets/art/vehicles/terrace-ox-wagon.jpg'),
 'jade-scout-team':require('../assets/art/vehicles/jade-scout-team.jpg'),
 'fisher-dog-sled':require('../assets/art/vehicles/fisher-dog-sled.jpg'),
 'reindeer-freight-sled':require('../assets/art/vehicles/reindeer-freight-sled.jpg'),
 'northern-freight-team':require('../assets/art/vehicles/northern-freight-team.jpg'),
 'white-stag-sled':require('../assets/art/vehicles/white-stag-sled.jpg'),
 'snow-leopard-express':require('../assets/art/vehicles/snow-leopard-express.jpg'),

};
export function VehicleArt({card,style}:any){
 const source=artwork[card?.artKey];
 return <View style={[styles.art,style]}>{source
  ?<Image source={source} resizeMode="contain" accessibilityLabel={t(card.name)} style={styles.image}/>
  :<Icon name="truck" size={32} color={rarityColor(card?.rarity)}/>}</View>;
}
const styles=StyleSheet.create({art:{width:'100%',aspectRatio:1,backgroundColor:C.raised,borderRadius:6,overflow:'hidden',alignItems:'center',justifyContent:'center'},image:{width:'100%',height:'100%'}});
