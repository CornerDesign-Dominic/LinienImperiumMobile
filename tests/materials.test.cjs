const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {materialForColor,materialOpacity}=require('../src/materialRules'),C=require('../src/palette.json');
test('Material rules only texture opaque neutral and petrol surfaces, preserving semantic washes and rarity hues',()=>{
 for(const c of [C.bg,C.panel,C.raised])assert.equal(materialForColor(c),'paper');
 for(const c of [C.accent,C.ink,C.inkRaised])assert.equal(materialForColor(c),'petrol');
 for(const c of [undefined,'transparent',C.overlay,C.greenWash,C.redWash,C.blueWash,C.purpleWash,C.goldWash,C.common,C.uncommon,C.rare,C.epic,C.legendary])assert.equal(materialForColor(c),null);
 assert.ok(materialOpacity(C.bg)<materialOpacity(C.panel));
 assert.ok(materialOpacity(C.panel)<.5);assert.ok(materialOpacity(C.accent)<.5);
 assert.equal(materialOpacity(C.panel,true),materialOpacity(C.panel)/2);
});
test('Shared bundled material textures stay within a small offline asset budget',()=>{
 const files=['parchment.jpg','petrol.jpg'].map(name=>path.join(__dirname,'../assets/art/materials',name));
 assert.ok(files.every(file=>fs.statSync(file).size<70000));
 assert.ok(files.reduce((sum,file)=>sum+fs.statSync(file).size,0)<120000);
});
test('Material hosts preserve native events, refs, state styles and render-function children',()=>{
 const {componentHarness}=require('./helpers/component-harness.cjs');
 const React=require('react');
 const native={View:'View',Image:'Image',Pressable:'Pressable',StyleSheet:{create:x=>x,absoluteFill:{position:'absolute'},flatten:x=>Array.isArray(x)?Object.assign({},...x.filter(Boolean)):x}};
 const {exports:m}=componentHarness('Material.tsx',{'react-native':native,'./materialRules':{materialForColor,materialOpacity},'../assets/art/materials/parchment.jpg':1,'../assets/art/materials/petrol.jpg':2});
 const ref={},onPress=()=>{},onLayout=()=>{},style=({pressed})=>({backgroundColor:pressed?C.raised:C.accent});
 const node=m.MaterialPressable.render({style,onPress,disabled:true,children:({pressed})=>pressed?'pressed':'idle'},ref);
 assert.equal(node.props.onPress,onPress);assert.equal(node.props.ref,ref);assert.equal(node.props.disabled,true);assert.equal(node.props.style,style);
 const children=React.Children.toArray(node.props.children({pressed:true}).props.children);
 assert.equal(children[1],'pressed');assert.deepEqual(children[0].props.surfaceStyle,{backgroundColor:C.raised});
 const view=m.MaterialView.render({style:{backgroundColor:C.panel},onLayout,children:'content'},ref);
 assert.equal(view.props.onLayout,onLayout);assert.equal(view.props.ref,ref);assert.equal(React.Children.toArray(view.props.children)[1],'content');
 assert.equal(m.MaterialLayer({surfaceStyle:{backgroundColor:C.redWash}}),null);
 assert.equal(m.MaterialLayer({surfaceStyle:{backgroundColor:C.accent,width:7,height:7}}),null);
 const layer=m.MaterialLayer({surfaceStyle:{backgroundColor:C.panel,borderRadius:7,borderWidth:1}});
 assert.equal(layer.props.pointerEvents,'none');assert.equal(layer.props.importantForAccessibility,'no-hide-descendants');
});
