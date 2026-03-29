import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vehicleApi } from '../services/api';
import { useAuth } from './AuthContext';

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

interface VehicleContextType {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  addVehicle: (v: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  updateMileage: (id: string, km: number) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  refreshVehicles: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshVehicles();
    } else {
      setVehicles([]);
      setSelectedVehicle(null);
    }
  }, [isAuthenticated]);

  const refreshVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
      if (data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(data[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const created = await vehicleApi.create(vehicleData);
    setVehicles(prev => [...prev, created]);
    if (!selectedVehicle) setSelectedVehicle(created);
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    const updated = await vehicleApi.update(id, updates);
    setVehicles(prev => prev.map(v => (v.id === id ? updated : v)));
    if (selectedVehicle?.id === id) setSelectedVehicle(updated);
  };

  const updateMileage = async (id: string, km: number) => {
    await updateVehicle(id, { mileage: km });
  };

  const removeVehicle = async (id: string) => {
    await vehicleApi.delete(id);
    setVehicles(prev => {
      const filtered = prev.filter(v => v.id !== id);
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(filtered[0] ?? null);
      }
      return filtered;
    });
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        isLoading,
        setSelectedVehicle,
        addVehicle,
        updateVehicle,
        updateMileage,
        removeVehicle,
        refreshVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useVehicles = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (!context) throw new Error('useVehicles must be used within VehicleProvider');
  return context;
};

export default VehicleContext;
