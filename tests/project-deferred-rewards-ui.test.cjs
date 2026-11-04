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
