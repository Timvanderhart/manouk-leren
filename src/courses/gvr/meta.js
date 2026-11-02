window.INFO = {
id:"gvr", code:"RGBUSBR001", name:"Grondslagen van Recht", short:"GVR",
toets:"je oefentoets",
exam:{n:30, guess:false, pts:1, title:"Tentamensimulatie",
  desc:"30 meerkeuzevragen uit alle weken, net als het meerkeuzedeel van het echte tentamen. Je kunt vrij heen en weer bladeren en ziet pas na het inleveren wat goed was.",
  note:"Het cijfer is een indicatie voor alleen het meerkeuzedeel (1 + 9 × score/30). Oefen de open vragen apart."},
startNote:{t:"Let op: Wiarda", html:"Een open norm uit de wet invullen waar de wet genoeg houvast geeft (zoals goed werkgeverschap) is volgens het antwoordmodel <b style=\"color:inherit\">gematigd heteronoom</b>, niet autonoom. Je samenvatting zegt hier iets anders."},
openIntro:"Precies zoals het open deel van je tentamen: een casus met vraag a (3 punten), b (4 punten) en c (8 punten). Schrijf eerst je antwoord, open dan het antwoordmodel en vink aan wat je goed had.",
openTip:{t:"Zo scoor je punten", d:"Noem het begrip, geef de definitie uit de stof, en pas het toe op de casus. Beantwoord alleen wat er gevraagd wordt: bij de Keen-vraag in je oefentoets leverde ‘recht en moraal’ geen punten op, omdat het om recht en beleid ging."},
lessonsIntro:"De oefentoets lijkt sterk op het echte tentamen en laat precies zien waar de punten liggen. Dit zijn de lessen eruit.",
correctionsTitle:"Klopt niet helemaal in je samenvatting",
sprintBlurb:"herken de methode, rechter of denker",
sprintIntro:"Op het tentamen moet je vaak in een paar seconden zien welke methode, rechter of denker er in een citaat zit. Kies zo snel je kunt.",
searchHint:"Zoek een begrip, denker of arrest, bijv. ‘lex certa’ of ‘Catoochi’"
};

window.WEEKS = {
1:{n:"Week 1",t:"Wat doet het recht?"},
2:{n:"Week 2",t:"Rechtsfilosofie en de grotverkenners"},
3:{n:"Week 3",t:"Recht en regels"},
4:{n:"Week 4",t:"Recht en samenleving"},
5:{n:"Week 5",t:"Rechtsgang en arresten lezen"},
6:{n:"Week 6",t:"Recht en rechtsbronnen"},
7:{n:"Week 7",t:"Recht en rechtsvinding"},
8:{n:"Week 8",t:"Recht en rechtsstaat"},
9:{n:"Extra",t:"Uit de oefentoets, niet in je samenvatting"}
};

