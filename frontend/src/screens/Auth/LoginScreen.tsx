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

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('ahmed@smartsos.ma');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Adresse email invalide';
      valid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Mot de passe trop court (min. 6 caractères)';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Erreur de connexion', err.message || 'Identifiants incorrects');
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
        {/* Brand header */}
        <View style={styles.brand}>
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </View>
          <Text style={styles.appName}>SmartSOS</Text>
          <Text style={styles.tagline}>Votre assistant automobile intelligent</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connexion</Text>
          <Text style={styles.cardSub}>Bienvenue ! Connectez-vous pour accéder à votre tableau de bord</Text>

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
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <Button title="Se connecter" onPress={handleLogin} fullWidth loading={isLoading} />

          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>ou</Text>
            <View style={styles.divLine} />
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>

        {/* Demo hint */}
        <View style={styles.demoHint}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.demoText}>Compte démo : ahmed@smartsos.ma</Text>
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
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['2xl'],
    justifyContent: 'center',
  },
  brand: { alignItems: 'center', marginBottom: spacing['2xl'] },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primary + '20',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: typography['2xl'],
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
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
    marginBottom: 4,
  },
  cardSub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  forgotRow: { alignSelf: 'flex-end', marginBottom: spacing.base, marginTop: -spacing.sm },
  forgotText: { fontSize: typography.sm, color: colors.primary, fontWeight: typography.medium },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.base },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divText: {
    paddingHorizontal: spacing.sm,
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  registerBtn: {
    height: 46,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xl,
  },
  demoText: { fontSize: typography.xs, color: colors.textTertiary },
});

export default LoginScreen;
