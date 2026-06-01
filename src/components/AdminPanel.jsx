import { useState, useEffect, useRef, useCallback } from 'react';
import './AdminPanel.css';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import {
  LayoutDashboard, Users, FileText,
  Settings, LogOut, Search, Bell, Plus,
  CheckCircle2, Clock, Calendar, Mail,
  ShieldCheck, Filter, Edit2, Trash2, UserPlus,
  LayoutPanelLeft, Activity, Zap, Star, Rocket, Globe,
  Shield, Check, X, Lock, Eye, EyeOff, Upload, Link2
} from 'lucide-react';

// --- TOTP Utilities ---
const base32ToBuffer = (base32) => {
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

const getTOTP = async (secret) => {
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
const formatTimestamp = (ts) => {
  if (!ts) return '';
  if (ts === 'Just now') return ts;
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return ts;
  }
};

// --- Types ---












export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered credentials and active session
  useEffect(() => {
    const saved = localStorage.getItem('klanvision_remembered');
    if (saved) {
      try {
        const { email, password } = JSON.parse(saved);
        setLoginForm({ email, password });
        setRememberMe(true);
      } catch (e) {
        localStorage.removeItem('klanvision_remembered');
      }
    }

    const sessionStr = localStorage.getItem('klanvision_admin_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (session && session.user && session.loginTime && (Date.now() - session.loginTime < twentyFourHours)) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        } else {
          localStorage.removeItem('klanvision_admin_session');
        }
      } catch (e) {
        localStorage.removeItem('klanvision_admin_session');
      }
    }
  }, []);

  // Global Settings State
  const [theme, setTheme] = useState('Dark');
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [glassIntensity, setGlassIntensity] = useState(30);
  const [twoFactor, setTwoFactor] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  // Tracks the highest activity ID we have loaded — used for efficient live polling (afterId)
  const lastActivityIdRef = useRef(0);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
  const [setup2FAQr, setSetup2FAQr] = useState(null);
  const [setup2FASecret, setSetup2FASecret] = useState(null);
  const setup2FAFetched = useRef(false);

  useEffect(() => {
    if (isSettingUp2FA && verifyingUser && !setup2FAFetched.current) {
      setup2FAFetched.current = true;
      api.generate2FA(verifyingUser.email)
        .then(data => {
          setSetup2FAQr(data.qrCodeImage);
          setSetup2FASecret(data.secret);
        })
        .catch(err => console.error("Failed to generate 2FA QR:", err));
    }
    if (!isSettingUp2FA) {
      setup2FAFetched.current = false;
      setSetup2FAQr(null);
      setSetup2FASecret(null);
    }
  }, [isSettingUp2FA, verifyingUser]);
  const [platformLogo, setPlatformLogo] = useState(null);
  const [companyName, setCompanyName] = useState('KLANVISION');

  useEffect(() => {
    // Apply Accent Color
    document.documentElement.style.setProperty('--primary-color', accentColor);

    // Apply Theme Class
    const root = document.getElementById('admin-panel-root');
    if (root) {
      root.className = `admin-theme-${theme.toLowerCase()}`;
    }
  }, [theme, accentColor]);

  // User Management State
  const [users, setUsers] = useState([]);

  const [projects, setProjects] = useState([]);



  const [blogs, setBlogs] = useState([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [notification, setNotification] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Database Fetching Effect ---
  useEffect(() => {
    api.getUsers()
      .then(data => { if (data) setUsers(data); })
      .catch(err => console.error("Database error fetching users on mount:", err));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      api.getUsers()
        .then(data => { if (data) setUsers(data); })
        .catch(err => console.error("Database error fetching users:", err));

      api.getProjects()
        .then(data => { if (data) setProjects(data); })
        .catch(err => console.error("Database error fetching projects:", err));

      api.getBlogs()
        .then(data => { if (data) setBlogs(data); })
        .catch(err => console.error("Database error fetching blogs:", err));

      api.getActivities()
        .then(data => {
          if (data && data.length > 0) {
            setActivities(data);
            // Record the highest ID so the poll only fetches rows AFTER this
            lastActivityIdRef.current = Math.max(...data.map(a => a.id));
          }
        })
        .catch(err => console.error('Database error fetching activities:', err));
    }
  }, [isAuthenticated]);

  // --- Live Activity Pulse Polling (every 15 seconds) ---
  // Uses id-based polling (afterId) to avoid MySQL timezone issues.
  // Fetches only NEW rows by comparing against the highest known id.
  useEffect(() => {
    if (!isAuthenticated) return;

    const pollActivities = async () => {
      try {
        const currentMaxId = lastActivityIdRef.current;
        if (currentMaxId === 0) return; // wait for initial load

        const newItems = await api.getActivitiesAfter(currentMaxId);
        if (newItems && newItems.length > 0) {
          // Update cursor to highest new id
          const newMaxId = Math.max(...newItems.map(a => a.id));
          lastActivityIdRef.current = newMaxId;
          // Prepend genuinely new items (dedup by id just in case)
          setActivities(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const fresh = newItems.filter(a => !existingIds.has(a.id));
            if (fresh.length === 0) return prev;
            // Keep at most 500 items in memory
            const merged = [...fresh, ...prev];
            return merged.length > 500 ? merged.slice(0, 500) : merged;
          });
        }
      } catch {
        // Silently ignore poll errors — Live Pulse is best-effort
      }
    };

    const pollInterval = setInterval(pollActivities, 15000); // every 15 seconds
    return () => clearInterval(pollInterval);
  }, [isAuthenticated]);

  const [activities, setActivities] = useState([]);

  // addActivity: saves to DB optimistically, then deduplicates when the server confirms.
  // Uses the confirmed DB id to update the polling cursor.
  const addActivity = useCallback((user, action, type, status, details) => {
    const newActivity = { user, action, type, status, details };
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI: show immediately with a temp id
    setActivities(prev => [{ ...newActivity, id: tempId, timestamp: new Date().toISOString() }, ...prev]);

    api.addActivity(newActivity)
      .then(created => {
        // Update cursor to this new id so polling won't re-fetch it
        if (created.id > lastActivityIdRef.current) {
          lastActivityIdRef.current = created.id;
        }
        // Replace the temp optimistic item with the real DB record
        setActivities(prev => prev.map(a => a.id === tempId ? created : a));
      })
      .catch(err => {
        console.error('Activity log failed to save:', err.message);
        // Keep the optimistic item visible — it will be cleared on next full reload
      });
  }, []);

  const toggleFavorite = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isFavorite: !u.isFavorite } : u));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'linear-gradient(135deg, #6366F1, #818CF8)' },
    { id: 'users', label: 'Users', icon: Users, gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
    { id: 'projects', label: 'Projects', icon: LayoutPanelLeft, gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)', sub: ['All Projects', 'Delivered Projects', 'Future Projects'] },
    { id: 'blogs', label: 'Blogs', icon: FileText, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'linear-gradient(135deg, #64748B, #94A3B8)' },
    { id: 'activity', label: 'Activity Log', icon: Activity, gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await api.login({ usernameOrEmail: loginForm.email, password: loginForm.password });

      if (rememberMe) {
        localStorage.setItem('klanvision_remembered', JSON.stringify({ email: loginForm.email, password: loginForm.password }));
      } else {
        localStorage.removeItem('klanvision_remembered');
      }

      // Fetch latest users so we have up-to-date states
      const allUsers = await api.getUsers();
      if (allUsers && allUsers.length > 0) {
        setUsers(allUsers);
      }

      const user = (allUsers || users).find(u => u.email === result.email);
      if (!user) {
        setLoginError('User data could not be loaded.');
        return;
      }

      if (user.isAuthorized) {
        if (result.is2FAEnabled) {
          setVerifyingUser(user);
          if (user.is2FAConfigured) {
            setIsVerifying2FA(true);
          } else {
            setIsSettingUp2FA(true);
          }
          setLoginError('');
        } else {
          setIsAuthenticated(true);
          setCurrentUser(user);
          setLoginError('');
          addActivity(user.name, 'System Login', 'security', 'success', `Successful login from ${user.email}`);
          localStorage.setItem('klanvision_admin_session', JSON.stringify({ user, loginTime: Date.now() }));
        }
      } else {
        setLoginError('This account is not authorized to access the Panel.');
        addActivity(user.name, 'Blocked Login', 'security', 'warning', `Unauthorized access attempt from ${user.email}`);
      }
    } catch (err) {
      setLoginError('Invalid security credentials provided.');
      addActivity('System', 'Failed Login', 'security', 'warning', `Invalid attempt for ${loginForm.email}`);
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivity(currentUser.name, 'System Logout', 'security', 'info', `${currentUser.name} signed out of the admin panel.`);
    }
    localStorage.removeItem('klanvision_admin_session');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleResetRequest = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === resetEmail);
    if (user) {
      // --- PRODUCTION EMAIL CONFIGURATION ---
      // In a live environment, connect this to an email provider (e.g., SendGrid, AWS SES, Resend)
      // Example: await axios.post('/api/auth/reset-password', { email: resetEmail });
      console.log(`[Secure System] Mock Email dispatched to ${resetEmail} with reset token.`);

      setResetSuccess(`Secure reset link has been dispatched to ${resetEmail}. Please check your inbox.`);
      setLoginError('');

      // Log the security event
      addActivity(user.name, 'Password Reset Requested', 'security', 'warning', `Reset link generated and sent to ${user.email}`);

      // Auto-return to login after 4 seconds
      setTimeout(() => {
        setIsResetMode(false);
        setResetSuccess('');
        setResetEmail('');
      }, 4000);
    } else {
      setLoginError('Email not found in authorized personnel directory.');
      setResetSuccess('');
    }
  };

  const handleSaveUser = (userData) => {
    const derivedUsername = userData.email.split('@')[0];
    if (editingUser) {
      const updatedUser = {
        ...userData,
        username: derivedUsername
      };
      api.updateUser(editingUser.id, updatedUser).then(updated => {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
        addActivity(currentUser?.name || 'Admin', 'Modified User', 'security', 'info', `Updated profile for ${userData.name}`);
      }).catch(err => console.error("Error updating user:", err));
    } else {
      const newUser = {
        ...userData,
        username: derivedUsername,
        status: 'Offline',
        lastActive: 'Never',
        color: '#6366F1',
        isAuthorized: userData.isAuthorized ?? true,
        is2FAConfigured: false,
        secret2FA: Array.from({ length: 16 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]).join(''),
        failed2FAAttempts: 0
      };
      api.createUser(newUser).then(created => {
        setUsers(prev => [...prev, created]);
        addActivity(currentUser?.name || 'Admin', 'New User Created', 'security', 'success', `Added ${userData.name} to the directory.`);
      }).catch(err => console.error("Error creating user:", err));
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleUserAccess = (user) => {
    const updatedUser = {
      ...user,
      isAuthorized: !user.isAuthorized
    };
    api.updateUser(user.id, updatedUser).then(updated => {
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
      addActivity(currentUser?.name || 'Admin', 'User Access Changed', 'security', updated.isAuthorized ? 'success' : 'warning', `${updated.isAuthorized ? 'Granted' : 'Revoked'} access for ${user.name}`);
    }).catch(err => console.error("Error toggling user access:", err));
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      api.updateProject(editingProject.id, projectData).then(updated => {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
        addActivity(currentUser?.name || 'Admin', 'Project Updated', 'project', 'info', `Modified details for "${projectData.title}"`);
      }).catch(err => console.error("Error updating project:", err));
    } else {
      const newProject = {
        ...projectData,
        color: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#7C3AED'][Math.floor(Math.random() * 5)]
      };
      api.createProject(newProject).then(created => {
        setProjects(prev => [...prev, created]);
        addActivity(currentUser?.name || 'Admin', 'Project Launched', 'project', 'success', `New project "${projectData.title}" initialized.`);
      }).catch(err => console.error("Error creating project:", err));
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveBlog = (blogData) => {
    if (editingBlog) {
      api.updateBlog(editingBlog.id, blogData).then(updated => {
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? updated : b));
        addActivity(blogData.author, 'Blog Updated', 'content', 'info', `Refined "${blogData.title}"`);
      }).catch(err => console.error("Error updating blog:", err));
    } else {
      const newBlog = {
        ...blogData,
        views: '0',
        image: blogData.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
      };
      api.createBlog(newBlog).then(created => {
        setBlogs(prev => [created, ...prev]);
        addActivity(blogData.author, 'Blog Published', 'content', 'success', `Launched new article: "${blogData.title}"`);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }).catch(err => console.error("Error creating blog:", err));
    }
    setIsBlogModalOpen(false);
    setEditingBlog(null);
  };

  const handleSendMessage = (attachment) => {
    if ((!newMessage.trim() && !attachment) || !activeChatUser) return;

    if (editingMessageId) {
      api.sendMessage({
        id: editingMessageId,
        senderId: 1,
        receiverId: activeChatUser.id,
        text: newMessage,
        attachment: attachment
      }).then(updated => {
        setChatMessages(prev => prev.map(m => m.id === editingMessageId ? updated : m));
        setEditingMessageId(null);
      }).catch(err => console.error("Error editing message:", err));
    } else {
      const msg = {
        senderId: 1, // Logged in (Super Admin)
        receiverId: activeChatUser.id,
        text: newMessage,
        isRead: true,
        attachment: attachment,
        replyToId: replyingToMessageId || undefined
      };
      api.sendMessage(msg).then(created => {
        setChatMessages(prev => [...prev, created]);
        setReplyingToMessageId(null);
      }).catch(err => console.error("Error sending message:", err));
    }
    setNewMessage('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMessage = (id) => {
    api.deleteMessage(id).then(() => {
      setChatMessages(prev => prev.filter(m => m.id !== id));
    }).catch(err => console.error("Error deleting message:", err));
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    const code = authCode.join('');
    if (code.length === 6) {
      if (verifyingUser) {
        if (!verifyingUser.isAuthorized || (verifyingUser.failed2FAAttempts || 0) >= 10) {
          setLoginError('Account is BLOCKED. Contact system administrator.');
          return;
        }
        try {
          const authenticatedUser = await api.verify2FA(verifyingUser.email, code);
          setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, failed2FAAttempts: 0 } : u));
          setIsAuthenticated(true);
          setCurrentUser(authenticatedUser);
          setIsVerifying2FA(false);
          setVerifyingUser(null);
          setAuthCode(['', '', '', '', '', '']);
          setLoginError('');
          addActivity(authenticatedUser.name, '2FA Verified', 'security', 'success', `Identity verified via mobile authenticator.`);
          localStorage.setItem('klanvision_admin_session', JSON.stringify({ user: authenticatedUser, loginTime: Date.now() }));
        } catch (err) {
          const newFailCount = (verifyingUser.failed2FAAttempts || 0) + 1;
          try {
            await api.updateUser(verifyingUser.id, {
              ...verifyingUser,
              failed2FAAttempts: newFailCount,
              isAuthorized: newFailCount >= 10 ? false : verifyingUser.isAuthorized
            });
          } catch (updateErr) {
            console.error('Failed to update fail count:', updateErr);
          }

          setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, failed2FAAttempts: newFailCount, isAuthorized: newFailCount >= 10 ? false : u.isAuthorized } : u));

          if (newFailCount >= 10) {
            setLoginError('Account BLOCKED due to security violations.');
            addActivity(verifyingUser.name, 'System Lockout', 'security', 'warning', `${verifyingUser.email} blocked after 10 failures.`);
          } else {
            setLoginError(`Invalid Security Code. ${10 - newFailCount} attempts remaining.`);
          }
        }
      }
    } else {
      setLoginError('Please enter the complete 6-digit code.');
    }
  };

  const handleSetup2FA = async (e) => {
    e.preventDefault();
    const code = authCode.join('');
    if (code.length === 6) {
      if (verifyingUser) {
        try {
          // Verify code with backend
          await api.verify2FA(verifyingUser.email, code);

          // Set user 2FA configuration to true in backend database
          await api.updateUser(verifyingUser.id, {
            ...verifyingUser,
            is2FAConfigured: true,
            secret2FA: setup2FASecret || verifyingUser.secret2FA
          });

          setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, is2FAConfigured: true, failed2FAAttempts: 0 } : u));
          setIsSettingUp2FA(false);
          setIsAuthenticated(true);
          setCurrentUser({ ...verifyingUser, is2FAConfigured: true });
          setVerifyingUser(null);
          setAuthCode(['', '', '', '', '', '']);
          setLoginError('');
          addActivity(verifyingUser.name, '2FA Configured', 'security', 'success', `Initial 2FA setup completed for ${verifyingUser.email}. Now verifying.`);
          localStorage.setItem('klanvision_admin_session', JSON.stringify({ user: { ...verifyingUser, is2FAConfigured: true }, loginTime: Date.now() }));
        } catch (err) {
          setLoginError('Verification failed. Use the code shown in your app.');
        }
      }
    } else {
      setLoginError('Please enter the verification code to finalize setup.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Outfit, sans-serif' }}>
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: (isSettingUp2FA || isVerifying2FA) ? 420 : 450, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(40px)', padding: (isSettingUp2FA || isVerifying2FA) ? '40px' : '48px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {isVerifying2FA || isSettingUp2FA ? (
              <motion.div whileHover={{ rotate: 15 }} className="shield-icon-container">
                <ShieldCheck size={32} />
              </motion.div>
            ) : (
              <motion.div whileHover={{ rotate: 15 }} style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #6366F1, #EC4899, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}>
                <Lock size={32} />
              </motion.div>
            )}
            <h2 style={{ fontSize: (isSettingUp2FA || isVerifying2FA) ? 32 : 38, fontWeight: 900, color: 'white', letterSpacing: '-1px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {isSettingUp2FA ? 'Security Setup' : isVerifying2FA ? 'Identity Verification' : isResetMode ? 'Credential Reset' : 'Secure Login'}
            </h2>
            <p style={{ color: '#94A3B8', marginTop: 8, fontSize: (isSettingUp2FA || isVerifying2FA) ? 14 : 16, fontWeight: 500, lineHeight: 1.5 }}>{isSettingUp2FA ? 'Configure your Authenticator App' : isVerifying2FA ? 'Enter the 6-digit code from your app' : isResetMode ? 'Identify your account to reset' : 'Authorized personnel access only'}</p>
          </div>

          <AnimatePresence mode="wait">
            {isSettingUp2FA ? (
              <motion.form key="2fa-setup" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={handleSetup2FA} style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: -8 }}>
                  <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.5 }}>Scan this QR with <b>Google Authenticator</b><br />to link your secure account.</p>
                </div>

                <div className="qr-code-card">
                  <img
                    src={setup2FAQr || `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(`otpauth://totp/Klanvision:${verifyingUser?.email || 'Admin'}?secret=${verifyingUser?.secret2FA || 'KLANSEC'}&issuer=Klanvision`)}`}
                    alt="2FA QR Code"
                    style={{ width: 130, height: 130, borderRadius: 12, objectFit: 'contain' }}
                  />
                  {/* Scanner Brackets and Scanning Line Animation */}
                  <div className="qr-scanner-bracket bracket-tl" />
                  <div className="qr-scanner-bracket bracket-tr" />
                  <div className="qr-scanner-bracket bracket-bl" />
                  <div className="qr-scanner-bracket bracket-br" />
                  <div className="qr-scanner-line" />
                </div>

                <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ fontSize: 11, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 4 }}>Manual Entry Key</p>
                  <div className="manual-key-box">
                    {setup2FASecret || verifyingUser?.secret2FA || 'JBSWY3DPEBLW64TMMQ'}
                  </div>
                </div>

                <div className="otp-inputs-container">
                  {authCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`setup-code-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      autoFocus={idx === 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          const newCode = [...authCode];
                          newCode[idx] = val;
                          setAuthCode(newCode);
                          if (val && idx < 5) {
                            document.getElementById(`setup-code-${idx + 1}`)?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !authCode[idx] && idx > 0) {
                          document.getElementById(`setup-code-${idx - 1}`)?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedData = e.clipboardData.getData('Text');
                        if (/^\d{6}$/.test(pastedData)) {
                          e.preventDefault();
                          const newCode = pastedData.split('');
                          setAuthCode(newCode);
                          const lastField = document.getElementById(`setup-code-5`);
                          lastField?.focus();
                        }
                      }}
                      className={digit ? "otp-input-field filled" : "otp-input-field"}
                    />
                  ))}
                </div>

                {loginError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{loginError}</div>}

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                  <button type="submit" className="complete-setup-btn">COMPLETE SETUP</button>
                  <button type="button" onClick={() => { setIsSettingUp2FA(false); setVerifyingUser(null); setAuthCode(['', '', '', '', '', '']); setLoginError(''); }} className="cancel-logout-btn">Cancel & Log Out</button>
                </div>
              </motion.form>
            ) : isVerifying2FA ? (
              <motion.form key="2fa" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', width: '100%' }}>
                <div className="otp-inputs-container">
                  {authCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`code-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      autoFocus={idx === 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          const newCode = [...authCode];
                          newCode[idx] = val;
                          setAuthCode(newCode);
                          if (val && idx < 5) {
                            document.getElementById(`code-${idx + 1}`)?.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !authCode[idx] && idx > 0) {
                          document.getElementById(`code-${idx - 1}`)?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedData = e.clipboardData.getData('Text');
                        if (/^\d{6}$/.test(pastedData)) {
                          e.preventDefault();
                          const newCode = pastedData.split('');
                          setAuthCode(newCode);
                          const lastField = document.getElementById(`code-5`);
                          lastField?.focus();
                        }
                      }}
                      className={digit ? "otp-input-field filled" : "otp-input-field"}
                    />
                  ))}
                </div>

                {loginError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{loginError}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
                  <button type="submit" className="complete-setup-btn verification-btn">VERIFY ACCESS</button>
                  <button type="button" onClick={() => { setIsVerifying2FA(false); setVerifyingUser(null); setAuthCode(['', '', '', '', '', '']); setLoginError(''); }} className="cancel-logout-btn">Cancel & Logout</button>
                </div>
              </motion.form>
            ) : !isResetMode ? (
              <motion.form
                key="login"
                id="klanvision-admin-login"
                name="loginForm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
              >
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#CBD5E1', marginBottom: 12, letterSpacing: '1px' }}>SYSTEM EMAIL OR USERNAME</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input type="text" name="email" autoComplete="username" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="e.g. admin or admin@klanvision.com" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 900, color: '#CBD5E1', letterSpacing: '1px' }}>SECURITY PASSWORD</label>
                    <button type="button" onClick={() => { setIsResetMode(true); setLoginError(''); }} style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>FORGOT?</button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Shield size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" style={{ width: '100%', padding: '16px 48px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0 }}>
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }} onClick={() => setRememberMe(!rememberMe)}>
                  <div style={{ width: 18, height: 18, borderRadius: 6, border: `2px solid ${rememberMe ? '#6366F1' : 'rgba(255,255,255,0.2)'}`, background: rememberMe ? '#6366F1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                    {rememberMe && <Check size={12} color="white" strokeWidth={4} />}
                  </div>
                  <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>Remember Password</span>
                </div>

                {loginError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{loginError}</div>}

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '20px 48px', borderRadius: 18, fontSize: 16, fontWeight: 900, minWidth: 240 }}>AUTHENTICATE</button>
                </div>
              </motion.form>
            ) : (
              <motion.form key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#CBD5E1', marginBottom: 12, letterSpacing: '1px' }}>RECOVERY EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Enter your system email" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
                  </div>
                </div>

                {loginError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{loginError}</div>}
                {resetSuccess && <div style={{ color: '#10B981', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{resetSuccess}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: 20, borderRadius: 18 }}>SEND RESET LINK</button>
                  <button type="button" onClick={() => { setIsResetMode(false); setLoginError(''); setResetSuccess(''); }} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 10 }}>Back to Login</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#475569', fontWeight: 700, letterSpacing: '0.5px' }}>PROTECTED BY END-TO-END ENCRYPTION</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="admin-panel-root" className={`admin-layout admin-theme-${theme.toLowerCase()}`} style={{
      display: 'flex',
      minHeight: '100vh',
      background: theme === 'Dark' ? '#0F172A' : theme === 'Light' ? '#F8FAFC' : '#050505',
      color: theme === 'Light' ? '#1E293B' : '#F8FAFC',
      fontFamily: 'Outfit, sans-serif',
      transition: 'all 0.4s ease'
    }}>

      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 100 }}
        className="admin-sidebar" style={{
          background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex',
          flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', zIndex: 50
        }}
      >
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} style={{ width: 42, height: 42, borderRadius: 14, background: platformLogo ? 'transparent' : 'linear-gradient(135deg, #6366F1, #EC4899, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: platformLogo ? 'none' : '0 8px 20px rgba(99, 102, 241, 0.4)', overflow: 'hidden' }}>
            {platformLogo ? (
              <img src={platformLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontWeight: 900, fontSize: 20 }}>K</span>
            )}
          </motion.div>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontWeight: 900,
                fontSize: 22,
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #FFFFFF, #6366F1, #EC4899, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            >
              {companyName}
            </motion.span>
          )}
        </div>

        <nav style={{ padding: '20px 16px', flex: 1 }}>
          {navItems.filter(item => {
            const perms = currentUser?.permissions || [];
            // Super admin or ALL_ACCESS bypasses all checks
            if (perms.includes('ALL_ACCESS') || perms.includes('SUPER_ADMIN')) return true;
            // Map each nav tab to its required permission
            const permMap = {
              dashboard:  null,             // always visible
              users:      'MANAGE_USERS',
              projects:   'MANAGE_PROJECTS',
              blogs:      'MANAGE_BLOGS',
              settings:   'MANAGE_SEO',
              activity:   'MANAGE_ACTIVITIES',
            };
            const required = permMap[item.id];
            return required === null || perms.includes(required);
          }).map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 16, border: 'none', background: activeTab === item.id ? item.gradient : 'transparent', color: activeTab === item.id ? 'white' : '#94A3B8', cursor: 'pointer', transition: 'all 0.3s', marginBottom: 8, fontWeight: 700, fontSize: 14 }}>
              <item.icon size={20} />
              {isSidebarOpen && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px', borderRadius: 16, border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      <main className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <header className="admin-header" style={{ height: 90, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutPanelLeft size={22} />
            </button>
            <div style={{ position: 'relative', marginTop: 8 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder={`Search in ${activeTab}...`}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 20px 12px 48px', width: 340, fontSize: 14, color: 'white', outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 32, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{currentUser?.name || 'Alex Rivera'}</div>
                <div style={{ fontSize: 11, color: '#6366F1', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>{currentUser?.role || 'SYSTEM ADMIN'}</div>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Alex Rivera')}&background=1E293B&color=fff`} alt="Profile" style={{ width: 44, height: 44, borderRadius: 11 }} />
            </div>
          </div>
        </header>

        {/* --- COMMAND PALETTE OVERLAY --- */}
        <AnimatePresence>
          {isCommandPaletteOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', paddingLeft: 20, paddingRight: 20 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCommandPaletteOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
                style={{ width: '100%', maxWidth: 700, background: '#0F172A', borderRadius: 24, border: '1px solid rgba(99, 102, 241, 0.3)', position: 'relative', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.8), 0 0 40px rgba(99, 102, 241, 0.1)' }}
              >
                <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Zap size={24} color="#6366F1" />
                  <input
                    autoFocus
                    placeholder="Type a command or search..."
                    value={commandQuery}
                    onChange={(e) => setCommandQuery(e.target.value)}
                    style={{ flex: 1, background: 'none', border: 'none', color: 'white', fontSize: 18, fontWeight: 600, outline: 'none' }}
                  />
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6 }}>ESC</div>
                </div>
                <div style={{ padding: 12, maxHeight: 400, overflowY: 'auto' }}>
                  <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 900, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Actions</div>
                  {[
                    { icon: LayoutDashboard, label: 'Go to Dashboard', tab: 'dashboard' },
                    { icon: Users, label: 'Manage Team', tab: 'users' },
                    { icon: LayoutPanelLeft, label: 'View Projects', tab: 'projects' },
                    { icon: FileText, label: 'Edit Blogs', tab: 'blogs' },
                    { icon: Activity, label: 'System Audit', tab: 'activity' }
                  ].filter(item => item.label.toLowerCase().includes(commandQuery.toLowerCase())).map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => { setActiveTab(item.tab); setIsCommandPaletteOpen(false); setCommandQuery(''); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 12, border: 'none', background: 'transparent', color: '#94A3B8', cursor: 'pointer', transition: '0.2s', textAlign: 'left' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = 'white'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
                    >
                      <item.icon size={18} />
                      <span style={{ fontWeight: 700 }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div style={{ padding: '40px', maxWidth: 1600, margin: '0 auto', width: '100%' }}>
          <SearchCommander
            activeTab={activeTab}
            query={globalSearchQuery}
            setQuery={setGlobalSearchQuery}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            projectStatusFilter={projectStatusFilter}
            setProjectStatusFilter={setProjectStatusFilter}
            blogCategoryFilter={blogCategoryFilter}
            setBlogCategoryFilter={setBlogCategoryFilter}
          />
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView projects={projects} users={users} blogs={blogs} activities={activities} setActiveTab={setActiveTab} />}
            {activeTab === 'users' && (
              <UsersView
                users={users}
                onAddClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                onEditClick={(user) => { setEditingUser(user); setIsUserModalOpen(true); }}
                onDeleteClick={(id) => {
                  api.deleteUser(id).then(() => {
                    const user = users.find(u => u.id === id);
                    setUsers(prev => prev.filter(u => u.id !== id));
                    if (user) addActivity(currentUser?.name || 'Admin', 'User Removed', 'security', 'warning', `Deleted account for ${user.name}`);
                  }).catch(err => console.error("Error deleting user:", err));
                }}
                onToggleAccess={handleToggleUserAccess}
                searchQuery={globalSearchQuery}
                roleFilter={userRoleFilter}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsView
                projects={projects}
                onAddClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                onEditClick={(project) => { setEditingProject(project); setIsProjectModalOpen(true); }}
                onDeleteClick={(id) => {
                  api.deleteProject(id).then(() => {
                    const project = projects.find(p => p.id === id);
                    setProjects(prev => prev.filter(p => p.id !== id));
                    if (project) addActivity(currentUser?.name || 'Admin', 'Project Terminated', 'project', 'warning', `Removed project "${project.title}"`);
                  }).catch(err => console.error("Error deleting project:", err));
                }}
                searchQuery={globalSearchQuery}
                statusFilter={projectStatusFilter}
              />
            )}
            {activeTab === 'blogs' && (
              <BlogsView
                blogs={blogs}
                onAddClick={() => { setEditingBlog(null); setIsBlogModalOpen(true); }}
                onEditClick={(blog) => { setEditingBlog(blog); setIsBlogModalOpen(true); }}
                onDeleteClick={(id) => {
                  api.deleteBlog(id).then(() => {
                    const blog = blogs.find(b => b.id === id);
                    setBlogs(prev => prev.filter(b => b.id !== id));
                    if (blog) addActivity(currentUser?.name || 'Admin', 'Blog Deleted', 'content', 'warning', `Removed article "${blog.title}"`);
                  }).catch(err => console.error("Error deleting blog:", err));
                }}
                searchQuery={globalSearchQuery}
                categoryFilter={blogCategoryFilter}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsView
                theme={theme} setTheme={setTheme}
                accentColor={accentColor} setAccentColor={setAccentColor}
                glassIntensity={glassIntensity} setGlassIntensity={setGlassIntensity}
                twoFactor={twoFactor} setTwoFactor={setTwoFactor}
                maintenanceMode={maintenanceMode} setMaintenanceMode={setMaintenanceMode}
                platformLogo={platformLogo} setPlatformLogo={setPlatformLogo}
                companyName={companyName} setCompanyName={setCompanyName}
                addActivity={addActivity}
              />
            )}
            {activeTab === 'activity' && <ActivityView activities={activities} />}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Notification Toast --- */}
      <AnimatePresence>
        {notification?.show && (
          <motion.div
            initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
            style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1000, background: '#1E293B', padding: '20px 32px', borderRadius: 24, border: '1px solid rgba(99, 102, 241, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 20 }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} color="#6366F1" />
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 900 }}>{notification.user || 'System'}</h4>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{notification.msg}</p>
            </div>
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginLeft: 20 }}><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Blog Modal --- */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBlogModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              style={{ width: '100%', maxWidth: 850, background: '#0F172A', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
            >
              <div style={{ padding: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                  <div>
                    <h3 style={{ fontSize: 28, fontWeight: 900 }}>{editingBlog ? 'Refine Masterpiece' : 'Create Industry Impact'}</h3>
                    <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 6 }}>Craft a compelling narrative for the Klanvision community.</p>
                  </div>
                  <button onClick={() => setIsBlogModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
                </div>

                <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 10, margin: '0 -10px' }}>
                  <div style={{ padding: '0 10px' }}>
                    <BlogForm
                      initialData={editingBlog}
                      onSave={handleSaveBlog}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Celebration Particles --- */}
      <AnimatePresence>
        {showCelebration && <CelebrationEffect />}
      </AnimatePresence>

      {/* --- Project Modal --- */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 600, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: 40, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 900 }}>{editingProject ? 'Edit Project' : 'New Venture'}</h3>
                    <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Define goals and assign team assets.</p>
                  </div>
                  <button onClick={() => setIsProjectModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                </div>

                <ProjectForm
                  initialData={editingProject}
                  teamMembers={users}
                  onSave={handleSaveProject}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Add/Edit User Modal --- */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUserModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 500, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: 40, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 900 }}>{editingUser ? 'Modify Member' : 'New Member'}</h3>
                    <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Configure access and credentials.</p>
                  </div>
                  <button onClick={() => setIsUserModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                </div>

                <UserForm
                  initialData={editingUser}
                  onSave={handleSaveUser}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function UserForm({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'Viewer',
    permissions: initialData?.permissions || [],
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
      alert('Please provide a name and email.');
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
          <input type={showPass ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
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
        <div className={`admin-grid-2 gap-${12}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

function UsersView({ users, onAddClick, onEditClick, onDeleteClick, onToggleAccess, searchQuery, roleFilter }) {
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
        <button onClick={onAddClick} className="btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
          <UserPlus size={22} /> Add Member
        </button>
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
                      onClick={() => onToggleAccess && onToggleAccess(user)}
                      style={{
                        width: 36, height: 18, borderRadius: 20, background: user.isAuthorized ? '#6366F1' : 'rgba(255,255,255,0.1)',
                        position: 'relative', cursor: 'pointer', transition: '0.3s', display: 'inline-block'
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

              <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                <button onClick={() => onEditClick(user)} style={{ flex: 1, padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Edit2 size={16} /> Modify</button>
                <button onClick={() => onDeleteClick(user.id)} style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={20} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProjectForm({ initialData, teamMembers, onSave }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    client: initialData?.client || '',
    status: initialData?.status || 'Active',
    priority: initialData?.priority || 'Medium',
    progress: initialData?.progress || 0,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    deadline: initialData?.deadline || '',
    assignedTeam: initialData?.assignedTeam || [],
    description: initialData?.description || '',
    comments: initialData?.comments || ''
  });

  const handleAction = () => {
    if (!formData.title || !formData.client || !formData.deadline) {
      alert('Project title, client, and deadline are required.');
      return;
    }
    onSave(formData);
  };

  const toggleTeamMember = (name) => {
    setFormData(prev => ({
      ...prev,
      assignedTeam: prev.assignedTeam.includes(name)
        ? prev.assignedTeam.filter(n => n !== name)
        : [...prev.assignedTeam, name]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className={`admin-grid-2 gap-${16}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>PROJECT TITLE</label>
          <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Apollo Interface" style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>CLIENT NAME</label>
          <input type="text" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="e.g. SpaceX" style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
        </div>
      </div>

      <div className={`admin-grid-2 gap-${16}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>STATUS</label>
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>

            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>PRIORITY</label>
          <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className={`admin-grid-2 gap-${16}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>START DATE</label>
          <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', colorScheme: 'dark' }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>DEADLINE</label>
          <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', colorScheme: 'dark' }} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>PROJECT PURPOSE & DESCRIPTION</label>
        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="What is the main objective of this project?" style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: 80, outline: 'none', resize: 'vertical' }} />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>STATUS UPDATE & COMMENTS</label>
        <textarea value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })} placeholder="Leave a comment regarding the current status..." style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: 80, outline: 'none', resize: 'vertical' }} />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 12 }}>ASSIGN TEAM MEMBERS</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {teamMembers.map(member => (
            <div
              key={member.id} onClick={() => toggleTeamMember(member.name)}
              style={{
                padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
                background: formData.assignedTeam.includes(member.name) ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                borderColor: formData.assignedTeam.includes(member.name) ? '#6366F1' : 'rgba(255,255,255,0.05)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: '0.2s', fontSize: 12, fontWeight: 700
              }}
            >
              <img src={`https://ui-avatars.com/api/?name=${member.name}&background=1E293B&color=fff`} style={{ width: 20, height: 20, borderRadius: 6 }} />
              <span style={{ color: formData.assignedTeam.includes(member.name) ? 'white' : '#64748B' }}>{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleAction} className="btn-primary" style={{ marginTop: 12, width: '100%', padding: 18, fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Rocket size={20} /> {initialData ? 'Update Project Blueprint' : 'Launch New Project'}
      </button>
    </div>
  );
}


function ProjectsView({ projects, onAddClick, onEditClick, onDeleteClick, searchQuery, statusFilter }) {
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Critical': return '#EF4444';
      case 'High': return '#F59E0B';
      case 'Medium': return '#3B82F6';
      default: return '#10B981';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 44 }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px' }}>Project <span className="gradient-text">Control</span></h2>
          <p style={{ color: '#94A3B8', marginTop: 10, fontSize: 18 }}>Manage high-impact initiatives and milestones.</p>
        </div>
        <button onClick={onAddClick} className="btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
          <Plus size={22} /> Initiate Project
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <div className="admin-grid-cards-420" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {filteredProjects.map((p) => (
            <motion.div key={p.id} layout whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '40px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: p.color }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h4 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{p.title}</h4>
                  <p style={{ fontSize: 15, color: '#94A3B8' }}>{p.client}</p>
                </div>
                <div style={{ padding: '6px 14px', borderRadius: 10, background: `${getPriorityColor(p.priority)}15`, color: getPriorityColor(p.priority), fontSize: 11, fontWeight: 900, letterSpacing: '1px' }}>
                  {p.priority.toUpperCase()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={16} color="#64748B" />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#475569' }}>DEADLINE</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.deadline}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={16} color="#64748B" />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#475569' }}>TEAM</div>
                    <div style={{ display: 'flex', gap: -8 }}>
                      {p.assignedTeam.map((name, idx) => (
                        <img key={idx} src={`https://ui-avatars.com/api/?name=${name}&background=1E293B&color=fff`} style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid #1E293B' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 12 }}>
                  <span style={{ color: '#64748B' }}>COMPLETION</span>
                  <span style={{ color: p.color }}>{p.progress}%</span>
                </div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: p.color, borderRadius: 10, boxShadow: `0 0 20px ${p.color}40` }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                <button onClick={() => onEditClick(p)} style={{ flex: 1, padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Edit2 size={16} /> Manage</button>
                <button onClick={() => onDeleteClick(p.id)} style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function BlogsView({ blogs, onAddClick, onEditClick, onDeleteClick, searchQuery, categoryFilter }) {
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 44 }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px' }}>Insight <span className="gradient-text">Engine</span></h2>
          <p style={{ color: '#94A3B8', marginTop: 10, fontSize: 18 }}>Publish thought leadership and company milestones.</p>
        </div>
        <button onClick={onAddClick} className="btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
          <Plus size={22} /> Draft Article
        </button>
      </div>

      {filteredBlogs.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <div className="admin-grid-cards-380" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {filteredBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              layout
              whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
              style={{
                background: 'rgba(30, 41, 59, 0.4)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                <img src={blog.image} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} />
                <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(99, 102, 241, 0.9)', color: 'white', padding: '6px 16px', borderRadius: 12, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {blog.category}
                </div>
                <div style={{ position: 'absolute', top: 20, right: blog.featured ? 120 : 20, background: blog.status === 'Draft' ? '#64748B' : '#10B981', color: 'white', padding: '6px 12px', borderRadius: 10, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {blog.status || 'Published'}
                </div>
                {blog.featured && (
                  <div style={{ position: 'absolute', top: 20, right: 20, background: '#F59E0B', color: 'black', padding: '6px 12px', borderRadius: 10, fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={12} fill="black" /> FEATURED
                  </div>
                )}
              </div>

              <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 700 }}>
                    <Calendar size={14} /> {blog.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B', fontWeight: 700 }}>
                    <Clock size={14} /> {blog.readTime}
                  </div>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.4, marginBottom: 20, flex: 1 }}>{blog.title}</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={`https://ui-avatars.com/api/?name=${blog.author}&background=6366F1&color=fff`} style={{ width: 32, height: 32, borderRadius: 10 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{blog.author}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6366F1', fontWeight: 800 }}>
                    <Activity size={14} /> {blog.views}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => onEditClick(blog)} style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => onDeleteClick(blog.id)} style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
function BlogForm({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Technology',
    author: initialData?.author || '',
    authorRole: 'Chief Architect', // Simulated role field
    date: initialData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
    readTime: initialData?.readTime || '5 min',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    excerpt: initialData?.excerpt || '',
    status: initialData?.status || 'Published',
    content: initialData?.content || '',
    authorLink: initialData?.authorLink || ''
  });

  const handleAction = () => {
    if (!formData.title || !formData.content || !formData.author) {
      alert('Title, Author, and Content are mandatory for saving.');
      return;
    }
    onSave(formData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div className={`admin-grid-3 gap-${20}`} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 20 }}>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>ARTICLE HEADLINE</label>
          <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Catchy, impactful title..." style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', fontSize: 15 }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>AUTHOR NAME</label>
          <div style={{ position: 'relative' }}>
            <Users size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="e.g. Kiran Kumar Moopuri" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', fontSize: 15 }} />
          </div>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>AUTHOR PERSONAL LINK</label>
          <div style={{ position: 'relative' }}>
            <Link2 size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input type="url" value={formData.authorLink || ''} onChange={e => setFormData({ ...formData, authorLink: e.target.value })} placeholder="https://github.com/..." style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', fontSize: 15 }} />
          </div>
        </div>
      </div>

      <div className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>CATEGORY</label>
          <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer' }}>
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="AI">AI</option>
            <option value="Security">Security</option>
            <option value="Strategy">Strategy</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>STATUS</label>
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer' }}>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>EST. READ TIME</label>
          <input type="text" value={formData.readTime} onChange={e => setFormData({ ...formData, readTime: e.target.value })} placeholder="e.g. 5 min" style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>PUBLISHED DATE</label>
          <input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }} />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>HERO IMAGE (URL OR UPLOAD)</label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://... or click Upload" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }} />
          </div>
          <button type="button" onClick={() => document.getElementById('blog-image-upload')?.click()} style={{ padding: '0 24px', borderRadius: 16, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818CF8', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <Upload size={18} /> Upload
          </button>
          <input id="blog-image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }} />
        </div>
        {formData.image && formData.image.length > 500 && <p style={{ fontSize: 11, color: '#10B981', marginTop: 8, fontWeight: 700 }}>✓ Local image uploaded successfully</p>}
      </div>

      <div className="form-group">
        <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginBottom: 12, letterSpacing: '1px' }}>EXCERPT / SHORT SUMMARY</label>
        <textarea
          value={formData.excerpt}
          onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="A brief, engaging summary of the article..."
          style={{ width: '100%', height: 80, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', resize: 'none', fontSize: 14 }}
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 900, color: '#475569', letterSpacing: '1px' }}>CONTENT EDITOR</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: 'white' }}><Star size={14} /></button>
            <button type="button" style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: 'white' }}><Activity size={14} /></button>
          </div>
        </div>
        <textarea
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          placeholder="Begin your story here..."
          style={{ width: '100%', height: 250, padding: '24px', borderRadius: 24, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: '#CBD5E1', outline: 'none', resize: 'none', fontSize: 16, lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderRadius: 24, background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 800 }}>Feature this post?</h4>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Featured posts appear at the top of the insight engine.</p>
        </div>
        <div
          onClick={() => setFormData({ ...formData, featured: !formData.featured })}
          style={{ width: 52, height: 26, borderRadius: 20, background: formData.featured ? '#6366F1' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
        >
          <motion.div animate={{ x: formData.featured ? 28 : 4 }} style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
        </div>
      </div>

      <button onClick={handleAction} className="btn-primary" style={{ padding: 24, borderRadius: 20, fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}>
        <Zap size={22} fill="white" /> {formData.status === 'Draft' ? 'SAVE AS DRAFT' : (initialData ? 'PUBLISH UPDATES' : 'PUBLISH ARTICLE')}
      </button>
    </div>
  );
}

function CelebrationEffect() {
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

function SettingsView({
  theme, setTheme,
  accentColor, setAccentColor,
  glassIntensity, setGlassIntensity,
  twoFactor, setTwoFactor,
  maintenanceMode, setMaintenanceMode,
  platformLogo, setPlatformLogo,
  companyName, setCompanyName,
  addActivity
}) {
  const [activeSection, setActiveSection] = useState('Interface');
  const [saveStatus, setSaveStatus] = useState(null);

  // Mock states for other settings
  const [notifications, setNotifications] = useState({ system: true, email: false, desktop: true });
  const [timezone, setTimezone] = useState('GMT+5:30 (India)');

  const sections = [
    { name: 'Interface', icon: LayoutPanelLeft, desc: 'Customize the visual identity and workspace theme.' },
    { name: 'Security', icon: ShieldCheck, desc: 'Manage encryption, session logs, and access protocols.' },
    { name: 'Notifications', icon: Bell, desc: 'Configure system alerts and internal communication relays.' },
    { name: 'Branding', icon: Star, desc: 'Update logos, brand palettes, and client-facing assets.' },
    { name: 'System', icon: Settings, desc: 'Core platform parameters and diagnostic controls.' }
  ];

  const handleSave = () => {
    setSaveStatus('Configuring system parameters...');
    setTimeout(() => {
      setSaveStatus('Settings updated successfully.');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 40, right: 40, zIndex: 1000, background: saveStatus.includes('success') ? '#10B981' : '#6366F1', padding: '16px 32px', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          {saveStatus.includes('success') ? <Check size={20} /> : <Zap size={20} className="animate-pulse" />}
          <span style={{ fontWeight: 800, color: 'white' }}>{saveStatus.toUpperCase()}</span>
        </motion.div>
      )}

      <motion.div className="admin-settings-layout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 40, height: 'calc(100vh - 280px)' }}>
        {/* Settings Navigation */}
        <div className="settings-sidebar" style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map((section) => (
            <motion.div
              key={section.name}
              onClick={() => setActiveSection(section.name)}
              whileHover={{ x: 10 }}
              style={{
                padding: '20px 24px', borderRadius: 24, cursor: 'pointer',
                background: activeSection === section.name ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeSection === section.name ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                transition: '0.3s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ color: activeSection === section.name ? '#6366F1' : '#64748B' }}>
                  <section.icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: activeSection === section.name ? 'white' : '#94A3B8' }}>{section.name}</h4>
                </div>
              </div>
            </motion.div>
          ))}

          <div style={{ marginTop: 'auto', padding: 24, borderRadius: 24, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#F87171' }}>Maintenance Mode</h4>
                <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Gate client-side access.</p>
              </div>
              <div
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                style={{ width: 44, height: 22, borderRadius: 20, background: maintenanceMode ? '#EF4444' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              >
                <motion.div animate={{ x: maintenanceMode ? 24 : 4 }} style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content Area */}
        <div style={{ flex: 1, background: 'rgba(15, 23, 42, 0.4)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', padding: 48, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>{activeSection} <span className="gradient-text">Configuration</span></h2>
                  <p style={{ color: '#94A3B8', fontSize: 16 }}>{sections.find(s => s.name === activeSection)?.desc}</p>
                </div>
                <button onClick={handleSave} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 14, fontSize: 13 }}>SAVE CHANGES</button>
              </div>

              {activeSection === 'Interface' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <SettingRow title="System Theme" desc="Switch between different visual styles for the dashboard.">
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['Dark', 'Light', 'Neon'].map(t => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          style={{
                            padding: '12px 24px', borderRadius: 14,
                            background: theme === t ? '#6366F1' : 'rgba(255,255,255,0.05)',
                            border: 'none', color: 'white', fontSize: 13, fontWeight: 900, cursor: 'pointer',
                            boxShadow: theme === t ? '0 10px 20px rgba(99, 102, 241, 0.3)' : 'none',
                            transition: '0.3s'
                          }}
                        >
                          {t.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </SettingRow>
                  <SettingRow title="Accent Color" desc="Define the primary brand color for buttons and highlights.">
                    <div style={{ display: 'flex', gap: 16 }}>
                      {['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'].map(c => (
                        <motion.div
                          key={c}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAccentColor(c)}
                          style={{
                            width: 40, height: 40, borderRadius: '50%', background: c, cursor: 'pointer',
                            border: accentColor === c ? '4px solid white' : 'none',
                            boxShadow: accentColor === c ? `0 0 20px ${c}` : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </SettingRow>
                  <SettingRow title="Glassmorphism Intensity" desc="Adjust the background blur effect for all panels.">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <input
                        type="range" min="0" max="100"
                        value={glassIntensity}
                        onChange={(e) => setGlassIntensity(parseInt(e.target.value))}
                        style={{ width: 300, accentColor: accentColor }}
                      />
                      <span style={{ fontWeight: 900, color: accentColor }}>{glassIntensity}%</span>
                    </div>
                  </SettingRow>
                </div>
              )}

              {activeSection === 'Security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <SettingRow title="Two-Factor Authentication" desc="Require a secondary code for all administrative logins.">
                    <div
                      onClick={() => setTwoFactor(!twoFactor)}
                      style={{ width: 56, height: 28, borderRadius: 20, background: twoFactor ? '#10B981' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                    >
                      <motion.div animate={{ x: twoFactor ? 30 : 4 }} style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
                    </div>
                  </SettingRow>
                  <SettingRow title="Session Timeout" desc="Automatically logout after a period of inactivity.">
                    <select style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '14px 20px', borderRadius: 14, outline: 'none', cursor: 'pointer' }}>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>8 Hours</option>
                      <option>No Timeout</option>
                    </select>
                  </SettingRow>
                  <SettingRow title="IP White-listing" desc="Restrict access to specific authorized network addresses.">
                    <input type="text" placeholder="e.g. 192.168.1.1, 10.0.0.5" style={{ width: 400, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  </SettingRow>
                </div>
              )}

              {activeSection === 'Notifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <SettingRow title="System Alerts" desc="Receive real-time notifications for critical system events.">
                    <div
                      onClick={() => setNotifications({ ...notifications, system: !notifications.system })}
                      style={{ width: 56, height: 28, borderRadius: 20, background: notifications.system ? accentColor : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                    >
                      <motion.div animate={{ x: notifications.system ? 30 : 4 }} style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
                    </div>
                  </SettingRow>
                  <SettingRow title="Email Reports" desc="Receive weekly activity summaries and security audits.">
                    <div
                      onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                      style={{ width: 56, height: 28, borderRadius: 20, background: notifications.email ? accentColor : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                    >
                      <motion.div animate={{ x: notifications.email ? 30 : 4 }} style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
                    </div>
                  </SettingRow>
                  <SettingRow title="Desktop Push" desc="Enable browser-based push notifications for chat messages.">
                    <div
                      onClick={() => setNotifications({ ...notifications, desktop: !notifications.desktop })}
                      style={{ width: 56, height: 28, borderRadius: 20, background: notifications.desktop ? accentColor : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                    >
                      <motion.div animate={{ x: notifications.desktop ? 30 : 4 }} style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
                    </div>
                  </SettingRow>
                </div>
              )}

              {activeSection === 'Branding' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <SettingRow title="Platform Logo" desc="Upload the main company logo for the sidebar.">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                      <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', overflow: 'hidden' }}>
                        {platformLogo ? (
                          <img src={platformLogo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <Rocket size={32} />
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          className="btn-primary" style={{ padding: '12px 24px', borderRadius: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                          <Upload size={16} /> UPLOAD NEW
                        </button>
                        {platformLogo && (
                          <button
                            onClick={() => setPlatformLogo(null)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: 'none', padding: '12px 24px', borderRadius: 14, fontSize: 13, fontWeight: 900, cursor: 'pointer' }}
                          >
                            REMOVE
                          </button>
                        )}
                        <input
                          type="file" id="logo-upload" hidden accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPlatformLogo(reader.result);
                                addActivity('Super Admin', 'Logo Updated', 'system', 'success', 'Platform branding logo has been updated.');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </SettingRow>
                  <SettingRow title="Company Name" desc="Used in emails, notifications and browser title.">
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ width: 400, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontWeight: 700 }} />
                  </SettingRow>
                </div>
              )}

              {activeSection === 'System' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <SettingRow title="Server Timezone" desc="Determines the timestamp for logs and schedules.">
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ width: 400, background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '14px 20px', borderRadius: 14, outline: 'none', cursor: 'pointer' }}>
                      <option>GMT+5:30 (India)</option>
                      <option>GMT+0:00 (UTC)</option>
                      <option>GMT-7:00 (Pacific)</option>
                    </select>
                  </SettingRow>
                  <SettingRow title="Platform Version" desc="Current build and internal framework version.">
                    <div style={{ padding: '14px 24px', borderRadius: 14, background: 'rgba(99, 102, 241, 0.1)', color: accentColor, fontWeight: 900, display: 'inline-block' }}>v3.4.2-STABLE</div>
                  </SettingRow>
                  <SettingRow title="Cache Management" desc="Clear local system cache and reset active sessions.">
                    <button style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 800, cursor: 'pointer' }}>Purge System Cache</button>
                  </SettingRow>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


function SettingRow({ title, desc, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 48 }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{title}</h4>
        <p style={{ fontSize: 13, color: '#64748B' }}>{desc}</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

// --- SEARCH COMMANDER COMPONENT ---
function SearchCommander({ activeTab, query, setQuery, userRoleFilter, setUserRoleFilter, projectStatusFilter, setProjectStatusFilter, blogCategoryFilter, setBlogCategoryFilter }) {
  if (activeTab === 'dashboard' || activeTab === 'settings' || activeTab === 'activity') return null;

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

function ActivityStat({ label, value, icon: Icon, color }) {
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px', borderRadius: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        <Icon size={28} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      </div>
    </div>
  );
}

function ActivityView({ activities }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Activity Stats */}
      <div className={`admin-grid-4 gap-${24}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        <ActivityStat label="Total Events" value={activities.length} icon={Activity} color="#6366F1" />
        <ActivityStat label="Security Alerts" value={activities.filter(a => a.status === 'warning').length} icon={Shield} color="#EF4444" />
        <ActivityStat label="System Logs" value={activities.filter(a => a.type === 'system').length} icon={Settings} color="#F59E0B" />
        <ActivityStat label="Active Users" value="12" icon={Users} color="#10B981" />
      </div>

      <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', padding: 48 }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 48 }}>Real-Time <span className="gradient-text">Activity Pulse</span></h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #6366F1, transparent)', opacity: 0.2 }} />

          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ display: 'flex', gap: 32, marginBottom: 40, position: 'relative', zIndex: 1 }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 16, background: '#0F172A', border: `2px solid ${activity.status === 'warning' ? '#EF4444' : activity.status === 'info' ? '#F59E0B' : '#6366F1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${activity.status === 'warning' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
              }}>
                {activity.type === 'security' && <Shield size={20} color={activity.status === 'warning' ? '#EF4444' : '#6366F1'} />}
                {activity.type === 'project' && <Rocket size={20} color="#6366F1" />}
                {activity.type === 'content' && <FileText size={20} color="#6366F1" />}
                {activity.type === 'system' && <Settings size={20} color="#F59E0B" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 800 }}>{activity.action}</h4>
                    <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 4 }}>{activity.details}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '1px' }}>{activity.user}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <Clock size={12} /> {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DashboardView({ projects, users, activities, setActiveTab }) {
  const deliveredCount = projects.filter((p) => p.status === 'Delivered').length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Active').length;
  const upcomingCount = projects.filter((p) => p.status === 'Planning' || p.status === 'Upcoming').length;
  const successRate = "98.4%";

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* --- ELITE COMMAND CENTER BACKGROUND --- */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: -1, background: '#0F172A' }}>
        {/* Deep Space Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #1E293B 0%, #0F172A 100%)' }} />

        {/* Floating Data Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 2000,
              y: Math.random() * 2000,
              opacity: Math.random() * 0.3
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity, ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: 2,
              height: 2,
              background: '#6366F1',
              borderRadius: '50%',
              boxShadow: '0 0 10px #6366F1'
            }}
          />
        ))}

        {/* Moving Nebula Layers */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '-20%', left: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)', filter: 'blur(100px)' }}
        />

        {/* Dynamic Scanline Grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 48, paddingBottom: 100 }}
      >
        {/* --- GLOBAL KPI COMMANDER --- */}
        <div className={`admin-grid-4 gap-${32}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          <MetricCard title="Active Projects" value={inProgressCount} label="Currently Running" icon={Rocket} color="#6366F1" trend="+14%" isLive />
          <MetricCard title="Client Satisfaction" value={successRate} label="Average Rating" icon={Star} color="#10B981" trend="+2.1%" isChart />
          <MetricCard title="Delivered Projects" value="124" label="Successfully Completed" icon={CheckCircle2} color="#818CF8" trend="+8" />
          <MetricCard title="Upcoming Projects" value={upcomingCount} label="In Planning Phase" icon={Calendar} color="#F59E0B" trend="+4" />
        </div>

        {/* --- MAIN MONITORING CORE --- */}
        <div className="admin-grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 40 }}>

          {/* SYSTEM RADAR & PROJECT VELOCITY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(40px)', borderRadius: 48, border: '1px solid rgba(255,255,255,0.08)', padding: 56, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 56 }}>
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 15px #6366F1' }} />
                    Global <span className="gradient-text">Ecosystem Pulse</span>
                  </h3>
                  <p style={{ color: '#64748B', marginTop: 8, fontSize: 15, fontWeight: 600 }}>High-fidelity monitoring of all operational sectors.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', fontSize: 13, fontWeight: 800, color: '#6366F1' }}>
                  SYSTEM: STABLE
                </div>
              </div>

              <div className="admin-grid-1-1" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <MonitoringRow label="Delivered Success" value={deliveredCount} total={projects.length} color="#10B981" />
                  <MonitoringRow label="In-Progress Velocity" value={inProgressCount} total={projects.length} color="#6366F1" />
                  <MonitoringRow label="Upcoming Infrastructure" value={upcomingCount} total={projects.length} color="#F59E0B" />
                  <MonitoringRow label="User Access Nodes" value={users.length} total={25} color="#818CF8" />
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Holographic Radar Visual */}
                  <div style={{ width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(99, 102, 241, 0.15)', position: 'relative' }}>
                    {/* Radar Scan Line */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'conic-gradient(from 0deg, rgba(99, 102, 241, 0.4) 0deg, transparent 90deg)',
                        borderRadius: '50%'
                      }}
                    />
                    {/* Radar Circles */}
                    <div style={{ position: 'absolute', inset: 40, border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', inset: 80, border: '1px solid rgba(99, 102, 241, 0.05)', borderRadius: '50%' }} />

                    {/* Center Data */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ fontSize: 48, fontWeight: 900, color: 'white' }}
                      >
                        86%
                      </motion.div>
                      <div style={{ fontSize: 11, color: '#6366F1', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Operational</div>
                    </div>

                    {/* Random Pulsing Nodes */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        style={{
                          position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#6366F1',
                          top: `${20 + Math.random() * 60}%`, left: `${20 + Math.random() * 60}%`,
                          boxShadow: '0 0 10px #6366F1'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* UPCOMING & DELIVERED QUICK BOARD */}
            <div className={`admin-grid-2 gap-${32}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <StatusPanel title="Future Tasks" icon={Clock} color="#F59E0B" count={upcomingCount} />
              <StatusPanel title="Completed Work" icon={CheckCircle2} color="#10B981" count={deliveredCount} />
            </div>
          </div>

          {/* REAL-TIME AUDIT STREAM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(40px)', borderRadius: 48, border: '1px solid rgba(255,255,255,0.08)', padding: 48, height: '100%', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Activity size={20} color="#6366F1" /> Live <span className="gradient-text">Pulse</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(239,68,68,0.12)', borderRadius: 100, border: '1px solid rgba(239,68,68,0.3)' }}>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#EF4444', letterSpacing: '1.5px' }}>LIVE</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', marginLeft: 4 }}>{activities.length} events</span>
                </span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {activities.slice(0, 6).map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
                  >
                    <motion.div
                      animate={{
                        scale: activity.status === 'warning' ? [1, 1.2, 1] : 1,
                        opacity: activity.status === 'warning' ? [0.8, 1, 0.8] : 1
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 10, height: 10, borderRadius: '50%',
                      background: activity.status === 'warning' ? '#EF4444' : activity.status === 'success' ? '#10B981' : activity.status === 'info' ? '#F59E0B' : '#6366F1',
                      marginTop: 6,
                      boxShadow: `0 0 10px ${activity.status === 'warning' ? '#EF4444' : activity.status === 'success' ? '#10B981' : activity.status === 'info' ? '#F59E0B' : '#6366F1'}`
                    }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{activity.action}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{activity.user} • {formatTimestamp(activity.timestamp)}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>{(activity.details || '').substring(0, 30)}...</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setActiveTab('activity')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', marginTop: 48, padding: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
              >
                Full Access Audit
              </motion.button>
            </div>
          </div>

        </div>

        {/* --- HIGH-FIDELITY INSIGHT BOARD --- */}
        <div className={`admin-grid-3 gap-${32}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          <BoardCard title="Delivery Speed" value="4.8x" desc="System throughput vs. quarterly baseline." color="#6366F1" />
          <BoardCard title="Active Members" value="94.2%" desc="Active engagement across all secure nodes." color="#10B981" />
          <BoardCard title="Total Audience Reach" value="12.4K" desc="Total aggregate views across insight engine." color="#F59E0B" />
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, label, icon: Icon, color, trend, isChart, isLive }) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02, boxShadow: `0 30px 60px ${color}20` }}
      style={{
        background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', padding: 36, borderRadius: 40,
        position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Animated Glowing Orb in the background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }}
      />
      {/* Grid pattern overlay for a tech feel */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${color}20, transparent)`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, boxShadow: `inset 0 0 20px ${color}10` }}
        >
          <Icon size={32} />
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>{trend}</div>
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: 10, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px' }}>Live</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 32, position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-1px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{value}</div>
        <div style={{ fontSize: 16, color: 'white', marginTop: 8, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      </div>

      {isChart && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, opacity: 0.3, pointerEvents: 'none' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <motion.path
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,80 C20,20 40,90 60,30 S80,70 100,20 L100,100 L0,100 Z" fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
            />
            <motion.path
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,80 C20,20 40,90 60,30 S80,70 100,20" fill="none" stroke={color} strokeWidth="3"
            />
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </motion.div>
  );
}

function MonitoringRow({ label, value, total, color }) {
  const percentage = (value / total) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#94A3B8' }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>{value}</span>
      </div>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "easeOut" }} style={{ height: '100%', background: color, boxShadow: `0 0 15px ${color}60` }} />
      </div>
    </div>
  );
}

function StatusPanel({ title, icon: Icon, color, count }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, boxShadow: `0 20px 40px ${color}15` }}
      style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(40px)', borderRadius: 40, border: `1px solid ${color}30`, padding: 32, display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `linear-gradient(135deg, ${color}10, transparent)`, pointerEvents: 'none' }} />
      <motion.div
        whileHover={{ rotate: 15 }}
        style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${color}20, transparent)`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, zIndex: 1, boxShadow: `inset 0 0 15px ${color}10` }}
      >
        <Icon size={28} />
      </motion.div>
      <div style={{ zIndex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: color, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: 'white', marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          {count}
          <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 700 }}>Projects</span>
        </div>
      </div>
    </motion.div>
  );
}

function BoardCard({ title, value, desc, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: `0 30px 60px ${color}20` }}
      style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(40px)', border: `1px solid ${color}30`, padding: 40, borderRadius: 40, position: 'relative', overflow: 'hidden' }}
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: `${color}15`, border: `1px solid ${color}30`, fontSize: 13, fontWeight: 900, color: color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 24 }}>{title}</div>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 12, textShadow: `0 0 20px ${color}40` }}
        >
          {value}
        </motion.div>
        <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function NoResults({ query }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '100px 0', textAlign: 'center' }}>
      <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}><Search size={56} color="#64748B" /></motion.div>
      </div>
      <h3 style={{ fontSize: 28, fontWeight: 900, color: '#94A3B8', letterSpacing: '-0.5px' }}>Zero matches for "{query}"</h3>
      <p style={{ color: '#475569', marginTop: 12, fontSize: 16, fontWeight: 600 }}>Refine your search parameters or check the global directory.</p>
    </motion.div>
  );
}

