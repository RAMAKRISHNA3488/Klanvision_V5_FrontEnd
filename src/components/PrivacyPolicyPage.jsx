import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Eye, Share2, ShieldAlert, FileText, Database } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy | How Klanvision Protects Your Data',
    description: "Klanvision's Privacy Policy explains how we collect, use, protect and share your personal data. We are committed to GDPR compliance and data security.",
    keywords: 'privacy policy, data protection, GDPR, Klanvision data security',
    canonical: '/privacy-policy',
  });
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #120F17 0%, #1F2937 100%)', color: 'white', padding: '120px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', pointerEvents: 'none' }} />
        
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
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              At Klanvision, we are committed to protecting the privacy, confidentiality, and integrity of your personal and business information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Key Sections */}
            <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Information We Collect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <Database size={24} color="#4F46E5" />
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Information We Collect</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 20 }}>We may collect and process the following information to provide you with the best possible service:</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Personal Details', desc: 'Name, email, and contact number' },
                    { label: 'Organization', desc: 'Company name and business info' },
                    { label: 'Project Info', desc: 'Requirements shared through inquiries' },
                    { label: 'Technical Data', desc: 'IP address, browser type, usage data' }
                  ].map((item, i) => (
                    <li key={i} style={{ padding: '16px', background: 'var(--bg-surface-soft)', borderRadius: 12, border: '1px solid var(--border-main)' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: 15, marginBottom: 4 }}>{item.label}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Purpose of Data Usage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <Eye size={24} color="#7C3AED" />
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Purpose of Data Usage</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {[
                    'Responding to inquiries and communication requests',
                    'Providing proposals, quotations, and service-related information',
                    'Delivering, managing, and supporting our services',
                    'Improving our solutions, website performance, and user experience',
                    'Ensuring security, compliance, and operational effectiveness'
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-main)', fontSize: 15 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Data Sharing and Disclosure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <Share2 size={24} color="#EC4899" />
                  <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Data Sharing & Disclosure</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
                  We maintain strict confidentiality. Klanvision does not sell or rent your data. Disclosure only occurs in:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ padding: '20px', background: 'var(--bg-surface-soft)', borderRadius: 16, borderLeft: '4px solid var(--primary-purple)', border: '1px solid var(--border-main)', borderLeftWidth: 4 }}>
                    <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Trusted Partners</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>Strictly for service delivery purposes with verified service providers.</p>
                  </div>
                  <div style={{ padding: '20px', background: 'var(--bg-surface-soft)', borderRadius: 16, borderLeft: '4px solid var(--primary-purple)', border: '1px solid var(--border-main)', borderLeftWidth: 4 }}>
                    <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Legal Compliance</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>When required to comply with legal, regulatory, or contractual obligations.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Security & Rights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Data Security Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '32px', background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white' }}
              >
                <Lock size={32} style={{ marginBottom: 20, opacity: 0.8 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Data Security</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', marginBottom: 0 }}>
                  We implement industry-standard technical, administrative, and organizational safeguards to protect your data. Access is restricted to authorized personnel only.
                </p>
              </motion.div>

              {/* User Rights Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
              >
                <ShieldAlert size={28} color="#F59E0B" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>User Rights</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  You have the right to access, update, or request deletion of your data. Requests can be made through our official contact channels.
                </p>
              </motion.div>

              {/* Data Retention & Updates */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
              >
                <FileText size={28} color="#10B981" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>Retention & Updates</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Information is retained only for to fulfill the purposes outlined or by law.
                </p>
                <p style={{ fontSize: 12, fontStyle: 'italic', color: '#9CA3AF' }}>
                  Last Updated: April 2026
                </p>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* Footer Branding */}
      <section className="container" style={{ textAlign: 'center', marginTop: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 16 }}>K</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-main)' }}>KLANVISION</span>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>
          Security. Transparency. Trust.
        </p>
      </section>
    </div>
  );
}
