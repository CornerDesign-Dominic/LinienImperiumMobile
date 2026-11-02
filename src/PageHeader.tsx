import React from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {MaterialLayer} from './Material';
import {Icon} from './Icon';
import {Text} from './Language';
import {t} from './i18n';
import {C,displayFont} from './theme';

type Props={title:string;home?:boolean;onBack:()=>void;onHelp?:()=>void};
// Equal end slots keep the title centered even when a control is absent.
export function PageHeader({title,home=false,onBack,onHelp}:Props){
 return <View testID="page-header" style={s.row}>
  <View pointerEvents="none" accessible={false} style={s.plate}><MaterialLayer surfaceStyle={s.plate}/></View>
  {home?<View testID="page-header-back-placeholder" style={s.slot}/>:<Pressable testID="page-header-back" accessibilityRole="button" accessibilityLabel={t('Zurück')} onPress={onBack} style={({pressed})=>[s.slot,pressed&&s.pressed]}><View style={s.disc}><Icon name="back" size={18} color={copper}/></View></Pressable>}
  <Text testID="page-header-title" literal accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.72} style={s.title}>{title.toUpperCase()}</Text>
  {onHelp?<Pressable testID="page-header-help" accessibilityRole="button" accessibilityLabel={t('Spielhilfe')} onPress={onHelp} style={({pressed})=>[s.slot,pressed&&s.pressed]}><View style={s.disc}><Text literal style={s.helpMark}>?</Text></View></Pressable>:<View testID="page-header-help-placeholder" style={s.slot}/>}
 </View>;
}
const copper='#C49060';
const s=StyleSheet.create({
 row:{height:44,flexDirection:'row',alignItems:'center',paddingHorizontal:8,backgroundColor:C.bg},
 plate:{position:'absolute',left:8,right:8,top:3,bottom:3,backgroundColor:C.ink,borderWidth:1,borderColor:copper,borderRadius:4,overflow:'hidden'},
 slot:{width:44,height:44,alignItems:'center',justifyContent:'center',flexShrink:0},
 disc:{width:29,height:29,borderRadius:15,borderWidth:1,borderColor:copper,backgroundColor:'rgba(15,30,30,0.28)',alignItems:'center',justifyContent:'center'},
 title:{flex:1,minWidth:0,textAlign:'center',fontFamily:displayFont,fontSize:15,lineHeight:21,fontWeight:'600',letterSpacing:.6,color:C.onInk},
 helpMark:{fontFamily:displayFont,fontSize:22,lineHeight:25,fontWeight:'600',color:copper,textAlign:'center'},pressed:{opacity:.65}
});
