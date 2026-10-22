export type JourneyGeometry={worldWidth:number;imageHeight:number;imageTop:number;anchors:{x:number;y:number}[];visible:number[];fogStart:number;contentWidth:number};
export function visibleJourneyPlaces(discovered:number):number[];
export function journeyGeometry(width:number,height:number,places:{x:number;y:number}[],discovered:number):JourneyGeometry|null;
export function journeyOffset(geometry:JourneyGeometry,width:number,index:number,saved?:number|null):number;
export function journeyFocus(discovered:number,deliveries:boolean[],finalClaimed:boolean):number;
export function adjacentJourneyRegion(maps:{open:boolean}[],region:number,direction:number):number|null;
