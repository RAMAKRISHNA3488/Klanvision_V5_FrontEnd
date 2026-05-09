// ============================================================
// TestimonialsSection.tsx
// Sliding-track carousel: 3 cards always visible, 1 card advances at a time.
// Track physically slides left by one card-width every 4 s.
// Seamless infinite loop via duplicated cards + instant-reset.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, UserCheck, UserRound, Medal, LockKeyhole, Zap, Globe, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO, TechStartup Pvt. Ltd.',
    icon: User,
    rating: 5,
    text: 'Klanvision transformed our outdated website into a modern, fast, and beautiful platform. Our conversions increased by 180% within three months of launch. Absolutely outstanding work!',
  },
  {
    name: 'Priya Sharma',
    role: 'Marketing Head, RetailBrand',
    icon: UserCheck,
    rating: 5,
    text: 'The SEO and digital marketing team at Klanvision is phenomenal. We went from page 8 to page 1 on Google for our key terms. The ROI has been exceptional.',
  },
  {
    name: 'Aditya Reddy',
    role: 'Founder, HealthTech Solutions',
    icon: UserRound,
    rating: 5,
    text: 'Our mobile app was delivered on time with zero bugs. The UI/UX design exceeded our expectations. Klanvision truly understands the healthcare domain. Highly recommended!',
  },
  {
    name: 'Sneha Patel',
    role: 'CTO, FinServe Inc.',
    icon: User,
    rating: 5,
    text: 'The cloud migration was seamless. Zero downtime, perfect documentation, and the team stayed with us through every step. Klanvision is now our go-to technology partner.',
  },
  {
    name: 'Meera Nair',
    role: 'VP Digital, EduLearn Platform',
    icon: UserRound,
    rating: 5,
    text: 'Klanvision rebuilt our entire e-learning platform. Page load times dropped by 70% and student engagement tripled. They really understand user experience at scale.',
  },
  {
    name: 'Sanjay Singhania',
    role: 'Operations Director, GlobalLogistics',
    icon: Globe,
    rating: 5,
    text: "The API integrations provided by Klanvision automated 90% of our manual tracking processes. We've seen a 40% reduction in operational costs and 100% data accuracy across our global network.",
  },
  {
    name: 'Ananya Das',
    role: 'Creative Director, StudioX',
    icon: Medal,
    rating: 5,
    text: "Working with Klanvision was a breath of fresh air. Their eye for detail and commitment to premium design is unmatched. They didn't just build a site; they built a digital masterpiece for our brand.",
  },
  {
    name: 'Karthik Iyer',
    role: 'CTO, SecureBank India',
    icon: LockKeyhole,
    rating: 5,
    text: 'Security was our #1 priority. Klanvision delivered a robust, zero-trust infrastructure that passed every audit with flying colors. Their cybersecurity expertise is truly enterprise-grade.',
  },
  {
    name: 'Deepika Rao',
    role: 'E-commerce Manager, FashionHub',
    icon: Zap,
    rating: 5,
    text: "Our previous site crashed every Black Friday. Klanvision's new architecture handled our record-breaking traffic this year without a single millisecond of lag. Our revenue goals were smashed!",
  },
];

