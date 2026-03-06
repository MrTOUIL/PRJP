
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import TeacherProfile from '@/components/ui/TeacherProfile';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TeacherProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
