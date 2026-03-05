import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TUTOR_SUGGESTIONS = [
  { id: 1, name: 'Sara Belhadj', subject: 'Physics', price: '800 DZD', rating: '4.8', color: '#1E1B6B' },
  { id: 2, name: 'M. Rahmani', subject: 'Maths', price: '650 DZD', rating: '4.9', color: '#1E293B' },
  { id: 3, name: 'Laila Mansouri', subject: 'English', price: '700 DZD', rating: '4.7', color: '#FFD700' },
];

const AVAILABLE_SERVICES = [
  { id: 1, name: 'Individual Math Sessions', icon: 'calculator', color: '#1E1B6B' }, // Deep Blue
  { id: 2, name: 'English Conversation Practice', icon: 'chatbubbles', color: '#FFD700' }, // Gold
];

const MY_SUBJECTS = [
  { id: 1, name: 'Algebra', progress: 0.65, color: '#1E1B6B' }, // Deep Blue
  { id: 2, name: 'Thermo', progress: 0.30, color: '#475569' }, // Slate
  { id: 3, name: 'English', progress: 1.0, color: '#FFD700' }, // Gold
  { id: 4, name: 'Biology', progress: 0.52, color: '#334155' }, // Dark Slate
];

export default function StudentSpace() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
             <View style={styles.avatarContainer}>
               <Text style={styles.avatarText}>Y</Text>
             </View>
             <View>
               <Text style={styles.welcomeText}>Welcome back,</Text>
               <Text style={styles.userName}>Student Name</Text>
             </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
             <Ionicons name="notifications-outline" size={24} color="#fff" />
             <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(100).duration(600).springify()} style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search tutors, subjects, files..." 
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          <TouchableOpacity>
             <Ionicons name="filter" size={20} color="#1E1B6B" /> {/* Deep Blue */}
          </TouchableOpacity>
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
             <Text style={styles.joinButtonText}>Join</Text>
             <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Tutor Suggestions */}
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
                            <View>
                                <Text style={styles.tutorName}>{tutor.name}</Text>
                                <Text style={styles.tutorSubject}>{tutor.subject}</Text>
                            </View>
                        </View>
                        <View style={styles.tutorFooter}>
                            <Text style={styles.tutorPrice}>{tutor.price}</Text>
                            <TouchableOpacity style={styles.tutorButton}>
                                <Ionicons name="paper-plane-outline" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>
        </Animated.View>

        {/* Available Services */}
        <Animated.View entering={FadeInUp.delay(700).duration(600)}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Services</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>Browse all</Text></TouchableOpacity>
            </View>
            <View>
                {AVAILABLE_SERVICES.map((service) => (
                    <View key={service.id} style={styles.serviceCard}>
                         <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                            <Ionicons name={service.icon as any} size={24} color="#fff" />
                         </View>
                         <View style={styles.serviceInfo}>
                            <Text style={styles.serviceName}>{service.name}</Text>
                            <Text style={styles.serviceSub}>800 DZD</Text>
                         </View>
                         <TouchableOpacity style={styles.bookButton}>
                            <Text style={styles.bookButtonText}>Book</Text>
                         </TouchableOpacity>
                    </View>
                ))}
            </View>
        </Animated.View>

        {/* My Subjects */}
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

        {/* My Requests (Preview) */}
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

        <View style={{height: 100}} />
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
    paddingTop: 50, // Standard status bar spacing
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 215, 0, 0.2)', // Gold tint
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      borderWidth: 2,
      borderColor: '#FFD700', // Gold border
  },
  avatarText: {
      fontWeight: 'bold',
      color: '#FFD700', // Gold text
      fontSize: 20,
  },
  welcomeText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
      marginBottom: 2,
  },
  userName: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
  },
  notificationButton: {
      padding: 8,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 12,
  },
  notificationBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFD700', // Gold notification dot
      borderWidth: 1,
      borderColor: '#1E1B6B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
      padding: 20,
      paddingTop: 0,
      overflow: 'visible',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 20, // Clean separation
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,    // Higher elevation
    zIndex: 20,       // Ensure it sits on top of header
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 15,
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
      borderRadius: 18,
      padding: 20,
      marginBottom: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#1E1B6B',
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 12,
      elevation: 6,
  },
  promoContent: {
      flex: 1,
      marginRight: 15,
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
      backgroundColor: '#FFD700', // Gold button
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
  joinButtonText: {
      color: '#1E1B6B', // Blue text on Gold
      fontWeight: 'bold',
      marginRight: 5,
      fontSize: 14,
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
      paddingLeft: 5,
  },
  tutorCard: {
      backgroundColor: '#fff',
      width: 150,
      padding: 15,
      borderRadius: 16,
      marginRight: 15,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 3,
      marginBottom: 5,
  },
  tutorHeader: {
      alignItems: 'center',
      marginBottom: 12,
  },
  tutorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  tutorAvatarText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
  },
  tutorName: {
      fontWeight: '700',
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 2,
      color: '#1E293B',
  },
  tutorSubject: {
      fontSize: 11,
      color: '#64748B',
      textAlign: 'center',
  },
  tutorFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
  },
  tutorPrice: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#1E1B6B',
  },
  tutorButton: {
      backgroundColor: '#EFF6FF', // Light Blue
      padding: 6,
      borderRadius: 15,
  },
  serviceCard: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      borderRadius: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
  },
  serviceIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  serviceInfo: {
      flex: 1,
  },
  serviceName: {
      fontWeight: '600',
      fontSize: 15,
      color: '#1E293B',
      marginBottom: 2,
  },
  serviceSub: {
      fontSize: 12,
      color: '#64748B',
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
