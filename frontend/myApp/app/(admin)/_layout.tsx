import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { AdminTheme } from '@/constants/adminTheme';

export default function AdminLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: AdminTheme.colors.surface,
          },
          headerTintColor: AdminTheme.colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="dashboard" options={{ title: 'Admin', headerBackVisible: false }} />
        <Stack.Screen name="users" options={{ title: 'Membres & Messages' }} />
        <Stack.Screen name="posts" options={{ title: 'Devis & Services' }} />
        <Stack.Screen name="reports" options={{ title: 'Rapports d actions' }} />
        <Stack.Screen name="member/[id]" options={{ title: 'Profil membre' }} />
        <Stack.Screen name="post/[id]" options={{ title: 'Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
