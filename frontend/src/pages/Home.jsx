import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ArrowRight, ExternalLink, ChevronDown } from 'lucide-react';

const agents = [
  { name:'Orchestrator', emoji:'🎯', desc:'Plans & assigns tasks', color:'#06b6d4' },
  { name:'Researcher', emoji:'🔍', desc:'Searches the web', color:'#3b82f6' },
  { name:'Coder', emoji:'💻', desc:'Writes & debugs code', color:'#10b981' },
  { name:'Analyzer', emoji:'📊', desc:'Finds patterns in data', color:'#eab308' },
  { name:'Writer', emoji:'✍️', desc:'Creates polished content', color:'#ec4899' },
  { name:'Study Helper', emoji:'📚', desc:'Notes, quizzes, plans', color:'#8b5cf6' },
  { name:'Reviewer', emoji:'✅', desc:'Final quality check', color:'#f43f5e' },
];

const steps = [
  { n:'01', title:'Describe your task', desc:'Type what you need — notes, code, research, anything' },
  { n:'02', title:'Agents collaborate', desc:'Multiple AI specialists work together automatically' },
  { n:'03', title:'Get polished output', desc:'Reviewed, formatted, ready-to-use result in seconds' },
];

const useCases = [
  { cat:'Study', items:['Create notes on DBMS normalization','Generate 20 MCQs on OOP in Java','Make a 7-day study plan for GATE'] },
  { cat:'Code', items:['Write a Flask REST API with auth','Debug my Python sorting algorithm','Build a React login component'] },
  { cat:'Research', items:['Latest AI trends in 2026','Compare React vs Vue vs Angular','Summarize a research paper'] },
  { cat:'Content', items:['Draft email to professor','Write project abstract','Create LinkedIn post about my project'] },
];

const tech = ['React','FastAPI','Python','Tailwind CSS','PostgreSQL','Redis','Gemini AI','Groq AI','JWT Auth','Docker','WebSocket','DuckDuckGo API'];

