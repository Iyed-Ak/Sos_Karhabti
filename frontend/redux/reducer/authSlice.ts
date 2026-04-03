import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../src/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'driver';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const restoreSessionThunk = createAsyncThunk(
  'auth/restoreSession',
  async () => {
    const storedToken = await AsyncStorage.getItem('@smartsos_token');
    const storedUser = await AsyncStorage.getItem('@smartsos_user');
    if (storedToken && storedUser) {
      return { token: storedToken, user: JSON.parse(storedUser) as User };
    }
    return null;
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const { token, user } = await authApi.login(email, password);
    await AsyncStorage.setItem('@smartsos_token', token);
    await AsyncStorage.setItem('@smartsos_user', JSON.stringify(user));
    return { token, user: user as User };
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const { token, user } = await authApi.register(name, email, password);
    await AsyncStorage.setItem('@smartsos_token', token);
    await AsyncStorage.setItem('@smartsos_user', JSON.stringify(user));
    return { token, user: user as User };
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.multiRemove(['@smartsos_token', '@smartsos_user']);
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Persist updated user
        AsyncStorage.setItem('@smartsos_user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // ── Restore Session ──
    builder
      .addCase(restoreSessionThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(restoreSessionThunk.rejected, (state) => {
        state.isLoading = false;
      });

    // ── Login ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      });

    // ── Register ──
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerThunk.rejected, (state) => {
        state.isLoading = false;
      });

    // ── Logout ──
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    });
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const { updateUser } = authSlice.actions;
export default authSlice.reducer;
