// ============================================================
// StrategicServices.tsx
// Displays a grid of 8 strategic digital service cards.
// Each card uses a bespoke 3D-style SVG icon with gradients,
// highlights and depth shadows to feel premium & professional.
// ============================================================

import { motion } from 'framer-motion';

// ── 3D SVG Icon Components ───────────────────────────────────
// Each icon is a standalone SVG using defs/gradients for a
// soft 3D illuminated look consistent with a modern IT brand.

const Icon3DSEO = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="seo-rim" cx="35%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#A5B4FC"/>
        <stop offset="55%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#312E81"/>
      </radialGradient>
      <radialGradient id="seo-lens" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#F0F0FF"/>
        <stop offset="100%" stopColor="#C7D2FE"/>
      </radialGradient>
      <linearGradient id="seo-bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#818CF8"/>
        <stop offset="100%" stopColor="#4F46E5"/>
      </linearGradient>
      <linearGradient id="seo-hdl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#818CF8"/>
        <stop offset="100%" stopColor="#1E1B4B"/>
      </linearGradient>
    </defs>
    {/* Soft drop shadow */}
    <circle cx="23" cy="24" r="18" fill="#312E81" opacity="0.2"/>
    {/* Rim */}
    <circle cx="21" cy="21" r="18" fill="url(#seo-rim)"/>
    {/* Rim bevel shine */}
    <path d="M7 14 A18 18 0 0 1 35 14" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Lens */}
    <circle cx="21" cy="21" r="13" fill="url(#seo-lens)"/>
    {/* Rising ranking bars */}
    <rect x="12" y="26" width="4.5" height="7" rx="1.5" fill="url(#seo-bar)" opacity="0.5"/>
    <rect x="18.5" y="21" width="4.5" height="12" rx="1.5" fill="url(#seo-bar)" opacity="0.75"/>
    <rect x="25" y="15" width="4.5" height="18" rx="1.5" fill="url(#seo-bar)"/>
    {/* Gold star on tallest bar */}
    <polygon points="27,10 28.1,13.3 31.6,13.3 28.9,15.4 29.9,18.7 27,16.7 24.1,18.7 25.1,15.4 22.4,13.3 25.9,13.3" fill="#F97316"/>
    {/* Gloss highlight */}
    <ellipse cx="14" cy="13" rx="5" ry="3" fill="white" fillOpacity="0.45" transform="rotate(-25 14 13)"/>
    {/* Handle body */}
    <rect x="34" y="34" width="16" height="6.5" rx="3.25" fill="url(#seo-hdl)" transform="rotate(-45 34 34)"/>
    {/* Handle shine */}
    <rect x="34" y="34" width="16" height="2" rx="1" fill="white" fillOpacity="0.28" transform="rotate(-45 34 34)"/>
  </svg>
);

const Icon3DSocial = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <linearGradient id="soc-phone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F9A8D4"/>
        <stop offset="100%" stopColor="#BE185D"/>
      </linearGradient>
      <radialGradient id="soc-screen" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDF4FF"/>
        <stop offset="100%" stopColor="#FAE8FF"/>
      </radialGradient>
      <radialGradient id="soc-heart" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FB7185"/>
        <stop offset="100%" stopColor="#BE123C"/>
      </radialGradient>
    </defs>
    {/* Phone shadow */}
    <rect x="16" y="9" width="24" height="40" rx="5" fill="#9D174D" opacity="0.22" transform="translate(2,2)"/>
    {/* Phone body */}
    <rect x="14" y="7" width="26" height="43" rx="6" fill="url(#soc-phone)"/>
    {/* Rim shine */}
    <path d="M16 8 Q28 6 40 12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Screen */}
    <rect x="17" y="13" width="20" height="29" rx="3" fill="url(#soc-screen)"/>
    {/* Heart icon on screen */}
    <path d="M27 34 C27 34 19 27 19 22 C19 18.5 22 17 24.5 19 C25.8 20 27 21.5 27 21.5 C27 21.5 28.2 20 29.5 19 C32 17 35 18.5 35 22 C35 27 27 34 27 34Z" fill="url(#soc-heart)"/>
    {/* Like bubble top-right */}
    <circle cx="42" cy="16" r="6" fill="#6366F1"/>
    <path d="M39 16.5 C39 15.5 39.8 15 40.5 15.5 C40.8 15.7 41 16 41 16 C41 16 41.2 15.7 41.5 15.5 C42.2 15 43 15.5 43 16.5 C43 17.8 41 19 41 19 C41 19 39 17.8 39 16.5Z" fill="white"/>
    {/* Share bubble bottom-right */}
    <circle cx="44" cy="32" r="5.5" fill="#F97316"/>
    <path d="M41.5 32 L44.5 29.5 L44.5 31 L46 31 L46 33 L44.5 33 L44.5 34.5Z" fill="white" fillOpacity="0.9"/>
    {/* Comment bubble top-left */}
    <rect x="4" y="20" width="10" height="7" rx="3" fill="#10B981"/>
    <polygon points="8,27 6,31 11,27" fill="#10B981"/>
    <rect x="6" y="22.5" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.8"/>
    <rect x="6" y="25" width="4" height="1.5" rx="0.75" fill="white" fillOpacity="0.6"/>
    {/* Phone home button */}
    <circle cx="27" cy="47" r="2" fill="rgba(255,255,255,0.4)"/>
  </svg>
);

