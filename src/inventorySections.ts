import type {StockItem} from './items';

const sections=[
 {id:'refills',title:'Auffüller'},
 {id:'upgrades',title:'Ausbau'},
 {id:'crafting',title:'Herstellung'},
 {id:'materials',title:'Materialien'},
 {id:'shards',title:'Kartensplitter'},
 {id:'orders',title:'Aufträge'},
 {id:'other',title:'Weitere Vorräte'}
] as const;
type SectionId=typeof sections[number]['id'];
const fixed:Record<string,{section:SectionId;rank:number}>={
 expeditionRefills:{section:'refills',rank:0},overtimeRefills:{section:'refills',rank:1},
 capacityModules:{section:'upgrades',rank:0},companyItems:{section:'upgrades',rank:1},hubVehicleParts:{section:'upgrades',rank:2},supplierContacts:{section:'upgrades',rank:3},
 pickupHints:{section:'crafting',rank:0}
};
const rarities=['common','uncommon','rare','epic','legendary'];
function position(item:StockItem):{section:SectionId;rank:number}{
 if(fixed[item.id])return fixed[item.id];
 if(item.id.startsWith('gear:')||item.id.startsWith('shard:')){
  const rarity=rarities.indexOf(item.id.split(':')[1]);
  return {section:item.id.startsWith('gear:')?'materials':'shards',rank:rarity<0?rarities.length:rarity};
 }
 const job=/^job:(material|character):(\d+)$/.exec(item.id);
 if(job)return {section:'orders',rank:(job[1]==='material'?0:100)+Number(job[2])};
 if(item.id.startsWith('order:'))return {section:'orders',rank:200+(item.id==='order:private'?0:1)};
 if(item.id.startsWith('project:'))return {section:'orders',rank:300};
 return {section:'other',rank:0};
}

/** Group visible stock only; retain item references so detail/use actions keep their identity. */
export function inventorySections(items:StockItem[]){
 return sections.map(section=>({...section,items:items.filter(item=>position(item).section===section.id)
  .sort((a,b)=>position(a).rank-position(b).rank||a.id.localeCompare(b.id))})).filter(section=>section.items.length>0);
}
