
import React, { useEffect, useState } from 'react';
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
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FontAwesome5, Ionicons, MaterialIcons, Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Reusing theme colors from Teacher Space
const COLORS = {
  primary: '#1A1A5E', // Deep Blue / Purple from header
  secondary: '#FFD700', // Yellow accent
  background: '#F5F6FA', // Light Gray background
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  green: '#00C853',
  red: '#FF3D00',
  lightBlue: '#E3F2FD',
  lightGray: '#F5F5F5',
};

const { width } = Dimensions.get('window');

// Reusable Components
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const InfoRow = ({ icon, label, value, showArrow = true, type = 'info' }: { icon: any, label: string, value: string, showArrow?: boolean, type?: 'info' | 'file' }) => (
  <TouchableOpacity style={styles.infoRow} activeOpacity={0.7}>
    <View style={[styles.infoIconContainer, { backgroundColor: type === 'file' ? '#FFF3E0' : '#F5F6FA' }]}>
      {icon}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
    {showArrow && (
       <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
    )}
    {type === 'file' && !showArrow && (
       <TouchableOpacity style={styles.downloadButton}>
         <Feather name="upload" size={16} color="#666" />
       </TouchableOpacity>
    )}
  </TouchableOpacity>
);

const DocumentRow = ({ title, subtitle, icon, color }: { title: string, subtitle: string, icon: any, color: string }) => (
    <View style={styles.documentRow}>
        <View style={[styles.docIconContainer, { backgroundColor: color + '20' }]}>
            {icon}
        </View>
        <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.docActionBtn}>
             <Feather name="upload" size={18} color="#999" />
        </TouchableOpacity>
    </View>
);

