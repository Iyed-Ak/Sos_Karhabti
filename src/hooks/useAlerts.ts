import { useState, useCallback } from 'react';

export type AlertLevel = 'danger' | 'warning' | 'info';

export interface Alert {
  id: string;
  title: string;
  description: string;
  level: AlertLevel;
  triggeredAt: Date; // date de déclenchement
  icon?: string;
}

// ─── Mock data (à remplacer par appel API) ───────────────────────────────────

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Vidange urgente',
    description: 'La vidange est due dans 1 000 km. Planifiez dès maintenant.',
    level: 'warning',
    triggeredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours
  },
  {
    id: 'a2',
    title: 'Contrôle technique',
    description: 'Contrôle technique prévu pour le mois prochain.',
    level: 'info',
    triggeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 jour
  },
  {
    id: 'a3',
    title: 'Pression pneus basse',
    description: 'La pression de vos pneus avant est insuffisante.',
    level: 'danger',
    triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 heures
  },
];

export function relativeDate(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24)   return `il y a ${hours}h`;
  if (days === 1)   return 'hier';
  return `il y a ${days} jours`;
}

/**
 * Manages active alerts: dismiss, limit display, and "see all" toggle.
 */
export function useAlerts(max = 2) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  }, []);

  const visible = MOCK_ALERTS.filter(a => !dismissed.has(a.id));
  const displayed = showAll ? visible : visible.slice(0, max);
  const hasMore = visible.length > max;

  return { alerts: visible, displayed, hasMore, showAll, setShowAll, dismiss };
}
