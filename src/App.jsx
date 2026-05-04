import { useState, useEffect, useRef } from "react";
import { useCollection } from "./useFirestore";

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4M16 2v4"/></>,
    pen: <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    chevronL: <><polyline points="15 18 9 12 15 6"/></>,
    chevronR: <><polyline points="9 18 15 12 9 6"/></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></>,
    facebook: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
    tiktok: <><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    type: <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    hash: <><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>,
    messageCircle: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    palette: <><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

/* ─── FONTS ──────────────────────────────────────────────────────────────── */
const FONT_OPTIONS = [
  { id: "outfit",    label: "Outfit",      import: "Outfit:wght@300;400;500;600;700" },
  { id: "inter",     label: "Inter",       import: "Inter:wght@300;400;500;600;700" },
  { id: "dm-sans",   label: "DM Sans",     import: "DM+Sans:wght@300;400;500;600;700" },
  { id: "nunito",    label: "Nunito",      import: "Nunito:wght@300;400;500;600;700" },
  { id: "poppins",   label: "Poppins",     import: "Poppins:wght@300;400;500;600;700" },
  { id: "raleway",   label: "Raleway",     import: "Raleway:wght@300;400;500;600;700" },
  { id: "lato",      label: "Lato",        import: "Lato:wght@300;400;700" },
  { id: "manrope",   label: "Manrope",     import: "Manrope:wght@300;400;500;600;700" },
];
const FONT_SIZES = [
  { id: "xs",  label: "Molto piccolo", base: 12 },
  { id: "sm",  label: "Piccolo",       base: 13 },
  { id: "md",  label: "Normale",       base: 14 },
  { id: "lg",  label: "Grande",        base: 15 },
  { id: "xl",  label: "Molto grande",  base: 17 },
];

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const PLATFORMS = ["Instagram", "Facebook", "TikTok", "Tutte"];
const POST_STATUSES = ["Da Editare", "Pronto", "Programmato", "Pubblicato"];
const STATUS_COLORS = {
  "Da Editare":  { bg: "#ef4444", light: "#fef2f2", text: "#991b1b" },
  "Pronto":      { bg: "#22c55e", light: "#f0fdf4", text: "#166534" },
  "Programmato": { bg: "#6366f1", light: "#eef2ff", text: "#3730a3" },
  "Pubblicato":  { bg: "#0ea5e9", light: "#f0f9ff", text: "#075985" },
};
const PALETTE = ["#e74c3c","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#607d8b","#f06292","#ba68c8","#81d4fa","#80cbc4","#a5d6a7","#ffcc02","#ff7043","#26c6da","#66bb6a","#ab47bc","#5c6bc0","#ec407a"];
const DAYS_IT   = ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const PICONS    = { "Instagram": "instagram", "Facebook": "facebook", "TikTok": "tiktok", "Tutte": "globe" };

