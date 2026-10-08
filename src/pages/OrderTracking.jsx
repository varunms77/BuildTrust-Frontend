import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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

const statusSteps = ['pending', 'confirmed', 'processing', 'in_transit', 'delivered'];
const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', in_transit: '#00b4d8', delivered: '#10b981', cancelled: '#ef4444' };

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [id]);

  async function fetchOrder() {
    try {
      const r = await axios.get(`/api/orders/${id}`);
      setOrder(r.data.order);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  if (loading) return <div className="dashboard-page" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'80vh'}}><div className="loader-text">Loading order...</div></div>;
  if (!order) return <div className="dashboard-page"><p className="dash-empty">Order not found</p><Link to="/" className="dash-track-btn">Go Home</Link></div>;

  const currentStepIndex = statusSteps.indexOf(order.status);
  const hasLocation = order.current_lat && order.current_lng;
  const hasDelivery = order.delivery_lat && order.delivery_lng;
  const locationHistory = order.order_locations || [];

  // Build full journey points
  const journeyPoints = [];
  locationHistory.forEach((loc, i) => {
    journeyPoints.push({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
      label: i === 0 ? 'Origin Location' : `Checkpoint ${i}`,
      time: loc.created_at,
      status: loc.status,
      type: i === 0 ? 'start' : (i === locationHistory.length - 1 && !hasDelivery ? 'current' : 'waypoint'),
    });
  });

  if (hasDelivery) {
    journeyPoints.push({
      lat: order.delivery_lat,
      lng: order.delivery_lng,
      address: order.delivery_address || 'Delivery Address',
      label: 'Delivery Destination',
      type: 'delivery',
    });
  }

  const pathCoords = journeyPoints.map(p => [p.lat, p.lng]);
  const mapBounds = pathCoords.length > 0 ? pathCoords : null;
  const mapCenter = pathCoords.length > 0 ? pathCoords[0] : [12.9716, 77.5946];

  function getMarkerIcon(type) {
    switch (type) {
      case 'start': return startIcon;
      case 'current': return currentIcon;
      case 'delivery': return deliveryIcon;
      default: return waypointIcon;
    }
  }

  return (
    <motion.div className="dashboard-page tracking-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Track Order <span className="gradient-text">{order.order_number}</span></h1>
          <p className="dash-welcome">Real-time location tracking</p>
        </div>
        <Link to="/" className="dash-logout">← Back</Link>
      </div>

      {/* STATUS TIMELINE */}
      <div className="track-timeline">
        {statusSteps.map((step, i) => (
          <div key={step} className={`track-step ${i <= currentStepIndex ? 'active' : ''} ${i === currentStepIndex ? 'current' : ''}`}>
            <div className="track-step-dot" style={i <= currentStepIndex ? { background: statusColors[step], boxShadow: `0 0 12px ${statusColors[step]}60` } : {}} />
            <span className="track-step-label">{step.replace('_', ' ')}</span>
            {i < statusSteps.length - 1 && <div className={`track-step-line ${i < currentStepIndex ? 'filled' : ''}`} />}
          </div>
        ))}
      </div>

      {/* ORDER INFO CARDS */}
      <div className="track-info-row">
        <div className="track-info-card">
          <div className="track-info-label">Status</div>
          <div className="track-info-value" style={{ color: statusColors[order.status] }}>{order.status.replace('_', ' ').toUpperCase()}</div>
        </div>
        <div className="track-info-card">
          <div className="track-info-label">Total</div>
          <div className="track-info-value">${parseFloat(order.total_amount).toFixed(2)}</div>
        </div>
        <div className="track-info-card">
          <div className="track-info-label">Items</div>
          <div className="track-info-value">{order.order_items?.length || 0}</div>
        </div>
        <div className="track-info-card">
          <div className="track-info-label">Last Updated</div>
          <div className="track-info-value" style={{fontSize:'14px'}}>{order.location_updated_at ? new Date(order.location_updated_at).toLocaleString() : 'N/A'}</div>
        </div>
      </div>

      {/* MAP */}
      <div className="track-map-container">
        <h3 className="track-map-title">📍 Live Location</h3>
        <div className="track-map">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            {mapBounds && <FitBounds bounds={mapBounds} />}
            {journeyPoints.map((pt, i) => (
              <Marker key={i} position={[pt.lat, pt.lng]} icon={getMarkerIcon(pt.type)}>
                <Popup>
                  <strong>{pt.label}</strong><br />
                  {pt.address}<br />
                  {pt.time && <small>Updated: {new Date(pt.time).toLocaleTimeString()}</small>}
                </Popup>
              </Marker>
            ))}
            {pathCoords.length > 1 && <Polyline positions={pathCoords} color="#00e5a0" weight={3} opacity={0.7} dashArray="10 5" />}
          </MapContainer>
        </div>
        {journeyPoints.length === 0 && <p className="track-no-loc">Location not yet updated by the supplier. Polling every 10 seconds...</p>}
      </div>

      {/* LOCATION HISTORY */}
      {locationHistory.length > 0 && (
        <div className="track-history">
          <h3 className="track-map-title">📋 Location History</h3>
          <div className="track-history-list">
            {locationHistory.map((loc, i) => (
              <div key={loc.id} className="track-history-item">
                <div className="track-history-dot" />
                <div>
                  <div className="track-history-addr">{loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}</div>
                  <div className="track-history-time">{new Date(loc.created_at).toLocaleString()} {loc.status && `· ${loc.status}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCKCHAIN */}
      <div className="track-blockchain">
        <h3 className="track-map-title">⛓️ Blockchain Verification</h3>
        {order.pinata_cid ? (
          <div className="track-cid-card" style={{flexWrap:'wrap', gap:'12px'}}>
            <span>IPFS CID:</span>
            <a href={`https://gateway.pinata.cloud/ipfs/${order.pinata_cid}`} target="_blank" rel="noreferrer">{order.pinata_cid}</a>
            <Link to={`/verify/${id}`} className="dash-verify-btn" style={{marginLeft:'auto', padding:'10px 20px'}}>View Full Verification →</Link>
          </div>
        ) : (
          <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
            <span style={{color:'var(--color-text-muted)', fontSize:'13px'}}>Not yet verified on blockchain</span>
            <Link to={`/verify/${id}`} className="dash-verify-btn" style={{padding:'10px 20px'}}>⛓️ Verify Chain</Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
