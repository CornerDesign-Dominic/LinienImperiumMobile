const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {execute}=require('../functions/src/engine.cjs');
test('Endless gear disclosure presents only actual regional gear amounts and the unchanged probability',()=>{
 const h=componentHarness('Expeditions.tsx',{'./theme':{C:require('../src/palette.json')},'./ExpeditionRegionCard':{},'./ExpeditionJourney':{},'./ExpeditionPlaceDetails':{},'./placePortraits':{},'./regionRoutes':{}});
 const {view}=execute(null,'foundCompany',{companyName:'Test',cityName:'Test'},1800000000000,()=>.5);
 for(const region of view.expeditionMap){
  // Even a stale client payload must not advertise removed bonus finds.
  const gears={...region.finds.gears,shards:3,companyItemsChance:6,moduleChance:.3};
  const tree=h.render('ExpeditionGearFind',{gears,rarities:view.catalog.rarities}),copy=text(tree);
  assert.ok(copy.includes('Zahnräder'));assert.ok(copy.includes('49 %'));
  assert.doesNotMatch(copy,/Splitter|Shard|Zusatzfund|Firmenausbau|Kapazitätsmodul/);
  for(const [rarity,[min,max]]of Object.entries(gears.ranges)){
   assert.ok(copy.includes(`${min}–${max}`));assert.ok(nodes(tree,'ItemArt').some(n=>n.props.id==='gear:'+rarity));
  }
  assert.ok(nodes(tree,'ItemArt').every(n=>n.props.id.startsWith('gear:')));
 }
 h.unmount();
});