const N = testimonials.length;   // 6
const VISIBLE = 3;
const GAP = 24;                   // px gap between cards
// Duplicate cards so the track appears infinite: [...originals, ...originals]
const track = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
  // activeIndex = index of the first visible card in the TRACK (0 … N-1, then wraps)
  const [activeIndex, setActiveIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Measure container width (and update on resize)
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // cardWidth = (containerWidth - (VISIBLE-1)*GAP) / VISIBLE
  // stepPx    = cardWidth + GAP  =  (containerWidth + GAP) / VISIBLE
  const [visibleCards, setVisibleCards] = useState(3);
  
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth <= 480) setVisibleCards(1);
      else if (window.innerWidth <= 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const stepPx = containerWidth > 0 ? (containerWidth + GAP) / visibleCards : 0;
  const translateX = -activeIndex * stepPx;

  // Auto-advance: move forward by 1 every 4 s
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimate(true);
      setActiveIndex(prev => prev + 1);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // When we've slid through all N originals (activeIndex === N),
  // instantly reset to 0 so the loop is seamless.
  useEffect(() => {
    if (activeIndex === N) {
      // Wait for the slide animation to finish, then snap back silently
      const t = setTimeout(() => {
        setAnimate(false);
        setActiveIndex(0);
      }, 520); // slightly > transition duration
      return () => clearTimeout(t);
    }
  }, [activeIndex]);

  // Re-enable animation one frame after the silent reset
  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  const goTo = (idx: number) => {
    setAnimate(true);
    setActiveIndex(idx);
    startTimer();
  };

  const dotActive = activeIndex % N; // which original card is leading

  return (
    <section id="testimonials" style={{ background: 'var(--bg-main)', padding: '80px 0', transition: 'background 0.3s ease' }}>

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
              fontWeight: 700, lineHeight: 1.15,
              letterSpacing: '-0.02em', marginBottom: 16,
            }}
          >
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p style={{
            color: 'var(--text-muted)', fontSize: 16, maxWidth: 540,
            margin: '0 auto', lineHeight: 1.7,
            fontFamily: "'Roboto','Poppins',sans-serif",
          }}>

            Real stories from businesses that transformed their digital presence with Klanvision.
          </p>
        </motion.div>

        {/* ── Sliding-track carousel */}
        <div
          ref={containerRef}
          style={{ overflow: 'hidden' }}
        >
          <motion.div
            style={{
              display: 'flex',
              gap: GAP,
              // track is wide enough to hold all duplicated cards
              width: `calc(${track.length / visibleCards * 100}% + ${track.length / visibleCards * GAP}px)`,
            }}
            animate={{ x: translateX }}
            transition={animate ? { duration: 0.5, ease: 'easeInOut' } : { duration: 0 }}
          >
            {track.map((t, i) => {
              const cardWidthStyle = `calc((${containerWidth}px - ${(visibleCards - 1) * GAP}px) / ${visibleCards})`;
              return (
                <div
                  key={i}
                  className="testimonial-card"
                  style={{
                    minWidth: cardWidthStyle,
                    maxWidth: cardWidthStyle,
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    background: 'var(--bg-surface)',
                    boxShadow: 'var(--card-shadow)',
                    border: '1px solid var(--border-main)',
                    borderRadius: '24px',
                    padding: '32px',
                    transition: 'all 0.3s ease'
                  }}
                >

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <span key={si} style={{ color: '#FBBF24' }}>
                        <Star size={16} fill="currentColor" />
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p style={{
                    color: 'var(--text-main)', fontSize: 15, lineHeight: 1.75, marginBottom: 24,
                    fontStyle: 'italic', fontFamily: "'Roboto','Poppins',sans-serif",
                  }} className="testimonial-text">
                    &ldquo;{t.text}&rdquo;
                  </p>


                  {/* Author */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    paddingTop: 20, borderTop: '1px solid var(--border-main)',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: 'white',
                    }} className="author-icon">
                      <t.icon size={22} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>
                        {t.name}
                      </div>

                      <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2, fontFamily: "'Roboto',sans-serif" }}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Dot Indicators – one per original testimonial */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 36 }}>
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              animate={{
                width: i === dotActive ? 28 : 10,
                background: i === dotActive
                  ? 'linear-gradient(90deg, #6366f1, #a855f7)'
                  : 'var(--border-main)',

              }}
              transition={{ duration: 0.35 }}
              style={{ height: 10, borderRadius: 5, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>

        {/* ── Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 56, flexWrap: 'wrap' }}
          className="trust-badges"
        >
          {[
            { icon: Medal, text: 'ISO Certified Quality' },
            { icon: LockKeyhole, text: 'Data Privacy Compliant' },
            { icon: Zap, text: '99.9% Uptime SLA' },
            { icon: Globe, text: 'Global-Ready Solutions' },
          ].map((b) => (
            <div key={b.text} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-surface-soft)', borderRadius: 50,
              padding: '10px 22px', fontSize: 14, fontWeight: 600, color: 'var(--text-main)',
              fontFamily: "'Poppins',sans-serif",
              border: '1px solid var(--border-main)'
            }} className="badge-item">

              <span style={{ display: 'flex', alignItems: 'center', color: '#4F46E5' }}>
                <b.icon size={18} />
              </span>
              {b.text}
            </div>
          ))}
        </motion.div>

      </div>

      {/* ── Responsive Refinements ──────────────────────────────── */}
      <style>{`
        @media (max-width: 1024px) {
          #testimonials { padding: 64px 0 !important; }
          #testimonials .container { padding: 0 24px; }
          .trust-badges { gap: 16px !important; }
        }
        @media (max-width: 768px) {
          #testimonials { padding: 56px 0 !important; }
          #testimonials h2 { font-size: 1.6rem !important; }
          .testimonial-card { padding: 24px !important; }
          .testimonial-text { fontSize: 14px !important; }
          .badge-item { padding: 8px 16px !important; fontSize: 12px !important; }
        }
        @media (max-width: 480px) {
          #testimonials { padding: 48px 0 !important; }
          #testimonials h2 { font-size: 1.4rem !important; }
          .testimonial-card { padding: 20px !important; border-radius: 16px !important; }
          .testimonial-text { fontSize: 13px !important; line-height: 1.6 !important; }
          .author-icon { width: 40px !important; height: 40px !important; }
          .author-icon svg { width: 18px !important; height: 18px !important; }
          .trust-badges { margin-top: 32px !important; gap: 8px !important; }
          .badge-item { width: 100% !important; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
