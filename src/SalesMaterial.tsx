import React from 'react';
import {Pressable,StyleSheet,View,ViewProps} from 'react-native';
import {MaterialLayer} from './Material';
import {Text} from './Language';
import {C} from './theme';

type Kind='paper'|'petrol';
/** Compatibility hosts for the approved pilot; now use the shared material source. */
export function SalesMaterialLayer({kind}:{kind:Kind}){
 return <MaterialLayer kind={kind} surfaceStyle={{backgroundColor:kind==='paper'?C.panel:C.accent}}/>;
}
export function SalesMaterialView({kind='paper',children,style,...props}:ViewProps&{kind?:Kind}){
 return <View {...props} style={[style,{overflow:'hidden'}]}><SalesMaterialLayer kind={kind}/>{children}</View>;
}
export function SalesMaterialButton({children,onPress,disabled=false}:any){
 return <Pressable accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,disabled&&s.disabled,pressed&&!disabled&&{opacity:.8}]}><SalesMaterialLayer kind="petrol"/><Text style={s.text}>{children}</Text></Pressable>;
}
const s=StyleSheet.create({
 button:{flexDirection:'row',gap:7,backgroundColor:C.accent,borderColor:C.ink,borderWidth:1,borderBottomWidth:3,borderRadius:5,minHeight:44,paddingHorizontal:14,paddingVertical:11,alignItems:'center',justifyContent:'center',marginTop:8,overflow:'hidden'},
 disabled:{opacity:.45},text:{flexShrink:1,fontSize:13,fontWeight:'700',color:C.onInk,textAlign:'center'}
});
