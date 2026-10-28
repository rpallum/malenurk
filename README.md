# Malenurk

Eestikeelne maleharjutuste veebiprogramm. Versioon 1.2, 28.10.2026.

## Kiire käivitamine

1. Salvesta **Malenurk.html** oma arvutisse või tahvelarvutisse.
2. Ava see brauseriga, näiteks Chrome'i, Edge'i, Firefoxi või Safariga. Arvutis piisab enamasti topeltklõpsust. Vajaduse korral vali „Ava rakendusega“ ja brauser.
3. Vajuta „Alusta harjutamist“, vali tase, teema ja ülesannete arv ning vajuta „Läheme lauale“.

Paigaldamist, serverit, kontot, andmebaasi ega internetiühendust ei ole vaja. Kõik vajalik on selles ühes HTML-failis. ZIP-pakett tuleb enne avamist lahti pakkida. Tahvelarvutis tuleb fail avada JavaScripti toetavas brauseris: mõne failihalduri staatiline eelvaade ei käivita veebiprogramme. Kui seadme failirakendus ei paku HTML-i brauseris avamist, tuleb kasutada failide avamist toetavat brauserit või failihaldurit.

**Harjutustulemused ja salvestamata muudatused kaovad lehe värskendamisel. Kinnitatud tagasiside taastub samas vahelehes sessionStorage’ist.** Püsiva koopia jaoks laadi kinnitatud hinnang eraldi alla.

## Uus versioon 1.2

Säilivad Malenurga kreemikas ja roheline kujundus, logo, kirjatüübid, avalehe pealkiri ning kõik 28 kontrollitud maleülesannet. Ülamenüü sisaldab viit valikut: **Avaleht**, **Harjutused**, **Juhised**, **Treeneri vaade** ja **Tagasiside**. Aktiivne valik on tähistatud; harjutamise ja tulemuste ajal on aktiivne „Harjutused“. Väiksemal ekraanil jaguneb menüü mitmele reale.

„Alusta harjutamist“ avab eraldi harjutuste valiku. Taseme, teema ja arvu valik ning tegeliku ülesannete arvu näit kasutavad endiselt sama loogikat. „Kuidas see käib?“ ja menüü „Juhised“ avavad sama juhiste lehe. Seal selgitatakse käike, lohistamist, klaviatuuri, vihjeid, korduskatseid, lahenduse avamist, mitmekäigulisi ülesandeid, muundamist, malenditähiseid ja tulemusi.

### Treeneri vaate avamine

1. Vali ülamenüüst „Treeneri vaade“.
2. Sisesta salasõna `male2026` ja vajuta „Sisene treeneri vaatesse“ või Enter-klahvi. Parool peab täpselt klappima; lisatud tühikud ei sobi.
3. Treeneri olemasolevad filtrid, seisud, vihjed, lahendused, sobivushinnangud ja komplekti käivitamine jäävad alles.
4. „Välju treeneri vaatest“ lukustab vaate uuesti. Ka lehe värskendamine või sulgemine lõpetab ligipääsu. Teiste menüüvaadete külastamine sama avatud lehe sees ei logi välja.

**See on kasutajaliidese ligipääsupiirang, mitte turvaline autentimine.** Programm töötab ühe kohaliku HTML-failina ilma serverita. Parool, ülesannete seisud ja lahendused on faili lähtekoodis loetavad ning tehniliselt teadlik kasutaja saab piirangust mööduda. Neid ei saa selle lahendusega salajas hoida. Parooli ei kuvata lehe tekstis ega veateates. Ligipääsuolekut ei salvestata localStorage'isse, küpsisesse ega mujale püsivalt.

### Tagasiside salvestamine ja allalaadimine

„Tagasiside“ ei nõua treeneri parooli. Lehel on autori nimi **Rasmus Pallum** ja klõpsatav kontakt **rasmus.pallum@gmail.com**. Küsimused **1–8 on kohustuslikud**: igale väitele tuleb valida üks hinne 1–5. Küsimused **9–12 on vabatahtlikud**; tekstiväljad võivad jääda tühjaks. Hindaja nimi on samuti vabatahtlik.

