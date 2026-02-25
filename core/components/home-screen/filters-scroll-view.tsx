import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function FiltersScrollView({
  filterCategories,
  selectedCategory,
  setSelectedCategory
}: {
  filterCategories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
}) {
  const handleClick = useCallback(
    (category: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      setSelectedCategory(category);
    },
    [setSelectedCategory]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterScrollContent}
      style={styles.filterScroll}
    >
      {filterCategories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterButton,
            selectedCategory === category && styles.filterButtonSelected
          ]}
          onPress={() => handleClick(category)}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === category && styles.filterTextSelected
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterScroll: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  filterTextSelected: {
    color: 'white'
  }
});
