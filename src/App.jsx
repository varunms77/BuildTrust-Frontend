import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import Scene3D from './components/Scene3D'
import MaterialsPage from './components/MaterialsPage'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import OrderTracking from './pages/OrderTracking'
import VerifyChain from './pages/VerifyChain'
import { useAuth } from './context/AuthContext'
import './index.css'

/* ═══════════════════════════════════════════════
   SECTION DATA — Each maps to a camera stop
   ═══════════════════════════════════════════════ */
const sections = [
  {
    id: 'hero',
    label: null,
    title: ['ARCHITECTURAL', 'BEYOND', '*TRUST*'],
    subtitle: 'High-fidelity verification for premium construction materials and structural engineering.',
    cta: { text: 'EXPLORE MATERIALS', href: '/materials' },
    secondary: { text: 'VIEW SKELETON', href: '#' },
  },
  {
    id: 'services',
    label: 'MATERIAL SHOWROOM',
    title: ['PREMIUM', '*CONSTRUCTION*', 'SUPPLY'],
    subtitle: 'From industrial-grade steel to high-density masonry. Every unit is blockchain-verified for quality and origin.',
    features: [
      { icon: '◆', name: 'Verified Structural Steel' },
      { icon: '◆', name: 'High-Density Masonry' },
      { icon: '◆', name: 'Certified Lumber & Timber' },
      { icon: '◆', name: 'Premium Cement & Coatings' },
    ],
  },
  {
    id: 'blockchain',
    label: 'STRUCTURAL INTEGRITY',
    title: ['ON-CHAIN', 'MATERIAL', '*AUTHENTICITY*'],
    subtitle: 'We trace every beam and bag from the source to the site. Building the future on a foundation of immutable data.',
    steps: ['SOURCE', 'VERIFIED', 'AUDITED', 'CHAIN'],
  },
  {
    id: 'dashboard',
    label: 'SUPPLY CHAIN ANALYTICS',
    title: ['REAL-TIME', '*INVENTORY*', 'TRACKING'],
    subtitle: 'Monitor material flow, quality scores, and verification status across your entire project portfolio.',
    stats: [
      { value: '42k', label: 'UNITS VERIFIED' },
      { value: '99.9%', label: 'PURITY SCORE' },
      { value: '2.4s', label: 'BLOCK LATENCY' },
    ],
  },
  {
    id: 'cta',
    label: null,
    title: ['SECURE YOUR', '*SUPPLY*', 'CHAIN'],
    subtitle: 'Join the next generation of transparent construction commerce. Verify your materials today.',
    cta: { text: 'GET STARTED', href: '/register' },
    secondary: { text: 'SIGN IN', href: '/login' },
  },
]

// Pages that should NOT show the 3D background
const noCanvasRoutes = ['/login', '/register', '/admin', '/owner', '/customer', '/verify']

