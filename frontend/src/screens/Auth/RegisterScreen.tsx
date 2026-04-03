import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirm: '' });

  const validate = () => {
    let valid = true;
    const e = { name: '', email: '', password: '', confirm: '' };

    if (!name || name.trim().length < 2) {
      e.name = 'Nom trop court (min. 2 caractères)';
      valid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      e.email = 'Adresse email invalide';
      valid = false;
    }
    if (!password || password.length < 6) {
      e.password = 'Mot de passe trop court (min. 6 caractères)';
      valid = false;
    }
    if (password !== confirmPassword) {
      e.confirm = 'Les mots de passe ne correspondent pas';
      valid = false;
    }
    setErrors(e);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register(name, email, password);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de créer le compte');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </View>
          <Text style={styles.appName}>SmartSOS</Text>
          <Text style={styles.tagline}>Créez votre compte gratuitement</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inscription</Text>

          <Input
            label="Nom complet"
            placeholder="Ahmed Benali"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />

          <Input
            label="Adresse email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            placeholder="Min. 6 caractères"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
          />

          <Input
            label="Confirmer le mot de passe"
            placeholder="Répétez le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon="shield-checkmark-outline"
            secureTextEntry
            error={errors.confirm}
          />

          <Button
            title="Créer mon compte"
            onPress={handleRegister}
            fullWidth
            loading={isLoading}
            style={{ marginTop: spacing.sm }}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.8}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    justifyContent: 'center',
  },
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '20',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: { fontSize: 32 },
  appName: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.lg,
  },
  cardTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: typography.semibold,
  },
});

export default RegisterScreen;
