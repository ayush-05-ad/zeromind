import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Brain, Sun, Moon, ArrowLeft, Users, BarChart3, Zap, Clock, CheckCircle, XCircle, Bot, Loader2 } from 'lucide-react';
import api from '../services/api';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ padding:20, borderRadius:16, background:'var(--bg-card)', border:'1px solid var(--border)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:`${color}15`, color }}>
          {icon}
        </div>
        <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>{label}</span>
      </div>
      <div style={{ fontSize:28, fontWeight:800 }}>{value}</div>
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? (value / max * 100) : 0;
  return (
    <div style={{ width:'100%', height:8, borderRadius:4, background:'var(--bg-primary)', overflow:'hidden' }}>
      <div style={{ width:`${pct}%`, height:'100%', borderRadius:4, background:color, transition:'width 0.5s ease' }} />
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
    } catch (e) {
      console.error('Admin API error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)' }}>
      <div style={{ textAlign:'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color:'var(--accent)', margin:'0 auto 12px' }} />
        <p style={{ color:'var(--text-muted)' }}>Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{ padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg-secondary)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link to="/dashboard" style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-secondary)', textDecoration:'none', fontSize:13, fontWeight:500 }}>
            <ArrowLeft size={16}/> Dashboard
          </Link>
          <span style={{ color:'var(--text-muted)' }}>|</span>
          <Brain size={22} style={{ color:'var(--accent)' }}/>
          <span style={{ fontSize:17, fontWeight:800 }}>Admin Panel</span>
        </div>
        <button onClick={toggle} style={{ padding:6, borderRadius:8, background:'var(--bg-card)', border:'none', cursor:'pointer', display:'flex' }}>
          {theme==='dark' ? <Sun size={15} style={{color:'#f59e0b'}}/> : <Moon size={15} style={{color:'var(--accent)'}}/>}
        </button>
      </nav>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'24px 16px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:24 }}>
          {['overview', 'users', 'agents'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', textTransform:'capitalize',
                background: tab===t ? 'var(--accent)' : 'var(--bg-card)',
                color: tab===t ? '#fff' : 'var(--text-secondary)',
                transition:'all 0.2s'
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginBottom:24 }}>
              <StatCard icon={<Users size={18}/>} label="Total Users" value={stats.users?.total || 0} color="#3b82f6" />
              <StatCard icon={<BarChart3 size={18}/>} label="Total Tasks" value={stats.tasks?.total || 0} color="#8b5cf6" />
              <StatCard icon={<CheckCircle size={18}/>} label="Completed" value={stats.tasks?.completed || 0} color="#10b981" />
              <StatCard icon={<XCircle size={18}/>} label="Failed" value={stats.tasks?.failed || 0} color="#ef4444" />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:12 }}>
              {/* Success Rate */}
              <div style={{ padding:20, borderRadius:16, background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:16, textTransform:'uppercase', letterSpacing:1 }}>Success Rate</h3>
                <div style={{ fontSize:42, fontWeight:900, color:'var(--success)', marginBottom:8 }}>
                  {stats.tasks?.success_rate || 0}%
                </div>
                <ProgressBar value={stats.tasks?.success_rate || 0} max={100} color="#10b981" />
              </div>

              {/* Performance */}
              <div style={{ padding:20, borderRadius:16, background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:16, textTransform:'uppercase', letterSpacing:1 }}>Performance</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                      <span style={{ color:'var(--text-secondary)' }}>Avg Execution Time</span>
                      <span style={{ fontWeight:700 }}>{stats.performance?.avg_execution_time_ms ? `${(stats.performance.avg_execution_time_ms/1000).toFixed(1)}s` : 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                      <span style={{ color:'var(--text-secondary)' }}>Total Tokens Used</span>
                      <span style={{ fontWeight:700 }}>{stats.performance?.total_tokens_used?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Types */}
              <div style={{ padding:20, borderRadius:16, background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:16, textTransform:'uppercase', letterSpacing:1 }}>Task Types</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {Object.entries(stats.task_types || {}).map(([type, count]) => (
                    <div key={type}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                        <span style={{ color:'var(--text-secondary)', textTransform:'capitalize' }}>{type}</span>
                        <span style={{ fontWeight:700 }}>{count}</span>
                      </div>
                      <ProgressBar value={count} max={stats.tasks?.total || 1} color="var(--accent)" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid var(--border)' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-card)' }}>
                    {['Name', 'Email', 'Role', 'Tasks', 'Status', 'Joined'].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1, borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom:'1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:600 }}>{u.full_name}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                          background: u.role==='admin' ? 'rgba(124,58,237,0.15)' : 'rgba(59,130,246,0.1)',
                          color: u.role==='admin' ? 'var(--accent-light)' : '#3b82f6' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700 }}>{u.task_count}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, color: u.is_active ? '#10b981' : '#ef4444' }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background: u.is_active ? '#10b981' : '#ef4444' }}/>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {tab === 'agents' && stats?.agents && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:12 }}>
            {stats.agents.map(a => (
              <div key={a.name} style={{ padding:20, borderRadius:16, background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Bot size={18} style={{ color:'var(--accent)' }}/>
                  <span style={{ fontSize:15, fontWeight:700, textTransform:'capitalize' }}>{a.name}</span>
                </div>
                <div style={{ display:'flex', gap:16 }}>
                  <div>
                    <div style={{ fontSize:22, fontWeight:800 }}>{a.total_runs}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>Total Runs</div>
                  </div>
                  <div>
                    <div style={{ fontSize:22, fontWeight:800 }}>{Math.round(a.avg_tokens)}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>Avg Tokens</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}