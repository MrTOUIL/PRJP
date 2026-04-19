import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/api';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const OTP_INPUT_SIZE = Math.min(46, (width - 72) / 6);

// Colors based on screenshots
const COLORS = {
  primary: '#0A1142', // Deep Dark Blue header bg
  primaryLight: '#1E2A78', // Lighter blue for gradient
  accent: '#FFC805', // Use FFC805 for closer match to screenshot yellow
  error: '#EF4444',
  background: '#F4F6F9', // Light gray background body
  white: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  border: '#E5E7EB',
  inputBg: '#F9FAFB',
  blueInfo: '#E0F2FE', // Light blue for info box
  blueInfoText: '#0369A1',
};

export default function VerifyCodepw() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading1 , setLoading1] = useState(false) ;
  const [loading2 , setLoading2] = useState(false) ;  
  const [msg , setMsg] = useState("") ;
  const spinnerRotate = useSharedValue(0);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  // Spinner rotation
  spinnerRotate.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinnerRotate.value}deg` }],
    };
  });


  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Ideally, focus next input logic here
  };

  const goBack = () => {
    router.back();
  };

    
  const handleResend = async ():Promise<void> => {
     setMsg("") ;
     setLoading1(true) ;
     fetch(`${BASE_URL}/logs/resend_code_forgetpw`,{
        method:"PUT",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({email})
     })
     .then(res => res.json())
     .then(data => {
       setLoading1(false) ;
       if (data.error){
        setMsg("Error in resending code!") ;
       }else{
        setMsg("the code is resend to your mail!") ;
       }
     })
  }

  const handleVerify = async():Promise<void> => {
    setMsg("") ; 
    setLoading2(true) ;
    fetch(`${BASE_URL}/logs/verify_code_forgetpw`,{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({code:Number(otp.join(""))})
    })
    .then(res => res.json())
    .then(data => {
        setLoading2(false) ;
        if (data.error){
            setMsg(data.error) ; 
        }else{
            router.push({
              pathname:"/(signin)/ResetPassword",
              params:{email}
            }) ; 
        }
    })
  }

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
            <Text style={styles.headerTitle}>Forgot Password?</Text>
          </View>
        </SafeAreaView>
         {/* Decorative circle overlay */}
         <View style={styles.headerCircle} />
      </LinearGradient>
      
      {/* Floating Lock Icon */}
      <View style={styles.lockIconWrapper}>
        <View style={styles.lockIconContainer}>
          <FontAwesome5 name="shield-alt" size={32} color="white" />
        </View>
      </View>
    </View>
  );

  const renderOtpStep = () => (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons name="email" size={24} color={COLORS.primary} />
        </View>
         <Text style={styles.infoText}>
          We sent a <Text style={{fontWeight: '700'}}>6-digit code</Text> to <Text style={{fontWeight: '700'}}>your email</Text>. Enter it below before it expires in 10 minutes.
        </Text>
      </View>

      {/* Input Card */}
      <View style={styles.inputCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: COLORS.primary }]}>
            <FontAwesome5 name="check-square" size={20} color="white" />
          </View>
          <View style={styles.cardHeaderTextContainer}>
            <Text style={styles.cardTitle}>Verification Code</Text>
            <Text style={styles.cardSubtitle}>6-digit code from your inbox</Text>
          </View>
        </View>

        <Text style={styles.label}>Enter Code <Text style={styles.required}>*</Text></Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        
      </View>

      {/*the message "msg" section*/}
      <Animated.View entering={FadeInDown.duration(400).springify()}>
        <Text style={styles.messageText}>{msg}</Text>
      </Animated.View>

       {/* Resend Link */}
       <TouchableOpacity style={styles.resendContainer} activeOpacity={0.7} >
        <Text style={styles.resendText}>Didn't receive the code? <Text style={styles.resendLink} onPress={handleResend}>Resend Code</Text></Text>
      </TouchableOpacity>

      {/*the spinner for loading1 (resend)*/}
      {loading1 && (
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={[styles.spinner, animatedSpinnerStyle]}
        />
      )}

      {/* Verify Button */}
      <TouchableOpacity style={styles.submitButton} activeOpacity={0.9} onPress={handleVerify}>
        <Text style={styles.submitButtonText}>Verify Code</Text>
        <FontAwesome5 name="arrow-right" size={16} color="white" />
      </TouchableOpacity>

      {/*the spinner for loading2 (verify)*/}
      {loading2 && (
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={[styles.spinner, animatedSpinnerStyle]}
        />
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.spacer} />
            {renderOtpStep()}
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => router.push('/signin')}>
                    <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
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
    height: 220, 
    width: '100%',
    marginBottom: 40, 
    position: 'relative',
    zIndex: 1, // Ensure header is above content but below modal overlays if any
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
    paddingTop: Platform.OS === 'android' ? 40 : 20, // Adjust for status bar
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
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  lockIconWrapper: {
    position: 'absolute',
    bottom: -35,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  lockIconContainer: {
      width: 70,
      height: 70,
      borderRadius: 20,
      backgroundColor: COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: COLORS.white,
      shadowColor: "#000",
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
  infoCard: {
      flexDirection: 'row',
      backgroundColor: COLORS.blueInfo, 
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      alignItems: 'flex-start', // Top align items for multiline text
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  infoIconContainer: {
      marginRight: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primary, // Dark circle behind icon
      alignItems: 'center',
      justifyContent: 'center',
  },
  infoText: {
      flex: 1,
      color: COLORS.primary,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 2, // optical alignment with icon
  },
  inputCard: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      // Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
  },
  cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
  },
  cardHeaderTextContainer: {
      flex: 1,
  },
  cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginBottom: 2,
  },
  cardSubtitle: {
      fontSize: 12,
      color: COLORS.textLight,
  },
  label: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.primary,
      marginBottom: 8,
  },
  required: {
      color: COLORS.error || '#EF4444',
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.inputBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
      height: 50,
      paddingHorizontal: 16,
  },
  input: {
      flex: 1,
      fontSize: 14,
      color: COLORS.text,
      height: '100%',
  },
  inputIcon: {
      marginRight: 10,
  },
  submitButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 12,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
      // Shadow
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
  },
  submitButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      marginRight: 8,
  },
  
  // OTP Styles
  otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 10,
      paddingHorizontal: 2,
  },
  otpInput: {
      width: OTP_INPUT_SIZE,
      height: OTP_INPUT_SIZE,
      marginHorizontal: 2,
      backgroundColor: COLORS.inputBg,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.text,
  },
  timerContainer: {
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
  },
  timerText: {
      color: COLORS.textLight,
      fontSize: 14,
  },
  resendContainer: {
      alignItems: 'center',
      marginBottom: 24,
  },
  resendText: {
      color: COLORS.textLight,
      fontSize: 14,
  },
  resendLink: {
      color: COLORS.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      marginLeft: 4,
  },
  
  // Footer
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
  messageText: {
    color: COLORS.accent,
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: COLORS.accent,
    borderTopColor: 'transparent',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});