import { motion } from 'framer-motion';
import { ChevronLeft, Smartphone, Cloud, Settings, Shield, Globe, Cpu, Headphones, CheckCircle2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function ServicePolicyPage() {
  useSEO({
    title: 'Service Policy | Klanvision Service Delivery Standards',
    description: "Klanvision's Service Policy outlines our service delivery approach, quality standards, SLA commitments, 5-phase methodology and professional governance framework.",
    keywords: 'service policy, SLA, service delivery, Klanvision standards, IT services terms',
    canonical: '/service-policy',
  });
  const offerings = [
    { icon: Globe, label: 'Web Development', desc: 'Crafting responsive, high-performance websites.' },
    { icon: Smartphone, label: 'Mobile App Development', desc: 'Building intuitive iOS and Android applications.' },
    { icon: Cloud, label: 'Cloud Services', desc: 'Scalable cloud infrastructure and hosting solutions.' },
    { icon: Cpu, label: 'API Integration', desc: 'Seamlessly connecting your systems and data.' },
    { icon: Settings, label: 'Managed IT Services', desc: 'Full-spectrum IT management and monitoring.' },
    { icon: Shield, label: 'Cybersecurity Solutions', desc: 'Protecting your digital assets and user data.' },
    { icon: RefreshCcw, label: 'Website Migration', desc: 'Safe and efficient platform upgrades.' },
    { icon: Headphones, label: 'IT Consultation', desc: 'Expert advisory for your technology strategy.' }
  ];

  const steps = [
    { num: 1, title: 'Requirement Analysis', desc: 'Perform detailed requirement gathering and business analysis to define functional and technical specifications.' },
    { num: 2, title: 'Solution Design & Planning', desc: 'Develop architecture, implementation strategy, timelines, and resource planning aligned with project objectives.' },
    { num: 3, title: 'Development & Implementation', desc: 'Execute development using industry standards, secure coding practices, and scalable architecture.' },
    { num: 4, title: 'Quality Assurance & Deployment', desc: 'Conduct comprehensive testing, validation, and controlled deployment to ensure performance, security, and stability.' },
    { num: 5, title: 'Support & Continuous Improvement', desc: 'Provide ongoing support, monitoring, optimization, and enhancements to ensure continuous value delivery.' }
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #120F17 0%, #1F2937 100%)', color: 'white', padding: '120px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <a href="/" style={{ color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 24, letterSpacing: '1px' }}>
              <ChevronLeft size={16} /> BACK TO HOME
            </a>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
              Service <span className="gradient-text">Policy</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              At Klanvision, we deliver high-quality IT and software solutions tailored to meet diverse business requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Offerings Grid */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 80 }}>
          {offerings.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)', display: 'flex', gap: 20, alignItems: 'center' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0 }}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{item.label}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Delivery Approach (Timeline style) */}
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', marginBottom: 16 }}>Service Delivery Approach</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>A standardized, process-driven framework aligned with industry best practices.</p>
          </div>

          <div style={{ position: 'relative', paddingLeft: 40 }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #4F46E5, #7C3AED, #EC4899)', opacity: 0.2 }} />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ position: 'relative', marginBottom: 48 }}
              >
                {/* Step Circle */}
                <div style={{ 
                  position: 'absolute', left: -32, top: 0, 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: 'var(--bg-surface)', border: '3px solid #7C3AED',
                  zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(124,58,237,0.3)'
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED' }} />
                </div>

                <div className="card" style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 1 }}>Phase 0{step.num}</span>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{step.title}</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, margin: 0, fontSize: 15 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final SLA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              marginTop: 64, padding: '40px', 
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 
              borderRadius: 24, color: 'white', textAlign: 'center',
              boxShadow: '0 20px 40px rgba(79,70,229,0.2)'
            }}
          >
            <CheckCircle2 size={40} style={{ marginBottom: 20, opacity: 0.8 }} />
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              All services are delivered in accordance with defined SLAs, mutually agreed scope, timelines, and milestone-based execution models, ensuring transparency, governance, and risk management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Help Footer */}
      <section className="container" style={{ textAlign: 'center', marginTop: 80 }}>
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>
          Klanvision • Delivering Excellence Through Innovation
        </p>
      </section>
    </div>
  );
}

// Add RefreshCcw for migration
function RefreshCcw(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
