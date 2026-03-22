
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
  Platform,
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

  // Mock Data
  const stats = [
    { id: 1, value: '18', label: 'SESSIONS', borderRight: true },
    { id: 2, value: '9', label: 'STUDENTS', borderRight: true },
    { id: 3, value: '3', label: 'SERVICES', borderRight: true },
    { id: 4, value: '4.9', label: 'RATING', borderRight: false },
  ];

  const availability = [
    { day: 'M', status: 'PM' },
    { day: 'T', status: '-' },
    { day: 'W', status: 'AM' },
    { day: 'T', status: 'PM' },
    { day: 'F', status: 'All' },
    { day: 'S', status: '-' },
    { day: 'S', status: '-' },
  ];

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
                      <Text style={styles.avatarText}>K</Text>
                   </View>
                   <View style={styles.onlineBadge}>
                      <Feather name="check" size={10} color="#FFF" />
                   </View>
                </Animated.View>
                
                <Text style={styles.nameText}>Karim Hadj</Text>
                <Text style={styles.subtitleText}>Mathematics Teacher · Online / Hybrid · Alger</Text>
                
                <View style={styles.tagsRow}>
                   <View style={styles.headerTag}>
                      <Text style={styles.headerTagText}>Terminale S</Text>
                   </View>
                   <View style={styles.headerTag}>
                      <Text style={styles.headerTagText}>Maths</Text>
                   </View>
                   <View style={styles.headerTag}>
                      <Text style={styles.headerTagText}>Physics</Text>
                   </View>
                </View>

                <View style={styles.ratingRow}>
                   <View style={styles.ratingBadge}>
                      <FontAwesome5 name="star" solid size={10} color="#FFD700" style={{marginRight: 4}} />
                      <Text style={styles.ratingText}>4.9 Rating</Text>
                   </View>
                   <View style={[styles.ratingBadge, {backgroundColor: 'rgba(0,200,83,0.2)'}]}>
                      <Feather name="check-circle" size={10} color="#00C853" style={{marginRight: 4}} />
                      <Text style={[styles.ratingText, {color: '#00C853'}]}>Verified</Text>
                   </View>
                </View>
             </View>
           </SafeAreaView>
        </View>

        {/* Stats Bar */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsContainer}>
           {stats.map((stat) => (
               <View key={stat.id} style={[styles.statItem, stat.borderRight && styles.statBorder]}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
               </View>
           ))}
        </Animated.View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
            
            {/* Personal Information */}
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Personal Information" />
                <View style={styles.card}>
                   <InfoRow 
                     icon={<Feather name="user" size={20} color={COLORS.primary} />}
                     label="FULL NAME"
                     value="Karim Hadj"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="mail" size={20} color={COLORS.primary} />}
                     label="EMAIL"
                     value="k.hadj@alemni.dz"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="phone" size={20} color={COLORS.primary} />}
                     label="PHONE"
                     value="+213 550 123 456"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="map-pin" size={20} color={COLORS.primary} />}
                     label="ADDRESS / GEOLOCATION"
                     value="Alger, Bab Ezzouar"
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
                     value="Mathematics, Physics"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<FontAwesome5 name="graduation-cap" size={16} color={COLORS.primary} />}
                     label="LEVELS TAUGHT"
                     value="Terminale S · Bac · 2AS"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="monitor" size={20} color={COLORS.primary} />}
                     label="TEACHING MODE"
                     value="Online · Hybrid"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="home" size={20} color={COLORS.primary} />}
                     label="NATURE"
                     value="Independent"
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="HOME VISITS / DISPLACEMENT"
                     value="Yes – within Alger"
                   />
                </View>
            </Animated.View>

            {/* Pedagogical Description */}
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Pedagogical Description" />
                <View style={[styles.card, {padding: 20}]}>
                    <Text style={styles.descriptionText}>
                      Experienced math teacher with 8+ years helping Terminale S students achieve their best results. My approach focuses on building deep understanding rather than memorization, with tailored exercises and regular progress evaluation.
                    </Text>
                </View>
            </Animated.View>

            {/* Weekly Availability */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Weekly Availability" />
                <View style={[styles.card, styles.availabilityCard]}>
                    <View style={styles.weekRow}>
                       {availability.map((day, index) => (
                           <View key={index} style={styles.dayColumn}>
                               <Text style={styles.dayLabel}>{day.day}</Text>
                               <View style={[
                                 styles.dayStatus, 
                                 { backgroundColor: day.status === '-' ? '#F5F5F5' : COLORS.primary }
                               ]}>
                                  {day.status !== '-' && (
                                    <Text style={styles.dayStatusText}>{day.status}</Text>
                                  )}
                               </View>
                           </View>
                       ))}
                    </View>
                </View>
            </Animated.View>

            {/* My Documents */}
            <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                   <Text style={styles.sectionTitle}>My Documents</Text>
                   <TouchableOpacity>
                      <Text style={styles.uploadLink}>Upload</Text>
                   </TouchableOpacity>
                </View>
                
                <View style={styles.card}>
                   <DocumentRow 
                     title="Algebra_Chapter3.pdf"
                     subtitle="Course · Added 25 Feb 2026"
                     icon={<FontAwesome5 name="file-pdf" size={20} color="#5C6078" />}
                     color="#5C6078"
                   />
                   <View style={styles.divider} />
                   <DocumentRow 
                     title="Exam_Exercises_Set2.pdf"
                     subtitle="Exercise · Added 20 Feb 2026"
                     icon={<FontAwesome5 name="file-contract" size={20} color="#FFB74D" />}
                     color="#FFB74D"
                   />
                   <View style={styles.divider} />
                   <DocumentRow 
                     title="Student_Progress_Feb.pdf"
                     subtitle="Progress Report · Added 28 Feb 2026"
                     icon={<FontAwesome5 name="chart-bar" size={20} color="#4CAF50" />}
                     color="#4CAF50"
                   />
                </View>
            </Animated.View>

            {/* Log Out Button */}
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <TouchableOpacity style={styles.logoutButton} onPress={() => {/* Handle Logout */}}>
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
