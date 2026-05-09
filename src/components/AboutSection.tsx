// ============================================================
// AboutSection.tsx
// Company overview section for Klanvision.
// Two-column layout: left = team image + milestone tiles,
// right = description paragraphs, highlight list, and a quote.
// ============================================================

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

// ── Innovative 3D Animated Icons for About Section ──────────

const SvgCalendar3D = () => (
  <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
    <defs>
      <radialGradient id="cal-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#3730A3"/></radialGradient>
      <linearGradient id="cal-pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EEF2FF"/><stop offset="100%" stopColor="#C7D2FE"/></linearGradient>
    </defs>
    {/* Shadow base */}
    <rect x="6" y="10" width="30" height="26" rx="4" fill="#1E1B4B" opacity="0.2" transform="translate(1,2)"/>
    {/* 3D Body */}
    <rect x="6" y="10" width="30" height="26" rx="4" fill="url(#cal-bg)"/>
    <rect x="6" y="10" width="30" height="6" rx="2" fill="#312E81" fillOpacity="0.5"/>
    {/* Moving Pages */}
    <motion.rect
      x="10" y="14" width="22" height="18" rx="2" fill="url(#cal-pg)"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.rect
      x="10" y="14" width="22" height="18" rx="2" fill="white" fillOpacity="0.4"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    {/* Red dots for accent */}
    <circle cx="10" cy="8" r="1.5" fill="#EF4444"/>
    <circle cx="32" cy="8" r="1.5" fill="#EF4444"/>
  </svg>
);

const SvgLocation3D = () => (
  <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
    <defs>
      <radialGradient id="loc-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#818CF8"/><stop offset="100%" stopColor="#4F46E5"/></radialGradient>
    </defs>
    {/* Pulsing ring base */}
    <motion.circle
      cx="21" cy="36" r="6" fill="#4F46E5" fillOpacity="0.2"
      animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* 3D Pin Head */}
    <motion.path
      d="M21 4 Q33 4 33 16 C33 28 21 38 21 38 C21 38 9 28 9 16 Q9 4 21 4 Z"
      fill="url(#loc-bg)"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <circle cx="21" cy="16" r="5" fill="white" fillOpacity="0.4"/>
    <circle cx="21" cy="16" r="2.5" fill="white"/>
  </svg>
);

