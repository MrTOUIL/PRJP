import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../../constants/api';
import { getStudentOrParentRole } from '../../constants/roleApi';

type ParamValue = string | string[] | undefined;

type SessionState = 'next' | 'upcoming' | 'done';

type SessionRow = {
	id: number;
	title: string;
	subtitle: string;
	badge: string;
	state: SessionState;
};

type DocumentRow = {
	id: number;
	name: string;
	date: string;
	icon: keyof typeof Ionicons.glyphMap;
	color: string;
};

const pickFirst = (value: ParamValue, fallback: string) => {
	if (Array.isArray(value)) {
		return value[0] ?? fallback;
	}
	return value ?? fallback;
};

const parseTutor = (rawTutor: string) => {
	const parts = rawTutor.split('|').map((part) => part.trim()).filter(Boolean);
	return {
		name: parts[0] ?? rawTutor,
		meta: parts[1] ?? 'Mathematics & Physics',
	};
};

const inferDomain = (subject: string) => {
	if (/math/i.test(subject)) return 'Mathematics';
	if (/physic/i.test(subject)) return 'Physics';
	if (/chem/i.test(subject)) return 'Chemistry';
	if (/bio/i.test(subject)) return 'Biology';
	if (/english|language/i.test(subject)) return 'Languages';
	return 'Academic Support';
};

const parseSessionDateTime = (dateStr: string | undefined, timeStr: string | undefined) => {
	if (!dateStr || !timeStr || typeof dateStr !== 'string') return Number.POSITIVE_INFINITY;
	const parts = dateStr.split('/');
	if (parts.length !== 3) return Number.POSITIVE_INFINITY;
	const [day, month, year] = parts;
	const parsed = new Date(`${year}-${month}-${day}T${timeStr}`);
	return Number.isNaN(parsed.getTime()) ? Number.POSITIVE_INFINITY : parsed.getTime();
};

