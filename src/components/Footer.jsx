function Logo() {
  return (
    <img
      src="/logos/AClean_Logo dark background.svg"
      alt="AClean Building Solutions logo"
      style={{ height: 62, width: 'auto' }}
      loading="lazy"
      width="186"
      height="62"
    />
  )
}

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

function scrollTo(e, href) {
  e.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0B2545' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        {/* Mobile: single column centered | sm+: 2-col | lg+: 3-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Logo />
            <p className="mt-5 text-sm font-light" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Your facility. Our standard.
            </p>
            <p className="mt-3 text-sm font-light leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Commercial cleaning and building maintenance for medical offices, daycares, office
              buildings, and retail spaces across New Jersey, New York, and Pennsylvania.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
              {['Licensed', 'Insured', 'WBE Certified', 'NJ · NY · PA'].map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(23,168,168,0.1)', color: '#17A8A8', border: '1px solid rgba(23,168,168,0.2)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Contact */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="text-xs font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: '#17A8A8' }}>
              Quick Links
            </div>
            <div className="space-y-2 mb-8 w-full">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
                  className="block text-sm font-light py-1 transition-colors duration-200 min-h-[36px] flex items-center justify-center sm:justify-start"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: '#17A8A8' }}>
              Contact
            </div>
            <div className="space-y-1.5 text-sm font-light" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div>South River, NJ · Serving NJ · NY · PA</div>
              <div>+1 (732) 430-5494</div>
              <div className="break-all">contact@acleanbuildingsolutions.com</div>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col items-center sm:flex-row sm:justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs font-light text-center sm:text-left" style={{ color: 'rgba(255,255,255,0.3)' }}>
            &copy; 2026 A C Cleaning Services LLC. All rights reserved. AClean Building Solutions is a DBA of A C Cleaning Services LLC.
          </p>
          <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Licensed · Insured · Woman-Owned
          </p>
        </div>
      </div>
    </footer>
  )
}
