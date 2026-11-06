const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const C=require('../src/palette.json');
const setup=()=>componentHarness('PageHeader.tsx',{'./Language':{Text:'Text'},'./theme':{C,displayFont:'serif'}});
const byId=(tree,id)=>[...nodes(tree,'View'),...nodes(tree,'Text')].find(node=>node.props.testID===id);
test('Parchment header retains working controls and balanced 44px slots; home has no back button',()=>{
 const h=setup();let back=0,help=0;const props={title:'Botenstation',onBack:()=>back++,onHelp:()=>help++};
 let tree=h.render('PageHeader',props),buttons=nodes(tree,'Pressable');assert.equal(buttons.length,2);
 buttons.find(b=>b.props.accessibilityLabel==='Zurück').props.onPress();buttons.find(b=>b.props.accessibilityLabel==='Spielhilfe').props.onPress();assert.deepEqual([back,help],[1,1]);
 assert.deepEqual(buttons.map(b=>b.props.style({pressed:false})[0]).map(s=>[s.width,s.height]),[[44,44],[44,44]]);
 tree=h.render('PageHeader',{...props,title:'Start',home:true});buttons=nodes(tree,'Pressable');assert.equal(buttons.length,1);assert.equal(buttons[0].props.accessibilityLabel,'Spielhilfe');
 const placeholder=byId(tree,'page-header-back-placeholder');assert.equal(placeholder.props.onPress,undefined);assert.equal(placeholder.props.style.width,44);
 assert.equal(text(byId(tree,'page-header-title')),'Start');
 const row=byId(tree,'page-header').props.style;assert.equal(row.backgroundColor,C.panel);assert.equal(row.borderBottomColor,C.brass);assert.equal(row.margin,undefined);assert.equal(row.borderRadius,undefined);
 assert.equal(nodes(tree,'MaterialLayer').length,1);assert.equal(nodes(tree,'MaterialLayer')[0].props.kind,'paper');assert.equal(nodes(tree,'Icon').length,0);
});
test('Title is directly on parchment, centered, naturally wrapping and never forced into uppercase or shrinking',()=>{
 const h=setup(),props={title:'Materialbeschaffung',onBack:()=>{},onHelp:()=>{}},tree=h.render('PageHeader',props),title=byId(tree,'page-header-title');
 assert.equal(text(title),'Materialbeschaffung');assert.equal(title.props.numberOfLines,undefined);assert.equal(title.props.adjustsFontSizeToFit,undefined);assert.equal(title.props.style.textAlign,'center');assert.equal(title.props.style.color,C.ink);assert.equal(title.props.style.fontFamily,'serif');
 assert.equal(title.props.style.backgroundColor,undefined);assert.equal(title.props.style.borderWidth,undefined);assert.equal(title.props.style.shadowColor,undefined);
 assert.equal(nodes(tree,'Icon')[0].props.color,C.ink);
 const noHelp=h.render('PageHeader',{title:'Spielhilfe',onBack:()=>{}});assert.ok(byId(noHelp,'page-header-help-placeholder'));assert.equal(nodes(noHelp,'Pressable').length,1);
});
test('Brass ornaments use measured free space and disappear for narrow or multiline titles',()=>{
 const h=setup(),props={title:'Start',onBack:()=>{},home:true};let tree=h.render('PageHeader',props);
 byId(tree,'page-header-center').props.onLayout({nativeEvent:{layout:{width:240}}});byId(tree,'page-header-title').props.onTextLayout({nativeEvent:{lines:[{width:45}]}});
 tree=h.render('PageHeader',props);const ornaments=byId(tree,'page-header-ornaments');assert.ok(ornaments);assert.equal(ornaments.props.pointerEvents,'none');assert.equal(ornaments.props.importantForAccessibility,'no-hide-descendants');
 assert.equal(ornaments.props.children[0].props.width,72);assert.equal(ornaments.props.children[1].props.reverse,true);
 byId(tree,'page-header-center').props.onLayout({nativeEvent:{layout:{width:90}}});tree=h.render('PageHeader',props);assert.equal(byId(tree,'page-header-ornaments'),undefined);
 byId(tree,'page-header-center').props.onLayout({nativeEvent:{layout:{width:240}}});byId(tree,'page-header-title').props.onTextLayout({nativeEvent:{lines:[{width:180},{width:100}]}});tree=h.render('PageHeader',props);assert.equal(byId(tree,'page-header-ornaments'),undefined);
});
