import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type ProfileStat = {
  label: string;
  value: string;
};

type InfoRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
};

const STATS: ProfileStat[] = [
  { label: 'Sessions', value: '0' },
  { label: 'Services', value: '0' },
  { label: 'Requests', value: '0' },
];

export default function Sprofile() {
  const router = useRouter();
  const { profileData } = useLocalSearchParams<{ profileData?: string }>();
  const [profilePayload, setProfilePayload] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const headerWavePulse = useSharedValue(1);
  const headerWaveDrift = useSharedValue(0);
  const headerShimmerX = useSharedValue(-1);

  const normalizeList = (value: any) => (Array.isArray(value) ? value : []);
  const buildInitial = (firstName?: string, lastName?: string) => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    return fullName ? fullName.charAt(0).toUpperCase() : 'S';
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('studentProfileData');
      setLogoutLoading(false);
      router.replace('/(welcome page)/welcomePage');
    } catch (e) {
      setLogoutLoading(false);
      console.error('Error logging out:', e);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        if (typeof profileData === 'string' && profileData.trim()) {
          try {
            const parsed = JSON.parse(decodeURIComponent(profileData));
            if (!cancelled) {
              setProfilePayload(parsed);
              return;
            }
          } catch (parseError) {
            console.error('Failed to parse profile params', parseError);
          }
        }

        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const apiRole = await getStudentOrParentRole();

        const fetchProfile = async (token: string | null | undefined) => {
          return fetch(`${BASE_URL}/${apiRole}/getProfile`, {
            method: 'GET',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          });
        };

        let response = await fetchProfile(accessToken);
        let data = await response.json();

        if (data?.error === 'Token expired!') {
          const refreshResponse = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshResponse.json();

          if (refreshData.accessToken) {
            await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
            response = await fetchProfile(refreshData.accessToken);
            data = await response.json();
          } else {
            router.replace('/sign_in');
            return;
          }
        }

        if (!cancelled) {
          setProfilePayload(data?.student ? data : null);
        }
      } catch (error) {
        console.error('loadProfile error', error);
        if (!cancelled) {
          setProfilePayload(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profileData, router]);

  const student = profilePayload?.student || {};
  const sessions = normalizeList(profilePayload?.StudentSessions);
  const requests = normalizeList(profilePayload?.myRequests);
  const evaluations = normalizeList(profilePayload?.myEvaluations);
  const joinedServices = normalizeList(profilePayload?.joinedServices);

  const stats: ProfileStat[] = [
    { label: 'Sessions', value: String(sessions.length) },
    { label: 'Services', value: String(joinedServices.length) },
    { label: 'Requests', value: String(requests.length) },
  ];

  const personalInfo: InfoRow[] = [
    { icon: 'person-outline', label: 'Full Name', value: `${student.first_name || student.firstName || ''} ${student.last_name || student.lastName || ''}`.trim() || 'Student', iconColor: '#3B82F6', iconBg: '#DBEAFE' },
    ...(student.role === 'parent' ? [{ icon: 'person-circle-outline' as const, label: 'Child Name', value: `${student.parentf || ''} ${student.parentl || ''}`.trim() || 'Not available', iconColor: '#F59E0B', iconBg: '#FEF3C7' }] : []),
    { icon: 'mail-outline', label: 'Email', value: student.email || student.mail || 'Not available', iconColor: '#8B5CF6', iconBg: '#EDE9FE' },
    { icon: 'call-outline', label: 'Phone', value: student.phone || 'Not available', iconColor: '#14B8A6', iconBg: '#CCFBF1' },
    { icon: 'location-outline', label: 'Address / Location', value: student.postal_adress || student.address || 'Not available', iconColor: '#F97316', iconBg: '#FFEDD5' },
  ];

  const academicInfo: InfoRow[] = [
    { icon: 'school-outline', label: 'School Level', value: student.academic_level || 'Not available', iconColor: '#4F46E5', iconBg: '#E0E7FF' },
  ];

  const description = student.description || student.pedagogical_description || 'No pedagogical description available yet.';
  const profileTitle = student.role === 'parent'
    ? `${student.parentf || ''} ${student.parentl || ''}`.trim() || 'Parent Profile'
    : `${student.first_name || student.firstName || ''} ${student.last_name || student.lastName || ''}`.trim() || 'Student Profile';

  useEffect(() => {
    headerWavePulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    headerWaveDrift.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(-12, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    headerShimmerX.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );

  }, [
    headerShimmerX,
    headerWaveDrift,
    headerWavePulse,
  ]);

  const headerWaveAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: headerWaveDrift.value },
      { translateY: headerWaveDrift.value * -0.4 },
      { scale: headerWavePulse.value },
    ],
  }));

  const headerShimmerAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(headerShimmerX.value, [-1, 1], [-260, 260]),
      },
      { rotate: '-12deg' },
    ],
    opacity: 0.1,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View pointerEvents="none" style={styles.headerBgLayer}>
            <Animated.View pointerEvents="none" style={[styles.headerWave, headerWaveAnim]} />
            <Animated.View pointerEvents="none" style={[styles.headerShimmer, headerShimmerAnim]} />
          </View>

          <View style={styles.headerForeground}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity style={styles.headerIconButton} onPress={() => router.replace('/(student_space)/studentSpace')}>
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.headerIconButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{buildInitial(student.role === 'parent' ? student.parentf : (student.first_name || student.firstName), student.role === 'parent' ? student.parentl : (student.last_name || student.lastName))}</Text>
            </View>
            <Text style={styles.name}>{profileTitle}</Text>
            <Text style={styles.level}>{student.academic_level || 'Student'}</Text>
          </View>
        </View>

        <View style={styles.contentBody}>
          <SectionCard title={student.role === 'parent' ? 'Personal information of parent' : 'Personal Information'} rows={personalInfo} />
          <SectionCard title="Academic Profile" rows={academicInfo} splitCards />

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Pedagogical Description</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton}  onPress={()=> router.push('/(student_space)/EditProfile')}>
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout} disabled={logoutLoading}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.secondaryButtonText}>{logoutLoading ? 'Logging out...' : 'Log Out'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({
  title,
  rows,
  splitCards = false,
}: {
  title: string;
  rows: InfoRow[];
  splitCards?: boolean;
}) {
  const renderRow = (row: InfoRow, withBorder: boolean) => (
    <View key={row.label} style={[styles.row, withBorder && styles.rowBorder]}>
      <View style={styles.rowMain}>
        <View style={[styles.rowIconWrap, { backgroundColor: row.iconBg }]}>
          <Ionicons name={row.icon} size={15} color={row.iconColor} />
        </View>

        <View style={styles.rowTextWrap}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={15} color="#CBD5E1" />
    </View>
  );

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {!splitCards ? (
        <View style={styles.infoCard}>
          {rows.map((row, index) => renderRow(row, index < rows.length - 1))}
        </View>
      ) : (
        <View style={styles.infoCardsStack}>
          {rows.map(row => (
            <View key={row.label} style={styles.infoCardSingle}>
              {renderRow(row, false)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F3FF',
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#2A1A95',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 34,
    position: 'relative',
    overflow: 'visible',
  },
  headerBgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerForeground: {
    zIndex: 2,
  },
  headerWave: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 240,
    height: 220,
    backgroundColor: '#2E2E8B',
    borderBottomLeftRadius: 240,
    borderTopLeftRadius: 120,
    opacity: 0.35,
    zIndex: 1,
  },
  headerShimmer: {
    position: 'absolute',
    top: 30,
    left: -80,
    width: 90,
    height: 220,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 60,
    zIndex: 1,
  },
  contentBody: {
    marginTop: 14,
    paddingHorizontal: 14,
  },
  statsCardWrap: {
    marginTop: 8,
    paddingHorizontal: 18,
    zIndex: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  name: {
    marginTop: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  level: {
    marginTop: 4,
    color: '#BDBDE8',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#F2F4FA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8DDEB',
    flexDirection: 'row',
    paddingVertical: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: '#D6DBEA',
  },
  statValue: {
    color: '#2C3274',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statLabel: {
    marginTop: 4,
    color: '#A0A6B8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  block: {
    marginTop: 16,
  },
  blockTitle: {
    color: '#28314A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE4F0',
    paddingHorizontal: 14,
  },
  infoCardsStack: {
    gap: 14,
  },
  infoCardSingle: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE4F0',
    paddingHorizontal: 14,
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 8,
  },
  rowLabel: {
    color: '#9AA3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  rowValue: {
    color: '#1F2937',
    fontSize: 25 / 2,
    fontWeight: '700',
    marginTop: 4,
    flexShrink: 1,
  },
  descriptionCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE4F0',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  descriptionText: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 18,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  secondaryButtonText: {
    marginLeft: 8,
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});

