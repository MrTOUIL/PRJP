import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

const sessions: SessionRow[] = [
	{ id: 9, title: 'Friday, Feb 28 · 15:00', subtitle: 'Online · 90 min', badge: 'In 3 days', state: 'next' },
	{ id: 10, title: 'Friday, Mar 7 · 15:00', subtitle: 'Online · 90 min', badge: 'Upcoming', state: 'upcoming' },
	{ id: 11, title: 'Friday, Feb 21 · 15:00', subtitle: 'Online · 90 min', badge: 'Done', state: 'done' },
];

const documents: DocumentRow[] = [
	{ id: 1, name: 'Session 8 - Exercises.pdf', date: 'Feb 21', icon: 'document-text-outline', color: '#E74C3C' },
	{ id: 2, name: 'Derivation Recap Slides.pptx', date: 'Feb 14', icon: 'document-outline', color: '#F97316' },
	{ id: 3, name: 'Physics - Forces Summary.pdf', date: 'Feb 7', icon: 'document-text-outline', color: '#E74C3C' },
];

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

export default function ServiceStd() {
	const router = useRouter();
	const params = useLocalSearchParams();

	const title = pickFirst(params.title, 'Individual Math Sessions');
	const subject = pickFirst(params.subject, pickFirst(params.type, 'Mathematics'));
	const domain = pickFirst(params.domain, inferDomain(subject));
	const type = pickFirst(params.type, 'Individual');
	const targetAudience = pickFirst(params.target_audiance, 'Terminale S');
	const mode = pickFirst(params.mode, 'Online');
	const cost = pickFirst(params.cost, '800');
	const comment = pickFirst(
		params.comment,
		'Personalized one-on-one sessions focused on exam preparation, problem-solving techniques and concept reinforcement. Exercises and summaries are shared after each session.',
	);
	const tutor = pickFirst(params.tutor, 'Sara Belhadj | Mathematics & Physics');
	const level = pickFirst(params.level, targetAudience);
	const duration = pickFirst(params.duration, '90 min');
	const tutorInfo = parseTutor(tutor);
	const teacherInitial = tutorInfo.name.charAt(0).toUpperCase();
	const costLabel = `${cost} DZD`;

	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.headerSurface}>
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()} activeOpacity={0.85}>
						<Ionicons name="chevron-back" size={22} color="#FFFFFF" />
					</TouchableOpacity>
					<Text style={styles.heroTitleDark} numberOfLines={2}>{title}</Text>
					<View style={styles.pricePill}>
						<Text style={styles.pricePillText}>{costLabel}</Text>
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
							<Text style={styles.teacherAvatarText}>{teacherInitial}</Text>
						</View>
						<View style={styles.teacherContent}>
							<Text style={styles.teacherName}>{tutorInfo.name}</Text>
							<Text style={styles.teacherMeta}>{tutorInfo.meta} · 5 yrs experience</Text>
						</View>
						<View style={styles.verifiedPill}>
							<Text style={styles.verifiedText}>Verified</Text>
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
							<Text style={styles.infoValue}>{domain}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>SUBJECT</Text>
							<Text style={styles.infoValue}>{subject}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>DURATION</Text>
							<Text style={styles.infoValue}>{duration}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>MODE</Text>
							<Text style={styles.infoValue}>{mode}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>TYPE</Text>
							<Text style={styles.infoValue}>{type}</Text>
						</View>
						<View style={styles.infoCell}>
							<Text style={styles.infoLabel}>LEVEL</Text>
							<Text style={styles.infoValue}>{level}</Text>
						</View>
					</View>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>DESCRIPTION</Text>
						<View style={styles.sectionLine} />
					</View>
					<Text style={styles.descriptionText}>{comment}</Text>
				</View>

				<View style={styles.sectionCard}>
					<View style={styles.sectionHeaderRow}>
						<Text style={styles.sectionTitle}>SESSIONS</Text>
						<View style={styles.sectionLine} />
					</View>

					{sessions.map((session) => (
						<View key={session.id} style={[styles.sessionRow, session.state === 'next' && styles.sessionRowNext]}>
							<View style={[styles.sessionIndexBox, session.state === 'next' && styles.sessionIndexBoxNext]}>
								{session.state === 'done' ? (
									<Ionicons name="checkmark" size={18} color="#16A34A" />
								) : (
									<Text style={[styles.sessionIndexText, session.state === 'next' && styles.sessionIndexTextNext]}>{session.id}</Text>
								)}
							</View>
							<View style={styles.sessionTexts}>
								<Text style={[styles.sessionTitle, session.state === 'next' && styles.sessionTitleNext]}>{session.title}</Text>
								<Text style={[styles.sessionSubtitle, session.state === 'next' && styles.sessionSubtitleNext]}>{session.subtitle}</Text>
							</View>
							<View style={[styles.sessionBadge, session.state === 'next' && styles.sessionBadgeNext, session.state === 'done' && styles.sessionBadgeDone]}>
								<Text style={[styles.sessionBadgeText, session.state === 'next' && styles.sessionBadgeTextNext, session.state === 'done' && styles.sessionBadgeTextDone]}>
									{session.badge}
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

					{documents.map((doc) => (
						<View key={doc.id} style={styles.documentRow}>
							<View style={styles.documentIconBox}>
								<Ionicons name={doc.icon} size={20} color={doc.color} />
							</View>
							<Text style={styles.documentName}>{doc.name}</Text>
							<Text style={styles.documentDate}>{doc.date}</Text>
						</View>
					))}
				</View>

				<View style={{ height: 20 }} />
			</ScrollView>
		</SafeAreaView>
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
		flex: 1,
		marginLeft: 10,
		fontSize: 13,
		fontWeight: '600',
		color: '#0A1A4A',
	},
	documentDate: {
		fontSize: 12,
		fontWeight: '400',
		color: '#97A0C0',
	},
});
