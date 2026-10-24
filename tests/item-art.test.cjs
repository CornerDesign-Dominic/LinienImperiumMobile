const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const file=path.resolve(__dirname,'../src/itemVisual.js'),m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,file);
const {itemVisual,romanTier}=m.exports;
const {execute}=require('../functions/src/engine.cjs');
test('Illustrations cover actual catalog materials, every rarity and supported stock order without changing IDs',()=>{
 const {view}=execute(null,'foundCompany',{companyName:'Art',cityName:'Hub'},1800000000000,()=>.5);
 for(const id of Object.keys(view.state.inventory).filter(id=>!['gears','companyItemTkmRemainder'].includes(id)))assert.ok(itemVisual(id),id);
 for(const r of view.catalog.rarities)for(const kind of ['gear','shard'])assert.equal(itemVisual(`${kind}:${r.id}`).asset,`${kind}-${r.id}`);
 assert.equal(itemVisual('hubVehicleParts').asset,'hubVehicleParts');
 assert.equal(view.catalog.itemNames?.hubVehicleParts?.[0]||require('../functions/src/item-names.json').hubVehicleParts[0],'Werkzeugkasten');
 assert.equal(itemVisual('not-an-item'),null);
});
test('Order type, rarity, large bow and rank stay independent; private pickups remain single orders',()=>{
 for(const kind of ['private','customer','material','character','referral','special'])for(const rarity of ['common','uncommon','rare','epic','legendary']){
  for(const large of [false,true]){const v=itemVisual(kind,{rarity,large,tier:3});assert.equal(v.asset,`scroll-${large?'large':'small'}-${rarity}`);assert.equal(v.kind,kind);assert.equal(v.tier,3);}
 }
 assert.equal(itemVisual('order:private').large,false);
 assert.equal(itemVisual('job:character:3').tier,3);
 assert.equal(itemVisual('project:unknown-key',{kind:'special',rarity:'rare'}).large,true);
 assert.equal(itemVisual('referral').rarity,'epic');
 assert.equal(itemVisual('special').rarity,'rare');
});
test('Roman ranks reject invalid overlays and remain separate from item quantities',()=>{
 for(const [n,s]of [[1,'I'],[2,'II'],[3,'III'],[4,'IV'],[9,'IX'],[10,'X'],[25,'XXV']])assert.equal(romanTier(n),s);
 for(const n of [undefined,0,-1,1.5,NaN,Infinity,4000])assert.equal(romanTier(n),'');
});
