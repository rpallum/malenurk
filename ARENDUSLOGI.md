# Malenurga 105 ülesande tööseis

## 28.10.2026 · enne avaldamist

- Jätkati olemasolevaid muudatusi. Kohalikus outputs-kaustas pole `.git`-i; main-haru ja viimane commit kontrolliti GitHubi ühenduse kaudu. Alus on `78825dd8a48ea86e32111bc360863fe4c630630a`; hoidla nähtavus on public ja seda ei muudeta.
- Valmis on täpselt 105 eri Lichessi CC0 ülesannet: seitse teemat × kolm taset × viis ülesannet. Algkirjed on `lahtekood/lichess-source.csv`, õppesisu `puzzles.json`, päritolu `source-manifest.json`.
- Kõik 105 läbisid python-chess'i ja Stockfish 19 tegeliku analüüsi ning värske `--recheck` kordusjooksu. Täielikud tõendid on `lahtekood/audit-report.json`; kordusjooks `.work/recheck-report.json`. Algne kandidaatide allalaadimine `.work/candidates.json` ja mootori vahemälu `.work/audit-cache/` on alles; uut importi ei ole jätkamiseks vaja.
- Läbisid chess.js-i kontroll, üheksa vigase panga negatiivset testi ning kogu panga brauserilahendus: 105 ülesannet / 235 õpilasekäiku / 20 matiharu / 21 kasutusvoo kontrollrühma. Tulemused: `lahtekood/validation.json` ja `browser-results.json`. Kontroll hõlmab tagasisidet, treenerilukku, filtreid ja tahvlipaigutusi.
- Lähtefailid asuvad `lahtekood/`; HTML-id on uuesti ehitatud. README ja 105 kirje kaupa `KONTROLLIARUANNE.md` on uuendatud. Pagesi töövoog säilib ning lisatud on vigase panga avaldamise tõkketest.

Lõppkontrollid on viimase sorteerimiskoristuse järel korratud ja läbitud. Neli ekraanipilti vaadati üle: `.work/screenshots/bank-home.png`, `bank-tablet-play.png`, `bank-tablet-coach.png`, `bank-mobile-filters.png`. Import kirjutab nüüd uue valimi juurde ka vastava manifesti; olemasolevat kontrollitud andmestikku ei muudeta.

Järgmine: salvesta failid main-harusse, oota Actionsi avaldamist ja kontrolli uut commit'i samal veebiaadressil. Avaldamise commit, töövoo tulemus ja avaliku aadressi kontroll lisatakse kohalikku `.work/progress.md` jätkamislogisse. Ära esita kohalikku versiooni juba avaldatuna.

Käsud hoidla juurest:

```text
node lahtekood/validate.cjs
node lahtekood/test-validation.cjs
node lahtekood/build-pages.cjs
node lahtekood/test-browser.cjs dist/index.html
node lahtekood/report.cjs
python lahtekood/audit-puzzles.py --recheck
node lahtekood/verify-site.cjs https://rpallum.github.io/malenurk/ COMMIT_SHA
```

Sõltumatu auditi viimane täismahus kordusjooks on juba läbitud; seda pole vaja muutmata andmestikuga uuesti teha. Python kasutab `audit-requirements.txt` sõltuvusi ning keskkonnamuutuja `STOCKFISH` määrab binaari. Veebileht neid arendusvahendeid ei vaja.
