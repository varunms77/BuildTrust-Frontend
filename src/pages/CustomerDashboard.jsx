import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('browse');
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchMaterials(); fetchOrders(); }, []);

  async function fetchMaterials() {
    try { const r = await axios.get('/api/materials'); setMaterials(r.data.materials); } catch (e) { console.error(e); }
  }
  async function fetchOrders() {
    try { const r = await axios.get('/api/orders'); setOrders(r.data.orders); } catch (e) { console.error(e); }
  }

  function addToCart(material) {
    const existing = cart.find(c => c.material_id === material.id);
    if (existing) {
      setCart(cart.map(c => c.material_id === material.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { material_id: material.id, name: material.name, price: material.price, unit: material.unit, quantity: 1 }]);
    }
    setMsg(`${material.name} added to cart`);
    setTimeout(() => setMsg(''), 2000);
  }

  function removeFromCart(materialId) {
    setCart(cart.filter(c => c.material_id !== materialId));
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (cart.length === 0) return setMsg('Cart is empty');
    if (!address) return setMsg('Enter delivery address');
    try {
      const items = cart.map(c => ({ material_id: c.material_id, quantity: c.quantity }));
      await axios.post('/api/orders', { items, delivery_address: address });
      setCart([]);
      setAddress('');
      setMsg('Order placed successfully! ✓');
      fetchOrders();
      setTab('orders');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.response?.data?.error || 'Failed to place order'); }
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', in_transit: '#00b4d8', delivered: '#10b981', cancelled: '#ef4444' };

  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Customer <span className="gradient-text">Dashboard</span></h1>
          <p className="dash-welcome">Welcome, {user?.name}</p>
        </div>
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
          {cart.length > 0 && <span className="dash-cart-badge" onClick={() => setTab('cart')}>🛒 {cart.length}</span>}
          <button className="dash-logout" onClick={logout}>Logout</button>
        </div>
      </div>

      {msg && <div className="dash-msg">{msg}</div>}

      <div className="dash-tabs">
        <button className={`dash-tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>Browse Materials</button>
        <button className={`dash-tab ${tab === 'cart' ? 'active' : ''}`} onClick={() => setTab('cart')}>Cart ({cart.length})</button>
        <button className={`dash-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>My Orders ({orders.length})</button>
      </div>

      {/* BROWSE */}
      {tab === 'browse' && (
        <div className="dash-materials-grid">
          {materials.map((m, i) => (
            <motion.div key={m.id} className="dash-browse-card modern-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {m.verified && <span className="dash-verified-badge">⛓️ Verified</span>}
              <div className="modern-card-img-wrap">
                {m.image ? <img src={m.image} alt={m.name} className="modern-card-img" /> : <div className="modern-card-img-placeholder">🏗️</div>}
              </div>
              <div className="modern-card-content">
                <div className="dash-mat-name">{m.name}</div>
                <div className="dash-mat-cat">{m.category}</div>
                <p className="dash-mat-desc line-clamp-2">{m.description}</p>
                <div className="dash-mat-bottom">
                  <span className="dash-mat-price">${parseFloat(m.price).toFixed(2)} <span style={{fontSize:'12px', color:'var(--color-text-muted)'}}>/ {m.unit}</span></span>
                  <button className="dash-add-cart-btn" onClick={() => addToCart(m)}>Add to Cart</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CART */}
      {tab === 'cart' && (
        <div className="modern-cart-container">
          {cart.length === 0 ? <div className="dash-empty modern-empty"><span style={{fontSize:'48px', marginBottom:'16px', display:'block'}}>🛒</span>Your cart is empty. Browse materials to add items.</div> : (
            <div className="modern-cart-split">
              <div className="modern-cart-items">
                <h3 className="dash-form-title">Your Items</h3>
                {cart.map((c, i) => (
                  <motion.div key={c.material_id} className="dash-cart-item modern-cart-item" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: i*0.05}}>
                    <div>
                      <div className="dash-mat-name">{c.name}</div>
                      <div className="dash-mat-price" style={{fontSize:'14px', marginTop:'4px'}}>${c.price.toFixed(2)} / {c.unit} × {c.quantity}</div>
                    </div>
                    <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                      <div className="modern-qty-control">
                        <button onClick={() => setCart(cart.map(x => x.material_id === c.material_id ? {...x, quantity: Math.max(1, x.quantity-1)} : x))}>−</button>
                        <span>{c.quantity}</span>
                        <button onClick={() => setCart(cart.map(x => x.material_id === c.material_id ? {...x, quantity: x.quantity+1} : x))}>+</button>
                      </div>
                      <div style={{fontWeight:'800', width:'80px', textAlign:'right'}}>${(c.price * c.quantity).toFixed(2)}</div>
                      <button className="dash-delete-btn" onClick={() => removeFromCart(c.material_id)}>✕</button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="modern-cart-summary">
                <h3 className="dash-form-title">Order Summary</h3>
                <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>Taxes & Fees</span><span>Calculated at checkout</span></div>
                <div className="summary-total"><span>Total</span><span className="gradient-text">${cartTotal.toFixed(2)}</span></div>
                <form onSubmit={placeOrder} className="dash-form" style={{marginTop:'24px'}}>
                  <label style={{fontSize:'11px', fontWeight:'700', letterSpacing:'1px', color:'var(--color-text-dim)', textTransform:'uppercase', marginBottom:'8px'}}>Delivery Address</label>
                  <textarea placeholder="Enter full delivery address" value={address} onChange={e => setAddress(e.target.value)} required rows={3} style={{resize:'none'}} />
                  <button type="submit" className="auth-btn" style={{width:'100%', marginTop:'16px'}}>Secure Checkout →</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div className="dash-orders">
          {orders.length === 0 ? <div className="dash-empty modern-empty"><span style={{fontSize:'48px', marginBottom:'16px', display:'block'}}>📦</span>No orders placed yet.</div> : orders.map((o, i) => (
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
                  <span className="modern-order-label">Total Amount</span>
                  <span className="modern-order-val">${parseFloat(o.total_amount).toFixed(2)}</span>
                </div>
                <div className="modern-order-col">
                  <span className="modern-order-label">Items Ordered</span>
                  <div className="dash-order-items" style={{marginBottom:0, marginTop:'4px'}}>
                    {o.order_items?.map((item, idx) => <span key={idx} className="dash-item-tag">{item.material_name} ×{item.quantity}</span>)}
                  </div>
                </div>
                <div className="modern-order-col" style={{flex: 1}}>
                  <span className="modern-order-label">Delivery Address</span>
                  <span className="modern-order-val" style={{fontSize:'13px', fontWeight:'500', color:'var(--color-text-dim)'}}>{o.delivery_address}</span>
                </div>
              </div>
              <div className="modern-order-footer">
                <Link to={`/track/${o.id}`} className="dash-track-btn" style={{padding:'12px 24px', fontSize:'13px'}}>📍 Live GPS Tracking</Link>
                <Link to={`/verify/${o.id}`} className="dash-verify-btn" style={{padding:'12px 24px', fontSize:'13px'}}>{o.pinata_cid ? '✓ View Verification' : '⛓️ Verify Chain'}</Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
