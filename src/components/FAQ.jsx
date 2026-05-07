import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'

const EXPO = [0.16, 1, 0.3, 1]

const faqs = [
  {
    question: 'What commercial cleaning services does AClean Building Solutions offer?',
    answer:
      'AClean Building Solutions provides a full suite of commercial cleaning and facility services: recurring janitorial contracts, deep cleaning and EPA-grade disinfection, commercial window cleaning, pressure washing, floor care and restoration (strip, wax, buff, carpet extraction), post-construction cleanup, facility maintenance (lighting, HVAC filters, minor repairs), and commercial plumbing. All services are available as standalone jobs or bundled into a single managed contract for NJ, NY, and PA businesses.',
  },
  {
    question: 'Do you offer janitorial contracts for office buildings and corporate facilities?',
    answer:
      'Yes. Janitorial contracts are our most popular offering. We build custom schedules — daily, nightly, weekly, or any frequency that fits your operation — and assign a dedicated crew to your building so you always know who is on-site. Each visit includes floor care, restroom sanitization, trash removal, surface wipe-downs, and any facility-specific tasks you require. Contracts come with digital inspection checklists and automated post-visit reports.',
  },
  {
    question: 'Which areas of New Jersey, New York, and Pennsylvania does AClean serve?',
    answer:
      'Headquartered in South River, NJ, AClean Building Solutions serves commercial clients throughout the tri-state area. In New Jersey we cover Middlesex, Monmouth, Union, Essex, Hudson, Morris, and Bergen counties. We also take on commercial accounts across metro New York and eastern Pennsylvania. If you are unsure whether we reach your location, contact us — we will confirm within one business day.',
  },
  {
    question: 'Is AClean Building Solutions licensed, insured, and bonded?',
    answer:
      'Yes — fully. AClean Building Solutions is a licensed New Jersey business, carries full general liability insurance and active workers\' compensation coverage, and is bonded. Certificates of insurance are available on request and can be issued with your organization named as an additional insured. We are also a certified Woman-Owned Business Enterprise (WBE), which can count toward your procurement diversity goals.',
  },
  {
    question: 'Can you clean medical offices, clinics, and healthcare facilities?',
    answer:
      'Absolutely. Healthcare and medical-office cleaning is one of our core specialties. Our crews are trained in HIPAA-conscious protocols, infection control procedures, and the correct application of hospital-grade, EPA List N-registered disinfectants. We clean exam rooms, waiting areas, restrooms, nursing stations, and high-touch surfaces with documented disinfection logs available for compliance audits. We serve primary-care offices, dental offices, urgent-care clinics, and specialty-practice facilities across NJ, NY, and PA.',
  },
  {
    question: 'Do you provide cleaning services for daycares and schools?',
    answer:
      'Yes. Daycares, preschools, and educational facilities require a higher standard of disinfection due to the children they serve. AClean uses child-safe, non-toxic EPA-registered products and follows strict protocols for classrooms, play areas, restrooms, and cafeterias. We schedule cleaning during non-operating hours so there is no disruption to your program and children are never present during chemical application.',
  },
  {
    question: 'What does your facility maintenance service include?',
    answer:
      'Our facility maintenance program covers the ongoing upkeep your building needs outside of cleaning: lighting repair and lamp replacement, HVAC filter changes and vent maintenance, door and hardware upkeep, parking lot and exterior maintenance, minor carpentry and paint touch-ups, and preventive maintenance scheduling. We also coordinate multi-trade vendors on your behalf so you have a single point of contact for all building needs. This is ideal for property managers overseeing multiple commercial buildings.',
  },
  {
    question: 'Can AClean handle post-construction cleanup for commercial properties?',
    answer:
      'Yes — post-construction cleanup is one of our specialties. We handle both the rough clean phase (debris removal, drywall dust, scrap hauling) and the final detail clean (window glass, floors, fixtures, vents) required for inspection-ready turnover. Our crews are experienced with new construction, tenant improvement (TI) build-outs, and full renovation cleanups across office buildings, retail spaces, and medical facilities in NJ, NY, and PA.',
  },
  {
    question: 'How often should a commercial office or facility be cleaned?',
    answer:
      'For most office buildings and commercial facilities, daily or nightly cleaning of restrooms, break rooms, and high-traffic areas is recommended, with vacuuming and surface care at least three times per week. Healthcare facilities and daycares should receive daily thorough cleaning with disinfection. Retail and food-adjacent spaces may require twice-daily or continuous-duty cleaning. We will assess your facility and foot traffic during a free walkthrough and recommend a schedule that keeps your space compliant and presentable without overcharging.',
  },
  {
    question: 'Do you offer green or eco-friendly commercial cleaning products?',
    answer:
      'Yes. AClean can deploy Green Seal-certified and EPA Safer Choice-labeled products at your request. Many of our standard products are already low-VOC and LEED-compatible. For facilities pursuing LEED certification, WELL Building Standard compliance, or sustainability reporting, we can document product selections and provide data sheets for your records. Eco-friendly cleaning is available at no additional charge for contract clients.',
  },
  {
    question: 'Are your cleaning crews background-checked and trained?',
    answer:
      'Yes. Every AClean team member undergoes a thorough background screening before their first assignment. Crews receive structured onboarding training covering cleaning chemistry, infection control, proper equipment use, and professional conduct. All employees are covered under our workers\' compensation policy, so you bear no liability if a crew member is injured on your property. We also carry out ongoing quality audits using digital checklists and GPS-verified time-on-site records.',
  },
  {
    question: 'How is commercial cleaning priced and what does a contract include?',
    answer:
      'Commercial cleaning pricing is based on square footage, facility type, cleaning frequency, and the scope of services selected. We offer flat-rate monthly contracts (most popular for predictable budgeting), per-visit pricing for on-demand cleaning, and project-based quotes for one-time jobs like post-construction or deep cleaning. Every contract includes a dedicated crew, digital inspection checklists, automated service reports, and access to our client portal. We provide a free, no-obligation walkthrough and quote within 48 hours.',
  },
  {
    question: 'Can you clean retail stores, restaurants, and warehouse spaces?',
    answer:
      'Yes. AClean serves a wide range of commercial environments including retail storefronts, multi-tenant office buildings, warehouses, food-adjacent facilities, fitness centers, salons, and more. Each industry has different cleaning requirements and compliance standards — our team tailors the cleaning plan, product selection, and scheduling to match your specific environment and operational hours.',
  },
  {
    question: 'Do you offer pressure washing and exterior building maintenance?',
    answer:
      'Yes. Our exterior services include pressure washing of building facades, sidewalks, parking lots, loading docks, and dumpster enclosures. We also perform gutter clearing, graffiti removal, and pre-treatment for heavy oil, mold, or algae staining. Exterior cleaning is available as a stand-alone service or bundled with your janitorial contract for a comprehensive building maintenance solution.',
  },
  {
    question: 'How do I get a quote for commercial cleaning services in NJ, NY, or PA?',
    answer:
      'Getting a quote is simple: fill out the contact form on this page, call us at (732) 430-5494, or message us on WhatsApp. Tell us your facility type, approximate square footage, location, and how often you need service. We will schedule a free on-site walkthrough, assess your needs, and deliver a detailed, no-obligation proposal within 48 hours. Most new clients are onboarded and up and running within one week of signing.',
  },
]

