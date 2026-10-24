const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const button=(tree,label)=>{const found=nodes(tree,'Btn').find(node=>text(node)===label);assert.ok(found,'Button: '+label);return found;};
function giftSetup(overrides={}){
 const h=componentHarness('Gifts.tsx',overrides),cards=Array.from({length:5},(_,i)=>({id:'card-'+i,name:'Vehicle '+i,rarity:'common',chance:20}));
 const calls=[],props={data:{catalog:{cards,rarities:[{id:'common',label:'Common'}],gifts:[{region:0,name:'Old region label',cost:10,cards}],regionNames:['Old region label']},state:{coins:100}},busy:false,onCommand:async(action,payload)=>{calls.push({action,payload});return {giftFind:{cardId:'card-2',duplicate:calls.length>1,shards:1}};}};
 const render=()=>h.render('Gifts',props),crate=tree=>nodes(tree,'Modal')[0],reward=tree=>nodes(tree,'RewardModal')[0];
 const entry=nodes(render(),'Pressable').find(node=>node.props.accessibilityLabel==='Geschenk, Canonical region');assert.ok(entry,'canonical region identity is used');entry.props.onPress();
 return {h,props,calls,render,crate,reward};
}
test('Gift result waits after the wheel stops, returns to the open crate and repeats with the real duplicate reward',async()=>{
 const {h,calls,render,crate,reward}=giftSetup();const open=button(crate(render()),'Öffnen · 10 M').props.onPress;
 await Promise.all([open(),open()]);assert.equal(calls.length,1,'rapid taps buy only once');
 let tree=render();for(let steps=0;!text(crate(tree)).includes('Geschenk geöffnet');steps++){assert.ok(steps<30);h.next();tree=render();}
 assert.equal(reward(tree).props.visible,false);assert.equal(button(crate(tree),'Nochmal öffnen · 10 M').props.disabled,true);
 h.advance(349);assert.equal(reward(render()).props.visible,false);h.advance(1);tree=render();assert.equal(reward(tree).props.visible,true);assert.equal(crate(tree).props.visible,false);assert.ok(text(reward(tree)).includes('Neue Fahrzeugkarte'));assert.ok(!text(crate(tree)).includes('1 Fahrzeugkarte'));
 reward(tree).props.onClose();tree=render();assert.equal(crate(tree).props.visible,true);assert.equal(button(crate(tree),'Nochmal öffnen · 10 M').props.disabled,false);
 await button(crate(tree),'Nochmal öffnen · 10 M').props.onPress();h.advance(10000);tree=render();assert.equal(calls.length,2);assert.ok(text(reward(tree)).includes('+1 Common-Shard'));assert.ok(!text(crate(tree)).includes('+1 Common-Shard'));
 button(reward(tree),'Weiter').props.onPress();assert.equal(crate(render()).props.visible,true);h.unmount();assert.equal(h.pendingTimers(),0);
});
test('Gift request failure can be retried; skip uses the received result and leaving cancels delayed presentation',async()=>{
 const {h,props,calls,render,crate,reward}=giftSetup();props.onCommand=async()=>{throw Error('offline');};
 await button(crate(render()),'Öffnen · 10 M').props.onPress();let tree=render();assert.ok(text(crate(tree)).includes('Geschenk konnte nicht geöffnet werden.'));assert.equal(reward(tree).props.visible,false);assert.equal(h.pendingTimers(),0);
 props.onCommand=async()=>{calls.push('retry');return {giftFind:{cardId:'card-2',duplicate:false}};};await button(crate(render()),'Öffnen · 10 M').props.onPress();button(crate(render()),'Überspringen').props.onPress();tree=render();assert.ok(text(crate(tree)).includes('Geschenk geöffnet'));assert.equal(reward(tree).props.visible,false);assert.equal(calls.length,1);
 h.unmount();assert.equal(h.pendingTimers(),0);h.advance(10000);assert.equal(h.pendingTimers(),0);
});
test('Reduced motion keeps the short gift reveal pause and insufficient balance keeps repeat visible but disabled',async()=>{
 const native={View:'View',Pressable:'Pressable',Modal:'Modal',ScrollView:'ScrollView',StyleSheet:{create:x=>x},AccessibilityInfo:{isReduceMotionEnabled:async()=>true}};
 const {h,props,render,crate,reward}=giftSetup({'react-native':native});await Promise.resolve();await button(crate(render()),'Öffnen · 10 M').props.onPress();assert.ok(text(crate(render())).includes('Geschenk geöffnet'));h.advance(349);assert.equal(reward(render()).props.visible,false);h.advance(1);assert.equal(reward(render()).props.visible,true);
 reward(render()).props.onClose();props.data.state.coins=0;assert.equal(button(crate(render()),'Nochmal öffnen · 10 M').props.disabled,true);h.unmount();
});
test('Development modal stages all levels without saving on close and commits one bounded allocation only on confirmation',async()=>{
 const data={development:{points:6,overtime:{base:100,bonus:10},expedition:{base:50,bonus:7}}};
 function setup(){const h=componentHarness('LevelUp.tsx'),calls=[],props={data,busy:false,onCommand:async(action,payload)=>{calls.push({action,...payload});props.data={development:{...data.development,points:0}};return props.data;}};
 const render=()=>h.render('DevelopmentCard',props);button(render(),'Punkte verteilen').props.onPress();// Render the real child component so its hooks and confirmation handler run.
 const element=(tree)=>{const visit=node=>{if(!node||typeof node!=='object')return undefined;if(typeof node.type==='function'&&node.type.name==='DevelopmentModal')return node;for(const c of require('react').Children.toArray(node.props?.children)){const found=visit(c);if(found)return found;}};return visit(tree);};
 const modal=()=>{const e=element(render());assert.ok(e);return h.render(e.type,e.props);};return {h,calls,render,modal};}
 const cancelled=setup();button(cancelled.modal(),'Verteilung bestätigen');nodes(cancelled.modal(),'Pressable').find(n=>n.props.accessibilityLabel==='Expeditionspunkte erhöhen').props.onPress();nodes(cancelled.modal(),'RewardModal')[0].props.onClose();assert.equal(cancelled.calls.length,0);assert.equal(nodes(cancelled.render(),'Btn').some(n=>text(n)==='Punkte verteilen'),true);cancelled.h.unmount();
 const saved=setup();let tree=saved.modal();assert.equal(button(tree,'Verteilung bestätigen').props.disabled,true);const plus=nodes(tree,'Pressable').find(n=>n.props.accessibilityLabel==='Expeditionspunkte erhöhen').props.onPress;for(let i=0;i<9;i++)plus();tree=saved.modal();assert.ok(text(tree).includes('50 → 56'));assert.ok(text(tree).includes('Boni +7'));assert.ok(nodes(tree,'Pressable').filter(n=>n.props.accessibilityLabel.endsWith('erhöhen')).every(n=>n.props.disabled));
 const confirm=button(tree,'Verteilung bestätigen').props.onPress;await Promise.all([confirm(),confirm()]);assert.equal(saved.calls.length,1);assert.deepEqual(saved.calls[0],{action:'levelBatch',expedition:6,overtime:0,points:6});assert.ok(!text(saved.render()).includes('Punkte verteilen'));saved.h.unmount();
});
