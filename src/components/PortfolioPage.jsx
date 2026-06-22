import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Globe, Smartphone, Shield, Cloud, 
  Database, BarChart2, Layers, Cpu, Award, ExternalLink, Flame
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Custom mini graphics to represent project types visually
const ProjectGfxWeb = () => (
  <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" fill="#4F46E5" fillOpacity="0.1" />
    <rect x="10" y="14" width="32" height="22" rx="4" stroke="#4F46E5" strokeWidth="2.5" />
    <line x1="10" y1="30" x2="42" y2="30" stroke="#4F46E5" strokeWidth="1.5" />
    <circle cx="16" cy="33" r="1.5" fill="#4F46E5" />
    <circle cx="21" cy="33" r="1.5" fill="#4F46E5" />
    <circle cx="26" cy="22" r="4" fill="#8B5CF6" />
    <line x1="20" y1="42" x2="32" y2="42" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="36" x2="26" y2="42" stroke="#4F46E5" strokeWidth="2" />
  </svg>
);

const ProjectGfxMobile = () => (
  <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" fill="#8B5CF6" fillOpacity="0.1" />
    <rect x="16" y="8" width="20" height="36" rx="5" stroke="#8B5CF6" strokeWidth="2.5" />
    <line x1="16" y1="38" x2="36" y2="38" stroke="#8B5CF6" strokeWidth="1.5" />
    <circle cx="26" cy="41" r="2" fill="#8B5CF6" />
    <path d="M21 16 H31 M21 21 H27" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ProjectGfxCloud = () => (
  <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" fill="#06B6D4" fillOpacity="0.1" />
    <path d="M14 32 Q9 32 9 26 Q9 20 16 20 Q16 11 25 11 Q32 7 39 14 Q44 12 44 21 Q44 32 35 32 Z" stroke="#06B6D4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 21 L26 36 M21 31 L26 36 L31 31" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ProjectGfxAI = () => (
  <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" fill="#F59E0B" fillOpacity="0.1" />
    <rect x="14" y="14" width="24" height="24" rx="4" stroke="#F59E0B" strokeWidth="2.5" />
    <circle cx="21" cy="22" r="2" fill="#F59E0B" />
    <circle cx="31" cy="22" r="2" fill="#F59E0B" />
    <path d="M20 30 Q26 34 32 30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="26" x2="9" y2="26" stroke="#F59E0B" strokeWidth="2" />
    <line x1="38" y1="26" x2="43" y2="26" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="26" cy="8" r="3" fill="#F59E0B" />
    <line x1="26" y1="11" x2="26" y2="14" stroke="#F59E0B" strokeWidth="2" />
  </svg>
);

const ProjectGfxEnterprise = () => (
  <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" fill="#EC4899" fillOpacity="0.1" />
    <polygon points="26,8 44,18 44,38 26,48 8,38 8,18" stroke="#EC4899" strokeWidth="2.5" fill="none" />
    <line x1="26" y1="8" x2="26" y2="48" stroke="#EC4899" strokeWidth="1.5" />
    <line x1="8" y1="18" x2="44" y2="38" stroke="#EC4899" strokeWidth="1.5" />
    <line x1="44" y1="18" x2="8" y2="38" stroke="#EC4899" strokeWidth="1.5" />
    <circle cx="26" cy="26" r="6" fill="#EC4899" />
  </svg>
);

export default function PortfolioPage() {
  useSEO({
    title: 'Enterprise Portfolio & Client Success | Klanvision',
    description: 'Browse through Klanvision’s client success stories, enterprise web developments, AI integrations, custom mobile systems, and scalable cloud migrations.',
    keywords: 'Case Studies, IT Portfolio, Web Apps, Custom Mobile Systems, AI Integrations, Cloud Migration Projects',
    canonical: '/portfolio',
  });

  const [activeTab, setActiveTab] = useState('All');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const tabs = ['All', 'Web', 'Mobile', 'Cloud', 'AI', 'Enterprise'];

  const projects = [
    {
      title: 'Global Agri-Tech Dashboard',
      category: 'Enterprise',
      color: '#EC4899',
      gfx: ProjectGfxEnterprise,
      desc: 'An automated supply chain dashboard aggregating multi-country agricultural statistics in real time.',
      tags: ['React', 'PostgreSQL', 'AWS Lambda'],
      metric: '99.9% Pipeline Uptime'
    },
    {
      title: 'Fintech Mobile Bank System',
      category: 'Mobile',
      color: '#8B5CF6',
      gfx: ProjectGfxMobile,
      desc: 'Advanced biometric e-wallet allowing users to register, secure, and verify peer-to-peer microtransactions.',
      tags: ['React Native', 'Node.js', 'Redis'],
      metric: '1.2M transactions/day'
    },
    {
      title: 'Predictive Medical Diagnostic Engine',
      category: 'AI',
      color: '#F59E0B',
      gfx: ProjectGfxAI,
      desc: 'Machine learning cognitive engine reading medical reports and flagging risk criteria for clinic review.',
      tags: ['Python', 'TensorFlow', 'FastAPI'],
      metric: '94% Diagnostic Accuracy'
    },
    {
      title: 'Decoupled Travel Booker Platform',
      category: 'Web',
      color: '#4F46E5',
      gfx: ProjectGfxWeb,
      desc: 'Decoupled corporate travel system serving customizable packages with multi-merchant API syncs.',
      tags: ['Next.js', 'GraphQL', 'PostgreSQL'],
      metric: '40% Faster Load Time'
    },
    {
      title: 'Cloud Orchestrated HR Suite',
      category: 'Cloud',
      color: '#06B6D4',
      gfx: ProjectGfxCloud,
      desc: 'Migrating global corporate onboarding from local server models to serverless Kubernetes setups.',
      tags: ['AWS EKS', 'Docker', 'Terraform'],
      metric: '60% Hosting Fee Reduction'
    },
    {
      title: 'Enterprise Manufacturing Analytics',
      category: 'Enterprise',
      color: '#EC4899',
      gfx: ProjectGfxEnterprise,
      desc: 'High-throughput sensory reporting pipeline tracking automated hardware assembly metrics.',
      tags: ['TimescaleDB', 'Go', 'Docker'],
      metric: 'Real-time 10ms Latency'
    },
    {
      title: 'Real Estate Virtual Tour Platform',
      category: 'Web',
      color: '#4F46E5',
      gfx: ProjectGfxWeb,
      desc: 'Responsive web platform enabling interactive 360-degree virtual real-estate walkthroughs.',
      tags: ['Vue.js', 'Three.js', 'Firebase'],
      metric: '3x Higher User Retention'
    },
    {
      title: 'Logistics Fleet Dispatch Tool',
      category: 'Mobile',
      color: '#8B5CF6',
      gfx: ProjectGfxMobile,
      desc: 'GPS-tracked driver application automating optimized package distribution routes.',
      tags: ['Flutter', 'Google Maps API', 'AWS'],
      metric: '18% Fuel Savings'
    },
    {
      title: 'Automated Support Agent',
      category: 'AI',
      color: '#F59E0B',
      gfx: ProjectGfxAI,
      desc: 'Integrating NLP conversational agents handling primary ticketing requests automatically.',
      tags: ['OpenAI API', 'LangChain', 'Node.js'],
      metric: '82% Tickets Auto-Resolved'
    },
    {
      title: 'Retail Store Cloud Synchronization',
      category: 'Cloud',
      color: '#06B6D4',
      gfx: ProjectGfxCloud,
      desc: 'Global inventory state synchronizations aggregating data streams from 350+ physical stores.',
      tags: ['AWS DynamoDB', 'Kafka', 'Terraform'],
      metric: 'Instant Sync < 200ms'
    },
    {
      title: 'Edu-Tech Interactive Academy',
      category: 'Web',
      color: '#4F46E5',
      gfx: ProjectGfxWeb,
      desc: 'LMS hosting customized interactive classrooms, live streaming capabilities, and progress metrics.',
      tags: ['React', 'GraphQL', 'WebRTC'],
      metric: '150k+ Active Students'
    },
    {
      title: 'Multinational Retail ERP Upgrade',
      category: 'Enterprise',
      color: '#EC4899',
      gfx: ProjectGfxEnterprise,
      desc: 'Refactoring a monolithic inventory tracker into dynamic scalable microservices.',
      tags: ['Java Spring', 'Kubernetes', 'Oracle'],
      metric: 'Zero-Downtime Migration'
    }
  ];

  const caseStudies = [
    {
      company: 'Apex Logistics Inc.',
      tag: 'Fleet Management System Upgrade',
      challenge: 'Legacy logistics dispatcher suffered from 15-minute GPS sync lag, manual driver assign processes, and high server failures on peak load.',
      solution: 'Developed a decoupled microservices tracker with native Android/iOS companion apps using Flutter, streaming telemetry to Kafka & DynamoDB.',
      result: 'Real-time telemetry update decreased sync lag to 2 seconds, automating dispatch routing and saving over $180,000 in monthly fuel budgets.',
      color: '#8B5CF6'
    },
    {
      company: 'Zenith Life Insurance',
      tag: 'Predictive Claims Engine Integration',
      challenge: 'Manual processing of medical reimbursement claims created processing backlogs of up to 14 days and cost leaks from human evaluation errors.',
      solution: 'Engineered an intelligent ML claims analyzer powered by NLP pipelines, parsing documentation details and scoring claim accuracy.',
      result: 'Processing timelines cut down to 6 hours, while automated checks saved Apex 8% in false claims leakage during the first 90 days.',
      color: '#F59E0B'
    },
    {
      company: 'Veloce Global E-Store',
      tag: 'Next-Gen Infrastructure Migration',
      challenge: 'A massive monolithic retail store crashed repeatedly during black-friday events, causing immediate transaction losses.',
      solution: 'Re-architected the store using containerized Kubernetes node groups on AWS, introducing dynamic autoscaling policies.',
      result: 'Faced peak holiday load with 100% server uptime, while structural optimizations dropped operational costs by 45%.',
      color: '#06B6D4'
    }
  ];

  const filteredProjects = activeTab === 'All' ? projects : projects.filter(p => p.category === activeTab);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      
      {/* ── Portfolio Hero ──────────────────────────────────────── */}
      <section style={{ 
        background: 'var(--hero-bg)', 
        padding: '160px 0 100px', 
        position: 'relative', 
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-main)'
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: '6px 16px', borderRadius: 50, marginBottom: 24, fontSize: 13, fontWeight: 700, color: 'var(--primary-purple)' }}>
              <Award size={14} /> EXCELLENCE IN EXECUTION
            </div>
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 64px)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em',
              marginBottom: 20, 
              color: 'var(--text-main)' 
            }}>
              Our Engineering <span className="gradient-text">Masterpieces</span> &amp; Case Studies
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: 'clamp(15px, 2.5vw, 19px)', 
              maxWidth: 650, 
              margin: '0 auto', 
              lineHeight: 1.6 
            }}>
              Discover how our teams assist companies in modernizing legacy structures, accelerating software features, and scaling secure infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Portfolio Grid & Filter Section ────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          
          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 56 }}>
            {tabs.map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  background: activeTab === tab ? 'linear-gradient(90deg, #4F46E5, #7C3AED)' : 'var(--bg-surface)',
                  color: activeTab === tab ? 'white' : 'var(--text-muted)',
                  border: activeTab === tab ? 'none' : '1.5px solid var(--border-main)',
                  boxShadow: activeTab === tab ? '0 6px 18px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {tab === 'All' ? 'All Projects' : `${tab}`}
              </motion.button>
            ))}
          </div>

          {/* Cards Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => {
                const Graphic = p.gfx;
                return (
                  <motion.div
                    key={p.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: 24,
                      border: '1px solid var(--border-main)',
                      boxShadow: 'var(--card-shadow)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transform: hoveredIdx === i ? 'translateY(-6px)' : 'none',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                  >
                    {/* Graphic Box */}
                    <div style={{
                      height: 180,
                      background: `linear-gradient(135deg, ${p.color}08, ${p.color}20)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))' }}>
                        <Graphic />
                      </div>
                      <span style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-main)',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 30,
                        color: 'var(--text-main)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}>
                        {p.category}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
                          {p.title}
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                          {p.desc}
                        </p>
                      </div>

                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                          {p.tags.map(t => (
                            <span key={t} style={{ fontSize: 11, fontWeight: 600, color: p.color, background: `${p.color}10`, padding: '3px 10px', borderRadius: 20 }}>
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Metric Badge */}
                        <div style={{
                          background: 'var(--bg-surface-soft)',
                          border: '1px solid var(--border-main)',
                          padding: '10px 14px',
                          borderRadius: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--text-main)'
                        }}>
                          <Flame size={14} style={{ color: p.color }} />
                          <span>{p.metric}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Client Case Studies Section ───────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-main)', borderBottom: '1px solid var(--border-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Deep-Dive <span className="gradient-text">Case Studies</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Detailed analyses of challenge resolutions, system re-architectures, and deployment metrics.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {caseStudies.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-main)',
                  borderRadius: 24,
                  padding: 40,
                  boxShadow: 'var(--card-shadow)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, background: study.color }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: study.color, letterSpacing: '1px', display: 'block', marginBottom: 4 }}>
                      {study.tag}
                    </span>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {study.company}
                    </h3>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: study.color }}>
                    Success Story <ExternalLink size={14} />
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 20, borderRadius: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#EF4444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Challenge</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{study.challenge}</p>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 20, borderRadius: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary-purple)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Solution</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{study.solution}</p>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 20, borderRadius: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#10B981', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Result</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{study.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Premium CTA Callout ──────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              borderRadius: 30,
              padding: '60px 40px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 20px 50px rgba(236,72,153,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, marginBottom: 16, color: 'white' }}>
              Have an Ambitious Project in Mind?
            </h2>
            <p style={{ fontSize: 16, maxWidth: 650, margin: '0 auto 36px', opacity: 0.9, lineHeight: 1.6 }}>
              Connect with our dedicated software engineers and solutions architects. Let’s map out a premium implementation plan together.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              style={{
                background: 'white',
                color: '#EC4899',
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
              Start Your Project <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
