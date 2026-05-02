import React, { useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Modal,
	Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
const TUTORS: Tutor[] = [
	{
		id: 1,
		name: 'Sara Belhadj',
		subtitle: 'Physics - Terminale S - Online',
		subject: 'Physics',
		badge: 'Terminale S',
		avatarBg: '#0EA27F',
		avatarInitial: 'S',
		subjectColor: '#3F53E6',
	},
	{
		id: 2,
		name: 'M. Rahmani',
		subtitle: 'Mathematics - Lycee - Hybrid',
		subject: 'Maths',
		badge: 'Lycee',
		avatarBg: '#F2B21D',
		avatarInitial: 'M',
		subjectColor: '#2038BF',
	},
	{
		id: 3,
		name: 'Leila Mansouri',
		subtitle: 'English - All levels - Online',
		subject: 'English',
		badge: 'All levels',
		avatarBg: '#E63B3B',
		avatarInitial: 'L',
		subjectColor: '#D64267',
	},
	{
		id: 4,
		name: 'A. Oussama',
		subtitle: 'Chemistry - Baccalaureat - In person',
		subject: 'Chemistry',
		badge: 'Bac',
		avatarBg: '#6A39D6',
		avatarInitial: 'A',
		subjectColor: '#6A39D6',
	},
	{
		id: 5,
		name: 'N. Ouali',
		subtitle: 'Biology - Terminale S - Online',
		subject: 'Biology',
		badge: 'Terminale S',
		avatarBg: '#F2940E',
		avatarInitial: 'N',
		subjectColor: '#E65656',
	},
];

export default function SuggestionsScreen() {
	const router = useRouter();
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState('Subject');

	const handleFilterSelect = (filterType: string) => {
		setSelectedFilter(filterType);
		setShowFilterModal(false);
	};

	return (
		<SafeAreaView style={styles.page}>
			<View style={styles.phoneFrame}>
				<View style={styles.header}>
					<View style={styles.headerTop}>
						<TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={20} color="#FFFFFF" />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Suggestions</Text>
						<TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={() => setShowFilterModal(true)}>
							<Ionicons name="search" size={20} color="#FFFFFF" />
						</TouchableOpacity>
					</View>

					<View style={styles.searchContainer}>
						<Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
						<TextInput
						placeholder={`Search in ${selectedFilter}...`}
							placeholderTextColor="#94A3B8"
							style={styles.searchInput}
						/>
					<TouchableOpacity style={styles.filterButton} activeOpacity={0.85} onPress={() => setShowFilterModal(true)}>
						<Ionicons name="options" size={14} color="#FFFFFF" />
					</TouchableOpacity>

					<Modal
						visible={showFilterModal}
						transparent={true}
						animationType="fade"
						onRequestClose={() => setShowFilterModal(false)}
					>
						<Pressable style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
							<View style={styles.modalContent}>
								<Text style={styles.modalTitle}>Search By</Text>
								<TouchableOpacity
									style={[styles.modalOption, selectedFilter === 'Subject' && styles.modalOptionActive]}
									onPress={() => handleFilterSelect('Subject')}
								>
									<Text style={[styles.modalOptionText, selectedFilter === 'Subject' && styles.modalOptionTextActive]}>Subject</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.modalOption, selectedFilter === 'Educational Level' && styles.modalOptionActive]}
									onPress={() => handleFilterSelect('Educational Level')}
								>
									<Text style={[styles.modalOptionText, selectedFilter === 'Educational Level' && styles.modalOptionTextActive]}>Educational Level</Text>
								</TouchableOpacity>
							</View>
						</Pressable>
					</Modal>
					</View>
				</View>

				<View style={styles.mainContent}>
					<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Tutors for You</Text>
						</View>

						<View style={styles.listWrap}>
							{TUTORS.map((tutor) => (
								<View key={tutor.id} style={styles.card}>
									<View style={styles.cardTop}>
										<View style={[styles.avatar, { backgroundColor: tutor.avatarBg }]}>
											<Text style={styles.avatarText}>{tutor.avatarInitial}</Text>
										</View>
										<View style={styles.cardInfo}>
											<Text style={styles.cardName}>{tutor.name}</Text>
											<Text style={styles.cardSubtitle}>{tutor.subtitle}</Text>
											<View style={styles.tagsRow}>
												<Text style={[styles.subjectTag, { color: tutor.subjectColor }]}>{tutor.subject}</Text>
												<Text style={styles.dotTag}>|</Text>
												<Text style={styles.levelTag}>{tutor.badge}</Text>
											</View>
										</View>
									</View>

									<View style={styles.actionsRow}>
										<TouchableOpacity style={styles.requestButton} activeOpacity={0.9} onPress={() => router.push('/(student_space)/Qoute')}>
											<Text style={styles.requestButtonText}>Send Request</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.messageButton} activeOpacity={0.9}>
											<Text style={styles.messageButtonText}>Send a Message</Text>
										</TouchableOpacity>
									</View>
								</View>
							))}
						</View>
					</ScrollView>
				</View>

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
});
