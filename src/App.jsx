import { useState, useEffect, useRef } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#f8f7f4; --surface:#ffffff; --surface2:#f1f0ec; --border:#e8e6e0; --border2:#d4d0c8;
    --text:#1a1814; --text2:#6b6760; --text3:#9b9891;
    --accent:#2d6a4f; --accent2:#40916c; --accentbg:#d8f3dc;
    --danger:#c1121f; --dangerbg:#ffe5e5; --warn:#e07c24; --warnbg:#fff3e0;
    --shadow:0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.06);
    --shadow2:0 2px 8px rgba(0,0,0,.08),0 8px 32px rgba(0,0,0,.08);
    --radius:12px; --radius2:8px; --font:'Outfit',system-ui,sans-serif;
    --transition:all .18s cubic-bezier(.4,0,.2,1);
  }
  body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;}
  input,select,textarea,button{font-family:var(--font);}
  ::-webkit-scrollbar{width:6px;height:6px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px;}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;border-radius:var(--radius2);border:none;cursor:pointer;font-size:13.5px;font-weight:600;font-family:var(--font);transition:var(--transition);user-select:none;white-space:nowrap;}
  .btn:active{transform:scale(.97);}
  .btn-primary{background:var(--accent);color:#fff;}
  .btn-primary:hover{background:var(--accent2);box-shadow:0 4px 12px rgba(45,106,79,.3);transform:translateY(-1px);}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .btn-ghost{background:transparent;color:var(--text2);border:1.5px solid var(--border);}
  .btn-ghost:hover{background:var(--surface2);border-color:var(--border2);color:var(--text);}
  .btn-danger{background:var(--dangerbg);color:var(--danger);border:1.5px solid #ffc5c5;}
  .btn-danger:hover{background:var(--danger);color:#fff;}
  .btn-sm{padding:6px 12px;font-size:12px;border-radius:7px;}
  .btn-icon{padding:7px;border-radius:8px;width:32px;height:32px;}
  .input{width:100%;padding:10px 13px;border-radius:var(--radius2);background:var(--surface);border:1.5px solid var(--border);color:var(--text);font-size:14px;font-family:var(--font);transition:var(--transition);outline:none;}
  .input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(45,106,79,.12);}
  .input::placeholder{color:var(--text3);}
  .card{background:var(--surface);border-radius:var(--radius);border:1.5px solid var(--border);box-shadow:var(--shadow);}
  .nav-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 16px;border:none;cursor:pointer;font-size:13.5px;font-weight:500;font-family:var(--font);border-radius:var(--radius2);transition:var(--transition);background:transparent;color:var(--text2);text-align:left;}
  .nav-item:hover{background:var(--surface2);color:var(--text);}
  .nav-item.active{background:var(--accentbg);color:var(--accent);font-weight:600;}
  .stat-card{background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius);padding:20px 22px;cursor:pointer;transition:var(--transition);box-shadow:var(--shadow);}
  .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow2);border-color:var(--border2);}
  .stat-card.active{border-color:var(--accent);box-shadow:0 0 0 3px rgba(45,106,79,.1);}
  .post-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:var(--radius2);background:var(--surface);border:1.5px solid var(--border);transition:var(--transition);cursor:pointer;}
  .post-row:hover{border-color:var(--border2);box-shadow:var(--shadow);transform:translateX(2px);}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal{background:var(--surface);border-radius:16px;border:1.5px solid var(--border);box-shadow:var(--shadow2);width:100%;max-width:580px;max-height:90vh;overflow-y:auto;animation:slideUp .22s cubic-bezier(.4,0,.2,1);}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  .cal-cell{background:var(--surface);min-height:96px;padding:6px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);cursor:pointer;transition:background .12s;}
  .cal-cell:hover{background:var(--surface2);}
  .cal-cell.today{background:#f0faf4;}
  .cal-tag{font-size:10.5px;padding:2px 6px;border-radius:5px;margin-bottom:2px;cursor:pointer;transition:var(--transition);display:flex;align-items:center;gap:3px;white-space:nowrap;overflow:hidden;}
  .cal-tag:hover{filter:brightness(.92);transform:scale(1.02);}
  .tooltip{position:fixed;z-index:9999;pointer-events:none;background:var(--text);color:#fff;border-radius:10px;padding:10px 14px;font-size:12.5px;max-width:240px;box-shadow:0 8px 32px rgba(0,0,0,.2);animation:fadeIn .12s ease;}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  .pill-tabs{display:flex;background:var(--surface2);border-radius:9px;padding:3px;gap:2px;border:1.5px solid var(--border);}
  .pill-tab{padding:6px 16px;border-radius:7px;border:none;cursor:pointer;font-size:13px;font-weight:500;font-family:var(--font);transition:var(--transition);background:transparent;color:var(--text2);}
  .pill-tab.active{background:var(--surface);color:var(--text);box-shadow:var(--shadow);font-weight:600;}
  .pill-tab:hover:not(.active){color:var(--text);}
  .chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11.5px;font-weight:600;border:1.5px solid transparent;}
  .label{font-size:12px;font-weight:600;color:var(--text2);margin-bottom:5px;display:block;letter-spacing:.02em;}
  .field{display:flex;flex-direction:column;}
  .empty-state{text-align:center;padding:48px 20px;color:var(--text3);}
  .empty-state .icon{font-size:40px;margin-bottom:12px;}
  .empty-state p{font-size:14px;}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;}
  .page-title{font-size:22px;font-weight:700;color:var(--text);}
