const {Chess}=require('./chess.cjs');
function fen(spec,turn='w') {
 const rows=Array.from({length:8},()=>Array(8).fill(''));
 for(const token of spec.split(/\s+/)){const [piece,sq]=token.split(':');rows[8-Number(sq[1])][sq.charCodeAt(0)-97]=piece;}
 return rows.map(r=>{let s='',n=0;for(const p of r){if(!p)n++;else{if(n)s+=n;n=0;s+=p;}}return s+(n||'');}).join('/')+` ${turn} - - 0 1`;
}
function mates(c){return c.moves().filter(m=>{c.move(m);const yes=c.isCheckmate();c.undo();return yes;});}
function keys(c){const out=[];for(const m of c.moves()) {c.move(m);if(c.isCheckmate()){c.undo();continue;}const replies=c.moves();let good=replies.length>0;const branches=[];for(const r of replies){c.move(r);const ms=mates(c);c.undo();if(!ms.length){good=false;break;}branches.push([r,ms]);}c.undo();if(good)out.push([m,branches]);}return out;}
if(require.main===module){
 for(const spec of ['K:f6 Q:e5 k:h8','K:f6 Q:e4 k:h8','K:f6 Q:d4 k:h8','K:g1 Q:e6 N:h6 k:h8 r:f8 p:g7 p:h7','K:c6 Q:a5 k:a8','K:f6 Q:h3 k:h8']) {
  const c=new Chess(fen(spec));console.log(spec,'mate1',mates(c),'mate2',JSON.stringify(keys(c)));
 }
}
module.exports={fen,mates,keys};
