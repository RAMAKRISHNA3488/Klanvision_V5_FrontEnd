import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Plus, Edit2, Trash2, Calendar, Clock, Activity, Link2, Globe, Upload, Zap } from 'lucide-react';
import { NoResults } from './SharedComponents';

export function BlogForm({ initialData, onSave }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 20 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
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

export default function BlogsView({ blogs, onAddClick, onEditClick, onDeleteClick, searchQuery, categoryFilter, canEdit }) {
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
        {canEdit && (
          <button onClick={onAddClick} className="btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
            <Plus size={22} /> Draft Article
          </button>
        )}
      </div>

      {filteredBlogs.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <div className="admin-grid-cards-380" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 28 }}>
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

                {canEdit && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button onClick={() => onEditClick(blog)} style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => onDeleteClick(blog.id)} style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