`;

const PLATFORMS = ["Instagram","Facebook","TikTok","Tutte"];
const POST_STATUSES = ["Bozza","In Revisione","Da Editare","Pronto","Programmato","Pubblicato"];
const STATUS_COLORS = {
  "Bozza":        {bg:"#94a3b8",light:"#f1f5f9",text:"#475569"},
  "In Revisione": {bg:"#f59e0b",light:"#fffbeb",text:"#92400e"},
  "Da Editare":   {bg:"#ef4444",light:"#fef2f2",text:"#991b1b"},
  "Pronto":       {bg:"#22c55e",light:"#f0fdf4",text:"#166534"},
  "Programmato":  {bg:"#6366f1",light:"#eef2ff",text:"#3730a3"},
  "Pubblicato":   {bg:"#0ea5e9",light:"#f0f9ff",text:"#075985"},
};
const PALETTE=["#e74c3c","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#607d8b","#f06292","#ba68c8","#81d4fa","#80cbc4","#a5d6a7","#ffcc02","#ff7043","#26c6da","#66bb6a","#ab47bc","#5c6bc0","#ec407a"];
const DAYS_IT=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
const MONTHS_IT=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const PICONS={"Instagram":"📸","Facebook":"👤","TikTok":"🎵","Tutte":"🌐"};

function genId(){return"id_"+Math.random().toString(36).slice(2,9);}
function fmtDate(d){if(!d)return"";const dt=typeof d==="string"?new Date(d+"T00:00:00"):d;return`${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()}`;}
function isoDate(y,m,d){return`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function today(){const n=new Date();return isoDate(n.getFullYear(),n.getMonth(),n.getDate());}
function useLS(key,init){const[v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init;}catch{return init;}});useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v));}catch{}},[key,v]);return[v,setV];}