export default function TeacherProfile() {
  const router = useRouter();


  const [teacher , setTeacher] = useState({}) ;
  const [loading , setLoading ] = useState(false) ;
  const [msg , setMsg] = useState("") ;

  useEffect(() => {
    const getTeacherInfo = async (): Promise<void> => {
        setLoading(true);
        setMsg('Loading profile...');
        try {
          const accessToken = await SecureStore.getItemAsync("accessToken");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
    
          fetch("http://10.89.124.250:5000/teacher/getProfile", {
            method: "GET",
            headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` }
          })
          .then(res => res.json())
          .then(data => {
            if (data.succ) {
              setTeacher(data.teacher);
              setLoading(false);
              setMsg('Profile loaded successfully.');
            } else if (data.error === "Token expired!") {
              fetch("http://10.89.124.250:5000/teacher/refresh", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ refreshToken })
              })
              .then(res => res.json())
              .then(data => {
                if (data.accessToken) {
                  SecureStore.setItemAsync("accessToken", data.accessToken);
                  fetch("http://10.89.124.250:5000/teacher/getProfile", {
                    method: "GET",
                    headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` }
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.succ) {
                      setTeacher(data.teacher);
                      setLoading(false);
                      setMsg('Profile loaded successfully.');
                    } else {
                      setLoading(false);
                      router.replace("/sign_in");
                    }
                  });
                } else {
                  // refresh token expired → force login
                  setLoading(false);
                  router.replace("/sign_in");
                }
              });
            } else {
              // "No token found!" or "Invalid token!" → force login
              setLoading(false);
              router.replace("/sign_in");
            }
          });
        } catch (err) {
          console.error(err);
          setLoading(false);
          setMsg('Unable to load profile.');
          router.replace("/sign_in");
        }
      };
    
      getTeacherInfo();
  },[]) ;
  
  // Animation for the avatar pulse
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handleLogout = async():Promise<void> => {
  setLoading(true) ;
  setMsg("") ;
   try{
    await SecureStore.deleteItemAsync("accessToken") ; 
    await SecureStore.deleteItemAsync("refreshToken") ;
    setLoading(false) ; setMsg("") ;
    router.replace("/(welcome page)/welcomePage") ;
   }catch(e){
    setLoading(false) ; setMsg("Error in loging out!") ; 
   } 
    
  }

  // Mock Data - Update with real data from API if available
  /*const stats = [
    { id: 1, value: '18', label: 'SESSIONS', borderRight: true },
    { id: 2, value: '9', label: 'STUDENTS', borderRight: true },
    { id: 3, value: '3', label: 'SERVICES', borderRight: true },
    { id: 4, value: teacher?.rating || '0', label: 'RATING', borderRight: false },
  ];*/

  const availableDaysText = teacher?.available_days?.length
    ? teacher.available_days.join(' · ')
    : 'No availability set';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
           <SafeAreaView>
             <View style={styles.headerContent}>
                <Animated.View style={[styles.avatarWrapper, animatedPulseStyle]}>
                   <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{teacher?.first_name?.[0]?.toUpperCase()}</Text>
                   </View>
                   <View style={styles.onlineBadge}>
                      <Feather name="check" size={10} color="#FFF" />
                   </View>
                </Animated.View>
                
                <Text style={styles.nameText}>{teacher?.first_name} {teacher?.last_name}</Text>
                <Text style={styles.subtitleText}>{teacher?.role} · {teacher?.mode} · {teacher?.postal_adress}</Text>
                
                <View style={styles.tagsRow}>
                   {teacher?.school_levels_taught?.map((level, index) => (
                      <View key={index} style={styles.headerTag}>
                         <Text style={styles.headerTagText}>{level}</Text>
                      </View>
                   ))}
                   {teacher?.subject?.map((subj, index) => (
                      <View key={`subj-${index}`} style={styles.headerTag}>
                         <Text style={styles.headerTagText}>{subj}</Text>
                      </View>
                   ))}
                   <View style={styles.headerTag}>
                         <Text style={styles.headerTagText}>{teacher.status}</Text>
                    </View>
                </View>
             </View>
           </SafeAreaView>
        </View>

        

        {/* Content Sections */}
        <View style={styles.contentContainer}>
            {loading && (
              <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Loading" />
                <View style={styles.card}>
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                  </View>
                </View>
              </Animated.View>
            )}
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Message" />
                <View style={styles.card}>
                  <Text style={styles.messageText}>
                    {msg || 'No messages at the moment.'}
                  </Text>
                </View>
            </Animated.View>
            
            {/* Personal Information */}
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Personal Information" />
                <View style={styles.card}>
                   <InfoRow 
                     icon={<Feather name="user" size={20} color={COLORS.primary} />}
                     label="FULL NAME"
                     value={`${teacher?.first_name || ''} ${teacher?.last_name || ''}`}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="mail" size={20} color={COLORS.primary} />}
                     label="EMAIL"
                     value={teacher?.email || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="phone" size={20} color={COLORS.primary} />}
                     label="PHONE"
                     value={teacher?.phone || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="map-pin" size={20} color={COLORS.primary} />}
                     label="ADDRESS / GEOLOCATION"
                     value={teacher?.postal_adress || 'N/A'}
                   />
                </View>
            </Animated.View>

            {/* Teaching Profile */}
            <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Teaching Profile" />
                <View style={styles.card}>
                   <InfoRow 
                     icon={<Feather name="book-open" size={20} color={COLORS.primary} />}
                     label="EXPERTISE / SUBJECTS"
                     value={teacher?.subject?.join(', ') || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<FontAwesome5 name="graduation-cap" size={16} color={COLORS.primary} />}
                     label="LEVELS TAUGHT"
                     value={teacher?.school_levels_taught?.join(' · ') || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="monitor" size={20} color={COLORS.primary} />}
                     label="TEACHING MODE"
                     value={teacher?.mode || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="START TIME"
                     value={teacher?.start_time || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="END TIME"
                     value={teacher?.end_time || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="home" size={20} color={COLORS.primary} />}
                     label="NATURE"
                     value={teacher?.role || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="HOME VISITS / DISPLACEMENT"
                     value={teacher?.home_visits ? `Yes – within ${teacher?.postal_adress}` : 'No'}
                   />
                </View>
            </Animated.View>

            {/* Pedagogical Description */}
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Pedagogical Description" />
                <View style={[styles.card, {padding: 20}]}>
                    <Text style={styles.descriptionText}>
                      {teacher?.bio || 'No bio provided yet.'}
                    </Text>
                </View>
            </Animated.View>

            {/* Availability Summary */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Availability Summary" />
                <View style={styles.card}>
                   <InfoRow
                     icon={<Feather name="calendar" size={20} color={COLORS.primary} />}
                     label="AVAILABLE DAYS"
                     value={availableDaysText}
                     showArrow={false}
                   />
                </View>
            </Animated.View>
           
            {/* Log Out Button */}
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Feather name="log-out" size={20} color="#FF3D00" style={{marginRight: 10}} />
                  <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </Animated.View>

        </View>
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
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 50, // Space for stats bar overlap
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    marginBottom: 15,
    position: 'relative',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A5E',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    paddingVertical: 10,
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  headerTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    marginBottom: 5,
  },
  headerTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: -30, // Negative margin to overlap header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 9,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  uploadLink: {
     fontSize: 12,
     color: COLORS.primary,
     fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 10, // Small label
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 70, // Align with text start
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  availabilityCard: {
    padding: 20,
    paddingHorizontal: 15,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  dayStatus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  docIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  docSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  docActionBtn: {
    padding: 5,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutText: {
     color: '#FF3D00',
     fontSize: 16,
     fontWeight: 'bold',
  },
  downloadButton: {
     // Style for download button
  },
});
