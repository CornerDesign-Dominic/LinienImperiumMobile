const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const button=(tree,label)=>{const found=nodes(tree,'Btn').find(node=>text(node)===label);assert.ok(found,'Button: '+label);return found;};
function giftSetup(overrides={}){
 const h=componentHarness('Gifts.tsx',overrides),cards=Array.from({length:5},(_,i)=>({id:'card-'+i,name:'Vehicle '+i,rarity:'common',chance:20}));
 const calls=[],props={data:{catalog:{cards,rarities:[{id:'common',label:'Common'}],gifts:[{region:0,name:'Old region label',cost:10,cards}],regionNames:['Old region label']},state:{coins:100,inventory:{tradeChests:3}},tradeChest:{count:3,price:200},premiumShop:{balance:1000}},busy:false,onCommand:async(action,payload)=>{calls.push({action,payload});return {giftFind:{cardId:'card-2',duplicate:calls.length>1,shards:1}};}};
 const render=()=>h.render('Gifts',props),crate=tree=>nodes(tree,'Modal')[0],reward=tree=>nodes(tree,'RewardModal').find(node=>node.props.title==='Dein Gewinn');
 const entry=nodes(render(),'Pressable').find(node=>node.props.accessibilityLabel==='Handelstruhe, Canonical region');assert.ok(entry,'canonical region identity is used');entry.props.onPress();
 return {h,props,calls,render,crate,reward};
}
test('Gift result waits after the wheel stops, returns to the open crate and repeats with the real duplicate reward',async()=>{
 const {h,calls,render,crate,reward}=giftSetup();const open=button(crate(render()),'Handelstruhe öffnen').props.onPress;
 await Promise.all([open(),open()]);assert.equal(calls.length,1,'rapid taps open only once');assert.equal(button(crate(render()),'Schließen').props.disabled,true);crate(render()).props.onRequestClose();assert.equal(crate(render()).props.visible,true,'closing during the reveal cannot discard a paid result');
 let tree=render();for(let steps=0;!text(crate(tree)).includes('Handelstruhe geöffnet');steps++){assert.ok(steps<30);h.next();tree=render();}
 assert.equal(reward(tree).props.visible,false);assert.equal(button(crate(tree),'Weitere Handelstruhe öffnen').props.disabled,true);
 h.advance(349);assert.equal(reward(render()).props.visible,false);h.advance(1);tree=render();assert.equal(reward(tree).props.visible,true);assert.equal(crate(tree).props.visible,false);assert.ok(text(reward(tree)).includes('Neue Transportkarte'));assert.ok(!text(crate(tree)).includes('1 Transportkarte'));
 reward(tree).props.onClose();tree=render();assert.equal(crate(tree).props.visible,true);assert.equal(button(crate(tree),'Weitere Handelstruhe öffnen').props.disabled,false);
 await button(crate(tree),'Weitere Handelstruhe öffnen').props.onPress();h.advance(10000);tree=render();assert.equal(calls.length,2);assert.ok(text(reward(tree)).includes('+1 Common-Shard'));assert.ok(!text(crate(tree)).includes('+1 Common-Shard'));
 assert.equal(nodes(reward(tree),'Btn').length,0,'reward closes through its header X only');reward(tree).props.onClose();assert.equal(crate(render()).props.visible,true);h.unmount();assert.equal(h.pendingTimers(),0);
});
test('Gift request failure can be retried; skip uses the received result and leaving cancels delayed presentation',async()=>{
 const {h,props,calls,render,crate,reward}=giftSetup();props.onCommand=async()=>{throw Error('offline');};
 await button(crate(render()),'Handelstruhe öffnen').props.onPress();let tree=render();assert.ok(text(crate(tree)).includes('Handelstruhe konnte nicht geöffnet werden.'));assert.equal(reward(tree).props.visible,false);assert.equal(h.pendingTimers(),0);
 props.onCommand=async()=>{calls.push('retry');return {giftFind:{cardId:'card-2',duplicate:false}};};await button(crate(render()),'Handelstruhe öffnen').props.onPress();button(crate(render()),'Überspringen').props.onPress();tree=render();assert.ok(text(crate(tree)).includes('Handelstruhe geöffnet'));assert.equal(reward(tree).props.visible,false);assert.equal(calls.length,1);
 h.unmount();assert.equal(h.pendingTimers(),0);h.advance(10000);assert.equal(h.pendingTimers(),0);
});
test('Reduced motion keeps the short chest reveal pause and empty stock keeps repeat visible but disabled',async()=>{
 const native={View:'View',Pressable:'Pressable',Modal:'Modal',ScrollView:'ScrollView',StyleSheet:{create:x=>x},AccessibilityInfo:{isReduceMotionEnabled:async()=>true}};
 const {h,props,render,crate,reward}=giftSetup({'react-native':native});await Promise.resolve();await button(crate(render()),'Handelstruhe öffnen').props.onPress();assert.ok(text(crate(render())).includes('Handelstruhe geöffnet'));h.advance(349);assert.equal(reward(render()).props.visible,false);h.advance(1);assert.equal(reward(render()).props.visible,true);
 reward(render()).props.onClose();props.data.tradeChest.count=0;assert.equal(button(crate(render()),'Weitere Handelstruhe öffnen').props.disabled,true);h.unmount();
});
test('Development modal stages all levels without saving on close and commits one bounded allocation only on confirmation',async()=>{
 const data={development:{points:6,overtime:{base:100,bonus:10},expedition:{base:50,bonus:7}}};
 function setup(){const h=componentHarness('LevelUp.tsx'),calls=[],props={data,busy:false,onCommand:async(action,payload)=>{calls.push({action,...payload});props.data={development:{...data.development,points:0}};return {...props.data,expansionAllocationApplied:true};}};
 const render=()=>h.render('DevelopmentCard',props);button(render(),'Ausbaupunkte verteilen · 6').props.onPress();// Render the real child component so its hooks and confirmation handler run.
 const element=(tree)=>{const visit=node=>{if(!node||typeof node!=='object')return undefined;if(typeof node.type==='function'&&node.type.name==='DevelopmentModal')return node;for(const c of require('react').Children.toArray(node.props?.children)){const found=visit(c);if(found)return found;}};return visit(tree);};
 const modal=()=>{const e=element(render());assert.ok(e);return h.render(e.type,e.props);};return {h,calls,render,modal};}
 const cancelled=setup();button(cancelled.modal(),'Verteilung bestätigen');nodes(cancelled.modal(),'PointAllocationRow')[0].props.onIncrease();nodes(cancelled.modal(),'RewardModal')[0].props.onClose();assert.equal(cancelled.calls.length,0);assert.equal(nodes(cancelled.render(),'Btn').some(n=>text(n)==='Ausbaupunkte verteilen · 6'),true);cancelled.h.unmount();
 const saved=setup();let tree=saved.modal();assert.equal(button(tree,'Verteilung bestätigen').props.disabled,true);const plus=nodes(tree,'PointAllocationRow')[0].props.onIncrease;for(let i=0;i<9;i++)plus();tree=saved.modal();const row=nodes(tree,'PointAllocationRow')[0];assert.equal(row.props.current,50,'preview uses the permanent base without bonuses');assert.equal(row.props.amount,6,'rapid increments stay bounded by the available points');assert.equal(nodes(tree,'PointsBalance')[0].props.remaining,0);assert.ok(!text(tree).includes('Boni +7'));
 const confirm=button(tree,'Verteilung bestätigen').props.onPress;await Promise.all([confirm(),confirm()]);assert.equal(saved.calls.length,1);assert.deepEqual(saved.calls[0],{action:'expansionAllocate',expedition:6,overtime:0,points:6});assert.ok(!text(saved.render()).includes('Ausbaupunkte verteilen · 6'));saved.h.unmount();
});

