const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const now=1800000000000,random=()=>.5;
const setup=()=>execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},now,random);
const harness=()=>componentHarness('Orders.tsx',{'./OrderVehiclePicker':{OrderVehiclePicker:'Picker'}});

test('List holding is a separate action, respects authoritative slots, and always allows release',()=>{
 let game=setup(),opened=[],pinned=[],stopped=0;const h=harness();
 const render=order=>h.render('OrderTile',{order,data:game.view,clock:now,onOpen:id=>opened.push(id),onPin:id=>pinned.push(id)});
 const first=game.view.state.orders.find(o=>o.status==='available');
 let tree=render(first),buttons=nodes(tree,'Pressable'),pin=buttons.find(b=>b.props.testID===`order-pin-${first.id}`);
 assert.equal(pin.props.disabled,false);assert.equal(pin.props['aria-pressed'],false);
 const hit=pin.props.style[0];assert.equal(hit.width,44);assert.equal(hit.height,44);assert.equal(hit.backgroundColor,undefined);assert.equal(hit.borderWidth,undefined);assert.equal(hit.borderRadius,undefined);
 pin.props.onPress({stopPropagation(){stopped++;}});
 assert.deepEqual(pinned,[first.id]);assert.deepEqual(opened,[]);assert.equal(stopped,1);
 buttons.find(b=>b.props.testID===`order-open-${first.id}`).props.onPress();assert.deepEqual(opened,[first.id]);
 game=execute(game.state,'pin',{id:first.id},now,random);
 assert.equal(game.view.silentSuccess,true,'successful holding needs no floating message');
 const held=game.view.state.orders.find(o=>o.id===first.id),other=game.view.state.orders.find(o=>o.status==='available'&&o.id!==first.id);
 const rejected=execute(game.state,'pin',{id:other.id},now,random);
 assert.equal(rejected.view.silentSuccess,false,'holding-limit feedback remains visible');assert.match(rejected.view.message,/nur.*halten/);
 pin=nodes(render(other),'Pressable').find(b=>b.props.testID===`order-pin-${other.id}`);assert.equal(pin.props.disabled,true);
 pin.props.onPress({stopPropagation(){}});assert.deepEqual(pinned,[first.id]);
 pin=nodes(render(held),'Pressable').find(b=>b.props.testID===`order-pin-${first.id}`);assert.equal(pin.props.disabled,false);assert.equal(pin.props['aria-pressed'],true);
 game=execute(game.state,'pin',{id:first.id},now,random);assert.equal(game.view.state.orders.find(o=>o.id===first.id).pinned,false);
 const busyTree=h.render('OrderTile',{order:held,data:game.view,clock:now,busy:true,onOpen:id=>opened.push(id),onPin:id=>pinned.push(id)});
 const busyPin=nodes(busyTree,'Pressable').find(b=>b.props.testID===`order-pin-${first.id}`);assert.equal(busyPin.props.disabled,true);
 busyPin.props.onPress({stopPropagation(){}});assert.deepEqual(pinned,[first.id],'busy hold action must not submit');
 const queued={...first,status:'queued'};assert.equal(nodes(render(queued),'Pressable').length,1,'stored orders have no hold action');
});

test('Duration bars and loaded return arrows retain precise accessible meanings',()=>{
 const h=harness();
 for(const [seconds,barCount,word]of [[300,1,'Kurz'],[301,2,'Mittel'],[900,2,'Mittel'],[901,3,'Lang']]){
  const tree=h.render('OrderTraits',{order:{category:'national',durationSeconds:seconds,routeType:'single'}});
  assert.ok(text(tree).includes(word));assert.ok(text(tree).includes('Nah'));
  assert.ok(nodes(tree,'View').some(n=>n.props.testID===`duration-bars-${barCount}`));
  assert.ok(nodes(tree,'View').some(n=>n.props.accessibilityLabel==='Single Way, beladene Hinfahrt und leere Rückfahrt'));
  const arrows=nodes(tree,'Icon').filter(n=>n.props.name==='direction');assert.equal(arrows.length,2);assert.equal(arrows[1].props.style.opacity,.25);
 }
 const dual=h.render('OrderTraits',{order:{category:'international',durationBand:'Lang',routeType:'dual'}});
 assert.ok(text(dual).includes('Fern'));assert.ok(text(dual).includes('Dual'));
 assert.equal(nodes(dual,'Icon').filter(n=>n.props.name==='direction')[1].props.style.opacity,1);
});

