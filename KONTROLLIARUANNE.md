# Malenurga versiooni 1.0 kontrolliaruanne

Kontrollimise kuupäev: 28.10.2026. Kontrollid viis läbi Codex automatiseeritud skriptide ja brauseriga. Tegemist ei ole maleõpetaja eksperdihinnanguga.

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
16. Kõik viis põhivaadet laiustel **390, 620, 768, 820, 1024 ja 1440 pikslit**: külgsuunalist ülejooksu ei esinenud.
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

