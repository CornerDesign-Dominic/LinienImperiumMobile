// Mobile-only balance; the pinned web baseline remains unchanged.
const LEGACY_TRANSPORT_LIMITS = {
  national: {volume:50,range:50}, international: {volume:150,range:100}
};
for(const limits of Object.values(TRANSPORT_UPGRADE_LIMITS))Object.assign(limits,{premium:1000,volume:100,range:100});

// Interpolate cumulative legacy spend so splitting/combining purchases cannot
// exploit rounding, and each quantity/range track retains its full budget.
function legacyTransportSpend(category,kind,level,items=false){
  const equivalent=LEGACY_TRANSPORT_LIMITS[category][kind]*level/100;
  const whole=Math.floor(equivalent),fraction=equivalent-whole;
  const cost=n=>items?2+Math.floor((n-1)/10):({volume:50,range:100})[kind]*n*n;
  let total=0;for(let n=1;n<=whole;n++)total+=cost(n);
  return Math.round(total+fraction*cost(whole+1));
}
function mobileTransportPrice(category,kind,level){
  if(kind==='premium')return {coins:1000*level,items:1+Math.floor((level-1)/25)};
  return {
    coins:legacyTransportSpend(category,kind,level)-legacyTransportSpend(category,kind,level-1),
    items:legacyTransportSpend(category,kind,level,true)-legacyTransportSpend(category,kind,level-1,true)
  };
}
function migrateCompanyTransport(){
  if(game.companyTransportVersion===1)return;
  for(const category of ['national','international']){
    const track=companyFor().transportUpgrades[category];
    for(const kind of ['volume','range']){
      const old=Math.max(0,Math.min(LEGACY_TRANSPORT_LIMITS[category][kind],Math.floor(Number(track[kind+'Level'])||0)));
      // Round upward so no purchased transport capability is lost.
      track[kind+'Level']=Math.ceil(old*100/LEGACY_TRANSPORT_LIMITS[category][kind]);
    }
  }
  game.companyTransportVersion=1;
}
transportRules=(category,company=game?.company)=>{
  const base=TRANSPORT_BASE[category];if(!base)return null;
  const upgrade=company?.transportUpgrades?.[category]||{};
  const level=kind=>clamp(Math.floor(Number(upgrade[kind+'Level'])||0),0,TRANSPORT_UPGRADE_LIMITS[category][kind]);
  const volume=level('volume')*LEGACY_TRANSPORT_LIMITS[category].volume/100;
  return {...base,minVolume:base.minVolume+Math.floor(volume/2),maxVolume:base.maxVolume+volume,
    maxDistance:base.maxDistance+level('range')*LEGACY_TRANSPORT_LIMITS[category].range/100,premiumBonus:level('premium')/100};
};
transportUpgradeCost=(category,kind)=>{
  const limits=TRANSPORT_UPGRADE_LIMITS[category];if(!limits||!Object.hasOwn(limits,kind))return null;
  const level=companyFor().transportUpgrades[category][kind+'Level'];
  return level>=limits[kind]?null:mobileTransportPrice(category,kind,level+1);
};
const originalCompanyCreateOrder=createOrder;
createOrder=(id,options={})=>{
  const order=originalCompanyCreateOrder(id,options);
  if(!options.starter&&order.kind==='normal'&&TRANSPORT_BASE[order.category]){
    const rules=transportRules(order.category,options.company||game?.company);
    // Half-ton upper bounds give intermediate quantity levels a real effect.
    if(!Number.isInteger(rules.maxVolume))order.volume=order.baseVolume=random(rules.minVolume*2,rules.maxVolume*2)/2;
  }
  return order;
};
// Keep previously crafted customer orders usable; disable only new crafting.
craftCustomerOrder=()=>{throw Error('Kundenaufträge aus Firmenausbau-Items sind vorerst nicht herstellbar.');};
