'use strict';
// Presentation only, including legacy reward labels. Never rename persisted IDs, balances or player-selected names.
function currencyText(text,profile){
 if(typeof text!=='string')return text;
 const protectedNames=[];
 for(const name of [profile?.companyName,profile?.cityName].filter(Boolean)){
  const token='\u0000currency'+protectedNames.length+'\u0000';
  if(text.includes(name)){text=text.split(name).join(token);protectedNames.push([token,name]);}
 }
 text=text.replace(/Erweiterungspunkt/g,'Ausbaupunkt').replace(/Premium-Münzen|Echtgeld-Münzen/g,'Hermes-Siegel').replace(/Testmünzen/g,'Test-Taler').replace(/Expeditionsmünzen/g,'Expeditions-Taler').replace(/Münzenbilanz/g,'Talerbilanz').replace(/Münzerlös/g,'Talererlös').replace(/Münzen|Münze/g,'Imperium-Taler').replace(/(\d) [MT]\b/g,'$1');
 for(const [token,name] of protectedNames)text=text.split(token).join(name);
 return text;
}
module.exports={currencyText};

