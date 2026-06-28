import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, Briefcase, GraduationCap,
  Link, Upload, CheckCircle, ShieldCheck, ChevronLeft, UserPlus, Eye, EyeOff
} from 'lucide-react';

export default function CandidateRegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', dob: '', gender: '',
    qualification: '', experience: '', skills: '',
    preferredRoles: '', workPreference: '',
    linkedin: '', portfolio: ''
  });
  const [resume, setResume] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('phone', form.phone);
      fd.append('dob', form.dob);
      fd.append('gender', form.gender);
      fd.append('qualification', form.qualification);
      fd.append('experience', form.experience);
      fd.append('skills', form.skills);
      fd.append('linkedin', form.linkedin);
      fd.append('portfolio', form.portfolio);
      if (resume) fd.append('resume', resume);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/candidates/register`, {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const msg = await res.text();
        setError(msg || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ─────────────────────────────────────── */
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
        {[...Array(30)].map((_, i) => (
          <motion.div key={i}
            initial={{ y: -50, x: Math.random() * 100 + 'vw', opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', x: (Math.random() * 100 - 50) + 'vw', rotate: [0, 360, 720] }}
            transition={{ duration: Math.random() * 3 + 4, Infinity, delay: Math.random() * 4, ease: 'linear' }}
            style={{ position: 'absolute', width: 8, height: 8, background: ['#7C3AED', '#FF6B35', '#10B981', '#EC4899', '#3B82F6'][i % 5], borderRadius: i % 2 === 0 ? '50%' : 2, zIndex: 1 }}
          />
        ))}

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}
          style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '60px 48px', background: 'var(--bg-surface)', borderRadius: 40, boxShadow: '0 30px 70px rgba(0,0,0,0.12)', position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 15px 30px rgba(124,58,237,0.35)' }}>
            <CheckCircle size={50} color="white" />
          </motion.div>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12, color: '#111827' }}>
            Welcome to <span className="gradient-text">Klanvision!</span>
          </h2>
          <p style={{ color: '#6B7280', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Your candidate profile has been created successfully. Our talent team will review your profile and reach out when a suitable opportunity arises.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <RouterLink to="/careers" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', padding: '16px 32px' }}>
              Browse Open Positions
            </RouterLink>
            <RouterLink to="/" style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Back to Homepage
            </RouterLink>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Registration Form ──────────────────────────────────── */
  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 40px',
    border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14,
    fontFamily: 'inherit', outline: 'none', background: '#FAFAFA',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#4B5563', marginBottom: 7 };
  const iconWrap = { position: 'relative' };
  const iconPos = { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', paddingBottom: 80 }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #120F17 0%, #1F2937 100%)', color: 'white', padding: '90px 0 70px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <RouterLink to="/careers" style={{ color: '#A855F7', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700, marginBottom: 20, letterSpacing: '0.5px' }}>
              <ChevronLeft size={15} /> BACK TO CAREERS
            </RouterLink>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={26} color="white" />
              </div>
              <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, margin: 0 }}>
                Create Your <span className="gradient-text">Candidate Profile</span>
              </h1>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 16, maxWidth: 580, lineHeight: 1.6 }}>
              Register once and get discovered by our team. We'll match you with roles that fit your skills and preferences — no need to apply separately.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="container" style={{ marginTop: -40, position: 'relative', zIndex: 3 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ maxWidth: 820, margin: '0 auto', background: 'var(--bg-surface)', padding: '44px 40px', borderRadius: 32, boxShadow: '0 15px 50px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6' }}>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', marginBottom: 28, color: '#DC2626', fontSize: 14, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 28px' }} className="apply-form">

            {/* ── Section: Account ─────────────────────── */}
            <div style={{ gridColumn: '1/-1', marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={19} color="#7C3AED" /> Account Details
              </h3>
              <div style={{ height: 2, width: 40, background: '#7C3AED', marginTop: 6, borderRadius: 10 }} />
            </div>

            {/* Email */}
            <div className="form-group">
              <label style={labelStyle}>Email Address *</label>
              <div style={iconWrap}>
                <Mail size={15} style={iconPos} />
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label style={labelStyle}>Phone Number *</label>
              <div style={iconWrap}>
                <Phone size={15} style={iconPos} />
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label style={labelStyle}>Password *</label>
              <div style={{ ...iconWrap }}>
                <ShieldCheck size={15} style={iconPos} />
                <input type={showPass ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label style={labelStyle}>Confirm Password *</label>
              <div style={iconWrap}>
                <ShieldCheck size={15} style={iconPos} />
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* ── Section: Personal ────────────────────── */}
            <div style={{ gridColumn: '1/-1', marginTop: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={19} color="#7C3AED" /> Personal Information
              </h3>
              <div style={{ height: 2, width: 40, background: '#7C3AED', marginTop: 6, borderRadius: 10 }} />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label style={labelStyle}>Full Name *</label>
              <div style={iconWrap}>
                <User size={15} style={iconPos} />
                <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
              </div>
            </div>

            {/* DOB */}
            <div className="form-group">
              <label style={labelStyle}>Date of Birth</label>
              <div style={iconWrap}>
                <Calendar size={15} style={iconPos} />
                <input type="date" name="dob" value={form.dob} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Gender */}
            <div className="form-group">
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 14 }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Work Preference */}
            <div className="form-group">
              <label style={labelStyle}>Work Preference</label>
              <select name="workPreference" value={form.workPreference} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 14 }}>
                <option value="">Select Preference</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* ── Section: Professional ────────────────── */}
            <div style={{ gridColumn: '1/-1', marginTop: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Briefcase size={19} color="#7C3AED" /> Professional Details
              </h3>
              <div style={{ height: 2, width: 40, background: '#7C3AED', marginTop: 6, borderRadius: 10 }} />
            </div>

            {/* Qualification */}
            <div className="form-group">
              <label style={labelStyle}>Highest Qualification *</label>
              <div style={iconWrap}>
                <GraduationCap size={15} style={iconPos} />
                <input type="text" name="qualification" required value={form.qualification} onChange={handleChange} placeholder="e.g. B.Tech in Computer Science" style={inputStyle} />
              </div>
            </div>

            {/* Experience */}
            <div className="form-group">
              <label style={labelStyle}>Years of Experience *</label>
              <select name="experience" required value={form.experience} onChange={handleChange} style={{ ...inputStyle, paddingLeft: 14 }}>
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher (0 years)</option>
                <option value="1-2 Years">1–2 Years</option>
                <option value="3-5 Years">3–5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Skills */}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Key Skills *</label>
              <textarea name="skills" required value={form.skills} onChange={handleChange}
                placeholder="e.g. React, Node.js, Spring Boot, Python, AWS..."
                style={{ ...inputStyle, paddingLeft: 14, minHeight: 75, resize: 'none' }} />
            </div>

            {/* Preferred Roles */}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Preferred Job Roles</label>
              <textarea name="preferredRoles" value={form.preferredRoles} onChange={handleChange}
                placeholder="e.g. Full Stack Developer, DevOps Engineer, Data Analyst..."
                style={{ ...inputStyle, paddingLeft: 14, minHeight: 60, resize: 'none' }} />
            </div>

            {/* LinkedIn */}
            <div className="form-group">
              <label style={labelStyle}>LinkedIn Profile URL</label>
              <div style={iconWrap}>
                <Link size={15} style={iconPos} />
                <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." style={inputStyle} />
              </div>
            </div>

            {/* Portfolio */}
            <div className="form-group">
              <label style={labelStyle}>Portfolio / GitHub URL</label>
              <div style={iconWrap}>
                <Link size={15} style={iconPos} />
                <input type="url" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://github.com/..." style={inputStyle} />
              </div>
            </div>

            {/* Resume Upload */}
            <div style={{ gridColumn: '1/-1', marginTop: 8 }}>
              <label style={labelStyle}>Upload Resume (PDF / DOCX) — Optional</label>
              <div
                style={{ border: `2px dashed ${resume ? '#10B981' : '#E5E7EB'}`, borderRadius: 14, padding: '28px 20px', textAlign: 'center', background: '#F9FAFB', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onClick={() => document.getElementById('resume-file')?.click()}
                onMouseOver={e => e.currentTarget.style.borderColor = '#7C3AED'}
                onMouseOut={e => e.currentTarget.style.borderColor = resume ? '#10B981' : '#E5E7EB'}
              >
                <input id="resume-file" type="file" accept=".pdf,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: resume ? '#10B98115' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: resume ? '#10B981' : '#9CA3AF' }}>
                  <Upload size={22} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: 0 }}>
                  {resume ? resume.name : 'Click to upload your resume'}
                </p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>PDF or DOCX — max 5 MB</p>
              </div>
            </div>

            {/* Submit */}
            <div style={{ gridColumn: '1/-1', marginTop: 20 }}>
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn-primary"
                style={{ width: '100%', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 16, borderRadius: 14 }}>
                {loading ? 'Creating Profile...' : <><UserPlus size={18} /> Create My Candidate Profile</>}
              </motion.button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, color: '#9CA3AF', fontSize: 12 }}>
                <ShieldCheck size={13} /> Your data is secure and will never be shared without consent.
              </div>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', marginTop: 18 }}>
                Already registered?{' '}
                <RouterLink to="/candidate-login" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>
                  Login to your profile →
                </RouterLink>
              </p>
            </div>
          </form>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 640px) { .apply-form { grid-template-columns: 1fr !important; } }
        input:focus, select:focus, textarea:focus { border-color: #7C3AED !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
      `}</style>
    </div>
  );
}

