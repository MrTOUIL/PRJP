import { View, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, Pressable, Animated, Platform } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { IconSymbol } from '../components/ui/icon-symbol';
import { Colors } from '../constants/theme';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiJson } from '../constants/api';
import { AdminTheme } from '../constants/adminTheme';
import { getCurrentAdminId } from '../constants/adminSession';

type Member = {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Parent';
  status: 'Active' | 'Suspended';
};

type ActionLog = {
  id: string;
  action: string;
  target: string;
  detail?: string;
  time: string;
};

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

const initialMembers: Member[] = [];

type ManageUsersProps = {
  onOpenMemberProfile?: (memberId: string) => void;
  onBack?: () => void;
};

export default function ManageUsers({ onOpenMemberProfile, onBack }: ManageUsersProps) {
  const [memberDetailOpen, setMemberDetailOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [query, setQuery] = useState('');
  const [adminId, setAdminId] = useState(getCurrentAdminId());
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [warnModalOpen, setWarnModalOpen] = useState(false);
  const [warnMessage, setWarnMessage] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const tintColor = AdminTheme.colors.primary;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(member =>
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.role.toLowerCase().includes(q)
    );
  }, [members, query]);

  const showIds = query.trim().length > 0 && query.trim() !== '*';

  const pushLog = (action: string, target: string, detail?: string) => {
    const entry: ActionLog = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      action,
      target,
      detail,
      time: new Date().toLocaleString(),
    };
    setLogs(prev => [entry, ...prev]);
  };

  const handleSearch = async (customQuery?: string | unknown) => {
    const rawQuery = typeof customQuery === 'string' ? customQuery : query;
    const effectiveQuery = rawQuery.trim() || '*';
    setLoading(true);
    try {
      const data = await apiJson(`/api/admin/search?query=${encodeURIComponent(effectiveQuery)}`);
      const membersFromApi = Array.isArray(data?.members) ? data.members : [];
      const mapped = membersFromApi.map((member: any) => ({
        id: member._id || member.id,
        name: member.name || `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || 'Unknown',
        email: member.email || 'unknown@example.com',
        role: (member.role || 'Student') as Member['role'],
        status: (member.status || 'Active') as Member['status'],
      }));
      setMembers(mapped);
    } catch (error: any) {
      Alert.alert('Search failed', error?.message || 'Unable to fetch members.');
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

  const openDeleteModal = (member: Member) => {
    setDeleteTarget(member);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteLoading) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await apiJson(`/api/admin/ban-member/${deleteTarget.id}`, {
        method: 'POST',
        body: JSON.stringify({ adminId }),
        headers: { 'Content-Type': 'application/json' },
      });
      setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
      pushLog('delete member', deleteTarget.name);
      setDeleteModalOpen(false);
    } catch (error: any) {
      setDeleteError(error?.message || 'Unable to delete member.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuspend = (id: string, name: string) => {
    setMembers(prev => prev.map(m => m.id === id ? {
      ...m,
      status: m.status === 'Active' ? 'Suspended' : 'Active'
    } : m));
    pushLog('toggle status', name);
  };

  const openWarnModal = (member: Member) => {
    setSelectedMember(member);
    setWarnMessage('');
    setWarnModalOpen(true);
  };

  const sendWarning = () => {
    if (!selectedMember) return;
    if (!warnMessage.trim()) {
      Alert.alert('Missing message', 'Please enter a warning message.');
      return;
    }
    apiJson(`/api/admin/warn-member/${selectedMember.id}`, {
      method: 'POST',
      body: JSON.stringify({ message: warnMessage.trim(), adminId }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        pushLog('warning sent', selectedMember.name, warnMessage.trim());
        setWarnModalOpen(false);
      })
      .catch((error: any) => {
        Alert.alert('Warning failed', error?.message || 'Unable to send warning.');
      });
  };

  const actionHitSlop = { top: 8, bottom: 8, left: 8, right: 8 };

  const renderItem = ({ item }: { item: Member }) => (
    <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}
    >
      <TouchableOpacity
        onPress={() => {
          if (onOpenMemberProfile) {
            onOpenMemberProfile(item.id);
            return;
          }
          setSelectedMember(item);
          setMemberDetailOpen(true);
        }}
        style={styles.userInfo}
        activeOpacity={0.8}
      >
        <View style={[styles.avatar, { backgroundColor: '#E2E8F0' }]}>
          <ThemedText style={{ fontSize: 20 }}>{item.name.charAt(0)}</ThemedText>
        </View>
        <View>
          <ThemedText type="defaultSemiBold" style={styles.userName}>{item.name}</ThemedText>
          <ThemedText style={styles.role}>{item.role}</ThemedText>
          <ThemedText style={styles.email}>{item.email}</ThemedText>
          {showIds ? <ThemedText style={styles.idLine}>ID: {item.id}</ThemedText> : null}
          <ThemedText
            style={[
              styles.status,
              item.status === 'Active' ? styles.statusActive : styles.statusWarn,
            ]}
          >
            {item.status}
          </ThemedText>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity hitSlop={actionHitSlop} onPress={() => openWarnModal(item)} style={styles.actionBtn}>
          <IconSymbol name="exclamationmark.bubble.fill" size={20} color={tintColor} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={actionHitSlop} onPress={() => handleSuspend(item.id, item.name)} style={styles.actionBtn}>
          <IconSymbol name="eye.slash.fill" size={20} color="orange" />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={actionHitSlop} onPress={() => openDeleteModal(item)} style={[styles.actionBtn, styles.actionDanger]}>
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
            <ThemedText style={styles.backBtnText}>Back</ThemedText>
          </TouchableOpacity>
        ) : null}
        <View style={[styles.hero, { backgroundColor: AdminTheme.colors.surfaceLight }]}
        >
          <View style={[styles.heroAccent, { backgroundColor: AdminTheme.colors.gold }]} />
          <ThemedText type="title" style={styles.heroTitle}>Member management</ThemedText>
          <ThemedText style={styles.heroSub}>Fast search, clear actions, and a clean status view.</ThemedText>
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
            placeholder="Search by name, email, or role (* = all)"
            placeholderTextColor="#9CA3AF"
            style={[styles.searchInput, { borderColor: tintColor }]}
          />
          <TouchableOpacity onPress={() => handleSearch()} style={[styles.searchBtn, { backgroundColor: AdminTheme.colors.primary }]}
          >
            <ThemedText style={styles.searchBtnText}>{loading ? '...' : 'Search'}</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No members found.</ThemedText>}
        />

        <View style={styles.logsSection}>
          <ThemedText type="subtitle">Recent actions</ThemedText>
          {logs.length === 0 ? (
            <ThemedText style={styles.empty}>No actions yet.</ThemedText>
          ) : (
            logs.slice(0, 5).map(log => (
              <View key={log.id} style={[styles.logRow, { backgroundColor: '#F8FAFF' }]}
              >
                <ThemedText style={styles.logAction}>{log.action}</ThemedText>
                <ThemedText style={styles.logTarget}>{log.target}</ThemedText>
                <ThemedText style={styles.logTime}>{log.time}</ThemedText>
              </View>
            ))
          )}
        </View>
      </Animated.View>

      <Modal visible={warnModalOpen} transparent animationType="fade" onRequestClose={() => setWarnModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setWarnModalOpen(false)}>
          <Pressable style={styles.modalCard}>
            <ThemedText type="subtitle">Send warning</ThemedText>
            <ThemedText style={styles.modalSub}>To: {selectedMember?.name}</ThemedText>
            <TextInput
              value={warnMessage}
              onChangeText={setWarnMessage}
              placeholder="Write your warning message"
              placeholderTextColor="#9CA3AF"
              multiline
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setWarnModalOpen(false)} style={styles.modalBtn}>
                <ThemedText>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={sendWarning} style={[styles.modalBtn, styles.modalPrimary]}>
                <ThemedText style={{ color: '#FFFFFF' }}>Send</ThemedText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={memberDetailOpen} transparent animationType="fade" onRequestClose={() => setMemberDetailOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setMemberDetailOpen(false)}>
          <Pressable style={styles.modalCard}>
            <ThemedText type="subtitle">Member details</ThemedText>
            <ThemedText style={styles.modalSub}>Name: {selectedMember?.name}</ThemedText>
            <ThemedText style={styles.modalSub}>Email: {selectedMember?.email}</ThemedText>
            <ThemedText style={styles.modalSub}>Role: {selectedMember?.role}</ThemedText>
            <ThemedText style={styles.modalSub}>Status: {selectedMember?.status}</ThemedText>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setMemberDetailOpen(false)} style={styles.modalBtn}>
                <ThemedText>Close</ThemedText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={deleteModalOpen} transparent animationType="fade" onRequestClose={() => setDeleteModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setDeleteModalOpen(false)}>
          <Pressable style={styles.modalCard}>
            <ThemedText type="subtitle">Confirmation</ThemedText>
            <ThemedText style={styles.modalSub}>
              {`Are you sure you want to delete this user "${deleteTarget?.name ?? ''}"?`}
            </ThemedText>
            {deleteError ? <ThemedText style={styles.modalError}>{deleteError}</ThemedText> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setDeleteModalOpen(false)} style={styles.modalBtn}>
                <ThemedText>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={[styles.modalBtn, styles.modalPrimary]}
                disabled={deleteLoading}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>
                  {deleteLoading ? '...' : 'Delete'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
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
    backgroundColor: '#4B5BD7',
    top: -60,
    right: -30,
  },
  blobTwo: {
    width: 240,
    height: 240,
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
  },
  heroTitle: {
    marginTop: 6,
    letterSpacing: 0.5,
    fontFamily: headingFont,
  },
  heroSub: {
    opacity: 0.7,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
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
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  searchBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    letterSpacing: 0.2,
  },
  role: {
    fontSize: 12,
    opacity: 0.7,
  },
  email: {
    fontSize: 12,
    opacity: 0.6,
  },
  idLine: {
    fontSize: 11,
    opacity: 0.55,
  },
  status: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  statusActive: {
    color: '#0F172A',
    backgroundColor: '#C7D2FE',
  },
  statusWarn: {
    color: '#111827',
    backgroundColor: '#FDE68A',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
    zIndex: 1,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  actionDanger: {
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
    opacity: 0.6,
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
});
