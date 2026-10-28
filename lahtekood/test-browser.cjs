const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');const {pathToFileURL}=require('node:url');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright')));}
const {Chess}=require('./chess.cjs'),{PUZZLES,TOPICS}=require('./checked-data.json');
const htmlPath=process.argv[2]?path.resolve(process.argv[2]):path.resolve(__dirname,'../Malenurk.html');
const checks=[],passed=name=>{checks.push(name);console.log('PASS',name);};
const uci=m=>m.from+m.to+(m.promotion||'');
(async()=>{
 const name=process.env.MALENURK_BROWSER||'chrome',browser=await chromium.launch({channel:name==='chromium'?undefined:name,headless:true,args:['--disable-gpu']});
 try{
  const context=await browser.newContext({viewport:{width:1366,height:1000},acceptDownloads:true});await context.setOffline(true);
  const page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto(pathToFileURL(htmlPath).href);await require('./test-features.cjs')({page,passed});
  const nav=action=>page.locator('nav [data-action="'+action+'"]');
  const clickMove=async u=>{await page.locator('[data-square="'+u.slice(0,2)+'"]').click();await page.locator('[data-square="'+u.slice(2,4)+'"]').click();if(u[4])await page.locator('[data-action="promote"][data-value="'+u[4]+'"]').click();};
  const start=async p=>page.evaluate(id=>startSession([PUZZLES.find(p=>p.id===id)]),p.id);
  const leave=async()=>{await page.locator('.back').click();if(await page.locator('#leave').isVisible())await page.locator('[data-action="leave-confirm"]').click();};
  await nav('home').click();assert.ok((await page.locator('.statbar').innerText()).includes('105'));await page.locator('[data-action="about"]').click();assert.ok((await page.locator('#modal').innerText()).includes('105'));await page.locator('#modal .close').click();await nav('exercises').click();
  for(const level of ['0','1','2','all']){
   await page.locator('[data-action="level"][data-value="'+level+'"]').click();
   for(const topic of [...TOPICS.map(t=>t.id),'all']){
    await page.locator('[data-action="topic"][data-value="'+topic+'"]').click();
    const count=level==='all'?(topic==='all'?105:15):(topic==='all'?35:5);assert.equal(await page.evaluate(()=>getPool().length),count);
    assert.ok((await page.locator('#pool-info').innerText()).includes(String(count)));
   }
  }
  for(const count of ['5','10','all']){await page.locator('[data-action="count"][data-value="'+count+'"]').click();await page.locator('[data-action="start"]').click();assert.equal(await page.evaluate(()=>state.session.puzzles.length),count==='all'?105:Number(count));await leave();}
  await page.locator('[data-action="level"][data-value="2"]').click();await page.locator('[data-action="topic"][data-value="fork"]').click();await page.locator('[data-action="count"][data-value="10"]').click();assert.ok((await page.locator('#pool-info').innerText()).includes('5 ülesannet'));await page.locator('[data-action="start"]').click();assert.equal(await page.evaluate(()=>new Set(state.session.puzzles.map(p=>p.id)).size),5);await leave();
  passed('Kõik 32 filtrikombinatsiooni: 5/15/35/105; 5/10/kõik komplektid ja väikese valiku mittedubleerimine');

  const simple=PUZZLES.find(p=>p.rule.kind==='mate1'&&!p.solution[0][4]);await start(simple);const root=new Chess(simple.fen),wrong=root.moves({verbose:true}).map(uci).find(u=>!simple.accepted.includes(u));assert.ok(wrong);
  await clickMove(wrong);assert.equal(await page.evaluate(()=>state.game.fen()),simple.fen);assert.ok(await page.locator('.feedback.wrong').isVisible());assert.equal(await page.locator('.solution-box').count(),0);
  const from=root.moves({verbose:true})[0].from,legal=root.moves({square:from,verbose:true}).map(m=>m.to),illegal=root.board().flat().map((p,i)=>'abcdefgh'[i%8]+(8-Math.floor(i/8))).find(s=>s!==from&&!root.get(s)&&!legal.includes(s));
  await clickMove(from+illegal);assert.equal(await page.evaluate(()=>state.session.current.mistakes),1);assert.equal(await page.evaluate(()=>state.game.fen()),simple.fen);
  await page.locator('[data-action="hint"]').click();await page.locator('[data-action="hint"]').click();assert.equal(await page.locator('.hint').count(),2);assert.ok(await page.locator('[data-action="hint"]').isDisabled());
  await page.locator('[data-action="reset"]').click();assert.equal(await page.locator('.hint').count(),2);assert.equal(await page.evaluate(()=>state.session.current.mistakes),1);
  const orientation=await page.evaluate(()=>state.orientation);await page.locator('[data-action="flip"]').click();assert.equal(await page.locator('[data-square]').first().getAttribute('data-square'),orientation==='w'?'h1':'a8');
  await page.locator('[data-action="reveal"]').click();assert.equal(await page.evaluate(()=>state.session.results[0].correct),false);assert.ok(await page.locator('.solution-box').isVisible());await page.locator('[data-action="next"]').click();assert.ok((await page.locator('.result-stats').innerText()).includes('0%'));
  passed('Vale ja ebaseaduslik käik, kaks vihjet, algseis, lauapööre ja avatud lahenduse tulemuse arvestus');

  await page.evaluate(()=>startSession(PUZZLES));let studentMoves=0;
  for(let i=0;i<PUZZLES.length;i++){
   const p=PUZZLES[i];assert.equal(await page.evaluate(()=>currentPuzzle().id),p.id);
   await clickMove(p.solution[0]);studentMoves++;
   if(p.rule.kind==='mate2'){
    assert.equal(await page.evaluate(()=>state.session.current.solved),false);assert.equal(await page.evaluate(()=>state.session.results.length),i);
    const end=await page.evaluate(()=>{const p=currentPuzzle(),r=state.session.current;return p.mateTree[r.key][r.reply][0];});await clickMove(end);studentMoves++;
   }else while(!await page.evaluate(()=>state.session.current.solved)){
    const step=await page.evaluate(()=>state.session.current.step);assert.ok(step>0&&step<p.solution.length,p.id);assert.equal(await page.evaluate(()=>state.session.results.length),i);await clickMove(p.solution[step]);studentMoves++;
   }
   assert.equal(await page.evaluate(()=>state.session.current.solved),true,p.id);assert.ok(await page.locator('.solution-line').isVisible());await page.locator('[data-action="next"]').click();
  }
  assert.equal(await page.evaluate(()=>state.session.results.length),105);assert.equal(await page.evaluate(()=>state.session.results.filter(r=>r.correct).length),105);assert.ok((await page.locator('.result-stats').innerText()).includes('100%'));
  passed('Kõik 105 Lichessi ülesannet lahendatud malelaua kaudu lõpuni; '+studentMoves+' õpilase käiku');
  await page.locator('[data-action="again"]').click();assert.equal(await page.evaluate(()=>state.session.puzzles.length),105);await page.evaluate(()=>{state.page='results';render();});await page.locator('[data-action="harder"]').click();assert.equal(await page.evaluate(()=>state.config.level),'2');
  await page.evaluate(()=>{state.page='results';render();});await page.locator('[data-action="repeat-hard"]').click();assert.equal(await page.evaluate(()=>state.page),'exercises');await page.evaluate(()=>{state.page='results';render();});await page.locator('[data-action="home"]').last().click();assert.ok(await page.locator('.hero').isVisible());
  passed('Tulemuste vaate kõik neli tegevust 105 ülesandega');
  let branches=0;
  for(const p of PUZZLES.filter(p=>p.mateTree))for(const [key,replies] of Object.entries(p.mateTree))for(const [reply,ends] of Object.entries(replies))for(const end of ends){
   await page.evaluate(({id,key,reply,end})=>{startSession([PUZZLES.find(p=>p.id===id)]);tryMove(key.slice(0,2),key.slice(2,4),key[4]||'q');const r=state.session.current;if(r.reply!==reply){state.game.undo();r.reply=reply;applyMove(state.game,reply);r.moves[1]=reply;}tryMove(end.slice(0,2),end.slice(2,4),end[4]||'q');if(!r.solved)throw Error('Unsolved '+id);},{id:p.id,key,reply,end});branches++;
  }
  passed(branches+' kontrollitud kahekäigulise mati alternatiivset lõppharu');
  const long=PUZZLES.find(p=>p.rule.kind!=='mate2'&&p.solution.length>=7);assert.ok(long);await start(long);await clickMove(long.solution[0]);assert.equal(await page.evaluate(()=>state.session.results.length),0);
  const partial=await page.evaluate(()=>state.game.fen()),current=new Chess(partial),bad=current.moves({verbose:true}).map(uci).find(u=>u!==long.solution[2]);assert.ok(bad);await clickMove(bad);assert.equal(await page.evaluate(()=>state.game.fen()),partial);assert.equal(await page.evaluate(()=>state.session.results.length),0);
  for(let step=2;step<long.solution.length;step+=2){await clickMove(long.solution[step]);if(step<long.solution.length-1)assert.equal(await page.evaluate(()=>state.session.results.length),0);}
  assert.equal(await page.evaluate(()=>state.session.results.length),1);assert.equal(await page.evaluate(()=>state.session.current.moves.length),long.solution.length);
  passed('Pikas lahenduses nõutakse kõiki õpilase käike; vale vahekäik taastatakse ja enneaegset tulemust ei anta');
  // Ainult kasutajaliidese regressioonifixtuur; ei kuulu 105 internetist hangitud ülesande hulka.
  await page.evaluate(()=>startSession([{id:'test-promotion',topic:'fork',level:2,title:'Muundumise test',fen:'8/1r1P1k2/8/8/8/8/8/6K1 w - - 0 1',solution:['d7d8n'],accepted:['d7d8n'],rule:{kind:'fork'},question:'Test',hints:['Test 1','Test 2'],explanation:'Test'}]));
  await page.locator('[data-square="d7"]').click();await page.locator('[data-square="d8"]').click();await page.locator('[data-action="cancel-promotion"]').click();assert.equal(await page.evaluate(()=>state.session.current.solved),false);await page.locator('[data-square="d8"]').click();await page.locator('[data-action="promote"][data-value="q"]').click();assert.equal(await page.evaluate(()=>state.session.current.solved),false);await clickMove('d7d8n');assert.equal(await page.evaluate(()=>state.session.current.solved),true);
  passed('Muundumise tühistamine, vale muundumisvalik ja alamuundamine eraldi UI-regressioonis');
  await start(simple);const good=simple.solution[0];await page.locator('[data-square="'+good.slice(0,2)+'"]').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.dataset.square),good.slice(0,2));
  const squares=await page.locator('[data-square]').evaluateAll(nodes=>nodes.map(n=>n.dataset.square)),a=squares.indexOf(good.slice(0,2)),b=squares.indexOf(good.slice(2,4));
  const dy=Math.floor(b/8)-Math.floor(a/8),dx=b%8-a%8;for(let i=0;i<Math.abs(dy);i++)await page.keyboard.press(dy>0?'ArrowDown':'ArrowUp');for(let i=0;i<Math.abs(dx);i++)await page.keyboard.press(dx>0?'ArrowRight':'ArrowLeft');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>state.session.current.solved),true);
  await start(simple);await page.locator('[data-square="'+good.slice(0,2)+'"]').dragTo(page.locator('[data-square="'+good.slice(2,4)+'"]'));assert.equal(await page.evaluate(()=>state.session.current.solved),true);passed('Malelaua klaviatuur ja lohistamine uue seisu peal');
  await nav('coach').click();await page.locator('[name="password"]').fill('male2026');await page.locator('[name="password"]').press('Enter');assert.equal(await page.locator('.puzzle-entry').count(),105);
  await page.locator('#coach-topic').selectOption('fork');await page.locator('#coach-level').selectOption('2');assert.equal(await page.locator('.puzzle-entry').count(),5);await page.locator('.puzzle-entry summary').first().click();await page.locator('.assessment').first().selectOption('sobib');assert.ok((await page.locator('.entry-copy').first().innerText()).includes('CC0-1.0'));await page.locator('[data-action="one"]').first().click();assert.equal(await page.evaluate(()=>state.session.puzzles.length),1);
  await page.evaluate(()=>{state.page='coach';render();});await page.locator('[data-action="coach-start"]').click();assert.equal(await page.evaluate(()=>state.session.puzzles.length),5);passed('Treeneri 105 seisu, 5 kaupa filtreerimine, allikad, sobivushinnang ja komplekti käivitamine');
  await page.evaluate(()=>{state.page='expert';render();});await page.locator('[name="author"]').fill('Testõpetaja');for(let i=0;i<8;i++)await page.locator('[name="rating'+i+'"][value="4"]').check();for(let i=0;i<4;i++)await page.locator('[name="text'+i+'"]').fill('Õpetaja vastus '+i);await page.locator('#feedback-submit').click();
  for(const type of ['txt','csv']){const wait=page.waitForEvent('download');await page.locator('[data-action="export-'+type+'"]').click();const download=await wait,dest=path.join(__dirname,'feedback-test.'+type);await download.saveAs(dest);const bytes=fs.readFileSync(dest);assert.deepEqual([...bytes.subarray(0,3)],[239,187,191]);assert.ok(bytes.toString('utf8').includes('sobib'));}
  passed('Tagasisidevormi TXT/CSV tegelikud allalaadimised ja uue ülesande sobivushinnang');
  for(const width of [1440,1024,820,768,620,390]){await page.setViewportSize({width,height:1000});for(const route of ['home','exercises','instructions','play','coach','coach-login','results','expert']){await page.evaluate(route=>{if(route==='play')startSession(PUZZLES);else{state.page=route;render();}},route);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow '+width);}}
  passed('Kõik kaheksa vaadet kuuel ekraanilaiusel, sealhulgas 105 ülesandega edenemine');
  const touch=await browser.newContext({viewport:{width:820,height:1180},hasTouch:true});await touch.setOffline(true);const tp=await touch.newPage();await tp.goto(pathToFileURL(htmlPath).href);await tp.evaluate(()=>startSession([PUZZLES[0]]));const tm=PUZZLES[0].solution[0];await tp.locator('[data-square="'+tm.slice(0,2)+'"]').tap();await tp.locator('[data-square="'+tm.slice(2,4)+'"]').tap();if(tm[4])await tp.locator('[data-action="promote"][data-value="'+tm[4]+'"]').tap();assert.equal(await tp.evaluate(()=>state.session.current.solved),true);await touch.close();passed('Uue ülesande lahendamine tahvelarvuti puutesisendiga');
  assert.deepEqual(errors,[]);assert.ok(requests.every(url=>url.startsWith('file:')));passed('JavaScripti vigu ja väliseid ressursipäringuid pole; kogu pank töötab internetita');
  fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify({checks,errors,networkRequests:requests.filter(url=>!url.startsWith('file:')),puzzlesSolved:105,studentMoves,mateBranches:branches},null,2));console.log('ALL CHECKS PASSED');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
