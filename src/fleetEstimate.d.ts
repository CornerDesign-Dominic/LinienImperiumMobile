export type FleetPreviewVehicle={
 cardId:string;model:string;capacity:number;loadedSpeed:number;emptySpeed:number;
 costPerKm:number;loadCostPerTonKm:number;freightPayPerTonKm:number;
 bonuses:{speed:number;cost:number;pay:number;xp:number};
};
export type FleetEstimateVehicle=FleetPreviewVehicle&{
 seconds:number;tours:number;km:number;tons:number;tourCost:number;hourCost:number;
 tourRevenue:number;hourRevenue:number;xp:number;
};
export type FleetEstimate={
 vehicles:FleetEstimateVehicle[];capacity:number;km:number;tons:number;tourCost:number;
 hourCost:number;tourRevenue:number;hourRevenue:number;xp:number;
};
export function estimateFleet(vehicles:FleetPreviewVehicle[],distance:number):FleetEstimate|null;
