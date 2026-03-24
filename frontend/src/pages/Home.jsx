import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Brain, Zap, Shield, BookOpen, Code, Search, BarChart3, FileText, Sun, Moon, ArrowRight, Sparkles, Bot, Users, ChevronDown, ExternalLink } from 'lucide-react';

const agents = [
  { name: 'Orchestrator', icon: '🎯', desc: 'Plans & coordinates', color: '#8b5cf6' },
  { name: 'Researcher', icon: '🔍', desc: 'Web search & data', color: '#3b82f6' },
  { name: 'Coder', icon: '💻', desc: 'Write & debug code', color: '#10b981' },
  { name: 'Analyzer', icon: '📊', desc: 'Data analysis', color: '#f59e0b' },
  { name: 'Writer', icon: '✍️', desc: 'Reports & content', color: '#ec4899' },
  { name: 'Study Helper', icon: '📚', desc: 'Notes & quizzes', color: '#06b6d4' },
  { name: 'Reviewer', icon: '✅', desc: 'Quality check', color: '#ef4444' },
];

const features = [
  { icon: <Bot size={22} />, title: '7 AI Agents', desc: 'Specialized agents collaborate like a real team' },
  { icon: <Zap size={22} />, title: 'Zero Cost', desc: 'Free AI models — Gemini & Groq, no credit card' },
  { icon: <Shield size={22} />, title: 'Secure Auth', desc: 'JWT authentication with role-based access' },
  { icon: <BookOpen size={22} />, title: 'Student Focused', desc: 'Notes, quizzes, study plans, placement prep' },
  { icon: <Sparkles size={22} />, title: 'Real-time', desc: 'Watch agents work live on your dashboard' },
  { icon: <Users size={22} />, title: 'Multi-role', desc: 'User & Admin dashboards with analytics' },
];

const useCases = [
  { emoji: '📝', text: 'Create notes on DBMS normalization' },
  { emoji: '💻', text: 'Write a Python REST API with auth' },
  { emoji: '🔍', text: 'Research latest AI trends in 2026' },
  { emoji: '📊', text: 'Compare React vs Angular vs Vue' },
  { emoji: '📧', text: 'Draft email to my professor' },
  { emoji: '🎯', text: 'Generate 20 MCQs on OOP in Java' },
  { emoji: '📅', text: 'Create 7-day study plan for GATE' },
  { emoji: '🧑‍💻', text: 'Help me prepare for TCS NQT' },
];

const techStack = ['React.js', 'FastAPI', 'Python', 'Tailwind CSS', 'PostgreSQL', 'SQLite', 'Redis', 'Gemini AI', 'Groq AI', 'JWT Auth', 'Docker', 'WebSocket'];

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count}</span>;
}

