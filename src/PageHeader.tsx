import React,{useState} from 'react';
import {Pressable,StyleSheet,View} from 'react-native';
import {MaterialLayer} from './Material';
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
  <MaterialLayer surfaceStyle={s.row} kind="paper"/>
  {home?<View testID="page-header-back-placeholder" style={s.slot}/>:<Pressable testID="page-header-back" accessibilityRole="button" accessibilityLabel={t('Zurück')} onPress={onBack} style={({pressed})=>[s.slot,pressed&&s.pressed]}><Icon name="back" size={24} color={C.ink}/></Pressable>}
  <View testID="page-header-center" style={s.center} onLayout={({nativeEvent:{layout:{width}}})=>setAvailable(previous=>previous===width?previous:width)}>
   {lineWidth>=16&&<View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" testID="page-header-ornaments" style={s.ornaments}>
    <BrassLine width={lineWidth}/><BrassLine width={lineWidth} reverse/>
   </View>}
   <Text testID="page-header-title" literal accessibilityRole="header" onTextLayout={({nativeEvent:{lines}})=>{const width=Math.max(0,...lines.map(line=>line.width));setTextSize(previous=>previous.title===title&&previous.width===width&&previous.lines===lines.length?previous:{title,width,lines:lines.length});}} style={s.title}>{title}</Text>
  </View>
  {onHelp?<Pressable testID="page-header-help" accessibilityRole="button" accessibilityLabel={t('Spielhilfe')} onPress={onHelp} style={({pressed})=>[s.slot,pressed&&s.pressed]}><Text literal style={s.helpMark}>?</Text></Pressable>:<View testID="page-header-help-placeholder" style={s.slot}/>}
 </View>;
}
function BrassLine({width,reverse=false}:{width:number;reverse?:boolean}){
 return <View testID="page-header-brass-line" style={[s.line,{width}]}><View style={[s.taper,reverse?{right:0,borderLeftWidth:width,borderLeftColor:C.brass}:{left:0,borderRightWidth:width,borderRightColor:C.brass}]}/></View>;
}
const s=StyleSheet.create({
 row:{minHeight:48,flexDirection:'row',alignItems:'center',paddingHorizontal:8,paddingVertical:2,backgroundColor:C.panel,borderBottomWidth:1,borderBottomColor:C.brass},
 slot:{width:44,height:44,alignItems:'center',justifyContent:'center',flexShrink:0},
 center:{flex:1,minWidth:0,justifyContent:'center'},
 title:{width:'100%',textAlign:'center',fontFamily:displayFont,fontSize:20,lineHeight:26,fontWeight:'600',letterSpacing:.2,color:C.ink},
 ornaments:{position:'absolute',left:0,right:0,top:'50%',height:1,marginTop:-.5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 line:{height:1,position:'relative'},taper:{position:'absolute',top:0,width:0,height:0,borderWidth:0,borderStyle:'solid',borderColor:'transparent',borderTopWidth:.5,borderBottomWidth:.5,backgroundColor:'transparent'},
 helpMark:{fontFamily:displayFont,fontSize:27,lineHeight:32,fontWeight:'500',color:C.ink,textAlign:'center'},pressed:{opacity:.6}
});
