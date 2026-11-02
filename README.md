# Manouks studietrainer

Studietool voor Rechten (Universiteit Utrecht, jaar 1) met een hoofdscherm waarop je het vak kiest:

- **GVR**: Grondslagen van Recht (RGBUSBR001)
- **ISBR**: Inleiding staats- en bestuursrecht (RGBUSBR002)

Per vak: flashcards met herhaalsysteem, oefenvragen in tentamenstijl, een proeftentamen, open casusvragen met antwoordmodel, sprintrondes, overzichten en leerpunten uit de (oefen)toets.

- Live via GitHub Pages: `index.html` in de root van `main`.
- Voortgang wordt per vak bewaard in de browser (localStorage) van het apparaat waarop je oefent.

## Aanpassen

De inhoud staat per vak in `src/courses/<vak>/` (meta, flashcards, meerkeuzevragen, open vragen, sprintrondes). Na een wijziging:

```
python3 build.py && cp dist/site/index.html index.html
```

Een nieuw vak toevoegen: maak een map `src/courses/<vak>/` met dezelfde vijf bestanden en zet het vak in de lijst `COURSES` in `build.py`.
