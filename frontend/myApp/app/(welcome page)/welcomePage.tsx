import React, { useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get('window');

// Colors
const COLORS = {
  primary: '#1E1B6B', // Deep Indigo/Blue
  secondary: '#FFD700', // Gold/Yellow
  cardBgLight: '#F8FAFC', // Very light blue/gray
  cardBgDark: '#2E2E8B', // Dark blue card bg
  beige: '#FFFBEB', // Beige bottom card
  textDark: '#1E293B',
  textLight: '#FFFFFF',
  textGray: '#475569',
  white: '#FFFFFF',
};

// Reusable Components
const SectionTitle = ({ title, subtitle, align = 'center', color = COLORS.textDark }: { title: string, subtitle?: string, align?: 'left' | 'center' | 'auto', color?: string }) => (
  <View style={[styles.sectionTitleContainer, { alignItems: align === 'center' ? 'center' : 'flex-start' }]}>
    <Text style={[styles.sectionTitle, { textAlign: align === 'auto' ? 'left' : align, color }]}>{title}</Text>
    {subtitle && <Text style={[styles.sectionSubtitle, { textAlign: align === 'auto' ? 'left' : align, color: color === '#FFFFFF' ? '#E0E0E0' : COLORS.textGray }]}>{subtitle}</Text>}
  </View>
);

const FeatureCard = ({ icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => (
  <FeatureCardInner icon={icon} title={title} description={description} index={index} />
);

function FeatureCardInner({
  icon,
  title,
  description,
  index,
}: {
  icon: any;
  title: string;
  description: string;
  index: number;
}) {
  const floatY = useSharedValue(0);
  const breathe = useSharedValue(1);

  useEffect(() => {
    floatY.value = withDelay(
      index * 180,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );

    breathe.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(1.01, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
  }, [breathe, floatY, index]);
  
  const router = useRouter();

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: breathe.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 200).springify()}
      style={[styles.card, animatedCardStyle]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
    </Animated.View>
  );
}

const CheckItem = ({ text, index }: { text: string, index: number }) => {
  const bounce = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    bounce.value = withDelay(
      400 + index * 120,
      withRepeat(
        withSequence(
          withTiming(1.12, { duration: 420, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 620, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );

    rotate.value = withDelay(
      450 + index * 120,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 520, easing: Easing.inOut(Easing.sin) }),
          withTiming(8, { duration: 520, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 520, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [bounce, index, rotate]);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: bounce.value }],
  }));

  return (
    <Animated.View entering={FadeInRight.delay(index * 100)} style={styles.checkItem}>
      <View style={styles.checkIconContainer}>
        <Animated.View style={iconAnim}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
        </Animated.View>
      </View>
      <Text style={styles.checkText}>{text}</Text>
    </Animated.View>
  );
};

export default function WelcomePage() {
  const scrollY = useSharedValue(0);

  const logoFloat = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const logoRotate = useSharedValue(0);

  const hatFloat = useSharedValue(0);
  const headerWavePulse = useSharedValue(1);

  const ctaPulse = useSharedValue(1);
  const featuresBreathe = useSharedValue(1);
  const ctaFloat = useSharedValue(0);
  const primaryShimmerX = useSharedValue(-1);
  const secondaryShimmerX = useSharedValue(-1);
  const headerShimmerX = useSharedValue(-1);
  const heroBreathe = useSharedValue(1);
  const featuresBlobX = useSharedValue(-1);
  const ctaBlobX = useSharedValue(-1);
  const introPulse = useSharedValue(1);
  const footerFloat = useSharedValue(0);

  useEffect(() => {
    logoFloat.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    logoRotate.value = withRepeat(
      withSequence(
        withTiming(-1.5, { duration: 650, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.5, { duration: 650, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 650, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    hatFloat.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    headerWavePulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    ctaPulse.value = withRepeat(
      withDelay(
        900,
        withSequence(
          withTiming(1.03, { duration: 700, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) })
        )
      ),
      -1,
      true
    );

    featuresBreathe.value = withRepeat(
      withSequence(
        withTiming(1.01, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    ctaFloat.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    primaryShimmerX.value = withRepeat(
      withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
    secondaryShimmerX.value = withDelay(
      250,
      withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        -1,
        false
      )
    );

    headerShimmerX.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );

    heroBreathe.value = withRepeat(
      withSequence(
        withTiming(1.015, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    featuresBlobX.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    ctaBlobX.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    introPulse.value = withRepeat(
      withSequence(
        withTiming(0.92, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    footerFloat.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [
    ctaFloat,
    ctaPulse,
    ctaBlobX,
    featuresBreathe,
    featuresBlobX,
    hatFloat,
    headerShimmerX,
    headerWavePulse,
    heroBreathe,
    introPulse,
    logoFloat,
    logoRotate,
    logoScale,
    footerFloat,
    primaryShimmerX,
    secondaryShimmerX,
  ]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedLogoStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scrollY.value, [0, 220], [0, -10], Extrapolation.CLAMP);
    const translateYParallax = interpolate(scrollY.value, [0, 220], [0, -8], Extrapolation.CLAMP);
    return {
    transform: [
      { translateX },
      { translateY: logoFloat.value + translateYParallax },
      { rotate: `${logoRotate.value}deg` },
      { scale: logoScale.value },
    ],
    };
  });

  const animatedHatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hatFloat.value }],
  }));

  const animatedHeaderWaveStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(scrollY.value, [0, 260], [0, 14], Extrapolation.CLAMP),
      },
      {
        translateY: interpolate(scrollY.value, [0, 260], [0, -10], Extrapolation.CLAMP),
      },
      { scale: headerWavePulse.value },
    ],
  }));

  const animatedCtaButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaPulse.value }],
  }));

  const animatedHeroParallax = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 220], [0, -18], Extrapolation.CLAMP),
      },
    ],
  }));

  const animatedFeaturesCard = useAnimatedStyle(() => ({
    transform: [{ scale: featuresBreathe.value }],
  }));

  const animatedCtaCard = useAnimatedStyle(() => ({
    transform: [{ translateY: ctaFloat.value }],
  }));

  const animatedPrimaryShimmer = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(primaryShimmerX.value, [-1, 1], [-220, 220]),
      },
    ],
    opacity: 0.12,
  }));

  const animatedSecondaryShimmer = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(secondaryShimmerX.value, [-1, 1], [-220, 220]),
      },
    ],
    opacity: 0.08,
  }));

  const animatedHeaderShimmer = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(headerShimmerX.value, [-1, 1], [-260, 260]),
      },
      { rotate: '-12deg' },
    ],
    opacity: 0.10,
  }));

  const animatedHeroTitle = useAnimatedStyle(() => ({
    transform: [{ scale: heroBreathe.value }],
  }));

  const animatedFeaturesBlob = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(featuresBlobX.value, [-1, 1], [-90, 90]),
      },
    ],
    opacity: 0.18,
  }));

  const animatedCtaBlob = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(ctaBlobX.value, [-1, 1], [-110, 110]),
      },
    ],
    opacity: 0.10,
  }));

  const animatedIntro = useAnimatedStyle(() => ({
    opacity: introPulse.value,
  }));

  const animatedFooter = useAnimatedStyle(() => ({
    transform: [{ translateY: footerFloat.value }],
  }));

   const router = useRouter();
   
   const gotosignin = ():void => {
    router.push('/signin');
   }

   const gotosignup = ():void => {
    router.push('/signup');
   }

   //useEffect(() => {
  //const checkAuth = async () => {
    //try {
      //const token = await SecureStore.getItemAsync("accessToken");
      

      //if (!token) {
        /*router.replace("/signin");*/
        //return;
      //}
      //if (role === "teacher") {
        //router.replace("/(teacher_space)/teacherSpace");
      //} else {
        //router.replace("/(student_space)/studentSpace");
      //}

    //} catch (err) {
      /*router.replace("/signin") */
      //console.error("error!!!") ; 
    //}
  //};

  //checkAuth();
