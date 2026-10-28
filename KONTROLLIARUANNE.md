# Malenurga 105 ülesande kontrolliaruanne

Kontrollimise ja allika hankimise kuupäev: 2026-10-28. See on käivitatud automaatkontrollide aruanne, mitte sõltumatu õpetaja eksperdihinnang.

## Jaotus

| Teema | Keskmine | Tugev | Väga tugev | Kokku |
| --- | ---: | ---: | ---: | ---: |
| Matt ühe käiguga | 5 | 5 | 5 | 15 |
| Matt kahe käiguga | 5 | 5 | 5 | 15 |
| Kahvel | 5 | 5 | 5 | 15 |
| Sidumine | 5 | 5 | 5 | 15 |
| Topeltrünnak | 5 | 5 | 5 | 15 |
| Materjalivõit | 5 | 5 | 5 | 15 |
| Rünnak ja kaitse | 5 | 5 | 5 | 15 |
| **Kokku** | **35** | **35** | **35** | **105** |

Kõik 105 algseisu, allika ID-d ja partiid on erinevad. Kontroll välistab ka sama paigutuse kaheksa sümmeetria ja värvivahetuse kaudu saadud kordused. „Kõik teemad“ on koondfilter.

## Päritolu ja kasutusõigus

Andmed hangiti [Lichessi ametlikust andmebaasist](https://database.lichess.org/#puzzles), mille andmed on avaldatud [CC0-1.0 tingimustel](https://creativecommons.org/publicdomain/zero/1.0/). Kaasas on [105 algset CSV-kirjet](lahtekood/lichess-source.csv), [allikamanifest](lahtekood/source-manifest.json), [õppesisu ja lahendused](lahtekood/puzzles.json), [täielik sõltumatu/mootori aruanne](lahtekood/audit-report.json) ning [chess.js-i tulemused](lahtekood/validation.json). CSV FEN-ile rakendati esmalt Moves-välja esimene vastase ettevalmistav käik. Kõik poolkäigud säilivad koos algse kirje ja allika lingiga. Veebiallikast loeti kandidaatide leidmiseks 309348 kirjet; tagasilükatud kandidaate lõplikus pangas pole.

## Tegelikud kontrollid

- chess.js 1.4.0 ja sõltumatu python-chess/chess 1.11.2: kehtiv FEN, käigukord, kõik lahenduse poolkäigud, kuningate ohutus ning kasutatud erikäigud.
- Stockfish 19, üks lõim ja 128 MiB räsi. Mittemati ülesannete otsustavates õpilaseseisudes kuni 700 000 sõlme / sügavus 20, kaks parimat algkäiku; lahenduskäik peab olema esimene ja teisega vähemalt 100 senti-etturi vahega. Kaitsete analüüsis kuni 2 000 000 sõlme / sügavus 18, vajadusel kuni 8 000 000 sõlme / sügavus 20. Mittemati jada iga otsustava vastasekäigu eel analüüsiti kõiki seaduslikke vastuseid MultiPV-ga. Iga kirje juures on tegelik saavutatud sügavus, sõlmede arv, hinnang ja variandid. Kokku salvestati 335 otsustava seisu ning 2092 variandi analüüs; saavutatud sügavused on 10–20. Mootori binaari SHA-256 on manifestis.
- Ühekäigulistes mattides leiti kõik seaduslikud matikäigud kahe reeglimootoriga. Kahekäigulistes mattides pole matti ühega; iga lubatud algkäigu kõik seaduslikud kaitsed jätavad vähemalt ühe kontrollitud lõpumati. Patt ja esimesest käigust enneaegne lõpetamine on välistatud.
- Kahvlite sihtmärgid, sidumiste ründejooned ja seotud kaitsja liikumiskeeld ning topeltrünnaku kaks eri ründajat/sihtmärki kontrolliti seisust, mitte üksnes allika sildist. Materjalivõidus vaadati läbi kõik vastase kaitsed etteantud plaani jooksul ja ka kõik vastulöögid pärast õpilase viimast käiku. Kaitseülesanne algab tegelikust šahist; ainsa käigu väidet kasutatakse ainult ühe seadusliku käigu korral.
- Brauser lahendas kõik 105 ülesannet malelaua kaudu lõpuni: 235 õpilase käiku ja 20 kahekäigulise mati lõppharu. Läbis 21 kasutusvoo kontrollrühma; testiti 5/15/35/105 filtreid, vale käiku, vihjeid, pikka lahendust, tulemusi, treenerilukku, tagasisidet, klaviatuuri, lohistamist ning 390–1440 px paigutusi ja tahvli puutesisendit. JavaScripti vigu ja väliseid ressursipäringuid ei olnud.
- Avaldamise värav nõuab täpselt 5 ülesannet igas 21 lahtris, kokku 105, eri allikatähiseid, seise ja partiisid ning läbitud ja sisu SHA-256-ga seotud auditit. Negatiivsed testid tõkestavad ka korduse, pööratud värvivahetuse, kontrollimata kirje, ebaõnnestunud/puuduva auditi ja aegunud tõendi.

## Raskusastmed ja piirid

Ühekäiguliste mattide reitinguvahemikud on alla 1100, 1100–1699 ja vähemalt 1700; teiste teemade puhul alla 1400, 1400–1899 ja vähemalt 1900. Valik keskendub teema sees eri reitingualadele ning arvestab idee, seaduslike valikute, kaitsete ja õpilase käikude hulgaga. Rohkem malendeid ei ole iseseisev taseme määramise reegel. Allika reiting pole ametlik mängureiting ning 9–12-aastaste vähemalt kolm aastat õppinud noorte pedagoogilist sobivust peab hindama treener.

Mati puukontroll on lõplik kirjeldatud käigupiiri ulatuses. Materjalipuu tõendab konkreetse plaani materjalikasvu kirjeldatud horisondis. Muude pikkade mängujätkude hinnang põhineb salvestatud sügavuse/sõlmepiiriga mootorianalüüsil ja mitmel kaitsel; see ei ole kogu male matemaatiline lahendus ega absoluutse veatuse garantii. Brauser mängib ühe kontrollitud kaitseharu ning õpilane teeb kõik oma lahenduskäigud ise. Kasutajaliidese eraldi sünteetiline muundumisfixtuur ei kuulu 105 veebist hangitud ülesande hulka. Füüsiliste tahvlite, teise Stockfishi versiooni või õpetaja/õpilaste kasutuskatset see aruanne ei väida.

## Ülesannete kaupa

Täielikud PV-d, FEN-id, käigud, erikäigud, piirid ja kontrollid on eespool lingitud JSON-failides sama ID järgi.

| ID | Allikas | Põhiteema | Tase (allika reiting) | chess.js / python-chess | Eesmärk | Mootori analüüs | Tulemus |
| --- | --- | --- | --- | --- | --- | --- | --- |
| lichess-03YJr | [Lichess 03YJr](https://lichess.org/training/03YJr) | Matt ühe käiguga | Keskmine (800) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-01fP3 | [Lichess 01fP3](https://lichess.org/training/01fP3) | Matt ühe käiguga | Keskmine (798) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-00aZP | [Lichess 00aZP](https://lichess.org/training/00aZP) | Matt ühe käiguga | Keskmine (797) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-02HEw | [Lichess 02HEw](https://lichess.org/training/02HEw) | Matt ühe käiguga | Keskmine (804) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-00HnR | [Lichess 00HnR](https://lichess.org/training/00HnR) | Matt ühe käiguga | Keskmine (805) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-09015 | [Lichess 09015](https://lichess.org/training/09015) | Matt ühe käiguga | Tugev (1400) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-04ZIs | [Lichess 04ZIs](https://lichess.org/training/04ZIs) | Matt ühe käiguga | Tugev (1397) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 19–20; 0 kaitset | **läbis** |
| lichess-07lPB | [Lichess 07lPB](https://lichess.org/training/07lPB) | Matt ühe käiguga | Tugev (1403) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-094yw | [Lichess 094yw](https://lichess.org/training/094yw) | Matt ühe käiguga | Tugev (1397) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 15–15; 0 kaitset | **läbis** |
| lichess-040x1 | [Lichess 040x1](https://lichess.org/training/040x1) | Matt ühe käiguga | Tugev (1404) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0H8LG | [Lichess 0H8LG](https://lichess.org/training/0H8LG) | Matt ühe käiguga | Väga tugev (2000) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-1Lk6N | [Lichess 1Lk6N](https://lichess.org/training/1Lk6N) | Matt ühe käiguga | Väga tugev (2002) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-1Rmb2 | [Lichess 1Rmb2](https://lichess.org/training/1Rmb2) | Matt ühe käiguga | Väga tugev (1994) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-09kAc | [Lichess 09kAc](https://lichess.org/training/09kAc) | Matt ühe käiguga | Väga tugev (1991) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-27N1U | [Lichess 27N1U](https://lichess.org/training/27N1U) | Matt ühe käiguga | Väga tugev (2009) | läbis / läbis | mate1 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-03eh3 | [Lichess 03eh3](https://lichess.org/training/03eh3) | Matt kahe käiguga | Keskmine (1150) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 18–19; 0 kaitset | **läbis** |
| lichess-009f8 | [Lichess 009f8](https://lichess.org/training/009f8) | Matt kahe käiguga | Keskmine (1149) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-01Xbe | [Lichess 01Xbe](https://lichess.org/training/01Xbe) | Matt kahe käiguga | Keskmine (1151) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-037iS | [Lichess 037iS](https://lichess.org/training/037iS) | Matt kahe käiguga | Keskmine (1149) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-00aCb | [Lichess 00aCb](https://lichess.org/training/00aCb) | Matt kahe käiguga | Keskmine (1148) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-01QgQ | [Lichess 01QgQ](https://lichess.org/training/01QgQ) | Matt kahe käiguga | Tugev (1650) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0Bk9P | [Lichess 0Bk9P](https://lichess.org/training/0Bk9P) | Matt kahe käiguga | Tugev (1650) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0Aqjg | [Lichess 0Aqjg](https://lichess.org/training/0Aqjg) | Matt kahe käiguga | Tugev (1649) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0BoDL | [Lichess 0BoDL](https://lichess.org/training/0BoDL) | Matt kahe käiguga | Tugev (1649) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-01wIv | [Lichess 01wIv](https://lichess.org/training/01wIv) | Matt kahe käiguga | Tugev (1648) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-02YZG | [Lichess 02YZG](https://lichess.org/training/02YZG) | Matt kahe käiguga | Väga tugev (2199) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0LDZp | [Lichess 0LDZp](https://lichess.org/training/0LDZp) | Matt kahe käiguga | Väga tugev (2201) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-19IET | [Lichess 19IET](https://lichess.org/training/19IET) | Matt kahe käiguga | Väga tugev (2199) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0PhdF | [Lichess 0PhdF](https://lichess.org/training/0PhdF) | Matt kahe käiguga | Väga tugev (2205) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-0inBx | [Lichess 0inBx](https://lichess.org/training/0inBx) | Matt kahe käiguga | Väga tugev (2195) | läbis / läbis | mate2 | SF 19; 1 seisu; sügavus 20–20; 0 kaitset | **läbis** |
| lichess-04jF9 | [Lichess 04jF9](https://lichess.org/training/04jF9) | Kahvel | Keskmine (1153) | läbis / läbis | fork | SF 19; 3 seisu; sügavus 18–20; 4 kaitset | **läbis** |
| lichess-02qUN | [Lichess 02qUN](https://lichess.org/training/02qUN) | Kahvel | Keskmine (1146) | läbis / läbis | fork | SF 19; 3 seisu; sügavus 18–20; 4 kaitset | **läbis** |
| lichess-01VBW | [Lichess 01VBW](https://lichess.org/training/01VBW) | Kahvel | Keskmine (1155) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 18–20; 4 kaitset | **läbis** |
| lichess-02lUz | [Lichess 02lUz](https://lichess.org/training/02lUz) | Kahvel | Keskmine (1144) | läbis / läbis | fork | SF 19; 3 seisu; sügavus 13–19; 47 kaitset | **läbis** |
| lichess-03Cgx | [Lichess 03Cgx](https://lichess.org/training/03Cgx) | Kahvel | Keskmine (1157) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 11–18; 75 kaitset | **läbis** |
| lichess-0871Z | [Lichess 0871Z](https://lichess.org/training/0871Z) | Kahvel | Tugev (1650) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 17–20; 6 kaitset | **läbis** |
| lichess-08mpr | [Lichess 08mpr](https://lichess.org/training/08mpr) | Kahvel | Tugev (1650) | läbis / läbis | fork | SF 19; 3 seisu; sügavus 15–18; 3 kaitset | **läbis** |
| lichess-04GHG | [Lichess 04GHG](https://lichess.org/training/04GHG) | Kahvel | Tugev (1651) | läbis / läbis | fork | SF 19; 3 seisu; sügavus 16–19; 2 kaitset | **läbis** |
| lichess-04U8S | [Lichess 04U8S](https://lichess.org/training/04U8S) | Kahvel | Tugev (1651) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 18–20; 6 kaitset | **läbis** |
| lichess-01cmV | [Lichess 01cmV](https://lichess.org/training/01cmV) | Kahvel | Tugev (1652) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 17–19; 42 kaitset | **läbis** |
| lichess-0AagP | [Lichess 0AagP](https://lichess.org/training/0AagP) | Kahvel | Väga tugev (2199) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 13–20; 47 kaitset | **läbis** |
| lichess-0E6WY | [Lichess 0E6WY](https://lichess.org/training/0E6WY) | Kahvel | Väga tugev (2198) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 18–20; 6 kaitset | **läbis** |
| lichess-0EYQV | [Lichess 0EYQV](https://lichess.org/training/0EYQV) | Kahvel | Väga tugev (2194) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 18–20; 2 kaitset | **läbis** |
| lichess-0Csn4 | [Lichess 0Csn4](https://lichess.org/training/0Csn4) | Kahvel | Väga tugev (2193) | läbis / läbis | fork | SF 19; 7 seisu; sügavus 11–17; 57 kaitset | **läbis** |
| lichess-09X01 | [Lichess 09X01](https://lichess.org/training/09X01) | Kahvel | Väga tugev (2208) | läbis / läbis | fork | SF 19; 5 seisu; sügavus 17–18; 10 kaitset | **läbis** |
| lichess-0KUDH | [Lichess 0KUDH](https://lichess.org/training/0KUDH) | Sidumine | Keskmine (1150) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 12–18; 28 kaitset | **läbis** |
| lichess-05428 | [Lichess 05428](https://lichess.org/training/05428) | Sidumine | Keskmine (1151) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 18–20; 3 kaitset | **läbis** |
| lichess-0BJad | [Lichess 0BJad](https://lichess.org/training/0BJad) | Sidumine | Keskmine (1152) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 12–20; 13 kaitset | **läbis** |
| lichess-0CsBI | [Lichess 0CsBI](https://lichess.org/training/0CsBI) | Sidumine | Keskmine (1152) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 18–20; 6 kaitset | **läbis** |
| lichess-09Hpb | [Lichess 09Hpb](https://lichess.org/training/09Hpb) | Sidumine | Keskmine (1153) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 12–20; 30 kaitset | **läbis** |
| lichess-04uOg | [Lichess 04uOg](https://lichess.org/training/04uOg) | Sidumine | Tugev (1650) | läbis / läbis | pin | SF 19; 5 seisu; sügavus 14–20; 16 kaitset | **läbis** |
| lichess-0Fo1B | [Lichess 0Fo1B](https://lichess.org/training/0Fo1B) | Sidumine | Tugev (1652) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 12–19; 33 kaitset | **läbis** |
| lichess-0CCBh | [Lichess 0CCBh](https://lichess.org/training/0CCBh) | Sidumine | Tugev (1660) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 18–20; 2 kaitset | **läbis** |
| lichess-00oXF | [Lichess 00oXF](https://lichess.org/training/00oXF) | Sidumine | Tugev (1661) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 13–18; 36 kaitset | **läbis** |
| lichess-0BYnD | [Lichess 0BYnD](https://lichess.org/training/0BYnD) | Sidumine | Tugev (1639) | läbis / läbis | pin | SF 19; 7 seisu; sügavus 11–20; 7 kaitset | **läbis** |
| lichess-0D5ow | [Lichess 0D5ow](https://lichess.org/training/0D5ow) | Sidumine | Väga tugev (2197) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 17–20; 30 kaitset | **läbis** |
| lichess-0G1tE | [Lichess 0G1tE](https://lichess.org/training/0G1tE) | Sidumine | Väga tugev (2197) | läbis / läbis | pin | SF 19; 3 seisu; sügavus 12–18; 24 kaitset | **läbis** |
| lichess-0H8Nr | [Lichess 0H8Nr](https://lichess.org/training/0H8Nr) | Sidumine | Väga tugev (2192) | läbis / läbis | pin | SF 19; 7 seisu; sügavus 12–20; 124 kaitset | **läbis** |
| lichess-0AGfC | [Lichess 0AGfC](https://lichess.org/training/0AGfC) | Sidumine | Väga tugev (2188) | läbis / läbis | pin | SF 19; 7 seisu; sügavus 17–20; 34 kaitset | **läbis** |
| lichess-0IKZY | [Lichess 0IKZY](https://lichess.org/training/0IKZY) | Sidumine | Väga tugev (2212) | läbis / läbis | pin | SF 19; 5 seisu; sügavus 12–20; 49 kaitset | **läbis** |
| lichess-02UFP | [Lichess 02UFP](https://lichess.org/training/02UFP) | Topeltrünnak | Keskmine (1149) | läbis / läbis | double | SF 19; 3 seisu; sügavus 14–18; 3 kaitset | **läbis** |
| lichess-04I5l | [Lichess 04I5l](https://lichess.org/training/04I5l) | Topeltrünnak | Keskmine (1151) | läbis / läbis | double | SF 19; 3 seisu; sügavus 18–20; 1 kaitset | **läbis** |
| lichess-0EsGB | [Lichess 0EsGB](https://lichess.org/training/0EsGB) | Topeltrünnak | Keskmine (1151) | läbis / läbis | double | SF 19; 3 seisu; sügavus 14–20; 2 kaitset | **läbis** |
| lichess-044zv | [Lichess 044zv](https://lichess.org/training/044zv) | Topeltrünnak | Keskmine (1153) | läbis / läbis | double | SF 19; 3 seisu; sügavus 15–20; 4 kaitset | **läbis** |
| lichess-07YFf | [Lichess 07YFf](https://lichess.org/training/07YFf) | Topeltrünnak | Keskmine (1153) | läbis / läbis | double | SF 19; 3 seisu; sügavus 18–20; 2 kaitset | **läbis** |
| lichess-0BcyA | [Lichess 0BcyA](https://lichess.org/training/0BcyA) | Topeltrünnak | Tugev (1652) | läbis / läbis | double | SF 19; 3 seisu; sügavus 13–20; 4 kaitset | **läbis** |
| lichess-0Jbx2 | [Lichess 0Jbx2](https://lichess.org/training/0Jbx2) | Topeltrünnak | Tugev (1648) | läbis / läbis | double | SF 19; 5 seisu; sügavus 13–20; 33 kaitset | **läbis** |
| lichess-0DY8b | [Lichess 0DY8b](https://lichess.org/training/0DY8b) | Topeltrünnak | Tugev (1647) | läbis / läbis | double | SF 19; 3 seisu; sügavus 16–20; 3 kaitset | **läbis** |
| lichess-07M1s | [Lichess 07M1s](https://lichess.org/training/07M1s) | Topeltrünnak | Tugev (1656) | läbis / läbis | double | SF 19; 5 seisu; sügavus 17–19; 3 kaitset | **läbis** |
| lichess-04hhS | [Lichess 04hhS](https://lichess.org/training/04hhS) | Topeltrünnak | Tugev (1642) | läbis / läbis | double | SF 19; 3 seisu; sügavus 13–19; 4 kaitset | **läbis** |
| lichess-0SHxm | [Lichess 0SHxm](https://lichess.org/training/0SHxm) | Topeltrünnak | Väga tugev (2201) | läbis / läbis | double | SF 19; 3 seisu; sügavus 10–18; 39 kaitset | **läbis** |
| lichess-0Spmn | [Lichess 0Spmn](https://lichess.org/training/0Spmn) | Topeltrünnak | Väga tugev (2201) | läbis / läbis | double | SF 19; 5 seisu; sügavus 12–18; 35 kaitset | **läbis** |
| lichess-0UUq6 | [Lichess 0UUq6](https://lichess.org/training/0UUq6) | Topeltrünnak | Väga tugev (2204) | läbis / läbis | double | SF 19; 3 seisu; sügavus 12–17; 38 kaitset | **läbis** |
| lichess-00ZEW | [Lichess 00ZEW](https://lichess.org/training/00ZEW) | Topeltrünnak | Väga tugev (2206) | läbis / läbis | double | SF 19; 5 seisu; sügavus 12–18; 9 kaitset | **läbis** |
| lichess-0QHHL | [Lichess 0QHHL](https://lichess.org/training/0QHHL) | Topeltrünnak | Väga tugev (2186) | läbis / läbis | double | SF 19; 5 seisu; sügavus 12–19; 34 kaitset | **läbis** |
| lichess-041yQ | [Lichess 041yQ](https://lichess.org/training/041yQ) | Materjalivõit | Keskmine (1153) | läbis / läbis | material | SF 19; 3 seisu; sügavus 14–20; 4 kaitset | **läbis** |
| lichess-003eP | [Lichess 003eP](https://lichess.org/training/003eP) | Materjalivõit | Keskmine (1156) | läbis / läbis | material | SF 19; 5 seisu; sügavus 12–20; 5 kaitset | **läbis** |
| lichess-03Qx8 | [Lichess 03Qx8](https://lichess.org/training/03Qx8) | Materjalivõit | Keskmine (1139) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–20; 5 kaitset | **läbis** |
| lichess-087Yo | [Lichess 087Yo](https://lichess.org/training/087Yo) | Materjalivõit | Keskmine (1139) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–20; 1 kaitset | **läbis** |
| lichess-00TiV | [Lichess 00TiV](https://lichess.org/training/00TiV) | Materjalivõit | Keskmine (1135) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–20; 4 kaitset | **läbis** |
| lichess-07ybB | [Lichess 07ybB](https://lichess.org/training/07ybB) | Materjalivõit | Tugev (1642) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–18; 4 kaitset | **läbis** |
| lichess-02Pu3 | [Lichess 02Pu3](https://lichess.org/training/02Pu3) | Materjalivõit | Tugev (1670) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–19; 5 kaitset | **läbis** |
| lichess-05qJ2 | [Lichess 05qJ2](https://lichess.org/training/05qJ2) | Materjalivõit | Tugev (1625) | läbis / läbis | material | SF 19; 5 seisu; sügavus 18–20; 5 kaitset | **läbis** |
| lichess-03xhx | [Lichess 03xhx](https://lichess.org/training/03xhx) | Materjalivõit | Tugev (1616) | läbis / läbis | material | SF 19; 3 seisu; sügavus 17–18; 1 kaitset | **läbis** |
| lichess-03LZQ | [Lichess 03LZQ](https://lichess.org/training/03LZQ) | Materjalivõit | Tugev (1607) | läbis / läbis | material | SF 19; 5 seisu; sügavus 17–18; 3 kaitset | **läbis** |
| lichess-0E3g5 | [Lichess 0E3g5](https://lichess.org/training/0E3g5) | Materjalivõit | Väga tugev (2171) | läbis / läbis | material | SF 19; 3 seisu; sügavus 13–20; 5 kaitset | **läbis** |
| lichess-0B2Dr | [Lichess 0B2Dr](https://lichess.org/training/0B2Dr) | Materjalivõit | Väga tugev (2233) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–20; 3 kaitset | **läbis** |
| lichess-0Dnoc | [Lichess 0Dnoc](https://lichess.org/training/0Dnoc) | Materjalivõit | Väga tugev (2150) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–20; 1 kaitset | **läbis** |
| lichess-03IoD | [Lichess 03IoD](https://lichess.org/training/03IoD) | Materjalivõit | Väga tugev (2129) | läbis / läbis | material | SF 19; 3 seisu; sügavus 18–20; 2 kaitset | **läbis** |
| lichess-01CmR | [Lichess 01CmR](https://lichess.org/training/01CmR) | Materjalivõit | Väga tugev (2288) | läbis / läbis | material | SF 19; 5 seisu; sügavus 17–19; 3 kaitset | **läbis** |
| lichess-06AH0 | [Lichess 06AH0](https://lichess.org/training/06AH0) | Rünnak ja kaitse | Keskmine (1150) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 11–18; 83 kaitset | **läbis** |
| lichess-0AN5p | [Lichess 0AN5p](https://lichess.org/training/0AN5p) | Rünnak ja kaitse | Keskmine (1150) | läbis / läbis | defence | SF 19; 3 seisu; sügavus 13–20; 23 kaitset | **läbis** |
| lichess-00Gvr | [Lichess 00Gvr](https://lichess.org/training/00Gvr) | Rünnak ja kaitse | Keskmine (1149) | läbis / läbis | defence | SF 19; 3 seisu; sügavus 10–18; 14 kaitset | **läbis** |
| lichess-09ndC | [Lichess 09ndC](https://lichess.org/training/09ndC) | Rünnak ja kaitse | Keskmine (1152) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 18–20; 44 kaitset | **läbis** |
| lichess-02ccm | [Lichess 02ccm](https://lichess.org/training/02ccm) | Rünnak ja kaitse | Keskmine (1144) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 13–20; 15 kaitset | **läbis** |
| lichess-02FEH | [Lichess 02FEH](https://lichess.org/training/02FEH) | Rünnak ja kaitse | Tugev (1650) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 12–19; 43 kaitset | **läbis** |
| lichess-070k6 | [Lichess 070k6](https://lichess.org/training/070k6) | Rünnak ja kaitse | Tugev (1654) | läbis / läbis | defence | SF 19; 3 seisu; sügavus 11–19; 48 kaitset | **läbis** |
| lichess-0BuC1 | [Lichess 0BuC1](https://lichess.org/training/0BuC1) | Rünnak ja kaitse | Tugev (1642) | läbis / läbis | defence | SF 19; 3 seisu; sügavus 14–20; 6 kaitset | **läbis** |
| lichess-00XZR | [Lichess 00XZR](https://lichess.org/training/00XZR) | Rünnak ja kaitse | Tugev (1641) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 12–20; 42 kaitset | **läbis** |
| lichess-00veX | [Lichess 00veX](https://lichess.org/training/00veX) | Rünnak ja kaitse | Tugev (1661) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 11–19; 93 kaitset | **läbis** |
| lichess-03Xp4 | [Lichess 03Xp4](https://lichess.org/training/03Xp4) | Rünnak ja kaitse | Väga tugev (2189) | läbis / läbis | defence | SF 19; 3 seisu; sügavus 11–18; 46 kaitset | **läbis** |
| lichess-0AcRz | [Lichess 0AcRz](https://lichess.org/training/0AcRz) | Rünnak ja kaitse | Väga tugev (2188) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 11–19; 73 kaitset | **läbis** |
| lichess-00ZvN | [Lichess 00ZvN](https://lichess.org/training/00ZvN) | Rünnak ja kaitse | Väga tugev (2183) | läbis / läbis | defence | SF 19; 5 seisu; sügavus 14–20; 12 kaitset | **läbis** |
| lichess-05KMF | [Lichess 05KMF](https://lichess.org/training/05KMF) | Rünnak ja kaitse | Väga tugev (2220) | läbis / läbis | defence | SF 19; 7 seisu; sügavus 12–20; 21 kaitset | **läbis** |
| lichess-08H8F | [Lichess 08H8F](https://lichess.org/training/08H8F) | Rünnak ja kaitse | Väga tugev (2177) | läbis / läbis | defence | SF 19; 7 seisu; sügavus 12–19; 45 kaitset | **läbis** |

## Kordamine

1. Paigalda arenduskontrolliks Python 3 ja sõltuvused: `python -m pip install -r lahtekood/audit-requirements.txt`.
2. Sea `STOCKFISH` ametliku Stockfish 19 binaari täisteeks ning käivita `python lahtekood/audit-puzzles.py --recheck`. See kasutab kaasa pakitud allikakirjeid ja analüüsib kõiki 105 seisu uuesti, mitte ei usalda vahemälu. Tulemuseks on `.work/recheck-report.json`.
3. Käivita `node lahtekood/validate.cjs`, `node lahtekood/test-validation.cjs`, `node lahtekood/build-pages.cjs` ja `node lahtekood/test-browser.cjs dist/index.html`.
4. Koosta aruanne uuesti: `node lahtekood/report.cjs`.

Uue valimi hankimiseks on `python lahtekood/import-puzzles.py` ja `python lahtekood/audit-puzzles.py`. Avalik andmebaas ja reitingud võivad muutuda; täpselt selle versiooni korduskontroll kasutab arhiveeritud 105 algkirjet.
