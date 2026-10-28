const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const result=spawnSync(process.execPath,[path.join(__dirname,'build.cjs')],{cwd:root,stdio:'inherit'});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
const output=path.join(root,'dist');
fs.mkdirSync(output,{recursive:true});
const html=fs.readFileSync(path.join(root,'index.html'));
// Avaldatakse ainult rakendus ja selle versioonitõend; hoidla lähtefaile ei pakita kaasa.
for(const name of ['index.html','Malenurk.html'])fs.writeFileSync(path.join(output,name),html);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
const commit=process.env.GITHUB_SHA||'local';
const htmlSha256=crypto.createHash('sha256').update(html).digest('hex');
fs.writeFileSync(path.join(output,'deployment.json'),JSON.stringify({commit,htmlSha256},null,2)+'\n');
console.log('Pages artifact: '+output+'; commit '+commit+'; SHA-256 '+htmlSha256);
