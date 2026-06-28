import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ShieldCheck, CheckCircle2, Lock, FileKey, ArrowRight, Activity, Shield, Fingerprint, Bot, Link } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function AuthenticVerificationPage() {
  useSEO({
    title: '100% Authentic Verification | Klanvision',
    description: 'Ensure absolute authenticity of your certificates with Klanvision. Our encrypted database offers tamper-proof validation.',
    canonical: '/verify-authentic',
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
      title: "Cryptographic Hashing",
      desc: "Every certificate issued undergoes an advanced cryptographic hashing process, ensuring its contents cannot be altered without immediate detection.",
      icon: <FileKey className="w-8 h-8" />,
      color: "#ec4899"
    },
    {
      title: "Digital Signatures",
      desc: "We embed immutable digital signatures within the metadata of your credentials to mathematically prove their origin and authenticity.",
      icon: <ShieldCheck className="w-8 h-8" />,
      color: "#8b5cf6"
    },
    {
      title: "Tamper-Proof Validation",
      desc: "Instantly cross-check any document against our secure ledger. If a single pixel is tampered with, the validation will fail immediately.",
      icon: <Lock className="w-8 h-8" />,
      color: "#3b82f6"
    },
    {
      title: "Biometric Integration",
      desc: "Optional multi-factor and biometric authentication checkpoints ensure the issuer's identity is fully verified.",
      icon: <Fingerprint className="w-8 h-8" />,
      color: "#10b981"
    },
    {
      title: "AI Fraud Detection",
      desc: "Our machine learning models constantly analyze verification requests to proactively detect and block sophisticated forgery attempts.",
      icon: <Bot className="w-8 h-8" />,
      color: "#f59e0b"
    },
    {
      title: "Blockchain Audit Trail",
      desc: "A permanent, decentralized ledger records every verification event, creating a transparent and publicly verifiable history.",
      icon: <Link className="w-8 h-8" />,
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
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#22C55E 1px, transparent 1px), linear-gradient(90deg, #22C55E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Glow */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent)', pointerEvents: 'none' }} 
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <a href="/verify" style={{ color: '#22C55E', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO VERIFICATION
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#22C55E', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '2px' }}
                  >
                    <CheckCircle2 size={14} fill="currentColor" color="#0F172A" /> 100% AUTHENTIC GUARANTEE
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Absolute <br />
                    <span style={{ color: '#22C55E', textShadow: '0 0 40px rgba(34,197,94,0.3)' }}>Authenticity</span>
                  </h1>
                  
                  <p style={{ fontSize: 20, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    Our certificates are verified against a highly secure, encrypted database. We use advanced cryptographic hashing to ensure the integrity of every document we issue.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/verify" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#22C55E', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(34,197,94,0.2)' }}>
                      Verify Now <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* Animated Visual */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <Shield size={32} />, label: "SECURE", top: '10%', left: '20%', delay: 0, color: '#22C55E' },
                    { icon: <CheckCircle2 size={32} />, label: "VERIFIED", top: '50%', left: '60%', delay: 1, color: '#10B981' },
                    { icon: <FileKey size={32} />, label: "ENCRYPTED", top: '20%', left: '70%', delay: 0.5, color: '#34D399' },
                    { icon: <Activity size={32} />, label: "ACTIVE", top: '70%', left: '30%', delay: 1.5, color: '#059669' }
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
                    <motion.path d="M200 150 Q 300 250 450 150" stroke="#22C55E" strokeWidth="1" fill="none" strokeDasharray="5,5" />
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
              How We Ensure <span style={{ color: '#22C55E' }}>Authenticity</span>
            </motion.h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              Our multi-layered validation protocol ensures that every certificate presented to an employer or institution is completely genuine and verifiable.
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
