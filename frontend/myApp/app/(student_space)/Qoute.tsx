import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2E2D75', // Dark purple from the screenshot header
  secondary: '#FFD700', // Gold/Yellow icon color
  background: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#8E8E93',
  inputBg: '#F8F9FA',
  borderColor: '#E1E1E1',
  success: '#00C853',
  white: '#FFFFFF',
};

export default function DevisPedagogique() {
  const router = useRouter();
  
  // State for form fields
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [objective, setObjective] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');

  // Mock Quote ID
  const quoteID = 'QT-260226-918';

  const handleSend = () => {
    // Implement send logic
    console.log('Sending quote...');
  };

  const handleReset = () => {
    setSubject('');
    setLevel('');
    setObjective('');
    setFrequency('');
    setDuration('');
    setBudget('');
    setNotes('');
  };

  const renderSectionHeader = (icon: string, title: string, color: string = COLORS.primary) => (
    <View style={styles.sectionHeader}>
      <FontAwesome5 name={icon} size={18} color={COLORS.secondary} style={{ marginRight: 10 }} />
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="chevron-left" size={28} color={COLORS.white} />
              <Text style={styles.backText}>Back to selection</Text>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ALEMNI</Text>
            </View>
          </View>
          
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.titleContainer}>
            <FontAwesome5 name="file-invoice" size={32} color={COLORS.secondary} />
            <Text style={styles.mainTitle}>Educational Quote</Text>
            <Text style={styles.subTitle}>
              Create your personalized quote for your private lesson
            </Text>
          </Animated.View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Quote Information */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            {renderSectionHeader('info-circle', 'Quote Information')}
            <View style={styles.infoBox}>
               <FontAwesome5 name="lightbulb" size={16} color="#666" style={{marginTop: 2}} />
               <Text style={styles.infoText}>
                 Fill in all fields to generate a complete and detailed quote.
               </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quote ID <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputContainer, styles.readOnlyInput]}>
                <MaterialIcons name="qr-code" size={20} color={COLORS.textLight} />
                <Text style={styles.inputText}>{quoteID}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Educational Details */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <View style={styles.divider} />
            {renderSectionHeader('book', 'Educational Details')}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="graduation-cap" size={18} color={COLORS.primary} />
                <Text style={subject ? styles.inputText : styles.placeholderText}>
                  {subject || 'Select a subject'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>School Level <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <Ionicons name="school" size={20} color={COLORS.primary} />
                <Text style={level ? styles.inputText : styles.placeholderText}>
                  {level || 'Select a level'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Objectives and Planning */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <View style={styles.divider} />
            <Text style={styles.sectionHeading}>Objectives and Planning</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Learning Objective <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe your objectives (e.g., Improve understanding of equations, prepare for an exam...)"
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={objective}
                  onChangeText={setObjective}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Desired Frequency <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="calendar-alt" size={18} color={COLORS.primary} />
                <Text style={frequency ? styles.inputText : styles.placeholderText}>
                  {frequency || 'Select a frequency'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estimated Session Duration <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="hourglass-half" size={18} color={COLORS.primary} />
                <Text style={duration ? styles.inputText : styles.placeholderText}>
                  {duration || 'Select a duration'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Estimated Budget */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <View style={styles.divider} />
            {renderSectionHeader('money-bill-wave', 'Estimated Budget')}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget per Session <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="euro-sign" size={18} color={COLORS.textLight} />
                <TextInput
                  style={[styles.input, { marginLeft: 10 }]}
                  placeholder="Ex: 30"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
              </View>
            </View>
          </Animated.View>

          {/* Additional Notes */}
          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <View style={styles.divider} />
            {renderSectionHeader('sticky-note', 'Additional Notes')}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Extra Information</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Add any extra details if necessary..."
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSend}>
              <FontAwesome5 name="paper-plane" size={16} color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={styles.submitButtonText}>Send Quote</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <MaterialIcons name="security" size={14} color={COLORS.textLight} />
              <Text style={styles.securityText}>Your information is confidential and secure</Text>
            </View>
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
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 5,
  },
  logoContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleContainer: {
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 10,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    marginTop: 5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textLight,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  chevron: {
    marginLeft: 'auto',
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 15,
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    textAlignVertical: 'top',
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
    marginBottom: 25,
  },
  footer: {
    marginTop: 10,
    gap: 15,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 28,
  },
  resetButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  securityText: {
    color: COLORS.textLight,
    fontSize: 12,
    marginLeft: 5,
  },
});
