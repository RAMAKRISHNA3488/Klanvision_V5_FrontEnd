import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreVertical, X, Eye, Edit, Trash2, CheckCircle, Clock, Calendar, Download, RefreshCw, FileText, ChevronDown, ChevronLeft, ChevronRight, MoveLeft, MoveRight, Award, AlertCircle, ShieldCheck, ListFilter, User } from 'lucide-react';
import { api, API_BASE_URL } from '../../utils/api';

const TruncatedCertificateList = ({ itemsString }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!itemsString || typeof itemsString !== 'string') return <span>{itemsString || 'N/A'}</span>;
  
  const items = itemsString.split(',').map(s => s.trim()).filter(Boolean);
  if (items.length <= 2) {
    return <span>{itemsString}</span>;
  }
  
  if (isExpanded) {
    return (
      <div>
        <span>{items.join(', ')}</span>
        <button onClick={() => setIsExpanded(false)} style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginLeft: 8, padding: 0 }}>Show less</button>
      </div>
    );
  }
  
  const visibleItems = items.slice(0, 2).join(', ');
  return (
    <div>
      <span>{visibleItems}</span>
      <button onClick={() => setIsExpanded(true)} style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 11, fontWeight: 700, cursor: 'pointer', marginLeft: 8, padding: 0 }}>Etc., (+{items.length - 2})</button>
    </div>
  );
};

