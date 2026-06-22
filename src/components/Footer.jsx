// ============================================================
// Footer.tsx
// Site footer for Klanvision.
// Four-column grid: brand/socials | quick links | legal | contact.
// Includes a top gradient accent, decorative blobs, dot field
// with cursor-tracking spotlight, divider, copyright + back-to-top.
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, X } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import DotGrid from './DotGrid';

// Quick navigation links shown in the footer with their target section IDs
const quickLinks = [
  { label: 'Home', id: 'hero' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
  { label: 'Careers', id: 'careers' }
];

// Legal policy links - strictly matching the updated documented info
const legalLinks = [
  'Terms & Conditions',
  'Service Policy',
  'Privacy Policy',
  'Cancellation & Refund Policy',
  'FAQ',
];

// Content for the Legal Modals
// Content for the Legal Modals
const legalContent = {
  'Terms & Conditions': {
    title: 'Terms & Conditions',
    content: (
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>

        <p style={{ marginBottom: 16 }}>Welcome to Klanvision. By accessing our website and using our services, you agree to the following terms:</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 16 }}>
          <li>• All services are delivered based on agreed scope, timelines, and pricing.</li>
          <li>• Clients must provide accurate requirements, content, and necessary access.</li>
          <li>• Any misuse or unauthorized use of our website or services is strictly prohibited.</li>
          <li>• Project timelines depend on client feedback, approvals, and external dependencies.</li>
          <li>• We reserve the right to modify services or terms at any time.</li>
          <li>• Ownership of deliverables is transferred only after full payment is completed.</li>
        </ul>
      </div>
    )
  },
  'Service Policy': {
    title: 'Service Policy',
    content: (
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
        <p style={{ marginBottom: 12 }}>At Klanvision, we deliver high-quality IT and software solutions tailored to meet diverse business requirements.</p>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Our service offerings include:</h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', marginBottom: 16 }}>
          <span>• Web Development</span>
          <span>• Mobile Application Development</span>
          <span>• Cloud Services</span>
          <span>• API Integration</span>
          <span>• Managed IT Services</span>
          <span>• Cybersecurity Solutions</span>
          <span>• Website Migration & Upgrades</span>
          <span>• IT Consultation & Advisory</span>
        </div>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Service Delivery Approach</h4>

        <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li><strong>1. Requirement Analysis</strong> – Perform detailed requirement gathering and business analysis.</li>
          <li><strong>2. Solution Design & Planning</strong> – Develop architecture and implementation strategy.</li>
          <li><strong>3. Development & Implementation</strong> – Execute development using secure coding practices.</li>
          <li><strong>4. Quality Assurance & Deployment</strong> – Comprehensive testing and validation.</li>
          <li><strong>5. Support & Maintenance</strong> – Ongoing monitoring and optimization.</li>
        </ol>
      </div>
    )
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    content: (
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
        <p style={{ marginBottom: 12 }}>We are committed to protecting the privacy and integrity of your information.</p>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>Information We Collect</h4>

        <ul style={{ paddingLeft: 16, marginBottom: 12 }}>
          <li>• Personal details (name, email, contact number)</li>
          <li>• Organization details and project requirements</li>
          <li>• Technical data such address and interaction data</li>
        </ul>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>Data Sharing</h4>

        <p style={{ marginBottom: 12 }}>Klanvision does not sell or rent your data. We share information only with trusted partners for service delivery or by law.</p>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>Data Security</h4>

        <p>We implement industry-standard technical and organizational safeguards to protect your data from unauthorized access.</p>
      </div>
    )
  },
  'Cancellation & Refund Policy': {
    title: 'Cancellation & Refund Policy',
    content: (
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>4.1 Cancellation Policy</h4>
        <ul style={{ paddingLeft: 16, marginBottom: 16 }}>
          <li>• <strong>Before Project Start:</strong> Full refund review of advance payments.</li>
          <li>• <strong>After Project Start:</strong> Charges based on work completed.</li>
          <li>• <strong>Managed Services:</strong> Requires 30 days’ prior written notice.</li>
          <li>• Third-party costs (licenses, tools) are non-refundable.</li>
        </ul>
        <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>4.2 Refund Policy</h4>
        <ul style={{ paddingLeft: 16 }}>
          <li>• <strong>Before Commencement:</strong> Eligible for full refund.</li>
          <li>• <strong>After Initiation:</strong> Refund after deducting labor and resources.</li>
          <li>• <strong>Post-Delivery:</strong> No refunds once project is approved.</li>
          <li>• Approved refunds processed within 7–10 business days.</li>
        </ul>
      </div>
    )
  }
};

