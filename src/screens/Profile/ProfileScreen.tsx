import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [notifMaintenance, setNotifMaintenance] = useState(true);
  const [notifSOS, setNotifSOS] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    updateUser({ name, phone });
    setEditing(false);
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Conducteur</Text>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Ionicons name="pencil-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <Card>
            <Input label="Nom complet" value={name} onChangeText={setName} icon="person-outline" />
            <Input label="Téléphone" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" />
            <View style={styles.editActions}>
              <Button title="Annuler" type="ghost" onPress={() => setEditing(false)} style={{ flex: 1 }} />
              <Button title="Sauvegarder" onPress={handleSave} loading={loading} style={{ flex: 2 }} />
            </View>
          </Card>
        ) : (
          <Card>
            {[
              { icon: 'person-outline', label: 'Nom', value: user?.name },
              { icon: 'mail-outline', label: 'Email', value: user?.email },
              { icon: 'call-outline', label: 'Téléphone', value: user?.phone || 'Non renseigné' },
            ].map(row => (
              <View key={row.label} style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name={row.icon as any} size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card>
          {[
            {
              label: 'Rappels d\'entretien',
              sub: 'Alertes kilométrage et dates',
              value: notifMaintenance,
              onToggle: setNotifMaintenance,
            },
            {
              label: 'Alertes SOS',
              sub: 'Confirmations et mises à jour',
              value: notifSOS,
              onToggle: setNotifSOS,
            },
          ].map(row => (
            <View key={row.label} style={styles.notifRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifLabel}>{row.label}</Text>
                <Text style={styles.notifSub}>{row.sub}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onToggle}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={row.value ? colors.primary : colors.textTertiary}
              />
            </View>
          ))}
        </Card>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <Card>
          {[
            { icon: 'information-circle-outline', label: 'Version', value: '1.0.0' },
            { icon: 'shield-checkmark-outline', label: 'Conditions d\'utilisation', value: '' },
            { icon: 'lock-closed-outline', label: 'Politique de confidentialité', value: '' },
          ].map(row => (
            <TouchableOpacity key={row.label} style={styles.menuRow}>
              <Ionicons name={row.icon as any} size={20} color={colors.primary} />
              <Text style={styles.menuLabel}>{row.label}</Text>
              <View style={{ flex: 1 }} />
              {row.value ? (
                <Text style={styles.menuValue}>{row.value}</Text>
              ) : (
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <Button
          title="Se déconnecter"
          type="danger"
          onPress={handleLogout}
          fullWidth
        />
      </View>

      <View style={{ height: spacing['2xl'] }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.md,
  },
  avatarText: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textInverse,
  },
  userName: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  roleText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  section: { paddingHorizontal: spacing.base, marginBottom: spacing.base },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: typography.xs, color: colors.textTertiary },
  infoValue: { fontSize: typography.base, fontWeight: typography.medium, color: colors.textPrimary },
  editActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.base,
  },
  notifLabel: { fontSize: typography.base, fontWeight: typography.medium, color: colors.textPrimary },
  notifSub: { fontSize: typography.xs, color: colors.textTertiary, marginTop: 2 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLabel: { fontSize: typography.base, color: colors.textPrimary },
  menuValue: { fontSize: typography.sm, color: colors.textTertiary },
});

export default ProfileScreen;
