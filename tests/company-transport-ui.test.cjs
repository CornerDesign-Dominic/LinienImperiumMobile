const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const fixture=()=>({state:{coins:1000,inventory:{companyItems:12}},transportUpgradeOptions:['national','international'].flatMap(category=>['premium','volume','range'].map(kind=>({category,kind,level:0,limit:2,costs:[{coins:100,items:2},{coins:150,items:3}],base:{minVolume:1,maxVolume:5,minDistance:2,maxDistance:10},step:1})))});
test('Transport summary removes the heading and final divider while retaining sections, availability and improve navigation',()=>{
 const h=componentHarness('Company.tsx');let opened=0;const tree=h.render('TransportSummary',{data:fixture(),onImprove:()=>opened++});
 assert.ok(!text(tree).includes('Imperiumsausbau'));assert.ok(text(tree).includes('Nahverkehr'));assert.ok(text(tree).includes('Fernverkehr'));
 const groups=nodes(tree,'View').filter(v=>Array.isArray(v.props.style)&&v.props.style[0]?.paddingVertical===9);assert.equal(groups.length,2);assert.equal(groups[0].props.style[0].borderBottomWidth,1);assert.equal(groups[1].props.style[1].borderBottomWidth,0);
 const button=nodes(tree,'Btn').find(b=>text(b)==='Verbessern');assert.ok(button);button.props.onPress();assert.equal(opened,1);
 assert.equal(nodes(tree,'Row').at(-1).props.children[1].type.name,'AvailableDot');
});
test('Nah/Fern transport editor removes the stock header and inventory shortcut while preserving upgrade quotes and commands',async()=>{
 const h=componentHarness('Company.tsx'),data=fixture(),saved=[];const render=()=>h.render('TransportEditor',{data,busy:false,onSave:async payload=>{saved.push(payload);return {transportBatchApplied:true};}});
 let tree=render();assert.ok(!text(tree).includes('Vorräte'));assert.ok(!text(tree).includes('verfügbar'));assert.equal(nodes(tree,'ItemArt').length,0);
 let tabs=nodes(tree,'Pressable').filter(n=>n.props.accessibilityRole==='tab');tabs[1].props.onPress();tree=render();
 let upgrade=nodes(tree,'Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Abschlussprämie,'));upgrade.props.onPress();tree=render();
 assert.ok(text(tree).includes('Gesamtkosten'));assert.equal(nodes(tree,'ItemArt').filter(i=>i.props.id==='companyItems').length,1,'Required upgrade item cost remains');assert.ok(text(tree).includes('2 / 12'));
 let save=nodes(tree,'Btn').find(b=>text(b)==='Für 100 verbessern');assert.equal(save.props.disabled,false);await save.props.onPress();assert.equal(saved[0][0].category,'international');assert.equal(saved[0][0].count,1);
 tree=render();tabs=nodes(tree,'Pressable').filter(n=>n.props.accessibilityRole==='tab');tabs[0].props.onPress();tree=render();upgrade=nodes(tree,'Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Abschlussprämie,'));upgrade.props.onPress();data.state.inventory.companyItems=0;tree=render();assert.equal(nodes(tree,'Btn').find(b=>text(b)==='Für 100 verbessern').props.disabled,true);assert.ok(text(tree).includes('Nicht genügend Firmenausbau-Items.'));
});
