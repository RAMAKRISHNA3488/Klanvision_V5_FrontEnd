import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Globe, Shield, Target, Compass, Heart, Users,
  Calendar, Award, Mail, ChevronRight, CheckCircle2
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useSEO } from '../hooks/useSEO';

export default function AboutPage() {
  useSEO({
    title: 'About Our Team, Vision & History | Klanvision',
    description: 'Learn about Klanvision’s founding in Anantapur, our vision for digital transformation, our timeline milestones, and our executive software engineering teams.',
    keywords: 'Klanvision Team, Corporate History, Company Vision, Software Developers, Anantapur IT Company',
    canonical: '/about',
  });

  const [hoveredMember, setHoveredMember] = useState(null);

  // Repurposed hoveredMember state for Capabilities hover tracking

  const milestones = [
    {
      year: '2025 Jan',
      title: 'Company Foundation',
      desc: 'Established our primary headquarters in Anantapur, Andhra Pradesh with a focused core team of 5 senior systems developers.'
    },
    {
      year: '2025 Jul',
      title: '100+ Projects Completed',
      desc: 'Successfully launched responsive web portals, CRM solutions, and custom mobile apps for local regional companies.'
    },
    {
      year: '2025 Dec',
      title: 'Global Delivery Expansion',
      desc: 'Integrated cloud migrations and remote consulting processes, delivering technical solutions to clients across international borders.'
    },
    {
      year: '2026 Jun',
      title: 'Klanvision V5 Platform',
      desc: 'Migrated to decoupled multi-page layouts, scaling up operations, and introducing advanced AI support assistants.'
    }
  ];

  const valueProps = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To demystify cloud computation, design beautiful user-centric software systems, and provide small to large corporate partners with clean execution pipelines.',
      color: '#4F46E5'
    },
    {
      icon: Compass,
      title: 'Our Vision',
      desc: 'To establish Klanvision as a top-tier digital transformation firm, leveraging AI and serverless architectures to automate legacy systems globally.',
      color: '#8B5CF6'
    },
    {
      icon: Heart,
      title: 'Our Core Values',
      desc: 'Writing clean code by default, ensuring immediate accessibility across platforms, maintaining absolute client data safety, and communicating transparently.',
      color: '#10B981'
    }
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      
      {/* ── About Hero ─────────────────────────────────────────── */}
      <section style={{ 
        background: 'var(--hero-bg)', 
        padding: '160px 0 100px', 
        position: 'relative', 
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-main)'
      }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: '6px 16px', borderRadius: 50, marginBottom: 24, fontSize: 13, fontWeight: 700, color: 'var(--primary-purple)' }}>
              <Users size={14} /> SHAPING THE DIGITAL WORLD
            </div>
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 64px)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em',
              marginBottom: 20, 
              color: 'var(--text-main)' 
            }}>
              Architecting Digital <span className="gradient-text">Reality</span> Since 2025
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: 'clamp(15px, 2.5vw, 19px)', 
              maxWidth: 650, 
              margin: '0 auto', 
              lineHeight: 1.6 
            }}>
              Klanvision blends robust software engineering, scalable cloud topologies, and clean user experience principles to help global brands expand efficiently.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Value Propositions Section ────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {valueProps.map((val, idx) => {
              const ValIcon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-main)',
                    borderRadius: 20,
                    padding: 36,
                    boxShadow: 'var(--card-shadow)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: val.color }} />
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${val.color}15`, color: val.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <ValIcon size={22} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Milestones Timeline Section ───────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-main)', borderBottom: '1px solid var(--border-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Our Company <span className="gradient-text">Milestones</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Trace the trajectory of our rapid growth and ongoing contributions to technical innovation.
            </p>
          </div>

          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
            {/* Center Line for desktop */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--border-main)', transform: 'translateX(-50%)' }} className="desktop-nav" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {milestones.map((m, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    style={{
                      display: 'flex',
                      justifyContent: isEven ? 'flex-start' : 'flex-end',
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    {/* Circle Indicator */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: 24,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'var(--primary-purple)',
                      border: '4px solid var(--bg-surface)',
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      transform: 'translateX(-50%)',
                      zIndex: 3
                    }} className="desktop-nav" />

                    {/* Milestone Card */}
                    <div style={{
                      width: '45%',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-main)',
                      borderRadius: 16,
                      padding: 24,
                      boxShadow: 'var(--card-shadow)',
                    }} className="milestone-width">
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-purple)', display: 'block', marginBottom: 6 }}>
                        {m.year}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: '0 0 8px' }}>
                        {m.title}
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        {m.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline responsiveness helper */}
        <style>{`
          @media (max-width: 768px) {
            .milestone-width { width: 100% !important; }
            #about-page-timeline { padding-left: 20px !important; }
          }
        `}</style>
      </section>

      {/* ── 3D Technology Core & Capabilities Section ─────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow flares */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16, letterSpacing: '-1px' }}>
              Interactive <span className="gradient-text">Innovation Hub</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 650, margin: '0 auto', lineHeight: 1.6 }}>
              Step inside our digital tech core. Hover over our capabilities and watch the holographic core synchronize in real-time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }} className="admin-grid-1-1">
            
            {/* Left Column: Interactive Capabilities Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                {
                  title: 'Cognitive Intelligence',
                  desc: 'We integrate advanced machine learning models and cognitive agents to automate decision trees and drive predictive analytics.',
                  color: '#6366F1',
                  accent: 'rgba(99, 102, 241, 0.15)'
                },
                {
                  title: 'Architectural Resilience',
                  desc: 'Our zero-trust microservice meshes ensure continuous service delivery and sub-millisecond response rates under massive load.',
                  color: '#8B5CF6',
                  accent: 'rgba(139, 92, 246, 0.15)'
                },
                {
                  title: 'Cloud-Native Scalability',
                  desc: 'Deploying serverless topologies and elastic container pipelines that scale automatically based on global consumer traffic.',
                  color: '#EC4899',
                  accent: 'rgba(236, 72, 153, 0.15)'
                },
                {
                  title: 'Continuous Innovation',
                  desc: 'Active security auditing, automatic continuous deployments, and visual diagnostic tools built straight into your dashboards.',
                  color: '#F59E0B',
                  accent: 'rgba(245, 158, 11, 0.15)'
                }
              ].map((cap, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 12, scale: 1.02 }}
                  onMouseEnter={() => setHoveredMember(idx)}
                  onMouseLeave={() => setHoveredMember(null)}
                  style={{
                    background: hoveredMember === idx ? 'var(--bg-surface-soft)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-main)',
                    borderColor: hoveredMember === idx ? cap.color : 'var(--border-main)',
                    borderRadius: 24,
                    padding: '24px 32px',
                    cursor: 'pointer',
                    boxShadow: hoveredMember === idx ? `0 20px 40px ${cap.color}10` : 'var(--card-shadow)',
                    display: 'flex',
                    gap: 24,
                    alignItems: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: cap.color,
                    boxShadow: hoveredMember === idx ? `0 0 15px ${cap.color}` : 'none',
                    transition: 'all 0.3s'
                  }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>{cap.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>{cap.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Holographic 3D Animation Core */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450, position: 'relative' }}>
              <div 
                style={{ 
                  perspective: 1200, 
                  width: 320, 
                  height: 320, 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* 3D Container */}
                <motion.div
                  animate={{ 
                    rotateY: 360,
                    rotateX: [15, 25, 15]
                  }}
                  transition={{ 
                    rotateY: { duration: 16, repeat: Infinity, ease: 'linear' },
                    rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Central Hologram Core */}
                  <div 
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: hoveredMember !== null 
                        ? `radial-gradient(circle, ${['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'][hoveredMember]} 30%, transparent 70%)`
                        : 'radial-gradient(circle, #7C3AED 30%, transparent 70%)',
                      filter: 'blur(10px)',
                      boxShadow: hoveredMember !== null
                        ? `0 0 50px 20px ${['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'][hoveredMember]}80`
                        : '0 0 40px 15px rgba(124, 92, 246, 0.5)',
                      transform: 'translateZ(0)',
                      position: 'absolute',
                      transition: 'all 0.5s ease'
                    }}
                  />
                  <div 
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'white',
                      boxShadow: '0 0 25px #fff',
                      position: 'absolute',
                      transform: 'translateZ(0)',
                      opacity: 0.95
                    }}
                  />

                  {/* Ring 1 - Vertical Orbit */}
                  <div 
                    style={{
                      width: 260,
                      height: 260,
                      borderRadius: '50%',
                      border: '2px dashed rgba(124, 92, 246, 0.4)',
                      borderColor: hoveredMember !== null ? ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'][hoveredMember] : 'rgba(124, 92, 246, 0.4)',
                      position: 'absolute',
                      transform: 'rotateX(75deg) rotateY(0deg)',
                      boxShadow: '0 0 10px rgba(124, 92, 246, 0.1)',
                      transition: 'border-color 0.5s'
                    }}
                  />

                  {/* Ring 2 - Horizontal Orbit */}
                  <div 
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(236, 72, 153, 0.4)',
                      borderColor: hoveredMember !== null ? ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'][hoveredMember] : 'rgba(236, 72, 153, 0.4)',
                      position: 'absolute',
                      transform: 'rotateX(-20deg) rotateY(60deg)',
                      boxShadow: '0 0 10px rgba(236, 72, 153, 0.1)',
                      transition: 'border-color 0.5s'
                    }}
                  />

                  {/* Ring 3 - Diagonal Orbit */}
                  <div 
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(6, 182, 212, 0.4)',
                      borderColor: hoveredMember !== null ? ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'][hoveredMember] : 'rgba(6, 182, 212, 0.4)',
                      position: 'absolute',
                      transform: 'rotateX(45deg) rotateY(-45deg)',
                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.1)',
                      transition: 'border-color 0.5s'
                    }}
                  />

                  {/* Orbiting Satellite Node 1 */}
                  <motion.div
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 200,
                      height: 200,
                      position: 'absolute',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div 
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#6366F1',
                        boxShadow: '0 0 15px #6366F1',
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%) translateZ(0)'
                      }}
                    />
                  </motion.div>

                  {/* Orbiting Satellite Node 2 */}
                  <motion.div
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: 260,
                      height: 260,
                      position: 'absolute',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div 
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#EC4899',
                        boxShadow: '0 0 15px #EC4899',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%) translateZ(0)'
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Perspective depth reflections */}
                <div style={{ position: 'absolute', bottom: -40, width: 220, height: 16, background: 'radial-gradient(ellipse at center, rgba(124, 92, 246, 0.25) 0%, transparent 70%)', filter: 'blur(8px)', borderRadius: '50%' }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Future Roadmap / Operational Vision Section ────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-main)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Klanvision <span className="gradient-text">Roadmap</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>
              Our operational blueprint for future tech upgrades and service expansion.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { phase: 'Phase 1: Scale AI Assistance', desc: 'Roll out advanced RAG-based virtual consulting services inside the admin panel context.', status: 'In Progress' },
              { phase: 'Phase 2: Hybrid Cloud Nodes', desc: 'Introduce decentralized hybrid database architectures to support zero-latency operations.', status: 'Planned' },
              { phase: 'Phase 3: Automated VAPT Suite', desc: 'Deploy pre-packaged vulnerability scanners inside client development portals automatically.', status: 'Planned' }
            ].map((step, idx) => (
              <div key={idx} style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', padding: 24, borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>{step.phase}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: step.status === 'In Progress' ? '#10B981' : 'var(--text-muted)', padding: '4px 12px', borderRadius: 30 }}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
