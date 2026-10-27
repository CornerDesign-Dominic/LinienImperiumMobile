import {n} from './ui';
import {t} from './i18n';
export const BONUS:Record<string,string>={speed:'Tempo',cost:'Kostenersparnis',pay:'Frachtvergütung',xp:'Spieler-XP',overtimeCapacity:'Überstundenmaximum',expeditionCapacity:'Expeditionsmaximum',expeditionRegen:'Expeditionsregeneration'};
export const SCOPE:Record<string,string>={self:'Dieses Fahrzeug',fleet:'Alle Fahrzeuge im Großauftrag',garage:'Alle Fahrzeuge in der Garage'};
export const pointBonus=(card:any)=>['overtimeCapacity','expeditionCapacity','expeditionRegen'].includes(card.stat);
export function bonusValue(card:any,value:number,decimals=2){
 if(card.stat==='expeditionRegen')return `−${n(value)} ${t('Sek.')}`;
 if(pointBonus(card))return `+${n(value)} ${t('Punkte')}`;
 return `${card.stat==='cost'?'−':'+'}${n(value,decimals)} %`;
}
export const bonusText=(card:any,value:number)=>`${bonusValue(card,value)} ${t(BONUS[card.stat])}`;

export function bonusSentence(card:any,value:number){
 const amount=n(value,2);
 if(card.stat==='overtimeCapacity')return t(`Erhöht das Überstundenmaximum um ${amount} Punkte.`);
 if(card.stat==='expeditionCapacity')return t(`Erhöht das Expeditionsmaximum um ${amount} Punkte.`);
 if(card.stat==='expeditionRegen')return t(`Verkürzt die Wartezeit pro Expeditionspunkt um ${amount} Sek.`);
 const scope=({self:'dieses Fahrzeugs',fleet:'aller Fahrzeuge im Großauftrag',garage:'aller Fahrzeuge in der Garage'} as Record<string,string>)[card.scope]||'dieses Fahrzeugs';
 const template=({speed:'Erhöht die Geschwindigkeit',cost:'Senkt die Betriebskosten',pay:'Erhöht die Frachtvergütung',xp:'Erhöht die Spieler-XP'} as Record<string,string>)[card.stat];
 return t(`${template} ${scope} um ${amount} %.`);
}
