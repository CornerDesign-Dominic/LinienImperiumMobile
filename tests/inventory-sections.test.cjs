const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
function load(relative){
 const filename=path.resolve(__dirname,relative),m=new Module(filename,module);m.filename=filename;m.paths=module.paths;
 m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,filename);return m.exports;
}
const {inventorySections}=load('../src/inventorySections.ts'),{stockItems}=load('../src/items.ts');
const {execute}=require('../functions/src/engine.cjs');
test('Inventory sections retain every visible catalog item once, sort rarities and order tiers, and retain future items',()=>{
 const {view}=execute(null,'foundCompany',{companyName:'Test',cityName:'Hafen'},1800000000000,()=>.5);
 const items=stockItems(view).map(item=>({...item,amount:1}));
 items.push({id:'project:example',amount:2},{id:'new-future-supply',amount:3});
 const reversed=[...items].reverse(),sections=inventorySections(reversed),flattened=sections.flatMap(section=>section.items);
 assert.deepEqual(new Set(flattened.map(item=>item.id)),new Set(items.map(item=>item.id)));
 assert.equal(flattened.length,items.length);
 assert.ok(flattened.every(item=>items.includes(item)),'Use the original stock object, including its action metadata');
 assert.deepEqual(sections.map(section=>section.id),['refills','chests','upgrades','crafting','materials','shards','orders','other']);
 assert.deepEqual(sections.find(s=>s.id==='materials').items.map(i=>i.id),view.catalog.rarities.map(r=>'gear:'+r.id));
 assert.deepEqual(sections.find(s=>s.id==='orders').items.slice(0,6).map(i=>i.id),['job:material:1','job:material:2','job:material:3','job:character:1','job:character:2','job:character:3']);
 assert.equal(sections.at(-1).items[0].id,'new-future-supply');
 assert.deepEqual(reversed,[...items].reverse(),'Do not mutate inventory input');
 assert.deepEqual(inventorySections([]),[]);
});
