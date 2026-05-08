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
        <Stack.Screen name="users" options={{ title: 'Members & Messages' }} />
        <Stack.Screen name="posts" options={{ title: 'Quotes & Services' }} />
        <Stack.Screen name="reports" options={{ title: 'Action Reports' }} />
        <Stack.Screen name="member/[id]" options={{ title: 'Member Profile' }} />
        <Stack.Screen name="post/[id]" options={{ title: 'Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
