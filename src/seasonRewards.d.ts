export type SeasonReward={id:string;amount:number};
export type SeasonProgress={level:number;premium:boolean;freeClaimed:readonly number[];premiumClaimed:readonly number[]};
export type SeasonStatus='premiumLocked'|'locked'|'claimed'|'reached';
export const seasonRewards:readonly {level:number;free:SeasonReward;premium:SeasonReward}[];
export const seasonPreview:SeasonProgress;
export function seasonRewardStatus(level:number,track:'free'|'premium',progress?:SeasonProgress):SeasonStatus;
