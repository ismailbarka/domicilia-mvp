import * as Haptics from 'expo-haptics';
import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FilterButton from './filter-button';

const FiltersScrollView = memo(function FiltersScrollView({
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
        <FilterButton
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onPress={handleClick}
        />
      ))}
    </ScrollView>
  );
});

export default FiltersScrollView;

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
