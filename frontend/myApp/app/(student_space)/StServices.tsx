import React from 'react';
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Service = {
	id: number;
	title: string;
	tutor: string;
	price: string;
	duration: string;
	mode: string;
	level: string;
	subject: string;
	avatarBg: string;
	avatarLetter: string;
	status?: string;
	nextDate?: string;
};

const enrolledServices: Service[] = [
	{
		id: 1,
		title: 'Individual Math Sessions',
		tutor: 'Sara Belhadj | Terminale S',
		price: '800 DZD',
		duration: '90 min',
		mode: 'Online',
		level: 'Individual',
		subject: 'Physics',
		avatarBg: '#14A78B',
		avatarLetter: 'S',
		status: 'Active - 8 sessions done',
		nextDate: 'Next: Fri 27 Feb',
	},
	{
		id: 2,
		title: 'English Conversation Practice',
		tutor: 'Leila Mansouri | All levels',
		price: '700 DZD',
		duration: '60 min',
		mode: 'Online',
		level: 'Individual',
		subject: 'English',
		avatarBg: '#E94A4A',
		avatarLetter: 'L',
		status: 'Active - 5 sessions done',
		nextDate: 'Next: Sat 28 Feb',
	},
];

const discoverServices: Service[] = [
	{
		id: 3,
		title: 'Math Group Sessions',
		tutor: 'M. Rahmani | Lycee',
		price: '400 DZD',
		duration: '60 min',
		mode: 'In person',
		level: 'Group (max 8)',
		subject: 'Maths',
		avatarBg: '#F4B22E',
		avatarLetter: 'M',
	},
	{
		id: 4,
		title: 'Chemistry Intensive Course',
		tutor: 'A. Oussama | Baccalaureat',
		price: '600 DZD',
		duration: '120 min',
		mode: 'In person',
		level: 'Individual',
		subject: 'Chemistry',
		avatarBg: '#6A39D6',
		avatarLetter: 'A',
	},
	{
		id: 5,
		title: 'Biology Exam Preparation',
		tutor: 'N. Ouali | Terminale S',
		price: '550 DZD',
		duration: '90 min',
		mode: 'Online',
		level: 'Individual',
		subject: 'Biology',
		avatarBg: '#F59E0B',
		avatarLetter: 'N',
	},
	{
		id: 6,
		title: 'Physics Problem Solving',
		tutor: 'Sara Belhadj | Terminale S',
		price: '750 DZD',
		duration: '90 min',
		mode: 'Online',
		level: 'Group (max 7)',
		subject: 'Physics',
		avatarBg: '#14A78B',
		avatarLetter: 'S',
	},
];

