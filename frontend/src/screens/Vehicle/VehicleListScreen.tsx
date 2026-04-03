import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import Button from '../../components/Button';
import { useVehicles, Vehicle } from '../../context/VehicleContext';

const fuelLabels: Record<string, string> = {
  gasoline: 'Essence',
  diesel: 'Diesel',
  electric: 'Électrique',
  hybrid: 'Hybride',
};

const VehicleListScreen: React.FC = () => {
  const router = useRouter();
  const { vehicles, selectedVehicle, setSelectedVehicle, removeVehicle } = useVehicles();

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert(
      'Supprimer le véhicule',
      `Êtes-vous sûr de vouloir supprimer ${vehicle.brand} ${vehicle.model} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => removeVehicle(vehicle.id),
        },
      ]
    );
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => {
    const isSelected = selectedVehicle?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
        onPress={() => setSelectedVehicle(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.vehicleIcon, { backgroundColor: item.color ?? colors.primaryLight + '30' }]}>
            <Text style={{ fontSize: 26 }}>🚗</Text>
          </View>
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleNameRow}>
              <Text style={styles.vehicleName}>{item.brand} {item.model}</Text>
              {isSelected && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Principal</Text>
                </View>
              )}
            </View>
            <Text style={styles.vehiclePlate}>{item.plate}</Text>
            <View style={styles.vehicleMeta}>
              <Ionicons name="speedometer-outline" size={12} color={colors.textTertiary} />
              <Text style={styles.vehicleMetaText}>{item.mileage.toLocaleString()} km</Text>
              <Text style={styles.vehicleMetaSep}>·</Text>
              <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
              <Text style={styles.vehicleMetaText}>{item.year}</Text>
              {item.fuelType && (
                <>
                  <Text style={styles.vehicleMetaSep}>·</Text>
                  <Text style={styles.vehicleMetaText}>{fuelLabels[item.fuelType]}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push({ pathname: '/(tabs)/vehicles/add', params: { vehicleId: item.id } })}
          >
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        renderItem={renderVehicle}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 64 }}>🚗</Text>
            <Text style={styles.emptyTitle}>Aucun véhicule</Text>
            <Text style={styles.emptySubtitle}>Ajoutez votre premier véhicule pour commencer</Text>
          </View>
        }
        ListHeaderComponent={
          <Button
            title="+ Ajouter un véhicule"
            onPress={() => router.push('/(tabs)/vehicles/add')}
            type="secondary"
            fullWidth
            style={{ marginBottom: spacing.base }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  vehicleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  vehicleCardSelected: {
    borderColor: colors.primary,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  vehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: { flex: 1 },
  vehicleNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  vehicleName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  activeBadge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  activeBadgeText: { fontSize: 10, color: colors.primary, fontWeight: typography.semibold },
  vehiclePlate: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  vehicleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
    flexWrap: 'wrap',
  },
  vehicleMetaText: { fontSize: typography.xs, color: colors.textTertiary },
  vehicleMetaSep: { fontSize: typography.xs, color: colors.textTertiary },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
  emptyTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: colors.textPrimary },
  emptySubtitle: { fontSize: typography.sm, color: colors.textSecondary, textAlign: 'center' },
});

export default VehicleListScreen;
