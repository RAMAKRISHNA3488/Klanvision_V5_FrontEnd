// ============================================================
// ServicesSection.tsx – 3D icon cards + Hero-matched heading
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Compact 3D SVG Icons ─────────────────────────────────────
const SvgManaged = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="mg-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#3730A3"/></radialGradient>
      <linearGradient id="mg-scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EEF2FF"/><stop offset="100%" stopColor="#C7D2FE"/></linearGradient>
    </defs>
    <rect x="4" y="6" width="44" height="30" rx="5" fill="#1E1B4B" opacity="0.2" transform="translate(1,2)"/>
    <rect x="4" y="6" width="44" height="30" rx="5" fill="url(#mg-bg)"/>
    <path d="M6 8 Q26 4 46 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="8" y="11" width="36" height="20" rx="3" fill="url(#mg-scr)"/>
    <rect x="11" y="17" width="10" height="2" rx="1" fill="#4F46E5" opacity="0.7"/>
    <rect x="11" y="21" width="16" height="2" rx="1" fill="#6366F1" opacity="0.5"/>
    <rect x="11" y="25" width="13" height="2" rx="1" fill="#6366F1" opacity="0.4"/>
    <rect x="28" y="17" width="13" height="10" rx="2" fill="#4F46E5" opacity="0.15"/>
    <polyline points="30,25 34,19 38,22" stroke="#4F46E5" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="20" y="36" width="12" height="4" rx="2" fill="#3730A3"/>
    <rect x="14" y="40" width="24" height="3" rx="1.5" fill="#312E81"/>
  </svg>
);

const SvgConsult = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="ct-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#B45309"/></radialGradient>
    </defs>
    <circle cx="27" cy="29" r="19" fill="#78350F" opacity="0.2" transform="translate(1,2)"/>
    <circle cx="26" cy="28" r="19" fill="url(#ct-bg)"/>
    <path d="M10 22 A16 16 0 0 1 42 22" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="26" cy="28" r="10" fill="rgba(255,255,255,0.15)"/>
    <path d="M26 18 L26 22 M26 28 L26 34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="26" cy="26" r="2.5" fill="white"/>
    <circle cx="8" cy="14" r="4" fill="#FDE68A"/>
    <circle cx="44" cy="14" r="4" fill="#FDE68A"/>
    <circle cx="26" cy="8" r="4" fill="#FDE68A"/>
  </svg>
);

const SvgSecurity = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="sc-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#F87171"/><stop offset="100%" stopColor="#991B1B"/></radialGradient>
      <radialGradient id="sc-lk" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#FCA5A5"/><stop offset="100%" stopColor="#EF4444"/></radialGradient>
    </defs>
    <path d="M26 4 L44 12 L44 28 Q44 42 26 50 Q8 42 8 28 L8 12 Z" fill="#7F1D1D" opacity="0.2" transform="translate(1,2)"/>
    <path d="M26 4 L44 12 L44 28 Q44 42 26 50 Q8 42 8 28 L8 12 Z" fill="url(#sc-bg)"/>
    <path d="M26 8 L40 15 L40 28 Q40 39 26 46 Q12 39 12 28 L12 15 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    <rect x="18" y="26" width="16" height="12" rx="3" fill="white" fillOpacity="0.9"/>
    <path d="M20 26 L20 21 Q20 16 26 16 Q32 16 32 21 L32 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <circle cx="26" cy="30" r="2.5" fill="#DC2626"/>
    <rect x="24.5" y="30" width="3" height="5" rx="1" fill="#DC2626"/>
    <path d="M10 14 Q16 10 22 12" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

