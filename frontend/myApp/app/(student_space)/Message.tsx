import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';

const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  inputBg: '#E8ECF4',
};

export default function Message() {
  const router = useRouter();
  const params = useLocalSearchParams() as any;
  const { sender, senderId, senderRole, subject, initialMessage, avatarColor } = params;
  const [replyText, setReplyText] = useState('');

  const handleSend = async () => {
    const text = (replyText || '').trim();
    if (!text) return Alert.alert('Empty message', 'Please type a message before sending.');

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const role = await getStudentOrParentRole();

      const isReplyToTeacher = senderRole === 'teacher' || senderRole === 'teachers';
      const endpoint = isReplyToTeacher && role === 'student'
        ? `${BASE_URL}/${role}/sendmessage2`
        : `${BASE_URL}/${role}/sendmessage`;

      const bodyPayload = isReplyToTeacher && role === 'student'
        ? { msg: text, reciever: senderId }
        : { msg: text, receiverId: senderId };

      const doSend = async (token: string | null) => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
          body: JSON.stringify(bodyPayload),
        });
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) return await res.json();
        return { raw: await res.text() };
      };

      let data = await doSend(accessToken);
      if (data?.error === 'Token expired!') {
        const refreshRes = await fetch(`${BASE_URL}/${role}/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const refreshData = await refreshRes.json();
        if (refreshData?.accessToken) {
          await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
          data = await doSend(refreshData.accessToken);
        } else {
          router.replace('/sign_in');
          return;
        }
      }

      if (data?.succ) {
        Alert.alert('Sent', 'Message sent successfully');
        router.back();
      } else if (data?.raw) {
        Alert.alert('Server response', String(data.raw).substring(0, 1000));
      } else if (data?.error) {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Error', 'Unable to send message');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Unable to send message');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.originalMessageCard}>
          <View style={styles.senderRow}>
            <View style={[styles.avatar, { backgroundColor: (avatarColor as string) || '#2962FF' }]}>
              <Text style={styles.avatarText}>{sender ? (sender as string).charAt(0) : '?'}</Text>
            </View>
            <View>
              <Text style={styles.senderName}>{sender}</Text>
              <Text style={styles.subjectText}>{subject}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.messageBody}>{initialMessage}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.replyContainer}>
          <Text style={styles.label}>Your Reply</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <MaterialCommunityIcons name="send" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  scrollContent: { padding: 20 },
  originalMessageCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 20, marginBottom: 25 },
  senderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  senderName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark },
  subjectText: { fontSize: 13, color: COLORS.textLight },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 15 },
  messageBody: { fontSize: 15, color: '#444', lineHeight: 22 },
  replyContainer: { flex: 1 },
  label: { fontSize: 16, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10, marginLeft: 4 },
  textInput: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 15, height: 200, fontSize: 16, color: COLORS.textDark, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20 },
  sendButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 30 },
  sendButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
