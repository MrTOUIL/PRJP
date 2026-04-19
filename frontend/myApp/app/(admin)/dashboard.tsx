import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useRef, useState } from 'react';
import { apiJson } from '@/constants/api';
import { AdminTheme } from '@/constants/adminTheme';

type AdminStats = {
  membersActive: number;
  devisPending: number;
  servicesActive: number;
};

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

export default function AdminDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = AdminTheme.colors.primary;
  const isDark = colorScheme === 'dark';
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    apiJson('/api/admin/stats')
      .then((data) => {
        if (!mounted) return;
        setStats({
          membersActive: Number(data?.membersActive ?? 0),
          devisPending: Number(data?.devisPending ?? 0),
          servicesActive: Number(data?.servicesActive ?? 0)
        });
        setStatsError(null);
      })
      .catch((error: any) => {
        if (!mounted) return;
        setStatsError(error?.message || 'Erreur de chargement');
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <ThemedView style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.scrollContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.hero, { backgroundColor: isDark ? AdminTheme.colors.surface : AdminTheme.colors.surfaceLight }]}
          >
            <View style={[styles.heroAccent, { backgroundColor: AdminTheme.colors.gold }]} />
            <ThemedText type="title" style={styles.heroTitle}>
              Admin Control
            </ThemedText>
            <ThemedText style={styles.heroSub}>
              Supervision claire, actions rapides, suivi propre.
            </ThemedText>
          </View>

          <View style={styles.grid}>
            <TouchableOpacity
              style={[styles.card, { borderColor: AdminTheme.colors.borderSoft, backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#FFFFFF' }]}
              onPress={() => router.push('/(admin)/users')}>
              <View style={[styles.cardAccent, { backgroundColor: AdminTheme.colors.primary }]} />
              <IconSymbol name="person.2.fill" size={38} color={AdminTheme.colors.primary} />
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Membres & Messages
              </ThemedText>
              <ThemedText style={styles.cardDescription}>
                Rechercher, supprimer, et envoyer des avertissements.
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { borderColor: AdminTheme.colors.borderSoft, backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#FFFFFF' }]}
              onPress={() => router.push('/(admin)/posts')}>
              <View style={[styles.cardAccent, { backgroundColor: AdminTheme.colors.primary }]} />
              <IconSymbol name="rectangle.stack.fill" size={38} color={AdminTheme.colors.primary} />
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Devis & Services
              </ThemedText>
              <ThemedText style={styles.cardDescription}>
                Rechercher et supprimer les devis et services.
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { borderColor: AdminTheme.colors.borderSoft, backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#FFFFFF' }]}
              onPress={() => router.push('/(admin)/reports')}>
              <View style={[styles.cardAccent, { backgroundColor: AdminTheme.colors.primary }]} />
              <IconSymbol name="doc.text.fill" size={38} color={AdminTheme.colors.primary} />
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Rapports d actions
              </ThemedText>
              <ThemedText style={styles.cardDescription}>
                Historique des actions et generation de rapports.
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={[styles.statsContainer, { backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#F8FAFF' }]}
          >
            <View style={styles.statsHeader}>
              <ThemedText type="subtitle">Supervision</ThemedText>
              <View style={[styles.pill, { borderColor: AdminTheme.colors.gold }]}
              >
                <ThemedText style={styles.pillText}>Live</ThemedText>
              </View>
            </View>
            {statsError ? (
              <ThemedText style={styles.statsError}>{statsError}</ThemedText>
            ) : null}
            <View style={styles.statRow}>
              <ThemedText>Membres actifs</ThemedText>
              <ThemedText type="defaultSemiBold">{stats?.membersActive ?? '...'}</ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText>Devis en attente</ThemedText>
              <ThemedText type="defaultSemiBold">{stats?.devisPending ?? '...'}</ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText>Services actifs</ThemedText>
              <ThemedText type="defaultSemiBold">{stats?.servicesActive ?? '...'}</ThemedText>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  scrollContent: {
    gap: 20,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.18,
  },
  blobOne: {
    width: 220,
    height: 220,
    backgroundColor: '#F2C14E',
    top: -60,
    right: -40,
  },
  blobTwo: {
    width: 260,
    height: 260,
    backgroundColor: '#4B5BD7',
    bottom: -80,
    left: -60,
  },
  hero: {
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  heroAccent: {
    width: 48,
    height: 6,
    borderRadius: 999,
  },
  heroTitle: {
    marginTop: 6,
    letterSpacing: 0.5,
    fontFamily: headingFont,
  },
  heroSub: {
    opacity: 0.7,
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  cardTitle: {
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    gap: 10,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
  statsError: {
    marginTop: 8,
    color: '#DC2626',
    fontSize: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  }
});
