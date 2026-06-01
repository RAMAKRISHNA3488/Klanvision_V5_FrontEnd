import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Zap, Shield, Repeat, ArrowRight, CheckCircle2, Code2, Link, Database, Cpu } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function APIIntegrationPage() {
  useSEO({
    title: 'API Integration Services | Connect Your Systems – Klanvision',
    description: 'Klanvision provides seamless API integration: custom REST & GraphQL APIs, third-party platform connections (Stripe, Salesforce, Shopify), real-time data sync, and OAuth2 security.',
    keywords: 'API integration, REST API, GraphQL, Salesforce integration, Stripe API, webhook, Klanvision',
    canonical: '/api-integration',
  });
  const integrationFeatures = [
    {
      title: "Custom API Development",
      desc: "We build secure, high-performance RESTful and GraphQL APIs designed to handle complex data structures and high-frequency requests.",
      icon: <Code2 className="w-8 h-8" />,
      color: "#EC4899",
      features: ["REST & GraphQL Protocols", "Swagger/OpenAPI Documentation", "Version Control Management"]
    },
    {
      title: "Third-Party Ecosystems",
      desc: "Seamlessly connect your business with global platforms like Salesforce, Stripe, Shopify, and SAP to unify your operational data.",
      icon: <Link className="w-8 h-8" />,
      color: "#8B5CF6",
      features: ["CRM & ERP Integration", "Payment Gateway Setup", "Social Media API Connect"]
    },
    {
      title: "Real-time Data Sync",
      desc: "Ensuring that your data remains consistent across all platforms with automated, bi-directional synchronization and webhook triggers.",
      icon: <Repeat className="w-8 h-8" />,
      color: "#10B981",
      features: ["Bi-directional Syncing", "Webhook Architecture", "Conflict Resolution Logic"]
    },
    {
      title: "Security & API Gateways",
      desc: "Protecting your endpoints with industry-standard OAuth2, JWT, and API gateway implementations to prevent unauthorized access.",
      icon: <Shield className="w-8 h-8" />,
      color: "#3B82F6",
      features: ["OAuth2 & JWT Auth", "Rate Limiting & Throttling", "End-to-End Encryption"]
    }
  ];

  return (
    <div style={{ background: '#FFF1F2', minHeight: '100vh', color: '#0F172A', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Immersive API Hero Section ── */}
      <section style={{ 
        background: 'linear-gradient(135deg, #831843 0%, #9D174D 100%)', 
        color: 'white', 
        padding: '120px 0 100px', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Animated Background Connection Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
           <pattern id="grid-api" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1.5" fill="white" />
              <path d="M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.5" />
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid-api)" />
        </svg>
        
        {/* Pulsing Data Nodes */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.3), transparent)', pointerEvents: 'none' }} 
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a href="/" style={{ color: '#F9A8D4', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 32, letterSpacing: '1px' }}>
              <ChevronLeft size={18} /> BACK TO SOLUTIONS
            </a>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(249,168,212,0.1)', border: '1px solid rgba(249,168,212,0.2)', padding: '8px 16px', borderRadius: '100px', color: '#F9A8D4', fontSize: 13, fontWeight: 700, marginBottom: 24 }}
                >
                  <Share2 size={14} /> CONNECTED ECOSYSTEMS
                </motion.div>
                
                <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                  Seamless <br />
                  <span style={{ color: '#F9A8D4' }}>API Integration</span>
                </h1>
                
                <p style={{ fontSize: 20, color: '#FCE7F3', opacity: 0.9, lineHeight: 1.6, marginBottom: 40, maxWidth: 650 }}>
                  We enable seamless communication between different systems through secure and efficient API integrations. Smooth data flow, improved automation, and better connectivity.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                  <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '18px 36px', background: '#EC4899', color: 'white', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(236,72,153,0.3)' }}>
                    Connect Your Apps <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              {/* Stylish 3D Node Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ position: 'relative', height: 400 }}
                className="hidden lg:block"
              >
                 <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Central Node */}
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      style={{ width: 120, height: 120, background: '#EC4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(236,72,153,0.5)', zIndex: 5, border: '4px solid rgba(255,255,255,0.2)' }}
                    >
                       <Cpu size={48} />
                    </motion.div>

                    {/* Surrounding Nodes */}
                    {[
                       { icon: <Database />, x: -140, y: -80, color: '#8B5CF6' },
                       { icon: <Zap />, x: 140, y: -80, color: '#F59E0B' },
                       { icon: <Shield />, x: -140, y: 80, color: '#3B82F6' },
                       { icon: <Repeat />, x: 140, y: 80, color: '#10B981' }
                    ].map((node, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{ x: node.x, y: node.y, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        style={{ 
                          position: 'absolute', 
                          width: 64, height: 64, 
                          background: 'rgba(255,255,255,0.05)', 
                          borderRadius: 16, 
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: node.color,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}
                      >
                         {node.icon}
                         {/* Connection Line */}
                         <svg style={{ position: 'absolute', width: 200, height: 200, pointerEvents: 'none', zIndex: -1 }}>
                            <motion.line 
                              x1={32} y1={32} x2={32 - node.x} y2={32 - node.y} 
                              stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5"
                              animate={{ strokeDashoffset: [0, -20] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                         </svg>
                      </motion.div>
                    ))}
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why API Integration Matters ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 20 }}>Unified Data & <span style={{ color: '#EC4899' }}>Better Automation</span></h2>
            <p style={{ color: '#64748B', fontSize: 18, maxWidth: 700, margin: '0 auto' }}>
              Connect systems for seamless communication and data flow. We enable secure and efficient integrations across platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {integrationFeatures.map((feature, idx) => (
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
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #E2E8F0',
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

      {/* ── Advanced Connectivity Dashboard ── */}
      <section style={{ padding: '100px 0', background: '#0F172A', color: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>Secure & Efficient <br /><span style={{ color: '#F9A8D4' }}>Platform Connectivity</span></h2>
              <p style={{ color: '#94A3B8', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
                Helping your business operate more efficiently by ensuring high-availability connections and secure data transmission across your entire software stack.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                 {[
                   { title: "Latency Reduction", content: "Optimized request handling and caching layers to minimize API response times." },
                   { title: "Error Handling", content: "Robust retry logic and error logging to ensure data never gets lost in transit." },
                   { title: "Scalability", content: "Asynchronous processing and message queues to handle spikes in data traffic." }
                 ].map((item, i) => (
                   <div key={i} style={{ display: 'flex', gap: 20 }}>
                     <div style={{ fontSize: 24, fontWeight: 900, color: '#EC4899', opacity: 0.5 }}>{i+1}</div>
                     <div>
                       <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                       <p style={{ color: '#94A3B8', fontSize: 15 }}>{item.content}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotateY: 20 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              style={{ perspective: '1000px' }}
            >
              {/* API Traffic Visualization */}
              <div style={{ 
                background: 'linear-gradient(135deg, #1E2937 0%, #0F172A 100%)',
                borderRadius: 32,
                padding: 40,
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                transform: 'rotateX(5deg) rotateY(-5deg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                   <div style={{ fontWeight: 800, fontSize: 14, color: '#EC4899' }}>API THROUGHPUT</div>
                   <div style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.2)', color: '#10B981', borderRadius: '100px', fontSize: 10, fontWeight: 900 }}>REAL-TIME SYNC</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150, marginBottom: 40 }}>
                   {[60, 40, 80, 50, 90, 70, 45, 85].map((h, i) => (
                     <motion.div
                       key={i}
                       initial={{ height: 0 }}
                       whileInView={{ height: `${h}%` }}
                       transition={{ duration: 0.8, delay: i * 0.1 }}
                       style={{ flex: 1, background: 'linear-gradient(to top, #831843, #EC4899)', borderRadius: '4px 4px 0 0' }}
                     />
                   ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                   <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>UPTIME</div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>99.99%</div>
                   </div>
                   <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>RESPONSE</div>
                      <div style={{ fontSize: 24, fontWeight: 900 }}>120ms</div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to Integrate? ── */}
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
              border: '1px solid #E2E8F0',
              maxWidth: 900,
              margin: '0 auto'
            }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Ready to Connect Your <br /><span style={{ color: '#EC4899' }}>Digital Software Stack?</span></h2>
            <p style={{ color: '#64748B', fontSize: 18, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
              Bridge the gaps between your applications and automate your business processes with our expert API integration services.
            </p>
            <a href="/#contact-form" className="btn-primary" style={{ textDecoration: 'none', padding: '20px 48px', fontSize: 18, borderRadius: 16, display: 'inline-block', background: '#EC4899' }}>
              Start Your Integration Project
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
