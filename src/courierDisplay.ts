import {n} from './ui';

export type CourierMeasure='capacity'|'speed'|'distance';
/** Presentation units for couriers only. Never use these values for gameplay. */
export function courierMeasure(value:number,measure:CourierMeasure,digits=2){
 const shown=measure==='capacity'?value*10:value;
 const unit=measure==='capacity'?'kg':measure==='speed'?'m/s':'m';
 return `${n(shown,digits)} ${unit}`;
}
