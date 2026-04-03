import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius, shadow } from '../theme/spacing';

interface Props {
  visible: boolean;
  currentMileage?: number;
  saving: boolean;
  onSubmit: (km: number) => void;
  onSnooze: () => void;
}

const MileageUpdateModal: React.FC<Props> = ({
  visible,
  currentMileage,
  saving,
  onSubmit,
  onSnooze,
}) => {
  const [value, setValue] = useState(currentMileage?.toString() ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const km = parseInt(value.replace(/\s/g, ''), 10);
    if (isNaN(km) || km <= 0) {
      setError('Veuillez saisir un kilométrage valide.');
      return;
    }
    if (currentMileage && km < currentMileage) {
      setError(`Le kilométrage ne peut pas être inférieur à ${currentMileage.toLocaleString()} km.`);
      return;
    }
    setError('');
    onSubmit(km);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 28 }}>🛣️</Text>
          </View>

          <Text style={styles.title}>Mise à jour du kilométrage</Text>
          <Text style={styles.subtitle}>
            Entrez votre kilométrage actuel pour que le système calcule vos prochaines
            interventions (vidange, filtres, etc.) avec précision.
          </Text>

          {/* Current display */}
          {currentMileage ? (
            <View style={styles.currentRow}>
              <Ionicons name="speedometer-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.currentText}>
                Dernier enregistré : {currentMileage.toLocaleString()} km
              </Text>
            </View>
          ) : null}

          {/* Input */}
          <View style={[styles.inputWrap, error ? { borderColor: colors.danger } : {}]}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(t) => { setValue(t); setError(''); }}
              keyboardType="numeric"
              placeholder="Ex: 45 000"
              placeholderTextColor={colors.textTertiary}
            />
            <Text style={styles.unit}>km</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, saving && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Text style={styles.submitText}>Enregistrer</Text>
            )}
          </TouchableOpacity>

          {/* Snooze */}
          <TouchableOpacity style={styles.snoozeBtn} onPress={onSnooze}>
            <Text style={styles.snoozeText}>Ignorer cette semaine</Text>
          </TouchableOpacity>

          {/* Info note */}
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.noteText}>
              Cette information n'est pas obligatoire mais améliore la précision des recommandations.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.lineHeightBase,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  currentText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    marginTop: spacing.base,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  unit: {
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  error: {
    fontSize: typography.xs,
    color: colors.danger,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
  },
  submitText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textInverse,
  },
  snoozeBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  snoozeText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.base,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: typography.xs,
    color: colors.textTertiary,
    lineHeight: 16,
  },
});

export default MileageUpdateModal;
