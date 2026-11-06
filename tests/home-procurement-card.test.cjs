const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const palette=require('../src/palette.json');
test('Home procurement card shows one green dot only for ready loot, without counting active tours or loot amounts',()=>{
 const h=componentHarness('HomeProcurementCard.tsx',{'./Language':{Text:'Text'},'./MenuArt':{MenuArt:'MenuArt'},'./theme':{C:palette}});
 let opened=0;
 const procurement={pending:{common:0,uncommon:0,rare:0,companyItems:0},runs:[{status:'active'},{status:'active'}]};
 const render=()=>h.render('HomeProcurementCard',{procurement,onPress:()=>opened++,styles:{menuRow:{},menuCopy:{},menuTitle:{},menuDetail:{}}});
 let tree=render();assert.equal(tree.props.accessibilityLabel,'Materialbeschaffung');assert.equal(nodes(tree,'View').filter(v=>v.props.testID==='home-procurement-ready').length,0);
 procurement.pending.rare=1;tree=render();assert.equal(tree.props.accessibilityLabel,'Materialbeschaffung, Loot abholbereit');
 const badge=nodes(tree,'View').find(v=>v.props.testID==='home-procurement-ready');assert.ok(badge);assert.equal(badge.props.accessible,false);assert.equal(badge.props.importantForAccessibility,'no-hide-descendants');assert.equal(text(badge),'');
 const dot=nodes(badge,'View').find(v=>v.props.style?.backgroundColor===palette.uncommon);assert.ok(dot);assert.equal(dot.props.style.borderRadius,5);assert.equal(nodes(tree,'Icon').filter(i=>i.props.name==='reward').length,0);
 procurement.pending.common=999;procurement.pending.companyItems=3;tree=render();assert.equal(nodes(tree,'View').filter(v=>v.props.testID==='home-procurement-ready').length,1);assert.ok(!text(tree).includes('999'));tree.props.onPress();assert.equal(opened,1);
 Object.keys(procurement.pending).forEach(key=>procurement.pending[key]=0);tree=render();assert.equal(tree.props.accessibilityLabel,'Materialbeschaffung');assert.equal(nodes(tree,'View').filter(v=>v.props.testID==='home-procurement-ready').length,0);
 const missing=h.render('HomeProcurementCard',{onPress:()=>{},styles:{}});assert.equal(missing.props.accessibilityLabel,'Materialbeschaffung');
});
