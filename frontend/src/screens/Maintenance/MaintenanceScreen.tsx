import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useVehicles } from '../../context/VehicleContext';
import { maintenanceApi } from '../../services/api';

interface MaintenanceEntry {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  mileage: number;
  cost: number;
  notes?: string;
  reminderIntervalKm?: number;
}

const maintenanceTypes = ['Vidange', 'Freins', 'Pneus', 'Batterie', 'Filtres', 'Révision', 'Autre'];


const MaintenanceScreen: React.FC = () => {
  const { vehicles, selectedVehicle, setSelectedVehicle } = useVehicles();
  const [entries, setEntries] = useState<MaintenanceEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [type, setType] = useState('Vidange');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [reminder, setReminder] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedVehicle) loadEntries();
  }, [selectedVehicle]);

  const loadEntries = async () => {
    if (!selectedVehicle) return;
    const data = await maintenanceApi.getAll(selectedVehicle.id);
    setEntries(data as MaintenanceEntry[]);
  };

  const totalCost = useMemo(
    () => entries.reduce((sum, e) => sum + e.cost, 0),
    [entries]
  );

  const resetForm = () => {
    setType('Vidange');
    setDate(new Date().toISOString().split('T')[0]);
    setMileage('');
    setCost('');
    setReminder('');
    setNotes('');
  };

  const openAddModal = () => {
    resetForm();
    if (selectedVehicle?.mileage) {
      setMileage(selectedVehicle.mileage.toString());
    }
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (!selectedVehicle || !mileage || !cost) {
      Alert.alert('Erreur', 'Kilométrage et coût sont requis');
      return;
    }
    setLoading(true);
    try {
      const entry = await maintenanceApi.create({
        vehicleId: selectedVehicle.id,
        type,
        date,
        mileage: Number(mileage),
        cost: Number(cost),
        reminderIntervalKm: reminder ? Number(reminder) : undefined,
        notes,
      });
      setEntries(prev => [entry as MaintenanceEntry, ...prev]);
      setShowModal(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer cet entretien ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await maintenanceApi.delete(id);
          setEntries(prev => prev.filter(e => e.id !== id));
        },
      },
    ]);
  };

  const renderEntry = ({ item }: { item: MaintenanceEntry }) => (
    <Card style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.type}</Text>
        </View>
        <View style={styles.entryActions}>
          <Text style={styles.entryCost}>{item.cost.toLocaleString()} TND</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.entryMeta}>
        <Ionicons name="calendar-outline" size={13} color={colors.textTertiary} />
        <Text style={styles.entryMetaText}>{item.date}</Text>
        <Text style={styles.sep}>·</Text>
        <Ionicons name="speedometer-outline" size={13} color={colors.textTertiary} />
        <Text style={styles.entryMetaText}>{item.mileage.toLocaleString()} km</Text>
        {item.reminderIntervalKm && (
          <>
            <Text style={styles.sep}>·</Text>
            <Ionicons name="notifications-outline" size={13} color={colors.warning} />
            <Text style={[styles.entryMetaText, { color: colors.warning }]}>
              Rappel +{item.reminderIntervalKm.toLocaleString()} km
            </Text>
          </>
        )}
      </View>
      {item.notes ? <Text style={styles.entryNotes}>{item.notes}</Text> : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Vehicle Selector (if multiple) */}
      {vehicles.length > 1 && (
        <View style={styles.vehicleSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {vehicles.map(v => (
              <TouchableOpacity
                key={v.id}
                style={[styles.vehicleTab, selectedVehicle?.id === v.id && styles.vehicleTabActive]}
                onPress={() => setSelectedVehicle(v)}
              >
                <Text style={styles.vehicleTabEmoji}>🚗</Text>
                <Text style={[styles.vehicleTabText, selectedVehicle?.id === v.id && styles.vehicleTabTextActive]}>
                  {v.brand} {v.model}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Summary */}
      <View style={styles.summary}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{entries.length}</Text>
          <Text style={styles.summaryLabel}>Entretiens</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {totalCost.toLocaleString()} TND
          </Text>
          <Text style={styles.summaryLabel}>Coût total</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {selectedVehicle?.mileage.toLocaleString() ?? '—'}
          </Text>
          <Text style={styles.summaryLabel}>km actuels</Text>
        </Card>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🔧</Text>
            <Text style={styles.emptyTitle}>Aucun entretien enregistré</Text>
          </View>
        }
        ListHeaderComponent={
          !selectedVehicle ? (
            <Card style={styles.noVehicle}>
              <Text style={styles.noVehicleText}>
                Sélectionnez un véhicule pour voir ses entretiens
              </Text>
            </Card>
          ) : (
            <Button
              title="+ Ajouter un entretien"
              type="secondary"
              onPress={openAddModal}
              fullWidth
              style={{ marginBottom: spacing.base }}
            />
          )
        }
      />

      {/* Add Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvel entretien</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Picker */}
              <Text style={styles.typeLabel}>Type d'entretien</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.base }}>
                {maintenanceTypes.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, type === t && styles.typeChipActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Input label="Date" placeholder="AAAA-MM-JJ" value={date} onChangeText={setDate} icon="calendar-outline" />
              <Input label="Kilométrage" placeholder="ex: 45000" value={mileage} onChangeText={setMileage}
                icon="speedometer-outline" keyboardType="numeric" />
              <Input label="Coût (TND)" placeholder="ex: 150" value={cost} onChangeText={setCost}
                icon="cash-outline" keyboardType="numeric" />
              <Input label="Rappel dans (km) - Optionnel" placeholder="ex: 10000" value={reminder} onChangeText={setReminder}
                icon="notifications-outline" keyboardType="numeric" />
              <Input label="Notes (optionnel)" placeholder="Détails de l'entretien..." value={notes}
                onChangeText={setNotes} icon="document-text-outline" multiline numberOfLines={3} />

              <Button title="Enregistrer" onPress={handleAdd} fullWidth loading={loading} />
              <View style={{ height: spacing.xl }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  vehicleSelector: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  vehicleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehicleTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  vehicleTabEmoji: {
    marginRight: 6,
    fontSize: typography.sm,
  },
  vehicleTabText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  vehicleTabTextActive: {
    color: colors.textInverse,
    fontWeight: typography.bold,
  },
  summary: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.base,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    gap: 4,
  },
  summaryValue: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  summaryLabel: { fontSize: typography.xs, color: colors.textSecondary },
  list: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
  entryCard: { marginBottom: spacing.md },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  typeBadge: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  typeBadgeText: { fontSize: typography.sm, fontWeight: typography.semibold, color: colors.primary },
  entryActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  entryCost: { fontSize: typography.base, fontWeight: typography.bold, color: colors.textPrimary },
  entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.xs },
  entryMetaText: { fontSize: typography.xs, color: colors.textTertiary },
  sep: { color: colors.textTertiary, fontSize: typography.xs },
  entryNotes: { fontSize: typography.sm, color: colors.textSecondary, marginTop: spacing.xs },
  empty: { alignItems: 'center', paddingVertical: spacing['3xl'], gap: spacing.md },
  emptyTitle: { fontSize: typography.md, color: colors.textSecondary },
  noVehicle: { marginBottom: spacing.base, alignItems: 'center' },
  noVehicleText: { fontSize: typography.sm, color: colors.textSecondary, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  typeLabel: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  typeChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { fontSize: typography.sm, color: colors.textSecondary, fontWeight: typography.medium },
  typeChipTextActive: { color: colors.textInverse },
});

export default MaintenanceScreen;
