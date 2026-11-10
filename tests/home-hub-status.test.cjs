const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const palette=require('../src/palette.json');
test('Home Botenstation places one action dot directly after Voll and keeps partial cycles quiet',()=>{
 const h=componentHarness('HomeHubStatus.tsx',{'./Language':{Text:'Text'},'./theme':{C:palette}});
 for(const cycles of [0,1,5]){
  const tree=h.render('HomeHubStatus',{cycles,textStyle:{fontSize:12}});
  assert.equal(text(tree),`${cycles}/6`);
  assert.equal(nodes(tree,'View').filter(v=>v.props.testID==='home-hub-full').length,0);
 }
 for(const cycles of [6,7]){
  const tree=h.render('HomeHubStatus',{cycles,textStyle:{fontSize:12}});
  assert.equal(text(tree),'Voll');
  const dot=nodes(tree,'View').find(v=>v.props.testID==='home-hub-full');assert.ok(dot);
  assert.equal(dot.props.style.width,10);assert.equal(dot.props.style.height,10);
  assert.equal(dot.props.style.borderRadius,5);assert.equal(dot.props.style.backgroundColor,palette.uncommon);
  assert.equal(dot.props.accessible,false);
  assert.equal(tree.props.children[0].type,'Text');assert.equal(tree.props.children[1].props.testID,'home-hub-full');
 }
});
