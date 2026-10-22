const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const file=path.resolve(__dirname,'../src/collectionStats.ts');
const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(compiled,file);
const {averageCardSpeed,rankNumeral}=m.exports;
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
