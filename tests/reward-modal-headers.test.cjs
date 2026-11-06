const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
test('Every reward source is a subtitle without completion counters while item amounts remain visible',()=>{
 const h=componentHarness('ClaimRewards.tsx',{'./Language':{Text:'Text'}});
 for(const source of ['Einzelaufträge','Großaufträge','Season','Botenstation','Expedition','Materialbeschaffung']){
  const summary={source,count:7,coins:1234,xp:25,customerTrust:3,hermes:2,seasonPoints:100,gears:{common:10},capacityModules:1,companyItems:0,supplierContacts:0};
  const tree=h.render('ClaimRewards',{summary,rarities:[{id:'common',label:'Common'}]});
  assert.equal(text(nodes(tree,'Txt').find(node=>node.props.testID==='reward-source')),source);
  assert.ok(!text(tree).includes('Abschluss'));assert.ok(!text(tree).includes('Abschlüsse'));
  for(const [id,amount]of [['coins',1234],['xp',25],['customerTrust',3],['hermes',2],['seasonPoints',100],['gear:common',10],['capacityModules',1]]){
   const row=nodes(tree,'View').find(node=>node.props.testID==='claim-reward-'+id);assert.ok(row,id);assert.ok(text(row).includes('+'+amount),id+' quantity retained');
  }
 }
 const fallback=h.render('ClaimRewards',{summary:{coins:0,gears:{}},rarities:[]});assert.equal(text(nodes(fallback,'Txt').find(node=>node.props.testID==='reward-source')),'Einzelaufträge');
});
