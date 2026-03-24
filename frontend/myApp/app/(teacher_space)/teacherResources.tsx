
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker'; // Conceptually

const COLORS = {
  primary: '#2E2D75', // Matching servicePdg
  secondary: '#FFD700',
  background: '#F8F9FA',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#8E8E93',
  lightPurple: '#E8E8FF',
  cardBorder: '#E1E1E1',
};

const RESOURCE_TYPES = [
  { id: 'courses', title: 'Course Materials', icon: 'book', color: '#4A90E2', desc: 'PDFs, Slides, Notes' },
  { id: 'exercises', title: 'Exercises & Tests', icon: 'tasks', color: '#2ECC71', desc: 'Homework, Quizzes' },
  { id: 'videos', title: 'Video Records', icon: 'video', color: '#E74C3C', desc: 'Recorded Sessions' },
];

export default function TeacherResources() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('courses');
  
  // Mock data for resources
  const [resources, setResources] = useState([
    { id: '1', title: 'Introduction to Algebra.pdf', type: 'courses', date: '2023-10-01', size: '2.4 MB' },
    { id: '2', title: 'Calculus Worksheet 1.docx', type: 'exercises', date: '2023-10-05', size: '1.1 MB' },
    { id: '3', title: 'Lecture 1 - Overview.mp4', type: 'videos', date: '2023-09-28', size: '450 MB' },
  ]);

  const handleUpload = async () => {
    // In a real app, this would open DocumentPicker
    Alert.alert('Upload', `Select a file to upload to ${activeTab} section.`);
    // Simulate adding a file
    const newRes = {
        id: Date.now().toString(),
        title: `New Upload ${resources.length + 1}.${activeTab === 'videos' ? 'mp4' : 'pdf'}`,
        type: activeTab,
        date: new Date().toISOString().split('T')[0],
        size: '0.5 MB'
    };
    setResources([newRes, ...resources]);
  };

  const getFilteredResources = () => resources.filter(r => r.type === activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="chevron-left" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Resource Space</Text>
            <View style={{ width: 28 }} />
          </View>
        </SafeAreaView>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
            {RESOURCE_TYPES.map((type, index) => (
                <TouchableOpacity 
                    key={type.id} 
                    style={[
                        styles.tab, 
                        activeTab === type.id && styles.activeTab,
                        { borderColor: activeTab === type.id ? type.color : 'transparent' }
                    ]}
                    onPress={() => setActiveTab(type.id)}
                >
                    <FontAwesome5 
                        name={type.icon} 
                        size={16} 
                        color={activeTab === type.id ? type.color : COLORS.textLight} 
                        style={{ marginRight: 8 }}
                    />
                    <Text style={[
                        styles.tabText, 
                        activeTab === type.id && { color: type.color, fontWeight: 'bold' }
                    ]}>
                        {type.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.uploadAreaContainer}>
            <TouchableOpacity style={styles.uploadArea} onPress={handleUpload}>
                <View style={[styles.uploadIconCircle, { backgroundColor: RESOURCE_TYPES.find(t => t.id === activeTab)?.color + '20' }]}>
                    <FontAwesome5 name="cloud-upload-alt" size={32} color={RESOURCE_TYPES.find(t => t.id === activeTab)?.color} />
                </View>
                <Text style={styles.uploadTitle}>Tap to Upload {RESOURCE_TYPES.find(t => t.id === activeTab)?.title}</Text>
                <Text style={styles.uploadSubtitle}>{RESOURCE_TYPES.find(t => t.id === activeTab)?.desc}</Text>
            </TouchableOpacity>
        </Animated.View>

        <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Recent Files</Text>
        </View>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {getFilteredResources().length === 0 ? (
                <View style={styles.emptyState}>
                    <FontAwesome5 name="folder-open" size={40} color="#DDD" />
                    <Text style={styles.emptyText}>No files uploaded yet</Text>
                </View>
            ) : (
                getFilteredResources().map((item, index) => (
                    <Animated.View 
                        key={item.id} 
                        entering={FadeInDown.delay(index * 100).springify()} 
                        style={styles.resourceCard}
                    >
                        <View style={[styles.resourceIcon, { backgroundColor: RESOURCE_TYPES.find(t => t.id === item.type)?.color + '20' }]}>
                            <FontAwesome5 
                                name={item.type === 'videos' ? 'file-video' : item.type === 'exercises' ? 'file-alt' : 'file-pdf'} 
                                size={20} 
                                color={RESOURCE_TYPES.find(t => t.id === item.type)?.color} 
                            />
                        </View>
                        <View style={styles.resourceInfo}>
                            <Text style={styles.resourceTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.resourceMeta}>{item.date} • {item.size}</Text>
                        </View>
                        <TouchableOpacity style={styles.moreButton}>
                            <MaterialIcons name="more-vert" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </Animated.View>
                ))
            )}
        </ScrollView>
      </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabsContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingRight: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  uploadAreaContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  uploadArea: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  uploadIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  listHeader: {
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    paddingBottom: 30,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  resourceMeta: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  moreButton: {
    padding: 5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#CCC',
    fontSize: 16,
  },
});
