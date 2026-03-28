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
  primary: '#1A1A5E', // Deep Blue / Purple from header
  secondary: '#FFD700', // Yellow accent
  background: '#F5F6FA', // Light Gray background
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  green: '#00C853',
  red: '#FF3D00',
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
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <SafeAreaView>

          {/* Top Logo and Background */}
          <View style={styles.brandingContainer}>
            <View style={styles.whiteCurveContainer}>
                <Image 
                    source={require('../../assets/images/Logo_nobg.png')} 
                    style={styles.brandingLogo} 
                    resizeMode="contain"
                />
            </View>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.profileRow}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>K</Text>
                <View style={styles.onlineBadge} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Karim Hadj</Text>
                <View style={styles.roleTag}>
                  <FontAwesome5 name="chalkboard-teacher" size={12} color="#FFD700" style={{ marginRight: 5 }} />
                  <Text style={styles.roleText}>Teacher • <Text style={{color: '#FFD700'}}>Mathematics & Physics</Text></Text>
                </View>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput 
                placeholder="Search students, subjects, files..." 
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Horizontal Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={{ paddingRight: 20 }}>
              {[
                { label: 'All', route: null, icon: 'appstore-o', active: true },
                { label: 'My Sessions', route: '/(teacher_space)/teacherSessions', icon: null },
                { label: 'Requests', route: '/(teacher_space)/teacherRequests', icon: null },
                { label: 'Services', route: '/(teacher_space)/servicePdg', icon: null }
              ].map((tab, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.tabItem, tab.active ? styles.activeTabItem : styles.inactiveTabItem]}
                  onPress={() => tab.route ? router.push(tab.route as any) : {}}
                  activeOpacity={0.8}
                >
                  {tab.icon && <AntDesign name={tab.icon as any} size={16} color="#fff" style={{marginRight: 6}} />}
                  <Text style={[styles.tabText, tab.active ? styles.activeTabText : styles.inactiveTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Stats Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={stat.id} style={styles.statCard}>
              <FontAwesome5 name={stat.icon} size={20} color={stat.color} style={{ marginBottom: 8 }} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Upcoming Session */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionContainer}>
          <SectionHeader title="Upcoming Session" actionText="View all" />
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <View style={styles.upcomingBadge}>
                <MaterialIcons name="alarm" size={14} color="#FFD700" />
                <Text style={styles.upcomingBadgeText}>IN 2 HOURS</Text>
              </View>
            </View>
            <Text style={styles.upcomingTitle}>Advanced Mathematics</Text>
            <Text style={styles.upcomingSubtitle}>with Boutagga Wafa • Online</Text>
            
            <View style={styles.upcomingFooter}>
              <View style={styles.dateTimeRow}>
                <Feather name="calendar" size={14} color="#A0A0E0" />
                <Text style={styles.dateTimeText}>Fri 27 Feb</Text>
                <Feather name="clock" size={14} color="#A0A0E0" style={{ marginLeft: 10 }} />
                <Text style={styles.dateTimeText}>14:00 - 15:30</Text>
              </View>
              <AnimatedTouchableOpacity style={[styles.startButton, animatedPulseStyle]}>
                <Text style={styles.startButtonText}>Start</Text>
                <AntDesign name="arrowright" size={16} color={COLORS.primary} />
              </AnimatedTouchableOpacity>
            </View>
            
            {/* Abstract Background Decoration */}
            <View style={styles.cardDecorationCircle} />
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
                 
                 <View style={styles.reqTags}>
                   <View style={styles.reqTag}>
                      <Text style={styles.reqTagText}>{req.subject}</Text>
                   </View>
                   <View style={[styles.reqTag, {marginLeft: 5, backgroundColor: req.type === 'Online' ? '#E3F2FD' : '#FFF3E0'}]}>
                      <Text style={[styles.reqTagText, {color: req.type === 'Online' ? '#2196F3' : '#FF9800'}]}>{req.type}</Text>
                   </View>
                 </View>

                 <Text style={styles.reqPrice}>{req.price}<Text style={styles.reqPriceUnit}>/session</Text></Text>

                 <View style={styles.reqActions}>
                   <TouchableOpacity style={styles.acceptBtn}>
                     <Text style={styles.acceptBtnText}>Accept</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.declineBtn}>
                     <Text style={styles.declineBtnText}>Decline</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             ))}
           </ScrollView>
        </Animated.View>

        {/* My Active Services */}
         <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionContainer}>
           <SectionHeader title="My Active Services" actionText="Browse all" />


           <View style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={[styles.serviceIcon, { backgroundColor: '#1A237E' }]}>
                  <Text style={styles.serviceIconText}>M</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>Advanced Mathematics</Text>
                  <Text style={styles.serviceSubtitle}>Karim Hadj • Terminale S</Text>
                </View>
                <View>
                  <Text style={styles.servicePrice}>800 DZD</Text>
                  <Text style={styles.servicePriceUnit}>/session</Text>
                </View>
              </View>
              
              <View style={styles.serviceTags}>
                <View style={styles.smallTag}><Feather name="clock" size={12} color="#666"/><Text style={styles.smallTagText}>90 min</Text></View>
                <View style={styles.smallTag}><Feather name="video" size={12} color="#666"/><Text style={styles.smallTagText}>Online</Text></View>
                <View style={styles.smallTag}><Feather name="user" size={12} color="#666"/><Text style={styles.smallTagText}>Individual</Text></View>
              </View>

              <Text style={styles.serviceStatus}>
                <Text style={{color: COLORS.green}}>● Active</Text> • 12 sessions done • Next: Fri 27 Feb
              </Text>
           </View>

           <View style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={[styles.serviceIcon, { backgroundColor: '#009688' }]}>
                  <Text style={styles.serviceIconText}>G</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>Maths Group Sessions</Text>
                  <Text style={styles.serviceSubtitle}>Karim Hadj • Lycée</Text>
                </View>
                <View>
                  <Text style={styles.servicePrice}>400 DZD</Text>
                  <Text style={styles.servicePriceUnit}>/session</Text>
                </View>
              </View>
              
              <View style={styles.serviceTags}>
                <View style={styles.smallTag}><Feather name="clock" size={12} color="#666"/><Text style={styles.smallTagText}>60 min</Text></View>
                <View style={styles.smallTag}><FontAwesome5 name="chalkboard-teacher" size={10} color="#666"/><Text style={styles.smallTagText}>In-person</Text></View>
                <View style={styles.smallTag}><Feather name="users" size={12} color="#666"/><Text style={styles.smallTagText}>Group (max 4)</Text></View>
              </View>

              <Text style={styles.serviceStatus}>
                <Text style={{color: COLORS.green}}>● Active</Text> • 5 sessions done • Next: Sat 28 Feb
              </Text>
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
                   <Text style={styles.reviewDate}>28 Feb 2026</Text>
                 </View>
                 <View style={styles.starsRow}>
                   {[1,2,3,4,5].map(i => <FontAwesome5 key={i} name="star" solid size={12} color="#FFD700" style={{marginLeft: 2}} />)}
                 </View>
              </View>
              <Text style={styles.reviewText}>
                Excellent teacher! Very clear explanations and always on time. Highly recommended for maths preparation.
              </Text>
              <Text style={styles.reviewFooter}>Advanced Mathematics • Individual session</Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                 <View style={[styles.reviewAvatar, { backgroundColor: '#FF9800' }]}>
                   <Text style={styles.reviewAvatarText}>A</Text>
                 </View>
                 <View style={{ flex: 1 }}>
                   <Text style={styles.reviewName}>Amira Darsi</Text>
                   <Text style={styles.reviewDate}>25 Feb 2026</Text>
                 </View>
                 <View style={styles.starsRow}>
                   {[1,2,3,4].map(i => <FontAwesome5 key={i} name="star" solid size={12} color="#FFD700" style={{marginLeft: 2}} />)}
                   <FontAwesome5 name="star" solid size={12} color="#E0E0E0" style={{marginLeft: 2}} />
                 </View>
              </View>
              <Text style={styles.reviewText}>
                Great group sessions, very well organized. Methods are adapted and effective for exam preparation.
              </Text>
              <Text style={styles.reviewFooter}>Maths Group Sessions • Group session</Text>
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
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    position: 'relative',
  },
  brandingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 0,
  },
  whiteCurveContainer: {
    backgroundColor: '#FFFFFF',
    width: 140,
    height: 90,
    borderBottomLeftRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    paddingLeft: 15,
  },
  brandingLogo: {
    width: 80,
    height: 35,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 40, 
    zIndex: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A5E',
  },
  onlineBadge: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.green,
    borderRadius: 6,
    position: 'absolute',
    bottom: 2,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '500',
  },
  logo: {
    width: 80,
    height: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.textDark,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    padding: 6,
    borderRadius: 8,
  },
  tabsScroll: {
    flexDirection: 'row',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeTabItem: {
    backgroundColor: COLORS.primary,
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  inactiveTabItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#666',
  },
  scrollContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 12, // Responsive gap
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    flex: 1, // Responsive width filling
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
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
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  sectionAction: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  upcomingCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDecorationCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  upcomingHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  upcomingBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  upcomingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  upcomingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  upcomingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    color: '#A0A0E0',
    fontSize: 12,
    marginLeft: 5,
  },
  startButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginRight: 5,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    width: 160,
    padding: 15,
    borderRadius: 20,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  reqName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  reqSchool: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    textAlign: 'center',
  },
  reqTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  reqTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reqTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  reqPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 15,
  },
  reqPriceUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#999',
  },
  reqActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
    flex: 1,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 5,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  declineBtn: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 15,
    marginLeft: 5,
    alignItems: 'center',
  },
  declineBtnText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addServiceBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  addServiceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'right',
  },
  servicePriceUnit: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  serviceTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  smallTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  smallTagText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  serviceStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  reviewDate: {
    fontSize: 10,
    color: '#999',
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  reviewFooter: {
    fontSize: 11,
    color: '#999',
  },
});