import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Award, Calendar, User, Search, Filter, Plus, 
  Trash2, Edit, Check, Eye, Download, Mail, RefreshCw, BarChart2, FileText, Settings, X, Info
} from 'lucide-react';
import { api } from '../../utils/api';

// --- Subviews of the Internship Module ---

// 1. Dashboard Subview
function DashboardView({ interns, certificates }) {
  const stats = {
    total: interns.length,
    active: interns.filter(i => i.status === 'Participating').length,
    completed: interns.filter(i => i.status === 'Completed').length,
    pending: interns.filter(i => i.status === 'Pending').length,
    rejected: interns.filter(i => i.status === 'Rejected').length,
    certificates: certificates.length,
    offers: interns.length, // generated automatically on creation
    recommendations: interns.filter(i => i.status === 'Completed').length // generated on completion
  };

  // Group by Domain
  const domainCounts = {};
  interns.forEach(i => {
    domainCounts[i.domain] = (domainCounts[i.domain] || 0) + 1;
  });

  // Calculate completion rate
  const eligibleForCompletion = stats.total - stats.pending - stats.rejected;
  const completionRate = eligibleForCompletion > 0 
    ? Math.round((stats.completed / eligibleForCompletion) * 100) 
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {[
          { title: 'Total Candidates', value: stats.total, color: '#6366F1', desc: 'All registered internship applicants' },
          { title: 'Active Interns', value: stats.active, color: '#3B82F6', desc: 'Currently participating in programs' },
          { title: 'Completed Internships', value: stats.completed, color: '#10B981', desc: 'Successfully finished & verified' },
          { title: 'Pending Interns', value: stats.pending, color: '#F59E0B', desc: 'Onboarding / documents pending' },
          { title: 'Generated Certificates', value: stats.certificates, color: '#EC4899', desc: 'Issued completion credentials' },
          { title: 'Issued Offer Letters', value: stats.offers, color: '#8B5CF6', desc: 'Dispatched onboard packages' },
          { title: 'Recommendation Letters', value: stats.recommendations, color: '#14B8A6', desc: 'Performance appraisal sheets' }
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
            style={{
              background: 'rgba(30, 41, 59, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 24,
              padding: '24px 28px',
              borderTop: `4px solid ${card.color}`
            }}
          >
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{card.title}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'white', marginBottom: 4 }}>{card.value}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{card.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 32 }}>
        {/* Domain Distribution Horizontal Bar Chart */}
        <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 24 }}>Department / Domain Distribution</h3>
          {Object.keys(domainCounts).length === 0 ? (
            <p style={{ color: '#64748B', fontStyle: 'italic', fontSize: 14 }}>No data registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {Object.entries(domainCounts).map(([domain, count], idx) => {
                const percentage = Math.round((count / stats.total) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                      <span style={{ color: '#CBD5E1' }}>{domain}</span>
                      <span style={{ color: '#6366F1' }}>{count} ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', borderRadius: 5 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completion Progress Metric */}
        <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 16 }}>Internship Completion Rate</h3>
          
          <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="transparent" />
              <motion.circle 
                cx="80" cy="80" r="70" 
                stroke="url(#gradientCompleted)" strokeWidth="12" fill="transparent"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * completionRate) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gradientCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', fontSize: 32, fontWeight: 900, color: 'white' }}>{completionRate}%</div>
          </div>
          <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.5, maxWidth: 280 }}>
            Of all onboarded and reviewed candidates, {stats.completed} have completed successfully.
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. Candidates CRUD Subview
function CandidatesView({ interns, onSave, onDelete, canEdit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [viewingIntern, setViewingIntern] = useState(null);

  // Form states
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: 'Male', address: '',
    collegeName: '', university: '', degree: '', branch: '', graduationYear: '', cgpa: '',
    domain: 'Software Development', role: 'Intern', startDate: '', endDate: '', duration: '6 Months', mentorName: '',
    image: ''
  });

  const domains = [
    'Software Development', 'MERN Stack Web Development', 'Frontend Web Development', 
    'Backend Web Development', 'Full Stack Web Development', 'React.js Web Development', 
    'Python Programming', 'Java Programming', 'Data Science', 'Machine Learning', 
    'Artificial Intelligence', 'Cyber Security & Ethical Hacking', 'Cloud Computing', 
    'DevOps', 'UI/UX Design', 'Digital Marketing'
  ];

  const handleEdit = (intern) => {
    setEditingIntern(intern);
    setForm({
      name: intern.name || '',
      email: intern.email || '',
      phone: intern.phone || '',
      dob: intern.dob || '',
      gender: intern.gender || 'Male',
      address: intern.address || '',
      collegeName: intern.college_name || '',
      university: intern.university || '',
      degree: intern.degree || '',
      branch: intern.branch || '',
      graduationYear: intern.graduation_year || '',
      cgpa: intern.cgpa || '',
      domain: intern.domain || 'Software Development',
      role: intern.role || 'Intern',
      startDate: intern.start_date || '',
      endDate: intern.end_date || '',
      duration: intern.duration || '6 Months',
      mentorName: intern.mentor_name || '',
      image: intern.image || ''
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingIntern(null);
    setForm({
      name: '', email: '', phone: '', dob: '', gender: 'Male', address: '',
      collegeName: '', university: '', degree: '', branch: '', graduationYear: '', cgpa: '',
      domain: 'Software Development', role: 'Intern', startDate: '', endDate: '', duration: '6 Months', mentorName: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editingIntern ? editingIntern.id : null, form);
    setIsModalOpen(false);
  };

  const filtered = interns.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.candidate_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.college_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchesDomain = domainFilter === 'All' || i.domain === domainFilter;
    return matchesSearch && matchesStatus && matchesDomain;
  });

  return (
    <div>
      {/* Toolbar / Search & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, minWidth: 280 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search interns by name, ID, college..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Participating">Participating</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select 
            value={domainFilter} 
            onChange={e => setDomainFilter(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer', maxWidth: 220 }}
          >
            <option value="All">All Domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {canEdit && (
          <button onClick={handleAdd} className="btn-primary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 14 }}>
            <Plus size={18} /> Add Candidate
          </button>
        )}
      </div>

      {/* Interns Table */}
      <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 28, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>CANDIDATE ID</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>FULL NAME</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>DOMAIN / ROLE</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>COLLEGE NAME</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: '#64748B' }}>
                  No candidates matching the criteria were found.
                </td>
              </tr>
            ) : (
              filtered.map(intern => (
                <tr key={intern.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 800, color: '#CBD5E1' }}>{intern.candidate_id}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img 
                        src={intern.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}&background=1E293B&color=fff&size=32`} 
                        style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} 
                        alt=""
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: 'white' }}>{intern.name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{intern.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: 700, color: '#6366F1', fontSize: 13 }}>{intern.domain}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{intern.role}</div>
                  </td>
                  <td style={{ padding: '18px 24px', color: '#94A3B8', fontSize: 13 }}>{intern.college_name || 'N/A'}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: intern.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : intern.status === 'Participating' ? 'rgba(59, 130, 246, 0.1)' : intern.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: intern.status === 'Completed' ? '#10B981' : intern.status === 'Participating' ? '#3B82F6' : intern.status === 'Pending' ? '#F59E0B' : '#EF4444'
                    }}>
                      {intern.status}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        onClick={() => setViewingIntern(intern)} 
                        style={{ border: 'none', background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 10, color: '#CBD5E1', cursor: 'pointer' }}
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      {canEdit && (
                        <>
                          <button 
                            onClick={() => handleEdit(intern)} 
                            style={{ border: 'none', background: 'rgba(99,102,241,0.1)', padding: 8, borderRadius: 10, color: '#818CF8', cursor: 'pointer' }}
                            title="Edit details"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to soft delete candidate ${intern.name}?`)) {
                                onDelete(intern.id);
                              }
                            }} 
                            style={{ border: 'none', background: 'rgba(239,68,68,0.1)', padding: 8, borderRadius: 10, color: '#F87171', cursor: 'pointer' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Candidate Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 720, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{editingIntern ? 'Modify Candidate' : 'New Internship Candidate'}</h3>
                    <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Configure details and trigger onboarding letters automatically.</p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                </div>

                <div style={{ padding: '32px 40px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {/* Candidate Image Upload */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: '2px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={form.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'Intern')}&background=1E293B&color=fff&size=90`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt="Profile Preview"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('candidate-image-upload')?.click()}
                      style={{
                        padding: '6px 16px',
                        borderRadius: 10,
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#818CF8',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Plus size={14} /> Upload Portrait
                    </button>
                    <input
                      id="candidate-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm({ ...form, image: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 900, color: '#6366F1', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Personal Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Full Name</label>
                        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Doe" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Email Address</label>
                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Mobile Number</label>
                        <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Date of Birth</label>
                        <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', colorScheme: 'dark' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Gender</label>
                        <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Address</label>
                        <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="City, State, Country" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Educational Information */}
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 900, color: '#6366F1', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Educational Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>College Name</label>
                        <input type="text" value={form.collegeName} onChange={e => setForm({...form, collegeName: e.target.value})} placeholder="e.g. Stanford University" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>University</label>
                        <input type="text" value={form.university} onChange={e => setForm({...form, university: e.target.value})} placeholder="e.g. State Board / Affiliated University" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Degree</label>
                        <input type="text" value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} placeholder="e.g. B.Tech / B.E. / MCA" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Branch</label>
                        <input type="text" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} placeholder="e.g. Computer Science" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Graduation Year</label>
                        <input type="text" value={form.graduationYear} onChange={e => setForm({...form, graduationYear: e.target.value})} placeholder="e.g. 2027" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>CGPA / Score</label>
                        <input type="text" value={form.cgpa} onChange={e => setForm({...form, cgpa: e.target.value})} placeholder="e.g. 9.2 or 85%" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Internship Information */}
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 900, color: '#6366F1', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Internship details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Internship Domain</label>
                        <select value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                          {domains.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Role Position</label>
                        <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Software Engineer Intern" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Start Date</label>
                        <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', colorScheme: 'dark' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>End Date</label>
                        <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', colorScheme: 'dark' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Internship Duration</label>
                        <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 6 Months" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Mentor Supervisor Name</label>
                        <input type="text" value={form.mentorName} onChange={e => setForm({...form, mentorName: e.target.value})} placeholder="e.g. Kiran Kumar Moopuri" style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '24px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', cursor: 'pointer', fontWeight: 800 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '12px 32px', borderRadius: 10 }}>{editingIntern ? 'Save details' : 'Register Candidate'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Candidate Profile Details Drawer */}
      <AnimatePresence>
        {viewingIntern && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingIntern(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '100%', maxWidth: 500, background: '#0F172A', borderLeft: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh', zIndex: 1, padding: 40 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>Profile Dossier</h3>
                <button onClick={() => setViewingIntern(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                <img src={viewingIntern.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingIntern.name)}&background=1E293B&color=fff&size=96`} style={{ width: 96, height: 96, borderRadius: 24, objectFit: 'cover' }} />
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{viewingIntern.name}</h4>
                  <p style={{ color: '#6366F1', fontSize: 13, fontWeight: 800, marginTop: 4 }}>{viewingIntern.candidate_id}</p>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, paddingRight: 8 }}>
                <div>
                  <h5 style={{ fontSize: 11, fontWeight: 900, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Personal Dossier</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Email:</span> <span style={{ color: 'white', fontWeight: 700 }}>{viewingIntern.email}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Mobile:</span> <span style={{ color: 'white' }}>{viewingIntern.phone || 'N/A'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>DOB:</span> <span style={{ color: 'white' }}>{viewingIntern.dob || 'N/A'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Gender:</span> <span style={{ color: 'white' }}>{viewingIntern.gender || 'N/A'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Address:</span> <span style={{ color: 'white' }}>{viewingIntern.address || 'N/A'}</span></div>
                  </div>
                </div>

                <div>
                  <h5 style={{ fontSize: 11, fontWeight: 900, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Educational Profile</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>College:</span> <span style={{ color: 'white', fontWeight: 700 }}>{viewingIntern.college_name || 'N/A'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>University:</span> <span style={{ color: 'white' }}>{viewingIntern.university || 'N/A'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Degree/Branch:</span> <span style={{ color: 'white' }}>{viewingIntern.degree || ''} {viewingIntern.branch ? `(${viewingIntern.branch})` : ''}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Graduation Yr:</span> <span style={{ color: 'white' }}>{viewingIntern.graduation_year || 'N/A'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>CGPA:</span> <span style={{ color: 'white' }}>{viewingIntern.cgpa || 'N/A'}</span></div>
                  </div>
                </div>

                <div>
                  <h5 style={{ fontSize: 11, fontWeight: 900, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Internship Assignment</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Domain:</span> <span style={{ color: '#6366F1', fontWeight: 800 }}>{viewingIntern.domain}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Designated Role:</span> <span style={{ color: 'white' }}>{viewingIntern.role}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Dates:</span> <span style={{ color: 'white' }}>{viewingIntern.start_date} – {viewingIntern.end_date} ({viewingIntern.duration})</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Mentor:</span> <span style={{ color: 'white' }}>{viewingIntern.mentor_name || 'Unassigned'}</span></div>
                    <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Status:</span> <span style={{ color: 'white', fontWeight: 700 }}>{viewingIntern.status}</span></div>
                    {viewingIntern.certificate_number && (
                      <div style={{ display: 'flex' }}><span style={{ width: 120, color: '#94A3B8' }}>Cert Code:</span> <span style={{ color: '#EC4899', fontWeight: 800 }}>{viewingIntern.certificate_number}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3. Internship Participation Subview
function ParticipationView({ interns, downloadDoc }) {
  const filtered = interns.filter(i => i.status === 'Participating' || i.status === 'Pending');

  return (
    <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 28, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>CANDIDATE ID</th>
            <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>INTERN NAME</th>
            <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>DOMAIN</th>
            <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>JOINING DATE</th>
            <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>SUPERVISOR MENTOR</th>
            <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: '#64748B' }}>
                No active internship participation records found.
              </td>
            </tr>
          ) : (
            filtered.map(intern => (
              <tr key={intern.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '18px 24px', fontWeight: 800, color: '#CBD5E1' }}>{intern.candidate_id}</td>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img 
                      src={intern.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}&background=1E293B&color=fff&size=32`} 
                      style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} 
                      alt=""
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: 'white' }}>{intern.name}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{intern.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '18px 24px', fontWeight: 700, color: '#6366F1', fontSize: 13 }}>{intern.domain}</td>
                <td style={{ padding: '18px 24px', color: '#94A3B8', fontSize: 13 }}>{intern.start_date}</td>
                <td style={{ padding: '18px 24px', color: 'white', fontWeight: 700 }}>{intern.mentor_name || 'N/A'}</td>
                <td style={{ padding: '18px 24px' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                      onClick={() => downloadDoc('offer-letter', intern.id)} 
                      style={{ border: 'none', background: 'rgba(99,102,241,0.1)', padding: '10px 16px', borderRadius: 10, color: '#818CF8', cursor: 'pointer', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Download size={14} /> Offer Letter
                    </button>
                    <button 
                      onClick={() => downloadDoc('participation', intern.id)} 
                      style={{ border: 'none', background: 'rgba(16,185,129,0.1)', padding: '10px 16px', borderRadius: 10, color: '#10B981', cursor: 'pointer', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Download size={14} /> Joining Letter
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 4. Internship Completion Subview
function CompletionView({ interns, downloadDoc, onMarkComplete, canEdit }) {
  const [remarks, setRemarks] = useState('');
  const [selectedIntern, setSelectedIntern] = useState(null);

  const handleOpenCompleteModal = (intern) => {
    setSelectedIntern(intern);
    setRemarks('');
  };

  const handleConfirm = () => {
    onMarkComplete(selectedIntern, remarks);
    setSelectedIntern(null);
  };

  return (
    <div>
      <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 28, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>CANDIDATE ID</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>INTERN NAME</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>DOMAIN</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>END DATE</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>CERTIFICATE CODE</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {interns.filter(i => i.status !== 'Rejected' && i.status !== 'Pending').length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: '#64748B' }}>
                  No internship records found.
                </td>
              </tr>
            ) : (
              interns.filter(i => i.status !== 'Rejected' && i.status !== 'Pending').map(intern => (
                <tr key={intern.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 800, color: '#CBD5E1' }}>{intern.candidate_id}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img 
                        src={intern.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}&background=1E293B&color=fff&size=32`} 
                        style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} 
                        alt=""
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: 'white' }}>{intern.name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{intern.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px', fontWeight: 700, color: '#6366F1', fontSize: 13 }}>{intern.domain}</td>
                  <td style={{ padding: '18px 24px', color: '#94A3B8', fontSize: 13 }}>{intern.end_date}</td>
                  <td style={{ padding: '18px 24px', color: '#EC4899', fontWeight: 800, letterSpacing: '0.5px' }}>{intern.certificate_number || '–'}</td>
                  <td style={{ padding: '18px 24px' }}>
                    {intern.status === 'Participating' ? (
                      canEdit ? (
                        <button 
                          onClick={() => handleOpenCompleteModal(intern)}
                          style={{ border: 'none', background: 'linear-gradient(45deg, #10B981, #059669)', padding: '10px 18px', borderRadius: 10, color: 'white', cursor: 'pointer', fontWeight: 900, fontSize: 12 }}
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: '#3B82F6', fontWeight: 800 }}>In Progress</span>
                      )
                    ) : (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          onClick={() => downloadDoc('completion', intern.id)} 
                          style={{ border: 'none', background: 'rgba(16,185,129,0.1)', padding: '10px 16px', borderRadius: 10, color: '#10B981', cursor: 'pointer', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Download size={14} /> Certificate
                        </button>
                        <button 
                          onClick={() => downloadDoc('recommendation', intern.id)} 
                          style={{ border: 'none', background: 'rgba(236,72,153,0.1)', padding: '10px 16px', borderRadius: 10, color: '#F472B6', cursor: 'pointer', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Download size={14} /> Recommendation
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mark Completed Modal */}
      <AnimatePresence>
        {selectedIntern && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIntern(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 500, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', padding: 40 }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 12 }}>Approve Internship Completion</h3>
              <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24, lineHeight: 1.5 }}>
                You are about to issue an official certificate of completion and recommendation letter to <b>{selectedIntern.name}</b>.
              </p>

              <div className="form-group" style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Performance Remarks (Appended to Recommendation Letter)</label>
                <textarea 
                  value={remarks} 
                  onChange={e => setRemarks(e.target.value)} 
                  placeholder="e.g. John exhibited high quality engineering code submissions and active participation in our Daily Stand-ups." 
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                <button onClick={() => setSelectedIntern(null)} style={{ padding: '12px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', cursor: 'pointer', fontWeight: 800 }}>Cancel</button>
                <button onClick={handleAction = handleConfirm} className="btn-primary" style={{ padding: '12px 32px', borderRadius: 10, background: 'linear-gradient(45deg, #10B981, #059669)' }}>Issue & Complete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5. Certificate Management Subview
function CertificatesView({ certificates, downloadDoc, onRegenerate, onSendEmail }) {
  const [query, setQuery] = useState('');

  const filtered = certificates.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.certificate_number.toLowerCase().includes(query.toLowerCase()) ||
    c.candidate_id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, maxWidth: 500 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Search certificates by name, ID or cert code..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 28, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>CERTIFICATE CODE</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>RECIPIENT</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>DOMAIN</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>DATE ISSUED</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>VERIFICATION STATUS</th>
              <th style={{ padding: '20px 24px', fontSize: 12, color: '#94A3B8', fontWeight: 800 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: '#64748B' }}>
                  No certificate registry records found.
                </td>
              </tr>
            ) : (
              filtered.map(cert => (
                <tr key={cert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 900, color: '#EC4899', letterSpacing: '1px' }}>{cert.certificate_number}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img 
                        src={cert.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(cert.name)}&background=1E293B&color=fff&size=32`} 
                        style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} 
                        alt=""
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: 'white' }}>{cert.name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{cert.candidate_id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px', fontWeight: 700, color: '#6366F1', fontSize: 13 }}>{cert.domain}</td>
                  <td style={{ padding: '18px 24px', color: '#CBD5E1', fontSize: 13 }}>{cert.certificate_date}</td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ color: '#10B981', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={14} /> ACTIVE ✅
                    </div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        onClick={() => downloadDoc('completion', cert.id)} 
                        style={{ border: 'none', background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 10, color: '#CBD5E1', cursor: 'pointer' }}
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => onRegenerate(cert.id)} 
                        style={{ border: 'none', background: 'rgba(245,158,11,0.1)', padding: 8, borderRadius: 10, color: '#F59E0B', cursor: 'pointer' }}
                        title="Reissue / Regenerate QR"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        onClick={() => onSendEmail(cert)} 
                        style={{ border: 'none', background: 'rgba(99,102,241,0.1)', padding: 8, borderRadius: 10, color: '#818CF8', cursor: 'pointer' }}
                        title="Email Certificate & Recommendation"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. Configurable Email Templates Subview
function EmailTemplatesView({ templates, onSave }) {
  const [selectedKey, setSelectedKey] = useState('offer_letter');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const current = templates.find(t => t.template_key === selectedKey || t.templateKey === selectedKey);
    if (current) {
      setSubject(current.subject);
      setBody(current.body);
    } else {
      setSubject('');
      setBody('');
    }
  }, [selectedKey, templates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedKey, { subject, body });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
      {/* Selector */}
      <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: 24, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h4 style={{ fontSize: 13, fontWeight: 900, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Select Template</h4>
        {[
          { key: 'offer_letter', label: 'Offer Letter Dispatch' },
          { key: 'participation_letter', label: 'Participation Joining Details' },
          { key: 'completion_certificate', label: 'Certificate Issuance' },
          { key: 'recommendation_letter', label: 'Recommendation Dispatch' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setSelectedKey(item.key)}
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              border: 'none',
              background: selectedKey === item.key ? 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' : 'transparent',
              color: selectedKey === item.key ? 'white' : '#64748B',
              textAlign: 'left',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              borderLeft: selectedKey === item.key ? '4px solid #6366F1' : 'none'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Edit Form */}
      <div style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 28 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'white', textTransform: 'capitalize' }}>
            Edit: {selectedKey.replace('_', ' ')} Template
          </h3>

          <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', padding: 16, borderRadius: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Info size={18} color="#818CF8" style={{ marginTop: 2 }} />
            <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>
              <b>Placeholders Supported:</b><br />
              Use <code style={{ color: '#F472B6' }}>{"{name}"}</code>, <code style={{ color: '#F472B6' }}>{"{role}"}</code>, <code style={{ color: '#F472B6' }}>{"{domain}"}</code>, <code style={{ color: '#F472B6' }}>{"{candidate_id}"}</code>, <code style={{ color: '#F472B6' }}>{"{start_date}"}</code>, <code style={{ color: '#F472B6' }}>{"{end_date}"}</code>, <code style={{ color: '#F472B6' }}>{"{duration}"}</code>, <code style={{ color: '#F472B6' }}>{"{mentor_name}"}</code>, or <code style={{ color: '#F472B6' }}>{"{certificate_number}"}</code>. These will be replaced automatically.
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Email Subject Line</label>
            <input 
              type="text" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="e.g. Internship Welcome Package" 
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
              required 
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8 }}>Email Body Text</label>
            <textarea 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              rows={10}
              placeholder="Write your email body copy here..." 
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', resize: 'vertical' }}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '14px 28px', alignSelf: 'flex-end', borderRadius: 12 }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

// 7. Reports Subview
function ReportsView({ interns, activities }) {
  const stats = {
    total: interns.length,
    active: interns.filter(i => i.status === 'Participating').length,
    completed: interns.filter(i => i.status === 'Completed').length,
    pending: interns.filter(i => i.status === 'Pending').length,
    rejected: interns.filter(i => i.status === 'Rejected').length,
    verified: activities.filter(a => a.action === 'Verification Request' && a.status === 'success').length,
    downloads: activities.filter(a => a.action === 'Certificate Downloaded').length
  };

  const exportCSV = () => {
    let csv = 'Candidate ID,Name,Email,Mobile,Status,Domain,Role,Duration,Start Date,End Date,Certificate Number\n';
    interns.forEach(i => {
      csv += `"${i.candidate_id}","${i.name}","${i.email}","${i.phone || ''}","${i.status}","${i.domain}","${i.role}","${i.duration}","${i.start_date}","${i.end_date}","${i.certificate_number || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Interns_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    // Generate a simple HTML table styled for Excel compatibility
    let html = '<table><thead><tr>';
    html += '<th>Candidate ID</th><th>Name</th><th>Email</th><th>Status</th><th>Domain</th><th>Role</th><th>Start Date</th><th>End Date</th><th>Certificate</th>';
    html += '</tr></thead><tbody>';
    
    interns.forEach(i => {
      html += `<tr><td>${i.candidate_id}</td><td>${i.name}</td><td>${i.email}</td><td>${i.status}</td><td>${i.domain}</td><td>${i.role}</td><td>${i.start_date}</td><td>${i.end_date}</td><td>${i.certificate_number || ''}</td></tr>`;
    });
    
    html += '</tbody></table>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Interns_Masterlist_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter audit logs specifically related to internships
  const auditLogs = activities.filter(a => 
    a.action.includes('Candidate') || 
    a.action.includes('Certificate') || 
    a.action.includes('Verification')
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Export Controls */}
      <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: 32, borderRadius: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>Data Export Terminal</h3>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Generate spreadsheets and data formats for offline review.</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={exportCSV} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <FileText size={18} /> Export to CSV
          </button>
          <button onClick={exportExcel} className="btn-primary" style={{ padding: '12px 24px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <FileText size={18} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div style={{ background: 'rgba(30, 41, 59, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 28, padding: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 24 }}>System Audit Trail</h3>
        
        <div style={{ maxHeight: 400, overflowY: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '14px 20px', color: '#94A3B8', fontWeight: 800 }}>TIMESTAMP</th>
                <th style={{ padding: '14px 20px', color: '#94A3B8', fontWeight: 800 }}>OPERATOR</th>
                <th style={{ padding: '14px 20px', color: '#94A3B8', fontWeight: 800 }}>ACTION</th>
                <th style={{ padding: '14px 20px', color: '#94A3B8', fontWeight: 800 }}>IP ADDRESS</th>
                <th style={{ padding: '14px 20px', color: '#94A3B8', fontWeight: 800 }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontStyle: 'italic' }}>
                    No internship audit logs recorded.
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 20px', color: '#94A3B8' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: 'white' }}>{log.user}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 900,
                        background: log.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: log.status === 'success' ? '#10B981' : '#F59E0B'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#CBD5E1' }}>{log.ip_address || log.ipAddress || '127.0.0.1'}</td>
                    <td style={{ padding: '14px 20px', color: '#94A3B8', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 11 }}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main Internship Manager Wrapper Component
export default function InternshipModule({ currentUser, addActivity }) {
  const [subTab, setSubTab] = useState('dashboard');
  const [interns, setInterns] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const candidatesList = await api.getInterns();
      setInterns(candidatesList);
      
      const certsList = await api.getCertificates();
      setCertificates(certsList);

      const emailTemplates = await api.getEmailTemplates();
      setTemplates(emailTemplates);

      const auditActivities = await api.getActivities();
      setActivities(auditActivities);
    } catch (err) {
      console.error('Failed to load internship datasets:', err);
      showToast('Error syncing internship database records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveIntern = async (id, formData) => {
    try {
      if (id) {
        // Edit
        const updated = await api.updateIntern(id, formData);
        setInterns(prev => prev.map(i => i.id === id ? updated : i));
        showToast('Intern dossier updated successfully');
        addActivity(currentUser?.name || 'Admin', 'Candidate Updated', 'project', 'info', `Modified dossier for ${formData.name}`);
      } else {
        // Create
        const created = await api.createIntern(formData);
        setInterns(prev => [created, ...prev]);
        showToast('Candidate registered and welcome emails dispatched');
        addActivity(currentUser?.name || 'Admin', 'Candidate Created', 'project', 'success', `Created candidate ${formData.name}`);
      }
      loadData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteIntern = async (id) => {
    try {
      await api.deleteIntern(id);
      setInterns(prev => prev.filter(i => i.id !== id));
      showToast('Candidate soft-deleted successfully');
      loadData();
    } catch (err) {
      showToast('Failed to delete candidate', 'error');
    }
  };

  const handleMarkComplete = async (intern, remarks) => {
    try {
      const updated = await api.updateIntern(intern.id, {
        ...intern,
        status: 'Completed',
        performanceRemarks: remarks
      });
      setInterns(prev => prev.map(i => i.id === intern.id ? updated : i));
      showToast(`Internship completed! Certificate issued for ${intern.name}`);
      loadData();
    } catch (err) {
      showToast('Failed to complete internship', 'error');
    }
  };

  const handleRegenerateCertificate = async (id) => {
    try {
      await api.regenerateCertificate(id);
      showToast('Certificate QR & issuance updated successfully');
      loadData();
    } catch (err) {
      showToast('Reissue operation failed', 'error');
    }
  };

  const handleSendEmail = async (cert) => {
    // Triggers simulated mail send via activity log
    showToast(`Simulation: Certificate dispatched via email to ${cert.email}`);
    addActivity(
      'Mail Automation', 
      'Email Dispatched', 
      'mail', 
      'success', 
      `Subject: Congratulations on Completing your Internship at Klanvision!\nTo: ${cert.email}\n\nAttached:\n- Internship_Certificate_${cert.certificate_number}.pdf\n- Recommendation_Letter_${cert.candidate_id}.pdf`
    );
    loadData();
  };

  const handleSaveTemplate = async (key, templateData) => {
    try {
      await api.updateEmailTemplate(key, templateData);
      showToast('Email template configuration saved');
      loadData();
    } catch (err) {
      showToast('Failed to save email template', 'error');
    }
  };

  const downloadDoc = (type, internId) => {
    let downloadUrl = '';
    if (type === 'offer-letter') downloadUrl = api.downloadOfferLetterUrl(internId);
    else if (type === 'participation') downloadUrl = api.downloadParticipationLetterUrl(internId);
    else if (type === 'completion') downloadUrl = api.downloadCompletionCertificateUrl(internId);
    else if (type === 'recommendation') downloadUrl = api.downloadRecommendationLetterUrl(internId);

    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const canEdit = currentUser?.role !== 'Viewer';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'candidates', label: 'Candidates', icon: User },
    { id: 'participation', label: 'Internship Participation', icon: Calendar },
    { id: 'completion', label: 'Internship Completion', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: ShieldCheck },
    { id: 'templates', label: 'Email Templates', icon: Settings },
    { id: 'reports', label: 'Reports & Logs', icon: FileText }
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            style={{
              position: 'fixed', top: 40, right: 40, zIndex: 10000,
              background: toast.type === 'success' ? '#10B981' : '#EF4444',
              color: 'white', padding: '16px 32px', borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontWeight: 900,
              fontSize: 14, display: 'flex', alignItems: 'center', gap: 12
            }}
          >
            {toast.type === 'success' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px' }}>Internship <span className="gradient-text">Management</span></h2>
          <p style={{ color: '#94A3B8', marginTop: 10, fontSize: 16 }}>Automate candidates registry, participation tracking, and dynamic certificate verification.</p>
        </div>
      </div>

      {/* Subtabs Menu Bar */}
      <div style={{ 
        display: 'flex', gap: 8, background: 'rgba(255,255,255,0.02)', padding: 6, borderRadius: 20, 
        border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' 
      }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setSubTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 16,
              border: 'none', background: subTab === item.id ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
              color: subTab === item.id ? 'white' : '#94A3B8', cursor: 'pointer', transition: 'all 0.3s',
              fontWeight: 800, fontSize: 13
            }}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      {/* View Loader */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid rgba(16,185,129,0.1)', borderTopColor: '#10B981', marginBottom: 16 }}
          />
          <p style={{ color: '#94A3B8', fontSize: 14, fontWeight: 700 }}>Synchronizing secure registry data...</p>
        </div>
      ) : (
        /* Subview Content */
        <div style={{ minHeight: 400 }}>
          {subTab === 'dashboard' && <DashboardView interns={interns} certificates={certificates} />}
          {subTab === 'candidates' && <CandidatesView interns={interns} onSave={handleSaveIntern} onDelete={handleDeleteIntern} canEdit={canEdit} />}
          {subTab === 'participation' && <ParticipationView interns={interns} downloadDoc={downloadDoc} />}
          {subTab === 'completion' && <CompletionView interns={interns} downloadDoc={downloadDoc} onMarkComplete={handleMarkComplete} canEdit={canEdit} />}
          {subTab === 'certificates' && <CertificatesView certificates={certificates} downloadDoc={downloadDoc} onRegenerate={handleRegenerateCertificate} onSendEmail={handleSendEmail} />}
          {subTab === 'templates' && <EmailTemplatesView templates={templates} onSave={handleSaveTemplate} />}
          {subTab === 'reports' && <ReportsView interns={interns} activities={activities} />}
        </div>
      )}
    </motion.div>
  );
}
