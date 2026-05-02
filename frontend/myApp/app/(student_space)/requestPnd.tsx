import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

const pickFirst = (value: string | string[] | undefined, fallback: string) => {
	if (Array.isArray(value)) {
		return value[0] ?? fallback;
	}
	return value ?? fallback;
};

	const params = useLocalSearchParams();

	const tutorName = pickFirst(params.tutorName, 'Pending assignment');
	const subject = pickFirst(params.subject, 'Mathematics');
	const service = pickFirst(params.service, 'English Conversation');
	const date = pickFirst(params.date, 'Feb 28');
	const duration = pickFirst(params.duration, '1 hour');
	const price = pickFirst(params.price, '650');

	const DETAIL_ROWS = [
		{ label: 'Subject', value: subject },
		{ label: 'School level', value: 'Terminale S' },
		{ label: 'Frequency', value: '3x per week' },
		{ label: 'Session duration', value: duration },
		{ label: 'Date submitted', value: date },
		{ label: 'Assigned teacher', value: tutorName },
	];
export default function RequestPendingDetails() {
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

					<View style={styles.statusBadge}>
						<Ionicons name="time-outline" size={34} color="#D97706" />
					</View>
					<Text style={styles.statusTitle}>Quote pending</Text>
					<Text style={styles.statusSubtitle}>Your request is waiting for approval</Text>
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
						<View style={[styles.sectionIcon, { backgroundColor: '#FFEDD5' }]}>
							<FontAwesome5 name="wallet" size={13} color="#D97706" />
						</View>
						<Text style={styles.sectionTitle}>Estimated budget</Text>
					</View>
					<Text style={styles.budgetValue}>2,000 <Text style={styles.budgetSub}>DA / session</Text></Text>
								<Text style={styles.budgetValue}>{price} <Text style={styles.budgetSub}>DA / session</Text></Text>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeader}>
						<View style={[styles.sectionIcon, { backgroundColor: '#EEF2FF' }]}>
							<MaterialIcons name="short-text" size={16} color="#4F46E5" />
						</View>
						<Text style={styles.sectionTitle}>Learning objective</Text>
					</View>
				
					<Text style={styles.paragraphText}>
						{service}
					</Text>
				</View>

				<TouchableOpacity style={[styles.cancelButton, styles.cancelButtonBottom]}>
					<Ionicons name="close-outline" size={17} color="#4C6DBF" />
					<Text style={styles.cancelButtonText}>Cancel request</Text>
				</TouchableOpacity>
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
	statusBadge: {
		alignSelf: 'center',
		marginTop: 18,
		width: 74,
		height: 74,
		borderRadius: 37,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFEDD5',
		borderWidth: 2,
		borderColor: '#FDBA74',
	},
	statusTitle: {
		marginTop: 14,
		textAlign: 'center',
		color: '#B45309',
		fontSize: 23,
		fontWeight: '700',
	},
	statusSubtitle: {
		marginTop: 4,
		textAlign: 'center',
		color: '#64748B',
		fontSize: 16,
		fontWeight: '400',
	},
	cancelButton: {
		marginTop: 14,
		alignSelf: 'stretch',
		height: 48,
		paddingHorizontal: 18,
		borderRadius: 14,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#5C7CCF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButtonText: {
		marginLeft: 6,
		color: '#1E1B6B',
		fontSize: 15,
		fontWeight: '600',
	},
	cancelButtonBottom: {
		marginTop: 4,
		marginBottom: 8,
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