function Counter({ end, suffix='' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i += Math.ceil(end/30); if(i>=end){setN(end);clearInterval(t)}else setN(i); }, 30);
    return () => clearInterval(t);
  }, [end]);
  return <>{n}{suffix}</>;
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const [activeAgent, setActiveAgent] = useState(0);
  const [activeCat, setActiveCat] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActiveAgent(p => (p+1) % agents.length), 2200);
    return () => clearInterval(iv);
  }, []);

  const S = (styles) => styles; // just for readability

  return (
    <div style={{ background:'var(--bg-0)', color:'var(--text-0)', minHeight:'100vh' }}>

      {/* ── NAV ── */}
      <nav className="glass" style={{ position:'fixed', top:0, width:'100%', zIndex:50, padding:'12px 20px' }}>
        <div style={{ maxWidth:1140, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg, var(--accent), var(--purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>Z</div>
            <span style={{ fontSize:18, fontWeight:700, letterSpacing:'-0.02em' }}>ZeroMind</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={toggle} style={{ width:36, height:36, borderRadius:8, background:'var(--bg-2)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {theme==='dark' ? <Sun size={15} color="#eab308"/> : <Moon size={15} color="var(--accent)"/>}
            </button>
            <Link to="/login" style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:500, color:'var(--text-1)', background:'var(--bg-2)', border:'1px solid var(--border)' }}>Log in</Link>
            <Link to="/register" style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, color:'#fff', background:'var(--accent)' }}>Sign up</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mesh-bg" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:80 }}>
        <div style={{ position:'relative', zIndex:1, textAlign:'center', padding:'0 20px', maxWidth:720, margin:'0 auto' }}>
          <div className="anim-slide-up" style={{ marginBottom:28 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:100, fontSize:12, fontWeight:500, background:'var(--bg-2)', border:'1px solid var(--border)', color:'var(--accent-2)' }}>
              ✦ The #1 AI trend of 2026 — Agentic AI
            </span>
          </div>

          <h1 className="anim-slide-up d1" style={{ fontSize:'clamp(44px, 7vw, 80px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:18 }}>
            Multiple AI minds<br/><span className="grad-text">working for you</span>
          </h1>

          <p className="anim-slide-up d2" style={{ fontSize:'clamp(15px, 2vw, 18px)', color:'var(--text-2)', maxWidth:500, margin:'0 auto 36px', lineHeight:1.65 }}>
            ZeroMind orchestrates 7 specialized AI agents that collaborate to research, code, analyze, write & help you study — completely free.
          </p>

          <div className="anim-slide-up d3" style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:600, color:'#fff', background:'var(--accent)', transition:'all .2s', boxShadow:'0 0 24px var(--accent-glow)' }}>
              Get started free <ArrowRight size={16}/>
            </Link>
            <a href="#how" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:500, color:'var(--text-1)', background:'var(--bg-2)', border:'1px solid var(--border)' }}>
              How it works
            </a>
          </div>

          <div className="anim-slide-up d5" style={{ display:'flex', justifyContent:'center', gap:36, marginTop:52 }}>
            {[{n:7,s:'+',l:'AI Agents'},{n:0,s:'',l:'Cost (₹)'},{n:10,s:'s',l:'Avg Speed'}].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:30, fontWeight:800, color:'var(--accent-2)' }}><Counter end={s.n} suffix={s.s}/></div>
                <div style={{ fontSize:12, color:'var(--text-2)', fontWeight:500, marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="anim-fade d7" style={{ marginTop:44 }}>
            <a href="#agents"><ChevronDown size={18} className="anim-float" style={{ color:'var(--text-3)', margin:'0 auto', display:'block' }}/></a>
          </div>
        </div>
      </section>

      {/* ── AGENTS ── */}
      <section id="agents" style={{ padding:'96px 20px', background:'var(--bg-1)' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'var(--accent)', textTransform:'uppercase', letterSpacing:2, marginBottom:8, textAlign:'center' }}>Your AI Team</p>
          <h2 style={{ fontSize:'clamp(28px, 4vw, 40px)', fontWeight:800, textAlign:'center', letterSpacing:'-0.02em', marginBottom:48 }}>
            7 agents. One <span className="grad-text">mission</span>.
          </h2>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(115px, 1fr))', gap:10 }}>
            {agents.map((a,i) => (
              <div key={a.name}
                onMouseEnter={() => setActiveAgent(i)}
                style={{
                  padding:'18px 12px', borderRadius:14, textAlign:'center', cursor:'pointer',
                  background: activeAgent===i ? `${a.color}12` : 'var(--bg-2)',
                  border: activeAgent===i ? `1.5px solid ${a.color}50` : '1.5px solid var(--border)',
                  transform: activeAgent===i ? 'translateY(-4px)' : 'none',
                  boxShadow: activeAgent===i ? `0 8px 24px ${a.color}20` : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}>
                <div style={{ fontSize:26, marginBottom:6 }}>{a.emoji}</div>
                <div style={{ fontSize:12, fontWeight:700, color: activeAgent===i ? a.color : 'var(--text-0)', marginBottom:2 }}>{a.name}</div>
                <div style={{ fontSize:10, color:'var(--text-2)', lineHeight:1.4 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding:'96px 20px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'var(--accent)', textTransform:'uppercase', letterSpacing:2, marginBottom:8, textAlign:'center' }}>Simple Process</p>
          <h2 style={{ fontSize:'clamp(28px, 4vw, 40px)', fontWeight:800, textAlign:'center', letterSpacing:'-0.02em', marginBottom:48 }}>
            Three steps to <span className="grad-text">done</span>
          </h2>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
            {steps.map((s,i) => (
              <div key={i} style={{ padding:24, borderRadius:16, background:'var(--bg-1)', border:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
                <div style={{ fontSize:48, fontWeight:900, color:'var(--accent)', opacity:0.08, position:'absolute', top:12, right:16, lineHeight:1 }}>{s.n}</div>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(6,182,212,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'var(--accent)', marginBottom:14 }}>{s.n}</div>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section style={{ padding:'96px 20px', background:'var(--bg-1)' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'var(--accent)', textTransform:'uppercase', letterSpacing:2, marginBottom:8, textAlign:'center' }}>Use Cases</p>
          <h2 style={{ fontSize:'clamp(28px, 4vw, 40px)', fontWeight:800, textAlign:'center', letterSpacing:'-0.02em', marginBottom:32 }}>
            What will you <span className="grad-text">build</span>?
          </h2>

          {/* Category tabs */}
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:24 }}>
            {useCases.map((c,i) => (
              <button key={i} onClick={() => setActiveCat(i)}
                style={{ padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', cursor:'pointer',
                  background: activeCat===i ? 'var(--accent)' : 'var(--bg-2)',
                  color: activeCat===i ? '#fff' : 'var(--text-2)',
                  transition:'all .2s' }}>
                {c.cat}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {useCases[activeCat].items.map((item,i) => (
              <div key={i} style={{ padding:'14px 18px', borderRadius:12, fontSize:14, color:'var(--text-1)', background:'var(--bg-2)', border:'1px solid var(--border)', transition:'border-color .2s, transform .2s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.transform='translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; }}>
                → {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH ── */}
      <section style={{ padding:'72px 20px' }}>
        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:28, fontWeight:800, marginBottom:24, letterSpacing:'-0.02em' }}>Powered <span className="grad-text">by</span></h2>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8 }}>
            {tech.map(t => (
              <span key={t} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:500, background:'var(--bg-2)', border:'1px solid var(--border)', color:'var(--accent-2)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER ── */}
      <section style={{ padding:'72px 20px', background:'var(--bg-1)' }}>
        <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:13, fontWeight:600, color:'var(--accent)', textTransform:'uppercase', letterSpacing:2, marginBottom:16 }}>Developer</p>
          <div style={{ padding:28, borderRadius:20, background:'var(--bg-2)', border:'1px solid var(--border)', display:'inline-block' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'#fff', background:'linear-gradient(135deg, var(--accent), var(--purple))' }}>AD</div>
            <h3 style={{ fontSize:20, fontWeight:700, marginBottom:3 }}>Ayush Deep</h3>
            <p style={{ fontSize:12, color:'var(--text-2)', marginBottom:16 }}>B.Tech CSE (IoT) · 2022-2026 · GEC Vaishali</p>
            <a href="https://github.com/ayush-05-ad" target="_blank" rel="noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, background:'var(--bg-0)', border:'1px solid var(--border)', color:'var(--text-1)', transition:'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
              <ExternalLink size={13}/> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mesh-bg" style={{ padding:'96px 20px', textAlign:'center' }}>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'clamp(28px, 4vw, 44px)', fontWeight:800, letterSpacing:'-0.02em', marginBottom:12 }}>
            Start building with <span className="grad-text">ZeroMind</span>
          </h2>
          <p style={{ fontSize:15, color:'var(--text-2)', marginBottom:28 }}>Free forever. No credit card.</p>
          <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:12, fontSize:15, fontWeight:700, color:'#fff', background:'var(--accent)', boxShadow:'0 0 32px var(--accent-glow)' }}>
            Get started <ArrowRight size={16}/>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'20px', textAlign:'center', borderTop:'1px solid var(--border)', fontSize:12, color:'var(--text-3)' }}>
        © 2026 ZeroMind · Built by Ayush Deep · GEC Vaishali
      </footer>
    </div>
  );
}
