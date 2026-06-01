import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, BarChart, Settings, Rocket, ShieldCheck, Target, Zap, ArrowRight, CheckCircle2, TrendingUp, PieChart, Activity, Plane } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function ConsultationPage() {
  useSEO({
    title: 'IT Consultation & Strategy | Expert Technology Advisory – Klanvision',
    description: 'Klanvision\'s IT consultation services align your technology with business goals. Infrastructure audits, digital transformation advisory, ROI optimization and strategic roadmaps.',
    keywords: 'IT consultation, technology advisory, digital transformation, IT strategy, infrastructure audit, Klanvision',
    canonical: '/it-consultation',
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const advancedServices = [
    {
      title: "Strategic Technology Roadmap",
      desc: "We don't just recommend tools; we build 5-year technology visions that scale with your business growth and market evolution.",
      icon: <Target className="w-8 h-8" />,
      color: "#F97316",
      features: ["Alignment with Business Goals", "Future-proof Architecture", "Budget Planning"]
    },
    {
      title: "Infrastructure Audit & Optimization",
      desc: "Deep-dive analysis of your current stack to eliminate redundancies, reduce costs, and maximize existing hardware/software performance.",
      icon: <Settings className="w-8 h-8" />,
      color: "#8B5CF6",
      features: ["Performance Benchmarking", "Cost Reduction Analysis", "Bottleneck Identification"]
    },
    {
      title: "Digital Transformation Advisory",
      desc: "Guiding your transition from legacy systems to agile, cloud-native environments without disrupting ongoing operations.",
      icon: <Rocket className="w-8 h-8" />,
      color: "#10B981",
      features: ["Cloud Migration Strategy", "Workflow Automation", "Modern Tech Stack Adoption"]
    },
    {
      title: "Enterprise ROI & Efficiency",
      desc: "We quantify the value of every IT dollar spent, ensuring that technology remains a profit center, not a cost center.",
      icon: <BarChart className="w-8 h-8" />,
      color: "#3B82F6",
      features: ["Resource Allocation Optimization", "KPI Tracking", "Value Realization Framework"]
    }
  ];

  return (
    <div ref={containerRef} style={{ background: '#0F172A', minHeight: '100vh', color: 'white', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive 3D Hero Section ── */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at top right, #1E293B 0%, #0F172A 100%)', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated 3D Floating Elements */}
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent)', pointerEvents: 'none' }} 
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <a href="/" style={{ color: '#F97316', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO SOLUTIONS
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#F97316', fontSize: 13, fontWeight: 700, marginBottom: 24 }}
                  >
                    <Zap size={14} fill="currentColor" /> ENTERPRISE ADVISORY 2.0
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Smarter <br />
                    <span style={{ color: '#F97316', textShadow: '0 0 40px rgba(249,115,22,0.3)' }}>Technology</span> Decisions.
                  </h1>
                  
                  <p style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    We align IT strategies with your business goals for better efficiency and growth. Beyond simple advice, we provide a blueprint for digital excellence.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#F97316', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(249,115,22,0.3)' }}>
                      Get Expert Counsel <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* 3D Visual - Strategy Nodes */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <TrendingUp size={32} />, label: "MAX ROI", top: '10%', left: '20%', delay: 0, color: '#F97316' },
                    { icon: <PieChart size={32} />, label: "KPI FOCUS", top: '50%', left: '60%', delay: 1, color: '#8B5CF6' },
                    { icon: <Activity size={32} />, label: "OPTIMIZED", top: '20%', left: '70%', delay: 0.5, color: '#10B981' },
                    { icon: <ShieldCheck size={32} />, label: "SECURE", top: '70%', left: '30%', delay: 1.5, color: '#3B82F6' }
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
                        background: 'rgba(30, 41, 59, 0.7)', 
                        borderRadius: 32, 
                        border: `1px solid ${node.color}40`,
                        backdropFilter: 'blur(12px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 12,
                        boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${node.color}20`
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
                  {/* Decorative lines */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <motion.path 
                      d="M200 150 Q 300 250 450 150" 
                      stroke="rgba(249,115,22,0.2)" strokeWidth="1" fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Advanced Pillars ── */}
      <section style={{ padding: '140px 0', background: 'white', color: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24 }}
            >
              Strategic <span style={{ color: '#F97316' }}>IT Blueprints</span>
            </motion.h2>
            <p style={{ color: '#64748B', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              Our IT consulting services help businesses make informed technology decisions aligned with their goals. We analyze your current infrastructure, identify gaps, and recommend scalable solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {advancedServices.map((service, idx) => (
              <motion.div
                key={service.title}
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
                  background: `${service.color}10`, 
                  color: service.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {service.icon}
                </div>
                
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>{service.title}</h3>
                  <p style={{ color: '#64748B', fontSize: 18, lineHeight: 1.7 }}>{service.desc}</p>
                </div>
                
                <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid #E2E8F0' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {service.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#334155', fontWeight: 600 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

      {/* ── ROI & Efficiency Dashboard Visualization ── */}
      <section style={{ padding: '140px 0', background: '#0F172A' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>Maximize <span style={{ color: '#F97316' }}>Efficiency & ROI</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 20, lineHeight: 1.7, marginBottom: 40 }}>
                We guide you at every step to maximize efficiency and ROI. From digital transformation to long-term IT strategy, we ensure every decision is data-driven.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { title: "Deep Infrastructure Audit", content: "Comprehensive analysis of your current stack to identify redundancies and cost leaks." },
                  { title: "Strategic Roadmap", content: "A clear, actionable 5-year vision that aligns with your business growth milestones." },
                  { title: "Continuous Optimization", content: "Iterative improvements to your technology stack to maintain peak efficiency." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(249,115,22,0.1)', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 20 }}>{i+1}</div>
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
              {/* Futuristic Dashboard Box */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '48px',
                padding: '60px',
                border: '1px solid rgba(249,115,22,0.2)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 40px rgba(249,115,22,0.1)',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}>
                {/* Floating Glow Orbs inside the dashboard */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(249,115,22,0.15)', filter: 'blur(30px)', borderRadius: '50%' }} />
                
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                   <motion.div 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     style={{ fontSize: 12, fontWeight: 900, color: '#F97316', letterSpacing: 3, marginBottom: 16 }}
                   >
                     REAL-TIME IMPACT ANALYSIS
                   </motion.div>
                   <div style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(249,115,22,0.4)' }}>+42%</div>
                   <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700, marginTop: 8 }}>OPERATIONAL EXCELLENCE GAIN</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                   {[
                     { label: "Direct Cost Reduction", val: 35, color: '#F97316' },
                     { label: "Infrastructure Deployment Speed", val: 80, color: '#8B5CF6' },
                     { label: "Strategic Compliance Health", val: 100, color: '#10B981' }
                   ].map((stat, i) => (
                     <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, fontWeight: 900 }}>
                           <span style={{ color: '#CBD5E1' }}>{stat.label.toUpperCase()}</span>
                           <span style={{ color: stat.color }}>{stat.val}%</span>
                        </div>
                        <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: `${stat.val}%` }}
                             viewport={{ once: true }}
                             transition={{ duration: 2, delay: i * 0.3, ease: [0.16, 1, 0.3, 1] }}
                             style={{ 
                               height: '100%', 
                               background: `linear-gradient(90deg, ${stat.color}80, ${stat.color})`, 
                               borderRadius: 5, 
                               boxShadow: `0 0 15px ${stat.color}40` 
                             }}
                           />
                        </div>
                     </div>
                   ))}
                </div>

                {/* Additional Micro-stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 48 }}>
                   <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>AVG. RESPONSE</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>12ms</div>
                   </div>
                   <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>Uptime SLA</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#10B981' }}>99.99%</div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Start? (Refined Sleek CTA) ── */}
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
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto',
              border: '1px solid rgba(249,115,22,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Subtle Gradient Glow */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 60%)', transform: 'rotate(-45deg)' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <motion.div 
                animate={{ 
                  x: [0, 5, 0],
                  y: [0, -5, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: 'inline-block', color: '#F97316', marginBottom: 16 }}
              >
                <Plane size={32} />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: 'white' }}>
                Ready for Digital <span style={{ color: '#F97316' }}>Transformation?</span>
              </h2>
              
              <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.5 }}>
                Take the next step towards technical excellence. Partner with our advisors to build your future-proof roadmap today.
              </p>

              <motion.a 
                href="/#contact-form" 
                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(249,115,22,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  textDecoration: 'none', 
                  padding: '18px 48px', 
                  fontSize: '18px', 
                  borderRadius: '14px', 
                  background: '#F97316', 
                  color: 'white', 
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 10px 20px rgba(249,115,22,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Start Strategy Session <ArrowRight size={20} />
              </motion.a>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> Confidential Audit
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> Expert Counsel
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
