const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {Chess,validateFen}=require('./chess.cjs');
const {PUZZLES,TOPICS}=require('./data.cjs');
const {keys,mates}=require('./probe.cjs');
const uci=m=>m.from+m.to+(m.promotion||'');
const play=(c,m)=>c.move({from:m.slice(0,2),to:m.slice(2,4),promotion:m[4]||'q'});
const values={p:1,n:3,b:3,r:5,q:9,k:0};
function balance(c,side){return c.board().flat().filter(Boolean).reduce((s,p)=>s+(p.color===side?1:-1)*values[p.type],0);}
const report=[];
for(const p of PUZZLES){
 assert.ok(validateFen(p.fen).ok,p.id);const c=new Chess(p.fen),side=c.turn(),enemy=side==='w'?'b':'w';
 const king=c.board().flat().find(x=>x?.type==='k'&&x.color===enemy);assert.ok(!c.isAttacked(king.square,side),p.id+' opponent already in check');
 const before=balance(c,side);const startedInCheck=c.isCheck();const legalBefore=c.moves().length;
 const first=play(c,p.solution[0]);assert.ok(first,p.id);
 const r=p.rule; if(r.check)assert.ok(c.isCheck(),p.id+' must check');
 if(r.kind==='mate1'){assert.ok(c.isCheckmate(),p.id+' must mate');c.undo();p.accepted=mates(c).map(m=>{const x=c.move(m);c.undo();return uci(x);});play(c,p.solution[0]);}
 if(r.kind==='mate2'){
  c.undo();assert.equal(mates(c).length,0,p.id+' already mate in one');const tree={};
  for(const [m,branches] of keys(c)){const key=uci(c.move(m));c.undo();tree[key]={};for(const [reply,ms] of branches){c.move(m);const rep=uci(c.move(reply));tree[key][rep]=ms.map(x=>{const z=uci(c.move(x));c.undo();return z;});c.undo();c.undo();}}
  assert.ok(tree[p.solution[0]],p.id+' sample key invalid');p.mateTree=tree;play(c,p.solution[0]);
 }
 if(r.targets){for(const target of r.targets)assert.ok(c.attackers(target,side).includes(first.to),p.id+' missed target '+target);}
 if(r.kind==='discovered')assert.ok(c.attackers(r.target,side).includes(r.attacker),p.id+' no discovered attack');
 if(r.kind==='pin'){
  assert.ok(c.attackers(r.front,side).includes(first.to),p.id+' no pressure on pinned piece');const front=c.remove(r.front);assert.ok(c.attackers(r.back,side).includes(first.to),p.id+' not aligned');c.put(front,r.front);
 }
 if(r.captured)assert.equal(first.captured,r.captured,p.id+' capture');
 if(r.kind==='defence'){assert.ok(startedInCheck,p.id+' must be a check evasion');if(r.only)assert.equal(legalBefore,1,p.id+' not unique');}
 if(r.kind==='air'){
  play(c,r.threat);assert.ok(c.isCheck(),p.id+' threat must check');play(c,r.escape);assert.ok(!c.isCheck(),p.id+' escape failed');c.undo();c.undo();
  for(const m of r.alternatives){const a=new Chess(p.fen);play(a,m);play(a,r.threat);play(a,r.escape);}
 }
 if(r.kind==='material-line'){
  // Ka eelnevalt määramata kaitsed peavad säilitama kirjeldatud materjalivõidu.
  const root=new Chess(p.fen);let leaves=0;
  function checkAllDefences(position,ply){
   if(ply===p.solution.length){assert.ok(balance(position,side)-before>=r.minGain,p.id+' alternate defence loses material gain');leaves++;return;}
   if(position.turn()===side){play(position,p.solution[ply]);checkAllDefences(position,ply+1);position.undo();}
   else for(const m of position.moves()){position.move(m);checkAllDefences(position,ply+1);position.undo();}
  }
  checkAllDefences(root,0);assert.ok(leaves>0);p.checkedDefenceLeaves=leaves;
 }
 for(const m of p.solution.slice(1))play(c,m);
 if(r.kind==='mate2')assert.ok(c.isCheckmate(),p.id+' final move not mate');
 if(r.minGain)assert.ok(balance(c,side)-before>=r.minGain,p.id+' material gain');
 p.accepted=p.accepted||[p.solution[0],...(r.alternatives||[])];
 report.push({id:p.id,topic:p.topic,level:p.level,plies:p.solution.length,legal:true,goal:true,alternatives:r.kind==='mate2'?Object.keys(p.mateTree).length:p.accepted.length});
}
assert.ok(PUZZLES.length>=28);for(const t of TOPICS)for(const level of [0,1,2])assert.ok(PUZZLES.some(p=>p.topic===t.id&&p.level===level));
fs.writeFileSync(path.join(__dirname,'checked-data.json'),JSON.stringify({TOPICS,PUZZLES,LEVELS:['Keskmine','Tugev','Väga tugev']},null,2));
fs.writeFileSync(path.join(__dirname,'validation.json'),JSON.stringify(report,null,2));
console.log(`PASS: ${PUZZLES.length} legal positions; all solution plies, all mate-in-two defences, tactical goals, material gains, 7 themes × 3 levels.`);
