// src/services/axiosInstance.js
import axios from 'axios';
import router from '@/router'; // import your Vue Router instance
import { useUserStore } from '@/stores/userStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post('/auth/refresh');
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('authToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Logout the user on refresh failure
        const userStore = useUserStore();
        userStore.logout();
        // Redirect to login page
        router.push({ name: 'login' });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