const Icon3DPPC = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="ppc-r4" cx="38%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FED7AA"/>
        <stop offset="100%" stopColor="#9A3412"/>
      </radialGradient>
      <radialGradient id="ppc-r3" cx="38%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FDBA74"/>
        <stop offset="100%" stopColor="#C2410C"/>
      </radialGradient>
      <radialGradient id="ppc-r2" cx="38%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#FB923C"/>
        <stop offset="100%" stopColor="#EA580C"/>
      </radialGradient>
      <radialGradient id="ppc-gold" cx="35%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#FEF08A"/>
        <stop offset="100%" stopColor="#B45309"/>
      </radialGradient>
    </defs>
    {/* Shadow */}
    <circle cx="29" cy="30" r="21" fill="#7C2D12" opacity="0.18"/>
    {/* Ring 4 */}
    <circle cx="28" cy="28" r="21" fill="url(#ppc-r4)"/>
    <path d="M11 17 A21 21 0 0 1 45 17" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none"/>
    {/* Ring 3 */}
    <circle cx="28" cy="28" r="15.5" fill="url(#ppc-r3)"/>
    <path d="M15 19 A15.5 15.5 0 0 1 41 19" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" fill="none"/>
    {/* Ring 2 */}
    <circle cx="28" cy="28" r="10" fill="url(#ppc-r2)"/>
    <path d="M19 21 A10 10 0 0 1 37 21" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none"/>
    {/* Gold center coin */}
    <circle cx="28" cy="28" r="5.5" fill="url(#ppc-gold)"/>
    <circle cx="28" cy="28" r="5.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
    <text x="25.5" y="32" fontSize="8" fontWeight="900" fill="white">$</text>
    {/* Arrow striking target */}
    <line x1="6" y1="6" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="20,20 15,13 23,15" fill="white"/>
    {/* Lightning bolt top-right */}
    <polygon points="43,5 39,15 44,15 40,26 49,13 43,13" fill="#FEF3C7" opacity="0.95"/>
  </svg>
);

const Icon3DSupport = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="sup-bg" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#047857" />
      </radialGradient>
    </defs>
    {/* Headset band */}
    <path d="M14 26 Q14 10 28 10 Q42 10 42 26" stroke="url(#sup-bg)" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Left ear cup */}
    <rect x="10" y="24" width="8" height="14" rx="4" fill="url(#sup-bg)" />
    <rect x="10" y="24" width="8" height="14" rx="4" fill="white" fillOpacity="0.15" />
    {/* Right ear cup */}
    <rect x="38" y="24" width="8" height="14" rx="4" fill="url(#sup-bg)" />
    <rect x="38" y="24" width="8" height="14" rx="4" fill="white" fillOpacity="0.15" />
    {/* Mic arm */}
    <path d="M14 36 Q14 46 24 46" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="24" cy="46" r="3" fill="#34D399" />
    {/* Highlight */}
    <rect x="12" y="26" width="4" height="5" rx="2" fill="white" fillOpacity="0.3" />
    <rect x="40" y="26" width="4" height="5" rx="2" fill="white" fillOpacity="0.3" />
  </svg>
);

const Icon3DAnalytics = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="ana-bg" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#5B21B6" />
      </radialGradient>
    </defs>
    {/* Base screen */}
    <rect x="6" y="10" width="44" height="32" rx="5" fill="url(#ana-bg)" />
    <rect x="6" y="10" width="44" height="32" rx="5" fill="white" fillOpacity="0.07" />
    {/* Chart bars */}
    <rect x="14" y="30" width="6" height="8" rx="2" fill="white" fillOpacity="0.5" />
    <rect x="23" y="22" width="6" height="16" rx="2" fill="white" fillOpacity="0.75" />
    <rect x="32" y="17" width="6" height="21" rx="2" fill="white" fillOpacity="0.95" />
    {/* Trend line */}
    <polyline points="14,34 24,26 34,20 44,14" stroke="#F0ABFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="44" cy="14" r="2.5" fill="white" />
    {/* Screen stand */}
    <rect x="22" y="42" width="12" height="4" rx="2" fill="#5B21B6" />
    <rect x="18" y="46" width="20" height="3" rx="1.5" fill="#4C1D95" />
    {/* Highlight */}
    <rect x="8" y="12" width="14" height="6" rx="3" fill="white" fillOpacity="0.12" />
  </svg>
);

