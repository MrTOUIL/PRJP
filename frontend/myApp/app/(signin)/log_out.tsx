import React from 'react';
import {
	Image,
	ImageSourcePropType,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

type LogoutParams = {
	id?: string;
	email?: string;
	name?: string;
	avatar?: string;
	role?: string;
};

export default function LogoutPage() {
	const router = useRouter();
	const { email, role, name, avatar } = useLocalSearchParams<LogoutParams>();

	const accountName = typeof name === 'string' && name.length > 0 ? name : 'Student Name';
	const accountEmail = typeof email === 'string' && email.length > 0 ? email : 'student@alemni.com';
	const accountRole = typeof role === 'string' && role.length > 0 ? role : 'User';

	const accountAvatar: ImageSourcePropType =
		typeof avatar === 'string' && avatar.length > 0
			? { uri: avatar }
			: require('../../assets/images/icon.png');

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />

			<View style={styles.content}>
				<Image
					source={require('../../assets/images/Logo_nobg.png')}
					style={styles.brandLogo}
					resizeMode="contain"
				/>

				<Text style={styles.mainTitle}>You are logged out</Text>
				<Text style={styles.subTitle}>Choose how you want to continue.</Text>

				<View style={styles.accountCard}>
					<Image source={accountAvatar} style={styles.avatarImage} />
					<View style={styles.accountTextContainer}>
						<Text style={styles.accountName}>{accountName}</Text>
						<Text style={styles.accountEmail}>{accountEmail}</Text>
						<Text style={styles.accountRole}>{accountRole}</Text>
					</View>
				</View>

				<View style={styles.bottomActions}>
					<TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(signin)/sign_Up')}>
						<Text style={styles.primaryButtonText}>Create New Account</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(signin)/sign_in')}>
						<Text style={styles.secondaryButtonText}>Sign In With Another Account</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
	},
	content: {
		paddingHorizontal: 24,
		alignItems: 'center',
	},
	brandLogo: {
		width: 230,
		height: 130,
		marginBottom: 18,
	},
	mainTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: '#1A1A1A',
		marginBottom: 8,
		textAlign: 'center',
	},
	subTitle: {
		fontSize: 14,
		color: '#6D6D6D',
		marginBottom: 22,
		textAlign: 'center',
	},
	accountCard: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#E9E9E9',
		borderRadius: 18,
		backgroundColor: '#FCFCFC',
		paddingVertical: 18,
		paddingHorizontal: 16,
		alignItems: 'center',
		marginBottom: 18,
	},
	avatarImage: {
		width: 84,
		height: 84,
		borderRadius: 42,
		marginBottom: 12,
		borderWidth: 2,
		borderColor: '#ECEBFF',
	},
	accountTextContainer: {
		alignItems: 'center',
	},
	accountName: {
		color: '#1A1A1A',
		fontSize: 16,
		fontWeight: '800',
		marginBottom: 4,
	},
	accountEmail: {
		color: '#444444',
		fontSize: 13,
		fontWeight: '700',
	},
	accountRole: {
		color: '#7A7A7A',
		fontSize: 12,
		marginTop: 3,
		textTransform: 'capitalize',
	},
	bottomActions: {
		width: '100%',
		paddingHorizontal: 24,
		gap: 12,
	},
	primaryButton: {
		backgroundColor: '#33307E',
		height: 52,
		borderRadius: 26,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButtonText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '700',
	},
	secondaryButton: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#33307E',
		height: 52,
		borderRadius: 26,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButtonText: {
		color: '#33307E',
		fontSize: 15,
		fontWeight: '700',
	},
});
