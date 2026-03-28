import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, Platform } from 'react-native';
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

const MESSAGES_DATA = [
  {
    id: '1',
    sender: 'Boutagga W.',
    subject: 'Question about Homework',
    preview: 'Hello sir, could you explain the last exercise?',
    time: '10:30 AM',
    unread: true,
    avatarColor: '#2962FF',
  },
  {
    id: '2',
    sender: 'Amira D.',
    subject: 'Session Reschedule',
    preview: 'I would like to move our session to Friday if possible.',
    time: 'Yesterday',
    unread: false,
    avatarColor: '#FF6B6B',
  },
  {
    id: '3',
    sender: 'Parent of Karim',
    subject: 'Progress Report',
    preview: 'Thank you for the detailed report on Karim\'s progress.',
    time: '2 days ago',
    unread: false,
    avatarColor: '#1A1A5E',
  },
];

export default function TeacherMessages() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity 
          style={[styles.messageCard, item.unread && styles.unreadCard]}
          onPress={() => router.push({
            pathname: '/(teacher_space)/messageReply',
            params: {
              sender: item.sender,
              subject: item.subject,
              initialMessage: item.preview, 
              avatarColor: item.avatarColor
            }
          })}
        >
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
            <Text style={styles.avatarText}>{item.sender.charAt(0)}</Text>
        </View>
        <View style={styles.messageContent}>
            <View style={styles.headerRow}>
                <Text style={[styles.senderName, item.unread && styles.unreadText]}>{item.sender}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={[styles.subjectText, item.unread && styles.unreadText]} numberOfLines={1}>{item.subject}</Text>
            <Text style={styles.previewText} numberOfLines={2}>{item.preview}</Text>
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
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity style={styles.composeBtn}>
            <MaterialCommunityIcons name="pencil-plus-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={COLORS.textLight}
        />
      </View>

      <FlatList
        data={MESSAGES_DATA}
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
    justifyContent: 'space-between',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  composeBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
  },
  listContent: {
    padding: 16,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  messageContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  subjectText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  previewText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#000',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
});
