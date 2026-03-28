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
  Modal,
  FlatList,
  TouchableWithoutFeedback,
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

const SERVICE_TYPES = [
  'Private Tutoring', 
  'Group Classes', 
  'Exam Preparation (BEM/BAC)', 
  'Language Course', 
  'Homework Assistance', 
  'Special Needs Support', 
  'Skills Workshop',
  'Academic Orientations'
];

const TARGET_AUDIENCES = [
  'Primary School', 
  'Middle School (CEM)', 
  'High School (Lycée)', 
  'University', 
  'Adults', 
  'Professionals'
];

const DELIVERY_MODES = [
  'Online', 
  'In-Person (Home)', 
  'In-Person (Center)', 
  'Hybrid'
];

const DURATIONS = [
  'Single Session', 
  'Weekly', 
  'Monthly', 
  'Quarterly', 
  'School Year', 
  'Custom'
];

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
  const [resources, setResources] = useState<{name: string, type: string}[]>([]);

  // Mock Service ID
  const serviceID = 'SRV-260226-795';

  // Selection Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionTitle, setSelectionTitle] = useState('');
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [onSelect, setOnSelect] = useState<(val: string) => void>(() => {});

  const openSelection = (title: string, options: string[], callback: (val: string) => void) => {
    setSelectionTitle(title);
    setCurrentOptions(options);
    setOnSelect(() => callback);
    setModalVisible(true);
  };

  const handleOptionSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
  };

  const handleAddResource = () => {
    router.push('/(teacher_space)/teacherResources');
  };

  const handleRemoveResource = (index: number) => {
    const newList = [...resources];
    newList.splice(index, 1);
    setResources(newList);
  };

  const handleRequest = () => {
    // Implement request logic
    console.log('Requesting service...', { 
      serviceType, 
      targetAudience, 
      deliveryMode, 
      expectations, 
      duration, 
      budget, 
      notes,
      resources: resources || [] 
    });
  };

  const handleReset = () => {
    setServiceType('');
    setTargetAudience('');
    setDeliveryMode('');
    setExpectations('');
    setDuration('');
    setBudget('');
    setNotes('');
    setResources([]);
  };

  const renderSectionHeader = (icon: string, title: string, color: string = COLORS.primary) => (
    <View style={styles.sectionHeader}>
       <FontAwesome5 name={icon} size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
       <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Service Details */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
              {renderSectionHeader('chalkboard', 'Service Details')}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Type <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => openSelection('Select Service Type', SERVICE_TYPES, setServiceType)}
                >
                  <FontAwesome5 name="chalkboard-teacher" size={16} color={COLORS.primary} />
                  <Text style={serviceType ? styles.inputText : styles.placeholderText}>
                    {serviceType || 'Select a service type'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Audience <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => openSelection('Select Target Audience', TARGET_AUDIENCES, setTargetAudience)}
                >
                  <FontAwesome5 name="users" size={16} color={COLORS.primary} />
                  <Text style={targetAudience ? styles.inputText : styles.placeholderText}>
                    {targetAudience || 'Who is this for?'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.textLight} style={styles.chevron} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mode of Delivery <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => openSelection('Select Mode of Delivery', DELIVERY_MODES, setDeliveryMode)}
                >
                  <FontAwesome5 name="globe" size={16} color={COLORS.primary} />
                  <Text style={deliveryMode ? styles.inputText : styles.placeholderText}>
                    {deliveryMode || 'Online, In-Person...'}
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
              <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => openSelection('Select Duration', DURATIONS, setDuration)}
              >
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
                <FontAwesome5 name="money-bill-wave" size={16} color={COLORS.primary} />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.textLight, marginLeft: 10 }}>DA</Text>
                <TextInput
                  style={[styles.input, { marginLeft: 10 }]}
                  placeholder="Ex: 2000"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />
              </View>
            </View>
          </Animated.View>

          {/* Pedagogical Resources */}
          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <View style={styles.divider} />
            {renderSectionHeader('folder-open', 'Pedagogical Resources')}
            
            <View style={styles.infoBox}>
               <FontAwesome5 name="info-circle" size={16} color="#666" style={{marginTop: 2}} />
               <Text style={styles.infoText}>
                 Upload your lesson plans, exercises, or supporting materials here.
               </Text>
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={handleAddResource}>
                <View style={styles.uploadIconContainer}>
                    <FontAwesome5 name="folder-open" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.uploadTextContainer}>
                    <Text style={styles.uploadTitle}>Open Resource Space</Text>
                    <Text style={styles.uploadSubtitle}>Manage Courses, Exercises, Videos</Text>
                </View>
                <FontAwesome5 name="chevron-right" size={16} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* List of attached resources */}
            {resources.length > 0 && (
                <View style={styles.resourcesList}>
                    {resources.map((res, index) => (
                        <View key={index} style={styles.resourceItem}>
                            <View style={styles.resourceInfo}>
                                <FontAwesome5 name="file-pdf" size={20} color="#E74C3C" style={{ marginRight: 10 }} />
                                <Text style={styles.resourceName}>{res.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveResource(index)}>
                                <MaterialIcons name="close" size={20} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
          </Animated.View>

          {/* Additional Comments */}
          <Animated.View entering={FadeInDown.delay(800).springify()}>
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
          <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.footer}>
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

      {/* Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectionTitle}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={currentOptions}
                  keyExtractor={(item) => item}
                  contentContainerStyle={styles.modalList}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.modalOption}
                      onPress={() => handleOptionSelect(item)}
                    >
                      <Text style={styles.modalOptionText}>{item}</Text>
                      {((selectionTitle.includes('Service') && serviceType === item) ||
                        (selectionTitle.includes('Target') && targetAudience === item) ||
                        (selectionTitle.includes('Delivery') && deliveryMode === item) ||
                        (selectionTitle.includes('Duration') && duration === item)) && (
                        <FontAwesome5 name="check" size={16} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingTop: 12,
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
  uploadButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#D1D1D6',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  resourcesList: {
    marginTop: 5,
    marginBottom: 15,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceName: {
    fontSize: 14,
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '70%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