// Social media platforms with icon, label, brand color, and URLs
const socials = [
  { icon: FaFacebook, label: 'Facebook', color: '#1877F2', url: 'https://www.facebook.com/profile.php?id=61574478992387' },
  { icon: FaTwitter, label: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com/KlanSmteam' },
  { icon: FaInstagram, label: 'Instagram', color: '#E4405F', url: 'https://www.instagram.com/klanvision?utm_source=qr&igsh=MXU4ZWxuMWxlc2Ziag%3D%3D' },
  { icon: FaLinkedin, label: 'LinkedIn', color: '#0A66C2', url: 'https://www.linkedin.com/in/' },
  { icon: FaYoutube, label: 'YouTube', color: '#FF0000', url: 'https://www.youtube.com/channel/UClvuyWdO7rlNx0SHwcgMMsA' },
  { icon: Mail, label: 'Email', color: '#FF6B35', url: 'mailto:support@klanvision.com' },
];

// ── Impressive Footer Heading Component ───────────────────────
const FooterHeading = ({ children }) => (
  <div style={{ marginBottom: 28 }}>
    <h4 style={{
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 800,
      fontSize: 15,
      color: 'white',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      margin: 0
    }}>
      {children}
    </h4>
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 30 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{
        height: 3,
        background: 'linear-gradient(90deg, #FF6B35, #7C3AED)',
        borderRadius: 10,
        marginTop: 8
      }}
    />
  </div>
);

