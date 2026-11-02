import React from 'react';
import {Image,Pressable,StyleSheet,View,ViewProps} from 'react-native';
import {Text} from './Language';
import {C} from './theme';

type Kind='paper'|'petrol';
const surfaces={paper:require('../assets/art/materials/sales-parchment.jpg'),petrol:require('../assets/art/materials/sales-petrol.jpg')};
/** Modal pilot: one edge-aged material fitted to each surface, never tiled. */
export function SalesMaterialLayer({kind}:{kind:Kind}){
 return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}><Image source={surfaces[kind]} accessible={false} resizeMode="stretch" fadeDuration={0} style={[StyleSheet.absoluteFill,{width:'100%',height:'100%',opacity:kind==='paper'?.72:.88}]}/></View>;
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
