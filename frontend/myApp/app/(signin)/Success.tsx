import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

// Colors based on the design
const COLORS = {
  primary: '#0A1142', // Deep Dark Blue header bg
  primaryLight: '#1E2A78', // Lighter blue for gradient
  accent: '#FFC805', // Yellow accent
  background: '#F4F6F9', // Light gray background body
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981', // Green for success
  successBg: '#D1FAE5', // Light green background for success card
};

export default function Success() {
  // No logic implemented - only UI structure
  const router = useRouter() ;
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            {/* Back Button */}
            
            <Text style={styles.headerTitle}>Forgotten Password?</Text>
          </View>
        </SafeAreaView>
        <View style={styles.headerCircle} />
      </LinearGradient>

      {/* Floating Success Icon */}
      <View style={styles.successIconWrapper}>
        <View style={styles.successIconContainer}>
          <FontAwesome5 name="check" size={32} color="white" />
        </View>
      </View>
    </View>
  );

  const renderSuccessContent = () => (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      {/* Success Card */}
      <View style={styles.successCard}>
        <Animated.View entering={ZoomIn.delay(300).duration(400)}>
          <View style={styles.successIconCircle}>
            <MaterialIcons name="check-circle" size={48} color={COLORS.success} />
          </View>
        </Animated.View>
        
        <Text style={styles.successTitle}>Password Successfully Reset</Text>
        <Text style={styles.successMessage}>
          Your new password has been saved. You can now sign in to your account.
        </Text>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={() => router.push('/signin')}>
        <Text style={styles.primaryButtonText}>Sign In to My Account</Text>
        <FontAwesome5 name="arrow-right" size={16} color="white" />
      </TouchableOpacity>

     
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.spacer} />
          {renderSuccessContent()}

          
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
    height: 260,
    width: '100%',
    marginBottom: 40,
    position: 'relative',
    zIndex: 1,
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -100,
    right: -100,
  },
  successIconWrapper: {
    position: 'absolute',
    bottom: -35,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  spacer: {
    height: 10,
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  signInLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
});