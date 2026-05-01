import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

const DETAIL_ROWS = [
	{ label: 'Subject', value: 'Mathematics' },
	{ label: 'School level', value: 'Terminale S' },
	{ label: 'Frequency', value: '3x per week' },
	{ label: 'Session duration', value: '1h 30min' },
	{ label: 'Date submitted', value: '12 Mar 2025' },
	{ label: 'Accepted teacher', value: 'Sara Belhadj' },
];

export default function RequestAcceptedDetails() {
	const router = useRouter();

	const circleOneX = useSharedValue(0);
	const circleOneY = useSharedValue(0);
	const circleTwoX = useSharedValue(0);
	const circleTwoY = useSharedValue(0);

	useEffect(() => {
		circleOneX.value = withRepeat(
			withSequence(
				withTiming(22, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
				withTiming(-16, { duration: 1500, easing: Easing.inOut(Easing.sin) })
			),
			-1,
			true
		);
		circleOneY.value = withRepeat(
			withSequence(
				withTiming(-20, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
				withTiming(12, { duration: 1700, easing: Easing.inOut(Easing.sin) })
			),
			-1,
			true
		);

		circleTwoX.value = withRepeat(
			withSequence(
				withTiming(-20, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
				withTiming(14, { duration: 1600, easing: Easing.inOut(Easing.sin) })
			),
			-1,
			true
		);
		circleTwoY.value = withRepeat(
			withSequence(
				withTiming(18, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
				withTiming(-10, { duration: 1800, easing: Easing.inOut(Easing.sin) })
			),
			-1,
			true
		);
	}, [circleOneX, circleOneY, circleTwoX, circleTwoY]);

	const circleOneAnim = useAnimatedStyle(() => ({
		transform: [{ translateX: circleOneX.value }, { translateY: circleOneY.value }],
	}));

	const circleTwoAnim = useAnimatedStyle(() => ({
		transform: [{ translateX: circleTwoX.value }, { translateY: circleTwoY.value }],
	}));

     const handleGoBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/(student_space)/studentSpace');
    router.push('/(student_space)/studentSpace');
  }
};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="dark-content" backgroundColor="#FFFBEB" />

			<View pointerEvents="none" style={styles.bgLayer}>
				<Animated.View style={[styles.bgCircleOne, circleOneAnim]} />
				<Animated.View style={[styles.bgCircleTwo, circleTwoAnim]} />
			</View>

			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				<View style={styles.cardWrap}>
					<View style={styles.cardHeaderTop}>
						<TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
							<Ionicons name="chevron-back" size={20} color="#375CC7" />
						</TouchableOpacity>
					</View>

					<View style={styles.successBadge}>
						<Ionicons name="checkmark" size={34} color="#16A34A" />
					</View>
					<Text style={styles.successTitle}>Quote accepted</Text>
					<Text style={styles.successSubtitle}>Your request has been approved</Text>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeader}>
						<View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
							<Ionicons name="document-text-outline" size={15} color="#4F46E5" />
						</View>
						<Text style={styles.sectionTitle}>Educational details</Text>
					</View>

					{DETAIL_ROWS.map((row, index) => (
						<View key={row.label} style={[styles.row, index < DETAIL_ROWS.length - 1 && styles.rowBorder]}>
							<Text style={styles.rowLabel}>{row.label}</Text>
							<Text style={styles.rowValue}>{row.value}</Text>
						</View>
					))}
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeader}>
						<View style={[styles.sectionIcon, { backgroundColor: '#E7F8F0' }]}>
							<FontAwesome5 name="wallet" size={13} color="#059669" />
						</View>
						<Text style={styles.sectionTitle}>Estimated budget</Text>
					</View>
					<Text style={styles.budgetValue}>2,000 <Text style={styles.budgetSub}>DA / session</Text></Text>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeader}>
						<View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
							<MaterialIcons name="short-text" size={16} color="#4F46E5" />
						</View>
						<Text style={styles.sectionTitle}>Learning objective</Text>
					</View>
					<Text style={styles.paragraphText}>
						Improve understanding of equations and prepare for the Baccalaureat exam. Focus on
						problem-solving speed and accuracy.
					</Text>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFBEB',
	},
	bgLayer: {
		...StyleSheet.absoluteFillObject,
		overflow: 'hidden',
	},
	bgCircleOne: {
		position: 'absolute',
		top: -70,
		left: -90,
		width: 260,
		height: 260,
		borderRadius: 130,
		backgroundColor: 'rgba(92, 124, 207, 0.24)',
	},
	bgCircleTwo: {
		position: 'absolute',
		top: 260,
		right: -100,
		width: 240,
		height: 240,
		borderRadius: 120,
		backgroundColor: 'rgba(122, 152, 226, 0.22)',
	},
	scrollContent: {
		paddingHorizontal: 14,
		paddingTop: 10,
		paddingBottom: 34,
		gap: 12,
	},
	cardWrap: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#B8C9EB',
		borderRadius: 24,
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	cardHeaderTop: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	backButton: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#9EB5E3',
		borderRadius: 18,
	},
	successBadge: {
		alignSelf: 'center',
		marginTop: 18,
		width: 74,
		height: 74,
		borderRadius: 37,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#C6F3D6',
		borderWidth: 2,
		borderColor: '#5DDA98',
	},
	successTitle: {
		marginTop: 14,
		textAlign: 'center',
		color: '#0F766E',
		fontSize: 23,
		fontWeight: '700',
	},
	successSubtitle: {
		marginTop: 4,
		textAlign: 'center',
		color: '#64748B',
		fontSize: 16,
		fontWeight: '400',
	},
	sectionCard: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#B8C9EB',
		borderRadius: 18,
		overflow: 'hidden',
	},
	sectionHeader: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#D7E2F7',
		flexDirection: 'row',
		alignItems: 'center',
	},
	sectionIcon: {
		width: 30,
		height: 30,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
	},
	sectionTitle: {
		color: '#1E1B6B',
		fontSize: 16,
		fontWeight: '600',
	},
	row: {
		minHeight: 40,
		paddingHorizontal: 14,
		paddingVertical: 8,
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	rowBorder: {
		borderBottomWidth: 1,
		borderBottomColor: '#DFE7F8',
	},
	rowLabel: {
		color: '#6B7FA7',
		fontSize: 14.5,
		fontWeight: '400',
	},
	rowValue: {
		color: '#0F172A',
		fontSize: 14.5,
		fontWeight: '600',
	},
	goalsStack: {
		padding: 12,
		gap: 8,
	},
	goalItem: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#D4E0F7',
		borderRadius: 11,
		paddingHorizontal: 12,
		paddingVertical: 11,
	},
	goalText: {
		color: '#0F172A',
		fontSize: 15,
		fontWeight: '500',
		lineHeight: 22,
	},
	budgetValue: {
		paddingHorizontal: 14,
		paddingVertical: 16,
		color: '#0F172A',
		fontSize: 27,
		fontWeight: '700',
	},
	budgetSub: {
		color: '#7C8EAE',
		fontSize: 15,
		fontWeight: '500',
	},
	paragraphText: {
		paddingHorizontal: 14,
		paddingTop: 14,
		paddingBottom: 16,
		color: '#334155',
		fontSize: 16,
		lineHeight: 25,
		fontWeight: '400',
	},
});
