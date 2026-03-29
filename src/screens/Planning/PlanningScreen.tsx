import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import { useVehicles } from '../../context/VehicleContext';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlanItem {
  id: string;
  day: number;
  month: number;
  year: number;
  type: string;
  emoji: string;
  vehicleId: string;
  vehicleName: string;
  color: string;
  note?: string;
}

// ── Maintenance Types ─────────────────────────────────────────────────────────

const MAINTENANCE_TYPES = [
  { label: 'Vidange huile',          emoji: '🛢️', color: '#F59E0B' },
  { label: 'Changement filtres air', emoji: '💨', color: '#3DD68C' },
  { label: 'Contrôle technique',     emoji: '📋', color: '#4D9FFF' },
  { label: 'Rotation des pneus',     emoji: '🛞', color: '#3DD68C' },
  { label: 'Vidange boîte',          emoji: '⚙️', color: '#F59E0B' },
  { label: 'Vérification freins',    emoji: '🔴', color: '#FF4D6D' },
  { label: 'Nettoyage injecteurs',   emoji: '🔧', color: '#8B5CF6' },
  { label: 'Révision annuelle',      emoji: '📋', color: '#4D9FFF' },
  { label: 'Autre',                  emoji: '🔩', color: '#7FA8CC' },
];

// ── Initial Mock Data ─────────────────────────────────────────────────────────

const INITIAL_PLANNED: PlanItem[] = [
  { id: '1', day: 2,  month: 3, year: 2026, type: 'Rotation des pneus',     emoji: '🛞', vehicleId: 'v1', vehicleName: 'Dacia Logan',   color: '#3DD68C' },
  { id: '2', day: 11, month: 3, year: 2026, type: 'Vidange boîte',          emoji: '⚙️', vehicleId: 'v2', vehicleName: 'Renault Clio',  color: '#F59E0B' },
  { id: '3', day: 22, month: 3, year: 2026, type: 'Vérification freins',    emoji: '🔴', vehicleId: 'v1', vehicleName: 'Dacia Logan',   color: '#FF4D6D', note: 'Suite au bruit perçu' },
  { id: '4', day: 28, month: 3, year: 2026, type: 'Nettoyage injecteurs',   emoji: '🔧', vehicleId: 'v2', vehicleName: 'Renault Clio',  color: '#8B5CF6' },
  { id: '5', day: 8,  month: 4, year: 2026, type: 'Révision annuelle',      emoji: '📋', vehicleId: 'v1', vehicleName: 'Dacia Logan',   color: '#4D9FFF' },
];

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const FULL_MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

// ── Component ─────────────────────────────────────────────────────────────────

