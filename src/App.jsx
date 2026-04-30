
import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PLATFORMS = ["Instagram", "Facebook", "TikTok", "Tutte"];
const POST_STATUSES = ["Bozza", "In Revisione", "Da Editare", "Pronto", "Programmato", "Pubblicato"];
const STATUS_COLORS = {
  "Bozza":        { bg: "#64748b", light: "#e2e8f0", text: "#1e293b", label: "Bozza" },
  "In Revisione": { bg: "#f59e0b", light: "#fef3c7", text: "#78350f", label: "In Revisione" },
  "Da Editare":   { bg: "#ef4444", light: "#fee2e2", text: "#7f1d1d", label: "Da Editare" },
  "Pronto":       { bg: "#10b981", light: "#d1fae5", text: "#064e3b", label: "Pronto" },
  "Programmato":  { bg: "#6366f1", light: "#e0e7ff", text: "#312e81", label: "Programmato" },
  "Pubblicato":   { bg: "#0ea5e9", light: "#e0f2fe", text: "#0c4a6e", label: "Pubblicato" },
};

const PALETTE = [
  "#e74c3c","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3",
  "#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39",
  "#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#607d8b",
  "#f06292","#ba68c8","#81d4fa","#80cbc4","#a5d6a7","#ffcc02",
  "#ff7043","#26c6da","#66bb6a","#ab47bc","#5c6bc0","#ec407a",
];

const DAYS_IT = ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

const initialAdmin = {
  id: "u1", name: "Admin", email: "admin@example.com",
  role: "admin", avatar: "A", password: "admin123",
};

