import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius, shadow, spacing } from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = spacing.base,
  noPadding = false,
}) => {
  return (
    <View
      style={[
        styles.card,
        { padding: noPadding ? 0 : padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
});

export default Card;
