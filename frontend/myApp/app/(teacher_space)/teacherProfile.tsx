
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/api';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FontAwesome5, Ionicons, MaterialIcons, Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Reusing theme colors from Teacher Space
const COLORS = {
  primary: '#1A1A5E', // Deep Blue / Purple from header
  secondary: '#FFD700', // Yellow accent
  background: '#F5F6FA', // Light Gray background
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  green: '#00C853',
  red: '#FF3D00',
  lightBlue: '#E3F2FD',
  lightGray: '#F5F5F5',
};

const WILAYAS = [
  'ADRAR', 'CHLEF', 'LAGHOUAT', 'OUM EL BOUAGHI', 'BATNA', 'BEJAIA', 'BISKRA',
  'BECHAR', 'BLIDA', 'BOUIRA', 'TAMANRASSET', 'TEBESSA', 'TLEMCEN', 'TIARET',
  'TIZI OUZOU', 'ALGER', 'DJELFA', 'JIJEL', 'SETIF', 'SAIDA', 'SKIKDA',
  'SIDI BEL ABBES', 'ANNABA', 'GUELMA', 'CONSTANTINE', 'MEDEA', 'MOSTAGANEM',
  'MSILA', 'MASCARA', 'OUARGLA', 'ORAN', 'EL BAYADH', 'ILLIZI',
  'BORDJ BOU ARRERIDJ', 'BOUMERDES', 'EL TARF', 'TINDOUF', 'TISSEMSILT',
  'EL OUED', 'KHENCHELA', 'SOUK AHRAS', 'TIPAZA', 'MILA', 'AIN DEFLA', 'NAAMA',
  'AIN TEMOUCHENT', 'GHARDAIA', 'RELIZANE', "EL M'GHAIR", 'EL MENIA',
  'OULED DJELLAL', 'BORDJ BADJI MOKHTAR', 'BENI ABBES', 'TIMIMOUN', 'TOUGGOURT',
  'DJANET', 'IN SALAH', 'IN GUEZZAM'
];

const SUBJECTS = ['math', 'physics', 'science', 'arab', 'history/goe', 'islamic', 'francais', 'english'];
const LEVELS = ['Primary', 'Middle', 'High School', 'University'];
const MODES = ['presential', 'online', 'hybrid'];
const VISIT_OPTIONS = ['YES', 'NO'];
const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

const { width } = Dimensions.get('window');

// Reusable Components
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const InfoRow = ({ icon, label, value, showArrow = true, type = 'info', onPress }: { icon: any, label: string, value: string, showArrow?: boolean, type?: 'info' | 'file', onPress?: () => void }) => (
  <TouchableOpacity style={styles.infoRow} activeOpacity={0.7} onPress={onPress}>
    <View style={[styles.infoIconContainer, { backgroundColor: type === 'file' ? '#FFF3E0' : '#F5F6FA' }]}>
      {icon}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
    {showArrow && (
       <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
    )}
    {type === 'file' && !showArrow && (
       <TouchableOpacity style={styles.downloadButton}>
         <Feather name="upload" size={16} color="#666" />
       </TouchableOpacity>
    )}
  </TouchableOpacity>
);

const DocumentRow = ({ title, subtitle, icon, color }: { title: string, subtitle: string, icon: any, color: string }) => (
    <View style={styles.documentRow}>
        <View style={[styles.docIconContainer, { backgroundColor: color + '20' }]}>
            {icon}
        </View>
        <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.docActionBtn}>
             <Feather name="upload" size={18} color="#999" />
        </TouchableOpacity>
    </View>
);

