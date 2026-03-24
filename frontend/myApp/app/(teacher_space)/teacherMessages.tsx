import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#1E1B6B',      // Deep Blue
  secondary: '#FFD700',    // Gold
  background: '#F8FAFC',   // Light Blue-Grey
  cardBg: '#FFFFFF',
  textDark: '#1E293B',     // Dark Slate
  textLight: '#64748B',    // Slate
  green: '#10B981',        // Emerald
  red: '#EF4444',
  gray: '#94A3B8',
  lightGray: '#E2E8F0',
};

// Mock Data for Messages
const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'Boutagga Wafa',
    role: 'Student',
    subject: 'Question regarding the last calculus session',
    preview: 'Hello Mr. Hadj, I reviewed the notes from our last session and I have a question about...',
    date: '10:30 AM',
    read: false,
    avatar: 'B',
    avatarColor: '#00C853',
  },
  {
    id: '2',
    sender: 'Amira Darsi (Parent)',
    role: 'Parent',
    subject: 'Rescheduling next week\'s appointment',
    preview: 'Good morning, unfortunately Amira has a dentist appointment next Tuesday. Can we move the...',
    date: 'Yesterday',
    read: true,
    avatar: 'A',
    avatarColor: '#FF9800',
  },
  {
    id: '3',
    sender: 'System Admin',
    role: 'Admin',
    subject: 'Updates to the Teacher Platform',
    preview: 'We have updated our terms of service and added new features to the whiteboard. Please review...',
    date: '20 Feb',
    read: true,
    avatar: 'S',
    avatarColor: '#2962FF',
  },
  {
    id: '4',
    sender: 'Yacine K.',
    role: 'Student',
    subject: 'Homework Submission: Physics Ch.3',
    preview: 'Please find attached my solutions for the exercises you assigned. I found distinct problems with...',
    date: '18 Feb',
    read: true,
    avatar: 'Y',
    avatarColor: '#6200EA',
  },
];

