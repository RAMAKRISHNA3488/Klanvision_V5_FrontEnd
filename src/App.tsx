// ============================================================
// App.tsx
// Root application component for the Klanvision website.
// Manages the initial loading screen and renders the full
// page layout: Navbar → Sections → Footer → Floating buttons.
// ============================================================

import './index.css';
import './App.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Section Components ───────────────────────────────────────
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StrategicServices from './components/StrategicServices';
import ServicesSection from './components/ServicesSection';
import WhyPartner from './components/WhyPartner';
import PortfolioSection from './components/PortfolioSection';
import TestimonialsSection from './components/TestimonialsSection';
import BlogSection from './components/BlogSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import WhatsAppAssistant from './components/WhatsAppAssistant';

import CareersPage from './components/CareersPage';
import JobApplicationPage from './components/JobApplicationPage';
import AdminPanel from './components/AdminPanel';
import FAQPage from './components/FAQPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ServicePolicyPage from './components/ServicePolicyPage';
import TermsPage from './components/TermsPage';
import ConsultationPage from './components/ConsultationPage';
import ManagedServicesPage from './components/ManagedServicesPage';
import CybersecurityPage from './components/CybersecurityPage';
import WebDevelopmentPage from './components/WebDevelopmentPage';
import MobileAppPage from './components/MobileAppPage';
import CloudServicesPage from './components/CloudServicesPage';
import UpgradeMigrationPage from './components/UpgradeMigrationPage';
import APIIntegrationPage from './components/APIIntegrationPage';
import { MessageCircle } from 'lucide-react';

// ── Loader Component ─────────────────────────────────────────
// Full-screen branded splash screen displayed for 2.4 seconds
// on first load. Fades out with a slight scale-up exit animation.
function Loader() {
  const [status, setStatus] = useState('INITIALIZING...');
  
  useEffect(() => {
    const statuses = [
      'INITIALIZING...',
      'SYNCHRONIZING VISION...',
      'ASSEMBLING INNOVATION...',
      'GENERATING EXCELLENCE...',
      'SYSTEM READY'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setStatus(statuses[i]);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
        display: 'flex', flexDirection: 'column',

        alignItems: 'center', justifyContent: 'center', gap: 30,
        overflow: 'hidden',
        padding: '20px'
      }}
    >
      {/* Celebratory Firework & Cracker Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`cracker-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 500],
              y: [0, (Math.random() - 0.5) * 500],
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "easeOut" 
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'white',
              boxShadow: `0 0 15px 5px ${['#4F46E5', '#7C3AED', '#FF6B35', '#FACC15', '#EC4899'][i % 5]}`,
            }}
          />
        ))}
        
        {/* Large Fireworks */}
        {[...Array(4)].map((_, i) => (
          <div key={`firework-${i}`} style={{ position: 'absolute', top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}>
            {[...Array(12)].map((_, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: [0, Math.cos(j * 30 * (Math.PI / 180)) * 100],
                  y: [0, Math.sin(j * 30 * (Math.PI / 180)) * 100],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.7,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: ['#FF6B35', '#7C3AED', '#4F46E5'][i % 3],
                  boxShadow: `0 0 10px ${['#FF6B35', '#7C3AED', '#4F46E5'][i % 3]}`
                }}
              />
            ))}
          </div>
        ))}
      </div>


      {/* Innovative Logo Core & Orbits */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.85)' }}>
        {/* Concentric Rotating Orbits */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: 130 + i * 30,
              height: 130 + i * 30,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.03)',
              borderTop: `1.5px solid ${i === 0 ? '#6366F1' : i === 1 ? '#EC4899' : '#F97316'}`,
              opacity: 0.5
            }}
          />
        ))}

        {/* Central Logo with Neural Scan Effect */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'relative' }}
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ height: 90, width: 'auto', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))' }} 
          />
          <motion.div
            animate={{ top: ['-5%', '105%', '-5%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute', left: '-5%', right: '-5%',
              height: '1px', background: 'rgba(255,255,255,0.4)',
              boxShadow: '0 0 10px white', zIndex: 2
            }}
          />
        </motion.div>
      </div>

      {/* Visionary Branding Section */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, tracking: '10px' }}
          animate={{ opacity: 1, tracking: '6px' }}
          transition={{ duration: 1 }}
        >
          <h1 style={{ 
            fontFamily: "'Outfit', sans-serif", 
            fontWeight: 900, 
            fontSize: 'clamp(1.8rem, 6vw, 3.2rem)',
            margin: 0,
            background: 'linear-gradient(to right, #6366F1, #A855F7, #EC4899, #F97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            animation: 'shimmer-text 4s linear infinite',
            textShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}>
            KLANVISION
          </h1>
        </motion.div>
        
        <div style={{ marginTop: 15, height: 16 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ 
                color: '#64748B', 
                fontSize: 'clamp(9px, 2.5vw, 11px)', 
                fontWeight: 800,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                fontFamily: 'monospace'
              }}
            >
              {status}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative System Metrics */}
      <div style={{ 
        position: 'absolute', bottom: 30, left: 30, right: 30, 
        display: 'flex', justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 15
      }}>
        <div style={{ display: 'flex', gap: 15 }}>
          <span style={{ color: '#334155', fontSize: 9, fontWeight: 800 }}>CORE_GENESIS</span>
          <span style={{ color: '#334155', fontSize: 9, fontWeight: 800 }}>v4.2.0</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ color: '#059669', fontSize: 9, fontWeight: 800, letterSpacing: '1px' }}>SECURE_SESSION</span>
        </div>
      </div>


      <style>{`
        @keyframes shimmer-text {
          to { background-position: 200% center; }
        }
      `}</style>
    </motion.div>
  );
}



