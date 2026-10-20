import React from 'react';
import {View,StyleSheet} from 'react-native';
import {C,Txt,n} from './ui';
export function Statistics({state:g}:any){
 const rows=[
  ['Frachtumsatz',`${n(g.stats.grossRevenue,2)} M`],
  ['Betriebskosten',`${n(g.stats.operatingCosts,2)} M`],
  ['Beschaffungskosten',`${n(g.procurement?.spent,2)} M`],
  ['Beschaffung: hinterlegtes Guthaben',`${n((g.procurement?.runs||[]).reduce((sum:number,r:any)=>sum+r.escrow,0),2)} M`],
  ['Erfolgreiche Abholungen',n(g.procurement?.completed)],
  ['Prämien',`${n(g.stats.contractBonusRevenue,2)} M`],
  ['Touren',n(g.stats.trips)],
  ['Aufträge',n(g.completed)],
  ['Fracht',`${n(g.stats.tons,2)} t`],
  ['Strecke',`${n(g.stats.km,2)} km`],
  ['Transportleistung',`${n(g.stats.tonKm,2)} tkm`],
  ['Spieler-XP',n(g.xp)],
  ['Testmünzen',`${n(g.stats.testCoinsGranted,2)} M`],
  ['CO₂ (Schätzung)',`${n(g.stats.tonKm*.05275,1)} kg`]
 ];
 return <View style={styles.list}>{rows.map(([label,value],index)=><View key={label} style={[styles.row,index>0&&styles.divider]}>
  <Txt muted style={styles.label}>{label}</Txt><Txt style={styles.value}>{value}</Txt>
 </View>)}</View>;
}
const styles=StyleSheet.create({list:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:12,overflow:'hidden'},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,paddingVertical:10,paddingHorizontal:12},divider:{borderTopWidth:1,borderTopColor:C.line},label:{flex:1,fontSize:13,lineHeight:19},value:{maxWidth:'60%',fontSize:13,lineHeight:19,textAlign:'right',fontVariant:['tabular-nums']}});
