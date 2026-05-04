import React, { useState } from 'react';
import {
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Modal,
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';

type Service = {
	id: number;
	serviceId?: string;
	backendId?: string;
	title: string;
	tutor: string;
	price: string;
	duration: string;
	mode: string;
	level: string;
	subject: string;
	comment?: string;
	serviceType?: string;
	verified?: string;
	avatarBg: string;
	avatarLetter: string;
	status?: string;
	nextDate?: string;
	url?: string;
	teacherId?: string;
};

function buildJoinedServices(rawValue: string | string[] | undefined): Service[] {
	const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
	if (!value) return [];

	try {
		const parsed = JSON.parse(value);
		if (!Array.isArray(parsed)) return [];

		return parsed.map((item: any, index: number) => {
			const service = item?.service || {};
			const teacher = item?.teacher || {};
			const title = service?.title || 'Joined service';
			const teacherName = `${teacher?.first_name || ''} ${teacher?.last_name || ''}`.trim() || 'Teacher';
			const audience = service?.target_audiance || 'Joined';
			const mode = service?.mode || 'N/A';
			const cost = service?.cost != null ? `${service.cost} DZD` : 'N/A';
			const serviceType = service?.type || 'service';
			const verified = teacher?.status || 'not verified';
			const comment = service?.comment || '';

			return {
				id: item?._id ? String(item._id) as any : index,
				serviceId: service?._id ? String(service._id) : undefined,
				title,
				tutor: teacherName,
				price: cost,
				duration: '',
				mode,
				level: audience,
				subject: title,
				comment,
				serviceType,
				verified,
				avatarBg: ['#14A78B', '#E94A4A', '#F4B22E', '#6A39D6', '#F59E0B'][index % 5],
				avatarLetter: title.charAt(0).toUpperCase() || 'S',
				status: item?.status || 'Joined service',
				nextDate: item?.nextDate || 'Open service',
			};
		});
	} catch {
		return [];
	}
}

function buildDiscoverServices(rawValue: string | string[] | undefined): Service[] {
	const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
	if (!value) return [];

	try {
		const parsed = JSON.parse(value);
		if (!Array.isArray(parsed)) return [];

		return parsed.map((item: any, index: number) => {
			const service = item?.service || item;
			const teacher = item?.done_by || item?.teacher || service?.done_by || {};
			const title = service?.title || item?.title || 'Service';
			const teacherName = `${teacher?.first_name || ''} ${teacher?.last_name || ''}`.trim() || 'Teacher';
			const audience = service?.target_audiance || item?.target_audiance || 'All levels';
			const mode = service?.mode || item?.mode || 'N/A';
			const cost = service?.cost != null || item?.cost != null ? `${service?.cost ?? item?.cost} DZD` : 'N/A';
			const serviceType = service?.type || item?.type || 'service';
			const verified = teacher?.status || item?.verified || 'not verified';
			const comment = service?.comment || item?.comment || '';

			return {
				id: item?._id ? String(item._id) as any : index + 1000,
				backendId: item?._id ? String(item._id) : undefined,
				serviceId: service?._id ? String(service._id) : undefined,
				title,
				tutor: teacherName,
				price: cost,
				duration: '',
				mode,
				level: audience,
				subject: serviceType,
				comment,
				serviceType,
				verified,
				avatarBg: ['#14A78B', '#E94A4A', '#F4B22E', '#6A39D6', '#F59E0B'][index % 5],
				avatarLetter: title.charAt(0).toUpperCase() || 'S',
				status: item?.status || 'Available',
				nextDate: item?.nextDate || 'Open service',
					url: item?.url || service?.url,
					teacherId: teacher?._id ? String(teacher._id) : (teacher?.id ? String(teacher.id) : undefined),
			};
		});
	} catch {
		return [];
	}
}

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

const ServiceCard = ({ service, enrolled, onContact }: { service: Service; enrolled: boolean; onContact?: (teacherId?: string) => void }) => {
	const router = useRouter();

	const routeParams = {
		serviceId: service.serviceId || '',
		title: service.title,
		type: service.subject,
		serviceType: service.serviceType || 'service',
		comment: service.comment || `Focused ${service.subject.toLowerCase()} support with practical exercises and guided feedback.`,
		target_audiance: service.level,
		mode: service.mode,
		cost: service.price.replace(/\s*DZD/i, '').trim(),
		tutor: service.tutor,
		level: service.level,
		verified: service.verified || 'not verified',
		status: service.status ?? 'Open for request',
		nextDate: service.nextDate ?? 'Schedule to be confirmed',
	} as any;

	const goToDetails = () => {
		router.push({
			pathname: '/(student_space)/ServiceStd',
			params: routeParams,
		} as any);
	};

	const goToRequest = () => {
		router.push({
			pathname: '/(student_space)/servicREq',
			params: routeParams,
		} as any);
	};

	const mainContent = (
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
	);

	const footer = enrolled ? (
		<View style={styles.enrolledFooter}>
			<Text style={styles.activeText}>{service.status}</Text>
			<Text style={styles.nextDateText}>{service.nextDate}</Text>
		</View>
	) : (
		<View style={styles.bookButton}>
			<TouchableOpacity activeOpacity={0.9} onPress={() => onContact && onContact(service.teacherId || service.backendId)}>
				<Text style={styles.bookButtonText}>Contact tutor</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.card}>
			<TouchableOpacity activeOpacity={0.92} onPress={enrolled ? goToDetails : goToRequest}>
				{mainContent}
			</TouchableOpacity>
			{footer}
		</View>
	);
};

