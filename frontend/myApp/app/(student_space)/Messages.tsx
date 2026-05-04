import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';

const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  unread: '#E3F2FD',
};

const AVATAR_COLORS = ['#2962FF', '#FF6B6B', '#1A1A5E', '#0EA27F', '#9C27B0', '#F59E0B'];

export default function Messages() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      setMessage('');

      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const apiRole = await getStudentOrParentRole();

        const fetchMessages = async (token: string | null | undefined) => {
          const res = await fetch(`${BASE_URL}/${apiRole}/getmessages`, {
            method: 'GET',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          });
          return res.json();
        };

        let data = await fetchMessages(accessToken);

        if (data?.error === 'Token expired!') {
          const refreshRes = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshRes.json();

          if (refreshData?.accessToken) {
            await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
            data = await fetchMessages(refreshData.accessToken);
          } else {
            router.replace('/sign_in');
            return;
          }
        }

        if (data?.succ && Array.isArray(data?.messages)) {
          const mapped = data.messages.map((item: any, index: number) => {
            const rawSender = item?.sender;
            const senderObj = (rawSender && typeof rawSender === 'object') ? rawSender : {};
            const senderName = typeof rawSender === 'string'
              ? 'Unknown Sender'
              : `${senderObj.first_name || ''} ${senderObj.last_name || ''}`.trim() || 'Unknown Sender';

            // infer role: teacher objects include school_levels_taught, parents include parentf/parentl
            let senderRole = 'unknown';
            if (typeof rawSender === 'object' && rawSender) {
              if (Array.isArray(senderObj.school_levels_taught) || senderObj.subject) senderRole = 'teacher';
              else if (senderObj.parentf || senderObj.parentl) senderRole = 'parent';
              else if (senderObj.academic_level || senderObj.role === 'student') senderRole = 'student';
            }

            return {
              id: item?._id || String(index),
              sender: senderName,
              senderId: (typeof rawSender === 'string') ? rawSender : (senderObj?._id || null),
              senderRole,
              subject: item?.subject || '',
              preview: item?.msg || '',
              time: item?.time || '',
              unread: false,
              avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
            };
          });

          setMessages(mapped);
          if (mapped.length === 0) {
            setMessage('No messages yet.');
          }
        } else if (data?.error === 'Invalid token!' || data?.error === 'No token found!') {
          router.replace('/sign_in');
          return;
        } else {
          setMessages([]);
          setMessage('Unable to load messages.');
        }
      } catch (err) {
        console.error(err);
        setMessages([]);
        setMessage('Unable to load messages.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [router]);

  const filteredMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((item) =>
      String(item.sender || '').toLowerCase().includes(q) ||
      String(item.subject || '').toLowerCase().includes(q) ||
      String(item.preview || '').toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity 
          style={[styles.messageCard, item.unread && styles.unreadCard]}
          onPress={() => router.push({
            pathname: '/(student_space)/Message',
            params: {
              sender: item.sender,
              senderId: item.senderId,
              senderRole: item.senderRole,
              subject: item.subject,
              initialMessage: item.preview,
              avatarColor: item.avatarColor
            }
          })}
        >
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
            <Text style={styles.avatarText}>{(item.sender || 'U').charAt(0)}</Text>
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

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : message ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>{message}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '500',
    textAlign: 'center',
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
