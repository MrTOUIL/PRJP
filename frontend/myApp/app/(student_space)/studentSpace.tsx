import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Dimensions, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    Easing,
    FadeInDown,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import StudentTopFilters, { StudentMenuFilter } from './StudentTopFilters';
import { useRouter } from 'expo-router';    

const { width } = Dimensions.get('window');

const TUTOR_SUGGESTIONS = [
    { id: 1, name: 'Sara Belhadj', level: 'Terminale S', subject: 'Physics', color: '#149A8B' },
    { id: 2, name: 'M. Rahmani', level: 'Lycee', subject: 'Mathematics', color: '#FDBB2D' },
    { id: 3, name: 'L. Mansouri', level: 'All levels', subject: 'English', color: '#EF4444' },
];

const AVAILABLE_SERVICES = [
    {
        id: 1,
        name: 'Individual Math Sessions',
        tutor: 'Sara Belhadj · Terminale S',
        duration: '90 min',
        mode: 'Online',
        type: 'Individual',
        price: '800 DZD',
        priceSuffix: '/session',
        color: '#149A8B',
    },
];

const MY_SUBJECTS = [
  { id: 1, name: 'Algebra', progress: 0.65, color: '#1E1B6B' }, // Deep Blue
  { id: 2, name: 'Thermo', progress: 0.30, color: '#475569' }, // Slate
  { id: 3, name: 'English', progress: 1.0, color: '#FFD700' }, // Gold
  { id: 4, name: 'Biology', progress: 0.52, color: '#334155' }, // Dark Slate
];

type StudentSpaceProps = {
    activeFilter?: StudentMenuFilter;
    onSelectFilter?: (filter: StudentMenuFilter) => void;
};