/* ═══════════════════════════════════════════════
   APP — Single canvas + HUD overlays
   ═══════════════════════════════════════════════ */
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [navScrolled, setNavScrolled] = useState(false)
  const containerRef = useRef(null)
  const location = useLocation()
  const { user, logout } = useAuth()

  const isHome = location.pathname === '/'
  const isMaterials = location.pathname === '/materials'
  const isTrackPage = location.pathname.startsWith('/track/')
  const isVerifyPage = location.pathname.startsWith('/verify/')
  const showCanvas = !noCanvasRoutes.some(r => location.pathname.startsWith(r)) && !isTrackPage && !isVerifyPage

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    
    const handleScroll = () => {
      if (!isHome) return
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const progress = Math.min(window.scrollY / scrollHeight, 1)
      setScrollProgress(progress)

      const sectionCount = sections.length
      const range = 1 / sectionCount
      let index = Math.floor(progress / range)
      if (index >= sectionCount) index = sectionCount - 1
      setActiveSection(index)

      setNavScrolled(window.scrollY > 80)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [isHome])

  const effectiveScrollProgress = isMaterials ? 0.35 : scrollProgress
  const currentSection = sections[activeSection]

  return (
    <div className="app" ref={containerRef}>
      {/* ── LOADING SCREEN ── */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="loader-bar"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <div className="loader-text">INITIALIZING ENGINE...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Effects Overlay */}
      {showCanvas && <div className="grain-overlay" />}
      {showCanvas && <div className="scanline" />}

      {/* Fixed 3D Canvas — the persistent world */}
      {showCanvas && (
        <Suspense fallback={
          <Canvas style={{ position: 'fixed', inset: 0, background: '#050508' }}>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#00e5a0" emissive="#00e5a0" wireframe />
            </mesh>
          </Canvas>
        }>
          <Scene3D scrollProgress={effectiveScrollProgress} />
        </Suspense>
      )}

      {/* Scroll container that drives camera (Home Only) */}
      {isHome && (
        <div className="scroll-container">
          {sections.map((_, i) => (
            <div key={i} className="scroll-section" />
          ))}
        </div>
      )}

      {/* ── NAVBAR (HUD) ── */}
      <motion.nav
        className={`nav-hud ${navScrolled ? 'scrolled' : ''}`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark">B</div>
          <span className="nav-logo-text">Build<em>Trust</em></span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/materials" className="nav-link">Materials</Link>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'owner' ? '/owner' : '/customer'} className="nav-link">Dashboard</Link>
              <button onClick={logout} className="nav-link nav-link-cta" style={{background:'none',border:'none',cursor:'pointer'}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-link nav-link-cta">Get Started</Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* ── SECTION INDICATOR (Home Only) ── */}
      {isHome && (
        <div className="section-indicators">
          {sections.map((s, i) => (
            <div
              key={s.id}
              className={`indicator-dot ${i === activeSection ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })}
            />
          ))}
        </div>
      )}

      {/* ── ROUTE CONTENT ── */}
      <Routes>
        <Route path="/" element={
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              className={`hud-overlay ${activeSection === 0 || activeSection === 4 ? 'hud-center' : 'hud-left'}`}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentSection.label && (
                <motion.div className="hud-label" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                  <span className="hud-label-line" />
                  {currentSection.label}
                </motion.div>
              )}
              <div className="hud-title">
                {currentSection.title.map((line, i) => (
                  <motion.div key={i} className="hud-title-line" initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}>
                    {line.includes('*') ? (
                      <>{line.split('*').map((part, j) => j % 2 === 1 ? (<em key={j} className="hud-title-accent">{part}</em>) : (<span key={j}>{part}</span>))}</>
                    ) : (line)}
                  </motion.div>
                ))}
              </div>
              <motion.p className="hud-subtitle" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}>{currentSection.subtitle}</motion.p>
              {(currentSection.cta || currentSection.secondary) && (
                <motion.div className="hud-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
                  {currentSection.cta && (<Link to={currentSection.cta.href} className="hud-btn-primary">{currentSection.cta.text}<span className="hud-btn-arrow">→</span></Link>)}
                  {currentSection.secondary && (<Link to={currentSection.secondary.href} className="hud-btn-secondary">{currentSection.secondary.text}</Link>)}
                </motion.div>
              )}
              {currentSection.features && (
                <motion.div className="hud-features" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {currentSection.features.map((f, i) => (
                    <motion.div key={f.name} className="hud-feature" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}>
                      <span className="hud-feature-icon">{f.icon}</span>{f.name}
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {currentSection.steps && (
                <motion.div className="hud-steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {currentSection.steps.map((step, i) => (
                    <React.Fragment key={step}>
                      <motion.div className="hud-step" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}>
                        <span className="hud-step-num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="hud-step-name">{step}</span>
                      </motion.div>
                      {i < currentSection.steps.length - 1 && (
                        <motion.div className="hud-step-connector" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }} />
                      )}
                    </React.Fragment>
                  ))}
                </motion.div>
              )}
              {currentSection.stats && (
                <motion.div className="hud-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  {currentSection.stats.map((stat, i) => (
                    <motion.div key={stat.label} className="hud-stat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1, duration: 0.7 }}>
                      <span className="hud-stat-value">{stat.value}</span>
                      <span className="hud-stat-label">{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        } />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/owner" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/track/:id" element={<ProtectedRoute roles={['admin','owner','customer']}><OrderTracking /></ProtectedRoute>} />
        <Route path="/verify/:id" element={<ProtectedRoute roles={['admin','owner','customer']}><VerifyChain /></ProtectedRoute>} />
      </Routes>

      {/* ── SCROLL HINT (hero only) ── */}
      {isHome && activeSection === 0 && (
        <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 2.5, duration: 1 }}>
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-hint-mouse"><div className="scroll-hint-dot" /></div>
        </motion.div>
      )}

      {/* ── FOOTER BAR (HUD) ── */}
      <div className="footer-hud">
        <span>© 2026 BuildTrust</span>
        <span className="footer-hud-sep">·</span>
        <span>Blockchain Construction Transparency</span>
      </div>
    </div>
  )
}
