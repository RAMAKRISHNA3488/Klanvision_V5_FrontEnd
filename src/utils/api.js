const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Something went wrong');
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
};

const fetchWithAuth = (url, options = {}) => {
    let token = null;
    try {
        const sessionStr = localStorage.getItem('klanvision_admin_session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.user && session.user.token) {
                token = session.user.token;
            }
        }
    } catch (e) {
        // ignore
    }
    
    const headers = { ...options.headers };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, { ...options, headers }).then(handleResponse);
};

export const api = {
    // Projects
    getProjects: () => fetchWithAuth(`${API_BASE_URL}/projects`),
    createProject: (data) => fetchWithAuth(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateProject: (id, data) => fetchWithAuth(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteProject: (id) => fetchWithAuth(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' }),

    // Blogs
    getBlogs: () => fetchWithAuth(`${API_BASE_URL}/blogs`),
    createBlog: (data) => fetchWithAuth(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateBlog: (id, data) => fetchWithAuth(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteBlog: (id) => fetchWithAuth(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE' }),

    // SEO
    getSEO: () => fetchWithAuth(`${API_BASE_URL}/seo`),
    updateSEO: (data) => fetchWithAuth(`${API_BASE_URL}/seo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // Activities
    getActivities: () => fetchWithAuth(`${API_BASE_URL}/activities?limit=200`),
    getActivitiesAfter: (afterId) => fetchWithAuth(`${API_BASE_URL}/activities?afterId=${afterId}&limit=50`),
    addActivity: (data) => fetchWithAuth(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    // Admin Users
    getUsers: () => fetchWithAuth(`${API_BASE_URL}/admin/users`),
    createUser: (data) => fetchWithAuth(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateUser: (id, data) => fetchWithAuth(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteUser: (id) => fetchWithAuth(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE' }),

    // Auth (Login and 2FA don't need token)
    login: (credentials) => fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(handleResponse),
    verify2FA: (email, code) => fetch(`${API_BASE_URL}/admin/verify-2fa?usernameOrEmail=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
        method: 'POST'
    }).then(handleResponse),
    generate2FA: (email) => fetch(`${API_BASE_URL}/admin/generate-2fa?usernameOrEmail=${encodeURIComponent(email)}`).then(handleResponse),

    // Applications
    getApplications: () => fetchWithAuth(`${API_BASE_URL}/applications`),
    createApplication: (formData) => fetch(`${API_BASE_URL}/applications`, { method: 'POST', body: formData }),
    deleteApplication: (id) => fetchWithAuth(`${API_BASE_URL}/applications/${id}`, { method: 'DELETE' }),
    downloadResume: (id) => `${API_BASE_URL}/applications/resume/${id}`,

    // Jobs
    getJobs: () => fetchWithAuth(`${API_BASE_URL}/jobs`),
    getActiveJobs: () => fetch(`${API_BASE_URL}/jobs/active`).then(handleResponse), // Active jobs might be public, but using standard fetch for now
    createJob: (data) => fetchWithAuth(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateJob: (id, data) => fetchWithAuth(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteJob: (id) => fetchWithAuth(`${API_BASE_URL}/jobs/${id}`, { method: 'DELETE' }),

    // Health Check
    checkHealth: () => fetch(`${API_BASE_URL}/health`).then(r => r.ok),

    // Exams
    getExams: () => fetch(`${API_BASE_URL}/exams`).then(handleResponse),
    getExam: (id) => fetch(`${API_BASE_URL}/exams/${id}`).then(handleResponse),
    createExam: (data) => fetchWithAuth(`${API_BASE_URL}/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateExam: (id, data) => fetchWithAuth(`${API_BASE_URL}/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteExam: (id) => fetchWithAuth(`${API_BASE_URL}/exams/${id}`, { method: 'DELETE' }),

    // Exam Engine & Attempts
    upsertProfile: (data) => fetch(`${API_BASE_URL}/exam-profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    getAttempts: (testId, studentId, status, countOnly = false) => {
        let url = `${API_BASE_URL}/attempts?testId=${encodeURIComponent(testId)}&studentId=${encodeURIComponent(studentId)}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        if (countOnly) url += `&count=exact`;
        return fetch(url).then(handleResponse);
    },
    createAttempt: (data) => fetch(`${API_BASE_URL}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    getAttemptAnswers: (attemptId) => fetch(`${API_BASE_URL}/attempt-answers?attemptId=${encodeURIComponent(attemptId)}`).then(handleResponse),
    upsertAttemptAnswers: (data) => fetch(`${API_BASE_URL}/attempt-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    getExamQuestions: (id) => fetch(`${API_BASE_URL}/exams/${id}/questions`).then(handleResponse),
    submitAttempt: (id, timeTaken) => fetch(`${API_BASE_URL}/attempts/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeTaken })
    }).then(handleResponse),
    createQuestion: (examId, data) => fetchWithAuth(`${API_BASE_URL}/exams/${examId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateQuestion: (questionId, data) => fetchWithAuth(`${API_BASE_URL}/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteQuestion: (questionId) => fetchWithAuth(`${API_BASE_URL}/questions/${questionId}`, { method: 'DELETE' }),

    // Internship Management
    getInterns: (filters = {}) => {
        let url = `${API_BASE_URL}/interns?`;
        if (filters.search) url += `search=${encodeURIComponent(filters.search)}&`;
        if (filters.status) url += `status=${encodeURIComponent(filters.status)}&`;
        if (filters.domain) url += `domain=${encodeURIComponent(filters.domain)}&`;
        if (filters.startDate) url += `startDate=${encodeURIComponent(filters.startDate)}&`;
        if (filters.endDate) url += `endDate=${encodeURIComponent(filters.endDate)}&`;
        return fetchWithAuth(url);
    },
    createIntern: (data) => fetchWithAuth(`${API_BASE_URL}/interns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    updateIntern: (id, data) => fetchWithAuth(`${API_BASE_URL}/interns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    deleteIntern: (id) => fetchWithAuth(`${API_BASE_URL}/interns/${id}`, { method: 'DELETE' }),

    // Certificates
    getCertificates: () => fetchWithAuth(`${API_BASE_URL}/certificates`),
    getCertificate: (id) => fetchWithAuth(`${API_BASE_URL}/certificates/${id}`),
    regenerateCertificate: (id) => fetchWithAuth(`${API_BASE_URL}/certificates/regenerate/${id}`, { method: 'POST' }),

    // Public Verification Portal (no token)
    verifyCertificate: (certificateNumber) => fetch(`${API_BASE_URL}/verify/${encodeURIComponent(certificateNumber)}`).then(handleResponse),

    // Document Downloads
    downloadOfferLetterUrl: (id) => `${API_BASE_URL}/documents/offer-letter/${id}`,
    downloadParticipationLetterUrl: (id) => `${API_BASE_URL}/documents/participation/${id}`,
    downloadCompletionCertificateUrl: (id) => `${API_BASE_URL}/documents/completion/${id}`,
    downloadRecommendationLetterUrl: (id) => `${API_BASE_URL}/documents/recommendation/${id}`,

    // Email Templates
    getEmailTemplates: () => fetchWithAuth(`${API_BASE_URL}/email-templates`),
    updateEmailTemplate: (key, data) => fetchWithAuth(`${API_BASE_URL}/email-templates/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
};
