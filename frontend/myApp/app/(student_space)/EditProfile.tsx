import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';
import { useRouter } from 'expo-router';

const ACADEMIC_LEVELS = ['Primary', 'Middle', 'High School', 'University'];
const WILAYAS = [
  'ADRAR', 'CHLEF', 'LAGHOUAT', 'OUM EL BOUAGHI', 'BATNA', 'BEJAIA', 'BISKRA',
  'BECHAR', 'BLIDA', 'BOUIRA', 'TAMANRASSET', 'TEBESSA', 'TLEMCEN', 'TIARET',
  'TIZI OUZOU', 'ALGER', 'DJELFA', 'JIJEL', 'SETIF', 'SAIDA', 'SKIKDA',
  'SIDI BEL ABBES', 'ANNABA', 'GUELMA', 'CONSTANTINE', 'MEDEA', 'MOSTAGANEM',
  'MSILA', 'MASCARA', 'OUARGLA', 'ORAN', 'EL BAYADH', 'ILLIZI',
  'BORDJ BOU ARRERIDJ', 'BOUMERDES', 'EL TAREF', 'TINDOUF', 'TISSEMSILT',
  'EL OUED', 'KHENCHELA', 'SOUK AHRAS', 'TIPAZA', 'MILA', 'AIN DEFLA', 'NAAMA',
  'AIN TEMOUCHENT', 'GHARDAIA', 'RELIZANE', "EL M'GHAIR", 'EL MENIA',
  'OULED DJELLAL', 'BORDJ BADJI MOKHTAR', 'BENI ABBES', 'TIMIMOUN', 'TOUGGOURT',
  'DJANET', 'IN SALAH', 'IN GUEZZAM'
];

export default function EditProfile() {
  const router = useRouter();
    
  const [firstName, setFirstName] = useState('Karima');
  const [lastName, setLastName] = useState('Benali');
  const [address, setAddress] = useState('');
  const [level, setLevel] = useState('High School');
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showWilayaPicker, setShowWilayaPicker] = useState(false);

  // load profile from secure store if available
  useEffect(() => {
    (async () => {
      try {
        const data = await SecureStore.getItemAsync('studentProfileData');
        if (data) {
          const parsed = JSON.parse(data);
          const f = parsed.first_name || parsed.firstName || '';
          const l = parsed.last_name || parsed.lastName || '';
          setFirstName(f || (parsed.fullName ? parsed.fullName.split(' ')[0] : ''));
          setLastName(l || (parsed.fullName ? parsed.fullName.split(' ').slice(1).join(' ') : ''));
          if (parsed.postal_adress) setAddress(parsed.postal_adress);
          if (parsed.academic_level) setLevel(parsed.academic_level);
        }
      } catch (e) {
        // ignore parse errors
      }
    })();
  }, []);


 

  const handleSave = async () => {
    const payload = {
      first_name: firstName,
      last_name: lastName,
      postal_adress: address,
      academic_level: level,
    };

    const apiRole = await getStudentOrParentRole();

    const sendSave = async (token: string) => {
      const resp = await fetch(`${BASE_URL}/${apiRole}/editProfile`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      return resp.json();
    };

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      let data = await sendSave(accessToken || '');

      if (data && data.error === 'Token expired!') {
        const r = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const newData = await r.json();
        if (newData.accessToken) {
          await SecureStore.setItemAsync('accessToken', newData.accessToken);
          data = await sendSave(newData.accessToken);
        }
      }

      if (data && data.succ) {
        // update local stored profile
        if (data.student) {
          await SecureStore.setItemAsync('studentProfileData', JSON.stringify(data.student));
        }
        router.replace('/(student_space)/studentSpace');
        return;
      }

      // fallback: just go back
      router.back();
    } catch (err) {
      console.error(err);
      router.back();
    }
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

        

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Personal Information</Text>
          <View style={styles.whiteCard}>
            <FormRow
              label="First Name"
              value={firstName}
              onChange={setFirstName}
              icon="person-outline"
            />

            <FormRow
              label="Last Name"
              value={lastName}
              onChange={setLastName}
              icon="person-outline"
            />

            <FormRow
              label="Address / Location"
              value={address}
              onChange={setAddress}
              icon="location-outline"
              onPress={() => setShowWilayaPicker(true)}
              isLast
            />
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Academic Profile</Text>
          <View style={styles.whiteCard}>
            <TouchableOpacity
              style={[styles.row, styles.rowSeparator]}
              onPress={() => setShowLevelPicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                <Ionicons name="school-outline" size={18} color="#4F46E5" />
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>School Level</Text>
                <View style={styles.pickerDisplay}>
                  <Text style={styles.pickerValue}>{level || 'Select a level'}</Text>
                  <Ionicons name="chevron-down" size={18} color="#6B7280" />
                </View>
              </View>
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

      <Modal
        visible={showLevelPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLevelPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select School Level</Text>
              <TouchableOpacity onPress={() => setShowLevelPicker(false)}>
                <Ionicons name="close" size={24} color="#2A3470" />
              </TouchableOpacity>
            </View>
            {ACADEMIC_LEVELS.map((academicLevel) => (
              <TouchableOpacity
                key={academicLevel}
                style={[
                  styles.pickerOption,
                  level === academicLevel && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setLevel(academicLevel);
                  setShowLevelPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    level === academicLevel && styles.pickerOptionTextSelected,
                  ]}
                >
                  {academicLevel}
                </Text>
                {level === academicLevel && (
                  <Ionicons name="checkmark" size={20} color="#2D5BFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWilayaPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWilayaPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Wilaya</Text>
              <TouchableOpacity onPress={() => setShowWilayaPicker(false)}>
                <Ionicons name="close" size={24} color="#2A3470" />
              </TouchableOpacity>
            </View>
            <ScrollView nestedScrollEnabled style={styles.pickerScroll}>
              {WILAYAS.map((wilaya) => (
                <TouchableOpacity
                  key={wilaya}
                  style={[
                    styles.pickerOption,
                    address === wilaya && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    setAddress(wilaya);
                    setShowWilayaPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      address === wilaya && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {wilaya}
                  </Text>
                  {address === wilaya && (
                    <Ionicons name="checkmark" size={20} color="#2D5BFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function FormRow({
  label,
  value,
  onChange,
  icon,
  isLast = false,
  onPress,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowSeparator]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color="#4F46E5" />
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={onPress ? 'Select Wilaya' : `Enter ${label}`}
          editable={!onPress}
          pointerEvents={onPress ? 'none' : 'auto'}
        />
      </View>
    </TouchableOpacity>
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

  pickerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5EAF3',
  },
  pickerValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF5',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#24306A',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptionSelected: {
    backgroundColor: '#F0F4FF',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#2D5BFF',
    fontWeight: '600',
  },
  pickerScroll: {
    maxHeight: 520,
  },
}); 
