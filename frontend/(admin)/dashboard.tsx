import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { API_BASE } from '../constants/api';

type AdminStats = {
  membersActive: number;
  devisPending: number;
  servicesActive: number;
};

type AdminSection = 'dashboard' | 'users' | 'posts' | 'reports' | 'member' | 'post';

type ActivePost = {
  id: string;
  type: 'Devis' | 'Service';
};

type MemberReturnSection = 'users' | 'posts' | 'post';

type AdminDashboardProps = {
  adminName?: string;
};

const ADMIN_TOKEN = 'dev-admin-token';
const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

export default function AdminDashboard({ adminName = 'Admin' }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSection, setModalSection] = useState<AdminSection | null>(null);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<ActivePost | null>(null);
  const [memberReturnSection, setMemberReturnSection] = useState<MemberReturnSection>('users');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: {
          'x-admin-token': ADMIN_TOKEN,
        },
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`HTTP ${response.status}: ${body || 'Request failed'}`);
      }

      const data = (await response.json()) as Partial<AdminStats>;
      setStats({
        membersActive: Number(data.membersActive ?? 0),
        devisPending: Number(data.devisPending ?? 0),
        servicesActive: Number(data.servicesActive ?? 0),
      });
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error ? fetchError.message : 'Unknown error while loading';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const sectionTitle =
    activeSection === 'users'
      ? 'Members & Messages'
      : activeSection === 'posts'
        ? 'Quotes & Services'
        : 'Action Reports';

  const sectionDescription =
    activeSection === 'users'
      ? 'Manage members, moderation, and warnings here.'
      : activeSection === 'posts'
        ? 'Manage quotes and services published by members here.'
        : 'Track admin actions and the full activity history here.';

  return (
    <View style={styles.container}>
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
          <View style={styles.hero}>
            <View style={styles.heroAccent} />
            <Text style={styles.heroTitle}>Hello {adminName}</Text>
            <Text style={styles.heroSub}>Clear oversight, fast actions, clean tracking.</Text>
          </View>

          <View style={styles.grid}>
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                setModalSection('users');
                setModalVisible(true);
              }}
            >
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>👥 Members & Messages</Text>
              <Text style={styles.cardDescription}>Member management and warning delivery.</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                setModalSection('posts');
                setModalVisible(true);
              }}
            >
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>📝 Quotes & Services</Text>
              <Text style={styles.cardDescription}>Review and moderate published entries.</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                setModalSection('reports');
                setModalVisible(true);
              }}
            >
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>📊 Action Reports</Text>
              <Text style={styles.cardDescription}>Admin action tracking and history.</Text>
            </Pressable>
          </View>

          {/* Section panel moved into modal; keep small hint for keyboard users */}
          {activeSection !== 'dashboard' ? (
            <View style={styles.sectionPanelSmall}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              <Text style={styles.sectionDescription}>{sectionDescription}</Text>
              <View style={styles.sectionActions}>
                <Pressable style={styles.buttonSecondary} onPress={() => setActiveSection('dashboard')}>
                  <Text style={styles.buttonSecondaryText}>Back to dashboard</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={loadStats}>
                  <Text style={styles.buttonText}>Refresh data</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Modal used as "nouvelle fenêtre" for sections */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {modalSection === 'users'
                      ? 'Members'
                      : modalSection === 'posts'
                        ? 'Quotes & Services'
                        : modalSection === 'member'
                        ? 'Member Profile'
                        : modalSection === 'post'
                          ? 'Post Details'
                          : 'Reports'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {Platform.OS === 'web' ? (
                      <TouchableOpacity
                        onPress={() => {
                          try {
                            const qs = `?adminSection=${modalSection}`;
                            window.open(window.location.pathname + qs, '_blank');
                          } catch (e) {}
                        }}
                        style={styles.modalAction}
                      >
                        <Text style={styles.modalActionText}>Open tab</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalAction}>
                      <Text style={styles.modalActionText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView contentContainerStyle={styles.modalBody}>
                  {(() => {
                    try {
                      if (modalSection === 'member') {
                        const MemberComp = require('./member/[id]').default;
                        if (MemberComp && activeMemberId) {
                          return (
                            <MemberComp
                              memberId={activeMemberId}
                              onBack={() => setModalSection(memberReturnSection)}
                            />
                          );
                        }
                        return (
                          <View style={{ paddingVertical: 12 }}>
                            <Text style={{ color: '#475569' }}>No member selected.</Text>
                          </View>
                        );
                      }

                      if (modalSection === 'post') {
                        const PostComp = require('./post/[id]').default;
                        if (PostComp && activePost) {
                          return (
                            <PostComp
                              itemId={activePost.id}
                              itemType={activePost.type}
                              onBack={() => setModalSection('posts')}
                              onOpenOwnerProfile={(ownerId: string) => {
                                setActiveMemberId(ownerId);
                                setMemberReturnSection('post');
                                setModalSection('member');
                              }}
                            />
                          );
                        }
                        return (
                          <View style={{ paddingVertical: 12 }}>
                            <Text style={{ color: '#475569' }}>No quote/service selected.</Text>
                          </View>
                        );
                      }

                      if (modalSection === 'users') {
                        const UsersComp = require('./users').default;
                        if (UsersComp) {
                          return (
                            <UsersComp
                              onBack={() => setModalVisible(false)}
                              onOpenMemberProfile={(memberId: string) => {
                                setActiveMemberId(memberId);
                                setMemberReturnSection('users');
                                setModalSection('member');
                              }}
                            />
                          );
                        }
                      }

                      if (modalSection === 'posts') {
                        const PostsComp = require('./posts').default;
                        if (PostsComp) {
                          return (
                            <PostsComp
                              onBack={() => setModalVisible(false)}
                              onOpenPostDetails={(itemId: string, itemType: 'Devis' | 'Service') => {
                                setActivePost({ id: itemId, type: itemType });
                                setModalSection('post');
                              }}
                              onOpenOwnerProfile={(ownerId: string) => {
                                setActiveMemberId(ownerId);
                                setMemberReturnSection('posts');
                                setModalSection('member');
                              }}
                            />
                          );
                        }
                      }

                      const Comp = require('./reports').default;
                      if (Comp) return <Comp onBack={() => setModalVisible(false)} />;
                    } catch (e: any) {
                      return (
                        <View style={{ paddingVertical: 12 }}>
                          <Text style={{ color: '#9f1239', marginBottom: 8 }}>Error loading section:</Text>
                          <Text style={{ color: '#be123c', marginBottom: 8 }}>{String(e.message || e)}</Text>
                          <Text style={{ color: '#475569' }}>Make sure the missing dependencies are installed or created.</Text>
                        </View>
                      );
                    }
                    return null;
                  })()}
                </ScrollView>
              </View>
            </View>
          </Modal>

          <View style={styles.statsContainer}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Overview</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Live</Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.feedbackBox}>
                <ActivityIndicator size="small" color="#173f7a" />
                <Text style={styles.infoText}>Loading admin statistics...</Text>
              </View>
            ) : null}

            {error ? (
              <View style={[styles.feedbackBox, styles.errorBox]}>
                <Text style={styles.errorTitle}>Unable to load the admin API</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active members</Text>
              <Text style={styles.statValue}>{stats?.membersActive ?? '...'}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Pending quotes</Text>
              <Text style={styles.statValue}>{stats?.devisPending ?? '...'}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Active services</Text>
              <Text style={styles.statValue}>{stats?.servicesActive ?? '...'}</Text>
            </View>

            <Pressable style={styles.button} onPress={loadStats}>
              <Text style={styles.buttonText}>Refresh</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
    backgroundColor: '#d1a23b',
    top: -60,
    right: -40,
  },
  blobTwo: {
    width: 260,
    height: 260,
    backgroundColor: '#173f7a',
    bottom: -80,
    left: -60,
  },
  hero: {
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.25)',
    backgroundColor: '#ffffff',
  },
  heroAccent: {
    width: 48,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#d1a23b',
  },
  heroTitle: {
    marginTop: 6,
    letterSpacing: 0.5,
    fontFamily: headingFont,
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '700',
  },
  heroSub: {
    opacity: 0.9,
    color: '#475569',
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    gap: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#173f7a',
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDescription: {
    fontSize: 13,
    color: '#334155',
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  sectionPanel: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    backgroundColor: '#ffffff',
    gap: 10,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
  },
  sectionDescription: {
    color: '#475569',
  },
  sectionStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sectionStatLabel: {
    color: '#334155',
  },
  sectionStatValue: {
    color: '#0f172a',
    fontWeight: '700',
  },
  sectionActions: {
    gap: 10,
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  statsContainer: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    gap: 10,
    backgroundColor: '#f8fafc',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: '#d1a23b',
  },
  pillText: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: '#6b4f10',
    fontWeight: '700',
  },
  feedbackBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbe3ea',
    padding: 12,
    gap: 8,
  },
  infoText: {
    color: '#334155',
  },
  errorBox: {
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
  },
  errorTitle: {
    color: '#9f1239',
    fontWeight: '700',
  },
  errorText: {
    color: '#be123c',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statLabel: {
    color: '#334155',
  },
  statValue: {
    color: '#0f172a',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#173f7a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  sectionPanelSmall: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    width: Math.min(Dimensions.get('window').width - 40, 920),
    maxHeight: Dimensions.get('window').height - 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  modalBody: {
    padding: 12,
  },
  modalAction: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalActionText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
