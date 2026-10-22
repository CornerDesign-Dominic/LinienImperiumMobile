'use strict';
const {session}=require('../functions/src/engine.cjs');
const {scaleEvent}=require('../functions/src/events.cjs');
const api=session(null,1800000000000,()=>.5);api.chooseStartCity('hamburg');
const cards=api.view().catalog.cards;
for(const card of cards)api.state.expedition.characters[card.id]={level:1,progress:0};
console.log('Pyramid balance: 240 km, level 1, no capacity/rank upgrades.');
for(const [name,ids]of [
 ['Starter',['navigator']],
 ['Five Common',cards.filter(c=>c.rarity==='common').slice(0,5).map(c=>c.id)],
 ['Region 1',cards.filter(c=>c.region===0).map(c=>c.id)],
 ['Five Epic',cards.filter(c=>c.rarity==='epic').map(c=>c.id)]
]){
 api.state.expedition.seats=[...ids,...Array(5-ids.length).fill(null)];
 const fleet=api.eventFleetOptions(240)[0].vehicles;
 const tonsPerDay=fleet.reduce((sum,v)=>sum+v.capacity*86400000/v.cycleMs,0);
 console.log(JSON.stringify({fleet:name,tonsPer24h:Math.round(tonsPerDay),tonsAtDay3_5With18hPerDayAnd100Overtime:Math.round(tonsPerDay*.75*3.5+100000/240)}));
}
console.log('Initial table; target arrival around day 3.5, five-day event.');
for(const players of [1,25,50,75,100,200,500,1000,1500,2000,5000,10000])console.log(JSON.stringify({players,...scaleEvent(players)}));
