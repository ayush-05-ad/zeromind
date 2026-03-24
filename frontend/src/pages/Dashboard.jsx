import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { taskAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { LogOut, Send, Loader2, CheckCircle, XCircle, Clock, Search, Sparkles, BookOpen, Code, BarChart3, FileText, Trash2, Sun, Moon, Menu, X, Copy, Check, RefreshCw, LayoutDashboard, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ICONS = { study:<BookOpen size={15}/>, code:<Code size={15}/>, analysis:<BarChart3 size={15}/>, research:<Search size={15}/>, content:<FileText size={15}/>, general:<Sparkles size={15}/> };

const STATUS = {
  completed:{ icon:<CheckCircle size={13}/>, color:'var(--green)', label:'Done' },
  failed:{ icon:<XCircle size={13}/>, color:'var(--red)', label:'Failed' },
  planning:{ icon:<Loader2 size={13} className="animate-spin"/>, color:'var(--yellow)', label:'Planning' },
  in_progress:{ icon:<Loader2 size={13} className="animate-spin"/>, color:'var(--blue)', label:'Working' },
  pending:{ icon:<Clock size={13}/>, color:'var(--text-2)', label:'Queued' },
};

const TIPS = [
  { e:'📝', t:'Create notes on Data Structures' },
  { e:'💻', t:'Write a Python Flask API with auth' },
  { e:'🔍', t:'Research AI trends in 2026' },
  { e:'📊', t:'Compare React vs Vue vs Angular' },
  { e:'🎯', t:'Generate 15 MCQs on DBMS' },
  { e:'📅', t:'Make a 7-day study plan' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selId, setSelId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [dLoading, setDLoading] = useState(false);
  const [sidebar, setSidebar] = useState(window.innerWidth > 768);
  const [copied, setCopied] = useState(false);
  const iRef = useRef(null);
  const polls = useRef({});

  useEffect(() => {
    taskAPI.list().then(r => setTasks(r.data.tasks)).catch(console.error);
    return () => Object.values(polls.current).forEach(clearInterval);
  }, []);

  const create = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const r = await taskAPI.create({ description:input, priority:'high', output_format:'markdown' });
      setInput('');
      setTasks(p => [r.data, ...p]);
      setSelId(r.data.id); setDetail(r.data);
      startPoll(r.data.id);
    } catch(e) { console.error(e); }
    finally { setSending(false); }
  };

  const startPoll = (id) => {
    if (polls.current[id]) clearInterval(polls.current[id]);
    polls.current[id] = setInterval(async () => {
      try {
        const r = await taskAPI.get(id);
        setTasks(p => p.map(t => t.id===id ? {...t,...r.data} : t));
        setDetail(prev => prev?.id===id ? r.data : prev);
        if (['completed','failed'].includes(r.data.status)) { clearInterval(polls.current[id]); delete polls.current[id]; }
      } catch { clearInterval(polls.current[id]); }
    }, 2500);
  };

  const view = async (id) => {
    setSelId(id); setDLoading(true);
    if (window.innerWidth < 768) setSidebar(false);
    try {
      const r = await taskAPI.get(id); setDetail(r.data);
      if (!['completed','failed'].includes(r.data.status)) startPoll(id);
    } catch(e) { console.error(e); }
    finally { setDLoading(false); }
  };

  const del = async (id, e) => {
    e.stopPropagation();
    await taskAPI.delete(id).catch(()=>{});
    setTasks(p => p.filter(t => t.id!==id));
    if (selId===id) { setSelId(null); setDetail(null); }
  };

  const copyOut = () => {
    if (!detail?.final_output) return;
    navigator.clipboard.writeText(detail.final_output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const retry = async () => {
    if (!detail) return; setSending(true);
    try {
      const r = await taskAPI.create({ description:detail.description, priority:'high', output_format:'markdown' });
      setTasks(p => [r.data,...p]); setSelId(r.data.id); setDetail(r.data); startPoll(r.data.id);
    } catch(e) { console.error(e); }
    finally { setSending(false); }
  };

  const st = (s) => STATUS[s] || STATUS.pending;
  const fmt = (ms) => ms ? (ms<1000 ? ms+'ms' : (ms/1000).toFixed(1)+'s') : '';

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'var(--bg-0)' }}>

      {/* ── NAV ── */}
      <div style={{ padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg-1)', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>setSidebar(!sidebar)} style={{ width:34, height:34, borderRadius:8, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-2)' }}>
            {sidebar ? <X size={18}/> : <Menu size={18}/>}
          </button>
          <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg, var(--accent), var(--purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff' }}>Z</div>
          <span style={{ fontSize:16, fontWeight:700, letterSpacing:'-0.02em' }}>ZeroMind</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {user?.role==='admin' && <Link to="/admin" style={{ padding:'5px 12px', borderRadius:7, fontSize:11, fontWeight:600, background:'rgba(6,182,212,0.1)', color:'var(--accent-2)', display:'flex', alignItems:'center', gap:4 }}><LayoutDashboard size={12}/> Admin</Link>}
          <button onClick={toggle} style={{ width:32, height:32, borderRadius:7, background:'var(--bg-2)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {theme==='dark' ? <Sun size={14} color="#eab308"/> : <Moon size={14} color="var(--accent)"/>}
          </button>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--bg-3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'var(--accent-2)' }}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} style={{ width:32, height:32, borderRadius:7, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-2)' }}><LogOut size={16}/></button>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* ── SIDEBAR ── */}
        {sidebar && (
          <div style={{ width: window.innerWidth<768 ? '100%' : 320, flexShrink:0, display:'flex', flexDirection:'column', background:'var(--bg-1)', borderRight:'1px solid var(--border)', position: window.innerWidth<768 ? 'absolute' : 'relative', zIndex:20, height: window.innerWidth<768 ? 'calc(100vh - 50px)' : 'auto' }}>
            {/* Input */}
            <div style={{ padding:12, borderBottom:'1px solid var(--border)' }}>
              <div style={{ position:'relative' }}>
                <textarea ref={iRef} value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();create();}}}
                  placeholder="What do you need help with?"
                  rows={2}
                  style={{ width:'100%', padding:'11px 42px 11px 13px', borderRadius:12, fontSize:13, resize:'none', outline:'none', background:'var(--bg-input)', border:'1px solid var(--border)', color:'var(--text-0)', fontFamily:'inherit', lineHeight:1.5, transition:'border-color .2s' }}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'}
                />
                <button onClick={create} disabled={sending||!input.trim()}
                  style={{ position:'absolute', right:8, bottom:8, width:32, height:32, borderRadius:8, background: input.trim() ? 'var(--accent)' : 'var(--bg-3)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s', opacity:input.trim()?1:0.4 }}>
                  {sending ? <Loader2 size={14} className="animate-spin" color="#fff"/> : <Send size={14} color="#fff"/>}
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {tasks.length===0 ? (
                <div style={{ padding:'28px 14px', textAlign:'center' }}>
                  <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:14 }}>Try one of these:</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {TIPS.map((t,i) => (
                      <div key={i} onClick={()=>{setInput(t.t);iRef.current?.focus();}}
                        style={{ padding:'9px 12px', borderRadius:9, fontSize:12, textAlign:'left', cursor:'pointer', background:'var(--bg-2)', border:'1px solid var(--border)', color:'var(--text-1)', transition:'border-color .15s' }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                        onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                        {t.e} {t.t}
                      </div>
                    ))}
                  </div>
                </div>
              ) : tasks.map(t => (
                <div key={t.id} onClick={()=>view(t.id)}
                  style={{ padding:'11px 13px', cursor:'pointer', borderBottom:'1px solid var(--border)', transition:'background .1s',
                    background: selId===t.id ? 'var(--bg-hover)' : 'transparent',
                    borderLeft: selId===t.id ? '2px solid var(--accent)' : '2px solid transparent' }}
                  onMouseEnter={e=>{ if(selId!==t.id) e.currentTarget.style.background='var(--bg-hover)'; }}
                  onMouseLeave={e=>{ if(selId!==t.id) e.currentTarget.style.background='transparent'; }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                        <span style={{ color:'var(--accent-2)', flexShrink:0 }}>{ICONS[t.task_type]||ICONS.general}</span>
                        <span style={{ fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11, padding:'1px 7px', borderRadius:20, background:`${st(t.status).color}12`, color:st(t.status).color }}>
                          {st(t.status).icon} {st(t.status).label}
                        </span>
                        {t.execution_time_ms>0 && <span style={{ fontSize:11, color:'var(--text-3)' }}>{fmt(t.execution_time_ms)}</span>}
                      </div>
                    </div>
                    <button onClick={e=>del(t.id,e)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:2, opacity:0.4, flexShrink:0 }}
                      onMouseEnter={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.color='var(--red)';}}
                      onMouseLeave={e=>{e.currentTarget.style.opacity='0.4';e.currentTarget.style.color='var(--text-3)';}}><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        <div style={{ flex:1, overflowY:'auto' }}>
          {!selId ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', padding:20 }}>
              <div style={{ textAlign:'center', maxWidth:420 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg, var(--accent), var(--purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#fff', margin:'0 auto 16px', opacity:0.8 }}>Z</div>
                <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6, letterSpacing:'-0.02em' }}>What can I help with?</h2>
                <p style={{ fontSize:13, color:'var(--text-2)', marginBottom:24 }}>Type a task and agents will collaborate to complete it</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                  {TIPS.map((t,i) => (
                    <div key={i} onClick={()=>{setInput(t.t);setSidebar(true);iRef.current?.focus();}}
                      style={{ padding:'10px 11px', borderRadius:10, fontSize:12, textAlign:'left', cursor:'pointer', background:'var(--bg-1)', border:'1px solid var(--border)', color:'var(--text-1)', transition:'border-color .15s' }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                      onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                      {t.e} {t.t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          ) : dLoading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
              <Loader2 size={24} className="animate-spin" style={{ color:'var(--accent)' }}/>
            </div>

          ) : detail && (
            <div className="anim-fade" style={{ padding: window.innerWidth<768 ? 14 : '20px 28px', maxWidth:820, margin:'0 auto' }}>

              {/* Header */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <span style={{ color:'var(--accent-2)' }}>{ICONS[detail.task_type]||ICONS.general}</span>
                  <h1 style={{ fontSize:20, fontWeight:700, letterSpacing:'-0.01em' }}>{detail.title}</h1>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, padding:'3px 10px', borderRadius:20, fontWeight:600, background:`${st(detail.status).color}12`, color:st(detail.status).color }}>
                    {st(detail.status).icon} {st(detail.status).label}
                  </span>
                  {detail.execution_time_ms>0 && <span style={{ fontSize:12, color:'var(--text-2)' }}>⏱ {fmt(detail.execution_time_ms)}</span>}
                  {detail.total_tokens>0 && <span style={{ fontSize:12, color:'var(--text-2)' }}>🧠 {detail.total_tokens} tokens</span>}
                  {detail.status==='failed' && <button onClick={retry} disabled={sending} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:7, fontSize:11, fontWeight:600, background:'rgba(6,182,212,0.1)', color:'var(--accent-2)', border:'none', cursor:'pointer' }}><RefreshCw size={11}/> Retry</button>}
                </div>
              </div>

              {/* Pipeline */}
              {detail.steps?.length>0 && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, color:'var(--text-3)', marginBottom:10 }}>Pipeline</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    {detail.steps.map(step => {
                      const ok = step.status==='completed';
                      const run = step.status==='running';
                      const c = ok ? 'var(--green)' : run ? 'var(--yellow)' : 'var(--text-3)';
                      return (
                        <div key={step.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:10, background:`${c}06`, border:`1px solid ${c}18` }}>
                          <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, background:`${c}14`, color:c, flexShrink:0 }}>
                            {ok?'✓':run?'⟳':'·'}
                          </div>
                          <span style={{ fontSize:13, fontWeight:600, textTransform:'capitalize' }}>{step.agent_name}</span>
                          <span style={{ fontSize:11, color:'var(--text-2)' }}>{step.action}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Plan */}
              {detail.execution_plan?.subtasks && (
                <div style={{ marginBottom:20, padding:16, borderRadius:14, background:'var(--bg-1)', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--accent-2)', marginBottom:10 }}>Execution Plan</div>
                  {detail.execution_plan.subtasks.map((sub,i) => (
                    <div key={i} style={{ display:'flex', gap:6, fontSize:12, color:'var(--text-1)', marginBottom:5, lineHeight:1.5 }}>
                      <span style={{ fontFamily:'JetBrains Mono', color:'var(--accent)', fontWeight:600, flexShrink:0 }}>#{sub.step}</span>
                      <span style={{ color:'var(--accent-2)', fontWeight:600, textTransform:'capitalize', flexShrink:0 }}>{sub.agent}</span>
                      <span style={{ color:'var(--text-2)' }}>— {sub.instruction}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Output */}
              {detail.final_output && (
                <div style={{ padding:18, borderRadius:14, background:'var(--bg-1)', border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--accent-2)' }}>Output</span>
                    <button onClick={copyOut} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600, background:'var(--bg-2)', border:'1px solid var(--border)', color:'var(--text-2)', cursor:'pointer' }}>
                      {copied ? <><Check size={11} color="var(--green)"/> Copied</> : <><Copy size={11}/> Copy</>}
                    </button>
                  </div>
                  <div className="md-out" style={{ fontSize:13, lineHeight:1.75, color:'var(--text-1)' }}>
                    <ReactMarkdown>{detail.final_output}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Loading */}
              {['planning','in_progress','pending'].includes(detail.status) && (
                <div style={{ padding:28, textAlign:'center', borderRadius:14, background:'var(--bg-1)', border:'1px solid var(--border)', marginTop:12 }}>
                  <Loader2 size={24} className="animate-spin" style={{ color:'var(--accent)', margin:'0 auto 10px' }}/>
                  <p style={{ fontSize:14, fontWeight:600 }}>Agents are working...</p>
                  <p style={{ fontSize:12, color:'var(--text-2)', marginTop:4 }}>Usually takes 10-20 seconds</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
