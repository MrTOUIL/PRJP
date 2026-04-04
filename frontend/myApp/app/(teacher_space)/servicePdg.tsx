import React, { useState, useEffect } from 'react';
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
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

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

export default function ServicePedagogique() {
  const router = useRouter();
  
  // State for form fields
  const [title , setTitle] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [loading , setLoading] = useState(false) ; 
  const [msg , setMsg] = useState("") ; 
  
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
  
  const handleRequest = async (): Promise<void> => {
  try {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    setMsg(""); setLoading(true);

    fetch("http://10.89.124.250:5000/teacher/create_service", {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` },
      body: JSON.stringify({
        title: title,
        type: serviceType,
        target_audiance: targetAudience,
        mode: deliveryMode,
        cost: budget,
        comment: notes
      })
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false); setMsg("");
      if (data.succ) {
        router.push("/(teacher_space)/teacherSpace");
      } else if (data.error !== "Token expired!"){
        setMsg("Error in creating the service..Try again!") ; 
      }
      
        else if (data.error === "Token expired!") {
        fetch("http://10.89.124.250:5000/teacher/refresh", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.accessToken) {
            SecureStore.setItemAsync("accessToken", data.accessToken);
            fetch("http://10.89.124.250:5000/teacher/create_service", {
              method: "POST",
              headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` },
              body: JSON.stringify({
                title: title,
                type: serviceType,
                target_audiance: targetAudience,
                mode: deliveryMode,
                cost: budget,
                comment: notes
              })
            })
            .then(res => res.json())
            .then(data => {
              if (data.succ) {
                router.push("/(teacher_space)/teacherSpace");
              } else {
                router.replace("/sign_in");
              }
            });
          } else {
            router.replace("/sign_in");
          }
        });
      } else {
        router.replace("/sign_in");
      }
    });
  } catch (e) {
    console.error(e);
    router.replace("/sign_in");
  }
};

  const handleReset = () => {
    setTitle('');
    setServiceType('');
    setTargetAudience('');
    setDeliveryMode('');
    setBudget(0);
    setNotes('');
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
                <Text style={styles.label}>Service Title <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="heading" size={16} color={COLORS.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Give your service a title"
                    placeholderTextColor={COLORS.textLight}
                    value={title}
                    onChangeText={(text: string) => setTitle(text)}
                  />
                </View>
              </View>

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
                  value={budget.toString()}
                  onChangeText={(text: string) => setBudget(Number(text) || 0)}
                />
              </View>
            </View>
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
                  onChangeText={(text: string) => setNotes(text)}
                />
              </View>
            </View>
          </Animated.View>

          {/* Message Section */}
          <Animated.View entering={FadeInDown.duration(400).springify()}>
            <Text style={styles.messageText}>{msg}</Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleRequest}>
              <FontAwesome5 name="paper-plane" size={16} color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={styles.submitButtonText}>Create Service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            {/* Loading Spinner */}
            {loading && (
              <Animated.View
                entering={FadeInDown.duration(300).springify()}
                style={[styles.spinner, animatedSpinnerStyle]}
              />
            )}

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
  messageText: {
    color: COLORS.secondary,
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: COLORS.secondary,
    borderTopColor: 'transparent',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
