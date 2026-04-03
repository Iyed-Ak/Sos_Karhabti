import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import { Vehicle, useVehicles } from '../../context/VehicleContext';
import { useHealth } from '../../hooks/useHealth';

const HealthScreen: React.FC = () => {
  const router = useRouter();
  const { selectedVehicle } = useVehicles();
  const { globalScore: score, globalStatus, indicators: systems, isLoading } = useHealth(selectedVehicle);

  // Planning choice modal state
  const [showPlanModal, setShowPlanModal] = React.useState(false);
  const [planningContext, setPlanningContext] = React.useState('');

  const openPlanModal = (systemLabel: string) => {
    setPlanningContext(systemLabel);
    setShowPlanModal(true);
  };

  if (!selectedVehicle) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="car-outline" size={48} color={colors.textTertiary} />
        <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Aucun véhicule sélectionné</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const STATUS_COLOR: Record<string, string> = {
    ok: colors.success,
    warn: colors.warning,
    critical: colors.danger,
  };

  const STATUS_LABEL: Record<string, string> = {
    ok: 'Excellent',
    warn: 'À surveiller',
    critical: 'Action requise',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rapport de Santé</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Score */}
        <View style={styles.heroScore}>
          <View style={[styles.scoreRing, { borderColor: STATUS_COLOR[globalStatus] }]}>
            <Text style={[styles.scoreValue, { color: STATUS_COLOR[globalStatus] }]}>{score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <Text style={styles.vehicleName}>{selectedVehicle.brand} {selectedVehicle.model}</Text>
          <Text style={styles.vehicleMeta}>{selectedVehicle.plate} • {selectedVehicle.mileage.toLocaleString()} km</Text>

          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[globalStatus] + '20' }]}>
            <Text style={[styles.statusText, { color: STATUS_COLOR[globalStatus] }]}>
              {globalStatus === 'ok' ? 'Système Sain' : globalStatus === 'warn' ? 'Révision Conseillée' : 'Intervention Critique'}
            </Text>
          </View>
        </View>

        {/* Detailed Systems List */}
        <Text style={styles.sectionTitle}>Analyse par système</Text>

        {systems.map(sys => (
          <View key={sys.key} style={styles.sysCard}>
            <View style={styles.sysHeader}>
              <View style={[styles.sysIconWrap, { backgroundColor: STATUS_COLOR[sys.status] + '20' }]}>
                <Ionicons name={(sys.icon + '-outline') as any} size={20} color={STATUS_COLOR[sys.status]} />
              </View>
              <View style={styles.sysTitleCol}>
                <Text style={styles.sysLabel}>{sys.label}</Text>
                <Text style={[styles.sysStatus, { color: STATUS_COLOR[sys.status] }]}>{STATUS_LABEL[sys.status]}</Text>
              </View>
              <Text style={styles.sysPct}>{sys.healthPct}%</Text>
            </View>

            {/* Custom progress bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${sys.healthPct}%`, backgroundColor: STATUS_COLOR[sys.status] }]} />
            </View>

            <Text style={styles.sysDesc}>{sys.desc}</Text>

            {sys.status !== 'ok' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openPlanModal(sys.label)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                <Text style={styles.actionBtnText}>Planifier un entretien</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Planning Choice Modal ── */}
      <Modal
        visible={showPlanModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={planModal.overlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowPlanModal(false)} />
          <View style={planModal.sheet}>
            {/* Header */}
            <View style={planModal.handle} />
            <Text style={planModal.title}>📅 Planifier un entretien</Text>
            {planningContext ? (
              <Text style={planModal.subtitle}>Système concerné : {planningContext}</Text>
            ) : null}

            <Text style={planModal.hint}>Comment souhaitez-vous planifier ?</Text>

            {/* Option 1 — Par kilométrage */}
            <TouchableOpacity
              style={planModal.optionCard}
              activeOpacity={0.85}
              onPress={() => {
                setShowPlanModal(false);
                router.push('/(tabs)/maintenance' as any);
              }}
            >
              <View style={[planModal.optionIcon, { backgroundColor: 'rgba(77,159,255,0.15)' }]}>
                <Text style={planModal.optionEmoji}>📏</Text>
              </View>
              <View style={planModal.optionInfo}>
                <Text style={planModal.optionTitle}>Par kilométrage</Text>
                <Text style={planModal.optionDesc}>
                  Définir un seuil de km pour déclencher l'entretien automatiquement
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            {/* Option 2 — Par date / calendrier */}
            <TouchableOpacity
              style={planModal.optionCard}
              activeOpacity={0.85}
              onPress={() => {
                setShowPlanModal(false);
                router.push('/(tabs)/planning' as any);
              }}
            >
              <View style={[planModal.optionIcon, { backgroundColor: 'rgba(61,214,140,0.15)' }]}>
                <Text style={planModal.optionEmoji}>📅</Text>
              </View>
              <View style={planModal.optionInfo}>
                <Text style={planModal.optionTitle}>Par date (calendrier)</Text>
                <Text style={planModal.optionDesc}>
                  Choisir un jour précis sur le calendrier pour planifier l'entretien
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={planModal.cancelBtn} onPress={() => setShowPlanModal(false)}>
              <Text style={planModal.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.base,
  },
  heroScore: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadow.lg,
  },
  scoreRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceSecondary,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: typography.extrabold,
    lineHeight: 48,
  },
  scoreMax: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: -4,
  },
  vehicleName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  vehicleMeta: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sysCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sysIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sysTitleCol: {
    flex: 1,
  },
  sysLabel: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  sysStatus: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    marginTop: 2,
  },
  sysPct: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  sysDesc: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.primary + '15',
  },
  actionBtnText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
});

// ── Planning Modal Styles ─────────────────────────────────────────────────────

const planModal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,12,22,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.base,
    paddingBottom: 36,
    paddingTop: spacing.sm,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.primary,
    marginBottom: spacing.base,
    fontWeight: typography.medium,
  },
  hint: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIcon: {
    width: 52, height: 52, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  optionEmoji: { fontSize: 26 },
  optionInfo: { flex: 1 },
  optionTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  cancelBtn: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});

export default HealthScreen;
