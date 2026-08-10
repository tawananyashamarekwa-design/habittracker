import React, { useState, useMemo, useEffect } from "react";

/* ============================================================================
   StudyBoard — Student Tracker
   Ported from a Claude Design (x-dc) file to a self-contained React component.
   Design system, seed data, and behaviour preserved from the original.
   ========================================================================== */

// ---- design tokens (injected once) ----------------------------------------
const TOKENS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&family=Barlow+Condensed:wght@400;600&display=swap');
:root{
  --color-bg:#DAF1DE; --color-surface:#c7e6cd; --color-text:#051F20;
  --color-divider: color-mix(in srgb, #051F20 20%, transparent);
  --color-accent:#235347; --color-accent-2:#235347;
  --color-accent-100:#DAF1DE; --color-accent-200:#c7e6cd; --color-accent-300:#8EB69B;
  --color-accent-400:#6a9c81; --color-accent-500:#235347; --color-accent-600:#1c453a;
  --color-accent-700:#163832; --color-accent-800:#0B2B26; --color-accent-900:#051F20;
  --font-heading:"Barlow Condensed", system-ui, sans-serif; --font-heading-weight:600;
  --font-body:"Barlow", system-ui, sans-serif;
  --space-1:3.4px; --space-2:6.8px; --space-3:10.2px; --space-4:13.6px; --space-6:20.4px; --space-8:27.2px;
  --radius-sm:2px; --radius-md:4px; --radius-lg:7px;
  --shadow-sm:0 1px 2px color-mix(in srgb, #2b2b2d 14%, transparent);
  --shadow-md:0 3px 10px color-mix(in srgb, #2b2b2d 16%, transparent);
  --shadow-lg:0 12px 32px color-mix(in srgb, #2b2b2d 22%, transparent);
}
*,*::before,*::after{box-sizing:border-box;}
.sb-root{background:var(--color-bg);color:var(--color-text);font-family:var(--font-body);font-size:15px;line-height:1.55;font-weight:400;}
.sb-root h1,.sb-root h2,.sb-root h3,.sb-root h4,.sb-root h5,.sb-root h6{font-family:var(--font-heading);font-weight:var(--font-heading-weight);line-height:1.12;letter-spacing:-0.015em;margin:0 0 var(--space-2);}
.sb-root h1{font-size:42px;} .sb-root p{margin:0 0 var(--space-3);}
.sb-root a{color:var(--color-accent);text-decoration:none;}
.sb-root a:hover{color:var(--color-accent-700);}
.text-muted{color:color-mix(in srgb, var(--color-text) 55%, transparent);}
.sb-root :focus{outline:none;} .sb-root :focus-visible{outline:2px solid var(--color-accent);outline-offset:2px;}
.sb-root ::selection{background:color-mix(in srgb, var(--color-accent) 30%, transparent);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;text-decoration:none;
  font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:14px;line-height:1.2;color:var(--color-text);
  background:transparent;border:1px solid var(--color-divider);padding:var(--space-2) calc(var(--space-3)*1.2);border-radius:0;}
.btn svg{display:block;} .btn:disabled{opacity:.45;cursor:not-allowed;}
.btn-primary{background:var(--color-accent);color:var(--color-bg);border-color:var(--color-accent);}
.btn-primary:hover{background:var(--color-accent-600);}
.btn-primary:active{background:var(--color-accent-700);}
.btn-secondary:hover{background:color-mix(in srgb, var(--color-text) 7%, transparent);}
.btn-ghost{color:var(--color-accent);padding-inline:var(--space-1);border-color:transparent;}
.btn-ghost:hover{background:color-mix(in srgb, var(--color-accent) 10%, transparent);}
.btn-icon{width:36px;height:36px;padding:0;}

.field>label{display:block;font-size:12px;margin-bottom:5px;color:color-mix(in srgb, var(--color-text) 70%, transparent);}
.input{width:100%;min-height:36px;padding:6px 10px;font:inherit;font-size:14px;color:var(--color-text);caret-color:var(--color-accent);
  background:var(--color-surface);border:1px solid color-mix(in srgb, var(--color-text) 35%, transparent);border-radius:var(--radius-md);}
.input:hover{border-color:color-mix(in srgb, var(--color-text) 55%, transparent);}
.input:focus-visible{border-color:var(--color-accent);outline-offset:0;}
textarea.input{min-height:90px;resize:vertical;}
input[type="date"].input::-webkit-calendar-picker-indicator{filter:invert(0.4);}

.seg{display:inline-flex;overflow:hidden;border:1px solid var(--color-divider);border-radius:0;}
.seg-opt{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;font-size:13px;cursor:pointer;}
.seg-opt+.seg-opt{border-left:1px solid var(--color-divider);}
.seg-opt.active{background:var(--color-accent);color:var(--color-bg);}
.seg-opt:not(.active):hover{background:color-mix(in srgb, var(--color-text) 7%, transparent);}

.card{display:flex;flex-direction:column;gap:var(--space-2);padding:var(--space-3);border-radius:0;background:transparent;border:1px solid var(--color-divider);}
.card-kicker{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--color-accent);}
.card-title{font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:17px;line-height:1.2;}
.card-meta{display:flex;align-items:center;gap:6px;font-size:11px;color:color-mix(in srgb, var(--color-text) 50%, transparent);}

.tag{display:inline-flex;align-items:center;font-size:11px;letter-spacing:.02em;padding:3px 10px;border-radius:0;}
.tag-accent{background:var(--color-accent-100);color:var(--color-accent-800);}
.tag-neutral{background:var(--color-surface);color:var(--color-accent-800);}
.tag-outline{border:1px solid var(--color-accent);color:var(--color-accent);}

.nav-brand{font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:18px;}

.table{width:100%;border-collapse:collapse;font-size:14px;}
.table th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:color-mix(in srgb, var(--color-text) 60%, transparent);padding:var(--space-2);border-bottom:1px solid var(--color-divider);}
.table td{padding:var(--space-2);border-bottom:1px solid color-mix(in srgb, var(--color-text) 8%, transparent);}
.table tbody tr:hover{background:color-mix(in srgb, var(--color-text) 4%, transparent);}

.dialog-backdrop{position:fixed;inset:0;display:grid;place-items:center;padding:var(--space-4);z-index:50;
  background:color-mix(in srgb, #051F20 50%, transparent);}
.dialog{width:min(440px,100%);display:flex;flex-direction:column;gap:var(--space-3);padding:var(--space-4);border-radius:var(--radius-lg);
  background:var(--color-bg);border:1px solid var(--color-accent-300);box-shadow:var(--shadow-lg);}
.dialog-title{font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:20px;}
.dialog-body{font-size:14px;opacity:.85;}
.dialog-actions{display:flex;justify-content:flex-end;gap:var(--space-2);margin-top:var(--space-2);}

.sb-root{min-height:100vh;min-height:100dvh;}
.app-shell{display:flex;min-height:100vh;min-height:100dvh;width:100%;}
.app-sidebar{display:flex;flex-direction:column;width:216px;flex:none;
  border-right:1px solid var(--color-divider);padding:26px 16px;gap:3px;}
.app-main{flex:1;padding:48px 56px 80px;max-width:1080px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 11px;border:none;
  border-left:2px solid transparent;background:transparent;color:var(--color-text);
  font-weight:400;font-family:var(--font-body);font-size:14px;cursor:pointer;
  border-radius:var(--radius-md);text-align:left;width:100%;}
.nav-item.is-active{border-left:2px solid var(--color-accent);color:var(--color-accent-800);font-weight:600;}

@media (max-width:760px){
  .app-shell{flex-direction:column;min-height:100vh;min-height:100dvh;}
  /* Sidebar becomes a fixed bottom tab bar so the app owns the whole screen. */
  .app-sidebar{position:fixed;bottom:0;left:0;right:0;z-index:40;
    flex-direction:row;width:100%;height:auto;flex:none;
    justify-content:space-around;align-items:stretch;
    border-right:none;border-top:1px solid var(--color-divider);
    background:var(--color-bg);padding:6px 4px;gap:0;
    padding-bottom:calc(6px + env(safe-area-inset-bottom));}
  .app-sidebar .nav-brand{display:none;}
  .nav-item{flex:1 1 0!important;flex-direction:column!important;gap:3px!important;
    justify-content:center;align-items:center;white-space:nowrap;
    padding:6px 2px!important;border-left:none!important;font-size:11px!important;
    border-top:2px solid transparent;text-align:center!important;}
  .nav-item.is-active{border-top:2px solid var(--color-accent)!important;border-left:none!important;}
  .nav-item span{font-size:11px;}
  /* Main content stretches edge to edge and scrolls above the tab bar. */
  .app-main{flex:1;width:100%;max-width:100%!important;
    padding:20px 16px calc(78px + env(safe-area-inset-bottom))!important;}
  .stat-grid{grid-template-columns:repeat(2,1fr)!important;}
  .two-col{grid-template-columns:1fr!important;}
  .sb-root h1{font-size:32px;}
}

/* ============================ ANIMATIONS ============================
   Subtle and polished. Everything below is disabled under
   prefers-reduced-motion so the app stays fully usable without motion. */
@keyframes sb-page-in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
@keyframes sb-row-in{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:none;}}
@keyframes sb-pop{0%{transform:scale(.9);}60%{transform:scale(1.06);}100%{transform:scale(1);}}
@keyframes sb-dialog-in{from{opacity:0;transform:translateY(8px) scale(.98);}to{opacity:1;transform:none;}}
@keyframes sb-backdrop-in{from{opacity:0;}to{opacity:1;}}

/* Page / tab transition — the main region fades+rises when activeTab changes
   (React remounts it via a key, replaying the animation). */
.sb-root .app-main{animation:sb-page-in .28s cubic-bezier(.22,.61,.36,1) both;}

/* Buttons — press feedback + smooth colour/hover. */
.sb-root .btn{transition:background .18s ease, color .18s ease, border-color .18s ease, transform .12s ease;}
.sb-root .btn:not(:disabled):active{transform:scale(.96);}
.sb-root .btn-icon:not(:disabled):hover{background:color-mix(in srgb, var(--color-text) 7%, transparent);}

/* Nav items — colour + a soft wash on hover, and the active marker eases in. */
.sb-root .nav-item{transition:color .2s ease, background .2s ease, border-color .25s ease;}
.sb-root .nav-item:hover{background:color-mix(in srgb, var(--color-accent) 8%, transparent);}

/* Segmented control + inputs settle smoothly. */
.sb-root .seg-opt{transition:background .18s ease, color .18s ease;}
.sb-root .input{transition:border-color .16s ease, background .16s ease;}

/* Cards lift a hair on hover for tactility (only bordered/list cards). */
.sb-root .card{transition:transform .18s ease, box-shadow .18s ease;}

/* List rows animate in when added. Add the class in markup on each row. */
.sb-root .animate-in{animation:sb-row-in .26s cubic-bezier(.22,.61,.36,1) both;}

/* Checkbox — accent colour + a gentle pop when toggled on. */
.sb-root input[type="checkbox"]{accent-color:var(--color-accent);cursor:pointer;transition:transform .12s ease;width:16px;height:16px;}
.sb-root input[type="checkbox"]:active{transform:scale(.85);}
.sb-root input[type="checkbox"]:checked{animation:sb-pop .28s ease;}

/* Progress ring + bars ease when their values change. */
.sb-root .sb-ring{transition:background .5s ease;}
.sb-root .sb-bar{transition:width .5s cubic-bezier(.22,.61,.36,1), height .5s cubic-bezier(.22,.61,.36,1), background .3s ease;}

/* Dialog entrance. */
.sb-root .dialog-backdrop{animation:sb-backdrop-in .2s ease both;}
.sb-root .dialog{animation:sb-dialog-in .26s cubic-bezier(.22,.61,.36,1) both;}

@media (prefers-reduced-motion: reduce){
  .sb-root *,.sb-root *::before,.sb-root *::after{
    animation:none!important;transition:none!important;}
}
`;

// ---- icons -----------------------------------------------------------------
const I = {
  home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22 9 12 15 12 15 22" />,
};
const svg = (children, size = 18) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IconHome = () => svg(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>);
const IconSchool = () => svg(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>);
const IconFinance = () => svg(<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></>);
const IconHabits = () => svg(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>);
const IconQuotes = () => svg(<><path d="M6 17h3l2-4V7H5v6h3z" /><path d="M16 17h3l2-4V7h-6v6h3z" /></>);
const IconPlus = (s = 16) => svg(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, s);
const IconTrash = (s = 15) => svg(<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></>, s);
const IconEdit = (s = 12) => svg(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>, s);
const IconClose = (s = 16) => svg(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, s);
const IconShuffle = () => svg(<><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>, 16);
const IconChevL = () => svg(<polyline points="15 18 9 12 15 6" />, 16);
const IconChevR = () => svg(<polyline points="9 18 15 12 9 6" />, 16);
const IconWarn = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-900)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ---- date helpers ----------------------------------------------------------
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
const daysUntil = (iso) => Math.round((new Date(iso + "T00:00:00") - new Date(todayStr() + "T00:00:00")) / 86400000);
const fmtTime = (t) => { const [h, m] = t.split(":").map(Number); const ampm = h >= 12 ? "PM" : "AM"; const h12 = h % 12 === 0 ? 12 : h % 12; return `${h12}:${String(m).padStart(2, "0")} ${ampm}`; };

const COURSE_OPTIONS = [
  "ISS2101 · Secure Coding", "ISS2102 · Number Theory", "ISS2103 · Data Communications & Networks",
  "ISS2104 · Cryptography & Security", "ISS2105 · Secure Software Management",
  "HIT2101 · Technopreneurship III", "TEC302 · TTLC",
];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ---- seed state ------------------------------------------------------------
const initialState = () => ({
  activeTab: "dashboard",
  nextId: 14,
  assignments: [
    { id: 1, title: "Calculus Problem Set 4", subject: "Math", type: "assignment", due: addDays(3), priority: "medium", done: false },
  ],
  assignmentFilter: "all",
  timetable: [
    { id: 1, day: "Monday", start: "08:00", end: "10:00", course: "ISS2101 · Secure Coding", location: "S101" },
    { id: 2, day: "Monday", start: "10:15", end: "12:15", course: "ISS2105 · Secure Software Management", location: "N110" },
    { id: 3, day: "Monday", start: "14:00", end: "16:00", course: "ISS2104 · Cryptography & Security", location: "S101" },
    { id: 4, day: "Tuesday", start: "08:00", end: "10:00", course: "ISS2102 · Number Theory", location: "N110" },
    { id: 5, day: "Tuesday", start: "10:15", end: "12:15", course: "ISS2101 · Secure Coding", location: "N4" },
    { id: 6, day: "Tuesday", start: "14:00", end: "16:00", course: "TEC302 · TTLC", location: "Multi-Purpose" },
    { id: 7, day: "Wednesday", start: "08:00", end: "10:00", course: "ISS2102 · Number Theory", location: "N110" },
    { id: 8, day: "Wednesday", start: "10:15", end: "12:15", course: "ISS2103 · Data Communications & Networks", location: "N10" },
    { id: 9, day: "Wednesday", start: "14:00", end: "16:00", course: "ISS2104 · Cryptography & Security", location: "N103" },
    { id: 10, day: "Thursday", start: "08:00", end: "10:00", course: "HIT2101 · Technopreneurship III", location: "E/Hall" },
    { id: 11, day: "Thursday", start: "10:15", end: "12:15", course: "ISS2105 · Secure Software Management", location: "N110" },
    { id: 12, day: "Thursday", start: "14:00", end: "16:00", course: "ISS2103 · Data Communications & Networks", location: "N109" },
    { id: 13, day: "Friday", start: "08:00", end: "10:00", course: "HIT2101 · Technopreneurship III", location: "E/Hall" },
  ],
  transactions: [
    { id: 1, desc: "Grocery run", category: "Food", amount: 32.5, type: "expense", date: addDays(0) },
  ],
  savingsGoals: [{ id: 1, name: "Phone", target: 800, current: 150 }],
  unallocated: 0,
  budgets: [
    { category: "Food", limit: 150 },
    { category: "Transport", limit: 60 },
    { category: "Entertainment", limit: 40 },
  ],
  nonNegotiables: [
    { id: 1, text: "Read scripture" },
    { id: 2, text: "Workout" },
  ],
  dailyLogs: {},
  logViewDate: addDays(0),
  quotes: [{ id: 1, text: "The secret of getting ahead is getting started.", source: "Mark Twain" }],
  dailyQuoteId: 1,
  dialog: null,
  editingId: null,
  form: {},
});

// ---- small presentational helpers -----------------------------------------
const Field = ({ label, children }) => (
  <div className="field"><label>{label}</label>{children}</div>
);
const IconBtn = ({ onClick, label, children, style }) => (
  <button className="btn btn-icon" onClick={onClick} aria-label={label} style={style}>{children}</button>
);

// ---- cloud persistence ----------------------------------------------------
// Data lives in Supabase and syncs across devices. On mount we load everything
// for the logged-in user; every add/toggle/delete updates the screen instantly
// (optimistic) and writes to the cloud in the background.
import { supabase } from "./supabaseClient";
import * as db from "./data";

export default function StudentTracker({ session }) {
  const userId = session?.user?.id;
  const [s, setS] = useState(() => ({ ...initialState(), assignments: [], timetable: [], transactions: [], savingsGoals: [], budgets: [], nonNegotiables: [], quotes: [], unallocated: 0, dailyQuoteId: null, dailyLogs: {} }));
  const [loading, setLoading] = useState(true);
  const set = (patch) => setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));

  // Load all cloud data on mount (and whenever the user changes).
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      if (userId) await db.ensureProfile(userId);
      const cloud = await db.loadAll();
      if (!alive) return;
      set({ ...cloud });
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [userId]);

  // Persist single-value profile state (unallocated, daily quote, daily logs)
  // whenever they change — after the initial load.
  useEffect(() => {
    if (loading || !userId) return;
    db.saveProfile(userId, { unallocated: s.unallocated, dailyQuoteId: s.dailyQuoteId, dailyLogs: s.dailyLogs });
  }, [s.unallocated, s.dailyQuoteId, s.dailyLogs, loading, userId]);

  const signOut = () => supabase.auth.signOut();

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = TOKENS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const uid = () => { const id = s.nextId; set({ nextId: id + 1 }); return id; };

  // ---- log helpers ----
  const getLog = (dateStr) => s.dailyLogs[dateStr] || { entries: [], nonNegDone: {} };
  const updateLog = (dateStr, updater) =>
    set((st) => ({ dailyLogs: { ...st.dailyLogs, [dateStr]: updater(st.dailyLogs[dateStr] || { entries: [], nonNegDone: {} }) } }));
  // Daily-log entries live inside the profile JSON, so they use a client id.
  const localId = () => Date.now() + Math.floor(Math.random() * 1000);

  // ---- cloud-aware delete/update handlers (optimistic UI + cloud write) ----
  const removeAssignment = (id) => { set((st) => ({ assignments: st.assignments.filter((x) => x.id !== id) })); db.deleteAssignment(id); };
  const toggleAssignment = (id, done) => { set((st) => ({ assignments: st.assignments.map((x) => x.id === id ? { ...x, done } : x) })); db.updateAssignment(id, { done }); };
  const removeClass = (id) => { set((st) => ({ timetable: st.timetable.filter((c) => c.id !== id) })); db.deleteClass(id); };
  const removeTransaction = (id) => { set((st) => ({ transactions: st.transactions.filter((x) => x.id !== id) })); db.deleteTransaction(id); };
  const removeSavingsGoal = (id) => { set((st) => ({ savingsGoals: st.savingsGoals.filter((x) => x.id !== id) })); db.deleteSavingsGoal(id); };
  const removeNonNeg = (id) => { set((st) => ({ nonNegotiables: st.nonNegotiables.filter((x) => x.id !== id) })); db.deleteNonNeg(id); };
  const removeQuote = (id) => {
    set((st) => { const quotes = st.quotes.filter((x) => x.id !== id); const dailyQuoteId = st.dailyQuoteId === id ? (quotes[0] ? quotes[0].id : null) : st.dailyQuoteId; return { quotes, dailyQuoteId }; });
    db.deleteQuote(id);
  };

  // ---- form / dialog ----
  const setForm = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    set((st) => ({ form: { ...st.form, [field]: val } }));
  };
  const closeDialog = () => set({ dialog: null, form: {}, editingId: null });

  const openDialog = (dialog, form = {}, editingId = null) => set({ dialog, form, editingId });

  const saveDialog = async () => {
    const { dialog, form } = s;
    if (dialog === "assignment") {
      const row = { title: form.title || "Untitled", subject: form.subject || "General", type: form.type || "assignment", due: form.due || todayStr(), priority: form.priority || "medium", done: false };
      const saved = await db.addAssignment(row);
      set((st) => ({ assignments: [...st.assignments, saved] }));
    } else if (dialog === "transaction") {
      const amt = parseFloat(form.amount) || 0;
      const type = form.type || "expense";
      const goalId = form.goalId ? parseInt(form.goalId, 10) : null;
      const goalName = goalId ? (s.savingsGoals.find((g) => g.id === goalId) || {}).name : null;
      const row = { desc: form.desc || (type === "income" ? "Income" : "Expense"), category: type === "income" ? (goalName || "Leftover") : (form.category || "Other"), amount: amt, type, date: form.date || todayStr() };
      const saved = await db.addTransaction(row);
      // Adjust the linked balance (goal or unallocated) and persist it.
      if (type === "income" && goalId) {
        const g = s.savingsGoals.find((x) => x.id === goalId);
        if (g) { const current = g.current + amt; await db.updateSavingsGoal(goalId, { current }); set((st) => ({ transactions: [...st.transactions, saved], savingsGoals: st.savingsGoals.map((x) => x.id === goalId ? { ...x, current } : x) })); }
      } else if (type === "income") {
        set((st) => ({ transactions: [...st.transactions, saved], unallocated: st.unallocated + amt }));
      } else {
        set((st) => ({ transactions: [...st.transactions, saved], unallocated: st.unallocated - amt }));
      }
    } else if (dialog === "class") {
      const row = { day: form.day || "Monday", start: form.start || "09:00", end: form.end || "10:00", course: form.course || "Untitled class", location: form.location || "" };
      const saved = await db.addClass(row);
      set((st) => ({ timetable: [...st.timetable, saved] }));
    } else if (dialog === "budget") {
      const cat = form.category || "Other";
      const limit = parseFloat(form.limit) || 0;
      await db.upsertBudget(cat, limit);
      set((st) => {
        const exists = st.budgets.find((b) => b.category.toLowerCase() === cat.toLowerCase());
        const budgets = exists ? st.budgets.map((b) => b.category.toLowerCase() === cat.toLowerCase() ? { ...b, limit } : b) : [...st.budgets, { category: cat, limit }];
        return { budgets };
      });
    } else if (dialog === "savings") {
      const name = form.name || "Savings goal", current = parseFloat(form.current) || 0, target = parseFloat(form.target) || 0;
      if (s.editingId) {
        await db.updateSavingsGoal(s.editingId, { name, current, target });
        set((st) => ({ savingsGoals: st.savingsGoals.map((g) => g.id === st.editingId ? { ...g, name, current, target } : g) }));
      } else {
        const saved = await db.addSavingsGoal({ name, current, target });
        set((st) => ({ savingsGoals: [...st.savingsGoals, saved] }));
      }
    } else if (dialog === "goal") {
      const id = localId();
      updateLog(s.logViewDate, (log) => ({ ...log, entries: [...log.entries, { id, text: form.text || "Untitled entry", done: false }] }));
    } else if (dialog === "nonneg") {
      const saved = await db.addNonNeg(form.text || "Untitled");
      set((st) => ({ nonNegotiables: [...st.nonNegotiables, saved] }));
    } else if (dialog === "quote") {
      const saved = await db.addQuote(form.text || "Untitled quote", form.source || "Unknown");
      set((st) => ({ quotes: [...st.quotes, saved], dailyQuoteId: st.dailyQuoteId || saved.id }));
    }
    closeDialog();
  };

  // ---- derived values (mirrors renderVals) ----
  const v = useMemo(() => {
    const typeTag = (t) => (t === "test" ? "tag-outline" : "tag-accent");
    const typeLabel = (t) => (t === "test" ? "Test" : "Assignment");
    const priorityTag = (p) => (p === "high" ? "tag-accent" : p === "low" ? "tag-neutral" : "tag-outline");

    const assignmentsEnriched = s.assignments.map((a) => {
      const days = daysUntil(a.due);
      const dueWord = days === 0 ? "Today" : days === 1 ? "Tomorrow" : days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`;
      return {
        ...a, typeTag: typeTag(a.type), typeLabel: typeLabel(a.type), priorityTag: priorityTag(a.priority),
        dueLabel: `${fmtDate(a.due)} · ${dueWord}`,
        dueColor: days < 0 && !a.done ? "var(--color-accent-900)" : days <= 2 && !a.done ? "var(--color-accent-700)" : "var(--color-text)",
        doneStrike: a.done ? "line-through" : "none",
      };
    }).sort((x, y) => x.due.localeCompare(y.due));

    const filteredAssignments = assignmentsEnriched.filter((a) => s.assignmentFilter === "all" || a.type === s.assignmentFilter);
    const upcoming = assignmentsEnriched.filter((a) => !a.done).sort((x, y) => x.due.localeCompare(y.due));

    // finance
    const monthPrefix = todayStr().slice(0, 7);
    const spendByCategory = {};
    s.transactions.filter((t) => t.type === "expense" && t.date.slice(0, 7) === monthPrefix).forEach((t) => { spendByCategory[t.category] = (spendByCategory[t.category] || 0) + t.amount; });
    const totalSpent = Object.values(spendByCategory).reduce((sum, x) => sum + x, 0);

    const transactionsEnriched = s.transactions.map((t) => ({
      ...t, dateLabel: fmtDate(t.date),
      amountLabel: (t.type === "income" ? "+$" : "-$") + t.amount.toFixed(2),
      amountColor: t.type === "income" ? "var(--color-accent-700)" : "var(--color-text)",
    }));
    const sortedTransactions = [...transactionsEnriched].sort((a, b) => b.date.localeCompare(a.date));

    const savingsGoalRows = s.savingsGoals.map((g) => {
      const pct = Math.min(100, Math.round((g.current / (g.target || 1)) * 100));
      return { ...g, pct, remaining: Math.max(0, g.target - g.current).toFixed(0), ringGradient: `conic-gradient(var(--color-accent) 0% ${pct}%, var(--color-surface) ${pct}% 100%)` };
    });
    const totalSaved = s.savingsGoals.reduce((sum, g) => sum + g.current, 0);

    const currentYear = new Date().getFullYear();
    const currentMonthIdx = new Date().getMonth();
    const incomeTotalsByMonth = MONTH_ABBR.map(() => 0);
    s.transactions.forEach((t) => { if (t.type !== "income") return; const d = new Date(t.date + "T00:00:00"); if (d.getFullYear() === currentYear) incomeTotalsByMonth[d.getMonth()] += t.amount; });
    const maxMonthIncome = Math.max(1, ...incomeTotalsByMonth);
    const incomeByMonth = MONTH_ABBR.map((label, i) => ({ label, amountLabel: incomeTotalsByMonth[i] > 0 ? `$${incomeTotalsByMonth[i].toFixed(0)}` : "", barPct: Math.max(2, Math.round((incomeTotalsByMonth[i] / maxMonthIncome) * 100)), barColor: i === currentMonthIdx ? "var(--color-accent)" : "var(--color-accent-300)" }));

    const budgetRows = s.budgets.map((b) => {
      const spent = spendByCategory[b.category] || 0;
      const pct = Math.min(100, Math.round((spent / (b.limit || 1)) * 100));
      const over = spent > b.limit;
      return { ...b, spent: spent.toFixed(2), pct, over, barColor: over ? "var(--color-accent-900)" : "var(--color-accent)" };
    });

    // habits
    const tStr = todayStr();
    const todayLog = getLog(tStr);
    const todayNonNeg = s.nonNegotiables.map((n) => { const done = !!todayLog.nonNegDone[n.id]; return { ...n, done, strike: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }; });
    const viewLog = getLog(s.logViewDate);
    const nonNegRows = s.nonNegotiables.map((n) => { const done = !!viewLog.nonNegDone[n.id]; return { ...n, done, strike: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }; });
    const entryRows = viewLog.entries.map((e) => ({ ...e, strike: e.done ? "line-through" : "none", opacity: e.done ? 0.55 : 1 }));
    const logDateLabel = new Date(s.logViewDate + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });

    // quotes
    const dailyQuote = s.quotes.find((q) => q.id === s.dailyQuoteId) || null;

    // timetable
    const timetableDays = DAY_NAMES.map((day) => {
      const classes = s.timetable.filter((c) => c.day === day).sort((a, b) => a.start.localeCompare(b.start))
        .map((c) => ({ ...c, timeLabel: `${fmtTime(c.start)} – ${fmtTime(c.end)}` }));
      return { day: day.slice(0, 3), fullDay: day, classes, empty: classes.length === 0 };
    });
    const todayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
    const todaysDayEntry = timetableDays.find((d) => d.fullDay === todayName);
    const todaysClasses = todaysDayEntry ? todaysDayEntry.classes : [];

    return {
      assignmentsEnriched, filteredAssignments, upcomingTop3: upcoming.slice(0, 3),
      totalSpent, sortedTransactions, savingsGoalRows, totalSaved, incomeByMonth, currentYear, budgetRows,
      todayNonNeg, nonNegRows, entryRows, logDateLabel, dailyQuote, timetableDays, todaysClasses,
    };
  }, [s]);

  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const pageTitles = { dashboard: "Dashboard", assignments: "School", finance: "Finance", goals: "Habits", quotes: "Quotes" };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <IconHome /> },
    { key: "assignments", label: "School", icon: <IconSchool /> },
    { key: "finance", label: "Finance", icon: <IconFinance /> },
    { key: "goals", label: "Habits", icon: <IconHabits /> },
    { key: "quotes", label: "Quotes", icon: <IconQuotes /> },
  ];

  const shuffleQuote = () => {
    const q = s.quotes;
    if (!q.length) return set({ dailyQuoteId: null });
    const others = q.filter((x) => x.id !== s.dailyQuoteId);
    const pool = others.length ? others : q;
    set({ dailyQuoteId: pool[Math.floor(Math.random() * pool.length)].id });
  };

  const dialogTitle = {
    assignment: "New assignment / test", transaction: "New transaction", class: "Add class",
    budget: "Set budget", savings: s.editingId ? "Edit savings goal" : "New savings goal",
    goal: "New entry", nonneg: "New non-negotiable", quote: "Add quote",
  }[s.dialog] || "";

  // ============================ RENDER ======================================
  return (
    <div className="sb-root">
      <div className="app-shell">

        {/* sidebar */}
        <nav className="app-sidebar">
          <div className="nav-brand" style={{ marginBottom: 22 }}>StudyBoard</div>
          {navItems.map((n) => {
            const active = s.activeTab === n.key;
            return (
              <button key={n.key} className={`nav-item ${active ? "is-active" : ""}`} onClick={() => set({ activeTab: n.key })}>
                {n.icon}<span>{n.label}</span>
              </button>
            );
          })}
        </nav>

        {/* main */}
        <main key={s.activeTab} className="app-main">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 26, flexWrap: "wrap", gap: 8 }}>
            <h1 style={{ margin: 0 }}>{pageTitles[s.activeTab]}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="text-muted" style={{ fontSize: 13 }}>{loading ? "Syncing…" : todayLabel}</div>
              <button className="btn btn-ghost" onClick={signOut} style={{ fontSize: 13 }}>Sign out</button>
            </div>
          </div>

          {/* ---------------- DASHBOARD ---------------- */}
          {s.activeTab === "dashboard" && (
            <>
              {v.dailyQuote && (
                <div className="card" style={{ padding: "20px 0", marginBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 14, border: "none", borderBottom: "1px solid var(--color-divider)" }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 19, fontStyle: "italic", lineHeight: 1.3 }}>"{v.dailyQuote.text}"</p>
                    <div className="card-meta" style={{ marginTop: 8 }}>— {v.dailyQuote.source}</div>
                  </div>
                  <IconBtn onClick={shuffleQuote} label="Another quote"><IconShuffle /></IconBtn>
                </div>
              )}
              <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div className="card" style={{ padding: 22, border: "none" }}>
                  <div className="card-title" style={{ marginBottom: 8 }}>Non-negotiables today</div>
                  {v.todayNonNeg.map((n) => (
                    <label key={n.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer", fontSize: 14 }}>
                      <input type="checkbox" checked={n.done} onChange={() => updateLog(todayStr(), (log) => ({ ...log, nonNegDone: { ...log.nonNegDone, [n.id]: !log.nonNegDone[n.id] } }))} />
                      <span style={{ flex: 1, textDecoration: n.strike, opacity: n.opacity }}>{n.text}</span>
                    </label>
                  ))}
                  {v.todayNonNeg.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No non-negotiables set — add them from the Habits tab.</p>}
                </div>
                <div className="card" style={{ padding: 22, border: "none" }}>
                  <div className="card-title" style={{ marginBottom: 8 }}>Today's lectures</div>
                  {v.todaysClasses.map((cl) => (
                    <div key={cl.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                      <span className="text-muted" style={{ fontSize: 12, width: 100, flex: "none" }}>{cl.timeLabel}</span>
                      <span style={{ flex: 1, fontSize: 14 }}>{cl.course}</span>
                      <span className="text-muted" style={{ fontSize: 11 }}>{cl.location}</span>
                    </div>
                  ))}
                  {v.todaysClasses.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No lectures today.</p>}
                </div>
              </div>
              <div className="card" style={{ padding: 22, border: "none" }}>
                <div className="card-title" style={{ marginBottom: 8 }}>Upcoming assignments &amp; exams</div>
                {v.upcomingTop3.map((a) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                    <span className={`tag ${a.typeTag}`}>{a.typeLabel}</span>
                    <span style={{ flex: 1, fontSize: 14 }}>{a.title}</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>{a.dueLabel}</span>
                  </div>
                ))}
                {v.upcomingTop3.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Nothing due — you're clear.</p>}
              </div>
            </>
          )}

          {/* ---------------- SCHOOL / ASSIGNMENTS ---------------- */}
          {s.activeTab === "assignments" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div className="seg">
                  {[["all", "All"], ["assignment", "Assignments"], ["test", "Tests"]].map(([f, label]) => (
                    <label key={f} className={`seg-opt ${s.assignmentFilter === f ? "active" : ""}`}>
                      <input type="radio" name="afilter" style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} checked={s.assignmentFilter === f} onChange={() => set({ assignmentFilter: f })} />
                      {label}
                    </label>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={() => openDialog("assignment", { title: "", subject: "", type: "assignment", priority: "medium", due: addDays(3) })}>{IconPlus()} Add item</button>
              </div>

              {s.assignmentFilter === "all" && (
                <div className="card" style={{ padding: 22, marginBottom: 28, border: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                    <div className="card-title">Weekly timetable</div>
                    <button className="btn btn-ghost" onClick={() => openDialog("class", { course: COURSE_OPTIONS[0], day: "Monday", start: "09:00", end: "10:00", location: "" })}>{IconPlus(14)} Add class</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                    {v.timetableDays.map((dcol) => (
                      <div key={dcol.fullDay}>
                        <div className="card-meta" style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10.5, marginBottom: 6 }}>{dcol.day}</div>
                        {dcol.classes.map((cl) => (
                          <div key={cl.id} className="card animate-in" style={{ padding: 10, marginBottom: 8, border: "none", borderLeft: "2px solid var(--color-accent-400)" }}>
                            <div style={{ fontSize: 11, color: "var(--color-accent-700)" }}>{cl.timeLabel}</div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{cl.course}</div>
                            <div className="card-meta">{cl.location}</div>
                            <IconBtn onClick={() => removeClass(cl.id)} label="Delete" style={{ width: 22, height: 22, marginTop: 4 }}>{IconClose(12)}</IconBtn>
                          </div>
                        ))}
                        {dcol.empty && <p className="text-muted" style={{ fontSize: 11 }}>—</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {v.filteredAssignments.length === 0 ? (
                <div className="card" style={{ padding: 32, textAlign: "center" }}><p className="text-muted" style={{ margin: 0 }}>Nothing here. Add an assignment or test to start tracking due dates.</p></div>
              ) : (
                <table className="table">
                  <thead><tr><th>Title</th><th>Subject</th><th>Type</th><th>Due</th><th>Priority</th><th></th><th></th></tr></thead>
                  <tbody>
                    {v.filteredAssignments.map((a) => (
                      <tr key={a.id} className="animate-in">
                        <td style={{ textDecoration: a.doneStrike }}>{a.title}</td>
                        <td>{a.subject}</td>
                        <td><span className={`tag ${a.typeTag}`}>{a.typeLabel}</span></td>
                        <td><span style={{ color: a.dueColor }}>{a.dueLabel}</span></td>
                        <td><span className={`tag ${a.priorityTag}`}>{a.priority}</span></td>
                        <td><label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}><input type="checkbox" checked={a.done} onChange={() => toggleAssignment(a.id, !a.done)} />done</label></td>
                        <td><IconBtn onClick={() => removeAssignment(a.id)} label="Delete">{IconTrash()}</IconBtn></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* ---------------- FINANCE ---------------- */}
          {s.activeTab === "finance" && (
            <>
              <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
                <div className="card" style={{ padding: 22, border: "none" }}>
                  <div className="card-kicker">Total saved</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 600 }}>${v.totalSaved.toFixed(0)}</div>
                  <div className="card-meta">across {v.savingsGoalRows.length} goals</div>
                </div>
                <div className="card" style={{ padding: 22, border: "none" }}>
                  <div className="card-kicker">Leftover / spending money</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 600, color: "var(--color-accent-700)" }}>${s.unallocated.toFixed(0)}</div>
                  <div className="card-meta">not tied to a goal</div>
                </div>
                <div className="card" style={{ padding: 22, border: "none" }}>
                  <div className="card-kicker">Monthly expenses</div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 600 }}>${v.totalSpent.toFixed(0)}</div>
                  <div className="card-meta">this month</div>
                </div>
              </div>

              <div className="card" style={{ padding: 22, border: "none", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                  <div className="card-title">Savings goals</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost" onClick={() => openDialog("transaction", { desc: "", type: "income", amount: "", category: "", goalId: "", date: todayStr() })}>{IconPlus(14)} Add income</button>
                    <button className="btn btn-primary" onClick={() => openDialog("savings", { name: "", current: "0", target: "" })}>{IconPlus()} New goal</button>
                  </div>
                </div>
                {v.savingsGoalRows.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No savings goals yet — add what you're saving for, like a phone.</p>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
                  {v.savingsGoalRows.map((g) => (
                    <div key={g.id} className="animate-in" style={{ border: "1px solid var(--color-divider)", padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div className="card-title">{g.name}</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <IconBtn onClick={() => openDialog("savings", { name: g.name, current: g.current, target: g.target }, g.id)} label="Edit" style={{ width: 22, height: 22 }}>{IconEdit()}</IconBtn>
                          <IconBtn onClick={() => removeSavingsGoal(g.id)} label="Delete" style={{ width: 22, height: 22 }}>{IconTrash(12)}</IconBtn>
                        </div>
                      </div>
                      <div className="sb-ring" style={{ width: 96, height: 96, borderRadius: "50%", background: g.ringGradient, margin: "14px auto 10px", position: "relative" }}>
                        <div style={{ position: "absolute", inset: 10, borderRadius: "50%", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 600 }}>{g.pct}%</div>
                      </div>
                      <div className="card-meta" style={{ justifyContent: "center" }}>${g.current} of ${g.target}</div>
                      <div className="card-meta" style={{ justifyContent: "center", color: "var(--color-accent-700)" }}>${g.remaining} left to go</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22, border: "none", marginBottom: 24 }}>
                <div className="card-title" style={{ marginBottom: 16 }}>Income by month · {v.currentYear}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, borderBottom: "1px solid var(--color-divider)", paddingBottom: 2 }}>
                  {v.incomeByMonth.map((m) => (
                    <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, height: "100%", justifyContent: "flex-end" }}>
                      <span className="text-muted" style={{ fontSize: 10 }}>{m.amountLabel}</span>
                      <div className="sb-bar" style={{ width: "100%", maxWidth: 28, height: `${m.barPct}%`, background: m.barColor }} />
                      <span className="text-muted" style={{ fontSize: 10.5 }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22, border: "none", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div className="card-title">Budgets</div>
                  <button className="btn btn-ghost" onClick={() => openDialog("budget", { category: "", limit: "" })}>{IconPlus(14)} Add budget</button>
                </div>
                {v.budgetRows.map((b) => (
                  <div key={b.category} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>{b.category}{b.over && <IconWarn />}</span>
                      <span className="text-muted">${b.spent} / ${b.limit}</span>
                    </div>
                    <div style={{ height: 7, background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}><div className="sb-bar" style={{ height: "100%", width: `${b.pct}%`, background: b.barColor }} /></div>
                  </div>
                ))}
                {v.budgetRows.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No budgets set. Add one per spending category.</p>}
              </div>

              <div className="card" style={{ padding: 22, border: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div className="card-title">Transactions</div>
                  <button className="btn btn-primary" onClick={() => openDialog("transaction", { desc: "", type: "income", amount: "", category: "", goalId: "", date: todayStr() })}>{IconPlus()} Add</button>
                </div>
                {v.sortedTransactions.length > 0 ? (
                  <table className="table">
                    <thead><tr><th>Description</th><th>Category</th><th>Date</th><th>Amount</th><th></th></tr></thead>
                    <tbody>
                      {v.sortedTransactions.map((t) => (
                        <tr key={t.id} className="animate-in">
                          <td>{t.desc}</td>
                          <td><span className="tag tag-neutral">{t.category}</span></td>
                          <td>{t.dateLabel}</td>
                          <td style={{ color: t.amountColor }}>{t.amountLabel}</td>
                          <td><IconBtn onClick={() => removeTransaction(t.id)} label="Delete">{IconTrash()}</IconBtn></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-muted" style={{ fontSize: 13 }}>No transactions logged yet.</p>}
              </div>
            </>
          )}

          {/* ---------------- HABITS / GOALS ---------------- */}
          {s.activeTab === "goals" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconBtn onClick={() => set((st) => { const d = new Date(st.logViewDate + "T00:00:00"); d.setDate(d.getDate() - 1); return { logViewDate: d.toISOString().slice(0, 10) }; })} label="Previous day"><IconChevL /></IconBtn>
                  <div className="card-title" style={{ minWidth: 180, textAlign: "center" }}>{v.logDateLabel}</div>
                  <IconBtn onClick={() => set((st) => { const d = new Date(st.logViewDate + "T00:00:00"); d.setDate(d.getDate() + 1); return { logViewDate: d.toISOString().slice(0, 10) }; })} label="Next day"><IconChevR /></IconBtn>
                  {s.logViewDate !== todayStr() && <button className="btn btn-ghost" onClick={() => set({ logViewDate: todayStr() })}>Today</button>}
                </div>
                <input className="input" type="date" style={{ width: 160 }} value={s.logViewDate} onChange={(e) => set({ logViewDate: e.target.value })} />
              </div>

              <div className="card" style={{ padding: 22, border: "none", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div className="card-title">Non-negotiables</div>
                  <button className="btn btn-ghost" onClick={() => openDialog("nonneg", { text: "" })}>{IconPlus(14)} Add</button>
                </div>
                {v.nonNegRows.map((n) => (
                  <div key={n.id} className="animate-in" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                    <input type="checkbox" checked={n.done} onChange={() => updateLog(s.logViewDate, (log) => ({ ...log, nonNegDone: { ...log.nonNegDone, [n.id]: !log.nonNegDone[n.id] } }))} />
                    <span style={{ flex: 1, fontSize: 14, textDecoration: n.strike, opacity: n.opacity }}>{n.text}</span>
                    <IconBtn onClick={() => removeNonNeg(n.id)} label="Delete">{IconTrash(14)}</IconBtn>
                  </div>
                ))}
                {v.nonNegRows.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No non-negotiables yet — the things that must get done every day.</p>}
              </div>

              <div className="card" style={{ padding: 22, border: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div className="card-title">What I want to achieve</div>
                  <button className="btn btn-primary" onClick={() => openDialog("goal", { text: "" })}>{IconPlus()} Add entry</button>
                </div>
                {v.entryRows.map((g) => (
                  <div key={g.id} className="animate-in" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0" }}>
                    <input type="checkbox" checked={g.done} onChange={() => updateLog(s.logViewDate, (log) => ({ ...log, entries: log.entries.map((e) => e.id === g.id ? { ...e, done: !e.done } : e) }))} />
                    <span style={{ flex: 1, fontSize: 14, textDecoration: g.strike, opacity: g.opacity }}>{g.text}</span>
                    <IconBtn onClick={() => updateLog(s.logViewDate, (log) => ({ ...log, entries: log.entries.filter((e) => e.id !== g.id) }))} label="Delete">{IconTrash(14)}</IconBtn>
                  </div>
                ))}
                {v.entryRows.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Nothing logged for this day yet.</p>}
              </div>
            </>
          )}

          {/* ---------------- QUOTES ---------------- */}
          {s.activeTab === "quotes" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button className="btn btn-primary" onClick={() => openDialog("quote", { text: "", source: "" })}>{IconPlus()} Add quote</button>
              </div>
              {s.quotes.length === 0 ? (
                <div className="card" style={{ padding: 32, textAlign: "center" }}><p className="text-muted" style={{ margin: 0 }}>No quotes yet. Add ones that keep you going — one shows up on your Dashboard each visit.</p></div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                  {s.quotes.map((q) => (
                    <div key={q.id} className="card animate-in" style={{ padding: 22, border: "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <p style={{ margin: 0, fontStyle: "italic", fontSize: 14, flex: 1 }}>"{q.text}"</p>
                        <IconBtn onClick={() => removeQuote(q.id)} label="Delete">{IconTrash(14)}</IconBtn>
                      </div>
                      <div className="card-meta" style={{ marginTop: 8 }}>— {q.source}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ---------------- DIALOG ---------------- */}
      {s.dialog && (
        <div className="dialog-backdrop" onClick={closeDialog}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="dialog-title">{dialogTitle}</div>
              <IconBtn onClick={closeDialog} label="Close">{IconClose()}</IconBtn>
            </div>
            <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {s.dialog === "assignment" && (<>
                <Field label="Title"><input className="input" value={s.form.title || ""} onChange={setForm("title")} placeholder="e.g. Calc Problem Set 4" /></Field>
                <Field label="Subject"><input className="input" value={s.form.subject || ""} onChange={setForm("subject")} placeholder="e.g. Math" /></Field>
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Type"><select className="input" value={s.form.type || "assignment"} onChange={setForm("type")}><option value="assignment">Assignment</option><option value="test">Test / Exam</option></select></Field>
                  <Field label="Priority"><select className="input" value={s.form.priority || "medium"} onChange={setForm("priority")}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></Field>
                </div>
                <Field label="Due date"><input className="input" type="date" value={s.form.due || ""} onChange={setForm("due")} /></Field>
              </>)}

              {s.dialog === "transaction" && (<>
                <Field label="Description"><input className="input" value={s.form.desc || ""} onChange={setForm("desc")} placeholder="e.g. Grocery run" /></Field>
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Type"><select className="input" value={s.form.type || "expense"} onChange={setForm("type")}><option value="expense">Expense</option><option value="income">Income</option></select></Field>
                  <Field label="Amount ($)"><input className="input" type="number" step="0.01" value={s.form.amount || ""} onChange={setForm("amount")} /></Field>
                </div>
                {s.form.type === "income" ? (
                  <Field label="Save toward"><select className="input" value={s.form.goalId || ""} onChange={setForm("goalId")}>
                    <option value="">Leftover / spending money</option>
                    {s.savingsGoals.map((g) => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
                  </select></Field>
                ) : (
                  <Field label="Category"><input className="input" value={s.form.category || ""} onChange={setForm("category")} placeholder="e.g. Food" /></Field>
                )}
                <Field label="Date"><input className="input" type="date" value={s.form.date || ""} onChange={setForm("date")} /></Field>
              </>)}

              {s.dialog === "class" && (<>
                <Field label="Course"><select className="input" value={s.form.course || COURSE_OPTIONS[0]} onChange={setForm("course")}>{COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
                <Field label="Day"><select className="input" value={s.form.day || "Monday"} onChange={setForm("day")}>{DAY_NAMES.map((d) => <option key={d} value={d}>{d}</option>)}</select></Field>
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Start time"><input className="input" type="time" value={s.form.start || "09:00"} onChange={setForm("start")} /></Field>
                  <Field label="End time"><input className="input" type="time" value={s.form.end || "10:00"} onChange={setForm("end")} /></Field>
                </div>
                <Field label="Location"><input className="input" value={s.form.location || ""} onChange={setForm("location")} placeholder="e.g. Room 204" /></Field>
              </>)}

              {s.dialog === "budget" && (<>
                <Field label="Category"><input className="input" value={s.form.category || ""} onChange={setForm("category")} placeholder="e.g. Food" /></Field>
                <Field label="Monthly limit ($)"><input className="input" type="number" step="1" value={s.form.limit || ""} onChange={setForm("limit")} /></Field>
              </>)}

              {s.dialog === "savings" && (<>
                <Field label="Goal name"><input className="input" value={s.form.name || ""} onChange={setForm("name")} /></Field>
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Current ($)"><input className="input" type="number" step="1" value={s.form.current || ""} onChange={setForm("current")} /></Field>
                  <Field label="Target ($)"><input className="input" type="number" step="1" value={s.form.target || ""} onChange={setForm("target")} /></Field>
                </div>
              </>)}

              {s.dialog === "goal" && (
                <Field label="What do you want to achieve?"><input className="input" value={s.form.text || ""} onChange={setForm("text")} placeholder="e.g. Finish reading Chapter 4" /></Field>
              )}

              {s.dialog === "nonneg" && (
                <Field label="Non-negotiable"><input className="input" value={s.form.text || ""} onChange={setForm("text")} placeholder="e.g. Pray, workout, no sugar" /></Field>
              )}

              {s.dialog === "quote" && (<>
                <Field label="Quote or verse"><textarea className="input" rows={3} value={s.form.text || ""} onChange={setForm("text")} placeholder="The words themselves" /></Field>
                <Field label="Source"><input className="input" value={s.form.source || ""} onChange={setForm("source")} placeholder="e.g. Marcus Aurelius" /></Field>
              </>)}

            </div>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={closeDialog}>Cancel</button>
              <button className="btn btn-primary" onClick={saveDialog}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