1. Täida vähemalt kaheksa skaalaküsimust ja vajuta **Saadan oma tagasiside**. Puuduva kohustusliku vastuse korral ilmub küsimuse juurde eestikeelne teade ja vastav väli saab fookuse. Juba sisestatud vastused jäävad alles.
2. Korrektne vorm salvestatakse selle brauserivahelehe `sessionStorage`-isse. Rakendus kontrollib kirjutamise järel salvestatud andmed tagasi lugedes üle. Alles õnnestunud salvestamise järel muutub sama nupu tekstiks **Hinnang salvestatud** ja nupu alla ilmub heleroheline teade **„Aitäh! Hinnang on selles brauseriseansis talletatud.“**
3. Kinnitamine **ei laadi faili alla ega ava meiliprogrammi**. Vastused jäävad kohalikult brauserisse; neid ei saadeta autorile.
4. Pärast salvestamist ilmuvad eraldi nupud **Laadi alla .txt** ja **Laadi alla .csv**. Fail luuakse ainult valitud allalaadimisnupu vajutamisel. Mõlemad failid sisaldavad kõiki 12 küsimust koos viimati salvestatud vastustega. Vabatahtlike küsimuste tühjad vastused on lubatud. Kaasatakse ka salvestamise hetke treeneri üksikülesannete sobivushinnangud, kui neid on.
5. Vastuste või kaasatavate sobivushinnangute muutmisel kuvatakse **Muudatused salvestamata**, põhinupp muutub tagasi kujule **Saadan oma tagasiside** ning allalaadimisnupud peidetakse ja blokeeritakse. Salvesta muudatused enne eksportimist uuesti. Eksportija kasutab kinnitatud hinnangu koopiat ja ei ekspordi salvestamata mustandit.

Salvestatud vastused taastatakse sama brauserivahelehe lehevärskenduse järel. Vaadete vahel liikudes jääb alles ka salvestamata mustand. Värskendamisel kaob salvestamata mustand ning taastub viimane kinnitatud hinnang. Tavapäraselt lõpeb seanss vahelehe sulgemisel; brauseri seansi taastamise funktsioon võib seansiandmeid taastada. See salvestus ei ole pikaajaline arhiiv. Püsiva koopia jaoks kasuta eraldi allalaadimist.

Kui brauser keelab seansiandmete salvestamise või salvestusmaht saab täis, kuvatakse eestikeelne veateade ja vastused jäävad vormi alles. Edukat salvestamist ei kinnitata. Vigane või kättesaamatu varasem salvestus ei takista ülejäänud programmi kasutamist. Kohaliku `file:`-aadressi seansisalvestuse tugi sõltub brauserist; seda kontrolliti Chrome'is. Treeneri paroolilukk ja harjutustulemused jäävad endiselt ainult lehe töömällu ning neid värskendamisel ei taastata.

TXT ja CSV on UTF-8 kodeeringus koos BOM-iga. CSV eraldaja on semikoolon; kõik väljad on jutumärkides, välja sees olev jutumärk dubleeritakse ning reavahetused jäävad tsiteeritud välja sisse. Failis on päis `Number;Küsimus;Vastus`, kõik 12 vastuserida, hindaja ja salvestusaeg ning vajaduse korral treeneri sobivushinnangud. Eesti täpitähed ja pikad vastused säilivad. JSON-allalaadimine ja automaatne meiliprogrammi avamine on asendatud kohaliku kinnitamise ning eraldi TXT/CSV-nuppudega.

### Versiooni 1.2 muudatused ja kontrollid

