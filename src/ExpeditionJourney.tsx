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
 return <View testID="expedition-journey" style={s.viewport} onLayout={({nativeEvent:{layout:{width,height}}})=>setViewport(old=>old.width===width&&old.height===height?old:{width,height})}>
  {geometry&&<ScrollView testID="journey-scroll" ref={scroll} horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" style={{flex:1,opacity:ready?1:0}} contentContainerStyle={{width:geometry.contentWidth,height:viewport.height}} scrollEventThrottle={80} onScroll={event=>{if(started.current)position.current=Math.max(0,event.nativeEvent.contentOffset.x)/geometry.worldWidth;}} onScrollEndDrag={save} onMomentumScrollEnd={save}>
   <View style={{width:geometry.contentWidth,height:viewport.height,overflow:'hidden'}}>
    <Image testID="journey-panorama" accessible={false} importantForAccessibility="no" source={route.image} resizeMode="cover" style={{position:'absolute',left:0,top:geometry.imageTop,width:geometry.worldWidth,height:geometry.imageHeight}}/>
    {geometry.visible.map(index=>{
     const location=route.places[index],anchor=geometry.anchors[index],isFinal=index===7;
     const complete=isFinal?state.finalClaimed:state.deliveries[index];
     const mission=missions.find(m=>isFinal?m.kind==='final':m.kind==='delivery'&&m.place===index);
     const status=complete?'Abgeschlossen':mission?.status==='completed'?'Bonus bereit':mission?.status==='active'?'Unterwegs':index===state.discovered?'Erkunden':isFinal?'Handelsplatz':'Bonuslieferung';
     const width=Math.max(138,Math.min(184,geometry.worldWidth*.095)),artHeight=geometry.imageHeight*.19;
     const top=Math.max(66,anchor.y-artHeight*.56),signY=anchor.y+artHeight*.44;
     return <Pressable key={index} testID={`journey-place-${index}`} accessibilityRole="button" accessibilityLabel={`${t(location.name)}, ${t(status)}`} accessibilityHint={t('Ort öffnen')} onPress={()=>onPlace(isFinal?'endless':index)} style={({pressed})=>[s.place,{left:anchor.x-width/2,top,width,paddingTop:Math.max(44,signY-top),paddingBottom:compact?8:14,opacity:pressed?.78:1}]}>
      <View testID={`journey-sign-${index}`} style={[s.sign,compact&&{minHeight:29,paddingVertical:3}]}>
       <View style={s.rivet}/><Text numberOfLines={2} style={[s.name,compact&&{fontSize:11,lineHeight:14}]}>{location.name}</Text><View style={s.rivet}/>
      </View>
      <View style={s.signPosts}><View style={s.post}/><View style={s.post}/></View>
      {(complete||mission)&&<View style={s.seal}><Icon name={complete?'check':mission.status==='completed'?'reward':'timer'} size={12} color="#514B3C"/></View>}
     </Pressable>;
    })}
    {geometry.fogStart<geometry.worldWidth&&<View testID="journey-fog" pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={{position:'absolute',left:geometry.fogStart,top:0,bottom:0,width:geometry.worldWidth-geometry.fogStart,backgroundColor:'#D9D2C0'}}>
     {Array.from({length:12},(_,i)=><View key={i} style={{position:'absolute',left:-(14+(i*17)%28),top:(i-1)*viewport.height/10,width:86,height:viewport.height/7+40,borderRadius:60,backgroundColor:'#D9D2C0',boxShadow:'-12px 0px 16px rgba(217,210,192,0.6)'}}/>)}
     <View style={{position:'absolute',left:8,width:96,top:viewport.height*.46,alignItems:'center',gap:8}}><Icon name="expedition" size={26} color="#817B6C"/><Text style={s.unknown}>Unbekanntes Land</Text></View>
    </View>}
   </View>
  </ScrollView>}
  <View pointerEvents="none" style={s.heading}><Text numberOfLines={1} style={s.title}>{identity.title}</Text></View>
  <View pointerEvents="box-none" style={s.navigation}>
   <Pressable testID="previous-region" accessibilityRole="button" accessibilityLabel={t('Vorherige Expeditionsregion')} accessibilityState={{disabled:previous===null}} disabled={previous===null} onPress={()=>{if(previous!==null)onRegion(previous);}} style={({pressed})=>[s.arrow,previous===null&&s.disabled,pressed&&previous!==null&&{opacity:.8}]}><Icon name="back" size={25} color="#4D493D"/></Pressable>
   <Pressable testID="next-region" accessibilityRole="button" accessibilityLabel={t('Nächste Expeditionsregion')} accessibilityState={{disabled:next===null}} disabled={next===null} onPress={()=>{if(next!==null)onRegion(next);}} style={({pressed})=>[s.arrow,next===null&&s.disabled,pressed&&next!==null&&{opacity:.8}]}><Icon name="chevron" size={25} color="#4D493D"/></Pressable>
  </View>
 </View>;
}
const s=StyleSheet.create({
 viewport:{flex:1,backgroundColor:'#D9D2C0',overflow:'hidden'},
 heading:{position:'absolute',top:14,alignSelf:'center',maxWidth:'82%',paddingHorizontal:20,paddingVertical:9,borderWidth:1,borderColor:'rgba(101,88,61,.45)',backgroundColor:'rgba(244,234,211,.88)',borderRadius:4,boxShadow:'0px 2px 6px rgba(40,35,26,.12)'},
 title:{fontFamily:displayFont,fontSize:21,lineHeight:27,fontWeight:'600',color:'#313F3A'},
 place:{position:'absolute',alignItems:'center',paddingBottom:14},
 sign:{minHeight:33,width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,paddingHorizontal:6,paddingVertical:5,backgroundColor:'rgba(240,225,193,.96)',borderWidth:1,borderBottomWidth:2,borderColor:'#837255',borderRadius:3,boxShadow:'0px 2px 3px rgba(38,32,23,.23)'},
 name:{flex:1,fontFamily:displayFont,fontSize:12,lineHeight:16,fontWeight:'600',textAlign:'center',color:'#3D3B2F'},
 rivet:{width:3,height:3,borderRadius:2,backgroundColor:'#847154'},signPosts:{width:'65%',flexDirection:'row',justifyContent:'space-between'},post:{width:4,height:9,backgroundColor:'#7F6D50'},
 seal:{position:'absolute',right:6,bottom:1,width:22,height:22,borderWidth:1,borderColor:'#8C7D5E',backgroundColor:'#E9DDBF',borderRadius:11,alignItems:'center',justifyContent:'center'},
 navigation:{position:'absolute',left:16,right:16,bottom:14,flexDirection:'row',justifyContent:'space-between'},
 arrow:{width:48,height:48,alignItems:'center',justifyContent:'center',borderWidth:1,borderBottomWidth:2,borderColor:'#8B7C61',borderRadius:6,backgroundColor:'rgba(242,231,206,.95)',boxShadow:'0px 2px 5px rgba(35,32,24,.15)'},disabled:{opacity:.42},
 unknown:{fontFamily:displayFont,fontSize:11,lineHeight:15,textAlign:'center',color:'#817B6C'},
});
