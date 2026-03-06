import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function AdminDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="title" style={styles.header}>
          Admin Control Center
        </ThemedText>
        <ThemedText style={styles.subHeader}>
          Manage users, content, and security reports.
        </ThemedText>

        <View style={styles.grid}>
          {/* User Management */}
          <TouchableOpacity
            style={[styles.card, { borderColor: tintColor }]}
            onPress={() => router.push('/(admin)/users')}>
            <IconSymbol name="person.2.fill" size={40} color={tintColor} />
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Manage Users
            </ThemedText>
            <ThemedText style={styles.cardDescription}>
              Remove or suspend members (Students, Teachers, Parents).
            </ThemedText>
          </TouchableOpacity>

          {/* Post/Content Management */}
          <TouchableOpacity
            style={[styles.card, { borderColor: tintColor }]}
            onPress={() => router.push('/(admin)/posts')}>
            <IconSymbol name="rectangle.stack.fill" size={40} color={tintColor} />
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Manage Content
            </ThemedText>
            <ThemedText style={styles.cardDescription}>
              Delete inappropriate posts or comments.
            </ThemedText>
          </TouchableOpacity>

          {/* Crime Reports / Security */}
          <TouchableOpacity
            style={[styles.card, { borderColor: 'red' }]} // Security alert color
            onPress={() => router.push('/(admin)/reports')}>
            <IconSymbol name="exclamationmark.triangle.fill" size={40} color="red" />
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Crime Reports
            </ThemedText>
            <ThemedText style={styles.cardDescription}>
              Review flagged content and security incidents.
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Security Summary Section */}
        <View style={styles.statsContainer}>
          <ThemedText type="subtitle">Security Overview</ThemedText>
          <View style={styles.statRow}>
             <ThemedText>Pending Reports:</ThemedText>
             <ThemedText type="defaultSemiBold" style={{color: 'red'}}>5</ThemedText>
          </View>
          <View style={styles.statRow}>
             <ThemedText>Flagged Posts:</ThemedText>
             <ThemedText type="defaultSemiBold">12</ThemedText>
          </View>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 8,
  },
  subHeader: {
    marginBottom: 24,
    opacity: 0.7,
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  cardTitle: {
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  }
});
