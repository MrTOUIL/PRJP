// simple local Stack stub (expo-router not required for this layout)
import { StatusBar } from 'expo-status-bar';
import { AdminTheme } from '../constants/adminTheme';
const Stack: any = ({ children }: any) => <>{children}</>;

export default function AdminLayout() {
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