const ServiceCard = ({ service, enrolled }: { service: Service; enrolled: boolean }) => {
	return (
		<View style={styles.card}>
			<View style={styles.cardTopRow}>
				<View style={[styles.avatar, { backgroundColor: service.avatarBg }]}>
					<Text style={styles.avatarText}>{service.avatarLetter}</Text>
				</View>

				<View style={styles.cardInfo}>
					<View style={styles.titlePriceRow}>
						<Text style={styles.cardTitle} numberOfLines={1}>
							{service.title}
						</Text>
						<Text style={styles.price}>{service.price}</Text>
					</View>
					<Text style={styles.cardSubtitle}>{service.tutor}</Text>

					<View style={styles.tagsRow}>
						<View style={styles.tagChip}>
							<Ionicons name="time-outline" size={12} color="#7F8AA5" />
							<Text style={styles.tagText}>{service.duration}</Text>
						</View>
						<View style={styles.tagChip}>
							<Ionicons name="globe-outline" size={12} color="#7F8AA5" />
							<Text style={styles.tagText}>{service.mode}</Text>
						</View>
						<View style={styles.tagChip}>
							<Ionicons name="person-outline" size={12} color="#7F8AA5" />
							<Text style={styles.tagText}>{service.level}</Text>
						</View>
						<View style={styles.tagChip}>
							<Ionicons name="school-outline" size={12} color="#7F8AA5" />
							<Text style={styles.tagText}>{service.subject}</Text>
						</View>
					</View>
				</View>
			</View>

			{enrolled ? (
				<View style={styles.enrolledFooter}>
					<Text style={styles.activeText}>{service.status}</Text>
					<Text style={styles.nextDateText}>{service.nextDate}</Text>
				</View>
			) : (
				<TouchableOpacity style={styles.bookButton} activeOpacity={0.9}>
					<Text style={styles.bookButtonText}>Request This Service</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default function StServices() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.headerWrap}>
				<View style={styles.headerTop}>
					<TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
						<Ionicons name="chevron-back" size={20} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Services</Text>
				</View>
			</View>

			<ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
				<View style={styles.enrolledHeaderBlock}>
					<View>
						<Text style={styles.enrolledTitle}>My Enrolled Services</Text>
						<Text style={styles.enrolledHint}>Services you are currently enrolled in</Text>
					</View>
				</View>

				{enrolledServices.map((service) => (
					<ServiceCard key={service.id} service={service} enrolled />
				))}

				<View style={styles.sectionHeaderBlock}> 
					<View>
						<Text style={styles.sectionTitle}>Discover Services</Text>
						<Text style={styles.sectionHint}>Services you have not joined yet</Text>
					</View>
				</View>

				{discoverServices.map((service) => (
					<ServiceCard key={service.id} service={service} enrolled={false} />
				))}

				<View style={{ height: 16 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#F8FAFC',
	},
	headerWrap: {
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
		alignItems: 'center',
		paddingHorizontal: 16,
		marginBottom: 10,
		justifyContent: 'center',
		position: 'relative',
	},
	iconBtn: {
		padding: 2,
		position: 'absolute',
		left: 16,
		zIndex: 2,
	},
	headerTitle: {
		color: '#FFFFFF',
		fontSize: 24,
		fontWeight: '700',
		letterSpacing: 0.2,
		textAlign: 'center',
	},
	scrollBody: {
		backgroundColor: '#F4F6FC',
		paddingHorizontal: 12,
		paddingTop: 10,
		paddingBottom: 70,
	},
	enrolledHeaderBlock: {
		marginBottom: 10,
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#E4EAFF',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderLeftWidth: 4,
		borderLeftColor: '#1F2D8C',
	},
	enrolledTitle: {
		color: '#1E2E68',
		fontSize: 14,
		fontWeight: '800',
		marginBottom: 2,
	},
	enrolledHint: {
		color: '#5B6C9E',
		fontSize: 11,
		fontWeight: '600',
	},
	sectionHeaderBlock: {
		marginBottom: 10,
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#E4EAFF',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderLeftWidth: 4,
		borderLeftColor: '#1F2D8C',
	},
	sectionTitle: {
		color: '#1E2E68',
		fontSize: 14,
		fontWeight: '800',
		marginBottom: 2,
	},
	sectionHint: {
		color: '#5B6C9E',
		fontSize: 11,
		fontWeight: '600',
	},
	seeAll: {
		color: '#2636A7',
		fontSize: 9,
		fontWeight: '700',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#E4EAF6',
		paddingHorizontal: 14,
		paddingTop: 13,
		paddingBottom: 12,
		marginBottom: 10,
	},
	cardTopRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 2,
	},
	avatarText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},
	cardInfo: {
		flex: 1,
		marginLeft: 12,
	},
	titlePriceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardTitle: {
		color: '#1F2B56',
		fontSize: 14,
		fontWeight: '700',
		flex: 1,
		marginRight: 8,
	},
	price: {
		color: '#1F2B56',
		fontSize: 14,
		fontWeight: '700',
	},
	cardSubtitle: {
		marginTop: 2,
		color: '#96A0B8',
		fontSize: 11,
		fontWeight: '600',
	},
	tagsRow: {
		marginTop: 10,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	tagChip: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#EEF2FB',
		borderRadius: 12,
		paddingHorizontal: 9,
		height: 24,
	},
	tagText: {
		marginLeft: 5,
		color: '#6F7B97',
		fontSize: 10,
		fontWeight: '600',
	},
	enrolledFooter: {
		marginTop: 9,
		borderTopWidth: 1,
		borderTopColor: '#EEF2FB',
		paddingTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	activeText: {
		color: '#16A34A',
		fontSize: 11,
		fontWeight: '700',
	},
	nextDateText: {
		color: '#9AA4BC',
		fontSize: 11,
		fontWeight: '600',
	},
	bookButton: {
		marginTop: 10,
		height: 36,
		borderRadius: 10,
		backgroundColor: '#1D2A82',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bookButtonText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '700',
	},
});
