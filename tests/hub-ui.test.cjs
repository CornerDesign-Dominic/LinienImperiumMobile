const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {execute}=require('../functions/src/engine.cjs');
const now=Date.UTC(2026,9,24,12);
function fixture(){let r=execute(null,'start',{id:'hamburg'},now,()=>0);r.state.xp=50*30*29;r.state.coins=1e6;r=execute(r.state,'buyHub',{},now,()=>0);r=execute(r.state,'hubVehicleBuy',{},now,()=>0);return r.view;}
function setup(name,extra={}){
 const ui={C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Pill:'Pill',Bar:'Bar',n:String,remaining:()=> '00:30:00'};
 const h=componentHarness('HubVehicles.tsx',{'./ui':ui}),calls=[],props={data:fixture(),busy:false,clock:now,onCommand:async(...args)=>{calls.push(args);return {};},onSell:()=>{},...extra};
 return {h,props,calls,render:()=>h.render(name,props)};
}
const button=(tree,label)=>{const b=nodes(tree,'Btn').find(b=>text(b)===label);assert.ok(b,label);return b;};
const press=(tree,label)=>{const b=nodes(tree,'Pressable').find(b=>b.props.accessibilityLabel===label);assert.ok(b,label);b.props.onPress();};
test('Hub actions reject rapid duplicate taps, recover from failure, and retain overview/vehicles selection',async()=>{
 let finish;const x=setup('HubScreen',{onCommand:()=>new Promise(resolve=>finish=resolve)});let tree=x.render();
 assert.ok(text(tree).includes('Erträge'));const open=button(tree,'Erträge abholen').props.onPress;
 const first=open();assert.equal(await open(),undefined);assert.equal(button(x.render(),'Erträge abholen').props.disabled,true);
 finish(null);await first;assert.ok(text(x.render()).includes('Aktion fehlgeschlagen'));
 x.props.onCommand=async()=>({});await button(x.render(),'Erträge abholen').props.onPress();assert.ok(!text(x.render()).includes('Aktion fehlgeschlagen'));
 nodes(x.render(),'Pressable').find(p=>text(p)==='Fahrzeuge').props.onPress();assert.ok(!text(x.render()).includes('Erträge abholen'));assert.ok(nodes(x.render(),'Pressable').find(p=>p.props.accessibilityState?.selected&&text(p)==='Fahrzeuge'));
});
test('Hub vehicles use resource and slot gates, exact upgrade commands, and keep destructive actions collapsed',async()=>{
 const x=setup('HubVehicles');let tree=x.render();press(tree,'Stadttransporter kaufen');tree=x.render();assert.equal(button(tree,`Kaufen · ${x.props.data.hubInfo.vehiclePrice} M`).props.disabled,false);
 const vehicle=x.props.data.state.trucks.find(t=>!t.cardId&&t.tier<=1);nodes(tree,'Pressable').find(p=>p.props.accessibilityLabel?.includes(vehicle.id)).props.onPress();tree=x.render();assert.ok(!nodes(tree,'Btn').some(b=>text(b).startsWith('Verkaufen')));
 assert.equal(button(tree,'Laderaum ausbauen').props.disabled,true);x.props.data.state.inventory.hubVehicleParts=100;tree=x.render();assert.equal(button(tree,'Laderaum ausbauen').props.disabled,false);
 await button(tree,'Laderaum ausbauen').props.onPress();assert.equal(x.calls[0][0],'hubVehicleUpgrade');assert.equal(x.calls[0][1].id,vehicle.id);assert.equal(x.calls[0][1].kind,'capacity');
 press(tree,'Weitere Aktionen');tree=x.render();assert.ok(nodes(tree,'Btn').some(b=>text(b).startsWith('Verkaufen')));
 x.props.data.hubLimit=1;assert.ok(!nodes(x.render(),'Pressable').some(p=>p.props.accessibilityLabel==='Stadttransporter kaufen'));
});
test('Hub crates respect cooldown, show received parts separately and return after closing',async()=>{
 const x=setup('HubParts');x.props.onCommand=async()=>({hubCrateParts:17});await button(x.render(),'Fundkiste öffnen').props.onPress();let tree=x.render();let reward=nodes(tree,'RewardModal').find(m=>m.props.title==='Fundkiste geöffnet');assert.equal(reward.props.visible,true);assert.ok(text(reward).includes('+17'));reward.props.onClose();assert.equal(nodes(x.render(),'RewardModal').find(m=>m.props.title==='Fundkiste geöffnet').props.visible,false);
 x.props.data.hubInfo.crates={opened:3,max:3,nextAt:now+1800000,available:false};tree=x.render();assert.equal(button(tree,'Fundkiste öffnen').props.disabled,true);assert.ok(text(tree).includes('Noch 0 heute'));assert.ok(text(tree).includes('Neue Fundkisten in'));
});