const SvgWeb = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="wb-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#065F46"/></radialGradient>
    </defs>
    <circle cx="27" cy="27" r="21" fill="#064E3B" opacity="0.2" transform="translate(1,2)"/>
    <circle cx="26" cy="26" r="21" fill="url(#wb-bg)"/>
    <path d="M8 22 A21 21 0 0 1 44 22" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
    <ellipse cx="26" cy="26" rx="21" ry="9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
    <line x1="26" y1="5" x2="26" y2="47" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
    <line x1="5" y1="26" x2="47" y2="26" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
    <circle cx="26" cy="26" r="5" fill="white" fillOpacity="0.9"/>
    <path d="M24 26 L26 23 L28 26 L26 29 Z" fill="#065F46"/>
    <path d="M10 15 Q18 11 26 13" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

const SvgMobile = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="mb-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#C084FC"/><stop offset="100%" stopColor="#581C87"/></radialGradient>
      <radialGradient id="mb-scr" cx="40%" cy="30%" r="70%"><stop offset="0%" stopColor="#FAF5FF"/><stop offset="100%" stopColor="#E9D5FF"/></radialGradient>
    </defs>
    <rect x="14" y="4" width="24" height="42" rx="6" fill="#3B0764" opacity="0.2" transform="translate(1,2)"/>
    <rect x="14" y="4" width="24" height="42" rx="6" fill="url(#mb-bg)"/>
    <path d="M16 5 Q26 2 36 8" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="17" y="10" width="18" height="28" rx="3" fill="url(#mb-scr)"/>
    <rect x="20" y="14" width="12" height="2" rx="1" fill="#7C3AED" opacity="0.6"/>
    <rect x="20" y="18" width="9" height="2" rx="1" fill="#7C3AED" opacity="0.4"/>
    <rect x="20" y="26" width="12" height="8" rx="2" fill="#8B5CF6" opacity="0.25"/>
    <circle cx="26" cy="44" r="2.5" fill="rgba(255,255,255,0.5)"/>
    <rect x="22" y="6" width="8" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
  </svg>
);

const SvgCloud = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="cl-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#67E8F9"/><stop offset="100%" stopColor="#0E7490"/></radialGradient>
    </defs>
    <path d="M10 32 Q6 32 6 26 Q6 20 12 20 Q12 12 20 12 Q26 8 32 14 Q36 12 40 16 Q46 16 46 24 Q46 32 38 32 Z" fill="#164E63" opacity="0.2" transform="translate(1,2)"/>
    <path d="M10 32 Q6 32 6 26 Q6 20 12 20 Q12 12 20 12 Q26 8 32 14 Q36 12 40 16 Q46 16 46 24 Q46 32 38 32 Z" fill="url(#cl-bg)"/>
    <path d="M10 24 Q18 18 28 22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <line x1="20" y1="32" x2="20" y2="44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    <line x1="26" y1="32" x2="26" y2="44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    <line x1="32" y1="32" x2="32" y2="44" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
    <rect x="15" y="43" width="22" height="4" rx="2" fill="#0E7490"/>
  </svg>
);

const SvgMigrate = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="mi-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#3730A3"/></radialGradient>
    </defs>
    <circle cx="26" cy="26" r="20" fill="#1E1B4B" opacity="0.2" transform="translate(1,2)"/>
    <circle cx="26" cy="26" r="20" fill="url(#mi-bg)"/>
    <path d="M10 20 A20 20 0 0 1 42 20" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
    <path d="M16 20 L26 10 L36 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M36 32 L26 42 L16 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="26" y1="10" x2="26" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4"/>
    <circle cx="26" cy="26" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5"/>
    <circle cx="26" cy="26" r="2" fill="white"/>
  </svg>
);

const SvgAPI = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <defs>
      <radialGradient id="ap-nd" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#F9A8D4"/><stop offset="100%" stopColor="#9D174D"/></radialGradient>
    </defs>
    <circle cx="10" cy="26" r="7" fill="#831843" opacity="0.2" transform="translate(1,2)"/>
    <circle cx="10" cy="26" r="7" fill="url(#ap-nd)"/>
    <circle cx="10" cy="26" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
    <circle cx="42" cy="12" r="7" fill="url(#ap-nd)"/>
    <circle cx="42" cy="12" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
    <circle cx="42" cy="40" r="7" fill="url(#ap-nd)"/>
    <circle cx="42" cy="40" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
    <line x1="17" y1="24" x2="35" y2="14" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3"/>
    <line x1="17" y1="28" x2="35" y2="38" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3"/>
    <text x="6" y="30" fontSize="8" fontWeight="800" fill="white">{`{}`}</text>
    <text x="37" y="16" fontSize="7" fontWeight="800" fill="white">API</text>
    <text x="36" y="44" fontSize="7" fontWeight="800" fill="white">SDK</text>
  </svg>
);