//}, []);*/

useEffect(() => {
  const checkAuth = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      fetch(`${BASE_URL}/switchAccount`, {
        method: "GET",
        headers: { "content-type": "application/json", "authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.succ) {
          if (data.role === "teacher") router.replace("/(teacher_space)/teacherSpace");
          if (data.role === "student") router.replace("/(student_space)/studentSpace");
        } else if (data.error === "Token expired!") {
          fetch(`${BASE_URL}/teacher/refresh`, { 
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ refreshToken })
          })
          .then(res => res.json())
          .then(data => {
            if (data.accessToken) {
              SecureStore.setItemAsync("accessToken", data.accessToken);
              fetch(`${BASE_URL}/switchAccount`, {
                method: "GET",
                headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` }
              })
              .then(res => res.json())
              .then(data => {
                if (data.succ) {
                  if (data.role === "teacher") router.replace("/(teacher_space)/teacherSpace");
                  if (data.role === "student") router.replace("/(student_space)/studentSpace");
                } else {
                  //router.replace("/signin");
                }
              });
            } else {
              //router.replace("/signin");
            }
          });
        } else {
          //router.replace("/signin");
        }
      });
    } catch (err) {
      //router.replace("/signin");
    }
  };

  checkAuth();
}, []); 


  return (
    <View style={styles.mainContainer}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        nestedScrollEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Animated.View style={[styles.headerWave, animatedHeaderWaveStyle]} />
          <Animated.View pointerEvents="none" style={[styles.headerShimmer, animatedHeaderShimmer]} />

          {/* White top-right curve overlay for Logo */}
          <View style={styles.topRightCurveContainer}>
            <View style={styles.topRightCurve} />
            <Animated.Image
              entering={FadeInRight.duration(600)}
              source={require('../../assets/images/Logo_nobg.png')}
              style={[styles.logo, animatedLogoStyle]}
              resizeMode="contain"
            />
          </View>

          <SafeAreaView edges={['top']} style={styles.headerContent}>
            
            <Animated.View
              entering={FadeInUp.duration(800).springify()}
              style={[styles.heroContent, animatedHeroParallax]}
            >
              <Animated.View style={[styles.hatIconContainer, animatedHatStyle]}>
                <FontAwesome5 name="graduation-cap" size={42} color={COLORS.secondary} />
              </Animated.View>
              <Animated.Text style={[styles.heroTitle, animatedHeroTitle]}>
                Learn Smarter{'\n'}with ALEMNI Online
              </Animated.Text>
            </Animated.View>
          </SafeAreaView>
        </View>

        <View style={styles.contentContainer}>
          {/* Introduction */}
          <Animated.View entering={FadeInDown.duration(800).delay(200)}>
            <Animated.Text style={[styles.introText, animatedIntro]}>
              The platform that connects teachers, students, and parents — empowering better education through quality courses, progress tracking, and seamless collaboration.
            </Animated.Text>
            
            <View style={styles.buttonRow}>
              <Animated.View entering={FadeInUp.delay(200).duration(650)}>
                <TouchableOpacity style={styles.primaryButton} onPress={gotosignin}>
                  <Animated.View pointerEvents="none" style={[styles.buttonShimmer, animatedPrimaryShimmer]} />
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(320).duration(650)}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(welcome page)/LearnMorePage')}>
                  <Animated.View pointerEvents="none" style={[styles.buttonShimmer, animatedSecondaryShimmer]} />
                  <Text style={styles.secondaryButtonText}>Learn More</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Who Is It For? */}
          <View style={styles.section}>
            <SectionTitle 
              title="Who Is It For?" 
              subtitle="ALEMNI Online serves everyone in the learning journey"
              align="left"
            />
            
            <FeatureCard 
              index={0}
              icon={<FontAwesome5 name="user-graduate" size={28} color="#D97706" />}
              title="Students" 
              description="Access quality courses from verified teachers, track your progress, and improve your academic performance across multiple subjects."
            />
            
            <FeatureCard 
              index={1}
              icon={<FontAwesome5 name="chalkboard-teacher" size={28} color="#D97706" />}
              title="Teachers" 
              description="Create and manage your courses, schedule sessions, share resources, and track student progress — all from one easy-to-use dashboard."
            />

            <FeatureCard 
              index={2}
              icon={<FontAwesome5 name="users" size={28} color="#D97706" />}
              title="Parents" 
              description="Monitor your children's learning progress, manage their accounts, and stay involved in their education — even for young kids."
            />
          </View>

          {/* Platform Features - Dark Blue Card */}
          <Animated.View 
            entering={FadeInDown.duration(800).delay(400)}
            style={[styles.featuresCard, animatedFeaturesCard]}
          >
            <Animated.View pointerEvents="none" style={[styles.featuresBlob, animatedFeaturesBlob]} />
            <Text style={styles.featuresTitle}>Platform Features</Text>
            <Text style={styles.featuresSubtitle}>Everything you need for a better learning experience</Text>
            
            <View style={styles.featuresList}>
              <CheckItem text="Quality courses from verified teachers" index={0} />
              <CheckItem text="Progress tracking for every student" index={1} />
              <CheckItem text="Parent-child account linking" index={2} />
              <CheckItem text="Multiple subjects available" index={3} />
              <CheckItem text="Secure and trusted platform" index={4} />
              <CheckItem text="Easy-to-use interface for all ages" index={5} />
            </View>
          </Animated.View>

          {/* Ready to Start - Beige Card */}
          <Animated.View 
            entering={FadeInDown.duration(800).delay(600)}
            style={[styles.ctaCard, animatedCtaCard]}
          >
            <Animated.View pointerEvents="none" style={[styles.ctaBlob, animatedCtaBlob]} />
            <Text style={styles.ctaTitle}>Ready to Start Learning?</Text>
            <Text style={styles.ctaText}>
              Join thousands of students, teachers, and parents on ALEMNI Online. Create your free account today and take the first step towards smarter learning.
            </Text>
            <Animated.View style={animatedCtaButtonStyle}>
              <TouchableOpacity style={styles.ctaButton} onPress={gotosignup}>
                <Text style={styles.ctaButtonText}>Create Your Account</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, animatedFooter]}>
            <Text style={styles.footerBrand}>ALEMNI Online</Text>
            <Text style={styles.footerText}>
              Empowering education by connecting teachers, students, and parents on one trusted platform.
            </Text>
            <Text style={styles.copyright}>ALEMNI Online 2026 ©</Text>
          </Animated.View>

        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 40,
    borderBottomRightRadius: 70,
    position: 'relative',
    overflow: 'hidden',
  },
  headerWave: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 240,
    height: 220,
    backgroundColor: '#2E2E8B',
    borderBottomLeftRadius: 240,
    borderTopLeftRadius: 120,
    opacity: 0.35,
  },
  topRightCurveContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 240,
    height: 130,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  topRightCurve: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 165,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  logo: {
    width: 240,
    height: 130,
    marginTop: 13,
    marginRight: 12,
    zIndex: 2,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 76, // Space for the bigger top right cutout
    paddingBottom: 20
  },
  headerShimmer: {
    position: 'absolute',
    top: 30,
    left: -80,
    width: 90,
    height: 220,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 60,
  },
  heroContent: {
    marginTop: 20,
  },
  hatIconContainer: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 42,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  introText: {
    fontSize: 16,
    color: COLORS.textGray,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 48,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3730A3', // Slightly lighter indigo for button
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: 190,
    shadowColor: '#3730A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    width: 190,
    overflow: 'hidden',
  },
  buttonShimmer: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 80,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 40,
  },
  secondaryButtonText: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.textGray,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.cardBgLight,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    // optional styling for icon container
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardDescription: {
    fontSize: 15,
    color: COLORS.textGray,
    lineHeight: 22,
  },
  featuresCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 32,
    marginBottom: 48,
    overflow: 'hidden',
  },
  featuresBlob: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 220,
    height: 220,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 220,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featuresSubtitle: {
    fontSize: 16,
    color: '#E0E7FF', // Light indigo text
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 24, 
    fontWeight: '500',
  },
  ctaCard: {
    backgroundColor: COLORS.beige, 
    borderRadius: 24,
    padding: 32,
    marginBottom: 48,
    overflow: 'hidden',
  },
  ctaBlob: {
    position: 'absolute',
    top: -60,
    left: -80,
    width: 260,
    height: 260,
    backgroundColor: 'rgba(30,27,107,1)',
    borderRadius: 260,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  ctaText: {
    fontSize: 16,
    color: COLORS.textGray,
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaButton: {
    backgroundColor: '#3730A3',
    paddingVertical: 16,
    borderRadius: 30,
    width: 220,
    alignItems: 'center',
    shadowColor: '#3730A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  footerBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  copyright: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});