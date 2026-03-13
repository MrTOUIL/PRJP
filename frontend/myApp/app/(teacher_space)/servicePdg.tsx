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
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

export default function ServicePedagogique() {
  const router = useRouter();
  
  // State for form fields
  const [serviceType, setServiceType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [expectations, setExpectations] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');

  // Mock Service ID
  const serviceID = 'SRV-260226-795';

  const handleRequest = () => {
    // Implement request logic
    console.log('Requesting service...');
  };

  const handleReset = () => {
    setServiceType('');
    setTargetAudience('');
    setDeliveryMode('');
    setExpectations('');
    setDuration('');
    setBudget('');
    setNotes('');
  };

  const renderSectionHeader = (icon: string, title: string, color: string = COLORS.primary) => (
    <View style={styles.sectionHeader}>
      {/* Some icons require different libraries or names based on the screenshot */}
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
              <View style={styles.backIconCircle}>
                <MaterialIcons name="chevron-left" size={24} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ALEMNI</Text>
            </View>
          </View>
          
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.titleContainer}>
            <FontAwesome5 name="clipboard-list" size={32} color={COLORS.secondary} />
            <Text style={styles.mainTitle}>Pedagogical Service</Text>
            <Text style={styles.subTitle}>
              Define the educational service details you require
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
          
          {/* Service Information */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            {renderSectionHeader('info-circle', 'Service Information')}
            <View style={styles.infoBox}>
               <FontAwesome5 name="lightbulb" size={16} color="#666" style={{marginTop: 2}} />
               <Text style={styles.infoText}>
                 Please provide the details of the service you are requesting.
               </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service ID <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputContainer, styles.readOnlyInput]}>
                <FontAwesome5 name="hashtag" size={16} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.inputText}>{serviceID}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Type of Request */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <View style={styles.divider} />
            <View style={styles.sectionHeader}>
               <FontAwesome5 name="list-ul" size={18} color={COLORS.secondary} style={{ marginRight: 10 }} />
               <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Type of Request</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Type <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="chalkboard-teacher" size={16} color={COLORS.primary} />
                <Text style={serviceType ? styles.inputText : styles.placeholderText}>
                  {serviceType || 'Select a service type'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Audience <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="users" size={16} color={COLORS.primary} />
                <Text style={targetAudience ? styles.inputText : styles.placeholderText}>
                  {targetAudience || 'Who is this for?'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mode of Delivery <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="home" size={16} color={COLORS.primary} />
                <Text style={deliveryMode ? styles.inputText : styles.placeholderText}>
                  {deliveryMode || 'Select mode'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Methodology & Expectations */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <View style={styles.divider} />
            <View style={styles.sectionHeader}>
               <Ionicons name="radio-button-on" size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
               <View>
                 <Text style={[styles.sectionTitle, { color: COLORS.primary, fontSize: 16 }]}>Methodology &</Text>
                 <Text style={[styles.sectionTitle, { color: COLORS.primary, fontSize: 16 }]}>Expectations</Text>
               </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specific Expectations <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="What are your specific expectations for this service? (e.g. Regular progress reports, specific teaching materials...)"
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={expectations}
                  onChangeText={setExpectations}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Proposed Duration / Timeline <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity style={styles.inputContainer}>
                <FontAwesome5 name="clock" size={16} color={COLORS.primary} />
                <Text style={duration ? styles.inputText : styles.placeholderText}>
                  {duration || 'e.g. 3 months, 10 sessions, ongoing...'}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Service Cost */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <View style={styles.divider} />
            {renderSectionHeader('coins', 'Service Cost')}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Proposed Budget (Total or Hourly) <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="euro-sign" size={16} color={COLORS.textLight} />
                <TextInput
                  style={[styles.input, { marginLeft: 10 }]}
                  placeholder="Ex: 50"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
              </View>
            </View>
          </Animated.View>

          {/* Additional Comments */}
          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <View style={styles.divider} />
            {renderSectionHeader('comment-dots', 'Additional Comments')}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Any other details relevant to the service request..."
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
            <TouchableOpacity style={styles.submitButton} onPress={handleRequest}>
              <FontAwesome5 name="paper-plane" size={16} color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={styles.submitButtonText}>Request Service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <FontAwesome5 name="lock" size={12} color={COLORS.textLight} />
              <Text style={styles.securityText}>Your service request is private and secure.</Text>
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
  backIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
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
    paddingTop: 12, // Ensure text starts a bit lower in the multiline input
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
    marginBottom: 20,
  },
  securityText: {
    color: COLORS.textLight,
    fontSize: 12,
    marginLeft: 5,
  },
});
