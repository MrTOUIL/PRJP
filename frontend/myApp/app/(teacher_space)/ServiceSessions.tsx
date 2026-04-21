import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	StatusBar,
	Platform,
	TextInput,
	ActivityIndicator,
} from 'react-native';
import Animated, {
	FadeInDown,
} from 'react-native-reanimated';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';

const COLORS = {
	primary: '#1A1A5E',
	secondary: '#FFD700',
	background: '#F5F6FA',
	cardBg: '#FFFFFF',
	textDark: '#1A1A1A',
	textLight: '#8E8E93',
	green: '#00C853',
	red: '#FF3D00',
	purpleStart: '#2E2E8C',
	purpleEnd: '#1A1A5E',
};

const { width } = Dimensions.get('window');

const SectionHeader = ({ title, actionText, onAction }: { title: string; actionText?: string; onAction?: () => void }) => (
	<View style={styles.sectionHeader}>
		<Text style={styles.sectionTitle}>{title}</Text>
		{actionText && (
			<TouchableOpacity onPress={onAction}>
				<Text style={styles.sectionAction}>{actionText}</Text>
			</TouchableOpacity>
		)}
	</View>
);

export default function ServiceSessions() {
	const router = useRouter();
	const { id_service } = useLocalSearchParams();
	const [serviceSessions, setServiceSessions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [editSessionVisible, setEditSessionVisible] = useState(false);
	const [selectedSession, setSelectedSession] = useState<any>(null);
	const [editedStatus, setEditedStatus] = useState('confirmed');
	const [editedDate, setEditedDate] = useState('');
	const [editedLocation, setEditedLocation] = useState('');
	const [editedStartTime, setEditedStartTime] = useState('');
	const [editedEndTime, setEditedEndTime] = useState('');
	const [editMessage, setEditMessage] = useState('');
	const [loadingEdit, setLoadingEdit] = useState(false);

	useEffect(() => {
		const fetchServiceSessions = async () => {
			try {
				
				const accessToken = await SecureStore.getItemAsync('accessToken');
				const refreshToken = await SecureStore.getItemAsync('refreshToken');

				if (!id_service || !accessToken) {
					setLoading(false);
					return;
				}

				fetch(`${BASE_URL}/teacher/servicesession`, {
					method: 'POST',
					headers: { 'content-type': 'application/json', 'authorization': `Bearer ${accessToken}` },
					body: JSON.stringify({ serviceid: id_service }),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.succ) {
							setServiceSessions(data.sessions || []);
							setLoading(false);
						} else if (data.error === 'Token expired!') {
							fetch(`${BASE_URL}/teacher/refresh`, {
								method: 'POST',
								headers: { 'content-type': 'application/json' },
								body: JSON.stringify({ refreshToken }),
							})
								.then((res) => res.json())
								.then((refreshData) => {
									if (refreshData.accessToken) {
										SecureStore.setItemAsync('accessToken', refreshData.accessToken);
										fetch(`${BASE_URL}/teacher/servicesession`, {
											method: 'POST',
											headers: { 'content-type': 'application/json', 'authorization': `Bearer ${refreshData.accessToken}` },
											body: JSON.stringify({ serviceid: id_service }),
										})
											.then((res) => res.json())
											.then((retryData) => {
												if (retryData.succ) {
													setServiceSessions(retryData.sessions || []);
												} else {
													router.replace('/sign_in');
												}
												setLoading(false);
											})
											.catch(() => {
												setLoading(false);
												router.replace('/sign_in');
											});
									} else {
										setLoading(false);
										router.replace('/sign_in');
									}
								})
								.catch(() => {
									setLoading(false);
									router.replace('/sign_in');
								});
						} else {
							setLoading(false);
							setServiceSessions([]);
						}
					})
					.catch(() => {
						setLoading(false);
						setServiceSessions([]);
					});
			} catch (e) {
				setLoading(false);
				router.replace('/sign_in');
			}
		};

		fetchServiceSessions();
	}, [id_service]);

	const openEditSession = (session: any) => {
		setSelectedSession(session);
		setEditedStatus((session?.status || '').toLowerCase() === 'postponed' ? 'postponed' : 'confirmed');
		setEditedDate(session?.Date || '');
		setEditedLocation(session?.location || '');
		setEditedStartTime(session?.start_time || '');
		setEditedEndTime(session?.end_time || '');
		setEditMessage('');
		setEditSessionVisible(true);
	};

	const handleEditSession = async (): Promise<void> => {
		if (!selectedSession?._id) {
			setEditMessage('Session not found.');
			return;
		}

		if (editedStatus === 'confirmed' && !editedDate.trim()) {
			setEditMessage('Please enter a date.');
			return;
		}

		if (editedStatus === 'confirmed' && !editedLocation.trim()) {
			setEditMessage('Please enter a location.');
			return;
		}

		if (editedStatus === 'confirmed' && !editedStartTime.trim()) {
			setEditMessage('Please enter start time.');
			return;
		}

		if (editedStatus === 'confirmed' && !editedEndTime.trim()) {
			setEditMessage('Please enter end time.');
			return;
		}

		try {
			const accessToken = await SecureStore.getItemAsync('accessToken');
			const refreshToken = await SecureStore.getItemAsync('refreshToken');
			setEditMessage('');
			setLoadingEdit(true);

			const getErrorMessage = (err: any): string => {
				if (Array.isArray(err) && err.length > 0) {
					return err[0]?.msg || 'invalid inputs';
				}
				if (typeof err === 'string' && err.trim()) {
					return err;
				}
				return 'invalid inputs';
			};

			fetch(`${BASE_URL}/teacher/editsession`, {
				method: 'PUT',
				headers: { 'content-type': 'application/json', 'authorization': `Bearer ${accessToken}` },
				body: JSON.stringify({
					sessionid: selectedSession._id || selectedSession.id,
					newstat: editedStatus === 'confirmed' ? 'Confirmed' : 'Postponed',
					Date: editedStatus === 'confirmed' ? editedDate.trim() : '',
					location: editedStatus === 'confirmed' ? editedLocation.trim() : (selectedSession?.location || ''),
					start_time: editedStatus === 'confirmed' ? editedStartTime.trim() : (selectedSession?.start_time || ''),
					end_time: editedStatus === 'confirmed' ? editedEndTime.trim() : (selectedSession?.end_time || ''),
				}),
			})
				.then(res => res.json())
				.then(data => {
					if (data.succ) {
						setServiceSessions((prev) => prev.map((session) => (
							session._id === selectedSession._id
								? {
									...session,
									status: editedStatus === 'confirmed' ? 'Confirmed' : 'Postponed',
									Date: editedStatus === 'confirmed' ? editedDate.trim() : session.Date,
									location: editedStatus === 'confirmed' ? editedLocation.trim() : session.location,
								}
								: session
						)));
						setEditSessionVisible(false);
						setSelectedSession(null);
						setLoadingEdit(false);
					} else if (data.error === 'Token expired!') {
						fetch(`${BASE_URL}/teacher/refresh`, {
							method: 'POST',
							headers: { 'content-type': 'application/json' },
							body: JSON.stringify({ refreshToken }),
						})
							.then(res => res.json())
							.then(data => {
								if (data.accessToken) {
									SecureStore.setItemAsync('accessToken', data.accessToken);
									fetch(`${BASE_URL}/teacher/editsession`, {
										method: 'PUT',
										headers: { 'content-type': 'application/json', 'authorization': `Bearer ${data.accessToken}` },
										body: JSON.stringify({
											sessionid: selectedSession._id || selectedSession.id,
											newstat: editedStatus === 'confirmed' ? 'Confirmed' : 'Postponed',
											Date: editedStatus === 'confirmed' ? editedDate.trim() : '',
											location: editedStatus === 'confirmed' ? editedLocation.trim() : (selectedSession?.location || ''),
											start_time: editedStatus === 'confirmed' ? editedStartTime.trim() : (selectedSession?.start_time || ''),
											end_time: editedStatus === 'confirmed' ? editedEndTime.trim() : (selectedSession?.end_time || ''),
										}),
									})
										.then(res => res.json())
										.then(data => {
											if (data.succ) {
												setServiceSessions((prev) => prev.map((session) => (
													session._id === selectedSession._id
														? {
															...session,
															status: editedStatus === 'confirmed' ? 'Confirmed' : 'Postponed',
															Date: editedStatus === 'confirmed' ? editedDate.trim() : session.Date,
															location: editedStatus === 'confirmed' ? editedLocation.trim() : session.location,
															start_time: editedStatus === 'confirmed' ? editedStartTime.trim() : session.start_time,
															end_time: editedStatus === 'confirmed' ? editedEndTime.trim() : session.end_time,
														}
														: session
												)));
												setEditSessionVisible(false);
												setSelectedSession(null);
											} else if (data.error) {
												setEditMessage(getErrorMessage(data.error));
											} else {
												router.replace('/sign_in');
											}
											setLoadingEdit(false);
										})
										.catch(() => {
											setLoadingEdit(false);
											setEditMessage('Unable to update session.');
										});
								} else {
									setLoadingEdit(false);
									router.replace('/sign_in');
								}
							})
							.catch(() => {
								setLoadingEdit(false);
								router.replace('/sign_in');
							});
					} else if (data.error) {
						setLoadingEdit(false);
						setEditMessage(getErrorMessage(data.error));
					} else {
						setLoadingEdit(false);
						router.replace('/sign_in');
					}
				})
				.catch(() => {
					setLoadingEdit(false);
					setEditMessage('Unable to update session.');
				});
		} catch (e) {
			setLoadingEdit(false);
			setEditMessage('Unable to update session.');
			router.replace('/sign_in');
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
					<Ionicons name="arrow-back" size={24} color="#FFF" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Service Sessions</Text>
			</View>

			<ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
				<Animated.View entering={FadeInDown.delay(100).springify()} style={styles.sectionContainer}>
					<SectionHeader title="Related Sessions" />

					{loading && <Text style={styles.emptyText}>Loading sessions...</Text>}

					{!loading && serviceSessions.length === 0 && (
						<Text style={styles.emptyText}>No sessions available for this service.</Text>
					)}

					{!loading && serviceSessions.length > 0 && serviceSessions.map((session: any, idx: number) => (
						<View key={session._id || idx} style={styles.sessionCard}>
							<View style={styles.sessionHeader}>
								<View style={{ flex: 1 }}>
									<Text style={styles.sessionTitle}>Session #{idx + 1}</Text>
									<Text style={styles.sessionSubtitle}>{session.location}</Text>
								</View>
								<View>
									<Text style={styles.sessionStatus}>{session.status}</Text>
								</View>
							</View>

							<View style={styles.sessionDetails}>
								<View style={styles.detailRow}>
									<Feather name="calendar" size={14} color="#A0A0E0" />
									<Text style={styles.detailText}>{session.Date}</Text>
								</View>
								<View style={styles.detailRow}>
									<Feather name="clock" size={14} color="#A0A0E0" />
									<Text style={styles.detailText}>{session.start_time} - {session.end_time}</Text>
								</View>
							</View>

							<View style={styles.actionButtonsRow}>
								<TouchableOpacity
									style={styles.actionButton}
									onPress={() => router.push({
										pathname: '/(teacher_space)/DocumentService',
										params: { sessionid: session._id },
									})}
								>
									<MaterialCommunityIcons name="upload" size={16} color="#FFF" />
									<Text style={styles.actionButtonText}>Upload Document</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={[styles.actionButton, styles.secondaryButton]}
									onPress={() => router.push({
										pathname: '/(teacher_space)/AllDocService',
										params: { sessionid: session._id },
									})}
								>
									<MaterialCommunityIcons name="file-document" size={16} color={COLORS.primary} />
									<Text style={[styles.actionButtonText, styles.secondaryButtonText]}>See Documents</Text>
								</TouchableOpacity>
							</View>

							<TouchableOpacity style={styles.editStatusButton} onPress={() => openEditSession(session)}>
								<Feather name="edit-3" size={16} color={COLORS.primary} />
								<Text style={styles.editStatusButtonText}>Edit Status</Text>
							</TouchableOpacity>
						</View>
					))}
				</Animated.View>

				{editSessionVisible && (
					<View style={styles.fullNameOverlay}>
						<View style={styles.fullNameCard}>
							<Text style={styles.fullNameTitle}>Edit session</Text>
							<Text style={styles.fullNameSubtitle}>Update session status and details.</Text>

							<View style={styles.fullNameFieldGroup}>
								<Text style={styles.fullNameLabel}>Status</Text>
								<View style={styles.statusRow}>
									<TouchableOpacity
										style={[styles.statusOption, editedStatus === 'confirmed' && styles.statusOptionActive]}
										onPress={() => setEditedStatus('confirmed')}
									>
										<Text style={[styles.statusOptionText, editedStatus === 'confirmed' && styles.statusOptionTextActive]}>Confirmed</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.statusOption, editedStatus === 'postponed' && styles.statusOptionActive]}
										onPress={() => setEditedStatus('postponed')}
									>
										<Text style={[styles.statusOptionText, editedStatus === 'postponed' && styles.statusOptionTextActive]}>Postponed</Text>
									</TouchableOpacity>
								</View>
							</View>

							{editedStatus === 'confirmed' && (
								<>
									<View style={styles.fullNameFieldGroup}>
										<Text style={styles.fullNameLabel}>New date</Text>
										<TextInput
											style={styles.fullNameInput}
											placeholder="DD/MM/YYYY"
											placeholderTextColor="#A0A0A8"
											value={editedDate}
											onChangeText={(text: string) => setEditedDate(text)}
										/>
									</View>

									<View style={styles.fullNameFieldGroup}>
										<Text style={styles.fullNameLabel}>Location</Text>
										<TextInput
											style={styles.fullNameInput}
											placeholder="Enter location"
											placeholderTextColor="#A0A0A8"
											value={editedLocation}
											onChangeText={(text: string) => setEditedLocation(text)}
										/>
									</View>

									<View style={styles.fullNameFieldGroup}>
										<Text style={styles.fullNameLabel}>Start time</Text>
										<TextInput
											style={styles.fullNameInput}
											placeholder="HH:MM"
											placeholderTextColor="#A0A0A8"
											value={editedStartTime}
											onChangeText={(text: string) => setEditedStartTime(text)}
										/>
									</View>

									<View style={styles.fullNameFieldGroup}>
										<Text style={styles.fullNameLabel}>End time</Text>
										<TextInput
											style={styles.fullNameInput}
											placeholder="HH:MM"
											placeholderTextColor="#A0A0A8"
											value={editedEndTime}
											onChangeText={(text: string) => setEditedEndTime(text)}
										/>
									</View>
								</>
							)}

							<View style={styles.fullNameActions}>
								<TouchableOpacity style={styles.cancelButton} onPress={() => setEditSessionVisible(false)}>
									<Text style={styles.cancelButtonText}>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.submitButton} activeOpacity={0.85} onPress={handleEditSession}>
									<Text style={styles.submitButtonText}>Submit changes</Text>
								</TouchableOpacity>
							</View>

							{loadingEdit && (
								<View style={styles.editNameLoadingRow}>
									<ActivityIndicator size="small" color={COLORS.primary} />
									<Text style={styles.editNameLoadingText}>Loading...</Text>
								</View>
							)}

							{!!editMessage && (
								<Text style={styles.editNameMessageText}>{editMessage}</Text>
							)}
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	header: {
		backgroundColor: COLORS.primary,
		paddingTop: Platform.OS === 'android' ? 40 : 20,
		paddingBottom: 20,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	backBtn: {
		marginRight: 15,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFF',
	},
	scrollContent: {
		flex: 1,
	},
	sectionContainer: {
		marginHorizontal: 20,
		marginTop: 20,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: COLORS.textDark,
	},
	sectionAction: {
		fontSize: 14,
		color: COLORS.primary,
		fontWeight: '500',
	},
	emptyText: {
		color: '#999',
		fontStyle: 'italic',
	},
	sessionCard: {
		backgroundColor: COLORS.cardBg,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sessionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	sessionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLORS.textDark,
	},
	sessionSubtitle: {
		fontSize: 14,
		color: COLORS.textLight,
		marginTop: 2,
	},
	sessionStatus: {
		fontSize: 12,
		fontWeight: 'bold',
		color: COLORS.green,
		textTransform: 'uppercase',
	},
	sessionDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	detailText: {
		fontSize: 14,
		color: COLORS.textLight,
		marginLeft: 6,
	},
	actionButtonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 10,
		marginTop: 14,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.primary,
		paddingVertical: 10,
		borderRadius: 8,
		gap: 6,
	},
	secondaryButton: {
		backgroundColor: '#F0F0F0',
		borderWidth: 1,
		borderColor: COLORS.primary,
	},
	actionButtonText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#FFF',
	},
	secondaryButtonText: {
		color: COLORS.primary,
	},
	editStatusButton: {
		marginTop: 10,
		height: 44,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#D8DCE6',
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 8,
	},
	editStatusButtonText: {
		color: COLORS.primary,
		fontSize: 13,
		fontWeight: '700',
	},
	fullNameOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(10, 16, 32, 0.45)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		zIndex: 50,
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
	statusRow: {
		flexDirection: 'row',
		gap: 10,
	},
	statusOption: {
		flex: 1,
		height: 46,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#D8DCE6',
		backgroundColor: '#FBFCFF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusOptionActive: {
		borderColor: COLORS.primary,
		backgroundColor: '#E0E7FF',
	},
	statusOptionText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#5F6472',
	},
	statusOptionTextActive: {
		color: COLORS.primary,
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
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 12,
		gap: 8,
	},
	editNameLoadingText: {
		fontSize: 13,
		color: COLORS.textLight,
	},
	editNameMessageText: {
		marginTop: 10,
		fontSize: 13,
		color: COLORS.red,
	},
});
