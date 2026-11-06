const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
function setup(skills,points=0){
 const h=componentHarness('Customers.tsx',{'./placePortraits':{portraitForPlace:()=>null},'./ui':{C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Pill:'Pill',Empty:'Empty',Btn:'Btn',n:(value,decimals=0)=>String(Number(value.toFixed(decimals)))}});
 const data={customers:[{id:'customer',name:'Testkunde',level:10,skills,points,products:[]}]};
 const render=()=>h.render('CustomerDetail',{data,id:'customer',busy:false,onSave(){throw Error('Display must not save');}});
 const skill=(tree,kind)=>nodes(tree,'View').find(node=>node.props.testID===`customer-skill-${kind}`);
 return {h,render,skill};
}
test('Existing regional customer skills show baseline and maximum expedition odds independently of order completion bonuses',()=>{
 for(const level of [0,25]){
  const {h,render,skill}=setup({pay:10,special:level,referral:level}),tree=render();
  assert.ok(text(skill(tree,'special')).includes(`Endlosexpedition: ${level===0?'0.9':'2.25'} %`));
  assert.ok(text(skill(tree,'referral')).includes(`Endlosexpedition: ${level===0?'0.1':'0.25'} %`));
  assert.ok(text(skill(tree,'special')).includes('Kundenauftrag: Basis 20 % Nahverkehr / 40 % Fernverkehr.'));
  assert.ok(text(skill(tree,'special')).includes(`Kundenauftrag: +${level*.1} Prozentpunkte`));
  assert.ok(text(skill(tree,'pay')).includes('Frachtvergütung: +1 %'));assert.ok(!text(skill(tree,'pay')).includes('Endlosexpedition'));
  assert.ok(!text(tree).includes('Firmenausbau-Items'));h.unmount();
 }
});
test('Draft customer skill allocations preview separate expedition rates without submitting an upgrade purchase',()=>{
 const {h,render,skill}=setup({pay:0,special:24,referral:24},2);
 let tree=render();
 const plus=kind=>nodes(skill(tree,kind),'Pressable').find(node=>node.props.accessibilityLabel.endsWith('hinzufügen')).props.onPress();
 plus('special');tree=render();assert.ok(text(skill(tree,'special')).includes('Endlosexpedition: 2.25 %'));
 assert.ok(text(skill(tree,'referral')).includes('Endlosexpedition: 0.244 %'));
 plus('referral');tree=render();assert.ok(text(skill(tree,'referral')).includes('Endlosexpedition: 0.25 %'));
 assert.equal(nodes(tree,'Btn').filter(node=>text(node)==='Speichern').length,1);
 h.unmount();
});
