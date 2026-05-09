// ============================================================
// PortfolioSection.tsx – 3D icons + Hero-matched heading
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 3D SVG Icons ─────────────────────────────────────────────
const SvgEcommerce = () => (
  <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="ec-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#312E81"/></radialGradient>
      <radialGradient id="ec-scr" cx="40%" cy="30%" r="70%"><stop offset="0%" stopColor="#EEF2FF"/><stop offset="100%" stopColor="#C7D2FE"/></radialGradient>
    </defs>
    <rect x="8" y="6" width="40" height="30" rx="5" fill="#1E1B4B" opacity="0.2" transform="translate(1,2)"/>
    <rect x="8" y="6" width="40" height="30" rx="5" fill="url(#ec-bg)"/>
    <path d="M10 8 Q28 4 46 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
    <rect x="12" y="11" width="32" height="20" rx="3" fill="url(#ec-scr)"/>
    <rect x="15" y="15" width="10" height="12" rx="2" fill="#4F46E5" opacity="0.15"/>
    <rect x="15" y="15" width="10" height="8" rx="2" fill="#6366F1" opacity="0.25"/>
    <rect x="27" y="15" width="14" height="3" rx="1.5" fill="#4F46E5" opacity="0.5"/>
    <rect x="27" y="20" width="10" height="2" rx="1" fill="#6366F1" opacity="0.35"/>
    <rect x="27" y="24" width="8" height="3" rx="1.5" fill="#4F46E5" opacity="0.7"/>
    <circle cx="40" y="12" r="5" fill="#F97316"/><text x="37.5" y="14.5" fontSize="7" fontWeight="800" fill="white">$</text>
    <rect x="22" y="36" width="12" height="4" rx="2" fill="#312E81"/>
    <rect x="16" y="40" width="24" height="3" rx="1.5" fill="#1E1B4B"/>
  </svg>
);

const SvgHealthcare = () => (
  <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="hc-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#065F46"/></radialGradient>
    </defs>
    <rect x="14" y="4" width="28" height="46" rx="6" fill="#064E3B" opacity="0.2" transform="translate(1,2)"/>
    <rect x="14" y="4" width="28" height="46" rx="6" fill="url(#hc-bg)"/>
    <path d="M16 6 Q28 3 40 8" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none"/>
    <rect x="17" y="10" width="22" height="32" rx="3" fill="white" fillOpacity="0.92"/>
    <rect x="24" y="20" width="8" height="3" rx="1.5" fill="#10B981"/>
    <rect x="26.5" y="17.5" width="3" height="8" rx="1.5" fill="#10B981"/>
    <polyline points="20,32 24,28 27,34 30,26 33,30 36,27" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="28" cy="48" r="2" fill="rgba(255,255,255,0.45)"/>
    <rect x="24" y="6" width="8" height="2" rx="1" fill="rgba(255,255,255,0.35)"/>
  </svg>
);

const SvgSEO = () => (
  <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="se-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#FDBA74"/><stop offset="100%" stopColor="#9A3412"/></radialGradient>
    </defs>
    <rect x="6" y="8" width="44" height="34" rx="5" fill="#7C2D12" opacity="0.2" transform="translate(1,2)"/>
    <rect x="6" y="8" width="44" height="34" rx="5" fill="url(#se-bg)"/>
    <path d="M8 10 Q28 6 48 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
    <rect x="10" y="14" width="36" height="22" rx="3" fill="white" fillOpacity="0.9"/>
    <rect x="14" y="30" width="6" height="4" rx="1.5" fill="#F97316" opacity="0.5"/>
    <rect x="22" y="24" width="6" height="10" rx="1.5" fill="#F97316" opacity="0.7"/>
    <rect x="30" y="18" width="6" height="16" rx="1.5" fill="#F97316"/>
    <polyline points="14,32 24,26 32,20 40,16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="40" cy="16" r="2.5" fill="#EF4444"/>
    <polygon points="42,8 43,11 46,11 43.5,13 44.5,16 42,14 39.5,16 40.5,13 38,11 41,11" fill="white"/>
    <rect x="20" y="42" width="16" height="3" rx="1.5" fill="#7C2D12"/>
  </svg>
);

const SvgCloudMig = () => (
  <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="cm-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#67E8F9"/><stop offset="100%" stopColor="#0E7490"/></radialGradient>
    </defs>
    <path d="M12 34 Q8 34 8 28 Q8 22 14 22 Q14 14 22 14 Q28 10 34 16 Q38 14 42 18 Q48 18 48 26 Q48 34 40 34 Z" fill="#164E63" opacity="0.2" transform="translate(1,2)"/>
    <path d="M12 34 Q8 34 8 28 Q8 22 14 22 Q14 14 22 14 Q28 10 34 16 Q38 14 42 18 Q48 18 48 26 Q48 34 40 34 Z" fill="url(#cm-bg)"/>
    <path d="M12 26 Q22 20 32 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
    <path d="M22 27 L28 21 L34 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="28" y1="21" x2="28" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
    <line x1="20" y1="34" x2="20" y2="44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    <line x1="28" y1="34" x2="28" y2="44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    <line x1="36" y1="34" x2="36" y2="44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    <rect x="16" y="44" width="24" height="4" rx="2" fill="#0E7490"/>
  </svg>
);

