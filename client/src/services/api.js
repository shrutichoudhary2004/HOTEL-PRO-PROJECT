import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotelpro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: auto-logout on token expiration
      // localStorage.removeItem('hotelpro_token');
      // localStorage.removeItem('hotelpro_user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getUsers: () => api.get('/auth/users'),
};

export const roomsAPI = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

export const bookingsAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, statusData) => api.put(`/bookings/${id}/status`, statusData),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
};

export default api;
