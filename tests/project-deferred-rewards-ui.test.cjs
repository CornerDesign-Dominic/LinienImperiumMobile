const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
test('Project reward output includes the confirmed total coin payout and fractional XP once',()=>{
 const h=componentHarness('ClaimRewards.tsx',{'./Language':{Text:'Text'}});
 const summary={source:'Großaufträge',count:1,coins:123.45,xp:8.34,gears:{},capacityModules:0,companyItems:0,supplierContacts:0};
 const tree=h.render('ClaimRewards',{summary,rarities:[]}),rows=nodes(tree,'View').filter(n=>n.props.testID?.startsWith('claim-reward-')&&n.props.testID!=='claim-reward-list');
 assert.equal(rows.length,2);assert.equal(rows[0].props.testID,'claim-reward-coins');assert.equal(rows[1].props.testID,'claim-reward-xp');
 assert.ok(text(rows[0]).includes('+123'));assert.ok(text(rows[1]).includes('+8.34'));assert.equal(nodes(rows[1],'Icon')[0].props.name,'xp');
 const large=h.render('ClaimRewards',{summary:{...summary,coins:123456789.12},rarities:[]}),coinRow=nodes(large,'View').find(row=>row.props.testID==='claim-reward-coins'),value=nodes(coinRow,'Text')[0];
 assert.equal(value.props.style[0].fontSize,17);assert.equal(value.props.adjustsFontSizeToFit,undefined);assert.ok(text(value).includes('123456789'));
 const rounded=h.render('ClaimRewards',{summary:{...summary,coins:123.5},rarities:[]});assert.ok(text(nodes(rounded,'View').find(row=>row.props.testID==='claim-reward-coins')).includes('+124'));
 const withoutXp=h.render('ClaimRewards',{summary:{...summary,xp:0},rarities:[]});assert.equal(nodes(withoutXp,'View').filter(n=>n.props.testID==='claim-reward-xp').length,0);h.unmount();
});


test('Single-order claim combines XP, the relationship book and confirmed special orders',()=>{
 const h=componentHarness('ClaimRewards.tsx',{'./Language':{Text:'Text'}});
 const summary={source:'Einzelaufträge',count:2,coins:250,xp:12.75,customerTrust:3,specialOrders:1,gears:{},capacityModules:0,companyItems:0,supplierContacts:0};
 const tree=h.render('ClaimRewards',{summary,rarities:[]});
 const row=id=>nodes(tree,'View').find(node=>node.props.testID===`claim-reward-${id}`);
 assert.ok(text(row('xp')).includes('+12.75'));
 assert.ok(text(row('customerTrust')).includes('Beziehungspunkte+3'));
 assert.equal(nodes(row('customerTrust'),'Icon')[0].props.name,'customerTrust');
 assert.equal(nodes(row('customerTrust'),'ItemArt').length,0);
 assert.ok(text(row('project:special')).includes('Sonderaufträge+1'));
 assert.equal(nodes(row('project:special'),'ItemArt')[0].props.id,'project:special');
 const zero=h.render('ClaimRewards',{summary:{...summary,customerTrust:0,specialOrders:0},rarities:[]});
 assert.equal(nodes(zero,'View').some(node=>node.props.testID==='claim-reward-customerTrust'),false);
 assert.equal(nodes(zero,'View').some(node=>node.props.testID==='claim-reward-project:special'),false);
 const legacy=h.render('ClaimRewards',{summary:{coins:1,gears:{}},rarities:[]});
 assert.equal(nodes(legacy,'View').some(node=>node.props.testID==='claim-reward-customerTrust'),false);
 h.unmount();
});
