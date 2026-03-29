import { useState, useMemo } from 'react';
import { useVehicles, Vehicle } from '../context/VehicleContext';
import { useRouter } from 'expo-router';

export const FUEL_BADGE: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  gasoline: { label: 'Essence',   emoji: '⛽', color: '#F59E0B', bg: '#FEF3C7' },
  diesel:   { label: 'Diesel',    emoji: '⛽', color: '#78716C', bg: '#F5F5F4' },
  electric: { label: 'Électrique',emoji: '⚡', color: '#22C55E', bg: '#DCFCE7' },
  hybrid:   { label: 'Hybride',   emoji: '🔋', color: '#3B82F6', bg: '#EFF6FF' },
};

const DEFAULT_SERVICE_INTERVAL = 10_000; // km

export interface VehicleKpi {
  kmToNextService: number;
  serviceProgressPct: number; // 0–1 (0 = just serviced, 1 = overdue)
  lastServiceKm: number;
  nextServiceKm: number;
}

/**
 * Returns the active vehicle list, selected vehicle, carousel index,
 * fuel badge, and KPI data needed by the hero card.
 */
export function useVehicle() {
  const { vehicles, selectedVehicle, setSelectedVehicle } = useVehicles();
  const router = useRouter();

  const [carouselIndex, setCarouselIndex] = useState(0);

  const activeVehicle: Vehicle | null =
    vehicles[carouselIndex] ?? selectedVehicle;

  const fuelBadge = useMemo(() => {
    const type = activeVehicle?.fuelType ?? 'gasoline';
    return FUEL_BADGE[type] ?? FUEL_BADGE.gasoline;
  }, [activeVehicle?.fuelType]);

  const kpi: VehicleKpi | null = useMemo(() => {
    if (!activeVehicle) return null;
    const mileage = activeVehicle.mileage;
    const lastServiceKm =
      Math.floor(mileage / DEFAULT_SERVICE_INTERVAL) * DEFAULT_SERVICE_INTERVAL;
    const nextServiceKm = lastServiceKm + DEFAULT_SERVICE_INTERVAL;
    const kmToNextService = Math.max(0, nextServiceKm - mileage);
    const serviceProgressPct =
      (mileage - lastServiceKm) / DEFAULT_SERVICE_INTERVAL;
    return { kmToNextService, serviceProgressPct, lastServiceKm, nextServiceKm };
  }, [activeVehicle?.mileage]);

  const handleCarouselChange = (index: number) => {
    setCarouselIndex(index);
    if (vehicles[index]) setSelectedVehicle(vehicles[index]);
  };

  const goToVehicles = () => router.push('/(tabs)/vehicles');

  return {
    vehicles,
    activeVehicle,
    fuelBadge,
    kpi,
    carouselIndex,
    handleCarouselChange,
    goToVehicles,
  };
}
