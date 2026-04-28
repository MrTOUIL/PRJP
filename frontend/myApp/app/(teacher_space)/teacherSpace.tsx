import React, { use, useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/api';
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
import * as SecureStore from 'expo-secure-store';

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


  
  const [teacher , setTeacher] = useState({}) ;
  const [teacherSessions , setTeacherSessions] = useState([]) ;
  const [sortedSessions , setSortedSessions] = useState([]) ;
  const [upcomingSession , setUpcomingSession] = useState({}) ;
  const [parentRequests , setParentRequests] = useState([]) ;
  const [studentRequests , setStudentRequests] = useState([]) ;
  const [reqs,setreqs] = useState([]) ;
  const [teacherServices , setTeacherServices] = useState([]) ;
  const [evaluationsStudents , setEvaluationsStudents] = useState([]) ;
  const [evaluationsParents , setEvaluationsParents] = useState([]) ;
  const [evst,setevst] = useState([]) ;
  useEffect(() => {
  const getTeacherInfo = async (): Promise<void> => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      fetch(`${BASE_URL}/teacher/getProfile`, {
        method: "GET",
        headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.succ) {
          setTeacher(data.teacher);
          setTeacherSessions(data.sessions) ;
          setSortedSessions(data.sortedSessions) ;
          setUpcomingSession(data.upcomingSession) ;
          setParentRequests(data.parentRequests) ;
          setStudentRequests(data.studentRequests) ;
          setreqs(data.reqs) ;
          setTeacherServices(data.teacherServices) ;
          setEvaluationsStudents(data.evaluationsFromStudents) ;
          setEvaluationsParents(data.evaluationsFromParents) ;
          setevst(data.evs) ;

        } else if (data.error === "Token expired!") {
          fetch(`${BASE_URL}/teacher/refresh`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ refreshToken })
          })
          .then(res => res.json())
          .then(data => {
            if (data.accessToken) {
              SecureStore.setItemAsync("accessToken", data.accessToken);
              fetch(`${BASE_URL}/teacher/getProfile`, {
                method: "GET",
                headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` }
              })
              .then(res => res.json())
              .then(data => {
                if (data.succ) {
                  setTeacher(data.teacher);
                  setTeacherSessions(data.sessions) ;
                  setSortedSessions(data.sortedSessions) ;
                  setUpcomingSession(data.upcomingSession) ;
                  setParentRequests(data.parentRequests) ;
                  setStudentRequests(data.studentRequests) ;
                  setreqs(data.reqs) ;
                  setTeacherServices(data.teacherServices) ;
                  setEvaluationsStudents(data.evaluationsFromStudents) ;
                  setEvaluationsParents(data.evaluationsFromParents) ;
                  setevst(data.evs) ;
                } else {
                  router.replace("/sign_in");
                }
              });
            } else {
              // refresh token expired → force login
              router.replace("/sign_in");
            }
          });
        } else {
          // "No token found!" or "Invalid token!" → force login
          router.replace("/sign_in");
        }
      });
    } catch (err) {
      console.error(err);
      router.replace("/sign_in");
    }
  };

  getTeacherInfo();
}, []); 


//useEffect (() => {
  //if (teacher && teacherSessions) {
    const stats = [
    { id: 1, value: `${teacherSessions.length}`, label: 'SESSIONS', icon: 'calendar-alt', color: '#FF6B6B' },
    //{ id: 2, value: '9', label: 'STUDENTS', icon: 'user-graduate', color: '#FFD700' },
    { id: 3, value: `${teacher.rating || 0}`, label: 'RATING', icon: 'star', color: '#FFD700' },
  ];
  //}
//},[teacher,teacherSessions]) ;

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
                <Text style={styles.avatarText}>M</Text>
                <View style={styles.onlineBadge} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{teacher.first_name}</Text>
                <Text style={styles.profileName}>{teacher.last_name}</Text>
                <View style={styles.roleTag}>
                  <FontAwesome5 name="chalkboard-teacher" size={12} color="#FFD700" style={{ marginRight: 5 }} />
                  <Text style={styles.roleText}>Teacher • <Text style={{color: '#FFD700'}}>{teacher.subject}</Text></Text>
                </View>
              </View>
            </View>

            

            {/* Horizontal Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={{ paddingRight: 20 }}>
              {[
                { label: 'All', route: null, icon: null, active: true },
                { label: 'My Documents', route: '/(teacher_space)/AllDocuments', icon: null },
                //{ label: 'Requests', route: '/(teacher_space)/teacherRequests', icon: null },
                { label: 'Create Services', route: '/(teacher_space)/servicePdg', icon: null },
                { label: 'All my students', route: '/(teacher_space)/SeeAllStudents', icon: null }
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
          <SectionHeader title="Upcoming Session" actionText="View all" onAction={() => router.push({pathname:'/(teacher_space)/AllSessions' , params:{sortedSessions: JSON.stringify(sortedSessions)}})} />

          {!upcomingSession && <Text style={{color: '#999', fontStyle: 'italic'}}>No upcoming sessions scheduled.</Text>}

          {upcomingSession &&
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <View style={styles.upcomingBadge}>
                <MaterialIcons name="alarm" size={14} color="#FFD700" />
                {/*<Text style={styles.upcomingBadgeText}>IN 2 HOURS</Text>*/}
              </View>
            </View>
            <Text style={styles.upcomingTitle}>{upcomingSession.service?.title}</Text>
            <Text style={styles.upcomingSubtitle}>with {teacher.first_name} {teacher.last_name}</Text>
             <Text style={styles.upcomingSubtitle}>location: {upcomingSession.location}</Text>
            <View style={styles.upcomingFooter}>
              <View style={styles.dateTimeRow}>
                <Feather name="calendar" size={14} color="#A0A0E0" />
                <Text style={styles.dateTimeText}>{upcomingSession.Date}</Text>
                <Feather name="clock" size={14} color="#A0A0E0" style={{ marginLeft: 10 }} />
                <Text style={styles.dateTimeText}>{upcomingSession.start_time} - {upcomingSession.end_time}</Text>
                <Text style={styles.dateTimeText}>| {upcomingSession.status}</Text>
              </View>
              {/*<AnimatedTouchableOpacity style={[styles.startButton, animatedPulseStyle]}>
                <Text style={styles.startButtonText}>Start</Text>
                <AntDesign name="arrowright" size={16} color={COLORS.primary} />
              </AnimatedTouchableOpacity>*/}
            </View>
            
            {/* Abstract Background Decoration */}
            <View style={styles.cardDecorationCircle} />
          </View> }
        </Animated.View>

        {/* Student Requests */}
        {reqs.length == 0 && (
          <View style={styles.sectionContainer}>
            <SectionHeader title="Requests" actionText="See all" onAction={() => router.push({pathname:'/(teacher_space)/AllRequests' , params:{studentRequests: JSON.stringify(studentRequests), parentRequests: JSON.stringify(parentRequests)}})} />
            <Text style={{color: '#999', fontStyle: 'italic'}}>No student requests available.</Text>
          </View>
        )}
        {reqs.length > 0 && 
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionContainer}>
            <SectionHeader title="Requests" actionText="See all" onAction={() => router.push({pathname:'/(teacher_space)/AllRequests' , params:{studentRequests: JSON.stringify(studentRequests), parentRequests: JSON.stringify(parentRequests)}})} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              {reqs.map((req, idx) => (
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
                      <Text style={[styles.reqTagText, {color: req.mode === 'online' ? '#2196F3' : '#FF9800'}]}>{req.mode}</Text>
                   </View>
                 </View>

                 <Text style={styles.reqPrice}>{req.price}<Text style={styles.reqPriceUnit}>/session</Text></Text>

                 
               </View>) : null
             ))}
           </ScrollView>
        </Animated.View>}
        

        {/* My Active Services */}
         <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionContainer}>
           <SectionHeader title="My Active Services" actionText="Browse all" onAction={() => router.push({pathname:'/(teacher_space)/AllServices' , params:{teacherServices: JSON.stringify(teacherServices), teacher: JSON.stringify(teacher)}})} />

          {(teacherServices?.length ?? 0) == 0 && <Text style={{color: '#999', fontStyle: 'italic'}}>No active services.</Text>}
          {teacherServices?.length > 0 && 
          teacherServices.map((service:any) =>(
           <View style={styles.serviceCard} key={service._id}>
              <View style={styles.serviceHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{teacher.first_name} {teacher.last_name} • {service.target_audiance}</Text>
                </View>
                <View>
                  <Text style={styles.servicePrice}>{service.cost} DZD</Text>
                  <Text style={styles.servicePriceUnit}>/session</Text>
                </View>
              </View>
              
              <View style={styles.serviceTags}>
                
                <View style={styles.smallTag}><Feather name="video" size={12} color="#666"/><Text style={styles.smallTagText}>{service.mode}</Text></View>
                <View style={styles.smallTag}><Feather name="user" size={12} color="#666"/><Text style={styles.smallTagText}>{service.type}</Text></View>
              </View>

              
                
              
           </View> ))}
         </Animated.View>

         {/* Recent Reviews */}
         <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionContainer}>
            <SectionHeader title="Recent Reviews" actionText="See all" onAction={() => router.push({pathname:'/(teacher_space)/AllReviews' , params:{evaluationsStudents: JSON.stringify(evaluationsStudents), evaluationsParents: JSON.stringify(evaluationsParents)}})} />
            
             {(evst?.length ?? 0) == 0 && <Text style={{color: '#999', fontStyle: 'italic'}}>No reviews yet.</Text>}

            { (evst?.length ?? 0) > 0 && evst.map((evaluation:any) => (
              evaluation && evaluation.evaluator ? (
                <View style={styles.reviewCard} key={evaluation._id ?? evaluation.date}>
                  <View style={styles.reviewHeader}>
                    <View style={[styles.reviewAvatar, { backgroundColor: '#00C853' }]}>
                      <Text style={styles.reviewAvatarText}>{evaluation.evaluator.first_name?.charAt(0) ?? 'U'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{`${evaluation.evaluator.first_name || ''} ${evaluation.evaluator.last_name || ''}`.trim() || 'Unknown Reviewer'}</Text>
                      <Text style={styles.reviewDate}>{evaluation.date || 'No date'}</Text>
                    </View>
                    <View style={styles.starsRow}>
                      {[1,2,3,4,5].map(i => (
                        <FontAwesome5
                          key={i}
                          name="star"
                          solid
                          size={12}
                          color={i <= (evaluation.note ?? 0) ? '#FFD700' : '#E0E0E0'}
                          style={{ marginLeft: 2 }}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{evaluation.comment || 'No comment provided.'}</Text>
                  <Text style={styles.reviewFooter}>{`${evaluation.note ?? '-'} / 5`}</Text>
                </View>
              ) : null
            ))}

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