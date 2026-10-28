const assert=require('node:assert/strict'),path=require('node:path'),{spawnSync}=require('node:child_process');
const dir=__dirname;
function run(mutation){
 const script=`const Module=require('node:module');const data=structuredClone(require('./data.cjs'));const proof=structuredClone(require('./audit-report.json'));${mutation};const load=Module._load;Module._load=function(id,...args){if(id==='./data.cjs')return data;if(id==='./audit-report.json')return proof;return load.call(this,id,...args);};require('./validate.cjs').integrity();`;
 return spawnSync(process.execPath,['-e',script],{cwd:dir,encoding:'utf8'});
}
assert.equal(run('').status,0,'Valid bank must pass');
for(const [name,mutation] of [
 ['wrong total','data.PUZZLES.pop()'],
 ['wrong cell count','data.PUZZLES[0].level=1'],
 ['duplicate ID','data.PUZZLES[1].id=data.PUZZLES[0].id'],
 ['duplicate position','data.PUZZLES[1].fen=data.PUZZLES[0].fen'],
 ['color-swapped rotated position',"const {Chess}=require('./chess.cjs');const c=new Chess(data.PUZZLES[0].fen),rows=Array.from({length:8},()=>Array(8).fill(null));for(const p of c.board().flat().filter(Boolean)){const f=p.square.charCodeAt(0)-97,r=Number(p.square[1])-1;rows[r][7-f]=p.color==='w'?p.type:p.type.toUpperCase();}const fen=rows.map(row=>{let text='',empty=0;for(const s of row){if(!s)empty++;else{if(empty)text+=empty;empty=0;text+=s;}}return text+(empty||'');}).join('/')+' '+(c.turn()==='w'?'b':'w')+' - - 0 1';data.PUZZLES[1].fen=fen"],
 ['unverified puzzle',"data.PUZZLES[0].checks.status='unverified'"],
 ['failed independent audit',"proof.puzzles[0].status='failed'"],
 ['stale proof after content edit',"data.PUZZLES[0].question+=' changed'"],
 ['missing audit','proof.puzzles.pop()']
]){const result=run(mutation);assert.notEqual(result.status,0,name+' must block publication');console.log('PASS publication gate rejects '+name);}
console.log('PASS: valid bank accepted; nine invalid-bank scenarios blocked without modifying project data.');
