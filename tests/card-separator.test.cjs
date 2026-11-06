const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes}=require('./helpers/component-harness.cjs');
const flat=styles=>Array.isArray(styles)?Object.assign({},...styles):styles;
test('Collection ornament uses two mirrored continuous triangles around a fixed centered rarity diamond at narrow mobile widths',()=>{
 for(const viewport of [320,360,390,430]){
  const h=componentHarness('CardSeparator.tsx'),color='#286EA6',render=()=>h.render('CardSeparator',{color});let tree=render();const width=(viewport-7-9)/3-14;
  tree.props.onLayout({nativeEvent:{layout:{width}}});tree=render();assert.equal(tree.props.pointerEvents,'none');assert.equal(tree.props.accessible,false);assert.equal(tree.props.importantForAccessibility,'no-hide-descendants');
  const ornament=flat(tree.props.style);assert.equal(ornament.height,5);assert.equal(ornament.marginHorizontal,7);assert.equal(ornament.marginTop,5);assert.equal(ornament.marginBottom,0);
  const children=nodes(tree,'View').filter(v=>v!==tree);assert.equal(children.length,3,'One triangle per wing, no appended rectangle segments');
  const [left,diamond,right]=children.map(v=>flat(v.props.style));assert.equal(left.left,0);assert.equal(right.right,0);assert.equal(left.width,0);assert.equal(right.width,0);assert.equal(left.height,0);assert.equal(right.height,0);assert.equal(left.borderRightWidth,right.borderLeftWidth);assert.ok(left.borderRightWidth>0);assert.equal(left.borderWidth,0);assert.equal(left.borderColor,'transparent');assert.equal(right.borderColor,'transparent');assert.equal(left.borderRightColor,color);assert.equal(right.borderLeftColor,color);
  assert.equal(left.borderTopWidth,.75);assert.equal(left.borderBottomWidth,.75);assert.equal(right.borderTopWidth,.75);assert.equal(right.borderBottomWidth,.75);assert.equal(left.top,right.top);assert.equal(left.borderRightWidth*2+14,width);
  assert.equal(diamond.left,'50%');assert.equal(diamond.marginLeft,-2);assert.equal(diamond.width,4);assert.equal(diamond.height,4);assert.equal(diamond.transform[0].rotate,'45deg');assert.equal(diamond.backgroundColor,color);
  // Line wings terminate five points before the four-point center square.
  assert.ok(Math.abs((width/2-2)-left.borderRightWidth-5)<1e-9);
  tree.props.onLayout({nativeEvent:{layout:{width}}});assert.equal(flat(nodes(render(),'View')[1].props.style).borderRightWidth,left.borderRightWidth);
  const recolored=h.render('CardSeparator',{color:'#894B94'});assert.equal(flat(nodes(recolored,'View')[1].props.style).borderRightColor,'#894B94');
 }
});
