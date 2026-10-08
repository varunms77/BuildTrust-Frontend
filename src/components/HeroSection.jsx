import React from 'react'
import { motion } from 'framer-motion'
import Scene3D from './Scene3D'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.6 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
}

const fadeRight = {
  hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HeroSection({ scrollY }) {
  return (
    <section className="hero-section" id="hero">
      {/* 3D Canvas — full immersive background */}
      <div className="hero-canvas">
        <Scene3D scrollY={scrollY} />
      </div>

      {/* Ambient glows */}
      <motion.div
        className="hero-glow hero-glow-1"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-glow hero-glow-2"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Cinematic gradient overlay */}
      <div className="hero-vignette" />

      {/* Content overlay */}
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-badge" variants={fadeRight}>
          <span className="hero-badge-dot" />
          <span>Blockchain-Verified Construction</span>
        </motion.div>

        <motion.h1 className="hero-title" variants={fadeUp}>
          Build With
          <br />
          <span className="hero-title-gradient">Transparent</span>
          <br />
          Trust
        </motion.h1>

        <motion.p className="hero-subtitle" variants={fadeUp}>
          Revolutionizing construction supply chains with blockchain verification,
          real-time tracking, and immersive 3D visualization.
        </motion.p>

        <motion.div className="hero-actions" variants={fadeUp}>
          <motion.a
            href="#blockchain"
            className="btn-primary"
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0, 229, 160, 0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Platform
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
          <motion.a
            href="#services"
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Our Services
          </motion.a>
        </motion.div>

        {/* Floating stats bar */}
        <motion.div
          className="hero-stats"
          variants={fadeUp}
        >
          <div className="hero-stat">
            <span className="hero-stat-value">2,847</span>
            <span className="hero-stat-label">Verified Orders</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">18K+</span>
            <span className="hero-stat-label">On-Chain Blocks</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">98.7%</span>
            <span className="hero-stat-label">Trust Score</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span>Scroll to Explore</span>
        <div className="scroll-mouse">
          <div className="scroll-mouse-dot" />
        </div>
      </motion.div>
    </section>
  )
}
