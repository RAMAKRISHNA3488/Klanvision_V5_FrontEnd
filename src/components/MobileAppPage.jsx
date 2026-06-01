import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Smartphone, Layout, Cpu, Globe, ArrowRight, CheckCircle2, Apple, Play, Code2, Rocket, Activity } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function MobileAppPage() {
  useSEO({
    title: 'Mobile App Development | iOS & Android Apps – Klanvision',
    description: 'Klanvision develops native and cross-platform mobile apps for iOS and Android using Swift, Kotlin, and React Native. From UI/UX to App Store deployment and ASO.',
    keywords: 'mobile app development, iOS app, Android app, React Native, Flutter, cross-platform, Klanvision',
    canonical: '/mobile-app',
  });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const appFeatures = [
    {
      title: "Native & Cross-Platform",
      desc: "We build intuitive and high-performance mobile applications for both iOS and Android platforms using Swift, Kotlin, and React Native.",
      icon: <Smartphone className="w-8 h-8" />,
      color: "#8B5CF6",
      features: ["iOS (Swift/SwiftUI)", "Android (Kotlin/Compose)", "React Native / Flutter"]
    },
    {
      title: "Interactive UI/UX Design",
      desc: "From UI/UX design to deployment, we ensure your app delivers a seamless user experience while meeting your business objectives.",
      icon: <Layout className="w-8 h-8" />,
      color: "#EC4899",
      features: ["Micro-interactions", "Gesture-based Navigation", "Dark Mode Optimization"]
    },
    {
      title: "Secure Backend Integration",
      desc: "Real-time data synchronization and secure API connections ensure your app remains fast, reliable, and data-sovereign.",
      icon: <Cpu className="w-8 h-8" />,
      color: "#3B82F6",
      features: ["Real-time Sync", "Offline-First Support", "Biometric Auth"]
    },
    {
      title: "Scalable Cloud Sync",
      desc: "Leveraging cloud infrastructure to ensure your app scales to millions of users with zero latency and high availability.",
      icon: <Globe className="w-8 h-8" />,
      color: "#10B981",
      features: ["Push Notifications", "Serverless Architecture", "Global Data Nodes"]
    }
  ];

  return (
    <div ref={containerRef} style={{ background: '#0F172A', minHeight: '100vh', color: 'white', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive 3D Mobile Hero Section ── */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at top right, #1E293B 0%, #0F172A 100%)', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated 3D Floating Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ position: 'absolute', top: '10%', right: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)', pointerEvents: 'none' }} 
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <a href="/" style={{ color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO SOLUTIONS
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#8B5CF6', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '2px' }}
                  >
                    <Smartphone size={14} fill="currentColor" /> NATIVE & CROSS-PLATFORM APPS
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Next-Gen <br />
                    <span style={{ color: '#8B5CF6', textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>Mobile</span> Solutions.
                  </h1>
                  
                  <p style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    We build intuitive and high-performance mobile applications for both iOS and Android platforms. From UI/UX design to development and deployment.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#8B5CF6', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(139,92,246,0.3)' }}>
                      Launch Your App <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* 3D Visual - Mobile App Nodes */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <Apple size={32} />, label: "IOS", top: '10%', left: '20%', delay: 0, color: '#FFFFFF' },
                    { icon: <Play size={32} />, label: "ANDROID", top: '50%', left: '60%', delay: 1, color: '#3DDC84' },
                    { icon: <Code2 size={32} />, label: "HYBRID", top: '20%', left: '70%', delay: 0.5, color: '#61DAFB' },
                    { icon: <Activity size={32} />, label: "PERF", top: '70%', left: '30%', delay: 1.5, color: '#EC4899' }
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

      {/* ── App Pillars ── */}
      <section style={{ padding: '140px 0', background: 'white', color: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24 }}
            >
              Crafting <span style={{ color: '#8B5CF6' }}>Mobile Excellence</span>
            </motion.h2>
            <p style={{ color: '#64748B', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              Create user-friendly mobile apps for iOS and Android. We ensure seamless performance and engaging user experiences through advanced mobile engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {appFeatures.map((feature, idx) => (
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

      {/* ── High-Performance Deployment Dashboard ── */}
      <section style={{ padding: '140px 0', background: '#0F172A' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>High-Performance <br /><span style={{ color: '#8B5CF6' }}>App Deployment</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 20, lineHeight: 1.7, marginBottom: 40 }}>
                We don't just build apps; we manage the entire lifecycle from beta testing to Store optimization (ASO) and continuous deployment.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { title: "App Store Optimization (ASO)", content: "We ensure your app is discoverable and ranks high for your target keywords on both Stores." },
                  { title: "Continuous Delivery (CI/CD)", content: "Automated pipelines ensure that every update is tested and deployed with zero downtime." },
                  { title: "Global Performance Monitoring", content: "Real-time tracking of app health, crash reports, and user engagement metrics across the globe." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 20 }}>{i+1}</div>
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
              {/* Futuristic App Dashboard */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '48px',
                padding: '60px',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.1)',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                   <motion.div 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     style={{ fontSize: 12, fontWeight: 900, color: '#8B5CF6', letterSpacing: 3, marginBottom: 16 }}
                   >
                     STORE DEPLOYMENT STATUS: ACTIVE
                   </motion.div>
                   <div style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(139,92,246,0.4)' }}>99.9%</div>
                   <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700, marginTop: 8 }}>APP CRASH-FREE RATE</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                   {[
                     { label: "App Store Approval", val: 100, color: '#8B5CF6' },
                     { label: "Play Store Visibility", val: 95, color: '#3DDC84' },
                     { label: "User Retention Rate", val: 88, color: '#EC4899' }
                   ].map((stat, i) => (
                     <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, fontWeight: 900 }}>
                           <span style={{ color: '#CBD5E1' }}>{stat.label.toUpperCase()}</span>
                           <span style={{ color: stat.color }}>{stat.val}%</span>
                        </div>
                        <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 5, overflow: 'hidden' }}>
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${stat.val}%` }}
                             viewport={{ once: true }}
                             transition={{ duration: 2, delay: i * 0.3 }}
                             style={{ height: '100%', background: `linear-gradient(90deg, ${stat.color}80, ${stat.color})`, borderRadius: 5, boxShadow: `0 0 15px ${stat.color}40` }}
                           />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Launch? (Refined Sleek CTA) ── */}
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
              border: '1px solid rgba(139,92,246,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ display: 'inline-block', color: '#8B5CF6', marginBottom: 16 }}
              >
                <Rocket size={32} fill="currentColor" />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: 'white' }}>
                Ready to Take Your App <span style={{ color: '#8B5CF6' }}>to the Stores?</span>
              </h2>
              
              <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.5 }}>
                Launch your mobile vision on iOS and Android. Partner with our mobile engineering team to build and deploy your application today.
              </p>

              <motion.a 
                href="/#contact-form" 
                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(139,92,246,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  textDecoration: 'none', 
                  padding: '18px 48px', 
                  fontSize: '18px', 
                  borderRadius: '14px', 
                  background: '#8B5CF6', 
                  color: 'white', 
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 10px 20px rgba(139,92,246,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Start App Discovery <ArrowRight size={20} />
              </motion.a>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> iOS & Android Support
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> ASO Included
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
