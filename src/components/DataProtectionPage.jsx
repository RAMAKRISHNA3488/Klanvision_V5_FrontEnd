import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Shield, Lock, EyeOff, Server, ArrowRight, Activity, FileCheck, Cloud, ShieldAlert, Radar } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function DataProtectionPage() {
  useSEO({
    title: 'Data Protection | Klanvision',
    description: 'We prioritize your privacy. Learn how Klanvision implements zero-knowledge architectures and end-to-end encryption.',
    canonical: '/verify-protection',
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
      title: "End-to-End Encryption",
      desc: "All personal information and credential data are encrypted at rest and in transit using military-grade AES-256 protocols.",
      icon: <Lock className="w-8 h-8" />,
      color: "#ec4899"
    },
    {
      title: "Zero-Knowledge Privacy",
      desc: "Our verification systems can validate your credentials without ever exposing the underlying sensitive data to unauthorized third parties.",
      icon: <EyeOff className="w-8 h-8" />,
      color: "#8b5cf6"
    },
    {
      title: "Regulatory Compliance",
      desc: "We strictly adhere to global data protection regulations including GDPR, CCPA, and SOC2, ensuring absolute compliance and trust.",
      icon: <FileCheck className="w-8 h-8" />,
      color: "#3b82f6"
    },
    {
      title: "Secure Cloud Isolation",
      desc: "Data is segregated into isolated virtual private clouds, preventing any horizontal movement from malicious actors.",
      icon: <Cloud className="w-8 h-8" />,
      color: "#10b981"
    },
    {
      title: "Active Threat Blocking",
      desc: "Multi-layered web application firewalls and DDoS mitigation actively block emerging threats before they reach our servers.",
      icon: <ShieldAlert className="w-8 h-8" />,
      color: "#f59e0b"
    },
    {
      title: "24/7 Security Radar",
      desc: "Our Security Operations Center continuously monitors infrastructure telemetry to identify and neutralize anomalous activity instantly.",
      icon: <Radar className="w-8 h-8" />,
      color: "#06b6d4"
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
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Glow */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.1), transparent)', pointerEvents: 'none' }} 
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <a href="/verify" style={{ color: '#00E5FF', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO VERIFICATION
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#00E5FF', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '2px' }}
                  >
                    <Shield size={14} fill="currentColor" color="#0F172A" /> UNCOMPROMISING PRIVACY
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Data <br />
                    <span style={{ color: '#00E5FF', textShadow: '0 0 40px rgba(0,229,255,0.3)' }}>Protection</span>
                  </h1>
                  
                  <p style={{ fontSize: 20, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    Your personal information is secure. We use zero-knowledge architecture and military-grade encryption to guarantee your data never falls into the wrong hands.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/verify" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#00E5FF', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(0,229,255,0.2)' }}>
                      Verify Safely <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* Animated Visual */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <Shield size={32} />, label: "PROTECT", top: '10%', left: '20%', delay: 0, color: '#00E5FF' },
                    { icon: <Lock size={32} />, label: "ENCRYPT", top: '50%', left: '60%', delay: 1, color: '#0ea5e9' },
                    { icon: <EyeOff size={32} />, label: "PRIVATE", top: '20%', left: '70%', delay: 0.5, color: '#38bdf8' },
                    { icon: <Server size={32} />, label: "SECURE", top: '70%', left: '30%', delay: 1.5, color: '#7dd3fc' }
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
                    <motion.path d="M200 150 Q 300 250 450 150" stroke="#00E5FF" strokeWidth="1" fill="none" strokeDasharray="5,5" />
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
              Our Privacy <span style={{ color: '#00E5FF' }}>Commitment</span>
            </motion.h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              We've engineered our platform from the ground up to protect your sensitive data at every step of the verification process.
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
