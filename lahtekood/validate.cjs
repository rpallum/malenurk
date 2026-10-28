const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {Chess,validateFen}=require('./chess.cjs');
const {PUZZLES,TOPICS,LEVELS}=require('./data.cjs');
const audit=require('./audit-report.json');
const manifest=require('./source-manifest.json');
const {keys,mates}=require('./probe.cjs');
const uci=m=>m.from+m.to+(m.promotion||'');
const play=(c,u)=>c.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]||'q'});
const sorted=v=>Array.isArray(v)?v.map(sorted):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sorted(v[k])])):v;
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(sorted(v))).digest('hex');
const core=p=>Object.fromEntries(['id','source','topic','level','fen','turn','solution','rule','title','question','hints','explanation','difficulty'].map(k=>[k,p[k]]));
const values={p:1,n:3,b:3,r:5,q:9,k:0};
const numeric=x=>x.scoreCp!==null?x.scoreCp:x.mate>0?100000-Math.abs(x.mate):-100000+Math.abs(x.mate);
const balance=(c,side)=>c.board().flat().filter(Boolean).reduce((sum,p)=>sum+(p.color===side?1:-1)*values[p.type],0);
function canonical(c){
 const all=[];
 for(const swap of [false,true])for(let transform=0;transform<8;transform++){
  const pieces=c.board().flat().filter(Boolean).map(p=>{let f=p.square.charCodeAt(0)-97,r=Number(p.square[1])-1;if(transform&1)[f,r]=[r,f];if(transform&2)f=7-f;if(transform&4)r=7-r;let s=p.color==='w'?p.type.toUpperCase():p.type;if(swap)s=s===s.toLowerCase()?s.toUpperCase():s.toLowerCase();return s+String.fromCharCode(97+f)+(r+1);});
  all.push(pieces.sort().join(' ')+(swap?(c.turn()==='w'?' b':' w'):' '+c.turn()));
 }
 return all.sort()[0];
}
function integrity(checked){
 assert.equal(PUZZLES.length,105,'Exactly 105 puzzles required');assert.equal(TOPICS.length,7);assert.equal(LEVELS.length,3);assert.equal(audit.puzzles.length,105);
 const reports=new Map(audit.puzzles.map(p=>[p.id,p]));assert.equal(reports.size,105);
 const csv=fs.readFileSync(path.join(__dirname,'lichess-source.csv'),'utf8').trim().split(/\r?\n/).map(line=>line.split(','));const columns=csv.shift();assert.equal(csv.length,105);assert.ok(csv.every(row=>row.length===columns.length));const rows=new Map(csv.map(row=>{const r=Object.fromEntries(columns.map((key,i)=>[key,row[i]]));return [r.PuzzleId,r];}));assert.equal(rows.size,105);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'lichess-source.csv'))).digest('hex'),manifest.sourceCsvSha256);
 for(const t of TOPICS)for(let l=0;l<3;l++)assert.equal(PUZZLES.filter(p=>p.topic===t.id&&p.level===l).length,5,t.id+' '+l);
 const ids=new Set(),sources=new Set(),positions=new Set(),games=new Set();
 for(const p of PUZZLES){
  assert.ok(!ids.has(p.id));ids.add(p.id);assert.ok(!sources.has(p.source.id));sources.add(p.source.id);
  const game=p.source.gameUrl.match(/lichess\.org\/([A-Za-z0-9]{8})/)[1];assert.ok(!games.has(game),'Repeated game');games.add(game);
  const key=canonical(new Chess(p.fen));assert.ok(!positions.has(key),'Repeated or transformed position '+p.id);positions.add(key);
  const proof=reports.get(p.id);assert.equal(proof?.status,'passed',p.id+' missing audit');assert.equal(p.checks.status,'passed');assert.equal(proof.dataSha256,hash(core(p)),p.id+' stale audit');assert.equal(p.checks.dataSha256,proof.dataSha256);assert.equal(proof.canonical,key);
  assert.ok(proof.pythonChess.fenValid&&proof.pythonChess.allPliesLegal&&proof.pythonChess.kingSafety);assert.ok(proof.engine.id.name.startsWith('Stockfish '));assert.ok(proof.engine.positions.length);
  assert.equal(p.source.license,'CC0-1.0');assert.equal(p.source.url,'https://lichess.org/training/'+p.source.id);assert.equal(p.source.retrieved,manifest.retrieved);assert.match(p.source.retrieved,/^\d{4}-\d{2}-\d{2}$/);assert.equal(p.hints.length,2);assert.ok(p.hints.every(x=>x.length>25));assert.ok(p.explanation.length>60);assert.ok(!p.hints[0].includes(p.solution[0]));
  if(proof.exhaustiveMate){assert.deepEqual(p.accepted,proof.exhaustiveMate.accepted);if(p.mateTree)assert.deepEqual(p.mateTree,proof.exhaustiveMate.tree);}
  const row=rows.get(p.source.id);assert.ok(row);assert.equal(p.source.sourceFen,row.FEN);assert.deepEqual(p.source.sourceMoves,row.Moves.split(' '));assert.equal(p.source.rating,Number(row.Rating));assert.equal(p.source.gameUrl,row.GameUrl);assert.deepEqual(p.source.themes,row.Themes.split(' '));
 }
 if(checked){assert.equal(checked.PUZZLES.length,105);for(let i=0;i<105;i++){const c=checked.PUZZLES[i],p=PUZZLES[i];assert.equal(hash(core(c)),hash(core(p)));assert.equal(c.checks.chessJs,true);assert.deepEqual(c.accepted,p.accepted);assert.deepEqual(c.mateTree,p.mateTree);}}
 return reports;
}
function pin(c,r,side){
 const enemy=side==='w'?'b':'w';assert.equal(c.get(r.attacker).color,side);assert.equal(c.get(r.front).color,enemy);assert.equal(c.get(r.back).color,enemy);assert.ok(['k','q'].includes(c.get(r.back).type));assert.ok(c.attackers(r.front,side).includes(r.attacker));const p=c.remove(r.front);assert.ok(c.attackers(r.back,side).includes(r.attacker));c.put(p,r.front);
}
function materialTree(p){
 const c=new Chess(p.fen),side=c.turn(),before=balance(c,side);let leaves=0,minimum=99;
 function visit(ply){
  assert.ok(leaves<=1501);
  if(ply===p.solution.length){const replies=c.moves({verbose:true});assert.ok(replies.length);for(const m of replies){c.move(m);const gain=balance(c,side)-before;c.undo();assert.ok(gain>=p.rule.minGain,p.id+' material refuted');minimum=Math.min(minimum,gain);leaves++;}return;}
  if(c.turn()===side){play(c,p.solution[ply]);visit(ply+1);c.undo();}else{const replies=c.moves({verbose:true});assert.ok(replies.length);for(const m of replies){c.move(m);visit(ply+1);c.undo();}}
 }
 visit(0);assert.equal(leaves,p.rule.materialProof.defenceLeaves);assert.equal(minimum,p.rule.minGain);return leaves;
}
function validate(){
 const reports=integrity(),validation=[];
 for(const p of PUZZLES){
  assert.ok(validateFen(p.source.sourceFen).ok);const source=new Chess(p.source.sourceFen);play(source,p.source.preparation);assert.equal(source.fen(),p.fen,p.id+' preparation');assert.deepEqual(p.source.sourceMoves.slice(1),p.solution);
  const c=new Chess(p.fen),side=c.turn(),enemy=side==='w'?'b':'w',initial=c.fen(),report=reports.get(p.id),r=p.rule;assert.equal(side,p.turn);assert.ok(validateFen(p.fen).ok);assert.ok(!c.isAttacked(c.board().flat().find(x=>x?.type==='k'&&x.color===enemy).square,side));
  const initialLegal=c.moves().length,inCheck=c.isCheck();if(r.kind==='pin'&&r.mode!=='create')pin(c,r,side);
  const first=play(c,p.solution[0]);
  if(r.kind==='fork'){assert.ok(r.targets.length>=2);for(const t of r.targets){assert.equal(c.get(t).color,enemy);assert.ok(c.get(t).type==='k'||values[c.get(t).type]>=3);assert.ok(c.attackers(t,side).includes(first.to));}}
  if(r.kind==='pin'){
   if(r.mode==='create'){assert.equal(first.to,r.attacker);pin(c,r,side);}
   else if(r.mode==='capture-pinned')assert.equal(first.to,r.front);
   else{assert.equal(new Chess(initial).get(r.back).type,'k');assert.ok(first.captured);assert.ok(new Chess(initial).attackers(first.to,enemy).includes(r.front));assert.ok(!c.moves({square:r.front,verbose:true}).some(m=>m.to===first.to));}
  }
  if(r.kind==='double'){assert.notEqual(r.target,r.otherTarget);assert.notEqual(r.attacker,r.movingAttacker);assert.ok(c.attackers(r.target,side).includes(r.attacker));assert.ok(!new Chess(initial).attackers(r.target,side).includes(r.attacker));assert.ok(c.attackers(r.otherTarget,side).includes(r.movingAttacker));}
  if(r.kind==='defence'){assert.ok(inCheck);assert.ok(!c.isAttacked(c.board().flat().find(x=>x?.type==='k'&&x.color===side).square,enemy));if(r.only)assert.equal(initialLegal,1);}
  if(r.kind==='mate1'){assert.ok(c.isCheckmate());const root=new Chess(initial),all=mates(root).map(san=>{const m=root.move(san);root.undo();return uci(m);});assert.deepEqual([...p.accepted].sort(),all.sort());}
  if(r.kind==='mate2'){
   const root=new Chess(initial),tree={};assert.equal(mates(root).length,0);
   for(const [key,replies] of keys(root)){const u=uci(root.move(key));root.undo();tree[u]={};for(const [reply,ends] of replies){root.move(key);const rep=uci(root.move(reply));tree[u][rep]=ends.map(end=>{const v=uci(root.move(end));root.undo();return v;}).sort();root.undo();root.undo();}}
   const normalized=Object.fromEntries(Object.entries(p.mateTree).map(([key,replies])=>[key,Object.fromEntries(Object.entries(replies).map(([reply,ends])=>[reply,[...ends].sort()]))]));assert.deepEqual(sorted(tree),sorted(normalized));assert.deepEqual([...p.accepted].sort(),Object.keys(tree).sort());
  }
  for(const u of p.solution.slice(1))play(c,u);if(r.kind==='mate2')assert.ok(c.isCheckmate());const materialLeaves=r.kind==='material'?materialTree(p):0;
  const positions=report.engine.positions;
  if(!['mate1','mate2'].includes(r.kind)){assert.equal(positions.filter(x=>x.kind==='student').length,(p.solution.length+1)/2);assert.equal(positions.filter(x=>x.kind==='all-legal-defences').length,(p.solution.length-1)/2);}
  for(const pos of positions){
   const at=new Chess(p.fen);for(const m of p.solution.slice(0,pos.kind==='all-legal-defences'?pos.ply+1:pos.ply||0))play(at,m);assert.equal(at.fen(),pos.fen);
   if(pos.kind==='all-legal-defences'){const legal=at.moves({verbose:true}).map(uci).sort();assert.deepEqual(pos.lines.map(x=>x.pv[0]).sort(),legal);assert.equal(pos.legalReplyCount,legal.length);}
   if(pos.kind==='student'){assert.equal(pos.lines[0].pv[0],p.solution[pos.ply]);assert.ok(numeric(pos.lines[0])>=(r.kind==='defence'?-50:180));if(pos.lines.length>1)assert.ok(numeric(pos.lines[0])-numeric(pos.lines[1])>=100);}
   if(pos.kind==='all-legal-defences')assert.ok(pos.lines.every(line=>numeric(line)>=(r.kind==='defence'?-80:150)));
   for(const line of pos.lines){assert.ok(line.nodes>0);assert.ok(line.depth>=(pos.kind==='student'?12:pos.kind==='all-legal-defences'?10:1));const branch=new Chess(pos.fen);for(const u of line.pv)play(branch,u);}
  }
  validation.push({id:p.id,source:p.source.url,topic:p.topic,level:p.level,status:'passed',dataSha256:report.dataSha256,chessJs:{legal:true,preparationCorrect:true,allSolutionPlies:true,goal:true,completeMateAlternatives:['mate1','mate2'].includes(r.kind),materialDefenceLeaves:materialLeaves},pythonChess:report.pythonChess.version,engine:report.engine.id.name,analysedPositions:positions.length});
 }
 fs.writeFileSync(path.join(__dirname,'checked-data.json'),JSON.stringify({TOPICS,LEVELS,PUZZLES:PUZZLES.map(p=>({...p,checks:{...p.checks,chessJs:true}}))},null,2));fs.writeFileSync(path.join(__dirname,'validation.json'),JSON.stringify(validation,null,2));
 console.log('PASS: 105 distinct sourced puzzles; exactly 5 in all 21 cells; chess.js + python-chess + Stockfish audit; all plies and complete mate defences.');
}
module.exports={integrity,validate,hash,core,canonical};if(require.main===module)validate();
