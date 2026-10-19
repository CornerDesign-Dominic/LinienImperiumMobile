const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const file=path.resolve(__dirname,'../src/i18n.ts');
const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(compiled,file);
const {t,setLanguage,getLanguage,getLocale,validLanguage,localizedHelp}=m.exports;
test('German is the default; unsupported preferences fall back to German and locale changes explicitly',()=>{
 assert.equal(getLanguage(),'de');assert.equal(getLocale(),'de-DE');assert.equal(validLanguage('fr'),'de');assert.equal(validLanguage(null),'de');
 assert.equal(t('Vorräte'),'Vorräte');setLanguage('en');assert.equal(getLocale(),'en-GB');assert.equal(t('Vorräte'),'Inventory');setLanguage('de');
});
test('Static and dynamic display messages localize without translating unknown names or identifiers',()=>{
 setLanguage('en');
 assert.equal(t('EINSTELLUNGEN'),'SETTINGS');assert.equal(t('Flotte 3'),'Fleet 3');assert.equal(t('Flotte 2 einsetzen'),'Assign fleet 2');assert.equal(t('Großprojekt mit eigenen Überstunden'),'Fleet project with own overtime');
 assert.equal(t('Kurierwagen · Rang 2'),'Courier van · Rank 2');
 assert.equal(t('Sonderauftrag Materialbergung'),'Special contract Material recovery');
 assert.equal(t('Gibt 50 Expeditionspunkte – auch über das Maximum hinaus.'),'Adds 50 expedition points, even beyond the maximum.');
 assert.equal(t('Common-Zahnräder'),'Common gears');
 assert.equal(t('Regionalverkehr · Kurz · Single Way'),'Regional transport · Short · Single Way');
 assert.equal(t('  Schließen  '),'  Close  ');
 for(const raw of ['Nordstern Logistik','cardCapacity','navigator','01:23:45','4.5 t','a@company.de'])assert.equal(t(raw),raw);
 assert.ok(localizedHelp('expeditions',[]).length);assert.ok(localizedHelp('inventory',[]).some(row=>row[1].includes('50 points')));
 setLanguage('de');assert.deepEqual(localizedHelp('inventory',[['Original','Deutsch']]),[['Original','Deutsch']]);
});
test('Catalog interpolation placeholders match and all game help sections have English entries',()=>{
 const catalog=require('../src/locales/en.json'),help=require('../src/locales/en-help.json');
 for(const [key,value] of Object.entries(catalog))assert.deepEqual([...key.matchAll(/\{\d+\}/g)].map(m=>m[0]).sort(),[...value.matchAll(/\{\d+\}/g)].map(m=>m[0]).sort(),key);
 for(const key of ['dashboard','orders','special','fleet','dealer','hub','inventory','development','company','personnel','expeditions','statistics','customers'])assert.ok(help[key]?.length,key);
});
