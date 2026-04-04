import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

export default function AllReviews() {
  const router = useRouter();
  const { evaluationsStudents: evaluationsStudentsParam, evaluationsParents: evaluationsParentsParam } = useLocalSearchParams();
  const [evaluationsStudents, setEvaluationsStudents] = useState([]);
  const [evaluationsParents, setEvaluationsParents] = useState([]);

  useEffect(() => {
    if (evaluationsStudentsParam) {
      setEvaluationsStudents(JSON.parse(evaluationsStudentsParam as string));
    }
    if (evaluationsParentsParam) {
      setEvaluationsParents(JSON.parse(evaluationsParentsParam as string));
    }
  }, [evaluationsStudentsParam, evaluationsParentsParam]);

  const ReviewCard = ({ evaluation, type }: { evaluation: any; type: string }) => (
    <View style={styles.reviewCard} key={evaluation._id ?? evaluation.date}>
      <View style={styles.reviewHeader}>
        <View style={[styles.reviewAvatar, { backgroundColor: type === 'student' ? '#00C853' : '#2196F3' }]}>
          <Text style={styles.reviewAvatarText}>{evaluation.evaluator?.first_name?.charAt(0) ?? 'U'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewName}>{`${evaluation.evaluator?.first_name || ''} ${evaluation.evaluator?.last_name || ''}`.trim() || 'Unknown Reviewer'}</Text>
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
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Reviews</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* All Reviews Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
          <SectionHeader title="All Reviews" />

          {evaluationsStudents.length === 0 && evaluationsParents.length === 0 && <Text style={{color: '#999', fontStyle: 'italic'}}>No reviews yet.</Text>}

          {evaluationsStudents.length > 0 && (
            <>
              <Text style={styles.reviewTypeHeader}>Student Reviews</Text>
              {evaluationsStudents.map((evaluation:any) => (
                evaluation && evaluation.evaluator ? (
                  <ReviewCard key={evaluation._id ?? evaluation.date} evaluation={evaluation} type="student" />
                ) : null
              ))}
            </>
          )}

          {evaluationsParents.length > 0 && (
            <>
              <Text style={styles.reviewTypeHeader}>Parent Reviews</Text>
              {evaluationsParents.map((evaluation:any) => (
                evaluation && evaluation.evaluator ? (
                  <ReviewCard key={evaluation._id ?? evaluation.date} evaluation={evaluation} type="parent" />
                ) : null
              ))}
            </>
          )}
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
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    flex: 1,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
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
    fontWeight: '500',
  },
  reviewTypeHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewFooter: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
});
