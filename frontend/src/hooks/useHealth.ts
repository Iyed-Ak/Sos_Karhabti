import { useState, useEffect } from 'react';
import { Vehicle } from '../context/VehicleContext';
import { maintenanceApi } from '../services/api';

export type SystemStatus = 'ok' | 'warn' | 'critical';

export interface HealthIndicator {
  key: string;
  label: string;
  icon: string;
  status: SystemStatus;
  healthPct: number;
  desc: string;
}

export interface HealthData {
  globalScore: number;
  globalStatus: SystemStatus;
  indicators: HealthIndicator[];
  isLoading: boolean;
}

// Default intervals if the user didn't specify a reminder interval
const DEFAULT_INTERVALS: Record<string, number> = {
  Vidange: 10000,
  Freins: 30000,
  Pneus: 40000,
  Batterie: 50000,
  Filtres: 20000,
  Moteur: 60000, // generic engine check
};

export function useHealth(vehicle: Vehicle | null): HealthData {
  const [data, setData] = useState<HealthData>({
    globalScore: 100,
    globalStatus: 'ok',
    indicators: [],
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const computeHealth = async () => {
      if (!vehicle) {
        if (mounted) setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const records: any[] = await maintenanceApi.getAll(vehicle.id);
        
        // Helper to find latest record for a specific set of keywords
        const getLatest = (keywords: string[]) => {
          return records
            .filter(r => keywords.some(k => r.type.toLowerCase().includes(k.toLowerCase())))
            .sort((a, b) => b.mileage - a.mileage)[0]; // highest mileage first
        };

        const currentKm = vehicle.mileage;

        // Evaluate a specific system based on its latest maintenance
        const evaluateSystem = (
          key: string,
          label: string,
          icon: string,
          keywords: string[],
          defaultInterval: number,
          descMissing: string
        ): HealthIndicator => {
          const latest = getLatest(keywords);
          
          if (!latest) {
            return {
              key,
              label,
              icon,
              status: 'warn',
              healthPct: 50,
              desc: descMissing,
            };
          }

          const interval = latest.reminderIntervalKm || defaultInterval;
          const kmSinceService = currentKm - latest.mileage;
          const kmRemaining = interval - kmSinceService;
          
          let pct = Math.round((kmRemaining / interval) * 100);
          pct = Math.max(0, Math.min(100, pct)); // clamp 0-100

          let status: SystemStatus = 'ok';
          let desc = `Remplacement prévu dans ${Math.max(0, kmRemaining).toLocaleString()} km.`;

          if (pct <= 10) {
            status = 'critical';
            desc = kmRemaining < 0 
              ? `Dépassement de ${Math.abs(kmRemaining).toLocaleString()} km ! Action requise.`
              : `Intervention imminente. Seulement ${kmRemaining.toLocaleString()} km restants.`;
          } else if (pct <= 30) {
            status = 'warn';
            desc = `L'usure approche de la limite. Prévoyez un entretien dans ${kmRemaining.toLocaleString()} km.`;
          } else if (pct >= 80) {
            desc = 'État excellent, entretien récent.';
          }

          return { key, label, icon, status, healthPct: pct, desc };
        };

        const engine = evaluateSystem('engine', 'Moteur & Huile', 'water', ['Vidange', 'Moteur', 'Huile'], DEFAULT_INTERVALS.Vidange, "Aucune vidange enregistrée. Fortement conseillé d'en faire une.");
        const brakes = evaluateSystem('brakes', 'Système de Freinage', 'disc', ['Freins', 'Plaquettes', 'Disques'], DEFAULT_INTERVALS.Freins, "État des freins inconnu. Inspection requise.");
        const tires = evaluateSystem('tires', 'Pneumatiques', 'radio-button-off', ['Pneus', 'Roues', 'Géométrie'], DEFAULT_INTERVALS.Pneus, "Aucun changement de pneus enregistré.");
        const filters = evaluateSystem('filters', 'Filtres & Air', 'leaf', ['Filtre', 'Climatisation'], DEFAULT_INTERVALS.Filtres, "Les filtres n'ont pas d'historique de changement.");
        const battery = evaluateSystem('battery', 'Batterie & Électrique', 'battery-charging', ['Batterie', 'Alternateur'], DEFAULT_INTERVALS.Batterie, "Aucun remplacement de batterie connu.");

        const indicators = [engine, brakes, tires, filters, battery];
        
        // Calculate global score (weight engine and brakes slightly more? For now, linear average is fine)
        const avgScore = indicators.reduce((sum, ind) => sum + ind.healthPct, 0) / indicators.length;
        const score = Math.round(avgScore);
        const globalStatus: SystemStatus = score >= 80 ? 'ok' : score >= 50 ? 'warn' : 'critical';

        if (mounted) {
          setData({
            globalScore: score,
            globalStatus,
            indicators,
            isLoading: false,
          });
        }
      } catch (err) {
        console.error('Failed to compute health', err);
        if (mounted) setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    computeHealth();

    return () => {
      mounted = false;
    };
  }, [vehicle?.id, vehicle?.mileage]);

  return data;
}
