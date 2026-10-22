import React,{useState} from 'react';
import {View,StyleSheet} from 'react-native';
import {Txt,Row,n} from './ui';
import {C} from './theme';
import {AtlasHeading} from './Atlas';
import {ExpeditionRegionCard} from './ExpeditionRegionCard';
import {ExpeditionJourney} from './ExpeditionJourney';
import {ExpeditionPlaceModal} from './ExpeditionPlaceModal';
import {ExpeditionPlaceDetails} from './ExpeditionPlaceDetails';
import {portraitForPlace} from './placePortraits';
import {regionIdentities} from './regionIdentities';
import {regionRoutes} from './regionRoutes';
import {rarityColor} from './items';
export function Expeditions(props:any){
 const {data,region,onSelectRegion}=props;
 if(region===null)return <><AtlasHeading title="Reiseatlas" detail="Erschließe Regionen, entdecke Orte und gewinne Verbündete."/>{data.expeditionMap.map((map:any)=><ExpeditionRegionCard key={map.index} map={map} onOpen={onSelectRegion}/>)}</>;
 if(!data.expeditionMap[region]?.open||!regionRoutes[region])return null;
 return <OpenedExpedition key={region} {...props}/>;
}
function OpenedExpedition({data,region,onSelectRegion,busy,clock,onCommand,onMission,accountId,modalBlocked=false}:any){
 const [selected,setSelected]=useState<number|'endless'|null>(null),[chances,setChances]=useState(false);
 const map=data.expeditionMap[region],identity=regionIdentities[region],route=regionRoutes[region],state=data.state.expedition.regions[region];
 const index=selected==='endless'?7:selected;
 const permitted=index!==null&&(index===7?state.discovered===7:index<=state.discovered);
 const close=()=>chances?setChances(false):setSelected(null);
 const title=chances?`Fundchancen · ${identity.title}`:index!==null?route.places[index].name:'';
 return <View style={{flex:1}}>
  <ExpeditionJourney map={map} maps={data.expeditionMap} state={state} missions={data.state.expedition.missions.filter((m:any)=>m.region===region)} accountId={accountId} onRegion={onSelectRegion} onPlace={value=>{setChances(false);setSelected(value);}}/>
  <ExpeditionPlaceModal visible={((selected!==null&&permitted)||chances)&&!modalBlocked} title={title} region={chances?undefined:identity.title} image={!chances&&permitted&&index!==null?portraitForPlace(region,index):undefined} onClose={close}>
   {chances?<>
<Txt muted style={styles.small}>Je Expedition · {map.finds.cost} Punkte</Txt>
      <Txt style={styles.section}>Fahrzeugkarten</Txt>
      {map.finds.cards.map((card:any)=><View key={card.id} style={styles.chance}><Row style={{marginBottom:2,flexWrap:'nowrap'}}><Txt style={{flex:1}}>{card.name}</Txt><Txt gold>{n(card.chance,2)} %</Txt></Row><Txt style={[styles.small,{color:rarityColor(card.rarity)}]}>{data.catalog.rarities.find((rarity:any)=>rarity.id===card.rarity)?.label}</Txt></View>)}
      <Txt style={styles.section}>Aufträge</Txt>
      {map.finds.orders.map((order:any)=><View key={order.kind} style={styles.chance}><Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={{flex:1}}>{order.name}</Txt><Txt gold>{n(order.chance,2)} %</Txt></Row>{order.ranks?<Txt muted style={styles.small}>Rang bei Fund: {order.ranks.map((rank:any)=>`${rank.rank} (${n(rank.chance,2)} %)`).join(' · ')}</Txt>:<Txt style={[styles.small,{color:rarityColor(order.rarity)}]}>{data.catalog.rarities.find((rarity:any)=>rarity.id===order.rarity)?.label}</Txt>}</View>)}
   </>:selected!==null&&permitted?<ExpeditionPlaceDetails data={data} region={region} selected={selected} busy={busy} clock={clock} onCommand={onCommand} onMission={onMission} onChances={()=>setChances(true)}/>:null}
  </ExpeditionPlaceModal>
 </View>;
}
const styles=StyleSheet.create({small:{fontSize:12,lineHeight:18},section:{fontSize:14,fontWeight:'700',marginTop:18,marginBottom:8},chance:{paddingVertical:9,borderBottomWidth:1,borderColor:C.line}});
