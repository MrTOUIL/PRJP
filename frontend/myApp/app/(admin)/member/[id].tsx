import { Animated, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiJson } from '@/constants/api';
import { AdminTheme } from '@/constants/adminTheme';

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
const labelFont = Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium', default: 'System' });

type MemberDetails = {
  id: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

const FIELD_LABELS: Record<string, string> = {
  id: 'ID',
  role: 'Role',
  first_name: 'Prenom',
  last_name: 'Nom',
  parentf: 'Parent prenom',
  parentl: 'Parent nom',
  email: 'Email',
  phone: 'Phone',
  postal_adress: 'Adresse',
  academic_level: 'Niveau',
  subject: 'Matieres',
  school_levels_taught: 'Niveaux enseignes',
  mode: 'Mode',
  available_days: 'Jours dispo',
  start_time: 'Heure debut',
  end_time: 'Heure fin',
  home_visits: 'Visites a domicile',
  bio: 'Bio',
  status: 'Status',
  createdAt: 'Cree le',
  updatedAt: 'Mis a jour',
};

export default function MemberProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!id) return;
    apiJson(`/api/admin/member/${id}`)
      .then((data) => {
        setMember({
          id: String(data?.id ?? id),
          role: data?.role,
          first_name: data?.first_name,
          last_name: data?.last_name,
          email: data?.email,
          phone: data?.phone,
          status: data?.status,
          createdAt: data?.createdAt,
          updatedAt: data?.updatedAt,
        });
        setError(null);
      })
      .catch((err: any) => {
        setError(err?.message || 'Erreur de chargement');
      });
  }, [id]);

  const fullName = member
    ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || 'Membre'
    : 'Membre';

  const fieldEntries = member
    ? Object.entries(member)
      .filter(([key, value]) => value !== undefined && value !== null && key !== 'password' && key !== '__v' && key !== '_id')
        .map(([key, value]) => ({
          key,
          label: FIELD_LABELS[key] || key.replace(/_/g, ' '),
          value,
        }))
    : [];

  const formatValue = (value: unknown) => {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === 'string' && /T\d{2}:\d{2}:\d{2}/.test(value)) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleString();
    }
    return String(value);
  };

  return (
    <ThemedView style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
        <View style={[styles.blob, styles.blobThree]} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.hero,
            { backgroundColor: isDark ? AdminTheme.colors.surface : AdminTheme.colors.surfaceLight },
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.heroTop}>
            <View style={[styles.avatar, { backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#E2E8F0' }]}>
              <ThemedText style={styles.avatarText}>{fullName.charAt(0)}</ThemedText>
            </View>
            <View style={styles.heroText}>
              <ThemedText type="title" style={styles.heroTitle}>{fullName}</ThemedText>
              <View style={styles.roleRow}>
                <View style={[styles.rolePill, { borderColor: isDark ? AdminTheme.colors.borderSoft : '#CBD5F5' }]}>
                  <ThemedText style={styles.rolePillText}>{member?.role ?? 'Membre'}</ThemedText>
                </View>
                <View style={[styles.statusPill, { backgroundColor: isDark ? AdminTheme.colors.primarySoft : '#E0E7FF' }]}>
                  <ThemedText style={styles.statusPillText}>{member?.status ?? '---'}</ThemedText>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.heroAccent, { backgroundColor: AdminTheme.colors.gold }]} />
          <ThemedText style={styles.heroSub}>Profil complet du membre, informations detaillees.</ThemedText>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#FFFFFF' }]}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Informations</ThemedText>
            <View style={[styles.cardTag, { backgroundColor: isDark ? AdminTheme.colors.primarySoft : '#EEF2FF' }]}>
              <ThemedText style={styles.cardTagText}>Details</ThemedText>
            </View>
          </View>
          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          <View style={styles.grid}>
            {fieldEntries.map((entry) => (
              <View key={entry.key} style={[styles.fieldCard, { backgroundColor: isDark ? AdminTheme.colors.surface : '#F8FAFF' }]}>
                <ThemedText style={styles.label}>{entry.label}</ThemedText>
                <ThemedText style={styles.value}>{formatValue(entry.value)}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 200,
    height: 200,
    backgroundColor: '#4B5BD7',
    top: -60,
    right: -40,
  },
  blobTwo: {
    width: 230,
    height: 230,
    backgroundColor: '#F2C14E',
    bottom: -70,
    left: -60,
  },
  blobThree: {
    width: 160,
    height: 160,
    backgroundColor: '#C7D2FE',
    top: 120,
    right: -40,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  hero: {
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  heroTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontFamily: headingFont,
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  heroAccent: {
    width: 64,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  heroTitle: {
    marginTop: 6,
    letterSpacing: 0.5,
    fontFamily: headingFont,
  },
  heroSub: {
    opacity: 0.7,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rolePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rolePillText: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTag: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardTagText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fieldCard: {
    minWidth: '47%',
    flexGrow: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: labelFont,
  },
  value: {
    fontSize: 12,
    marginTop: 6,
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
  },
});