- Muudeti `lahtekood/app.js` ja `lahtekood/style.css`: kaheksa kohustuslikku skaalavastust, neli vabatahtlikku tekstivastust, kinnitamine ja taastamine sessionStorage'ist, salvestatud/muudetud/vea olekud ning eraldi TXT- ja CSV-eksport. Praegune kujundus, menüü, treenerilukk ja harjutuste loogika säilitati.
- Lisati `lahtekood/test-feedback.cjs` ning uuendati `test-features.cjs` ja `test-browser.cjs`. Test kontrollib iga puuduva kohustusliku vastuse tõkestamist, täpseid nupu- ja teavitetekste, allalaadimiste puudumist kinnitamisel/avamisel/värskendamisel, taastamist, uut salvestust, salvestustõrkeid ja aegunud mustandi ekspordi takistamist.
- Kontrolliti CSV andmete tagasilugemist, sealhulgas semikoolonit, koma, jutumärke, reavahetusi, tühje vastuseid, täpitähti ja üle 4000 märgi pikkust teksti. Tegelikud TXT/CSV-failid laaditi alla ja loeti kettalt tagasi; kontrolliti ka UTF-8 BOM-i ja treeneri sobivushinnangu kaasamist.
- `node lahtekood/validate.cjs` läbis kõik 28 seisu ja taktikalise eesmärgi kontrolli. `node lahtekood/build.cjs` ehitas lähtefailidest uue iseseisva `Malenurk.html` faili.
- `node lahtekood/test-browser.cjs` läbis kõik **23 kontrollrühma** Chrome'is, võrguühenduseta ja kohalikust `file:`-aadressist. Windowsi piiratud käivitusliivakast katkestab failiallalaadimised, mistõttu kogu test käivitati eraldi ajutise brauseriprofiiliga väljaspool seda liivakasti.
- Endiselt kontrolliti kõiki 28 ülesannet, 14 alternatiivset matiharu, kuue poolkäiguga lahendust, treenerilukku, kõiki kaheksat vaadet laiustel 390–1440 pikslit, tahvelarvuti puutesisendit ning JavaScripti vigade ja väliste ressursipäringute puudumist.

Täpsem ülevaade on failis `KONTROLLIARUANNE.md`. Automaatkontrollid ja testvastused ei ole päris õpetaja eksperdihinnang. Õpetaja ega õpilaste kasutuskatset ei ole selle arendusega tehtud.


## Eesmärk ja sihtrühm

Malenurk toetab taktikalist mõtlemist ning annab õpilasele võimaluse lahendada seisu, eksida, saada astmelisi vihjeid ja mõista lahenduse põhjendust. Keskkond sobib iseseisvaks harjutamiseks ning treeneri juhendatud tegevuseks.

Sihtrühm on 9–12-aastased noored, kes on õppinud malet treeninguna vähemalt kolm aastat. Eeldatakse malendite liikumise, täispika partii ja lihtsamate taktikaliste võtete tundmist. Programm ei õpeta malekäike algusest. Lihtsamad ülesanded sobivad soojenduseks; keerukamad nõuavad ohvri, alamuundamise, avastatud rünnaku või mitmekäigulise plaani märkamist.

Algversiooni raskusastmed on **esialgsed õppetasemed**, mitte ametlik reiting ega tõendatud vastavus konkreetsele treeningrühmale. Kogenud õpilasele võivad mõned keskmise taseme ülesanded olla väga kerged. Treener peaks raskusastmeid ning tegelikku sobivust hindama enne õppeuuringus kinnitatud sobivuse väitmist.

## Vaated ja funktsioonid

