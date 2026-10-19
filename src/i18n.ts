import english from './locales/en.json';
import englishHelp from './locales/en-help.json';
export const LANGUAGES=[{id:'de',label:'Deutsch',locale:'de-DE'},{id:'en',label:'English',locale:'en-GB'}] as const;
export type Language=typeof LANGUAGES[number]['id'];
export const DEFAULT_LANGUAGE:Language='de';
export const LANGUAGE_STORAGE_KEY='linienimperium.language';
const catalogs:Record<Language,Record<string,string>>={de:{},en:english};
const helpCatalogs:Partial<Record<Language,Record<string,string[][]>>>={en:englishHelp};
export const localizedHelp=(section:string,fallback:string[][]):string[][]=>helpCatalogs[language]?.[section]??fallback;
let language:Language=DEFAULT_LANGUAGE;
export const validLanguage=(value:unknown):Language=>LANGUAGES.some(l=>l.id===value)?value as Language:DEFAULT_LANGUAGE;
export const setLanguage=(value:Language)=>{language=validLanguage(value);};
export const getLanguage=()=>language;
export const getLocale=()=>LANGUAGES.find(l=>l.id===language)!.locale;
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// Legacy dynamic server messages are matched as whole messages, never rewritten in saved data.
const buildPatterns=(catalog:Record<string,string>)=>Object.entries(catalog).filter(([key])=>/\{\d+\}/.test(key)).map(([key,value])=>{
 const slots:number[]=[];let at=0,source='';
 for(const match of key.matchAll(/\{(\d+)\}/g)){source+=escape(key.slice(at,match.index))+'(.+?)';slots.push(Number(match[1]));at=match.index!+match[0].length;}
 return {regex:new RegExp('^'+source+escape(key.slice(at))+'$','s'),value,slots,weight:key.replace(/\{\d+\}/g,'').length};
}).sort((a,b)=>b.weight-a.weight);
const patterns=Object.fromEntries(Object.entries(catalogs).map(([id,catalog])=>[id,buildPatterns(catalog)])) as Record<Language,ReturnType<typeof buildPatterns>>;
const uppercase=Object.fromEntries(Object.entries(catalogs).map(([id,catalog])=>[id,Object.fromEntries(Object.entries(catalog).map(([key,value])=>[key.toUpperCase(),value.toUpperCase()]))])) as Record<Language,Record<string,string>>;
export function t(value:unknown,depth=0):string{
 const raw=String(value??'');if(language==='de'||depth>5)return raw;
 const key=raw.trim().replace(/\u00ad/g,''),catalog=catalogs[language];
 const wrap=(text:string)=>raw.slice(0,raw.indexOf(raw.trim()))+text+raw.slice(raw.trimEnd().length);
 if(catalog[key]!==undefined)return wrap(catalog[key]);
 if(uppercase[language][key])return wrap(uppercase[language][key]);
 for(const p of patterns[language]){const m=key.match(p.regex);if(m){const args:Record<number,string>={};p.slots.forEach((slot,i)=>args[slot]=t(m[i+1],depth+1));return wrap(p.value.replace(/\{(\d+)\}/g,(_,i)=>args[Number(i)]));}}
 // Compound presentation labels keep numbers, punctuation and unknown proper names intact.
 if(/\n| · | → /.test(key))return wrap(key.split(/(\n| · | → )/).map(part=>/^(\n| · | → )$/.test(part)?part:t(part,depth+1)).join(''));
 return raw;
}
