import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
    >
      <a href="#" className="navbar-logo">
        <div className="navbar-logo-icon">B</div>
        <div className="navbar-logo-text">
          Build<span>Trust</span>
        </div>
      </a>

      <ul className="navbar-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#blockchain">Blockchain</a></li>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#contact" className="navbar-cta">Get Started</a></li>
      </ul>
    </motion.nav>
  )
}
