import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius, shadow } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useVehicle } from '../../hooks/useVehicle';
import { useMileage } from '../../hooks/useMileage';
import { useAlerts } from '../../hooks/useAlerts';
import { useRecommendations } from '../../hooks/useRecommendations';

// ── Components ───────────────────────────────────────────────────────────────
import VehicleHeroCard from '../../components/VehicleHeroCard';
import VehicleHealthCard from '../../components/VehicleHealthCard';
import ActiveAlertCard from '../../components/ActiveAlertCard';
import MileageUpdateModal from '../../components/MileageUpdateModal';
import { VehicleCardSkeleton, RowSkeleton } from '../../components/SkeletonLoader';
import { Recommendation } from '../../hooks/useRecommendations';

// ─────────────────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

type SectionId =
  | 'header'
  | 'vehicle'
  | 'alerts'
  | 'health'
  | 'recs'
  | 'dashboard';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isLoading, refreshVehicles } = useVehicles();

  const {
    vehicles,
    activeVehicle,
    fuelBadge,
    kpi,
    carouselIndex,
    handleCarouselChange,
    goToVehicles,
  } = useVehicle();

  const { modalVisible, saving, submitMileage, snooze, openModal } = useMileage();
  const { displayed: displayedAlerts, hasMore: moreAlerts, dismiss } = useAlerts(2);
  const { displayed: displayedRecs, hasMore: moreRecs } = useRecommendations(
    activeVehicle,
    displayedAlerts.length,
    4
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Conducteur';

  const onRefresh = useCallback(async () => {
    await refreshVehicles();
  }, []);

  // ── Section renderers ─────────────────────────────────────────────────────

  const renderHeader = () => {
    // Generate simple initials from name
    const initials = user?.name
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'US';

    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}, {firstName} 👋
          </Text>
          <Text style={styles.headerSub}>Tableau de bord véhicule</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={21} color={colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.avatarBtn} 
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderVehicleSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mon véhicule</Text>
        {vehicles.length > 1 && (
          <Text style={styles.sectionMeta}>{vehicles.length} véhicules</Text>
        )}
      </View>
      {isLoading ? (
        <VehicleCardSkeleton />
      ) : (
        <VehicleHeroCard
          vehicles={vehicles}
          activeIndex={carouselIndex}
          kpi={kpi}
          onCarouselChange={handleCarouselChange}
          onPress={goToVehicles}
          onEditMileage={openModal}
        />
      )}
    </View>
  );

  const renderAlertsSection = () => {
    if (!displayedAlerts.length && !isLoading) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚠️ Alertes actives</Text>
          {moreAlerts && (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : (
          displayedAlerts.map((alert) => (
            <ActiveAlertCard
              key={alert.id}
              alert={alert}
              onDismiss={dismiss}
              onDetail={(id) => console.log('detail', id)}
            />
          ))
        )}
      </View>
    );
  };

  const renderHealthSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>❤️ Santé du véhicule</Text>
      </View>
      {isLoading ? (
        <RowSkeleton />
      ) : (
        <VehicleHealthCard
          vehicle={activeVehicle}
          onPress={() => router.push('/health')}
        />
      )}
    </View>
  );

  const renderRecsSection = () => {
    if (!displayedRecs.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💡 Recommandations</Text>
          {moreRecs && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/vehicles')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        {displayedRecs.map((rec) => (
          <RecCard key={rec.id} rec={rec} />
        ))}
      </View>
    );
  };

  const renderDashboardCards = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⚡ Accès rapides</Text>
      <View style={styles.dashRow}>
        {/* Dépenses Card */}
        <TouchableOpacity
          style={[styles.dashCard, { borderTopColor: '#F59E0B' }]}
          onPress={() => router.push('/(tabs)/expenses' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.dashIconWrap}>
            <Text style={styles.dashEmoji}>💰</Text>
          </View>
          <Text style={styles.dashTitle}>Mes Dépenses</Text>
          <Text style={styles.dashSub}>Voir le bilan du mois</Text>
          <View style={[styles.dashBadge, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
            <Text style={[styles.dashBadgeText, { color: '#F59E0B' }]}>Mar. 2026</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#F59E0B" style={styles.dashArrow} />
        </TouchableOpacity>

        {/* Planification Card */}
        <TouchableOpacity
          style={[styles.dashCard, { borderTopColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/planning' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.dashIconWrap}>
            <Text style={styles.dashEmoji}>📅</Text>
          </View>
          <Text style={styles.dashTitle}>Planification</Text>
          <Text style={styles.dashSub}>Prochain entretien</Text>
          <View style={[styles.dashBadge, { backgroundColor: colors.infoLight }]}>
            <Text style={[styles.dashBadgeText, { color: colors.primary }]}>2 avr. 2026</Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} style={styles.dashArrow} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // FlatList sections data
  const sections: { id: SectionId }[] = [
    { id: 'header' },
    { id: 'vehicle' },
    { id: 'dashboard' },
    { id: 'alerts' },
    { id: 'health' },
    { id: 'recs' },
  ];

  const renderSection = ({ item }: { item: { id: SectionId } }) => {
    switch (item.id) {
      case 'header':    return renderHeader();
      case 'vehicle':   return renderVehicleSection();
      case 'alerts':    return renderAlertsSection();
      case 'health':    return renderHealthSection();
      case 'recs':      return renderRecsSection();
      case 'dashboard': return renderDashboardCards();
      default:          return null;
    }
  };

  return (
    <>
      <FlatList
        style={styles.container}
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <MileageUpdateModal
        visible={modalVisible}
        currentMileage={activeVehicle?.mileage}
        saving={saving}
        onSubmit={submitMileage}
        onSnooze={snooze}
      />
    </>
  );
};

// ── Recommendation Card (inline — simple and lean) ───────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  high:   colors.danger,
  medium: colors.warning,
  low:    colors.success,
};
const PRIORITY_LABEL: Record<string, string> = {
  high: 'Prioritaire', medium: 'Conseillé', low: 'Optionnel',
};

function RecCard({ rec }: { rec: Recommendation }) {
  const color = PRIORITY_COLOR[rec.priority] ?? colors.info;
  return (
    <View style={recStyles.card}>
      <View style={[recStyles.dot, { backgroundColor: color }]} />
      <View style={recStyles.content}>
        <View style={recStyles.row}>
          <Text style={recStyles.title}>{rec.title}</Text>
          <View style={[recStyles.badge, { backgroundColor: color + '20' }]}>
            <Text style={[recStyles.badgeText, { color }]}>
              {PRIORITY_LABEL[rec.priority]}
            </Text>
          </View>
        </View>
        <Text style={recStyles.desc} numberOfLines={2}>{rec.description}</Text>
        {rec.kmDue && (
          <View style={recStyles.kmRow}>
            <Ionicons name="speedometer-outline" size={12} color={colors.textTertiary} />
            <Text style={recStyles.km}>à {rec.kmDue.toLocaleString()} km</Text>
          </View>
        )}
        {rec.dealerNote && (
          <View style={recStyles.dealerRow}>
            <Ionicons name="business-outline" size={12} color={colors.primary} />
            <Text style={recStyles.dealer} numberOfLines={1}>{rec.dealerNote}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Dashboard Cards Data is defined inline in renderDashboardCards ──────────

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  sectionMeta: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  seeAll: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  // Dashboard Cards
  dashRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  dashCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderTopWidth: 3,
    ...shadow.md,
    position: 'relative',
  },
  dashIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  dashEmoji: { fontSize: 22 },
  dashTitle: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  dashSub: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  dashBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  dashBadgeText: {
    fontSize: 10,
    fontWeight: typography.bold,
  },
  dashArrow: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
});

const recStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    ...shadow.sm,
  },
  dot: {
    width: 4,
    borderRadius: 2,
    alignSelf: 'stretch',
    minHeight: 40,
  },
  content: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  desc: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  kmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  km: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
  dealerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dealer: {
    fontSize: typography.xs,
    color: colors.primary,
    flex: 1,
  },
});

export default HomeScreen;
