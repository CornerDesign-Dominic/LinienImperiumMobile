import React from 'react';
import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {Text} from './Language';
import {t as translate} from './i18n';
import {MenuArt} from './MenuArt';
import {Icon} from './Icon';
import {C} from './theme';

export function HomeProcurementCard({procurement,onPress,styles}:{procurement?:{pending?:Record<string,number>};onPress:()=>void;styles:any}){
 const available=Object.values(procurement?.pending||{}).some(amount=>amount>0);
 return <Pressable accessibilityRole="button" accessibilityLabel={`${translate('Materialbeschaffung')}${available?`, ${translate('Loot abholbereit')}`:''}`} onPress={onPress} style={({pressed})=>[styles.menuRow,pressed&&{opacity:.75}]}>
  <MenuArt id="procurement"/>
  <View style={styles.menuCopy}><Text numberOfLines={1} style={styles.menuTitle}>Materialbeschaffung</Text><Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuDetail}>Imperium-Taler in Materialien investieren</Text></View>
  {available&&<View testID="home-procurement-ready" accessible={false} importantForAccessibility="no-hide-descendants" style={{minWidth:42,alignItems:'flex-end',flexShrink:0}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:C.uncommon}}/></View>}
  <Icon name="chevron" size={16} color={C.gold}/>
 </Pressable>;
}
