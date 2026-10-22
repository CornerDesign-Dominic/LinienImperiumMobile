'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const load=Module._load;
Module._load=function(name,parent,isMain){
 if(name==='react-native')return load.call(this,'react-native-web',parent,isMain);
 if(name==='@react-native-async-storage/async-storage')return {getItem:async()=>null,setItem:async()=>{}};
 if(name.endsWith('.png'))return {uri:'data:image/png;base64,iVBORw0KGgo='};
 return load.call(this,name,parent,isMain);
};
for(const extension of ['.ts','.tsx'])require.extensions[extension]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {Events}=require('../src/Events.tsx'),{EventProject}=require('../src/EventProject.tsx');
const {execute}=require('../functions/src/engine.cjs');
const T=1800000000000,id='large-project-own-overtime';
let r=execute(null,'start',{id:'hamburg'},T,()=>.5);r=execute(r.state,'seat',{id:'navigator',template:0,seat:0},T,()=>.5);r=execute(r.state,'eventStart',{id,run:0},T,()=>.5);r=execute(r.state,'eventFleet',{id,run:1,template:0},T,()=>.5);r=execute(r.state,'eventOvertime',{id,run:1,amount:1},T,()=>.5);
const event=r.view.testEvents[0],noop=()=>{};
test('Event entry renders real test controls and registration without new region or artwork dependencies',()=>{
 const available=execute(null,'sync',{},T,()=>.5).view.testEvents;
 const html=renderToStaticMarkup(React.createElement(Events,{events:available,busy:false,onStart:noop,onEnd:noop,onInfo:noop,onRegister:noop,onJoin:noop}));
 for(const text of ['Die Pyramide','Solotest einstellen','Solotest starten','48 Stunden','180 km','360 km','5 Tage'])assert.ok(html.includes(text),text);
});
for(const tab of ['event','pass','ranks'])test(`The ${tab} tab renders actual server data with accessible navigation`,()=>{
 const original=React.useState;React.useState=initial=>original(initial==='event'?tab:initial);
 let html;try{html=renderToStaticMarkup(React.createElement(EventProject,{event,busy:false,clock:T,onFleet:noop,onManage:noop,onEnd:noop,onCommand:noop,overtimePoints:99}));}finally{React.useState=original;}
 for(const label of ['Event','Pass','Ränge'])assert.ok(html.includes(label));
 assert.ok(html.includes('role="tab"'));assert.ok(html.includes('aria-selected="true"'));
 if(tab==='event'){assert.ok(html.includes('Baustufe'));assert.ok(html.includes('Beladene Hinfahrt'));assert.ok(html.includes('Überstunden einsetzen'));}
 if(tab==='pass'){assert.ok(html.includes('85 von 100'));assert.ok(html.includes('Legendäre Karte (Platzhalter)'));assert.ok(html.includes('Expeditionspunkte verwenden'));}
 if(tab==='ranks'){assert.ok(html.includes('Transport-Rangliste'));assert.ok(html.includes('Steine'));assert.ok(html.includes('Du'));}
});
