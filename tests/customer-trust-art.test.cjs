const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
test('Relationship rewards use their own illustrated book and preserve actual points and other reward icons',()=>{
 const h=componentHarness('ClaimRewards.tsx',{'./Language':{Text:'Text'}}),summary={source:'Einzelaufträge',coins:0,gears:{},capacityModules:0,companyItems:0,supplierContacts:0,customerTrust:17,xp:20,customerOrders:1};
 let tree=h.render('ClaimRewards',{summary,rarities:[]}),row=nodes(tree,'View').find(v=>v.props.testID==='claim-reward-customerTrust');assert.ok(row);assert.equal(nodes(row,'Icon')[0].props.name,'customerTrust');assert.equal(nodes(row,'Icon')[0].props.size,52);assert.ok(text(row).includes('Beziehungspunkte'));assert.ok(text(row).includes('+17'));assert.equal(summary.customerTrust,17);
 const xp=nodes(tree,'View').find(v=>v.props.testID==='claim-reward-xp');assert.equal(nodes(xp,'Icon')[0].props.name,'xp');summary.customerTrust=0;tree=h.render('ClaimRewards',{summary,rarities:[]});assert.ok(!nodes(tree,'View').some(v=>v.props.testID==='claim-reward-customerTrust'));
});
test('Book registry preserves original painted colors and keeps generic customer navigation unchanged',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../src/Icon.tsx'),'utf8'),assets=Object.fromEntries([...source.matchAll(/require\('([^']+)'\)/g)].map(m=>[m[1],m[1]]));
 const h=componentHarness('Icon.tsx',{'./theme':{C:require('../src/palette.json')},...assets});
 const trust=h.render('Icon',{name:'customerTrust',size:52,color:'#ff0000'});assert.equal(trust.props.source,'../assets/art/points/customer-trust.png');assert.equal(trust.props.testID,'customerTrust-art');assert.ok(!trust.props.style.some(s=>s?.tintColor));assert.equal(trust.props.accessible,false);
 const xp=h.render('Icon',{name:'xp'});assert.equal(xp.props.source,'../assets/art/points/xp.png');assert.ok(!xp.props.style.some(s=>s?.tintColor));
 const customers=h.render('Icon',{name:'customers',color:'#123456'});assert.equal(customers.props.source,'../assets/icons/customers.png');assert.ok(customers.props.style.some(s=>s?.tintColor==='#123456'));assert.equal(h.exports.screenIcons.customers,'customers');
 const png=fs.readFileSync(path.join(__dirname,'../assets/art/points/customer-trust.png'));assert.equal(png.readUInt32BE(16),512);assert.equal(png.readUInt32BE(20),512);assert.equal(png[25],6,'RGBA asset retains alpha');
});
