import { useState, useEffect, useRef, useCallback } from 'react';
import './AdminPanel.css';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';
import {
  LayoutDashboard, Users, FileText,
  Settings, LogOut, Search, Bell, Plus,
  Mail, ShieldCheck, Shield, UserPlus, LayoutPanelLeft,
  Activity, Zap, Rocket, Check, X, Lock, Eye,
  EyeOff, Upload, GraduationCap
} from 'lucide-react';

import {
  getTOTP,
  normalizePermission,
  hasTabPermission,
  hasWritePermission,
  UnauthorizedView,
  SearchCommander,
  CelebrationEffect
} from './SharedComponents';

import DashboardView from './DashboardView';
import UsersView, { UserForm } from './UsersView';
import ProjectsView, { ProjectForm } from './ProjectsView';
import BlogsView, { BlogForm } from './BlogsView';
import SettingsView from './SettingsView';
import ActivityView from './ActivityView';
import ExamsView from './ExamsView';
import InternshipModule from './InternshipModule';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 1024 : true);
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
        if (session && session.user && session.user.token && session.loginTime && (Date.now() - session.loginTime < twentyFourHours)) {
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [notification, setNotification] = useState(null);

  const triggerToast = (msg, user = 'System') => {
    setNotification({ show: true, msg, user });
    setTimeout(() => setNotification(null), 4000);
  };

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'linear-gradient(135deg, #6366F1, #818CF8)' },
    { id: 'users', label: 'Users', icon: Users, gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
    { id: 'projects', label: 'Projects', icon: LayoutPanelLeft, gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)', sub: ['All Projects', 'Delivered Projects', 'Future Projects'] },
    { id: 'exams', label: 'Examination', icon: GraduationCap, gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' },
    { id: 'internship', label: 'Internships', icon: ShieldCheck, gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
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

      const user = result;
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
          localStorage.setItem('klanvision_admin_session', JSON.stringify({ user, loginTime: Date.now() }));
          triggerToast(`Authorized session initialized for ${user.name || user.email}.`, 'Access Granted');
          // Give local storage a tiny moment to save before triggering a network request that reads it
          setTimeout(() => {
            addActivity(user.name || user.email, 'System Login', 'security', 'success', `Successful login from ${user.email}`);
          }, 50);
        }
      } else {
        setLoginError('This account is not authorized to access the Panel.');
        triggerToast('Account authorization mismatch.', 'Access Blocked');
      }
    } catch (err) {
      setLoginError('Invalid security credentials provided.');
      triggerToast('Authentication credentials mismatch.', 'Access Denied');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivity(currentUser.name, 'System Logout', 'security', 'info', `${currentUser.name} signed out of the admin panel.`);
      triggerToast('Active session terminated successfully.', currentUser.name);
    }
    // Delay removing session to allow the activity fetch to read the token
    setTimeout(() => {
      localStorage.removeItem('klanvision_admin_session');
      setIsAuthenticated(false);
      setCurrentUser(null);
    }, 100);
  };

  const handleResetRequest = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === resetEmail);
    if (user) {
      console.log(`[Secure System] Mock Email dispatched to ${resetEmail} with reset token.`);

      setResetSuccess(`Secure reset link has been dispatched to ${resetEmail}. Please check your inbox.`);
      setLoginError('');

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
        triggerToast(`Modified credentials for ${userData.name}.`, 'Directory Update');
      }).catch(err => {
        console.error("Error updating user:", err);
        triggerToast('Failed to modify user credentials.', 'Directory Error');
      });
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
        triggerToast(`Added ${userData.name} to security directory.`, 'Directory Update');
      }).catch(err => {
        console.error("Error creating user:", err);
        triggerToast('Failed to enroll new member.', 'Directory Error');
      });
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
      triggerToast(`Access privileges ${updated.isAuthorized ? 'granted to' : 'revoked from'} ${user.name}.`, 'Security Access');
    }).catch(err => {
      console.error("Error toggling user access:", err);
      triggerToast('Failed to toggle member authorization.', 'Security Error');
    });
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      api.updateProject(editingProject.id, projectData).then(updated => {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
        addActivity(currentUser?.name || 'Admin', 'Project Updated', 'project', 'info', `Modified details for "${projectData.title}"`);
        triggerToast(`Updated project registry: "${projectData.title}".`, 'Project Directory');
      }).catch(err => {
        console.error("Error updating project:", err);
        triggerToast('Failed to modify project registry.', 'Project Error');
      });
    } else {
      const newProject = {
        ...projectData,
        color: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#7C3AED'][Math.floor(Math.random() * 5)]
      };
      api.createProject(newProject).then(created => {
        setProjects(prev => [...prev, created]);
        addActivity(currentUser?.name || 'Admin', 'Project Launched', 'project', 'success', `New project "${projectData.title}" initialized.`);
        triggerToast(`New project initialized: "${projectData.title}".`, 'Project Directory');
      }).catch(err => {
        console.error("Error creating project:", err);
        triggerToast('Failed to launch project venture.', 'Project Error');
      });
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveBlog = (blogData) => {
    if (editingBlog) {
      api.updateBlog(editingBlog.id, blogData).then(updated => {
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? updated : b));
        addActivity(blogData.author, 'Blog Updated', 'content', 'info', `Refined "${blogData.title}"`);
        triggerToast(`Updated blog article: "${blogData.title}".`, 'Blog Manager');
      }).catch(err => {
        console.error("Error updating blog:", err);
        triggerToast('Failed to update blog article.', 'Blog Error');
      });
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
        triggerToast(`Article published: "${blogData.title}".`, 'Blog Manager');
      }).catch(err => {
        console.error("Error creating blog:", err);
        triggerToast('Failed to publish blog article.', 'Blog Error');
      });
    }
    setIsBlogModalOpen(false);
    setEditingBlog(null);
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
          localStorage.setItem('klanvision_admin_session', JSON.stringify({ user: authenticatedUser, loginTime: Date.now() }));
          setTimeout(() => {
            addActivity(authenticatedUser.name, '2FA Verified', 'security', 'success', `Identity verified via mobile authenticator.`);
          }, 50);
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
          const authenticatedUser = await api.verify2FA(verifyingUser.email, code);

          // Set user 2FA configuration to true in backend database
          await api.updateUser(verifyingUser.id, {
            ...verifyingUser,
            is2FAConfigured: true,
            secret2FA: setup2FASecret || verifyingUser.secret2FA
          });

          setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, is2FAConfigured: true, failed2FAAttempts: 0 } : u));
          setIsSettingUp2FA(false);
          setIsAuthenticated(true);
          const finalUser = { ...verifyingUser, is2FAConfigured: true, token: authenticatedUser.token };
          setCurrentUser(finalUser);
          setVerifyingUser(null);
          setAuthCode(['', '', '', '', '', '']);
          setLoginError('');
          localStorage.setItem('klanvision_admin_session', JSON.stringify({ user: finalUser, loginTime: Date.now() }));
          setTimeout(() => {
            addActivity(verifyingUser.name, '2FA Configured', 'security', 'success', `Initial 2FA setup completed for ${verifyingUser.email}. Now verifying.`);
          }, 50);
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
                    <input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••••••" style={{ width: '100%', padding: '16px 48px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
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
          {navItems.filter(item => hasTabPermission(currentUser, item.id)).map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); if (typeof window !== 'undefined' && window.innerWidth <= 1024) setIsSidebarOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 16, border: 'none', background: activeTab === item.id ? item.gradient : 'transparent', color: activeTab === item.id ? 'white' : '#94A3B8', cursor: 'pointer', transition: 'all 0.3s', marginBottom: 8, fontWeight: 700, fontSize: 14 }}>
              <item.icon size={20} />
              {isSidebarOpen && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => { handleLogout(); if (typeof window !== 'undefined' && window.innerWidth <= 1024) setIsSidebarOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px', borderRadius: 16, border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && typeof window !== 'undefined' && window.innerWidth <= 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 49,
              cursor: 'pointer'
            }}
          />
        )}
      </AnimatePresence>

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
                  ].filter(item => hasTabPermission(currentUser, item.tab) && item.label.toLowerCase().includes(commandQuery.toLowerCase())).map((item) => (
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
            {activeTab === 'dashboard' && <DashboardView projects={projects} users={users} activities={activities} setActiveTab={setActiveTab} />}
            {activeTab === 'users' && (
              hasTabPermission(currentUser, 'users') ? (
                <UsersView
                  users={users}
                  onAddClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                  onEditClick={(user) => { setEditingUser(user); setIsUserModalOpen(true); }}
                  onDeleteClick={(id) => {
                    api.deleteUser(id).then(() => {
                      const user = users.find(u => u.id === id);
                      setUsers(prev => prev.filter(u => u.id !== id));
                      if (user) {
                        addActivity(currentUser?.name || 'Admin', 'User Removed', 'security', 'warning', `Deleted account for ${user.name}`);
                        triggerToast(`Removed member ${user.name} from security directory.`, 'Directory Update');
                      }
                    }).catch(err => {
                      console.error("Error deleting user:", err);
                      triggerToast('Failed to remove member.', 'Directory Error');
                    });
                  }}
                  onToggleAccess={handleToggleUserAccess}
                  searchQuery={globalSearchQuery}
                  roleFilter={userRoleFilter}
                  canEdit={hasWritePermission(currentUser, 'users')}
                />
              ) : <UnauthorizedView />
            )}
            {activeTab === 'projects' && (
              hasTabPermission(currentUser, 'projects') ? (
                <ProjectsView
                  projects={projects}
                  onAddClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                  onEditClick={(project) => { setEditingProject(project); setIsProjectModalOpen(true); }}
                  onDeleteClick={(id) => {
                    api.deleteProject(id).then(() => {
                      const project = projects.find(p => p.id === id);
                      setProjects(prev => prev.filter(p => p.id !== id));
                      if (project) {
                        addActivity(currentUser?.name || 'Admin', 'Project Terminated', 'project', 'warning', `Removed project "${project.title}"`);
                        triggerToast(`Terminated project venture: "${project.title}".`, 'Project Directory');
                      }
                    }).catch(err => {
                      console.error("Error deleting project:", err);
                      triggerToast('Failed to terminate project.', 'Project Error');
                    });
                  }}
                  searchQuery={globalSearchQuery}
                  statusFilter={projectStatusFilter}
                  canEdit={hasWritePermission(currentUser, 'projects')}
                />
              ) : <UnauthorizedView />
            )}
            {activeTab === 'blogs' && (
              hasTabPermission(currentUser, 'blogs') ? (
                <BlogsView
                  blogs={blogs}
                  onAddClick={() => { setEditingBlog(null); setIsBlogModalOpen(true); }}
                  onEditClick={(blog) => { setEditingBlog(blog); setIsBlogModalOpen(true); }}
                  onDeleteClick={(id) => {
                    api.deleteBlog(id).then(() => {
                      const blog = blogs.find(b => b.id === id);
                      setBlogs(prev => prev.filter(b => b.id !== id));
                      if (blog) {
                        addActivity(currentUser?.name || 'Admin', 'Blog Deleted', 'content', 'warning', `Removed article "${blog.title}"`);
                        triggerToast(`Deleted blog article: "${blog.title}".`, 'Blog Manager');
                      }
                    }).catch(err => {
                      console.error("Error deleting blog:", err);
                      triggerToast('Failed to delete blog article.', 'Blog Error');
                    });
                  }}
                  searchQuery={globalSearchQuery}
                  categoryFilter={blogCategoryFilter}
                  canEdit={hasWritePermission(currentUser, 'blogs')}
                />
              ) : <UnauthorizedView />
            )}
            {activeTab === 'settings' && (
              hasTabPermission(currentUser, 'settings') ? (
                <SettingsView
                  theme={theme} setTheme={setTheme}
                  accentColor={accentColor} setAccentColor={setAccentColor}
                  glassIntensity={glassIntensity} setGlassIntensity={setGlassIntensity}
                  twoFactor={twoFactor} setTwoFactor={setTwoFactor}
                  maintenanceMode={maintenanceMode} setMaintenanceMode={setMaintenanceMode}
                  platformLogo={platformLogo} setPlatformLogo={setPlatformLogo}
                  companyName={companyName} setCompanyName={setCompanyName}
                  addActivity={addActivity}
                  canEdit={hasWritePermission(currentUser, 'settings')}
                />
              ) : <UnauthorizedView />
            )}
            {activeTab === 'activity' && (
              hasTabPermission(currentUser, 'activity') ? (
                <ActivityView activities={activities} />
              ) : <UnauthorizedView />
            )}
            {activeTab === 'exams' && (
              hasTabPermission(currentUser, 'exams') ? (
                <ExamsView triggerToast={triggerToast} />
              ) : <UnauthorizedView />
            )}
            {activeTab === 'internship' && (
              hasTabPermission(currentUser, 'projects') ? (
                <InternshipModule currentUser={currentUser} addActivity={addActivity} />
              ) : <UnauthorizedView />
            )}
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
                      triggerToast={triggerToast}
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
                  triggerToast={triggerToast}
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
                  triggerToast={triggerToast}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
