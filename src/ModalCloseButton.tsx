import React from 'react';
import {StyleSheet,StyleProp,ViewStyle} from 'react-native';
import {MaterialPressable} from './Material';
import {Icon} from './Icon';
import {t} from './i18n';
import {C} from './theme';

/** The same paper square closes every game dialog, independent of its header. */
export function ModalCloseButton({onPress,disabled=false,style,testID}:{onPress:()=>void;disabled?:boolean;style?:StyleProp<ViewStyle>;testID?:string}){
 return <MaterialPressable testID={testID} accessibilityRole="button" accessibilityLabel={t('Schließen')} accessibilityState={{disabled}} disabled={disabled} onPress={()=>{if(!disabled)onPress();}} style={({pressed})=>[style,s.button,disabled&&s.disabled,pressed&&!disabled&&s.pressed]}><Icon name="close" size={20} color={C.text}/></MaterialPressable>;
}
const s=StyleSheet.create({
 button:{width:44,height:44,minWidth:44,minHeight:44,flexShrink:0,alignSelf:'flex-start',alignItems:'center',justifyContent:'center',padding:0,marginTop:0,backgroundColor:C.raised,borderColor:C.line,borderWidth:1,borderBottomWidth:3,borderRadius:5},
 disabled:{opacity:.45},pressed:{opacity:.8}
});
