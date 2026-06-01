import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, XCircle, RefreshCcw, Info } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function RefundPolicyPage() {
  useSEO({
    title: 'Cancellation & Refund Policy | Klanvision',
    description: 'Read Klanvision\'s Cancellation and Refund Policy. Understand our terms for project cancellation, refund eligibility, billing timelines, and approved refund processing.',
    keywords: 'refund policy, cancellation policy, Klanvision refund, billing terms',
    canonical: '/refund-policy',
  });
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
              Cancellation & <span className="gradient-text">Refund Policy</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              At Klanvision, we aim to maintain transparency, fairness, and clarity in all our engagements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          
          {/* Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: '40px', marginBottom: 40, border: '1px solid var(--border-main)', background: 'var(--bg-surface)' }}
          >
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0 }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
                  This policy outlines the terms for service cancellation and applicable refunds for our project-based and subscription services. We believe in clear communication and mutual respect for time and resources.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4.1 Cancellation Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
              style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <XCircle size={24} color="#EF4444" />
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>4.1 Cancellation Policy</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { title: 'Before Project Start', desc: 'Clients may cancel services prior to the official commencement. Advance payments will be reviewed terms.' },
                  { title: 'After Project Start', desc: 'Once requirements are approved and work begins, cancellation incurs charges based on work completed.' },
                  { title: 'During Development', desc: 'Billing will be calculated based on completed milestones or effort invested up to the cancellation date.' },
                  { title: 'Subscription Services', desc: 'Requires a minimum of 30 days’ prior written notice. Services continue during the notice period.' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 4.2 Refund Policy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
              style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <RefreshCcw size={24} color="#10B981" />
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>4.2 Refund Policy</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { title: 'Before Commencement', desc: 'Clients are eligible for a full refund if requested before the project begins.' },
                  { title: 'After Initiation', desc: 'Refunds processed after deducting charges for completed work and administrative costs.' },
                  { title: 'Post-Delivery', desc: 'No refunds will be issued once the project has been delivered and approved by the client.' },
                  { title: 'Managed Services', desc: 'Subscriptions and support plans are non-refundable once the billing cycle has started.' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Additional Terms & Important Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}
          >
            <div className="card" style={{ padding: '40px', background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)' }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <Info size={24} color="var(--primary-purple)" />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Additional Terms & Conditions</h3>
              </div>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px 32px', listStyle: 'none', padding: 0 }}>
                {[
                  'Third-party costs (licenses, tools, domains) are non-refundable.',
                  'All outstanding payments must be settled before project closure.',
                  'Cancellation is valid only after written confirmation from Klanvision.',
                  'Refund requests are subject to internal review and approval.',
                  'Approved refunds are processed within 7–10 business days.',
                  'All requests must be submitted via official email communication.'
                ].map((text, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                    <span style={{ fontWeight: 900, color: 'var(--primary-purple)' }}>•</span> {text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Help Footer */}
      <section className="container" style={{ textAlign: 'center', marginTop: 80 }}>
        <p style={{ color: '#9CA3AF', fontSize: 15 }}>
          If you have any questions regarding this policy, please contact us at <a href="mailto:support@klanvision.com" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>support@klanvision.com</a>
        </p>
      </section>
    </div>
  );
}
