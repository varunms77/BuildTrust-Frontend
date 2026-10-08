import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different waypoint types
const startIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const waypointIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const currentIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const statusSteps = ['pending', 'confirmed', 'processing', 'in_transit', 'delivered'];
const statusColors = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  in_transit: '#00b4d8', delivered: '#10b981', cancelled: '#ef4444'
};
const statusEmojis = {
  pending: '🕐', confirmed: '✅', processing: '⚙️',
  in_transit: '🚚', delivered: '📦', cancelled: '❌'
};

// Component to auto-fit map bounds
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [map, bounds]);
  return null;
}

export default function VerifyChain() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [blockchainRecords, setBlockchainRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ipfsData, setIpfsData] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(null); // 'verified' | 'unverified' | 'error'

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function fetchAll() {
    try {
      const [orderRes, historyRes] = await Promise.all([
        axios.get(`/api/orders/${id}`),
        axios.get(`/api/blockchain/history/${id}`),
      ]);
      setOrder(orderRes.data.order);
      setBlockchainRecords(historyRes.data.records || []);

      // Verify CID if exists
      const cid = orderRes.data.order?.pinata_cid;
      if (cid) {
        try {
          const verifyRes = await axios.get(`/api/blockchain/verify/${cid}`);
          setIpfsData(verifyRes.data.data);
          setVerifyStatus(verifyRes.data.verified ? 'verified' : 'unverified');
        } catch {
          setVerifyStatus('error');
        }
      } else {
        setVerifyStatus('unverified');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Build map waypoints
  const locationHistory = order?.order_locations || [];
  const hasDelivery = order?.delivery_lat && order?.delivery_lng;

  const allPoints = useMemo(() => {
    const pts = [];
    // Add location history points
    locationHistory.forEach((loc, i) => {
      pts.push({
        lat: loc.lat, lng: loc.lng,
        address: loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
        label: i === 0 ? 'Origin' : `Checkpoint ${i}`,
        time: loc.created_at,
        status: loc.status,
        type: i === 0 ? 'start' : (i === locationHistory.length - 1 && !hasDelivery ? 'current' : 'waypoint'),
      });
    });
    // Add delivery destination
    if (hasDelivery) {
      pts.push({
        lat: order.delivery_lat, lng: order.delivery_lng,
        address: order.delivery_address || 'Delivery Location',
        label: 'Destination',
        type: 'delivery',
      });
    }
    return pts;
  }, [locationHistory, hasDelivery, order]);

  const pathCoords = allPoints.map(p => [p.lat, p.lng]);
  const mapBounds = pathCoords.length > 0 ? pathCoords : null;
  const mapCenter = pathCoords.length > 0 ? pathCoords[0] : [12.9716, 77.5946];

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  function getMarkerIcon(type) {
    switch (type) {
      case 'start': return startIcon;
      case 'current': return currentIcon;
      case 'delivery': return deliveryIcon;
      default: return waypointIcon;
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ width: 48, height: 48, border: '3px solid rgba(0,229,160,0.2)', borderTop: '3px solid #00e5a0', borderRadius: '50%', margin: '0 auto 20px' }}
          />
          <div className="loader-text" style={{ fontSize: 13 }}>VERIFYING ON-CHAIN DATA...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="dashboard-page">
        <p className="dash-empty">Order not found</p>
        <Link to="/" className="dash-track-btn">Go Home</Link>
      </div>
    );
  }

  return (
    <motion.div className="dashboard-page verify-chain-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ── HEADER ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            <span className="gradient-text">⛓️</span> Chain Verification
          </h1>
          <p className="dash-welcome">
            Order <strong>{order.order_number}</strong> — End-to-end supply chain audit trail
          </p>
        </div>
        <Link to={`/track/${id}`} className="dash-logout" style={{ color: '#00b4d8', borderColor: 'rgba(0,180,216,0.3)' }}>
          ← Back to Tracking
        </Link>
      </div>

      {/* ── VERIFICATION BADGE ── */}
      <motion.div
        className={`vc-verify-banner ${verifyStatus}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="vc-verify-icon">
          {verifyStatus === 'verified' ? '✅' : verifyStatus === 'error' ? '❌' : '⏳'}
        </div>
        <div className="vc-verify-info">
          <div className="vc-verify-title">
            {verifyStatus === 'verified' ? 'Blockchain Verified' : verifyStatus === 'error' ? 'Verification Failed' : 'Not Yet Verified'}
          </div>
          <div className="vc-verify-desc">
            {verifyStatus === 'verified'
              ? 'This order has been cryptographically pinned to IPFS and its integrity is confirmed.'
              : verifyStatus === 'error'
              ? 'Could not reach the verification network. Please try again later.'
              : 'This order has not been pinned to the blockchain yet.'}
          </div>
        </div>
        {order.pinata_cid && (
          <a
            href={`https://gateway.pinata.cloud/ipfs/${order.pinata_cid}`}
            target="_blank" rel="noreferrer"
            className="vc-verify-link"
          >
            View on IPFS →
          </a>
        )}
      </motion.div>

      {/* ── STATUS TIMELINE ── */}
      <motion.div
        className="vc-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="vc-section-title">
          <span className="vc-section-icon">📊</span> Order Status Pipeline
        </h2>
        <div className="vc-timeline">
          {statusSteps.map((step, i) => (
            <div key={step} className={`vc-timeline-step ${i <= currentStepIndex ? 'completed' : ''} ${i === currentStepIndex ? 'current' : ''}`}>
              <div
                className="vc-timeline-dot"
                style={i <= currentStepIndex ? {
                  background: statusColors[step],
                  boxShadow: `0 0 20px ${statusColors[step]}50`,
                  borderColor: statusColors[step],
                } : {}}
              >
                <span>{i <= currentStepIndex ? statusEmojis[step] : (i + 1)}</span>
              </div>
              <div className="vc-timeline-label">{step.replace('_', ' ')}</div>
              {i < statusSteps.length - 1 && (
                <div className={`vc-timeline-line ${i < currentStepIndex ? 'filled' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── MAP — SUPPLY CHAIN ROUTE ── */}
      <motion.div
        className="vc-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="vc-section-title">
          <span className="vc-section-icon">🗺️</span> Supply Chain Route
        </h2>
        <div className="vc-map-legend">
          <span className="vc-legend-item"><span className="vc-legend-dot" style={{ background: '#2196F3' }} />Origin</span>
          <span className="vc-legend-item"><span className="vc-legend-dot" style={{ background: '#8b5cf6' }} />Checkpoint</span>
          <span className="vc-legend-item"><span className="vc-legend-dot" style={{ background: '#ef4444' }} />Current</span>
          <span className="vc-legend-item"><span className="vc-legend-dot" style={{ background: '#10b981' }} />Destination</span>
        </div>
        <div className="vc-map-wrap">
          {allPoints.length > 0 ? (
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '16px' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {mapBounds && <FitBounds bounds={mapBounds} />}
              {allPoints.map((pt, i) => (
                <Marker key={i} position={[pt.lat, pt.lng]} icon={getMarkerIcon(pt.type)}>
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <strong style={{ fontSize: 14 }}>{pt.label}</strong><br />
                      <span style={{ fontSize: 12, color: '#555' }}>{pt.address}</span><br />
                      {pt.time && <small style={{ color: '#888' }}>{new Date(pt.time).toLocaleString()}</small>}
                      {pt.status && <><br /><span style={{ fontSize: 11, background: `${statusColors[pt.status]}20`, color: statusColors[pt.status], padding: '2px 8px', borderRadius: 8 }}>{pt.status.replace('_', ' ')}</span></>}
                    </div>
                  </Popup>
                </Marker>
              ))}
              {pathCoords.length > 1 && (
                <Polyline
                  positions={pathCoords}
                  color="#00e5a0"
                  weight={4}
                  opacity={0.8}
                  dashArray="12 8"
                />
              )}
            </MapContainer>
          ) : (
            <div className="vc-map-empty">
              <span style={{ fontSize: 48 }}>🗺️</span>
              <p>No location data available yet.</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Location waypoints will appear here once the supplier updates the shipment route.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── LOCATION HISTORY / JOURNEY LOG ── */}
      <motion.div
        className="vc-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="vc-section-title">
          <span className="vc-section-icon">📋</span> Journey History
        </h2>
        {locationHistory.length > 0 ? (
          <div className="vc-journey-timeline">
            {locationHistory.map((loc, i) => (
              <motion.div
                key={loc.id || i}
                className={`vc-journey-item ${i === locationHistory.length - 1 ? 'latest' : ''}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <div className="vc-journey-connector">
                  <div className="vc-journey-dot" style={i === 0 ? { background: '#3b82f6', boxShadow: '0 0 12px rgba(59,130,246,0.5)' } : i === locationHistory.length - 1 ? { background: '#00e5a0', boxShadow: '0 0 12px rgba(0,229,160,0.5)' } : {}} />
                  {i < locationHistory.length - 1 && <div className="vc-journey-line" />}
                </div>
                <div className="vc-journey-content">
                  <div className="vc-journey-header">
                    <span className="vc-journey-label">{i === 0 ? '🏭 Origin Point' : i === locationHistory.length - 1 ? '📍 Latest Location' : `📦 Checkpoint ${i}`}</span>
                    <span className="vc-journey-time">{new Date(loc.created_at).toLocaleString()}</span>
                  </div>
                  <div className="vc-journey-address">{loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}</div>
                  {loc.status && (
                    <span
                      className="vc-journey-status"
                      style={{ background: `${statusColors[loc.status] || '#666'}15`, color: statusColors[loc.status] || '#666', border: `1px solid ${statusColors[loc.status] || '#666'}30` }}
                    >
                      {loc.status.replace('_', ' ')}
                    </span>
                  )}
                  <div className="vc-journey-coords">
                    {loc.lat.toFixed(6)}°N, {loc.lng.toFixed(6)}°E
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Destination as final entry */}
            {hasDelivery && (
              <motion.div
                className="vc-journey-item destination"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + locationHistory.length * 0.08 }}
              >
                <div className="vc-journey-connector">
                  <div className="vc-journey-dot" style={{ background: '#10b981', boxShadow: '0 0 12px rgba(16,185,129,0.5)' }} />
                </div>
                <div className="vc-journey-content">
                  <div className="vc-journey-header">
                    <span className="vc-journey-label">🏠 Delivery Destination</span>
                  </div>
                  <div className="vc-journey-address">{order.delivery_address}</div>
                  <div className="vc-journey-coords">
                    {order.delivery_lat.toFixed(6)}°N, {order.delivery_lng.toFixed(6)}°E
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="vc-empty-section">
            <span>📭</span>
            <p>No journey data recorded yet</p>
          </div>
        )}
      </motion.div>

      {/* ── BLOCKCHAIN RECORDS ── */}
      <motion.div
        className="vc-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="vc-section-title">
          <span className="vc-section-icon">⛓️</span> Blockchain Records
        </h2>
        {blockchainRecords.length > 0 ? (
          <div className="vc-blockchain-grid">
            {blockchainRecords.map((rec, i) => (
              <motion.div
                key={rec.id}
                className="vc-blockchain-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="vc-bc-header">
                  <span className="vc-bc-type">{rec.entity_type}</span>
                  <span className="vc-bc-time">{new Date(rec.created_at).toLocaleString()}</span>
                </div>
                <div className="vc-bc-cid-row">
                  <span className="vc-bc-label">IPFS CID</span>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${rec.pinata_cid}`}
                    target="_blank" rel="noreferrer"
                    className="vc-bc-cid"
                  >
                    {rec.pinata_cid}
                  </a>
                </div>
                {rec.metadata && (
                  <div className="vc-bc-meta">
                    {rec.metadata.order_number && <span>Order: <strong>{rec.metadata.order_number}</strong></span>}
                    {rec.metadata.total_amount && <span>Amount: <strong>${parseFloat(rec.metadata.total_amount).toFixed(2)}</strong></span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="vc-empty-section">
            <span>🔗</span>
            <p>No blockchain records found for this order</p>
          </div>
        )}
      </motion.div>

      {/* ── ORDER DETAILS SUMMARY ── */}
      <motion.div
        className="vc-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="vc-section-title">
          <span className="vc-section-icon">📦</span> Order Summary
        </h2>
        <div className="vc-summary-grid">
          <div className="vc-summary-card">
            <div className="vc-summary-icon">💰</div>
            <div className="vc-summary-label">Total Amount</div>
            <div className="vc-summary-value">${parseFloat(order.total_amount).toFixed(2)}</div>
          </div>
          <div className="vc-summary-card">
            <div className="vc-summary-icon">📦</div>
            <div className="vc-summary-label">Items</div>
            <div className="vc-summary-value">{order.order_items?.length || 0}</div>
          </div>
          <div className="vc-summary-card">
            <div className="vc-summary-icon">📍</div>
            <div className="vc-summary-label">Checkpoints</div>
            <div className="vc-summary-value">{locationHistory.length}</div>
          </div>
          <div className="vc-summary-card">
            <div className="vc-summary-icon">⛓️</div>
            <div className="vc-summary-label">On-Chain Records</div>
            <div className="vc-summary-value">{blockchainRecords.length}</div>
          </div>
        </div>
        {order.order_items && order.order_items.length > 0 && (
          <div className="vc-items-table">
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.material_name}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                    <td className="gradient-text" style={{ fontWeight: 700 }}>${parseFloat(item.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
