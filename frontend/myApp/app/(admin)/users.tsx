import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';

// Mock Data
type User = {
  id: string;
  name: string;
  role: 'Student' | 'Teacher' | 'Parent';
  status: 'Active' | 'Suspended';
};

const initialUsers: User[] = [
  { id: '1', name: 'John Doe', role: 'Student', status: 'Active' },
  { id: '2', name: 'Jane Smith', role: 'Teacher', status: 'Active' },
  { id: '3', name: 'Emily White', role: 'Parent', status: 'Suspended' },
  { id: '4', name: 'Michael Brown', role: 'Student', status: 'Active' },
  { id: '5', name: 'Sarah Green', role: 'Teacher', status: 'Active' },
];

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to remove user "${name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
             // Mock deletion
             setUsers(prev => prev.filter(u => u.id !== id));
             // In a real app, call API here
          }
        }
      ]
    );
  };

  const handleSuspend = (id: string) => {
      // Toggle status for demo purposes
      setUsers(prev => prev.map(u => u.id === id ? {...u, status: u.status === 'Active' ? 'Suspended' : 'Active'} : u));
  };


  const renderItem = ({ item }: { item: User }) => (
    <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
           <ThemedText style={{fontSize: 20}}>{item.name.charAt(0)}</ThemedText>
        </View>
        <View>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText style={styles.role}>{item.role}</ThemedText>
          <ThemedText style={[styles.status, {color: item.status === 'Active' ? 'green' : 'orange'}]}>{item.status}</ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
         <TouchableOpacity onPress={() => handleSuspend(item.id)} style={styles.actionBtn}>
             <IconSymbol name="eye.slash.fill" size={20} color="orange" />
         </TouchableOpacity>
         <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.actionBtn}>
             <IconSymbol name="trash.fill" size={20} color="red" />
         </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
       <FlatList 
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No users found.</ThemedText>}
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
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  role: {
    fontSize: 12,
    opacity: 0.6,
  },
  status: {
      fontSize: 12,
      fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
      padding: 4,
  },
  empty: {
      textAlign: 'center',
      marginTop: 20,
      opacity: 0.5,
  }
});
