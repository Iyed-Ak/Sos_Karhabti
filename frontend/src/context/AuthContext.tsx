// ─── AuthContext.tsx ──────────────────────────────────────────────────────────
// Ce fichier a été migré de Context API vers Redux Toolkit.
// Les hooks et types gardent la même interface pour compatibilité.
// ──────────────────────────────────────────────────────────────────────────────

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  updateUser as updateUserAction,
} from '../../redux/reducer/authSlice';

// ─── Types (ré-exportés pour compatibilité) ───────────────────────────────────

export type { User } from '../../redux/reducer/authSlice';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const login = async (email: string, password: string) => {
    await dispatch(loginThunk({ email, password })).unwrap();
  };

  const register = async (name: string, email: string, password: string) => {
    await dispatch(registerThunk({ name, email, password })).unwrap();
  };

  const logout = async () => {
    await dispatch(logoutThunk()).unwrap();
  };

  const updateUser = (updates: Partial<{ id: string; name: string; email: string; phone?: string; avatar?: string; role: 'user' | 'admin' | 'driver' }>) => {
    dispatch(updateUserAction(updates));
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };
};
