import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const materials = [
  {
    id: 'cement',
    name: 'Industrial Cement',
    category: 'Binding Agent',
    desc: 'Premium quality cement with optimized setting time and high compressive strength. Perfect for structural foundations.',
    price: '$12.50 / Bag',
    image: '/images/materials/cement.png',
    verified: true
  },
  {
    id: 'psand',
    name: 'P-Sand (Plastering)',
    category: 'Aggregates',
    desc: 'Fine-grade plastering sand, washed and graded for superior finish and workability in masonry applications.',
    price: '$45.00 / Unit',
    image: '/images/materials/psand.png',
    verified: true
  },
  {
    id: 'msand',
    name: 'M-Sand (Manufactured)',
    category: 'Aggregates',
    desc: 'High-quality crushed sand produced from hard granite stone. An eco-friendly and reliable alternative to river sand.',
    price: '$38.00 / Unit',
    image: '/images/materials/msand.png',
    verified: true
  },
  {
    id: 'tmt',
    name: 'TMT Reinforcement Bars',
    category: 'Structural Steel',
    desc: 'High-strength thermo-mechanically treated bars with excellent ductility and earthquake resistance.',
    price: '$720.00 / Ton',
    image: '/images/materials/tmt.png',
    verified: true
  }
]

export default function MaterialsPage() {
  return (
    <motion.div 
      className="materials-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="materials-header">
        <motion.div
          className="hud-label"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="hud-label-line" />
          Verified Inventory
        </motion.div>
        
        <motion.h1 
          className="hud-title-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          PREMIUM <em className="hud-title-accent">MATERIALS</em>
        </motion.h1>
        
        <motion.p 
          className="hud-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Every material in our catalog is source-verified and audited on the blockchain. 
          Ensuring structural integrity through immutable data.
        </motion.p>
      </div>

      <div className="materials-grid">
        {materials.map((m, i) => (
          <motion.div
            key={m.id}
            className="material-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
          >
            <div className="material-image-container">
              <img src={m.image} alt={m.name} className="material-image" />
              {m.verified && <span className="material-badge">VERIFIED</span>}
            </div>
            
            <div className="material-category" style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase' }}>
              {m.category}
            </div>
            
            <h3 className="material-title">{m.name}</h3>
            <p className="material-desc">{m.desc}</p>
            
            <div className="material-footer">
              <span className="material-price">{m.price}</span>
              <a href="#" className="material-verify-btn">VERIFY ON-CHAIN</a>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="hud-actions"
        style={{ marginTop: '80px', justifyContent: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Link to="/" className="hud-btn-secondary">
          RETURN TO DASHBOARD
        </Link>
        <a href="#" className="hud-btn-primary">
          REQUEST BULK QUOTE <span className="hud-btn-arrow">→</span>
        </a>
      </motion.div>
    </motion.div>
  )
}
