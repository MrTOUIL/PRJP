import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const REQUEST_TABS = ['All', 'Accepted', 'Pending', 'Rejected'];

const REQUESTS = [
  {
    id: 1,
    tutorName: 'Sara Belhadj',
    subject: 'Physics · Terminale S',
    status: 'Accepted',
    price: '800 DZD',
    service: 'Advanced Mathematics',
    date: 'Feb 26',
    time: '16:00 - 18:00',
    avatarColor: '#4CAF50',
    initial: 'S'
  },
  {
    id: 2,
    tutorName: 'M. Rahmani',
    subject: 'Online · Terminal S',
    status: 'Pending',
    price: '650 DZD',
    service: 'English Conversation',
    date: 'Feb 28',
    time: '14:00',
    avatarColor: '#FFC107',
    initial: 'M'
  },
  {
    id: 3,
    tutorName: 'Laila Mansouri',
    subject: 'French · 1AS',
    status: 'Rejected',
    price: '700 DZD',
    service: 'General Chemistry',
    date: 'Mar 01',
    time: '10:00 - 12:00',
    avatarColor: '#F44336',
    initial: 'L'
  },
   {
    id: 4,
    tutorName: 'Karim Z.',
    subject: 'Math · 2AS',
    status: 'Accepted',
    price: '900 DZD',
    service: 'Algebra II',
    date: 'Mar 05',
    time: '09:00 - 11:00',
    avatarColor: '#2196F3',
    initial: 'K'
  },
];

export default function StudentRequests() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredRequests = activeTab === 'All' 
    ? REQUESTS 
    : REQUESTS.filter(r => r.status === activeTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.headerTop}>
             <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="chevron-back" size={24} color="#fff" />
             </TouchableOpacity>
             <Text style={styles.headerTitle}>My Requests</Text>
             <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="search" size={24} color="#fff" />
             </TouchableOpacity>
        </View>
        
        {/* Tabs inside Header for integration */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {REQUEST_TABS.map((tab, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab} 
                    {/* Count badge logic could go here */}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.requestsList}>
          {filteredRequests.map((req, index) => (
            <Animated.View 
                key={req.id} 
                entering={FadeInUp.delay(200 + (index * 100)).duration(500)}
                layout={Layout.springify()}
            >
                <RequestCard req={req} />
            </Animated.View>
          ))}
          
           {filteredRequests.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="documents-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyStateText}>No requests found</Text>
                </View>
           )}
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>
      
        {/* Floating Action Button for New Request */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.fabContainer}>
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </Animated.View>

    </View>
  );
}

function RequestCard({ req }: { req: any }) {
  const statusConfig: any = {
    'Accepted': { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle' },
    'Pending': { bg: '#FEF9C3', text: '#A16207', icon: 'time' }, // Gold theme for Pending
    'Rejected': { bg: '#FFEBEE', text: '#C62828', icon: 'close-circle' },
  };
  
  const config = statusConfig[req.status];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: req.avatarColor }]}>
                <Text style={styles.avatarText}>{req.initial}</Text>
            </View>
            <View>
                <Text style={styles.tutorName}>{req.tutorName}</Text>
                <Text style={styles.subjectText}>{req.subject}</Text>
            </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
           <Ionicons name={config.icon} size={12} color={config.text} style={{marginRight: 4}}/>
           <Text style={[styles.statusText, { color: config.text }]}>{req.status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <Text style={styles.serviceTitle}>{req.service}</Text>
        <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{req.date}</Text>
            </View>
            <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{req.time}</Text>
            </View>
            <View style={styles.metaItem}>
                <Ionicons name="wallet-outline" size={16} color="#666" />
                <Text style={styles.metaText}>{req.price}</Text>
            </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        {req.status === 'Accepted' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                <Text style={styles.primaryButtonText}>View Details</Text>
            </TouchableOpacity>
        )}
         {req.status === 'Pending' && (
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
        )}
         {req.status === 'Rejected' && (
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Text style={styles.secondaryButtonText}>Delete</Text>
            </TouchableOpacity>
        )}
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E1B6B', // Deep Blue
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  iconButton: {
      padding: 4,
  },
  tabsContainer: {
    paddingHorizontal: 0,
  },
  tabsScroll: {
      paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#1E1B6B', // Deep Blue
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
      padding: 20,
      paddingBottom: 100,
  },
  requestsList: {
      gap: 16,
  },
  emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
  },
  emptyStateText: {
      marginTop: 10,
      color: '#94A3B8', // Slate
      fontSize: 16,
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F1F5F9',
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
  },
  userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatar: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  avatarText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
  },
  tutorName: {
      fontWeight: '700',
      fontSize: 16,
      color: '#1E293B', // Dark Slate
  },
  subjectText: {
      fontSize: 12,
      color: '#64748B', // Slate
      marginTop: 2,
  },
  statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
  },
  statusText: {
      fontSize: 11,
      fontWeight: '700',
  },
  divider: {
      height: 1,
      backgroundColor: '#F1F5F9',
      marginVertical: 12,
  },
  cardBody: {
      marginBottom: 16,
  },
  serviceTitle: {
      fontWeight: '700',
      fontSize: 15,
      color: '#1E293B', // Dark Slate
      marginBottom: 8,
  },
  metaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  metaText: {
      fontSize: 12,
      color: '#64748B', // Slate
      marginLeft: 6,
      fontWeight: '500',
  },
  cardFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingTop: 4,
  },
  actionButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      minWidth: 100,
      alignItems: 'center',
  },
  primaryButton: {
      backgroundColor: '#1E1B6B', // Deep Blue
      shadowColor: '#1E1B6B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
  },
  primaryButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 13,
  },
  secondaryButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#CBD5E1',
  },
  secondaryButtonText: {
      color: '#64748B', // Slate
      fontWeight: '600',
      fontSize: 13,
  },
  fabContainer: {
      position: 'absolute',
      bottom: 100, // Above the tab bar spacing
      right: 20,
  },
  fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FFD700', // Gold
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
  }
});
