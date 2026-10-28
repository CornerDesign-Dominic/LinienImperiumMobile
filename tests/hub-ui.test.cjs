const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {execute}=require('../functions/src/engine.cjs');
const now=Date.UTC(2026,9,24,12);
function fixture(){let r=execute(null,'start',{id:'hamburg'},now,()=>0);r.state.xp=50*30*29;r.state.coins=1e6;r=execute(r.state,'buyHub',{},now,()=>0);r=execute(r.state,'hubVehicleBuy',{},now,()=>0);return r.view;}
function setup(name,extra={}){
 const ui={C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Pill:'Pill',Bar:'Bar',n:String,remaining:()=> '00:30:00'};
 const h=componentHarness('HubVehicles.tsx',{'./ui':ui,'./HubArt':{HubArt:'HubArt'},'./HubCrateCard':{HubCrateCard:'HubCrateCard'},'./HubVehicleDetail':{HubVehicleDetail:'HubVehicleDetail'},'./HubEarnings':{HubEarnings:'HubEarnings'}}),calls=[],props={data:fixture(),busy:false,clock:now,onCommand:async(...args)=>{calls.push(args);return {};},onSell:()=>{},...extra};
 return {h,props,calls,render:()=>h.render(name,props)};
}
const button=(tree,label)=>{const b=nodes(tree,'Btn').find(b=>text(b)===label);assert.ok(b,label);return b;};
const press=(tree,label)=>{const b=nodes(tree,'Pressable').find(b=>b.props.accessibilityLabel===label);assert.ok(b,label);b.props.onPress();};
test('Hub actions reject rapid duplicate taps, recover from failure, and retain overview/vehicles selection',async()=>{
 let finish;const x=setup('HubScreen',{onCommand:()=>new Promise(resolve=>finish=resolve)});let tree=x.render();
 assert.ok(nodes(tree,'HubEarnings').length);const open=nodes(tree,'HubEarnings')[0].props.onCollect;
 const first=open();assert.equal(await open(),undefined);assert.equal(nodes(x.render(),'HubEarnings')[0].props.busy,true);
 finish(null);await first;assert.ok(text(x.render()).includes('Aktion fehlgeschlagen'));
 x.props.onCommand=async()=>({});await nodes(x.render(),'HubEarnings')[0].props.onCollect();assert.ok(!text(x.render()).includes('Aktion fehlgeschlagen'));
 nodes(x.render(),'Pressable').find(p=>text(p)==='Boten').props.onPress();assert.ok(!text(x.render()).includes('Erträge abholen'));assert.ok(nodes(x.render(),'Pressable').find(p=>p.props.accessibilityState?.selected&&text(p)==='Boten'));
});
test('Sales shows working time and allows item-funded upgrades without coins',()=>{
 const x=setup('HubScreen');x.props.data.state.coins=0;
 x.props.data.state.inventory.supplierContacts=5;x.props.data.state.inventory.companyItems=1;
 let tree=x.render();assert.ok(text(tree).includes('40:00 → 40:30 Min.'));assert.ok(!text(tree).includes('Einkaufsmenge'));assert.ok(!text(tree).includes('%'));
 assert.equal(button(tree,'Ausbau starten').props.disabled,false);
 x.props.data.state.inventory.supplierContacts=4;assert.equal(button(x.render(),'Ausbau starten').props.disabled,true);
 x.props.data.state.hubs[0].salesLevel=20;x.props.data.hubInfo.cycle.workMinutes=50;x.props.data.hubInfo.cycle.nextWorkMinutes=50;
 tree=x.render();assert.ok(text(tree).includes('50:00 Min.'));assert.ok(!nodes(tree,'Btn').some(b=>text(b)==='Ausbau starten'));
});
test('Hub vehicles use resource and slot gates, exact upgrade commands, and keep destructive actions collapsed',async()=>{
 const x=setup('HubVehicles');let tree=x.render();press(tree,'Boten anwerben');tree=x.render();assert.equal(button(tree,`Anwerben · ${x.props.data.hubInfo.vehiclePrice} M`).props.disabled,false);
 const vehicle=x.props.data.state.trucks.find(t=>!t.cardId&&t.tier<=1);nodes(tree,'Pressable').find(p=>p.props.accessibilityLabel?.includes(vehicle.displayName)).props.onPress();tree=x.render();assert.ok(!nodes(tree,'Btn').some(b=>text(b).startsWith('Verkaufen')));
 const detail=nodes(tree,'HubVehicleDetail')[0];assert.equal(detail.props.truck.id,vehicle.id);assert.equal(detail.props.inventory,x.props.data.state.inventory);
 x.props.data.hubLimit=1;assert.ok(!nodes(x.render(),'Pressable').some(p=>p.props.accessibilityLabel==='Boten anwerben'));
});
test('Hub vehicle detail gates upgrades, rejects duplicate taps and returns to overview',async()=>{
 const data=fixture(),truck=data.state.trucks.find(t=>!t.cardId&&t.tier<=1),calls=[];
 const h=componentHarness('HubVehicleDetail.tsx'),props={truck,inventory:{hubVehicleParts:0},coins:1e6,busy:false,onClose:()=>{},onSell:()=>{},onCommand:async(...args)=>{calls.push(args);return {};}};
 const render=()=>h.render('HubVehicleDetail',props);
 let tree=render();assert.ok(!nodes(tree,'Btn').some(b=>text(b).startsWith('Verkaufen')));
 nodes(tree,'Pressable').find(p=>p.props.accessibilityLabel?.startsWith('Laderaum,')).props.onPress();
 assert.equal(button(render(),'Laderaum ausbauen').props.disabled,true);
 props.inventory.hubVehicleParts=100;assert.equal(button(render(),'Laderaum ausbauen').props.disabled,false);
 let finish;props.onCommand=(...args)=>{calls.push(args);return new Promise(resolve=>finish=resolve)};
 const upgrade=button(render(),'Laderaum ausbauen').props.onPress,first=upgrade();await upgrade();assert.equal(calls.length,1);assert.deepEqual(JSON.parse(JSON.stringify(calls[0])),['hubVehicleUpgrade',{id:truck.id,kind:'capacity'}]);
 finish(null);await first;assert.ok(text(render()).includes('Aktion fehlgeschlagen'));
 props.onCommand=async()=>({});await button(render(),'Laderaum ausbauen').props.onPress();assert.ok(text(render()).includes('Verbesserungen'));
 press(render(),'Weitere Aktionen');assert.ok(nodes(render(),'Btn').some(b=>text(b).startsWith('Verkaufen')));
});
test('Hub crates respect cooldown, show received parts separately and return after closing',async()=>{
 const x=setup('HubParts');let finish;x.props.onCommand=()=>new Promise(resolve=>finish=resolve);
 const open=nodes(x.render(),'HubCrateCard')[0].props.onOpen,first=open();await open();assert.equal(nodes(x.render(),'HubCrateCard')[0].props.busy,true);
 finish({hubCrateParts:17});await first;let tree=x.render();let reward=nodes(tree,'RewardModal').find(m=>m.props.title==='Fundkiste geöffnet');assert.equal(reward.props.visible,true);assert.ok(text(reward).includes('+17'));reward.props.onClose();assert.equal(nodes(x.render(),'RewardModal').find(m=>m.props.title==='Fundkiste geöffnet').props.visible,false);
 const h=componentHarness('HubCrateCard.tsx',{'../assets/art/hub/crate-scene.jpg':{uri:'crate-scene'}});let card=h.render('HubCrateCard',{crates:{opened:1,max:3,nextAt:now+1458000,available:false},clock:now});assert.ok(text(card).includes('2 Stück'));assert.ok(text(card).includes('Öffnen in 24:18'));assert.equal(nodes(card,'Pressable')[0].props.disabled,true);
 card=h.render('HubCrateCard',{crates:{opened:3,max:3,nextAt:now+1800000,available:false},clock:now});assert.ok(text(card).includes('0 Stück'));assert.ok(text(card).includes('Morgen wieder verfügbar'));
});
