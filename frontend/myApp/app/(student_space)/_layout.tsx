import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';

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
		route: '/(student_space)/Message',
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

	const messagesPath = normalizePath('/(student_space)/Message');
	const profilePath = normalizePath('/(student_space)/Sprofile');
    const isHomeRoute = homePath.some(path => currentPath === path); 
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
		backgroundColor: '#FFFFFF',
	},
	contentWrap: {
		flex: 1,
		paddingBottom: 54,
	},
	bottomNav: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 78,
		borderColor: '#D6DAE6',
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		paddingHorizontal: 0,
	},
	navItem: {
		position: 'relative',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 0,
		gap: 4,
		paddingTop: 14,
		paddingBottom: 4,
	},
	activeIndicator: {
		position: 'absolute',
		top: 0,
		width: 34,
		height: 3,
		borderTopLeftRadius: 2,
		borderTopRightRadius: 2,
		backgroundColor: 'transparent',
	},
	activeIndicatorActive: {
		backgroundColor: '#2E337F',
	},
	navLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#B5BCCF',
		letterSpacing: 0.2,
	},
	navLabelActive: {
		color: '#2E337F',
	},
});
