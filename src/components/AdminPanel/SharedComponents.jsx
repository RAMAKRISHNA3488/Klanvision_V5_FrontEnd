import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Filter, Zap, Shield, Check, X, Clock, AlertTriangle, Trash2 } from 'lucide-react';

// --- TOTP Utilities ---
export const base32ToBuffer = (base32) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (let i = 0; i < base32.length; i++) {
    const val = alphabet.indexOf(base32[i].toUpperCase());
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
};

export const getTOTP = async (secret) => {
  try {
    const keyData = base32ToBuffer(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30);
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter); // Simplified 32-bit counter for JS

    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, counterBuffer);
    const hmac = new Uint8Array(signature);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const otp = ((hmac[offset] & 0x7f) << 24 | (hmac[offset + 1] & 0xff) << 16 | (hmac[offset + 2] & 0xff) << 8 | (hmac[offset + 3] & 0xff)) % 1000000;
    return otp.toString().padStart(6, '0');
  } catch (e) {
    return '000000';
  }
};

// --- Helper Functions ---
// IST Timezone constant for global use
const IST_TIMEZONE = 'Asia/Kolkata';

export const formatTimestamp = (ts) => {
  if (!ts) return '';
  if (ts === 'Just now') return ts;
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    const timeStr = d.toLocaleTimeString('en-IN', { timeZone: IST_TIMEZONE, hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString('en-IN', { timeZone: IST_TIMEZONE, month: 'short', day: 'numeric' });
    return `${timeStr} ${dateStr} (IST)`;
  } catch (e) {
    return ts;
  }
};

// Utility: Format a date-only value in IST (e.g., for blog dates, issue dates)
export const formatDateIST = (dateVal) => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString('en-IN', { timeZone: IST_TIMEZONE, day: '2-digit', month: 'long', year: 'numeric' });
  } catch (e) {
    return dateVal;
  }
};

// Utility: Get the current date string in IST format
export const currentDateIST = () => {
  return new Date().toLocaleDateString('en-IN', { timeZone: IST_TIMEZONE, month: 'long', day: '2-digit', year: 'numeric' });
};

// Utility: Get the current short date string in IST format
export const currentShortDateIST = () => {
  return new Date().toLocaleDateString('en-IN', { timeZone: IST_TIMEZONE, month: 'short', day: '2-digit', year: 'numeric' });
};

export const normalizePermission = (p) => {
  if (p === 'MANAGE_USERS') return 'Users';
  if (p === 'MANAGE_PROJECTS' || p === 'MANAGE_JOBS') return 'Projects';
  if (p === 'MANAGE_BLOGS') return 'Blogs';
  if (p === 'MANAGE_SEO') return 'Settings';
  if (p === 'MANAGE_ACTIVITIES') return 'Activity Log';
  return p;
};

export const hasTabPermission = (user, tabId) => {
  if (!user) return false;
  const role = (user.role || '').toUpperCase();
  if (role === 'SUPER_ADMIN' || role === 'SUPER ADMIN' || role === 'ADMIN' || role === 'ADMINISTRATOR' || role === 'SUPERADMIN') {
    return true;
  }
  
  const permMap = {
    dashboard:  'Dashboard',
    users:      'Users',
    projects:   'Projects',
    internship: 'Projects',
    exams:      'Exams',
    blogs:      'Blogs',
    settings:   'Settings',
    activity:   'Activity Log',
  };
  const required = permMap[tabId];
  if (required === undefined) return false; // unknown tab
  
  const perms = (user.permissions || []).map(normalizePermission);
  if (perms.includes('ALL_ACCESS') || perms.includes('SUPER_ADMIN')) {
    return true;
  }
  
  // Explicitly granted tab access
  if (perms.includes(required)) {
    return true;
  }
  
  return false;
};

