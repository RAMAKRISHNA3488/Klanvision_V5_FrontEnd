// ============================================================
// Navbar.tsx – Fixed navigation bar for Klanvision.
// Includes: gradient top bar, floating pill nav, active-section
// tracking, full-page search, mobile hamburger menu, CTA button.
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sun, Moon } from 'lucide-react';


// Navigation items – label shown in nav, id used for routing path
const navItems = [
  { label: 'HOME',      id: 'home'      },
  { label: 'SERVICES',  id: 'services'  },
  { label: 'PORTFOLIO', id: 'portfolio' },
  { label: 'BLOG',      id: 'blog'      },
  { label: 'ABOUT',     id: 'about'     },
  { label: 'CONTACT',   id: 'contact'   },
  { label: 'CAREERS',   id: 'careers'   },
];



export default function Navbar({ theme, toggleTheme }) {

  const [mobileOpen, setMobileOpen]       = useState(false);   // mobile menu toggle
  const [searchQuery, setSearchQuery]     = useState('');       // search input value
  const [isSearchOpen, setIsSearchOpen]   = useState(false);   // dropdown visibility
  const searchRef                         = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [activeSection, setActiveSection] = useState('hero');  // currently visible section

  // Track active section on scroll or pathname
  useEffect(() => {
    const path = window.location.pathname;
    const cleanPath = path === '/' ? 'home' : path.substring(1);

    if (cleanPath === 'home' || cleanPath === '') {
      const handleScroll = () => {
        const homeSections = [
          { label: 'HOME',      id: 'hero'      },
          { label: 'SERVICES',  id: 'services'  },
          { label: 'PORTFOLIO', id: 'portfolio' },
          { label: 'BLOG',      id: 'blog'      },
          { label: 'ABOUT',     id: 'about'     },
          { label: 'CONTACT',   id: 'contact'   },
        ];
        const current = [...homeSections]
          .reverse()
          .map(item => ({ id: item.id, el: document.getElementById(item.id) }))
          .find(section => {
            if (!section.el) return false;
            const rect = section.el.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2;
          });

        if (current) {
          const activeId = current.id === 'hero' ? 'home' : current.id;
          setActiveSection(activeId);
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setActiveSection(cleanPath);
    }
  }, []);

  // Build search results from nav labels + DOM text nodes on each query change
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = [];

    // Match nav labels first
    navItems.forEach(item => {
      if (item.label.toLowerCase().includes(query)) {
        results.push({ label: item.label, id: item.id });
      }
    });

    // Then scan page DOM for text content matches (≥2 chars, max 10 results)
    if (query.length >= 2) {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, p, span, li, button'));
      const seenText = new Set();

      for (const el of elements) {
        if (el.closest('header')) continue; // skip nav itself
        if (el.children.length <= 1) {
          const text = el.textContent?.trim() || '';
          if (text.length > 2 && text.length < 80 && text.toLowerCase().includes(query)) {
            const lowerText = text.toLowerCase();
            if (!seenText.has(lowerText)) {
              results.push({ label: text, element: el });
              seenText.add(lowerText);
              if (results.length >= 10) break;
            }
          }
        }
      }
    }
    setSearchResults(results);
  }, [searchQuery]);

  // Close search dropdown when clicking outside the search box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll to a section by id or route and close mobile menu
  const scrollTo = (id) => {
    if (id === 'careers') {
      window.location.href = '/careers';
      return;
    }
    if (id === 'home') {
      window.location.href = '/';
      return;
    }
    window.location.href = `/${id}`;
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Gradient Bar – fixed 60px accent, sits behind nav (zIndex 1000) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', height: 60, zIndex: 1000,
        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 33%, #ec4899 66%, #f97316 100%)',
      }} />

      {/* Nav Header – slides in from top, floats over the gradient bar at top:24 */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed', top: 24, left: 0, right: 0, zIndex: 1001,
          padding: '0 24px',
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}
      >
        {/* White pill container */}
        <div style={{
          width: '100%', maxWidth: 1280,
          background: 'var(--bg-surface)',

          borderRadius: 40,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 12, paddingRight: 0,
          pointerEvents: 'auto',
          height: 64, border: '1px solid var(--border-main)',
          transition: 'all 0.3s ease'
        }}>

          {/* Logo – scales in, scrolls to hero on click */}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.04 }}
            onClick={() => scrollTo('hero')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%' }}
          >
            <img src="/logo.png" alt="Klanvision Logo" style={{ height: 60, width: 'auto', transform: 'scale(1.3)', marginLeft: 16 }} />
          </motion.div>

          {/* Desktop nav links – hidden on ≤1024px via .desktop-nav CSS class */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="desktop-nav">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, fontFamily: 'sans-serif',
                  color: activeSection === item.id ? '#6366f1' : '#4B5563',
                  padding: '4px 0', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center',
                  position: 'relative'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.color = activeSection === item.id ? '#6366f1' : '#4B5563'}
              >
                {item.label}
                {/* Shared layoutId underline animates between active items */}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    style={{ position: 'absolute', bottom: -18, left: 0, right: 0, height: 3, background: '#6366f1', borderRadius: 10 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right section: search + CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }} className="desktop-nav">
            {/* Search Box with live dropdown results */}
            <div ref={searchRef} style={{ padding: '0 24px', position: 'relative' }}>
              <div style={{
                background: '#f3f4f6', padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'text',
                borderRadius: '20px'
              }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 13, color: '#374151', fontWeight: 600, width: 120,
                    fontFamily: 'sans-serif'
                  }}
                />
                <svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Animated dropdown showing search results */}
              <AnimatePresence>
                {isSearchOpen && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute', top: '100%', left: 24, right: 24,
                      marginTop: 8, background: 'white', borderRadius: 12,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden',
                      zIndex: 1002, border: '1px solid #f3f4f6'
                    }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            if (item.id) {
                              scrollTo(item.id);
                            } else if (item.element) {
                              item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              setMobileOpen(false);
                            }
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                          style={{
                            padding: '12px 16px', cursor: 'pointer',
                            fontSize: 13, fontWeight: 500, color: '#4B5563',
                            fontFamily: 'sans-serif', borderBottom: '1px solid #f3f4f6',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.color = '#6366f1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#4B5563';
                          }}
                        >
                          {item.label}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF', fontFamily: 'sans-serif', textAlign: 'center' }}>
                        No results found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Request for Quote – orange pill CTA, flush with the right edge */}
            {/* Admin Secure Login – multicolor animated CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/admin'}
              style={{
                background: '#FF6B35',
                color: 'white', border: 'none',
                height: 'calc(100% + 2px)', padding: '0 32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                fontSize: 13, fontWeight: 900, fontFamily: 'sans-serif',
                borderTopRightRadius: 40, borderBottomRightRadius: 40,
                marginRight: -1, marginTop: -1, marginBottom: -1,
                zIndex: 10,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Status Indicator */}
                <div style={{ position: 'relative', width: 10, height: 10 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#10B981' }} />
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10B981' }}
                  />
                </div>
                ADMIN SECURE LOGIN
                <div style={{
                  width: 24, height: 24, background: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShieldCheck size={14} color="#FF6B35" />
                </div>
              </div>
            </motion.button>

            {/* Theme Toggle – Sun/Moon switch */}
            <div style={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-main)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: theme === 'light' ? '#F59E0B' : '#6366F1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                {theme === 'light' ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Right Actions – theme toggle + hamburger */}
          <div style={{ display: 'none', alignItems: 'center', gap: 8, paddingRight: 16 }} className="mobile-only-flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              style={{
                width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border-main)',
                background: 'var(--bg-surface-soft)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: theme === 'light' ? '#F59E0B' : '#6366F1',
              }}
            >
              {theme === 'light' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </motion.button>

            <button
              id="hamburger-btn"
              onClick={() => setMobileOpen(o => !o)}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none',
                background: 'var(--bg-surface-soft)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-main)'
              }}
            >
              {mobileOpen
                ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" /></svg>
              }
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Dropdown Menu – animated height open/close */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              position: 'fixed', top: 110, left: 24, right: 24, zIndex: 998, 
              background: 'var(--bg-surface)', borderRadius: 24, overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-main)' 
            }}
          >
            <div style={{ padding: '16px' }}>
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(item.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 16px', borderRadius: 12, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: 14, fontWeight: 600,
                    fontFamily: 'sans-serif',
                    color: 'var(--text-main)'
                  }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavMobile"
                      style={{ height: 2, width: 20, background: '#6366f1', marginTop: 4, borderRadius: 2 }}
                    />
                  )}
                </motion.button>
              ))}
              {/* Mobile Theme Toggle Row - Entire row clickable */}
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.05 }}
                onClick={toggleTheme}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 12, background: 'var(--bg-surface-soft)',
                  marginTop: 8, border: '1px solid var(--border-main)', cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: theme === 'light' ? '#F59E0B' : '#6366F1' }}>
                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                {/* Visual toggle switch look */}
                <div style={{ 
                  width: 44, height: 24, borderRadius: 20, background: theme === 'light' ? '#e5e7eb' : '#6366f1', 
                  position: 'relative', transition: 'all 0.3s' 
                }}>
                  <motion.div 
                    animate={{ x: theme === 'light' ? 2 : 22 }}
                    style={{ 
                      width: 20, height: 20, borderRadius: '50%', background: 'white', 
                      position: 'absolute', top: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                    }} 
                  />
                </div>
              </motion.div>

              {/* Mobile Admin CTA */}
              <motion.button
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navItems.length + 1) * 0.05 }}
                onClick={() => window.location.href = '/admin'}
                style={{
                  background: '#FF6B35', color: 'white', border: 'none',
                  padding: '14px', cursor: 'pointer', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  fontSize: 13, fontWeight: 900, fontFamily: 'sans-serif',
                  borderRadius: 12, marginTop: 12
                }}
              >
                <div style={{ position: 'relative', width: 8, height: 8 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#10B981' }} />
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10B981' }}
                  />
                </div>
                ADMIN SECURE LOGIN
                <div style={{
                  width: 22, height: 22, background: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShieldCheck size={12} color="#FF6B35" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide desktop nav on ≤1024px, show hamburger instead */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-only-flex { display: flex !important; }
        }
      `}</style>
    </>
  );
}