// ── Service Data ─────────────────────────────────────────────
const services = [
  { 
    Svg: SvgManaged,  
    title: 'Managed Services',                    
    desc: 'Proactive IT management keeps your systems running smoothly and your business goals on track.',         
    color: '#4F46E5', 
    glow: 'rgba(79,70,229,0.12)',
    longDesc: "We provide end-to-end IT management to ensure your business operations run smoothly and efficiently. Our managed services include proactive monitoring, system maintenance, performance optimization, and issue resolution. By handling your IT infrastructure, we allow you to focus on core business growth while ensuring reliability and uptime.\n\nEnsure smooth and reliable IT operations with proactive monitoring and maintenance. We manage your infrastructure so you can focus on business growth."
  },
  { 
    Svg: SvgConsult,  
    title: 'IT Consultation & Advisory',          
    desc: 'Strategic IT investments, predictive management, and optimized solutions engineered for growth.',        
    color: '#F97316', 
    glow: 'rgba(249,115,22,0.12)',
    longDesc: "Our IT consulting services help businesses make informed technology decisions aligned with their goals. We analyze your current infrastructure, identify gaps, and recommend scalable, cost-effective solutions. From digital transformation to long-term IT strategy, we guide you at every step to maximize efficiency and ROI.\n\nMake smarter technology decisions with expert guidance.\nWe align IT strategies with your business goals for better efficiency and growth."
  },
  { 
    Svg: SvgSecurity, 
    title: 'Securing Your Digital Infrastructure', 
    desc: 'Advanced cybersecurity, identity management, and compliance strategies to protect your systems.',       
    color: '#EF4444', 
    glow: 'rgba(239,68,68,0.12)',
    longDesc: "We offer comprehensive cybersecurity solutions to protect your systems, data, and applications from evolving threats. Our services include risk assessment, identity and access management, compliance implementation, and continuous security monitoring to ensure your digital assets remain safe and compliant.\n\nProtect your systems with advanced security and compliance solutions.\nWe safeguard your data and ensure a secure IT environment."
  },
  { 
    Svg: SvgWeb,      
    title: 'Web Development',                     
    desc: 'Bespoke, high-performance web applications that scale with your business and captivate users.',             
    color: '#0EA5E9', 
    glow: 'rgba(14,165,233,0.12)',
    longDesc: "We design and develop modern, scalable, and secure web applications tailored to your business needs. Our focus is on performance, user experience, and responsiveness, ensuring your website or application delivers seamless functionality across all devices and platforms.\n\nBuild modern, scalable, and secure web applications.\nWe deliver high-performance solutions tailored to your business needs."
  },
  { 
    Svg: SvgMobile,   
    title: 'Mobile App Design & Deployment',      
    desc: 'Native and cross-platform mobile apps built for performance, security, and exceptional user experience.',                   
    color: '#8B5CF6', 
    glow: 'rgba(139,92,246,0.12)',
    longDesc: "We build intuitive and high-performance mobile applications for both iOS and Android platforms. From UI/UX design to development and deployment, we ensure your app delivers a seamless user experience while meeting your business objectives and scalability needs.\n\nCreate user-friendly mobile apps for iOS and Android.\nWe ensure seamless performance and engaging user experiences."
  },
  { 
    Svg: SvgCloud,    
    title: 'Cloud Services',                      
    desc: 'Agile cloud solutions for faster innovation. Migrate, manage, and modernize your infrastructure.',       
    color: '#06B6D4', 
    glow: 'rgba(6,182,212,0.12)',
    longDesc: "Our cloud solutions enable businesses to scale faster and innovate efficiently. We help you migrate to the cloud, optimize existing cloud environments, and manage infrastructure with high availability, security, and cost efficiency using modern AWS cloud technologies.\n\nScale your business with flexible and secure cloud solutions.\nWe help you migrate, manage, and optimize your cloud infrastructure."
  },
  { 
    Svg: SvgMigrate,  
    title: 'Website Upgrade & Migration',         
    desc: 'Upgrade and migrate systems for better performance, visibility, and modern quality standards.',          
    color: '#6366F1', 
    glow: 'rgba(99,102,241,0.12)',
    longDesc: "We modernize and upgrade your existing systems to improve performance, security, and scalability. Whether migrating to new platforms or upgrading legacy systems, we ensure a smooth transition with minimal downtime and enhanced user experience.\n\nUpgrade legacy systems for better performance and scalability.\nWe ensure smooth and efficient migrations with minimal downtime."
  },
  { 
    Svg: SvgAPI,      
    title: 'API Integration',                     
    desc: 'Securely integrate systems for smooth communication and seamless data flow across all platforms.',       
    color: '#EC4899', 
    glow: 'rgba(236,72,153,0.12)',
    longDesc: "We enable seamless communication between different systems through secure and efficient API integrations. Our solutions ensure smooth data flow, improved automation, and better connectivity across applications, helping your business operate more efficiently.\n\nConnect systems for seamless communication and data flow.\nWe enable secure and efficient integrations across platforms."
  },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <section id="services" style={{ background: 'var(--bg-main)', padding: '80px 0', transition: 'background 0.3s ease' }}>

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
              fontSize: 'clamp(1.4rem, 2.8vw, 2.8rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Services &amp; <span className="gradient-text">Solutions</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 580, margin: '0 auto', lineHeight: 1.7, fontFamily: "'Roboto','Poppins',sans-serif" }}>
            Embark on a transformative journey with Klanvision's robust technology services to elevate your business to new heights.
          </p>

        </motion.div>

        {/* ── Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => {
                if (s.title === 'Managed Services') window.location.href = 'https://www.klanvision.com/managed-services';
                if (s.title === 'IT Consultation & Advisory') window.location.href = 'https://www.klanvision.com/it-consultation';
                if (s.title === 'Securing Your Digital Infrastructure') window.location.href = 'https://www.klanvision.com/cybersecurity';
                if (s.title === 'Web Development') window.location.href = 'https://www.klanvision.com/web-development';
                if (s.title === 'Mobile App Design & Deployment') window.location.href = 'https://www.klanvision.com/mobile-app';
                if (s.title === 'Cloud Services') window.location.href = 'https://www.klanvision.com/cloud-services';
                if (s.title === 'Website Upgrade & Migration') window.location.href = 'https://www.klanvision.com/upgrade-migration';
                if (s.title === 'API Integration') window.location.href = 'https://www.klanvision.com/api-integration';
              }}
              className="card"
              style={{ 
                padding: '32px 24px', 
                position: 'relative', 
                overflow: 'hidden', 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-main)',
                transition: 'all 0.3s ease'
              }}
            >

              {/* Top color accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: s.color, borderRadius: '20px 20px 0 0' }} />

              {/* 3D Icon Container – centered */}
              <motion.div
                whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                style={{ 
                  marginBottom: 20, 
                  position: 'relative', 
                  display: 'inline-block', 
                  alignSelf: 'center',
                  zIndex: 1 
                }}
              >
                {/* Centered Glow (Shadow) directly behind icon */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: s.glow, 
                  filter: 'blur(24px)', 
                  opacity: 0.8,
                  pointerEvents: 'none',
                  zIndex: -1
                }} />

                <div style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.18))' }}>
                  <s.Svg />
                </div>
              </motion.div>

              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 10, lineHeight: 1.3, color: 'var(--text-main)' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.65, marginBottom: 0, fontFamily: "'Roboto','Poppins',sans-serif", flexGrow: 1 }}>{s.desc}</p>


              {/* Read More – text + round animated arrow circle */}
              <div 
                style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} 
                className="read-more-wrap"
                onClick={(e) => {
                  e.stopPropagation();
                  if (s.title === 'Managed Services') window.location.href = 'https://www.klanvision.com/managed-services';
                  if (s.title === 'IT Consultation & Advisory') window.location.href = 'https://www.klanvision.com/it-consultation';
                  if (s.title === 'Securing Your Digital Infrastructure') window.location.href = 'https://www.klanvision.com/cybersecurity';
                  if (s.title === 'Web Development') window.location.href = 'https://www.klanvision.com/web-development';
                  if (s.title === 'Mobile App Design & Deployment') window.location.href = 'https://www.klanvision.com/mobile-app';
                  if (s.title === 'Cloud Services') window.location.href = 'https://www.klanvision.com/cloud-services';
                  if (s.title === 'Website Upgrade & Migration') window.location.href = 'https://www.klanvision.com/upgrade-migration';
                  if (s.title === 'API Integration') window.location.href = 'https://www.klanvision.com/api-integration';
                }}
              >
                <span style={{ color: s.color, fontWeight: 700, fontSize: 13, fontFamily: "'Poppins',sans-serif", letterSpacing: '0.3px' }}>Read More</span>
                {/* Animated round arrow button */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.15 }}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 14px ${s.glow}`,
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="13 6 19 12 13 18"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Responsive Refinements ──────────────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          #services { padding: 64px 0 !important; }
          #services .container { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          #services { padding: 56px 0 !important; }
          #services h2 { font-size: 1.6rem !important; }
          #services .grid { gap: 16px !important; }
          #services .card h3 { font-size: 13px !important; }
          #services .card p { font-size: 11px !important; }
        }
        @media (max-width: 480px) {
          #services { padding: 48px 0 !important; }
          #services h2 { font-size: 1.4rem !important; }
          #services .grid { gap: 10px !important; }
          #services .card { padding: 20px 12px !important; gap: 8px !important; }
          #services .card h3 { font-size: 12px !important; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; height: 32px; }
          #services .card p { display: none !important; } /* Hide desc on very small mobile to maintain 2-col layout */
          #services .read-more-wrap { justify-content: center; margin-top: 12px !important; gap: 6px !important; }
          #services .read-more-wrap span { display: block !important; font-size: 10px !important; } 
          #services .read-more-wrap div { width: 24px !important; height: 24px !important; } /* Smaller arrow circle */
        }
      `}</style>

      {/* ── Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-surface)',
                maxWidth: 600,
                width: '100%',
                borderRadius: 24,
                padding: '40px',
                position: 'relative',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-main)',
                overflow: 'hidden'
              }}

            >
              {/* Accent corner */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, background: `radial-gradient(circle at top right, ${selectedService.glow}, transparent)`, pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ padding: 12, borderRadius: 16, background: `${selectedService.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <selectedService.Svg />
                  </div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--text-main)' , margin: 0 }}>
                    {selectedService.title}
                  </h3>

                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  style={{
                    background: '#F3F4F6',
                    border: 'none',
                    width: 36, height: 36,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#E5E7EB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#F3F4F6'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div style={{ borderLeft: `4px solid ${selectedService.color}`, paddingLeft: 20, marginBottom: 32 }}>
                <p style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: 16, 
                  lineHeight: 1.8, 
                  fontFamily: "'Roboto','Poppins',sans-serif",
                  whiteSpace: 'pre-line' 
                }}>
                  {(selectedService as any).longDesc}
                </p>

              </div>

              <button
                onClick={() => setSelectedService(null)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  background: selectedService.color,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 16,
                  fontFamily: "'Poppins',sans-serif",
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 10px 20px -5px ${selectedService.glow}`,
                  transition: 'transform 0.2s, boxShadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 15px 25px -5px ${selectedService.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 10px 20px -5px ${selectedService.glow}`;
                }}
              >
                Close Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
