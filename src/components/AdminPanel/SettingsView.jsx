import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutPanelLeft, ShieldCheck, Bell, Star, Settings, Upload, Check, Zap } from 'lucide-react';

export default function SettingsView({
  theme, setTheme,
  accentColor, setAccentColor,
  glassIntensity, setGlassIntensity,
  twoFactor, setTwoFactor,
  maintenanceMode, setMaintenanceMode,
  platformLogo, setPlatformLogo,
  companyName, setCompanyName,
  addActivity,
  canEdit
}) {
  const [activeSection, setActiveSection] = useState('Interface');
  const [saveStatus, setSaveStatus] = useState(null);

  // Mock states for other settings
  const [notifications, setNotifications] = useState({ system: true, email: false, desktop: true });
  const [timezone, setTimezone] = useState('GMT+5:30 (India)');

  const sections = [
    { name: 'Interface', icon: LayoutPanelLeft, desc: 'Customize the visual identity and workspace theme.' },
    { name: 'Security', icon: ShieldCheck, desc: 'Manage encryption, session logs, and access protocols.' },
    { name: 'Notifications', icon: Bell, desc: 'Configure system alerts and internal communication relays.' },
    { name: 'Branding', icon: Star, desc: 'Update logos, brand palettes, and client-facing assets.' },
    { name: 'System', icon: Settings, desc: 'Core platform parameters and diagnostic controls.' }
  ];

  const handleSave = () => {
    if (!canEdit) return;
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
          {saveStatus.includes('success') ? <Check size={20} /> : <Zap size={20} style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />}
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
                onClick={() => canEdit && setMaintenanceMode(!maintenanceMode)}
                style={{ width: 44, height: 22, borderRadius: 20, background: maintenanceMode ? '#EF4444' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: canEdit ? 'pointer' : 'not-allowed', transition: '0.3s', opacity: canEdit ? 1 : 0.6 }}
              >
                <motion.div animate={{ x: maintenanceMode ? 24 : 4 }} style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', position: 'absolute', top: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content Area */}
        <div style={{ flex: 1, background: 'rgba(15, 23, 42, 0.4)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', padding: 48, overflowY: 'auto', pointerEvents: canEdit ? 'auto' : 'none', opacity: canEdit ? 1 : 0.8 }}>
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
                {canEdit && <button onClick={handleSave} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 14, fontSize: 13 }}>SAVE CHANGES</button>}
              </div>

              {activeSection === 'Interface' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <SettingRow title="System Theme" desc="Switch between different visual styles for the dashboard.">
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['Dark', 'Light', 'Neon'].map(t => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
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
                                setPlatformLogo(reader.result);
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

function SettingRow({ title, desc, children }) {
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
