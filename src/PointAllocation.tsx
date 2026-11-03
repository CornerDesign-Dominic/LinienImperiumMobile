import React from 'react';
import {StyleSheet} from 'react-native';
import {MaterialView as View} from './Material';
import {C,Txt,Row,Btn,n} from './ui';
import {Icon} from './Icon';

// Informational balances use the same pale paper and petrol outline as upgrade previews.
export const pointInfoStyle={backgroundColor:C.raised,borderWidth:1,borderColor:C.accent,borderRadius:6,overflow:'hidden' as const};
export function PointInfo({children}:any){return <View style={[pointInfoStyle,s.info]}><Txt style={s.infoText}>{children}</Txt></View>;}
export function PointsBalance({remaining,total,expansion=false}:any){return <Row><Row style={{justifyContent:'flex-start',marginBottom:0,gap:8,flex:1}}>{expansion&&<Icon name="expansion" size={36}/>}<Txt muted style={{flexShrink:1}}>Punkte zur Verfügung</Txt></Row><PointInfo>{n(Math.max(0,remaining))} / {n(total)}</PointInfo></Row>;}
export function PointAllocationRow({label,current,amount,free,disabled,onDecrease,onIncrease}:any){return <View style={s.area}>
 <Txt style={{fontWeight:'700'}}>{label}</Txt><Row style={{marginTop:8,flexWrap:'nowrap'}}><Txt style={{flexShrink:1}}>{n(current)} → {n(current+amount)}</Txt><View style={s.controls}>
  <Btn secondary icon="minus" iconOnly disabled={disabled||!amount} onPress={onDecrease}>{label+' verringern'}</Btn>
  <Txt gold style={{minWidth:22,textAlign:'center'}}>+{n(amount)}</Txt>
  <Btn secondary icon="plus" iconOnly disabled={disabled||free<=0} onPress={onIncrease}>{label+' erhöhen'}</Btn>
 </View></Row>
</View>;}
const s=StyleSheet.create({info:{paddingHorizontal:8,paddingVertical:5,flexShrink:1},infoText:{fontSize:11,lineHeight:17,fontWeight:'700',color:C.accent},area:{paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.line},controls:{flexDirection:'row',alignItems:'center',gap:4}});
