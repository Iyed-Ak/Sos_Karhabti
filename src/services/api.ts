import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Config ───────────────────────────────────────────────────────────────────

// Change this to your NestJS backend URL when ready
const BASE_URL = 'http://localhost:3000/api';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor — injects Bearer token on every request
api.interceptors.request.use(async (config: AxiosRequestConfig | any) => {
  const token = await AsyncStorage.getItem('@smartsos_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const message = error?.response?.data?.message || 'Une erreur est survenue';
    return Promise.reject(new Error(message));
  }
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace these with real API calls when backend is ready.

const MOCK_USER = {
  id: '1',
  name: 'Ahmed Benali',
  email: 'ahmed@smartsos.ma',
  phone: '+212 6 12 34 56 78',
  role: 'user' as const,
};

const MOCK_VEHICLES = [
  {
    id: '1',
    brand: 'Dacia',
    model: 'Duster',
    year: 2021,
    plate: 'A-12345-7',
    vin: 'VF1RFCD1H58120347',
    mileage: 45000,
    fuelType: 'diesel' as const,
    color: '#2563EB',
  },
  {
    id: '2',
    brand: 'Renault',
    model: 'Clio',
    year: 2019,
    plate: 'B-67890-2',
    mileage: 72000,
    fuelType: 'gasoline' as const,
    color: '#7C3AED',
  },
];

const MOCK_MAINTENANCE = [
  {
    id: '1',
    vehicleId: '1',
    type: 'Vidange',
    date: '2024-11-15',
    mileage: 42000,
    cost: 150, // Updated for TND
    notes: 'Huile 5W30 + filtre à huile',
    reminderIntervalKm: 10000, // rappel dans 10000 km
  },
  {
    id: '2',
    vehicleId: '1',
    type: 'Freins',
    date: '2024-09-20',
    mileage: 38000,
    cost: 320, // Updated for TND
    notes: 'Plaquettes avant remplacées',
    reminderIntervalKm: 30000, // rappel freins dans 30000 km
  },
];

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, _password: string) => {
    // TODO: replace with -> const { data } = await api.post('/auth/login', { email, password });
    await new Promise(r => setTimeout(r, 1000)); // simulate network
    if (email !== MOCK_USER.email) throw new Error('Email ou mot de passe incorrect');
    return { token: 'mock_jwt_token_12345', user: MOCK_USER };
  },

  register: async (name: string, email: string, _password: string) => {
    // TODO: replace with -> const { data } = await api.post('/auth/register', { name, email, password });
    await new Promise(r => setTimeout(r, 1000));
    const newUser = { ...MOCK_USER, id: Date.now().toString(), name, email };
    return { token: 'mock_jwt_token_new', user: newUser };
  },

  getProfile: async () => {
    // TODO: replace with -> const { data } = await api.get('/auth/profile');
    return MOCK_USER;
  },
};

// ─── Vehicle API ──────────────────────────────────────────────────────────────

export const vehicleApi = {
  getAll: async () => {
    // TODO: replace with -> const { data } = await api.get('/vehicles');
    await new Promise(r => setTimeout(r, 500));
    return MOCK_VEHICLES;
  },

  create: async (vehicle: any) => {
    // TODO: replace with -> const { data } = await api.post('/vehicles', vehicle);
    await new Promise(r => setTimeout(r, 500));
    return { ...vehicle, id: Date.now().toString() };
  },

  update: async (id: string, updates: any) => {
    // TODO: replace with -> const { data } = await api.patch(`/vehicles/${id}`, updates);
    await new Promise(r => setTimeout(r, 300));
    const existing = MOCK_VEHICLES.find(v => v.id === id);
    return { ...existing, ...updates, id };
  },

  delete: async (id: string) => {
    // TODO: replace with -> await api.delete(`/vehicles/${id}`);
    await new Promise(r => setTimeout(r, 300));
  },
};

// ─── Maintenance API ──────────────────────────────────────────────────────────

export const maintenanceApi = {
  getAll: async (vehicleId: string) => {
    // TODO: replace with -> const { data } = await api.get(`/maintenance?vehicleId=${vehicleId}`);
    await new Promise(r => setTimeout(r, 400));
    return MOCK_MAINTENANCE.filter(m => m.vehicleId === vehicleId);
  },

  create: async (entry: any) => {
    // TODO: replace with -> const { data } = await api.post('/maintenance', entry);
    await new Promise(r => setTimeout(r, 400));
    return { ...entry, id: Date.now().toString() };
  },

  delete: async (id: string) => {
    // TODO: replace with -> await api.delete(`/maintenance/${id}`);
    await new Promise(r => setTimeout(r, 300));
  },
};

// ─── SOS API ─────────────────────────────────────────────────────────────────

export const sosApi = {
  request: async (data: { vehicleId: string; lat: number; lon: number; description: string }) => {
    // TODO: replace with -> const { res } = await api.post('/sos', data);
    await new Promise(r => setTimeout(r, 1500));
    return {
      requestId: Date.now().toString(),
      status: 'dispatched',
      driver: { name: 'Mohamed Alaoui', phone: '+212 6 98 76 54 32', eta: '12 min' },
      truck: { id: 'TRK-04', plate: 'C-11111-3' },
    };
  },

  getHistory: async () => {
    await new Promise(r => setTimeout(r, 400));
    return [
      { id: '1', date: '2025-01-10', description: 'Crevaison', status: 'completed', cost: 200 },
    ];
  },
};

export default api;
