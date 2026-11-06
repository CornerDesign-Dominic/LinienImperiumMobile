const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const cargo=require('../functions/src/customer-cargo.json'),identities=require('../functions/src/customer-identities.json');
function setup(customer,options={}){
 const h=componentHarness('Customers.tsx',{'./regionIdentities':{regionIdentities:identities},'./placePortraits':{portraitForPlace:()=>null}});
 const data={customers:[{points:0,skills:{pay:0,special:0,referral:0},...customer}],catalog:{categories:[{id:'national',label:'Nahverkehr'}]},expeditionMap:options.map||[]};
 const tree=h.render('CustomerDetail',{data,id:customer.id,busy:false,onSave(){throw Error('No command during display');}});
 return {h,tree,data};
}
test('All five customer details show their three products and precious good without changing source data',()=>{
 for(const identity of identities){
  const goods=cargo.customers[identity.id],customer={id:identity.id,name:identity.customer,category:'national',products:[...goods.products],preciousCargo:goods.precious};
  const before=JSON.stringify(customer),{h,tree}=setup(customer);
  const row=nodes(tree,'View').find(n=>n.props.testID==='customer-goods');
  assert.ok(row);assert.deepEqual(nodes(row,'OrderArtwork').map(n=>n.props.cargo),[...goods.products,goods.precious]);
  for(const good of [...goods.products,goods.precious])assert.ok(text(row).includes(good));
  assert.equal(JSON.stringify(customer),before);h.unmount();
 }
});
test('Customer metadata shows its canonical origin without a fixed traffic category',()=>{
 const {h,tree}=setup({id:'stahlwerk',name:'Bund der Karawanenhändler',category:'national',regionName:'Historische Region',products:[],preciousCargo:'Kostbare Essenzen'});
 const traffic=nodes(tree,'View').find(n=>n.props.testID==='customer-traffic'),origin=nodes(tree,'View').find(n=>n.props.testID==='customer-origin');
 assert.equal(traffic,undefined);assert.ok(!text(tree).includes('Nahverkehr'));
 assert.equal(text(origin),'HerkunftSafranstraße');assert.equal(nodes(origin,'Icon')[0].props.name,'expedition');h.unmount();
});
test('Legacy customer display falls back to known cargo and supplied origin without inventing missing goods',()=>{
 const {h,tree}=setup({id:'legacy',name:'Altbestand',category:'international',cargo:'Historische Fracht',regionName:'Alte Herkunft'});
 assert.deepEqual(nodes(tree,'OrderArtwork').map(n=>n.props.cargo),['Historische Fracht']);
 assert.ok(text(tree).includes('Alte Herkunft'));assert.ok(!text(tree).includes('international'));h.unmount();
});
