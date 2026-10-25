const {test}=require('node:test'),assert=require('node:assert/strict');
const identities=require('../functions/src/customer-identities.json');
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
function fixture(){
 const start=execute(null,'foundCompany',{companyName:'Nordbau GmbH',cityName:'Testhafen'},now,()=>.5);
 for(const identity of identities){const index=identities.indexOf(identity);start.state.expedition.regions[index].customerUnlocked=true;start.state.customerTrust[identity.id]=1000;}
 return execute(start.state,'sync',{},now,()=>.5);
}
test('One regional identity is used across customer, expedition and project views without renaming saved IDs or company names',()=>{
 const {state,view}=fixture();
 assert.deepEqual(view.catalog.customers.map(c=>c.id),identities.map(i=>i.id));
 for(const [index,identity]of identities.entries()){
  for(const customer of [view.catalog.customers[index],view.customers.find(c=>c.id===identity.id),view.expeditionMap[index].customer,view.projectCatalog[index].customer]){
   assert.equal(customer.name,identity.customer);assert.equal(customer.id,identity.id);assert.equal(customer.regionName,identity.title);
  }
  assert.equal(view.expeditionMap[index].name,identity.title);
  assert.equal(state.customerTrust[identity.id],1000);
 }
 assert.equal(view.state.profile.companyName,'Nordbau GmbH');
 const legacy=structuredClone(state);legacy.events.push({at:now,text:'Nordbau GmbH und EuroLog SE freigeschaltet.'});
 const updated=execute(legacy,'sync',{},now,()=>.5);
 assert.equal(updated.view.state.events.at(-1).text,'Königliches Handelskontor und Nordlicht-Kontor freigeschaltet.');
 assert.deepEqual(updated.state.customerTrust,state.customerTrust);assert.deepEqual(updated.state.customerSkills,state.customerSkills);
 assert.deepEqual(updated.state.inventory,state.inventory);assert.equal(updated.state.coins,state.coins);
});

// Render the actual components: assert the point signal, not a duplicate of its formula.
const fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const originalLoad=Module._load;
Module._load=function(name,parent,isMain){
 if(name==='react-native')return originalLoad.call(this,'react-native-web',parent,isMain);
 if(name==='@react-native-async-storage/async-storage')return {getItem:async()=>null,setItem:async()=>{}};
 if(/\.(png|jpg)$/.test(name))return {uri:name};
 return originalLoad.call(this,name,parent,isMain);
};
for(const extension of ['.ts','.tsx'])require.extensions[extension]=(m,filename)=>m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {CustomerList,CustomerDetail}=require('../src/Customers.tsx');
test('Compact customer cards show end-place images and level hints only for unallocated points; details retain skill editing',()=>{
 const {view}=fixture();view.customers[0].points=0;view.customers[1].points=2;
 const html=renderToStaticMarkup(React.createElement(CustomerList,{data:view,onOpen:()=>{}}));
 assert.ok(html.includes('customer-place-nordbau'));assert.ok(html.includes('customer-place-frischgut'));
 assert.ok(!html.includes('customer-points-nordbau'));assert.ok(html.includes('customer-points-frischgut'));
 assert.ok(!html.includes('Beziehung'));assert.ok(!html.includes('progressbar'));
 for(const id of ['nordbau','frischgut']){
  const detail=renderToStaticMarkup(React.createElement(CustomerDetail,{data:view,id,busy:false,onSave:()=>{}}));
  assert.equal(detail.includes('customer-points-'+id),id==='frischgut');
  assert.ok(detail.includes('Fähigkeiten'));assert.ok(!detail.includes('Beziehung'));
  assert.equal(detail.includes('Frachtvergütung hinzufügen'),id==='frischgut');
 }
});