function genId() { return "id_" + Math.random().toString(36).slice(2, 9); }
function fmtDate(d) { if (!d) return ""; const dt = typeof d === "string" ? new Date(d + "T00:00:00") : d; return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()}`; }
function isoDate(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function today() { const n = new Date(); return isoDate(n.getFullYear(), n.getMonth(), n.getDate()); }
function useLS(key, init) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────── */
function buildCSS(fontFamily, fontSize) {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #f8f7f4; --surface: #ffffff; --surface2: #f1f0ec;
      --border: #e8e6e0; --border2: #d4d0c8;
      --text: #1a1814; --text2: #6b6760; --text3: #9b9891;
      --accent: #2d6a4f; --accent2: #40916c; --accentbg: #d8f3dc;
      --danger: #c1121f; --dangerbg: #ffe5e5;
      --warn: #e07c24; --warnbg: #fff3e0;
      --shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
      --shadow2: 0 2px 8px rgba(0,0,0,.08), 0 8px 32px rgba(0,0,0,.08);
      --radius: 12px; --radius2: 8px;
      --font: '${fontFamily}', system-ui, sans-serif;
      --fs: ${fontSize}px;
      --fs-sm: ${fontSize - 1.5}px; --fs-xs: ${fontSize - 2.5}px;
      --fs-lg: ${fontSize + 2}px; --fs-xl: ${fontSize + 6}px;
      --fs-2xl: ${fontSize + 10}px;
      --transition: all .18s cubic-bezier(.4,0,.2,1);
    }
    body { font-family: var(--font); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; font-size: var(--fs); }
    input, select, textarea, button { font-family: var(--font); font-size: var(--fs); }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: calc(var(--fs) * .6) calc(var(--fs) * 1.2); border-radius: var(--radius2); border: none; cursor: pointer; font-size: var(--fs-sm); font-weight: 600; font-family: var(--font); transition: var(--transition); user-select: none; white-space: nowrap; line-height: 1.4; }
    .btn:active { transform: scale(.97); }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { background: var(--accent2); box-shadow: 0 4px 12px rgba(45,106,79,.28); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }
    .btn-ghost { background: transparent; color: var(--text2); border: 1.5px solid var(--border); }
    .btn-ghost:hover { background: var(--surface2); border-color: var(--border2); color: var(--text); }
    .btn-danger { background: var(--dangerbg); color: var(--danger); border: 1.5px solid #ffc5c5; }
    .btn-danger:hover { background: var(--danger); color: #fff; border-color: var(--danger); }
    .btn-sm { padding: calc(var(--fs-sm) * .45) calc(var(--fs-sm) * .9); font-size: var(--fs-xs); }
    .btn-icon { padding: calc(var(--fs) * .45); border-radius: calc(var(--radius2) - 1px); width: calc(var(--fs) * 2.2); height: calc(var(--fs) * 2.2); }

    .input { width: 100%; padding: calc(var(--fs) * .65) calc(var(--fs) * .9); border-radius: var(--radius2); background: var(--surface); border: 1.5px solid var(--border); color: var(--text); font-size: var(--fs); font-family: var(--font); transition: var(--transition); outline: none; }
    .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,106,79,.1); }
    .input::placeholder { color: var(--text3); }

    .card { background: var(--surface); border-radius: var(--radius); border: 1.5px solid var(--border); box-shadow: var(--shadow); }
    .nav-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: calc(var(--fs) * .6) calc(var(--fs) * 1.1); border: none; cursor: pointer; font-size: var(--fs-sm); font-weight: 500; font-family: var(--font); border-radius: var(--radius2); transition: var(--transition); background: transparent; color: var(--text2); text-align: left; }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: var(--accentbg); color: var(--accent); font-weight: 600; }

    .stat-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: calc(var(--fs) * 1.3) calc(var(--fs) * 1.5); cursor: pointer; transition: var(--transition); box-shadow: var(--shadow); }
    .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow2); border-color: var(--border2); }
    .stat-card.active { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,106,79,.1); }

    .post-row { display: flex; align-items: center; gap: 12px; padding: calc(var(--fs) * .75) calc(var(--fs) * 1.1); border-radius: var(--radius2); background: var(--surface); border: 1.5px solid var(--border); transition: var(--transition); cursor: pointer; }
    .post-row:hover { border-color: var(--border2); box-shadow: var(--shadow); transform: translateX(2px); }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.32); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal { background: var(--surface); border-radius: 16px; border: 1.5px solid var(--border); box-shadow: var(--shadow2); width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: slideUp .22s cubic-bezier(.4,0,.2,1); }
    @keyframes slideUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }

    .cal-cell { background: var(--surface); min-height: 96px; padding: 6px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); cursor: pointer; transition: background .12s; }
    .cal-cell:hover { background: var(--surface2); }
    .cal-cell.today { background: #f0faf4; }
    .cal-cell.other-month { background: #fafaf8; }
    .cal-cell.other-month .cal-day-num { color: #c8c5be; }

    .cal-tag { font-size: var(--fs-xs); padding: 2px 5px; border-radius: 5px; margin-bottom: 2px; cursor: pointer; transition: var(--transition); display: flex; align-items: center; gap: 3px; white-space: nowrap; overflow: hidden; }
    .cal-tag:hover { filter: brightness(.93); transform: scale(1.02); }

    .tooltip { position: fixed; z-index: 9999; pointer-events: none; background: #1a1814; color: #fff; border-radius: 10px; padding: 10px 14px; font-size: var(--fs-xs); max-width: 240px; box-shadow: 0 8px 32px rgba(0,0,0,.22); animation: fadeIn .12s ease; }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

    .pill-tabs { display: flex; background: var(--surface2); border-radius: 9px; padding: 3px; gap: 2px; border: 1.5px solid var(--border); }
    .pill-tab { padding: calc(var(--fs-sm) * .45) calc(var(--fs-sm) * 1.1); border-radius: 7px; border: none; cursor: pointer; font-size: var(--fs-sm); font-weight: 500; font-family: var(--font); transition: var(--transition); background: transparent; color: var(--text2); }
    .pill-tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow); font-weight: 600; }
    .pill-tab:hover:not(.active) { color: var(--text); }

    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 99px; font-size: var(--fs-xs); font-weight: 600; border: 1.5px solid transparent; }
    .label { font-size: var(--fs-xs); font-weight: 600; color: var(--text2); margin-bottom: 5px; display: block; letter-spacing: .03em; text-transform: uppercase; }
    .field { display: flex; flex-direction: column; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: calc(var(--fs) * 1.6); flex-wrap: wrap; gap: 12px; }
    .page-title { font-size: var(--fs-xl); font-weight: 700; color: var(--text); }
    .empty-state { text-align: center; padding: calc(var(--fs) * 3) 20px; color: var(--text3); }
    .title-tt { display: none !important; }
    div:hover > div > .title-tt { display: block !important; }
    .vert-title-cell:hover .title-tt { display: block !important; }
    .empty-state svg { margin-bottom: 12px; opacity: .4; }
    .empty-state p { font-size: var(--fs); }

    /* ── RESPONSIVE MOBILE ── */
    @media (max-width: 768px) {
      .sidebar { display: none !important; }
      .mob-nav-bar { display: flex !important; }
      .main-content { padding-bottom: 64px !important; }
      .section-header { flex-direction: column; align-items: flex-start; gap: 10px; }
      .page-title { font-size: var(--fs-lg) !important; }
      .stat-grid { grid-template-columns: 1fr 1fr !important; }
      .clients-grid { grid-template-columns: 1fr !important; }
      .modal { max-width: 100% !important; margin: 0 !important; border-radius: 16px 16px 0 0 !important; max-height: 92vh !important; }
      .modal-overlay { align-items: flex-end !important; padding: 0 !important; }
      .post-row { flex-wrap: wrap; }
      .cal-desktop { display: none !important; }
      .cal-mobile  { display: block !important; }
      .cal-page    { padding: 12px 0 !important; }
    }
    @media (min-width: 769px) {
      .mob-nav-bar  { display: none !important; }
      .sidebar      { display: flex !important; }
      .cal-desktop  { display: block !important; }
      .cal-mobile   { display: none !important; }
    }
    /* Column visibility handled dynamically in JS via useWindowWidth */
  `;
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  // Firestore collections — synced across all devices
  const usersCol   = useCollection("users");
  const clientsCol = useCollection("clients");
  const postsCol   = useCollection("posts");
  const labelsCol  = useCollection("labels");
  const memoryCol  = useCollection("memory");

  // Local-only state (per device)
  const [currentUser, setCurrentUser] = useLS("scm_current", null);
  const [fontId,      setFontId]      = useLS("scm_font",    "outfit");
  const [fontSizeId,  setFontSizeId]  = useLS("scm_fsize",   "md");
  const [section, setSection] = useState("dashboard");

  // Loading state
  const loading = !usersCol.ready || !clientsCol.ready || !postsCol.ready;

  // Derived data
  const users   = usersCol.data   || [];
  const clients = clientsCol.data || [];
  const posts   = postsCol.data   || [];

  // Labels: stored as single doc "config" in labels collection
  const labelsDoc = (labelsCol.data || []).find(d => d.id === "config") || {};
  function lbl(key, fb) { return labelsDoc[key] ?? fb; }
  async function setLbl(key, val) {
    await labelsCol.save({ ...labelsDoc, id: "config", [key]: val });
  }

  // Memory: stored as single doc "config" in memory collection
  const memoryDoc = (memoryCol.data || []).find(d => d.id === "config") || { id:"config", captions:[], hashtags:[], firstComments:[] };
  async function addMemory(type, val) {
    if (!val?.trim()) return;
    const updated = { ...memoryDoc, [type]: [...new Set([val, ...(memoryDoc[type] || [])])].slice(0, 30) };
    await memoryCol.save(updated);
  }

  // Wrapped setters that sync to Firestore
  async function saveUser(u)   { await usersCol.save(u); }
  async function saveUsers(us) { for (const u of us) await usersCol.save(u); }
  async function deleteUser(id){ await usersCol.remove(id); }

  async function saveClient(c)  { await clientsCol.save(c); }
  async function deleteClient(id){ await clientsCol.remove(id); }

  async function savePost(p)   { await postsCol.save(p); }
  async function deletePost(id){ await postsCol.remove(id); }

  const fontObj     = FONT_OPTIONS.find(f => f.id === fontId) || FONT_OPTIONS[0];
  const fontSizeObj = FONT_SIZES.find(f => f.id === fontSizeId) || FONT_SIZES[2];

  useEffect(() => {
    let link = document.getElementById("scm-font-link");
    if (!link) { link = document.createElement("link"); link.id = "scm-font-link"; link.rel = "stylesheet"; document.head.appendChild(link); }
    link.href = `https://fonts.googleapis.com/css2?family=${fontObj.import}&display=swap`;
  }, [fontObj]);

  useEffect(() => {
    let style = document.getElementById("scm-style");
    if (!style) { style = document.createElement("style"); style.id = "scm-style"; document.head.appendChild(style); }
    style.textContent = buildCSS(fontObj.label, fontSizeObj.base);
  }, [fontObj, fontSizeObj]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--bg)", flexDirection:"column", gap:16 }}>
      <div style={{ width:40, height:40, border:"3px solid var(--border)", borderTop:"3px solid var(--accent)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:"var(--fs-sm)", color:"var(--text3)" }}>Caricamento...</div>
    </div>
  );

  const user    = users.find(u => u.id === currentUser);
  const isAdmin = user?.role === "admin";

  if (users.length === 0) return (
    <SetupAdmin onDone={async u => { await saveUser(u); setCurrentUser(u.id); }} />
  );
  if (!user) return <Login users={users} onLogin={id => setCurrentUser(id)} />;

  const nav = [
    { id: "dashboard", icon: "grid",     label: lbl("nav_dashboard", "Dashboard") },
    { id: "calendar",  icon: "calendar", label: lbl("nav_calendar",  "Calendario") },
    { id: "posts",     icon: "pen",      label: lbl("nav_posts",     "Post") },
    { id: "clients",   icon: "users",    label: lbl("nav_clients",   "Clienti") },
    ...(isAdmin ? [{ id: "settings", icon: "settings", label: lbl("nav_settings", "Impostazioni") }] : []),
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <aside className="sidebar" style={{ width:220, flexShrink:0, background:"#fff", borderRight:"1.5px solid var(--border)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
        <div style={{ padding:"20px 18px 15px", borderBottom:"1.5px solid var(--border)" }}>
          <div style={{ fontSize:"var(--fs-lg)", fontWeight:700, color:"var(--text)", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"var(--accentbg)", borderRadius:8, padding:5, display:"flex" }}>
              <Icon name="bell" size={16} color="var(--accent)" />
            </div>
            {lbl("app_name", "SocialCal")}
          </div>
          <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginTop:3, fontWeight:500 }}>Editorial Manager</div>
        </div>
        <nav style={{ flex:1, padding:"10px 8px" }}>
          {nav.map(n => (
            <button key={n.id} className={"nav-item" + (section===n.id ? " active" : "")} onClick={() => setSection(n.id)}>
              <Icon name={n.icon} size={15} color={section===n.id ? "var(--accent)" : "var(--text3)"} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding:"12px 14px", borderTop:"1.5px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--accentbg)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"var(--accent)", fontSize:"var(--fs-sm)", flexShrink:0 }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:"var(--fs-sm)", fontWeight:600, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
              <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>{isAdmin ? "Admin" : user.role}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width:"100%" }} onClick={() => setCurrentUser(null)}>
            <Icon name="logout" size={13} /> Esci
          </button>
        </div>
      </aside>

      <main className="main-content" style={{ flex:1, overflowY:"auto", background:"var(--bg)", position:"relative" }}>
        {section==="dashboard" && <Dashboard posts={posts} clients={clients}
          onDeletePost={deletePost} onSavePost={savePost} lbl={lbl} />}
        {section==="calendar"  && <CalendarView posts={posts} clients={clients}
          onSavePost={savePost} onDeletePost={deletePost} lbl={lbl} memory={memoryDoc} addMemory={addMemory} />}
        {section==="posts"     && <PostsSection posts={posts} clients={clients}
          onSavePost={savePost} onDeletePost={deletePost} lbl={lbl} memory={memoryDoc} addMemory={addMemory} user={user} />}
        {section==="clients"   && <ClientsSection clients={clients}
          onSaveClient={saveClient} onDeleteClient={deleteClient} posts={posts} lbl={lbl} />}
        {section==="settings"  && isAdmin && (
          <Settings users={users} onSaveUser={saveUser} onDeleteUser={deleteUser}
            lbl={lbl} setLbl={setLbl} currentUser={currentUser}
            fontId={fontId} setFontId={setFontId} fontSizeId={fontSizeId} setFontSizeId={setFontSizeId} />
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="mob-nav-bar" style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:200,
        background:"var(--surface)", borderTop:"1.5px solid var(--border)",
        display:"flex", padding:"0 0 env(safe-area-inset-bottom,0)"
      }}>
        {nav.map(n => (
          <button key={n.id} onClick={()=>setSection(n.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              padding:"10px 4px 8px", border:"none", cursor:"pointer", background:"transparent",
              color: section===n.id ? "var(--accent)" : "var(--text3)", transition:"var(--transition)", gap:3 }}>
            <Icon name={n.icon} size={20} color={section===n.id?"var(--accent)":"var(--text3)"}/>
            <span style={{ fontSize:10, fontWeight:section===n.id?600:400, fontFamily:"var(--font)" }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── SETUP ──────────────────────────────────────────────────────────────── */
function SetupAdmin({ onDone }) {
  const [f, setF] = useState({ name:"", email:"", pw:"", pw2:"" });
  const [err, setErr] = useState("");
  function submit() {
    if (!f.name || !f.email || !f.pw) return setErr("Compila tutti i campi");
    if (f.pw !== f.pw2) return setErr("Le password non coincidono");
    if (f.pw.length < 6) return setErr("Minimo 6 caratteri");
    onDone({ id:genId(), name:f.name, email:f.email, password:f.pw, role:"admin", avatar:f.name[0].toUpperCase() });
  }
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, background:"var(--accentbg)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <Icon name="bell" size={26} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize:"var(--fs-2xl)", fontWeight:700, color:"var(--text)" }}>Benvenuto in SocialCal</h1>
          <p style={{ color:"var(--text2)", fontSize:"var(--fs-sm)", marginTop:8 }}>Crea il tuo account amministratore per iniziare</p>
        </div>
        <div className="card" style={{ padding:26 }}>
          <div style={{ background:"var(--accentbg)", borderRadius:8, padding:"9px 13px", marginBottom:18, fontSize:"var(--fs-sm)", color:"var(--accent)", fontWeight:500, display:"flex", gap:7, alignItems:"center" }}>
            <Icon name="lock" size={13} color="var(--accent)" /> Questo sarà l'unico account amministratore
          </div>
          {err && <Alert type="danger">{err}</Alert>}
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <MField label="Nome completo"><input className="input" placeholder="es. Giuseppe Rossi" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/></MField>
            <MField label="Email"><input className="input" type="email" placeholder="tuaemail@esempio.com" value={f.email} onChange={e=>setF(x=>({...x,email:e.target.value}))}/></MField>
            <MField label="Password"><input className="input" type="password" placeholder="Minimo 6 caratteri" value={f.pw} onChange={e=>setF(x=>({...x,pw:e.target.value}))}/></MField>
            <MField label="Conferma Password"><input className="input" type="password" placeholder="Ripeti la password" value={f.pw2} onChange={e=>setF(x=>({...x,pw2:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()}/></MField>
            <button className="btn btn-primary" style={{ width:"100%", marginTop:4 }} onClick={submit}>
              Crea Account e Inizia <Icon name="chevronR" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN ──────────────────────────────────────────────────────────────── */
function Login({ users, onLogin }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  function login() { const u = users.find(u => u.email===email && u.password===pw); if (u) onLogin(u.id); else setErr("Email o password non corretti"); }
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:370 }}>
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <div style={{ width:52, height:52, background:"var(--accentbg)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
            <Icon name="bell" size={24} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize:"var(--fs-xl)", fontWeight:700, color:"var(--text)" }}>SocialCal</h1>
          <p style={{ color:"var(--text2)", fontSize:"var(--fs-sm)", marginTop:5 }}>Accedi per continuare</p>
        </div>
        <div className="card" style={{ padding:24 }}>
          {err && <Alert type="danger" style={{ marginBottom:13 }}>{err}</Alert>}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <MField label="Email"><input className="input" type="email" placeholder="tuaemail@esempio.com" value={email} onChange={e=>setEmail(e.target.value)}/></MField>
            <MField label="Password"><input className="input" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></MField>
            <button className="btn btn-primary" style={{ width:"100%", marginTop:2 }} onClick={login}>Accedi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
function Dashboard({ posts, clients, onDeletePost, onSavePost, lbl }) {
  const now = new Date();
  const mk  = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const thisMonth  = posts.filter(p => p.date?.startsWith(mk));
  const byStatus   = s => posts.filter(p => p.status === s);
  const inProgress = byStatus("Da Editare");
  const upcoming   = posts.filter(p => p.date >= today()).sort((a,b) => a.date.localeCompare(b.date)).slice(0, 10);
  const [filter, setFilter] = useState(null);

  const filtered =
    filter==="thisMonth"  ? thisMonth :
    filter==="clients"    ? posts :
    filter==="scheduled"  ? byStatus("Programmato") :
    filter==="inprogress" ? inProgress :
    filter               ? byStatus(filter) : null;

  const stats = [
    { key:"clients",    icon:"users",    label:"Clienti Attivi",   value:clients.length,                color:"#6366f1" },
    { key:"thisMonth",  icon:"calendar", label:"Post Questo Mese", value:thisMonth.length,               color:"var(--accent)" },
    { key:"scheduled",  icon:"bell",     label:"Da Pubblicare",    value:byStatus("Programmato").length, color:"var(--warn)" },
    { key:"inprogress", icon:"sliders",  label:"Da Editare",       value:inProgress.length,              color:"var(--danger)" },
  ];

  return (
    <div style={{ padding:"clamp(14px,4vw,32px)" }}>
      <div className="section-header">
        <h1 className="page-title">{lbl("dash_title","Dashboard")}</h1>
        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>{DAYS_IT[now.getDay()]}, {fmtDate(today())}</div>
      </div>

      <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:26 }}>
        {stats.map(s => (
          <div key={s.key} className={"stat-card"+(filter===s.key?" active":"")} onClick={()=>setFilter(filter===s.key?null:s.key)}>
            <div style={{ marginBottom:10 }}><Icon name={s.icon} size={20} color={s.color} /></div>
            <div style={{ fontSize:"var(--fs-2xl)", fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:"var(--fs-xs)", color:"var(--text2)", marginTop:5, fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {filtered && (
        <div className="card" style={{ padding:20, marginBottom:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
            <div style={{ fontWeight:600, fontSize:"var(--fs)" }}>
              {filter==="clients"?"Tutti i Post":filter==="thisMonth"?"Post questo mese":filter==="scheduled"?"Programmati":filter==="inprogress"?"Da Editare":`Stato: ${filter}`}
              <span style={{ marginLeft:7, fontSize:"var(--fs-xs)", color:"var(--text3)", fontWeight:400 }}>({filtered.length})</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setFilter(null)}><Icon name="x" size={12}/> Chiudi</button>
          </div>
          {filtered.length===0
            ? <EmptyState icon="fileText" text="Nessun post trovato"/>
            : <div style={{display:"flex",flexDirection:"column",gap:6}}>{filtered.map(p=><PostRowComp key={p.id} post={p} clients={clients} onDeletePost={onDeletePost} onSavePost={onSavePost}/>)}</div>}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:600, fontSize:"var(--fs)", marginBottom:13 }}>Stato Post</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {POST_STATUSES.map(s => {
              const cnt = byStatus(s).length; const sc = STATUS_COLORS[s];
              return (
                <button key={s} onClick={()=>setFilter(filter===s?null:s)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 11px", borderRadius:8, border:"1.5px solid", borderColor:filter===s?sc.bg:"transparent", background:filter===s?sc.light:"var(--surface2)", cursor:"pointer", transition:"var(--transition)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:sc.bg }}/>
                    <span style={{ fontSize:"var(--fs-sm)", fontWeight:500 }}>{s}</span>
                  </div>
                  <span style={{ fontSize:"var(--fs-sm)", fontWeight:700, color:sc.bg }}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:600, fontSize:"var(--fs)", marginBottom:13 }}>Prossimi Post</div>
          {upcoming.length===0
            ? <EmptyState icon="calendar" text="Nessun post in programma"/>
            : <div style={{display:"flex",flexDirection:"column",gap:6}}>{upcoming.map(p=><PostRowComp key={p.id} post={p} clients={clients} onDeletePost={onDeletePost} onSavePost={onSavePost} compact/>)}</div>}
        </div>
      </div>
    </div>
  );
}

function PostRowComp({ post, clients, onDeletePost, onSavePost, compact }) {
  const sc = STATUS_COLORS[post.status] || STATUS_COLORS["Da Editare"];
  const cl = clients?.find(c => c.id === post.clientId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos,  setMenuPos]  = useState({x:0,y:0});

  useEffect(() => {
    if (!menuOpen) return;
    function close() { setMenuOpen(false); }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  function openMenu(e) {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setMenuPos({x:r.left, y:r.bottom+4});
    setMenuOpen(m=>!m);
  }

  async function changeStatus(s) {
    if (onSavePost) await onSavePost({...post, status:s});
    setMenuOpen(false);
  }

  const socTimes = [
    post.igStatus && post.igStatus!=="—" && post.igStatusTime ? `IG ${post.igStatusTime}` : null,
    post.fbStatus && post.fbStatus!=="—" && post.fbStatusTime ? `FB ${post.fbStatusTime}` : null,
    post.ttStatus && post.ttStatus!=="—" && post.ttStatusTime ? `TT ${post.ttStatusTime}` : null,
  ].filter(Boolean);

  return (
    <div className="post-row" style={{position:"relative"}}>
      {cl && <div style={{ width:4, height:32, borderRadius:3, background:cl.color, flexShrink:0 }}/>}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:"var(--fs-sm)", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {post.title||"Post senza titolo"}
        </div>
        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginTop:1 }}>
          {compact
            ? <>{fmtDate(post.date)}{socTimes.length>0&&<span style={{marginLeft:6}}>{socTimes.join(" · ")}</span>}</>
            : <>{post.clientName||"—"} · {fmtDate(post.date)} · {post.platform||"—"}{socTimes.length>0&&<span style={{marginLeft:6}}>{socTimes.join(" · ")}</span>}</>
          }
        </div>
      </div>
      <button
        onClick={onSavePost ? openMenu : undefined}
        className="chip"
        style={{ background:sc.light, color:sc.text, border:`1.5px solid ${sc.bg}44`,
          flexShrink:0, cursor:onSavePost?"pointer":"default", transition:"var(--transition)" }}
        onMouseEnter={e=>onSavePost&&(e.currentTarget.style.background=sc.bg,e.currentTarget.style.color="#fff")}
        onMouseLeave={e=>onSavePost&&(e.currentTarget.style.background=sc.light,e.currentTarget.style.color=sc.text)}>
        {post.status}
        {onSavePost && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{marginLeft:3,opacity:.6}}><polyline points="6 9 12 15 18 9"/></svg>}
      </button>
      {menuOpen && (
        <div style={{position:"fixed",left:menuPos.x,top:menuPos.y,zIndex:9999,
          background:"var(--surface)",border:"1.5px solid var(--border)",
          borderRadius:10,boxShadow:"var(--shadow2)",overflow:"hidden",minWidth:145}}
          onClick={e=>e.stopPropagation()}>
          {POST_STATUSES.map(s=>{
            const ssc=STATUS_COLORS[s]||STATUS_COLORS["Da Editare"];
            const isActive=s===post.status;
            return(
              <div key={s} onClick={()=>changeStatus(s)}
                style={{padding:"7px 12px",display:"flex",alignItems:"center",gap:8,
                  cursor:"pointer",fontSize:"var(--fs-sm)",fontWeight:600,
                  background:isActive?"var(--surface2)":"transparent",transition:"background .1s"}}
                onMouseEnter={e=>!isActive&&(e.currentTarget.style.background="var(--surface2)")}
                onMouseLeave={e=>!isActive&&(e.currentTarget.style.background="transparent")}>
                <div style={{width:8,height:8,borderRadius:"50%",background:ssc.bg,flexShrink:0}}/>
                <span style={{color:ssc.text}}>{s}</span>
                {isActive&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"var(--accent)"}}/>}
              </div>
            );
          })}
        </div>
      )}
      <button className="btn btn-icon btn-danger" style={{ flexShrink:0, opacity:.65 }}
        onClick={e => { e.stopPropagation(); onDeletePost(post.id); }}>
        <Icon name="trash" size={13}/>
      </button>
    </div>
  );
}
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function CalendarView({ posts, clients, onSavePost, onDeletePost, lbl, memory, addMemory }) {
  const winW = useWindowWidth();
  const [view,        setView]        = useState("vertical");
  const [year,        setYear]        = useState(new Date().getFullYear());
  const [month,       setMonth]       = useState(new Date().getMonth());
  const [weekStart,   setWeekStart]   = useState(() => { const d=new Date(); d.setDate(d.getDate()-d.getDay()); return d; });
  const [editPost,    setEditPost]    = useState(null);
  const [newPostData, setNewPostData] = useState(null); // {date, clientId?, clientName?}
  const [tooltip,     setTooltip]     = useState(null);
  const [editingTitle,setEditingTitle]= useState(null);
  const [openMenu,    setOpenMenu]    = useState(null); // {id, field, x, y}
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const el = document.querySelector("[data-today]");
      if (el) el.scrollIntoView({ block: "center" });
    }, 300);
  }, []);

  useEffect(() => {
    function handleClick() { setOpenMenu(null); }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function prev() {
    if (view==="week") { const d=new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d); }
    else { month===0?(setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1); }
  }
  function next() {
    if (view==="week") { const d=new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d); }
    else { month===11?(setMonth(0),setYear(y=>y+1)):setMonth(m=>m+1); }
  }
  function scrollToToday() {
    setTimeout(()=>{
      const el = document.querySelector("[data-today]");
      if (el) el.scrollIntoView({behavior:"smooth", block:"center"});
    }, 100);
  }

  function goToday() {
    const n=new Date(); setYear(n.getFullYear()); setMonth(n.getMonth());
    scrollToToday();
  }

  function postsFor(ds) { return posts.filter(p=>p.date===ds); }
  function slotsFor(ds) {
    const d=new Date(ds+"T00:00:00"), dow=d.getDay();
    return clients.filter(c=>c.scheduleDays?.includes(dow)&&!posts.find(p=>p.date===ds&&p.clientId===c.id));
  }

  async function changeStatus(post, newStatus) { await onSavePost({...post, status:newStatus}); }
  async function changeSocial(post, field, val) { await onSavePost({...post, [field]:val}); }
  async function saveTitle(post, title) { await onSavePost({...post, title}); setEditingTitle(null); }

  function clientBorderColor(post) {
    const active=[post.igStatus,post.fbStatus,post.ttStatus].filter(s=>s&&s!=="—");
    if (active.length>0 && active.every(s=>s==="Pubblicato")) return STATUS_COLORS["Pubblicato"].bg;
    if (active.some(s=>s==="Programmato")) return STATUS_COLORS["Programmato"].bg;
    if (post.status==="Da Editare") return STATUS_COLORS["Da Editare"].bg;
    return STATUS_COLORS["Pronto"].bg;
  }


  // ── Dropdown pill ────────────────────────────────────────────────────────
  function PillDropdown({ postId, field, value, options, colorMap, small }) {
    const sc = colorMap[value] || null;
    const menuId = `${postId}_${field}`;
    const isOpen = openMenu?.id === menuId;
    const isTimeOpen = openMenu?.id === `${postId}_${field}_time`;
    const post = posts.find(p=>p.id===postId);
    const timeField = field + "Time";
    const timeVal = post?.[timeField] || "";
    const isSocial = ["igStatus","fbStatus","ttStatus"].includes(field);
    const showTime = isSocial && (value==="Programmato" || value==="Pubblicato");
    const isPublished = value==="Pubblicato";
    const [timePick, setTimePick] = useState({ h:"09", m:"00" });
    const HOURS = Array.from({length:24},(_,i)=>String(i).padStart(2,"0"));
    const MINS  = ["00","15","30","45"];

    function openIt(e) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      setOpenMenu(isOpen ? null : { id:menuId, x:rect.left, y:rect.bottom+4, width:rect.width });
    }

    function openTime(e) {
      e.stopPropagation();
      if (isPublished) return;
      if (timeVal) { const [h,m]=timeVal.split(":"); setTimePick({h,m}); }
      const rect = e.currentTarget.getBoundingClientRect();
      setOpenMenu(isTimeOpen ? null : { id:`${postId}_${field}_time`, x:rect.left, y:rect.bottom+4, width:Math.max(rect.width,170) });
    }

    async function confirmTime(e) {
      e.stopPropagation();
      if (post) await changeSocial(post, timeField, `${timePick.h}:${timePick.m}`);
      setOpenMenu(null);
    }

    return (
      <div style={{display:"flex",flexDirection:"column",gap:3,width:"100%",position:"relative"}}>
        {/* Status pill */}
        <div onClick={openIt}
          style={{ display:"flex", alignItems:"center", whiteSpace:"nowrap",
            padding:small?"3px 8px":"4px 10px", borderRadius:small?6:7,
            fontSize:small?"var(--fs-xs)":"var(--fs-sm)", fontWeight:600, cursor:"pointer",
            border:`1.5px solid ${sc?sc.bg+"55":"var(--border2)"}`,
            background:sc?sc.light:"transparent", color:sc?sc.text:"var(--text3)",
            transition:"var(--transition)", userSelect:"none", width:"100%", gap:5 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{opacity:.4,flexShrink:0}}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          <span style={{flex:1}}>{value}</span>
        </div>

        {/* Time row */}
        {showTime && (
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <div onClick={openTime}
              style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 7px",
                borderRadius:6, background:"var(--surface2)", border:"1.5px solid var(--border)",
                cursor:isPublished?"default":"pointer", opacity:isPublished?.65:1,
                transition:"var(--transition)", flex:1 }}
              onMouseEnter={e=>!isPublished&&(e.currentTarget.style.borderColor="var(--accent)")}
              onMouseLeave={e=>!isPublished&&(e.currentTarget.style.borderColor="var(--border)")}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:.4,flexShrink:0}}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontSize:"var(--fs-xs)", fontWeight:timeVal?600:400, flex:1,
                color:timeVal?"var(--text)":"var(--text3)" }}>
                {timeVal || (isPublished?"—":"+ imposta orario")}
              </span>
              {!isPublished && timeVal && (
                <span style={{fontSize:9,color:"var(--text3)"}}>✎</span>
              )}
            </div>
            {!isPublished && timeVal && (
              <div onClick={async e=>{e.stopPropagation();if(post)await changeSocial(post,timeField,"");}}
                style={{width:18,height:18,borderRadius:5,display:"flex",alignItems:"center",
                  justifyContent:"center",cursor:"pointer",flexShrink:0,
                  color:"var(--text3)",transition:"var(--transition)"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--dangerbg)";e.currentTarget.style.color="var(--danger)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text3)";}}>
                <Icon name="x" size={10}/>
              </div>
            )}
          </div>
        )}

        {/* Status dropdown */}
        {isOpen && (
          <div style={{ position:"fixed", left:openMenu.x, top:openMenu.y, zIndex:9999,
            background:"var(--surface)", border:"1.5px solid var(--border)",
            borderRadius:10, boxShadow:"var(--shadow2)", overflow:"hidden",
            minWidth:Math.max(openMenu.width,130), animation:"fadeIn .1s ease" }}
            onClick={e=>e.stopPropagation()}>
            {options.map(opt => {
              const osc = colorMap[opt];
              const isActive = opt === value;
              return (
                <div key={opt}
                  onClick={e=>{e.stopPropagation(); setOpenMenu(null);
                    if (field==="status") changeStatus(post, opt);
                    else changeSocial(post, field, opt);
                  }}
                  style={{ padding:"8px 12px", display:"flex", alignItems:"center", gap:8,
                    cursor:"pointer", fontSize:"var(--fs-sm)", fontWeight:600,
                    background:isActive?"var(--surface2)":"transparent", transition:"background .1s" }}
                  onMouseEnter={e=>!isActive&&(e.currentTarget.style.background="var(--surface2)")}
                  onMouseLeave={e=>!isActive&&(e.currentTarget.style.background="transparent")}>
                  {osc
                    ? <><div style={{width:8,height:8,borderRadius:"50%",background:osc.bg,flexShrink:0}}/><span style={{color:osc.text}}>{opt}</span></>
                    : <span style={{color:"var(--text3)"}}>{opt}</span>
                  }
                  {isActive && <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"var(--accent)"}}/>}
                </div>
              );
            })}
          </div>
        )}

        {/* Time picker popup */}
        {isTimeOpen && (
          <div style={{ position:"fixed", left:openMenu.x, top:openMenu.y, zIndex:9999,
            background:"var(--surface)", border:"1.5px solid var(--border)",
            borderRadius:12, boxShadow:"var(--shadow2)", padding:14, minWidth:180,
            animation:"fadeIn .1s ease" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:"var(--fs-xs)",color:"var(--text3)",fontWeight:600,
              letterSpacing:".04em",textTransform:"uppercase",marginBottom:10}}>
              Orario programmazione
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <select value={timePick.h} onChange={e=>setTimePick(t=>({...t,h:e.target.value}))}
                style={{flex:1,padding:"6px 6px",borderRadius:7,fontSize:"var(--fs-sm)",
                  border:"1.5px solid var(--border)",background:"var(--surface2)",
                  color:"var(--text)",fontFamily:"var(--font)"}}>
                {HOURS.map(h=><option key={h}>{h}</option>)}
              </select>
              <span style={{fontSize:18,fontWeight:600,color:"var(--text2)"}}>:</span>
              <select value={timePick.m} onChange={e=>setTimePick(t=>({...t,m:e.target.value}))}
                style={{flex:1,padding:"6px 6px",borderRadius:7,fontSize:"var(--fs-sm)",
                  border:"1.5px solid var(--border)",background:"var(--surface2)",
                  color:"var(--text)",fontFamily:"var(--font)"}}>
                {MINS.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <button onClick={confirmTime}
              style={{width:"100%",padding:"8px",borderRadius:8,background:"var(--accent)",
                color:"#fff",border:"none",cursor:"pointer",fontSize:"var(--fs-sm)",
                fontWeight:600,fontFamily:"var(--font)"}}>
              Conferma
            </button>
          </div>
        )}
      </div>
    );
  }
  const STATO_COLORS = { "Da Editare":STATUS_COLORS["Da Editare"], "Pronto":STATUS_COLORS["Pronto"] };
  const SOCIAL_COLORS = { "—":null, "Programmato":STATUS_COLORS["Programmato"], "Pubblicato":STATUS_COLORS["Pubblicato"] };
  // Dynamic grid columns based on window width
  const showSocial = winW >= 1100;
  const showTitle  = winW >= 900;
  const COLS = showSocial
    ? "50px 110px 1fr 108px 150px 150px 150px"
    : showTitle
      ? "50px 110px 1fr 108px"
      : "50px 110px 108px";

  // ── vertical row ─────────────────────────────────────────────────────────
  function VertRow({ dateStr, showTitle=true, showSocial=true }) {
    const dayPosts=postsFor(dateStr), slots=slotsFor(dateStr);
    const isToday=dateStr===today();
    const d=new Date(dateStr+"T00:00:00"), dow=DAYS_IT[d.getDay()], dayNum=d.getDate();
    const isWeekend=d.getDay()===0||d.getDay()===6;
    const rowBg=isToday?"#f0fdf4":isWeekend?"#fafaf9":"var(--surface)";
    const dayCellBg=isToday?"#edf7f2":isWeekend?"#f5f4f2":"var(--surface2)";

    const DayCell = ({ transparent }) => (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:1, padding:"4px 2px", borderRight:"1px solid var(--border)", width:50, flexShrink:0,
        background: transparent ? dayCellBg : dayCellBg, opacity: transparent ? 0 : 1 }}>
        <div style={{fontSize:"var(--fs-xs)",fontWeight:600,color:isToday?"var(--accent)":"var(--text3)",letterSpacing:".04em"}}>{dow}</div>
        {isToday
          ? <div style={{width:24,height:24,background:"var(--accent)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"var(--fs-xs)",fontWeight:700}}>{dayNum}</div>
          : <div style={{fontSize:"var(--fs-lg)",fontWeight:isWeekend?400:500,color:isWeekend?"var(--text3)":"var(--text)",lineHeight:1.2}}>{dayNum}</div>}
      </div>
    );

    // Empty day — no posts, no slots
    if (dayPosts.length===0 && slots.length===0) return (
      <div data-today={isToday||undefined}
        style={{display:"grid",gridTemplateColumns:COLS,borderBottom:"1px solid var(--border)",minHeight:32,background:rowBg,cursor:"pointer",alignItems:"stretch"}}
        onClick={()=>setNewPostData({date:dateStr})}>
        <DayCell/>
        <div style={{gridColumn:"2/-1",display:"flex",alignItems:"center",padding:"0 10px",opacity:.3,fontSize:"var(--fs-xs)",color:"var(--text3)"}}>—</div>
      </div>
    );

    return (
      <>
        {/* Slot rows — no post yet */}
        {slots.map((c,i) => (
          <div key={`slot_${c.id}`} data-today={isToday&&dayPosts.length===0&&i===0||undefined}
            style={{display:"grid",gridTemplateColumns:COLS,borderBottom:"0.5px solid var(--border)",minHeight:38,background:rowBg,cursor:"pointer",alignItems:"stretch"}}
            onClick={()=>setNewPostData({date:dateStr,clientId:c.id,clientName:c.name})}>
            {i===0 && dayPosts.length===0 ? <DayCell/> : <div style={{width:50,borderRight:"1px solid var(--border)",background:dayCellBg}}/>}
            {/* Slot tratteggiato — span colonne cliente+titolo */}
            <div style={{gridColumn:"2/4",borderRight:"1px solid var(--border)",padding:0,display:"flex",alignItems:"stretch"}}>
              <div style={{flex:1,borderLeft:`2px dashed ${c.color}`,background:c.color+"08",
                display:"flex",alignItems:"center",padding:"0 10px",gap:8}}>
                <span style={{fontSize:"var(--fs-xs)",fontWeight:600,color:c.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</span>
                <span style={{fontSize:"var(--fs-xs)",color:c.color+"88",fontWeight:400,flexShrink:0}}>+ aggiungi post</span>
              </div>
            </div>
            <div style={{display:"contents"}}>{["","",""].map((_,j)=><div key={j} style={{borderRight:j<2?"1px solid var(--border)":"none",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:"var(--fs-xs)",color:"var(--text3)",opacity:.4}}>—</span></div>)}</div>
          </div>
        ))}

        {/* Post rows */}
        {dayPosts.map((p,i) => {
          const cl=clients.find(c=>c.id===p.clientId);
          const clientColor=cl?.color||"#94a3b8";
          const bColor=clientBorderColor(p);
          return (
            <div key={p.id} data-today={isToday&&slots.length===0&&i===0||undefined}
              style={{display:"grid",gridTemplateColumns:COLS,
                borderBottom:i===dayPosts.length-1?"1px solid var(--border)":"0.5px solid var(--border)",
                minHeight:44,background:rowBg,alignItems:"stretch"}}>

              {slots.length===0&&i===0 ? <DayCell/> : <div style={{width:50,flexShrink:0,borderRight:"1px solid var(--border)",background:dayCellBg, opacity:i===0?1:0}}><DayCell transparent={i>0}/></div>}

              {/* Cliente — bordo sinistro colore stato, nome colore cliente */}
              <div style={{borderRight:"1px solid var(--border)",padding:0,cursor:"pointer",overflow:"hidden"}}
                onClick={e=>{e.stopPropagation();}}>
                <div style={{height:"100%",padding:"0 10px",display:"flex",alignItems:"center",overflow:"hidden",
                  borderLeft:`3px solid ${bColor}`}}>
                  <span style={{fontSize:"var(--fs-xs)",fontWeight:600,color:clientColor,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {p.clientName||"—"}
                  </span>
                </div>
              </div>

              {/* Titolo — visible only when showTitle */}
              {showTitle && (
              <div style={{borderRight:"1px solid var(--border)",padding:"0 10px",display:"flex",alignItems:"center",cursor:"pointer",position:"relative",overflow:"visible"}}
                onClick={e=>{e.stopPropagation();setEditPost(p);}}>
                {editingTitle===p.id
                  ? <input autoFocus defaultValue={p.title}
                      style={{flex:1,border:"none",outline:"none",background:"transparent",fontSize:"var(--fs-sm)",color:"var(--text)",fontFamily:"var(--font)"}}
                      onBlur={e=>saveTitle(p,e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")saveTitle(p,e.target.value);if(e.key==="Escape")setEditingTitle(null);}}
                      onClick={e=>e.stopPropagation()}/>
                  : <div style={{position:"relative",flex:1,overflow:"hidden",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:"var(--fs-sm)",color:isToday?"var(--accent)":"var(--text)",
                        fontWeight:isToday?500:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1}}>
                        {p.title||"Post senza titolo"}
                      </span>
                      {isToday&&<span style={{fontSize:"var(--fs-xs)",fontWeight:700,color:"var(--accent)",background:"var(--accentbg)",padding:"1px 6px",borderRadius:99,flexShrink:0}}>OGGI</span>}
                    </div>
                }
              </div>
              )}

              {/* Stato principale */}
              <div style={{borderRight:"1px solid var(--border)",padding:"0 7px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible"}}>
                <PillDropdown postId={p.id} field="status" value={p.status||"Da Editare"}
                  options={["Da Editare","Pronto"]} colorMap={STATO_COLORS}/>
              </div>

              {/* Instagram */}
              {showSocial && <div style={{borderRight:"1px solid var(--border)",padding:"5px 7px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible",minHeight:44}}>
                <PillDropdown postId={p.id} field="igStatus" value={p.igStatus||"—"}
                  options={["—","Programmato","Pubblicato"]} colorMap={SOCIAL_COLORS} small/>
              </div>}

              {/* Facebook */}
              {showSocial && <div style={{borderRight:"1px solid var(--border)",padding:"5px 7px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible",minHeight:44}}>
                <PillDropdown postId={p.id} field="fbStatus" value={p.fbStatus||"—"}
                  options={["—","Programmato","Pubblicato"]} colorMap={SOCIAL_COLORS} small/>
              </div>}

              {/* TikTok */}
              {showSocial && <div style={{padding:"0 7px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible"}}>
                <PillDropdown postId={p.id} field="ttStatus" value={p.ttStatus||"—"}
                  options={["—","Programmato","Pubblicato"]} colorMap={SOCIAL_COLORS} small/>
              </div>}
            </div>
          );
        })}
      </>
    );
  }

  // ── month cells ───────────────────────────────────────────────────────────
  function buildMonthCells() {
    const firstDow=new Date(year,month,1).getDay(),daysThis=new Date(year,month+1,0).getDate(),daysPrev=new Date(year,month,0).getDate();
    const cells=[];
    for(let i=firstDow-1;i>=0;i--){const d=daysPrev-i,pm=month===0?11:month-1,py=month===0?year-1:year;cells.push({day:d,dateStr:isoDate(py,pm,d),otherMonth:true});}
    for(let d=1;d<=daysThis;d++)cells.push({day:d,dateStr:isoDate(year,month,d),otherMonth:false});
    const rem=42-cells.length;
    for(let d=1;d<=rem;d++){const nm=month===11?0:month+1,ny=month===11?year+1:year;cells.push({day:d,dateStr:isoDate(ny,nm,d),otherMonth:true});}
    return cells;
  }

  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d;});

  function CalTag({p,onClick}) {
    const sc=STATUS_COLORS[p.status]||STATUS_COLORS["Da Editare"];
    const cl=clients.find(c=>c.id===p.clientId);
    const bColor=clientBorderColor(p);
    return (
      <div className="cal-tag"
        style={{background:(cl?.color||"#94a3b8")+"22",borderLeft:`3px solid ${bColor}`,color:cl?.color||"var(--text)"}}
        onClick={e=>{e.stopPropagation();onClick();}}
        onMouseEnter={e=>setTooltip({post:p,x:e.clientX,y:e.clientY})}
        onMouseLeave={()=>setTooltip(null)}>
        <span style={{overflow:"hidden",textOverflow:"ellipsis",flex:1,fontWeight:600}}>{p.title||p.clientName||"Post"}</span>
      </div>
    );
  }

  const vertDays=(()=>{const days=[],s=new Date();s.setDate(s.getDate()-14);for(let i=0;i<90;i++){const d=new Date(s);d.setDate(s.getDate()+i);days.push(isoDate(d.getFullYear(),d.getMonth(),d.getDate()));}return days;})();
  const periodLabel=view==="week"?`${fmtDate(weekDays[0])} – ${fmtDate(weekDays[6])}`:`${MONTHS_IT[month]} ${year}`;

  return (
    <div className="cal-page" style={{padding:"28px 32px"}}>
      <div className="section-header">
        <h1 className="page-title">{lbl("cal_title","Calendario Editoriale")}</h1>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div className="pill-tabs">
            <button className={"pill-tab"+(view==="vertical"?" active":"")} onClick={()=>setView("vertical")}>Verticale</button>
            <button className={"pill-tab"+(view==="week"?" active":"")} onClick={()=>setView("week")}>Settimana</button>
          </div>
          {view==="week"&&<>
            <button className="btn btn-ghost btn-sm" onClick={prev}><Icon name="chevronL" size={14}/></button>
            <span style={{fontSize:"var(--fs-sm)",fontWeight:600,minWidth:200,textAlign:"center"}}>{periodLabel}</span>
            <button className="btn btn-ghost btn-sm" onClick={next}><Icon name="chevronR" size={14}/></button>
          </>}
          <button className="btn btn-ghost btn-sm" onClick={goToday} style={{display:"flex",alignItems:"center",gap:5}}>
            <Icon name="calendar" size={13}/> Oggi
          </button>
          <button className="btn btn-primary btn-sm" onClick={()=>setNewPostData({date:today()})} style={{display:"flex",alignItems:"center",gap:5}}>
            <Icon name="plus" size={13}/> Nuovo Post
          </button>
        </div>
      </div>

      {/* DESKTOP VIEWS */}
      <div className="cal-desktop">
      {/* VERTICAL */}
      {view==="vertical" && (
        <div className="card" style={{overflow:"visible",padding:0}}>
          <div id="cal-vert-header" style={{display:"grid",gridTemplateColumns:COLS,background:"var(--surface2)",borderBottom:"1.5px solid var(--border)",borderRadius:"var(--radius) var(--radius) 0 0",overflow:"hidden"}}>
            {[
              {label:"Giorno",  center:true,  color:null,      icon:null,          show:true},
              {label:"Cliente", center:false, color:null,      icon:null,          show:true},
              {label:"Titolo",  center:false, color:null,      icon:null,          show:showTitle},
              {label:"Stato",   center:true,  color:null,      icon:null,          show:true},
              {label:"Instagram",center:true, color:"#9c27b0", icon:"instagram",   show:showSocial},
              {label:"Facebook", center:true, color:"#1976d2", icon:"facebook",    show:showSocial},
              {label:"TikTok",   center:true, color:"#e91e63", icon:"tiktok",      show:showSocial},
            ].filter(h=>h.show).map((h,i,arr)=>(
              <div key={i} style={{padding:"8px 8px",fontSize:"var(--fs-xs)",fontWeight:600,
                color:h.color||"var(--text3)",letterSpacing:".04em",textTransform:"uppercase",
                borderRight:i<arr.length-1?"1px solid var(--border)":"none",
                display:"flex",alignItems:"center",
                justifyContent:h.center?"center":"flex-start",paddingLeft:h.center?8:10,
                gap:4,whiteSpace:"nowrap"}}>
                {h.icon&&<Icon name={h.icon} size={13} color={h.color}/>}
                {h.label}
              </div>
            ))}
          </div>
          <div id="cal-scroll-body" ref={scrollRef} style={{maxHeight:"calc(100vh - 260px)",overflowY:"auto"}}>
            {vertDays.map((ds,i)=>{
              const d=new Date(ds+"T00:00:00"), showSep=d.getDate()===1||i===0;
              return (
                <div key={ds}>
                  {showSep&&(
                    <div style={{padding:"5px 12px",fontSize:"var(--fs-xs)",fontWeight:700,
                      color:"var(--text3)",letterSpacing:".06em",textTransform:"uppercase",
                      background:"var(--surface2)",borderBottom:"1px solid var(--border)"}}>
                      {MONTHS_IT[d.getMonth()]} {d.getFullYear()}
                    </div>
                  )}
                  <VertRow dateStr={ds} showTitle={showTitle} showSocial={showSocial}/>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK */}
      {view==="week" && (
        <div className="card" style={{overflow:"hidden",padding:0}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"var(--surface2)",borderBottom:"1.5px solid var(--border)"}}>
            {weekDays.map((d,i)=>{const ds=isoDate(d.getFullYear(),d.getMonth(),d.getDate()),isToday=ds===today();return(
              <div key={i} style={{padding:"10px 8px",textAlign:"center",background:isToday?"#f0fdf422":"transparent"}}>
                <div style={{fontSize:11,color:"var(--text3)",fontWeight:600}}>{DAYS_IT[d.getDay()]}</div>
                <div style={{fontSize:16,fontWeight:isToday?700:500,color:isToday?"var(--accent)":"var(--text)"}}>{d.getDate()}</div>
              </div>
            );})}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {weekDays.map((d,i)=>{
              const ds=isoDate(d.getFullYear(),d.getMonth(),d.getDate()),isToday=ds===today();
              return(
                <div key={i} className={"cal-cell"+(isToday?" today":"")} style={{minHeight:200}} onClick={()=>setNewPostData({date:ds})}>
                  {slotsFor(ds).map(c=>(
                    <div key={c.id} className="cal-tag"
                      style={{background:c.color+"15",border:`1px dashed ${c.color}99`,color:c.color}}
                      onClick={e=>{e.stopPropagation();setNewPostData({date:ds});}}>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",flex:1,fontWeight:500}}>{c.name}</span>
                    </div>
                  ))}
                  {postsFor(ds).map(p=><CalTag key={p.id} p={p} onClick={()=>setEditPost(p)}/>)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      </div>{/* end cal-desktop */}

      {/* Tooltip */}
      {tooltip&&(
        <div className="tooltip" style={{left:tooltip.x+14,top:tooltip.y+14}}>
          <div style={{fontWeight:600,marginBottom:3}}>{tooltip.post.title||"Post senza titolo"}</div>
          <div style={{opacity:.75,fontSize:"var(--fs-xs)"}}>{tooltip.post.clientName} · {tooltip.post.platform}</div>
          <div style={{opacity:.75,fontSize:"var(--fs-xs)"}}>{fmtDate(tooltip.post.date)}</div>
          <div style={{marginTop:6}}><span style={{background:STATUS_COLORS[tooltip.post.status]?.bg,color:"#fff",padding:"2px 8px",borderRadius:99,fontSize:"var(--fs-xs)",fontWeight:600}}>{tooltip.post.status}</span></div>
        </div>
      )}

      {(editPost||newPostData)&&(
        <PostModal post={editPost} defaultDate={newPostData?.date} defaultClientId={newPostData?.clientId} defaultClientName={newPostData?.clientName} clients={clients} memory={memory} addMemory={addMemory}
          onSave={async p=>{if(!p.id)p={...p,id:genId()};await onSavePost(p);setEditPost(null);setNewPostData(null);}}
          onDelete={async id=>{await onDeletePost(id);setEditPost(null);}}
          onClose={()=>{setEditPost(null);setNewPostData(null);}}/>
      )}

      {/* ── MOBILE CALENDAR ── */}
      <div className="cal-mobile" style={{display:"none"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px 8px",borderBottom:"1.5px solid var(--border)",background:"var(--surface)"}}>
          <span style={{fontSize:"var(--fs)",fontWeight:700,color:"var(--text)"}}>Calendario</span>
          <div style={{display:"flex",gap:7}}>
            <button className="btn btn-ghost btn-sm" onClick={goToday} style={{display:"flex",alignItems:"center",gap:4}}><Icon name="calendar" size={12}/> Oggi</button>
            <button className="btn btn-primary btn-sm" onClick={()=>setNewPostData({date:today()})} style={{display:"flex",alignItems:"center",gap:4}}><Icon name="plus" size={12}/></button>
          </div>
        </div>
        <MobileCalendar posts={posts} clients={clients} vertDays={vertDays}
          postsFor={postsFor} slotsFor={slotsFor} clientBorderColor={clientBorderColor}
          onSlotClick={ds=>setNewPostData({date:ds})}
          onClientSlotClick={(ds,c)=>setNewPostData({date:ds,clientId:c.id,clientName:c.name})}
          onPostClick={p=>setEditPost(p)}
          scrollRef={scrollRef}/>
      </div>
    </div>
  );
}

/* ─── MOBILE CALENDAR ────────────────────────────────────────────────────── */
function MobileCalendar({ posts, clients, vertDays, postsFor, slotsFor, clientBorderColor, onSlotClick, onClientSlotClick, onPostClick, scrollRef }) {
  const [expanded, setExpanded] = useState({});

  const PMAP = {
    "Instagram": {bg:"#f3e5ff", stroke:"#9c27b0"},
    "Facebook":  {bg:"#e3f2fd", stroke:"#1976d2"},
    "TikTok":    {bg:"#fce4ec", stroke:"#e91e63"},
  };

  function PlatIcon({name}) {
    const p = PMAP[name]; if(!p) return null;
    const paths = {
      "Instagram": <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></>,
      "Facebook":  <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
      "TikTok":    <><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></>,
    };
    return (
      <div style={{width:14,height:14,borderRadius:3,background:p.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={p.stroke} strokeWidth="2.5">{paths[name]}</svg>
      </div>
    );
  }

  function PostCard({p, isToday}) {
    const sc = STATUS_COLORS[p.status] || STATUS_COLORS["Da Editare"];
    const cl = clients.find(c=>c.id===p.clientId);
    const bColor = clientBorderColor(p);
    const plats = p.platform==="Tutte"?["Instagram","Facebook","TikTok"]:p.platform?[p.platform]:[];
    const socialState = [
      {key:"igStatus",plat:"Instagram"},
      {key:"fbStatus",plat:"Facebook"},
      {key:"ttStatus",plat:"TikTok"},
    ].filter(x=>p[x.key]&&p[x.key]!=="—");
    const activeSocial = socialState[0];

    return (
      <div onClick={()=>onPostClick(p)}
        style={{padding:"6px 8px",display:"flex",flexDirection:"column",gap:3,cursor:"pointer",
          borderBottom:"0.5px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:3,height:28,borderRadius:2,background:bColor,flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:"var(--fs-xs)",fontWeight:700,color:cl?.color||"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {p.clientName||"—"}
              </span>
              {isToday&&<span style={{fontSize:8,fontWeight:700,color:"var(--accent)",background:"var(--accentbg)",padding:"1px 4px",borderRadius:99,flexShrink:0}}>OGGI</span>}
            </div>
            <div style={{fontSize:"var(--fs-sm)",color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
              {p.title||"Post senza titolo"}
            </div>
          </div>
          <span style={{fontSize:9,fontWeight:600,background:sc.light,color:sc.text,padding:"2px 6px",borderRadius:99,flexShrink:0,border:`1px solid ${sc.bg}44`}}>
            {p.status}
          </span>
        </div>
        {(plats.length>0||activeSocial)&&(
          <div style={{display:"flex",alignItems:"center",gap:4,paddingLeft:8}}>
            <div style={{display:"flex",gap:3}}>
              {plats.map(pl=><PlatIcon key={pl} name={pl}/>)}
            </div>
            {activeSocial&&(
              <span style={{fontSize:9,color:STATUS_COLORS[activeSocial?p[activeSocial.key]:"—"]?.bg||"var(--text3)",fontWeight:600}}>
                {p[activeSocial.key]}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={scrollRef} style={{overflowY:"auto",maxHeight:"calc(100vh - 120px)"}}>
      {vertDays.map((ds,i)=>{
        const d=new Date(ds+"T00:00:00");
        const isToday=ds===today();
        const dayPosts=postsFor(ds);
        const slots=slotsFor(ds);
        const dow=DAYS_IT[d.getDay()];
        const dayNum=d.getDate();
        const isWeekend=d.getDay()===0||d.getDay()===6;
        const showSep=d.getDate()===1||i===0;
        const isExpanded=expanded[ds];
        const extraCount=dayPosts.length-1;

        const DayCell=(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            gap:1,padding:"4px 2px",borderRight:"1px solid var(--border)",width:44,flexShrink:0,
            background:isToday?"#edf7f2":isWeekend?"#f5f4f2":"var(--surface2)"}}>
            <div style={{fontSize:8,fontWeight:600,color:isToday?"var(--accent)":"var(--text3)",letterSpacing:".04em"}}>{dow}</div>
            {isToday
              ? <div style={{width:22,height:22,background:"var(--accent)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700}}>{dayNum}</div>
              : <div style={{fontSize:13,fontWeight:isWeekend?400:500,color:isWeekend?"var(--text3)":"var(--text)",lineHeight:1.2}}>{dayNum}</div>}
          </div>
        );

        return (
          <div key={ds} data-today={isToday||undefined}>
            {showSep&&(
              <div style={{display:"flex",background:"var(--surface2)",borderBottom:"1px solid var(--border)"}}>
                <div style={{width:44,borderRight:"1px solid var(--border)",flexShrink:0}}/>
                <div style={{padding:"4px 10px",fontSize:9,fontWeight:700,color:"var(--text3)",letterSpacing:".06em",textTransform:"uppercase"}}>
                  {MONTHS_IT[d.getMonth()]} {d.getFullYear()}
                </div>
              </div>
            )}

            {/* Empty day */}
            {dayPosts.length===0&&slots.length===0&&(
              <div style={{display:"flex",borderBottom:"1px solid var(--border)",minHeight:32,
                background:isToday?"#f0fdf4":isWeekend?"#fafaf9":"var(--surface)",
                cursor:"pointer",alignItems:"stretch"}}
                onClick={()=>onSlotClick(ds)}>
                {DayCell}
                <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 10px",opacity:.3,fontSize:"var(--fs-xs)",color:"var(--text3)"}}>—</div>
              </div>
            )}

            {/* Slots */}
            {slots.map((c,si)=>(
              <div key={c.id} style={{display:"flex",borderBottom:"0.5px solid var(--border)",minHeight:38,
                background:isToday?"#f0fdf4":isWeekend?"#fafaf9":"var(--surface)",
                cursor:"pointer",alignItems:"stretch"}}
                onClick={()=>onClientSlotClick(ds,c)}>
                {si===0&&dayPosts.length===0?DayCell:<div style={{width:44,flexShrink:0,borderRight:"1px solid var(--border)",background:isToday?"#edf7f2":isWeekend?"#f5f4f2":"var(--surface2)"}}/>}
                <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 8px"}}>
                  <div style={{borderLeft:`2px dashed ${c.color}`,background:c.color+"08",flex:1,
                    display:"flex",alignItems:"center",gap:7,padding:"6px 8px",borderRadius:"0 4px 4px 0"}}>
                    <span style={{fontSize:10,fontWeight:700,color:c.color}}>{c.name}</span>
                    <span style={{fontSize:9,color:c.color+"88"}}>+ aggiungi post</span>
                  </div>
                </div>
              </div>
            ))}

            {/* First post */}
            {dayPosts.length>0&&(
              <div style={{display:"flex",borderBottom:dayPosts.length>1&&!isExpanded?"1px solid var(--border)":"none",
                background:isToday?"#f0fdf4":isWeekend?"#fafaf9":"var(--surface)",alignItems:"stretch"}}>
                {DayCell}
                <div style={{flex:1,minWidth:0}}>
                  <PostCard p={dayPosts[0]} isToday={isToday}/>
                  {/* "+N more" button */}
                  {dayPosts.length>1&&!isExpanded&&(
                    <div onClick={e=>{e.stopPropagation();setExpanded(x=>({...x,[ds]:true}));}}
                      style={{padding:"4px 8px 5px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",borderBottom:"1px solid var(--border)"}}>
                      <span style={{fontSize:9,background:"var(--surface2)",color:"var(--text2)",padding:"1px 7px",borderRadius:99,border:"0.5px solid var(--border2)",fontWeight:600}}>
                        +{extraCount} {extraCount===1?"altro post":"altri post"}
                      </span>
                      <span style={{fontSize:9,color:"var(--text3)"}}>— tocca per vedere</span>
                    </div>
                  )}
                  {/* Extra posts when expanded */}
                  {isExpanded&&dayPosts.slice(1).map(p=><PostCard key={p.id} p={p} isToday={isToday}/>)}
                  {isExpanded&&(
                    <div onClick={e=>{e.stopPropagation();setExpanded(x=>({...x,[ds]:false}));}}
                      style={{padding:"4px 8px 5px",display:"flex",alignItems:"center",cursor:"pointer",borderBottom:"1px solid var(--border)"}}>
                      <span style={{fontSize:9,color:"var(--text3)"}}>▲ riduci</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


function PostModal({ post, defaultDate, defaultClientId, defaultClientName, clients, memory, addMemory, onSave, onDelete, onClose }) {
  const defaultClient = clients.find(c=>c.id===defaultClientId);
  const defaultPlatform = defaultClient?.platform?.toLowerCase().includes("tik") && defaultClient?.platform?.toLowerCase().includes("insta") && defaultClient?.platform?.toLowerCase().includes("face")
    ? "Tutte"
    : "Tutte";
  const [form, setForm] = useState(post || {
    title:"", clientId:defaultClientId||"", clientName:defaultClientName||"",
    platform:"Tutte", date:defaultDate||today(), status:"Da Editare",
    caption:"", hashtags:"", firstComment:"", notes:"",
    igStatus:"—", fbStatus:"—", ttStatus:"—"
  });
  function upd(k,v) { setForm(f=>({...f,[k]:v})); }
  async function save() {
    const cl = clients.find(c=>c.id===form.clientId);
    if (form.caption)      addMemory("captions",      form.caption);
    if (form.hashtags)     addMemory("hashtags",      form.hashtags);
    if (form.firstComment) addMemory("firstComments", form.firstComment);
    await onSave({...form, clientName:cl?.name||form.clientName});
  }
  const sc = STATUS_COLORS[form.status] || STATUS_COLORS["Da Editare"];
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ padding:"16px 20px", borderBottom:"1.5px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontWeight:700, fontSize:"var(--fs)" }}>{post?"Modifica Post":"Nuovo Post"}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <MField label="Titolo"><input className="input" value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="Titolo del post"/></MField>
            <MField label="Cliente">
              <select className="input" value={form.clientId} onChange={e=>{const cl=clients.find(c=>c.id===e.target.value);upd("clientId",e.target.value);upd("clientName",cl?.name||"");}}>
                <option value="">Seleziona cliente</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </MField>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <MField label="Data"><input className="input" type="date" value={form.date} onChange={e=>upd("date",e.target.value)}/></MField>
            <MField label="Piattaforma">
              <select className="input" value={form.platform} onChange={e=>upd("platform",e.target.value)}>
                {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </MField>
            <MField label="Stato">
              <select className="input" value={form.status} onChange={e=>upd("status",e.target.value)} style={{ background:sc.light, color:sc.text, borderColor:sc.bg+"88" }}>
                {POST_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </MField>
          </div>
          <MField label="Caption"><SugInput value={form.caption} onChange={v=>upd("caption",v)} suggestions={memory.captions} placeholder="Testo del post..." multiline/></MField>
          <MField label="Hashtag"><SugInput value={form.hashtags} onChange={v=>upd("hashtags",v)} suggestions={memory.hashtags} placeholder="#hashtag #esempio"/></MField>
          <MField label="Primo Commento"><SugInput value={form.firstComment} onChange={v=>upd("firstComment",v)} suggestions={memory.firstComments} placeholder="Testo del primo commento..." multiline/></MField>
          <MField label="Note interne"><textarea className="input" value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Note per il team..." style={{ minHeight:52, resize:"vertical" }}/></MField>
          <div style={{ display:"flex", gap:8, justifyContent:"space-between", marginTop:2 }}>
            {post && <button className="btn btn-danger btn-sm" onClick={()=>onDelete(post.id)}><Icon name="trash" size={13}/> Elimina</button>}
            <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
              <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
              <button className="btn btn-primary" onClick={save}><Icon name="check" size={14}/> Salva Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── POSTS SECTION ──────────────────────────────────────────────────────── */
function PostsSection({ posts, clients, onSavePost, onDeletePost, lbl, memory, addMemory, user }) {
  const [editPost,      setEditPost]      = useState(null);
  const [newPost,       setNewPost]       = useState(false);
  const [filterStatus,  setFilterStatus]  = useState("");
  const [filterClient,  setFilterClient]  = useState("");
  const [search,        setSearch]        = useState("");
  const canEdit = user.role !== "viewer";

  const filtered = posts.filter(p =>
    (!filterStatus || p.status===filterStatus) &&
    (!filterClient || p.clientId===filterClient) &&
    (!search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.clientName?.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b)=>a.date?.localeCompare(b.date));

  return (
    <div style={{ padding:"clamp(14px,4vw,32px)" }}>
      <div className="section-header">
        <h1 className="page-title">{lbl("posts_title","Post")}</h1>
        {canEdit && <button className="btn btn-primary" onClick={()=>setNewPost(true)}><Icon name="plus" size={14}/> Nuovo Post</button>}
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <div style={{ position:"relative" }}>
          <Icon name="search" size={14} color="var(--text3)" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          <input className="input" placeholder="Cerca..." value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth:200, paddingLeft:32 }}/>
        </div>
        <select className="input" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ maxWidth:170 }}>
          <option value="">Tutti gli stati</option>
          {POST_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="input" value={filterClient} onChange={e=>setFilterClient(e.target.value)} style={{ maxWidth:190 }}>
          <option value="">Tutti i clienti</option>
          {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {(search||filterStatus||filterClient) && <button className="btn btn-ghost btn-sm" onClick={()=>{setSearch("");setFilterStatus("");setFilterClient("");}}><Icon name="x" size={12}/> Reset</button>}
      </div>
      <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginBottom:11, fontWeight:500 }}>{filtered.length} post trovati</div>
      {filtered.length===0
        ? <div className="empty-state card" style={{padding:48}}><Icon name="pen" size={36}/><p>Nessun post trovato</p></div>
        : <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {filtered.map(p => {
              const sc=STATUS_COLORS[p.status]||STATUS_COLORS["Da Editare"]; const cl=clients.find(c=>c.id===p.clientId);
              return (
                <div key={p.id} className="post-row" onClick={()=>canEdit&&setEditPost(p)}>
                  {cl && <div style={{ width:4, height:38, borderRadius:3, background:cl.color, flexShrink:0 }}/>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"var(--fs-sm)", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title||"Post senza titolo"}</div>
                    <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginTop:1 }}>{p.clientName||"—"} · {fmtDate(p.date)} · {p.platform}</div>
                  </div>
                  <span className="chip" style={{ background:sc.light, color:sc.text, borderColor:sc.bg+"55" }}>{p.status}</span>
                  {canEdit && <button className="btn btn-icon btn-danger" style={{opacity:.65}} onClick={e=>{e.stopPropagation();onDeletePost(p.id);}}><Icon name="trash" size={13}/></button>}
                </div>
              );
            })}
          </div>}
      {(editPost||newPost) && (
        <PostModal post={editPost||undefined} defaultDate={today()} clients={clients} memory={memory} addMemory={addMemory}
          onSave={async p=>{if(!p.id)p={...p,id:genId()};await onSavePost(p);setEditPost(null);setNewPost(false);}}
          onDelete={async id=>{await onDeletePost(id);setEditPost(null);}}
          onClose={()=>{setEditPost(null);setNewPost(false);}}/>
      )}
    </div>
  );
}

/* ─── CLIENTS ────────────────────────────────────────────────────────────── */
function ClientsSection({ clients, onSaveClient, onDeleteClient, posts, lbl }) {
  const [editing,   setEditing]   = useState(null);
  const [newClient, setNewClient] = useState(false);
  const [viewPosts, setViewPosts] = useState(null);

  async function save(c) { await onSaveClient(c); setEditing(null); setNewClient(false); }
  async function del(id) { if(confirm("Eliminare questo cliente?")) await onDeleteClient(id); }

  return (
    <div style={{ padding:"clamp(14px,4vw,32px)" }}>
      <div className="section-header">
        <h1 className="page-title">{lbl("clients_title","Clienti")}</h1>
        <button className="btn btn-primary" onClick={()=>setNewClient(true)}><Icon name="plus" size={14}/> Nuovo Cliente</button>
      </div>
      {clients.length===0
        ? <div className="empty-state card" style={{padding:48}}><Icon name="users" size={36}/><p>Nessun cliente ancora</p></div>
        : <div className="clients-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
            {clients.map(c => {
              const cp = posts.filter(p=>p.clientId===c.id);
              return (
                <div key={c.id} className="card" style={{ overflow:"hidden" }}>
                  <div style={{ height:5, background:c.color||"#ddd" }}/>
                  <div style={{ padding:18 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"var(--fs-lg)" }}>{c.name}</div>
                        {c.platform && <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginTop:2 }}>{c.platform}</div>}
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setEditing(c)}><Icon name="edit" size={13}/></button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={()=>del(c.id)}><Icon name="trash" size={13}/></button>
                      </div>
                    </div>
                    {c.scheduleDays?.length>0 && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", fontWeight:600, marginBottom:5, letterSpacing:".04em" }}>GIORNI DI USCITA</div>
                        <div style={{ display:"flex", gap:4 }}>
                          {DAYS_IT.map((d,i)=>(
                            <div key={i} style={{ width:26, height:26, borderRadius:7, fontSize:"var(--fs-xs)", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", background:c.scheduleDays.includes(i)?c.color:"var(--surface2)", color:c.scheduleDays.includes(i)?"#fff":"var(--text3)", border:c.scheduleDays.includes(i)?"none":"1.5px solid var(--border)" }}>{d[0]}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {POST_STATUSES.map(s=>{
                        const filtered=cp.filter(p=>p.status===s);
                        if(!filtered.length) return null;
                        const sc=STATUS_COLORS[s];
                        return (
                          <button key={s}
                            onClick={()=>setViewPosts({clientName:c.name,clientColor:c.color,status:s,posts:filtered})}
                            className="chip"
                            style={{background:sc.light,color:sc.text,borderColor:sc.bg+"44",cursor:"pointer",transition:"var(--transition)"}}
                            onMouseEnter={e=>{e.currentTarget.style.background=sc.bg;e.currentTarget.style.color="#fff";}}
                            onMouseLeave={e=>{e.currentTarget.style.background=sc.light;e.currentTarget.style.color=sc.text;}}>
                            {filtered.length} {s}
                          </button>
                        );
                      })}
                      {cp.length===0 && <span style={{fontSize:"var(--fs-xs)",color:"var(--text3)"}}>Nessun post</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>}

      {(newClient||editing) && <ClientModal client={editing} onSave={save} onClose={()=>{setEditing(null);setNewClient(false);}}/>}

      {viewPosts && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setViewPosts(null)}>
          <div className="modal">
            <div style={{padding:"16px 20px",borderBottom:"1.5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:viewPosts.clientColor}}/>
                  <span style={{fontWeight:700,fontSize:"var(--fs)"}}>{viewPosts.clientName}</span>
                </div>
                <span className="chip" style={{background:STATUS_COLORS[viewPosts.status]?.light,color:STATUS_COLORS[viewPosts.status]?.text,borderColor:STATUS_COLORS[viewPosts.status]?.bg+"44"}}>
                  {viewPosts.posts.length} post · {viewPosts.status}
                </span>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={()=>setViewPosts(null)}><Icon name="x" size={14}/></button>
            </div>
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:8,maxHeight:"60vh",overflowY:"auto"}}>
              {viewPosts.posts.sort((a,b)=>a.date?.localeCompare(b.date)).map(p=>{
                const sc=STATUS_COLORS[p.status]||STATUS_COLORS["Da Editare"];
                return(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:"var(--radius2)",background:"var(--surface2)",border:"1.5px solid var(--border)"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:"var(--fs-sm)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title||"Post senza titolo"}</div>
                      <div style={{fontSize:"var(--fs-xs)",color:"var(--text3)",marginTop:2}}>{fmtDate(p.date)}{p.platform&&<> · {p.platform}</>}</div>
                    </div>
                    <span className="chip" style={{background:sc.light,color:sc.text,borderColor:sc.bg+"44",flexShrink:0}}>{p.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || { name:"", platform:"", color:PALETTE[4], scheduleDays:[], notes:"" });
  function upd(k,v) { setForm(f=>({...f,[k]:v})); }
  function toggleDay(d) { setForm(f=>({...f,scheduleDays:f.scheduleDays?.includes(d)?f.scheduleDays.filter(x=>x!==d):[...(f.scheduleDays||[]),d]})); }
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{ padding:"16px 20px", borderBottom:"1.5px solid var(--border)", display:"flex", justifyContent:"space-between" }}>
          <div style={{ fontWeight:700, fontSize:"var(--fs)" }}>{client?"Modifica Cliente":"Nuovo Cliente"}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
          <MField label="Nome Cliente"><input className="input" value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="es. Gymmi's"/></MField>
          <MField label="Piattaforme"><input className="input" value={form.platform} onChange={e=>upd("platform",e.target.value)} placeholder="es. Instagram, Facebook, TikTok"/></MField>
          <MField label="Colore Brand">
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
              {PALETTE.map(c=>(
                <button key={c} onClick={()=>upd("color",c)} style={{ width:24, height:24, borderRadius:6, background:c, border:"none", cursor:"pointer", outline:form.color===c?`3px solid ${c}`:"3px solid transparent", outlineOffset:2, transition:"var(--transition)", transform:form.color===c?"scale(1.18)":"scale(1)" }}/>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:"var(--fs-xs)", color:"var(--text2)" }}>
              <div style={{ width:16, height:16, borderRadius:4, background:form.color }}/> Colore selezionato
            </div>
          </MField>
          <MField label="Giorni di uscita contenuto">
            <div style={{ display:"flex", gap:5 }}>
              {DAYS_IT.map((d,i)=>(
                <button key={i} onClick={()=>toggleDay(i)} style={{ width:34, height:34, borderRadius:8, fontSize:"var(--fs-xs)", fontWeight:700, cursor:"pointer", border:"none", transition:"var(--transition)", background:form.scheduleDays?.includes(i)?form.color:"var(--surface2)", color:form.scheduleDays?.includes(i)?"#fff":"var(--text3)", transform:form.scheduleDays?.includes(i)?"scale(1.05)":"scale(1)" }}>{d}</button>
              ))}
            </div>
          </MField>
          <MField label="Note"><textarea className="input" value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Note sul cliente…" style={{ minHeight:52, resize:"vertical" }}/></MField>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
            <button className="btn btn-primary" onClick={()=>onSave(form.id?form:{...form,id:genId()})} disabled={!form.name}><Icon name="check" size={14}/> Salva</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SETTINGS ───────────────────────────────────────────────────────────── */
function Settings({ users, onSaveUser, onDeleteUser, lbl, setLbl, currentUser, fontId, setFontId, fontSizeId, setFontSizeId }) {
  const [tab,  setTab]  = useState("users");
  const [form, setForm] = useState({ name:"", email:"", pw:"", role:"editor" });
  const [msg,  setMsg]  = useState("");
  const [editingLabel, setEditingLabel] = useState(null);

  const labelKeys = [
    ["app_name","Nome App","SocialCal"],["nav_dashboard","Menu: Dashboard","Dashboard"],
    ["nav_calendar","Menu: Calendario","Calendario"],["nav_posts","Menu: Post","Post"],
    ["nav_clients","Menu: Clienti","Clienti"],["nav_settings","Menu: Impostazioni","Impostazioni"],
    ["dash_title","Titolo Dashboard","Dashboard"],["cal_title","Titolo Calendario","Calendario Editoriale"],
    ["posts_title","Titolo Post","Post"],["clients_title","Titolo Clienti","Clienti"],
  ];

  async function invite() {
    if (!form.name||!form.email||!form.pw) return setMsg("⚠️ Compila tutti i campi");
    if (users.find(u=>u.email===form.email)) return setMsg("⚠️ Email già registrata");
    await onSaveUser({id:genId(),...form,password:form.pw,avatar:form.name[0].toUpperCase()});
    setMsg("✅ Utente aggiunto!"); setForm({name:"",email:"",pw:"",role:"editor"});
  }
  async function changeRole(id,role) { const u=users.find(x=>x.id===id); if(u) await onSaveUser({...u,role}); }
  async function deleteUser(id) { if(confirm("Eliminare questo utente?")) await onDeleteUser(id); }

  const tabs = [
    { id:"users",     icon:"users",   label:"Utenti" },
    { id:"labels",    icon:"tag",     label:"Rinomina" },
    { id:"appearance",icon:"type",    label:"Aspetto" },
  ];

  return (
    <div style={{ padding:"clamp(14px,4vw,32px)", maxWidth:880 }}>
      <h1 className="page-title" style={{ marginBottom:22 }}>Impostazioni</h1>
      <div className="pill-tabs" style={{ marginBottom:24, display:"inline-flex" }}>
        {tabs.map(t=>(
          <button key={t.id} className={"pill-tab"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}
            style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Icon name={t.icon} size={13}/> {t.label}
          </button>
        ))}
      </div>

      {tab==="users" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          <div>
            <div style={{ fontWeight:600, fontSize:"var(--fs)", marginBottom:13 }}>Utenti Registrati</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {users.map(u=>(
                <div key={u.id} className="card" style={{ padding:"11px 15px", display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--accentbg)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"var(--accent)", fontSize:"var(--fs-sm)", flexShrink:0 }}>{u.avatar||u.name?.[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:"var(--fs-sm)" }}>{u.name}</div>
                    <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)" }}>{u.email}</div>
                  </div>
                  {u.id!==currentUser
                    ? <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)} className="input" style={{ width:105, fontSize:"var(--fs-xs)", padding:"4px 7px" }}><option value="editor">Editor</option><option value="viewer">Viewer</option></select>
                    : <span className="chip" style={{ background:"var(--accentbg)", color:"var(--accent)", borderColor:"var(--accent)44" }}>Admin</span>}
                  {u.id!==currentUser && <button className="btn btn-danger btn-icon btn-sm" onClick={()=>deleteUser(u.id)}><Icon name="trash" size={12}/></button>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight:600, fontSize:"var(--fs)", marginBottom:13 }}>Invita Utente</div>
            <div className="card" style={{ padding:18 }}>
              {msg && <Alert type={msg.startsWith("✅")?"success":"danger"} style={{ marginBottom:13 }}>{msg}</Alert>}
              <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                <MField label="Nome"><input className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome utente"/></MField>
                <MField label="Email"><input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@esempio.com"/></MField>
                <MField label="Password temporanea"><input className="input" value={form.pw} onChange={e=>setForm(f=>({...f,pw:e.target.value}))} placeholder="Minimo 6 caratteri"/></MField>
                <MField label="Ruolo">
                  <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                    <option value="editor">Editor — può creare e modificare</option>
                    <option value="viewer">Viewer — solo lettura</option>
                  </select>
                </MField>
                <button className="btn btn-primary" style={{ width:"100%", marginTop:3 }} onClick={invite}><Icon name="mail" size={14}/> Aggiungi Utente</button>
                <p style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", textAlign:"center" }}>Comunica le credenziali all'utente invitato.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="labels" && (
        <div className="card" style={{ padding:22, maxWidth:560 }}>
          <div style={{ fontWeight:600, fontSize:"var(--fs)", marginBottom:15 }}>Rinomina Etichette</div>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {labelKeys.map(([key,desc,def])=>(
              <div key={key} style={{ display:"flex", alignItems:"center", gap:11, padding:"7px 11px", background:"var(--surface2)", borderRadius:8 }}>
                <div style={{ width:165, fontSize:"var(--fs-xs)", color:"var(--text3)", fontWeight:500 }}>{desc}</div>
                {editingLabel===key ? (
                  <div style={{ display:"flex", gap:6, flex:1 }}>
                    <input className="input" defaultValue={lbl(key,def)} autoFocus id={`lbl_${key}`} onKeyDown={e=>{if(e.key==="Enter"){setLbl(key,e.target.value);setEditingLabel(null);}}} style={{ flex:1, padding:"5px 9px" }}/>
                    <button className="btn btn-primary btn-sm" onClick={()=>{setLbl(key,document.getElementById(`lbl_${key}`).value);setEditingLabel(null);}}><Icon name="check" size={12}/></button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setEditingLabel(null)}><Icon name="x" size={12}/></button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
                    <span style={{ fontSize:"var(--fs-sm)", fontWeight:500 }}>{lbl(key,def)}</span>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setEditingLabel(key)} style={{ marginLeft:"auto", opacity:.55 }}><Icon name="edit" size={12}/></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="appearance" && (
        <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:560 }}>
          {/* Font */}
          <div className="card" style={{ padding:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <Icon name="type" size={16} color="var(--accent)"/>
              <div style={{ fontWeight:600, fontSize:"var(--fs)" }}>Font dell'interfaccia</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
              {FONT_OPTIONS.map(f=>(
                <button key={f.id} onClick={()=>setFontId(f.id)}
                  style={{ padding:"10px 14px", borderRadius:9, border:"1.5px solid", cursor:"pointer", textAlign:"left", transition:"var(--transition)", background:fontId===f.id?"var(--accentbg)":"var(--surface2)", borderColor:fontId===f.id?"var(--accent)":"transparent" }}>
                  <div style={{ fontWeight:fontId===f.id?700:500, fontSize:"var(--fs-sm)", color:fontId===f.id?"var(--accent)":"var(--text)" }}>{f.label}</div>
                  <div style={{ fontSize:"var(--fs-xs)", color:"var(--text3)", marginTop:2 }}>Aa Bb Cc 123</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="card" style={{ padding:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <Icon name="sliders" size={16} color="var(--accent)"/>
              <div style={{ fontWeight:600, fontSize:"var(--fs)" }}>Dimensione testo</div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {FONT_SIZES.map(s=>(
                <button key={s.id} onClick={()=>setFontSizeId(s.id)}
                  style={{ flex:1, minWidth:90, padding:"10px 12px", borderRadius:9, border:"1.5px solid", cursor:"pointer", textAlign:"center", transition:"var(--transition)", background:fontSizeId===s.id?"var(--accentbg)":"var(--surface2)", borderColor:fontSizeId===s.id?"var(--accent)":"transparent" }}>
                  <div style={{ fontSize:s.base, fontWeight:600, color:fontSizeId===s.id?"var(--accent)":"var(--text)", lineHeight:1.2 }}>Aa</div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginTop:4 }}>{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="card" style={{ padding:22 }}>
            <div style={{ fontWeight:600, fontSize:"var(--fs)", marginBottom:12 }}>Anteprima</div>
            <div style={{ background:"var(--surface2)", borderRadius:9, padding:16, border:"1.5px solid var(--border)" }}>
              <div style={{ fontWeight:700, fontSize:"var(--fs-xl)", marginBottom:5 }}>Calendario Editoriale</div>
              <div style={{ fontSize:"var(--fs-sm)", color:"var(--text2)", marginBottom:10 }}>Gestisci i tuoi contenuti social in modo semplice ed efficace.</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span className="chip" style={{ background:"#f0fdf4", color:"#166534", borderColor:"#22c55e44" }}>Pronto</span>
                <span className="chip" style={{ background:"#eef2ff", color:"#3730a3", borderColor:"#6366f144" }}>Programmato</span>
                <span className="chip" style={{ background:"#f0f9ff", color:"#075985", borderColor:"#0ea5e944" }}>Pubblicato</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
function MField({ label, children }) {
  return <div className="field"><label className="label">{label}</label>{children}</div>;
}

function Alert({ type, children, style }) {
  const map = { success:["var(--accentbg)","var(--accent)"], danger:["var(--dangerbg)","var(--danger)"] };
  const [bg, color] = map[type] || map.danger;
  return <div style={{ background:bg, color, padding:"8px 12px", borderRadius:8, fontSize:"var(--fs-sm)", fontWeight:500, ...style }}>{children}</div>;
}

function EmptyState({ icon, text }) {
  return <div className="empty-state"><Icon name={icon} size={36}/><p style={{ marginTop:10 }}>{text}</p></div>;
}

function SugInput({ value, onChange, suggestions, placeholder, multiline }) {
  const [open, setOpen] = useState(false);
  const filtered = suggestions?.filter(s=>s!==value).slice(0,6) || [];
  const props = { className:"input", value, placeholder, onChange:e=>onChange(e.target.value), onFocus:()=>setOpen(true), onBlur:()=>setTimeout(()=>setOpen(false),160) };
  return (
    <div style={{ position:"relative" }}>
      {multiline ? <textarea {...props} style={{ minHeight:70, resize:"vertical" }}/> : <input {...props}/>}
      {open && filtered.length>0 && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:200, background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:10, boxShadow:"var(--shadow2)", overflow:"hidden", marginTop:4 }}>
          {filtered.map((s,i)=>(
            <div key={i} onMouseDown={()=>onChange(s)}
              style={{ padding:"7px 12px", fontSize:"var(--fs-xs)", color:"var(--text2)", cursor:"pointer", borderBottom:i<filtered.length-1?"1px solid var(--border)":"none", transition:"background .1s", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
