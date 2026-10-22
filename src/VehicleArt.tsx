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
// Shared native faceted setting: no frame images, rarity icons or footer bars.
const frames:Record<string,{light:string;metal:string;shade:string;label:string}>={
 common:{light:'#C9C5B7',metal:'#73776E',shade:'#454C43',label:'Common'},
 uncommon:{light:'#C6D6A5',metal:'#527B58',shade:'#315B3E',label:'Uncommon'},
 rare:{light:'#D2E4EE',metal:'#4C86AD',shade:'#315F82',label:'Rare'},
 epic:{light:'#E3CCED',metal:'#9068A6',shade:'#654273',label:'Epic'},
 legendary:{light:'#F4DEA0',metal:'#B88D3D',shade:'#82601F',label:'Legendary'},
};
type Props={card?:{artKey?:string;name?:string;rarity?:string};level?:number;style?:StyleProp<ViewStyle>};
// Intersect a square with a larger rotated square to clip an octagon on native
// and web alike. Counter-rotate the contents so the artwork stays upright.
function FacetCrop({size,inset=0,children}: {size:number;inset?:number;children:React.ReactNode}){
 const diagonal=Math.SQRT2*size*.9,offset=(size-diagonal)/2;
 return <View style={{position:'absolute',left:inset,top:inset,width:size,height:size,overflow:'hidden'}}>
  <View style={{position:'absolute',width:diagonal,height:diagonal,left:offset,top:offset,overflow:'hidden',transform:[{rotate:'45deg'}]}}>
   <View style={{position:'absolute',width:size,height:size,left:-offset,top:-offset,transform:[{rotate:'-45deg'}]}}>{children}</View>
  </View>
 </View>;
}
export function VehicleArt({card,level,style}:Props){
 // Wait for the actual card layout before mounting the image: the detail view
 // must not start with an 80-point thumbnail decode. Large images use hardware
 // scaling rather than Android's automatic software resize for local files.
 const [width,setWidth]=useState(0);
 const source=artwork[card?.artKey||''],frame=frames[card?.rarity||'common']||frames.common;
 const compact=width<110,precious=card?.rarity==='epic'||card?.rarity==='legendary';
 // No heavy dark outline: the metal itself forms the fine, coloured edge.
 const rim=Math.max(2,Math.min(6,width*.035))+(precious&&!compact?1:0);
 const inner=Math.max(1,width-2*rim);
 return <View accessible accessibilityRole="image" accessibilityLabel={`${t(card?.name||'Fahrzeug')} · ${t(frame.label)}${level?` · ${t('Stufe')} ${level}`:''}`} onLayout={event=>setWidth(event.nativeEvent.layout.width)} style={[styles.art,style]}>
  {width>0&&<FacetCrop size={width}>
   <View style={[StyleSheet.absoluteFill,{backgroundColor:frame.metal,backgroundImage:`linear-gradient(135deg, ${frame.light} 0%, ${frame.metal} 27%, ${frame.shade} 55%, ${frame.metal} 85%, ${frame.light} 100%)`}]}/>
   <FacetCrop size={inner} inset={rim}>
    <View style={styles.window}>{source?<Image accessible={false} key={Math.round(inner)} source={source} resizeMode="cover" resizeMethod={compact?'auto':'scale'} style={styles.image}/>:<Icon name="truck" size={24} color={rarityColor(card?.rarity||'common')}/>}</View>
   </FacetCrop>
   {!!level&&!compact&&<View style={[styles.level,{top:rim+5,right:rim+5,backgroundColor:frame.shade,borderColor:frame.light}]}><Text maxFontSizeMultiplier={1.2} style={styles.levelText}>{t('Stufe')} {level}</Text></View>}
  </FacetCrop>}
 </View>;
}
const styles=StyleSheet.create({
 art:{width:'100%',aspectRatio:1,flexShrink:0},
 window:{width:'100%',height:'100%',overflow:'hidden',backgroundColor:C.raised,alignItems:'center',justifyContent:'center'},image:{width:'100%',height:'100%'},
 level:{position:'absolute',borderWidth:StyleSheet.hairlineWidth,borderRadius:3,paddingHorizontal:5,paddingVertical:2},levelText:{color:'#F4EBD8',fontSize:10,fontWeight:'700'},
});
