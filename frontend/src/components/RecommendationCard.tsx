import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import Card from './Card';

type Priority = 'low' | 'medium' | 'high';

interface RecommendationCardProps {
  title: string;
  description: string;
  priority?: Priority;
  kmDue?: number;
  dateDue?: string;
}

const priorityConfig: Record<Priority, {
  label: string;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = {
  low: {
    label: 'Faible',
    color: colors.success,
    bg: colors.successLight,
    icon: 'checkmark-circle',
  },
  medium: {
    label: 'Moyen',
    color: colors.warning,
    bg: colors.warningLight,
    icon: 'time',
  },
  high: {
    label: 'Urgent',
    color: colors.danger,
    bg: colors.dangerLight,
    icon: 'alert-circle',
  },
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  priority = 'medium',
  kmDue,
  dateDue,
}) => {
  const config = priorityConfig[priority];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.priorityBadge, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={14} color={config.color} />
          <Text style={[styles.priorityLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
        {kmDue && (
          <View style={styles.kmBadge}>
            <Ionicons name="speedometer-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.kmText}>{kmDue.toLocaleString()} km</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {dateDue && (
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textTertiary} />
          <Text style={styles.dateText}>Recommandé avant le {dateDue}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  priorityLabel: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
  kmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  kmText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  title: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  dateText: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
});

export default RecommendationCard;
