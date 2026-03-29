import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius, shadow } from '../theme/spacing';
import { Vehicle } from '../context/VehicleContext';
import { FUEL_BADGE, VehicleKpi } from '../hooks/useVehicle';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_H = 220;

interface Props {
  vehicles: Vehicle[];
  activeIndex: number;
  kpi: VehicleKpi | null;
  onCarouselChange: (index: number) => void;
  onPress: () => void;
  onEditMileage?: () => void;
}

/** Animated mileage counter 0 → target */
function AnimatedCounter({ target }: { target: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: target,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => anim.removeListener(id);
  }, [target]);

  return (
    <Text style={styles.mileageValue}>{display.toLocaleString()}</Text>
  );
}

const VehicleHeroCard: React.FC<Props> = ({
  vehicles,
  activeIndex,
  kpi,
  onCarouselChange,
  onPress,
  onEditMileage,
}) => {
  const flatRef = useRef<FlatList<Vehicle>>(null);

  const handleViewable = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        onCarouselChange(viewableItems[0].index!);
      }
    }
  ).current;

  const renderItem = ({ item }: { item: Vehicle }) => {
    const badge = FUEL_BADGE[item.fuelType ?? 'gasoline'] ?? FUEL_BADGE.gasoline;
    const v = item;

    // km bar width percentage (capped 0–100)
    const pct = kpi ? Math.min(1, kpi.serviceProgressPct) : 0;
    const kmLeft = kpi ? kpi.kmToNextService : 0;
    const kmTotal = kpi ? kpi.nextServiceKm - kpi.lastServiceKm : 10_000;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleEmoji}>🚗</Text>
            <View>
              <Text style={styles.vehicleName}>
                {v.brand} {v.model}
              </Text>
              <Text style={styles.vehiclePlate}>{v.plate}</Text>
            </View>
          </View>
          {/* Fuel Badge */}
          <View style={[styles.fuelBadge, { backgroundColor: badge.bg }]}>
            <Text style={styles.fuelEmoji}>{badge.emoji}</Text>
            <Text style={[styles.fuelLabel, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* Mileage Counter */}
        <View style={styles.mileageRow}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <AnimatedCounter target={v.mileage} />
            <Text style={styles.mileageUnit}> km</Text>
          </View>
          {onEditMileage && (
            <TouchableOpacity onPress={onEditMileage} style={styles.editBtn}>
              <Ionicons name="pencil" size={16} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Service Progress Bar */}
        <View style={styles.serviceSection}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceLabel}>Prochain entretien</Text>
            <Text style={styles.serviceValue}>
              {kmLeft.toLocaleString()} km restants
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
          </View>
          <Text style={styles.serviceHint}>
            à {kpi?.nextServiceKm.toLocaleString() ?? '—'} km
          </Text>
        </View>

        {/* Year chip */}
        <View style={styles.yearChip}>
          <Text style={styles.yearText}>{v.year}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!vehicles.length) {
    return (
      <TouchableOpacity style={styles.emptyCard} onPress={onPress}>
        <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
        <Text style={styles.emptyText}>Ajouter votre premier véhicule</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={vehicles}
        keyExtractor={(v) => v.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        contentContainerStyle={{ paddingHorizontal: spacing.base }}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
      />

      {/* Dot indicators */}
      {vehicles.length > 1 && (
        <View style={styles.dots}>
          {vehicles.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const CARD_W = SCREEN_W - spacing.base * 2;

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: colors.primary,
    borderRadius: radius['2xl'],
    padding: spacing.base,
    justifyContent: 'space-between',
    ...shadow.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  vehicleEmoji: { fontSize: 38 },
  vehicleName: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textInverse,
  },
  vehiclePlate: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    letterSpacing: 1,
  },
  fuelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  fuelEmoji: { fontSize: 12 },
  fuelLabel: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
  mileageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mileageValue: {
    fontSize: typography['3xl'],
    fontWeight: typography.extrabold,
    color: colors.textInverse,
    letterSpacing: -1,
  },
  mileageUnit: {
    fontSize: typography.md,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
    fontWeight: typography.medium,
  },
  serviceSection: {},
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.75)',
  },
  serviceValue: {
    fontSize: typography.xs,
    color: colors.textInverse,
    fontWeight: typography.semibold,
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
  },
  serviceHint: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'right',
    marginTop: 4,
  },
  yearChip: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base + 70,
    display: 'none', // hidden, just metadata
  },
  yearText: { fontSize: typography.xs, color: colors.textInverse },
  // empty state
  emptyCard: {
    marginHorizontal: spacing.base,
    height: 130,
    backgroundColor: colors.infoLight,
    borderRadius: radius['2xl'],
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.primary,
  },
  // dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});

export default VehicleHeroCard;
