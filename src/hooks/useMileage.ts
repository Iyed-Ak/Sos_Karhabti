import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVehicles } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';

const SNOOZE_KEY = 'mileage_snooze_until';
const LAST_UPDATE_KEY = 'mileage_last_update';
const SNOOZE_DAYS = 7;
const STALE_DAYS = 7;

function msPerDay(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

/**
 * Manages the mileage update modal logic:
 * - Shows if last update >7 days ago or no record
 * - "Snooze" dismisses for 7 days without updating
 * - Persists via AsyncStorage
 */
export function useMileage() {
  const { selectedVehicle, updateVehicle } = useVehicles();
  const { isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Only prompt AFTER user is authenticated and has a vehicle
    if (!isAuthenticated || !selectedVehicle) return;
    checkShouldPrompt();
  }, [selectedVehicle?.id, isAuthenticated]);

  const checkShouldPrompt = async () => {
    try {
      const snoozeUntil = await AsyncStorage.getItem(SNOOZE_KEY);
      if (snoozeUntil && Date.now() < parseInt(snoozeUntil, 10)) return;

      const lastUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      if (!lastUpdate || Date.now() - parseInt(lastUpdate, 10) > msPerDay(STALE_DAYS)) {
        setModalVisible(true);
      }
    } catch {
      // ignore storage errors
    }
  };

  const submitMileage = async (km: number) => {
    if (!selectedVehicle) return;
    setSaving(true);
    try {
      await updateVehicle(selectedVehicle.id, { mileage: km });
      await AsyncStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  };

  const snooze = async () => {
    const until = (Date.now() + msPerDay(SNOOZE_DAYS)).toString();
    await AsyncStorage.setItem(SNOOZE_KEY, until);
    setModalVisible(false);
  };

  const openModal = () => setModalVisible(true);

  return { modalVisible, saving, submitMileage, snooze, openModal };
}
