import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { NoResults } from './SharedComponents';

export function ProjectForm({ initialData, teamMembers, onSave, triggerToast }) {
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
      triggerToast('Project title, client, and deadline are required.', 'Project Directory');
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>PROJECT TITLE</label>
          <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Apollo Interface" style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 10 }}>CLIENT NAME</label>
          <input type="text" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="e.g. SpaceX" style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

export default function ProjectsView({ projects, onAddClick, onEditClick, onDeleteClick, searchQuery, statusFilter, canEdit }) {
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
          <h2 className="admin-section-title">Project Control</h2>
          <p className="admin-section-subtitle">Track project status, client milestones, progress, and team assignments.</p>
        </div>
        {canEdit && (
          <button onClick={onAddClick} className="btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
            <Plus size={22} /> Initiate Project
          </button>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <NoResults query={searchQuery} />
      ) : (
        <div className="admin-grid-cards-420" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 28 }}>
          {filteredProjects.map((p) => (
            <motion.div key={p.id} layout whileHover={{ y: -6 }} className="clay-card clay-card-interactive" style={{ padding: '32px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', borderTop: `4px solid ${p.color}` }}>

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
                        <img key={idx} src={`https://ui-avatars.com/api/?name=${name}&background=1E293B&color=fff`} style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid #1E293B', marginLeft: idx > 0 ? -8 : 0 }} />
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

              {canEdit && (
                <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                  <button onClick={() => onEditClick(p)} style={{ flex: 1, padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Edit2 size={16} /> Manage</button>
                  <button onClick={() => onDeleteClick(p.id)} style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
