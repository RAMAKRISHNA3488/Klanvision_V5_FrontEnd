import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Globe, Smartphone, Shield, Cloud, Settings, 
  Cpu, Database, BarChart2, RefreshCw, Layers,
  CheckCircle2, Plus, Minus, ArrowRight, Play, Award, Zap, Users
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function ServicesPage() {
  useSEO({
    title: 'Professional IT Services & Solutions | Klanvision',
    description: 'Explore Klanvision’s premium IT services including enterprise web apps, mobile app development, cloud migration, cybersecurity, data analytics, and custom API integration.',
    keywords: 'IT Services, Web Development, Mobile Apps, Cloud Migration, Cybersecurity, API Integration, Klanvision Solutions',
    canonical: '/services',
  });

  const [faqOpen, setFaqOpen] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 8 Detailed Corporate Categories matching the homepage
  const categories = [
    {
      icon: Globe,
      title: 'Web Development',
      tag: 'Scale & Performance',
      desc: 'Bespoke, high-performance web systems and portals engineered using React, Next.js, and Node.js. Built for high availability, security, and responsive UX across all modern browsers.',
      color: '#0EA5E9',
      glow: 'rgba(14, 165, 233, 0.15)',
      features: ['Progressive Web Apps (PWAs)', 'Single Page Architecture', 'CMS & Custom Admin Portals'],
      link: '/web-development'
    },
    {
      icon: Smartphone,
      title: 'Mobile App Design & Deployment',
      tag: 'iOS & Android Native',
      desc: 'Seamless cross-platform and native mobile software using Flutter and React Native. Delivers optimized, offline-first mobile tools and interactive, fluid interfaces.',
      color: '#8B5CF6',
      glow: 'rgba(139, 92, 246, 0.15)',
      features: ['Cross-Platform Deployments', 'Biometric Authentication', 'Push Notification Engines'],
      link: '/mobile-app'
    },
    {
      icon: Cloud,
      title: 'Cloud Services',
      tag: 'Infrastructure Modernization',
      desc: 'Automated CI/CD pipelines, container orchestration with Kubernetes, and robust serverless architectures on AWS and Azure to scale dynamically with minimal downtime.',
      color: '#06B6D4',
      glow: 'rgba(6, 182, 212, 0.15)',
      features: ['Infrastructure as Code (IaC)', 'Zero-Downtime Deployments', 'Cost Optimization Audits'],
      link: '/cloud-services'
    },
    {
      icon: Shield,
      title: 'Securing Your Digital Infrastructure',
      tag: 'Security by Design',
      desc: 'Enterprise-grade protection, continuous threat monitoring, regular penetration testing, vulnerability assessments, and secure IAM system implementations.',
      color: '#EF4444',
      glow: 'rgba(239, 68, 68, 0.15)',
      features: ['Penetration Testing (VAPT)', 'GDPR & ISO Compliance Support', 'Identity & Access Management'],
      link: '/cybersecurity'
    },
    {
      icon: Settings,
      title: 'Managed Services',
      tag: '24/7 Operations Support',
      desc: 'Round-the-clock systems monitoring, service desk support, database backup architectures, and incident response teams ensuring continuous operational efficiency.',
      color: '#4F46E5',
      glow: 'rgba(79, 70, 229, 0.15)',
      features: ['Proactive Monitoring & Alerts', 'Regular Backups & Recovery', 'SLA-backed Support Systems'],
      link: '/managed-services'
    },
    {
      icon: Layers,
      title: 'API Integration',
      tag: 'System Interoperability',
      desc: 'Seamless data flow integrations across CRMs, ERPs, payment processors, and proprietary enterprise software systems with secure, high-concurrency endpoints.',
      color: '#EC4899',
      glow: 'rgba(236, 72, 153, 0.15)',
      features: ['RESTful & GraphQL API Design', 'Third-party CRM/ERP Syncs', 'Custom SDK Development'],
      link: '/api-integration'
    },
    {
      icon: RefreshCw,
      title: 'Website Upgrade & Migration',
      tag: 'Refactoring & Architecture Upgrade',
      desc: 'Migrating legacy monolith systems to decoupled microservices with minimal downtime, performance profiling, optimization, and code refactoring.',
      color: '#6366F1',
      glow: 'rgba(99, 102, 241, 0.15)',
      features: ['Monolith-to-Microservices', 'Database Migrations', 'Performance Optimization Audits'],
      link: '/upgrade-migration'
    },
    {
      icon: BarChart2,
      title: 'IT Consultation & Advisory',
      tag: 'Digital Transformation',
      desc: 'Strategic assessments, roadmap planning, and technology audit services to streamline business processes and implement high-yield modern tech stacks.',
      color: '#F97316',
      glow: 'rgba(249, 115, 22, 0.15)',
      features: ['Technology Audits', 'Cloud Readiness Assessments', 'Digital Transformation Roadmaps'],
      link: '/it-consultation'
    }
  ];

  // Process Timeline Steps
  const processSteps = [
    { number: '01', title: 'Discovery & Consultation', subtitle: 'Analyzing requirements, identifying objectives, and sketching project scope.' },
    { number: '02', title: 'Architecture & Design', subtitle: 'Creating visual UX maps and engineering robust, scalable database architectures.' },
    { number: '03', title: 'Iterative Development', subtitle: 'Writing clean code in modern frameworks with continuous QA integration.' },
    { number: '04', title: 'Rigorous Testing', subtitle: 'Automated test suite execution, load testing, and thorough security audits.' },
    { number: '05', title: 'Deployment & SLA', subtitle: 'Launching live products and establishing proactive, round-the-clock maintenance.' }
  ];

  // Tech Tags
  const technologies = [
    'React & Next.js', 'Node.js', 'TypeScript', 'Flutter', 'Python', 'AWS Cloud', 'Docker', 'Kubernetes',
    'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'CI/CD Pipelines', 'TailwindCSS', 'Framer Motion', 'Java Spring'
  ];

  // FAQ list
  const servicesFaq = [
    { q: 'How long does an enterprise application take to deploy?', a: 'Typically, enterprise projects take anywhere between 2 to 6 months depending on structural complexity. We establish clear milestone delivery timelines during discovery.' },
    { q: 'How does Klanvision maintain system security?', a: 'All systems are designed with Security-by-Design principles. We implement advanced IAM authentication, data encryption at rest and in transit, and conduct regular penetration audits.' },
    { q: 'Do you offer custom maintenance after product delivery?', a: 'Yes, we provide customizable support plans backed by SLAs to ensure your systems receive proactive security patches, feature upgrades, and uptime tracking.' }
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      
      {/* ── Services Hero ───────────────────────────────────────── */}
      <section style={{ 
        background: 'var(--hero-bg)', 
        padding: '160px 0 100px', 
        position: 'relative', 
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-main)'
      }}>
        {/* Animated Orbs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.08), transparent)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: 850, margin: '0 auto' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: '6px 16px', borderRadius: 50, marginBottom: 24, fontSize: 13, fontWeight: 700, color: 'var(--primary-purple)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <Zap size={14} /> ENTERPRISE-GRADE CAPABILITIES
            </div>
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 64px)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em',
              marginBottom: 20, 
              color: 'var(--text-main)' 
            }}>
              Innovative Technology <span className="gradient-text">Services</span> Designed to Scale
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: 'clamp(15px, 2.5vw, 19px)', 
              maxWidth: 700, 
              margin: '0 auto 36px', 
              lineHeight: 1.6 
            }}>
              From strategic consultation to custom web app engineering, mobile deployments, and high-concurrency cloud environments, we deliver premium technical execution.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#categories" className="btn-primary" style={{ textDecoration: 'none' }}>
                Explore Offerings <ArrowRight size={16} />
              </a>
              <a href="#contact-us" className="btn-outline" style={{ textDecoration: 'none', background: 'var(--bg-surface)', border: '2px solid var(--border-main)', color: 'var(--text-main)' }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-blue)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'var(--primary-blue)'; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-main)'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
              >
                Schedule Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Success Counters Section ──────────────────────────────── */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
            {[
              { value: '250+', label: 'Successful Deployments', desc: 'Enterprise & startup products' },
              { value: '99.99%', label: 'Infrastructure Uptime', desc: 'Secure cloud environments' },
              { value: '98%', label: 'Client Satisfaction SLA', desc: 'Long-term support agreements' },
              { value: '15+', label: 'Tech Stack Expertise', desc: 'Modern tool certifications' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 16 }}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--primary-purple)', marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 Services Categories Section ───────────────────────── */}
      <section id="categories" style={{ padding: '100px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Comprehensive Service <span className="gradient-text">Portfolio</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Explore our core domains of expertise. Each category is backed by certified senior engineering teams and standard agile practices.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {categories.map((c, i) => {
              const IconComp = c.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => window.location.href = c.link}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-main)',
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: hoveredIndex === i ? '0 20px 40px rgba(0, 0, 0, 0.08)' : 'var(--card-shadow)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: hoveredIndex === i ? 'translateY(-6px)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: c.color }} />
                  <div>
                    {/* Icon and Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: `${c.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.color,
                        boxShadow: `0 8px 16px ${c.glow}`
                      }}>
                        <IconComp size={24} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', tracking: '1px', color: c.color, background: `${c.color}10`, padding: '4px 10px', borderRadius: 30 }}>
                        {c.tag}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                      {c.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ borderTop: '1px solid var(--border-main)', paddingTop: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                        {c.features.map((feat, fidx) => (
                          <div key={fidx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>
                            <CheckCircle2 size={14} style={{ color: c.color, flexShrink: 0 }} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                        <span style={{ color: c.color, fontWeight: 700, fontSize: 13, fontFamily: "'Poppins',sans-serif" }}>Learn More</span>
                        <motion.div
                          animate={{ x: hoveredIndex === i ? 6 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight size={14} style={{ color: c.color }} />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us Section ──────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-main)', borderBottom: '1px solid var(--border-main)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <div className="accent-bar" style={{ margin: '0 0 16px' }} />
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>
                Why Global Enterprises <span className="gradient-text">Trust</span> Klanvision
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                We believe in combining clean architectural code, automated DevOps scaling, and user-centric design principles to achieve real-world business growth.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: Award, t: 'Certified Architects', d: 'Our specialists are certified by AWS, Google, and Microsoft.' },
                  { icon: Zap, t: 'Agile Delivery Framework', d: 'Iterative, fast sprints with transparent visual updates.' },
                  { icon: Users, t: 'Dedicated Dev Squads', d: 'Fully aligned developers operating as your extended core team.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0, color: 'var(--primary-purple)' }}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>{item.t}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent)', pointerEvents: 'none', filter: 'blur(30px)' }} />
              <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-main)', padding: '32px', borderRadius: 24, boxShadow: 'var(--card-shadow)', width: '100%', maxWidth: 450 }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20, textAlign: 'center' }}>
                  Enterprise Tech Core
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                  {technologies.map((tech, tidx) => (
                    <span key={tidx} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: '8px 14px', borderRadius: 50, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Development Process Section ───────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Our Execution <span className="gradient-text">Process</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              A highly optimized roadmap designed to eliminate project delays, minimize design friction, and guarantee product quality.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800, margin: '0 auto' }}>
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                style={{
                  display: 'flex',
                  gap: 24,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-main)',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: 'var(--card-shadow)',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary-purple)', width: 60, height: 60, borderRadius: '50%', background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.number}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{step.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services FAQ Accordion ───────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-main)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Services <span className="gradient-text">FAQ</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>
              Quick answers regarding project scopes, security, and SLAs.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {servicesFaq.map((faq, idx) => (
              <div 
                key={idx}
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                style={{
                  background: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-main)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{faq.q}</span>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {faqOpen === idx ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: faqOpen === idx ? 'auto' : 0, opacity: faqOpen === idx ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border-main)', paddingTop: 16 }}>
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Premium CTA Callout ──────────────────────────────────── */}
      <section id="contact-us" style={{ padding: '100px 0', background: 'var(--bg-main)', borderTop: '1px solid var(--border-main)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              borderRadius: 30,
              padding: '60px 40px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 20px 50px rgba(124,58,237,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, marginBottom: 16, color: 'white' }}>
              Ready to Accelerate Your Digital Transformation?
            </h2>
            <p style={{ fontSize: 16, maxWidth: 650, margin: '0 auto 36px', opacity: 0.9, lineHeight: 1.6 }}>
              Connect with our solutions architects to map out custom specifications, budgets, and secure delivery timelines.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              style={{
                background: 'white',
                color: '#4F46E5',
                fontWeight: 700,
                fontSize: 16,
                fontFamily: "'Poppins', sans-serif",
                padding: '16px 40px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            >
              Get Free Consultation <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
