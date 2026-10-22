import React,{useState} from 'react';
import {Image,View,Text,StyleSheet,StyleProp,ViewStyle} from 'react-native';
import {Icon} from './Icon';
import {C} from './ui';
import {rarityColor} from './items';
import {t} from './i18n';
const artwork:Record<string,any>={
 'donkey-cart':require('../assets/art/vehicles/donkey-cart.jpg'),
 'royal-lion-team':require('../assets/art/vehicles/royal-lion-team.jpg'),
 'imperial-panda-team':require('../assets/art/vehicles/imperial-panda-team.jpg'),
 'market-team':require('../assets/art/vehicles/market-team.jpg'),
 'royal-mail-coach':require('../assets/art/vehicles/royal-mail-coach.jpg'),
 'silver-stag-team':require('../assets/art/vehicles/silver-stag-team.jpg'),
 'settler-wagon':require('../assets/art/vehicles/settler-wagon.jpg'),
 'ox-freight-wagon':require('../assets/art/vehicles/ox-freight-wagon.jpg'),
 'prairie-freight-train':require('../assets/art/vehicles/prairie-freight-train.jpg'),
 'pioneer-lead-wagon':require('../assets/art/vehicles/pioneer-lead-wagon.jpg'),
 'thunder-bison-team':require('../assets/art/vehicles/thunder-bison-team.jpg'),
 'pack-donkey-train':require('../assets/art/vehicles/pack-donkey-train.jpg'),
 'desert-camel':require('../assets/art/vehicles/desert-camel.jpg'),
 'oasis-caravan':require('../assets/art/vehicles/oasis-caravan.jpg'),
 'silver-caravan':require('../assets/art/vehicles/silver-caravan.jpg'),
 'dune-runner-caravan':require('../assets/art/vehicles/dune-runner-caravan.jpg'),
 'bamboo-handcart':require('../assets/art/vehicles/bamboo-handcart.jpg'),
 'tea-mule-team':require('../assets/art/vehicles/tea-mule-team.jpg'),
 'terrace-ox-wagon':require('../assets/art/vehicles/terrace-ox-wagon.jpg'),
 'jade-scout-team':require('../assets/art/vehicles/jade-scout-team.jpg'),
 'fisher-dog-sled':require('../assets/art/vehicles/fisher-dog-sled.jpg'),
 'reindeer-freight-sled':require('../assets/art/vehicles/reindeer-freight-sled.jpg'),
 'northern-freight-team':require('../assets/art/vehicles/northern-freight-team.jpg'),
 'white-stag-sled':require('../assets/art/vehicles/white-stag-sled.jpg'),
 'snow-leopard-express':require('../assets/art/vehicles/snow-leopard-express.jpg'),

};
// All decoration is native UI geometry; no frame bitmaps or extra assets.
const frames:Record<string,{base:string;edge:string;light:string;label:string;tier:number}>={
 common:{base:'#575950',edge:'#303A36',light:'#B9B8A6',label:'Common',tier:1},
 uncommon:{base:'#31613D',edge:'#183E29',light:'#B9D0A0',label:'Uncommon',tier:2},
 rare:{base:'#245C88',edge:'#17374D',light:'#D3E0E4',label:'Rare',tier:3},
 epic:{base:'#713780',edge:'#36213E',light:'#E0BCDF',label:'Epic',tier:4},
 legendary:{base:'#A57824',edge:'#543B17',light:'#F4DEA0',label:'Legendary',tier:5},
};
type Props={card?:{artKey?:string;name?:string;rarity?:string};level?:number;style?:StyleProp<ViewStyle>};
export function VehicleArt({card,level,style}:Props){
 const [width,setWidth]=useState(80);
 const source=artwork[card?.artKey||''],frame=frames[card?.rarity||'common']||frames.common;
 const compact=width<110,unit=Math.max(1,Math.min(3,width/65));
 const rim=compact?4:7,rail=compact?8:19,corner=compact?8:15;
 return <View accessible accessibilityRole="image" accessibilityLabel={`${t(card?.name||'Fahrzeug')} · ${t(frame.label)}${level?` · ${t('Stufe')} ${level}`:''}`} onLayout={event=>setWidth(event.nativeEvent.layout.width)} style={[styles.art,style,{padding:rim,paddingBottom:rail+rim,backgroundColor:frame.base,borderColor:frame.edge,borderWidth:2,borderRadius:frame.tier>=4?12:frame.tier===3?7:4}]}>
  <View style={[styles.window,{borderColor:frame.light,borderWidth:Math.max(1,unit*.6)}]}>
   {source?<Image accessible={false} source={source} resizeMode="cover" style={styles.image}/>:<Icon name="truck" size={24} color={rarityColor(card?.rarity||'common')}/>}
  </View>
  <View pointerEvents="none" style={[StyleSheet.absoluteFill,{borderWidth:1,borderTopColor:frame.light,borderLeftColor:frame.light,borderRightColor:frame.edge,borderBottomColor:frame.edge,borderRadius:frame.tier>=4?10:3}]} />
  {frame.tier>=2&&[0,1,2,3].map(i=><View pointerEvents="none" key={i} style={{position:'absolute',width:corner,height:corner,...(i<2?{top:1}:{bottom:rail+1}),...(i%2?{right:1}:{left:1}),borderColor:frame.light,borderTopWidth:i<2?unit:0,borderBottomWidth:i>=2?unit:0,borderLeftWidth:i%2?0:unit,borderRightWidth:i%2?unit:0,backgroundColor:frame.tier>=4?frame.base:'transparent',borderRadius:frame.tier>=4?3:0}}/>)}
  <View pointerEvents="none" style={[styles.rail,{height:rail,bottom:1,gap:compact?3:5}]}>
   {Array.from({length:frame.tier},(_,i)=><View key={i} style={{width:compact?3:5,height:compact?3:5,backgroundColor:frame.light,transform:[{rotate:'45deg'}]}}/>)}
   {!compact&&<Text maxFontSizeMultiplier={1.2} style={[styles.rarity,{color:frame.light}]}>{t(frame.label)}</Text>}
  </View>
  {!!level&&!compact&&<View style={[styles.level,{backgroundColor:frame.edge,borderColor:frame.light}]}><Text maxFontSizeMultiplier={1.2} style={styles.levelText}>{t('Stufe')} {level}</Text></View>}
 </View>;
}
const styles=StyleSheet.create({
 art:{width:'100%',aspectRatio:1,flexShrink:0,alignItems:'center',justifyContent:'center'},
 window:{width:'100%',flex:1,overflow:'hidden',backgroundColor:C.raised,alignItems:'center',justifyContent:'center',borderRadius:2},image:{width:'100%',height:'100%'},
 rail:{position:'absolute',left:3,right:3,flexDirection:'row',alignItems:'center',justifyContent:'center'},rarity:{fontSize:9,fontWeight:'700',letterSpacing:.5},
 level:{position:'absolute',right:9,top:9,borderWidth:1,borderRadius:3,paddingHorizontal:5,paddingVertical:2},levelText:{color:'#F4EBD8',fontSize:10,fontWeight:'700'},
});
