import {t as translate} from './i18n';
import React,{useEffect,useRef,useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet,AccessibilityInfo} from 'react-native';
import {Icon} from './Icon';
import {rarityColor} from './items';
import {giftRevealSteps} from './giftReveal';
import {C,Txt,Card,Row,Btn,Pill,n} from './ui';

export function Gifts({data,busy,onCommand,modalBlocked=false}:any){
 const [selected,setSelected]=useState<number|null>(null),[found,setFound]=useState<any>(null);
 const [opening,setOpening]=useState(false),[highlight,setHighlight]=useState<number|null>(null),[canSkip,setCanSkip]=useState(false),[failed,setFailed]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),generation=useRef(0),spinning=useRef(false),cursor=useRef(0),outcome=useRef<any>(null),reducedMotion=useRef(false);
 const list=useRef<any>(null),positions=useRef<Record<number,number>>({});
 const gifts=data.catalog.gifts||[],gift=gifts.find((item:any)=>item.region===selected);
 const card=found&&data.catalog.cards.find((item:any)=>item.id===found.cardId);
 const clearTimer=()=>{if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}};
 useEffect(()=>{
  let mounted=true;
  AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(mounted)reducedMotion.current=value;}).catch(()=>{});
  return ()=>{mounted=false;generation.current++;if(timer.current!==null)clearTimeout(timer.current);};
 },[]);
 const mark=(index:number)=>{cursor.current=index;setHighlight(index);list.current?.scrollTo({y:Math.max(0,(positions.current[index]||0)-80),animated:false});};
 const finish=(result:any,winner:number)=>{
  clearTimer();mark(winner);spinning.current=false;setOpening(false);setCanSkip(false);setFound(result);
 };
 const close=()=>{
  if(spinning.current){
   if(outcome.current&&gift)finish(outcome.current,gift.cards.findIndex((vehicle:any)=>vehicle.id===outcome.current.cardId));
   return;
  }
  clearTimer();setSelected(null);setFound(null);setHighlight(null);setFailed(false);
 };
 const open=async()=>{
  if(!gift||busy||spinning.current)return;
  const token=++generation.current;
  spinning.current=true;outcome.current=null;setOpening(true);setFound(null);setFailed(false);setCanSkip(false);mark(0);
  const pulse=()=>{
   if(generation.current!==token)return;
   if(!reducedMotion.current)mark((cursor.current+1)%gift.cards.length);
   timer.current=setTimeout(pulse,85);
  };
  timer.current=setTimeout(pulse,85);
  try{
   const next=await onCommand('giftOpen',{region:gift.region});
   if(generation.current!==token)return;
   clearTimer();
   const result=next?.giftFind,winner=gift.cards.findIndex((vehicle:any)=>vehicle.id===result?.cardId);
   if(!result||winner<0){spinning.current=false;setOpening(false);setHighlight(null);setFailed(true);return;}
   outcome.current=result;setCanSkip(true);
   if(reducedMotion.current){finish(result,winner);return;}
   const steps=giftRevealSteps(gift.cards.length,cursor.current,winner);
   const reveal=(index:number)=>{
    if(generation.current!==token)return;
    if(index>=steps.length){timer.current=setTimeout(()=>finish(result,winner),450);return;}
    timer.current=setTimeout(()=>{mark(steps[index].index);reveal(index+1);},steps[index].delay);
   };
   reveal(0);
  }catch{
   if(generation.current!==token)return;
   clearTimer();spinning.current=false;setOpening(false);setHighlight(null);setFailed(true);
  }
 };
 return <>
  {gifts.map((item:any)=><Pressable key={item.region} accessibilityRole="button" accessibilityLabel={translate('Geschenk')+', '+translate(item.name)} onPress={()=>{setFound(null);setHighlight(null);setFailed(false);positions.current={};setSelected(item.region);}}>
   <Card style={styles.gift}><Icon name="reward" size={36} color={C.gold}/><View style={{flex:1}}><Txt style={styles.title}>{item.name}</Txt><Txt muted style={styles.small}>{item.cards.length} Fahrzeuge</Txt></View><Txt gold>{n(item.cost)} M</Txt><Icon name="chevron" size={16} color={C.gold}/></Card>
  </Pressable>)}
  <Modal visible={!!gift&&!modalBlocked} transparent animationType="none" onRequestClose={close}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={[styles.title,{flex:1}]}>{card?'Geschenk geöffnet':'Geschenk'}</Txt><Btn icon={opening?'chevron':'close'} secondary disabled={opening&&!canSkip} style={{marginTop:0}} onPress={close}>{opening?'Überspringen':'Schließen'}</Btn></Row>
    {gift&&<>
     <Row><Txt muted>{gift.name}</Txt><Pill>1 Fahrzeugkarte</Pill></Row>
     <ScrollView ref={list} style={{flexShrink:1,flexGrow:0}} contentContainerStyle={{paddingBottom:4}}>
      {gift.cards.map((vehicle:any,index:number)=><View key={vehicle.id} onLayout={event=>{positions.current[index]=event.nativeEvent.layout.y;}} accessibilityState={{selected:highlight===index}} style={[styles.vehicle,{borderColor:rarityColor(vehicle.rarity)},highlight===index&&styles.highlight,!!card&&highlight===index&&styles.winner]}>
       <Icon name={card&&highlight===index?'check':'truck'} size={24} color={rarityColor(vehicle.rarity)}/><View style={{flex:1,minWidth:0}}><Txt style={{fontSize:13,fontWeight:'700'}}>{vehicle.name}</Txt><Txt style={[styles.small,{color:rarityColor(vehicle.rarity)}]}>{data.catalog.rarities.find((r:any)=>r.id===vehicle.rarity)?.label}</Txt></View><Txt style={styles.small}>{n(vehicle.chance,2)} %</Txt>
      </View>)}
      {!opening&&!card&&<Txt muted style={styles.small}>Doppelte Karte → 1 Shard derselben Seltenheit</Txt>}
     </ScrollView>
     {opening?<Txt gold style={{textAlign:'center',marginTop:12}}>Wird geöffnet …</Txt>:card?<View style={styles.reward} accessibilityLiveRegion="polite"><Icon name={found.duplicate?'shard':'cards'} size={24} color={rarityColor(card.rarity)}/><View style={{flex:1}}><Txt style={{fontWeight:'700'}}>{card.name}</Txt><Txt style={styles.small}>{found.duplicate?`+1 ${data.catalog.rarities.find((r:any)=>r.id===card.rarity)?.label}-Shard`:'Neue Fahrzeugkarte'}</Txt></View></View>:<>
      {failed&&<Txt style={{color:C.red,fontSize:12,marginTop:8}}>Geschenk konnte nicht geöffnet werden. Bitte erneut versuchen.</Txt>}
      <Btn icon="reward" disabled={busy||data.state.coins<gift.cost} onPress={open}>Öffnen · {n(gift.cost)} M</Btn>
     </>}
    </>}
   </View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({
 gift:{flexDirection:'row',alignItems:'center',gap:10,padding:14},
 title:{fontSize:16,fontWeight:'700'},small:{fontSize:11,lineHeight:16},
 overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},
 modal:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:18,padding:16,width:'100%',maxWidth:460,maxHeight:'85%',alignSelf:'center'},
 vehicle:{flexDirection:'row',alignItems:'center',gap:9,borderWidth:2,borderRadius:8,padding:9,marginBottom:8,backgroundColor:C.raised},
 highlight:{backgroundColor:C.goldWash,borderColor:C.gold},
 winner:{backgroundColor:C.greenWash,borderColor:C.accent},
 reward:{flexDirection:'row',alignItems:'center',gap:9,padding:10,marginTop:12,borderRadius:8,backgroundColor:C.greenWash},
});
