import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Image,Pressable,ScrollView,ScrollViewInstance,StyleSheet,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from './Language';
import {t} from './i18n';
import {Icon} from './Icon';
import {C,displayFont} from './theme';
import {regionIdentities} from './regionIdentities';
import {regionRoutes} from './regionRoutes';
import {adjacentJourneyRegion,journeyFocus,journeyGeometry,journeyOffset} from './journeyLayout';

type Props={map:any;maps:any[];state:any;missions:any[];accountId:string;onRegion:(index:number)=>void;onPlace:(index:number|'endless')=>void};
const fogTexture=require('../assets/art/atmosphere/fog-edge.png');
const fogTones=['#E9E7DD','#EEE6D8','#F0E6D9','#E5EAE4','#E4EAF0'];
export function ExpeditionJourney({map,maps,state,missions,accountId,onRegion,onPlace}:Props){
 const route=regionRoutes[map.index],identity=regionIdentities[map.index];
 const [viewport,setViewport]=useState({width:0,height:0}),[loaded,setLoaded]=useState(false),[ready,setReady]=useState(false);
 const scroll=useRef<ScrollViewInstance>(null),position=useRef<number|null>(null),started=useRef(false),saveTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const storageKey=`linienimperium.journey.${accountId}.${map.index}`;
 const geometry=useMemo(()=>journeyGeometry(viewport.width,viewport.height,route.places,state.discovered),[viewport.width,viewport.height,route,state.discovered]);
 useEffect(()=>{
  let alive=true;
  AsyncStorage.getItem(storageKey).then(value=>{if(alive&&value!==null){const number=Number(value);if(Number.isFinite(number)&&number>=0&&number<=1)position.current=number;}}).catch(()=>{}).finally(()=>{if(alive)setLoaded(true);});
  return()=>{alive=false;if(saveTimer.current)clearTimeout(saveTimer.current);if(started.current&&position.current!==null)AsyncStorage.setItem(storageKey,String(position.current)).catch(()=>{});};
 },[storageKey]);
 useEffect(()=>{
  if(!loaded||!geometry)return;
  const focus=journeyFocus(state.discovered,state.deliveries,state.finalClaimed);
  const x=journeyOffset(geometry,viewport.width,focus,position.current);
  position.current=x/geometry.worldWidth;started.current=true;
  scroll.current?.scrollTo({x,animated:false});setReady(true);
 },[loaded,geometry,viewport.width]);
 const save=()=>{if(!started.current||position.current===null)return;if(saveTimer.current)clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>AsyncStorage.setItem(storageKey,String(position.current)).catch(()=>{}),250);};
 const previous=adjacentJourneyRegion(maps,map.index,-1),next=adjacentJourneyRegion(maps,map.index,1),compact=viewport.height<460;
 const fogTone=fogTones[map.index],feather=Math.min(180,Math.max(140,viewport.width*.44));
 return <View testID="expedition-journey" style={s.viewport} onLayout={({nativeEvent:{layout:{width,height}}})=>setViewport(old=>old.width===width&&old.height===height?old:{width,height})}>
  {geometry&&<ScrollView testID="journey-scroll" ref={scroll} horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" style={{flex:1,opacity:ready?1:0}} contentContainerStyle={{width:geometry.contentWidth,height:viewport.height}} scrollEventThrottle={80} onScroll={event=>{if(started.current)position.current=Math.max(0,event.nativeEvent.contentOffset.x)/geometry.worldWidth;}} onScrollEndDrag={save} onMomentumScrollEnd={save}>
   <View style={{width:geometry.contentWidth,height:viewport.height,overflow:'hidden'}}>
    <Image testID="journey-panorama" accessible={false} importantForAccessibility="no" source={route.image} resizeMode="cover" style={{position:'absolute',left:0,top:geometry.imageTop,width:geometry.worldWidth,height:geometry.imageHeight}}/>
    {geometry.fogStart<geometry.worldWidth&&<View testID="journey-fog" pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={{position:'absolute',left:geometry.fogStart,top:0,bottom:0,width:geometry.worldWidth-geometry.fogStart,backgroundColor:fogTone}}>
     {/* Alpha feathers only into known terrain; the solid backing still conceals every locked landmark. */}
     <Image testID="journey-fog-edge" source={fogTexture} accessible={false} resizeMode="stretch" style={{position:'absolute',left:-feather*.85,top:0,width:feather,height:viewport.height,tintColor:fogTone}}/>
     <Image source={fogTexture} accessible={false} resizeMode="stretch" style={{position:'absolute',left:0,top:0,width:viewport.width*.9,height:viewport.height,opacity:.24}}/>
     <View style={{position:'absolute',left:10,width:96,top:viewport.height*.46,alignItems:'center',gap:8,opacity:.72}}><Icon name="expedition" size={24} color="#858B80"/><Text style={s.unknown}>Unbekanntes Land</Text></View>
    </View>}
    {geometry.visible.map(index=>{
     const location=route.places[index],anchor=geometry.anchors[index],isFinal=index===7;
     const complete=isFinal?state.finalClaimed:state.deliveries[index];
     const mission=missions.find(m=>isFinal?m.kind==='final':m.kind==='delivery'&&m.place===index);
     const status=complete?'Abgeschlossen':mission?.status==='completed'?'Bonus bereit':mission?.status==='active'?'Unterwegs':index===state.discovered?'Erkunden':isFinal?'Handelsplatz':'Bonuslieferung';
     const width=Math.max(126,Math.min(180,location.name.length*6.2+42)),artHeight=geometry.imageHeight*.19;
     const top=Math.max(66,anchor.y-artHeight*.56),signY=anchor.y+artHeight*.44;
     return <Pressable key={index} testID={`journey-place-${index}`} accessibilityRole="button" accessibilityLabel={`${t(location.name)}, ${t(status)}`} accessibilityHint={t('Ort öffnen')} onPress={()=>onPlace(isFinal?'endless':index)} style={({pressed})=>[s.place,{left:Math.max(0,Math.min(geometry.worldWidth-width,anchor.x-width/2)),top,width,paddingTop:Math.max(44,signY-top),paddingBottom:compact?8:14,opacity:pressed?.8:1}]}>
      <View testID={`journey-sign-${index}`} style={[s.sign,index===state.discovered&&!complete&&s.signNext]}>
       <Text style={s.number}>{String(index+1).padStart(2,'0')}</Text>
       <Text numberOfLines={2} style={[s.name,compact&&{fontSize:11,lineHeight:14}]}>{location.name}</Text>
       {(complete||mission)&&<View style={s.status}><Icon name={complete?'check':mission.status==='completed'?'reward':'timer'} size={12} color={C.brassLight}/></View>}
      </View>
     </Pressable>;
    })}
   </View>
  </ScrollView>}
  <View pointerEvents="none" style={s.heading}><View style={s.titleWash}/><Text numberOfLines={1} style={s.title}>{identity.title}</Text></View>
  <View pointerEvents="box-none" style={s.navigation}>
   {previous===null?<View pointerEvents="none" style={s.arrowSpacer}/>:<Pressable testID="previous-region" accessibilityRole="button" accessibilityLabel={t('Vorherige Expeditionsregion')} onPress={()=>onRegion(previous)} style={({pressed})=>[s.arrow,pressed&&{opacity:.7}]}><View style={s.arrowDisc}><Icon name="back" size={21} color="#595A4B"/></View></Pressable>}
   {next===null?<View pointerEvents="none" style={s.arrowSpacer}/>:<Pressable testID="next-region" accessibilityRole="button" accessibilityLabel={t('Nächste Expeditionsregion')} onPress={()=>onRegion(next)} style={({pressed})=>[s.arrow,pressed&&{opacity:.7}]}><View style={s.arrowDisc}><Icon name="chevron" size={21} color="#595A4B"/></View></Pressable>}
  </View>
 </View>;
}
const s=StyleSheet.create({
 viewport:{flex:1,backgroundColor:'#D9D2C0',overflow:'hidden'},
 heading:{position:'absolute',top:17,alignSelf:'center',maxWidth:'82%',paddingHorizontal:14,paddingVertical:6},
 titleWash:{position:'absolute',left:-4,right:-4,top:0,bottom:0,borderRadius:40,backgroundColor:'rgba(245,237,219,.60)',boxShadow:'0px 0px 16px 12px rgba(245,237,219,.50)'},
 title:{fontFamily:displayFont,fontSize:18,lineHeight:24,fontWeight:'400',color:'#34423C',textShadowColor:'rgba(249,245,232,.75)',textShadowOffset:{width:0,height:0},textShadowRadius:3},
 place:{position:'absolute',alignItems:'center',paddingBottom:14},
 sign:{minHeight:38,width:'100%',flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:9,paddingVertical:5,backgroundColor:'rgba(36,61,64,.94)',borderWidth:1,borderColor:C.brass,borderRadius:7,boxShadow:'0px 2px 6px rgba(14,28,29,.34)'},
 signNext:{borderColor:C.brassLight,borderWidth:2},
 number:{fontFamily:displayFont,fontSize:11,lineHeight:15,fontWeight:'700',color:C.brassLight},
 name:{flex:1,fontFamily:displayFont,fontSize:12,lineHeight:16,fontWeight:'600',textAlign:'left',color:C.onInk},
 status:{width:20,height:20,borderWidth:1,borderColor:'rgba(225,201,143,.55)',backgroundColor:'rgba(225,201,143,.12)',borderRadius:10,alignItems:'center',justifyContent:'center'},
 navigation:{position:'absolute',left:12,right:12,bottom:10,flexDirection:'row',justifyContent:'space-between'},
 arrow:{width:48,height:48,alignItems:'center',justifyContent:'center'},arrowSpacer:{width:48,height:48},
 arrowDisc:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(245,236,214,.54)',boxShadow:'0px 1px 7px rgba(35,32,24,.10)'},
 unknown:{fontFamily:displayFont,fontSize:11,lineHeight:15,textAlign:'center',color:'#858B80'},
});
