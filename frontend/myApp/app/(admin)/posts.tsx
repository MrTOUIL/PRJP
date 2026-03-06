import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view'; 
import { ThemedText } from '@/components/themed-text'; 
import { IconSymbol } from '@/components/ui/icon-symbol'; 
import { useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Post = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
};

const initialPosts: Post[] = [
  { id: '1', author: 'Student A', content: 'School is closed tomorrow due to weather!', timestamp: '2h ago', likes: 10 },
  { id: '2', author: 'Teacher B', content: 'Assignment due next Friday.', timestamp: '4h ago', likes: 25 },
  { id: '3', author: 'Parent C', content: 'Looking for a math tutor.', timestamp: '1d ago', likes: 5 },
  { id: '4', author: 'Student D', content: 'Lost my ID card in the library.', timestamp: '2d ago', likes: 2 },
];

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const colorScheme = useColorScheme();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
             setPosts(prev => prev.filter(p => p.id !== id));
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">{item.author}</ThemedText>
        <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
      </View>
      
      <ThemedText style={styles.content}>{item.content}</ThemedText>
      
      <View style={styles.footer}>
         <View style={styles.likes}>
            <IconSymbol name="house.fill" size={16} color="gray" /> 
            {/* Using house.fill as a placeholder for thumbs up since I haven't added thumbs up mapping yet. 
                Wait, I should stick to trash.fill or text content */}
            <ThemedText style={styles.likesText}>{item.likes} Likes</ThemedText>
         </View>
         <TouchableOpacity onPress={() => handleDelete(item.id)}>
             <IconSymbol name="trash.fill" size={20} color="red" />
         </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
       <FlatList 
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No posts found.</ThemedText>}
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
  timestamp: {
      fontSize: 12,
      opacity: 0.5,
  },
  content: {
      fontSize: 16,
      marginVertical: 4,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#ccc',
      paddingTop: 8,
  },
  likes: {
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 4
  },
  likesText: {
      fontSize: 12,
      opacity: 0.6
  },
  empty: {
      textAlign: 'center',
      marginTop: 20,
      opacity: 0.5,
  }
});
