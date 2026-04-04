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
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

export default function AllSessions() {
  const router = useRouter();
  const { sortedSessions: sortedSessionsParam } = useLocalSearchParams();
  const [sortedSessions, setSortedSessions] = useState([]);

  useEffect(() => {
    if (sortedSessionsParam) {
      setSortedSessions(JSON.parse(sortedSessionsParam as string));
    }
  }, [sortedSessionsParam]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Sessions</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* All Sessions Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
          <SectionHeader title="All Sessions" />

          {sortedSessions.length === 0 && <Text style={{color: '#999', fontStyle: 'italic'}}>No sessions available.</Text>}

          {sortedSessions.length > 0 && sortedSessions.map((session, idx) => (
            <View key={session._id || idx} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionTitle}>{session.service?.title}</Text>
                  <Text style={styles.sessionSubtitle}>{session.location}</Text>
                </View>
                <View>
                  <Text style={styles.sessionStatus}>{session.status}</Text>
                </View>
              </View>

              <View style={styles.sessionDetails}>
                <View style={styles.detailRow}>
                  <Feather name="calendar" size={14} color="#A0A0E0" />
                  <Text style={styles.detailText}>{session.Date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Feather name="clock" size={14} color="#A0A0E0" />
                  <Text style={styles.detailText}>{session.start_time} - {session.end_time}</Text>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => router.push({
                    pathname:"/(teacher_space)/DocumentService", 
                    params:{sessionid:session._id}
                  })}
                >
                  <MaterialCommunityIcons name="upload" size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Upload Document</Text>
                </TouchableOpacity>


                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => router.push({
                  pathname:"/(teacher_space)/AllDocService" , 
                  params:{sessionid: session._id}
                })}
                >
                  <MaterialCommunityIcons name="file-document" size={16} color={COLORS.primary} />
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>See Documents</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  sessionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sessionStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.green,
    textTransform: 'uppercase',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 6,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});
