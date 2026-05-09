// ============================================================
// WhyPartner.tsx
// "Why Partner with Us?" section for Klanvision.
// Contains:
//  1. Reason cards (3-col grid) – key differentiators
//  2. Animated stat counters (4-col grid) – live numbers
//  3. CTA banner – gradient background with call-to-action
// ============================================================

import { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { Trophy, Timer, Zap, Handshake, TrendingUp, Wrench, CheckCircle2, UserCheck, Heart, Award } from 'lucide-react';

// Reason cards data – icon, title, and short description
const reasons = [
  { icon: Trophy,     title: 'Expert Team',        desc: 'Our developers, designers, and strategists bring years of industry experience to every project.' },
  { icon: Timer,      title: 'Timely Delivery',    desc: 'We respect your timeline and consistently deliver high-quality solutions on schedule.' },
  { icon: Zap,        title: 'Cutting-Edge Tech',  desc: 'We leverage the latest technologies to build modern, scalable, and future-proof solutions.' },
  { icon: Handshake,  title: 'Client-Centered',    desc: 'Your goals are our goals. We work closely with you every step of the way.' },
  { icon: TrendingUp, title: 'Proven Results',     desc: 'Measurable outcomes — from traffic growth to conversion rate improvements.' },
  { icon: Wrench,     title: 'End-to-End Support', desc: 'From ideation to post-launch support, we are your full-cycle technology partner.' },
];

// Stats data – numeric value, label, and associated icon/color
const stats = [
  { num: '200+', label: 'Projects Delivered', icon: CheckCircle2, color: '#4F46E5', glow: 'rgba(79, 70, 229, 0.2)' },
  { num: '50+',  label: 'Happy Clients',      icon: UserCheck,    color: '#7C3AED', glow: 'rgba(124, 58, 237, 0.2)' },
  { num: '98%',  label: 'Client Satisfaction', icon: Heart,        color: '#EC4899', glow: 'rgba(236, 72, 153, 0.2)' },
  { num: '5+',   label: 'Years of Excellence', icon: Award,        color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)' },
];

// ── StatNumber Component ─────────────────────────────────────
// Animates a number from 0 to its target value over 2 seconds
// using framer-motion's animate() utility. Preserves any
// non-numeric suffix (e.g. "+" or "%").
function StatNumber({ value }: { value: string }) {
  const [display, setDisplay] = useState('0');
  const numeric = parseInt(value);           // extract the number
  const suffix   = value.replace(/[0-9]/g, ''); // extract suffix (+ or %)

  useEffect(() => {
    const controls = animate(0, numeric, {
      duration: 2,
      onUpdate: (latest) => setDisplay(Math.floor(latest).toString() + suffix),
    });
    return () => controls.stop(); // cleanup animation on unmount
  }, [numeric, suffix]);

  return <span>{display}</span>;
}

// ── TypingText Component ─────────────────────────────────────
// Animates text character by character for a typing effect.
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = (text || "").split("");

  return (
    <>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: delay + index * 0.03 }}
          viewport={{ once: true }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

export default function WhyPartner() {
  return (
    // Section – white background
    <section id="why-partner" style={{ background: 'var(--bg-main)', padding: '80px 0', transition: 'background 0.3s ease' }}>

      <div className="container">

        {/* Section Header – accent bar + heading + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="accent-bar" />
          <h2 className="font-bold tracking-tight text-[var(--text-main)]" style={{ marginBottom: 16 }}>

            <TypingText text="Why Partner " />
            <span 
              className="gradient-text" 
              style={{ 
                display: 'inline-block',
                backgroundSize: '200% auto',
                animation: 'shimmer-rtl 4s linear infinite',
                backgroundImage: 'linear-gradient(270deg, #4F46E5, #7C3AED, #EC4899, #7C3AED, #4F46E5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <TypingText text="with Us?" delay={0.4} />
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            <TypingText text="Expertise in Website, Mobile App Design, and Digital Marketing Solutions." delay={1.2} />
          </p>

        </motion.div>

        {/* Reason Cards – 2 col mobile, 3 cols lg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                borderColor: '#4F46E5'
              }}
              className="card"
              style={{ 
                padding: '32px 28px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: 20, 
                alignItems: 'center', 
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-main)',
                borderRadius: '24px',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: 'var(--card-shadow)'
              }}

            >
              {/* Gradient icon badge with matching glow */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.1)',
                color: '#4F46E5',
                transition: 'transform 0.3s ease'
              }}>
                <r.icon size={28} strokeWidth={2.2} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 10, color: 'var(--text-main)' }}>{r.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{r.desc}</p>
              </div>

            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14"
        >
          {stats.map((s, idx) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="stat-card" 
              style={{ 
                position: 'relative', 
                padding: '32px 20px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-main)',
                boxShadow: 'var(--card-shadow)',
                overflow: 'visible' // allow the badge to hang off
              }}

            >
              {/* Pulsing "3D" LIVE indicator top-right */}
              <div style={{ 
                position: 'absolute', 
                top: -12, 
                right: 12, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                background: 'var(--bg-surface-soft)',
                padding: '6px 12px',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-main)',
                zIndex: 10
              }}>

                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                    boxShadow: ['0 0 0px #10B981', '0 0 8px #10B981', '0 0 0px #10B981']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}
                />
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-main)', letterSpacing: 0.5 }}>. LIVE</span>
              </div>


              {/* Graphic Icon Badge */}
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${s.color}15, ${s.color}30)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: s.color,
                boxShadow: `0 8px 20px ${s.glow}`,
                position: 'relative'
              }}>
                <s.icon size={28} strokeWidth={2.5} />
              </div>

              {/* Animated counter number */}
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 38, lineHeight: 1.1, color: 'var(--text-main)' }}>
                <StatNumber value={s.num} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </motion.div>

          ))}
        </motion.div>

        {/* CTA Banner – gradient background with dotted pattern overlay */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="cta-banner"
          style={{
            borderRadius: 28, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            padding: '64px 40px', textAlign: 'center',
          }}
        >
          {/* Subtle dot-pattern texture overlay */}
          <div className="dotted-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: 'clamp(22px,3vw,34px)', color: 'white', marginBottom: 16 }}>
              Ready to Transform Your Digital Presence?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Join 50+ businesses that trust Klanvision to power their digital success.
            </p>
            {/* White CTA button scrolling to contact section */}
            <motion.button
              id="why-partner-cta"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'white', color: '#4F46E5', fontWeight: 800, fontSize: 16,
                padding: '16px 44px', borderRadius: 50, border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontFamily: 'sans-serif',
              }}
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Responsive Refinements ──────────────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          #why-partner { padding: 64px 0 !important; }
          #why-partner .container { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          #why-partner { padding: 56px 0 !important; }
          #why-partner h2 { font-size: 1.6rem !important; }
          #why-partner p { font-size: 14px !important; }
          #why-partner .grid { gap: 16px !important; }
          #why-partner .card { padding: 20px 16px !important; }
          #why-partner .card h3 { font-size: 15px !important; }
          #why-partner .stat-card { padding: 20px 10px !important; }
          #why-partner .stat-card div:nth-child(3) { font-size: 24px !important; } /* Stat number */
          #why-partner .stat-card div:last-child { font-size: 10px !important; } /* Stat label */
        }
        @media (max-width: 480px) {
          #why-partner { padding: 48px 0 !important; }
          #why-partner h2 { font-size: 1.4rem !important; }
          #why-partner .grid { gap: 10px !important; }
          #why-partner .card { padding: 16px 12px !important; gap: 12px !important; }
          #why-partner .card h3 { font-size: 13px !important; margin-bottom: 4px !important; }
          #why-partner .card p { font-size: 10px !important; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          #why-partner .card div:first-child { width: 48px !important; height: 48px !important; } /* Icon badge */
          #why-partner .stat-card { padding: 16px 8px !important; }
          #why-partner .stat-card div:nth-child(3) { font-size: 20px !important; } /* Stat number */
          .cta-banner { padding: 40px 20px !important; }
          .cta-banner h3 { font-size: 20px !important; }
          .cta-banner p { font-size: 14px !important; margin-bottom: 24px !important; }
          #why-partner-cta { padding: 12px 32px !important; font-size: 14px !important; }
        }
      `}</style>
    </section>
  );
}
