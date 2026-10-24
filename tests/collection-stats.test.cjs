const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const file=path.resolve(__dirname,'../src/collectionStats.ts');
const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(compiled,file);
const {averageCardSpeed,rankNumeral,cardLevelMaterial,speedRankSegments}=m.exports;
test('Average speed uses arithmetic mean and retains three decimals before display rounding',()=>{
 assert.equal(averageCardSpeed(.756,.783),.770);
 assert.equal(averageCardSpeed(1.23456,.98765),1.111);
 assert.equal(averageCardSpeed(0,0),0);
 assert.equal(averageCardSpeed(.8,1.6),1.2);
});
test('Missing or non-finite speeds do not fabricate an average',()=>{
 for(const value of [undefined,NaN,Infinity]){assert.equal(averageCardSpeed(value,1),undefined);assert.equal(averageCardSpeed(1,value),undefined);}
});
test('Rank levels use Roman numerals and a dash for the unupgraded zero level',()=>{
 assert.deepEqual(Array.from({length:10},(_,i)=>rankNumeral(i+1)),['I','II','III','IV','V','VI','VII','VIII','IX','X']);assert.equal(rankNumeral(0),'—');
});
test('Card-level shield materials follow their own progression and reserve Obsidian for level ten',()=>{
 assert.deepEqual(Array.from({length:10},(_,i)=>cardLevelMaterial(i+1)),['iron','iron','iron','silver','silver','silver','gold','gold','gold','obsidian']);
 for(const level of [undefined,0,-1,1.5,11,NaN,Infinity])assert.equal(cardLevelMaterial(level),undefined);
});
test('Speed rank preserves completed Roman sections and reveals only attained rarity sections',()=>{
 const expected={0:[],1:['I'],9:['IX'],10:['X'],11:['X','I'],20:['X','X'],26:['X','X','VI'],33:['X','X','X','III'],49:['X','X','X','X','IX'],50:['X','X','X','X','X']};
 const rarities=['common','uncommon','rare','epic','legendary'];
 for(const [rank,numerals]of Object.entries(expected)){
  const segments=speedRankSegments(Number(rank));assert.deepEqual(segments.map(s=>s.numeral),numerals);
  assert.deepEqual(segments.map(s=>s.rarity),rarities.slice(0,numerals.length));
  assert.equal(segments.reduce((sum,s)=>sum+s.level,0),Number(rank));
 }
 assert.deepEqual(speedRankSegments(26.9),speedRankSegments(26));
 assert.deepEqual(speedRankSegments(999),speedRankSegments(50));
 for(const rank of [undefined,NaN,Infinity,-1,'13'])assert.deepEqual(speedRankSegments(rank),[]);
});
