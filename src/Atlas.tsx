import React from 'react';
import {View,Image,Pressable,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {Text} from './Language';
import {t as translate} from './i18n';
import {C,displayFont,regionInks} from './theme';

export function Compass({size=48,color=C.brass}:{size?:number;color?:string}){return <Icon name="expedition" size={size} color={color}/>;}
export function Harbor({company,city,onExplore}:{company:string;city:string;onExplore:()=>void}){
 return <View style={a.harbor}>
  <Image source={require('../assets/art/harbor.jpg')} resizeMode="cover" style={a.harborImage} accessible={false}/>
  <View style={a.harborCaption}><View style={{flex:1,minWidth:0}}><Text style={a.eyebrow}>DEIN HANDELSIMPERIUM</Text><Text literal style={a.company}>{company}</Text><Text literal style={a.city}>{city}</Text></View><Compass size={40}/></View>
  <Pressable accessibilityRole="button" accessibilityLabel={translate('Regionen im Reiseatlas entdecken')} onPress={onExplore} style={({pressed})=>[a.explore,pressed&&{opacity:.8}]}><Text style={a.exploreText}>Reiseatlas öffnen</Text><Icon name="arrow" size={20} color={C.brassLight}/></Pressable>
 </View>;
}
export function AtlasHeading({title,detail}:{title:string;detail?:string}){
 return <View style={a.heading}><Compass size={34} color={C.gold}/><View style={{flex:1,minWidth:0}}><Text style={a.atlasTitle}>{title}</Text>{detail&&<Text style={a.detail}>{detail}</Text>}</View></View>;
}
export function RegionSeal({index,locked=false}:{index:number;locked?:boolean}){
 const color=locked?C.muted:regionInks[index%regionInks.length];
 return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[a.seal,{borderColor:color}]}><Text style={[a.sealNumber,{color}]}>{String(index+1).padStart(2,'0')}</Text></View>;
}
export const atlasStyles=StyleSheet.create({
 journey:{borderLeftWidth:1,borderLeftColor:C.line,marginLeft:9,paddingLeft:17},
 waypoint:{position:'absolute',left:-22,top:22,width:9,height:9,backgroundColor:C.panel,borderWidth:2,borderColor:C.accent,transform:[{rotate:'45deg'}]},
});
const a=StyleSheet.create({
 harbor:{backgroundColor:C.ink,borderWidth:1,borderColor:C.brass,borderRadius:7,overflow:'hidden',marginBottom:16},harborImage:{width:'100%',aspectRatio:2.05},
 harborCaption:{padding:14,flexDirection:'row',alignItems:'center',gap:10},eyebrow:{fontSize:9,fontWeight:'700',letterSpacing:1.5,color:C.brassLight,marginBottom:5},
 company:{fontFamily:displayFont,fontSize:23,lineHeight:29,fontWeight:'700',color:C.onInk},city:{fontSize:12,lineHeight:19,color:C.mutedOnInk,marginTop:4},
 explore:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:12,paddingHorizontal:14,borderTopWidth:1,borderColor:C.inkRaised,minHeight:44},exploreText:{fontSize:12,fontWeight:'700',color:C.brassLight},exploreArrow:{fontSize:18,color:C.brassLight},
 heading:{flexDirection:'row',alignItems:'center',gap:13,marginTop:4,marginBottom:20},atlasTitle:{fontFamily:displayFont,fontWeight:'700',fontSize:24,lineHeight:30,color:C.ink},detail:{fontSize:12,lineHeight:19,color:C.muted,marginTop:4},
 seal:{width:45,height:51,borderWidth:1,borderBottomWidth:3,borderRadius:4,alignItems:'center',justifyContent:'center',backgroundColor:C.raised},sealNumber:{fontFamily:displayFont,fontSize:23,fontWeight:'700'},
});
