import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5, Ionicons, Octicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    withSequence,
    Easing,
    FadeInDown,
    FadeInUp,
    BounceIn,
    ZoomIn,
    AnimateProps
} from 'react-native-reanimated';
import { useEffect } from 'react';

// Animation Utilities
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const { width } = Dimensions.get('window');

// Mock Data matching the screenshot structure
const ALERTS = [
  {
    id: '1',
    type: 'critical',
    userType: 'Student',
    userId: '99-21-X',
    location: 'Algiers Node 4',
    status: 'COMPROMISED',
    logTitle: '[LOG #442] ILLEGAL SOLICITATION',
    logDesc: 'User attempted to purchase thesis writing services. Violation of Academic Integrity Code 4.',
    actions: [
      { label: 'History', icon: 'history', color: '#888' },
      { label: 'TERMINATE', icon: 'block', color: '#FF3B30' } // Red
    ],
    mainAction: { label: 'DISPATCH AUTHORITIES', icon: 'gavel', color: '#1E3A8A' } // Blue
  },
  {
    id: '2',
    type: 'watchlist',
    userType: 'Parent',
    userId: '44-11-A',
    location: 'Oran Node 1',
    status: 'WATCHLIST',
    logTitle: '[PATTERN DETECTION] SPAM ACTIVITY',
    logDesc: 'Rapid-fire posting detected (5 posts/60s). Account may be compromised or bot-driven.',
    actions: [
      { label: 'Logs', icon: 'file-text', color: '#888' },
      { label: 'FREEZE ACCT', icon: 'snowflake', color: '#FF3B30' }
    ],
    mainAction: { label: 'Report Suspicion', icon: 'flag', color: '#2C2C2E', textColor: '#888' } // Darker
  },
  {
    id: '3',
    type: 'verified',
    userType: 'Teacher',
    userId: '10-01-T',
    location: 'Constantine',
    status: 'VERIFIED',
    logTitle: '[CONTENT SCAN] CLEAN',
    logDesc: '"Offering advanced Python programming courses."',
    actions: [
      { label: 'Full Profile', icon: 'user', color: '#888' },
      { label: 'Approve Service', icon: 'check', color: '#888' }
    ],
    mainAction: null
  }
];


