// Visual identities only. Array order maps to the existing seven places and final destination.
// Coordinates are normalized against the complete 3:1 panorama, not the device screen.
export type JourneyPlace={name:string;x:number;y:number};
// Measured against each finished painting, so signs sit below the actual landmark.
const positions=[
 [[.064,.496],[.197,.546],[.323,.486],[.443,.606],[.547,.396],[.676,.506],[.79,.416],[.935,.626]],
 [[.07,.506],[.19,.526],[.31,.476],[.455,.546],[.565,.556],[.665,.616],[.795,.656],[.935,.616]],
 [[.065,.456],[.19,.486],[.325,.526],[.448,.616],[.565,.556],[.69,.636],[.80,.586],[.935,.646]],
 [[.06,.606],[.21,.646],[.315,.546],[.445,.586],[.565,.456],[.687,.606],[.815,.616],[.935,.516]],
 [[.058,.546],[.185,.546],[.32,.496],[.438,.566],[.565,.466],[.69,.566],[.815,.476],[.935,.596]],
];
const route=(region:number,names:string[]):JourneyPlace[]=>{const anchors=positions[region];return names.map((name,i)=>({name,x:anchors[i][0],y:anchors[i][1]}));};
export const regionRoutes=[
 {image:require('../assets/art/journeys/crownlands.jpg'),places:route(0,['Lindenweiler','Die alte Kornmühle','Gasthof zur Post','Steinbogenbrücke','Gut Eichenhain','Marktstadt Falkenau','Das Kronentor','Kronenhafen'])},
 {image:require('../assets/art/journeys/prairies.jpg'),places:route(1,['Rotfelsstation','Der tiefe Brunnen','Staubweide','Die Wagenrast','Weidenfurt','Mühlenwinkel','Ufermarkt','Weidenhafen'])},
 {image:require('../assets/art/journeys/saffron-road.jpg'),places:route(2,['Staubtor','Die Salzterrassen','Safranhöfe','Brunnen der Reisenden','Pass der Windtürme','Der Teppichhof','Basar der blauen Kuppeln','Karawanserei der sieben Bögen'])},
 {image:require('../assets/art/journeys/jade-valley.jpg'),places:route(3,['Dorf der Reisterrassen','Bambusfähre','Jadebrücke','Der Seidenhof','Teehang','Die Felsenwinde','Markt unter der Mauer','Handelshof am Jadetor'])},
 {image:require('../assets/art/journeys/northmark.jpg'),places:route(4,['Birkenrast','Der große Holzhof','Silbersee','Taigapost','Kupferstollen','Glockendorf','Speicher am Eisstrom','Handelsfeste am Eisstrom'])},
];