export default function Footer() {
  // State for active legal modal
  const [activeLegal, setActiveLegal] = useState(null);

  // Smooth scroll helper used for quick links navigation
  const scrollTo = (id) => {
    if (id === 'careers') {
      window.location.href = '/careers';
      return;
    }
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // Footer – dark background matches DotField glowColor for seamless blend
    <footer style={{ background: '#120F17', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Top gradient accent bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #FF6B35, #7C3AED)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />

      {/* DotGrid – interactive dot canvas with proximity glow & click shockwave */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <DotGrid
          dotSize={3}
          gap={18}
          baseColor="#2A2237"
          activeColor="#A855F7"
          proximity={130}
          shockRadius={260}
          shockStrength={4}
          returnDuration={1.2}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Main 4-column grid – collapses to 2 cols on tablet, 1 col on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, padding: '64px 0 48px' }} className="footer-grid">

          {/* Column 1: Brand + tagline + social buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column' }}
            className="footer-col-brand"
          >

            {/* Logo mark + wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 16, marginBottom: 28 }} onClick={() => scrollTo('hero')}>

              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  width: 68,
                  height: 68,
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED, #FF6B35)',
                  WebkitMaskImage: 'url(/logo.png)',
                  maskImage: 'url(/logo.png)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.5))'
                }}
              />


              <motion.span
                whileHover={{ scale: 1.02 }}
                style={{
                  fontFamily: "'Outfit', 'Poppins', sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  letterSpacing: 2,
                  display: 'flex',
                  gap: 4,
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #FF6B35)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 10px rgba(124, 58, 237, 0.2))'
                }}>KLAN</span>
                <span style={{ color: 'white' }}>VISION</span>
              </motion.span>
            </div>



            {/* Tagline */}
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.75, marginBottom: 20 }} className="footer-tagline">

              Transforming the Future of Technology | Empowering Businesses with Enhanced Digital Solutions.
            </p>

            {/* Social icon buttons – hover reveals platform brand color */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} className="footer-socials">
              {socials.map(s => (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith('mailto') ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -4, backgroundColor: s.color, color: 'white' }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', color: '#9CA3AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = s.color)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                >
                  <s.icon size={18} style={{ color: 'white' }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="footer-col-links"
          >
            <FooterHeading>Quick Links</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {quickLinks.map(link => (
                <li key={link.id}>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 1.2, x: 10 }}
                    onClick={() => scrollTo(link.id)}
                    className="footer-link"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8,
                      textAlign: 'left', fontSize: 13.5, margin: 0
                    }}
                  >
                    {/* Orange arrow – revealed on hover via CSS */}
                    <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="footer-col-legal"
          >
            <FooterHeading>Legal</FooterHeading>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {legalLinks.map(link => (
                <li key={link}>
                  {link === 'FAQ' ? (
                    <motion.a
                      href="/faq"
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{ textDecoration: 'none', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', margin: 0 }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {link}
                    </motion.a>
                  ) : link === 'Terms & Conditions' ? (
                    <motion.a
                      href="/terms"
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{ textDecoration: 'none', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', margin: 0 }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {link}
                    </motion.a>
                  ) : link === 'Service Policy' ? (
                    <motion.a
                      href="/service-policy"
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{ textDecoration: 'none', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', margin: 0 }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {link}
                    </motion.a>
                  ) : link === 'Cancellation & Refund Policy' ? (
                    <motion.a
                      href="/refund-policy"
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{ textDecoration: 'none', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', margin: 0 }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {link}
                    </motion.a>
                  ) : link === 'Privacy Policy' ? (
                    <motion.a
                      href="/privacy-policy"
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{ textDecoration: 'none', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', margin: 0 }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {link}
                    </motion.a>
                  ) : (
                    <motion.button
                      onClick={() => setActiveLegal(link)}
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textDecoration: 'none', fontSize: 13.5, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {link}
                    </motion.button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="footer-col-contact"
          >
            <FooterHeading>Contact</FooterHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { icon: Phone, val: '+91 70323 62358', href: 'tel:+917032362358' },
                { icon: Mail, val: 'support@klanvision.com', href: 'mailto:support@klanvision.com' },
                { icon: MapPin, val: 'Anantapur, Andhra Pradesh, India' },
              ].map(c => (
                <div key={c.val} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Icon badge */}
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,107,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', flexShrink: 0 }}>
                    <c.icon size={16} />
                  </div>
                  {c.href ? (
                    <motion.a
                      href={c.href}
                      className="footer-link"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 1.2, x: 10 }}
                      style={{
                        color: '#9CA3AF', fontSize: 13.5, lineHeight: 1.55,
                        paddingTop: 6, textDecoration: 'none', transition: 'color 0.2s',
                        display: 'flex', alignItems: 'center', gap: 8
                      }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {c.val}
                    </motion.a>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      style={{
                        color: '#9CA3AF', fontSize: 13.5, lineHeight: 1.55,
                        paddingTop: 6, display: 'flex', alignItems: 'center', gap: 8
                      }}
                    >
                      <span style={{ fontSize: 10, color: '#FF6B35', opacity: 0, transition: 'opacity 0.2s' }} className="link-dot">▶</span>
                      {c.val}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Horizontal divider above the bottom bar */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

        {/* Bottom Bar – copyright + back-to-top button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#6B7280', fontSize: 13.5 }}>© 2025 Klanvision Company. All rights reserved.</p>
          {/* Back to top – scrolls to page top smoothly */}
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6B7280', fontSize: 13.5, display: 'flex', alignItems: 'center',
              gap: 6, fontFamily: 'sans-serif', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FF6B35')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
          >
            Back to top ↑
          </motion.button>
        </div>
      </div>

      {/* Footer-specific hover styles and responsive grid breakpoints */}
      <style>{`
        .footer-link:hover { color: #FF6B35 !important; }
        .footer-link:hover .link-dot { opacity: 1 !important; }
        
        @media (max-width: 1024px) { 
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; } 
        }
        
        @media (max-width: 640px) { 
          .footer-grid { 
            grid-template-columns: 1fr 1fr !important; 
            gap: 32px 16px !important; 
            padding: 48px 0 32px !important;
          }
          .footer-col-brand { grid-column: span 2; margin-bottom: 8px; }
          .footer-col-contact { grid-column: span 2; margin-top: 8px; }
          .footer-tagline { font-size: 13px !important; }
          .footer-socials { gap: 8px !important; }
          .footer-socials a { width: 34px !important; height: 34px !important; }
          .footer-link { font-size: 12px !important; }
          footer h4 { font-size: 13px !important; }
        }
      `}</style>
      {/* Legal Modal Overlay */}
      <AnimatePresence>
        {activeLegal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setActiveLegal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', width: '100%', maxWidth: 650, borderRadius: 24, overflow: 'hidden', position: 'relative', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-main)' }}
              onClick={e => e.stopPropagation()}
            >

              {/* Header */}
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-soft)' }}>

                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{activeLegal}</h3>

                <button
                  onClick={() => setActiveLegal(null)}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
                >

                  <X size={20} />
                </button>
              </div>
              {/* Body */}
              <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
                {legalContent[activeLegal].content}
              </div>
              {/* Footer */}
              <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border-main)', textAlign: 'right', background: 'var(--bg-surface-soft)' }}>
                <button onClick={() => setActiveLegal(null)} className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>Close</button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
