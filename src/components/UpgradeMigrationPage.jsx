import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw, Zap, Search, ArrowRight, CheckCircle2, Cpu, Gauge } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function UpgradeMigrationPage() {
  useSEO({
    title: 'Website Upgrade & Migration | Zero-Downtime Modernization – Klanvision',
    description: 'Klanvision modernizes legacy systems and executes zero-downtime migrations with SEO-safe 301 redirects, data integrity checks, and blue-green deployments.',
    keywords: 'website upgrade, system migration, legacy modernization, zero downtime migration, SEO migration, Klanvision',
    canonical: '/upgrade-migration',
  });
  const upgradeFeatures = [
    {
      title: "Legacy Modernization",
      desc: "Transform outdated systems into modern, high-performance applications. We upgrade your tech stack while preserving your core business logic.",
      icon: <Cpu className="w-8 h-8" />,
      color: "#6366F1",
      features: ["Code Refactoring", "Database Normalization", "Security Hardening"]
    },
    {
      title: "SEO-Safe Migration",
      desc: "Migrate platforms or domains without losing your hard-earned search rankings. We handle 301 redirects, sitemaps, and link equity preservation.",
      icon: <Search className="w-8 h-8" />,
      color: "#F59E0B",
      features: ["Link Equity Retention", "Sitemap Optimization", "Canonical Mapping"]
    },
    {
      title: "Zero-Downtime Transition",
      desc: "Execute complex migrations with minimal to zero impact on your users. We use blue-green deployments to ensure a seamless switchover.",
      icon: <RefreshCw className="w-8 h-8" />,
      color: "#10B981",
      features: ["Parallel Environment Setup", "Live Data Sync", "Automated Rollback"]
    },
    {
      title: "Performance Benchmarking",
      desc: "We don't just migrate; we improve. Every upgrade comes with a pre- and post-migration audit to quantify speed and efficiency gains.",
      icon: <Gauge className="w-8 h-8" />,
      color: "#3B82F6",
      features: ["Lighthouse Audit", "Load Time Comparison", "Resource Efficiency"]
    }
  ];

  return (
    <div style={{ background: '#EEF2FF', minHeight: '100vh', color: '#0F172A', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive Upgrade Hero Section ── */}
      <section style={{ 
        background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', 
        color: 'white', 
        padding: '120px 0 100px', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated System Upgrade Visuals */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, border: '2px dashed rgba(99,102,241,0.2)', borderRadius: '50%', pointerEvents: 'none' }} 
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a href="/" style={{ color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 32, letterSpacing: '1px' }}>
              <ChevronLeft size={18} /> BACK TO SOLUTIONS
            </a>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(165,180,252,0.1)', border: '1px solid rgba(165,180,252,0.2)', padding: '8px 16px', borderRadius: '100px', color: '#A5B4FC', fontSize: 13, fontWeight: 700, marginBottom: 24 }}
                >
                  <RefreshCw size={14} /> SYSTEM EVOLUTION
                </motion.div>
                
                <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                  Website Upgrade & <br />
                  <span style={{ color: '#A5B4FC' }}>Smart Migration</span>
                </h1>
                
                <p style={{ fontSize: 20, color: '#C7D2FE', opacity: 0.9, lineHeight: 1.6, marginBottom: 40, maxWidth: 650 }}>
                  We modernize and upgrade your existing systems to improve performance, security, and scalability. Smooth transitions with zero downtime.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                  <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '18px 36px', background: '#6366F1', color: 'white', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(99,102,241,0.3)' }}>
                    Upgrade My System <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              {/* 3D Visualization – System Transition */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ position: 'relative', height: 400 }}
                className="hidden lg:block"
              >
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                    {/* Old System */}
                    <motion.div 
                      animate={{ scale: [1, 0.95, 1], opacity: [0.6, 0.4, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{ width: 140, height: 180, background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', gap: 8, padding: 15 }}
                    >
                       {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ width: '40%', height: 30, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />)}
                       <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5, marginTop: 10 }}>LEGACY</div>
                    </motion.div>
                    
                    <motion.div 
                      animate={{ x: [0, 20, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight size={48} className="text-indigo-300" />
                    </motion.div>

                    {/* New Modern System */}
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{ width: 160, height: 220, background: '#6366F1', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: 12, padding: 20, border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                       <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={20} /></div>
                       <div style={{ height: 12, width: '100%', background: 'rgba(255,255,255,0.3)', borderRadius: 6 }} />
                       <div style={{ height: 12, width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: 6 }} />
                       <div style={{ marginTop: 'auto', display: 'flex', gap: 5 }}>
                          {[1,2,3].map(i => <div key={i} style={{ width: 20, height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />)}
                       </div>
                       <div style={{ fontSize: 10, fontWeight: 800 }}>MODERN</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Upgrade & Migrate ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 20 }}>Better Performance & <span style={{ color: '#6366F1' }}>Enhanced Scalability</span></h2>
            <p style={{ color: '#64748B', fontSize: 18, maxWidth: 700, margin: '0 auto' }}>
              We ensure smooth and efficient migrations with minimal downtime. Transition your business to the next level of digital excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upgradeFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ 
                  background: 'white', 
                  borderRadius: 24, 
                  padding: 40, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20
                }}
              >
                <div style={{ 
                  width: 60, height: 60, borderRadius: 16, 
                  background: `${feature.color}10`, 
                  color: feature.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                
                <h3 style={{ fontSize: 22, fontWeight: 700 }}>{feature.title}</h3>
                <p style={{ color: '#64748B', lineHeight: 1.7 }}>{feature.desc}</p>
                
                <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #F1F5F9' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {feature.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155', fontWeight: 600 }}>
                        <CheckCircle2 size={16} style={{ color: '#10B981' }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seamless Transition Dashboard Visualization ── */}
      <section style={{ padding: '140px 0', background: '#0F172A' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>Seamless Transition <br /><span style={{ color: '#6366F1' }}>without Interruption</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 20, lineHeight: 1.7, marginBottom: 40 }}>
                Whether migrating to new platforms or upgrading legacy systems, we ensure a smooth transition with minimal downtime and enhanced user experience.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { title: "Parallel Environment Sync", content: "We run your new system alongside the old one, ensuring 100% stability before the final switchover." },
                  { title: "Automated Data Mapping", content: "AI-driven migration tools that map and transform your legacy data into modern structures instantly." },
                  { title: "SEO-Safe Switchover", content: "Zero-loss link equity preservation to keep your search engine rankings during the migration." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(99,102,241,0.1)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 20 }}>{i+1}</div>
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
              {/* Futuristic Evolution Dashboard */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '48px',
                padding: '60px',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.1)',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                   <motion.div 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     style={{ fontSize: 12, fontWeight: 900, color: '#6366F1', letterSpacing: 3, marginBottom: 16 }}
                   >
                     EVOLUTION STATUS: OPTIMIZED
                   </motion.div>
                   <div style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(99,102,241,0.4)' }}>4.2x</div>
                   <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700, marginTop: 8 }}>MIGRATION SPEED GAIN</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                   {[
                     { label: "Data Integrity", val: 100, color: '#6366F1', desc: "Validated" },
                     { label: "SEO Sync", val: 100, color: '#8B5CF6', desc: "Preserved" },
                     { label: "Downtime", val: 0, color: '#10B981', desc: "Zero" },
                     { label: "Modernization", val: 95, color: '#F59E0B', desc: "Architecture" }
                   ].map((stat, i) => (
                     <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 16px' }}>
                           <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                              <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                              <motion.circle 
                                cx="40" cy="40" r="36" fill="transparent" stroke={stat.color} strokeWidth="4" 
                                strokeDasharray="226.2"
                                initial={{ strokeDashoffset: 226.2 }}
                                whileInView={{ strokeDashoffset: 226.2 - (226.2 * (stat.label === "Downtime" ? 100 : stat.val)) / 100 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, delay: i * 0.2 }}
                              />
                           </svg>
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'white' }}>{stat.val === 0 ? "0%" : stat.val + "%"}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#CBD5E1' }}>{stat.label}</div>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Upgrade? (Refined Sleek CTA) ── */}
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
              border: '1px solid rgba(99,102,241,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ display: 'inline-block', color: '#6366F1', marginBottom: 16 }}
              >
                <Zap size={40} fill="currentColor" />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: 'white' }}>
                Ready to Modernize Your <br /><span style={{ color: '#6366F1' }}>Existing Systems?</span>
              </h2>
              
              <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.5 }}>
                Don't let legacy tech hold you back. Let's build a migration plan that accelerates your business.
              </p>

              <motion.a 
                href="/#contact-form" 
                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(99,102,241,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  textDecoration: 'none', 
                  padding: '18px 48px', 
                  fontSize: '18px', 
                  borderRadius: '14px', 
                  background: '#6366F1', 
                  color: 'white', 
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 10px 20px rgba(99,102,241,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Start Migration Discovery <ArrowRight size={20} />
              </motion.a>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> 100% Data Integrity
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> Zero Downtime
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
