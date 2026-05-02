import { View, FlatList, StyleSheet, Alert, TouchableOpacity, TextInput, Animated, Platform, Modal } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { IconSymbol } from '../components/ui/icon-symbol';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiJson } from '../constants/api';
import { AdminTheme } from '../constants/adminTheme';
import { getCurrentAdminId } from '../constants/adminSession';

type ItemType = 'Devis' | 'Service';

type AdminItem = {
  id: string;
  type: ItemType;
  title: string;
  owner: string;
  ownerId?: string;
  price?: number;
  status?: 'Pending' | 'Active';
};

type ActionLog = {
  id: string;
  action: string;
  target: string;
  time: string;
};

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

const initialItems: AdminItem[] = [];

type ManagePostsProps = {
  onOpenPostDetails?: (itemId: string, itemType: ItemType) => void;
  onOpenOwnerProfile?: (ownerId: string) => void;
  onBack?: () => void;
};

export default function ManagePosts({ onOpenPostDetails, onOpenOwnerProfile, onBack }: ManagePostsProps) {
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [items, setItems] = useState<AdminItem[]>(initialItems);
  const [filter, setFilter] = useState<ItemType | 'All'>('All');
  const [query, setQuery] = useState('');
  const [adminId, setAdminId] = useState(getCurrentAdminId());
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredItems = useMemo(() => {
    if (filter === 'All') return items;
    return items.filter(item => item.type === filter);
  }, [items, filter]);

  const showIds = query.trim().length > 0 && query.trim() !== '*';

  const pushLog = (action: string, target: string) => {
    setLogs(prev => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        action,
        target,
        time: new Date().toLocaleString(),
      },
      ...prev
    ]);
  };

  const handleSearch = async (customQuery?: string) => {
    const effectiveQuery = (customQuery ?? query).trim() || '*';
    setLoading(true);
    try {
      const data = await apiJson(`/api/admin/search?query=${encodeURIComponent(effectiveQuery)}`);
      const devis = Array.isArray(data?.devis) ? data.devis : [];
      const services = Array.isArray(data?.services) ? data.services : [];

      const mappedDevis = devis.map((item: any) => ({
        id: item._id || item.id,
        type: 'Devis' as const,
        title: item.title || item.description || 'Devis',
        owner: item.owner?.first_name
          ? `${item.owner.first_name ?? ''} ${item.owner.last_name ?? ''}`.trim() || item.owner.email || 'Unknown'
          : (item.email || item.owner || 'Unknown'),
        ownerId:
          item.owner?._id ||
          item.owner_id ||
          item.ownerId ||
          item.done_by?._id ||
          item.done_by ||
          item.userId ||
          item.createdBy ||
          undefined,
        price: item.cost || item.price,
        status: item.status || 'Pending',
      }));

      const mappedServices = services.map((item: any) => ({
        id: item._id || item.id,
        type: 'Service' as const,
        title: item.name || item.type || 'Service',
        owner: item.done_by
          ? `${item.done_by.first_name ?? ''} ${item.done_by.last_name ?? ''}`.trim() || item.done_by.email || 'Unknown'
          : (item.email || 'Unknown'),
        ownerId: item.done_by?._id || item.done_by || undefined,
        price: item.cost || item.price,
        status: item.status || 'Active',
      }));

      setItems([...mappedDevis, ...mappedServices]);
    } catch (error: any) {
      Alert.alert('Search failed', error?.message || 'Unable to fetch items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('*');
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const openDeleteModal = (item: AdminItem) => {
    setDeleteTarget(item);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteLoading) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const endpoint = deleteTarget.type === 'Devis'
        ? `/api/admin/devis/${deleteTarget.id}`
        : `/api/admin/service/${deleteTarget.id}`;
      await apiJson(endpoint, { method: 'DELETE', body: JSON.stringify({ adminId }), headers: { 'Content-Type': 'application/json' } });
      setItems(prev => prev.filter(item => item.id !== deleteTarget.id));
      pushLog('delete item', deleteTarget.title);
      setDeleteModalOpen(false);
    } catch (error: any) {
      setDeleteError(error?.message || 'Unable to delete item.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderItem = ({ item }: { item: AdminItem }) => (
    <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
      <TouchableOpacity
        onPress={() => {
          if (onOpenPostDetails) {
            onOpenPostDetails(item.id, item.type);
            return;
          }
          setSelectedItem(item);
        }}
        activeOpacity={0.85}
        style={styles.cardBody}
      >
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          <ThemedText style={[styles.badge, item.type === 'Devis' ? styles.badgeInfo : styles.badgeSuccess]}>
            {item.type}
          </ThemedText>
        </View>

        <View style={styles.ownerRow}>
          <ThemedText style={styles.meta}>Owner:</ThemedText>
          <TouchableOpacity
            onPress={() => item.ownerId && onOpenOwnerProfile?.(String(item.ownerId))}
            disabled={!item.ownerId}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <ThemedText style={[styles.ownerLink, !item.ownerId && styles.ownerDisabled]}>
              {item.owner}
            </ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.meta}>Status: {item.status ?? 'N/A'}</ThemedText>
        {showIds ? <ThemedText style={styles.idLine}>ID: {item.id}</ThemedText> : null}
      </TouchableOpacity>

      <View style={styles.footer}>
        <ThemedText style={styles.meta}>Price: {item.price !== undefined ? `${item.price} DZD` : 'N/A'}</ThemedText>
        <TouchableOpacity onPress={() => openDeleteModal(item)} style={styles.actionBtn}>
          <IconSymbol name="trash.fill" size={20} color="red" />
        </TouchableOpacity>
      </View>
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
            <ThemedText style={styles.backBtnText}>Retour</ThemedText>
          </TouchableOpacity>
        ) : null}
        <View style={[styles.hero, { backgroundColor: AdminTheme.colors.surfaceLight }]}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroAccent} />
            <ThemedText type="title" style={styles.heroTitle}>Devis & Services</ThemedText>
          </View>
          <ThemedText style={styles.heroSub}>Garde le catalogue propre et visible.</ThemedText>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            value={adminId}
            onChangeText={setAdminId}
            placeholder="Admin ID"
            placeholderTextColor="#9CA3AF"
            style={styles.adminInput}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search devis or services (* = all)"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => handleSearch()} style={[styles.searchBtn, { backgroundColor: AdminTheme.colors.primary }]}>
            <ThemedText style={styles.searchBtnText}>{loading ? '...' : 'Search'}</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.filterRow}>
          {(['All', 'Devis', 'Service'] as const).map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => setFilter(option)}
              style={[styles.filterBtn, filter === option && styles.filterBtnActive]}
            >
              <ThemedText style={filter === option ? styles.filterTextActive : styles.filterText}>
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No items found.</ThemedText>}
        />

        <View style={styles.logsSection}>
          <ThemedText type="subtitle">Dernieres actions</ThemedText>
          {logs.length === 0 ? (
            <ThemedText style={styles.empty}>No actions yet.</ThemedText>
          ) : (
            logs.slice(0, 5).map(log => (
              <View key={log.id} style={[styles.logRow, { backgroundColor: '#F8FAFF' }]}>
                <ThemedText style={styles.logAction}>{log.action}</ThemedText>
                <ThemedText style={styles.logTarget}>{log.target}</ThemedText>
                <ThemedText style={styles.logTime}>{log.time}</ThemedText>
              </View>
            ))
          )}
        </View>
      </Animated.View>
      <Modal visible={deleteModalOpen} transparent animationType="fade" onRequestClose={() => setDeleteModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText type="subtitle">Confirmation</ThemedText>
            <ThemedText style={styles.modalSub}>
              {`Supprimer "${deleteTarget?.title ?? ''}" ?`}
            </ThemedText>
            {deleteError ? <ThemedText style={styles.modalError}>{deleteError}</ThemedText> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setDeleteModalOpen(false)} style={styles.modalBtn}>
                <ThemedText>Annuler</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.modalBtn, styles.modalPrimary]}
                disabled={deleteLoading}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>{deleteLoading ? '...' : 'Supprimer'}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText type="subtitle">Détails</ThemedText>
            <ThemedText style={styles.modalSub}>Titre: {selectedItem?.title}</ThemedText>
            <ThemedText style={styles.modalSub}>Type: {selectedItem?.type}</ThemedText>
            <ThemedText style={styles.modalSub}>Owner: {selectedItem?.owner}</ThemedText>
            <ThemedText style={styles.modalSub}>Price: {selectedItem?.price ?? 'N/A'}</ThemedText>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.modalBtn}>
                <ThemedText>Fermer</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#F2C14E',
    top: -60,
    right: -40,
  },
  blobTwo: {
    width: 230,
    height: 230,
    backgroundColor: '#4B5BD7',
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
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroAccent: {
    width: 10,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  heroTitle: {
    letterSpacing: 0.4,
    fontFamily: headingFont,
  },
  heroSub: {
    opacity: 0.7,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  adminInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
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
  searchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  filterBtnActive: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 12,
    opacity: 0.7,
  },
  filterTextActive: {
    fontSize: 12,
    color: '#FFFFFF',
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
  cardBody: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  badgeInfo: {
    backgroundColor: '#DBEAFE',
    color: '#1E3A8A',
  },
  badgeSuccess: {
    backgroundColor: '#FDE68A',
    color: '#1F2937',
  },
  meta: {
    fontSize: 12,
    opacity: 0.7,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ownerLink: {
    fontSize: 12,
    color: '#173f7a',
    textDecorationLine: 'underline',
  },
  ownerDisabled: {
    color: '#6b7280',
    textDecorationLine: 'none',
  },
  idLine: {
    fontSize: 11,
    opacity: 0.55,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(226, 84, 84, 0.18)',
  },
  logsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logRow: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
  },
  logAction: {
    fontSize: 12,
    opacity: 0.8,
  },
  logTarget: {
    fontSize: 14,
  },
  logTime: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.5,
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
  modalError: {
    marginTop: 8,
    color: '#DC2626',
    fontSize: 12,
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
  }
});
