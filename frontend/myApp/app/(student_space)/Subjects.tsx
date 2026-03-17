import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withTiming, withDelay, ZoomIn } from 'react-native-reanimated';
import StudentTopFilters, { StudentMenuFilter } from './StudentTopFilters';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

const subjects = [
  { id: 1, name: 'Algebra & Functions', progress: 0.58, color: '#5C6BC0', icon: 'calculator' },
  { id: 2, name: 'Thermodynamics', progress: 0.30, color: '#26A69A', icon: 'thermometer' },
  { id: 3, name: 'English B2', progress: 1.0, color: '#FFCA28', icon: 'language' },
  { id: 4, name: 'Biology', progress: 0.62, color: '#EF5350', icon: 'flask' },
  { id: 5, name: 'Chemistry', progress: 0.40, color: '#AB47BC', icon: 'telescope' },
];

type StudentSubjectsProps = {
  onSelectFilter?: (filter: StudentMenuFilter) => void;
};

export default function StudentSubjects({ onSelectFilter }: StudentSubjectsProps) {
  const chartProgress = useSharedValue(0);
  const router = useRouter();
  useEffect(() => {
    chartProgress.value = withDelay(500, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedChartStyle = useAnimatedStyle(() => {
    return {
      opacity: chartProgress.value,
      transform: [{ scale: chartProgress.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(student_space)/studentSpace')}>
           <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subjects</Text>
        <TouchableOpacity>
           <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
       
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {[
             { num: '5', label: 'SUBJECTS', delay: 200 },
             { num: '58%', label: 'AVG PROGRESS', delay: 300 },
             { num: '1', label: 'COMPLETED', delay: 400 },
          ].map((stat, idx) => (
             <Animated.View key={idx} entering={FadeInUp.delay(stat.delay).duration(500)} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.num}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
             </Animated.View>
          ))}
        </View>

        {/* All Subjects Chart Area (Mocked) */}
        <Animated.View entering={ZoomIn.delay(400).duration(600)} style={styles.chartSection}>
          <Text style={styles.sectionTitle}>All Subjects</Text>
          <View style={styles.chartContainer}>
            {/* Mocking a circular chart with a View and border */}
             <Animated.View style={[styles.chartCircle, animatedChartStyle]}>
                <View style={[styles.chartInnerCircle, { borderColor: '#5C6BC0' }]} />
                <View style={[styles.chartInnerCircle, { borderColor: '#26A69A', transform: [{rotate: '45deg'}] }]} />
                <View style={[styles.chartInnerCircle, { borderColor: '#FFCA28', transform: [{rotate: '90deg'}] }]} />
                <View style={styles.chartCenterTextContainer}>
                     <Text style={styles.chartCenterText}>5</Text>
                     <Text style={styles.chartCenterSubText}>Enrolled</Text>
                </View>
             </Animated.View>
             <View style={styles.legendContainer}>
                {subjects.slice(0, 3).map((sub, idx) => (
                    <Animated.View key={idx} entering={FadeInUp.delay(600 + (idx*100))} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: sub.color }]} />
                        <Text style={styles.legendText}>{sub.name}</Text>
                    </Animated.View>
                ))}
             </View>
          </View>
        </Animated.View>

        {/* Progress Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Progress Details</Text>
          {subjects.map((sub, index) => (
            <Animated.View key={index} entering={FadeInUp.delay(500 + (index * 100)).duration(500)}>
                <TouchableOpacity style={styles.subjectCard}>
                  <View style={[styles.iconContainer, { backgroundColor: sub.color + '20' }]}>
                    <Ionicons name={sub.icon as any} size={24} color={sub.color} />
                  </View>
                  <View style={styles.subjectInfo}>
                    <View style={styles.subjectHeader}>
                        <Text style={styles.subjectName}>{sub.name}</Text>
                        {sub.progress === 1.0 && <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />}
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${sub.progress * 100}%`, backgroundColor: sub.color }]} />
                    </View>
                    <Text style={styles.progressText}>{Math.round(sub.progress * 100)}%</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>
                </TouchableOpacity>
            </Animated.View>
          ))}
          {/* Add New Button Mock */}
          <Animated.View entering={FadeInUp.delay(1000).duration(500)}>
             <TouchableOpacity style={styles.addNewButton}>
                 <Ionicons name="add" size={24} color="#ccc" />
                 <Text style={styles.addNewText}>Add New</Text>
             </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={{height: 100}} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 25,
    backgroundColor: '#1E1B6B', // Deep Blue
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginTop: 10, // Clean separation
  },
  scrollContent: {
      paddingBottom: 40,
  },
  filtersWrap: {
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10, 
  },
  statCard: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: (width - 60) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B6B', // Deep Blue
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B', // Slate
    fontWeight: '600',
    textAlign: 'center',
  },
  chartSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B', // Dark Slate
    marginBottom: 16,
    marginLeft: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartCircle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 20,
  },
  chartInnerCircle: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 60,
      borderWidth: 8,
      borderColor: 'transparent',
      opacity: 0.8,
  },
  chartCenterTextContainer: {
      position: 'absolute',
      alignItems: 'center',
  },
  chartCenterText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1E1B6B', // Deep Blue
  },
  chartCenterSubText: {
      fontSize: 12,
      color: '#64748B', // Slate
  },
  legendContainer: {
      flex: 1,
      justifyContent: 'center',
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
  legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
  },
  legendText: {
      fontSize: 14,
      color: '#475569', // Slate
      fontWeight: '500',
  },
  detailsSection: {
    paddingHorizontal: 20,
  },
  subjectCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
    marginRight: 10,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B', // Dark Slate
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F1F5F9', // Light Slate
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B', // Slate
    textAlign: 'right',
  },
  addNewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      marginTop: 10,
      marginBottom: 30, // Space at bottom
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: '#CBD5E1', // Slate 300
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  addNewText: {
      marginLeft: 8,
      fontSize: 16,
      color: '#64748B', // Slate
      fontWeight: '500',
  },
});
