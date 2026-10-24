export type ItemOptions={rarity?:string;kind?:string;large?:boolean;tier?:number};
export type ItemVisual={asset:string;rarity:string|null;tier?:number;kind:string|null;large:boolean};
export const itemColors:Record<string,string>;
export function romanTier(value?:number):string;
export function itemVisual(id:string,options?:ItemOptions):ItemVisual|null;
