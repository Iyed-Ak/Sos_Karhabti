import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authSlice';
import vehicleReducer from './reducer/vehicleSlice';

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    auth: authReducer,        // Gère l'état d'authentification
    vehicles: vehicleReducer, // Gère l'état des véhicules
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;