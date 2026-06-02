import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Upload, User, Mail, Phone, GraduationCap, Calendar, Briefcase, Link, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../utils/api';

export default function JobApplicationPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [form, setForm] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    gender: '',
    qualification: '',
    experience: '',
    skills: '',
    linkedin: '',
    portfolio: ''
  });
  const [resume, setResume] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get job title from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJobTitle(params.get('job') || 'General Application');
  }, []);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('jobTitle', jobTitle);
      fd.append('name', form.name);
      fd.append('dob', form.dob);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('gender', form.gender);
      fd.append('qualification', form.qualification);
      fd.append('experience', form.experience);
      fd.append('skills', form.skills);
      fd.append('linkedin', form.linkedin || '');
      fd.append('portfolio', form.portfolio || '');
      if (resume) fd.append('resume', resume);

      // --- EMAIL NOTIFICATION VIA FORMSUBMIT ---
      const emailFd = new FormData();
      emailFd.append('Job Role Applied', jobTitle);
      emailFd.append('Candidate Name', form.name);
      emailFd.append('Date of Birth', form.dob);
      emailFd.append('Email Address', form.email);
      emailFd.append('Phone Number', form.phone);
      emailFd.append('Gender', form.gender);
      emailFd.append('Highest Qualification', form.qualification);
      emailFd.append('Years of Experience', form.experience);
      emailFd.append('Key Skills', form.skills);
      if (form.linkedin) emailFd.append('LinkedIn Profile', form.linkedin);
      if (form.portfolio) emailFd.append('Portfolio / GitHub', form.portfolio);
      if (resume) emailFd.append('Resume Attachment', resume);
      
      // FormSubmit Configuration
      emailFd.append('_subject', `🚀 New Job Application: ${form.name} for ${jobTitle}`);
      emailFd.append('_captcha', 'false');
      emailFd.append('_template', 'table');

      try {
        await fetch('https://formsubmit.co/ajax/klanphs.solutions@gmail.com', {
          method: 'POST',
          body: emailFd
        });
      } catch (emailErr) {
        console.error('Email forwarding failed:', emailErr);
        // Continue to save to database even if email fails
      }

      // --- DATABASE SUBMISSION ---
      const res = await api.createApplication(fd);

      if (res.ok) {
        setSubmitted(true);
      } else {
        const msg = await res.text();
        setError(msg || 'Application submission failed. Please try again.');
      }
    } catch {
      setError('Could not connect to database server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
        {/* Firework Bursts */}
        {[...Array(6)].map((_, group) => (
          <div key={`firework-${group}`} style={{ position: 'absolute', top: `${Math.random() * 80}%`, left: `${Math.random() * 100}%` }}>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.5, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 150,
                  y: Math.sin((i * 30) * Math.PI / 180) * 150,
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: group * 0.8 }}
                style={{
                  position: 'absolute', width: 6, height: 6, borderRadius: '50%',
                  background: ['#7C3AED', '#FF6B35', '#10B981', '#EC4899', '#F59E0B'][i % 5],
                  boxShadow: '0 0 10px currentColor'
                }}
              />
            ))}
          </div>
        ))}

        {/* Confetti (Curly Paper) */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            initial={{ y: -50, x: Math.random() * 100 + 'vw', opacity: 1, rotate: 0 }}
            animate={{
              y: '110vh',
              x: (Math.random() * 100 - 50) + 'vw',
              rotate: [0, 180, 360, 540],
              skewX: [0, 20, 0, -20, 0]
            }}
            transition={{ duration: Math.random() * 3 + 4, repeat: Infinity, delay: Math.random() * 5, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 12 : 8,
              height: i % 2 === 0 ? 12 : 6,
              background: ['#7C3AED', '#FF6B35', '#10B981', '#EC4899', '#3B82F6'][i % 5],
              borderRadius: i % 4 === 0 ? '50%' : '2px',
              zIndex: 1,
              transformOrigin: 'center'
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={{ maxWidth: 550, width: '100%', textAlign: 'center', padding: '60px 48px', background: 'var(--bg-surface)', borderRadius: 40, boxShadow: 'var(--card-shadow)', position: 'relative', zIndex: 10, border: '1px solid var(--border-main)' }}
        >
          {/* Animated Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 15px 30px rgba(16,185,129,0.3)' }}
          >
            <CheckCircle size={50} color="white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, color: 'var(--text-main)', letterSpacing: '-0.5px' }}
          >
            Success <span className="gradient-text">Application Sent</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}
          >
            Thank you for applying for the <b style={{ color: 'var(--text-main)' }}>{jobTitle}</b> position at Klanvision. Your professional profile has been securely delivered to our recruitment team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <a href="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', padding: '16px 32px', fontSize: 15 }}>
              Return to Homepage
            </a>
            <a href="/careers" style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Browse other opportunities
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: 80 }}>

      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #120F17 0%, #1F2937 100%)', color: 'white', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <a href="/careers" style={{ color: '#A855F7', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
              <ChevronLeft size={16} /> BACK TO CAREERS
            </a>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 12 }}>
              Apply for <span className="gradient-text">{jobTitle}</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: 16, maxWidth: 600 }}>
              Take the first step towards a rewarding career at Klanvision. Fill out the details below carefully.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 800, margin: '0 auto', background: 'var(--bg-surface)', padding: '40px', borderRadius: 32, boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-main)' }}
        >
          {error && (
            <div style={{ gridColumn: '1 / -1', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', color: '#DC2626', fontSize: 14, fontWeight: 600 }}>
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 30px' }}
            className="apply-form"
          >

            {/* Personal Details Section */}
            <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={20} color="#7C3AED" /> Personal Information
              </h3>
              <div style={{ height: 2, width: 40, background: '#7C3AED', marginTop: 6, borderRadius: 10 }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Date of Birth *</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="date" name="dob" required value={form.dob} onChange={handleChange} className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Contact Number *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Gender *</label>
              <select name="gender" required value={form.gender} onChange={handleChange} className="form-input" style={{ appearance: 'none' }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Professional Details Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: 20, marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Briefcase size={20} color="#7C3AED" /> Professional Details
              </h3>
              <div style={{ height: 2, width: 40, background: '#7C3AED', marginTop: 6, borderRadius: 10 }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Highest Qualification *</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="text" name="qualification" required value={form.qualification} onChange={handleChange} placeholder="e.g. B.Tech in CSE" className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Years of Experience *</label>
              <select name="experience" required value={form.experience} onChange={handleChange} className="form-input">
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Key Skills *</label>
              <textarea name="skills" required value={form.skills} onChange={handleChange} placeholder="e.g. React, Node.js, AWS, Python..." className="form-input" style={{ minHeight: 80, resize: 'none' }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>LinkedIn Profile URL</label>
              <div style={{ position: 'relative' }}>
                <Link size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Portfolio / GitHub URL</label>
              <div style={{ position: 'relative' }}>
                <Link size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="url" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://github.com/..." className="form-input" style={{ paddingLeft: 40 }} />
              </div>
            </div>

            {/* Resume Upload Section */}
            <div style={{ gridColumn: '1 / -1', marginTop: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Upload Resume (PDF/DOCX) *</label>
              <div style={{
                border: '2px dashed var(--border-main)', borderRadius: 16, padding: '30px',
                textAlign: 'center', background: 'var(--bg-surface-soft)', cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderColor: resume ? '#10B981' : 'var(--border-main)'
              }}
                onClick={() => document.getElementById('resume-upload')?.click()}
                onMouseOver={e => (e.currentTarget.style.borderColor = '#7C3AED')}
                onMouseOut={e => (e.currentTarget.style.borderColor = resume ? '#10B981' : 'var(--border-main)')}
              >
                <input id="resume-upload" type="file" required accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: resume ? '#10B98115' : 'var(--bg-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
                  color: resume ? '#10B981' : '#9CA3AF'
                }}>
                  <Upload size={24} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                  {resume ? resume.name : 'Click to upload or drag and drop'}
                </p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Maximum file size 5MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-primary"
                style={{ width: '100%', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 16 }}
              >
                {loading ? (
                  <>Processing Application...</>
                ) : (
                  <>Submit Application <Send size={18} /></>
                )}
              </motion.button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, color: '#9CA3AF', fontSize: 12 }}>
                <ShieldCheck size={14} /> Your data is processed securely and will never be shared.
              </div>
            </div>
          </form>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .apply-form { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
