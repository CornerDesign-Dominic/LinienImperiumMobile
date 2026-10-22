import {n} from './ui';
import {t} from './i18n';
export const BONUS:Record<string,string>={speed:'Tempo',cost:'Kostenersparnis',pay:'Frachtvergütung',xp:'Spieler-XP',overtimeCapacity:'Überstundenmaximum',expeditionCapacity:'Expeditionsmaximum',expeditionRegen:'Expeditionsregeneration'};
export const SCOPE:Record<string,string>={self:'Dieses Fahrzeug',fleet:'Alle Fahrzeuge im Großauftrag',garage:'Alle Fahrzeuge in der Garage'};
export const pointBonus=(card:any)=>['overtimeCapacity','expeditionCapacity','expeditionRegen'].includes(card.stat);
export function bonusValue(card:any,value:number){
 if(card.stat==='expeditionRegen')return `−${n(value)} ${t('Sek.')}`;
 if(pointBonus(card))return `+${n(value)} ${t('Punkte')}`;
 return `${card.stat==='cost'?'−':'+'}${n(value,1)} %`;
}
export const bonusText=(card:any,value:number)=>`${bonusValue(card,value)} ${t(BONUS[card.stat])}`;
