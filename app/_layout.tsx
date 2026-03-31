import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { store } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { restoreSessionThunk } from '../redux/reducer/authSlice';
import { fetchVehicles, clearVehicles } from '../redux/reducer/vehicleSlice';
import { colors } from '../src/theme/colors';

// ─── Session Initializer ──────────────────────────────────────────────────────
// Restaure la session au démarrage et charge les véhicules quand l'utilisateur
// est authentifié (remplace le useEffect qu'on avait dans VehicleProvider).

function SessionInit() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // 1. Restaurer la session au lancement
  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, []);

  // 2. Charger/vider les véhicules selon l'état d'authentification
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      dispatch(fetchVehicles());
    } else {
      dispatch(clearVehicles());
    }
  }, [isAuthenticated, isLoading]);

  return null; // composant invisible
}

// ─── Root Navigation Guard ────────────────────────────────────────────────────

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingLogo}>🛡️</Text>
        <Text style={styles.loadingTitle}>SmartSOS</Text>
        <Text style={styles.loadingSubtitle}>Chargement...</Text>
      </View>
    );
  }

  return <Slot />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar style="light" />
          <SessionInit />
          <RootLayoutNav />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingLogo: { fontSize: 64 },
  loadingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