export default function App(){
  useEffect(()=>{const s=document.createElement("style");s.textContent=G;document.head.appendChild(s);return()=>document.head.removeChild(s);},[]);
  const[users,setUsers]=useLS("scm_users",[]);
  const[clients,setClients]=useLS("scm_clients",[]);
  const[posts,setPosts]=useLS("scm_posts",[]);
  const[currentUser,setCurrentUser]=useLS("scm_current",null);
  const[labels,setLabels]=useLS("scm_labels",{});
  const[memory,setMemory]=useLS("scm_memory",{captions:[],hashtags:[],firstComments:[]});
  const[section,setSection]=useState("dashboard");
  const user=users.find(u=>u.id===currentUser);
  const isAdmin=user?.role==="admin";
  function lbl(key,fb){return labels[key]??fb;}
  function setLbl(key,val){setLabels(l=>({...l,[key]:val}));}
  function addMemory(type,val){if(!val?.trim())return;setMemory(m=>({...m,[type]:[...new Set([val,...(m[type]||[])])].slice(0,30)}));}
  if(users.length===0)return <SetupAdmin onDone={u=>{setUsers([u]);setCurrentUser(u.id);}}/>;
  if(!user)return <Login users={users} onLogin={id=>setCurrentUser(id)}/>;
  const nav=[
    {id:"dashboard",icon:"⊞",label:lbl("nav_dashboard","Dashboard")},
    {id:"calendar",icon:"📅",label:lbl("nav_calendar","Calendario")},
    {id:"posts",icon:"✏️",label:lbl("nav_posts","Post")},
    {id:"clients",icon:"👥",label:lbl("nav_clients","Clienti")},
    ...(isAdmin?[{id:"settings",icon:"⚙️",label:lbl("nav_settings","Impostazioni")}]:[]),
  ];
  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      <aside style={{width:220,flexShrink:0,background:"#fff",borderRight:"1.5px solid var(--border)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <div style={{padding:"22px 20px 16px",borderBottom:"1.5px solid var(--border)"}}>
          <div style={{fontSize:18,fontWeight:700,color:"var(--text)",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:22}}>📣</span>{lbl("app_name","SocialCal")}
          </div>
          <div style={{fontSize:11,color:"var(--text3)",marginTop:2,fontWeight:500}}>Editorial Manager</div>
        </div>
        <nav style={{flex:1,padding:"12px 10px"}}>
          {nav.map(n=>(
            <button key={n.id} className={"nav-item"+(section===n.id?" active":"")} onClick={()=>setSection(n.id)}>
              <span style={{fontSize:15}}>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 16px",borderTop:"1.5px solid var(--border)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--accent)",fontSize:13,flexShrink:0}}>{user.name?.[0]?.toUpperCase()}</div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>{isAdmin?"Admin":user.role}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:12}} onClick={()=>setCurrentUser(null)}>Esci</button>
        </div>
      </aside>
      <main style={{flex:1,overflowY:"auto",background:"var(--bg)"}}>
        {section==="dashboard"&&<Dashboard posts={posts} clients={clients} setPosts={setPosts} setSection={setSection} lbl={lbl}/>}
        {section==="calendar"&&<CalendarView posts={posts} setPosts={setPosts} clients={clients} lbl={lbl} memory={memory} addMemory={addMemory}/>}
        {section==="posts"&&<PostsSection posts={posts} setPosts={setPosts} clients={clients} lbl={lbl} memory={memory} addMemory={addMemory} user={user}/>}
        {section==="clients"&&<ClientsSection clients={clients} setClients={setClients} posts={posts} lbl={lbl}/>}
        {section==="settings"&&isAdmin&&<Settings users={users} setUsers={setUsers} lbl={lbl} setLbl={setLbl} currentUser={currentUser}/>}
      </main>
    </div>
  );
}

function SetupAdmin({onDone}){
  const[name,setName]=useState("");const[email,setEmail]=useState("");
  const[pw,setPw]=useState("");const[pw2,setPw2]=useState("");const[err,setErr]=useState("");
  function submit(){
    if(!name||!email||!pw)return setErr("Compila tutti i campi");
    if(pw!==pw2)return setErr("Le password non coincidono");
    if(pw.length<6)return setErr("La password deve avere almeno 6 caratteri");
    onDone({id:genId(),name,email,password:pw,role:"admin",avatar:name[0].toUpperCase()});
  }
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:12}}>📣</div>
          <h1 style={{fontSize:26,fontWeight:700,color:"var(--text)"}}>Benvenuto in SocialCal</h1>
          <p style={{color:"var(--text2)",fontSize:14,marginTop:8}}>Crea il tuo account amministratore per iniziare</p>
        </div>
        <div className="card" style={{padding:28}}>
          <div style={{background:"var(--accentbg)",borderRadius:8,padding:"10px 14px",marginBottom:20,fontSize:13,color:"var(--accent)",fontWeight:500}}>
            🔐 Questo sarà l'unico account con privilegi di amministratore
          </div>
          {err&&<div style={{background:"var(--dangerbg)",color:"var(--danger)",padding:"9px 13px",borderRadius:8,fontSize:13,marginBottom:16,fontWeight:500}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="field"><label className="label">Nome completo</label><input className="input" placeholder="es. Giuseppe Rossi" value={name} onChange={e=>setName(e.target.value)}/></div>
            <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="tuaemail@esempio.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
            <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="Minimo 6 caratteri" value={pw} onChange={e=>setPw(e.target.value)}/></div>
            <div className="field"><label className="label">Conferma Password</label><input className="input" type="password" placeholder="Ripeti la password" value={pw2} onChange={e=>setPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
            <button className="btn btn-primary" style={{width:"100%",padding:"12px",marginTop:4,fontSize:15}} onClick={submit}>Crea Account e Inizia →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Login({users,onLogin}){
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");
  function login(){const u=users.find(u=>u.email===email&&u.password===pw);if(u)onLogin(u.id);else setErr("Email o password non corretti");}
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:10}}>📣</div>
          <h1 style={{fontSize:24,fontWeight:700,color:"var(--text)"}}>SocialCal</h1>
          <p style={{color:"var(--text2)",fontSize:14,marginTop:6}}>Accedi per continuare</p>
        </div>
        <div className="card" style={{padding:26}}>
          {err&&<div style={{background:"var(--dangerbg)",color:"var(--danger)",padding:"9px 13px",borderRadius:8,fontSize:13,marginBottom:14,fontWeight:500}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="tuaemail@esempio.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
            <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
            <button className="btn btn-primary" style={{width:"100%",padding:"12px",marginTop:2,fontSize:15}} onClick={login}>Accedi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({posts,clients,setPosts,setSection,lbl}){
  const now=new Date();
  const mk=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const thisMonth=posts.filter(p=>p.date?.startsWith(mk));
  const byStatus=s=>posts.filter(p=>p.status===s);
  const inProgress=[...byStatus("In Revisione"),...byStatus("Da Editare"),...byStatus("Bozza")];
  const upcoming=posts.filter(p=>p.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,10);
  const[filter,setFilter]=useState(null);
  const filtered=filter==="thisMonth"?thisMonth:filter==="clients"?posts:filter==="scheduled"?byStatus("Programmato"):filter==="inprogress"?inProgress:filter?byStatus(filter):null;
  const stats=[
    {key:"clients",icon:"👥",label:"Clienti Attivi",value:clients.length,color:"#6366f1"},
    {key:"thisMonth",icon:"📊",label:"Post Questo Mese",value:thisMonth.length,color:"var(--accent)"},
    {key:"scheduled",icon:"🗓️",label:"Da Pubblicare",value:byStatus("Programmato").length,color:"var(--warn)"},
    {key:"inprogress",icon:"⚙️",label:"In Lavorazione",value:inProgress.length,color:"var(--danger)"},
  ];
  return(
    <div style={{padding:"28px 32px",maxWidth:1200}}>
      <div className="section-header">
        <h1 className="page-title">{lbl("dash_title","Dashboard")}</h1>
        <div style={{fontSize:13,color:"var(--text3)"}}>{DAYS_IT[now.getDay()]}, {fmtDate(today())}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {stats.map(s=>(
          <div key={s.key} className={"stat-card"+(filter===s.key?" active":"")} onClick={()=>setFilter(filter===s.key?null:s.key)}>
            <div style={{fontSize:22,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:30,fontWeight:700,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:12.5,color:"var(--text2)",marginTop:5,fontWeight:500}}>{s.label}</div>
          </div>
        ))}
      </div>
      {filtered&&(
        <div className="card" style={{padding:20,marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:15}}>
              {filter==="clients"?"Tutti i Post":filter==="thisMonth"?"Post questo mese":filter==="scheduled"?"Post programmati":filter==="inprogress"?"In lavorazione":`Stato: ${filter}`}
              <span style={{marginLeft:8,fontSize:12,color:"var(--text3)",fontWeight:400}}>({filtered.length})</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setFilter(null)}>✕ Chiudi</button>
          </div>
          {filtered.length===0?<div className="empty-state"><div className="icon">📭</div><p>Nessun post trovato</p></div>:
            <div style={{display:"flex",flexDirection:"column",gap:6}}>{filtered.map(p=><PostRowComp key={p.id} post={p} clients={clients} setPosts={setPosts}/>)}</div>}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div className="card" style={{padding:20}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:14}}>Stato Post</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {POST_STATUSES.map(s=>{
              const cnt=byStatus(s).length;const sc=STATUS_COLORS[s];
              return(
                <button key={s} onClick={()=>setFilter(filter===s?null:s)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,border:"1.5px solid",borderColor:filter===s?sc.bg:"transparent",background:filter===s?sc.light:"var(--surface2)",cursor:"pointer",transition:"var(--transition)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:sc.bg}}/>
                    <span style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{s}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:sc.bg}}>{cnt}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:14}}>Prossimi Post</div>
          {upcoming.length===0?<div className="empty-state"><div className="icon">📅</div><p>Nessun post in programma</p></div>:
            <div style={{display:"flex",flexDirection:"column",gap:6}}>{upcoming.map(p=><PostRowComp key={p.id} post={p} clients={clients} setPosts={setPosts} compact/>)}</div>}
        </div>
      </div>
    </div>
  );
}

function PostRowComp({post,clients,setPosts,compact}){
  const sc=STATUS_COLORS[post.status]||STATUS_COLORS["Bozza"];
  const cl=clients?.find(c=>c.id===post.clientId);
  return(
    <div className="post-row">
      {cl&&<div style={{width:4,height:32,borderRadius:3,background:cl.color,flexShrink:0}}/>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13.5,fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.title||"Post senza titolo"}</div>
        <div style={{fontSize:11.5,color:"var(--text3)",marginTop:1}}>{compact?fmtDate(post.date):`${post.clientName||"—"} · ${fmtDate(post.date)} · ${post.platform||"—"}`}</div>
      </div>
      <span className="chip" style={{background:sc.light,color:sc.text,borderColor:sc.bg+"44",flexShrink:0}}>{post.status}</span>
      <button className="btn btn-icon btn-danger" style={{flexShrink:0,opacity:.7}} onClick={e=>{e.stopPropagation();setPosts(ps=>ps.filter(x=>x.id!==post.id));}}>🗑</button>
    </div>
  );
}

function CalendarView({posts,setPosts,clients,lbl,memory,addMemory}){
  const[view,setView]=useState("month");
  const[year,setYear]=useState(new Date().getFullYear());
  const[month,setMonth]=useState(new Date().getMonth());
  const[weekStart,setWeekStart]=useState(()=>{const d=new Date();d.setDate(d.getDate()-d.getDay());return d;});
  const[editPost,setEditPost]=useState(null);
  const[newPostDate,setNewPostDate]=useState(null);
  const[tooltip,setTooltip]=useState(null);
  function prev(){if(view==="month"){month===0?(setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1);}else{const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d);}}
  function next(){if(view==="month"){month===11?(setMonth(0),setYear(y=>y+1)):setMonth(m=>m+1);}else{const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d);}}
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const cells=[...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d;});
  function postsFor(ds){return posts.filter(p=>p.date===ds);}
  function slotsFor(ds){const d=new Date(ds+"T00:00:00"),dow=d.getDay();return clients.filter(c=>c.scheduleDays?.includes(dow)&&!posts.find(p=>p.date===ds&&p.clientId===c.id));}
  const periodLabel=view==="month"?`${MONTHS_IT[month]} ${year}`:`${fmtDate(weekDays[0])} – ${fmtDate(weekDays[6])}`;

  function CalTag({p,onClick}){
    const sc=STATUS_COLORS[p.status]||STATUS_COLORS["Bozza"];
    const cl=clients.find(c=>c.id===p.clientId);
    return(
      <div className="cal-tag" style={{background:sc.light,borderLeft:`3px solid ${sc.bg}`,color:"var(--text)"}} onClick={e=>{e.stopPropagation();onClick();}} onMouseEnter={e=>setTooltip({post:p,x:e.clientX,y:e.clientY})} onMouseLeave={()=>setTooltip(null)}>
        {cl&&<div style={{width:6,height:6,borderRadius:"50%",background:cl.color,flexShrink:0}}/>}
        <span style={{overflow:"hidden",textOverflow:"ellipsis",flex:1,fontWeight:500}}>{p.title||"Post"}</span>
        <div style={{width:5,height:5,borderRadius:"50%",background:sc.bg,flexShrink:0}}/>
      </div>
    );
  }
  function SlotTag({c,onClick}){
    return(
      <div className="cal-tag" style={{background:c.color+"18",border:`1px dashed ${c.color}`,color:c.color}} onClick={e=>{e.stopPropagation();onClick();}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:c.color,flexShrink:0}}/>
        <span style={{overflow:"hidden",textOverflow:"ellipsis",flex:1,fontWeight:500}}>{c.name}</span>
      </div>
    );
  }

  return(
    <div style={{padding:"28px 32px"}}>
      <div className="section-header">
        <h1 className="page-title">{lbl("cal_title","Calendario Editoriale")}</h1>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div className="pill-tabs">
            <button className={"pill-tab"+(view==="month"?" active":"")} onClick={()=>setView("month")}>Mese</button>
            <button className={"pill-tab"+(view==="week"?" active":"")} onClick={()=>setView("week")}>Settimana</button>
          </div>
          <button className="btn btn-ghost btn-sm" style={{fontSize:16,padding:"6px 12px"}} onClick={prev}>‹</button>
          <span style={{fontSize:14,fontWeight:600,minWidth:180,textAlign:"center",color:"var(--text)"}}>{periodLabel}</span>
          <button className="btn btn-ghost btn-sm" style={{fontSize:16,padding:"6px 12px"}} onClick={next}>›</button>
        </div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16,alignItems:"center"}}>
        <span style={{fontSize:11.5,color:"var(--text3)",fontWeight:600,marginRight:4}}>LEGENDA:</span>
        {Object.entries(STATUS_COLORS).map(([s,sc])=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:2,background:sc.bg}}/>
            <span style={{fontSize:11.5,color:"var(--text2)",fontWeight:500}}>{s}</span>
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:8,height:8,borderRadius:2,background:"var(--border2)",border:"1px dashed var(--text3)"}}/>
          <span style={{fontSize:11.5,color:"var(--text2)",fontWeight:500}}>Slot pianificato</span>
        </div>
      </div>
      <div className="card" style={{overflow:"hidden",padding:0}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"var(--surface2)",borderBottom:"1.5px solid var(--border)"}}>
          {DAYS_IT.map(d=><div key={d} style={{padding:"9px 0",textAlign:"center",fontSize:12,fontWeight:600,color:"var(--text3)",letterSpacing:".04em"}}>{d}</div>)}
        </div>
        {view==="month"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {cells.map((day,i)=>{
              if(!day)return <div key={i} style={{background:"var(--surface2)",minHeight:96,borderRight:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}/>;
              const ds=isoDate(year,month,day);
              const dayPosts=postsFor(ds);const slots=slotsFor(ds);const isToday=ds===today();
              return(
                <div key={i} className={"cal-cell"+(isToday?" today":"")} onClick={()=>setNewPostDate(ds)}>
                  <div style={{fontSize:12,fontWeight:isToday?700:400,color:isToday?"var(--accent)":"var(--text3)",marginBottom:4}}>
                    {isToday?<span style={{background:"var(--accent)",color:"#fff",borderRadius:"50%",width:19,height:19,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{day}</span>:day}
                  </div>
                  {slots.map(c=><SlotTag key={c.id} c={c} onClick={()=>setNewPostDate(ds)}/>)}
                  {dayPosts.map(p=><CalTag key={p.id} p={p} onClick={()=>setEditPost(p)}/>)}
                </div>
              );
            })}
          </div>
        )}
        {view==="week"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {weekDays.map((d,i)=>{
              const ds=isoDate(d.getFullYear(),d.getMonth(),d.getDate());
              const dayPosts=postsFor(ds);const slots=slotsFor(ds);const isToday=ds===today();
              return(
                <div key={i} className={"cal-cell"+(isToday?" today":"")} style={{minHeight:200}} onClick={()=>setNewPostDate(ds)}>
                  <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:2}}>{DAYS_IT[d.getDay()]}</div>
                  <div style={{fontSize:18,fontWeight:isToday?700:500,color:isToday?"var(--accent)":"var(--text)",marginBottom:8}}>{d.getDate()}</div>
                  {slots.map(c=><SlotTag key={c.id} c={c} onClick={()=>setNewPostDate(ds)}/>)}
                  {dayPosts.map(p=><CalTag key={p.id} p={p} onClick={()=>setEditPost(p)}/>)}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {tooltip&&(
        <div className="tooltip" style={{left:tooltip.x+14,top:tooltip.y+14}}>
          <div style={{fontWeight:600,marginBottom:3}}>{tooltip.post.title||"Post senza titolo"}</div>
          <div style={{opacity:.8,fontSize:11.5}}>{tooltip.post.clientName} · {tooltip.post.platform}</div>
          <div style={{opacity:.8,fontSize:11.5}}>{fmtDate(tooltip.post.date)}</div>
          <div style={{marginTop:6}}><span style={{background:STATUS_COLORS[tooltip.post.status]?.bg,color:"#fff",padding:"2px 8px",borderRadius:99,fontSize:11,fontWeight:600}}>{tooltip.post.status}</span></div>
          {tooltip.post.caption&&<div style={{marginTop:6,opacity:.7,fontSize:11,borderTop:"1px solid rgba(255,255,255,.2)",paddingTop:6}}>{tooltip.post.caption.slice(0,70)}{tooltip.post.caption.length>70?"…":""}</div>}
        </div>
      )}
      {(editPost||newPostDate)&&(
        <PostModal post={editPost} defaultDate={newPostDate} clients={clients} memory={memory} addMemory={addMemory}
          onSave={p=>{if(editPost)setPosts(ps=>ps.map(x=>x.id===p.id?p:x));else setPosts(ps=>[...ps,{...p,id:genId()}]);setEditPost(null);setNewPostDate(null);}}
          onDelete={id=>{setPosts(ps=>ps.filter(x=>x.id!==id));setEditPost(null);}}
          onClose={()=>{setEditPost(null);setNewPostDate(null);}}/>
      )}
    </div>
  );
}

function PostModal({post,defaultDate,clients,memory,addMemory,onSave,onDelete,onClose}){
  const[form,setForm]=useState(post||{title:"",clientId:"",clientName:"",platform:"Instagram",date:defaultDate||today(),status:"Bozza",caption:"",hashtags:"",firstComment:"",notes:""});
  function upd(k,v){setForm(f=>({...f,[k]:v}));}
  function save(){
    const cl=clients.find(c=>c.id===form.clientId);
    if(form.caption)addMemory("captions",form.caption);
    if(form.hashtags)addMemory("hashtags",form.hashtags);
    if(form.firstComment)addMemory("firstComments",form.firstComment);
    onSave({...form,clientName:cl?.name||form.clientName});
  }
  const sc=STATUS_COLORS[form.status]||STATUS_COLORS["Bozza"];
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{padding:"18px 22px",borderBottom:"1.5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:16,color:"var(--text)"}}>{post?"Modifica Post":"Nuovo Post"}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{fontSize:16}}>✕</button>
        </div>
        <div style={{padding:22,display:"flex",flexDirection:"column",gap:15}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="field"><label className="label">Titolo</label><input className="input" value={form.title} onChange={e=>upd("title",e.target.value)} placeholder="Titolo del post"/></div>
            <div className="field"><label className="label">Cliente</label>
              <select className="input" value={form.clientId} onChange={e=>{const cl=clients.find(c=>c.id===e.target.value);upd("clientId",e.target.value);upd("clientName",cl?.name||"");}}>
                <option value="">Seleziona cliente</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <div className="field"><label className="label">Data</label><input className="input" type="date" value={form.date} onChange={e=>upd("date",e.target.value)}/></div>
            <div className="field"><label className="label">Piattaforma</label>
              <select className="input" value={form.platform} onChange={e=>upd("platform",e.target.value)}>
                {PLATFORMS.map(p=><option key={p}>{PICONS[p]} {p}</option>)}
              </select>
            </div>
            <div className="field"><label className="label">Stato</label>
              <select className="input" value={form.status} onChange={e=>upd("status",e.target.value)} style={{background:sc.light,color:sc.text,borderColor:sc.bg+"88"}}>
                {POST_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label className="label">Caption</label><SugInput value={form.caption} onChange={v=>upd("caption",v)} suggestions={memory.captions} placeholder="Testo del post..." multiline/></div>
          <div className="field"><label className="label">Hashtag</label><SugInput value={form.hashtags} onChange={v=>upd("hashtags",v)} suggestions={memory.hashtags} placeholder="#hashtag #esempio"/></div>
          <div className="field"><label className="label">Primo Commento</label><SugInput value={form.firstComment} onChange={v=>upd("firstComment",v)} suggestions={memory.firstComments} placeholder="Testo del primo commento..." multiline/></div>
          <div className="field"><label className="label">Note interne</label><textarea className="input" value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Note per il team..." style={{minHeight:56,resize:"vertical"}}/></div>
          <div style={{display:"flex",gap:8,justifyContent:"space-between",marginTop:4}}>
            {post&&<button className="btn btn-danger btn-sm" onClick={()=>onDelete(post.id)}>🗑 Elimina</button>}
            <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
              <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
              <button className="btn btn-primary" onClick={save}>Salva Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SugInput({value,onChange,suggestions,placeholder,multiline}){
  const[open,setOpen]=useState(false);
  const filtered=suggestions?.filter(s=>s!==value).slice(0,6)||[];
  const props={className:"input",value,placeholder,onChange:e=>onChange(e.target.value),onFocus:()=>setOpen(true),onBlur:()=>setTimeout(()=>setOpen(false),160)};
  return(
    <div style={{position:"relative"}}>
      {multiline?<textarea {...props} style={{minHeight:72,resize:"vertical"}}/>:<input {...props}/>}
      {open&&filtered.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:10,boxShadow:"var(--shadow2)",overflow:"hidden",marginTop:4}}>
          {filtered.map((s,i)=>(
            <div key={i} onMouseDown={()=>onChange(s)} style={{padding:"8px 12px",fontSize:12.5,color:"var(--text2)",cursor:"pointer",borderBottom:i<filtered.length-1?"1px solid var(--border)":"none",transition:"background .1s",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}
              onMouseEnter={e=>e.target.style.background="var(--surface2)"} onMouseLeave={e=>e.target.style.background="transparent"}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function PostsSection({posts,setPosts,clients,lbl,memory,addMemory,user}){
  const[editPost,setEditPost]=useState(null);const[newPost,setNewPost]=useState(false);
  const[filterStatus,setFilterStatus]=useState("");const[filterClient,setFilterClient]=useState("");const[search,setSearch]=useState("");
  const canEdit=user.role!=="viewer";
  const filtered=posts.filter(p=>(!filterStatus||p.status===filterStatus)&&(!filterClient||p.clientId===filterClient)&&(!search||p.title?.toLowerCase().includes(search.toLowerCase())||p.clientName?.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>a.date?.localeCompare(b.date));
  return(
    <div style={{padding:"28px 32px"}}>
      <div className="section-header">
        <h1 className="page-title">{lbl("posts_title","Post")}</h1>
        {canEdit&&<button className="btn btn-primary" onClick={()=>setNewPost(true)}>+ Nuovo Post</button>}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <input className="input" placeholder="🔍 Cerca..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:220}}/>
        <select className="input" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{maxWidth:180}}>
          <option value="">Tutti gli stati</option>
          {POST_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="input" value={filterClient} onChange={e=>setFilterClient(e.target.value)} style={{maxWidth:200}}>
          <option value="">Tutti i clienti</option>
          {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {(search||filterStatus||filterClient)&&<button className="btn btn-ghost btn-sm" onClick={()=>{setSearch("");setFilterStatus("");setFilterClient("");}}>✕ Reset</button>}
      </div>
      <div style={{fontSize:12.5,color:"var(--text3)",marginBottom:12,fontWeight:500}}>{filtered.length} post trovati</div>
      {filtered.length===0?<div className="empty-state card" style={{padding:48}}><div className="icon">✏️</div><p>Nessun post trovato</p></div>:
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {filtered.map(p=>{
            const sc=STATUS_COLORS[p.status]||STATUS_COLORS["Bozza"];const cl=clients.find(c=>c.id===p.clientId);
            return(
              <div key={p.id} className="post-row" onClick={()=>canEdit&&setEditPost(p)}>
                {cl&&<div style={{width:4,height:38,borderRadius:3,background:cl.color,flexShrink:0}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title||"Post senza titolo"}</div>
                  <div style={{fontSize:12,color:"var(--text3)",marginTop:1}}>{p.clientName||"—"} · {fmtDate(p.date)} · {PICONS[p.platform]} {p.platform}</div>
                </div>
                <span className="chip" style={{background:sc.light,color:sc.text,borderColor:sc.bg+"55"}}>{p.status}</span>
                {canEdit&&<button className="btn btn-icon btn-danger" style={{opacity:.65}} onClick={e=>{e.stopPropagation();setPosts(ps=>ps.filter(x=>x.id!==p.id));}}>🗑</button>}
              </div>
            );
          })}
        </div>
      }
      {(editPost||newPost)&&(
        <PostModal post={editPost||undefined} defaultDate={today()} clients={clients} memory={memory} addMemory={addMemory}
          onSave={p=>{if(editPost)setPosts(ps=>ps.map(x=>x.id===p.id?p:x));else setPosts(ps=>[...ps,{...p,id:genId()}]);setEditPost(null);setNewPost(false);}}
          onDelete={id=>{setPosts(ps=>ps.filter(x=>x.id!==id));setEditPost(null);}}
          onClose={()=>{setEditPost(null);setNewPost(false);}}/>
      )}
    </div>
  );
}

function ClientsSection({clients,setClients,posts,lbl}){
  const[editing,setEditing]=useState(null);const[newClient,setNewClient]=useState(false);
  function save(c){if(editing)setClients(cs=>cs.map(x=>x.id===c.id?c:x));else setClients(cs=>[...cs,{...c,id:genId()}]);setEditing(null);setNewClient(false);}
  function del(id){if(confirm("Eliminare questo cliente?"))setClients(cs=>cs.filter(x=>x.id!==id));}
  return(
    <div style={{padding:"28px 32px"}}>
      <div className="section-header">
        <h1 className="page-title">{lbl("clients_title","Clienti")}</h1>
        <button className="btn btn-primary" onClick={()=>setNewClient(true)}>+ Nuovo Cliente</button>
      </div>
      {clients.length===0?<div className="empty-state card" style={{padding:48}}><div className="icon">👥</div><p>Nessun cliente ancora. Aggiungine uno!</p></div>:
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {clients.map(c=>{
            const cp=posts.filter(p=>p.clientId===c.id);
            return(
              <div key={c.id} className="card" style={{overflow:"hidden"}}>
                <div style={{height:5,background:c.color||"#ddd"}}/>
                <div style={{padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:16,color:"var(--text)"}}>{c.name}</div>
                      {c.platform&&<div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{c.platform}</div>}
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>setEditing(c)}>✏️</button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={()=>del(c.id)}>🗑</button>
                    </div>
                  </div>
                  {c.scheduleDays?.length>0&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginBottom:5,letterSpacing:".04em"}}>GIORNI DI USCITA</div>
                      <div style={{display:"flex",gap:4}}>
                        {DAYS_IT.map((d,i)=>(
                          <div key={i} style={{width:27,height:27,borderRadius:7,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",background:c.scheduleDays.includes(i)?c.color:"var(--surface2)",color:c.scheduleDays.includes(i)?"#fff":"var(--text3)",border:c.scheduleDays.includes(i)?"none":"1.5px solid var(--border)"}}>{d[0]}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {POST_STATUSES.map(s=>{const cnt=cp.filter(p=>p.status===s).length;if(!cnt)return null;const sc=STATUS_COLORS[s];return(<span key={s} className="chip" style={{background:sc.light,color:sc.text,borderColor:sc.bg+"44",fontSize:11}}>{cnt} {s}</span>);})}
                    {cp.length===0&&<span style={{fontSize:12,color:"var(--text3)"}}>Nessun post</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      }
      {(newClient||editing)&&<ClientModal client={editing} onSave={save} onClose={()=>{setEditing(null);setNewClient(false);}}/>}
    </div>
  );
}

function ClientModal({client,onSave,onClose}){
  const[form,setForm]=useState(client||{name:"",platform:"",color:PALETTE[4],scheduleDays:[],notes:""});
  function upd(k,v){setForm(f=>({...f,[k]:v}));}
  function toggleDay(d){setForm(f=>({...f,scheduleDays:f.scheduleDays?.includes(d)?f.scheduleDays.filter(x=>x!==d):[...(f.scheduleDays||[]),d]}));}
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{padding:"18px 22px",borderBottom:"1.5px solid var(--border)",display:"flex",justifyContent:"space-between"}}>
          <div style={{fontWeight:700,fontSize:16}}>{client?"Modifica Cliente":"Nuovo Cliente"}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div style={{padding:22,display:"flex",flexDirection:"column",gap:15}}>
          <div className="field"><label className="label">Nome Cliente</label><input className="input" value={form.name} onChange={e=>upd("name",e.target.value)} placeholder="es. Gymmi's"/></div>
          <div className="field"><label className="label">Piattaforme</label><input className="input" value={form.platform} onChange={e=>upd("platform",e.target.value)} placeholder="es. Instagram, Facebook, TikTok"/></div>
          <div className="field">
            <label className="label">Colore Brand</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {PALETTE.map(c=>(
                <button key={c} onClick={()=>upd("color",c)} style={{width:26,height:26,borderRadius:7,background:c,border:"none",cursor:"pointer",outline:form.color===c?`3px solid ${c}`:"3px solid transparent",outlineOffset:2,transition:"var(--transition)",transform:form.color===c?"scale(1.15)":"scale(1)"}}/>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--text2)"}}>
              <div style={{width:18,height:18,borderRadius:5,background:form.color}}/> Colore selezionato
            </div>
          </div>
          <div className="field">
            <label className="label">Giorni di uscita contenuto</label>
            <div style={{display:"flex",gap:6}}>
              {DAYS_IT.map((d,i)=>(
                <button key={i} onClick={()=>toggleDay(i)} style={{width:36,height:36,borderRadius:9,fontSize:11.5,fontWeight:700,cursor:"pointer",border:"none",transition:"var(--transition)",background:form.scheduleDays?.includes(i)?form.color:"var(--surface2)",color:form.scheduleDays?.includes(i)?"#fff":"var(--text3)",transform:form.scheduleDays?.includes(i)?"scale(1.05)":"scale(1)"}}>{d}</button>
              ))}
            </div>
          </div>
          <div className="field"><label className="label">Note</label><textarea className="input" value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Note sul cliente…" style={{minHeight:56,resize:"vertical"}}/></div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
            <button className="btn btn-primary" onClick={()=>onSave(form)} disabled={!form.name}>Salva Cliente</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings({users,setUsers,lbl,setLbl,currentUser}){
  const[tab,setTab]=useState("users");
  const[form,setForm]=useState({name:"",email:"",pw:"",role:"editor"});
  const[msg,setMsg]=useState("");
  const[editingLabel,setEditingLabel]=useState(null);
  const labelKeys=[
    ["app_name","Nome App","SocialCal"],["nav_dashboard","Menu: Dashboard","Dashboard"],
    ["nav_calendar","Menu: Calendario","Calendario"],["nav_posts","Menu: Post","Post"],
    ["nav_clients","Menu: Clienti","Clienti"],["nav_settings","Menu: Impostazioni","Impostazioni"],
    ["dash_title","Titolo Dashboard","Dashboard"],["cal_title","Titolo Calendario","Calendario Editoriale"],
    ["posts_title","Titolo Post","Post"],["clients_title","Titolo Clienti","Clienti"],
  ];
  function invite(){
    if(!form.name||!form.email||!form.pw)return setMsg("⚠️ Compila tutti i campi");
    if(users.find(u=>u.email===form.email))return setMsg("⚠️ Email già registrata");
    setUsers(us=>[...us,{id:genId(),...form,password:form.pw,avatar:form.name[0].toUpperCase()}]);
    setMsg("✅ Utente aggiunto!");setForm({name:"",email:"",pw:"",role:"editor"});
  }
  function changeRole(id,role){setUsers(us=>us.map(u=>u.id===id?{...u,role}:u));}
  function deleteUser(id){if(confirm("Eliminare questo utente?"))setUsers(us=>us.filter(u=>u.id!==id));}
  return(
    <div style={{padding:"28px 32px",maxWidth:860}}>
      <h1 className="page-title" style={{marginBottom:24}}>Impostazioni</h1>
      <div className="pill-tabs" style={{marginBottom:24,display:"inline-flex"}}>
        <button className={"pill-tab"+(tab==="users"?" active":"")} onClick={()=>setTab("users")}>👥 Utenti</button>
        <button className={"pill-tab"+(tab==="labels"?" active":"")} onClick={()=>setTab("labels")}>✏️ Rinomina</button>
      </div>
      {tab==="users"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div>
            <div style={{fontWeight:600,fontSize:15,marginBottom:14}}>Utenti Registrati</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {users.map(u=>(
                <div key={u.id} className="card" style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--accent)",fontSize:13,flexShrink:0}}>{u.avatar||u.name?.[0]}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13.5,color:"var(--text)"}}>{u.name}</div>
                    <div style={{fontSize:12,color:"var(--text3)"}}>{u.email}</div>
                  </div>
                  {u.id!==currentUser?(
                    <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)} className="input" style={{width:110,fontSize:12,padding:"5px 8px"}}>
                      <option value="editor">Editor</option><option value="viewer">Viewer</option>
                    </select>
                  ):<span className="chip" style={{background:"var(--accentbg)",color:"var(--accent)",borderColor:"var(--accent)44"}}>Admin</span>}
                  {u.id!==currentUser&&<button className="btn btn-danger btn-icon btn-sm" onClick={()=>deleteUser(u.id)}>🗑</button>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontWeight:600,fontSize:15,marginBottom:14}}>Invita Utente</div>
            <div className="card" style={{padding:20}}>
              {msg&&<div style={{background:msg.startsWith("✅")?"var(--accentbg)":"var(--dangerbg)",color:msg.startsWith("✅")?"var(--accent)":"var(--danger)",padding:"9px 13px",borderRadius:8,fontSize:13,marginBottom:14,fontWeight:500}}>{msg}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="field"><label className="label">Nome</label><input className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome utente"/></div>
                <div className="field"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@esempio.com"/></div>
                <div className="field"><label className="label">Password temporanea</label><input className="input" value={form.pw} onChange={e=>setForm(f=>({...f,pw:e.target.value}))} placeholder="Minimo 6 caratteri"/></div>
                <div className="field"><label className="label">Ruolo</label>
                  <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                    <option value="editor">Editor — può creare e modificare</option>
                    <option value="viewer">Viewer — solo lettura</option>
                  </select>
                </div>
                <button className="btn btn-primary" style={{width:"100%",marginTop:4}} onClick={invite}>Aggiungi Utente</button>
                <p style={{fontSize:11.5,color:"var(--text3)",textAlign:"center"}}>Ricorda di comunicare le credenziali all'utente invitato.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab==="labels"&&(
        <div className="card" style={{padding:24,maxWidth:560}}>
          <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>Rinomina Etichette</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {labelKeys.map(([key,desc,def])=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",background:"var(--surface2)",borderRadius:8}}>
                <div style={{width:170,fontSize:12,color:"var(--text3)",fontWeight:500}}>{desc}</div>
                {editingLabel===key?(
                  <div style={{display:"flex",gap:6,flex:1}}>
                    <input className="input" defaultValue={lbl(key,def)} autoFocus id={`lbl_${key}`} onKeyDown={e=>{if(e.key==="Enter"){setLbl(key,e.target.value);setEditingLabel(null);}}} style={{flex:1,padding:"6px 10px"}}/>
                    <button className="btn btn-primary btn-sm" onClick={()=>{setLbl(key,document.getElementById(`lbl_${key}`).value);setEditingLabel(null);}}>✓</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setEditingLabel(null)}>✕</button>
                  </div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                    <span style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>{lbl(key,def)}</span>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setEditingLabel(key)} style={{marginLeft:"auto",opacity:.6}}>✏️</button>
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
