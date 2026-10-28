# Malenurk

Eestikeelne maleharjutuste veebiprogramm 9–12-aastastele vähemalt kolm aastat malet õppinud noortele. Versioon **1.3**, 28.10.2026.

## Kasutamine

Ava **https://rpallum.github.io/malenurk/**. Sama aadress näitab pärast iga õnnestunud avaldamist uut versiooni; vajaduse korral värskenda brauserilehte. Kohalikuks internetita kasutamiseks ava `Malenurk.html` või `index.html` brauseriga. Mõlemad on iseseisvad ja sisult identsed failid; serverit, kontot ega paigaldamist ei ole vaja. Tahvelarvutis tuleb kasutada JavaScripti toetavat brauserit, mitte failihalduri staatilist eelvaadet.

1. Vali **Harjutused** või **Alusta harjutamist**.
2. Vali tase, teema ja 5, 10 või kõik valitud ülesanded.
3. Vajuta **Läheme lauale**. Vali malend ja sihtruut või lohista malendit. Puuteekraanil puuduta malendit ja sihtruutu. Klaviatuuril kasuta tabeldusklahvi, nooli ja Enterit.
4. Vajaduse korral ava kuni kaks järjestikust vihjet, proovi uuesti või ava lahendus eraldi nupust.
5. Mitmekäigulises ülesandes tee kõik oma käigud ise; programm teeb vastase kontrollitud vastused. Lõpus näed tulemusi ja soovitusi kordamiseks.

Hele kreemikas ja roheline kujundus, logo, pealkiri „Hea käik algab heast mõttest.“, malelaud ja kohanduv paigutus on säilinud. Ülamenüüs on **Avaleht**, **Harjutused**, **Juhised**, **Treeneri vaade** ja **Tagasiside**. Aktiivne vaade on tähistatud; kitsamal ekraanil jaguneb menüü ridadele.

## Täpselt 105 erinevat ülesannet

| Põhiteema | Keskmine | Tugev | Väga tugev | Kokku |
| --- | ---: | ---: | ---: | ---: |
| Matt ühe käiguga | 5 | 5 | 5 | 15 |
| Matt kahe käiguga | 5 | 5 | 5 | 15 |
| Kahvel | 5 | 5 | 5 | 15 |
| Sidumine | 5 | 5 | 5 | 15 |
| Topeltrünnak | 5 | 5 | 5 | 15 |
| Materjalivõit | 5 | 5 | 5 | 15 |
| Rünnak ja kaitse | 5 | 5 | 5 | 15 |
| **Kokku** | **35** | **35** | **35** | **105** |

Iga ülesanne kuulub ühte põhiteemasse ja ühte raskusastmesse. „Kõik teemad“ on koondfilter. Üks teema ja üks tase annab 5, üks teema ja kõik tasemed 15, kõik teemad ja üks tase 35 ning mõlemad koondfiltrid 105 ülesannet. Kui tellid kümme ülesannet viie ülesandega valikust, näidatakse tegelikku arvu ja kasutatakse kõiki viit; ülesandeid ei dubleerita.

Kõik lõpliku panga ülesanded pärinevad eri Lichessi partiidest. Sama seisu pööratud, peegeldatud või värvivahetusega variante arvu täitmiseks ei kasutata. Varasemad programmi jaoks koostatud seisud ja nende peegelvariandid asendati veebist hangitud pangaga.

## Allikas ja kasutustingimused

