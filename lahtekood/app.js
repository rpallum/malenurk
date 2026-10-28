/* Malenurk. Kogu olek on ainult selle brauserilehe mälus. */
const {TOPICS,LEVELS,PUZZLES}=MALENURK_DATA;
const demoPuzzle=()=>PUZZLES.find(p=>p.topic==='mate1'&&p.level===1);
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topic=id=>TOPICS.find(t=>t.id===id);
const names={p:'ettur',n:'ratsu',b:'oda',r:'vanker',q:'lipp',k:'kuningas'};
const color=c=>c==='w'?'Valged':'Mustad';
const icons={arrow:'M4 10h12m-5-5 5 5-5 5',back:'M16 10H4m5-5-5 5 5 5',book:'M3 3h5a3 3 0 0 1 3 3v12a4 4 0 0 0-4-2H3zm14 0h-3a3 3 0 0 0-3 3m0 12a4 4 0 0 1 4-2h2V3',bulb:'M7 14c0-3-3-3-3-7a6 6 0 0 1 12 0c0 4-3 4-3 7m-6 0h6m-6 3h6m-5 2h4',crown:'m3 5 4 4 3-6 3 6 4-4-2 11H5zm2 14h10',flag:'M5 18V3m0 1c4-4 7 4 11 0v8c-4 4-7-4-11 0',fork:'M10 18V7M4 3v5l6 5 6-5V3m-9 3 3-3 3 3',pin:'m7 3 6 0-1 5 3 5H5l3-5zm3 10v6',target:'M18 10a8 8 0 1 1-8-8m0 5a3 3 0 1 0 3 3m-3 0 8-8m-4 0h4v4',diamond:'m10 2 8 8-8 8-8-8z',shield:'m10 2 7 3v5c0 4-7 8-7 8s-7-4-7-8V5zm-3 8 2 2 4-4',check:'m4 10 4 4 8-8',eye:'M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6m12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',flip:'M3 7h13m-3-3 3 3-3 3M17 13H4m3-3-3 3 3 3',refresh:'M17 6v5h-5m5 0a7 7 0 1 0-2 5',download:'M10 2v11m-4-4 4 4 4-4M3 14v4h14v-4',star:'m10 2 2.5 5 5.5.8-4 4 .9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-4L7.5 7z'};
function icon(n){return `<svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="${icons[n]||icons.diamond}"/></svg>`;}
const piecePaths={
 p:'<circle cx="32" cy="17" r="8"/><path d="M25 26h14l-3 12 6 9H22l6-9z"/><path d="M20 48h24v7H20z"/>',
 r:'<path d="M18 10h7v7h7v-7h7v7h7v-7h4v17H17V10zm5 18h21l-4 17H27zM22 46h23v4H22zm-4 5h31v5H18z"/>',
 n:'<path d="M18 47c-1-10 8-15 17-18l-6-5-8 5-7-5 7-13 8-1 4-6 3 9c13 5 16 17 11 34z"/><path d="m22 18 6-2M34 14l3 5" fill="none"/><circle cx="28" cy="17" r="1.5" fill="var(--stroke)" stroke="none"/><path d="M19 48h28v7H19z"/>',
 b:'<path d="M32 7c-4 7-12 12-12 20 0 6 5 10 12 10s12-4 12-10C44 19 36 14 32 7z"/><path d="m37 17-9 12" fill="none"/><path d="m28 37-5 10h18l-5-10zM20 48h24v7H20z"/><circle cx="32" cy="5" r="2.5"/>',
 q:'<path d="m17 18 5 23h20l5-23-10 8-5-12-5 12zM22 42h20v5H22zm-4 7h28v7H18z"/><circle cx="16" cy="15" r="3"/><circle cx="32" cy="11" r="3"/><circle cx="48" cy="15" r="3"/>',
 k:'<path d="M32 3v13m-6-8h12" fill="none" stroke-width="3"/><path d="M32 18c-11-7-19 2-13 12l7 10h12l7-10c6-10-2-19-13-12zM24 41h16v6H24zm-5 8h26v7H19z"/>'
};
function pieceSVG(p){return `<svg viewBox="0 0 64 64" class="piece ${p.color}" aria-hidden="true"><g fill="var(--fill)" stroke="var(--stroke)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${piecePaths[p.type]}</g></svg>`;}
function moveUci(m){return m.from+m.to+(m.promotion||'');}
function applyMove(c,u){return c.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});}
function notation(s){return s.replace(/^[KQRBN]/,x=>({K:'K',Q:'L',R:'V',B:'O',N:'R'}[x])).replace(/=([QRBN])/,(_,x)=>'='+({Q:'L',R:'V',B:'O',N:'R'}[x]));}
function lineText(p,line=p.solution){const c=new Chess(p.fen);return line.map((u,i)=>{const side=c.turn(),number=c.fen().split(' ')[5];const m=applyMove(c,u);return `${i===0&&side==='b'?number+'… ':side==='w'?number+'. ':''}${notation(m.san)}`;}).join('  ');}
const state={page:'home',config:{level:'all',topic:'all',count:'5'},coach:{level:'all',topic:'all'},session:null,game:null,selected:null,orientation:'w',assessment:{},feedback:{},drag:null,coachUnlocked:false,savedFeedback:null,feedbackDirty:false,feedbackError:''};
let pendingPromotion=null;
function getPool(config=state.config){return PUZZLES.filter(p=>(config.level==='all'||p.level===Number(config.level))&&(config.topic==='all'||p.topic===config.topic)).sort((a,b)=>a.level-b.level||TOPICS.findIndex(t=>t.id===a.topic)-TOPICS.findIndex(t=>t.id===b.topic));}
function nav(){
 const active=['play','results'].includes(state.page)?'exercises':state.page==='coach-login'?'coach':state.page;
 const items=[['home','Avaleht'],['exercises','Harjutused'],['instructions','Juhised'],['coach','Treeneri vaade'],['expert','Tagasiside']];
 return `<header><div class="wrap nav"><button class="brand" data-action="home" aria-label="Malenurk, avaleht"><span class="brand-mark">${pieceSVG({type:'n',color:'w'})}</span>Malenurk<span class="sr-only"> – maleharjutused</span></button><nav class="navlinks" aria-label="Peamenüü">${items.map(([id,label])=>`<button data-action="${id}" class="${active===id?'active':''}" ${active===id?'aria-current="page"':''}>${label}</button>`).join('')}</nav></div></header>`;
}
function footer(){return `<footer class="footer"><span>Malenurk · Iga hea käik algab mõtlemisest.</span><div class="footer-links"><button data-action="expert">Tagasiside</button><button data-action="about">Programmist</button><span>Töötab ka internetita</span></div></footer>`;}
function render(){
 if(state.page==='coach'&&!state.coachUnlocked)state.page='coach-login';
 document.documentElement.lang='et';
 const pages={home:homePage,exercises:exercisesPage,instructions:instructionsPage,play:playPage,coach:coachPage,'coach-login':coachLoginPage,results:resultsPage,expert:expertPage};
 $('#app').innerHTML=nav()+`<main class="wrap" id="main">${(pages[state.page]||homePage)()}${footer()}</main>`;
 const titles={exercises:'Harjutused',instructions:'Juhised',play:'Harjutamine',coach:'Treeneri vaade','coach-login':'Treeneri sisselogimine',results:'Tulemused',expert:'Tagasiside'};
 document.title=(titles[state.page]?titles[state.page]+' · ':'')+'Malenurk';
 bindForms();
}
function exercisesPage(){return `<section class="page exercise-selection" aria-labelledby="setup-title"><div class="section-head"><div><div class="eyebrow">Väike trenn. Teravam mõte.</div><h1 id="setup-title">Harjutused</h1><p class="selection-intro">Millist oskust täna treenime?</p></div><p>Vali sobiv tase ja teema.<br>Siin ei käi aeg sinu vastu.</p></div><div class="setup-grid"><div class="setup-card">${setupFields()}<div class="setup-bottom"><p id="pool-info" role="status">${poolInfo()}</p><button class="btn primary" data-action="start">Läheme lauale ${icon('arrow')}</button></div></div><aside class="tip-card">${icon('bulb')}<h3>Mõtle nagu<br>maletaja.</h3><p>Enne käiku võta hetk ja vaata kogu lauda.</p><div class="tip-list"><div><span>1</span>Millised šahhid on võimalikud?</div><div><span>2</span>Kas mõni malend on kaitseta?</div><div><span>3</span>Mida vastane ähvardab?</div></div><div class="tip-end">HEA PLAAN ON POOL VÕITU.</div></aside></div></section>`;}
function instructionsPage(){
 const steps=[
  ['Vali oma harjutuskord.','Ava „Harjutused“ ja vali tase, teema ning 5, 10 või kõik sobivad ülesanded. Näed enne alustamist tegelikku saadaolevate ülesannete arvu. Väiksemas valikus ülesandeid ei dubleerita.'],
  ['Vali malend ja tee käik.','Vajuta oma malendile ning seejärel sihtruudule. Võimalikud sihtruudud on tähistatud. Arvutis võid malendit ka lohistada; puuteekraanil puuduta malendit ja sihtruutu. Klaviatuuril vali ruut tabeldusklahvi või nooltega ning kinnita sisestusklahviga.'],
  ['Proovi uuesti ja kasuta vihjeid.','Vale käik võetakse tagasi ning õiget lahendust ei avaldata. Seaduslik vale käik lisab eksimuse, ebaseaduslik katse annab juhise. Esimene vihje aitab ideed märgata, teine suunab konkreetsemalt. „Taasta algseis“ säilitab avatud vihjed ja eksimuste arvu.'],
  ['Jätka mitmekäigulist lahendust.','Kahekäigulises matis ja pikemas materjalivõidus ei piisa esimesest õigest käigust. Programm teeb vastase käigu ja ootab sinu järgmist käiku. Etturi viimasele reale jõudmisel vali avanevas aknas lipp, vanker, oda või ratsu. Mõnikord on õige just alamuundamine.'],
  ['Vaata lahenduse mõtet.','„Vaata lahendust“ näitab käike ja selgitust ning märgib ülesande läbituks, kuid mitte õigesti lahendatuks. Ise leitud vastuse järel näed samuti põhjendust. Järgmise ülesande juurde saab pärast lahendamist või lahenduse avamist.'],
  ['Mõtesta oma tulemusi.','Edukus on õigesti lahendatud ülesannete osakaal läbitud ülesannetest. Õigeks loetakse ka pärast vihjet või eksimust leitud vastus. Esimesel katsel ja vihjeta lahendatud ülesanded kuvatakse eraldi. Lõpus saad korrata komplekti, valida raskema taseme või korrata keerulisi teemasid. Üks harjutuskord ei mõõda üldist maletugevust.']
 ];
 return `<section class="page instructions-page"><div class="eyebrow">Üks mõte korraga</div><h1>Juhised</h1><p class="page-intro">Malenurk on taktika harjutamiseks 9–12-aastastele noortele, kes on õppinud malet vähemalt kolm aastat. Võta aega mõtlemiseks ja märka iga käigu mõtet.</p><div class="instruction-grid">${steps.map(([title,text],i)=>`<article class="instruction-card"><span class="step">${i+1}</span><h2>${title}</h2><p>${text}</p></article>`).join('')}</div><div class="notation-card"><h2>Eestikeelsed malenditähised</h2><dl>${[['K','kuningas'],['L','lipp'],['V','vanker'],['O','oda'],['R','ratsu'],['x','löök'],['+','šahh'],['#','matt']].map(([sign,label])=>`<div><dt>${sign}</dt><dd>${label}</dd></div>`).join('')}</dl><p>Näiteks Rf7+ tähendab ratsu käiku ruudule f7 koos šahhiga.</p></div><div class="assessment-tip">Harjutustulemused ja salvestamata tagasiside kaovad lehe värskendamisel. Kinnitatud tagasiside säilib sama brauserivahelehe seansi jooksul ka pärast värskendamist. Vahelehe sulgemisel seanss lõpeb.</div><button class="btn primary" data-action="exercises">Vali harjutuskord ${icon('arrow')}</button></section>`;
}
function coachLoginPage(){return `<section class="page login-page"><div class="login-card"><span class="login-symbol">${icon('shield')}</span><div class="eyebrow">Treeneri töölaud</div><h1>Treeneri sisselogimine</h1><p>Treeneri vaates saad vaadata ülesandeid, vihjeid ja lahendusi.</p><form id="login-form" novalidate><label class="text-field">Salasõna<input type="password" name="password" autocomplete="current-password" required aria-describedby="login-status"></label><p id="login-status" class="form-status" role="status" aria-live="polite"></p><button class="btn primary" type="submit">Sisene treeneri vaatesse ${icon('arrow')}</button></form><button class="btn text" data-action="home">${icon('back')} Tagasi avalehele</button></div></section>`;}

