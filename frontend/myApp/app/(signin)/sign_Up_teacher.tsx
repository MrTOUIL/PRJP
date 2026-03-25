
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Platform,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';


const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1E1B6B', // Deep Blue
  primarySoft: '#4B57B6',
  background: '#EEF2FF',
  card: '#FFFFFF',
  mutedText: '#74819A',
  text: '#0F172A',
  border: '#E6ECF7',
  inputBg: '#F5F7FF',
  danger: '#E11D48',
  link: '#1E40AF',
  pillTitle: '#FFD700',
  pillSelected: '#E0E7FF',
  pillTextSelected: '#1E1B6B',
};

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.fieldLabel}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );
}

function InputRow({
  icon,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
  numberOfLines,
  style,
  value,
  onChangeText,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  placeholder: string;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={[styles.inputWrapper, style, multiline && { height: 80, alignItems: 'flex-start' }]}>
      <View style={[styles.inputIconWrap, multiline && { marginTop: 12 }]}>
        <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} />
      </View>
      <TextInput
        style={[styles.input, multiline && { textAlignVertical: 'top', paddingTop: 10 }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mutedText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function SectionHeader({
  icon,
  iconColor,
  title,
  subtitle,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: `${iconColor}1A` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default function SignUpTeacher() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const spinnerRotate = useSharedValue(0);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [homeVisitsEnabled, setHomeVisitsEnabled] = useState(false);
  const [bio, setBio] = useState('');

  const toggleLevel = (level: string) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  spinnerRotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);

  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinnerRotate.value}deg` }],
  }));

  const levels = ['Primary', 'Middle', 'High School', 'University'];
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const subjects = ['math', 'physics', 'science', 'arab', 'history/goe', 'islamic', 'francais', 'english'];
  const modes = ['presential', 'online', 'hybrid'];

  const handleRegister = ():void => {
     setLoading(true) ; setMsg("") ; 
     fetch("https://localhost:5000/logs/register_teacher",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        first_name:firstName , 
        last_name:lastName , 
        email , 
        phone , 
        postal_adress:postalAddress , 
        password , 
        subject , 
        school_levels_taught : selectedLevels , 
        mode ,
        available_days : selectedDays , 
        start_time : startTime , 
        end_time : endTime , 
        home_visits : homeVisitsEnabled , 
        bio 
      })
     })
     .then(res => res.json())
     .then(data => {
      setLoading(false) ;
      if (data.error){
        setMsg("Error in registration")
      }else if (data.message){
        setMsg(data.message) ;
      }else{
        router.push({
          pathname:"/VerifyCodereg",
          params:{email}
        }) ; 
      }
     })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        entering={FadeInDown.duration(600).springify()}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.backRow}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#E8ECFF" />
            <Text style={styles.backText}>Back to role selection</Text>
          </TouchableOpacity>

          <Animated.View 
            entering={FadeInDown.delay(100).duration(600)} 
            style={styles.headerTextBlock}
          >
            <Text style={styles.headerTitle}>Teacher Profile</Text>
            <Text style={styles.headerSubtitle}>Complete your details to get started</Text>
          </Animated.View>

          {/* Decorative wave */}
          <View style={styles.headerWave} />
        </View>

        {/* Role card */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.roleCard}>
          <View style={styles.roleIconBadge}>
             <MaterialCommunityIcons name="human-male-board" size={24} color="#FFD700" />
          </View>
          <View style={styles.roleText}>
            <Text style={styles.roleTitle}>Teacher / Enseignant</Text>
            <Text style={styles.roleSubtitle}>Academic & professional information</Text>
          </View>
        </Animated.View>

         <Animated.Text entering={FadeInDown.delay(250).duration(600)} style={styles.requiredHint}>
          <Text style={styles.required}>*</Text> Required fields
        </Animated.Text>

        {/* 1. Personal Information Card */}
        <Animated.View entering={FadeInDown.delay(300).springify().damping(20)} style={styles.card}>
          <SectionHeader
            icon="account"
            iconColor="#1D4ED8"
            title="Personal Information"
            subtitle="Your basic identity details"
          />

          <View style={styles.fieldGroup}>
            <View style={styles.row}>
              <View style={styles.col}>
                <FieldLabel label="First Name" required />
                <InputRow
                  icon="pencil"
                  placeholder="First name"
                  value={firstName}
                  onChangeText={(text: string) => setFirstName(text)}
                />
              </View>
              <View style={styles.col}>
                <FieldLabel label="Last Name" required />
                <InputRow
                  icon="pencil"
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={(text: string) => setLastName(text)}
                />
              </View>
            </View>

            <View>
                <FieldLabel label="Email Address" required />
                <InputRow
                  icon="email-outline"
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text: string) => setEmail(text)}
                />
            </View>

            <View>
                <FieldLabel label="Phone Number" required />
                <InputRow
                  icon="cellphone"
                  placeholder="+213 5XX XXX XXX"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text: string) => setPhone(text)}
                />
            </View>

            <View>
                <FieldLabel label="Password" required />
                <InputRow
                  icon="lock-outline"
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={(text: string) => setPassword(text)}
                />
            </View>

            <View>
                <FieldLabel label="Postal Address" />
                <InputRow
                  icon="map-marker-outline"
                  placeholder="City, Wilaya"
                  value={postalAddress}
                  onChangeText={(text: string) => setPostalAddress(text)}
                />
            </View>
          </View>
        </Animated.View>

        {/* 2. Academic Expertise */}
        <Animated.View entering={FadeInDown.delay(400).springify().damping(20)} style={styles.card}>
            <SectionHeader
                icon="school"
                iconColor="#16A34A" // Greenish for academic
                title="Academic Expertise"
                subtitle="Subject and teaching levels"
            />

            <View style={styles.fieldGroup}>
                <View>
                    <FieldLabel label="Domain of Expertise" required />
                    <View style={styles.pillsContainer}>
                        {subjects.map((subj) => (
                            <TouchableOpacity
                                key={subj}
                                onPress={() => setSubject(subj)}
                                style={[
                                    styles.pill,
                                    subject === subj && styles.pillActive
                                ]}
                            >
                                <Text style={[
                                    styles.pillText,
                                    subject === subj && styles.pillTextActive
                                ]}>{subj}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                    <FieldLabel label="School Levels Taught" required />
                    <View style={styles.pillsContainer}>
                        {levels.map((level) => (
                            <TouchableOpacity
                                key={level}
                                onPress={() => toggleLevel(level)}
                                style={[
                                    styles.pill,
                                    selectedLevels.includes(level) && styles.pillActive
                                ]}
                            >
                                <Text style={[
                                    styles.pillText,
                                    selectedLevels.includes(level) && styles.pillTextActive
                                ]}>{level}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                    <FieldLabel label="Mode of Teaching" required />
                    <View style={styles.pillsContainer}>
                        {modes.map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => setMode(m)}
                                style={[
                                    styles.pill,
                                    mode === m && styles.pillActive
                                ]}
                            >
                                <Text style={[
                                    styles.pillText,
                                    mode === m && styles.pillTextActive
                                ]}>{m}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Animated.View>




        {/* 4. Availability */}
        <Animated.View entering={FadeInDown.delay(600).springify().damping(20)} style={styles.card}>
            <SectionHeader
                icon="calendar-clock"
                iconColor="#E11D48"
                title="Availability"
                subtitle="Days and time slots you're free"
            />

             <View style={styles.fieldGroup}>
                <View>
                    <FieldLabel label="Available Days" required />
                    <View style={styles.pillsContainer}>
                        {days.map((day) => (
                            <TouchableOpacity
                                key={day}
                                onPress={() => toggleDay(day)}
                                style={[
                                    styles.dayPill,
                                    selectedDays.includes(day) && styles.dayPillActive
                                ]}
                            >
                                <Text style={[
                                    styles.dayPillText,
                                    selectedDays.includes(day) && styles.dayPillTextActive
                                ]}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <FieldLabel label="From" />
                        <InputRow
                            icon="clock-start"
                            placeholder="--:-- --"
                            value={startTime}
                            onChangeText={(text: string) => setStartTime(text)}
                        />
                    </View>
                    <View style={styles.col}>
                        <FieldLabel label="To" />
                        <InputRow
                            icon="clock-end"
                            placeholder="--:-- --"
                            value={endTime}
                            onChangeText={(text: string) => setEndTime(text)}
                        />
                    </View>
                </View>
             </View>
        </Animated.View>

        {/* 5. Extra Options */}
        <Animated.View entering={FadeInDown.delay(700).springify().damping(20)} style={styles.card}>
            <SectionHeader
                icon="cog-outline"
                iconColor="#64748B"
                title="Extra Options"
                subtitle="Preferences & bio"
            />

            <View style={styles.fieldGroup}>
                <View style={styles.switchRow}>
                    <View style={{flex: 1, paddingRight: 10}}>
                        <Text style={styles.switchTitle}>Home visits available</Text>
                        <Text style={styles.switchSubtitle}>I can travel to student's location</Text>
                    </View>
                    <Switch
                        value={homeVisitsEnabled}
                        onValueChange={(value: boolean) => setHomeVisitsEnabled(value)}
                        trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                        thumbColor={'#FFFFFF'}
                    />
                </View>

                <View>
                    <FieldLabel label="Short Bio / Pedagogical Description" />
                    <InputRow 
                        icon="pencil-outline" 
                        placeholder="Briefly describe your teaching approach and experience..." 
                        multiline={true}
                        numberOfLines={3}
                        value={bio}
                        onChangeText={(text: string) => setBio(text)}
                    />
                </View>
            </View>
        </Animated.View>

        {/* Submit Button & Footer */}
        <Animated.View entering={FadeInDown.delay(800).springify().damping(20)}>
            <TouchableOpacity activeOpacity={0.8} style={styles.submitButton} onPress={handleRegister}>
                <Text style={styles.submitButtonText}>Complete Registration →</Text>
            </TouchableOpacity>

            {/* message */}
            <Animated.View entering={FadeInDown.duration(400).springify()}>
              <Text style={styles.messageText}>{msg}</Text>
            </Animated.View>

            {/* spinner */}
            {loading && (
              <Animated.View style={[styles.spinner, animatedSpinnerStyle]} />
            )}

            <TouchableOpacity onPress={() => router.push('/signin')} style={styles.loginLink}>
                <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
                </Text>
            </TouchableOpacity>
        </Animated.View>
        
        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 5,
  },
  headerWave: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#E8ECFF',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  headerTextBlock: {
    marginBottom: 10,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8ECFF',
    opacity: 0.9,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B57B6', // Lighter blue to match header theme
    marginHorizontal: 20,
    marginTop: -35, // Overlapping header slightly
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  roleIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  roleText: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFD700', // Gold color for Teacher title
    marginBottom: 2,
  },
  roleSubtitle: {
    fontSize: 13,
    color: '#E8ECFF',
  },
  requiredHint: {
    fontSize: 12,
    color: COLORS.danger,
    marginHorizontal: 24,
    marginBottom: 12,
    fontWeight: '500',
  },
  required: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  fieldGroup: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIconWrap: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    padding: 12,
    borderRadius: 12,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.pillSelected,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  pillTextActive: {
    color: COLORS.pillTextSelected,
    fontWeight: '700',
  },
  dayPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayPillActive: {
     backgroundColor: COLORS.pillSelected,
    borderColor: COLORS.primary,
  },
  dayPillText: {
     fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dayPillTextActive: {
     color: COLORS.pillTextSelected,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    padding: 10,
  },
  messageText: {
    textAlign: 'center',
    color: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
    alignSelf: 'center',
    marginBottom: 12,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#64748B',
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },

});
