import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

function MiniChart() {
  const bars = useMemo(() =>
    Array.from({ length: 18 }, () => 20 + Math.random() * 80),
    []
  )
  return (
    <div className="dashboard-mini-chart">
      {bars.map((h, i) => (
        <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}

export default function DashboardSection() {
  const [ref, isVisible] = useScrollAnimation(0.15)

  return (
    <section className="section dashboard-section" id="dashboard" ref={ref}>
      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -30 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-label-line" />
        Live Dashboard
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Real-Time
        <br />
        <span className="hero-title-gradient">Construction Intelligence</span>
      </motion.h2>

      <motion.p
        className="section-description"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        Monitor every metric that matters — from material provenance to delivery performance — all in one place.
      </motion.p>

      <div className="dashboard-grid">
        {/* Card 1 — Verified Orders */}
        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          custom={0}
          whileHover={{ y: -6 }}
        >
          <div className="dashboard-card-header">
            <span className="dashboard-card-label">Verified Orders</span>
            <span className="dashboard-card-badge">Live</span>
          </div>
          <div className="dashboard-card-value gradient-text">2,847</div>
          <div className="dashboard-card-change">↑ 12.5% this month</div>
        </motion.div>

        {/* Card 2 — On-Chain Blocks */}
        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          custom={1}
          whileHover={{ y: -6 }}
        >
          <div className="dashboard-card-header">
            <span className="dashboard-card-label">On-Chain Blocks</span>
            <span className="dashboard-card-badge">Synced</span>
          </div>
          <div className="dashboard-card-value gradient-text">18,392</div>
          <div className="dashboard-card-change">↑ 8.3% this week</div>
        </motion.div>

        {/* Card 3 — Trust Score */}
        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          custom={2}
          whileHover={{ y: -6 }}
        >
          <div className="dashboard-card-header">
            <span className="dashboard-card-label">Trust Score</span>
            <span className="dashboard-card-badge">A+</span>
          </div>
          <div className="dashboard-card-value gradient-text">98.7%</div>
          <div className="dashboard-card-change">↑ Top 1% of builders</div>
        </motion.div>

        {/* Card 4 — Supply Chain Activity (wide) */}
        <motion.div
          className="dashboard-card wide"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          custom={3}
          whileHover={{ y: -4 }}
        >
          <div className="dashboard-card-header">
            <span className="dashboard-card-label">Supply Chain Activity</span>
            <span className="dashboard-card-badge">30 Days</span>
          </div>
          <MiniChart />
        </motion.div>

        {/* Card 5 — Active Sites */}
        <motion.div
          className="dashboard-card"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          custom={4}
          whileHover={{ y: -6 }}
        >
          <div className="dashboard-card-header">
            <span className="dashboard-card-label">Active Sites</span>
            <span className="dashboard-card-badge">Monitoring</span>
          </div>
          <div className="dashboard-card-value gradient-text">34</div>
          <div className="dashboard-card-change">↑ 3 new this week</div>
        </motion.div>
      </div>
    </section>
  )
}
