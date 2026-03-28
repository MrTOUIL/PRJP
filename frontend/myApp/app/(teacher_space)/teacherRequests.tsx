import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  green: '#00C853',
  red: '#FF3D00',
};

const REQUESTS_DATA = [
  {
    id: '1',
    studentName: 'Boutagga W.',
    time: '2 hours ago',
    subject: 'Mathematics',
    level: 'Terminale S',
    type: 'Online Session',
    message: 'I need help with calculus regarding the last chapter.',
    avatarColor: '#2962FF',
  },
  {
    id: '2',
    studentName: 'Amira D.',
    time: '5 hours ago',
    subject: 'Physics',
    level: '2AS',
    type: 'Home Visit',
    message: 'Can we schedule a session for mechanics?',
    avatarColor: '#FF6B6B',
  },
  {
    id: '3',
    studentName: 'Karim H.',
    time: '1 day ago',
    subject: 'Mathematics',
    level: 'BEM',
    type: 'Online Session',
    message: 'Revision for the upcoming exam please.',
    avatarColor: '#1A1A5E',
  },
];

export default function TeacherRequests() {
  const router = useRouter();

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.avatarText}>{item.studentName.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
        </View> 
        <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
            <MaterialCommunityIcons name="school-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.infoText}>{item.level} • {item.subject}</Text>
        </View>
        <Text style={styles.messageText}>"{item.message}"</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.declineBtn]}>
            <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.acceptBtn]}>
            <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Requests</Text>
      </View>
      
      <FlatList
        data={REQUESTS_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  typeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    color: '#1565C0',
    fontWeight: '700',
  },
  content: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
  },
  declineBtn: {
    backgroundColor: '#F5F5F5',
  },
  acceptText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  declineText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
