const round=value=>Math.round((value+Number.EPSILON)*100)/100;
function estimateFleet(vehicles,distance){
 if(!Number.isFinite(distance)||distance<=0||distance>100000)return null;
 const rows=vehicles.map(vehicle=>{
  const outward=distance/vehicle.loadedSpeed,back=distance/vehicle.emptySpeed,seconds=outward+back;
  const tours=Math.floor(3600/seconds+1e-9),partial=Math.max(0,3600-tours*seconds);
  const partialKm=partial<=outward?partial*vehicle.loadedSpeed:distance+(partial-outward)*vehicle.emptySpeed;
  const distanceCost=round(distance*2*vehicle.costPerKm);
  const loadCost=vehicle.capacity*distance*vehicle.loadCostPerTonKm;
  const pay=vehicle.capacity*distance*vehicle.freightPayPerTonKm*(1+(vehicle.bonuses.pay||0)/100);
  return {...vehicle,seconds,tours,km:round(tours*distance*2+Math.min(distance*2,partialKm)),
   tons:round(tours*vehicle.capacity),tourCost:round(distanceCost+round(loadCost)),
   hourCost:round(tours*distanceCost+round(tours*loadCost)),
   tourRevenue:round(pay),hourRevenue:round(tours*pay),
   xp:round(tours*vehicle.capacity*(1+(vehicle.bonuses.xp||0)/100))};
 });
 const sum=key=>round(rows.reduce((total,row)=>total+row[key],0));
 return {vehicles:rows,capacity:sum('capacity'),km:sum('km'),tons:sum('tons'),
  tourCost:sum('tourCost'),hourCost:sum('hourCost'),tourRevenue:sum('tourRevenue'),hourRevenue:sum('hourRevenue'),xp:sum('xp')};
}
exports.estimateFleet=estimateFleet;
