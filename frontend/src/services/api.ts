import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Instance axios configurée
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas rediriger si c'est une erreur sur les routes d'auth (login/register)
    const isAuthRoute = error.config?.url?.includes('/auth/login') || 
                        error.config?.url?.includes('/auth/register');
    
    if (error.response?.status === 401 && !isAuthRoute) {
      // Token expiré ou invalide sur une route protégée
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

// Contact Types
export interface Contact {
  id?: number;
  type: 'individual' | 'professional';
  
  // Champs Individual (optionnels)
  firstName?: string;
  lastName?: string;
  
  // Champs Professional (optionnels)
  companyName?: string;
  sirenNumber?: string;
  
  // Champs communs
  email: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  count: number;
}

export interface CreateContactResponse {
  message: string;
  contact: Contact;
}

// API Auth
export const authAPI = {
  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', credentials),

  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  logout: () =>
    api.post('/auth/logout'),

  me: () =>
    api.get<{ user: User }>('/auth/me'),
};

// API Contacts
export const contactsAPI = {
  getAll: (search?: string) =>
    api.get<ContactsResponse>('/contacts', { params: { search } }),

  getById: (id: number) =>
    api.get<{ contact: Contact }>(`/contacts/${id}`),

  create: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<CreateContactResponse>('/contacts', contact),

  update: (id: number, contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.put<{ message: string; contact: Contact }>(`/contacts/${id}`, contact),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/contacts/${id}`),
};