// Overzichtstabellen voor de naslag
window.TABLES = [
{t:"Drie stromingen",w:2,h:["Stroming","Kern","Kernwaarde","Herken aan"],r:[
["Rechtspositivisme","Geldend recht en persoonlijke moraal scheiden; herkomst bepaalt geldigheid","Rechtszekerheid","Bevoegde wetgever, juiste procedure, wet volgen"],
["Natuurrecht","Hogere, ongeschreven normen; geschreven recht wordt daaraan getoetst","Rechtvaardigheid","Beroep op hogere waarden tegen een geschreven regel"],
["Rechtsrealisme","Hoe werkt recht in de praktijk? Omstandigheden en gevolgen","Doelmatigheid","Feitelijk rechterlijk gedrag, maatschappelijke gevolgen"]]},
{t:"De rechters in de grotverkenners",w:2,h:["Rechter","Doorslaggevende gedachte","Uitkomst"],r:[
["Truepenny","Wet toepassen, maar strafvermindering door het bestuur bepleiten","Veroordelen"],
["Foster","Natuurtoestand; letter vs. doel van de wet (zelfverdediging)","Vrijspreken"],
["Tatting","Te veel onopgeloste tegenstrijdigheden","Geen uitspraak"],
["Keen","Recht en persoonlijke moraal gescheiden; gratie is aan het bestuur","Veroordelen"],
["Handy","Praktische werkelijkheid en publieke opinie (90%)","Vrijspreken"]]},
{t:"Hart, Radbruch, Dworkin",w:3,h:["Denker","Centrale gedachte","Herkenningspunt"],r:[
["Hart","Recht = primaire + secundaire regels; geldigheid los van moraal","Herkenning, verandering, handhaving; open textuur"],
["Radbruch","Positief recht gaat voor, behalve bij onverdraaglijk onrecht","Grens rechtszekerheid / extreme onrechtvaardigheid"],
["Dworkin","Recht = regels én beginselen; morele argumentatie nodig","Open normen; rechter gebonden aan beginselen"]]},
{t:"Secundaire regels (Hart)",w:3,h:["Probleem","Secundaire regel","Functie"],r:[
["Onzekerheid","Herkenningsregel","Criteria om geldend recht te herkennen (herkomst)"],
["Verandering","Veranderingsregels","Wie mag regels invoeren, wijzigen, afschaffen en hoe"],
["Handhaving","Handhavingsregels","Wie beslist over overtredingen en geschillen"]]},
{t:"Rechtsrealisten",w:4,h:["Wie / wat","Kern"],r:[
["Holmes","Recht als voorspelling van rechterlijke beslissingen; bad man theory"],
["Llewellyn","Dubbele functie van regels; tijdelijke scheiding recht/moraal; grand style"],
["Regelscepsis","Onzekerheid over betekenis van regels; hogere rechters"],
["Feitenscepsis","Onzekerheid over de feiten; feitenrechters"],
["Scandinavisch","Psychologische invloed van regels en instituties"],
["Nieuw rechtsrealisme","Gevolgen voor individuen; sociaalwetenschappelijke kennis vult aan"]]},
{t:"Partijen en uitspraken",w:5,h:["Procedure","Partijen","Uitspraak"],r:[
["Dagvaarding, rechtbank","Eiser / gedaagde","Vonnis"],
["Hoger beroep","Appellant / geïntimeerde","Arrest"],
["Cassatie","Eiser tot cassatie / verweerder in cassatie","Arrest"],
["Verzoekschrift","Verzoeker / verweerder","Beschikking"]]},
{t:"Wet in formele en materiële zin",w:6,h:["Begrip","Kijk naar","Betekenis"],r:[
["Formele zin","Herkomst","Regering + Staten-Generaal (art. 81 Gw)"],
["Materiële zin","Inhoud","Algemeen verbindend voorschrift: externe werking, algemene regels, bevoegd gezag"]]},
{t:"Toetsing door de rechter",w:6,h:["Toetsen van formele wet aan","Mag het?","Waarom"],r:[
["Grondwet","Nee","Art. 120 Gw"],
["Statuut en ongeschreven rechtsbeginselen","Nee","Harmonisatiewet-arrest"],
["Eenieder verbindende verdragsbepalingen","Ja","Art. 94 Gw"],
["Andere wetten (voorrangsregels)","Ja","Lex superior, specialis, posterior"]]},
{t:"Wiarda: drie typen rechtsvinding",w:7,h:["Type","Wat doet de rechter?","Voorbeeld"],r:[
["Heteronoom","Past een duidelijke regel toe; spreekbuis van de wet","Termijn verstreken"],
["Gematigd heteronoom","Legt een regel uit of vult een open norm in waar de wet houvast biedt; vertolker van de wet","Goed werkgeverschap, ‘goed’ in art. 310 Sr"],
["Autonoom","Vult een norm of leemte in terwijl het recht weinig concrete houvast biedt; veel eigen afweging","Leemte of zeer vage norm zonder richtinggevende regels of jurisprudentie"]]},
{t:"Interpretatiemethoden",w:7,h:["Methode","Centrale vraag","Herken aan"],r:[
["Grammaticaal","Wat betekenen de woorden?","Spraakgebruik, woordenboek"],
["Wetshistorisch","Wat bedoelde de wetgever?","Memorie van toelichting, parlementaire geschiedenis"],
["Systematisch","Hoe past het in het stelsel?","Samenhang met andere artikelen of wetten"],
["Teleologisch","Wat is het doel, ook nu?","Beschermd belang, maatschappelijke ontwikkelingen"]]},
{t:"Materieel legaliteitsbeginsel",w:7,h:["Aspect","Betekenis"],r:[
["Lex scripta","Geschreven wettelijke basis; gewoonte is niet genoeg"],
["Lex certa","Duidelijk genoeg om te voorzien wat strafbaar is"],
["Geen terugwerkende kracht","Niet achteraf strafbaar maken of zwaarder straffen"],
["Analogieverbod","Niet uitbreiden naar een geval buiten de bepaling"]]},
{t:"Vrijheid, gelijkheid, democratie",w:8,h:["Begrip","Betekenis","Overheid / rechter"],r:[
["Negatieve vrijheid","Vrij van inmenging","Terughoudende overheid"],
["Positieve vrijheid","Daadwerkelijk kunnen","Actieve overheid"],
["Formele gelijkheid","Gelijke rechten, gelijke gevallen gelijk","Gelijke behandeling waarborgen"],
["Materiële gelijkheid","Rekening houden met feitelijke verschillen","Compenseren, ondersteunen"],
["Formele democratie","Procedure, meerderheid; gelijkheid van stemmen","Kleine rol rechter"],
["Materiële democratie","Grondrechten, minderheden; gelijkwaardigheid","Controlerende rol rechter"]]},
{t:"Staatsneutraliteit",w:8,h:["Vorm","Betekenis","Gelijkheid"],r:[
["Exclusief","Religieuze uitingen buiten de publieke sfeer","Formeel"],
["Inclusief","Alle overtuigingen zichtbaar en gelijkwaardig","Formeel"],
["Compenserend","Extra steun voor minderheden","Materieel"]]}
];

