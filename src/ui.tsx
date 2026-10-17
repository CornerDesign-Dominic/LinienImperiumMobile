import React from 'react';
import {View,Text,Pressable,StyleSheet,ViewStyle} from 'react-native';
export const C={bg:'#0B1017',panel:'#141D28',raised:'#1B2735',line:'#293545',text:'#EEF3F8',muted:'#97A7BA',accent:'#62D5BC',gold:'#E2BB75',red:'#F19B98'};
export const n=(v:any,d=0)=>Number(v||0).toLocaleString('de-DE',{maximumFractionDigits:d});
export const remaining=(at:number,now:number)=>{const sec=Math.max(0,Math.ceil((at-now)/1000));return `${Math.floor(sec/3600).toString().padStart(2,'0')}:${Math.floor(sec%3600/60).toString().padStart(2,'0')}:${(sec%60).toString().padStart(2,'0')}`;};
export const minutes=(seconds:number)=>`${n(seconds/60,1)} Min.`;
export const plain=(value:string)=>value.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<\/p>/g,'\n\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
export function Txt({children,muted=false,gold=false,style}:any){return <Text style={[s.text,muted&&s.muted,gold&&{color:C.gold},style]}>{children}</Text>;}
export function Heading({children,eyebrow}:any){return <View style={{marginBottom:16}}>{eyebrow&&<Text style={s.eyebrow}>{eyebrow}</Text>}<Text style={s.heading}>{children}</Text></View>;}
export function Card({children,style}:any){return <View style={[s.card,style]}>{children}</View>;}
export function Row({children,style}:any){return <View style={[s.row,style]}>{children}</View>;}
export function Btn({children,onPress,disabled=false,secondary=false,danger=false,style}:any){return <Pressable accessibilityRole="button" accessibilityState={{disabled}} onPress={onPress} disabled={disabled} style={({pressed})=>[s.btn,secondary&&s.secondary,danger&&{borderColor:C.red},(disabled||pressed)&&{opacity:.45},style]}><Text style={[s.btnText,secondary&&{color:C.text},danger&&{color:C.red}]}>{children}</Text></Pressable>;}
export function Bar({value=0,gold=false}:any){return <View accessibilityRole="progressbar" accessibilityValue={{min:0,max:100,now:Math.round(Math.min(100,Math.max(0,value)))}} style={s.bar}><View style={{height:4,width:`${Math.min(100,Math.max(0,value))}%`,backgroundColor:gold?C.gold:C.accent}}/></View>;}
export function Pill({children,gold=false}:any){return <Text style={[s.pill,gold&&{color:C.gold,backgroundColor:'#352E22'}]}>{children}</Text>;}
export function Empty({children}:any){return <Card><Txt muted>{children}</Txt></Card>;}
export const s=StyleSheet.create({
 text:{color:C.text,fontSize:14,lineHeight:21},muted:{color:C.muted},eyebrow:{fontSize:10,fontWeight:'700',letterSpacing:2,color:C.accent,marginBottom:6},heading:{fontSize:28,fontWeight:'700',color:C.text,letterSpacing:-.6},card:{backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:16,padding:16,marginBottom:12},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:10,flexWrap:'wrap'},btn:{backgroundColor:C.accent,borderColor:C.accent,borderWidth:1,borderRadius:10,minHeight:44,paddingHorizontal:14,paddingVertical:11,alignItems:'center',justifyContent:'center',marginTop:8},secondary:{backgroundColor:'transparent',borderColor:C.line},btnText:{fontSize:13,fontWeight:'700',color:C.bg,textAlign:'center'},bar:{height:4,backgroundColor:C.line,borderRadius:3,overflow:'hidden',marginVertical:8},pill:{fontSize:10,letterSpacing:.6,fontWeight:'700',color:C.accent,backgroundColor:'#18352F',paddingHorizontal:9,paddingVertical:4,borderRadius:6},section:{fontSize:17,fontWeight:'700',color:C.text,marginTop:18,marginBottom:12}
});
