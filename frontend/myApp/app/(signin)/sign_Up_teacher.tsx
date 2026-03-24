import React from 'react';
import {
	Image,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	StatusBar,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const COLORS = {
	primary: '#1E1B6B',
	primarySoft: '#4B57B6',
	background: '#EEF2FF',
	card: '#FFFFFF',
	mutedText: '#74819A',
	text: '#0F172A',
	border: '#E6ECF7',
	inputBg: '#F5F7FF',
	danger: '#E11D48',
	link: '#1E40AF',
	pillTitle: '#FFD700',
};

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
	return (
		<Text style={styles.fieldLabel}>
			{label}
			{required ? <Text style={styles.required}> *</Text> : null}
		</Text>
	);
}

function InputRow({
	icon,
	placeholder,
	keyboardType,
	secureTextEntry,
}: {
	icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
	placeholder: string;
	keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
	secureTextEntry?: boolean;
}) {
	return (
		<View style={styles.inputWrapper}>
			<View style={styles.inputIconWrap}>
				<MaterialCommunityIcons name={icon} size={16} color={COLORS.primary} />
			</View>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				placeholderTextColor={COLORS.mutedText}
				keyboardType={keyboardType}
				secureTextEntry={secureTextEntry}
			/>
		</View>
	);
}

function SectionHeader({
	icon,
	iconColor,
	title,
	subtitle,
}: {
	icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
	iconColor: string;
	title: string;
	subtitle: string;
}) {
	return (
		<View style={styles.sectionHeader}>
			<View style={[styles.sectionIcon, { backgroundColor: `${iconColor}1A` }]}>
				<MaterialCommunityIcons name={icon} size={18} color={iconColor} />
			</View>
			<View style={styles.sectionHeaderText}>
				<Text style={styles.sectionTitle}>{title}</Text>
				<Text style={styles.sectionSubtitle}>{subtitle}</Text>
			</View>
		</View>
	);
}

