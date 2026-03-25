import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  { label: 'Sessions', value: '18' },
  { label: 'Documents', value: '9' },
  { label: 'Qoutes', value: '3' },
];

const PERSONAL_INFO: InfoRow[] = [
  { icon: 'person-outline', label: 'Full Name', value: 'Karima Benali', iconColor: '#3B82F6', iconBg: '#DBEAFE' },
  { icon: 'mail-outline', label: 'Email', value: 'k.benali@eleve.dz', iconColor: '#8B5CF6', iconBg: '#EDE9FE' },
  { icon: 'call-outline', label: 'Phone', value: '+213 550 123 456', iconColor: '#14B8A6', iconBg: '#CCFBF1' },
  { icon: 'location-outline', label: 'Address / Location', value: 'Alger, Bab Ezzouar', iconColor: '#F97316', iconBg: '#FFEDD5' },
];

const ACADEMIC_INFO: InfoRow[] = [
  { icon: 'school-outline', label: 'School Level', value: 'Terminale S', iconColor: '#4F46E5', iconBg: '#E0E7FF' },
  { icon: 'library-outline', label: 'Subjects · Level Concerned', value: 'Mathematics, Physics', iconColor: '#0EA5E9', iconBg: '#E0F2FE' },
  { icon: 'laptop-outline', label: 'Preferred Session Mode', value: 'Online - Hybrid', iconColor: '#10B981', iconBg: '#D1FAE5' },
  { icon: 'person-circle-outline', label: 'Parent / Guardian', value: 'Mohamed Benali', iconColor: '#EC4899', iconBg: '#FCE7F3' },
];

const DESCRIPTION =
  'Motivated Terminale S student with a strong interest in Mathematics and Physics. I approach studies with determination and focus, and prefer clear study progress to work effectively.';

const GOALS = [
  'Work on exam simulations every week.',
  'Master key concepts in Mathematics and Physics.',
  'Build confidence before final tests.',
];

const GOALS_ORB_SIZE = 118;
const GOALS_ORB_PADDING = 10;

export default function Sprofile() {
  const router = useRouter();
  const [goalsSectionSize, setGoalsSectionSize] = useState({ width: 0, height: 0 });
  const headerWavePulse = useSharedValue(1);
  const headerWaveDrift = useSharedValue(0);
  const headerShimmerX = useSharedValue(-1);
  const goalsOrbX = useSharedValue(0);

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

    const maxX = Math.max(goalsSectionSize.width - GOALS_ORB_SIZE - GOALS_ORB_PADDING * 2, 0);

    goalsOrbX.value = 0;

    if (maxX > 0) {
      goalsOrbX.value = withRepeat(
        withSequence(
          withTiming(maxX, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [
    goalsOrbX,
    goalsSectionSize.width,
    headerShimmerX,
    headerWaveDrift,
    headerWavePulse,
  ]);

  const handleGoalsSectionLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const nextWidth = Math.round(width);
    const nextHeight = Math.round(height);

    setGoalsSectionSize(prev => {
      if (prev.width === nextWidth && prev.height === nextHeight) {
        return prev;
      }

      return { width: nextWidth, height: nextHeight };
    });
  };

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

  const goalsOrbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: goalsOrbX.value }],
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
              <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.headerIconButton}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>K</Text>
            </View>
            <Text style={styles.name}>Karima Benali</Text>
            <Text style={styles.level}>Terminale S</Text>
          </View>
        </View>

        <View style={styles.statsCardWrap}>
          <View style={styles.statsCard}>
            {STATS.map((item, index) => (
              <View key={item.label} style={[styles.statItem, index < STATS.length - 1 && styles.statBorder]}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.contentBody}>
          <SectionCard title="Personal Information" rows={PERSONAL_INFO} />
          <SectionCard title="Academic Profile" rows={ACADEMIC_INFO} splitCards />

          <View style={styles.block}>
            <Text style={styles.blockTitle}>Pedagogical Description</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{DESCRIPTION}</Text>
            </View>
          </View>

          <View style={styles.block}>
            <View style={styles.goalsSection} onLayout={handleGoalsSectionLayout}>
              <Animated.View pointerEvents="none" style={[styles.goalsOrb, goalsOrbAnim]} />

              <View style={styles.goalsHeader}>
                <Ionicons name="star" size={17} color="#1E1B6B" />
                <Text style={styles.goalsHeaderText}>Learning Objectives</Text>
              </View>

              <View style={styles.goalsCard}>
                {GOALS.map(goal => (
                  <View key={goal} style={styles.goalRow}>
                    <Text style={styles.goalText}>{goal.replace(/\.$/, '')}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton}  onPress={()=> router.push('/(student_space)/EditProfile')}>
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={()=> {router.push('/(signin)/log_out')}}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.secondaryButtonText}>Log Out</Text>
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
  goalsSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1E8CE',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  goalsOrb: {
    position: 'absolute',
    width: GOALS_ORB_SIZE,
    height: GOALS_ORB_SIZE,
    borderRadius: GOALS_ORB_SIZE / 2,
    top: GOALS_ORB_PADDING,
    left: GOALS_ORB_PADDING,
    backgroundColor: '#F2E9D1',
    opacity: 0.88,
  },
  goalsHeader: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  goalsHeaderText: {
    marginLeft: 9,
    color: '#1E1B6B',
    fontSize: 17,
    fontWeight: '800',
  },
  goalsCard: {
    marginTop: 6,
    gap: 10,
    zIndex: 2,
  },
  goalRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#EDE6D5',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  goalText: {
    flex: 1,
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
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

