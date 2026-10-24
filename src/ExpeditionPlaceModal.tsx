import {ItemArt,ItemAmount} from './ItemArt';
import React,{useState} from 'react';
import {Image,ImageSourcePropType,Modal,Pressable,ScrollView,StyleSheet,View} from 'react-native';
import {Text} from './Language';
import {t} from './i18n';
import {Icon,IconName} from './Icon';
import {C,displayFont} from './theme';
export function PlacePortrait({source}:{source:ImageSourcePropType}){
 const [width,setWidth]=useState(0),height=width?Math.round(width*.60):176;
 return <View testID="place-portrait" style={[s.portrait,{height}]} onLayout={({nativeEvent:{layout:{width:next}}})=>setWidth(old=>old===next?old:next)}>{width>0&&<Image testID="place-portrait-image" source={source} accessible={false} importantForAccessibility="no" resizeMode="cover" style={{position:'absolute',left:0,top:0,width,height}}/>}</View>;
}
type Props={visible:boolean;title:string;region?:string;image?:ImageSourcePropType;onClose:()=>void;children:React.ReactNode};
export function ExpeditionPlaceModal({visible,title,region,image,onClose,children}:Props){
 if(!visible)return null;
 return <Modal visible transparent animationType="none" onRequestClose={onClose}><View style={s.overlay}><View testID="place-modal" style={s.modal}>
  <ScrollView testID="place-modal-scroll" style={{flexShrink:1}} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:6}}>
   {image&&<PlacePortrait source={image}/>}
   <View style={s.content}><View style={[s.heading,!image&&{paddingRight:40}]}>{region&&<Text style={s.region}>{region}</Text>}<Text testID="place-modal-title" style={s.title}>{title}</Text></View>{children}</View>
  </ScrollView>
  <Pressable testID="place-modal-close" accessibilityRole="button" accessibilityLabel={t('Schließen')} onPress={onClose} style={({pressed})=>[s.close,pressed&&{opacity:.78}]}><Icon name="close" size={20} color={C.text}/></Pressable>
 </View></View></Modal>;
}
export function PlaceStatus({icon,children}:{icon:IconName;children:React.ReactNode}){return <View style={s.status}><Icon name={icon} size={15} color={C.accent}/><Text style={s.statusText}>{children}</Text></View>;}
export function PlaceRewards({items,received=false}:{items:{icon:IconName;itemId?:string;label:string;amount:string}[];received?:boolean}){
 if(!items.length)return null;
 return <View style={s.rewards}><Text style={s.rewardLabel}>{received?'Belohnung erhalten':'Belohnung'}</Text><View style={s.rewardIcons}>{items.map((item,i)=><View key={i} accessible accessibilityLabel={`${t(item.label)} ${item.amount}`} style={s.reward}>{item.itemId?<ItemArt id={item.itemId} size={36}/>:<Icon name={item.icon} size={23} color={C.gold}/>}<Text literal style={s.rewardAmount}>{item.amount}</Text></View>)}</View></View>;
}
export function PlaceExtraDetails({children}:{children:React.ReactNode}){
 const [open,setOpen]=useState(false);
 return <View style={s.details}><Pressable accessibilityRole="button" accessibilityLabel={t('Details zum Ort')} accessibilityState={{expanded:open}} onPress={()=>setOpen(value=>!value)} style={s.detailsToggle}><Text style={s.detailsLabel}>Details</Text><Icon name="chevron" size={15} color={C.muted} style={{transform:[{rotate:open?'90deg':'0deg'}]}}/></Pressable>{open&&<View style={s.detailsContent}>{children}</View>}</View>;
}
const s=StyleSheet.create({
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',alignItems:'center',padding:16},modal:{width:'100%',maxWidth:460,maxHeight:'90%',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,overflow:'hidden'},
 portrait:{width:'100%',backgroundColor:C.raised,overflow:'hidden'},content:{paddingHorizontal:16,paddingTop:12,paddingBottom:8},heading:{marginBottom:12},region:{fontSize:10,lineHeight:15,letterSpacing:.8,color:C.muted,marginBottom:3},title:{fontFamily:displayFont,fontSize:23,lineHeight:29,fontWeight:'600',color:C.text},
 close:{position:'absolute',top:8,right:8,width:44,height:44,borderRadius:22,backgroundColor:'rgba(246,238,218,.91)',alignItems:'center',justifyContent:'center',boxShadow:'0px 1px 4px rgba(29,34,28,.12)'},status:{flexDirection:'row',alignItems:'center',gap:6,marginBottom:9},statusText:{fontSize:12,lineHeight:18,color:C.accent,fontWeight:'600'},
 rewards:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,paddingVertical:8,marginBottom:4},rewardLabel:{fontSize:11,lineHeight:17,color:C.muted,flexShrink:1},rewardIcons:{flexDirection:'row',gap:9,flexWrap:'wrap',justifyContent:'flex-end'},reward:{flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:7,paddingVertical:5,borderWidth:1,borderColor:C.line,borderRadius:5,backgroundColor:C.raised},rewardAmount:{fontSize:12,lineHeight:18,fontWeight:'700',color:C.gold},
 details:{borderTopWidth:1,borderTopColor:C.line,marginTop:12},detailsToggle:{minHeight:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},detailsLabel:{fontSize:11,lineHeight:17,color:C.muted},detailsContent:{paddingBottom:6,gap:8}
});
