import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2E2D75',
  background: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#8E8E93',
  border: '#E1E1E1',
  button: '#1A1A5E',
  secondary: '#FFD700',
};

const DOCUMENT_TYPES = [
  'Exam',
  'Exercises',
  'Course Material',
  'Assignment',
  'Quiz',
  'Worksheet',
  'Lecture Notes',
  'Other',
];

export default function DocumentService() {
  const router = useRouter();
  const { sessionid } = useLocalSearchParams();

  // State Management
  const [title, setTitle] = useState('');
  const [typeDoc, setTypeDoc] = useState('');
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [showTypeList, setShowTypeList] = useState(false);

  // Spinner rotation animation
  const spinnerRotate = useSharedValue(0);

  useEffect(() => {
    spinnerRotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, []);

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinnerRotate.value}deg` }],
    };
  });

  // Pick Document
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/*'],
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setMsg("");
      }
    } catch (error) {
      console.error('Error picking document:', error);
      setMsg("Error selecting document");
    }
  };

  // Upload Document

  const handleUpload = async (): Promise<void> => {
    if (!typeDoc) {
      setMsg("Please select document type");
      return;
    }

    if (!selectedFile) {
      setMsg("Please select a document");
      return;
    }

    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      setMsg("");
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('type_doc', typeDoc);
      formData.append('sessionid', sessionid as string);
      formData.append('document', {
        uri: selectedFile.uri,
        type: selectedFile.mimeType || 'application/octet-stream',
        name: selectedFile.name,
      } as any);

      const response = await fetch(`${BASE_URL}/document/create_document`, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (data.succ) {
        router.back();
      } else if (data.error === "Token expired!") {
        // Refresh token
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshData.accessToken) {
          await SecureStore.setItemAsync("accessToken", refreshData.accessToken);
          // Retry upload
          const retryFormData = new FormData();
          retryFormData.append('title', title);
          retryFormData.append('type_doc', typeDoc);
          retryFormData.append('sessionid', sessionid as string);
          retryFormData.append('document', {
            uri: selectedFile.uri,
            type: selectedFile.mimeType || 'application/octet-stream',
            name: selectedFile.name,
          } as any);

          const retryResponse = await fetch(`${BASE_URL}/document/create_document`, {
            method: "POST",
            headers: {
              "authorization": `Bearer ${refreshData.accessToken}`,
            },
            body: retryFormData,
          });

          const retryData = await retryResponse.json();
          if (retryData.succ) {
            router.back();
          } else {
            setMsg("Error uploading document. Try again!");
          }
        } else {
          router.replace("/sign_in");
        }
      } else {
        setMsg(data.error || "Error uploading document");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setMsg("Error uploading document");
    }
  };

  const handleReset = () => {
    setTitle('');
    setTypeDoc('');
    setSelectedFile(null);
    setMsg("");
  };

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
                  <MaterialIcons name="chevron-left" size={24} color={COLORS.background} />
                </View>
              </TouchableOpacity>
            </View>

            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.titleContainer}>
              <FontAwesome5 name="file-upload" size={32} color={COLORS.secondary} />
              <Text style={styles.mainTitle}>Upload Document</Text>
              <Text style={styles.subTitle}>
                Upload course materials and session documents
              </Text>
            </Animated.View>
          </SafeAreaView>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Document Type Selection */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="list" size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Document Details</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Document Title <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="heading" size={16} color={COLORS.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter document title"
                  placeholderTextColor={COLORS.textLight}
                  value={title}
                  onChangeText={(text: string) => setTitle(text)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Document Type <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowTypeList(!showTypeList)}
              >
                <FontAwesome5 name="folder-open" size={16} color={COLORS.primary} />
                <Text style={typeDoc ? styles.inputText : styles.placeholderText}>
                  {typeDoc || 'Select document type'}
                </Text>
                <MaterialIcons
                  name={showTypeList ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={24}
                  color={COLORS.textLight}
                  style={styles.chevron}
                />
              </TouchableOpacity>

              {showTypeList && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView nestedScrollEnabled style={styles.dropdownList}>
                    {DOCUMENT_TYPES.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.dropdownItem,
                          typeDoc === item && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setTypeDoc(item);
                          setShowTypeList(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            typeDoc === item && styles.dropdownItemTextActive,
                          ]}
                        >
                          {item}
                        </Text>
                        {typeDoc === item && (
                          <FontAwesome5 name="check" size={14} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </Animated.View>

          {/* File Selection */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <View style={styles.divider} />
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="file" size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Select File</Text>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity 
                style={styles.filePicker}
                onPress={handlePickDocument}
              >
                <MaterialCommunityIcons name="file-document-outline" size={32} color={COLORS.primary} />
                <Text style={styles.filePickerText}>
                  {selectedFile ? selectedFile.name : 'Tap to select a document'}
                </Text>
                <Text style={styles.filePickerSubtext}>
                  {selectedFile ? 'Selected' : 'PDF, DOC, XLS, Images supported'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Message Section */}
          <Animated.View entering={FadeInDown.duration(400).springify()}>
            <Text style={styles.messageText}>{msg}</Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleUpload} disabled={loading}>
              <FontAwesome5 name="cloud-upload-alt" size={16} color={COLORS.background} style={{ marginRight: 10 }} />
              <Text style={styles.submitButtonText}>Upload Document</Text>
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
              <Text style={styles.securityText}>Your documents are securely stored.</Text>
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
  titleContainer: {
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 10,
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
  chevron: {
    marginLeft: 'auto',
  },
  dropdownListContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownList: {
    maxHeight: 220,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemActive: {
    backgroundColor: '#E0E7FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  dropdownItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  filePicker: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(46, 45, 117, 0.05)',
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  filePickerSubtext: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 6,
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
    color: COLORS.background,
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
