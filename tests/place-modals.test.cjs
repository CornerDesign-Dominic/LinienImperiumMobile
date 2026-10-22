const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto'),ts=require('typescript'),React=require('react');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000,random=()=>.5;
function compile(file,override){const full=path.resolve(__dirname,'../src/'+file),m=new Module(full,module);m.filename=full;m.paths=module.paths;m.require=override;const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;m._compile(code,full);return m.exports;}
const ui={C:require('../src/palette.json'),Txt:'Text',Row:'Row',Btn:'Btn',Bar:'Bar',n:String,remaining:(at,clock)=>String(at-clock)};
const {ExpeditionPlaceDetails}=compile('ExpeditionPlaceDetails.tsx',id=>{
 if(id==='react')return React;if(id==='react-native')return {View:'View',StyleSheet:{create:x=>x}};
 if(id==='./ui')return ui;if(id==='./ExpeditionPlaceModal')return {PlaceStatus:'PlaceStatus',PlaceRewards:'PlaceRewards',PlaceExtraDetails:'PlaceExtraDetails'};
 if(id==='./regionIdentities')return {regionIdentities:Array.from({length:5},()=>({customer:'Customer'}))};throw Error(id);
});
function nodes(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...React.Children.toArray(node.props?.children).flatMap(child=>nodes(child,type))];}
function render(data,selected,options={}){const commands=[],missions=[],chances=[];const tree=ExpeditionPlaceDetails({data,region:0,selected,busy:false,clock:now,onCommand:(...p)=>commands.push(p),onMission:(...p)=>missions.push(p),onChances:()=>chances.push(true),...options});return {tree,commands,missions,chances,buttons:nodes(tree,'Btn')};}
const start=()=>execute(null,'foundCompany',{companyName:'Ortstest',cityName:'Testhafen'},now,random);
function explored(count=1){const r=start();r.state.expedition.regions[0].discovered=count;r.state.expedition.regions[0].endlessUnlocked=count===7;r.state.expedition.points=100;return execute(r.state,'sync',{},now,random);}
const click=(r,label)=>{const b=r.buttons.find(b=>b.props.children===label);assert.ok(b,label);assert.ok(!b.props.disabled,label+' is enabled');b.props.onPress();};
test('Reachable exploration spends a single point, blocks inaccessible places and does not promise an early module',()=>{
 const game=start();let r=render(game.view,0);click(r,'Erkunden · 1 Punkt');assert.deepEqual(r.commands,[['discover',{region:0}]]);
 assert.equal(render(game.view,1).tree,null);assert.equal(render(game.view,'endless').tree,null);
 game.view.state.expedition.points=0;r=render(game.view,0);assert.equal(r.buttons.find(b=>b.props.children==='Erkunden · 1 Punkt').props.disabled,true);
 r=render(explored(6).view,6);assert.equal(nodes(r.tree,'PlaceRewards').length,0,'Mobile grants the module on final collection, not discovery');
});
test('Bonus delivery keeps stable vehicle and claim commands through available, running, ready and collected states',()=>{
 let game=explored();let r=render(game.view,0);click(r,'Bonus liefern');assert.deepEqual(r.missions,[[0,'delivery',0]]);
 assert.equal(nodes(r.tree,'PlaceRewards')[0].props.items[0].label,'Expeditionskapazität');
 game=execute(game.state,'mission',{region:0,kind:'delivery',place:0,truck:game.view.state.trucks[0].id},now,random);
 r=render(game.view,0,{clock:now+7500});assert.equal(r.buttons.length,0);assert.equal(nodes(r.tree,'Bar')[0].props.value,50);
 game=execute(game.state,'sync',{},now+15001,random);const id=game.state.expedition.missions[0].id;r=render(game.view,0);click(r,'Bonus abholen');assert.deepEqual(r.commands,[['claimMission',{id}]]);
 game=execute(game.state,'claimMission',{id},now+15002,random);r=render(game.view,0);assert.equal(nodes(r.tree,'PlaceRewards')[0].props.received,true);assert.equal(r.buttons.length,0);assert.equal(game.state.expedition.regions[0].deliveries[0],true);
});
test('Final location retains discovery draws before customer completion and never promises a second module',()=>{
 for(const alreadyAwarded of [false,true]){
  let game=explored(7);game.state.expedition.regions[0].moduleAwarded=alreadyAwarded;game.state.inventory.capacityModules=2;game=execute(game.state,'sync',{},now,random);
  let r=render(game.view,'endless');click(r,'Kunde freischalten');assert.deepEqual(r.missions,[[0,'final',0]]);
  const draw=r.buttons.find(b=>/^Expedition ·/.test(b.props.children));assert.ok(draw);draw.props.onPress();assert.deepEqual(r.commands,[['draw',{region:0}]]);
  const pending=nodes(r.tree,'PlaceRewards')[0].props.items;assert.equal(pending.some(item=>item.icon==='module'),!alreadyAwarded);
  game=execute(game.state,'mission',{region:0,kind:'final',place:0,truck:game.view.state.trucks[0].id},now,random);
  r=render(game.view,'endless',{clock:now+7500});assert.ok(r.buttons.some(b=>/^Expedition ·/.test(b.props.children)),'Repeat expeditions remain available during first delivery');
  game=execute(game.state,'sync',{},now+15001,random);const id=game.state.expedition.missions[0].id;r=render(game.view,'endless');click(r,'Kunde freischalten');assert.deepEqual(r.commands,[['claimMission',{id}]]);
  game=execute(game.state,'claimMission',{id},now+15002,random);assert.equal(game.state.inventory.capacityModules,alreadyAwarded?2:3);r=render(game.view,'endless');assert.equal(nodes(r.tree,'PlaceRewards')[0].props.received,true);assert.ok(!r.buttons.some(b=>b.props.children==='Kunde freischalten'));click(r,'Fundchancen');assert.equal(r.chances.length,1);
 }
 const game=explored(7);game.view.state.expedition.points=0;const r=render(game.view,'endless',{busy:true});assert.ok(r.buttons.filter(b=>b.props.children!=='Fundchancen').every(b=>b.props.disabled));
 const missing=explored();missing.view.state.trucks=[];assert.equal(render(missing.view,0).buttons[0].props.disabled,true);
});
test('Every agreed place has a unique bundled close-up and invalid indices have no portrait',()=>{
 const {portraitForPlace}=compile('placePortraits.ts',id=>{if(id==='react-native')return {};if(id.endsWith('.jpg'))return {uri:id};throw Error(id);});const hashes=new Set();
 for(let region=0;region<5;region++)for(let place=0;place<8;place++){
  const image=portraitForPlace(region,place);assert.ok(image?.uri.includes('/places/'));const file=path.resolve(__dirname,'../src',image.uri),bytes=fs.readFileSync(file);assert.ok(bytes.length>50000);assert.equal(bytes[0],255);assert.equal(bytes[1],216);hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
 }
 assert.equal(hashes.size,40);for(const pair of [[-1,0],[5,0],[0,-1],[0,8]])assert.equal(portraitForPlace(...pair),undefined);
});
test('Modal images override Android intrinsic image sizes and the X remains outside scrolling content',()=>{
 function modal(width){return compile('ExpeditionPlaceModal.tsx',id=>{
  if(id==='react')return {...React,useState:()=>[width,()=>{}]};if(id==='react-native')return {View:'View',Image:'Image',Modal:'Modal',Pressable:'Pressable',ScrollView:'ScrollView',StyleSheet:{create:x=>x}};
  if(id==='./Language')return {Text:'Text'};if(id==='./i18n')return {t:x=>x};if(id==='./Icon')return {Icon:'Icon'};if(id==='./theme')return {C:ui.C,displayFont:'serif'};throw Error(id);
 });}
 for(const width of [286,326,356,396,458]){const {PlacePortrait}=modal(width),tree=PlacePortrait({source:{uri:'test',width:1536,height:1024}}),image=nodes(tree,'Image')[0];const frame={width:1536,height:1024,...image.props.style};assert.equal(frame.width,width);assert.ok(frame.height>=140&&frame.height<280);}
 const {ExpeditionPlaceModal,PlacePortrait}=modal(0);assert.equal(nodes(PlacePortrait({source:{uri:'test'}}),'Image').length,0);assert.equal(ExpeditionPlaceModal({visible:false,title:'Hidden',onClose:()=>{},children:null}),null);
 const tree=ExpeditionPlaceModal({visible:true,title:'Place',onClose:()=>{},children:null});assert.equal(nodes(tree,'Pressable').length,1);assert.equal(nodes(nodes(tree,'ScrollView')[0],'Pressable').length,0,'X does not scroll away');
});
