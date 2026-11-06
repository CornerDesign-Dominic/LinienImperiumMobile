const {test}=require('node:test'),assert=require('node:assert/strict'),React=require('react');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const applied=componentHarness('transportCardUpgradeApplied.ts').exports.transportCardUpgradeApplied;
const cardBonus=componentHarness('cardBonus.ts').exports,collectionStats=componentHarness('collectionStats.ts').exports;
const fixture=()=>({catalog:{cards:[{id:'c',name:'Testwagen',rarity:'common',stat:'cost',bonusLevels:[1,2,3,4,5,6,7,8,9,10],maxCapacityLevel:10}],rarities:[{id:'common',label:'Common'}],cardLevelCosts:[2,4,8,16,32,64,128,256,512]},state:{coins:0,expedition:{characters:{c:{level:1,progress:0}},shards:{common:0}},inventory:{capacityModules:0,gears:{common:0}}},cardVehicles:{c:{capacity:2,capacityLevel:0,maxCapacityLevel:10,speed:1,loadedSpeed:.8,rank:{id:'common',label:'Common',total:0},rankCost:5,upgradePreview:{capacity:2.2,rank:{speed:1.1,loadedSpeed:.9}}}}});
function setup(){const h=componentHarness('VehicleUpgradeModal.tsx',{'./transportCardUpgradeApplied':{transportCardUpgradeApplied:applied},'./cardBonus':cardBonus,'./collectionStats':collectionStats}),props={visible:true,data:fixture(),id:'c',busy:false,onClose:()=>{},onUpgrade:async()=>{},onVehicleUpgrade:async()=>{}};
 function expand(node){if(!node||typeof node!=='object')return node;if(typeof node.type==='function')return expand(node.type(node.props));return React.cloneElement(node,{},...React.Children.toArray(node.props?.children).map(expand));}
 const render=()=>expand(h.render('VehicleUpgradeModal',props));return {props,render};}
const section=(tree,title)=>nodes(tree,'View').find(v=>v.props.testID===`upgrade-${title}`);
const button=(tree,title)=>nodes(section(tree,title),'Btn')[0];
test('Each upgrade button appears only with enough resources and a valid next tier; costs and previews remain without missing counters',()=>{
 const {props,render}=setup();let tree=render();assert.equal(nodes(tree,'Btn').length,0);assert.ok(text(tree).includes('Kosten: 2 · Bestand: 0'));assert.ok(text(tree).includes('2 t → 2.2 t'));assert.ok(!text(tree).includes('Fehlen'));
 props.data.state.expedition.shards.common=2;tree=render();assert.ok(button(tree,'Kartenstufe'));assert.equal(button(tree,'Kapazität'),undefined);assert.equal(button(tree,'Geschwindigkeit'),undefined);
 props.data.state.inventory.capacityModules=1;tree=render();assert.ok(button(tree,'Kapazität'));props.data.state.inventory.gears.common=5;tree=render();assert.equal(nodes(tree,'Btn').length,3);assert.ok(nodes(tree,'Btn').every(b=>!b.props.disabled));
 props.data.cardVehicles.c.upgradePreview={capacity:null,rank:null};tree=render();assert.equal(button(tree,'Kapazität'),undefined);assert.equal(button(tree,'Geschwindigkeit'),undefined);
 props.data.state.expedition.characters.c.level=10;props.data.cardVehicles.c.capacityLevel=10;props.data.cardVehicles.c.rank.total=50;tree=render();assert.equal(nodes(tree,'Btn').length,0);assert.equal(text(tree).match(/Maximum erreicht/g).length,3);assert.ok(!text(tree).includes('Fehlen'));
});
test('Each confirmed upgrade stays open and silent, refreshes resources, and guards duplicate taps without mid-request button flicker',async()=>{
 for(const [kind,title] of [['level','Kartenstufe'],['capacity','Kapazität'],['rank','Geschwindigkeit']]){
  const {props,render}=setup();props.data.state.expedition.shards.common=2;props.data.state.inventory.capacityModules=1;props.data.state.inventory.gears.common=5;
  let finish,calls=0,closed=0;props.onClose=()=>closed++;props.onUpgrade=props.onVehicleUpgrade=()=>{calls++;return new Promise(resolve=>finish=resolve);};
  const old=props.data,handler=button(render(),title).props.onPress,first=handler();await handler();assert.equal(calls,1);let tree=render();assert.equal(button(tree,title).props.children,'Wird verbessert …');assert.ok(nodes(tree,'Btn').every(b=>b.props.disabled));tree.props.onClose();assert.equal(closed,0);
  const next=structuredClone(old);if(kind==='level'){next.state.expedition.characters.c.level++;next.state.expedition.shards.common=0;}else if(kind==='capacity'){next.cardVehicles.c.capacityLevel++;next.cardVehicles.c.capacity=2.2;next.cardVehicles.c.upgradePreview.capacity=2.4;next.state.inventory.capacityModules=0;}else{next.cardVehicles.c.rank.total++;next.state.inventory.gears.common=0;}
  props.data=next;tree=render();assert.equal(button(tree,title).props.children,'Wird verbessert …','request snapshot prevents data refresh from collapsing the active button');finish(next);await first;tree=render();assert.equal(tree.props.visible,true);assert.equal(closed,0);assert.ok(!text(tree).includes('Verbesserung erfolgreich.'));assert.ok(!text(tree).includes('nicht bestätigt'));assert.ok(!text(tree).includes('Fehlen'));assert.equal(button(tree,title),undefined,'spent resources hide only the now-unavailable action');
 }
});
test('Rejected and failed upgrades retain feedback, retry and busy/close guards',async()=>{
 const {props,render}=setup();props.data.state.inventory.capacityModules=1;props.busy=true;let tree=render();assert.ok(button(tree,'Kapazität'));assert.equal(button(tree,'Kapazität').props.disabled,true);
 props.busy=false;props.onVehicleUpgrade=async()=>props.data;await button(render(),'Kapazität').props.onPress();tree=render();assert.ok(text(tree).includes('Verbesserung nicht bestätigt'));assert.equal(button(tree,'Kapazität').props.disabled,false);
 props.onVehicleUpgrade=async()=>{throw Error('offline');};await button(render(),'Kapazität').props.onPress();assert.ok(text(render()).includes('Verbesserung fehlgeschlagen'));
});
test('Success-toast suppression detects only actual changes in the three card upgrade actions',()=>{
 const before=fixture(),after=structuredClone(before);after.state.expedition.characters.c.level++;after.cardVehicles.c.capacityLevel++;after.cardVehicles.c.rank.total++;
 for(const action of ['cardUpgrade','cardCapacity','cardRank']){assert.equal(applied(action,'c',before,after),true);assert.equal(applied(action,'c',before,before),false);assert.equal(applied(action,'missing',before,after),false);assert.equal(applied(action,'c',before,undefined),false);}
 assert.equal(applied('hubVehicleUpgrade','c',before,after),false);assert.equal(applied('transportBatch','c',before,after),false);
});
