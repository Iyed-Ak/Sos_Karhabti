import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius, shadow } from '../theme/spacing';
import { useHealth } from '../hooks/useHealth';
import { Vehicle } from '../context/VehicleContext';

interface Props {
  vehicle: Vehicle | null;
  onPress?: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  ok:       colors.success,
  warn:     colors.warning,
  critical: colors.danger,
};

const STATUS_BG: Record<string, string> = {
  ok:       colors.successLight,
  warn:     colors.warningLight,
  critical: colors.dangerLight,
};

const STATUS_LABEL: Record<string, string> = {
  ok:       'Bon état',
  warn:     'Attention',
  critical: 'Critique',
};

const SCORE_COLOR = (s: number) =>
  s >= 80 ? colors.success : s >= 50 ? colors.warning : colors.danger;

/** Circular progress ring (SVG-less, pure RN trick) */
function ScoreRing({ score }: { score: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const color = SCORE_COLOR(score);

  return (
    <View style={ring.container}>
      {/* Background ring */}
      <View style={[ring.bgRing, { borderColor: colors.borderLight }]} />
      {/* Score text */}
      <View style={ring.center}>
        <Text style={[ring.scoreText, { color }]}>{score}</Text>
        <Text style={ring.outOf}>/100</Text>
      </View>
    </View>
  );
}

const VehicleHealthCard: React.FC<Props> = ({ vehicle, onPress }) => {
  const { globalScore, globalStatus, indicators, isLoading } = useHealth(vehicle);

  if (!vehicle) return null;

  if (isLoading) {
    return (
      <View style={[styles.card, { alignItems: 'center', justifyContent: 'center', height: 180 }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.dangerLight }]}>
            <Text style={{ fontSize: 16 }}>❤️</Text>
          </View>
          <View>
            <Text style={styles.title}>Santé du véhicule</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[globalStatus] }]}>
              <Text style={[styles.statusText, { color: STATUS_COLOR[globalStatus] }]}>
                {STATUS_LABEL[globalStatus]}
              </Text>
            </View>
          </View>
        </View>
        <ScoreRing score={globalScore} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Indicators */}
      <View style={styles.indicators}>
        {indicators.map((ind) => (
          <View key={ind.key} style={styles.indicator}>
            <View
              style={[styles.indIconWrap, { backgroundColor: STATUS_BG[ind.status] }]}
            >
              <Ionicons name={(ind.icon + '-outline') as any} size={16} color={STATUS_COLOR[ind.status]} />
            </View>
            <Text style={styles.indLabel}>{ind.label}</Text>
            <Ionicons
              name={ind.status === 'ok' ? 'checkmark-circle' : 'alert-circle'}
              size={14}
              color={STATUS_COLOR[ind.status]}
            />
          </View>
        ))}
      </View>

      {/* Footer tap hint */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Voir le rapport complet</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const RING = 72;

const ring = StyleSheet.create({
  container: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgRing: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 6,
  },
  center: { alignItems: 'center' },
  scoreText: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    lineHeight: typography.xl + 2,
  },
  outOf: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.base,
    ...shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: 4,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicator: {
    alignItems: 'center',
    gap: 4,
  },
  indIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: 4,
  },
  footerText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
});

export default VehicleHealthCard;
