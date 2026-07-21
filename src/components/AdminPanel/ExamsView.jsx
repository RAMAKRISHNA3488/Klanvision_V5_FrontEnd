import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, GraduationCap, Clock, FileText, Edit2, Trash2, Rocket, X, 
  Send, Copy, Check, FileSpreadsheet, Award, Calendar, AlertTriangle, ShieldCheck, Download, User
} from 'lucide-react';
import { api } from '../../utils/api';
import { BoardCard, NoResults, ConfirmDeleteModal } from './SharedComponents';

const internshipRoles = [
  "Cyber Security & Ethical Hacking",
  "Internet of Things",
  "Software Development",
  "Embedded Systems",
  "VLSI",
  "SQL",
  "Power BI",
  "Cloud Computing",
  "Block Chain Technology",
  "DevOps",
  "Software Testing",
  "Automation Testing",
  "Big Data",
  "C Programming",
  "C++ Programming",
  "Digital Marketing",
  "Data Science",
  "Android Development",
  "Frontend Web Development",
  "Python Programming",
  "Java Programming",
  "Machine Learning",
  "Artificial Intelligence",
  "UI/UX Design",
  "Data Analytics",
  "React.js Web Development",
  "Mern Stack Web Development",
  ".Net Web Development",
  "Figma Web Development",
  "Figma App Development",
  "Full Stack Web Development",
  "Backend Web Development"
];