export default function TeacherMessages() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Inbox'); // Inbox, Sent, Archive
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Filter messages logic
  const filteredMessages = messages.filter(msg => 
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity 
        style={[styles.messageCard, !item.read && styles.unreadCard]} 
        onPress={() => setSelectedMessage(item)}
      >
        <View style={styles.cardLeft}>
            <View style={[styles.avatarContainer, { backgroundColor: item.avatarColor }]}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
        </View>
        
        <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
                <Text style={[styles.senderName, !item.read && styles.unreadText]}>{item.sender}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={[styles.roleText, {color: item.role === 'Parent' ? '#E65100' : '#475569'}]}>{item.role}</Text>
            <Text style={[styles.subjectText, !item.read && styles.unreadText]} numberOfLines={1}>{item.subject}</Text>
            <Text style={styles.previewText} numberOfLines={2}>{item.preview}</Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Messages</Text>
            <TouchableOpacity style={styles.composeButtonHeader} onPress={() => {}}>
                <Feather name="edit-3" size={20} color="#fff" />
            </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
                placeholder="Search inbox..."
                placeholderTextColor={COLORS.gray}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </Animated.View>
      </View>

      <View style={styles.bodyContent}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {['Inbox', 'Sent', 'Archive'].map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        {tab === 'Inbox' && <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Messages List */}
            <FlatList
                data={filteredMessages}
                renderItem={renderMessageItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="mail-open-outline" size={60} color={COLORS.lightGray} />
                        <Text style={styles.emptyText}>No messages found</Text>
                    </View>
                }
            />
      </View>

      {/* Message Detail Modal (Simple Mailbox View) */}
      <Modal
        visible={!!selectedMessage}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMessage(null)}
      >
        {selectedMessage && (
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setSelectedMessage(null)} style={styles.closeButton}>
                        <Ionicons name="chevron-down" size={24} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.modalActionBtn}><Feather name="trash-2" size={20} color={COLORS.textDark} /></TouchableOpacity>
                        <TouchableOpacity style={styles.modalActionBtn}><Feather name="corner-up-left" size={20} color={COLORS.textDark} /></TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <Text style={styles.detailSubject}>{selectedMessage.subject}</Text>
                    
                    <View style={styles.detailSenderRow}>
                        <View style={[styles.avatarContainer, { backgroundColor: selectedMessage.avatarColor, width: 40, height: 40 }]}>
                            <Text style={[styles.avatarText, { fontSize: 18 }]}>{selectedMessage.avatar}</Text>
                        </View>
                        <View style={{marginLeft: 10, flex: 1}}>
                            <Text style={styles.detailSenderName}>{selectedMessage.sender} <Text style={styles.detailRole}>({selectedMessage.role})</Text></Text>
                            <Text style={styles.detailDate}>{selectedMessage.date}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.detailBody}>
                        {selectedMessage.preview}
                        {'\n\n'}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        {'\n\n'}
                        Best regards,
                        {'\n'}
                        {selectedMessage.sender.split(' ')[0]}
                    </Text>

                    <TouchableOpacity style={styles.replyButton}>
                        <Feather name="corner-up-left" size={18} color="#fff" />
                        <Text style={styles.replyButtonText}>Reply</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        )}
      </Modal>

      {/* FAB for new message */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(teacher_space)/composeMessage')}>
          <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      justifyContent: 'space-between'
  },
  headerLogo: {
      width: 40,
      height: 25,
      tintColor: 'rgba(255,255,255,0.7)',
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      flex: 1,
      textAlign: 'center',
      marginRight: 40, // Balance the logo
  },
  composeButtonHeader: {
      padding: 5,
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
  },
  searchIcon: {
      marginRight: 10,
  },
  searchInput: {
      flex: 1,
      height: '100%',
      color: COLORS.textDark,
      fontSize: 15,
  },
  bodyContent: {
      flex: 1,
      paddingTop: 15,
  },
  tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 10,
  },
  tabItem: {
      marginRight: 25,
      paddingBottom: 8,
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
  },
  activeTabItem: {
      borderBottomWidth: 3,
      borderBottomColor: COLORS.secondary,
  },
  tabText: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.textLight,
  },
  activeTabText: {
      color: COLORS.primary,
      fontWeight: 'bold',
  },
  badge: {
      backgroundColor: COLORS.red,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 1,
      marginLeft: 6,
      marginBottom: 4,
  },
  badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
  },
  listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100, // Space for FAB and Bottom Nav
  },
  messageCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: 'transparent',
  },
  unreadCard: {
      borderLeftColor: COLORS.secondary,
      backgroundColor: '#FDFDFD',
  },
  cardLeft: {
      marginRight: 15,
      justifyContent: 'flex-start',
      paddingTop: 2,
  },
  avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
  },
  avatarText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
  },
  cardContent: {
      flex: 1,
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
  },
  senderName: {
      fontSize: 15,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  unreadText: {
      color: COLORS.primary,
      fontWeight: 'bold',
  },
  dateText: {
      fontSize: 11,
      color: COLORS.textLight,
  },
  roleText: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 6,
  },
  subjectText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textDark,
      marginBottom: 4,
  },
  previewText: {
      fontSize: 13,
      color: COLORS.textLight,
      lineHeight: 18,
  },
  unreadDot: {
      position: 'absolute',
      right: 15,
      bottom: 15,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.secondary,
  },
  emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
  },
  emptyText: {
      marginTop: 10,
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: '500',
  },
  fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
  },
  
  // Modal Styles
  modalContainer: {
      flex: 1,
      backgroundColor: '#fff',
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.lightGray,
  },
  closeButton: {
      padding: 5,
  },
  modalActions: {
      flexDirection: 'row',
      gap: 15,
  },
  modalActionBtn: {
      padding: 5,
  },
  modalContent: {
      padding: 24,
  },
  detailSubject: {
      fontSize: 22,
      fontWeight: 'bold',
      color: COLORS.textDark,
      marginBottom: 20,
      lineHeight: 30,
  },
  detailSenderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 25,
  },
  detailSenderName: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  detailRole: {
      fontSize: 13,
      fontWeight: '400',
      color: COLORS.textLight,
  },
  detailDate: {
      fontSize: 12,
      color: COLORS.textLight,
      marginTop: 2,
  },
  divider: {
      height: 1,
      backgroundColor: COLORS.lightGray,
      marginBottom: 25,
  },
  detailBody: {
      fontSize: 16,
      color: '#334155',
      lineHeight: 26,
  },
  replyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 40,
  },
  replyButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 15,
      marginLeft: 8,
  }
});
