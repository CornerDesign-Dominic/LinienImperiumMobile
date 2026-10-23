export type OrderSort='profit'|'speed';
export type OrderQuote={id:string;free:boolean;seconds:number;totalProfit:number;[key:string]:any};
// Busy vehicles stay last in both sorts. Duration means the entire assignment.
export function sortOrderVehicles(choices:OrderQuote[],sort:OrderSort):OrderQuote[]{
 return [...choices].sort((a,b)=>Number(b.free)-Number(a.free)||(sort==='profit'?b.totalProfit-a.totalProfit||a.seconds-b.seconds:a.seconds-b.seconds||b.totalProfit-a.totalProfit)||a.id.localeCompare(b.id));
}
