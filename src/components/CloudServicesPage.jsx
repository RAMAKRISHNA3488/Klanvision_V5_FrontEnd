import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Cloud, Server, Shield, Zap, ArrowRight, CheckCircle2, Cpu, Database, Globe, Rocket, Terminal, Layers, Gauge } from 'lucide-react';
import { useRef } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function CloudServicesPage() {
  useSEO({
    title: 'Cloud Services | AWS Infrastructure & Migration – Klanvision',
    description: 'Klanvision delivers agile cloud solutions on AWS including EC2, Lambda, S3, cloud migration, cost optimization, and 99.99% uptime SLA for growing enterprises.',
    keywords: 'cloud services, AWS, cloud migration, serverless, EC2, infrastructure management, Klanvision',
    canonical: '/cloud-services',
  });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const cloudFeatures = [
    {
      title: "AWS Infrastructure Design",
      desc: "Our cloud solutions enable businesses to scale faster and innovate efficiently using modern AWS cloud technologies like EC2, Lambda, and S3.",
      icon: <Server className="w-8 h-8" />,
      color: "#F59E0B",
      features: ["VPC & Network Design", "EC2 Auto-scaling", "Serverless Lambda"]
    },
    {
      title: "Cloud Migration Strategy",
      desc: "We help you migrate to the cloud with minimal downtime, ensuring your existing data and applications are moved securely and efficiently.",
      icon: <Layers className="w-8 h-8" />,
      color: "#0EA5E9",
      features: ["Database Migration (DMS)", "Lift-and-Shift Strategy", "Cloud-Native Re-platforming"]
    },
    {
      title: "High Availability & Security",
      desc: "Optimize existing cloud environments and manage infrastructure with high availability, ensuring your digital assets remain secure and compliant.",
      icon: <Shield className="w-8 h-8" />,
      color: "#10B981",
      features: ["Multi-AZ Deployment", "IAM & Security Groups", "Encryption at Rest"]
    },
    {
      title: "Cost & Performance Audit",
      desc: "We help you optimize cloud costs and performance, ensuring you only pay for what you use while maintaining peak application speeds.",
      icon: <Zap className="w-8 h-8" />,
      color: "#8B5CF6",
      features: ["Savings Plans & Reserved Instances", "Resource Rightsizing", "CloudWatch Monitoring"]
    }
  ];

  return (
    <div ref={containerRef} style={{ background: '#0F172A', minHeight: '100vh', color: 'white', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive 3D Cloud Hero Section ── */}
      <section style={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at top right, #1E293B 0%, #0F172A 100%)', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated 3D Floating Clouds */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '10%', right: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent)', pointerEvents: 'none' }} 
        />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div style={{ opacity, scale }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <a href="/" style={{ color: '#0EA5E9', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40, letterSpacing: '1px' }}>
                <ChevronLeft size={18} /> BACK TO SOLUTIONS
              </a>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', padding: '10px 20px', borderRadius: '100px', color: '#0EA5E9', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '2px' }}
                  >
                    <Cloud size={14} fill="currentColor" /> MODERN AWS ECOSYSTEM
                  </motion.div>
                  
                  <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: '-0.02em' }}>
                    Agile & <br />
                    <span style={{ color: '#0EA5E9', textShadow: '0 0 40px rgba(14,165,233,0.3)' }}>Resilient</span> Cloud.
                  </h1>
                  
                  <p style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.6, marginBottom: 48, maxWidth: 600 }}>
                    Our cloud solutions enable businesses to scale faster and innovate efficiently. Migrate, manage, and optimize your infrastructure with modern AWS technologies.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', background: '#0EA5E9', color: 'white', borderRadius: '16px', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 20px 40px rgba(14,165,233,0.3)' }}>
                      Start Cloud Journey <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                {/* 3D Visual - Cloud Nodes */}
                <div style={{ position: 'relative', height: 500 }} className="hidden lg:block">
                  {[
                    { icon: <Database size={32} />, label: "RDS", top: '10%', left: '20%', delay: 0, color: '#F59E0B' },
                    { icon: <Terminal size={32} />, label: "LAMBDA", top: '50%', left: '60%', delay: 1, color: '#FF9900' },
                    { icon: <Globe size={32} />, label: "ROUTE53", top: '20%', left: '70%', delay: 0.5, color: '#10B981' },
                    { icon: <Cpu size={32} />, label: "EC2", top: '70%', left: '30%', delay: 1.5, color: '#0EA5E9' }
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

      {/* ── Cloud Pillars ── */}
      <section style={{ padding: '140px 0', background: 'white', color: '#0F172A' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24 }}
            >
              Enterprise <span style={{ color: '#0EA5E9' }}>Cloud Architecture</span>
            </motion.h2>
            <p style={{ color: '#64748B', fontSize: 20, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              Scale your business with flexible and secure cloud solutions. We help you migrate, manage, and optimize your cloud infrastructure using world-class AWS technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {cloudFeatures.map((feature, idx) => (
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

      {/* ── AWS Technologies Dashboard Visualization ── */}
      <section style={{ padding: '140px 0', background: '#0F172A' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>Modern AWS <br /><span style={{ color: '#0EA5E9' }}>Cloud Technologies</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 20, lineHeight: 1.7, marginBottom: 40 }}>
                We leverage the full power of the AWS ecosystem to ensure your business infrastructure is elastic, secure, and cost-efficient.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { title: "Elastic Auto-scaling", content: "Your infrastructure grows and shrinks automatically based on real-time traffic demand, saving you thousands." },
                  { title: "Serverless Innovation", content: "Eliminate server management overhead with Lambda and Fargate, focusing only on your code." },
                  { title: "Multi-Region Redundancy", content: "Ensure zero-downtime with global data replication across multiple AWS Availability Zones." }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 900, fontSize: 20 }}>{i+1}</div>
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
              {/* Futuristic Cloud Dashboard */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderRadius: '48px',
                padding: '60px',
                border: '1px solid rgba(14,165,233,0.2)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 40px rgba(14,165,233,0.1)',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                   <motion.div 
                     animate={{ opacity: [0.5, 1, 0.5] }}
                     transition={{ duration: 3, repeat: Infinity }}
                     style={{ fontSize: 12, fontWeight: 900, color: '#0EA5E9', letterSpacing: 3, marginBottom: 16 }}
                   >
                     CLOUD UPTIME SLA: VERIFIED
                   </motion.div>
                   <div style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 0 30px rgba(14,165,233,0.4)' }}>99.99%</div>
                   <div style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700, marginTop: 8 }}>INFRASTRUCTURE RELIABILITY</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                   {[
                     { label: "AWS Health", val: 100, color: '#0EA5E9', desc: "Operational" },
                     { label: "Cost Opt", val: 85, color: '#F59E0B', desc: "Reserved Inst" },
                     { label: "Scalability", val: 100, color: '#10B981', desc: "Elastic" },
                     { label: "Latency", val: 92, color: '#8B5CF6', desc: "Global Edge" }
                   ].map((stat, i) => (
                     <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 16px' }}>
                           <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                              <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                              <motion.circle 
                                cx="40" cy="40" r="36" fill="transparent" stroke={stat.color} strokeWidth="4" 
                                strokeDasharray="226.2"
                                initial={{ strokeDashoffset: 226.2 }}
                                whileInView={{ strokeDashoffset: 226.2 - (226.2 * stat.val) / 100 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, delay: i * 0.2 }}
                              />
                           </svg>
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'white' }}>{stat.val}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#CBD5E1' }}>{stat.label}</div>
                     </div>
                   ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Gauge size={16} color="#0EA5E9" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>Response: <span style={{ color: 'white' }}>45ms</span></span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Layers size={16} color="#10B981" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>Nodes: <span style={{ color: 'white' }}>Active</span></span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Move? (Refined Sleek CTA) ── */}
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
              border: '1px solid rgba(14,165,233,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ display: 'inline-block', color: '#0EA5E9', marginBottom: 16 }}
              >
                <Rocket size={40} fill="currentColor" />
              </motion.div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, color: 'white' }}>
                Ready to Move Your <br /><span style={{ color: '#0EA5E9' }}>Infrastructure to the Cloud?</span>
              </h2>
              
              <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: 40, maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.5 }}>
                Launch your business with flexible and secure cloud solutions. Partner with our AWS experts to migrate and optimize your infrastructure today.
              </p>

              <motion.a 
                href="/#contact-form" 
                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(14,165,233,0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  textDecoration: 'none', 
                  padding: '18px 48px', 
                  fontSize: '18px', 
                  borderRadius: '14px', 
                  background: '#0EA5E9', 
                  color: 'white', 
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 10px 20px rgba(14,165,233,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Start Cloud Migration <ArrowRight size={20} />
              </motion.a>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> AWS Certified Partners
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> Zero-Downtime Migration
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
