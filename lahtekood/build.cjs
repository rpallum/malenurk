const fs=require('node:fs');
const path=require('node:path');
const dir=__dirname;
const read=n=>fs.readFileSync(path.join(dir,n),'utf8');
const data=JSON.parse(read('checked-data.json'));
require('./validate.cjs').integrity(data);
const license=read('LICENSE-chess.txt');
const html=`<!doctype html>
<html lang="et"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Malenurk – eestikeelsed maleharjutused vähemalt kolm aastat malet õppinud 9–12-aastastele. ${data.PUZZLES.length} ülesannet, vihjed ja treeneri vaade. Töötab ka internetita."><meta name="theme-color" content="#243c2d"><title>Malenurk – iga käik loeb</title><style>${read('style.css')}</style></head><body>
<div id="app"></div><noscript><p>Malenurk vajab JavaScripti. Luba see brauseri seadetes ja ava fail uuesti.</p></noscript>
<dialog id="modal" aria-label="Malenurga juhised"><div id="modal-content"></div></dialog>
<dialog id="promotion" aria-label="Etturi muundamine"><div id="promotion-content"></div></dialog>
<dialog id="leave" aria-labelledby="leave-title"><h2 id="leave-title">Lõpetad selle harjutuskorra?</h2><p>Pooleliolev harjutuskord ja selle tulemused lähevad kaotsi. Võid ka lauale tagasi minna ning jätkata.</p><div class="leave-actions"><button class="btn primary" data-action="leave-stay">Jätka harjutamist</button><button class="btn" data-action="leave-confirm">Lõpeta harjutuskord</button></div></dialog>
<!-- chess.js 1.4.0 is bundled locally for move validation; no runtime network requests.
${license}
-->
<script>
(function(){const exports={};
${read('chess.cjs').replace(/\/\/# sourceMappingURL=.*$/gm,'')}
window.Chess=exports.Chess;
})();
const MALENURK_DATA=${JSON.stringify(data).replace(/</g,'\\u003c')};
${read('app.js')}
</script></body></html>`;
const outputs=process.argv[2]?[path.resolve(process.argv[2])]:[path.resolve(dir,'../Malenurk.html'),path.resolve(dir,'../index.html')];
for(const output of outputs){
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,html);
 console.log('Built '+output+' · '+Math.round(Buffer.byteLength(html)/1024)+' KB · all dependencies inline.');
}
