import { Animated, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { apiJson } from '../../constants/api';
import { AdminTheme } from '../../constants/adminTheme';

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
const labelFont = Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium', default: 'System' });

type ItemDetails = {
  id?: string;
  [key: string]: unknown;
};

const FIELD_LABELS: Record<string, string> = {
  id: 'ID',
  type: 'Type',
  target_audiance: 'Target audience',
  mode: 'Mode',
  expectations: 'Expectations',
  duration: 'Duration',
  cost: 'Price',
  source: 'Source',
  fileId: 'File ID',
  comment: 'Comment',
  done_by: 'Done by',
  status: 'Status',
  createdAt: 'Created at',
  updatedAt: 'Updated at',
};

type PostDetailsProps = {
  itemId?: string;
  itemType?: 'Devis' | 'Service';
  onOpenOwnerProfile?: (ownerId: string) => void;
  onBack?: () => void;
};

export default function PostDetails({ itemId, itemType, onOpenOwnerProfile, onBack }: PostDetailsProps) {
  const webParams =
    Platform.OS === 'web'
      ? new URLSearchParams(window.location.search)
      : null;
  const id = itemId || webParams?.get('itemId') || undefined;
  const type = itemType || (webParams?.get('type') as 'Devis' | 'Service' | null) || undefined;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [item, setItem] = useState<ItemDetails | null>(null);
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
    const endpoint = type === 'Devis' ? `/api/admin/devis/${id}` : `/api/admin/service/${id}`;
    apiJson(endpoint)
      .then((data) => {
        const payload = { ...data } as Record<string, unknown>;
        if (payload?._id && !payload.id) payload.id = payload._id;
        setItem(payload);
        setError(null);
      })
      .catch((err: any) => {
        setError(err?.message || 'Loading error');
      });
  }, [id, type]);

  const title = useMemo(() => {
    if (!item) return 'Details';
    if (typeof item.name === 'string') return item.name;
    if (typeof item.title === 'string') return item.title;
    if (typeof item.type === 'string') return item.type;
    return 'Details';
  }, [item]);

  const fieldEntries = item
    ? Object.entries(item)
        .filter(([key, value]) => value !== undefined && value !== null && key !== '__v' && key !== '_id')
        .map(([key, value]) => ({
          key,
          label: FIELD_LABELS[key] || key.replace(/_/g, ' '),
          value,
        }))
    : [];

  const ownerId = useMemo(() => {
    if (!item) return undefined;
    const doneBy = item.done_by as any;
    const owner = item.owner as any;
    return String(
      doneBy?._id ||
      doneBy ||
      owner?._id ||
      owner ||
      (item as any).ownerId ||
      (item as any).owner_id ||
      ''
    ) || undefined;
  }, [item]);

  const formatValue = (value: unknown) => {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'string' && /T\d{2}:\d{2}:\d{2}/.test(value)) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleString();
    }
    if (value && typeof value === 'object' && 'first_name' in (value as any)) {
      const doneBy = value as { first_name?: string; last_name?: string; email?: string };
      return `${doneBy.first_name ?? ''} ${doneBy.last_name ?? ''}`.trim() || doneBy.email || '---';
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
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ThemedText style={styles.backBtnText}>Back</ThemedText>
          </TouchableOpacity>
        ) : null}
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
          <View style={[styles.heroAccent, { backgroundColor: AdminTheme.colors.gold }]} />
          <ThemedText type="title" style={styles.heroTitle}>{title}</ThemedText>
          <ThemedText style={styles.heroSub}>Full details for the service/quote.</ThemedText>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: isDark ? AdminTheme.colors.surfaceElevated : '#FFFFFF' }]}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Informations</ThemedText>
            <View style={[styles.cardTag, { backgroundColor: isDark ? AdminTheme.colors.primarySoft : '#EEF2FF' }]}>
              <ThemedText style={styles.cardTagText}>{type ?? 'Item'}</ThemedText>
            </View>
          </View>
          {ownerId && onOpenOwnerProfile ? (
            <TouchableOpacity
              style={styles.ownerBtn}
              onPress={() => onOpenOwnerProfile(ownerId)}
            >
              <ThemedText style={styles.ownerBtnText}>View owner profile</ThemedText>
            </TouchableOpacity>
          ) : null}
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
    right: -30,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  backBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  hero: {
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
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
  ownerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#CBD5F5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 2,
  },
  ownerBtnText: {
    color: '#173f7a',
    fontSize: 12,
    fontWeight: '600',
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
