import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Database, Search, Zap, Server, ArrowRight, ShieldCheck, RefreshCw, Lock, Activity, Globe } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function TrustedDatabasePage() {
  useSEO({
    title: 'Trusted Database | Klanvision',
    description: 'Our verification portal relies on a highly available, immutable, and secure database for real-time certificate validation.',
    canonical: '/verify-database',
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      title: "Real-Time Querying",
      desc: "Experience instantaneous verification results powered by edge computing and highly optimized database indexing.",
      icon: <Zap className="w-8 h-8" />,
      color: "#ec4899" // Pink
    },
    {
      title: "High Availability",
      desc: "Our distributed database architecture ensures 99.99% uptime, meaning credentials can be verified reliably around the clock.",
      icon: <Server className="w-8 h-8" />,
      color: "#8b5cf6" // Purple
    },
    {
      title: "Immutable Ledger",
      desc: "All issued credentials are chronologically logged in an immutable, append-only database to prevent historical tampering.",
      icon: <Database className="w-8 h-8" />,
      color: "#3b82f6" // Blue
    },
    {
      title: "End-to-End Encryption",
      desc: "All database records are secured with AES-256 encryption at rest, guaranteeing zero unauthorized data access.",
      icon: <Lock className="w-8 h-8" />,
      color: "#10b981" // Emerald
    },
    {
      title: "Automated Backups",
      desc: "Continuous data replication across multiple geographic zones ensures disaster recovery and zero data loss.",
      icon: <Activity className="w-8 h-8" />,
      color: "#f59e0b" // Amber
    },
    {
      title: "Global CDN Edge",
      desc: "Certificate data is cached at the edge across 200+ global locations for ultra-low latency verification anywhere.",
      icon: <Globe className="w-8 h-8" />,
      color: "#06b6d4" // Cyan
    }
  ];

  return (
    <div ref={containerRef} style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-main)', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive Hero Section ── */}
      <section style={{ 
        minHeight: '100vh', paddingTop: '160px',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at top right, #0F172A 0%, #020617 100%)', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Grid Background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Glow */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent)', pointerEvents: 'none' }} 
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <a href="/verify" style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO VERIFICATION
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#F59E0B', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '2px' }}
                  >
                    <Database size={14} fill="currentColor" color="#0F172A" /> SECURE SOURCE OF TRUTH
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Trusted <br />
                    <span style={{ color: '#F59E0B', textShadow: '0 0 40px rgba(245,158,11,0.3)' }}>Database</span>
                  </h1>
                  
                  <p style={{ fontSize: 20, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    Our verification system queries a highly optimized, securely distributed database. This guarantees instant, reliable, and immutable proof of certification.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/verify" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#F59E0B', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(245,158,11,0.2)' }}>
                      Test Verification <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* Animated Visual */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <Database size={32} />, label: "STORAGE", top: '10%', left: '20%', delay: 0, color: '#F59E0B' },
                    { icon: <Search size={32} />, label: "QUERY", top: '50%', left: '60%', delay: 1, color: '#D97706' },
                    { icon: <ShieldCheck size={32} />, label: "VERIFY", top: '20%', left: '70%', delay: 0.5, color: '#fbbf24' },
                    { icon: <RefreshCw size={32} />, label: "SYNC", top: '70%', left: '30%', delay: 1.5, color: '#fcd34d' }
                  ].map((node, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
                      style={{ 
                        position: 'absolute', top: node.top, left: node.left, 
                        width: 140, height: 140, background: 'rgba(15, 23, 42, 0.8)', 
                        borderRadius: 32, border: `1px solid ${node.color}40`, backdropFilter: 'blur(12px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                        boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${node.color}20`
                      }}
                    >
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, delay: node.delay }} style={{ color: node.color }}>
                        {node.icon}
                      </motion.div>
                      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)' }}>{node.label}</span>
                    </motion.div>
                  ))}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.2 }}>
                    <motion.path d="M200 150 Q 300 250 450 150" stroke="#F59E0B" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Details Section ── */}
      <section style={{ padding: '140px 0', background: 'var(--bg-surface)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24, color: 'var(--text-main)' }}
            >
              Enterprise-Grade <span style={{ color: '#F59E0B' }}>Infrastructure</span>
            </motion.h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              Our validation platform is powered by an industry-leading database architecture designed for absolute security, speed, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }} whileHover={{ y: -10, scale: 1.02 }}
                style={{ 
                  background: `linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, ${feature.color}15 100%)`, backdropFilter: 'blur(20px)',
                  borderRadius: 40, padding: 48, 
                  boxShadow: `0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -10px 30px ${feature.color}10`, 
                  border: `1px solid ${feature.color}30`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24, transition: 'all 0.4s',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {/* Animated Background Glow on Hover */}
                <motion.div
                   initial={{ opacity: 0 }}
                   whileHover={{ opacity: 0.1 }}
                   style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${feature.color}, transparent)`, pointerEvents: 'none' }}
                />
                
                {/* Animated Icon Container */}
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  style={{ flexShrink: 0, width: 90, height: 90, borderRadius: 28, background: `${feature.color}15`, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${feature.color}30`, position: 'relative', zIndex: 1 }}
                >
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}>
                    {feature.icon}
                  </motion.div>
                </motion.div>

                {/* Text Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', position: 'relative', zIndex: 1 }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>{feature.desc}</p>
                </div>

                {/* Animated Bottom Border */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  style={{ position: 'absolute', bottom: 0, left: 0, height: 4, background: feature.color, transition: 'width 0.4s ease' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