function genId() { return "id_" + Math.random().toString(36).slice(2, 9); }

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function useLocalState(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()}`;
}
function isoDate(y,m,d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function today() { const n=new Date(); return isoDate(n.getFullYear(),n.getMonth(),n.getDate()); }

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useLocalState("scm_users", [initialAdmin]);
  const [clients, setClients] = useLocalState("scm_clients", []);
  const [posts, setPosts] = useLocalState("scm_posts", []);
  const [currentUser, setCurrentUser] = useLocalState("scm_current", null);
  const [section, setSection] = useState("dashboard");
  const [labels, setLabels] = useLocalState("scm_labels", {});
  const [memory, setMemory] = useLocalState("scm_memory", { captions: [], hashtags: [], firstComments: [] });

  // Auth
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const user = users.find(u => u.id === currentUser);
  const isAdmin = user?.role === "admin";

  function login() {
    const u = users.find(u => u.email === loginEmail && u.password === loginPw);
    if (u) { setCurrentUser(u.id); setLoginErr(""); }
    else setLoginErr("Credenziali non valide");
  }
  function logout() { setCurrentUser(null); setSection("dashboard"); }

  function lbl(key, fallback) { return labels[key] ?? fallback; }
  function setLbl(key, val) { setLabels(l => ({ ...l, [key]: val })); }

  function addMemory(type, val) {
    if (!val) return;
    setMemory(m => ({ ...m, [type]: [...new Set([val, ...(m[type]||[])])].slice(0,30) }));
  }

  if (!user) return (
    <Login email={loginEmail} setEmail={setLoginEmail} pw={loginPw} setPw={setLoginPw} err={loginErr} onLogin={login} />
  );

  // Section nav
  const nav = [
    { id: "dashboard", icon: "⊞", label: lbl("nav_dashboard","Dashboard") },
    { id: "calendar",  icon: "📅", label: lbl("nav_calendar","Calendario") },
    { id: "posts",     icon: "✏️", label: lbl("nav_posts","Post") },
    { id: "clients",   icon: "👥", label: lbl("nav_clients","Clienti") },
    ...(isAdmin ? [{ id: "settings", icon: "⚙️", label: lbl("nav_settings","Impostazioni") }] : []),
  ];

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", background:"#0f172a", color:"#e2e8f0" }}>
      {/* Sidebar */}
      <aside style={{ width:220, background:"#1e293b", display:"flex", flexDirection:"column", padding:"20px 0", flexShrink:0 }}>
        <div style={{ padding:"0 20px 20px", borderBottom:"1px solid #334155" }}>
          <div style={{ fontSize:20, fontWeight:700, color:"#f1f5f9", letterSpacing:"-0.5px" }}>
            {lbl("app_name","📣 SocialCal")}
          </div>
          <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>Editorial Manager</div>
        </div>
        <nav style={{ flex:1, padding:"12px 0" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 20px",
                background: section===n.id ? "#334155" : "transparent",
                color: section===n.id ? "#f1f5f9" : "#94a3b8",
                border:"none", cursor:"pointer", fontSize:14, fontWeight: section===n.id ? 600 : 400,
                borderLeft: section===n.id ? "3px solid #6366f1" : "3px solid transparent",
                textAlign:"left", transition:"all .15s" }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:"1px solid #334155" }}>
          <div style={{ fontSize:13, color:"#94a3b8", marginBottom:8 }}>
            <strong style={{ color:"#e2e8f0" }}>{user.name}</strong><br/>
            <span style={{ fontSize:11 }}>{user.role === "admin" ? "Amministratore" : user.role === "editor" ? "Editor" : "Viewer"}</span>
          </div>
          <button onClick={logout} style={{ fontSize:12, color:"#ef4444", background:"none", border:"none", cursor:"pointer", padding:0 }}>Esci</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflow:"auto", background:"#0f172a" }}>
        {section === "dashboard" && <Dashboard posts={posts} clients={clients} setPosts={setPosts} setSection={setSection} lbl={lbl} />}
        {section === "calendar"  && <CalendarView posts={posts} setPosts={setPosts} clients={clients} lbl={lbl} memory={memory} addMemory={addMemory} />}
        {section === "posts"     && <PostsSection posts={posts} setPosts={setPosts} clients={clients} lbl={lbl} memory={memory} addMemory={addMemory} user={user} />}
        {section === "clients"   && <ClientsSection clients={clients} setClients={setClients} posts={posts} lbl={lbl} setLbl={setLbl} />}
        {section === "settings"  && isAdmin && <Settings users={users} setUsers={setUsers} lbl={lbl} setLbl={setLbl} currentUser={currentUser} />}
      </main>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ email, setEmail, pw, setPw, err, onLogin }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0f172a", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <div style={{ background:"#1e293b", padding:40, borderRadius:16, width:340, border:"1px solid #334155" }}>
        <div style={{ fontSize:24, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>📣 SocialCal</div>
        <div style={{ color:"#64748b", fontSize:13, marginBottom:28 }}>Accedi per continuare</div>
        {err && <div style={{ background:"#7f1d1d", color:"#fca5a5", padding:"8px 12px", borderRadius:8, fontSize:13, marginBottom:16 }}>{err}</div>}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:"#0f172a", border:"1px solid #334155", color:"#e2e8f0", fontSize:14, boxSizing:"border-box", marginBottom:10 }} />
        <input placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onLogin()}
          style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:"#0f172a", border:"1px solid #334155", color:"#e2e8f0", fontSize:14, boxSizing:"border-box", marginBottom:20 }} />
        <button onClick={onLogin} style={{ width:"100%", padding:"12px", borderRadius:8, background:"#6366f1", color:"#fff", border:"none", cursor:"pointer", fontSize:15, fontWeight:600 }}>Accedi</button>
        <div style={{ marginTop:16, fontSize:12, color:"#475569", textAlign:"center" }}>Default: admin@example.com / admin123</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ posts, clients, setPosts, setSection, lbl }) {
  const now = new Date();
  const thisMonth = posts.filter(p => p.date?.startsWith(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`));
  const byStatus = s => posts.filter(p => p.status === s);
  const upcoming = posts.filter(p => p.date >= today()).sort((a,b) => a.date.localeCompare(b.date)).slice(0,8);

  const [filter, setFilter] = useState(null);
  const filtered = filter ? (
    filter === "thisMonth" ? thisMonth :
    filter === "clients" ? posts :
    byStatus(filter)
  ) : null;

  const stats = [
    { key:"clients",    label:"Clienti Attivi",  value:clients.length, color:"#6366f1", icon:"👥" },
    { key:"thisMonth",  label:"Post Questo Mese", value:thisMonth.length, color:"#10b981", icon:"📊" },
    { key:"Programmato",label:"Da Pubblicare",    value:byStatus("Programmato").length, color:"#f59e0b", icon:"🗓️" },
    { key:"In Revisione",label:"In Lavorazione",  value:byStatus("In Revisione").length + byStatus("Da Editare").length + byStatus("Bozza").length, color:"#ef4444", icon:"⚙️" },
  ];

  return (
    <div style={{ padding:32 }}>
      <h1 style={{ fontSize:26, fontWeight:700, color:"#f1f5f9", marginBottom:24 }}>{lbl("dash_title","Dashboard")}</h1>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
        {stats.map(s => (
          <button key={s.key} onClick={() => setFilter(filter===s.key?null:s.key)}
            style={{ background: filter===s.key ? "#334155" : "#1e293b", border:`2px solid ${filter===s.key ? s.color : "#334155"}`,
              borderRadius:12, padding:"20px 24px", cursor:"pointer", textAlign:"left", transition:"all .15s" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:32, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:13, color:"#94a3b8", marginTop:2 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filtered posts */}
      {filtered && (
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, marginBottom:32, border:"1px solid #334155" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ margin:0, color:"#f1f5f9", fontSize:16 }}>
              {filter === "clients" ? "Tutti i Post" :
               filter === "thisMonth" ? "Post questo mese" :
               `Post: ${filter}`}
            </h3>
            <button onClick={() => setFilter(null)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
          {filtered.length === 0 ? <div style={{ color:"#64748b", fontSize:14 }}>Nessun post trovato</div> :
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filtered.map(p => <PostRow key={p.id} post={p} setPosts={setPosts} />)}
            </div>
          }
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Status cards */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ margin:"0 0 16px", color:"#f1f5f9", fontSize:16 }}>Stato Post</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {POST_STATUSES.map(s => {
              const cnt = byStatus(s).length;
              const sc = STATUS_COLORS[s];
              return (
                <button key={s} onClick={() => setFilter(filter===s?null:s)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"8px 12px", borderRadius:8, border:`1px solid ${filter===s ? sc.bg : "transparent"}`,
                    background: filter===s ? sc.bg+"22" : "#0f172a", cursor:"pointer", transition:"all .15s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:sc.bg }} />
                    <span style={{ fontSize:13, color:"#e2e8f0" }}>{s}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:sc.bg }}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155" }}>
          <h3 style={{ margin:"0 0 16px", color:"#f1f5f9", fontSize:16 }}>Prossimi Post</h3>
          {upcoming.length === 0 ? <div style={{ color:"#64748b", fontSize:14 }}>Nessun post in programma</div> :
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {upcoming.map(p => <PostRow key={p.id} post={p} setPosts={setPosts} compact />)}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

function PostRow({ post, setPosts, compact }) {
  const [editing, setEditing] = useState(false);
  const sc = STATUS_COLORS[post.status] || STATUS_COLORS["Bozza"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"#0f172a", borderRadius:8, border:"1px solid #1e293b" }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:sc.bg, flexShrink:0 }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {post.title || "Post senza titolo"}
        </div>
        {!compact && <div style={{ fontSize:11, color:"#64748b" }}>{post.clientName} · {fmtDate(post.date)} · {post.platform}</div>}
        {compact && <div style={{ fontSize:11, color:"#64748b" }}>{fmtDate(post.date)}</div>}
      </div>
      <span style={{ fontSize:11, background:sc.bg+"33", color:sc.bg, padding:"2px 8px", borderRadius:20, flexShrink:0 }}>{post.status}</span>
      <button onClick={() => setPosts(ps => ps.filter(x => x.id !== post.id))}
        style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:14, flexShrink:0, padding:"0 2px" }}>🗑</button>
    </div>
  );
}

// ─── CALENDAR ────────────────────────────────────────────────────────────────
function CalendarView({ posts, setPosts, clients, lbl, memory, addMemory }) {
  const [view, setView] = useState("month"); // month | week
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d;
  });
  const [editPost, setEditPost] = useState(null);
  const [newPostDate, setNewPostDate] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  function prevPeriod() {
    if (view === "month") {
      if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1);
    } else {
      const d = new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d);
    }
  }
  function nextPeriod() {
    if (view === "month") {
      if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1);
    } else {
      const d = new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d);
    }
  }

  // Month grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Week days
  const weekDays = Array.from({length:7}, (_,i) => {
    const d = new Date(weekStart); d.setDate(d.getDate()+i); return d;
  });

  function postsForDate(dateStr) {
    return posts.filter(p => p.date === dateStr);
  }

  // Placeholder posts from client schedules
  function placeholdersForDate(dateStr) {
    const d = new Date(dateStr);
    const dow = d.getDay(); // 0=Sun
    return clients.filter(c => c.scheduleDays?.includes(dow) && !posts.find(p => p.date===dateStr && p.clientId===c.id && p.isPlaceholder));
  }

  function clickCell(dateStr) { setNewPostDate(dateStr); }

  const periodLabel = view === "month"
    ? `${MONTHS_IT[month]} ${year}`
    : `${fmtDate(weekDays[0])} – ${fmtDate(weekDays[6])}`;

  return (
    <div style={{ padding:32 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:"#f1f5f9", margin:0 }}>{lbl("cal_title","Calendario Editoriale")}</h1>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ display:"flex", background:"#1e293b", borderRadius:8, overflow:"hidden", border:"1px solid #334155" }}>
            {["month","week"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding:"8px 16px", background:view===v?"#6366f1":"transparent", color:view===v?"#fff":"#94a3b8",
                  border:"none", cursor:"pointer", fontSize:13, fontWeight:view===v?600:400 }}>
                {v==="month"?"Mese":"Settimana"}
              </button>
            ))}
          </div>
          <button onClick={prevPeriod} style={navBtn}>‹</button>
          <span style={{ color:"#f1f5f9", fontSize:15, fontWeight:600, minWidth:180, textAlign:"center" }}>{periodLabel}</span>
          <button onClick={nextPeriod} style={navBtn}>›</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20 }}>
        {Object.entries(STATUS_COLORS).map(([s, sc]) => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
            <div style={{ width:10, height:10, borderRadius:3, background:sc.bg }} />
            {s}
          </div>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8" }}>
          <div style={{ width:10, height:10, borderRadius:3, background:"#334155", border:"1px dashed #64748b" }} />
          Slot Pianificato
        </div>
      </div>

      {/* Month View */}
      {view === "month" && (
        <div style={{ background:"#1e293b", borderRadius:12, overflow:"hidden", border:"1px solid #334155" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", background:"#334155" }}>
            {DAYS_IT.map(d => (
              <div key={d} style={{ padding:"10px 0", textAlign:"center", fontSize:12, fontWeight:600, color:"#94a3b8" }}>{d}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, background:"#334155" }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} style={{ background:"#1e293b", minHeight:100 }} />;
              const dateStr = isoDate(year, month, day);
              const dayPosts = postsForDate(dateStr);
              const slots = placeholdersForDate(dateStr);
              const isToday = dateStr === today();
              return (
                <div key={i} onClick={() => clickCell(dateStr)}
                  style={{ background:"#1e293b", minHeight:100, padding:"6px 6px 4px", cursor:"pointer",
                    border: isToday ? "2px solid #6366f1" : "2px solid transparent", position:"relative" }}>
                  <div style={{ fontSize:12, fontWeight:isToday?700:400, color:isToday?"#6366f1":"#64748b", marginBottom:4 }}>{day}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                    {slots.map(c => (
                      <div key={c.id} title={c.name}
                        onClick={e=>{e.stopPropagation();setNewPostDate(dateStr);}}
                        style={{ fontSize:10, padding:"2px 5px", borderRadius:4, background:c.color+"33",
                          borderLeft:`3px solid ${c.color}`, color:c.color, cursor:"pointer",
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", border:`1px dashed ${c.color}` }}>
                        {c.name}
                      </div>
                    ))}
                    {dayPosts.map(p => {
                      const sc = STATUS_COLORS[p.status] || STATUS_COLORS["Bozza"];
                      const cl = clients.find(c=>c.id===p.clientId);
                      return (
                        <div key={p.id}
                          onMouseEnter={e => setTooltip({ post:p, x:e.clientX, y:e.clientY })}
                          onMouseLeave={() => setTooltip(null)}
                          onClick={e=>{e.stopPropagation();setEditPost(p);}}
                          style={{ fontSize:10, padding:"2px 5px", borderRadius:4,
                            background:sc.bg+"33", borderLeft:`3px solid ${sc.bg}`,
                            color:"#e2e8f0", cursor:"pointer", display:"flex", alignItems:"center", gap:3,
                            whiteSpace:"nowrap", overflow:"visible", maxWidth:"100%" }}>
                          {cl && <div style={{ width:6, height:6, borderRadius:"50%", background:cl.color, flexShrink:0 }} />}
                          <span style={{ overflow:"hidden", textOverflow:"ellipsis", flex:1, minWidth:0 }}>{p.title||"Post"}</span>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:sc.bg, flexShrink:0 }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div style={{ background:"#1e293b", borderRadius:12, overflow:"hidden", border:"1px solid #334155" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", background:"#334155" }}>
            {weekDays.map((d,i) => {
              const ds = isoDate(d.getFullYear(),d.getMonth(),d.getDate());
              const isToday = ds === today();
              return (
                <div key={i} style={{ padding:"10px 8px", textAlign:"center", background:isToday?"#6366f122":"transparent" }}>
                  <div style={{ fontSize:11, color:"#64748b" }}>{DAYS_IT[d.getDay()]}</div>
                  <div style={{ fontSize:16, fontWeight:isToday?700:400, color:isToday?"#6366f1":"#e2e8f0" }}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, background:"#334155" }}>
            {weekDays.map((d,i) => {
              const ds = isoDate(d.getFullYear(),d.getMonth(),d.getDate());
              const dayPosts = postsForDate(ds);
              const slots = placeholdersForDate(ds);
              return (
                <div key={i} onClick={() => clickCell(ds)}
                  style={{ background:"#1e293b", minHeight:200, padding:"8px 6px", cursor:"pointer" }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    {slots.map(c => (
                      <div key={c.id} onClick={e=>{e.stopPropagation();setNewPostDate(ds);}}
                        style={{ fontSize:11, padding:"4px 7px", borderRadius:5, background:c.color+"22",
                          border:`1px dashed ${c.color}`, color:c.color, cursor:"pointer" }}>
                        {c.name}
                      </div>
                    ))}
                    {dayPosts.map(p => {
                      const sc = STATUS_COLORS[p.status] || STATUS_COLORS["Bozza"];
                      const cl = clients.find(c=>c.id===p.clientId);
                      return (
                        <div key={p.id}
                          onMouseEnter={e => setTooltip({ post:p, x:e.clientX, y:e.clientY })}
                          onMouseLeave={() => setTooltip(null)}
                          onClick={e=>{e.stopPropagation();setEditPost(p);}}
                          style={{ fontSize:11, padding:"4px 7px", borderRadius:5,
                            background:sc.bg+"22", borderLeft:`3px solid ${sc.bg}`,
                            color:"#e2e8f0", cursor:"pointer" }}>
                          {cl && <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:cl.color, marginRight:4 }} />}
                          <strong style={{ fontSize:11 }}>{p.title||"Post"}</strong>
                          <div style={{ fontSize:10, color:sc.bg, marginTop:2 }}>{p.status}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position:"fixed", left:tooltip.x+12, top:tooltip.y+12, zIndex:9999,
          background:"#1e293b", border:"1px solid #334155", borderRadius:10, padding:"12px 16px",
          boxShadow:"0 8px 32px #00000066", maxWidth:260, pointerEvents:"none" }}>
          <div style={{ fontWeight:600, color:"#f1f5f9", fontSize:14, marginBottom:4 }}>{tooltip.post.title||"Post senza titolo"}</div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>{tooltip.post.clientName}</div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>{fmtDate(tooltip.post.date)} · {tooltip.post.platform}</div>
          <div style={{ marginTop:6 }}>
            <span style={{ fontSize:11, background:STATUS_COLORS[tooltip.post.status]?.bg+"33",
              color:STATUS_COLORS[tooltip.post.status]?.bg, padding:"2px 8px", borderRadius:20 }}>
              {tooltip.post.status}
            </span>
          </div>
          {tooltip.post.caption && <div style={{ fontSize:11, color:"#64748b", marginTop:6, borderTop:"1px solid #334155", paddingTop:6 }}>{tooltip.post.caption.slice(0,80)}{tooltip.post.caption.length>80?"…":""}</div>}
        </div>
      )}

      {/* Post Modal */}
      {(editPost || newPostDate) && (
        <PostModal
          post={editPost}
          defaultDate={newPostDate}
          clients={clients}
          memory={memory}
          addMemory={addMemory}
          onSave={p => {
            if (editPost) setPosts(ps => ps.map(x => x.id===p.id ? p : x));
            else setPosts(ps => [...ps, { ...p, id:genId() }]);
            setEditPost(null); setNewPostDate(null);
          }}
          onDelete={id => { setPosts(ps => ps.filter(x=>x.id!==id)); setEditPost(null); }}
          onClose={() => { setEditPost(null); setNewPostDate(null); }}
        />
      )}
    </div>
  );
}

const navBtn = { padding:"8px 14px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", cursor:"pointer", fontSize:16 };

// ─── POST MODAL ───────────────────────────────────────────────────────────────
function PostModal({ post, defaultDate, clients, memory, addMemory, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(post || {
    title:"", clientId:"", clientName:"", platform:"Instagram", date:defaultDate||today(),
    status:"Bozza", caption:"", hashtags:"", firstComment:"", notes:"", isPlaceholder:false
  });
  const [showSuggestions, setShowSuggestions] = useState({ caption:false, hashtags:false, firstComment:false });

  function upd(k, v) { setForm(f => ({ ...f, [k]:v })); }

  function save() {
    const cl = clients.find(c => c.id === form.clientId);
    const p = { ...form, clientName: cl?.name || form.clientName };
    if (form.caption) addMemory("captions", form.caption);
    if (form.hashtags) addMemory("hashtags", form.hashtags);
    if (form.firstComment) addMemory("firstComments", form.firstComment);
    onSave(p);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#1e293b", borderRadius:16, width:"100%", maxWidth:600, maxHeight:"90vh", overflow:"auto", border:"1px solid #334155" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #334155", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ margin:0, color:"#f1f5f9", fontSize:18 }}>{post ? "Modifica Post" : "Nuovo Post"}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16 }}>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Titolo">
              <input value={form.title} onChange={e=>upd("title",e.target.value)} style={input} placeholder="Titolo del post" />
            </Field>
            <Field label="Cliente">
              <select value={form.clientId} onChange={e=>{
                const cl=clients.find(c=>c.id===e.target.value);
                upd("clientId",e.target.value); upd("clientName",cl?.name||"");
              }} style={input}>
                <option value="">Seleziona cliente</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <Field label="Data">
              <input type="date" value={form.date} onChange={e=>upd("date",e.target.value)} style={input} />
            </Field>
            <Field label="Piattaforma">
              <select value={form.platform} onChange={e=>upd("platform",e.target.value)} style={input}>
                {PLATFORMS.map(p=><option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Stato">
              <select value={form.status} onChange={e=>upd("status",e.target.value)} style={input}>
                {POST_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Caption">
            <div style={{ position:"relative" }}>
              <textarea value={form.caption} onChange={e=>upd("caption",e.target.value)}
                onFocus={()=>setShowSuggestions(s=>({...s,caption:true}))}
                onBlur={()=>setTimeout(()=>setShowSuggestions(s=>({...s,caption:false})),150)}
                style={{...input, minHeight:80, resize:"vertical"}} placeholder="Testo del post..." />
              {showSuggestions.caption && memory.captions?.length > 0 && (
                <SuggestionList items={memory.captions} onSelect={v=>upd("caption",v)} />
              )}
            </div>
          </Field>

          <Field label="Hashtag">
            <div style={{ position:"relative" }}>
              <input value={form.hashtags} onChange={e=>upd("hashtags",e.target.value)}
                onFocus={()=>setShowSuggestions(s=>({...s,hashtags:true}))}
                onBlur={()=>setTimeout(()=>setShowSuggestions(s=>({...s,hashtags:false})),150)}
                style={input} placeholder="#hashtag #esempio" />
              {showSuggestions.hashtags && memory.hashtags?.length > 0 && (
                <SuggestionList items={memory.hashtags} onSelect={v=>upd("hashtags",v)} />
              )}
            </div>
          </Field>

          <Field label="Primo Commento">
            <div style={{ position:"relative" }}>
              <textarea value={form.firstComment} onChange={e=>upd("firstComment",e.target.value)}
                onFocus={()=>setShowSuggestions(s=>({...s,firstComment:true}))}
                onBlur={()=>setTimeout(()=>setShowSuggestions(s=>({...s,firstComment:false})),150)}
                style={{...input, minHeight:60, resize:"vertical"}} placeholder="Testo del primo commento..." />
              {showSuggestions.firstComment && memory.firstComments?.length > 0 && (
                <SuggestionList items={memory.firstComments} onSelect={v=>upd("firstComment",v)} />
              )}
            </div>
          </Field>

          <Field label="Note interne">
            <textarea value={form.notes} onChange={e=>upd("notes",e.target.value)}
              style={{...input, minHeight:60, resize:"vertical"}} placeholder="Note per il team..." />
          </Field>

          <div style={{ display:"flex", gap:8, justifyContent:"space-between" }}>
            {post && <button onClick={()=>onDelete(post.id)} style={{...btn, background:"#7f1d1d", color:"#fca5a5"}}>Elimina</button>}
            <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
              <button onClick={onClose} style={{...btn, background:"#334155", color:"#94a3b8"}}>Annulla</button>
              <button onClick={save} style={{...btn, background:"#6366f1", color:"#fff"}}>Salva</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionList({ items, onSelect }) {
  return (
    <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:100, background:"#0f172a",
      border:"1px solid #334155", borderRadius:8, maxHeight:150, overflowY:"auto", boxShadow:"0 4px 20px #00000066" }}>
      {items.slice(0,8).map((it,i) => (
        <div key={i} onMouseDown={()=>onSelect(it)}
          style={{ padding:"8px 12px", cursor:"pointer", fontSize:12, color:"#94a3b8",
            borderBottom:"1px solid #1e293b", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}
          onMouseEnter={e=>e.target.style.background="#1e293b"}
          onMouseLeave={e=>e.target.style.background="transparent"}>
          {it}
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize:12, color:"#94a3b8", display:"block", marginBottom:5, fontWeight:500 }}>{label}</label>
      {children}
    </div>
  );
}

const input = { width:"100%", padding:"9px 12px", borderRadius:8, background:"#0f172a", border:"1px solid #334155",
  color:"#e2e8f0", fontSize:13, boxSizing:"border-box", outline:"none" };
const btn = { padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600 };

// ─── POSTS SECTION ────────────────────────────────────────────────────────────
function PostsSection({ posts, setPosts, clients, lbl, memory, addMemory, user }) {
  const [editPost, setEditPost] = useState(null);
  const [newPost, setNewPost] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [search, setSearch] = useState("");

  const canEdit = user.role !== "viewer";

  const filtered = posts.filter(p =>
    (!filterStatus || p.status === filterStatus) &&
    (!filterClient || p.clientId === filterClient) &&
    (!search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.clientName?.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => a.date?.localeCompare(b.date));

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:"#f1f5f9", margin:0 }}>{lbl("posts_title","Post")}</h1>
        {canEdit && <button onClick={()=>setNewPost(true)} style={{...btn, background:"#6366f1", color:"#fff", fontSize:14}}>+ Nuovo Post</button>}
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <input placeholder="Cerca..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{...input, width:200}} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...input, width:160}}>
          <option value="">Tutti gli stati</option>
          {POST_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select value={filterClient} onChange={e=>setFilterClient(e.target.value)} style={{...input, width:180}}>
          <option value="">Tutti i clienti</option>
          {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.length === 0 && <div style={{ color:"#64748b", fontSize:14, padding:20 }}>Nessun post trovato</div>}
        {filtered.map(p => {
          const sc = STATUS_COLORS[p.status] || STATUS_COLORS["Bozza"];
          const cl = clients.find(c=>c.id===p.clientId);
          return (
            <div key={p.id} style={{ background:"#1e293b", borderRadius:10, padding:"14px 18px",
              border:"1px solid #334155", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
              onClick={()=>canEdit?setEditPost(p):null}>
              {cl && <div style={{ width:10, height:36, borderRadius:3, background:cl.color, flexShrink:0 }} />}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, color:"#f1f5f9", fontSize:14, marginBottom:2 }}>{p.title||"Post senza titolo"}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>{p.clientName} · {fmtDate(p.date)} · {p.platform}</div>
              </div>
              <span style={{ fontSize:12, background:sc.bg+"33", color:sc.bg, padding:"4px 10px", borderRadius:20, flexShrink:0 }}>{p.status}</span>
              {canEdit && <button onClick={e=>{e.stopPropagation();setPosts(ps=>ps.filter(x=>x.id!==p.id));}}
                style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:15 }}>🗑</button>}
            </div>
          );
        })}
      </div>

      {(editPost || newPost) && (
        <PostModal
          post={editPost||undefined}
          defaultDate={today()}
          clients={clients}
          memory={memory}
          addMemory={addMemory}
          onSave={p => {
            if (editPost) setPosts(ps => ps.map(x=>x.id===p.id?p:x));
            else setPosts(ps=>[...ps,{...p,id:genId()}]);
            setEditPost(null); setNewPost(false);
          }}
          onDelete={id=>{setPosts(ps=>ps.filter(x=>x.id!==id));setEditPost(null);}}
          onClose={()=>{setEditPost(null);setNewPost(false);}}
        />
      )}
    </div>
  );
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
function ClientsSection({ clients, setClients, posts, lbl, setLbl }) {
  const [editing, setEditing] = useState(null);
  const [newClient, setNewClient] = useState(false);
  const [renaming, setRenaming] = useState(null);

  function addClient(c) {
    setClients(cs => [...cs, { ...c, id:genId() }]);
    setNewClient(false);
  }
  function updateClient(c) {
    setClients(cs => cs.map(x => x.id===c.id ? c : x));
    setEditing(null);
  }
  function deleteClient(id) {
    if (confirm("Eliminare questo cliente?")) setClients(cs => cs.filter(x=>x.id!==id));
  }

  return (
    <div style={{ padding:32 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:"#f1f5f9", margin:0 }}>{lbl("clients_title","Clienti")}</h1>
        <button onClick={()=>setNewClient(true)} style={{...btn, background:"#6366f1", color:"#fff", fontSize:14}}>+ Nuovo Cliente</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {clients.map(c => {
          const clientPosts = posts.filter(p => p.clientId === c.id);
          return (
            <div key={c.id} style={{ background:"#1e293b", borderRadius:12, border:`2px solid ${c.color||"#334155"}`, overflow:"hidden" }}>
              <div style={{ height:6, background:c.color||"#334155" }} />
              <div style={{ padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:17 }}>{c.name}</div>
                    {c.platform && <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{c.platform}</div>}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>setEditing(c)} style={{...smallBtn, background:"#334155", color:"#e2e8f0"}}>✏️</button>
                    <button onClick={()=>deleteClient(c.id)} style={{...smallBtn, background:"#7f1d1d", color:"#fca5a5"}}>🗑</button>
                  </div>
                </div>

                {c.scheduleDays && c.scheduleDays.length > 0 && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, color:"#64748b", marginBottom:5 }}>Giorni di uscita:</div>
                    <div style={{ display:"flex", gap:4 }}>
                      {DAYS_IT.map((d,i) => (
                        <div key={i} style={{ width:26, height:26, borderRadius:6, fontSize:10, fontWeight:600,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          background: c.scheduleDays.includes(i) ? c.color+"44" : "#0f172a",
                          color: c.scheduleDays.includes(i) ? c.color : "#475569",
                          border: c.scheduleDays.includes(i) ? `1px solid ${c.color}` : "1px solid #334155" }}>
                          {d[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display:"flex", gap:8, fontSize:12 }}>
                  {POST_STATUSES.slice(0,4).map(s => {
                    const cnt = clientPosts.filter(p=>p.status===s).length;
                    const sc = STATUS_COLORS[s];
                    return cnt > 0 ? (
                      <div key={s} style={{ background:sc.bg+"22", color:sc.bg, padding:"2px 8px", borderRadius:20 }}>
                        {cnt} {s}
                      </div>
                    ) : null;
                  })}
                  {clientPosts.length === 0 && <span style={{ color:"#475569" }}>Nessun post</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(newClient || editing) && (
        <ClientModal
          client={editing}
          onSave={editing ? updateClient : addClient}
          onClose={()=>{setEditing(null);setNewClient(false);}}
        />
      )}
    </div>
  );
}

const smallBtn = { padding:"5px 8px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12 };

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || { name:"", platform:"", color:PALETTE[0], scheduleDays:[], notes:"" });
  function upd(k,v) { setForm(f=>({...f,[k]:v})); }
  function toggleDay(d) {
    setForm(f => ({ ...f, scheduleDays: f.scheduleDays?.includes(d)
      ? f.scheduleDays.filter(x=>x!==d)
      : [...(f.scheduleDays||[]),d] }));
  }
  return (
    <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#1e293b", borderRadius:16, width:"100%", maxWidth:500, border:"1px solid #334155" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #334155", display:"flex", justifyContent:"space-between" }}>
          <h3 style={{ margin:0, color:"#f1f5f9" }}>{client ? "Modifica Cliente" : "Nuovo Cliente"}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        <div style={{ padding:24, display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="Nome Cliente">
            <input value={form.name} onChange={e=>upd("name",e.target.value)} style={input} placeholder="es. Gymmi's" />
          </Field>
          <Field label="Piattaforme">
            <input value={form.platform} onChange={e=>upd("platform",e.target.value)} style={input} placeholder="Instagram, Facebook..." />
          </Field>
          <Field label="Colore">
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {PALETTE.map(c => (
                <button key={c} onClick={()=>upd("color",c)}
                  style={{ width:26, height:26, borderRadius:6, background:c, border:form.color===c?"3px solid #fff":"2px solid transparent", cursor:"pointer" }} />
              ))}
            </div>
            <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:20, height:20, borderRadius:4, background:form.color }} />
              <span style={{ fontSize:12, color:"#94a3b8" }}>Colore selezionato: {form.color}</span>
            </div>
          </Field>
          <Field label="Giorni di uscita contenuto">
            <div style={{ display:"flex", gap:6 }}>
              {DAYS_IT.map((d,i) => (
                <button key={i} onClick={()=>toggleDay(i)}
                  style={{ width:36, height:36, borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", border:"none",
                    background: form.scheduleDays?.includes(i) ? form.color : "#0f172a",
                    color: form.scheduleDays?.includes(i) ? "#fff" : "#64748b" }}>
                  {d}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Note">
            <textarea value={form.notes} onChange={e=>upd("notes",e.target.value)} style={{...input, minHeight:60, resize:"vertical"}} placeholder="Note sul cliente..." />
          </Field>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{...btn, background:"#334155", color:"#94a3b8"}}>Annulla</button>
            <button onClick={()=>onSave(form)} style={{...btn, background:"#6366f1", color:"#fff"}} disabled={!form.name}>Salva</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function Settings({ users, setUsers, lbl, setLbl, currentUser }) {
  const [tab, setTab] = useState("users");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviteName, setInviteName] = useState("");
  const [invitePw, setInvitePw] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [editingLabel, setEditingLabel] = useState(null);

  const labelKeys = [
    ["app_name","Nome App","📣 SocialCal"],
    ["nav_dashboard","Dashboard","Dashboard"],
    ["nav_calendar","Calendario","Calendario"],
    ["nav_posts","Post","Post"],
    ["nav_clients","Clienti","Clienti"],
    ["nav_settings","Impostazioni","Impostazioni"],
    ["dash_title","Titolo Dashboard","Dashboard"],
    ["cal_title","Titolo Calendario","Calendario Editoriale"],
    ["posts_title","Titolo Post","Post"],
    ["clients_title","Titolo Clienti","Clienti"],
  ];

  function inviteUser() {
    if (!inviteEmail || !inviteName || !invitePw) { setInviteMsg("Compila tutti i campi"); return; }
    if (users.find(u=>u.email===inviteEmail)) { setInviteMsg("Email già registrata"); return; }
    const newUser = { id:genId(), name:inviteName, email:inviteEmail, password:invitePw, role:inviteRole, avatar:inviteName[0].toUpperCase() };
    setUsers(us => [...us, newUser]);
    setInviteMsg("Utente aggiunto! (Invita via mail: " + inviteEmail + ")");
    setInviteEmail(""); setInviteName(""); setInvitePw("");
  }

  function deleteUser(id) {
    if (id === currentUser) return;
    if (confirm("Eliminare questo utente?")) setUsers(us => us.filter(u=>u.id!==id));
  }

  const tabs = [
    { id:"users", label:"Utenti" },
    { id:"labels", label:"Rinomina Etichette" },
  ];

  return (
    <div style={{ padding:32 }}>
      <h1 style={{ fontSize:24, fontWeight:700, color:"#f1f5f9", marginBottom:24 }}>Impostazioni</h1>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{...btn, background:tab===t.id?"#6366f1":"#1e293b", color:tab===t.id?"#fff":"#94a3b8", border:"1px solid #334155"}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {/* Users list */}
          <div>
            <h3 style={{ color:"#f1f5f9", marginBottom:16, fontSize:16 }}>Utenti Registrati</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {users.map(u => (
                <div key={u.id} style={{ background:"#1e293b", borderRadius:10, padding:"14px 16px",
                  border:"1px solid #334155", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background:"#6366f1",
                    display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#fff", fontSize:14 }}>
                    {u.avatar||u.name[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:"#f1f5f9", fontSize:14 }}>{u.name}</div>
                    <div style={{ fontSize:12, color:"#64748b" }}>{u.email}</div>
                  </div>
                  <RoleBadge role={u.role} />
                  {u.id !== currentUser && (
                    <button onClick={()=>deleteUser(u.id)} style={{...smallBtn, background:"#7f1d1d", color:"#fca5a5"}}>🗑</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Invite */}
          <div>
            <h3 style={{ color:"#f1f5f9", marginBottom:16, fontSize:16 }}>Invita Utente</h3>
            <div style={{ background:"#1e293b", borderRadius:12, padding:20, border:"1px solid #334155", display:"flex", flexDirection:"column", gap:12 }}>
              {inviteMsg && <div style={{ background:"#064e3b", color:"#6ee7b7", padding:"8px 12px", borderRadius:8, fontSize:13 }}>{inviteMsg}</div>}
              <Field label="Nome"><input value={inviteName} onChange={e=>setInviteName(e.target.value)} style={input} placeholder="Nome utente" /></Field>
              <Field label="Email"><input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} style={input} placeholder="email@esempio.com" /></Field>
              <Field label="Password temporanea"><input value={invitePw} onChange={e=>setInvitePw(e.target.value)} style={input} placeholder="Password" /></Field>
              <Field label="Ruolo">
                <select value={inviteRole} onChange={e=>setInviteRole(e.target.value)} style={input}>
                  <option value="editor">Editor (può creare/modificare)</option>
                  <option value="viewer">Viewer (solo lettura)</option>
                </select>
              </Field>
              <button onClick={inviteUser} style={{...btn, background:"#6366f1", color:"#fff"}}>Invita Utente</button>
              <div style={{ fontSize:11, color:"#475569" }}>⚠️ Solo l'admin può invitare utenti. L'invito via email è simulato — invia la password manualmente all'utente.</div>
            </div>
          </div>
        </div>
      )}

      {tab === "labels" && (
        <div style={{ background:"#1e293b", borderRadius:12, padding:24, border:"1px solid #334155", maxWidth:600 }}>
          <h3 style={{ color:"#f1f5f9", marginBottom:16, fontSize:16 }}>Rinomina Etichette</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {labelKeys.map(([key, desc, def]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:160, fontSize:12, color:"#64748b" }}>{desc}</div>
                {editingLabel === key ? (
                  <div style={{ display:"flex", gap:6, flex:1 }}>
                    <input defaultValue={lbl(key,def)} autoFocus style={{...input, flex:1}}
                      id={`lbl_${key}`} onKeyDown={e=>{ if(e.key==="Enter") { setLbl(key,e.target.value); setEditingLabel(null); }}} />
                    <button onClick={()=>{ const el=document.getElementById(`lbl_${key}`); setLbl(key,el.value); setEditingLabel(null); }}
                      style={{...smallBtn, background:"#6366f1", color:"#fff"}}>✓</button>
                    <button onClick={()=>setEditingLabel(null)} style={{...smallBtn, background:"#334155", color:"#94a3b8"}}>✕</button>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
                    <span style={{ fontSize:14, color:"#e2e8f0" }}>{lbl(key,def)}</span>
                    <button onClick={()=>setEditingLabel(key)} style={{...smallBtn, background:"#334155", color:"#94a3b8"}}>✏️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  const map = { admin:["#f59e0b","#78350f","Amministratore"], editor:["#6366f1","#312e81","Editor"], viewer:["#64748b","#1e293b","Viewer"] };
  const [bg,,label] = map[role]||map.viewer;
  return <span style={{ fontSize:11, background:bg+"33", color:bg, padding:"2px 10px", borderRadius:20, flexShrink:0 }}>{label}</span>;
}
