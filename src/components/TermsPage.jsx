import { motion } from 'framer-motion';
import { ChevronLeft, Gavel, Scale, FileCheck, AlertCircle, CreditCard, Clock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function TermsPage() {
  useSEO({
    title: 'Terms & Conditions | Klanvision Legal Agreement',
    description: 'Read Klanvision\'s Terms and Conditions covering service delivery, client responsibilities, prohibited use, project timelines, ownership rights and payment terms.',
    keywords: 'terms and conditions, legal, Klanvision agreement, service terms, payment terms',
    canonical: '/terms',
  });
  const terms = [
    {
      icon: FileCheck,
      title: "Service Delivery",
      desc: "All services are delivered based on agreed scope, timelines, and pricing models established during the project planning phase."
    },
    {
      icon: Scale,
      title: "Client Responsibilities",
      desc: "Clients must provide accurate requirements, timely content, and necessary access to systems or data required for project execution."
    },
    {
      icon: AlertCircle,
      title: "Prohibited Use",
      desc: "Any misuse, unauthorized use, or illegal activities involving our website, services, or intellectual property is strictly prohibited."
    },
    {
      icon: Clock,
      title: "Project Timelines",
      desc: "Timelines depend on client feedback, approvals, and external dependencies. We strive for punctuality but rely on mutual collaboration."
    },
    {
      icon: Gavel,
      title: "Modification of Terms",
      desc: "Klanvision reserves the right to modify services, pricing, or these terms at any time to reflect changing business needs."
    },
    {
      icon: CreditCard,
      title: "Ownership & Payment",
      desc: "Full ownership of project deliverables is transferred to the client only after full payment has been successfully completed."
    }
  ];

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
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              Welcome to Klanvision. By accessing our website and using our services, you agree to the following terms and conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Grid */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {terms.map((term, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: '40px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)', display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                <term.icon size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>{term.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>{term.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 80, textAlign: 'center', borderTop: '1px solid var(--border-main)', paddingTop: 40 }}
        >
          <p style={{ color: '#9CA3AF', fontSize: 14, maxWidth: 600, margin: '0 auto' }}>
            These terms represent the entire agreement between the user and Klanvision regarding the use of this website and our services. For any inquiries, please contact our legal team.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
