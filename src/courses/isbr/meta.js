window.INFO = {
id:"isbr", code:"RGBUSBR002", name:"Inleiding staats- en bestuursrecht", short:"ISBR",
toets:"de eindtoets van 2025",
exam:{n:20, guess:true, k:3, pts:2.5, title:"Eindtoets-simulatie",
  desc:"20 meerkeuzevragen uit alle weken, meestal met drie antwoordopties, net als het meerkeuzedeel van de eindtoets. Je kunt vrij heen en weer bladeren en ziet pas na het inleveren wat goed was.",
  note:"Elke vraag is 2,5 punt waard (50 punten in totaal). Het cijfer is een indicatie voor alleen het meerkeuzedeel, met de raadkans verrekend zoals op de echte toets."},
startNote:{t:"Let op: eenheid van regeringsbeleid", html:"Dit staat niet in je samenvatting, maar kwam twee keer terug op de eindtoets van 2025: ministers zijn verantwoordelijk voor besluiten van de ministerraad, ook als ze het er niet mee eens waren, en een minister spreekt namens het hele kabinet (art. 45 lid 3 Gw)."},
openIntro:"Net als op de eindtoets: een casus met deelvragen van 6 tot 12 punten en een indicatie van het aantal woorden. Schrijf eerst je antwoord, open dan het antwoordmodel en vink aan wat je goed had. De drie casussen met ‘Eindtoets 2025’ zijn de echte open vragen van vorig jaar, nagekeken met het officiële antwoordmodel. De andere zes zijn nieuw, in dezelfde stijl.",
openTip:{t:"Zo scoor je punten", d:"Noem steeds het juiste artikel en, waar het past, de uitspraak (bijvoorbeeld Amsterdams dakterras of Harderwijk). Volg een stappenplan en pas elke stap toe op de feiten van de casus. Schrijf niets overbodigs op: onjuiste of niet-relevante informatie kan punten kosten."},
lessonsIntro:"De eindtoets van vorig jaar laat goed zien waar de punten liggen. Dit zijn de lessen eruit.",
correctionsTitle:"Let op bij je samenvatting",
sprintBlurb:"herken het orgaan, beginsel of artikel",
sprintIntro:"Op de toets moet je snel zien om welk orgaan, beginsel, artikel of type besluit het gaat. Kies zo snel je kunt.",
searchHint:"Zoek een begrip, artikel of uitspraak, bijv. ‘vertrouwensregel’ of ‘Harderwijk’"
};

window.WEEKS = {
1:{n:"Week 1",t:"De democratische rechtsstaat"},
2:{n:"Week 2",t:"Staatsorganen, democratie en parlement"},
3:{n:"Week 3",t:"Legaliteit en regelgeving"},
5:{n:"Week 5",t:"Bestuursorganen en beginselen"},
6:{n:"Week 6",t:"Besluiten en beslissingsruimte"},
7:{n:"Week 7",t:"Rechtsbescherming"},
8:{n:"Week 8",t:"Grondrechten"},
9:{n:"Extra",t:"Uit de eindtoets, niet in je samenvatting"}
};

