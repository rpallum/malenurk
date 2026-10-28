"""Independent legal/motif checks, exhaustive mates, and bounded Stockfish audit.
Run with a candidate pool (selection) or --recheck (the committed 105 source rows).
No analysis service is called by the pupil's browser.
"""
import csv, hashlib, json, os, re, sys, time
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.work/pydeps'))
import chess, chess.engine

DATE='2026-10-28'
TOPICS=['mate1','mate2','fork','pin','double','material','defence']
NAMES={'mate1':'Matt ühe käiguga','mate2':'Matt kahe käiguga','fork':'Kahvel','pin':'Sidumine','double':'Topeltrünnak','material':'Materjalivõit','defence':'Rünnak ja kaitse'}
PIECES={chess.PAWN:'ettur',chess.KNIGHT:'ratsu',chess.BISHOP:'oda',chess.ROOK:'vanker',chess.QUEEN:'lipp',chess.KING:'kuningas'}
VALUE={chess.PAWN:1,chess.KNIGHT:3,chess.BISHOP:3,chess.ROOK:5,chess.QUEEN:9,chess.KING:0}
ENGINE=Path(os.environ.get('STOCKFISH',ROOT/'.work/tools/stockfish/stockfish/stockfish-windows-x86-64-universal.exe'))

def digest(obj):return hashlib.sha256(json.dumps(obj,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def core(p):return {k:p[k] for k in ['id','source','topic','level','fen','turn','solution','rule','title','question','hints','explanation','difficulty']}
def material(b,side):return sum((1 if p.color==side else -1)*VALUE[p.piece_type] for p in b.piece_map().values())
def significant(b,side):return [s for s,p in b.piece_map().items() if p.color!=side and (p.piece_type==chess.KING or VALUE[p.piece_type]>=3)]
def label(b,s):return PIECES[b.piece_type_at(s)]+' '+chess.square_name(s)
def canonical(b):
    versions=[]
    for swap in [False,True]:
        for transform in range(8):
            pieces=[]
            for s,p in b.piece_map().items():
                f,r=chess.square_file(s),chess.square_rank(s)
                if transform&1:f,r=r,f
                if transform&2:f=7-f
                if transform&4:r=7-r
                symbol=p.symbol().swapcase() if swap else p.symbol()
                pieces.append(symbol+chess.square_name(chess.square(f,r)))
            versions.append(' '.join(sorted(pieces))+(' w' if b.turn!=swap else ' b'))
    return min(versions)
def pin_lines(b,side):
    out=[]
    for a,p in b.piece_map().items():
        if p.color!=side or p.piece_type not in [chess.BISHOP,chess.ROOK,chess.QUEEN]:continue
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]:
            if p.piece_type==chess.BISHOP and (dx==0 or dy==0):continue
            if p.piece_type==chess.ROOK and dx and dy:continue
            hits=[];f,r=chess.square_file(a)+dx,chess.square_rank(a)+dy
            while 0<=f<8 and 0<=r<8:
                sq=chess.square(f,r)
                if b.piece_at(sq):
                    hits.append(sq)
                    if len(hits)==2:break
                f+=dx;r+=dy
            if len(hits)==2 and all(b.color_at(s)!=side for s in hits) and b.piece_type_at(hits[1]) in [chess.KING,chess.QUEEN] and b.piece_type_at(hits[0])!=chess.KING:
                out.append({'attacker':chess.square_name(a),'front':chess.square_name(hits[0]),'back':chess.square_name(hits[1])})
    return out
def mates(b):
    out=[]
    for m in list(b.legal_moves):
        b.push(m)
        if b.is_checkmate():out.append(m.uci())
        b.pop()
    return out
def mate_tree(b):
    if mates(b):raise ValueError('mate in one already exists')
    tree={}
    for move in list(b.legal_moves):
        b.push(move);replies=list(b.legal_moves);branches={};good=bool(replies)
        for reply in replies:
            b.push(reply);ends=mates(b);b.pop()
            if not ends:good=False;break
            branches[reply.uci()]=ends
        b.pop()
        if good:tree[move.uci()]=branches
    return tree

def material_proof(board,line):
    side=board.turn;before=material(board,side);leaves=0;minimum=99
    def visit(b,ply):
        nonlocal leaves,minimum
        if leaves>1500:raise ValueError('material tree too broad')
        if ply==len(line):
            replies=list(b.legal_moves)
            if not replies:raise ValueError('terminal nonmaterial position')
            for reply in replies:
                b.push(reply);gain=material(b,side)-before;b.pop()
                if gain<2:raise ValueError('material gain not forced')
                minimum=min(minimum,gain);leaves+=1
            return
        if b.turn==side:
            move=chess.Move.from_uci(line[ply])
            if move not in b.legal_moves:raise ValueError('material plan fails against an alternative defence')
            b.push(move);visit(b,ply+1);b.pop()
        else:
            replies=list(b.legal_moves)
            if not replies:raise ValueError('premature terminal position')
            for move in replies:b.push(move);visit(b,ply+1);b.pop()
    visit(board.copy(),0)
    return {'minimumGain':minimum,'defenceLeaves':leaves,'includesReplyAfterLastStudentMove':True}

def motif(board,line,topic):
    side=board.turn;first=chess.Move.from_uci(line[0]);after=board.copy();after.push(first)
    if topic in ['mate1','mate2']:return {'kind':topic}
    if topic=='fork':
        targets=[s for s in significant(after,side) if s in after.attacks(first.to_square)]
        if len(targets)<2:raise ValueError('no actual fork')
        return {'kind':'fork','attacker':chess.square_name(first.to_square),'targets':[chess.square_name(s) for s in targets]}
    if topic=='pin':
        created=[p for p in pin_lines(after,side) if p['attacker']==chess.square_name(first.to_square)]
        if created:return {'kind':'pin','mode':'create',**created[0]}
        for p in pin_lines(board,side):
            front=chess.parse_square(p['front'])
            if board.piece_type_at(chess.parse_square(p['back']))!=chess.KING:continue
            if not board.is_pinned(not side,front):continue
            if first.to_square==front:return {'kind':'pin','mode':'capture-pinned',**p}
            if board.is_capture(first) and first.to_square in board.attacks(front) and not any(m.from_square==front and m.to_square==first.to_square for m in after.legal_moves):return {'kind':'pin','mode':'pinned-defender',**p}
        raise ValueError('pin is unrelated to the move')
    if topic=='double':
        moving=[s for s in significant(after,side) if s in after.attacks(first.to_square)]
        for a,p in after.piece_map().items():
            if a==first.to_square or p.color!=side or p.piece_type not in [chess.BISHOP,chess.ROOK,chess.QUEEN]:continue
            for target in significant(after,side):
                if target in after.attacks(a) and target not in board.attacks(a):
                    other=next((s for s in moving if s!=target),None)
                    if other is not None:return {'kind':'double','attacker':chess.square_name(a),'target':chess.square_name(target),'movingAttacker':chess.square_name(first.to_square),'otherTarget':chess.square_name(other)}
        raise ValueError('no two distinct actual threats')
    if topic=='material':
        proof=material_proof(board,line)
        return {'kind':'material','minGain':proof['minimumGain'],'materialProof':proof}
    if topic=='defence':
        if not board.is_check() or after.was_into_check():raise ValueError('not a verified check defence')
        return {'kind':'defence','only':board.legal_moves.count()==1}
    raise ValueError(topic)

def serialize_info(info,side):
    score=info['score'].pov(side)
    return {'depth':info.get('depth',0),'seldepth':info.get('seldepth',0),'nodes':info.get('nodes',0),'scoreCp':score.score(),'mate':score.mate(),'pv':[m.uci() for m in info.get('pv',[])]}
def analysis(engine,b,side,multipv,nodes=120000,depth=16):
    if b.is_game_over():return []
    infos=engine.analyse(b,chess.engine.Limit(nodes=nodes,depth=depth),multipv=min(multipv,b.legal_moves.count()))
    return [serialize_info(i,side) for i in infos]
def numeric(info):return info['scoreCp'] if info['scoreCp'] is not None else (100000-abs(info['mate']) if info['mate']>0 else -100000+abs(info['mate']))
def check_student(engine,b,move,side,topic,deep=False):
    result=analysis(engine,b,side,2,700000 if deep else 90000,20 if deep else 15)
    if not result or result[0]['pv'][0]!=move:raise ValueError('source answer differs from current best move')
    if numeric(result[0])<(-50 if topic=='defence' else 180):raise ValueError('result does not meet winning/defending objective')
    if len(result)>1 and numeric(result[0])-numeric(result[1])<100:raise ValueError('ambiguous student alternative')
    if deep and result[0]['depth']<12:raise ValueError('insufficient student depth')
    return result

def teaching(board,line,topic,rule,level,rating):
    first=chess.Move.from_uci(line[0]);piece=PIECES[board.piece_type_at(first.from_square)];start=chess.square_name(first.from_square)
    after=board.copy();san=[]
    for u in line:
        m=chess.Move.from_uci(u);s=after.san(m);s=re.sub(r'^[KQRBN]',lambda x:{'K':'K','Q':'L','R':'V','B':'O','N':'R'}[x[0]],s);s=re.sub(r'=([QRBN])',lambda x:'='+{'Q':'L','R':'V','B':'O','N':'R'}[x[1]],s);san.append(s);after.push(m)
    if topic=='mate1':
        question='Leia matt ühe käiguga.';h1='Vaata, millised põgenemisruudud on kuningalt ära võetud, ning võrdle võimalikke šahhe.'
        explanation='Käik '+san[0]+' annab mati: kuningas ei saa põgeneda, ründajat lüüa ega šahhi katta. Kõik seaduslikud matikäigud selles seisus on lubatud.'
    elif topic=='mate2':
        question='Sunni matt oma teisel käigul. Leia ka lõpetav käik pärast vastase kaitset.';h1='Võrdle šahhe ja kuninga põgenemisteid. Esimene käik peab jätma mativõimaluse iga kaitse vastu.'
        explanation='Näidisvariant '+', '.join(san)+' lõpeb matiga. Kõik lubatud algkäigud on kontrollitud iga seadusliku vastasekäigu vastu; ka sinu teine käik tuleb ise leida.'
    elif topic=='fork':
        targets=', '.join(label(board,chess.parse_square(s)) for s in rule['targets']);question='Loo kahvel ja lahenda kogu võitev käigujada.';h1='Otsi ühele malendile ruutu, kust ta saaks rünnata korraga kaht olulist sihtmärki.'
        explanation='Esimese käigu järel ründab '+piece+' korraga sihtmärke '+targets+'. Järgnev käigujada kasutab seda sundi: '+', '.join(san)+'.'
    elif topic=='pin':
        question='Kasuta sidumist ja lahenda kogu taktikaline käigujada.';h1='Vaata ründejooni, kus üks vastase malend varjab kuningat või lippu. Selline malend ei pruugi saada kaitsta naaberruutu.'
        explanation='Sidumise joon on '+rule['attacker']+'–'+rule['front']+'–'+rule['back']+'. '+({'create':'Esimene käik loob sidumise.','capture-pinned':'Esimene käik lööb seotud malendi.','pinned-defender':'Esimene käik kasutab seda, et kuningaga seotud kaitsja ei saa löögiruudule lahkuda.'}[rule['mode']])+' Kontrollitud jätk on '+', '.join(san)+'.'
    elif topic=='double':
        question='Loo avastatud topeltrünnak ja lahenda jätk lõpuni.';h1='Otsi malendit, mille liikumine avab teise oma malendi ründejoone ning tekitab ise uue ähvarduse.'
        explanation='Käik avab malendi '+rule['attacker']+' rünnaku ruudule '+rule['target']+' ning liikunud malend ründab ruutu '+rule['otherTarget']+'. Kaks eri ründajat loovad kaks eri sihtmärgile suunatud ähvardust. Jätk: '+', '.join(san)+'.'
    elif topic=='material':
        question='Leia käigujada, mis võidab vähemalt '+str(rule['minGain'])+' etturi väärtuses materjali.';h1='Võrdle lööke ja vastulööke. Arvesta kogu vahetusjada, mitte ainult esimest võidetud malendit.'
        explanation='Jada '+', '.join(san)+' võidab materjali. Ka teised seaduslikud kaitsed ja vastulöök pärast sinu viimast käiku jätavad kontrollitud plaanile vähemalt '+str(rule['minGain'])+' etturi suuruse materjalikasvu.'
    else:
        question=('Leia ainus seaduslik šahikaitse.' if rule['only'] else 'Tõrju šahh parimal viisil ja lahenda kaitsevariant lõpuni.');h1='Šahile vastates võrdle kuninga liikumist, ründaja löömist ja vahele käimist. Arvesta ka järgnevat ähvardust.'
        explanation='Algseisus on kuningas šahis. Esimene käik kõrvaldab selle ning kontrollitud jätk '+', '.join(san)+' säilitab kaitstava seisu. '+('Algseisus on täpselt üks seaduslik käik.' if rule['only'] else 'Teised seaduslikud kaitsed on mootoriga võrreldud; küsimus ei väida, et need oleksid kõik ebaseaduslikud.')
    h2='Uuri malendit '+piece+' ruudul '+start+'. '+('Muundumisel mõtle ka lipust erinevale valikule.' if first.promotion else 'Milline tema käik täidab küsimuses nimetatud eesmärgi?')
    return {'title':NAMES[topic]+' · '+start,'question':question,'hints':[h1,h2],'explanation':explanation,'difficulty':{'sourceRating':rating,'levelWithinTopic':level,'basis':'Allika reiting teema sees, seaduslike algkäikude ja kaitsete hulk, taktikaline motiiv ning õpilase käikude arv. Pole ametlik mängureiting.','legalChoices':board.legal_moves.count(),'studentMoves':(len(line)+1)//2,'checkingChoices':sum(board.gives_check(m) for m in board.legal_moves)}}

def audit_row(engine,row,topic,level):
    raw=chess.Board(row['FEN']);assert raw.is_valid();moves=row['Moves'].split();preparation=moves[0];raw.push_uci(preparation);board=raw.copy();assert board.is_valid()
    line=moves[1:]
    if not line or len(line)%2!=1:raise ValueError('source line does not end with a student move')
    side=board.turn;rule=motif(board,line,topic);states=[];b=board.copy();special=[]
    for i,u in enumerate(line):
        m=chess.Move.from_uci(u)
        if m not in b.legal_moves:raise ValueError('illegal solution move')
        flags={'ply':i,'move':u,'castling':b.is_castling(m),'enPassant':b.is_en_passant(m),'promotion':m.promotion}
        b.push(m)
        if not b.is_valid() or b.was_into_check():raise ValueError('king safety failed')
        special.append(flags)
    if topic=='mate1':
        if len(line)!=1 or not b.is_checkmate():raise ValueError('not mate in one')
        accepted=mates(board.copy());tree=None
    elif topic=='mate2':
        if len(line)!=3 or not b.is_checkmate():raise ValueError('not exact mate in two')
        tree=mate_tree(board.copy())
        if line[0] not in tree or line[1] not in tree[line[0]] or line[2] not in tree[line[0]][line[1]]:raise ValueError('sample not in exhaustive tree')
        accepted=list(tree)
    else:
        accepted=[line[0]];tree=None;b=board.copy()
        for ply,u in enumerate(line):
            if ply%2==0:check_student(engine,b,u,side,topic,False)
            b.push_uci(u)
        if b.is_game_over():raise ValueError('nonmate puzzle ends in a terminal position')
    engine.configure({'Clear Hash':None})
    if topic in ['mate1','mate2']:
        states.append({'fen':board.fen(),'kind':'root','lines':analysis(engine,board,side,3,700000,20)})
    else:
        b=board.copy()
        for ply,u in enumerate(line):
            if ply%2==0:
                infos=check_student(engine,b,u,side,topic,True);states.append({'fen':b.fen(),'kind':'student','ply':ply,'lines':infos})
            b.push_uci(u)
            if ply%2==0 and ply+1<len(line):
                count=b.legal_moves.count();infos=analysis(engine,b,side,count,2000000,18)
                if len(infos)!=count or min(x['depth'] for x in infos)<10:infos=analysis(engine,b,side,count,8000000,20)
                if len(infos)!=count or min(x['depth'] for x in infos)<10:raise ValueError('insufficient defence analysis')
                if line[ply+1] not in [x['pv'][0] for x in infos]:raise ValueError('missing source defence')
                if min(numeric(x) for x in infos)<(-80 if topic=='defence' else 150):raise ValueError('strong defence refutes result')
                states.append({'fen':b.fen(),'kind':'all-legal-defences','ply':ply,'legalReplyCount':count,'playedReply':line[ply+1],'lines':infos})
    source={'name':'Lichess open puzzle database','id':row['PuzzleId'],'url':'https://lichess.org/training/'+row['PuzzleId'],'database':'https://database.lichess.org/#puzzles','license':'CC0-1.0','retrieved':DATE,'rating':int(row['Rating']),'sourceFen':row['FEN'],'preparation':preparation,'sourceMoves':moves,'gameUrl':row['GameUrl'],'themes':row['Themes'].split()}
    puzzle={'id':'lichess-'+row['PuzzleId'],'source':source,'topic':topic,'level':level,'fen':board.fen(),'turn':'w' if side else 'b','solution':line,'rule':rule,**teaching(board,line,topic,rule,level,int(row['Rating'])),'accepted':accepted}
    if tree:puzzle['mateTree']=tree
    report={'id':puzzle['id'],'source':source,'topic':topic,'level':level,'status':'passed','pythonChess':{'version':chess.__version__,'fenValid':True,'allPliesLegal':True,'kingSafety':True,'specialMoves':special},'motif':rule,'canonical':canonical(board),'exhaustiveMate':{'accepted':accepted,'tree':tree} if topic in ['mate1','mate2'] else None,'engine':{'id':engine.id,'options':{'Threads':1,'Hash':128},'limits':{'studentNodes':700000,'studentDepth':20,'defenceNodes':2000000,'defenceDepth':18,'defenceEscalationNodes':8000000},'positions':states},'dataSha256':digest(core(puzzle))}
    puzzle['checks']={'status':'passed','pythonChess':chess.__version__,'engine':engine.id.get('name'),'report':'audit-report.json','dataSha256':report['dataSha256']}
    return puzzle,report

def main():
    global DATE
    cache=ROOT/'.work/audit-cache';cache.mkdir(parents=True,exist_ok=True)
    engine=chess.engine.SimpleEngine.popen_uci(str(ENGINE));engine.configure({'Threads':1,'Hash':128})
    print('Engine',engine.id,'python-chess',chess.__version__,flush=True)
    if '--recheck' in sys.argv:
        puzzles=json.loads((ROOT/'lahtekood/puzzles.json').read_text(encoding='utf-8'))
        DATE=puzzles[0]['source']['retrieved']
        with (ROOT/'lahtekood/lichess-source.csv').open(encoding='utf-8',newline='') as f:rows={r['PuzzleId']:r for r in csv.DictReader(f)}
        checked=[]
        try:
            for i,p in enumerate(puzzles,1):
                fresh,proof=audit_row(engine,rows[p['source']['id']],p['topic'],p['level'])
                assert digest(core(fresh))==digest(core(p)),p['id']+' content changed'
                assert fresh['accepted']==p['accepted'],p['id']+' accepted moves changed'
                if p['rule']['kind']=='mate2':assert fresh['mateTree']==p['mateTree']
                checked.append(proof)
                print('RECHECK',i,len(puzzles),p['id'],'passed',flush=True)
        finally:engine.quit()
        (ROOT/'.work/recheck-report.json').write_text(json.dumps({'status':'passed','count':len(checked),'puzzles':checked},ensure_ascii=False,indent=2),encoding='utf-8')
        return
    selected=[];reports=[];source_rows=[];seen=set();games=set();canon=set();rejections={}
    pool=json.loads((ROOT/'.work/candidates.json').read_text(encoding='utf-8'))
    DATE=pool['retrieved']
    try:
        for topic in TOPICS:
            for level in range(3):
                candidates=pool['pools'][topic+':'+str(level)]
                target=([800,1400,2000] if topic=='mate1' else [1150,1650,2200])[level]
                candidates=sorted(candidates,key=lambda r:abs(int(r['Rating'])-target))
                count=0
                for row in candidates:
                    game=row['GameUrl'].split('/')[-1].split('#')[0].split('/')[0]
                    # Lichess GameUrl can contain /black before its fragment.
                    game=re.search(r'lichess.org/([A-Za-z0-9]{8})',row['GameUrl']).group(1)
                    if row['PuzzleId'] in seen or game in games:continue
                    cachefile=cache/(topic+'-'+str(level)+'-'+row['PuzzleId']+'.json')
                    try:
                        cached=json.loads(cachefile.read_text(encoding='utf-8')) if cachefile.exists() else None
                        if cached and cached[0]['source']['sourceFen']==row['FEN'] and cached[0]['source']['sourceMoves']==row['Moves'].split() and cached[0]['source']['rating']==int(row['Rating']) and cached[0]['source']['retrieved']==DATE:puzzle,report=cached
                        else:
                            puzzle,report=audit_row(engine,row,topic,level);cachefile.write_text(json.dumps([puzzle,report],ensure_ascii=False),encoding='utf-8')
                        if report['canonical'] in canon:continue
                    except (ValueError,AssertionError,KeyError) as error:
                        reason=str(error) or type(error).__name__;rejections[reason]=rejections.get(reason,0)+1;continue
                    selected.append(puzzle);reports.append(report);source_rows.append(row);seen.add(row['PuzzleId']);games.add(game);canon.add(report['canonical']);count+=1
                    print('PASS',topic,level,count,row['PuzzleId'],row['Rating'],'plies',len(puzzle['solution']),flush=True)
                    if count==5:break
                if count!=5:raise RuntimeError('Insufficient verified puzzles: '+topic+' '+str(level)+'; '+str(rejections))
    finally:engine.quit()
    assert len(selected)==105
    output=ROOT/'lahtekood'
    (output/'puzzles.json').write_text(json.dumps(selected,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (output/'audit-report.json').write_text(json.dumps({'retrieved':DATE,'source':pool['source'],'license':'CC0-1.0','pythonChess':chess.__version__,'engineBinarySha256':hashlib.sha256(ENGINE.read_bytes()).hexdigest(),'selectionRejections':rejections,'puzzles':reports},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    with (output/'lichess-source.csv').open('w',encoding='utf-8',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=list(source_rows[0]));writer.writeheader();writer.writerows(source_rows)
    # Keep a fresh import self-contained: its manifest must describe these rows.
    manifest={
        'retrieved':DATE,'database':'https://database.lichess.org/#puzzles',
        'download':pool['source'],'license':'CC0-1.0',
        'licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/',
        'httpMetadata':pool['headers'],'candidateRowsRead':pool['rowsRead'],
        'sourceRows':len(source_rows),
        'sourceCsvSha256':hashlib.sha256((output/'lichess-source.csv').read_bytes()).hexdigest(),
        'stockfish':{'version':'19','release':'https://github.com/official-stockfish/Stockfish/releases/tag/sf_19',
            'binarySha256':hashlib.sha256(ENGINE.read_bytes()).hexdigest(),
            'license':'GPL-3.0','runtimeInPupilBrowser':False},
        'pythonChess':{'package':'python-chess 1.999 / chess '+chess.__version__,'license':'GPL-3.0-or-later'},
        'snapshotReproducibility':'The 105 original CSV records are committed. The public upstream database and its ratings may change; --recheck audits the committed snapshot.'}
    (output/'source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('COMPLETE: 105 independently checked puzzles.',flush=True)

if __name__=='__main__':main()
