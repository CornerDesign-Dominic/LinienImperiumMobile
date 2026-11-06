import {MaterialView as View,MaterialPressable as Pressable} from './Material';
import React,{useState} from 'react';
import {StyleSheet} from 'react-native';
import {t as translate,getLocale} from './i18n';
import {LocationArt} from './LocationArt';
import {HubCourierArt} from './HubCourierArt';
import {Icon} from './Icon';
import {PremiumPackArt} from './PremiumPackArt';
import {C,Txt,Card,Row,Pill,Btn,n} from './ui';

type Skin={id:string;name:string;description:string;price:number;art:string};
type Shop={balance:number;name:string;skinPrice:number;ownedSkins:string[];equippedSkin:string;skins:Skin[];packs:{id:string;amount:number;referencePriceCents:number;currency:string}[];purchasesAvailable:boolean};
export function Wholesaler({onGifts,shop,busy=false,onCommand}:{onGifts:()=>void;shop?:Shop;busy?:boolean;onCommand:(action:string,payload:Record<string,unknown>)=>Promise<any>}){
 const [tab,setTab]=useState<'gifts'|'skins'|'topup'>('gifts');
 const [selected,setSelected]=useState<string|null>(null);
 return <>
  <Row style={s.wallet}><Txt muted>{shop?.name||'Hermes-Siegel'}</Txt><View accessible accessibilityLabel={translate(`${n(shop?.balance||0)} Hermes-Siegel`)} style={s.balance}><Icon name="hermes" size={28}/><Txt style={s.balanceText}>{n(shop?.balance||0)}</Txt></View></Row>
  <View accessibilityRole="tablist" style={s.tabs}>{([{id:'gifts',label:'Handelstruhen'},{id:'skins',label:'Skins'},{id:'topup',label:'Aufladen'}] as const).map(item=><Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={translate(item.label)} accessibilityState={{selected:tab===item.id}} onPress={()=>{setTab(item.id);setSelected(null);}} style={[s.tab,tab===item.id&&s.activeTab]}><Txt style={[s.tabText,tab===item.id&&{color:C.onInk}]}>{item.label}</Txt></Pressable>)}</View>
  {tab==='gifts'&&<><View style={{alignItems:'center',marginBottom:12}}><LocationArt name="wholesaler" width={138}/></View><Pressable accessibilityRole="button" accessibilityLabel={translate('Handelstruhen')} onPress={onGifts}><Card><View style={s.row}><Icon name="reward" size={28} color={C.gold}/><View style={{flex:1}}><Txt style={s.title}>Handelstruhen</Txt><Txt muted style={s.small}>Truhen kaufen und eine Region zum Öffnen wählen</Txt></View><Icon name="chevron" size={17} color={C.gold}/></View></Card></Pressable></>}
  {tab==='skins'&&<><Txt muted style={s.intro}>Ein neuer Look für deine Boten. Ihre Werte bleiben gleich.</Txt>{!shop&&<Card><Txt muted>Skins werden geladen …</Txt></Card>}{shop?.skins.map(skin=>{
   const owned=shop.ownedSkins.includes(skin.id),equipped=shop.equippedSkin===skin.id;
   return <Card key={skin.id}><View style={s.row}><HubCourierArt size={96}/><View style={{flex:1}}><Txt style={s.title}>{skin.name}</Txt><Txt muted style={s.small}>{skin.description}</Txt><View style={{alignItems:'flex-start',marginTop:6}}><Pill>{equipped?'Ausgewählt':owned?'Im Besitz':`${n(skin.price)} Hermes-Siegel`}</Pill></View></View></View>{owned?<Btn secondary disabled={busy||equipped} onPress={()=>onCommand('skinEquip',{id:skin.id})}>{equipped?'Ausgewählt':'Für Boten verwenden'}</Btn>:selected===skin.id?<><Txt style={s.small}>Kaufen für {n(skin.price)} Hermes-Siegel?</Txt><Row style={{marginBottom:0}}><Btn secondary disabled={busy} style={{flex:1}} onPress={()=>setSelected(null)}>Abbrechen</Btn><Btn disabled={busy||shop.balance<skin.price} style={{flex:1}} onPress={async()=>{if(await onCommand('skinBuy',{id:skin.id}))setSelected(null);}}>Kaufen</Btn></Row></>:<Btn disabled={busy||shop.balance<skin.price} onPress={()=>setSelected(skin.id)}>{`Kaufen · ${n(skin.price)} Hermes-Siegel`}</Btn>}</Card>;
  })}<Card><Txt style={s.title}>Weitere Skins folgen</Txt><Txt muted style={s.small}>{`Neue Boten-Skins kosten ${n(shop?.skinPrice||250)} Hermes-Siegel.`}</Txt></Card></>}
  {tab==='topup'&&<><Txt muted style={s.intro}>Wähle dein Siegelpaket.</Txt><Card><Txt style={s.title}>Noch nicht verfügbar</Txt><Txt muted style={s.small}>Echtgeldkäufe werden vorbereitet. Die angezeigten Preise dienen als Vorschau.</Txt></Card>{shop?.packs.map(pack=><Card key={pack.id}><View style={s.packRow}><PremiumPackArt amount={pack.amount} size={88}/><View style={s.packInfo}><Txt style={s.packAmount}>{n(pack.amount)}</Txt><Txt style={s.packCurrency}>Hermes-Siegel</Txt><Txt muted style={s.small}>{new Intl.NumberFormat(getLocale(),{style:'currency',currency:pack.currency}).format(pack.referencePriceCents/100)}</Txt></View></View><Btn disabled style={s.packButton}>Bald verfügbar</Btn></Card>)}</>}
 </>;
}
const s=StyleSheet.create({packRow:{flexDirection:'row',alignItems:'center',gap:16},packInfo:{flex:1,minWidth:0},packAmount:{fontSize:23,fontWeight:'700'},packCurrency:{fontSize:16,fontWeight:'700'},packButton:{marginTop:10},wallet:{marginBottom:10},balance:{flexDirection:'row',alignItems:'center',gap:6},balanceText:{fontSize:20,fontWeight:'700'},tabs:{flexDirection:'row',gap:6,marginBottom:14},tab:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:5},activeTab:{backgroundColor:C.accent,borderColor:C.ink},tabText:{fontSize:13,fontWeight:'700'},row:{flexDirection:'row',alignItems:'center',gap:12},title:{fontSize:16,fontWeight:'700'},small:{fontSize:12,lineHeight:18,marginTop:4},intro:{fontSize:13,lineHeight:19,marginBottom:12}});