export const hasWritePermission = (user, tabId) => {
  if (!user) return false;
  const role = (user.role || '').toUpperCase();
  
  // Super Admin and Admin have full write access everywhere
  if (role === 'SUPER_ADMIN' || role === 'SUPER ADMIN' || role === 'ADMIN' || role === 'ADMINISTRATOR' || role === 'SUPERADMIN') {
    return true;
  }
  
  // Viewer has no write access (read-only) regardless of explicit permissions
  if (role === 'VIEWER') {
    return false;
  }
  
  const perms = (user.permissions || []).map(normalizePermission);
  if (perms.includes('ALL_ACCESS') || perms.includes('SUPER_ADMIN')) {
    return true;
  }
  
  const permMap = {
    users:      'Users',
    projects:   'Projects',
    exams:      'Exams',
    blogs:      'Blogs',
    settings:   'Settings',
    activity:   'Activity Log',
  };
  const required = permMap[tabId];
  
  // If explicitly granted permission by Superadmin, allow write
  if (required && perms.includes(required)) {
    return true;
  }
  
  // Base role write access
  if (role === 'DEVELOPER') {
    return tabId === 'projects' || tabId === 'settings';
  }
  
  if (role === 'EDITOR') {
    return tabId === 'blogs';
  }
  
  return false;
};

// --- Shared UI Components ---

export function UnauthorizedView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px',
        textAlign: 'center',
        background: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(20px)',
        borderRadius: 32,
        border: '1px solid rgba(239, 68, 68, 0.2)',
        maxWidth: 600,
        margin: '40px auto'
      }}
    >
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        background: 'rgba(239, 68, 68, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F87171',
        marginBottom: 24,
        boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)'
      }}>
        <Lock size={40} />
      </div>
      <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 12 }}>Access Restricted</h3>
      <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.6, maxWidth: 400, marginBottom: 32 }}>
        Your account profile does not possess the required module privileges to access this section. Please contact your system administrator to adjust your credentials.
      </p>
    </motion.div>
  );
}

export function SearchCommander({ activeTab, query, setQuery, userRoleFilter, setUserRoleFilter, projectStatusFilter, setProjectStatusFilter, blogCategoryFilter, setBlogCategoryFilter }) {
  if (activeTab === 'dashboard' || activeTab === 'settings' || activeTab === 'activity' || activeTab === 'internship') return null;

  const filters = {
    users: ['All', 'Admin', 'Editor', 'Viewer', 'Developer'],
    projects: ['All', 'Active', 'In Progress', 'On Hold', 'Delivered'],
    blogs: ['All', 'Technology', 'Design', 'AI', 'Security', 'Strategy']
  };

  const currentFilters = filters[activeTab] || [];
  const currentFilterValue = activeTab === 'users' ? userRoleFilter : activeTab === 'projects' ? projectStatusFilter : blogCategoryFilter;
  const setFilterValue = activeTab === 'users' ? setUserRoleFilter : activeTab === 'projects' ? setProjectStatusFilter : setBlogCategoryFilter;

  return (
    <motion.div
      className="search-commander"
      initial={activeTab === 'projects' ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      animate={activeTab === 'projects' ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, boxShadow: ['0 30px 60px rgba(0,0,0,0.5)', '0 30px 60px rgba(99, 102, 241, 0.15)', '0 30px 60px rgba(0,0,0,0.5)'] }}
      transition={activeTab === 'projects' ? { duration: 0 } : { boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))', backdropFilter: 'blur(30px)',
        padding: '28px 48px', borderRadius: 40, border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40,
        marginBottom: 48
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.div
            animate={activeTab === 'projects' ? {} : { rotate: 360 }}
            transition={activeTab === 'projects' ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(45deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
          >
            <Filter size={20} color="white" />
          </motion.div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '2px', display: 'block' }}>Operational</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: 'white' }}>Quick Filters</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
          {currentFilters.map((f) => (
            <motion.button
              key={f}
              whileHover={activeTab === 'projects' ? {} : { scale: 1.05, y: -2 }}
              whileTap={activeTab === 'projects' ? {} : { scale: 0.95 }}
              onClick={() => setFilterValue(f)}
              style={{
                padding: '10px 24px', borderRadius: 16, border: '1px solid',
                borderColor: currentFilterValue === f ? '#6366F1' : 'rgba(255,255,255,0.08)',
                background: currentFilterValue === f ? 'linear-gradient(45deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))' : 'rgba(255,255,255,0.03)',
                color: currentFilterValue === f ? 'white' : '#94A3B8',
                fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: currentFilterValue === f ? '0 0 30px rgba(99, 102, 241, 0.5), inset 0 0 10px rgba(99, 102, 241, 0.3)' : 'none',
                textShadow: currentFilterValue === f ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 32, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 48 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 4 }}>Active View Engine</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: query ? '#10B981' : '#6366F1' }} />
            <div style={{ fontSize: 14, color: query ? '#10B981' : '#6366F1', fontWeight: 900 }}>{query ? `MATCHING: "${query}"` : 'BROADCASTING ALL'}</div>
          </div>
        </div>
        <motion.div
          whileHover={{ rotate: 90, scale: 1.1 }}
          onClick={() => setQuery('')}
          style={{ width: 52, height: 52, borderRadius: 18, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Zap size={22} color={query ? '#6366F1' : '#475569'} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function CelebrationEffect() {
  const particles = Array.from({ length: 40 });
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 1000,
            y: (Math.random() - 0.5) * 1000,
            scale: [0, 1.5, 0],
            rotate: Math.random() * 360
          }}
          transition={{ duration: 3, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: Math.random() * 15 + 5,
            height: Math.random() * 15 + 5,
            borderRadius: Math.random() > 0.5 ? '50%' : '20%',
            background: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'][Math.floor(Math.random() * 5)],
            boxShadow: '0 0 10px currentColor'
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '40px 80px', borderRadius: 40, border: '2px solid #6366F1', boxShadow: '0 0 50px rgba(99, 102, 241, 0.5)', textAlign: 'center' }}
      >
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 10 }}>BOOM 🎉</h2>
        <p style={{ fontSize: 18, color: '#94A3B8', fontWeight: 700 }}>Your article has been launched successfully.</p>
      </motion.div>
    </div>
  );
}

