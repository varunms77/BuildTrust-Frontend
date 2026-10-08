import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  async function fetchStats() {
    try { const r = await axios.get('/api/admin/stats'); setStats(r.data.stats); } catch (e) { console.error(e); }
  }
  async function fetchUsers() {
    try { const r = await axios.get('/api/admin/users'); setUsers(r.data.users); } catch (e) { console.error(e); }
  }
  async function changeRole(id, role) {
    try { await axios.put(`/api/admin/users/${id}/role`, { role }); fetchUsers(); } catch (e) { console.error(e); }
  }
  async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    try { await axios.delete(`/api/admin/users/${id}`); fetchUsers(); fetchStats(); } catch (e) { console.error(e); }
  }

  const statCards = stats ? [
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#00e5a0' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#00b4d8' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#ec4899' },
    { label: 'Blockchain Records', value: stats.blockchainRecords, icon: '⛓️', color: '#f472b6' },
  ] : [];

  const userChartData = stats ? [
    { name: 'Customers', value: stats.totalCustomers, color: '#8b5cf6' },
    { name: 'Owners', value: stats.totalOwners, color: '#00b4d8' },
    { name: 'Admins', value: Math.max(0, stats.totalUsers - stats.totalOwners - stats.totalCustomers), color: '#00e5a0' },
  ] : [];

  const orderChartData = stats ? [
    { name: 'Pending', count: stats.pendingOrders, fill: '#f59e0b' },
    { name: 'In Progress', count: Math.max(0, stats.totalOrders - stats.pendingOrders - stats.deliveredOrders), fill: '#8b5cf6' },
    { name: 'Delivered', count: stats.deliveredOrders, fill: '#10b981' },
  ] : [];

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Admin <span className="gradient-text">Command Center</span></h1>
          <p className="dash-welcome">Platform overview and user management</p>
        </div>
        <button className="dash-logout" onClick={logout}>Logout</button>
      </div>

      <div className="dash-tabs" style={{marginBottom:'40px'}}>
        <button className={`dash-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Analytics Overview</button>
        <button className={`dash-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>User Management</button>
      </div>

      {tab === 'overview' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Top Metrics Row */}
          <div className="dash-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {statCards.map((s, i) => (
              <motion.div key={s.label} className="dash-stat-card modern-card" style={{padding:'24px', position:'relative', overflow:'hidden'}} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{position:'absolute', top:'-20px', right:'-20px', fontSize:'120px', opacity:0.05}}>{s.icon}</div>
                <div className="dash-stat-icon" style={{ background: `${s.color}15`, color: s.color, width:'48px', height:'48px', fontSize:'24px', marginBottom:'20px' }}>{s.icon}</div>
                <div className="dash-stat-value" style={{fontSize:'36px', marginBottom:'8px'}}>{s.value}</div>
                <div className="dash-stat-label" style={{fontSize:'13px', textTransform:'uppercase', letterSpacing:'1px'}}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            
            {/* User Distribution Pie Chart */}
            <motion.div className="modern-card" style={{padding:'32px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--color-glass-border)', borderRadius:'24px'}} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="dash-form-title" style={{marginBottom:'24px'}}>User Distribution</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userChartData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                      {userChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{background:'#050508', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px'}} itemStyle={{color:'#fff'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{display:'flex', justifyContent:'center', gap:'24px', marginTop:'16px'}}>
                {userChartData.map(d => (
                  <div key={d.name} style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'var(--color-text-dim)'}}>
                    <span style={{width:'12px', height:'12px', borderRadius:'50%', background:d.color}}></span>
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Status Bar Chart */}
            <motion.div className="modern-card" style={{padding:'32px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--color-glass-border)', borderRadius:'24px'}} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="dash-form-title" style={{marginBottom:'24px'}}>Order Fulfillment Status</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill:'var(--color-text-dim)', fontSize:12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill:'var(--color-text-dim)', fontSize:12}} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background:'#050508', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px'}} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
                      {orderChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="dash-role-select">
                      <option value="customer">Customer</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{u.company || '—'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {u.id !== user.id && <button className="dash-delete-btn" onClick={() => deleteUser(u.id)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
