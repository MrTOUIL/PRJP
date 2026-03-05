import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import StudentSpace from '../../components/ui/student space';
import StudentDocuments from '../../components/ui/student documents';
import StudentSubjects from '../../components/ui/student subjects';
import StudentRequests from '../../components/ui/student requests';

const { width } = Dimensions.get('window');

const VIEWS = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'subjects', label: 'Subjects', icon: 'book' },
  { id: 'requests', label: 'Requests', icon: 'notifications' },
  { id: 'documents', label: 'Docs', icon: 'folder-open' },
];

export default function StudentSpacePage() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <StudentSpace />;
      case 'documents': return <StudentDocuments />;
      case 'subjects':  return <StudentSubjects />;
      case 'requests':  return <StudentRequests />;
      default:          return <StudentSpace />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Animated.View 
            key={currentView}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{ flex: 1 }}
        >
            {renderContent()}
        </Animated.View>
      </View>

      {/* Floating Bottom Tab Bar */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {VIEWS.map((view) => {
            const isActive = currentView === view.id;
            return (
              <TouchableOpacity 
                key={view.id} 
                onPress={() => setCurrentView(view.id)}
                activeOpacity={0.7}
                style={styles.tabWrapper}
              >
                <Animated.View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                  <Ionicons 
                    name={isActive ? view.icon : `${view.icon}-outline` as any} 
                    size={24} 
                    color={isActive ? '#fff' : '#666'} 
                  />
                </Animated.View>
                {isActive && (
                  <Text style={styles.tabLabel}>
                    {view.label} 
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Space for floating tab bar
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 360,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: '#1E1B6B', // Deep Blue
    transform: [{translateY: -12}], // Pop up effect
    shadowColor: '#1E1B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E1B6B', // Deep Blue
    position: 'absolute',
    bottom: -6,
  },
});