// Wat de oefentoets ons leert
window.LESSONS = {
format:[
"30 meerkeuzevragen met 4 opties, plus 2 open casusvragen van elk 15 punten (a = 3, b = 4, c = 8 punten).",
"De open vragen kijk je in de oefentoets zelf na met een antwoordmodel. In deze tool doe je dat precies zo.",
"Veel vragen beginnen met een casus, nieuwsbericht of citaat. Je moet dan een begrip herkennen en toepassen, niet alleen opzeggen.",
"Er zitten vaak twee opties in met dezelfde conclusie maar een andere motivering. Kies dan de meest precieze motivering."
],
tips:[
{t:"Lees elke stelling los",d:"Bij ‘Stelling 1 / Stelling 2’-vragen zit de valkuil vaak in één klein woord (‘altijd’, ‘alleen’, ‘door de rechter’). Beoordeel eerst stelling 1 helemaal, dan stelling 2."},
{t:"Zelfde conclusie, andere reden",d:"Twee opties zeggen bijvoorbeeld allebei ‘materiële gelijkheid’. Check dan welke motivering het meest precies bij de definitie en de casus past."},
{t:"Check elk detail in de optie",d:"‘Omdat béíde commentatoren vinden dat...’ klopt niet als maar één dat vindt. Eén onjuist detail maakt de hele optie fout."},
{t:"Beantwoord precies de vraag",d:"In de open vraag over Keen leverde ‘recht en moraal’ geen punten op, omdat er gevraagd werd naar recht en beleid. Onderstreep de kernwoorden van de vraag."},
{t:"Definitie, uitleg, toepassing",d:"Open vraag? Gebruik steeds drie stappen: noem het begrip, leg het uit met de definitie uit de stof, pas het toe op de casus."},
{t:"Exacte definities scoren",d:"Formele democratie: gelijkheid = gelijkheid van stemmen. Materiële democratie: gelijkheid = gelijkwaardigheid. Zulke precieze koppelingen staan letterlijk in het antwoordmodel."}
],
weak:[
{t:"Radbruch vs. Dworkin",d:"Dworkin: rechtvaardigheid zit in het recht zelf (beginselen). Radbruch: niet noodzakelijk; positief recht gaat voor, behalve bij extreem onrecht.",w:3},
{t:"Natuurrecht en legitimiteit",d:"Legitimiteit hangt af van de verhouding tot hogere morele normen, niet van een handeling van de rechter.",w:3},
{t:"Hart en moraal",d:"Geldigheid is onafhankelijk van moraliteit. Iets kan illegaal maar moreel juist zijn.",w:3},
{t:"Conclusie van de A-G",d:"Komt vóór het arrest, dus bevat nooit de overwegingen van de HR in die zaak.",w:5},
{t:"Catoochi en gewoonterecht",d:"Geen aanvullende maar derogerende werking; en gewoonterecht wordt niet alleen door de HR erkend.",w:6},
{t:"Formeel recht herkennen",d:"Formeel recht regelt procedures en bevoegdheden in de procedure; materieel recht regelt rechten en plichten zelf.",w:1},
{t:"Subjectief vs. objectief recht",d:"‘Rechten’ in een BW-artikel zijn meestal subjectieve rechten (art. 3:82 BW: twee keer subjectief).",w:1},
{t:"Elektriciteitsarrest",d:"Elektriciteit is een ‘goed’: extensieve uitleg, geen analogie en geen restrictieve uitleg.",w:7},
{t:"Lex certa vs. lex scripta",d:"Een vage maar wél geschreven norm (‘zich hinderlijk gedragen’) is een lex certa-probleem.",w:7},
{t:"Wiarda en open normen",d:"Kijk naar de houvast die het recht biedt. Goed werkgeverschap invullen of een regel interpreteren: voldoende houvast, dus gematigd heteronoom. Hier gaan makkelijk alle 3 punten verloren.",w:7},
{t:"Democratie en gelijkheid",d:"Bij discussie over de inhoud (wat is rechtvaardig?) gaat het om materiële democratie. Ken de gelijkheidsdefinities per opvatting.",w:8},
{t:"Gelijkheid en neutraliteit",d:"Een beperking die voor alle overtuigingen geldt en iedereen gelijke ruimte laat: formele gelijkheid + inclusieve neutraliteit.",w:8},
{t:"Materiële gelijkheid: beste motivering",d:"Niet alleen ‘verschillen tussen groepen’, maar: kijken naar het ongelijke resultaat als er geen compensatie is voor de ongelijke uitgangspositie.",w:8}
],
corrections:[
{t:"Wiarda: open normen",d:"Je samenvatting koppelt ‘een open norm invullen’ aan autonome rechtsvinding. Volgens het antwoordmodel van de oefentoets is het invullen van goed werkgeverschap (art. 7:611 BW) gematigd heteronoom, omdat de wet daar voldoende houvast biedt. Doorslaggevend is dus hoeveel houvast het bestaande recht geeft: weinig concrete houvast betekent autonoom, voldoende houvast betekent gematigd heteronoom."},
{t:"Art. 81 Gw",d:"Je samenvatting noemt art. 81 Gw bij de herkenningsregel. In de oefentoets geldt het ook als veranderingsregel. Beide kan: het zegt wie wetten maakt (verandering) en waaraan je een wet herkent (herkenning)."},
{t:"Veranderingsregels zijn breder",d:"Ook regels waarmee burgers zelf hun rechtsverhoudingen veranderen, zoals de overeenkomst (art. 6:213 BW), zijn veranderingsregels. Een aansprakelijkheidsregel als art. 6:162 BW is dat niet."}
],
missing:[
"Witteveen, ‘De geordende wereld van het recht’ (H. V): erkende rechtsbeginselen vs. achtergrondbeginselen",
"A.J. Nieuwenhuis, ‘Democratie, groepsbelediging en haatzaaien’",
"Boogaard & Uzman, ‘Tussen Montesquieu en Judge Dredd’",
"Gastcollege Mingelen: opvolgers van het rechtsrealisme",
"Gastcollege Elaine Mak: de zaak Jip de kip",
"Tongzoen II-arrest en het Elektriciteitsarrest",
"Wet Algemene Bepalingen (art. 5, 11, 12)",
"Taverne (annotatie 1921), open textuur en het evolutionaire karakter van het recht (Holmes, Ratnapala)",
"Toeslagenaffaire, Urgenda en Shell als voorbeelden in de discussie over rechter en politiek",
"De aanwijzingsbevoegdheid van de minister aan het OM"
]
};
