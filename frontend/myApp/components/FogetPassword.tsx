import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
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
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Reusing colors from SignUp for consistency
const COLORS = {
  primary: '#2E2E8C', // Dark Blue
  secondary: '#4D4D99', 
  background: '#FFFFFF',
  lightGray: '#F5F5F5',
  borderGray: '#E0E0E0',
  textGray: '#757575',
  white: '#FFFFFF',
  inputBg: '#F8F9FA', // Slightly lighter gray for input
};

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
      withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })),
      -1,
      true
    );
    glow.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true);
  }, [glow, idle]);

  const containerStyle = useAnimatedStyle(() => {
    const pressScale = interpolate(press.value, [0, 1], [1, 0.97]);
    const idleScale = interpolate(idle.value, [0, 1], [1, 1.015]);
    const scale = pressScale * idleScale;

    return {
      transform: [{ scale }],
      opacity: interpolate(press.value, [0, 1], [1, 0.92]),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(glow.value, [0, 1], [0.0, 0.22]),
    };
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.95}
      {...rest}
      onPressIn={(e) => {
        press.value = withSpring(1, { damping: 16, stiffness: 220 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        press.value = withSpring(0, { damping: 16, stiffness: 220 });
        onPressOut?.(e);
      }}
      style={[style, containerStyle]}
    >
      <Animated.View pointerEvents="none" style={[styles.buttonGlow, glowStyle]} />
      {children}
    </AnimatedTouchableOpacity>
  );
}

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const gotosignin = ():void => {
    router.push('/signin');
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.contentContainer}>
        
        {/* Title */}
        <Text style={styles.title}>Forgot Password?</Text>

        {/* Icon */}
        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.iconContainer}>
          <FontAwesome5 name="unlock-alt" size={60} color={COLORS.primary} />
        </Animated.View>

        {/* Description Text */}
        <Text style={styles.description}>
          Enter the email address associated with your account and we’ll send you a link to reset your password.
        </Text>

        {/* Email Input */}
        <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#BDBDBD" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#BDBDBD"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Animated.View>

        {/* Reset Button */}
        <BouncyTouchable
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </BouncyTouchable>

        {/* Back to Login */}
        <BouncyTouchable
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={styles.backButton}
          onPress={gotosignin}
        >
            <FontAwesome5 name="arrow-left" size={14} color={COLORS.textGray} style={{ marginRight: 8 }} />
            <Text style={styles.backButtonText}>Back to Login</Text>
        </BouncyTouchable>

      </Animated.View>
    </View>
  );
}

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
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: COLORS.textGray,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  resetButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: COLORS.textGray,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
