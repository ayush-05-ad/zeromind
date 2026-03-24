import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { taskAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Brain, LogOut, Send, Loader2, CheckCircle, XCircle, Clock, Search, Sparkles, BookOpen, Code, BarChart3, FileText, Trash2, Sun, Moon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ICONS = { study:<BookOpen size={16}/>, code:<Code size={16}/>, analysis:<BarChart3 size={16}/>, research:<Search size={16}/>, content:<FileText size={16}/>, general:<Sparkles size={16}/> };
const STATUS = {
  completed: { icon:<CheckCircle size={14}/>, cls:'text-green-400', bg:'rgba(16,185,129,0.1)', label:'Completed' },
  failed: { icon:<XCircle size={14}/>, cls:'text-red-400', bg:'rgba(239,68,68,0.1)', label:'Failed' },
  planning: { icon:<Loader2 size={14} className="animate-spin"/>, cls:'text-yellow-400', bg:'rgba(245,158,11,0.1)', label:'Planning' },
  in_progress: { icon:<Loader2 size={14} className="animate-spin"/>, cls:'text-blue-400', bg:'rgba(59,130,246,0.1)', label:'Working' },
  pending: { icon:<Clock size={14}/>, cls:'text-gray-400', bg:'rgba(148,163,184,0.1)', label:'Pending' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selId, setSelId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { taskAPI.list().then(r => setTasks(r.data.tasks)).catch(console.error); }, []);

  const create = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const r = await taskAPI.create({ description: input, priority: 'high', output_format: 'markdown' });
      setInput(''); setTasks(p => [r.data, ...p]); poll(r.data.id);
    } catch(e) { console.error(e); }
    finally { setSending(false); }
  };

  const poll = (id) => {
    const iv = setInterval(async () => {
      try {
        const r = await taskAPI.get(id);
        setTasks(p => p.map(t => t.id === id ? r.data : t));
        if (selId === id) setDetail(r.data);
        if (['completed','failed'].includes(r.data.status)) clearInterval(iv);
      } catch { clearInterval(iv); }
    }, 3000);
  };

  const view = async (id) => {
    setSelId(id); setDetailLoading(true);
    try {
      const r = await taskAPI.get(id); setDetail(r.data);
      if (!['completed','failed'].includes(r.data.status)) poll(id);
    } catch(e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  const del = async (id, e) => {
    e.stopPropagation();
    await taskAPI.delete(id).catch(console.error);
    setTasks(p => p.filter(t => t.id !== id));
    if (selId === id) { setSelId(null); setDetail(null); }
  };

  const s = (st) => STATUS[st] || STATUS.pending;

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav className="px-6 py-3 flex items-center justify-between" style={{ background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <Brain className="w-7 h-7" style={{ color:'var(--accent)' }} />
          <span className="text-xl font-bold">ZeroMind</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background:'rgba(124,58,237,0.15)', color:'var(--accent-light)' }}>AI Platform</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-xl transition" style={{ background:'var(--bg-card)' }}>
            {theme==='dark' ? <Sun size={16} style={{color:'var(--warning)'}}/> : <Moon size={16} style={{color:'var(--accent)'}}/>}
          </button>
          <span className="text-sm" style={{color:'var(--text-secondary)'}}>Hi, {user?.full_name}</span>
          <button onClick={logout} className="p-2 rounded-xl transition hover:scale-110" style={{color:'var(--error)'}}><LogOut size={18}/></button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left - Task List */}
        <div className="w-96 flex flex-col" style={{ background:'var(--bg-secondary)', borderRight:'1px solid var(--border)' }}>
          <div className="p-4" style={{ borderBottom:'1px solid var(--border)' }}>
            <div className="relative">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();create();}}}
                placeholder="Ask ZeroMind anything..."
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm resize-none outline-none"
                style={{ background:'var(--bg-input)', border:'1px solid var(--border)', color:'var(--text-primary)' }}
                rows={3} />
              <button onClick={create} disabled={sending||!input.trim()}
                className="absolute right-3 bottom-3 p-2 rounded-lg text-white transition disabled:opacity-30"
                style={{ background:'var(--accent)' }}>
                {sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {tasks.length===0 ? (
              <div className="p-8 text-center">
                <Sparkles className="mx-auto mb-3 opacity-20" size={32}/>
                <p className="text-sm" style={{color:'var(--text-muted)'}}>No tasks yet. Ask something!</p>
              </div>
            ) : tasks.map(t => (
              <div key={t.id} onClick={() => view(t.id)}
                className="p-4 cursor-pointer transition"
                style={{ borderBottom:'1px solid var(--border)', background: selId===t.id ? 'var(--bg-hover)' : 'transparent', borderLeft: selId===t.id ? '3px solid var(--accent)' : '3px solid transparent' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{color:'var(--accent-light)'}}>{ICONS[t.task_type]||ICONS.general}</span>
                      <h3 className="text-sm font-semibold truncate">{t.title}</h3>
                    </div>
                    <p className="text-xs truncate" style={{color:'var(--text-muted)'}}>{t.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s(t.status).cls}`} style={{background:s(t.status).bg}}>
                        {s(t.status).icon} {s(t.status).label}
                      </span>
                      {t.execution_time_ms && <span className="text-xs" style={{color:'var(--text-muted)'}}>{(t.execution_time_ms/1000).toFixed(1)}s</span>}
                    </div>
                  </div>
                  <button onClick={e=>del(t.id,e)} className="ml-2 mt-1 transition hover:scale-110" style={{color:'var(--text-muted)'}}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Detail */}
        <div className="flex-1 overflow-y-auto">
          {!selId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <Brain className="mx-auto mb-4 opacity-15" size={72} style={{color:'var(--accent)'}}/>
                <h2 className="text-2xl font-bold mb-2">Welcome to ZeroMind</h2>
                <p className="text-sm mb-6" style={{color:'var(--text-muted)'}}>Type a task and watch AI agents collaborate</p>
                <div className="space-y-2 max-w-sm mx-auto">
                  {["Create notes on Data Structures","Write a Python CRUD API","Research AI trends in 2026","Compare React vs Vue vs Angular","Generate 20 MCQs on OOP"].map((ex,i) => (
                    <div key={i} onClick={()=>setInput(ex)}
                      className="text-xs text-left px-4 py-2.5 rounded-xl cursor-pointer transition hover:scale-[1.01]"
                      style={{background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-secondary)'}}>
                      {['📝','💻','🔍','📊','🎯'][i]} {ex}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : detailLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin" size={32} style={{color:'var(--accent)'}}/>
            </div>
          ) : detail && (
            <div className="p-6 max-w-4xl mx-auto animate-fade">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span style={{color:'var(--accent-light)'}}>{ICONS[detail.task_type]||ICONS.general}</span>
                  <h1 className="text-2xl font-bold">{detail.title}</h1>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${s(detail.status).cls}`} style={{background:s(detail.status).bg}}>
                    {s(detail.status).icon} {s(detail.status).label}
                  </span>
                  {detail.execution_time_ms>0 && <span className="text-sm" style={{color:'var(--text-muted)'}}>⏱ {(detail.execution_time_ms/1000).toFixed(1)}s</span>}
                  {detail.total_tokens>0 && <span className="text-sm" style={{color:'var(--text-muted)'}}>🧠 {detail.total_tokens} tokens</span>}
                </div>
              </div>

              {/* Agent Pipeline */}
              {detail.steps?.length>0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'var(--text-muted)'}}>Agent Pipeline</h2>
                  <div className="space-y-2">
                    {detail.steps.map((step,i) => (
                      <div key={step.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition"
                        style={{ background: step.status==='completed' ? 'rgba(16,185,129,0.05)' : step.status==='running' ? 'rgba(245,158,11,0.05)' : 'rgba(148,163,184,0.05)',
                          border: `1px solid ${step.status==='completed' ? 'rgba(16,185,129,0.2)' : step.status==='running' ? 'rgba(245,158,11,0.2)' : 'rgba(148,163,184,0.15)'}` }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: step.status==='completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            color: step.status==='completed' ? 'var(--success)' : 'var(--warning)' }}>
                          {step.status==='completed' ? '✓' : '⟳'}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-semibold capitalize">{step.agent_name}</span>
                          <span className="text-xs ml-2" style={{color:'var(--text-muted)'}}>{step.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Plan */}
              {detail.execution_plan && (
                <div className="mb-6 p-4 rounded-2xl" style={{background:'var(--bg-card)', border:'1px solid var(--border)'}}>
                  <h2 className="text-sm font-bold mb-2" style={{color:'var(--accent-light)'}}>🎯 Execution Plan</h2>
                  {detail.execution_plan.subtasks?.map((sub,i) => (
                    <div key={i} className="text-xs flex gap-2 mb-1" style={{color:'var(--text-secondary)'}}>
                      <span className="font-mono" style={{color:'var(--accent)'}}>Step {sub.step}:</span>
                      <span className="capitalize font-semibold" style={{color:'var(--accent-light)'}}>[{sub.agent}]</span>
                      <span>{sub.instruction}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Output */}
              {detail.final_output && (
                <div className="p-6 rounded-2xl" style={{background:'var(--bg-card)', border:'1px solid var(--border)'}}>
                  <h2 className="text-sm font-bold mb-4" style={{color:'var(--accent-light)'}}>📄 Output</h2>
                  <div className="markdown-output text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>
                    <ReactMarkdown>{detail.final_output}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
