import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// College API
export const collegeAPI = {
  getAll: () => api.get('/colleges'),
  getById: (id) => api.get(`/colleges/${id}`),
  create: (data) => api.post('/colleges', data),
  update: (id, data) => api.put(`/colleges/${id}`, data),
  delete: (id) => api.delete(`/colleges/${id}`),
};

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByStudentId: (studentId) => api.get(`/students/student-id/${studentId}`),
  getByCollegeId: (collegeId) => api.get(`/students/college/${collegeId}`),
  search: (query) => api.get(`/students/search?q=${query}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Event API
export const eventAPI = {
  getAll: () => api.get('/events'),
  getActive: () => api.get('/events/active'),
  getAvailable: () => api.get('/events/available'),
  getById: (id) => api.get(`/events/${id}`),
  getByCollegeId: (collegeId) => api.get(`/events/college/${collegeId}`),
  getByType: (eventType) => api.get(`/events/type/${eventType}`),
  search: (query) => api.get(`/events/search?q=${query}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/events/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Registration API
export const registrationAPI = {
  getAll: () => api.get('/registrations'),
  getByEventId: (eventId) => api.get(`/registrations/event/${eventId}`),
  getByStudentId: (studentId) => api.get(`/registrations/student/${studentId}`),
  getCountByEventId: (eventId) => api.get(`/registrations/event/${eventId}/count`),
  register: (studentId, eventId) => 
    api.post(`/registrations/register?studentId=${studentId}&eventId=${eventId}`),
  cancel: (studentId, eventId) => 
    api.delete(`/registrations/cancel?studentId=${studentId}&eventId=${eventId}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getByEventId: (eventId) => api.get(`/attendance/event/${eventId}`),
  getByStudentId: (studentId) => api.get(`/attendance/student/${studentId}`),
  getPresentByEventId: (eventId) => api.get(`/attendance/event/${eventId}/present`),
  getPresentByStudentId: (studentId) => api.get(`/attendance/student/${studentId}/present`),
  getCountByEventId: (eventId) => api.get(`/attendance/event/${eventId}/count`),
  markAttendance: (studentId, eventId) => 
    api.post(`/attendance/mark?studentId=${studentId}&eventId=${eventId}`),
  markAbsent: (studentId, eventId) => 
    api.post(`/attendance/mark-absent?studentId=${studentId}&eventId=${eventId}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  getByEventId: (eventId) => api.get(`/feedback/event/${eventId}`),
  getByStudentId: (studentId) => api.get(`/feedback/student/${studentId}`),
  getAverageRating: (eventId) => api.get(`/feedback/event/${eventId}/average-rating`),
  getCount: (eventId) => api.get(`/feedback/event/${eventId}/count`),
  submit: (studentId, eventId, rating, comment) => 
    api.post(`/feedback/submit?studentId=${studentId}&eventId=${eventId}&rating=${rating}&comment=${comment}`),
  update: (studentId, eventId, rating, comment) => 
    api.put(`/feedback/update?studentId=${studentId}&eventId=${eventId}&rating=${rating}&comment=${comment}`),
  delete: (feedbackId) => api.delete(`/feedback/${feedbackId}`),
};

// Reports API
export const reportsAPI = {
  getEventPopularity: () => api.get('/reports/event-popularity'),
  getAttendanceByEvent: (eventId) => api.get(`/reports/attendance/event/${eventId}`),
  getAllAttendance: () => api.get('/reports/attendance/all'),
  getStatistics: () => api.get('/reports/statistics'),
};

// Auth API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: (token) => {
    const authApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return authApi.get('/auth/me');
  },
};

// User Management API (Admin only)
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
};

export default api;
