// Presentation only: never infer or mutate game rules from an illustration.
const rarities=['common','uncommon','rare','epic','legendary'];
const orderKinds=['private','customer','material','character','referral','special'];
const materials=['capacityModules','companyItems','pickupHints','hubVehicleParts','supplierContacts','expeditionRefills','overtimeRefills'];
export const itemColors={common:'#8B8B8B',uncommon:'#4E995D',rare:'#408BC7',epic:'#A064C3',legendary:'#E89132'};
export function romanTier(value){
 if(!Number.isSafeInteger(value)||value<1||value>3999)return '';
 let result='';for(const [n,s] of [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']])while(value>=n){result+=s;value-=n;}
 return result;
}
export function itemVisual(id,options={}){
 const parts=String(id||'').split(':');
 const explicit=rarities.includes(options.rarity)?options.rarity:null;
 if(parts[0]==='gear'||parts[0]==='shard'){
  const rarity=rarities.includes(parts[1])?parts[1]:'common';
  return {asset:`${parts[0]}-${rarity}`,rarity,tier:options.tier,kind:null,large:false};
 }
 if(materials.includes(id))return {asset:id,rarity:explicit||({expeditionRefills:'uncommon',overtimeRefills:'legendary'}[id]||null),tier:options.tier,kind:null,large:false};
 let kind=options.kind||(['job','order'].includes(parts[0])?parts[1]:parts[0]==='project'?parts[1]:id);
 if(!orderKinds.includes(kind))return null;
 const large=options.large??(parts[0]==='project'||['referral','special'].includes(kind));
 const rarity=explicit||(['referral','special'].includes(kind)?(kind==='referral'?'epic':'rare'):'common');
 return {asset:`scroll-${large?'large':'small'}-${rarity}`,rarity,tier:options.tier??(parts[0]==='job'?Number(parts[2])||undefined:undefined),kind,large};
}
