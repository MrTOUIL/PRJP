import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

function normalizePath(path: string) {
	return path
		.toLowerCase()
		.replace(/\([^/]+\)\//g, '')
		.replace(/\/+/g, '/')
		.replace(/\/$/, '');
}

const BOTTOM_NAV_ITEMS = [
	{
		key: 'home',
		label: 'HOME',
		icon: 'home-outline' as const,
		activeIcon: 'home' as const,
		route: '/(student_space)/studentSpace',
	},
	{
		key: 'messages',
		label: 'MESSAGES',
		icon: 'chatbubble-ellipses-outline' as const,
		activeIcon: 'chatbubble-ellipses' as const,
		route: '/(student_space)/Messages',
	},
	{
		key: 'profile',
		label: 'PROFILE',
		icon: 'person-outline' as const,
		activeIcon: 'person' as const,
		route: '/(student_space)/Sprofile',
	},
];

export default function StudentSpaceLayout() {
	const pathname = usePathname();
	const router = useRouter();
	const currentPath = normalizePath(pathname || '/');
	const homePath = [
  '/(student_space)/studentSpace',
  '/(student_space)/Documents',
  '/(student_space)/requests',
  '/(student_space)/StServices',
	'/(student_space)/ServiceStd',
  '/(student_space)/Subjects',
  '/(student_space)/suggestions',
  '/(student_space)/Qoute',

].map((path) => normalizePath(path));

	const messagesPath = normalizePath('/(student_space)/Messages');
	const profilePath = normalizePath('/(student_space)/Sprofile');
    const isHomeRoute = homePath.some(path => currentPath === path); 

	const handleNavPress = async (route: string, key: string) => {
		if (key === 'profile') {
			const profileData = await SecureStore.getItemAsync('studentProfileData');
			if (profileData) {
				router.replace({
					pathname: route as any,
					params: { profileData },
				} as any);
				return;
			}
		}

		router.replace(route as any);
	};

	const getIsActive = (key: string) => {
		if (key === 'home') {
			return !!isHomeRoute;
		}
		if (key === 'messages') {
			return currentPath === messagesPath;
		}
		if (key === 'profile') {
			return currentPath === profilePath;
		}
		return false;
	};

	return (
		<View style={styles.container}>
			<View style={styles.contentWrap}>
				<Stack screenOptions={{ headerShown: false }} />
			</View>

			<View style={styles.bottomNav}>
				{BOTTOM_NAV_ITEMS.map((item) => {
					const isActive = getIsActive(item.key);
					const iconName = isActive ? item.activeIcon : item.icon;

					return (
						<TouchableOpacity
							key={item.key}
							style={styles.navItem}
							activeOpacity={0.85}
							onPress={() => void handleNavPress(item.route, item.key)}
						>
							<View
								style={[
									styles.activeIndicator,
									isActive && styles.activeIndicatorActive,
								]}
							/>
							<Ionicons
								name={iconName}
								size={22}
								color={isActive ? '#2E337F' : '#B5BCCF'}
							/>
							<Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
								{item.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	contentWrap: {
		flex: 1,
	},
	bottomNav: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		height: 80,
		paddingBottom: 20,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#F0F0F0',
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.05,
		shadowRadius: 5,
	},
	navItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	activeIndicator: {
		position: 'absolute',
		top: -10,
		width: 40,
		height: 3,
		backgroundColor: 'transparent',
		borderRadius: 2,
	},
	activeIndicatorActive: {
		backgroundColor: '#2E337F',
	},
	navLabel: {
		fontSize: 10,
		marginTop: 4,
		color: '#B5BCCF',
		fontWeight: '600',
		letterSpacing: 0.5,
	},
	navLabelActive: {
		color: '#2E337F',
		fontWeight: '700',
	},
});
