import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  unread: '#E3F2FD',
};

const NOTIFICATIONS_DATA = [
  {
    id: '1',
    title: 'Session Reminder',
    message: 'You have a session with Boutagga W. in 2 hours.',
    time: 'Just now',
    type: 'reminder',
    unread: true,
  },
  {
    id: '2',
    title: 'New Review',
    message: 'Amira D. left a 5-star review regarding your last physics session.',
    time: '3 hours ago',
    type: 'review',
    unread: true,
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'You received a payment of 800 DZD for the session with Yacine K.',
    time: 'Yesterday',
    type: 'payment',
    unread: false,
  },
  {
    id: '4',
    title: 'New Service Request',
    message: 'A new student requested a Mathematics session.',
    time: '2 days ago',
    type: 'request',
    unread: false,
  },
];

export default function TeacherNotifications() {
  const router = useRouter();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'reminder': return 'alarm';
      case 'review': return 'star';
      case 'payment': return 'cash';
      case 'request': return 'account-plus';
      default: return 'bell';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'reminder': return '#FF9800';
      case 'review': return '#FFD700';
      case 'payment': return '#4CAF50';
      case 'request': return '#2196F3';
      default: return COLORS.primary;
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity style={[styles.notificationCard, item.unread && styles.unreadCard]}>
            <View style={[styles.iconContainer, { backgroundColor: getColorForType(item.type) + '20' }]}>
                <MaterialCommunityIcons name={getIconForType(item.type) as any} size={24} color={getColorForType(item.type)} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Stay updated with your activities</Text>
        </View>
        <TouchableOpacity style={styles.markAllBtn}>
            <Ionicons name="checkmark-done-circle-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS_DATA}
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
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  markAllBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  listContent: {
    padding: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
    marginLeft: 8,
  },
});
