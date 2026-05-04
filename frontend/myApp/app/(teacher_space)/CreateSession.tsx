import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';


const COLORS = {
  primary: '#2E2D75',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#8E8E93',
  border: '#E1E1E1',
  button: '#1A1A5E',
};

export default function CreateSession() {
  const router = useRouter();
  const { serviceid } = useLocalSearchParams();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('pending');
  const statusOptions = ['confirmed', 'pending', 'cancelled'];
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Shared values for animations
  const spinnerRotate = useSharedValue(0);

  useEffect(() => {
    // Spinner rotation
    spinnerRotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, []);

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinnerRotate.value}deg` }],
    };
  });

  



  const handleSubmit = async (): Promise<void> => {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    setMsg(""); setLoading(true);

    fetch(`${BASE_URL}/teacher/create_session`, {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` },
      body: JSON.stringify({
        serviceid,
        Date: date,
        start_time: startTime,
        end_time: endTime,
        location,
        status,
      })
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false); setMsg("");
      if (data.succ) {
        router.push("/(teacher_space)/teacherSpace") ; 
      } else if (data.error === "Token expired!") {
        fetch(`${BASE_URL}/teacher/refresh`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.accessToken) {
            SecureStore.setItemAsync("accessToken", data.accessToken);
            fetch(`${BASE_URL}/teacher/create_session`, {
              method: "POST",
              headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` },
              body: JSON.stringify({
                serviceid,
                Date: date,
                start_time: startTime,
                end_time: endTime,
                location,
                status,
              })
            })
            .then(res => res.json())
            .then(data => {
              if (data.succ) {
                router.push("/(teacher_space)/teacherSpace")
              } else if (data.error === "Invalid token!" || data.error === "No token found!") {
                router.replace("/sign_in");
              } else {
                setLoading(false);
                setMsg(typeof data.error === 'string' ? data.error : 'Could not create session.');
              }
            });
          } else {
            router.replace("/sign_in");
          }
        });
      } else if (data.error === "Invalid token!" || data.error === "No token found!") {
        router.replace("/sign_in");
      } else {
        setMsg(typeof data.error === 'string' ? data.error : 'Could not create session.');
      }
    });
  } catch (e) {
    console.error(e);
    router.replace("/sign_in");
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Session</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              placeholder="please respect the form:DD/MM/YYYY"
              placeholderTextColor={COLORS.textLight}
              onChangeText={(text: string) => setDate(text)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Start Time</Text>
            <TextInput
              style={styles.input}
              value={startTime}
              placeholder="HH:MM"
              placeholderTextColor={COLORS.textLight}
              onChangeText={(text: string) => setStartTime(text)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>End Time</Text>
            <TextInput
              style={styles.input}
              value={endTime}
              placeholder="HH:MM"
              placeholderTextColor={COLORS.textLight}
              onChangeText={(text: string) => setEndTime(text)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              placeholder="e.g. Online / Classroom 12"
              placeholderTextColor={COLORS.textLight}
              onChangeText={(text: string) => setLocation(text)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusOption,
                    status === option && styles.statusOptionActive,
                  ]}
                  onPress={() => setStatus(option)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === option && styles.statusTextActive,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          

          {/* Message Section */}
          <Animated.View entering={FadeInDown.duration(400).springify()}>
            <Text style={styles.messageText}>{msg}</Text>
          </Animated.View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            
            <Text style={styles.submitText}>Save Session </Text>
          </TouchableOpacity>

          {/* Loading Spinner */}
          {loading && (
            <Animated.View
              entering={FadeInDown.duration(300).springify()}
              style={[styles.spinner, animatedSpinnerStyle]}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    height: Platform.OS === 'android' ? 110 : 95,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff22',
    marginBottom: 15,
  },
  backBtn: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  infoText: {
    color: COLORS.textLight,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F4F6FA',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 16,
  },
  disabledNote: {
    marginTop: 8,
    marginBottom: 18,
  },
  disabledText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#1A1A5E',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusText: {
    color: COLORS.text,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#FFF',
  },
  messageText: {
    color: '#FFD700',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#FFD700',
    borderTopColor: 'transparent',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
