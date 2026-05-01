import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
export type StudentMenuFilter = 'all' | 'suggestions' | 'services' | 'requests';

const FILTERS: Array<{ id: StudentMenuFilter; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'suggestions', label: 'Suggestions', icon: 'search' },
  { id: 'services', label: 'Services', icon: 'grid' },
  { id: 'requests', label: 'My Requests', icon: 'document-text' },
];

type StudentTopFiltersProps = {
  activeFilter: StudentMenuFilter;
  onSelect: (filter: StudentMenuFilter) => void;
  style?: object;
};

export default function StudentTopFilters({ activeFilter, onSelect, style }: StudentTopFiltersProps) {
  const router = useRouter();

  return (
    <View style={[styles.filterRowWrap, style]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowContent}>
        {FILTERS.map((item) => {
          const isActive = activeFilter === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => {
                    if (item.id === "requests") {
                          router.push("/requests");
                      } else if (item.id === "services") {
                    router.push("/StServices");
                     } else if (item.id === "suggestions") {
                    router.push("/(student_space)/suggestions");
                     }else {
                        onSelect(item.id);
                    }
}}
            >
              <Ionicons
                name={item.icon}
                size={12}
                color={isActive ? '#FFFFFF' : '#64748B'}
                style={styles.filterChipIcon}
              />
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterRowWrap: {
    marginTop: 8,
    marginBottom: 14,
  },
  filterRowContent: {
    paddingRight: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#1E1B6B',
    borderColor: '#1E1B6B',
  },
  filterChipIcon: {
    marginRight: 5,
  },
  filterChipText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
});
