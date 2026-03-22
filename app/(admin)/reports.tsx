import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Report = {
  id: string;
  reporter: string;
  targetType: 'Post' | 'User';
  targetContent: string; // Preview of post or name of user
  reason: string;
  date: string;
  status: 'Pending' | 'Resolved';
};

const initialReports: Report[] = [
  { id: '1', reporter: 'Parent A', targetType: 'Post', targetContent: 'I hate this school...', reason: 'Hate speech', date: '2023-10-27', status: 'Pending' },
  { id: '2', reporter: 'Student B', targetType: 'User', targetContent: 'Teacher X', reason: 'Harassment', date: '2023-10-26', status: 'Pending' },
  { id: '3', reporter: 'Teacher C', targetType: 'Post', targetContent: 'Exam answers leaked here...', reason: 'Cheating', date: '2023-10-25', status: 'Resolved' },
];

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const colorScheme = useColorScheme();

  const handleAction = (id: string, action: 'Dismiss' | 'Ban' | 'Delete') => {
    Alert.alert(
      `Confirm ${action}`,
      `Are you sure you want to ${action.toLowerCase()} this report target?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          style: action === 'Dismiss' ? 'default' : 'destructive',
          onPress: () => {
             setReports(prev => prev.filter(r => r.id !== id));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Report }) => (
    <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: item.targetType === 'Post' ? '#E3F2FD' : '#E8F5E9' }]}>
            <ThemedText style={{fontSize: 10, color: '#333'}}>{item.targetType}</ThemedText>
        </View>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </View>
      
      <ThemedText type="defaultSemiBold" style={styles.reason}>{item.reason}</ThemedText>
      <ThemedText style={styles.content}>Target: "{item.targetContent}"</ThemedText>
      <ThemedText style={styles.reporter}>Reported by: {item.reporter}</ThemedText>

      <View style={styles.actions}>
        <TouchableOpacity 
            style={[styles.btn, styles.dismissBtn]} 
            onPress={() => handleAction(item.id, 'Dismiss')}>
            <ThemedText style={{color: 'gray'}}>Dismiss</ThemedText>
        </TouchableOpacity>
        
        {item.targetType === 'Post' ? (
           <TouchableOpacity 
             style={[styles.btn, styles.deleteBtn]} 
             onPress={() => handleAction(item.id, 'Delete')}>
             <ThemedText style={{color: 'white'}}>Delete Post</ThemedText>
           </TouchableOpacity>
        ) : (
           <TouchableOpacity 
             style={[styles.btn, styles.banBtn]} 
             onPress={() => handleAction(item.id, 'Ban')}>
             <ThemedText style={{color: 'white'}}>Ban User</ThemedText>
           </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText style={styles.empty}>No pending reports.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
  },
  date: {
      fontSize: 12,
      opacity: 0.5,
  },
  reason: {
      fontSize: 16,
  },
  content: {
      fontStyle: 'italic',
      opacity: 0.8,
  },
  reporter: {
      fontSize: 12,
      opacity: 0.5,
  },
  actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#ccc',
      paddingTop: 12,
  },
  btn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
  },
  dismissBtn: {
      backgroundColor: '#f0f0f0',
  },
  deleteBtn: {
      backgroundColor: '#ff4444',
  },
  banBtn: {
      backgroundColor: '#ff9800', // Orange for ban
  },
  empty: {
      textAlign: 'center',
      marginTop: 20,
      opacity: 0.5,
  }
});
