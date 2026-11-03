export function projectSections<T extends {isProject?:boolean;status:string;completionReward?:{claimedAt?:number|null}}>(orders:T[]):{orders:T[];active:T[];queued:T[];rewards:T[]};
export function orderedProjectCategories<T extends {rarity?:string;kind?:string;region?:number}>(catalog:T[]):T[];
export function orderedRunningProjects<T extends {isProject?:boolean;status:string;kind?:string;projectInfo?:{rarity?:string;region?:number};completionReward?:{claimedAt?:number|null}}>(orders:T[]):T[];
export function projectClaimSummary(previousOrders:any[],nextOrders:any[],id:string):{count:number;coins:number;gears:Record<string,number>;capacityModules:number;companyItems:number;supplierContacts:number}|null;
