import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Animated, Platform, Modal } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { useEffect, useRef, useState } from 'react';
import { AdminTheme } from '../constants/adminTheme';
import { apiJson } from '../constants/api';
import { getCurrentAdminId } from '../constants/adminSession';

type ActionReport = {
  id: string;
  action: string;
  actor: string;
  note?: string;
  date: string;
  targetType?: string;
  targetId?: string;
  detail?: string;
};

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

type ReportsScreenProps = {
  onBack?: () => void;
};

export default function ReportsScreen({ onBack }: ReportsScreenProps) {
  const [reports, setReports] = useState<ActionReport[]>([]);
  const [adminId, setAdminId] = useState(getCurrentAdminId());
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchReports = async () => {
    const trimmed = adminId.trim();
    if (!trimmed) {
      Alert.alert('Admin ID required', 'Please enter an Admin ID.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiJson(`/api/admin/logs?adminId=${encodeURIComponent(trimmed)}`);
      const actions = Array.isArray(data?.actions) ? data.actions : [];
      const mapped = actions.map((item: any) => ({
        id: item._id || `${item.createdAt ?? Date.now()}-${Math.random().toString(16).slice(2)}`,
        action: item.action || 'action',
        target: item.target || 'Unknown',
        actor: trimmed,
        note: item.detail,
        date: item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString(),
        targetType: item.targetType,
        targetId: item.targetId,
        detail: item.detail,
      }));
      setReports(mapped);
    } catch (error: any) {
      Alert.alert('Loading failed', error?.message || 'Unable to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);
  const formatValue = (value: unknown) => {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
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

  

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = ({ item }: { item: ActionReport }) => (
    <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">{item.action}</ThemedText>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </View>
      <ThemedText style={styles.content}>Target: {item.target}</ThemedText>
      <View style={styles.metaRow}>
        <ThemedText style={styles.meta}>Actor: {item.actor}</ThemedText>
        <ThemedText style={styles.badge}>log</ThemedText>
      </View>
      {item.note ? <ThemedText style={styles.note}>Note: {item.note}</ThemedText> : null}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </View>
      <Animated.View
        style={[
          styles.content,
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
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ThemedText style={styles.backBtnText}>Back</ThemedText>
          </TouchableOpacity>
        ) : null}
        <View style={[styles.hero, { backgroundColor: '#F3F4F6' }]}
        >
          <View style={styles.heroAccent} />
          <ThemedText type="title" style={styles.heroTitle}>Action Reports</ThemedText>
          <ThemedText style={styles.heroSub}>Every action is tracked, nothing is lost.</ThemedText>
        </View>

        <View style={styles.toolbar}>
          <TextInput
            value={adminId}
            onChangeText={setAdminId}
            placeholder="Admin ID"
            placeholderTextColor="#9CA3AF"
            style={styles.adminInput}
          />
          <TouchableOpacity onPress={fetchReports} style={styles.toolbarBtn}>
            <ThemedText style={styles.toolbarText}>{loading ? '...' : 'Refresh'}</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reports}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No reports found.</ThemedText>}
        />
      </Animated.View>
      
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
    width: 210,
    height: 210,
    backgroundColor: '#4B5BD7',
    top: -70,
    right: -40,
  },
  blobTwo: {
    width: 230,
    height: 230,
    backgroundColor: '#F2C14E',
    bottom: -70,
    left: -60,
  },
  content: {
    paddingBottom: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginTop: 16,
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
    marginHorizontal: 16,
    marginTop: 10,
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
    backgroundColor: '#111827',
  },
  heroTitle: {
    marginTop: 6,
    letterSpacing: 0.4,
    fontFamily: headingFont,
  },
  heroSub: {
    opacity: 0.7,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  adminInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  toolbarBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  toolbarText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
  content: {
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: 10,
    color: '#1E3A8A',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  pdfBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  pdfBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalSub: {
    marginTop: 6,
    opacity: 0.7,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  modalPrimary: {
    backgroundColor: '#111827',
  },
  note: {
    fontSize: 12,
    opacity: 0.7,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5,
  }
});
