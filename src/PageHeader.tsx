import React,{useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {Icon} from './Icon';
import {Text} from './Language';
import {t} from './i18n';
import {C,displayFont} from './theme';

type Props={title:string;home?:boolean;onBack:()=>void;onHelp?:()=>void};
// The end slots stay equal; decoration never takes space away from the title.
export function PageHeader({title,home=false,onBack,onHelp}:Props){
 const [available,setAvailable]=useState(0),[textSize,setTextSize]=useState({title:'',width:0,lines:0});
 const lineWidth=textSize.title===title&&textSize.lines===1?Math.min(72,(available-textSize.width)/2-12):0;
 return <View testID="page-header" style={s.row}>
  {home?<View testID="page-header-back-placeholder" style={s.slot}/>:<Pressable testID="page-header-back" accessibilityRole="button" accessibilityLabel={t('Zurück')} onPress={onBack} hitSlop={{top:6,bottom:6}} style={({pressed})=>[s.slot,pressed&&s.pressed]}><Icon name="back" size={24} color={C.ink}/></Pressable>}
  <View testID="page-header-center" style={s.center} onLayout={({nativeEvent:{layout:{width}}})=>setAvailable(previous=>previous===width?previous:width)}>
   {lineWidth>=16&&<View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" testID="page-header-ornaments" style={s.ornaments}>
    <BrassLine width={lineWidth}/><BrassLine width={lineWidth} reverse/>
   </View>}
   <Text testID="page-header-title" literal accessibilityRole="header" onTextLayout={({nativeEvent:{lines}})=>{const width=Math.max(0,...lines.map(line=>line.width));setTextSize(previous=>previous.title===title&&previous.width===width&&previous.lines===lines.length?previous:{title,width,lines:lines.length});}} style={s.title}>{title}</Text>
  </View>
  {onHelp?<Pressable testID="page-header-help" accessibilityRole="button" accessibilityLabel={t('Spielhilfe')} onPress={onHelp} hitSlop={{top:6,bottom:6}} style={({pressed})=>[s.slot,pressed&&s.pressed]}><Text literal style={s.helpMark}>?</Text></Pressable>:<View testID="page-header-help-placeholder" style={s.slot}/>}
 </View>;
}
function BrassLine({width,reverse=false}:{width:number;reverse?:boolean}){
 return <View testID="page-header-brass-line" style={[s.line,{width,backgroundImage:`linear-gradient(to ${reverse?'right':'left'}, ${C.brass}, transparent)`}]}/>;
}
const s=StyleSheet.create({
 row:{minHeight:32,flexDirection:'row',alignItems:'center',paddingHorizontal:8,backgroundColor:C.panel,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:C.brass},
 slot:{width:44,height:32,alignItems:'center',justifyContent:'center',flexShrink:0},
 center:{flex:1,minWidth:0,alignSelf:'stretch',justifyContent:'center'},
 title:{width:'100%',textAlign:'center',fontFamily:displayFont,fontSize:18,lineHeight:24,fontWeight:'600',letterSpacing:.2,color:C.ink},
 ornaments:{position:'absolute',left:0,right:0,top:0,bottom:0,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 line:{height:1},
 helpMark:{fontFamily:displayFont,fontSize:23,lineHeight:28,fontWeight:'500',color:C.ink,textAlign:'center'},pressed:{opacity:.6}
});
