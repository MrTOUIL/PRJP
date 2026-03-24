import React, { useMemo, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

type NotificationType = 'Reminder' | 'Request' | 'Service' | 'Alert';

type NotificationItem = {
	id: number;
	title: string;
	message: string;
	type: NotificationType;
	timeLabel: string;
	read: boolean;
	section: 'TODAY' | 'YESTERDAY';
	icon: keyof typeof Ionicons.glyphMap;
	iconBg: string;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
	{
		id: 1,
		title: 'Session in 30 Minutes',
		message: 'Your session with M. Hamraoui (Advanced Math) starts at 10:00 AM.',
		type: 'Reminder',
		timeLabel: '9:30 AM',
		read: false,
		section: 'TODAY',
		icon: 'alarm-outline',
		iconBg: '#FCEFCF',
	},
	{
		id: 2,
		title: 'Request Accepted',
		message: 'Your request for "Math Help" has been accepted. Start your session now.',
		type: 'Request',
		timeLabel: '8:50 AM',
		read: false,
		section: 'TODAY',
		icon: 'checkmark',
		iconBg: '#E6F4EA',
	},
	{
		id: 3,
		title: 'New Service Available',
		message: 'A new Physics Tutoring session has just been added near you.',
		type: 'Service',
		timeLabel: '8:15 AM',
		read: false,
		section: 'TODAY',
		icon: 'add',
		iconBg: '#DFF3FA',
	},
	{
		id: 4,
		title: 'Submission Deadline Soon',
		message: 'Your General Chemistry assignment is due in 2 hours. Don\'t forget to submit!',
		type: 'Alert',
		timeLabel: '7:35 AM',
		read: false,
		section: 'TODAY',
		icon: 'calendar-outline',
		iconBg: '#FCEFCF',
	},
	{
		id: 5,
		title: 'Tutor Assigned',
		message: 'Sara Belhadj has been assigned to your English Conversation request.',
		type: 'Request',
		timeLabel: 'Yesterday, 4:30 PM',
		read: true,
		section: 'YESTERDAY',
		icon: 'school-outline',
		iconBg: '#F2EAF8',
	},
	{
		id: 6,
		title: 'New Reply on Your Request',
		message: 'You have a new reply on your Biology Exam Prep request from N. Chafi.',
		type: 'Request',
		timeLabel: 'Yesterday, 2:10 PM',
		read: true,
		section: 'YESTERDAY',
		icon: 'chatbubble-ellipses-outline',
		iconBg: '#DDEEFF',
	},
	{
		id: 7,
		title: 'Book Your Session',
		message: 'You showed interest in Maths Group Sessions. Limited spots available. Book now!',
		type: 'Service',
		timeLabel: 'Yesterday, 11:45 AM',
		read: true,
		section: 'YESTERDAY',
		icon: 'link-outline',
		iconBg: '#FCEFCF',
	},
	{
		id: 8,
		title: 'Request Declined',
		message: 'Unfortunately your request for "Lifesaver Services" was not accepted this time.',
		type: 'Request',
		timeLabel: 'Yesterday, 9:00 AM',
		read: true,
		section: 'YESTERDAY',
		icon: 'close-outline',
		iconBg: '#FBE4EC',
	},
];

const TYPE_COLORS: Record<NotificationType, { bg: string; text: string }> = {
	Reminder: { bg: '#FCEFCF', text: '#B7791F' },
	Request: { bg: '#ECE7FF', text: '#4B2DBB' },
	Service: { bg: '#DCF6F5', text: '#0F766E' },
	Alert: { bg: '#FFE8DC', text: '#B45309' },
};

export default function StudentNotificationPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

	const filteredNotifications = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) {
			return notifications;
		}

		return notifications.filter(
			n =>
				n.title.toLowerCase().includes(query) ||
				n.message.toLowerCase().includes(query) ||
				n.type.toLowerCase().includes(query)
		);
	}, [notifications, searchQuery]);

	const grouped = useMemo(() => {
		return {
			TODAY: filteredNotifications.filter(n => n.section === 'TODAY'),
			YESTERDAY: filteredNotifications.filter(n => n.section === 'YESTERDAY'),
		};
	}, [filteredNotifications]);

	const markAsRead = (id: number) => {
		setNotifications(prev => prev.map(item => (item.id === id ? { ...item, read: true } : item)));
	};

	const handleGoBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/(student_space)/studentSpace');
    router.push('/(student_space)/studentSpace');
  }
};

	return (
		<View style={styles.container}>
			<Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
				<View style={styles.headerTop}>
					<TouchableOpacity style={styles.iconButton} onPress={handleGoBack}>
						<Ionicons name="chevron-back" size={20} color="#fff" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Notifications</Text>
					<TouchableOpacity style={styles.iconButton}>
						<Ionicons name="search" size={20} color="#fff" />
					</TouchableOpacity>
				</View>

				<View style={styles.searchContainer}>
					<Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
					<TextInput
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholder="Search notifications..."
						placeholderTextColor="#94A3B8"
						style={styles.searchInput}
					/>
				</View>
			</Animated.View>

			<ScrollView
				style={styles.content}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.cardList}>
					{grouped.TODAY.map((item, index) => (
						<Animated.View
							key={item.id}
							entering={FadeInUp.delay(100 + index * 70).duration(500)}
							layout={Layout.springify()}
						>
							<NotificationCard item={item} onPress={markAsRead} />
						</Animated.View>
					))}
				</View>

				<View style={styles.cardList}>
					{grouped.YESTERDAY.map((item, index) => (
						<Animated.View
							key={item.id}
							entering={FadeInUp.delay(140 + index * 70).duration(500)}
							layout={Layout.springify()}
						>
							<NotificationCard item={item} onPress={markAsRead} />
						</Animated.View>
					))}
				</View>

				{filteredNotifications.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons name="notifications-off-outline" size={48} color="#94A3B8" />
						<Text style={styles.emptyStateText}>No notifications found</Text>
					</View>
				)}

				<View style={{ height: 40 }} />
			</ScrollView>
		</View>
	);
}

