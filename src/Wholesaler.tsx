import React from 'react';
import {t as translate} from './i18n';
import {View,Pressable,StyleSheet} from 'react-native';
import {LocationArt} from './LocationArt';
import {Icon} from './Icon';
import {C,Txt,Card,Row,Pill} from './ui';
// Other shop entries remain price ideas; region gifts use the test coin price.
const IDEAS:{id:string;title:string;detail:string;limit?:number;price:string;priceNote?:string}[]=[
 {id:'offers',title:'+1 Standardauftrag',detail:'Mehr Platz in der Auftragsliste',limit:10,price:'2,99 €'},
 {id:'pins',title:'+1 Auftrag festhalten',detail:'Mehr Angebote dauerhaft halten',limit:4,price:'3,99 €'},
 {id:'coins',title:'Echtgeld-Münzen',detail:'Menge X',price:'Preis offen'},
 {id:'vehicle-crate',title:'Fahrzeugkartenkiste',detail:'',price:'X',priceNote:'Echtgeld-Münzen'}
];
export function Wholesaler({onGifts}:{onGifts:()=>void}){
 return <><View style={{alignItems:'center',marginBottom:12}}><LocationArt name="wholesaler" width={138}/></View><Pressable accessibilityRole="button" accessibilityLabel={translate('Geschenke')} onPress={onGifts}><Card style={s.card}><View style={s.row}><Icon name="reward" size={28} color={C.gold}/><Txt style={[s.title,{flex:1}]}>Geschenke</Txt><Icon name="chevron" size={17} color={C.gold}/></View></Card></Pressable><Row><Pill>Preisideen</Pill></Row>{IDEAS.map(idea=><Card key={idea.id} style={s.card}>
  <View style={s.row}><Icon name={idea.id==='coins'?'coin':idea.id==='vehicle-crate'?'reward':'orders'} size={28} color={C.gold}/><View style={{flex:1}}><Txt style={s.title}>{idea.title}</Txt>{!!idea.detail&&<Txt muted style={s.small}>{idea.detail}</Txt>}{idea.limit!==undefined&&<Txt muted style={s.small}>Bis zu {idea.limit}×</Txt>}</View><View style={{alignItems:'flex-end'}}><Txt gold style={s.price}>{idea.price}</Txt>{(idea.priceNote||idea.limit!==undefined)&&<Txt muted style={s.small}>{idea.priceNote??'je Kauf'}</Txt>}</View></View>
 </Card>)}</>;
}
const s=StyleSheet.create({card:{padding:12,backgroundColor:C.panel,borderColor:C.line},row:{flexDirection:'row',alignItems:'center',gap:12},title:{fontSize:14,fontWeight:'700'},small:{fontSize:11,lineHeight:17,marginTop:3},price:{fontSize:17,fontWeight:'700'}});
