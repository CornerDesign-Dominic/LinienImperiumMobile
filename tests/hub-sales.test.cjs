const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const imports={'../assets/art/hub/sales-desk.jpg':1,'./ui':{C:require('../src/palette.json'),Txt:'Txt',Btn:'Btn',n:(v,d=0)=>Number(v).toLocaleString('de-DE',{maximumFractionDigits:d}),remaining:()=> '00:12:00',displayFont:'serif'}};
function setup(){const h=componentHarness('HubSales.tsx',imports);let commands=0;const p={hub:{salesLevel:0},info:{cycle:{salesMax:20,workMinutes:40,nextWorkMinutes:40.5},hourlyCapacity:1544.2,upgradeContacts:5,upgradeItems:1},inventory:{supplierContacts:4,companyItems:8},clock:0,onCommand:()=>commands++};return {h,p,render:()=>h.render('HubSales',p),commands:()=>commands};}
const button=tree=>nodes(tree,'Btn').find(n=>text(n)==='Ausbau starten');
test('Sales upgrade previews actual next throughput, gates missing materials and keeps modal open on error',()=>{
 const {h,p,render,commands}=setup();let tree=render();assert.ok(text(tree).includes('+12,9 t pro Stunde nach Ausbau'));assert.ok(text(tree).includes('1 Lieferantenkontakt fehlt'));assert.equal(button(tree).props.disabled,true);
 nodes(tree,'Pressable').find(n=>n.props.testID==='hub-sales-card').props.onPress();assert.equal(nodes(render(),'Modal')[0].props.visible,true);
 p.inventory.supplierContacts=5;tree=render();assert.equal(button(tree).props.disabled,false);button(tree).props.onPress();assert.equal(commands(),1);
 p.error=true;assert.ok(text(render()).includes('Aktion fehlgeschlagen'));assert.equal(nodes(render(),'Modal')[0].props.visible,true);
 p.busy=true;nodes(render(),'Modal')[0].props.onRequestClose();assert.equal(nodes(render(),'Modal')[0].props.visible,true);assert.equal(nodes(render(),'Btn')[0].props.disabled,true);h.unmount();
});
test('Sales construction and maximum hide upgrade costs and prevent another purchase',()=>{
 const {h,p,render}=setup();p.hub.construction={finishAt:720000};let tree=render();assert.ok(text(tree).includes('Ausbau läuft'));assert.equal(button(tree),undefined);assert.ok(!text(tree).includes('Ausbaukosten'));
 p.hub.construction=null;p.hub.salesLevel=20;p.info.cycle.workMinutes=50;p.info.cycle.nextWorkMinutes=50;tree=render();assert.ok(text(tree).includes('Maximum erreicht'));assert.ok(!text(tree).includes('+30'));assert.equal(button(tree),undefined);h.unmount();
});