export default function TeacherRegister() {
	const router = useRouter();
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity activeOpacity={0.8} style={styles.backRow} onPress={()=>router.back()}>
						<View style={styles.backIconCircle}>
							<Ionicons name="chevron-back" size={16} color="#E8ECFF" />
						</View>
					</TouchableOpacity>

					<View style={styles.headerTextBlock}>
						<Text style={styles.headerTitle}>Teacher Registration</Text>
						<Text style={styles.headerSubtitle}>Complete your details to get started</Text>
					</View>

					{/* Decorative cutout with logo */}
					<View style={styles.headerLogoCutout}>
						<Image
							source={require('../../assets/images/Logo_nobg.png')}
							style={styles.headerLogo}
							resizeMode="contain"
						/>
					</View>
				</View>

				{/* Role pill */}
				<View style={styles.rolePill}>
					<View style={styles.roleIconBadge}>
						<MaterialCommunityIcons name="human-male-board" size={18} color="#FFD700" />
					</View>
					<View style={styles.roleText}>
						<Text style={styles.roleTitle}>Teacher / Enseignant</Text>
						<Text style={styles.roleSubtitle}>Academic & professional profile</Text>
					</View>
				</View>

				<Text style={styles.requiredHint}>
					<Text style={styles.required}>*</Text> Required fields
				</Text>

				{/* Form card */}
				<View style={styles.formCard}>
					<SectionHeader
						icon="account"
						iconColor="#1D4ED8"
						title="Personal Information"
						subtitle="Your basic identity details"
					/>

					<View style={styles.fieldGroup}>
						<View style={styles.row}>
							<View style={styles.col}>
								<FieldLabel label="First Name" required />
								<InputRow icon="pencil" placeholder="First name" />
							</View>
							<View style={styles.col}>
								<FieldLabel label="Last Name" required />
								<InputRow icon="pencil" placeholder="Last name" />
							</View>
						</View>

						<FieldLabel label="Email Address" required />
						<InputRow
							icon="email-outline"
							placeholder="your.email@example.com"
							keyboardType="email-address"
						/>

						<FieldLabel label="Phone Number" />
						<InputRow
							icon="phone-outline"
							placeholder="+213 XX XXX XX XX"
							keyboardType="phone-pad"
						/>

						<FieldLabel label="Postal Address" />
						<InputRow icon="map-marker-outline" placeholder="City, Wilaya" />
					</View>

					<View style={styles.divider} />

					<SectionHeader
						icon="lock"
						iconColor="#64748B"
						title="Account Security"
						subtitle="Set your login credentials"
					/>

					<View style={styles.fieldGroup}>
						<FieldLabel label="Password" required />
						<InputRow icon="key-outline" placeholder="Create a password" secureTextEntry />

						<FieldLabel label="Confirm Password" required />
						<InputRow icon="key-outline" placeholder="Repeat password" secureTextEntry />
					</View>

					<View style={styles.divider} />

					<SectionHeader
						icon="school"
						iconColor="#16A34A"
						title="Professional Information"
						subtitle="Your subjects & experience"
					/>

					<View style={styles.fieldGroup}>
						<FieldLabel label="Subject / Specialization" required />
						<InputRow icon="book-open-variant" placeholder="e.g. Mathematics, Physics" />
                        
                        <FieldLabel label="Years of Experience" />
						<InputRow icon="briefcase-outline" placeholder="e.g. 5 years" keyboardType="numeric" />
					</View>
				</View>

				{/* Footer actions */}
				<TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
					<Text style={styles.primaryButtonText}>Complete Registration</Text>
					<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
				</TouchableOpacity>

				<View style={styles.signInRow}>
					<Text style={styles.signInText}>Already have an account? </Text>
					<TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/signin')}>
						<Text style={styles.signInLink}>Sign In</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollContent: {
		paddingBottom: 28,
	},

	header: {
		backgroundColor: COLORS.primary,
		paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 10 : 16,
		paddingHorizontal: 18,
		paddingBottom: 30,
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
		overflow: 'hidden',
	},
	backRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		zIndex: 3,
		alignSelf: 'flex-start',
	},
	backIconCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: 'rgba(255,255,255,0.18)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTextBlock: {
		marginTop: 10,
		zIndex: 3,
	},
	headerTitle: {
		color: '#FFFFFF',
		fontSize: 22,
		fontWeight: '800',
		letterSpacing: 0.2,
	},
	headerSubtitle: {
		marginTop: 4,
		color: '#D7DCF3',
		fontSize: 11,
		fontWeight: '600',
	},
	headerLogoCutout: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 136,
		height: 70,
		backgroundColor: '#FFFFFF',
		borderBottomLeftRadius: 54,
		justifyContent: 'center',
		paddingHorizontal: 6,
		zIndex: 2,
	},
	headerLogo: {
		width: '100%',
		height: 68,
	},

	rolePill: {
		marginTop: 14,
		marginHorizontal: 18,
		backgroundColor: COLORS.primarySoft,
		borderRadius: 14,
		paddingHorizontal: 14,
		paddingVertical: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.15)',
	},
	roleIconBadge: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#2B2A73',
		alignItems: 'center',
		justifyContent: 'center',
	},
	roleText: {
		flex: 1,
	},
	roleTitle: {
		color: COLORS.pillTitle,
		fontSize: 13,
		fontWeight: '800',
	},
	roleSubtitle: {
		marginTop: 2,
		color: '#E9ECFF',
		fontSize: 10,
		fontWeight: '600',
	},

	requiredHint: {
		marginTop: 10,
		marginHorizontal: 20,
		fontSize: 10,
		color: COLORS.mutedText,
		fontWeight: '700',
	},
	required: {
		color: COLORS.danger,
		fontWeight: '900',
	},

	formCard: {
		marginTop: 10,
		marginHorizontal: 14,
		backgroundColor: COLORS.card,
		borderRadius: 18,
		padding: 14,
		borderWidth: 1,
		borderColor: COLORS.border,
	},

	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingVertical: 8,
	},
	sectionIcon: {
		width: 34,
		height: 34,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sectionHeaderText: {
		flex: 1,
	},
	sectionTitle: {
		color: COLORS.primary,
		fontSize: 13,
		fontWeight: '800',
	},
	sectionSubtitle: {
		marginTop: 1,
		color: COLORS.mutedText,
		fontSize: 10,
		fontWeight: '600',
	},

	divider: {
		height: 1,
		backgroundColor: COLORS.border,
		marginVertical: 10,
	},
	fieldGroup: {
		paddingTop: 6,
		gap: 10,
	},
	row: {
		flexDirection: 'row',
		gap: 12,
	},
	col: {
		flex: 1,
	},
	fieldLabel: {
		color: COLORS.text,
		fontSize: 11,
		fontWeight: '800',
		marginBottom: 6,
	},
	inputWrapper: {
		height: 44,
		borderRadius: 12,
		backgroundColor: COLORS.inputBg,
		borderWidth: 1,
		borderColor: COLORS.border,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	inputIconWrap: {
		width: 26,
		height: 26,
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: COLORS.border,
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		flex: 1,
		color: COLORS.text,
		fontSize: 12,
		fontWeight: '700',
		paddingVertical: 0,
	},

	selectWrapper: {
		height: 44,
		borderRadius: 12,
		backgroundColor: COLORS.inputBg,
		borderWidth: 1,
		borderColor: COLORS.border,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	selectText: {
		flex: 1,
		color: COLORS.mutedText,
		fontSize: 12,
		fontWeight: '700',
	},

	primaryButton: {
		marginTop: 16,
		marginHorizontal: 18,
		height: 52,
		borderRadius: 16,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		gap: 10,
	},
	primaryButtonText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: '900',
	},
	signInRow: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	signInText: {
		color: COLORS.mutedText,
		fontSize: 11,
		fontWeight: '700',
	},
	signInLink: {
		color: COLORS.link,
		fontSize: 11,
		fontWeight: '900',
	},
});
