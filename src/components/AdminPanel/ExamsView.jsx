import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, GraduationCap, Clock, FileText, Edit2, Trash2, Rocket, X } from 'lucide-react';
import { api } from '../../utils/api';
import { BoardCard, NoResults } from './SharedComponents';

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
    negative_marks: 0.25
  });

  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // State for question form
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

  const handleDeleteQuestion = async (qId) => {
    if (!confirm("Are you sure you want to remove this question?")) return;
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

  const allRoles = [...jobs, ...internshipRoles];

  useEffect(() => {
    api.getExams()
      .then(data => {
        if (data) setExams(data);
      })
      .catch(err => console.error("Error loading exams:", err))
      .finally(() => setLoadingExams(false));
  }, []);

  const handleOpenAdd = () => {
    setEditingExam(null);
    setExamForm({
      test_name: '',
      role: allRoles[0],
      timer: 30,
      shuffle: true,
      negative_marking: true,
      negative_marks: 0.25
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
      negative_marks: exam.negative_marks
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      await api.deleteExam(id);
      setExams(prev => prev.filter(e => e.id !== id));
      triggerToast("Exam assessing blueprint terminated.", "Exam Manager");
    } catch (err) {
      triggerToast("Failed to delete exam: " + err.message, "Exam Manager");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        const updated = await api.updateExam(editingExam.id, examForm);
        setExams(prev => prev.map(e => e.id === editingExam.id ? updated : e));
      } else {
        const slug = slugify(examForm.role);
        if (exams.some(e => e.id === slug)) {
          triggerToast("An exam for this role already exists! Please edit the existing one.", "Exam Manager");
          return;
        }
        const created = await api.createExam(examForm);
        setExams(prev => [...prev, created]);
      }
      setIsModalOpen(false);
      triggerToast(editingExam ? "Exam settings updated." : "New exam blueprint initiated.", "Exam Manager");
    } catch (err) {
      triggerToast("Failed to save exam: " + err.message, "Exam Manager");
    }
  };

  const filtered = exams.filter(e => {
    const matchesSearch = e.test_name.toLowerCase().includes(searchQuery.toLowerCase()) || e.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || (roleFilter === 'Job' && jobs.includes(e.role)) || (roleFilter === 'Internship' && internshipRoles.includes(e.role));
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px' }}>Examination Console</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>Manage and launch job/internship online assessments role-wise.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
            color: 'white',
            fontWeight: 800,
            padding: '14px 28px',
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
          }}
        >
          <Plus size={18} /> Add Role Exam
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ marginBottom: 40 }}>
        <BoardCard title="Total Exams" value={exams.length} desc="Pre-configured role assessments" color="#8B5CF6" />
        <BoardCard title="Active Exams" value={exams.filter(e => e.status === 'Active').length} desc="Exams ready to be taken" color="#10B981" />
        <BoardCard title="Negative Scoring" value={exams.filter(e => e.negative_marking).length} desc="Exams with penalty points active" color="#EF4444" />
        <BoardCard title="Attempts Logged" value="12" desc="Completed assessment runs" color="#3B82F6" />
      </div>

      {/* Search and filter bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 32,
        padding: '24px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {['All', 'Job', 'Internship'].map((type) => (
            <button
              key={type}
              onClick={() => setRoleFilter(type)}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                background: roleFilter === type ? '#8B5CF6' : 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
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
            placeholder="Search exam or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(15, 23, 42, 0.5)',
              color: 'white',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Directory list */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 40,
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
      }}>
        {filtered.length === 0 ? (
          <NoResults query={searchQuery} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '24px 32px', fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Exam Details</th>
                  <th style={{ padding: '24px 32px', fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Scope</th>
                  <th style={{ padding: '24px 32px', fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Duration</th>
                  <th style={{ padding: '24px 32px', fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Scoring</th>
                  <th style={{ padding: '24px 32px', fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam) => (
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
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Shuffle: {exam.shuffle ? 'ON' : 'OFF'}</div>
                    </td>

                    <td style={{ padding: '24px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>
                        <Clock size={14} />
                        {exam.timer} mins
                      </div>
                    </td>

                    <td style={{ padding: '24px 32px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981' }}>{exam.total_marks} Marks</div>
                      <div style={{ fontSize: 11, color: exam.negative_marking ? '#EF4444' : '#64748B', marginTop: 2, fontWeight: 700 }}>
                        {exam.negative_marking ? `Penalty: -${exam.negative_marks}` : 'No Penalty'}
                      </div>
                    </td>

                    <td style={{ padding: '24px 32px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <a
                          href={`/test/${exam.id}?guest=true&name=Admin%20Tester`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            color: '#10B981',
                            padding: '8px 16px',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 800,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <Rocket size={14} /> Conduct Test
                        </a>
                        <button
                          onClick={() => handleManageQuestions(exam)}
                          type="button"
                          title="Manage Questions"
                          style={{ background: 'rgba(139, 92, 246, 0.1)', border: 'none', color: '#A78BFA', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(exam)}
                          type="button"
                          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          type="button"
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

      {/* Add/Edit Modal */}
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
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white' }}>{editingExam ? 'Configure Assessment' : 'New Assessment'}</h3>
                  <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Configure exam parameters and rules for a role.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Test Name</label>
                  <input
                    type="text"
                    required
                    value={examForm.test_name}
                    onChange={(e) => setExamForm(prev => ({ ...prev, test_name: e.target.value }))}
                    placeholder="e.g. React.js Assessment"
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
                      type="number"
                      required
                      min="1"
                      value={examForm.timer}
                      onChange={(e) => setExamForm(prev => ({ ...prev, timer: parseInt(e.target.value) }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Negative Penalty</label>
                    <input
                      type="number"
                      required
                      step="0.05"
                      min="0"
                      disabled={!examForm.negative_marking}
                      value={examForm.negative_marks}
                      onChange={(e) => setExamForm(prev => ({ ...prev, negative_marks: parseFloat(e.target.value) }))}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 14, color: 'white', outline: 'none', opacity: examForm.negative_marking ? 1 : 0.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 24, marginTop: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>
                    <input
                      type="checkbox"
                      checked={examForm.shuffle}
                      onChange={(e) => setExamForm(prev => ({ ...prev, shuffle: e.target.checked }))}
                      style={{ accentColor: '#8B5CF6', width: 16, height: 16 }}
                    />
                    Shuffle Questions
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>
                    <input
                      type="checkbox"
                      checked={examForm.negative_marking}
                      onChange={(e) => setExamForm(prev => ({ ...prev, negative_marking: e.target.checked, negative_marks: e.target.checked ? 0.25 : 0 }))}
                      style={{ accentColor: '#8B5CF6', width: 16, height: 16 }}
                    />
                    Negative Marking
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                    color: 'white',
                    fontWeight: 800,
                    padding: '10px 18px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
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
                      required
                      rows="3"
                      value={questionForm.question_text}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                      placeholder="Enter the question statement..."
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, fontSize: 13, color: 'white', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option A</label>
                      <input
                        type="text" required
                        value={questionForm.option_a}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_a: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option B</label>
                      <input
                        type="text" required
                        value={questionForm.option_b}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_b: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option C</label>
                      <input
                        type="text" required
                        value={questionForm.option_c}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_c: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Option D</label>
                      <input
                        type="text" required
                        value={questionForm.option_d}
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
                        type="number" required min="1"
                        value={questionForm.marks}
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
                        type="text" required
                        value={questionForm.section_id}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, section_id: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Section Name</label>
                      <input
                        type="text" required
                        value={questionForm.section_name}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, section_name: e.target.value }))}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, fontSize: 13, color: 'white', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => setShowQuestionForm(false)}
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
                              onClick={() => handleDeleteQuestion(q.id)}
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
                              const key = `option_${opt}`;
                              const isCorrect = q.correct_answer === opt.toUpperCase();
                              return (
                                <div key={opt} style={{
                                  fontSize: 12, padding: '10px 14px', borderRadius: 10,
                                  background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                                  border: isCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                  color: isCorrect ? '#10B981' : '#94A3B8',
                                  fontWeight: isCorrect ? 800 : 500
                                }}>
                                  <span style={{ marginRight: 6, fontWeight: 800 }}>{opt.toUpperCase()}:</span> {q[key]}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <button
                      onClick={() => setIsQuestionsModalOpen(false)}
                      style={{ padding: '12px 28px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                    >
                      Close Manager
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