function NotificationCard({
	item,
	onPress,
}: {
	item: NotificationItem;
	onPress: (id: number) => void;
}) {
	const typeStyles = TYPE_COLORS[item.type];

	return (
		<TouchableOpacity
			style={[styles.card, !item.read && styles.unreadCard]}
			activeOpacity={0.92}
			onPress={() => onPress(item.id)}
		>
			<View style={styles.cardRow}>
				<View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
					<Ionicons name={item.icon} size={20} color="#475569" />
				</View>

				<View style={styles.cardTextWrap}>
					<Text style={styles.cardTitle}>{item.title}</Text>
					<Text style={styles.cardMessage}>{item.message}</Text>

					<View style={[styles.typePill, { backgroundColor: typeStyles.bg }]}>
						<Text style={[styles.typePillText, { color: typeStyles.text }]}>{item.type}</Text>
					</View>

					<Text style={styles.timeText}>{item.timeLabel}</Text>
				</View>

				{!item.read && <View style={styles.unreadDot} />}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F4F3FF',
	},
	header: {
		backgroundColor: '#1E1B6B',
		paddingTop: 34,
		paddingBottom: 14,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
		shadowColor: '#1E1B6B',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
		zIndex: 10,
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 10,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#fff',
		letterSpacing: 0.2,
	},
	iconButton: {
		padding: 2,
	},
	searchContainer: {
		marginHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 12,
		height: 38,
		paddingHorizontal: 10,
	},
	searchIcon: {
		marginRight: 7,
	},
	searchInput: {
		flex: 1,
		height: '100%',
		color: '#1E293B',
		fontSize: 12,
		fontWeight: '500',
	},
	content: {
		flex: 1,
		marginTop: 6,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 40,
	},
	cardList: {
		gap: 12,
		marginBottom: 22,
	},
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 18,
		borderWidth: 1,
		borderColor: '#DDDDF8',
		paddingHorizontal: 14,
		paddingVertical: 14,
	},
	unreadCard: {
		borderLeftWidth: 3,
		borderLeftColor: '#4F46E5',
	},
	cardRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	iconWrap: {
		width: 48,
		height: 48,
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	cardTextWrap: {
		flex: 1,
		paddingRight: 10,
	},
	cardTitle: {
		fontSize: 31 / 2,
		lineHeight: 19,
		fontWeight: '800',
		color: '#0F123D',
	},
	cardMessage: {
		marginTop: 4,
		fontSize: 30 / 2,
		lineHeight: 22,
		color: '#5E6097',
		fontWeight: '500',
	},
	typePill: {
		marginTop: 10,
		alignSelf: 'flex-start',
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 3,
	},
	typePillText: {
		fontSize: 12,
		fontWeight: '700',
	},
	timeText: {
		marginTop: 8,
		fontSize: 21 / 2,
		color: '#8A8DB7',
		fontWeight: '500',
	},
	unreadDot: {
		width: 9,
		height: 9,
		borderRadius: 999,
		backgroundColor: '#4F46E5',
		marginTop: 4,
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 48,
	},
	emptyStateText: {
		marginTop: 10,
		color: '#94A3B8',
		fontSize: 16,
		fontWeight: '600',
	},
});
