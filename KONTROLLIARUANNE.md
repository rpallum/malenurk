# Malenurga versiooni 1.2 kontrolliaruanne

Kontrollimise kuupäev: 28.10.2026. Kontrollid viis läbi Codex automatiseeritud skriptide ja brauseriga. Tegemist ei ole maleõpetaja eksperdihinnanguga.

## Versiooni 1.2 tagasisidevormi kontrollid

Muudeti `lahtekood/app.js` ja `lahtekood/style.css`, lisati `test-feedback.cjs`, kohandati olemasolevaid brauseriteste ning ehitati uuesti `Malenurk.html`. Maleülesannete lähteandmed, valideerija ja reegliteek jäid muutmata.

Chrome'i brauseris kontrolliti järgmisi kasutusvooge:

- Vormis on kaheksa kohustuslikku 1–5 skaalaküsimust ning neli vabatahtlikku tekstivälja. Iga küsimuse 1–8 puuduv vastus eraldi takistab salvestamist, kuvab eestikeelse teate ja viib fookuse õigesse välja. Küsimused 9–12 võivad jääda tühjaks või sisaldada ainult tühikuid.
- Kinnitamisel toimub päris sessionStorage'i kirjutus ja tagasilugemine. Alles selle õnnestumisel muutub tekst „Saadan oma tagasiside“ tekstiks „Hinnang salvestatud“ ning kuvatakse nõutud tänuteade. Kinnitamine ei loo Blob-faili, ei käivita allalaadimist ega ava mailto-linki.
- Vastused taastuvad pärast lehe värskendamist sama vahelehe sees. Sõltumatus uues vahelehes pole hinnang kinnitatud. Vaadete vahel jääb alles ka mustand; salvestamata mustandi värskendamisel taastub eelmine kinnitatud hinnang.
- Muutmisel kuvatakse „Muudatused salvestamata“, kinnitatud olek ja allalaadimisnupud peidetakse ning eksport on ka kontrolleri kaudu blokeeritud. Uuesti salvestamine kinnitab uue vastusekomplekti.
- Sunnitud salvestusmahu veal, kirjutust eiraval salvestusel, blokeeritud sessionStorage'il ja vigasel varasemal JSON-il ei kuvata ekslikku edu. Rakendus jääb kasutatavaks, vastused säilivad vormis ning õnnestuv korduskatse taastab kinnitatud oleku.
- Eraldi TXT- ja CSV-nupud on nähtavad pärast kinnitamist ning käivitavad just valitud faili allalaadimise. Vormi avamine, kinnitamine, vaatevahetus ja lehe värskendamine ei käivita allalaadimisi.
- Mõlemas failis on kõik 12 küsimust ja salvestatud vastused. CSV loeti testis sõltumatu parseriga tagasi: täpitähed, semikoolon, koma, jutumärgid, reavahetused, tühjad vastused ning üle 4000 märgi pikkune tekst säilisid täpselt. Tegelikud failid salvestati kettale ja loeti tagasi; kontrolliti UTF-8 BOM-i ja treeneri sobivushinnangu kaasamist.
- Praegune kujundus säilib. Kõik kaheksa vaadet, sh kinnitatud tagasiside koos tänuteate ja allalaadimisnuppudega, mahuvad kuuele ekraanilaiusele 390–1440 pikslit. Lisaks kontrolliti tahvelarvuti puutesisendit.

`node lahtekood/validate.cjs` ja `node lahtekood/build.cjs` läbisid. `node lahtekood/test-browser.cjs` läbis kokku **23 kontrollrühma**. Tulemused on failis `lahtekood/browser-results.json`. Test käivitati võrguühenduseta eraldi ajutises Chrome'i profiilis; tegelike failiallalaadimiste kontroll nõudis käivitamist väljaspool Windowsi piiratud liivakasti.

Kontrollid ei ole sõltumatu õpetaja eksperdihinnang. SessionStorage'i käitumist kohaliku HTML-iga kontrolliti Chrome'is; teiste brauserite privaatsusseaded võivad salvestamise keelata. Veateate ja vastuste säilitamise haru on testitud. Harjutustulemusi ja treeneri avatud ligipääsu ei salvestata ning lehe värskendamine lukustab treeneri vaate endiselt uuesti.


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
14. Kaheksa kohustusliku skaalaküsimuse ja nelja vabatahtliku tekstivälja kontroll, sessionStorage’i kinnitamine ja taastamine, salvestamata muudatuste kaitse ning eraldi TXT-/CSV-failide allalaadimine ja sisu kontroll. Treeneri sobivushinnang sisaldub failis.
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


## GitHub Pagesi jaoks lisatud ehitus ja kontroll

Tavaline ehitus loob nüüd identsed Malenurk.html ja index.html failid. build-pages.cjs koostab dist-kausta eraldi veebipaketi ning deployment.json sisaldab commit’i ja HTML-i SHA-256 räsi. pages.yml kirjeldab main-haru kontrollimist, ehitamist, brauseriteste ja avaldamist ning verify-site.cjs kontrollib avaldatud versiooni HTTP kaudu ja brauseris.

Avaldamiseks ehitatud dist/index.html läbis kõik 23 brauseritestide kontrollrühma. Kohaliku HTTP-serveri /malenurk/ juuraadress läbis sama versiooni- ja brauserikontrolli: avaleht, malekäik, tagasiside ning treenerilukk. Rakenduse HTML-i sisu ja kujundust ei muudetud. See kohalik kontroll ei tõenda avalikus github.io aadressis avaldamist. Avaldamine nõuab Pagesi lubamist sobiva paketi ja õigustega; hoidla nähtavust ei muudeta.
