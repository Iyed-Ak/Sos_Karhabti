import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({ width, height, style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius: radius.md, backgroundColor: colors.border },
        { opacity: anim },
        style,
      ]}
    />
  );
};

/** Skeleton version of the vehicle hero card */
export const VehicleCardSkeleton: React.FC = () => (
  <View style={skeleton.card}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
        <SkeletonBox width={48} height={48} style={{ borderRadius: radius.full }} />
        <View style={{ gap: 6 }}>
          <SkeletonBox width={120} height={14} />
          <SkeletonBox width={80} height={10} />
        </View>
      </View>
      <SkeletonBox width={70} height={24} style={{ borderRadius: radius.full }} />
    </View>
    <SkeletonBox width={160} height={32} style={{ marginTop: spacing.md }} />
    <View style={{ marginTop: spacing.md, gap: 8 }}>
      <SkeletonBox width="100%" height={6} style={{ borderRadius: radius.full }} />
    </View>
  </View>
);

/** Generic row skeleton */
export const RowSkeleton: React.FC = () => (
  <View style={skeleton.row}>
    <SkeletonBox width={40} height={40} style={{ borderRadius: radius.md }} />
    <View style={{ flex: 1, gap: 8, marginLeft: spacing.md }}>
      <SkeletonBox width="70%" height={12} />
      <SkeletonBox width="50%" height={10} />
    </View>
  </View>
);

const skeleton = StyleSheet.create({
  card: {
    marginHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    height: 220,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
});