function board(c,interactive=false,orientation='w',last=null){
 const files=orientation==='w'?'abcdefgh':'hgfedcba';const ranks=orientation==='w'?'87654321':'12345678';let squares='';let legal=[];
 if(interactive&&state.selected)legal=c.moves({square:state.selected,verbose:true}).map(m=>m.to);
 for(let row=0;row<8;row++)for(let col=0;col<8;col++){const s=files[col]+ranks[row],p=c.get(s),dark=(s.charCodeAt(0)-97+Number(s[1]))%2===1;const cls=['square',dark?'dark':'',p?'occupied':'',interactive&&state.selected===s?'selected':'',legal.includes(s)?'legal':'',last&&[last.from,last.to].includes(s)?'last':''].filter(Boolean).join(' ');const label=s+(p?`, ${p.color==='w'?'valge':'must'} ${names[p.type]}`:', tühi ruut');const inner=(col===0?`<span class="coord rank">${ranks[row]}</span>`:'')+(row===7?`<span class="coord file">${files[col]}</span>`:'')+(p?pieceSVG(p):'');
 squares+=interactive?`<button type="button" class="${cls}" data-square="${s}" aria-label="${label}" aria-pressed="${state.selected===s}" draggable="${Boolean(p&&p.color===c.turn())}">${inner}</button>`:`<div class="${cls}" aria-hidden="true">${inner}</div>`;
 }
 return `<div class="board-frame"><div class="board" ${interactive?'aria-label="Malelaud. Vali malend, seejärel sihtruut. Klaviatuuril kasuta tabeldusklahvi, nooli ja sisestusklahvi."':'role="img" aria-label="Maleülesande seisu eelvaade"'}>${squares}</div></div>`;
}
function homePage(){const demo=demoPuzzle();return `<section class="hero"><div class="hero-copy"><div class="eyebrow">Sinu järgmine hea käik</div><h1>Hea käik algab<br>heast <em>mõttest.</em></h1><p>Terita pilku, avasta taktikalisi võimalusi ja leia oma lahendus. Sinu järgmine arengusamm algab siit.</p><div class="hero-actions"><button class="btn primary" data-action="setup">Alusta harjutamist ${icon('arrow')}</button><button class="btn text" data-action="help">Kuidas see käib? ${icon('book')}</button></div><div class="hero-note"><span class="dot"></span>9–12-aastastele · vähemalt 3 aastat maleõpet</div></div><div class="preview"><div class="preview-label"><span>VÄIKE VÄLJAKUTSE</span><span>${demo.turn==='w'?'Valgete':'Mustade'} käik</span></div>${board(new Chess(demo.fen))}<div class="floating-tag"><span class="round">${icon('bulb')}</span>Kas märkad matikäiku?</div><div class="preview-footer"><span>Matt ühe käiguga</span><button data-action="demo">Proovi seda ülesannet ${icon('arrow')}</button></div></div></section><div class="statbar"><div class="stat"><strong>${PUZZLES.length}</strong><span>kontrollitud<br>maleülesannet</span></div><div class="stat"><strong>7</strong><span>taktikalist<br>harjutusteemat</span></div><div class="stat"><strong>Sinu tempo.</strong><span>Mõtle rahulikult.<br>Vihjed aitavad edasi.</span></div></div>`; }
function setupFields(){return `<div class="setup-field"><div class="field-row"><span class="step">1</span><h3>Harjutustase</h3><span class="small">Programmi raskusaste</span></div><div class="segmented" role="group" aria-label="Harjutustase">${[['all','Kõik tasemed'],...LEVELS.map((n,i)=>[String(i),n])].map(([id,n])=>`<button class="choice ${state.config.level===id?'selected':''}" aria-pressed="${state.config.level===id}" data-action="level" data-value="${id}">${n}</button>`).join('')}</div></div><div class="setup-field"><div class="field-row"><span class="step">2</span><h3>Harjutuse teema</h3></div><div class="topics" role="group" aria-label="Harjutuse teema">${[{id:'all',name:'Kõik teemad',icon:'diamond'},...TOPICS].map(t=>`<button class="choice ${state.config.topic===t.id?'selected':''}" aria-pressed="${state.config.topic===t.id}" data-action="topic" data-value="${t.id}">${icon(t.icon)}${t.name}</button>`).join('')}</div></div><div class="setup-field"><div class="field-row"><span class="step">3</span><h3>Ülesannete arv</h3></div><div class="segmented" role="group" aria-label="Ülesannete arv">${[['5','5 ülesannet'],['10','10 ülesannet'],['all','Kõik valitud ülesanded']].map(([id,n])=>`<button class="choice ${state.config.count===id?'selected':''}" aria-pressed="${state.config.count===id}" data-action="count" data-value="${id}">${n}</button>`).join('')}</div></div>`;}
function poolInfo(){const total=getPool().length;const count=state.config.count==='all'?total:Math.min(total,Number(state.config.count));return `<strong>${count} ülesannet</strong> selles harjutuskorras. ${total} vastab valikule.${state.config.count!=='all'&&total<Number(state.config.count)?' Näitame kõiki sobivaid ülesandeid.':''}`;}
function startSession(custom){let pool=custom||getPool();if(!pool.length)return;const limit=custom?pool.length:state.config.count==='all'?pool.length:Math.min(pool.length,Number(state.config.count));
 // Komplekt edeneb tasemete järgi; andmestikus puuduvad peegelvariandid.
 if(!custom){pool=[...pool].sort((a,b)=>a.level-b.level);}
 state.session={puzzles:pool.slice(0,limit),index:0,results:[],current:null,config:{...state.config}};state.page='play';loadPuzzle();render();window.scrollTo(0,0);
}
function currentPuzzle(){return state.session.puzzles[state.session.index];}
function loadPuzzle(){const p=currentPuzzle();state.game=new Chess(p.fen);state.orientation=state.game.turn();state.selected=null;state.session.current={hints:0,mistakes:0,solved:false,revealed:false,recorded:false,step:0,key:null,reply:null,moves:[],last:null,feedback:'Vali malend ja seejärel sihtruut. Võid malendit ka lohistada.',tone:''};}
function playPage(){if(!state.session)return homePage();const p=currentPuzzle(),r=state.session.current,s=state.session;return `<section class="exercise"><div class="exercise-top"><button class="back" data-action="exercises">${icon('back')} Harjutuste valikusse</button><div class="session-progress"><div><span>Ülesanne ${s.index+1} / ${s.puzzles.length}</span><span>${Math.round(s.results.length/s.puzzles.length*100)}%</span></div><div class="track"><span style="width:${s.results.length/s.puzzles.length*100}%"></span></div></div></div><div class="play-grid"><div class="board-column"><div class="board-shell"><div class="player"><span><span class="player-dot ${state.orientation==='w'?'':'white'}"></span>${color(state.orientation==='w'?'b':'w')}</span><span>${state.orientation===p.fen.split(" ")[1]?"Vastane":"Sina"}</span></div>${board(state.game,!r.solved&&!r.revealed,state.orientation,r.last)}<div class="player bottom"><span><span class="player-dot ${state.orientation==='w'?'white':''}"></span>${color(state.orientation)}</span><span>${state.orientation===p.fen.split(" ")[1]?"Sina":"Vastane"}</span></div></div><div class="board-tools"><span>Vali malend → vali sihtruut</span><button data-action="flip">${icon('flip')} Pööra lauda</button></div></div><div class="task-panel"><div class="task-badges"><span class="badge">${icon(topic(p.topic).icon)}${topic(p.topic).name}</span><span class="badge level">${LEVELS[p.level]}</span></div><h1>${p.title}</h1><p class="task-question">${p.question}</p><div class="turn"><span class="turn-dot"></span>${r.solved?'Ülesanne lahendatud':r.revealed?'Lahendus avatud':color(state.game.turn())+' käivad'}${state.game.isCheck()&&!state.game.isCheckmate()?' · šahh':''}</div><div class="feedback ${r.tone}" role="status" aria-live="polite">${r.feedback}</div>${!r.solved&&!r.revealed?`<div class="task-actions"><button class="btn lime" data-action="hint" ${r.hints>=p.hints.length?'disabled':''}>${icon('bulb')}${r.hints>=p.hints.length?'Kõik vihjed avatud':'Näita vihjet'} <span>(${r.hints}/${p.hints.length})</span></button><button class="btn" data-action="reveal">${icon('eye')} Vaata lahendust</button></div>`:''}${r.hints?`<div class="hint-list">${p.hints.slice(0,r.hints).map((h,i)=>`<div class="hint"><strong>Vihje ${i+1}</strong>${h}</div>`).join('')}</div>`:''}${r.solved||r.revealed?`<div class="solution-box"><h3>${r.solved?'Miks see töötab?':'Vaata käikude mõtet'}</h3><div class="solution-line">${lineText(p,r.revealed?p.solution:r.moves)}</div><p>${p.explanation}</p><p class="solution-meta">${topic(p.topic).name} · ${LEVELS[p.level]} · Vihjeid: ${r.hints} · Ebaõnnestunud katseid: ${r.mistakes}</p></div><button class="btn primary next-btn" data-action="next">${s.index===s.puzzles.length-1?'Vaata tulemusi':'Järgmine ülesanne'} ${icon('arrow')}</button>`:`<button class="btn text" data-action="reset">${icon('refresh')} Taasta algseis</button>`}<div class="session-dots" aria-label="Harjutuskorra edenemine">${s.puzzles.map((_,i)=>`<span class="session-dot ${i===s.index?'current':''} ${s.results[i]?.correct?'ok':s.results[i]?'revealed':''}">${i+1}</span>`).join('')}</div><p class="help-note">Rahulik mõtlemine on osa treeningust. Vihje kasutamine on lubatud.</p></div></div></section>`;}
function squareClick(s){const r=state.session?.current;if(!r||r.solved||r.revealed)return;const c=state.game,piece=c.get(s);
 if(state.selected===s){state.selected=null;refreshPlay();return;}
 if(piece&&piece.color===c.turn()){state.selected=s;refreshPlay();return;}
 if(!state.selected){r.feedback='Vali kõigepealt oma malend.';r.tone='';refreshPlay();return;}
 const from=state.selected;const promotions=c.moves({square:from,verbose:true}).filter(m=>m.to===s&&m.promotion);
 if(promotions.length){pendingPromotion={from,to:s};$('#promotion-content').innerHTML=`<h2>Muunda ettur</h2><p class="promotion-title">Milliseks malendiks etturi muundad?</p><div class="promotion-options">${['q','r','b','n'].map(type=>`<button data-action="promote" data-value="${type}">${pieceSVG({type,color:c.turn()})}<span>${names[type][0].toUpperCase()+names[type].slice(1)}</span></button>`).join('')}</div><button class="btn text" data-action="cancel-promotion">Tühista</button>`;$('#promotion').showModal();return;}
 tryMove(from,s);
}
function tryMove(from,to,promotion='q'){
 const c=state.game,p=currentPuzzle(),r=state.session.current;let move;
 try{move=c.move({from,to,promotion});}catch{r.feedback=c.isCheck()?'Kuningas on šahis. Sinu käik peab šahhi tõrjuma.':'See käik pole selles seisus lubatud. Kontrolli malendi liikumist ja oma kuninga ohutust.';r.tone='wrong';state.selected=null;refreshPlay();return;}
 const u=moveUci(move);let correct=false;
 if(p.rule.kind==='mate1')correct=c.isCheckmate();
 else if(p.rule.kind==='mate2')correct=r.step===0?Boolean(p.mateTree[u]):Boolean(p.mateTree[r.key]?.[r.reply]?.includes(u)&&c.isCheckmate());
 else correct=r.step===0?p.accepted.includes(u):p.solution[r.step]===u;
 if(!correct){c.undo();r.mistakes++;r.tone='wrong';r.feedback=({mate1:'Vaata, kas vastasel jääb mõni kaitse või põgenemisruut. Proovi uuesti.',mate2:'See käik ei sunni nõutud matti. Arvesta ka vastase parima vastusega.',fork:'Vaata, kas sinu malend ründab mõlemat vajalikku sihtmärki.',pin:'Mõtle, millised kolm malendit peaksid jääma samale joonele.',double:'Otsi käiku, mis loob kaks rünnakut korraga.',material:'Võrdle võidetava ja loovutatava materjali väärtust.',defence:'Kõigepealt kontrolli oma kuninga ohutust.'}[p.rule.kind]||'See käik ei täida ülesande eesmärki. Vaata vastase võimalusi ja proovi uuesti.');state.selected=null;refreshPlay();return;}
 state.selected=null;r.moves.push(u);r.last=move;
 if(p.rule.kind==='mate2'&&r.step===0){r.key=u;r.reply=Object.keys(p.mateTree[u])[0];const reply=applyMove(c,r.reply);r.moves.push(r.reply);r.last=reply;r.step=1;r.tone='good';r.feedback=`Hea algus! Vastane vastas ${notation(reply.san)}. Leia nüüd matikäik.`;refreshPlay();return;}
 if(p.rule.kind!=='mate1'&&p.rule.kind!=='mate2'&&p.solution.length>1){r.step=r.moves.length;if(r.step<p.solution.length){const reply=applyMove(c,p.solution[r.step]);r.last=reply;r.moves.push(p.solution[r.step]);r.step++;if(r.step<p.solution.length){r.tone='good';r.feedback=`Õige käik. Vastane vastas ${notation(reply.san)}. Jätka lahendust.`;refreshPlay();return;}}}
 r.solved=true;r.tone='good';r.feedback='Õige! Leidsid taktikalise võimaluse. Vaata allpool, miks see käik töötab.';recordResult(true);refreshPlay();
}
function recordResult(correct){const r=state.session.current;if(r.recorded)return;r.recorded=true;const p=currentPuzzle();state.session.results.push({id:p.id,topic:p.topic,level:p.level,correct,hints:r.hints,mistakes:r.mistakes});}
function refreshPlay(){const pos=window.scrollY,focused=document.activeElement?.dataset?.square;render();if(focused)document.querySelector(`[data-square="${focused}"]`)?.focus({preventScroll:true});window.scrollTo(0,pos);}
function reveal(){const r=state.session.current;if(r.recorded)return;const p=currentPuzzle();state.game=new Chess(p.fen);r.moves=[];for(const m of p.solution){r.last=applyMove(state.game,m);r.moves.push(m);}r.revealed=true;r.feedback='Lahendus on avatud. Jälgi käikude järjekorda ja loe selgitust. Selle ülesande märgime koos ülevaatamisega läbituks.';r.tone='';state.selected=null;recordResult(false);refreshPlay();}
function resultsPage(){const s=state.session;if(!s)return homePage();const results=s.results,total=results.length,correct=results.filter(r=>r.correct).length,hints=results.reduce((x,r)=>x+r.hints,0);const stats=TOPICS.map(t=>({...t,n:results.filter(r=>r.topic===t.id).length,ok:results.filter(r=>r.topic===t.id&&r.correct).length,hints:results.filter(r=>r.topic===t.id).reduce((n,r)=>n+r.hints,0),mistakes:results.filter(r=>r.topic===t.id).reduce((n,r)=>n+r.mistakes,0)})).filter(t=>t.n);
 const best=[...stats].sort((a,b)=>b.ok/b.n-a.ok/a.n||a.hints-b.hints||a.mistakes-b.mistakes)[0];const hard=stats.filter(t=>t.ok<t.n||t.hints||t.mistakes);return `<section class="page"><div class="results-hero"><div class="result-symbol">${icon('star')}</div><div class="eyebrow">Üks harjutuskord targem</div><h1>Hästi mõeldud.</h1><p>Võta hetk, et märgata, mis õnnestus ja millist ideed tahaksid veel proovida.</p></div><div class="result-stats"><div><strong>${total}</strong><span>läbitud ülesannet</span></div><div><strong>${correct}</strong><span>õigesti lahendatud</span></div><div><strong>${total?Math.round(correct/total*100):0}%</strong><span>lahendatud ise või vihjetega</span></div><div><strong>${hints}</strong><span>kasutatud vihjet</span></div></div><div class="results-detail"><div class="result-card"><h3>Sinu teemad</h3>${stats.map(t=>`<div class="topic-result"><span>${t.name}</span><strong>${t.ok} / ${t.n}</strong></div>`).join('')}<p class="muted">Esimesel katsel ja vihjeta: ${results.filter(r=>r.correct&&!r.mistakes&&!r.hints).length}. Avatud lahendusi: ${total-correct}. Edukus arvestab ka pärast uuesti proovimist leitud vastuseid.</p></div><div class="result-card"><h3>Järgmine samm</h3><p>${best?`Kõige kindlamalt läks teemas <strong>${best.name.toLowerCase()}</strong>. `:''}${hard.length?`Uuesti tasub vaadata: ${hard.map(t=>t.name.toLowerCase()).join(', ')}.`:'Selles harjutuskorras lahendasid kõik ülesanded vihjeta ja eksimusteta. Proovi järgmist taset või mõnda uut teemat.'}</p><p class="muted" style="margin-top:12px">See on ühe harjutuskorra ülevaade. Väikese ülesannete arvu põhjal ei saa hinnata sinu üldist mängutugevust.</p></div></div><div class="result-actions"><button class="btn primary" data-action="again">${icon('refresh')} Harjuta uuesti</button><button class="btn" data-action="harder">Harjuta keerulisemaid ülesandeid</button><button class="btn" data-action="repeat-hard">Korda keerulisi teemasid</button><button class="btn" data-action="home">Tagasi avalehele</button></div><details class="result-history"><summary>Vaata ülesannete ülevaadet</summary>${results.map(r=>`<div class="history-row"><span>${esc(PUZZLES.find(p=>p.id===r.id).title)}</span><span>${r.correct?'Lahendatud':'Lahendus avatud'} · ${r.hints} vihjet · ${r.mistakes} eksimust</span></div>`).join('')}</details></section>`;}
