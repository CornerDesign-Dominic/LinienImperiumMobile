// Keep the preview signing key in Google Secret Manager, never in git or Actions logs.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync,spawnSync}=require('node:child_process');
const project='linienimperium',secret='linienimperium-android-preview-signing';
const gcloud=(...args)=>execFileSync('gcloud',[...args,'--project='+project,'--quiet'],{encoding:'utf8'});
const access=spawnSync('gcloud',['secrets','versions','access','latest','--secret='+secret,'--project='+project],{encoding:'utf8'});
fs.mkdirSync('.credentials',{recursive:true,mode:0o700});
let signing;
if(access.status===0){signing=JSON.parse(access.stdout);}
else {
 const exists=spawnSync('gcloud',['secrets','describe',secret,'--project='+project],{encoding:'utf8'});
 if(!/NOT_FOUND|not found/i.test(access.stderr))throw Error('Signing key cannot be read; refusing to replace it: '+access.stderr);
 if(exists.status!==0)throw Error('Signing secret is missing or inaccessible. Run scripts/finish-firebase-access.sh as project owner first.');
 const password=crypto.randomBytes(24).toString('hex'),alias='linienimperium';
 execFileSync('keytool',['-genkeypair','-v','-keystore','.credentials/preview.jks','-storetype','JKS','-storepass',password,'-keypass',password,'-alias',alias,'-keyalg','RSA','-keysize','2048','-validity','10000','-dname','CN=LinienImperium Preview,O=CornerDesign,C=DE'],{stdio:'pipe'});
 signing={keystore:fs.readFileSync('.credentials/preview.jks').toString('base64'),keystorePassword:password,keyAlias:alias,keyPassword:password};
 const payload=path.resolve('.credentials/signing.json');fs.writeFileSync(payload,JSON.stringify(signing),{mode:0o600});
 gcloud('secrets','versions','add',secret,'--data-file='+payload);
 fs.unlinkSync(payload);
}
fs.writeFileSync('.credentials/preview.jks',Buffer.from(signing.keystore,'base64'),{mode:0o600});
fs.writeFileSync('credentials.json',JSON.stringify({android:{keystore:{keystorePath:'.credentials/preview.jks',keystorePassword:signing.keystorePassword,keyAlias:signing.keyAlias,keyPassword:signing.keyPassword}}}),{mode:0o600});
console.log('Android signing credentials ready. Private values were not logged.');