export function NoResults({ query }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px', color: '#64748B' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#94A3B8', marginBottom: 6 }}>No matches found</h3>
      <p style={{ fontSize: 13 }}>We couldn't find anything matching "{query}". Try another query.</p>
    </div>
  );
}

export function BoardCard({ title, value, desc, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="clay-card"
      style={{
        padding: '26px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        borderTop: `4px solid ${color || '#6366F1'}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>{title}</span>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color || '#6366F1', boxShadow: `0 0 14px ${color || '#6366F1'}` }} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.8px', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.4, fontWeight: 500 }}>{desc}</div>
    </motion.div>
  );
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, itemName, message, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(24px)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          className="clay-card"
          style={{
            maxWidth: 480,
            width: '100%',
            padding: '32px 36px',
            textAlign: 'center',
            position: 'relative',
            borderTop: '4px solid #EF4444',
            boxShadow: '0 30px 80px rgba(239, 68, 68, 0.25), 0 20px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={16} />
          </button>

          {/* Glowing Red Clay Icon */}
          <div 
            className="clay-card-rose"
            style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.45)'
            }}
          >
            <AlertTriangle size={32} color="white" />
          </div>

          {/* Modal Header */}
          <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 10 }}>
            {title || 'Confirm Deletion'}
          </h3>

          {/* Target Item Name Pill */}
          {itemName && (
            <div 
              className="clay-pill"
              style={{
                display: 'inline-block',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                fontSize: 13,
                fontWeight: 800,
                padding: '6px 16px',
                marginBottom: 16,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              "{itemName}"
            </div>
          )}

          {/* Explanation message */}
          <p style={{ color: '#94A3B8', fontSize: 13.5, lineHeight: 1.6, marginBottom: 28, fontWeight: 500 }}>
            {message || 'Are you sure you want to proceed? This action is permanent and cannot be undone.'}
          </p>

          {/* Buttons Row */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={onClose}
              disabled={loading}
              className="clay-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#CBD5E1',
                padding: '12px 24px',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="clay-btn clay-btn-rose"
              style={{
                padding: '12px 24px',
                flex: 1.2,
                justifyContent: 'center'
              }}
            >
              {loading ? 'Deleting...' : (
                <>
                  <Trash2 size={16} /> Confirm Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
