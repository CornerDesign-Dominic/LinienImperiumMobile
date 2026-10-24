import React from 'react';
import {View,Pressable,StyleSheet} from 'react-native';
import {Icon,IconName} from './Icon';
import {Text} from './Language';
import {t as translate} from './i18n';
import {C,displayFont,regionInks} from './theme';

export function Compass({size=48,color=C.brass}:{size?:number;color?:string}){return <Icon name="expedition" size={size} color={color}/>;}
export function CompanySummary({company,city,onOpen,points=0}:{company:string;city:string;onOpen:()=>void;points?:number}){
 return <Pressable accessibilityRole="button" accessibilityLabel={translate('Firma öffnen')+(points?`, ${translate(`Punkte verfügbar · ${points}`)}`:'')} onPress={onOpen} style={({pressed})=>[a.companySummary,pressed&&{opacity:.8}]}>
  <Icon name="company" size={30} color={C.brassLight}/>
  <View style={{flex:1,minWidth:0}}><Text numberOfLines={1} style={a.eyebrow}>DEIN HANDELSIMPERIUM</Text><Text literal numberOfLines={1} style={a.company}>{company}</Text><Text literal numberOfLines={1} style={a.city}>{city}</Text>{points>0&&<View style={a.points}><Icon name="plus" size={12} color={C.brassLight}/><Text style={a.pointsText}>Punkte verfügbar · {points}</Text></View>}</View>
  <Icon name="chevron" size={17} color={C.brassLight}/>
 </Pressable>;
}
export function AtlasHeading({title,detail,icon='expedition'}:{title:string;detail?:string;icon?:IconName}){
 return <View style={a.heading}><Icon name={icon} size={34} color={C.gold}/><View style={{flex:1,minWidth:0}}><Text style={a.atlasTitle}>{title}</Text>{detail&&<Text style={a.detail}>{detail}</Text>}</View></View>;
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
 companySummary:{backgroundColor:C.ink,borderWidth:1,borderColor:C.brass,borderRadius:7,marginBottom:10,padding:12,flexDirection:'row',alignItems:'center',gap:12},
 points:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:5,marginTop:7,borderWidth:1,borderColor:C.brass,borderRadius:4,paddingVertical:3,paddingHorizontal:6,backgroundColor:'rgba(218,190,125,.12)'},pointsText:{fontSize:11,lineHeight:16,fontWeight:'700',color:C.brassLight},
 eyebrow:{fontSize:9,fontWeight:'700',letterSpacing:1.2,color:C.brassLight,marginBottom:2},
 company:{fontFamily:displayFont,fontSize:20,lineHeight:25,fontWeight:'700',color:C.onInk},city:{fontSize:12,lineHeight:17,color:C.mutedOnInk,marginTop:2},
 heading:{flexDirection:'row',alignItems:'center',gap:13,marginTop:4,marginBottom:20},atlasTitle:{fontFamily:displayFont,fontWeight:'700',fontSize:24,lineHeight:30,color:C.ink},detail:{fontSize:12,lineHeight:19,color:C.muted,marginTop:4},
 seal:{width:45,height:51,borderWidth:1,borderBottomWidth:3,borderRadius:4,alignItems:'center',justifyContent:'center',backgroundColor:C.raised},sealNumber:{fontFamily:displayFont,fontSize:23,fontWeight:'700'},
});