export default function ServiceStd() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [sessions, setSessions] = useState<SessionRow[]>([]);
	const [loadingSessions, setLoadingSessions] = useState(false);
	const [documents, setDocuments] = useState<any[]>([]);
	const [loadingDocuments, setLoadingDocuments] = useState(false);

	const serviceId = pickFirst(params.serviceId, '');
	const title = pickFirst(params.title, 'Individual Math Sessions');
	const subject = pickFirst(params.subject, pickFirst(params.type, 'Mathematics'));
	const domain = pickFirst(params.domain, inferDomain(subject));
	const type = pickFirst(params.serviceType, pickFirst(params.type, 'service'));
	const targetAudience = pickFirst(params.target_audiance, 'Terminale S');
	const mode = pickFirst(params.mode, 'Online');
	const cost = pickFirst(params.cost, '800');
	const comment = pickFirst(
		params.comment,
		'Personalized one-on-one sessions focused on exam preparation, problem-solving techniques and concept reinforcement. Exercises and summaries are shared after each session.',
	);
	const tutor = pickFirst(params.tutor, 'Sara Belhadj | Mathematics & Physics');
	const level = pickFirst(params.level, targetAudience);
	const verifiedStatus = pickFirst(params.verified, 'not verified').toLowerCase();
	const isVerified = verifiedStatus === 'verified' || verifiedStatus === 'true' || verifiedStatus === 'yes';
	const tutorInfo = parseTutor(tutor);
	const teacherInitial = tutorInfo.name.charAt(0).toUpperCase();
	const costLabel = `${cost} DZD`;

	useEffect(() => {
		const fetchSessionsAndDocuments = async () => {
			if (!serviceId) {
				setSessions([]);
				setDocuments([]);
				return;
			}

			try {
				setLoadingSessions(true);
				setLoadingDocuments(true);
				const accessToken = await SecureStore.getItemAsync('accessToken');
				const refreshToken = await SecureStore.getItemAsync('refreshToken');
				const apiRole = await getStudentOrParentRole();

				const parseResponseSafely = async (response: Response) => {
					const contentType = response.headers.get('content-type') || '';
					if (contentType.includes('application/json')) {
						try {
							return await response.json();
						} catch (e) {
							return { error: 'Invalid JSON', raw: await response.text(), status: response.status };
						}
					}
					// fallback: return raw text so we can log HTML/error pages
					const text = await response.text();
					return { error: 'Non-JSON response', raw: text, status: response.status };
				};

				const load = async (token: string | null | undefined) => {
					const response = await fetch(`${BASE_URL}/${apiRole}/joinedServices/${serviceId}/sessions`, {
						method: 'GET',
						headers: { authorization: `Bearer ${token}` },
					});
					return parseResponseSafely(response);
				};

				const loadDocs = async (token: string | null | undefined) => {
					const response = await fetch(`${BASE_URL}/${apiRole}/joinedServices/${serviceId}/sessions/documents`, {
						method: 'GET',
						headers: { authorization: `Bearer ${token}` },
					});
					return parseResponseSafely(response);
				};

				let data = await load(accessToken);
				let docData = await loadDocs(accessToken);

				if (data?.error === 'Token expired!' || docData?.error === 'Token expired!') {
					const refreshResponse = await fetch(`${BASE_URL}/${apiRole}/refresh`, {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ refreshToken }),
					});
					const refreshData = await refreshResponse.json();
					if (refreshData.accessToken) {
						await SecureStore.setItemAsync('accessToken', refreshData.accessToken);
						data = await load(refreshData.accessToken);
						docData = await loadDocs(refreshData.accessToken);
					} else {
						router.replace('/sign_in');
						return;
					}
				}

				if (Array.isArray(data?.sessions)) {
					const mappedSessions: SessionRow[] = [...data.sessions]
						.sort((left: any, right: any) => parseSessionDateTime(left?.Date, left?.start_time) - parseSessionDateTime(right?.Date, right?.start_time))
						.map((session: any, index: number) => {
							const isDone = String(session?.status || '').toLowerCase().includes('done') || String(session?.status || '').toLowerCase().includes('completed');
							return {
								id: index + 1,
								title: session?.Date ? `${session.Date} · ${session.start_time || ''}`.trim() : 'Session',
								subtitle: `${session?.location || 'Online'} · ${session?.end_time ? `${session.start_time || ''} - ${session.end_time}` : session?.start_time || ''}`.trim(),
								badge: session?.status || 'Upcoming',
								state: (isDone ? 'done' : index === 0 ? 'next' : 'upcoming') as SessionState,
							};
						});
					setSessions(mappedSessions);
				} else {
					setSessions([]);
				}

				if (Array.isArray(docData?.documentslist)) {
					setDocuments(docData.documentslist);
				} else {
					setDocuments([]);
				}
			} catch (err) {
				console.error('Error fetching sessions/documents:', err);
				setSessions([]);
				setDocuments([]);
			} finally {
				setLoadingSessions(false);
				setLoadingDocuments(false);
			}
		};

		fetchSessionsAndDocuments();
	}, [router, serviceId]);

	const renderDocuments = () => {
		if (loadingDocuments) {
			return (
				<View style={{ paddingVertical: 12 }}>
					<ActivityIndicator color="#1E2378" />
				</View>
			);
		}

		if (!loadingDocuments && documents.length === 0) {
			return <Text style={styles.emptySessions}>No documents available for this service yet.</Text>;
		}

		return documents.map((doc, index) => (
			<View key={doc._id || index} style={styles.documentRow}>
				<View style={styles.documentIconBox}>
					<Ionicons name="document-text-outline" size={20} color="#E74C3C" />
				</View>
				<TouchableOpacity onPress={() => doc.url && openUrl(doc.url)} style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }} activeOpacity={0.8}>
					<Text style={styles.documentName}>{String(doc.title || 'Document')}</Text>
				</TouchableOpacity>
			</View>
		));
	};

	const openUrl = async (url: string) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			} else {
				console.warn('Cannot open URL:', url);
			}
		} catch (err) {
			console.error('openUrl error', err);
		}
	};

	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.headerSurface}>
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()} activeOpacity={0.85}>
						<Ionicons name="chevron-back" size={22} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.heroTitleDark} numberOfLines={2}>{String(title)}</Text>
					<View style={styles.pricePill}>
						<Text style={styles.pricePillText}>{String(costLabel)}</Text>
					</View>
				</View>
			</View>

			<ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>TEACHER</Text>
						<View style={styles.sectionLine} />
					</View>
					<View style={styles.teacherCard}>
						<View style={styles.teacherAvatar}>
							<Text style={styles.teacherAvatarText}>{String(teacherInitial)}</Text>
						</View>
						<View style={styles.teacherContent}>
							<Text style={styles.teacherName}>{String(tutorInfo.name)}</Text>
						</View>
						<View style={styles.verifiedPill}>
							<Text style={styles.verifiedText}>{isVerified ? 'Verified' : 'Not Verified'}</Text>
						</View>
					</View>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>SERVICE INFO</Text>
						<View style={styles.sectionLine} />
					</View>
					<View style={styles.infoGrid}>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>DOMAIN</Text>
							<Text style={styles.infoValue}>{String(domain)}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>SUBJECT</Text>
							<Text style={styles.infoValue}>{String(subject)}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>MODE</Text>
							<Text style={styles.infoValue}>{String(mode)}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>TYPE</Text>
							<Text style={styles.infoValue}>{String(type)}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>LEVEL</Text>
							<Text style={styles.infoValue}>{String(level)}</Text>
						</View>
					</View>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>DESCRIPTION</Text>
						<View style={styles.sectionLine} />
					</View>
					<Text style={styles.descriptionText}>{String(comment)}</Text>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>SESSIONS</Text>
						<View style={styles.sectionLine} />
					</View>

					{loadingSessions ? (
						<View style={{ paddingVertical: 12 }}>
							<ActivityIndicator color="#1E2378" />
						</View>
					) : sessions.length === 0 ? (
						<Text style={styles.emptySessions}>No sessions found for this service.</Text>
					) : sessions.map((session) => (
						<View key={session.id} style={[styles.sessionRow, session.state === 'next' && styles.sessionRowNext]}>
							<View style={[styles.sessionIndexBox, session.state === 'next' && styles.sessionIndexBoxNext]}>
								{session.state === 'done' ? (
									<Ionicons name="checkmark" size={18} color="#16A34A" />
								) : (
									<Text style={[styles.sessionIndexText, session.state === 'next' && styles.sessionIndexTextNext]}>{String(session.id)}</Text>
								)}
							</View>
							<View style={styles.sessionTexts}>
								<Text style={[styles.sessionTitle, session.state === 'next' && styles.sessionTitleNext]}>{String(session.title)}</Text>
								<Text style={[styles.sessionSubtitle, session.state === 'next' && styles.sessionSubtitleNext]}>{String(session.subtitle)}</Text>
							</View>
							<View style={[styles.sessionBadge, session.state === 'next' && styles.sessionBadgeNext, session.state === 'done' && styles.sessionBadgeDone]}>
								<Text style={[styles.sessionBadgeText, session.state === 'next' && styles.sessionBadgeTextNext, session.state === 'done' && styles.sessionBadgeTextDone]}>
									{String(session.badge)}
								</Text>
							</View>
						</View>
					))}
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>DOCUMENTS</Text>
						<View style={styles.sectionLine} />
					</View>

				{renderDocuments()}
				</View>

			<View style={{ height: 20 }} />
		</ScrollView>		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#ECEEF5',
	},
	headerSurface: {
		backgroundColor: '#1E2378',
		paddingTop: 30,
		paddingBottom: 18,
		paddingHorizontal: 14,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 14,
		paddingTop: 4,
		gap: 12,
	},
	headerIconButton: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: '#27318C',
		alignItems: 'center',
		justifyContent: 'center',
	},
	heroTitleDark: {
		flex: 1,
		fontSize: 18,
		lineHeight: 22,
		fontWeight: '700',
		color: '#FFFFFF',
		marginLeft: 12,
		marginRight: 12,
	},
	pricePill: {
		height: 32,
		borderRadius: 16,
		paddingHorizontal: 10,
		backgroundColor: '#FF8A1C',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 1,
	},
	pricePillText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	scrollBody: {
		paddingHorizontal: 12,
		paddingTop: 12,
		paddingBottom: 100,
	},
	sectionCard: {
		backgroundColor: '#F8F9FD',
		borderRadius: 24,
		paddingHorizontal: 14,
		paddingVertical: 14,
		marginBottom: 12,
	},
	sectionHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 15,
		fontWeight: '700',
		letterSpacing: 1,
		color: '#0F236C',
	},
	sectionLine: {
		marginLeft: 10,
		height: 1,
		flex: 1,
		backgroundColor: '#D7DCEB',
	},
	emptySessions: {
		color: '#64748B',
		fontSize: 13,
		fontStyle: 'italic',
		paddingVertical: 8,
	},
	teacherCard: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 16,
		padding: 12,
		backgroundColor: '#EDEFF7',
	},
	teacherAvatar: {
		width: 56,
		height: 56,
		borderRadius: 16,
		backgroundColor: '#1FB657',
		alignItems: 'center',
		justifyContent: 'center',
	},
	teacherAvatarText: {
		fontSize: 28,
		fontWeight: '800',
		color: '#FFFFFF',
	},
	teacherContent: {
		flex: 1,
		marginLeft: 11,
	},
	teacherName: {
		fontSize: 16,
		fontWeight: '700',
		color: '#0B1A4C',
	},
	teacherMeta: {
		marginTop: 1,
		fontSize: 12,
		fontWeight: '400',
		color: '#4D5A86',
	},
	verifiedPill: {
		height: 28,
		borderRadius: 14,
		paddingHorizontal: 12,
		backgroundColor: '#E6E9F9',
		alignItems: 'center',
		justifyContent: 'center',
	},
	verifiedText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#3D52D3',
	},
	infoGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	infoCell: {
		width: '48.4%',
		borderRadius: 18,
		paddingHorizontal: 12,
		paddingVertical: 14,
		marginBottom: 10,
		backgroundColor: '#F2F4FB',
		borderWidth: 1,
		borderColor: '#DDE3F3',
		shadowColor: '#0B102A',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 6,
		elevation: 1,
	},
	infoLabel: {
		fontSize: 10,
		fontWeight: '700',
		letterSpacing: 0.8,
		color: '#8B94B3',
		marginBottom: 6,
	},
	infoValue: {
		fontSize: 13,
		fontWeight: '700',
		color: '#0A1A4B',
		lineHeight: 18,
	},
	descriptionText: {
		fontSize: 12,
		lineHeight: 21,
		fontWeight: '400',
		color: '#364776',
	},
	sessionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 16,
		padding: 10,
		marginBottom: 10,
		backgroundColor: '#F1F3FA',
	},
	sessionRowNext: {
		backgroundColor: '#252F89',
	},
	sessionIndexBox: {
		width: 46,
		height: 46,
		borderRadius: 12,
		backgroundColor: '#E5E8F2',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sessionIndexBoxNext: {
		backgroundColor: '#4651A8',
	},
	sessionIndexText: {
		fontSize: 28,
		fontWeight: '700',
		color: '#3A52D4',
	},
	sessionIndexTextNext: {
		color: '#E6EBFF',
	},
	sessionTexts: {
		flex: 1,
		marginLeft: 10,
	},
	sessionTitle: {
		fontSize: 13,
		fontWeight: '600',
		color: '#101E50',
	},
	sessionTitleNext: {
		color: '#FFFFFF',
	},
	sessionSubtitle: {
		fontSize: 12,
		fontWeight: '400',
		marginTop: 1,
		color: '#69769C',
	},
	sessionSubtitleNext: {
		color: '#D7DEFF',
	},
	sessionBadge: {
		height: 30,
		borderRadius: 15,
		paddingHorizontal: 12,
		backgroundColor: '#E6E9F8',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sessionBadgeNext: {
		backgroundColor: '#5562BC',
	},
	sessionBadgeDone: {
		backgroundColor: '#E4F5EA',
	},
	sessionBadgeText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#3F50B8',
	},
	sessionBadgeTextNext: {
		color: '#ECF1FF',
	},
	sessionBadgeTextDone: {
		color: '#16A34A',
	},
	documentRow: {
		height: 62,
		borderRadius: 16,
		paddingHorizontal: 12,
		marginBottom: 10,
		backgroundColor: '#EDEFF7',
		flexDirection: 'row',
		alignItems: 'center',
	},
	documentIconBox: {
		width: 38,
		height: 38,
		borderRadius: 12,
		backgroundColor: '#F8EDEF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	documentName: {
		fontSize: 13,
		fontWeight: '600',
		color: '#0A1A4A',
		textAlignVertical: 'center',
		includeFontPadding: false,
	},
	documentDate: {
		fontSize: 12,
		fontWeight: '400',
		color: '#97A0C0',
	},
});
