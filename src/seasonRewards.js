// Preview catalogue only. Progression and live claims are not enabled.
const reward=(id,amount)=>Object.freeze({id,amount});
const rows=[
 [reward('gear:common',10),reward('gear:common',25)],
 [reward('coins',500),reward('coins',1500)],
 [reward('gear:common',15),reward('gear:uncommon',3)],
 [reward('pickupHints',10),reward('pickupHints',25)],
 [reward('expeditionRefills',1),reward('expeditionRefills',2)],
 [reward('coins',750),reward('coins',2000)],
 [reward('gear:common',20),reward('gear:uncommon',4)],
 [reward('hubVehicleParts',5),reward('hubVehicleParts',12)],
 [reward('gear:uncommon',2),reward('gear:uncommon',5)],
 [reward('overtimeRefills',1),reward('overtimeRefills',2)],
 [reward('coins',1000),reward('coins',2500)],
 [reward('gear:common',25),reward('gear:uncommon',6)],
 [reward('pickupHints',15),reward('pickupHints',35)],
 [reward('hubVehicleParts',8),reward('hubVehicleParts',18)],
 [reward('companyItems',1),reward('companyItems',2)],
 [reward('coins',1250),reward('coins',3000)],
 [reward('gear:uncommon',3),reward('gear:uncommon',8)],
 [reward('gear:common',30),reward('gear:rare',1)],
 [reward('pickupHints',20),reward('pickupHints',40)],
 [reward('expeditionRefills',1),reward('expeditionRefills',2)],
 [reward('coins',1500),reward('coins',4000)],
 [reward('hubVehicleParts',10),reward('hubVehicleParts',25)],
 [reward('gear:uncommon',4),reward('gear:rare',2)],
 [reward('coins',1750),reward('coins',4500)],
 [reward('overtimeRefills',1),reward('overtimeRefills',2)],
 [reward('gear:common',40),reward('gear:uncommon',10)],
 [reward('pickupHints',25),reward('pickupHints',50)],
 [reward('gear:uncommon',5),reward('gear:rare',3)],
 [reward('companyItems',1),reward('companyItems',3)],
 [reward('capacityModules',1),reward('capacityModules',2)]
];
export const seasonRewards=Object.freeze(rows.map(([free,premium],index)=>Object.freeze({level:index+1,free,premium})));
export const seasonPreview=Object.freeze({level:0,premium:false,freeClaimed:Object.freeze([]),premiumClaimed:Object.freeze([])});
// Pure view state for a future authoritative model; never grants a reward.
export function seasonRewardStatus(level,track,progress=seasonPreview){
 const reached=Number.isFinite(progress.level)?Math.max(0,Math.min(30,Math.floor(progress.level))):0;
 if(track==='premium'&&!progress.premium)return 'premiumLocked';
 if(level>reached)return 'locked';
 const claimed=track==='premium'?progress.premiumClaimed:progress.freeClaimed;
 return Array.isArray(claimed)&&claimed.includes(level)?'claimed':'reached';
}
