import React from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1E1B6B',
  secondary: '#FFD700',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1E293B',
  textLight: '#475569',
  paleBlue: '#E8EEFF',
  paleGold: '#FFF4CC',
};

const featureCards = [
  {
    icon: <FontAwesome5 name="chalkboard-teacher" size={22} color={COLORS.primary} />,
    title: 'Verified Teachers',
    description: 'Discover teachers, their subjects, and the services they offer in one clean overview.',
  },
  {
    icon: <FontAwesome5 name="user-graduate" size={22} color={COLORS.primary} />,
    title: 'Student Progress',
    description: 'Follow sessions, service links, and progress-oriented learning paths built for every student.',
  },
  {
    icon: <FontAwesome5 name="users" size={22} color={COLORS.primary} />,
    title: 'Parent Involvement',
    description: 'Keep parents informed with a smoother view of activity, sessions, and learning support.',
  },
];

const highlightCards = [
  {
    title: 'Quality courses',
    subtitle: 'A place for structured learning and focused support.',
    color: COLORS.paleBlue,
  },
  {
    title: 'Flexible services',
    subtitle: 'Explore service types that match learning goals and timing needs.',
    color: COLORS.paleGold,
  },
  {
    title: 'Trusted experience',
    subtitle: 'Built to feel friendly, simple, and reliable for guest visitors.',
    color: '#FFFFFF',
  },
];

export default function LearnMorePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Learn More</Text>
          <Text style={styles.headerSubtitle}>Guest mode overview of ALEMNI Online</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="book-open-page-variant" size={18} color={COLORS.primary} />
              <Text style={styles.heroBadgeText}>Guest view</Text>
            </View>
            <View style={styles.heroMiniTag}>
              <FontAwesome5 name="star" size={12} color={COLORS.secondary} />
              <Text style={styles.heroMiniTagText}>Education made simple</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>See what the platform offers before signing in.</Text>
          <Text style={styles.heroText}>
            ALEMNI Online connects teachers, students, and parents in a simple learning ecosystem where services,
            sessions, and progress all stay organized.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={[styles.statPill, { backgroundColor: COLORS.paleBlue }]}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>roles</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: COLORS.paleGold }]}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>platform</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: '#EEF9F0' }]}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>access</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>What you can explore</Text>
          <View style={styles.featureList}>
            {featureCards.map((item, index) => (
              <Animated.View key={item.title} entering={FadeInUp.delay(index * 100).duration(450)} style={styles.featureCard}>
                <View style={styles.featureIconWrap}>{item.icon}</View>
                <View style={styles.featureTextWrap}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDescription}>{item.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(180)} style={styles.section}>
          <Text style={styles.sectionTitle}>Why it feels different</Text>
          <View style={styles.highlightGrid}>
            {highlightCards.map((item, index) => (
              <View key={item.title} style={[styles.highlightCard, { backgroundColor: item.color }]}>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                <Text style={styles.highlightSubtitle}>{item.subtitle}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(260)} style={styles.section}>
          <Text style={styles.sectionTitle}>Guest mode idea</Text>
          <View style={styles.infoPanel}>
            <Text style={styles.infoText}>
              This page works as a light guest mode landing area. Visitors can understand the app before creating an
              account, while the sign-in and sign-up flow stays one tap away.
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(340)} style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to continue?</Text>
          <Text style={styles.ctaText}>Sign in or create a free account to access your personalized dashboard.</Text>
          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/signin')}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/signup')}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    marginRight: 14,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
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
    paddingBottom: 80,
  },
  heroCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.paleBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  heroMiniTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7D6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroMiniTagText: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    marginTop: 16,
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.textDark,
    fontWeight: '800',
  },
  heroText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textLight,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  statPill: {
    flex: 1,
    minWidth: 92,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  featureDescription: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
  },
  highlightGrid: {
    gap: 12,
  },
  highlightCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(30,41,59,0.08)',
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  highlightSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textLight,
  },
  infoPanel: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textLight,
  },
  ctaCard: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 18,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  ctaText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.86)',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: width * 0.3,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: width * 0.3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: '800',
  },
});