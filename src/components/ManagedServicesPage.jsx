import { motion } from 'framer-motion';
import { ChevronLeft, Shield, Cpu, Activity, Clock, Server, Zap, ArrowRight, CheckCircle2, HardDrive, Network } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function ManagedServicesPage() {
  useSEO({
    title: 'Managed IT Services | 24/7 IT Operations – Klanvision',
    description: 'Klanvision provides 24/7 Managed IT Services including proactive monitoring, infrastructure maintenance, performance optimization and 99.9% uptime SLA for enterprises.',
    keywords: 'managed IT services, IT operations, 24/7 monitoring, infrastructure management, Klanvision',
    canonical: '/managed-services',
  });
  const managedFeatures = [
    {
      title: "24/7 Proactive Monitoring",
      desc: "Our Network Operations Center (NOC) monitors your systems around the clock, identifying and resolving potential issues before they impact your business.",
      icon: <Activity className="w-8 h-8" />,
      color: "#4F46E5",
      features: ["Predictive Failure Analysis", "Real-time Alerting", "Network Health Tracking"]
    },
    {
      title: "Infrastructure Maintenance",
      desc: "Comprehensive patching, updates, and hardware maintenance to ensure your digital backbone remains secure, compliant, and performing at peak capacity.",
      icon: <Server className="w-8 h-8" />,
      color: "#7C3AED",
      features: ["Automated Patch Management", "Security Hardening", "Hardware Lifecycle Support"]
    },
    {
      title: "Performance Optimization",
      desc: "Continuous fine-tuning of your cloud and on-premise resources to ensure maximum speed and efficiency traffic and data grows.",
      icon: <Cpu className="w-8 h-8" />,
      color: "#10B981",
      features: ["Resource Auto-scaling", "Database Tuning", "Latency Optimization"]
    },
    {
      title: "Business Continuity",
      desc: "Advanced backup solutions and disaster recovery planning to ensure your data is safe and your operations never stop, no matter what happens.",
      icon: <Shield className="w-8 h-8" />,
      color: "#3B82F6",
      features: ["Off-site Cloud Backups", "DR Orchestration", "99.99% Uptime Guarantee"]
    }
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive Hero Section ── */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', 
        color: 'white', 
        padding: '120px 0 100px', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.15), transparent)', pointerEvents: 'none' }} 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', bottom: -150, left: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent)', pointerEvents: 'none' }} 
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a href="/" style={{ color: '#818CF8', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 32, letterSpacing: '1px' }}>
              <ChevronLeft size={18} /> BACK TO SOLUTIONS
            </a>
            
            <div style={{ maxWidth: 800 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', padding: '8px 16px', borderRadius: '100px', color: '#818CF8', fontSize: 13, fontWeight: 700, marginBottom: 24 }}
              >
                <Clock size={14} fill="currentColor" /> 24/7 ENTERPRISE MANAGEMENT
              </motion.div>
              
              <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                Managed IT <br />
                <span style={{ color: '#818CF8' }}>Operations & Services</span>
              </h1>
              
              <p style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.6, marginBottom: 40, maxWidth: 650 }}>
                We provide end-to-end IT management to ensure your business operations run smoothly and efficiently. We allow you to focus on core business growth while ensuring reliability and uptime.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '18px 36px', background: '#4F46E5', color: 'white', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(79,70,229,0.3)' }}>
                  Get Managed Support <ArrowRight size={18} />
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#CBD5E1' }}>
                  <Zap size={18} style={{ color: '#F97316' }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>99.9% Uptime SLA Guaranteed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Managed Services ── */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 20 }}>Reliable IT <span style={{ color: '#4F46E5' }}>Operations Management</span></h2>
            <p style={{ color: '#64748B', fontSize: 18, maxWidth: 700, margin: '0 auto' }}>
              Ensure smooth and reliable IT operations with proactive monitoring and maintenance. We manage your infrastructure so you can focus on business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {managedFeatures.map((feature, idx) => (
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
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  border: '1px solid #F1F5F9',
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

      {/* ── Advanced Tech Stack & Uptime ── */}
      <section style={{ padding: '100px 0', background: '#0F172A', color: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div style={{ 
                background: 'linear-gradient(135deg, #1E2937 0%, #0F172A 100%)',
                borderRadius: 32,
                padding: 40,
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                  <h3 style={{ fontWeight: 800, fontSize: 24 }}>System Health</h3>
                  <div style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.2)', color: '#10B981', borderRadius: '100px', fontSize: 12, fontWeight: 800 }}>LIVE STATUS</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: <Network size={20} />, label: "Global Connectivity", status: "Optimal", val: 98 },
                    { icon: <HardDrive size={20} />, label: "Storage Integrity", status: "Secure", val: 100 },
                    { icon: <Shield size={20} />, label: "Firewall Active", status: "Protected", val: 95 }
                  ].map((stat, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ color: '#818CF8' }}>{stat.icon}</span>
                          <span style={{ fontWeight: 600 }}>{stat.label}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#10B981', fontWeight: 800 }}>{stat.status}</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          style={{ height: '100%', background: '#4F46E5', borderRadius: 3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: 40, padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>TOTAL UPTIME THIS YEAR</span>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>99.998%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>Enterprise-Grade <br /><span style={{ color: '#818CF8' }}>Infrastructure Management</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
                Our managed services include proactive monitoring, system maintenance, performance optimization, and issue resolution. We handle the complexity so you can handle the growth.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#818CF8', marginBottom: 8 }}>15min</div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>Average Emergency Response Time</div>
                </div>
                <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#818CF8', marginBottom: 8 }}>Zero</div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>Unplanned Downtime Events (Q1)</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Offload Your IT? ── */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              background: 'white', 
              borderRadius: 40, 
              padding: '80px 40px', 
              boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
              border: '1px solid #F1F5F9',
              maxWidth: 900,
              margin: '0 auto'
            }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Ready to Scale with <br /><span style={{ color: '#4F46E5' }}>Expert Management?</span></h2>
            <p style={{ color: '#64748B', fontSize: 18, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
              Let Klanvision take the wheel of your IT infrastructure. Get a custom managed service proposal tailored to your enterprise.
            </p>
            <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', fontSize: 18, borderRadius: 16, display: 'inline-block', background: '#4F46E5' }}>
              Get Your Custom Quote
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