function FloatingParticle({ delay, size, x, y }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: `${x}%`, top: `${y}%`,
        background: 'var(--accent)',
        opacity: 0.06,
        animation: `float ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'blur(1px)'
      }}
    />
  );
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActiveAgent(p => (p + 1) % agents.length), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 w-full z-50 glass" style={{ padding: '14px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={26} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 20, fontWeight: 800 }}>ZeroMind</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggle} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-card)', border: 'none', cursor: 'pointer', display: 'flex' }}>
              {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} style={{ color: 'var(--accent)' }} />}
            </button>
            <Link to="/login" style={{ padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', background: 'var(--accent)', textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
        {/* Floating particles */}
        <FloatingParticle delay={0} size={200} x={5} y={10} />
        <FloatingParticle delay={1.5} size={300} x={75} y={15} />
        <FloatingParticle delay={3} size={180} x={40} y={70} />
        <FloatingParticle delay={2} size={250} x={85} y={60} />
        <FloatingParticle delay={0.5} size={150} x={15} y={80} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', maxWidth: 800, margin: '0 auto' }}>
          {/* Badge */}
          <div className="animate-slide-up" style={{ marginBottom: 32 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 50, fontSize: 13, fontWeight: 500, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent-light)' }}>
              <Sparkles size={13} /> #1 AI Trend of 2026 — Agentic AI
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-slide-up delay-1" style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
            <span className="gradient-text">Zero</span><span>Mind</span>
          </h1>

          {/* Tagline */}
          <p className="animate-slide-up delay-2" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 300, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Zero Cost · Multiple Minds · Infinite Possibilities
          </p>

          {/* Description */}
          <p className="animate-slide-up delay-3" style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 550, margin: '0 auto 40px', lineHeight: 1.7 }}>
            7 specialized AI agents collaborate autonomously to research, code, analyze, write & help you study — completely free.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up delay-4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', background: 'var(--accent)', textDecoration: 'none', boxShadow: '0 4px 30px var(--accent-glow)', transition: 'transform 0.2s' }}>
              Start Free <ArrowRight size={18} />
            </Link>
            <a href="#agents" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}>
              See Agents
            </a>
          </div>

          {/* Stats */}
          <div className="animate-slide-up delay-5" style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 56 }}>
            {[
              { num: 7, label: 'AI Agents' },
              { num: 0, label: 'Cost (₹)' },
              { num: 6, label: 'Task Types' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-light)' }}>
                  <AnimatedCounter end={s.num} />
                  {s.num > 0 && '+'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="animate-fade delay-6" style={{ marginTop: 48 }}>
            <ChevronDown size={20} className="animate-float" style={{ color: 'var(--text-muted)', margin: '0 auto' }} />
          </div>
        </div>
      </section>

      {/* ===== AGENTS ===== */}
      <section id="agents" style={{ padding: '100px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 10 }}>
              Meet Your <span className="gradient-text">AI Team</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>7 agents working together like a real team</p>
          </div>

          {/* Agent flow visualization */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 48 }}>
            {agents.map((a, i) => (
              <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: 14,
                    background: activeAgent === i ? `${a.color}18` : 'var(--bg-card)',
                    border: `2px solid ${activeAgent === i ? a.color : 'var(--border)'}`,
                    textAlign: 'center',
                    transition: 'all 0.4s ease',
                    transform: activeAgent === i ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: activeAgent === i ? `0 0 20px ${a.color}30` : 'none',
                    cursor: 'pointer',
                    minWidth: 100,
                  }}
                  onMouseEnter={() => setActiveAgent(i)}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: activeAgent === i ? a.color : 'var(--text-primary)' }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{a.desc}</div>
                </div>
                {i < agents.length - 1 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 14, opacity: 0.4 }}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 28, border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-light)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>How It Works</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { step: '01', title: 'You Ask', desc: 'Type any task — notes, code, research, email' },
                { step: '02', title: 'Agents Plan', desc: 'Orchestrator breaks task into subtasks' },
                { step: '03', title: 'Agents Work', desc: 'Each specialist does their part' },
                { step: '04', title: 'You Get Output', desc: 'Polished result in seconds' },
              ].map((s, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 14, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)', opacity: 0.3 }}>{s.step}</span>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '6px 0 4px' }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 10 }}>
              Why <span className="gradient-text">ZeroMind</span>?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Built for students, powered by latest AI</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: 24, borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--border)', transition: 'transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,58,237,0.1)', color: 'var(--accent)', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 10 }}>
            What Can You <span className="gradient-text">Ask</span>?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36 }}>Real examples that ZeroMind handles</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 10 }}>
            {useCases.map((uc, i) => (
              <div key={i} style={{ padding: '14px 18px', borderRadius: 12, textAlign: 'left', fontSize: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', transition: 'border-color 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <span style={{ marginRight: 8 }}>{uc.emoji}</span>{uc.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECH STACK ===== */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 28 }}>
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {techStack.map(t => (
              <span key={t} style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent-light)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEVELOPER ===== */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            Built by <span className="gradient-text">Ayush Deep</span>
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>B.Tech CSE (IoT) · Batch 2022-2026 · GEC Vaishali</p>
          <div style={{ padding: 32, borderRadius: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'inline-block' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>
              AD
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Ayush Deep</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Full Stack Developer · AI/ML Enthusiast</p>
            <a href="https://github.com/ayush-05-ad" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <ExternalLink size={15} /> github.com/ayush-05-ad
            </a>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 12 }}>
          Ready for <span className="gradient-text">Agentic AI</span>?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Start using ZeroMind free — no credit card needed</p>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 16, fontSize: 17, fontWeight: 700, color: '#fff', background: 'var(--accent)', textDecoration: 'none', boxShadow: '0 4px 40px var(--accent-glow)' }}>
          Get Started Free <ArrowRight size={18} />
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: '24px 20px', textAlign: 'center', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
        <p>© 2026 ZeroMind — Built with ❤️ by Ayush Deep · GEC Vaishali</p>
        <p style={{ marginTop: 4, fontSize: 12 }}>Zero Cost. Multiple Minds. Infinite Possibilities.</p>
      </footer>
    </div>
  );
}