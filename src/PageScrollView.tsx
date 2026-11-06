import React,{forwardRef} from 'react';
import {ScrollView,ScrollViewInstance,ScrollViewProps,StyleSheet} from 'react-native';
import {MaterialLayer} from './Material';
import {C} from './theme';

/** Every ordinary page fills its viewport, while only overflowing content scrolls. */
export const PageScrollView=forwardRef<ScrollViewInstance,ScrollViewProps>(function PageScrollView({children,style,contentContainerStyle,...props},ref){
 return <ScrollView {...props} ref={ref} style={[s.viewport,style]} contentContainerStyle={[s.content,contentContainerStyle]} alwaysBounceVertical={false} overScrollMode="never">
  <MaterialLayer surfaceStyle={s.viewport} quiet/>
  {children}
 </ScrollView>;
});
const s=StyleSheet.create({viewport:{flex:1,backgroundColor:C.bg},content:{flexGrow:1}});
