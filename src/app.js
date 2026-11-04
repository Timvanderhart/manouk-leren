(function(){
"use strict";
const $ = (s, el) => (el||document).querySelector(s);
const $$ = (s, el) => Array.from((el||document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt = s => esc(s).replace(/\n/g, "<br>");
const hashStr = s => { let h = 7; for (const ch of s) h = (Math.imul(h, 31) + ch.codePointAt(0)) | 0; return (h >>> 0).toString(36); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const DAY = 864e5;
const LETTERS = ["A","B","C","D","E","F"];
const PRAISE = ["Goed zo!","Helemaal goed.","Klopt!","Precies, Manouk.","Netjes!","Mooi, goed gezien.","Top, die zit erin.","Ja, dat is hem!","Goed gedaan!"];
const STREAK = {3:"Drie goed op rij!",5:"Vijf op rij, lekker bezig Manouk!",10:"Tien op rij! Jij bent er klaar voor.",15:"Vijftien op rij. Echt heel sterk!"};
const NOPE = ["Niet goed. Lees even waarom.","Helaas, deze niet. Kijk naar de uitleg.","Niet goed, maar nu weet je het wel."];
const pick = a => a[Math.floor(Math.random() * a.length)];
const heart = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
let toastT = null;
function toast(msg){
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role","status"); t.setAttribute("aria-live","polite"); document.body.appendChild(t); }
  t.innerHTML = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
}
const wlabel = w => Number(w) === 9 ? "EXTRA" : "WEEK " + w;
const comma = n => String(Math.round(n * 10) / 10).replace(".", ",");
const gradeStr = g => Number(g).toFixed(1).replace(".", ",");

// ---------- courses ----------
const COURSES = window.COURSE_DATA || {};
const ORDER = Object.keys(COURSES);
const ST = {JJ:"Beide stellingen zijn juist.", JO:"Stelling 1 is juist, stelling 2 is onjuist.", OJ:"Stelling 1 is onjuist, stelling 2 is juist.", OO:"Beide stellingen zijn onjuist."};
ORDER.forEach(id => {
  const D = COURSES[id];
  D.FLASH.forEach(c => c.id = "f" + hashStr(c.q));
  D.MC.forEach(q => {
    q.id = "m" + hashStr(q.q + (q.s1 || "") + (q.s2 || ""));
    if (q.st) { const keys = ["JJ","JO","OJ","OO"]; q.o = keys.map(k => ST[k]); q.a = keys.indexOf(q.a); q.fixed = true; }
  });
  D.WK = Object.keys(D.WEEKS).map(Number);
  D.TOPICS = D.TOPICS || [];
  D.TOPIC = {}; D.TOPICS.forEach(t => D.TOPIC[t.k] = t);
});
let CID = null, FLASH = [], MC = [], OPEN = [], SPRINT = [], WEEKS = {}, TABLES = [], LESSONS = {}, INFO = {}, WK = [], TOPICS = [], TOPIC = {};
const L = k => `#${CID}-${k}`;

// ---------- storage (per vak) ----------
const fresh = () => ({cards:{}, mc:{}, open:{}, sprint:{}, exams:[], examDate:""});
const STORES = {};
function loadStore(id){
  if (STORES[id]) return STORES[id];
  let s = fresh();
  try { const raw = localStorage.getItem("manouk-" + id + "-v1"); if (raw) s = Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
  STORES[id] = s; return s;
}
let S = fresh();
function save(){ if (!CID) return; try { localStorage.setItem("manouk-" + CID + "-v1", JSON.stringify(S)); } catch (e) {} }

// ---------- theme (voor alle vakken) ----------
let THEME = "";
try { THEME = localStorage.getItem("manouk-theme") || ""; if (!THEME) { const g = JSON.parse(localStorage.getItem("manouk-gvr-v1") || "{}"); if (g.theme) THEME = g.theme; } } catch (e) {}
function applyTheme(){
  const r = document.documentElement;
  if (THEME) r.setAttribute("data-theme", THEME); else if (r.dataset.ownTheme) r.removeAttribute("data-theme");
  const b = $("#themeBtn"); if (b) b.textContent = THEME === "dark" ? "Thema: donker" : THEME === "light" ? "Thema: licht" : "Thema: automatisch";
}
function cycleTheme(){ THEME = THEME === "" ? "light" : THEME === "light" ? "dark" : ""; document.documentElement.dataset.ownTheme = "1"; try { localStorage.setItem("manouk-theme", THEME); } catch (e) {} applyTheme(); }

// ---------- stats helpers ----------
const cardState = c => S.cards[c.id];
const mastered = c => (cardState(c) && cardState(c).box >= 3);
const isDue = c => { const s = cardState(c); return s && s.due <= Date.now(); };
function weekCards(w){ return FLASH.filter(c => w === "all" || c.w === w); }
function weekMc(w){ return MC.filter(q => w === "all" || q.w === w); }
function mcStats(list){ let ans = 0, ok = 0; list.forEach(q => { const s = S.mc[q.id]; if (s) { ans++; if (s.last) ok++; } }); return {ans, ok, total:list.length}; }
function recordMc(q, right){ const s = S.mc[q.id] || {r:0, w:0, last:false}; if (right) s.r++; else s.w++; s.last = right; S.mc[q.id] = s; save(); }
// ---------- onderwerpen: waar gaat het vaak mis? ----------
// zwak = staat nu nog fout (vraag) of lastig (kaart); beter = eerder fout, nu goed; goed = geoefend zonder fouten; nieuw = nog niet geoefend
function topicStats(D, st, t){
  const qs = D.MC.filter(q => q.k === t.k), cs = D.FLASH.filter(c => c.k === t.k);
  let wrong = 0, right = 0, open = 0, answered = 0, hard = 0, miss = 0, seen = 0;
  qs.forEach(q => { const s = st.mc[q.id]; if (s) { answered++; wrong += s.w; right += s.r; if (!s.last) open++; } });
  cs.forEach(c => { const s = st.cards[c.id]; if (s) { seen++; if (s.box <= 1) hard++; miss += s.f || 0; } });
  const tries = wrong + right, rate = tries ? wrong / tries : 0;
  const score = open * 3 + wrong * 1.5 + hard + miss * .5 + rate * 2;
  const status = (open || hard) ? "zwak" : (wrong || miss) ? "beter" : (answered || seen) ? "goed" : "nieuw";
  return {t, qs, cs, wrong, right, open, answered, hard, miss, tries, rate, score, status};
}
function allTopicStats(D, st){ return D.TOPICS.map(t => topicStats(D, st, t)); }
function weakTopics(D, st){ return allTopicStats(D, st).filter(x => x.status === "zwak").sort((a, b) => b.score - a.score); }
const plural = (n, one, more) => `${n} ${n === 1 ? one : more}`;
function statLine(s){
  const p = [];
  if (s.wrong) p.push(`${s.wrong} keer fout`);
  if (s.open) p.push(`${plural(s.open, "vraag", "vragen")} nog fout`);
  if (s.hard) p.push(`${plural(s.hard, "kaart", "kaarten")} lastig`);
  if (!p.length && s.tries) p.push(`${s.right} keer goed`);
  return p.join(" · ");
}
function daysUntil(str){ if (!str) return null; const d = new Date(str + "T09:00:00"); if (isNaN(d)) return null; const t = new Date(); t.setHours(0,0,0,0); d.setHours(0,0,0,0); return Math.round((d - t) / DAY); }
function examGrade(score, total){
  const E = INFO.exam || {};
  if (E.guess) { const g = total / (E.k || 3); const f = Math.max(0, (score - g) / (total - g)); return {grade: Math.round((1 + 9 * f) * 10) / 10, frac: f}; }
  return {grade: Math.round((1 + 9 * score / total) * 10) / 10, frac: score / total};
}

// ---------- icons ----------
const I = {
  start:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  kaarten:'<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
  oefenen:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  tentamen:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/>',
  open:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  sprint:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  naslag:'<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/>',
  leerpunten:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.4h6c0-1.1.2-1.8.8-2.4A6 6 0 0 0 12 3z"/>',
  terug:'<path d="M15 5l-7 7 7 7"/>',
  aandacht:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  vakken:'<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;

const NAV = [
  ["start","Start"],["kaarten","Flashcards"],["oefenen","Oefenvragen"],["aandacht","Aandachtspunten"],["tentamen","Proeftentamen"],
  ["open","Open vragen"],["sprint","Sprint"],["naslag","Naslag"],["leerpunten","Leerpunten"]
];
function renderNav(cur){
  const app = $(".app"); if (app) app.dataset.course = CID || "";
  const mark = $("#brandMark"), sub = $("#brandSub"), brand = $(".brand");
  if (!CID) {
    if (mark) { mark.textContent = "§"; mark.classList.remove("txt"); }
    if (sub) sub.textContent = "Rechten · jaar 1";
    if (brand) brand.setAttribute("href", "#home");
    $("#nav").innerHTML = `<a href="#home" aria-current="page">${icon("vakken")}<span>Alle vakken</span></a>` +
      ORDER.map(id => `<a href="#${id}-start" data-course="${id}">${icon("start")}<span>${esc(COURSES[id].INFO.short)} · ${esc(COURSES[id].INFO.name)}</span></a>`).join("");
    return;
  }
  if (mark) { mark.textContent = INFO.short; mark.classList.add("txt"); }
  if (sub) sub.textContent = INFO.name;
  if (brand) brand.setAttribute("href", L("start"));
  $("#nav").innerHTML = `<a href="#home" class="nav-back">${icon("terug")}<span>Alle vakken</span></a>` +
    NAV.map(([k, t]) => `<a href="${L(k)}" ${k === cur ? 'aria-current="page"' : ""}>${icon(k)}<span>${t}</span></a>`).join("");
}

// ---------- week filter chips ----------
function weekChips(cur, group, weeks){
  weeks = weeks || WK;
  return `<div class="chips" role="group" aria-label="Kies week">
    <button class="chip" data-${group}="all" aria-pressed="${cur === "all"}">Alle weken</button>
    ${weeks.map(w => `<button class="chip" data-${group}="${w}" aria-pressed="${cur === w}">${w === 9 ? "Extra" : "Week " + w}</button>`).join("")}
  </div>`;
}

// ======================================================================
// HOOFDMENU
// ======================================================================
function courseCard(id){
  const D = COURSES[id], st = loadStore(id), now = Date.now();
  const n = D.FLASH.length, m = D.FLASH.filter(c => st.cards[c.id] && st.cards[c.id].box >= 3).length;
  const due = D.FLASH.filter(c => st.cards[c.id] && st.cards[c.id].due <= now).length;
  const ok = D.MC.filter(q => st.mc[q.id] && st.mc[q.id].last).length;
  const d = daysUntil(st.examDate);
  const last = st.exams[st.exams.length - 1];
  const nWeak = weakTopics(D, st).length;
  let when = "Nog geen tentamendatum ingevuld";
  if (d !== null) when = d > 1 ? `Nog ${d} dagen tot het tentamen` : d === 1 ? "Morgen tentamen!" : d === 0 ? "Vandaag tentamen. Succes!" : "Tentamendatum is geweest";
  return `<a class="course" data-course="${id}" href="#${id}-start">
    <div class="course-top"><span class="mark txt" aria-hidden="true">${esc(D.INFO.short)}</span><span class="eyebrow">${esc(D.INFO.code)}</span></div>
    <h2>${esc(D.INFO.name)}</h2>
    <div class="course-stats">
      <span class="st"><span class="bar"><i style="width:${n ? Math.round(100 * m / n) : 0}%"></i></span><span class="tnum">${m}/${n} kaarten onder de knie</span></span>
      <span class="st"><span class="bar good"><i style="width:${D.MC.length ? Math.round(100 * ok / D.MC.length) : 0}%"></i></span><span class="tnum">${ok}/${D.MC.length} oefenvragen goed</span></span>
    </div>
    <ul class="course-meta small">
      <li>${esc(when)}</li>
      <li>${due ? `${due} ${due === 1 ? "kaart" : "kaarten"} klaar om te herhalen` : "Geen herhalingen open"}</li>
      <li>${last ? `Laatste proeftentamen: ${last.score}/${last.total} (indicatie ${gradeStr(last.grade)})` : "Nog geen proeftentamen gedaan"}</li>
      ${nWeak ? `<li>${plural(nWeak, "onderwerp", "onderwerpen")} met extra aandacht</li>` : ""}
    </ul>
    <span class="btn btn-primary">Oefen ${esc(D.INFO.short)}</span>
  </a>`;
}
function viewHome(){
  return `<div class="wrap">
    <header class="hello">
      <p class="eyebrow">Rechten · Universiteit Utrecht</p>
      <h1>Hoi Manouk</h1>
      <p class="lede">Kies het vak dat je wilt oefenen. Je voortgang wordt per vak apart bewaard.</p>
    </header>
    <div class="courses">${ORDER.map(courseCard).join("")}</div>
    <p class="small muted">Wil je wisselen? Via ‘Alle vakken’ in het menu kom je altijd terug op dit overzicht.</p>
  </div>`;
}
function bindHome(){}

// ======================================================================
// START (per vak)
// ======================================================================
function viewStart(){
  const due = FLASH.filter(isDue).length;
  const neu = FLASH.filter(c => !cardState(c)).length;
  const d = daysUntil(S.examDate);
  let cd;
  if (d === null) cd = `<p class="eyebrow">Tentamendatum</p><p class="small muted">Vul de datum in, dan tellen we af.</p>`;
  else if (d > 1) cd = `<p class="eyebrow">Nog te gaan</p><p class="big tnum">${d} dagen</p>`;
  else if (d === 1) cd = `<p class="eyebrow">Morgen</p><p class="big">Tentamen!</p>`;
  else if (d === 0) cd = `<p class="eyebrow">Vandaag</p><p class="big">Succes!</p>`;
  else cd = `<p class="eyebrow">Tentamen</p><p class="small muted">Deze datum is al geweest.</p>`;
  const total = FLASH.length, mast = FLASH.filter(mastered).length;
  const ms = mcStats(MC);
  const lastExam = S.exams[S.exams.length - 1];
  const sub = d !== null && d >= 0
    ? (d === 0 ? "Vandaag is het zover. Neem rustig de leerpunten nog even door." : `Je hebt ${mast} van de ${total} flashcards onder de knie en ${ms.ok} van de ${ms.total} oefenvragen goed.`)
    : `Alles uit je samenvatting en ${INFO.toets}, omgezet in flashcards, tentamenvragen en casussen. ${mast} van de ${total} kaarten zitten er al in.`;
  const reviewN = due + Math.min(neu, 20);
  const note = INFO.startNote;
  const weak = weakTopics(COURSES[CID], S);
  return `<div class="wrap">
    <header class="hello">
      <p class="eyebrow">${esc(INFO.short)} · ${esc(INFO.code)}</p>
      <h1>${esc(INFO.name)}</h1>
      <p class="lede">${esc(sub)}</p>
    </header>

    <section class="today" aria-label="Vandaag">
      <div class="today-main">
        <p class="eyebrow" style="color:inherit;opacity:.85">Vandaag herhalen</p>
        <p class="big tnum">${reviewN}</p>
        <p>${due ? (due === 1 ? "1 kaart staat klaar om te herhalen" : `${due} kaarten staan klaar om te herhalen`) : "Geen herhalingen open"}${neu ? `, plus ${Math.min(neu,20)} nieuwe.` : "."}</p>
        <a class="btn" href="${L("kaarten")}" data-go-review>${reviewN ? "Start met herhalen" : "Bekijk alle kaarten"}</a>
      </div>
      <div class="today-side">
        <div class="panel countdown">
          ${cd}
          <label class="small muted" for="examDate-${CID}">Datum tentamen</label>
          <input type="date" id="examDate-${CID}" data-examdate value="${esc(S.examDate)}">
        </div>
        <div class="panel stack" style="gap:.4rem">
          <p class="eyebrow">Laatste proeftentamen</p>
          ${lastExam ? `<p><b class="tnum">${lastExam.score}/${lastExam.total}</b> <span class="muted small">· indicatie ${gradeStr(lastExam.grade)}</span></p>` : `<p class="small muted">Nog niet gedaan.</p>`}
          <a class="btn-link small" href="${L("tentamen")}">${lastExam ? "Nog een keer" : "Doe een proeftentamen"}</a>
        </div>
      </div>
    </section>

    <section class="stack">
      <h2>Oefenen</h2>
      <div class="modes">
        <a class="mode" href="${L("oefenen")}"><h3>${icon("oefenen")}Oefenvragen</h3><p>${MC.length} meerkeuzevragen in de stijl van de toets, met uitleg na elk antwoord.</p></a>
        <a class="mode" href="${L("tentamen")}"><h3>${icon("tentamen")}Proeftentamen</h3><p>${INFO.exam.n} vragen achter elkaar, uitslag pas aan het eind.</p></a>
        <a class="mode" href="${L("open")}"><h3>${icon("open")}Open vragen</h3><p>${OPEN.length} casussen zoals op de toets. Zelf nakijken met het antwoordmodel.</p></a>
        <a class="mode" href="${L("sprint")}"><h3>${icon("sprint")}Sprint</h3><p>${SPRINT.length} snelle rondes: ${esc(INFO.sprintBlurb)}.</p></a>
      </div>
    </section>

    ${weak.length ? `<section class="stack">
      <div class="row between"><h2>Extra aandacht nodig</h2><a class="btn-link small" href="${L("aandacht")}">Alle ${weak.length} aandachtspunten</a></div>
      <div class="tlist">${weak.slice(0, 3).map((s, i) => topicRow(s, i === 0)).join("")}</div>
    </section>` : ""}

    ${note ? `<div class="callout" role="note">
      <b>${esc(note.t)}</b>
      <p>${note.html} <a href="${L("leerpunten")}">Meer leerpunten uit ${esc(INFO.toets)}</a></p>
    </div>` : ""}

    <section class="stack">
      <div class="row between"><h2>Voortgang per week</h2><span class="small muted">kaarten onder de knie · vragen goed</span></div>
      <div class="panel weeks" style="padding-block:.4rem">
        ${WK.map(w => {
          const cs = weekCards(w), m = cs.filter(mastered).length;
          const qs = weekMc(w), st = mcStats(qs);
          const pc = cs.length ? Math.round(100 * m / cs.length) : 0;
          const pq = qs.length ? Math.round(100 * st.ok / qs.length) : 0;
          return `<div class="wk">
            <span class="nm">${wlabel(w)}</span>
            <span class="tt">${esc(WEEKS[w].t)}</span>
            <span class="st"><span class="bar"><i style="width:${pc}%"></i></span><span class="tnum">${m}/${cs.length} kaarten</span></span>
            <span class="st">${qs.length ? `<span class="bar good"><i style="width:${pq}%"></i></span><span class="tnum">${st.ok}/${qs.length} vragen</span>` : `<span class="small">alleen kaarten</span>`}</span>
          </div>`;
        }).join("")}
      </div>
    </section>
  </div>`;
}
function bindStart(){
  const inp = $("[data-examdate]");
  if (inp) inp.addEventListener("change", () => { S.examDate = inp.value; save(); render(); });
  const go = $("[data-go-review]");
  if (go) go.addEventListener("click", () => { cardSess = null; cardFilter = {w:"all", mode: FLASH.some(isDue) || FLASH.some(c => !cardState(c)) ? "herhaal" : "alles", k:null}; });
  bindTopicLinks();
}

// ======================================================================
// FLASHCARDS
// ======================================================================
let cardFilter = {w:"all", mode:"herhaal", k:null};
let cardSess = null;
function buildCardQueue(){
  if (cardFilter.k && !TOPIC[cardFilter.k]) cardFilter.k = null;
  const pool = cardFilter.k ? FLASH.filter(c => c.k === cardFilter.k) : weekCards(cardFilter.w);
  let q;
  if (cardFilter.k && cardFilter.mode === "alles") {
    const hardFirst = c => cardState(c) && cardState(c).box <= 1;
    q = shuffle(pool.filter(hardFirst)).concat(shuffle(pool.filter(c => !hardFirst(c))));
  } else if (cardFilter.mode === "herhaal") {
    const due = shuffle(pool.filter(isDue));
    const neu = pool.filter(c => !cardState(c)).slice(0, 20);
    q = due.concat(neu);
  } else if (cardFilter.mode === "moeilijk") {
    q = shuffle(pool.filter(c => cardState(c) && cardState(c).box <= 1));
  } else q = shuffle(pool);
  cardSess = {queue:q, i:0, flipped:false, tally:{1:0,2:0,3:0}, requeued:{}, streak:0};
}
function viewCards(){
  if (!cardSess) buildCardQueue();
  const s = cardSess, c = s.queue[s.i];
  const modeBtn = (k, t) => `<button data-mode="${k}" aria-pressed="${cardFilter.mode === k}">${t}</button>`;
  const head = `<header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Flashcards</p><h1>Kaarten</h1>
    <p class="muted">Denk eerst zelf na, draai dan om en geef eerlijk aan hoe goed je het wist. Kaarten die je lastig vindt komen vaker terug.</p></header>
    <div class="toolbar">
      <div class="seg" role="group" aria-label="Soort ronde">${modeBtn("herhaal","Herhalen")}${modeBtn("alles","Alle kaarten")}${modeBtn("moeilijk","Moeilijke")}</div>
      ${cardFilter.k ? topicPill(cardFilter.k, "data-cclear", "Alle onderwerpen") : weekChips(cardFilter.w, "cw")}
    </div>`;
  if (!s.queue.length) {
    const msg = cardFilter.mode === "moeilijk" ? "Er zijn (nog) geen kaarten die je als lastig hebt gemarkeerd." : cardFilter.mode === "herhaal" ? "Niets meer te herhalen voor vandaag in deze selectie. Lekker bezig!" : "Geen kaarten in deze selectie.";
    return `<div class="wrap">${head}<div class="empty">${msg}<br><br><button class="btn btn-ghost" data-mode-switch="alles">Oefen alle kaarten</button></div></div>`;
  }
  if (!c) {
    const t = s.tally;
    return `<div class="wrap">${head}<div class="panel end">
      <p class="eyebrow">Ronde klaar</p><p class="big">${t[3] >= (t[1] + t[2] + t[3]) * .8 ? "Wauw, bijna alles wist je!" : "Goed gedaan, Manouk."}</p>
      <p class="muted">${t[3]} wist je, ${t[2]} twijfel, ${t[1]} nog niet. Kaarten die je niet wist komen morgen weer langs.</p>
      <div class="row"><button class="btn btn-primary" data-again>Nog een ronde</button>${cardFilter.k && MC.some(q => q.k === cardFilter.k)
        ? `<button class="btn btn-ghost" data-topic-prac="${esc(cardFilter.k)}">Oefen de vragen van dit onderwerp</button>`
        : `<a class="btn btn-ghost" href="${L("oefenen")}">Naar oefenvragen</a>`}</div>
    </div></div>`;
  }
  const st = cardState(c);
  const badge = !st ? "nieuw" : st.box >= 3 ? "zit erin" : st.box <= 1 ? "lastig" : "bijna";
  return `<div class="wrap">${head}
    <div class="stack">
      <div class="fc" id="fc" tabindex="0" role="button" aria-label="${s.flipped ? "Antwoord zichtbaar" : "Draai de kaart om"}">
        <div class="fc-meta"><span class="tag">${wlabel(c.w)} · ${badge}</span><span class="small muted tnum">${s.i + 1} / ${s.queue.length}</span></div>
        <div class="fc-q">${fmt(c.q)}</div>
        ${s.flipped ? `<div class="fc-a">${fmt(c.a)}</div>` : `<div class="fc-hint">Klik op de kaart of druk op <kbd>spatie</kbd> om het antwoord te zien</div>`}
      </div>
      ${s.flipped ? `<div class="rate" role="group" aria-label="Hoe goed wist je het?">
        <button class="r1" data-rate="1">Wist ik niet<small><kbd>1</kbd></small></button>
        <button class="r2" data-rate="2">Twijfel<small><kbd>2</kbd></small></button>
        <button class="r3" data-rate="3">Wist ik<small><kbd>3</kbd></small></button>
      </div>` : ""}
    </div></div>`;
}
function flipCard(){ if (!cardSess || !cardSess.queue[cardSess.i] || cardSess.flipped) return; cardSess.flipped = true; render(); }
function rateCard(r){
  const s = cardSess, c = s && s.queue[s.i]; if (!c || !s.flipped) return;
  const st = S.cards[c.id] || {box:0, due:0, n:0}, now = Date.now();
  const INT = [0,1,2,4,8,16];
  if (r === 1) { st.box = 1; st.due = now; st.f = (st.f || 0) + 1; if ((s.requeued[c.id] || 0) < 2) { s.requeued[c.id] = (s.requeued[c.id] || 0) + 1; s.queue.splice(Math.min(s.i + 4, s.queue.length), 0, c); } }
  else if (r === 2) { st.box = Math.max(1, st.box); st.due = now + DAY; }
  else { st.box = Math.min(5, st.box + 1); st.due = now + INT[st.box] * DAY; }
  st.n = (st.n || 0) + 1; S.cards[c.id] = st; save();
  s.tally[r]++; s.i++; s.flipped = false;
  if (r === 3) { s.streak++; if (STREAK[s.streak]) toast(`<span class="h">${heart}</span> ${STREAK[s.streak]}`); else if (Math.random() < .45) toast(pick(PRAISE)); }
  else s.streak = 0;
  render();
  const fc = $("#fc"); if (fc) fc.focus({preventScroll:true});
}
function bindCards(){
  $$("[data-mode]").forEach(b => b.addEventListener("click", () => { cardFilter.mode = b.dataset.mode; buildCardQueue(); render(); }));
  $$("[data-cw]").forEach(b => b.addEventListener("click", () => { cardFilter.w = b.dataset.cw === "all" ? "all" : Number(b.dataset.cw); buildCardQueue(); render(); }));
  const sw = $("[data-mode-switch]"); if (sw) sw.addEventListener("click", () => { cardFilter.mode = "alles"; buildCardQueue(); render(); });
  const cc = $("[data-cclear]"); if (cc) cc.addEventListener("click", () => { cardFilter.k = null; buildCardQueue(); render(); });
  bindTopicLinks();
  const ag = $("[data-again]"); if (ag) ag.addEventListener("click", () => { buildCardQueue(); render(); });
  const fc = $("#fc"); if (fc) fc.addEventListener("click", flipCard);
  $$("[data-rate]").forEach(b => b.addEventListener("click", () => rateCard(Number(b.dataset.rate))));
}
function keyCards(e){
  if (e.key === " " || e.key === "Enter") { if (cardSess && !cardSess.flipped) { e.preventDefault(); flipCard(); } }
  else if (["1","2","3"].includes(e.key)) { e.preventDefault(); rateCard(Number(e.key)); }
}

// ======================================================================
// QUESTION RENDERING (shared)
// ======================================================================
function prepQuestion(q){ const order = q.fixed ? q.o.map((_, i) => i) : shuffle(q.o.map((_, i) => i)); return {q, order}; }
function questionHTML(item, chosen, reveal){
  const q = item.q;
  const stel = q.st ? `<div class="stel"><p><b>STELLING 1</b><span>${fmt(q.s1)}</span></p><p><b>STELLING 2</b><span>${fmt(q.s2)}</span></p></div><p class="q-text">Welke bewering is juist?</p>` : "";
  const opts = item.order.map((oi, pos) => {
    let cls = "";
    if (reveal) { if (oi === q.a) cls = "ok" + (chosen === q.a ? " pop" : ""); else if (oi === chosen) cls = "no"; }
    else if (oi === chosen) cls = "sel";
    return `<li><button class="opt ${cls}" data-opt="${oi}" ${reveal ? "disabled" : ""}><span class="l">${LETTERS[pos]}</span><span>${fmt(q.o[oi])}</span></button></li>`;
  }).join("");
  return `<div class="q">
    <div class="row"><span class="tag">${wlabel(q.w)} · ${esc(q.t)}</span></div>
    <p class="q-text">${fmt(q.q)}</p>${stel}
    <ul class="opts">${opts}</ul></div>`;
}
function letterIndex(e, item){ const k = e.key.toUpperCase(); const i = LETTERS.indexOf(k); return item && i >= 0 && i < item.order.length ? i : -1; }

// ======================================================================
// PRACTICE
// ======================================================================
let pracFilter = {w:"all", wrong:false, k:null};
let prac = null;
const ALL_WEAK = "@zwak";
function topicKeys(k){ return k === ALL_WEAK ? weakTopics(COURSES[CID], S).map(s => s.t.k) : [k]; }
function buildPrac(){
  if (pracFilter.k && pracFilter.k !== ALL_WEAK && !TOPIC[pracFilter.k]) pracFilter.k = null;
  let queue;
  if (pracFilter.k) {
    // per onderwerp: eerst de vragen die nu nog fout staan, daarna de rest
    const ks = topicKeys(pracFilter.k);
    const pool = MC.filter(q => ks.includes(q.k));
    const isWrong = q => S.mc[q.id] && !S.mc[q.id].last;
    queue = shuffle(pool.filter(isWrong)).concat(shuffle(pool.filter(q => !isWrong(q))));
  } else {
    let pool = weekMc(pracFilter.w);
    if (pracFilter.wrong) pool = pool.filter(q => S.mc[q.id] && !S.mc[q.id].last);
    queue = shuffle(pool);
  }
  prac = {queue: queue.map(prepQuestion), i:0, chosen:null, ok:0, bad:0, streak:0, msg:""};
}
function viewPractice(){
  if (!prac) buildPrac();
  const wrongN = MC.filter(q => S.mc[q.id] && !S.mc[q.id].last).length;
  const head = `<header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Meerkeuze</p><h1>Oefenvragen</h1>
    <p class="muted">Nieuwe vragen in dezelfde vorm als ${esc(INFO.toets)}: casussen, stellingen en begrippen. Na elk antwoord zie je waarom.</p></header>
    <div class="toolbar">
      ${pracFilter.k ? topicPill(pracFilter.k, "data-pclear", "Alle vragen") : `<div class="seg" role="group" aria-label="Selectie"><button data-pw="0" aria-pressed="${!pracFilter.wrong}">Alle vragen</button><button data-pw="1" aria-pressed="${pracFilter.wrong}">Mijn fouten (${wrongN})</button></div>
      ${weekChips(pracFilter.w, "pwk", WK.filter(w => MC.some(q => q.w === w)))}`}
    </div>`;
  if (!prac.queue.length) return `<div class="wrap">${head}<div class="empty">${pracFilter.k ? "Er zijn geen meerkeuzevragen bij dit onderwerp. Herhaal de kaarten of lees de stof." : pracFilter.wrong ? "Geen openstaande fouten in deze selectie. Mooi zo!" : "Geen vragen in deze selectie."}</div></div>`;
  const item = prac.queue[prac.i];
  if (!item) {
    const tot = prac.ok + prac.bad;
    const after = pracFilter.k
      ? `<p class="muted">${prac.bad ? "Wat nog fout ging, zie je terug bij je aandachtspunten. Lees de stof nog even en probeer het dan opnieuw." : "Alles goed. Dit onderwerp schuift nu naar ‘Gaat nu goed’."}</p>
      <div class="row"><a class="btn btn-primary" href="${L("aandacht")}">Naar je aandachtspunten</a><button class="btn btn-ghost" data-pagain>Nog een keer</button></div>`
      : `<p class="muted">Vragen die je fout had vind je terug onder ‘Mijn fouten’ en bij je aandachtspunten, met de stof erbij.</p>
      <div class="row"><button class="btn btn-primary" data-pagain>Opnieuw</button>${wrongN ? `<button class="btn btn-ghost" data-pfout>Oefen mijn fouten</button><a class="btn btn-ghost" href="${L("aandacht")}">Bekijk je aandachtspunten</a>` : ""}</div>`;
    return `<div class="wrap">${head}<div class="panel end"><p class="eyebrow">Klaar</p><p class="big tnum">${prac.ok} van ${tot} goed</p>${tot && prac.ok / tot >= .8 ? `<p class="praise">Sterk, Manouk! Dit gaat echt de goede kant op.</p>` : ""}
      ${after}</div></div>`;
  }
  const reveal = prac.chosen !== null;
  const right = reveal && prac.chosen === item.q.a;
  const tk = item.q.k && TOPIC[item.q.k];
  return `<div class="wrap">${head}
    <div class="scoreline tnum"><span>Vraag <b>${prac.i + 1}</b> van ${prac.queue.length}</span><span>Goed <b>${prac.ok}</b></span><span>Fout <b>${prac.bad}</b></span>${prac.streak >= 3 ? `<span class="streak">${heart} ${prac.streak} op rij</span>` : ""}</div>
    <div class="panel stack">${questionHTML(item, prac.chosen, reveal)}
      ${reveal ? `<div class="explain"><span class="verdict ${right ? "good" : "bad"}">${esc(prac.msg)}</span><p>${fmt(item.q.e)}</p>
        ${!right && tk ? `<p class="small"><button class="btn-link" data-stof="${esc(tk.k)}">Lees de stof over ${esc(tk.t)}</button></p>` : ""}</div>
      <div class="row"><button class="btn btn-primary" id="pnext">Volgende vraag</button><span class="small muted">of druk op <kbd>Enter</kbd></span></div>`
      : `<p class="small muted">Tip: kies met <kbd>A</kbd> t/m <kbd>${LETTERS[item.order.length - 1]}</kbd></p>`}
    </div></div>`;
}
function choosePrac(oi){
  if (!prac || prac.chosen !== null) return; const item = prac.queue[prac.i]; if (!item) return;
  prac.chosen = oi; const ok = oi === item.q.a; if (ok) prac.ok++; else prac.bad++; recordMc(item.q, ok);
  if (ok) { prac.streak++; prac.msg = STREAK[prac.streak] || pick(PRAISE); } else { prac.streak = 0; prac.msg = pick(NOPE); }
  render();
}
function nextPrac(){ if (!prac || prac.chosen === null) return; prac.i++; prac.chosen = null; render(); window.scrollTo({top:0}); }
function bindPractice(){
  $$("[data-pw]").forEach(b => b.addEventListener("click", () => { pracFilter.wrong = b.dataset.pw === "1"; buildPrac(); render(); }));
  $$("[data-pwk]").forEach(b => b.addEventListener("click", () => { pracFilter.w = b.dataset.pwk === "all" ? "all" : Number(b.dataset.pwk); buildPrac(); render(); }));
  $$("[data-opt]").forEach(b => b.addEventListener("click", () => choosePrac(Number(b.dataset.opt))));
  const n = $("#pnext"); if (n) { n.addEventListener("click", nextPrac); n.focus({preventScroll:true}); }
  const a = $("[data-pagain]"); if (a) a.addEventListener("click", () => { buildPrac(); render(); });
  const f = $("[data-pfout]"); if (f) f.addEventListener("click", () => { pracFilter.wrong = true; buildPrac(); render(); });
  const pc = $("[data-pclear]"); if (pc) pc.addEventListener("click", () => { pracFilter = {w:"all", wrong:false, k:null}; buildPrac(); render(); });
  bindTopicLinks();
}
function keyPractice(e){
  if (prac && prac.chosen === null) { const item = prac.queue[prac.i]; const i = letterIndex(e, item); if (i >= 0) { e.preventDefault(); choosePrac(item.order[i]); } }
  else if (e.key === "Enter" && prac && prac.chosen !== null) { e.preventDefault(); nextPrac(); }
}

// ======================================================================
// EXAM
// ======================================================================
let exam = null, examConfirm = false, timerId = null;
function pickExam(n){
  const per = {}; MC.forEach(q => { (per[q.w] = per[q.w] || []).push(q); });
  Object.keys(per).forEach(w => per[w] = shuffle(per[w]));
  const out = []; let k = 0; const ws = shuffle(Object.keys(per));
  while (out.length < n && k < 400) { const w = ws[k % ws.length]; if (per[w].length) out.push(per[w].pop()); k++; }
  return shuffle(out).map(prepQuestion);
}
function fmtTime(ms){ const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
function viewExam(){
  const E = INFO.exam;
  const head = `<header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Proeftentamen</p><h1>${esc(E.title)}</h1></header>`;
  if (!exam) {
    const hist = S.exams.slice(-8).reverse();
    return `<div class="wrap">${head}
      <div class="panel stack">
        <p>${esc(E.desc)}</p>
        <p class="small muted">${esc(E.note)}</p>
        <div class="row"><button class="btn btn-primary" id="examStart">Start proeftentamen</button></div>
      </div>
      ${hist.length ? `<section class="stack"><h2>Eerdere pogingen</h2><div class="panel" style="padding:.6rem 1rem"><table class="hist tnum"><thead><tr><th>Datum</th><th>Score</th><th>Indicatie</th><th>Tijd</th></tr></thead><tbody>
        ${hist.map(h => `<tr><td>${new Date(h.date).toLocaleDateString("nl-NL",{day:"numeric",month:"short"})}</td><td>${h.score}/${h.total}</td><td>${gradeStr(h.grade)}</td><td>${fmtTime(h.ms)}</td></tr>`).join("")}
      </tbody></table></div></section>` : ""}
    </div>`;
  }
  if (exam.done) return examResult(head);
  const item = exam.qs[exam.cur];
  const answered = Object.keys(exam.ans).length;
  return `<div class="wrap">
    <div class="row between"><p class="eyebrow">Proeftentamen · vraag ${exam.cur + 1} van ${exam.qs.length}</p><span class="timer tnum" id="timer">${fmtTime(Date.now() - exam.start)}</span></div>
    <div class="qgrid" aria-label="Vragenoverzicht">${exam.qs.map((_, i) => `<button data-goto="${i}" class="${exam.ans[i] !== undefined ? "done" : ""} ${i === exam.cur ? "cur" : ""}" aria-label="Vraag ${i + 1}">${i + 1}</button>`).join("")}</div>
    <div class="panel stack">${questionHTML(item, exam.ans[exam.cur], false)}
      <div class="row between"><button class="btn btn-ghost" id="ePrev" ${exam.cur === 0 ? "disabled" : ""}>Vorige</button>
      ${exam.cur < exam.qs.length - 1 ? `<button class="btn btn-primary" id="eNext">Volgende</button>` : `<button class="btn btn-primary" id="eHand">Inleveren</button>`}</div>
    </div>
    ${examConfirm ? `<div class="confirm"><p><b>Je hebt ${answered} van de ${exam.qs.length} vragen beantwoord.</b> ${answered < exam.qs.length ? "Onbeantwoorde vragen tellen als fout." : ""} Wil je inleveren?</p>
      <div class="row"><button class="btn btn-primary" id="eYes">Ja, inleveren</button><button class="btn btn-ghost" id="eNo">Verder werken</button></div></div>`
      : `<div class="row between"><span class="small muted tnum">${answered} van ${exam.qs.length} beantwoord</span><button class="btn-link small" id="eHand2">Inleveren</button></div>`}
  </div>`;
}
function examResult(head){
  const r = exam.result, E = INFO.exam;
  const byW = {}, byK = {};
  exam.qs.forEach((it, i) => { const w = it.q.w; byW[w] = byW[w] || {ok:0, n:0}; byW[w].n++; if (exam.ans[i] === it.q.a) byW[w].ok++; else if (it.q.k && TOPIC[it.q.k]) byK[it.q.k] = (byK[it.q.k] || 0) + 1; });
  const worst = Object.keys(byK).sort((a, b) => byK[b] - byK[a]).slice(0, 5);
  return `<div class="wrap">${head}
    <div class="panel stack">
      <p class="eyebrow">Uitslag</p>
      <div class="result-big"><span class="n tnum">${r.score}/${r.total}</span><span class="grade tnum">indicatie ${gradeStr(r.grade)}</span></div>
      ${E.pts && E.pts !== 1 ? `<p class="small muted tnum">${comma(r.score * E.pts)} van de ${comma(r.total * E.pts)} punten${E.guess ? ", raadkans verrekend in de indicatie" : ""}</p>` : ""}
      <p class="${r.frac >= .55 ? "praise" : ""}">${examPraise(r.frac)}</p><p class="muted small">Tijd: ${fmtTime(r.ms)}.</p>
      <div class="weeks">${Object.keys(byW).sort((a,b)=>a-b).map(w => { const b = byW[w], p = Math.round(100 * b.ok / b.n); return `<div class="wk" style="grid-template-columns:4.2rem minmax(0,1fr) 5rem"><span class="nm">${wlabel(w)}</span><span class="bar ${p >= 60 ? "good" : ""}"><i style="width:${p}%"></i></span><span class="small tnum">${b.ok}/${b.n} goed</span></div>`; }).join("")}</div>
      ${worst.length ? `<div class="stack" style="gap:.5rem"><p class="small"><b>Hier ging het vaakst mis.</b> Tik op een onderwerp om de stof te lezen.</p>
        <div class="chips">${worst.map(k => `<button class="chip" data-stof="${esc(k)}">${esc(TOPIC[k].t)} <span class="muted tnum">· ${byK[k]}× fout</span></button>`).join("")}</div></div>` : ""}
      <div class="row"><button class="btn btn-primary" id="eRestart">Nieuw proeftentamen</button><a class="btn btn-ghost" href="${L("aandacht")}">Naar je aandachtspunten</a><a class="btn btn-ghost" href="${L("oefenen")}" data-to-fout>Oefen mijn fouten</a></div>
    </div>
    <section class="stack"><h2>Alle vragen nalopen</h2><div class="panel" style="padding:.4rem 1.2rem">
      ${exam.qs.map((it, i) => { const ok = exam.ans[i] === it.q.a; const yours = exam.ans[i] === undefined ? "niet beantwoord" : it.q.o[exam.ans[i]]; return `<details class="rev">
        <summary><span class="dot ${ok ? "ok" : "no"}">${ok ? "✓" : "✗"}</span><span><span class="small muted tnum">Vraag ${i + 1} · ${wlabel(it.q.w).toLowerCase()}</span><br>${esc(it.q.st ? it.q.q + " " + it.q.s1 + " / " + it.q.s2 : it.q.q)}</span></summary>
        <div class="body">${ok ? "" : `<p><b class="verdict bad">Jouw antwoord:</b> ${esc(yours)}</p>`}<p><b class="verdict good">Juist:</b> ${esc(it.q.o[it.q.a])}</p><p class="muted">${fmt(it.q.e)}</p></div></details>`; }).join("")}
    </div></section>
  </div>`;
}
function examPraise(f){
  if (f >= .9) return "Wauw, Manouk! Dit is bijna foutloos.";
  if (f >= .75) return "Heel sterk. Dit zit er echt goed in.";
  if (f >= .55) return "Voldoende, mooi zo! Hieronder zie je waar nog punten liggen.";
  if (f >= .35) return "Je bent goed op weg. Oefen de weken met de kortste balken nog even.";
  return "Dit is een begin. Start met de flashcards van de weken hieronder.";
}
function handIn(){
  let score = 0;
  exam.qs.forEach((it, i) => { const ok = exam.ans[i] === it.q.a; if (ok) score++; if (exam.ans[i] !== undefined) recordMc(it.q, ok); });
  const total = exam.qs.length, ms = Date.now() - exam.start;
  const {grade, frac} = examGrade(score, total);
  exam.result = {score, total, ms, grade, frac}; exam.done = true; examConfirm = false;
  S.exams.push({date: Date.now(), score, total, grade, ms}); save();
  stopTimer(); render(); window.scrollTo({top:0});
}
function startTimer(){ stopTimer(); timerId = setInterval(() => { const t = $("#timer"); if (t && exam && !exam.done) t.textContent = fmtTime(Date.now() - exam.start); else stopTimer(); }, 1000); }
function stopTimer(){ if (timerId) { clearInterval(timerId); timerId = null; } }
function bindExam(){
  const st = $("#examStart"); if (st) st.addEventListener("click", () => { exam = {qs: pickExam(INFO.exam.n), ans:{}, cur:0, start: Date.now(), done:false}; examConfirm = false; render(); });
  if (exam && !exam.done) startTimer();
  $$("[data-goto]").forEach(b => b.addEventListener("click", () => { exam.cur = Number(b.dataset.goto); render(); }));
  $$("[data-opt]").forEach(b => b.addEventListener("click", () => { if (!exam || exam.done) return; exam.ans[exam.cur] = Number(b.dataset.opt); render(); }));
  const p = $("#ePrev"); if (p) p.addEventListener("click", () => { exam.cur--; render(); });
  const n = $("#eNext"); if (n) n.addEventListener("click", () => { exam.cur++; render(); });
  ["#eHand","#eHand2"].forEach(id => { const h = $(id); if (h) h.addEventListener("click", () => { examConfirm = true; render(); const c = $("#eYes"); if (c) c.scrollIntoView({block:"center"}); }); });
  const y = $("#eYes"); if (y) y.addEventListener("click", handIn);
  const no = $("#eNo"); if (no) no.addEventListener("click", () => { examConfirm = false; render(); });
  const r = $("#eRestart"); if (r) r.addEventListener("click", () => { exam = null; render(); });
  const f = $("[data-to-fout]"); if (f) f.addEventListener("click", () => { pracFilter = {w:"all", wrong:true, k:null}; prac = null; });
  bindTopicLinks();
}
function keyExam(e){
  if (!exam || exam.done) return;
  const item = exam.qs[exam.cur]; const i = letterIndex(e, item);
  if (i >= 0) { e.preventDefault(); exam.ans[exam.cur] = item.order[i]; render(); }
  else if (e.key === "ArrowRight" && exam.cur < exam.qs.length - 1) { exam.cur++; render(); }
  else if (e.key === "ArrowLeft" && exam.cur > 0) { exam.cur--; render(); }
}

// ======================================================================
// OPEN QUESTIONS
// ======================================================================
let openSel = null, openReveal = {}, openResetAsk = false;
const openTotal = o => o.parts.reduce((a, p) => a + p.p, 0);
function openScore(o){ const st = S.open[o.id]; if (!st || !st.checks) return null; let s = 0, any = false; o.parts.forEach(p => { const ch = st.checks[p.l]; if (ch) { any = true; p.c.forEach((c, i) => { if (ch[i]) s += c.p; }); } }); return any ? s : null; }
function viewOpen(){
  if (!openSel) {
    const tip = INFO.openTip;
    return `<div class="wrap"><header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Open vragen</p><h1>Casussen</h1>
      <p class="muted">${esc(INFO.openIntro)}</p></header>
      <div class="olist">${OPEN.map(o => { const sc = openScore(o), tot = openTotal(o); return `<button class="ocard" data-open="${o.id}">
        <span class="tag">${o.src ? esc(o.src.toUpperCase()) + " · " : ""}${o.w.map(wlabel).join(" · ")}</span><h3>${esc(o.title)}</h3>
        <span class="small muted tnum">${o.parts.length} deelvragen · ${tot} punten${sc === null ? "" : ` · laatste score ${comma(sc)}/${tot}`}</span></button>`; }).join("")}</div>
      ${tip ? `<div class="callout"><b>${esc(tip.t)}</b><p>${esc(tip.d)}</p></div>` : ""}
    </div>`;
  }
  const o = OPEN.find(x => x.id === openSel);
  const st = S.open[o.id] || (S.open[o.id] = {drafts:{}, checks:{}});
  const sc = openScore(o), tot = openTotal(o);
  return `<div class="wrap">
    <div><button class="btn-link small" id="oBack">Terug naar alle casussen</button></div>
    <header class="stack" style="gap:.5rem"><p class="eyebrow">Open vraag · ${tot} punten${o.src ? " · " + esc(o.src) : ""}</p><h1>${esc(o.title)}</h1></header>
    <div class="casus"><p class="eyebrow">Casus</p><p class="txt">${esc(o.intro)}</p></div>
    ${o.note ? `<p class="small muted">${esc(o.note)}</p>` : ""}
    ${o.parts.map(p => {
      const draft = (st.drafts && st.drafts[p.l]) || "";
      const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
      const rev = openReveal[o.id + p.l] || (st.checks && st.checks[p.l]);
      const ch = (st.checks && st.checks[p.l]) || [];
      const got = p.c.reduce((a, c, i) => a + (ch[i] ? c.p : 0), 0);
      return `<section class="part">
        <div class="part-h"><h3>Vraag ${p.l}</h3><span class="tag">${p.p} punten${p.wi ? ` · ca. ${p.wi} woorden` : ""}</span></div>
        <p>${fmt(p.q)}</p>
        <textarea id="ta-${CID}-${o.id}-${p.l}" data-draft="${p.l}" placeholder="Typ hier je antwoord..." aria-label="Antwoord vraag ${p.l}">${esc(draft)}</textarea>
        <span class="wc tnum" id="wc-${p.l}">Aantal woorden: ${words}${p.wi ? ` (indicatie ${p.wi})` : ""}</span>
        ${rev ? `<div class="stack" style="gap:.7rem">
            <p class="model-h">Beoordelingscriteria: vink aan wat in jouw antwoord staat</p>
            <ul class="crit">${p.c.map((c, i) => `<li><label><input type="checkbox" data-crit="${p.l}:${i}" ${ch[i] ? "checked" : ""}><span>${esc(c.t)}</span><span class="pt">+${c.p} pt</span></label></li>`).join("")}</ul>
            <p class="small tnum"><b>${got}/${p.p} punten</b>${got === p.p ? ` <span class="praise">Alle punten binnen!</span>` : ""}</p>
            <p class="model-h">Modelantwoord</p><div class="model">${esc(p.m)}</div>
          </div>` : `<div><button class="btn btn-ghost" data-reveal="${p.l}">Bekijk antwoordmodel</button></div>`}
      </section>`;
    }).join("")}
    <div class="total"><span>${sc === tot ? "Volle score, Manouk. Top!" : "Totaal voor deze casus"}</span><b class="tnum">${sc === null ? "0" : comma(sc)}/${tot}</b></div>
    <div class="row"><button class="btn btn-ghost" id="oReset">Wis mijn antwoorden</button>${openResetAsk ? `<span class="small">Zeker weten? <button class="btn-link" id="oResetYes">Ja, wissen</button> · <button class="btn-link" id="oResetNo">Nee</button></span>` : ""}</div>
  </div>`;
}
function bindOpen(){
  $$("[data-open]").forEach(b => b.addEventListener("click", () => { openSel = b.dataset.open; openResetAsk = false; render(); window.scrollTo({top:0}); }));
  const back = $("#oBack"); if (back) back.addEventListener("click", () => { openSel = null; render(); });
  if (!openSel) return;
  const o = OPEN.find(x => x.id === openSel), st = S.open[o.id];
  $$("[data-draft]").forEach(t => t.addEventListener("input", () => {
    st.drafts = st.drafts || {}; st.drafts[t.dataset.draft] = t.value; save();
    const p = o.parts.find(x => x.l === t.dataset.draft);
    const w = t.value.trim() ? t.value.trim().split(/\s+/).length : 0; const wc = $("#wc-" + t.dataset.draft); if (wc) wc.textContent = "Aantal woorden: " + w + (p && p.wi ? ` (indicatie ${p.wi})` : "");
  }));
  $$("[data-reveal]").forEach(b => b.addEventListener("click", () => { openReveal[o.id + b.dataset.reveal] = true; st.checks = st.checks || {}; st.checks[b.dataset.reveal] = st.checks[b.dataset.reveal] || []; save(); const y = window.scrollY; render(); window.scrollTo({top:y}); }));
  $$("[data-crit]").forEach(cb => cb.addEventListener("change", () => { const [l, i] = cb.dataset.crit.split(":"); st.checks[l] = st.checks[l] || []; st.checks[l][Number(i)] = cb.checked; save(); const y = window.scrollY; render(); window.scrollTo({top:y}); }));
  const r = $("#oReset"); if (r) r.addEventListener("click", () => { openResetAsk = true; const y = window.scrollY; render(); window.scrollTo({top:y}); });
  const ry = $("#oResetYes"); if (ry) ry.addEventListener("click", () => { S.open[o.id] = {drafts:{}, checks:{}}; o.parts.forEach(p => delete openReveal[o.id + p.l]); openResetAsk = false; save(); render(); });
  const rn = $("#oResetNo"); if (rn) rn.addEventListener("click", () => { openResetAsk = false; render(); });
}

// ======================================================================
// SPRINT
// ======================================================================
let sp = null, spTimer = null;
function viewSprint(){
  if (!sp) {
    return `<div class="wrap"><header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Sprint</p><h1>Snel herkennen</h1>
      <p class="muted">${esc(INFO.sprintIntro)}</p></header>
      <div class="slist">${SPRINT.map(s => { const best = S.sprint[s.id]; return `<button class="ocard" data-sp="${s.id}"><span class="tag">${wlabel(s.w)}</span><h3>${esc(s.title)}</h3><span class="small muted tnum">${s.items.length} vragen${best ? ` · beste ${best.ok}/${s.items.length}` : ""}</span></button>`; }).join("")}</div>
    </div>`;
  }
  const set = sp.set, it = sp.items[sp.i];
  if (!it) {
    const best = S.sprint[set.id];
    return `<div class="wrap"><div class="panel end"><p class="eyebrow">${esc(set.title)}</p><p class="big tnum">${sp.ok} van ${sp.items.length} goed</p>${sp.ok === sp.items.length ? `<p class="praise">Alles goed! Mooi gedaan, Manouk.</p>` : ""}
      <p class="muted tnum">In ${Math.round(sp.ms / 1000)} seconden.${best && best.ok === sp.ok && best.ms === sp.ms ? " Nieuw record!" : ""}</p>
      ${sp.miss.length ? `<div class="stack" style="gap:.4rem;width:100%"><p class="small"><b>Nog even bekijken:</b></p><ul class="plain small">${sp.miss.map(m => `<li>${esc(m.t)} <b>→ ${esc(m.a)}</b></li>`).join("")}</ul></div>` : ""}
      <div class="row"><button class="btn btn-primary" id="spAgain">Nog een keer</button><button class="btn btn-ghost" id="spBack">Andere ronde</button></div></div></div>`;
  }
  const choices = it.c || set.choices;
  const pct = Math.round(100 * sp.i / sp.items.length);
  return `<div class="wrap">
    <div class="row between"><button class="btn-link small" id="spBack">Stoppen</button><span class="small muted tnum">${sp.streak >= 3 ? `<span class="streak">${heart} ${sp.streak} op rij</span> · ` : ""}${sp.i + 1} / ${sp.items.length} · ${sp.ok} goed</span></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="panel stack" style="gap:1.4rem">
      <p class="eyebrow">${esc(set.title)}</p>
      <p class="sprint-stmt">${esc(it.t)}</p>
      <div class="choices">${choices.map((c, i) => { let cls = ""; if (sp.picked !== null) { if (c === it.a) cls = "ok"; else if (c === sp.picked) cls = "no"; } return `<button data-ch="${esc(c)}" class="${cls}" ${sp.picked !== null ? "disabled" : ""}>${i < 9 ? `<kbd>${i + 1}</kbd> ` : ""}${esc(c)}</button>`; }).join("")}</div>
    </div></div>`;
}
function pickSprint(c){
  if (!sp || sp.picked !== null) return; const it = sp.items[sp.i]; sp.picked = c;
  if (c === it.a) { sp.ok++; sp.streak++; if (STREAK[sp.streak]) toast(`<span class="h">${heart}</span> ${STREAK[sp.streak]}`); } else { sp.miss.push(it); sp.streak = 0; }
  render();
  clearTimeout(spTimer); spTimer = setTimeout(() => { if (!sp) return; sp.i++; sp.picked = null; if (sp.i >= sp.items.length) finishSprint(); if (current === "sprint") render(); }, c === it.a ? 650 : 1500);
}
function finishSprint(){ sp.ms = Date.now() - sp.start; const b = S.sprint[sp.set.id]; if (!b || sp.ok > b.ok || (sp.ok === b.ok && sp.ms < b.ms)) { S.sprint[sp.set.id] = {ok: sp.ok, ms: sp.ms}; save(); } }
function startSprint(id){ const set = SPRINT.find(s => s.id === id); sp = {set, items: shuffle(set.items), i:0, ok:0, picked:null, start: Date.now(), miss:[], streak:0}; render(); }
function bindSprint(){
  $$("[data-sp]").forEach(b => b.addEventListener("click", () => startSprint(b.dataset.sp)));
  $$("[data-ch]").forEach(b => b.addEventListener("click", () => pickSprint(b.dataset.ch)));
  const a = $("#spAgain"); if (a) a.addEventListener("click", () => startSprint(sp.set.id));
  const bk = $("#spBack"); if (bk) bk.addEventListener("click", () => { clearTimeout(spTimer); sp = null; render(); });
}
function keySprint(e){ if (!sp || sp.picked !== null) return; const it = sp.items[sp.i]; if (!it) return; const ch = it.c || sp.set.choices; const n = Number(e.key); if (n >= 1 && n <= ch.length) { e.preventDefault(); pickSprint(ch[n - 1]); } }

// ======================================================================
// NASLAG
// ======================================================================
let nas = {w:"all", q:""};
function viewNaslag(){
  return `<div class="wrap wide"><header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Naslag</p><h1>Overzichten</h1>
    <p class="muted">Alle schema's uit je samenvatting op één plek, plus zoeken in alle begrippen.</p></header>
    <input class="search" id="nasQ" type="search" placeholder="${esc(INFO.searchHint)}" value="${esc(nas.q)}" aria-label="Zoeken">
    <div id="nasBody">${naslagBody()}</div></div>`;
}
function hl(text, q){ const t = esc(text); if (!q) return t.replace(/\n/g,"<br>"); const re = new RegExp("(" + esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); return t.replace(re, "<mark>$1</mark>").replace(/\n/g,"<br>"); }
function naslagBody(){
  const q = nas.q.trim();
  if (q) {
    const ql = q.toLowerCase();
    const hits = FLASH.filter(c => (c.q + " " + c.a).toLowerCase().includes(ql));
    return `<p class="small muted">${hits.length} ${hits.length === 1 ? "resultaat" : "resultaten"}</p>
      <div class="panel defs" style="padding-block:.3rem">${hits.length ? hits.map(c => `<div class="def"><span class="tag" style="align-self:flex-start">${wlabel(c.w)}</span><h3>${hl(c.q, q)}</h3><p>${hl(c.a, q)}</p></div>`).join("") : `<p class="muted" style="padding:1rem 0">Niets gevonden. Probeer een ander woord.</p>`}</div>`;
  }
  const tw = [...new Set(TABLES.map(t => t.w))].sort((a,b)=>a-b);
  const tables = TABLES.filter(t => nas.w === "all" || t.w === nas.w);
  return `<div class="stack">${weekChips(nas.w, "nw", tw)}
    ${tables.map(t => `<section class="stack" style="gap:.6rem"><div class="row"><h2>${esc(t.t)}</h2><span class="tag">${wlabel(t.w)}</span></div>
      ${tableHTML(t)}</section>`).join("")}</div>`;
}
function tableHTML(t){ return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${t.h.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${t.r.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`; }
function bindNaslag(){
  const inp = $("#nasQ");
  if (inp) inp.addEventListener("input", () => { nas.q = inp.value; $("#nasBody").innerHTML = naslagBody(); bindNasChips(); });
  bindNasChips();
}
function bindNasChips(){ $$("[data-nw]").forEach(b => b.addEventListener("click", () => { nas.w = b.dataset.nw === "all" ? "all" : Number(b.dataset.nw); $("#nasBody").innerHTML = naslagBody(); bindNasChips(); })); }

// ======================================================================
// LEERPUNTEN
// ======================================================================
function viewLessons(){
  const Ls = LESSONS;
  const hasMc = w => MC.some(q => q.w === w);
  return `<div class="wrap"><header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Leerpunten</p><h1>Wat ${esc(INFO.toets)} leert</h1>
    <p class="muted">${esc(INFO.lessonsIntro)}</p></header>

    <section class="stack"><h2>Zo ziet het tentamen eruit</h2><ul class="plain">${Ls.format.map(f => `<li>${esc(f)}</li>`).join("")}</ul></section>

    ${Ls.corrections && Ls.corrections.length ? `<section class="stack fix"><h2>${esc(INFO.correctionsTitle || "Klopt niet helemaal in je samenvatting")}</h2>
      ${Ls.corrections.map(c => `<div class="callout"><b>${esc(c.t)}</b><p>${esc(c.d)}</p></div>`).join("")}
    </section>` : ""}

    <section class="stack"><h2>Valkuilen uit ${esc(INFO.toets)}</h2>
      <div class="lessons">${Ls.weak.map(x => `<div class="lesson"><span class="tag" style="align-self:flex-start">${wlabel(x.w)}</span><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>${hasMc(x.w) ? `<button class="btn-link small" style="align-self:flex-start" data-train="${x.w}">Oefen ${x.w === 9 ? "de extra vragen" : "week " + x.w}</button>` : ""}</div>`).join("")}</div>
    </section>

    <section class="stack"><h2>Strategie voor de vragen</h2>
      <div class="lessons">${Ls.tips.map(x => `<div class="lesson"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join("")}</div>
    </section>

    <section class="stack"><h2>Kwam in ${esc(INFO.toets)} voor, maar staat niet in je samenvatting</h2>
      <p class="muted small">De belangrijkste punten hiervan zitten als flashcards onder ‘Extra’. Kijk de rest na in je readers en collegeaantekeningen.</p>
      <ul class="plain">${Ls.missing.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
      <div><a class="btn btn-ghost" href="${L("kaarten")}" data-extra>Oefen de extra kaarten</a></div>
    </section>
  </div>`;
}
function bindLessons(){
  $$("[data-train]").forEach(b => b.addEventListener("click", () => { pracFilter = {w: Number(b.dataset.train), wrong:false, k:null}; prac = null; location.hash = L("oefenen"); }));
  const x = $("[data-extra]"); if (x) x.addEventListener("click", () => { cardFilter = {w:9, mode:"alles", k:null}; cardSess = null; });
}

// ======================================================================
// AANDACHTSPUNTEN: onderwerpen die vaak fout gaan, met de stof erbij
// ======================================================================
let focusSel = null, focusFrom = null, focusJump = false;
const FROM = {oefenen:"Terug naar je oefenvragen", tentamen:"Terug naar je uitslag", start:"Terug naar start", kaarten:"Terug naar je kaarten"};
function openTopic(k, from){
  if (!TOPIC[k]) return;
  focusSel = k; focusFrom = from && from !== "aandacht" ? from : null;
  if (current === "aandacht") { render(); window.scrollTo({top:0}); }
  else { focusJump = true; location.hash = L("aandacht"); }
}
function bindTopicLinks(){
  $$("[data-stof]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openTopic(b.dataset.stof, current); }));
  $$("[data-topic]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openTopic(b.dataset.topic, current); }));
  $$("[data-topic-prac]").forEach(b => b.addEventListener("click", () => { pracFilter = {w:"all", wrong:false, k:b.dataset.topicPrac}; prac = null; location.hash = L("oefenen"); }));
  $$("[data-topic-cards]").forEach(b => b.addEventListener("click", () => { cardFilter = {w:"all", mode:"alles", k:b.dataset.topicCards}; cardSess = null; location.hash = L("kaarten"); }));
}
function topicPill(k, clearAttr, clearText){
  const name = k === ALL_WEAK ? "Al je aandachtspunten" : (TOPIC[k] ? TOPIC[k].t : "");
  return `<div class="row topic-pill"><span class="chip" aria-pressed="true">${k === ALL_WEAK ? "" : "Onderwerp: "}${esc(name)}</span>
    ${k !== ALL_WEAK ? `<button class="btn-link small" data-stof="${esc(k)}">Lees de stof</button><span class="muted small" aria-hidden="true">·</span>` : ""}
    <button class="btn-link small" ${clearAttr}>${esc(clearText)}</button></div>`;
}
function topicRow(s, first){
  const pct = s.tries ? Math.round(100 * s.right / s.tries) : null;
  return `<button class="trow${first ? " first" : ""}" data-topic="${esc(s.t.k)}">
    <span class="trow-main">
      <span class="row" style="gap:.4rem">${first ? `<span class="tag hot">Begin hier</span>` : ""}<span class="tag">${wlabel(s.t.w)}</span></span>
      <span class="trow-t">${esc(s.t.t)}</span>
      <span class="small muted tnum">${esc(statLine(s))}</span>
    </span>
    <span class="trow-side">${pct === null ? `<span class="small muted">alleen kaarten</span>` : `<span class="bar"><i style="width:${pct}%"></i></span><span class="tnum">${pct}% goed</span>`}
      <span class="trow-go">Stof lezen ›</span></span>
  </button>`;
}
function viewFocus(){
  if (focusSel && TOPIC[focusSel]) return viewTopic(TOPIC[focusSel]);
  const all = allTopicStats(COURSES[CID], S);
  const weak = all.filter(x => x.status === "zwak").sort((a, b) => b.score - a.score);
  const better = all.filter(x => x.status === "beter").sort((a, b) => b.wrong - a.wrong);
  const anyData = all.some(x => x.status !== "nieuw");
  const weakQ = weak.reduce((a, s) => a + s.qs.length, 0);
  const head = `<header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · Aandachtspunten</p><h1>Wat je nog moet leren</h1>
    <p class="muted">De onderwerpen waar je de meeste fouten maakt, de lastigste bovenaan. Open een onderwerp, lees de stof uit je samenvatting en oefen daarna meteen de vragen.</p></header>`;
  let main;
  if (weak.length) main = `<section class="stack">
      <div class="row between"><h2>Hier zitten nog fouten</h2><span class="small muted">${plural(weak.length, "onderwerp", "onderwerpen")}</span></div>
      <div class="tlist">${weak.map((s, i) => topicRow(s, i === 0)).join("")}</div>
      ${weakQ ? `<div class="row"><button class="btn btn-ghost" data-topic-prac="${ALL_WEAK}">Oefen alle vragen van deze onderwerpen (${weakQ})</button></div>` : ""}
    </section>`;
  else if (anyData) main = `<div class="panel end"><p class="eyebrow">Geen open fouten</p><p class="big">Alles staat op goed!</p>
      <p class="muted">Knap, Manouk. Maak nog een proeftentamen om te checken of het blijft hangen.</p>
      <div class="row"><a class="btn btn-primary" href="${L("tentamen")}">Doe een proeftentamen</a></div></div>`;
  else main = `<div class="empty">Er is nog niets om te tonen. Maak eerst een paar oefenvragen of een proeftentamen; daarna zie je hier welke onderwerpen extra aandacht nodig hebben.<br><br>
      <a class="btn btn-primary" href="${L("oefenen")}">Naar de oefenvragen</a> <a class="btn btn-ghost" href="${L("tentamen")}">Proeftentamen</a></div>`;
  const groups = WK.map(w => ({w, ts: all.filter(s => s.t.w === w)})).filter(g => g.ts.length);
  const dotT = {zwak:"nog fouten", beter:"eerder fout, nu goed", goed:"goed", nieuw:"nog niet geoefend"};
  return `<div class="wrap">${head}${main}
    ${better.length ? `<section class="stack"><div class="row between"><h2>Gaat nu goed</h2><span class="small muted">eerder fout, nu goed beantwoord</span></div>
      <div class="chips">${better.map(s => `<button class="chip" data-topic="${esc(s.t.k)}"><span class="sdot beter" aria-hidden="true"></span>${esc(s.t.t)}</button>`).join("")}</div></section>` : ""}
    <section class="stack"><h2>Alle onderwerpen</h2>
      <p class="small muted">Ook zonder fouten kun je per onderwerp de stof teruglezen.
        <span class="legend"><span><span class="sdot zwak"></span>nog fouten</span><span><span class="sdot beter"></span>nu goed</span><span><span class="sdot goed"></span>goed</span><span><span class="sdot"></span>nog niet geoefend</span></span></p>
      <div class="tgroups">${groups.map(g => `<div class="tgroup"><p class="eyebrow">${g.w === 9 ? "Extra" : "Week " + g.w} · ${esc(WEEKS[g.w].t)}</p>
        <div class="chips">${g.ts.map(s => `<button class="chip" data-topic="${esc(s.t.k)}" title="${esc(dotT[s.status])}"><span class="sdot ${s.status}" aria-hidden="true"></span>${esc(s.t.t)}</button>`).join("")}</div></div>`).join("")}</div>
    </section>
  </div>`;
}
function viewTopic(t){
  const s = topicStats(COURSES[CID], S, t);
  const wrongQs = s.qs.filter(q => S.mc[q.id] && !S.mc[q.id].last);
  const notes = [...(LESSONS.corrections || []).filter(x => x.k === t.k).map(x => ({x, fix:true})), ...(LESSONS.weak || []).filter(x => x.k === t.k).map(x => ({x, fix:false}))];
  const tables = (t.tables || []).map(n => TABLES.find(x => x.t === n)).filter(Boolean);
  const extraLabel = WEEKS[9] ? WEEKS[9].t : "";
  const fromLabel = focusFrom && FROM[focusFrom];
  const pracActive = focusFrom === "oefenen" && prac && prac.queue[prac.i];
  const actions = (big) => `<div class="row">
    ${s.qs.length ? `<button class="btn ${big ? "btn-primary" : "btn-ghost"}" data-topic-prac="${esc(t.k)}">Oefen de ${plural(s.qs.length, "vraag", "vragen")} van dit onderwerp</button>` : ""}
    <button class="btn btn-ghost" data-topic-cards="${esc(t.k)}">Herhaal de ${plural(s.cs.length, "kaart", "kaarten")}</button></div>`;
  return `<div class="wrap">
    <div class="row between"><button class="btn-link small" id="fBack">${esc(fromLabel || "Alle aandachtspunten")}</button>${fromLabel ? `<button class="btn-link small" id="fAll">Alle aandachtspunten</button>` : ""}</div>
    <header class="stack" style="gap:.5rem"><p class="eyebrow">${esc(INFO.short)} · ${t.w === 9 ? "Extra" : "Week " + t.w} · ${esc(WEEKS[t.w] ? WEEKS[t.w].t : "")}</p><h1>${esc(t.t)}</h1>
      ${s.status === "zwak" || s.status === "beter" ? `<p class="muted tnum">${esc(statLine(s))}${s.status === "beter" ? ". Nu staat alles weer op goed." : ""}</p>` : s.status === "nieuw" ? `<p class="muted">Nog niet geoefend.</p>` : ""}</header>

    ${notes.length ? `<section class="stack" style="gap:.6rem">${notes.map(({x, fix}) => `<div class="callout"><b>${fix ? "Let op, je samenvatting zegt hier iets anders: " : "Valkuil: "}${esc(x.t)}</b><p>${esc(x.d)}</p></div>`).join("")}</section>` : ""}

    ${wrongQs.length ? `<section class="stack" style="gap:.6rem"><h2>Hier ging het mis</h2>
      <p class="small muted">Weet je het nu wel? Denk eerst na en open dan de vraag voor het juiste antwoord.</p>
      <div class="panel" style="padding:.4rem 1.2rem">${wrongQs.map(q => `<details class="rev">
        <summary><span class="dot no" aria-hidden="true">✗</span><span>${esc(q.q)}${q.st ? `<br><span class="small"><b>1:</b> ${esc(q.s1)}<br><b>2:</b> ${esc(q.s2)}</span>` : ""}</span></summary>
        <div class="body"><p><b class="verdict good">Juist:</b> ${esc(q.o[q.a])}</p><p class="muted">${fmt(q.e)}</p></div></details>`).join("")}</div>
    </section>` : ""}

    <section class="stack" style="gap:.6rem"><h2>De stof</h2>
      <p class="small muted">Uit je samenvatting, zoals het ook in je flashcards staat. ${s.hard ? "Kaarten die je lastig vond zijn gemarkeerd." : ""}</p>
      <div class="panel stof">${s.cs.map(c => { const st = S.cards[c.id]; const hard = st && st.box <= 1;
        return `<div class="def${hard ? " hard" : ""}">
          ${hard || c.w === 9 ? `<span class="row" style="gap:.4rem">${hard ? `<span class="tag warn">vond je lastig</span>` : ""}${c.w === 9 ? `<span class="tag">${esc(extraLabel)}</span>` : ""}</span>` : ""}
          <h3>${fmt(c.q)}</h3><p>${fmt(c.a)}</p></div>`; }).join("")}</div>
      ${tables.map(tb => `<div class="stack" style="gap:.5rem"><h3>${esc(tb.t)}</h3>${tableHTML(tb)}</div>`).join("")}
    </section>

    <div class="panel next stack">
      <p><b>Klaar met lezen?</b> ${s.qs.length ? (wrongQs.length ? "Oefen nu de vragen. Die je fout had komen eerst." : "Oefen nu de vragen om te checken of het erin zit.") : "Bij dit onderwerp zijn geen meerkeuzevragen. Herhaal de kaarten om het vast te zetten."}</p>
      ${pracActive ? `<div class="row"><a class="btn btn-primary" href="${L("oefenen")}">Verder met je oefenvragen</a>${s.qs.length ? `<button class="btn btn-ghost" data-topic-prac="${esc(t.k)}">Alleen dit onderwerp oefenen</button>` : ""}</div>` : actions(true)}
    </div>
  </div>`;
}
function bindFocus(){
  const back = $("#fBack");
  if (back) back.addEventListener("click", () => {
    if (focusFrom && FROM[focusFrom]) { const to = focusFrom; focusSel = null; focusFrom = null; location.hash = L(to); }
    else { focusSel = null; render(); window.scrollTo({top:0}); }
  });
  const all = $("#fAll"); if (all) all.addEventListener("click", () => { focusSel = null; focusFrom = null; render(); window.scrollTo({top:0}); });
  bindTopicLinks();
}

// ======================================================================
// VAK WISSELEN
// ======================================================================
const SESS = {};
function stash(){ if (CID) SESS[CID] = {cardFilter, cardSess, pracFilter, prac, exam, examConfirm, openSel, openReveal, openResetAsk, sp, nas, focusSel, focusFrom}; }
function useCourse(id){
  if (CID === id) return;
  stash(); stopTimer(); clearTimeout(spTimer);
  CID = id; const D = COURSES[id];
  ({FLASH, MC, OPEN, SPRINT, WEEKS, TABLES, LESSONS, INFO, WK, TOPICS, TOPIC} = D);
  S = loadStore(id);
  const s = SESS[id] || {};
  focusSel = s.focusSel || null; focusFrom = s.focusFrom || null;
  cardFilter = s.cardFilter || {w:"all", mode:"herhaal", k:null}; cardSess = s.cardSess || null;
  pracFilter = s.pracFilter || {w:"all", wrong:false, k:null}; prac = s.prac || null;
  exam = s.exam || null; examConfirm = !!s.examConfirm;
  openSel = s.openSel || null; openReveal = s.openReveal || {}; openResetAsk = !!s.openResetAsk;
  sp = s.sp && s.sp.picked === null ? s.sp : null; nas = s.nas || {w:"all", q:""};
}
function leaveCourse(){ if (!CID) return; stash(); stopTimer(); clearTimeout(spTimer); CID = null; }

// ======================================================================
// ROUTER
// ======================================================================
const VIEWS = {
  home:[viewHome, bindHome],
  start:[viewStart, bindStart], kaarten:[viewCards, bindCards, keyCards], oefenen:[viewPractice, bindPractice, keyPractice],
  aandacht:[viewFocus, bindFocus],
  tentamen:[viewExam, bindExam, keyExam], open:[viewOpen, bindOpen], sprint:[viewSprint, bindSprint, keySprint],
  naslag:[viewNaslag, bindNaslag], leerpunten:[viewLessons, bindLessons]
};
let current = null;
function render(){
  const v = VIEWS[current];
  $("#view").innerHTML = v[0]();
  v[1]();
}
function parseHash(){
  const h = (location.hash || "").replace("#", "");
  if (!h || h === "home") return {c:null, v:"home"};
  const m = h.match(/^([a-z0-9]+)(?:-([a-z]+))?$/);
  if (m && COURSES[m[1]]) return {c:m[1], v: m[2] && VIEWS[m[2]] && m[2] !== "home" ? m[2] : "start"};
  if (VIEWS[h] && h !== "home" && COURSES.gvr) return {c:"gvr", v:h}; // oude links zonder vak
  return {c:null, v:"home"};
}
function route(){
  const {c, v} = parseHash();
  if (c !== CID || v !== current) { stopTimer(); window.scrollTo({top:0}); }
  if (c) useCourse(c); else leaveCourse();
  // via het menu naar Aandachtspunten: altijd het overzicht; via een link naar een onderwerp: dat onderwerp
  if (v === "aandacht" && v !== current && !focusJump) { focusSel = null; focusFrom = null; }
  focusJump = false;
  current = v; renderNav(v); render();
}
document.addEventListener("keydown", e => {
  const t = e.target; if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable)) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const v = VIEWS[current]; if (v && v[2]) v[2](e);
});
window.addEventListener("hashchange", route);
function init(){
  const tb = $("#themeBtn"); if (tb) tb.addEventListener("click", cycleTheme);
  // menu-klik op Aandachtspunten terwijl je een onderwerp leest: terug naar het overzicht
  $("#nav").addEventListener("click", e => { const a = e.target.closest("a"); if (a && CID && a.getAttribute("href") === L("aandacht") && current === "aandacht" && focusSel) { e.preventDefault(); focusSel = null; focusFrom = null; render(); window.scrollTo({top:0}); } });
  if (THEME) document.documentElement.dataset.ownTheme = "1";
  applyTheme(); route();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
