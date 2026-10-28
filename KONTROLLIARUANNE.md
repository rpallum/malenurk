# Malenurga versiooni 1.1 kontrolliaruanne

Kontrollimise kuupäev: 28.10.2026. Kontrollid viis läbi Codex automatiseeritud skriptide ja brauseriga. Tegemist ei ole maleõpetaja eksperdihinnanguga.

## Versiooni 1.1 muudatused ja uued kontrollid

Muudeti lähtefaile `lahtekood/app.js` ja `lahtekood/style.css`; nende põhjal ehitati uuesti `Malenurk.html`. Täiendati olemasolevat `test-browser.cjs` ning lisati `test-features.cjs`. Ülesannete lähteandmed, nende valideerija ja chess.js-i reegliteek jäid muutmata.

Kõik järgmised uued kontrollid läbisid päris Chrome'is:

- Viis menüüvalikut avavad vastava vaate ja aktiivne valik on tähistatud. Avalehe nupud avavad sama harjutuste valiku ja juhiste vaate nagu menüü.
- Treeneri parooliväli on maskeeritud. Tühi, vale, tühikutest koosnev ja õige parool koos lisatühikuga ei ava töölauda. Täpselt `male2026` avab vaate nii nupu kui Enter-klahviga. Õige parool ei ilmu lehe tekstis ega veateadetes.
- Treeneri vaate renderdus, otsene avamine ning üksikülesande/komplekti käivitamise tegevused järgivad lukku. Vaadete vahel liikumine säilitab ligipääsu sama lehe sees. Väljumine ja lehe värskendamine lukustavad vaate.
- Tagasiside on ligipääsetav ilma paroolita. Vormis on täpselt kaheksa skaalaküsimust, 40 raadionuppu ja neli kohustuslikku tekstivälja. Kõik 12 küsimuse teksti ja numbrit vastavad lähteülesandele. Autori nimi ja mailto-kontakt on õiged.
- Kõik kolm vorminuppu kontrollivad puuduvaid vastuseid. Tühikutest koosnev tekst ei sobi, eestikeelne teade kuvatakse küsimuse juures ja vastav väli saab fookuse. Juba sisestatud vastused säilivad ka menüüvaadete vahel.
- TXT ja JSON sisaldavad kõiki küsimusi ning täielikke vastuseid, sealhulgas täpitähti, reavahetusi, HTML-erimärke ja üle 4000 märgi pikkust tekstivastust. Treeneri sobivushinnang sisaldub ekspordis. Tegelikud TXT- ja JSON-failid laaditi alla ja loeti kettalt tagasi.
- Saatmisnupp loob enne meilitoimingut TXT-faili. Kontrolliti mailto-aadressi `rasmus.pallum@gmail.com`, teemat „Malenurga tagasiside“, käsitsi manustamise ja saatmise juhist ning olukorda, kus meiliprogrammi avamine annab vea. Eraldi allalaadimisnupud jäävad kasutatavaks.
- Kõik kaheksa vaadet mahuvad kuuele ekraanilaiusele 390–1440 pikslit. Kontrolliti ka tahvelarvuti puutesisendit ning võrgupäringute ja JavaScripti vigade puudumist.

Käsud: `node lahtekood/validate.cjs`, `node lahtekood/build.cjs` ja `node lahtekood/test-browser.cjs`. Viimane läbis kokku **19 kontrollrühma**; tulemused on `lahtekood/browser-results.json`. Windowsi käivitusliivakast katkestas ka minimaalse proovifaili allalaadimise. Kogu brauseritest läbis väljaspool seda liivakasti eraldi ajutises brauseriprofiilis, endiselt võrguühenduseta.

Testis peatati välise meiliprogrammi tegelik avamine ja kirja ei saadetud. Mailto-võimaluse toimimine päris kasutaja seadmes sõltub tema seadistatud meiliprogrammist; fail tuleb kasutajal ise manustada ja kiri ise saata. See ei ole serveripõhine kirjasaatmine.