- **Avaleht:** programmi tutvustus, näidisülesanne ning nupud eraldi harjutuste ja juhiste lehele.
- **Harjutused:** olemasolevad taseme, teema ja ülesannete arvu valikud ning tegeliku saadaoleva arvu näit.
- **Juhised:** eraldi loetav kasutusjuhend koos malenditähiste ja tulemuste selgitusega.
- **Harjutamine:** klõpsatava ja lohistatava malendlauaga ülesanded, seaduslike sihtruutude tähised, lauapööre, algseisu taastamine ja edenemine. Puuteekraanil vali malend ja seejärel sihtruut. Etturi muundumisel vali lipp, vanker, oda või ratsu.
- **Vihjed:** kaks eraldi avatavat vihjet iga ülesande kohta. Esimene suunab ideele, teine aitab valida malendit või käigutüüpi.
- **Harjutuse tagasiside:** vale käik taastatakse ja õiget vastust ei avaldata. Lahenduse avamine on eraldi tegevus. Õige vastuse või avatud lahenduse järel näidatakse käike, selgitust, teemat, taset ning vihjete ja eksimuste arvu.
- **Tulemused:** läbitud ja õigesti lahendatud ülesannete arv, edukus, vihjed ning teemade ülevaade. Saab korrata sama komplekti, valida raskema taseme, korrata keerulisi teemasid või naasta avalehele.
- **Treeneri vaade:** tööseansi parooliga avatavad kõik ülesanded, teema- ja tasemefiltrid, seisud, FEN, lahendused, vihjed, üksiku ülesande või valitud komplekti käivitamine ning sobivushinnang.
- **Tagasiside:** avalik vorm kaheksa kohustusliku skaalaküsimuse ja nelja vabatahtliku tekstivastusega. Kinnitamine salvestab hinnangu sessionStorage’isse ilma faili või meiliprogrammi avamata. Pärast kinnitamist saab salvestatud hinnangu eraldi TXT- või CSV-failina alla laadida. Muudatuste järel tuleb enne eksportimist uuesti salvestada.

Kõik kasutajale nähtavad tekstid on eesti keeles. Malekäigud kasutavad eestikeelseid malenditähti: K – kuningas, L – lipp, V – vanker, O – oda, R – ratsu. x tähistab lööki, + šahhi ja # matti. Sisemised UCI-käigud ja FEN kasutavad rahvusvahelist tehnilist kuju.

## Ülesannete valik ja tulemuste tähendus

Valida saab keskmise, tugeva ja väga tugeva taseme või kõik tasemed; ühe seitsmest teemast või kõik teemad; 5, 10 või kõik valikule vastavad ülesanded.

Igas teemas on neli ülesannet: kaks keskmist, üks tugev ja üks väga tugev. Seetõttu sisaldab ühe teema komplekt maksimaalselt nelja ülesannet ning ühe teema ja ühe raskusastme valik üht või kaht. Kui tellitud 5 või 10 ülesannet pole saada, kuvatakse tegelik arv enne alustamist ja kasutatakse kõiki sobivaid ülesandeid. Ülesandeid ei dubleerita komplekti täitmiseks.

Komplekt liigub lihtsamast keerulisemani. Sama taseme algsed seisud tulevad enne nende peegelvariante. Ajapiirangut ei ole.

- Õigeks loetakse õpilase lõpuni leitud lahendus, ka vihje järel või pärast eksimust.
- Avatud lahendus loetakse läbituks, kuid mitte õigesti lahendatuks.
- Edukus = õigesti lahendatud ülesannete arv / läbitud ülesannete arv × 100; protsent ümardatakse täisarvuni.
- Eraldi näidatakse, mitu ülesannet lahendati esimesel katsel ja vihjeta.
- Eksimuste arv loendab seaduslikke, kuid ülesande eesmärgile mittevastavaid käike. Ebaseaduslik katse annab juhise ega suurenda seda arvu.
- „Korda keerulisi teemasid“ võtab teemad, milles avati lahendus, kasutati vihjet või tehti eksimus, ning alustab nende kõigi ülesannetega uut komplekti.
- Kui keerulisi teemasid ei tekkinud, viib see nupp järgmise harjutuskorra valikusse väga tugevale tasemele.
- „Harjuta keerulisemaid ülesandeid“ valib senise komplekti kõrgeimast tasemest järgmise. Väga tugev on viimane aste; selle järel jääb valituks väga tugev.

Teemade võrdlus põhineb ainult ühel harjutuskorral. Väikese ülesannete arvu põhjal ei hinnata üldist maletugevust.

## Tehniline lahendus ja lühike plaan

Teostusjärjekord oli: vaated ja kujundus → seisude koostamine ja kontroll → malelaud ja vastuste kontroll → vihjed ja selgitused → tulemused → treeneri vaade ja eksperdivorm → automaat- ja brauseritestid → parandused.

