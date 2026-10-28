const assert=require('node:assert/strict');

module.exports=async function testFeatures({page,passed}){
 const nav=action=>page.locator('nav [data-action="'+action+'"]');
 const login=()=>page.locator('[name="password"]');
 assert.deepEqual(await page.locator('nav button').allTextContents(),['Avaleht','Harjutused','Juhised','Treeneri vaade','Tagasiside']);
 for(const [action,heading] of [['home','Hea käik algab'],['exercises','Harjutused'],['instructions','Juhised'],['coach','Treeneri sisselogimine'],['expert','Tagasiside']]){
  await nav(action).click();assert.ok((await page.locator('h1').innerText()).includes(heading));assert.equal(await nav(action).getAttribute('aria-current'),'page');assert.equal(await page.locator('nav [aria-current="page"]').count(),1);
 }
 await nav('home').click();await page.locator('[data-action="setup"]').click();assert.equal(await page.locator('h1').innerText(),'Harjutused');
 await nav('home').click();await page.locator('.hero [data-action="help"]').click();assert.equal(await page.locator('h1').innerText(),'Juhised');
 assert.ok((await page.locator('.instructions-page').innerText()).includes('sama brauserivahelehe seansi'));assert.equal(await page.locator('.instruction-card').count(),6);
 passed('Kõik viis menüüvalikut, aktiivne valik ning avalehe harjutuste ja juhiste nupud');

 await nav('coach').click();assert.equal(await login().getAttribute('type'),'password');
 await page.locator('#login-form [type="submit"]').click();assert.equal(await page.locator('#login-status').innerText(),'Palun sisesta salasõna.');assert.equal(await page.locator('.puzzle-entry').count(),0);
 for(const bad of ['vale','male2026 ','   ']){await login().fill(bad);await login().press('Enter');assert.equal(await page.locator('.puzzle-entry').count(),0);assert.ok(await login().isVisible());}
 await login().fill('vale');await login().press('Enter');assert.equal(await page.locator('#login-status').innerText(),'Vale parool. Proovi uuesti.');
 assert.ok(!(await page.locator('#main').innerText()).includes('male2026'));
 await login().fill('male2026');await login().press('Enter');assert.equal(await page.locator('.puzzle-entry').count(),105);assert.equal(await page.locator('[name="password"]').count(),0);
 await nav('instructions').click();await nav('coach').click();assert.equal(await page.locator('.puzzle-entry').count(),105);
 await page.locator('[data-action="coach-logout"]').click();assert.ok(await login().isVisible());
 await page.evaluate(()=>{state.page='coach';render();});assert.ok(await login().isVisible());assert.equal(await page.locator('.puzzle-entry').count(),0);
 assert.ok(await page.evaluate(()=>!coachPage().includes('puzzle-entry')));
 for(const action of ['coach-start','one']){
  await page.evaluate(action=>{const button=document.createElement('button');button.dataset.action=action;button.dataset.value=PUZZLES[0].id;document.body.append(button);button.click();button.remove();},action);
  assert.ok(await login().isVisible());
 }
 await login().fill('male2026');await page.locator('#login-form [type="submit"]').click();assert.equal(await page.locator('.puzzle-entry').count(),105);
 await page.reload();await nav('coach').click();assert.ok(await login().isVisible());
 await nav('expert').click();assert.equal(await page.locator('h1').innerText(),'Tagasiside');assert.equal(await page.locator('#login-form').count(),0);
 passed('Tühi ja vale parool, täpne parool, Enter, kõik treeneri sisenemisteed, väljumine, värskendamine ja avalik tagasiside');

 await require('./test-feedback.cjs')({page,passed});
 await page.reload();await nav('exercises').click();
};
