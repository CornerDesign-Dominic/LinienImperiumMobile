import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Pill} from './ui';
// Price ideas only. Purchase fulfillment and interaction with company upgrades are undecided.
const IDEAS=[
 {id:'offers',title:'+1 Standardauftrag',detail:'Mehr Platz in der Auftragsliste',limit:10,price:'2,99 €'},
 {id:'pins',title:'+1 Auftrag festhalten',detail:'Mehr Angebote dauerhaft halten',limit:4,price:'3,99 €'}
];
export function Wholesaler(){
 return <><Row><Pill>Preisideen</Pill></Row>{IDEAS.map(idea=><Card key={idea.id} style={s.card}>
  <View style={s.row}><View style={{flex:1}}><Txt style={s.title}>{idea.title}</Txt><Txt muted style={s.small}>{idea.detail}</Txt><Txt muted style={s.small}>Bis zu {idea.limit}×</Txt></View><View style={{alignItems:'flex-end'}}><Txt gold style={s.price}>{idea.price}</Txt><Txt muted style={s.small}>je Kauf</Txt></View></View>
 </Card>)}</>;
}
const s=StyleSheet.create({card:{padding:12,backgroundColor:'#192534',borderColor:'#3B506A'},row:{flexDirection:'row',alignItems:'center',gap:12},title:{fontSize:14,fontWeight:'700'},small:{fontSize:11,lineHeight:17,marginTop:3},price:{fontSize:17,fontWeight:'700'}});
