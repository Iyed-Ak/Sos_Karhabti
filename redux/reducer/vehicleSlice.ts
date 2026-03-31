import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vehicleApi } from '../../src/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  vin?: string;
  mileage: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  color?: string;
  image?: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: VehicleState = {
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchAll',
  async () => {
    const data = await vehicleApi.getAll();
    return data as Vehicle[];
  }
);

export const addVehicleThunk = createAsyncThunk(
  'vehicles/add',
  async (vehicleData: Omit<Vehicle, 'id'>) => {
    const created = await vehicleApi.create(vehicleData);
    return created as Vehicle;
  }
);

export const updateVehicleThunk = createAsyncThunk(
  'vehicles/update',
  async ({ id, updates }: { id: string; updates: Partial<Vehicle> }) => {
    const updated = await vehicleApi.update(id, updates);
    return updated as Vehicle;
  }
);

export const removeVehicleThunk = createAsyncThunk(
  'vehicles/remove',
  async (id: string) => {
    await vehicleApi.delete(id);
    return id;
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setSelectedVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.selectedVehicle = action.payload;
    },
    clearVehicles: (state) => {
      state.vehicles = [];
      state.selectedVehicle = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch All ──
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload;
        // Auto-select first if none selected
        if (action.payload.length > 0 && !state.selectedVehicle) {
          state.selectedVehicle = action.payload[0];
        }
        state.isLoading = false;
      })
      .addCase(fetchVehicles.rejected, (state) => {
        state.isLoading = false;
      });

    // ── Add ──
    builder.addCase(addVehicleThunk.fulfilled, (state, action) => {
      state.vehicles.push(action.payload);
      if (!state.selectedVehicle) {
        state.selectedVehicle = action.payload;
      }
    });

    // ── Update ──
    builder.addCase(updateVehicleThunk.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.vehicles.findIndex((v) => v.id === updated.id);
      if (index !== -1) {
        state.vehicles[index] = updated;
      }
      if (state.selectedVehicle?.id === updated.id) {
        state.selectedVehicle = updated;
      }
    });

    // ── Remove ──
    builder.addCase(removeVehicleThunk.fulfilled, (state, action) => {
      const id = action.payload;
      state.vehicles = state.vehicles.filter((v) => v.id !== id);
      if (state.selectedVehicle?.id === id) {
        state.selectedVehicle = state.vehicles[0] ?? null;
      }
    });
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const { setSelectedVehicle, clearVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;
