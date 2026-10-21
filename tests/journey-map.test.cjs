const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript'),React=require('react');
const layout=require('../src/journeyLayout');
function compile(name,requireOverride){const file=path.resolve(__dirname,'../src/'+name),m=new Module(file,module);m.filename=file;m.paths=module.paths;m.require=requireOverride;const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;m._compile(code,file);return m.exports;}
const {regionRoutes}=compile('regionRoutes.ts',id=>{if(id.endsWith('.jpg'))return {uri:id,width:2172,height:724};throw Error(id);});
const flatten=style=>typeof style==='function'?flatten(style({pressed:false})):Array.isArray(style)?Object.assign({},...style.filter(Boolean).map(flatten)):style||{};
function elements(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...React.Children.toArray(node.props?.children).flatMap(c=>elements(c,type))];}
function render(region,discovered,opened=[],regions=[],width=390,height=620){
 let state=0;
 const {ExpeditionJourney}=compile('ExpeditionJourney.tsx',id=>{
  if(id==='react')return {...React,useState:()=>[[{width,height},true,true][state++],()=>{}],useRef:()=>({current:null}),useMemo:f=>f(),useEffect:()=>{}};
  if(id==='react-native')return {View:'View',Image:'Image',Pressable:'Pressable',ScrollView:'ScrollView',StyleSheet:{create:x=>x}};
  if(id==='@react-native-async-storage/async-storage')return {getItem:async()=>null,setItem:async()=>{}};
  if(id==='./Language')return {Text:'Text'};
  if(id==='./i18n')return {t:x=>x};if(id==='./Icon')return {Icon:'Icon'};
  if(id==='./theme')return {C:{},displayFont:'serif'};
  if(id==='./regionIdentities')return {regionIdentities:Array.from({length:5},()=>({title:'Region'}))};
  if(id.endsWith('.png'))return {uri:id,width:887,height:1774};
  if(id==='./regionRoutes')return {regionRoutes};if(id==='./journeyLayout')return layout;throw Error(id);
 });
 return ExpeditionJourney({map:{index:region},maps:Array.from({length:5},(_,i)=>({open:i<=region+1})),state:{discovered,deliveries:Array(7).fill(false),finalClaimed:false},missions:[],accountId:'test',onPlace:p=>opened.push(p),onRegion:r=>regions.push(r)});
}
test('Five paintings map the seven existing places and final destination in their agreed order',()=>{
 const finals=['Kronenhafen','Weidenhafen','Karawanserei der sieben Bögen','Handelshof am Jadetor','Handelsfeste am Eisstrom'];
 assert.equal(regionRoutes.length,5);
 for(const [region,route] of regionRoutes.entries()){
  assert.equal(route.places.length,8);assert.equal(route.places[7].name,finals[region]);assert.equal(new Set(route.places.map(p=>p.name)).size,8);
  for(let i=0;i<8;i++){assert.ok(route.places[i].x>0&&route.places[i].x<1);assert.ok(route.places[i].y>0&&route.places[i].y<1);if(i)assert.ok(route.places[i].x>route.places[i-1].x);}
  const asset=path.resolve(__dirname,'../assets/art/journeys',route.image.uri.split('/').at(-1));assert.ok(fs.statSync(asset).size>100000,'Finished artwork is bundled');
 }
});
test('Every progression state omits locked landmarks and invokes the original stable place identifiers',()=>{
 for(let region=0;region<5;region++)for(let discovered=0;discovered<=7;discovered++){
  const opened=[],tree=render(region,discovered,opened),buttons=elements(tree,'Pressable').filter(n=>/^journey-place-/.test(n.props.testID));
  assert.equal(buttons.length,Math.min(8,discovered+1));
  const text=elements(tree,'Text').map(e=>e.props.children).join(' ');
  for(let index=0;index<8;index++)assert.equal(text.includes(regionRoutes[region].places[index].name),index<=discovered);
  for(const button of buttons)button.props.onPress();
  assert.deepEqual(opened,Array.from({length:Math.min(8,discovered+1)},(_,i)=>i===7?'endless':i));
  assert.equal(elements(tree,'View').some(n=>n.props.testID==='journey-fog'),discovered<7);
 }
});
test('Native panorama dimensions override intrinsic source size; responsive signs stay inside the map',()=>{
 for(const [width,height] of [[320,390],[360,520],[390,620],[430,720],[768,824]])for(let region=0;region<5;region++){
  const tree=render(region,7,[],[],width,height),image=elements(tree,'Image')[0],frame={width:2172,height:724,...flatten(image.props.style)};
  assert.ok(frame.width>=width);assert.ok(frame.width>=height*3);assert.equal(frame.width/frame.height,3);assert.ok(frame.top<=0&&frame.top+frame.height>=height);
  const sites=elements(tree,'Pressable').filter(n=>/^journey-place-/.test(n.props.testID));
  for(const site of sites){const s=flatten(site.props.style);assert.ok(s.width>=44&&s.paddingTop>=44);assert.ok(s.left>=0&&s.left+s.width<=frame.width,'No cropped name signs');assert.ok(s.top>=65,'Places remain below the title');assert.ok(s.top+s.paddingTop+(height<460?43:53)<height-60,`Name signs clear the bottom arrows: ${width}x${height}, region ${region}, ${site.props.testID}, bottom ${s.top+s.paddingTop+53}`);}
 }
});
test('Region arrows respect locks and boundaries; saved positions clamp after reset and survive resizing',()=>{
 const maps=[{open:true},{open:true},{open:false}];
 assert.equal(layout.adjacentJourneyRegion(maps,0,-1),null);assert.equal(layout.adjacentJourneyRegion(maps,0,1),1);assert.equal(layout.adjacentJourneyRegion(maps,1,1),null);assert.equal(layout.adjacentJourneyRegion(maps,2,1),null);
 const regions=[],tree=render(0,7,[],regions),arrows=elements(tree,'Pressable').filter(n=>n.props.testID?.endsWith('-region'));
 assert.deepEqual(arrows.map(a=>a.props.testID),['next-region']);arrows[0].props.onPress();assert.deepEqual(regions,[1]);
 const finalArrows=elements(render(4,7),'Pressable').filter(n=>n.props.testID?.endsWith('-region'));assert.deepEqual(finalArrows.map(a=>a.props.testID),['previous-region']);
 const g=layout.journeyGeometry(390,620,regionRoutes[0].places,7),saved=.32;
 assert.equal(layout.journeyOffset(g,390,0,saved),saved*g.worldWidth);
 const resized=layout.journeyGeometry(430,720,regionRoutes[0].places,7);assert.equal(layout.journeyOffset(resized,430,0,saved),saved*resized.worldWidth);
 const reset=layout.journeyGeometry(390,620,regionRoutes[0].places,0);assert.ok(layout.journeyOffset(reset,390,7,1)<=reset.contentWidth-390);
 assert.equal(layout.journeyFocus(3,[true,false,true,false,false,false,false],false),1);assert.equal(layout.journeyFocus(3,[true,true,true,false,false,false,false],false),3);assert.equal(layout.journeyFocus(7,Array(7).fill(true),true),7);
 for(const size of [[0,620],[390,NaN],[Infinity,620]])assert.equal(layout.journeyGeometry(...size,regionRoutes[0].places,0),null);
});
