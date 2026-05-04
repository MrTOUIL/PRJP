import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';

const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  border: '#E1E1E1',
  student: '#E8F1FF',
  parent: '#FFF3E0',
  studentText: '#2962FF',
  parentText: '#FF9800',
};

type UserItem = {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  academic_level?: string;
  parentf?: string;
  parentl?: string;
};

const sanitizeUsers = (users: unknown): UserItem[] => {
  if (!Array.isArray(users)) return [];
  return users.filter((item): item is UserItem => !!item && typeof item === 'object');
};

export default function ViewStudent() {
  const router = useRouter();
  const { serviceid, serviceTitle } = useLocalSearchParams();
  const [students, setStudents] = useState<UserItem[]>([]);
  const [parents, setParents] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServiceUsers = async (): Promise<void> => {
      if (!serviceid) {
        setLoading(false);
        setMessage('Service not found.');
        return;
      }

      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        fetch(`${BASE_URL}/teacher/getstudents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ serviceid: String(serviceid) }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.succ && Array.isArray(data.students) && Array.isArray(data.parents)) {
              const safeStudents = sanitizeUsers(data.students);
              const safeParents = sanitizeUsers(data.parents);
              setStudents(safeStudents);
              setParents(safeParents);
              if (safeStudents.length === 0 && safeParents.length === 0) {
                setMessage('No students or parents assigned to this service yet.');
              }
            } else if (data.error === 'Token expired!') {
              fetch(`${BASE_URL}/teacher/refresh`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              })
                .then(res => res.json())
                .then(refreshData => {
                  if (refreshData.accessToken) {
                    SecureStore.setItemAsync('accessToken', refreshData.accessToken);
                    fetch(`${BASE_URL}/teacher/getstudents`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${refreshData.accessToken}`,
                      },
                      body: JSON.stringify({ serviceid: String(serviceid) }),
                    })
                      .then(res => res.json())
                      .then(retryData => {
                        if (retryData.succ && Array.isArray(retryData.students) && Array.isArray(retryData.parents)) {
                          const safeStudents = sanitizeUsers(retryData.students);
                          const safeParents = sanitizeUsers(retryData.parents);
                          setStudents(safeStudents);
                          setParents(safeParents);
                          if (safeStudents.length === 0 && safeParents.length === 0) {
                            setMessage('No students or parents assigned to this service yet.');
                          }
                        } else {
                          router.replace('/sign_in');
                        }
                      })
                      .catch(() => {
                        router.replace('/sign_in');
                      })
                      .finally(() => setLoading(false));
                  } else {
                    router.replace('/sign_in');
                    setLoading(false);
                  }
                })
                .catch(() => {
                  router.replace('/sign_in');
                  setLoading(false);
                });
            } else {
              setMessage('Unable to load service users.');
            }
          })
          .catch(() => {
            setMessage('Unable to load service users.');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setMessage('Unable to load service users.');
        setLoading(false);
      }
    };

    fetchServiceUsers();
  }, [router, serviceid]);

  const renderUserCard = (item: UserItem | null | undefined, type: 'student' | 'parent', index: number) => {
    const safeItem = item ?? {};
    const fullName = `${safeItem.first_name ?? ''} ${safeItem.last_name ?? ''}`.trim() || 'Unnamed user';
    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('') || 'U';

    return (
      <Animated.View key={`${type}-${safeItem._id ?? index}`} entering={FadeInDown.delay(index * 80).springify()}>
        <View style={styles.userCard}>
          <View style={[styles.avatar, type === 'student' ? styles.studentAvatar : styles.parentAvatar]}>
            <Text style={[styles.avatarText, type === 'student' ? styles.studentAvatarText : styles.parentAvatarText]}>{initials}</Text>
          </View>

          <View style={styles.userContent}>
            <View style={styles.userHeaderRow}>
              <Text style={styles.userName}>{fullName}</Text>
              <View style={[styles.typeBadge, type === 'student' ? styles.studentBadge : styles.parentBadge]}>
                <Text style={[styles.typeBadgeText, type === 'student' ? styles.studentBadgeText : styles.parentBadgeText]}>
                  {type === 'student' ? 'Student' : 'Parent'}
                </Text>
              </View>
            </View>

            <Text style={styles.userMeta}>{safeItem.email || 'No email provided'}</Text>
            <Text style={styles.userMeta}>{safeItem.phone || 'No phone provided'}</Text>

            {type === 'student' && safeItem.academic_level ? (
              <Text style={styles.userHint}>Level: {safeItem.academic_level}</Text>
            ) : null}

            {type === 'parent' && (safeItem.parentf || safeItem.parentl) ? (
              <Text style={styles.userHint}>Child: {(safeItem.parentf ?? '').trim()} {(safeItem.parentl ?? '').trim()}</Text>
            ) : null}
          </View>
        </View>
      </Animated.View>
    );
  };

  const hasResults = students.length > 0 || parents.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Service Members</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {serviceTitle ? String(serviceTitle) : 'Assigned students and parents'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.infoCard}>
          <Text style={styles.infoTitle}>People linked to this service</Text>
          <Text style={styles.infoText}>Students and parents assigned through this service appear below.</Text>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading service members...</Text>
          </View>
        ) : null}

        {!loading && message ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={42} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>{message}</Text>
          </View>
        ) : null}

        {!loading && hasResults ? (
          <View style={styles.resultsWrap}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Students</Text>
              <Text style={styles.sectionCount}>{students.length}</Text>
            </View>
            {students.map((student, index) => renderUserCard(student, 'student', index))}

            <View style={[styles.sectionHeader, styles.parentsHeader]}>
              <Text style={styles.sectionTitle}>Parents</Text>
              <Text style={styles.sectionCount}>{parents.length}</Text>
            </View>
            {parents.map((parent, index) => renderUserCard(parent, 'parent', index))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    marginRight: 14,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 90,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  infoText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
  },
  loadingWrap: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textLight,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 36,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  resultsWrap: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  parentsHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sectionCount: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentAvatar: {
    backgroundColor: COLORS.student,
  },
  parentAvatar: {
    backgroundColor: COLORS.parent,
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 18,
  },
  studentAvatarText: {
    color: COLORS.studentText,
  },
  parentAvatarText: {
    color: COLORS.parentText,
  },
  userContent: {
    flex: 1,
  },
  userHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  studentBadge: {
    backgroundColor: COLORS.student,
  },
  parentBadge: {
    backgroundColor: COLORS.parent,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  studentBadgeText: {
    color: COLORS.studentText,
  },
  parentBadgeText: {
    color: COLORS.parentText,
  },
  userMeta: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textLight,
  },
  userHint: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
});