Kasutatud on HTML-i, CSS-i ja JavaScripti. Kujundus ja malendite SVG-pildid asuvad HTML-is. Väliseid fonte, pildifaile ega CDN-päringuid käivitamisel ei kasutata. Harjutuskord ja treeneri ligipääs püsivad JavaScripti mälus. Kinnitatud tagasiside salvestatakse sessionStorage’i võtmega `malenurk.feedback.v1` ja taastatakse sama vahelehe värskendamisel. localStorage’i, küpsiseid, kasutajakontosid ega andmete saatmist ei kasutata.

**Väline teek:** chess.js 1.4.0, BSD-2-Clause, autor Jeff Hlywa. Teeki kasutatakse seaduslike käikude, kuninga ohutuse, šahhi ja mati kontrolliks. Selle kasutamine vähendab ise kirjutatud malereeglite vigade ohtu. Teek on tervikuna HTML-i sisse pakitud, mistõttu töö ei sõltu võrguühendusest ega välise teenuse saadavusest. Allikas ja dokumentatsioon: [chess.js GitHubis](https://github.com/jhlywa/chess.js). Litsentsi täielik tekst on HTML-i kommentaaris ja lähtekoodipaketis.

See teek ei ole positsiooni tugevust hindav tehisintellekt. Vabamängu arvutivastast ei ole.

## Andmestruktuur ja lahenduste kontroll

Lähtekoodis asub ülesannete andmestik failis `lahtekood/data.cjs`. Iga algkirje sisaldab:

```js
[
  id,              // kordumatu tähis
  topic,           // mate1, mate2, fork, pin, double, material või defence
  level,           // 0 = keskmine, 1 = tugev, 2 = väga tugev
  title,           // eestikeelne pealkiri
  spec,            // nt "K:g1 R:d1 k:g8 p:f7 p:g7 p:h7"
  solution,        // UCI-käikude massiiv, nt ["d1d8"]
  question,        // küsimus õpilasele
  hints,           // kaks järjest avatavat vihjet
  explanation,     // selgitus pärast lahendamist
  rule             // kontrollitav taktikaline eesmärk
]
```

`spec` kasutab valgete jaoks suuri ja mustade jaoks väikseid rahvusvahelisi malenditähti K/Q/R/B/N/P. `probe.cjs` teisendab selle FEN-seisuks. UCI-s on näiteks `e7d8q` etturi muundumine lipuks ning `d7d8n` ratsuks. Pärast ettevalmistamist on brauseri andmestik selgete väljadega objektide massiiv `MALENURK_DATA.PUZZLES`, mitte positsioonipõhine kasutajaliidese erikood.

Andmestikus on **21 algset selle programmi jaoks koostatud õppeseisu ja 7 värvivahetusega 180° pööratud õppevarianti**. Seega pole tegemist 28 sõltumatu taktikalise motiiviga. Keskmise taseme peegelvariandid aitavad sama ideed mustadega ära tunda. Ruudud, käigud, etturilöökide algusliinid, liininimetused ja selgitused teisendatakse koos seisuga.

Kontrollimeetodid:

1. Kõik vastused peavad olema chess.js-i järgi seaduslikud. Oma kuningat ei tohi jätta šahhi. Vastase kuningas ei tohi algseisus juba käiva poole rünnaku all olla.
2. Matt ühe käiguga: aktsepteeritakse iga selles seisus seaduslikku matti andvat käiku.
3. Matt kahe käiguga: ettevalmistamisel vaadatakse läbi võimalikud algkäigud, iga algkäigu järel **kõik vastase seaduslikud kaitsed** ning nende järel kõik matti andvad käigud. Aktsepteeritakse kõiki nii leitud sundmativõtmeid ja valitud kaitseharu kõiki matistavaid jätke. Esimene õige käik ei lõpeta ülesannet. Rakendus teeb ühe kontrollitud vastasekäigu ja ootab õpilase teist käiku.
4. Kahvlite ja topeltrünnakute puhul kontrollitakse nimetatud sihtmärkide tegelikku rünnatust; avastatud rünnakus ka avanevat liini ja šahhi.
5. Sidumistes kontrollitakse ründajat, eesmist malendit ja selle taga olevat kuningat või lippu. Suhtelist sidumist ei esitata automaatse materjalivõiduna.
6. Materjalivõidus kontrollitakse löödud malendit ja/või lõppseisu materjalivahet. Kuue poolkäiguga ülesandes peab õpilane tegema ise kõik kolm õiget käiku. Selle ülesande puhul kontrolliti ettevalmistamisel ka teiste seaduslike kaitsete järel sama plaani vähemalt nelja etturi suurust materjalivõitu.
7. Kaitseülesannetes kontrollitakse šahhi tõrjumist; ainsa kaitse ülesandes ka vastuse ainulisust. Õhuakna ülesandes kontrollitakse, et ähvardav šahh on seaduslik ning kuningal on seejärel lubatud põgenemiskäik. Lubatud on nii h3 kui ka h4.

Mittemati ülesannetes kontrollib programm ette antud konkreetset eesmärki ja käiguvarianti, mitte kõiki maleliselt häid käike. Mitmekäigulises materjalivõidus mängitakse ette üks kaitsevariant; see ei ole üldine analüüsimootor ega vabalt hargnev treenerianalüüs.

## Uute ülesannete lisamine

Tavaliseks kasutamiseks pole Node.js-i ega lähtekoodi vaja. Järgmised juhised on programmi täiendajale. Lähtekood on hoidla ja ZIP-paketi kaustas `lahtekood/`.

1. Lisa faili `data.cjs` massiivi `seeds` uus kirje eespool kirjeldatud väljadega. Kasuta kordumatut ID-d ja olemasolevat teemat.
2. Määra seaduslik seis, lahendus, kaks vihjet, selgitus ja sobiv `rule`. Kasuta eeskujuks sama ülesandetüübi olemasolevat kirjet. Tavalise algkirje puhul käivad valged. Keskmise taseme kirjest luuakse automaatselt ka mustade peegelvariant.
3. Ühe käigu matt kasutab `{kind: 'mate1'}` ja kahe käigu matt `{kind: 'mate2'}`. Muude tüüpide kontrolliväljade näited on olemasolevates kirjetes: `targets`, `front`, `back`, `captured`, `minGain`, `check`, `only` jms.
4. Mitmekäiguline `solution` peab sisaldama vaheldumisi kõigi poolte käike. Õpilane teeb oma käigud, rakendus teeb vastase ette määratud käigud. Matt kahe käiguga kasutab eraldi täielikult kontrollitud kaitsepuud.
5. Käivita paketi juurkataloogis Node.js-iga:

```text
node lahtekood/validate.cjs
node lahtekood/build.cjs
```

Esimene käsk kontrollib sisu ning loob `checked-data.json` ja `validation.json`. Teine ehitab paketi juurkausta uue iseseisva `Malenurk.html` faili. Kasuta ehitust ainult pärast edukat kontrolli. Uus ülesanne ei vaja kasutajaliidese ümberkirjutamist. Täiesti uue taktikalise eesmärgi jaoks tuleb lisada ka selle sisuline kontroll ja testid.

6. Ava uus HTML, lahenda uus ülesanne ja lase treeneril vaadata üle sisu ning raskusaste. Automaatkontroll ei asenda pedagoogilist hinnangut ega tõesta seisu ajaloolist päritolu.

Lähtefailid on loetavad ega vaja koodiminimeerimist või npm-pakette tavalise HTML-i ehitamiseks. Brauseritesti kordamiseks on vaja eraldi Playwrighti ja Chrome'i. Soovi korral paigalda lähtekoodikaustas `npm install --no-save playwright`, seejärel käivita paketi juurest `node lahtekood/test-browser.cjs`. Vaikimisi kasutatakse Chrome’i; muu toetatud kanali saab valida keskkonnamuutujaga `MALENURK_BROWSER` (näiteks `msedge`). Test kaasab automaatselt ka `test-features.cjs` ja `test-feedback.cjs`. Tagasiside test kontrollib, et kinnitamine ei käivita allalaadimist ega meiliprogrammi. Brauseritest on praeguse 28 ülesandega versiooni regressioonitest; andmestiku suuruse muutmisel tuleb uuendada ka selle arvulisi ootusi.

## Raskusastmete põhimõtted

| Tase | Valiku lähtekoht |
| --- | --- |
| Keskmine | Üks selge idee: tagumise rea matt, kahvel, absoluutne sidumine, muundumine või šahistava malendi eemaldamine. Kahekäigulises matis kooskõlastavad tööd kuningas ja lipp. |
| Tugev | Malendite koostöö, vastulöögi arvestamine, piiratud kuninga matistamine, kaitstud siduja, kahe diagonaali kasutamine või õhuakna mõte. |
| Väga tugev | Lipuohvriga matt, alamuundamine, suhteline sidumine, avastatud rünnak, kuue poolkäiguga materjalivõit või ainsa kaitse arvutamine. Ühekäigulise mati näites tuleb märgata kaitsvat oda ja löögiruudu ohutust. |

Tasemed arvestavad lahenduse ideed, malendite koostööd ja arvutatavaid jätke, mitte ainult malendite arvu. Teemade vahel pole sama raskusastme tegelik võrdsus veel empiiriliselt kinnitatud.

## Kontrollimine

Lisatud `KONTROLLIARUANNE.md` kirjeldab läbiviidud kontrolle. Kontrolliti kogu andmestikku ning päris Chrome'i brauseris lahendati kõik 28 ülesannet malelaua kaudu. Kontrolliti ka alternatiivseid mattide harusid, valet vahekäiku, eksporti, puutesisendit, lohistamist ja kõiki kaheksat põhivaadet ekraanilaiustel 390–1440 pikslit. Brauser oli võrguühenduseta; väliseid ressursipäringuid ja JavaScripti käitusvigu ei tekkinud.

Visuaalselt vaadati üle avaleht ja harjutusvaade arvuti-, tahvelarvuti- ja telefonipaigutuses. Eestikeelsed kasutajatekstid vaadati üle; see ei ole sõltumatu keeletoimetuse kinnitus. Füüsilistel iPadidel ja Android-tahvlitel ning Safari/Firefoxiga ei ole eraldi kasutuskatset tehtud.

## Piirangud ja edasiarendus

- Andmestik on väike ja sisaldab õppimiseks koostatud hõredaid seise. Võrreldes tervikliku partiiseisuga on otsinguruum piiratum.
- Seitse ülesannet on olemasolevate seisude värvivahetusega variandid. Õppeefekti tuleks hinnata koos treeneriga.
- Kõik tehnilised kontrollid kasutavad sama chess.js-i reeglimootorit; sõltumatu teise malemootoriga ristkontrolli ei tehtud.
- Teemad ja raskusastmed on esialgsed. Ükski lapse või õpetaja hinnang ei ole veel kogutud.
- Mittemati ülesannete kontroll ei aktsepteeri suvalist head käiku ega paku positsiooni üldhinnangut.
- Korraga mängitakse üks kontrollitud kaitseharu. Treener saab teisi harusid uurida eraldi.
- Andmed püsivad aktiivse lehe mälus. Harjutuskorra jätkamist pärast lehe sulgemist, kontosid, paremusjärjestust ega pilvesalvestust pole.
- Vastused jäävad kohalikku brauseriseanssi. Autorile edastamiseks tuleb hinnang eraldi alla laadida ja fail ise edastada; vorm ei saada andmeid ega ava meiliprogrammi.
- Tahvelarvuti failihaldur võib piirata kohaliku HTML-i avamist; programm vajab päriselt JavaScripti käivitavat brauserit.

Võimalikud edasiarendused on suurem sõltumatult kontrollitud ülesandepank, treeneri tagasiside põhjal ümber kalibreeritud raskusastmed, terviklikumad partiiseisud, õpilase võimalus valida vastase kaitseharu, kohalik failipõhine edenemise salvestamine ning sisukam harjutuste järjestamine.

## Codexi kasutamine

**Milleks Codexit kasutati?** Codex luges kasutaja lähteülesannet, pakkus tehnilise struktuuri ja kujunduse, kirjutas HTML-i, CSS-i ja JavaScripti, koostas algse ülesandepanga ning selle automaatkontrollid, lisas treeneri vaate ja hinnanguvormi ning käivitas brauseritestid. Samuti koostas Codex selle dokumentatsiooni ja kontrolliaruande.

**Millised lahendused pakuti?** Üks internetita töötav HTML, kohalikult kaasa pakitud chess.js, selge ülesannete andmestruktuur, ette arvutatud kahekäigulise mati kaitsepuud, etapiviisiline käikude kontroll, kahes astmes vihjed ja kohalik hinnangufaili eksport.

**Mida kontrolliti või parandati?** Koostatud seise kontrolliti enne kasutajaliidesega ühendamist. Ainsa kaitse ülesandes muutis esialgne ratsu asukoht oda tegevusliini; see parandati ja vastuse ainulisust kontrolliti uuesti. Peegelvariantides parandati ruutude kõrval ka etturilöögi algusliini ning liininimetuse teisendamine. Mustadega algava variandi käigunumbrid parandati. Mitmekäigulise materjalivõidu jaoks lisati iga õpilase käigu eraldi kontroll ning test, mis ei luba esimese õige käigu järel tulemust anda. Klaviatuurikasutuse paranduseks säilitatakse valitud ruudu fookus vaate uuendamisel.

**Milline oli autori enda roll?** Kasutaja esitas põhjaliku lähteülesande: eesmärgi, sihtrühma, teemad, vaated, vihjete ja tagasiside põhimõtted, tehnilised piirangud ning hindamise vajaduse. Lähteülesandes kirjeldatud maletreeneri, kohtuniku ja EKR 3 kutse taotlemise tausta käsitleti kavandamise lähtealusena, mitte käesoleva programmi tehtud hindamise tõendina. Ülesannete algse tehnilise ja sisulise mustandi koostas selles etapis Codex. Autori isiklikku ülesannete järelkontrolli, seisuvalikut või klassis katsetamist ei saa praegu toimunuks märkida.

UPT autoril tuleks dokumenteerida oma tegelik jätkutöö: millised ülesanded ta ise läbi analüüsis, milliseid lisas või eemaldas, kuidas tasemeid muutis, kuidas korraldas eksperdihinnangu ja mille põhjal programmi täiustas. Nii on tema panus kontrollitav ning eristatav automaatselt loodud teostusest.

**Kuidas kontrolliti maleülesandeid?** Meetodid on eespool: seaduslikud FEN-seisud, kõigi lahenduskäikude kontroll, mattides kaitsete läbivaatus, rünnakute ja sidumiste kontroll, materjalivahe ning brauseri läbimäng. Need on tehnilised ja sihitud sisukontrollid, mitte veel sõltumatu maleõpetaja ekspertiis.

**Millised muudatused tehti õpetaja tagasiside järel?** Selle versiooni loomise ajal õpetaja eksperdihinnangut ei kogutud. Seetõttu ei ole selle põhjal tehtud muudatusi. Ära esita automaatteste õpetaja hinnanguna.

Pärast päris hinnangu saamist täida järgmine tabel tegelike andmetega:

| Kuupäev | Hindaja märkus | Autori otsus ja põhjendus | Tehtud muudatus | Järelkontroll |
| --- | --- | --- | --- | --- |
| Täita pärast hinnangu saamist | | | | |

Esialgseks hindamiseks piisab ühest maleõpetajast. 3–5 sihtrühma õpilasega kasutuskatse on võimalik järgmine samm, mitte juba tehtud töö.

## Paketi failid

| Fail | Otstarve |
| --- | --- |
| `Malenurk.html` | Kogu töötav programm; tavakasutajale piisab sellest. |
| `README.md` | Kasutusjuhend, tehniline kirjeldus ja UPT dokumentatsiooni alus. |
| `KONTROLLIARUANNE.md` | Läbiviidud kontrollid ja nende piirid. |
| `lahtekood/` ZIP-paketis | Muudetavad lähtefailid, kaasa pakitud teek, litsents ning korratavad kontrollskriptid. |

