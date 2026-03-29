import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useVehicles, Vehicle } from '../../context/VehicleContext';

const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid'] as const;
const fuelLabels: Record<string, string> = {
  gasoline: 'Essence',
  diesel: 'Diesel',
  electric: 'Électrique',
  hybrid: 'Hybride',
};

const AddVehicleScreen: React.FC = () => {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams();
  const { vehicles, addVehicle, updateVehicle } = useVehicles();
  const editVehicle = vehicles.find(v => v.id === vehicleId);
  const isEdit = !!editVehicle;

  const [brand, setBrand] = useState(editVehicle?.brand ?? '');
  const [model, setModel] = useState(editVehicle?.model ?? '');
  const [year, setYear] = useState(editVehicle?.year?.toString() ?? '');
  const [plate, setPlate] = useState(editVehicle?.plate ?? '');
  const [vin, setVin] = useState(editVehicle?.vin ?? '');
  const [mileage, setMileage] = useState(editVehicle?.mileage?.toString() ?? '');
  const [fuelType, setFuelType] = useState<string>(editVehicle?.fuelType ?? 'gasoline');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!brand.trim()) e.brand = 'Marque requise';
    if (!model.trim()) e.model = 'Modèle requis';
    if (!year || isNaN(Number(year)) || Number(year) < 1950 || Number(year) > new Date().getFullYear() + 1) {
      e.year = 'Année invalide';
    }
    if (!plate.trim()) e.plate = 'Plaque requise';
    if (!mileage || isNaN(Number(mileage)) || Number(mileage) < 0) {
      e.mileage = 'Kilométrage invalide';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        brand,
        model,
        year: Number(year),
        plate,
        vin,
        mileage: Number(mileage),
        fuelType: fuelType as any,
      };

      if (isEdit) {
        await updateVehicle(editVehicle.id, data);
      } else {
        await addVehicle(data);
      }
      router.back();
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de sauvegarder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <Text style={styles.sectionTitle}>Informations du véhicule</Text>

        <Input label="Marque" placeholder="ex: Dacia, Renault..." value={brand} onChangeText={setBrand}
          icon="car-sport-outline" error={errors.brand} />
        <Input label="Modèle" placeholder="ex: Duster, Clio..." value={model} onChangeText={setModel}
          icon="car-outline" error={errors.model} />
        <Input label="Année" placeholder="ex: 2021" value={year} onChangeText={setYear}
          icon="calendar-outline" keyboardType="numeric" error={errors.year} />
        <Input label="Plaque d'immatriculation" placeholder="ex: A-12345-7" value={plate}
          onChangeText={setPlate} icon="id-card-outline" autoCapitalize="characters" error={errors.plate} />
        <Input label="VIN (optionnel)" placeholder="ex: VF1RFCD1H58120347" value={vin}
          onChangeText={setVin} icon="barcode-outline" autoCapitalize="characters" />
        <Input label="Kilométrage actuel" placeholder="ex: 45000" value={mileage}
          onChangeText={setMileage} icon="speedometer-outline" keyboardType="numeric" error={errors.mileage} />

        <Text style={styles.fuelLabel}>Type de carburant</Text>
        <View style={styles.fuelGrid}>
          {fuelTypes.map((ft) => (
            <Button
              key={ft}
              title={fuelLabels[ft]}
              onPress={() => setFuelType(ft)}
              type={fuelType === ft ? 'primary' : 'secondary'}
              style={styles.fuelBtn}
              textStyle={{ fontSize: typography.sm }}
            />
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Annuler"
          onPress={() => router.back()}
          type="ghost"
          style={{ flex: 1 }}
        />
        <Button
          title={isEdit ? 'Modifier' : 'Ajouter'}
          onPress={handleSubmit}
          loading={loading}
          style={{ flex: 2 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, gap: spacing.base },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  fuelLabel: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  fuelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fuelBtn: { flex: 1, minWidth: '45%', minHeight: 42 },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
});

export default AddVehicleScreen;
