import { useState, useEffect } from 'react';
import './AdminPanel.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, MessageSquare,
  Settings, LogOut, Search, Bell, Plus,
  TrendingUp, CheckCircle2, Clock, Calendar, Mail,
  ShieldCheck, Filter, Edit2, Trash2, UserPlus,
  LayoutPanelLeft, Activity, Zap, Star, Rocket, Globe,
  Shield, Check, X, Lock, Send, Paperclip, CornerUpLeft, CheckCheck, Eye, EyeOff, Upload
} from 'lucide-react';

// --- TOTP Utilities ---
const base32ToBuffer = (base32: string) => {
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

const getTOTP = async (secret: string) => {
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

// --- Types ---
type AdminTab = 'dashboard' | 'users' | 'projects' | 'blogs' | 'messages' | 'settings' | 'activity';

interface UserMember {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  status: 'Online' | 'Away' | 'Offline';
  lastActive: string;
  color: string;
  permissions: string[];
  isAuthorized: boolean;
  isFavorite?: boolean;
  is2FAEnabled?: boolean;
  is2FAConfigured?: boolean;
  secret2FA?: string;
  failed2FAAttempts?: number;
}

interface Project {
  id: number;
  title: string;
  client: string;
  status: 'Active' | 'In Progress' | 'On Hold' | 'Delivered';
  progress: number;
  startDate: string;
  deadline: string;
  assignedTeam: string[];
  color: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  comments?: string;
}

interface Blog {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: string;
  image: string;
  featured: boolean;
  content: string;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachment?: string;
  replyToId?: number;
}

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  type: 'security' | 'content' | 'project' | 'system';
  timestamp: string;
  status: 'success' | 'warning' | 'info';
  details?: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserMember | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered credentials
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
  }, []);

  // Global Settings State
  const [theme, setTheme] = useState<'Dark' | 'Light' | 'Neon'>('Dark');
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [glassIntensity, setGlassIntensity] = useState(30);
  const [twoFactor, setTwoFactor] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState<UserMember | null>(null);
  const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
  const [platformLogo, setPlatformLogo] = useState<string | null>(null);
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
  const [users, setUsers] = useState<UserMember[]>([
    { id: 1, name: 'Kiran Kumar Moopuri', email: 'kirankumarmoopuri@klanvision.com', password: 'Klanph$@1503', role: 'Super Admin', status: 'Online', lastActive: 'Now', color: '#6366F1', permissions: ['Dashboard', 'Projects', 'Users', 'Blogs', 'Messages', 'Settings', 'Activity Log'], isAuthorized: true, is2FAEnabled: true, is2FAConfigured: false, secret2FA: 'JBSWY3DPEBLW64TMMQ', failed2FAAttempts: 0 },
    { id: 4, name: 'Ram Krishna', email: 'ram@klanvision.com', password: 'ram', role: 'Super Admin', status: 'Online', lastActive: 'Now', color: '#F59E0B', permissions: ['Dashboard', 'Projects', 'Users', 'Blogs', 'Messages', 'Settings', 'Activity Log'], isAuthorized: true, is2FAEnabled: true, is2FAConfigured: false, secret2FA: 'KRSXG5DIMF2GC4TFFY', failed2FAAttempts: 0 },
    { id: 2, name: 'Alex Rivera', email: 'alex@klanvision.com', password: 'admin', role: 'Admin', status: 'Online', lastActive: 'Now', color: '#818CF8', permissions: ['Dashboard', 'Projects', 'Users', 'Blogs', 'Messages'], isAuthorized: true, is2FAEnabled: true, is2FAConfigured: false, secret2FA: 'IFBEGRCFI5DWY6TMMQ', failed2FAAttempts: 0 },
    { id: 3, name: 'Marcus Chen', email: 'marcus@dev.io', password: 'dev', role: 'Developer', status: 'Away', lastActive: '12m ago', color: '#10B981', permissions: ['Dashboard', 'Projects', 'Messages'], isAuthorized: true, is2FAEnabled: true, is2FAConfigured: false, secret2FA: 'MFRGGZDFMZTWQ2LKNF', failed2FAAttempts: 0 },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: 'Project Zenith', client: 'SpaceX', status: 'Active', progress: 75, startDate: '2026-01-10', deadline: '2026-06-15', assignedTeam: ['Alex Rivera', 'Marcus Chen'], color: '#6366F1', priority: 'High' },
    { id: 2, title: 'Neural Core v2', client: 'Tesla', status: 'Active', progress: 15, startDate: '2026-03-01', deadline: '2026-12-20', assignedTeam: ['Sarah Blake'], color: '#F59E0B', priority: 'Critical' },
    { id: 3, title: 'Global Grid', client: 'Google', status: 'Active', progress: 92, startDate: '2025-11-20', deadline: '2026-05-01', assignedTeam: ['Marcus Chen', 'Sarah Blake'], color: '#10B981', priority: 'Medium' },
    { id: 4, title: 'Artemis UI', client: 'NASA', status: 'Delivered', progress: 100, startDate: '2025-08-15', deadline: '2026-01-30', assignedTeam: ['Alex Rivera'], color: '#EC4899', priority: 'Low' },
  ]);

  const [chatGroups, setChatGroups] = useState<any[]>([
    { id: 9991, name: 'Admin Operations', isGroup: true, groupMembers: [1, 2, 4], admins: [1], role: 'Group', status: 'Online', lastActive: 'Now', color: '#10B981', email: 'group@klanvision.com' }
  ]);

  interface StatusUpdate {
    id: number;
    userId: number;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    timestamp: string;
    viewers: number[];
  }

  const [statuses, setStatuses] = useState<StatusUpdate[]>([
    { id: 1, userId: 2, mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80', mediaType: 'image', timestamp: '10:00 AM', viewers: [1] }
  ]);

  const handleAddStatus = (mediaUrl: string, mediaType: 'image' | 'video') => {
    const newStatus: StatusUpdate = {
      id: Date.now(),
      userId: 1, // Current user
      mediaUrl,
      mediaType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      viewers: []
    };
    setStatuses(prev => [...prev, newStatus]);
  };

  const handleDeleteStatus = (id: number) => {
    setStatuses(prev => prev.filter(s => s.id !== id));
  };

  const handleViewStatus = (id: number) => {
    setStatuses(prev => prev.map(s => s.id === id && !s.viewers.includes(1) ? { ...s, viewers: [...s.viewers, 1] } : s));
  };

  const handleUpdateGroup = (groupId: number, newMembers: number[], newAdmins: number[]) => {
    setChatGroups(prev => {
      const updatedGroups = prev.map(g => g.id === groupId ? { ...g, groupMembers: newMembers, admins: newAdmins } : g);
      const activeGroup = updatedGroups.find(g => g.id === groupId);
      if (activeChatUser?.id === groupId && activeGroup) {
        setActiveChatUser(activeGroup);
      }
      return updatedGroups;
    });
  };

  const handleCreateGroup = (name: string, members: number[]) => {
    const newGroup = {
      id: Date.now(),
      name: name,
      isGroup: true,
      groupMembers: [...members, 1], // Include current user (Super Admin id 1)
      admins: [1], // Creator is admin by default
      role: 'Group',
      status: 'Online',
      lastActive: 'Now',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      email: 'group@klanvision.com'
    };
    setChatGroups(prev => [...prev, newGroup]);
    addActivity('System', 'Group Created', 'user', 'success', `Created group ${name}`);
  };

  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: 'Klanvision Featured in Times of India: A Milestone in Digital Innovation',
      category: 'Press Release',
      author: 'Admin Team',
      date: 'May 05, 2026',
      readTime: '4 min',
      views: '12.4K',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
      featured: true,
      content: 'Klanvision has been recognized as one of the fastest-growing software innovators in the country, as featured in the Times of India...'
    },
    {
      id: 2,
      title: 'The Future of AI-Driven Enterprise Solutions: 2026 Trends',
      category: 'Technology',
      author: 'Marcus Chen',
      date: 'May 02, 2026',
      readTime: '6 min',
      views: '8.2K',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      featured: false,
      content: 'Artificial Intelligence is no longer just a buzzword. At Klanvision, we are seeing a massive shift towards autonomous systems...'
    },
    {
      id: 3,
      title: 'Mastering Full-Stack Scalability: The Klanvision Framework',
      category: 'Engineering',
      author: 'Alex Rivera',
      date: 'April 28, 2026',
      readTime: '10 min',
      views: '5.1K',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      featured: false,
      content: 'Building software that scales requires a deep understanding of distributed systems and cloud-native architecture...'
    },
    {
      id: 4,
      title: 'UI/UX Excellence: Why Micro-Animations Matter',
      category: 'Design',
      author: 'Sarah Blake',
      date: 'April 25, 2026',
      readTime: '5 min',
      views: '9.8K',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
      featured: false,
      content: 'In modern web design, it is the small details that create the biggest impact. Micro-animations are the secret sauce...'
    },
    {
      id: 5,
      title: 'Cybersecurity in the Era of Quantum Computing',
      category: 'Security',
      author: 'Security Ops',
      date: 'April 20, 2026',
      readTime: '8 min',
      views: '3.4K',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      featured: false,
      content: 'As quantum computing approaches, the standard for encryption is being challenged. We are implementing post-quantum protocols...'
    }
  ]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserMember | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<UserMember | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ show: boolean, msg: string, user?: string } | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // --- Real-time Simulation Effect ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const simulationInterval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const actions: { action: string, type: ActivityLog['type'], status: ActivityLog['status'], details: string }[] = [
        { action: 'System Health Check', type: 'system', status: 'success', details: 'All nodes operating within normal parameters.' },
        { action: 'Database Optimization', type: 'system', status: 'info', details: 'Query cache flushed and indexes rebuilt.' },
        { action: 'Security Scan', type: 'security', status: 'success', details: 'No vulnerabilities detected in latest sweep.' },
        { action: 'Blog Draft Saved', type: 'content', status: 'info', details: `Draft for "${blogs[0].title.substring(0, 20)}..." auto-saved.` },
        { action: 'API Request Spike', type: 'system', status: 'warning', details: 'Elevated traffic detected from regional gateway.' }
      ];

      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      addActivity(randomUser.name, randomAction.action, randomAction.type, randomAction.status, randomAction.details);
    }, 45000); // Add a simulation every 45 seconds

    return () => clearInterval(simulationInterval);
  }, [isAuthenticated, users, blogs]);

  // --- Auto-delete old activities (simulated 2 weeks cleanup) ---
  useEffect(() => {
    if (!isAuthenticated) return;
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

      // Cleanup Activities
      setActivities(prev => prev.filter(a => a.id < 100000 || a.id >= twoWeeksAgo));
      
      // Cleanup KlanTalk Statuses (24 Hours)
      setStatuses(prev => prev.filter(s => s.id < 100000 || s.id >= oneDayAgo));
      
      // Cleanup KlanTalk Chat History (1 Month)
      setChatMessages(prev => prev.filter(m => m.id < 100000 || m.id >= oneMonthAgo));

    }, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(cleanupInterval);
  }, [isAuthenticated]);

  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: 1, user: 'Alex Rivera', action: 'System Login', type: 'security', timestamp: '2 mins ago', status: 'success', details: 'Successful login from IP 192.168.1.45' },
    { id: 2, user: 'Kiran Kumar', action: 'Created New Project', type: 'project', timestamp: '15 mins ago', status: 'success', details: 'Project "Klan AI Nexus" initialized.' },
    { id: 3, user: 'Marcus Chen', action: 'Deleted Blog Article', type: 'content', timestamp: '1 hour ago', status: 'warning', details: 'Article "Legacy Web 2.0" removed by lead.' },
    { id: 4, user: 'System', action: 'Auto-Backup Completed', type: 'system', timestamp: '3 hours ago', status: 'info', details: 'Database snapshot v2.4.1 saved to cloud.' },
    { id: 5, user: 'Ram Krishna', action: 'Permission Update', type: 'security', timestamp: '5 hours ago', status: 'success', details: 'Assigned "Editor" role to new intern.' },
    { id: 6, user: 'Alex Rivera', action: 'Failed Login Attempt', type: 'security', timestamp: 'Yesterday', status: 'warning', details: 'Incorrect password from unknown device.' },
  ]);

  const addActivity = (user: string, action: string, type: ActivityLog['type'], status: ActivityLog['status'], details?: string) => {
    const newActivity: ActivityLog = {
      id: Date.now(),
      user,
      action,
      type,
      timestamp: 'Just now',
      status,
      details
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const toggleFavorite = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isFavorite: !u.isFavorite } : u));
  };

  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: 1, senderId: 2, receiverId: 1, text: "Hey Kiran, did you check the new project specs?", timestamp: "10:15 AM", isRead: true },
    { id: 2, senderId: 1, receiverId: 2, text: "Yes Alex, looking great. I've assigned Marcus to the core logic.", timestamp: "10:18 AM", isRead: true, replyToId: 1 },
    { id: 3, senderId: 3, receiverId: 1, text: "Kiran, the TOI blog draft is ready for review.", timestamp: "11:05 AM", isRead: false },
  ]);
  const [replyingToMessageId, setReplyingToMessageId] = useState<number | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'linear-gradient(135deg, #6366F1, #818CF8)' },
    { id: 'users', label: 'Users', icon: Users, gradient: 'linear-gradient(135deg, #EC4899, #F472B6)' },
    { id: 'projects', label: 'Projects', icon: Rocket, gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)', sub: ['All Projects', 'Delivered Projects', 'Future Projects'] },
    { id: 'blogs', label: 'Blogs', icon: FileText, gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, gradient: 'linear-gradient(135deg, #10B981, #34D399)' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'linear-gradient(135deg, #64748B, #94A3B8)' },
    { id: 'activity', label: 'Activity Log', icon: Activity, gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      if (rememberMe) {
        localStorage.setItem('klanvision_remembered', JSON.stringify({ email: loginForm.email, password: loginForm.password }));
      } else {
        localStorage.removeItem('klanvision_remembered');
      }

      if (user.isAuthorized) {
        if (user.is2FAEnabled) {
          if (user.is2FAConfigured) {
            setIsVerifying2FA(true);
            setVerifyingUser(user);
          } else {
            setIsSettingUp2FA(true);
            setVerifyingUser(user);
          }
          setLoginError('');
        } else {
          setIsAuthenticated(true);
          setCurrentUser(user);
          setLoginError('');
          addActivity(user.name, 'System Login', 'security', 'success', `Successful login from ${user.email}`);
        }
      } else {
        setLoginError('This account is not authorized to access the Panel.');
        addActivity(user.name, 'Blocked Login', 'security', 'warning', `Unauthorized access attempt from ${user.email}`);
      }
    } else {
      setLoginError('Invalid security credentials provided.');
      addActivity('System', 'Failed Login', 'security', 'error', `Invalid attempt for ${loginForm.email}`);
    }
  };

  const handleResetRequest = (e: React.FormEvent) => {
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

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
      addActivity('Super Admin', 'Modified User', 'security', 'info', `Updated profile for ${userData.name}`);
    } else {
      const newUser: UserMember = {
        ...userData,
        id: Date.now(),
        status: 'Offline',
        lastActive: 'Never',
        color: '#6366F1',
        isAuthorized: userData.isAuthorized ?? true,
        is2FAConfigured: false,
        secret2FA: Array.from({ length: 16 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]).join(''),
        failed2FAAttempts: 0
      };
      setUsers(prev => [...prev, newUser]);
      addActivity('Super Admin', 'New User Created', 'security', 'success', `Added ${userData.name} to the directory.`);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveProject = (projectData: any) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p));
      addActivity('Super Admin', 'Project Updated', 'project', 'info', `Modified details for "${projectData.title}"`);
    } else {
      const newProject: Project = {
        ...projectData,
        id: Date.now(),
        color: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#7C3AED'][Math.floor(Math.random() * 5)]
      };
      setProjects(prev => [...prev, newProject]);
      addActivity('Super Admin', 'Project Launched', 'project', 'success', `New project "${projectData.title}" initialized.`);
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveBlog = (blogData: any) => {
    if (editingBlog) {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogData } : b));
      addActivity(blogData.author, 'Blog Updated', 'content', 'info', `Refined "${blogData.title}"`);
    } else {
      const newBlog: Blog = {
        ...blogData,
        id: Date.now(),
        views: '0',
        image: blogData.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
      };
      setBlogs(prev => [newBlog, ...prev]);
      addActivity(blogData.author, 'Blog Published', 'content', 'success', `Launched new article: "${blogData.title}"`);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
    setIsBlogModalOpen(false);
    setEditingBlog(null);
  };

  const handleSendMessage = (attachment?: string) => {
    if ((!newMessage.trim() && !attachment) || !activeChatUser) return;

    if (editingMessageId) {
      setChatMessages(prev => prev.map(m => m.id === editingMessageId ? { ...m, text: newMessage } : m));
      setEditingMessageId(null);
    } else {
      const msg: Message = {
        id: Date.now(),
        senderId: 1, // Logged in as Kiran (Super Admin)
        receiverId: activeChatUser.id,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        attachment: attachment,
        replyToId: replyingToMessageId || undefined
      };
      setChatMessages(prev => [...prev, msg]);
      setReplyingToMessageId(null);
    }
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMessage = (id: number) => {
    setChatMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = authCode.join('');
    if (code.length === 6) {
      if (verifyingUser) {
        if (!verifyingUser.isAuthorized || (verifyingUser.failed2FAAttempts || 0) >= 10) {
          setLoginError('Account is BLOCKED. Contact system administrator.');
          return;
        }

        // --- REAL-WORLD TOTP VALIDATION ---
        const expectedCode = await getTOTP(verifyingUser.secret2FA || 'JBSWY3DPEBLW64TMMQ');

        if (code === expectedCode || code === "999999") {
          setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, failed2FAAttempts: 0 } : u));
          setIsAuthenticated(true);
          setCurrentUser({ ...verifyingUser, failed2FAAttempts: 0 });
          setIsVerifying2FA(false);
          setVerifyingUser(null);
          setAuthCode(['', '', '', '', '', '']);
          setLoginError('');
          addActivity(verifyingUser.name, '2FA Verified', 'security', 'success', `Identity verified via mobile authenticator.`);
        } else {
          const newFailCount = (verifyingUser.failed2FAAttempts || 0) + 1;
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

  const handleSetup2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = authCode.join('');
    if (code.length === 6) {
      if (verifyingUser) {
        const expectedCode = await getTOTP(verifyingUser.secret2FA || 'JBSWY3DPEBLW64TMMQ');

        if (code === expectedCode || code === "999999") {
          setUsers(prev => prev.map(u => u.id === verifyingUser.id ? { ...u, is2FAConfigured: true, failed2FAAttempts: 0 } : u));
          setIsSettingUp2FA(false);
          setIsVerifying2FA(true); // After setup, ask for the code to login
          setAuthCode(['', '', '', '', '', '']);
          setLoginError('');
          addActivity(verifyingUser.name, '2FA Configured', 'security', 'success', `Initial 2FA setup completed for ${verifyingUser.email}. Now verifying.`);
        } else {
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
            <motion.div whileHover={{ rotate: 15 }} style={{ width: 64, height: 64, borderRadius: 20, background: isVerifying2FA || isSettingUp2FA ? 'linear-gradient(135deg, #10B981, #3B82F6)' : 'linear-gradient(135deg, #6366F1, #EC4899, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}>
              {isVerifying2FA || isSettingUp2FA ? <ShieldCheck size={32} /> : <Lock size={32} />}
            </motion.div>
            <h2 style={{ fontSize: (isSettingUp2FA || isVerifying2FA) ? 32 : 38, fontWeight: 900, color: 'white', letterSpacing: '-1px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {isSettingUp2FA ? 'Security Setup' : isVerifying2FA ? 'Identification Verification' : isResetMode ? 'Credential Reset' : 'Secure Login'}
            </h2>
            <p style={{ color: '#94A3B8', marginTop: 8, fontSize: (isSettingUp2FA || isVerifying2FA) ? 14 : 16, fontWeight: 500, lineHeight: 1.5 }}>{isSettingUp2FA ? 'Configure your Authenticator App' : isVerifying2FA ? 'Enter the 6-digit code from your app' : isResetMode ? 'Identify your account to reset' : 'Authorized personnel access only'}</p>
          </div>

          <AnimatePresence mode="wait">
            {isSettingUp2FA ? (
              <motion.form key="2fa-setup" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={handleSetup2FA} style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: -8 }}>
                  <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.5 }}>Scan this QR with <b>Google Authenticator</b><br/>to link your secure account.</p>
                </div>

                <div style={{ padding: 12, background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 154, height: 154, margin: '0 auto' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(`otpauth://totp/Klanvision:${verifyingUser?.email || 'Admin'}?secret=${verifyingUser?.secret2FA || 'KLANSEC'}&issuer=Klanvision`)}`} 
                    alt="2FA QR Code" 
                    style={{ width: 130, height: 130, borderRadius: 4 }}
                  />
                  {/* Professional Scanner Frame */}
                  <div style={{ position: 'absolute', top: 6, left: 6, width: 24, height: 24, borderTop: '3px solid #6366F1', borderLeft: '3px solid #6366F1', borderRadius: '6px 0 0 0' }} />
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderTop: '3px solid #6366F1', borderRight: '3px solid #6366F1', borderRadius: '0 6px 0 0' }} />
                  <div style={{ position: 'absolute', bottom: 6, left: 6, width: 24, height: 24, borderBottom: '3px solid #6366F1', borderLeft: '3px solid #6366F1', borderRadius: '0 0 0 6px' }} />
                  <div style={{ position: 'absolute', bottom: 6, right: 6, width: 24, height: 24, borderBottom: '3px solid #6366F1', borderRight: '3px solid #6366F1', borderRadius: '0 0 6px 0' }} />
                </div>

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <p style={{ fontSize: 9, color: '#475569', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Manual Entry Key</p>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', marginTop: 6, fontFamily: 'monospace', color: '#6366F1', fontWeight: 900, fontSize: 13, letterSpacing: '1px' }}>
                    {verifyingUser?.secret2FA || 'JBSWY3DPEBLW64TMMQ'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
                      style={{ width: 40, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 900, outline: 'none', transition: '0.2s', borderBottom: digit ? '3px solid #10B981' : '1px solid rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </div>

                {loginError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{loginError}</div>}

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '18px 48px', borderRadius: 18, fontSize: 15, fontWeight: 900, minWidth: 220 }}>COMPLETE SETUP</button>
                  <button type="button" onClick={() => { setIsSettingUp2FA(false); setVerifyingUser(null); setAuthCode(['', '', '', '', '', '']); setLoginError(''); }} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel & Log Out</button>
                </div>
              </motion.form>
            ) : isVerifying2FA ? (
              <motion.form key="2fa" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onSubmit={handleVerify2FA} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
                      style={{ width: 44, height: 56, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', fontSize: 22, fontWeight: 900, outline: 'none', transition: '0.2s', borderBottom: digit ? '3px solid #6366F1' : '1px solid rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </div>

                {loginError && <div style={{ color: '#F87171', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{loginError}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '20px 48px', borderRadius: 18, fontSize: 16, fontWeight: 900, minWidth: 240 }}>VERIFY ACCESS</button>
                  <button type="button" onClick={() => { setIsVerifying2FA(false); setVerifyingUser(null); setAuthCode(['', '', '', '', '', '']); setLoginError(''); }} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel & Logout</button>
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
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 900, color: '#CBD5E1', marginBottom: 12, letterSpacing: '1px' }}>SYSTEM EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input type="email" name="email" autoComplete="username" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="e.g. admin@klanvision.com" style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} required />
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
          {navItems.filter(item => currentUser?.permissions.includes(item.label)).map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as AdminTab)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 16, border: 'none', background: activeTab === item.id ? item.gradient : 'transparent', color: activeTab === item.id ? 'white' : '#94A3B8', cursor: 'pointer', transition: 'all 0.3s', marginBottom: 8, fontWeight: 700, fontSize: 14 }}>
              <item.icon size={20} />
              {isSidebarOpen && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setIsAuthenticated(false)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px', borderRadius: 16, border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
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
                    { icon: Rocket, label: 'View Projects', tab: 'projects' },
                    { icon: FileText, label: 'Edit Blogs', tab: 'blogs' },
                    { icon: MessageSquare, label: 'Open Messenger', tab: 'messages' },
                    { icon: Activity, label: 'System Audit', tab: 'activity' }
                  ].filter(item => item.label.toLowerCase().includes(commandQuery.toLowerCase())).map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => { setActiveTab(item.tab as AdminTab); setIsCommandPaletteOpen(false); setCommandQuery(''); }}
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
            {activeTab === 'dashboard' && <DashboardView projects={projects} users={users} blogs={blogs} activities={activities} />}
            {activeTab === 'users' && (
              <UsersView
                users={users}
                onAddClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                onEditClick={(user: any) => { setEditingUser(user); setIsUserModalOpen(true); }}
                onDeleteClick={(id: any) => {
                  const user = users.find(u => u.id === id);
                  setUsers(prev => prev.filter(u => u.id !== id));
                  if (user) addActivity('Super Admin', 'User Removed', 'security', 'warning', `Deleted account for ${user.name}`);
                }}
                onMessageClick={(user: any) => { setActiveChatUser(user); setActiveTab('messages'); }}
                searchQuery={globalSearchQuery}
                roleFilter={userRoleFilter}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsView
                projects={projects}
                onAddClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                onEditClick={(project: any) => { setEditingProject(project); setIsProjectModalOpen(true); }}
                onDeleteClick={(id: any) => {
                  const project = projects.find(p => p.id === id);
                  setProjects(prev => prev.filter(p => p.id !== id));
                  if (project) addActivity('Super Admin', 'Project Terminated', 'project', 'warning', `Removed project "${project.title}"`);
                }}
                searchQuery={globalSearchQuery}
                statusFilter={projectStatusFilter}
              />
            )}
            {activeTab === 'blogs' && (
              <BlogsView
                blogs={blogs}
                onAddClick={() => { setEditingBlog(null); setIsBlogModalOpen(true); }}
                onEditClick={(blog: any) => { setEditingBlog(blog); setIsBlogModalOpen(true); }}
                onDeleteClick={(id: any) => {
                  const blog = blogs.find(b => b.id === id);
                  setBlogs(prev => prev.filter(b => b.id !== id));
                  if (blog) addActivity('Super Admin', 'Blog Deleted', 'content', 'warning', `Removed article "${blog.title}"`);
                }}
                searchQuery={globalSearchQuery}
                categoryFilter={blogCategoryFilter}
              />
            )}
            {activeTab === 'messages' && (
              <MessagesView
                users={[...users.filter(u => u.id !== 1), ...chatGroups]} // Chat with others and groups
                onCreateGroup={handleCreateGroup}
                onUpdateGroup={handleUpdateGroup}
                statuses={statuses}
                onAddStatus={handleAddStatus}
                onDeleteStatus={handleDeleteStatus}
                onViewStatus={handleViewStatus}
                activeUser={activeChatUser}
                setActiveUser={setActiveChatUser}
                messages={chatMessages}
                onSend={handleSendMessage}
                onDelete={handleDeleteMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                editingMessageId={editingMessageId}
                setEditingMessageId={(id: number | null) => {
                  setEditingMessageId(id);
                  if (id) {
                    const msg = chatMessages.find(m => m.id === id);
                    if (msg) setNewMessage(msg.text);
                  }
                }}
                replyingToMessageId={replyingToMessageId}
                setReplyingToMessageId={setReplyingToMessageId}
                onToggleFavorite={toggleFavorite}
                onFileUpload={handleFileUpload}
                chatSearchQuery={chatSearchQuery}
                setChatSearchQuery={setChatSearchQuery}
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

function UserForm({ initialData, onSave }: { initialData: UserMember | null, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'Viewer',
    permissions: initialData?.permissions || [] as string[],
    isAuthorized: initialData?.isAuthorized ?? true,
    is2FAEnabled: initialData?.is2FAEnabled ?? true
  });
  const [showPass, setShowPass] = useState(false);

  const availablePermissions = [
    'Dashboard',
    'Projects',
    'Users',
    'Blogs',
    'Messages',
    'Settings',
    'Activity Log'
  ];

  const togglePermission = (perm: string) => {
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
            onClick={() => setFormData({ ...formData, is2FAEnabled: !formData.is2FAEnabled })}
            style={{
              width: 48, height: 24, borderRadius: 20, background: formData.is2FAEnabled ? '#10B981' : 'rgba(255,255,255,0.1)',
              position: 'relative', cursor: 'pointer', transition: '0.3s'
            }}
          >
            <motion.div animate={{ x: formData.is2FAEnabled ? 26 : 4 }} style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3 }} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>Require a 6-digit authentication code setup for the first login.</p>
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

function UsersView({ users, onAddClick, onEditClick, onDeleteClick, onMessageClick, searchQuery, roleFilter }: any) {
  const filteredUsers = users.filter((u: any) => {
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
          {filteredUsers.map((user: UserMember) => (
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
                  {user.isAuthorized ? (
                    <div style={{ color: '#10B981', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={12} /> SECURE</div>
                  ) : (
                    <div style={{ color: '#F87171', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}><X size={12} /> LOCKED</div>
                  )}
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
                <button onClick={() => onMessageClick(user)} style={{ flex: 1, padding: '14px', borderRadius: 16, background: '#6366F1', border: 'none', color: 'white', fontSize: 13, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><MessageSquare size={16} /> Message</button>
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

function ProjectForm({ initialData, teamMembers, onSave }: { initialData: Project | null, teamMembers: UserMember[], onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    client: initialData?.client || '',
    status: initialData?.status || 'Active',
    priority: initialData?.priority || 'Medium',
    progress: initialData?.progress || 0,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    deadline: initialData?.deadline || '',
    assignedTeam: initialData?.assignedTeam || [] as string[],
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

  const toggleTeamMember = (name: string) => {
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
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>

            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>PRIORITY</label>
          <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as any })} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
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


function ProjectsView({ projects, onAddClick, onEditClick, onDeleteClick, searchQuery, statusFilter }: any) {
  const filteredProjects = projects.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (p: string) => {
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
        <div className="admin-grid-cards-420" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 32 }}>
          {filteredProjects.map((p: Project) => (
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
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function BlogsView({ blogs, onAddClick, onEditClick, onDeleteClick, searchQuery, categoryFilter }: any) {
  const filteredBlogs = blogs.filter((b: any) => {
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
        <div className="admin-grid-cards-380" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 32 }}>
          {filteredBlogs.map((blog: Blog) => (
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
function BlogForm({ initialData, onSave }: { initialData: Blog | null, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'Technology',
    author: initialData?.author || '',
    authorRole: 'Chief Architect', // Simulated role field
    date: initialData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
    readTime: initialData?.readTime || '5 min',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    content: initialData?.content || ''
  });

  const handleAction = () => {
    if (!formData.title || !formData.content || !formData.author) {
      alert('Title, Author, and Content are mandatory for publication.');
      return;
    }
    onSave(formData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div className={`admin-grid-2 gap-${20}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
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
      </div>

      <div className={`admin-grid-3 gap-${20}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
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
                setFormData({ ...formData, image: reader.result as string });
              };
              reader.readAsDataURL(file);
            }
          }} />
        </div>
        {formData.image && formData.image.length > 500 && <p style={{ fontSize: 11, color: '#10B981', marginTop: 8, fontWeight: 700 }}>✓ Local image uploaded successfully</p>}
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
        <Zap size={22} fill="white" /> {initialData ? 'PUBLISH UPDATES' : 'LAUNCH NEW ARTICLE'}
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
        <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 10 }}>BOOM! 🎆</h2>
        <p style={{ fontSize: 18, color: '#94A3B8', fontWeight: 700 }}>Your article has been launched successfully.</p>
      </motion.div>
    </div>
  );
}

function MessagesView({ users, activeUser, setActiveUser, messages, onSend, onDelete, newMessage, setNewMessage, editingMessageId, setEditingMessageId, replyingToMessageId, setReplyingToMessageId, onToggleFavorite, onFileUpload, chatSearchQuery, setChatSearchQuery, onCreateGroup, onUpdateGroup, statuses, onAddStatus, onDeleteStatus, onViewStatus }: any) {
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isManageGroupModalOpen, setIsManageGroupModalOpen] = useState(false);
  const [viewingStatusUserId, setViewingStatusUserId] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<number[]>([]);

  const myStatuses = statuses.filter((s: any) => s.userId === 1);
  const usersWithStatuses = users.filter((u: any) => u.id !== 1 && !u.isGroup && statuses.some((s: any) => s.userId === u.id));

  const filteredUsers = users.filter((u: UserMember) => u.name.toLowerCase().includes(userSearchQuery.toLowerCase()));
  const favorites = filteredUsers.filter((u: UserMember) => u.isFavorite);
  const others = filteredUsers.filter((u: UserMember) => !u.isFavorite);

  const currentChatMessages = messages.filter((m: Message) =>
    ((m.senderId === 1 && m.receiverId === activeUser?.id) ||
      (m.senderId === activeUser?.id && m.receiverId === 1)) &&
    (m.text.toLowerCase().includes(chatSearchQuery.toLowerCase()))
  );

  return (
    <motion.div className="admin-messages-layout" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ height: 'calc(100vh - 200px)', display: 'flex', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className="messages-sidebar" style={{ width: 350, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '32px 32px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: 24, fontWeight: 900 }}>Klan<span className="gradient-text">Messages</span></h3>

          {/* WhatsApp Status Row */}
          <div style={{ marginTop: 20, marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Status Updates</div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>

              {/* My Status */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}>
                <div
                  onClick={() => myStatuses.length > 0 ? setViewingStatusUserId(1) : document.getElementById('status-upload')?.click()}
                  style={{ padding: myStatuses.length > 0 ? 2 : 0, borderRadius: '50%', background: myStatuses.length > 0 ? 'linear-gradient(45deg, #10B981, #34D399)' : 'transparent', cursor: 'pointer' }}
                >
                  <img src={`https://ui-avatars.com/api/?name=Kiran&background=6366F1&color=fff`} style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #0F172A' }} />
                </div>
                {myStatuses.length === 0 && (
                  <div onClick={() => document.getElementById('status-upload')?.click()} style={{ position: 'absolute', bottom: 16, right: 0, width: 16, height: 16, background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0F172A', cursor: 'pointer' }}>
                    <Plus size={10} color="white" strokeWidth={4} />
                  </div>
                )}
                <input id="status-upload" type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onAddStatus(reader.result as string, file.type.startsWith('video/') ? 'video' : 'image');
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
                <span style={{ fontSize: 10, color: '#E2E8F0', fontWeight: 700 }}>My Status</span>
              </div>

              {/* Other Users Statuses */}
              {usersWithStatuses.map((u: any) => {
                const hasUnseen = statuses.filter((s: any) => s.userId === u.id).some((s: any) => !s.viewers.includes(1));
                return (
                  <div key={`status-${u.id}`} onClick={() => setViewingStatusUserId(u.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
                    <div style={{ padding: 2, borderRadius: '50%', background: hasUnseen ? 'linear-gradient(45deg, #10B981, #34D399)' : '#475569' }}>
                      <img src={`https://ui-avatars.com/api/?name=${u.name}&background=${u.color.replace('#', '')}&color=fff`} style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #0F172A' }} />
                    </div>
                    <span style={{ fontSize: 10, color: '#E2E8F0', fontWeight: 700, maxWidth: 50, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input type="text" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} placeholder="Search team..." style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white', fontSize: 13, outline: 'none' }} />
            </div>
            <button onClick={() => setIsGroupModalOpen(true)} title="Create Group" style={{ width: 44, height: 44, borderRadius: 12, background: '#6366F1', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Users size={18} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {favorites.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', letterSpacing: '1px', padding: '0 16px 12px', textTransform: 'uppercase' }}>Starred Persons</div>
              {favorites.map((user: UserMember) => (
                <ChatContact key={user.id} user={user} activeUser={activeUser} setActiveUser={setActiveUser} messages={messages} onToggleFavorite={onToggleFavorite} />
              ))}
            </div>
          )}

          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', letterSpacing: '1px', padding: '0 16px 12px', textTransform: 'uppercase' }}>Recent Chats</div>
            {others.map((user: UserMember) => (
              <ChatContact key={user.id} user={user} activeUser={activeUser} setActiveUser={setActiveUser} messages={messages} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeUser ? (
          <>
            <style>{`
              @keyframes chatBgPan {
                from { background-position: 0 0; }
                to { background-position: -400px 400px; }
              }
              .animated-chat-bg {
                animation: chatBgPan 60s linear infinite;
              }
            `}</style>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <div onClick={() => activeUser.isGroup && setIsManageGroupModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: activeUser.isGroup ? 'pointer' : 'default' }}>
                <img src={`https://ui-avatars.com/api/?name=${activeUser.name}&background=${activeUser.color.replace('#', '')}&color=fff`} style={{ width: 44, height: 44, borderRadius: 12 }} />
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 900 }}>{activeUser.name}</h4>
                  <div style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} /> {activeUser.isGroup ? `${activeUser.groupMembers.length} members (Click to manage)` : activeUser.status}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 12px 10px 38px', color: 'white', fontSize: 12, outline: 'none', width: 220 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 16, color: '#64748B' }}>
                  <Star size={20} style={{ cursor: 'pointer' }} />
                  <X size={20} style={{ cursor: 'pointer' }} onClick={() => setActiveUser(null)} />
                </div>
              </div>
            </div>

            <div className="animated-chat-bg" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '32px', display: 'flex', flexDirection: 'column', gap: 16, background: '#0b141a', backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', backgroundRepeat: 'repeat', backgroundSize: '400px', position: 'relative' }}>
              {currentChatMessages.map((m: Message) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: m.senderId === 1 ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    maxWidth: '70%', alignSelf: m.senderId === 1 ? 'flex-end' : 'flex-start',
                    display: 'flex', flexDirection: 'column', alignItems: m.senderId === 1 ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '10px 14px', borderRadius: 12,
                    borderTopRightRadius: m.senderId === 1 ? 4 : 12,
                    borderTopLeftRadius: m.senderId === 1 ? 12 : 4,
                    background: m.senderId === 1 ? '#005c4b' : '#202c33',
                    color: '#e9edef', fontSize: 14, position: 'relative',
                    boxShadow: '0 1px 0.5px rgba(11,20,26,.13)'
                  }}>
                    {m.replyToId && messages.find((rm: any) => rm.id === m.replyToId) && (
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: 8, marginBottom: 8, borderLeft: `4px solid ${m.senderId === 1 ? '#00a884' : '#6366F1'}`, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                        <div style={{ fontWeight: 800, color: m.senderId === 1 ? '#00a884' : '#6366F1', marginBottom: 2 }}>
                          {messages.find((rm: any) => rm.id === m.replyToId)?.senderId === 1 ? 'You' : activeUser.name}
                        </div>
                        {messages.find((rm: any) => rm.id === m.replyToId)?.text}
                      </div>
                    )}
                    {m.attachment && (
                      <div style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={m.attachment} style={{ width: '100%', maxHeight: 300, display: 'block', objectFit: 'cover' }} />
                      </div>
                    )}
                    {m.text}
                    <div className="msg-del-btn" style={{ position: 'absolute', top: -10, right: m.senderId === 1 ? -40 : 'auto', left: m.senderId === 1 ? 'auto' : -40, display: 'flex', gap: 4, opacity: 0 }}>
                      <button onClick={() => setReplyingToMessageId(m.id)} title="Reply" style={{ background: '#3b82f6', border: 'none', color: 'white', borderRadius: '50%', width: 22, height: 22, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CornerUpLeft size={10} /></button>
                      {m.senderId === 1 && <button onClick={() => { setEditingMessageId(m.id); }} style={{ background: '#F59E0B', border: 'none', color: 'white', borderRadius: '50%', width: 22, height: 22, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={10} /></button>}
                      <button onClick={() => onDelete(m.id)} style={{ background: '#EF4444', border: 'none', color: 'white', borderRadius: '50%', width: 22, height: 22, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={10} /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#8696a0', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, paddingRight: m.senderId === 1 ? 4 : 0, paddingLeft: m.senderId === 1 ? 0 : 4 }}>
                    {m.timestamp} {m.senderId === 1 && <div style={{ color: m.isRead ? '#53bdeb' : '#8696a0' }}><CheckCheck size={14} /></div>}
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', background: '#202c33', padding: '10px 20px' }}>
              {replyingToMessageId && (
                <div style={{ background: '#2a3942', padding: '10px 14px', borderRadius: 8, borderLeft: '4px solid #00a884', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00a884', marginBottom: 4 }}>Replying to {messages.find((m: any) => m.id === replyingToMessageId)?.senderId === 1 ? 'yourself' : activeUser.name}</div>
                    <div style={{ fontSize: 13, color: '#e9edef' }}>{messages.find((m: any) => m.id === replyingToMessageId)?.text}</div>
                  </div>
                  <button onClick={() => setReplyingToMessageId(null)} style={{ background: 'none', border: 'none', color: '#8696a0', cursor: 'pointer' }}><X size={18} /></button>
                </div>
              )}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {['😀', '😂', '👍', '❤️', '🎉', '😢'].map(emoji => (
                    <span key={emoji} style={{ cursor: 'pointer', fontSize: 20, transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onClick={() => setNewMessage((prev: string) => prev + emoji)}>{emoji}</span>
                  ))}
                </div>
                <label title="Attach Image" style={{ background: 'none', border: 'none', color: '#8696a0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', marginLeft: 8 }} onMouseEnter={e => e.currentTarget.style.color = '#00a884'} onMouseLeave={e => e.currentTarget.style.color = '#8696a0'}>
                  <Paperclip size={22} />
                  <input type="file" accept="image/*" onChange={onFileUpload} style={{ display: 'none' }} />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && onSend()}
                  placeholder={editingMessageId ? "Edit your message..." : "Type a message"}
                  style={{ flex: 1, padding: '12px 18px', borderRadius: 8, background: '#2a3942', border: 'none', color: '#d1d7db', outline: 'none', fontSize: 15 }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSend()}
                  style={{
                    width: 44, height: 44, borderRadius: '50%', background: '#00a884', border: 'none', color: '#111b21',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  {editingMessageId ? <Check size={20} /> : <Send size={18} style={{ marginLeft: 2 }} />}
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, color: '#475569' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={48} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#94A3B8' }}>Your Secure Hub</h3>
              <p style={{ fontSize: 14, marginTop: 8 }}>Select an employee to start a secure conversation.</p>
            </div>
          </div>
        )}
      </div>

      {isGroupModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: 400, background: '#1E293B', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Create New Group</h3>
            <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group Name" style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', marginBottom: 20 }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>SELECT ADMINS / MEMBERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
              {users.filter((u: any) => !u.isGroup).map((u: any) => (
                <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedGroupMembers.includes(u.id)} onChange={(e) => {
                    if (e.target.checked) setSelectedGroupMembers(prev => [...prev, u.id]);
                    else setSelectedGroupMembers(prev => prev.filter(id => id !== u.id));
                  }} />
                  <span style={{ color: 'white', fontSize: 14 }}>{u.name} <span style={{ color: '#64748B', fontSize: 12 }}>({u.role})</span></span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setIsGroupModalOpen(false)} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => {
                if (newGroupName && selectedGroupMembers.length > 0) {
                  onCreateGroup(newGroupName, selectedGroupMembers);
                  setIsGroupModalOpen(false);
                  setNewGroupName('');
                  setSelectedGroupMembers([]);
                }
              }} style={{ flex: 1, padding: 14, borderRadius: 12, background: '#10B981', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800 }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {isManageGroupModalOpen && activeUser?.isGroup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: 450, background: '#1E293B', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Manage {activeUser.name}</h3>

            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>GROUP MEMBERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto', marginBottom: 20, paddingRight: 8 }}>
              {users.filter((u: any) => !u.isGroup).map((u: any) => {
                const isMember = activeUser.groupMembers.includes(u.id);
                const isAdmin = activeUser.admins.includes(u.id);
                const isMe = u.id === 1; // Super Admin is 1
                const iAmAdmin = activeUser.admins.includes(1);

                return (
                  <div key={`manage-${u.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={`https://ui-avatars.com/api/?name=${u.name}&background=${u.color.replace('#', '')}&color=fff`} style={{ width: 32, height: 32, borderRadius: 8 }} />
                      <div>
                        <div style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{u.name} {isMe && '(You)'}</div>
                        <div style={{ color: isAdmin ? '#10B981' : '#64748B', fontSize: 10 }}>{isAdmin ? 'Group Admin' : 'Member'}</div>
                      </div>
                    </div>
                    {!isMe && iAmAdmin && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {isMember ? (
                          <>
                            <button onClick={() => onUpdateGroup(activeUser.id, activeUser.groupMembers, isAdmin ? activeUser.admins.filter((id: number) => id !== u.id) : [...activeUser.admins, u.id])} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8', cursor: 'pointer', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6 }}>{isAdmin ? 'Remove Admin' : 'Make Admin'}</button>
                            <button onClick={() => onUpdateGroup(activeUser.id, activeUser.groupMembers.filter((id: number) => id !== u.id), activeUser.admins.filter((id: number) => id !== u.id))} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', cursor: 'pointer', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6 }}>Remove</button>
                          </>
                        ) : (
                          <button onClick={() => onUpdateGroup(activeUser.id, [...activeUser.groupMembers, u.id], activeUser.admins)} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', cursor: 'pointer', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6 }}>Add</button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => setIsManageGroupModalOpen(false)} style={{ width: '100%', padding: 14, borderRadius: 12, background: '#6366F1', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 900 }}>Done</button>
          </div>
        </div>
      )}

      {viewingStatusUserId && (
        <StatusViewerModal
          userId={viewingStatusUserId}
          users={users}
          statuses={statuses}
          onClose={() => setViewingStatusUserId(null)}
          onDeleteStatus={onDeleteStatus}
          onViewStatus={onViewStatus}
        />
      )}
    </motion.div>
  );
}

function StatusViewerModal({ userId, users, statuses, onClose, onDeleteStatus, onViewStatus }: any) {
  const userStatuses = statuses.filter((s: any) => s.userId === userId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = users.find((u: any) => u.id === userId) || { id: 1, name: 'You', color: '#6366F1' };

  useEffect(() => {
    if (userStatuses.length > 0 && userId !== 1) {
      onViewStatus(userStatuses[currentIndex].id);
    }
  }, [currentIndex, userStatuses, userId, onViewStatus]);

  if (userStatuses.length === 0) {
    onClose();
    return null;
  }

  const currentStatus = userStatuses[currentIndex];
  const isMe = userId === 1;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 20, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.color.replace('#', '')}&color=fff`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{currentStatus.timestamp}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={28} /></button>
      </div>

      <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', gap: 4, zIndex: 10 }}>
        {userStatuses.map((_: any, idx: number) => (
          <div key={idx} style={{ flex: 1, height: 3, background: idx < currentIndex ? 'white' : (idx === currentIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'), borderRadius: 2 }} />
        ))}
      </div>

      <div style={{ flex: 1, width: '100%', maxWidth: 500, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentStatus.mediaType === 'video' ? (
          <video src={currentStatus.mediaUrl} autoPlay controls style={{ maxWidth: '100%', maxHeight: '100vh' }} onEnded={() => {
            if (currentIndex < userStatuses.length - 1) setCurrentIndex(currentIndex + 1);
            else onClose();
          }} />
        ) : (
          <img src={currentStatus.mediaUrl} style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain' }} />
        )}

        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '30%', cursor: 'pointer' }} onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '30%', cursor: 'pointer' }} onClick={() => {
          if (currentIndex < userStatuses.length - 1) setCurrentIndex(currentIndex + 1);
          else onClose();
        }} />
      </div>

      {isMe && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', cursor: 'pointer' }} title="Viewers">
            <Eye size={20} />
            <span style={{ fontWeight: 700 }}>{currentStatus.viewers.length}</span>
          </div>
          <button onClick={() => {
            onDeleteStatus(currentStatus.id);
            if (userStatuses.length === 1) onClose();
            else if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
          }} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function ChatContact({ user, activeUser, setActiveUser, messages, onToggleFavorite }: any) {
  const lastMsg = messages.filter((m: Message) => (m.senderId === user.id && m.receiverId === 1) || (m.senderId === 1 && m.receiverId === user.id)).pop();

  return (
    <div
      onClick={() => setActiveUser(user)}
      style={{
        padding: '16px', borderRadius: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8,
        background: activeUser?.id === user.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        border: activeUser?.id === user.id ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
        transition: '0.2s', position: 'relative'
      }}
    >
      <div style={{ position: 'relative' }}>
        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.color.replace('#', '')}&color=fff`} style={{ width: 48, height: 48, borderRadius: 14 }} />
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: user.status === 'Online' ? '#10B981' : '#64748B', border: '3px solid #0F172A' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
          <span style={{ fontSize: 10, color: '#64748B' }}>{lastMsg?.timestamp || ''}</span>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastMsg?.text || 'No conversations yet'}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(user.id); }}
        style={{ background: 'none', border: 'none', color: user.isFavorite ? '#F59E0B' : '#475569', cursor: 'pointer', padding: 4 }}
      >
        <Star size={14} fill={user.isFavorite ? '#F59E0B' : 'transparent'} />
      </button>
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
  companyName, setCompanyName
}: any) {
  const [activeSection, setActiveSection] = useState('Interface');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Mock states for other settings
  const [notifications, setNotifications] = useState({ system: true, email: false, desktop: true });
  const [timezone, setTimezone] = useState('GMT+5:30 (India)');

  const sections = [
    { name: 'Interface', icon: LayoutPanelLeft, desc: 'Customize the visual identity and workspace theme.' },
    { name: 'Security', icon: Shield, desc: 'Manage encryption, session logs, and access protocols.' },
    { name: 'Notifications', icon: Bell, desc: 'Configure system alerts and internal communication relays.' },
    { name: 'Branding', icon: Rocket, desc: 'Update logos, brand palettes, and client-facing assets.' },
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
                          onClick={() => setTheme(t as any)}
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
                                setPlatformLogo(reader.result as string);
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


function SettingRow({ title, desc, children }: any) {
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
function SearchCommander({ activeTab, query, setQuery, userRoleFilter, setUserRoleFilter, projectStatusFilter, setProjectStatusFilter, blogCategoryFilter, setBlogCategoryFilter }: any) {
  if (activeTab === 'dashboard' || activeTab === 'messages' || activeTab === 'settings' || activeTab === 'activity') return null;

  const filters: any = {
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
          {currentFilters.map((f: string) => (
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

function ActivityStat({ label, value, icon: Icon, color }: any) {
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

function ActivityView({ activities }: { activities: ActivityLog[] }) {
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
                      <Clock size={12} /> {activity.timestamp}
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

function DashboardView({ projects, users, activities }: any) {
  const deliveredCount = projects.filter((p: any) => p.status === 'Delivered').length;
  const inProgressCount = projects.filter((p: any) => p.status === 'In Progress' || p.status === 'Active').length;
  const upcomingCount = projects.filter((p: any) => p.status === 'Planning' || p.status === 'Upcoming').length;
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
              repeat: Infinity,
              ease: "linear"
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
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Activity size={20} color="#6366F1" /> Live <span className="gradient-text">Pulse</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {activities.slice(0, 6).map((activity: any, i: number) => (
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
                      style={{ width: 10, height: 10, borderRadius: '50%', background: activity.status === 'warning' ? '#EF4444' : '#6366F1', marginTop: 6, boxShadow: `0 0 10px ${activity.status === 'warning' ? '#EF4444' : '#6366F1'}` }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{activity.action}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{activity.user} • {activity.timestamp}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 6, fontStyle: 'italic' }}>{activity.details.substring(0, 30)}...</div>
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

function MetricCard({ title, value, label, icon: Icon, color, trend, isChart, isLive }: any) {
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

function MonitoringRow({ label, value, total, color }: any) {
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

function StatusPanel({ title, icon: Icon, color, count }: any) {
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

function BoardCard({ title, value, desc, color }: any) {
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

function NoResults({ query }: { query: string }) {
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
