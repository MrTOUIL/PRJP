import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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

type SearchUser = {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  academic_level?: string;
  parentf?: string;
  parentl?: string;
};

export default function AddStudent() {
  const router = useRouter();
  const { serviceid, serviceTitle } = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<SearchUser[]>([]);
  const [parents, setParents] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingActionKey, setPendingActionKey] = useState('');

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      if (!serviceid) {
        return;
      }

      try {
        setLoading(true);
        setMessage('');

        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const searchQuery = query.trim();

        fetch(`${BASE_URL}/teacher/searchusers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query: searchQuery , serviceid: String(serviceid)}),
        })
          .then(res => res.json())
          .then(data => {
            if (data.succ && Array.isArray(data.students) && Array.isArray(data.parents)) {
              setStudents(data.students);
              setParents(data.parents);
              if (data.students.length === 0 && data.parents.length === 0) {
                setMessage(searchQuery ? 'No matching users found.' : 'No users found.');
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
                    fetch(`${BASE_URL}/teacher/searchusers`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${refreshData.accessToken}`,
                      },
                      body: JSON.stringify({ query: searchQuery , serviceid: String(serviceid)}),
                    })
                      .then(res => res.json())
                      .then(retryData => {
                        if (retryData.succ && Array.isArray(retryData.students) && Array.isArray(retryData.parents)) {
                          setStudents(retryData.students);
                          setParents(retryData.parents);
                          if (retryData.students.length === 0 && retryData.parents.length === 0) {
                            setMessage(searchQuery ? 'No matching users found.' : 'No users found.');
                          }
                        } else if (retryData.error === 'Invalid token!' || retryData.error === 'No token found!') {
                          router.replace('/sign_in');
                        } else if (retryData.error) {
                          setMessage('Unable to load users.');
                        }
                      })
                      .catch(() => {
                        setMessage('Unable to load users.');
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  } else {
                    router.replace('/sign_in');
                    setLoading(false);
                  }
                })
                .catch(() => {
                  router.replace('/sign_in');
                  setLoading(false);
                });
            } else if (data.error === 'Invalid token!' || data.error === 'No token found!') {
              router.replace('/sign_in');
            } else {
              setMessage('Unable to load users.');
            }
          })
          .catch(() => {
            setMessage('Unable to load users.');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setMessage('Unable to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query, serviceid, router]);

  const addUserToService = async (item: SearchUser, type: 'student' | 'parent'): Promise<void> => {
    if (!serviceid || !item._id) {
      return;
    }

    const actionKey = `${type}-${item._id}`;
    setPendingActionKey(actionKey);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const bodyKey = type === 'student' ? 'studentid' : 'parentid';
      const route = type === 'student' ? '/teacher/addstudent' : '/teacher/addparent';

      const sendRequest = (token: string | null) => {
        return fetch(`${BASE_URL}${route}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serviceid: String(serviceid), [bodyKey]: item._id }),
        });
      };

      const handleResponse = async (data: any): Promise<boolean> => {
        if (data.succ) {
          router.back();
          return true;
        }

        if (data.error === 'Token expired!') {
          const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          const refreshData = await refreshResponse.json();
          if (refreshData.accessToken) {
            await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
            const retryResponse = await sendRequest(refreshData.accessToken);
            const retryData = await retryResponse.json();
            if (retryData.succ) {
              router.back();
              return true;
            }

            if (retryData.error === 'Invalid token!' || retryData.error === 'No token found!') {
              router.replace('/sign_in');
            }
            return false;
          }

          router.replace('/sign_in');
          return false;
        }

        if (data.error === 'Invalid token!' || data.error === 'No token found!') {
          router.replace('/sign_in');
        }

        return false;
      };

      const response = await sendRequest(accessToken);
      const data = await response.json();
      const succeeded = await handleResponse(data);

      if (succeeded) {
        setQuery('');
      } else if (data.error && data.error !== 'Token expired!') {
        setMessage('Unable to complete request.');
      }
    } catch (error) {
      setMessage('Unable to complete request.');
    } finally {
      setPendingActionKey('');
    }
  };

  const renderUserCard = (item: SearchUser, type: 'student' | 'parent', index: number) => {
    const fullName = `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || 'Unnamed user';
    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('') || 'U';

    return (
      <Animated.View key={`${type}-${item._id ?? index}`} entering={FadeInDown.delay(index * 80).springify()}>
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

            <Text style={styles.userMeta}>{item.email || 'No email provided'}</Text>
            <Text style={styles.userMeta}>{item.phone || 'No phone provided'}</Text>

            {type === 'student' && item.academic_level ? (
              <Text style={styles.userHint}>Level: {item.academic_level}</Text>
            ) : null}

            {type === 'parent' && (item.parentf || item.parentl) ? (
              <Text style={styles.userHint}>Child: {(item.parentf ?? '').trim()} {(item.parentl ?? '').trim()}</Text>
            ) : null}
            <TouchableOpacity
              style={[styles.addNowButton, pendingActionKey === `${type}-${item._id}` && styles.addNowButtonDisabled]}
              onPress={() => addUserToService(item, type)}
              disabled={pendingActionKey === `${type}-${item._id}`}
            >
              {pendingActionKey === `${type}-${item._id}` ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.addNowButtonText}>Add Now</Text>
              )}
            </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Add Student</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {serviceTitle ? `Search users for ${String(serviceTitle)}` : 'Search users to attach to this service'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name"
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).springify()} style={styles.infoCard}>
          <Text style={styles.infoTitle}>Search starts as you type</Text>
          <Text style={styles.infoText}>
            Teachers can look up students and parents by first or last name.
          </Text>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : null}

        {!loading && message ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-search-outline" size={42} color={COLORS.textLight} />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
  },
  clearBtn: {
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
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
  addNowButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addNowButtonDisabled: {
    opacity: 0.8,
  },
  addNowButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});