const jobs = [
  "React.js Developer",
  "Node.js Developer",
  "Full Stack MERN Developer",
  "Python Developer",
  "Data Engineer",
  "DevSecOps Engineer"
];

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function ExamsView({ triggerToast }) {
  const [activeSubTab, setActiveSubTab] = useState('blueprints'); // 'blueprints', 'invitations', 'reports'
  
  // Exams State
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  const [examForm, setExamForm] = useState({
    test_name: '',
    role: '',
    timer: 30,
    shuffle: true,
    negative_marking: true,
    negative_marks: 0.25,
    scheduled_start: '',
    scheduled_end: ''
  });

  // Questions State
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    marks: 2,
    difficulty: 'Medium',
    section_id: 'sec-core',
    section_name: 'Core Technical Concepts'
  });

  // Invitations State
  const [invitations, setInvitations] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [generatedInvite, setGeneratedInvite] = useState(null); // holds result after generation
  const [inviteForm, setInviteForm] = useState({
    exam_id: '',
    name: '',
    email: '',
    expires_at: ''
  });
  const [shareTab, setShareTab] = useState('public'); // 'public' or 'individual'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reports State
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsSearchQuery, setReportsSearchQuery] = useState('');
  
  // Certification State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedAttemptForCert, setSelectedAttemptForCert] = useState(null);
  const [certForm, setCertForm] = useState({
    technicalLead: 'Kiran Kumar Moopuri',
    internshipManager: 'Alex Rivera',
    certificateType: 'Exam Competency Certification'
  });

  // Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    title: '',
    itemName: '',
    message: '',
    onConfirm: null,
    loading: false
  });

  const allRoles = [...jobs, ...internshipRoles];

  // Initial load
  useEffect(() => {
    loadExams();
  }, []);

  // Sync sub-tabs loading
  useEffect(() => {
    if (activeSubTab === 'invitations') {
      loadInvitations();
    } else if (activeSubTab === 'reports') {
      loadReports();
    }
  }, [activeSubTab]);

  const loadExams = () => {
    setLoadingExams(true);
    api.getExams()
      .then(data => { if (data) setExams(data); })
      .catch(err => console.error("Error loading exams:", err))
      .finally(() => setLoadingExams(false));
  };

  const loadInvitations = () => {
    setLoadingInvites(true);
    api.getInvitations()
      .then(data => { if (data) setInvitations(data); })
      .catch(err => triggerToast("Failed to load invitations: " + err.message, "Exam Manager"))
      .finally(() => setLoadingInvites(false));
  };

  const loadReports = () => {
    setLoadingReports(true);
    api.getExamReports()
      .then(data => { if (data) setReports(data); })
      .catch(err => triggerToast("Failed to load reports: " + err.message, "Exam Manager"))
      .finally(() => setLoadingReports(false));
  };

  // Exam actions
  const handleOpenAdd = () => {
    setEditingExam(null);
    setExamForm({
      test_name: '',
      role: allRoles[0],
      timer: 30,
      shuffle: true,
      negative_marking: true,
      negative_marks: 0.25,
      scheduled_start: '',
      scheduled_end: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingExam(exam);
    setExamForm({
      test_name: exam.test_name,
      role: exam.role,
      timer: exam.timer,
      shuffle: exam.shuffle,
      negative_marking: exam.negative_marking,
      negative_marks: exam.negative_marks,
      scheduled_start: exam.scheduled_start || '',
      scheduled_end: exam.scheduled_end || ''
    });
    setIsModalOpen(true);
  };

  const requestDeleteExam = (exam) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Exam Blueprint',
      itemName: exam.test_name,
      message: `Are you sure you want to delete the exam blueprint "${exam.test_name}"? All associated questions and test configurations will be permanently removed.`,
      loading: false,
      onConfirm: () => executeDeleteExam(exam.id)
    });
  };

  const executeDeleteExam = async (id) => {
    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await api.deleteExam(id);
      setExams(prev => prev.filter(e => e.id !== id));
      triggerToast("Exam blueprint successfully deleted.", "Exam Manager");
    } catch (err) {
      triggerToast("Failed to delete exam: " + err.message, "Exam Manager");
    } finally {
      setDeleteModalState({ isOpen: false, title: '', itemName: '', message: '', onConfirm: null, loading: false });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        const updated = await api.updateExam(editingExam.id, examForm);
        setExams(prev => prev.map(e => e.id === editingExam.id ? updated : e));
      } else {
        const created = await api.createExam(examForm);
        setExams(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      triggerToast(editingExam ? "Exam settings updated." : "New exam blueprint initiated.", "Exam Manager");
    } catch (err) {
      triggerToast("Failed to save exam: " + err.message, "Exam Manager");
    }
  };

  // Questions actions
  const handleManageQuestions = async (exam) => {
    setSelectedExamForQuestions(exam);
    setIsQuestionsModalOpen(true);
    setLoadingQuestions(true);
    setShowQuestionForm(false);
    setEditingQuestion(null);
    try {
      const qs = await api.getExamQuestions(exam.id);
      setExamQuestions(qs || []);
    } catch (err) {
      triggerToast("Failed to load questions: " + err.message, "Exam Manager");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      marks: 2,
      difficulty: 'Medium',
      section_id: 'sec-core',
      section_name: 'Core Technical Concepts'
    });
    setShowQuestionForm(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setQuestionForm({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      marks: q.marks,
      difficulty: q.difficulty,
      section_id: q.section_id,
      section_name: q.section_name
    });
    setShowQuestionForm(true);
  };

  const requestDeleteQuestion = (qId, index) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Question',
      itemName: index !== undefined ? `Question ${index + 1}` : 'Selected Question',
      message: 'Are you sure you want to remove this question from the exam blueprint?',
      loading: false,
      onConfirm: () => executeDeleteQuestion(qId)
    });
  };

  const executeDeleteQuestion = async (qId) => {
    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await api.deleteQuestion(qId);
      setExamQuestions(prev => prev.filter(q => q.id !== qId));
      
      // Update local exam counts
      setExams(prev => prev.map(e => {
        if (e.id === selectedExamForQuestions.id) {
          const newCount = e.total_questions - 1;
          const matchedQ = examQuestions.find(q => q.id === qId);
          const newMarks = e.total_marks - (matchedQ ? matchedQ.marks : 0);
          return { ...e, total_questions: newCount, total_marks: newMarks };
        }
        return e;
      }));
      triggerToast("Question deleted successfully.", "Exam Manager");
    } catch (err) {
      triggerToast("Failed to delete question: " + err.message, "Exam Manager");
    } finally {
      setDeleteModalState({ isOpen: false, title: '', itemName: '', message: '', onConfirm: null, loading: false });
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        const updated = await api.updateQuestion(editingQuestion.id, questionForm);
        setExamQuestions(prev => prev.map(q => q.id === editingQuestion.id ? updated : q));
        
        // Update local exam counts
        setExams(prev => prev.map(ex => {
          if (ex.id === selectedExamForQuestions.id) {
            const oldMarks = editingQuestion.marks;
            const newMarks = ex.total_marks - oldMarks + parseInt(questionForm.marks, 10);
            return { ...ex, total_marks: newMarks };
          }
          return ex;
        }));
      } else {
        const created = await api.createQuestion(selectedExamForQuestions.id, questionForm);
        setExamQuestions(prev => [...prev, created]);
        
        // Update local exam counts
        setExams(prev => prev.map(ex => {
          if (ex.id === selectedExamForQuestions.id) {
            return {
              ...ex,
              total_questions: ex.total_questions + 1,
              total_marks: ex.total_marks + parseInt(questionForm.marks, 10)
            };
          }
          return ex;
        }));
      }
      setShowQuestionForm(false);
      triggerToast(editingQuestion ? "Question updated." : "Question added successfully.", "Exam Manager");
    } catch (err) {
      triggerToast("Failed to save question: " + err.message, "Exam Manager");
    }
  };

  // Invitation actions
  const handleOpenInvite = (exam = null) => {
    if (exams.length === 0) {
      triggerToast("Please create at least one exam blueprint first.", "Inviter");
      return;
    }
    setInviteForm({
      exam_id: exam ? exam.id : exams[0].id,
      name: '',
      email: '',
      expires_at: ''
    });
    setIsInviteModalOpen(true);
  };

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    try {
      const result = await api.createInvitation(inviteForm);
      setInvitations(prev => [result, ...prev]);
      setGeneratedInvite(result); // show generated link in modal
      triggerToast(`Invitation generated for ${inviteForm.name}!`, "Inviter");
    } catch (err) {
      triggerToast("Failed to generate invite: " + err.message, "Inviter");
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setGeneratedInvite(null);
    setShareTab('public');
  };

  const requestRevokeInvite = (invite) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Revoke Candidate Invitation',
      itemName: invite.name || invite.email,
      message: `Are you sure you want to revoke the assessment invitation for "${invite.name || invite.email}"? The invitation token will become invalid immediately.`,
      loading: false,
      onConfirm: () => executeRevokeInvite(invite.id)
    });
  };

  const executeRevokeInvite = async (id) => {
    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await api.deleteInvitation(id);
      setInvitations(prev => prev.filter(i => i.id !== id));
      triggerToast("Invitation link revoked successfully.", "Inviter");
    } catch (err) {
      triggerToast("Failed to revoke invitation: " + err.message, "Inviter");
    } finally {
      setDeleteModalState({ isOpen: false, title: '', itemName: '', message: '', onConfirm: null, loading: false });
    }
  };

  const copyInviteLink = (token, examId) => {
    const link = `${window.location.origin}/test/${examId}?inviteToken=${token}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
      triggerToast("Invitation link copied to clipboard!", "Inviter");
    }).catch(err => {
      triggerToast("Failed to copy link.", "Inviter");
    });
  };

  // Report actions
  const handleExportCSV = () => {
    if (reports.length === 0) {
      triggerToast("No reports data available to export.", "Reports Console");
      return;
    }
    const headers = ["Candidate Name", "Candidate Email", "Exam Title", "Role", "Score", "Total Marks", "Time Taken (Mins)", "Violations", "Proctor Status", "Submitted At"];
    const rows = reports.map(r => [
      r.candidate_name || "N/A",
      r.candidate_email || "N/A",
      r.test_name || "N/A",
      r.role || "N/A",
      r.score !== null ? r.score : "N/A",
      r.total_marks || "N/A",
      r.time_taken !== null ? Math.round(r.time_taken / 60) : "N/A",
      r.violations_count !== null ? r.violations_count : 0,
      r.proctoring_status || "Clean",
      r.submitted_at || "N/A"
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Klanvision_Exam_Results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const requestDeleteReport = (reportId, candidateName) => {
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Assessment Report',
      itemName: candidateName || 'Candidate Record',
      message: `Are you sure you want to delete the assessment report for "${candidateName || 'Candidate'}"? All score metrics, exit violations, and proctoring logs will be permanently removed. This action cannot be undone.`,
      loading: false,
      onConfirm: () => executeDeleteReport(reportId)
    });
  };

  const executeDeleteReport = async (reportId) => {
    setDeleteModalState(prev => ({ ...prev, loading: true }));
    try {
      await api.deleteExamReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
      triggerToast("Assessment report deleted successfully.", "Reports Console");
    } catch (err) {
      triggerToast("Failed to delete report: " + err.message, "Reports Console");
    } finally {
      setDeleteModalState({ isOpen: false, title: '', itemName: '', message: '', onConfirm: null, loading: false });
    }
  };

  // Certification actions
  const handleOpenCertificateGen = (attempt) => {
    setSelectedAttemptForCert(attempt);
    setCertForm({
      technicalLead: 'Kiran Kumar Moopuri',
      internshipManager: 'Alex Rivera',
      certificateType: 'Exam Competency Certification'
    });
    setIsCertModalOpen(true);
  };

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    try {
      const result = await api.generateExamCertificate(selectedAttemptForCert.id, certForm);
      setReports(prev => prev.map(r => r.id === selectedAttemptForCert.id ? { ...r, certificate_number: result.certificateNumber, certificate_status: 'Completed' } : r));
      setIsCertModalOpen(false);
      triggerToast(`Certificate Generated: ${result.certificateNumber}!`, "Certificates");
    } catch (err) {
      triggerToast("Failed to generate certificate: " + err.message, "Certificates");
    }
  };

  const handleDownloadCertDoc = (certNum) => {
    // API base URL verification download path
    const url = `${api.verifyCertificate(certNum)}?download=true`;
    window.open(url, '_blank');
  };

  // Filters
  const filteredExams = exams.filter(e => {
    const matchesSearch = e.test_name.toLowerCase().includes(searchQuery.toLowerCase()) || e.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || (roleFilter === 'Job' && jobs.includes(e.role)) || (roleFilter === 'Internship' && internshipRoles.includes(e.role));
    return matchesSearch && matchesRole;
  });

  const filteredReports = reports.filter(r => {
    const query = reportsSearchQuery.toLowerCase();
    return (
      (r.candidate_name || '').toLowerCase().includes(query) || 
      (r.candidate_email || '').toLowerCase().includes(query) ||
      (r.test_name || '').toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Page Header */}
      <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h2 className="admin-section-title">Assessment Console</h2>
          <p className="admin-section-subtitle">Design technical assessments, invite candidates, monitor AI proctoring, and issue competency certificates.</p>
        </div>
        
        {activeSubTab === 'blueprints' && (
          <button
            onClick={handleOpenAdd}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
              color: 'white', fontWeight: 800, padding: '14px 28px', borderRadius: 16,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
              boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            <Plus size={18} /> Add Role Exam
          </button>
        )}

        {activeSubTab === 'invitations' && (
          <button
            onClick={handleOpenInvite}
            className="clay-btn clay-btn-emerald"
            style={{ padding: '14px 28px', fontSize: 14 }}
          >
            <Send size={18} /> Invite Candidate
          </button>
        )}

        {activeSubTab === 'reports' && (
          <button
            onClick={handleExportCSV}
            className="clay-btn"
            style={{ padding: '14px 28px', fontSize: 14 }}
          >
            <FileSpreadsheet size={18} /> Export Results (CSV)
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div 
        className="clay-card admin-subtabs-container"
        style={{
          display: 'flex',
          gap: 12,
          padding: 10,
          borderRadius: 24,
          marginBottom: 36,
          width: 'fit-content'
        }}
      >
        {[
          { id: 'blueprints', label: 'Exam Blueprints', icon: GraduationCap },
          { id: 'invitations', label: 'Invitations Manager', icon: Send },
          { id: 'reports', label: 'Assessment Reports', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={isActive ? 'clay-btn clay-btn-purple' : 'clay-card-interactive'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 18,
                border: 'none',
                background: isActive ? undefined : 'rgba(255,255,255,0.03)',
                color: isActive ? '#ffffff' : '#94A3B8',
                fontSize: 14,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Blueprint Sub-Tab */}
      {activeSubTab === 'blueprints' && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ marginBottom: 40 }}>
            <BoardCard title="Total Blueprints" value={exams.length} desc="Pre-configured assessments" color="#8B5CF6" />
            <BoardCard title="Active Exams" value={exams.filter(e => e.status === 'Active').length} desc="Exams ready to conduct" color="#10B981" />
            <BoardCard title="Scheduled Windows" value={exams.filter(e => e.scheduled_start || e.scheduled_end).length} desc="Assessments with active time windows" color="#F59E0B" />
            <BoardCard title="Configured MCQs" value={exams.reduce((sum, e) => sum + (e.total_questions || 0), 0)} desc="Active technical questions" color="#3B82F6" />
          </div>

          {/* Filters and search */}
          <div 
            className="clay-card admin-filter-bar"
            style={{
              padding: '24px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              marginBottom: 24
            }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              {['All', 'Job', 'Internship'].map((type) => (
                <button
                  key={type}
                  onClick={() => setRoleFilter(type)}
                  style={{
                    padding: '10px 20px', borderRadius: 12, border: 'none',
                    background: roleFilter === type ? '#8B5CF6' : 'rgba(255,255,255,0.05)',
                    color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {type === 'All' ? 'All Roles' : type === 'Job' ? 'Full-Time Jobs' : 'Internships'}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search blueprints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px 12px 48px', borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.5)',
                  color: 'white', fontSize: 13, outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Grid list */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 40,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
          }}>
            {loadingExams ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>Loading assessment blueprints...</div>
            ) : filteredExams.length === 0 ? (
              <NoResults query={searchQuery} />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                      <th className="admin-table-th">Exam Details</th>
                      <th className="admin-table-th">Scope</th>
                      <th className="admin-table-th">Scheduling Window</th>
                      <th className="admin-table-th">Duration &amp; Penalty</th>
                      <th className="admin-table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExams.map((exam) => (
                      <tr key={exam.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                              width: 44, height: 44, borderRadius: 12,
                              background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <GraduationCap size={20} />
                            </div>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{exam.test_name}</div>
                              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 800, background: exam.type === 'Internship' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: exam.type === 'Internship' ? '#10B981' : '#3B82F6', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
                                  {exam.type}
                                </span>
                                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{exam.role}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{exam.total_questions} MCQs</div>
                          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Total Marks: {exam.total_marks}</div>
                        </td>

                        <td style={{ padding: '24px 32px' }}>
                          {exam.scheduled_start || exam.scheduled_end ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {exam.scheduled_start && (
                                <div style={{ fontSize: 12, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Calendar size={12} /> Starts: {new Date(exam.scheduled_start).toLocaleString()}
                                </div>
                              )}
                              {exam.scheduled_end && (
                                <div style={{ fontSize: 12, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Calendar size={12} /> Ends: {new Date(exam.scheduled_end).toLocaleString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: '#64748B' }}>Open Assessment</span>
                          )}
                        </td>

                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>
                            <Clock size={14} />
                            {exam.timer} mins
                          </div>
                          <div style={{ fontSize: 11, color: exam.negative_marking ? '#EF4444' : '#64748B', marginTop: 2, fontWeight: 700 }}>
                            {exam.negative_marking ? `Penalty: -${exam.negative_marks}` : 'No Penalty'}
                          </div>
                        </td>

                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <a
                              href={`/test/${exam.id}?guest=true&name=Admin%20Tester`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Preview exam as Admin Tester"
                              style={{
                                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: '#10B981', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800,
                                textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                              }}
                            >
                              <Rocket size={14} /> Test
                            </a>
                            <button
                              onClick={() => handleOpenInvite(exam)}
                              type="button"
                              title="Share / Invite Candidate"
                              style={{
                                background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)',
                                color: '#818CF8', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                              }}
                            >
                              <Send size={13} /> Share
                            </button>
                            <button
                              onClick={() => handleManageQuestions(exam)}
                              type="button" title="Manage Questions"
                              style={{ background: 'rgba(139, 92, 246, 0.1)', border: 'none', color: '#A78BFA', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                            >
                              <FileText size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(exam)}
                              type="button"
                              title="Edit Exam"
                              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => requestDeleteExam(exam)}
                              type="button"
                              title="Delete Exam"
                              style={{ background: 'rgba(239, 68, 68, 0.05)', border: 'none', color: '#F87171', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Invitations Sub-Tab */}
      {activeSubTab === 'invitations' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 40,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          {loadingInvites ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>Loading candidate invitations...</div>
          ) : invitations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', color: '#64748B' }}>
              <Send size={48} style={{ margin: '0 auto 16px', color: '#10B981', opacity: 0.5 }} />
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#94A3B8', marginBottom: 6 }}>No candidate invites</h3>
              <p style={{ fontSize: 13, marginBottom: 20 }}>Invite candidates to take an assessment and generate unique entry links.</p>
              <button
                onClick={handleOpenInvite}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #34D399)',
                  color: 'white', fontWeight: 800, padding: '10px 20px', borderRadius: 12,
                  border: 'none', cursor: 'pointer'
                }}
              >
                Send First Invitation
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <th className="admin-table-th">Candidate Details</th>
                    <th className="admin-table-th">Exam / Role</th>
                    <th className="admin-table-th">Invite Link</th>
                    <th className="admin-table-th">Expiry &amp; Status</th>
                    <th className="admin-table-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invite) => (
                    <tr key={invite.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{invite.name}</div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{invite.email}</div>
                      </td>

                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{invite.test_name}</div>
                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{invite.role}</div>
                      </td>

                      <td style={{ padding: '24px 32px' }}>
                        <button
                          onClick={() => copyInviteLink(invite.token, invite.exam_id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                            padding: '8px 14px', borderRadius: 10, color: '#A78BFA', fontSize: 12,
                            cursor: 'pointer', fontWeight: 700
                          }}
                        >
                          {copiedToken === invite.token ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                          Copy Link
                        </button>
                      </td>

                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, width: 'fit-content',
                            padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase',
                            background: invite.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: invite.status === 'Pending' ? '#F59E0B' : '#10B981'
                          }}>
                            {invite.status}
                          </span>
                          <span style={{ fontSize: 11, color: '#64748B' }}>
                            {invite.expires_at ? `Exp: ${new Date(invite.expires_at).toLocaleDateString()}` : 'No Expiry'}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '24px 32px' }}>
                        <button
                          onClick={() => requestRevokeInvite(invite)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#F87171',
                            padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 800
                          }}
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reports Sub-Tab */}
      {activeSubTab === 'reports' && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ marginBottom: 40 }}>
            <BoardCard title="Assessments Conducted" value={reports.length} desc="Total test attempts recorded" color="#8B5CF6" />
            <BoardCard title="Passing Submissions" value={reports.filter(r => r.score >= (r.total_marks * 0.5)).length} desc="Scored 50% or higher" color="#10B981" />
            <BoardCard title="AI Proctor Flags" value={reports.filter(r => r.proctoring_status === 'Suspicious').length} desc="Clean attempts with minor exit warnings" color="#F59E0B" />
            <BoardCard title="Proctor Disqualifications" value={reports.filter(r => r.proctoring_status === 'Disqualified').length} desc="Auto-submitted due to 3 exit warnings" color="#EF4444" />
          </div>

          {/* Search bar */}
          <div 
            className="clay-card admin-filter-bar"
            style={{
              padding: '22px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              marginBottom: 28
            }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
              <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                className="clay-input-field"
                placeholder="Search candidate name or exam..."
                value={reportsSearchQuery}
                onChange={(e) => setReportsSearchQuery(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 48, borderRadius: 16
                }}
              />
            </div>
          </div>

          {/* Table List */}
          <div 
            className="clay-card"
            style={{
              borderRadius: 32,
              overflow: 'hidden'
            }}
          >
            {loadingReports ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>Loading results & reports...</div>
            ) : filteredReports.length === 0 ? (
              <NoResults query={reportsSearchQuery} />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                      <th className="admin-table-th">Candidate</th>
                      <th className="admin-table-th">Exam Title</th>
                      <th className="admin-table-th">Score &amp; Time</th>
                      <th className="admin-table-th">AI Proctor Status</th>
                      <th className="admin-table-th">Credentialing</th>
                      <th className="admin-table-th" style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => {
                      const percentage = report.score !== null ? (report.score / report.total_marks) * 100 : 0;
                      return (
                        <tr key={report.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '24px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              {report.photo ? (
                                <div style={{ position: 'relative' }}>
                                  <img 
                                    src={report.photo} 
                                    alt="Webcam Snapshot" 
                                    style={{ 
                                      width: 44, 
                                      height: 44, 
                                      borderRadius: 12, 
                                      objectFit: 'cover', 
                                      border: '2px solid rgba(99,102,241,0.4)',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                      cursor: 'pointer'
                                    }} 
                                    onClick={() => {
                                      const w = window.open();
                                      w.document.write(`<img src="${report.photo}" style="max-width:100%; height:auto;" />`);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div style={{ 
                                  width: 44, 
                                  height: 44, 
                                  borderRadius: 12, 
                                  background: 'rgba(255,255,255,0.03)', 
                                  border: '1px dashed rgba(255,255,255,0.1)',
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  color: '#64748B' 
                                }}>
                                  <User size={18} />
                                </div>
                              )}
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{report.candidate_name || 'Mock Student'}</div>
                                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{report.candidate_email || 'student@temp.exam'}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '24px 32px' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{report.test_name}</div>
                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Role: {report.role}</div>
                          </td>

                          <td style={{ padding: '24px 32px' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: percentage >= 50 ? '#10B981' : '#F59E0B' }}>
                              {report.score !== null ? `${report.score} / ${report.total_marks}` : 'In Progress'}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={11} /> {report.time_taken !== null ? `${Math.round(report.time_taken / 60)} mins` : 'N/A'}
                            </div>
                          </td>

                          <td style={{ padding: '24px 32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span style={{
                                fontSize: 10, fontWeight: 800, width: 'fit-content',
                                padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase',
                                background: report.proctoring_status === 'Clean' ? 'rgba(16, 185, 129, 0.15)' : report.proctoring_status === 'Suspicious' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: report.proctoring_status === 'Clean' ? '#10B981' : report.proctoring_status === 'Suspicious' ? '#F59E0B' : '#EF4444'
                              }}>
                                {report.proctoring_status || 'Clean'}
                              </span>
                              <span style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <AlertTriangle size={11} /> Exit Warnings: {report.violations_count || 0}
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '24px 32px' }}>
                            {report.status !== 'submitted' ? (
                              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 800 }}>TEST IN PROGRESS</span>
                            ) : report.certificate_number ? (
                              report.certificate_status === 'Credentialing' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ 
                                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                                    background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA',
                                    textTransform: 'uppercase'
                                  }}>
                                    Credentialing
                                  </span>
                                  <button
                                    onClick={() => handleOpenCertificateGen(report)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 4,
                                      background: 'rgba(255,255,255,0.05)', border: 'none',
                                      color: '#94A3B8', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                                      cursor: 'pointer'
                                    }}
                                    title="Complete & Issue Certificate"
                                  >
                                    <Award size={12} /> Issue
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <a
                                    href={`/verify/${report.certificate_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none',
                                      background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                                      color: '#10B981', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800
                                    }}
                                  >
                                    <ShieldCheck size={12} /> Verify
                                  </a>
                                  <button
                                    onClick={() => handleDownloadCertDoc(report.certificate_number)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 4,
                                      background: 'rgba(255,255,255,0.05)', border: 'none',
                                      color: '#94A3B8', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Download size={12} /> PDF
                                  </button>
                                </div>
                              )
                            ) : (
                              <button
                                onClick={() => handleOpenCertificateGen(report)}
                                disabled={report.score === null || report.proctoring_status === 'Disqualified'}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                                  color: 'white', border: 'none', padding: '8px 14px', borderRadius: 10,
                                  fontSize: 12, fontWeight: 800, cursor: 'pointer',
                                  opacity: (report.score === null || report.proctoring_status === 'Disqualified') ? 0.4 : 1
                                }}
                              >
                                <Award size={14} /> Issue Certificate
                              </button>
                            )}
                          </td>

                          <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                            <button
                              onClick={() => requestDeleteReport(report.id, report.candidate_name)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 10,
                                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s ease'
                              }}
                              title="Delete Assessment Report"
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add/Edit Blueprint Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 500, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxHeight: '95vh', display: 'flex', flexDirection: 'column' }}
            >
              <form onSubmit={handleSave} style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>{editingExam ? 'Configure Blueprint' : 'New Blueprint'}</h3>
                  <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Configure exam parameters, date ranges, and scoring policies.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Test Name</label>
                  <input
                    type="text" required value={examForm.test_name}
                    onChange={(e) => setExamForm(prev => ({ ...prev, test_name: e.target.value }))}
                    placeholder="e.g. Frontend developer Assessment"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Target Role</label>
                  <select
                    value={examForm.role}
                    onChange={(e) => setExamForm(prev => ({ ...prev, role: e.target.value }))}
                    style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                  >
                    {allRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Timer (Mins)</label>
                    <input
                      type="number" required min="1" value={examForm.timer}
                      onChange={(e) => setExamForm(prev => ({ ...prev, timer: parseInt(e.target.value) }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Negative Penalty</label>
                    <input
                      type="number" required step="0.05" min="0" disabled={!examForm.negative_marking} value={examForm.negative_marks}
                      onChange={(e) => setExamForm(prev => ({ ...prev, negative_marks: parseFloat(e.target.value) }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none', opacity: examForm.negative_marking ? 1 : 0.5 }}
                    />
                  </div>
                </div>

                {/* Scheduling Windows */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Active From</label>
                    <input
                      type="datetime-local" value={examForm.scheduled_start}
                      onChange={(e) => setExamForm(prev => ({ ...prev, scheduled_start: e.target.value }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, fontSize: 12, color: 'white', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Active Until</label>
                    <input
                      type="datetime-local" value={examForm.scheduled_end}
                      onChange={(e) => setExamForm(prev => ({ ...prev, scheduled_end: e.target.value }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, fontSize: 12, color: 'white', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>
                    <input
                      type="checkbox" checked={examForm.shuffle}
                      onChange={(e) => setExamForm(prev => ({ ...prev, shuffle: e.target.checked }))}
                      style={{ accentColor: '#8B5CF6', width: 16, height: 16 }}
                    />
                    Shuffle Questions
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>
                    <input
                      type="checkbox" checked={examForm.negative_marking}
                      onChange={(e) => setExamForm(prev => ({ ...prev, negative_marking: e.target.checked, negative_marks: e.target.checked ? 0.25 : 0 }))}
                      style={{ accentColor: '#8B5CF6', width: 16, height: 16 }}
                    />
                    Negative Marking
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                  <button
                    type="button" onClick={() => setIsModalOpen(false)}
                    style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Questions Modal */}
      <AnimatePresence>
        {isQuestionsModalOpen && selectedExamForQuestions && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQuestionsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 700, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '30px 40px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>Questions for {selectedExamForQuestions.test_name}</h3>
                  <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Add or modify the technical MCQs for this assessment.</p>
                </div>
                <button
                  onClick={handleOpenAddQuestion}
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #34D399)',
                    color: 'white', fontWeight: 800, padding: '10px 18px', borderRadius: 12,
                    border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Plus size={14} /> Add MCQ
                </button>
              </div>

              {showQuestionForm ? (
                <form onSubmit={handleSaveQuestion} style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', flex: 1 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#F59E0B' }}>{editingQuestion ? 'Edit Question Details' : 'New MCQ Question'}</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Question Text</label>
                    <textarea
                      required rows="3" value={questionForm.question_text}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                      placeholder="Enter the question statement..."
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 13, color: 'white', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option A</label>
                      <input
                        type="text" required value={questionForm.option_a}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_a: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option B</label>
                      <input
                        type="text" required value={questionForm.option_b}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_b: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option C</label>
                      <input
                        type="text" required value={questionForm.option_c}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_c: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option D</label>
                      <input
                        type="text" required value={questionForm.option_d}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_d: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Correct Answer</label>
                      <select
                        value={questionForm.correct_answer}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_answer: e.target.value }))}
                        style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Marks</label>
                      <input
                        type="number" required min="1" value={questionForm.marks}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Difficulty</label>
                      <select
                        value={questionForm.difficulty}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value }))}
                        style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Section ID</label>
                      <input
                        type="text" required value={questionForm.section_id}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, section_id: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Section Name</label>
                      <input
                        type="text" required value={questionForm.section_name}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, section_name: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                    <button
                      type="button" onClick={() => setShowQuestionForm(false)}
                      style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                    >
                      Back to List
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                    >
                      {editingQuestion ? 'Update Question' : 'Add Question'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: 40, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {loadingQuestions ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>Loading questions...</div>
                  ) : examQuestions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>No questions configured for this exam. Click "Add MCQ" to configure one.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {examQuestions.map((q, qidx) => (
                        <div key={q.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 24, position: 'relative' }}>
                          <div style={{ position: 'absolute', right: 24, top: 24, display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleOpenEditQuestion(q)}
                              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => requestDeleteQuestion(q.id, qidx)}
                              style={{ background: 'rgba(239, 68, 68, 0.05)', border: 'none', color: '#F87171', padding: 8, borderRadius: 8, cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: 6 }}>Q{qidx + 1}</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 6 }}>{q.difficulty}</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: 6 }}>{q.marks} Marks</span>
                            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Section: {q.section_name}</span>
                          </div>

                          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16, paddingRight: 80, lineHeight: 1.5 }}>
                            {q.question_text}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {['a', 'b', 'c', 'd'].map(opt => {
                              const isCorrect = q.correct_answer === opt.toUpperCase();
                              return (
                                <div
                                  key={opt}
                                  style={{
                                    fontSize: 12, padding: '10px 14px', borderRadius: 10,
                                    background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                                    border: isCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.03)',
                                    color: isCorrect ? '#10B981' : '#94A3B8'
                                  }}
                                >
                                  <span style={{ fontWeight: 800 }}>{opt.toUpperCase()}:</span> {q[`option_${opt}`]}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ padding: '20px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsQuestionsModalOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 800 }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Candidate Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseInviteModal} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 480, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: 40, paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Send size={16} color="#818CF8" />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0 }}>Share Assessment</h3>
                  </div>
                  <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
                    {inviteForm.exam_id && exams.find(e => e.id === inviteForm.exam_id)
                      ? <>Share options for <b style={{ color: '#C7D2FE' }}>{exams.find(e => e.id === inviteForm.exam_id)?.test_name}</b></>
                      : 'Choose how you want to share this assessment.'}
                  </p>
                </div>

                {/* Tab selectors */}
                <div style={{ display: 'flex', gap: 10, padding: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 14 }}>
                  <button
                    type="button"
                    onClick={() => { setShareTab('public'); setGeneratedInvite(null); }}
                    style={{ flex: 1, padding: '10px 0', border: 'none', background: shareTab === 'public' ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: shareTab === 'public' ? '#818CF8' : '#94A3B8', fontWeight: 800, fontSize: 12, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Public Link & Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareTab('individual')}
                    style={{ flex: 1, padding: '10px 0', border: 'none', background: shareTab === 'individual' ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: shareTab === 'individual' ? '#818CF8' : '#94A3B8', fontWeight: 800, fontSize: 12, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Send Email Invitation
                  </button>
                </div>
              </div>

              {shareTab === 'public' ? (
                <div style={{ padding: '0 40px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Select Exam Blueprint</label>
                    <select
                      value={inviteForm.exam_id}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, exam_id: e.target.value }))}
                      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                    >
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.test_name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                      🚀 Candidates using this link will self-register their details (Full Name, Email, Mobile) right before starting. Perfect for sharing on Slack, Teams, or social channels.
                    </p>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Assessment Code</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          readOnly
                          value={inviteForm.exam_id}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#CBD5E1', outline: 'none', fontFamily: 'monospace', fontWeight: 'bold' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(inviteForm.exam_id);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                            triggerToast("Assessment Code copied to clipboard!", "Exam Manager");
                          }}
                          style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: copiedCode ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)', color: copiedCode ? '#34D399' : '#CBD5E1', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                        >
                          {copiedCode ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Public Assessment Link</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          readOnly
                          value={`${window.location.origin}/test/${inviteForm.exam_id}?guest=true`}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#CBD5E1', outline: 'none', fontFamily: 'monospace' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const link = `${window.location.origin}/test/${inviteForm.exam_id}?guest=true`;
                            navigator.clipboard.writeText(link);
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                            triggerToast("Public Assessment Link copied!", "Exam Manager");
                          }}
                          style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: copiedLink ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)', color: copiedLink ? '#34D399' : '#CBD5E1', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                        >
                          {copiedLink ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy Link</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <button
                      type="button" onClick={handleCloseInviteModal}
                      style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateInvite} style={{ padding: '0 40px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Generated link display — shown after successful creation */}
                  {generatedInvite ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 20 }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>✓ Invitation Generated!</p>
                        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>Candidate: <b style={{ color: 'white' }}>{generatedInvite.name}</b> ({generatedInvite.email})</p>
                        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 12 }}>Token: <code style={{ color: '#818CF8', fontSize: 11 }}>{generatedInvite.token}</code></p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            readOnly
                            value={`${window.location.origin}/test/${generatedInvite.exam_id}?inviteToken=${generatedInvite.token}`}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#CBD5E1', outline: 'none', fontFamily: 'monospace' }}
                          />
                          <button
                            type="button"
                            onClick={() => copyInviteLink(generatedInvite.token, generatedInvite.exam_id)}
                            style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: copiedToken === generatedInvite.token ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', color: copiedToken === generatedInvite.token ? '#34D399' : '#818CF8', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                          >
                            {copiedToken === generatedInvite.token ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                          </button>
                        </div>
                      </div>
                      <button
                        type="button" onClick={handleCloseInviteModal}
                        style={{ padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Select Exam Blueprint</label>
                        <select
                          value={inviteForm.exam_id}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, exam_id: e.target.value }))}
                          style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                        >
                          {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.test_name}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Candidate Name</label>
                        <input
                          type="text" required value={inviteForm.name}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name..."
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Candidate Email</label>
                        <input
                          type="email" required value={inviteForm.email}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address..."
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Expiration Date <span style={{ color: '#64748B', fontWeight: 600 }}>(Optional)</span></label>
                        <input
                          type="date" value={inviteForm.expires_at}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, expires_at: e.target.value }))}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                        <button
                          type="button" onClick={handleCloseInviteModal}
                          style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366F1, #818CF8)', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          <Send size={14} /> Generate & Share Link
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Issue Certificate Modal */}
      <AnimatePresence>
        {isCertModalOpen && selectedAttemptForCert && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCertModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: 450, background: '#1E293B', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
            >
              <form onSubmit={handleGenerateCertificate} style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>Issue Competency Certificate</h3>
                  <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>This registers a secure, verifiable exam completion certificate for <b>{selectedAttemptForCert.candidate_name}</b>.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Technical Lead / Proctor</label>
                  <input
                    type="text" required value={certForm.technicalLead}
                    onChange={(e) => setCertForm(prev => ({ ...prev, technicalLead: e.target.value }))}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Internship / HR Manager</label>
                  <input
                    type="text" required value={certForm.internshipManager}
                    onChange={(e) => setCertForm(prev => ({ ...prev, internshipManager: e.target.value }))}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Certificate Type</label>
                  <input
                    type="text" required value={certForm.certificateType}
                    onChange={(e) => setCertForm(prev => ({ ...prev, certificateType: e.target.value }))}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                  <button
                    type="button" onClick={() => setIsCertModalOpen(false)}
                    style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)' }}
                  >
                    Generate PDF
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Professional Claymorphic Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, title: '', itemName: '', message: '', onConfirm: null, loading: false })}
        onConfirm={deleteModalState.onConfirm}
        title={deleteModalState.title}
        itemName={deleteModalState.itemName}
        message={deleteModalState.message}
        loading={deleteModalState.loading}
      />

    </div>
  );
}
