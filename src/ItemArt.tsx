import React from 'react';
import {Image,View,Text,StyleSheet,StyleProp,ViewStyle} from 'react-native';
import {Icon,stockIcon} from './Icon';
import {itemVisual,itemColors,romanTier,ItemOptions} from './itemVisual';
import {t} from './i18n';
import {itemName} from './items';
import {n,Txt} from './ui';
import {itemAssets,sealAssets} from './itemAssets';

type Props=ItemOptions&{id:string;size?:number;style?:StyleProp<ViewStyle>;framed?:boolean;label?:string};
/** A shared illustration, technical rarity wash/frame and optional rank overlay. */
export function ItemArt({id,size=44,style,framed=true,label,...options}:Props){
 const visual=itemVisual(id,options),source=visual&&itemAssets[visual.asset];
 const color=visual?.rarity?itemColors[visual.rarity]:'#8B8378',numeral=romanTier(visual?.tier);
 return <View testID={`item-art-${id}`} accessible={!!label} accessibilityLabel={label?t(label):undefined} accessibilityElementsHidden={!label} importantForAccessibility={label?'yes':'no-hide-descendants'} style={[s.tile,{width:size,height:size,borderRadius:Math.max(3,size*.1)},framed?{borderWidth:size>=48?1.5:1,borderColor:'#191B1B',backgroundColor:'#242A2D'}:{backgroundColor:'transparent'},style]}>
  {framed&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{backgroundColor:color,opacity:.24}]}/>}
  {source?<Image source={source} accessible={false} resizeMode="contain" fadeDuration={0} style={{width:'94%',height:'94%'}}/>:<Icon name={stockIcon(id)} size={size*.65} color={color}/>}
  {visual?.kind&&source&&<View testID="item-type-badge" pointerEvents="none" style={s.typeBadge}><Image source={sealAssets[visual.kind]} accessible={false} resizeMode="contain" style={{width:'78%',height:'78%',tintColor:'#FFF3D8'}}/></View>}
  {!!numeral&&<Text allowFontScaling={false} style={[s.rank,{fontSize:Math.max(9,size*.2),lineHeight:Math.max(11,size*.24),paddingHorizontal:Math.max(2,size*.04)}]}>{numeral}</Text>}
 </View>;
}
export function ItemAmount({id,amount,label,...options}:Props&{amount:number;label?:string}){
 return <View style={s.amountRow}><ItemArt id={id} {...options}/><View style={{flex:1,minWidth:0}}><Txt style={{fontSize:12}}>{label||itemName(id,amount)}</Txt></View><Txt style={{fontSize:13,fontWeight:'700'}}>{n(amount)}</Txt></View>;
}
const s=StyleSheet.create({tile:{flexShrink:0,overflow:'hidden',alignItems:'center',justifyContent:'center'},typeBadge:{position:'absolute',top:1,left:1,width:'34%',height:'34%',backgroundColor:'rgba(14,18,21,.94)',borderWidth:1,borderColor:'rgba(255,243,216,.35)',borderRadius:3,alignItems:'center',justifyContent:'center'},rank:{position:'absolute',bottom:1,right:1,color:'#FFF3D8',backgroundColor:'rgba(14,18,21,.88)',fontWeight:'800',borderRadius:2,textAlign:'center'},amountRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8}});
