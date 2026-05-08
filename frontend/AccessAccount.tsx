import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API_BASE } from './constants/api';

type AccessAccountProps = {
  onAuthenticated: (payload: { accessToken: string; role: string; email: string; adminId: string; adminFirstName: string; adminLastName: string }) => void;
};

export default function AccessAccount({ onAuthenticated }: AccessAccountProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const titleScaleAnim = useRef(new Animated.Value(0.9)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleScaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(formFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim, logoRotateAnim, titleScaleAnim, formFadeAnim]);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE}/logs/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          Array.isArray(data?.error)
            ? data.error[0]?.msg || 'Login failed.'
            : data?.error || 'Login failed.';
        throw new Error(message);
      }

      if (data?.role !== 'admin') {
        throw new Error('This account does not have the admin role.');
      }

      const session = {
        accessToken: data.accessToken,
        role: data.role,
        email: trimmedEmail,
        adminId: String(data.id || '').trim(),
        adminFirstName: String(data.first_name || '').trim(),
        adminLastName: String(data.last_name || '').trim(),
      };

      setSuccess('Login successful. Opening the dashboard...');
      onAuthenticated(session);
    } catch (loginError: unknown) {
      setError(loginError instanceof Error ? loginError.message : 'Login error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                  {
                    scale: scaleAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Animated.Image
                source={require('./admin.png')}
                style={[
                  styles.logo,
                  {
                    transform: [
                      {
                        rotate: logoRotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['-15deg', '0deg'],
                        }),
                      },
                      {
                        scale: logoRotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1],
                        }),
                      },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </View>

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Admin access</Text>
            </View>

            <Animated.Text
              style={[
                styles.title,
                {
                  transform: [
                    {
                      scale: titleScaleAnim,
                    },
                  ],
                },
              ]}
            >
              Welcome to the admin area
            </Animated.Text>
            <Text style={styles.subtitle}>
              Sign in with an existing admin account to open the dashboard.
            </Text>

            <Animated.View
              style={[
                styles.formBlock,
                {
                  opacity: formFadeAnim,
                  transform: [
                    {
                      translateY: formFadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.label}>Admin email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="admin@example.com"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                style={styles.input}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              {success ? <Text style={styles.successText}>{success}</Text> : null}

              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Enter dashboard'}</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  flex: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  blobOne: {
    width: 300,
    height: 300,
    backgroundColor: '#173f7a',
    top: -100,
    right: -80,
  },
  blobTwo: {
    width: 280,
    height: 280,
    backgroundColor: '#173f7a',
    left: -100,
    bottom: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 36,
    justifyContent: 'center',
    gap: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 36,
    justifyContent: 'center',
    gap: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#173f7a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  heroBadge: {
    alignSelf: 'center',
    backgroundColor: '#e8f1ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 20,
  },
  heroBadgeText: {
    color: '#173f7a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#173f7a',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
    textAlign: 'center',
  },
  formBlock: {
    gap: 10,
  },
  label: {
    color: '#173f7a',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    color: '#111827',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 15,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#173f7a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#173f7a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  errorText: {
    color: '#dc2626',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  successText: {
    color: '#059669',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
});