export default function AdminScreen() {
  const router = useRouter();
  
  // Animation hooks
  const livePulse = useSharedValue(1);
  const criticalPulse = useSharedValue(1);
  
  useEffect(() => {
    livePulse.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      true
    );
    
    criticalPulse.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 1500 }), withTiming(1, { duration: 1500 })),
      -1,
      true
    );
  }, []); // Run once on mount

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: livePulse.value,
  }));
  
  const criticalCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: criticalPulse.value }],
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPROMISED': return '#FF3B30';
      case 'WATCHLIST': return '#FF9500';
      case 'VERIFIED': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getCardBorderColor = (type: string) => {
    switch (type) {
      case 'critical': return '#FF3B30'; // Red border
      case 'verified': return '#34C759'; // Green accent
      default: return '#2C2C2E'; // Default dark border
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons name="shield-account" size={28} color="#4A90E2" />
            <Text style={styles.headerTitle}>ALEMNI OMEGA</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialCommunityIcons name="radioactive" size={20} color="#FF3B30" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'MONITORING', value: '14,204', color: '#FFF' },
            { label: 'THREAT LEVEL', value: 'CRITICAL', color: '#FF3B30', alert: true },
            { label: 'INTERCEPTIONS', value: '892', color: '#FFF' },
            { label: 'UPTIME', value: '99.9%', color: '#34C759' }
          ].map((stat, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInDown.delay(index * 100 + 300).springify()}
              style={[styles.statCard, stat.alert && { borderColor: '#FF3B30', borderWidth: 1 }]}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              {stat.alert && (
                   <View style={styles.glowOverlay} />
              )}
            </Animated.View>
          ))}
        </View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.4)" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search user ID, log entry..."
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </Animated.View>

        {/* Surveillance Feed Title */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.feedHeader}>
          <Text style={styles.feedTitle}>SURVEILLANCE FEED</Text>
          <View style={styles.liveIndicator}>
            <Animated.View style={[styles.liveDot, pulseStyle]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </Animated.View>

        {/* Feed Cards */}
        <View style={styles.feedList}>
          {ALERTS.map((alert, index) => (
            <Animated.View 
              key={alert.id}
              entering={FadeInDown.delay(index * 200 + 800).springify()}
            >
              <AnimatedLinearGradient
                colors={alert.type === 'critical' ? ['rgba(255, 59, 48, 0.15)', 'rgba(30,30,30,0.6)'] : ['rgba(30,30,30,0.8)', 'rgba(30,30,30,0.4)']}
                style={[
                  styles.feedCard, 
                  { borderColor: getCardBorderColor(alert.type), borderWidth: alert.type === 'critical' ? 1.5 : 0.5 },
                  alert.type === 'critical' && styles.criticalGlow
                ]}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.userIcon, { backgroundColor: alert.type === 'critical' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255,255,255,0.1)' }]}>
                    <FontAwesome5 
                      name={alert.userType === 'Student' ? 'user-graduate' : alert.userType === 'Teacher' ? 'chalkboard-teacher' : 'user'} 
                      size={18} 
                      color={alert.type === 'critical' ? '#FF3B30' : '#FFF'} 
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.userId}>{alert.userType} ID: {alert.userId}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                       <Text style={styles.userLocation}>{alert.location}</Text>
                       <View style={[styles.statusBadge, { backgroundColor: getStatusColor(alert.status) }]}>
                          <Text style={styles.statusText}>{alert.status}</Text>
                       </View>
                    </View>
                  </View>
                </View>

                {/* Log Content */}
                <View style={styles.cardBody}>
                  <Text style={styles.logTitle}>{alert.logTitle}</Text>
                  <Text style={styles.logDesc}>{alert.logDesc}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                   {alert.actions.map((action, idx) => (
                     <TouchableOpacity key={idx} style={[styles.actionBtn, { borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]} activeOpacity={0.7}>
                       {action.label === 'TERMINATE' && <MaterialCommunityIcons name="cancel" size={14} color={action.color} style={{marginRight:6}} />}
                       {action.label === 'History' && <MaterialCommunityIcons name="history" size={14} color={action.color} style={{marginRight:6}} />}
                       {action.label === 'Logs' && <MaterialCommunityIcons name="file-document-outline" size={14} color={action.color} style={{marginRight:6}} />}
                       {action.label === 'FREEZE ACCT' && <MaterialCommunityIcons name="snowflake" size={14} color={action.color} style={{marginRight:6}} />}
                       {action.label === 'Full Profile' && <Feather name="user" size={14} color={action.color} style={{marginRight:6}} />}
                       {action.label === 'Approve Service' && <Feather name="check" size={14} color={action.color} style={{marginRight:6}} />}
                       
                       <Text style={{ color: action.color, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>{action.label.toUpperCase()}</Text>
                     </TouchableOpacity>
                   ))}
                </View>
                
                {/* Main Action Large Button */}
                {alert.mainAction && (
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[
                      styles.mainActionBtn, 
                      { backgroundColor: alert.mainAction.color }
                    ]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                         {alert.mainAction.icon === 'gavel' && <FontAwesome5 name="gavel" size={14} color="#FFF" style={{marginRight: 8}} />}
                         {alert.mainAction.icon === 'flag' && <FontAwesome5 name="flag" size={14} color={alert.mainAction.textColor} style={{marginRight: 8}} />}
                         <Text style={{ 
                           color: alert.mainAction.textColor || '#FFF', 
                           fontWeight: '900', 
                           fontSize: 13,
                           letterSpacing: 1
                          }}>{alert.mainAction.label.toUpperCase()}</Text>
                      </View>
                  </TouchableOpacity>
                )}
              </AnimatedLinearGradient>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* Cyberpunk Admin Footer */}
      <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.cyberFooterContainer}>
        <View style={styles.cyberFooter}>
           <TouchableOpacity style={[styles.footerTab, styles.activeFooterTab]}>
              <Ionicons name="earth" size={24} color="#4A90E2" />
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.footerTab}>
              <MaterialCommunityIcons name="database" size={24} color="#8E8E93" />
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.footerTab}>
              <MaterialIcons name="warning" size={24} color="#FF3B30" />
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.footerTab}>
              <MaterialCommunityIcons name="console-line" size={24} color="#8E8E93" />
           </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F121C', // Dark Navy Background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Extra padding for custom footer
  },
  cyberFooterContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  cyberFooter: {
    flexDirection: 'row',
    backgroundColor: '#161B28',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#232936',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  footerTab: {
    padding: 12,
    borderRadius: 16,
  },
  activeFooterTab: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
     position: 'absolute',
     top: 8,
     right: 8,
     width: 6,
     height: 6,
     borderRadius: 3,
     backgroundColor: '#FF3B30',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 44) / 2, // Responsive width
    backgroundColor: '#161B28',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#232936',
    justifyContent: 'space-between',
    height: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
  },
  glowOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B28',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#232936',
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 28,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },

  // Feed Section
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  feedTitle: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Feed List
  feedList: {
    gap: 20,
  },
  feedCard: {
    borderRadius: 16,
    padding: 18,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  criticalGlow: {
      shadowColor: "#FF3B30",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userId: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  userLocation: {
    color: '#8E8E93',
    fontSize: 13,
    marginRight: 10,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  logTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'System', // Use monospace if available like Courier
  },
  logDesc: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  mainActionBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
