const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const filename=path.resolve(__dirname,'../src/items.ts');
const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const m=new Module(filename,module);m.filename=filename;m.paths=module.paths;m._compile(compiled,filename);
const {stockItems,itemName}=m.exports;
const {execute}=require('../functions/src/engine.cjs');
const now=1800000000000;
const initial=()=>execute(null,'foundCompany',{companyName:'Testfirma',cityName:'Testhafen'},now,()=>.5);

test('Every usable material, gear rarity and shard rarity is represented in inventory with canonical names',()=>{
 const game=initial(),g=game.view.state;
 for(const key of Object.keys(g.inventory))if(key!=='gears'&&key!=='companyItemTkmRemainder')g.inventory[key]=7;
 for(const key of Object.keys(g.inventory.gears))g.inventory.gears[key]=7;
 for(const key of ['common','uncommon','rare'])g.expedition.shards[key]=7;
 const items=stockItems(game.view),ids=new Set(items.filter(i=>i.amount>0).map(i=>i.id));
 for(const key of Object.keys(g.inventory))if(key!=='gears'&&key!=='companyItemTkmRemainder')assert.ok(ids.has(key),key);
 for(const r of game.view.catalog.rarities)assert.ok(ids.has('gear:'+r.id),r.id);
 for(const r of ['common','uncommon','rare'])assert.ok(ids.has('shard:'+r),r);
 assert.equal(items.find(i=>i.id==='companyItems').name,itemName('companyItems'));
 assert.equal(items.find(i=>i.id==='overtimeRefills').name,'Überstundenauffüller');
 assert.equal(items.find(i=>i.id==='capacityModules').use,undefined);
 assert.equal(items.find(i=>i.id==='gear:common').use,undefined);
 assert.ok(!items.some(i=>i.id.startsWith('card:')),'Vehicle cards belong only in the collection');
 assert.ok(g.expedition.characters.navigator,'Inventory filtering must retain owned cards');
});

test('All four engine recipes are listed and crafting outputs return to inventory',()=>{
 let game=initial();game.state.inventory.pickupHints=100;game.state.inventory.companyItems=10;
 game.state.expedition.shards.common=10;game.state.expedition.shards.uncommon=10;
 game.state.expedition.regions[0].customerUnlocked=true;
 game=execute(game.state,'sync',{},now,()=>.5);
 const recipes=game.view.catalog.recipes;
 assert.deepEqual(recipes.map(r=>r.id),['pickup','customer','uncommon','rare']);
 assert.deepEqual(recipes.map(r=>r.needed),[100,10,10,10]);
 assert.equal(recipes[1].input,itemName('companyItems',2));
 for(const r of recipes)game=execute(game.state,r.action,r.payload||{},now,()=>.5);
 const owned=stockItems(game.view).filter(i=>i.amount>0);
 for(const id of ['order:private','order:customer','shard:uncommon','shard:rare'])assert.ok(owned.some(i=>i.id===id),id);
 assert.equal(owned.find(i=>i.id==='order:private').recipe,'100 Abholhinweise → 1 Privatabholung');
 assert.equal(owned.find(i=>i.id==='order:customer').recipe,'10 Firmenausbau-Items → 1 Kundenauftrag');
});

test('Found jobs stack by kind and rank, queued projects appear, and running work leaves inventory',()=>{
 let game=initial();game.state.expedition.regions[0].endlessUnlocked=true;game.state.expedition.points=100;
 game=execute(game.state,'draw',{region:0},now,()=>.5);
 const job=game.state.expedition.jobs[0];assert.ok(job);
 game.state.expedition.jobs.push({...job,id:job.id+100,region:1});
 game.state.expedition.nextMission+=101;
 game=execute(game.state,'draw',{region:0},now,()=>.97);
 const project=game.view.state.orders.find(o=>o.isProject&&o.status==='queued');assert.ok(project);
 let stock=stockItems(game.view);
 assert.equal(stock.find(i=>i.id===`job:${job.kind}:${job.tier}`).amount,2);
 assert.equal(stock.find(i=>i.id==='project:'+project.projectInfo.key).amount,1);
 game=execute(game.state,'mission',{region:job.region,kind:'endless',place:job.id,truck:game.state.trucks[0].id},now,()=>.5);
 stock=stockItems(game.view);
 assert.equal(stock.find(i=>i.id===`job:${job.kind}:${job.tier}`).amount,1);
 assert.ok(!stock.some(i=>i.id.startsWith('mission:')));
});