const Icon3DEcommerce = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="eco-bg" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#0E7490" />
      </radialGradient>
    </defs>
    {/* Cart body */}
    <rect x="16" y="18" width="28" height="20" rx="4" fill="url(#eco-bg)" />
    <rect x="16" y="18" width="28" height="20" rx="4" fill="white" fillOpacity="0.1" />
    {/* Cart handle */}
    <path d="M8 10 L14 10 L20 36" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Cart items lines */}
    <rect x="22" y="24" width="14" height="2.5" rx="1.25" fill="white" fillOpacity="0.8" />
    <rect x="22" y="29" width="10" height="2.5" rx="1.25" fill="white" fillOpacity="0.55" />
    {/* Wheels */}
    <circle cx="24" cy="43" r="4" fill="#0E7490" stroke="white" strokeWidth="1.5" />
    <circle cx="38" cy="43" r="4" fill="#0E7490" stroke="white" strokeWidth="1.5" />
    {/* Highlight */}
    <rect x="18" y="20" width="10" height="5" rx="2.5" fill="white" fillOpacity="0.2" />
    {/* Badge */}
    <circle cx="44" cy="14" r="7" fill="#F97316" />
    <text x="41" y="18" fontSize="9" fontWeight="800" fill="white">$</text>
  </svg>
);

const Icon3DCyber = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="cyber-bg" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#991B1B" />
      </radialGradient>
    </defs>
    {/* Shield */}
    <path d="M28 6 L46 14 L46 30 Q46 44 28 52 Q10 44 10 30 L10 14 Z" fill="url(#cyber-bg)" />
    <path d="M28 6 L46 14 L46 30 Q46 44 28 52 Q10 44 10 30 L10 14 Z" fill="white" fillOpacity="0.08" />
    {/* Inner shield ring */}
    <path d="M28 12 L40 18 L40 30 Q40 40 28 46 Q16 40 16 30 L16 18 Z" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
    {/* Lock body */}
    <rect x="20" y="26" width="16" height="13" rx="3" fill="white" fillOpacity="0.9" />
    {/* Lock shackle */}
    <path d="M22 26 L22 20 Q22 15 28 15 Q34 15 34 20 L34 26" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.85" />
    {/* Key hole */}
    <circle cx="28" cy="31" r="3" fill="#B91C1C" />
    <rect x="26.5" y="31" width="3" height="5" rx="1" fill="#B91C1C" />
    {/* Highlight */}
    <path d="M14 16 Q14 12 20 12 L20 16 Z" fill="white" fillOpacity="0.2" />
  </svg>
);

const Icon3DStrategy = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="strat-crown" cx="38%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#C4B5FD"/>
        <stop offset="55%" stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#3B0764"/>
      </radialGradient>
      <radialGradient id="strat-heart" cx="38%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FB7185"/>
        <stop offset="100%" stopColor="#9F1239"/>
      </radialGradient>
    </defs>
    {/* Crown shadow */}
    <path d="M10 36 L10 24 L18 30 L28 14 L38 30 L46 24 L46 36 Q46 40 28 40 Q10 40 10 36Z" fill="#3B0764" opacity="0.22" transform="translate(1,2)"/>
    {/* Crown body */}
    <path d="M10 36 L10 24 L18 30 L28 14 L38 30 L46 24 L46 36 Q46 40 28 40 Q10 40 10 36Z" fill="url(#strat-crown)"/>
    {/* Crown rim shine */}
    <path d="M12 25 Q28 18 44 25" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Gems on crown tips */}
    <circle cx="10" cy="24" r="3.5" fill="#F97316"/>
    <circle cx="10" cy="24" r="3.5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
    <circle cx="28" cy="14" r="4" fill="#FDE68A"/>
    <circle cx="28" cy="14" r="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
    <circle cx="46" cy="24" r="3.5" fill="#F97316"/>
    <circle cx="46" cy="24" r="3.5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
    {/* Heart inside crown */}
    <path d="M28 35 C28 35 21 29 21 25 C21 22.5 23.5 21.5 25.5 23 C26.8 24 28 25.5 28 25.5 C28 25.5 29.2 24 30.5 23 C32.5 21.5 35 22.5 35 25 C35 29 28 35 28 35Z" fill="url(#strat-heart)"/>
    {/* Network nodes below crown */}
    <circle cx="28" cy="46" r="3" fill="#A78BFA"/>
    <circle cx="16" cy="50" r="2.5" fill="#C4B5FD"/>
    <circle cx="40" cy="50" r="2.5" fill="#C4B5FD"/>
    <line x1="28" y1="46" x2="16" y2="50" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.6"/>
    <line x1="28" y1="46" x2="40" y2="50" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="0.6"/>
    {/* Crown base highlight */}
    <rect x="12" y="36" width="32" height="3" rx="1.5" fill="white" fillOpacity="0.15"/>
  </svg>
);