Allikas on [Lichessi ametlik avatud ülesannete andmebaas](https://database.lichess.org/#puzzles). Selle eksport on [CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/): andmeid võib kopeerida, muuta ja levitada. Andmed hangiti **28.10.2026** otse failist `https://database.lichess.org/lichess_db_puzzle.csv.zst`. HTTP päised, valimisse loetud kirjete arv, algkirjete faili räsi ja töövahendite andmed on failis `lahtekood/source-manifest.json`.

Iga kirje sisaldab programmi ja allika ID-d, otseviidet ülesandele, hankimiskuupäeva, allikareitingut, FEN-i, käigukorda, täielikku UCI-lahendust, põhiteemat, taset, eestikeelset küsimust, kaht astmelist vihjet, selgitust, raskusastme lähtekohti ja kontrollitulemuse viidet. Algallika teemasilte säilitatakse päritoluandmetes, kuid põhiteema kinnitatakse seisu konkreetse taktikalise eesmärgi kontrolliga.

**Lichessi CSV FEN on enne vastase ettevalmistavat käiku.** Import rakendab `Moves`-välja esimese käigu. Alles saadud seis on õpilase algseis; ülejäänud käigud on lahendus. Originaal-FEN ja kogu originaalne käigujada jäävad päritoluandmetesse. Kaasasolevad `lahtekood/lichess-source.csv` ja `puzzles.json` võimaldavad täpselt seda valimit uuesti kontrollida ka siis, kui avaliku andmebaasi reitingud hiljem muutuvad.

Eestikeelsed küsimused, vihjed ja selgitused kirjutati selle rakenduse jaoks kontrollitud seisu, ründejoonte, sihtmärkide ja käikude põhjal. Esimene vihje suunab ideele, teine aitab valida malendit. Kummagi avamine on õpilase enda valik. Päritolu ja allikareiting on nähtavad treeneri avatud ülesandereas.

## Male ja lahenduste kontroll

Täpne 105 kirje kaupa ülevaade on [KONTROLLIARUANNE.md](KONTROLLIARUANNE.md). Täielikud kontrollandmed ja mootorivariandid on `lahtekood/audit-report.json` ning chess.js-i tulemused `lahtekood/validation.json`.

- **chess.js 1.4.0** kontrollib käike nii arenduses kui õpilase brauseris. BSD-2-Clause litsents on HTML-i kommentaaris ja failis `LICENSE-chess.txt`.
- **python-chess/chess 1.11.2** on sõltumatu reeglikontroll: algseis, ettevalmistav käik, käigukord, kõik poolkäigud, kuningate ohutus ja erikäigud kontrolliti eraldi.
- **Stockfish 19** analüüsis otsustavaid seise ning vastase kaitseid. Mittemati ülesandes võrreldi igal õpilase käigul kaht parimat käiku ning iga vahepealse vastasekäigu eel kõiki seaduslikke vastuseid MultiPV-ga. Versioon, binaari räsi, lõimede/räsi seaded, sõlme- ja sügavuspiirid, tegelik saavutatud sügavus ning variandid on ülesande kaupa aruandes.
- **Matt ühega:** kõik seaduslikud matikäigud võetakse vastu, sõltumata allika näidiskäigust.
- **Matt kahega:** mõlemad reeglimootorid välistasid mati ühega ning vaatasid iga lubatud algkäigu järel läbi kõik vastase seaduslikud kaitsed ja nende lõpumatid. Esimene õige käik ei lõpeta ülesannet.
- **Kahvel:** liikunud malend ründab päriselt vähemalt kaht olulist sihtmärki. **Sidumine:** kontrolliti ründaja, seotud malendi ja tagumise sihtmärgi ründejoont ning seotud kaitsja kasutamisel selle seaduslikku liikumiskeeldu. **Topeltrünnak:** liikunud malendi ähvardus ja avatud teise malendi rünnak on eri sihtmärkidele.
- **Materjalivõit:** kogu etteantud plaani vältel vaadati läbi kõik vastase seaduslikud kaitsed ja ka vastulöögid pärast õpilase viimast käiku. Materjaliväärtused on ettur 1, ratsu ja oda 3, vanker 5 ning lipp 9. Need on õppemudeli ligikaudsed väärtused.
- **Kaitse:** algseisus on tegelik šahh, õige käik kõrvaldab selle ja võrreldud jätk säilitab kaitstava seisu. „Ainus“ kasutatakse küsimuses ainult siis, kui seaduslikke käike on täpselt üks.

Mittemati näidislahendustes valiti mootorikontrollis ühesed õpilasekäigud: teise parima käiguga nõuti vähemalt 100 senti-etturi vahet. Ebaselgeid kandidaate ei lisatud. Matiivõtmete alternatiivid on ammendavalt arvutatud. See on salvestatud analüüsipiirides tehtud kontroll, mitte kogu male matemaatiline lahendus. Brauser mängib ühte kontrollitud kaitseharu; vaba analüüsimootorit või arvutivastasega partiid ei ole.

Mootori- ja sõltumatu kontroll tehakse arenduses. Õpilase HTML sisaldab kogu ülesandepanka ja vajalikku reegliteeki; Lichessi ega Stockfishi teenusest midagi ei pärita. Väliseid fonte, CDN-e ega andmesideteenuseid pole.

## Raskusastmete valik

Raskust hinnati iga teema sees allika reitingu, idee märkamise, seaduslike valikute, vastase kaitsete, malendite koostöö ja õpilase käikude arvu põhjal. Reitingualad on:

| Teema | Keskmine | Tugev | Väga tugev |
| --- | --- | --- | --- |
| Matt ühe käiguga | alla 1100 | 1100–1699 | vähemalt 1700 |
| Ülejäänud kuus teemat | alla 1400 | 1400–1899 | vähemalt 1900 |

Valitud ühekäigulised matid paiknevad ligikaudu reitingute 800, 1400 ja 2000 ümber. Kõrgeima taseme näites `0H8LG` tuleb märgata avastatud kahekordset šahhi; kõrgem tase ei tähenda lihtsalt rohkem malendeid. Ka lihtsamas seisus võib olla rohkem seaduslikke valikuid kui raskes seisus. Pikemate teemade valikus on vastavalt umbes 1150, 1650 ja 2200 reitinguga ülesanded ning kuni neli õpilase käiku.

Need on **programmi õppetasemed**, mitte ametlikud mängureitingud. Teemade vahel pole samanimeliste tasemete tegelik võrdsus ega sobivus kogu sihtrühmale empiiriliselt kinnitatud. Tehnilised kontrollid ei asenda treeneri hinnangut ega päris õpilastega kasutuskatset.

## Tulemused ja treeneri vaade

Õigeks loetakse lõpuni leitud lahendus ka vihje või eksimuse järel. Avatud lahendus on läbitud, kuid mitte õigesti lahendatud. Edukus on õigete vastuste osakaal läbitud ülesannetest. Eraldi kuvatakse esimesel katsel ja vihjeta lahendused. Ebaseaduslik käik annab juhise; eksimuse arvu suurendab seaduslik, kuid ülesandele mittevastav käik. Algseisu taastamisel säilivad vihjete ja eksimuste arvud. Ajapiirangut ei ole.

Tulemuste lehelt saab korrata komplekti, valida järgmise raskusastme, korrata vihje/eksimuse/avatud lahendusega teemasid või minna avalehele. Ühe korra tulemustest ei järeldata üldist maletugevust. Harjutuskord ja selle tulemused kaovad lehe värskendamisel.

Treeneri vaate parool on täpselt **`male2026`**. Enter ja sisenemisnupp töötavad; tühi ja vale parool ei ava töölauda. Ligipääs kehtib avatud lehe sees, „Välju treeneri vaatest“ ja värskendamine lukustavad vaate. Kõik filtrid, seisud, FEN-id, allikad, lahendused, vihjed, üksikülesande/komplekti käivitamine ja sobivushinnangud säilivad.

See on ühe HTML-i **kasutajaliidese piirang, mitte turvaline autentimine**. Parool ja lahendused on lähtekoodist loetavad. Neid ei esitata tehniliselt salajastena. Treeneri ligipääsuolekut ei salvestata sessionStorage'isse.

## Avalik tagasiside

Tagasiside ei nõua parooli. Autor on **Rasmus Pallum**, kontakt **rasmus.pallum@gmail.com**. Küsimustele 1–8 tuleb valida hinne 1–5; küsimused 9–12 ja nimi on vabatahtlikud.

**Saadan oma tagasiside** kontrollib kohustuslikud hinnangud ning kirjutab vastused selle vahelehe sessionStorage'isse. Alles eduka kirjutamise ja tagasilugemise järel muutub nupp tekstiks **Hinnang salvestatud** ning ilmub heleroheline tänuteade. Kinnitamine ei alusta allalaadimist, ava meiliprogrammi ega saada andmeid autorile. Salvestusvea korral näidatakse eestikeelset teadet ja vastused jäävad vormi alles.

Salvestatud vastused taastuvad sama vahelehe värskendamisel. Muutmisel kuvatakse **Muudatused salvestamata** ja eksport blokeeritakse uuesti salvestamiseni. Mustand säilib vaadete vahel; värskendamisel taastub viimane kinnitatud hinnang. Seansi lõppedes pole see pikaajaline arhiiv.

Pärast kinnitamist on eraldi **Laadi alla .txt** ja **Laadi alla .csv** nupud. Ainult nende vajutamine laadib vastava faili alla. Failid sisaldavad kõiki 12 küsimust ning salvestatud vastuseid; tühjad vabatahtlikud vastused on lubatud. Kaasatakse sama salvestuse treeneri sobivushinnangud. CSV on semikooloniga UTF-8/BOM vormingus; jutumärgid dubleeritakse ja reavahetused tsiteeritakse. Vanade, asendatud ülesannete sobivushinnanguid ei omistata uutele ülesannetele.

## Arendamine ja kordamine

Käivita paketi/hoidla juurest Node.js-iga:

```text
node lahtekood/validate.cjs
node lahtekood/test-validation.cjs
node lahtekood/build-pages.cjs
node lahtekood/test-browser.cjs dist/index.html
node lahtekood/report.cjs
```

Tavaline HTML-i ehitus ei vaja npm-sõltuvusi. Brauseritest vajab Playwright 1.62.1 ja Chrome'i; CI paigaldab Chromiumi ning kasutab `MALENURK_BROWSER=chromium`. Toetatud on ka `msedge`. Kohaliku Windowsi liivakasti allalaadimispiirangu tõttu tehti tegelikud failitestid eraldi ajutises Chrome'i profiilis väljaspool liivakasti.

Sõltumatu auditi jaoks paigalda Python 3 ja `python -m pip install -r lahtekood/audit-requirements.txt`. Sea `STOCKFISH` [ametliku Stockfish 19](https://github.com/official-stockfish/Stockfish/releases/tag/sf_19) binaari täisteeks ning käivita:

```text
python lahtekood/audit-puzzles.py --recheck
```

See kontrollib arhiveeritud 105 algkirjet värske mootorianalüüsiga uuesti. Esmase auditi järel tehti ka see täismahus kordusjooks; kõik 105 läbisid. Kordusjooksu fail on `.work/recheck-report.json`. Stockfish (GPL-3.0) ja python-chess (GPL-3.0-or-later) on arenduskontrolli vahendid; nende binaare või Python-teeke ei pakita õpilase veebilehte.

Uue valimi hankimiseks on `python lahtekood/import-puzzles.py` ja `python lahtekood/audit-puzzles.py`. Esimene loeb ametlikku Zstandard-CSV voogu, teine valib teema-taseme lahtritesse kontrollitud kandidaadid. Avalik allikas muutub aja jooksul, mistõttu selle versiooni täpne kordamine kasutab kaasa pakitud CSV-d. Algkirjeid või õppesisu muutes tuleb sõltumatud kontrollid, mootorianalüüs ja manifest uuendada; sisu SHA-256 seob kontrolli konkreetse ülesandega.

Avaldamisvärav tõkestab vale koguarvu, vale lahtrijaotuse, korduse või sümmeetria/värvivahetuse, kontrollimata/ebaõnnestunud/puuduva auditi ja muudetud sisule aegunud kontrollitõendi. Ka HTML-i ehitaja kontrollib panga ja kaasa pakitavate andmete vastavust.

## GitHub Pagesi avaldamine

Hoidla on **https://github.com/rpallum/malenurk**, veebileht **https://rpallum.github.io/malenurk/**. Olemasolev Pagesi seadistus, hoidla nähtavus ja kujundus säilivad.

`.github/workflows/pages.yml` kontrollib iga main-haru muudatuse järel andmestikku ja avaldamise tõkkeid, ehitab `dist/index.html`-i, lahendab brauseris kogu panga ning avaldab alles seejärel GitHub Pagesis. `deployment.json` sisaldab commit'i ja HTML-i räsi. Viimane samm kontrollib sama veebiaadressi uut commit'i, avalehte, 105 ülesande loendurit, malekäiku, tagasisidet ja treenerilukku. Ebaõnnestunud kontrolli korral uut andmestikku ei avaldata.

Avaldatakse ainult rakenduse HTML-id, `.nojekyll` ja versioonitõend. Testid, mootor, CSV ja kontrollaruanded ei ole rakenduse käivitamise sõltuvused; aruannet saab lugeda GitHubis. Projekti juhistes `AGENTS.md` on nõue pärast parandusi testida, salvestada samasse reposse, oodata avaldamist ja kontrollida avalikku aadressi.

## Tehtud kontrollid ja piirid

- Kõik 105 seisu läbisid chess.js-i, python-chess'i ja Stockfishi kontrolli ning sõltumatu auditi kordusjooksu.
- Brauseris lahendati kõik 105 ülesannet, 235 õpilase käiku ning 20 kontrollitud mati lõppharu; läbis 21 kasutusvoo kontrollrühma.
- Kontrolliti 32 filtrikombinatsiooni, 5/10/kõik valikuid, valet käiku, vihjeid, pikka lahendust, muundumist, tulemusi, parooli, tagasisidet ja allalaadimisi ning arvuti/tahvli/telefoni paigutusi 390–1440 px.
- Internetita testides ei olnud väliseid ressursipäringuid ega JavaScripti käitusvigu.

Mootorianalüüs on piiratud salvestatud sügavuse ja sõlmedega. Matipuud on ammendavad selle käigupiiri sees; materjalipuu tõendab konkreetset plaani selles horisondis. Kõigi seisude edasist täispikka mängu ega kõikide ajalooliste partiide retroanalüüsi ei väideta. Treeneri ja õpilaste kasutuskatse ning raskuste pedagoogiline kalibreerimine on endiselt tegemata.

Codex hankis allikakirjed, koostas valiku, eestikeelse õppesisu ja kontrollskriptid ning käivitas kirjeldatud kontrollid. Kasutaja määras eesmärgi ja nõuded. Autori hilisemat isiklikku analüüsi või õpetaja eksperdihinnangut tuleb dokumenteerida tegelike toimingute järgi; automaatteste ei esitata õpetaja heakskiiduna.
