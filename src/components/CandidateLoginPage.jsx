import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, ShieldCheck, ChevronLeft, LogIn, Eye, EyeOff, 
  CheckCircle2, AlertCircle, RefreshCcw, UserCircle 
} from 'lucide-react';

export default function CandidateLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/candidates/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        // Store token/user data
        localStorage.setItem('candidateToken', data.token);
        localStorage.setItem('candidateUser', JSON.stringify(data.candidate));
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/candidate-dashboard'); 
        }, 2000);
      } else {
        const msg = await res.text();
        setError(msg || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection refused. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 44px',
    border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 15,
    fontFamily: 'inherit', outline: 'none', background: '#FAFAFA',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: -150, right: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08), transparent)', pointerEvents: 'none' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 440, width: '100%', position: 'relative', zIndex: 10 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <RouterLink to="/careers" style={{ color: '#6366F1', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 13, fontWeight: 700, marginBottom: 24, letterSpacing: '0.5px' }}>
            <ChevronLeft size={16} /> BACK TO CAREERS
          </RouterLink>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #6366F1, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}
          >
            <UserCircle size={36} color="white" />
          </motion.div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: 0 }}>
            Candidate <span className="gradient-text">Portal</span>
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15, marginTop: 10, fontWeight: 500 }}>Welcome back Access your career dashboard.</p>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: 40, borderRadius: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6' }}>
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '20px 0' }}
              >
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#10B98120', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>Login Successful!</h3>
                <p style={{ color: '#6B7280', marginTop: 8 }}>Redirecting you to the careers portal...</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', color: '#DC2626', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4B5563', marginBottom: 8 }}>EMAIL ADDRESS</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input 
                      type="email" name="email" required value={form.email} onChange={handleChange} 
                      placeholder="you@example.com" style={inputStyle} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#4B5563' }}>PASSWORD</label>
                    <RouterLink to="/forgot-password" style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>Forgot Password?</RouterLink>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input 
                      type={showPass ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange} 
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight: 48 }} 
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <input type="checkbox" id="remember" style={{ width: 16, height: 16, borderRadius: 4, cursor: 'pointer' }} />
                  <label htmlFor="remember" style={{ fontSize: 13, color: '#6B7280', cursor: 'pointer', fontWeight: 500 }}>Remember me on this device</label>
                </div>

                <motion.button 
                  type="submit" disabled={loading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="btn-primary"
                  style={{ padding: '16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 16, fontWeight: 800, width: '100%' }}
                >
                  {loading ? <RefreshCcw className="animate-spin" size={20} /> : <><LogIn size={20} /> Access Dashboard</>}
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: 14, color: '#6B7280', marginTop: 10 }}>
                  New to Klanvision?{' '}
                  <RouterLink to="/candidate-register" style={{ color: '#6366F1', fontWeight: 700, textDecoration: 'none' }}>Create Account</RouterLink>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#9CA3AF' }}>
          <ShieldCheck size={16} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>SECURE DATA ENCRYPTION ENABLED</span>
        </div>
      </motion.div>

      <style>{`
        input:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; background: white !important; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

