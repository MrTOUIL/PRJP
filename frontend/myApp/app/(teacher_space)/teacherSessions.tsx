
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FontAwesome5, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#1A1A5E',
  secondary: '#FFD700',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  green: '#00C853',
  red: '#FF3D00',
  blue: '#2962FF',
  lightBlue: '#E3F2FD',
  lightOrange: '#FFF3E0',
  orange: '#FF9800',
};

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function TeacherSessions() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(27);

  // Animation for "Start Session" button pulse
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const dates = [
    { day: 'MON', date: 24, dots: 1 },
    { day: 'TUE', date: 25, dots: 0 },
    { day: 'WED', date: 26, dots: 2 },
    { day: 'THU', date: 27, dots: 1, active: true },
    { day: 'FRI', date: 28, dots: 1 },
    { day: 'SAT', date: 1, dots: 1 },
    { day: 'SUN', date: 2, dots: 0 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Sessions</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Summary Cards */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.iconBox}>
                 <FontAwesome5 name="calendar-day" size={16} color="#A74D4D" />
              </View>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>TODAY</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.iconBox}>
                 <FontAwesome5 name="calendar-alt" size={16} color="#5C6078" />
              </View>
              <Text style={styles.summaryValue}>18</Text>
              <Text style={styles.summaryLabel}>THIS MONTH</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.iconBox}>
                 <FontAwesome5 name="hourglass-half" size={16} color="#E67E22" />
              </View>
              <Text style={styles.summaryValue}>6</Text>
              <Text style={styles.summaryLabel}>PENDING</Text>
            </View>
          </Animated.View>

          {/* Calendar Strip */}
          <View style={styles.sectionHeader}>
            <Text style={styles.monthTitle}>February 2026</Text>
            <TouchableOpacity>
              <Text style={styles.viewMonthBtn}>Month View</Text>
            </TouchableOpacity>
          </View>

          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
              {dates.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.dateItem, item.active && styles.activeDateItem]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[styles.dayText, item.active && styles.activeDayText]}>{item.day}</Text>
                  <Text style={[styles.dateText, item.active && styles.activeDateText]}>{item.date}</Text>
                  {item.dots > 0 && (
                     <View style={[styles.dotContainer, item.dots === 2 && { width: 10 }]}>
                        <View style={[styles.dot, item.active && styles.activeDot]} />
                        {item.dots === 2 && <View style={[styles.dot, item.active && styles.activeDot, {marginLeft: 2}]} />}
                     </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          <Text style={styles.dateSectionTitle}>Thursday, 27 Feb</Text>

          {/* Timeline */}
          <View style={styles.timelineContainer}>
            
            {/* Session 1 */}
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.timelineItem}>
               <Text style={styles.timeText}>10:00</Text>
               <View style={styles.timelineLineContainer}>
                  <View style={[styles.timelineDot, {backgroundColor: COLORS.green}]} />
                  <View style={styles.timelineLine} />
               </View>
               <View style={styles.sessionCard}>
                  <Text style={styles.sessionTitle}>General Algebra</Text>
                  <Text style={styles.sessionSubtitle}>Yacine M. · Online · 60 min</Text>
                  <View style={styles.tagsRow}>
                     <View style={[styles.tag, {backgroundColor: '#E8F5E9'}]}>
                        <Text style={[styles.tagText, {color: COLORS.green}]}>Confirmed</Text>
                     </View>
                     <View style={[styles.tag, {backgroundColor: '#F3E5F5'}]}>
                        <Text style={[styles.tagText, {color: '#7B1FA2'}]}>Individual</Text>
                     </View>
                  </View>
               </View>
            </Animated.View>

             {/* Session 2 - Active with Button */}
            <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.timelineItem}>
               <Text style={styles.timeText}>14:00</Text>
               <View style={styles.timelineLineContainer}>
                  <View style={[styles.timelineDot, {backgroundColor: COLORS.secondary}]} />
                  <View style={styles.timelineLine} />
               </View>
               <View style={[styles.sessionCard, styles.activeSessionCard]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                     <Text style={styles.sessionTitle}>Advanced Mathematics</Text>
                     <Feather name="clock" size={14} color="#666" style={{marginLeft: 5}} />
                  </View>
                  <Text style={styles.sessionSubtitle}>Boutagga W. · Online · 90 min</Text>
                  <View style={styles.tagsRow}>
                     <View style={[styles.tag, {backgroundColor: '#E8F5E9'}]}>
                        <Text style={[styles.tagText, {color: COLORS.green}]}>Confirmed</Text>
                     </View>
                     <View style={[styles.tag, {backgroundColor: '#F3E5F5'}]}>
                        <Text style={[styles.tagText, {color: '#7B1FA2'}]}>Individual</Text>
                     </View>
                  </View>
                  <AnimatedTouchableOpacity style={[styles.startSessionBtn, animatedPulseStyle]}>
                     <Text style={styles.startSessionText}>Start Session</Text>
                     <AntDesign name="arrowright" size={16} color="#FFF" />
                  </AnimatedTouchableOpacity>
               </View>
            </Animated.View>

            {/* Session 3 */}
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.timelineItem}>
               <Text style={styles.timeText}>17:00</Text>
               <View style={styles.timelineLineContainer}>
                  <View style={[styles.timelineDot, {backgroundColor: COLORS.primary}]} />
                  <View style={styles.timelineLine} />
               </View>
               <View style={styles.sessionCard}>
                  <Text style={styles.sessionTitle}>Maths Group Session</Text>
                  <Text style={styles.sessionSubtitle}>3 students · In-person · 60 min</Text>
                  <View style={styles.tagsRow}>
                     <View style={[styles.tag, {backgroundColor: '#E8F5E9'}]}>
                        <Text style={[styles.tagText, {color: COLORS.green}]}>Confirmed</Text>
                     </View>
                     <View style={[styles.tag, {backgroundColor: '#E3F2FD'}]}>
                        <Text style={[styles.tagText, {color: COLORS.blue}]}>Group</Text>
                     </View>
                  </View>
               </View>
            </Animated.View>

            {/* Session 4 */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.timelineItem}>
               <Text style={styles.timeText}>19:30</Text>
               <View style={styles.timelineLineContainer}>
                  <View style={[styles.timelineDot, {backgroundColor: COLORS.orange}]} />
                  <View style={styles.timelineLine} />
               </View>
               <View style={styles.sessionCard}>
                  <Text style={styles.sessionTitle}>Exam Prep – Calculus</Text>
                  <Text style={styles.sessionSubtitle}>Amira D. · Online · 90 min</Text>
                  <View style={styles.tagsRow}>
                     <View style={[styles.tag, {backgroundColor: '#FFF3E0'}]}>
                        <Text style={[styles.tagText, {color: COLORS.orange}]}>Pending</Text>
                     </View>
                     <View style={[styles.tag, {backgroundColor: '#F3E5F5'}]}>
                        <Text style={[styles.tagText, {color: '#7B1FA2'}]}>Individual</Text>
                     </View>
                  </View>
               </View>
            </Animated.View>

          </View>

          {/* Upcoming This Week */}
          <View style={[styles.sectionHeader, {marginTop: 20}]}>
            <Text style={styles.sectionTitle}>Upcoming This Week</Text>
            <TouchableOpacity>
              <Text style={styles.viewMonthBtn}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <Animated.View entering={FadeInDown.delay(700).springify()}>
             {/* Upcoming Item 1 */}
             <View style={styles.upcomingItem}>
                <View style={styles.upcomingHeader}>
                   <View style={[styles.avatarCircle, {backgroundColor: '#5C6BC0'}]}>
                      <Text style={styles.avatarText}>Y</Text>
                   </View>
                   <View style={{flex: 1}}>
                      <Text style={styles.upcomingItemTitle}>Algebra – Yacine M.</Text>
                      <Text style={styles.upcomingItemDate}>Sat 1 Mar · 10:00-11:00 · Online</Text>
                   </View>
                   <Text style={[styles.statusText, {color: COLORS.green}]}>Confirmed</Text>
                </View>
                <View style={styles.tagsRowSmall}>
                    <View style={styles.smallTag}><Feather name="video" size={10} color="#666"/><Text style={styles.smallTagText}>Online</Text></View>
                    <View style={styles.smallTag}><Feather name="user" size={10} color="#666"/><Text style={styles.smallTagText}>Individual</Text></View>
                    <View style={styles.smallTag}><Feather name="clock" size={10} color="#666"/><Text style={styles.smallTagText}>60 min</Text></View>
                </View>
                <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonTextSec}>View Details</Text>
                </TouchableOpacity>
             </View>

             {/* Upcoming Item 2 */}
             <View style={styles.upcomingItem}>
                <View style={styles.upcomingHeader}>
                   <View style={[styles.avatarCircle, {backgroundColor: '#F57C00'}]}>
                      <Text style={styles.avatarText}>A</Text>
                   </View>
                   <View style={{flex: 1}}>
                      <Text style={styles.upcomingItemTitle}>Calculus – Amira D.</Text>
                      <Text style={styles.upcomingItemDate}>Sat 1 Mar · 15:00-16:30 · Hybrid</Text>
                   </View>
                   <Text style={[styles.statusText, {color: COLORS.orange}]}>Pending</Text>
                </View>
                <View style={styles.tagsRowSmall}>
                    <View style={styles.smallTag}><Feather name="map-pin" size={10} color="#666"/><Text style={styles.smallTagText}>Hybrid</Text></View>
                    <View style={styles.smallTag}><Feather name="user" size={10} color="#666"/><Text style={styles.smallTagText}>Individual</Text></View>
                    <View style={styles.smallTag}><Feather name="clock" size={10} color="#666"/><Text style={styles.smallTagText}>90 min</Text></View>
                </View>
                <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonTextSec}>Confirm Session</Text>
                </TouchableOpacity>
             </View>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  searchButton: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    width: (width - 55) / 3,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 9, // Small font
    color: '#999',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  viewMonthBtn: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  calendarStrip: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  dateItem: {
    backgroundColor: '#FFFFFF',
    width: 55,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  activeDateItem: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  activeDayText: {
    color: 'rgba(255,255,255,0.7)',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 4,
    height: 4,
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  activeDot: {
    backgroundColor: COLORS.secondary,
  },
  dateSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  timelineContainer: {
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeText: {
    width: 45,
    fontSize: 12,
    color: '#999',
    paddingTop: 2,
  },
  timelineLineContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  sessionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  activeSessionCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  startSessionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  startSessionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  upcomingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  upcomingItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  upcomingItemDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tagsRowSmall: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  smallTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  smallTagText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  actionButtonSecondary: {
    backgroundColor: '#F5F5F9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonTextSec: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