const SvgRedesign = () => (
  <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="rd-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#5B21B6"/></radialGradient>
    </defs>
    <circle cx="28" cy="28" r="22" fill="#3B0764" opacity="0.2" transform="translate(1,2)"/>
    <circle cx="28" cy="28" r="22" fill="url(#rd-bg)"/>
    <path d="M10 20 A22 22 0 0 1 46 20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
    <rect x="16" y="16" width="24" height="24" rx="5" fill="white" fillOpacity="0.9"/>
    <circle cx="28" cy="23" r="4" fill="#8B5CF6" opacity="0.6"/>
    <rect x="20" y="29" width="16" height="2" rx="1" fill="#7C3AED" opacity="0.5"/>
    <rect x="22" y="33" width="12" height="2" rx="1" fill="#7C3AED" opacity="0.35"/>
    <path d="M38 18 L42 14 L46 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M44 14 L44 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
  </svg>
);

const SvgDelivery = () => (
  <svg width="64" height="64" viewBox="0 0 56 56" fill="none">
    <defs>
      <radialGradient id="dl-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#F9A8D4"/><stop offset="100%" stopColor="#9D174D"/></radialGradient>
      <radialGradient id="dl-pin" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#FCA5A5"/><stop offset="100%" stopColor="#DC2626"/></radialGradient>
    </defs>
    <rect x="4" y="18" width="34" height="22" rx="4" fill="#831843" opacity="0.2" transform="translate(1,2)"/>
    <rect x="4" y="18" width="34" height="22" rx="4" fill="url(#dl-bg)"/>
    <path d="M6 20 Q20 16 36 22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
    <path d="M38 24 L48 24 L52 32 L52 40 L38 40 Z" fill="url(#dl-bg)"/>
    <rect x="38" y="24" width="14" height="16" rx="0" fill="white" fillOpacity="0.12"/>
    <rect x="42" y="28" width="6" height="8" rx="2" fill="rgba(255,255,255,0.3)"/>
    <circle cx="14" cy="42" r="5" fill="#1E1B4B" stroke="white" strokeWidth="2"/>
    <circle cx="14" cy="42" r="2" fill="white"/>
    <circle cx="44" cy="42" r="5" fill="#1E1B4B" stroke="white" strokeWidth="2"/>
    <circle cx="44" cy="42" r="2" fill="white"/>
    <rect x="8" y="22" width="12" height="8" rx="2" fill="rgba(255,255,255,0.2)"/>
    <path d="M36 8 Q36 2 42 6" stroke="url(#dl-pin)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="42" cy="6" r="4" fill="url(#dl-pin)"/>
    <circle cx="42" cy="6" r="1.5" fill="white"/>
  </svg>
);

// ── Icon Map ─────────────────────────────────────────────────
const iconMap: Record<string, () => React.ReactElement> = {
  'E-Commerce Platform': SvgEcommerce,
  'HealthCare Mobile App': SvgHealthcare,
  'Brand SEO Campaign': SvgSEO,
  'Cloud Migration Project': SvgCloudMig,
  'Corporate Website Redesign': SvgRedesign,
  'Delivery Tracker App': SvgDelivery,
};

const tabs = ['All', 'Web Dev', 'Mobile App', 'Digital Marketing', 'Cloud'];

const projects = [
  { title: 'E-Commerce Platform',        category: 'Web Dev',           color: '#4F46E5', desc: 'A full-stack e-commerce solution with real-time inventory and payment integration.',  tags: ['React', 'Node.js', 'MongoDB']     },
  { title: 'HealthCare Mobile App',      category: 'Mobile App',        color: '#10B981', desc: 'Patient management app for clinics with appointment booking and telemedicine.',       tags: ['Flutter', 'Firebase', 'REST API'] },
  { title: 'Brand SEO Campaign',         category: 'Digital Marketing', color: '#F97316', desc: 'Achieved 300% organic traffic growth for a retail brand in 6 months.',              tags: ['SEO', 'Content', 'Analytics']     },
  { title: 'Cloud Migration Project',    category: 'Cloud',             color: '#06B6D4', desc: 'Migrated legacy infrastructure to AWS with zero downtime deployment.',               tags: ['AWS', 'Docker', 'Terraform']      },
  { title: 'Corporate Website Redesign', category: 'Web Dev',           color: '#8B5CF6', desc: 'Modern, fast-loading redesign for a Fortune 500 consulting firm.',                  tags: ['Next.js', 'Tailwind', 'CMS']      },
  { title: 'Delivery Tracker App',       category: 'Mobile App',        color: '#EC4899', desc: 'Real-time delivery tracking with GPS and push notifications.',                      tags: ['React Native', 'Maps API']        },
];

export default function PortfolioSection() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  return (
    <section id="portfolio" style={{ background: 'var(--bg-main)', padding: '80px 0', transition: 'background 0.3s ease' }}>

      <div className="container">

        {/* ── Section Header – Hero-matched font */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div className="accent-bar" />
          <h2
            className="font-bold tracking-tight text-[var(--text-main)]"

            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.4rem, 2.8vw, 2.8rem)',
              fontWeight: 700, lineHeight: 1.15,
              letterSpacing: '-0.02em', marginBottom: 16,
            }}
          >
            <span className="gradient-text">Portfolio</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 540, margin: '0 auto', lineHeight: 1.7, fontFamily: "'Roboto','Poppins',sans-serif" }}>
            A showcase of our best work — from web development to digital campaigns that delivered real results.
          </p>

        </motion.div>

        {/* ── Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 44 }}>
          {tabs.map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(tab)}
              style={{
                padding: '9px 22px', borderRadius: 50, fontSize: 14, fontWeight: 600,
                fontFamily: "'Poppins',sans-serif", cursor: 'pointer', transition: 'all 0.25s ease',
                background: active === tab ? 'linear-gradient(90deg, #4F46E5, #7C3AED)' : 'var(--bg-surface-soft)',
                color: active === tab ? 'white' : 'var(--text-muted)',
                border: active === tab ? 'none' : '1.5px solid var(--border-main)',
                boxShadow: active === tab ? '0 4px 14px rgba(79,70,229,0.35)' : 'none',
              }}

            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* ── Cards Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((p, i) => {
              const SvgIcon = iconMap[p.title];
              return (
                <motion.div
                  key={p.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  whileHover={{ y: -8 }}
                  className="card"
                  style={{ 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    background: 'var(--bg-surface)',
                    boxShadow: 'var(--card-shadow)',
                    border: '1px solid var(--border-main)',
                    transition: 'all 0.3s ease'
                  }}
                >

                  {/* Card cover – gradient tint with 3D icon */}
                  <div style={{
                    height: 180,
                    background: `linear-gradient(135deg, ${p.color}15, ${p.color}30)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }} className="portfolio-cover">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.2))' }}
                      className="portfolio-icon-wrap"
                    >
                      {SvgIcon && <SvgIcon />}
                    </motion.div>
                    {/* Category badge */}
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: p.color, color: 'white', fontSize: 11, fontWeight: 700,
                      padding: '4px 12px', borderRadius: 50, letterSpacing: 0.5,
                    }} className="portfolio-cat-badge">
                      {p.category}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '24px' }} className="portfolio-body">
                    <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'var(--text-main)' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, marginBottom: 16, fontFamily: "'Roboto','Poppins',sans-serif" }}>{p.desc}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} className="portfolio-tags">
                      {p.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 50,
                          background: `${p.color}12`, color: p.color,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Responsive Refinements ──────────────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          #portfolio { padding: 64px 0 !important; }
          #portfolio .container { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          #portfolio { padding: 56px 0 !important; }
          #portfolio h2 { font-size: 1.6rem !important; }
          #portfolio .grid { gap: 16px !important; }
          .portfolio-cover { height: 140px !important; }
          .portfolio-body { padding: 16px !important; }
          .portfolio-body h3 { font-size: 15px !important; }
          .portfolio-body p { font-size: 11px !important; }
        }
        @media (max-width: 480px) {
          #portfolio { padding: 48px 0 !important; }
          #portfolio h2 { font-size: 1.4rem !important; }
          #portfolio .grid { gap: 12px !important; }
          .portfolio-cover { height: 100px !important; }
          .portfolio-icon-wrap { transform: scale(0.6) !important; }
          .portfolio-cat-badge { font-size: 8px !important; padding: 2px 6px !important; top: 6px !important; right: 6px !important; }
          .portfolio-body { padding: 12px 8px !important; }
          .portfolio-body h3 { font-size: 11px !important; margin-bottom: 4px !important; font-weight: 700 !important; height: 30px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
          .portfolio-body p { font-size: 9px !important; display: -webkit-box !important; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4 !important; margin-bottom: 8px !important; }
          .portfolio-tags { display: flex !important; gap: 4px !important; }
          .portfolio-tags span { font-size: 8px !important; padding: 2px 6px !important; }
        }
      `}</style>
    </section>
  );
}
