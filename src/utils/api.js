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

export const api = {
    // Projects
    getProjects: () => fetch(`${API_BASE_URL}/projects`).then(handleResponse),
    createProject: (data) => fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateProject: (id, data) => fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteProject: (id) => fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' }).then(handleResponse),

    // Blogs
    getBlogs: () => fetch(`${API_BASE_URL}/blogs`).then(handleResponse),
    createBlog: (data) => fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateBlog: (id, data) => fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteBlog: (id) => fetch(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE' }).then(handleResponse),

    // SEO
    getSEO: () => fetch(`${API_BASE_URL}/seo`).then(handleResponse),
    updateSEO: (data) => fetch(`${API_BASE_URL}/seo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),

    // Activities
    getActivities: () => fetch(`${API_BASE_URL}/activities?limit=200`).then(handleResponse),
    getActivitiesAfter: (afterId) => fetch(`${API_BASE_URL}/activities?afterId=${afterId}&limit=50`).then(handleResponse),
    addActivity: (data) => fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),

    // Admin Users
    getUsers: () => fetch(`${API_BASE_URL}/admin/users`).then(handleResponse),
    createUser: (data) => fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateUser: (id, data) => fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteUser: (id) => fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE' }).then(handleResponse),

    // Auth
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
    getApplications: () => fetch(`${API_BASE_URL}/applications`).then(handleResponse),
    deleteApplication: (id) => fetch(`${API_BASE_URL}/applications/${id}`, { method: 'DELETE' }).then(handleResponse),
    downloadResume: (id) => `${API_BASE_URL}/applications/resume/${id}`,

    // Jobs
    getJobs: () => fetch(`${API_BASE_URL}/jobs`).then(handleResponse),
    getActiveJobs: () => fetch(`${API_BASE_URL}/jobs`).then(handleResponse),
    createJob: (data) => fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateJob: (id, data) => fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteJob: (id) => fetch(`${API_BASE_URL}/jobs/${id}`, { method: 'DELETE' }).then(handleResponse),

    // Health Check
    checkHealth: () => fetch(`${API_BASE_URL}/projects`).then(r => r.ok),
};