// ── App Component ────────────────────────────────────────────
// Controls app-level state: shows Loader for 2.4s,
// then fades in the full site content.
function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('klanvision_theme') as 'light' | 'dark') || 'light';
  });
  const [activeBot, setActiveBot] = useState<'ai' | 'whatsapp' | null>(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('klanvision_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Hide loader after 2400ms on initial mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(t);   // cleanup on unmount
  }, []);


  // Simple routing for FAQ and Refund Policy pages
  if (window.location.pathname === '/faq') {
    return <FAQPage />;
  }
  if (window.location.pathname === '/refund-policy') {
    return <RefundPolicyPage />;
  }
  if (window.location.pathname === '/privacy-policy') {
    return <PrivacyPolicyPage />;
  }
  if (window.location.pathname === '/service-policy') {
    return <ServicePolicyPage />;
  }
  if (window.location.pathname === '/terms') {
    return <TermsPage />;
  }
  if (window.location.pathname === '/it-consultation') {
    return <ConsultationPage />;
  }
  if (window.location.pathname === '/managed-services') {
    return <ManagedServicesPage />;
  }
  if (window.location.pathname === '/cybersecurity') {
    return <CybersecurityPage />;
  }
  if (window.location.pathname === '/web-development') {
    return <WebDevelopmentPage />;
  }
  if (window.location.pathname === '/mobile-app') {
    return <MobileAppPage />;
  }
  if (window.location.pathname === '/cloud-services') {
    return <CloudServicesPage />;
  }
  if (window.location.pathname === '/upgrade-migration') {
    return <UpgradeMigrationPage />;
  }
  if (window.location.pathname === '/api-integration') {
    return <APIIntegrationPage />;
  }
  if (window.location.pathname === '/careers') {
    return <CareersPage />;
  }
  if (window.location.pathname === '/apply') {
    return <JobApplicationPage />;
  }
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  return (
    <>
      {/* AnimatePresence handles the fade-out exit animation of Loader */}
      <AnimatePresence mode="wait">
        {loading && <Loader />}
      </AnimatePresence>

      {/* Main site content – fades in after loader exits */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Fixed navigation bar at the top */}
          <Navbar theme={theme} toggleTheme={toggleTheme} />


          {/* Page sections in scroll order */}
          <main>
            <Hero />                  {/* Full-screen hero with heading, CTA, and image */}
            <StrategicServices />     {/* 8-card digital services overview grid */}
            <ServicesSection />       {/* Detailed 8-card service offerings */}
            <WhyPartner />            {/* Reasons to partner + animated stats + CTA banner */}
            <PortfolioSection />      {/* Filterable project portfolio grid */}
            <TestimonialsSection />   {/* Client testimonials + trust badges */}
            <BlogSection />           {/* 6 blog article cards */}
            <AboutSection />          {/* Company info, milestones, and highlights */}
            <ContactSection />        {/* Contact form + info card + support image */}
          </main>

          {/* Site footer with brand, links, legal, and contact info */}
          <Footer />

          {/* Sidebar Overlay */}
          <AnimatePresence>
            {activeBot && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveBot(null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 10000,
                  cursor: 'pointer'
                }}
              />
            )}
          </AnimatePresence>

          {/* Chat Assistants */}
          <AIAssistant 
            isOpen={activeBot === 'ai'} 
            onToggle={() => setActiveBot(prev => prev === 'ai' ? null : 'ai')} 
            isVisible={activeBot === null || activeBot === 'ai'}
          />

          <WhatsAppAssistant 
            isOpen={activeBot === 'whatsapp'} 
            onToggle={() => setActiveBot(prev => prev === 'whatsapp' ? null : 'whatsapp')} 
            isVisible={activeBot === null || activeBot === 'whatsapp'}
          />
        </motion.div>

      )}
    </>
  );
}

export default App;
