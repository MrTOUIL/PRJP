import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function AdminLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTintColor: Colors[colorScheme ?? 'light'].text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="dashboard" options={{ title: 'Admin Dashboard', headerBackVisible: false }} />
        <Stack.Screen name="users" options={{ title: 'Manage Users' }} />
        <Stack.Screen name="posts" options={{ title: 'Manage Posts' }} />
        <Stack.Screen name="reports" options={{ title: 'Crime Reports' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