const PlanningScreen: React.FC = () => {
  const router = useRouter();
  const { vehicles } = useVehicles();

  const today = new Date();
  const [year, setYear]           = useState(today.getFullYear());
  const [month, setMonth]         = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [planned, setPlanned]     = useState<PlanItem[]>(INITIAL_PLANNED);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formDay, setFormDay]     = useState<number | null>(null);
  const [formType, setFormType]   = useState<typeof MAINTENANCE_TYPES[0] | null>(null);
  const [formVehicleIdx, setFormVehicleIdx] = useState(0);
  const [formNote, setFormNote]   = useState('');

  // Calendar helpers
  const daysInMonth    = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  const monthItems = planned.filter((p) => p.month === month && p.year === year);
  const dayItems   = selectedDay
    ? monthItems.filter((p) => p.day === selectedDay)
    : monthItems;

  const dayColors: Record<number, string[]> = {};
  monthItems.forEach((p) => {
    if (!dayColors[p.day]) dayColors[p.day] = [];
    dayColors[p.day].push(p.color);
  });

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  // ── Open modal ────────────────────────────────────────────────────────────

  const openAddModal = (day?: number) => {
    setFormDay(day ?? selectedDay ?? null);
    setFormType(null);
    setFormVehicleIdx(0);
    setFormNote('');
    setShowModal(true);
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!formDay) {
      Alert.alert('Erreur', 'Veuillez sélectionner un jour sur le calendrier.');
      return;
    }
    if (!formType) {
      Alert.alert('Erreur', 'Veuillez choisir un type d\'entretien.');
      return;
    }

    const vehicle = vehicles.length > 0
      ? vehicles[formVehicleIdx]
      : { id: 'mock', brand: 'Dacia', model: 'Logan' };

    const newItem: PlanItem = {
      id: Date.now().toString(),
      day: formDay,
      month,
      year,
      type: formType.label,
      emoji: formType.emoji,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      color: formType.color,
      note: formNote.trim() || undefined,
    };

    setPlanned((prev) => [...prev, newItem]);
    setSelectedDay(formDay);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer cet entretien planifié ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setPlanned((p) => p.filter((i) => i.id !== id)) },
    ]);
  };

  const formatDate = (item: PlanItem) =>
    `${item.day} ${FULL_MONTHS[item.month]} ${item.year}`;

  // ── Fallback vehicle list for display ─────────────────────────────────────
  const vehicleList = vehicles.length > 0
    ? vehicles
    : [{ id: 'v1', brand: 'Dacia', model: 'Logan' }, { id: 'v2', brand: 'Renault', model: 'Clio' }] as any[];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📅 Planification</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openAddModal()}>
          <Ionicons name="add" size={22} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Calendar Card ── */}
        <View style={styles.calCard}>
          <View style={styles.calNav}>
            <TouchableOpacity style={styles.navBtn} onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.calMonth}>{FULL_MONTHS[month]} {year}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {DAYS_OF_WEEK.map((d, i) => (
              <Text key={i} style={styles.weekLabel}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <View key={`e${i}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = day === selectedDay;
              const dots = dayColors[day] ?? [];
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && !isSelected && styles.dayCellToday,
                  ]}
                  onPress={() => setSelectedDay(isSelected ? null : day)}
                  onLongPress={() => openAddModal(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayNum,
                    isSelected && styles.dayNumSelected,
                    isToday && !isSelected && styles.dayNumToday,
                  ]}>
                    {day}
                  </Text>
                  {dots.length > 0 && (
                    <View style={styles.dotRow}>
                      {dots.slice(0, 3).map((c, di) => (
                        <View key={di} style={[styles.dot, { backgroundColor: c }]} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Entretien planifié</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendToday} />
              <Text style={styles.legendText}>Aujourd'hui</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="hand-left-outline" size={12} color={colors.textTertiary} />
              <Text style={styles.legendText}>Appui long = ajouter</Text>
            </View>
          </View>
        </View>

        {/* ── Planned List ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDay
                ? `📋 ${selectedDay} ${FULL_MONTHS[month]}`
                : `📋 ${FULL_MONTHS[month]} ${year}`}
            </Text>
            <TouchableOpacity style={styles.addRowBtn} onPress={() => openAddModal()}>
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={styles.addRowText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          {dayItems.length === 0 ? (
            <TouchableOpacity style={styles.emptyCard} onPress={() => openAddModal()} activeOpacity={0.8}>
              <Text style={styles.emptyIcon}>{selectedDay ? '✅' : '🗓️'}</Text>
              <Text style={styles.emptyText}>
                {selectedDay ? 'Aucun entretien ce jour' : 'Aucun entretien planifié ce mois'}
              </Text>
              <Text style={styles.emptyHint}>Appuyer pour en ajouter un</Text>
            </TouchableOpacity>
          ) : (
            dayItems
              .sort((a, b) => a.day - b.day)
              .map((item) => (
                <View key={item.id} style={styles.planItem}>
                  <View style={[styles.planIconBox, { backgroundColor: item.color + '22' }]}>
                    <Text style={styles.planEmoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={styles.planType}>{item.type}</Text>
                    <View style={styles.planMeta}>
                      <Ionicons name="calendar-outline" size={11} color={colors.textTertiary} />
                      <Text style={styles.planDate}>{formatDate(item)}</Text>
                      <Text style={styles.planDot}>·</Text>
                      <Ionicons name="car-outline" size={11} color={colors.textTertiary} />
                      <Text style={styles.planVehicle}>{item.vehicleName}</Text>
                    </View>
                    {item.note ? (
                      <Text style={styles.planNote} numberOfLines={1}>💬 {item.note}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              ))
          )}
        </View>

        {/* ── Mes Planifications (all months) ── */}
        {(() => {
          // Sort all planned items chronologically
          const allSorted = [...planned].sort((a, b) => {
            const da = new Date(a.year, a.month, a.day).getTime();
            const db = new Date(b.year, b.month, b.day).getTime();
            return da - db;
          });

          if (allSorted.length === 0) return null;

          // Group by "Month Year"
          const groups: { key: string; label: string; items: typeof allSorted }[] = [];
          allSorted.forEach((item) => {
            const key = `${item.year}-${item.month}`;
            const existing = groups.find((g) => g.key === key);
            if (existing) {
              existing.items.push(item);
            } else {
              groups.push({ key, label: `${FULL_MONTHS[item.month]} ${item.year}`, items: [item] });
            }
          });

          const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

          return (
            <View style={[styles.section, { marginTop: spacing.base }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🗂️ Mes Planifications</Text>
                <Text style={styles.countBadge}>{allSorted.length}</Text>
              </View>

              {groups.map((group) => (
                <View key={group.key}>
                  {/* Month separator */}
                  <View style={styles.groupHeader}>
                    <View style={styles.groupLine} />
                    <Text style={styles.groupLabel}>{group.label}</Text>
                    <View style={styles.groupLine} />
                  </View>

                  {group.items.map((item) => {
                    const itemMs = new Date(item.year, item.month, item.day).getTime();
                    const isPast = itemMs < todayMs;
                    return (
                      <View
                        key={item.id}
                        style={[styles.allPlanItem, isPast && styles.allPlanItemPast]}
                      >
                        <View style={[styles.allPlanLeft, { backgroundColor: item.color + (isPast ? '11' : '22') }]}>
                          <Text style={styles.allPlanDay}>{item.day}</Text>
                          <Text style={styles.allPlanMonth}>{FULL_MONTHS[item.month].substring(0, 3)}</Text>
                        </View>
                        <View style={[styles.planIconBox, { backgroundColor: item.color + (isPast ? '11' : '22') }]}>
                          <Text style={[styles.planEmoji, isPast && { opacity: 0.4 }]}>{item.emoji}</Text>
                        </View>
                        <View style={styles.planInfo}>
                          <Text style={[styles.planType, isPast && { color: colors.textTertiary }]}>
                            {item.type}
                          </Text>
                          <View style={styles.planMeta}>
                            <Ionicons name="car-outline" size={11} color={colors.textTertiary} />
                            <Text style={styles.planVehicle}>{item.vehicleName}</Text>
                            {isPast && (
                              <>
                                <Text style={styles.planDot}>·</Text>
                                <Text style={styles.pastLabel}>Passé</Text>
                              </>
                            )}
                          </View>
                          {item.note ? (
                            <Text style={styles.planNote} numberOfLines={1}>💬 {item.note}</Text>
                          ) : null}
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                          <Ionicons name="trash-outline" size={15} color={isPast ? colors.textTertiary : colors.danger} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })()}
      </ScrollView>

      {/* ══ Add Entry Modal ══════════════════════════════════════════════════ */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            {/* Modal Header */}
            <View style={modal.header}>
              <Text style={modal.title}>➕ Nouvel entretien</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={modal.closeBtn}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

              {/* ── Step 1: Day ── */}
              <Text style={modal.label}>① Jour sélectionné</Text>
              <View style={modal.dayPickerRow}>
                {Array.from({ length: getDaysInMonth(year, month) }).map((_, i) => {
                  const d = i + 1;
                  const sel = d === formDay;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[modal.dayPill, sel && modal.dayPillActive]}
                      onPress={() => setFormDay(d)}
                    >
                      <Text style={[modal.dayPillText, sel && modal.dayPillTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── Step 2: Type ── */}
              <Text style={modal.label}>② Type d'entretien</Text>
              <View style={modal.typeGrid}>
                {MAINTENANCE_TYPES.map((t) => {
                  const sel = formType?.label === t.label;
                  return (
                    <TouchableOpacity
                      key={t.label}
                      style={[modal.typeCard, sel && { borderColor: t.color, borderWidth: 2, backgroundColor: t.color + '18' }]}
                      onPress={() => setFormType(t)}
                      activeOpacity={0.8}
                    >
                      <Text style={modal.typeEmoji}>{t.emoji}</Text>
                      <Text style={[modal.typeLabel, sel && { color: t.color }]} numberOfLines={2}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── Step 3: Vehicle ── */}
              {vehicleList.length > 1 && (
                <>
                  <Text style={modal.label}>③ Véhicule</Text>
                  <View style={modal.vehicleRow}>
                    {vehicleList.map((v: any, idx: number) => {
                      const sel = formVehicleIdx === idx;
                      return (
                        <TouchableOpacity
                          key={v.id}
                          style={[modal.vehiclePill, sel && modal.vehiclePillActive]}
                          onPress={() => setFormVehicleIdx(idx)}
                        >
                          <Text style={[modal.vehiclePillText, sel && modal.vehiclePillTextActive]}>
                            🚗 {v.brand} {v.model}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              {/* ── Note (optional) ── */}
              <Text style={modal.label}>📝 Note (optionnelle)</Text>
              <TextInput
                style={modal.input}
                placeholder="Ex: Suite au bruit perçu..."
                placeholderTextColor={colors.textTertiary}
                value={formNote}
                onChangeText={setFormNote}
                multiline
                numberOfLines={2}
              />

              {/* ── Submit ── */}
              <TouchableOpacity style={modal.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
                <Ionicons name="checkmark-circle" size={20} color={colors.textInverse} />
                <Text style={modal.submitText}>Confirmer la planification</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.md, fontWeight: typography.bold, color: colors.textPrimary,
  },
  scroll: { flex: 1 },

  // Calendar
  calCard: {
    margin: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.base,
    ...shadow.md,
  },
  calNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  calMonth: { fontSize: typography.md, fontWeight: typography.bold, color: colors.textPrimary },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekLabel: {
    flex: 1, textAlign: 'center', fontSize: typography.xs,
    fontWeight: typography.bold, color: colors.textTertiary, textTransform: 'uppercase',
  },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%` as any, aspectRatio: 1,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, marginVertical: 2,
  },
  dayCellSelected: { backgroundColor: colors.primary },
  dayCellToday: { borderWidth: 1.5, borderColor: colors.primary },
  dayNum: { fontSize: typography.sm, color: colors.textSecondary, fontWeight: typography.medium },
  dayNumSelected: { color: colors.textInverse, fontWeight: typography.bold },
  dayNumToday: { color: colors.primary, fontWeight: typography.bold },
  dotRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  legend: {
    flexDirection: 'row', gap: spacing.md, marginTop: spacing.md,
    paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, flexWrap: 'wrap',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendToday: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: colors.primary },
  legendText: { fontSize: 11, color: colors.textTertiary },

  // Section
  section: { paddingHorizontal: 0 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: typography.base, fontWeight: typography.bold, color: colors.textPrimary },
  addRowBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addRowText: { fontSize: typography.sm, color: colors.primary, fontWeight: typography.semibold },

  // Plan items
  planItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginHorizontal: spacing.base, marginBottom: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...shadow.sm,
  },
  planIconBox: { width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  planEmoji: { fontSize: 20 },
  planInfo: { flex: 1 },
  planType: { fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textPrimary },
  planMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  planDate: { fontSize: typography.xs, color: colors.textTertiary },
  planDot: { fontSize: typography.xs, color: colors.textTertiary },
  planVehicle: { fontSize: typography.xs, color: colors.textSecondary },
  planNote: { fontSize: typography.xs, color: colors.primary, marginTop: 3 },
  deleteBtn: { padding: 6 },

  // Empty
  emptyCard: {
    alignItems: 'center', paddingVertical: spacing.xl,
    marginHorizontal: spacing.base, borderRadius: radius.lg,
    backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, borderStyle: 'dashed',
  },
  emptyIcon: { fontSize: 40, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sm, color: colors.textTertiary },
  emptyHint: { fontSize: typography.xs, color: colors.primary, marginTop: 4 },

  // Mes Planifications section
  countBadge: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    color: colors.textInverse,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  groupLine: { flex: 1, height: 1, backgroundColor: colors.border },
  groupLabel: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  allPlanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    ...shadow.sm,
  },
  allPlanItemPast: {
    opacity: 0.5,
  },
  allPlanLeft: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allPlanDay: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  allPlanMonth: {
    fontSize: 9,
    fontWeight: typography.medium,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  pastLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});


// ── Modal Styles ──────────────────────────────────────────────────────────────

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    maxHeight: '88%',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.base, paddingBottom: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: typography.md, fontWeight: typography.bold, color: colors.textPrimary },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  label: {
    fontSize: typography.sm, fontWeight: typography.bold,
    color: colors.textSecondary, marginBottom: 8, marginTop: spacing.md,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Day picker
  dayPickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayPill: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  dayPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayPillText: { fontSize: typography.sm, color: colors.textSecondary, fontWeight: typography.medium },
  dayPillTextActive: { color: colors.textInverse, fontWeight: typography.bold },

  // Type grid
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeCard: {
    width: '30%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeEmoji: { fontSize: 22, marginBottom: 4 },
  typeLabel: {
    fontSize: 11, color: colors.textSecondary,
    textAlign: 'center', fontWeight: typography.medium,
  },

  // Vehicle selector
  vehicleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vehiclePill: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.border,
  },
  vehiclePillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  vehiclePillText: { fontSize: typography.sm, color: colors.textSecondary, fontWeight: typography.medium },
  vehiclePillTextActive: { color: colors.textInverse, fontWeight: typography.bold },

  // Note input
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },

  // Submit
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginTop: spacing.lg,
  },
  submitText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textInverse,
  },
});

export default PlanningScreen;
