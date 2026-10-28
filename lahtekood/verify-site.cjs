const assert=require('node:assert/strict');
const path=require('node:path');
const crypto=require('node:crypto');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright')));}
const site=process.argv[2];
const expectedCommit=process.argv[3]||process.env.GITHUB_SHA;
if(!site||!expectedCommit)throw Error('Usage: node lahtekood/verify-site.cjs <site-url> <expected-commit>');
const base=new URL(site.endsWith('/')?site:site+'/');
async function checkPublication(){
 let last;
 const attempts=Number(process.env.MALENURK_VERIFY_ATTEMPTS||18);
 for(let attempt=1;attempt<=attempts;attempt++){
  try{
   const versionUrl=new URL('deployment.json',base);versionUrl.searchParams.set('commit',expectedCommit);
   const response=await fetch(versionUrl,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
   assert.equal(response.status,200,'deployment.json HTTP status');
   const metadata=await response.json();assert.equal(metadata.commit,expectedCommit,'Published commit differs');
   const pageUrl=new URL(base);pageUrl.searchParams.set('commit',expectedCommit);
   const htmlResponse=await fetch(pageUrl,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
   assert.equal(htmlResponse.status,200,'Homepage HTTP status');assert.ok(htmlResponse.headers.get('content-type')?.includes('text/html'));
   const html=Buffer.from(await htmlResponse.arrayBuffer());
   assert.equal(crypto.createHash('sha256').update(html).digest('hex'),metadata.htmlSha256,'Homepage differs from this deployment');
   return pageUrl.href;
  }catch(error){last=error;console.log(`Publication check ${attempt}/${attempts}: ${error.message}`);if(attempt<attempts)await new Promise(resolve=>setTimeout(resolve,10000));}
 }
 throw last;
}
(async()=>{
 const url=await checkPublication();
 const browserName=process.env.MALENURK_BROWSER||'chrome';
 const browser=await chromium.launch({channel:browserName==='chromium'?undefined:browserName,headless:true});
 try{
  const context=await browser.newContext();const page=await context.newPage();const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto(url);assert.equal(response.status(),200);assert.equal(await page.title(),'Malenurk');
  assert.ok((await page.locator('h1').innerText()).replace(/\s+/g,' ').includes('Hea käik algab heast mõttest.'));
  assert.deepEqual(await page.locator('nav button').allTextContents(),['Avaleht','Harjutused','Juhised','Treeneri vaade','Tagasiside']);
  // Pärast laadimist peavad rakenduse vaated ja malelaud töötama internetita.
  await context.setOffline(true);
  await page.locator('nav [data-action="exercises"]').click();await page.locator('[data-action="start"]').click();
  const move=await page.evaluate(()=>currentPuzzle().solution[0]);
  await page.locator('[data-square="'+move.slice(0,2)+'"]').click();await page.locator('[data-square="'+move.slice(2,4)+'"]').click();
  if(move[4])await page.locator('[data-action="promote"][data-value="'+move[4]+'"]').click();
  assert.ok(await page.locator('.feedback.good').isVisible(),'Correct chess move accepted');
  await page.locator('nav [data-action="expert"]').click();if(await page.locator('#leave').isVisible())await page.locator('[data-action="leave-confirm"]').click();
  assert.equal(await page.locator('#expert-form fieldset').count(),8);assert.equal(await page.locator('#expert-form textarea').count(),4);
  await page.locator('nav [data-action="coach"]').click();assert.ok(await page.locator('#login-form').isVisible());
  assert.deepEqual(errors,[]);await context.close();
  console.log('Verified live homepage, deployment commit, chess board, feedback, and coach lock: '+base.href);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
