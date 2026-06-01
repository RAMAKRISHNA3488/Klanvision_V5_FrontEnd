import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Code2, Layout, Database, Zap, ArrowRight, CheckCircle2, Cpu, Smartphone, Monitor, Gauge, Rocket } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function WebDevelopmentPage() {
  useSEO({
    title: 'Web Development Services | Scalable & Modern Web Apps – Klanvision',
    description: 'Klanvision builds high-performance, scalable web applications using React, Next.js & Node.js. Enterprise architecture, UX/UI design, SEO-ready and Lighthouse 100 performance.',
    keywords: 'web development, React, Next.js, enterprise web app, scalable websites, UX design, Klanvision',
    canonical: '/web-development',
  });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const webFeatures = [
    {
      title: "Enterprise Architecture",
      desc: "We design and develop modern, scalable, and secure web applications tailored to your business needs using cutting-edge frameworks like React, Next.js, and Node.js.",
      icon: <Cpu className="w-8 h-8" />,
      color: "#0EA5E9",
      features: ["Scalable Microservices", "Micro-frontend Patterns", "API-First Design"]
    },
    {
      title: "Immersive UX/UI Design",
      desc: "Our focus is on performance, user experience, and responsiveness, ensuring your website delivers seamless functionality across all devices and platforms.",
      icon: <Layout className="w-8 h-8" />,
      color: "#8B5CF6",
      features: ["Motion Design Systems", "Accessibility (WCAG)", "Conversion-Centric UX"]
    },
    {
      title: "High-Performance Backend",
      desc: "Robust database architectures and server-side logic designed for high availability, ensuring your application handles massive traffic without a single millisecond of lag.",
      icon: <Database className="w-8 h-8" />,
      color: "#F59E0B",
      features: ["Real-time Data Processing", "Distributed Caching", "Auto-scaling Infrastructure"]
    },
    {
      title: "Edge Optimization & SEO",
      desc: "We utilize modern CDN strategies and server-side rendering to ensure lightning-fast page loads and top-tier search engine visibility from day one.",
      icon: <Zap className="w-8 h-8" />,
      color: "#10B981",
      features: ["Lighthouse Score 100", "Semantic HTML5", "Global Edge Caching"]
    }
  ];

  return (
    <div ref={containerRef} style={{ background: '#0F172A', minHeight: '100vh', color: 'white', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive 3D Web Hero Section ── */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at top right, #1E293B 0%, #0F172A 100%)', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated 3D Floating Elements */}
        <motion.div 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent)', pointerEvents: 'none' }} 
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <a href="/" style={{ color: '#0EA5E9', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO SOLUTIONS
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#0EA5E9', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '2px' }}
                  >
                    <Code2 size={14} fill="currentColor" /> ENTERPRISE WEB ENGINEERING
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Modern & <br />
                    <span style={{ color: '#0EA5E9', textShadow: '0 0 40px rgba(14,165,233,0.3)' }}>Scalable</span> Web.
                  </h1>
                  
                  <p style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    We design and develop modern, scalable, and secure web applications tailored to your business needs. Focus on performance, user experience, and responsiveness.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#0EA5E9', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(14,165,233,0.3)' }}>
                      Start Your Project <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* 3D Visual - Dev Nodes */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <Monitor size={32} />, label: "DESKTOP", top: '10%', left: '20%', delay: 0, color: '#0EA5E9' },
                    { icon: <Database size={32} />, label: "DATA", top: '50%', left: '60%', delay: 1, color: '#8B5CF6' },
                    { icon: <Smartphone size={32} />, label: "MOBILE", top: '20%', left: '70%', delay: 0.5, color: '#10B981' },
                    { icon: <Code2 size={32} />, label: "BUILD", top: '70%', left: '30%', delay: 1.5, color: '#F59E0B' }
                  ].map((node, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
                      style={{ 
                        position: 'absolute', 
                        top: node.top, left: node.left, 
                        width: 140, height: 140, 
                        background: 'rgba(30, 41, 59, 0.8)', 
                        borderRadius: 32, 
                        border: `1px solid ${node.color}40`,
                        backdropFilter: 'blur(12px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 12,
                        boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${node.color}20`
                      }}
                    >
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, Infinity, delay: node.delay }}
                        style={{ color: node.color }}
                      >
                        {node.icon}
                      </motion.div>
                      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, color: '#94A3B8' }}>{node.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Web Pillars ── */}
      <section style={{ padding: '140px 0', background: 'white', color: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24 }}
            >
              The Foundation of <span style={{ color: '#0EA5E9' }}>Digital Success</span>
            </motion.h2>
            <p style={{ color: '#64748B', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              Build modern, scalable, and secure web applications. We deliver high-performance solutions tailored to your business needs using world-class architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {webFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                style={{ 
                  background: '#F8FAFC', 
                  borderRadius: 40, 
                  padding: 56, 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                  border: '1px solid #F1F5F9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 32,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ 
                  width: 80, height: 80, borderRadius: 24, 
                  background: `${feature.color}10`, 
                  color: feature.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>{feature.title}</h3>
                  <p style={{ color: '#64748B', fontSize: 18, lineHeight: 1.7 }}>{feature.desc}</p>
                </div>
                
                <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid #E2E8F0' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {feature.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#334155', fontWeight: 600 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <CheckCircle2 size={14} color="white" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Performance Dashboard Visualization ── */}
      <section style={{ padding: '140px 0', background: '#0F172A' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>Lighthouse <br /><span style={{ color: '#0EA5E9' }}>Optimized</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 20, lineHeight: 1.7, marginBottom: 40 }}>
                We ensure your website or application delivers seamless functionality across all devices and platforms with a core focus on performance scores.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { title: "Zero Millisecond Latency", content: "Edge-cached delivery ensures your content is served from the closest location to your user." },
                  { title: "Fully Responsive Layouts", content: "Pixel-perfect rendering on everything from smartwatches to 4K desktop displays." },
                  { title: "SEO-Ready Architecture", content: "Server-side rendering and meta-tag optimization built directly into the core." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 20 }}>{i+1}</div>
                    <div>
                      <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{item.title}</h4>
                      <p style={{ color: '#94A3B8', fontSize: 16 }}>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotateY: 30 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              style={{ position: 'relative', perspective: '1200px' }}
            >
              {/* Futuristic Dev Dashboard */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '48px',
                padding: '60px',
                border: '1px solid rgba(14,165,233,0.2)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 40px rgba(14,165,233,0.1)',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}>
                {/* Decorative Inner Glow */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(14,165,233,0.15)', filter: 'blur(40px)', borderRadius: '50%' }} />
                
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                   <motion.div 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     style={{ fontSize: 12, fontWeight: 900, color: '#0EA5E9', letterSpacing: 3, marginBottom: 16 }}
                   >
                     WEB VITALS: AUDIT PASSED
                   </motion.div>
                   <div style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(14,165,233,0.4)' }}>100%</div>
                   <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700, marginTop: 8 }}>PERFORMANCE SCORE</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                   {[
                     { label: "FCP", val: 100, color: '#0EA5E9', desc: "Content Load" },
                     { label: "LCP", val: 98, color: '#8B5CF6', desc: "Visual Load" },
                     { label: "FID", val: 100, color: '#10B981', desc: "Interaction" },
                     { label: "CLS", val: 100, color: '#F59E0B', desc: "Stability" }
                   ].map((stat, i) => (
                     <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 16px' }}>
                           <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                              <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                              <motion.circle 
                                cx="40" cy="40" r="36" fill="transparent" stroke={stat.color} strokeWidth="4" 
                                strokeDasharray="226.2"
                                initial={{ strokeDashoffset: 226.2 }}
                                whileInView={{ strokeDashoffset: 226.2 - (226.2 * stat.val) / 100 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, delay: i * 0.2 }}
                              />
                           </svg>
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'white' }}>{stat.val}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#CBD5E1' }}>{stat.label}</div>
                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{stat.desc}</div>
                     </div>
                   ))}
                </div>

                {/* Additional Micro-stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Gauge size={16} color="#0EA5E9" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>TTFB: <span style={{ color: 'white' }}>0.2s</span></span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Rocket size={16} color="#10B981" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>SEO: <span style={{ color: 'white' }}>100/100</span></span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Build? (Refined CTA) ── */}
      <section style={{ padding: '80px 0', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', 
              borderRadius: '32px', 
              padding: '60px 40px', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto',
              border: '1px solid rgba(14,165,233,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ display: 'inline-block', color: '#0EA5E9', marginBottom: 16 }}
              >
                <Rocket size={32} fill="currentColor" />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: 'white' }}>
                Ready to Build Your <br /><span style={{ color: '#0EA5E9' }}>Digital Empire?</span>
              </h2>
              
              <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.5 }}>
                Launch a high-performance web application that delivers results. Partner with our engineering team to build your vision today.
              </p>

              <motion.a 
                href="/#contact-form" 
                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(14,165,233,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  textDecoration: 'none', 
                  padding: '18px 48px', 
                  fontSize: '18px', 
                  borderRadius: '14px', 
                  background: '#0EA5E9', 
                  color: 'white', 
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 10px 20px rgba(14,165,233,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Launch Your Project <ArrowRight size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
