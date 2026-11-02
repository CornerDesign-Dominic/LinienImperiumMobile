const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const setup=()=>componentHarness('PageHeader.tsx',{'./Language':{Text:'Text'},'./theme':{C:require('../src/palette.json'),displayFont:'serif'}});
test('Page header routes back/help actions and home reserves the back position without a button',()=>{
 const h=setup();let back=0,help=0;const props={title:'Stadthub',onBack:()=>back++,onHelp:()=>help++};
 let tree=h.render('PageHeader',props),buttons=nodes(tree,'Pressable');assert.equal(buttons.length,2);
 buttons.find(b=>b.props.accessibilityLabel==='Zurück').props.onPress();buttons.find(b=>b.props.accessibilityLabel==='Spielhilfe').props.onPress();assert.deepEqual([back,help],[1,1]);
 tree=h.render('PageHeader',{...props,title:'Start',home:true});buttons=nodes(tree,'Pressable');assert.equal(buttons.length,1);assert.equal(buttons[0].props.accessibilityLabel,'Spielhilfe');
 const placeholder=nodes(tree,'View').find(v=>v.props.testID==='page-header-back-placeholder');assert.ok(placeholder);assert.equal(placeholder.props.onPress,undefined);assert.equal(placeholder.props.style.width,44);
 assert.equal(nodes(tree,'Text').find(t=>t.props.testID==='page-header-title').props.children,'START');
});
test('Long titles retain a single centered shrinkable label and controls retain symmetric touch slots',()=>{
 const h=setup(),tree=h.render('PageHeader',{title:'Materialbeschaffung',onBack:()=>{},onHelp:()=>{}});
 const title=nodes(tree,'Text').find(t=>t.props.testID==='page-header-title');assert.equal(text(title),'MATERIALBESCHAFFUNG');assert.equal(title.props.numberOfLines,1);assert.equal(title.props.adjustsFontSizeToFit,true);assert.ok(title.props.minimumFontScale>=.7);assert.equal(title.props.style.textAlign,'center');
 const buttons=nodes(tree,'Pressable').map(b=>b.props.style({pressed:false})[0]);assert.equal(buttons[0].width,buttons[1].width);assert.ok(buttons.every(s=>s.width>=44&&s.height>=44));
 const withoutHelp=h.render('PageHeader',{title:'Spielhilfe',onBack:()=>{}});assert.ok(nodes(withoutHelp,'View').some(v=>v.props.testID==='page-header-help-placeholder'));assert.equal(nodes(withoutHelp,'Pressable').length,1);
});