Avalehe, harjutuste valiku, treeneri sisenemise, juhiste ning tagasiside arvuti-, tahvli- ja telefonipaigutuste kuvatõmmised vaadati visuaalselt üle. Füüsilise iPadi või Android-tahvli kasutuskatset ega päris õpetaja eksperdihinnangut ei tehtud.


## Kontrollitav tulemus

`Malenurk.html` on iseseisev HTML-fail. See sisaldab stiile, malendipilte, JavaScripti, 28 ülesannet ja chess.js 1.4.0 teeki. Programmi käivitamiseks ei ole vaja serverit ega võrguühendust.

## Maleülesannete sisukontroll

Kontrolli teeb lähtekoodipaketi `lahtekood/validate.cjs`.

| Kontroll | Tulemus |
| --- | --- |
| FEN-seisude vorming ja lubatud käigud | Kõik 28 läbisid. |
| Kelle kord on käia | Kontrollitud FEN-i ning iga lahenduse käikude kaudu. |
| Algseisu vastase kuningas ei ole juba käiva poole šahis | Kõik 28 läbisid. |
| Näidislahenduste kõik poolkäigud | Kõik seaduslikud. |
| Matt ühe käiguga | Kõik näidislahendused matistavad; alternatiivsed matid arvutatakse samuti. |
| Matt kahe käiguga | Algseisus pole matti ühega; aktsepteeritud algkäikude iga seaduslik kaitse jätab matti andva jätku. |
| Kahvlid ja topeltrünnakud | Näidatud sihtmärgid on tegelikult rünnatud ning nõutud šahh on olemas. |
| Sidumised | Ründaja, eesmine malend ja selle taga olev sihtmärk paiknevad õigel joonel; eesmise malendi eemaldamine avab tagumise sihtmärgi rünnaku. |
| Avastatud rünnak | Ratsu käik annab šahhi ja avab vankri rünnaku lipule. |
| Materjalivõit | Löödud malend ja/või nõutud lõplik materjalivahe kontrollitud. |
| Mitmekäiguline materjalivõit | Kõik kuus näidispoolkäiku seaduslikud; sama plaani materjalivõit kontrollitud ka teiste seaduslike kaitsete vastu. |
| Kaitseülesanded | Šahh tõrjutakse; ainsa kaitse ülesandes on tõesti üks seaduslik vastus. |
| Õhuaken | Mõlemad lubatud etturikäigud võimaldavad ähvardava vankrišahhi järel nimetatud kuningakäiku. |
| Teemade ja tasemete kaetus | Kõik seitse teemat sisaldavad kõiki kolme taset. |
| Peegelvariandid | Käigud ja eesmärgid kontrollitakse uuesti pärast värvide ja ruutude teisendamist. |

Andmestikus on 21 algset koostatud õppeseisu ja seitse värvivahetusega peegelvarianti. Raskusjaotus: 14 keskmist, seitse tugevat ja seitse väga tugevat. Igas teemas on neli ülesannet.

## Brauseri funktsionaalsed testid

Test tehti kohalikust `file:`-aadressist päris Chrome'i brauseris, Playwrightiga ning võrguühenduseta režiimis. Korratav skript asub failis `lahtekood/test-browser.cjs`. Kõik järgmised kontrollrühmad läbisid:

1. Avaleht, kasutusjuhendi avamine/sulgemine ning programmi info.
2. Kõik 32 teema ja taseme filtrikombinatsiooni, arvestades ka valikuid „kõik“.
3. 5, 10 ja kõigi ülesannetega komplekti alustamine ning poolelioleva komplekti lõpetamise kinnitamine.
4. Seadusliku vale käigu ja ebaseadusliku käigu tagasiside; algseis säilib ning lahendust ei avaldata.
5. Vihjete järjest avamine ja piiramine kahe vihjega.
6. Algseisu taastamine koos vihjete ja seniste eksimuste säilitamisega; lauapööre.
7. Lahenduse avamine, selgituse näitamine ning selle arvestamine läbitud, kuid mitte õigesti lahendatud ülesandena.
8. **Kõigi 28 ülesande lahendamine malelaua klikkidega**, sh mustadega mängimine ja etturi muundamised. Komplekti tulemuseks saadi 28 õiget vastust ja 100% edukus.
9. Kahekäiguliste mattide **14 aktsepteeritud lõppharu** kontroll käigukontrolleri kaudu; pelgalt algkäik ei anna lõpetatud tulemust.
10. Kuue poolkäiguga materjalivõidus peab õpilane tegema kõik kolm käiku. Vale vahekäik taastatakse ja enne lõplikku lahendust tulemust ei anta.
11. Muundumise tühistamine ja vale malendi valimine; alamuundamise ülesandes ei aktsepteerita lipuks muundamist ratsu asemel.
12. Malelaua nooleklahvid ja sisestusklahv ning malendi tegelik lohistamine.
13. Treeneri filtrid, ülesande rea avamine, seisu ja lahenduse näitamine, sobivushinnang ning üksikülesande ja filtreeritud komplekti alustamine.
14. Kaheksa skaalaküsimuse ja nelja avatud küsimuse täitmine; TXT- ja JSON-faili allalaadimine ning sisu kontroll. Treeneri sobivushinnang sisaldub failis. Vastused säilivad lehe vaadete vahel liikudes.
15. Kõik neli tulemuste vaate tegevust.
16. Kõik kaheksa põhivaadet (avaleht, harjutuste valik, juhised, harjutamine, treeneri sisenemine, treeneri töölaud, tulemused ja tagasiside) laiustel **390, 620, 768, 820, 1024 ja 1440 pikslit**: külgsuunalist ülejooksu ei esinenud.
17. Tahvelarvuti puuteekraaniga brauserikontekstis malendi ja sihtruudu puudutamine.
18. JavaScripti käitusvigu ei registreeritud; programmi töö ajal ei tehtud ühtegi välist ressursipäringut.

Brauseri koondlogi on lähtekoodipaketi failis `browser-results.json`. Ülesannete kaupa kontrolli logi on `validation.json`. Testimisel loodud näidishinnangud ei ole päris õpetaja hinnangud ning neid ei kaasata kasutajale mõeldud paketti.

## Visuaalne ja keeleline ülevaatus

Avalehe ja harjutusvaate kuvatõmmiseid vaadati üle arvuti-, tahvelarvuti- ja telefonimõõdus. Kontrolliti malelaua loetavust, nuppude paigutust, tekstide mahtumist ja väikese ekraani ümberpaigutust. Kasutajale nähtavad eestikeelsed tekstid loeti üle. Peegelvariantides parandati ka ruutude, etturilöögi lähteliini ja liininimetuste teisendamine.

## Tõenduse piirid

- Automaatkontroll ei ole sõltumatu maleõpetaja hinnang. Raskusastmete pedagoogiline sobivus vajab veel eksperdi ja soovi korral õpilaste tagasisidet.
- Male tehnilised kontrollid kasutavad sama chess.js-i teeki; teise sõltumatu malemootoriga ristkontrolli ei tehtud.
- Testiti loodud ülesannete seaduslikkust ja kirjeldatud taktikalist eesmärki, mitte kõigi seisude ajaloolist päritolu mõnest pärispartiist.
- Mittemati ülesannetes kontrollitakse etteantud taktikalist varianti, mitte iga võimalikku head alternatiivi.
- Puuteekraani kontroll kasutas brauseri puuterežiimi. Füüsilise iPadi või Android-tahvli failihalduri, Safari ning Firefoxiga pole eraldi katset tehtud.
- Ühtegi õpetaja eksperdihinnangut ega 3–5 õpilasega kasutuskatset ei ole veel läbi viidud. Tagasisidevorm on selleks valmis.

