import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, 
  Send, Sparkles, CheckCircle2, DollarSign, HelpCircle, Plus, Minus
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function ContactPage() {
  useSEO({
    title: 'Consultation Booking & Contact Details | Klanvision',
    description: 'Book a professional technology consultation with Klanvision. Send design inquiries, budget estimates, and primary development goals.',
    keywords: 'Contact, Book Consultation, IT Estimate, Service Quote, Klanvision Contact Office',
    canonical: '/contact',
  });

  const [activeForm, setActiveForm] = useState('consult'); // 'consult' or 'general'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: 'Under $10k',
    objective: 'Web Development',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);

  const budgetOptions = ['Under $10k', '$10k - $30k', '$30k - $80k', '$80k+'];
  const objectiveOptions = ['Web Development', 'Mobile App Dev', 'Cloud & DevOps', 'Cybersecurity Audit', 'AI Integration', 'IT Advisory'];

  const handleInputChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectOption = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isConsult = activeForm === 'consult';
      const bodyPayload = {
        "Request Type": isConsult ? 'Strategic Consultation Request' : 'General Business Inquiry',
        "Client Name": form.name,
        "Business Email": form.email,
        "Phone Number": form.phone,
        ...(isConsult && {
          "Company Name": form.company,
          "Project Budget": form.budget,
          "Primary Objective": form.objective,
        }),
        "Requirements": form.message,
        _subject: `💎 Contact Request (${isConsult ? 'Consult' : 'Inquiry'}) - ${form.name}`,
        _template: 'table',
        _captcha: 'false',
      };

      const response = await fetch('https://formsubmit.co/ajax/sunnyok1433@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          budget: 'Under $10k',
          objective: 'Web Development',
          message: ''
        });
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const contactFaq = [
    { q: 'Is the first consultation request free?', a: 'Yes, the first analysis session is completely free. We will review your goals and share a draft specifications roadmap with you.' },
    { q: 'Can we sign an NDA before discussing specifications?', a: 'Absolutely. We respect corporate intellectual property. Contact our team, and we will send a standard Mutual NDA for execution.' },
    { q: 'How fast will someone respond to my request?', a: 'Our solutions architects review requests daily. You will receive an initial email feedback within 24 operational hours.' }
  ];

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      
      {/* ── Contact Hero ────────────────────────────────────────── */}
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
              <Sparkles size={14} /> CONNECT IN REAL-TIME
            </div>
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 64px)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em',
              marginBottom: 20, 
              color: 'var(--text-main)' 
            }}>
              Let’s Construct Your Next <span className="gradient-text">Innovation</span>
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: 'clamp(15px, 2.5vw, 19px)', 
              maxWidth: 650, 
              margin: '0 auto', 
              lineHeight: 1.6 
            }}>
              Book a strategic technology consultation or drop us an inquiry. Our software architects will evaluate your objectives and reply within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Layout Section ─────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
            
            {/* Left Column: Office Coordinates & Mock Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Info Card */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 36, borderRadius: 24, boxShadow: 'var(--card-shadow)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={22} style={{ color: 'var(--primary-purple)' }} /> Headquarters Info
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { icon: MapPin, title: 'Corporate Address', value: 'Anantapur, Andhra Pradesh, India' },
                    { icon: Phone, title: 'Contact Phone', value: '+91 70323 62358' },
                    { icon: Mail, title: 'Inquiry Email', value: 'support@klanvision.com' },
                    { icon: Clock, title: 'Business Hours', value: '9:00 AM - 6:00 PM IST (Mon - Sat)' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-purple)', flexShrink: 0 }}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>{item.title}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stylized CSS/SVG Map Mockup */}
              <div style={{ 
                height: 240, 
                borderRadius: 24, 
                border: '1px solid var(--border-main)', 
                background: 'var(--bg-surface)',
                boxShadow: 'var(--card-shadow)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* SVG Vector Map Mockup */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--text-main)" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path d="M 50,50 C 150,50 150,150 250,150 S 350,50 450,150" fill="none" stroke="var(--primary-purple)" strokeWidth="1.5" strokeDasharray="5,5" />
                </svg>

                {/* Pulsing HQ Pin */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 20, height: 20 }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary-purple)' }} />
                    <motion.div 
                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--primary-purple)' }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', padding: '6px 12px', borderRadius: 8, marginTop: 8, color: 'var(--text-main)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    Klanvision HQ, AP
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Interaction Form Container */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 40, borderRadius: 24, boxShadow: 'var(--card-shadow)' }}>
              
              {/* Form Category Selector */}
              <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border-main)', paddingBottom: 20, marginBottom: 30 }}>
                <button
                  type="button"
                  onClick={() => { setActiveForm('consult'); setSubmitted(false); setError(''); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeForm === 'consult' ? 'rgba(124,58,237,0.08)' : 'transparent',
                    color: activeForm === 'consult' ? 'var(--primary-purple)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  Consultation Form
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveForm('general'); setSubmitted(false); setError(''); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeForm === 'general' ? 'rgba(124,58,237,0.08)' : 'transparent',
                    color: activeForm === 'general' ? 'var(--primary-purple)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  General Inquiry
                </button>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '40px 0' }}
                  >
                    <CheckCircle2 size={56} style={{ color: '#10B981', margin: '0 auto 20px' }} />
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Thank You!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, maxWidth: 350, margin: '0 auto' }}>
                      Your strategic specification request was sent successfully. Our solutions architects will reach out within 24 operational hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key={activeForm}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                  >
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid var(--border-main)', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', outline: 'none', fontSize: 14 }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="mobile-column">
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="john@company.com"
                          value={form.email}
                          onChange={handleInputChange}
                          style={{ width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid var(--border-main)', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', outline: 'none', fontSize: 14 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          required
                          placeholder="+91 99999 99999"
                          value={form.phone}
                          onChange={handleInputChange}
                          style={{ width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid var(--border-main)', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', outline: 'none', fontSize: 14 }}
                        />
                      </div>
                    </div>

                    {activeForm === 'consult' && (
                      <>
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Company Name</label>
                          <input
                            type="text"
                            name="company"
                            placeholder="Acme Corp"
                            value={form.company}
                            onChange={handleInputChange}
                            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid var(--border-main)', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', outline: 'none', fontSize: 14 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Estimated Project Budget</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {budgetOptions.map(b => (
                              <button
                                type="button"
                                key={b}
                                onClick={() => handleSelectOption('budget', b)}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: 8,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  background: form.budget === b ? 'var(--primary-purple)' : 'var(--bg-surface-soft)',
                                  color: form.budget === b ? 'white' : 'var(--text-main)',
                                  border: form.budget === b ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-main)'
                                }}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Primary Objective</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                            {objectiveOptions.map(o => (
                              <button
                                type="button"
                                key={o}
                                onClick={() => handleSelectOption('objective', o)}
                                style={{
                                  padding: '10px 8px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  transition: 'all 0.2s',
                                  background: form.objective === o ? 'var(--primary-purple)' : 'var(--bg-surface-soft)',
                                  color: form.objective === o ? 'white' : 'var(--text-main)',
                                  border: form.objective === o ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-main)'
                                }}
                              >
                                {o}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Message / Requirements</label>
                      <textarea
                        name="message"
                        required
                        placeholder="Detail your operational needs or timeline constraints..."
                        value={form.message}
                        onChange={handleInputChange}
                        style={{ width: '100%', height: 120, padding: 12, borderRadius: 10, border: '1.5px solid var(--border-main)', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', outline: 'none', resize: 'none', fontSize: 14 }}
                      />
                    </div>

                    {error && <span style={{ color: '#EF4444', fontSize: 13, fontWeight: 600 }}>{error}</span>}

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '14px',
                        background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: "'Poppins', sans-serif",
                        borderRadius: 10,
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 12px rgba(124,58,237,0.2)'
                      }}
                    >
                      {loading ? 'Submitting Details...' : (
                        <>
                          Submit Consultation Request <Send size={14} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-main)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="accent-bar" />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
              Onboarding <span className="gradient-text">FAQ</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Quick answers about client registration, NDA safety, and project scopes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {contactFaq.map((faq, idx) => (
              <div 
                key={idx}
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                style={{
                  background: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-main)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{faq.q}</span>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {faqOpen === idx ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: faqOpen === idx ? 'auto' : 0, opacity: faqOpen === idx ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border-main)', paddingTop: 16 }}>
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive columns helper style */}
      <style>{`
        @media (max-width: 480px) {
          .mobile-column { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
}
