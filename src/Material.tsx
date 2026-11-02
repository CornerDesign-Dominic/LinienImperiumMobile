import React,{forwardRef} from 'react';
import {Image,Pressable as NativePressable,PressableProps,StyleSheet,View as NativeView,ViewProps,ViewStyle} from 'react-native';
import {materialForColor,materialOpacity} from './materialRules';

const textures={paper:require('../assets/art/materials/parchment.jpg'),petrol:require('../assets/art/materials/petrol.jpg')};
/** Decorative only: absolute siblings never change sizing, hit targets or reading order. */
export function MaterialLayer({surfaceStyle,quiet=false}:{surfaceStyle?:any;quiet?:boolean}){
 const flat:ViewStyle=StyleSheet.flatten(surfaceStyle)||{},kind=materialForColor(flat.backgroundColor);
 // Tiny indicators, progress tracks and color swatches keep their exact semantic color.
 if(!kind||(typeof flat.height==='number'&&flat.height<24)||(typeof flat.width==='number'&&flat.width<24))return null;
 const radius={borderRadius:flat.borderRadius,borderTopLeftRadius:flat.borderTopLeftRadius,borderTopRightRadius:flat.borderTopRightRadius,borderBottomLeftRadius:flat.borderBottomLeftRadius,borderBottomRightRadius:flat.borderBottomRightRadius};
 return <NativeView pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill,radius,{overflow:'hidden'}]}>
  <Image source={textures[kind]} accessible={false} fadeDuration={0} resizeMode="repeat" style={[StyleSheet.absoluteFill,{width:'100%',height:'100%',opacity:materialOpacity(flat.backgroundColor,quiet)}]}/>
  {kind==='paper'&&!!flat.borderWidth&&<NativeView style={[StyleSheet.absoluteFill,radius,{borderWidth:1,borderColor:'rgba(121,89,31,0.035)'}]}/>}
 </NativeView>;
}
/** Drop-in hosts for colored UI surfaces; uncolored layout views remain plain. */
export const MaterialView=forwardRef<React.ComponentRef<typeof NativeView>,ViewProps>(function MaterialView({children,style,...props},ref){
 return <NativeView {...props} ref={ref} style={style}><MaterialLayer surfaceStyle={style}/>{children}</NativeView>;
});
export const MaterialPressable=forwardRef<React.ComponentRef<typeof NativeView>,PressableProps>(function MaterialPressable({children,style,...props},ref){
 return <NativePressable {...props} ref={ref} style={style}>{state=><><MaterialLayer surfaceStyle={typeof style==='function'?style(state):style}/>{typeof children==='function'?children(state):children}</>}</NativePressable>;
});
