const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
test('Pinned vendor baseline remains compatible (legacy rules; mobile rules are tested separately)',()=>{
 for(const file of fs.readdirSync(path.join(__dirname,'web')).filter(x=>x.endsWith('.test.cjs')).sort()){const result=spawnSync(process.execPath,[path.join(__dirname,'web',file)],{encoding:'utf8'});assert.equal(result.status,0,`${file}\n${result.stdout}\n${result.stderr}`);}
});
