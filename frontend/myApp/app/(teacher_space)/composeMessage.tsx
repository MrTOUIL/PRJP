import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, Feather } from '@expo/vector-icons';
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

export default function ComposeMessage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!recipient || !subject || !message) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
    }
    // Simulate sending
    Alert.alert('Success', 'Message sent successfully!', [
        { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Message</Text>
            <View style={{width: 28}} /> 
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bodyContent}
      >
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.formCard}>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>To</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Recipient Name"
                        placeholderTextColor={COLORS.gray}
                        value={recipient}
                        onChangeText={setRecipient}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What is this regarding?"
                        placeholderTextColor={COLORS.gray}
                        value={subject}
                        onChangeText={setSubject}
                    />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Type your message here..."
                        placeholderTextColor={COLORS.gray}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Feather name="send" size={20} color="#fff" style={{marginRight: 10}} />
                    <Text style={styles.sendButtonText}>Send Message</Text>
                </TouchableOpacity>

            </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    zIndex: 10,
  },
  headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
  },
  backButton: {
      padding: 0,
  },
  bodyContent: {
      flex: 1,
      padding: 20,
  },
  formCard: {
      flex: 1,
      backgroundColor: COLORS.cardBg,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
      marginBottom: 20,
  },
  inputGroup: {
      marginBottom: 20,
  },
  label: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textDark,
      marginBottom: 8,
  },
  input: {
      backgroundColor: COLORS.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: COLORS.textDark,
      borderWidth: 1,
      borderColor: COLORS.lightGray,
  },
  textArea: {
      flex: 1,
      minHeight: 150,
      textAlignVertical: 'top',
  },
  sendButton: {
      backgroundColor: COLORS.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      marginTop: 10,
  },
  sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  },
});
