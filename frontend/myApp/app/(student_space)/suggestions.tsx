import React, { useEffect, useState } from 'react';
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
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';

type Tutor = {
	id: number;
	name: string;
	subtitle: string;
	subject: string;
	badge: string;
	avatarBg: string;
	avatarInitial: string;
	subjectColor: string;
};

const mapTeacherToTutor = (teacher: any, index: number): Tutor => {
	const firstName = teacher?.first_name || '';
	const lastName = teacher?.last_name || '';
	const name = `${firstName} ${lastName}`.trim() || 'Teacher';
	const subject = Array.isArray(teacher?.subject) ? (teacher.subject[0] || '') : (teacher?.subject || '');
	const badge = Array.isArray(teacher?.school_levels_taught)
		? (teacher.school_levels_taught[0] || '')
		: (teacher?.school_levels_taught || '');
	const location = teacher?.postal_adress || '';

	return {
		id: teacher?._id || index,
		name,
		subtitle: [subject, badge, location].filter(Boolean).join(' - '),
		subject: subject || 'Tutor',
		badge: badge || 'All levels',
		avatarBg: ['#0EA27F', '#F2B21D', '#E63B3B', '#6A39D6', '#F2940E'][index % 5],
		avatarInitial: firstName ? firstName.charAt(0).toUpperCase() : 'T',
		subjectColor: '#3F53E6',
	};
};

