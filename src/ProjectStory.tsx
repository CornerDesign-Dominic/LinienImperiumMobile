import React from 'react';
import {Image,View,StyleSheet,ImageSourcePropType} from 'react-native';
import {C,Txt} from './ui';
import {displayFont} from './theme';
import {t} from './i18n';
import {projectStory,StoryRegion} from './projectNarrative';
const art:Record<StoryRegion,ImageSourcePropType[]>={
 crownlands:[require('../assets/art/project-stories/crownlands/stage-0.jpg'),require('../assets/art/project-stories/crownlands/stage-1.jpg'),require('../assets/art/project-stories/crownlands/stage-2.jpg'),require('../assets/art/project-stories/crownlands/stage-3.jpg'),require('../assets/art/project-stories/crownlands/stage-4.jpg'),require('../assets/art/project-stories/crownlands/stage-5.jpg')],
 plains:[require('../assets/art/project-stories/plains/stage-0.jpg'),require('../assets/art/project-stories/plains/stage-1.jpg'),require('../assets/art/project-stories/plains/stage-2.jpg'),require('../assets/art/project-stories/plains/stage-3.jpg'),require('../assets/art/project-stories/plains/stage-4.jpg'),require('../assets/art/project-stories/plains/stage-5.jpg')],
 saffron:[require('../assets/art/project-stories/saffron/stage-0.jpg'),require('../assets/art/project-stories/saffron/stage-1.jpg'),require('../assets/art/project-stories/saffron/stage-2.jpg'),require('../assets/art/project-stories/saffron/stage-3.jpg'),require('../assets/art/project-stories/saffron/stage-4.jpg'),require('../assets/art/project-stories/saffron/stage-5.jpg')],
 jade:[require('../assets/art/project-stories/jade/stage-0.jpg'),require('../assets/art/project-stories/jade/stage-1.jpg'),require('../assets/art/project-stories/jade/stage-2.jpg'),require('../assets/art/project-stories/jade/stage-3.jpg'),require('../assets/art/project-stories/jade/stage-4.jpg'),require('../assets/art/project-stories/jade/stage-5.jpg')],
 north:[require('../assets/art/project-stories/north/stage-0.jpg'),require('../assets/art/project-stories/north/stage-1.jpg'),require('../assets/art/project-stories/north/stage-2.jpg'),require('../assets/art/project-stories/north/stage-3.jpg'),require('../assets/art/project-stories/north/stage-4.jpg'),require('../assets/art/project-stories/north/stage-5.jpg')],
};
const descriptions:Record<StoryRegion,string[]>={
 crownlands:['Goldschmied bei der Arbeit','Schmuck wird verpackt und bewacht verladen','Bewachte Fahrt durch das Flusstal','Ankunft am Stadttor','Die Schatulle erreicht das Handelshaus'],
 plains:['Webwaren entstehen in der Werkstatt','Webwaren werden auf den Wagen geladen','Der Wagenzug überquert die Flussfurt','Ankunft am Handelsposten','Stoffballen werden zum Handelshaus getragen'],
 saffron:['Kostbare Essenzen werden hergestellt','Flakons werden für die Karawane verpackt','Die Karawane zieht durch den Gebirgspass','Ankunft an der Karawanserei','Die Waren erreichen den Händlerhof'],
 jade:['Jade wird in der Werkstatt bearbeitet','Jadewaren werden auf das Schiff verladen','Das Frachtschiff fährt durch die Reisfelder','Ankunft in der Handelsstadt','Die Jadekiste erreicht den Handelshof'],
 north:['Bernstein wird in der Werkstatt geschnitzt','Bernsteinwaren werden auf den Schlitten verladen','Der Schlittenzug durchquert den Winterwald','Ankunft an der Handelsfeste','Die Waren erreichen das warme Kontor']
};
export function ProjectStory({order}:any){
 const story=projectStory(order);
 if(!story)return null;
 const label=story.receipt?t('Lieferung bestätigt'):t(descriptions[story.region][story.stage]);
 return <View style={s.panel} accessible accessibilityLabel={label}>
  <Image source={art[story.region][story.stage]} resizeMode="contain" style={s.image} accessible={false}/>
  {story.receipt&&<View pointerEvents="none" style={s.receipt}><Txt style={s.receiptTitle}>Lieferung bestätigt</Txt><Txt style={s.customer}>{order.customerName||story.customer}</Txt></View>}
 </View>;
}
const s=StyleSheet.create({panel:{width:'100%',aspectRatio:3/2,position:'relative',overflow:'hidden',borderRadius:8,backgroundColor:C.panel},image:{width:'100%',height:'100%'},receipt:{position:'absolute',left:'24%',right:'24%',top:'30%',bottom:'38%',alignItems:'center',justifyContent:'center',gap:6},receiptTitle:{fontFamily:displayFont,fontSize:18,lineHeight:24,fontWeight:'400',fontStyle:'italic',textAlign:'center',color:'#796348'},customer:{fontFamily:displayFont,fontSize:12,lineHeight:17,fontWeight:'400',textAlign:'center',color:'#796348'}});
