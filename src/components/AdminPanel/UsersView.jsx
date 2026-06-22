import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Shield, ShieldCheck, Eye, EyeOff, Check, X, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { NoResults, normalizePermission } from './SharedComponents';

export function UserForm({ initialData, onSave, triggerToast }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'Viewer',
    permissions: (initialData?.permissions || []).map(normalizePermission),
    isAuthorized: initialData?.isAuthorized ?? true,
    is2FAEnabled: true
  });
  const [showPass, setShowPass] = useState(false);

  const availablePermissions = [
    'Dashboard',
    'Projects',
    'Users',
    'Blogs',
    'Settings',
    'Activity Log'
  ];

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSelectAll = () => {
    if (formData.permissions.length === availablePermissions.length) {
      setFormData(prev => ({ ...prev, permissions: [] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: [...availablePermissions] }));
    }
  };

  const handleAction = () => {
    if (!formData.name || !formData.email) {
      triggerToast('Please provide a name and email.', 'User Directory');
      return;
    }
    onSave(formData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="form-group">
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#94A3B8', marginBottom: 10 }}>MEMBER NAME</label>
        <div style={{ position: 'relative' }}>
          <Users size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Robert Fox" style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#94A3B8', marginBottom: 10 }}>EMAIL ADDRESS</label>
        <div style={{ position: 'relative' }}>
          <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="robert@klanvision.com" style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#94A3B8', marginBottom: 10 }}>SECURITY PASSWORD</label>
        <div style={{ position: 'relative' }}>
          <Shield size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input type={showPass ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••••••" style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}>
            {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={18} color="#6366F1" /> Login Authorization</label>
          <div
            onClick={() => setFormData({ ...formData, isAuthorized: !formData.isAuthorized })}
            style={{
              width: 48, height: 24, borderRadius: 20, background: formData.isAuthorized ? '#6366F1' : 'rgba(255,255,255,0.1)',
              position: 'relative', cursor: 'pointer', transition: '0.3s'
            }}
          >
            <motion.div animate={{ x: formData.isAuthorized ? 26 : 4 }} style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3 }} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>When enabled, this member can log in using the credentials above.</p>
      </div>

      <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={18} color="#10B981" /> Enforce 2FA Security</label>
          <div
            style={{
              width: 48, height: 24, borderRadius: 20, background: '#10B981',
              position: 'relative', cursor: 'not-allowed', transition: '0.3s', opacity: 0.8
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: 26 }} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#10B981', lineHeight: 1.5, fontWeight: 700 }}>2FA Security is globally enforced and mandatory for all accounts.</p>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#94A3B8', marginBottom: 10 }}>SYSTEM ROLE</label>
        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', cursor: 'pointer' }}>
          <option value="Super Admin">Super Admin (Full Platform Control)</option>
          <option value="Admin">Administrator (Full Access)</option>
          <option value="Developer">Developer (Technical & Build Access)</option>
          <option value="Editor">Editor (Content Management)</option>
          <option value="Viewer">Viewer (Read Only)</option>
        </select>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>MODULE PERMISSIONS</label>
          <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>{formData.permissions.length === availablePermissions.length ? 'DESELECT ALL' : 'SELECT ALL'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {availablePermissions.map(perm => (
            <div
              key={perm} onClick={() => togglePermission(perm)}
              style={{
                padding: '12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)',
                background: formData.permissions.includes(perm) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                borderColor: formData.permissions.includes(perm) ? '#6366F1' : 'rgba(255,255,255,0.05)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: '0.2s'
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 6, background: formData.permissions.includes(perm) ? '#6366F1' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {formData.permissions.includes(perm) && <Check size={12} color="white" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: formData.permissions.includes(perm) ? 'white' : '#64748B' }}>{perm}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleAction} className="btn-primary" style={{ marginTop: 12, width: '100%', padding: 18, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <ShieldCheck size={20} /> {initialData ? 'Update Member Security' : 'Finalize Member Account'}
      </button>
    </div>
  );
}

export default function UsersView({ users, onAddClick, onEditClick, onDeleteClick, onToggleAccess, searchQuery, roleFilter, canEdit }) {
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 44 }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px' }}>Team <span className="gradient-text">Directory</span></h2>
          <p style={{ color: '#94A3B8', marginTop: 10, fontSize: 16 }}>Manage authentication and security modules.</p>
        </div>
        {canEdit && (
          <button onClick={onAddClick} className="btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
            <UserPlus size={22} /> Add Member
          </button>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <div className="admin-grid-cards-360" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 32 }}>
          {filteredUsers.map((user) => (
            <motion.div key={user.id} layout whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '40px', borderRadius: 36, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: user.color, filter: 'blur(80px)', opacity: 0.05 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <div style={{ padding: 4, borderRadius: 20, background: `linear-gradient(45deg, ${user.color}, transparent)` }}>
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1E293B&color=fff`} style={{ width: 72, height: 72, borderRadius: 16, display: 'block' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 20, fontWeight: 900 }}>{user.name}</h4>
                  <p style={{ fontSize: 13, color: user.color, fontWeight: 900, letterSpacing: '0.5px' }}>{user.role.toUpperCase()}</p>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Modules</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {user.isAuthorized ? (
                      <div style={{ color: '#10B981', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={12} /> SECURE</div>
                    ) : (
                      <div style={{ color: '#F87171', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}><X size={12} /> LOCKED</div>
                    )}
                    <div
                      onClick={() => canEdit && onToggleAccess && onToggleAccess(user)}
                      style={{
                        width: 36, height: 18, borderRadius: 20, background: user.isAuthorized ? '#6366F1' : 'rgba(255,255,255,0.1)',
                        position: 'relative', cursor: canEdit ? 'pointer' : 'not-allowed', transition: '0.3s', display: 'inline-block', opacity: canEdit ? 1 : 0.6
                      }}
                    >
                      <motion.div animate={{ x: user.isAuthorized ? 20 : 2 }} style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', position: 'absolute', top: 2 }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.permissions.length > 0 ? user.permissions.map(p => (
                    <span key={p} style={{ fontSize: 11, fontWeight: 800, color: 'white', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>{p}</span>
                  )) : (
                    <span style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>No modules assigned</span>
                  )}
                </div>
              </div>

              {canEdit && (
                <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                  <button onClick={() => onEditClick(user)} style={{ flex: 1, padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Edit2 size={16} /> Modify</button>
                  <button onClick={() => onDeleteClick(user.id)} style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={20} /></button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
