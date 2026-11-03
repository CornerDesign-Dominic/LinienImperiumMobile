'use strict';
// Presentation only, including legacy reward labels. Never rename persisted IDs, balances or player-selected names.
function currencyText(text,profile){
 if(typeof text!=='string')return text;
 const protectedNames=[];
 for(const name of [profile?.companyName,profile?.cityName].filter(Boolean)){
  const token='\u0000currency'+protectedNames.length+'\u0000';
  if(text.includes(name)){text=text.split(name).join(token);protectedNames.push([token,name]);}
 }
 // Legacy station labels are normalized only after protecting player-selected names.
 for(const [legacy,label] of [["Stadthub Händler", "Botenstation-Händler"], ["Stadthub-Botenplatz", "Botenplatz"], ["Stadthub Fahrzeug", "Botenplatz"], ["Stadt-Hub", "Botenstation"], ["Stadthub-", "Botenstation-"], ["Hub-", "Botenstation-"], ["des Stadthubs", "der Botenstation"], ["aus dem Stadthub", "aus der Botenstation"], ["dem Stadthub", "der Botenstation"], ["im Stadthub", "in der Botenstation"], ["Im Stadthub", "In der Botenstation"], ["den Stadthub", "die Botenstation"], ["zum Stadthub", "zur Botenstation"], ["Zum Stadthub", "Zur Botenstation"], ["Dein Stadthub", "Deine Botenstation"], ["dein Stadthub", "deine Botenstation"], ["deinen Stadthub", "deine Botenstation"], ["Der Stadthub", "Die Botenstation"], ["der Stadthub", "die Botenstation"], ["Stadthubs", "Botenstation"], ["Stadthub", "Botenstation"], ["Im Hub", "In der Botenstation"], ["im Hub", "in der Botenstation"], ["Aus Hub", "Aus der Botenstation"], ["der Hub", "die Botenstation"]])text=text.replaceAll(legacy,label);
 text=text.replace(/\bHub\b/g,'Botenstation');
 text=text.replace(/Erweiterungspunkt/g,'Ausbaupunkt').replace(/Premium-Münzen|Echtgeld-Münzen/g,'Hermes-Siegel').replace(/Testmünzen/g,'Test-Taler').replace(/Expeditionsmünzen/g,'Expeditions-Taler').replace(/Münzenbilanz/g,'Talerbilanz').replace(/Münzerlös/g,'Talererlös').replace(/Münzen|Münze/g,'Imperium-Taler').replace(/(\d) [MT]\b/g,'$1');
 for(const [token,name] of protectedNames)text=text.split(token).join(name);
 return text;
}
module.exports={currencyText};

