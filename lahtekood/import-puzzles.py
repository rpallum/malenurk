"""Stream a bounded candidate pool from the official CC0 Lichess export."""
import csv, io, json, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'.work/pydeps'))
import zstandard

URL='https://database.lichess.org/lichess_db_puzzle.csv.zst'
DATE=datetime.now(timezone.utc).date().isoformat()
TOPICS=['mate1','mate2','fork','pin','double','material','defence']
def level(topic,rating):
    low,high=(1100,1700) if topic=='mate1' else (1400,1900)
    return 0 if rating<low else 1 if rating<high else 2

def categories(row):
    tags=set(row['Themes'].split())
    if 'mateIn1' in tags:return ['mate1']
    if 'mateIn2' in tags:return ['mate2']
    if 'mate' in tags:return []
    out=[]
    for tag,topic in [('fork','fork'),('pin','pin'),('discoveredAttack','double'),('defensiveMove','defence')]:
        if tag in tags:out.append(topic)
    if tags.intersection({'hangingPiece','capturingDefender','trappedPiece','deflection','skewer'}):out.append('material')
    return out

def main():
    output=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'.work/candidates.json'
    per_bucket=int(sys.argv[2]) if len(sys.argv)>2 else 350
    maximum=int(sys.argv[3]) if len(sys.argv)>3 else 600000
    pools={t+':'+str(l):[] for t in TOPICS for l in range(3)}
    req=urllib.request.Request(URL,headers={'User-Agent':'Malenurk-educational-import/1.3'})
    with urllib.request.urlopen(req,timeout=120) as response:
        metadata={k:response.headers.get(k) for k in ['Last-Modified','ETag','Content-Length']}
        stream=zstandard.ZstdDecompressor().stream_reader(response)
        rows=csv.DictReader(io.TextIOWrapper(stream,encoding='utf-8',newline=''))
        for number,row in enumerate(rows,1):
            try:
                if int(row['Popularity'])<85 or int(row['NbPlays'])<100 or int(row['RatingDeviation'])>100:continue
                if len(row['Moves'].split())>8:continue
                rating=int(row['Rating'])
                for topic in categories(row):
                    bucket=pools[topic+':'+str(level(topic,rating))]
                    if len(bucket)<per_bucket:bucket.append(row)
            except (ValueError,KeyError):continue
            if number%25000==0:print('Rows',number,'buckets',{k:len(v) for k,v in pools.items()},flush=True)
            if number>=maximum or all(len(v)>=per_bucket for v in pools.values()):break
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps({'source':URL,'license':'CC0-1.0','retrieved':DATE,'headers':metadata,'rowsRead':number,'pools':pools},ensure_ascii=False),encoding='utf-8')
    print('Saved candidate pool',output,{k:len(v) for k,v in pools.items()},flush=True)

if __name__=='__main__':main()
