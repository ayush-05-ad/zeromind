import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sun, Moon, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(email, password, name); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.detail || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'12px 14px', borderRadius:10, fontSize:14, outline:'none', background:'var(--bg-input)', border:'1px solid var(--border)', color:'var(--text-0)', fontFamily:'inherit', transition:'border-color .2s' };

  return (
    <div className="mesh-bg" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'var(--bg-0)' }}>
      <div style={{ position:'fixed', top:0, width:'100%', padding:'14px 20px', display:'flex', justifyContent:'space-between', zIndex:10 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:500, color:'var(--text-2)' }}><ArrowLeft size={15}/> Home</Link>
        <button onClick={toggle} style={{ width:34, height:34, borderRadius:8, background:'var(--bg-2)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {theme==='dark' ? <Sun size={14} color="#eab308"/> : <Moon size={14} color="var(--accent)"/>}
        </button>
      </div>

      <div className="anim-slide-up" style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg, var(--accent), var(--purple))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>Z</div>
            <span style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.02em' }}>ZeroMind</span>
          </Link>
          <p style={{ fontSize:13, color:'var(--text-2)' }}>Create your free account</p>
        </div>

        <div style={{ padding:28, borderRadius:18, background:'var(--bg-2)', border:'1px solid var(--border)' }}>
          {error && <div style={{ padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', color:'var(--red)' }}>{error}</div>}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text-2)', marginBottom:6 }}>Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Ayush Deep" required style={inputStyle}
                onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text-2)', marginBottom:6 }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" required style={inputStyle}
                onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text-2)', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} style={{...inputStyle, paddingRight:40}}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                <button type="button" onClick={()=>setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex' }}>
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ padding:'12px', borderRadius:10, fontSize:14, fontWeight:600, color:'#fff', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?.6:1 }}>
              {loading ? <><Loader2 size={16} className="animate-spin"/> Creating...</> : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:18, fontSize:13, color:'var(--text-2)' }}>
            Have an account? <Link to="/login" style={{ fontWeight:600, color:'var(--accent-2)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
