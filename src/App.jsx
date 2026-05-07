import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Industries from './components/Industries'
import Services from './components/Services'
import WhyAClean from './components/WhyAClean'
import Testimonials from './components/Testimonials'
import ServiceArea from './components/ServiceArea'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function WaveDivider() {
  return (
    <div
      style={{ backgroundColor: '#ffffff', lineHeight: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        overflow="visible"
        style={{ display: 'block', width: '100%', height: 80 }}
      >
        {/* Back wave — 40% opacity, drifts right */}
        <path
          className="wave-back"
          d="M-150,46 C120,18 360,70 600,46 C840,18 1080,68 1320,46 C1400,30 1530,56 1590,46 L1590,80 L-150,80 Z"
          fill="#0B2545"
          fillOpacity="0.4"
        />
        {/* Front wave — full opacity, drifts left */}
        <path
          className="wave-front"
          d="M-150,62 C200,40 420,80 660,62 C900,42 1120,80 1360,62 C1440,54 1530,68 1590,62 L1590,80 L-150,80 Z"
          fill="#0B2545"
        />
      </svg>
    </div>
  )
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/17324305494"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
      style={{ backgroundColor: '#25D366' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.48 3.44 1.32 4.88L2 22l5.28-1.36A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.92 13.8c-.2.56-1.16 1.08-1.6 1.12-.44.04-.84.2-2.84-.6-2.4-.96-3.96-3.4-4.08-3.56-.12-.16-1-1.33-1-2.56s.64-1.8.88-2.04c.24-.24.52-.28.68-.28h.48c.16 0 .36-.04.56.44.2.48.68 1.68.76 1.8.08.12.12.28.04.44-.08.16-.12.24-.24.4-.12.16-.24.28-.36.44-.12.12-.24.28-.12.52.12.24.56.92 1.2 1.48.84.72 1.52.96 1.76 1.08.24.12.36.08.52-.08.16-.16.64-.76.8-1 .16-.24.32-.2.52-.12.2.08 1.36.64 1.6.76.24.12.4.16.44.24.08.24.08.8-.12 1.36z" fill="white"/>
      </svg>
      <span className="text-white font-semibold text-sm whitespace-nowrap">Chat on WhatsApp</span>
    </a>
  )
}

function PageLoader() {
  return (
    <motion.div
      key="page-loader"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="AClean Building Solutions"
          role="img"
        >
          <defs>
            <linearGradient id="loaderAGrad" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#236B66" />
              <stop offset="100%" stopColor="#0F182B" />
            </linearGradient>
            <mask id="loaderCutoutMask">
              <rect width="100%" height="100%" fill="white" />
              <path
                fill="black"
                stroke="black"
                strokeWidth="8"
                strokeLinejoin="round"
                d="M148.04 167.56L148.04 167.56Q134.60 167.56 123.16 163.32Q111.72 159.08 103.32 151.24Q94.92 143.40 90.28 132.68Q85.64 121.96 85.64 109L85.64 109Q85.64 96.04 90.28 85.32Q94.92 74.60 103.32 66.76Q111.72 58.92 123.16 54.68Q134.60 50.44 148.04 50.44L148.04 50.44Q164.52 50.44 177.24 56.20Q189.96 61.96 198.28 72.84L198.28 72.84L174.44 94.12Q169.48 87.88 163.48 84.44Q157.48 81 149.96 81L149.96 81Q138.28 81 131 88.60Q123.72 96.20 123.72 109L123.72 109Q123.72 121.80 131 129.40Q138.28 137 149.96 137L149.96 137Q157.48 137 163.48 133.56Q169.48 130.12 174.44 123.88L174.44 123.88L198.28 145.16Q189.96 155.88 177.24 161.72Q164.52 167.56 148.04 167.56Z"
              />
            </mask>
          </defs>
          <g mask="url(#loaderCutoutMask)">
            <path
              fill="url(#loaderAGrad)"
              d="M41.36 165L2.96 165L51.92 53L89.04 53L138 165L98.96 165L91.44 145.48L48.88 145.48L41.36 165ZM70.16 90.12L59.28 118.28L81.04 118.28L70.16 90.12Z"
            />
          </g>
          <path
            fill="#1B2A41"
            d="M148.04 167.56L148.04 167.56Q134.60 167.56 123.16 163.32Q111.72 159.08 103.32 151.24Q94.92 143.40 90.28 132.68Q85.64 121.96 85.64 109L85.64 109Q85.64 96.04 90.28 85.32Q94.92 74.60 103.32 66.76Q111.72 58.92 123.16 54.68Q134.60 50.44 148.04 50.44L148.04 50.44Q164.52 50.44 177.24 56.20Q189.96 61.96 198.28 72.84L198.28 72.84L174.44 94.12Q169.48 87.88 163.48 84.44Q157.48 81 149.96 81L149.96 81Q138.28 81 131 88.60Q123.72 96.20 123.72 109L123.72 109Q123.72 121.80 131 129.40Q138.28 137 149.96 137L149.96 137Q157.48 137 163.48 133.56Q169.48 130.12 174.44 123.88L174.44 123.88L198.28 145.16Q189.96 155.88 177.24 161.72Q164.52 167.56 148.04 167.56Z"
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setIsLoaded(true), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <PageLoader key="loader" />}
      </AnimatePresence>
      <Cursor />
      <WhatsAppButton />
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navbar isLoaded={isLoaded} />
        <Hero isLoaded={isLoaded} />
        <TrustBar />
        <Industries />
        <Services />
        <WhyAClean />
        <Testimonials />
        <ServiceArea />
        <Contact />
        <FAQ />
        <WaveDivider />
        <Footer />
      </div>
    </>
  )
}
