import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Clock, BookOpen, User, ArrowRight, 
  Mail, Bookmark, CheckCircle2, ChevronRight, X, ExternalLink
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function BlogPage() {
  useSEO({
    title: 'Latest Technology Insights, Security & Cloud Blogs | Klanvision',
    description: 'Read the latest technical writeups on web optimization, Cloud environments, Machine Learning workflows, and security solutions from Klanvision experts.',
    keywords: 'Tech Blog, Cloud Computing, Cybersecurity Articles, Next.js optimization, AI tutorials, Klanvision Insights',
    canonical: '/blog',
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['All', 'Cloud', 'Security', 'AI', 'Design', 'Web'];

  // Popular Tags
  const popularTags = ['#DevOps', '#React19', '#NextJS', '#AWSLambda', '#ZeroTrust', '#OAuth', '#RAG', '#FintechUX', '#INP'];

  // Learning resources
  const resources = [
    { title: 'Enterprise Cloud Security Checklist (PDF)', size: '2.4 MB', type: 'E-Book' },
    { title: 'React 19 Core Web Vitals Optimization Guide', size: '1.8 MB', type: 'Guide' },
    { title: 'Zero-Trust Architecture Whitepaper', size: '4.2 MB', type: 'Whitepaper' }
  ];

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    fetch(`${API_BASE_URL}/blogs`)
      .then(res => res.json())
      .then(data => {
        const publishedBlogs = Array.isArray(data) ? data.filter(b => b.status === 'Published' || !b.status) : [];
        setBlogs(publishedBlogs);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs from database:", err);
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  // Filter posts based on Category and Search Query
  const filteredBlogs = blogs.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Identify Featured Post (First item matching filter, or overall first item)
  const featuredPost = filteredBlogs[0];
  const gridPosts = filteredBlogs.slice(1);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const getCatColor = (cat) => {
    const colors = {
      'cloud': '#06B6D4',
      'security': '#EF4444',
      'design': '#EC4899',
      'ai': '#F59E0B',
      'web': '#4F46E5',
    };
    return colors[cat.toLowerCase()] || '#7C3AED';
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      
      {/* ── Blog Hero ───────────────────────────────────────────── */}
      <section style={{ 
        background: 'var(--hero-bg)', 
        padding: '160px 0 80px', 
        position: 'relative', 
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-main)'
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: '6px 16px', borderRadius: 50, marginBottom: 8, fontSize: 13, fontWeight: 700, color: 'var(--primary-purple)', alignSelf: 'center' }}>
              <BookOpen size={14} /> KLANVISION KNOWLEDGE HUB
            </div>
            <h1 style={{ 
              fontSize: 'clamp(32px, 5vw, 64px)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em',
              marginBottom: 16, 
              color: 'var(--text-main)' 
            }}>
              Latest Technical <span className="gradient-text">Insights</span> &amp; Guides
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: 'clamp(15px, 2.5vw, 19px)', 
              maxWidth: 650, 
              margin: '0 auto 24px', 
              lineHeight: 1.6 
            }}>
              Read engineering notes, software architectural guides, security audits, and cloud reviews written directly by our developers.
            </p>

            {/* Live Search Bar */}
            <div style={{ position: 'relative', maxWidth: 500, width: '100%', margin: '0 auto' }}>
              <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 52px',
                  borderRadius: 50,
                  border: '1.5px solid var(--border-main)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: 15,
                  fontWeight: 500,
                  outline: 'none',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'all 0.3s'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Category & Tags Navigation Bar ──────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--border-main)', background: 'var(--bg-surface)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  border: 'none',
                  cursor: 'pointer',
                  background: activeCategory.toLowerCase() === cat.toLowerCase() ? 'var(--primary-purple)' : 'transparent',
                  color: activeCategory.toLowerCase() === cat.toLowerCase() ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} className="desktop-nav">
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Popular:</span>
            {popularTags.slice(0, 5).map(tag => (
              <span key={tag} onClick={() => setSearchQuery(tag.substring(1))} style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-purple)', cursor: 'pointer' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ───────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 40, alignItems: 'start' }}>
            
            {/* Left Column: Posts */}
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 16 }}>Fetching latest technical papers...</p>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-surface)', border: '1px dashed var(--border-main)', borderRadius: 24 }}>
                  <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--primary-purple)' }} />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>No matching articles found</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Try adjusting your search keywords or checking other categories.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                  
                  {/* Featured Post Banner */}
                  {featuredPost && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedBlog(featuredPost)}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-main)',
                        borderRadius: 24,
                        boxShadow: 'var(--card-shadow)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      }}
                    >
                      {/* Graphics Area */}
                      <div style={{ 
                        height: '100%', 
                        minHeight: 220,
                        background: `linear-gradient(135deg, ${getCatColor(featuredPost.category)}08, ${getCatColor(featuredPost.category)}20)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <BookOpen size={72} style={{ color: getCatColor(featuredPost.category), opacity: 0.3 }} />
                        <span style={{ position: 'absolute', top: 20, left: 20, background: getCatColor(featuredPost.category), color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 30, textTransform: 'uppercase' }}>
                          Featured Article
                        </span>
                      </div>

                      {/* Content Area */}
                      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justify: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: getCatColor(featuredPost.category), textTransform: 'uppercase' }}>
                              {featuredPost.category}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{featuredPost.date}</span>
                          </div>
                          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, lineHeight: 1.3 }}>
                            {featuredPost.title}
                          </h2>
                          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-main)', paddingTop: 20 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User size={14} /> {featuredPost.author}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} /> {featuredPost.readTime}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Latest Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    {gridPosts.map((post, idx) => (
                      <motion.article
                        key={post.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        onClick={() => setSelectedBlog(post)}
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-main)',
                          borderRadius: 20,
                          boxShadow: 'var(--card-shadow)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%'
                        }}
                      >
                        <div style={{
                          height: 140,
                          background: `linear-gradient(135deg, ${getCatColor(post.category)}05, ${getCatColor(post.category)}15)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <Bookmark size={44} style={{ color: getCatColor(post.category), opacity: 0.25 }} />
                          <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 700, color: getCatColor(post.category), background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: '4px 10px', borderRadius: 30 }}>
                            {post.category}
                          </span>
                        </div>

                        <div style={{ padding: 24, flexGrow: 1, display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>{post.date}</span>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 10, lineHeight: 1.3 }}>
                              {post.title}
                            </h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                              {post.excerpt}
                            </p>
                          </div>

                          <div style={{ borderTop: '1px solid var(--border-main)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 600 }}>{post.author}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={12} /> {post.readTime}
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>

                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="desktop-nav">
              
              {/* Learning Resources */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 24, borderRadius: 20, boxShadow: 'var(--card-shadow)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, borderBottom: '1px solid var(--border-main)', paddingBottom: 12 }}>
                  Learning Resources
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {resources.map((res, idx) => (
                    <div key={idx} style={{ display: 'flex', justify: 'space-between', alignItems: 'start', gap: 12, cursor: 'pointer' }}
                         onClick={() => alert(`Downloading sample: ${res.title}`)}
                    >
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 800, background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4, color: 'var(--primary-purple)' }}>
                          {res.type}
                        </span>
                        <h5 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{res.title}</h5>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{res.size}</span>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)', marginTop: 4 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag Cloud */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-main)', padding: 24, borderRadius: 20, boxShadow: 'var(--card-shadow)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, borderBottom: '1px solid var(--border-main)', paddingBottom: 12 }}>
                  Search by Tag
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {popularTags.map(tag => (
                    <span 
                      key={tag}
                      onClick={() => setSearchQuery(tag.substring(1))}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        background: 'var(--bg-surface-soft)',
                        border: '1px solid var(--border-main)',
                        padding: '6px 12px',
                        borderRadius: 30,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-purple)'; e.currentTarget.style.color = 'var(--primary-purple)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-main)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Premium Newsletter Card */}
              <div style={{ 
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 
                padding: 28, 
                borderRadius: 24, 
                color: 'white',
                boxShadow: '0 10px 25px rgba(124,58,237,0.2)'
              }}>
                <Mail size={32} style={{ marginBottom: 16 }} />
                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: 'white' }}>Stay Updated</h4>
                <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, marginBottom: 20 }}>
                  Get monthly engineering notes, security audits, and cloud optimization writeups.
                </p>
                <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter business email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: 'none',
                      outline: 'none',
                      fontSize: 13,
                      background: 'rgba(255,255,255,0.15)',
                      color: 'white',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: 'none',
                      background: 'white',
                      color: '#4F46E5',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    Subscribe Now <ArrowRight size={14} />
                  </button>
                </form>
                {subscribed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 12, color: '#10B981', fontWeight: 700 }}>
                    <CheckCircle2 size={14} />
                    <span>Successfully Subscribed!</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Blog Detail Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-surface)',
                maxWidth: 750,
                width: '100%',
                borderRadius: 28,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-main)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh'
              }}
            >
              <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${getCatColor(selectedBlog.category)}08, ${getCatColor(selectedBlog.category)}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={64} style={{ color: getCatColor(selectedBlog.category), opacity: 0.2 }} />
                
                <button 
                  onClick={() => setSelectedBlog(null)}
                  style={{
                    position: 'absolute',
                    top: 20, right: 20,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    width: 36, height: 36,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: 40, overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ background: `${getCatColor(selectedBlog.category)}15`, color: getCatColor(selectedBlog.category), fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 30, textTransform: 'uppercase' }}>
                    {selectedBlog.category}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{selectedBlog.date}</span>
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 20, lineHeight: 1.3 }}>
                  {selectedBlog.title}
                </h3>

                <div style={{ display: 'flex', gap: 20, background: 'var(--bg-surface-soft)', border: '1px solid var(--border-main)', padding: '12px 20px', borderRadius: 12, marginBottom: 24 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>
                    Author: <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{selectedBlog.author}</span>
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>
                    Read Time: <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{selectedBlog.readTime}</span>
                  </span>
                  {selectedBlog.authorLink && (
                    <a href={selectedBlog.authorLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: getCatColor(selectedBlog.category), fontWeight: 700, textDecoration: 'none', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Author Profile <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div style={{ 
                  color: 'var(--text-main)', 
                  fontSize: 15, 
                  lineHeight: 1.8, 
                  fontFamily: "'Roboto', sans-serif",
                  whiteSpace: 'pre-line' 
                }}>
                  {selectedBlog.content}
                </div>
              </div>

              <div style={{ padding: '20px 40px', borderTop: '1px solid var(--border-main)', background: 'var(--bg-surface-soft)', textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedBlog(null)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 12,
                    background: getCatColor(selectedBlog.category),
                    color: 'white',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
