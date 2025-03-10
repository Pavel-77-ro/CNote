// src/services/authService.js
import axiosInstance from './axiosInstance';

export const loginUser = (credentials) => {
  return axiosInstance.post('/auth/login', credentials);
};

export const signupUser = (userInfo) => {
  return axiosInstance.post('/auth/register', userInfo);
};

export const fetchUserProfile = () => {
  return axiosInstance.get('/auth/profile');
};
