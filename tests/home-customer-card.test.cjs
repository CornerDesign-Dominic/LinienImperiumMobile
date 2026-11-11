const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
test('Home Stammkunden card shows a round action dot only while an unlocked customer has unspent points',()=>{
 const h=componentHarness('HomeCustomerCard.tsx',{'./Language':{Text:'Text'},'./MenuArt':{MenuArt:'MenuArt'},'./theme':{C:require('../src/palette.json')}});
 let opened=0;
 const customers=[],render=()=>h.render('HomeCustomerCard',{customers,onPress:()=>opened++,styles:{menuRow:{},menuCopy:{},menuTitle:{},menuDetail:{}}});
 let tree=render();assert.equal(tree.props.accessibilityLabel,'Stammkunden');assert.equal(nodes(tree,'View').filter(v=>v.props.testID==='home-customer-points').length,0);
 customers.push({points:0},{points:0});tree=render();assert.equal(nodes(tree,'Icon').filter(i=>i.props.name==='arrow').length,0);
 customers[1].points=3;tree=render();assert.equal(tree.props.accessibilityLabel,'Stammkunden, Verbesserungspunkte verfügbar');
 const badge=nodes(tree,'View').find(v=>v.props.testID==='home-customer-points');assert.ok(badge);assert.equal(badge.props.accessible,false);assert.equal(badge.props.importantForAccessibility,'no-hide-descendants');
 const dot=nodes(badge,'View').find(v=>v.props.style?.backgroundColor===require('../src/palette.json').uncommon);assert.ok(dot);assert.equal(dot.props.style.width,10);assert.equal(dot.props.style.height,10);assert.equal(dot.props.style.borderRadius,5);assert.equal(nodes(tree,'Icon').filter(i=>i.props.name==='arrow').length,0);
 assert.equal(nodes(tree,'Icon').filter(i=>i.props.name==='chevron').length,1);assert.ok(text(tree).includes('Beziehungen und Verbesserungen'));tree.props.onPress();assert.equal(opened,1);
 customers[0].points=1;assert.equal(nodes(render(),'View').filter(v=>v.props.testID==='home-customer-points').length,1,'Multiple customers still have one dot without a counter');
 customers.forEach(c=>c.points=0);tree=render();assert.equal(tree.props.accessibilityLabel,'Stammkunden');assert.equal(nodes(tree,'Icon').filter(i=>i.props.name==='arrow').length,0);
});