export default function TeacherProfile() {
  const router = useRouter();


  const [teacher , setTeacher] = useState({}) ;
  const [loading , setLoading ] = useState(false) ;
  const [msg , setMsg] = useState("") ;
  const [message , setMessage] = useState("") ; 
  const [editfullname , setEditfullname] = useState(false) ;
  const [editedfirstname , setEditedfirstname] = useState("") ; 
  const [editedlastname , setEditedlastname] = useState("") ; 
  const [editaddress, setEditaddress] = useState(false);
  const [editedaddress, setEditedaddress] = useState('');
  const [showWilayaList, setShowWilayaList] = useState(false);
  const [addressMessage, setAddressMessage] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [editsubject, setEditsubject] = useState(false);
  const [editedsubject, setEditedsubject] = useState('');
  const [showSubjectList, setShowSubjectList] = useState(false);
  const [subjectMessage, setSubjectMessage] = useState('');
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [editlevel, setEditlevel] = useState(false);
  const [editedlevel, setEditedlevel] = useState('');
  const [showLevelList, setShowLevelList] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [loadingLevel, setLoadingLevel] = useState(false);
  const [editmode, setEditmode] = useState(false);
  const [editedmode, setEditedmode] = useState('');
  const [showModeList, setShowModeList] = useState(false);
  const [modeMessage, setModeMessage] = useState('');
  const [loadingMode, setLoadingMode] = useState(false);
  const [editstart, setEditstart] = useState(false);
  const [editedstart, setEditedstart] = useState('');
  const [startMessage, setStartMessage] = useState('');
  const [loadingStart, setLoadingStart] = useState(false);
  const [editend, setEditend] = useState(false);
  const [editedend, setEditedend] = useState('');
  const [endMessage, setEndMessage] = useState('');
  const [loadingEnd, setLoadingEnd] = useState(false);
  const [editvisit, setEditvisit] = useState(false);
  const [editedvisit, setEditedvisit] = useState('');
  const [showVisitList, setShowVisitList] = useState(false);
  const [visitMessage, setVisitMessage] = useState('');
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [editdescription, setEditdescription] = useState(false);
  const [editeddescription, setEditeddescription] = useState('');
  const [descriptionMessage, setDescriptionMessage] = useState('');
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [editdays, setEditdays] = useState(false);
  const [editeddays, setEditeddays] = useState<string[]>([]);
  const [daysMessage, setDaysMessage] = useState('');
  const [loadingDays, setLoadingDays] = useState(false);

  useEffect(() => {
    const getTeacherInfo = async (): Promise<void> => {
        setLoading(true);
        setMsg('Loading profile...');
        try {
          const accessToken = await SecureStore.getItemAsync("accessToken");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
    
          fetch(`${BASE_URL}/teacher/getProfile`, {
            method: "GET",
            headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` }
          })
          .then(res => res.json())
          .then(data => {
            if (data.succ) {
              setTeacher(data.teacher);
              setLoading(false);
              setMsg('Profile loaded successfully.');
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
                  fetch(`${BASE_URL}/teacher/getProfile`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` }
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.succ) {
                      setTeacher(data.teacher);
                      setLoading(false);
                      setMsg('Profile loaded successfully.');
                    } else {
                      setLoading(false);
                      router.replace("/sign_in");
                    }
                  });
                } else {
                  // refresh token expired → force login
                  setLoading(false);
                  router.replace("/sign_in");
                }
              });
            } else {
              // "No token found!" or "Invalid token!" → force login
              setLoading(false);
              router.replace("/sign_in");
            }
          });
        } catch (err) {
          console.error(err);
          setLoading(false);
          setMsg('Unable to load profile.');
          router.replace("/sign_in");
        }
      };
    
      getTeacherInfo();
  },[]) ;
  
  // Animation for the avatar pulse
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const handleLogout = async():Promise<void> => {
  setLoading(true) ;
  setMsg("") ;
   try{
    await SecureStore.deleteItemAsync("accessToken") ; 
    await SecureStore.deleteItemAsync("refreshToken") ;
    setLoading(false) ; setMsg("") ;
    router.replace("/(welcome page)/welcomePage") ;
   }catch(e){
    setLoading(false) ; setMsg("Error in loging out!") ; 
   } 
    
  }



  const handleeditname = async():Promise<void> => {
    try{
      setMessage("") ;
      setLoading(true) ;
      const accessToken = await SecureStore.getItemAsync("accessToken") ; 
      const refreshToken = await SecureStore.getItemAsync("refreshToken") ; 
      fetch(`${BASE_URL}/teacher/editname`,{
        method:"PUT",
        headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` },
        body:JSON.stringify({first:editedfirstname , last:editedlastname})
      })
      .then(res => res.json())
      .then(data => {
        if (data.succ){
          router.replace("/sign_in") ;
        }
        else if (data.errors){setMessage("invalid inputs!")}
        else if (data.error === "Token expired!"){
          fetch(`${BASE_URL}/teacher/refresh`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ refreshToken })
          })
          .then(res => res.json())
          .then(data => {
            if (data.accessToken) {
                  SecureStore.setItemAsync("accessToken", data.accessToken);
                  fetch(`${BASE_URL}/teacher/editname`, {
                    method: "PUT",
                    headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` },
                    body:JSON.stringify({first:editedfirstname , last:editedlastname})
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.succ) {
                      router.replace("/sign_in") ; 
                    }else if (data.errors){setMessage("invalid inputs!")}
                    
                    else {
                      router.replace("/sign_in");
                    }
                  });
                } else {
                  // refresh token expired → force login
                  setLoading(false);
                  router.replace("/sign_in");
                }
          }) ;
        }else{
          router.replace("/sign_in") ; 
        }
      })
    }catch(e){
        router.replace("/sign_in") ;
    }finally{
      setEditedfirstname("") ; setEditedlastname("") ; setLoading(false) ; 
    }
  }

  const handleeditadress = async (): Promise<void> => {
    if (!editedaddress) {
      setAddressMessage('Please select your Wilaya.');
      return;
    }

    try {
      setAddressMessage('');
      setLoadingAddress(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editadress`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ adress: editedaddress })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setAddressMessage('Invalid input!');
      } else {
        setAddressMessage(data.error || 'Unable to update address.');
      }
    } catch (e) {
      setAddressMessage('Unable to update address.');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleeditsubject = async (): Promise<void> => {
    if (!editedsubject) {
      setSubjectMessage('Please select a subject.');
      return;
    }

    try {
      setSubjectMessage('');
      setLoadingSubject(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editsubject`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ subject: editedsubject })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setSubjectMessage('Invalid input!');
      } else {
        setSubjectMessage(data.error || 'Unable to update subject.');
      }
    } catch (e) {
      setSubjectMessage('Unable to update subject.');
    } finally {
      setLoadingSubject(false);
    }
  };

  const handleeditlevel = async (): Promise<void> => {
    if (!editedlevel) {
      setLevelMessage('Please select a level.');
      return;
    }

    try {
      setLevelMessage('');
      setLoadingLevel(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editlevel`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ levels: editedlevel })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setLevelMessage('Invalid input!');
      } else {
        setLevelMessage(data.error || 'Unable to update levels.');
      }
    } catch (e) {
      setLevelMessage('Unable to update levels.');
    } finally {
      setLoadingLevel(false);
    }
  };

  const handleeditmode = async (): Promise<void> => {
    if (!editedmode) {
      setModeMessage('Please select a mode.');
      return;
    }

    try {
      setModeMessage('');
      setLoadingMode(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editmode`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ mode: editedmode })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setModeMessage('Invalid input!');
      } else {
        setModeMessage(data.error || 'Unable to update mode.');
      }
    } catch (e) {
      setModeMessage('Unable to update mode.');
    } finally {
      setLoadingMode(false);
    }
  };

  const handleeditstart = async (): Promise<void> => {
    if (!editedstart.trim()) {
      setStartMessage('Please enter a start time.');
      return;
    }

    try {
      setStartMessage('');
      setLoadingStart(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editstart`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ start: editedstart.trim() })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setStartMessage('Invalid input!');
      } else {
        setStartMessage(data.error || 'Unable to update start time.');
      }
    } catch (e) {
      setStartMessage('Unable to update start time.');
    } finally {
      setLoadingStart(false);
    }
  };

  const handleeditend = async (): Promise<void> => {
    if (!editedend.trim()) {
      setEndMessage('Please enter an end time.');
      return;
    }

    try {
      setEndMessage('');
      setLoadingEnd(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editend`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ end: editedend.trim() })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setEndMessage('Invalid input!');
      } else {
        setEndMessage(data.error || 'Unable to update end time.');
      }
    } catch (e) {
      setEndMessage('Unable to update end time.');
    } finally {
      setLoadingEnd(false);
    }
  };

  const handleeditvisit = async (): Promise<void> => {
    if (!editedvisit) {
      setVisitMessage('Please select YES or NO.');
      return;
    }

    try {
      setVisitMessage('');
      setLoadingVisit(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editvisit`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ visit: editedvisit })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setVisitMessage('Invalid input!');
      } else {
        setVisitMessage(data.error || 'Unable to update home visits.');
      }
    } catch (e) {
      setVisitMessage('Unable to update home visits.');
    } finally {
      setLoadingVisit(false);
    }
  };

  const handleeditdescription = async (): Promise<void> => {
    if (!editeddescription.trim()) {
      setDescriptionMessage('Please enter a description.');
      return;
    }

    try {
      setDescriptionMessage('');
      setLoadingDescription(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editdescription`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ description: editeddescription.trim() })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setDescriptionMessage('Invalid input!');
      } else {
        setDescriptionMessage(data.error || 'Unable to update description.');
      }
    } catch (e) {
      setDescriptionMessage('Unable to update description.');
    } finally {
      setLoadingDescription(false);
    }
  };

  const toggleEditedDay = (day: string): void => {
    if (editeddays.includes(day)) {
      setEditeddays(editeddays.filter((d) => d !== day));
    } else {
      setEditeddays([...editeddays, day]);
    }
  };

  const handleeditdays = async (): Promise<void> => {
    if (!editeddays.length) {
      setDaysMessage('Please select at least one day.');
      return;
    }

    try {
      setDaysMessage('');
      setLoadingDays(true);
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      const requestEdit = async (token: string) => {
        const response = await fetch(`${BASE_URL}/teacher/editdays`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
          body: JSON.stringify({ days: editeddays })
        });
        return response.json();
      };

      if (!accessToken || !refreshToken) {
        router.replace('/sign_in');
        return;
      }

      let data = await requestEdit(accessToken);

      if (data.error === 'Token expired!') {
        const refreshResponse = await fetch(`${BASE_URL}/teacher/refresh`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshResponse.json();

        if (!refreshData.accessToken) {
          router.replace('/sign_in');
          return;
        }

        await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
        data = await requestEdit(refreshData.accessToken);
      }

      if (data.succ) {
        router.replace('/sign_in');
      } else if (data.errors) {
        setDaysMessage('Invalid input!');
      } else {
        setDaysMessage(data.error || 'Unable to update available days.');
      }
    } catch (e) {
      setDaysMessage('Unable to update available days.');
    } finally {
      setLoadingDays(false);
    }
  };

  // Mock Data - Update with real data from API if available
  /*const stats = [
    { id: 1, value: '18', label: 'SESSIONS', borderRight: true },
    { id: 2, value: '9', label: 'STUDENTS', borderRight: true },
    { id: 3, value: '3', label: 'SERVICES', borderRight: true },
    { id: 4, value: teacher?.rating || '0', label: 'RATING', borderRight: false },
  ];*/

  const availableDaysText = teacher?.available_days?.length
    ? teacher.available_days.join(' · ')
    : 'No availability set';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
           <SafeAreaView>
             <View style={styles.headerContent}>
                <Animated.View style={[styles.avatarWrapper, animatedPulseStyle]}>
                   <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{teacher?.first_name?.[0]?.toUpperCase()}</Text>
                   </View>
                   <View style={styles.onlineBadge}>
                      <Feather name="check" size={10} color="#FFF" />
                   </View>
                </Animated.View>
                
                <Text style={styles.nameText}>{teacher?.first_name} {teacher?.last_name}</Text>
                <Text style={styles.subtitleText}>{teacher?.role} · {teacher?.mode} · {teacher?.postal_adress}</Text>
                
                <View style={styles.tagsRow}>
                   {teacher?.school_levels_taught?.map((level, index) => (
                      <View key={index} style={styles.headerTag}>
                         <Text style={styles.headerTagText}>{level}</Text>
                      </View>
                   ))}
                   {teacher?.subject?.map((subj, index) => (
                      <View key={`subj-${index}`} style={styles.headerTag}>
                         <Text style={styles.headerTagText}>{subj}</Text>
                      </View>
                   ))}
                   <View style={styles.headerTag}>
                         <Text style={styles.headerTagText}>{teacher.status}</Text>
                    </View>
                </View>
             </View>
           </SafeAreaView>
        </View>

        

        {/* Content Sections */}
        <View style={styles.contentContainer}>
            {loading && (
              <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Loading" />
                <View style={styles.card}>
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                  </View>
                </View>
              </Animated.View>
            )}
            
            {/* Personal Information */}
            <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Personal Information" />
                <View style={styles.card}>
                   
                   <InfoRow  
                     icon={<Feather name="user" size={20} color={COLORS.primary} />}
                     label="FULL NAME"
                     value={`${teacher?.first_name || ''} ${teacher?.last_name || ''}`}
                     onPress={() => setEditfullname(true)}
                   />
                   

                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="mail" size={20} color={COLORS.primary} />}
                     label="EMAIL"
                     value={teacher?.email || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="phone" size={20} color={COLORS.primary} />}
                     label="PHONE"
                     value={teacher?.phone || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="map-pin" size={20} color={COLORS.primary} />}
                     label="ADDRESS / GEOLOCATION"
                     value={teacher?.postal_adress || 'N/A'}
                     onPress={() => {
                       setEditedaddress((teacher as any)?.postal_adress || '');
                       setAddressMessage('');
                       setShowWilayaList(false);
                       setEditaddress(true);
                     }}
                   />
                </View>
            </Animated.View>

            {/* Teaching Profile */}
            <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Teaching Profile" />
                <View style={styles.card}>
                   
                   <InfoRow 
                     icon={<Feather name="book-open" size={20} color={COLORS.primary} />}
                     label="EXPERTISE / SUBJECTS"
                     value={teacher?.subject?.join(', ') || 'N/A'}
                     onPress={() => {
                       setEditedsubject((teacher as any)?.subject?.[0] || '');
                       setSubjectMessage('');
                       setShowSubjectList(false);
                       setEditsubject(true);
                     }}
                   />
                   
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<FontAwesome5 name="graduation-cap" size={16} color={COLORS.primary} />}
                     label="LEVELS TAUGHT"
                     value={teacher?.school_levels_taught?.join(' · ') || 'N/A'}
                     onPress={() => {
                       setEditedlevel((teacher as any)?.school_levels_taught?.[0] || '');
                       setLevelMessage('');
                       setShowLevelList(false);
                       setEditlevel(true);
                     }}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="monitor" size={20} color={COLORS.primary} />}
                     label="TEACHING MODE"
                     value={teacher?.mode || 'N/A'}
                     onPress={() => {
                       setEditedmode((teacher as any)?.mode || '');
                       setModeMessage('');
                       setShowModeList(false);
                       setEditmode(true);
                     }}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="START TIME"
                     value={teacher?.start_time || 'N/A'}
                     onPress={() => {
                       setEditedstart((teacher as any)?.start_time || '');
                       setStartMessage('');
                       setEditstart(true);
                     }}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="END TIME"
                     value={teacher?.end_time || 'N/A'}
                     onPress={() => {
                       setEditedend((teacher as any)?.end_time || '');
                       setEndMessage('');
                       setEditend(true);
                     }}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="home" size={20} color={COLORS.primary} />}
                     label="NATURE"
                     value={teacher?.role || 'N/A'}
                   />
                   <View style={styles.divider} />
                   <InfoRow 
                     icon={<Feather name="clock" size={20} color={COLORS.primary} />}
                     label="HOME VISITS / DISPLACEMENT"
                     value={teacher?.home_visits ? `Yes – within ${teacher?.postal_adress}` : 'No'}
                     onPress={() => {
                       setEditedvisit((teacher as any)?.home_visits ? 'YES' : 'NO');
                       setVisitMessage('');
                       setShowVisitList(false);
                       setEditvisit(true);
                     }}
                   />
                </View>
            </Animated.View>

            {/* Pedagogical Description */}
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Pedagogical Description" />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setEditeddescription((teacher as any)?.bio || '');
                    setDescriptionMessage('');
                    setEditdescription(true);
                  }}
                >
                  <View style={[styles.card, {padding: 20}]}>
                      <Text style={styles.descriptionText}>
                        {teacher?.bio || 'No bio provided yet.'}
                      </Text>
                  </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Availability Summary */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.sectionContainer}>
                <SectionHeader title="Availability Summary" />
                <View style={styles.card}>
                   <InfoRow
                     icon={<Feather name="calendar" size={20} color={COLORS.primary} />}
                     label="AVAILABLE DAYS"
                     value={availableDaysText}
                     onPress={() => {
                       setEditeddays(Array.isArray((teacher as any)?.available_days) ? (teacher as any).available_days : []);
                       setDaysMessage('');
                       setEditdays(true);
                     }}
                   />
                </View>
            </Animated.View>
           
            {/* Log Out Button */}
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Feather name="log-out" size={20} color="#FF3D00" style={{marginRight: 10}} />
                  <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </Animated.View>

        </View>
      </ScrollView>

      {editfullname && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit full name</Text>
            <Text style={styles.fullNameSubtitle}>Update the teacher first and last name.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>First name</Text>
              <TextInput
                style={styles.fullNameInput}
                placeholder="Enter first name"
                placeholderTextColor="#A0A0A8"
                value={editedfirstname}
                onChangeText={(text: string) => setEditedfirstname(text)}
              />
            </View>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Last name</Text>
              <TextInput
                style={styles.fullNameInput}
                placeholder="Enter last name"
                placeholderTextColor="#A0A0A8"
                value={editedlastname}
                onChangeText={(text: string) => setEditedlastname(text)}
              />
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditfullname(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85}
                onPress={handleeditname}
              >
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!message && (
              <Text style={styles.editNameMessageText}>{message}</Text>
            )}
          </View>
        </View>
      )}

      {editaddress && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit postal address</Text>
            <Text style={styles.fullNameSubtitle}>Select your Wilaya from the list.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Postal address (Wilaya)</Text>
              <TouchableOpacity
                style={styles.selectWrapper}
                activeOpacity={0.8}
                onPress={() => setShowWilayaList(!showWilayaList)}
              >
                <View style={styles.inputIconWrap}>
                  <MaterialCommunityIcons name="map-marker-outline" size={20} color={COLORS.primary} />
                </View>
                <Text style={[styles.selectText, !editedaddress && styles.selectPlaceholder]}>
                  {editedaddress || 'Select Wilaya'}
                </Text>
                <Ionicons name={showWilayaList ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textLight} />
              </TouchableOpacity>

              {showWilayaList && (
                <View style={styles.wilayaListContainer}>
                  <ScrollView nestedScrollEnabled style={styles.wilayaList}>
                    {WILAYAS.map((wilaya) => (
                      <TouchableOpacity
                        key={wilaya}
                        style={[styles.wilayaItem, editedaddress === wilaya && styles.wilayaItemActive]}
                        onPress={() => {
                          setEditedaddress(wilaya);
                          setShowWilayaList(false);
                          setAddressMessage('');
                        }}
                      >
                        <Text style={[styles.wilayaItemText, editedaddress === wilaya && styles.wilayaItemTextActive]}>
                          {wilaya}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditaddress(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditadress}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingAddress && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!addressMessage && (
              <Text style={styles.editNameMessageText}>{addressMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editsubject && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit subject</Text>
            <Text style={styles.fullNameSubtitle}>Select your expertise subject from the list.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Subject</Text>
              <TouchableOpacity
                style={styles.selectWrapper}
                activeOpacity={0.8}
                onPress={() => setShowSubjectList(!showSubjectList)}
              >
                <View style={styles.inputIconWrap}>
                  <MaterialCommunityIcons name="book-open-page-variant" size={20} color={COLORS.primary} />
                </View>
                <Text style={[styles.selectText, !editedsubject && styles.selectPlaceholder]}>
                  {editedsubject || 'Select subject'}
                </Text>
                <Ionicons name={showSubjectList ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textLight} />
              </TouchableOpacity>

              {showSubjectList && (
                <View style={styles.wilayaListContainer}>
                  <ScrollView nestedScrollEnabled style={styles.wilayaList}>
                    {SUBJECTS.map((subj) => (
                      <TouchableOpacity
                        key={subj}
                        style={[styles.wilayaItem, editedsubject === subj && styles.wilayaItemActive]}
                        onPress={() => {
                          setEditedsubject(subj);
                          setShowSubjectList(false);
                          setSubjectMessage('');
                        }}
                      >
                        <Text style={[styles.wilayaItemText, editedsubject === subj && styles.wilayaItemTextActive]}>
                          {subj}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditsubject(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditsubject}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingSubject && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!subjectMessage && (
              <Text style={styles.editNameMessageText}>{subjectMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editlevel && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit levels taught</Text>
            <Text style={styles.fullNameSubtitle}>Select one level from the list.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Level taught</Text>
              <TouchableOpacity
                style={styles.selectWrapper}
                activeOpacity={0.8}
                onPress={() => setShowLevelList(!showLevelList)}
              >
                <View style={styles.inputIconWrap}>
                  <FontAwesome5 name="graduation-cap" size={16} color={COLORS.primary} />
                </View>
                <Text style={[styles.selectText, !editedlevel && styles.selectPlaceholder]}>
                  {editedlevel || 'Select level'}
                </Text>
                <Ionicons name={showLevelList ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textLight} />
              </TouchableOpacity>

              {showLevelList && (
                <View style={styles.wilayaListContainer}>
                  <ScrollView nestedScrollEnabled style={styles.wilayaList}>
                    {LEVELS.map((lvl) => (
                      <TouchableOpacity
                        key={lvl}
                        style={[styles.wilayaItem, editedlevel === lvl && styles.wilayaItemActive]}
                        onPress={() => {
                          setEditedlevel(lvl);
                          setShowLevelList(false);
                          setLevelMessage('');
                        }}
                      >
                        <Text style={[styles.wilayaItemText, editedlevel === lvl && styles.wilayaItemTextActive]}>
                          {lvl}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditlevel(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditlevel}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingLevel && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!levelMessage && (
              <Text style={styles.editNameMessageText}>{levelMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editmode && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit teaching mode</Text>
            <Text style={styles.fullNameSubtitle}>Select one mode from the list.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Teaching mode</Text>
              <TouchableOpacity
                style={styles.selectWrapper}
                activeOpacity={0.8}
                onPress={() => setShowModeList(!showModeList)}
              >
                <View style={styles.inputIconWrap}>
                  <Feather name="monitor" size={18} color={COLORS.primary} />
                </View>
                <Text style={[styles.selectText, !editedmode && styles.selectPlaceholder]}>
                  {editedmode || 'Select mode'}
                </Text>
                <Ionicons name={showModeList ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textLight} />
              </TouchableOpacity>

              {showModeList && (
                <View style={styles.wilayaListContainer}>
                  <ScrollView nestedScrollEnabled style={styles.wilayaList}>
                    {MODES.map((m) => (
                      <TouchableOpacity
                        key={m}
                        style={[styles.wilayaItem, editedmode === m && styles.wilayaItemActive]}
                        onPress={() => {
                          setEditedmode(m);
                          setShowModeList(false);
                          setModeMessage('');
                        }}
                      >
                        <Text style={[styles.wilayaItemText, editedmode === m && styles.wilayaItemTextActive]}>
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditmode(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditmode}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingMode && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!modeMessage && (
              <Text style={styles.editNameMessageText}>{modeMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editstart && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit start time</Text>
            <Text style={styles.fullNameSubtitle}>Enter the new start time manually.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Start time</Text>
              <TextInput
                style={styles.fullNameInput}
                placeholder="Enter start time"
                placeholderTextColor="#A0A0A8"
                value={editedstart}
                onChangeText={(text: string) => setEditedstart(text)}
              />
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditstart(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditstart}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingStart && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!startMessage && (
              <Text style={styles.editNameMessageText}>{startMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editend && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit end time</Text>
            <Text style={styles.fullNameSubtitle}>Enter the new end time manually.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>End time</Text>
              <TextInput
                style={styles.fullNameInput}
                placeholder="Enter end time"
                placeholderTextColor="#A0A0A8"
                value={editedend}
                onChangeText={(text: string) => setEditedend(text)}
              />
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditend(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditend}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingEnd && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!endMessage && (
              <Text style={styles.editNameMessageText}>{endMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editvisit && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit home visits</Text>
            <Text style={styles.fullNameSubtitle}>Choose whether home visits are available.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Home visits</Text>
              <TouchableOpacity
                style={styles.selectWrapper}
                activeOpacity={0.8}
                onPress={() => setShowVisitList(!showVisitList)}
              >
                <View style={styles.inputIconWrap}>
                  <Feather name="home" size={18} color={COLORS.primary} />
                </View>
                <Text style={[styles.selectText, !editedvisit && styles.selectPlaceholder]}>
                  {editedvisit || 'Select YES or NO'}
                </Text>
                <Ionicons name={showVisitList ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textLight} />
              </TouchableOpacity>

              {showVisitList && (
                <View style={styles.wilayaListContainer}>
                  <ScrollView nestedScrollEnabled style={styles.wilayaList}>
                    {VISIT_OPTIONS.map((visit) => (
                      <TouchableOpacity
                        key={visit}
                        style={[styles.wilayaItem, editedvisit === visit && styles.wilayaItemActive]}
                        onPress={() => {
                          setEditedvisit(visit);
                          setShowVisitList(false);
                          setVisitMessage('');
                        }}
                      >
                        <Text style={[styles.wilayaItemText, editedvisit === visit && styles.wilayaItemTextActive]}>
                          {visit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditvisit(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditvisit}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingVisit && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!visitMessage && (
              <Text style={styles.editNameMessageText}>{visitMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editdescription && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit description</Text>
            <Text style={styles.fullNameSubtitle}>Update your pedagogical bio manually.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Description</Text>
              <TextInput
                style={[styles.fullNameInput, styles.descriptionInput]}
                placeholder="Enter your pedagogical description"
                placeholderTextColor="#A0A0A8"
                multiline
                numberOfLines={4}
                value={editeddescription}
                onChangeText={(text: string) => setEditeddescription(text)}
              />
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditdescription(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditdescription}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingDescription && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!descriptionMessage && (
              <Text style={styles.editNameMessageText}>{descriptionMessage}</Text>
            )}
          </View>
        </View>
      )}

      {editdays && (
        <View style={styles.fullNameOverlay}>
          <View style={styles.fullNameCard}>
            <Text style={styles.fullNameTitle}>Edit available days</Text>
            <Text style={styles.fullNameSubtitle}>Select one or more days using the same signup style.</Text>

            <View style={styles.fullNameFieldGroup}>
              <Text style={styles.fullNameLabel}>Available days</Text>
              <View style={styles.daysPillsContainer}>
                {DAYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => {
                      toggleEditedDay(day);
                      setDaysMessage('');
                    }}
                    style={[
                      styles.dayPill,
                      editeddays.includes(day) && styles.dayPillActive
                    ]}
                  >
                    <Text style={[
                      styles.dayPillText,
                      editeddays.includes(day) && styles.dayPillTextActive
                    ]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fullNameActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditdays(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleeditdays}>
                <Text style={styles.submitButtonText}>Submit changes</Text>
              </TouchableOpacity>
            </View>

            {loadingDays && (
              <View style={styles.editNameLoadingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.editNameLoadingText}>Loading...</Text>
              </View>
            )}

            {!!daysMessage && (
              <Text style={styles.editNameMessageText}>{daysMessage}</Text>
            )}
          </View>
        </View>
      )}
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
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 50, // Space for stats bar overlap
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    width: width,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    marginBottom: 15,
    position: 'relative',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A5E',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    paddingVertical: 10,
  },
  subtitleText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  headerTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    marginBottom: 5,
  },
  headerTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: -30, // Negative margin to overlap header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 9,
    color: '#999',
    marginTop: 4,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  uploadLink: {
     fontSize: 12,
     color: COLORS.primary,
     fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 10, // Small label
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 70, // Align with text start
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  availabilityCard: {
    padding: 20,
    paddingHorizontal: 15,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  dayStatus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  docIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  docSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  docActionBtn: {
    padding: 5,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  logoutText: {
     color: '#FF3D00',
     fontSize: 16,
     fontWeight: 'bold',
  },
  fullNameOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 16, 32, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullNameCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  fullNameTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  fullNameSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#7A7A86',
  },
  fullNameFieldGroup: {
    marginTop: 16,
  },
  fullNameLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fullNameInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E3E6EE',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.textDark,
    backgroundColor: '#FBFCFF',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  daysPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayPillActive: {
    backgroundColor: '#E0E7FF',
    borderColor: COLORS.primary,
  },
  dayPillText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dayPillTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFCFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E6EE',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIconWrap: {
    marginRight: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  selectPlaceholder: {
    color: '#A0A0A8',
  },
  wilayaListContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  wilayaList: {
    maxHeight: 220,
  },
  wilayaItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  wilayaItemActive: {
    backgroundColor: '#E0E7FF',
  },
  wilayaItemText: {
    fontSize: 13,
    color: '#334155',
  },
  wilayaItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  fullNameActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5F6472',
  },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editNameLoadingRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editNameLoadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  editNameMessageText: {
    marginTop: 10,
    fontSize: 13,
    color: '#D14343',
    textAlign: 'center',
    fontWeight: '600',
  },
  downloadButton: {
     // Style for download button
  },
});
