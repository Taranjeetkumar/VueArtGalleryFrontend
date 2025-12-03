import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  // Set auth header
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  const register = async (username: string, email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });

      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      user.value = response.data;
    } catch (err) {
      logout();
    }
  };

  const updateProfile = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, data);
      user.value = response.data;
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Update failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
    updateProfile
  };
});
