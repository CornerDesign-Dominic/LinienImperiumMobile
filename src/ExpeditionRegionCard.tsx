import React,{useState} from 'react';
import {View,Image,Pressable,StyleSheet} from 'react-native';
import {Text} from './Language';
import {t as translate} from './i18n';
import {Icon} from './Icon';
import {C,displayFont,regionInks} from './theme';
import {n} from './ui';
import {regionIdentities} from './regionIdentities';
import {regionImageFrame} from './regionImageLayout';

// Presentation only: stable server region indices, customer IDs and progress stay intact.
const images=[
 require('../assets/art/regions/crownlands.jpg'),
 require('../assets/art/regions/prairies.jpg'),
 require('../assets/art/regions/saffron-road.jpg'),
 require('../assets/art/regions/jade-valley.jpg'),
 require('../assets/art/regions/northmark.jpg'),
];
export function ExpeditionRegionCard({map,onOpen}:{map:any;onOpen:(region:number)=>void}){
 const [viewport,setViewport]=useState({width:0,height:0});
 const frame=regionImageFrame(viewport.width,viewport.height,map.index);
 const theme=regionIdentities[map.index],title=theme?.title||map.name,customer=theme?.customer||map.customer.name;
 return <Pressable accessibilityRole="button" accessibilityLabel={`${translate(title)}, ${translate(customer)}, ${n(map.progress)} %${map.open?'':`, ${translate('Gesperrt')}`}`} accessibilityState={{disabled:!map.open}} disabled={!map.open} onPress={()=>onOpen(map.index)} style={({pressed})=>[styles.card,{borderTopColor:regionInks[map.index%regionInks.length]},pressed&&{opacity:.85}]}>
  <View style={styles.scene} onLayout={({nativeEvent:{layout:{width,height}}})=>setViewport(previous=>previous.width===width&&previous.height===height?previous:{width,height})}>
   {theme&&frame&&<Image source={images[map.index]} resizeMode="cover" style={[styles.image,frame]} accessible={false} importantForAccessibility="no"/>}
   <View style={styles.caption}><Text numberOfLines={1} style={styles.title}>{title}</Text>{map.open?<Icon name="arrow" size={17} color={C.onInk}/>:<View style={styles.lock}><Icon name="lock" size={15} color={C.onInk}/><Text style={styles.lockText}>Gesperrt</Text></View>}</View>
  </View>
  <View style={styles.footer}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.customer}>{customer}</Text><Text style={styles.progress}>{n(map.progress)} %</Text></View>
 </Pressable>;
}
const styles=StyleSheet.create({
 card:{height:200,backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderTopWidth:3,borderRadius:7,overflow:'hidden',marginBottom:12,boxShadow:'0px 2px 3px rgba(36,40,29,0.08)'},
 scene:{flex:1,overflow:'hidden',backgroundColor:C.ink},image:{position:'absolute'},caption:{position:'absolute',top:0,left:0,right:0,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,paddingHorizontal:12,paddingVertical:5,backgroundColor:'rgba(21,33,33,0.40)'},title:{flex:1,minWidth:0,fontFamily:displayFont,fontSize:17,lineHeight:22,fontWeight:'600',color:C.onInk,textShadowColor:'rgba(0,0,0,0.7)',textShadowOffset:{width:0,height:1},textShadowRadius:2},
 footer:{height:46,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,backgroundColor:C.panel},customer:{flex:1,minWidth:0,fontSize:12,lineHeight:18,color:C.text,fontWeight:'600'},progress:{fontSize:14,lineHeight:21,fontWeight:'700',color:C.accent,flexShrink:0},
 lock:{flexDirection:'row',alignItems:'center',gap:4},lockText:{fontSize:10,lineHeight:15,color:C.onInk},
});
