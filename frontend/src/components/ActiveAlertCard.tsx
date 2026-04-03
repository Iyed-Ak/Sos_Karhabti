import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius, shadow } from '../theme/spacing';
import { Alert, AlertLevel, relativeDate } from '../hooks/useAlerts';

interface Props {
  alert: Alert;
  onDismiss: (id: string) => void;
  onDetail?: (id: string) => void;
}

const LEVEL_CONFIG: Record<AlertLevel, {
  bg: string; border: string; badge: string; badgeBg: string;
  icon: keyof typeof Ionicons.glyphMap; iconColor: string; label: string;
}> = {
  danger: {
    bg: colors.dangerLight,
    border: colors.danger,
    badge: colors.danger,
    badgeBg: '#FFE4E4',
    icon: 'alert-circle-outline',
    iconColor: colors.danger,
    label: 'Urgent',
  },
  warning: {
    bg: colors.warningLight,
    border: colors.warning,
    badge: colors.warning,
    badgeBg: '#FEF3C7',
    icon: 'warning-outline',
    iconColor: colors.warning,
    label: 'Moyen',
  },
  info: {
    bg: colors.infoLight,
    border: colors.info,
    badge: colors.info,
    badgeBg: '#EFF6FF',
    icon: 'information-circle-outline',
    iconColor: colors.info,
    label: 'Info',
  },
};

const SWIPE_THRESHOLD = 80;

const ActiveAlertCard: React.FC<Props> = ({ alert, onDismiss, onDetail }) => {
  const cfg = LEVEL_CONFIG[alert.level];
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const dismissWithAnim = (id: string) => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: -400, duration: 280, useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 0,    duration: 250, useNativeDriver: true }),
    ]).start(() => onDismiss(id));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 12,
      onPanResponderMove: (_, { dx }) => {
        if (dx < 0) translateX.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -SWIPE_THRESHOLD) {
          dismissWithAnim(alert.id);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      {/* Swipe reveal action */}
      <View style={styles.swipeBg}>
        <Ionicons name="trash-outline" size={22} color={colors.textInverse} />
        <Text style={styles.swipeBgText}>Ignorer</Text>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, { backgroundColor: cfg.bg, borderLeftColor: cfg.border },
          { transform: [{ translateX }], opacity }]}
      >
        {/* Icon + content */}
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: cfg.badgeBg }]}>
            <Ionicons name={cfg.icon} size={20} color={cfg.iconColor} />
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>{alert.title}</Text>
              <View style={[styles.levelBadge, { backgroundColor: cfg.badgeBg }]}>
                <Text style={[styles.levelText, { color: cfg.badge }]}>{cfg.label}</Text>
              </View>
            </View>
            <Text style={styles.desc} numberOfLines={2}>{alert.description}</Text>
            <Text style={styles.date}>{relativeDate(alert.triggeredAt)}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnDetail]}
            onPress={() => onDetail?.(alert.id)}
          >
            <Text style={styles.btnDetailText}>Voir détail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnDismiss]}
            onPress={() => dismissWithAnim(alert.id)}
          >
            <Text style={styles.btnDismissText}>Ignorer</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  swipeBg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 90,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    gap: 4,
  },
  swipeBgText: {
    fontSize: typography.xs,
    color: colors.textInverse,
    fontWeight: typography.medium,
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    ...shadow.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  levelText: {
    fontSize: 10,
    fontWeight: typography.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  desc: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  date: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    justifyContent: 'flex-end',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  btnDetail: {
    backgroundColor: colors.primary,
  },
  btnDetailText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.textInverse,
  },
  btnDismiss: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnDismissText: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    color: colors.textSecondary,
  },
});

export default ActiveAlertCard;
