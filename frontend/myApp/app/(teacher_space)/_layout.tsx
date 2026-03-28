import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';

// Helper to normalize paths
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
		route: '/(teacher_space)/teacherSpace',
	},
	{
		key: 'messages',
		label: 'MESSAGES',
		icon: 'mail-outline' as const,
		activeIcon: 'mail' as const,
		route: '/(teacher_space)/teacherMessages',
	},
	{
		key: 'notifications',
		label: 'NOTIFICATIONS',
		icon: 'notifications-outline' as const,
		activeIcon: 'notifications' as const,
		route: '/(teacher_space)/teacherNotifications',
	},
	{
		key: 'profile',
		label: 'PROFILE',
		icon: 'person-outline' as const,
		activeIcon: 'person' as const,
		route: '/(teacher_space)/teacherProfile',
	},
];

export default function TeacherSpaceLayout() {
	const pathname = usePathname();
	const router = useRouter();
	const currentPath = normalizePath(pathname || '/');

	// Define which routes belong to the "Home" tab
	const homePaths = [
		'/(teacher_space)/teacherSpace',
		'/(teacher_space)/teacherSessions',
		'/(teacher_space)/servicePdg',
		'/(teacher_space)/teacherRequests',
        // Add other sub-pages here if any
	].map((path) => normalizePath(path));

	const messagesPath = normalizePath('/(teacher_space)/teacherMessages');
	const notificationsPath = normalizePath('/(teacher_space)/teacherNotifications');
	const profilePath = normalizePath('/(teacher_space)/teacherProfile');

	const getIsActive = (key: string) => {
		if (key === 'home') {
			// This covers /teacherSpace, /teacherSessions, /teacherRequests, etc.
			return homePaths.some((path) => currentPath === path);
		}
		if (key === 'messages') {
			return currentPath === messagesPath;
		}
		if (key === 'notifications') {
			return currentPath === notificationsPath;
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
							onPress={() => router.replace(item.route as any)}
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
		backgroundColor: '#F5F6FA',
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
