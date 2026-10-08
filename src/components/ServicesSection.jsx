import React from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const services = [
  {
    icon: '🔗',
    title: 'Blockchain Verification',
    desc: 'Every material order, delivery, and quality check is immutably recorded on-chain, creating a tamper-proof audit trail.',
    num: '01',
    gradient: 'linear-gradient(135deg, rgba(0,229,160,0.15), rgba(0,180,216,0.05))',
  },
  {
    icon: '📡',
    title: 'Real-Time Tracking',
    desc: 'Monitor construction materials from origin to site with IoT-enabled tracking and live dashboard analytics.',
    num: '02',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.05))',
  },
  {
    icon: '🏗️',
    title: '3D Site Visualization',
    desc: 'Immersive digital twins of construction sites let stakeholders inspect progress from anywhere in the world.',
    num: '03',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(251,146,60,0.05))',
  },
]

export default function ServicesSection() {
  const [ref, isVisible] = useScrollAnimation(0.15)

  return (
    <section className="section services-section" id="services" ref={ref}>
      {/* Background accent */}
      <div className="section-bg-glow section-bg-glow-left" />

      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -40 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-label-line" />
        What We Offer
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Services Built on
        <br />
        <span className="hero-title-gradient">Unshakable Trust</span>
      </motion.h2>

      <motion.p
        className="section-description"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        End-to-end transparency for every stakeholder in the construction supply chain.
      </motion.p>

      <div className="services-grid">
        {services.map((service, i) => (
          <motion.div
            key={service.num}
            className="service-card"
            initial={{ opacity: 0, y: 80, rotateX: 15 }}
            animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.3 + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -12,
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 229, 160, 0.08)',
              transition: { duration: 0.4 },
            }}
            style={{ perspective: '1000px' }}
          >
            <div className="service-card-glow" style={{ background: service.gradient }} />
            <span className="service-card-number">{service.num}</span>
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-card-title">{service.title}</h3>
            <p className="service-card-text">{service.desc}</p>
            <div className="service-card-arrow">→</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
