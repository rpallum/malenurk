const TOPICS=[
 ['mate1','Matt ühe käiguga','Leia otsustav käik.','crown'],
 ['mate2','Matt kahe käiguga','Mõtle vastusest kaugemale.','flag'],
 ['fork','Kahvel','Üks malend, mitu sihtmärki.','fork'],
 ['pin','Sidumine','Märka malendite taga olevaid nuppe.','pin'],
 ['double','Topeltrünnak','Loo kaks ähvardust korraga.','target'],
 ['material','Materjalivõit','Arvuta, enne kui lööd.','diamond'],
 ['defence','Rünnak ja kaitse','Leia vastase plaanile vastus.','shield']
].map(([id,name,description,icon])=>({id,name,description,icon}));
const LEVELS=['Keskmine','Tugev','Väga tugev'];
const PUZZLES=require('./puzzles.json');
module.exports={TOPICS,LEVELS,PUZZLES};
