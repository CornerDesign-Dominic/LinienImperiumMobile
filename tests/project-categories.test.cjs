const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');

test('Fleet contract categories keep rarity and reverse-region order while tabs show real totals',()=>{
 const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
 const game=execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},1800000000000,()=>.5).view;
 const catalog=game.projectCatalog,first=catalog[1],second=catalog[3],referral=catalog.find(c=>c.kind==='referral');
 game.state.orders.push(
  {id:'ready-a',isProject:true,status:'queued',projectInfo:{key:first.key}},
  {id:'ready-b',isProject:true,status:'queued',projectInfo:{key:first.key}},
  {id:'ready-c',isProject:true,status:'queued',projectInfo:{key:second.key}},
  {id:'referral',isProject:true,status:'queued',projectInfo:{key:referral.key}},
  {id:'already-running',isProject:true,status:'active',projectInfo:{key:catalog[0].key}},
  {id:'completed',isProject:true,status:'completed',projectInfo:{key:first.key},completionReward:{claimedAt:null}},
  {id:'failed',isProject:true,status:'failed',projectInfo:{key:first.key}},
  {id:'single',isProject:false,status:'queued',projectInfo:{key:catalog[0].key}}
 );
 const before=JSON.stringify(game);
 const h=componentHarness('Projects.tsx',{'./Language':{Text:'Text'},'./LocationArt':{LocationArt:'LocationArt'},'./ProjectCategoryArt':{ProjectCategoryArt:'ProjectCategoryArt'}});
 let tab='saved';const props={data:game,tab,onTab:value=>tab=value};const tree=h.render('Projects',props);
 const categories=nodes(tree,'Pressable').filter(n=>n.props.testID?.startsWith('project-category-'));
 const expected=[referral,...catalog.filter(c=>c.kind==='special').reverse()];
 assert.deepEqual(categories.map(n=>n.props.testID),expected.map(c=>'project-category-'+c.key));
 const category=info=>categories.find(node=>node.props.testID==='project-category-'+info.key);
 assert.ok(text(category(first)).includes('2 verfügbar'));assert.ok(text(category(second)).includes('1 verfügbar'));
 assert.ok(text(category(referral)).includes('Alle Stammkunden'));assert.ok(text(category(catalog[0])).includes('Keine verfügbar'));
 const countSnapshot=game.state.orders;game.state.orders=[];
 assert.deepEqual(nodes(h.render('Projects',props),'Pressable').filter(n=>n.props.testID?.startsWith('project-category-')).map(n=>n.props.testID),expected.map(c=>'project-category-'+c.key),'inventory changes cannot reorder categories');
 game.state.orders=countSnapshot;
 assert.equal(nodes(tree,'Pressable').filter(n=>n.props.testID?.startsWith('project-info-')).length,catalog.length,'every category has a separate information action');
 const tabs=nodes(tree,'Pressable').filter(n=>n.props.accessibilityRole==='tab');
 assert.equal(tabs.length,2);assert.equal(text(tabs[0]),'Laufende1');assert.equal(text(tabs[1]),'Aufträge4');
 assert.equal(tabs[0].props.accessibilityLabel,'Laufende, 1, Belohnungen: 1');assert.equal(tabs[1].props.accessibilityState.selected,true);
 tabs[0].props.onPress();assert.equal(tab,'running');props.tab=tab;const runningTree=h.render('Projects',props);
 assert.equal(nodes(runningTree,'Pressable').filter(n=>n.props.testID?.startsWith('project-category-')).length,0);
 const running=nodes(runningTree,h.exports.RunningProjects)[0];assert.ok(running,'running tab keeps the existing rewards-aware view');
 const runningContent=h.render('RunningProjects',running.props);
 assert.ok(text(runningContent).includes('Prämien'));
 assert.equal(nodes(runningContent,'Empty').length,0);
 assert.equal(nodes(runningTree,'Pressable').find(n=>n.props.testID==='project-tab-running').props.accessibilityState.selected,true);
 assert.equal(JSON.stringify(game),before,'render and category navigation cannot consume or reorder server data');
});


