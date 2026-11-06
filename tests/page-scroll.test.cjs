const {test}=require('node:test'),assert=require('node:assert/strict');
const React=require('react');
const {componentHarness,nodes}=require('./helpers/component-harness.cjs');
test('Shared page keeps keyboard, refresh, scrolling ref and caller spacing while filling short viewports',()=>{
 const h=componentHarness('PageScrollView.tsx',{'./theme':{C:require('../src/palette.json')}}),ref=React.createRef(),refresh=React.createElement('RefreshControl');
 const tree=h.exports.PageScrollView.render({automaticallyAdjustKeyboardInsets:true,keyboardShouldPersistTaps:'handled',refreshControl:refresh,contentContainerStyle:{paddingBottom:32},children:'page content'},ref);
 assert.equal(tree.type,'ScrollView');assert.equal(tree.props.ref,ref);assert.equal(tree.props.automaticallyAdjustKeyboardInsets,true);assert.equal(tree.props.keyboardShouldPersistTaps,'handled');assert.equal(tree.props.refreshControl,refresh);
 assert.equal(tree.props.contentContainerStyle[0].flexGrow,1);assert.equal(tree.props.contentContainerStyle[1].paddingBottom,32);assert.equal(tree.props.style[0].flex,1);
 assert.equal(tree.props.bounces,undefined,'Long pages keep native pull-to-refresh support');assert.equal(tree.props.alwaysBounceVertical,false);assert.equal(tree.props.overScrollMode,'never');assert.equal(tree.props.scrollEnabled,undefined,'Native scrolling remains available when content overflows');
 assert.equal(nodes(tree,'MaterialLayer').length,1);
});
