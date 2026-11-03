const {test}=require('node:test'),assert=require('node:assert/strict');
const {journeyPlaceState}=require('../src/journeyLayout');
const state=(discovered=4)=>({discovered,deliveries:Array(7).fill(false),finalClaimed:false});

test('A discovered unstarted bonus trip becomes available without marking the next unknown place',()=>{
 const region=state();
 assert.equal(journeyPlaceState(3,region).icon,'plus');
 assert.equal(journeyPlaceState(3,region).status,'Bonuslieferung verfügbar');
 assert.equal(journeyPlaceState(4,region).icon,null);
 assert.equal(journeyPlaceState(4,region).status,'Erkunden');
 assert.equal(journeyPlaceState(5,region).icon,null);
});
test('Completed places have no checkmark or bonus marker even with stale mission history',()=>{
 const region=state();region.deliveries[2]=true;
 const marker=journeyPlaceState(2,region,[{kind:'delivery',place:2,status:'completed'}]);
 assert.equal(marker.icon,null);assert.equal(marker.status,'Abgeschlossen');
});
test('In-flight and pending old completions do not advertise another bonus trip',()=>{
 assert.equal(journeyPlaceState(2,state(),[{kind:'delivery',place:2,status:'active'}]).icon,'timer');
 assert.equal(journeyPlaceState(2,state(),[{kind:'delivery',place:2,status:'completed'}]).icon,'reward');
 assert.equal(journeyPlaceState(2,state(),[{kind:'endless',place:2,status:'active'}]).icon,'plus');
});
test('The final first delivery is available only after all seven discoveries and disappears when completed',()=>{
 assert.equal(journeyPlaceState(7,state(6)).icon,null);
 const region=state(7);assert.equal(journeyPlaceState(7,region).icon,'plus');
 assert.equal(journeyPlaceState(7,region,[{kind:'final',status:'active'}]).icon,'timer');
 region.finalClaimed=true;assert.equal(journeyPlaceState(7,region).icon,null);
});