window.TABLES = [
{t:"Wie is wie in de staat",w:2,h:["Begrip","Samenstelling of functie"],r:[
["Regering","Koning en ministers"],
["Kabinet","Ministers en staatssecretarissen"],
["Staten-Generaal","Eerste en Tweede Kamer samen (art. 51 Gw)"],
["Koning","Staatshoofd, onschendbaar (art. 42 lid 2 Gw)"],
["Ministers","Politiek verantwoordelijk, ook voor de Koning"],
["Staatssecretarissen","Verantwoordelijk voor eigen taakgebied; de minister blijft verantwoordelijk"]]},
{t:"Tweede en Eerste Kamer",w:2,h:["Onderwerp","Tweede Kamer","Eerste Kamer"],r:[
["Aantal leden","150","75"],
["Verkiezing","Rechtstreeks","Getrapt (Provinciale Staten, kiescolleges)"],
["Amendement","Wel","Niet"],
["Initiatief","Wel","Niet"],
["Controle regering","Wel","Wel"]]},
{t:"Bevoegdheden van het parlement",w:2,h:["Bevoegdheid","Betekenis","Welke Kamer"],r:[
["Amendement","Wetsvoorstel wijzigen","Alleen TK"],
["Initiatief (art. 82 Gw)","Zelf wetsvoorstel indienen","Alleen TK"],
["Budgetrecht (art. 105 Gw)","Begroting aannemen of verwerpen","Beide; alleen TK wijzigt"],
["Inlichtingenrecht (art. 68 Gw)","Informatie vragen","Beide"],
["Enquêterecht (art. 70 Gw)","Zelf onderzoek met getuigen onder ede","Beide"],
["Moties","Wens, verzoek of oordeel uitspreken","Beide"]]},
{t:"Moties",w:2,h:["Soort","Betekenis","Juridisch gevolg"],r:[
["Verzoekmotie","Vraagt de regering iets te doen","Niet bindend"],
["Motie van treurnis","Spreekt betreuren uit","Niet bindend"],
["Motie van afkeuring","Keurt beleid af","Niet automatisch vertrouwensbreuk"],
["Motie van wantrouwen","Zegt het vertrouwen op","Ontslag aanbieden (vertrouwensregel)"]]},
{t:"Verantwoordelijkheid en vertrouwen",w:2,h:["Ministeriële verantwoordelijkheid","Vertrouwensregel"],r:[
["Plicht om verantwoording af te leggen (art. 42 lid 2 Gw)","Bepaalt of een bewindspersoon kan aanblijven"],
["Over handelen en nalaten","Over de gevolgen van verlies van vertrouwen"],
["Leidt niet automatisch tot ontslag","Vastgesteld verlies van vertrouwen: ontslag aanbieden"],
["Geschreven (Grondwet)","Ongeschreven staatsrecht"]]},
{t:"Soorten regelgeving",w:3,h:["Regeling","Wie stelt vast","Bekendmaking"],r:[
["Wet in formele zin","Regering en Staten-Generaal","Staatsblad"],
["AMvB","Regering (KB), na ministerraad en Raad van State","Staatsblad"],
["Ministeriële regeling","Minister","Staatscourant"],
["Provinciale verordening","In beginsel Provinciale Staten","Provinciaal blad"],
["Gemeentelijke verordening","In beginsel gemeenteraad","Gemeenteblad"]]},
{t:"Delegatie in de Grondwet",w:3,h:["Formulering","Betekenis"],r:[
["‘Bij de wet’ / ‘bij wet’","Formele wetgever regelt het zelf, geen delegatie"],
["‘Behoudens ieders verantwoordelijkheid volgens de wet’","Geen delegatie van de beperkingsbevoegdheid"],
["‘Bij of krachtens de wet’","Delegatie toegestaan"],
["‘Regels’, ‘regelen’, ‘regeling’","Delegatie toegestaan"]]},
{t:"Arresten over legaliteit",w:3,h:["Arrest","Kern"],r:[
["Meerenberg","Regering kan niet uit zichzelf bindende regels stellen"],
["Rogge","Wet in materiële zin: algemene, naar buiten werkende inhoud"],
["Fluoridering","Ingrijpende feitelijke maatregel kan grondslag vereisen"],
["Methadonbrief","Ook bindende voorschriften zonder strafsanctie kunnen een grondslag vereisen"]]},
{t:"A-orgaan en b-orgaan",w:5,h:["","A-orgaan","B-orgaan"],r:[
["Definitie","Orgaan van rechtspersoon krachtens publiekrecht ingesteld","Ander persoon of college met openbaar gezag"],
["Centraal","Organisatorische positie","Uitgeoefende bevoegdheid"],
["Wanneer bestuursorgaan","Altijd, ook privaatrechtelijk en feitelijk","Alleen voor zover openbaar gezag wordt uitgeoefend"],
["Buitenwettelijk","Niet van toepassing","Uitkeringen + inhoudelijk + financieel vereiste"]]},
{t:"Vertrouwen en evenredigheid",w:5,h:["Toets","Stap 1","Stap 2","Stap 3"],r:[
["Amsterdams dakterras","Is er een toezegging?","Kan die worden toegerekend?","Moet het vertrouwen worden gehonoreerd?"],
["Harderwijk (art. 3:4 lid 2 Awb)","Geschiktheid","Noodzakelijkheid","Evenwichtigheid"]]},
{t:"Het besluitbegrip",w:6,h:["Element","Vraag"],r:[
["Schriftelijke beslissing","Definitief en vastgelegd? (elektronisch kan)"],
["Bestuursorgaan","A- of b-orgaan (art. 1:1 Awb)?"],
["Publiekrechtelijk","Op een publiekrechtelijke bevoegdheid?"],
["Rechtshandeling","Gericht op rechtsgevolg?"]]},
{t:"Besluiten van algemene strekking",w:6,h:["Soort","Kenmerk","Rechtstreeks beroep?"],r:[
["AVV","Algemene, externe, bindende regel","Nee (art. 8:3 Awb)"],
["Beleidsregel","Hoe een orgaan een bevoegdheid gebruikt","Nee (art. 8:3 Awb)"],
["Overig","Algemeen besluit, geen AVV of beleidsregel","In beginsel wel"]]},
{t:"Zorgvuldigheid en motivering",w:6,h:["","Zorgvuldigheid","Motivering"],r:[
["Vraag","Genoeg onderzocht?","Genoeg uitgelegd?"],
["Gaat over","Feitelijke voorbereiding","Draagkracht en kenbaarheid"],
["Artikel","Art. 3:2 Awb","Art. 3:46 en 3:47 Awb"]]},
{t:"Bezwaar en beroep",w:7,h:["","Bezwaar","Beroep"],r:[
["Wie","Hetzelfde bestuursorgaan","Onafhankelijke rechter"],
["Toets","Rechtmatigheid én doelmatigheid","Rechtmatigheid"],
["Moment","Ex nunc","Ex tunc"],
["Onderwerp","Oorspronkelijk besluit","Meestal de beslissing op bezwaar"]]},
{t:"Termijnen",w:7,h:["Wat","Termijn","Artikel"],r:[
["Bezwaar of beroep instellen","Zes weken, vanaf de dag na bekendmaking","Art. 6:7 en 6:8 Awb"],
["Beslissen op bezwaar","Zes weken (twaalf met adviescommissie) + max. zes weken verdaging","Art. 7:10 Awb"],
["Beroep niet tijdig beslissen","Twee weken na ingebrekestelling","Art. 6:12 Awb"]]},
{t:"Hogerberoepsrechters",w:7,h:["Rechtsgebied","Rechter"],r:[
["Algemeen bestuursrecht (hoofdregel)","ABRvS"],
["Sociale zekerheid, ambtenarenzaken","CRvB"],
["Economisch bestuursrecht","CBb"],
["Belastingrecht","Gerechtshof, daarna Hoge Raad"]]},
{t:"Klassieke en sociale grondrechten",w:8,h:["Klassiek","Sociaal"],r:[
["Bescherming tegen inmenging","Actief overheidsoptreden"],
["Onthouding","Zorg en inspanning"],
["Negatieve vrijheid","Positieve vrijheid"],
["Vaak rechtstreeks inroepbaar","Meestal geen recht op concreet resultaat"]]},
{t:"Beperken: Grondwet en EVRM",w:8,h:["","Grondwet","EVRM (art. 8 tot en met 11)"],r:[
["Nadruk","Wie mag beperken?","Is de inmenging gerechtvaardigd?"],
["‘Wet’","Wet in formele zin","Ruim, ook lagere en ongeschreven regels"],
["Doelen","Soms in het artikel (art. 9 lid 2)","Opgesomd in lid 2"],
["Noodzakelijkheid","Geen algemene eis","Expliciete eis"],
["Toetsing formele wet","Niet (art. 120 Gw)","Wel (art. 94 Gw)"]]}
];

