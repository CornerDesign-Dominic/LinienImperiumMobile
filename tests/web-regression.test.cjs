const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
test('All original web regression suites pass against the pinned engine',()=>{
 for(const file of fs.readdirSync(path.join(__dirname,'web')).filter(x=>x.endsWith('.test.cjs'))){const result=spawnSync(process.execPath,[path.join(__dirname,'web',file)],{encoding:'utf8'});assert.equal(result.status,0,`${file}\n${result.stdout}\n${result.stderr}`);}
});
