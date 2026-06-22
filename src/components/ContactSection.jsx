// ============================================================
// ContactSection.tsx
// Contact form + company info section for Klanvision.
// Left column: connect card with contact details + support image.
// Right column: form with name, phone, email, message fields.
// Form submits via FormSubmit (no server/API key needed).
// Shows success state with animation after submission.
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

// ── TypingText Component ─────────────────────────────────────
// Animates text character by character for a typing effect.
function TypingText({ text, delay = 0 }) {
  const characters = (text || "").split("");

  return (
    <>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: delay + index * 0.03 }}
          viewport={{ once: true }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

export default function ContactSection() {
  // Form field values
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);  // show success state
  const [loading, setLoading]     = useState(false);  // disable button while sending
  const [submitError, setSubmitError] = useState('');

  // Generic change handler for all text inputs and textarea
  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  // handleSubmit – POSTs the form to FormSubmit's AJAX endpoint.
  // On success sets submitted=true (shows thank-you screen),
  // on failure shows an alert with the error message.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    try {
      // 1. Send Email Notification via FormSubmit
      const response = await fetch('https://formsubmit.co/ajax/sunnyok1433@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          "Client Name": form.name,
          "Business Email": form.email,
          "Phone Number": form.phone,
          "Project Requirements": form.message,
          "Company Banner": "https://www.klanvision.com/logo.png", // For branding in email
          _subject: `💎 New Strategic Consultation Request - ${form.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });


      const result = await response.json();

      if (result.success) {
        setSubmitted(true); // show thank-you screen directly
      } else {
        setSubmitError('Something went wrong. Please try again!');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  return (
    // Section – white background with decorative blobs
    <section id="contact" style={{ background: 'var(--bg-main)', padding: '80px 0', position: 'relative', overflow: 'hidden', transition: 'background 0.3s ease' }}>

      {/* Decorative radial gradient blobs */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.08), transparent)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative' }}>

        {/* Section Header – accent bar + heading + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div className="accent-bar" />
          <h2 className="font-bold tracking-tight text-[var(--text-main)]" style={{ marginBottom: 16 }}>
            Connect with Our <span className="gradient-text">Team of Experts</span>
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Collaborate with our skilled team to bring your project ideas into reality, guided by a passion for excellence and innovation.
          </p>

        </motion.div>

        {/* Two-column layout: left = info, right = form */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">

          {/* Left – Contact info card + support image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Connect card – icon + heading + contact detail rows */}
            <div className="card" style={{ 
              padding: '32px',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--border-main)'
            }}>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
                {/* Section icon */}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20, color: 'white' }}>
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 6, color: 'var(--text-main)' }}>Looking to connect?</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>Looking to connect with a team of talented professionals? Please visit our contact form →</p>
                </div>

              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border-main)', marginBottom: 24 }} />


              {/* Contact detail rows – phone, email, location */}
              {[
                { icon: Phone,  label: 'Phone',    val: '+91 70323 62358'                    },
                { icon: Mail,   label: 'Email',    val: 'support@klanvision.com'             },
                { icon: MapPin, label: 'Location', val: 'Anantapur, Andhra Pradesh, India'   },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  {/* Icon badge */}
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#4F46E5' }}>
                    <c.icon size={20} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{c.label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2, color: 'var(--text-main)' }}>{c.val}</div>
                  </div>

                </div>
              ))}
            </div>

            {/* Support visual – friendly representative with subtle animations */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              style={{ 
                borderRadius: 24, 
                overflow: 'hidden', 
                position: 'relative', 
                height: 280, 
                boxShadow: '0 20px 40px rgba(79,70,229,0.15)',
                background: '#1F2937'
              }}
            >
              {/* Expert Support Rep – Animated to simulate presence */}
              <motion.img 
                src="/support_rep.png" 
                alt="24/7 Expert Support Representative" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                animate={{ 
                  y: [0, -4, 0],
                  rotate: [0, 0.4, -0.4, 0],
                  scale: [1, 1.01, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Sophisticated gradient overlays */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(79,70,229,0.85), transparent 70%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(124,58,237,0.2), transparent)' }} />

              {/* Live Status Badge */}
              <div style={{ 
                position: 'absolute', top: 20, right: 20, 
                display: 'flex', alignItems: 'center', gap: 8, 
                background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(10px)', 
                padding: '6px 14px', borderRadius: 30, border: '1px solid rgba(16,185,129,0.4)' 
              }}>
                <div style={{ 
                  width: 8, height: 8, borderRadius: '50%', background: '#10B981', 
                  boxShadow: '0 0 12px rgba(16,185,129,0.8)' 
                }} className="pulse-slow" />
                <span style={{ color: 'white', fontSize: 11, fontWeight: 800, letterSpacing: '0.8px' }}>ONLINE</span>
              </div>

              {/* Caption overlaid on the image */}
              <div style={{ position: 'absolute', bottom: 24, left: 24, color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                   <div style={{ width: 24, height: 2, background: 'white', borderRadius: 1 }} />
                   <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, letterSpacing: '1.2px' }}>EXPERT ASSISTANCE</span>
                </div>
                <h3 style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: 22, margin: 0, lineHeight: 1.2 }}>24/7 Premium Support</h3>
                <p style={{ fontSize: 13.5, opacity: 0.85, marginTop: 6, maxWidth: 240, lineHeight: 1.5 }}>
                  Always here to ensure your business goals stay on track with expert guidance.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right – Contact Form */}
           <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ height: '100%' }}
          >
            <div className="card" style={{ 
              padding: '40px 40px 10px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--border-main)'
            }}>

              {submitted ? (
                // Success state – shown after successful form submission
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                  style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <div style={{ position: 'relative', marginBottom: 32 }}>
                    {/* Animated Brand Pulse */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 120, height: 120, borderRadius: '50%', background: 'rgba(79,70,229,0.1)' }}
                    />
                    <div style={{ position: 'relative', width: 90, height: 90, borderRadius: 24, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(79,70,229,0.3)' }}>
                      <span style={{ color: 'white', fontWeight: 900, fontSize: 36 }}>K</span>
                    </div>
                    {/* Floating check badge */}
                    <motion.div 
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      style={{ position: 'absolute', bottom: -10, right: -10, width: 36, height: 36, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}
                    >
                      <CheckCircle size={20} color="white" />
                    </motion.div>
                  </div>

                  <motion.h3 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 32, marginBottom: 12, color: 'var(--text-main)' }}
                  >
                    Thanks for <span className="gradient-text">Contacting Us!</span>
                  </motion.h3>


                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                  >
                    <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6, maxWidth: 320 }}>
                      Your professional inquiry has been received and our team has been notified via <b>Email</b>.
                    </p>

                    <p style={{ color: '#4F46E5', fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>
                      WE WILL REACH OUT WITHIN 24 HOURS
                    </p>
                  </motion.div>

                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', message: '' }); }} 
                    style={{ 
                      marginTop: 40, background: '#F3F4F6', color: '#4B5563', 
                      padding: '12px 24px', borderRadius: 12, fontWeight: 700, 
                      fontSize: 14, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8
                    }}
                  >
                    <MessageSquare size={16} /> Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <h3 style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 12, lineHeight: 1.1 }}>
                    <TypingText text="Ready to " />
                    <span 
                      className="gradient-text" 
                      style={{ 
                        display: 'inline-block',
                        backgroundSize: '200% auto',
                        animation: 'shimmer-rtl 4s linear infinite',
                        backgroundImage: 'linear-gradient(270deg, #4F46E5, #7C3AED, #EC4899, #7C3AED, #4F46E5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <TypingText text="Ignite Your Next Project?" delay={0.3} />
                    </span>
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14.5, lineHeight: 1.6 }}>
                    <TypingText text="Fill out the form below and our experts will reach out to you within 24 hours." delay={1.2} />
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>

                    {/* Name field */}
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                      <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="form-input" />
                    </div>

                    {/* Phone field */}
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </span>
                      <input id="contact-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="form-input" />
                    </div>

                    {/* Email field */}
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </span>
                      <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required className="form-input" />
                    </div>

                    {/* Message textarea – fills remaining vertical space */}
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ position: 'absolute', left: 14, top: 14, pointerEvents: 'none' }}>
                        <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </span>
                      <textarea 
                        id="contact-message" name="message" value={form.message} onChange={handleChange} 
                        placeholder="Your Message" required className="form-input" 
                        style={{ flex: 1, minHeight: 120, resize: 'none' }} 
                      />
                    </div>

                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#F87171',
                          padding: '12px 16px',
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 700,
                          textAlign: 'center'
                        }}
                      >
                        {submitError}
                      </motion.div>
                    )}

                    {/* Submit button – positioned at the bottom */}
                    <motion.button
                      id="contact-submit"
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="btn-primary"
                      style={{ justifyContent: 'center', padding: '16px', fontSize: 16, marginTop: 10, opacity: loading ? 0.85 : 1 }}
                    >
                      {loading ? (
                        <>
                          <svg className="spin-slow" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin-slow 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit
                          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Keyframe and Responsive animations */}
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-slow { 
          0%, 100% { transform: scale(1); opacity: 1; } 
          50% { transform: scale(1.4); opacity: 0.6; } 
        }
        .pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }

        @media (max-width: 1024px) {
          #contact { padding: 64px 0 !important; }
          #contact .container { padding: 0 24px; }
        }
        @media (max-width: 768px) {
          #contact { padding: 56px 0 !important; }
          #contact h2 { font-size: 1.6rem !important; }
          #contact .grid { gap: 32px !important; }
        }
        @media (max-width: 480px) {
          #contact { padding: 48px 0 !important; }
          #contact h2 { font-size: 1.4rem !important; }
          #contact .card { padding: 24px 20px !important; border-radius: 16px !important; }
          #contact h3 { font-size: 16px !important; }
          #contact p { font-size: 13px !important; }
          #contact .btn-primary { padding: 14px !important; font-size: 14px !important; }
          #contact .form-input { font-size: 14px !important; padding: 10px 10px 10px 40px !important; }
          #contact textarea.form-input { padding-top: 14px !important; }
        }
      `}</style>
    </section>
  );
}
