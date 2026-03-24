import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
	Animated,
	Easing,
	Image,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

const DAYS = [
	{ label: 'Mon', slot: 'PM' },
	{ label: 'Tue', slot: null },
	{ label: 'Wed', slot: 'AM' },
	{ label: 'Thu', slot: 'PM' },
	{ label: 'Fri', slot: 'All' },
	{ label: 'Sat', slot: 'AM' },
	{ label: 'Sun', slot: null },
];

const TEACHING_DETAILS = [
	{ key: 'subjects', label: 'EXPERTISE / SUBJECTS', value: 'Mathematics, Physics', icon: 'book-outline' },
	{ key: 'levels', label: 'LEVELS TAUGHT', value: 'Terminale S · Bac · 2AS', icon: 'school-outline' },
	{ key: 'mode', label: 'TEACHING MODE', value: 'Online · Hybrid', icon: 'desktop-outline' },
	{ key: 'nature', label: 'NATURE', value: 'Independent', icon: 'home-outline' },
	{ key: 'visits', label: 'HOME VISITS / DISPLACEMENT', value: 'Yes - within Alger', icon: 'time-outline' },
];

const TEACHER_COMMENTS = [
	{
		id: 'c1',
		student: 'Yasmine B.',
		avatar: 'https://i.pravatar.cc/120?img=32',
		rating: '5.0',
		message: 'Very clear explanations. I improved my math results quickly.',
		time: '2 days ago',
	},
	{
		id: 'c2',
		student: 'Mourad L.',
		avatar: 'https://i.pravatar.cc/120?img=12',
		rating: '4.8',
		message: 'Great teacher, patient and organized in every session.',
		time: '1 week ago',
	},
];

const InfoRow = ({ label, value }: { label: string; value: string }) => (
	<View style={styles.fieldCard}>
		<Text style={styles.infoLabel}>{label}</Text>
		<Text style={styles.infoValue}>{value}</Text>
	</View>
);

const Section = ({
	title,
	children,
	delay,
	animatedValue,
	containerStyle,
	titleStyle,
	titleRight,
}: {
	title: string;
	children: React.ReactNode;
	delay: number;
	animatedValue: Animated.Value;
	containerStyle?: object;
	titleStyle?: object;
	titleRight?: React.ReactNode;
}) => {
	const translateY = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [14 + delay * 0.08, 0],
	});

	const opacity = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});

	return (
		<Animated.View style={[styles.section, containerStyle, { opacity, transform: [{ translateY }] }]}>
			<View style={styles.sectionTitleRow}>
				<Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
				{titleRight}
			</View>
			{children}
		</Animated.View>
	);
};

