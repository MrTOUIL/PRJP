import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { FontAwesome5, Ionicons, MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define theme colors based on the image and existing project style
const COLORS = {
  primary: '#1E1B6B',      // Deep Blue
  secondary: '#FFD700',    // Gold
  background: '#F8FAFC',   // Light Blue-Grey
  cardBg: '#FFFFFF',
  textDark: '#1E293B',     // Dark Slate
  textLight: '#64748B',    // Slate
  green: '#10B981',        // Emerald
  red: '#EF4444',
  purpleStart: '#2E2E8C',
  purpleEnd: '#1A1A5E',
};

const { width } = Dimensions.get('window');

// Reusable Components

const SectionHeader = ({ title, actionText, onAction }: { title: string; actionText?: string; onAction?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionText && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function TeacherSpace() {
  const router = useRouter();

  // Animations like SignIn/SignUp
  const floatAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    // Floating animation for header elements or cards
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Pulse animation for critical buttons (Start Session)
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  // Mock Data
  const stats = [
    { id: 1, value: '18', label: 'SESSIONS', icon: 'calendar-alt', color: '#FF6B6B' },
    { id: 2, value: '9', label: 'STUDENTS', icon: 'user-graduate', color: '#FFD700' },
    { id: 3, value: '4.9', label: 'RATING', icon: 'star', color: '#FFD700' },
  ];

  const requests = [
    { id: 1, name: 'Boutagga W.', school: 'Terminale S', subject: 'Maths', type: 'Online', price: '800 DZD', initial: 'B', color: '#00C853' },
    { id: 2, name: 'Amira D.', school: 'Lycée 2AS', subject: 'Maths', type: 'Hybrid', price: '700 DZD', initial: 'A', color: '#FF9800' },
    { id: 3, name: 'Yacine K.', school: 'Terminale M', subject: 'Physics', type: 'Online', price: '800 DZD', initial: 'Y', color: '#2962FF' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Section - Matching Student Space Design */}
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
        {/* Top Right Curve Decoration */}
        <View style={styles.topRightCurveContainer}>
            <View style={styles.topRightCurve} />
            <Image
                source={require('../../assets/images/Logo_nobg.png')}
                style={styles.headerLogo}
                resizeMode="contain"
            />
        </View>

        <View style={styles.headerContent}>
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>K</Text>
                </View>
                <View>
                    <Text style={styles.greetingText}>Welcome back,</Text>
                    <Text style={styles.userName}>Karim Hadj</Text>
                </View>
            </View>
        </View>

        <View style={styles.searchRow}>
            <Animated.View entering={FadeInUp.delay(100).duration(600).springify()} style={styles.searchContainer}>
                <Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search students, subjects..."
                    placeholderTextColor="#94A3B8"
                    style={styles.searchInput}
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options" size={14} color="#FFFFFF" />
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
                <View style={styles.notificationBadge} />
            </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Quick Filters / Tabs */}
        <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 5}}>
              {['All', 'Sessions', 'Requests', 'Services'].map((tab, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.filterChip, index === 0 && styles.filterChipActive]}
                  onPress={() => {
                    if (tab === 'Sessions') router.push('/(teacher_space)/teacherSessions');
                    else if (tab === 'Requests') router.push('/(teacher_space)/notification');
                    else if (tab === 'Services') router.push('/(teacher_space)/servicePdg');
                  }}
                >
                  {index === 0 && <AntDesign name="appstore-o" size={14} color="#fff" style={{marginRight: 6}} />}
                  <Text style={[styles.filterLabel, index === 0 && styles.filterLabelActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </Animated.View>
        
        {/* Stats Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={stat.id} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Upcoming Session */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionContainer}>
          <SectionHeader title="Upcoming Session" actionText="View all" />
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingContent}>
                <View style={styles.upcomingBadge}>
                    <Ionicons name="time" size={12} color={COLORS.primary} />
                    <Text style={styles.upcomingBadgeText}>IN 2 HOURS</Text>
                </View>
                <Text style={styles.upcomingTitle}>Advanced Mathematics</Text>
                <Text style={styles.upcomingSubtitle}>with Boutagga Wafa • Online</Text>
                <Text style={styles.upcomingTime}>Fri 27 Feb • 14:00 - 15:30</Text>
            </View>
            
            <AnimatedTouchableOpacity style={[styles.startButton, animatedPulseStyle]}>
                <Text style={styles.startButtonText}>Start</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </AnimatedTouchableOpacity>
          </View>
        </Animated.View>

        {/* Student Requests */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionContainer}>
           <SectionHeader title="Student Requests" actionText="See all" />
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
             {requests.map((req, idx) => (
               <View key={req.id} style={styles.requestCard}>
                 <View style={[styles.requestAvatar, { backgroundColor: req.color }]}>
                   <Text style={styles.requestAvatarText}>{req.initial}</Text>
                 </View>
                 <Text style={styles.reqName}>{req.name}</Text>
                 <Text style={styles.reqSchool}>{req.school}</Text>
                 
                 <View style={styles.reqTag}>
                    <Text style={styles.reqTagText}>{req.subject}</Text>
                 </View>

                 <Text style={styles.reqPrice}>{req.price}</Text>

                 <View style={styles.reqActions}>
                   <TouchableOpacity style={styles.acceptBtn}>
                     <Text style={styles.acceptBtnText}>Accept</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             ))}
           </ScrollView>
        </Animated.View>

        {/* My Active Services */}
         <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionContainer}>
           <SectionHeader title="My Active Services" actionText="Browse all" />
           
           <TouchableOpacity style={styles.addServiceBtn}>
             <Text style={styles.addServiceText}>+ Add New Service</Text>
           </TouchableOpacity>

           <View style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={[styles.serviceIcon, { backgroundColor: '#1A237E' }]}>
                  <Text style={styles.serviceIconText}>M</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>Advanced Mathematics</Text>
                  <Text style={styles.serviceSubtitle}>Karim Hadj • Terminale S</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.servicePrice}>800 DZD</Text>
                  <Text style={styles.servicePriceUnit}>/session</Text>
                </View>
              </View>
              
              <View style={styles.serviceTags}>
                <View style={styles.smallTag}><Feather name="clock" size={12} color="#94A3B8"/><Text style={styles.smallTagText}>90 min</Text></View>
                <View style={styles.smallTag}><Feather name="video" size={12} color="#94A3B8"/><Text style={styles.smallTagText}>Online</Text></View>
              </View>

              <TouchableOpacity style={styles.editServiceBtn}>
                <Text style={styles.editServiceText}>Manage Service</Text>
              </TouchableOpacity>
           </View>
         </Animated.View>

         {/* Recent Reviews */}
         <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionContainer}>
            <SectionHeader title="Recent Reviews" actionText="See all" />
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                 <View style={[styles.reviewAvatar, { backgroundColor: '#00C853' }]}>
                   <Text style={styles.reviewAvatarText}>B</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                   <Text style={styles.reviewName}>Boutagga Wafa</Text>
                   <View style={styles.starsRow}>
                     {[1,2,3,4,5].map(i => <FontAwesome5 key={i} name="star" solid size={10} color="#FFD700" style={{marginRight: 2}} />)}
                   </View>
                 </View>
                 <Text style={styles.reviewDate}>28 Feb</Text>
              </View>
              <Text style={styles.reviewText}>
                Excellent teacher! Very clear explanations and always on time.
              </Text>
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
    backgroundColor: COLORS.primary, // Deep Blue
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  topRightCurveContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 118,
    height: 62,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2,
  },
  topRightCurve: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 48,
    opacity: 0.1, // Subtle
  },
  headerLogo: {
    width: 80,
    height: 40,
    marginRight: 10,
    zIndex: 3,
    tintColor: '#fff', // If it's a monochrome logo, otherwise remove tint
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  greetingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 14,
  },
  filterButton: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#2C2E83',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterRow: {
    marginVertical: 15,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  filterLabelActive: {
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sectionAction: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  upcomingCard: {
    backgroundColor: '#2E2E8B', // Darker Blue variant
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  upcomingContent: {
    flex: 1,
    marginRight: 15,
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)', // Gold tint
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  upcomingBadgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  upcomingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  upcomingSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 6,
  },
  upcomingTime: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 14,
  },
  requestCard: {
    backgroundColor: '#fff',
    width: 140,
    minHeight: 180,
    padding: 15,
    borderRadius: 22,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 10,
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  reqName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  reqSchool: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  reqTag: {
    backgroundColor: '#F1F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  reqTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2A3188',
  },
  reqPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 12,
  },
  reqActions: {
    width: '100%',
  },
  acceptBtn: {
    backgroundColor: '#1D247F',
    width: '100%',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  addServiceBtn: {
    backgroundColor: '#1D247F', // Use primary variant
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#1D247F',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  addServiceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D247F',
  },
  servicePriceUnit: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  serviceTags: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  smallTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  smallTagText: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
    marginLeft: 4,
  },
  editServiceBtn: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editServiceText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
});