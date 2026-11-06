export type StoryRegion='crownlands'|'plains'|'saffron'|'jade'|'north';
export type StorySelection={region:StoryRegion;stage:number;receipt:boolean;progress:number;customer:string};
export function projectStory(order:any):StorySelection|null;