export default function StudentSpace({
    activeFilter = 'all',
    onSelectFilter = () => {},
}: StudentSpaceProps) {
    const showSuggestions = activeFilter === 'all' || activeFilter === 'suggestions';
    const showServices = activeFilter === 'all' || activeFilter === 'services';
    const showSubjects = activeFilter === 'all' || activeFilter === 'subjects';
    const showRequests = activeFilter === 'all' || activeFilter === 'requests';
    const showDocuments = activeFilter === 'documents';
    const orbX = useSharedValue(-180);
    const orbY = useSharedValue(18);
    const orbOpacity = useSharedValue(0);

    useEffect(() => {
        orbX.value = withRepeat(
            withSequence(
                withTiming(width * 0.16, { duration: 900, easing: Easing.out(Easing.cubic) }),
                withTiming(width * 0.28, { duration: 700, easing: Easing.inOut(Easing.quad) }),
                withTiming(width * 0.18, { duration: 700, easing: Easing.inOut(Easing.quad) }),
                withTiming(width * 0.92, { duration: 820, easing: Easing.in(Easing.cubic) }),
                withTiming(-180, { duration: 0 }),
                withDelay(420, withTiming(-180, { duration: 0 }))
            ),
            -1,
            false
        );

        orbY.value = withRepeat(
            withSequence(
                withTiming(40, { duration: 900, easing: Easing.out(Easing.quad) }),
                withTiming(24, { duration: 700, easing: Easing.inOut(Easing.quad) }),
                withTiming(36, { duration: 700, easing: Easing.inOut(Easing.quad) }),
                withTiming(14, { duration: 820, easing: Easing.in(Easing.quad) }),
                withTiming(18, { duration: 0 }),
                withDelay(420, withTiming(18, { duration: 0 }))
            ),
            -1,
            false
        );

        orbOpacity.value = withRepeat(
            withSequence(
                withTiming(0.22, { duration: 280, easing: Easing.out(Easing.quad) }),
                withTiming(0.18, { duration: 1700, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 620, easing: Easing.in(Easing.quad) }),
                withDelay(420, withTiming(0, { duration: 0 }))
            ),
            -1,
            false
        );
    }, [orbX, orbY, orbOpacity]);

    const orbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: orbX.value }, { translateY: orbY.value }],
        opacity: orbOpacity.value,
    }));

  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
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
               <Text style={styles.avatarText}>Y</Text>
             </View>
             <View>
               <Text style={styles.userName}>Student Name</Text>
             </View>
          </View>
        </View>

                <View style={styles.searchRow}>
                    <Animated.View entering={FadeInUp.delay(100).duration(600).springify()} style={styles.searchContainer}>
                        <Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search tutors, subjects, files..."
                            placeholderTextColor="#94A3B8"
                            style={styles.searchInput}
                        />
                        <TouchableOpacity style={styles.filterButton}>
                            <Ionicons name="options" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={15} color="#FFFFFF" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
                {/* Top Filter Menu */}
                <Animated.View entering={FadeInUp.delay(150).duration(500)}>
                    <StudentTopFilters activeFilter={activeFilter} onSelect={onSelectFilter} />
                </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {[
            { num: '12', label: 'SESSIONS', delay: 200 },
            { num: '4', label: 'SUBJECTS', delay: 300 },
            { num: '3', label: 'REQUESTS', delay: 400 },
          ].map((stat, index) => (
            <Animated.View key={index} entering={FadeInUp.delay(stat.delay).duration(500)} style={styles.statCard}>
              <Text style={styles.statNumber}>{stat.num}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Upcoming Session Promo */}
        <Animated.View entering={FadeInRight.delay(500).duration(600)} style={styles.promoCard}>
              <Animated.View pointerEvents="none" style={[styles.promoGlowOrb, orbStyle]} />
          <View style={styles.promoContent}>
             <View style={styles.promoTag}>
                <Ionicons name="time" size={12} color="#1E1B6B" /> {/* Deep Blue */}
                <Text style={styles.promoTagText}>IN 2 HOURS</Text>
             </View>
             <Text style={styles.promoTitle}>Advanced Buffers use</Text>
             <Text style={styles.promoSubtitle}>with Dr. Amine Ziani · Online</Text>
             <Text style={styles.promoTime}>Fri 27 Feb · 16:00 - 18:00</Text>
          </View>
          <TouchableOpacity style={styles.joinButton}>
                 <Text style={styles.joinButtonText}>View Details</Text>
                 <Ionicons name="arrow-forward" size={16} color="#1E1B6B" />
          </TouchableOpacity>
        </Animated.View>

        {/* Tutor Suggestions */}
        {showSuggestions && (
        <Animated.View entering={FadeInUp.delay(600).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tutor Suggestions</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {TUTOR_SUGGESTIONS.map((tutor, index) => (
                    <Animated.View key={tutor.id} style={styles.tutorCard}>
                        <View style={styles.tutorHeader}>
                            <View style={[styles.tutorAvatar, { backgroundColor: tutor.color }]}>
                                <Text style={styles.tutorAvatarText}>{tutor.name.charAt(0)}</Text>
                            </View>
                            <Text style={styles.tutorName}>{tutor.name}</Text>
                            <Text style={styles.tutorLevel}>{tutor.level}</Text>
                            <View style={styles.tutorSubjectPill}>
                              <Text style={styles.tutorSubjectPillText}>{tutor.subject}</Text>
                            </View>
                        </View>
                        <View style={styles.tutorFooter}>

                     <TouchableOpacity style={styles.tutorButton}  onPress={() => { router.push('/(student_space)/Qoute'); }} >
                                <Text style={styles.tutorButtonText} >Send Request</Text>

                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>
        </Animated.View>
        )}

        {/* Available Services */}
        {showServices && (
        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Services</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>Browse all</Text></TouchableOpacity>
            </View>
            <View>
                {AVAILABLE_SERVICES.map((service) => (
                    <View key={service.id} style={styles.serviceCard}>
                                            <View style={styles.serviceTopRow}>
                                                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                                                    <Text style={styles.serviceAvatarText}>S</Text>
                                                </View>
                                                <View style={styles.serviceInfo}>
                                                    <Text style={styles.serviceName}>{service.name}</Text>
                                                    <Text style={styles.serviceSub}>{service.tutor}</Text>
                                                </View>
                                                <View style={styles.servicePriceWrap}>
                                                    <Text style={styles.servicePrice}>{service.price}</Text>
                                                    <Text style={styles.servicePriceSuffix}>{service.priceSuffix}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.serviceTagsRow}>
                                                <View style={styles.serviceTag}>
                                                    <Ionicons name="time-outline" size={13} color="#98A2B3" />
                                                    <Text style={styles.serviceTagText}>{service.duration}</Text>
                                                </View>
                                                <View style={styles.serviceTag}>
                                                    <Ionicons name="wifi-outline" size={13} color="#98A2B3" />
                                                    <Text style={styles.serviceTagText}>{service.mode}</Text>
                                                </View>
                                                <View style={styles.serviceTag}>
                                                    <Ionicons name="person-outline" size={13} color="#98A2B3" />
                                                    <Text style={styles.serviceTagText}>{service.type}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.serviceActionButton}>
                                                <Text style={styles.serviceActionButtonText}>Book This Service</Text>
                                            </TouchableOpacity>
                    </View>
                ))}
            </View>
        </Animated.View>
        )}

        {/* My Subjects */}
        {showSubjects && (
        <Animated.View entering={FadeInUp.delay(800).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Subjects</Text>
            </View>
            <View style={styles.subjectsGrid}>
                {MY_SUBJECTS.map((sub) => (
                    <View key={sub.id} style={styles.subjectGridItem}>
                        <View style={styles.circularProgress}>
                            {/* Mock Circular Progress */}
                            <View style={[styles.circleSvg, { borderColor: sub.color }]}>
                                <Text style={[styles.circleText, { color: sub.color }]}>{Math.round(sub.progress * 100)}%</Text>
                            </View>
                        </View>
                        <Text style={styles.gridSubjectName} numberOfLines={1}>{sub.name}</Text>
                    </View>
                ))}
            </View>
        </Animated.View>
        )}

        {/* My Requests (Preview) */}
        {showRequests && (
        <Animated.View entering={FadeInUp.delay(900).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Requests</Text>
            </View>
            <View style={styles.requestPreview}>
                <View style={styles.requestPreviewHeader}>
                    <Ionicons name="calendar" size={20} color="#666" />
                    <View style={{marginLeft: 10, flex: 1}}>
                        <Text style={styles.reqPrevTitle}>Advanced Mathematics</Text>
                        <Text style={styles.reqPrevSub}>M. Rahmani · 800 DZD</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={[styles.statusText, { color: '#2E7D32' }]}>Accepted</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
                )}

                {showDocuments && (
                    <Animated.View entering={FadeInUp.delay(750).duration(600)}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Documents</Text>
                        </View>
                        <View style={styles.requestPreview}>
                            <View style={styles.requestPreviewHeader}>
                                <Ionicons name="document-text-outline" size={20} color="#666" />
                                <View style={{ marginLeft: 10, flex: 1 }}>
                                    <Text style={styles.reqPrevTitle}>Physics Chapter 03</Text>
                                    <Text style={styles.reqPrevSub}>PDF · Uploaded 2 days ago</Text>
                                </View>
                                <TouchableOpacity style={styles.bookButton}>
                                    <Text style={styles.bookButtonText}>Open</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                )}

                <View style={{height: 24}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light blue-grey background
  },
  header: {
    backgroundColor: '#1E1B6B', // Deep Blue (Logo Primary)
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingTop: Platform.OS === 'android' ? 44 : 54,
        paddingBottom: 18,
        paddingHorizontal: 16,
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 10,
        overflow: 'hidden',
        position: 'relative',
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
    },
    headerLogo: {
        width: 118,
        height: 70,
        marginRight: 6,
        marginTop: 0,
        zIndex: 3,
    },
  headerContent: {
    flexDirection: 'row',
        justifyContent: 'flex-start',
    alignItems: 'center',
        paddingHorizontal: 4,
        marginTop: -8,
  },
  userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatarContainer: {
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#FFD700',
      justifyContent: 'center',
      alignItems: 'center',
            marginRight: 6,
  },
  avatarText: {
            fontWeight: '800',
            color: '#1E1B6B',
            fontSize: 10,
  },
  userName: {
      color: '#fff',
            fontWeight: '700',
      fontSize: 14,
  },
    searchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 22,
            zIndex: 3,
    },
  notificationButton: {
            marginLeft: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.14)',
            justifyContent: 'center',
            alignItems: 'center',
  },
  notificationBadge: {
      position: 'absolute',
            top: 5,
            right: 5,
            width: 6,
            height: 6,
            borderRadius: 3,
      backgroundColor: '#FFD700', // Gold notification dot
      borderWidth: 1,
      borderColor: '#1E1B6B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
      padding: 20,
            paddingTop: 12,
  },
  searchContainer: {
        flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 12,
        height: 34,
        marginTop: 0,
        marginBottom: 0,
    shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        zIndex: 20,
  },
  searchIcon: {
        marginRight: 8,
  },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#333',
                fontSize: 10,
    },
    filterButton: {
            width: 20,
            height: 20,
            borderRadius: 6,
            backgroundColor: '#2C2E83',
            justifyContent: 'center',
            alignItems: 'center',
    },
  statsContainer: {
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
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B6B', // Deep Blue
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B', // Slate
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  promoCard: {
      backgroundColor: '#2E2E8B', // Darker Blue variant
      borderRadius: 22,
      paddingVertical: 24,
      paddingHorizontal: 22,
      marginBottom: 30,
      shadowColor: '#1E1B6B',
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 12,
      elevation: 6,
      overflow: 'hidden',
      minHeight: 168,
      position: 'relative',
  },
  promoGlowOrb: {
      position: 'absolute',
      top: 8,
      left: -80,
      width: 188,
      height: 188,
      borderRadius: 94,
      backgroundColor: 'rgba(255, 244, 190, 0.24)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
      shadowColor: '#FFF6D2',
      shadowOpacity: 0.42,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 0 },
  },
  promoContent: {
      width: '100%',
      zIndex: 2,
  },
  promoTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 215, 0, 0.2)', // Gold tint
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      marginBottom: 10,
  },
  promoTagText: {
      color: '#FFD700', // Gold text
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 5,
  },
  promoTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      lineHeight: 24,
  },
  promoSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
      marginBottom: 6,
  },
  promoTime: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
  },
  joinButton: {
      backgroundColor: '#FFE44D',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#FFE44D',
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
      zIndex: 2,
      alignSelf: 'flex-end',
      marginTop: 12,
  },
  joinButtonText: {
      color: '#1E1B6B', // Blue text on Gold
      fontWeight: 'bold',
      marginRight: 5,
      fontSize: 13,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingHorizontal: 5,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1E293B', // Dark Slate
  },
  seeAllText: {
      color: '#1E1B6B', // Blue
      fontSize: 13,
      fontWeight: '600',
  },
  horizontalScroll: {
      marginBottom: 30,
      paddingLeft: 2,
  },
  tutorCard: {
      backgroundColor: '#fff',
      width: 138,
      minHeight: 210,
      paddingTop: 18,
      paddingHorizontal: 12,
      paddingBottom: 12,
      borderRadius: 22,
      marginRight: 12,
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 14,
      elevation: 4,
      marginBottom: 5,
  },
  tutorHeader: {
      alignItems: 'center',
      marginBottom: 12,
  },
  tutorAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
  },
  tutorAvatarText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 28,
  },
  tutorName: {
      fontWeight: '700',
      fontSize: 13,
      textAlign: 'center',
      marginBottom: 2,
      color: '#1E293B',
  },
  tutorLevel: {
      fontSize: 11,
      color: '#98A2B3',
      textAlign: 'center',
      marginBottom: 10,
  },
  tutorSubjectPill: {
      backgroundColor: '#F1F4FF',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
  },
  tutorSubjectPillText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#2A3188',
  },
  tutorFooter: {
      marginTop: 0,
  },
  tutorButton: {
      backgroundColor: '#1D247F',
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
  },
  tutorButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
  },
  serviceCard: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
      elevation: 3,
  },
  serviceTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
  },
  serviceIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  serviceAvatarText: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
  },
  serviceInfo: {
      flex: 1,
  },
  serviceName: {
      fontWeight: '700',
      fontSize: 15,
      color: '#1E293B',
      marginBottom: 3,
  },
  serviceSub: {
      fontSize: 12,
      color: '#98A2B3',
  },
  servicePriceWrap: {
      alignItems: 'flex-end',
      marginLeft: 8,
  },
  servicePrice: {
      fontSize: 15,
      fontWeight: '800',
      color: '#1D247F',
  },
  servicePriceSuffix: {
      fontSize: 11,
      color: '#98A2B3',
      marginTop: 2,
  },
  serviceTagsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 14,
  },
  serviceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F6F7FB',
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
      marginBottom: 6,
  },
  serviceTagText: {
      fontSize: 11,
      color: '#98A2B3',
      fontWeight: '600',
      marginLeft: 4,
  },
  serviceActionButton: {
      backgroundColor: '#1D247F',
      borderRadius: 12,
      paddingVertical: 11,
      alignItems: 'center',
  },
  serviceActionButtonText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '700',
  },
  bookButton: {
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 12,
  },
  bookButtonText: {
      fontSize: 12,
      color: '#1E1B6B',
      fontWeight: '600',
  },
  subjectsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
  },
  subjectGridItem: {
      alignItems: 'center',
      width: width / 5,
  },
  circularProgress: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
  },
  circleSvg: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftColor: '#E2E8F0',
      backgroundColor: '#fff',
  },
  circleText: {
      fontSize: 10,
      fontWeight: 'bold',
  },
  gridSubjectName: {
      fontSize: 11,
      textAlign: 'center',
      color: '#64748B',
      maxWidth: '100%',
  },
  requestPreview: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 18,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
  },
  requestPreviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  reqPrevTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 2,
  },
  reqPrevSub: {
      fontSize: 12,
      color: '#64748B',
  },
  statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
  },
  statusText: {
      fontSize: 11,
      fontWeight: '700',
    }

});