test('Shared modal X exposes a localized close action and never invokes it while disabled',()=>{
 const h=componentHarness('ModalCloseButton.tsx',{'./theme':{C:require('../src/palette.json')},'./i18n':{t:key=>key==='Schließen'?'Close':key}});let closed=0;
 const props={onPress:()=>closed++,disabled:true};let tree=h.render('ModalCloseButton',props);assert.equal(tree.props.accessibilityLabel,'Close');assert.equal(tree.props.accessibilityState.disabled,true);tree.props.onPress();assert.equal(closed,0);
 props.disabled=false;tree=h.render('ModalCloseButton',props);tree.props.onPress();assert.equal(closed,1);h.unmount();
});


test('Universal trade chest purchase confirms price and region opening consumes owned stock rather than coins',async()=>{
 const {h,props,calls,render,crate}=giftSetup();
 let tree=render();button(tree,'Handelstruhe kaufen · 200 Hermes-Siegel').props.onPress();
 tree=render();const confirm=nodes(tree,'RewardModal').find(node=>node.props.title==='Handelstruhe kaufen');assert.equal(confirm.props.visible,true);assert.equal(calls.length,0);
 await Promise.all([button(confirm,'Kaufen').props.onPress(),button(confirm,'Kaufen').props.onPress()]);assert.deepEqual(JSON.parse(JSON.stringify(calls)),[{action:'tradeChestBuy',payload:{}}]);
 props.data.state.coins=0;assert.equal(button(crate(render()),'Handelstruhe öffnen').props.disabled,false);
 await button(crate(render()),'Handelstruhe öffnen').props.onPress();assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1))),{action:'chestOpen',payload:{region:0}});
 h.unmount();
});
