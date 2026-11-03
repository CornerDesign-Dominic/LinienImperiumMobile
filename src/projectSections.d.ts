export function projectSections<T extends {isProject?:boolean;status:string;completionReward?:{claimedAt?:number|null}}>(orders:T[]):{orders:T[];active:T[];queued:T[];rewards:T[]};
export function orderedProjectCategories<T extends {rarity?:string;kind?:string;region?:number}>(catalog:T[]):T[];
