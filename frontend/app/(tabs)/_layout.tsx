import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { radius } from '../../src/theme/spacing';

const SOSTabButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: (e: any) => void;
}) => (
  <TouchableOpacity style={styles.sosTabBtn} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.sosTabInner}>{children}</View>
  </TouchableOpacity>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: typography.semibold as any,
          fontSize: typography.md,
          color: colors.textPrimary,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '≡ SmartSOS',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          headerShown: false,
          tabBarLabel: 'Véhicules',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'car' : 'car-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'Assistance SOS',
          headerStyle: { backgroundColor: '#1A0A14' },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' as any, color: colors.danger },
          tabBarLabel: 'SOS',
          tabBarIcon: () => (
            <Ionicons name="alert-circle" size={30} color={colors.textInverse} />
          ),
          tabBarButton: (props) => <SOSTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Entretiens',
          tabBarLabel: 'Entretien',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'construct' : 'construct-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Diagnostic IA',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'Mon Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{ href: null, title: '💰 Mes Dépenses', headerShown: false }}
      />
      <Tabs.Screen
        name="planning"
        options={{ href: null, title: '📅 Planification', headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 0,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
  },
  sosTabBtn: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTabInner: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
