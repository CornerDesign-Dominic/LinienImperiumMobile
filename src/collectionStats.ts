// Keep the numeric value at three decimals; presentation may round to two.
export function averageCardSpeed(loaded?:number,empty?:number):number|undefined{
 if(loaded===undefined||empty===undefined||!Number.isFinite(loaded)||!Number.isFinite(empty))return undefined;
 return Math.round(((loaded+empty)/2)*1000)/1000;
}
const ROMAN=['','I','II','III','IV','V','VI','VII','VIII','IX','X'];
export function rankNumeral(level:number):string{return ROMAN[level]||'—';}
