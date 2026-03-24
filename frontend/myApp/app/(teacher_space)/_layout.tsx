/*import React from 'react';
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
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/(teacher_space)/teacherSpace',
  },
  {
    key: 'sessions',
    label: 'SESSIONS',
    icon: 'calendar-outline',
    activeIcon: 'calendar',
    route: '/(teacher_space)/teacherSessions',
  },
  {
    key: 'messages',
    label: 'MESSAGES',
    icon: 'mail-outline',
    activeIcon: 'mail',
    route: '/(teacher_space)/teacherMessages',
  },
  {
    key: 'profile',
    label: 'PROFILE',
    icon: 'person-outline',
    activeIcon: 'person',
    route: '/(teacher_space)/teacherProfile',
  },
];

export default function TeacherSpaceLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = normalizePath(pathname || '/');

  // Define active routes for highlighting
  const homePath = normalizePath('/(teacher_space)/teacherSpace');
  const sessionsPath = normalizePath('/(teacher_space)/teacherSessions');
  const messagesPath = normalizePath('/(teacher_space)/teacherMessages');
  const resourcesPath = normalizePath('/(teacher_space)/teacherResources');
  const profilePath = normalizePath('/(teacher_space)/teacherProfile');
  const servicePath = normalizePath('/(teacher_space)/servicePdg'); // Assuming servicePdg is under home or resources context

  // Logic to determine active tab
  const getIsActive = (key: string) => {
    if (key === 'home') {
      return currentPath === homePath || currentPath === servicePath;
    }
    if (key === 'sessions') {
      return currentPath === sessionsPath;
    }
    if (key === 'messages') {
        return currentPath === messagesPath;
    }
    if (key === 'resources') {
      return currentPath === resourcesPath;
    }
    if (key === 'profile') {
      return currentPath === profilePath;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        {/* Render the current screen */ /*}
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
                name={iconName as any}
                size={22}
                color={isActive ? '#1E1B6B' : '#B5BCCF'}
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
    paddingBottom: 78, 
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
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 100, 
  },
  navItem: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
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
    backgroundColor: '#1E1B6B', // Same deep blue
  },
  navLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#B5BCCF',
    letterSpacing: 0.2,
  },
  navLabelActive: {
    color: '#1E1B6B',
  },
});*/


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
    route: '/(teacher_space)/teacherSpace',
	},
	{
		key: 'messages',
		label: 'MESSAGES',
		icon: 'chatbubble-ellipses-outline' as const,
		activeIcon: 'chatbubble-ellipses' as const,
    route: '/(teacher_space)/teacherMessages',
	},
	{
		key: 'alerts',
		label: 'ALERTS',
		icon: 'notifications-outline' as const,
		activeIcon: 'notifications' as const,
    route: '/(teacher_space)/notification',
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
	const homePath = [
  '/(teacher_space)/teacherSpace',

].map((path) => normalizePath(path));

  const messagesPath = normalizePath('/(teacher_space)/teacherMessages');
  const alertsPath = normalizePath('/(teacher_space)/notification');
  const profilePath = normalizePath('/(teacher_space)/teacherProfile');
    const isHomeRoute = homePath.some(path => currentPath === path); 
	const getIsActive = (key: string) => {
		if (key === 'home') {
			return !!isHomeRoute;
		}
		if (key === 'messages') {
			return currentPath === messagesPath;
		}
		if (key === 'alerts') {
			return currentPath === alertsPath;
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

