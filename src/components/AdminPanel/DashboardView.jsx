import { motion } from 'framer-motion';
import { Rocket, Star, CheckCircle2, Calendar, Activity, Clock } from 'lucide-react';
import { BoardCard, formatTimestamp } from './SharedComponents';

export default function DashboardView({ projects, users, activities, setActiveTab }) {
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
        <div className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          <MetricCard title="Active Projects" value={inProgressCount} label="Currently Running" icon={Rocket} color="#6366F1" trend="+14%" isLive />
          <MetricCard title="Client Satisfaction" value={successRate} label="Average Rating" icon={Star} color="#10B981" trend="+2.1%" isChart />
          <MetricCard title="Delivered Projects" value="124" label="Successfully Completed" icon={CheckCircle2} color="#818CF8" trend="+8" />
          <MetricCard title="Upcoming Projects" value={upcomingCount} label="In Planning Phase" icon={Calendar} color="#F59E0B" trend="+4" />
        </div>

        {/* --- MAIN MONITORING CORE --- */}
        <div className="admin-grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 40 }}>

          {/* SYSTEM RADAR & PROJECT VELOCITY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div className="clay-card" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
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
            <div className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <StatusPanel title="Future Tasks" icon={Clock} color="#F59E0B" count={upcomingCount} />
              <StatusPanel title="Completed Work" icon={CheckCircle2} color="#10B981" count={deliveredCount} />
            </div>
          </div>

          {/* REAL-TIME AUDIT STREAM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="clay-card" style={{ padding: 40, height: '100%', position: 'relative', overflow: 'hidden' }}>
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
        <div className="admin-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
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
      whileHover={{ y: -6, scale: 1.02 }}
      className="clay-card clay-card-interactive"
      style={{
        padding: 32,
        position: 'relative', overflow: 'hidden',
        borderTop: `4px solid ${color}`
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }}
      />
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
  const percentage = total > 0 ? (value / total) * 100 : 0;
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
      whileHover={{ y: -6, scale: 1.02 }}
      className="clay-card clay-card-interactive"
      style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden', borderTop: `3px solid ${color}` }}
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