const SvgProjects3D = () => (
  <svg width="32" height="32" viewBox="0 0 42 42" fill="none">
    <defs>
      <radialGradient id="prj-bg" cx="35%" cy="28%" r="70%"><stop offset="0%" stopColor="#34D399"/><stop offset="100%" stopColor="#065F46"/></radialGradient>
    </defs>
    {/* Stacked layers effect */}
    <motion.path
      d="M8 28 L21 35 L34 28 L21 21 Z"
      fill="#065F46" fillOpacity="0.2"
      animate={{ y: [0, 2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M8 22 L21 29 L34 22 L21 15 Z"
      fill="#065F46" fillOpacity="0.4"
      animate={{ y: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.path
      d="M8 16 L21 23 L34 16 L21 9 Z"
      fill="url(#prj-bg)"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
    <path d="M21 14 L28 18 L21 22 L14 18 Z" fill="white" fillOpacity="0.3"/>
  </svg>
);

// Key company highlights rendered as a checkmark bullet list
const highlights = [
  'Specializing in innovative design, web development & digital marketing',
  'Delivering seamless digital services since 2025',
  'Prioritizing quality, efficiency, and customer satisfaction',
  'Combining creativity with smart work to build lasting digital brands',
  'Committed to shaping the digital future with new ideas and innovations',
];

export default function AboutSection() {
  return (
    // Section – light gray background with decorative blob overlays
    <section id="about" style={{ background: 'var(--bg-main)', padding: '80px 0', position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>

      {/* Decorative background blobs – indigo top-right, orange bottom-left */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.07), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.07), transparent)', pointerEvents: 'none' }} />

      <div className="container">
        {/* Section Header – accent bar + heading + italic tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="accent-bar" />
          <h2 className="font-bold tracking-tight text-[var(--text-main)]" style={{ marginBottom: 16 }}>
            About <span className="gradient-text">Us</span>
          </h2>

          <p style={{ color: '#7C3AED', fontSize: 16, fontStyle: 'italic', fontWeight: 500, maxWidth: 580, margin: '0 auto' }}>
            Guiding the digital future with clarity and consistency. Our vision since 2025: Transforming Ideas into Digital Reality.
          </p>
        </motion.div>

        {/* Two-column grid: image left, content right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left – Team image with gradient overlay and milestone tiles */}
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: 'relative' }}
          >
            {/* Image with indigo gradient overlay at the bottom */}
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', position: 'relative' }}>
              <img src="/about.png" alt="Klanvision team working" style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(79,70,229,0.35), transparent)' }} />
            </div>

            {/* Milestone tiles – float over bottom of image in a 3-column grid */}
            <div className="milestone-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: -36, padding: '0 16px', position: 'relative', zIndex: 2 }}>
              {[
                { icon: SvgCalendar3D, val: '2025',     lbl: 'Founded'  },
                { icon: SvgLocation3D, val: 'Anantapur', lbl: 'HQ, AP'  },
                { icon: SvgProjects3D, val: '200+',      lbl: 'Projects' },
              ].map((m, i) => (
                <motion.div
                  key={m.lbl}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass milestone-tile"
                  style={{ 
                    borderRadius: 16, 
                    padding: '14px 10px', 
                    textAlign: 'center', 
                    boxShadow: 'var(--card-shadow)',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-main)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ marginBottom: 4 }}><m.icon /></div>
                  <h4 style={{ margin: 0, fontFamily: 'sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text-main)' }}>{m.val}</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{m.lbl}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right – Company description, highlights, and closing quote */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}
          >
            {/* Badge label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(79,70,229,0.08)', color: '#4F46E5',
              fontWeight: 700, fontSize: 13, padding: '8px 18px', borderRadius: 50,
              width: 'fit-content',
              border: '1px solid rgba(79,70,229,0.2)'
            }}>
              <Globe size={16} /> About Klanvision
            </div>


            {/* Company description paragraphs */}
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8 }}>
              Klanvision is a professional company specializing in innovative design, web development, and digital marketing. Headquartered in <strong style={{ color: '#4F46E5' }}>Anantapur, Andhra Pradesh</strong>, we provide comprehensive solutions for scalable growth across industries.
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8 }}>
              Since 2025, we have been delivering seamless digital services, ensuring every business achieves its digital goals. At Klanvision, we prioritize quality, efficiency, and customer satisfaction.
            </p>


            {/* Highlights – animated checkmark bullet list */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'var(--text-main)', fontSize: 14.5 }}
                >

                  {/* Gradient checkmark icon */}
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {h}
                </motion.li>
              ))}
            </ul>

            {/* Inspirational quote with left purple border */}
            <div style={{
              borderRadius: 16, padding: '20px 24px',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.05), rgba(124,58,237,0.05))',
              borderLeft: '4px solid #7C3AED',
            }}>
              <p style={{ color: '#7C3AED', fontStyle: 'italic', fontWeight: 500, fontSize: 15, lineHeight: 1.75 }}>
                "Our team focuses on delivering innovative solutions in web design, application development, and cloud services. We are committed to shaping the digital future."
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Responsive Refinements ──────────────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          #about { padding: 64px 0 !important; }
          #about .container { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          #about { padding: 56px 0 !important; }
          #about h2 { font-size: 1.6rem !important; }
          .milestone-grid { gap: 8px !important; margin-top: -24px !important; }
          .milestone-tile { padding: 12px 6px !important; border-radius: 12px !important; }
          .milestone-tile h4 { font-size: 14px !important; }
          .milestone-tile span { font-size: 9px !important; }
        }
        @media (max-width: 480px) {
          #about { padding: 48px 0 !important; }
          #about h2 { font-size: 1.4rem !important; }
          .milestone-grid { gap: 6px !important; margin-top: -20px !important; }
          .milestone-tile { padding: 10px 4px !important; }
          .milestone-tile h4 { font-size: 11px !important; }
          .milestone-tile span { font-size: 8px !important; }
          #about p { font-size: 14px !important; line-height: 1.6 !important; }
          #about ul li { fontSize: 13px !important; }
        }
      `}</style>
    </section>
  );
}
