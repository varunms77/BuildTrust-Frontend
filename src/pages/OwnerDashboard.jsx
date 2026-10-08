import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [matForm, setMatForm] = useState({ name: '', category: '', description: '', price: '', unit: 'Bag', stock: '' });
  const [locForm, setLocForm] = useState({ orderId: '', address: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchOrders(); fetchMaterials(); }, []);

  async function fetchOrders() {
    try { const r = await axios.get('/api/orders'); setOrders(r.data.orders); } catch (e) { console.error(e); }
  }
  async function fetchMaterials() {
    try { const r = await axios.get('/api/materials'); setMaterials(r.data.materials); } catch (e) { console.error(e); }
  }

  async function addMaterial(e) {
    e.preventDefault();
    try {
      await axios.post('/api/materials', matForm);
      setMatForm({ name: '', category: '', description: '', price: '', unit: 'Bag', stock: '' });
      setShowAddMaterial(false);
      fetchMaterials();
      setMsg('Material added & pinned to IPFS ✓');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data?.error || 'Failed'); }
  }

  async function updateStatus(id, status) {
    try { await axios.put(`/api/orders/${id}/status`, { status }); fetchOrders(); } catch (e) { console.error(e); }
  }

  async function updateLocation(e) {
    e.preventDefault();
    try {
      setMsg('Finding location coordinates...');
      await axios.put(`/api/orders/${locForm.orderId}/location`, { address: locForm.address });
      setLocForm({ orderId: '', address: '' });
      setMsg('Location updated ✓');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data?.error || 'Failed to update location'); }
  }

  async function verifyOrder(id) {
    try {
      const r = await axios.post(`/api/orders/${id}/verify`);
      setMsg(`Order verified on IPFS: ${r.data.cid}`);
      fetchOrders();
      setTimeout(() => setMsg(''), 5000);
    } catch (err) { setMsg('Pinata verification failed'); }
  }

  const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', in_transit: '#00b4d8', delivered: '#10b981', cancelled: '#ef4444' };

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Owner <span className="gradient-text">Dashboard</span></h1>
          <p className="dash-welcome">Welcome, {user?.name} {user?.company && `· ${user.company}`}</p>
        </div>
        <button className="dash-logout" onClick={logout}>Logout</button>
      </div>

      {msg && <div className="dash-msg">{msg}</div>}

      <div className="dash-tabs">
        <button className={`dash-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders ({orders.length})</button>
        <button className={`dash-tab ${tab === 'materials' ? 'active' : ''}`} onClick={() => setTab('materials')}>Materials ({materials.length})</button>
        <button className={`dash-tab ${tab === 'location' ? 'active' : ''}`} onClick={() => setTab('location')}>Update Location</button>
      </div>

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div className="dash-orders">
          {orders.length === 0 ? <div className="dash-empty modern-empty"><span style={{fontSize:'48px', marginBottom:'16px', display:'block'}}>📦</span>No orders yet</div> : orders.map((o, i) => (
            <motion.div key={o.id} className="dash-order-card modern-order-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}}>
              <div className="modern-order-header">
                <div>
                  <span className="dash-order-num">{o.order_number}</span>
                  <div style={{fontSize:'12px', color:'var(--color-text-dim)', marginTop:'4px'}}>{new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className="dash-order-status" style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status], padding: '8px 16px', fontSize: '12px' }}>{o.status.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="modern-order-body">
                <div className="modern-order-col">
                  <span className="modern-order-label">Customer Info</span>
                  <span className="modern-order-val" style={{fontSize:'15px'}}>{o.customer?.name || 'N/A'}</span>
                </div>
                <div className="modern-order-col">
                  <span className="modern-order-label">Total Amount</span>
                  <span className="modern-order-val">${parseFloat(o.total_amount).toFixed(2)}</span>
                </div>
                <div className="modern-order-col" style={{flex: 1}}>
                  <span className="modern-order-label">Items Ordered ({o.order_items?.length || 0})</span>
                  <div className="dash-order-items" style={{marginBottom:0, marginTop:'4px'}}>
                    {o.order_items?.map((item, idx) => <span key={idx} className="dash-item-tag">{item.material_name} ×{item.quantity}</span>)}
                  </div>
                </div>
              </div>
              <div className="modern-order-footer" style={{flexWrap: 'wrap', alignItems: 'center'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                  <span style={{fontSize:'11px', fontWeight:'700', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'1px'}}>Update Status:</span>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="dash-role-select" style={{padding:'10px 16px', fontSize:'13px', borderRadius:'8px'}}>
                    {['pending','confirmed','processing','in_transit','delivered','cancelled'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div style={{display:'flex', gap:'12px', marginLeft:'auto'}}>
                  <Link to={`/verify/${o.id}`} className="dash-verify-btn" style={{padding:'10px 20px', fontSize:'13px'}}>{o.pinata_cid ? '✓ View Verification' : '⛓️ Verify Chain'}</Link>
                  <Link to={`/track/${o.id}`} className="dash-track-btn" style={{padding:'10px 20px', fontSize:'13px'}}>📍 Live Tracking</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MATERIALS TAB */}
      {tab === 'materials' && (
        <div>
          <button className="dash-add-btn" onClick={() => setShowAddMaterial(!showAddMaterial)} style={{marginBottom:'24px'}}>{showAddMaterial ? '− Cancel' : '+ Add New Material'}</button>
          
          {showAddMaterial && (
            <motion.form className="dash-form" onSubmit={addMaterial} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} style={{background:'rgba(255,255,255,0.02)', padding:'32px', borderRadius:'20px', border:'1px solid var(--color-glass-border)', marginBottom:'32px', maxWidth:'100%'}}>
              <h3 className="dash-form-title">Create New Material</h3>
              <p style={{fontSize:'13px', color:'var(--color-text-dim)', marginBottom:'20px'}}>This material will be cryptographically verified and pinned to IPFS upon creation.</p>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', width:'100%'}}>
                <input placeholder="Material Name (e.g. Premium Cement)" value={matForm.name} onChange={e => setMatForm({...matForm, name: e.target.value})} required style={{width:'100%'}} />
                <input placeholder="Category (e.g. Binding Agent)" value={matForm.category} onChange={e => setMatForm({...matForm, category: e.target.value})} required style={{width:'100%'}} />
              </div>
              
              <textarea placeholder="Detailed Description..." value={matForm.description} onChange={e => setMatForm({...matForm, description: e.target.value})} rows={3} style={{width:'100%', resize:'none', marginTop:'16px'}} />
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'16px', marginTop:'16px'}}>
                <input type="number" step="any" placeholder="Price ($)" value={matForm.price} onChange={e => setMatForm({...matForm, price: e.target.value})} required style={{width:'100%'}} />
                <select value={matForm.unit} onChange={e => setMatForm({...matForm, unit: e.target.value})} style={{width:'100%', padding:'14px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--color-glass-border)', borderRadius:'10px', color:'var(--color-text)'}}>
                  <option>Bag</option><option>Ton</option><option>Unit</option><option>Piece</option><option>Cubic Meter</option>
                </select>
                <input type="number" placeholder="Available Stock" value={matForm.stock} onChange={e => setMatForm({...matForm, stock: e.target.value})} style={{width:'100%'}} />
              </div>
              
              <button type="submit" className="auth-btn" style={{marginTop:'24px', padding:'16px 32px'}}>Add & Pin to IPFS →</button>
            </motion.form>
          )}

          <div className="dash-materials-grid">
            {materials.map((m, i) => (
              <motion.div key={m.id} className="dash-browse-card modern-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                {m.pinata_cid && <span className="dash-verified-badge">⛓️ Verified on IPFS</span>}
                <div className="modern-card-img-wrap">
                  {m.image ? <img src={m.image} alt={m.name} className="modern-card-img" /> : <div className="modern-card-img-placeholder">🏗️</div>}
                </div>
                <div className="modern-card-content">
                  <div className="dash-mat-name">{m.name}</div>
                  <div className="dash-mat-cat">{m.category}</div>
                  <div className="dash-mat-price" style={{marginTop:'auto', paddingTop:'16px'}}>${parseFloat(m.price).toFixed(2)} <span style={{fontSize:'12px', color:'var(--color-text-muted)'}}>/ {m.unit}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* LOCATION TAB */}
      {tab === 'location' && (
        <div style={{display:'flex', justifyContent:'center'}}>
          <form className="dash-form" onSubmit={updateLocation} style={{background:'rgba(255,255,255,0.02)', padding:'40px', borderRadius:'24px', border:'1px solid var(--color-glass-border)', width:'100%', maxWidth:'600px', marginTop:'24px'}}>
            <div style={{textAlign:'center', marginBottom:'32px'}}>
              <span style={{fontSize:'48px', display:'block', marginBottom:'16px'}}>📍</span>
              <h3 className="dash-title" style={{fontSize:'28px', marginBottom:'8px'}}>Live Delivery Update</h3>
              <p style={{color:'var(--color-text-dim)', fontSize:'14px'}}>Update the current location of an active order. Customers will see this live on their map.</p>
            </div>
            
            <label style={{fontSize:'11px', fontWeight:'700', letterSpacing:'1px', color:'var(--color-text-dim)', textTransform:'uppercase', marginBottom:'-6px'}}>Select Active Order</label>
            <select value={locForm.orderId} onChange={e => setLocForm({...locForm, orderId: e.target.value})} required className="dash-role-select" style={{width:'100%',padding:'16px', background:'rgba(255,255,255,0.04)'}}>
              <option value="">-- Choose an order --</option>
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(o => <option key={o.id} value={o.id}>{o.order_number} — {o.customer?.name} ({o.status.replace('_', ' ')})</option>)}
            </select>
            
            <label style={{fontSize:'11px', fontWeight:'700', letterSpacing:'1px', color:'var(--color-text-dim)', textTransform:'uppercase', marginTop:'8px', marginBottom:'-6px'}}>Current Location Name</label>
            <input placeholder="E.g., Highway 101 Checkpoint, or New York, NY" value={locForm.address} onChange={e => setLocForm({...locForm, address: e.target.value})} required style={{padding:'16px'}} />
            
            <button type="submit" className="auth-btn" style={{padding:'18px', fontSize:'14px', marginTop:'24px'}}>Broadcast Location Update →</button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