// ── Service Data ─────────────────────────────────────────────
const services = [
  {
    Icon: Icon3DSEO,
    label: 'SEO Services',
    desc: 'Rank higher, drive organic traffic & grow visibility',
    glow: 'rgba(79,70,229,0.15)',
    border: '#6366f1',
  },
  {
    Icon: Icon3DSocial,
    label: 'Social Marketing',
    desc: 'Build brand awareness across every social platform',
    glow: 'rgba(236,72,153,0.15)',
    border: '#EC4899',
  },
  {
    Icon: Icon3DPPC,
    label: 'PPC Advertising',
    desc: 'Precision paid campaigns that convert at scale',
    glow: 'rgba(249,115,22,0.15)',
    border: '#F97316',
  },
  {
    Icon: Icon3DSupport,
    label: 'Quick Support',
    desc: '24/7 dedicated support for seamless operations',
    glow: 'rgba(16,185,129,0.15)',
    border: '#10B981',
  },
  {
    Icon: Icon3DAnalytics,
    label: 'Web Analytics',
    desc: 'Deep data insights to fuel smarter decisions',
    glow: 'rgba(139,92,246,0.15)',
    border: '#8B5CF6',
  },
  {
    Icon: Icon3DEcommerce,
    label: 'E-Commerce Solutions',
    desc: 'End-to-end stores built for revenue growth',
    glow: 'rgba(6,182,212,0.15)',
    border: '#06B6D4',
  },
  {
    Icon: Icon3DCyber,
    label: 'Cybersecurity',
    desc: 'Enterprise-grade protection for your digital assets',
    glow: 'rgba(239,68,68,0.15)',
    border: '#EF4444',
  },
  {
    Icon: Icon3DStrategy,
    label: 'Customer Strategy',
    desc: 'Retention-first strategies that build loyal clients',
    glow: 'rgba(99,102,241,0.15)',
    border: '#6366F1',
  },
];

export default function StrategicServices() {
  return (
    <section id="strategic-services" style={{ background: 'var(--bg-main)', padding: '80px 0', transition: 'background 0.3s ease' }}>

      <div className="container">

        {/* ── Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="accent-bar" />
          <h2
            className="font-bold tracking-tight text-[var(--text-main)]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1rem, 2.8vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>Strategic Application Services</span><br />
            <span className="gradient-text" style={{ whiteSpace: 'nowrap' }}>for Seamless Online Success</span>
          </h2>
        </motion.div>

        {/* ── Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="card"
              style={{
                padding: '28px 20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: 14, cursor: 'pointer',
                borderTop: `3px solid ${s.border}`,
                position: 'relative', overflow: 'hidden',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-main)',
                transition: 'all 0.3s ease'
              }}
            >

              {/* Subtle glow backdrop */}
              <div style={{
                position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                width: 120, height: 120, borderRadius: '50%',
                background: s.glow, filter: 'blur(24px)', pointerEvents: 'none',
              }} />

              {/* 3D SVG Icon */}
              <motion.div
                whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.4 } }}
                style={{
                  width: 72, height: 72,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))',
                  position: 'relative', zIndex: 1,
                }}
              >
                <s.Icon />
              </motion.div>

              {/* Label */}
              <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, color: 'var(--text-main)', position: 'relative', zIndex: 1 }}>
                {s.label}
              </span>

              {/* Short description */}
              <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                {s.desc}
              </span>


              {/* Bottom accent line */}
              <div style={{ width: 36, height: 3, borderRadius: 2, background: s.border, opacity: 0.7 }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Responsive Refinements ──────────────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          #strategic-services { padding: 64px 0 !important; }
          #strategic-services .container { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          #strategic-services { padding: 56px 0 !important; }
          #strategic-services h2 { font-size: 1.6rem !important; }
          #strategic-services .grid { gap: 16px !important; }
        }
        @media (max-width: 480px) {
          #strategic-services { padding: 48px 0 !important; }
          #strategic-services h2 { font-size: 1.4rem !important; }
          #strategic-services .grid { gap: 10px !important; } /* Tighter gap for 2-col mobile */
          #strategic-services .card { padding: 16px 12px !important; gap: 8px !important; }
          #strategic-services .card span:first-of-type { font-size: 12px !important; } /* Smaller label */
          #strategic-services .card span:last-of-type { font-size: 10px !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } /* Truncate desc if needed */
        }
      `}</style>
    </section>
  );
}
