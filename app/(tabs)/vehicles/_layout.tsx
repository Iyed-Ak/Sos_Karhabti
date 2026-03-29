import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';

export default function VehiclesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: typography.semibold as any },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Mes véhicules' }}
      />
      <Stack.Screen
        name="add"
        options={{ title: 'Véhicule', presentation: 'modal' }}
      />
    </Stack>
  );
}