export default function TeacherProfileStudentView() {
	const router = useRouter();
	const pageAnim = useRef(new Animated.Value(0)).current;
	const shineAnim = useRef(new Animated.Value(-160)).current;
	const [commentInput, setCommentInput] = useState('');
	const [selectedStars, setSelectedStars] = useState(0);
	const [showAddComment, setShowAddComment] = useState(false);
	const [comments, setComments] = useState(TEACHER_COMMENTS);
	const [showAllComments, setShowAllComments] = useState(false);

	const handleAddComment = () => {
		const cleanValue = commentInput.trim();
		if (!cleanValue || selectedStars === 0) {
			return;
		}

		setComments((prev) => [
			{
				id: String(Date.now()),
				student: 'You',
				avatar: 'https://i.pravatar.cc/120?img=15',
				rating: selectedStars.toFixed(1),
				message: cleanValue,
				time: 'Now',
			},
			...prev,
		]);
		setCommentInput('');
		setSelectedStars(0);
		setShowAddComment(false);
	};

	const handleCancelComment = () => {
		setCommentInput('');
		setSelectedStars(0);
		setShowAddComment(false);
	};

	useEffect(() => {
		Animated.timing(pageAnim, {
			toValue: 1,
			duration: 600,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: true,
		}).start();

		Animated.loop(
			Animated.timing(shineAnim, {
				toValue: 260,
				duration: 2200,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();
	}, [pageAnim, shineAnim]);

	const topTranslate = pageAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [24, 0],
	});

	const visibleComments = showAllComments ? comments : comments.slice(0, 2);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" />

			<Animated.View style={[styles.container, { opacity: pageAnim, transform: [{ translateY: topTranslate }] }]}>
				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
					<View style={styles.headerCard}>
						<View style={styles.topRightCurveContainer}>
							<View style={styles.topRightCurve} />
							<Image
								source={require('../../assets/images/Logo_nobg.png')}
								style={styles.headerLogo}
								resizeMode="contain"
							/>
						</View>

						<TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.85}>
							<Text style={styles.backButtonText}>{'‹'}</Text>
						</TouchableOpacity>

						<View style={styles.avatarCircle}>
							<Text style={styles.avatarLetter}>K</Text>
							<View style={styles.onlineDot} />
						</View>
						<Text style={styles.name}>Karim Hadi</Text>
						<Text style={styles.role}>Mathematics Teacher • Online / Hybrid • Alger</Text>

						<View style={styles.headerBadgesRow}>
							<View style={styles.ratingBadge}>
								<Text style={styles.ratingBadgeText}>4.9 Rating</Text>
							</View>
							<View style={styles.verifiedBadge}>
								<Text style={styles.verifiedBadgeText}>Verified</Text>
							</View>
						</View>
					</View>

					<View style={styles.actionsRowTop}>
						<TouchableOpacity activeOpacity={0.9} style={styles.quoteButton}>
							<Animated.View style={[styles.quoteShine, { transform: [{ translateX: shineAnim }, { rotate: '24deg' }] }]} />
							<Text style={styles.quoteButtonText}>Send Quote</Text>
						</TouchableOpacity>

						<TouchableOpacity activeOpacity={0.9} style={styles.messageButtonSoft}>
							<Text style={styles.messageButtonSoftText}>Send Message</Text>
						</TouchableOpacity>
					</View>

					<Section title="Personal Information" delay={1} animatedValue={pageAnim}>
						<InfoRow label="Name" value="Karim Hadi" />
						<InfoRow label="Email" value="hadi.karim@example.com" />
						<InfoRow label="Phone" value="+213 552 987 456" />
						<InfoRow label="Address" value="Tizi Ouzou, Algeria" />
					</Section>

					<Section title="Teaching Profile" delay={2} animatedValue={pageAnim}>
						<View style={styles.teachingList}>
							{TEACHING_DETAILS.map((item) => (
								<View key={item.key} style={styles.teachingItem}>
									<View style={styles.teachingIconWrap}>
										<Ionicons name={item.icon as any} size={18} color="#23287B" />
									</View>

									<View style={styles.teachingTextWrap}>
										<Text style={styles.teachingLabel}>{item.label}</Text>
										<Text style={styles.teachingValue}>{item.value}</Text>
									</View>

									<Ionicons name="chevron-forward" size={18} color="#B8BDCA" />
								</View>
							))}
						</View>
					</Section>

					<Section title="Pedagogical Description" delay={3} animatedValue={pageAnim}>
						<View style={styles.descriptionBox}>
							<Text style={styles.descriptionText}>
								Experienced Math teacher with 3 years helping students build confidence in logical thinking.
								My approach focuses on clarity, step-by-step understanding, and practical exercises.
							</Text>
						</View>
					</Section>

					<Section title="Weekly Availability" delay={4} animatedValue={pageAnim}>
						<View style={styles.availabilityTrack}>
							{DAYS.map((day) => (
								<View key={`${day.label}-${day.slot ?? 'off'}`} style={styles.availabilityDayCol}>
									<Text style={[styles.availabilityDayLabel, day.slot && styles.availabilityDayLabelActive]}>{day.label}</Text>
									<View style={[styles.availabilityDot, day.slot ? styles.availabilityDotActive : styles.availabilityDotInactive]}>
										{day.slot ? <Text style={styles.availabilityDotText}>{day.slot}</Text> : null}
									</View>
								</View>
							))}
						</View>
					</Section>

					<Section
						title="Teacher Comments"
						delay={5}
						animatedValue={pageAnim}
						containerStyle={styles.commentsSectionContainer}
						titleStyle={styles.commentsSectionTitle}
						titleRight={
							<TouchableOpacity
								onPress={() => setShowAllComments((prev) => !prev)}
								activeOpacity={0.85}
								style={styles.commentsHeaderToggleButton}
							>
								<Text style={styles.commentsHeaderToggleText}>{showAllComments ? '▲' : 'See all'}</Text>
							</TouchableOpacity>
						}
					>
						<View style={styles.commentsContainerAccent}>
							<View style={styles.commentsList}>
								{visibleComments.map((comment) => (
									<View key={comment.id} style={styles.commentCard}>
										<View style={styles.commentTopRow}>
											<View style={styles.commentIdentity}>
												<Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
												<View>
													<Text style={styles.commentAuthor}>{comment.student}</Text>
													<View style={styles.commentStarsRow}>
														{[1, 2, 3, 4, 5].map((star) => (
															<Text
																key={`${comment.id}-star-${star}`}
																style={[
																	styles.commentStar,
																	Number(comment.rating) >= star && styles.commentStarActive,
																]}
															>
																★
															</Text>
														))}
													</View>
												</View>
											</View>
											<Text style={styles.commentMeta}>{comment.time}</Text>
										</View>
										<Text style={styles.commentMessage}>{comment.message}</Text>
									</View>
								))}
							</View>

							{!showAddComment ? (
								<TouchableOpacity
									style={styles.openCommentButton}
									onPress={() => setShowAddComment(true)}
									activeOpacity={0.9}
								>
									<Text style={styles.openCommentButtonText}>Add Comment</Text>
								</TouchableOpacity>
							) : (
								<View style={styles.addCommentBox}>
									<Text style={styles.addCommentLabel}>Your Rating</Text>
									<View style={styles.starsRow}>
										{[1, 2, 3, 4, 5].map((star) => (
											<TouchableOpacity
												key={star}
												onPress={() => setSelectedStars(star)}
												style={styles.starButton}
												activeOpacity={0.8}
											>
												<Text style={[styles.starText, selectedStars >= star && styles.starTextActive]}>★</Text>
											</TouchableOpacity>
										))}
									</View>

									<Text style={styles.addCommentLabel}>Your Comment</Text>
									<TextInput
										value={commentInput}
										onChangeText={setCommentInput}
										placeholder="Write your feedback about this teacher"
										placeholderTextColor="#93A0C6"
										style={styles.commentInput}
										multiline
									/>

									<View style={styles.commentActionsRow}>
										<TouchableOpacity style={styles.sendCommentButton} onPress={handleAddComment} activeOpacity={0.9}>
											<Text style={styles.sendCommentButtonText}>Send Comment</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.cancelCommentButton} onPress={handleCancelComment} activeOpacity={0.9}>
											<Text style={styles.cancelCommentButtonText}>Cancel</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</View>
					</Section>

					<View style={styles.bottomSpacer} />
				</ScrollView>
			</Animated.View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#EEF3FF',
	},
	container: {
		flex: 1,
		paddingHorizontal: 0,
	},
	scrollContent: {
		paddingTop: 0,
		paddingBottom: 20,
	},
	headerCard: {
		marginTop: 0,
		borderRadius: 0,
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
		paddingTop: Platform.OS === 'android' ? 30 : 34,
		paddingBottom: 20,
		paddingHorizontal: 16,
		backgroundColor: '#1E1B6B',
		shadowColor: '#1E1B6B',
		shadowOpacity: 0.38,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 8 },
		elevation: 8,
		overflow: 'hidden',
		position: 'relative',
	},
	topRightCurveContainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 118,
		height: 62,
		alignItems: 'flex-end',
		justifyContent: 'center',
		zIndex: 2,
	},
	topRightCurve: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#FFFFFF',
		borderBottomLeftRadius: 48,
	},
	headerLogo: {
		width: 118,
		height: 70,
		marginRight: 6,
		marginTop: 0,
		zIndex: 3,
	},
	backButton: {
		position: 'absolute',
		top: 14,
		left: 14,
		zIndex: 2,
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,0.16)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.30)',
	},
	backButtonText: {
		color: '#ffffff',
		fontSize: 26,
		lineHeight: 28,
		fontWeight: '700',
	},
	avatarCircle: {
		width: 72,
		height: 72,
		borderRadius: 40,
		backgroundColor: '#ffd24a',
		borderWidth: 3,
		borderColor: 'rgba(255,255,255,0.55)',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
		position: 'relative',
	},
	onlineDot: {
		position: 'absolute',
		right: 3,
		bottom: 4,
		width: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: '#00C853',
		borderWidth: 2,
		borderColor: '#1E1B6B',
	},
	avatarLetter: {
		fontSize: 28,
		fontWeight: '800',
		color: '#312f2d',
	},
	name: {
		textAlign: 'center',
		fontSize: 22,
		fontWeight: '800',
		color: '#ffffff',
		marginBottom: 4,
	},
	role: {
		textAlign: 'center',
		marginTop: 6,
		fontSize: 14,
		color: '#ebf0ff',
	},
	headerBadgesRow: {
		marginTop: 14,
		flexDirection: 'row',
		justifyContent: 'center',
		columnGap: 10,
	},
	ratingBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: '#F7E3A3',
	},
	ratingBadgeText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#67511B',
	},
	verifiedBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: '#8ED3B3',
	},
	verifiedBadgeText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#1F6A4A',
	},
	actionsRowTop: {
		marginTop: 8,
		marginHorizontal: 14,
		flexDirection: 'row',
		columnGap: 10,
	},
	section: {
		marginTop: 10,
		marginHorizontal: 14,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#dfe7ff',
		backgroundColor: '#ffffff',
		padding: 12,
	},
	sectionTitle: {
		marginBottom: 10,
		fontSize: 16,
		fontWeight: '700',
		color: '#2a3560',
	},
	sectionTitleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	fieldCard: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#e3e9fb',
		backgroundColor: '#ffffff',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 12,
		marginBottom: 8,
	},
	teachingList: {
		borderRadius: 12,
		overflow: 'hidden',
	},
	teachingItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		paddingVertical: 11,
		paddingHorizontal: 2,
		borderBottomWidth: 1,
		borderBottomColor: '#EEF1FA',
	},
	teachingIconWrap: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: '#F1F3F9',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
	},
	teachingTextWrap: {
		flex: 1,
		paddingRight: 8,
	},
	teachingLabel: {
		fontSize: 11,
		color: '#9CA3B5',
		letterSpacing: 0.2,
		marginBottom: 3,
	},
	teachingValue: {
		fontSize: 15,
		fontWeight: '500',
		color: '#171B2B',
	},
	infoLabel: {
		fontSize: 13,
		color: '#68708c',
		marginBottom: 5,
	},
	infoValue: {
		fontSize: 15,
		fontWeight: '600',
		color: '#17203a',
		textAlign: 'left',
	},
	descriptionBox: {
		borderRadius: 10,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e3e9fb',
		padding: 10,
	},
	descriptionText: {
		fontSize: 15,
		lineHeight: 23,
		color: '#2d3658',
	},
	availabilityTrack: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		backgroundColor: '#F6F7FB',
		borderRadius: 12,
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderWidth: 1,
		borderColor: '#ECEFF7',
	},
	availabilityDayCol: {
		alignItems: 'center',
		width: 44,
	},
	availabilityDayLabel: {
		fontSize: 11,
		fontWeight: '500',
		color: '#8D92A3',
		marginBottom: 8,
	},
	availabilityDayLabelActive: {
		color: '#737891',
	},
	availabilityDot: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	availabilityDotActive: {
		backgroundColor: '#1E1B6B',
	},
	availabilityDotInactive: {
		backgroundColor: '#E9E9EC',
	},
	availabilityDotText: {
		fontSize: 11,
		fontWeight: '500',
		color: '#FFFFFF',
	},
	quoteButton: {
		flex: 1,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		overflow: 'hidden',
		backgroundColor: '#ffcf1f',
		shadowColor: '#ffbf00',
		shadowOpacity: 0.45,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 8 },
		elevation: 7,
	},
	quoteShine: {
		position: 'absolute',
		width: 44,
		height: 180,
		backgroundColor: 'rgba(255,255,255,0.55)',
		top: -50,
	},
	quoteButtonText: {
		fontSize: 14,
		fontWeight: '800',
		color: '#3a2b00',
	},
	messageButtonSoft: {
		flex: 1,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		borderWidth: 1,
		borderColor: 'rgba(61, 85, 224, 0.35)',
		shadowColor: '#3245bb',
		shadowOpacity: 0.15,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 6 },
		elevation: 4,
	},
	messageButtonSoftText: {
		fontSize: 15,
		fontWeight: '800',
		color: '#2f45c7',
	},
	commentsList: {
		rowGap: 8,
	},
	commentsSectionContainer: {
		backgroundColor: '#FFFDF5',
		borderColor: '#F4EDD1',
		borderLeftWidth: 6,
		borderLeftColor: '#F2DB8A',
	},
	commentsSectionTitle: {
		color: '#5B4817',
	},
	commentsContainerAccent: {
		backgroundColor: '#FFFDF8',
		borderRadius: 10,
		paddingHorizontal: 2,
		paddingVertical: 6,
	},
	commentsHeaderToggleButton: {
		paddingHorizontal: 0,
		paddingVertical: 0,
	},
	commentsHeaderToggleText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#2D5BFF',
	},
	commentCard: {
		padding: 10,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E4EAFB',
		borderRadius: 10,
	},
	commentTopRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 6,
	},
	commentIdentity: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	commentAvatar: {
		width: 34,
		height: 34,
		borderRadius: 17,
		marginRight: 8,
		backgroundColor: '#dfe5fa',
	},
	commentAuthor: {
		fontSize: 14,
		fontWeight: '700',
		color: '#1C2A59',
	},
	commentStarsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 1,
	},
	commentStar: {
		fontSize: 12,
		marginRight: 1,
		color: '#ced5ec',
	},
	commentStarActive: {
		color: '#FFCD1F',
	},
	commentMeta: {
		fontSize: 12,
		fontWeight: '600',
		color: '#6A769A',
		marginLeft: 8,
		marginTop: 2,
	},
	commentMessage: {
		fontSize: 14,
		lineHeight: 21,
		color: '#2D3658',
	},
	addCommentBox: {
		marginTop: 12,
		padding: 12,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E4EAFB',
	},
	openCommentButton: {
		marginTop: 12,
		alignSelf: 'flex-start',
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: '#1E1B6B',
		borderWidth: 1,
		borderColor: '#1E1B6B',
	},
	openCommentButtonText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#FFFFFF',
	},
	addCommentLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#2f45c7',
		marginBottom: 8,
	},
	starsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	starButton: {
		marginRight: 6,
		paddingVertical: 2,
		paddingHorizontal: 2,
	},
	starText: {
		fontSize: 28,
		color: '#c8d0e9',
	},
	starTextActive: {
		color: '#FFCD1F',
	},
	commentInput: {
		minHeight: 84,
		textAlignVertical: 'top',
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: '#F8FAFF',
		borderWidth: 1,
		borderColor: '#DFE6FC',
		borderRadius: 9,
		fontSize: 14,
		color: '#1E2A4D',
	},
	commentActionsRow: {
		marginTop: 10,
		flexDirection: 'row',
		columnGap: 8,
	},
	sendCommentButton: {
		alignSelf: 'flex-start',
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: '#1E1B6B',
		borderWidth: 1,
		borderColor: '#1E1B6B',
	},
	sendCommentButtonText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#FFFFFF',
	},
	cancelCommentButton: {
		marginTop: 0,
		alignSelf: 'flex-start',
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: '#f8faff',
		borderWidth: 1,
		borderColor: 'rgba(61, 85, 224, 0.22)',
	},
	cancelCommentButtonText: {
		fontSize: 13,
		fontWeight: '500',
		color: '#2f45c7',
	},
	bottomSpacer: {
		height: 18,
	},
});
