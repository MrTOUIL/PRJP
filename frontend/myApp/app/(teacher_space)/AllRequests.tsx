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
import { Ionicons } from '@expo/vector-icons';
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

export default function AllRequests() {
  const router = useRouter();
  const { studentRequests: studentRequestsParam, parentRequests: parentRequestsParam } = useLocalSearchParams();
  const [studentRequests, setStudentRequests] = useState([]);
  const [parentRequests, setParentRequests] = useState([]);

  useEffect(() => {
    if (studentRequestsParam) {
      setStudentRequests(JSON.parse(studentRequestsParam as string));
    }
    if (parentRequestsParam) {
      setParentRequests(JSON.parse(parentRequestsParam as string));
    }
  }, [studentRequestsParam, parentRequestsParam]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Requests</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* All Requests Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
          <SectionHeader title="All Requests" />

          {studentRequests.length === 0 && parentRequests.length === 0 && <Text style={{color: '#999', fontStyle: 'italic'}}>No requests available.</Text>}

          {studentRequests.length > 0 && (
            <>
              <Text style={styles.requestTypeHeader}>Student Requests</Text>
              {studentRequests.map((req, idx) => (
            req && req.requester ? (
              <View key={req._id || idx} style={styles.requestCard}>
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

                <Text style={styles.reqObjectif}>Objectif: {req.objectif}</Text>
                <Text style={styles.reqFrequency}>Fréquence: {req.frequence}</Text>
                <Text style={styles.reqDuree}>Durée: {req.duree}</Text>

                <Text style={styles.reqPrice}>{req.price}.00DA<Text style={styles.reqPriceUnit}>/session</Text></Text>

                <View style={styles.reqActions}>
                  <TouchableOpacity style={styles.acceptBtn}>
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn}>
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          ))}
            </>
          )}

          {parentRequests.length > 0 && (
            <>
              <Text style={styles.requestTypeHeader}>Parent Requests</Text>
              {parentRequests.map((req, idx) => (
            req && req.requester ? (
              <View key={req._id || idx} style={styles.requestCard}>
                <View style={[styles.requestAvatar, { backgroundColor: "#2196F3" }]}>
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

                <Text style={styles.reqObjectif}>Objectif: {req.objectif}</Text>
                <Text style={styles.reqFrequency}>Fréquence: {req.frequence}</Text>
                <Text style={styles.reqDuree}>Durée: {req.duree}</Text>

                <Text style={styles.reqPrice}>{req.price}.00DA<Text style={styles.reqPriceUnit}>/session</Text></Text>

                <View style={styles.reqActions}>
                  <TouchableOpacity style={styles.acceptBtn}>
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn}>
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  requestCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  reqName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  reqSchool: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  reqObjectif: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  reqFrequency: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  reqDuree: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  reqTags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reqTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  reqTagText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '700',
  },
  reqPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  reqPriceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.textLight,
  },
  reqActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  requestTypeHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
  },
});
