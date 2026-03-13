import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const categories = ['All', 'PDF', 'DOCX', 'Exercises', 'Reports'];

const recentDocuments = [
  { id: 1, title: 'Algebra Exercises – Ch. 3', subtitle: 'Mathematics · Feb 20, 2025 · 2.4 MB · PDF', type: 'pdf' },
  { id: 2, title: 'Physics Lab Report Template', subtitle: 'Physics · Feb 22, 2025 · 4.1 MB · DOCX', type: 'docx' },
];

const thisMonthDocuments = [
  { id: 3, title: 'English Grammar Summary', subtitle: 'English · Feb 15, 2025 · 1.2 MB · PDF', type: 'pdf' },
  { id: 4, title: 'Thermodynamics Formulas', subtitle: 'Physics · Feb 12, 2025 · 890 KB · PDF', type: 'pdf' },
  { id: 5, title: 'Chemistry Chapter 2 Notes', subtitle: 'Chemistry · Feb 10, 2025 · 3.5 MB · DOCX', type: 'docx' },
  { id: 6, title: 'Biology – Cell Division', subtitle: 'Biology · Feb 05, 2025 · 2.1 MB · PDF', type: 'pdf' },
  { id: 7, title: 'Algebra Exercises – Ch. 2', subtitle: 'Mathematics · Feb 02, 2025 · 2.4 MB · PDF', type: 'pdf' },
];

export default function StudentDocuments() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
             <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Documents</Text>
        <TouchableOpacity style={styles.searchButton}>
             <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput 
            placeholder="Search documents..." 
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <TouchableOpacity>
             <Ionicons name="options-outline" size={20} color="#1E1B6B" /> {/* Deep Blue */}
          </TouchableOpacity>
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={[styles.categoryChip, index === 0 && styles.activeCategoryChip]}>
                <Text style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recent */}
        <View style={styles.section}>
          <Animated.Text entering={FadeInUp.delay(300).duration(500)} style={styles.sectionTitle}>RECENT</Animated.Text>
          {recentDocuments.map((doc, index) => (
            <DocumentItem key={doc.id} doc={doc} index={index} baseDelay={300} />
          ))}
        </View>

        {/* This Month */}
        <View style={styles.section}>
          <Animated.Text entering={FadeInUp.delay(500).duration(500)} style={styles.sectionTitle}>THIS MONTH</Animated.Text>
          {thisMonthDocuments.map((doc, index) => (
            <DocumentItem key={doc.id} doc={doc} index={index} baseDelay={500} />
          ))}
        </View>
        <View style={{height: 100}} /> 
      </ScrollView>
    </View>
  );
}

function DocumentItem({ doc, index, baseDelay }: { doc: any, index: number, baseDelay: number }) {
  return (
    <Animated.View entering={FadeInUp.delay(baseDelay + (index * 100)).duration(500).springify()} layout={Layout.springify()}>
      <TouchableOpacity style={styles.documentCard}>
        <View style={styles.documentIconContainer}>
          <Ionicons 
            name={doc.type === 'pdf' ? 'document-text' : 'document'} 
            size={24} 
            color={doc.type === 'pdf' ? '#1E1B6B' : '#0F172A'} // Deep Blue or Dark Slate
          />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{doc.title}</Text>
          <Text style={styles.documentSubtitle}>{doc.subtitle}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 50, // Standard status bar spacing
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1B6B', // Deep Blue
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
      padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 20, // Clean separation
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategoryChip: {
    backgroundColor: '#1E1B6B', // Deep Blue
    borderColor: '#1E1B6B',
  },
  categoryText: {
    color: '#64748B', // Slate
    fontWeight: '600',
    fontSize: 13,
  },
  activeCategoryText: {
    color: '#FFD700', // Gold text
    fontWeight: '700',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8', // Light Slate
    marginBottom: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B', // Dark Slate
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 11,
    color: '#64748B', // Slate
    lineHeight: 16,
  },
});