export default function StServices() {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
	const [msgText, setMsgText] = useState('');
	const [sending, setSending] = useState(false);
	const { joinedServices: joinedServicesParam, notJoinedServices: notJoinedServicesParam } = useLocalSearchParams<{ joinedServices?: string | string[]; notJoinedServices?: string | string[] }>();
	const enrolledServices = buildJoinedServices(joinedServicesParam);
	const discoverServices = buildDiscoverServices(notJoinedServicesParam);
	const servicesToShow = discoverServices.length > 0 ? discoverServices : [];

	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.headerWrap}>
				<View style={styles.headerTop}>
					<TouchableOpacity style={styles.iconBtn} onPress={() => router.replace("/(student_space)/studentSpace")}>
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

				{enrolledServices.length === 0 ? (
					<Text style={{ color: '#64748B', fontSize: 14, fontStyle: 'italic', marginBottom: 12, marginLeft: 4 }}>No enrolled services yet.</Text>
				) : (
					enrolledServices.map((service) => (
						<ServiceCard key={service.id} service={service} enrolled />
					))
				)}

				<View style={styles.sectionHeaderBlock}> 
					<View>
						<Text style={styles.sectionTitle}>Discover Services</Text>
						<Text style={styles.sectionHint}>Services you have not joined yet</Text>
					</View>
				</View>

				{servicesToShow.length === 0 ? (
					<Text style={{ color: '#64748B', fontSize: 14, fontStyle: 'italic', marginBottom: 12, marginLeft: 4 }}>No available services yet.</Text>
				) : (
					servicesToShow.map((service) => (
					<ServiceCard key={service.id} service={service} enrolled={false} onContact={(teacherId?: string) => { setSelectedTeacherId(teacherId ?? null); setMsgText(''); setShowModal(true); }} />
					))
				)}

				<View style={{ height: 16 }} />
				{/* Contact tutor modal */}
				<Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
					<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
						<TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowModal(false); setSelectedTeacherId(null); }}>
							<View style={styles.modalOverlay}>
								<View style={styles.modalContent}>
									<Text style={styles.modalTitle}>Send a Message</Text>
									<TextInput
										placeholder="Enter your message (max 100 chars)"
										placeholderTextColor="#94A3B8"
										style={{
											borderWidth: 1,
											borderColor: '#E4EAF6',
											borderRadius: 8,
											padding: 10,
											minHeight: 80,
											textAlignVertical: 'top',
										}}
										value={msgText}
										onChangeText={(t: string) => setMsgText(t)}
										multiline
										maxLength={100}
									/>
									<View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
										<TouchableOpacity
											style={[styles.requestButton, { flex: 1, backgroundColor: '#E4EAF6' }]}
											onPress={() => { setShowModal(false); setSelectedTeacherId(null); }}
										>
											<Text style={[styles.requestButtonText, { color: '#1E1B6B' }]}>Cancel</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[styles.requestButton, { flex: 1 }]}
											onPress={async () => {
												if (!msgText || msgText.trim().length === 0) {
													Alert.alert('Validation', 'Message cannot be empty');
													return;
												}
												setSending(true);
												try {
													const accessToken = await SecureStore.getItemAsync('accessToken');
													const role = await getStudentOrParentRole();
													const body = { msg: msgText.trim(), receiverId: selectedTeacherId };
													const res = await fetch(`${BASE_URL}/${role}/sendmessage`, {
														method: 'POST',
														headers: { 'Content-Type': 'application/json', authorization: `Bearer ${accessToken}` },
														body: JSON.stringify(body),
													});
													const data = await res.json();
													if (data.succ) {
														Alert.alert('Success', 'Message sent');
														setShowModal(false);
														setSelectedTeacherId(null);
													} else if (data.error) {
														Alert.alert('Error', typeof data.error === 'string' ? data.error : 'Unable to send message');
													} else {
														Alert.alert('Error', 'Unable to send message');
													}
												} catch (e) {
													console.error(e);
													Alert.alert('Error', 'Unable to send message');
												} finally {
													setSending(false);
												}
											}}
										>
											{sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.requestButtonText}>Send</Text>}
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				</Modal>
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
	emptyState: {
		color: '#64748B',
		fontSize: 14,
		fontStyle: 'italic',
		marginBottom: 12,
		marginLeft: 4,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(10,12,30,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	modalContent: {
		width: '100%',
		maxWidth: 720,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: '800',
		color: '#0E1B4A',
		marginBottom: 8,
	},
	requestButton: {
		height: 44,
		borderRadius: 10,
		backgroundColor: '#1D2A82',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 12,
	},
	requestButtonText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: '700',
	},
});
