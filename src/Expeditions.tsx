import React,{useRef,useState} from 'react';
import {View,Pressable,Modal,ScrollView,StyleSheet} from 'react-native';
import {C,Txt,Card,Row,Btn,Bar,Pill,n,remaining} from './ui';
import {AtlasHeading,RegionSeal,atlasStyles} from './Atlas';
import {displayFont,regionInks} from './theme';
import {rarityColor} from './items';
const deliveryProgress=(mission:any,done:boolean,clock:number)=>done||mission?.status==='completed'?100:mission?.status==='active'?Math.max(0,Math.min(100,(clock-mission.startedAt)/(mission.endsAt-mission.startedAt)*100)):0;
function Progress({explored,delivered,showDelivery=false}:any){return <><Bar value={explored}/>{showDelivery&&<Bar value={delivered} gold/>}</>;}

export function Expeditions({data,region,onSelectRegion,busy,clock,onCommand,onMission,onFocusPlace,modalBlocked=false}:any){
 const [selected,setSelected]=useState<number|'endless'|null>(null),[chances,setChances]=useState(false);
 const focus=useRef<{offset:number|null;target:number|null;done:boolean}>({offset:null,target:null,done:false});
 const g=data.state,maps=data.expeditionMap;
 const button=(label:string,action:string,payload:any,disabled=false)=><Btn disabled={busy||disabled} onPress={()=>onCommand(action,payload)}>{label}</Btn>;
 if(region===null)return <><AtlasHeading title="Reiseatlas" detail="Erschließe Regionen, entdecke Orte und gewinne Verbündete."/>{maps.map((map:any)=><Pressable key={map.index} accessibilityRole="button" accessibilityLabel={`${map.name}, ${map.customer.name}${map.open?'':', Gesperrt'}`} accessibilityState={{disabled:!map.open}} disabled={!map.open} onPress={()=>onSelectRegion(map.index)}>
  <Card style={[styles.region,{borderTopColor:regionInks[map.index%regionInks.length]},!map.open&&styles.locked]}>
   <Row style={{alignItems:'flex-start'}}><RegionSeal index={map.index} locked={!map.open}/><View style={{flex:1,minWidth:0}}><Txt gold style={styles.small}>EXPEDITIONSGEBIET</Txt><Txt style={styles.title}>{map.name}</Txt></View><Txt muted>↗</Txt></Row>
   <Row><Txt muted style={styles.small}>Erkundung</Txt><Txt muted>{n(map.progress)} %</Txt></Row>
   <Row><Txt muted>{map.customer.name}</Txt>{!map.open&&<Pill>Gesperrt</Pill>}</Row>
   <Bar value={map.progress}/><Row style={{marginBottom:0}}><Txt muted style={styles.small}>Orte {map.discovered}/7</Txt><Txt muted style={styles.small}>Boni {map.deliveries+Number(map.finalClaimed)}/8</Txt></Row>
  </Card>
 </Pressable>)}</>;
 const map=maps[region],r=g.expedition.regions[region],missions=g.expedition.missions.filter((m:any)=>m.region===region);
 const final=missions.find((m:any)=>m.kind==='final'),endlessOpen=r.discovered===7,noTruck=!g.trucks.some((t:any)=>t.free&&t.tier>=2);
 const firstUnfinished=r.deliveries.findIndex((done:boolean)=>!done),focusKey=firstUnfinished>=0?firstUnfinished:!r.finalClaimed?'endless':null;
 const tryFocus=()=>{const f=focus.current;if(!f.done&&focusKey!==null&&f.offset!==null&&f.target!==null){f.done=true;onFocusPlace?.(Math.max(0,f.offset+f.target-10));}};
 const targetLayout=(key:number|'endless',y:number)=>{if(key===focusKey){focus.current.target=y;tryFocus();}};
 const close=()=>chances?setChances(false):setSelected(null);
 const info=(event?:any)=>{event?.stopPropagation();setChances(true);};
 const question=(positioned=false)=> <Pressable accessibilityRole="button" accessibilityLabel={`Fundchancen ${map.name}`} onPress={info} style={[styles.question,positioned&&{position:'absolute',top:16,right:16}]}><Txt style={{color:C.accent,fontSize:18}}>?</Txt></Pressable>;
 const place=typeof selected==='number'?map.places[selected]:null;
 const discovered=place&&Number(selected)<r.discovered,next=place&&selected===r.discovered;
 const done=place&&r.deliveries[selected as number],mission=place&&missions.find((m:any)=>m.kind==='delivery'&&m.place===selected);
 const explored=place?place.invested/place.discoveryCost*100:map.progress;
 const shipment=deliveryProgress(place?mission:final,place?done:r.finalClaimed,clock);
 return <View onLayout={e=>{focus.current.offset=e.nativeEvent.layout.y;tryFocus();}}>
  <AtlasHeading title={map.name} detail={map.customer.name}/>
  <View onLayout={e=>targetLayout('endless',e.nativeEvent.layout.y)}>
   <Pressable accessibilityRole="button" accessibilityLabel="Endlosort öffnen" onPress={()=>setSelected('endless')}>
    <Card style={[styles.endless,!endlessOpen&&styles.locked]}>
     <Row style={{marginBottom:2}}><Txt style={[styles.title,{flex:1}]}>∞ Endlosort</Txt><Txt muted>{n(map.progress)} %</Txt><View style={{width:44,height:44}}/></Row>
     <Txt muted style={styles.small}>{map.customer.name}</Txt>
     <Progress explored={map.progress} delivered={deliveryProgress(final,r.finalClaimed,clock)} showDelivery={endlessOpen}/>
     {!endlessOpen?<Pill>Gesperrt</Pill>:r.finalClaimed?<Txt muted style={styles.small}>Kunde freigeschaltet ✓</Txt>:final?.status==='active'?<Txt gold style={styles.small}>{remaining(final.endsAt,clock)}</Txt>:null}
    </Card>
   </Pressable>
   {question(true)}
  </View>
  {[...map.places].reverse().map((p:any)=>{
   const i=p.index,known=i<r.discovered,complete=r.deliveries[i],locked=i>r.discovered;
   const m=missions.find((m:any)=>m.kind==='delivery'&&m.place===i),value=p.invested/p.discoveryCost*100;
   return <View key={i} style={atlasStyles.journey} onLayout={e=>targetLayout(i,e.nativeEvent.layout.y)}><View style={atlasStyles.waypoint}/><Pressable accessibilityRole="button" accessibilityLabel={`Ort ${i+1} öffnen`} onPress={()=>setSelected(i)}>
    <Card style={[styles.place,locked&&styles.locked]}><Row style={{marginBottom:4}}><Txt style={styles.title}>Ort {i+1}</Txt><Txt muted>{n(value)} %</Txt></Row>
     <Progress explored={value} delivered={deliveryProgress(m,complete,clock)} showDelivery={known}/>
     {locked?<Pill>Gesperrt</Pill>:complete?<Txt muted style={styles.small}>Abgeschlossen ✓</Txt>:m?.status==='active'?<Txt gold style={styles.small}>{remaining(m.endsAt,clock)}</Txt>:m?.status==='completed'?<Txt gold style={styles.small}>Bonus bereit</Txt>:null}
    </Card>
   </Pressable></View>;
  })}
  <Modal visible={(selected!==null||chances)&&!modalBlocked} transparent animationType="none" onRequestClose={close}>
   <View style={styles.overlay}><View style={styles.modal}>
    <Row style={{flexWrap:'nowrap'}}><Txt style={[styles.title,{flex:1}]}>{chances?`Fundchancen · ${map.name}`:place?`Ort ${Number(selected)+1}`:'∞ Endlosort'}</Txt><Btn secondary style={{marginTop:0}} onPress={close}>Schließen</Btn></Row>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:4}}>
     {chances?<>
      <Txt muted style={styles.small}>Je Expedition · {map.finds.cost} Punkte</Txt>
      <Txt style={styles.section}>Fahrzeugkarten</Txt>
      {map.finds.cards.map((card:any)=><View key={card.id} style={styles.chance}><Row style={{marginBottom:2,flexWrap:'nowrap'}}><Txt style={{flex:1}}>{card.name}</Txt><Txt gold>{n(card.chance,2)} %</Txt></Row><Txt style={[styles.small,{color:rarityColor(card.rarity)}]}>{data.catalog.rarities.find((rarity:any)=>rarity.id===card.rarity)?.label}</Txt></View>)}
      <Txt style={styles.section}>Aufträge</Txt>
      {map.finds.orders.map((order:any)=><View key={order.kind} style={styles.chance}><Row style={{marginBottom:3,flexWrap:'nowrap'}}><Txt style={{flex:1}}>{order.name}</Txt><Txt gold>{n(order.chance,2)} %</Txt></Row>{order.ranks?<Txt muted style={styles.small}>Rang bei Fund: {order.ranks.map((rank:any)=>`${rank.rank} (${n(rank.chance,2)} %)`).join(' · ')}</Txt>:<Txt style={[styles.small,{color:rarityColor(order.rarity)}]}>{data.catalog.rarities.find((rarity:any)=>rarity.id===order.rarity)?.label}</Txt>}</View>)}
     </>:<>
      <Row style={{marginBottom:0}}><Txt muted style={styles.small}>Erkundung</Txt><Txt muted style={styles.small}>{n(explored)} %</Txt></Row>
      <Bar value={explored}/>
      {(discovered||selected==='endless'&&endlessOpen)&&<><Row style={{marginTop:5,marginBottom:0}}><Txt muted style={styles.small}>Bonuslieferung</Txt><Txt muted style={styles.small}>{n(shipment)} %</Txt></Row><Bar value={shipment} gold/></>}
      {place?<>
       {!discovered&&!next?<Pill>Gesperrt</Pill>:!discovered?button('Erkunden · 1 Punkt','discover',{region},g.expedition.points<1):done?<Txt muted>Abgeschlossen ✓</Txt>:<>
        <Txt muted style={styles.small}>Bonus: +1 Expeditionskapazität</Txt>
        {!mission&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'delivery',selected)}>Bonus liefern</Btn>}
        {mission?.status==='active'&&<Txt gold style={{marginTop:8}}>{remaining(mission.endsAt,clock)}</Txt>}
        {mission?.status==='completed'&&!mission.claimedAt&&button('Bonus abholen','claimMission',{id:mission.id})}
        {!mission&&noTruck&&<Txt muted style={styles.small}>Kein freier LKW</Txt>}
       </>}
      </>:<>
       <Txt muted style={{marginVertical:8}}>{map.customer.name}</Txt>
       {!endlessOpen?<Pill>Gesperrt</Pill>:<>
        {!final&&!r.finalClaimed&&<Btn disabled={busy||noTruck} onPress={()=>onMission(region,'final',0)}>Kunde freischalten</Btn>}
        {final?.status==='active'&&<Txt gold>{remaining(final.endsAt,clock)}</Txt>}
        {final?.status==='completed'&&!final.claimedAt&&button('Kunde freischalten','claimMission',{id:final.id})}
        {r.finalClaimed&&<Txt muted style={styles.small}>Kunde freigeschaltet ✓</Txt>}
        {button(`Expedition · ${map.finds.cost} Punkte`,'draw',{region},g.expedition.points<map.finds.cost)}
       </>}
       <View style={{alignItems:'flex-end',marginTop:8}}>{question()}</View>
      </>}
     </>}
    </ScrollView>
   </View></View>
  </Modal>
 </View>;
}
const styles=StyleSheet.create({region:{backgroundColor:C.panel,borderColor:C.line,borderTopWidth:3},place:{backgroundColor:C.panel,borderColor:C.line},endless:{backgroundColor:C.greenWash,borderColor:C.accent},title:{fontFamily:displayFont,fontSize:19,lineHeight:25,fontWeight:'700'},section:{fontSize:14,fontWeight:'700',marginTop:18,marginBottom:8},small:{fontSize:12,lineHeight:18},locked:{backgroundColor:C.raised,borderStyle:'dashed'},question:{width:44,height:44,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.line,borderRadius:10},overlay:{flex:1,backgroundColor:C.overlay,justifyContent:'center',padding:18},modal:{width:'100%',maxWidth:460,maxHeight:'85%',alignSelf:'center',borderWidth:1,borderColor:C.line,borderRadius:18,backgroundColor:C.panel,padding:16},chance:{paddingVertical:9,borderBottomWidth:1,borderColor:C.line}});

