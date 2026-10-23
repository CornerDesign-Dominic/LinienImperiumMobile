import React,{useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from './Language';
import {t as translate} from './i18n';
import {C,Txt,Row,Btn,Empty} from './ui';
import {Icon} from './Icon';
import {VehicleCardGrid} from './VehicleCards';
import {FleetDetails} from './FleetDetails';
import {bonusText} from './cardBonus';
import {VehicleCardDetail} from './VehicleCardDetail';
import {VehicleArt} from './VehicleArt';

export function Fleet({data,busy,template,onTemplate,onCommand,onCollection,modalBlocked=false}:any){
 const [choosingSeat,setChoosingSeat]=useState<number|null>(null),[picking,setPicking]=useState(false),[saveFailed,setSaveFailed]=useState(false);
 const [details,setDetails]=useState(false);
 const {state:g,catalog:c}=data,slots=data.templates[template];
 const cards=c.cards.filter((card:any)=>g.expedition.characters[card.id]);
 const selected=choosingSeat===null?null:c.cards.find((card:any)=>card.id===slots[choosingSeat]);
 const close=()=>{setChoosingSeat(null);setSaveFailed(false);};
 const statusForCard=(id:string)=>{const seat=slots.indexOf(id);return seat<0?null:{label:`${seat===choosingSeat?'Ausgewählt':'In Flotte'} · Platz ${seat+1}`,selected:seat===choosingSeat};};
 const select=async(id:string)=>{
  if(busy||choosingSeat===null)return;
  if(slots[choosingSeat]===id){close();return;}
  setSaveFailed(false);
  const next=await onCommand('seat',{id,template,seat:choosingSeat});
  if(next?.templates?.[template]?.[choosingSeat]===id)close();else setSaveFailed(true);
 };
 const remove=async()=>{
  if(busy||choosingSeat===null)return;
  setSaveFailed(false);
  const next=await onCommand('unseat',{template,seat:choosingSeat});
  if(next?.templates?.[template]?.[choosingSeat]===null)close();else setSaveFailed(true);
 };
 return <>
  <Row style={{flexWrap:'nowrap'}}>{[0,1,2].map(i=><Btn key={i} style={{flex:1,marginTop:0}} secondary={template!==i} onPress={()=>{close();onTemplate(i);}}>Flotte {i+1}</Btn>)}</Row>
  <Btn secondary style={{marginTop:0,marginBottom:12}} onPress={()=>setDetails(true)}>Flottendetails</Btn>
  <FleetDetails data={data} template={template} visible={details} modalBlocked={modalBlocked} onClose={()=>setDetails(false)}/>
  {slots.map((id:string|null,seat:number)=>{const card=c.cards.find((x:any)=>x.id===id);return <Pressable key={seat} accessibilityRole="button" accessibilityLabel={translate(`Flottenplatz ${seat+1}: ${card?.name||'Freier Platz'}`)} accessibilityState={{disabled:busy}} disabled={busy} onPress={()=>{setSaveFailed(false);setPicking(!card);setChoosingSeat(seat);}} style={({pressed})=>[styles.slot,(pressed||busy)&&{opacity:.7}]}>
   <Txt muted style={styles.slotNumber}>{seat+1}</Txt>{card?<VehicleArt card={card} style={{width:48}}/>:<Icon name="plus" size={27} color={C.muted}/>}
   <View style={{flex:1,minWidth:0}}><Text numberOfLines={1} style={styles.cardTitle}>{card?.name||'Freier Platz'}</Text><Text numberOfLines={1} style={styles.slotDetail}>{card?bonusText(card,data.cardBonuses[id!]):'Fahrzeug auswählen'}</Text></View><Icon name="chevron" size={16} color={C.gold}/>
  </Pressable>;})}
  <Btn secondary onPress={onCollection}>Sammlung & Kartenlevel</Btn>
  <Modal visible={choosingSeat!==null&&!modalBlocked} transparent animationType="none" onRequestClose={close}>
   <SafeAreaView edges={['top','bottom']} style={styles.overlay}><View style={styles.sheet}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={styles.title}>{picking?'Fahrzeugkarte wählen':selected?.name}</Txt><Btn icon="close" iconOnly secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    <Txt muted style={{marginBottom:8}}>Flotte {template+1} · Platz {(choosingSeat??0)+1}</Txt>
    {saveFailed&&<Txt accessibilityRole="alert" style={{color:C.red,marginBottom:8}}>Änderung konnte nicht gespeichert werden. Bitte erneut versuchen.</Txt>}
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:4}}>
     {picking?<>
      <Txt muted style={styles.hint}>Markierte Fahrzeuge sind bereits in dieser Flotte. Ihre Auswahl verschiebt sie auf diesen Platz.</Txt>
      {cards.length?<VehicleCardGrid data={data} cards={cards} statusForCard={statusForCard} disabled={busy} onOpen={select}/>:<Empty>Noch keine Fahrzeugkarten entdeckt.</Empty>}
     </>:selected&&<VehicleCardDetail key={selected.id} data={data} id={selected.id} compact modalBlocked={modalBlocked} busy={busy} actions={<View style={{flexDirection:'row',gap:8}}>
      <Btn style={{flex:1}} disabled={busy} onPress={()=>{setSaveFailed(false);setPicking(true);}}>Wechseln</Btn>
      <Btn style={{flex:1}} secondary disabled={busy} onPress={remove}>Entfernen</Btn>
     </View>}/>}
    </ScrollView>
   </View></SafeAreaView>
  </Modal>
 </>;
}
const styles=StyleSheet.create({intro:{fontSize:12,lineHeight:18,marginBottom:12},slot:{flexDirection:'row',alignItems:'center',gap:10,minHeight:66,paddingVertical:10,paddingHorizontal:10,marginBottom:8,backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:7},slotNumber:{fontSize:11,width:13,textAlign:'center'},cardTitle:{color:C.text,fontSize:15,lineHeight:21,fontWeight:'700'},slotDetail:{color:C.muted,fontSize:12,lineHeight:18,marginTop:2},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',paddingHorizontal:12},sheet:{width:'100%',maxWidth:520,maxHeight:'90%',alignSelf:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:14,padding:12},title:{flex:1,minWidth:0,fontSize:17,fontWeight:'700'},hint:{fontSize:11,lineHeight:16,marginBottom:12}});
