const {test}=require('node:test'),assert=require('node:assert/strict');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const {execute}=require('../functions/src/engine.cjs');

test('Fleet contract categories prioritize available work stably and keep real counts and destinations',()=>{
 const game=execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},1800000000000,()=>.5).view;
 const catalog=game.projectCatalog,first=catalog[1],second=catalog[3],referral=catalog.find(c=>c.kind==='referral');
 game.state.orders.push(
  {id:'ready-a',isProject:true,status:'queued',projectInfo:{key:first.key}},
  {id:'ready-b',isProject:true,status:'queued',projectInfo:{key:first.key}},
  {id:'ready-c',isProject:true,status:'queued',projectInfo:{key:second.key}},
  {id:'referral',isProject:true,status:'queued',projectInfo:{key:referral.key}},
  {id:'already-running',isProject:true,status:'active',projectInfo:{key:catalog[0].key}},
  {id:'single',isProject:false,status:'queued',projectInfo:{key:catalog[0].key}}
 );
 const before=JSON.stringify(game),opened=[];
 const h=componentHarness('Projects.tsx',{'./Language':{Text:'Text'},'./LocationArt':{LocationArt:'LocationArt'},'./ProjectCategoryArt':{ProjectCategoryArt:'ProjectCategoryArt'}});
 let running=0;const tree=h.render('Projects',{data:game,onRunning:()=>running++,onType:key=>opened.push(key)});
 const categories=nodes(tree,'Pressable').filter(n=>n.props.testID?.startsWith('project-category-'));
 const available=[first,second,referral],empty=catalog.filter(c=>!available.includes(c));
 assert.deepEqual(categories.map(n=>n.props.testID),[...available,...empty].map(c=>'project-category-'+c.key));
 assert.ok(text(categories[0]).includes('2 verfügbar'));assert.ok(text(categories[1]).includes('1 verfügbar'));
 assert.ok(text(categories[2]).includes('Alle Stammkunden'));assert.ok(text(categories[3]).includes('Keine verfügbar'));
 categories.forEach(n=>n.props.onPress());assert.deepEqual(opened,[...available,...empty].map(c=>c.key));
 nodes(tree,'Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Laufende Großaufträge')).props.onPress();assert.equal(running,1);
 assert.equal(JSON.stringify(game),before,'render and category navigation cannot consume or reorder server data');
});
