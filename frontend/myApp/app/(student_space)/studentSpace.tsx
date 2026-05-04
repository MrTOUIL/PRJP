import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { BASE_URL } from '../../constants/api';
import * as SecureStore from 'expo-secure-store';
import { getStudentOrParentRole } from '../../constants/roleApi';
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

const COLORS = {
    primary: '#1A1A5E',
};

/*const TUTOR_SUGGESTIONS = [
    { id: 1, name: 'Sara Belhadj', level: 'Terminale S', subject: 'Physics', color: '#149A8B' },
    { id: 2, name: 'M. Rahmani', level: 'Lycee', subject: 'Mathematics', color: '#FDBB2D' },
    { id: 3, name: 'L. Mansouri', level: 'All levels', subject: 'English', color: '#EF4444' },
];*/

/*const AVAILABLE_SERVICES = [
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
];*/

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
    const showRequests = activeFilter === 'all' || activeFilter === 'requests';
    const orbX = useSharedValue(-180);
    const orbY = useSharedValue(18);
    const orbOpacity = useSharedValue(0);
    const [student, setStudent] = useState<any>({});
    const [joinedServices, setJoinedServices] = useState<any[]>([]);
    const [suggestedServices, setSuggestedServices] = useState<any[]>([]);
    const [suggestedTeachers, setSuggestedTeachers] = useState<any[]>([]);
    const [myRequests, setMyRequests] = useState<any[]>([]);
    const [studentSessions, setStudentSessions] = useState<any[]>([]);
    const [myEvaluations, setMyEvaluations] = useState<any[]>([]);
    const [somerequests , setSomerequests] = useState<any[]>([]);
    const [notJoinedServices , setNotJoinedServices] = useState<any[]>([]) ;

    const router = useRouter();

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

    useEffect(() => {
        const getStudentInfo = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync('accessToken');
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                const apiRole = await getStudentOrParentRole();

                const res = await fetch(`${BASE_URL}/${apiRole}/getProfile`, {
                    method: 'GET',
                    headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}` },
                });
                const data = await res.json();
                if (data.succ) {
                    setStudent(data.student || {});
                    setJoinedServices(data.joinedServices || []);
                    setSuggestedServices(data.suggestedServices || []);
                    setSuggestedTeachers(data.suggestedTeachers || []);
                    setMyRequests(data.myRequests || []);
                    setMyEvaluations(data.myEvaluations || []);
                    setStudentSessions(data.StudentSessions || []);
                    setNotJoinedServices(data.notJoinedServices || []);
                    await SecureStore.setItemAsync('studentProfileData', JSON.stringify(data));
                } else if (data.error === 'Token expired!') {
                    // try refresh
                    const r = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ refreshToken }),
                    });
                    const newData = await r.json();
                    if (newData.accessToken) {
                        await SecureStore.setItemAsync('accessToken', newData.accessToken);
                        const res2 = await fetch(`${BASE_URL}/${apiRole}/getProfile`, {
                            method: 'GET',
                            headers: { 'content-type': 'application/json', authorization: `Bearer ${newData.accessToken}` },
                        });
                        const data2 = await res2.json();
                        if (data2.succ) {
                            setStudent(data2.student || {});
                            setJoinedServices(data2.joinedServices || []);
                            setSuggestedServices(data2.suggestedServices || []);
                            setSuggestedTeachers(data2.suggestedTeachers || []);
                            setMyRequests(data2.myRequests || []);
                            setMyEvaluations(data2.myEvaluations || []);
                            setStudentSessions(data2.StudentSessions || []);
                            setNotJoinedServices(data2.notJoinedServices || []);
                            await SecureStore.setItemAsync('studentProfileData', JSON.stringify(data2));
                        } else {
                            router.replace('/sign_in');
                        }
                    } else {
                        router.replace('/sign_in');
                    }
                } else {
                    router.replace('/sign_in');
                }
            } catch (err) {
                console.error(err);
                router.replace('/sign_in');
            }
        };

        getStudentInfo();
    }, []);

    useEffect(() => {
      if (myRequests.length > 0){
        setSomerequests(myRequests.slice(0,4)) ;//we just want to show some of the requests in the home page, the rest can be seen in the "my requests" page
      }
    },[myRequests]) ; 

    const orbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: orbX.value }, { translateY: orbY.value }],
        opacity: orbOpacity.value,
    }));

    const displayName = student?.role === 'parent'
        ? `${student?.parentf || ''} ${student?.parentl || ''}`.trim()
        : `${student?.first_name || ''} ${student?.last_name || ''}`.trim();
    const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

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
                             <Text style={styles.avatarText}>{displayInitial}</Text>
                         </View>
                         <View>
                             <Text style={styles.userName}>{displayName || 'Student Name'}</Text>
                         </View>
                    </View>
        </View>
        
                <Animated.View pointerEvents="none" style={[styles.headerOrb, orbStyle]} />
            </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
                {/* Top Filter Menu */}
                <Animated.View entering={FadeInUp.delay(150).duration(500)}>
                    <StudentTopFilters
                        activeFilter={activeFilter}
                        onSelect={onSelectFilter}
                        joinedServices={joinedServices}
                        notJoinedServices={notJoinedServices}
                    />
                </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
                    {[
                        { num: `${studentSessions?.length ?? 0}`, label: 'SESSIONS', delay: 200 },
                        { num: `${myEvaluations?.length ?? 0}`, label: 'EVALUATIONS', delay: 300 },
                        { num: `${myRequests?.length ?? 0}`, label: 'REQUESTS', delay: 400 },
                    ].map((stat, index) => (
                        <Animated.View key={index} entering={FadeInUp.delay(stat.delay).duration(500)} style={styles.statCard}>
                            <Text style={styles.statNumber}>{stat.num}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </Animated.View>
                    ))}
        </View>

        {/* Upcoming Sessions */}
        <Animated.View entering={FadeInRight.delay(500).duration(600)} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Session</Text>
                        
          </View>
          
                    {studentSessions?.length === 0 && (
            <Text style={{ color: '#999', fontStyle: 'italic', marginLeft: 20 }}>No sessions available yet.</Text>
          )}
          
                    {studentSessions?.length > 0 && (() => {
                        const session = studentSessions[0];

                        return (
                            <View key={session?._id || 'upcoming-session'} style={styles.upcomingCard}>
                                <View style={styles.upcomingHeader}>
                                    <View style={styles.upcomingBadge}>
                                        <MaterialIcons name="alarm" size={14} color="#FFD700" />
                                    </View>
                                </View>
                                <Text style={styles.upcomingTitle}>{session?.service?.title}</Text>
                                <Text style={styles.upcomingSubtitle}>with {session?.done_by?.first_name} {session?.done_by?.last_name}</Text>
                                <Text style={styles.upcomingSubtitle}>location: {session?.location}</Text>
                                <View style={styles.upcomingFooter}>
                                    <View style={styles.dateTimeRow}>
                                        <Feather name="calendar" size={14} color="#A0A0E0" />
                                        <Text style={styles.dateTimeText}>{session?.Date}</Text>
                                        <Feather name="clock" size={14} color="#A0A0E0" style={{ marginLeft: 10 }} />
                                        <Text style={styles.dateTimeText}>{session?.start_time} - {session?.end_time}</Text>
                                        <Text style={styles.dateTimeText}>| {session?.status}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardDecorationCircle} />
                            </View>
                        );
                    })()}
        </Animated.View>

        {/* Tutor Suggestions */}
        {showSuggestions && (
        <Animated.View entering={FadeInUp.delay(600).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tutor Suggestions-according to your level</Text>
                                
            </View>

            {suggestedTeachers?.length === 0 ? (
              <Text style={{ color: '#999', fontStyle: 'italic', marginLeft: 5 , marginBottom: 20 }}>No suggested teachers available yet.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {suggestedTeachers.map((teacher: any, index: number) => {
                      const fullName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Teacher';
                      const initials = fullName.split(' ').filter(Boolean).slice(0, 1).map((part: string) => part.charAt(0).toUpperCase()).join('') || 'T';
                      const subjects = Array.isArray(teacher.subject) ? teacher.subject : [];
                      const levels = Array.isArray(teacher.school_levels_taught) ? teacher.school_levels_taught : [];
                      const displaySubject = subjects[0] || 'Tutor';
                      const displayLevel = levels[0] || 'All levels';
                      const colors = ['#149A8B', '#FDBB2D', '#EF4444', '#6366F1', '#10B981'];

                      return (
                          <Animated.View key={teacher._id || index} style={styles.tutorCard}>
                              <View style={styles.tutorHeader}>
                                  <View style={[styles.tutorAvatar, { backgroundColor: colors[index % colors.length] }]}>
                                      <Text style={styles.tutorAvatarText}>{initials}</Text>
                                  </View>
                                  <Text style={styles.tutorName}>{fullName}</Text>
                                  <Text style={styles.tutorLevel}>{displayLevel}</Text>
                                  <View style={styles.tutorSubjectPill}>
                                    <Text style={styles.tutorSubjectPillText}>{displaySubject}</Text>
                                  </View>
                                  <Text style={styles.tutorLevel}>{teacher.rating ? `${teacher.rating}/5 rating` : 'No rating yet'}</Text>
                              </View>
                              <View style={styles.tutorFooter}>
                                
                              </View>
                          </Animated.View>
                      );
                  })}
              </ScrollView>
            )}
        </Animated.View>
        )}

        {/* Available Services */}
        {showServices && (
        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Suggested Services-according to your level</Text>
                
            </View>

            {suggestedServices?.length === 0 ? (
              <Text style={{ color: '#999', fontStyle: 'italic', marginLeft: 5, marginBottom: 20 }}>No suggested services available yet.</Text>
            ) : (
              <View>
                {suggestedServices.map((service: any) => {
                  const teacherName = `${service.done_by?.first_name || ''} ${service.done_by?.last_name || ''}`.trim() || 'Teacher';

                  return (
                    <View key={service._id} style={styles.serviceCard}>
                      <View style={styles.serviceTopRow}>
                        <View style={styles.serviceInfo}>
                          <Text style={styles.serviceName}>{service.title}</Text>
                          <Text style={styles.serviceSub}>{teacherName} • {service.target_audiance}</Text>
                        </View>
                        <View style={styles.servicePriceWrap}>
                          <Text style={styles.servicePrice}>{service.cost} DZD</Text>
                          <Text style={styles.servicePriceSuffix}>/session</Text>
                        </View>
                      </View>

                      <View style={styles.serviceTagsRow}>
                        <View style={styles.serviceTag}>
                          <Feather name="video" size={12} color="#666" />
                          <Text style={styles.serviceTagText}>{service.mode}</Text>
                        </View>
                        <View style={styles.serviceTag}>
                          <Feather name="user" size={12} color="#666" />
                          <Text style={styles.serviceTagText}>{service.type}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
        </Animated.View>
        )}

        {/* My Requests */}
        {/*{somerequests.length === 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Requests</Text>
            </View>
            <Text style={{color: '#999', fontStyle: 'italic'}}>No requests yet.</Text>
          </View>
        )}
        {somerequests.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Requests</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              {somerequests.map((req, idx) => (
                req && req.requester ? (
                  <View key={req._id} style={styles.requestCard}>
                    <View style={[styles.requestAvatar, { backgroundColor: "green" }]}>
                      <Text style={styles.requestAvatarText}>{req.requester.first_name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.reqName}>{req.requester.first_name} {req.requester.last_name}</Text>
                    <Text style={styles.reqSchool}>{req.niveau}</Text>
                    
                    <View style={styles.reqTags}>
                      <View style={styles.reqTag}>
                        <Text style={styles.reqTagText}>{req.matiere}</Text>
                      </View>
                      <View style={[styles.reqTag, {marginLeft: 5, backgroundColor: req.mode === 'Online' ? '#E3F2FD' : '#FFF3E0'}]}>
                        <Text style={[styles.reqTagText, {color: req.mode === 'Online' ? '#2196F3' : '#FF9800'}]}>{req.mode}</Text>
                      </View>
                    </View>

                    <Text style={styles.reqPrice}>{req.price}<Text style={styles.reqPriceUnit}>/session</Text></Text>
                  </View>
                ) : null
              ))}
            </ScrollView>
          </Animated.View>
        )}*/}

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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'android' ? 30 : 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: 120,
  },
    sectionContainer: {
            marginBottom: 25,
    },
  topRightCurveContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 140,
      height: 90,
      borderBottomLeftRadius: 70,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 15,
      paddingLeft: 15,
      zIndex: 0,
  },
  topRightCurve: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 140,
      height: 90,
      borderBottomLeftRadius: 70,
      backgroundColor: '#FFFFFF',
      opacity: 0.98,
  },
  headerLogo: {
      width: 80,
      height: 35,
      zIndex: 1,
  },
  headerContent: {
      paddingTop: 40,
      zIndex: 1,
  },
  userInfo: {
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
  upcomingCard: {
      backgroundColor: COLORS.primary,
      borderRadius: 20,
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 12,
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
      flexWrap: 'wrap',
  },
  dateTimeText: {
      color: '#A0A0E0',
      fontSize: 12,
      marginLeft: 5,
  },
  userName: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
      padding: 20,
            paddingTop: 12,
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
  headerOrb: {
      position: 'absolute',
      top: 12,
      left: -60,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: 'rgba(255, 244, 190, 0.16)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
      shadowColor: '#FFF6D2',
      shadowOpacity: 0.3,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
      zIndex: 1,
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
    },
  sessionCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
  },
  sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
  },
  sessionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 4,
  },
  sessionSubtitle: {
      fontSize: 13,
      color: '#64748B',
  },
  sessionStatus: {
      fontSize: 11,
      fontWeight: '600',
      color: '#A0A0E0',
      backgroundColor: '#F0EFFF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  sessionDetails: {
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      paddingTop: 12,
  },
  detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
  detailText: {
      fontSize: 12,
      color: '#475569',
      marginLeft: 8,
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
      color: '#1E293B',
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
      color: '#1E293B',
      marginBottom: 15,
  },
  reqPriceUnit: {
      fontSize: 12,
      fontWeight: 'normal',
      color: '#999',
  },
});
