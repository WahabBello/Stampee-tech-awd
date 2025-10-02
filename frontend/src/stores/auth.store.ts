import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI, type User, type LoginCredentials, type RegisterCredentials } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Actions
  const initialize = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authAPI.register(credentials);
      token.value = response.data.token;
      user.value = response.data.user;

      // Sauvegarder dans localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de l\'inscription';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authAPI.login(credentials);
      token.value = response.data.token;
      user.value = response.data.user;

      // Sauvegarder dans localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de la connexion';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Nettoyer le state et localStorage
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    initialize,
    register,
    login,
    logout,
    clearError,
  };
});