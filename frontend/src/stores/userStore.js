// src/stores/userStore.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { loginUser, signupUser, fetchUserProfile } from '@/services/authService';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('authToken'));
  const errorMessage = ref('');

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials); 
      user.value = response.data.user;
      token.value = response.data.accessToken;
      localStorage.setItem('authToken', token.value);
      errorMessage.value = '';
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      errorMessage.value = error.response?.data?.error || 'Login failed. Please check your credentials.';
      return false;
    }
  };

  const signup = async (userInfo) => {
    try {
      const response = await signupUser(userInfo);
      user.value = response.data.user;
      token.value = response.data.accessToken;
      localStorage.setItem('authToken', token.value);
      errorMessage.value = '';
      return true;
    } catch (error) {
      console.error('Sign-up failed:', error);
      errorMessage.value = error.response?.data?.error || 'Sign-up failed. Please try again.';
      return false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('authToken');
  };

  const fetchProfile = async () => {
    try {
      const response = await fetchUserProfile();
      user.value = response.data.user;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return { user, token, isAuthenticated, errorMessage, login, signup, logout, fetchProfile };
});
