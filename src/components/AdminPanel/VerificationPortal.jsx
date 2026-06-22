import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Award, Calendar, User, Search, RefreshCw } from 'lucide-react';
import { api } from '../../utils/api';
import { useSEO } from '../../hooks/useSEO';

export default function VerificationPortal({ certificateNumber }) {
  const [certId, setCertId] = useState(certificateNumber || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useSEO({
    title: data
      ? `Verified Certificate: ${data.name} - ${data.role} | Klanvision`
      : (error ? 'Invalid Certificate - Klanvision' : 'Certificate Verification Portal - Klanvision'),
    description: data
      ? `Verify ${data.name}'s successful completion of ${data.domain} internship at Klanvision. Certificate Number: ${data.certificate_number || data.certificateNumber}.`
      : 'Verify your Klanvision internship completion certificates online. Instant credential validation powered by digital signatures.',
    canonical: certificateNumber ? `/verify/${certificateNumber}` : '/verify',
  });

  const verify = async (idToVerify) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await api.verifyCertificate(idToVerify);
      if (res.verified) {
        setData(res.certificate);
      } else {
        setError('Certificate invalid or not found');
      }
    } catch (err) {
      setError(err.message || 'Certificate verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateNumber) {
      verify(certificateNumber);
    }
  }, [certificateNumber]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'Outfit, sans-serif',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background grid and flares */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(99, 102, 241, 0.15)', filter: 'blur(100px)', borderRadius: '50%', top: '10%', left: '10%', zIndex: 0 }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(236, 72, 153, 0.1)', filter: 'blur(120px)', borderRadius: '50%', bottom: '10%', right: '10%', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40, zIndex: 1 }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 20px',
          borderRadius: 30,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 16
        }}>
          <img src="/logo.png" alt="Logo" style={{ height: 28, width: 'auto' }} />
          <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '2px', color: '#6366F1' }}>KLANVISION SECURE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, background: 'linear-gradient(to right, #FFFFFF, #CBD5E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>
          Certificate Verification Portal
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Instant credential validation powered by digital signatures.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: 600,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 32,
          padding: '32px 40px',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
          zIndex: 1
        }}
      >
        {/* Verification Input (Optional search if none specified) */}
        {!certificateNumber && (
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Enter Certificate Number</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value.toUpperCase())}
                  placeholder="e.g. KVI-2026-000001"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    outline: 'none',
                    fontSize: 15,
                    fontWeight: 700
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && verify(certId)}
                />
              </div>
              <button
                onClick={() => verify(certId)}
                disabled={loading}
                style={{
                  padding: '0 24px',
                  borderRadius: 16,
                  background: '#6366F1',
                  color: 'white',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : 'VERIFY'}
              </button>
            </div>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366F1', marginBottom: 16 }}
            />
            <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 700 }}>Retrieving secure database registry...</p>
          </div>
        )}

        {/* Results */}
        {!loading && data && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: 20, borderRadius: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#10B981' }}>Certificate Verified ✅</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Secure record matches administrative log.</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <img 
                src={data.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1E293B&color=fff&size=96`} 
                style={{ width: 96, height: 96, borderRadius: 24, border: '2px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} 
                alt="Candidate Portrait"
              />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: 'white', margin: 0 }}>{data.name}</h3>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#6366F1', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4, display: 'inline-block' }}>{data.candidate_id || data.candidateId}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Candidate Name</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: 'white' }}>{data.name}</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Candidate ID</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>{data.candidate_id || data.candidateId}</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Internship Role</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: 'white' }}>{data.role}</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Domain</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#6366F1' }}>{data.domain}</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: 'white' }}>{data.start_date || data.startDate} – {data.end_date || data.endDate}</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificate Date</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: 'white' }}>{data.certificate_date || data.certificateDate}</div>
              </div>
              <div style={{ display: 'flex', paddingBottom: 12 }}>
                <div style={{ width: '40%', fontSize: 13, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificate Code</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 900, color: '#EC4899', letterSpacing: '1px' }}>{data.certificate_number || data.certificateNumber}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error / Not Found */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifycontent: 'center', color: '#EF4444', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={36} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 8 }}>Certificate Not Found ❌</h3>
            <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.5, maxWidth: 360, margin: '0 auto 24px' }}>
              The certificate ID you are attempting to verify does not exist in our secure digital registry or has been revoked.
            </p>
            {certificateNumber && (
              <button
                onClick={() => window.location.href = '/verify'}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Search Another Certificate
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
