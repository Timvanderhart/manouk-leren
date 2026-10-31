# Manouks GVR-trainer

Studietool voor Grondslagen van Recht (UU, RGBUSBR001): flashcards met herhaalsysteem, oefenvragen in tentamenstijl, proeftentamen, open casusvragen met antwoordmodel, sprintrondes, overzichten en leerpunten uit de oefentoets.

- Live via GitHub Pages: `index.html` in de root van `main`.
- Voortgang wordt bewaard in de browser (localStorage) van het apparaat waarop je oefent.

## Aanpassen

De inhoud staat in `src/data/` (flashcards, meerkeuzevragen, open vragen, sprintrondes, overzichten). Na een wijziging:

```
python3 build.py && cp dist/site/index.html index.html
```
