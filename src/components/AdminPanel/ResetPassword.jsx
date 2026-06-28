import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../utils/api';
import { Lock, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    if (t) {
      setToken(t);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await api.resetPassword(token, password);
      setSuccess('Password reset successfully. You can now log in.');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Outfit, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: 450, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(40px)', padding: '48px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div whileHover={{ rotate: 15 }} style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #10B981, #34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}>
            <ShieldCheck size={32} />
          </motion.div>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: 'white', letterSpacing: '-1px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Reset Password
          </h2>
          <p style={{ color: '#94A3B8', marginTop: 8, fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>Enter your new security credentials</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#10B981', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{success}</div>
            <p style={{ color: '#94A3B8', fontSize: 14 }}>Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#CBD5E1', marginBottom: 12, letterSpacing: '1px' }}>NEW PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required disabled={!token || isLoading} />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#CBD5E1', marginBottom: 12, letterSpacing: '1px' }}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••••••" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required disabled={!token || isLoading} />
              </div>
            </div>

            {error && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button type="submit" disabled={!token || isLoading} style={{ padding: '20px 48px', borderRadius: 18, fontSize: 16, fontWeight: 900, minWidth: 240, background: 'linear-gradient(135deg, #6366F1, #A855F7)', color: 'white', border: 'none', cursor: (!token || isLoading) ? 'not-allowed' : 'pointer', opacity: (!token || isLoading) ? 0.7 : 1 }}>
                {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