function coachPage(){if(!state.coachUnlocked)return coachLoginPage();const pool=getPool(state.coach);return `<section class="page"><div class="coach-heading"><div class="eyebrow">Treeneri töölaud</div><button class="btn" data-action="coach-logout">Välju treeneri vaatest</button></div><h1>Hea ülesanne.<br>Õigel hetkel.</h1><p class="page-intro">Vaata seisud üle, tutvu vihjetega ja vali treeninguks sobiv harjutus. Kõik ${PUZZLES.length} õppeseisu on käikude ja taktikalise eesmärgi järgi automaatselt kontrollitud. Raskusastmed vajavad treeneri hinnangut.</p><div class="coach-tools"><div class="filters"><label>Teema<select id="coach-topic">${[{id:'all',name:'Kõik teemad'},...TOPICS].map(t=>`<option value="${t.id}" ${state.coach.topic===t.id?'selected':''}>${t.name}</option>`).join('')}</select></label><label>Raskusaste<select id="coach-level">${[['all','Kõik tasemed'],...LEVELS.map((n,i)=>[String(i),n])].map(([id,n])=>`<option value="${id}" ${state.coach.level===id?'selected':''}>${n}</option>`).join('')}</select></label></div><button class="btn primary" data-action="coach-start">Harjuta valitud ülesandeid ${icon('arrow')}</button></div><p class="muted" style="font-size:11px;margin-bottom:15px">${pool.length} ülesannet · Ava rida, et näha seisu, lahendust ja vihjeid. Sobivushinnang jääb selle lehe mällu ja lisatakse hinnangufaili.</p><div class="puzzle-list">${pool.map(p=>`<details class="puzzle-entry" data-puzzle="${p.id}"><summary><span class="entry-id">${p.id}</span><span class="entry-name">${p.title}</span><span class="badge">${topic(p.topic).name}</span><span class="badge level">${LEVELS[p.level]}</span></summary><div class="entry-details">${board(new Chess(p.fen),false,new Chess(p.fen).turn())}<div class="entry-copy"><p><strong>${color(new Chess(p.fen).turn())} käivad.</strong> ${p.question}</p><p><strong>Lahendus:</strong> ${lineText(p)}</p><p>${p.explanation}</p><ol>${p.hints.map(h=>`<li>${h}</li>`).join('')}</ol><p>Allikas: <a href="${p.source.url}" target="_blank" rel="noopener noreferrer">Lichess ${p.source.id}</a> · allika reiting ${p.source.rating} · ${p.source.license} · hangitud ${p.source.retrieved}. Kontrollitud chess.js-i, python-chess’i ja Stockfishiga.${p.rule.kind==='mate2'?' Kõik esimese käigu sundmativariandid ja vastase seaduslikud kaitsed on kontrollitud. Rakendus mängib ühes harus ühe kaitse; uut lahendust alustades saab uurida teisi algkäike.':''}</p><label>Sihtrühmale sobivus <select class="assessment" data-id="${p.id}" aria-label="Ülesande ${p.id} sobivus">${[['','Hindamata'],['sobib','Sobib'],['kohandada','Vajab kohandamist'],['ei-sobi','Ei sobi']].map(([v,n])=>`<option value="${v}" ${state.assessment[p.id]===v?'selected':''}>${n}</option>`).join('')}</select></label><p><code>FEN: ${p.fen}</code></p><button class="btn" data-action="one" data-value="${p.id}">Harjuta seda ülesannet ${icon('arrow')}</button></div></div></details>`).join('')}</div><button class="btn" style="margin-top:25px" data-action="expert">Anna tagasisidet ${icon('arrow')}</button></section>`;}
const criteria=[
 'Ülesannete sisu on malealaselt korrektne.',
 'Ülesannete raskusaste sobib sihtrühmale.',
 'Ülesannete jaotus teemade kaupa on loogiline.',
 'Vihjed toetavad õppimist.',
 'Tagasiside on õppijale arusaadav.',
 'Programm sobib iseseisvaks harjutamiseks.',
 'Programm võiks olla treenerile abivahend.',
 'Programm on tehniliselt mugav kasutada.'
];
const openQuestions=[
 'Milline programmi osa on kõige õnnestunum?',
 'Mida tuleks muuta või täiendada?',
 'Milliseid ülesandetüüpe võiks juurde lisada?',
 'Kas programm sobib sihtrühma treeningute toetamiseks? Palun põhjenda.'
];
const FEEDBACK_STORAGE_KEY='malenurk.feedback.v1';
function feedbackFields(payload){
 const fields={author:payload.hindaja};
 payload.hinnangud.forEach((item,i)=>fields['rating'+i]=String(item.punktid));
 payload.vastused.forEach((item,i)=>fields['text'+i]=item.vastus);
 return fields;
}
function restoreFeedback(){
 try{
  const raw=sessionStorage.getItem(FEEDBACK_STORAGE_KEY);if(!raw)return;
  const payload=JSON.parse(raw);
  if(payload.programm!=='Malenurk'||typeof payload.hindaja!=='string'||typeof payload.aeg!=='string'||!Array.isArray(payload.hinnangud)||payload.hinnangud.length!==8||!payload.hinnangud.every((item,i)=>item?.väide===criteria[i]&&Number.isInteger(item.punktid)&&item.punktid>=1&&item.punktid<=5)||!Array.isArray(payload.vastused)||payload.vastused.length!==4||!payload.vastused.every((item,i)=>item?.küsimus===openQuestions[i]&&typeof item.vastus==='string'))throw Error('Invalid feedback');
  const assessments=Object.fromEntries(Object.entries(payload.ülesanneteSobivus||{}).filter(([id,value])=>PUZZLES.some(p=>p.id===id)&&['','sobib','kohandada','ei-sobi'].includes(value)));
  state.savedFeedback={...payload,ülesanneteSobivus:assessments};
  state.feedback=feedbackFields(state.savedFeedback);state.assessment={...assessments};
 }catch{state.feedbackError='Salvestatud hinnangu taastamine ei õnnestunud. Võid vormi uuesti täita ja salvestada.';}
}
function feedbackIsSaved(){return Boolean(state.savedFeedback&&!state.feedbackDirty&&!state.feedbackError);}
function updateFeedbackStatus(){
 const button=$('#feedback-submit');if(!button)return;
 const saved=feedbackIsSaved();button.textContent=saved?'Hinnang salvestatud':'Saadan oma tagasiside';
 $('#feedback-saved').hidden=!saved;$('#feedback-dirty').hidden=!state.feedbackDirty;
 document.querySelectorAll('#feedback-downloads button').forEach(button=>button.disabled=!saved);
}
function markFeedbackChanged(){
 state.feedbackDirty=true;state.feedbackError='';
 const status=$('#form-status');if(status){status.textContent='';status.classList.remove('error');}
 updateFeedbackStatus();
}
function expertPage(){
 const f=state.feedback;
 return `<section class="page feedback-page"><div class="eyebrow">Sinu arvamus aitab edasi</div><h1>Tagasiside</h1><p class="page-intro">Hinda palun iga väidet skaalal 1–5, kus 1 = ei nõustu ja 5 = nõustun täielikult.</p><p class="feedback-instruction">Küsimused 1–8 on kohustuslikud. Küsimustele 9–12 vastamine on vabatahtlik.</p><p class="feedback-audience">Sihtrühm on 9–12-aastased vähemalt kolm aastat malet õppinud noored.</p><aside class="contact-card"><p><strong>Lehe autor:</strong> Rasmus Pallum</p><p><strong>Kontakt:</strong> <a href="mailto:rasmus.pallum@gmail.com">rasmus.pallum@gmail.com</a></p></aside><div class="assessment-tip">Vastused salvestatakse kohalikult selle brauserivahelehe seanssi. Neid ei saadeta autorile. Salvestatud hinnang säilib lehe värskendamisel.</div><form id="expert-form" class="form-card" novalidate><label class="text-field author-field">Hindaja nimi või tähis (soovi korral)<input name="author" value="${esc(f.author||'')}" autocomplete="off"></label><p class="scale-label">1 – ei nõustu · 2 – pigem ei nõustu · 3 – osaliselt nõustun · 4 – pigem nõustun · 5 – nõustun täielikult</p>${criteria.map((q,i)=>`<fieldset id="question-${i+1}"><legend>${i+1}. ${q}</legend><div class="rating">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="rating${i}" value="${n}" required ${f['rating'+i]===String(n)?'checked':''}><span>${n}</span><span class="sr-only">${n} punkti</span></label>`).join('')}</div></fieldset>`).join('')}${openQuestions.map((q,i)=>`<label class="text-field" id="question-${i+9}">${i+9}. ${q}<textarea name="text${i}" rows="4">${esc(f['text'+i]||'')}</textarea></label>`).join('')}<div class="feedback-delivery"><h2>Salvesta oma hinnang</h2><p>Kinnitamine talletab vastused selles brauseriseansis. Pärast salvestamist saad hinnangu eraldi TXT- või CSV-failina alla laadida. Salvestamata muudatused kaovad lehe värskendamisel; salvestatud hinnang säilib vahelehe sulgemiseni.</p></div><div class="form-actions"><button class="btn primary" id="feedback-submit" type="submit">Saadan oma tagasiside</button></div><div id="feedback-saved" class="feedback-saved" hidden><p role="status">Aitäh! Hinnang on selles brauseriseansis talletatud.</p><div class="form-actions" id="feedback-downloads"><button class="btn" type="button" data-action="export-txt" disabled>Laadi alla .txt</button><button class="btn" type="button" data-action="export-csv" disabled>Laadi alla .csv</button></div></div><p class="feedback-dirty" id="feedback-dirty" role="status" hidden>Muudatused salvestamata</p><p class="form-status ${state.feedbackError?'error':''}" id="form-status" role="status" aria-live="polite">${esc(state.feedbackError)}</p></form></section>`;
}
function bindForms(){
 $('#coach-topic')?.addEventListener('change',e=>{state.coach.topic=e.target.value;const pos=window.scrollY;render();window.scrollTo(0,pos);});
 $('#coach-level')?.addEventListener('change',e=>{state.coach.level=e.target.value;const pos=window.scrollY;render();window.scrollTo(0,pos);});
 document.querySelectorAll('.assessment').forEach(el=>el.addEventListener('change',e=>{state.assessment[e.target.dataset.id]=e.target.value;markFeedbackChanged();}));
 const login=$('#login-form');
 if(login)login.addEventListener('submit',e=>{
  e.preventDefault();const input=login.elements.password;
  if(input.value==='male2026'){state.coachUnlocked=true;input.value='';navigate('coach');}
  else{input.setAttribute('aria-invalid','true');$('#login-status').textContent=input.value.trim()?'Vale parool. Proovi uuesti.':'Palun sisesta salasõna.';input.focus();}
 });
 const form=$('#expert-form');
 if(form){
  form.addEventListener('input',e=>{state.feedback=Object.fromEntries(new FormData(form));e.target.removeAttribute('aria-invalid');e.target.removeAttribute('aria-describedby');e.target.closest('fieldset,.text-field')?.querySelector('.question-error')?.remove();markFeedbackChanged();});
  form.addEventListener('submit',e=>{e.preventDefault();saveFeedback();});
  updateFeedbackStatus();
 }
}
function validateFeedback(){
 const form=$('#expert-form');if(!form)return null;
 state.feedback=Object.fromEntries(new FormData(form));
 form.querySelectorAll('.question-error').forEach(el=>el.remove());
 form.querySelectorAll('[aria-invalid]').forEach(el=>{el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');});
 for(let i=0;i<8;i++){
  if(!/^[1-5]$/.test(state.feedback['rating'+i]||'')){
   const input=form.querySelector(`[name="rating${i}"]`),status=$('#form-status');
   status.textContent=`Palun vali küsimusele ${i+1} üks hinne skaalal 1–5.`;
   const error=document.createElement('p');error.id='question-error';error.className='question-error';error.textContent=status.textContent;error.setAttribute('role','alert');input.closest('fieldset').append(error);
   status.classList.add('error');input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby','question-error');
   $('#question-'+(i+1)).scrollIntoView({block:'center'});input.focus({preventScroll:true});return null;
  }
 }
 $('#form-status').classList.remove('error');
 const f=state.feedback;
 return {programm:'Malenurk',versioon:'1.3',aeg:new Date().toISOString(),hindaja:f.author||'',skaala:'1 – ei nõustu; 5 – nõustun täielikult',hinnangud:criteria.map((q,i)=>({väide:q,punktid:Number(f['rating'+i])})),vastused:openQuestions.map((q,i)=>({küsimus:q,vastus:f['text'+i]||''})),ülesanneteSobivus:{...state.assessment}};
}
function saveFeedback(){
 const payload=validateFeedback();if(!payload)return;
 try{
  const serialized=JSON.stringify(payload);
  sessionStorage.setItem(FEEDBACK_STORAGE_KEY,serialized);
  if(sessionStorage.getItem(FEEDBACK_STORAGE_KEY)!==serialized)throw Error('Feedback was not stored');
  state.savedFeedback=payload;state.feedbackDirty=false;state.feedbackError='';
  $('#form-status').textContent='';
 }catch{
  state.feedbackDirty=true;state.feedbackError='Hinnangu salvestamine ei õnnestunud. Vastused on vormis alles. Palun proovi uuesti või luba brauseris seansiandmete salvestamine.';
  $('#form-status').textContent=state.feedbackError;$('#form-status').classList.add('error');
 }
 updateFeedbackStatus();
}
function downloadFeedback(type,payload){
 const answers=[...payload.hinnangud.map((item,i)=>[i+1,item.väide,String(item.punktid)]),...payload.vastused.map((item,i)=>[i+9,item.küsimus,item.vastus])];
 let text;
 if(type==='csv'){
  const rows=[['Number','Küsimus','Vastus'],...answers,['','Hindaja',payload.hindaja],['','Salvestatud',payload.aeg],...Object.entries(payload.ülesanneteSobivus).map(([id,value])=>['','Ülesande '+id+' sobivus',value])];
  text=rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(';')).join('\r\n')+'\r\n';
 }else{
  text=`MALENURK · TAGASISIDE\nHindaja: ${payload.hindaja||'Märkimata'}\nSalvestatud: ${new Date(payload.aeg).toLocaleString('et-EE')}\nSkaala: ${payload.skaala}\n\n${answers.map(([n,question,answer])=>`${n}. ${question}\n${n<=8?'Hinnang: '+answer+'/5':answer}`).join('\n\n')}\n\nÜLESANNETE SOBIVUS\n${Object.entries(payload.ülesanneteSobivus).map(([id,a])=>`${id}: ${a}`).join('\n')||'Üksikülesannete hinnanguid ei lisatud.'}\n`;
 }
 const url=URL.createObjectURL(new Blob(['\ufeff',text],{type:type==='csv'?'text/csv;charset=utf-8':'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=`malenurk-tagasiside.${type}`;a.hidden=true;document.body.append(a);a.click();
 setTimeout(()=>{a.remove();URL.revokeObjectURL(url);},60000);
}
function exportFeedback(type){
 if(!['txt','csv'].includes(type)||!feedbackIsSaved())return;
 downloadFeedback(type,state.savedFeedback);
}

function showDialog(type){if(type==='help'){navigate('instructions');return;}const content=`<h2>Malenurgast</h2><p>Versioon 1.3 · ${PUZZLES.length} Lichessi CC0 andmebaasist hangitud ülesannet seitsmel teemal. Igas teema ja taseme kombinatsioonis on viis eri partiist pärit seisu. Peegeldusi ega värvivahetusi arvu täitmiseks ei kasutata.</p><p style="margin-top:12px">Keskmine tase keskendub ühele taktikalisele ideele. Tugev tase lisab vastukäigu või malendite koostöö. Iga teema raskusastmeid eristavad allika reiting, idee, kaitsete arv ja lahenduse pikkus. Väga tugevates ülesannetes tuleb sagedamini arvestada mitme jätkuga. Raskusastmed ei ole ametlik reiting; need vajavad treeneri ja sihtrühma õpilaste hinnangut.</p><p style="margin-top:12px">Mattides aktsepteeritakse kõiki kontrollitud matilahendusi. Teistes ülesannetes kontrollitakse küsimuses nimetatud konkreetset taktikalist eesmärki. See ei ole vabamängu analüüsimootor.</p><p style="margin-top:12px">Käikude seaduslikkust ning šahhi ja matti kontrollib HTML-i sisse pakitud chess.js 1.4.0 (BSD-2-Clause). Programm ei vaja serverit, kontot ega internetiühendust. Litsentsitekst asub faili lähtekoodis ja kaasasolevas README-failis.</p><p style="margin-top:12px">Õpetaja eksperdihinnangut ei ole veel kogutud. Autori tegelik roll, tema sisulised kontrollid ning tagasiside järel tehtud muudatused tuleb töö dokumentatsioonis eraldi kirjeldada.</p>`;$('#modal-content').innerHTML=`<button class="close" data-action="close-dialog" aria-label="Sulge aken">×</button>${content}<button class="btn primary" data-action="close-dialog" style="margin-top:22px">Selge ${icon('check')}</button>`;$('#modal').showModal();}
function navigate(page){if(state.page==='play'&&state.session&&!state.session.current.recorded){state.pendingPage=page;$('#leave').showModal();return;}state.page=page;render();window.scrollTo(0,0);}
function resetCurrent(){const r=state.session.current;const hints=r.hints,mistakes=r.mistakes;loadPuzzle();Object.assign(state.session.current,{hints,mistakes,feedback:'Algseis on taastatud. Avatud vihjed ja senised katsed jäävad alles.'});refreshPlay();}
document.addEventListener('click',e=>{
 const sq=e.target.closest('[data-square]');if(sq){squareClick(sq.dataset.square);return;}
 const el=e.target.closest('[data-action]');if(!el||el.disabled)return;const a=el.dataset.action,v=el.dataset.value;
 if(a==='home')navigate('home');else if(a==='exercises')navigate('exercises');else if(a==='instructions')navigate('instructions');else if(a==='coach')navigate('coach');else if(a==='expert')navigate('expert');else if(a==='help'||a==='about')showDialog(a);
 else if(a==='setup')navigate('exercises');
 else if(a==='coach-logout'){state.coachUnlocked=false;navigate('coach-login');}
 else if(['level','topic','count'].includes(a)){const pos=window.scrollY;state.config[a]=v;render();window.scrollTo(0,pos);}
 else if(a==='start')startSession();else if(a==='demo')startSession([demoPuzzle()]);
 else if(a==='one'||a==='coach-start'){if(!state.coachUnlocked)navigate('coach');else startSession(a==='one'?[PUZZLES.find(p=>p.id===v)]:getPool(state.coach));}
 else if(a==='hint'){const r=state.session.current;if(r.hints<currentPuzzle().hints.length)r.hints++;refreshPlay();}
 else if(a==='reveal')reveal();else if(a==='flip'){state.orientation=state.orientation==='w'?'b':'w';refreshPlay();}
 else if(a==='reset')resetCurrent();
 else if(a==='next'){if(state.session.index===state.session.puzzles.length-1){state.page='results';render();window.scrollTo(0,0);}else{state.session.index++;loadPuzzle();render();window.scrollTo(0,0);}}
 else if(a==='again')startSession(state.session.puzzles);
 else if(a==='harder'){const max=Math.max(...state.session.puzzles.map(p=>p.level));state.config={...state.session.config,level:String(Math.min(2,max+1))};navigate('exercises');}
 else if(a==='repeat-hard'){const hard=new Set(state.session.results.filter(r=>!r.correct||r.hints||r.mistakes).map(r=>r.topic));if(!hard.size){state.config={level:'2',topic:'all',count:'5'};navigate('exercises');}else startSession(PUZZLES.filter(p=>hard.has(p.topic)).sort((a,b)=>a.level-b.level));}
 else if(a==='close-dialog')$('#modal').close();
 else if(a==='promote'){const pending=pendingPromotion;pendingPromotion=null;$('#promotion').close();if(pending)tryMove(pending.from,pending.to,v);}
 else if(a==='cancel-promotion'){pendingPromotion=null;$('#promotion').close();}
 else if(a==='leave-stay')$('#leave').close();
 else if(a==='leave-confirm'){$('#leave').close();state.page=state.pendingPage||'home';state.session=null;state.selected=null;render();window.scrollTo(0,0);}
 else if(a==='export-txt')exportFeedback('txt');
 else if(a==='export-csv')exportFeedback('csv');
});
document.addEventListener('dragstart',e=>{const sq=e.target.closest('[data-square]');if(!sq)return;const p=state.game?.get(sq.dataset.square);if(!p||p.color!==state.game.turn()){e.preventDefault();return;}state.drag=sq.dataset.square;e.dataTransfer.setData('text/plain',sq.dataset.square);e.dataTransfer.effectAllowed='move';});
document.addEventListener('dragover',e=>{if(e.target.closest('[data-square]'))e.preventDefault();});
document.addEventListener('drop',e=>{const sq=e.target.closest('[data-square]');if(!sq||!state.drag)return;e.preventDefault();const from=state.drag;state.drag=null;if(from===sq.dataset.square)return;state.selected=from;squareClick(sq.dataset.square);});
document.addEventListener('dragend',()=>state.drag=null);
document.addEventListener('keydown',e=>{const sq=e.target.closest?.('[data-square]');if(!sq)return;if(e.key==='Escape'){state.selected=null;refreshPlay();return;}const deltas={ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8};if(!(e.key in deltas))return;e.preventDefault();const all=[...document.querySelectorAll('[data-square]')],i=all.indexOf(sq),j=i+deltas[e.key];if(j>=0&&j<64&&(Math.abs(deltas[e.key])!==1||Math.floor(j/8)===Math.floor(i/8)))all[j].focus();});
$('#promotion').addEventListener('cancel',()=>{pendingPromotion=null;});
restoreFeedback();
render();
