import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useVehicles } from '../../context/VehicleContext';
import { sosApi } from '../../services/api';

type SOSStatus = 'idle' | 'locating' | 'confirming' | 'dispatched';

const problemTypes = [
  { id: 'breakdown', label: 'Panne moteur', icon: '🔧' },
  { id: 'flat', label: 'Crevaison', icon: '🔄' },
  { id: 'battery', label: 'Batterie', icon: '🔋' },
  { id: 'accident', label: 'Accident', icon: '⚠️' },
  { id: 'keys', label: 'Clés perdues', icon: '🔑' },
  { id: 'other', label: 'Autre', icon: '📋' },
];

const SOSScreen: React.FC = () => {
  const { selectedVehicle } = useVehicles();
  const [status, setStatus] = useState<SOSStatus>('idle');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  const requestLocation = async () => {
    setStatus('locating');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        Alert.alert('Permission refusée', 'Activez la géolocalisation pour continuer');
        setStatus('idle');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      setStatus('confirming');
    } catch {
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
      setStatus('idle');
    }
  };

  const handleSOS = async () => {
    if (!selectedVehicle) {
      Alert.alert('Véhicule requis', 'Sélectionnez un véhicule avant de demander une assistance');
      return;
    }
    if (!selectedProblem) {
      Alert.alert('Problème requis', 'Sélectionnez le type de panne');
      return;
    }

    if (!location) {
      await requestLocation();
      return;
    }

    setStatus('locating');
    try {
      const result = await sosApi.request({
        vehicleId: selectedVehicle.id,
        lat: location.lat,
        lon: location.lon,
        description: `${selectedProblem} — ${description}`,
      });
      setDispatchResult(result);
      setStatus('dispatched');
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible d\'envoyer la demande SOS');
      setStatus('confirming');
    }
  };

  const resetSOS = () => {
    setStatus('idle');
    setSelectedProblem('');
    setDescription('');
    setLocation(null);
    setDispatchResult(null);
  };

  if (status === 'dispatched' && dispatchResult) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Success */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 48 }}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Assistance envoyée !</Text>
          <Text style={styles.successSubtitle}>Un chauffeur est en route vers vous</Text>
        </View>

        <Card style={styles.dispatchCard}>
          <Text style={styles.dispatchTitle}>Détails de l'intervention</Text>
          
          <View style={styles.dispatchRow}>
            <View style={styles.dispatchIcon}><Ionicons name="person" size={20} color={colors.primary} /></View>
            <View>
              <Text style={styles.dispatchLabel}>Chauffeur assigné</Text>
              <Text style={styles.dispatchValue}>{dispatchResult.driver.name}</Text>
            </View>
          </View>

          <View style={styles.dispatchRow}>
            <View style={styles.dispatchIcon}><Ionicons name="call" size={20} color={colors.success} /></View>
            <View>
              <Text style={styles.dispatchLabel}>Téléphone</Text>
              <Text style={styles.dispatchValue}>{dispatchResult.driver.phone}</Text>
            </View>
          </View>

          <View style={styles.dispatchRow}>
            <View style={styles.dispatchIcon}><Ionicons name="time" size={20} color={colors.warning} /></View>
            <View>
              <Text style={styles.dispatchLabel}>Temps d'arrivée estimé</Text>
              <Text style={[styles.dispatchValue, { color: colors.warning }]}>{dispatchResult.driver.eta}</Text>
            </View>
          </View>

          <View style={styles.dispatchRow}>
            <View style={styles.dispatchIcon}><Ionicons name="car" size={20} color={colors.textSecondary} /></View>
            <View>
              <Text style={styles.dispatchLabel}>Camion d'assistance</Text>
              <Text style={styles.dispatchValue}>{dispatchResult.truck.plate}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.etaCard}>
          <Ionicons name="location" size={24} color={colors.danger} />
          <Text style={styles.etaText}>Le chauffeur arrivera dans environ{' '}
            <Text style={{ fontWeight: typography.bold, color: colors.danger }}>{dispatchResult.driver.eta}</Text>
          </Text>
        </View>

        <Button title="Terminer" onPress={resetSOS} fullWidth type="secondary" />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SOS Header */}
      <View style={styles.sosHeader}>
        <View style={styles.sosIcon}>
          <Ionicons name="alert-circle" size={48} color={colors.textInverse} />
        </View>
        <Text style={styles.sosTitle}>Assistance SOS</Text>
        <Text style={styles.sosSubtitle}>
          {selectedVehicle
            ? `${selectedVehicle.brand} ${selectedVehicle.model} — ${selectedVehicle.plate}`
            : 'Aucun véhicule sélectionné'}
        </Text>
      </View>

      {/* Problem Type */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Type de panne</Text>
        <View style={styles.problemGrid}>
          {problemTypes.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.problemCard, selectedProblem === p.id && styles.problemCardActive]}
              onPress={() => setSelectedProblem(p.id)}
            >
              <Text style={{ fontSize: 24 }}>{p.icon}</Text>
              <Text style={[styles.problemLabel, selectedProblem === p.id && styles.problemLabelActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Description */}
      <Card style={styles.section}>
        <Input
          label="Description du problème (optionnel)"
          placeholder="Ex: La voiture refuse de démarrer..."
          value={description}
          onChangeText={setDescription}
          icon="document-text-outline"
          multiline
          numberOfLines={3}
        />
      </Card>

      {/* Location */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Ma position</Text>
        {location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color={colors.success} />
            <Text style={styles.locationText}>
              Position obtenue : {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.locationBtn} onPress={requestLocation}>
            <Ionicons name="locate-outline" size={20} color={colors.primary} />
            <Text style={styles.locationBtnText}>Obtenir ma position GPS</Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* SOS Button */}
      <TouchableOpacity
        style={[styles.mainSosBtn, (!selectedProblem) && styles.mainSosBtnDisabled]}
        onPress={handleSOS}
        activeOpacity={0.85}
        disabled={status === 'locating' || !selectedProblem}
      >
        {status === 'locating' ? (
          <ActivityIndicator size="large" color={colors.textInverse} />
        ) : (
          <>
            <Ionicons name="alert-circle" size={32} color={colors.textInverse} />
            <Text style={styles.mainSosBtnText}>DEMANDER UNE ASSISTANCE</Text>
            <Text style={styles.mainSosBtnSub}>Appuyez pour déclencher le SOS</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: spacing['2xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, gap: spacing.base, paddingBottom: spacing['3xl'] },
  sosHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  sosIcon: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.lg,
  },
  sosTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
  },
  sosSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: { marginBottom: 0 },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  problemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  problemCard: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  problemCardActive: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  problemLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.medium,
  },
  problemLabelActive: { color: colors.dangerDark },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  locationText: { fontSize: typography.sm, color: colors.success, flex: 1 },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  locationBtnText: { fontSize: typography.sm, color: colors.primary, fontWeight: typography.medium },
  mainSosBtn: {
    backgroundColor: colors.danger,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.lg,
  },
  mainSosBtnDisabled: { opacity: 0.5 },
  mainSosBtnText: {
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    color: colors.textInverse,
    letterSpacing: 1,
  },
  mainSosBtnSub: { fontSize: typography.sm, color: 'rgba(255,255,255,0.75)' },
  // Dispatched
  successContainer: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontSize: typography['2xl'], fontWeight: typography.bold, color: colors.textPrimary },
  successSubtitle: { fontSize: typography.sm, color: colors.textSecondary },
  dispatchCard: { marginBottom: spacing.base, gap: spacing.md },
  dispatchTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dispatchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dispatchIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dispatchLabel: { fontSize: typography.xs, color: colors.textTertiary },
  dispatchValue: { fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  etaText: { fontSize: typography.base, color: colors.textPrimary, flex: 1 },
});

export default SOSScreen;
