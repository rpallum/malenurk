const assert=require('node:assert/strict');

module.exports=async function testFeatures({page,passed}){
 const nav=action=>page.locator('nav [data-action="'+action+'"]');
 const login=()=>page.locator('[name="password"]');
 const allQuestions=[
  'Ülesannete sisu on malealaselt korrektne.',
  'Ülesannete raskusaste sobib sihtrühmale.',
  'Ülesannete jaotus teemade kaupa on loogiline.',
  'Vihjed toetavad õppimist.',
  'Tagasiside on õppijale arusaadav.',
  'Programm sobib iseseisvaks harjutamiseks.',
  'Programm võiks olla treenerile abivahend.',
  'Programm on tehniliselt mugav kasutada.',
  'Milline programmi osa on kõige õnnestunum?',
  'Mida tuleks muuta või täiendada?',
  'Milliseid ülesandetüüpe võiks juurde lisada?',
  'Kas programm sobib sihtrühma treeningute toetamiseks? Palun põhjenda.'
 ];
 assert.deepEqual(await page.locator('nav button').allTextContents(),['Avaleht','Harjutused','Juhised','Treeneri vaade','Tagasiside']);
 for(const [action,heading] of [['home','Hea käik algab'],['exercises','Harjutused'],['instructions','Juhised'],['coach','Treeneri sisselogimine'],['expert','Tagasiside']]){
  await nav(action).click();assert.ok((await page.locator('h1').innerText()).includes(heading));assert.equal(await nav(action).getAttribute('aria-current'),'page');assert.equal(await page.locator('nav [aria-current="page"]').count(),1);
 }
 await nav('home').click();await page.locator('[data-action="setup"]').click();assert.equal(await page.locator('h1').innerText(),'Harjutused');
 await nav('home').click();await page.locator('.hero [data-action="help"]').click();assert.equal(await page.locator('h1').innerText(),'Juhised');
 assert.ok((await page.locator('.instructions-page').innerText()).includes('tööseansi'));assert.equal(await page.locator('.instruction-card').count(),6);
 passed('Kõik viis menüüvalikut, aktiivne valik ning avalehe harjutuste ja juhiste nupud');

 await nav('coach').click();assert.equal(await login().getAttribute('type'),'password');
 await page.locator('#login-form [type="submit"]').click();assert.equal(await page.locator('#login-status').innerText(),'Palun sisesta salasõna.');assert.equal(await page.locator('.puzzle-entry').count(),0);
 for(const bad of ['vale','male2026 ','   ']){await login().fill(bad);await login().press('Enter');assert.equal(await page.locator('.puzzle-entry').count(),0);assert.ok(await login().isVisible());}
 await login().fill('vale');await login().press('Enter');assert.equal(await page.locator('#login-status').innerText(),'Vale parool. Proovi uuesti.');
 assert.ok(!(await page.locator('#main').innerText()).includes('male2026'));
 await login().fill('male2026');await login().press('Enter');assert.equal(await page.locator('.puzzle-entry').count(),28);assert.equal(await page.locator('[name="password"]').count(),0);
 await nav('instructions').click();await nav('coach').click();assert.equal(await page.locator('.puzzle-entry').count(),28);
 await page.locator('[data-action="coach-logout"]').click();assert.ok(await login().isVisible());
 await page.evaluate(()=>{state.page='coach';render();});assert.ok(await login().isVisible());assert.equal(await page.locator('.puzzle-entry').count(),0);
 assert.ok(await page.evaluate(()=>!coachPage().includes('puzzle-entry')));
 for(const action of ['coach-start','one']){
  await page.evaluate(action=>{const button=document.createElement('button');button.dataset.action=action;button.dataset.value='m1-1';document.body.append(button);button.click();button.remove();},action);
  assert.ok(await login().isVisible());
 }
 await login().fill('male2026');await page.locator('#login-form [type="submit"]').click();assert.equal(await page.locator('.puzzle-entry').count(),28);
 await page.reload();await nav('coach').click();assert.ok(await login().isVisible());
 await nav('expert').click();assert.equal(await page.locator('h1').innerText(),'Tagasiside');assert.equal(await page.locator('#login-form').count(),0);
 passed('Tühi ja vale parool, täpne parool, Enter, kõik treeneri sisenemisteed, väljumine, värskendamine ja avalik tagasiside');

 assert.equal(await page.locator('#expert-form fieldset').count(),8);assert.equal(await page.locator('#expert-form textarea').count(),4);
 assert.equal(await page.locator('#expert-form input[type="radio"]').count(),40);
 assert.equal(await page.locator('#expert-form textarea[required]').count(),4);
 assert.ok((await page.locator('.contact-card').innerText()).includes('Lehe autor: Rasmus Pallum'));
 assert.equal(await page.locator('.contact-card a').getAttribute('href'),'mailto:rasmus.pallum@gmail.com');
 for(let i=0;i<12;i++)assert.ok((await page.locator('#question-'+(i+1)).innerText()).includes((i+1)+'. '+allQuestions[i]));
 // Peata ainult välised meiliprogrammid; kogu vormi- ja faililoogika töötab päriselt.
 await page.evaluate(()=>{
  window.testMailto=[];window.testBlobs=[];const original=URL.createObjectURL.bind(URL);
  URL.createObjectURL=blob=>{window.testBlobs.push(blob);return original(blob);};
  document.addEventListener('click',e=>{const anchor=e.target.closest('a[href^="mailto:"]');if(anchor){window.testMailto.push(anchor.href);e.preventDefault();}},true);
 });
 for(const selector of ['[type="submit"]','[data-action="export-txt"]','[data-action="export-json"]']){
  await page.locator('#expert-form '+selector).click();assert.ok((await page.locator('#form-status').innerText()).includes('küsimusele 1'));
  assert.equal(await page.evaluate(()=>document.activeElement.name),'rating0');
 }
 assert.equal(await page.evaluate(()=>window.testBlobs.length),0);assert.equal(await page.evaluate(()=>window.testMailto.length),0);
 for(let i=0;i<8;i++)await page.locator('[name="rating'+i+'"][value="'+(i%5+1)+'"]').check();
 await page.locator('[name="text0"]').fill('   \n  ');await page.locator('[data-action="export-txt"]').click();
 assert.equal(await page.evaluate(()=>document.activeElement.name),'text0');assert.ok(await page.locator('#question-9 .question-error').isVisible());
 const answers=['Õnnestus malelaua õhuline kujundus: õäöü ÕÄÖÜ.\nTeine rida ja märgid <>&".', 'Rohkem pärispartiide seise.', 'Lõppmängud ja etturilõppmängud.', 'Jah, põhjendused toetavad sihtrühma treeninguid. '+('Täielik pikk vastus. '.repeat(220))];
 for(let i=0;i<4;i++){
  await page.locator('[name="text'+i+'"]').fill(answers[i]);
  if(i<3){await page.locator('[data-action="export-json"]').click();assert.equal(await page.evaluate(()=>document.activeElement.name),'text'+(i+1));assert.equal(await page.locator('[name="text0"]').inputValue(),answers[0]);}
 }
 await page.locator('[name="author"]').fill('Õpetaja Ülle');
 await nav('home').click();await nav('expert').click();assert.equal(await page.locator('[name="text0"]').inputValue(),answers[0]);
 // Instrumenteeri uuesti pärast renderdust; URL-i püüdja püsib lehe tööseansis.
 await page.locator('[data-action="export-json"]').click();
 const json=await page.evaluate(async()=>await window.testBlobs.at(-1).text());const payload=JSON.parse(json.replace(/^\uFEFF/,''));
 assert.equal(payload.hinnangud.length,8);assert.equal(payload.vastused.length,4);assert.equal(payload.hindaja,'Õpetaja Ülle');
 payload.hinnangud.forEach((item,i)=>{assert.equal(item.väide,allQuestions[i]);assert.equal(item.punktid,i%5+1);});
 payload.vastused.forEach((item,i)=>{assert.equal(item.küsimus,allQuestions[i+8]);assert.equal(item.vastus,answers[i]);});
 await page.locator('[data-action="export-txt"]').click();const txt=await page.evaluate(async()=>await window.testBlobs.at(-1).text());
 for(let i=0;i<12;i++)assert.ok(txt.includes((i+1)+'. '+allQuestions[i]));for(const answer of answers)assert.ok(txt.includes(answer));
 await page.locator('#expert-form [type="submit"]').click();
 assert.ok((await page.evaluate(async()=>await window.testBlobs.at(-1).text())).includes(answers[3]));
 const mail=new URL(await page.evaluate(()=>window.testMailto.at(-1)));assert.equal(mail.pathname,'rasmus.pallum@gmail.com');assert.equal(mail.searchParams.get('subject'),'Malenurga tagasiside');
 assert.ok((await page.locator('#form-status').innerText()).includes('Lisa allalaaditud fail kirjale manusena'));
 assert.ok((await page.locator('#form-status').innerText()).includes('ei ole automaatselt saadetud'));
 assert.ok(await page.locator('[data-action="export-txt"]').isEnabled());assert.ok(await page.locator('.mail-fallback').isVisible());
 // Meiliprogrammi puudumise/avamisvea järel jäävad fail ja käsitsi allalaadimine alles.
 await page.evaluate(()=>{document.querySelector('.mail-fallback').click=()=>{throw Error('No mail client');};});
 await page.locator('#expert-form [type="submit"]').click();assert.ok((await page.locator('#form-status').innerText()).includes('Kui meiliprogramm ei avane'));
 passed('Täpsed 12 kohustuslikku küsimust, tühikud, fookus, vastuste säilimine, täpitähed ja pikad täielikud vastused TXT/JSON-is');
 passed('Autor ja mailto-kontakt; saatmine loob faili ja õige kirja, käsitsi manustamise juhis ning meiliprogrammi puudumise varuvariant');
 await page.reload();await nav('exercises').click();
};
