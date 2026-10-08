import React from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  { icon: '📋', label: 'Order', sub: 'Material Request', color: '#00e5a0' },
  { icon: '✅', label: 'Verified', sub: 'Quality Check', color: '#00b4d8' },
  { icon: '🧱', label: 'Block', sub: 'On-Chain Record', color: '#8b5cf6' },
  { icon: '⛓️', label: 'Chain', sub: 'Immutable Ledger', color: '#ec4899' },
]

export default function BlockchainSection() {
  const [ref, isVisible] = useScrollAnimation(0.15)

  return (
    <section className="section blockchain-section" id="blockchain" ref={ref}>
      {/* Background accent */}
      <div className="section-bg-glow section-bg-glow-center" />

      <motion.div
        className="section-label"
        initial={{ opacity: 0, x: -40 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ alignSelf: 'center' }}
      >
        <span className="section-label-line" />
        How It Works
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', alignSelf: 'center' }}
      >
        From Order to
        <br />
        <span className="hero-title-gradient">Immutable Record</span>
      </motion.h2>

      <motion.p
        className="section-description"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', alignSelf: 'center' }}
      >
        Every step in the supply chain is verified, recorded, and linked into an unbreakable chain of trust.
      </motion.p>

      <div className="blockchain-flow">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <motion.div
              className="flow-step"
              initial={{ opacity: 0, scale: 0.6, y: 60 }}
              animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.4 + i * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.div
                className="flow-step-box"
                whileHover={{
                  scale: 1.08,
                  boxShadow: `0 0 50px ${step.color}25`,
                  borderColor: `${step.color}40`,
                }}
                transition={{ duration: 0.3 }}
                style={{ '--step-color': step.color }}
              >
                <div className="flow-step-number">{String(i + 1).padStart(2, '0')}</div>
                <span className="flow-step-icon">{step.icon}</span>
                <span className="flow-step-label">{step.label}</span>
              </motion.div>
              <motion.span
                className="flow-step-sub"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
              >
                {step.sub}
              </motion.span>
            </motion.div>

            {i < steps.length - 1 && (
              <motion.div
                className="flow-connector"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isVisible ? { scaleX: 1, opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + i * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: 'left' }}
              >
                <div className="flow-connector-line">
                  <motion.div
                    className="flow-connector-pulse"
                    animate={{ x: [0, 60], opacity: [1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: i * 0.5,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