function ChevronIcon({ open }) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.28, ease: EXPO }}
      style={{ flexShrink: 0 }}
    >
      <path d="M4 6.5l5 5 5-5" stroke="#17A8A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}

function FAQItem({ item, index, isInView }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: EXPO, delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${open ? 'rgba(23,168,168,0.35)' : 'rgba(11,37,69,0.08)'}`, transition: 'border-color 0.25s ease' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 px-5 py-5 text-left"
        style={{ backgroundColor: open ? 'rgba(23,168,168,0.04)' : 'white', transition: 'background-color 0.25s ease' }}
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-semibold leading-snug" style={{ color: '#0B2545' }}>
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EXPO }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5 pt-1 text-sm leading-relaxed font-light"
              style={{ color: '#475569', borderTop: '1px solid rgba(11,37,69,0.06)' }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const headingRef = useRef(null)
  const listRef = useRef(null)
  const ctaRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, amount: 0.4 })
  const listInView = useInView(listRef, { once: true, amount: 0.05 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

  const half = Math.ceil(faqs.length / 2)
  const left = faqs.slice(0, half)
  const right = faqs.slice(half)

  return (
    <section id="faq" className="py-16 md:py-24" style={{ backgroundColor: '#F4F7FB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EXPO }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: '#17A8A8' }}>
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 tracking-tight" style={{ color: '#0B2545' }}>
            Common questions about<br className="hidden sm:block" /> commercial cleaning &amp; facility services
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light" style={{ color: '#64748B' }}>
            Everything local businesses in NJ, NY, and PA need to know before partnering with a commercial cleaning and building maintenance company.
          </p>
        </motion.div>

        {/* Two-column accordion on lg+, single column on mobile */}
        <div ref={listRef} className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {left.map((item, i) => (
              <FAQItem key={item.question} item={item} index={i} isInView={listInView} />
            ))}
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {right.map((item, i) => (
              <FAQItem key={item.question} item={item} index={half + i} isInView={listInView} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 24 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EXPO }}
          className="mt-14 rounded-3xl px-6 sm:px-12 py-10 text-center"
          style={{ backgroundColor: '#0B2545' }}
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: '#17A8A8' }}>
            Still have questions?
          </p>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
            Talk to a facility cleaning specialist
          </h3>
          <p className="text-sm font-light mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Whether you manage a single office or a portfolio of commercial buildings, our team will walk you through options and provide a free on-site quote within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: '#17A8A8', boxShadow: '0 4px 20px rgba(23,168,168,0.3)' }}
            >
              Request a Free Quote
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="tel:+17324305494"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200"
              style={{ color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#17A8A8'; e.currentTarget.style.color = '#17A8A8' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.0 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              (732) 430-5494
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
