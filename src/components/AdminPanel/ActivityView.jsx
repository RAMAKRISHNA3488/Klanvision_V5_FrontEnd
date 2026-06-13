import { motion } from 'framer-motion';
import { Activity, Shield, Settings, Users, Rocket, FileText, Clock } from 'lucide-react';
import { formatTimestamp } from './SharedComponents';

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

export default function ActivityView({ activities }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Activity Stats */}
      <div className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
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
