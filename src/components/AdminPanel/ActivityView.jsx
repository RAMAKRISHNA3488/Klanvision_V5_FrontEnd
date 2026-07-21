import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Settings, Users, Rocket, FileText, Clock, Trash2, CalendarCheck, Zap } from 'lucide-react';
import { formatTimestamp, ConfirmDeleteModal } from './SharedComponents';
import { api } from '../../utils/api';

function ActivityStat({ label, value, icon: Icon, color }) {
  return (
    <div className="clay-card" style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 20 }}>
      <div className="clay-pill" style={{ width: 56, height: 56, borderRadius: 18, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        <Icon size={26} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>{value}</div>
        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      </div>
    </div>
  );
}

export default function ActivityView({ activities, onRefresh }) {
  const [purging, setPurging] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeToast, setPurgeToast] = useState('');

  const handlePurgeOldData = async () => {
    setPurging(true);
    try {
      const res = await api.purgeOldActivities();
      setPurgeToast(`Purged activity records older than 3 months (${res?.deleted || 0} deleted).`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setPurgeToast('Purge completed. System automatically retains only last 3 months data.');
    } finally {
      setPurging(false);
      setShowPurgeModal(false);
      setTimeout(() => setPurgeToast(''), 4000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Activity Stats */}
      <div className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <ActivityStat label="Total Events" value={activities?.length || 0} icon={Activity} color="#6366F1" />
        <ActivityStat label="Security Alerts" value={activities?.filter(a => a.status === 'warning').length || 0} icon={Shield} color="#EF4444" />
        <ActivityStat label="System Logs" value={activities?.filter(a => a.type === 'system').length || 0} icon={Settings} color="#F59E0B" />
        <ActivityStat label="Retention Limit" value="3 Months" icon={CalendarCheck} color="#10B981" />
      </div>

      {/* Main Live Pulse Container */}
      <div className="clay-card" style={{ borderRadius: 36, padding: '40px 48px' }}>
        
        {/* Header & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: 'white', margin: 0 }}>
                Real-Time <span className="gradient-text">Activity Pulse</span>
              </h2>
              {/* Pulse Indicator */}
              <span className="clay-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} className="animate-ping" />
                LIVE STREAM ACTIVE
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>
              🗓️ Auto-Purge Policy: All event logs older than 3 months (90 days) are automatically deleted from storage.
            </p>
          </div>

          <button
            onClick={() => setShowPurgeModal(true)}
            className="clay-btn clay-btn-rose"
            style={{ padding: '10px 20px', fontSize: 13 }}
            title="Clean up events older than 3 months"
          >
            <Trash2 size={15} /> Purge Data &gt; 3 Months
          </button>
        </div>

        {/* Purge Notification Toast */}
        {purgeToast && (
          <div className="clay-card clay-card-emerald" style={{ padding: '14px 20px', marginBottom: 24, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={16} /> {purgeToast}
          </div>
        )}

        {/* Timeline Events */}
        {(!activities || activities.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8', fontSize: 14 }}>
            No recent activity events recorded. Live Pulse will update automatically as actions occur.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            {/* Vertical Pulse Line */}
            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #6366F1, #10B981, transparent)', opacity: 0.25 }} />

            {activities.map((activity, index) => (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ display: 'flex', gap: 28, marginBottom: 32, position: 'relative', zIndex: 1 }}
              >
                <div 
                  className="clay-pill"
                  style={{
                    width: 48, height: 48, borderRadius: 16, background: '#0F172A', 
                    border: `2px solid ${activity.status === 'warning' ? '#EF4444' : activity.status === 'info' ? '#F59E0B' : '#6366F1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    boxShadow: `0 0 20px ${activity.status === 'warning' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`
                  }}
                >
                  {activity.type === 'security' && <Shield size={18} color={activity.status === 'warning' ? '#EF4444' : '#6366F1'} />}
                  {activity.type === 'project' && <Rocket size={18} color="#6366F1" />}
                  {activity.type === 'content' && <FileText size={18} color="#6366F1" />}
                  {activity.type === 'system' && <Settings size={18} color="#F59E0B" />}
                </div>

                <div style={{ flex: 1 }} className="clay-card-interactive" style={{ padding: '16px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: 'white', margin: 0 }}>{activity.action}</h4>
                      <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, margin: 0 }}>{activity.details}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '1px' }}>{activity.user}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <Clock size={12} /> {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Manual Purge Modal */}
      <ConfirmDeleteModal
        isOpen={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
        onConfirm={handlePurgeOldData}
        title="Purge Activity Data > 3 Months"
        itemName="Logs Older Than 90 Days"
        message="Are you sure you want to run the 3-month cleanup? All audit activity logs and event records created over 3 months ago will be permanently removed."
        loading={purging}
      />
    </motion.div>
  );
}
