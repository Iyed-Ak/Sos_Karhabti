import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';

// ── Mock Data ─────────────────────────────────────────────────────────────────

type Category = 'vidange' | 'pneus' | 'reparation' | 'sos';

interface Expense {
  id: string;
  category: Category;
  description: string;
  date: string;
  amount: number;
  vehicle: string;
}

const MOCK_EXPENSES: Expense[] = [
  { id: '1', category: 'vidange',    description: 'Vidange huile moteur',       date: '2026-03-28', amount: 1800, vehicle: 'Dacia Logan' },
  { id: '2', category: 'sos',        description: 'Mission dépannage panne moteur', date: '2026-03-22', amount: 3200, vehicle: 'Dacia Logan' },
  { id: '3', category: 'pneus',      description: 'Remplacement pneu avant droit', date: '2026-03-18', amount: 4500, vehicle: 'Renault Clio' },
  { id: '4', category: 'reparation', description: 'Remplacement plaquettes frein',  date: '2026-03-10', amount: 2800, vehicle: 'Dacia Logan' },
  { id: '5', category: 'vidange',    description: 'Vidange boîte de vitesses',   date: '2026-02-25', amount: 2200, vehicle: 'Renault Clio' },
  { id: '6', category: 'reparation', description: 'Réparation climatisation',   date: '2026-02-14', amount: 5500, vehicle: 'Dacia Logan' },
  { id: '7', category: 'pneus',      description: 'Équilibrage 4 pneus',         date: '2026-01-30', amount: 800,  vehicle: 'Renault Clio' },
  { id: '8', category: 'sos',        description: 'Mission crevaison autoroute', date: '2026-01-15', amount: 1500, vehicle: 'Dacia Logan' },
];

const CATEGORY_META: Record<Category, { label: string; icon: string; color: string; bg: string }> = {
  vidange:    { label: 'Vidanges',       icon: '🛢️', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  pneus:      { label: 'Pneus',          icon: '🛞', color: '#3DD68C', bg: 'rgba(61,214,140,0.12)' },
  reparation: { label: 'Réparations',    icon: '🔧', color: '#4D9FFF', bg: 'rgba(77,159,255,0.12)' },
  sos:        { label: 'Missions SOS',   icon: '🚨', color: '#FF4D6D', bg: 'rgba(255,77,109,0.12)' },
};

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const FULL_MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

// ── Helper ────────────────────────────────────────────────────────────────────

function formatAmount(n: number) {
  return n.toLocaleString('fr-DZ') + ' DA';
}

function parseMonth(date: string) {
  return parseInt(date.split('-')[1]) - 1; // 0-indexed
}

// ── Component ─────────────────────────────────────────────────────────────────

const ExpensesScreen: React.FC = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(2); // March = index 2

  const filteredExpenses = MOCK_EXPENSES.filter(
    (e) => parseMonth(e.date) === selectedMonth
  );

  // Category totals
  const totals: Record<Category, number> = { vidange: 0, pneus: 0, reparation: 0, sos: 0 };
  filteredExpenses.forEach((e) => { totals[e.category] += e.amount; });
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${FULL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💰 Mes Dépenses</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ── Month Selector ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsRow}
        >
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={m}
              style={[styles.monthPill, selectedMonth === i && styles.monthPillActive]}
              onPress={() => setSelectedMonth(i)}
            >
              <Text style={[styles.monthText, selectedMonth === i && styles.monthTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Total Card ── */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total {FULL_MONTHS[selectedMonth]}</Text>
          <Text style={styles.totalAmount}>{formatAmount(grandTotal)}</Text>
          <Text style={styles.totalSub}>{filteredExpenses.length} dépense(s)</Text>
        </View>

        {/* ── Section 1: Répartition ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>① Répartition par catégorie</Text>
          {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            const amount = totals[cat];
            const pct = grandTotal > 0 ? amount / grandTotal : 0;
            return (
              <View key={cat} style={styles.catCard}>
                <View style={[styles.catIconBox, { backgroundColor: meta.bg }]}>
                  <Text style={styles.catEmoji}>{meta.icon}</Text>
                </View>
                <View style={styles.catInfo}>
                  <View style={styles.catRow}>
                    <Text style={styles.catLabel}>{meta.label}</Text>
                    <Text style={[styles.catAmount, { color: meta.color }]}>
                      {formatAmount(amount)}
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.round(pct * 100)}%` as any, backgroundColor: meta.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.catPct}>
                    {grandTotal > 0 ? Math.round(pct * 100) : 0}% du total
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Section 2: Historique ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>② Historique des dépenses</Text>
          {filteredExpenses.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={styles.emptyText}>Aucune dépense ce mois-ci</Text>
            </View>
          ) : (
            filteredExpenses
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((expense) => {
                const meta = CATEGORY_META[expense.category];
                return (
                  <View key={expense.id} style={styles.histItem}>
                    <View style={[styles.histIcon, { backgroundColor: meta.bg }]}>
                      <Text style={styles.histEmoji}>{meta.icon}</Text>
                    </View>
                    <View style={styles.histInfo}>
                      <Text style={styles.histDesc} numberOfLines={1}>
                        {expense.description}
                      </Text>
                      <View style={styles.histMeta}>
                        <Text style={styles.histDate}>{formatDate(expense.date)}</Text>
                        <Text style={styles.histDot}>·</Text>
                        <Text style={styles.histVehicle}>{expense.vehicle}</Text>
                      </View>
                    </View>
                    <Text style={[styles.histAmount, { color: meta.color }]}>
                      {formatAmount(expense.amount)}
                    </Text>
                  </View>
                );
              })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  scroll: { flex: 1 },

  // Month Selector
  monthsRow: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  monthPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthText: { fontSize: typography.xs, color: colors.textSecondary, fontWeight: typography.medium },
  monthTextActive: { color: colors.textInverse, fontWeight: typography.bold },

  // Total Card
  totalCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  totalLabel: { fontSize: typography.sm, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  totalAmount: { fontSize: 32, fontWeight: typography.bold, color: colors.textInverse },
  totalSub: { fontSize: typography.xs, color: 'rgba(255,255,255,0.5)', marginTop: 4 },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },

  // Category Cards
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadow.sm,
  },
  catIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catEmoji: { fontSize: 22 },
  catInfo: { flex: 1 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catLabel: { fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary },
  catAmount: { fontSize: typography.sm, fontWeight: typography.bold },
  barTrack: { height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 5, borderRadius: 3 },
  catPct: { fontSize: 10, color: colors.textTertiary, marginTop: 4 },

  // History items
  histItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  histIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  histEmoji: { fontSize: 18 },
  histInfo: { flex: 1 },
  histDesc: { fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary },
  histMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  histDate: { fontSize: typography.xs, color: colors.textTertiary },
  histDot: { fontSize: typography.xs, color: colors.textTertiary },
  histVehicle: { fontSize: typography.xs, color: colors.textSecondary },
  histAmount: { fontSize: typography.sm, fontWeight: typography.bold },

  // Empty
  empty: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sm, color: colors.textTertiary },
});

export default ExpensesScreen;