test('Category help and empty cards show brief information; available cards require explicit fleet confirmation',async()=>{
 const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
 const game=execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},1800000000000,()=>.5).view;
 const info=game.projectCatalog[0],commands=[],opened=[];
 game.state.orders.push({id:'ready',isProject:true,status:'queued',kind:info.kind,projectName:info.name,projectInfo:info,volume:520,distance:145,deadlineMs:3600000,templates:[{index:0,vehicles:[{model:'Eselkarren'}]},{index:1,vehicles:null}]});
 const h=componentHarness('Projects.tsx',{'./Language':{Text:'Text'},'./LocationArt':{LocationArt:'LocationArt'},'./ProjectCategoryArt':{ProjectCategoryArt:'ProjectCategoryArt'},'./ui':{C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Pill:'Pill',Empty:'Empty',n:String,minutes:seconds=>`${seconds/60} Min.`}});
 let resolveStart;const props={data:game,onOpen:id=>opened.push(id),onCommand:(command,args)=>{commands.push([command,args]);return new Promise(resolve=>resolveStart=resolve);}};
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


test('Project tab counts separate every queued contract, active trip and unclaimed reward without mutating orders',()=>{
 const {projectSections}=require('../src/projectSections.js');
 const orders=[
  ...['a','b','c'].map(id=>({id,isProject:true,status:'queued',projectInfo:{key:'same-category'}})),
  {id:'referral',isProject:true,status:'queued',projectInfo:{key:'referral'}},
  {id:'active',isProject:true,status:'active'},
  {id:'reward',isProject:true,status:'completed',completionReward:{claimedAt:null}},
  {id:'paid',isProject:true,status:'completed',completionReward:{claimedAt:123}},
  {id:'old-completion',isProject:true,status:'completed'},
  {id:'failed',isProject:true,status:'failed'},
  {id:'single-queued',status:'queued'},{id:'single-active',status:'active'},
  {id:'single-reward',status:'completed',completionReward:{claimedAt:null}}
 ];
 const before=JSON.stringify(orders),groups=projectSections(orders);
 assert.deepEqual(groups.queued.map(order=>order.id),['a','b','c','referral']);
 assert.deepEqual(groups.active.map(order=>order.id),['active']);
 assert.deepEqual(groups.rewards.map(order=>order.id),['reward']);
 assert.equal(JSON.stringify(orders),before);
 orders.find(order=>order.id==='active').status='completed';orders.find(order=>order.id==='active').completionReward={claimedAt:null};
 const finished=projectSections(orders);assert.equal(finished.active.length,0);assert.equal(finished.rewards.length,2);
 orders.find(order=>order.id==='reward').completionReward.claimedAt=456;
 assert.deepEqual(projectSections(orders).rewards.map(order=>order.id),['active']);
 assert.deepEqual(projectSections([]),{orders:[],active:[],queued:[],rewards:[]});
});


test('Project category ordering follows rarity then descending region, independently of available stock',()=>{
 const {orderedProjectCategories}=require('../src/projectSections.js');
 const game=execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},1800000000000,()=>.5).view;
 const catalog=game.projectCatalog,before=JSON.stringify(catalog);
 const keys=['referral','special:4','special:3','special:2','special:1','special:0'];
 assert.deepEqual(orderedProjectCategories(catalog).map(info=>info.key),keys);
 assert.equal(JSON.stringify(catalog),before);
 const event={key:'event',rarity:'legendary',region:0};
 for(const count of [0,1,12]){
  const inventory=catalog.map((info,index)=>({...info,available:index%2?count:0}));
  assert.deepEqual(orderedProjectCategories(inventory.reverse()).map(info=>info.key),keys);
  assert.deepEqual(orderedProjectCategories([...inventory,event]).map(info=>info.key),['event',...keys]);
 }
});