window.LESSONS = {
format:[
"20 meerkeuzevragen (2,5 punt per vraag, samen 50 punten), meestal met drie antwoordopties; stellingenvragen hebben er soms vier. Daarnaast 3 open casusvragen (samen 50 punten, deelvragen van 6 tot 12 punten).",
"De raadkans wordt verrekend. Vorig jaar had je 62,31 van de 100 punten nodig om te slagen.",
"Je hebt 2 uur. De eindtoets telt voor 70% mee, de Hackathon voor 30%.",
"Je mag je wettenbundel en jurisprudentiebundel gebruiken. Sommige vragen dwingen je om in de bundel te zoeken, zoals welk soort regeling iets is of welke bepaling beslissingsruimte geeft.",
"Bij de open vragen staat een indicatie van het aantal woorden. Dat is geen maximum of minimum, maar wel een goede richting."
],
tips:[
{t:"Noem artikelen en uitspraken",d:"De instructie vraagt expliciet om wetsartikelen en jurisprudentie. De naam van de uitspraak volstaat, zoals Amsterdams dakterras of Harderwijk."},
{t:"Geen overbodige informatie",d:"Onjuiste of niet-relevante informatie kan punten kosten. Beantwoord precies de vraag."},
{t:"Elke vraag staat los",d:"Iedere vraag wordt apart nagekeken. Verwijs dus niet naar je antwoord bij een andere vraag, maar herhaal kort wat nodig is."},
{t:"Oefen met je bundel",d:"Zoek instanties op in het alfabetisch register (zoals het CBR) en herken een regeling aan het opschrift (‘Wet van’, ‘Besluit van’, ‘Regeling van de Minister’), de vindplaats (Stb. of Stcrt.) of de aanhef als die erin staat."},
{t:"Let op exacte termen",d:"De derde stap van Harderwijk heet evenwichtigheid, niet redelijkheid. Een ‘bevestigingsfunctie’ van bezwaar bestaat niet. Kleine woorden maken een optie fout."},
{t:"Pas de theorie toe op de casus",d:"Bij de trias-vraag van 2025 kreeg je voor alleen een uitleg van de trias, zonder toepassing op de casus, maximaal 1 punt. Leg steeds uit wat de regel hier concreet betekent."},
{t:"Alleen wat in de casus speelt",d:"In 2025 leverde het enquêterecht noemen geen punten op, omdat er in de casus geen enquête was. Ook het onderscheid tussen regelgevende en bestuursbevoegdheid speelde daar niet."},
{t:"Artikel én lid, plus uitspraak",d:"Het antwoordmodel noemt steeds precies: art. 9 lid 1 Gw, art. 11 lid 1 en 2 EVRM, art. 5 lid 1 Wom, art. 1:1 lid 1 sub a Awb, art. 2:1 lid 2 BW. En uitspraken bij naam: Sunday Times, HR Verfbommetje."},
{t:"Gebruik de stappenplannen",d:"Bestuursorgaan, besluit, rechtsbescherming en grondrechten hebben allemaal een stappenplan. Dat is meteen de structuur van een goed open antwoord."}
],
weak:[
{k:"vertrouwen",t:"Amsterdams dakterras",d:"Vertrouwen wordt gehonoreerd als er geen zwaarder wegende belangen in de weg staan. Een mondelinge toezegging kan ook, en een toezegging van een ambtenaar kan aan het bevoegde orgaan worden toegerekend.",w:5},
{k:"bezwaar",t:"Afdeling 7.1 of 7.2 Awb",d:"7.1: eerst bezwaar maken (art. 7:1). 7.2: bijzondere bepalingen over bezwaar, zoals de heroverweging (art. 7:11).",w:7},
{k:"bevoegdheden",t:"Delegatie lezen in de Grondwet",d:"‘Behoudens bij of krachtens de wet te stellen beperkingen’ (art. 10 lid 1 Gw) staat delegatie toe. ‘Bij de wet’ niet.",w:3},
{k:"bestuursorgaan",t:"Is de regering een bestuursorgaan?",d:"Ja: een orgaan van de Staat, een publiekrechtelijke rechtspersoon. Het orgaan zelf hoeft geen rechtspersoonlijkheid te hebben.",w:5},
{k:"regelgeving",t:"AVV's en beleidsregels",d:"Ook verordeningen van gemeente en provincie zijn AVV's. Beleidsregels zijn géén AVV.",w:3},
{k:"decentralisatie",t:"Functionele decentralisatie",d:"Een beroepsorganisatie zoals de Orde van Advocaten. Provincies en de openbare lichamen Bonaire, Sint Eustatius en Saba zijn territoriaal.",w:5},
{k:"rechtsgang",t:"Burgerlijke rechter",d:"Staat er nog een bestuursrechtelijke rechtsgang open, dan is de eiser bij de burgerlijke rechter niet-ontvankelijk.",w:7},
{k:"evenredigheid",t:"Evenredigheid bij woningsluiting",d:"Bij de evenwichtigheid weegt mee dat een eigenaar verantwoordelijk is voor wat in zijn woning gebeurt. De aanleiding (drugsvondst, arrestatie) is wel relevant.",w:5},
{k:"bestuursorgaan",t:"Orgaan, niet de handeling",d:"Een commissaris van de Koning die een provinciehuis opent is een a-orgaan. Een rechtbank is uitgezonderd; een waterschap zelf is een rechtspersoon.",w:5},
{k:"bevoegdheden",t:"Soort bevoegdheid",d:"Een beslissing in een concreet geval, zoals het niet tekenen van lintjesvoordrachten, is een bestuursbevoegdheid.",w:3},
{k:"rechtsgang",t:"Informele bestuursrechtspraak",d:"Een advocaat is niet verplicht, maar de bestuursrechtspraak regelt er ook niet voor iedereen een.",w:7},
{k:"parlstelsel",t:"Eenheid van regeringsbeleid",d:"Ministers zijn verantwoordelijk voor ministerraadsbesluiten, ook als ze het oneens waren. Een minister spreekt namens het hele kabinet.",w:9}
],
corrections:[
{k:"decentralisatie",t:"Waterschappen",d:"Je samenvatting noemt waterschappen een mengvorm van territoriale en functionele decentralisatie. Op de toets is een beroepsorganisatie als de Orde van Advocaten het duidelijke voorbeeld van functionele decentralisatie; kies bij twijfel dat."},
{t:"Week 4 ontbreekt",d:"Je samenvatting springt van week 3 naar week 5. Had week 4 wel stof? Kijk dat even na in je studiehandleiding."}
],
missing:[
"Eenheid van regeringsbeleid en de ministerraad (art. 45 lid 3 Gw)",
"De burgerlijke rechter is niet-ontvankelijk als een bestuursrechtelijke rechtsgang openstaat",
"Abbb met een formele en een materiële kant (zorgvuldigheid, motivering, rechtszekerheid)",
"Art. 51 Gw (samenstelling Staten-Generaal) en art. 64 Gw (ontbinding verplicht tot nieuwe verkiezingen)",
"Een regeling herkennen in je wettenbundel aan de aanhef (formele wet, AMvB, ministeriële regeling)",
"De Wet wapens en munitie: zelf beslissingsruimte vinden in een bijzondere wet",
"Het CBR als publiekrechtelijke rechtspersoon: art. 2:1 lid 2 BW, art. 4z en 4ac Wegenverkeerswet 1994",
"EHRM Sunday Times (kenbaar en voorzienbaar) en HR Verfbommetje (uiting op maatschappelijk gebied)",
"Moties: art. 8.20 Reglement van Orde TK en art. 72 Gw; stemmen: art. 67 lid 4 Gw",
"Evenredigheid stricto sensu als derde subonderdeel van ‘noodzakelijk in een democratische samenleving’"
]
};
