// Small deterministic hook/timer harness for application decisions. Host views
// are opaque; native rendering, layout and accessibility need separate UI QA.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),React=require('react'),ts=require('typescript');
const cache=new Map();
function componentHarness(file,imports={}){
 const frames=new Map(),timers=new Map();let current,hook=0,now=0,nextTimer=0;
 const frame=component=>{if(!frames.has(component))frames.set(component,{slots:[],effects:[],changed:false});return frames.get(component);};
 const hooks={...React,
  useState(initial){const f=current,i=hook++;if(!f.slots[i])f.slots[i]={value:typeof initial==='function'?initial():initial};return [f.slots[i].value,value=>{const next=typeof value==='function'?value(f.slots[i].value):value;if(!Object.is(next,f.slots[i].value)){f.slots[i].value=next;f.changed=true;}}];},
  useRef(initial){const f=current,i=hook++;return f.slots[i]||(f.slots[i]={current:initial});},
  useEffect(effect,deps){const f=current,i=hook++,previous=f.slots[i];if(!previous||!deps||deps.some((value,index)=>!Object.is(value,previous.deps?.[index]))){f.effects.push(()=>{previous?.cleanup?.();const cleanup=effect();f.slots[i]={deps,cleanup};});}}
 };
 const filename=path.resolve(__dirname,'../../src',file);
 if(!cache.has(filename))cache.set(filename,ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText);
 const exports={};const required=id=>{
  if(Object.hasOwn(imports,id))return imports[id];
  if(id==='react')return hooks;
  if(id==='react-native')return {View:'View',Pressable:'Pressable',Modal:'Modal',ScrollView:'ScrollView',StyleSheet:{create:x=>x},AccessibilityInfo:{isReduceMotionEnabled:async()=>false}};
  if(id==='react-native-safe-area-context')return {SafeAreaView:'SafeAreaView'};
  if(id==='./i18n')return {t:String};
  if(id==='./ui')return {C:require('../../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Pill:'Pill',n:String};
  if(id==='./ItemArt')return {ItemArt:'ItemArt',ItemAmount:'ItemAmount'};
  if(id==='./Icon')return {Icon:'Icon'};
  if(id==='./VehicleArt')return {VehicleArt:'VehicleArt'};
  if(id==='./ExpeditionPlaceModal')return {ExpeditionPlaceModal:'RewardModal'};
  if(id==='./giftReveal')return require('../../src/giftReveal.js');
  if(id==='./regionIdentities')return {regionIdentities:[{title:'Canonical region'}]};
  if(id==='./items')return {rarityColor:()=> '#123456',itemName:x=>x};
  throw Error('Unexpected component dependency '+id);
 };
 vm.runInNewContext(cache.get(filename),{exports,require:required,setTimeout:(fn,delay)=>{const id=++nextTimer;timers.set(id,{fn,at:now+delay});return id;},clearTimeout:id=>timers.delete(id)},{filename});
 function render(component,props){if(typeof component==='string')component=exports[component];const f=frame(component);let tree;for(let pass=0;pass<10;pass++){current=f;hook=0;f.changed=false;tree=component(props);for(const effect of f.effects.splice(0))effect();if(!f.changed)return tree;}throw Error('Component did not settle');}
 function advance(ms){const until=now+ms;let ticks=0;while(true){const next=[...timers].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;if(++ticks>1000)throw Error('Timer did not settle');now=next[1].at;timers.delete(next[0]);next[1].fn();}now=until;}
 return {exports,render,advance,next(){const first=Math.min(...[...timers.values()].map(t=>t.at));if(!Number.isFinite(first))throw Error('No timer');advance(first-now);},unmount(){for(const f of frames.values())for(const slot of f.slots)slot?.cleanup?.();frames.clear();},pendingTimers:()=>timers.size};
}
function nodes(node,type){if(!node||typeof node!=='object')return [];return [...(node.type===type?[node]:[]),...React.Children.toArray(node.props?.children).flatMap(child=>nodes(child,type))];}
function text(node){if(node==null||typeof node==='boolean')return '';if(typeof node==='string'||typeof node==='number')return String(node);if(Array.isArray(node))return node.map(text).join('');return text(node.props?.children);}
module.exports={componentHarness,nodes,text};
