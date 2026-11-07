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
 assert.equal(t('Botenstation'),'Courier Station');assert.equal(t('Botenstation, Kasse voll'),'Courier Station, Cashbox full');
 assert.equal(t('EINSTELLUNGEN'),'SETTINGS');assert.equal(t('Flotte 3'),'Fleet 3');assert.equal(t('Flotte 2 einsetzen'),'Assign fleet 2');assert.equal(t('Großprojekt mit eigenen Überstunden'),'Fleet project with own overtime');
 assert.equal(t('Kurierwagen · Rang 2'),'Courier van · Rank 2');
 assert.equal(t('Sonderauftrag Materialbergung'),'Special contract Material recovery');
 assert.equal(t('Sonderauftrag Schmuck der Krone'),'Special contract Jewels of the Crown');
 assert.equal(t('Sonderauftrag Schmuck der Krone, Kronenlande, Aufträge 2'),'Special contract Jewels of the Crown, Crownlands, contracts 2');
 assert.equal(t('Füllt Expeditionspunkte bis zu deinem Maximum auf. Aktuell +170 Punkte.'),'Fills expedition points to your maximum. Currently +170 points.');
 assert.equal(t('Handelstruhe kaufen · 200 Hermes-Siegel'),'Buy trade chest · 200 Hermes seals');
 assert.equal(t('Common-Zahnräder'),'Common gears');
 assert.equal(t('Regionalverkehr · Kurz · Single Way'),'Regional transport · Short · Single Way');
 assert.equal(t('  Schließen  '),'  Close  ');
 for(const raw of ['Nordstern Logistik','cardCapacity','navigator','01:23:45','4.5 t','a@company.de'])assert.equal(t(raw),raw);
 assert.ok(localizedHelp('expeditions',[]).length);assert.ok(localizedHelp('inventory',[]).some(row=>row[1].includes('personal maximum')));
 setLanguage('de');assert.deepEqual(localizedHelp('inventory',[['Original','Deutsch']]),[['Original','Deutsch']]);
});
test('Catalog interpolation placeholders match and all game help sections have English entries',()=>{
 const catalog=require('../src/locales/en.json'),help=require('../src/locales/en-help.json');
 for(const [key,value] of Object.entries(catalog))assert.deepEqual([...key.matchAll(/\{\d+\}/g)].map(m=>m[0]).sort(),[...value.matchAll(/\{\d+\}/g)].map(m=>m[0]).sort(),key);
 for(const key of ['dashboard','orders','special','fleet','dealer','hub','inventory','development','company','personnel','expeditions','statistics','customers'])assert.ok(help[key]?.length,key);
});
test('Procurement messages and help localize in English',()=>{
 setLanguage('en');
 assert.equal(t('Materialbeschaffung'),'Material procurement');
 assert.equal(t('Freigeschaltet'),'Unlocked');assert.equal(t('Fahrzeug einsetzen'),'Assign vehicle');
 assert.equal(t('Beschaffung 3'),'Procurement 3');
 assert.equal(t('Bis Reserve von 10.000 T'),'Until reserve of 10.000 Imperium thalers');
 assert.equal(t('Nach laufender Tour beenden'),'Finish after current trip');
 assert.ok(localizedHelp('procurement',[]).some(row=>row[1].includes('8,000')));
 setLanguage('de');
});


test('Upgrade point labels and messages use the new name in both languages',()=>{
 setLanguage('de');assert.equal(t('Ausbaupunkte'),'Ausbaupunkte');
 setLanguage('en');assert.equal(t('Ausbaupunkte'),'Upgrade points');assert.equal(t('Ausbaupunkte verteilen · 3'),'Allocate upgrade points · 3');assert.equal(t('+2 Ausbaupunkte'),'+2 upgrade points');assert.equal(t('1 Ausbaupunkt erhalten'),'1 upgrade point received');
 setLanguage('de');
});
test('Courier display labels and help use kilograms while regular transport retains tonnes',()=>{
 setLanguage('en');assert.equal(t('Lastwombat · 20 kg Startkapazität'),'Pack wombat · 20 kg starting capacity');assert.equal(t('+128,7 kg pro Stunde nach Ausbau'),'+128,7 kg per hour after upgrade');assert.equal(t('Verteilung pro Stunde'),'distributed per hour');assert.ok(localizedHelp('hub',[]).some(row=>row[1].includes('starts with 20 kg')));assert.ok(!localizedHelp('hub',[]).some(row=>row[1].includes('Each tonne')));assert.equal(t('4.5 t'),'4.5 t');setLanguage('de');
});
