const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
test('Expedition upgrade shows combined chance and submits the displayed level only when affordable',async()=>{
 const h=componentHarness('Company.tsx'),calls=[],data={state:{coins:10000,inventory:{companyItems:1}},expeditionUpgrade:{level:0,limit:15,combinedChance:1,cost:{coins:10000,items:1}}};
 let tree=h.render('ExpeditionChanceCard',{data,onCommand:async(...args)=>calls.push(args)});
 assert.ok(text(tree).includes('Expeditionsfunde'));assert.equal(nodes(tree,'Btn')[0].props.disabled,false);
 await nodes(tree,'Btn')[0].props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['expeditionChanceUpgrade',{level:0}]]);
 tree=h.render('ExpeditionChanceCard',{data:{...data,state:{coins:9999,inventory:{companyItems:1}}},onCommand:async()=>{throw Error('must not submit');}});assert.equal(nodes(tree,'Btn')[0].props.disabled,true);
 tree=h.render('ExpeditionChanceCard',{data:{...data,expeditionUpgrade:{level:15,limit:15,combinedChance:2.5,cost:null}},onCommand:async()=>{}});assert.equal(nodes(tree,'Btn').length,0);assert.ok(text(tree).includes('Maximum erreicht'));
});
