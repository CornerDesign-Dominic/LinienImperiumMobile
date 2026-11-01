// Persistent vehicle/command IDs remain untouched. Only human-facing labels change.
function courierName(truck){
 if(truck.displayName)return truck.displayName;
 if(truck.name)return truck.name;
 return /^LKW-(\d+)$/.test(truck.id)?truck.id.replace(/^LKW-(\d+)$/,'Bote $1'):truck.id;
}
function courierModel(truck){
 return truck.displayModel||(!truck.model||truck.model==='Stadttransporter'?'Lastwombat':truck.model);
}
function courierText(text,trucks,profile){
 if(typeof text!=='string')return text;
 const protectedNames=[profile?.companyName,profile?.cityName].filter(Boolean),saved=[];
 for(const name of protectedNames){const token='\u0000courier'+saved.length+'\u0000';saved.push([token,name]);text=text.split(name).join(token);}
 const names=new Map(trucks.filter(t=>!t.cardId&&t.tier<=1).map(t=>[t.id,courierName(t)]));
 text=text.replace(/\bLKW-\d+\b/g,id=>names.get(id)||id).replace(/Stadttransporter/g,'Lastwombat-Boten');
 for(const [token,name]of saved)text=text.split(token).join(name);
 return text;
}
module.exports={courierName,courierModel,courierText};
