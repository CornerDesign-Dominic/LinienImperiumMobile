const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const now=Date.UTC(2026,10,5,12);
const setup=()=>componentHarness('Wholesaler.tsx',{'./i18n':{t:String,getLocale:()=> 'de-DE'},'./LocationArt':{LocationArt:'LocationArt'},'./PremiumPackArt':{PremiumPackArt:'PremiumPackArt'}});
const base=()=>({initialTab:'season',clock:now,shop:{balance:1500,name:'Hermes-Siegel',skins:[],packs:[]},pass:{id:'2026-11:1',price:1000,status:'active',startsAt:Date.UTC(2026,10,1),endsAt:Date.UTC(2026,11,1),premium:false},onCommand:async()=>({}),onGifts:()=>{}});
const button=(tree,label)=>nodes(tree,'Btn').find(node=>text(node)===label);
test('Wholesaler confirms current Season price, displays balance and prevents duplicate purchase taps',async()=>{
 const h=setup(),calls=[];let finish;
 const props={...base(),onCommand:(...args)=>{calls.push(args);return new Promise(resolve=>finish=resolve);}};
 let tree=h.render('Wholesaler',props);assert.ok(text(tree).includes('Dein Guthaben: 1500 Hermes-Siegel'));
 button(tree,'Für 1000 Hermes-Siegel freischalten').props.onPress();assert.equal(calls.length,0);
 tree=h.render('Wholesaler',props);const modal=nodes(tree,'RewardModal')[0];assert.equal(modal.props.visible,true);
 const buying=button(modal,'Kaufen').props.onPress();await button(modal,'Kaufen').props.onPress();
 assert.deepEqual(JSON.parse(JSON.stringify(calls)),[['seasonPassBuy',{id:props.pass.id}]]);
 tree=h.render('Wholesaler',props);assert.equal(button(nodes(tree,'RewardModal')[0],'Kaufen').props.disabled,true);
 finish({});await buying;
 tree=h.render('Wholesaler',{...props,shop:{...props.shop,balance:500},pass:{...props.pass,premium:true}});
 assert.ok(text(tree).includes('Premium freigeschaltet'));assert.equal(button(tree,'Für 1000 Hermes-Siegel freischalten'),undefined);assert.equal(nodes(tree,'RewardModal')[0].props.visible,false);
});
test('Wholesaler gates unavailable, insufficient and expired Seasons and rejects a stale confirmation',async()=>{
 for(const patch of [{shop:{...base().shop,balance:999}},{shop:undefined},{busy:true},{pass:{...base().pass,status:'inactive'}},{clock:base().pass.endsAt}]){
  const h=setup(),props={...base(),...patch};assert.equal(button(h.render('Wholesaler',props),'Für 1000 Hermes-Siegel freischalten').props.disabled,true);
 }
 const h=setup(),calls=[],props={...base(),onCommand:async(...args)=>calls.push(args)};
 button(h.render('Wholesaler',props),'Für 1000 Hermes-Siegel freischalten').props.onPress();
 let tree=h.render('Wholesaler',{...props,pass:{...props.pass,id:'2026-11:2'}});
 assert.equal(nodes(tree,'RewardModal')[0].props.visible,false);
 await button(nodes(tree,'RewardModal')[0],'Kaufen').props.onPress();assert.equal(calls.length,0);
 assert.ok(text(h.render('Wholesaler',{...props,pass:undefined})).includes('Season wird geladen'));
});
test('Failed purchase remains reviewable and Handelstruhen navigation is preserved',async()=>{
 const h=setup(),props={...base(),onCommand:async()=>undefined};
 button(h.render('Wholesaler',props),'Für 1000 Hermes-Siegel freischalten').props.onPress();
 await button(nodes(h.render('Wholesaler',props),'RewardModal')[0],'Kaufen').props.onPress();
 assert.equal(nodes(h.render('Wholesaler',props),'RewardModal')[0].props.visible,true);
 const gifts=[];const original=setup();const tree=original.render('Wholesaler',{...base(),initialTab:'gifts',onGifts:()=>gifts.push(true)});
 nodes(tree,'Pressable').find(node=>node.props.accessibilityRole==='button'&&node.props.accessibilityLabel==='Handelstruhen').props.onPress();assert.equal(gifts.length,1);
 assert.ok(text(tree).includes('Truhen kaufen und eine Region zum Öffnen wählen'));
});