test('Nahverkehr is canonical in mobile categories, orders and help without renaming custom profile data',()=>{
 const initial=setup();initial.state.profile.companyName='Regionalverkehr AG';initial.state.profile.cityName='Regionalverkehr Stadt';
 initial.state.events.push({at:now,text:'Regionalverkehr AG fährt Regionalverkehr ab Regionalverkehr Stadt.'});
 const game=execute(initial.state,'sync',{},now,random),view=game.view;
 assert.equal(view.catalog.categories.find(c=>c.id==='national').label,'Nahverkehr');
 assert.ok(view.state.orders.filter(o=>o.category==='national').every(o=>o.transportLabel==='Nahverkehr'));
 assert.ok(!JSON.stringify(view.help).includes('Regionalverkehr'));
 assert.equal(view.state.profile.companyName,'Regionalverkehr AG');assert.equal(view.state.profile.cityName,'Regionalverkehr Stadt');
 assert.equal(view.state.events.at(-1).text,'Regionalverkehr AG fährt Nahverkehr ab Regionalverkehr Stadt.');
 assert.equal(initial.state.events.at(-1).text,'Regionalverkehr AG fährt Regionalverkehr ab Regionalverkehr Stadt.');
});

test('Stored categories keep real counts and tier order without consuming or reordering saved jobs',()=>{
 const h=harness(),game=setup(),chosen=[],opened=[];
 game.view.state.expedition.jobs=[
  {id:'third',kind:'material',tier:3},{id:'first',kind:'material',tier:1},
  {id:'second',kind:'material',tier:2},{id:'another-first',kind:'material',tier:1},
  {id:'card-job',kind:'character',tier:2}
 ];
 const before=JSON.stringify(game.view.state.expedition.jobs);
 const props={data:game.view,clock:now,busy:false,onOpen:()=>{},onJob:job=>chosen.push(job.id),onType:key=>opened.push(key)};
 const categories=h.render('SavedOrders',props),buttons=nodes(categories,'Pressable');
 assert.equal(buttons.length,2);
 assert.match(buttons[0].props.accessibilityLabel,/material, Anzahl 4/);
 assert.match(buttons[1].props.accessibilityLabel,/character, Anzahl 1/);
 buttons[1].props.onPress();assert.deepEqual(opened,['character']);
 const tiers=h.render('SavedOrders',{...props,typeKey:'material'}),tierButtons=nodes(tiers,'Pressable');
 assert.equal(tierButtons.length,3);
 tierButtons.forEach(button=>button.props.onPress());
 assert.deepEqual(chosen,['first','second','third'],'tiers ascend and equal-tier jobs retain first-in order');
 assert.equal(JSON.stringify(game.view.state.expedition.jobs),before);
});


test('Offer refresh countdown uses minutes and seconds with correct deadline boundaries',()=>{
 const {offerCountdown}=harness().exports;
 assert.equal(offerCountdown(now+554000,now),'09:14');
 assert.equal(offerCountdown(now+1,now),'00:01','a partial last second remains visible');
 assert.equal(offerCountdown(now,now),'00:00');
 assert.equal(offerCountdown(now-5000,now),'00:00','expired timers never go negative');
 assert.equal(offerCountdown(now+3600000,now),'60:00','long countdowns keep total minutes instead of an hours field');
});
