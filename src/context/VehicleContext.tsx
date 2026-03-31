// ─── VehicleContext.tsx ───────────────────────────────────────────────────────
// Ce fichier a été migré de Context API vers Redux Toolkit.
// Les hooks et types gardent la même interface pour compatibilité.
// ──────────────────────────────────────────────────────────────────────────────

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchVehicles,
  addVehicleThunk,
  updateVehicleThunk,
  removeVehicleThunk,
  setSelectedVehicle as setSelectedVehicleAction,
} from '../../redux/reducer/vehicleSlice';

// ─── Types (ré-exportés pour compatibilité) ───────────────────────────────────

export type { Vehicle } from '../../redux/reducer/vehicleSlice';
import type { Vehicle } from '../../redux/reducer/vehicleSlice';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useVehicles = () => {
  const dispatch = useAppDispatch();
  const { vehicles, selectedVehicle, isLoading } = useAppSelector(
    (state) => state.vehicles
  );

  const setSelectedVehicle = (vehicle: Vehicle) => {
    dispatch(setSelectedVehicleAction(vehicle));
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    await dispatch(addVehicleThunk(vehicleData)).unwrap();
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    await dispatch(updateVehicleThunk({ id, updates })).unwrap();
  };

  const updateMileage = async (id: string, km: number) => {
    await updateVehicle(id, { mileage: km });
  };

  const removeVehicle = async (id: string) => {
    await dispatch(removeVehicleThunk(id)).unwrap();
  };

  const refreshVehicles = async () => {
    await dispatch(fetchVehicles()).unwrap();
  };

  return {
    vehicles,
    selectedVehicle,
    isLoading,
    setSelectedVehicle,
    addVehicle,
    updateVehicle,
    updateMileage,
    removeVehicle,
    refreshVehicles,
  };
};
