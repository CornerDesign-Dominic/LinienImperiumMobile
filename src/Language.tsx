import React,{createContext,useContext,useEffect,useState,useRef} from 'react';
import {Text as NativeText,TextProps} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_LANGUAGE,LANGUAGE_STORAGE_KEY,Language,setLanguage,t,validLanguage} from './i18n';
type LanguageContext={language:Language;changeLanguage:(value:Language)=>Promise<void>};
const Context=createContext<LanguageContext>({language:DEFAULT_LANGUAGE,changeLanguage:async()=>{}});
export const useLanguage=()=>useContext(Context);
export function LanguageProvider({children}:{children:React.ReactNode}){
 const [language,update]=useState<Language>(DEFAULT_LANGUAGE),[ready,setReady]=useState(false);
 const writes=useRef<Promise<void>>(Promise.resolve());
 useEffect(()=>{let alive=true;AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then(value=>{if(alive){const next=validLanguage(value);setLanguage(next);update(next);}}).catch(()=>{}).finally(()=>{if(alive)setReady(true);});return()=>{alive=false;};},[]);
 const changeLanguage=async(value:Language)=>{const next=validLanguage(value);const write=writes.current.catch(()=>{}).then(()=>AsyncStorage.setItem(LANGUAGE_STORAGE_KEY,next));writes.current=write;await write;setLanguage(next);update(next);};
 return <Context.Provider value={{language,changeLanguage}}>{ready?children:null}</Context.Provider>;
}
function translatedChildren(children:React.ReactNode):React.ReactNode{
 const list=React.Children.toArray(children);
 if(list.every(c=>typeof c==='string'||typeof c==='number')){
  const combined=list.join(''),translated=t(combined);
  return translated!==combined?translated:list.map(c=>typeof c==='string'?t(c):c);
 }
 return list.map(c=>typeof c==='string'?t(c):c);
}
export function Text({children,literal=false,...props}:TextProps&{literal?:boolean}){
 useLanguage();
 return <NativeText {...props} accessibilityLabel={props.accessibilityLabel?t(props.accessibilityLabel):undefined}>{literal?children:translatedChildren(children)}</NativeText>;
}
