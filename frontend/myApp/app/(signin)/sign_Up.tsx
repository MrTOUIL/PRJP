import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { FontAwesome5, FontAwesome , AntDesign } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Define theme colors locally or import from constants
const COLORS = {
  primary: '#2E2E8C', // Dark Blue
  secondary: '#4D4D99', // Slightly lighter blue for icon
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  borderGray: '#E0E0E0',
  textGray: '#9E9E9E',
  selectedBg: '#E8E8FF', // Very light blue/purple for selected card
  white: '#FFFFFF',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type BouncyTouchableProps = React.ComponentProps<typeof TouchableOpacity> & {
  entering?: any;
  style?: any;
  children: React.ReactNode;
};

function BouncyTouchable({ style, children, onPressIn, onPressOut, ...rest }: BouncyTouchableProps) {
  const press = useSharedValue(0);
  const idle = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    idle.value = withRepeat(
      withSequence(withTiming(1, { duration: 1300 }), withTiming(0, { duration: 1300 })),
      -1,
      true
    );
    glow.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, [glow, idle]);

  const containerStyle = useAnimatedStyle(() => {
    const pressScale = interpolate(press.value, [0, 1], [1, 0.95]);
    const idleScale = interpolate(idle.value, [0, 1], [1, 1.02]);
    const scale = pressScale * idleScale;
    return {
      transform: [{ scale }],
      opacity: interpolate(press.value, [0, 1], [1, 0.92]),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(glow.value, [0, 1], [0.0, 0.18]),
    };
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.95}
      {...rest}
      onPressIn={(e) => {
        press.value = withSpring(1, { damping: 16, stiffness: 240 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        press.value = withSpring(0, { damping: 16, stiffness: 240 });
        onPressOut?.(e);
      }}
      style={[style, containerStyle]}
    >
      <Animated.View pointerEvents="none" style={[styles.buttonGlow, glowStyle]} />
      {children}
    </AnimatedTouchableOpacity>
  );
}

export default function SignUp() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | 'teacher' | null>(null);

  const handleRoleSelect = (role: 'student' | 'parent' | 'teacher') => {
    setSelectedRole(role);
    SecureStore.setItemAsync('pendingRole', role).catch(() => {});
  };

  const navigateToSignIn = ():void => {
    router.push('/signin');
  };


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.contentContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <FontAwesome5 name="graduation-cap" size={60} color={COLORS.secondary} style={styles.headerIcon} />
        </View>

        {/* Social Login Section */}
        <Animated.View 
                    entering={FadeInDown.delay(400).duration(600).springify()}
                    style={styles.socialContainer}
                >
              <BouncyTouchable style={styles.socialButton}>
                        <FontAwesome5 name="facebook-f" size={20} color="#3b5998" />
              </BouncyTouchable>
              <BouncyTouchable style={styles.socialButton}>
                        <AntDesign name="google" size={20} color="#DB4437" />
              </BouncyTouchable>
              <BouncyTouchable style={styles.socialButton}>
                        <FontAwesome5 name="linkedin-in" size={20} color="#0077b5" />
              </BouncyTouchable>
        </Animated.View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR REGISTER WITH EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Role Selection */}
        <View style={styles.rolesContainer}>
          <RoleCard 
            role="student" 
            label="Student" 
            icon="user-graduate" 
            isSelected={selectedRole === 'student'} 
            onPress={() => handleRoleSelect('student')}
            index={0}
          />
          <RoleCard 
            role="parent" 
            label="Parent" 
            icon="user-friends" 
            isSelected={selectedRole === 'parent'} 
            onPress={() => handleRoleSelect('parent')}
            index={1}
          />
          <RoleCard 
            role="teacher" 
            label="Teacher" 
            icon="chalkboard-teacher" 
            isSelected={selectedRole === 'teacher'} 
            onPress={() => handleRoleSelect('teacher')}
            index={2}
          />
        </View>

        {/* Footer Text */}
        <Text style={styles.helperText}>Select your role to continue your registration</Text>

        {/* Continue Button */}
        {selectedRole && (
          <BouncyTouchable
            entering={FadeInUp.duration(600).springify()}
            style={styles.continueButton}
            onPress={() => {
                    if (selectedRole === 'student') {
                        router.push('/sign_Up_Student'); 
                    } else if (selectedRole === 'teacher') {
                        router.push('/(signin)/sign_Up_teacher'); 
                    } else if (selectedRole === 'parent') {
                      router.push('/(signin)/sign_Up_parent'); 
                   }
  }}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </BouncyTouchable>
        )}

        {/* Sign In Link */}
        <Animated.View entering={FadeInUp.delay(700).duration(600).springify()} style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <BouncyTouchable onPress={navigateToSignIn} style={styles.signInLinkButton}>
            <Text style={styles.signInLink}>Sign In</Text>
          </BouncyTouchable>
        </Animated.View>

      </Animated.View>
    </View>
  );
}

const SocialButton = ({ icon, color }: { icon: string, color: string }) => {
    return (
      <AnimatedPressable 
        style={({ pressed, hovered }) => [
        styles.socialButton,
        { 
            opacity: pressed ? 0.7 : 1, 
            transform: [{ scale: pressed ? 0.9 : (hovered ? 1.1 : 1) }] 
        }
      ]}>
          <FontAwesome name={icon as any} size={20} color="#333" />
      </AnimatedPressable>
    );
  };
  
const RoleCard = ({ 
    role, 
    label, 
    icon, 
    isSelected, 
    onPress,
    index 
}: { 
    role: string, 
    label: string, 
    icon: string, 
    isSelected: boolean, 
    onPress: () => void,
    index: number
}) => {
    
    const animatedStyle = useAnimatedStyle(() => {
        return {
            borderColor: withTiming(isSelected ? COLORS.primary : COLORS.borderGray),
            backgroundColor: withTiming(isSelected ? COLORS.selectedBg : COLORS.background),
            transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }],
        };
    });

    return (
        <AnimatedPressable 
            entering={FadeInDown.delay(300 + (index * 100)).duration(500).springify()}
            onPress={onPress}
            style={[styles.roleCard, animatedStyle]}
        >
            <FontAwesome5 
                name={icon} 
                size={32} 
                color={isSelected ? COLORS.primary : COLORS.textGray} 
                style={{ marginBottom: 10 }}
            />
            <Text style={[
                styles.roleText, 
                { color: isSelected ? COLORS.primary : COLORS.textGray, fontWeight: isSelected ? '700' : '500' }
            ]}>
                {label}
            </Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  headerIcon: {
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9E9E9E',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    gap: 12,
  },
  roleCard: {
    flex: 1,
    height: 120, 
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    marginTop: 8,
  },
  helperText: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  continueButton: {
    width: '90%',
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    color: '#757575',
    fontSize: 14,
  },
  signInLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 4,
  },
  signInLinkButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    overflow: 'hidden',
  },
  buttonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});