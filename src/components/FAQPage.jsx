import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus, ChevronLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// ── 3D Animated FAQ Icons ─────────────────────────────────────
const SvgFAQIcon3D = ({ index, active }) => {
  const type = index % 3; // Cycle through 3 different shapes
  
  return (
    <motion.svg 
      width="32" height="32" viewBox="0 0 42 42" fill="none"
      animate={active ? { rotateY: [0, 360], scale: [1, 1.1, 1] } : { y: [0, -2, 0] }}
      transition={{ duration: active ? 4 : 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id={`g-faq-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={active ? "#A855F7" : "#818CF8"} />
          <stop offset="100%" stopColor={active ? "#7C3AED" : "#4F46E5"} />
        </radialGradient>
      </defs>

      {type === 0 && ( // 3D Cube representation
        <motion.path
          d="M21 6 L34 13 L34 29 L21 36 L8 29 L8 13 Z"
          fill={`url(#g-faq-${index})`}
          stroke="white" strokeWidth="0.5" strokeOpacity="0.3"
        />
      )}
      {type === 1 && ( // 3D Sphere representation
        <motion.circle
          cx="21" cy="21" r="15"
          fill={`url(#g-faq-${index})`}
        />
      )}
      {type === 2 && ( // 3D Torus/Donut representation
        <motion.path
          d="M21 8 A13 13 0 1 0 21 34 A13 13 0 1 0 21 8 Z M21 16 A5 5 0 1 1 21 26 A5 5 0 1 1 21 16 Z"
          fill={`url(#g-faq-${index})`}
          fillRule="evenodd"
        />
      )}
      
      {/* Glossy highlight */}
      <circle cx="16" cy="15" r="4" fill="white" fillOpacity="0.2" />
    </motion.svg>
  );
};

const faqs = [
  {
    q: "What services do you offer?",
    a: "We provide a comprehensive range of IT and software solutions, including web development, mobile application development, cloud services, API integration, cybersecurity, and managed IT services."
  },
  {
    q: "Do you provide support after project delivery?",
    a: "Yes, we offer post-deployment support and maintenance services to ensure system stability, performance, and continuous improvement."
  },
  {
    q: "How long does a project typically take?",
    a: "Project timelines vary depending on the scope, complexity, and specific requirements. A detailed timeline is shared during the proposal and planning phase."
  },
  {
    q: "What is your pricing model?",
    a: "Our pricing is based on project scope, complexity, and resource requirements. We offer flexible models such-price, milestone-based, and time & material (hourly/monthly)."
  },
  {
    q: "Do you offer a Service Level Agreement (SLA)?",
    a: "Yes, we provide SLAs for managed and support services, defining response times, resolution timelines, and service availability commitments."
  },
  {
    q: "How do you communicate during the project?",
    a: "We maintain regular communication through email, scheduled meetings, and collaboration tools. Progress updates are shared at defined intervals to ensure transparency."
  },
  {
    q: "What tools and technologies do you use?",
    a: "We work with modern technologies and tools based on project needs, including cloud platforms, DevOps tools, and development frameworks aligned with industry standards."
  },
  {
    q: "Do you sign Non-Disclosure Agreements (NDAs)?",
    a: "Yes, we strictly adhere to confidentiality standards and are happy to sign NDAs to protect your business information and intellectual property."
  },
  {
    q: "Do you provide cloud migration services?",
    a: "Yes, we offer end-to-end cloud migration and infrastructure modernization services to help businesses scale efficiently and securely."
  },
  {
    q: "Do you provide ongoing maintenance and support?",
    a: "Yes, we offer flexible support and maintenance plans based on your business needs."
  },
  {
    q: "What industries do you work with?",
    a: "We work with clients across various industries, delivering customized solutions tailored to specific business requirements."
  }
];

export default function FAQPage() {
  useSEO({
    title: 'Frequently Asked Questions | Klanvision Support',
    description: 'Find answers to common questions about Klanvision services, project timelines, pricing, NDAs, SLAs, tech stack, cloud migration and post-delivery support.',
    keywords: 'FAQ, Klanvision support, IT services questions, pricing, project timeline, NDA, SLA',
    canonical: '/faq',
  });
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* FAQ Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #120F17 0%, #1F2937 100%)', color: 'white', padding: '120px 0 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Animated background elements */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1), transparent)', pointerEvents: 'none' }} />
        
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
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Find answers to the most common questions about our services, process, and commitment to your success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ marginBottom: 16 }}
            >
              <div 
                className="card"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ 
                  padding: 0, 
                  overflow: 'hidden', 
                  background: 'var(--bg-surface)',
                  border: openIndex === i ? '1px solid var(--primary-purple)' : '1px solid var(--border-main)',
                  boxShadow: openIndex === i ? '0 10px 25px rgba(124,58,237,0.2)' : 'var(--card-shadow)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                     <div style={{ flexShrink: 0 }}>
                      <SvgFAQIcon3D index={i} active={openIndex === i} />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{faq.q}</h3>
                  </div>
                  <div style={{ color: openIndex === i ? 'var(--primary-purple)' : '#9CA3AF' }}>
                    {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </div>
                
                <motion.div
                  initial={false}
                  animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 32px 32px 70px', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still have questions? CTA */}
      <section className="container" style={{ textAlign: 'center', marginTop: 80 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ padding: '60px 40px', background: 'var(--bg-surface)', borderRadius: 32, boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-main)' }}
        >
          <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 12, color: 'var(--text-main)' }}>Still have questions?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>Can\'t find the answer you\'re looking for? Our support team is here to help.</p>
          <a href="/#contact" className="btn-primary" style={{ textDecoration: 'none', padding: '16px 40px', display: 'inline-block' }}>
            Contact Support Team
          </a>
        </motion.div>
      </section>
    </div>
  );
}
