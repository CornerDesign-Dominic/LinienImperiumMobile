import C from './palette.json';
import names from '../functions/src/item-names.json';
export const itemName=(id:string,amount=1)=>((names as Record<string,string[]>)[id]||[id,id])[amount===1?0:1];
export const rarityColor=(id:string)=>({common:C.common,uncommon:C.uncommon,rare:C.rare,epic:C.epic,legendary:C.legendary} as Record<string,string>)[id]||C.common;
export type StockItem={id:string;name:string;amount:number;source:string;description:string;recipe?:string;craft?:boolean;use?:string;refill?:'expedition'|'overtime';kind?:string;rarity?:string;color?:string};
export function stockItems(data:any):StockItem[]{
 const {state:g,catalog:c}=data;
 const recipes=c.recipes||[];
 const recipeFor=(id:string)=>recipes.find((r:any)=>r.outputId===id);
 const recipeText=(id:string)=>{const r=recipeFor(id);return r?`${r.needed} ${r.input} → 1 ${r.output}`:undefined;};
 const material=(id:string,source:string,description:string,use?:string):StockItem=>({id,name:itemName(id),amount:g.inventory[id]||0,source,description,use,craft:recipes.some((r:any)=>r.inputId===id)});
 const items:StockItem[]=[
  {...material('expeditionRefills','Levelaufstieg.',`Gibt ${c.refillPoints?.expedition??50} Expeditionspunkte – auch über das Maximum hinaus.`),refill:'expedition',color:rarityColor('uncommon')},
  {...material('overtimeRefills','Levelaufstieg.',`Gibt ${c.refillPoints?.overtime??50} Überstundenpunkte – auch über das Maximum hinaus.`),refill:'overtime',color:rarityColor('legendary')},
  material('capacityModules','Endlosorte und seltene Auftragsbeute.','Erhöht die Fahrzeugkapazität um 0,5 t.'),
  material('companyItems','Normale Aufträge und Materialaufträge.',`Für Firmenausbau. ${g.inventory.companyItemTkmRemainder||0} / 750.000 tkm zum nächsten Item.`,'company'),
  material('pickupHints','Kasse des Stadthubs.','Für die Herstellung von Privatabholungen.'),
  material('hubVehicleParts','Fundkisten und Einkäufe des Stadthubs.','Für Laderaum und Antrieb der Stadttransporter.','hub'),
  material('supplierContacts','Privatabholungen.','Für den Ausbau des Stadthub-Vertriebs.','hub'),
  ...c.rarities.map((r:any)=>({id:`gear:${r.id}`,name:`${r.label}-Zahnrad`,amount:g.inventory.gears[r.id]||0,source:'Abschlussprämien aus Aufträgen.',description:'Verbessert den Geschwindigkeitsrang eines Fahrzeugs.',color:rarityColor(r.id)})),
  ...c.rarities.filter((rarity:any)=>c.cards.some((card:any)=>card.rarity===rarity.id)).map((r:any)=>({id:`shard:${r.id}`,name:`${r.label}-Shard`,amount:g.expedition.shards[r.id]||0,source:'Materialaufträge, Fahrzeugkartenaufträge und doppelte Fahrzeugkarten.',description:'Für Kartenstufen und Fahrzeugboni.',recipe:recipeText(`shard:${r.id}`),craft:recipes.some((recipe:any)=>recipe.inputId===`shard:${r.id}`||recipe.outputId===`shard:${r.id}`),use:'cards',color:rarityColor(r.id)}))
 ];
 for(const kind of ['material','character'])for(const rank of [1,2,3]){
  const amount=g.expedition.jobs.filter((j:any)=>j.kind===kind&&([1,2,3].includes(j.tier)?j.tier:1)===rank).length;
  items.push({id:`job:${kind}:${rank}`,name:`${itemName(kind)} · Rang ${rank}`,amount,source:'Endlosexpeditionen.',description:'Starten unter Einzelaufträge → Aufträge aus Vorräten.',use:'savedOrders',color:rarityColor(['common','uncommon','rare'][rank-1])});
 }
 for(const kind of ['private','customer'])items.push({id:`order:${kind}`,name:itemName(kind),amount:g.orders.filter((o:any)=>!o.isProject&&o.status==='queued'&&(kind==='private'?o.kind==='private':o.kind!=='private')).length,source:kind==='private'?'Herstellung aus Abholhinweisen.':'Herstellung und Expeditionen.',description:'Starten unter Einzelaufträge → Aufträge aus Vorräten.',recipe:recipeText(kind),craft:true,use:'savedOrders'});
 const projectGroups=new Map<string,any[]>();
 for(const o of g.orders.filter((o:any)=>o.isProject&&o.status==='queued')){const key=o.projectInfo.key;projectGroups.set(key,[...(projectGroups.get(key)||[]),o]);}
 for(const [key,orders] of projectGroups){const o=orders[0];items.push({id:`project:${key}`,kind:o.kind==='referral'?'referral':'special',rarity:o.kind==='referral'?'epic':'rare',name:`${o.kind==='referral'?'Empfehlungsauftrag':'Sonderauftrag'} ${(o.projectName||'').replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'')}`,amount:orders.length,source:'Expeditionen und Stammkunden.',description:'Mit einer Flotte unter Großaufträge starten.',use:'projects',color:rarityColor(o.kind==='referral'?'epic':'rare')});}
 return items;
}
