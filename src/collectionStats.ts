// Keep the numeric value at three decimals; presentation may round to two.
export function averageCardSpeed(loaded?:number,empty?:number):number|undefined{
 if(loaded===undefined||empty===undefined||!Number.isFinite(loaded)||!Number.isFinite(empty))return undefined;
 return Math.round(((loaded+empty)/2)*1000)/1000;
}
const ROMAN=['','I','II','III','IV','V','VI','VII','VIII','IX','X'];
export function rankNumeral(level:number):string{return ROMAN[level]||'—';}
const SPEED_RANK_RARITIES=['common','uncommon','rare','epic','legendary'] as const;
/** Completed ten-rank sections stay visible; only the current section is partial. */
export function speedRankSegments(total?:number):{rarity:typeof SPEED_RANK_RARITIES[number];level:number;numeral:string}[]{
 const rank=typeof total==='number'&&Number.isFinite(total)?Math.min(50,Math.max(0,Math.floor(total))):0;
 return SPEED_RANK_RARITIES.flatMap((rarity,index)=>{
  const level=Math.min(10,Math.max(0,rank-index*10));
  return level?[{rarity,level,numeral:rankNumeral(level)}]:[];
 });
}
/** Card level materials are independent of the vehicle's rarity. */
export function cardLevelMaterial(level?:number):'iron'|'silver'|'gold'|'obsidian'|undefined{
 if(typeof level!=='number'||!Number.isInteger(level)||level<1||level>10)return undefined;
 return level<=3?'iron':level<=6?'silver':level<=9?'gold':'obsidian';
}