export default function SuggestionsScreen() {
	const router = useRouter();
	const [query , setQuery] = useState('');
	const [searchType, setSearchType] = useState<'location'|'subject'|'level'>('location');
	const [teachers, setTeachers] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showCriteria, setShowCriteria] = useState(false);
	const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
	const [msgText, setMsgText] = useState('');
	const [sending, setSending] = useState(false);


	useEffect(() => {
		const fetchTeachers = async (): Promise<void> => {
			try {
				setLoading(true);
				setMessage('');

				const accessToken = await SecureStore.getItemAsync('accessToken');
				const refreshToken = await SecureStore.getItemAsync('refreshToken');
				const apiRole = await getStudentOrParentRole();
				const searchQuery = query.trim();

				fetch(`${BASE_URL}/${apiRole}/searchTeachers`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({ query: searchQuery }),
				})
					.then(res => res.json())
					.then(data => {
						if (data.succ && Array.isArray(data.teachers)) {
							const mappedTeachers = data.teachers.map((teacher: any, index: number) => mapTeacherToTutor(teacher, index));
							setTeachers(mappedTeachers);
							if (mappedTeachers.length === 0) {
								setMessage(searchQuery ? 'No matching teachers found.' : 'No teachers found.');
							}
						} else if (data.error === 'Token expired!') {
							fetch(`${BASE_URL}/${apiRole}/refresh`, {
								method: 'POST',
								headers: { 'content-type': 'application/json' },
								body: JSON.stringify({ refreshToken }),
							})
								.then(res => res.json())
								.then(refreshData => {
									if (refreshData.accessToken) {
										SecureStore.setItemAsync('accessToken', refreshData.accessToken);
										fetch(`${BASE_URL}/${apiRole}/searchTeachers`, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
												authorization: `Bearer ${refreshData.accessToken}`,
											},
											body: JSON.stringify({ query: searchQuery }),
										})
											.then(res => res.json())
											.then(retryData => {
												if (retryData.succ && Array.isArray(retryData.teachers)) {
													const mappedRetryTeachers = retryData.teachers.map((teacher: any, index: number) => mapTeacherToTutor(teacher, index));
													setTeachers(mappedRetryTeachers);
													if (mappedRetryTeachers.length === 0) {
														setMessage(searchQuery ? 'No matching teachers found.' : 'No teachers found.');
													}
												} else if (retryData.error === 'Invalid token!' || retryData.error === 'No token found!') {
													router.replace('/sign_in');
												} else if (retryData.error) {
													setMessage('Unable to load teachers.');
												}
											})
											.catch(() => {
												setMessage('Unable to load teachers.');
											})
											.finally(() => {
												setLoading(false);
											});
									} else {
										router.replace('/sign_in');
										setLoading(false);
									}
								})
								.catch(() => {
									router.replace('/sign_in');
									setLoading(false);
								});
						} else if (data.error === 'Invalid token!' || data.error === 'No token found!') {
							router.replace('/sign_in');
						} else {
							setMessage('Unable to load teachers.');
						}
					})
					.catch(() => {
						setMessage('Unable to load teachers.');
					})
					.finally(() => {
						setLoading(false);
					});
			} catch (error) {
				setMessage('Unable to load teachers.');
				setLoading(false);
			}
		};

		fetchTeachers();
		}, [query, router]);

	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.phoneFrame}>
				<View style={styles.header}>
					<View style={styles.headerTop}>
						<TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={() => router.replace('/(student_space)/studentSpace')}>
							<Ionicons name="chevron-back" size={20} color="#FFFFFF" />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Suggestions</Text>
						<View style={styles.iconButton} />
					</View>

					{/* Criteria chooser modal */}
					<Modal visible={showCriteria} transparent animationType="fade" onRequestClose={() => setShowCriteria(false)}>
						<TouchableWithoutFeedback onPress={() => setShowCriteria(false)}>
							<View style={styles.criteriaOverlay}>
								<View style={styles.criteriaContent}>
									<TouchableOpacity style={styles.criteriaOption} onPress={() => { setSearchType('location'); setShowCriteria(false); }}>
										<Text style={styles.criteriaOptionText}>Location</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.criteriaOption} onPress={() => { setSearchType('subject'); setShowCriteria(false); }}>
										<Text style={styles.criteriaOptionText}>Subject</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.criteriaOption} onPress={() => { setSearchType('level'); setShowCriteria(false); }}>
										<Text style={styles.criteriaOptionText}>Level</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</Modal>

					<View style={styles.searchContainer}>
						<Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
						<TextInput
						placeholder={`Search by ${searchType}...`}
							placeholderTextColor="#94A3B8"
							style={styles.searchInput}
							value={query}
							onChangeText={(text : string) => setQuery(text)}
						/>
						<TouchableOpacity style={styles.criteriaBtn} onPress={() => setShowCriteria(true)}>
							<Text style={styles.criteriaBtnText}>{searchType.charAt(0).toUpperCase() + searchType.slice(1)}</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.mainContent}>
					<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Tutors for You</Text>
						</View>

						{loading && (
							<View style={styles.loadingWrap}>
								<ActivityIndicator size="large" color="#1E1B6B" />
								<Text style={styles.loadingText}>Loading teachers...</Text>
							</View>
						)}

						{!loading && message ? (
							<Text style={styles.emptyMessage}>{message}</Text>
						) : null}

						{!loading && (
							<View style={styles.listWrap}>
								{teachers.map((tutor: any, idx: number) => (
									<View key={tutor.id ?? idx} style={styles.card}>
										<View style={styles.cardTop}>
											<View style={[styles.avatar, { backgroundColor: tutor.avatarBg || '#6A39D6' }]}> 
												<Text style={styles.avatarText}>{tutor.avatarInitial || (tutor.name ? tutor.name.charAt(0) : 'T')}</Text>
											</View>
											<View style={styles.cardInfo}>
												<Text style={styles.cardName}>{tutor.name}</Text>
												<Text style={styles.cardSubtitle}>{tutor.subtitle}</Text>
												<View style={styles.tagsRow}>
													<Text style={[styles.subjectTag, { color: tutor.subjectColor || '#3F53E6' }]}>{tutor.subject}</Text>
													<Text style={styles.dotTag}>|</Text>
													<Text style={styles.levelTag}>{tutor.badge}</Text>
												</View>
											</View>
										</View>

										<View style={styles.actionsRow}>
									<TouchableOpacity style={styles.requestButton} activeOpacity={0.9} onPress={() => router.push({pathname: '/(student_space)/theacherP', params: {teacherId: tutor.id}})}>
												<Text style={styles.requestButtonText}>View Profile</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={styles.messageButton}
												activeOpacity={0.9}
												onPress={() => { setSelectedTeacherId(String(tutor.id)); setShowModal(true); setMsgText(''); }}
											>
												<Text style={styles.messageButtonText}>Send a Message</Text>
											</TouchableOpacity>
										</View>
									</View>
								))}
							</View>
						)}
					</ScrollView>
				</View>

				<Modal
					visible={showModal}
					transparent
					animationType="fade"
					onRequestClose={() => setShowModal(false)}
				>
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

				</View>
			</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#EEF1FA',
	},
	phoneFrame: {
		flex: 1,
		width: '100%',
		backgroundColor: '#EEF1FA',
		borderRadius: 0,
		overflow: 'hidden',
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
	iconButton: {
		padding: 2,
	},
	headerTitle: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.2,
	},
	searchContainer: {
		marginHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		height: 38,
		paddingLeft: 10,
		paddingRight: 6,
	},
	searchIcon: {
		marginRight: 7,
	},
	filterButton: {
		width: 28,
		height: 28,
		borderRadius: 8,
		backgroundColor: '#1E1B6B',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 8,
	},
	mainContent: {
		flex: 1,
		paddingHorizontal: 14,
		paddingTop: 6,
		paddingBottom: 2,
	},
	contentScroll: {
		paddingBottom: 4,
	},
	searchInput: {
		flex: 1,
		height: '100%',
		color: '#1E293B',
		fontSize: 12,
		fontWeight: '500',
	},
	sectionHeader: {
		paddingTop: 8,
		paddingBottom: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 2,
		marginBottom: 2,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: '#2A2E45',
	},
	sectionHint: {
		fontSize: 11,
		color: '#B0B8CA',
		fontWeight: '600',
	},
	listWrap: {
		paddingTop: 8,
		paddingBottom: 2,
		gap: 10,
	},
	loadingWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 28,
	},
	loadingText: {
		marginTop: 10,
		color: '#64748B',
		fontSize: 13,
		fontWeight: '600',
	},
	emptyMessage: {
		marginTop: 8,
		marginBottom: 4,
		color: '#64748B',
		fontSize: 13,
		fontStyle: 'italic',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#E7EBF4',
	},
	cardTop: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 2,
	},
	avatarText: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 16,
	},
	cardInfo: {
		marginLeft: 11,
		flex: 1,
	},
	cardName: {
		fontSize: 14,
		color: '#2E324A',
		fontWeight: '700',
	},
	cardSubtitle: {
		marginTop: 2,
		color: '#A0A7B8',
		fontSize: 10,
		fontWeight: '600',
	},
	tagsRow: {
		marginTop: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	subjectTag: {
		fontSize: 10,
		fontWeight: '700',
	},
	dotTag: {
		fontSize: 10,
		color: '#D2D6E2',
		fontWeight: '700',
	},
	levelTag: {
		fontSize: 10,
		color: '#535E7A',
		fontWeight: '700',
	},
	actionsRow: {
		flexDirection: 'row',
		marginTop: 10,
		gap: 8,
	},
	requestButton: {
		flex: 1,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#1D2A82',
		justifyContent: 'center',
		alignItems: 'center',
	},
	requestButtonText: {
		color: '#FFFFFF',
		fontSize: 11,
		fontWeight: '700',
	},
	messageButton: {
		flex: 1,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#F2F4FB',
		justifyContent: 'center',
		alignItems: 'center',
	},
	messageButtonText: {
		color: '#2E3A75',
		fontSize: 11,
		fontWeight: '700',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		paddingHorizontal: 20,
		paddingVertical: 16,
		minWidth: 280,
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1E1B6B',
		marginBottom: 14,
		textAlign: 'center',
	},
	modalOption: {
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: '#F4F6FC',
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#E4EAF6',
	},
	modalOptionActive: {
		backgroundColor: '#1E1B6B',
		borderColor: '#1E1B6B',
	},
	modalOptionText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1E293B',
		textAlign: 'center',
	},
	modalOptionTextActive: {
		color: '#FFFFFF',
	},
	filterRow: {
		flexDirection: 'row',
		marginHorizontal: 16,
		marginTop: 10,
		gap: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	filterBtn: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 18,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#E6E9F2',
	},
	filterBtnActive: {
		backgroundColor: '#1E1B6B',
		borderColor: '#1E1B6B',
	},
	filterText: {
		fontSize: 12,
		color: '#334155',
		fontWeight: '700',
	},
	filterTextActive: {
		color: '#FFFFFF',
	},
	criteriaBtn: {
		marginRight: 8,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E6E9F2',
		backgroundColor: '#FFFFFF',
		minWidth: 64,
		alignItems: 'center',
		justifyContent: 'center',
	},
	criteriaBtnText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#334155',
	},
	criteriaOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	criteriaContent: {
		backgroundColor: '#FFFFFF',
		padding: 12,
		borderRadius: 10,
		minWidth: 220,
	},
	criteriaOption: {
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderRadius: 8,
		marginVertical: 4,
		alignItems: 'center',
	},
	criteriaOptionText: {
		fontSize: 14,
		fontWeight: '700',
		color: '#1E1B6B',
	},
});
