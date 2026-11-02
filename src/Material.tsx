import React,{forwardRef,memo} from 'react';
import {Image,Pressable as NativePressable,PressableProps,StyleSheet,View as NativeView,ViewProps,ViewStyle} from 'react-native';
import {materialForColor,materialOpacity} from './materialRules';

type Kind='paper'|'petrol';
type LayerProps={kind:Kind;opacity:number;borderRadius?:number;borderTopLeftRadius?:number;borderTopRightRadius?:number;borderBottomLeftRadius?:number;borderBottomRightRadius?:number};
// The approved Vertrieb pilot is the shared source; one fitted image per surface.
const textures={paper:require('../assets/art/materials/sales-parchment.jpg'),petrol:require('../assets/art/materials/sales-petrol.jpg')};
const MaterialTexture=memo(function MaterialTexture({kind,opacity,...radius}:LayerProps){
 return <NativeView pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill,radius,s.clip]}>
  <Image source={textures[kind]} accessible={false} fadeDuration={0} resizeMode="stretch" style={[StyleSheet.absoluteFill,s.image,{opacity}]}/>
 </NativeView>;
});
/** Resolve to scalar props so static texture subtrees survive unrelated clock updates. */
export function MaterialLayer({surfaceStyle,quiet=false,kind:explicitKind}:{surfaceStyle?:any;quiet?:boolean;kind?:Kind}){
 const flat:ViewStyle=StyleSheet.flatten(surfaceStyle)||{},kind=explicitKind??materialForColor(flat.backgroundColor);
 // Progress tracks, status indicators and small swatches retain their exact color.
 if(!kind||(typeof flat.height==='number'&&flat.height<24)||(typeof flat.width==='number'&&flat.width<24))return null;
 return <MaterialTexture kind={kind} opacity={materialOpacity(flat.backgroundColor,quiet)} borderRadius={flat.borderRadius as number|undefined} borderTopLeftRadius={flat.borderTopLeftRadius as number|undefined} borderTopRightRadius={flat.borderTopRightRadius as number|undefined} borderBottomLeftRadius={flat.borderBottomLeftRadius as number|undefined} borderBottomRightRadius={flat.borderBottomRightRadius as number|undefined}/>;
}
/** Drop-in hosts: uncolored layouts don't mount any decoration. Opt out behind art. */
export const MaterialView=forwardRef<React.ComponentRef<typeof NativeView>,ViewProps&{material?:boolean}>(function MaterialView({children,style,material=true,...props},ref){
 return <NativeView {...props} ref={ref} style={style}>{material&&MaterialLayer({surfaceStyle:style})}{children}</NativeView>;
});
export const MaterialPressable=forwardRef<React.ComponentRef<typeof NativeView>,PressableProps&{material?:boolean}>(function MaterialPressable({children,style,material=true,...props},ref){
 return <NativePressable {...props} ref={ref} style={style}>{state=><>{material&&MaterialLayer({surfaceStyle:typeof style==='function'?style(state):style})}{typeof children==='function'?children(state):children}</>}</NativePressable>;
});
const s=StyleSheet.create({clip:{overflow:'hidden'},image:{width:'100%',height:'100%'}});
