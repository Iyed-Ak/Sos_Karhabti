import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

type AlertType = 'warning' | 'info' | 'danger' | 'success';

interface AlertCardProps {
  title: string;
  message: string;
  type?: AlertType;
}

const alertConfig: Record<AlertType, {
  bg: string;
  border: string;
  textColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}> = {
  warning: {
    bg: colors.warningLight,
    border: colors.warning,
    textColor: '#92400E',
    icon: 'warning-outline',
    iconColor: colors.warning,
  },
  info: {
    bg: colors.infoLight,
    border: colors.info,
    textColor: '#1E40AF',
    icon: 'information-circle-outline',
    iconColor: colors.info,
  },
  danger: {
    bg: colors.dangerLight,
    border: colors.danger,
    textColor: colors.dangerDark,
    icon: 'alert-circle-outline',
    iconColor: colors.danger,
  },
  success: {
    bg: colors.successLight,
    border: colors.success,
    textColor: '#166534',
    icon: 'checkmark-circle-outline',
    iconColor: colors.success,
  },
};

const AlertCard: React.FC<AlertCardProps> = ({
  title,
  message,
  type = 'info',
}) => {
  const config = alertConfig[type];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderLeftColor: config.border },
      ]}
    >
      <Ionicons name={config.icon} size={20} color={config.iconColor} style={styles.icon} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: config.textColor }]}>{title}</Text>
        <Text style={[styles.message, { color: config.textColor }]}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    marginBottom: 2,
  },
  message: {
    fontSize: typography.xs,
    lineHeight: 18,
  },
});

export default AlertCard;
