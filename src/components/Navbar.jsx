import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// Read from Vite env — set these in your .env file
const API_URL = import.meta.env.VITE_API_URL || ''
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || ''

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#industries', label: 'Industries' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

function scrollTo(href) {
  if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

// Status badge colors for the My Invoices table
const STATUS_COLOR = {
  paid:      '#16a34a',
  sent:      '#d97706',
  overdue:   '#dc2626',
  draft:     '#64748b',
  cancelled: '#9ca3af',
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtAmount(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0)
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inputStyle = (hasError = false) => ({
  backgroundColor: hasError ? '#FEF2F2' : '#F4F7FB',
  border: `1px solid ${hasError ? '#FCA5A5' : 'rgba(11,37,69,0.12)'}`,
  color: '#0B2545',
})

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spin() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
        strokeDasharray="32" strokeLinecap="round" opacity="0.4" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ─── Portal Modal ─────────────────────────────────────────────────────────────
function PortalModal({ onClose }) {
  const [tab, setTab] = useState('admin')

  // Admin tab
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError]     = useState('')

  // My Invoices tab
  const [lookupEmail, setLookupEmail]   = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError]   = useState('')
  const [invoices, setInvoices]         = useState(null) // null = not searched yet

  const emailRef  = useRef(null)
  const lookupRef = useRef(null)

  useEffect(() => { setTimeout(() => emailRef.current?.focus(), 120) }, [])

  // Reset errors and focus the relevant input when switching tabs
  useEffect(() => {
    setAdminError('')
    setLookupError('')
    if (tab === 'admin')    setTimeout(() => emailRef.current?.focus(), 80)
    if (tab === 'invoices') setTimeout(() => lookupRef.current?.focus(), 80)
  }, [tab])

  // ── Admin submit ────────────────────────────────────────────────────────────
  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setAdminLoading(true)
    setAdminError('')
    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAdminError(data.error || 'Invalid credentials. Please try again.')
        return
      }
      // Store token in sessionStorage (cleared when tab closes — safer than localStorage)
      sessionStorage.setItem('dashboard_token', data.token)
      window.location.href = DASHBOARD_URL || '/'
    } catch {
      setAdminError('Connection failed. Please check your network and try again.')
    } finally {
      setAdminLoading(false)
    }
  }

  // ── Invoice lookup ──────────────────────────────────────────────────────────
  const handleLookup = async (e) => {
    e.preventDefault()
    if (!lookupEmail) return
    setLookupLoading(true)
    setLookupError('')
    setInvoices(null)
    try {
      const res  = await fetch(`${API_URL}/invoices/public/lookup?email=${encodeURIComponent(lookupEmail.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setLookupError(data.error || 'Failed to fetch invoices.')
        return
      }
      setInvoices(Array.isArray(data) ? data : [])
    } catch {
      setLookupError('Connection failed. Please check your network and try again.')
    } finally {
      setLookupLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ backgroundColor: 'rgba(11,37,69,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        className="w-full bg-white rounded-2xl overflow-hidden"
        style={{ maxWidth: 400, boxShadow: '0 24px 80px rgba(11,37,69,0.2)' }}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: '1px solid rgba(11,37,69,0.07)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(23,168,168,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#17A8A8" strokeWidth="1.6" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#17A8A8" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="#17A8A8" />
            </svg>
          </div>
          <h2 className="text-lg font-black mb-1" style={{ color: '#0B2545' }}>Client Portal</h2>
          <p className="text-xs font-light" style={{ color: '#94A3B8' }}>AClean Building Solutions</p>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex" style={{ borderBottom: '1px solid rgba(11,37,69,0.07)' }}>
          {[
            { key: 'admin',    label: 'Admin' },
            { key: 'invoices', label: 'My Invoices' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 py-3 text-sm font-semibold transition-colors duration-150 relative"
              style={{ color: tab === key ? '#17A8A8' : '#94A3B8' }}
            >
              {label}
              {tab === key && (
                <motion.span
                  layoutId="portal-tab-bar"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#17A8A8' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait" initial={false}>

          {/* Admin tab */}
          {tab === 'admin' && (
            <motion.form
              key="admin"
              onSubmit={handleAdminSubmit}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={{ duration: 0.16 }}
              className="px-8 py-6 space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: '#64748B' }}>Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl text-sm font-light focus:outline-none focus:ring-2 transition-all duration-200"
                  style={inputStyle()}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: '#64748B' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm font-light focus:outline-none focus:ring-2 transition-all duration-200"
                    style={inputStyle(!!adminError)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: '#94A3B8' }}
                  >
                    {showPw ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {adminError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-500 mt-1.5"
                    >{adminError}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-200 hover:brightness-110 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#17A8A8', minHeight: 48, opacity: adminLoading ? 0.85 : 1 }}
              >
                {adminLoading && <Spin />}
                {adminLoading ? 'Signing in…' : 'Access Dashboard'}
              </button>

              <button type="button" onClick={onClose}
                className="w-full py-2 text-xs font-medium transition-colors duration-200"
                style={{ color: '#94A3B8' }}>
                Cancel
              </button>
            </motion.form>
          )}

          {/* My Invoices tab */}
          {tab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.16 }}
              className="px-8 py-6"
            >
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                    style={{ color: '#64748B' }}>Your Email Address</label>
                  <input
                    ref={lookupRef}
                    type="email"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl text-sm font-light focus:outline-none focus:ring-2 transition-all duration-200"
                    style={inputStyle()}
                  />
                </div>

                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-200 hover:brightness-110 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#17A8A8', minHeight: 48, opacity: lookupLoading ? 0.85 : 1 }}
                >
                  {lookupLoading && <Spin />}
                  {lookupLoading ? 'Looking up…' : 'Look Up My Invoices'}
                </button>
              </form>

              {/* Error */}
              <AnimatePresence>
                {lookupError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-xs text-red-500 text-center"
                  >{lookupError}</motion.p>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {invoices !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4"
                  >
                    {invoices.length === 0 ? (
                      <p className="text-center text-sm py-6" style={{ color: '#94A3B8' }}>
                        No invoices found for this email.
                      </p>
                    ) : (
                      <div className="overflow-hidden rounded-xl"
                        style={{ border: '1px solid rgba(11,37,69,0.08)' }}>
                        <table className="w-full text-xs">
                          <thead>
                            <tr style={{ backgroundColor: 'rgba(11,37,69,0.04)' }}>
                              {['Invoice #', 'Date', 'Amount', 'Status'].map((h, i) => (
                                <th key={h}
                                  className={`px-3 py-2 font-semibold ${i >= 2 ? 'text-right' : 'text-left'}`}
                                  style={{ color: '#64748B' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((inv, i) => {
                              const color = STATUS_COLOR[inv.status] || '#64748b'
                              return (
                                <tr key={inv.invoiceNumber}
                                  style={{ borderTop: i > 0 ? '1px solid rgba(11,37,69,0.05)' : 'none' }}>
                                  <td className="px-3 py-2.5 font-medium" style={{ color: '#0B2545' }}>
                                    {inv.invoiceNumber}
                                  </td>
                                  <td className="px-3 py-2.5" style={{ color: '#64748B' }}>
                                    {fmtDate(inv.issueDate)}
                                  </td>
                                  <td className="px-3 py-2.5 text-right font-medium" style={{ color: '#0B2545' }}>
                                    {fmtAmount(inv.total)}
                                  </td>
                                  <td className="px-3 py-2.5 text-right">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                                      style={{ color, backgroundColor: color + '1a' }}>
                                      {inv.status}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="button" onClick={onClose}
                className="w-full mt-5 py-2 text-xs font-medium transition-colors duration-200"
                style={{ color: '#94A3B8' }}>
                Close
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar({ isLoaded }) {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen || portalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, portalOpen])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    scrollTo(href)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={isLoaded ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0)',
          borderBottom: scrolled ? '1px solid rgba(11,37,69,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px rgba(11,37,69,0.06)' : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex items-center flex-shrink-0"
            >
              <img src="/logos/AClean_Logo.svg" alt="AClean Building Solutions" style={{ height: 46, width: 'auto' }} className="md:hidden" />
              <img src="/logos/AClean_Logo.svg" alt="AClean Building Solutions" style={{ height: 62, width: 'auto' }} className="hidden md:block" />
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="relative text-sm font-medium tracking-wide transition-colors duration-200"
                  style={{ color: '#0B2545' }}
                  onMouseEnter={(e) => (e.target.style.color = '#17A8A8')}
                  onMouseLeave={(e) => (e.target.style.color = '#0B2545')}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {/* Client Portal button */}
              <button
                onClick={() => setPortalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200"
                style={{ color: '#0B2545', border: '1.5px solid rgba(11,37,69,0.18)', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#17A8A8'; e.currentTarget.style.color = '#17A8A8' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(11,37,69,0.18)'; e.currentTarget.style.color = '#0B2545' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Client Portal
              </button>

              {/* Get a Quote */}
              <a
                href="#contact"
                onClick={(e) => handleNav(e, '#contact')}
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-white transition-all duration-200"
                style={{ backgroundColor: '#17A8A8' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0E9090')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#17A8A8')}
              >
                Get a Quote
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center gap-1.5 w-11 h-11 p-2.5 rounded-lg"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              style={{ backgroundColor: mobileOpen ? 'rgba(11,37,69,0.06)' : 'transparent' }}
            >
              <motion.span className="block h-0.5 rounded-full" style={{ backgroundColor: '#0B2545' }} animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
              <motion.span className="block h-0.5 rounded-full" style={{ backgroundColor: '#0B2545' }} animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} />
              <motion.span className="block h-0.5 rounded-full" style={{ backgroundColor: '#0B2545' }} animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 z-[60] flex flex-col"
            style={{ backgroundColor: '#0B2545' }}
          >
            <div className="flex items-center justify-between px-5 h-16 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <img src="/logos/AClean_Logo dark background.svg" alt="AClean Building Solutions" style={{ height: 34, width: 'auto' }} />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2L2 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-8 overflow-y-auto">
              <nav className="flex flex-col mb-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                    className="flex items-center font-bold text-white text-2xl py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: 64 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile: Client Portal */}
              <motion.button
                onClick={() => { setMobileOpen(false); setTimeout(() => setPortalOpen(true), 320) }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + navLinks.length * 0.07 }}
                className="flex items-center justify-center gap-2 w-full rounded-xl font-semibold text-base mb-3"
                style={{ border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', minHeight: 52, backgroundColor: 'transparent' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Client Portal
              </motion.button>

              <motion.a
                href="#contact"
                onClick={(e) => handleNav(e, '#contact')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + navLinks.length * 0.07 + 0.07 }}
                className="flex items-center justify-center w-full rounded-xl font-semibold text-base text-white"
                style={{ backgroundColor: '#17A8A8', minHeight: 56 }}
              >
                Get a Quote
              </motion.a>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-8 text-center text-xs font-light"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Commercial Cleaning &amp; Building Maintenance · NJ · NY · PA
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal modal */}
      <AnimatePresence>
        {portalOpen && <PortalModal onClose={() => setPortalOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
