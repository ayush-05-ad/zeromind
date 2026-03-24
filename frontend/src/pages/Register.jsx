import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, Loader2, Sun, Moon, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await register(email, password, name); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.detail || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12, fontSize: 15, outline: 'none',
    background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)',
    fontFamily: 'Outfit, sans-serif', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: '#10b981', opacity: 0.03, top: '20%', right: '20%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', zIndex: 50 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Home
        </Link>
        <button onClick={toggle} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-card)', border: 'none', cursor: 'pointer', display: 'flex' }}>
          {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} style={{ color: 'var(--accent)' }} />}
        </button>
      </div>

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-primary)' }}>
            <Brain size={36} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 32, fontWeight: 900 }}><span className="gradient-text">Zero</span>Mind</span>
          </Link>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Create your free account</p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 32, border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Get Started</h2>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--error)' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Ayush Deep" required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="you@email.com" required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 48 }} placeholder="Min 6 characters" required minLength={6}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#fff', background: 'var(--accent)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : 1, fontFamily: 'Outfit, sans-serif' }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}