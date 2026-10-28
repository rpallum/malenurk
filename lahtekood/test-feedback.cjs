const assert=require('node:assert/strict');

// Loe semikooloniga CSV-d sõltumatult eksportijast, ka jutumärkide ja reavahetuste korral.
function parseCsv(text){
 text=text.replace(/^\uFEFF/,'');let rows=[],row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){
   if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;
  }else if(c===';'&&!quoted){row.push(cell);cell='';}
  else if((c==='\r'||c==='\n')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 assert.equal(quoted,false,'Unclosed CSV field');if(row.length||cell){row.push(cell);rows.push(row);}return rows;
}

module.exports=async function testFeedback({page,passed}){
 const storageKey='malenurk.feedback.v1';
 const submit=()=>page.locator('#feedback-submit');
 const go=action=>page.locator('nav [data-action="'+action+'"]').click();
 const openFeedback=()=>go('expert');
 const savedText='Aitäh! Hinnang on selles brauseriseansis talletatud.';
 const downloads=[];const onDownload=d=>downloads.push(d.suggestedFilename());page.on('download',onDownload);
 // Vormi toimingud ei tohi avada meiliprogrammi. Peata päris avamine vea korral.
 await page.addInitScript(()=>{
  window.feedbackTestMailto=[];window.feedbackTestBlobs=[];
  const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{window.feedbackTestBlobs.push(blob);return original(blob);};
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="mailto:"]');if(a){window.feedbackTestMailto.push(a.href);e.preventDefault();}},true);
 });
 await page.reload();await openFeedback();
 const questions=[
  'Ülesannete sisu on malealaselt korrektne.','Ülesannete raskusaste sobib sihtrühmale.','Ülesannete jaotus teemade kaupa on loogiline.','Vihjed toetavad õppimist.','Tagasiside on õppijale arusaadav.','Programm sobib iseseisvaks harjutamiseks.','Programm võiks olla treenerile abivahend.','Programm on tehniliselt mugav kasutada.',
  'Milline programmi osa on kõige õnnestunum?','Mida tuleks muuta või täiendada?','Milliseid ülesandetüüpe võiks juurde lisada?','Kas programm sobib sihtrühma treeningute toetamiseks? Palun põhjenda.'
 ];
 assert.equal(await page.locator('#expert-form fieldset').count(),8);assert.equal(await page.locator('#expert-form input[type="radio"]').count(),40);
 assert.equal(await page.locator('#expert-form textarea').count(),4);assert.equal(await page.locator('#expert-form textarea[required]').count(),0);
 assert.equal(await page.locator('.feedback-instruction').innerText(),'Küsimused 1–8 on kohustuslikud. Küsimustele 9–12 vastamine on vabatahtlik.');
 assert.equal(await submit().innerText(),'Saadan oma tagasiside');assert.ok(!await page.locator('#feedback-saved').isVisible());
 assert.equal(await page.locator('[data-action="export-json"]').count(),0);assert.equal(await page.locator('.mail-fallback').count(),0);
 assert.ok((await page.locator('.contact-card').innerText()).includes('Lehe autor: Rasmus Pallum'));
 assert.equal(await page.locator('.contact-card a').getAttribute('href'),'mailto:rasmus.pallum@gmail.com');
 for(let i=0;i<12;i++)assert.ok((await page.locator('#question-'+(i+1)).innerText()).includes((i+1)+'. '+questions[i]));
 // Iga puuduv kohustuslik vastus peab peatama salvestuse ja suunama õigele küsimusele.
 await page.locator('[name="author"]').fill('Õpetaja Ülle');
 for(let i=0;i<8;i++){
  await submit().click();assert.ok((await page.locator('#form-status').innerText()).includes('küsimusele '+(i+1)));
  assert.equal(await page.evaluate(()=>document.activeElement.name),'rating'+i);
  assert.ok(await page.locator('#question-'+(i+1)+' .question-error').isVisible());
  assert.equal(await page.evaluate(key=>sessionStorage.getItem(key),storageKey),null);
  assert.equal(await page.locator('[name="author"]').inputValue(),'Õpetaja Ülle');
  await page.locator('[name="rating'+i+'"][value="'+(i%5+1)+'"]').check();
 }
 await submit().click();assert.equal(await submit().innerText(),'Hinnang salvestatud');
 assert.equal(await page.locator('#feedback-saved [role="status"]').innerText(),savedText);
 assert.ok(await page.locator('#feedback-saved').isVisible());
 assert.equal(await page.locator('[data-action="export-txt"]').innerText(),'Laadi alla .txt');assert.equal(await page.locator('[data-action="export-csv"]').innerText(),'Laadi alla .csv');
 const first=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey);
 assert.equal(first.hinnangud.length,8);assert.equal(first.vastused.length,4);assert.ok(first.vastused.every(item=>item.vastus===''));
 assert.equal(downloads.length,0);assert.equal(await page.evaluate(()=>window.feedbackTestBlobs.length),0);assert.equal(await page.evaluate(()=>window.feedbackTestMailto.length),0);
 const background=await page.locator('#feedback-saved').evaluate(el=>getComputedStyle(el).backgroundColor);assert.notEqual(background,'rgba(0, 0, 0, 0)');
 passed('Tagasiside: ainult 1–8 on kohustuslikud; iga puuduv hinne peatab salvestamise; 9–12 võivad olla tühjad');
 passed('Tagasiside kinnitamine kirjutab sessionStorage’i, muudab nupu teksti ja näitab tänuteadet ilma allalaadimise või meilitoiminguta');

 await go('instructions');await openFeedback();assert.equal(await submit().innerText(),'Hinnang salvestatud');
 await page.reload();await openFeedback();assert.equal(await submit().innerText(),'Hinnang salvestatud');
 assert.equal(await page.locator('[name="author"]').inputValue(),'Õpetaja Ülle');assert.ok(await page.locator('[name="rating3"][value="4"]').isChecked());
 assert.equal(downloads.length,0);assert.equal(await page.evaluate(()=>window.feedbackTestBlobs.length),0);
 // Teises sõltumatus vahelehes pole sama sessionStorage'i ega kinnitatud hinnangut.
 const other=await page.context().newPage();await other.goto(page.url());await other.locator('nav [data-action="expert"]').click();assert.equal(await other.locator('#feedback-submit').innerText(),'Saadan oma tagasiside');await other.close();
 const optional=['Õnnestus: õäöü ÕÄÖÜ; komad, ja "jutumärgid".\nUus rida; <>&.','   \n  ','','Pikk vastus. '+('Täielik tekst; "jah", õige.\n'.repeat(220))];
 for(let i=0;i<4;i++)await page.locator('[name="text'+i+'"]').fill(optional[i]);
 assert.equal(await submit().innerText(),'Saadan oma tagasiside');assert.equal(await page.locator('#feedback-dirty').innerText(),'Muudatused salvestamata');
 assert.ok(await page.locator('#feedback-dirty').isVisible());assert.ok(!await page.locator('#feedback-saved').isVisible());
 assert.ok(await page.locator('[data-action="export-txt"]').isDisabled());
 await page.evaluate(()=>{exportFeedback('txt');exportFeedback('csv');});assert.equal(downloads.length,0);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey),first);
 await go('home');await openFeedback();assert.equal(await page.locator('[name="text0"]').inputValue(),optional[0]);assert.equal(await submit().innerText(),'Saadan oma tagasiside');
 await submit().click();assert.equal(await submit().innerText(),'Hinnang salvestatud');
 const second=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey);
 second.vastused.forEach((item,i)=>assert.equal(item.vastus,optional[i]));
 await page.reload();await openFeedback();assert.equal(await page.locator('[name="text0"]').inputValue(),optional[0]);assert.equal(await submit().innerText(),'Hinnang salvestatud');
 // Uus salvestamata mustand ei tohi värskendamisel varasemat salvestatud hinnangut asendada.
 await page.locator('[name="text0"]').fill('SALVESTAMATA');await page.reload();await openFeedback();assert.equal(await page.locator('[name="text0"]').inputValue(),optional[0]);
 assert.equal(downloads.length,0);assert.equal(await page.evaluate(()=>window.feedbackTestBlobs.length),0);
 passed('Tagasiside taastub samas vahelehes pärast värskendamist; mustand säilib vaadete vahel, eksport on muutmisel lukus ja uuesti salvestamine töötab');

 // Sundvead: nii kirjutamise tõrge kui ka salvestust kinnitamata jättev no-op.
 await page.locator('[name="text0"]').fill('Uus vastus, mis peab tõrke korral vormi alles jääma.');
 await page.evaluate(()=>{window.originalSessionSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError');};});
 await submit().click();assert.ok((await page.locator('#form-status').innerText()).includes('salvestamine ei õnnestunud'));
 assert.equal(await submit().innerText(),'Saadan oma tagasiside');assert.ok(!await page.locator('#feedback-saved').isVisible());
 assert.equal(await page.locator('[name="text0"]').inputValue(),'Uus vastus, mis peab tõrke korral vormi alles jääma.');
 assert.deepEqual(await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey),second);
 await go('home');await openFeedback();assert.ok((await page.locator('#form-status').innerText()).includes('salvestamine ei õnnestunud'));
 await page.evaluate(()=>{Storage.prototype.setItem=function(){};});await submit().click();assert.equal(await submit().innerText(),'Saadan oma tagasiside');assert.ok(!await page.locator('#feedback-saved').isVisible());
 await page.evaluate(()=>{Storage.prototype.setItem=window.originalSessionSetItem;});await submit().click();assert.equal(await submit().innerText(),'Hinnang salvestatud');
 assert.equal(downloads.length,0);assert.equal(await page.evaluate(()=>window.feedbackTestMailto.length),0);
 passed('Salvestusvea ja salvestust eirava kirjutamise korral edu ei kuvata; vastused jäävad alles ning korduskatse töötab');

 // Täpsed failisisud: eksport toimub ainult eraldi nupust ning sisaldab salvestatud hetke vastuseid.
 await page.locator('[name="text0"]').fill(optional[0]);await submit().click();
 const snapshot=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey);
 for(const type of ['txt','csv']){
  const event=page.waitForEvent('download');await page.locator('[data-action="export-'+type+'"]').click();const download=await event;assert.equal(download.suggestedFilename(),'malenurk-tagasiside.'+type);
  const text=await page.evaluate(async()=>await window.feedbackTestBlobs.at(-1).text());
  if(type==='txt'){for(let i=0;i<12;i++)assert.ok(text.includes((i+1)+'. '+questions[i]));for(const value of optional)assert.ok(text.includes(value));}
  else{
   const rows=parseCsv(text);assert.deepEqual(rows[0],['Number','Küsimus','Vastus']);
   for(let i=0;i<12;i++)assert.deepEqual(rows[i+1],[String(i+1),questions[i],i<8?String(i%5+1):optional[i-8]]);
  }
 }
 assert.equal(downloads.length,2);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey),snapshot);
 passed('Eraldi TXT- ja CSV-nupud loovad kõik 12 küsimust; täpitähed, tühjad vastused, eraldajad, jutumärgid, reavahetused ja pikk tekst säilivad');

 // Vigane või kättesaamatu seansihoidla ei tohi ülejäänud rakendust rikkuda.
 await page.evaluate(key=>sessionStorage.setItem(key,'{broken'),storageKey);await page.reload();await openFeedback();assert.equal(await submit().innerText(),'Saadan oma tagasiside');assert.ok((await page.locator('#form-status').innerText()).includes('taastamine ei õnnestunud'));
 await page.evaluate(key=>sessionStorage.removeItem(key),storageKey);
 const blocked=await page.context().newPage();await blocked.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
 await blocked.goto(page.url());await blocked.locator('nav [data-action="expert"]').click();assert.equal(await blocked.locator('#feedback-submit').innerText(),'Saadan oma tagasiside');
 for(let i=0;i<8;i++)await blocked.locator('[name="rating'+i+'"][value="3"]').check();await blocked.locator('#feedback-submit').click();assert.ok((await blocked.locator('#form-status').innerText()).includes('salvestamine ei õnnestunud'));await blocked.close();
 passed('Vigase või blokeeritud sessionStorage’i korral rakendus avaneb ja salvestusviga on eestikeelne');
 page.off('download',onDownload);
};
module.exports.parseCsv=parseCsv;
