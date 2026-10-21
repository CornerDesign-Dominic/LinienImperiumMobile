const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript'),React=require('react');
const {regionImageFrame}=require('../src/regionImageLayout');
const source=path.resolve(__dirname,'../src/ExpeditionRegionCard.tsx');
const compiled=ts.transpileModule(fs.readFileSync(source,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
function render(width,height,index){
 const m=new Module(source,module);m.filename=source;m.paths=module.paths;
 m.require=id=>{
  if(id==='react')return {...React,useState:()=>[{width,height},()=>{}]};
  if(id==='react-native')return {View:'View',Image:'Image',Pressable:'Pressable',StyleSheet:{create:x=>x}};
  if(id==='./Language')return {Text:'Text'};
  if(id==='./i18n')return {t:x=>x};
  if(id==='./Icon')return {Icon:'Icon'};
  if(id==='./theme')return {C:require('../src/palette.json'),displayFont:'serif',regionInks:['#315F59']};
  if(id==='./ui')return {n:v=>String(v)};
  if(id==='./regionIdentities')return {regionIdentities:Array.from({length:5},()=>({title:'Region',customer:'Customer'}))};
  if(id==='./regionImageLayout')return {regionImageFrame};
  if(id.endsWith('.jpg'))return {uri:id,width:768,height:512};
  throw Error('Unexpected import '+id);
 };
 m._compile(compiled,source);
 return m.exports.ExpeditionRegionCard({map:{index,progress:40,open:true},onOpen:()=>{}});
}
const flatten=style=>typeof style==='function'?flatten(style({pressed:false})):Array.isArray(style)?Object.assign({},...style.filter(Boolean).map(flatten)):style||{};
function elements(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...React.Children.toArray(node.props?.children).flatMap(c=>elements(c,type))];}
test('Android image sizing overrides bundled source dimensions and keeps the intended landscape in the viewport',()=>{
 for(const screen of [320,360,390,430])for(let region=0;region<5;region++){
  const width=screen-38,height=150,card=render(width,height,region),image=elements(card,'Image')[0];
  assert.ok(image);
  // Image.android.js prepends the bundled source size, then applies user styles.
  const frame={width:image.props.source.width,height:image.props.source.height,...flatten(image.props.style)};
  assert.equal(frame.position,'absolute');assert.equal(frame.width,width);
  assert.ok(Math.abs(frame.width/frame.height-1.5)<1e-9,'Painting retains its aspect ratio');
  assert.ok(frame.left<=0&&frame.top<=0&&frame.left+frame.width>=width&&frame.top+frame.height>=height,'Image covers its viewport without borders');
  const scale=frame.width/768,sourceTop=-frame.top/scale,sourceBottom=(height-frame.top)/scale;
  // Landmark band includes manor/bridge/caravan buildings and the transport silhouettes.
  assert.ok(sourceTop<220&&sourceBottom>390,'Regional landmarks survive the crop');
 }
});
test('Unmeasured scenes defer the image; invalid viewport values cannot create oversized native images',()=>{
 assert.equal(elements(render(0,0,0),'Image').length,0);
 for(const [width,height] of [[0,150],[-1,150],[NaN,150],[300,Infinity]])assert.equal(regionImageFrame(width,height,0),null);
});
if(process.env.REGION_NATIVE_FRAMES){
 for(const screen of [320,360,390,430])for(let i=0;i<5;i++){
  const width=screen-38,height=150,frame={width:768,height:512,...flatten(elements(render(width,height,i),'Image')[0].props.style)};
  fs.appendFileSync(process.env.REGION_NATIVE_FRAMES,[width,height,frame.width,frame.height,frame.left,frame.top].join(' ')+'\n');
 }
}
