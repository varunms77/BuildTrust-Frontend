import React from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function CTASection() {
  const [ref, isVisible] = useScrollAnimation(0.3)

  return (
    <section className="section cta-section" id="contact" ref={ref}>
      {/* Pulsing glow */}
      <div className="cta-glow" />

      <motion.div
        className="cta-content"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="cta-title">
          Ready to Build
          <br />
          <span className="hero-title-gradient">With Trust?</span>
        </h2>

        <p className="cta-description">
          Join the future of transparent construction. Every brick verified,
          every transaction recorded, every stakeholder confident.
        </p>

        <div className="cta-buttons">
          <motion.a
            href="#"
            className="btn-primary"
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0, 229, 160, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            Start Building
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
          <motion.a
            href="#"
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Book a Demo
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}
