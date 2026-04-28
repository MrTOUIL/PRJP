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
import { Feather, Ionicons } from '@expo/vector-icons';
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

export default function AllServices() {
  const router = useRouter();
  const { teacherServices: teacherServicesParam, teacher: teacherParam } = useLocalSearchParams();
  const [teacherServices, setTeacherServices] = useState([]);
  const [teacher, setTeacher] = useState({});

  useEffect(() => {
    if (teacherServicesParam) {
      setTeacherServices(JSON.parse(teacherServicesParam as string));
    }
    if (teacherParam) {
      setTeacher(JSON.parse(teacherParam as string));
    }
  }, [teacherServicesParam, teacherParam]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Services</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* All Services Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
          <SectionHeader title="All Active Services" />

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

              {service.comment ? (
                <Text style={styles.commentText}>{service.comment}</Text>
              ) : (
                <Text style={styles.commentPlaceholder}>No comment available</Text>
              )}

              <TouchableOpacity
                style={styles.createSessionButton}
                onPress={() => router.push({pathname:"/(teacher_space)/CreateSession" , params:{serviceid:service._id}})}
              >
                <Text style={styles.createSessionButtonText}>Create Session</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.viewRelatedSessionsButton} onPress={() => router.push({
                pathname:"/(teacher_space)/ServiceSessions",
                params:{id_service:service._id}
              })}>
                <Text style={styles.viewRelatedSessionsButtonText}>View Related Sessions</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addStudentButton} onPress={() => router.push({
                pathname:"/(teacher_space)/AddStudent",
                params:{serviceid:service._id, serviceTitle:service.title}
              })}>
                <Text style={styles.addStudentButtonText}>add student to this service</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createSessionButton} onPress={() => router.push({
                pathname: "/(teacher_space)/ViewStudent",
                params: { serviceid: service._id, serviceTitle: service.title }
              })}>
                <Text style={styles.createSessionButtonText}>view my students for this service</Text>
              </TouchableOpacity>
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
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  servicePriceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.textLight,
  },
  serviceTags: {
    flexDirection: 'row',
    gap: 8,
  },
  smallTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  smallTagText: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 10,
    marginBottom: 12,
  },
  commentPlaceholder: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 10,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  createSessionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createSessionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  viewRelatedSessionsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewRelatedSessionsButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  addStudentButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  addStudentButtonText: {
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  viewStudentsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewStudentsButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