export default function CertificationModule() {
  useEffect(() => {
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const filterDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedStatsMonth, setSelectedStatsMonth] = useState(new Date().toISOString().slice(0, 7));
  const [statsFilterMode, setStatsFilterMode] = useState('date'); // Changed default to date so they see the full calendar immediately
  const [selectedStatsYear, setSelectedStatsYear] = useState(new Date().getFullYear().toString());
  const [selectedStatsDate, setSelectedStatsDate] = useState(new Date().toISOString().slice(0, 10));
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDateChange = (date) => {
    setSelectedStatsDate(date);
    if (date.length >= 7) setSelectedStatsMonth(date.slice(0, 7));
    if (date.length >= 4) setSelectedStatsYear(date.slice(0, 4));
  };

  const handleMonthChange = (month) => {
    setSelectedStatsMonth(month);
    if (month.length >= 4) setSelectedStatsYear(month.slice(0, 4));
    setSelectedStatsDate(`${month}-01`);
  };

  const handleYearChange = (year) => {
    setSelectedStatsYear(year);
    setSelectedStatsMonth(`${year}-01`);
    setSelectedStatsDate(`${year}-01-01`);
  };
  
  const [modalMode, setModalMode] = useState('add');
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const actionMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setActiveFilterColumn(null);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActiveActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUniqueValues = (key) => {
    if (key === 'status') return ['Verified', 'Pending', 'Completed'];
    if (key === 'certificateType') {
      const dbTypes = certifications.map(cert => cert.certificateType || cert.certificate_type || '').filter(Boolean);
      // If dbTypes are comma-separated strings, split them. Otherwise just use them.
      const splitTypes = dbTypes.flatMap(typeStr => typeof typeStr === 'string' ? typeStr.split(',').map(s => s.trim()) : typeStr);
      return [...new Set(['Participation Certificate', 'Professional Certificate', 'Apricate Certificate', 'Business Certificate', ...splitTypes])].filter(Boolean);
    }

    const values = certifications.map(cert => {
      if (key === 'certificateNumber') return cert.certificateNumber || cert.certificate_number || cert.id || '';
      if (key === 'candidateName') return cert.candidateName || cert.candidate_name || cert.name || '';
      if (key === 'certificateName') return cert.certificateName || cert.certificate_name || cert.certName || '';
      if (key === 'issueDate') return cert.issueDate || cert.issue_date || '';
      if (key === 'technicalLead') return cert.technicalLead || cert.technical_lead || cert.techLead || '';
      if (key === 'internshipManager') return cert.internshipManager || cert.internship_manager || cert.manager || '';
      if (key === 'issuedBy') return cert.issuedBy || cert.issued_by || cert.issuer || '';
      if (key === 'location') return cert.location || '';
      return '';
    }).filter(Boolean);
    return [...new Set(values)];
  };

  const handleColumnFilterToggle = (columnKey, value) => {
    setColumnFilters(prev => {
      const current = prev[columnKey] || [];
      if (current.includes(value)) {
        return { ...prev, [columnKey]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [columnKey]: [...current, value] };
      }
    });
    setActiveFilterColumn(null); // Auto close
    setCurrentPage(1); // Reset page on filter change
  };
  const IssueDateGridFilterDropdown = ({ columnKey, title }) => {
    const [localFilterMode, setLocalFilterMode] = useState('year');
    const [localSelectedYear, setLocalSelectedYear] = useState(new Date().getFullYear().toString());
    const [localSelectedMonth, setLocalSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [localSelectedDate, setLocalSelectedDate] = useState(new Date().toISOString().slice(0, 10));

    const handleApply = () => {
      let valToApply;
      if (localFilterMode === 'date') valToApply = localSelectedDate;
      else if (localFilterMode === 'month') valToApply = localSelectedMonth;
      else valToApply = localSelectedYear;
      
      setColumnFilters(prev => ({ ...prev, [columnKey]: [valToApply] }));
      setActiveFilterColumn(null);
      setCurrentPage(1);
    };

    const handleClear = () => {
      setColumnFilters(prev => ({ ...prev, [columnKey]: [] }));
      setActiveFilterColumn(null);
      setCurrentPage(1);
    };

    const monthlyCounts = Array(12).fill(0);
    const yrCounts = Array(12).fill(0);
    const winStart = new Date().getFullYear() - 5;
    const [sy, sm] = localSelectedMonth.split('-');
    const dInM = new Date(parseInt(sy, 10), parseInt(sm, 10), 0).getDate();
    const fDom = new Date(parseInt(sy, 10), parseInt(sm, 10) - 1, 1).getDay();
    const dCounts = Array(dInM + 1).fill(0);

    certifications.forEach(c => {
      const issueDateStr = c.issueDate || c.issue_date;
      if (issueDateStr) {
        const date = new Date(issueDateStr);
        if (!isNaN(date.getTime())) {
          const dy = date.getFullYear();
          if (dy >= winStart && dy < winStart + 12) yrCounts[dy - winStart]++;
          if (dy === parseInt(localSelectedYear, 10)) monthlyCounts[date.getMonth()]++;
          if (dy === parseInt(sy, 10) && date.getMonth() === parseInt(sm, 10) - 1) dCounts[date.getDate()]++;
        }
      }
    });

    const isFilterActive = (columnFilters[columnKey] || []).length > 0;

    return (
      <th style={{ padding: '16px 24px', fontWeight: 700, position: 'relative' }}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setActiveFilterColumn(activeFilterColumn === columnKey ? null : columnKey);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative' }}
        >
          <motion.div whileHover={{ color: '#E2E8F0' }} style={{ display: 'flex', alignItems: 'center', gap: 6, color: isFilterActive ? '#10B981' : 'inherit' }}>
            {title} <ListFilter size={12} color={isFilterActive ? '#10B981' : "#64748B"} />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {activeFilterColumn === columnKey && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                position: 'absolute', top: '100%', left: 24, background: '#1E293B', border: '1px solid #334155', 
                borderRadius: 16, padding: 16, zIndex: 100, minWidth: 280, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: 4, marginBottom: 16, justifyContent: 'space-between' }}>
                {[{id: 'year', label: 'Year'}, {id: 'month', label: 'Month'}, {id: 'date', label: 'Date'}].map(mode => {
                  const isActive = localFilterMode === mode.id || (localFilterMode === 'month' && mode.id === 'year') || (localFilterMode === 'date' && (mode.id === 'year' || mode.id === 'month'));
                  return (
                    <div key={mode.id} onClick={() => setLocalFilterMode(mode.id)}
                      style={{ padding: '6px 10px', fontSize: 11, fontWeight: 700, borderRadius: 6, cursor: 'pointer', textAlign: 'center', flex: 1, background: isActive ? '#3B82F6' : 'transparent', color: isActive ? '#FFF' : '#64748B', transition: 'all 0.2s' }}>
                      {mode.label}
                    </div>
                  );
                })}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                {localFilterMode === 'date' ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>
                      {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(sm, 10) - 1]} {sy}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                        <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#64748B', paddingBottom: 4 }}>{d}</div>
                      ))}
                      {[...Array(fDom)].map((_, i) => <div key={'pad-'+i} />)}
                      {[...Array(dInM)].map((_, i) => {
                        const day = i + 1;
                        const dateVal = sy + '-' + sm + '-' + String(day).padStart(2, '0');
                        const isSelected = localSelectedDate === dateVal;
                        return (
                          <div key={day} onClick={() => { setLocalSelectedDate(dateVal); setLocalSelectedMonth(sy + '-' + sm); setLocalSelectedYear(sy); }}
                            style={{ position: 'relative', padding: '6px 0', textAlign: 'center', fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: 'pointer', background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (isSelected ? '#3B82F6' : 'transparent'), color: isSelected ? '#60A5FA' : '#E2E8F0' }}>
                            {day}
                            {dCounts[day] > 0 && (
                              <div style={{ position: 'absolute', top: -4, right: -4, background: 'linear-gradient(135deg, #EC4899, #EF4444)', color: 'white', fontSize: 8, fontWeight: 900, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 6px rgba(236, 72, 153, 0.8)' }}>
                                {dCounts[day]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : localFilterMode === 'month' ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>
                      {localSelectedYear}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((mName, idx) => {
                        const monthVal = localSelectedYear + '-' + String(idx + 1).padStart(2, '0');
                        const isSelected = localSelectedMonth === monthVal;
                        return (
                          <div key={mName} onClick={() => { setLocalSelectedMonth(monthVal); setLocalSelectedYear(localSelectedYear); setLocalSelectedDate(monthVal + '-01'); }}
                            style={{ position: 'relative', padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: 'pointer', background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (isSelected ? '#3B82F6' : 'rgba(255,255,255,0.05)'), color: isSelected ? '#60A5FA' : '#94A3B8' }}>
                            {mName}
                            {monthlyCounts[idx] > 0 && (
                              <div style={{ position: 'absolute', top: -6, right: -6, background: 'linear-gradient(135deg, #EC4899, #EF4444)', color: 'white', fontSize: 9, fontWeight: 900, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)', border: '2px solid rgba(30, 41, 59, 1)' }}>
                                {monthlyCounts[idx]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>
                      SELECT YEAR
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {[...Array(12)].map((_, idx) => {
                        const year = (winStart + idx).toString();
                        const isSelected = localSelectedYear === year;
                        return (
                          <div key={year} onClick={() => { setLocalSelectedYear(year); setLocalSelectedMonth(year + '-01'); setLocalSelectedDate(year + '-01-01'); }}
                            style={{ position: 'relative', padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: 'pointer', background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (isSelected ? '#3B82F6' : 'rgba(255,255,255,0.05)'), color: isSelected ? '#60A5FA' : '#94A3B8' }}>
                            {year}
                            {yrCounts[idx] > 0 && (
                              <div style={{ position: 'absolute', top: -6, right: -6, background: 'linear-gradient(135deg, #EC4899, #EF4444)', color: 'white', fontSize: 9, fontWeight: 900, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)', border: '2px solid rgba(30, 41, 59, 1)' }}>
                                {yrCounts[idx]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #334155' }}>
                <button onClick={handleClear} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Clear</button>
                <button onClick={handleApply} style={{ flex: 1, padding: '8px', background: '#3B82F6', border: 'none', color: 'white', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>Apply</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </th>
    );
  };


  const FilterDropdown = ({ columnKey, title }) => {
    const uniqueValues = getUniqueValues(columnKey);
    const selectedValues = columnFilters[columnKey] || [];
    
    return (
      <th style={{ padding: '16px 24px', fontWeight: 700, position: 'relative' }}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setActiveFilterColumn(activeFilterColumn === columnKey ? null : columnKey);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative' }}
        >
          <motion.div whileHover={{ color: '#E2E8F0' }} style={{ display: 'flex', alignItems: 'center', gap: 6, color: selectedValues.length > 0 ? '#10B981' : 'inherit' }}>
            {title} <ListFilter size={12} color={selectedValues.length > 0 ? '#10B981' : "#64748B"} />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {activeFilterColumn === columnKey && (
            <motion.div 
              ref={filterDropdownRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                position: 'absolute', top: '100%', left: 24, background: '#1E293B', border: '1px solid #334155', 
                borderRadius: 8, padding: 12, zIndex: 50, minWidth: 200, boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                maxHeight: 300, overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 600 }}>Filter by {title}</div>
              {uniqueValues.length === 0 ? <div style={{ fontSize: 13, color: '#64748B' }}>No options available</div> : null}
              {uniqueValues.map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer', fontSize: 13, color: 'white', textTransform: 'none', fontWeight: 400 }}>
                  <input 
                    type="checkbox" 
                    checked={selectedValues.includes(val)}
                    onChange={() => handleColumnFilterToggle(columnKey, val)}
                    style={{ accentColor: '#10B981', cursor: 'pointer', width: 14, height: 14 }}
                  />
                  {val}
                </label>
              ))}
              {selectedValues.length > 0 && (
                <div 
                  onClick={() => setColumnFilters(prev => ({ ...prev, [columnKey]: [] }))}
                  style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #334155', color: '#EF4444', fontSize: 12, cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}
                >
                  Clear Filter
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </th>
    );
  };

  const ToolbarFilterDropdown = ({ columnKey, title, icon }) => {
    const uniqueValues = getUniqueValues(columnKey);
    const selectedValues = columnFilters[columnKey] || [];
    
    return (
      <div style={{ position: 'relative' }}>
        <motion.div 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveFilterColumn(activeFilterColumn === `toolbar-${columnKey}` ? null : `toolbar-${columnKey}`);
          }}
          style={{ 
            background: selectedValues.length > 0 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))' : '#0F172A', 
            border: selectedValues.length > 0 ? '1px solid #10B981' : '1px solid #1E293B', 
            borderRadius: 8, display: 'flex', alignItems: 'center', padding: '10px 16px', 
            cursor: 'pointer', gap: 8, color: selectedValues.length > 0 ? '#34D399' : '#CBD5E1', 
            transition: 'all 0.3s', boxShadow: selectedValues.length > 0 ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
          }}
        >
          {icon}
          <span style={{ fontSize: 14 }}>{title}</span>
          <ChevronDown size={16} />
        </motion.div>
        
        <AnimatePresence>
          {activeFilterColumn === `toolbar-${columnKey}` && (
            <motion.div 
              ref={filterDropdownRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                position: 'absolute', top: '100%', left: 0, marginTop: 8, background: '#1E293B', border: '1px solid #334155', 
                borderRadius: 8, padding: 12, zIndex: 50, minWidth: 200, boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                maxHeight: 300, overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, fontWeight: 600 }}>Filter by {title}</div>
              {uniqueValues.length === 0 ? <div style={{ fontSize: 13, color: '#64748B' }}>No options available</div> : null}
              {uniqueValues.map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer', fontSize: 13, color: 'white', textTransform: 'none', fontWeight: 400 }}>
                  <input 
                    type="checkbox" 
                    checked={selectedValues.includes(val)}
                    onChange={() => handleColumnFilterToggle(columnKey, val)}
                    style={{ accentColor: '#10B981', cursor: 'pointer', width: 14, height: 14 }}
                  />
                  {val}
                </label>
              ))}
              {selectedValues.length > 0 && (
                <div 
                  onClick={() => setColumnFilters(prev => ({ ...prev, [columnKey]: [] }))}
                  style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #334155', color: '#EF4444', fontSize: 12, cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}
                >
                  Clear Filter
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  const [formData, setFormData] = useState({
    certificateNumber: '',
    candidateName: '',
    certificateName: '',
    issueDate: '',
    technicalLead: '',
    internshipManager: '',
    issuedBy: '',
    location: '',
    certificateType: ['Business Certificate']
  });

  const [files, setFiles] = useState({
    participationFile: null,
    professionalFile: null,
    businessFile: null,
    apricateFile: null,
    photoFile: null
  });

  const participationRef = useRef(null);
  const professionalRef = useRef(null);
  const businessRef = useRef(null);
  const apricateRef = useRef(null);
  const photoRef = useRef(null);

  const fetchCertifications = async () => {
    try {
      const data = await api.getCertifications();
      setCertifications(data);
    } catch (error) {
      console.error('Failed to fetch certifications', error);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateStatus = async (id, newStatus, currentCert) => {
    // Optimistic UI update for instant feedback
    setCertifications(prev => prev.map(c => 
      (c.id === id || c.certificateNumber === id || c.certificate_number === id) 
        ? { ...c, status: newStatus } 
        : c
    ));
    
    try {
      // The backend route has been added and deployed to Cloudflare!
      // We can now cleanly update ONLY the status field without disturbing other parts!
      const jsonData = { status: newStatus };
      await api.updateCertification(id, jsonData);
      
      setSuccessMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchCertifications();
    } catch (err) {
      console.error('Update Status Error:', err);
      setError(`Backend Error: ${err.message || 'Unknown'}`);
      setTimeout(() => setError(null), 6000);
      fetchCertifications(); // Revert on failure
    }
  };

  const handleDownloadCertificates = async (cert, rowId) => {
    setSuccessMsg("Gathering certificates for download...");
    const docs = ['participation', 'professional', 'business', 'apricate'];
    
    let token = null;
    try {
        const sessionStr = localStorage.getItem('klanvision_admin_session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.user && session.user.token) token = session.user.token;
        }
    } catch (e) {}

    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const availableBlobs = [];
    
    await Promise.all(docs.map(async (docType) => {
      try {
        const url = `${API_BASE_URL}/certifications/${rowId}/document/${docType}`;
        const response = await fetch(url, { headers });
        if (response.ok) {
          const blob = await response.blob();
          
          let filename = `${docType}_certificate_${rowId}`;
          const contentDisposition = response.headers.get('Content-Disposition');
          if (contentDisposition && contentDisposition.includes('filename=')) {
              filename = contentDisposition.split('filename=')[1].replace(/["']/g, '');
          } else {
              const ext = blob.type.split('/')[1] || 'png';
              filename = `${filename}.${ext}`;
          }
          
          availableBlobs.push({ blob, filename });
        }
      } catch (e) {
        // Silently fail for missing docs
      }
    }));

    if (availableBlobs.length === 0) {
       setError("No certificates found to download.");
       setTimeout(() => setError(null), 3000);
       setSuccessMsg(null);
       return;
    }

    if (availableBlobs.length === 1) {
       const item = availableBlobs[0];
       const downloadUrl = window.URL.createObjectURL(item.blob);
       const link = document.createElement('a');
       link.href = downloadUrl;
       link.download = item.filename;
       document.body.appendChild(link);
       link.click();
       link.remove();
       window.URL.revokeObjectURL(downloadUrl);
       setSuccessMsg("Certificate downloaded successfully!");
       setTimeout(() => setSuccessMsg(null), 3000);
    } else {
       try {
         const JSZip = (await import('jszip')).default;
         const { saveAs } = await import('file-saver');
         
         const zip = new JSZip();
         availableBlobs.forEach(item => {
            zip.file(item.filename, item.blob);
         });
         
         const zipBlob = await zip.generateAsync({ type: 'blob' });
         saveAs(zipBlob, `Certificates_${rowId}.zip`);
         setSuccessMsg("Certificates downloaded as ZIP!");
         setTimeout(() => setSuccessMsg(null), 3000);
       } catch (err) {
         setError("Failed to create ZIP file.");
         setTimeout(() => setError(null), 3000);
         setSuccessMsg(null);
       }
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await api.deleteCertification(deleteConfirmId);
      setSuccessMsg("Certification deleted successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchCertifications();
    } catch (err) {
      setError(err.message || "Failed to delete certification.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleCertTypeToggle = (type) => {
    setFormData(prev => {
      const current = Array.isArray(prev.certificateType) ? prev.certificateType : [prev.certificateType];
      if (current.includes(type)) {
        return { ...prev, certificateType: current.filter(t => t !== type) };
      } else {
        return { ...prev, certificateType: [...current, type] };
      }
    });
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [field]: e.target.files[0] });
    }
  };

  const compressImage = (file, maxWidth = 1200) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      if (typeof file === 'string' || !file.type || !file.type.startsWith('image/')) return resolve(file); // Don't compress non-images (e.g. PDFs)
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', 0.7);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'certificateNumber', 'candidateName', 'certificateName', 'issueDate',
      'technicalLead', 'internshipManager', 'issuedBy', 'location'
    ];
    
    const isPhotoRequired = modalMode === 'add' ? !files.photoFile : false;
    const isMissingFields = requiredFields.some(field => !formData[field]) || isPhotoRequired || formData.certificateType.length === 0;
    
    if (isMissingFields) {
      setError(modalMode === 'add' ? "Please fill in all mandatory fields, including the Candidate Photo." : "Please fill in all mandatory fields.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'certificateType') {
          data.append(key, Array.isArray(formData[key]) ? formData[key].join(', ') : formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });
      
      if (files.participationFile) data.append('participationFile', await compressImage(files.participationFile));
      if (files.professionalFile) data.append('professionalFile', await compressImage(files.professionalFile));
      if (files.businessFile) data.append('businessFile', await compressImage(files.businessFile));
      if (files.apricateFile) data.append('apricateFile', await compressImage(files.apricateFile));
      if (files.photoFile) data.append('photoFile', await compressImage(files.photoFile, 500));

      if (modalMode === 'edit' && selectedCertId) {
        await api.updateCertification(selectedCertId, data);
        setSuccessMsg("Certification Details Updated Successfully!");
      } else {
        await api.createCertification(data);
        setSuccessMsg("Certification Details Added Successfully!");
      }
      
      setIsModalOpen(false);
      
      // Reset form
      setFormData({
        certificateNumber: '', candidateName: '', certificateName: '', issueDate: '',
        technicalLead: '', internshipManager: '', issuedBy: '', location: '', certificateType: ['Business Certificate']
      });
      setFiles({ participationFile: null, professionalFile: null, businessFile: null, apricateFile: null, photoFile: null });
      setModalMode('add');
      setSelectedCertId(null);
      
      fetchCertifications();
      
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      console.error('Failed to save certification', e);
      setError(e.message || 'Failed to save to database. Please try again.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      // Use dynamic imports so they don't block initial render
      const ExcelJS = (await import('exceljs')).default;
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Certifications');

      // Add Headers
      worksheet.columns = [
        { header: 'Certificate Number', key: 'certificateNumber', width: 25 },
        { header: 'Candidate Name', key: 'candidateName', width: 25 },
        { header: 'Certificate Name', key: 'certificateName', width: 30 },
        { header: 'Issue Date', key: 'issueDate', width: 15 },
        { header: 'Technical Lead', key: 'technicalLead', width: 25 },
        { header: 'Project Manager', key: 'internshipManager', width: 25 },
        { header: 'Issued By', key: 'issuedBy', width: 20 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Certificate Type', key: 'certificateType', width: 20 },
        { header: 'Status', key: 'status', width: 15 }
      ];

      // Style Header
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: {style:'thin', color: {argb:'FF059669'}},
          left: {style:'thin', color: {argb:'FF059669'}},
          bottom: {style:'thin', color: {argb:'FF059669'}},
          right: {style:'thin', color: {argb:'FF059669'}}
        };
      });

      // Add Data from currently filtered view
      filteredCertifications.forEach((cert, index) => {
        const row = worksheet.addRow({
          certificateNumber: cert.certificateNumber || cert.certificate_number || cert.id,
          candidateName: cert.candidateName || cert.candidate_name || cert.name,
          certificateName: cert.certificateName || cert.certificate_name || cert.certName,
          issueDate: cert.issueDate || cert.issue_date,
          technicalLead: cert.technicalLead || cert.technical_lead || cert.techLead,
          internshipManager: cert.internshipManager || cert.internship_manager || cert.manager,
          issuedBy: cert.issuedBy || cert.issued_by || cert.issuer,
          location: cert.location,
          certificateType: cert.certificateType || cert.certificate_type || cert.certificateName || cert.certificate_name || '',
          status: cert.status || 'Verified'
        });

        // Alternating row colors
        if (index % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }; // Light mint green
          });
        }
      });

      // Save
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'KlanVision_Certifications.xlsx');
      
      setSuccessMsg("Exported to Excel successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Export error", err);
      setError("Failed to export Excel. Please try again.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const filteredCertifications = certifications.filter(cert => {
    const passesColumnFilters = Object.entries(columnFilters).every(([key, selectedValues]) => {
      if (!selectedValues || selectedValues.length === 0) return true;
      let val = '';
      if (key === 'certificateType') {
        const types = cert.certificateType || cert.certificate_type || cert.certificateName || cert.certificate_name || '';
        // If it's a comma-separated string, check if any of the selected filters match any part
        if (typeof types === 'string') {
          return selectedValues.some(selected => types.includes(selected));
        }
        return selectedValues.includes(types);
      }
      else if (key === 'certificateNumber') val = cert.certificateNumber || cert.certificate_number || cert.id || '';
      else if (key === 'candidateName') val = cert.candidateName || cert.candidate_name || cert.name || '';
      else if (key === 'certificateName') val = cert.certificateName || cert.certificate_name || cert.certName || '';
      else if (key === 'issueDate') {
        val = cert.issueDate || cert.issue_date || '';
        return selectedValues.some(selected => val.startsWith(selected));
      }
      else if (key === 'technicalLead') val = cert.technicalLead || cert.technical_lead || cert.techLead || '';
      else if (key === 'internshipManager') val = cert.internshipManager || cert.internship_manager || cert.manager || '';
      else if (key === 'issuedBy') val = cert.issuedBy || cert.issued_by || cert.issuer || '';
      else if (key === 'location') val = cert.location || '';
      else if (key === 'status') val = cert.status || 'Verified';
      return selectedValues.includes(val);
    });
    if (!passesColumnFilters) return false;

    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const certNo = String(cert.certificateNumber || cert.certificate_number || cert.id || '').toLowerCase();
    const candName = String(cert.candidateName || cert.candidate_name || cert.name || '').toLowerCase();
    const certName = String(cert.certificateName || cert.certificate_name || cert.certName || '').toLowerCase();
    const issueDate = String(cert.issueDate || cert.issue_date || '').toLowerCase();
    const techLead = String(cert.technicalLead || cert.technical_lead || cert.techLead || '').toLowerCase();
    const internManager = String(cert.internshipManager || cert.internship_manager || cert.manager || '').toLowerCase();
    const issuedBy = String(cert.issuedBy || cert.issued_by || cert.issuer || '').toLowerCase();
    const location = String(cert.location || '').toLowerCase();
    const certType = String((cert.certificateName || cert.certificate_name || cert.certificate_type || cert.certName || '')?.includes('Business') ? 'Business' : 'Technical').toLowerCase();
    const status = String(cert.status || '').toLowerCase();
    return certNo.includes(searchLower) || candName.includes(searchLower) || certName.includes(searchLower) || issueDate.includes(searchLower) || techLead.includes(searchLower) || internManager.includes(searchLower) || issuedBy.includes(searchLower) || location.includes(searchLower) || certType.includes(searchLower) || status.includes(searchLower);
  });

  const totalPages = Math.ceil(filteredCertifications.length / itemsPerPage) || 1;
  const paginatedCertifications = filteredCertifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  // Calculate dynamic stats
  const statsTotal = certifications.length;
  const statsVerified = certifications.filter(c => c.status === 'Verified').length;
  const statsPending = certifications.filter(c => c.status === 'Pending').length;
  
  const [statsYearStr, statsMonthStr] = selectedStatsMonth.split('-');
  const statsYear = parseInt(statsYearStr, 10);
  const statsMonth = parseInt(statsMonthStr, 10) - 1; // 0-indexed month
  
  const isFilterActiveOnCard = columnFilters.status?.includes('Completed') && columnFilters.issueDate?.length === 1;

  const statsThisPeriod = certifications.filter(c => {
    if (c.status !== 'Completed') return false; // Only count 'Completed' certificates
    if (!isFilterActiveOnCard) return true; // Show ALL TIME if not filtered
    const appliedPrefix = columnFilters.issueDate[0];
    const issueDateStr = c.issueDate || c.issue_date;
    if (!issueDateStr) return false;
    return issueDateStr.startsWith(appliedPrefix);
  }).length;

  const monthlyCountsForSelectedYear = Array(12).fill(0);
  const currentYear = new Date().getFullYear();
  const yearWindowStart = currentYear - 5;
  const yearlyCounts = Array(12).fill(0);
  
  const [sy, sm] = selectedStatsMonth.split('-');
  const daysInMonth = new Date(parseInt(sy, 10), parseInt(sm, 10), 0).getDate();
  const firstDayOfMonth = new Date(parseInt(sy, 10), parseInt(sm, 10) - 1, 1).getDay();
  const dailyCounts = Array(daysInMonth + 1).fill(0);

  certifications.forEach(c => {
    if (c.status === 'Completed') {
      const issueDateStr = c.issueDate || c.issue_date;
      if (issueDateStr) {
        const date = new Date(issueDateStr);
        if (!isNaN(date.getTime())) {
          const dy = date.getFullYear();
          if (dy >= yearWindowStart && dy < yearWindowStart + 12) {
            yearlyCounts[dy - yearWindowStart]++;
          }
          if (dy === parseInt(selectedStatsYear, 10)) {
            monthlyCountsForSelectedYear[date.getMonth()]++;
          }
          if (dy === parseInt(sy, 10) && date.getMonth() === parseInt(sm, 10) - 1) {
            dailyCounts[date.getDate()]++;
          }
        }
      }
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30, color: 'white', position: 'relative' }}>
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 20, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              background: 'rgba(16, 185, 129, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
              zIndex: 99999,
              fontWeight: 500,
              fontSize: '14px'
            }}
          >
            <CheckCircle size={20} />
            {successMsg}
            <button onClick={() => setSuccessMsg(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: 0, marginLeft: 8, opacity: 0.8 }}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 20, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -50, scale: 0.9, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              background: 'rgba(239, 68, 68, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
              zIndex: 99999,
              fontWeight: 500,
              fontSize: '14px'
            }}
          >
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: 0, marginLeft: 8, opacity: 0.8 }}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Certification <span style={{ color: '#F97316' }}>Management</span>
          </h2>
          <p style={{ color: '#94A3B8', margin: '8px 0 0 0', fontSize: 14 }}>
            Manage and verify all internship certificates
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)' }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => {
            setModalMode('add');
            setSelectedCertId(null);
            setFormData({
              certificateNumber: '', candidateName: '', certificateName: '', issueDate: '',
              technicalLead: '', internshipManager: '', issuedBy: '', location: '', certificateType: ['Business Certificate']
            });
            setFiles({ participationFile: null, professionalFile: null, businessFile: null, apricateFile: null, photoFile: null });
            setIsModalOpen(true);
          }}
          style={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: 12, 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={18} strokeWidth={3} /> Add Certification
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {/* Total Certificates - Purple */}
        <motion.div 
          onClick={() => { const newFilters = {...columnFilters}; delete newFilters.status; setColumnFilters(newFilters); }}
          whileHover={{ scale: 1.03, y: -5, boxShadow: '0 15px 30px rgba(139, 92, 246, 0.2)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ 
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            padding: modalMode === 'view' ? 24 : 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #8B5CF6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Total Certificates</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4, color: 'white' }}>{statsTotal}</div>
            <div style={{ color: '#64748B', fontSize: 13 }}>All time certificates</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))', padding: 14, borderRadius: 14, color: '#A78BFA' }}>
            <Award size={26} strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Verified Certificates - Green */}
        <motion.div 
          onClick={() => setColumnFilters({ ...columnFilters, status: ['Verified'] })}
          whileHover={{ scale: 1.03, y: -5, boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ 
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #10B981',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Verified Certificates</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4, color: 'white' }}>{statsVerified}</div>
            <div style={{ color: '#64748B', fontSize: 13 }}>Successfully verified</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))', padding: 14, borderRadius: 14, color: '#34D399' }}>
            <ShieldCheck size={26} strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Pending Verification - Orange */}
        <motion.div 
          onClick={() => setColumnFilters({ ...columnFilters, status: ['Pending'] })}
          whileHover={{ scale: 1.03, y: -5, boxShadow: '0 15px 30px rgba(245, 158, 11, 0.2)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ 
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #F59E0B',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer'
          }}
        >
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Pending Verification</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4, color: 'white' }}>{statsPending}</div>
            <div style={{ color: '#64748B', fontSize: 13 }}>Awaiting verification</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))', padding: 14, borderRadius: 14, color: '#FBBF24' }}>
            <Clock size={26} strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Certificates Issued - Blue */}
        <motion.div 
          onClick={() => setShowCalendarMenu(!showCalendarMenu)}
          whileHover={{ scale: 1.03, y: -5, boxShadow: '0 15px 30px rgba(59, 130, 246, 0.2)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ 
            background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #3B82F6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            cursor: 'pointer', position: 'relative'
          }}
        >
          <div>
            <div style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              Certificates Issued
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4, color: 'white' }}>{statsThisPeriod}</div>
            <div style={{ color: '#64748B', fontSize: 13 }}>
              {isFilterActiveOnCard ? `Issued in ${columnFilters.issueDate[0]}` : 'All time certificates'}
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))', padding: 14, borderRadius: 14, color: '#60A5FA', overflow: 'visible' }}>
            <Calendar size={26} strokeWidth={2.5} />
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg, #EC4899, #EF4444)',
                color: 'white', fontSize: 11, fontWeight: 900, padding: '2px 6px', borderRadius: 10,
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.6)', border: '2px solid rgba(30, 41, 59, 1)'
              }}
            >
              {statsThisPeriod}
            </motion.div>
          </div>

        </motion.div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 6 }}>
        <div style={{ width: '450px', marginRight: 'auto', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 14px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)', transition: 'border-color 0.2s' }}>
          <Search size={16} color="#64748B" />
          <input 
            type="text" 
            placeholder="Search certificate number, candidate name..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{ background: 'transparent', border: 'none', color: '#E2E8F0', padding: '10px 12px', outline: 'none', width: '100%', fontSize: 14, letterSpacing: '0.3px' }}
          />
        </div>
        
        <ToolbarFilterDropdown columnKey="certificateType" title="Certificate Type" icon={<Award size={16} color="inherit" />} />
        
        <ToolbarFilterDropdown columnKey="status" title="Status" icon={<Filter size={16} color="inherit" />} />
        
        <motion.button 
          whileHover={{ scale: 1.05, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))', borderColor: '#3B82F6', color: '#60A5FA', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => {
            setSearchQuery('');
            setColumnFilters({});
            setActiveFilterColumn(null);
            setCurrentPage(1);
            fetchCertifications();
          }}
          style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, color: '#CBD5E1', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          <RefreshCw size={16} /> Refresh
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))', borderColor: '#10B981', color: '#34D399', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }} 
          whileTap={{ scale: 0.95 }} 
          onClick={handleExportExcel}
          style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, color: '#CBD5E1', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          <Download size={16} /> Export
        </motion.button>
      </div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', minHeight: '620px' }}
      >
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, minWidth: 1200 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)', borderBottom: '1px solid #1E293B', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
                <FilterDropdown columnKey="certificateNumber" title="Certificate Number" />
                <FilterDropdown columnKey="candidateName" title="Candidate Name" />
                <FilterDropdown columnKey="certificateName" title="Certificate Name" />
                <IssueDateGridFilterDropdown columnKey="issueDate" title="Issue Date" />
                <FilterDropdown columnKey="technicalLead" title="Technical Lead" />
                <FilterDropdown columnKey="internshipManager" title="Project Manager" />
                <FilterDropdown columnKey="issuedBy" title="Issued By" />
                <FilterDropdown columnKey="location" title="Location" />
                <FilterDropdown columnKey="certificateType" title="Certificate Type" />
                <FilterDropdown columnKey="status" title="Status" />
                <th style={{ padding: '16px 24px', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCertifications.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                    No certificates found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedCertifications.map((cert, index) => {
                  const rowId = cert.id || cert.certificateNumber || cert.certificate_number || `row-${index}`;
                  return (
                  <motion.tr 
                    key={rowId} 
                    initial={{ background: index % 2 === 0 ? 'rgba(6, 78, 59, 0.2)' : 'rgba(15, 23, 42, 0.4)' }}
                    animate={{ background: index % 2 === 0 ? 'rgba(6, 78, 59, 0.2)' : 'rgba(15, 23, 42, 0.4)' }}
                    whileHover={{ background: 'rgba(16, 185, 129, 0.15)', boxShadow: 'inset 4px 0 0 #10B981' }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.25s ease' }}
                  >
                    <td style={{ padding: '16px 24px', color: '#6366F1', fontWeight: 600 }}>{cert.certificateNumber || cert.certificate_number || cert.id}</td>
                    <td style={{ padding: '16px 24px' }}>{cert.candidateName || cert.candidate_name || cert.name || ''}</td>
                    <td style={{ padding: '16px 24px', color: '#CBD5E1' }}>{cert.certificateName || cert.certificate_name || cert.certName || ''}</td>
                    <td style={{ padding: '16px 24px', color: '#94A3B8' }}>{cert.issueDate || cert.issue_date || ''}</td>
                    <td style={{ padding: '16px 24px' }}>{cert.technicalLead || cert.technical_lead || cert.techLead || ''}</td>
                    <td style={{ padding: '16px 24px' }}>{cert.internshipManager || cert.internship_manager || cert.manager || ''}</td>
                    <td style={{ padding: '16px 24px' }}>{cert.issuedBy || cert.issued_by || cert.issuer || ''}</td>
                    <td style={{ padding: '16px 24px', color: '#94A3B8' }}>{cert.location || ''}</td>
                    <td style={{ padding: '16px 24px', color: '#CBD5E1' }}>
                      <TruncatedCertificateList itemsString={cert.certificateType || cert.certificate_type || cert.certificateName || cert.certificate_name} />
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                        background: cert.status === 'Completed' ? 'rgba(59, 130, 246, 0.1)' : cert.status === 'Verified' ? 'rgba(16, 185, 129, 0.1)' : cert.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: cert.status === 'Completed' ? '#3B82F6' : cert.status === 'Verified' ? '#10B981' : cert.status === 'Rejected' ? '#EF4444' : '#F59E0B'
                      }}>
                        {cert.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: 14, color: '#64748B', position: 'relative' }}>
                        <motion.div 
                          whileHover={{ color: '#3B82F6', scale: 1.1 }} 
                          onClick={() => {
                            setModalMode('view');
                            setSelectedCertId(rowId);
                            const rawType = cert.certificateType || cert.certificate_type || '';
                            const parsedTypes = typeof rawType === 'string' && rawType.length > 0 ? rawType.split(',').map(t => t.trim()).filter(Boolean) : [];
                            setFormData({
                              certificateNumber: cert.certificateNumber || cert.certificate_number || cert.id || '',
                              candidateName: cert.candidateName || cert.candidate_name || cert.name || '',
                              certificateName: cert.certificateName || cert.certificate_name || cert.certName || '',
                              issueDate: cert.issueDate || cert.issue_date || '',
                              technicalLead: cert.technicalLead || cert.technical_lead || cert.techLead || '',
                              internshipManager: cert.internshipManager || cert.internship_manager || cert.manager || '',
                              issuedBy: cert.issuedBy || cert.issued_by || cert.issuer || '',
                              location: cert.location || '',
                              certificateType: parsedTypes.length > 0 ? parsedTypes : ['Business Certificate']
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye size={16} style={{ cursor: 'pointer' }} />
                        </motion.div>
                        <motion.div 
                          whileHover={{ color: '#10B981', scale: 1.1 }} 
                          onClick={() => {
                            setModalMode('edit');
                            setSelectedCertId(rowId);
                            const rawTypeEdit = cert.certificateType || cert.certificate_type || '';
                            const parsedTypesEdit = typeof rawTypeEdit === 'string' && rawTypeEdit.length > 0 ? rawTypeEdit.split(',').map(t => t.trim()).filter(Boolean) : [];
                            setFormData({
                              certificateNumber: cert.certificateNumber || cert.certificate_number || cert.id || '',
                              candidateName: cert.candidateName || cert.candidate_name || cert.name || '',
                              certificateName: cert.certificateName || cert.certificate_name || cert.certName || '',
                              issueDate: cert.issueDate || cert.issue_date || '',
                              technicalLead: cert.technicalLead || cert.technical_lead || cert.techLead || '',
                              internshipManager: cert.internshipManager || cert.internship_manager || cert.manager || '',
                              issuedBy: cert.issuedBy || cert.issued_by || cert.issuer || '',
                              location: cert.location || '',
                              certificateType: parsedTypesEdit.length > 0 ? parsedTypesEdit : ['Business Certificate']
                            });
                            setFiles({ participationFile: null, professionalFile: null, businessFile: null, apricateFile: null, photoFile: null });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit size={16} style={{ cursor: 'pointer' }} />
                        </motion.div>
                        <motion.div whileHover={{ color: '#EF4444', scale: 1.1 }} onClick={() => handleDelete(rowId)}>
                          <Trash2 size={16} style={{ cursor: 'pointer' }} />
                        </motion.div>
                        <div style={{ position: 'relative' }}>
                          <motion.div 
                            whileHover={{ color: 'white', scale: 1.1 }} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === rowId ? null : rowId);
                            }}
                          >
                            <MoreVertical size={16} style={{ cursor: 'pointer' }} />
                          </motion.div>
                          
                          <AnimatePresence>
                            {activeActionMenu === rowId && (
                            <motion.div 
                              ref={actionMenuRef}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15, ease: 'easeOut' }}
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: 8,
                                background: 'rgba(15, 23, 42, 0.95)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                padding: 8,
                                zIndex: 50,
                                minWidth: 180,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset'
                              }}
                            >
                              <div 
                                onClick={() => {
                                  setActiveActionMenu(null);
                                  handleDownloadCertificates(cert, rowId);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 13, color: '#E2E8F0', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s', fontWeight: 500 }} 
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.color = '#60A5FA'; }} 
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                              >
                                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><Award size={15} color="#3B82F6" /></motion.div>
                                Download Certificate
                              </div>

                              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

                              <div 
                                onClick={() => {
                                  setActiveActionMenu(null);
                                  handleUpdateStatus(rowId, 'Verified', cert);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 13, color: '#E2E8F0', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s', fontWeight: 500 }} 
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'; e.currentTarget.style.color = '#34D399'; }} 
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                              >
                                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><CheckCircle size={15} color="#10B981" /></motion.div>
                                Mark as Verified
                              </div>

                              <div 
                                onClick={() => {
                                  setActiveActionMenu(null);
                                  handleUpdateStatus(rowId, 'Pending', cert);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 13, color: '#E2E8F0', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s', fontWeight: 500 }} 
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'; e.currentTarget.style.color = '#FBBF24'; }} 
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                              >
                                <motion.div whileHover={{ scale: 1.2, rotate: -10 }}><Clock size={15} color="#F59E0B" /></motion.div>
                                Mark as Pending
                              </div>

                              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

                              <div 
                                onClick={() => {
                                  setActiveActionMenu(null);
                                  handleUpdateStatus(rowId, 'Completed', cert);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 13, color: '#E2E8F0', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s', fontWeight: 500 }} 
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; e.currentTarget.style.color = '#3B82F6'; }} 
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                              >
                                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><Award size={15} color="#3B82F6" /></motion.div>
                                Mark as Completed
                              </div>

                              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

                              <div 
                                onClick={() => {
                                  setActiveActionMenu(null);
                                  navigator.clipboard.writeText(cert.certificateNumber || cert.certificate_number || cert.id || '');
                                  setSuccessMsg("ID Copied to clipboard!");
                                  setTimeout(() => setSuccessMsg(null), 3000);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 13, color: '#E2E8F0', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s', fontWeight: 500 }} 
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'; e.currentTarget.style.color = '#C084FC'; }} 
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#E2E8F0'; }}
                              >
                                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><ListFilter size={15} color="#A855F7" /></motion.div>
                                Copy ID
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: 13, borderTop: '1px solid #1E293B', background: 'linear-gradient(135deg, #0F172A 0%, #0D1321 100%)' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} 
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: filteredCertifications.length === certifications.length ? '#10B981' : '#F59E0B', boxShadow: filteredCertifications.length === certifications.length ? '0 0 12px rgba(16, 185, 129, 0.6)' : '0 0 12px rgba(245, 158, 11, 0.6)' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#64748B', fontSize: 12, fontWeight: 600 }}>Showing</span>
              <motion.span 
                key={filteredCertifications.length}
                initial={{ scale: 1.4, color: '#818CF8' }}
                animate={{ scale: 1, color: '#E2E8F0' }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{ fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg, #818CF8, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: 24, textAlign: 'center' }}
              >
                {filteredCertifications.length}
              </motion.span>
              <span style={{ color: '#475569', fontSize: 12, fontWeight: 600 }}>out of</span>
              <motion.span 
                key={'total-' + certifications.length}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                style={{ fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: 24, textAlign: 'center' }}
              >
                {certifications.length}
              </motion.span>
              <span style={{ color: '#64748B', fontSize: 12, fontWeight: 600 }}>records</span>
            </div>
            <div style={{ width: 80, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginLeft: 8 }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: certifications.length > 0 ? `${(filteredCertifications.length / certifications.length) * 100}%` : '0%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366F1, #10B981)', boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)' }}
              />
            </div>
          </motion.div>
          <div style={{ display: 'flex', gap: 6 }}>
            <motion.button 
              initial="rest"
              whileHover={currentPage !== 1 ? "hover" : "rest"}
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ 
                background: '#0F172A', 
                color: currentPage === 1 ? '#475569' : '#94A3B8', 
                border: currentPage === 1 ? '1px solid #1E293B' : '1px solid #334155', 
                borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.3s', zIndex: 1, 
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                overflow: 'hidden', position: 'relative' 
              }}
            >
              <motion.div variants={{ hover: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#475569' } }} style={{ position: 'absolute', inset: 0, borderRadius: 8, transition: 'all 0.3s', border: '1px solid transparent' }} />
              <motion.div 
                variants={{ 
                  rest: { x: 0, color: currentPage === 1 ? '#475569' : '#94A3B8' }, 
                  hover: { x: [-3, 2, -3], color: '#FFFFFF', transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } } 
                }} 
                style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MoveLeft size={16} strokeWidth={2.5} />
              </motion.div>
            </motion.button>
            {getPageNumbers().map((page, idx) => (
              <motion.button 
                key={idx} 
                whileHover={page !== '...' && page !== currentPage ? { scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#818CF8', borderColor: '#4F46E5' } : {}}
                whileTap={page !== '...' ? { scale: 0.9 } : {}}
                onClick={() => page !== '...' && setCurrentPage(page)}
                style={{ 
                  background: page === currentPage ? 'linear-gradient(135deg, #6366F1, #4F46E5)' : 'transparent',
                  color: page === currentPage ? '#FFFFFF' : (page === '...' ? '#475569' : '#CBD5E1'),
                  border: page === currentPage ? 'none' : '1px solid #1E293B', 
                  borderRadius: 8, width: 36, height: 36, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: page === '...' ? 'default' : 'pointer', fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: page === currentPage ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                  transition: 'all 0.3s',
                  zIndex: 1
                }}>
                <span style={{ position: 'relative', zIndex: 2 }}>{page}</span>
              </motion.button>
            ))}
            <motion.button 
              initial="rest"
              whileHover={currentPage !== totalPages ? "hover" : "rest"}
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ 
                background: '#0F172A', 
                color: currentPage === totalPages ? '#475569' : '#94A3B8', 
                border: currentPage === totalPages ? '1px solid #1E293B' : '1px solid #334155', 
                borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.3s', zIndex: 1, 
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                overflow: 'hidden', position: 'relative' 
              }}
            >
              <motion.div variants={{ hover: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#475569' } }} style={{ position: 'absolute', inset: 0, borderRadius: 8, transition: 'all 0.3s', border: '1px solid transparent' }} />
              <motion.div 
                variants={{ 
                  rest: { x: 0, color: currentPage === totalPages ? '#475569' : '#94A3B8' }, 
                  hover: { x: [3, -2, 3], color: '#FFFFFF', transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } } 
                }} 
                style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MoveRight size={16} strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)', background: 'rgba(0, 0, 0, 0.8)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ 
                background: '#050A15', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: 22, 
                width: modalMode === 'view' ? 520 : 780, 
                maxWidth: '95%', 
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: modalMode === 'view' ? 24 : 32, 
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20, marginBottom: 10 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {modalMode === 'add' ? <><Award size={24} color="#6366F1" /> Add New Certification</> :
                   modalMode === 'edit' ? <><Edit size={24} color="#10B981" /> Edit Certification</> :
                   <><Eye size={24} color="#3B82F6" /> View Certification</>}
                </h3>
                <motion.div whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X size={24} color="#94A3B8" style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
                </motion.div>
              </div>

              
              {modalMode === 'view' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))', padding: '16px 20px', borderRadius: 16, border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', padding: 12, borderRadius: 12, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}>
                      <Award size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ color: '#93C5FD', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Certificate #{formData.certificateNumber}</div>
                      <div style={{ color: 'white', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>{formData.certificateName}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Candidate Name', value: formData.candidateName, icon: <User size={12} /> },
                      { label: 'Issue Date', value: formData.issueDate, icon: <Calendar size={12} /> },
                      { label: 'Issued By', value: formData.issuedBy, icon: <Award size={12} /> },
                      { label: 'Location', value: formData.location, icon: <MoveRight size={12} /> },
                      { label: 'Technical Lead', value: formData.technicalLead, icon: <ShieldCheck size={12} /> },
                      { label: 'Project Manager', value: formData.internshipManager, icon: <CheckCircle size={12} /> }
                    ].map((item, idx) => (
                      <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {item.icon} {item.label}
                        </div>
                        <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{item.value || 'N/A'}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', margin: '2px 0' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ color: '#CBD5E1', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Certificate Types</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(Array.isArray(formData.certificateType) ? formData.certificateType : [formData.certificateType]).filter(Boolean).map(type => (
                        <div key={type} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))', color: '#34D399', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)' }}>
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h4 style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Certificate Details</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Certificate Number <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleInputChange} placeholder="Enter certificate number" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Candidate Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="candidateName" value={formData.candidateName} onChange={handleInputChange} placeholder="Enter candidate name" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Certificate Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="certificateName" value={formData.certificateName} onChange={handleInputChange} placeholder="Enter certificate name" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Issue Date <span style={{ color: '#EF4444' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input disabled={modalMode === 'view'} type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} placeholder="Select issue date" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Technical Lead <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="technicalLead" value={formData.technicalLead} onChange={handleInputChange} placeholder="Enter technical lead name" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Project Manager <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="internshipManager" value={formData.internshipManager} onChange={handleInputChange} placeholder="Enter project manager name" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Issued By <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="issuedBy" value={formData.issuedBy} onChange={handleInputChange} placeholder="Enter issuer name" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 4, fontWeight: 600 }}>Location <span style={{ color: '#EF4444' }}>*</span></label>
                  <input disabled={modalMode === 'view'} type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Enter location" style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: modalMode === 'view' ? '#94A3B8' : 'white', fontSize: 12, outline: 'none', transition: 'all 0.2s', opacity: modalMode === 'view' ? 0.8 : 1 }} />
                </div>
              </div>

            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', margin: '6px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 11, marginBottom: 6 }}>Certificate Type <span style={{ color: '#EF4444' }}>*</span></label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: 8 }}>
                    {['Participation Certificate', 'Professional Certificate', 'Apricate Certificate', 'Business Certificate'].map(type => (
                      <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'white' }}>
                        <input 
                          disabled={modalMode === 'view'}
                          type="checkbox"
                          checked={Array.isArray(formData.certificateType) ? formData.certificateType.includes(type) : formData.certificateType === type}
                          onChange={() => handleCertTypeToggle(type)}
                          style={{ width: 14, height: 14, accentColor: '#10B981', cursor: modalMode === 'view' ? 'default' : 'pointer' }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#CBD5E1', fontSize: 12, marginBottom: 8 }}>Candidate Photo <span style={{ color: '#EF4444' }}>*</span></label>
                  <div onClick={() => photoRef.current.click()} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                    <input type="file" style={{ display: 'none' }} ref={photoRef} onChange={(e) => handleFileChange(e, 'photoFile')} />
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: 8, borderRadius: 6 }}>
                      <User size={16} />
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Candidate Photo</div>
                      <div style={{ fontSize: 11, color: files.photoFile ? '#10B981' : '#94A3B8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {files.photoFile ? (files.photoFile.name || 'Existing File') : 'Upload file'}
                      </div>
                    </div>
    {files.photoFile && (
      <div 
        onClick={(e) => { e.stopPropagation(); setFiles(prev => ({...prev, photoFile: null})); }}
        style={{ padding: 6, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, color: '#EF4444', marginLeft: 'auto', cursor: 'pointer' }}
      >
        <X size={14} />
      </div>
    )}
                  </div>
                </div>
              </div>

              <div style={{ flex: 2 }}>
                <h4 style={{ color: '#6366F1', fontSize: 12, fontWeight: 700, margin: '0 0 8px 0' }}>Upload Certificate Documents</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {formData.certificateType.includes('Participation Certificate') && (
                    <div onClick={() => participationRef.current.click()} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                      <input type="file" style={{ display: 'none' }} ref={participationRef} onChange={(e) => handleFileChange(e, 'participationFile')} />
                      <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', padding: 8, borderRadius: 6 }}>
                        <User size={16} />
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontSize: 12, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Participation Certificate</div>
                        <div style={{ fontSize: 11, color: files.participationFile ? '#10B981' : '#94A3B8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {files.participationFile ? (files.participationFile.name || 'Existing File') : 'Upload file'}
                        </div>
                      </div>
    {files.participationFile && (
      <div 
        onClick={(e) => { e.stopPropagation(); setFiles(prev => ({...prev, participationFile: null})); }}
        style={{ padding: 6, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, color: '#EF4444', marginLeft: 'auto', cursor: 'pointer' }}
      >
        <X size={14} />
      </div>
    )}
                    </div>
                  )}
                  
                  {formData.certificateType.includes('Professional Certificate') && (
                    <div onClick={() => professionalRef.current.click()} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                      <input type="file" style={{ display: 'none' }} ref={professionalRef} onChange={(e) => handleFileChange(e, 'professionalFile')} />
                      <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: 8, borderRadius: 6 }}>
                        <ShieldCheck size={16} />
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontSize: 12, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Professional Certificate</div>
                        <div style={{ fontSize: 11, color: files.professionalFile ? '#10B981' : '#94A3B8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {files.professionalFile ? (files.professionalFile.name || 'Existing File') : 'Upload file'}
                        </div>
                      </div>
    {files.professionalFile && (
      <div 
        onClick={(e) => { e.stopPropagation(); setFiles(prev => ({...prev, professionalFile: null})); }}
        style={{ padding: 6, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, color: '#EF4444', marginLeft: 'auto', cursor: 'pointer' }}
      >
        <X size={14} />
      </div>
    )}
                    </div>
                  )}
                  
                  {formData.certificateType.includes('Apricate Certificate') && (
                    <div onClick={() => apricateRef.current.click()} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                      <input type="file" style={{ display: 'none' }} ref={apricateRef} onChange={(e) => handleFileChange(e, 'apricateFile')} />
                      <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: 8, borderRadius: 6 }}>
                        <Calendar size={16} />
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontSize: 12, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Apricate Certificate</div>
                        <div style={{ fontSize: 11, color: files.apricateFile ? '#10B981' : '#94A3B8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {files.apricateFile ? (files.apricateFile.name || 'Existing File') : 'Upload file'}
                        </div>
                      </div>
    {files.apricateFile && (
      <div 
        onClick={(e) => { e.stopPropagation(); setFiles(prev => ({...prev, apricateFile: null})); }}
        style={{ padding: 6, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, color: '#EF4444', marginLeft: 'auto', cursor: 'pointer' }}
      >
        <X size={14} />
      </div>
    )}
                    </div>
                  )}

                  {formData.certificateType.includes('Business Certificate') && (
                    <div onClick={() => businessRef.current.click()} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.2s' }}>
                      <input type="file" style={{ display: 'none' }} ref={businessRef} onChange={(e) => handleFileChange(e, 'businessFile')} />
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: 8, borderRadius: 6 }}>
                        <Calendar size={16} />
                      </div>
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ fontSize: 12, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Business Certificate</div>
                        <div style={{ fontSize: 11, color: files.businessFile ? '#10B981' : '#94A3B8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {files.businessFile ? (files.businessFile.name || 'Existing File') : 'Upload file'}
                        </div>
                      </div>
    {files.businessFile && (
      <div 
        onClick={(e) => { e.stopPropagation(); setFiles(prev => ({...prev, businessFile: null})); }}
        style={{ padding: 6, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 6, color: '#EF4444', marginLeft: 'auto', cursor: 'pointer' }}
      >
        <X size={14} />
      </div>
    )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            
                </>
              )}
<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 14 }}>
              <motion.button 
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(51, 65, 85, 0.6)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid #334155', color: '#E2E8F0', padding: '8px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.2s', letterSpacing: '0.5px' }}
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </motion.button>
              
              {modalMode !== 'view' && (
                <motion.button 
                  whileHover={!isSubmitting ? { scale: 1.03, boxShadow: '0 12px 28px -6px rgba(16, 185, 129, 0.55), inset 0 1px 2px rgba(255,255,255,0.2)' } : {}}
                  whileTap={!isSubmitting ? { scale: 0.96 } : {}}
                  disabled={isSubmitting} 
                  onClick={handleSubmit} 
                  style={{ 
                    background: isSubmitting ? 'linear-gradient(135deg, #475569, #334155)' : 'linear-gradient(135deg, #34D399, #059669)', 
                    color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 24px', borderRadius: 10, fontWeight: 700, 
                    display: 'flex', alignItems: 'center', gap: 10, cursor: isSubmitting ? 'wait' : 'pointer', 
                    boxShadow: '0 6px 16px rgba(5, 150, 105, 0.3), inset 0 1px 2px rgba(255,255,255,0.15)',
                    transition: 'background 0.3s', letterSpacing: '0.5px', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <motion.div 
                    animate={{ left: ['-100%', '200%'] }} 
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }} 
                    style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-20deg)', pointerEvents: 'none' }} 
                  />
                  
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: 'flex' }}>
                      <RefreshCw size={18} strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <CheckCircle size={18} strokeWidth={2.5} /> 
                  )}
                  {isSubmitting ? 'Saving...' : (modalMode === 'edit' ? 'Update Certification' : 'Save Certification')}
                </motion.button>
              )}
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          <AnimatePresence>
            {showCalendarMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => { e.stopPropagation(); setShowCalendarMenu(false); }}
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#050A15', // Professional solid deep dark background
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
                    padding: 24, width: 340,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Filter Certificates</div>
                    <button onClick={(e) => { e.stopPropagation(); setShowCalendarMenu(false); }} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}>
                      <X size={20} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: 4, marginBottom: 16, justifyContent: 'space-between' }}>
                    {[{id: 'year', label: 'Year'}, {id: 'month', label: 'Month'}, {id: 'date', label: 'Date'}].map(mode => {
                      const isActive = statsFilterMode === mode.id || 
                        (statsFilterMode === 'month' && mode.id === 'year') || 
                        (statsFilterMode === 'date' && (mode.id === 'year' || mode.id === 'month'));
                      return (
                        <div 
                          key={mode.id}
                          onClick={() => setStatsFilterMode(mode.id)}
                          style={{
                            padding: '6px 10px', fontSize: 11, fontWeight: 700, borderRadius: 6, cursor: 'pointer', textAlign: 'center', flex: 1,
                            background: isActive ? '#3B82F6' : 'transparent',
                            color: isActive ? '#FFF' : '#64748B',
                            transition: 'all 0.2s'
                          }}
                        >
                          {mode.label}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    {statsFilterMode === 'date' ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(sm, 10) - 1]} {sy}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#64748B', paddingBottom: 4 }}>{d}</div>
                          ))}
                          {[...Array(firstDayOfMonth)].map((_, i) => <div key={`pad-${i}`} />)}
                          {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dateVal = `${selectedStatsMonth}-${String(day).padStart(2, '0')}`;
                            const count = dailyCounts[day];
                            const isSelected = selectedStatsDate === dateVal;
                            return (
                              <div
                                key={day}
                                onClick={() => handleDateChange(dateVal)}
                                style={{
                                  position: 'relative',
                                  padding: '6px 0', textAlign: 'center', fontSize: 11, fontWeight: 600,
                                  borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
                                  background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${isSelected ? '#3B82F6' : 'transparent'}`,
                                  color: isSelected ? '#60A5FA' : '#E2E8F0'
                                }}
                                onMouseOver={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseOut={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                              >
                                {day}
                                {count > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    style={{
                                      position: 'absolute', top: -4, right: -4,
                                      background: 'linear-gradient(135deg, #EC4899, #EF4444)',
                                      color: 'white', fontSize: 8, fontWeight: 900,
                                      width: 14, height: 14, borderRadius: '50%',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      boxShadow: '0 0 6px rgba(236, 72, 153, 0.8)',
                                    }}
                                  >
                                    {count}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : statsFilterMode === 'month' ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>
                          {selectedStatsYear}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((mName, idx) => {
                            const monthVal = `${selectedStatsYear}-${String(idx + 1).padStart(2, '0')}`;
                            const count = monthlyCountsForSelectedYear[idx];
                            const isSelected = selectedStatsMonth === monthVal;
                            return (
                              <div
                                key={mName}
                                onClick={() => handleMonthChange(monthVal)}
                                style={{
                                  position: 'relative',
                                  padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 600,
                                  borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                                  background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${isSelected ? '#3B82F6' : 'rgba(255,255,255,0.05)'}`,
                                  color: isSelected ? '#60A5FA' : '#94A3B8'
                                }}
                                onMouseOver={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseOut={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                              >
                                {mName}
                                {count > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    style={{
                                      position: 'absolute', top: -6, right: -6,
                                      background: 'linear-gradient(135deg, #EC4899, #EF4444)',
                                      color: 'white', fontSize: 9, fontWeight: 900,
                                      width: 18, height: 18, borderRadius: '50%',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)',
                                      border: '2px solid rgba(30, 41, 59, 1)'
                                    }}
                                  >
                                    {count}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>
                          SELECT YEAR
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {[...Array(12)].map((_, idx) => {
                            const year = (yearWindowStart + idx).toString();
                            const count = yearlyCounts[idx];
                            const isSelected = selectedStatsYear === year;
                            return (
                              <div
                                key={year}
                                onClick={() => handleYearChange(year)}
                                style={{
                                  position: 'relative',
                                  padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 600,
                                  borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                                  background: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${isSelected ? '#3B82F6' : 'rgba(255,255,255,0.05)'}`,
                                  color: isSelected ? '#60A5FA' : '#94A3B8'
                                }}
                                onMouseOver={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseOut={e => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                              >
                                {year}
                                {count > 0 && (
                                  <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    style={{
                                      position: 'absolute', top: -6, right: -6,
                                      background: 'linear-gradient(135deg, #EC4899, #EF4444)',
                                      color: 'white', fontSize: 9, fontWeight: 900,
                                      width: 18, height: 18, borderRadius: '50%',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)',
                                      border: '2px solid rgba(30, 41, 59, 1)'
                                    }}
                                  >
                                    {count}
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setColumnFilters(prev => {
                          const newF = {...prev};
                          delete newF.issueDate;
                          return newF;
                        });
                        setShowCalendarMenu(false);
                      }} 
                      style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const valToApply = statsFilterMode === 'date' ? selectedStatsDate : statsFilterMode === 'month' ? selectedStatsMonth : selectedStatsYear;
                        setColumnFilters(prev => ({ ...prev, status: ['Completed'], issueDate: [valToApply] }));
                        setShowCalendarMenu(false);
                      }} 
                      style={{ flex: 1, padding: '10px', background: '#3B82F6', border: 'none', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
            onClick={() => !isDeleting && setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 40 }}
              transition={{ type: 'spring', damping: 22, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#0F172A', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 24, padding: 32, width: 420, maxWidth: '90%', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 60px -12px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.1)' }}
            >
              {/* Animated background glow */}
              <motion.div
                animate={{ opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.4) 0%, transparent 70%)', pointerEvents: 'none' }}
              />

              {/* Warning Icon */}
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.15))', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                >
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Trash2 size={32} color="#EF4444" strokeWidth={2} />
                  </motion.div>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 72, height: 72, borderRadius: 20, border: '2px solid rgba(239, 68, 68, 0.3)', pointerEvents: 'none' }}
                />
              </div>

              {/* Text */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ color: '#F8FAFC', fontSize: 20, fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.3px' }}
              >
                Delete Certification?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.6, margin: '0 0 28px 0', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}
              >
                This action is <span style={{ color: '#EF4444', fontWeight: 700 }}>permanent</span> and cannot be undone. The certificate record and all associated files will be removed.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ display: 'flex', gap: 12 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  style={{ flex: 1, padding: '14px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#CBD5E1', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  style={{ flex: 1, padding: '14px 20px', background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', borderRadius: 14, color: 'white', fontSize: 14, fontWeight: 700, cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.7 : 1, boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                >
                  {isDeleting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }}
                    />
                  ) : (
                    <><Trash2 size={16} /> Delete Record</>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
