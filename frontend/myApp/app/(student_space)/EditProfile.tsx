import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';


export default function EditProfile() {
  const router = useRouter();
    const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState('Karima Benali');
  const [email, setEmail] = useState('k.benali@eleve.dz');
  const [phone, setPhone] = useState('+213 550 123 456');
  const [address, setAddress] = useState('Alger, Bab Ezzouar');
  const [level, setLevel] = useState('Terminale S');
  const [sessionMode, setSessionMode] = useState('Online · Hybrid');
  const [description, setDescription] = useState(
    'Motivated Terminale S student with a strong interest in Mathematics and Physics. I approach studies with determination and focus, and prefer clear study progress to work effectively.'
  );

  const [newGoal, setNewGoal] = useState('');
  const [learningGoals, setLearningGoals] = useState<string[]>([
    'Master key concepts in Mathematics and Physics',
    'Practice exam simulations every week',
  ]);

  const canAddGoal = useMemo(() => newGoal.trim().length > 0, [newGoal]);


  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access media library is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets.length > 0) {
    setProfileImage(result.assets[0].uri);
  }
};

  const handleSave = () => {
    console.log('Saved:', {
      fullName,
      email,
      phone,
      address,
      level,
      sessionMode,
      learningGoals,
    });
    router.back();
  };

  const handleAddGoal = () => {
    const cleanGoal = newGoal.trim();
    if (!cleanGoal) {
      return;
    }
    setLearningGoals(prev => [...prev, cleanGoal]);
    setNewGoal('');
  };

  const handleRemoveGoal = (index: number) => {
    setLearningGoals(prev => prev.filter((_, i) => i !== index));
  };

  const handleGoBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/(student_space)/studentSpace');
    router.push('/(student_space)/studentSpace');
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={18} color="#2A3470" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Edit Student Profile</Text>
        </View>

        <View style={styles.photoCard}>
          <View style={styles.photoRow}>
            <TouchableOpacity onPress={pickImage}>
  <View style={styles.profileAvatar}>
    {profileImage ? (
      <Image
        source={{ uri: profileImage }}
        style={{ width: 72, height: 72, borderRadius: 36 }}
      />
    ) : (
      <Text style={styles.profileAvatarText}>K</Text>
    )}
  </View>
</TouchableOpacity>
           

            <TouchableOpacity style={styles.uploadPhotoButton} activeOpacity={0.9}  onPress={pickImage} >
              <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
              <Text style={styles.uploadPhotoButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.photoHintText}>Change or upload a new profile picture.</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Personal Information</Text>
          <View style={styles.whiteCard}>
            <FormRow
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              icon="person-outline"
            />

            <FormRow
              label="Email"
              value={email}
              onChange={setEmail}
              icon="mail-outline"
            />

            <FormRow
              label="Phone"
              value={phone}
              onChange={setPhone}
              icon="call-outline"
            />

            <FormRow
              label="Address / Location"
              value={address}
              onChange={setAddress}
              icon="location-outline"
              isLast
            />
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Academic Profile</Text>
          <View style={styles.whiteCard}>
            <FormRow
              label="School Level"
              value={level}
              onChange={setLevel}
              icon="school-outline"
            />

            <FormRow
              label="Preferred Session Mode"
              value={sessionMode}
              onChange={setSessionMode}
              icon="laptop-outline"
              isLast
            />
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Pedagogical Description</Text>
          <View style={styles.descriptionCard}>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Write a short pedagogical description"
              placeholderTextColor="#98A2B3"
            />
          </View>
        </View>

        <View style={styles.goalsCard}>
          <View style={styles.goalsTitleRow}>
            <Text style={styles.sectionTitle}>Learning Objectives</Text>
            <Ionicons name="star-outline" size={18} color="#D3A900" />
          </View>

          {learningGoals.map((goal, index) => (
            <View key={`${goal}-${index}`} style={styles.goalItem}>
              <Text style={styles.goalText}>{goal}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveGoal(index)}
                style={styles.goalRemoveButton}
                activeOpacity={0.85}
              >
                <Ionicons name="close" size={16} color="#C13A3A" />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.addGoalRow}>
            <TextInput
              style={styles.addGoalInput}
              value={newGoal}
              onChangeText={setNewGoal}
              placeholder="Add learning goal"
              placeholderTextColor="#98A2B3"
            />

            <TouchableOpacity
              style={[styles.addGoalButton, !canAddGoal && styles.addGoalButtonDisabled]}
              onPress={handleAddGoal}
              disabled={!canAddGoal}
              activeOpacity={0.9}
            >
              <Ionicons name="add" size={17} color="#FFFFFF" />
              <Text style={styles.addGoalButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormRow({
  label,
  value,
  onChange,
  icon,
  isLast = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowSeparator]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color="#4F46E5" />
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={`Enter ${label}`}
        />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 16, paddingBottom: 28 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EAF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: { fontSize: 20, fontWeight: '600', color: '#24306A' },

  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#F3DE96',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#F4D34F',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 0,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E7EDFF',
    borderWidth: 1,
    borderColor: '#D4DFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#24306A',
  },
  uploadPhotoButton: {
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2D5BFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPhotoButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  photoHintText: {
    marginTop: 10,
    color: '#6C768E',
    fontSize: 13,
    fontWeight: '400',
  },

  block: {
    marginBottom: 14,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#25305A',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#F3DE96',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
    shadowColor: '#F4D34F',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 11,
    elevation: 0,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  rowSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8EDFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputWrap: { flex: 1 },
  label: { fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: '500' },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5EAF3',
  },

  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#F3DE96',
    padding: 12,
    marginBottom: 2,
    shadowColor: '#F4D34F',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 11,
    elevation: 0,
  },
  descriptionInput: {
    minHeight: 96,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5EAF3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },

  goalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#F3DE96',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#F4D34F',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 0,
  },
  goalsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#24306A',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEE6C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F1CD5A',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 11,
    marginBottom: 9,
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  goalRemoveButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFDADA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addGoalRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addGoalInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5EAF3',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1F2937',
    marginRight: 8,
  },
  addGoalButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#2D5BFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGoalButtonDisabled: {
    backgroundColor: '#B8C8FF',
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2,
  },

  buttonWrap: { marginBottom: 40 },
  saveButton: {
    backgroundColor: '#2D5BFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#DBE2EF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  cancelButtonText: { color: '#2B3B7A', fontWeight: '500', fontSize: 16 },
}); 