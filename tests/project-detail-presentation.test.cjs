const {test}=require('node:test'),assert=require('node:assert/strict');
const {execute}=require('../functions/src/engine.cjs');
const {componentHarness,nodes,text}=require('./helpers/component-harness.cjs');
const at=1800000000000;
const game=()=>execute(null,'foundCompany',{companyName:'Firma',cityName:'Heimat'},at,()=>.5).view;
const setup=()=>componentHarness('Projects.tsx',{'./Language':{Text:'Text'},'./ProjectCategoryArt':{ProjectCategoryArt:'ProjectCategoryArt'},'./ui':{C:require('../src/palette.json'),Txt:'Txt',Card:'Card',Row:'Row',Btn:'Btn',Bar:'Bar',Pill:'Pill',Empty:'Empty',n:String,remaining:(end,now)=>String(end-now),minutes:seconds=>`${seconds/60} Min.`,displayFont:'serif'}});
test('Every large-order info card shows image-only finds in rows of at most five and retains source text without navigation',()=>{
 const data=game(),h=setup();
 for(const info of data.projectCatalog){
  const tree=h.render('ProjectInfo',{info}),cards=nodes(tree,'Card');assert.equal(cards.length,3);
  assert.ok(!text(cards[0]).includes('Beginnt beim Start'));
  assert.equal(text(cards[1]),'Möglicher Fund');
  const rows=nodes(cards[1],'View').filter(node=>node.props.testID?.startsWith('project-find-row-'));
  const itemIds=nodes(cards[1],'ItemArt').map(node=>node.props.id);
  assert.ok(rows.length>=2);assert.ok(itemIds.includes('capacityModules'));assert.ok(itemIds.includes('gear:rare'));
  assert.equal(itemIds.includes('gear:legendary'),Boolean(info.legendary));
  assert.equal(nodes(cards[1],'Icon').filter(node=>node.props.name==='hermes').length,1);
  for(const row of rows)assert.ok(nodes(row,'ItemArt').length+nodes(row,'Icon').length<=5);
  assert.equal(nodes(cards[2],'Btn').length,0);assert.ok(text(cards[2]).includes(info.customer.name));
 }
});
test('All active large-order variants place title above story, tonne progress below, and matching vehicle art at the left',()=>{
 const data=game(),h=setup();
 for(const info of data.projectCatalog){
  const card=data.catalog.cards[0],second=data.catalog.cards[1],name=info.name.replace(/^(?:Großauftrag|Großprojekt|Sonderauftrag|Empfehlungsauftrag)\s+/,'');
  const order={id:info.key,isProject:true,status:'active',kind:info.kind,projectName:info.name,customerName:info.customer.name,projectInfo:info,volume:400,delivered:100,eta:at+5000,project:{deadlineAt:at+10000,template:2,vehicles:[{slot:0,cardId:card.id,model:card.name,cargo:10,nextAt:at+1000},{slot:1,cardId:second.id,model:second.name,cargo:0}]}};
  const tree=h.render('ProjectDetail',{data:{...data,state:{...data.state,orders:[order]}},id:order.id,clock:at,onCommand(){}});
  const title=nodes(tree,'View').find(node=>node.props.testID==='project-detail-title');assert.equal(text(title),name);
  assert.ok(text(tree).includes('100 / 400 t'));assert.equal(text(tree).split(name).length-1,1);
  assert.equal(nodes(nodes(tree,'View').find(node=>node.props.testID==='project-detail-progress'),'Bar')[0].props.value,25);
  const fleet=nodes(tree,'View').find(node=>node.props.testID==='project-assigned-fleet');assert.equal(text(fleet),'Flotte 3');assert.equal(nodes(fleet,'Pill').length,0);
  const pictures=nodes(tree,'VehicleArt');assert.deepEqual(pictures.map(node=>node.props.card.id),[card.id,second.id]);
  const rows=nodes(tree,'View').filter(node=>node.props.testID?.startsWith('project-detail-vehicle-'));for(const row of rows)assert.equal(require('react').Children.toArray(row.props.children)[0].type,'VehicleArt');
  assert.ok(text(tree).includes('Keine weitere Tour'));assert.ok(text(tree).includes('Belohnungen & Infos'));
 }
});
