import React from 'react';
import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import {Text} from './Language';
import {t as translate} from './i18n';
import {MenuArt} from './MenuArt';
import {Icon} from './Icon';
import {C} from './theme';

export function HomeCustomerCard({customers,onPress,styles}:{customers:{points:number}[];onPress:()=>void;styles:any}){
 const available=customers.some(customer=>customer.points>0);
 return <Pressable accessibilityRole="button" accessibilityLabel={`${translate('Stammkunden')}${available?`, ${translate('Verbesserungspunkte verfügbar')}`:''}`} onPress={onPress} style={({pressed})=>[styles.menuRow,pressed&&{opacity:.75}]}>
  <MenuArt id="customers"/>
  <View style={styles.menuCopy}><Text numberOfLines={1} style={styles.menuTitle}>Stammkunden</Text><Text numberOfLines={1} ellipsizeMode="tail" style={styles.menuDetail}>Beziehungen und Verbesserungen</Text></View>
  {available&&<View testID="home-customer-points" accessible={false} importantForAccessibility="no-hide-descendants" style={{minWidth:42,alignItems:'flex-end',flexShrink:0}}><Icon name="arrow" size={24} color={C.gold} style={{transform:[{rotate:'-45deg'}]}}/></View>}
  <Icon name="chevron" size={16} color={C.gold}/>
 </Pressable>;
}
