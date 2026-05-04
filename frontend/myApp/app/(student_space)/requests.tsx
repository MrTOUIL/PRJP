import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';
const { width } = Dimensions.get('window');

const REQUEST_TABS = ['All', 'Accepted', 'Pending', 'Rejected'];

type StudentRequestsProps = {
  onSelectFilter?: (filter: string) => void;
};

export default function StudentRequests({ onSelectFilter }: StudentRequestsProps) {
  const [activeTab, setActiveTab] = useState('All');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const normalizeStatus = (status?: string) => (status || 'pending').toLowerCase();
  const capitalizeStatus = (status?: string) => {
    const normalized = normalizeStatus(status);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const fetchRequests = async (token: string | null | undefined, apiRole: 'student' | 'parent') => {
    try {
      const res = await fetch(`${BASE_URL}/${apiRole}/myRequests`, {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('fetchRequests error', err);
      return { error: 'fetch_error' };
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) {
      Alert.alert('Error', 'Missing request id.');
      return;
    }

    try {
      setCancellingId(requestId);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const apiRole = await getStudentOrParentRole();

      const sendCancel = async (token: string | null | undefined) => {
        return fetch(`${BASE_URL}/${apiRole}/cancelRequest/${requestId}`, {
          method: 'PUT',
          headers: { authorization: `Bearer ${token}` },
        });
      };

      let response = await sendCancel(accessToken);
      let data = await response.json();

      if (data?.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const refreshData = await refreshResponse.json();

        if (refreshData.accessToken) {
          await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
          response = await sendCancel(refreshData.accessToken);
          data = await response.json();
        } else {
          Alert.alert('Session expired', 'Please sign in again.');
          router.replace('/sign_in');
          return;
        }
      }

      if (data?.succ) {
        setRequests(prev => prev.map(request => (
          request.backendId === requestId
            ? { ...request, status: 'cancelled' }
            : request
        )));
        Alert.alert('Success', 'Request cancelled successfully.');
      } else {
        Alert.alert('Error', data?.error || 'Failed to cancel request.');
      }
    } catch (error) {
      console.error('handleCancelRequest error', error);
      Alert.alert('Error', 'Something went wrong while cancelling the request.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!requestId) {
      Alert.alert('Error', 'Missing request id.');
      return;
    }

    try {
      setDeletingId(requestId);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const apiRole = await getStudentOrParentRole();

      const sendDelete = async (token: string | null | undefined) => {
        return fetch(`${BASE_URL}/${apiRole}/deleteRequest/${requestId}`, {
          method: 'DELETE',
          headers: { authorization: `Bearer ${token}` },
        });
      };

      let response = await sendDelete(accessToken);
      let data = await response.json();

      if (data?.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const refreshData = await refreshResponse.json();

        if (refreshData.accessToken) {
          await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
          response = await sendDelete(refreshData.accessToken);
          data = await response.json();
        } else {
          Alert.alert('Session expired', 'Please sign in again.');
          router.replace('/sign_in');
          return;
        }
      }

      if (data?.succ) {
        setRequests(prev => prev.filter(request => request.backendId !== requestId));
        Alert.alert('Success', 'Request deleted successfully.');
      } else {
        Alert.alert('Error', data?.error || 'Failed to delete request.');
      }
    } catch (error) {
      console.error('handleDeleteRequest error', error);
      Alert.alert('Error', 'Something went wrong while deleting the request.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const apiRole = await getStudentOrParentRole();
        let data = await fetchRequests(accessToken, apiRole);
        if (data?.error === 'Token expired!') {
          const r = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          const newData = await r.json();
          if (newData.accessToken) {
            await SecureStore.setItemAsync('accessToken', newData.accessToken);
            data = await fetchRequests(newData.accessToken, apiRole);
          } else {
            router.replace('/sign_in');
            return;
          }
        }

        if (Array.isArray(data?.requests)) {
          const mapped = data.requests.map((req: any, idx: number) => {
            const tutor = req.res_by || {};
            const tutorName = `${tutor.first_name || ''} ${tutor.last_name || ''}`.trim() || 'Tutor';
            const subject = `${req.matiere || ''} · ${req.niveau || ''}`.trim();
            const status = normalizeStatus(req.status);
            const price = req.price != null ? `${req.price} DZD` : 'N/A';
            const service = req.objectif || req.matiere || 'Request';
            const duration = req.duree || req.frequence || '';
            const initial = tutorName.charAt(0).toUpperCase() || 'T';
            const avatarColor = '#64748B';
            return {
              id: req._id || idx,
              backendId: req._id,
              tutorName,
              subject,
              status,
              price,
              service,
              date: '',
              duration,
              avatarColor,
              initial,
            };
          });
          setRequests(mapped);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error(err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const filteredRequests = activeTab === 'All' 
    ? requests 
    : requests.filter(r => capitalizeStatus(r.status) === activeTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.headerTop}>
             <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={20} color="#fff" />
             </TouchableOpacity>
             <Text style={styles.headerTitle}>My Requests</Text>
        </View>


      </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.requestsList}>
          {filteredRequests.map((req, index) => (
            <Animated.View 
                key={req.id} 
                entering={FadeInUp.delay(200 + (index * 100)).duration(500)}
                layout={Layout.springify()}
            >
                <RequestCard
                  req={req}
                  onCancelRequest={handleCancelRequest}
                  onDeleteRequest={handleDeleteRequest}
                  isCancelling={cancellingId === req.backendId}
                  isDeleting={deletingId === req.backendId}
                />
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

    </View>
  );
}

function RequestCard({
  req,
  onCancelRequest,
  onDeleteRequest,
  isCancelling,
  isDeleting,
}: {
  req: any;
  onCancelRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  isCancelling: boolean;
  isDeleting: boolean;
}) {
  const statusConfig: any = {
    accepted: { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle' },
    pending: { bg: '#FEF9C3', text: '#A16207', icon: 'time' },
    rejected: { bg: '#FFEBEE', text: '#C62828', icon: 'close-circle' },
    cancelled: { bg: '#F3F4F6', text: '#6B7280', icon: 'remove-circle' },
  };
  
  const defaultConfig = { bg: '#F3F4F6', text: '#6B7280', icon: 'help-circle' };
  const requestStatus = (req.status || 'pending').toLowerCase();
  const statusLabel = requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1);
  const config = statusConfig[requestStatus] || defaultConfig;

  const handlePress = () => {
    // Navigation removed - just display the request card details
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
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
             <Text style={[styles.statusText, { color: config.text }]}>{statusLabel}</Text>
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
                <Text style={styles.metaText}>{req.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                  <Ionicons name="wallet-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{req.price}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.cardFooter}>
        {requestStatus === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            activeOpacity={0.7}
            disabled={isCancelling}
            onPress={() => onCancelRequest(req.backendId || req.id)}
          >
            <Ionicons name="close-circle" size={16} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.cancelButtonText}>{isCancelling ? 'Cancelling...' : 'Cancel Request'}</Text>
          </TouchableOpacity>
        )}

        {(requestStatus === 'rejected' || requestStatus === 'cancelled') && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            activeOpacity={0.7}
            disabled={isDeleting}
            onPress={() => {
              onDeleteRequest(req.backendId || req.id);
            }}
          >
            <Ionicons name="trash" size={16} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.deleteButtonText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
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
    paddingTop: 34,
    paddingBottom: 14,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  iconButton: {
      padding: 2,
      position: 'absolute',
      left: 16,
  },

  tabsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  tabsScroll: {
      paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#1E1B6B',
    borderColor: '#1E1B6B',
  },
  tabText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginTop: 6,
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
      position:"relative",
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
      alignItems: 'flex-end',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      position:"absolute",
      right: 0,
      top:-7,
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
      paddingTop: 12,
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#F1F5F9',
      gap: 8,
  },
  actionButton: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
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
  cancelButton: {
      backgroundColor: '#FEE2E2', // Light red background
      borderWidth: 1,
      borderColor: '#FECACA', // Light red border
  },
  cancelButtonText: {
      color: '#DC2626', // Red text
      fontWeight: '600',
      fontSize: 13,
  },
  deleteButton: {
      backgroundColor: '#FEE2E2', // Light red background
      borderWidth: 1,
      borderColor: '#FECACA', // Light red border
  },
  deleteButtonText: {
      color: '#DC2626', // Red text
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

