import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading , setLoading] = useState(false) ;
  const [msg , setMsg] = useState("") ;  
  // Shared values for animations (similar to WelcomePage)
  const logoFloat = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const logoRotate = useSharedValue(0);
  const spinnerRotate = useSharedValue(0);

  useEffect(() => {
    // Floating animation
    logoFloat.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Breathing/Scale animation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
     
     // Subtle rotation
     logoRotate.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
           withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),

        ),
        -1,
        true
      );

      // Spinner rotation
      spinnerRotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: logoFloat.value },
        { scale: logoScale.value },
        { rotate: `${logoRotate.value}deg` } // Apply subtle rotation
      ],
    };
  });

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinnerRotate.value}deg` }],
    };
  });
  const router = useRouter();

   const gotosignup = ():void => {
    router.push('/signup');
   }

   const gotoforgetpassword = ():void => {
    router.push('/forgetpassword');

   }

   const handleEmail = (text:string):void => {
     setEmail(text) ;
   }

   const handlePassword = (text:string):void => {
    setPassword(text) ; 
   } 

   

   const handleLogin = ():void => {
    setLoading(true) ; 
    setMsg("") ; 
    setEmail("") ; setPassword("") ; 
    const BASE_URL = "https://localhost:5000"
    fetch(`${BASE_URL}/logs/login`,{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email,password})
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false) ; 
      if (data.error){
        setMsg("Error in entry or user does not exist") ;
      }else if (data.succ){
        if (data.role == "student" || data.role == "parent") router.push({pathname:"/(student_space)/studentSpace" , params:{id:data.id}}) ; 
        if (data.role == "teacher") router.push({
          pathname:"/(teacher_space)/teacherSpace" , 
          params:{id:data.id}
        });  
      }
    })
   }


  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Top Left Logo Circle Placeholder */}
            <Animated.View 
                entering={FadeInDown.delay(100).duration(600).springify()}
                style={styles.topLeftLogo}
            >
                <Text style={styles.topLeftLogoText}>ALEMNI</Text>
                <Text style={styles.topLeftLogoSubText}>Online</Text>
            </Animated.View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                
                {/* Center Title Logo */}
                <Animated.Text 
                    entering={FadeInDown.delay(200).duration(600).springify()}
                    style={styles.title}
                >
                    Sign in to ALEMNI
                </Animated.Text>
                
                <Animated.View 
                    entering={FadeInDown.delay(300).duration(600).springify()}
                    style={[styles.subLogoContainer, animatedLogoStyle]}
                >
                    <FontAwesome5 name="graduation-cap" size={40} color="#D4AF37" style={styles.gradCap} />
                    <Text style={styles.brandName}>ALEMNI <Text style={styles.brandNameGold}>Online</Text></Text>
                </Animated.View>

                {/* Social Buttons */}
                <Animated.View 
                    entering={FadeInDown.delay(400).duration(600).springify()}
                    style={styles.socialContainer}
                >
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome5 name="facebook-f" size={20} color="#3b5998" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <AntDesign name="google" size={20} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesome5 name="linkedin-in" size={20} color="#0077b5" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Divider */}
                <Animated.View 
                    entering={FadeInDown.delay(500).duration(600).springify()}
                    style={styles.dividerContainer}
                >
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR SIGN IN WITH EMAIL</Text>
                    <View style={styles.dividerLine} />
                </Animated.View>

                {/* Inputs */}
                <Animated.View 
                    entering={FadeInDown.delay(600).duration(600).springify()}
                    style={styles.inputContainer}
                >
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="email-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={handleEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={handlePassword}
                            secureTextEntry={true}
                        />
                    </View>
                </Animated.View>

                {/* Forgot Password */}
                <Animated.View entering={FadeInDown.delay(700).duration(600).springify()}>
                    <TouchableOpacity onPress={gotoforgetpassword}>
                        <Text style={styles.forgotPassword}>Forgot your password?</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/*the message "msg" space*/}
                 
                  <Animated.View entering={FadeInDown.duration(400).springify()}>
                    <Text style={styles.messageText}>{msg}</Text>
                  </Animated.View>
                

                {/* Sign In Button */}
                <Animated.View entering={FadeInDown.delay(800).duration(600).springify()}>
                    <TouchableOpacity
                      style={styles.signInButton}
                      onPress={handleLogin}
                    >
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/*the spinning that will be activated when loading = true*/}
                {loading && (
                  <Animated.View
                    entering={FadeInDown.duration(300).springify()}
                    style={[styles.spinner, animatedSpinnerStyle]}
                  />
                )}

                {/* Sign Up Link */}
                <Animated.View 
                    entering={FadeInUp.delay(900).duration(600).springify()}
                    style={styles.signUpContainer}
                >
                    <Text style={styles.noAccountText}>Don’t have an account? </Text>
                    <TouchableOpacity onPress={gotosignup}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    minHeight: '100%',
  },
  topLeftLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  topLeftLogoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#33307E',
  },
  topLeftLogoSubText: {
    fontSize: 6,
    color: '#333',
  },
  mainContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#33307E',
    marginBottom: 8,
  },
  subLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  gradCap: {
    marginRight: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#33307E',
  },
  brandNameGold: {
    color: '#D4AF37',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
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
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#444',
    fontSize: 14,
    marginBottom: 30,
  },
  messageText: {
    color: '#D4AF37',
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  signInButton: {
    backgroundColor: '#33307E',
    width: 220,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#33307E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#D4AF37',
    borderTopColor: 'transparent',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noAccountText: {
    color: '#666',
    fontSize: 14,
  },
  signUpText: {
    color: '#33307E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
