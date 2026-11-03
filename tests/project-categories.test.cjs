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
 const before=JSON.stringify(game);
 const h=componentHarness('Projects.tsx',{'./Language':{Text:'Text'},'./LocationArt':{LocationArt:'LocationArt'},'./ProjectCategoryArt':{ProjectCategoryArt:'ProjectCategoryArt'}});
 let running=0;const tree=h.render('Projects',{data:game,onRunning:()=>running++});
 const categories=nodes(tree,'Pressable').filter(n=>n.props.testID?.startsWith('project-category-'));
 const available=[first,second,referral],empty=catalog.filter(c=>!available.includes(c));
 assert.deepEqual(categories.map(n=>n.props.testID),[...available,...empty].map(c=>'project-category-'+c.key));
 assert.ok(text(categories[0]).includes('2 verfügbar'));assert.ok(text(categories[1]).includes('1 verfügbar'));
 assert.ok(text(categories[2]).includes('Alle Stammkunden'));assert.ok(text(categories[3]).includes('Keine verfügbar'));
 assert.equal(nodes(tree,'Pressable').filter(n=>n.props.testID?.startsWith('project-info-')).length,catalog.length,'every category has a separate information action');
 nodes(tree,'Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Laufende Großaufträge')).props.onPress();assert.equal(running,1);
 assert.equal(JSON.stringify(game),before,'render and category navigation cannot consume or reorder server data');
});


test('Category help and empty cards show brief information; available cards require explicit fleet confirmation',async()=>{
 const game=execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},1800000000000,()=>.5).view;
 const info=game.projectCatalog[0],commands=[],opened=[];
 game.state.orders.push({id:'ready',isProject:true,status:'queued',kind:info.kind,projectName:info.name,projectInfo:info,volume:520,distance:145,deadlineMs:3600000,templates:[{index:0,vehicles:[{model:'Eselkarren'}]},{index:1,vehicles:null}]});
 const h=componentHarness('Projects.tsx',{'./Language':{Text:'Text'},'./LocationArt':{LocationArt:'LocationArt'},'./ProjectCategoryArt':{ProjectCategoryArt:'ProjectCategoryArt'},'./ui':{C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Pill:'Pill',Empty:'Empty',n:String,minutes:seconds=>`${seconds/60} Min.`}});
 let resolveStart;const props={data:game,onRunning:()=>{},onOpen:id=>opened.push(id),onCommand:(command,args)=>{commands.push([command,args]);return new Promise(resolve=>resolveStart=resolve);}};
 const render=()=>h.render('Projects',props),byId=(tree,id)=>nodes(tree,'Pressable').concat(nodes(tree,'Btn')).find(n=>n.props.testID===id),visible=tree=>nodes(tree,'Modal').filter(n=>n.props.visible);
 let tree=render(),stopped=0;
 byId(tree,'project-info-'+info.key).props.onPress({stopPropagation(){stopped++;}});tree=render();
 assert.equal(stopped,1);assert.equal(commands.length,0);assert.equal(visible(tree).length,1);
 assert.ok(nodes(visible(tree)[0],h.exports.ProjectBrief).length,'help is brief rather than a full empty contract screen');
 byId(tree,'project-info-close').props.onPress();tree=render();assert.equal(visible(tree).length,0);
 const empty=game.projectCatalog[1];byId(tree,'project-category-'+empty.key).props.onPress();tree=render();assert.equal(visible(tree).length,1);assert.equal(commands.length,0);
 byId(tree,'project-info-close').props.onPress();tree=render();byId(tree,'project-category-'+info.key).props.onPress();tree=render();
 assert.ok(text(visible(tree)[0]).includes('Auftrag starten?'));assert.equal(commands.length,0);assert.equal(byId(tree,'project-start-confirm').props.disabled,true);
 byId(tree,'project-start-close').props.onPress();tree=render();assert.equal(visible(tree).length,0,'X cancels without starting');
 byId(tree,'project-category-'+info.key).props.onPress();tree=render();byId(tree,'project-fleet-0').props.onPress();tree=render();
 assert.equal(byId(tree,'project-start-confirm').props.disabled,false);assert.equal(byId(tree,'project-fleet-1'),undefined,'empty fleets cannot be selected');
 const submit=byId(tree,'project-start-confirm').props.onPress;const pending=submit();submit();assert.equal(JSON.stringify(commands),JSON.stringify([['projectStart',{id:'ready',template:0}]]),'duplicate taps submit once');
 resolveStart({state:{orders:[{id:'ready',status:'active'}]}});await pending;tree=render();assert.deepEqual(opened,['ready']);assert.equal(visible(tree).length,0);
});
