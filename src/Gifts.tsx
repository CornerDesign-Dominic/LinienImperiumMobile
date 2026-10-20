import {t as translate} from './i18n';
import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {Icon} from './Icon';
import {rarityColor} from './items';
import {C,Txt,Card,Row,Btn,Pill,n} from './ui';

export function Gifts({data,busy,onCommand,modalBlocked=false}:any){
 const [selected,setSelected]=useState<number|null>(null),[found,setFound]=useState<any>(null);
 const gifts=data.catalog.gifts||[],gift=gifts.find((item:any)=>item.region===selected);
 const card=found&&data.catalog.cards.find((item:any)=>item.id===found.cardId);
 const close=()=>{setSelected(null);setFound(null);};
 const open=async()=>{
  if(!gift||busy)return;
  const next=await onCommand('giftOpen',{region:gift.region});
  if(next?.giftFind){setSelected(null);setFound(next.giftFind);}
 };
 return <>
  {gifts.map((item:any)=><Pressable key={item.region} accessibilityRole="button" accessibilityLabel={translate('Geschenk')+', '+translate(item.name)} onPress={()=>setSelected(item.region)}>
   <Card style={styles.gift}><Icon name="reward" size={36} color={C.gold}/><View style={{flex:1}}><Txt style={styles.title}>{item.name}</Txt><Txt muted style={styles.small}>{item.cards.length} Fahrzeuge</Txt></View><Txt gold>{n(item.cost)} M</Txt><Icon name="chevron" size={16} color={C.gold}/></Card>
  </Pressable>)}
  <Modal visible={!!(gift||card)&&!modalBlocked} transparent animationType="none" onRequestClose={close}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={[styles.title,{flex:1}]}>{card?'Geschenk geöffnet':'Geschenk'}</Txt><Btn icon="close" secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    {card?<>
     <View style={[styles.art,{borderColor:rarityColor(card.rarity)}]}><Icon name={found.duplicate?'shard':'truck'} size={64} color={rarityColor(card.rarity)}/></View>
     <Txt style={[styles.resultName,{color:rarityColor(card.rarity)}]}>{card.name}</Txt>
     <Txt style={{textAlign:'center',marginBottom:12}}>{found.duplicate?`+1 ${data.catalog.rarities.find((r:any)=>r.id===card.rarity)?.label}-Shard`:'Neue Fahrzeugkarte'}</Txt>
    </>:gift?<>
     <Row><Txt muted>{gift.name}</Txt><Pill>1 Fahrzeugkarte</Pill></Row>
     <ScrollView style={{flexShrink:1,flexGrow:0}} contentContainerStyle={{paddingBottom:4}}>
      {gift.cards.map((vehicle:any)=><View key={vehicle.id} style={[styles.vehicle,{borderColor:rarityColor(vehicle.rarity)}]}>
       <Icon name="truck" size={24} color={rarityColor(vehicle.rarity)}/><View style={{flex:1,minWidth:0}}><Txt style={{fontSize:13,fontWeight:'700'}}>{vehicle.name}</Txt><Txt style={[styles.small,{color:rarityColor(vehicle.rarity)}]}>{data.catalog.rarities.find((r:any)=>r.id===vehicle.rarity)?.label}</Txt></View><Txt style={styles.small}>{n(vehicle.chance,2)} %</Txt>
      </View>)}
      <Txt muted style={styles.small}>Doppelte Karte → 1 Shard derselben Seltenheit</Txt>
     </ScrollView>
     <Btn icon="reward" disabled={busy||data.state.coins<gift.cost} onPress={open}>Öffnen · {n(gift.cost)} M</Btn>
    </>:null}
   </View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({
 gift:{flexDirection:'row',alignItems:'center',gap:10,padding:14},
 title:{fontSize:16,fontWeight:'700'},
 small:{fontSize:11,lineHeight:16},
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},
 modal:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:18,padding:16,width:'100%',maxWidth:460,maxHeight:'85%',alignSelf:'center'},
 vehicle:{flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderRadius:8,padding:9,marginBottom:8,backgroundColor:C.raised},
 art:{width:120,height:120,alignItems:'center',justifyContent:'center',alignSelf:'center',backgroundColor:C.raised,borderWidth:2,borderRadius:14,marginVertical:12},
 resultName:{fontSize:19,fontWeight:'700',textAlign:'center',marginBottom:10},
});
